/**
 * Turns a campaign body into the exact HTML one recipient receives.
 *
 * Isomorphic on purpose: the composer's preview pane and the dispatch worker
 * both call renderCampaignEmail(), so what an admin sees in the preview is
 * produced by the same code that produces what lands in the inbox. Any helper
 * added here must stay free of Node built-ins.
 */

import type { EmailContact } from "./types";

export interface MergeData {
  [key: string]: string | null | undefined;
}

export interface RenderOptions {
  html: string;
  subject: string;
  preheader?: string | null;
  merge: MergeData;
  /** Absolute origin for tracking and unsubscribe links, e.g. https://www.cargogrid.net */
  baseUrl: string;
  /** Per-recipient token. Absent in preview mode, which disables tracking. */
  token?: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
  /** Preview mode leaves the layout intact but never rewrites links. */
  preview?: boolean;
}

export interface RenderedEmail {
  html: string;
  text: string;
  subject: string;
  unsubscribeUrl: string;
}

/**
 * The merge fields the composer offers. `unsubscribe_url` is handled separately
 * because it resolves to a per-recipient URL rather than to contact data.
 */
export const MERGE_TAGS = [
  { tag: "name", label: "Nama kontak", example: "Budi Santoso" },
  { tag: "first_name", label: "Nama depan", example: "Budi" },
  { tag: "email", label: "Alamat email", example: "budi@perusahaan.co.id" },
  { tag: "company", label: "Nama perusahaan", example: "PT Logistik Nusantara" },
  { tag: "phone", label: "Nomor telepon", example: "+62 812 3456 7890" },
  { tag: "job_role", label: "Jabatan", example: "Operations Manager" },
  { tag: "unsubscribe_url", label: "Tautan berhenti berlangganan", example: "https://…/unsubscribe" },
] as const;

/** Values substituted into merge tags when previewing, so nothing renders blank. */
export const PREVIEW_MERGE: MergeData = {
  name: "Budi Santoso",
  first_name: "Budi",
  email: "budi@perusahaan.co.id",
  company: "PT Logistik Nusantara",
  phone: "+62 812 3456 7890",
  job_role: "Operations Manager",
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Replaces {{tag}} placeholders.
 *
 * Every substituted value is HTML-escaped. Merge data comes from an imported
 * CSV, which is to say from outside — a contact whose company is
 * `<script>…</script>` must not become a script tag in a mail we send under our
 * own domain. Unknown tags collapse to an empty string rather than being left
 * as literal braces, because `Halo {{nama}},` reaching a customer is worse than
 * `Halo ,`.
 */
export function applyMergeTags(template: string, merge: MergeData): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => {
    const value = merge[key];
    return value == null ? "" : escapeHtml(String(value));
  });
}

/** Same, for the subject line — no escaping, because a subject is plain text. */
export function applyMergeTagsPlain(template: string, merge: MergeData): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => {
    const value = merge[key];
    return value == null ? "" : String(value);
  });
}

export function mergeDataFromContact(contact: Partial<EmailContact> & { email: string }): MergeData {
  const name = contact.name || "";
  return {
    name,
    first_name: name.split(" ")[0] || "",
    email: contact.email,
    company: contact.company || "",
    phone: contact.phone || "",
    job_role: contact.job_role || "",
    ...(contact.custom_fields || {}),
  };
}

export function buildUnsubscribeUrl(baseUrl: string, token: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/api/email/unsubscribe?t=${encodeURIComponent(token)}`;
}

function buildOpenPixelUrl(baseUrl: string, token: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/api/email/track/open?t=${encodeURIComponent(token)}`;
}

function buildClickUrl(baseUrl: string, token: string, target: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/api/email/track/click?t=${encodeURIComponent(token)}&u=${encodeURIComponent(target)}`;
}

/**
 * Rewrites every http(s) href through the click tracker.
 *
 * Three kinds of link are deliberately left alone: mailto:/tel: (not clicks in
 * any meaningful sense), anchors, and the unsubscribe URL. Routing an opt-out
 * through a redirect adds a hop that can fail, and an unsubscribe link that
 * 500s is the one link in the message that absolutely must work.
 */
function rewriteLinks(html: string, baseUrl: string, token: string): string {
  return html.replace(/(<a\b[^>]*\bhref\s*=\s*)(["'])(.*?)\2/gi, (match, prefix: string, quote: string, href: string) => {
    const target = href.trim();
    if (!/^https?:\/\//i.test(target)) return match;
    if (target.includes("/api/email/unsubscribe")) return match;
    if (target.includes("{{")) return match; // still a merge tag; leave it to resolve first
    return `${prefix}${quote}${buildClickUrl(baseUrl, token, target)}${quote}`;
  });
}

/**
 * The preheader is the grey line an inbox shows after the subject. Without one,
 * clients grab the first text in the body — which for most templates is
 * "View in browser" or the alt text of a logo.
 *
 * The trailing run of zero-width joiners is the standard trick to stop the
 * client padding that preview line with whatever follows in the markup.
 */
function preheaderBlock(preheader: string): string {
  return (
    `<div style="display:none;font-size:1px;color:#eaf0f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">` +
    `${escapeHtml(preheader)}${"&#847;&zwnj;&nbsp;".repeat(30)}` +
    `</div>`
  );
}

/** Footer appended to every campaign: who sent this, and how to make it stop. */
function footerBlock(unsubscribeUrl: string): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid #d8e0e8;">
  <tr><td style="padding:20px 24px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#7a8794;text-align:center;">
    <strong style="color:#4a5c6e;">CargoGrid OS</strong><br />
    Sistem operasi logistik untuk freight forwarder &amp; 3PL Indonesia<br />
    <a href="https://www.cargogrid.net" style="color:#006d80;text-decoration:none;">www.cargogrid.net</a>
    &nbsp;·&nbsp;
    <a href="mailto:service@cargogrid.net" style="color:#006d80;text-decoration:none;">service@cargogrid.net</a>
    <br /><br />
    Anda menerima email ini karena terdaftar di daftar kontak CargoGrid.<br />
    <a href="${unsubscribeUrl}" style="color:#7a8794;text-decoration:underline;">Berhenti berlangganan</a>
  </td></tr>
</table>`;
}

/**
 * Wraps the body in the table scaffolding desktop Outlook still needs. Word is
 * the rendering engine there, and it ignores most of what a flex/grid layout
 * would rely on — a centred 640px table is the only construction that renders
 * identically from Gmail to Outlook 2016.
 */
function wrapDocument(bodyHtml: string, subject: string, preheader: string | null | undefined): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="id">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="x-apple-disable-message-reformatting" />
<title>${escapeHtml(subject)}</title>
<style type="text/css">
  body { margin:0; padding:0; width:100% !important; background-color:#eaf0f6; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; }
  table { border-collapse:collapse !important; }
  a { color:#006d80; }
  @media only screen and (max-width:620px) {
    .cg-container { width:100% !important; }
    .cg-pad { padding-left:20px !important; padding-right:20px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#eaf0f6;">
${preheader ? preheaderBlock(preheader) : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eaf0f6;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" class="cg-container" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:640px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
      <tr><td class="cg-pad" style="padding:32px 40px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#2d3b4a;">
${bodyHtml}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/**
 * Plain-text alternative, derived from the HTML rather than authored separately.
 *
 * A multipart message whose text part is missing (or is "This email requires
 * HTML") is one of the strongest single spam signals there is, and hand-writing
 * a second copy of every campaign guarantees the two drift apart.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    // Keep the destination of a link: "CargoGrid" alone tells a text-only
    // reader nothing about where it was going to send them.
    .replace(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href: string, label: string) => {
      const text = label.replace(/<[^>]+>/g, "").trim();
      if (!text) return href;
      return href.startsWith("http") ? `${text} (${href})` : text;
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|tr|li|table)>/gi, "\n\n")
    .replace(/<li\b[^>]*>/gi, "• ")
    .replace(/<hr\s*\/?>/gi, "\n----------------\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&zwnj;/gi, "")
    .replace(/&#847;/gi, "")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Whether the body already carries the full document scaffolding. */
function isFullDocument(html: string): boolean {
  return /<html[\s>]/i.test(html) || /<!DOCTYPE/i.test(html);
}

export function renderCampaignEmail(options: RenderOptions): RenderedEmail {
  const {
    html,
    subject,
    preheader,
    merge,
    baseUrl,
    token,
    trackOpens = true,
    trackClicks = true,
    preview = false,
  } = options;

  const unsubscribeUrl = token
    ? buildUnsubscribeUrl(baseUrl, token)
    : `${baseUrl.replace(/\/+$/, "")}/api/email/unsubscribe?t=preview`;

  const mergeWithLinks: MergeData = { ...merge, unsubscribe_url: unsubscribeUrl };

  let body = applyMergeTags(html, mergeWithLinks);

  // A campaign authored as a full document is respected as-is; anything else
  // gets the responsive wrapper. Either way the footer is appended inside the
  // content area, never outside <html>.
  let document: string;
  if (isFullDocument(body)) {
    const footer = footerBlock(unsubscribeUrl);
    document = body.includes("</body>")
      ? body.replace("</body>", `${footer}</body>`)
      : body + footer;
  } else {
    document = wrapDocument(body + footerBlock(unsubscribeUrl), subject, preheader);
  }

  if (token && !preview) {
    if (trackClicks) document = rewriteLinks(document, baseUrl, token);
    if (trackOpens) {
      const pixel =
        `<img src="${buildOpenPixelUrl(baseUrl, token)}" width="1" height="1" alt="" ` +
        `style="display:block;width:1px;height:1px;border:0;" />`;
      document = document.includes("</body>")
        ? document.replace("</body>", `${pixel}</body>`)
        : document + pixel;
    }
  }

  body = document;

  return {
    html: body,
    text: htmlToText(body),
    subject: applyMergeTagsPlain(subject, mergeWithLinks),
    unsubscribeUrl,
  };
}

/**
 * Headers every bulk message needs.
 *
 * Gmail and Yahoo's 2024 bulk-sender rules make one-click unsubscribe a
 * requirement rather than a courtesy: without it, a recipient who wants out
 * reaches for "report spam" instead, and that is the metric that decides
 * whether the next campaign reaches an inbox at all.
 */
export function buildBulkHeaders(unsubscribeUrl: string, fromAddress: string): Record<string, string> {
  const mailbox = fromAddress.match(/<([^>]+)>/)?.[1] || fromAddress;
  return {
    "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:${mailbox}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    Precedence: "bulk",
    "Auto-Submitted": "auto-generated",
  };
}
