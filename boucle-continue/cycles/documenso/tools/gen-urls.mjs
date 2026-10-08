#!/usr/bin/env node
// gen-urls.mjs — génère urls-public.txt + urls-auth.txt depuis seed-info.json
// (leçon 44/46 : le seed est la source unique des ids ; les fichiers d'URLs
// sont DÉRIVÉS, jamais édités à la main).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url));
const SEED = JSON.parse(readFileSync(join(TOOLS, 'seed-info.json'), 'utf8'));
const T = SEED.team.url;
const O = SEED.organisation.url;
const DRAFT = SEED.documents.draft.id;
const PENDING = SEED.documents.pending.id;
const TPL = SEED.template.id;
const [TOK1, TOK2] = SEED.documents.pending.recipients.map((r) => r.token);

const publicUrls = [
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/check-email',
  '/unverified-account',
  '/verify-email',
  '/articles/signature-disclosure',
  `/sign/${TOK1}`,
  `/sign/${TOK2}`,
];

const authUrls = [
  // '/' volontairement absent : redirection pure vers /t/<team>/documents
  // (documentée dans scope-compare — la cible est déjà dans la liste).
  '/inbox',
  `/t/${T}/documents`,
  `/t/${T}/documents/folders`,
  `/t/${T}/documents/${DRAFT}/edit`,
  `/t/${T}/documents/${PENDING}`,
  `/t/${T}/documents/${PENDING}/logs`,
  `/t/${T}/templates`,
  `/t/${T}/templates/${TPL}/edit`,
  `/t/${T}/settings/general`,
  `/t/${T}/settings/members`,
  `/t/${T}/settings/document`,
  `/t/${T}/settings/public-profile`,
  `/t/${T}/analytics`,
  `/o/${O}/settings/general`,
  `/o/${O}/settings/members`,
];

writeFileSync(join(TOOLS, 'urls-public.txt'), publicUrls.join('\n') + '\n');
writeFileSync(join(TOOLS, 'urls-auth.txt'), authUrls.join('\n') + '\n');
console.log(`[gen-urls] ${publicUrls.length} publiques, ${authUrls.length} authentifiées`);
