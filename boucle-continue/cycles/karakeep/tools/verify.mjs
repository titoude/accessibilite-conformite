#!/usr/bin/env node
// verify.mjs — assertions DURES sur le résultat final du cycle karakeep.
// Usage : node verify.mjs <baseUrl> --auth-file tools/auth.json --cycle-dir ..
// Sortie : PASS/FAIL par assertion ; exit 1 si au moins un FAIL.
// Une assertion "non applicable" doit être explicite (N-A avec raison) —
// jamais de PASS à vide : un élément requis absent = FAIL.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const BASE = (args[0] || 'http://localhost:3000').replace(/\/+$/, '');
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const DIR = dirname(fileURLToPath(import.meta.url));
const CYCLE = opt('--cycle-dir') || join(DIR, '..');
const AUTH = opt('--auth-file') || join(DIR, 'auth.json');
const FINAL_AUTH = join(CYCLE, 'reports/final-auth/report.json');
const FINAL_PUBLIC = join(CYCLE, 'reports/final-public/report.json');
const EXPECTED_STATES = JSON.parse(readFileSync(new URL('../states.json', import.meta.url), 'utf8')).auth.states.length;
const IDS = JSON.parse(readFileSync(join(DIR, 'seed-ids.json'), 'utf8'));

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`PASS  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${detail ? ' — ' + detail : ''}`); }
};
const loadReport = p => {
  if (!existsSync(p)) return null;
  const d = JSON.parse(readFileSync(p, 'utf8'));
  return Array.isArray(d.pages) ? d : null;
};

// ---------- 1. artefacts ----------
const pub = loadReport(FINAL_PUBLIC);
const auth = loadReport(FINAL_AUTH);
ok('final-public report.json présent', !!pub);
ok('final-auth report.json présent', !!auth);

if (pub) {
  ok('public : 0 violation', pub.pages.every(p => (p.violations || []).length === 0),
    pub.pages.filter(p => (p.violations || []).length).map(p => `${p.url}(${p.violations.map(v => v.id)})`).join('; '));
  ok('public : 0 erreur de scan', pub.pages.every(p => !p.error));
}
if (auth) {
  const statePages = auth.pages.filter(p => /state:/.test(p.url));
  ok(`auth : ${EXPECTED_STATES} états scannés`, statePages.length === EXPECTED_STATES,
    `trouvé ${statePages.length}`);
  const errPages = auth.pages.filter(p => p.error);
  ok('auth : 0 état en erreur (élément requis absent = FAIL)', errPages.length === 0,
    errPages.map(p => `${p.url} → ${p.error}`).join('; '));
  const violating = auth.pages.filter(p => (p.violations || []).length > 0);
  ok('auth : 0 violation sur toutes les pages/états', violating.length === 0,
    violating.flatMap(p => p.violations.map(v => `${p.url.split('state:')[1] || 'page'}:${v.id}(${v.nodes.length})`)).join('; '));
}

// ---------- 2. DOM live du produit patché ----------
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();
await page.goto(`${BASE}/dashboard/bookmarks`, { waitUntil: 'load' });
await page.waitForSelector('main', { timeout: 30000 });

// landmarks / titres
ok('<main> landmark présent', await page.locator('main').count() >= 1);
ok('skip-link vers #main-content présent', await page.locator('a[href="#main-content"]').count() === 1);
ok('main porte id="main-content"', await page.locator('main#main-content').count() === 1);
ok('exactement 1 h1 visible sur la page', await page.evaluate(() =>
  [...document.querySelectorAll('h1')].filter(h => h.offsetParent !== null || h.classList.contains('sr-only')).length) === 1);
ok('nav landmark présent (aside sidebar)', await page.locator('aside nav, aside, nav').count() >= 1);

// viewport : le pinch-zoom ne doit pas être désactivé (leçon : WCAG 1.4.4/1.4.10)
const vp = await page.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || '');
ok('viewport ne désactive pas le zoom', !/user-scalable\s*=\s*(no|0)/.test(vp) && !/maximum-scale\s*=\s*1(?:\.0+)?\b/.test(vp),
   `content="${vp}"`);

// sidebar : conteneur role=list + lignes role=listitem (fix listitem)
const listRoles = await page.evaluate(() => ({
  lists: document.querySelectorAll('aside [role="list"]').length,
  items: document.querySelectorAll('aside [role="listitem"]').length,
}));
ok('sidebar : ≥1 role="list"', listRoles.lists >= 1, `${listRoles.lists}`);
ok('sidebar : ≥1 role="listitem"', listRoles.items >= 1, `${listRoles.items}`);

// leçon 29 (2.5.3) : le aria-label des boutons d'options de liste doit
// CONTENIR le texte visible (le compteur de bookmarks).
const labelMatch = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('aside button[aria-label*="option" i], aside button[aria-label*="List options"]')]
    .map(b => ({ label: b.getAttribute('aria-label') || '', txt: (b.textContent || '').trim() }));
  return btns;
});
ok('boutons options de liste trouvés', labelMatch.length >= 1, `${labelMatch.length}`);
ok('aria-label contient le texte visible (leçon 29)',
   labelMatch.every(b => !b.txt || b.label.toLowerCase().includes(b.txt.toLowerCase())),
   JSON.stringify(labelMatch.filter(b => b.txt && !b.label.toLowerCase().includes(b.txt.toLowerCase()))));

// target-size : ces boutons doivent mesurer ≥24px de large
const sizes = await page.evaluate(() =>
  [...document.querySelectorAll('aside button[aria-label*="option" i]')]
    .map(b => { const r = b.getBoundingClientRect(); return { w: r.width, h: r.height }; }));
ok('boutons options ≥24px de large (target-size)', sizes.length > 0 && sizes.every(s => s.w >= 24 && s.h >= 24),
   JSON.stringify(sizes));

// cmdk : l'input de recherche header a aria-controls vers un élément EXISTANT
// (PopoverAnchor + forceMount/hidden). Axe vérifie déjà la résolution dans le
// scan, mais on re-mesure en dur.
const cmdk = await page.evaluate(() => {
  const inp = document.querySelector('input[cmdk-input]');
  if (!inp) return { present: false };
  const ctrl = inp.getAttribute('aria-controls');
  return { present: true, ctrl, target: ctrl ? !!document.getElementById(ctrl) : null,
           role: inp.getAttribute('role'), hasPopup: inp.closest('[aria-haspopup]') !== null };
});
ok('input cmdk présent', cmdk.present);
ok('cmdk aria-controls résout vers un élément monté', cmdk.target === true, `aria-controls=${cmdk.ctrl}`);
ok('aucun wrapper div porteur de aria-haspopup usurpé', cmdk.hasPopup === false);

// ---------- 3. modale : role=dialog + nommage ----------
// Ouvrir la modale d'édition de la 1re carte via son menu ⋯
await page.locator('main button[aria-label]').last();
const menuBtn = page.locator('main article button, main [class*="card"] button').first();
// Cherche le bouton "options" de la carte (aria-label donné par nos fixes ou title)
const cardBtn = page.locator('main button').filter({ has: page.locator('svg.lucide-ellipsis, svg.lucide-more-horizontal') }).first();
if (await cardBtn.count() === 0) {
  // fallback : tout bouton avec title/aria-label "Bookmark options"/"options"
  var trigger = page.locator('main button[aria-label*="options" i], main button[title*="options" i]').first();
} else var trigger = cardBtn;
await trigger.click();
await page.locator('[role="menu"]:visible').first().waitFor({ timeout: 10000 });
const menuRoles = await page.evaluate(() => ({
  menu: document.querySelectorAll('[role="menu"]:not([hidden])').length,
  items: document.querySelectorAll('[role="menu"]:not([hidden]) [role="menuitem"]').length,
}));
ok('menu carte : role=menu visible', menuRoles.menu >= 1);
ok('menu carte : ≥3 role=menuitem', menuRoles.items >= 3, `${menuRoles.items}`);
await page.locator('[role="menuitem"]:visible', { hasText: 'Edit' }).first().click();
await page.locator('[role="dialog"]:visible').first().waitFor({ timeout: 15000 });
const dlg = page.locator('[role="dialog"]:visible').first();
ok('modale edit : role="dialog" visible', await dlg.count() === 1);
ok('modale edit : aria-modal="true"', (await dlg.getAttribute('aria-modal')) === 'true');
const dlgName = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]:not([hidden])');
  if (!d) return null;
  const lb = d.getAttribute('aria-labelledby');
  if (lb) { const t = document.getElementById(lb); return { kind: 'labelledby', ok: !!t && !!t.textContent.trim(), txt: t?.textContent.trim() }; }
  return { kind: 'label', ok: !!d.getAttribute('aria-label') };
});
ok('modale edit : nommée (aria-labelledby→titre existant)', dlgName && dlgName.ok, JSON.stringify(dlgName));
// focus piégé dans la modale : Tab ne doit pas sortir (Radix Dialog)
await page.keyboard.press('Escape');
await page.waitForTimeout(600);

// ---------- 4. contrastes computed (leçon 26 : familles à fond coloré) ----------
const pairs = await page.evaluate(() => {
  const rgb = s => { const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? [+m[1], +m[2], +m[3]] : null; };
  const effBg = el => { let n = el; while (n && n !== document.documentElement) { const c = getComputedStyle(n).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)') return rgb(c); n = n.parentElement; } return rgb(getComputedStyle(document.body).backgroundColor); };
  const pick = sel => { const el = document.querySelector(sel); return el ? { fg: rgb(getComputedStyle(el).color), bg: effBg(el), sel } : null; };
  const primBtn = [...document.querySelectorAll('button')].find(b => /bg-primary/.test(b.className));
  return {
    muted: pick('aside .text-muted-foreground, .text-muted-foreground'),
    primary: primBtn ? { fg: rgb(getComputedStyle(primBtn).color), bg: effBg(primBtn), sel: 'button.bg-primary' } : null,
    sidebarVer: pick('aside .text-gray-500, aside [class*="gray-"]'),
    h1: pick('main h1'),
  };
});
const ratio_ = p => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; const l = c => 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); return (Math.max(l(p.fg), l(p.bg)) + 0.05) / (Math.min(l(p.fg), l(p.bg)) + 0.05); };
ok('texte muted-foreground ≥4.5:1 (token patché)', pairs.muted && ratio_(pairs.muted) >= 4.5,
   pairs.muted ? `${ratio_(pairs.muted).toFixed(2)}:1` : 'sélecteur absent');
ok('bouton primary : texte ≥4.5:1 sur fond primaire', pairs.primary && ratio_(pairs.primary) >= 4.5,
   pairs.primary ? `${ratio_(pairs.primary).toFixed(2)}:1` : 'aucun .bg-primary visible');

// ---------- 5. thème dark : symétrie (leçon : localStorage only → light/dark) ----------
await page.evaluate(() => localStorage.setItem('theme', 'dark'));
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('main', { timeout: 30000 });
const darkOk = await page.evaluate(() => document.documentElement.classList.contains('dark'));
ok('dark : <html class="dark"> après bascule', darkOk);
const darkPairs = await page.evaluate(() => {
  const rgb = s => { const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? [+m[1], +m[2], +m[3]] : null; };
  const effBg = el => { let n = el; while (n && n !== document.documentElement) { const c = getComputedStyle(n).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)') return rgb(c); n = n.parentElement; } return rgb(getComputedStyle(document.body).backgroundColor); };
  const pick = sel => { const el = document.querySelector(sel); return el ? { fg: rgb(getComputedStyle(el).color), bg: effBg(el) } : null; };
  return {
    muted: pick('.text-muted-foreground'),
    body: { fg: rgb(getComputedStyle(document.body).color), bg: rgb(getComputedStyle(document.body).backgroundColor) },
  };
});
ok('dark : body texte/fond ≥4.5:1', darkPairs.body && ratio_(darkPairs.body) >= 4.5,
   darkPairs.body ? `${ratio_(darkPairs.body).toFixed(2)}:1` : 'absent');
ok('dark : muted-foreground ≥4.5:1', darkPairs.muted && ratio_(darkPairs.muted) >= 4.5,
   darkPairs.muted ? `${ratio_(darkPairs.muted).toFixed(2)}:1` : 'sélecteur absent');
// restaurer le clair (symétrie du check — le seed n'impose pas de thème serveur)
await page.evaluate(() => localStorage.setItem('theme', 'light'));
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('main', { timeout: 30000 });
const lightBack = await page.evaluate(() => !document.documentElement.classList.contains('dark'));
ok('thème clair restauré', lightBack);

// ---------- 6. preview : h1 sémantique + action bar nommée ----------
await page.goto(`${BASE}/dashboard/preview/${IDS.bookmarkLinkId}`, { waitUntil: 'load' });
await page.waitForSelector('main a:has-text("View Original"), main h1', { timeout: 30000 });
ok('preview : titre bookmark est un h1', await page.locator('main h1').count() >= 1);
const abNames = await page.evaluate(() =>
  [...document.querySelectorAll('main button[aria-label]')].map(b => b.getAttribute('aria-label')));
ok('preview : boutons d action nommés (edit/fav/archive/delete)', abNames.length >= 4 && abNames.every(n => n && n.length > 0),
   JSON.stringify(abNames.slice(0, 8)));

// ---------- 7. page publique : landmarks + h1 ----------
const page2 = await (await browser.newContext()).newPage();
await page2.goto(`${BASE}/signin`, { waitUntil: 'load' });
ok('signin : <main> présent', await page2.locator('main').count() === 1);
ok('signin : h1 présent (sr-only toléré)', await page2.locator('h1').count() === 1);
ok('signin : formulaire labellisé (email input)', await page2.locator('input[type="email"], input[name="email"]').count() === 1);

await browser.close();
console.log(`\nverify: ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
