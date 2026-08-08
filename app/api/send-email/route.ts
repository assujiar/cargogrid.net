import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/src/lib/mailer";

export const runtime = "nodejs";

/**
 * Generic relay for the site's transactional mail (questionnaire completion
 * alerts, meeting invitations). It is called from the browser by anonymous
 * visitors, because those flows legitimately originate client-side — see
 * addEmailLog() in src/lib/storage.ts.
 *
 * That makes it an unauthenticated send endpoint, which is worth being explicit
 * about: anyone who finds it can post a body and have this server deliver it,
 * signed by our domain. The cap below is what stops that from becoming a spam
 * relay. It matters more than it looks — every message sent through a hijacked
 * relay is charged against the same SMTP reputation the marketing blasts
 * depend on, so an abused endpoint here silently kills deliverability there.
 *
 * The limit is deliberately loose. A real visitor triggers one or two sends in
 * a session; anything approaching a dozen an hour from one address is not the
 * questionnaire flow.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 12;

/**
 * In-process, so it resets on every cold start and is not shared between
 * serverless instances. That is a real weakness and not one worth papering
 * over with a database round-trip on the transactional path: this raises the
 * cost of abuse from free to inconvenient, which is the goal. The durable fix
 * is authenticating these two flows so the endpoint can stop being public at
 * all.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((at) => now - at < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic sweep so a long-lived instance does not accumulate an entry
  // per address that ever hit it.
  if (hits.size > 5000) {
    for (const [key, stamps] of hits) {
      if (stamps.every((at) => now - at >= WINDOW_MS)) hits.delete(key);
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many email requests, try again later" }, { status: 429 });
  }

  const { to, subject, html } = await request.json();

  if (!to || !subject || !html) {
    return NextResponse.json({ error: "Missing to, subject, or html" }, { status: 400 });
  }

  const result = await sendMail({ to, subject, html });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status || 502 });
  }

  return NextResponse.json({ ok: true });
}
