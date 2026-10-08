#!/usr/bin/env node
// eval-final.mjs (castopod edition) — contrôles transverses finaux hors axe.
// Usage: node eval-final.mjs <baseUrl> <auth.json>
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2]?.replace(/\/$/, '') || 'http://localhost:9170';
const auth = process.argv[3] || 'auth.json';
const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); return pass; };
const na = (name, why) => results.push(['N-A ', name, why]);

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US', storageState: auth });
const page = await ctx.newPage();
const pub = await (await browser.newContext({ locale: 'en-US' })).newPage();

// --- viewport zoom non verrouillé (public + admin) ---
for (const [label, url, pg] of [['public', `${base}/@auditwaves`, pub], ['admin', `${base}/cp-admin`, page]]) {
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector('body', { timeout: 20000 });
  await pg.waitForTimeout(1500);
  const vp = await pg.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
  const locked = /user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*1(\.0+)?\b/i.test(vp);
  ok(`viewport ${label}: zoom non verrouillé`, !locked, vp);
}

// --- lang document ---
const lang = await pub.evaluate(() => document.documentElement.lang);
ok('lang document présent', !!lang, lang || 'NONE');

// --- clavier : le focus progresse dans l'admin ---
await page.goto(`${base}/cp-admin`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('header nav', { timeout: 25000 });
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
ok('clavier admin: le focus progresse (>=4 distincts, pas de piège)', distinct.size >= 4, `${distinct.size}: ${[...distinct].slice(0, 4).join(' > ')}`);

// --- Escape ferme un dropdown ouvert ---
const notifBtn = await page.$('#notifications-dropdown');
if (notifBtn) {
  await notifBtn.click();
  await page.waitForTimeout(500);
  const openMenu = await page.evaluate(() => {
    const m = document.getElementById('notifications-dropdown-menu');
    return m && !m.hasAttribute('hidden') && getComputedStyle(m).display !== 'none';
  });
  if (openMenu) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
    const closed = await page.evaluate(() => {
      const m = document.getElementById('notifications-dropdown-menu');
      return !m || m.hasAttribute('hidden') || getComputedStyle(m).display === 'none' || getComputedStyle(m).visibility === 'hidden' || m.style.display === 'none';
    });
    ok('dropdown notifications: Escape ferme', closed);
  } else na('dropdown notifications', 'menu non détecté après clic');
} else na('dropdown notifications', 'bouton absent');

// --- skip-link ---
const sk = await pub.evaluate(() => {
  const a = [...document.querySelectorAll('a[href^="#"]')].find(a => /skip/i.test(a.textContent));
  return !!a;
});
if (sk) ok('skip-link présent', true); else na('skip-link', 'non fourni par le produit');

// --- mobile 390 : public + admin rendent ---
for (const [label, url, pg, sel] of [['public', `${base}/@auditwaves`, pub, 'nav'], ['admin', `${base}/cp-admin`, page, 'header nav']]) {
  await pg.setViewportSize({ width: 390, height: 800 });
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector(sel, { timeout: 25000 });
  const m = await pg.evaluate(() => ({ h1: !!document.querySelector('h1') }));
  ok(`mobile 390 ${label}: page rendue`, m.h1, JSON.stringify(m));
  await pg.setViewportSize({ width: 1280, height: 900 });
}

// --- régions live / status ---
const live = await pub.evaluate(() => document.querySelectorAll('[aria-live],[role="status"]').length);
if (live > 0) ok('régions live présentes', true, `${live}`); else na('régions live', 'aucune région aria-live/status');

// --- titre h1 sur chaque surface ---
for (const [label, url, pg] of [['public', `${base}/@auditwaves`, pub], ['admin', `${base}/cp-admin/my-account`, page], ['embed', `${base}/@auditwaves/episodes/reperage-page-publique/embed`, pub]]) {
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(1200);
  const h = await pg.evaluate(() => { const e = document.querySelector('h1'); return e && (e.innerText || '').trim() !== ''; });
  ok(`${label}: h1 présent`, !!h);
}

await browser.close();
console.log('\n=== eval-final ===');
for (const [s, n, d] of results) console.log(`${s} ${n}${d ? '  ' + d : ''}`);
const fails = results.filter(r => r[0] === 'FAIL').length;
const total = results.filter(r => r[0] !== 'N-A ').length;
console.log(`\neval-final.mjs (castopod) : ${total - fails}/${total} contrôles OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
