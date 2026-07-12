import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// Preferred delivery path: the Resend HTTP API (https://resend.com). Unlike the hosting
// provider's SMTP relay (MailChannels), Resend is not subject to the domain-lockdown
// policy that rejects app-originated mail to external recipients.
async function sendViaResend(from: string, to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || `Resend API responded with ${res.status}`);
  }
}

async function sendViaSmtp(from: string, to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user: user!, pass: pass! },
  });

  await transporter.sendMail({ from, to, subject, html });
}

export async function POST(request: NextRequest) {
  const { to, subject, html } = await request.json();

  if (!to || !subject || !html) {
    return NextResponse.json({ error: "Missing to, subject, or html" }, { status: 400 });
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "CargoGrid OS <service@cargogrid.net>";
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  if (!hasResend && !hasSmtp) {
    return NextResponse.json({ error: "No email provider is configured on the server" }, { status: 503 });
  }

  try {
    if (hasResend) {
      await sendViaResend(from, to, subject, html);
    } else {
      await sendViaSmtp(from, to, subject, html);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send email", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
  }
}
