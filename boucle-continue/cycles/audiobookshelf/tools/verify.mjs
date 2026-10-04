// verify.mjs — audiobookshelf cycle 11 : assertions indépendantes des corrections
import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:8088/audiobookshelf';
const LIB = '/library/d1028418-a9db-4434-ac99-6bd380d90b89';
const ITEM = '/item/0cd6cfaa-b722-49a4-809c-89ce758b1f07';
let pass = 0, fail = 0;
const ok = (n, c, x = '') => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${x}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json' });
const page = await ctx.newPage();

// 1. landmarks sur page library : main unique + header + aside/nav nommé
await page.goto(BASE + LIB + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 20000 });
await page.waitForTimeout(2500);
ok('landmarks library', await page.evaluate(() => {
  const mains = document.querySelectorAll('main');
  const header = document.querySelector('header');
  const aside = document.querySelector('aside[aria-label]');
  const nav = document.querySelector('aside [role="navigation"], nav');
  const h1 = document.querySelectorAll('h1').length;
  return mains.length === 1 && !!header && !!aside && !!nav && h1 === 1;
}, ));

// 2. pas de contenu hors landmarks (règle region)
ok('region coverage', await page.evaluate(() => {
  const inLandmark = el => el.closest('main,header,footer,nav,aside,[role="main"],[role="banner"],[role="contentinfo"],[role="navigation"],[role="complementary"],[role="search"],[role="region"],[role="form"]');
  const bad = [...document.querySelectorAll('body *')].filter(e =>
    e.children.length === 0 && e.textContent.trim() && e.offsetParent !== null && !inLandmark(e));
  return bad.length === 0;
}));

// 3. ToggleSwitch (role=checkbox) : aria-checked rendu "true"/"false" (Vue 2 drop les falsy)
await page.goto(BASE + '/config/backups/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
ok('toggle aria-checked', await page.evaluate(() => {
  const ts = [...document.querySelectorAll('[role="switch"],[role="checkbox"][aria-checked]')];
  return ts.length >= 1 && ts.every(t => t.getAttribute('aria-checked') === 'true' || t.getAttribute('aria-checked') === 'false');
}));

// 4. labels sur les inputs des pages config
for (const u of ['/config/backups/', '/config/authentication/']) {
  await page.goto(BASE + u, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  ok(`inputs labelled ${u}`, await page.evaluate(() => {
    const bad = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]), select, textarea')].filter(i =>
      i.offsetParent !== null && !(i.id && document.querySelector(`label[for="${i.id}"]`)) && !i.closest('label') && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby'));
    return bad.length === 0;
  }));
}

// 5. th vides
for (const u of ['/config/users/', '/config/backups/', '/account/']) {
  await page.goto(BASE + u, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  ok(`th non vides ${u}`, await page.evaluate(() =>
    ![...document.querySelectorAll('th')].some(t => !t.textContent.trim() && !t.querySelector('.sr-only'))));
}

// 6. item page : cover img alt + un seul h1
await page.goto(BASE + ITEM + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
ok('item cover alt', await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')].filter(i => i.offsetParent !== null);
  return imgs.length > 0 && imgs.every(i => i.getAttribute('alt') !== null);
}));
ok('item single h1', await page.evaluate(() => {
  const h1s = [...document.querySelectorAll('h1')].filter(h => h.offsetParent !== null);
  return h1s.length === 1;
}));

// 7. liens icones nommés (github/discord config index)
await page.goto(BASE + '/config/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
ok('icon links named', await page.evaluate(() => {
  const bad = [...document.querySelectorAll('a')].filter(a =>
    a.offsetParent !== null && !a.textContent.trim() && !a.querySelector('img[alt]:not([alt=""])')
    && !(a.getAttribute('aria-label') || a.getAttribute('aria-labelledby') || a.getAttribute('title')));
  return bad.length === 0;
}));

// 8. contraste --color-success
ok('success contrast var', await page.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue('--color-success').trim() === '#2e7d32'));

// 9. page login : landmarks + labels associés (contexte non authentifié)
{
  const ctx2 = await browser.newContext();
  const p2 = await ctx2.newPage();
  await p2.goto(BASE + '/login/', { waitUntil: 'domcontentloaded' });
  await p2.waitForSelector('#login-username', { timeout: 20000 });
  await p2.waitForTimeout(1500);
  ok('login landmarks', await p2.evaluate(() => !!document.querySelector('main') && !!document.querySelector('header')));
  ok('login labels', await p2.evaluate(() => {
    const u = document.querySelector('#login-username'), p = document.querySelector('#login-password');
    return !!u && !!p && !!document.querySelector('label[for="login-username"]') && !!document.querySelector('label[for="login-password"]');
  }));
  await ctx2.close();
}

console.log(`\n${pass} PASS, ${fail} FAIL`);
await browser.close();
process.exit(fail ? 1 : 0);
