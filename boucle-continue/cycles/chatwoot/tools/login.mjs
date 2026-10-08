// login.mjs — cycle 56 chatwoot : écrit tools/auth.json (storageState).
// Usage : BASE_URL=http://localhost:9700 node login.mjs
//   (ou : node login.mjs <base> <user> <pass>)
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(dirname(fileURLToPath(import.meta.url)), 'package.json'));
const { chromium } = require('playwright');

const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:9700';
const USER = process.argv[3] || process.env.CW_USER || 'admin@cycle56.local';
const PASS = process.argv[4] || process.env.CW_PASS || 'C56audit!Pwd';
const OUT = new URL('./auth.json', import.meta.url);

const browser = await chromium.launch();
const page = await (await browser.newContext({ locale: 'en-US' })).newPage();
await page.goto(`${BASE}/app/login`, { waitUntil: 'domcontentloaded' });
await page.locator('input[name="email_address"], input[type="email"], input[name="email"]').first().waitFor({ state: 'visible', timeout: 90000 });
await page.fill('input[name="email_address"], input[type="email"], input[name="email"]', USER);
await page.fill('input[type="password"], input[name="password"]', PASS);
await page.locator('button[type="submit"]').first().click();
// preuve : URL quitte /login vers le dashboard (SPA — attendre une route accounts/)
await page.waitForURL(/\/app\/accounts\/\d+/, { timeout: 60000 });
await page.waitForFunction(() => document.querySelector('header, nav, [class*="sidebar"]'), { timeout: 30000 });
await page.context().storageState({ path: fileURLToPath(OUT) });
console.log(`auth.json écrit (${BASE}, user=${USER})`);
await browser.close();
