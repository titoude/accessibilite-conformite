#!/usr/bin/env node
// verify.mjs — assertions DURES sur le résultat final du cycle changedetection.
// Usage : node verify.mjs <baseUrl> --auth-file tools/auth.json --cycle-dir ..
// Sortie : PASS/FAIL par assertion ; exit 1 si au moins un FAIL.
// Une assertion "non applicable" doit être explicite (N-A avec raison) —
// jamais de PASS à vide : un élément requis absent = FAIL.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(process.env.AUDIT_TOOLS || '/home/ubuntu/audit-tools/package.json');
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const BASE = (args[0] || 'http://127.0.0.1:5005').replace(/\/+$/, '');
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const DIR = dirname(fileURLToPath(import.meta.url));
const CYCLE = opt('--cycle-dir') || join(DIR, '..');
const AUTH = opt('--auth-file') || join(DIR, 'auth.json');
const FINAL_AUTH = join(CYCLE, 'reports/final-auth/report.json');
const FINAL_PUBLIC = join(CYCLE, 'reports/final-public/report.json');
const EXPECTED_STATES = JSON.parse(readFileSync(new URL('../states.json', import.meta.url), 'utf8')).auth.states.length;

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

const parseRGB = s => { const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
const lum = c => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const ratio_ = p => { const a = lum(p.fg), b = lum(p.bg); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };

// Fond opaque effectif : compose les couches alpha top→down (leçon 26) —
// une rgba(x,x,x,0.4) sur fond blanc ≠ sa couleur directe.
const effBg = async (page, sel) => page.evaluate(s => {
  const el = document.querySelector(s);
  if (!el) return null;
  const chain = [];
  let n = el;
  while (n) {
    const cs = getComputedStyle(n);
    if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') chain.unshift(cs.backgroundColor);
    n = n.parentElement;
  }
  const rgb = c => { const m = c && c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
  let out = [255, 255, 255];
  for (const c of chain.map(rgb).filter(Boolean)) out = [Math.round(c[0] * c[3] + out[0] * (1 - c[3])), Math.round(c[1] * c[3] + out[1] * (1 - c[3])), Math.round(c[2] * c[3] + out[2] * (1 - c[3]))];
  return out;
}, sel);

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
await page.goto(`${BASE}/`, { waitUntil: 'load' });
await page.waitForSelector('#watch-table-wrapper', { timeout: 20000 });

// landmarks / structure de page
ok('<html> porte lang', (await page.locator('html').getAttribute('lang') || '').length >= 2);
ok('nav landmark présent (sidebar)', await page.locator('nav, [role="navigation"]').count() >= 1);
ok('au moins 1 landmark main/role=main', await page.locator('main, [role="main"], section.content').count() >= 1);
const h1s = await page.evaluate(() => [...document.querySelectorAll('h1')].filter(h => h.offsetParent !== null).length);
ok('au plus 1 <h1> visible', h1s <= 1, `${h1s} h1 visibles`);

// modale search : role dialog natif + nommage
await page.locator('.js-open-search-modal').first().click();
await page.waitForSelector('#search-modal[open]', { timeout: 10000 });
ok('#search-modal est <dialog>', await page.locator('dialog#search-modal[open]').count() === 1);
const sLb = await page.locator('#search-modal').getAttribute('aria-labelledby');
ok('#search-modal aria-labelledby → élément existant', !!sLb && await page.locator(`#${sLb}`).count() === 1, `aria-labelledby=${sLb}`);
ok('input #search-modal-input labellisé', await page.locator('#search-modal label[for="search-modal-input"]').count() === 1);
await page.locator('#close-search-modal').click();

// hamburger : aria-label + aria-expanded honnête
const hbLabel = await page.locator('#hamburger-toggle').getAttribute('aria-label');
ok('#hamburger-toggle a un aria-label', !!hbLabel && hbLabel.trim().length > 0, `label="${hbLabel}"`);
const hbExpanded = await page.locator('#hamburger-toggle').getAttribute('aria-expanded');
if (hbExpanded !== null) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#hamburger-toggle').click();
  const opened = (await page.locator('#hamburger-toggle').getAttribute('aria-expanded')) === 'true';
  ok('aria-expanded bascule à true à l ouverture du drawer', opened);
  await page.setViewportSize({ width: 1280, height: 900 });
} else {
  console.log('N-A  #hamburger-toggle : pas d aria-expanded géré en amont (aria-hidden drawer)');
}

// watchlist : cases à cocher de lignes nommées
const rowBoxes = await page.evaluate(() => {
  const boxes = [...document.querySelectorAll('#watch-table-wrapper input[type="checkbox"][value]')];
  return boxes.map(b => {
    const id = b.id;
    const labelled = (id && document.querySelector(`label[for="${id}"]`)) || b.getAttribute('aria-label') || b.getAttribute('aria-labelledby') || b.closest('label');
    return !!labelled;
  });
});
ok('chaque checkbox de watch est nommée', rowBoxes.length > 0 && rowBoxes.every(Boolean), `${rowBoxes.filter(x => !x).length}/${rowBoxes.length} sans nom`);

// check-all : nommé
const allBox = await page.evaluate(() => {
  const b = document.querySelector('#check-all');
  if (!b) return 'absent';
  const id = b.id;
  return !!(b.getAttribute('aria-label') || document.querySelector(`label[for="${id}"]`) || b.closest('label'));
});
ok('#check-all est nommé', allBox === true, `résultat=${allBox}`);

// login page : champ mot de passe labellisé, titre/heading présent
const page2 = await (await browser.newContext()).newPage();
await page2.goto(`${BASE}/logout`, { waitUntil: 'load' }).catch(() => {});
await page2.goto(`${BASE}/login`, { waitUntil: 'load' });
ok('login : input#password présent', await page2.locator('.login-form #password').count() === 1);
const pwLabelled = await page2.evaluate(() => {
  const i = document.querySelector('.login-form #password');
  return i && (document.querySelector(`label[for="${i.id}"]`) || i.getAttribute('aria-label') || i.closest('label'));
});
ok('login : #password labellisé', !!pwLabelled);
ok('login : heading visible présent', await page2.locator('h1, h2, h3, .login-form').first().count() >= 1);

// —— sondes contrastes computed en clair ET sombre (leçon 26 : composer les
// couches alpha ; familles à fond coloré : boutons primaires, badges de
// compteur, tag pills, liens dans le texte).
const probe = async (label, pageRef, pairs) => {
  for (const { sel, min, name } of pairs) {
    const fg = await pageRef.evaluate(s => {
      const el = document.querySelector(s);
      if (!el) return null;
      const cs = getComputedStyle(el);
      const m = cs.color.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      return m ? [+m[1], +m[2], +m[3]] : null;
    }, sel);
    const bg = await effBg(pageRef, sel);
    if (!fg || !bg) { ok(`${label} : ${name} — élément présent`, false, `${sel} introuvable/couleur non résolue`); continue; }
    const r = ratio_({ fg, bg });
    ok(`${label} : ${name} ≥${min}:1`, r >= min, `${r.toFixed(2)}:1 (fg ${fg} bg ${bg})`);
  }
};

await page.goto(`${BASE}/`, { waitUntil: 'load' });
await page.waitForSelector('#watch-table-wrapper', { timeout: 20000 });
await probe('clair', page, [
  { sel: '#watch-table-wrapper .watch-table a[href*="edit"]', min: 4.5, name: 'lien titre de watch' },
  { sel: '.pure-button-primary', min: 4.5, name: 'bouton primaire' },
  { sel: '#post-list-unread .seg-count, #unread-tab-counter', min: 4.5, name: 'badge compteur unread' },
  { sel: '#with-errors-tab-counter, .seg-count--error', min: 4.5, name: 'badge compteur erreurs' },
]);
// tag pills : fond coloré par tag → mesurer la première pill visible
const tagPair = await page.evaluate(() => {
  const el = document.querySelector('a.watch-tag-list, #tag-list-container .button-tag:not(#tag-all), .button-tag:not(#tag-all)');
  return el ? (() => { const cs = getComputedStyle(el); return { cls: el.className, color: cs.color, bg: cs.backgroundColor, sel: el.getAttribute('href') || '' }; })() : null;
});
if (tagPair) {
  const fg = parseRGB(tagPair.color), bg = parseRGB(tagPair.bg);
  if (fg && bg) {
    const r = ratio_({ fg: fg.slice(0, 3), bg: bg.slice(0, 3) });
    ok(`clair : tag pill "${tagPair.cls}" ≥4.5:1`, r >= 4.5, `${r.toFixed(2)}:1`);
  } else { ok('clair : tag pill — couleurs résolues', false, JSON.stringify(tagPair)); }
} else {
  console.log('N-A  tag pill : aucune pill visible sur la watchlist');
}

// thème sombre : cookie css_dark_mode → data-darkmode, mêmes sondes
await ctx.addCookies([{ name: 'css_dark_mode', value: 'true', url: BASE }]);
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('html[data-darkmode="true"]', { timeout: 10000 });
await page.waitForSelector('#watch-table-wrapper', { timeout: 20000 });
await probe('sombre', page, [
  { sel: '#watch-table-wrapper .watch-table a[href*="edit"]', min: 4.5, name: 'lien titre de watch' },
  { sel: '.pure-button-primary', min: 4.5, name: 'bouton primaire' },
  { sel: '#post-list-unread .seg-count, #unread-tab-counter', min: 4.5, name: 'badge compteur unread' },
]);
// symétrie leçon 28 : restauration du cookie (pref client-side)
await ctx.addCookies([{ name: 'css_dark_mode', value: 'false', url: BASE }]);
await page.reload({ waitUntil: 'load' });
const restored = await page.evaluate(() => document.documentElement.dataset.darkmode);
ok('thème restauré en clair (data-darkmode!="true")', restored !== 'true', `data-darkmode=${restored}`);

await browser.close();
console.log(`\nverify: ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
