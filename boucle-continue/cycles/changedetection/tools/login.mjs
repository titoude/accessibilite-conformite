#!/usr/bin/env node
/**
 * login.mjs — produit auth.json (storage state Playwright) pour l'UI
 * changedetection.io protégée par mot de passe (SALTED_PASS).
 *
 * Usage : node login.mjs [base-url] [pass]
 *   base-url défaut http://127.0.0.1:5005 ; pass défaut
 *   audit-c33-changedetection (celui posé par tools/boot.sh).
 * Écrit auth.json À CÔTÉ de ce script (pas dans le CWD — leçon bookstack).
 *
 * Piège amont : la page /login rend aussi le menu haut (boutons submit du
 * toggle pause/mute) — un clic sur `button[type=submit]` soumet le MAUVAIS
 * formulaire. Sélecteur obligatoire : `.login-form button[type="submit"]`.
 *
 * Échec franc (exit 2) si login refusé ou watchlist absente : un auth.json
 * vide produirait des scans anonymes silencieux.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

// Deps : AUDIT_TOOLS, sinon le package.json épinglé à côté de ce script.
const require = createRequire(process.env.AUDIT_TOOLS || join(dirname(fileURLToPath(import.meta.url)), 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://127.0.0.1:5005';
const pass = process.argv[3] || 'audit-c33-changedetection';
const out = join(dirname(fileURLToPath(import.meta.url)), 'auth.json');

const browser = await chromium.launch();
const page = await browser.newPage();
try {
  await page.goto(`${base}/login`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForSelector('.login-form #password', { timeout: 15000 });
  await page.fill('.login-form #password', pass);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load', timeout: 30000 }),
    page.click('.login-form button[type="submit"]'),
  ]);
  // Succès = la watchlist (table des watches), pas un retour sur /login.
  await page.waitForSelector('#watch-table-wrapper', { timeout: 30000 });
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
