#!/usr/bin/env node
// eval-final.mjs (lemmy edition) — contrôles transverses finaux hors axe.
// Usage: node eval-final.mjs <baseUrl> [auth.json]
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));

const base = process.argv[2]?.replace(/\/$/, '') || 'http://localhost:9655';
const auth = process.argv[3] || resolve(HERE, 'auth.json');
const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); return pass; };
const na = (name, why) => results.push(['N-A ', name, why]);

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US', storageState: auth });
const page = await ctx.newPage();
const pub = await (await browser.newContext({ locale: 'en-US' })).newPage();

// --- viewport zoom non verrouillé (public + auth) ---
for (const [label, url, pg] of [['public', `${base}/`, pub], ['auth', `${base}/inbox`, page]]) {
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector('#app', { timeout: 30000 });
  await pg.waitForTimeout(1500);
  const vp = await pg.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
  const locked = /user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*1(\.0+)?\b/i.test(vp);
  ok(`viewport ${label}: zoom non verrouillé`, !locked, vp);
}

// --- lang document (SSR shell) ---
const lang = await pub.evaluate(() => document.documentElement.lang);
ok('lang document présent', !!lang, lang || 'NONE');

// --- clavier : le focus progresse sur la page auth ---
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#app', { timeout: 30000 });
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
ok('clavier: le focus progresse (>=4 distincts)', distinct.size >= 4, `${distinct.size}: ${[...distinct].slice(0, 4).join(' > ')}`);

// --- Escape ferme le dropdown ouvert ---
const moreBtn = page.locator('button.dropdown-toggle[aria-controls^="post-action"]:visible').first();
if (await moreBtn.count()) {
  await moreBtn.click();
  await page.waitForTimeout(700);
  const openMenu = await page.evaluate(() => !!document.querySelector('ul.dropdown-menu.show'));
  if (openMenu) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
    const closed = await page.evaluate(() => !document.querySelector('ul.dropdown-menu.show'));
    ok('dropdown post-actions: Escape ferme', closed);
  } else na('dropdown post-actions', 'menu non détecté après clic');
} else na('dropdown post-actions', 'bouton absent');

// --- skip-link ---
const sk = await pub.evaluate(() => [...document.querySelectorAll('a[href^="#"], .skip-link')].some(a => /skip/i.test(a.textContent || '') || /skip/i.test(a.className || '')));
if (sk) ok('skip-link présent', true); else na('skip-link', 'non fourni par le produit');

// --- mobile 390 : public + auth rendent + burger nav ---
for (const [label, url, pg] of [['public', `${base}/`, pub], ['auth', `${base}/inbox`, page]]) {
  await pg.setViewportSize({ width: 390, height: 800 });
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector('#app', { timeout: 30000, state: 'attached' });
  const m = await pg.evaluate(() => ({ body: (document.body.innerText || '').trim().length, toggler: !!document.querySelector('.navbar-toggler') }));
  ok(`mobile 390 ${label}: page rendue + burger`, m.body > 200 && m.toggler, JSON.stringify(m));
  await pg.setViewportSize({ width: 1280, height: 900 });
}

// --- régions live / status ---
const live = await pub.evaluate(() => document.querySelectorAll('[aria-live],[role="status"]').length);
if (live > 0) ok('régions live présentes', true, `${live}`); else na('régions live', 'aucune région aria-live/status');

// --- h1 présent sur chaque surface ---
for (const [label, url, pg] of [['public /', '/', pub], ['auth /inbox', '/inbox', page], ['auth /settings', '/settings', page], ['public /legal', '/legal', pub], ['public /instances', '/instances', pub]]) {
  await pg.goto(`${base}${url}`, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(1800);
  const h = await pg.evaluate(() => { const e = document.querySelector('h1'); return e && (e.innerText || '').trim() !== ''; });
  ok(`${label}: h1 présent`, !!h);
}

// --- aucun label for=undefined / for vide ---
for (const [label, pg] of [['public', pub], ['auth', page]]) {
  const badFor = await pg.evaluate(() => [...document.querySelectorAll('label[for]')].filter(l => !document.getElementById(l.getAttribute('for'))).length);
  ok(`labels ${label}: aucun for sans cible`, badFor === 0, `${badFor}`);
}

// --- titre d'onglet parlant ---
const titles = await Promise.all(['/communities', '/modlog'].map(async u => { const p = await ctx.newPage(); await p.goto(`${base}${u}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200); const t = await p.title(); await p.close(); return t; }));
ok('titles parlants', titles.every(t => t.trim().length > 0), JSON.stringify(titles));

// --- markdown preview accessible : texte rendu dans .md-div ---
await page.goto(`${base}/create_post`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#post-title', { timeout: 30000 });
await page.locator('textarea[id^="markdown-textarea"]').fill('**bold eval**');
const pv = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x => /^\s*Preview\s*$/.test(x.innerText));
  return b ? !b.disabled : null;
});
if (pv) {
  await page.evaluate(() => [...document.querySelectorAll('button')].find(x => /^\s*Preview\s*$/.test(x.innerText)).click());
  await page.waitForTimeout(800);
  const md = await page.evaluate(() => document.querySelector('.md-div')?.innerHTML.includes('<strong>') || false);
  ok('markdown preview: rendu <strong> dans .md-div', md);
} else na('markdown preview', 'bouton Preview indisponible');

await browser.close();
console.log('\n=== eval-final ===');
for (const [s, n, d] of results) console.log(`${s} ${n}${d ? '  ' + d : ''}`);
const fails = results.filter(r => r[0] === 'FAIL').length;
const total = results.filter(r => r[0] !== 'N-A ').length;
console.log(`\neval-final.mjs (lemmy) : ${total - fails}/${total} contrôles OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
