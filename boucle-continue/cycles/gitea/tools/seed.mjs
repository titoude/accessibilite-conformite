#!/usr/bin/env node
/**
 * seed.mjs — seed déterministe pour gitea (cycle 32).
 *
 * Crée via l'API REST (+ un vrai push git) :
 *   - org `a11yorg`, repo public `a11yorg/demo-repo` (issues/wiki/pulls activés)
 *   - user `alice` membre de l'org (team Owners)
 *   - labels, milestone, 4 issues dont 1 fermée + 1 avec lien markdown,
 *     1 PR ouverte (branch feature-x → main), 1 release, 1 page wiki
 *
 * Idempotent : les appels vérifient l'existence avant de créer (409/422 = déjà
 * là → skip). Les littéraux exacts sont figés ci-dessous.
 *
 * Usage : ADMIN_TOKEN=xxx node seed.mjs http://localhost:3232
 */
const BASE = process.argv[2] || 'http://localhost:3232';
const TOKEN = process.env.ADMIN_TOKEN;
if (!TOKEN) { console.error('ADMIN_TOKEN requis'); process.exit(2); }

const H = { 'Content-Type': 'application/json', Authorization: `token ${TOKEN}` };
const ok = r => r.status >= 200 && r.status < 300;
async function api(method, path, body) {
  const r = await fetch(`${BASE}/api/v1${path}`, {
    method, headers: H, body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  return { status: r.status, body: text ? JSON.parse(text) : null };
}
async function ensure(method, path, body, existsPath) {
  if (existsPath) {
    const g = await api('GET', existsPath);
    if (ok(g)) { console.log(`skip (existe) ${existsPath}`); return g; }
  }
  const r = await api(method, path, body);
  if (!ok(r) && r.status !== 409 && r.status !== 422) {
    console.error(`FAIL ${method} ${path} → ${r.status} ${JSON.stringify(r.body)}`);
    process.exitCode = 1;
  } else {
    console.log(`${ok(r) ? 'ok' : 'skip'} ${method} ${path} → ${r.status}`);
  }
  return r;
}

// ── org + user alice ────────────────────────────────────────────────────────
await ensure('POST', '/orgs', { username: 'a11yorg', visibility: 'public', full_name: 'A11y Demo Org' }, '/orgs/a11yorg');
await ensure('POST', '/admin/users', { username: 'alice', email: 'alice@example.local', password: 'AliceSeed1234!', must_change_password: false, visibility: 'public' }, '/users/alice');
// alice membre de l'org via la team Owners
const teams = await api('GET', '/orgs/a11yorg/teams');
const owners = (teams.body || []).find(t => t.name === 'Owners');
if (owners) await ensure('PUT', `/teams/${owners.id}/members/alice`, undefined, `/teams/${owners.id}/members/alice`);

// ── repo ────────────────────────────────────────────────────────────────────
await ensure('POST', '/orgs/a11yorg/repos', {
  name: 'demo-repo', description: 'Dépôt de démonstration pour l\u2019audit d\u2019accessibilité — contenu figé.',
  private: false, auto_init: false, has_issues: true, has_wiki: true, has_pull_requests: true,
  has_projects: true, has_releases: true, default_branch: 'main',
}, '/repos/a11yorg/demo-repo');

// ── vrai push git : README + fichier ─────────────────────────────────────────
import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const empty = (await api('GET', '/repos/a11yorg/demo-repo')).body?.empty;
if (empty !== false) {
  const dir = mkdtempSync(join(tmpdir(), 'gitea-seed-'));
  const readme = `# demo-repo

Dépôt de démonstration du cycle 32 de la boucle accessibilité.

Contenu réellement rendu : un [lien vers Gitea](https://about.gitea.com), une liste
et un bloc de code — tout ce que la règle « seed réaliste » exige.

- entrée un
- entrée deux

\`\`\`sh
echo hello
\`\`\`
`;
  writeFileSync(join(dir, 'README.md'), readme);
  writeFileSync(join(dir, 'main.go'), 'package main\n\nfunc main() { println("hi") }\n');
  const u = new URL(BASE);
  const url = `${u.protocol}//giteaadmin:${TOKEN}@${u.host}/a11yorg/demo-repo.git`;
  execSync(`cd ${dir} && git init -b main && git add -A && git -c user.email=admin@example.local -c user.name=giteaadmin commit -qm 'seed: initial commit' && git remote add origin '${url}' && git push -q origin main`, { stdio: 'inherit' });
  console.log('push main ok');
} else console.log('skip (repo non vide)');

// branche feature-x + PR
const hasBranch = await api('GET', '/repos/a11yorg/demo-repo/branches/feature-x');
if (!ok(hasBranch)) {
  const dir = mkdtempSync(join(tmpdir(), 'gitea-seed-fx-'));
  const u = new URL(BASE);
  const url = `${u.protocol}//giteaadmin:${TOKEN}@${u.host}/a11yorg/demo-repo.git`;
  execSync(`cd ${dir} && git clone -q '${url}' . && git checkout -qb feature-x && printf 'package main\\n// feature x\\n' > feature.go && git add feature.go && git -c user.email=admin@example.local -c user.name=giteaadmin commit -qm 'feature x' && git push -q origin feature-x`, { stdio: 'inherit' });
  console.log('push feature-x ok');
} else console.log('skip (feature-x existe)');
// ── labels + milestone + issues + release + wiki ─────────────────────────────
// labels : POST ne déduplique PAS par nom (201 + nouvel id à chaque run) —
// check explicite par nom pour rester idempotent.
const existingLabels = new Set((await api('GET', '/repos/a11yorg/demo-repo/labels')).body?.map(l => l.name));
const mkLabel = async l => {
  if (existingLabels.has(l.name)) { console.log(`skip label « ${l.name} »`); return; }
  await ensure('POST', '/repos/a11yorg/demo-repo/labels', l);
};
await mkLabel({ name: 'bug', color: '#ee0701', description: 'Quelque chose ne fonctionne pas' });
await mkLabel({ name: 'documentation', color: '#0052cc', description: 'Améliorations de doc' });
await ensure('POST', '/repos/a11yorg/demo-repo/milestones', { title: 'v1.0', description: 'Première version', due_on: '2027-01-01T00:00:00Z' }, '/repos/a11yorg/demo-repo/milestones?state=open');
const issues = await api('GET', '/repos/a11yorg/demo-repo/issues?type=issues');
const titles = new Set((issues.body || []).map(i => i.title));
const mkIssue = async (t, b, extra = {}) => {
  if (titles.has(t)) { console.log(`skip issue « ${t} »`); return; }
  await ensure('POST', '/repos/a11yorg/demo-repo/issues', { title: t, body: b, ...extra });
};
await mkIssue('Corriger le bouton de suppression', 'Le bouton ne réagit pas au clic. Voir [la doc](https://docs.gitea.com).', { labels: [1] });
await mkIssue('Documenter l’installation', 'Il manque une section sur SQLite.', { labels: [2], milestone: 1 });
await mkIssue('Améliorer le contraste des badges', 'Les badges gris sont peu lisibles en thème sombre.');
// `state` est ignoré au POST (quirk API connue) → create puis PATCH close.
await mkIssue('Fermer la faille connue', 'Corrigée dans le dernier commit.');
const closedIssue = await api('GET', '/repos/a11yorg/demo-repo/issues/4');
if (ok(closedIssue) && closedIssue.body.state === 'open') {
  await ensure('PATCH', '/repos/a11yorg/demo-repo/issues/4', { state: 'closed' });
}

// commentaire seedé sur l'issue #1 — requis pour la surface
// « menu contextuel d'un commentaire » (item Delete absent de la description).
const comments = await api('GET', '/repos/a11yorg/demo-repo/issues/1/comments');
if (!(comments.body || []).some(c => c.body?.includes('audit a11y'))) {
  await ensure('POST', '/repos/a11yorg/demo-repo/issues/1/comments', {
    body: 'Commentaire figé du seed pour audit a11y — avec **gras** et `code`.',
  });
} else console.log('skip commentaire #1');

// PR APRÈS les issues : la séquence issue/PR est partagée → index #5 figé
// (les urls pulls/5 du manifest en dépendent). Ne pas déplacer ce bloc.
const prs = await api('GET', '/repos/a11yorg/demo-repo/pulls?state=all');
if (!(prs.body || []).some(p => p.title === 'Ajouter la fonctionnalité X')) {
  await ensure('POST', '/repos/a11yorg/demo-repo/pulls', {
    title: 'Ajouter la fonctionnalité X', head: 'feature-x', base: 'main',
    body: 'PR de démonstration avec un [lien](https://about.gitea.com) et du texte **gras**.',
  });
} else console.log('skip (PR existe)');

await ensure('POST', '/repos/a11yorg/demo-repo/releases', {
  tag_name: 'v0.1.0', name: 'Version 0.1.0', body: 'Première release figée du seed.', target_commitish: 'main',
}, '/repos/a11yorg/demo-repo/releases/tags/v0.1.0');

const wikiHome = await api('GET', '/repos/a11yorg/demo-repo/wiki/page/Home');
if (!ok(wikiHome)) {
  await ensure('POST', '/repos/a11yorg/demo-repo/wiki/new', {
    title: 'Home', content_base64: Buffer.from('# Wiki demo-repo\n\nPage wiki de démonstration avec [un lien](https://about.gitea.com).\n').toString('base64'),
  });
} else console.log('skip wiki Home');

// ── repo secondaire pour /explore ────────────────────────────────────────────
await ensure('POST', '/user/repos', {
  name: 'notes-perso', description: 'Second dépôt listé dans Explore.', private: false,
  auto_init: true, has_issues: true, has_wiki: false,
}, '/repos/giteaadmin/notes-perso');

console.log('seed terminé');
