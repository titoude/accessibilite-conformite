// Deterministic theme+console-pref reset for phpMyAdmin.
// v4 : mutations via page.request.post (stack Node — jamais interceptée par
// page.route, partage le jar à cookies) + ajax_request=true (JSON 200, pas
// de 302 suivi à cookie périmé) + VERROU « aucun écrivain en vol » identique
// à audit.mjs : quiescence de toute requête index.php avant la mutation et
// avort de toute requête index.php pendant la fenêtre (la XHR ambiante
// /navigation annulait 1 mutation/122 au ré-audit v4).
// Usage: node reset-theme.mjs <base-url> [storageState]
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:8080';
const state = process.argv[3] ?? 'auth.json';
const PMA = '/public';

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: state });
const page = await ctx.newPage();

// Traçage de toute requête index.php + verrou de mutation.
// Map<request, {epoch, killedAt}> : une navigation tue le loader de
// l'ancien document — ses événements terminaux ne viennent jamais alors
// qu'Apache a servi les requêtes ; on les marque et on les libère après
// 2 s de grâce serveur (voir audit.mjs, même mécanisme).
const pendingIndexReqs = new Map();
let navEpoch = 0;
let prefMutationLock = 0;
const abortedInLock = new WeakSet();
page.on('request', r => {
  if (r.url().includes('index.php') && !abortedInLock.has(r)) pendingIndexReqs.set(r, { epoch: navEpoch, killedAt: 0 });
});
// 'response' libère la requête dès les en-têtes (middleware déjà exécuté) —
// un body non consommé ne doit pas bloquer la quiescence (voir audit.mjs).
page.on('response', r => { if (r.url().includes('index.php')) pendingIndexReqs.delete(r.request()); });
page.on('requestfinished', r => pendingIndexReqs.delete(r));
page.on('requestfailed', r => pendingIndexReqs.delete(r));
page.on('framenavigated', f => {
  if (f === page.mainFrame()) {
    navEpoch++;
    const now = Date.now();
    for (const e of pendingIndexReqs.values()) {
      if (e.epoch !== navEpoch && !e.killedAt) e.killedAt = now;
    }
  }
});
// v3 : bloque les XHR ambiantes qui passent par UserPreferencesLoading —
// /git-revision et /version-check partent avec le cookie d'avant mutation
// et leur middleware re-sauve l'ANCIEN thème en préférence serveur
// (course mesurée via docker logs dans audit.mjs).
for (const frag of ['/git-revision', '/version-check']) {
  await page.route(`**/index.php?route=${frag}**`, route => route.abort());
}
// Route de verrou EN DERNIER (évaluée en premier) : pendant une fenêtre de
// mutation, toute requête index.php (incl. /navigation et /console/update-config
// ambiant) est avortée ; hors verrou, fallback() rend la main aux blocages
// permanents et au réseau normal.
await page.route('**/index.php**', route =>
  prefMutationLock > 0
    ? (abortedInLock.add(route.request()), pendingIndexReqs.delete(route.request()), route.abort())
    : route.fallback());

const withPrefMutation = async fn => {
  prefMutationLock++;
  try {
    // Settle 300 ms puis quiescence des requêtes déjà en vol au verrou (les
    // nouvelles sont avortées par la route, inoffensives — voir audit.mjs).
    await new Promise(r => setTimeout(r, 300));
    const inFlightAtLock = new Set(pendingIndexReqs.keys());
    const deadline = Date.now() + 15000;
    while ([...inFlightAtLock].some(r => {
      const e = pendingIndexReqs.get(r);
      return e && !(e.killedAt && Date.now() - e.killedAt > 2000);
    })) {
      if (Date.now() > deadline) {
        throw new Error('requête(s) index.php pré-verrou encore en vol — écrivain de pref possible, mutation refusée');
      }
      await new Promise(r => setTimeout(r, 100));
    }
    return await fn();
  } finally {
    prefMutationLock--;
  }
};
const absUrl = page => new URL('index.php', page.url()).href;
const readToken = async page =>
  page.evaluate(() => document.querySelector('input[name=token]')?.value ?? '');
const postPref = (route, form) => withPrefMutation(async () => {
  const res = await page.request.post(absUrl(page) + '?route=' + route, {
    form: { ajax_request: 'true', server: '1', token: await readToken(page), ...form },
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    maxRedirects: 0,
  });
  if (!res.ok()) throw new Error(`${route} -> HTTP ${res.status()}`);
});

await page.goto(base + PMA + '/index.php?route=/themes', { waitUntil: 'load' });
// reset Console prefs d'abord (DarkTheme/Mode persistés serveur par
// console-dark-pmahomme) — doit courir même si le thème est déjà pmahomme/light.
await postPref('/console/update-config', { key: 'DarkTheme', value: 'false' });
await postPref('/console/update-config', { key: 'Mode', value: 'collapse' });
console.log('console prefs reset OK (DarkTheme=false, Mode=collapse)');

const current = await page.evaluate(() =>
  [...document.styleSheets].map(s => s.href).find(h => h.includes('/themes/')));
if (current && current.includes('/pmahomme/')) {
  const mode0 = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'));
  if (mode0 === 'light') {
    console.log('theme already pmahomme/light (DarkTheme=false)');
    await ctx.storageState({ path: state });
    await browser.close();
    process.exit(0);
  }
}
// POST /themes/set déterministe (ajax_request → JSON, cookie du contexte).
await postPref('/themes/set', { set_theme: 'pmahomme', themeColorMode: 'light' });
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(600);
const href = await page.evaluate(() => [...document.styleSheets].map(s => s.href).find(h => h.includes('/themes/')));
const mode = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'));
if (!href || !href.includes('/pmahomme/') || mode !== 'light') {
  throw new Error('theme not reset: ' + href + ' mode=' + mode);
}
console.log('theme reset OK: ' + href + ' mode=' + mode);
await ctx.storageState({ path: state });
await browser.close();
