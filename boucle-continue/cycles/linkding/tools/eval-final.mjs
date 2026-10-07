// eval-final.mjs — évaluation INDÉPENDANTE du cycle linkding (@27b7303).
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

const BASE = process.argv[2] || 'http://localhost:9090';
const AUTH = process.argv[3] || 'auth.json';
let failures = 0;
const ok = (n, c, d = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n}${d ? ' — ' + d : ''}`); if (!c) failures++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();
const VIS = `const vis = el => !!(el.offsetParent || el.offsetWidth || el.offsetHeight);`;

// A. Pages hors périmètre — axe brut (état froid : aucune préparation d'état)
const EXTRA = [
  '/bookmarks?q=python',           // recherche avec résultats
  '/bookmarks?unread=yes',         // filtre unread
  '/bookmarks?q=!untagged',        // filtre untagged
  '/tags?q=a',                     // tags filtrés
  '/bundles/2/edit',               // autre bundle édité
  '/api/tags/',                    // DRF autre collection
  '/api/bundles/',                 // DRF autre collection
  '/api/bookmarks/1/',             // DRF bookmark détail
  '/api/user/profile/',            // DRF profile
  '/admin/bookmarks/bookmark/',    // admin changelist
  '/admin/auth/user/',             // admin users
  // pages intégrées au scope — évaluation indépendante des corrections
  '/bookmarks', '/tags', '/settings/general', '/api/bookmarks/',
];
for (const path of EXTRA) {
  const res0 = await page.goto(BASE + path, { waitUntil: 'load' });
  if (!res0 || res0.status() >= 400) { ok(`axe ${path}`, false, `HTTP ${res0 && res0.status()}`); continue; }
  await page.waitForTimeout(1200);
  const res = await runAxe(page);
  const titles = res.violations.map(v => `${v.id}(${v.nodes.length})`).join(',');
  ok(`axe 0 violation ${path}`, res.violations.length === 0, titles.slice(0, 160));
}

// B. Ids dupliqués interactifs sur pages hors périmètre
for (const path of ['/bookmarks?q=python', '/admin/bookmarks/bookmark/', '/api/bundles/']) {
  await page.goto(BASE + path, { waitUntil: 'load' }); await page.waitForTimeout(800);
  const dups = await page.evaluate(`(() => {${VIS}
    const REL = 'a[href],button,input:not([type=hidden]),select,textarea,[tabindex],[role],audio,video,area,iframe,object,svg,summary,[contenteditable]';
    const ids = [...document.querySelectorAll('[id]')].filter(e => e.matches(REL) && vis(e)).map(e => e.id);
    const seen = new Set(); const dup = {};
    for (const id of ids) { if (seen.has(id)) dup[id] = (dup[id] || 1) + 1; seen.add(id); }
    return dup;})()`);
  ok(`ids dupliqués ${path}`, Object.keys(dups).length === 0, JSON.stringify(dups).slice(0, 160));
}

// C. Rejoue : modale détails ouverte à froid — dialog nommé avec texte du titre
await page.goto(BASE + '/bookmarks', { waitUntil: 'load' });
await page.locator('li[data-bookmark-id] a.view-action').first().click();
await page.waitForSelector('ld-details-modal .modal-container', { timeout: 8000 }).catch(() => {});
const modal = await page.evaluate(`(() => {
  const d = document.querySelector('ld-details-modal .modal-container');
  if (!d) return { open: false };
  const id = d.getAttribute('aria-labelledby');
  const t = id && document.getElementById(id);
  return { open: true, named: !!(t && t.textContent.trim()), title: t && t.textContent.trim() };})()`);
ok('modale détails ouverte + nommée (rejoue)', modal.open && modal.named, JSON.stringify(modal));

// D. Rejoue : helptext mot de passe (aria-describedby résout)
await page.goto(BASE + '/change-password/', { waitUntil: 'load' });
const desc = await page.evaluate(() => {
  const el = document.querySelector('#id_new_password1');
  const id = el?.getAttribute('aria-describedby');
  const t = id && document.getElementById(id);
  return { id, exists: !!t, len: t?.textContent.trim().length };
});
ok('aria-describedby helptext résout', desc.exists && desc.len > 0, JSON.stringify(desc));

// E. Rejoue : menu mobile 390 in-flow — bouton sous-jacent cliquable
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE + '/bookmarks', { waitUntil: 'load' });
await page.locator('button[aria-label="Navigation menu"]').click();
await page.waitForSelector('ld-dropdown.active .menu', { timeout: 8000 });
const mob = await page.evaluate(() => {
  const menu = document.querySelector('ld-dropdown.active .menu');
  const pos = getComputedStyle(menu).position;
  const btn = [...document.querySelectorAll('ul.bookmark-list button[name="archive"]')].find(b => { const r = b.getBoundingClientRect(); return r.height > 0; });
  const r = btn.getBoundingClientRect();
  const at = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
  const covered = at && at !== btn && !btn.contains(at);
  // pas de cible <24px parmi les items du menu
  const small = [...menu.querySelectorAll('a,button')].filter(e => e.getBoundingClientRect().height < 24).length;
  return { pos, covered: !!covered, small };
});
ok('menu mobile in-flow + rien sous le menu', mob.pos === 'static' && mob.covered === false, JSON.stringify(mob));
ok('items menu >=24px', mob.small === 0, `small=${mob.small}`);

// F. Rejoue : tableau tags — lignes liées + pagination désactivée contrastée
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(BASE + '/tags', { waitUntil: 'load' });
const tg = await page.evaluate(() => {
  const rows = document.querySelectorAll('table.crud-table tbody tr').length;
  const el = document.querySelector('.bookmark-pagination .disabled a, .pagination .disabled a');
  return { rows, disabled: !!el };
});
ok('tags table lignes > 0', tg.rows > 0, `rows=${tg.rows}`);

await browser.close();
console.log(failures === 0 ? 'EVAL FINAL : 0 FAIL' : `EVAL FINAL : ${failures} FAIL`);
process.exit(failures ? 1 : 0);
