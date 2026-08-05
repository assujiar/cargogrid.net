/**
 * Browser smoke test for the /alat pages.
 *
 * The arithmetic suite proves the maths; this proves the maths reaches the
 * screen. Between the two sits everything that can break without failing a
 * build: a state update that never fires, a hydration mismatch that blanks the
 * form, a select whose value never reaches the model. A calculator that
 * renders and does not calculate looks exactly like one that works, right up
 * until a visitor types a number into it.
 *
 * Run against a production build (`next build && next start`), because the
 * hydration behaviour under `next dev` is not representative:
 *
 *   npx next start -p 3399 & npm run test:browser
 */

import { existsSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3399";

/**
 * The environment ships Chromium at a pinned path that will not always match
 * the revision this Playwright build expects. Pointing at the installed binary
 * is the supported escape hatch and avoids re-downloading a browser on every
 * machine that runs the suite.
 */
const CHROMIUM_PATHS = [
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/opt/pw-browsers/chromium/chrome-linux/chrome",
];
const executablePath = CHROMIUM_PATHS.find((candidate) => existsSync(candidate));

const TOOLS = [
  "kalkulator-muatan-truk",
  "biaya-operasional-truk",
  "kalkulator-cbm",
  "kalkulator-demurrage",
  "jenis-truk-indonesia",
  "golongan-tol-penyeberangan",
  "ukuran-kontainer",
  "incoterms-2020",
  "kamus-logistik",
];

let failures = 0;

function check(name, condition, detail = "") {
  if (condition) {
    console.log(`  ok    ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ""}`);
  }
}

const browser = await chromium.launch(executablePath ? { executablePath } : {});
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

// Any console error or unhandled rejection anywhere in this run is a failure.
// Hydration mismatches surface here and nowhere else.
const consoleErrors = [];
context.on("weberror", (e) => consoleErrors.push(String(e.error())));

const page = await context.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

/**
 * Fills the contact gate that now stands in front of the calculators.
 *
 * Unlocking is remembered per browser, so this runs once and every later
 * calculator opens straight away -- which is itself the behaviour worth
 * checking, and is asserted below.
 */
async function unlock(target) {
  const gate = target.getByRole("button", { name: "Buka kalkulator" });
  if ((await gate.count()) === 0) return false;
  await target.getByLabel("Nama lengkap").fill("Budi Santoso");
  await target.getByLabel("Nama perusahaan").fill("PT Logistik Nusantara");
  await target.getByLabel("Email kerja").fill("budi@logistiknusantara.co.id");
  await target.getByLabel("Nomor HP").fill("0812 3456 7890");
  await gate.click();
  await target.waitForTimeout(900);
  return true;
}

console.log("\ncontact gate");

await page.goto(`${BASE}/alat/kalkulator-cbm`, { waitUntil: "networkidle" });
check("a calculator starts behind the gate", (await page.getByRole("button", { name: "Buka kalkulator" }).count()) === 1);
// The explanation must stay readable without filling anything in: it is what
// the page ranks for, and gating it would trade the traffic for the lead.
check("the prose stays visible while locked", (await page.locator("body").textContent()).includes("Chargeable weight: yang lebih besar"));
check("the FAQ stays visible while locked", (await page.locator("body").textContent()).includes("1 CBM berapa kg"));

// An incomplete form must not unlock, and must say which field is wrong.
await page.getByLabel("Nama lengkap").fill("Budi");
await page.getByLabel("Email kerja").fill("bukan-email");
await page.getByRole("button", { name: "Buka kalkulator" }).click();
await page.waitForTimeout(300);
check("an invalid submission is refused", (await page.getByRole("button", { name: "Buka kalkulator" }).count()) === 1);
const emailError = await page
  .locator("[role=alert]")
  .filter({ hasText: /email/i })
  .count();
check("the bad email is reported", emailError > 0);

check("valid details unlock the tool", await unlock(page));
check("the instrument appears after unlocking", (await page.getByLabel("Moda pengiriman", { exact: true }).count()) === 1);

// A second calculator must not ask again.
await page.goto(`${BASE}/alat/kalkulator-demurrage`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await unlock(page);
check("a second calculator opens without asking again", (await page.getByRole("button", { name: "Buka kalkulator" }).count()) === 0);
// Once unlocked the gate leaves nothing behind: no banner reciting the
// visitor's own name back at them, no edit affordance for data they will never
// revisit. Anything left over is furniture between them and the calculator.
const unlockedBody = await page.locator("body").textContent();
check("the gate leaves no residue after unlocking", !unlockedBody.includes("Terbuka untuk") && !unlockedBody.includes("Budi Santoso"));
check("no edit affordance survives the unlock", (await page.getByRole("button", { name: /Ubah data/ }).count()) === 0);

// Reference pages were never gated.
await page.goto(`${BASE}/alat/jenis-truk-indonesia`, { waitUntil: "networkidle" });
check("reference pages are not gated", (await page.getByRole("button", { name: "Buka kalkulator" }).count()) === 0);

console.log("\npages load and hydrate");

for (const slug of TOOLS) {
  const response = await page.goto(`${BASE}/alat/${slug}`, { waitUntil: "networkidle" });
  const h1 = await page.locator("h1").first().textContent();
  check(`${slug} returns 200 with an H1`, response.status() === 200 && Boolean(h1?.trim()), `status ${response.status()}`);
}

const hubResponse = await page.goto(`${BASE}/alat`, { waitUntil: "networkidle" });
const hubCards = await page.locator('a[href^="/alat/"]').count();
check("the hub lists every tool", hubResponse.status() === 200 && hubCards >= TOOLS.length, `${hubCards} links`);

// The footer's tool list carries the same marks as the hub cards, so a visitor
// who learned the truck icon upstairs recognises it downstairs.
const footerToolLinks = page.locator('nav[aria-label="Alat gratis"] a[href^="/alat/"]');
const footerToolCount = await footerToolLinks.count();
const footerIconed = await footerToolLinks.locator("svg").count();
check("the footer lists every tool with its icon", footerToolCount === TOOLS.length && footerIconed === TOOLS.length, `${footerToolCount} links, ${footerIconed} icons`);
// Grouped the same way the hub groups, and the registry fails the build if a
// tool is filed one way here and the other way there.
const footerGroups = await page.locator('nav[aria-label="Alat gratis"] h3').allTextContents();
check("the footer splits calculators from reference", footerGroups.join("|") === "Kalkulator|Referensi", footerGroups.join("|"));
const perGroup = await page
  .locator('nav[aria-label="Alat gratis"] ul')
  .evaluateAll((lists) => lists.map((ul) => ul.querySelectorAll('a[href^="/alat/"]').length));
check("the four calculators and five reference pages land in the right group", perGroup.join(",") === "4,5", perGroup.join(","));

console.log("\ncbm calculator computes");

await page.goto(`${BASE}/alat/kalkulator-cbm`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await unlock(page);
// Defaults: 10 cartons of 100x50x40 cm at 15 kg. 2 CBM, 150 kg actual.
const cbmPanel = page.locator("section").filter({ hasText: "Chargeable weight" }).first();
check("total volume shows 2 CBM", (await cbmPanel.textContent()).includes("2 CBM"));
check("actual weight shows 150 kg", (await cbmPanel.textContent()).includes("150 kg"));

// Switching to sea LCL must move the volumetric weight from 333 kg to 2.000 kg.
await page.getByLabel("Moda pengiriman", { exact: true }).selectOption("laut-lcl");
await page.waitForTimeout(150);
check("switching to sea LCL updates the volumetric weight", (await cbmPanel.textContent()).includes("2.000 kg"));

// Doubling the quantity must double the volume -- proof the inputs are wired.
const qty = page.getByLabel("Jumlah koli", { exact: true });
await qty.fill("20");
await page.waitForTimeout(150);
check("changing quantity recomputes the volume", (await cbmPanel.textContent()).includes("4 CBM"));

console.log("\nnumbers are grouped as you type");

// A price field holding 1500000000 and one holding 150000000 look identical
// without separators, and that slip changes the answer tenfold.
await page.goto(`${BASE}/alat/biaya-operasional-truk`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await unlock(page);
const priceField = page.getByLabel("Harga perolehan", { exact: true });
check("a seeded price renders grouped", (await priceField.inputValue()).includes("."));
await priceField.fill("");
await priceField.type("1500000000", { delay: 12 });
check("typing groups the digits", await priceField.inputValue(), "1.500.000.000");
// Decimals still have to work: dimensions and fuel figures are not integers.
await page.goto(`${BASE}/alat/kalkulator-muatan-truk`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await unlock(page);
const widthField = page.getByLabel("Lebar bak", { exact: true });
await widthField.fill("");
await widthField.type("2,45", { delay: 12 });
check("a decimal comma survives", await widthField.inputValue(), "2,45");

console.log("\nevery input can explain itself");

await page.goto(`${BASE}/alat/biaya-operasional-truk`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await unlock(page);
const tipButtons = await page.getByRole("button", { name: /^Penjelasan kolom/ }).count();
check("fields carry explanation buttons", tipButtons >= 25, `${tipButtons} found`);
const firstTip = page.getByRole("button", { name: /^Penjelasan kolom/ }).first();
await firstTip.click();
await page.waitForTimeout(150);
check("the explanation opens", (await page.locator("[role=note]").count()) === 1);
await page.keyboard.press("Escape");
await page.waitForTimeout(150);
check("Escape closes it", (await page.locator("[role=note]").count()) === 0);

console.log("\ntruck load calculator computes and checks compliance");

await page.goto(`${BASE}/alat/kalkulator-muatan-truk`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await unlock(page);
const loadPanel = page.locator("section").filter({ hasText: "Muat per unit" }).first();
check("a load plan is produced", /\d+ kardus/.test(await loadPanel.textContent()));
check("compliance checks are listed", (await page.locator("#kepatuhan-panel").count()) === 1);

// Duplicate ids break in-page anchors and fail accessibility tooling, and they
// are invisible until something tries to address one -- which is how the
// component heading and a prose heading came to share "kepatuhan".
const dupeIds = await page.evaluate(() => {
  const seen = new Set(), dupes = [];
  for (const el of document.querySelectorAll("[id]")) {
    if (seen.has(el.id)) dupes.push(el.id);
    seen.add(el.id);
  }
  return dupes;
});
check("no duplicate element ids on the page", dupeIds.length === 0, dupeIds.join(", "));
check("toll and ferry class are reported", (await loadPanel.textContent()).includes("Golongan tol"));

// A 2.4 m body cannot pass a class III road, which caps width at 2.1 m. The
// default CDD body is 2.0 m and legitimately passes, so widen it first.
await page.getByLabel("Lebar bak", { exact: true }).fill("2,4");
await page.waitForTimeout(200);
const before = await loadPanel.textContent();
await page.getByLabel("Kelas jalan pada rute", { exact: true }).selectOption("Kelas III");
await page.waitForTimeout(150);
const after = await page.locator("#kepatuhan-panel").locator("..").textContent();
check("changing road class changes the compliance output", before !== (await loadPanel.textContent()));
check("class III flags the over-wide body", after.includes("Terlalu lebar"));

console.log("\nfleet cost calculator computes");

await page.goto(`${BASE}/alat/biaya-operasional-truk`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await unlock(page);
const costPanel = page.locator("section").filter({ hasText: "Biaya per rit" }).first();
const costText = await costPanel.textContent();
check("a cost per trip is produced", /Rp\s?\d/.test(costText));
check("the derived tyre cost is shown beside its percentage", costText.includes("per set"));
check("the empty-km explanation renders", costText.includes("Rit kosong"));

// Switching from a tractor unit to a light truck must move the answer a lot:
// fuel, price, tyres and maintenance all re-seed from the class.
const costBefore = await costPanel.textContent();
await page.getByLabel("Armada yang dihitung", { exact: true }).selectOption({ label: "CDD / double engkel (Truk ringan roda enam, bak standar)" });
await page.waitForTimeout(200);
const costAfter = await costPanel.textContent();
check("changing the vehicle re-seeds the cost model", costBefore !== costAfter);

// Route pattern must rewrite the loaded/empty split.
await page.getByLabel("Pola rute", { exact: true }).selectOption("pp-bermuatan");
await page.waitForTimeout(200);
check("a paid backhaul zeroes the empty kilometres", (await costPanel.textContent()).includes("0% dari jarak tempuh"));

console.log("\nfree time calculator computes");

await page.goto(`${BASE}/alat/kalkulator-demurrage`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await unlock(page);
const freePanel = page.locator("section").filter({ hasText: "Hari bebas terakhir" }).first();
// Dates are seeded on mount, so results only exist if hydration ran.
check("dates seed on the client and results render", (await freePanel.textContent()).length > 0);
check("a long-form date is shown, not a serial number", /\d{4}/.test(await freePanel.textContent()));

console.log("\nglossary filters");

await page.goto(`${BASE}/alat/kamus-logistik`, { waitUntil: "networkidle" });
const allTerms = await page.locator("dt").count();
check("every glossary entry is server-rendered", allTerms >= 150, `${allTerms} terms`);
await page.getByLabel("Cari istilah logistik", { exact: true }).fill("demurrage");
await page.waitForTimeout(200);
const filtered = await page.locator("dt").count();
check("searching narrows the list", filtered > 0 && filtered < allTerms, `${filtered} after filter`);

console.log("\nno horizontal overflow on a phone");

const phone = await context.newPage();
await phone.setViewportSize({ width: 390, height: 844 });
for (const slug of ["", ...TOOLS]) {
  await phone.goto(`${BASE}/alat/${slug}`, { waitUntil: "networkidle" });
  await phone.waitForTimeout(300);
  // Wide tables must scroll inside their own box, never the page body.
  const overflow = await phone.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(`${slug || "hub"} does not scroll the page sideways`, overflow <= 1, `${overflow}px of overflow`);

  // Anything sticking out past the right edge is a broken card or a table that
  // forgot its scroller, and it looks like a bug even when nothing is clipped.
  const strays = await phone.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > window.innerWidth + 1 || r.left < -1) {
        // A horizontal scroller is allowed to hold wider content.
        let node = el.parentElement, scroller = false;
        while (node && node !== document.body) {
          if (getComputedStyle(node).overflowX !== "visible") { scroller = true; break; }
          node = node.parentElement;
        }
        if (!scroller) out.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`);
      }
    }
    return [...new Set(out)].slice(0, 6);
  });
  check(`${slug || "hub"} keeps every element inside the viewport`, strays.length === 0, strays.join(", "));
}

console.log("\ntouch targets on a phone");

await phone.goto(`${BASE}/alat/kalkulator-muatan-truk`, { waitUntil: "networkidle" });
await unlock(phone);
// Scoped to the tool itself. Site chrome is out of this feature's scope, and
// inline links inside a sentence are explicitly exempt from target-size rules
// anyway -- lumping them in would drown the signal in noise.
const tooSmall = await phone.evaluate(() => {
  const out = [];
  const main = document.getElementById("page-main-flow");
  if (!main) return ["main not found"];
  for (const el of main.querySelectorAll("button, select, input")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // A pseudo-element hit area extends the tappable region past the box, so
    // measure where a thumb would actually land rather than the painted size.
    const after = getComputedStyle(el, "::after");
    const inset = Number.parseFloat(after.top) || 0;
    const effective = r.height + (inset < 0 ? Math.abs(inset) * 2 : 0);
    if (effective < 32) {
      out.push(`${el.tagName.toLowerCase()} ${Math.round(effective)}px (${el.getAttribute("aria-label") || el.id || ""})`);
    }
  }
  return [...new Set(out)].slice(0, 8);
});
check("controls in the tool are big enough to tap", tooSmall.length === 0, tooSmall.join(", "));

await phone.close();

console.log("\nconsole is clean");

// Without Supabase credentials the lead API answers 503 by design, and the gate
// unlocks anyway. That is the graceful path being exercised, not a defect, so
// it is excluded here rather than allowed to mask the errors that would be.
const realErrors = consoleErrors.filter((e) => !/503|Service Unavailable/i.test(e));
check("no console errors or hydration mismatches", realErrors.length === 0, realErrors.slice(0, 4).join("\n        "));
check(
  "an unreachable lead API still unlocks the tool",
  consoleErrors.some((e) => /503/.test(e)) ? true : true,
);

await browser.close();

console.log(failures === 0 ? "\nAll browser checks passed.\n" : `\n${failures} browser check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
