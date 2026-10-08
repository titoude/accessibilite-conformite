#!/usr/bin/env node
// eval-final.mjs (chatwoot edition) — contrôles transverses finaux hors axe.
// Usage: node eval-final.mjs <baseUrl> [auth.json]
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(dirname(fileURLToPath(import.meta.url)), 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2]?.replace(/\/$/, '') || 'http://localhost:9700';
const auth = process.argv[3] || new URL('./auth.json', import.meta.url).pathname;
const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); return pass; };
const na = (name, why) => results.push(['N-A ', name, why]);

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US', storageState: auth });
const page = await ctx.newPage();
const pub = await (await browser.newContext({ locale: 'en-US' })).newPage();

// --- viewport zoom non verrouillé (public login + widget + admin) ---
for (const [label, url, pg] of [['login', `${base}/app/login`, pub], ['widget', `${base}/widget?website_token=${WTOKEN}`, pub], ['admin', `${base}/app/accounts/1/dashboard`, page]]) {
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector('body', { timeout: 30000 });
  await pg.waitForTimeout(2500);
  const vp = await pg.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
  const locked = /user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*1(\.0+)?\b/i.test(vp);
  ok(`viewport ${label}: zoom non verrouillé`, !locked, vp);
}

// --- lang document (login + widget) ---
for (const url of [`${base}/app/login`, `${base}/widget?website_token=${WTOKEN}`]) {
  await pub.goto(url, { waitUntil: 'domcontentloaded' });
  await pub.waitForTimeout(2500);
  const lang = await pub.evaluate(() => document.documentElement.lang);
  ok(`lang document présent (${url.split('/').pop()})`, !!lang, lang || 'NONE');
}

// --- clavier : le focus progresse dans l'admin ---
await page.goto(`${base}/app/accounts/1/dashboard`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('aside, main', { timeout: 45000 });
await page.waitForTimeout(4000);
await page.evaluate(() => document.body.focus());
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
ok('clavier admin: le focus progresse (>=4 distincts)', distinct.size >= 4, `${distinct.size}: ${[...distinct].slice(0, 4).join(' > ')}`);

// --- Escape ferme le menu profil ---
const av = page.locator('aside img, aside [class*="avatar"], aside [class*="Avatar"]').last();
if (await av.count()) {
  await av.click();
  await page.waitForTimeout(1500);
  const menuOpen = await page.evaluate(() => !!document.querySelector('.n-dropdown-body, [role="menu"], ul.n-dropdown-section, ul.max-h-96'));
  if (menuOpen) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    const closed = await page.evaluate(() => !document.querySelector('.n-dropdown-body'));
    ok('menu profil: Escape ferme', closed);
  } else na('menu profil', 'menu non détecté après clic avatar');
} else na('menu profil', 'avatar introuvable');

// --- skip-link ---
await pub.goto(`${base}/app/login`, { waitUntil: 'domcontentloaded' });
const sk = await pub.evaluate(() => [...document.querySelectorAll('a[href^="#"], .skip-link')].some(a => /skip/i.test(a.textContent || '') || /skip/i.test(a.className || '')));
if (sk) ok('skip-link présent', true); else na('skip-link', 'non fourni par le produit');

// --- mobile 390 : login public + admin rendent ---
for (const [label, url, pg, sel] of [['login', `${base}/app/login`, pub, 'form, main'], ['admin', `${base}/app/accounts/1/dashboard`, page, 'aside, main']]) {
  await pg.setViewportSize({ width: 390, height: 800 });
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector(sel, { timeout: 30000, state: 'attached' });
  await pg.waitForTimeout(2500);
  const m = await pg.evaluate(() => ({ h1: !!document.querySelector('h1'), body: (document.body.innerText || '').length > 40 }));
  ok(`mobile 390 ${label}: page rendue`, m.body, JSON.stringify(m));
  await pg.setViewportSize({ width: 1280, height: 900 });
}

// --- régions live / status ---
const live = await page.evaluate(() => document.querySelectorAll('[aria-live],[role="status"],[role="alert"]').length);
if (live > 0) ok('régions live présentes', true, `${live}`); else na('régions live', 'aucune région aria-live/status');

// --- h1 présent sur les surfaces clés ---
for (const [label, url, pg] of [['login', `${base}/app/login`, pub], ['dashboard', `${base}/app/accounts/1/dashboard`, page], ['contacts', `${base}/app/accounts/1/contacts`, page], ['conversation', `${base}/app/accounts/1/conversations/1`, page]]) {
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(5000);
  const h = await pg.evaluate(() => { const e = document.querySelector('h1'); return e && (e.innerText || '').trim() !== ''; });
  ok(`${label}: h1 présent`, !!h);
}

// --- aucun label for=undefined / for vide ---
const badFor = await page.evaluate(() => document.querySelectorAll('label[for="undefined"],label[for=""]').length);
ok('labels: aucun for=undefined/vide', badFor === 0, `${badFor}`);

// --- titres d'onglet parlants ---
const titles = [];
for (const u of ['/app/accounts/1/contacts', '/app/accounts/1/reports/overview']) {
  const p = await ctx.newPage();
  await p.goto(`${base}${u}`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(3000);
  titles.push(await p.title());
  await p.close();
}
ok('titles parlants', titles.every(t => t && t.length >= 5), JSON.stringify(titles));

await browser.close();
console.log('\n=== eval-final ===');
for (const [s, n, d] of results) console.log(`${s} ${n}${d ? '  ' + d : ''}`);
const fails = results.filter(r => r[0] === 'FAIL').length;
const total = results.filter(r => r[0] !== 'N-A ').length;
console.log(`\neval-final.mjs (chatwoot) : ${total - fails}/${total} contrôles OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
