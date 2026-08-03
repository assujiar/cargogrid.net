import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase, getSupabaseHost, describeFetchFailure, truncateDetail } from "@/src/lib/supabaseService";
import { toInquiry, type InquiryRow } from "@/src/lib/inquiryRow";
import { generateHtmlEmailTemplate } from "@/src/lib/emailTemplates";
import { sendMail } from "@/src/lib/mailer";
import type { Inquiry } from "@/src/lib/storage";

export const runtime = "nodejs";

const ADMIN_ALERT_ADDRESS = "service@cargogrid.net";

type InquiryPayload = Omit<Inquiry, "id" | "status" | "createdAt" | "updatedAt">;

const asString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const asOptionalString = (value: unknown): string | undefined => asString(value) || undefined;

/**
 * Creates a lead-capture inquiry.
 *
 * This runs server-side on purpose. The browser used to call the Supabase REST
 * endpoint directly, which meant every submission depended on a cross-origin
 * request to *.supabase.co succeeding from the visitor's network — any DNS
 * hiccup, corporate proxy, privacy extension or content blocker surfaces there
 * as an opaque `TypeError: Failed to fetch` with no status code and no way for
 * the form to explain what went wrong. Going through this same-origin route
 * means the only request the visitor's browser makes is to cargogrid.net
 * itself, and every failure comes back as a real HTTP status the UI can report.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload: InquiryPayload = {
    name: asString(body.name),
    company: asString(body.company),
    role: asString(body.role),
    email: asString(body.email),
    phone: asString(body.phone),
    companyType: asString(body.companyType),
    shipmentVolume: asString(body.shipmentVolume),
    biggestPain: asString(body.biggestPain),
    lang: body.lang === "en" ? "en" : "id",
    utmSource: asOptionalString(body.utmSource),
    utmMedium: asOptionalString(body.utmMedium),
    utmCampaign: asOptionalString(body.utmCampaign),
    utmTerm: asOptionalString(body.utmTerm),
    utmContent: asOptionalString(body.utmContent),
  };

  const missing = (["name", "company", "email", "phone"] as const).filter((field) => !payload[field]);
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required field(s): ${missing.join(", ")}` }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    console.error("Inquiry submission rejected: Supabase env vars are not configured on the server");
    return NextResponse.json({ error: "Inquiry storage is not configured on the server" }, { status: 503 });
  }

  const { data, error } = await supabase.rpc("create_inquiry", {
    p_name: payload.name, p_company: payload.company, p_role: payload.role, p_email: payload.email, p_phone: payload.phone,
    p_company_type: payload.companyType, p_shipment_volume: payload.shipmentVolume, p_biggest_pain: payload.biggestPain,
    p_lang: payload.lang, p_utm_source: payload.utmSource, p_utm_medium: payload.utmMedium,
    p_utm_campaign: payload.utmCampaign, p_utm_term: payload.utmTerm, p_utm_content: payload.utmContent,
  }).single();

  if (error) {
    console.error("create_inquiry failed", error);
    // `detail` is for whoever runs the site (it lands in the browser console and
    // the Vercel logs); the visitor-facing copy stays generic.
    return NextResponse.json(
      { error: "Could not store the inquiry", detail: truncateDetail(error.message) || "Unknown Supabase error" },
      { status: 502 },
    );
  }

  const inquiry = toInquiry(data as InquiryRow);

  // Notifications are best-effort: a mail or audit-log problem must never cost
  // us the lead that is already safely stored above.
  await Promise.allSettled([
    deliver(
      inquiry.email,
      "[CargoGrid OS] Registrasi Audit Sistem Berhasil - Lengkapi Kuesioner Kebutuhan Anda",
      generateHtmlEmailTemplate("customer_welcome", { inquiry }),
      "customer_welcome",
      supabase,
    ),
    deliver(
      ADMIN_ALERT_ADDRESS,
      `🚨 [CargoGrid ALERT] Inquiry Baru Masuk - ${inquiry.company}`,
      generateHtmlEmailTemplate("admin_alert_new", { inquiry }),
      "admin_alert_new",
      supabase,
    ),
  ]);

  return NextResponse.json({ inquiry });
}

/**
 * Connectivity check for the inquiry pipeline: `GET /api/inquiry`.
 *
 * Exists because the interesting failure is upstream of this app — if the
 * Supabase host does not resolve, every submission fails identically and the
 * only clue the browser gets is "fetch failed". This says so directly, without
 * writing a row. Returns only the host (already a NEXT_PUBLIC_ value) and the
 * transport error; never a key.
 */
export async function GET() {
  const host = getSupabaseHost();
  const supabase = getServiceSupabase();

  if (!supabase) {
    return NextResponse.json(
      { ok: false, configured: false, host, reason: "Supabase env vars are missing or malformed on the server" },
      { status: 503 },
    );
  }

  try {
    // Any RPC round-trip proves the transport works; a Postgres-level error
    // still means we reached the database, which is what this check is about.
    const { error } = await supabase.rpc("get_inquiry_by_id", {
      p_id: "00000000-0000-0000-0000-000000000000",
    }).maybeSingle();

    if (error) {
      return NextResponse.json(
        { ok: false, configured: true, reachable: false, host, reason: truncateDetail(error.message) },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, configured: true, reachable: true, host });
  } catch (err) {
    return NextResponse.json(
      { ok: false, configured: true, reachable: false, host, reason: describeFetchFailure(err) },
      { status: 502 },
    );
  }
}

async function deliver(
  to: string,
  subject: string,
  html: string,
  type: "customer_welcome" | "admin_alert_new",
  supabase: NonNullable<ReturnType<typeof getServiceSupabase>>,
) {
  const { error } = await supabase.rpc("log_email", {
    p_to_address: to, p_subject: subject, p_html_body: html, p_type: type,
  });
  if (error) console.warn("Email log recording failed (non-blocking):", error.message);

  const result = await sendMail({ to, subject, html });
  if (!result.ok) console.warn("Email delivery failed (non-blocking):", result.error);
}
