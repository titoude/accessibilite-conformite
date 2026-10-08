#!/usr/bin/env node
// login.mjs — cycle 42 jenkins. Formulaire /login → storageState.
// Usage: node login.mjs <base> <out.json> [user] [pass]
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const [base, out, user = 'admin', pass = 'jk42-admin-pw'] = process.argv.slice(2);
if (!base || !out) { console.error('usage: node login.mjs <base> <out.json> [user] [pass]'); process.exit(2); }
const outPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', out);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base.replace(/\/$/, '')}/login`, { waitUntil: 'load' });
await page.fill('#j_username', user);
await page.fill('#j_password', pass);
await Promise.all([
  page.waitForURL((u) => !u.pathname.endsWith('/login') && !u.pathname.endsWith('/loginError'), { timeout: 15000 }),
  page.click('button[type="submit"], input[type="submit"], .jenkins-button--primary'),
]);
// preuve auth : le panneau principal + le header connecté
await page.waitForSelector('#main-panel', { timeout: 15000 });
await page.waitForSelector('#page-header .jenkins-button [href*="logout"], .app-bar__controls .jenkins-dropdown', { timeout: 10000 }).catch(() => {});
await page.context().storageState({ path: outPath });
console.log('storageState ->', outPath);
await browser.close();
