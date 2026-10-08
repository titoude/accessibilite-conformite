#!/usr/bin/env node
// reset-theme.mjs — restaure appTheme+dashboardTheme=dark (défaut amont)
// via l'API DisplayPreferences, avec attente symétrique (relecture jusqu'à
// valeur écrite == valeur lue). Lancé AVANT et APRÈS chaque run audit.mjs
// authentifié : les états mutants laissent 'light', une baseline ne doit
// jamais hériter de la mutation d'un run précédent.
//
// Usage : node tools/reset-theme.mjs <base-url> <storageState.json> [theme]
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(dirname(fileURLToPath(import.meta.url)), 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2];
const state = process.argv[3];
const theme = process.argv[4] || 'dark';
if (!base || !state) { console.error('usage: node reset-theme.mjs <base-url> <storageState.json> [theme]'); process.exit(2); }

const browser = await chromium.launch();
const context = await browser.newContext({ locale: 'en-US', storageState: state });
const page = await context.newPage();
await page.goto(`${base}/web/index.html#/home`, { waitUntil: 'load', timeout: 45000 });
const srv = await page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('jellyfin_credentials'))?.Servers?.[0] ?? null; }
  catch { return null; }
});
if (!srv?.AccessToken || !srv?.UserId) { console.error('pas de session dans le storageState'); process.exit(2); }
const headers = {
  Authorization: `MediaBrowser Client="devin-a11y", Device="devin", DeviceId="devin-a11y-41", Version="1.0", Token="${srv.AccessToken}"`,
  'Content-Type': 'application/json',
};
const url = `${base}/DisplayPreferences/usersettings?userId=${srv.UserId}&client=emby`;
const prefs = await (await page.request.get(url, { headers })).json();
prefs.CustomPrefs = { ...(prefs.CustomPrefs || {}), appTheme: theme, dashboardTheme: theme };
const res = await page.request.post(url, { data: prefs, headers });
if (!res.ok()) { console.error(`POST DisplayPreferences -> HTTP ${res.status()}`); process.exit(2); }
let ok = false;
for (let i = 0; i < 12; i++) {
  const again = await (await page.request.get(url, { headers })).json().catch(() => ({}));
  if (again?.CustomPrefs?.appTheme === theme && again?.CustomPrefs?.dashboardTheme === theme) { ok = true; break; }
  await page.waitForTimeout(500);
}
await browser.close();
if (!ok) { console.error(`theme=${theme} non relu côté serveur`); process.exit(2); }
console.log(`theme=${theme} (appTheme+dashboardTheme) relu côté serveur`);
