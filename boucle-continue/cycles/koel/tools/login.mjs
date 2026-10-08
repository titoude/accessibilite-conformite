#!/usr/bin/env node
/**
 * login.mjs <base> [auth.json] — produit le storageState Playwright koel.
 * Auth koel = localStorage 'api-token' + 'audio-token' (PAS de cookie HttpOnly).
 * On POST /api/me via fetch dans la page, on plante les tokens, on vérifie
 * que l'app monte l'UI authentifiée (sidebar), puis on sauvegarde l'état.
 * Usage : node login.mjs http://localhost:9049 [auth.json]
 * Env : KOEL_EMAIL / KOEL_PASSWORD (défauts seed admin@koel.dev / KoelIsCool).
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(HERE, 'package.json'));
const { chromium } = require('playwright');

const base = (process.argv[2] || 'http://localhost:9049').replace(/\/$/, '');
const out = resolve(HERE, process.argv[3] || 'auth.json');
const email = process.env.KOEL_EMAIL || 'admin@koel.dev';
const password = process.env.KOEL_PASSWORD || 'KoelIsCool';

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(`${base}/`, { waitUntil: 'load' });

const tokens = await page.evaluate(async ([email, password]) => {
  const r = await fetch('/api/me', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error(`login ${r.status}`);
  const t = await r.json();
  // koel useLocalStorage JSON-encode les valeurs (baseSet = JSON.stringify)
  localStorage.setItem('api-token', JSON.stringify(t.token));
  localStorage.setItem('audio-token', JSON.stringify(t['audio-token']));
  return t;
}, [email, password]);
console.log('[login] token obtenu', tokens.token.slice(0, 12) + '…');

await page.reload({ waitUntil: 'load' });
// preuve d'auth réelle : la nav sidebar koel montée (pas le login)
await page.waitForSelector('nav .sidebar, nav[class*="sidebar"], nav', { timeout: 25000 });
await page.waitForFunction(() => !/log in|forgot password/i.test(document.body.innerText || ''), null, { timeout: 25000 });
await ctx.storageState({ path: out });
console.log('[login] storageState ->', out);
await browser.close();
