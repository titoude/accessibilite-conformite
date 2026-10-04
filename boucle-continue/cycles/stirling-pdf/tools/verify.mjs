// verify.mjs — assertions dures du cycle stirling-pdf.
// Chaque test mesure un EFFET observable (DOM/style réel), pas une action.
// Usage: node verify.mjs <baseUrl>
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:8110";

let failures = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
  if (!cond) failures++;
};

const browser = await chromium.launch();
const page = await browser.newPage();
const goto = async (u, wait = 1800) => {
  await page.goto(BASE + u, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(wait);
};
const toRgb = (c) => c.match(/\d+(\.\d+)?/g)?.slice(0, 3).map(Number) || [0, 0, 0];
const lum = ([r, g, b]) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const contrastOf = (sel) => page.evaluate((s) => {
  const el = document.querySelector(s);
  if (!el) return { found: false };
  let n = el, bg = "rgb(255, 255, 255)";
  while (n && n !== document.documentElement) {
    const b = getComputedStyle(n).backgroundColor;
    if (b !== "rgba(0, 0, 0, 0)" && !b.endsWith(", 0)")) { bg = b; break; }
    n = n.parentElement;
  }
  const toRgb = (c) => c.match(/\d+(\.\d+)?/g)?.slice(0, 3).map(Number) || [0, 0, 0];
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return { found: true, ratio: ratio(lum(toRgb(getComputedStyle(el).color)), lum(toRgb(bg))), fg: getComputedStyle(el).color, bg };
}, sel);

// 1. <main> + <h1> sur toutes les pages du périmètre
const pages = ["/", "/merge-pdfs", "/multi-tool", "/view-pdf", "/pdf-organizer", "/crop", "/rotate-pdf", "/pipeline", "/sign", "/login", "/about", "/licenses"];
for (const u of pages) {
  await goto(u);
  const r = await page.evaluate(() => {
    const mains = [...document.querySelectorAll("main, [role=main]")].filter((m) => !m.parentElement.closest("main, [role=main]") && !m.closest("nav, footer, [role=complementary]"));
    const h1 = [...document.querySelectorAll("h1")].find((h) => !h.closest(".modal, [aria-hidden=true]"));
    return {
      mains: mains.length,
      h1: h1 ? (h1.textContent || "").trim() : null,
      h1Visible: h1 ? (h1.getBoundingClientRect().height > 0 || h1.classList.contains("visually-hidden")) : false,
    };
  });
  ok(`<main> unique + <h1> non vide sur ${u}`, r.mains === 1 && !!r.h1 && !r.h1.startsWith("??"), `main=${r.mains} h1=${JSON.stringify(r.h1)}`);
}

// 2. Tooltip navbar : nom accessible calculé + tooltip clavier
await goto("/");
const tooltip = await page.evaluate(() => {
  const iconBtns = [...document.querySelectorAll("[data-title]")].filter((e) => !e.textContent.trim());
  const named = iconBtns.filter((e) => e.getAttribute("aria-label") || e.getAttribute("title"));
  return { iconOnly: iconBtns.length, named: named.length };
});
ok("boutons icône navbar ont un nom accessible", tooltip.iconOnly === 0 || tooltip.named === tooltip.iconOnly, `${tooltip.named}/${tooltip.iconOnly} nommés`);

// 3. Tooltip affiché au focus clavier (effet métier, pas seulement :hover)
const tipFocus = await page.evaluate(async () => {
  const el = [...document.querySelectorAll("[data-title]")].find((e) => {
    const t = e.tabIndex >= 0 ? e : e.closest("a,button,[tabindex]");
    return t && t.offsetParent !== null && e.offsetParent !== null;
  });
  if (!el) return { found: false };
  const target = el.tabIndex >= 0 ? el : el.closest("a,button,[tabindex]") || el;
  target.focus();
  await new Promise((r) => setTimeout(r, 700));
  const tip = [...document.querySelectorAll(".btn-tooltip")].find((t) => getComputedStyle(t).display !== "none");
  return { found: true, shown: !!tip, role: tip?.getAttribute("role"), hiddenAttr: tip?.getAttribute("aria-hidden") };
});
ok("tooltip affiché au focus clavier (role=tooltip)", tipFocus.found && tipFocus.shown && tipFocus.role === "tooltip", JSON.stringify(tipFocus));

// 4. Contraste réel mesuré : liens + boutons + badge
await goto("/");
for (const [sel, min] of [[".feature-group a", 4.5], [".go-pro-badge", 4.5], ["#footer a.footer-link", 4.5]]) {
  const c = await contrastOf(sel);
  ok(`contraste ${sel} ≥ ${min}`, c.found && c.ratio >= min, c.found ? `ratio=${c.ratio.toFixed(2)} fg=${c.fg} bg=${c.bg}` : "absent");
}
await goto("/merge-pdfs");
for (const [sel, min] of [["#sortByNameBtn", 4.5], ["#submitBtn", 4.5], ["#resetFileInputBtn", 4.5]]) {
  const c = await contrastOf(sel);
  ok(`contraste ${sel} ≥ ${min}`, c.found && c.ratio >= min, c.found ? `ratio=${c.ratio.toFixed(2)}` : "absent");
}

// 5. Footer : taille de cible ≥ 24px (2.5.8 AA)
await goto("/");
const target = await page.evaluate(() =>
  [...document.querySelectorAll("#footer a.footer-link")].map((a) => a.getBoundingClientRect().height));
ok("liens footer ≥ 24px de haut", target.length > 0 && target.every((h) => h >= 24), target.map((h) => h.toFixed(0)).join(","));

// 6. Titres de groupes : h2, pas h6 (ordre des titres)
const headings = await page.evaluate(() => {
  const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
  const menuTitles = [...document.querySelectorAll(".menu-title")].map((h) => h.tagName);
  return { seq: hs.slice(0, 12), menuTitles };
});
ok(".menu-title rendus en h2", headings.menuTitles.length > 0 && headings.menuTitles.every((t) => t === "H2"), headings.menuTitles.join(","));

// 7. view-pdf : landmark viewer + footer hors main + radios éditeur
await goto("/view-pdf");
const viewer = await page.evaluate(() => {
  const oc = document.getElementById("outerContainer");
  const h1 = document.getElementById("viewerHeading");
  const footer = document.getElementById("footer");
  const group = document.getElementById("editorModeButtons");
  const radios = group ? [...group.querySelectorAll('[role="radio"]')].map((r) => r.id) : [];
  return {
    mainRole: oc?.getAttribute("role"),
    h1: h1 ? h1.textContent.trim() : null,
    footerRole: footer?.getAttribute("role"),
    footerInsideMain: footer ? (oc ? oc.contains(footer) : null) : "absent",
    radios,
    freeText: document.getElementById("editorFreeText")?.getAttribute("role"),
    ink: document.getElementById("editorInk")?.getAttribute("role"),
    groupRole: group?.getAttribute("role"),
    tabindex: [...document.querySelectorAll("[tabindex]")].filter((e) => +e.getAttribute("tabindex") > 0).length,
  };
});
ok("outerContainer role=main + h1 viewer", viewer.mainRole === "main" && !!viewer.h1 && !viewer.h1.startsWith("??"), JSON.stringify({ role: viewer.mainRole, h1: viewer.h1 }));
ok("footer role=none (pas de contentinfo imbriqué)", viewer.footerRole === "none", `role=${viewer.footerRole} inMain=${viewer.footerInsideMain}`);
ok("boutons mode éditeur = radios dans radiogroup", viewer.groupRole === "radiogroup" && viewer.freeText === "radio" && viewer.ink === "radio", JSON.stringify({ group: viewer.groupRole, ft: viewer.freeText, ink: viewer.ink }));
ok("aucun tabindex positif dans view-pdf", viewer.tabindex === 0, `${viewer.tabindex} restant(s)`);

// 8. Labels pdf.js : aria-label résolu APRÈS localisation (ftl)
const ftl = await page.evaluate(() => ({
  page: document.getElementById("pageNumber")?.getAttribute("aria-label"),
  zoom: document.getElementById("scaleSelect")?.getAttribute("aria-label"),
}));
ok("aria-label pdf.js post-l10n (pageNumber, scaleSelect)", !!ftl.page && !ftl.page.includes("{") && !!ftl.zoom, JSON.stringify(ftl));

// 9. i18n résolue : aucune clé ??x_y?? affichée
const unresolved = await page.evaluate(() => (document.body.innerText.match(/\?\?[a-zA-Z0-9_.]+_[a-zA-Z_]+\?\?/g) || []).slice(0, 3));
ok("aucune clé i18n non résolue visible", unresolved.length === 0, unresolved.join(","));

// 10. Boutons sign.html nommés (clés th:aria-label résolues)
await goto("/sign");
const signBtns = await page.evaluate(() => {
  const btns = [...document.querySelectorAll("button")].filter((b) => !b.textContent.trim());
  return btns.slice(0, 10).map((b) => ({ id: b.id, name: (b.getAttribute("aria-label") || "").slice(0, 40) }));
});
ok("boutons icône sign nommés", signBtns.length > 0 && signBtns.every((b) => b.name && !b.name.startsWith("??")), JSON.stringify(signBtns.map((b) => b.id)));

// 11. État fichier chargé : organizer affiche .selected-files
await goto("/pdf-organizer");
await page.setInputFiles("input[type=file]", "/tmp/test3pages.pdf");
await page.waitForSelector(".selected-files", { state: "visible", timeout: 20000 }).catch(() => {});
const sel = await page.evaluate(() => ({
  sel: !!document.querySelector(".selected-files")?.offsetParent,
  info: !!document.querySelector(".file-info")?.offsetParent,
}));
ok("organizer : fichier chargé visible (.selected-files)", sel.sel && sel.info, JSON.stringify(sel));

// 12. Viewport : maximum-scale non bridé (1.4.10)
const vp = await page.evaluate(() => document.querySelector('meta[name=viewport]')?.getAttribute("content") || "");
ok("viewport sans maximum-scale réducteur", !/maximum-scale\s*=\s*[01](\.0+)?\b/.test(vp), vp);

await browser.close();
console.log(`\n${failures} échec(s)`);
process.exit(failures ? 1 : 0);
