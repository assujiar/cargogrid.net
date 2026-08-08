/**
 * Unsubscribe endpoint — the one link in a campaign that must never fail.
 *
 * Serves three callers from one URL:
 *
 *   GET             a human clicking the footer link. Renders a confirmation
 *                   page and unsubscribes on the spot.
 *   POST            Gmail/Yahoo one-click, triggered by the List-Unsubscribe-Post
 *                   header. No page, no confirmation, just 200.
 *   GET ?confirm=0  the same page after the fact, for the resubscribe link.
 *
 * The GET path opts the recipient out immediately rather than showing a "click
 * here to confirm" button first. A two-step opt-out is a dark pattern, and the
 * people who abandon at step two are exactly the people who press "report spam"
 * instead — which costs the sending domain far more than one lost address.
 *
 * The page is rendered as a plain HTML string rather than as a React route
 * because it has to work when the reader is offline from our app entirely: no
 * hydration, no JS, no session, no layout.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPublicSupabase } from "@/src/lib/email/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface UnsubscribeTarget {
  email: string;
  campaign_name: string | null;
  already_unsubscribed: boolean;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Mirrors the site's neumorphic look without pulling in the app's CSS bundle. */
function page(title: string, body: string, status = 200): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>${escapeHtml(title)} · CargoGrid OS</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 24px; background: #eaf0f6;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Arial, sans-serif;
    color: #2d3b4a;
  }
  .card {
    width: 100%; max-width: 460px; background: #eaf0f6; border-radius: 24px; padding: 40px 32px;
    box-shadow: 12px 12px 24px #cdd4db, -12px -12px 24px #ffffff;
    border: 1.5px solid rgba(255,255,255,.95); text-align: center;
  }
  .badge {
    width: 56px; height: 56px; border-radius: 18px; margin: 0 auto 20px; display: flex;
    align-items: center; justify-content: center; font-size: 26px; background: rgba(0,109,128,.1);
  }
  h1 { font-size: 20px; font-weight: 800; margin: 0 0 12px; letter-spacing: -.02em; }
  p { font-size: 13px; line-height: 1.7; color: #5b6b7c; margin: 0 0 10px; font-weight: 500; }
  .mail {
    display: inline-block; margin: 6px 0 18px; padding: 8px 14px; border-radius: 10px;
    background: #fff; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px; font-weight: 700; color: #006d80; word-break: break-all;
  }
  form { margin-top: 18px; }
  .reason {
    width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid #d8e0e8;
    background: #fff; font-size: 13px; font-family: inherit; color: #2d3b4a; resize: vertical;
  }
  button {
    margin-top: 12px; width: 100%; padding: 14px; border: 0; border-radius: 12px; cursor: pointer;
    background: #006d80; color: #fff; font-size: 12px; font-weight: 800; letter-spacing: .08em;
    text-transform: uppercase; font-family: inherit;
  }
  button:hover { background: #00566b; }
  .link { display: inline-block; margin-top: 18px; font-size: 12px; font-weight: 700; color: #006d80; }
  .foot { margin-top: 24px; font-size: 11px; color: #8b98a5; }
</style>
</head>
<body><div class="card">${body}</div></body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function invalidPage(): NextResponse {
  return page(
    "Tautan tidak valid",
    `<div class="badge">⚠️</div>
     <h1>Tautan tidak dikenali</h1>
     <p>Tautan berhenti berlangganan ini sudah tidak berlaku atau salah ketik.</p>
     <p>Kirim email ke <a href="mailto:service@cargogrid.net" style="color:#006d80;font-weight:700;">service@cargogrid.net</a> dan kami akan menghapus alamat Anda secara manual.</p>
     <a class="link" href="https://www.cargogrid.net">← Kembali ke cargogrid.net</a>`,
    404,
  );
}

async function lookup(token: string): Promise<UnsubscribeTarget | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_email_unsubscribe_target", { p_token: token });
  if (error) {
    console.error("Unsubscribe lookup failed", error);
    return null;
  }
  const rows = (data || []) as UnsubscribeTarget[];
  return rows[0] || null;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t");
  if (!token) return invalidPage();

  if (token === "preview") {
    return page(
      "Pratinjau",
      `<div class="badge">👁️</div>
       <h1>Pratinjau tautan unsubscribe</h1>
       <p>Ini hanya pratinjau. Pada email sungguhan, tautan ini langsung menghentikan langganan penerima.</p>`,
    );
  }

  const target = await lookup(token);
  if (!target) return invalidPage();

  if (target.already_unsubscribed) {
    return page(
      "Sudah berhenti berlangganan",
      `<div class="badge">✅</div>
       <h1>Anda sudah berhenti berlangganan</h1>
       <p>Alamat berikut tidak akan menerima email pemasaran dari CargoGrid.</p>
       <div class="mail">${escapeHtml(target.email)}</div>
       <p class="foot">Email transaksional yang Anda minta sendiri — seperti konfirmasi kuesioner atau undangan meeting — tetap dikirim.</p>
       <a class="link" href="https://www.cargogrid.net">← Kembali ke cargogrid.net</a>`,
    );
  }

  const supabase = getPublicSupabase();
  const { error } = supabase
    ? await supabase.rpc("unsubscribe_email_token", { p_token: token, p_reason: null })
    : { error: new Error("Supabase not configured") };

  if (error) {
    console.error("Unsubscribe failed", error);
    return page(
      "Gagal memproses",
      `<div class="badge">⚠️</div>
       <h1>Gagal memproses permintaan</h1>
       <p>Terjadi kendala teknis. Silakan coba lagi, atau kirim email ke
          <a href="mailto:service@cargogrid.net" style="color:#006d80;font-weight:700;">service@cargogrid.net</a>
          dan kami hapus manual.</p>`,
      500,
    );
  }

  // The reason box is offered after the opt-out is already recorded, so nobody
  // has to fill in a form to be left alone.
  return page(
    "Berhenti berlangganan",
    `<div class="badge">👋</div>
     <h1>Berhasil berhenti berlangganan</h1>
     <p>Alamat berikut telah dihapus dari daftar email pemasaran CargoGrid.</p>
     <div class="mail">${escapeHtml(target.email)}</div>
     ${target.campaign_name ? `<p class="foot">Dari kampanye: ${escapeHtml(target.campaign_name)}</p>` : ""}
     <form method="POST" action="/api/email/unsubscribe?t=${encodeURIComponent(token)}&amp;feedback=1">
       <textarea class="reason" name="reason" rows="3" placeholder="Boleh ceritakan alasannya? (opsional)"></textarea>
       <button type="submit">Kirim Masukan</button>
     </form>
     <a class="link" href="https://www.cargogrid.net">← Kembali ke cargogrid.net</a>`,
  );
}

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  let reason: string | null = null;
  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      reason = ((await request.formData()).get("reason") as string) || null;
    } else if (contentType.includes("application/json")) {
      reason = (await request.json())?.reason ?? null;
    }
  } catch {
    // A one-click unsubscribe posts `List-Unsubscribe=One-Click` as its body,
    // which is neither JSON nor a form we care about. Proceeding without a
    // reason is the correct outcome, not an error.
  }

  const supabase = getPublicSupabase();
  if (supabase) {
    const { error } = await supabase.rpc("unsubscribe_email_token", {
      p_token: token,
      p_reason: reason ? String(reason).slice(0, 500) : null,
    });
    if (error) console.error("One-click unsubscribe failed", error);
  }

  // Feedback submitted from the page above lands back on a confirmation screen;
  // the mail client's one-click POST just wants a 200.
  if (request.nextUrl.searchParams.get("feedback")) {
    return page(
      "Terima kasih",
      `<div class="badge">🙏</div>
       <h1>Terima kasih atas masukannya</h1>
       <p>Masukan Anda membantu kami mengirim email yang lebih relevan.</p>
       <a class="link" href="https://www.cargogrid.net">← Kembali ke cargogrid.net</a>`,
    );
  }

  return NextResponse.json({ ok: true });
}
