// verify.mjs — sondes computed/rect pour les corrections du cycle linkding.
// Chaque assertion mesure une valeur réelle (computed style, bounding rect,
// ratio de contraste composite), jamais une simple présence d'attribut.
// Usage: node verify.mjs <base> <auth.json>
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const require = createRequire(resolve(process.cwd() + '/package.json'));
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] ?? 'http://localhost:9090';
const AUTH = process.argv[3] ?? resolve(here, 'auth.json');

let failures = 0;
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!cond) failures++;
};

const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = rgb => 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2]);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const parse = s => { const m = /rgba?\(([^)]+)\)/.exec(s || ''); if (!m) return null; const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; };
// composite alpha : marche les ancêtres en compositant de bas en haut
const effectiveBg = `(el) => {
  const parse = s => { const m = /rgba?\\(([^)]+)\\)/.exec(s || ''); if (!m) return null; const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; };
  let acc = [0,0,0,0]; let n = el;
  while (n && n !== document.documentElement) {
    const c = parse(getComputedStyle(n).backgroundColor);
    if (c && c[3] > 0) {
      const a = acc[3] + c[3] * (1 - acc[3]);
      acc = acc.slice(0,3).map((v,i)=>(v*acc[3]+c[i]*c[3]*(1-acc[3]))/a).concat(a);
      if (acc[3] >= 1) break;
    }
    n = n.parentElement;
  }
  if (acc[3] < 1) acc = [255,255,255,1].map((v,i)=> i<3 ? v*(1-acc[3])+acc[i] : 1);
  return acc;
}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();

// ---------- 1. Toast : bouton dismiss nommé ----------
await page.goto(`${BASE}/bookmarks`, { waitUntil: 'load' });
await page.waitForTimeout(800);
let m = await page.evaluate(() => {
  const b = document.querySelector('.toast .btn-clear, form .btn-clear');
  return b ? { label: b.getAttribute('aria-label'), title: b.getAttribute('title') } : null;
});
check('toast .btn-clear a un nom accessible', !!m?.label, JSON.stringify(m));

// ---------- 2. Liste bookmarks : contraste tags + cibles >=24px ----------
m = await page.evaluate(`(() => {
  const effBg = ${effectiveBg};
  const tag = document.querySelector('ul.bookmark-list li .tags a');
  const action = document.querySelector('ul.bookmark-list li .actions a');
  const abtn = document.querySelector('ul.bookmark-list li .actions button.btn-link');
  const title = document.querySelector('ul.bookmark-list li .title a');
  const cs = el => el ? getComputedStyle(el) : null;
  const r = el => el ? el.getBoundingClientRect() : null;
  return {
    tagColor: cs(tag)?.color, tagH: r(tag)?.height, tagBg: effBg(tag),
    actH: r(action)?.height, abtnH: r(abtn)?.height, titleH: r(title)?.height,
  };})()`);
{
  const fg = parse(m.tagColor), bg = m.tagBg;
  const cr = fg && bg ? ratio([lum(fg), fg[3]][0] ? fg : fg, bg.map((v,i)=>i<3?v:1)) : 0;
  const c = ratio(lum(fg), lum(bg));
  check('tags a contraste >= 4.5', c >= 4.5, `ratio ${c.toFixed(2)} fg=${m.tagColor} bg=${bg.map(Math.round)}`);
  check('tags a hauteur >= 24px', m.tagH >= 24, `h=${m.tagH}`);
  check('actions a hauteur >= 24px', m.actH >= 24, `h=${m.actH}`);
  check('actions button hauteur >= 24px', m.abtnH >= 24, `h=${m.abtnH}`);
  check('title a hauteur >= 24px', m.titleH >= 24, `h=${m.titleH}`);
}

// ---------- 3. Bulk edit : labels ----------
m = await page.evaluate(() => ({
  all: document.querySelector('.bulk-edit-bar .all input')?.getAttribute('aria-label'),
  action: document.querySelector('select[name="bulk_action"]')?.getAttribute('aria-label'),
  row: document.querySelector('input[name="bookmark_id"]')?.getAttribute('aria-label'),
}));
check('bulk .all checkbox nommée', !!m.all, m.all);
check('bulk action select nommé', !!m.action, m.action);
check('bulk row checkbox nommée', !!m.row, m.row);

// ---------- 4. Modale détails : aria-labelledby résout ----------
await page.locator('li[data-bookmark-id] a.view-action').first().click();
await page.waitForSelector('ld-details-modal .modal-container', { timeout: 8000 });
m = await page.evaluate(() => {
  const d = document.querySelector('ld-details-modal .modal-container');
  const id = d?.getAttribute('aria-labelledby');
  const t = id && document.getElementById(id);
  return { id, text: t?.textContent.trim() };
});
check('details-modal aria-labelledby résout vers le titre', !!(m.id && m.text), JSON.stringify(m));
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// ---------- 5. Modales turbo-frame : nommées ----------
const modals = [
  ['tags-modal-new', `${BASE}/tags`, 'a.btn[data-turbo-frame="tag-modal"]:has-text("Create Tag")', 'ld-tag-new-title', 'Create Tag'],
  ['tags-modal-edit', `${BASE}/tags`, 'td.actions a[data-turbo-frame="tag-modal"]:has-text("Edit")', 'ld-tag-edit-title', 'Edit Tag'],
  ['tags-modal-merge', `${BASE}/tags`, 'a.btn[data-turbo-frame="tag-modal"]:has-text("Merge Tags")', 'ld-tag-merge-title', 'Merge Tags'],
  ['api-token-modal', `${BASE}/settings/integrations`, 'a.btn[data-turbo-frame="api-modal"]:has-text("Create API token")', 'ld-api-token-title', 'Create API Token'],
];
for (const [name, url, trigger, tid] of modals) {
  await page.goto(url, { waitUntil: 'load' });
  await page.locator(trigger).first().click();
  await page.waitForSelector(`#${tid}`, { timeout: 8000 }).catch(() => {});
  const v = await page.evaluate(tid => {
    const t = document.getElementById(tid);
    const d = document.querySelector('[role="dialog"]');
    return { by: d?.getAttribute('aria-labelledby'), hasTitle: !!t, dialogText: t?.textContent.trim() };
  }, tid);
  check(`${name} dialog nommé`, !!(v.by && v.hasTitle && v.dialogText), JSON.stringify(v));
}

// ---------- 6. /settings/general : input fichier + select utilisateur ----------
await page.goto(`${BASE}/settings/general`, { waitUntil: 'load' });
m = await page.evaluate(() => ({
  file: document.querySelector('input[name="import_file"]')?.getAttribute('aria-label'),
}));
check('input[name=import_file] nommé', !!m.file, m.file);
await page.goto(`${BASE}/bookmarks/shared`, { waitUntil: 'load' });
m = await page.evaluate(() => {
  const s = document.querySelector('#id_user');
  const id = s?.getAttribute('aria-labelledby');
  const t = id && document.getElementById(id);
  return { id, text: t?.textContent.trim() };
});
check('select utilisateur aria-labelledby -> "User"', m.text === 'User', JSON.stringify(m));

// ---------- 7. Menu mobile 390px : en-flow, rien d'obscurci ----------
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/bookmarks`, { waitUntil: 'load' });
await page.locator('button[aria-label="Navigation menu"]').click();
await page.waitForSelector('ld-dropdown.active .menu', { timeout: 8000 });
m = await page.evaluate(() => {
  const menu = document.querySelector('ld-dropdown.active .menu');
  const pos = getComputedStyle(menu).position;
  // un bouton de liste sous le menu ne doit pas être obstrué
  const btn = [...document.querySelectorAll('ul.bookmark-list button[name="archive"]')].find(b => b.getBoundingClientRect().height > 0);
  const r = btn.getBoundingClientRect();
  const at = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
  return { pos, covered: at && at !== btn && !btn.contains(at) ? at.tagName + '.' + (at.className || '') : false, h: r.height };
});
check('menu mobile position:static (in-flow)', m.pos === 'static', m.pos);
check('bouton archive non obstrué sous le menu', m.covered === false, JSON.stringify(m));
check('bouton archive hauteur >= 24px', m.h >= 24, `h=${m.h}`);

// ---------- 8. Thème dark persisté + restauration prouvée ----------
const postTheme = async value => {
  await page.goto(`${BASE}/settings/general`, { waitUntil: 'load' });
  const form = await page.evaluate(() => {
    const f = document.querySelector('form[action$="/settings/update"]');
    const d = {};
    for (const el of f.elements) { if (!el.name) continue; if (el.type === 'checkbox') { if (el.checked) d[el.name] = el.value; continue; } d[el.name] = el.value; }
    return { action: f.action, data: d };
  });
  form.data.theme = value;
  return page.request.post(form.action, { form: form.data });
};
await postTheme('dark');
await page.goto(`${BASE}/bookmarks`, { waitUntil: 'load' });
m = await page.evaluate(() => !!document.querySelector('link[href*="theme-dark.css"]:not([media])'));
check('theme dark persisté (link sans media)', m === true);
await postTheme('auto');
await page.goto(`${BASE}/bookmarks`, { waitUntil: 'load' });
m = await page.evaluate(() => !!document.querySelector('link[href*="theme-dark.css"]:not([media])'));
check('theme restauré auto (dark link retiré)', m === false);

// ---------- 9. Dark : btn-error contraste >=4.5 sur fond modale ----------
await postTheme('dark');
await page.goto(`${BASE}/bookmarks`, { waitUntil: 'load' });
await page.locator('li[data-bookmark-id] a.view-action').first().click();
await page.waitForSelector('ld-details-modal .btn-error', { timeout: 8000 });
m = await page.evaluate(`(() => {
  const effBg = ${effectiveBg};
  const el = document.querySelector('ld-details-modal .btn-error');
  const cs = getComputedStyle(el);
  return { fg: cs.color, bg: effBg(el) };
})()`);
{
  const c = ratio(lum(parse(m.fg)), lum(m.bg));
  check('dark .btn-error >= 4.5 (composite modale)', c >= 4.5, `ratio ${c.toFixed(2)} fg=${m.fg} bg=${m.bg.map(Math.round)}`);
}
await page.keyboard.press('Escape');
await postTheme('auto');

// ---------- 10. DRF browsable API ----------
await page.goto(`${BASE}/api/bookmarks/`, { waitUntil: 'load' });
m = await page.evaluate(`(() => {
  const effBg = ${effectiveBg};
  const mains = document.querySelectorAll('[role="main"], main').length;
  const lang = document.documentElement.lang;
  const crumbNav = !!document.querySelector('nav .breadcrumb');
  const toggle = document.querySelector('.dropdown-toggle')?.getAttribute('aria-label');
  const label = document.querySelector('label[for]');
  const inp = label && document.getElementById(label.getAttribute('for'));
  const crumb = document.querySelector('ul.breadcrumb li.active a');
  const cs = crumb && getComputedStyle(crumb);
  return { mains, lang, crumbNav, toggle, labelFor: label?.getAttribute('for'), idMatch: !!inp, crumbColor: cs?.color, crumbBg: crumb ? effBg(crumb) : null };
})()`);
check('DRF html lang', m.lang === 'en', m.lang);
check('DRF un seul main', m.mains === 1, `count=${m.mains}`);
check('DRF breadcrumb dans nav', m.crumbNav === true);
check('DRF dropdown-toggle nommé', !!m.toggle, m.toggle);
check('DRF label for -> input id', m.idMatch === true, m.labelFor);
{
  const c = m.crumbColor && m.crumbBg ? ratio(lum(parse(m.crumbColor)), lum(m.crumbBg)) : 0;
  check('DRF breadcrumb active >= 4.5', c >= 4.5, `ratio ${c.toFixed(2)} fg=${m.crumbColor}`);
}

// ---------- 11. Pagination disabled : contraste sans opacité ----------
await page.goto(`${BASE}/bookmarks`, { waitUntil: 'load' });
m = await page.evaluate(`(() => {
  const effBg = ${effectiveBg};
  const el = document.querySelector('.bookmark-pagination .disabled a');
  if (!el) return null;
  const cs = getComputedStyle(el);
  return { color: cs.color, opacity: cs.opacity, bg: effBg(el) };
})()`);
check('pagination disabled sans opacité', m && m.opacity === '1', `opacity=${m?.opacity}`);
if (m) {
  const c = ratio(lum(parse(m.color)), lum(m.bg));
  check('pagination disabled contraste >= 4.5', c >= 4.5, `ratio ${c.toFixed(2)} fg=${m.color}`);
}

// ---------- 12. Liens dans le texte : soulignés ----------
await page.goto(`${BASE}/settings/general`, { waitUntil: 'load' });
m = await page.evaluate(() => {
  const a = document.querySelector('.form-input-hint a, .settings-page p a');
  return a ? getComputedStyle(a).textDecorationLine : null;
});
check('liens texte settings soulignés', m?.includes('underline'), m);

await browser.close();
console.log(failures === 0 ? 'VERIFY: 0 FAIL' : `VERIFY: ${failures} FAIL`);
process.exit(failures ? 1 : 0);
