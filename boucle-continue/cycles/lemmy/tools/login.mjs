#!/usr/bin/env node
/**
 * login.mjs — produit auth.json (storageState Playwright) via le VRAI
 * formulaire /login de lemmy-ui (cookie jwt posé par l'app).
 * Usage : node login.mjs <baseUrl> [user] [pass]
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
const DIR = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(DIR, 'package.json'));
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://localhost:9655').replace(/\/$/, '');
const USER = process.argv[3] || 'lemmy';
const PASS = process.argv[4] || 'Lemmy55-Admin-Pass!';

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
// lemmy-ui hydrate (Inferno) — attendre que le formulaire soit interactif
await page.waitForSelector('#login-email-or-username', { timeout: 30000 });
await page.locator('#login-email-or-username').fill(USER);
await page.locator('input[type="password"]').first().fill(PASS);
// le formulaire TOTP caché contient aussi un submit — cibler le form visible
await page.locator('form:has(#login-email-or-username) button[type="submit"]').click();
// preuve d'état connecté : le menu utilisateur remplace Login/Sign Up
await page.waitForFunction(() => {
  const t = document.body.innerText || '';
  return !document.querySelector('a[href="/login"]') || t.length > 0;
}, { timeout: 30000 }).catch(() => {});
await page.waitForLoadState('networkidle').catch(() => {});
const authed = await page.evaluate(() =>
  !document.querySelector('a.nav-link[href="/login"]') &&
  !!document.querySelector('a[href="/settings"], a[href="/inbox"], .person-listing, #navbarIcons .dropdown')
);
if (!authed) {
  await page.screenshot({ path: join(DIR, 'generated', 'login-fail.png') }).catch(() => {});
  await browser.close();
  console.error('[login] ECHEC : toujours anonyme après submit (voir generated/login-fail.png)');
  process.exit(1);
}
await ctx.storageState({ path: join(DIR, 'auth.json') });
await browser.close();
console.log('[login] OK → tools/auth.json');
