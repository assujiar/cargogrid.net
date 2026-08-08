/**
 * Deliverability report for a campaign draft.
 *
 * Two halves. The content heuristics in src/lib/email/spamCheck.ts also run in
 * the browser as you type; this route adds the half the browser cannot do —
 * looking up the sending domain's SPF, DKIM and DMARC records in DNS.
 *
 * Those three are worth more than every content rule combined. A campaign with
 * flawless copy from a domain with no SPF record is going to spam; a plain
 * message from a properly authenticated domain generally is not.
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as dns } from "node:dns";
import { requireAdmin } from "@/src/lib/email/auth";
import { checkSpamContent } from "@/src/lib/email/spamCheck";
import { getDefaultFrom } from "@/src/lib/mailer";
import type { SpamIssue, SpamReport } from "@/src/lib/email/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** DKIM selectors are chosen by the mail provider, so we probe the common ones. */
const DKIM_SELECTORS = ["default", "google", "selector1", "selector2", "mail", "dkim", "k1", "s1", "zoho", "titan"];

async function resolveTxt(name: string): Promise<string[]> {
  try {
    // A TXT record longer than 255 bytes arrives as several strings that have
    // to be concatenated — which is the normal case for SPF and DKIM.
    return (await dns.resolveTxt(name)).map((chunks) => chunks.join(""));
  } catch {
    return [];
  }
}

async function checkAuthDns(domain: string): Promise<SpamReport["auth"]> {
  const [rootTxt, dmarcTxt] = await Promise.all([resolveTxt(domain), resolveTxt(`_dmarc.${domain}`)]);

  const spfRecord = rootTxt.find((r) => r.toLowerCase().startsWith("v=spf1"));
  const dmarcRecord = dmarcTxt.find((r) => r.toLowerCase().startsWith("v=dmarc1"));
  const dmarcPolicy = dmarcRecord?.match(/\bp\s*=\s*(none|quarantine|reject)/i)?.[1]?.toLowerCase();

  const dkimResults = await Promise.all(
    DKIM_SELECTORS.map(async (selector) => ({
      selector,
      records: await resolveTxt(`${selector}._domainkey.${domain}`),
    })),
  );
  const dkimHit = dkimResults.find((r) => r.records.some((rec) => /v=dkim1|p=/i.test(rec)));

  return {
    domain,
    spf: {
      found: Boolean(spfRecord),
      record: spfRecord,
      note: spfRecord
        ? /[-~]all\s*$/.test(spfRecord.trim())
          ? undefined
          : 'Record tidak diakhiri "-all" atau "~all", sehingga pengirim lain tetap bisa memalsukan domain ini.'
        : undefined,
    },
    dmarc: {
      found: Boolean(dmarcRecord),
      record: dmarcRecord,
      policy: dmarcPolicy,
      note: dmarcPolicy === "none" ? 'Policy "p=none" hanya memantau dan tidak menolak pemalsuan.' : undefined,
    },
    dkim: {
      found: Boolean(dkimHit),
      selector: dkimHit?.selector,
      note: dkimHit
        ? undefined
        : `Tidak ditemukan pada selector umum (${DKIM_SELECTORS.slice(0, 5).join(", ")}, …). DKIM mungkin tetap aktif dengan selector khusus dari penyedia SMTP Anda.`,
    },
  };
}

/** Turns DNS findings into the same weighted issues the content check produces. */
function authIssues(auth: NonNullable<SpamReport["auth"]>): SpamIssue[] {
  const issues: SpamIssue[] = [];

  if (!auth.spf.found) {
    issues.push({
      id: "dns-spf", severity: "critical", weight: 3,
      title: "SPF tidak ditemukan",
      detail: `Domain ${auth.domain} tidak punya record SPF. Penerima tidak bisa memverifikasi bahwa server SMTP Anda berhak mengirim atas nama domain ini.`,
      fix: 'Tambahkan TXT record di root domain, mis. "v=spf1 include:<penyedia-smtp-anda> ~all".',
    });
  } else if (auth.spf.note) {
    issues.push({
      id: "dns-spf-soft", severity: "warning", weight: 0.8,
      title: "SPF tidak tegas", detail: auth.spf.note,
      fix: 'Akhiri record dengan "~all" (softfail) atau "-all" (hardfail).',
    });
  } else {
    issues.push({ id: "dns-spf", severity: "pass", weight: 0, title: "SPF aktif", detail: auth.spf.record || "" });
  }

  if (!auth.dmarc.found) {
    issues.push({
      id: "dns-dmarc", severity: "critical", weight: 2.5,
      title: "DMARC tidak ditemukan",
      detail: `Tidak ada record di _dmarc.${auth.domain}. Sejak 2024 Gmail dan Yahoo mensyaratkan DMARC untuk pengirim massal.`,
      fix: 'Tambahkan TXT di _dmarc: "v=DMARC1; p=none; rua=mailto:dmarc@cargogrid.net", lalu naikkan ke quarantine setelah laporan bersih.',
    });
  } else if (auth.dmarc.note) {
    issues.push({
      id: "dns-dmarc-none", severity: "info", weight: 0.4,
      title: "DMARC masih p=none", detail: auth.dmarc.note,
      fix: "Naikkan ke p=quarantine setelah beberapa minggu laporan bersih.",
    });
  } else {
    issues.push({
      id: "dns-dmarc", severity: "pass", weight: 0,
      title: `DMARC aktif (p=${auth.dmarc.policy})`, detail: auth.dmarc.record || "",
    });
  }

  if (!auth.dkim.found) {
    issues.push({
      id: "dns-dkim", severity: "warning", weight: 1.5,
      title: "DKIM tidak terdeteksi", detail: auth.dkim.note || "",
      fix: "Aktifkan DKIM di panel penyedia SMTP, lalu pasang TXT record selector yang mereka berikan.",
    });
  } else {
    issues.push({
      id: "dns-dkim", severity: "pass", weight: 0,
      title: `DKIM aktif (selector: ${auth.dkim.selector})`, detail: "",
    });
  }

  return issues;
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  let body: { subject?: string; html?: string; preheader?: string; fromEmail?: string; campaignId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const fromEmail = body.fromEmail || getDefaultFrom();
  const domain = fromEmail.match(/@([^\s>]+)/)?.[1]?.toLowerCase();

  const content = checkSpamContent({
    subject: body.subject || "",
    html: body.html || "",
    preheader: body.preheader,
    fromEmail,
    // The dispatcher appends the unsubscribe footer itself, so scoring the raw
    // draft as if it had none would report a problem that cannot occur.
    footerAdded: true,
  });

  let auth: SpamReport["auth"];
  let issues = content.issues;

  if (domain) {
    try {
      auth = await checkAuthDns(domain);
      issues = [...authIssues(auth), ...content.issues];
    } catch (error) {
      console.warn("DNS authentication check failed", error);
    }
  }

  const score = Math.min(10, Math.round(issues.reduce((sum, i) => sum + i.weight, 0) * 10) / 10);
  const report: SpamReport = {
    score,
    verdict: score < 3 ? "good" : score < 6 ? "risky" : "bad",
    issues: issues.sort((a, b) => b.weight - a.weight),
    checkedAt: new Date().toISOString(),
    auth,
  };

  // Persisting is best-effort: the report is useful on screen whether or not it
  // is filed against the campaign. Runs as the admin, so RLS still applies.
  if (body.campaignId) {
    const { error } = await admin.ctx.supabase
      .from("email_campaigns")
      .update({ spam_score: report.score, spam_report: report, spam_checked_at: report.checkedAt })
      .eq("id", body.campaignId);
    if (error) console.warn("Could not store spam report", error.message);
  }

  return NextResponse.json(report);
}
