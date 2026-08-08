/**
 * Click-tracking redirect.
 *
 * Records the click, then sends the reader on. The recording is best-effort and
 * the redirect is not: someone who clicked a link in our email must arrive
 * where the link said, even if the database is down.
 *
 * The redirect target is validated against an allowlist rather than simply
 * echoed. A tracking redirect that forwards to any URL handed to it is an open
 * redirect — worth something to a phisher precisely because the link starts on
 * a domain the recipient trusts, and enough on its own to get that domain
 * flagged by the filters this whole feature depends on.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPublicSupabase } from "@/src/lib/email/auth";
import { getAppBaseUrl } from "@/src/lib/appUrl";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hosts a campaign link is allowed to point at. Anything else is refused rather
 * than redirected — including the redirect-chain trick of an allowed host with
 * an off-site `?url=` parameter, which is why only the hostname is trusted and
 * the rest of the URL is passed through untouched.
 */
function isAllowedTarget(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const allowed = new Set<string>(["cargogrid.net", "www.cargogrid.net"]);

  // Whatever origin this deployment actually runs on, so preview deployments
  // and local dev track their own links instead of refusing them.
  try {
    allowed.add(new URL(getAppBaseUrl()).hostname);
  } catch {
    /* getAppBaseUrl always returns something parseable; ignore defensively */
  }

  for (const extra of (process.env.EMAIL_LINK_ALLOWED_HOSTS || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean)) {
    allowed.add(extra);
  }

  const host = url.hostname.toLowerCase();
  const ok = Array.from(allowed).some((a) => host === a || host.endsWith(`.${a}`));
  return ok ? url : null;
}

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
  const target = request.nextUrl.searchParams.get("u") || "";
  const home = getAppBaseUrl();

  const destination = isAllowedTarget(target);
  if (!destination) {
    // Refusing beats redirecting: an unrecognised target is either a mistake in
    // the campaign or somebody trying to borrow our domain.
    return NextResponse.redirect(home, 302);
  }

  if (token && token !== "preview") {
    try {
      const supabase = getPublicSupabase();
      if (supabase) {
        await supabase.rpc("record_email_click", {
          p_token: token,
          p_url: destination.toString(),
          p_user_agent: request.headers.get("user-agent") || null,
          p_ip_hash: await hashIp(request),
        });
      }
    } catch (error) {
      console.warn("Click tracking failed (non-blocking)", error);
    }
  }

  return NextResponse.redirect(destination.toString(), 302);
}
