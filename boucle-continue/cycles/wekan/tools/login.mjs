// Cycle 39 — login Playwright wekan → auth.json (storageState).
// Formulaire useraccounts : #at-field-username_and_email / #at-field-password / #at-btn.
// Verification : presence d'un board dans l'UI (username ou #content peuple + URL hors sign-in).

import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = process.env.WEKAN_BASE || 'http://localhost:5580';
const RUN = process.env.RUN_DIR || process.cwd();
const creds = JSON.parse(readFileSync(`${RUN}/creds.json`, 'utf8'));

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

await page.goto(`${BASE}/sign-in`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#at-field-username_and_email', { timeout: 30000 });
await page.fill('#at-field-username_and_email', creds.username);
await page.fill('#at-field-password', creds.password);
await page.click('#at-btn');
// attendre la navigation applicative (FlowRouter client-side) : un élément board
await page.waitForFunction(() => {
  const u = location.pathname;
  return !u.startsWith('/sign-in') && !u.startsWith('/sign-up') && !u.startsWith('/forgot');
}, { timeout: 30000 });
await page.waitForSelector('#content .board, .my-boards-list, .all-boards, .board-list, a[href^="/b/"]', { timeout: 30000 });
const url = page.url();
console.log('[login] landed:', url);
await ctx.storageState({ path: `${RUN}/auth.json` });
await browser.close();
console.log('[login] auth.json ecrit');
