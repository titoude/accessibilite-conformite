#!/usr/bin/env node
/**
 * seed.mjs — applique le seed Dolibarr (tools/seed.php) dans le conteneur web
 * et écrit tools/seed-info.json (source unique des ids, leçon 44/46).
 * Usage: node seed.mjs [--container doli57-web]
 * Idempotent-défensif : refuse si le seed est déjà présent (garde dans seed.php).
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const argContainer = process.argv.includes('--container')
  ? process.argv[process.argv.indexOf('--container') + 1] : null;
const CONTAINER = argContainer || process.env.DOLI_CONTAINER || 'doli57-web';

console.log(`[seed] container=${CONTAINER}`);
execFileSync('docker', ['cp', join(HERE, 'seed.php'), `${CONTAINER}:/tmp/seed.php`], { stdio: 'inherit' });
// seed.php sort != 0 en cas d'erreur — on récupère quand même son JSON pour diagnostic
let raw;
try { raw = execFileSync('docker', ['exec', '-w', '/var/www/html/htdocs', CONTAINER, 'php', '/tmp/seed.php'], { encoding: 'utf8' }); }
catch (e) { raw = (e.stdout || '').toString(); if (!raw.trim()) throw e; }
let info;
try { info = JSON.parse(raw); }
catch (e) { console.error(raw); throw new Error('seed.php n\'a pas rendu du JSON'); }
const infoPath = join(HERE, 'seed-info.json');
if (!info.ok || (info.errors || []).length) {
  const errs = info.errors || [];
  // Garde anti-double-seed seule : la base est DÉJÀ seedée — le seed-info
  // existant décrit sans doute cette base, on le conserve. Toute autre
  // erreur = seed-info potentiellement mensonger → suppression bruyante.
  const guardOnly = errs.length === 1 && /déjà appliqué/.test(errs[0]);
  if (!guardOnly && existsSync(infoPath)) {
    unlinkSync(infoPath);
    console.error('[seed] seed-info.json OBSOLÈTE supprimé (seed KO — ids non fiables)');
  }
  console.error(JSON.stringify(info, null, 2));
  process.exit(1);
}
info.seeded_at = new Date().toISOString();
mkdirSync(HERE, { recursive: true });
writeFileSync(infoPath, JSON.stringify(info, null, 2) + '\n');
console.log(`[seed] OK -> tools/seed-info.json  societes=${(info.societe_ids || []).length} produits=${(info.product_ids || []).length} factures=${(info.facture_ids || []).length} validée=${info.facture_validee_id} payée=${info.facture_payee_id} brouillon=${info.facture_draft_id}`);
