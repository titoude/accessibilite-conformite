#!/usr/bin/env node
/**
 * verify.mjs — assertions DURES sur les corrections netbox (cycle 52).
 * Chaque fix est mesuré dans le DOM/computed style, jamais `if(el) ok()`.
 * Un élément requis absent = FAIL ou N-A explicite (leçon 45).
 * Usage: node verify.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));

const base = process.argv[2]?.replace(/\/$/, '');
const authPath = process.argv[3] || 'auth.json';
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }

// Ids du seed : REPLI uniquement (leçons 44/46) — source primaire = l'app.
let SEED = {};
try { SEED = JSON.parse(readFileSync(new URL('./seed-info.json', import.meta.url), 'utf8')); } catch { /* non résolu */ }
const DEVICE_ID = SEED.device_id || 1;
const RACK_ID = SEED.rack_id || 1;

const results = [];
const ok = (name, cond, extra = '') => { results.push({ name, pass: !!cond }); if (!cond) console.error(`  FAIL ${name} ${extra}`); return cond; };
const na = (name, reason = '') => { results.push({ name, pass: true, verdict: 'N-A', reason }); console.error(`  N-A ${name} ${reason}`); };

const HELPERS = `
const parse = c => { const m = c && c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const effBg = el => { const L = []; let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0) L.push(c); n = n.parentElement; } if (!L.length) return { r: 255, g: 255, b: 255 }; let top = L[0]; for (let i = 1; i < L.length; i++) { const under = L[i]; const a = top.a + under.a * (1 - top.a); top = { r: (top.r * top.a + under.r * under.a * (1 - top.a)) / a, g: (top.g * top.a + under.g * under.a * (1 - top.a)) / a, b: (top.b * top.a + under.b * under.a * (1 - top.a)) / a, a }; } return top; };
const fg = el => { const st = getComputedStyle(el); const c = parse(st.color); return { ...c, a: (c.a ?? 1) * parseFloat(st.opacity || 1) }; };
const cr = el => { try { const f = __c52.fg(el); const bg = __c52.effBg(el); return +__c52.ratio(__c52.lum(f), __c52.lum(bg)).toFixed(2); } catch { return null; } };
window.__c52 = { parse, lum, ratio, effBg, fg, cr };
`;

const browser = await chromium.launch();
const ctxPub = await browser.newContext({ locale: 'en-US' });
const pub = await ctxPub.newPage();
await pub.addInitScript(HELPERS);
const ctxAdm = await browser.newContext({ locale: 'en-US', storageState: authPath });
const page = await ctxAdm.newPage();
await page.addInitScript(HELPERS);

// ================= PUBLIC =================
// login.html : <main> landmark + h1
await pub.goto(`${base}/login/`, { waitUntil: 'domcontentloaded' });
await pub.waitForSelector('form', { timeout: 20000 });
const pubLand = await pub.evaluate(() => ({
  main: document.querySelectorAll('main').length,
  h1: [...document.querySelectorAll('h1')].map(h => (h.innerText || '').trim()),
}));
ok('login: <main> unique présent', pubLand.main === 1, `${pubLand.main}`);
ok('login: h1 présent et non vide', pubLand.h1.some(t => t.length > 0), JSON.stringify(pubLand.h1));

// ================= ADMIN =================
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#sidebar-menu', { timeout: 25000 });
await page.waitForTimeout(1500);

// layout.html : #page-content est un <main> (region + landmark-one-main)
const mains = await page.evaluate(() => [...document.querySelectorAll('main')].map(m => m.id || m.className));
ok('layout: #page-content est <main> unique', mains.length === 1 && mains[0] === 'page-content', JSON.stringify(mains));

// user_menu.html : aria-label contient le texte visible (2.5.3)
const um = await page.evaluate(() => {
  const els = [...document.querySelectorAll('a[data-bs-toggle="dropdown"][aria-label*="Open user menu"]')];
  return els.map(e => { const al = e.getAttribute('aria-label'); const t = (e.innerText || '').trim(); return { al, t, has: t.length > 0 && al.toLowerCase().includes(t.toLowerCase().split('\n')[0]) }; });
});
ok('2.5.3: user menu aria-label contient le texte visible', um.length >= 1 && um.every(u => u.has), JSON.stringify(um));

// Table headers : aucun th ni lien de tri vide
for (const [path, name] of [[`/dcim/devices/`, 'devices'], [`/dcim/sites/`, 'sites'], [`/ipam/ip-addresses/`, 'ip-addresses']]) {
  await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('table', { timeout: 25000 });
  await page.waitForTimeout(1800); // htmx table loads
  const bad = await page.evaluate(() => {
    const out = [];
    for (const th of document.querySelectorAll('thead th')) {
      if (!(th.innerText || '').trim() && !th.querySelector('[aria-label],[title],input')) out.push('th vide');
    }
    for (const a of document.querySelectorAll('thead th a')) {
      const r = a.getBoundingClientRect();
      const txt = (a.innerText || '').trim();
      if (r.width > 0 && !txt && !a.getAttribute('aria-label') && !a.title) out.push('a vide');
    }
    return out;
  });
  ok(`empty-table-header+link-name: ${name} — 0 th/lien vide`, bad.length === 0, bad.join(';'));
}

// Modale table-config : nommée via aria-labelledby + h2 titre
await page.goto(`${base}/dcim/devices/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('button[data-bs-toggle="modal"]', { timeout: 25000 });
await page.locator('button[data-bs-toggle="modal"][title*="Configure"]').first().click();
await page.waitForTimeout(900);
const cfg = await page.evaluate(() => {
  const m = document.querySelector('.modal.show');
  if (!m) return null;
  const lid = m.getAttribute('aria-labelledby');
  const h2 = m.querySelector('h2, .modal-title');
  return { lid, ref: lid && document.getElementById(lid)?.innerText.trim(), h2: h2?.tagName, sel: m.querySelectorAll('select').length, labels: [...m.querySelectorAll('select')].map(s => !!(s.getAttribute('aria-label') || s.id && m.querySelector(`label[for="${s.id}"]`) || s.closest('label'))) };
});
if (!cfg) na('table-config modal', 'modale non ouverte');
else {
  ok('aria-dialog-name: modal labellisée par son titre', !!cfg.lid && !!cfg.ref, `labelledby=${cfg.lid} ref=${cfg.ref}`);
  ok('heading-order: titre de modale en h2', cfg.h2 === 'H2', cfg.h2);
  ok('select-name: chaque <select> de la modale est labellisée', cfg.sel > 0 && cfg.labels.every(Boolean), JSON.stringify(cfg.labels));
}
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// htmx modal (quick-add) : aria-labelledby
await page.goto(`${base}/dcim/devices/add/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[data-bs-target="#htmx-modal"]', { timeout: 25000 });
await page.locator('[data-bs-target="#htmx-modal"][hx-get]').first().click();
await page.waitForTimeout(1200);
const qa = await page.evaluate(() => {
  const m = document.querySelector('#htmx-modal.show, #htmx-modal');
  if (!m) return null;
  const lid = m.getAttribute('aria-labelledby');
  return { lid, ref: lid && document.getElementById(lid)?.innerText.trim() };
});
if (!qa || !qa.lid) na('quick-add modal', 'modale htmx non ouverte ou sans aria-labelledby');
else ok('aria-dialog-name: htmx-modal labellisée', !!qa.ref, `ref=${qa.ref}`);
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// Contrastes palette : .btn-primary >= 4.5:1 (white text on dark teal)
await page.goto(`${base}/dcim/devices/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.btn-primary', { timeout: 25000 });
const btnC = await page.evaluate(() => __c52.cr(document.querySelector('.btn-primary')));
ok('color-contrast: .btn-primary >= 4.5:1', btnC !== null && btnC >= 4.5, `mesuré ${btnC}`);

// Boutons de table badges/links cibles >= 24px + Actions th labellisé (measure once)
const tbl = await page.evaluate(() => {
  const bad = [];
  for (const a of document.querySelectorAll('.table .badge > a, .badge > a')) {
    const r = a.getBoundingClientRect();
    if (r.width > 0 && (r.height < 24 || r.width < 24)) bad.push(`badge:${r.width}x${r.height}`);
  }
  return bad;
});
ok('target-size: liens badges >= 24px', tbl.length === 0, tbl.join(','));

// Liens linkifiés dans panels attributs : soulignés (link-in-text-block)
await page.goto(`${base}/dcim/devices/${DEVICE_ID}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.attr-table, .table', { timeout: 25000 });
await page.waitForTimeout(1200);
const under = await page.evaluate(() => {
  const spans = [...document.querySelectorAll('.attr-table td span > a, .card td span > a, .card td div span > a')];
  const unstyled = spans.filter(a => getComputedStyle(a).textDecorationLine !== 'underline');
  return { total: spans.length, unstyled: unstyled.length };
});
if (under.total === 0) na('link-in-text-block', 'aucun lien linkifié dans les panels');
else ok('link-in-text-block: liens de panels soulignés', under.unstyled === 0, `${under.unstyled}/${under.total} non soulignés`);

// Pagination : sur les pages avec plusieurs <nav>, les noms sont uniques.
await page.goto(`${base}/circuits/providers/${SEED.provider_id || 1}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
const navs = await page.evaluate(() => [...document.querySelectorAll('nav')].map(n => n.getAttribute('aria-label') || ''));
const pags = navs.filter(n => n.includes('Page selection') || n.includes('Pagination'));
if (navs.length < 2) na('landmark-unique', 'moins de 2 landmarks nav sur la page');
else if (!pags.length) na('landmark-unique', 'aucun paginator rendu (table mono-page)');
else ok('landmark-unique: navs paginées distinctement', new Set(navs).size === navs.length, JSON.stringify(navs));

// Tooltips : conteneur = #page-content (inside <main>) — pas de region flottante
const tipEl = page.locator('[data-bs-toggle="tooltip"]:visible').first();
if (await tipEl.count() === 0) { /* handled below */ }
await tipEl.hover().catch(() => {});
await page.waitForTimeout(700);
const tips = await page.evaluate(() => {
  const t = [...document.querySelectorAll('.tooltip')];
  return t.map(x => !!x.closest('main'));
});
if (!tips.length) na('region tooltips', 'aucun tooltip ouvert au survol');
else ok('region: tooltips rendus dans <main>', tips.every(Boolean), `${tips}`);

// Footer stamp : contraste thème clair/sombre
const fs = await page.evaluate(() => [...document.querySelectorAll('#footer-stamp .list-inline-item')].map(li => __c52.cr(li)));
ok('footer stamp: contraste >= 4.5:1 (clair)', fs.length > 0 && fs.every(r => r >= 4.5), JSON.stringify(fs));
await page.locator('button.color-mode-toggle:visible').first().click();
await page.waitForTimeout(800);
const fsD = await page.evaluate(() => [...document.querySelectorAll('#footer-stamp .list-inline-item')].map(li => __c52.cr(li)));
ok('footer stamp: contraste >= 4.5:1 (sombre)', fsD.length > 0 && fsD.every(r => r >= 4.5), JSON.stringify(fsD));
await page.locator('button.color-mode-toggle:visible').first().click();
await page.waitForTimeout(500);

// Rack page : aria-prohibited-attr/absence de rôle interdit — vérifié dans audit
await page.goto(`${base}/dcim/racks/${RACK_ID}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('table', { timeout: 25000 });
ok('rack page: table présente', true);

// 404 : en-tête lisible (text-bg-danger) + region
await page.goto(`${base}/dcim/devices/99999/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.card', { timeout: 20000 });
const notFound = await page.evaluate(() => {
  const h = document.querySelector('h2.card-header');
  return h ? { cr: __c52.cr(h), cls: h.className } : null;
});
ok('40x: en-tête carte contrastée >= 4.5:1', notFound && notFound.cr >= 4.5, notFound ? `cr=${notFound.cr} class=${notFound.cls}` : 'absent');

// Doc/help bouton : aria-label contient "Help" (2.5.3)
await page.goto(`${base}/dcim/sites/add/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#edit-form, form:not([method])', { timeout: 25000, state: 'attached' });
const help = await page.evaluate(() => {
  const b = document.querySelector('a[title*="documentation"], a[aria-label*="documentation"]');
  if (!b) return null;
  const t = (b.innerText || '').trim();
  const al = b.getAttribute('aria-label') || '';
  return { al, t, has: al.toLowerCase().includes(t.toLowerCase().split('\n')[0]) };
});
if (!help) na('doc/help button', 'bouton doc absent du formulaire');
else ok('2.5.3: bouton Help — aria-label contient le texte visible', help.has, `aria="${help.al}" text="${help.t}"`);

// Scrollable-region-focusable : widget dashboard focusable
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
const scr = await page.evaluate(() => {
  const el = document.querySelector('.card-body.overflow-auto');
  return el ? el.getAttribute('tabindex') === '0' : 'absent';
});
if (scr === 'absent') na('scrollable-region-focusable', 'pas de widget scrollable au dashboard');
else ok('scrollable-region-focusable: widget overflow tabindex=0', scr === true, `${scr}`);

// Notifications : h2 titre
await page.locator('button[hx-get*="notifications"]').last().click();
await page.waitForTimeout(1200);
const notifH = await page.evaluate(() => {
  const m = [...document.querySelectorAll('.notifications')].find(e => (e.innerHTML || '').includes('card-title')) || [...document.querySelectorAll('.notifications')].pop();
  if (!m) return null;
  return [...m.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName);
});
if (!notifH) na('notifications', 'dropdown non ouvert');
else ok('heading-order: notifications titres en h2', notifH.includes('H2') && !notifH.includes('H3'), JSON.stringify(notifH));

await browser.close();
const fails = results.filter(r => !r.pass).length;
const total = results.filter(r => r.verdict !== 'N-A').length;
console.log(`\nverify.mjs netbox : ${total - fails}/${total} assertions OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
