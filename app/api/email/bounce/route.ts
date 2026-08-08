/**
 * Asynchronous bounce feedback.
 *
 * What SMTP tells us at send time is only half the picture. A receiving server
 * routinely accepts a message with a 250, decides seconds later that the
 * mailbox does not exist, and mails a DSN back to the return-path. Those never
 * reach the dispatcher, so without this endpoint the bounce rate reads lower
 * than it is — and a list quietly rots while the dashboard says everything is
 * fine.
 *
 * This is the seam for whatever notices those DSNs. Point one of these at it:
 *
 *   * a provider webhook, if your SMTP host offers one
 *   * a scheduled script that reads the bounce mailbox over IMAP and POSTs
 *     each Return-Path address here
 *   * a manual call, when someone forwards you a bounce by hand
 *
 * Authenticated with the same dispatcher secret as /api/email/dispatch: this
 * writes to the suppression list, and an open endpoint that can suppress
 * arbitrary addresses is a way to silently delete somebody's list.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireWorker, getWorkerSupabase } from "@/src/lib/email/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface BounceInput {
  email?: string;
  /** "hard" removes the address from all future sends; "soft" only counts. */
  type?: "hard" | "soft";
  detail?: string;
  /** Raw DSN status like "5.1.1" — classified when `type` is not given. */
  status?: string;
}

/**
 * RFC 3463 enhanced status codes: 5.x.x is permanent, 4.x.x is transient. The
 * distinction is the whole decision — treating a full mailbox as a dead address
 * loses a real contact, and treating a dead address as transient keeps mailing
 * a black hole, which is what tanks a sender reputation.
 */
function classify(input: BounceInput): "hard" | "soft" {
  if (input.type === "hard" || input.type === "soft") return input.type;
  const code = (input.status || "").trim();
  if (/^4\./.test(code)) return "soft";
  if (/^5\.2\.2$/.test(code)) return "soft"; // mailbox full
  if (/^5\./.test(code)) return "hard";

  const detail = (input.detail || "").toLowerCase();
  if (/mailbox full|over quota|quota exceeded|temporarily deferred|try again/.test(detail)) return "soft";
  if (/user unknown|no such user|does not exist|invalid recipient|address rejected/.test(detail)) return "hard";
  return "hard";
}

export async function POST(request: NextRequest) {
  const auth = requireWorker(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: BounceInput | BounceInput[];
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const entries = Array.isArray(body) ? body : [body];
  const supabase = getWorkerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured on the server" }, { status: 503 });
  }

  const recorded: string[] = [];
  const rejected: string[] = [];

  for (const entry of entries) {
    const email = (entry.email || "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
      rejected.push(entry.email || "(empty)");
      continue;
    }

    const { error } = await supabase.rpc("record_email_bounce", {
      p_secret: auth.secret,
      p_email: email,
      p_type: classify(entry),
      p_detail: (entry.detail || entry.status || "").slice(0, 500) || null,
    });

    if (error) {
      console.error("Bounce recording failed", email, error.message);
      rejected.push(email);
    } else {
      recorded.push(email);
    }
  }

  return NextResponse.json({ ok: rejected.length === 0, recorded: recorded.length, rejected });
}
