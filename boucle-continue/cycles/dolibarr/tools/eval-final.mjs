#!/usr/bin/env node
// eval-final.mjs (dolibarr edition, cycle 57) — contrôles transverses finaux hors axe.
// Usage: node eval-final.mjs <baseUrl> [auth.json]
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(HERE, 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2]?.replace(/\/$/, '') || 'http://localhost:9800';
const auth = process.argv[3] || resolve(HERE, 'auth.json');
const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); if (!pass) console.error(`  FAIL ${name} ${detail}`); return pass; };
const na = (name, why) => { results.push(['N-A ', name, why]); console.error(`  N-A ${name} ${why}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US', storageState: auth });
const page = await ctx.newPage();
const pub = await (await browser.newContext({ locale: 'en-US' })).newPage();

// --- viewport zoom non verrouillé (public login + auth) ---
for (const [label, url, pg] of [['public', `${base}/index.php`, pub], ['auth', `${base}/index.php`, page]]) {
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(1200);
  const vp = await pg.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
  const locked = /user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*1(\.0+)?\b/i.test(vp);
  ok(`viewport ${label}: zoom non verrouillé`, !locked, vp);
}

// --- lang document ---
const lang = await pub.evaluate(() => document.documentElement.lang);
ok('lang document présent', !!lang, lang || 'NONE');

// --- clavier : le focus progresse (auth index) ---
await page.goto(`${base}/index.php`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#id-right', { timeout: 30000 });
await page.waitForTimeout(1200);
await page.evaluate(() => document.body.focus());
const focusPath = [];
for (let i = 0; i < 12; i++) {
  await page.keyboard.press('Tab');
  const cur = await page.evaluate(() => {
    const e = document.activeElement;
    return e ? `${e.tagName}.${(e.getAttribute('aria-label') || e.textContent || e.id || '').trim().slice(0, 25)}` : 'NONE';
  });
  focusPath.push(cur);
}
const distinct = new Set(focusPath.filter(f => f !== 'NONE' && f !== 'BODY.'));
ok('clavier: le focus progresse (>=4 distincts)', distinct.size >= 4, `${distinct.size}: ${[...distinct].slice(0, 4).join(' > ')}`);

// --- Escape ferme le dropdown utilisateur ---
await page.goto(`${base}/index.php`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
const dd = page.locator('a.login-dropdown-a').first();
if (await dd.count()) {
  await dd.click();
  await page.waitForTimeout(600);
  const opened = await page.evaluate(() => { const m = document.querySelector('#topmenu-login-dropdown .dropdown-menu'); return m && getComputedStyle(m).display !== 'none'; });
  if (opened) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
    const closed = await page.evaluate(() => { const m = document.querySelector('#topmenu-login-dropdown .dropdown-menu'); return !m || getComputedStyle(m).display === 'none' || !m.offsetParent; });
    ok('dropdown utilisateur: Escape ferme', closed);
  } else na('dropdown utilisateur', 'menu non ouvert après clic');
} else na('dropdown utilisateur', 'a.login-dropdown-a absent');

// --- skip-link ---
const sk = await pub.evaluate(() => [...document.querySelectorAll('a[href^="#"], .skip-link, .skipnav')].some(a => /skip|aller au contenu/i.test((a.textContent || '') + (a.className || ''))));
if (sk) ok('skip-link présent', true); else na('skip-link', 'non fourni par le produit (non bloquant)');

// --- mobile 390 : public login + auth rendent ---
for (const [label, url, pg] of [['public', `${base}/index.php`, pub], ['auth', `${base}/index.php`, page]]) {
  await pg.setViewportSize({ width: 390, height: 844 });
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(1500);
  const m = await pg.evaluate(() => ({ body: (document.body.innerText || '').trim().length, container: !!document.querySelector('#id-container, .login_table, #login-submit-wrapper') }));
  ok(`mobile 390 ${label}: page rendue`, m.body > 20 && m.container, JSON.stringify(m));
  await pg.setViewportSize({ width: 1280, height: 900 });
}

// --- régions live / status ---
const live = await page.evaluate(() => document.querySelectorAll('[aria-live],[role="status"],[role="alert"],[role="img"][aria-label]').length);
if (live > 0) ok('régions live/status présentes', true, `${live}`); else na('régions live', 'aucune');

// --- h1 présent sur chaque surface auditée ---
for (const [label, url, pg] of [['public login', '/index.php', pub], ['auth home', '/index.php', page], ['fiche tiers', '/societe/card.php?socid=1', page], ['liste produits', '/product/list.php', page], ['admin company', '/admin/company.php', page]]) {
  await pg.goto(`${base}${url}`, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(1800);
  const h = await pg.evaluate(() => { const e = document.querySelector('#id-right h1, .login_table h1, h1'); return e && (e.innerText || '').trim() !== ''; });
  ok(`${label}: h1 présent`, !!h);
}

// --- aucun label for= sans cible ---
for (const [label, pg] of [['public', pub], ['auth', page]]) {
  const badFor = await pg.evaluate(() => [...document.querySelectorAll('label[for]')].filter(l => !document.getElementById(l.getAttribute('for'))).length);
  ok(`labels ${label}: aucun for sans cible`, badFor === 0, `${badFor}`);
}

// --- titres parlants ---
const titles = [];
for (const u of ['/societe/list.php', '/product/list.php']) {
  const p = await ctx.newPage();
  await p.goto(`${base}${u}`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1000);
  titles.push(await p.title());
  await p.close();
}
ok('titres parlants', titles.every(t => t.trim().length > 0), JSON.stringify(titles));

// --- select2 : aucun combobox sans nom après ouverture ---
await page.goto(`${base}/societe/card.php?action=create`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#id-right', { timeout: 30000 });
await page.waitForTimeout(1200);
await page.locator('.select2-container').first().click().catch(() => {});
await page.waitForTimeout(800);
const s2 = await page.evaluate(() => ({
  unnamedCombo: [...document.querySelectorAll('span[role="combobox"]')].filter(e => !e.getAttribute('aria-label') && !(e.getAttribute('aria-labelledby') && e.getAttribute('aria-labelledby').split(' ').some(id => (document.getElementById(id)?.textContent || '').trim()))).length,
  emptyListbox: [...document.querySelectorAll('ul.select2-results__options[role="listbox"]')].filter(u => !u.querySelector('[role="option"]')).length,
  alertLi: [...document.querySelectorAll('.select2-results__options li[role="alert"]')].length,
}));
ok('select2: aucun combobox sans nom', s2.unnamedCombo === 0, `${s2.unnamedCombo}`);
ok('select2: aucune listbox vide', s2.emptyListbox === 0, `${s2.emptyListbox}`);
ok('select2: aucun li role=alert (message résultat)', s2.alertLi === 0, `${s2.alertLi}`);

await browser.close();
const fails = results.filter(r => r[0] === 'FAIL').length;
console.error(`\n[eval] ${results.length - fails}/${results.length} OK, ${fails} FAIL`);
process.exit(fails ? 1 : 0);
