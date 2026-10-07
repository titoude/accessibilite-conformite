#!/usr/bin/env node
/**
 * seed.mjs — peuple une instance karakeep fraîche via l'API REST v1 publique.
 *
 * Usage : node seed.mjs [base-url]
 *   base-url défaut http://localhost:3000
 *
 * Étapes (toutes rejouables sur DB vide) :
 *   1. POST /api/auth/sign-up/email — compte audit.c35@example.com
 *      (Better Auth : la requête porte Origin comme le fait l'UI).
 *      Sur un compte existant : 4xx → l'utilisateur est réutilisé (idempotent).
 *   2. POST /api/trpc/apiKeys.exchange — échange email/mdp → clé API.
 *      (même chemin que l'extension officielle ; rate-limit 10/15 min —
 *      le seed n'en consomme qu'une).
 *   3. Seed via /api/v1 avec Bearer :
 *      - 5 bookmarks lien (crawlés en tâche de fond par les workers),
 *      - 2 notes texte,
 *      - 1 bookmark image (upload multipart /assets puis asset bookmark),
 *      - 2 listes manuelles + 1 smart list (query '#dev'),
 *      - 4 tags attachés aux bookmarks,
 *      - 1 favori, 2 archivés,
 *      - notes éditoriales (champ note) sur 2 liens.
 *
 * Les IDs générés par le serveur ne sont PAS écrits ailleurs : tout
 * paramétrage d'état repose sur le contenu (noms/tags/titres), jamais
 * sur un id capturé — rejeu install-build sans adaptation.
 *
 * Échec franc (exit 2) dès qu'une étape renvoie != 2xx attendu : un seed
 * partiel produirait des scans au contenu incomplet pris pour réels.
 */
const BASE = process.argv[2] || 'http://localhost:3000';
const EMAIL = 'audit.c35@example.com';
const PASSWORD = 'cycle35-audit-mdp!';
const NAME = 'Auditeur Cycle35';

const j = (r) => r.json().catch(() => ({}));
const fail = (step, msg) => {
  console.error(`[seed] ÉCHEC ${step}: ${msg}`);
  process.exit(2);
};

// --- 1. Compte -------------------------------------------------------------
const signUp = await fetch(`${BASE}/api/auth/sign-up/email`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: BASE },
  body: JSON.stringify({ name: NAME, email: EMAIL, password: PASSWORD }),
});
if (!signUp.ok && signUp.status !== 422) {
  // 422/exists possible selon versions : on continue — le login décidera.
  const body = await signUp.text().catch(() => '');
  if (signUp.status >= 500) fail('sign-up', `HTTP ${signUp.status} ${body}`);
}
console.log(`[seed] sign-up → HTTP ${signUp.status}`);

// --- 2. Clé API ------------------------------------------------------------
// Le nom de clé est UNIQUE par utilisateur : sur rejeu sur la même instance
// l'échange échoue avec une contrainte sqlite — on suffixe par timestamp.
let apiKey = null;
for (const suffix of ['', `-${Date.now()}`]) {
  const exch = await fetch(`${BASE}/api/trpc/apiKeys.exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      json: { keyName: `cycle35-seed${suffix}`, email: EMAIL, password: PASSWORD },
    }),
  });
  if (exch.ok) {
    apiKey = (await exch.json())?.result?.data?.json?.key;
    break;
  }
  // En prod la contrainte UNIQUE est masquée (« Internal server error ») —
  // tout échec de l'échange sans suffixe déclenche le retry suffixé.
  const body = await exch.text().catch(() => '');
  if (suffix !== '') fail('apiKeys.exchange', `HTTP ${exch.status} ${body}`);
}
if (!apiKey) fail('apiKeys.exchange', 'pas de clé dans la réponse');
const H = { 'Content-Type': 'application/json', authorization: `Bearer ${apiKey}` };
console.log('[seed] clé API OK');

// --- 3. Contenu ------------------------------------------------------------
const post = async (path, body, step) => {
  const r = await fetch(`${BASE}/api/v1${path}`, {
    method: 'POST', headers: H, body: JSON.stringify(body),
  });
  if (!r.ok) fail(step, `POST ${path} → HTTP ${r.status} ${await r.text()}`);
  return j(r);
};
const put = async (path, step) => {
  const r = await fetch(`${BASE}/api/v1${path}`, { method: 'PUT', headers: H });
  if (!r.ok) fail(step, `PUT ${path} → HTTP ${r.status} ${await r.text()}`);
  return j(r);
};
const patch = async (path, body, step) => {
  const r = await fetch(`${BASE}/api/v1${path}`, {
    method: 'PATCH', headers: H, body: JSON.stringify(body),
  });
  if (!r.ok) fail(step, `PATCH ${path} → HTTP ${r.status} ${await r.text()}`);
  return j(r);
};

// Bookmarks lien (titres repris par le crawler ; fournis en secours pour
// rester réaliste même si le crawl échoue).
const links = [
  {
    url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility',
    title: 'Accessibility | MDN',
    note: 'Référence de base pour les rôles ARIA et les landmarks — à recouper avec les rapports axe.',
  },
  {
    url: 'https://www.w3.org/WAI/WCAG22/quickref/',
    title: 'How to Meet WCAG (Quick Reference)',
    note: 'Checklist WCAG 2.2 filtrable — utilisée pour les familles contrastes/cibles.',
  },
  {
    url: 'https://github.com/karakeep-app/karakeep',
    title: 'karakeep-app/karakeep',
  },
  {
    url: 'https://docs.docker.com/get-started/',
    title: 'Get started with Docker',
  },
  {
    url: 'https://www.bbc.com/news/technology',
    title: 'Technology - BBC News',
  },
];
const bm = [];
for (const l of links) {
  const created = await post('/bookmarks', { type: 'link', ...l }, `bookmark ${l.url}`);
  bm.push(created);
}
console.log(`[seed] ${bm.length} bookmarks lien`);

// Notes texte (type 'text' — pas de crawl, contenu littéral immédiat).
const notes = [
  {
    text: 'Idées audit — vérifier les contrastes des badges de tags, les libellés des boutons-icônes, et la restauration du focus à la fermeture des boîtes de dialogue.',
    title: 'Checklist audit a11y',
  },
  {
    text: 'Courses : semoule fine, citron confit, coriandre, cumin, olives vertes, semences de courge torréfiées.',
    title: 'Liste de courses',
  },
];
for (const n of notes) {
  const created = await post('/bookmarks', { type: 'text', ...n }, `note ${n.title}`);
  bm.push(created);
}
console.log('[seed] 2 notes texte');

// Bookmark image : upload multipart puis bookmark 'asset'.
const fs = await import('node:fs');
const path = await import('node:path');
const { fileURLToPath } = await import('node:url');
const imgPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'fixtures', 'photo-repere.png');
const imgData = fs.readFileSync(imgPath);
const form = new FormData();
form.append('file', new Blob([imgData], { type: 'image/png' }), 'photo-repere.png');
const up = await fetch(`${BASE}/api/v1/assets`, {
  method: 'POST',
  headers: { authorization: `Bearer ${apiKey}` },
  body: form,
});
if (!up.ok) fail('upload asset', `HTTP ${up.status} ${await up.text()}`);
const asset = await j(up);
const imgBm = await post('/bookmarks', {
  type: 'asset',
  assetType: 'image',
  assetId: asset.assetId,
  fileName: 'photo-repere.png',
  title: 'Photo repère — mur du port',
}, 'bookmark image');
bm.push(imgBm);
console.log('[seed] 1 bookmark image');

// Listes.
const listVeille = await post('/lists', {
  name: 'Veille accessibilité',
  description: 'Références WCAG et méthodo d’audit, mises à jour en continu.',
  icon: '♿',
}, 'list veille');
const listLecture = await post('/lists', {
  name: 'À lire plus tard',
  description: 'Liens mis de côté pour le week-end.',
  icon: '📚',
}, 'list lecture');
const listImages = await post('/lists', {
  name: 'Images à trier',
  type: 'smart',
  query: '#photo',
  icon: '🖼️',
}, 'list smart images');
console.log('[seed] 3 listes (2 manuelles + 1 smart)');

// La liste « Veille accessibilité » est publiée : la route publique
// /public/lists/<id> doit servir une page vivante à auditer (fixer-v2,
// wart « routes publiques livrées hors scope »).
await patch(`/lists/${listVeille.id}`, { public: true }, 'list veille publique');
console.log('[seed] liste veille publiée (/public/lists/<id>)');

// Remplissage des listes manuelles.
await put(`/lists/${listVeille.id}/bookmarks/${bm[0].id}`, 'list+mdn');
await put(`/lists/${listVeille.id}/bookmarks/${bm[1].id}`, 'list+wcag');
await put(`/lists/${listLecture.id}/bookmarks/${bm[2].id}`, 'list+github');
await put(`/lists/${listLecture.id}/bookmarks/${bm[3].id}`, 'list+docker');

// Tags.
const attach = async (bookmarkId, names) => {
  await post(`/bookmarks/${bookmarkId}/tags`, {
    tags: names.map((tagName) => ({ tagName, attachedBy: 'human' })),
  }, `tags ${names.join(',')}`);
};
await attach(bm[0].id, ['accessibilité', 'référence']);
await attach(bm[1].id, ['accessibilité', 'à-lire']);
await attach(bm[2].id, ['dev']);
await attach(bm[3].id, ['dev', 'à-lire']);
await attach(bm[4].id, ['actu']);
await attach(imgBm.id, ['photo']);
console.log('[seed] tags attachés');

// Favori + archivés (états métier couverts par les pages dédiées).
await patch(`/bookmarks/${bm[1].id}`, { favourited: true }, 'favori');
await patch(`/bookmarks/${bm[3].id}`, { archived: true }, 'archive docker');
await patch(`/bookmarks/${bm[6].id}`, { archived: true }, 'archive note courses');
console.log('[seed] 1 favori, 2 archivés');

// Résolution du tagId créé (les tags sont implicites à l'attachement).
const tagsR = await fetch(`${BASE}/api/v1/tags`, { headers: H });
if (!tagsR.ok) fail('list tags', `HTTP ${tagsR.status}`);
const tags = (await j(tagsR)).tags ?? [];
const tagA11y = tags.find((t) => t.name === 'accessibilité');
if (!tagA11y) fail('tag accessibilité', 'introuvable après attachement');

// seed-ids.json : ids générés par le serveur, lus par audit.mjs (STATES) et
// par les commandes de rejeu — jamais codés en dur dans les artefacts.
const idsPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'seed-ids.json',
);
fs.writeFileSync(idsPath, JSON.stringify({
  account: { email: EMAIL },
  bookmarkLinkId: bm[0].id,      // lien MDN — preview page/modal
  bookmarkNoteId: bm[5].id,      // note « Checklist audit a11y »
  bookmarkImageId: imgBm.id,     // bookmark image
  listId: listVeille.id,         // « Veille accessibilité »
  publicListId: listVeille.id,   // même liste, publiée (route /public/lists)
  tagId: tagA11y.id,             // tag « accessibilité »
}, null, 2) + '\n');
console.log(`[seed] ids → ${idsPath}`);

console.log('[seed] TERMINÉ — 8 bookmarks, 3 listes, 6 tags, 1 favori, 2 archivés');
