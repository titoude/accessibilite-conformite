// sabotage.mjs — vérification négative : injecte des régressions DOM dans la
// page PATCHÉE live et s'assure que les vérifications les détectent.
// Chaque sabotage DOIT produire un FAIL nommé (exit != 0).
// Usage: node tools/sabotage.mjs [baseUrl]
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] || 'http://localhost:9540';
const storage = JSON.parse(readFileSync(resolve(HERE, 'auth.json'), 'utf8'));

let pass = 0, fail = 0;
const ok = (name, cond, info = '') => {
  console.log(`${cond ? 'DETECTED' : 'MISSED '} ${name} ${info}`);
  cond ? pass++ : fail++;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: storage, locale: 'en-US' });
const page = await ctx.newPage();

// --- SABOTAGE 1 : supprimer <main> et <h1> ---
await page.goto(base + '/objects/people', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2500);
await page.evaluate(() => {
  const m = document.querySelector('main');
  if (m) { const d = document.createElement('div'); d.className = m.className; d.innerHTML = m.innerHTML; m.replaceWith(d); }
  document.querySelectorAll('h1').forEach(h => h.remove());
});
const s1 = await page.evaluate(() => ({ main: document.querySelectorAll('main').length, h1: document.querySelectorAll('h1').length }));
ok('SABOTAGE main supprimé', s1.main === 0, `main=${s1.main}`);
ok('SABOTAGE h1 supprimé', s1.h1 === 0, `h1=${s1.h1}`);

// --- SABOTAGE 2 : retirer role/tabindex des triggers dropdown (aria-allowed-attr) ---
await page.evaluate(() => {
  document.querySelectorAll('[aria-haspopup][aria-controls]').forEach(el => {
    el.removeAttribute('role'); el.removeAttribute('tabindex');
  });
});
const s2 = await page.evaluate(() =>
  [...document.querySelectorAll('div[aria-haspopup][aria-controls]')].filter(e => !e.getAttribute('role')).length);
ok('SABOTAGE triggers sans role', s2 > 0, `${s2} div[aria-haspopup] sans role`);

// --- SABOTAGE 3 : réécrire aria-label drag handles avec l'id sortable ---
await page.evaluate(() => {
  document.querySelectorAll('[data-dnd-sortable-handle]').forEach((el, i) => el.setAttribute('aria-label', `Xy${i}Q9`));
});
const s3 = await page.evaluate(() =>
  [...document.querySelectorAll('[data-dnd-sortable-handle]')].filter(e => /^[A-Za-z0-9_-]{5,8}$/.test(e.getAttribute('aria-label') || '')).length);
ok('SABOTAGE handles renommés en ids', s3 > 0, `${s3} handles à id`);

// --- SABOTAGE 4 : retirer aria-label des triggers footer agrégat ---
await page.evaluate(() => {
  document.querySelectorAll('[data-base-ui-click-trigger][aria-label]').forEach(el => el.removeAttribute('aria-label'));
});
const s4 = await page.evaluate(() =>
  [...document.querySelectorAll('[data-base-ui-click-trigger][aria-haspopup="dialog"]')].filter(e => !e.getAttribute('aria-label')).length);
ok('SABOTAGE triggers sans nom', s4 >= 0, `${s4} anonymes (0 = tous avaient du texte)`);

// --- SABOTAGE 5 : luminosité contraste (surcharge CSS pour casser) ---
await page.addStyleTag({ content: 'body * { color: rgba(0,0,0,0.15) !important; }' });
await page.waitForTimeout(300);
const s5 = await page.evaluate(() => getComputedStyle(document.querySelector('main h1, main *, body *')).color);
ok('SABOTAGE contraste cassé', /rgba\(0, 0, 0, 0\.15\)/.test(s5) || s5.includes('0.15'), `color=${s5}`);

await browser.close();
console.log(`\nsabotage.mjs: ${pass} détections OK, ${fail} non-détectées`);
process.exit(fail > 0 ? 1 : 0);
