/**
 * The blast dispatcher.
 *
 * Called on a schedule (Vercel Cron, pg_cron, or any external pinger) and by the
 * admin portal's "Kirim Sekarang" button. Each invocation claims whatever the
 * database says is due, sends it, and reports the outcome back. It holds no
 * state of its own — the queue is the state — which is what makes it safe to
 * run twice, to kill mid-flight, or to redeploy underneath.
 *
 * The 25-per-hour limit is enforced in the database, not here. See
 * claim_due_email_recipients() in supabase_email_marketing_migration.sql: this
 * route cannot exceed the rate even if it is called every second.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireWorker, getWorkerSupabase, requireAdmin } from "@/src/lib/email/auth";
import { getAppBaseUrl } from "@/src/lib/appUrl";
import { sendMail, isSmtpConfigured, getDefaultFrom } from "@/src/lib/mailer";
import { renderCampaignEmail, buildBulkHeaders, type MergeData } from "@/src/lib/email/render";

export const runtime = "nodejs";
// Sends happen one connection at a time against a shared mailbox; a cached
// response here would be actively harmful.
export const dynamic = "force-dynamic";

/**
 * How many messages one invocation will send.
 *
 * Sized against the serverless execution limit rather than the rate limit: at
 * 25/hour only one or two are ever due at a time, but a queue that was paused
 * for a day comes back with an hour's allowance available at once. Ten sends of
 * a couple of seconds each stays comfortably inside a 60s function timeout, and
 * whatever is left over goes on the next tick.
 */
const MAX_PER_RUN = 10;

interface ClaimedRecipient {
  id: string;
  campaign_id: string;
  contact_id: string | null;
  email: string;
  name: string | null;
  merge_data: MergeData;
  token: string;
  attempts: number;
}

interface DispatchCampaign {
  id: string;
  name: string;
  subject: string;
  preheader: string | null;
  html: string;
  from_name: string | null;
  from_email: string | null;
  reply_to: string | null;
  track_opens: boolean;
  track_clicks: boolean;
}

interface DispatchOutcome {
  id: string;
  status: "sent" | "failed" | "bounced" | "retry";
  message_id?: string;
  error?: string;
  bounce_type?: "hard" | "soft";
}

function formatFrom(campaign: DispatchCampaign): string {
  const fallback = getDefaultFrom();
  // The mailbox is not the campaign's to choose: nearly every provider rejects a
  // From: that is not the authenticated account. Only the display name varies.
  const mailbox = fallback.match(/<([^>]+)>/)?.[1] || fallback;
  const name = campaign.from_name?.trim();
  return name ? `${name} <${mailbox}>` : fallback;
}

async function runDispatch(secret: string): Promise<Record<string, unknown>> {
  const supabase = getWorkerSupabase();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured on the server" };
  }
  if (!isSmtpConfigured()) {
    // Deliberately does not claim anything: leaving the queue untouched means a
    // misconfigured deploy delays the campaign instead of burning it.
    return { ok: false, error: "SMTP is not configured on the server", claimed: 0, sent: 0 };
  }

  const { data: claimed, error: claimError } = await supabase.rpc("claim_due_email_recipients", {
    p_secret: secret,
    p_limit: MAX_PER_RUN,
  });

  if (claimError) {
    return { ok: false, error: `Could not claim work: ${claimError.message}` };
  }

  const batch = (claimed || []) as ClaimedRecipient[];
  if (batch.length === 0) {
    return { ok: true, claimed: 0, sent: 0, failed: 0, message: "nothing due" };
  }

  const campaignIds = Array.from(new Set(batch.map((r) => r.campaign_id)));
  const { data: campaignRows, error: campaignError } = await supabase.rpc("get_email_campaigns_for_dispatch", {
    p_secret: secret,
    p_ids: campaignIds,
  });

  if (campaignError) {
    // The rows are already claimed, so hand them straight back rather than
    // leaving them to time out fifteen minutes from now.
    await supabase.rpc("report_email_dispatch", {
      p_secret: secret,
      p_results: batch.map((r) => ({ id: r.id, status: "retry", error: campaignError.message })),
    });
    return { ok: false, error: `Could not load campaigns: ${campaignError.message}` };
  }

  const campaigns = new Map<string, DispatchCampaign>(
    ((campaignRows || []) as DispatchCampaign[]).map((c) => [c.id, c]),
  );
  const baseUrl = getAppBaseUrl();
  const results: DispatchOutcome[] = [];

  // Strictly sequential. The SMTP transport is pooled to a single connection and
  // the whole point of the throttle is that messages leave one at a time — a
  // Promise.all here would defeat both.
  for (const recipient of batch) {
    const campaign = campaigns.get(recipient.campaign_id);
    if (!campaign) {
      results.push({ id: recipient.id, status: "failed", error: "Campaign disappeared mid-dispatch" });
      continue;
    }

    try {
      const rendered = renderCampaignEmail({
        html: campaign.html,
        subject: campaign.subject,
        preheader: campaign.preheader,
        merge: { ...recipient.merge_data, name: recipient.merge_data?.name || recipient.name || "" },
        baseUrl,
        token: recipient.token,
        trackOpens: campaign.track_opens,
        trackClicks: campaign.track_clicks,
      });

      const from = formatFrom(campaign);
      const result = await sendMail({
        to: recipient.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        from,
        replyTo: campaign.reply_to || undefined,
        headers: buildBulkHeaders(rendered.unsubscribeUrl, from),
      });

      if (result.ok) {
        results.push({ id: recipient.id, status: "sent", message_id: result.messageId });
      } else if (result.failure === "bounce") {
        results.push({
          id: recipient.id,
          status: "bounced",
          error: result.error,
          bounce_type: result.bounceType || "hard",
        });
      } else if (result.failure === "retry") {
        results.push({ id: recipient.id, status: "retry", error: result.error });
      } else {
        results.push({ id: recipient.id, status: "failed", error: result.error });
      }
    } catch (error) {
      // An exception escaping the send is a bug on our side, not a verdict on
      // the address — so it retries rather than burning the recipient.
      results.push({ id: recipient.id, status: "retry", error: (error as Error)?.message || "Unexpected send error" });
    }
  }

  const { data: report, error: reportError } = await supabase.rpc("report_email_dispatch", {
    p_secret: secret,
    p_results: results,
  });

  if (reportError) {
    // The mail went out; only the bookkeeping failed. Say so loudly — the stale
    // claims will be released after 15 minutes and retried, which means these
    // recipients may receive the message twice.
    console.error("Dispatch results could not be recorded", reportError, results);
    return { ok: false, error: `Sent ${results.length} but could not record results: ${reportError.message}` };
  }

  return { ok: true, claimed: batch.length, ...(report as Record<string, unknown>) };
}

/** Scheduler entry point. */
export async function POST(request: NextRequest) {
  const auth = requireWorker(request);
  if (auth.ok) {
    const result = await runDispatch(auth.secret);
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  }

  // Not the scheduler — but an admin pressing "Kirim Sekarang" is allowed to
  // drain the queue by hand, which is also what makes the whole feature usable
  // on a hosting plan with no sub-daily cron.
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const workerSecret = (process.env.EMAIL_WORKER_SECRET || "").trim();
  if (!workerSecret) {
    return NextResponse.json(
      { error: "EMAIL_WORKER_SECRET is not set on the server. Register a dispatch key and add it to the environment." },
      { status: 503 },
    );
  }

  const result = await runDispatch(workerSecret);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

/** Vercel Cron issues GET, so it maps onto the same work. */
export async function GET(request: NextRequest) {
  const auth = requireWorker(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const result = await runDispatch(auth.secret);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
