#!/usr/bin/env node
// login.mjs — ouvre une vraie session UI (formulaire /auth) et écrit le
// storageState Playwright à côté de ce script (pas le CWD — leçon BookStack).
// Usage : node login.mjs <baseUrl> [fichier-sortie]
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(process.cwd() + '/package.json');
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] || 'http://localhost:11334';
const out = join(HERE, process.argv[3] || 'auth.json');
const USER = process.env.STUMP_USER || 'admin';
const PASS = process.env.STUMP_PASS || 'adminpass123';
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(`${base}/auth`, { waitUntil: 'load', timeout: 30000 });
// l'onglet login est le défaut quand le serveur est déjà claimé
const userInput = page.locator('input[type="text"], input[name="username"], input#username').first();
await userInput.waitFor({ state: 'visible', timeout: 15000 });
await userInput.fill(USER);
const passInput = page.locator('input[type="password"]').first();
await passInput.fill(PASS);
await page.locator('button[type="submit"], button:has-text("Log"), button:has-text("Sign")').first().click();
// la SPA navigue hors de /auth une fois loggé
await page.waitForURL((u) => !u.pathname.startsWith('/auth'), { timeout: 20000 });
await page.waitForLoadState('networkidle').catch(() => {});
await ctx.storageState({ path: out });
// preuve non-vacuole : on doit voir du contenu connecté
const who = await page.evaluate(async () => {
  const r = await fetch('/api/v2/auth/me', { credentials: 'include' });
  if (!r.ok) return null;
  const j = await r.json().catch(() => null);
  return j && (j.username || j.id);
});
if (!who) { console.error('login.mjs : session non vérifiée (auth/me KO)'); process.exit(1); }
console.log(`login OK user=${who} → ${out}`);
await browser.close();
