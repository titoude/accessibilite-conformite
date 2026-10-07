// Test idempotence du fix MutationObserver Summernote (cycle grocy F1c).
// Usage: node summernote-idem.mjs <base> <auth.json>
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const { chromium } = require('playwright');
const BASE = process.argv[2];
const AUTH = process.argv[3];
let failures = 0;
const ok = (n, c, d = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n}${d ? ' — ' + d : ''}`); if (!c) failures++; };
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();
const fsBtn = '.note-editor button.dropdown-toggle[aria-label*="Font Size"]';
const label = async () => page.evaluate(s => document.querySelector(s)?.getAttribute('aria-label') ?? null, fsBtn);
const vis = async () => page.evaluate(s => document.querySelector(s)?.innerText.trim() ?? null, fsBtn);

await page.goto(`${BASE}/product/1`, { waitUntil: 'load' });
await page.waitForSelector('.note-editor', { state: 'visible', timeout: 15000 });
await page.waitForTimeout(1500);
let l = await label(), v = await vis();
ok('initial accName composite', l && l.includes(v || 'Ø'), `acc="${l}" vis="${v}"`);

// 1. Changer la taille de police via le dropdown réel
await page.click(fsBtn);
await page.waitForSelector('.note-editor .dropdown-menu.show a, .note-editor .dropdown-menu.show button, .note-fontsize .dropdown-menu.show *', { timeout: 5000 }).catch(() => {});
await page.waitForTimeout(400);
const clicked = await page.evaluate(() => {
  const item = [...document.querySelectorAll('.note-editor .dropdown-menu.show [data-value], .note-editor .dropdown-menu.show a, .note-editor .dropdown-menu.show button')]
    .find(e => /^(18|24|36)$/.test(e.textContent.trim()));
  if (item) { item.click(); return item.textContent.trim(); }
  return null;
});
await page.waitForTimeout(800);
l = await label(); v = await vis();
ok('après changement taille : accName ⊇ visible et non empilé', l && v && l.includes(v) && (l.match(/—/g) || []).length === 1,
   `clicked=${clicked} acc="${l}" vis="${v}"`);

// 2. Rejouer un changement (idempotence sur re-fires de l'observer)
await page.evaluate(() => {
  const b = document.querySelector('.note-editor button.dropdown-toggle[aria-label*="Font Size"]');
  if (b) b.childNodes[0].textContent = ' 36 ';
});
await page.waitForTimeout(600);
l = await label(); v = await vis();
// ' — ' ne doit apparaître qu'une fois (pas d'empilement de préfixes)
ok('mutation texte → resync exact "36 — Font Size"', l === '36 — Font Size', `acc="${l}" vis="${v}"`);

// 3. Codeview toggle (ré-ouverture réelle de l'éditeur)
await page.evaluate(() => {
  const cv = document.querySelector('.note-editor button[data-original-title*="Code"], .note-editor .note-btn-codeview, .note-editor button[aria-label*="Code"]');
  if (cv) cv.click();
});
await page.waitForTimeout(800);
await page.evaluate(() => {
  const cv = document.querySelector('.note-editor button[data-original-title*="Code"], .note-editor .note-btn-codeview, .note-editor button[aria-label*="Code"]');
  if (cv) cv.click();
});
await page.waitForTimeout(800);
l = await label(); v = await vis();
ok('après codeview on/off : accName toujours composite', l && v && l.includes(v), `acc="${l}" vis="${v}"`);

// 4. Cas dur : destroy + re-init complet de summernote (le bloc a11y du patch
// ne tourne qu'au chargement — documenter le comportement réel)
await page.evaluate(() => {
  const $ta = window.$('textarea.wysiwyg-editor');
  try { $ta.summernote('destroy'); } catch (e) { return 'destroy:' + e.message; }
  $ta.summernote({ toolbar: [['font', ['fontsize']]] });
  return 'reinit-ok';
});
await page.waitForTimeout(1500);
const after = await page.evaluate(() => {
  const b = document.querySelector('.note-editor button.dropdown-toggle[aria-label*="Font Size"]');
  const ed = document.querySelector('.note-editable');
  return { btn: b ? b.getAttribute('aria-label') : null, ed: ed ? ed.getAttribute('aria-label') : null };
});
console.log('après destroy+reinit:', JSON.stringify(after));
// N-A informatif : re-init hors du cycle patch (initialisation inline summernote
// sans le bloc a11y grocy) — si btn est non composite c'est attendu, si composite
// l'observer a survécu. On ne FAIL pas : on documente.

await browser.close();
console.log(failures ? `${failures} FAIL` : '0 FAIL');
process.exit(failures ? 1 : 0);
