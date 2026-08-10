/**
 * Smoke test for the email blasting pipeline.
 *
 * Covers the three places where a silent regression would be expensive and
 * invisible until after a campaign has already gone out to real people:
 *
 *   1. Rendering — merge tags resolving, links being rewritten through the
 *      click tracker, the open pixel landing, the unsubscribe link surviving
 *      untouched, and merge data being escaped. Contact data comes from
 *      imported CSVs, so an unescaped {{company}} is a script tag we send under
 *      our own domain.
 *   2. Spam scoring — a clean campaign has to score clean, and an obviously
 *      spammy one has to score badly. A checker that says "fine" to everything
 *      is worse than none, because it gets trusted.
 *   3. CSV import — quoted fields, non-comma delimiters, and unmapped columns
 *      being preserved rather than dropped. Import silently mangling a list is
 *      only discovered by mailing it.
 *
 * Expectations are written as literals for the same reason as in
 * logistics.smoke.ts: a test that recomputes its expectation with the code it
 * is testing proves only that the code is deterministic.
 *
 * Run with `npm run test:email`.
 */

import { renderCampaignEmail, buildBulkHeaders } from "../src/lib/email/render";
import { checkSpamContent } from "../src/lib/email/spamCheck";
import { parseCsv, guessMapping, mapRows, toCsv } from "../src/lib/email/csv";
import { parseDsn } from "../src/lib/email/dsn";

let failures = 0;

function check(label: string, condition: boolean, detail?: string): void {
  if (condition) {
    console.log(`  ok   ${label}`);
    return;
  }
  failures++;
  console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
}

// -----------------------------------------------------------------------------
console.log("\nRendering");
// -----------------------------------------------------------------------------

const rendered = renderCampaignEmail({
  html: '<p>Halo {{name}} dari {{company}}</p><p><a href="https://www.cargogrid.net/paket">Lihat paket</a></p>',
  subject: "Penawaran untuk {{company}}",
  preheader: "Ringkasan singkat",
  merge: { name: "Budi", company: "PT Nusantara" },
  baseUrl: "https://www.cargogrid.net",
  token: "abc123token",
  trackOpens: true,
  trackClicks: true,
});

check("merge tags resolve in the body", rendered.html.includes("Halo Budi dari PT Nusantara"));
check("merge tags resolve in the subject", rendered.subject === "Penawaran untuk PT Nusantara", rendered.subject);
check("campaign links route through the click tracker", rendered.html.includes("/api/email/track/click?t=abc123token"));
check("the original destination survives the rewrite", rendered.html.includes(encodeURIComponent("https://www.cargogrid.net/paket")));
check("the open pixel is injected", rendered.html.includes("/api/email/track/open?t=abc123token"));
check("an unsubscribe link is always present", rendered.html.includes("/api/email/unsubscribe?t=abc123token"));

// The one link that must never gain an extra hop: an unsubscribe that 500s
// sends the reader to "report spam" instead.
check("the unsubscribe link is NOT wrapped by the click tracker", !/track\/click[^"']*unsubscribe/.test(rendered.html));

check("a plain-text alternative is generated", rendered.text.length > 40 && rendered.text.includes("Budi"));
check("the text part keeps link destinations", rendered.text.includes("https://www.cargogrid.net"));
check("the preheader is embedded", rendered.html.includes("Ringkasan singkat"));

const injected = renderCampaignEmail({
  html: "<p>Halo {{name}}</p>",
  subject: "Hai",
  merge: { name: "<script>alert(1)</script>" },
  baseUrl: "https://www.cargogrid.net",
});
check(
  "merge data is HTML-escaped",
  !injected.html.includes("<script>") && injected.html.includes("&lt;script&gt;"),
);

const previewed = renderCampaignEmail({
  html: '<a href="https://www.cargogrid.net/x">x</a>',
  subject: "s",
  merge: {},
  baseUrl: "https://www.cargogrid.net",
  token: "tok",
  preview: true,
});
check("preview mode does not rewrite links", !previewed.html.includes("track/click"));
check("preview mode does not inject the pixel", !previewed.html.includes("track/open"));

const headers = buildBulkHeaders(
  "https://www.cargogrid.net/api/email/unsubscribe?t=x",
  "CargoGrid OS <service@cargogrid.net>",
);
check("List-Unsubscribe carries the URL form", headers["List-Unsubscribe"].includes("<https://"));
check("List-Unsubscribe strips the display name from the mailto", headers["List-Unsubscribe"].includes("mailto:service@cargogrid.net"));
check("one-click unsubscribe is declared", headers["List-Unsubscribe-Post"] === "List-Unsubscribe=One-Click");

// -----------------------------------------------------------------------------
console.log("\nSpam scoring");
// -----------------------------------------------------------------------------

const cleanReport = checkSpamContent({
  subject: "Cara memangkas siklus RFQ jadi 4 jam",
  html:
    "<p>" +
    "Kami merilis modul tracking multi-moda yang menyatukan laut, darat dan udara dalam satu nomor resi. ".repeat(4) +
    '<a href="https://www.cargogrid.net/solusi">Lihat detail modul</a></p>',
  preheader: "Tiga hal yang berubah bulan ini di lantai operasional tim Anda",
  fromEmail: "service@cargogrid.net",
  footerAdded: true,
});
check("a clean campaign scores below the risk threshold", cleanReport.score < 3, `score=${cleanReport.score}`);
check("a clean campaign is rated good", cleanReport.verdict === "good", cleanReport.verdict);

const spammyReport = checkSpamContent({
  subject: "RE: GRATIS!!! PROMO 90% BURUAN KLIK DI SINI 🎉🎉🎉",
  html: '<p>Menang hadiah 100% gratis tanpa risiko! <a href="https://bit.ly/x">klik di sini</a></p>',
  fromEmail: "marketing@gmail.com",
});
check("an obviously spammy campaign scores badly", spammyReport.score >= 6, `score=${spammyReport.score}`);
check("a fake Re: prefix is caught", spammyReport.issues.some((i) => i.id === "subject-fake-reply"));
check("a URL shortener is caught", spammyReport.issues.some((i) => i.id === "shortener"));
check("a freemail From address is caught", spammyReport.issues.some((i) => i.id === "freemail-from"));
check("a missing unsubscribe link is caught", spammyReport.issues.some((i) => i.id === "no-unsubscribe"));

// -----------------------------------------------------------------------------
console.log("\nCSV import");
// -----------------------------------------------------------------------------

const parsed = parseCsv(
  'email;nama lengkap;perusahaan;rute utama\r\n' +
  'budi@firma.co.id;"Budi, S.T.";PT Firma;"Jakarta - Surabaya"\r\n' +
  'bad-row;X;Y;Z\r\n',
);
check("a semicolon delimiter is detected", parsed.headers.length === 4, JSON.stringify(parsed.headers));
check("a quoted field containing the delimiter stays intact", parsed.rows[0][1] === "Budi, S.T.", parsed.rows[0][1]);

const mapping = guessMapping(parsed.headers);
check("the email column is auto-mapped", mapping[0] === "email");
check("an Indonesian name header is auto-mapped", mapping[1] === "name");
check("an Indonesian company header is auto-mapped", mapping[2] === "company");

const mapped = mapRows(parsed, mapping);
check("a row with an invalid address is rejected", mapped.invalid === 1 && mapped.contacts.length === 1);
check(
  "an unmapped column is preserved as a custom field",
  mapped.contacts[0].custom_fields?.rute_utama === "Jakarta - Surabaya",
  JSON.stringify(mapped.contacts[0].custom_fields),
);

const exported = toCsv([{ email: "a@b.co", name: 'Budi "Bos"', tags: ["x", "y"] }]);
check("export quotes a value containing quotes", exported.includes('"Budi ""Bos"""'), exported);
check("export flattens array columns", exported.includes("x|y"), exported);

// -----------------------------------------------------------------------------
console.log("\nBounce (DSN) parsing");
// -----------------------------------------------------------------------------
// The consequence of a wrong answer here is asymmetric: a missed bounce costs a
// data point, a false one silently suppresses a real customer from every future
// mailing. So the parser is expected to stay silent when unsure, and these
// cases pin that behaviour down.

const rfc3464 = [
  "From: Mail Delivery System <MAILER-DAEMON@relay.mailchannels.net>",
  "Subject: Undelivered Mail Returned to Sender",
  "Content-Type: multipart/report; report-type=delivery-status",
  "",
  "Reporting-MTA: dns; relay.mailchannels.net",
  "",
  "Final-Recipient: rfc822; budi@ptmaju.co.id",
  "Action: failed",
  "Status: 5.1.1",
  "Diagnostic-Code: smtp; 550 5.1.1 <budi@ptmaju.co.id>: Recipient address rejected: User unknown",
  "",
].join("\n");

const hard = parseDsn(rfc3464);
check("RFC 3464 DSN yields the failed recipient", hard.length === 1 && hard[0].email === "budi@ptmaju.co.id", JSON.stringify(hard));
check("a 5.x.x status is classified hard", hard[0]?.type === "hard", hard[0]?.type);
check("the diagnostic code is kept", (hard[0]?.detail || "").includes("User unknown"));
check("the daemon's own address is not treated as the recipient", !hard.some((v) => /mailer-daemon/i.test(v.email)));

const full = rfc3464
  .replace("Status: 5.1.1", "Status: 5.2.2")
  .replace("User unknown", "Mailbox full");
check(
  "5.2.2 (mailbox full) is soft despite the 5.x class",
  parseDsn(full)[0]?.type === "soft",
  parseDsn(full)[0]?.type,
);

const deferred = rfc3464.replace("Action: failed", "Action: delayed").replace("Status: 5.1.1", "Status: 4.4.1");
check("a delayed warning is not recorded as a bounce", parseDsn(deferred).length === 0);

const prose = [
  "Subject: Delivery Status Notification (Failure)",
  "",
  "Address not found. Your message wasn't delivered to andi@contohmati.co.id",
  "because the address couldn't be found, or is unable to receive mail.",
  "",
].join("\n");
const proseResult = parseDsn(prose);
check("a prose bounce still yields the address", proseResult.length === 1 && proseResult[0].email === "andi@contohmati.co.id", JSON.stringify(proseResult));
check("a prose 'address not found' is hard", proseResult[0]?.type === "hard");

check("an ordinary reply quoting an address is not a bounce", parseDsn([
  "Subject: Re: Penawaran CargoGrid",
  "",
  "Halo, tolong kirim detailnya ke rekan saya <rekan@perusahaan.co.id>. Terima kasih.",
].join("\n")).length === 0);

check("a bounce with no usable verdict is skipped rather than guessed", parseDsn([
  "Subject: Undelivered Mail Returned to Sender",
  "",
  "Something went wrong with <someone@example.co.id>.",
].join("\n")).length === 0);

check("our own address is never suppressed", !parseDsn([
  "Subject: Undelivered Mail Returned to Sender",
  "",
  "The message from <service@cargogrid.net> to <nyata@klien.co.id> failed: user unknown",
].join("\n")).some((v) => /cargogrid\.net$/.test(v.email)));

console.log(failures === 0 ? "\nAll email pipeline checks passed.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
