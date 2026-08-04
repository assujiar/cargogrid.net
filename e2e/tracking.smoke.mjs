/**
 * End-to-end smoke test for the analytics stack.
 *
 * Verifies the properties that are invisible in code review and expensive to
 * get wrong in production: that no identifier is written before consent, that
 * the consent signal reaches Google in the right order, that a withdrawal is
 * honoured, and that a submitted lead carries its full attribution.
 *
 * Run against a production build (the consent bootstrap is server-rendered, so
 * `next dev` is not representative):
 *
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST NEXT_PUBLIC_GTM_ID=GTM-TEST npm run build
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST NEXT_PUBLIC_GTM_ID=GTM-TEST npx next start -p 3111 &
 *   npm run test:tracking
 *
 * Env: BASE_URL (default http://localhost:3111), PW_CHROMIUM_PATH to point at a
 * preinstalled Chromium instead of Playwright's own download.
 */

import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3111";
const launchOptions = process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {};

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
};

/** gtag pushes `arguments` objects, GTM pushes plain objects — normalise both. */
const DUMP = `JSON.stringify((window.dataLayer||[]).map(e => Array.from(e.length!==undefined&&typeof e!=='string' ? e : [e])))`;

const newContext = async (browser) => {
  const context = await browser.newContext();
  // googletagmanager.com is deliberately blocked: this test asserts on the
  // instructions the app puts on the dataLayer, which is what Google would act
  // on. Letting the real tag load would consume the queue and make the
  // assertions depend on network availability.
  await context.route("**/googletagmanager.com/**", (route) => route.abort());
  return context;
};

const browser = await chromium.launch(launchOptions);

/* -- 1. Consent gate ------------------------------------------------------- */
const context = await newContext(browser);
const page = await context.newPage();
await page.goto(`${BASE}/?utm_source=google&utm_medium=cpc&utm_campaign=tms-jkt&gclid=TEST_GCLID_123`, {
  waitUntil: "networkidle",
});

const layer1 = JSON.parse(await page.evaluate(DUMP));
const consentDefault = layer1.find((e) => e[0] === "consent" && e[1] === "default");
check("Consent Mode default is pushed", Boolean(consentDefault));
check(
  "Analytics and ad storage denied by default",
  consentDefault?.[2]?.analytics_storage === "denied" && consentDefault?.[2]?.ad_storage === "denied",
);
check(
  "Consent default precedes any config/event command",
  layer1.findIndex((e) => e[0] === "consent") < layer1.findIndex((e) => e[0] === "config" || e[0] === "js"),
);
check(
  "No _ga cookie written before consent",
  (await context.cookies()).filter((c) => c.name.startsWith("_ga")).length === 0,
);

/* -- 2. Attribution capture ------------------------------------------------ */
const stored = await page.evaluate(() => ({
  source: sessionStorage.getItem("cg_utm_source"),
  campaign: sessionStorage.getItem("cg_utm_campaign"),
  click: sessionStorage.getItem("cg_utm_click_id"),
  first: JSON.parse(localStorage.getItem("cg_first_touch") || "null"),
  visits: localStorage.getItem("cg_visit_count"),
}));
check("Last-touch UTM captured", stored.source === "google" && stored.campaign === "tms-jkt");
check("Ad click id captured", stored.click === "gclid:TEST_GCLID_123");
check("First touch recorded with landing page", stored.first?.utmSource === "google" && Boolean(stored.first?.landingPage));
check("Visit counted", stored.visits === "1");

/* -- 3. Granting, withdrawing, and reopening ------------------------------- */
await page.waitForSelector("#cookie-consent-banner", { timeout: 6000 });
check("Banner shown to a first-time visitor", true);

await page.getByRole("button", { name: /Setujui Semua|Accept All/ }).click();
await page.waitForTimeout(400);

const layer2 = JSON.parse(await page.evaluate(DUMP));
const granted = layer2.filter((e) => e[0] === "consent" && e[1] === "update").pop();
check(
  "Accept All grants every storage signal",
  granted?.[2]?.analytics_storage === "granted" && granted?.[2]?.ad_personalization === "granted",
);
check("consent_update event emitted to GA4", layer2.some((e) => e[0] === "event" && e[1] === "consent_update"));
check(
  "GTM mirror event pushed with cg_ prefix",
  await page.evaluate(() => window.dataLayer.some((e) => e && e.event === "cg_consent_update")),
);
check(
  "Choice persisted",
  await page.evaluate(() => {
    const c = JSON.parse(localStorage.getItem("cargogrid_cookie_consent") || "{}");
    return c.analytics === true && c.marketing === true && Boolean(c.timestamp);
  }),
);

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.getByRole("button", { name: /Preferensi Cookie|Cookie Preferences/ }).click();
await page.waitForSelector("#cookie-consent-banner", { timeout: 4000 });
const toggles = await page.getByRole("switch").evaluateAll((els) => els.map((e) => e.getAttribute("aria-checked")));
check("Footer link reopens preferences with the stored state", toggles.length === 2 && toggles.every((v) => v === "true"));

await page.getByRole("switch").first().click();
await page.getByRole("switch").nth(1).click();
await page.getByRole("button", { name: /Simpan Pilihan|Save Choices/ }).click();
await page.waitForTimeout(300);
const withdrawn = JSON.parse(await page.evaluate(DUMP)).filter((e) => e[0] === "consent" && e[1] === "update").pop();
check(
  "Withdrawal pushes a denied update",
  withdrawn?.[2]?.analytics_storage === "denied" && withdrawn?.[2]?.ad_storage === "denied",
);

/* -- 4. Returning visitor and SPA navigation ------------------------------- */
const returning = await context.newPage();
await returning.goto(`${BASE}/paket`, { waitUntil: "networkidle" });
const consentCmds = JSON.parse(await returning.evaluate(DUMP)).filter((e) => e[0] === "consent");
check(
  "Stored choice replayed by the bootstrap, before the tag loads",
  consentCmds.length >= 2 && consentCmds[1][1] === "update" && consentCmds[1][2].analytics_storage === "denied",
);
check("Banner stays hidden once a choice is stored", (await returning.locator("#cookie-consent-banner").count()) === 0);

const viewsBefore = await returning.evaluate(() => window.dataLayer.filter((e) => e[1] === "page_view").length);
await returning.locator('a[href="/faq"]').first().click();
await returning.waitForURL(/faq/, { timeout: 8000 });
await returning.waitForTimeout(500);
const viewsAfter = await returning.evaluate(() => window.dataLayer.filter((e) => e[1] === "page_view").length);
check("Exactly one page_view per client navigation", viewsAfter - viewsBefore === 1, `${viewsBefore} -> ${viewsAfter}`);

await returning.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await returning.waitForTimeout(600);
const milestones = await returning.evaluate(() =>
  window.dataLayer.filter((e) => e[1] === "scroll_depth" && e[2].page_path === "/faq").map((e) => e[2].percent_scrolled),
);
check(
  "Scroll milestones fire once each, in order",
  JSON.stringify(milestones) === JSON.stringify([25, 50, 75, 90]),
  JSON.stringify(milestones),
);
await context.close();

/* -- 5. Lead submission carries its attribution ---------------------------- */
const leadContext = await newContext(browser);
const form = await leadContext.newPage();
await form.goto(`${BASE}/?utm_source=linkedin&utm_medium=paid_social&utm_campaign=q3-forwarder&gclid=ABC123`, {
  waitUntil: "networkidle",
});
await form.waitForSelector("#cookie-consent-banner", { timeout: 6000 });
await form.getByRole("button", { name: /Setujui Semua|Accept All/ }).click();
await form.goto(`${BASE}/kontak`, { waitUntil: "networkidle" });

let posted = null;
form.on("request", (req) => {
  if (req.url().includes("/api/inquiry") && req.method() === "POST") posted = JSON.parse(req.postData() || "{}");
});

await form.locator("#lead-name").fill("Uji Coba");
await form.locator("#lead-company").fill("PT Uji Logistik");
await form.locator("#lead-role").fill("Ops Director");
await form.locator("#lead-email").fill("uji@example.com");
await form.locator("#lead-phone").fill("081234567890");
await form.locator("#lead-shipment-volume").selectOption("1000+");
await form.locator("form#lead-capture-form button[type=submit]").click();
await form.waitForTimeout(2500);

check("form_start fired exactly once", (await form.evaluate(() => window.dataLayer.filter((e) => e[1] === "form_start").length)) === 1);
check("Inquiry POST carried a body", Boolean(posted));
check("Last-touch UTM sent", posted?.utmSource === "linkedin" && posted?.utmCampaign === "q3-forwarder");
check("First-touch UTM sent", posted?.firstUtmSource === "linkedin");
check("Landing page and click id sent", posted?.landingPage?.includes("utm_source=linkedin") && posted?.clickId === "gclid:ABC123");
// A visit is a session, not a pageview: / -> /kontak in one tab is one visit.
check("Visit count sent (same session counts once)", posted?.visitCount === 1, String(posted?.visitCount));

const secondSession = await leadContext.newPage();
await secondSession.goto(`${BASE}/solusi`, { waitUntil: "networkidle" });
check(
  "A new session increments the visit counter",
  (await secondSession.evaluate(() => localStorage.getItem("cg_visit_count"))) === "2",
);

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
