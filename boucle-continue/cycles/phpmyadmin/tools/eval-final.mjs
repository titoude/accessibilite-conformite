// eval-final.mjs — évaluation INDÉPENDANTE du cycle 31 (phpmyadmin @ e7e3f96).
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

const BASE = (process.argv[2] || 'http://localhost:8080') + '/public/index.php?route=';
const AUTH = process.argv[3] || 'auth.json';
let failures = 0;
const ok = (n, c, d = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n}${d ? ' — ' + d : ''}`); if (!c) failures++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();
const VIS = `const vis = el => !!(el.offsetParent || el.offsetWidth || el.offsetHeight);`;

// A. Pages hors périmètre — axe brut (état froid : aucune préparation d'état)
const EXTRA = ['/server/collations', '/server/engines', '/server/variables',
  '/server/status', '/table/search&db=a11ydb&table=users', '/server/replication',
  // v4 : les 3 pages intégrées au scope — évaluation indépendante des
  // corrections (image-alt events, heading-order status/queries, contrastes)
  '/database/events&db=a11ydb', '/server/status/queries', '/preferences/navigation'];
for (const path of EXTRA) {
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  const res = await runAxe(page);
  const titles = res.violations.map(v => `${v.id}(${v.nodes.length})`).join(',');
  ok(`axe 0 violation ${path}`, res.violations.length === 0, titles.slice(0, 160));
}

// B. Ids dupliqués sur pages hors périmètre (même périmètre que axe duplicate-id-aria)
for (const path of EXTRA) {
  await page.goto(BASE + path, { waitUntil: 'load' }); await page.waitForTimeout(1500);
  const dups = await page.evaluate(`(() => {${VIS}
    const REL = 'a[href],button,input:not([type=hidden]),select,textarea,[tabindex],[role],audio,video,area,iframe,object,svg,summary,[contenteditable]';
    const ids = [...document.querySelectorAll('[id]')].filter(e => e.matches(REL)).map(e => e.id);
    const seen = new Set(); const dup = {};
    for (const id of ids) { if (seen.has(id)) dup[id] = (dup[id] || 1) + 1; seen.add(id); }
    return dup;})()`);
  ok(`ids dupliqués ${path}`, Object.keys(dups).length === 0, JSON.stringify(dups).slice(0, 160));
}

// C. Rejoue : navtree cibles >=24px sur une page hors périmètre
await page.goto(BASE + '/server/engines', { waitUntil: 'load' }); await page.waitForTimeout(2000);
const nav = await page.evaluate(`(() => {${VIS}
  const small = sel => [...document.querySelectorAll(sel)]
    .filter(e => { const r = e.getBoundingClientRect(); return vis(e) && (r.width < 23.5 || r.height < 23.5); }).length;
  return { t: small('a.hover_show_full'), i: small('#pma_navigation_tree div.block a'), h: small('#navipanellinks a') };})()`);
ok('navtree >= 24px (engines)', nav.t === 0 && nav.i === 0 && nav.h === 0, JSON.stringify(nav));

// D. Rejoue : modale "Add index" ouverte à froid — landmarks/aria
await page.goto(BASE + '/table/structure&db=a11ydb&table=users', { waitUntil: 'load' }); await page.waitForTimeout(2000);
await page.locator('input.add_index[type=submit]').click().catch(() => {});
await page.waitForSelector('.modal.show', { timeout: 8000 }).catch(() => {});
const modal = await page.evaluate(`(() => {${VIS}
  const m = document.querySelector('.modal.show');
  if (!m) return { open: false };
  const labelled = m.getAttribute('aria-labelledby');
  const h = labelled ? document.getElementById(labelled) : null;
  const focusables = m.querySelectorAll('button,input,select,textarea,a[href]').length;
  return { open: true, labelledby: labelled, title: !!(h && h.textContent.trim()), focusables };})()`);
ok('modale add-index ouverte + aria-labelledby', modal.open && modal.labelledby && modal.title, JSON.stringify(modal));

// E. Rejoue : quick settings modale — configFormDisplayTab dédupliqué
await page.locator('a[href*="page_settings"], #page_settings_icon, a[title*="Page settings"], .page_settings').first().click().catch(() => {});
await page.waitForTimeout(1500);
const cfd = await page.evaluate(`(() => {${VIS}
  const ids = [...document.querySelectorAll('[id^=configFormDisplayTab]')].map(e => e.id);
  const seen = new Set(); const dup = ids.filter(i => seen.has(i) || !seen.add(i));
  return { n: ids.length, dup, ids: ids.slice(0, 6) };})()`);
ok('configFormDisplayTab ids uniques', cfd.dup.length === 0, JSON.stringify(cfd));

// F. Rejoue : contrastes clés sur page hors périmètre (/server/variables a des badges)
const CONTRAST = `
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const parse = s => { const m = s.match(/rgba?\\((\\d+)[,\\s]+(\\d+)[,\\s]+(\\d+)(?:[,\\s\\/]+([\\d.]+))?/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
  const eff = el => { const chain = []; for (let n = el; n; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c[3] > 0) chain.push(c); }
    let comp = [255, 255, 255, 1];
    for (let i = chain.length - 1; i >= 0; i--) { const [r, g, b, a] = chain[i]; comp = [r * a + comp[0] * (1 - a), g * a + comp[1] * (1 - a), b * a + comp[2] * (1 - a), 1]; }
    return comp; };
  const ratio = (fg, bg) => { const l1 = lum(fg), l2 = lum(bg); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };`;
await page.goto(BASE + '/server/databases', { waitUntil: 'load' }); await page.waitForTimeout(1500);
const rc = await page.evaluate(`(() => {${VIS}${CONTRAST}
  const el = document.querySelector('.text-danger');
  return el ? ratio(parse(getComputedStyle(el).color), eff(el)) : null;})()`);
if (rc !== null) ok('text-danger >= 4.5 (databases)', rc >= 4.5, rc.toFixed(2));

await browser.close();
console.log(`\n${failures === 0 ? 'EVAL FINAL : 0 FAIL' : failures + ' FAIL'}`);
process.exit(failures ? 1 : 0);
