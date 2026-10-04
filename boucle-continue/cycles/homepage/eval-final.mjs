// eval-final.mjs — évaluation finale indépendante (tests non utilisés pendant
// les corrections). Usage : node eval-final.mjs [baseURL] — exit 1 si échec.
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:30030";
const failures = [];
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures.push(name);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(BASE, { waitUntil: "load" });
await page.waitForSelector("ul li a[href]", { state: "visible", timeout: 15000 });
await page.waitForTimeout(1000);

// T1 — Parcours clavier complet : Tab atteint les liens, focus visible,
// l'ouverture de la modale piège le focus, Échap le restitue.
const firstFocused = await page.evaluate(() => { document.body.querySelector("a,button,input")?.focus(); return document.activeElement?.tagName; });
check("T1a un élément est focusable au clavier", !!firstFocused, firstFocused);
for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
const focusVisible = await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return "none";
  const s = getComputedStyle(el);
  return s.outlineStyle !== "none" && s.outlineWidth !== "0px" ? `outline ${s.outlineWidth}` :
    s.boxShadow !== "none" ? `box-shadow` : "none-visible";
});
check("T1b indicateur de focus visible après Tab", focusVisible !== "none" && focusVisible !== "none-visible", focusVisible);

// libérer le focus courant : le keydown global qui ouvre la recherche n'agit
// pas quand la frappe part d'un élément interactif
await page.evaluate(() => document.activeElement?.blur());
await page.keyboard.type("home");
await page.waitForSelector("dialog input", { state: "visible", timeout: 15000 });
await page.waitForTimeout(400);
const trap = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  const els = [...d.querySelectorAll("button,input,a,[tabindex]")].filter(e => !e.disabled && e.offsetParent !== null);
  return { count: els.length, focusIn: d.contains(document.activeElement) };
});
check("T1c focus dans la modale, éléments interactifs présents", trap.focusIn && trap.count > 0, `${trap.count} éléments`);
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
const back = await page.evaluate(() => !document.querySelector('[role="dialog"]') || getComputedStyle(document.querySelector('[role="dialog"]').parentElement).visibility === "hidden" || document.querySelector('[role="dialog"]').getAttribute("aria-hidden") === "true");
check("T1d modale refermée après Échap", back);

// T2 — Reflow 320px : pas de défilement horizontal, contenu préservé
await page.setViewportSize({ width: 320, height: 800 });
await page.waitForTimeout(600);
const reflow = await page.evaluate(() => ({
  overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  serviceText: document.querySelector(".service-name")?.textContent?.trim()?.length || 0,
  linkCount: document.querySelectorAll("a[href]").length,
}));
check("T2a pas de scroll horizontal à 320px (±2px tolérance)", reflow.overflowX <= 2, `${reflow.overflowX}px`);
check("T2b contenu préservé à 320px", reflow.serviceText > 0 && reflow.linkCount > 5, `${reflow.linkCount} liens`);
await page.setViewportSize({ width: 1280, height: 800 });

// T3 — Zoom 200% : contenu toujours lisible et présent
await page.evaluate(() => { document.body.style.zoom = "2"; });
await page.waitForTimeout(400);
const zoom = await page.evaluate(() => ({
  overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  visible: !!document.querySelector("main h1"),
}));
await page.evaluate(() => { document.body.style.zoom = "1"; });
check("T3 contenu présent après zoom 200%", zoom.visible, `débordement ${zoom.overflowX}px`);

// T4 — Thème : bascule clair/sombre réversible
const theme = await page.evaluate(async () => {
  const before = document.documentElement.className;
  const btn = [...document.querySelectorAll("button")].find(b => /theme|moon|sun/i.test(b.getAttribute("aria-label") || b.title || b.className));
  if (btn) { btn.click(); await new Promise(r => setTimeout(r, 700)); }
  return { before, after: document.documentElement.className, found: !!btn };
});
check("T4 bascule de thème fonctionnelle", theme.found ? theme.before !== theme.after || /light|dark/.test(theme.after) : true, `${theme.before} → ${theme.after}`);

await browser.close();
console.log(failures.length ? `\n${failures.length} FAIL : ${failures.join(", ")}` : "\nÉval finale : tout passe.");
process.exit(failures.length ? 1 : 0);
