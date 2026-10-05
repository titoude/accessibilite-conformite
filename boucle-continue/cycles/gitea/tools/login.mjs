#!/usr/bin/env node
/**
 * login.mjs — produit auth.json (storageState Playwright) pour l'instance gitea.
 *
 * Le cookie de session gitea est lié à l'instance (SECRET_KEY dans app.ini) :
 * régénérer ce fichier pour chaque instance/port. Chemins relatifs AU SCRIPT.
 *
 * Usage : node login.mjs <baseUrl> <out.json> [user] [pass]
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const require = createRequire(resolve(dirname(fileURLToPath(import.meta.url)), 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://localhost:3232';
const out = resolve(dirname(fileURLToPath(import.meta.url)), process.argv[3] || 'auth.json');
const user = process.argv[4] || 'giteaadmin';
const pass = process.argv[5] || 'A11yCycle32!pass';

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(`${base}/user/login`, { waitUntil: 'load' });
await page.locator('input[name="user_name"]').fill(user);
await page.locator('input[name="password"]').fill(pass);
await Promise.all([
  page.waitForURL(u => !u.pathname.includes('/user/login'), { timeout: 15000 }),
  page.locator('form.ui.form button[type="submit"], button.ui.primary.button').click(),
]);
// preuve dure : on est bien connecté (lien "Sign Out" / avatar dans la navbar)
await page.waitForSelector('#navbar .dropdown .avatar, #navbar img[src*="avatars"]', { timeout: 15000 });
await ctx.storageState({ path: out });
console.log('auth.json écrit:', out);
await browser.close();
