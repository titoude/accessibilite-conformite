// verify.mjs — assertions indépendantes du score axe (effect, not action).
// Cycle 31 — phpmyadmin @ e7e3f96. Usage: node verify.mjs <baseUrl> <auth.json>
// Chaque assertion cible un élément réellement corrigé du patch : un élément
// absent ou non trouvé = FAIL, jamais de catch muet.
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://localhost:8080') + '/public/index.php?route=';
const AUTH = process.argv[3] || 'auth.json';
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();

const PAGES = ['/', '/table/structure&db=a11ydb&table=users',
  '/sql&db=a11ydb&table=users&sql_query=' + encodeURIComponent('SELECT * FROM users'),
  '/database/structure&db=a11ydb', '/server/databases', '/server/privileges',
  '/table/export&db=a11ydb&table=users', '/database/search&db=a11ydb'];

const VIS = `const vis = el => !!(el.offsetParent || el.offsetWidth || el.offsetHeight);`;

// 1. Landmarks : un <main>#page_content, un <nav>#page_nav_icons, un <footer>
for (const path of PAGES.slice(0, 5)) {
  await page.goto(BASE + path, { waitUntil: 'load' }); await page.waitForTimeout(1500);
  const r = await page.evaluate(`(() => {${VIS}
    return {
      mains: [...document.querySelectorAll('main, [role=main]')].filter(vis).length,
      navIcons: document.querySelector('nav#page_nav_icons, #page_nav_icons[role=navigation]') !== null,
      navLabel: document.querySelector('#page_nav_icons')?.getAttribute('aria-label') || '',
      footer: [...document.querySelectorAll('footer, [role=contentinfo]')].filter(vis).length,
    };})()`);
  check(`landmarks ${path}`, r.mains === 1 && r.navIcons && r.footer >= 1, JSON.stringify(r));
}

// 2. Titres : un h1 visible dans main, aucun saut de niveau
for (const path of PAGES) {
  await page.goto(BASE + path, { waitUntil: 'load' }); await page.waitForTimeout(1500);
  const r = await page.evaluate(`(() => {${VIS}
    const h1 = [...document.querySelectorAll('main h1')].filter(vis);
    const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter(h => vis(h) && (h.innerText || '').trim()).map(h => +h.tagName[1]);
    let skips = 0;
    for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) skips++;
    return { h1: h1.length, skips, levels: levels.join('')};})()`);
  check(`h1+niveaux ${path}`, r.h1 >= 1 && r.skips === 0, JSON.stringify(r));
}

// 3. Ids uniques : createViewModal dédupliqué, navigation html dupliquée renommée,
//    moreActionsButton suffixé par ligne.
await page.goto(BASE + '/sql&db=a11ydb&table=users&sql_query=' + encodeURIComponent('SELECT * FROM users ORDER BY id ASC'), { waitUntil: 'load' });
await page.waitForTimeout(2500);
const r3 = await page.evaluate(`(() => {${VIS}
  const count = id => document.querySelectorAll('#' + id).length;
  const dup = {};
  const REL = 'a[href],button,input:not([type=hidden]),select,textarea,[tabindex],[role],audio,video,area,iframe,object,svg,summary,[contenteditable]';
  const ids = [...document.querySelectorAll('[id]')].filter(e => e.matches(REL)).map(e => e.id);
  const seen = new Set();
  for (const id of ids) { if (seen.has(id)) dup[id] = (dup[id] || 1) + 1; seen.add(id); }
  return {
    createViewModal: count('createViewModal'),
    sessionMax: count('sessionMaxRowsSelect') + count('sessionMaxRowsSelect_bottom'),
    filterRows: count('filterRows') + count('filterRows_bottom'),
    showAll: [...document.querySelectorAll('input.showAllRows')].length,
    dups: dup,
  };})()`);
check('createViewModal unique', r3.createViewModal <= 1, `count=${r3.createViewModal}`);
check('ids dupliqués (page sql results)', Object.keys(r3.dups).length === 0, JSON.stringify(r3.dups).slice(0, 200));

await page.goto(BASE + '/table/structure&db=a11ydb&table=users', { waitUntil: 'load' }); await page.waitForTimeout(2000);
const r3b = await page.evaluate(`(() => {${VIS}
  const REL = 'a[href],button,input:not([type=hidden]),select,textarea,[tabindex],[role],audio,video,area,iframe,object,svg,summary,[contenteditable]';
  const ids = [...document.querySelectorAll('[id]')].filter(e => e.matches(REL)).map(e => e.id);
  const seen = new Set(); const dup = {};
  for (const id of ids) { if (seen.has(id)) dup[id] = (dup[id] || 1) + 1; seen.add(id); }
  const mores = [...document.querySelectorAll('button[id^=moreActionsButton]')];
  return { dups: dup, mores: mores.length,
    moresOk: mores.every(b => /^moreActionsButton_[0-9]+$/.test(b.id)) };})()`);
check('ids dupliqués (table/structure)', Object.keys(r3b.dups).length === 0, JSON.stringify(r3b.dups).slice(0, 200));
check('moreActionsButton suffixés', r3b.mores === 0 || r3b.moresOk, `${r3b.mores} boutons`);

// 4. Target-size : navtree (hover_show_full, second.block>a, navipanellinks),
//    form-check-input, plusActionsButton.
await page.goto(BASE + '/', { waitUntil: 'load' }); await page.waitForTimeout(2500);
const r4 = await page.evaluate(`(() => {${VIS}
  const small = sel => [...document.querySelectorAll(sel)]
    .filter(e => { const r = e.getBoundingClientRect(); return vis(e) && (r.width < 23.5 || r.height < 23.5); }).length;
  return {
    treeName: small('a.hover_show_full'),
    treeIcon: small('#pma_navigation_tree div.block a, #pma_navigation_tree a.expander'),
    navIcons: small('#navipanellinks a'),
  };})()`);
check('navtree liens >= 24px', r4.treeName === 0 && r4.treeIcon === 0, JSON.stringify(r4));
check('navipanellinks >= 24px', r4.navIcons === 0, `${r4.navIcons}`);

await page.goto(BASE + '/server/export', { waitUntil: 'load' }); await page.waitForTimeout(1500);
const r4b = await page.evaluate(`(() => {${VIS}
  const bad = [...document.querySelectorAll('.form-check-input')]
    .filter(e => { const r = e.getBoundingClientRect(); return vis(e) && (r.width < 23.5 || r.height < 23.5); })
    .map(e => e.id || e.name).slice(0, 5);
  // occlusion : le centre de chaque input doit pointer vers l'input
  const covered = [...document.querySelectorAll('.form-check-input')].filter(e => {
    const r = e.getBoundingClientRect(); if (!vis(e)) return false;
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
    if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return false;
    const at = document.elementFromPoint(cx, cy);
    return at !== null && at !== e && !e.contains(at);
  }).length;
  return { bad, covered };})()`);
check('form-check-input >= 24px non couverts', r4b.bad.length === 0 && r4b.covered === 0, JSON.stringify(r4b));

// 5. Labels : checkboxes navtree/pagination + selects ont un label résolvable
await page.goto(BASE + '/sql&db=a11ydb&table=users&sql_query=' + encodeURIComponent('SELECT * FROM users ORDER BY id ASC'), { waitUntil: 'load' });
await page.waitForTimeout(2500);
const r5 = await page.evaluate(`(() => {${VIS}
  const need = [...document.querySelectorAll('input.showAllRows, select[id^=sessionMaxRowsSelect], input[id^=filterRows]')].filter(vis);
  const unl = need.filter(e => (e.labels?.length || 0) === 0).map(e => e.id || e.name);
  return { n: need.length, unl };})()`);
check('labels pagination/showAll', r5.n > 0 && r5.unl.length === 0, JSON.stringify(r5));

// 6. Contrastes mesurés (composite alpha) : text-danger, linenumbers, body-secondary
const CONTRAST = `
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const parse = s => { const m = s.match(/rgba?\\((\\d+)[,\\s]+(\\d+)[,\\s]+(\\d+)(?:[,\\s\\/]+([\\d.]+))?/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
  const eff = el => { let n = el, bg = [255, 255, 255, 0];
    const chain = [];
    for (; n; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c[3] > 0) chain.push(c); }
    let comp = [255, 255, 255, 1];
    for (let i = chain.length - 1; i >= 0; i--) { const [r, g, b, a] = chain[i]; comp = [r * a + comp[0] * (1 - a), g * a + comp[1] * (1 - a), b * a + comp[2] * (1 - a), 1]; }
    return comp; };
  const ratio = (fg, bg) => { const l1 = lum(fg), l2 = lum(bg); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };`;

await page.goto(BASE + '/table/structure&db=a11ydb&table=users', { waitUntil: 'load' }); await page.waitForTimeout(2000);
const r6 = await page.evaluate(`(() => {${VIS}${CONTRAST}
  const out = {};
  const td = document.querySelector('.text-danger');
  if (td) { const fg = parse(getComputedStyle(td).color); out.danger = ratio(fg, eff(td)); }
  const bs = document.querySelector('.text-body-secondary, .form-text');
  if (bs) { const fg = parse(getComputedStyle(bs).color); out.secondary = ratio(fg, eff(bs)); }
  return out;})()`);
if (r6.danger) check('text-danger >= 4.5', r6.danger >= 4.5, r6.danger.toFixed(2));
if (r6.secondary) check('text-body-secondary >= 4.5', r6.secondary >= 4.5, r6.secondary.toFixed(2));

await page.goto(BASE + '/sql&db=a11ydb&table=users', { waitUntil: 'load' }); await page.waitForTimeout(2500);
const r6b = await page.evaluate(`(() => {${CONTRAST}
  const ln = document.querySelector('.CodeMirror-linenumber');
  if (!ln) return null;
  const fg = parse(getComputedStyle(ln).color); return ratio(fg, eff(ln));})()`);
if (r6b !== null) check('CodeMirror linenumbers >= 4.5', r6b >= 4.5, r6b.toFixed(2));

// 7. Souligné : delete_row, Sort links dans th, .card-body a
const r7 = await page.evaluate(`(() => {${VIS}
  const bad = sel => [...document.querySelectorAll(sel)].filter(vis)
    .filter(a => !/underline/.test(getComputedStyle(a).textDecorationLine || getComputedStyle(a).textDecoration)).length;
  return { del: bad('td a.delete_row'), sort: bad('th a[title="Sort"]') };})()`);
check('delete_row souligné', r7.del === 0, `${r7.del}`);
check('th Sort souligné', r7.sort === 0, `${r7.sort}`);

// 8. CodeMirror screenReaderLabel
const r8 = await page.evaluate(`(() => {${VIS}
  const cm = document.querySelector('.CodeMirror');
  const ta = cm && cm.querySelector('textarea[aria-label], [aria-label]');
  return { cm: !!cm, labeled: !!(ta && (ta.getAttribute('aria-label') || '').length > 0) };})()`);
check('CodeMirror screenReaderLabel', r8.cm && r8.labeled, JSON.stringify(r8));

await browser.close();
const fails = results.filter(r => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} assertions PASS`);
process.exit(fails.length ? 1 : 0);
