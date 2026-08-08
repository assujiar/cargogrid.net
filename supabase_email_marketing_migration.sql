-- =============================================================================
-- CargoGrid OS — email marketing / blasting
-- =============================================================================
-- Run once in Supabase Dashboard > SQL Editor, AFTER supabase_migration.sql and
-- supabase_admin_access.sql (this file depends on public.is_admin() and on the
-- public.update_modified_column() trigger function both existing already).
-- Safe to re-run: every object is created with IF NOT EXISTS / OR REPLACE.
--
-- WHAT THIS ADDS
--   A full outbound marketing stack on top of the SMTP relay the site already
--   uses for transactional mail: contact lists with groups and tags, reusable
--   HTML templates, campaigns, a throttled send queue, and per-recipient
--   open/click/bounce/unsubscribe tracking.
--
-- THE THREE DESIGN DECISIONS THAT MATTER
--
-- 1. Sending is a *queue*, not a loop.
--    A blast never sends inside the request that starts it. queue_email_campaign
--    materialises one row per recipient with its own `scheduled_for`, spread at
--    the campaign's hourly rate (25/hour by default — 1 message every 144s).
--    A worker drains whatever is due. That is what makes the rate limit hold
--    across restarts, redeploys and overlapping cron runs, and it is what lets
--    a campaign be paused, resumed or cancelled mid-flight.
--
-- 2. The worker authenticates with a hashed key, not with the service role.
--    The dispatcher runs from cron, so it has no admin session to borrow — but
--    handing it the Supabase secret key would give a mail sender the right to
--    bypass RLS on every table in the database. Instead the dispatch RPCs take
--    a shared secret whose SHA-256 lives in email_worker_keys, and they are the
--    only privileged surface it can reach. Same reasoning as the rest of this
--    schema: least privilege, granted in SQL only.
--
-- 3. Tracking endpoints are token-scoped, never id-scoped.
--    An open pixel and an unsubscribe link are public URLs by definition. They
--    carry a 128-bit random per-recipient token, so the worst a stranger can do
--    with a guessed URL is mark their own message read. No row id, no email
--    address and no campaign id ever appears in a link that leaves the server.
-- =============================================================================


-- =============================================================================
-- SECTION 1 — TABLES
-- =============================================================================

-- Random opaque token for anything that ends up inside a public URL.
-- 16 bytes = 128 bits, the same order of entropy as a UUIDv4, rendered as hex
-- so it survives being pasted into a query string by any mail client.
CREATE OR REPLACE FUNCTION public.email_random_token()
RETURNS TEXT
LANGUAGE sql
VOLATILE
SET search_path = ''
AS $$ SELECT encode(extensions.gen_random_bytes(16), 'hex'); $$;


-- -----------------------------------------------------------------------------
-- 1.1 Contacts
-- -----------------------------------------------------------------------------
-- One row per address, ever. Re-importing the same CSV updates in place rather
-- than duplicating, because a list with the same person on it three times bills
-- you three times and gets reported as spam three times.
CREATE TABLE IF NOT EXISTS public.email_contacts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email              VARCHAR(255) NOT NULL UNIQUE,
  name               VARCHAR(160),
  company            VARCHAR(160),
  phone              VARCHAR(40),
  job_role           VARCHAR(120),
  lang               VARCHAR(5) NOT NULL DEFAULT 'id',

  -- 'subscribed' is the only status that will ever receive a blast. The other
  -- four are all terminal until an admin deliberately reverses them.
  status             VARCHAR(20) NOT NULL DEFAULT 'subscribed'
                     CHECK (status IN ('subscribed','unsubscribed','bounced','complained','cleaned')),
  source             VARCHAR(40) NOT NULL DEFAULT 'manual',

  tags               TEXT[]  NOT NULL DEFAULT '{}',
  -- Anything the CSV carried that has no column here. Surfaces in the composer
  -- as {{merge_tags}} so a campaign can personalise on fields we never modelled.
  custom_fields      JSONB   NOT NULL DEFAULT '{}'::jsonb,

  -- Stable across campaigns: this is the address-level opt-out, used by the
  -- List-Unsubscribe header on transactional-style sends that have no campaign.
  unsubscribe_token  TEXT NOT NULL UNIQUE DEFAULT public.email_random_token(),
  unsubscribed_at    TIMESTAMPTZ,
  unsubscribe_reason TEXT,

  bounce_count       INTEGER NOT NULL DEFAULT 0,
  complaint_count    INTEGER NOT NULL DEFAULT 0,
  sent_count         INTEGER NOT NULL DEFAULT 0,
  open_count         INTEGER NOT NULL DEFAULT 0,
  click_count        INTEGER NOT NULL DEFAULT 0,
  last_sent_at       TIMESTAMPTZ,
  last_opened_at     TIMESTAMPTZ,
  last_clicked_at    TIMESTAMPTZ,

  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS email_contacts_status_idx  ON public.email_contacts (status);
CREATE INDEX IF NOT EXISTS email_contacts_created_idx ON public.email_contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS email_contacts_tags_idx    ON public.email_contacts USING GIN (tags);


-- -----------------------------------------------------------------------------
-- 1.2 Groups (static lists) and membership
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(120) NOT NULL,
  description TEXT,
  color       VARCHAR(20) NOT NULL DEFAULT 'teal',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case-insensitive uniqueness: "Forwarder Jakarta" and "forwarder jakarta" are
-- the same list, and discovering that only after two half-populated groups
-- exist is a data-cleanup job nobody volunteers for.
CREATE UNIQUE INDEX IF NOT EXISTS email_groups_name_key ON public.email_groups (lower(name));

CREATE TABLE IF NOT EXISTS public.email_group_members (
  group_id   UUID NOT NULL REFERENCES public.email_groups(id)   ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.email_contacts(id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (group_id, contact_id)
);

CREATE INDEX IF NOT EXISTS email_group_members_contact_idx ON public.email_group_members (contact_id);


-- -----------------------------------------------------------------------------
-- 1.3 Templates
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_templates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(160) NOT NULL,
  subject    TEXT NOT NULL DEFAULT '',
  preheader  TEXT,
  html       TEXT NOT NULL DEFAULT '',
  category   VARCHAR(60) NOT NULL DEFAULT 'general',
  is_builtin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- -----------------------------------------------------------------------------
-- 1.4 Campaigns
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200) NOT NULL,
  subject       TEXT NOT NULL DEFAULT '',
  preheader     TEXT,
  html          TEXT NOT NULL DEFAULT '',
  from_name     VARCHAR(120),
  from_email    VARCHAR(255),
  reply_to      VARCHAR(255),
  template_id   UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,

  status        VARCHAR(20) NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','scheduled','sending','paused','sent','cancelled','failed')),
  scheduled_at  TIMESTAMPTZ,
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,

  -- The throttle. 25/hour is the default the business asked for; the ceiling is
  -- deliberately low (500) because this sends over one authenticated mailbox,
  -- not a dedicated IP, and shared-mailbox providers start rejecting long
  -- before that.
  rate_per_hour INTEGER NOT NULL DEFAULT 25 CHECK (rate_per_hour BETWEEN 1 AND 500),

  track_opens   BOOLEAN NOT NULL DEFAULT TRUE,
  track_clicks  BOOLEAN NOT NULL DEFAULT TRUE,

  -- Audience is stored as intent, not as a frozen list, so the composer can
  -- re-count it live while the campaign is still a draft. It is resolved to
  -- actual rows exactly once, by queue_email_campaign().
  audience_all         BOOLEAN NOT NULL DEFAULT FALSE,
  audience_group_ids   UUID[]  NOT NULL DEFAULT '{}',
  audience_tags        TEXT[]  NOT NULL DEFAULT '{}',
  audience_contact_ids UUID[]  NOT NULL DEFAULT '{}',

  total_recipients   INTEGER NOT NULL DEFAULT 0,
  sent_count         INTEGER NOT NULL DEFAULT 0,
  failed_count       INTEGER NOT NULL DEFAULT 0,
  bounced_count      INTEGER NOT NULL DEFAULT 0,
  opened_count       INTEGER NOT NULL DEFAULT 0,
  clicked_count      INTEGER NOT NULL DEFAULT 0,
  unsubscribed_count INTEGER NOT NULL DEFAULT 0,
  complained_count   INTEGER NOT NULL DEFAULT 0,

  spam_score      NUMERIC(4,1),
  spam_report     JSONB,
  spam_checked_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS email_campaigns_status_idx  ON public.email_campaigns (status);
CREATE INDEX IF NOT EXISTS email_campaigns_created_idx ON public.email_campaigns (created_at DESC);


-- -----------------------------------------------------------------------------
-- 1.5 The send queue
-- -----------------------------------------------------------------------------
-- One row per (campaign, address). This is both the work queue and the
-- per-recipient tracking record — keeping them in one row is what makes
-- "who opened it" a single index scan rather than an aggregate over an
-- event table.
CREATE TABLE IF NOT EXISTS public.email_campaign_recipients (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  contact_id   UUID REFERENCES public.email_contacts(id) ON DELETE SET NULL,
  email        VARCHAR(255) NOT NULL,
  name         VARCHAR(160),
  -- Snapshot of the merge fields as they were when the campaign was queued, so
  -- a contact edited mid-blast does not change what half the list receives.
  merge_data   JSONB NOT NULL DEFAULT '{}'::jsonb,

  status       VARCHAR(20) NOT NULL DEFAULT 'queued'
               CHECK (status IN ('queued','sending','sent','failed','bounced','skipped','cancelled')),
  send_order   INTEGER NOT NULL DEFAULT 0,
  batch_index  INTEGER NOT NULL DEFAULT 0,
  scheduled_for TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  claimed_at   TIMESTAMPTZ,
  sent_at      TIMESTAMPTZ,
  failed_at    TIMESTAMPTZ,
  attempts     INTEGER NOT NULL DEFAULT 0,
  last_error   TEXT,
  message_id   TEXT,

  token        TEXT NOT NULL UNIQUE DEFAULT public.email_random_token(),

  open_count      INTEGER NOT NULL DEFAULT 0,
  first_opened_at TIMESTAMPTZ,
  last_opened_at  TIMESTAMPTZ,
  click_count     INTEGER NOT NULL DEFAULT 0,
  first_clicked_at TIMESTAMPTZ,
  last_clicked_at  TIMESTAMPTZ,
  unsubscribed_at  TIMESTAMPTZ,
  bounced_at       TIMESTAMPTZ,
  bounce_type      VARCHAR(10) CHECK (bounce_type IN ('hard','soft')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- The same person cannot be queued twice in one campaign, whichever group or
  -- tag pulled them in.
  UNIQUE (campaign_id, email)
);

-- The dispatcher's hot path: "what is due, for a campaign that is sending".
CREATE INDEX IF NOT EXISTS email_recipients_due_idx
  ON public.email_campaign_recipients (campaign_id, scheduled_for)
  WHERE status = 'queued';

-- The rate-limit probe: "how many went out in the last hour".
CREATE INDEX IF NOT EXISTS email_recipients_sent_at_idx
  ON public.email_campaign_recipients (campaign_id, sent_at)
  WHERE sent_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS email_recipients_status_idx  ON public.email_campaign_recipients (status);
CREATE INDEX IF NOT EXISTS email_recipients_contact_idx ON public.email_campaign_recipients (contact_id);


-- -----------------------------------------------------------------------------
-- 1.6 Raw event log
-- -----------------------------------------------------------------------------
-- The recipient row carries the counters; this carries the history behind them
-- (every open, every click with its URL). Kept separate because it grows at a
-- different rate and is only read by the analytics screen.
CREATE TABLE IF NOT EXISTS public.email_events (
  id           BIGSERIAL PRIMARY KEY,
  campaign_id  UUID REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.email_campaign_recipients(id) ON DELETE CASCADE,
  contact_id   UUID REFERENCES public.email_contacts(id) ON DELETE SET NULL,
  type         VARCHAR(20) NOT NULL
               CHECK (type IN ('queued','sent','failed','open','click','bounce','unsubscribe','complaint')),
  url          TEXT,
  user_agent   TEXT,
  -- Hashed, never raw: an IP address is personal data under UU PDP 27/2022 and
  -- we only need it to tell two opens apart, not to identify anyone.
  ip_hash      TEXT,
  detail       TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS email_events_campaign_idx ON public.email_events (campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS email_events_type_idx     ON public.email_events (type, created_at DESC);


-- -----------------------------------------------------------------------------
-- 1.7 Global suppression list
-- -----------------------------------------------------------------------------
-- Separate from email_contacts.status on purpose: an address that hard-bounced
-- or complained must stay suppressed even if it is later re-imported from a
-- fresh CSV as a shiny new "subscribed" contact. This table is what makes
-- re-import safe.
CREATE TABLE IF NOT EXISTS public.email_suppressions (
  email      VARCHAR(255) PRIMARY KEY,
  reason     VARCHAR(30) NOT NULL CHECK (reason IN ('unsubscribe','bounce','complaint','manual')),
  detail     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- -----------------------------------------------------------------------------
-- 1.8 Worker keys
-- -----------------------------------------------------------------------------
-- Only the SHA-256 is stored. A leaked database backup therefore does not leak
-- a working dispatch credential.
CREATE TABLE IF NOT EXISTS public.email_worker_keys (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label        VARCHAR(120),
  key_hash     TEXT NOT NULL UNIQUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  revoked_at   TIMESTAMPTZ
);


-- -----------------------------------------------------------------------------
-- 1.9 updated_at triggers (reuses the function from supabase_migration.sql)
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS set_timestamp ON public.email_contacts;
CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.email_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS set_timestamp ON public.email_groups;
CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.email_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS set_timestamp ON public.email_templates;
CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS set_timestamp ON public.email_campaigns;
CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


-- =============================================================================
-- SECTION 2 — ROW LEVEL SECURITY
-- =============================================================================
-- Every table here is admin-only. Anonymous visitors reach exactly three things
-- in this schema, all through SECURITY DEFINER functions in section 5, all
-- keyed on a token they were handed inside their own email: open, click,
-- unsubscribe.

ALTER TABLE public.email_contacts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_groups               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_group_members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_recipients  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_suppressions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_worker_keys          ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin: email contacts"    ON public.email_contacts;
CREATE POLICY "Admin: email contacts" ON public.email_contacts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin: email groups"      ON public.email_groups;
CREATE POLICY "Admin: email groups" ON public.email_groups
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin: email group members" ON public.email_group_members;
CREATE POLICY "Admin: email group members" ON public.email_group_members
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin: email templates"   ON public.email_templates;
CREATE POLICY "Admin: email templates" ON public.email_templates
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin: email campaigns"   ON public.email_campaigns;
CREATE POLICY "Admin: email campaigns" ON public.email_campaigns
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin: email recipients"  ON public.email_campaign_recipients;
CREATE POLICY "Admin: email recipients" ON public.email_campaign_recipients
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin: email events"      ON public.email_events;
CREATE POLICY "Admin: email events" ON public.email_events
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin: email suppressions" ON public.email_suppressions;
CREATE POLICY "Admin: email suppressions" ON public.email_suppressions
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- email_worker_keys gets RLS with NO policy at all: not even an admin session
-- can read the hashes through PostgREST. Keys are minted and revoked in the SQL
-- editor, the same way admin membership is.


-- =============================================================================
-- SECTION 3 — ADMIN RPCs (SECURITY INVOKER: RLS above is the access control)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 3.1 Bulk contact import
-- -----------------------------------------------------------------------------
-- One round trip for a whole CSV. p_rows is a JSON array of
--   {email, name, company, phone, job_role, lang, tags[], custom_fields{}}
-- Existing addresses are updated, never duplicated, and never resurrected: a
-- contact that unsubscribed stays unsubscribed no matter what the CSV claims.
CREATE OR REPLACE FUNCTION public.import_email_contacts(
  p_rows      JSONB,
  p_group_ids UUID[] DEFAULT '{}',
  p_tags      TEXT[] DEFAULT '{}',
  p_source    TEXT   DEFAULT 'csv'
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_inserted INTEGER := 0;
  v_updated  INTEGER := 0;
  v_skipped  INTEGER := 0;
  v_ids      UUID[]  := '{}';
  v_row      JSONB;
  v_email    TEXT;
  v_id       UUID;
  v_existed  BOOLEAN;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  FOR v_row IN SELECT * FROM jsonb_array_elements(COALESCE(p_rows, '[]'::jsonb))
  LOOP
    v_email := lower(trim(COALESCE(v_row->>'email', '')));

    -- Cheap structural check only. Real validation is delivery: a syntactically
    -- perfect address at a dead domain still bounces, and a regex strict enough
    -- to matter rejects addresses that are legal.
    IF v_email = '' OR v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$' THEN
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;

    SELECT EXISTS (SELECT 1 FROM public.email_contacts WHERE email = v_email) INTO v_existed;

    INSERT INTO public.email_contacts (email, name, company, phone, job_role, lang, source, tags, custom_fields)
    VALUES (
      left(v_email, 255),
      NULLIF(left(trim(COALESCE(v_row->>'name', '')), 160), ''),
      NULLIF(left(trim(COALESCE(v_row->>'company', '')), 160), ''),
      NULLIF(left(trim(COALESCE(v_row->>'phone', '')), 40), ''),
      NULLIF(left(trim(COALESCE(v_row->>'job_role', '')), 120), ''),
      COALESCE(NULLIF(left(v_row->>'lang', 5), ''), 'id'),
      left(COALESCE(p_source, 'csv'), 40),
      (
        SELECT COALESCE(array_agg(DISTINCT t), '{}')
        FROM unnest(
          COALESCE(ARRAY(SELECT jsonb_array_elements_text(v_row->'tags')), '{}'::text[]) || COALESCE(p_tags, '{}')
        ) AS t
        WHERE t IS NOT NULL AND t <> ''
      ),
      COALESCE(v_row->'custom_fields', '{}'::jsonb)
    )
    ON CONFLICT (email) DO UPDATE SET
      -- COALESCE the other way round from a normal upsert: a blank cell in the
      -- new CSV must not wipe a name we already had.
      name          = COALESCE(EXCLUDED.name, public.email_contacts.name),
      company       = COALESCE(EXCLUDED.company, public.email_contacts.company),
      phone         = COALESCE(EXCLUDED.phone, public.email_contacts.phone),
      job_role      = COALESCE(EXCLUDED.job_role, public.email_contacts.job_role),
      tags          = (
        SELECT COALESCE(array_agg(DISTINCT t), '{}')
        FROM unnest(public.email_contacts.tags || EXCLUDED.tags) AS t
        WHERE t IS NOT NULL AND t <> ''
      ),
      custom_fields = public.email_contacts.custom_fields || EXCLUDED.custom_fields,
      updated_at    = NOW()
    RETURNING id INTO v_id;

    v_ids := v_ids || v_id;
    IF v_existed THEN v_updated := v_updated + 1; ELSE v_inserted := v_inserted + 1; END IF;
  END LOOP;

  IF array_length(p_group_ids, 1) > 0 AND array_length(v_ids, 1) > 0 THEN
    INSERT INTO public.email_group_members (group_id, contact_id)
    SELECT g, c FROM unnest(p_group_ids) g CROSS JOIN unnest(v_ids) c
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN jsonb_build_object('inserted', v_inserted, 'updated', v_updated, 'skipped', v_skipped);
END;
$$;


-- -----------------------------------------------------------------------------
-- 3.2 Pull the site's own leads into the contact list
-- -----------------------------------------------------------------------------
-- The inquiries and tool_leads tables are already a permission-based list —
-- these people typed their address into a form on this site. Importing them is
-- one button rather than a CSV export/import round trip.
CREATE OR REPLACE FUNCTION public.import_email_contacts_from_leads(
  p_source    TEXT   DEFAULT 'all',
  p_group_ids UUID[] DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_rows JSONB := '[]'::jsonb;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  IF p_source IN ('all', 'inquiries') THEN
    SELECT v_rows || COALESCE(jsonb_agg(jsonb_build_object(
      'email', i.email, 'name', i.name, 'company', i.company,
      'phone', i.phone, 'job_role', i.role, 'lang', COALESCE(i.lang, 'id'),
      'tags', jsonb_build_array('inquiry', COALESCE(i.company_type, 'unknown'))
    )), '[]'::jsonb)
    INTO v_rows FROM public.inquiries i;
  END IF;

  IF p_source IN ('all', 'tool_leads') THEN
    SELECT v_rows || COALESCE(jsonb_agg(jsonb_build_object(
      'email', t.email, 'name', t.name, 'company', t.company,
      'phone', t.phone, 'lang', COALESCE(t.lang, 'id'),
      'tags', jsonb_build_array('tool-lead') ||
              COALESCE(to_jsonb(t.tools_used), '[]'::jsonb)
    )), '[]'::jsonb)
    INTO v_rows FROM public.tool_leads t;
  END IF;

  RETURN public.import_email_contacts(v_rows, p_group_ids, '{}', 'lead-import');
END;
$$;


-- -----------------------------------------------------------------------------
-- 3.3 Audience preview — how many people would this campaign actually reach?
-- -----------------------------------------------------------------------------
-- Same predicate as queue_email_campaign, so the number the composer shows is
-- the number that gets queued. Suppressed and unsubscribed addresses are
-- excluded here too, which is why "2,000 contacts" and "1,847 recipients" can
-- legitimately differ.
CREATE OR REPLACE FUNCTION public.count_email_audience(
  p_all         BOOLEAN,
  p_group_ids   UUID[],
  p_tags        TEXT[],
  p_contact_ids UUID[]
)
RETURNS INTEGER
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT count(*)::INTEGER
  FROM public.email_contacts c
  WHERE c.status = 'subscribed'
    AND NOT EXISTS (SELECT 1 FROM public.email_suppressions s WHERE s.email = c.email)
    AND (
      COALESCE(p_all, FALSE)
      OR (COALESCE(array_length(p_contact_ids, 1), 0) > 0 AND c.id = ANY(p_contact_ids))
      OR (COALESCE(array_length(p_tags, 1), 0) > 0 AND c.tags && p_tags)
      OR (COALESCE(array_length(p_group_ids, 1), 0) > 0 AND EXISTS (
            SELECT 1 FROM public.email_group_members m
            WHERE m.contact_id = c.id AND m.group_id = ANY(p_group_ids)))
    );
$$;


-- -----------------------------------------------------------------------------
-- 3.4 Queue a campaign
-- -----------------------------------------------------------------------------
-- This is where the rate limit is actually expressed. Recipient N is scheduled
-- N * (3600 / rate) seconds after the start, so a 25/hour campaign sends one
-- message every 2m24s rather than 25 at the top of the hour and then nothing.
-- batch_index groups them into the hourly batches the UI reports against.
--
-- Trickling beats bursting for one concrete reason: a shared SMTP mailbox that
-- receives 25 connections in ten seconds looks like a compromised account to
-- the provider, and looks like a spam run to the receiving MTA. The same 25
-- messages spread over the hour look like a person.
CREATE OR REPLACE FUNCTION public.queue_email_campaign(
  p_campaign_id UUID,
  p_start_at    TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_c       public.email_campaigns%ROWTYPE;
  v_start   TIMESTAMPTZ;
  v_queued  INTEGER;
  v_spacing NUMERIC;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  SELECT * INTO v_c FROM public.email_campaigns WHERE id = p_campaign_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'campaign not found';
  END IF;
  IF v_c.status NOT IN ('draft','scheduled','cancelled','failed') THEN
    RAISE EXCEPTION 'campaign is already % — pause and cancel it before re-queueing', v_c.status;
  END IF;
  IF coalesce(trim(v_c.subject), '') = '' OR coalesce(trim(v_c.html), '') = '' THEN
    RAISE EXCEPTION 'campaign needs a subject and a body before it can be queued';
  END IF;

  v_start   := GREATEST(COALESCE(p_start_at, v_c.scheduled_at, NOW()), NOW());
  v_spacing := 3600.0 / v_c.rate_per_hour;

  -- Re-queueing after a cancel starts from a clean slate; rows already sent are
  -- kept so the history and the tracking links survive.
  DELETE FROM public.email_campaign_recipients
   WHERE campaign_id = p_campaign_id AND status IN ('queued','cancelled','skipped');

  WITH audience AS (
    SELECT c.*
    FROM public.email_contacts c
    WHERE c.status = 'subscribed'
      AND NOT EXISTS (SELECT 1 FROM public.email_suppressions s WHERE s.email = c.email)
      AND (
        v_c.audience_all
        OR (COALESCE(array_length(v_c.audience_contact_ids, 1), 0) > 0 AND c.id = ANY(v_c.audience_contact_ids))
        OR (COALESCE(array_length(v_c.audience_tags, 1), 0) > 0 AND c.tags && v_c.audience_tags)
        OR (COALESCE(array_length(v_c.audience_group_ids, 1), 0) > 0 AND EXISTS (
              SELECT 1 FROM public.email_group_members m
              WHERE m.contact_id = c.id AND m.group_id = ANY(v_c.audience_group_ids)))
      )
  ), ordered AS (
    SELECT a.*, (row_number() OVER (ORDER BY a.created_at, a.email)) - 1 AS rn FROM audience a
  )
  INSERT INTO public.email_campaign_recipients
    (campaign_id, contact_id, email, name, merge_data, send_order, batch_index, scheduled_for)
  SELECT
    p_campaign_id, o.id, o.email, o.name,
    jsonb_strip_nulls(jsonb_build_object(
      'name', o.name, 'email', o.email, 'company', o.company,
      'phone', o.phone, 'job_role', o.job_role, 'lang', o.lang
    )) || COALESCE(o.custom_fields, '{}'::jsonb),
    o.rn,
    (o.rn / v_c.rate_per_hour)::INTEGER,
    v_start + make_interval(secs => o.rn * v_spacing)
  FROM ordered o
  ON CONFLICT (campaign_id, email) DO NOTHING;

  GET DIAGNOSTICS v_queued = ROW_COUNT;

  UPDATE public.email_campaigns SET
    total_recipients = (SELECT count(*) FROM public.email_campaign_recipients WHERE campaign_id = p_campaign_id),
    scheduled_at     = v_start,
    -- 'sending' immediately when the start time is now, so the first batch does
    -- not wait for the next cron tick to even become eligible.
    status           = CASE WHEN v_start <= NOW() THEN 'sending' ELSE 'scheduled' END,
    started_at       = CASE WHEN v_start <= NOW() THEN COALESCE(v_c.started_at, NOW()) ELSE NULL END,
    completed_at     = NULL,
    updated_at       = NOW()
  WHERE id = p_campaign_id;

  RETURN jsonb_build_object(
    'queued', v_queued,
    'start_at', v_start,
    'batches', CEIL(v_queued::NUMERIC / v_c.rate_per_hour),
    'rate_per_hour', v_c.rate_per_hour,
    'estimated_finish', v_start + make_interval(secs => GREATEST(v_queued - 1, 0) * v_spacing)
  );
END;
$$;


-- -----------------------------------------------------------------------------
-- 3.5 Pause / resume / cancel
-- -----------------------------------------------------------------------------
-- Pause is instant and lossless: the dispatcher only ever looks at campaigns in
-- 'sending', so flipping the status is enough — nothing in flight is lost, and
-- the queue keeps its position.
CREATE OR REPLACE FUNCTION public.set_email_campaign_state(
  p_campaign_id UUID,
  p_action      TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_c       public.email_campaigns%ROWTYPE;
  v_pending INTEGER;
  v_spacing NUMERIC;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  SELECT * INTO v_c FROM public.email_campaigns WHERE id = p_campaign_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'campaign not found'; END IF;

  IF p_action = 'pause' THEN
    UPDATE public.email_campaigns SET status = 'paused', updated_at = NOW()
     WHERE id = p_campaign_id AND status IN ('sending','scheduled');

  ELSIF p_action = 'resume' THEN
    -- Re-spread whatever is left from now, otherwise every remaining slot is in
    -- the past and the queue drains as fast as the hourly cap allows instead of
    -- at the pace the campaign was configured for.
    v_spacing := 3600.0 / v_c.rate_per_hour;
    WITH pending AS (
      SELECT id, (row_number() OVER (ORDER BY send_order)) - 1 AS rn
      FROM public.email_campaign_recipients
      WHERE campaign_id = p_campaign_id AND status = 'queued'
    )
    UPDATE public.email_campaign_recipients r
       SET scheduled_for = NOW() + make_interval(secs => p.rn * v_spacing),
           batch_index   = (p.rn / v_c.rate_per_hour)::INTEGER
      FROM pending p WHERE r.id = p.id;

    UPDATE public.email_campaigns
       SET status = 'sending', started_at = COALESCE(started_at, NOW()), completed_at = NULL, updated_at = NOW()
     WHERE id = p_campaign_id;

  ELSIF p_action = 'cancel' THEN
    UPDATE public.email_campaign_recipients
       SET status = 'cancelled'
     WHERE campaign_id = p_campaign_id AND status IN ('queued','sending');
    UPDATE public.email_campaigns
       SET status = 'cancelled', completed_at = NOW(), updated_at = NOW()
     WHERE id = p_campaign_id;

  ELSE
    RAISE EXCEPTION 'unknown action %', p_action;
  END IF;

  SELECT count(*) INTO v_pending
    FROM public.email_campaign_recipients
   WHERE campaign_id = p_campaign_id AND status = 'queued';

  RETURN jsonb_build_object('action', p_action, 'pending', v_pending);
END;
$$;


-- -----------------------------------------------------------------------------
-- 3.6 Manual suppression / resubscribe
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_email_contact_status(
  p_contact_id UUID,
  p_status     TEXT,
  p_reason     TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE v_email TEXT;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'not authorised'; END IF;

  UPDATE public.email_contacts
     SET status             = p_status,
         unsubscribed_at    = CASE WHEN p_status = 'subscribed' THEN NULL ELSE COALESCE(unsubscribed_at, NOW()) END,
         unsubscribe_reason = CASE WHEN p_status = 'subscribed' THEN NULL ELSE p_reason END,
         updated_at         = NOW()
   WHERE id = p_contact_id
   RETURNING email INTO v_email;

  IF v_email IS NULL THEN RETURN; END IF;

  IF p_status = 'subscribed' THEN
    -- Re-subscribing has to clear the suppression too, or the contact looks
    -- active in the UI and is silently dropped at queue time.
    DELETE FROM public.email_suppressions WHERE email = v_email;
  ELSE
    INSERT INTO public.email_suppressions (email, reason, detail)
    VALUES (v_email,
            CASE p_status WHEN 'bounced' THEN 'bounce' WHEN 'complained' THEN 'complaint'
                          WHEN 'unsubscribed' THEN 'unsubscribe' ELSE 'manual' END,
            p_reason)
    ON CONFLICT (email) DO UPDATE SET reason = EXCLUDED.reason, detail = EXCLUDED.detail;
  END IF;
END;
$$;


-- =============================================================================
-- SECTION 4 — WORKER RPCs (SECURITY DEFINER, shared-secret authenticated)
-- =============================================================================

-- Verifies the dispatcher's shared secret. Deliberately not granted to anon or
-- authenticated: it is only ever called from inside the SECURITY DEFINER
-- functions below, which run as the owner and so do not need the grant.
CREATE OR REPLACE FUNCTION public.email_worker_ok(p_secret TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id UUID;
BEGIN
  IF p_secret IS NULL OR length(p_secret) < 24 THEN RETURN FALSE; END IF;

  SELECT id INTO v_id FROM public.email_worker_keys
   WHERE key_hash = encode(sha256(convert_to(p_secret, 'UTF8')), 'hex')
     AND revoked_at IS NULL;

  IF v_id IS NULL THEN RETURN FALSE; END IF;

  UPDATE public.email_worker_keys SET last_used_at = NOW() WHERE id = v_id;
  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.email_worker_ok(TEXT) FROM PUBLIC, anon, authenticated;


-- Mint a dispatch key. Run from the SQL editor (which connects as postgres);
-- it is revoked from every application role on purpose, exactly like admin
-- membership in supabase_admin_access.sql.
--   SELECT public.register_email_worker_key('<32+ random chars>', 'vercel-cron');
CREATE OR REPLACE FUNCTION public.register_email_worker_key(p_secret TEXT, p_label TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id UUID;
BEGIN
  IF p_secret IS NULL OR length(p_secret) < 24 THEN
    RAISE EXCEPTION 'worker secret must be at least 24 characters';
  END IF;

  INSERT INTO public.email_worker_keys (label, key_hash)
  VALUES (COALESCE(p_label, 'dispatcher'), encode(sha256(convert_to(p_secret, 'UTF8')), 'hex'))
  ON CONFLICT (key_hash) DO UPDATE SET revoked_at = NULL, label = EXCLUDED.label
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.register_email_worker_key(TEXT, TEXT) FROM PUBLIC, anon, authenticated;


-- -----------------------------------------------------------------------------
-- 4.1 Claim the next slice of due work
-- -----------------------------------------------------------------------------
-- Everything about not sending the same email twice lives in this function.
--
--   * An advisory transaction lock makes two overlapping cron runs a no-op for
--     the second one, rather than a race.
--   * The final UPDATE re-checks status = 'queued'. Under READ COMMITTED that
--     re-check runs against the row version the other transaction just wrote,
--     so a row claimed elsewhere is filtered out instead of being claimed twice.
--   * Claims older than 15 minutes are returned to the queue, so a worker that
--     dies mid-send does not strand its batch forever.
--
-- The hourly allowance is computed from rows actually sent in the last 60
-- minutes, not from a counter. That is the version that stays correct across a
-- redeploy, a manual re-run, or a campaign that was paused and resumed.
CREATE OR REPLACE FUNCTION public.claim_due_email_recipients(
  p_secret TEXT,
  p_limit  INTEGER DEFAULT 10
)
RETURNS TABLE (
  id          UUID,
  campaign_id UUID,
  contact_id  UUID,
  email       TEXT,
  name        TEXT,
  merge_data  JSONB,
  token       TEXT,
  attempts    INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.email_worker_ok(p_secret) THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  IF NOT pg_try_advisory_xact_lock(hashtext('cargogrid.email.dispatch')) THEN
    RETURN;
  END IF;

  UPDATE public.email_campaign_recipients
     SET status = 'queued', claimed_at = NULL
   WHERE status = 'sending' AND claimed_at < NOW() - INTERVAL '15 minutes';

  UPDATE public.email_campaigns
     SET status = 'sending', started_at = COALESCE(started_at, NOW()), updated_at = NOW()
   WHERE status = 'scheduled' AND scheduled_at <= NOW();

  RETURN QUERY
  WITH sending AS (
    SELECT c.id,
           GREATEST(0, c.rate_per_hour - (
             SELECT count(*) FROM public.email_campaign_recipients r2
              WHERE r2.campaign_id = c.id AND r2.sent_at > NOW() - INTERVAL '1 hour'
           ))::INTEGER AS allowance
      FROM public.email_campaigns c
     WHERE c.status = 'sending'
  ), candidates AS (
    SELECT r.id AS rid,
           row_number() OVER (PARTITION BY r.campaign_id ORDER BY r.scheduled_for, r.send_order) AS rn,
           s.allowance
      FROM public.email_campaign_recipients r
      JOIN sending s ON s.id = r.campaign_id
     WHERE r.status = 'queued'
       AND r.scheduled_for <= NOW()
       AND s.allowance > 0
  ), picked AS (
    SELECT rid FROM candidates WHERE rn <= allowance ORDER BY rid LIMIT GREATEST(p_limit, 1)
  )
  UPDATE public.email_campaign_recipients r
     SET status = 'sending', claimed_at = NOW(), attempts = r.attempts + 1
    FROM picked p
   WHERE r.id = p.rid
     AND r.status = 'queued'
  RETURNING r.id, r.campaign_id, r.contact_id, r.email::TEXT, r.name::TEXT, r.merge_data, r.token, r.attempts;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_due_email_recipients(TEXT, INTEGER) FROM PUBLIC, anon, authenticated;


-- -----------------------------------------------------------------------------
-- 4.2 Fetch the campaign bodies for a claimed batch
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_email_campaigns_for_dispatch(
  p_secret TEXT,
  p_ids    UUID[]
)
RETURNS TABLE (
  id           UUID,
  name         TEXT,
  subject      TEXT,
  preheader    TEXT,
  html         TEXT,
  from_name    TEXT,
  from_email   TEXT,
  reply_to     TEXT,
  track_opens  BOOLEAN,
  track_clicks BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.email_worker_ok(p_secret) THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  RETURN QUERY
  SELECT c.id, c.name::TEXT, c.subject, c.preheader, c.html,
         c.from_name::TEXT, c.from_email::TEXT, c.reply_to::TEXT,
         c.track_opens, c.track_clicks
    FROM public.email_campaigns c
   WHERE c.id = ANY(p_ids);
END;
$$;

REVOKE ALL ON FUNCTION public.get_email_campaigns_for_dispatch(TEXT, UUID[]) FROM PUBLIC, anon, authenticated;


-- -----------------------------------------------------------------------------
-- 4.3 Report the outcome of a batch
-- -----------------------------------------------------------------------------
-- p_results is [{id, status, message_id, error, bounce_type}] where status is
-- one of sent | failed | bounced | retry. Applied in one transaction so the
-- counters on the campaign can never drift from the rows they summarise.
CREATE OR REPLACE FUNCTION public.report_email_dispatch(
  p_secret  TEXT,
  p_results JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_r        JSONB;
  v_id       UUID;
  v_status   TEXT;
  v_rec      public.email_campaign_recipients%ROWTYPE;
  v_sent     INTEGER := 0;
  v_failed   INTEGER := 0;
  v_bounced  INTEGER := 0;
  v_retried  INTEGER := 0;
  v_backoff  INTEGER;
BEGIN
  IF NOT public.email_worker_ok(p_secret) THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  FOR v_r IN SELECT * FROM jsonb_array_elements(COALESCE(p_results, '[]'::jsonb))
  LOOP
    v_id     := (v_r->>'id')::UUID;
    v_status := COALESCE(v_r->>'status', 'failed');

    SELECT * INTO v_rec FROM public.email_campaign_recipients WHERE id = v_id;
    CONTINUE WHEN NOT FOUND;

    IF v_status = 'sent' THEN
      UPDATE public.email_campaign_recipients
         SET status = 'sent', sent_at = NOW(), message_id = v_r->>'message_id', last_error = NULL
       WHERE id = v_id;
      UPDATE public.email_campaigns SET sent_count = sent_count + 1, updated_at = NOW() WHERE id = v_rec.campaign_id;
      UPDATE public.email_contacts SET sent_count = sent_count + 1, last_sent_at = NOW() WHERE id = v_rec.contact_id;
      INSERT INTO public.email_events (campaign_id, recipient_id, contact_id, type)
      VALUES (v_rec.campaign_id, v_id, v_rec.contact_id, 'sent');
      v_sent := v_sent + 1;

    ELSIF v_status = 'bounced' THEN
      UPDATE public.email_campaign_recipients
         SET status = 'bounced', bounced_at = NOW(),
             bounce_type = COALESCE(v_r->>'bounce_type', 'hard'),
             last_error = v_r->>'error'
       WHERE id = v_id;
      UPDATE public.email_campaigns SET bounced_count = bounced_count + 1, updated_at = NOW() WHERE id = v_rec.campaign_id;
      -- A hard bounce is a permanent verdict on the address, so it is removed
      -- from every future send, not just this one. Soft bounces only count.
      UPDATE public.email_contacts
         SET bounce_count = bounce_count + 1,
             status = CASE WHEN COALESCE(v_r->>'bounce_type', 'hard') = 'hard' THEN 'bounced' ELSE status END
       WHERE id = v_rec.contact_id;
      IF COALESCE(v_r->>'bounce_type', 'hard') = 'hard' THEN
        INSERT INTO public.email_suppressions (email, reason, detail)
        VALUES (v_rec.email, 'bounce', left(COALESCE(v_r->>'error', ''), 500))
        ON CONFLICT (email) DO NOTHING;
      END IF;
      INSERT INTO public.email_events (campaign_id, recipient_id, contact_id, type, detail)
      VALUES (v_rec.campaign_id, v_id, v_rec.contact_id, 'bounce', left(COALESCE(v_r->>'error', ''), 500));
      v_bounced := v_bounced + 1;

    ELSIF v_status = 'retry' AND v_rec.attempts < 3 THEN
      -- 5 / 25 / 125 minutes. A transient 4xx from a busy MTA clears in
      -- minutes; anything still failing on the fourth attempt is not transient.
      v_backoff := POWER(5, v_rec.attempts)::INTEGER;
      UPDATE public.email_campaign_recipients
         SET status = 'queued', claimed_at = NULL,
             scheduled_for = NOW() + make_interval(mins => v_backoff),
             last_error = v_r->>'error'
       WHERE id = v_id;
      v_retried := v_retried + 1;

    ELSE
      UPDATE public.email_campaign_recipients
         SET status = 'failed', failed_at = NOW(), last_error = v_r->>'error'
       WHERE id = v_id;
      UPDATE public.email_campaigns SET failed_count = failed_count + 1, updated_at = NOW() WHERE id = v_rec.campaign_id;
      INSERT INTO public.email_events (campaign_id, recipient_id, contact_id, type, detail)
      VALUES (v_rec.campaign_id, v_id, v_rec.contact_id, 'failed', left(COALESCE(v_r->>'error', ''), 500));
      v_failed := v_failed + 1;
    END IF;
  END LOOP;

  -- Close out anything with nothing left to do. Doing it here rather than on a
  -- timer means the campaign flips to "sent" the moment the last message lands.
  UPDATE public.email_campaigns c
     SET status = 'sent', completed_at = NOW(), updated_at = NOW()
   WHERE c.status = 'sending'
     AND NOT EXISTS (
       SELECT 1 FROM public.email_campaign_recipients r
        WHERE r.campaign_id = c.id AND r.status IN ('queued','sending')
     );

  RETURN jsonb_build_object('sent', v_sent, 'failed', v_failed, 'bounced', v_bounced, 'retried', v_retried);
END;
$$;

REVOKE ALL ON FUNCTION public.report_email_dispatch(TEXT, JSONB) FROM PUBLIC, anon, authenticated;


-- -----------------------------------------------------------------------------
-- 4.4 Asynchronous bounce feedback
-- -----------------------------------------------------------------------------
-- SMTP only tells us about rejections that happen during the conversation. A
-- mailbox that accepts the message and bounces it ten seconds later comes back
-- as a DSN to the return-path. This is the entry point for whatever forwards
-- those (a provider webhook, or a small script polling the bounce mailbox).
CREATE OR REPLACE FUNCTION public.record_email_bounce(
  p_secret TEXT,
  p_email  TEXT,
  p_type   TEXT DEFAULT 'hard',
  p_detail TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT := lower(trim(p_email));
  v_rec   public.email_campaign_recipients%ROWTYPE;
BEGIN
  IF NOT public.email_worker_ok(p_secret) THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  -- Attribute it to the most recent send to that address, which is the one the
  -- DSN is almost certainly about.
  SELECT * INTO v_rec FROM public.email_campaign_recipients
   WHERE email = v_email AND status = 'sent'
   ORDER BY sent_at DESC LIMIT 1;

  IF FOUND THEN
    UPDATE public.email_campaign_recipients
       SET status = 'bounced', bounced_at = NOW(), bounce_type = p_type, last_error = p_detail
     WHERE id = v_rec.id;
    UPDATE public.email_campaigns
       SET bounced_count = bounced_count + 1, sent_count = GREATEST(sent_count - 1, 0), updated_at = NOW()
     WHERE id = v_rec.campaign_id;
    INSERT INTO public.email_events (campaign_id, recipient_id, contact_id, type, detail)
    VALUES (v_rec.campaign_id, v_rec.id, v_rec.contact_id, 'bounce', left(COALESCE(p_detail, ''), 500));
  END IF;

  UPDATE public.email_contacts
     SET bounce_count = bounce_count + 1,
         status = CASE WHEN p_type = 'hard' THEN 'bounced' ELSE status END
   WHERE email = v_email;

  IF p_type = 'hard' THEN
    INSERT INTO public.email_suppressions (email, reason, detail)
    VALUES (v_email, 'bounce', left(COALESCE(p_detail, ''), 500))
    ON CONFLICT (email) DO NOTHING;
  END IF;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.record_email_bounce(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;


-- =============================================================================
-- SECTION 5 — PUBLIC TRACKING RPCs (token-scoped, callable by anon)
-- =============================================================================
-- These three are reachable by anyone holding a token, because that is exactly
-- what an email client is. None of them accepts or returns a row id, and none
-- of them can enumerate: without the 128-bit token they do nothing at all.

CREATE OR REPLACE FUNCTION public.record_email_open(
  p_token      TEXT,
  p_user_agent TEXT DEFAULT NULL,
  p_ip_hash    TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec   public.email_campaign_recipients%ROWTYPE;
  v_first BOOLEAN;
BEGIN
  SELECT * INTO v_rec FROM public.email_campaign_recipients WHERE token = p_token;
  IF NOT FOUND THEN RETURN; END IF;

  v_first := (v_rec.open_count = 0);

  UPDATE public.email_campaign_recipients
     SET open_count      = open_count + 1,
         first_opened_at = COALESCE(first_opened_at, NOW()),
         last_opened_at  = NOW()
   WHERE id = v_rec.id;

  -- opened_count on the campaign is *unique* opens. Total opens are the row
  -- count in email_events, and conflating the two is how open rates end up
  -- above 100%.
  IF v_first THEN
    UPDATE public.email_campaigns SET opened_count = opened_count + 1 WHERE id = v_rec.campaign_id;
    UPDATE public.email_contacts
       SET open_count = open_count + 1, last_opened_at = NOW()
     WHERE id = v_rec.contact_id;
  END IF;

  INSERT INTO public.email_events (campaign_id, recipient_id, contact_id, type, user_agent, ip_hash)
  VALUES (v_rec.campaign_id, v_rec.id, v_rec.contact_id, 'open', left(p_user_agent, 400), p_ip_hash);
END;
$$;

REVOKE ALL ON FUNCTION public.record_email_open(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_email_open(TEXT, TEXT, TEXT) TO anon, authenticated;


CREATE OR REPLACE FUNCTION public.record_email_click(
  p_token      TEXT,
  p_url        TEXT,
  p_user_agent TEXT DEFAULT NULL,
  p_ip_hash    TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec   public.email_campaign_recipients%ROWTYPE;
  v_first BOOLEAN;
BEGIN
  SELECT * INTO v_rec FROM public.email_campaign_recipients WHERE token = p_token;
  IF NOT FOUND THEN RETURN; END IF;

  v_first := (v_rec.click_count = 0);

  UPDATE public.email_campaign_recipients
     SET click_count      = click_count + 1,
         first_clicked_at = COALESCE(first_clicked_at, NOW()),
         last_clicked_at  = NOW(),
         -- A click proves the message was rendered, even when the pixel was
         -- blocked — which it is for most Gmail and Outlook readers now.
         open_count       = GREATEST(open_count, 1),
         first_opened_at  = COALESCE(first_opened_at, NOW())
   WHERE id = v_rec.id;

  IF v_first THEN
    UPDATE public.email_campaigns SET clicked_count = clicked_count + 1 WHERE id = v_rec.campaign_id;
    UPDATE public.email_contacts
       SET click_count = click_count + 1, last_clicked_at = NOW()
     WHERE id = v_rec.contact_id;
  END IF;

  IF v_rec.open_count = 0 THEN
    UPDATE public.email_campaigns SET opened_count = opened_count + 1 WHERE id = v_rec.campaign_id;
  END IF;

  INSERT INTO public.email_events (campaign_id, recipient_id, contact_id, type, url, user_agent, ip_hash)
  VALUES (v_rec.campaign_id, v_rec.id, v_rec.contact_id, 'click', left(p_url, 1000), left(p_user_agent, 400), p_ip_hash);
END;
$$;

REVOKE ALL ON FUNCTION public.record_email_click(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_email_click(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;


-- Renders the unsubscribe confirmation page. Returns only the address the token
-- already belongs to, so it tells the holder nothing they did not have.
CREATE OR REPLACE FUNCTION public.get_email_unsubscribe_target(p_token TEXT)
RETURNS TABLE (email TEXT, campaign_name TEXT, already_unsubscribed BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT r.email::TEXT, c.name::TEXT, (ct.status <> 'subscribed')
    FROM public.email_campaign_recipients r
    LEFT JOIN public.email_campaigns c ON c.id = r.campaign_id
    LEFT JOIN public.email_contacts  ct ON ct.id = r.contact_id
   WHERE r.token = p_token
   LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY
    SELECT ct.email::TEXT, NULL::TEXT, (ct.status <> 'subscribed')
      FROM public.email_contacts ct
     WHERE ct.unsubscribe_token = p_token
     LIMIT 1;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.get_email_unsubscribe_target(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_email_unsubscribe_target(TEXT) TO anon, authenticated;


-- Accepts either a per-campaign recipient token or a contact's standing token,
-- so one endpoint serves both the campaign footer link and the List-Unsubscribe
-- header on transactional mail.
CREATE OR REPLACE FUNCTION public.unsubscribe_email_token(
  p_token  TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec     public.email_campaign_recipients%ROWTYPE;
  v_contact public.email_contacts%ROWTYPE;
BEGIN
  SELECT * INTO v_rec FROM public.email_campaign_recipients WHERE token = p_token;

  IF FOUND THEN
    SELECT * INTO v_contact FROM public.email_contacts WHERE id = v_rec.contact_id;
    IF v_rec.unsubscribed_at IS NULL THEN
      UPDATE public.email_campaign_recipients SET unsubscribed_at = NOW() WHERE id = v_rec.id;
      UPDATE public.email_campaigns SET unsubscribed_count = unsubscribed_count + 1 WHERE id = v_rec.campaign_id;
      INSERT INTO public.email_events (campaign_id, recipient_id, contact_id, type, detail)
      VALUES (v_rec.campaign_id, v_rec.id, v_rec.contact_id, 'unsubscribe', left(p_reason, 500));
    END IF;
  ELSE
    SELECT * INTO v_contact FROM public.email_contacts WHERE unsubscribe_token = p_token;
    IF NOT FOUND THEN RETURN FALSE; END IF;
  END IF;

  IF v_contact.id IS NOT NULL THEN
    UPDATE public.email_contacts
       SET status = 'unsubscribed', unsubscribed_at = NOW(), unsubscribe_reason = p_reason, updated_at = NOW()
     WHERE id = v_contact.id AND status = 'subscribed';

    INSERT INTO public.email_suppressions (email, reason, detail)
    VALUES (v_contact.email, 'unsubscribe', left(p_reason, 500))
    ON CONFLICT (email) DO NOTHING;
  ELSIF v_rec.email IS NOT NULL THEN
    -- Queued from a list the contact row has since been deleted from: still
    -- honour the opt-out at the address level.
    INSERT INTO public.email_suppressions (email, reason, detail)
    VALUES (v_rec.email, 'unsubscribe', left(p_reason, 500))
    ON CONFLICT (email) DO NOTHING;
  END IF;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.unsubscribe_email_token(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unsubscribe_email_token(TEXT, TEXT) TO anon, authenticated;


-- =============================================================================
-- SECTION 6 — REPORTING VIEW
-- =============================================================================
-- security_invoker keeps the caller's RLS in force, so this view is admin-only
-- for the same reason the tables under it are. Without it a view owned by
-- postgres would hand the whole campaign table to any authenticated session.
DROP VIEW IF EXISTS public.email_campaign_overview;
CREATE VIEW public.email_campaign_overview WITH (security_invoker = true) AS
SELECT
  c.id, c.name, c.subject, c.status, c.rate_per_hour,
  c.scheduled_at, c.started_at, c.completed_at, c.created_at,
  c.total_recipients, c.sent_count, c.failed_count, c.bounced_count,
  c.opened_count, c.clicked_count, c.unsubscribed_count, c.complained_count,
  c.spam_score,
  (SELECT count(*) FROM public.email_campaign_recipients r
    WHERE r.campaign_id = c.id AND r.status = 'queued')::INTEGER AS pending_count,
  CEIL(c.total_recipients::NUMERIC / NULLIF(c.rate_per_hour, 0))::INTEGER AS total_batches,
  ROUND(100.0 * c.opened_count       / NULLIF(c.sent_count, 0), 1) AS open_rate,
  ROUND(100.0 * c.clicked_count      / NULLIF(c.sent_count, 0), 1) AS click_rate,
  ROUND(100.0 * c.bounced_count      / NULLIF(c.sent_count + c.bounced_count, 0), 1) AS bounce_rate,
  ROUND(100.0 * c.unsubscribed_count / NULLIF(c.sent_count, 0), 1) AS unsubscribe_rate,
  (SELECT count(*) FROM public.email_events e
    WHERE e.campaign_id = c.id AND e.type = 'open')::INTEGER AS total_opens,
  (SELECT count(*) FROM public.email_events e
    WHERE e.campaign_id = c.id AND e.type = 'click')::INTEGER AS total_clicks
FROM public.email_campaigns c;

GRANT SELECT ON public.email_campaign_overview TO authenticated;


-- =============================================================================
-- SECTION 7 — SETUP CHECKLIST
-- =============================================================================
-- 1. Mint a dispatch key and put the same string in the app's environment as
--    EMAIL_WORKER_SECRET:
--
--      SELECT public.register_email_worker_key('<paste 32+ random chars>', 'vercel-cron');
--
--    Generate one with:  openssl rand -hex 32
--
-- 2. Point a scheduler at POST /api/email/dispatch every few minutes, with
--    header  Authorization: Bearer <EMAIL_WORKER_SECRET>.
--    Any of these work; pick one:
--      * Vercel Cron (vercel.json in this repo already declares the job — note
--        the Hobby plan only runs cron once a day, Pro runs it per minute)
--      * pg_cron + pg_net from inside this database (see the commented block
--        at the end of this file — no external scheduler, no plan limits)
--      * cron-job.org, GitHub Actions, or any uptime pinger
--
--    Nothing breaks without a scheduler: the admin portal's "Kirim Sekarang"
--    button drains the queue by hand. It just will not continue on its own
--    once the browser is closed.
--
-- 3. Verify:
--      SELECT label, created_at, last_used_at FROM public.email_worker_keys;
--
-- -----------------------------------------------------------------------------
-- OPTIONAL — run the dispatcher from Postgres itself
-- -----------------------------------------------------------------------------
-- Removes the dependency on an external scheduler entirely, and sidesteps the
-- Vercel Hobby plan's once-a-day cron limit. Already applied on the production
-- project (job `cargogrid-email-dispatch`, every 5 minutes); this block is here
-- so a fresh environment can reproduce it.
--
-- The secret goes into Vault rather than inline in the job body, so it is not
-- sitting in plaintext in cron.job for anyone with database access to read.
--
--   CREATE EXTENSION IF NOT EXISTS pg_cron;
--   CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
--
--   SELECT vault.create_secret(
--     '<EMAIL_WORKER_SECRET>', 'email_worker_secret',
--     'Shared secret for POST /api/email/dispatch'
--   );
--
--   SELECT cron.schedule(
--     'cargogrid-email-dispatch',
--     '*/5 * * * *',
--     $cron$
--       SELECT net.http_post(
--         url     := 'https://www.cargogrid.net/api/email/dispatch',
--         headers := jsonb_build_object(
--                      'Content-Type',  'application/json',
--                      'Authorization', 'Bearer ' || (
--                        SELECT decrypted_secret FROM vault.decrypted_secrets
--                         WHERE name = 'email_worker_secret'
--                      )
--                    ),
--         body    := '{}'::jsonb,
--         timeout_milliseconds := 55000
--       );
--     $cron$
--   );
--
-- A 5-minute schedule does not send faster than 25/hour — the rate limit lives
-- in claim_due_email_recipients(), so a tighter schedule only shortens how long
-- a due message waits before going out.
--
-- To stop it:  SELECT cron.unschedule('cargogrid-email-dispatch');
-- To inspect:  SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;
-- =============================================================================
