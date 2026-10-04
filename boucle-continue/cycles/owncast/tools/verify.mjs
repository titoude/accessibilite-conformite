// verify.mjs — assertions dures du cycle owncast.
// Chaque test mesure un EFFET observable (DOM réel), pas une action.
// Usage: node verify.mjs <baseUrl>
//   public : node verify.mjs http://localhost:8095
//   admin  : node verify.mjs http://admin:abc123@localhost:8095
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:8095";
const IS_ADMIN = BASE.includes("admin:") || BASE.includes("@");

let failures = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
  if (!cond) failures++;
};

const browser = await chromium.launch();
const page = await browser.newPage();
const goto = async (u, wait = 2500) => {
  await page.goto(BASE + u, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(wait);
};
const ratio = (hex1, hex2) => {
  const lum = (h) => {
    const n = parseInt(h.slice(1), 16);
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
  };
  const [a, b] = [lum(hex1), lum(hex2)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

// ---------- surface publique ----------
await goto("/");
const doc = await page.evaluate(() => ({
  lang: document.documentElement.getAttribute("lang"),
  viewport: document.querySelector('meta[name="viewport"]')?.getAttribute("content") || "",
  mains: document.querySelectorAll("main").length,
  layer: !!document.getElementById("a11y-popup-layer"),
  layerRole: document.getElementById("a11y-popup-layer")?.getAttribute("role"),
  layerLabel: document.getElementById("a11y-popup-layer")?.getAttribute("aria-label"),
}));
ok("html lang renseigné", doc.lang === "en", doc.lang);
ok("viewport sans maximum-scale bloquant", !/maximum-scale\s*=\s*1(\.0+)?\b/.test(doc.viewport), doc.viewport);
ok("un seul repère <main> sur la page publique", doc.mains === 1, `${doc.mains}`);
ok("couche popup landmark présente et nommée", doc.layer && doc.layerRole === "complementary" && !!doc.layerLabel);

const portals = await page.evaluate(() => {
  const layer = document.getElementById("a11y-popup-layer");
  const stray = [...document.body.children].filter(
    (c) => c.id !== "a11y-popup-layer" && c.querySelector?.(".ant-dropdown,.ant-tooltip,.ant-modal-wrap"),
  ).length;
  return { stray, layerExists: !!layer };
});
ok("aucun portail antd orphelin hors de la couche", portals.stray === 0, `${portals.stray}`);

// dropdown utilisateur : les overlays antd se montent dans la couche
const userMenu = await page.$("#user-menu");
if (userMenu) {
  await userMenu.click();
  await page.waitForTimeout(1000);
  const inLayer = await page.evaluate(() => {
    const l = document.getElementById("a11y-popup-layer");
    return { dd: !!l?.querySelector(".ant-dropdown"), modal: 0 };
  });
  ok("dropdown utilisateur monté dans la couche landmark", inLayer.dd);
  await page.keyboard.press("Escape");
}

// ---------- admin ----------
if (IS_ADMIN) {
  await goto("/admin/users/");
  const modal = await page.evaluate(() => {
    const t = document.querySelector(".ant-modal-title");
    const h = document.querySelector(".ant-modal-header");
    const p = document.querySelector(".ant-modal-body > p");
    const hx = (s) => {
      const m = s.match(/\d+(\.\d+)?/g)?.slice(0, 3).map(Number);
      return m ? "#" + m.map((v) => v.toString(16).padStart(2, "0")).join("") : null;
    };
    const bgOf = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const b = getComputedStyle(n).backgroundColor;
        if (b && b !== "rgba(0, 0, 0, 0)" && !b.endsWith(", 0)")) return hx(b);
        n = n.parentElement;
      }
      return null;
    };
    return t && h && p
      ? {
          title: hx(getComputedStyle(t).color),
          header: bgOf(t),
          body: hx(getComputedStyle(p).color),
          bodyBg: bgOf(p),
        }
      : null;
  });
  if (modal) {
    ok("titre de modale contrasté (≥4.5:1)", ratio(modal.title, modal.header) >= 4.5, `${modal.title} sur ${modal.header} = ${ratio(modal.title, modal.header).toFixed(2)}`);
    ok("corps de modale contrasté (≥4.5:1)", ratio(modal.body, modal.bodyBg) >= 4.5, `${modal.body} sur ${modal.bodyBg} = ${ratio(modal.body, modal.bodyBg).toFixed(2)}`);
  } else {
    ok("modale FatalError absente (serveur joignable) ou contrastée", true);
  }

  const sw = await page.evaluate(() => {
    const el = document.querySelector(".ant-switch-inner-unchecked, .ant-switch-inner");
    if (!el) return null;
    const track = el.closest(".ant-switch");
    const hx = (s) => "#" + (s.match(/\d+/g)?.slice(0, 3).map((v) => Number(v).toString(16).padStart(2, "0")).join("") || "000");
    return { fg: hx(getComputedStyle(el).color), bg: hx(getComputedStyle(track).backgroundColor) };
  });
  if (sw) ok("libellé interne du switch contrasté (≥4.5:1)", ratio(sw.fg, sw.bg) >= 4.5, `${sw.fg} sur ${sw.bg} = ${ratio(sw.fg, sw.bg).toFixed(2)}`);

  const cols = await page.evaluate(() => {
    return [...document.querySelectorAll("th")].filter((th) => !th.textContent.trim() && !th.querySelector("[class*=visually-hidden], [class*=sr-only]")).map((th) => th.className);
  });
  ok("en-têtes de colonnes vides ont un nom masqué", cols.length === 0, cols.join(",") || "toutes nommées");

  const selects = await page.evaluate(() => {
    return [...document.querySelectorAll(".ant-select")].filter((s) => {
      const inp = s.querySelector(".ant-select-selection-search-input, [role=combobox]");
      return inp && !inp.getAttribute("aria-label") && !inp.getAttribute("aria-labelledby");
    }).length;
  });
  ok("tous les Select ont un nom accessible", selects === 0, `${selects} sans nom`);

  const h1 = await page.evaluate(() => document.querySelector("h1")?.textContent?.trim());
  ok("h1 présent sur la page admin", !!h1, h1 || "absent");

  const ids = await page.evaluate(() => {
    const all = [...document.querySelectorAll("[id]")].map((e) => e.id);
    return all.length - new Set(all).size;
  });
  ok("aucun id dupliqué sur la page admin", ids === 0, `${ids} doublon(s)`);

  // CodeMirror : éditeurs avec role=textbox + nom
  await goto("/admin/config/general/");
  const cm = await page.evaluate(() =>
    [...document.querySelectorAll(".cm-content")].map((e) => ({
      role: e.getAttribute("role"), label: e.getAttribute("aria-label"), multi: e.getAttribute("aria-multiline"),
    })),
  );
  ok("éditeurs CodeMirror nommés role=textbox multiline", cm.length > 0 && cm.every((c) => c.role === "textbox" && c.label && c.multi === "true"), JSON.stringify(cm));

  await goto("/admin/config-notify/");
  const dup = await page.evaluate(() => {
    const all = [...document.querySelectorAll("[id*=goLiveMessage]")].map((e) => e.id);
    return all.length - new Set(all).size;
  });
  ok("field-goLiveMessage sans doublon aria", dup === 0, `${dup} doublon(s)`);

  // Tabs plugins : les actions hors du tablist
  await goto("/admin/plugins/");
  const tabs = await page.evaluate(() => {
    const tl = document.querySelector('[role="tablist"]');
    const extra = tl
      ? [...tl.children].filter(
          (c) =>
            c.getAttribute("role") !== "tab" &&
            !c.querySelector('[role="tab"]') &&
            !c.classList.contains("ant-tabs-ink-bar") &&
            !c.classList.contains("ant-tabs-nav-operations"),
        ).length
      : -1;
    return { extra };
  });
  ok("tablist sans enfant non-tab (actions déplacées)", tabs.extra === 0, `${tabs.extra} enfant(s) hors rôle`);
}

await browser.close();
console.log(`\n${failures} échec(s)`);
process.exit(failures ? 1 : 0);
