#!/usr/bin/env node
// login.mjs — cycle 50 castopod : POST /cp-auth/login → storageState tools/auth.json
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] || 'http://localhost:9170';
const out = process.argv[3] || resolve(HERE, 'auth.json');
const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(`${base}/cp-auth/login`, { waitUntil: 'load' });
await page.fill('input[name="email"]', 'bench-admin@c50.local');
await page.fill('input[name="password"]', 'AuditC50-Pass-Seed!');
await Promise.all([
  page.waitForURL(/\/cp-admin/, { timeout: 30000 }),
  page.click('button[type="submit"], form button'),
]);
// preuve d'auth : la page admin affiche la nav admin (sinon exit 1)
await page.waitForSelector('#admin-sidebar, .admin-sidebar, nav', { timeout: 15000 });
await ctx.storageState({ path: out });
await browser.close();
console.log('auth.json écrit :', out);
