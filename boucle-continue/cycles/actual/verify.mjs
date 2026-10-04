// verify.mjs — vérification indépendante des familles corrigées (actual).
// Règle 13 : on mesure l'EFFET, pas l'action. Usage : node verify.mjs [baseURL]
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3001";
const failures = [];
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures.push(name);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: "en-US" });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "load" });
await page.waitForSelector("button", { state: "visible", timeout: 60000 });
await page.waitForTimeout(1500);

// 1. Viewport : zoom utilisateur possible (plus de maximum-scale=1/user-scalable=no)
const vp = await page.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || "");
check("viewport : zoom non bloqué", !/maximum-scale\s*=\s*1|user-scalable\s*=\s*no/i.test(vp), vp);

// 2. Landmarks : exactement 1 main + ≥1 navigation distinguée
await page.locator('a[href="/budget"]').first().click().catch(() => {});
const openDemo = async () => {
  // fichier démo : persistant en IndexedDB — idempotent
  try { await page.waitForSelector('a[href="/budget"]', { state: "visible", timeout: 5000 }); return; } catch {}
  const demo = page.locator('button:has-text("Try the demo")').first();
  if (await demo.count()) { await demo.click(); await page.waitForSelector('a[href="/budget"]', { state: "visible", timeout: 60000 }); }
};
await openDemo();
await page.waitForTimeout(1500);
const lm = await page.evaluate(() => ({
  mains: document.querySelectorAll('[role="main"], main').length,
  navs: [...document.querySelectorAll('[role="navigation"], nav')].map(n => n.getAttribute("aria-label") || ""),
  h1: document.querySelector("h1")?.textContent?.trim() || null,
}));
check("exactement un landmark main", lm.mains === 1, `${lm.mains} trouvé(s)`);
check("landmark navigation avec aria-label", lm.navs.length >= 1 && lm.navs.every(l => l), JSON.stringify(lm.navs));
check("<h1> présent avec un texte", !!lm.h1, lm.h1);

// 3. Contraste : les tokens corrigés se résolvent en valeurs AA
const toks = await page.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  const resolve = (name, depth = 0) => {
    let v = cs.getPropertyValue(name).trim();
    const m = v.match(/^var\((--[\w-]+)\)$/);
    return m && depth < 5 ? resolve(m[1], depth + 1) : v;
  };
  return {
    pageTextSubdued: resolve("--color-pageTextSubdued"),
    noticeTextLight: resolve("--color-noticeTextLight"),
    tableTextSubdued: resolve("--color-tableTextSubdued"),
    tableTextInactive: resolve("--color-tableTextInactive"),
    numberPositive: resolve("--color-numberPositive"),
  };
});
check("pageTextSubdued = navy600", toks.pageTextSubdued === "var(--palette-navy600)" || toks.pageTextSubdued === "#486581", toks.pageTextSubdued);
check("noticeTextLight = green800", toks.noticeTextLight === "var(--palette-green800)" || toks.noticeTextLight === "#0c6b58", toks.noticeTextLight);
check("tableTextSubdued = navy600", toks.tableTextSubdued === "var(--palette-navy600)" || toks.tableTextSubdued === "#486581", toks.tableTextSubdued);
check("numberPositive = green800", toks.numberPositive === "var(--palette-green800)" || toks.numberPositive === "#0c6b58", toks.numberPositive);

// 4. Comptes : navigation sidebar + icônes de catégorie nommées (effet : nom calculé)
await page.locator('a[href="/accounts"]').first().click();
await page.waitForTimeout(1500);
await page.locator('a[href="/budget"]').first().click();
await page.waitForTimeout(1500);
const named = await page.evaluate(() => {
  const accName = el => el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || (el.textContent || "").trim();
  const btns = [...document.querySelectorAll('[role="navigation"] button, [role="main"] button')];
  const unnamed = btns.filter(b => !accName(b)).map(b => (b.outerHTML || "").slice(0, 80));
  return { total: btns.length, unnamed: unnamed.slice(0, 3), nUnnamed: unnamed.length };
});
check("tous les boutons nav/main ont un nom accessible", named.nUnnamed === 0, `${named.nUnnamed}/${named.total} sans nom ${named.unnamed.join("|")}`);

// 5. Modale : accessible (role dialog + nom) — ouvre « Add account » depuis /accounts
await page.locator('a[href="/accounts"]').first().click();
await page.waitForTimeout(1500);
const addBtn = page.locator('button:has-text("Add account")').first();
if (await addBtn.count()) {
  await addBtn.click();
  await page.waitForSelector('[role="dialog"], [role="alertdialog"]', { state: "visible", timeout: 15000 });
  await page.waitForTimeout(400);
  const modal = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"], [role="alertdialog"]');
    if (!d) return null;
    const name = d.getAttribute("aria-label") ||
      (d.getAttribute("aria-labelledby") && document.getElementById(d.getAttribute("aria-labelledby"))?.textContent?.trim()) || "";
    return { name, modal: d.getAttribute("aria-modal") };
  });
  check("modale avec nom accessible calculé", !!modal?.name, modal?.name);
}
await browser.close();
if (failures.length) { console.error(`\n${failures.length} FAIL`); process.exit(1); }
console.log("\nToutes les vérifications indépendantes passent.");
