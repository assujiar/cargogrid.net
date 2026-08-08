/**
 * Sends one campaign draft to an address the admin picks.
 *
 * The point is not to verify that SMTP works — /api/email/smtp-status does that
 * without mailing anyone. The point is that the only honest preview of an email
 * is the email: the composer's iframe cannot tell you that Outlook collapses
 * your table, that Gmail clips the message, or that the merge tags resolve to
 * empty strings for half the list.
 *
 * Rendered through exactly the same path as a real campaign send, minus the
 * tracking, so what arrives is what the list would receive.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/email/auth";
import { getAppBaseUrl } from "@/src/lib/appUrl";
import { sendMail, isSmtpConfigured, getDefaultFrom, verifySmtp } from "@/src/lib/mailer";
import { renderCampaignEmail, buildBulkHeaders, PREVIEW_MERGE } from "@/src/lib/email/render";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Test sends bypass the campaign queue, so they get their own modest ceiling. */
const MAX_TEST_RECIPIENTS = 5;

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  if (!isSmtpConfigured()) {
    return NextResponse.json({ error: "SMTP belum dikonfigurasi di server" }, { status: 503 });
  }

  let body: {
    to?: string;
    subject?: string;
    html?: string;
    preheader?: string;
    fromName?: string;
    replyTo?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const recipients = (body.to || "")
    .split(/[,;\s]+/)
    .map((address) => address.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    return NextResponse.json({ error: "Alamat tujuan tes belum diisi" }, { status: 400 });
  }
  if (recipients.length > MAX_TEST_RECIPIENTS) {
    return NextResponse.json(
      { error: `Maksimal ${MAX_TEST_RECIPIENTS} alamat untuk pengiriman tes` },
      { status: 400 },
    );
  }
  const invalid = recipients.filter((address) => !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(address));
  if (invalid.length) {
    return NextResponse.json({ error: `Alamat tidak valid: ${invalid.join(", ")}` }, { status: 400 });
  }
  if (!body.subject?.trim() || !body.html?.trim()) {
    return NextResponse.json({ error: "Subjek dan isi email wajib diisi" }, { status: 400 });
  }

  const fallbackFrom = getDefaultFrom();
  const mailbox = fallbackFrom.match(/<([^>]+)>/)?.[1] || fallbackFrom;
  const from = body.fromName?.trim() ? `${body.fromName.trim()} <${mailbox}>` : fallbackFrom;

  const rendered = renderCampaignEmail({
    html: body.html,
    subject: body.subject,
    preheader: body.preheader,
    merge: PREVIEW_MERGE,
    baseUrl: getAppBaseUrl(),
    // No token: a test must never pollute a campaign's open and click figures.
    preview: true,
  });

  const results: Array<{ to: string; ok: boolean; error?: string }> = [];
  for (const to of recipients) {
    const result = await sendMail({
      to,
      subject: `[TES] ${rendered.subject}`,
      html: rendered.html,
      text: rendered.text,
      from,
      replyTo: body.replyTo?.trim() || undefined,
      headers: buildBulkHeaders(rendered.unsubscribeUrl, from),
    });
    results.push({ to, ok: result.ok, error: result.error });
  }

  const sent = results.filter((r) => r.ok).length;
  return NextResponse.json(
    {
      ok: sent > 0,
      sent,
      failed: results.length - sent,
      results,
    },
    { status: sent > 0 ? 200 : 502 },
  );
}

/** Connect-and-authenticate probe for the SMTP panel. Sends nothing. */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const configured = isSmtpConfigured();
  if (!configured) {
    return NextResponse.json({ configured: false, reachable: false, error: "SMTP belum dikonfigurasi" });
  }

  const result = await verifySmtp();
  return NextResponse.json({
    configured: true,
    reachable: result.ok,
    from: getDefaultFrom(),
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === "true" : Number(process.env.SMTP_PORT || 465) === 465,
    error: result.ok ? undefined : result.error,
  });
}
