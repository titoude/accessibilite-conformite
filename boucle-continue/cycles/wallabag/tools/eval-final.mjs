// eval-final.mjs — évaluation INDÉPENDANTE du cycle 38 (wallabag @ 496db5b).
// Pages et interactions NON couvertes par le périmètre figé ni par verify.mjs,
// plus rejoue d'assertions sur des corrections réelles.
// Usage: node eval-final.mjs <baseUrl> <auth.json>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(process.cwd() + '/package.json');
const { chromium } = require('playwright');
const AXE_SRC = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const AXE_TAGS = ['wcag2a', 'wcag2a-best-practice', 'wcag2aa', 'wcag2aa-best-practice', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
async function runAxe(page) {
  await page.evaluate(AXE_SRC);
  return page.evaluate(tags => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }), AXE_TAGS);
}

const BASE = (process.argv[2] || 'http://127.0.0.1:8038');
const AUTH = process.argv[3] || 'auth.json';
let failures = 0;
const ok = (n, c, d = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n}${d ? ' — ' + d : ''}`); if (!c) failures++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();
const VIS = `const vis = el => !!(el.offsetParent || el.offsetWidth || el.offsetHeight);`;

// A. Pages hors périmètre — axe brut (état froid : aucune préparation d'état)
// /site-credentials est volontairement exclu : voter LIST_SITE_CREDENTIALS -> 404 pour le seed user
const EXTRA = ['/tag/list/wallabag', '/tag/list/howto',
  '/users/1/edit', '/tagging-rule/edit/1',
  '/import/delicious', '/import/elcurator', '/import/firefox', '/import/instapaper',
  '/import/omnivore', '/import/pinboard', '/import/pocket', '/import/readability', '/import/wallabag-v1',
  '/all/list/1?view=card', '/profile/change-password', '/profile/edit'];
for (const path of EXTRA) {
  const resp = await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const status = resp ? resp.status() : 0;
  const res = await runAxe(page);
  const titles = res.violations.map(v => `${v.id}(${v.nodes.length})`).join(',');
  ok(`axe 0 violation ${path}`, status < 400 && res.violations.length === 0, `${status} ${titles}`.slice(0, 160));
}

// B. Page d'erreur 404 (template d'exception corrigé : <main>→div, h5→h1)
const resp404 = await page.goto(BASE + '/this-page-does-not-exist', { waitUntil: 'load' });
await page.waitForTimeout(1200);
{
  const res = await runAxe(page);
  const r = await page.evaluate(`(() => {${VIS}
    return { h1: [...document.querySelectorAll('h1')].filter(vis).length, mains: [...document.querySelectorAll('main')].filter(vis).length };})()`);
  ok('404 : statut + axe 0 + h1', resp404.status() === 404 && res.violations.length === 0 && r.h1 >= 1,
     `${resp404.status()} viol=${res.violations.map(v=>v.id).join(',')} ${JSON.stringify(r)}`);
}

// C. Ids dupliqués (même logique que axe duplicate-id-aria) sur pages hors périmètre
for (const path of ['/edit/3', '/users/1/edit', '/tag/list/wallabag', '/search/1?search%5Bterm%5D=wallabag']) {
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const dups = await page.evaluate(`(() => {${VIS}
    const REL = 'a[href],button,input:not([type=hidden]),select,textarea,[tabindex],[role],audio,video,area,iframe,object,svg,summary,[contenteditable]';
    const ids = [...document.querySelectorAll('[id]')].filter(e => e.matches(REL)).map(e => e.id);
    const seen = new Set(); const dup = {};
    for (const id of ids) { if (seen.has(id)) dup[id] = (dup[id] || 1) + 1; seen.add(id); }
    return dup;})()`);
  ok(`ids dupliqués ${path}`, Object.keys(dups).length === 0, JSON.stringify(dups).slice(0, 160));
}

// D. Rejoue à froid : panneau recherche ouvert (dispatchEvent Materialize) → h1 présent
await page.goto(BASE + '/unread/list/1', { waitUntil: 'load' });
await page.waitForTimeout(1200);
{
  const trigger = page.locator('.nav-panels button[data-action*="showSearch"], .nav-panels [data-action*="topbar#showSearch"]').first();
  await trigger.dispatchEvent('click');
  await page.waitForSelector('form.nav-panel-search', { state: 'visible', timeout: 5000 }).catch(() => {});
  const r = await page.evaluate(`(() => {${VIS}
    const visibleH1 = [...document.querySelectorAll('h1')].filter(vis).length;
    const panelH1 = document.querySelector('form.nav-panel-search h1');
    const a11yH1 = [...document.querySelectorAll('h1')].filter(h => { const cs = getComputedStyle(h); return cs.display !== 'none' && cs.visibility !== 'hidden' && !h.closest('[style*="display: none"], [hidden]'); }).length;
    return { visibleH1, a11yH1, panelH1: !!panelH1 };})()`);
  ok('panneau recherche : >=1 h1 accessible', r.a11yH1 >= 1 && r.panelH1, JSON.stringify(r));
}

// E. Rejoue à froid : une carte archivée — vignette mutée, texte intact
await page.goto(BASE + '/all/list/1', { waitUntil: 'load' });
await page.waitForTimeout(1200);
{
  const r = await page.evaluate(`(() => {${VIS}
    const card = document.querySelector('.card-stacked.archived, .card.archived');
    if (!card) return { card: false };
    const prev = card.querySelector('.preview');
    const title = card.querySelector('.card-title, .card-content a');
    return { card: true, prev: prev ? parseFloat(getComputedStyle(prev).opacity) : 'none',
             title: title ? parseFloat(getComputedStyle(title).opacity) : 'none' };})()`);
  ok('archivée : vignette 0.5 / texte 1.0', r.card && parseFloat(r.prev) === 0.5 && parseFloat(r.title) === 1, JSON.stringify(r));
}

// F. Rejoue : le dropdown compte expose des liens contrastés (ouvert via Materialize)
await page.locator('.nav-panels a[data-target="dropdown-account"], .nav-panels .dropdown-trigger[data-target="dropdown-account"]').first().dispatchEvent('click').catch(() => {});
await page.waitForSelector('#dropdown-account', { state: 'visible', timeout: 5000 }).catch(() => {});
{
  const r = await page.evaluate(`(() => {
    const d = document.querySelector('#dropdown-account');
    if (!d || getComputedStyle(d).display === 'none') return { open: false };
    const cs = getComputedStyle(d.querySelector('li > a'));
    return { open: true, color: cs.color };})()`);
  ok('dropdown compte ouvert + lien contrasté', r.open && r.color === 'rgb(0, 124, 145)', JSON.stringify(r));
}

// G. Public : /register et /resetting/request — h1 + lang + axe
const pub = await browser.newContext();
const p2 = await pub.newPage();
// /register/ -> 301 : l'inscription est désactivée dans ce banc (WALLABAG_REGISTRATION_ENABLED=0)
for (const path of ['/resetting/request', '/login']) {
  const resp = await p2.goto(BASE + path, { waitUntil: 'load' });
  await p2.waitForTimeout(1200);
  if (!resp || resp.status() >= 400) { ok(`public ${path} accessible`, false, `status ${resp?.status()}`); continue; }
  const res = await p2.evaluate(AXE_SRC).then(() => p2.evaluate(tags => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }), AXE_TAGS));
  const r = await p2.evaluate(`(() => {${VIS}
    return { h1: [...document.querySelectorAll('h1')].filter(vis).length, lang: document.documentElement.lang };})()`);
  ok(`public ${path} : axe 0 + h1 + lang`, res.violations.length === 0 && r.h1 >= 1 && r.lang !== '',
     `${res.violations.map(v => v.id).join(',')} ${JSON.stringify(r)}`);
}
await pub.close();

await browser.close();
console.log(`\n${failures === 0 ? 'EVAL FINAL : 0 FAIL' : failures + ' FAIL'}`);
process.exit(failures ? 1 : 0);
