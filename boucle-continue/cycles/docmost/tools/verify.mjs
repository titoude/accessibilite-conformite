// verify.mjs — assertions dures du cycle docmost.
// Chaque test mesure un EFFET observable (DOM réel), pas une action.
// Usage: node verify.mjs <baseUrl> [--storage-state auth.json]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.argv[2] || "http://127.0.0.1:5175";
const toolsDir = path.dirname(new URL(import.meta.url).pathname);
const authPath = path.join(toolsDir, "auth.json");
const storage = fs.existsSync(authPath) ? authPath : undefined;

let failures = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
  if (!cond) failures++;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: storage });
const page = await ctx.newPage();
const goto = async (u, wait = 2200) => {
  await page.goto(BASE + u, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(wait);
};

// 1. Couche popup : tous les overlays doivent vivre dans role=complementary
await goto("/home");
const bell = await page.$('button[aria-label*="otification"]');
await bell.click();
await page.waitForTimeout(1200);
let layer = await page.evaluate(() => {
  const l = document.getElementById("a11y-popup-layer");
  return {
    exists: !!l,
    role: l?.getAttribute("role"),
    label: l?.getAttribute("aria-label"),
    popoverInside: !!l?.querySelector('[role="dialog"], .mantine-Popover-dropdown'),
    orphans: [...document.body.children].filter(
      (c) => c.getAttribute("data-portal") === "true",
    ).length,
  };
});
ok("popup-layer existe avec role=complementary + nom", layer.exists && layer.role === "complementary" && !!layer.label);
ok("popover notifications rendue dans la couche", layer.popoverInside);
ok("aucun nœud portal orphelin à la racine de body", layer.orphans === 0, `${layer.orphans} restant(s)`);

// 2. Menu utilisateur : nom accessible calculé + dropdown dans la couche
const avatarBtn = await page.$('button[aria-label*="ccount"], header button:has(.mantine-Avatar-root)');
await page.keyboard.press("Escape");
await avatarBtn?.click();
await page.waitForTimeout(1200);
const menu = await page.evaluate(() => {
  const m = document.querySelector('[role="menu"]');
  const l = document.getElementById("a11y-popup-layer");
  const trigger = document.activeElement;
  return {
    menuExists: !!m,
    insideLayer: !!(l && m && l.contains(m)),
    noSentinelDiv: !m || ![...m.children].some((c) => c.tagName === "DIV" && c.getAttribute("tabindex") === "-1" && !c.getAttribute("role")),
  };
});
ok("menu utilisateur monté dans la couche popup", menu.menuExists && menu.insideLayer);
ok("menu sans enfant div[tabindex] illégal (sentinelle Mantine)", menu.noSentinelDiv);
await page.keyboard.press("Escape");

// 3. Tabs notifications : relation tab→tabpanel réelle
await bell.click();
await page.waitForTimeout(1200);
const tabs = await page.evaluate(() => {
  const t = [...document.querySelectorAll('[role="tab"]')].filter((e) => e.closest('[role="dialog"], .mantine-Popover-dropdown'));
  const first = t.find((e) => e.getAttribute("aria-selected") === "true") || t[0];
  const ac = first?.getAttribute("aria-controls");
  const panel = ac ? document.getElementById(ac) : null;
  return { tabCount: t.length, controls: ac, panelRole: panel?.getAttribute("role"), panelVisible: panel ? panel.offsetHeight > 0 : false };
});
ok("tab notification contrôle un tabpanel monté et visible", tabs.panelRole === "tabpanel" && tabs.panelVisible, `aria-controls=${tabs.controls}`);
await page.keyboard.press("Escape");

// 4. h1 présent sur chaque page du périmètre
const pages = ["/home", "/s/general", "/settings/account/profile", "/settings/account/preferences", "/settings/members", "/s/general/trash", "/templates"];
for (const u of pages) {
  await goto(u);
  const h1 = await page.evaluate(() => {
    const h = document.querySelector("h1");
    return h ? (h.textContent || h.getAttribute("aria-label") || "").trim() : null;
  });
  ok(`h1 présent sur ${u}`, !!h1, h1 || "absent");
}

// 5. Éditeur : contenteditable = role textbox + nom calculé
await goto("/s/general/p/test-page-a11y-YE3rIig7Vn", 3000);
const editor = await page.evaluate(() => {
  const eds = [...document.querySelectorAll('[contenteditable="true"]')];
  const content = eds.find((e) => /content/i.test(e.getAttribute("aria-label") || ""));
  const title = eds.find((e) => /title/i.test(e.getAttribute("aria-label") || ""));
  return {
    content: content ? { role: content.getAttribute("role"), label: content.getAttribute("aria-label"), multiline: content.getAttribute("aria-multiline") } : null,
    title: title ? { role: title.getAttribute("role"), label: title.getAttribute("aria-label") } : null,
  };
});
ok("éditeur contenu role=textbox multiline nommé", editor.content?.role === "textbox" && !!editor.content?.label && editor.content?.multiline === "true", JSON.stringify(editor.content));
ok("éditeur titre role=textbox nommé", editor.title?.role === "textbox" && !!editor.title?.label, JSON.stringify(editor.title));

// 5b. Doc public RENDU (seed littérale) : contenu + lien + toc + éditeurs nommés
await goto("/docs/general/YE3rIig7Vn", 3500);
// le rendu est async : attendre le lien du seed, sinon on mesure un shell vide
await page.waitForSelector('.ProseMirror a[href]', { timeout: 15000 });
const pub = await page.evaluate(() => {
  // plusieurs .ProseMirror existent (titre + contenu) : prendre le plus riche
  const pms = [...document.querySelectorAll(".ProseMirror")];
  const pm = pms.reduce((a, b) => (b.textContent.length > (a?.textContent?.length ?? 0) ? b : a), null);
  const link = pm?.querySelector("a[href]");
  const textboxes = [...document.querySelectorAll('[role="textbox"]')];
  const stray = document.querySelector('[class*="linkWrapper"][aria-haspopup], [class*="linkWrapper"] [aria-haspopup], [class*="linkWrapper"][aria-expanded], [class*="linkWrapper"] [aria-expanded]');
  const tocLinks = [...document.querySelectorAll('[class*="tocLink"]')];
  // normalise toute couleur CSS (rgb(), oklch(), color(srgb …)) en canaux 0-255
  // via color-mix — un regex naïf lit oklch(0.99 0 0) comme rgb(0.99,0,0).
  const toRgb = (c) => {
    const e = document.createElement("i");
    e.style.color = `color-mix(in srgb, ${c} 100%, rgb(0,0,0) 0%)`;
    document.body.append(e);
    const out = getComputedStyle(e).color;
    e.remove();
    const rgb = out.match(/^rgb\(([^)]+)\)/);
    if (rgb) return rgb[1].match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
    const srgb = out.match(/^color\(srgb ([^)]+)\)/);
    if (srgb) return srgb[1].trim().split(/\s+/).slice(0, 3).map((v) => parseFloat(v) * 255);
    return null;
  };
  const lum = (rgb) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]); };
  const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const effBg = (el) => { let n = el; while (n && n !== document.documentElement) { const b = getComputedStyle(n).backgroundColor; if (b && !b.includes("0, 0, 0, 0") && b !== "rgba(0, 0, 0, 0)") return b; n = n.parentElement; } return "rgb(255,255,255)"; };
  const cr = (el) => { if (!el) return null; const fg = toRgb(getComputedStyle(el).color), bg = toRgb(effBg(el)); return fg && bg ? ratio(lum(fg), lum(bg)) : null; };
  return {
    pmFound: !!pm,
    pmCount: pms.length,
    textLen: pm?.textContent?.trim().length ?? 0,
    headingCount: pm ? pm.querySelectorAll("h1,h2,h3").length : 0,
    linkHref: link?.getAttribute("href") ?? null,
    linkText: link?.textContent?.trim() ?? "",
    linkRatio: cr(link),
    tb: textboxes.map((t) => ({ label: t.getAttribute("aria-label"), editable: t.getAttribute("contenteditable") })),
    strayAria: !!stray,
    tocCount: tocLinks.length,
    tocRatio: tocLinks.length ? cr(tocLinks[0]) : null,
  };
});
ok("doc public rend un contenu réel (seed littérale : titre+contenu+lien)", pub.pmFound && pub.textLen > 50 && pub.headingCount >= 1 && !!pub.linkHref && pub.linkText.length > 0, `textLen=${pub.textLen} headings=${pub.headingCount} link=${pub.linkHref}`);
ok("éditeurs read-only publics nommés (role=textbox + aria-label)", pub.tb.length >= 2 && pub.tb.every((t) => !!t.label), JSON.stringify(pub.tb));
ok("aucun wrapper de lien nu ne porte aria-haspopup/expanded", !pub.strayAria);
ok("toc publique rendue et contrastée ≥4.5 (mode clair)", pub.tocCount >= 1 && pub.tocRatio >= 4.5, `${pub.tocCount} liens, ratio=${pub.tocRatio?.toFixed(2)}`);
ok("lien du doc public contrasté ≥4.5 (mode clair)", pub.linkRatio !== null && pub.linkRatio >= 4.5, `ratio=${pub.linkRatio?.toFixed(2)}`);

// 6. Switchs préférences : nom accessible calculé (aria-labelledby)
await goto("/settings/account/preferences");
const switches = await page.evaluate(() => {
  const sw = [...document.querySelectorAll('[role="switch"], input[type="checkbox"].mantine-Switch-input')];
  return sw.slice(0, 6).map((s) => {
    const lb = s.getAttribute("aria-labelledby");
    const al = s.getAttribute("aria-label");
    const txt = (lb && document.getElementById(lb)?.textContent) || al || "";
    // un seul élément <label> réellement associé (for=id OU ancêtre) — le label interne Mantine compte une fois
    const unique = new Set([...document.querySelectorAll(`label[for="${s.id}"]`), s.closest("label")].filter(Boolean));
    return { hasName: !!txt.trim(), labels: unique.size };
  });
});
ok("switchs notifications ont un nom calculé", switches.length > 0 && switches.every((s) => s.hasName), JSON.stringify(switches));
ok("switchs sans labels multiples", switches.every((s) => s.labels <= 1), JSON.stringify(switches.map((s) => s.labels)));

// 7. Modal : titre lié par aria-labelledby quand ouverte
await goto("/s/general/trash");
const modal = await page.evaluate(() => {
  const roots = [...document.querySelectorAll(".mantine-Modal-root")];
  const layers = document.getElementById("a11y-popup-layer");
  return {
    count: roots.length,
    allInsideLayer: roots.every((r) => layers && layers.contains(r)),
    ariaLabelOnRoot: roots.filter((r) => r.hasAttribute("aria-label")).length,
  };
});
ok("modals portées dans la couche popup (region)", modal.allInsideLayer, `${modal.count} modal(s)`);
ok("aucun aria-label illégal sur la racine Modal", modal.ariaLabelOnRoot === 0);

// 8. Thème sombre : contraste sur la coquille docs (mécanisme réel Mantine)
await page.evaluate(() => localStorage.setItem("mantine-color-scheme", "dark"));
await goto("/docs/general/YE3rIig7Vn");
await page.evaluate(() => document.documentElement.setAttribute("data-mantine-color-scheme", "dark"));
await page.waitForTimeout(800);
const contrast = await page.evaluate(() => {
  const toRgb = (c) => {
    const e = document.createElement("i");
    e.style.color = `color-mix(in srgb, ${c} 100%, rgb(0,0,0) 0%)`;
    document.body.append(e);
    const out = getComputedStyle(e).color;
    e.remove();
    const rgb = out.match(/^rgb\(([^)]+)\)/);
    if (rgb) return rgb[1].match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
    const srgb = out.match(/^color\(srgb ([^)]+)\)/);
    if (srgb) return srgb[1].trim().split(/\s+/).slice(0, 3).map((v) => parseFloat(v) * 255);
    return null;
  };
  const lum = (rgb) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]); };
  const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const el = document.querySelector('[class*="searchLabel"], [class*="searchKbd"]');
  if (!el) return { found: false };
  let n = el, bg = "rgb(255,255,255)";
  while (n && n !== document.documentElement) { const b = getComputedStyle(n).backgroundColor; if (!b.includes("0, 0, 0, 0") && b !== "rgba(0, 0, 0, 0)") { bg = b; break; } n = n.parentElement; }
  const fg = toRgb(getComputedStyle(el).color), bgc = toRgb(bg);
  return { found: true, ratio: fg && bgc ? ratio(lum(fg), lum(bgc)) : null };
});
ok("contraste élément docs-shell en mode sombre ≥ 4.5", contrast.found && contrast.ratio >= 4.5, `ratio=${contrast.ratio?.toFixed(2)}`);

await browser.close();
console.log(`\n${failures} échec(s)`);
process.exit(failures ? 1 : 0);
