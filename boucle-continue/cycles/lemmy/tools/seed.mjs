#!/usr/bin/env node
/**
 * seed.mjs — cycle 55 lemmy. Seed REJOUABLE via l'API Lemmy v3 (HTTP seule,
 * même chemin que le navigateur : proxy nginx → lemmy:8536).
 *
 * Usage : node seed.mjs <baseUrl>   (défaut http://localhost:9655)
 *
 * Produit seed-info.json (à côté du script) : ids réels de l'instance —
 * source unique des ids pour urls/verify (leçons 44/46). Le script est
 * idempotent-défensif : il échoue si le nom d'utilisateur existe déjà
 * (stack fraîche attendue) — rejouer = nouveau volume pg (boot.sh).
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const DIR = dirname(fileURLToPath(import.meta.url));
const BASE = (process.argv[2] || 'http://localhost:9655').replace(/\/$/, '');
const ADMIN = { user: 'lemmy', pass: 'Lemmy55-Admin-Pass!' };

const api = async (path, { method = 'GET', token, body, okErrors = [] } = {}) => {
  const r = await fetch(`${BASE}/api/v3${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text.slice(0, 300) }; }
  if (!r.ok && !okErrors.includes(json.error)) {
    throw new Error(`${method} ${path} → ${r.status} : ${JSON.stringify(json).slice(0, 300)}`);
  }
  return json;
};

console.log(`[seed] base=${BASE}`);

// --- admin login ---
const { jwt: adminJwt } = await api('/user/login', {
  method: 'POST', body: { username_or_email: ADMIN.user, password: ADMIN.pass },
});
if (!adminJwt) throw new Error('login admin : pas de jwt');
console.log('[seed] admin connecté');

// --- utilisateurs ---
const register = async (username, password) => {
  const r = await api('/user/register', {
    method: 'POST',
    body: { username, password, password_verify: password, show_nsfw: true, answer: 'bench seed registration' },
    okErrors: ['user_already_exists'],
  });
  if (r.error === 'user_already_exists') { console.log(`[seed] ${username} déjà présent → login`); return; }
  if (r.registration_created) { console.log(`[seed] ${username} application créée (approbation admin)`); return; }
  if (!r.jwt) throw new Error(`register ${username} : pas de jwt (${JSON.stringify(r).slice(0, 200)})`);
  return r.jwt;
};
const approveAll = async () => {
  const list = await api('/admin/registration_application/list?unread_only=true', { token: adminJwt });
  for (const a of list.registration_applications || []) {
    await api('/admin/registration_application/approve', {
      method: 'PUT', token: adminJwt,
      body: { id: a.registration_application.id, approve: true },
    });
  }
};
const login = async (username, password) => {
  const r = await api('/user/login', { method: 'POST', body: { username_or_email: username, password } });
  if (!r.jwt) throw new Error(`login ${username} : pas de jwt`);
  return r.jwt;
};
await register('bench_user1', 'Bench55-User1-Pass!');
await register('bench_user2', 'Bench55-User2-Pass!');
await approveAll();
const u1Jwt = await login('bench_user1', 'Bench55-User1-Pass!');
const u2Jwt = await login('bench_user2', 'Bench55-User2-Pass!');
const u1 = await api('/user?username=bench_user1', { token: u1Jwt });
const u2 = await api('/user?username=bench_user2', { token: u2Jwt });
const u1Id = u1.person_view.person.id, u2Id = u2.person_view.person.id;
console.log(`[seed] users bench_user1#${u1Id} bench_user2#${u2Id}`);

// --- communauté (admin) — idempotent : récupère l'existante ---
let communityId;
const comm = await api('/community', {
  method: 'POST', token: adminJwt,
  body: {
    name: 'a11ybench',
    title: 'Accessibility Bench',
    description: 'Community for the a11y audit bench. [Lemmy](https://join-lemmy.org) is federated.',
    sidebar: 'Rules: be kind. Threads here test the comment UI.',
    discussion_languages: [1], // undetermined
  },
  okErrors: ['community_already_exists'],
});
if (comm.error === 'community_already_exists') {
  const found = await api(`/community?name=a11ybench`, { token: adminJwt });
  communityId = found.community_view.community.id;
  console.log(`[seed] communauté a11ybench déjà présente #${communityId}`);
} else {
  communityId = comm.community_view.community.id;
}
await api('/community/follow', { method: 'POST', token: adminJwt, body: { community_id: communityId, follow: true } });
await api('/community/follow', { method: 'POST', token: u1Jwt, body: { community_id: communityId, follow: true } });
console.log(`[seed] communauté a11ybench#${communityId}`);

// --- posts (contenu markdown riche, littéraux épinglés — règle « seed réaliste ») ---
const postBody = `Welcome to the accessibility bench. This body is **markdown** with [a link](https://join-lemmy.org), a list and a table:

- first item
- second item

| col a | col b |
|---|---|
| 1 | 2 |

Inline \`code\` too.`;

const p1 = await api('/post', {
  method: 'POST', token: adminJwt,
  body: { name: 'Welcome thread — markdown body', community_id: communityId, body: postBody },
});
const p2 = await api('/post', {
  method: 'POST', token: u1Jwt,
  body: { name: 'Vote on this link post', community_id: communityId, url: 'https://github.com/LemmyNet/lemmy-ui', body: 'Link post seeded for the audit. [docs](https://join-lemmy.org/docs)' },
});
const p3 = await api('/post', {
  method: 'POST', token: u2Jwt,
  body: { name: 'Discussion: keyboard traps in modals', community_id: communityId, body: 'Plain discussion post.\n\nSecond paragraph with *emphasis* and a [nested link](https://example.com).' },
});
const postIds = [p1.post_view.post.id, p2.post_view.post.id, p3.post_view.post.id];
console.log(`[seed] posts ${postIds}`);

// --- commentaires imbriqués (fil à 3 niveaux) ---
const c1 = await api('/comment', { method: 'POST', token: u1Jwt, body: { content: 'Top-level comment with a [markdown link](https://example.com).', post_id: postIds[0] } });
const c2 = await api('/comment', { method: 'POST', token: u2Jwt, body: { content: 'Reply level 2 — *italic* text.', post_id: postIds[0], parent_id: c1.comment_view.comment.id } });
const c3 = await api('/comment', { method: 'POST', token: adminJwt, body: { content: 'Reply level 3 with `code`.', post_id: postIds[0], parent_id: c2.comment_view.comment.id } });
const c4 = await api('/comment', { method: 'POST', token: u2Jwt, body: { content: 'Second top-level comment.', post_id: postIds[0] } });
const c5 = await api('/comment', { method: 'POST', token: adminJwt, body: { content: 'Comment on the link post.', post_id: postIds[1] } });
const commentIds = [c1, c2, c3, c4, c5].map(c => c.comment_view.comment.id);
console.log(`[seed] comments ${commentIds}`);

// --- votes ---
for (const [pid, sc] of [[postIds[0], 1], [postIds[1], 1]]) await api('/post/like', { method: 'POST', token: u1Jwt, body: { post_id: pid, score: sc } });
await api('/post/like', { method: 'POST', token: u2Jwt, body: { post_id: postIds[0], score: -1 } });
for (const cid of commentIds.slice(0, 3)) await api('/comment/like', { method: 'POST', token: u2Jwt, body: { comment_id: cid, score: 1 } });
console.log('[seed] votes posés');

// --- message privé admin → user1 (alimente /inbox) ---
const pm = await api('/private_message', {
  method: 'POST', token: adminJwt,
  body: { recipient_id: u1Id, content: 'Welcome to lemmy-bench — this is a seeded private message with a [link](https://example.com).' },
});
console.log(`[seed] mp#${pm.private_message_view.private_message.id} → bench_user1`);

// --- entrées modlog : remove + restore d'un post (raison incluse) ---
await api('/post/remove', { method: 'POST', token: adminJwt, body: { post_id: postIds[2], removed: true, reason: 'seed: modlog entry (temporary remove)' } });
await api('/post/remove', { method: 'POST', token: adminJwt, body: { post_id: postIds[2], removed: false } });
console.log('[seed] modlog alimenté (post remove/restore)');

// --- site settings : description + tagline (sidebar / légal peuplés) ---
await api('/site', {
  method: 'PUT', token: adminJwt,
  body: {
    name: 'lemmy-bench',
    sidebar: 'This is the **lemmy-bench** instance for the a11y loop. [Site docs](https://join-lemmy.org/docs)',
    description: 'Bench instance for cycle 55',
    taglines: ['seeded tagline for the bench'],
    enable_downvotes: true,
    private_instance: false,
  },
}).catch(e => console.warn('[seed] PUT /site:', e.message));

const info = {
  base: BASE,
  generated_at: new Date().toISOString(),
  admin: { username: 'lemmy' },
  users: [{ username: 'bench_user1', id: u1Id }, { username: 'bench_user2', id: u2Id }],
  community: { name: 'a11ybench', id: communityId },
  post_ids: postIds,
  comment_ids: commentIds,
  private_message_id: pm.private_message_view.private_message.id,
};
writeFileSync(join(DIR, 'seed-info.json'), JSON.stringify(info, null, 2));
console.log('[seed] OK → tools/seed-info.json');
console.log(JSON.stringify(info, null, 1));
