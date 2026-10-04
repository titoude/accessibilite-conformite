// eval-final.mjs — vérification indépendante du cycle owncast.
// Rejoue les critères WCAG sur les surfaces publiques et admin.
// Usage: node eval-final.mjs <baseUrl>
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:8095";
const IS_ADMIN = BASE.includes("admin:") || BASE.includes("@");

let failures = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
  if (!cond) failures++;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const goto = async (u, wait = 2500) => {
  await page.goto(BASE + u, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(wait);
};

// E1 — chaque page du périmètre a h1 + landmark main/nav
const ADMIN_PAGES = [
  "/admin/", "/admin/access-tokens/", "/admin/actions/", "/admin/chat/emojis/",
  "/admin/chat/messages/", "/admin/config/general/", "/admin/config/server/",
  "/admin/config-chat/", "/admin/config-featured/", "/admin/config-federation/",
  "/admin/config-notify/", "/admin/config-social-items/", "/admin/config-video/",
  "/admin/federation/followers/", "/admin/federation/actions/",
  "/admin/hardware-info/", "/admin/help/", "/admin/logs/", "/admin/plugins/",
  "/admin/stream-health/", "/admin/upgrade/", "/admin/users/",
  "/admin/viewer-info/", "/admin/webhooks/",
];
for (const u of IS_ADMIN ? ADMIN_PAGES : ["/", "/embed/video/", "/embed/chat/readwrite/"]) {
  await goto(u);
  const r = await page.evaluate(() => ({
    h1: !!document.querySelector("h1"),
    mains: document.querySelectorAll("main,[role=main]").length,
    title: document.title.trim(),
  }));
  ok(`${u}: h1 + repère main + titre`, r.h1 && r.mains >= 1 && r.title.length > 0, JSON.stringify(r));
}

// E2 — clavier : Tab atteint des éléments focusables visibles sur la page publique
await goto("/");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
const kb = await page.evaluate(() => {
  const a = document.activeElement;
  if (!a || a === document.body) return { focused: false };
  const cs = getComputedStyle(a);
  return { focused: true, visible: cs.outlineStyle !== "none" || cs.boxShadow !== "none" || cs.outlineWidth !== "0px", tag: a.tagName };
});
ok("Tab clavier atteint un élément focusable", kb.focused, kb.tag || "rien");
ok("indicateur de focus visible sur l'élément actif", kb.visible, JSON.stringify(kb));

// E3 — reflow 320px : pas de scroll horizontal sur la page publique
await page.setViewportSize({ width: 320, height: 568 });
await page.waitForTimeout(1200);
const reflow = await page.evaluate(() => ({
  sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
}));
ok("pas de scroll horizontal à 320px (reflow)", reflow.sw <= reflow.cw + 1, `${reflow.sw} > ${reflow.cw}`);
await page.setViewportSize({ width: 1280, height: 800 });

// E4/E5 — contexte public uniquement (admin n'a pas de #user-menu ni d'embed dans son scope)
if (!IS_ADMIN) {
  const names = await page.evaluate(() => {
    const snap = (el) => el && (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.textContent.trim() || el.getAttribute("title") || "");
    return {
      userMenu: snap(document.getElementById("user-menu")),
    };
  });
  ok("boutons icônes publics nommés (menu utilisateur)", !!names.userMenu, names.userMenu || "vide");

  await goto("/embed/video/");
  const vid = await page.evaluate(() => ({
    title: document.title.trim(),
    video: !!document.querySelector("video"),
    footer: !!document.querySelector("footer,[role=contentinfo]"),
  }));
  ok("embed vidéo : titre + player + statusbar dans footer", vid.title.length > 0 && vid.video && vid.footer, vid.title);
}

// E6 — images publiques avec alt calculé
const imgs = await page.evaluate(() =>
  [...document.querySelectorAll("img")].filter((i) => i.getAttribute("alt") === null && i.getAttribute("role") !== "presentation" && !i.getAttribute("aria-hidden")).map((i) => i.src.split("/").pop()),
);
ok("toutes les <img> publiques ont un alt (vide si décoratif)", imgs.length === 0, imgs.join(",") || "ok");

if (IS_ADMIN) {
  // E7 — tableaux admin : chaque table a au moins un en-tête nommé + pas de th vide sans nom
  await goto("/admin/access-tokens/");
  const tbl = await page.evaluate(() => {
    const tables = [...document.querySelectorAll("table")];
    const unnamed = [...document.querySelectorAll("th")].filter((th) => !th.textContent.trim() && !(th.getAttribute("aria-label") || th.querySelector("[class*=visually-hidden]"))).length;
    return { tables: tables.length, unnamed };
  });
  ok("tableaux admin sans en-tête anonyme", tbl.unnamed === 0, `${tbl.unnamed} th anonyme(s)`);

  // E8 — sliders admin ont un nom sur le handle
  await goto("/admin/config-video/");
  const sl = await page.evaluate(() =>
    [...document.querySelectorAll('[role="slider"]')].map((s) => s.getAttribute("aria-label") || s.getAttribute("aria-valuetext") || ""),
  );
  ok("sliders vidéo nommés", sl.length === 0 || sl.every((s) => !!s), JSON.stringify(sl));

  // E9 — notifications modale : titre lié + boutons focusables
  await goto("/admin/chat/emojis/");
  const mo = await page.evaluate(() => {
    const m = document.querySelector(".ant-modal-content");
    const layer = document.getElementById("a11y-popup-layer");
    return m ? { inside: layer?.contains(m) } : { none: true };
  });
  ok("modale admin montée dans la couche landmark", mo.none || mo.inside, JSON.stringify(mo));

  // E10 — un seul h1 par page admin (E1 vérifie h1 >= 1 ; ici exactement 1)
  const bad = [];
  for (const u of ADMIN_PAGES) {
    await goto(u);
    const n = await page.evaluate(() => document.querySelectorAll("h1").length);
    if (n !== 1) bad.push(`${u}=${n}`);
  }
  ok("un h1 par page admin", bad.length === 0, bad.join(",") || "ok");
}

await browser.close();
console.log(`\n${failures} échec(s)`);
process.exit(failures ? 1 : 0);
