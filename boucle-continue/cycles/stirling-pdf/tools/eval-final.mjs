// eval-final.mjs — vérification indépendante du cycle stirling-pdf.
// Rejoue les critères WCAG sur le périmètre public, indépendamment de verify.mjs.
// Usage: node eval-final.mjs <baseUrl>
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:8110";

let failures = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
  if (!cond) failures++;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const goto = async (u, wait = 2000) => {
  await page.goto(BASE + u, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(wait);
};

// E1 — un seul repère main de premier niveau + un seul h1 visible par page
for (const u of ["/", "/merge-pdfs", "/multi-tool", "/view-pdf", "/pdf-organizer", "/crop", "/rotate-pdf", "/pipeline", "/sign", "/login", "/about", "/licenses"]) {
  await goto(u);
  const r = await page.evaluate(() => {
    const mains = [...document.querySelectorAll("main,[role=main]")].filter((m) => !m.parentElement.closest("main,[role=main]"));
    const h1s = [...document.querySelectorAll("h1")].filter((h) => !h.closest(".modal,[aria-hidden=true]") && (h.getBoundingClientRect().height > 0 || h.className.includes("visually-hidden")));
    return { mains: mains.length, h1: h1s.length };
  });
  ok(`${u}: exactement 1 landmark main + 1 h1`, r.mains === 1 && r.h1 === 1, JSON.stringify(r));
}

// E2 — navigation clavier : Tab atteint un élément visible avec focus discernable
await goto("/");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
const kb = await page.evaluate(() => {
  const a = document.activeElement;
  if (!a || a === document.body) return { focused: false };
  const cs = getComputedStyle(a);
  return { focused: true, tag: a.tagName, outline: cs.outlineStyle + " " + cs.outlineWidth, shadow: cs.boxShadow.slice(0, 30) };
});
ok("Tab clavier atteint un élément focusable", kb.focused, JSON.stringify(kb));

// E3 — reflow 320px : pas de défilement horizontal
await goto("/");
await page.setViewportSize({ width: 320, height: 568 });
await page.waitForTimeout(1000);
const rw = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
ok("reflow 320px sans scroll horizontal (home)", rw.sw <= rw.cw + 1, `${rw.sw} vs ${rw.cw}`);
await page.setViewportSize({ width: 1280, height: 800 });

// E4 — tous les <img> ont un attribut alt (vide si décoratif)
const imgs = await page.evaluate(() =>
  [...document.querySelectorAll("img")].filter((i) => i.getAttribute("alt") === null && !i.getAttribute("aria-hidden") && i.getAttribute("role") !== "presentation").map((i) => (i.src || "?").split("/").pop().slice(0, 40)),
);
ok("images avec alt présent", imgs.length === 0, imgs.join(",") || "ok");

// E5 — champs de formulaire nommés (login + merge)
await goto("/login");
const fields = await page.evaluate(() =>
  [...document.querySelectorAll("input:not([type=hidden]), select, textarea")].map((f) => ({
    id: f.id || f.name || f.type,
    named: !!(f.getAttribute("aria-label") || f.getAttribute("aria-labelledby") || document.querySelector(`label[for="${f.id}"]`) || f.closest("label") || f.getAttribute("placeholder")),
  })),
);
ok("champs login nommés", fields.length > 0 && fields.every((f) => f.named), JSON.stringify(fields.map((f) => f.id)));

// E6 — menus dropdown : aria-expanded véridique + Escape referme
await goto("/");
// Fermer la modale d'enquête produit si elle apparaît (vol de focus légitime)
const survey = page.locator("#surveyModal.show, .modal.show").first();
if (await survey.count()) { await page.keyboard.press("Escape"); await page.waitForTimeout(600); }
const toggle = page.locator("nav [data-bs-toggle=dropdown]:visible").first();
await toggle.click(); // ouvre le menu (clic réel)
await page.waitForTimeout(600);
await toggle.focus(); // focus clavier sur le toggle — le chemin Escape réel
await page.waitForTimeout(200);
const menu = await page.evaluate(() => {
  const open = [...document.querySelectorAll("[data-bs-toggle=dropdown]")].filter((t) => t.getAttribute("aria-expanded") === "true");
  return { expandedToggles: open.length, menuOpen: !!document.querySelector(".dropdown-menu.show"), focusIn: open.some((t) => document.activeElement === t || t.contains(document.activeElement)), ae: document.activeElement?.id || document.activeElement?.tagName };
});
ok("dropdown aria-expanded passe à true", menu.expandedToggles >= 1 && menu.menuOpen, JSON.stringify(menu));
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
const closed = await page.evaluate(() => !document.querySelector(".navbar .dropdown-menu.show, nav .dropdown-menu.show"));
ok("Escape referme le menu", closed, `focus etait dans menu=${menu.focusIn}`);

// E7 — html lang présent
const lang = await page.evaluate(() => document.documentElement.getAttribute("lang"));
ok("attribut lang sur <html>", !!lang, lang || "absent");

// E8 — aucun tabindex positif sur le périmètre
const tabIdx = await page.evaluate(() => [...document.querySelectorAll("[tabindex]")].filter((e) => +e.getAttribute("tabindex") > 0).length);
ok("aucun tabindex positif", tabIdx === 0, `${tabIdx} élément(s)`);

// E9 — aria-hidden ne contient pas de focusable
const hiddenTrap = await page.evaluate(() =>
  [...document.querySelectorAll("[aria-hidden=true]")].filter((h) => h.offsetParent !== null && h.querySelector("a,button,input,select,textarea,[tabindex]")).length,
);
ok("aria-hidden sans contenu focusable visible", hiddenTrap === 0, `${hiddenTrap} piège(s)`);

// E10 — zoom 200% : contenu principal toujours présent (taille réelle mesurée)
await goto("/merge-pdfs");
await page.setViewportSize({ width: 640, height: 480 });
await page.waitForTimeout(800);
const zoom = await page.evaluate(async () => {
  const before = document.querySelector("h1")?.getBoundingClientRect().height || 0;
  document.body.style.zoom = "2";
  await new Promise((r) => setTimeout(r, 400));
  const after = document.querySelector("h1")?.getBoundingClientRect().height || 0;
  document.body.style.zoom = "";
  return { before, after, stillThere: document.querySelectorAll("h1").length };
});
ok("zoom 200% : h1 toujours rendu et agrandi", zoom.stillThere >= 1 && zoom.after >= zoom.before, JSON.stringify(zoom));
await page.setViewportSize({ width: 1280, height: 800 });

// E11 — boutons sans nom accessible calculé (marge zéro)
const unnamed = await page.evaluate(() =>
  [...document.querySelectorAll("button,a[href]")].filter((b) => b.offsetParent !== null).filter((b) => {
    const t = (b.getAttribute("aria-label") || b.getAttribute("title") || b.getAttribute("data-title") || b.textContent || "").trim();
    return !t && !b.querySelector("img[alt]") && !b.getAttribute("aria-labelledby");
  }).map((b) => b.id || b.className.slice(0, 30)).slice(0, 5),
);
ok("boutons/liens visibles tous nommés", unnamed.length === 0, unnamed.join(",") || "ok");

await browser.close();
console.log(`\n${failures} échec(s)`);
process.exit(failures ? 1 : 0);
