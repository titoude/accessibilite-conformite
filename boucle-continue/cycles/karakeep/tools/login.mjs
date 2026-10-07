#!/usr/bin/env node
/**
 * login.mjs — produit auth.json (storage state Playwright) pour karakeep
 * authentifié par email/mot de passe (Better Auth → cookie de session).
 *
 * Usage : node login.mjs [base-url] [email] [password]
 *   base-url défaut http://localhost:3000
 *   email    défaut audit.c35@example.com
 *   password défaut cycle35-audit-mdp!   (posé par tools/seed.mjs)
 *
 * Écrit auth.json À CÔTÉ de ce script (pas dans le CWD — leçon bookstack).
 *
 * Succès = le dashboard (nav 'Dashboard') réellement rendu, pas seulement
 * une navigation non rejetée : un auth.json sans session valide produirait
 * des scans anonymes silencieux. Échec franc (exit 2) sinon.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(process.env.AUDIT_TOOLS || '/home/ubuntu/audit-tools/package.json');
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://localhost:3000';
const email = process.argv[3] || 'audit.c35@example.com';
const password = process.argv[4] || 'cycle35-audit-mdp!';
const out = join(dirname(fileURLToPath(import.meta.url)), 'auth.json');

const browser = await chromium.launch();
const page = await browser.newPage();
try {
  await page.goto(`${base}/signin`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([
    page.waitForURL((u) => u.pathname.startsWith('/dashboard'), { timeout: 30000 }),
    page.click('button[type="submit"]'),
  ]);
  // Preuve de session : la sidebar du dashboard, pas juste l'URL.
  await page.waitForSelector('nav, aside, [data-sidebar]', { timeout: 30000 });
  await page.waitForSelector('text=/bookmarks/i', { timeout: 15000 }).catch(() => null);
  await page.context().storageState({ path: out });
  const cookies = JSON.parse(readFileSyncOrEmpty(out)).cookies?.length ?? 0;
  if (cookies === 0) throw new Error('auth.json écrit mais sans cookie — session non persistée');
  console.log(`[login] OK — ${cookies} cookie(s) → ${out}`);
} catch (e) {
  console.error(`[login] ÉCHEC: ${e.message}`);
  process.exit(2);
} finally {
  await browser.close();
}

function readFileSyncOrEmpty(p) {
  try { return readFileSync(p, 'utf8'); } catch { return '{}'; }
}
