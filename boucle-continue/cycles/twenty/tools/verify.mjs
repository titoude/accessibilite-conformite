// verify.mjs — cycle 54 twenty. Assertions nommées sur l'app PATCHÉE live.
// Un élément non testable émet N-A (jamais un PASS muet).
// Usage: node tools/verify.mjs [baseUrl] [--storage-state tools/auth.json]
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
const base = args.find(a => !a.startsWith('--')) || 'http://localhost:9540';
const storagePath = opt('storage-state') || resolve(HERE, 'auth.json');
const seed = JSON.parse(readFileSync(resolve(HERE, 'seed-info.json'), 'utf8'));
const PERSON = `/object/person/${seed.records.person.id}`;
const COMPANY = `/object/company/${seed.records.company.id}`;

let pass = 0, fail = 0, na = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`PASS  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}  ${detail}`); }
};
const note = (name, detail = '') => { na++; console.log(`N-A   ${name}  ${detail}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: storagePath, locale: 'en-US' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));

const goto = async (url) => {
  await page.goto(base + url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2500);
};

// ---------- index records : main + h1 ----------
await goto('/objects/people');
ok('index: une seule balise <main>', await page.locator('main').count() === 1,
  `${await page.locator('main').count()}`);
ok('index: h1 présent dans le DOM', await page.locator('h1').count() >= 1,
  `${await page.locator('h1').count()}`);

// view-picker trigger (.sx5718n) doit porter role + tabindex (aria-allowed-attr)
const picker = await page.evaluate(() => {
  const el = document.querySelector('[aria-controls$="-options"][aria-haspopup]');
  if (!el) return null;
  return { role: el.getAttribute('role'), tab: el.getAttribute('tabindex'), tag: el.tagName };
});
if (!picker) note('view-picker role/tabindex', 'trigger absent');
else {
  ok('view-picker: role explicite', !!picker.role || ['BUTTON', 'A', 'INPUT'].includes(picker.tag), JSON.stringify(picker));
  ok('view-picker: focusable clavier', picker.tab !== null || ['BUTTON', 'A', 'INPUT'].includes(picker.tag), `tabindex=${picker.tab}`);
}

// handles de drag colonne : pas de role/tabindex si descendant interactif (nested-interactive)
const nested = await page.evaluate(() => {
  const bad = [];
  document.querySelectorAll('[data-dnd-sortable-handle]').forEach(el => {
    const inner = el.querySelector('button, [role="button"], a[href], input, [tabindex]');
    if (inner && (el.getAttribute('role') || el.getAttribute('tabindex') === '0')) {
      bad.push(el.className.slice(0, 30));
    }
  });
  return bad;
});
ok('header drag: pas de nested-interactive', nested.length === 0, JSON.stringify(nested.slice(0, 3)));

// handles de drag ligne : aria-label != id sortable (observeDragActivatorAccessibleName)
// handles = data-dnd-sortable-handle (tabs) ou activator role=button (rows)
const rowHandles = await page.evaluate(() =>
  [...document.querySelectorAll('[data-dnd-sortable-handle], [role="button"][aria-label^="Drag to reorder"]')]
    .map(el => el.getAttribute('aria-label'))
    .filter(Boolean));
const sortableIdPattern = /^[A-Za-z0-9_-]{5,8}$/;
const stillId = rowHandles.filter(l => sortableIdPattern.test(l));
ok('drag handles: aria-label != sortable id', rowHandles.length > 0 && stillId.length === 0,
  `${stillId.length}/${rowHandles.length} ids résiduels`);

// footer agrégat : triggers nommés (aria-command-name)
const agg = await page.evaluate(() =>
  [...document.querySelectorAll('[data-base-ui-click-trigger][aria-haspopup="dialog"]')]
    .filter(el => !el.getAttribute('aria-label') && !(el.textContent || '').trim()).length);
ok('aggregate footer: triggers nommés', agg === 0, `${agg} sans nom`);

// ---------- record show person : main + h1 + pas de double banner ----------
await goto(PERSON);
ok('record: une seule balise <main>', await page.locator('main').count() === 1,
  `${await page.locator('main').count()}`);
const banners = await page.evaluate(() =>
  [...document.querySelectorAll('header')].filter(h => {
    let n = h;
    while (n) { if (['MAIN', 'ARTICLE', 'ASIDE', 'NAV', 'SECTION'].includes(n.tagName)) return false; n = n.parentElement; }
    return true;
  }).length);
ok('record: un seul banner top-level', banners <= 1, `${banners} banners`);
ok('record: h1 présent', await page.locator('h1').count() >= 1,
  `${await page.locator('h1').count()}`);

// widget-card headers : triggers avec role (aria-allowed-attr .sbv3a8t/.s7cviji)
const widgetBad = await page.evaluate(() =>
  [...document.querySelectorAll('[aria-haspopup][aria-controls]')]
    .filter(el => !el.getAttribute('role') && !['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)).length);
ok('widget cards: triggers roletagés', widgetBad === 0, `${widgetBad} sans role`);

// ---------- settings : h1 + main ----------
await goto('/settings/profile');
ok('settings: un seul <main>', await page.locator('main').count() === 1);
ok('settings: h1 présent', await page.locator('h1').count() >= 1);

// ---------- command menu (ctrl+k) ----------
await goto('/objects/companies');
await page.keyboard.press('Control+k');
await page.waitForTimeout(1200);
const cmdk = await page.evaluate(() => ({
  dialog: !!document.querySelector('[role="dialog"], [cmdk-root], [class*="command"]'),
}));
if (!cmdk.dialog) note('command menu ouvert', 'aucun dialog détecté');
else ok('command menu s\'ouvre', true);
await page.keyboard.press('Escape');

// ---------- dark theme : contraste tokens ----------
await page.evaluate(() => localStorage.setItem('persistedColorSchemeState', '"DARK"'));
await goto('/objects/companies');
const darkContrast = await page.evaluate(() => {
  const parse = c => { const m = (c || '').match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] }; };
  const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = o => 0.2126 * srgb(o.r) + 0.7152 * srgb(o.g) + 0.0722 * srgb(o.b);
  const el = [...document.querySelectorAll('header *, main *')].find(e => {
    const s = getComputedStyle(e); return (e.innerText || '').trim() && s.color.includes('rgba') && e.children.length === 0;
  });
  if (!el) return null;
  const f = parse(getComputedStyle(el).color);
  let b = null, n = el;
  while (n && (!b || b.a === 0)) { b = parse(getComputedStyle(n).backgroundColor); n = n.parentElement; }
  if (!f || !b) return null;
  return +((Math.max(lum(f), lum(b)) + 0.05) / (Math.min(lum(f), lum(b)) + 0.05)).toFixed(2);
});
if (darkContrast == null) note('dark: contraste mesuré', 'aucun élément texte mesurable');
else ok('dark: contraste >= 4.5 mesuré', darkContrast >= 4.5, `${darkContrast}:1`);
await page.evaluate(() => localStorage.removeItem('persistedColorSchemeState'));

ok('aucune erreur console', errors.length === 0, errors[0]?.slice(0, 120));

await browser.close();
console.log(`\n${pass} PASS, ${fail} FAIL, ${na} N-A`);
process.exit(fail ? 1 : 0);
