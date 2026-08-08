/**
 * Open-tracking pixel.
 *
 * Returns a 1x1 transparent GIF whatever happens — an unknown token, a dead
 * database, a malformed request. A tracking pixel that renders as a broken
 * image icon inside somebody's email is a worse outcome than losing the metric,
 * so every failure path here still produces the image.
 *
 * A caveat worth stating plainly, because the numbers this feeds are read as if
 * they were facts: open tracking under-counts and over-counts at the same time.
 * Gmail and most Apple Mail users have image proxying or Mail Privacy
 * Protection on, so real opens go unrecorded, while proxy prefetches record
 * opens nobody performed. Treat the trend as signal and the absolute number as
 * an estimate. Clicks are the honest metric.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPublicSupabase } from "@/src/lib/email/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 43-byte transparent GIF — the smallest thing that decodes as an image.
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

function pixelResponse(): NextResponse {
  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Content-Length": String(PIXEL.length),
      // Without this some clients fetch once, cache, and never report the
      // second open — and proxies would serve one recipient's pixel to another.
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

/**
 * Coarse fingerprint used only to tell two opens apart. Not reversible to an
 * address, and deliberately truncated: an IP is personal data under UU PDP
 * 27/2022, and we have no use for one beyond de-duplication.
 */
async function hashIp(request: NextRequest): Promise<string | null> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";
  if (!ip) return null;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`cargogrid:${ip}`));
  return Array.from(new Uint8Array(digest))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t");
  if (!token || token === "preview") return pixelResponse();

  try {
    const supabase = getPublicSupabase();
    if (supabase) {
      await supabase.rpc("record_email_open", {
        p_token: token,
        p_user_agent: request.headers.get("user-agent") || null,
        p_ip_hash: await hashIp(request),
      });
    }
  } catch (error) {
    console.warn("Open tracking failed (non-blocking)", error);
  }

  return pixelResponse();
}
