#!/usr/bin/env node
/**
 * login.mjs — produit auth.json (storage state Playwright) pour le GUI
 * syncthing authentifié par mot de passe.
 *
 * Usage : node login.mjs [base-url] [user] [pass]
 *   base-url défaut http://127.0.0.1:8384 ; user/pass défaut devin /
 *   DevinA11y!2026 (ceux posés par tools/seed.sh).
 * Écrit auth.json À CÔTÉ de ce script (pas dans le CWD — leçon bookstack).
 *
 * Échec franc (exit 2) si login refusé ou dashboard absent : un auth.json
 * vide produirait des scans anonymes silencieux.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:8384';
const user = process.argv[3] || 'devin';
const pass = process.argv[4] || 'DevinA11y!2026';
const out = join(dirname(fileURLToPath(import.meta.url)), 'auth.json');

const browser = await chromium.launch();
const page = await browser.newPage();
try {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForSelector('.center-block #user', { timeout: 15000 });
  await page.fill('.center-block #user', user);
  await page.fill('.center-block #password', pass);
  await page.click('.center-block #submit');
  // Succès = le dashboard se montre (boutons de panneau dossier) — la modale
  // de rapport d'usage peut recouvrir l'écran, elle est tolérée.
  await page.waitForSelector('button.panel-heading[data-target^="#folder-"]', { timeout: 30000 });
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
