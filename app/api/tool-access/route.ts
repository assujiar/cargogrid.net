import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase, getSupabaseHost, describeFetchFailure, truncateDetail } from "@/src/lib/supabaseService";
import { validateToolLead, type ToolLead } from "@/src/lib/toolLead";

export const runtime = "nodejs";

const asString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

/** Attribution arrives from a query string, so it is attacker-controllable and gets capped. */
const asCapped = (value: unknown, max = 255): string | null => asString(value).slice(0, max) || null;

/**
 * Records the contact details a visitor supplies to unlock a calculator.
 *
 * Same shape as /api/inquiry and for the same reason: keeping the request
 * same-origin means every failure comes back as a real HTTP status the form can
 * explain, instead of the bare `TypeError: Failed to fetch` that a direct call
 * to *.supabase.co produces behind a corporate proxy or a content blocker.
 *
 * Validation is repeated here rather than trusted from the browser. The client
 * check exists to give the visitor a useful message; this one exists because
 * anyone can post to this route.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const lead: ToolLead = {
    name: asString(body.name),
    company: asString(body.company),
    email: asString(body.email),
    phone: asString(body.phone),
  };

  const errors = validateToolLead(lead);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Data kontak belum lengkap.", fields: errors }, { status: 422 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Layanan penyimpanan belum dikonfigurasi. Coba lagi nanti atau hubungi kami langsung." },
      { status: 503 },
    );
  }

  try {
    const { data, error } = await supabase.rpc("record_tool_lead", {
      p_name: lead.name,
      p_company: lead.company,
      p_email: lead.email,
      p_phone: lead.phone,
      p_tool_slug: asCapped(body.toolSlug, 80),
      p_lang: asCapped(body.lang, 5),
      p_utm_source: asCapped(body.utmSource),
      p_utm_medium: asCapped(body.utmMedium),
      p_utm_campaign: asCapped(body.utmCampaign),
      p_utm_term: asCapped(body.utmTerm),
      p_utm_content: asCapped(body.utmContent),
      p_landing_page: asCapped(body.landingPage, 2000),
      p_referrer: asCapped(body.referrer, 2000),
      p_ga_client_id: asCapped(body.gaClientId),
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Gagal menyimpan data. Coba beberapa saat lagi.",
          detail: truncateDetail(`${error.code || ""} ${error.message}`.trim()),
          host: getSupabaseHost(),
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ id: data ?? null }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Tidak bisa menghubungi layanan penyimpanan.",
        detail: truncateDetail(describeFetchFailure(err)),
        host: getSupabaseHost(),
      },
      { status: 502 },
    );
  }
}
