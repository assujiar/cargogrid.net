/**
 * Removes addresses that provably cannot receive mail, before they are sent to.
 *
 * A domain with no MX record and no A record has nowhere to deliver mail — RFC
 * 5321 falls back to the A record when MX is absent, so failing both is
 * conclusive. Every message to such an address is a guaranteed hard bounce, and
 * hard bounces are the single fastest way to lose a sending reputation: the
 * mailbox provider does not care that the list was honestly acquired, only that
 * a fifth of it does not exist.
 *
 * This is the cheap half of list hygiene and the only half that can be done
 * without sending anything. It cannot detect a dead mailbox at a live domain
 * (budi@ptmaju.co.id when Budi left in 2019) — only a real bounce reveals
 * those, which is what /api/email/bounce is for.
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as dns } from "node:dns";
import { requireAdmin } from "@/src/lib/email/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Hundreds of DNS lookups; well past the default serverless budget.
export const maxDuration = 300;

/** Concurrent DNS lookups. High enough to be quick, low enough to stay polite. */
const CONCURRENCY = 25;

async function domainAcceptsMail(domain: string): Promise<boolean> {
  try {
    const mx = await dns.resolveMx(domain);
    if (mx.length > 0 && mx.some((record) => record.exchange)) return true;
  } catch {
    // No MX is not yet a verdict — fall through to the A-record fallback.
  }

  // RFC 5321 §5.1: with no MX, the A record is the implicit mail exchanger.
  try {
    await dns.resolve4(domain);
    return true;
  } catch {
    return false;
  }
}

async function findDeadDomains(domains: string[]): Promise<string[]> {
  const dead: string[] = [];
  let cursor = 0;

  const worker = async () => {
    while (cursor < domains.length) {
      const domain = domains[cursor++];
      if (!(await domainAcceptsMail(domain))) dead.push(domain);
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return dead.sort();
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  let body: { apply?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    // A bare POST means "just report", which is the safer default anyway.
  }

  const supabase = admin.ctx.supabase;

  const { data: rows, error } = await supabase
    .from("email_contacts")
    .select("email")
    .eq("status", "subscribed");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const emails = ((rows || []) as Array<{ email: string }>).map((r) => r.email);
  const domains = Array.from(new Set(emails.map((e) => e.split("@")[1]).filter(Boolean)));

  const dead = await findDeadDomains(domains);
  const deadSet = new Set(dead);
  const affected = emails.filter((e) => deadSet.has(e.split("@")[1]));

  // Reporting is the default; cleaning only happens when explicitly asked for.
  // A DNS blip that briefly made 300 domains look dead should cost a confusing
  // report, not a deleted list.
  if (!body.apply || affected.length === 0) {
    return NextResponse.json({
      applied: false,
      checkedDomains: domains.length,
      deadDomains: dead,
      affectedContacts: affected.length,
    });
  }

  const { error: cancelError } = await supabase
    .from("email_campaign_recipients")
    .update({
      status: "cancelled",
      last_error: "Domain tidak punya MX/A record — pengiriman pasti gagal",
    })
    .eq("status", "queued")
    .in("email", affected);

  const { error: cleanError } = await supabase
    .from("email_contacts")
    .update({ status: "cleaned", updated_at: new Date().toISOString() })
    .in("email", affected);

  // Suppress as well as clean: the contact row can be re-imported from a fresh
  // CSV tomorrow, and without this it would come back as subscribed.
  const { error: suppressError } = await supabase.from("email_suppressions").upsert(
    affected.map((email) => ({
      email,
      reason: "manual",
      detail: `Domain mati (tanpa MX/A record) per pemindaian ${new Date().toISOString().slice(0, 10)}`,
    })),
    { onConflict: "email", ignoreDuplicates: true },
  );

  const failure = cancelError || cleanError || suppressError;
  if (failure) {
    return NextResponse.json({ error: failure.message }, { status: 500 });
  }

  return NextResponse.json({
    applied: true,
    checkedDomains: domains.length,
    deadDomains: dead,
    affectedContacts: affected.length,
  });
}
