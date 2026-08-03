/**
 * Server-only SMTP delivery helper.
 *
 * Shared by app/api/send-email (the generic relay the admin portal uses) and
 * app/api/inquiry (which sends the lead-capture emails inline, without a second
 * network hop back through the public API).
 */

import nodemailer from "nodemailer";

export interface MailResult {
  ok: boolean;
  /** HTTP status to surface when `ok` is false. */
  status?: number;
  error?: string;
}

export interface MailInput {
  to: string;
  subject: string;
  html: string;
}

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendMail({ to, subject, html }: MailInput): Promise<MailResult> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const secure = process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  if (!host || !user || !pass) {
    return { ok: false, status: 503, error: "SMTP is not configured on the server" };
  }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

  try {
    await transporter.sendMail({ from, to, subject, html });
    return { ok: true };
  } catch (error) {
    console.error("Failed to send email via SMTP", error);
    return { ok: false, status: 502, error: "Failed to send email" };
  }
}
