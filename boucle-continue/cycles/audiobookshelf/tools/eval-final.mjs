// eval-final.mjs — cycle 11 audiobookshelf : vérifications fonctionnelles indépendantes
import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:8088/audiobookshelf';
const LIB = '/library/d1028418-a9db-4434-ac99-6bd380d90b89';
const ITEM = '/item/0cd6cfaa-b722-49a4-809c-89ce758b1f07';
let pass = 0, fail = 0;
const ok = (n, c, x = '') => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${x}`); };

const browser = await chromium.launch();
const errors = [];

// 1. login réel : remplir le formulaire → arrive sur library
{
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push('login: ' + e));
  await p.goto(BASE + '/login/', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('#login-username', { timeout: 20000 });
  await p.fill('#login-username', 'root');
  await p.fill('#login-password', 'rootpass123');
  await p.click('button[type=submit], .abs-btn[type=submit]');
  await p.waitForURL('**/library/**', { timeout: 20000 }).catch(() => {});
  ok('login flow', p.url().includes('/library/'), p.url());
  await ctx.close();
}

const ctx = await browser.newContext({ storageState: 'auth.json' });
const page = await ctx.newPage();
page.on('pageerror', e => errors.push(String(e)));

// 2. library : items rendus
await page.goto(BASE + LIB + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 20000 });
await page.waitForTimeout(2500);
ok('library items', await page.evaluate(() =>
  document.querySelectorAll('.bookshelf-row a, [class*="bookshelf"] a, main a').length > 0));

// 3. item : titre + cover visibles
await page.goto(BASE + ITEM + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
ok('item renders', await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const img = document.querySelector('img[alt]');
  return !!h1 && !!img;
}));

// 4. toggle switch : le clic bascule aria-checked
await page.goto(BASE + '/config/backups/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[role="checkbox"][aria-checked]', { timeout: 20000 });
await page.waitForTimeout(1500);
const before = await page.getAttribute('[role="checkbox"][aria-checked]', 'aria-checked');
await page.click('[role="checkbox"][aria-checked]');
await page.waitForTimeout(600);
const after = await page.getAttribute('[role="checkbox"][aria-checked]', 'aria-checked');
ok('toggle flips', before !== after && (after === 'true' || after === 'false'), `${before}→${after}`);
await page.click('[role="checkbox"][aria-checked]'); // restaurer

// 5. navigation SPA : library → config conserve les landmarks
await page.goto(BASE + LIB + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 20000 });
await page.waitForTimeout(2000);
await page.goto(BASE + '/config/users/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('table, main', { timeout: 20000 });
await page.waitForTimeout(2000);
ok('spa landmarks persist', await page.evaluate(() =>
  !!document.querySelector('main') && !!document.querySelector('header')
  && !!document.querySelector('aside[aria-label], nav[aria-label], [role="navigation"][aria-label]')));

// 6. aucune erreur page cumulée
ok('no page errors', errors.length === 0, errors.join(' | ').slice(0, 200));

console.log(`\n${pass} PASS, ${fail} FAIL`);
await browser.close();
process.exit(fail ? 1 : 0);
