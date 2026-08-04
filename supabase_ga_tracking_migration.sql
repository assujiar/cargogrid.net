-- =============================================================================
-- CargoGrid OS — GA4 attribution migration
-- =============================================================================
-- Run this ONCE against an existing project (Supabase Dashboard > SQL Editor).
-- A project created fresh from supabase_migration.sql already has everything
-- below; every statement is written to be safe to re-run regardless.
--
-- What it adds: the attribution columns that let a stored lead be traced back
-- to the campaign, click and browsing session that produced it, and a
-- create_inquiry() that accepts them.
-- =============================================================================

-- 1. Attribution columns -------------------------------------------------------

ALTER TABLE inquiries
    ADD COLUMN IF NOT EXISTS first_utm_source   VARCHAR(255),
    ADD COLUMN IF NOT EXISTS first_utm_medium   VARCHAR(255),
    ADD COLUMN IF NOT EXISTS first_utm_campaign VARCHAR(255),
    ADD COLUMN IF NOT EXISTS click_id           VARCHAR(512),
    ADD COLUMN IF NOT EXISTS landing_page       VARCHAR(512),
    ADD COLUMN IF NOT EXISTS referrer           VARCHAR(255),
    ADD COLUMN IF NOT EXISTS ga_client_id       VARCHAR(64),
    ADD COLUMN IF NOT EXISTS ga_session_id      VARCHAR(64),
    ADD COLUMN IF NOT EXISTS visit_count        INTEGER;

COMMENT ON COLUMN inquiries.first_utm_source IS 'First-touch campaign source — what originally brought this browser to the site.';
COMMENT ON COLUMN inquiries.click_id IS 'Ad-platform click id as provider:value (gclid, fbclid, msclkid...). Key for offline conversion import.';
COMMENT ON COLUMN inquiries.ga_client_id IS 'GA4 client id. NULL when the visitor declined analytics consent — that is expected, not a defect.';

-- Partial index: the only query this serves is "find the lead behind this GA4
-- client id" when reconciling a conversion, and rows without an id (consent
-- declined) can never match, so they are kept out of the index entirely.
CREATE INDEX IF NOT EXISTS inquiries_ga_client_id_idx
    ON inquiries (ga_client_id)
    WHERE ga_client_id IS NOT NULL;

-- 2. create_inquiry() ----------------------------------------------------------
-- The old 14-argument function is dropped rather than replaced: CREATE OR
-- REPLACE cannot change a signature, so keeping it would leave two overloads
-- behind and PostgREST would reject every call as ambiguous ("function is not
-- unique"). Dropping also drops its grants, which is why they are re-issued at
-- the bottom of this file.

DROP FUNCTION IF EXISTS public.create_inquiry(
    VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR,
    VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR
);

CREATE OR REPLACE FUNCTION public.create_inquiry(
    p_name VARCHAR, p_company VARCHAR, p_role VARCHAR, p_email VARCHAR, p_phone VARCHAR,
    p_company_type VARCHAR, p_shipment_volume VARCHAR, p_biggest_pain VARCHAR, p_lang VARCHAR DEFAULT 'id',
    p_utm_source VARCHAR DEFAULT NULL, p_utm_medium VARCHAR DEFAULT NULL, p_utm_campaign VARCHAR DEFAULT NULL,
    p_utm_term VARCHAR DEFAULT NULL, p_utm_content VARCHAR DEFAULT NULL,
    p_first_utm_source VARCHAR DEFAULT NULL, p_first_utm_medium VARCHAR DEFAULT NULL,
    p_first_utm_campaign VARCHAR DEFAULT NULL, p_click_id VARCHAR DEFAULT NULL,
    p_landing_page VARCHAR DEFAULT NULL, p_referrer VARCHAR DEFAULT NULL,
    p_ga_client_id VARCHAR DEFAULT NULL, p_ga_session_id VARCHAR DEFAULT NULL,
    p_visit_count INTEGER DEFAULT NULL
) RETURNS inquiries
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_row inquiries;
BEGIN
    INSERT INTO inquiries (
        name, company, role, email, phone, company_type, shipment_volume, biggest_pain,
        lang, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        first_utm_source, first_utm_medium, first_utm_campaign, click_id,
        landing_page, referrer, ga_client_id, ga_session_id, visit_count
    ) VALUES (
        p_name, p_company, p_role, p_email, p_phone, p_company_type, p_shipment_volume, p_biggest_pain,
        COALESCE(p_lang, 'id'), p_utm_source, p_utm_medium, p_utm_campaign, p_utm_term, p_utm_content,
        p_first_utm_source, p_first_utm_medium, p_first_utm_campaign, p_click_id,
        p_landing_page, p_referrer, p_ga_client_id, p_ga_session_id, p_visit_count
    )
    RETURNING * INTO v_row;
    RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.create_inquiry FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_inquiry TO anon, authenticated;
