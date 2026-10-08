#!/usr/bin/env node
/**
 * gen-urls.mjs — résout urls-{public,auth}.tpl.txt en urls-*.resolved.txt
 * en injectant les ids réels de seed-info.json (leçons 44/46 : aucun id
 * hardcodé, source unique = seed-info.json).
 * Usage : node gen-urls.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const DIR = dirname(fileURLToPath(import.meta.url));
const info = JSON.parse(readFileSync(join(DIR, 'seed-info.json'), 'utf8'));
const MAP = {
  COMMUNITY_NAME: info.community.name,
  COMMUNITY_ID: String(info.community.id),
  USER1_NAME: info.users[0].username,
  USER1_ID: String(info.users[0].id),
  USER2_NAME: info.users[1].username,
  USER2_ID: String(info.users[1].id),
  POST1_ID: String(info.post_ids[0]),
  POST2_ID: String(info.post_ids[1]),
  POST3_ID: String(info.post_ids[2]),
  COMMENT1_ID: String(info.comment_ids[0]),
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
