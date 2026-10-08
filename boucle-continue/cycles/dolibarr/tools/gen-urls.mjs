#!/usr/bin/env node
/**
 * gen-urls.mjs — résout urls-{public,auth}.tpl.txt en urls-*.resolved.txt
 * en injectant les ids réels de seed-info.json (leçons 44/46 : aucun id
 * hardcodé, source unique = seed-info.json commité).
 * Usage : node gen-urls.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const DIR = dirname(fileURLToPath(import.meta.url));
const info = JSON.parse(readFileSync(join(DIR, 'seed-info.json'), 'utf8'));
const draftFacture = (info.facture_ids || []).find(id => id !== info.facture_validee_id);
const MAP = {
  S1: String(info.societe_ids?.[0]),
  S2: String(info.societe_ids?.[1]),
  S3: String(info.societe_ids?.[2]),
  P1: String(info.product_ids?.[0]),
  P2: String(info.product_ids?.[1]),
  F_VALID: String(info.facture_validee_id),
  F_DRAFT: String(draftFacture),
  PR1: String(info.propal_ids?.[0]),
  O1: String(info.commande_ids?.[0]),
  PJ: String(info.project_id),
  C1: String(info.contact_ids?.[0]),
  U_ADMIN: '1',
  U2: String(info.user_ids?.[0]),
};
const missing = Object.entries(MAP).filter(([, v]) => v === 'undefined' || v === '');
if (missing.length) { console.error(`[gen-urls] clés manquantes dans seed-info.json : ${missing.map(([k]) => k)}`); process.exit(1); }
for (const kind of ['public', 'auth']) {
  const tpl = readFileSync(join(DIR, `urls-${kind}.tpl.txt`), 'utf8');
  let out = tpl;
  for (const [k, v] of Object.entries(MAP)) out = out.replaceAll(`{${k}}`, v);
  const leftover = out.match(/\{[A-Z0-9_]+\}/g);
  if (leftover) { console.error(`[gen-urls] placeholders non résolus : ${leftover}`); process.exit(1); }
  writeFileSync(join(DIR, `urls-${kind}.resolved.txt`), out);
  console.log(`[gen-urls] urls-${kind}.resolved.txt (${out.trim().split('\n').length} urls)`);
}
