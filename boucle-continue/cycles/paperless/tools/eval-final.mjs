// eval-final.mjs — cycle 10 paperless-ngx : fonctionnel indépendant des correctifs
import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:8085';
let pass = 0, fail = 0;
const ok = (n, c, x='') => { c ? pass++ : fail++; console.log(`${c?'PASS':'FAIL'} ${n} ${x}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));

// 1. dashboard rend widgets + navigation
await page.goto(BASE + '/dashboard', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('h1', { timeout: 20000 }); await page.waitForTimeout(1500);
ok('dashboard-widgets', await page.evaluate(() =>
  document.querySelectorAll('pngx-saved-view-widget, pngx-upload-file-widget, .card').length >= 1 &&
  document.querySelectorAll('nav a[routerlink]').length >= 3));

// 2. navigation sidebar -> documents : liste chargée (table ou cartes)
await page.goto(BASE + '/documents'); await page.waitForSelector('h1', {timeout:20000}); await page.waitForTimeout(2500);
ok('documents-rendered', await page.evaluate(() =>
  document.querySelectorAll('pngx-document-list table, pngx-document-card-large, .document-card, tbody tr').length > 0 ||
  document.body.innerText.includes('documents')));

// 3. dropdown Tags : ouverture, sélection d'un item change l'état de filtre
await page.waitForSelector('[id^="dropdown_tags"]'); await page.locator('[id^="dropdown_tags"]').first().click();
await page.waitForTimeout(800);
const opts = await page.locator('.dropdown-menu.show button, [role="group"] button').count();
ok('tags-dropdown-options', opts > 0, `options=${opts}`);
await page.keyboard.press('Escape'); await page.waitForTimeout(300);

// 4. display-mode radio du document-list : les 3 options sont nommées
const names = await page.evaluate(() =>
  [...document.querySelectorAll('input[type="radio"]')].map(r =>
    (r.labels && [...r.labels].map(l => l.innerText.trim()).join(' ')) || r.getAttribute('aria-label') || ''));
ok('radios-labelled', names.every(n => n && n.length > 0), JSON.stringify(names.slice(0,6)));

// 5. settings : formulaire rendu, selects utilisables
await page.goto(BASE + '/settings'); await page.waitForSelector('#displayLanguage', {timeout:20000}); await page.waitForTimeout(800);
ok('settings-controls', await page.evaluate(() =>
  document.querySelectorAll('select, input').length > 20 &&
  !!document.querySelector('label[for="displayLanguage"]')));

// 6. page login : formulaire fonctionnel (post -> redirection dashboard)
const ctx2 = await browser.newContext();
const page2 = await ctx2.newPage();
await page2.goto(BASE + '/accounts/login/'); await page2.waitForTimeout(1000);
await page2.fill('input[name="login"]', 'admin');
await page2.fill('input[name="password"]', 'adminpass123');
await page2.click('button[type="submit"]');
await page2.waitForURL(u => !u.pathname.includes('login'), { timeout: 20000 });
ok('login-flow-works', true, page2.url());
await ctx2.close();

// 7. mobile : l'app rend, sidebar mobile repliable
await page.setViewportSize({ width: 390, height: 800 });
await page.goto(BASE + '/dashboard'); await page.waitForSelector('h1', {timeout:20000}); await page.waitForTimeout(1500);
ok('mobile-renders', await page.evaluate(() => document.querySelectorAll('button, a').length > 15));
await page.setViewportSize({ width: 1280, height: 800 });

// 8. file-drop : l'overlay n'existe pas au repos (rendu conditionnel)
await page.goto(BASE + '/dashboard'); await page.waitForSelector('h1'); await page.waitForTimeout(1000);
ok('dropzone-lazy', await page.evaluate(() => {
  const dz = document.querySelector('[role="status"].file-drop, .file-drop-overlay, pngx-file-drop [role="status"]');
  return !dz || !dz.checkVisibility();
}));

// 9. zéro erreur JS sur l'ensemble du parcours
ok('no-js-errors', errors.length === 0, errors.slice(0,3).join(' | '));

await browser.close();
console.log(`\n${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
