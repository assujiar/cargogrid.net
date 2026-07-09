-- ==========================================
-- CargoGrid Supabase Database Schema Setup
-- ==========================================
-- This SQL migration file provisions the complete tables, relations, and security rules
-- required for the CargoGrid Inquiry, Draftable Questionnaire, and Meeting Scheduling system.
-- Paste this script into your Supabase SQL Editor (https://supabase.com) and click 'Run'.
-- This script is idempotent: it is safe to re-run in full on a database that already has
-- an earlier version of this schema applied (used DROP ... IF EXISTS guards throughout).

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create 'inquiries' Table
-- Holds initial customer contact, language preference, and marketing attribution parameters.
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    company_type VARCHAR(100) NOT NULL, -- e.g. 'forwarder', '3pl', 'trucking', 'inhouse', 'other'
    shipment_volume VARCHAR(100) NOT NULL, -- e.g. '<100', '100-500', '500-1000', '1000+'
    biggest_pain VARCHAR(100) NOT NULL, -- e.g. 'rfq', 'tracking', 'pod', 'warehouse', 'billing', 'margin'
    status VARCHAR(50) NOT NULL DEFAULT 'Inquiry Masuk', -- 'Inquiry Masuk', 'Draft Kuesioner', 'Kuesioner Selesai', 'Meeting Scheduled'
    lang VARCHAR(10) DEFAULT 'id', -- Language preference ('id' or 'en')
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create 'questionnaires' Table
-- Stores the in-depth, multi-category responses. Supports 'is_draft' for progressive save and resume.
CREATE TABLE IF NOT EXISTS questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID UNIQUE NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,

    -- Kategori 1: Profil & Operasional Bisnis (JSON or flat columns for structure)
    cargo_types TEXT[] DEFAULT '{}', -- Array of cargo types e.g. ['FCL', 'LCL', 'Bulk']
    operation_scope VARCHAR(50), -- 'domestic' | 'international' | 'both'
    primary_routes TEXT, -- Primary logistics corridors
    fleet_size VARCHAR(100), -- Size of trucking/carrier pool
    vendor_count VARCHAR(100), -- Number of active transport vendors

    -- Kategori 2: Diagnosa Kendala Utama (Rich descriptive inputs)
    pain_rfq_details TEXT, -- How RFQs are currently processed (e.g., WA, Email, Excel)
    pain_dispatch_details TEXT, -- Pain points with driver coordination and tracking
    pain_tracking_details TEXT, -- Customer feedback on shipment visibility
    pain_billing_details TEXT, -- Delay times in POD return and invoicing

    -- Kategori 3: Kebutuhan Solusi & Integrasi
    desired_modules TEXT[] DEFAULT '{}', -- Modules of CargoGrid e.g. ['commercial', 'ops', 'tracking', 'finance']
    erp_system VARCHAR(255) DEFAULT 'None', -- e.g. 'SAP', 'Oracle', 'Xero', 'Accurate', 'None'
    custom_requirements TEXT, -- Any custom workflow customization requests

    -- Kategori 4: Preferensi Jadwal Meeting & Koordinasi
    preferred_slots TEXT[] DEFAULT '{}', -- Selected time preference strings e.g. ['2026-07-09 Pagi', '2026-07-10 Siang']
    contact_notes TEXT, -- Additional notes on who to loop into the meeting

    -- Kategori 5: Detil Proses Operasional, Dampak, dan Ekspektasi Pengguna (Bilingual details)
    existing_customer_flow TEXT, -- Alur perjalanan barang & invoice saat ini
    business_process_sop TEXT, -- Status standard operating procedures (SOP tertulis vs informal)
    total_expected_users VARCHAR(100), -- Estimasi jumlah pengguna (e.g., '20-50', '100+')
    roles_involved TEXT[] DEFAULT '{}', -- Peran internal yang terlibat dalam sistem
    top_problem_impact TEXT, -- Kerugian/dampak terbesar akibat kendala operasional
    specific_requests TEXT, -- Modul, kustomisasi, atau integrasi hardware khusus

    -- Draft and Progression Status
    is_draft BOOLEAN DEFAULT TRUE, -- TRUE if in progress, FALSE if completed and locked
    last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    current_step INTEGER DEFAULT 1 -- Keeps track of current screen step (1 to 4)
);

-- Backfill guard: adds the column above for databases where 'questionnaires' was already
-- provisioned by an earlier version of this script (CREATE TABLE IF NOT EXISTS is a no-op then).
ALTER TABLE questionnaires ADD COLUMN IF NOT EXISTS operation_scope VARCHAR(50);

-- 3. Create 'meetings' Table
-- Manages final scheduled meetings, platform selections, and digital invitations.
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID UNIQUE NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_url TEXT, -- Dynamic meeting link (e.g. Google Meet, Zoom)
    platform VARCHAR(100) DEFAULT 'Google Meet', -- 'Google Meet', 'Zoom', 'Microsoft Teams'
    admin_notes TEXT, -- Private internal notes from the CargoGrid consulting team
    is_invitation_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create 'email_logs' Table
-- Stores rendered transactional email payloads and delivery audit history.
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to_address VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    html_body TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Security & Row Level Security (RLS) Rules
-- ==========================================
-- IMPORTANT: anonymous visitors get NO direct table policies on inquiries, questionnaires,
-- meetings, or email_logs. Postgres RLS cannot distinguish "the app querying its own row"
-- from "anyone querying every row" -- a USING (true) policy exposes the entire table to any
-- caller holding the public anon key, regardless of the filter the app itself intended to use.
-- Instead, every anonymous read/write goes through the narrow SECURITY DEFINER functions
-- defined further below, each scoped to a single row (by id, email, or inquiry_id).

DROP POLICY IF EXISTS "Public: Allow initial inquiry insertion" ON inquiries;
DROP POLICY IF EXISTS "Public: Allow select of their own inquiry" ON inquiries;
DROP POLICY IF EXISTS "Public: Allow update of their own inquiry status" ON inquiries;
DROP POLICY IF EXISTS "Public: Allow full questionnaire management" ON questionnaires;
DROP POLICY IF EXISTS "Public: Allow view of meetings" ON meetings;
DROP POLICY IF EXISTS "Public: Allow email log insertion" ON email_logs;

-- --- Admin Access Override Policy ---
-- In production, restrict admin management to authenticated CargoGrid accounts.
-- Replace 'authenticated' and custom claims as required for your organizational structure.
DROP POLICY IF EXISTS "Admin: Full control of inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin: Full control of questionnaires" ON questionnaires;
DROP POLICY IF EXISTS "Admin: Full control of meetings" ON meetings;
DROP POLICY IF EXISTS "Admin: Full control of email logs" ON email_logs;

CREATE POLICY "Admin: Full control of inquiries" ON inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin: Full control of questionnaires" ON questionnaires FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin: Full control of meetings" ON meetings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin: Full control of email logs" ON email_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- Public-Safe RPC Functions (SECURITY DEFINER)
-- ==========================================
-- These are the ONLY way an anonymous visitor (the public/anon Supabase key used by the
-- website) can read or write inquiries/questionnaires/email_logs. SECURITY DEFINER makes
-- each function run with the privileges of its owner (bypassing RLS internally), while the
-- function body itself only ever touches the single row identified by its arguments -- so a
-- caller can never enumerate or edit another customer's data, no matter what they pass in.

CREATE OR REPLACE FUNCTION public.create_inquiry(
    p_name VARCHAR, p_company VARCHAR, p_role VARCHAR, p_email VARCHAR, p_phone VARCHAR,
    p_company_type VARCHAR, p_shipment_volume VARCHAR, p_biggest_pain VARCHAR, p_lang VARCHAR DEFAULT 'id',
    p_utm_source VARCHAR DEFAULT NULL, p_utm_medium VARCHAR DEFAULT NULL, p_utm_campaign VARCHAR DEFAULT NULL,
    p_utm_term VARCHAR DEFAULT NULL, p_utm_content VARCHAR DEFAULT NULL
) RETURNS inquiries
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_row inquiries;
BEGIN
    INSERT INTO inquiries (
        name, company, role, email, phone, company_type, shipment_volume, biggest_pain,
        lang, utm_source, utm_medium, utm_campaign, utm_term, utm_content
    ) VALUES (
        p_name, p_company, p_role, p_email, p_phone, p_company_type, p_shipment_volume, p_biggest_pain,
        COALESCE(p_lang, 'id'), p_utm_source, p_utm_medium, p_utm_campaign, p_utm_term, p_utm_content
    )
    RETURNING * INTO v_row;
    RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_inquiry_by_id(p_id UUID) RETURNS inquiries
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
    SELECT * FROM inquiries WHERE id = p_id;
$$;

CREATE OR REPLACE FUNCTION public.find_inquiry_by_email(p_email TEXT) RETURNS inquiries
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
    SELECT * FROM inquiries WHERE lower(email) = lower(p_email) ORDER BY created_at DESC LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_questionnaire_by_inquiry_id(p_inquiry_id UUID) RETURNS questionnaires
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
    SELECT * FROM questionnaires WHERE inquiry_id = p_inquiry_id;
$$;

CREATE OR REPLACE FUNCTION public.upsert_questionnaire(
    p_inquiry_id UUID, p_cargo_types TEXT[], p_primary_routes TEXT, p_fleet_size TEXT, p_vendor_count TEXT,
    p_pain_rfq_details TEXT, p_pain_dispatch_details TEXT, p_pain_tracking_details TEXT, p_pain_billing_details TEXT,
    p_desired_modules TEXT[], p_erp_system TEXT, p_custom_requirements TEXT, p_preferred_slots TEXT[], p_contact_notes TEXT,
    p_existing_customer_flow TEXT, p_business_process_sop TEXT, p_total_expected_users TEXT, p_roles_involved TEXT[],
    p_top_problem_impact TEXT, p_specific_requests TEXT, p_is_draft BOOLEAN, p_current_step INT, p_submitted_at TIMESTAMPTZ,
    p_operation_scope TEXT DEFAULT ''
) RETURNS questionnaires
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_row questionnaires;
BEGIN
    INSERT INTO questionnaires (
        inquiry_id, cargo_types, operation_scope, primary_routes, fleet_size, vendor_count, pain_rfq_details, pain_dispatch_details,
        pain_tracking_details, pain_billing_details, desired_modules, erp_system, custom_requirements, preferred_slots,
        contact_notes, existing_customer_flow, business_process_sop, total_expected_users, roles_involved,
        top_problem_impact, specific_requests, is_draft, current_step, last_saved_at, submitted_at
    ) VALUES (
        p_inquiry_id, p_cargo_types, p_operation_scope, p_primary_routes, p_fleet_size, p_vendor_count, p_pain_rfq_details, p_pain_dispatch_details,
        p_pain_tracking_details, p_pain_billing_details, p_desired_modules, p_erp_system, p_custom_requirements, p_preferred_slots,
        p_contact_notes, p_existing_customer_flow, p_business_process_sop, p_total_expected_users, p_roles_involved,
        p_top_problem_impact, p_specific_requests, p_is_draft, p_current_step, now(), p_submitted_at
    )
    ON CONFLICT (inquiry_id) DO UPDATE SET
        cargo_types = excluded.cargo_types, operation_scope = excluded.operation_scope, primary_routes = excluded.primary_routes, fleet_size = excluded.fleet_size,
        vendor_count = excluded.vendor_count, pain_rfq_details = excluded.pain_rfq_details, pain_dispatch_details = excluded.pain_dispatch_details,
        pain_tracking_details = excluded.pain_tracking_details, pain_billing_details = excluded.pain_billing_details,
        desired_modules = excluded.desired_modules, erp_system = excluded.erp_system, custom_requirements = excluded.custom_requirements,
        preferred_slots = excluded.preferred_slots, contact_notes = excluded.contact_notes, existing_customer_flow = excluded.existing_customer_flow,
        business_process_sop = excluded.business_process_sop, total_expected_users = excluded.total_expected_users, roles_involved = excluded.roles_involved,
        top_problem_impact = excluded.top_problem_impact, specific_requests = excluded.specific_requests, is_draft = excluded.is_draft,
        current_step = excluded.current_step, last_saved_at = now(), submitted_at = excluded.submitted_at
    RETURNING * INTO v_row;

    UPDATE inquiries SET status = CASE WHEN p_is_draft THEN 'Draft Kuesioner' ELSE 'Kuesioner Selesai' END WHERE id = p_inquiry_id;

    RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_email(p_to_address VARCHAR, p_subject TEXT, p_html_body TEXT, p_type VARCHAR) RETURNS email_logs
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_row email_logs;
BEGIN
    INSERT INTO email_logs (to_address, subject, html_body, type) VALUES (p_to_address, p_subject, p_html_body, p_type)
    RETURNING * INTO v_row;
    RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.create_inquiry FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_inquiry_by_id FROM PUBLIC;
REVOKE ALL ON FUNCTION public.find_inquiry_by_email FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_questionnaire_by_inquiry_id FROM PUBLIC;
REVOKE ALL ON FUNCTION public.upsert_questionnaire FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_email FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_inquiry TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_inquiry_by_id TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.find_inquiry_by_email TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_questionnaire_by_inquiry_id TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_questionnaire TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_email TO anon, authenticated;

-- ==========================================
-- Automatic Timestamps Trigger Hook
-- ==========================================

-- Create helper function to automatically refresh 'updated_at' columns on modification
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Set trigger hooks
DROP TRIGGER IF EXISTS update_inquiries_modtime ON inquiries;
CREATE TRIGGER update_inquiries_modtime
BEFORE UPDATE ON inquiries
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_meetings_modtime ON meetings;
CREATE TRIGGER update_meetings_modtime
BEFORE UPDATE ON meetings
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==========================================
-- Sample Seeding Script (Optional)
-- ==========================================
-- Insert dummy records to inspect the schema structure inside your dashboard.
-- Uncomment and execute these if you want to prepopulate data.
/*
INSERT INTO inquiries (name, company, role, email, phone, company_type, shipment_volume, biggest_pain, status)
VALUES (
    'Budi Santoso',
    'PT Astra Otoparts Tbk',
    'Logistics Director',
    'budi.santoso@astra-otoparts.co.id',
    '081234567890',
    'inhouse',
    '1000+',
    'pod',
    'Inquiry Masuk'
);
*/
