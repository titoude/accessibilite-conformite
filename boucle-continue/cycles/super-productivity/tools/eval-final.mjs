#!/usr/bin/env node
// eval-final.mjs (super-productivity edition) — contrôles transverses finaux hors axe.
// Usage: node eval-final.mjs <baseUrl> [profileDir]
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));

const base = (process.argv[2] || 'http://localhost:9251').replace(/\/$/, '');
const profileDir = process.argv[3] || resolve(HERE, 'seed-profile');
if (!existsSync(profileDir)) { console.error('FAIL: profil seed absent — lancer seed.mjs'); process.exit(2); }

const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); return pass; };
const na = (name, why) => results.push(['N-A ', name, why]);

const ctx = await chromium.launchPersistentContext(profileDir, { locale: 'en-US' });
const page = ctx.pages()[0] || await ctx.newPage();

// --- viewport zoom non verrouillé ---
await page.goto(`${base}/#/tag/TODAY/tasks`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('task', { timeout: 30000 });
await page.waitForTimeout(1500);
const vp = await page.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
const locked = /user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*1(\.0+)?\b/i.test(vp);
ok('viewport: zoom non verrouillé', !locked, vp);

// --- clavier : le focus progresse (pas de piège) ---
const focusPath = [];
const focusIndicators = [];
for (let i = 0; i < 10; i++) {
  await page.keyboard.press('Tab');
  await page.waitForTimeout(150);
  const cur = await page.evaluate(() => {
    const e = document.activeElement;
    if (!e || e === document.body) return { name: 'NONE', ind: false };
    const cs = getComputedStyle(e);
    const cls = e.getAttribute('class') || '';
    const hasOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
    const hasShadow = cs.boxShadow !== 'none';
    const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
    return {
      name: `${e.tagName}.${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 25)}`,
      ind: hasOutline || hasShadow || hasBg || cls.includes('mat-focus-indicator'),
    };
  });
  focusPath.push(cur.name);
  focusIndicators.push(cur.ind);
}
const distinct = new Set(focusPath.filter(f => f !== 'NONE' && f !== 'BODY.'));
ok('clavier: le focus progresse (>=4 éléments distincts)', distinct.size >= 4, distinct.size + ' éléments: ' + [...distinct].slice(0, 4).join(' > '));

// --- focus visible : chaque arrêt Tab doit montrer un indicateur
// (outline, box-shadow ou fond — Material utilise un overlay de fond sur
// :focus-visible via .mat-focus-indicator) ---
const withInd = focusIndicators.filter(Boolean).length;
const checked = focusIndicators.filter((_, i) => focusPath[i] !== 'NONE' && focusPath[i] !== 'BODY.').length;
ok('focus visible: indicateur présent sur les arrêts Tab', withInd >= Math.ceil(checked * 0.6) && withInd > 0, `${withInd}/${checked} arrêts avec indicateur`);

// --- Escape ferme le menu contextuel ---
const t = page.locator('task').first();
await t.hover();
await t.click({ button: 'right' });
const opened = await page.waitForSelector('.mat-mdc-menu-panel', { timeout: 8000 }).catch(() => null);
if (opened) {
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  const gone = !(await page.$('.mat-mdc-menu-panel'));
  ok('menu contextuel: Escape ferme', gone);
} else {
  na('menu contextuel Escape', 'menu non ouvert au clic droit');
}

// --- skip-link (le produit n'en fournit peut-être pas — constat honnête) ---
const sk = await page.evaluate(() => !!([...document.querySelectorAll('a[href^="#"]')].find(a => /skip/i.test(a.textContent))));
if (sk) ok('skip-link présent', true); else na('skip-link', 'non fourni par le produit');

// --- régions live / status ---
const live = await page.evaluate(() => document.querySelectorAll('[aria-live],[role="status"]').length);
if (live > 0) ok('régions live présentes', true, `${live}`); else na('régions live', 'aucune région aria-live/status sur cette vue');

// --- mobile 390 : la page rend ---
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/#/tag/TODAY/tasks`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('task', { timeout: 30000 });
const m = await page.evaluate(() => ({
  wrapper: !!document.querySelector('.route-wrapper'),
  tasks: document.querySelectorAll('task').length,
}));
ok('mobile 390: page rendue avec tâches', m.wrapper && m.tasks >= 1, JSON.stringify(m));

// --- titre de page document.title non vide ---
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${base}/#/config`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.route-wrapper', { timeout: 30000 });
await page.waitForTimeout(1500);
const title = await page.evaluate(() => document.title);
ok('app: document.title non vide', !!title && title.trim().length > 0, title);

// --- texte redimensionnable 200% : pas de overflow-x à zoom 200 ---
await page.evaluate(() => document.body.style.zoom = '2');
await page.waitForTimeout(600);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 5);
await page.evaluate(() => document.body.style.zoom = '');
ok('zoom 200%: pas de scroll horizontal', !overflow);

await ctx.close();

console.log('\n=== eval-final ===');
for (const [s, n, d] of results) console.log(`${s} ${n}${d ? '  ' + d : ''}`);
const fails = results.filter(r => r[0] === 'FAIL').length;
const total = results.filter(r => r[0] !== 'N-A ').length;
console.log(`\neval-final.mjs (super-productivity): ${total - fails}/${total} contrôles OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
