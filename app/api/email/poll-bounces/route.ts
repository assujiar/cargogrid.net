/**
 * Reads bounce notifications out of the sending mailbox and records them.
 *
 * The gap this closes: SMTP only reports rejections that happen during the
 * conversation. A relay that accepts a message with 250 and then discovers the
 * mailbox does not exist mails a DSN back to the return-path instead, and
 * nothing in the send path ever sees it. Without this endpoint the bounce rate
 * reads 0% while a large share of the list is undeliverable — which is the
 * state that gets a sending domain blacklisted, precisely because the number
 * that would have warned you says everything is fine.
 *
 * Runs on the same schedule and the same shared secret as the dispatcher.
 * Processes only unseen messages and marks them seen, so it is safe to call as
 * often as you like and will not re-record the same bounce twice.
 */

import { NextRequest, NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { requireWorker, getWorkerSupabase, requireAdmin } from "@/src/lib/email/auth";
import { parseDsn } from "@/src/lib/email/dsn";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Bounded so one run cannot exceed the function timeout on a neglected mailbox. */
const MAX_MESSAGES = 100;

interface ImapSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  mailbox: string;
}

/**
 * Falls back to the SMTP credentials, because for almost every provider the
 * mailbox you send as is the mailbox the bounces come back to, reachable with
 * the same login. Only the host usually differs.
 */
function readImapSettings(): ImapSettings | null {
  const user = process.env.IMAP_USER || process.env.SMTP_USER;
  const pass = process.env.IMAP_PASS || process.env.SMTP_PASS;
  const host = process.env.IMAP_HOST || (process.env.SMTP_HOST || "").replace(/^smtp\./i, "imap.");
  if (!host || !user || !pass) return null;

  const port = Number(process.env.IMAP_PORT || 993);
  return {
    host,
    port,
    secure: process.env.IMAP_SECURE !== undefined ? process.env.IMAP_SECURE === "true" : port === 993,
    user,
    pass,
    mailbox: process.env.IMAP_MAILBOX || "INBOX",
  };
}

async function pollBounces(secret: string): Promise<Record<string, unknown>> {
  const settings = readImapSettings();
  if (!settings) {
    return {
      ok: false,
      error:
        "IMAP is not configured. Set IMAP_HOST (and IMAP_USER/IMAP_PASS if they differ from the SMTP ones) " +
        "so bounce notifications can be read back.",
    };
  }

  const supabase = getWorkerSupabase();
  if (!supabase) return { ok: false, error: "Supabase is not configured on the server" };

  const client = new ImapFlow({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: { user: settings.user, pass: settings.pass },
    logger: false,
  });

  let scanned = 0;
  let recorded = 0;
  const failures: string[] = [];

  try {
    await client.connect();
  } catch (error) {
    return { ok: false, error: `Cannot reach IMAP at ${settings.host}:${settings.port} — ${(error as Error).message}` };
  }

  const lock = await client.getMailboxLock(settings.mailbox);
  try {
    // Bounces come from the postmaster of whatever relay rejected the message,
    // so they are matched on being unseen and on looking like a DSN, not on a
    // sender address that varies per provider.
    const unseen = await client.search({ seen: false }, { uid: true });
    const uids = (unseen || []).slice(-MAX_MESSAGES);

    for (const uid of uids) {
      // fetchOne returns `false` when the message vanished between the search
      // and the fetch — someone else's client can move or delete it mid-run.
      const fetched = await client.fetchOne(String(uid), { source: true, envelope: true }, { uid: true });
      const message = fetched === false ? null : fetched;
      if (!message?.source) continue;

      const raw = message.source.toString("utf8");
      const subject = message.envelope?.subject || "";
      scanned++;

      const verdicts = parseDsn(raw);
      if (verdicts.length === 0) continue;

      for (const verdict of verdicts) {
        const { error } = await supabase.rpc("record_email_bounce", {
          p_secret: secret,
          p_email: verdict.email,
          p_type: verdict.type,
          p_detail: `${subject} — ${verdict.detail}`.slice(0, 500),
        });
        if (error) failures.push(`${verdict.email}: ${error.message}`);
        else recorded++;
      }

      // Only marked seen once its bounces are safely recorded, so a crash
      // mid-run means the message is re-read rather than silently lost.
      await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });
    }
  } finally {
    lock.release();
    await client.logout().catch(() => undefined);
  }

  return { ok: failures.length === 0, scanned, recorded, failures: failures.slice(0, 10) };
}

export async function POST(request: NextRequest) {
  const auth = requireWorker(request);
  if (auth.ok) {
    const result = await pollBounces(auth.secret);
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  }

  // An admin can also run it by hand from the portal, which is how you check
  // the credentials work without waiting for the next scheduled run.
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const workerSecret = (process.env.EMAIL_WORKER_SECRET || "").trim();
  if (!workerSecret) {
    return NextResponse.json({ error: "EMAIL_WORKER_SECRET is not set on the server" }, { status: 503 });
  }

  const result = await pollBounces(workerSecret);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

export async function GET(request: NextRequest) {
  const auth = requireWorker(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const result = await pollBounces(auth.secret);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
