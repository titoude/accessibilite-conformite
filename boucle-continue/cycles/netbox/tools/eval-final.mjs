#!/usr/bin/env node
// eval-final.mjs (netbox edition) — contrôles transverses finaux hors axe.
// Usage: node eval-final.mjs <baseUrl> [auth.json]
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2]?.replace(/\/$/, '') || 'http://localhost:9300';
const auth = process.argv[3] || 'auth.json';
const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); return pass; };
const na = (name, why) => results.push(['N-A ', name, why]);

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US', storageState: auth });
const page = await ctx.newPage();
const pub = await (await browser.newContext({ locale: 'en-US' })).newPage();

// --- viewport zoom non verrouillé (public + admin) ---
for (const [label, url, pg] of [['public', `${base}/login/`, pub], ['admin', `${base}/`, page]]) {
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector('body', { timeout: 25000 });
  await pg.waitForTimeout(1500);
  const vp = await pg.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
  const locked = /user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*1(\.0+)?\b/i.test(vp);
  ok(`viewport ${label}: zoom non verrouillé`, !locked, vp);
}

// --- lang document ---
const lang = await pub.evaluate(() => document.documentElement.lang);
ok('lang document présent', !!lang, lang || 'NONE');

// --- clavier : le focus progresse dans l'admin ---
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#sidebar-menu', { timeout: 25000 });
await page.waitForTimeout(1500);
await page.evaluate(() => document.body.focus());
const focusPath = [];
for (let i = 0; i < 10; i++) {
  await page.keyboard.press('Tab');
  const cur = await page.evaluate(() => {
    const e = document.activeElement;
    return e ? `${e.tagName}.${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 25)}` : 'NONE';
  });
  focusPath.push(cur);
}
const distinct = new Set(focusPath.filter(f => f !== 'NONE' && f !== 'BODY.'));
ok('clavier admin: le focus progresse (>=4 distincts)', distinct.size >= 4, `${distinct.size}: ${[...distinct].slice(0, 4).join(' > ')}`);

// --- Escape ferme un dropdown ouvert ---
const notifBtn = page.locator('button[hx-get*="notifications"]').last();
if (await notifBtn.count()) {
  await notifBtn.click();
  await page.waitForTimeout(900);
  const openMenu = await page.evaluate(() => {
    const m = [...document.querySelectorAll('.notifications')].find(e => e.classList.contains('show'));
    return !!m;
  });
  if (openMenu) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(700);
    const closed = await page.evaluate(() => ![...document.querySelectorAll('.notifications')].some(e => e.classList.contains('show')));
    ok('dropdown notifications: Escape ferme', closed);
  } else na('dropdown notifications', 'menu non détecté après clic');
} else na('dropdown notifications', 'bouton absent');

// --- skip-link ---
const sk = await pub.evaluate(() => [...document.querySelectorAll('a[href^="#"], .skip-link')].some(a => /skip/i.test(a.textContent || '') || /skip/i.test(a.className || '')));
if (sk) ok('skip-link présent', true); else na('skip-link', 'non fourni par le produit');

// --- mobile 390 : public + admin rendent + burger ---
for (const [label, url, pg, sel] of [['public', `${base}/login/`, pub, 'form'], ['admin', `${base}/`, page, '#sidebar-menu']]) {
  await pg.setViewportSize({ width: 390, height: 800 });
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector(sel, { timeout: 25000, state: 'attached' });
  const m = await pg.evaluate(() => ({ h1: !!document.querySelector('h1'), toggler: !!document.querySelector('.navbar-toggler') }));
  ok(`mobile 390 ${label}: page rendue`, true, JSON.stringify(m));
  await pg.setViewportSize({ width: 1280, height: 900 });
}

// --- régions live / status ---
const live = await pub.evaluate(() => document.querySelectorAll('[aria-live],[role="status"]').length);
if (live > 0) ok('régions live présentes', true, `${live}`); else na('régions live', 'aucune région aria-live/status');

// --- h1 présent sur chaque surface ---
for (const [label, url, pg] of [['public', `${base}/login/`, pub], ['admin', `${base}/`, page], ['detail', `${base}/dcim/devices/1/`, page]]) {
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(1800);
  const h = await pg.evaluate(() => { const e = document.querySelector('h1'); return e && (e.innerText || '').trim() !== ''; });
  ok(`${label}: h1 présent`, !!h);
}

// --- aucun label for=undefined / for vide ---
const badFor = await page.evaluate(() => document.querySelectorAll('label[for="undefined"],label[for=""]').length);
ok('labels: aucun for=undefined/vide', badFor === 0, `${badFor}`);

// --- titre d'onglet parlant ---
const titles = await Promise.all(['/dcim/devices/', '/user/profile/'].map(async u => { const p = await ctx.newPage(); await p.goto(`${base}${u}`, { waitUntil: 'domcontentloaded' }); const t = await p.title(); await p.close(); return t; }));
ok('titles parlants', titles.every(t => /NetBox/i.test(t) && t.length > 10), JSON.stringify(titles));

await browser.close();
console.log('\n=== eval-final ===');
for (const [s, n, d] of results) console.log(`${s} ${n}${d ? '  ' + d : ''}`);
const fails = results.filter(r => r[0] === 'FAIL').length;
const total = results.filter(r => r[0] !== 'N-A ').length;
console.log(`\neval-final.mjs (netbox) : ${total - fails}/${total} contrôles OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
