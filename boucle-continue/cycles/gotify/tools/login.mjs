/**
 * login.mjs — produit un storage-state Playwright pour Gotify.
 *
 * Usage: node login.mjs <baseUrl> <user> <pass> <out.json>
 *
 * POST /auth/local/login (basic auth + champ form `name`) pose un cookie de
 * session HttpOnly `gotify-client-token`. On le capture et on l'écrit dans un
 * storage-state — le même mécanisme que la page de login UI (qui appelle ce
 * endpoint), sans créer de client supplémentaire à chaque run de test.
 */
import { writeFileSync } from 'node:fs';

const [base, user, pass, out = 'auth.json'] = process.argv.slice(2);
if (!base || !user || !pass) {
  console.error('usage: node login.mjs <baseUrl> <user> <pass> <out.json>');
  process.exit(2);
}

// Chaque login crée un client 'devin-audit' dans /client — pour garder le seed
// déterministe entre les runs (baseline/final/rejeu auditeur), on purge les
// anciens clients du même nom AVANT de créer la session du run.
const basic = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
const clients = await (await fetch(`${base}/client`, {
  headers: { Authorization: basic },
})).json();
for (const c of clients) {
  if (c.name === 'devin-audit') {
    await fetch(`${base}/client/${c.id}`, {
      method: 'DELETE',
      headers: { Authorization: basic },
    });
  }
}

const res = await fetch(`${base}/auth/local/login`, {
  method: 'POST',
  headers: {
    Authorization: basic,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'name=devin-audit',
});
if (!res.ok) {
  console.error(`login failed: HTTP ${res.status}`, await res.text());
  process.exit(1);
}
const setCookie = res.headers.get('set-cookie') || '';
const m = setCookie.match(/gotify-client-token=([^;]+)/);
if (!m) {
  console.error('cookie gotify-client-token absent de la réponse');
  process.exit(1);
}
const token = m[1];

// Sanity check — le cookie doit authentifier tout de suite.
const origin = new URL(base);
const check = await fetch(`${base}/current/user`, {
  headers: { Cookie: `gotify-client-token=${token}` },
});
if (!check.ok) {
  console.error(`token rejected: HTTP ${check.status}`);
  process.exit(1);
}

const state = {
  cookies: [
    {
      name: 'gotify-client-token',
      value: token,
      domain: origin.hostname,
      path: '/',
      expires: -1,
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ],
  origins: [],
};
writeFileSync(out, JSON.stringify(state, null, 2));
console.log(`storageState -> ${out} (user ${user})`);
