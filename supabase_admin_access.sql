-- =============================================================================
-- CargoGrid OS — admin access control
-- =============================================================================
-- Run once in Supabase Dashboard > SQL Editor. Safe to re-run (idempotent).
--
-- WHY THIS EXISTS
--   The original policies granted full control to the `authenticated` role with
--   USING (true), which means *any* account that can log in reads and writes
--   every customer record. With public sign-up enabled -- the Supabase default
--   -- a stranger could self-register and pull the entire inquiries table,
--   which is exactly the exposure the SECURITY DEFINER refactor closed on the
--   anonymous side.
--
--   This replaces "is logged in" with "is on the admin list". Membership is
--   granted here in SQL only: there is deliberately no INSERT/UPDATE/DELETE
--   policy on admin_users, so no signed-in session can promote itself.
-- =============================================================================


-- 1. The allowlist ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email      TEXT,
    note       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;


-- 2. The membership test ------------------------------------------------------
-- SECURITY DEFINER matters here: the policies below call this while evaluating
-- access, and a plain query against admin_users would re-enter admin_users' own
-- RLS and recurse. Returns false for anonymous callers, since auth.uid() is null.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;


-- 3. Admins may read the list (so the app can verify its own session).
--    No write policy on purpose -- promotion happens in the SQL editor only.

DROP POLICY IF EXISTS "Admin: read admin list" ON public.admin_users;
CREATE POLICY "Admin: read admin list" ON public.admin_users
    FOR SELECT TO authenticated USING (public.is_admin());


-- 4. Re-scope the data policies from "authenticated" to "admin" ---------------
-- Public visitor traffic is unaffected: anonymous reads and writes never touch
-- these policies, they go through the SECURITY DEFINER RPCs (create_inquiry,
-- get_inquiry_by_id, upsert_questionnaire, log_email, ...).

DROP POLICY IF EXISTS "Admin: Full control of inquiries"      ON inquiries;
DROP POLICY IF EXISTS "Admin: Full control of questionnaires" ON questionnaires;
DROP POLICY IF EXISTS "Admin: Full control of meetings"       ON meetings;
DROP POLICY IF EXISTS "Admin: Full control of email logs"     ON email_logs;

CREATE POLICY "Admin: Full control of inquiries" ON inquiries
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin: Full control of questionnaires" ON questionnaires
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin: Full control of meetings" ON meetings
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin: Full control of email logs" ON email_logs
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 5. Grant admin to service@cargogrid.net -------------------------------------
-- Looked up by email rather than pasting the UID, so a mistyped character fails
-- loudly (0 rows inserted) instead of silently creating a dead entry.

INSERT INTO public.admin_users (user_id, email, note)
SELECT id, email, 'Primary CargoGrid administrator'
FROM auth.users
WHERE lower(email) = lower('service@cargogrid.net')
ON CONFLICT (user_id) DO NOTHING;


-- 6. Verify -------------------------------------------------------------------
-- Expect exactly one row: 5a7d3ba9-593f-4620-9f35-ed3fd63ea96a / service@cargogrid.net
-- An empty result means the auth user does not exist under that address -- create
-- it in Authentication > Users first, then re-run step 5.

SELECT a.user_id, a.email, a.created_at, u.last_sign_in_at
FROM public.admin_users a
JOIN auth.users u ON u.id = a.user_id
ORDER BY a.created_at;


-- =============================================================================
-- TO ADD ANOTHER ADMIN LATER
--     INSERT INTO public.admin_users (user_id, email)
--     SELECT id, email FROM auth.users WHERE lower(email) = lower('someone@cargogrid.net')
--     ON CONFLICT (user_id) DO NOTHING;
--
-- TO REVOKE
--     DELETE FROM public.admin_users WHERE lower(email) = lower('someone@cargogrid.net');
--   The account can still sign in; it just sees nothing. Delete it under
--   Authentication > Users to remove sign-in entirely.
--
-- ALSO RECOMMENDED (defence in depth, not a substitute for the above)
--   Authentication > Sign In / Providers > turn OFF "Allow new users to sign up",
--   so nobody can create an account you did not intend to exist.
-- =============================================================================
