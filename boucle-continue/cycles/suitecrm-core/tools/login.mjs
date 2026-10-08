#!/usr/bin/env node
/**
 * login.mjs — login réel SuiteCRM 8 (hash-router) → contexte Playwright
 * réutilisable (tools/auth.json) pour les audits authentifiés.
 *
 * CLI : node login.mjs <baseUrl> [user pass]
 *   Défauts user/pass : seed-info.json admin (source unique).
 *   Écrit tools/auth.json (storageState).
 *
 * Importé : loginAsAdmin(page, seed) connecte une page existante.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
// Deps résolues depuis le CWD (tools/) — createRequire ancré script-dir.
const require = createRequire(join(HERE, 'package.json'));
const { chromium } = require('playwright');

export function loadSeed() {
  return JSON.parse(readFileSync(join(HERE, 'seed-info.json'), 'utf8'));
}

export async function loginAsAdmin(page, seed) {
  const base = seed.base;
  await page.goto(`${base}/#/Login`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[name="username"]', { timeout: 30000 });
  await page.fill('input[name="username"]', seed.admin.username);
  await page.fill('input[name="password"]', seed.admin.password);
  await page.click('button:has-text("Log In")');
  // attendre la sortie du login (hash change ou débarquement home)
  await page.waitForURL(u => !String(u).includes('/Login'), { timeout: 60000 });
  // l'app charge ensuite ses données — attendre la navbar (module menu)
  await page.waitForSelector('a[href="#/home"]', { timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
}

const isMain = process.argv[1] && import.meta.url === 'file://' + resolve(process.argv[1]);
if (isMain) {
  const base = process.argv[2] || `http://localhost:${process.env.SC_PORT || 9950}`;
  const seed = loadSeed();
  const user = process.argv[3] || seed.admin.username;
  const pass = process.argv[4] || seed.admin.password;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'en-US' });
  const page = await ctx.newPage();
  await page.goto(`${base}/#/Login`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[name="username"]', { timeout: 30000 });
  await page.fill('input[name="username"]', user);
  await page.fill('input[name="password"]', pass);
  await page.click('button:has-text("Log In")');
  await page.waitForURL(u => !String(u).includes('/Login'), { timeout: 60000 });
  await page.waitForSelector('a[href="#/home"]', { timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  // preuve réelle d'auth : la navbar modules est rendue, pas le formulaire
  const ok = await page.evaluate(() =>
    !!document.querySelector('scrm-navbar-ui') && !document.querySelector('input[name="username"]'));
  if (!ok) {
    console.error('[login] session non établie (login form encore présent)');
    await browser.close();
    process.exit(1);
  }
  writeFileSync(join(HERE, 'auth.json'), JSON.stringify(await ctx.storageState(), null, 2));
  console.log(`[login] auth.json écrit (${user} @ ${base})`);
  await browser.close();
}
