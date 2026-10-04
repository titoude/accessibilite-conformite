// eval-final.mjs — évaluation INDÉPENDANTE du cycle docmost.
// Utilise des URLs/états NON couverts par verify.mjs : des pages et des
// interactions différentes pour attraper ce que la boucle aurait "appris à cacher".
// Usage: node eval-final.mjs <baseUrl>
import { chromium } from "playwright";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const AXE_SRC = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
async function runAxe(page) {
  await page.evaluate(AXE_SRC);
  return page.evaluate((tags) => window.axe.run(document, { runOnly: { type: "tag", values: tags } }), AXE_TAGS);
}

const BASE = process.argv[2] || "http://127.0.0.1:5175";
const toolsDir = path.dirname(new URL(import.meta.url).pathname);
const storage = fs.existsSync(path.join(toolsDir, "auth.json")) ? path.join(toolsDir, "auth.json") : undefined;

let failures = 0;
const ok = (n, c, d = "") => { console.log(`${c ? "PASS" : "FAIL"} ${n}${d ? " — " + d : ""}`); if (!c) failures++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: storage });
const page = await ctx.newPage();
const axe = async (u, wait = 2500) => {
  await page.goto(BASE + u, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(wait);
  const r = await runAxe(page);
  return r.violations;
};

// A. Pages NON auditées dans le cycle : settings workspace, groups, spaces, shares, security
const fresh = ["/settings/workspace", "/settings/members", "/settings/groups", "/settings/spaces", "/settings/security", "/settings/sharing"];
for (const u of fresh) {
  const v = await axe(u);
  ok(`axe 0 violation sur ${u} (hors périmètre verify)`, v.length === 0, v.map((x) => x.id).join(","));
}

// B. Modal page-history réelle ouverte : role dialog + nom calculé + couche.
// Chemin réel : bouton « Page actions » (Menu.Target) → item « Page history ».
await page.goto(BASE + "/s/general/p/test-page-a11y-YE3rIig7Vn", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(3000);
const actionsBtn = await page.$('button[aria-label="Page actions"], button[aria-label*="actions" i]');
if (actionsBtn) {
  await actionsBtn.click();
  await page.waitForSelector('[role="menu"]', { timeout: 8000 }).catch(() => {});
}
const histItem = await page.$('[role="menuitem"]:has-text("history"), [role="menuitem"]:has-text("istorique")');
if (histItem) { await histItem.click(); await page.waitForSelector('[role="dialog"]', { timeout: 8000 }).catch(() => {}); }
await page.waitForTimeout(1200);
const dlg = await page.evaluate(() => {
  const ds = [...document.querySelectorAll('[role="dialog"]')].filter((d) => d.offsetHeight > 0);
  const d = ds[0];
  const lb = d?.getAttribute("aria-labelledby");
  return { found: !!d, labelledby: lb, titleText: lb ? document.getElementById(lb)?.textContent : null, insideLayer: d ? document.getElementById("a11y-popup-layer")?.contains(d) : false };
});
// Non-vacueux : FAIL si aucun dialog ne s'est ouvert (found:false = interaction
// non produite → l'assertion ne doit PAS passer à vide) ; si ouvert, doit être
// nommé ET monté dans la couche popup.
ok("modal ouverte = role dialog nommée dans la couche", dlg.found && !!dlg.titleText && !!dlg.insideLayer, JSON.stringify(dlg));
await page.keyboard.press("Escape");

// C. Commentaires/mention dans l'éditeur (zone non testée) : axe sur l'éditeur en mode sombre
await page.evaluate(() => document.documentElement.setAttribute("data-mantine-color-scheme", "dark"));
await page.waitForTimeout(800);
const darkV = await runAxe(page);
ok("éditeur en mode sombre : axe 0 violation", darkV.violations.length === 0, darkV.violations.map((x) => x.id).join(","));
await page.evaluate(() => document.documentElement.setAttribute("data-mantine-color-scheme", "light"));

// D. Page publique share (si existante) + 404 réelle
const v404 = await axe("/definitely-not-a-real-route-xyz", 2000);
ok("page 404 réelle : axe 0 violation", v404.length === 0, v404.map((x) => x.id).join(","));

// E. Zoom/reflow réel : viewport 320px — contenu clé toujours présent
await page.setViewportSize({ width: 320, height: 700 });
await page.goto(BASE + "/settings/account/profile", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
const reflow = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  const inputs = document.querySelectorAll("input:not([type=hidden]), select, textarea").length;
  return { h1: !!h1, horizontalOverflowPx: overflow, inputs };
});
ok("reflow 320px : h1 présent, champs présents, pas d'overflow horizontal structurel", reflow.h1 && reflow.inputs > 0 && reflow.horizontalOverflowPx < 2, JSON.stringify(reflow));
await page.setViewportSize({ width: 1280, height: 800 });

await browser.close();
console.log(`\n${failures} échec(s)`);
process.exit(failures ? 1 : 0);
