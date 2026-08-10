/**
 * Browser-side data access for the email marketing screens.
 *
 * Everything here runs as the signed-in admin against the same Supabase client
 * the rest of the portal uses, so Row Level Security is the authorisation layer
 * — there is no server route in between to re-check anything, and none is
 * needed. The only operations that go through an API route are the ones that
 * genuinely need the server: sending mail, DNS lookups, and the dispatcher.
 */

import { supabase } from "../supabase";
import type {
  EmailCampaign,
  EmailCampaignOverview,
  EmailContact,
  EmailGroup,
  EmailRecipient,
  EmailTemplate,
  ImportResult,
  QueueResult,
} from "./types";

function unwrap<T>(result: { data: T | null; error: { message?: string } | null }): T {
  if (result.error) throw new Error(result.error.message || "Supabase request failed");
  return (result.data ?? null) as T;
}

/** The admin's access token, forwarded to the API routes that need one. */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function authedFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = await getAccessToken();
  return fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
}

async function authedJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await authedFetch(path, init);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error || `Request failed (${response.status})`);
  return body as T;
}

// -----------------------------------------------------------------------------
// Contacts
// -----------------------------------------------------------------------------

export async function listContacts(options?: {
  search?: string;
  status?: string;
  groupId?: string;
  tag?: string;
  limit?: number;
}): Promise<EmailContact[]> {
  // Every filter has to be expressed in the query, never applied to the result.
  // Filtering a page of rows in the browser silently intersects the filter with
  // "whatever happened to be in the first N" — which is how the group filter
  // used to return nothing at all for any group whose members were imported
  // early enough to fall outside the page.
  //
  // !inner turns the membership table into a join rather than an embed, so the
  // limit applies to contacts that are actually in the group.
  //
  // The two selects are written as separate literals because supabase-js parses
  // the select string at the type level; a string built at runtime resolves to
  // ParserError and the call stops typechecking.
  let query = options?.groupId
    ? supabase
        .from("email_contacts")
        .select("*, email_group_members!inner(group_id)")
        .eq("email_group_members.group_id", options.groupId)
    : supabase.from("email_contacts").select("*");

  query = query.order("created_at", { ascending: false }) as typeof query;

  if (options?.status && options.status !== "all") query = query.eq("status", options.status);
  if (options?.tag) query = query.contains("tags", [options.tag]);
  if (options?.search) {
    const term = `%${options.search}%`;
    query = query.or(`email.ilike.${term},name.ilike.${term},company.ilike.${term}`);
  }
  query = query.limit(options?.limit ?? 500);

  const rows = unwrap(await query) as Array<EmailContact & { email_group_members?: unknown }>;

  // Drop the join artefact so callers get a plain contact either way.
  return rows.map(({ email_group_members: _ignored, ...contact }) => contact as EmailContact);
}

/**
 * Head-only count per status.
 *
 * Six cheap COUNT queries rather than fetching every row and tallying it in the
 * browser: the tally version is capped by PostgREST's row ceiling, so it starts
 * under-reporting the moment the list outgrows one page — and a stat card that
 * quietly stops counting is worse than one that is missing.
 */
export async function countContactsByStatus(): Promise<Record<string, number>> {
  const statuses = ["subscribed", "unsubscribed", "bounced", "complained", "cleaned"] as const;

  const [total, ...counts] = await Promise.all([
    supabase.from("email_contacts").select("*", { count: "exact", head: true }),
    ...statuses.map((status) =>
      supabase.from("email_contacts").select("*", { count: "exact", head: true }).eq("status", status),
    ),
  ]);

  const result: Record<string, number> = { total: total.count ?? 0 };
  statuses.forEach((status, index) => {
    result[status] = counts[index]?.count ?? 0;
  });
  return result;
}

export async function listAllTags(): Promise<string[]> {
  // Distinct tags are computed in the database for the same reason as the
  // counts above: derived from a fetched page, the tag list silently loses
  // whichever tags only exist on older contacts.
  const { data, error } = await supabase.rpc("list_email_contact_tags");
  if (error) throw new Error(error.message);
  return ((data || []) as Array<{ tag: string }>).map((row) => row.tag);
}

export async function upsertContact(contact: Partial<EmailContact> & { email: string }): Promise<EmailContact> {
  const payload = { ...contact, email: contact.email.trim().toLowerCase() };
  return unwrap(
    await supabase.from("email_contacts").upsert(payload, { onConflict: "email" }).select("*").single(),
  ) as EmailContact;
}

export async function deleteContacts(ids: string[]): Promise<void> {
  unwrap(await supabase.from("email_contacts").delete().in("id", ids).select("id"));
}

export async function setContactStatus(contactId: string, status: string, reason?: string): Promise<void> {
  const { error } = await supabase.rpc("set_email_contact_status", {
    p_contact_id: contactId,
    p_status: status,
    p_reason: reason ?? null,
  });
  if (error) throw new Error(error.message);
}

export interface ImportRow {
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  job_role?: string;
  lang?: string;
  tags?: string[];
  custom_fields?: Record<string, string>;
}

export async function importContacts(
  rows: ImportRow[],
  groupIds: string[] = [],
  tags: string[] = [],
  source = "csv",
): Promise<ImportResult> {
  const { data, error } = await supabase.rpc("import_email_contacts", {
    p_rows: rows,
    p_group_ids: groupIds,
    p_tags: tags,
    p_source: source,
  });
  if (error) throw new Error(error.message);
  return data as ImportResult;
}

export async function importFromLeads(source: "all" | "inquiries" | "tool_leads", groupIds: string[] = []): Promise<ImportResult> {
  const { data, error } = await supabase.rpc("import_email_contacts_from_leads", {
    p_source: source,
    p_group_ids: groupIds,
  });
  if (error) throw new Error(error.message);
  return data as ImportResult;
}

// -----------------------------------------------------------------------------
// Groups
// -----------------------------------------------------------------------------

export async function listGroups(): Promise<EmailGroup[]> {
  const groups = unwrap(
    await supabase.from("email_groups").select("*").order("name"),
  ) as EmailGroup[];

  // One head-count per group rather than fetching every membership row and
  // tallying it here. The tally version is bounded by PostgREST's row ceiling,
  // so past that point group sizes quietly start reading low — and these
  // numbers are what an operator sizes a campaign's audience against.
  const counts = await Promise.all(
    groups.map((g) =>
      supabase
        .from("email_group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_id", g.id),
    ),
  );

  return groups.map((g, index) => ({ ...g, member_count: counts[index]?.count ?? 0 }));
}

export async function saveGroup(group: Partial<EmailGroup> & { name: string }): Promise<EmailGroup> {
  if (group.id) {
    return unwrap(
      await supabase.from("email_groups").update({
        name: group.name, description: group.description, color: group.color,
      }).eq("id", group.id).select("*").single(),
    ) as EmailGroup;
  }
  return unwrap(
    await supabase.from("email_groups").insert({
      name: group.name, description: group.description, color: group.color || "teal",
    }).select("*").single(),
  ) as EmailGroup;
}

export async function deleteGroup(id: string): Promise<void> {
  unwrap(await supabase.from("email_groups").delete().eq("id", id).select("id"));
}

export async function addToGroup(groupId: string, contactIds: string[]): Promise<void> {
  if (contactIds.length === 0) return;
  const { error } = await supabase
    .from("email_group_members")
    .upsert(contactIds.map((contact_id) => ({ group_id: groupId, contact_id })), {
      onConflict: "group_id,contact_id",
      ignoreDuplicates: true,
    });
  if (error) throw new Error(error.message);
}

export async function removeFromGroup(groupId: string, contactIds: string[]): Promise<void> {
  if (contactIds.length === 0) return;
  unwrap(
    await supabase.from("email_group_members").delete()
      .eq("group_id", groupId).in("contact_id", contactIds).select("contact_id"),
  );
}

export async function getGroupMemberIds(groupId: string): Promise<string[]> {
  const rows = unwrap(
    await supabase.from("email_group_members").select("contact_id").eq("group_id", groupId),
  ) as Array<{ contact_id: string }>;
  return rows.map((r) => r.contact_id);
}

// -----------------------------------------------------------------------------
// Templates
// -----------------------------------------------------------------------------

export async function listTemplates(): Promise<EmailTemplate[]> {
  return unwrap(
    await supabase.from("email_templates").select("*").order("updated_at", { ascending: false }),
  ) as EmailTemplate[];
}

export async function saveTemplate(template: Partial<EmailTemplate> & { name: string }): Promise<EmailTemplate> {
  const payload = {
    name: template.name,
    subject: template.subject || "",
    preheader: template.preheader || null,
    html: template.html || "",
    category: template.category || "general",
  };
  if (template.id) {
    return unwrap(
      await supabase.from("email_templates").update(payload).eq("id", template.id).select("*").single(),
    ) as EmailTemplate;
  }
  return unwrap(
    await supabase.from("email_templates").insert(payload).select("*").single(),
  ) as EmailTemplate;
}

export async function deleteTemplate(id: string): Promise<void> {
  unwrap(await supabase.from("email_templates").delete().eq("id", id).select("id"));
}

// -----------------------------------------------------------------------------
// Campaigns
// -----------------------------------------------------------------------------

export async function listCampaigns(): Promise<EmailCampaignOverview[]> {
  return unwrap(
    await supabase.from("email_campaign_overview").select("*").order("created_at", { ascending: false }),
  ) as EmailCampaignOverview[];
}

export async function getCampaign(id: string): Promise<EmailCampaign> {
  return unwrap(await supabase.from("email_campaigns").select("*").eq("id", id).single()) as EmailCampaign;
}

export async function saveCampaign(campaign: Partial<EmailCampaign> & { name: string }): Promise<EmailCampaign> {
  const payload = {
    name: campaign.name,
    subject: campaign.subject ?? "",
    preheader: campaign.preheader ?? null,
    html: campaign.html ?? "",
    from_name: campaign.from_name ?? null,
    reply_to: campaign.reply_to ?? null,
    template_id: campaign.template_id ?? null,
    rate_per_hour: campaign.rate_per_hour ?? 25,
    track_opens: campaign.track_opens ?? true,
    track_clicks: campaign.track_clicks ?? true,
    audience_all: campaign.audience_all ?? false,
    audience_group_ids: campaign.audience_group_ids ?? [],
    audience_tags: campaign.audience_tags ?? [],
    audience_contact_ids: campaign.audience_contact_ids ?? [],
    scheduled_at: campaign.scheduled_at ?? null,
  };

  if (campaign.id) {
    return unwrap(
      await supabase.from("email_campaigns").update(payload).eq("id", campaign.id).select("*").single(),
    ) as EmailCampaign;
  }
  return unwrap(
    await supabase.from("email_campaigns").insert(payload).select("*").single(),
  ) as EmailCampaign;
}

export async function deleteCampaign(id: string): Promise<void> {
  unwrap(await supabase.from("email_campaigns").delete().eq("id", id).select("id"));
}

export async function countAudience(campaign: {
  audience_all: boolean;
  audience_group_ids: string[];
  audience_tags: string[];
  audience_contact_ids: string[];
}): Promise<number> {
  const { data, error } = await supabase.rpc("count_email_audience", {
    p_all: campaign.audience_all,
    p_group_ids: campaign.audience_group_ids,
    p_tags: campaign.audience_tags,
    p_contact_ids: campaign.audience_contact_ids,
  });
  if (error) throw new Error(error.message);
  return (data as number) || 0;
}

/** Materialises the send queue. `startAt` null means "start now". */
export async function queueCampaign(campaignId: string, startAt: string | null): Promise<QueueResult> {
  const { data, error } = await supabase.rpc("queue_email_campaign", {
    p_campaign_id: campaignId,
    p_start_at: startAt,
  });
  if (error) throw new Error(error.message);
  return data as QueueResult;
}

export async function setCampaignState(campaignId: string, action: "pause" | "resume" | "cancel") {
  const { data, error } = await supabase.rpc("set_email_campaign_state", {
    p_campaign_id: campaignId,
    p_action: action,
  });
  if (error) throw new Error(error.message);
  return data as { action: string; pending: number };
}

/**
 * Recipient filters, as the campaign detail screen offers them.
 *
 * Two different things share one control. `queued`/`sent`/`bounced`/… are the
 * delivery status column; `opened`/`clicked`/`unsubscribed` are engagement, and
 * are not statuses at all — a recipient who opened the mail still has
 * status='sent'. Collapsing both into one filter is what lets the stat cards
 * above the list act as filters, which is how anyone actually reads that screen:
 * see a number, want the names behind it.
 */
export type RecipientFilter =
  | "all"
  | "queued" | "sending" | "sent" | "failed" | "bounced" | "cancelled"
  | "opened" | "clicked" | "unsubscribed";

export async function listRecipients(
  campaignId: string,
  filter: RecipientFilter = "all",
): Promise<EmailRecipient[]> {
  let query = supabase
    .from("email_campaign_recipients")
    .select("*")
    .eq("campaign_id", campaignId)
    .limit(1000);

  switch (filter) {
    case "opened":
      // Most recently opened first: on an engagement view the useful ordering
      // is "who just read it", not the position they held in the send queue.
      query = query.gt("open_count", 0).order("first_opened_at", { ascending: false });
      break;
    case "clicked":
      query = query.gt("click_count", 0).order("first_clicked_at", { ascending: false });
      break;
    case "unsubscribed":
      query = query.not("unsubscribed_at", "is", null).order("unsubscribed_at", { ascending: false });
      break;
    case "all":
      query = query.order("send_order");
      break;
    default:
      query = query.eq("status", filter).order("send_order");
  }

  return unwrap(await query) as EmailRecipient[];
}

export interface CampaignEvent {
  id: number;
  campaign_id: string | null;
  type: string;
  url: string | null;
  user_agent: string | null;
  detail: string | null;
  created_at: string;
}

export async function listEvents(campaignId?: string, limit = 200): Promise<CampaignEvent[]> {
  let query = supabase.from("email_events").select("*").order("created_at", { ascending: false }).limit(limit);
  if (campaignId) query = query.eq("campaign_id", campaignId);
  return unwrap(await query) as CampaignEvent[];
}

/** Which links in a campaign actually got clicked, most-clicked first. */
export async function topClickedLinks(campaignId: string): Promise<Array<{ url: string; clicks: number }>> {
  const rows = unwrap(
    await supabase.from("email_events").select("url").eq("campaign_id", campaignId).eq("type", "click"),
  ) as Array<{ url: string | null }>;

  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    if (row.url) acc[row.url] = (acc[row.url] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([url, clicks]) => ({ url, clicks }))
    .sort((a, b) => b.clicks - a.clicks);
}

/**
 * The account-wide hourly ceiling.
 *
 * Distinct from a campaign's own rate: several campaigns running at once all
 * draw on this one number, because they all leave through the same mailbox.
 */
export async function getGlobalRate(): Promise<number> {
  const row = unwrap(
    await supabase.from("email_settings").select("global_rate_per_hour").limit(1).maybeSingle(),
  ) as { global_rate_per_hour: number } | null;
  return row?.global_rate_per_hour ?? 25;
}

export async function setGlobalRate(value: number): Promise<void> {
  unwrap(
    await supabase
      .from("email_settings")
      .update({ global_rate_per_hour: value, updated_at: new Date().toISOString() })
      .eq("id", true)
      .select("global_rate_per_hour"),
  );
}

export async function listSuppressions(): Promise<Array<{ email: string; reason: string; detail: string | null; created_at: string }>> {
  return unwrap(
    await supabase.from("email_suppressions").select("*").order("created_at", { ascending: false }).limit(500),
  ) as Array<{ email: string; reason: string; detail: string | null; created_at: string }>;
}

export async function removeSuppression(email: string): Promise<void> {
  unwrap(await supabase.from("email_suppressions").delete().eq("email", email).select("email"));
}

// -----------------------------------------------------------------------------
// Server-backed operations
// -----------------------------------------------------------------------------

export async function runDispatchNow(): Promise<{ claimed?: number; sent?: number; failed?: number; message?: string }> {
  return authedJson("/api/email/dispatch", { method: "POST", body: "{}" });
}

export async function sendTestEmail(payload: {
  to: string;
  subject: string;
  html: string;
  preheader?: string;
  fromName?: string;
  replyTo?: string;
}): Promise<{ sent: number; failed: number; results: Array<{ to: string; ok: boolean; error?: string }> }> {
  return authedJson("/api/email/test-send", { method: "POST", body: JSON.stringify(payload) });
}

export async function runSpamCheck(payload: {
  subject: string;
  html: string;
  preheader?: string;
  fromEmail?: string;
  campaignId?: string;
}) {
  return authedJson("/api/email/spam-check", { method: "POST", body: JSON.stringify(payload) });
}

/**
 * DNS-checks every subscribed contact's domain. With `apply` false it only
 * reports; with `apply` true it also cancels their queued sends, marks the
 * contacts cleaned, and suppresses the addresses.
 */
export async function verifyContactDomains(apply: boolean): Promise<{
  applied: boolean;
  checkedDomains: number;
  deadDomains: string[];
  affectedContacts: number;
}> {
  return authedJson("/api/email/verify-domains", {
    method: "POST",
    body: JSON.stringify({ apply }),
  });
}

export async function getSmtpStatus(): Promise<{
  configured: boolean;
  reachable: boolean;
  from?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  error?: string;
}> {
  return authedJson("/api/email/test-send", { method: "GET" });
}
