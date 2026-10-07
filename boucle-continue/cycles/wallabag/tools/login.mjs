#!/usr/bin/env node
/**
 * login.mjs — produit un storage-state Playwright authentifié wallabag.
 *
 *   node login.mjs <baseUrl> <user> <pass> <out.json>
 *
 * Le formulaire FOSUserBundle : POST /login_check avec _username/_password/
 * _csrf_token. Réussi = 302 hors /login. On vérifie ensuite /unread/list/1.
 */
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const [baseUrl, user, pass, out] = process.argv.slice(2);
if (!baseUrl || !user || !pass || !out) {
  console.error('usage: node login.mjs <baseUrl> <user> <pass> <out.json>');
  process.exit(2);
}

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const resp = await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
if (!resp || resp.status() >= 400) {
  console.error(`login page HTTP ${resp?.status()}`);
  process.exit(2);
}
await page.waitForSelector('#username', { state: 'visible' });
await page.fill('#username', user);
await page.fill('#password', pass);
await Promise.all([
  page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  page.click('button[type="submit"], input[type="submit"], [name="send"]'),
]);
if (page.url().includes('/login')) {
  console.error(`login refusé — reste sur ${page.url()}`);
  process.exit(2);
}
const check = await page.goto(`${baseUrl}/unread/list/1`, { waitUntil: 'domcontentloaded' });
if (!check || check.status() >= 400 || check.url().includes('/login')) {
  console.error(`session invalide après login (HTTP ${check?.status()} ${check?.url()})`);
  process.exit(2);
}
await context.storageState({ path: out });
console.log(`storage-state écrit : ${out}`);
await browser.close();
