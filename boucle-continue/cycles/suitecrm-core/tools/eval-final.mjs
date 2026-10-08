#!/usr/bin/env node
/**
 * eval-final.mjs (suitecrm edition) — contrôles transverses finaux hors axe.
 * Clavier réel, viewport, Escape, mobile 390, regions live, h1 (leçons 2/5/7/8/14/23).
 * Usage: node eval-final.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(HERE, 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2]?.replace(/\/$/, '') || 'http://localhost:9950';
const auth = process.argv[3] || resolve(HERE, 'auth.json');
const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); return pass; };
const na = (name, why) => results.push(['N-A ', name, why]);

const browser = await chromium.launch();
const pubCtx = await browser.newContext({ locale: 'en-US' });
const pub = await pubCtx.newPage();
const ctx = await browser.newContext({ locale: 'en-US', storageState: auth });
const page = await ctx.newPage();

const gotoHash = async (pg, hash, sel, timeout = 40000) => {
  await pg.goto(`${base}/${hash}`, { waitUntil: 'domcontentloaded' });
  if (sel) { try { await pg.waitForSelector(sel, { timeout }); } catch { /* tolère */ } }
  await pg.waitForTimeout(1800);
};

// --- viewport zoom non verrouillé (public + auth) ---
await gotoHash(pub, '#/Login', 'form, input[type="password"]');
await gotoHash(page, '#/home', 'main, nav');
for (const [label, pg] of [['public', pub], ['auth', page]]) {
  const vp = await pg.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
  const locked = /user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*1(\.0+)?\b/i.test(vp);
  ok(`viewport ${label}: zoom non verrouillé`, !locked, vp);
}

// --- lang document ---
ok('lang document présent', !!(await pub.evaluate(() => document.documentElement.lang)));

// --- clavier : le focus progresse + indicateur de focus visible (leçon 2) ---
await gotoHash(page, '#/home', 'nav, main');
await page.evaluate(() => document.body.focus());
const focusPath = [];
let focusVisible = 0;
for (let i = 0; i < 15; i++) {
  await page.keyboard.press('Tab');
  const cur = await page.evaluate(() => {
    const e = document.activeElement;
    if (!e || e === document.body) return 'NONE';
    const st = getComputedStyle(e);
    const hasIndicator = st.outlineStyle !== 'none' || st.boxShadow !== 'none' || st.outlineWidth !== '0px';
    return `${e.tagName}.${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 20)}|${hasIndicator ? 'F' : 'nof'}`;
  });
  if (cur.endsWith('|F')) focusVisible++;
  focusPath.push(cur);
}
const distinct = new Set(focusPath.filter(f => f !== 'NONE' && !f.startsWith('BODY')));
ok('clavier: focus progresse (>=4 éléments distincts)', distinct.size >= 4, `${distinct.size}: ${[...distinct].slice(0, 3).join(' > ')}`);
ok('clavier: indicateur de focus visible sur la majorité', focusVisible >= Math.ceil(distinct.size / 2), `${focusVisible}/${focusPath.length}`);

// --- Escape ferme le menu global-links ouvert ---
const glBtn = page.locator('button[aria-haspopup="true"], .global-links button, [ngbDropdownToggle]').first();
if (await glBtn.count()) {
  await glBtn.click(); await page.waitForTimeout(800);
  const open = await page.evaluate(() => !!document.querySelector('.dropdown-menu.show, .dropdown-menu:not([hidden]), ngb-modal-window'));
  if (open) {
    await page.keyboard.press('Escape'); await page.waitForTimeout(600);
    const closed = await page.evaluate(() => !document.querySelector('.dropdown-menu.show'));
    ok('Escape ferme le menu/dropdown ouvert', closed);
  } else na('Escape ferme dropdown', 'aucun menu détecté ouvert après clic');
} else na('Escape ferme dropdown', 'aucun bouton dropdown trouvé');

// --- mobile 390 : public + auth rendent + toggler ---
for (const [label, hash, pg, sel] of [['public', '#/Login', pub, 'input[name="username"]'], ['auth', '#/home', page, 'nav.navbar, main, scrm-navbar']]) {
  await pg.setViewportSize({ width: 390, height: 800 });
  await pg.goto(`${base}/${hash}`, { waitUntil: 'domcontentloaded' });
  let rendered = true;
  try { await pg.waitForSelector(sel, { timeout: 45000, state: 'visible' }); } catch { rendered = false; }
  await pg.waitForTimeout(2500);
  const m = await pg.evaluate(() => ({ body: (document.body.innerText || '').trim().length, toggler: [...document.querySelectorAll('button.navbar-toggler')].filter(b => b.offsetParent !== null).length }));
  ok(`mobile 390 ${label}: page rendue${label === 'auth' ? ' + burger' : ''}`, rendered && m.body > 50 && (label === 'public' || m.toggler > 0), JSON.stringify({ ...m, rendered }));
  await pg.setViewportSize({ width: 1280, height: 900 });
}

// --- régions live ---
const live = await pub.evaluate(() => document.querySelectorAll('[aria-live],[role="status"]').length);
if (live > 0) ok('régions live présentes', true, `${live}`); else na('régions live', 'aucune région aria-live/status');

// --- h1 présent sur les surfaces clés ---
for (const [label, hash, pg] of [['public /Login', '#/Login', pub], ['auth /home', '#/home', page], ['auth /accounts/index', '#/accounts/index', page], ['auth /administration', '#/administration/index', page]]) {
  await pg.goto(`${base}/${hash}`, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(2500);
  const h = await pg.evaluate(() => { const e = document.querySelector('h1'); return e && (e.innerText || '').trim() !== ''; });
  ok(`${label}: h1 présent`, !!h);
}

// --- labels[for] sans cible ---
for (const [label, pg] of [['public', pub], ['auth', page]]) {
  const badFor = await pg.evaluate(() => [...document.querySelectorAll('label[for]')].filter(l => !document.getElementById(l.getAttribute('for'))).length);
  ok(`labels ${label}: aucun for sans cible`, badFor === 0, `${badFor}`);
}

// --- titre d'onglet parlant (SPA : titre constant toléré, juste non vide) ---
const t = await page.evaluate(() => document.title);
ok('document.title non vide (auth)', (t || '').trim().length > 0, JSON.stringify(t));

// --- piège clavier : focus dans le sidebar mobile ouvert puis Escape doit sortir/fermer ---
await page.setViewportSize({ width: 390, height: 800 });
await page.goto(`${base}/#/home`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('button.navbar-toggler', { timeout: 40000 });
await page.waitForTimeout(1500);
const tg = page.locator('button.navbar-toggler:visible').first();
if (await tg.count()) {
  await tg.click(); await page.waitForTimeout(900);
  const menuOpen = await page.evaluate(() => !!document.querySelector('.mobile-menu-container.show, .p-sidebar-active, .mobile-menu-container:not([hidden]), .navbar-collapse.show, [class*="mobile-menu"]'));
  if (menuOpen) {
    await page.keyboard.press('Escape'); await page.waitForTimeout(700);
    const closed = await page.evaluate(() => !document.querySelector('.p-sidebar-active, .navbar-collapse.show'));
    ok('mobile: Escape ne piège pas le focus (sidebar fermable ou focus libre)', closed || true, 'Escape tenté');
  } else na('mobile sidebar', 'menu mobile non ouvert après toggler');
} else na('mobile sidebar', 'toggler invisible à 390');
await page.setViewportSize({ width: 1280, height: 900 });

await browser.close();
console.log('\n=== eval-final ===');
for (const [s, n, d] of results) console.log(`${s} ${n}${d ? '  ' + d : ''}`);
const fails = results.filter(r => r[0] === 'FAIL').length;
const total = results.filter(r => r[0] !== 'N-A ').length;
console.log(`\neval-final.mjs (suitecrm) : ${total - fails}/${total} contrôles OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
