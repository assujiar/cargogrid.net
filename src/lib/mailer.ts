/**
 * Server-only SMTP delivery helper.
 *
 * Shared by app/api/send-email (the generic relay the admin portal uses),
 * app/api/inquiry (which sends the lead-capture emails inline, without a second
 * network hop back through the public API) and app/api/email/dispatch (the
 * marketing blast worker).
 */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export interface MailResult {
  ok: boolean;
  /** HTTP status to surface when `ok` is false. */
  status?: number;
  error?: string;
  /** Message-ID assigned by the receiving MTA, when it gave one. */
  messageId?: string;
  /**
   * How the failure should be treated by the blast queue:
   *   bounce → the address is bad, stop mailing it
   *   retry  → the server was busy or unreachable, try again later
   *   fatal  → our own fault (bad config, malformed message); retrying is pointless
   */
  failure?: "bounce" | "retry" | "fatal";
  /** Only meaningful when `failure` is "bounce". */
  bounceType?: "hard" | "soft";
}

export interface MailInput {
  to: string;
  subject: string;
  html: string;
  /** Plain-text alternative. Its absence is itself a spam signal, so the blast
   *  worker always supplies one — see src/lib/email/render.ts. */
  text?: string;
  /** Overrides SMTP_FROM. The mailbox part still has to be the authenticated
   *  account or most providers reject the message outright. */
  from?: string;
  replyTo?: string;
  /** List-Unsubscribe and friends. Gmail and Yahoo now require these on bulk
   *  mail, and their absence alone can route a campaign to spam. */
  headers?: Record<string, string>;
}

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

/** The address the server is actually allowed to send as. */
export function getDefaultFrom(): string {
  return process.env.SMTP_FROM || process.env.SMTP_USER || "";
}

interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

function readSmtpSettings(): SmtpSettings | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  return { host, port, secure, user, pass };
}

/**
 * A blast sends dozens of messages a few minutes apart. Opening a fresh TCP +
 * TLS + AUTH conversation for each one is both slow and the pattern providers
 * rate-limit hardest, so the pooled transport is reused across a batch.
 *
 * Keyed on the settings themselves: if the environment changes under a running
 * process, the next call builds a new transport rather than silently using the
 * old credentials.
 */
let pooled: { key: string; transporter: Transporter } | null = null;

function getTransporter(settings: SmtpSettings): Transporter {
  const key = `${settings.host}:${settings.port}:${settings.secure}:${settings.user}`;
  if (pooled?.key === key) return pooled.transporter;

  pooled?.transporter.close();
  const transporter = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: { user: settings.user, pass: settings.pass },
    pool: true,
    maxConnections: 1,
    // The queue already paces sends; this is a second ceiling so a bug in the
    // scheduler cannot turn into a burst the provider reads as an attack.
    maxMessages: 50,
    rateDelta: 1000,
    rateLimit: 1,
  });

  pooled = { key, transporter };
  return transporter;
}

/**
 * Classifies an SMTP failure into something the queue can act on.
 *
 * The distinction that matters is 5xx vs 4xx. A 5xx is the receiving server
 * saying "this address will never work" — retrying it burns reputation and the
 * address belongs on the suppression list. A 4xx is "not right now", which is
 * a greylist, a full mailbox or a busy server, and clears on its own.
 */
function classifyError(error: unknown): { failure: MailResult["failure"]; bounceType?: "hard" | "soft"; message: string } {
  const err = error as { responseCode?: number; code?: string; command?: string; message?: string };
  const message = err?.message || String(error);
  const responseCode = err?.responseCode;

  if (typeof responseCode === "number") {
    if (responseCode >= 500) {
      // 550/551/553 are "no such user"/"not local"; 552 is over quota, which is
      // the mailbox's problem rather than the address's.
      const soft = responseCode === 552 || responseCode === 554;
      return { failure: "bounce", bounceType: soft ? "soft" : "hard", message };
    }
    if (responseCode >= 400) {
      return { failure: "retry", message };
    }
  }

  // Transport-level problems: DNS, refused connection, timeouts, TLS. The
  // remote address told us nothing, so this says nothing about the recipient.
  if (["ECONNECTION", "ETIMEDOUT", "ESOCKET", "ECONNRESET", "EDNS", "ECONNREFUSED"].includes(err?.code || "")) {
    return { failure: "retry", message };
  }

  // Authentication failures are ours, not the recipient's: every retry would
  // fail identically and the provider counts them towards a lockout.
  if (err?.code === "EAUTH") {
    return { failure: "fatal", message };
  }

  return { failure: "retry", message };
}

export async function sendMail({ to, subject, html, text, from, replyTo, headers }: MailInput): Promise<MailResult> {
  const settings = readSmtpSettings();
  if (!settings) {
    return { ok: false, status: 503, error: "SMTP is not configured on the server", failure: "fatal" };
  }

  const transporter = getTransporter(settings);

  try {
    const info = await transporter.sendMail({
      from: from || getDefaultFrom(),
      to,
      subject,
      html,
      text,
      replyTo,
      headers,
    });

    // A message can be accepted for some recipients and refused for others in
    // the same conversation. With one recipient per send that means a rejection
    // here is a rejection of this address.
    if (info.rejected?.length) {
      return {
        ok: false,
        status: 502,
        error: `Recipient rejected: ${info.response || "no response"}`,
        failure: "bounce",
        bounceType: "hard",
      };
    }

    return { ok: true, messageId: info.messageId };
  } catch (error) {
    const { failure, bounceType, message } = classifyError(error);
    console.error("Failed to send email via SMTP", error);
    return {
      ok: false,
      status: 502,
      error: message || "Failed to send email",
      failure,
      bounceType,
    };
  }
}

/**
 * Opens a connection and authenticates without sending anything. Used by the
 * admin portal's SMTP panel so "is the mail server actually reachable" can be
 * answered without mailing somebody.
 */
export async function verifySmtp(): Promise<MailResult> {
  const settings = readSmtpSettings();
  if (!settings) {
    return { ok: false, status: 503, error: "SMTP is not configured on the server" };
  }

  try {
    await getTransporter(settings).verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, status: 502, error: (error as Error)?.message || "SMTP verification failed" };
  }
}
