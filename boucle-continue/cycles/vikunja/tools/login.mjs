/**
 * login.mjs — produit un storage-state Playwright pour Vikunja.
 *
 * Usage: node login.mjs <baseUrl> <user> <pass> <out.json>
 *
 * Ne PAS passer par la page de login : le front appelle /token/refresh
 * juste après connexion, ce qui invalide le token capturé (rotation).
 * On utilise POST /api/v1/login avec long_token=true — token API stable.
 */
import { writeFileSync } from 'node:fs';

const [base, user, pass, out = 'auth.json'] = process.argv.slice(2);
if (!base || !user || !pass) {
  console.error('usage: node login.mjs <baseUrl> <user> <pass> <out.json>');
  process.exit(2);
}

const res = await fetch(`${base}/api/v1/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: user, password: pass, long_token: true }),
});
if (!res.ok) {
  console.error(`login failed: HTTP ${res.status}`, await res.text());
  process.exit(1);
}
const { token } = await res.json();

// Sanity check — le token doit fonctionner tout de suite.
const check = await fetch(`${base}/api/v1/user`, {
  headers: { Authorization: `Bearer ${token}` },
});
if (!check.ok) {
  console.error(`token rejected: HTTP ${check.status}`);
  process.exit(1);
}

const origin = new URL(base).origin;
const state = {
  cookies: [],
  origins: [{
    origin,
    localStorage: [
      { name: 'token', value: token },
      { name: 'API_URL', value: origin },
      { name: 'hideAddToHomeScreenMessage', value: 'false' },
      { name: 'menuActiveDesktopPreference', value: 'true' },
    ],
  }],
};
writeFileSync(out, JSON.stringify(state, null, 2));
console.log(`storageState -> ${out} (user ${user})`);
