// eval-final.mjs — évaluation INDÉPENDANTE du cycle jenkins (@db0e0829).
// Pages et interactions NON couvertes par le périmètre figé ni par verify.mjs,
// plus rejoue d'assertions sur des corrections réelles.
// Usage: node eval-final.mjs <baseUrl> <auth.json>
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const require = createRequire(resolve(process.cwd() + '/package.json'));
const { chromium } = require('playwright');
const AXE_SRC = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const AXE_TAGS = ['wcag2a', 'wcag2a-best-practice', 'wcag2aa', 'wcag2aa-best-practice', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
async function runAxe(page) {
  await page.evaluate(AXE_SRC);
  return page.evaluate(tags => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }), AXE_TAGS);
}

const BASE = process.argv[2] || 'http://localhost:6042';
const AUTH = process.argv[3] || 'auth.json';
let failures = 0;
const ok = (n, c, d = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n}${d ? ' — ' + d : ''}`); if (!c) failures++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();
const VIS = `const vis = el => !!(el.offsetParent || el.offsetWidth || el.offsetHeight);`;

// A. Pages hors périmètre — axe brut (état froid)
const EXTRA = [
  '/job/webapp-deploy/lastBuild/changes',      // changelog d'un build
  '/job/webapp-deploy/lastSuccessfulBuild/',   // autre build référencé
  '/job/webapp-deploy/lastBuild/console',      // sortie console
  '/job/api-pipeline/lastBuild/changes',       // changelog pipeline
  '/job/nightly-backup/',                      // job échoué (autre état)
  '/job/nightly-backup/lastFailedBuild/',      // build en échec
  '/job/docs-build/',                          // autre job freestyle
  '/cli/',                                     // page CLI
  '/systemInfo',                               // infos système
  '/view/all/newJob',                          // création de job
  '/job/services/',                            // dossier
  '/manage',                                   // vue gestion (hors configure)
  // hors scope : /asynchPeople/ (404 sans async-people), testReport (plugin junit
  // absent), pipeline-syntax (plugin workflow-cps — même exclusion que blue-ocean)
  // pages intégrées au scope — évaluation indépendante des corrections
  '/', '/job/webapp-deploy/', '/manage/configure', '/configureSecurity/',
];
for (const path of EXTRA) {
  const res0 = await page.goto(BASE + path, { waitUntil: 'load' });
  if (!res0 || res0.status() >= 400) { ok(`axe ${path}`, false, `HTTP ${res0 && res0.status()}`); continue; }
  await page.waitForTimeout(1500);
  const res = await runAxe(page);
  const titles = res.violations.map(v => `${v.id}(${v.nodes.length})`).join(',');
  ok(`axe 0 violation ${path}`, res.violations.length === 0, titles.slice(0, 200));
}

// B. Ids dupliqués interactifs sur pages hors périmètre
for (const path of ['/job/webapp-deploy/configure', '/manage/configure', '/view/all/newJob']) {
  await page.goto(BASE + path, { waitUntil: 'load' }); await page.waitForTimeout(1500);
  const dups = await page.evaluate(`(() => {${VIS}
    const REL = 'a[href],button,input:not([type=hidden]),select,textarea,[tabindex],[role],audio,video,area,iframe,object,svg,summary,[contenteditable]';
    const ids = [...document.querySelectorAll('[id]')].filter(e => e.matches(REL) && vis(e)).map(e => e.id);
    const seen = new Set(); const dup = {};
    for (const id of ids) { if (seen.has(id)) dup[id] = (dup[id] || 1) + 1; seen.add(id); }
    return dup;})()`);
  ok(`ids dupliqués ${path}`, Object.keys(dups).length === 0, JSON.stringify(dups).slice(0, 160));
}

// C. Rejoue : menu utilisateur ouvert — items dans un landmark nommé
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(800);
await page.click('#root-action-UserAction');
await page.waitForSelector('.jenkins-dropdown', { state: 'visible', timeout: 8000 }).catch(() => {});
const um = await page.evaluate(() => {
  const d = document.querySelector('.jenkins-dropdown');
  const items = d ? d.querySelectorAll('a,button').length : 0;
  return { role: d?.getAttribute('role'), items };
});
ok('menu user ouvert + navigation', um.role === 'navigation' && um.items > 0, JSON.stringify(um));
await page.keyboard.press('Escape');

// D. Rejoue : formulaire de création de job — tous les champs nommés
await page.goto(BASE + '/view/all/newJob', { waitUntil: 'load' });
await page.waitForTimeout(800);
const nj = await page.evaluate(() => {
  const fields = [...document.querySelectorAll('input, select, textarea')]
    .filter(e => e.type !== 'hidden' && e.offsetParent);
  const unnamed = fields.filter(e => !(e.labels && e.labels.length) && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby'));
  return { total: fields.length, unnamed: unnamed.length, first: unnamed[0]?.outerHTML.slice(0, 80) };
});
ok('newJob : tous les champs nommés', nj.unnamed === 0, JSON.stringify(nj));

// E. Rejoue : mobile 390 — actions présentes, landmarks tenus
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(800);
const mob = await page.evaluate(() => ({
  mains: document.querySelectorAll('main').length,
  aside: !!document.querySelector('aside'),
  overflow: document.documentElement.scrollWidth <= 390 + 1,
}));
ok('mobile 390 : landmarks conservés', mob.mains === 1 && mob.aside, JSON.stringify(mob));
ok('mobile 390 : pas de débordement horizontal', mob.overflow === true, `scrollWidth=${mob.overflow}`);

// F. Rejoue : build paramétré — les contrôles du formulaire sont nommés
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(BASE + '/job/webapp-deploy/', { waitUntil: 'load' });
await page.waitForTimeout(800);
await page.click('#side-panel a[href*="build?"], #tasks a[href*="build?"]');
await page.waitForTimeout(1500);
const bp = await page.evaluate(() => {
  const fields = [...document.querySelectorAll('input, select, textarea')]
    .filter(e => e.type !== 'hidden' && e.offsetParent);
  const unnamed = fields.filter(e => !(e.labels && e.labels.length) && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby'));
  return { total: fields.length, unnamed: unnamed.map(e => e.name).slice(0, 4) };
});
ok('buildWithParameters : champs nommés', bp.unnamed.length === 0, JSON.stringify(bp));

// G. Rejoue : dialogue de confirmation de suppression (dialogue ARIA)
await page.goto(BASE + '/job/docs-build/', { waitUntil: 'load' });
await page.waitForTimeout(800);
const dlg = await page.evaluate(async () => {
  // le lien « Delete … » est un confirmation-link dont href='#': le cibler par texte+classe
  const a = [...document.querySelectorAll('#side-panel a')].find(x => /delete/i.test(x.innerText || '') && x.className.includes('confirmation-link'));
  if (!a) return { found: false };
  a.click();
  await new Promise(r => setTimeout(r, 900));
  // la modale Jenkins est un <dialog class="jenkins-dialog" open>; exclure la palette de commandes
  const d = document.querySelector('dialog.jenkins-dialog[open]');
  if (!d) return { found: false };
  return { found: true, role: d.getAttribute('role') || d.tagName, labelled: !!(d.getAttribute('aria-labelledby') || d.getAttribute('aria-label') || d.querySelector('h1,h2,.jenkins-dialog__title')) };
});
ok('dialogue suppression : ouvert + nommé', dlg.found === true && dlg.labelled === true, JSON.stringify(dlg));
await page.keyboard.press('Escape');

await browser.close();
console.log(failures === 0 ? 'EVAL FINAL : 0 FAIL' : `EVAL FINAL : ${failures} FAIL`);
process.exit(failures ? 1 : 0);
