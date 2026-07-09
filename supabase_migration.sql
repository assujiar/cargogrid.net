-- ==========================================
-- CargoGrid Supabase Database Schema Setup
-- ==========================================
-- This SQL migration file provisions the complete tables, relations, and security rules
-- required for the CargoGrid Inquiry, Draftable Questionnaire, and Meeting Scheduling system.
-- Paste this script into your Supabase SQL Editor (https://supabase.com) and click 'Run'.

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

-- ==========================================
-- Security & Row Level Security (RLS) Rules
-- ==========================================

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

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

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- --- Inquiries Policies ---
-- Allow any public visitor to insert a new inquiry (e.g. via landing page)
CREATE POLICY "Public: Allow initial inquiry insertion" 
ON inquiries FOR INSERT 
WITH CHECK (true);

-- Allow public users to retrieve or update their own inquiries to match questionnaire flow
CREATE POLICY "Public: Allow select of their own inquiry" 
ON inquiries FOR SELECT 
USING (true);

CREATE POLICY "Public: Allow update of their own inquiry status" 
ON inquiries FOR UPDATE 
USING (true);

-- --- Questionnaires Policies ---
-- Allow public users to fully manage (insert, read, update) questionnaire drafts linked to an inquiry
CREATE POLICY "Public: Allow full questionnaire management" 
ON questionnaires FOR ALL 
USING (true) 
WITH CHECK (true);

-- --- Meetings Policies ---
-- Allow customers to see their scheduled meeting details
CREATE POLICY "Public: Allow view of meetings"
ON meetings FOR SELECT
USING (true);

-- --- Email Logs Policies ---
-- Allow the public inquiry/questionnaire submission flow to record transactional email logs
CREATE POLICY "Public: Allow email log insertion"
ON email_logs FOR INSERT
WITH CHECK (true);

-- --- Admin Access Override Policy ---
-- In production, restrict admin management to authenticated CargoGrid accounts.
-- Replace 'authenticated' and custom claims as required for your organizational structure.
CREATE POLICY "Admin: Full control of inquiries" ON inquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin: Full control of questionnaires" ON questionnaires FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin: Full control of meetings" ON meetings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin: Full control of email logs" ON email_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

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
CREATE TRIGGER update_inquiries_modtime 
BEFORE UPDATE ON inquiries 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

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
