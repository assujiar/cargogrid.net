/**
 * CargoGrid Supabase data access layer.
 * All mutable application data is read from and written to Supabase tables.
 */

import { supabase } from "./supabase";
import { generateHtmlEmailTemplate } from "./emailTemplates";
import { toInquiry, type InquiryRow } from "./inquiryRow";

export interface Inquiry {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  companyType: string; // 'forwarder' | '3pl' | 'trucking' | 'inhouse' | 'other'
  shipmentVolume: string; // '<100' | '100-500' | '500-1000' | '1000+'
  biggestPain: string; // 'rfq' | 'tracking' | 'pod' | 'warehouse' | 'billing' | 'margin'
  status: 'Inquiry Masuk' | 'Draft Kuesioner' | 'Kuesioner Selesai' | 'Meeting Scheduled';
  createdAt: string;
  updatedAt: string;
  lang?: 'id' | 'en';
  /** Last-touch campaign: what the visitor clicked on the visit they converted. */
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  /** First-touch campaign: what originally brought this browser to the site.
   *  Kept separately because a B2B cycle spans weeks and the two rarely match —
   *  crediting only the last click hides whatever actually created the demand. */
  firstUtmSource?: string;
  firstUtmMedium?: string;
  firstUtmCampaign?: string;
  /** Ad-platform click identifier as `provider:value` (e.g. `gclid:Cj0KC...`).
   *  This is the key for importing the closed deal back into Google Ads. */
  clickId?: string;
  /** Path the visitor first landed on, and the external origin that sent them. */
  landingPage?: string;
  referrer?: string;
  /** GA4 identifiers — set only when the visitor granted analytics consent.
   *  They join this lead to its full browsing history in GA4/BigQuery. */
  gaClientId?: string;
  gaSessionId?: string;
  /** Distinct visits before submitting. A high count is a real buying signal. */
  visitCount?: number;
}

export interface Questionnaire {
  inquiryId: string;
  // Section 1: Profil & Operasional Bisnis
  serviceTypes: string[]; // e.g. ['Air Freight', 'Sea Freight - FCL', 'Trucking - FTL', 'Warehousing']
  cargoTypes: string[]; // Commodity types e.g. ['Bulk Cargo (Curah)', 'Reefer (Suhu Dingin)', 'General Cargo / Box']
  operationScope: string; // 'domestic' | 'international' | 'both'
  primaryRoutes: string;
  fleetSize: string;
  vendorCount: string;

  // Section 2: Diagnosa Kendala Utama
  painRfqDetails: string;
  painDispatchDetails: string;
  painTrackingDetails: string;
  painBillingDetails: string;

  // Section 3: Kebutuhan Solusi & Integrasi
  desiredModules: string[]; // e.g. ['commercial', 'ops', 'tracking', 'finance', 'warehouse']
  erpSystem: string;
  customRequirements: string;

  // Section 4: Preferensi Jadwal Meeting & Koordinasi
  preferredSlots: string[]; // e.g. ['Kamis, 9 Juli - Pagi', 'Jumat, 10 Juli - Siang']
  contactNotes: string;

  // NEW: Business Process, Expected Users, and Customer Requests
  existingCustomerFlow?: string;
  businessProcessSop?: string;
  totalExpectedUsers?: string;
  rolesInvolved?: string[];
  topProblemImpact?: string;
  specificRequests?: string;

  isDraft: boolean;
  currentStep: number; // 1 to 4
  lastSavedAt: string;
  submittedAt?: string;
}

export interface Meeting {
  id: string;
  inquiryId: string;
  scheduledTime: string;
  meetingUrl: string;
  platform: 'Google Meet' | 'Zoom' | 'Microsoft Teams';
  adminNotes: string;
  isInvitationSent: boolean;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  htmlBody: string;
  sentAt: string;
  type: 'customer_welcome' | 'admin_alert_new' | 'admin_alert_complete' | 'customer_meeting';
}

// Email templates live in ./emailTemplates so they can also be rendered
// server-side (app/api/inquiry) without loading the browser Supabase client.
export {
  generateHtmlEmailTemplate,
  getPainLabel,
  getSektorLabel,
  getModuleLabel,
  formatDateDisplay,
} from "./emailTemplates";

// Supabase row mapping helpers
type QuestionnaireRow = {
  inquiry_id: string; service_types?: string[] | null; cargo_types?: string[] | null; operation_scope?: string | null; primary_routes?: string | null; fleet_size?: string | null;
  vendor_count?: string | null; pain_rfq_details?: string | null; pain_dispatch_details?: string | null;
  pain_tracking_details?: string | null; pain_billing_details?: string | null; desired_modules?: string[] | null;
  erp_system?: string | null; custom_requirements?: string | null; preferred_slots?: string[] | null; contact_notes?: string | null;
  existing_customer_flow?: string | null; business_process_sop?: string | null; total_expected_users?: string | null;
  roles_involved?: string[] | null; top_problem_impact?: string | null; specific_requests?: string | null;
  is_draft?: boolean | null; current_step?: number | null; last_saved_at?: string | null; submitted_at?: string | null;
};

type MeetingRow = {
  id: string; inquiry_id: string; scheduled_time: string; meeting_url?: string | null; platform?: Meeting["platform"] | null;
  admin_notes?: string | null; is_invitation_sent?: boolean | null; created_at: string;
};

type EmailLogRow = {
  id: string; to_address: string; subject: string; html_body: string; sent_at: string; type: EmailLog["type"];
};

const toQuestionnaire = (row: QuestionnaireRow): Questionnaire => ({
  inquiryId: row.inquiry_id, serviceTypes: row.service_types || [], cargoTypes: row.cargo_types || [], operationScope: row.operation_scope || "",
  primaryRoutes: row.primary_routes || "",
  fleetSize: row.fleet_size || "", vendorCount: row.vendor_count || "", painRfqDetails: row.pain_rfq_details || "",
  painDispatchDetails: row.pain_dispatch_details || "", painTrackingDetails: row.pain_tracking_details || "",
  painBillingDetails: row.pain_billing_details || "", desiredModules: row.desired_modules || [], erpSystem: row.erp_system || "None",
  customRequirements: row.custom_requirements || "", preferredSlots: row.preferred_slots || [], contactNotes: row.contact_notes || "",
  existingCustomerFlow: row.existing_customer_flow || "", businessProcessSop: row.business_process_sop || "",
  totalExpectedUsers: row.total_expected_users || "", rolesInvolved: row.roles_involved || [], topProblemImpact: row.top_problem_impact || "",
  specificRequests: row.specific_requests || "", isDraft: row.is_draft ?? true, currentStep: row.current_step || 1,
  lastSavedAt: row.last_saved_at || new Date().toISOString(), submittedAt: row.submitted_at || undefined
});

const toMeeting = (row: MeetingRow): Meeting => ({
  id: row.id, inquiryId: row.inquiry_id, scheduledTime: row.scheduled_time, meetingUrl: row.meeting_url || "",
  platform: row.platform || "Google Meet", adminNotes: row.admin_notes || "", isInvitationSent: row.is_invitation_sent ?? false,
  createdAt: row.created_at
});

const toEmailLog = (row: EmailLogRow): EmailLog => ({
  id: row.id, to: row.to_address, subject: row.subject, htmlBody: row.html_body, sentAt: row.sent_at, type: row.type
});

const toQuestionnaireRpcArgs = (inquiryId: string, qData: Partial<Questionnaire>, isDraft: boolean) => ({
  p_inquiry_id: inquiryId, p_service_types: qData.serviceTypes || [], p_cargo_types: qData.cargoTypes || [], p_primary_routes: qData.primaryRoutes || "", p_fleet_size: qData.fleetSize || "",
  p_vendor_count: qData.vendorCount || "", p_pain_rfq_details: qData.painRfqDetails || "", p_pain_dispatch_details: qData.painDispatchDetails || "",
  p_pain_tracking_details: qData.painTrackingDetails || "", p_pain_billing_details: qData.painBillingDetails || "", p_desired_modules: qData.desiredModules || [],
  p_erp_system: qData.erpSystem || "None", p_custom_requirements: qData.customRequirements || "", p_preferred_slots: qData.preferredSlots || [],
  p_contact_notes: qData.contactNotes || "", p_existing_customer_flow: qData.existingCustomerFlow || "", p_business_process_sop: qData.businessProcessSop || "",
  p_total_expected_users: qData.totalExpectedUsers || "", p_roles_involved: qData.rolesInvolved || [], p_top_problem_impact: qData.topProblemImpact || "",
  p_specific_requests: qData.specificRequests || "", p_is_draft: isDraft, p_current_step: qData.currentStep || (isDraft ? 1 : 4),
  p_submitted_at: isDraft ? qData.submittedAt || null : new Date().toISOString(),
  p_operation_scope: qData.operationScope || ""
});

function throwSupabaseError(error: unknown): never {
  const message =
    (error as { message?: string })?.message ||
    (error instanceof Error ? error.message : undefined) ||
    "Supabase request failed";
  throw new Error(message);
}

// API Methods

// Admin-only: full listing requires an authenticated session (RLS: "Admin: Full control of inquiries").
export async function getInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return ((data || []) as InquiryRow[]).map(toInquiry);
}

// Public: scoped to a single row via the get_inquiry_by_id() SECURITY DEFINER function,
// so an anonymous visitor can only ever fetch the exact inquiry they already hold the ID for.
export async function getInquiry(id: string): Promise<Inquiry | undefined> {
  const { data, error } = await supabase.rpc("get_inquiry_by_id", { p_id: id }).maybeSingle();
  if (error) throwSupabaseError(error);
  return data ? toInquiry(data as InquiryRow) : undefined;
}

// Public: used by the "resend my questionnaire link" flow. Scoped server-side to a single
// email match so the client never receives other customers' inquiry data.
export async function findInquiryByEmail(email: string): Promise<Inquiry | undefined> {
  const { data, error } = await supabase.rpc("find_inquiry_by_email", { p_email: email }).maybeSingle();
  if (error) throwSupabaseError(error);
  return data ? toInquiry(data as InquiryRow) : undefined;
}

// NOTE: creating an inquiry deliberately does NOT live here anymore. The lead
// capture form posts to the same-origin /api/inquiry route instead of calling
// *.supabase.co straight from the browser — see src/lib/inquiryClient.ts.

export async function updateInquiryStatus(id: string, status: Inquiry["status"]): Promise<void> {
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function getQuestionnaires(): Promise<Questionnaire[]> {
  const { data, error } = await supabase.from("questionnaires").select("*");
  if (error) throwSupabaseError(error);
  return ((data || []) as QuestionnaireRow[]).map(toQuestionnaire);
}

// Public: scoped to a single row via the get_questionnaire_by_inquiry_id() SECURITY DEFINER
// function, so an anonymous visitor can only ever load the draft tied to their own inquiry ID.
export async function getQuestionnaireByInquiryId(inquiryId: string): Promise<Questionnaire | undefined> {
  const { data, error } = await supabase.rpc("get_questionnaire_by_inquiry_id", { p_inquiry_id: inquiryId }).maybeSingle();
  if (error) throwSupabaseError(error);
  return data ? toQuestionnaire(data as QuestionnaireRow) : undefined;
}

export async function saveQuestionnaireDraft(inquiryId: string, qData: Partial<Questionnaire> & { currentStep: number }): Promise<Questionnaire> {
  const { data, error } = await supabase.rpc("upsert_questionnaire", toQuestionnaireRpcArgs(inquiryId, qData, true)).single();
  if (error) throwSupabaseError(error);
  return toQuestionnaire(data as QuestionnaireRow);
}

export async function submitQuestionnaire(inquiryId: string, qData: Partial<Questionnaire>): Promise<Questionnaire> {
  const { data, error } = await supabase.rpc("upsert_questionnaire", toQuestionnaireRpcArgs(inquiryId, { ...qData, currentStep: 4 }, false)).single();
  if (error) throwSupabaseError(error);
  const updated = toQuestionnaire(data as QuestionnaireRow);
  const inquiry = await getInquiry(inquiryId);
  try {
    if (inquiry) await addEmailLog("service@cargogrid.net", `✅ [CargoGrid ALERT] Kuesioner Selesai Diisi - ${inquiry.company}`, generateHtmlEmailTemplate("admin_alert_complete", { inquiry, questionnaire: updated }), "admin_alert_complete");
  } catch (err) {
    console.warn("Email log recording failed (non-blocking):", err);
  }
  return updated;
}

export async function getMeetings(): Promise<Meeting[]> {
  const { data, error } = await supabase.from("meetings").select("*").order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return ((data || []) as MeetingRow[]).map(toMeeting);
}

export async function scheduleMeeting(inquiryId: string, meetData: { scheduledTime: string; meetingUrl: string; platform: Meeting["platform"]; adminNotes: string; }): Promise<Meeting> {
  const { data, error } = await supabase.from("meetings").upsert({
    inquiry_id: inquiryId, scheduled_time: meetData.scheduledTime, meeting_url: meetData.meetingUrl, platform: meetData.platform,
    admin_notes: meetData.adminNotes, is_invitation_sent: true
  }, { onConflict: "inquiry_id" }).select("*").single();
  if (error) throwSupabaseError(error);
  const meeting = toMeeting(data as MeetingRow);
  await updateInquiryStatus(inquiryId, "Meeting Scheduled");
  const inquiry = await getInquiry(inquiryId);
  try {
    if (inquiry) await addEmailLog(inquiry.email, `📅 [CargoGrid OS] Undangan Meeting Konfirmasi Audit Sistem - ${inquiry.company}`, generateHtmlEmailTemplate("customer_meeting", { inquiry, meeting }), "customer_meeting");
  } catch (err) {
    console.warn("Email log recording failed (non-blocking):", err);
  }
  return meeting;
}

export async function getEmailLogs(): Promise<EmailLog[]> {
  const { data, error } = await supabase.from("email_logs").select("*").order("sent_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return ((data || []) as EmailLogRow[]).map(toEmailLog);
}

// Public: routed through the log_email() SECURITY DEFINER function since anon has no direct
// table grants on email_logs (avoids relying on RLS SELECT policies to return INSERT ... RETURNING rows).
export async function addEmailLog(to: string, subject: string, htmlBody: string, type: EmailLog["type"]): Promise<EmailLog> {
  const { data, error } = await supabase.rpc("log_email", { p_to_address: to, p_subject: subject, p_html_body: htmlBody, p_type: type }).single();
  if (error) throwSupabaseError(error);

  // Best-effort actual delivery via the server-side SMTP relay. A delivery failure (e.g. SMTP
  // not configured yet) must not affect the audit log row that was already written above.
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html: htmlBody }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.warn("Email delivery failed (non-blocking):", body.error || res.status);
    }
  } catch (err) {
    console.warn("Email delivery request failed (non-blocking):", err);
  }

  return toEmailLog(data as EmailLogRow);
}
