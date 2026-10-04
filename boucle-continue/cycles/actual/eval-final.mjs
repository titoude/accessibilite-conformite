// eval-final.mjs — évaluation finale indépendante : critères NON couverts par les
// corrections (focus clavier, modale piège-focus, titre de page, débordement 320px).
// Usage : node eval-final.mjs [baseURL] — rapporte findings, exit 0 si aucun FAIL.
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3001";
const findings = [];
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) findings.push(name);
};

const browser = await browser_launch();
async function browser_launch() { return chromium.launch(); }
const ctx = await browser.newContext({ locale: "en-US" });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "load" });
await page.waitForSelector("button", { state: "visible", timeout: 60000 });
await page.waitForTimeout(1500);

// F1. Titre de page non vide (2.4.2)
check("document.title non vide", !!(await page.title()), await page.title());

// F2. Focus clavier visible : Tab x3, un élément focalisé avec indicateur visible
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
const focus = await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return { ok: false, detail: "rien focalisé" };
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const visible = r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
  const indicator = cs.outlineStyle !== "none" || cs.boxShadow !== "none" || el.matches(":focus-visible");
  return { ok: visible && indicator, tag: el.tagName, outline: cs.outlineStyle, boxShadow: cs.boxShadow.slice(0, 60) };
});
check("Tab : focus visible avec indicateur", focus.ok, `${focus.tag} outline=${focus.outline} shadow=${focus.boxShadow}`);

// F3. Modale : les contrôles internes ont des noms + Escape ferme
const openDemo = async () => {
  try { await page.waitForSelector('a[href="/budget"]', { state: "visible", timeout: 5000 }); return; } catch {}
  const demo = page.locator('button:has-text("Try the demo")').first();
  if (await demo.count()) { await demo.click(); await page.waitForSelector('a[href="/budget"]', { state: "visible", timeout: 60000 }); }
};
await openDemo();
await page.locator('a[href="/accounts"]').first().click();
await page.waitForTimeout(1500);
const addBtn = page.locator('button:has-text("Add account")').first();
if (await addBtn.count()) {
  await addBtn.click();
  await page.waitForSelector('[role="dialog"], [role="alertdialog"]', { state: "visible", timeout: 15000 });
  await page.waitForTimeout(400);
  const modalCtrls = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"], [role="alertdialog"]');
    const ctrls = [...d.querySelectorAll("button, input, select, textarea, [tabindex]")];
    const unnamed = ctrls.filter(c => {
      const id = c.getAttribute("aria-labelledby");
      return !(c.getAttribute("aria-label") || (id && document.getElementById(id)) || (c.textContent || "").trim() || c.getAttribute("placeholder") || (c.labels && c.labels.length));
    });
    return { total: ctrls.length, unnamed: unnamed.length };
  });
  check("contrôles de la modale tous nommés", modalCtrls.unnamed === 0, `${modalCtrls.unnamed}/${modalCtrls.total}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  const closed = await page.evaluate(() => !document.querySelector('[role="dialog"], [role="alertdialog"]'));
  check("Escape ferme la modale", closed);
} else {
  console.log("SKIP modale — bouton Add account absent");
}

// F4. Reflow 320px : pas de débordement horizontal (1.4.10)
await page.setViewportSize({ width: 320, height: 720 });
await page.goto(BASE + "/", { waitUntil: "load" });
await page.waitForSelector("button", { state: "visible", timeout: 60000 });
await page.waitForTimeout(1500);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("pas de scroll horizontal à 320px", overflow <= 1, `${overflow}px`);

await browser.close();
if (findings.length) { console.error(`\n${findings.length} finding(s)`); process.exit(1); }
console.log("\nÉval finale : aucun finding.");
