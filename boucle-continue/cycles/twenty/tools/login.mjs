#!/usr/bin/env node
// Cycle 54 — login Playwright twenty → auth.json (storageState).
// Flow réel : /welcome → « Continue with Email » → email → « Continue » → password.
// Vérification par contenu réel (navigation hors /welcome + UI authentifiée),
// jamais sur un check cookie (leçon : preuve par contenu).
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url));
const info = JSON.parse(readFileSync(join(TOOLS, 'seed-info.json'), 'utf8'));
const BASE = process.env.BASE || info.base;
const OUT = process.argv[2] || join(TOOLS, 'auth.json');
const email = info.user.email;
const password = info.user.password;

const browser = await chromium.launch();
// locale:'en-US' sur TOUT contexte Playwright — leçon 38
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
page.setDefaultTimeout(45000);

await page.goto(`${BASE}/welcome`, { waitUntil: 'domcontentloaded' });

// Le bouton « Continue with Email » affiche le formulaire email/password.
const emailBtn = page.getByRole('button', { name: /continue with email/i })
  .or(page.getByText(/continue with email/i)).first();
if (await emailBtn.count()) await emailBtn.click();

// Email (peut être pré-rempli par SIGN_IN_PREFILLED — on force la valeur).
const emailInput = page.locator('input[type="email"], input[placeholder*="mail" i]').first();
await emailInput.waitFor({ state: 'visible' });
await emailInput.fill(email);
await page.getByRole('button', { name: /continue|sign in|next/i }).first().click();

// Password
const pwdInput = page.locator('input[type="password"]').first();
await pwdInput.waitFor({ state: 'visible' });
await pwdInput.fill(password);
await page.getByRole('button', { name: /sign in|continue|log in|next/i }).first().click()
  .catch(() => pwdInput.press('Enter'));

// Atterrissage : hors /welcome (workspace ou sélection de workspace).
await page.waitForURL((u) => !u.pathname.startsWith('/welcome'), { timeout: 60000 });
await page.waitForFunction(
  () => (document.body.innerText || '').trim().length > 30,
  { timeout: 30000 },
);
await page.waitForTimeout(1500);
const landed = page.url();
console.log('[login] landed:', landed);
if (landed.includes('/welcome')) throw new Error('login non abouti — encore sur /welcome');

mkdirSync(dirname(OUT), { recursive: true });
await ctx.storageState({ path: OUT });
await browser.close();
console.log('[login] auth.json écrit ->', OUT);
