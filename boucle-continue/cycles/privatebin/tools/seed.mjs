#!/usr/bin/env node
/**
 * seed.mjs — peuple l'instance PrivateBin avec des pastes DÉTERMINISTES.
 *
 * L'id d'un paste = hash('fnv1a64', ct) côté serveur : avec clé/IV/sel fixes
 * le chiffré est reproductible bit-à-bit → ids et URLs identiques à chaque
 * replay (install-build compris). Les POST passent par la vraie API JSON
 * (trafic limité à 10s/IP → temporisation entre les écritures).
 *
 * Usage : node seed.mjs <baseUrl>
 * Écrit tools/seed.json (urls + ids) — lu par le manifeste et les scans.
 */
import { deflateRawSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = (process.argv[2] || 'http://localhost:8080').replace(/\/$/, '');
const OUT = new URL('./seed.json', import.meta.url).pathname;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b64 = buf => Buffer.from(buf).toString('base64');
const utf8 = s => new TextEncoder().encode(s);

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function base58encode(buf) {
  const digits = [0];
  for (const byte of buf) {
    let carry = byte;
    for (let i = 0; i < digits.length; i++) { carry += digits[i] << 8; digits[i] = carry % 58; carry = (carry / 58) | 0; }
    while (carry) { digits.push(carry % 58); carry = (carry / 58) | 0; }
  }
  let out = '';
  for (const byte of buf) { if (byte !== 0) break; out += B58[0]; }
  for (let i = digits.length - 1; i >= 0; i--) out += B58[digits[i]];
  return out;
}

function fnv1a64(str) {
  let h = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n, mask = (1n << 64n) - 1n;
  for (const b of utf8(str)) { h ^= BigInt(b); h = (h * prime) & mask; }
  return h.toString(16).padStart(16, '0');
}

// Paramètres figés — ne JAMAIS les changer : les ids en dérivent.
const PASTES = [
  {
    name: 'plaintext-discussion',
    key: 'a11ycycle22privatebinmasterkey01', // exactement 32 octets
    iv: '11111111111111112222222222222222'.slice(0, 16),
    salt: 'saltA1x!',
    password: '',
    formatter: 'plaintext',
    opendiscussion: 1,
    burnafterreading: 0,
    text: 'Rapport hebdo — point bloquant sur le proxy inverse. ' +
      'Voir le ticket https://github.com/PrivateBin/PrivateBin/issues/2044 pour le correctif en cours. ' +
      'Le reste du document liste les étapes de reproduction attendues.',
  },
  {
    name: 'markdown',
    key: 'a11ycycle22privatebinmasterkey02',
    iv: '33333333333333334444444444444444'.slice(0, 16),
    salt: 'saltB2y!',
    password: '',
    formatter: 'markdown',
    opendiscussion: 0,
    burnafterreading: 0,
    text: '**Notes de mise en production**\n\n- sauvegarde validée\n- proxy à rebasculer\n\nLien de suivi : https://privatebin.info/docs/ — ne pas oublier le pare-feu.',
  },
  {
    name: 'password',
    key: 'a11ycycle22privatebinmasterkey03',
    iv: '55555555555555556666666666666666'.slice(0, 16),
    salt: 'saltC3z!',
    password: 'a11y-privatebin',
    formatter: 'plaintext',
    opendiscussion: 0,
    burnafterreading: 0,
    text: 'Document protégé par mot de passe — contenu sensible du cycle 22. Voir https://privatebin.info/ pour la FAQ.',
  },
  {
    name: 'burn',
    key: 'a11ycycle22privatebinmasterkey04',
    iv: '77777777777777778888888888888888'.slice(0, 16),
    salt: 'saltD4w!',
    password: '',
    formatter: 'plaintext',
    opendiscussion: 0,
    burnafterreading: 1,
    text: 'Ce document se détruit après lecture. Ne JAMAIS confirmer la modale lors des audits (préserver le seed).',
  },
];

const COMMENTS = [
  {
    name: 'comment-1',
    pasteIdx: 0,
    parent: 'paste',
    key: 'commentIV1111111111'.slice(0, 16),
    salt: 'saltE5v!',
    comment: 'Bien noté — j\'ai rejoué le scénario https://privatebin.info/ côté recette, le proxy tient.',
    nickname: 'camille',
  },
  {
    name: 'comment-2-reply',
    pasteIdx: 0,
    parent: 'comment-1',
    key: 'commentIV2222222222'.slice(0, 16),
    salt: 'saltF6u!',
    comment: 'Confirmé, le correctif proxy est mergé. Je clôture le point.',
    nickname: 'ines',
  },
];

async function deriveKey(masterStr, password, saltBytes, iter) {
  const master = utf8(masterStr);
  let keyBytes = master;
  if (password.length > 0) {
    const pw = utf8(password);
    keyBytes = new Uint8Array(master.length + pw.length);
    keyBytes.set(master, 0); keyBytes.set(pw, master.length);
  }
  const imported = await crypto.subtle.importKey('raw', keyBytes, { name: 'PBKDF2' }, false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations: iter, hash: 'SHA-256' },
    imported, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
  );
}

async function cipher(master, password, message, adata, ivBytes, saltBytes) {
  const spec = [b64(ivBytes), b64(saltBytes), 100000, 256, 128, 'aes', 'gcm', 'zlib'];
  if (adata.length === 0) adata = spec; else adata[0] = spec;
  const key = await deriveKey(master, password, saltBytes, 100000);
  const plain = deflateRawSync(utf8(message)); // le wasm zlib emploie NO_ZLIB_HEADER (raw deflate)
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivBytes, additionalData: utf8(JSON.stringify(adata)), tagLength: 128 },
    key, plain
  );
  return [b64(new Uint8Array(ct)), adata];
}

async function exists(id) {
  const r = await fetch(`${BASE}/?pasteid=${id}`, { headers: { 'X-Requested-With': 'JSONHttpRequest' } });
  if (!r.ok) return false;
  const j = await r.json().catch(() => null);
  return j && j.status === 0;
}

let firstWrite = true;
async function post(body) {
  for (let attempt = 0; attempt < 4; attempt++) {
    if (!firstWrite || attempt > 0) await sleep(12000); // trafic limiter : 10 s/IP, y compris les échecs
    firstWrite = false;
    const r = await fetch(BASE + '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'JSONHttpRequest' },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    if (j.status === 0) return j;
    if (typeof j.message === 'string' && j.message.includes('wait')) { console.log(`limiteur — retry ${attempt + 1}`); continue; }
    throw new Error(`POST échoué: ${JSON.stringify(j)}`);
  }
  throw new Error('POST échoué: limiteur persistant après 4 tentatives');
}

const seed = { base: BASE, pastes: {}, comments: {} };

for (const p of PASTES) {
  if (utf8(p.key).length !== 32) throw new Error(`clé ${p.name} != 32 octets`);
  const iv = utf8(p.iv), salt = utf8(p.salt);
  const adata = [null, p.formatter, p.opendiscussion, p.burnafterreading];
  const [ct, fullAdata] = await cipher(p.key, p.password, JSON.stringify({ paste: p.text }), adata, iv, salt);
  const id = fnv1a64(ct);
  const url = `${BASE}/?${id}${p.burnafterreading ? '#-' : '#'}${base58encode(utf8(p.key))}`;
  seed.pastes[p.name] = { id, url, formatter: p.formatter, password: p.password || undefined };
  if (await exists(id)) { console.log(`existe déjà: ${p.name} ${id}`); continue; }
  const res = await post({ v: 2, adata: fullAdata, ct, meta: { expire: '1year' } });
  if (res.id !== id) throw new Error(`id inattendu: ${res.id} != ${id}`);
  console.log(`créé: ${p.name} ${res.id}`);
}

for (const c of COMMENTS) {
  const iv = utf8(c.key), salt = utf8(c.salt);
  const parentId = c.parent === 'paste' ? seed.pastes[PASTES[c.pasteIdx].name].id : seed.comments[c.parent].id;
  const msg = { comment: c.comment };
  if (c.nickname) msg.nickname = c.nickname;
  const master = PASTES[c.pasteIdx].key, pw = PASTES[c.pasteIdx].password;
  const [ct, adata] = await cipher(master, pw, JSON.stringify(msg), [], iv, salt);
  const id = fnv1a64(ct);
  const pasteId = seed.pastes[PASTES[c.pasteIdx].name].id;
  seed.comments[c.name] = { id, parentId, pasteId };
  const res = await post({ v: 2, adata, ct, pasteid: pasteId, parentid: parentId });
  if (res.id !== id) console.log(`note: commentaire id ${res.id} (attendu ${id})`);
  console.log(`commentaire: ${c.name} ${res.id} (parent ${parentId})`);
}

writeFileSync(OUT, JSON.stringify(seed, null, 2) + '\n');
console.log(`seed.json écrit: ${OUT}`);
