// eval-final.mjs — cycle 8 filebrowser : vérifications fonctionnelles indépendantes
import { chromium } from 'playwright';
const BASE = 'http://localhost:8082';
let pass = 0, fail = 0;
const ok = (n, c, x='') => { c ? pass++ : fail++; console.log(`${c?'PASS':'FAIL'} ${n} ${x}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));

// 1. listing fichiers : items cliquables
await page.goto(BASE + '/files', { waitUntil: 'networkidle' });
ok('files list', await page.evaluate(() => document.querySelectorAll('.item[role="button"]').length > 0));

// 2. navigation dans un dossier (dblclick en mode singleClick off)
await page.dblclick('.item[data-dir="true"]');
await page.waitForLoadState('networkidle');
ok('dir nav', page.url().includes('/files/docs'), page.url());

// 3. settings profile : formulaire rempli + selects
await page.goto(BASE + '/settings/profile', { waitUntil: 'networkidle' });
ok('profile form', await page.evaluate(() => document.querySelectorAll('input[type=checkbox]').length >= 3 && document.querySelectorAll('select').length >= 2));

// 4. nav settings cliquable
await page.click('#nav a[href="/settings/global"]');
await page.waitForLoadState('networkidle');
ok('settings nav', page.url().includes('/settings/global'));

// 5. users table : th non vide
await page.goto(BASE + '/settings/users', { waitUntil: 'networkidle' });
ok('users table th', await page.evaluate(() => ![...document.querySelectorAll('th')].some(t => !t.textContent.trim() && !t.querySelector('.sr-only'))));

// 6. aucune erreur page
await page.goto(BASE + '/files', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
ok('no page errors', errors.length === 0, errors.join(' | ').slice(0, 200));

console.log(`\n${pass} PASS, ${fail} FAIL`);
await browser.close();
process.exit(fail ? 1 : 0);
