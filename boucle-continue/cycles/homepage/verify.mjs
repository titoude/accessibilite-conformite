// verify.mjs — vérification indépendante des critères corrigés (homepage).
// Chaque assertion teste l'EFFET mesuré, pas l'action (règle 13 du skill).
// Usage : node verify.mjs [baseURL]   — exit 1 au premier FAIL.
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:30030";
const failures = [];
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures.push(name);
};

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(BASE, { waitUntil: "load" });
await page.waitForSelector("ul li a[href]", { state: "visible", timeout: 15000 });
await page.waitForTimeout(1000);

// 1. Landmarks : header / main / footer présents et bien nichés
const landmarks = await page.evaluate(() => ({
  header: !!document.querySelector("header"),
  main: !!document.querySelector("main"),
  footer: !!document.querySelector("footer"),
  h1InMain: !!document.querySelector("main h1"),
  h1Text: document.querySelector("main h1")?.textContent?.trim() || null,
}));
check("landmark <header> présent", landmarks.header);
check("landmark <main> présent", landmarks.main);
check("landmark <footer> présent", landmarks.footer);
check("<h1> placé dans <main> avec un texte", landmarks.h1InMain && !!landmarks.h1Text, landmarks.h1Text);

// 2. Tout le contenu textuel est dans un landmark (axe 'region' = 0)
const outside = await page.evaluate(() => {
  const inLandmark = el => !!el.closest("header, main, footer, nav, aside, [role=banner], [role=main], [role=contentinfo], [role=navigation], [role=complementary]");
  return [...document.querySelectorAll("body *")].filter(el =>
    el.children.length === 0 && el.textContent.trim() &&
    !el.closest("script, style, template, noscript, .sr-only") && !inLandmark(el)
  ).length;
});
check("aucun texte hors landmark", outside === 0, `${outside} élément(s)`);

// 3. Viewport responsive autorisé (meta viewport sans maximum-scale/user-scalable=no)
const vp = await page.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || "");
check("meta viewport sans blocage du zoom", !/user-scalable\s*=\s*no|maximum-scale\s*=\s*[01](\.0+)?\b/.test(vp), vp);

// 4. Thème : classes SSR présentes dès le premier paint (pas de flash noir-sur-sombre)
const ssrClasses = await page.evaluate(() => document.documentElement.className);
check("classes thème SSR (dark + palette)", /dark/.test(ssrClasses) && /theme-\w+/.test(ssrClasses), ssrClasses);

// 5. Variables --color-* définies même sans la classe de thème (garde :root)
const varFallback = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-800").trim());
check("--color-800 définie au niveau :root", varFallback.length > 0, varFallback || "vide");

// 6. Contrastes mesurés (pas de sous-chaîne ambiguë) sur les zones corrigées
const contrasts = await page.evaluate(() => {
  const lum = c => {
    const [r, g, b] = c.match(/\d+/g).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (f, b) => { const [l1, l2] = [lum(f), lum(b)].sort((a, x) => x - a); return (l1 + 0.05) / (l2 + 0.05); };
  const bg = getComputedStyle(document.body).backgroundColor;
  const out = {};
  const desc = document.querySelector(".service-description");
  if (desc) out["service-description"] = ratio(getComputedStyle(desc).color, bg).toFixed(2);
  const name = document.querySelector(".bookmark-name");
  if (name) out["bookmark-name"] = ratio(getComputedStyle(name).color, bg).toFixed(2);
  return out;
});
for (const [k, v] of Object.entries(contrasts)) check(`contraste ${k} ≥ 4.5`, parseFloat(v) >= 4.5, `${v}:1`);

// 7. Modale quicklaunch : nom accessible calculé + focus dedans + Échap ferme
await page.keyboard.type("home");
await page.waitForSelector("dialog input", { state: "visible", timeout: 15000 });
await page.waitForTimeout(400); // fondu 300ms
const dlg = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  const snap = d?.getAttribute("aria-label") || d?.getAttribute("aria-labelledby") || "";
  return { labelled: snap, focusIn: d?.contains(document.activeElement) };
});
check("dialog : étiquette accessible présente", dlg.labelled.length > 0, dlg.labelled);
check("dialog : le focus est dans la modale à l'ouverture", dlg.focusIn);
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
const closed = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return true;
  const s = getComputedStyle(d);
  return d.getAttribute("aria-hidden") === "true" || s.visibility === "hidden" || s.opacity === "0";
});
check("dialog : Échap ferme la modale", closed);

await browser.close();
console.log(failures.length ? `\n${failures.length} FAIL : ${failures.join(", ")}` : "\nToutes les vérifications passent.");
process.exit(failures.length ? 1 : 0);
