// Sonde scratch axe 4.14 — label-content-name-mismatch (WCAG 2.5.3) sur le
// cycle grocy fixer-v2. Le kit de cycle reste épinglé axe 4.13.0 ; cette sonde
// rejoue la faille trouvée par l'auditeur sous 4.14 pour prouver le fix.
// Usage: node lcnm-414.mjs <base> <auth.json>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(process.cwd() + '/package.json');
const { chromium } = require('playwright');
const AXE_SRC = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const AXE_VER = require('axe-core/package.json').version;
// Garde dur : la règle lcnm n'existe QUE sous axe >=4.11 (et le cycle épinglé
// est 4.13.0 où elle est expérimentale/désactivée). Cette sonde ne tourne que
// depuis un répertoire scratch avec `npm i axe-core@4.14` (resolve CWD) —
// sinon elle « passerait » trivialement sous 4.13 = faux PASS.
if (!/^4\.14\./.test(AXE_VER)) {
  console.error(`axe-core ${AXE_VER} résolu depuis ${require.resolve('axe-core/package.json')} — requis 4.14.x (scratch install, PAS le kit épinglé 4.13.0)`);
  process.exit(2);
}
const TAGS = ['wcag2a', 'wcag2a-best-practice', 'wcag2aa', 'wcag2aa-best-practice', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const BASE = process.argv[2] || 'http://localhost:8360';
const AUTH = process.argv[3] || 'auth.json';
let failures = 0;
const ok = (n, c, d = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n}${d ? ' — ' + d : ''}`); if (!c) failures++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();

const runAxe = async () => {
  await page.evaluate(AXE_SRC); // reinjecté après chaque navigation
  return page.evaluate(tags => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }), TAGS);
};
const lcnmOnly = res => res.violations.filter(v => v.id === 'label-content-name-mismatch');
const accProbe = async sel => {
  await page.evaluate(AXE_SRC);
  return page.evaluate(s => {
    const el = document.querySelector(s);
    if (!el) return { found: false };
    // accName-1.2 réduit : aria-label > aria-labelledby > contenu visible
    // (innerText : texte réellement rendu, exclut display:none)
    const vis = el.innerText.trim();
    const acc = el.getAttribute('aria-label')
      || (el.getAttribute('aria-labelledby')
          ? el.getAttribute('aria-labelledby').split(/\s+/)
              .map(id => document.getElementById(id)?.innerText.trim() ?? '').join(' ')
          : vis);
    return { found: true, acc, vis, contains: vis.length > 0 && acc.toLowerCase().includes(vis.toLowerCase()) };
  }, sel);
};

// ---- 1. Pages flaguées nav-link-collapse (12) + Font Size (4) + /transfer + /stockoverview ----
const PAGES = [
  // nav-link-collapse « Manage master data » en active-page (leçon isVisible :
  // le lien n'est flaggable que s'il est dans le viewport scrollé de la sidenav)
  '/products', '/locations', '/productgroups', '/quantityunits', '/shoppinglocations',
  '/taskcategories', '/userentities', '/userfields', '/userobjects', '/batteries',
  '/batterytracking', '/chores',
  // pages éditeur Summernote (bouton « Font Size » affichant « 13 ») — amont
  '/shoppinglist', '/product/1', '/recipe/1', '/equipment/1',
  // résidu F2 intégré au scope
  '/transfer',
  // page d'atterrissage : nav-link-collapse hors viewport -> scroll-fold
  '/stockoverview',
];
let lcnmTotal = 0, violTotal = 0;
for (const path of PAGES) {
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  // scroll-fold : pousser la sidenav à fond pour rendre les liens visibles
  await page.evaluate(() => { const n = document.querySelector('.navbar-sidenav'); if (n) n.scrollTop = 99999; });
  await page.waitForTimeout(400);
  const res = await runAxe();
  const l = lcnmOnly(res);
  lcnmTotal += l.reduce((a, v) => a + v.nodes.length, 0);
  violTotal += res.violations.reduce((a, v) => a + v.nodes.length, 0);
  const det = res.violations.map(v => `${v.id}(${v.nodes.length})`).join(',');
  ok(`axe4.14 ${path} : 0 label-content-name-mismatch`, l.length === 0, det.slice(0, 200) || 'clean');
}

// ---- 2. accName sondé contient le texte visible (nav-link-collapse) ----
await page.goto(BASE + '/products', { waitUntil: 'load' });
await page.waitForTimeout(1200);
let p = await accProbe('.nav-link-collapse');
ok('accName nav-link-collapse ⊇ visible', p.found && p.contains && p.vis.length > 0, JSON.stringify(p));

// ---- 3. productcard « Show more » (modale, produit à description) ----
await page.goto(BASE + '/stockoverview', { waitUntil: 'load' });
// triggers = .dropdown-item masqués -> click JS. « Cold cuts » (id 11) est le
// seul produit du seed démo à porter une description -> le toggle « Show more »
await page.evaluate(() => {
  (document.querySelector('.productcard-trigger[data-product-id="11"]')
    || document.querySelector('.productcard-trigger')).click();
});
await page.waitForSelector('#productcard-modal.show, .modal.show', { timeout: 10000 });
await page.waitForTimeout(700);
let toggle = await page.evaluate(() => ({
  found: !!document.querySelector('.modal.show a[data-toggle="collapse"][href="#productcard-product-description"]'),
}));
if (!toggle.found) {
  // fallback : itérer les autres produits (ouverture modale asynchrone)
  const ids = await page.evaluate(() =>
    [...document.querySelectorAll('.productcard-trigger')].map(t => t.dataset.productId).filter(Boolean));
  for (const id of ids) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await page.evaluate(pid => document.querySelector(`.productcard-trigger[data-product-id="${pid}"]`)?.click(), id);
    await page.waitForTimeout(1200);
    toggle = await page.evaluate(() => ({
      found: !!document.querySelector('.modal.show a[data-toggle="collapse"][href="#productcard-product-description"]'),
    }));
    if (toggle.found) break;
  }
}
p = await accProbe('.modal.show a[data-toggle="collapse"][href="#productcard-product-description"]');
ok('accName productcard toggle ⊇ visible (Show more/less)', p.found && p.contains, JSON.stringify(p));
const res3 = await runAxe();
ok('axe4.14 modale productcard : 0 lcnm', lcnmOnly(res3).length === 0, lcnmOnly(res3).map(v => v.nodes.length).join(',') || 'clean');

// ---- 4. Summernote « Font Size » : accName dynamique contient le visible ----
await page.goto(BASE + '/product/1', { waitUntil: 'load' });
await page.waitForSelector('.note-editor', { state: 'visible', timeout: 15000 });
await page.waitForTimeout(1500);
p = await accProbe('.note-editor button.dropdown-toggle[aria-label*="Font Size"], .note-editor button.dropdown-toggle[data-a11y-label]');
ok('accName Font Size ⊇ visible (taille courante)', p.found && p.contains && p.vis.length > 0, JSON.stringify(p));

// ---- 5. /transfer : select nommé (select-name) sous 4.14 ----
await page.goto(BASE + '/transfer', { waitUntil: 'load' });
await page.waitForTimeout(1200);
const res5 = await runAxe();
const selName = res5.violations.filter(v => v.id === 'select-name');
ok('axe4.14 /transfer : 0 select-name', selName.length === 0, selName.map(v => v.nodes.length).join(',') || 'clean');
p = await accProbe('#specific_stock_entry');
ok('accName select transfer non vide', p.found && p.acc.length > 0, JSON.stringify(p));

await browser.close();
console.log(`\naxe ${AXE_VER} scratch — lcnm=${lcnmTotal} occ, autres viol=${violTotal - lcnmTotal} occ cumulées, ${failures} FAIL`);
process.exit(failures ? 1 : 0);
