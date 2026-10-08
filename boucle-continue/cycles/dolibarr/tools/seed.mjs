#!/usr/bin/env node
/**
 * seed.mjs — applique le seed Dolibarr (tools/seed.php) dans le conteneur web
 * et écrit tools/seed-info.json (source unique des ids, leçon 44/46).
 * Usage: node seed.mjs [--container doli57-web]
 * Idempotent-défensif : refuse si le seed est déjà présent (garde dans seed.php).
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const argContainer = process.argv.includes('--container')
  ? process.argv[process.argv.indexOf('--container') + 1] : null;
const CONTAINER = argContainer || process.env.DOLI_CONTAINER || 'doli57-web';

console.log(`[seed] container=${CONTAINER}`);
execFileSync('docker', ['cp', join(HERE, 'seed.php'), `${CONTAINER}:/tmp/seed.php`], { stdio: 'inherit' });
const raw = execFileSync('docker', ['exec', '-w', '/var/www/html/htdocs', CONTAINER, 'php', '/tmp/seed.php'], { encoding: 'utf8' });
let info;
try { info = JSON.parse(raw); }
catch (e) { console.error(raw); throw new Error('seed.php n\'a pas rendu du JSON'); }
if (!info.ok) { console.error(JSON.stringify(info, null, 2)); process.exit(1); }
info.seeded_at = new Date().toISOString();
mkdirSync(HERE, { recursive: true });
writeFileSync(join(HERE, 'seed-info.json'), JSON.stringify(info, null, 2) + '\n');
console.log(`[seed] OK -> tools/seed-info.json  societes=${(info.societe_ids || []).length} produits=${(info.product_ids || []).length} factures=${(info.facture_ids || []).length}`);
if (info.errors?.length) { console.error('[seed] erreurs partielles:', info.errors); process.exit(1); }
