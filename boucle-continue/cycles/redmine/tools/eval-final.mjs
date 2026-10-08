// eval-final.mjs — évaluation INDÉPENDANTE du cycle redmine (@10d61f8).
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

const BASE = process.argv[2] || 'http://localhost:5801';
const AUTH = process.argv[3] || 'auth.json';
let failures = 0;
const ok = (n, c, d = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n}${d ? ' — ' + d : ''}`); if (!c) failures++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();
const VIS = `const vis = el => !!(el.offsetParent || el.offsetWidth || el.offsetHeight);`;

// A. Pages hors périmètre — axe brut (état froid : aucune préparation d'état)
const EXTRA = [
  '/projects/office-website/activity',   // flux d'activité
  '/projects/office-website/issues/report', // rapport par statut
  '/admin/info',                         // infos système
  '/admin/plugins',                      // plugins
  '/enumerations',                       // enumerations admin
  '/issue_statuses',                     // statuts admin
  '/trackers',                           // trackers admin
  '/workflows',                          // matrice workflows
  '/my/password',                        // changement mot de passe
  '/account/lost_password',              // public : mot de passe perdu
  '/projects/office-website/roadmap',    // roadmap projet
  '/projects/office-website/settings',   // settings projet
  '/settings',                           // settings site
  '/issues/1/time_entries/new',          // log time
];
for (const path of EXTRA) {
  const res0 = await page.goto(BASE + path, { waitUntil: 'load' });
  if (!res0 || res0.status() >= 400) { ok(`axe ${path}`, false, `HTTP ${res0 && res0.status()}`); continue; }
  await page.waitForTimeout(1200);
  const res = await runAxe(page);
  const titles = res.violations.map(v => `${v.id}(${v.nodes.length})`).join(',');
  ok(`axe 0 violation ${path}`, res.violations.length === 0, titles.slice(0, 160));
}

// A2. Gate sudo-mode : /settings (et toute action admin protégée) rend
// form#sudo-form à la place de la page quand la session sudo amont a expiré
// (Redmine::Configuration['sudo_mode_timeout'], ~15 min). La page servie
// dépend donc de l'heure du login, PAS du patch — c'était la source du
// target-size flaky sur a.lost_password (W-v2-4). Le lien est désormais
// >=24px dans les DEUX rendus : on le mesure ici quand le gate s'affiche,
// et de façon déterministe sur /login en section D.
await page.goto(BASE + '/settings', { waitUntil: 'load' });
await page.waitForTimeout(800);
const sudo = await page.evaluate(() => {
  const a = document.querySelector('#sudo-form a.lost_password');
  return a ? { gate: true, h: Math.round(a.getBoundingClientRect().height * 10) / 10 }
           : { gate: false };
});
if (sudo.gate) ok('sudo-gate : a.lost_password >=24px', sudo.h >= 24, `h=${sudo.h}`);
else console.log('N-A  sudo-gate absent (session sudo valide) — /settings réel servi');

// B. Ids dupliqués interactifs sur pages hors périmètre
for (const path of ['/projects/office-website/activity', '/workflows', '/projects/office-website/roadmap']) {
  await page.goto(BASE + path, { waitUntil: 'load' }); await page.waitForTimeout(800);
  const dups = await page.evaluate(`(() => {${VIS}
    const REL = 'a[href],button,input:not([type=hidden]),select,textarea,[tabindex],[role],audio,video,area,iframe,object,svg,summary,[contenteditable]';
    const ids = [...document.querySelectorAll('[id]')].filter(e => e.matches(REL) && vis(e)).map(e => e.id);
    const seen = new Set(); const dup = {};
    for (const id of ids) { if (seen.has(id)) dup[id] = (dup[id] || 1) + 1; seen.add(id); }
    return dup;})()`);
  ok(`ids dupliqués ${path}`, Object.keys(dups).length === 0, JSON.stringify(dups).slice(0, 160));
}

// C. Rejoue : menu flyout mobile 390 — ouverture déterministe, items >=24px
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE + '/projects/office-website/issues?set_filter=1', { waitUntil: 'load' });
await page.locator('.mobile-toggle-button').click();
await page.waitForSelector('html.flyout-is-active', { state: 'attached', timeout: 8000 }).catch(() => {});
const mob = await page.evaluate(() => {
  const f = document.querySelector('.flyout-menu');
  const openCls = (document.documentElement.className + ' ' + (f?.className || ''));
  const items = f ? [...f.querySelectorAll('a,button')].filter(e => { const r = e.getBoundingClientRect(); return r.height > 0; }) : [];
  const small = items.filter(e => e.getBoundingClientRect().height < 24).length;
  const h1 = document.querySelector('#header h1');
  const cs = h1 && getComputedStyle(h1);
  return { openCls, items: items.length, small, h1disp: cs?.display };
});
ok('flyout ouvert + items >=24px', /active|_active/.test(mob.openCls) && mob.items > 0 && mob.small === 0, JSON.stringify(mob));
ok('h1 accessible à 390px', mob.h1disp !== 'none', mob.h1disp);
await page.keyboard.press('Escape');

// D. Rejoue : register public — labels for + pas de tabindex
await page.setViewportSize({ width: 1280, height: 720 });
const pub = await browser.newContext();
const ppage = await pub.newPage();
await ppage.goto(BASE + '/account/register', { waitUntil: 'load' });
const reg = await ppage.evaluate(() => {
  const unl = [...document.querySelectorAll('input:not([type=hidden]),select,textarea')]
    .filter(e => e.type !== 'submit' && !(e.labels && e.labels.length) && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby'));
  const tabs = [...document.querySelectorAll('[tabindex]')].map(e => e.getAttribute('tabindex'));
  return { unlabeled: unl.map(e => e.name || e.id).slice(0, 8), tabs };
});
ok('register : champs labellés', reg.unlabeled.length === 0, JSON.stringify(reg.unlabeled));
ok('register : pas de tabindex', reg.tabs.length === 0, JSON.stringify(reg.tabs));
// pin déterministe W-v2-4 : a.lost_password est TOUJOURS rendu sur /login
// (Setting.lost_password=1) — indépendant de la fenêtre sudo.
await ppage.goto(BASE + '/login', { waitUntil: 'load' });
const lph = await ppage.evaluate(() => {
  const a = document.querySelector('a.lost_password');
  return a ? Math.round(a.getBoundingClientRect().height * 10) / 10 : null;
});
ok('a.lost_password >=24px (/login)', lph !== null && lph >= 24, `h=${lph}`);
await pub.close();

// E. Rejoue : autocomplete watchers — le champ est injecté par le lien
// 'Search for watchers' (remote) dans le bloc #watchers de la page issue.
await page.goto(BASE + '/issues/6', { waitUntil: 'load' });
await page.locator('#watchers a[href*="watchers/new"], .search_for_watchers a').first().click().catch(() => {});
await page.waitForTimeout(1200);
const ac = await page.evaluate(() => {
  const s = document.querySelector('#user_search, #watchers input[type="text"], #watchers input:not([type="hidden"])');
  return s ? { id: s.id, role: s.getAttribute('role'), ac: s.getAttribute('aria-autocomplete'), name: s.getAttribute('aria-label') || s.labels?.length } : null;
});
ok('champ autocomplete watchers présent', ac !== null, JSON.stringify(ac));

// F. Rejoue : liste timelog — checkboxes nommées + th actions peuplé
await page.goto(BASE + '/projects/office-website/time_entries?set_filter=1', { waitUntil: 'load' });
const tl = await page.evaluate(() => ({
  cb: document.querySelector('input[name="ids[]"]')?.getAttribute('aria-label'),
  th: document.querySelector('th.buttons .visually-hidden')?.textContent.trim(),
}));
ok('timelog checkbox nommée', !!tl.cb, tl.cb);
ok('timelog th actions peuplé', !!tl.th, tl.th);

await browser.close();
console.log(failures === 0 ? 'EVAL FINAL : 0 FAIL' : `EVAL FINAL : ${failures} FAIL`);
process.exit(failures ? 1 : 0);
