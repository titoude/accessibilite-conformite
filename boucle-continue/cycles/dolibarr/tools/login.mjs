#!/usr/bin/env node
/**
 * login.mjs — cycle 57 dolibarr. Écrit auth.json (storageState Playwright)
 * À CÔTÉ du script via le VRAI formulaire /index.php (token CSRF natif).
 * Usage: node login.mjs <baseUrl> [out] [user] [pass]
 *   node login.mjs http://localhost:9800 auth.json admin 'Doli57-Admin-2026'
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(HERE, 'package.json'));
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://localhost:9800').replace(/\/$/, '');
const OUT = resolve(HERE, process.argv[3] || 'auth.json');
const USER = process.argv[4] || 'admin';
const PASS = process.argv[5] || 'Doli57-Admin-2026';

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(`${BASE}/index.php`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#username', { timeout: 30000 });
await page.locator('#username').fill(USER);
await page.locator('#password').fill(PASS);
await page.locator('form input[type="submit"], form button[type="submit"], #login-submit-wrapper input, input[name="login"]').first().click();
// preuve post-login : la home affiche le menu applicatif (logout visible)
await page.waitForFunction(() => {
  const t = (document.body && document.body.innerText) || '';
  return /logout|log out|déconnexion/i.test(t) || !!document.querySelector('.tmenu, #mainmenutd_home, .login_block');
}, { timeout: 30000 });
await page.waitForLoadState('networkidle').catch(() => {});
const authed = await page.evaluate(() => {
  const hasLoginForm = !!document.querySelector('form[action*="index.php"] #username');
  const hasMenu = !!document.querySelector('.tmenu, #mainmenutd_home, .login_block, .login_block_other');
  return !hasLoginForm && hasMenu;
});
if (!authed) {
  mkdirSync(join(HERE, 'generated'), { recursive: true });
  await page.screenshot({ path: join(HERE, 'generated', 'login-fail.png') }).catch(() => {});
  await browser.close();
  console.error('[login] ECHEC : toujours anonyme après submit (generated/login-fail.png)');
  process.exit(1);
}
await ctx.storageState({ path: OUT });
await browser.close();
console.log(`[login] OK -> ${OUT}`);
