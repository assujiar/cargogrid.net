-- ==========================================
-- CargoGrid Supabase Database Schema Setup
-- ==========================================
-- Run this script in the Supabase SQL Editor before deploying the Vercel app.
-- The Vite frontend uses the public anon key with Row Level Security policies below.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    company_type VARCHAR(100) NOT NULL,
    shipment_volume VARCHAR(100) NOT NULL,
    biggest_pain VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Inquiry Masuk',
    lang VARCHAR(10) DEFAULT 'id',
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID UNIQUE NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    cargo_types TEXT[] DEFAULT '{}',
    primary_routes TEXT,
    fleet_size VARCHAR(100),
    vendor_count VARCHAR(100),
    pain_rfq_details TEXT,
    pain_dispatch_details TEXT,
    pain_tracking_details TEXT,
    pain_billing_details TEXT,
    desired_modules TEXT[] DEFAULT '{}',
    erp_system VARCHAR(255) DEFAULT 'None',
    custom_requirements TEXT,
    preferred_slots TEXT[] DEFAULT '{}',
    contact_notes TEXT,
    existing_customer_flow TEXT,
    business_process_sop TEXT,
    total_expected_users VARCHAR(100),
    roles_involved TEXT[] DEFAULT '{}',
    top_problem_impact TEXT,
    specific_requests TEXT,
    is_draft BOOLEAN DEFAULT TRUE,
    last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    current_step INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID UNIQUE NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_url TEXT,
    platform VARCHAR(100) DEFAULT 'Google Meet',
    admin_notes TEXT,
    is_invitation_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_body TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Public landing page / questionnaire flow policies.
-- NOTE: The current frontend does not implement Supabase Auth yet, so these policies allow
-- the deployed demo to function end-to-end. Tighten them before handling real customer data.
CREATE POLICY "Public can insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read inquiries for questionnaire links" ON inquiries FOR SELECT USING (true);
CREATE POLICY "Public can update inquiry statuses" ON inquiries FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public can manage questionnaires" ON questionnaires FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can read meetings" ON meetings FOR SELECT USING (true);
CREATE POLICY "Public can upsert meetings from admin portal" ON meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can write email simulation logs" ON email_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read email simulation logs" ON email_logs FOR SELECT USING (true);

-- Authenticated admin override for future Supabase Auth rollout.
CREATE POLICY "Authenticated admins can manage inquiries" ON inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated admins can manage questionnaires" ON questionnaires FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated admins can manage meetings" ON meetings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated admins can manage email logs" ON email_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_inquiries_modtime ON inquiries;
CREATE TRIGGER update_inquiries_modtime 
BEFORE UPDATE ON inquiries 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_meetings_modtime ON meetings;
CREATE TRIGGER update_meetings_modtime 
BEFORE UPDATE ON meetings 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Optional sample seed. Uncomment if you want starter records in Supabase.
/*
INSERT INTO inquiries (name, company, role, email, phone, company_type, shipment_volume, biggest_pain, status)
VALUES ('Budi Santoso', 'PT Astra Otoparts Tbk', 'Logistics Director', 'budi.santoso@astra-otoparts.co.id', '081234567890', 'inhouse', '1000+', 'pod', 'Inquiry Masuk');
*/
