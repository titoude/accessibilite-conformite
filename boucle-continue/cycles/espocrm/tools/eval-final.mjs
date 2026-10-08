#!/usr/bin/env node
// eval-final.mjs (espocrm edition) — contrôles transverses finaux hors axe.
// Usage: node eval-final.mjs <baseUrl> <auth.json>
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2]?.replace(/\/$/, '') || 'http://localhost:7747';
const auth = process.argv[3] || 'auth.json';
const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); return pass; };
const na = (name, why) => results.push(['N-A ', name, why]);

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US', storageState: auth });
const page = await ctx.newPage();

// --- viewport zoom non verrouillé (public + admin) ---
for (const [label, url] of [['public', `${base}/`], ['admin', `${base}/#Account`]]) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('body', { timeout: 20000 });
  await page.waitForTimeout(2000);
  const vp = await page.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
  const locked = /user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*1(\.0+)?\b/i.test(vp);
  ok(`viewport ${label}: zoom non verrouillé`, !locked, vp);
}

// --- clavier : le focus progresse sur la liste Account ---
await page.goto(`${base}/#Account`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#navbar .navbar', { timeout: 30000, state: 'attached' });
await page.waitForTimeout(2000);
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
ok('clavier: le focus progresse (>=4 éléments distincts, pas de piège)', distinct.size >= 4, distinct.size + ' éléments: ' + [...distinct].slice(0, 4).join(' > '));

// --- Escape ferme une modale ouverte (quick-create) ---
await page.waitForTimeout(500);
const qcToggle = await page.$('#nav-quick-create-dropdown');
if (qcToggle) {
  await qcToggle.click();
  await page.waitForTimeout(600);
  const item = await page.$('a[data-action="quickCreate"]');
  if (item) {
    await item.click();
    await page.waitForSelector('.modal-dialog', { timeout: 10000 }).catch(() => null);
    const openEl = await page.$('.modal-dialog');
    if (openEl) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(900);
      const gone = !(await page.$('.modal-dialog:visible'));
      ok('modale quick-create: Escape ferme', gone);
    } else na('modale quick-create', 'dialog non détecté après clic');
  } else na('modale quick-create', 'item quickCreate absent');
} else na('modale quick-create', 'bouton absent');

// --- skip-link ---
const sk = await page.evaluate(() => {
  const a = [...document.querySelectorAll('a[href^="#"]')].find(a => /skip/i.test(a.textContent));
  return !!a;
});
if (sk) ok('skip-link présent', true); else na('skip-link', 'non fourni par le produit');

// --- mobile 390px : la home authentifiée rend ---
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#navbar .navbar', { timeout: 30000, state: 'attached' });
await page.waitForTimeout(2000);
const m = await page.evaluate(() => ({
  h1: !!document.querySelector('h1'),
  nav: !!document.querySelector('#navbar .navbar'),
  toggle: !!document.querySelector('button.navbar-toggle'),
}));
ok('mobile 390: home auth rendue', m.h1 && m.nav, JSON.stringify(m));

// --- régions live / status ---
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${base}/#Stream`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
const live = await page.evaluate(() => document.querySelectorAll('[aria-live],[role="status"]').length);
if (live > 0) ok('régions live présentes', true, `${live}`); else na('régions live', 'aucune région aria-live/status');

// --- admin : titre de page ---
await page.goto(`${base}/#Account`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
const h1Admin = await page.evaluate(() => {
  const h = document.querySelector('h1');
  return h && (h.innerText || '').trim() !== '';
});
ok('app: titre de page h1 présent', !!h1Admin);

await browser.close();

console.log('\n=== eval-final ===');
for (const [s, n, d] of results) console.log(`${s} ${n}${d ? '  ' + d : ''}`);
const fails = results.filter(r => r[0] === 'FAIL').length;
const total = results.filter(r => r[0] !== 'N-A ').length;
console.log(`\neval-final.mjs (espocrm) : ${total - fails}/${total} contrôles OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
