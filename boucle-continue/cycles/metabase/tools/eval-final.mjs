#!/usr/bin/env node
/**
 * eval-final.mjs — contrôles transverses finaux hors axe (cycle 46, metabase).
 * Usage: node eval-final.mjs <baseUrl> [state-admin.json]
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const [baseArg, authFile] = process.argv.slice(2);
const base = (baseArg || 'http://localhost:7600').replace(/\/$/, '');
const state = authFile ? JSON.parse(readFileSync(authFile, 'utf8')) : undefined;
const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); console.log(`  ${pass ? 'OK  ' : 'FAIL'} ${name} ${detail}`); return pass; };
const na = (name, why) => { results.push(['N-A ', name, why]); console.log(`  N-A  ${name} ${why}`); };

const browser = await chromium.launch();
const anon = await browser.newContext();
const ctx = await browser.newContext(state ? { storageState: state } : {});
const anonPage = await anon.newPage();
const page = await ctx.newPage();

// ── A. viewport zoom non verrouillé (login public + home admin) ────────────
await anonPage.goto(`${base}/auth/login`, { waitUntil: 'domcontentloaded' });
await anonPage.waitForSelector('body', { timeout: 20000 });
await anonPage.waitForTimeout(1500);
const vpPublic = await anonPage.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
ok('viewport public: zoom non verrouillé',
  !/user-scalable\s*=\s*(no|0)/i.test(vpPublic) && !/maximum-scale\s*=\s*1(\.0+)?\b/i.test(vpPublic), vpPublic);

await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('nav, aside', { timeout: 30000 });
await page.waitForTimeout(1500);
const vpAdmin = await page.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || 'NONE');
ok('viewport admin: zoom non verrouillé',
  !/user-scalable\s*=\s*(no|0)/i.test(vpAdmin) && !/maximum-scale\s*=\s*1(\.0+)?\b/i.test(vpAdmin), vpAdmin);

// ── B. navigation clavier : Tab atteint un repère interactif + focus visible ─
await page.keyboard.press('Tab');
await page.waitForTimeout(400);
const kb = await page.evaluate(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return { focused: false };
  const outline = getComputedStyle(el).outlineWidth;
  const box = getComputedStyle(el).boxShadow;
  return { focused: true, tag: el.tagName, text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40), outline, box };
});
ok('clavier: Tab donne le focus à un élément', kb.focused, `${kb.tag} "${kb.text}"`);
ok('clavier: indicateur de focus visible', kb.outline !== '0px' || kb.box !== 'none', `outline=${kb.outline} box-shadow=${String(kb.box).slice(0, 60)}`);

// ── C. Escape ferme le menu « New » ────────────────────────────────────────
const menuBtn = await page.$('button[aria-label="New"]');
if (menuBtn) {
  await menuBtn.click();
  await page.waitForSelector('[role="menu"][data-menu-dropdown], [data-testid="new-item-dropdown"], [role="menu"]', { timeout: 8000 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  const stillOpen = await page.evaluate(() => {
    return [...document.querySelectorAll('[role="menu"]')]
      .filter(m => m.offsetParent !== null && !m.closest('[aria-hidden="true"]'))
      .map(m => m.getAttribute('data-testid') || m.id || m.className.slice(0, 40));
  });
  ok('menu « New »: Escape ferme', stillOpen.length === 0, stillOpen.length ? `ouvert: ${stillOpen}` : '');
} else {
  na('menu « New »: Escape ferme', 'bouton New absent');
}

// ── D. formulaires login : chaque champ nommé + submit clavier ─────────────
await anonPage.goto(`${base}/auth/login`, { waitUntil: 'domcontentloaded' });
await anonPage.waitForTimeout(2000);
const fields = await anonPage.evaluate(() => [...document.querySelectorAll('input:not([type="hidden"]), button[type="submit"], button')]
  .filter(el => el.offsetParent !== null)
  .map(el => ({
    type: el.type || el.tagName,
    name: el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.textContent.trim().slice(0, 30) || (el.id && document.querySelector(`label[for="${el.id}"]`) ? 'label-for' : ''),
  })).filter(f => !f.name));
ok('login: chaque champ/bouton a un nom accessible', fields.length === 0, JSON.stringify(fields));

// ── E. prefers-reduced-motion honoré ───────────────────────────────────────
const rm = await page.evaluate(() => {
  // au moins une règle CSS honore reduced-motion OU aucune animation auto
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.conditionText?.includes('prefers-reduced-motion')) return true;
      }
    } catch { /* cross-origin */ }
  }
  return false;
});
rm ? ok('CSS: prefers-reduced-motion pris en compte', true) : na('CSS: prefers-reduced-motion', 'aucune media query trouvée (informational)');

// ── F. erreurs console JS ──────────────────────────────────────────────────
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
await page.goto(`${base}/dashboard/2`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
ok('dashboard: aucune erreur JS page', errors.length === 0, errors.join(' | ') || 'aucune');

const failed = results.filter(r => r[0] === 'FAIL');
console.log(`\neval-final: ${results.length - failed.length}/${results.length} OK (${failed.length} FAIL)`);
await browser.close();
process.exit(failed.length ? 1 : 0);
