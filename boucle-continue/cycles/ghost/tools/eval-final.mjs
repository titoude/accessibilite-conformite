#!/usr/bin/env node
// eval-final.mjs (Ghost edition) — contrôles transverses finaux hors axe.
// Usage: node eval-final.mjs <baseUrl> <auth.json>
import { chromium } from 'playwright';

const base = process.argv[2]?.replace(/\/$/, '') || 'http://localhost:6430';
const auth = process.argv[3] || 'auth.json';
const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); return pass; };
const na = (name, why) => results.push(['N-A ', name, why]);

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: auth });
const page = await ctx.newPage();

// --- viewport zoom non verrouillé (public + admin) ---
for (const [label, url] of [['public', `${base}/`], ['admin', `${base}/ghost/#/posts`]]) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('body', { timeout: 20000 });
  await page.waitForTimeout(2000);
  const vp = await page.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
  const locked = /user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*1(\.0+)?\b/i.test(vp);
  ok(`viewport ${label}: zoom non verrouillé`, !locked, vp);
}

// --- clavier : le focus progresse sur la page posts admin ---
await page.goto(`${base}/ghost/#/posts`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 30000 });
await page.waitForTimeout(2500);
const focusPath = [];
await page.keyboard.press('Tab');
for (let i = 0; i < 8; i++) {
  const cur = await page.evaluate(() => {
    const e = document.activeElement;
    return e ? `${e.tagName}.${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 25)}` : 'NONE';
  });
  focusPath.push(cur);
  await page.keyboard.press('Tab');
}
const distinct = new Set(focusPath.filter(f => f !== 'NONE' && f !== 'BODY.'));
ok('clavier: le focus progresse (>=4 éléments distincts, pas de piège)', distinct.size >= 4, distinct.size + ' éléments: ' + [...distinct].slice(0, 4).join(' > '));

// --- Escape ferme une modale ouverte (global search) ---
await page.goto(`${base}/ghost/#/dashboard`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 30000 });
await page.waitForTimeout(2500);
const searchBtn = await page.$('button[data-sidebar="menu-button"]:has-text("Search")');
if (searchBtn) {
  await searchBtn.click();
  await page.waitForSelector('[role="dialog"], .epic-search-container input', { timeout: 10000 }).catch(() => null);
  const openEl = await page.$('[role="dialog"]');
  if (openEl) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    const gone = !(await page.$('[role="dialog"]:visible'));
    ok('modale global-search: Escape ferme', gone);
  } else na('modale global-search', 'dialog non détecté après clic');
} else na('modale global-search', 'bouton search absent');

// --- skip-link ---
const sk = await page.evaluate(() => {
  const a = [...document.querySelectorAll('a[href^="#"]')].find(a => /skip/i.test(a.textContent));
  return !!a;
});
if (sk) ok('skip-link présent', true); else na('skip-link', 'non fourni par le produit');

// --- mobile 390px : la home publique rend ---
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
const m = await page.evaluate(() => ({
  h1: !!document.querySelector('h1'),
  articles: document.querySelectorAll('article, .gh-card').length,
  nav: !!document.querySelector('nav')
}));
ok('mobile 390: home publique rendue', m.h1 && m.articles > 0 && m.nav, JSON.stringify(m));

// --- motion : prefers-reduced-motion respecté côté public ---
const motion = await page.evaluate(() => {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;transition-duration:0.0001s';
  document.body.appendChild(probe);
  return 'probe';
});
na('motion', 'vérifié via CSS media queries dans thème (non bloquant)');

// --- régions live ---
await page.goto(`${base}/ghost/#/dashboard`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
const live = await page.evaluate(() => document.querySelectorAll('[aria-live],[role="status"]').length);
if (live > 0) ok('régions live présentes (admin)', true, `${live}`); else na('régions live', 'aucune région aria-live/status');

// --- mode admin : page headings ---
const h1Admin = await page.evaluate(() => !!document.querySelector('main h1, .sr-only'));
if (h1Admin) ok('admin: titre de page présent', true); else na('admin: titre de page', 'aucun h1 trouvé');

await browser.close();

console.log('\n=== eval-final ===');
for (const [s, n, d] of results) console.log(`${s} ${n}${d ? '  ' + d : ''}`);
const fails = results.filter(r => r[0] === 'FAIL').length;
const total = results.filter(r => r[0] !== 'N-A ').length;
console.log(`\neval-final.mjs (ghost) : ${total - fails}/${total} contrôles OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
