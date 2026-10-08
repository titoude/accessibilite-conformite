// Cycle 43 — seed littéral + idempotent pour Ghost 6.x (API Admin REST + cookie de session).
// Usage : node seed.mjs [BASE]  (défaut http://localhost:6430 ; env GHOST_EMAIL/GHOST_PASSWORD)
// Produit tools/seed-info.json (slugs/ids) — rejouable sur instance vierge.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.GHOST_BASE || process.argv[2] || 'http://localhost:6430';
const EMAIL = process.env.GHOST_EMAIL || 'audit.c43@example.test';
const PASS = process.env.GHOST_PASSWORD || 'Audit-C43-Gh0st-Pass!';

const cookie = await (async () => {
  const r = await fetch(`${BASE}/ghost/api/admin/session/`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: BASE },
    body: JSON.stringify({ username: EMAIL, password: PASS }),
  });
  if (!r.ok) throw new Error(`session ${r.status}`);
  return (r.headers.get('set-cookie') || '').split(';')[0];
})().catch(async e => {
  // instance vierge : setup wizard puis session
  const s = await fetch(`${BASE}/ghost/api/admin/authentication/setup/`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: BASE },
    body: JSON.stringify({ setup: [{ name: 'Audit C43', email: EMAIL, password: PASS, blogTitle: 'Cycle 43 Gazette' }] }),
  });
  if (!s.ok) throw new Error(`setup ${s.status} ${await s.text()}`);
  const r = await fetch(`${BASE}/ghost/api/admin/session/`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: BASE },
    body: JSON.stringify({ username: EMAIL, password: PASS }),
  });
  if (!r.ok) throw new Error(`session ${r.status}`);
  return (r.headers.get('set-cookie') || '').split(';')[0];
});

const api = async (path, opts = {}) => {
  const r = await fetch(`${BASE}/ghost/api/admin${path}`, {
    ...opts,
    headers: { 'content-type': 'application/json', origin: BASE, cookie, ...(opts.headers || {}) },
  });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch { j = t; }
  if (!r.ok) throw new Error(`${opts.method || 'GET'} ${path} -> ${r.status} ${t.slice(0, 300)}`);
  return j;
};

const slugs = {
  p1: 'refonte-du-portail-membres',
  p2: 'accessibilite-trois-tests-rapides',
  p3: 'notes-de-lecture-designing-for-real-life',
  d1: 'brouillon-enquete-newsletters',
  page1: 'manifeste',
  t1: 'accessibilite',
  t2: 'culture-web',
  t3: 'notes-de-lecture',
  m1: 'claire.durand@example.test',
};

// --- tags (idempotent par slug) ---
const haveTags = new Set((await api('/tags/?limit=all')).tags.map(t => t.slug));
for (const [slug, name] of [[slugs.t1, 'Accessibilité'], [slugs.t2, 'Culture web'], [slugs.t3, 'Notes de lecture']]) {
  if (!haveTags.has(slug)) await api('/tags/', { method: 'POST', body: JSON.stringify({ tags: [{ slug, name }] }) });
}

// --- posts (idempotent par slug) ---
const havePosts = new Set((await api('/posts/?limit=all')).posts.map(p => p.slug));
const P = (title, slug, html, status, tags) => ({ title, slug, html, status, tags: tags.map(t => ({ slug: t })) });
const posts = [
  P('Refonte du portail membres : retour d’expérience', slugs.p1, `<h2>Pourquoi un portail</h2><p>Nous avons refondu le portail de membership pour réduire la friction à l'inscription. Le <a href="https://ghost.org/docs/members/introduction/">guide officiel</a> liste les points clés.</p><h3>Ce qui a changé</h3><ul><li>Parcours en deux étapes au lieu de quatre</li><li>Prix affichés avant la carte bancaire</li><li>Emails de bienvenue traduits</li></ul><blockquote><p>« La conversion a doublé en trois semaines. »</p></blockquote><p>Prochaine étape : A/B tester la page tarifaire.</p>`, 'published', [slugs.t1]),
  P('Accessibilité numérique : trois tests rapides', slugs.p2, `<p>Trois contrôles qui prennent moins de dix minutes sur n'importe quelle page :</p><ol><li>Parcourir la page au clavier uniquement</li><li>Zoomer à 200 % et vérifier le reflow</li><li>Passer un scan axe et regarder les contrastes</li></ol><p>Le détail complet est dans <a href="https://www.w3.org/WAI/test-evaluate/preliminary/">l'évaluation rapide du W3C</a>.</p><h2>Un cas concret</h2><p>Sur notre page tarifaire, le contraste des prix barrés était insuffisant. Le correctif a pris une ligne de CSS.</p>`, 'published', [slugs.t1, slugs.t2]),
  P('Notes de lecture : Designing for Real Life', slugs.p3, `<p>Sara Wachter-Boettcher et Eric Meyer détaillent comment les interfaces échouent les gens dans les moments difficiles.</p><h2>Extraits marquants</h2><ul><li>« Design for crisis » : ne pas présumer du contexte émotionnel</li><li>Les formulaires qui demandent le genre avant tout autre champ</li></ul><p>Complément : <a href="https://ghost.org">le site de Ghost</a>.</p>`, 'published', [slugs.t3]),
  P('Brouillon : enquête longue sur les newsletters', slugs.d1, `<p>Plan : collecte des données, entretiens, analyse.</p>`, 'draft', [slugs.t2]),
];
for (const p of posts) if (!havePosts.has(p.slug)) await api('/posts/?source=html', { method: 'POST', body: JSON.stringify({ posts: [p] }) });

// --- pages ---
const havePages = new Set((await api('/pages/?limit=all')).pages.map(p => p.slug));
if (!havePages.has(slugs.page1)) {
  await api('/pages/?source=html', { method: 'POST', body: JSON.stringify({ pages: [{ title: 'Manifeste', slug: slugs.page1, status: 'published', html: `<h2>Nos engagements</h2><p>Publier lentement, corriger vite. Chaque article cite <a href="https://www.w3.org/WAI/">ses sources</a>.</p>` }] }) });
}
if (!havePages.has('about')) {
  await api('/pages/?source=html', { method: 'POST', body: JSON.stringify({ pages: [{ title: 'About', slug: 'about', status: 'published', html: `<p>La Gazette du cycle 43 documente nos travaux. <a href="https://github.com/TryGhost/Ghost">Le code de Ghost</a> est ouvert.</p>` }] }) });
}

// --- membre ---
const members = await api('/members/?limit=all');
if (!members.members.some(m => m.email === slugs.m1)) {
  await api('/members/', { method: 'POST', body: JSON.stringify({ members: [{ email: slugs.m1, name: 'Claire Durand', note: 'Compte de test cycle 43' }] }) });
}

// --- settings : bouton portal visible + titre confirmé ---
await api('/settings/', { method: 'PUT', body: JSON.stringify({ settings: [
  { key: 'portal_button', value: true },
  { key: 'accent_color', value: '#B3154F' },
] }) });

writeFileSync(join(TOOLS, 'seed-info.json'), JSON.stringify({ base: BASE, email: EMAIL, slugs }, null, 2));
console.log('[seed] ok', slugs);
// --- page 'about' : h3 -> h2 (contenu par défaut Ghost ; fixtures patchées pour les nouvelles installs) ---
{
  const r = await api('/pages/?limit=50&formats=html');
  const about = (r.pages || []).find((p) => p.slug === 'about' && p.html && p.html.includes('<h3'));
  if (about) {
    const html = about.html.replaceAll('<h3', '<h2').replaceAll('</h3', '</h2');
    await api(`/pages/${about.id}/?source=html`, { method: 'PUT', body: JSON.stringify({ pages: [{ html, updated_at: about.updated_at }] }) });
    log('page about : h3 -> h2');
  }
}
