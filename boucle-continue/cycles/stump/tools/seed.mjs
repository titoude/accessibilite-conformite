#!/usr/bin/env node
// seed.mjs — seed stump cycle 34 : claim serveur + admin + 2 libraries
// (Comics: séries Alpha Squadron/Beta Tales en .cbz ; Books: Novels en .epub).
// Idempotent : vérifie l'existant avant chaque écriture. Aucune dépendance
// Playwright — fetch natif Node 24.
// Usage : node seed.mjs <baseUrl> <stumpRepo> <mediaRoot>
//   ex. node seed.mjs http://localhost:11334 ~/work/stump ~/boucle-runs/stump
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import zlib from 'node:zlib';

const [base, repo = '/home/ubuntu/work/stump', mediaRoot = '/home/ubuntu/boucle-runs/stump'] = process.argv.slice(2);
if (!base) { console.error('usage: node seed.mjs <baseUrl> <repo> <mediaRoot>'); process.exit(2); }
const USER = 'admin';
const PASS = 'adminpass123';

// ── 1. fichiers médias (cbz = zip de png 1px, epub = fixture du repo) ──────
const png1x1 = () => {
  // PNG 8x8 rouge minimal généré sans dépendance
  const w = 8, h = 8, raw = Buffer.alloc(h * (w * 3 + 1));
  for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; for (let x = 0; x < w * 3; x += 3) { const o = y * (w * 3 + 1) + 1 + x; raw[o] = 200; raw[o + 1] = 40; raw[o + 2] = 40; } }
  const idat = zlib.deflateSync(raw);
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(zlib.crc32(td) >>> 0); return Buffer.concat([len, td, crcBuf]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
};
const cbz = (name) => {
  // zip minimal sans compression : 3 pages PNG
  const files = ['p1.png', 'p2.png', 'p3.png'].map(n => ({ n, d: png1x1() }));
  const chunks = [], central = []; let offset = 0;
  for (const { n, d } of files) {
    const lh = Buffer.alloc(30); lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0, 6); lh.writeUInt16LE(0, 8); lh.writeUInt16LE(0, 10); lh.writeUInt16LE(0x8400, 12); lh.writeUInt32LE(zlib.crc32(d) >>> 0, 14); lh.writeUInt32LE(d.length, 18); lh.writeUInt32LE(d.length, 22); lh.writeUInt16LE(n.length, 26); lh.writeUInt16LE(0, 28);
    chunks.push(lh, Buffer.from(n), d);
    const cd = Buffer.alloc(46); cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(20, 4); cd.writeUInt16LE(20, 6); cd.writeUInt16LE(0, 8); cd.writeUInt16LE(0, 10); cd.writeUInt16LE(0, 12); cd.writeUInt16LE(0x8400, 14); cd.writeUInt32LE(zlib.crc32(d) >>> 0, 16); cd.writeUInt32LE(d.length, 20); cd.writeUInt32LE(d.length, 24); cd.writeUInt16LE(n.length, 28); cd.writeUInt32LE(offset, 42);
    central.push(cd, Buffer.from(n));
    offset += lh.length + n.length + d.length;
  }
  const eocd = Buffer.alloc(22); eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(files.length, 8); eocd.writeUInt16LE(files.length, 10); const cdSize = central.reduce((a, c) => a + c.length, 0); eocd.writeUInt32LE(cdSize, 12); eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, ...central, eocd]);
};

const seedFiles = [];
const comicSrc = join(repo, 'core/integration-tests/data/science_comics_001.cbz');
for (const [series, names] of [['Alpha Squadron', ['alpha-002.cbz', 'alpha-003.cbz']], ['Beta Tales', ['beta-001.cbz', 'beta-002.cbz']]]) {
  const dir = join(mediaRoot, 'library-comics', series);
  mkdirSync(dir, { recursive: true });
  for (const n of names) { const p = join(dir, n); if (!existsSync(p)) { writeFileSync(p, cbz(n)); seedFiles.push(p); } }
}
const alpha1 = join(mediaRoot, 'library-comics', 'Alpha Squadron', 'alpha-001.cbz');
if (!existsSync(alpha1) && existsSync(comicSrc)) { copyFileSync(comicSrc, alpha1); seedFiles.push(alpha1); }
const bookDir = join(mediaRoot, 'library-books', 'Novels');
mkdirSync(bookDir, { recursive: true });
for (const [src, dst] of [['leaves.epub', 'leaves.epub'], ['book_image_cover.epub', 'the-great-novel.epub']]) {
  const s = join(repo, 'core/integration-tests/data', src); const d = join(bookDir, dst);
  if (!existsSync(d) && existsSync(s)) { copyFileSync(s, d); seedFiles.push(d); }
}
// oneshots : `_oneshots` est un NOM de dossier matché par le walker à
// l'intérieur de la bibliothèque (cf. core/src/scan/walk.rs) — pas un chemin
const osDir = join(mediaRoot, 'library-comics', '_oneshots');
mkdirSync(osDir, { recursive: true });
for (const n of ['oneshot-alpha.cbz', 'oneshot-beta.cbz']) {
  const p = join(osDir, n); if (!existsSync(p)) { writeFileSync(p, cbz(n)); seedFiles.push(p); }
}
console.log(`[seed] fichiers: ${seedFiles.length ? seedFiles.join(', ') : 'déjà en place'}`);

// ── 2. claim + register admin ─────────────────────────────────────────────
const j = async (r) => { const t = await r.text(); try { return JSON.parse(t); } catch { return t; } };
const claim = await (await fetch(`${base}/api/v2/claim`)).json().catch(() => null);
console.log('[seed] claim status:', JSON.stringify(claim));
// l'API renvoie {"isClaimed":false} en camelCase (v0.1.10) — tolérer snake_case au cas où
const unclaimed = claim === false || (claim && (claim.isClaimed === false || claim.is_claimed === false));
if (unclaimed) {
  const r = await fetch(`${base}/api/v2/auth/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: USER, password: PASS }) });
  console.log('[seed] register:', r.status);
}

// ── 3. login (cookie jar minimal) ─────────────────────────────────────────
const lr = await fetch(`${base}/api/v2/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: USER, password: PASS }), redirect: 'manual' });
const cookie = (lr.headers.get('set-cookie') || '').split(';')[0];
if (!cookie.includes('stump_session')) { console.error('[seed] login KO:', lr.status); process.exit(1); }
const gql = async (query, variables) => {
  const r = await fetch(`${base}/api/graphql`, { method: 'POST', headers: { 'content-type': 'application/json', cookie }, body: JSON.stringify({ query, variables }) });
  const d = await j(r);
  if (d.errors) throw new Error(JSON.stringify(d.errors));
  return d.data;
};

// ── 4. libraries ──────────────────────────────────────────────────────────
const { libraries: { nodes: libs } } = await gql('{libraries{nodes{id name path}}}');
const wanted = [
  { name: 'Comics', path: join(mediaRoot, 'library-comics') },
  { name: 'Books', path: join(mediaRoot, 'library-books') },
];
for (const w of wanted) {
  if (!libs.find(l => l.name === w.name)) {
    const r = await gql('mutation($i:CreateOrUpdateLibraryInput!){createLibrary(input:$i){id name}}', { i: { ...w, scanAfterPersist: true } });
    console.log(`[seed] library créée: ${r.createLibrary.name}`);
  } else console.log(`[seed] library déjà présente: ${w.name}`);
}

// ── 4b. oneshots : activer oneshotsDirectory='_oneshots' sur Comics + rescan
const { libraries: { nodes: libs2 } } = await gql('{libraries{nodes{id name}}}');
const comics = libs2.find(l => l.name === 'Comics');
if (comics) {
  const cur = await gql('query($id:ID!){libraryById(id:$id){config{oneshotsDirectory}}}', { id: comics.id });
  if (!cur.libraryById.config.oneshotsDirectory) {
    await gql('mutation($id:ID!,$i:PatchLibraryConfigInput!){patchLibraryConfig(id:$id,input:$i){id}}', { id: comics.id, i: { oneshotsDirectory: '_oneshots' } });
    await gql('mutation($id:ID!){scanLibrary(id:$id)}', { id: comics.id });
    console.log('[seed] oneshots_directory=_oneshots activé sur Comics + rescan');
  }
}

// ── 5. attente scan READY (séries + oneshots) ─────────────────────────────
for (let i = 0; i < 30; i++) {
  const { media: { nodes: media } } = await gql('{media{nodes{id status name}}}');
  const pending = media.filter(m => m.status !== 'READY' && m.status !== 'ERROR');
  const { series: { nodes: oneshots } } = await gql('{series(filter:{isOneshot:true}){nodes{id}}}');
  if (!pending.length && oneshots.length >= 2) { console.log(`[seed] ${media.length} media READY`); break; }
  if (i === 29) { console.error('[seed] scan toujours en cours après 150s:', pending.map(m => m.name)); process.exit(1); }
  await new Promise(r => setTimeout(r, 5000));
}
const { media: { nodes: media } } = await gql('{media{nodes{id name status}}}');
const { series: { nodes: series } } = await gql('{series{nodes{id name}}}');
console.log('[seed] series:', series.map(s => s.name).join(' | '));
console.log('[seed] media:', media.map(m => `${m.name}(${m.status})`).join(' | '));
