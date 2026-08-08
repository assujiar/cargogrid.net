/**
 * Shared types for the email marketing stack.
 *
 * Field names mirror the Supabase columns exactly (snake_case) rather than
 * being camel-cased on the way in like src/lib/storage.ts does for inquiries.
 * The marketing tables are read and written by the admin portal only, always
 * through supabase-js, so a mapping layer would be pure ceremony — and the one
 * thing worth optimising for here is being able to read a query and a component
 * side by side without translating column names in your head.
 */

export type ContactStatus = "subscribed" | "unsubscribed" | "bounced" | "complained" | "cleaned";

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "sending"
  | "paused"
  | "sent"
  | "cancelled"
  | "failed";

export type RecipientStatus =
  | "queued"
  | "sending"
  | "sent"
  | "failed"
  | "bounced"
  | "skipped"
  | "cancelled";

export interface EmailContact {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  job_role: string | null;
  lang: string;
  status: ContactStatus;
  source: string;
  tags: string[];
  custom_fields: Record<string, string>;
  unsubscribed_at: string | null;
  unsubscribe_reason: string | null;
  bounce_count: number;
  sent_count: number;
  open_count: number;
  click_count: number;
  last_sent_at: string | null;
  last_opened_at: string | null;
  last_clicked_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailGroup {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
  /** Populated by the client from a separate membership count query. */
  member_count?: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader: string | null;
  html: string;
  category: string;
  is_builtin: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  preheader: string | null;
  html: string;
  from_name: string | null;
  from_email: string | null;
  reply_to: string | null;
  template_id: string | null;
  status: CampaignStatus;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  rate_per_hour: number;
  track_opens: boolean;
  track_clicks: boolean;
  audience_all: boolean;
  audience_group_ids: string[];
  audience_tags: string[];
  audience_contact_ids: string[];
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  bounced_count: number;
  opened_count: number;
  clicked_count: number;
  unsubscribed_count: number;
  complained_count: number;
  spam_score: number | null;
  spam_report: SpamReport | null;
  spam_checked_at: string | null;
  created_at: string;
  updated_at: string;
}

/** The email_campaign_overview view — campaigns plus derived rates. */
export interface EmailCampaignOverview {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  rate_per_hour: number;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  bounced_count: number;
  opened_count: number;
  clicked_count: number;
  unsubscribed_count: number;
  complained_count: number;
  spam_score: number | null;
  pending_count: number;
  total_batches: number;
  open_rate: number | null;
  click_rate: number | null;
  bounce_rate: number | null;
  unsubscribe_rate: number | null;
  total_opens: number;
  total_clicks: number;
}

export interface EmailRecipient {
  id: string;
  campaign_id: string;
  contact_id: string | null;
  email: string;
  name: string | null;
  status: RecipientStatus;
  send_order: number;
  batch_index: number;
  scheduled_for: string;
  sent_at: string | null;
  failed_at: string | null;
  attempts: number;
  last_error: string | null;
  open_count: number;
  first_opened_at: string | null;
  click_count: number;
  first_clicked_at: string | null;
  unsubscribed_at: string | null;
  bounced_at: string | null;
  bounce_type: "hard" | "soft" | null;
}

/** Result of queue_email_campaign(). */
export interface QueueResult {
  queued: number;
  start_at: string;
  batches: number;
  rate_per_hour: number;
  estimated_finish: string;
}

export interface ImportResult {
  inserted: number;
  updated: number;
  skipped: number;
}

// -----------------------------------------------------------------------------
// Spam check
// -----------------------------------------------------------------------------

export type SpamSeverity = "critical" | "warning" | "info" | "pass";

export interface SpamIssue {
  id: string;
  severity: SpamSeverity;
  /** Points added to the score. Higher is worse; 0 for a passing check. */
  weight: number;
  title: string;
  detail: string;
  /** What to actually do about it. */
  fix?: string;
}

export interface SpamReport {
  /** 0 (clean) to 10 (certain spam folder), in the same direction as SpamAssassin. */
  score: number;
  verdict: "good" | "risky" | "bad";
  issues: SpamIssue[];
  checkedAt: string;
  /** Present only when the check ran server-side, where DNS is available. */
  auth?: {
    domain: string;
    spf: { found: boolean; record?: string; note?: string };
    dmarc: { found: boolean; record?: string; policy?: string; note?: string };
    dkim: { found: boolean; selector?: string; note?: string };
  };
}
