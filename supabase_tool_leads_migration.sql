-- =============================================================================
-- Tool access leads
-- =============================================================================
-- Run once in the Supabase SQL Editor, after supabase_migration.sql.
--
-- The four calculators under /alat ask for a name, company, email and phone
-- before they will run. This table is where those contact details land.
--
-- Two design notes that matter more than the DDL:
--
-- 1. The same person will open several calculators. Rather than write a row per
--    tool per visit, the email is unique and repeat visits update the existing
--    row: last_tool_slug moves, tools_used accumulates, and use_count climbs.
--    A lead list with the same address on it eleven times is a worse lead list.
--
-- 2. Anonymous callers never touch the table directly. Exactly as with
--    create_inquiry, the only public entry point is one SECURITY DEFINER
--    function that accepts the fields it needs and returns nothing readable.
--    Row Level Security stays on with no anon policy, so a leaked publishable
--    key still cannot enumerate the list.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.tool_leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(160)  NOT NULL,
  company      VARCHAR(160)  NOT NULL,
  email        VARCHAR(255)  NOT NULL UNIQUE,
  phone        VARCHAR(40)   NOT NULL,

  -- Which tool first brought them in, and which one they touched most recently.
  first_tool_slug VARCHAR(80),
  last_tool_slug  VARCHAR(80),
  -- Every distinct tool this contact has unlocked. Tells you what they were
  -- actually trying to work out, which is the useful part of the lead.
  tools_used   TEXT[]        NOT NULL DEFAULT '{}',
  use_count    INTEGER       NOT NULL DEFAULT 1,

  -- Attribution, mirroring the inquiries table so both lead sources join up.
  lang         VARCHAR(5),
  utm_source   VARCHAR(255),
  utm_medium   VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term     VARCHAR(255),
  utm_content  VARCHAR(255),
  landing_page TEXT,
  referrer     TEXT,
  ga_client_id VARCHAR(255),

  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tool_leads_created_at_idx ON public.tool_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS tool_leads_last_tool_idx  ON public.tool_leads (last_tool_slug);

ALTER TABLE public.tool_leads ENABLE ROW LEVEL SECURITY;

-- Admins read and manage; anon gets nothing but the RPC below.
DROP POLICY IF EXISTS "Admin: Full control of tool leads" ON public.tool_leads;
CREATE POLICY "Admin: Full control of tool leads" ON public.tool_leads
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- Public-safe upsert
-- -----------------------------------------------------------------------------
-- Returns the row id only. Deliberately not the row: the caller is an anonymous
-- browser and has no business reading back a record keyed on an email address
-- somebody else might own.
--
-- ON CONFLICT keys on the lowercased email, so "Budi@Firma.co.id" and
-- "budi@firma.co.id" are one lead rather than two.
CREATE OR REPLACE FUNCTION public.record_tool_lead(
  p_name         TEXT,
  p_company      TEXT,
  p_email        TEXT,
  p_phone        TEXT,
  p_tool_slug    TEXT DEFAULT NULL,
  p_lang         TEXT DEFAULT NULL,
  p_utm_source   TEXT DEFAULT NULL,
  p_utm_medium   TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_utm_term     TEXT DEFAULT NULL,
  p_utm_content  TEXT DEFAULT NULL,
  p_landing_page TEXT DEFAULT NULL,
  p_referrer     TEXT DEFAULT NULL,
  p_ga_client_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.tool_leads (
    name, company, email, phone,
    first_tool_slug, last_tool_slug, tools_used,
    lang, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    landing_page, referrer, ga_client_id
  ) VALUES (
    LEFT(TRIM(p_name), 160), LEFT(TRIM(p_company), 160),
    LEFT(LOWER(TRIM(p_email)), 255), LEFT(TRIM(p_phone), 40),
    LEFT(p_tool_slug, 80), LEFT(p_tool_slug, 80),
    CASE WHEN p_tool_slug IS NULL THEN '{}'::TEXT[] ELSE ARRAY[p_tool_slug] END,
    LEFT(p_lang, 5), LEFT(p_utm_source, 255), LEFT(p_utm_medium, 255),
    LEFT(p_utm_campaign, 255), LEFT(p_utm_term, 255), LEFT(p_utm_content, 255),
    p_landing_page, p_referrer, LEFT(p_ga_client_id, 255)
  )
  ON CONFLICT (email) DO UPDATE SET
    -- Latest details win: people change companies and phone numbers, and the
    -- most recent submission is the one they just stood behind.
    name           = EXCLUDED.name,
    company        = EXCLUDED.company,
    phone          = EXCLUDED.phone,
    last_tool_slug = COALESCE(EXCLUDED.last_tool_slug, public.tool_leads.last_tool_slug),
    tools_used     = CASE
                       WHEN p_tool_slug IS NULL OR p_tool_slug = ANY(public.tool_leads.tools_used)
                         THEN public.tool_leads.tools_used
                       ELSE array_append(public.tool_leads.tools_used, p_tool_slug)
                     END,
    use_count      = public.tool_leads.use_count + 1,
    -- First-touch attribution is never overwritten; last-touch is not stored
    -- here at all, because the inquiries table already carries it for anyone
    -- who goes on to convert.
    updated_at     = NOW()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.record_tool_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.record_tool_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated;
