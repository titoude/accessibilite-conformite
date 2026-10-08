#!/usr/bin/env node
// eval-final.mjs (plausible edition) — contrôles transverses finaux hors axe.
// Usage: node eval-final.mjs <baseUrl> <auth.json>
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2]?.replace(/\/$/, '') || 'http://localhost:8950';
const auth = process.argv[3] || 'auth.json';
const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); return pass; };
const na = (name, why) => results.push(['N-A ', name, why]);

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US', storageState: auth });
const page = await ctx.newPage();

// --- viewport zoom non verrouillé (public + auth) ---
for (const [label, url] of [['public', `${base}/login`], ['auth', `${base}/sites`]]) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('body', { timeout: 20000 });
  await page.waitForTimeout(1500);
  const vp = await page.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
  const locked = /user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*1(\.0+)?\b/i.test(vp);
  ok(`viewport ${label}: zoom non verrouillé`, !locked, vp);
}

// --- clavier : le focus progresse sur le dashboard ---
await page.goto(`${base}/dummy.site`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#app > *, main', { timeout: 30000 });
await page.waitForTimeout(2500);
const focusPath = [];
for (let i = 0; i < 12; i++) {
  await page.keyboard.press('Tab');
  const cur = await page.evaluate(() => {
    const e = document.activeElement;
    return e ? `${e.tagName}.${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 25)}` : 'NONE';
  });
  focusPath.push(cur);
}
const distinct = new Set(focusPath.filter(f => f !== 'NONE' && f !== 'BODY.'));
ok('clavier: le focus progresse (>=4 éléments distincts, pas de piège)', distinct.size >= 4, distinct.size + ' éléments: ' + [...distinct].slice(0, 4).join(' > '));

// --- Escape ferme un menu HeadlessUI ouvert (user-menu) ---
const userBtn = page.locator('#user-menu-button');
if (!(await userBtn.count())) {
  na('menu utilisateur: Escape ferme', '#user-menu-button absent');
} else {
  await userBtn.click();
  // menu Alpine : panneau div[x-show] visible contenant des liens
  const opened = await page.waitForSelector('div[x-show]:has(a)', { state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
  ok('menu utilisateur: s\'ouvre', opened);
  if (opened) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
    const closed = await page.evaluate(`(() => {
      const panels = [...document.querySelectorAll('div[x-show]')].filter(e => e.querySelectorAll('a,button').length);
      return panels.every(e => !e.getClientRects().length);
    })()`);
    ok('menu utilisateur: Escape referme', closed);
  }
}

// --- mobile 390px : le dashboard rend ---
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/dummy.site`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#app > *, main', { timeout: 30000 });
await page.waitForTimeout(2500);
const m = await page.evaluate(() => ({
  innerWidth: window.innerWidth,
  app: !!document.querySelector('#stats-react-container > *'),
  main: !!document.querySelector('main'),
  switcher: !!document.querySelector('[data-testid="site-switcher-current-site"]'),
}));
ok('mobile 390: dashboard rend', m.innerWidth === 390 && m.main && m.switcher, JSON.stringify(m));

// --- régions live / status ---
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${base}/sites`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
const live = await page.evaluate(() => document.querySelectorAll('[aria-live],[role="status"]').length);
if (live > 0) ok('régions live présentes', true, `${live}`); else na('régions live', 'aucune région aria-live/status');

// --- titres de page ---
await page.goto(`${base}/sites`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
const h1Sites = await page.evaluate(() => {
  const h = document.querySelector('h1');
  return h && (h.innerText || '').trim() !== '';
});
ok('sites: titre de page h1 présent', !!h1Sites);

// --- realtime : route ?period=realtime rend Current Visitors ---
await page.goto(`${base}/dummy.site?period=realtime`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#app > *, main', { timeout: 30000 });
await page.waitForTimeout(2000);
const rt = await page.evaluate(() => /current\s*visitors/i.test(document.body.innerText));
ok('realtime: "Current Visitors" rendu', rt);

await browser.close();

console.log('\n=== eval-final ===');
for (const [s, n, d] of results) console.log(`${s} ${n}${d ? '  ' + d : ''}`);
const fails = results.filter(r => r[0] === 'FAIL').length;
const total = results.filter(r => r[0] !== 'N-A ').length;
console.log(`\neval-final.mjs (plausible) : ${total - fails}/${total} contrôles OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
