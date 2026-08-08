/**
 * Deliverability check for a campaign, before it is sent to anyone.
 *
 * This is a heuristic, not a verdict. It reproduces the checks that actually
 * decide inbox placement in practice — authentication records, text/HTML
 * balance, link hygiene, the presence of an opt-out, and the phrasing patterns
 * filters have been trained on — and reports them with the fix attached. It
 * cannot tell you what Gmail will do; it can tell you which of the things
 * within your control are currently wrong.
 *
 * Content analysis is isomorphic so the composer can score as you type. The DNS
 * half (SPF/DKIM/DMARC) only runs server-side, from app/api/email/spam-check.
 */

import type { SpamIssue, SpamReport, SpamSeverity } from "./types";
import { htmlToText } from "./render";

export interface SpamCheckInput {
  subject: string;
  html: string;
  preheader?: string | null;
  fromEmail?: string | null;
  /** Skips the "no unsubscribe link" finding — the worker appends one itself. */
  footerAdded?: boolean;
}

/**
 * Phrases that move a message towards the spam folder in Indonesian and
 * English marketing copy. Weighted, not banned: "gratis" in a B2B logistics
 * email is normal, five of these in one subject line is not.
 */
const TRIGGER_WORDS: Array<{ pattern: RegExp; weight: number; label: string }> = [
  { pattern: /\bgratis\b/gi, weight: 0.2, label: "gratis" },
  { pattern: /\bfree\b/gi, weight: 0.2, label: "free" },
  { pattern: /\b(diskon|discount)\s*\d{2,}\s*%/gi, weight: 0.3, label: "diskon besar" },
  { pattern: /\b(promo|promosi)\b/gi, weight: 0.15, label: "promo" },
  { pattern: /\bbonus\b/gi, weight: 0.2, label: "bonus" },
  { pattern: /\b(cash|uang|duit)\b/gi, weight: 0.2, label: "uang" },
  { pattern: /\bgaransi\s+uang\s+kembali\b/gi, weight: 0.4, label: "garansi uang kembali" },
  { pattern: /\b(buruan|segera|sekarang juga|jangan sampai ketinggalan)\b/gi, weight: 0.3, label: "urgensi berlebihan" },
  { pattern: /\b(urgent|act now|limited time|hurry)\b/gi, weight: 0.3, label: "urgency" },
  { pattern: /\bklik di sini\b/gi, weight: 0.25, label: "klik di sini" },
  { pattern: /\bclick here\b/gi, weight: 0.25, label: "click here" },
  { pattern: /\b(penawaran terbatas|stok terbatas)\b/gi, weight: 0.3, label: "penawaran terbatas" },
  { pattern: /\b100%\s*(gratis|aman|terjamin|guaranteed)\b/gi, weight: 0.4, label: "klaim 100%" },
  { pattern: /\b(menang|pemenang|hadiah|winner|prize)\b/gi, weight: 0.35, label: "hadiah" },
  { pattern: /\b(no risk|risk free|tanpa risiko)\b/gi, weight: 0.35, label: "tanpa risiko" },
  { pattern: /\b(order now|beli sekarang|pesan sekarang)\b/gi, weight: 0.2, label: "ajakan beli langsung" },
  { pattern: /\$\$+|\bRp\s*\d[\d.,]*\s*(juta|miliar)\b/gi, weight: 0.2, label: "nominal mencolok" },
];

/** URL shorteners hide the destination, which is exactly why filters distrust them. */
const SHORTENER_HOSTS = [
  "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "is.gd", "buff.ly",
  "s.id", "bit.do", "cutt.ly", "rebrand.ly", "shorturl.at", "linktr.ee",
];

/** Domains whose mail cannot pass DMARC when sent through a third-party SMTP. */
const FREEMAIL_DOMAINS = ["gmail.com", "yahoo.com", "yahoo.co.id", "hotmail.com", "outlook.com", "aol.com", "icloud.com"];

function pass(id: string, title: string, detail: string): SpamIssue {
  return { id, severity: "pass", weight: 0, title, detail };
}

function countMatches(text: string, pattern: RegExp): number {
  return (text.match(pattern) || []).length;
}

function capsRatio(text: string): number {
  const letters = text.replace(/[^A-Za-z]/g, "");
  if (letters.length < 8) return 0;
  const upper = letters.replace(/[^A-Z]/g, "").length;
  return upper / letters.length;
}

/**
 * Scores subject line and body. Returns points where higher is worse, on the
 * same 0-10 scale SpamAssassin reports, so an operator who knows one number
 * knows this one.
 */
export function checkSpamContent(input: SpamCheckInput): SpamReport {
  const { subject = "", html = "", preheader, fromEmail, footerAdded } = input;
  const text = htmlToText(html);
  const issues: SpamIssue[] = [];

  const add = (
    id: string,
    severity: Exclude<SpamSeverity, "pass">,
    weight: number,
    title: string,
    detail: string,
    fix?: string,
  ) => issues.push({ id, severity, weight, title, detail, fix });

  // --- Subject line ---------------------------------------------------------
  const subjectTrimmed = subject.trim();
  if (!subjectTrimmed) {
    add("subject-empty", "critical", 3, "Subjek kosong", "Email tanpa subjek hampir selalu masuk spam.", "Isi subjek 30–60 karakter.");
  } else {
    if (subjectTrimmed.length > 70) {
      add("subject-long", "info", 0.3, "Subjek terlalu panjang",
        `${subjectTrimmed.length} karakter. Inbox mobile memotong di sekitar 40 karakter.`,
        "Pendekkan ke 30–60 karakter, letakkan kata kunci di depan.");
    } else if (subjectTrimmed.length < 15) {
      add("subject-short", "info", 0.2, "Subjek terlalu pendek",
        `${subjectTrimmed.length} karakter memberi sedikit konteks dan menyerupai pola blast otomatis.`,
        "Tambahkan konteks konkret, misalnya nama modul atau angka.");
    } else {
      issues.push(pass("subject-length", "Panjang subjek wajar", `${subjectTrimmed.length} karakter.`));
    }

    const subjectCaps = capsRatio(subjectTrimmed);
    if (subjectCaps > 0.5) {
      add("subject-caps", "critical", 1.5, "Subjek didominasi HURUF KAPITAL",
        `${Math.round(subjectCaps * 100)}% huruf kapital.`,
        "Gunakan kapitalisasi kalimat normal.");
    }

    const bangs = countMatches(subjectTrimmed, /[!?]/g);
    if (bangs >= 3) {
      add("subject-punct", "warning", 0.8, "Tanda seru/tanya berlebihan",
        `${bangs} tanda baca emotif di subjek.`, "Maksimal satu tanda seru.");
    }

    const emoji = countMatches(subjectTrimmed, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu);
    if (emoji > 2) {
      add("subject-emoji", "warning", 0.5, "Emoji berlebihan di subjek",
        `${emoji} emoji.`, "Maksimal satu emoji, dan hanya jika relevan.");
    }

    if (/^(re|fwd|fw)\s*:/i.test(subjectTrimmed)) {
      add("subject-fake-reply", "critical", 2, "Subjek menyamar sebagai balasan",
        'Awalan "Re:" atau "Fwd:" pada email yang bukan balasan dianggap penipuan oleh filter.',
        'Hapus awalan "Re:"/"Fwd:".');
    }
  }

  // --- Trigger words --------------------------------------------------------
  const haystack = `${subject}\n${text}`;
  const hits: string[] = [];
  let triggerWeight = 0;
  for (const trigger of TRIGGER_WORDS) {
    const n = countMatches(haystack, trigger.pattern);
    if (n > 0) {
      hits.push(`${trigger.label}${n > 1 ? ` ×${n}` : ""}`);
      triggerWeight += trigger.weight * Math.min(n, 3);
    }
  }
  if (triggerWeight >= 1.2) {
    add("trigger-words", "warning", Math.min(triggerWeight, 2.5), "Banyak kata pemicu spam",
      `Terdeteksi: ${hits.slice(0, 8).join(", ")}${hits.length > 8 ? ", …" : ""}.`,
      "Ganti bahasa promosi dengan pernyataan spesifik dan terukur.");
  } else if (hits.length > 0) {
    add("trigger-words-mild", "info", triggerWeight, "Beberapa kata pemicu",
      `Terdeteksi: ${hits.join(", ")}. Masih dalam batas aman.`);
  } else {
    issues.push(pass("trigger-words", "Bebas kata pemicu", "Tidak ada frasa promosi berisiko tinggi."));
  }

  // --- Body substance -------------------------------------------------------
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 25) {
    add("body-thin", "warning", 1.2, "Isi email terlalu pendek",
      `${words} kata. Email singkat berisi tautan adalah pola phishing klasik.`,
      "Tulis minimal 50–150 kata konteks nyata.");
  } else if (words > 1200) {
    add("body-long", "info", 0.2, "Isi email sangat panjang",
      `${words} kata. Gmail memotong pesan di sekitar 102 KB dan menyembunyikan sisanya.`,
      "Ringkas, arahkan detail ke halaman landing.");
  } else {
    issues.push(pass("body-length", "Panjang isi wajar", `${words} kata.`));
  }

  const bodyCaps = capsRatio(text);
  if (bodyCaps > 0.35 && words > 20) {
    add("body-caps", "warning", 1, "Isi email banyak huruf kapital",
      `${Math.round(bodyCaps * 100)}% huruf kapital.`, "Gunakan kapitalisasi normal.");
  }

  // --- Images vs text -------------------------------------------------------
  const images = countMatches(html, /<img\b/gi);
  const imagesWithoutAlt = countMatches(html, /<img\b(?![^>]*\balt\s*=)[^>]*>/gi);
  if (images > 0 && words < 40) {
    add("image-heavy", "critical", 2, "Email didominasi gambar",
      `${images} gambar dengan hanya ${words} kata teks. Filter memperlakukan email gambar-saja sebagai upaya menghindari analisis teks.`,
      "Tambahkan teks nyata; targetkan minimal 60% teks.");
  } else if (images > 0) {
    issues.push(pass("image-balance", "Rasio gambar/teks wajar", `${images} gambar, ${words} kata.`));
  }
  if (imagesWithoutAlt > 0) {
    add("image-alt", "info", 0.4, "Gambar tanpa atribut alt",
      `${imagesWithoutAlt} gambar tanpa alt. Sebagian besar klien memblokir gambar secara default, sehingga pembaca hanya melihat kotak kosong.`,
      'Tambahkan alt="" deskriptif pada setiap gambar.');
  }

  // --- Links ----------------------------------------------------------------
  const hrefs = Array.from(html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)).map((m) => m[1]);
  const httpLinks = hrefs.filter((h) => /^https?:\/\//i.test(h));
  if (httpLinks.length > 15) {
    add("too-many-links", "warning", 0.8, "Terlalu banyak tautan",
      `${httpLinks.length} tautan.`, "Kurangi ke di bawah 10, fokuskan pada satu CTA utama.");
  }
  if (httpLinks.length === 0 && words > 40) {
    add("no-links", "info", 0.2, "Tidak ada tautan sama sekali",
      "Tidak ada CTA yang bisa diklik, sehingga click rate tidak akan terukur.");
  }

  const shortened = httpLinks.filter((h) => SHORTENER_HOSTS.some((s) => h.includes(s)));
  if (shortened.length > 0) {
    add("shortener", "critical", 1.8, "Menggunakan URL shortener",
      `${shortened.length} tautan pendek terdeteksi. Shortener menyembunyikan tujuan dan banyak yang sudah masuk blocklist.`,
      "Gunakan URL cargogrid.net lengkap.");
  }

  const insecure = httpLinks.filter((h) => /^http:\/\//i.test(h));
  if (insecure.length > 0) {
    add("http-links", "warning", 0.7, "Tautan tanpa HTTPS",
      `${insecure.length} tautan memakai http://.`, "Ganti ke https://.");
  }

  // Anchor text that shows one domain while linking to another is the exact
  // shape of a phishing link, and filters score it as such.
  const mismatched = Array.from(
    html.matchAll(/<a\b[^>]*href\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>\s*(https?:\/\/[^<\s]+)\s*<\/a>/gi),
  ).filter((m) => {
    try {
      return new URL(m[1]).hostname !== new URL(m[2]).hostname;
    } catch {
      return false;
    }
  });
  if (mismatched.length > 0) {
    add("link-mismatch", "critical", 2.5, "Teks tautan tidak cocok dengan tujuan",
      `${mismatched.length} tautan menampilkan domain berbeda dari tujuan sebenarnya.`,
      "Samakan teks tautan dengan domain tujuan.");
  }

  // --- Hidden text ----------------------------------------------------------
  if (/display\s*:\s*none|visibility\s*:\s*hidden|font-size\s*:\s*0/i.test(html.replace(/max-height:0[^"']*/gi, ""))) {
    const preheaderOnly = /display:none[^"']*max-height:0/i.test(html);
    if (!preheaderOnly) {
      add("hidden-text", "warning", 1, "Ada teks tersembunyi",
        "Elemen dengan display:none atau font-size:0 di luar preheader dibaca sebagai upaya menyembunyikan konten dari pembaca.",
        "Hapus elemen tersembunyi selain blok preheader.");
    }
  }

  // --- Compliance -----------------------------------------------------------
  const hasUnsub = footerAdded || /unsubscribe|berhenti berlangganan|opt.?out/i.test(html);
  if (!hasUnsub) {
    add("no-unsubscribe", "critical", 3, "Tidak ada tautan berhenti berlangganan",
      "Wajib untuk email massal dan disyaratkan oleh aturan bulk sender Gmail/Yahoo.",
      "Tambahkan {{unsubscribe_url}} — worker blast menambahkannya otomatis di footer.");
  } else {
    issues.push(pass("unsubscribe", "Ada opsi berhenti berlangganan", "Footer memuat tautan unsubscribe dan header List-Unsubscribe."));
  }

  const hasIdentity = /cargogrid/i.test(html);
  if (!hasIdentity) {
    add("no-identity", "warning", 0.8, "Identitas pengirim tidak jelas",
      "Isi email tidak menyebut nama perusahaan.",
      "Cantumkan nama, situs, dan kontak perusahaan di footer.");
  }

  if (!preheader || !preheader.trim()) {
    add("no-preheader", "info", 0.3, "Preheader kosong",
      "Tanpa preheader, inbox menampilkan potongan teks pertama dari isi email.",
      "Isi preheader 60–100 karakter sebagai lanjutan subjek.");
  } else {
    issues.push(pass("preheader", "Preheader terisi", `${preheader.trim().length} karakter.`));
  }

  // --- From address ---------------------------------------------------------
  if (fromEmail) {
    const domain = fromEmail.split("@")[1]?.toLowerCase().replace(/>$/, "");
    if (domain && FREEMAIL_DOMAINS.includes(domain)) {
      add("freemail-from", "critical", 2.5, "Mengirim dari domain email gratis",
        `Pengirim ${domain} tidak bisa lolos DMARC saat dikirim lewat SMTP pihak ketiga.`,
        "Gunakan alamat @cargogrid.net.");
    } else if (domain) {
      issues.push(pass("from-domain", "Domain pengirim milik sendiri", domain));
    }
  }

  // --- Score ----------------------------------------------------------------
  const score = Math.min(10, Math.round(issues.reduce((sum, i) => sum + i.weight, 0) * 10) / 10);

  return {
    score,
    verdict: score < 3 ? "good" : score < 6 ? "risky" : "bad",
    issues: issues.sort((a, b) => b.weight - a.weight),
    checkedAt: new Date().toISOString(),
  };
}

/** Human-readable summary of a score, used in both the composer and the report. */
export function describeSpamScore(score: number, lang: "id" | "en" = "id"): string {
  if (lang === "en") {
    if (score < 3) return "Low risk — likely to reach the inbox";
    if (score < 6) return "Moderate risk — fix the warnings before sending";
    return "High risk — likely to land in spam";
  }
  if (score < 3) return "Risiko rendah — kemungkinan besar masuk inbox";
  if (score < 6) return "Risiko sedang — perbaiki peringatan sebelum kirim";
  return "Risiko tinggi — besar kemungkinan masuk folder spam";
}
