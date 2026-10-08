#!/usr/bin/env node
/**
 * audit.mjs — audit d'accessibilité axe-core + Playwright.
 *
 * Usage :
 *   node audit.mjs <url-de-base>            # crawl same-origin (profondeur 1, max 50 pages)
 *   node audit.mjs --urls a,b,c              # liste explicite d'URLs
 *   node audit.mjs <url> --out dir           # dossier de sortie (défaut: ./a11y-audit)
 *   node audit.mjs <url> --max 20            # nb max de pages en crawl
 *   node audit.mjs <url> --depth 2           # profondeur de crawl (défaut 1)
 *   node audit.mjs <url> --wait 1500         # attente fixe (ms) après chargement
 *   node audit.mjs <url> --wait-for '#app'   # sélecteur REQUIS — absent => erreur de page
 *   node audit.mjs <url> --states all        # états dynamiques déclarés dans STATES
 *   node audit.mjs <url> --states nom1,nom2  # sous-ensemble explicite
 *   node audit.mjs <url> --states none       # déclare explicitement l'ABSENCE d'états
 *   node audit.mjs <url> --keep-hash         # conserve tous les fragments # (SPA hash-router)
 *   node audit.mjs <url> --storage-state f.json  # contexte authentifié Playwright
 *   node audit.mjs <url> --strict-incomplete # 'incomplete' axe compte comme erreur du gate
 *
 * États dynamiques : déclarez-les dans la carte STATES ci-dessous — ce sont les
 * vues invisibles au chargement (modales, drawers, toasts, onglets) qu'un audit
 * route-par-route ne voit jamais. Le scan tourne après le `setup` de chaque état.
 * `--states all` sur une carte vide est une ERREUR : déclarez les états ou
 * affirmez leur absence avec `--states none`.
 *
 * Prérequis : npm i -D playwright axe-core && npx playwright install chromium
 *
 * Sorties : <out>/report.json (violations + incomplete + métadonnées),
 *           <out>/report.md (trié par impact), <out>/scope.json (périmètre
 *           exécuté + hash — à comparer entre baseline et final).
 *
 * Exit code : 0 = périmètre complet sans violation ; 1 = violation(s) ;
 *             2 = périmètre incomplet ou erreur (config, navigation, injection,
 *                 précondition, HTTP >= 400, redirection login, état inconnu).
 *             Un PASS n'existe que si tout le périmètre demandé a été audité.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

// Résolution des deps depuis le répertoire tools/ du cycle (axe-core pin),
// indépendamment du CWD — les auditCommands du manifest sont rejoués depuis
// la racine du cycle.
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(dirname(fileURLToPath(import.meta.url)), 'package.json'));
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const VALUE_OPTIONS = new Set(['out', 'max', 'wait', 'wait-for', 'urls', 'depth', 'states', 'storage-state']);
const FLAG_OPTIONS = new Set(['keep-hash', 'strict-incomplete']);
const options = new Map();
const positional = [];
const configErrors = [];
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (!arg.startsWith('--')) { positional.push(arg); continue; }
  const name = arg.slice(2);
  if (!VALUE_OPTIONS.has(name) && !FLAG_OPTIONS.has(name)) {
    configErrors.push(`option inconnue : ${arg}`);
  } else if (options.has(name)) {
    configErrors.push(`option répétée : ${arg}`);
  } else if (FLAG_OPTIONS.has(name)) {
    options.set(name, true);
  } else if (args[i + 1] === undefined || args[i + 1].startsWith('--')) {
    configErrors.push(`valeur manquante : ${arg}`);
  } else {
    options.set(name, args[++i]);
  }
}
const opt = (name, dflt) => options.get(name) ?? dflt;
const flag = (name) => options.get(name) === true;
if (positional.length > 1) configErrors.push('une seule URL de base est permise');

const baseUrl = positional[0];
const urlsOpt = opt('urls', null);
// Les chemins relatifs (--urls /a,/b) sont résolus contre l'URL de base ;
// sans base résolvable c'est une erreur de config, pas un skip silencieux.
const explicitUrls = urlsOpt === null ? null : urlsOpt.split(',').map(s => s.trim()).filter(Boolean).map(u => {
  if (/^https?:\/\//i.test(u)) return u;
  if (baseUrl) { try { return new URL(u, baseUrl).href; } catch { return u; } }
  return u;
});
const outDir = resolve(opt('out', './a11y-audit'));
const maxPages = Number(opt('max', '50'));
const waitMs = Number(opt('wait', '0'));
const waitFor = opt('wait-for', null);
const depth = Number(opt('depth', '1'));
const statesOpt = opt('states', '');
const statesArg = statesOpt.split(',').map(s => s.trim()).filter(Boolean);
const keepHash = flag('keep-hash');
const strictIncomplete = flag('strict-incomplete');
const storageState = opt('storage-state', null);

if (!baseUrl && explicitUrls === null) {
  configErrors.push('URL manquante : node audit.mjs <url> | --urls u1,u2,...');
}
for (const [name, value, minimum] of [['max', maxPages, 1], ['wait', waitMs, 0], ['depth', depth, 0]]) {
  if (!Number.isSafeInteger(value) || value < minimum) configErrors.push(`--${name} doit être un entier >= ${minimum}`);
}
if (!statesArg.length) configErrors.push('déclarer les états : --states all|nom1,nom2|none');
if (explicitUrls !== null && explicitUrls.length === 0) {
  configErrors.push('--urls fourni mais vide : aucune page demandée ne peut produire un audit PASS');
}
if (explicitUrls && explicitUrls.some(u => !/^https?:\/\//.test(u))) {
  configErrors.push('--urls contient des chemins relatifs sans URL de base résolvable');
}
if (statesArg.includes('none') && statesArg.length > 1) {
  configErrors.push("--states none ne se combine pas avec d'autres états");
}

// Axe rule tags : WCAG 2.2 A+AA + best practice. Voir https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
const RULE_TAGS = ['wcag2a', 'wcag2a-best-practice', 'wcag2aa', 'wcag2aa-best-practice', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const RUNNER_VERSION = 'audit.mjs v7-jellyfin';

// axe-core réellement injecté — épinglé dans tools/package.json, lu depuis
// node_modules : une dérive de version entre baseline et final invaliderait
// la comparaison, donc elle est inscrite dans scope.json ET report.json.
const AXE_VERSION = require('axe-core/package.json').version;

/**
 * États dynamiques audités via --states all | nom1,nom2. Le scan axe tourne
 * APRÈS `setup` + `stateProof`, sur le DOM résultant — couvre les composants
 * invisibles au chargement (modale, drawer, menu, autocomplete), angle mort
 * d'un audit route-par-route. `url(b)` reçoit l'origine de base.
 *
 * Leçon 32 : chaque `setup` s'appuie sur un sélecteur DÉTERMINISTE (texte
 * visible ou aria-label du déclencheur, jamais nth/index structurel seul)
 * ET `stateProof` vérifie un descendant/texte EXCLUSIF au widget ouvert —
 * sinon l'état est FAIL (pas de scan sur une page qui n'affiche pas l'état).
 */

// Préférences jellyfin : appTheme + dashboardTheme vivent dans
// CustomPrefs des DisplayPreferences utilisateur, lues/écrites par
// l'API /DisplayPreferences/usersettings (auth = jeton dans
// localStorage jellyfin_credentials, PAS des cookies — l'en-tête
// Authorization doit donc être reconstruit explicitement). Mutation
// serveur puis reload : le thème est appliqué au boot par
// themeManager (html[data-theme]). Attente symétrique : relecture
// jusqu'à valeur écrite == valeur lue.
const getCreds = async (page) => await page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('jellyfin_credentials'))?.Servers?.[0] ?? null; }
  catch { return null; }
});

// Mécanisme thème amont (vérifié dans src/) :
// - `theme`   : appTheme en LOCALSTORAGE `<uid>-appTheme` — userSettings.theme()
//               lit appSettings (enableOnServer=false), JAMAIS le serveur.
// - `dashboardTheme` : CustomPrefs serveur via POST /DisplayPreferences.
// La mutation doit donc écrire les DEUX emplacements, puis purger le cache
// react-query persisté (IndexedDB) avant reload pour ne pas re-servir
// d'anciennes prefs au dashboard.
const setJellyfinTheme = async (page, theme) => {
  const srv = await getCreds(page);
  if (!srv?.AccessToken || !srv?.UserId) throw new Error('setJellyfinTheme : pas de session dans jellyfin_credentials');
  await page.evaluate(([uid, t]) => localStorage.setItem(`${uid}-appTheme`, t), [srv.UserId, theme]);
  const headers = {
    Authorization: `MediaBrowser Client="devin-a11y", Device="devin", DeviceId="devin-a11y-41", Version="1.0", Token="${srv.AccessToken}"`,
    'Content-Type': 'application/json',
  };
  const url = `${new URL(page.url()).origin}/DisplayPreferences/usersettings?userId=${srv.UserId}&client=emby`;
  const r1 = await page.request.get(url, { headers });
  if (!r1.ok()) throw new Error(`GET DisplayPreferences -> HTTP ${r1.status()}`);
  const prefs = await r1.json();
  prefs.CustomPrefs = { ...(prefs.CustomPrefs || {}), appTheme: theme, dashboardTheme: theme };
  const r2 = await page.request.post(url, { data: prefs, headers });
  if (!r2.ok()) throw new Error(`POST DisplayPreferences -> HTTP ${r2.status()}`);
  for (let i = 0; i < 12; i++) {
    const again = await (await page.request.get(url, { headers })).json().catch(() => ({}));
    if (again?.CustomPrefs?.dashboardTheme === theme) break;
    if (i === 11) throw new Error(`theme=${theme} non relu côté serveur — mutation non appliquée`);
    await page.waitForTimeout(500);
  }
  // purge IndexedDB (jellyfin-query-cache persisté par idb-keyval)
  await page.evaluate(() => (indexedDB.databases
    ? indexedDB.databases()
    : Promise.resolve([{ name: 'keyval-store' }]))
    .then(list => Promise.all(list.map(d => new Promise(res => {
      const rq = indexedDB.deleteDatabase(d.name);
      rq.onsuccess = rq.onerror = rq.onblocked = () => res();
    })))));
};

// États dynamiques jellyfin — tout le map tourne dans le contexte du run.
// Auth : storageState auth.json (jeton dans jellyfin_credentials).
// Public : deux contextes — public.json (serveur sélectionné, SANS jeton)
// et contexte nu (aucun serveur) — car ConnectionRequired redirige :
// avec serveur → #/login ; sans serveur → #/selectserver.
// Les MUTANTS sont en fin de liste : theme-light* (mutation
// DisplayPreferences, restore dans mobile-nav-390) puis mobile-nav-390
// (restore theme=dark + viewport 390px) — TOUJOURS dernier mutant.
// reset-theme.mjs tourne avant/après chaque scan.
export const STATES = {
  // ---- Auth : menus et popovers de l'app ----
  'nav-user-menu': {
    url: b => `${b}/web/#/home`,
    setup: async page => {
      // déclencheur déterministe : aria-label « User Menu » (AppToolbar)
      await page.waitForSelector('button[aria-label="User Menu"]', { state: 'visible' });
      await page.locator('button[aria-label="User Menu"]').first().click();
    },
    stateProof: async page => {
      // preuve exclusive : menu MUI #app-user-menu avec item « Settings »
      await page.waitForSelector('#app-user-menu', { state: 'visible', timeout: 5000 });
      await page.waitForSelector('#app-user-menu >> text=Settings', { state: 'visible', timeout: 5000 });
    },
  },
  'filter-popover': {
    url: b => `${b}/web/#/movies?tab=0`,
    setup: async page => {
      await page.waitForSelector('button[title="Filter"]', { state: 'visible' });
      await page.locator('button[title="Filter"]').first().click();
    },
    stateProof: async page => {
      // preuve : accordion exclusif du popover de filtres
      await page.waitForSelector('#filter-popover #filtersStatus-header >> text=Filters', { state: 'visible', timeout: 5000 });
    },
  },
  'sort-popover': {
    url: b => `${b}/web/#/movies?tab=0`,
    setup: async page => {
      await page.waitForSelector('button[title="Sort"]', { state: 'visible' });
      await page.locator('button[title="Sort"]').first().click();
    },
    stateProof: async page => {
      await page.waitForSelector('#sort-popover', { state: 'visible', timeout: 5000 });
      await page.waitForSelector('#sort-popover >> text=Name', { state: 'visible', timeout: 5000 });
    },
  },
  'view-settings-popover': {
    url: b => `${b}/web/#/movies?tab=0`,
    setup: async page => {
      await page.waitForSelector('button[title="View settings"]', { state: 'visible' });
      await page.locator('button[title="View settings"]').first().click();
    },
    stateProof: async page => {
      // popover vue : item « Grid view » exclusif au widget
      await page.waitForSelector('.MuiPopover-root >> text=Grid view', { state: 'visible', timeout: 5000 });
    },
  },
  'card-context-menu': {
    url: b => `${b}/web/#/movies?tab=0`,
    setup: async page => {
      // carte seedée « Alpha Squadron » : bouton More du card (actionSheet legacy)
      const card = page.locator('.card:has(a:text-is("Alpha Squadron"))').first();
      await card.waitFor({ state: 'visible' });
      await card.locator('button.itemAction[data-action="menu"]').first().click();
    },
    stateProof: async page => {
      // actionSheet legacy (dialogHelper) : titre de feuille + item « Play »
      await page.waitForSelector('.actionSheet', { state: 'visible', timeout: 8000 });
      await page.waitForSelector('.actionSheet >> text=Play', { state: 'visible', timeout: 5000 });
    },
  },
  'syncplay-menu': {
    url: b => `${b}/web/#/home`,
    setup: async page => {
      await page.waitForSelector('button[aria-label="SyncPlay"]', { state: 'visible' });
      await page.locator('button[aria-label="SyncPlay"]').first().click();
    },
    stateProof: async page => {
      await page.waitForSelector('#app-sync-play-menu', { state: 'visible', timeout: 5000 });
      await page.waitForSelector('#app-sync-play-menu >> text=Create a new group', { state: 'visible', timeout: 5000 });
    },
  },
  'cast-menu': {
    url: b => `${b}/web/#/home`,
    setup: async page => {
      // le bouton peut être détaché par un re-render React juste après le
      // clic (chargement async du plugin chromecast) — re-cliquer si le
      // menu ne s'est pas ouvert.
      for (let i = 0; i < 3; i++) {
        await page.waitForSelector('button[aria-label="Cast to Device"]', { state: 'visible' });
        await page.locator('button[aria-label="Cast to Device"]').first().click().catch(() => {});
        try {
          await page.waitForSelector('#app-remote-play-menu .MuiMenuItem-root', { state: 'visible', timeout: 3000 });
          return;
        } catch { /* re-clic */ }
      }
    },
    stateProof: async page => {
      await page.waitForSelector('#app-remote-play-menu', { state: 'visible', timeout: 8000 });
      // le menu cast est keepMounted (items présents mais cachés quand
      // fermé) — la preuve est un item VISIBLE ; le libellé varie selon
      // l'état de chargement du plugin chromecast (« Google Cast
      // Unsupported », « No cast targets available », ou cible réelle).
      await page.waitForSelector('#app-remote-play-menu .MuiMenuItem-root', { state: 'visible', timeout: 8000 });
    },
  },
  // ---- Auth : dashboard admin (menus + dialogs MUI + dialog legacy) ----
  'dash-library-menu': {
    url: b => `${b}/web/#/dashboard/libraries`,
    setup: async page => {
      // carte bibliothèque seedée « Movies » : IconButton (kebab) — cible
      // scope, pas nth : la seed garantit les cartes Movies + Shows
      const card = page.locator('.MuiCard-root:has-text("Movies")').first();
      await card.waitFor({ state: 'visible' });
      await card.locator('button.MuiIconButton-root').first().click();
    },
    stateProof: async page => {
      await page.waitForSelector('.MuiMenu-root >> text=Scan library', { state: 'visible', timeout: 5000 });
    },
  },
  'dash-rename-dialog': {
    url: b => `${b}/web/#/dashboard/libraries`,
    setup: async page => {
      const card = page.locator('.MuiCard-root:has-text("Movies")').first();
      await card.waitFor({ state: 'visible' });
      await card.locator('button.MuiIconButton-root').first().click();
      await page.waitForSelector('.MuiMenu-root >> text=Rename', { state: 'visible', timeout: 5000 });
      await page.locator('.MuiMenu-root >> text=Rename').first().click();
    },
    stateProof: async page => {
      // InputDialog MUI : role=dialog + champ nom (on NE soumet PAS)
      await page.waitForSelector('[role="dialog"] >> text=Rename', { state: 'visible', timeout: 5000 });
      await page.waitForSelector('[role="dialog"] input', { state: 'visible', timeout: 5000 });
    },
  },
  'dash-confirm-remove': {
    url: b => `${b}/web/#/dashboard/libraries`,
    setup: async page => {
      const card = page.locator('.MuiCard-root:has-text("Movies")').first();
      await card.waitFor({ state: 'visible' });
      await card.locator('button.MuiIconButton-root').first().click();
      await page.waitForSelector('.MuiMenu-root >> text=Remove', { state: 'visible', timeout: 5000 });
      await page.locator('.MuiMenu-root >> text=Remove').first().click();
    },
    stateProof: async page => {
      // ConfirmDialog : titre « Remove media folder » + bouton Delete —
      // la suppression N'EST JAMAIS soumise (dialogue seulement ouvert)
      await page.waitForSelector('[role="dialog"] >> text=Remove media folder', { state: 'visible', timeout: 5000 });
      await page.waitForSelector('[role="dialog"] >> text=Delete', { state: 'visible', timeout: 5000 });
    },
  },
  'add-media-library-dialog': {
    url: b => `${b}/web/#/dashboard/libraries`,
    setup: async page => {
      await page.waitForSelector('button:has-text("Add Media Library")', { state: 'visible' });
      await page.locator('button:has-text("Add Media Library")').first().click();
    },
    stateProof: async page => {
      // MediaLibraryEditor : dialog LEGACY (dialogHelper .dialog .formDialog)
      await page.waitForSelector('.dialog >> text=Add Media Library', { state: 'visible', timeout: 8000 });
      await page.waitForSelector('.dialog select, .dialog input', { state: 'visible', timeout: 5000 });
    },
  },
  // MUTANT : theme=light persisté (appTheme + dashboardTheme). Restauré
  // par mobile-nav-390 → dark, qui est la valeur amont par défaut.
  'theme-light': {
    url: b => `${b}/web/#/home`,
    setup: async page => {
      await setJellyfinTheme(page, 'light');
      await page.reload({ waitUntil: 'load' });
    },
    stateProof: async page => {
      // thème matérialisé : html[data-theme=light] posé par themeManager
      await page.waitForSelector('html[data-theme="light"]', { state: 'attached', timeout: 10000 });
    },
  },
  // MUTANT : actionSheet (famille composant legacy) × thème light (L20).
  'theme-light-dialog': {
    url: b => `${b}/web/#/movies?tab=0`,
    setup: async page => {
      await setJellyfinTheme(page, 'light');
      await page.reload({ waitUntil: 'load' });
      const card = page.locator('.card:has(a:text-is("Alpha Squadron"))').first();
      await card.waitFor({ state: 'visible' });
      await card.locator('button.itemAction[data-action="menu"]').first().click();
    },
    stateProof: async page => {
      await page.waitForSelector('html[data-theme="light"]', { state: 'attached', timeout: 10000 });
      await page.waitForSelector('.actionSheet', { state: 'visible', timeout: 8000 });
    },
  },
  // MUTANT : dashboard (dashboardTheme) × light — page admin en light.
  'theme-light-dash': {
    url: b => `${b}/web/#/dashboard/libraries`,
    setup: async page => {
      await setJellyfinTheme(page, 'light');
      await page.reload({ waitUntil: 'load' });
    },
    stateProof: async page => {
      await page.waitForSelector('html[data-theme="light"]', { state: 'attached', timeout: 10000 });
      await page.waitForSelector('.MuiCard-root:has-text("Movies")', { state: 'visible', timeout: 15000 });
    },
  },
  // MUTANT FINAL : restore theme=dark (attente symétrique) + viewport
  // 390px + drawer mobile (SwipeableDrawer) ouvert. TOUJOURS dernier.
  'mobile-nav-390': {
    url: b => `${b}/web/#/home`,
    setup: async page => {
      await setJellyfinTheme(page, 'dark');
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload({ waitUntil: 'load' });
      await page.waitForSelector('button[aria-label="Open Menu"]', { state: 'visible' });
      await page.locator('button[aria-label="Open Menu"]').first().click();
    },
    stateProof: async page => {
      // drawer mobile ouvert : lien « Favorites » exclusif au drawer papier
      await page.waitForSelector('.MuiDrawer-paper >> text=Favorites', { state: 'visible', timeout: 8000 });
    },
  },
  // ---- Public : navigation SPA depuis la page login (liens réels) ----
  'forgot-password-form': {
    url: b => `${b}/web/#/login`,
    setup: async page => {
      // navigation SPA (le chargement direct de #/forgotpassword rebondit
      // vers #/login chez l'amont — cf. ConnectionRequired ServerSignIn)
      await page.waitForSelector('button.btnForgotPassword', { state: 'visible' });
      await page.locator('button.btnForgotPassword').first().click();
    },
    stateProof: async page => {
      await page.waitForSelector('h1:has-text("Forgot Password")', { state: 'visible', timeout: 8000 });
      // les inputs de la page login restent montés (cachés) en DOM —
      // scoper la preuve sur la page VISIBLE pour ne pas matcher un
      // input de l'ancienne page.
      await page.waitForSelector('.page:not(.hide) input', { state: 'visible', timeout: 5000 });
    },
  },
};

if (statesArg.includes('all') && Object.keys(STATES).length === 0) {
  configErrors.push("--states all demandé mais STATES est vide : déclarez les états dynamiques, ou affirmez leur absence avec '--states none'");
}
const unknownStates = statesArg.filter(s => s !== 'all' && s !== 'none' && !(s in STATES));
if (unknownStates.length) {
  configErrors.push(`état(s) demandé(s) inconnu(s) : ${unknownStates.join(', ')} (déclarés : ${Object.keys(STATES).join(', ') || 'aucun'})`);
}

function sameOrigin(u, origin) {
  try { return new URL(u).origin === origin; } catch { return false; }
}

// Un fragment n'est une ANCRE effaçable que s'il ne ressemble pas à une route
// de hash-router (#/x, #!/x, #$:/x, #x/y). #HelloThere (TiddlyWiki) ressemble à
// une ancre mais est une route : utiliser --keep-hash ou --urls sur ces apps.
function normalizeForDedup(u) {
  try {
    const url = new URL(u);
    if (keepHash) return url.href;
    const h = url.hash;
    if (!h) return url.href;
    return /[\/!:$]/.test(h) ? url.href : url.href.split('#')[0];
  } catch { return u; }
}

async function collectUrls(page, startUrl, origin, maxDepth, limit, crawlErrors) {
  const seen = new Set([normalizeForDedup(startUrl)]);
  const queue = [{ url: startUrl, d: 0 }];
  while (queue.length && seen.size < limit) {
    const { url, d } = queue.shift();
    if (d >= maxDepth) continue;
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      const links = await page.$$eval('a[href]', els => els.map(e => e.href));
      for (const l of links) {
        const clean = normalizeForDedup(l);
        if (sameOrigin(clean.split('#')[0], origin) && !seen.has(clean) && seen.size < limit
            && !/\.(png|jpe?g|gif|svg|webp|pdf|zip|css|js|ico|woff2?|mp[34]|xml|json)(\?|#|$)/i.test(clean)) {
          seen.add(clean);
          queue.push({ url: clean, d: d + 1 });
        }
      }
    } catch (e) {
      crawlErrors.push(`[crawl] ${url}: ${e.message}`);
      console.error(`[crawl] ${url}: ${e.message}`);
    }
  }
  return [...seen];
}

const LOGIN_PATH = /\/(login|signin|sign-in|sign_in|auth|connexion)\b/i;

const runId = randomUUID();

// Écriture atomique : tmp + rename — un reader ne voit jamais un fichier
// partiellement écrit, et les preuves portent le runId du run courant.
function writeJson(file, obj) {
  const tmp = resolve(outDir, file + '.tmp');
  writeFileSync(tmp, JSON.stringify(obj, null, 2));
  renameSync(tmp, resolve(outDir, file));
}
function writeText(file, text) {
  const tmp = resolve(outDir, file + '.tmp');
  writeFileSync(tmp, text);
  renameSync(tmp, resolve(outDir, file));
}

// Écrit un résultat d'erreur atomique : un audit dont la config est invalide
// (ou dont le navigateur n'a pas démarré) produit quand même scope.json/
// report.json/report.md du RUN COURANT — jamais un rapport ancien laissé
// en place et réutilisé par erreur.
function writeErrorReports(configErrors, crawlErrors) {
  mkdirSync(outDir, { recursive: true });
  const scopeHash = createHash('sha256').update('[]').digest('hex');
  const now = new Date().toISOString();
  writeJson('scope.json', {
    runId, runnerVersion: RUNNER_VERSION, generatedAt: now,
    baseUrl: baseUrl ?? null, depth, maxPages,
    statesRequested: statesArg, wait: waitMs, waitFor,
    storageState: !!storageState,
    total: 0, audited: 0, errored: 0, crawlErrors, configErrors,
    scopeHash, scenarios: [],
  });
  writeJson('report.json', {
    runId, runnerVersion: RUNNER_VERSION, generatedAt: now,
    baseUrl: baseUrl ?? null,
    pages: [], configErrors, crawlErrors, scopeHash,
  });
  let md = `# Audit accessibilité — ${now.slice(0, 10)}\n\n`;
  md += `**0 scénario audité — ${configErrors.length + crawlErrors.length} erreur(s) de configuration/périmètre. Exit code 2.**\n\n`;
  for (const e of configErrors) md += `- config : ${e}\n`;
  for (const e of crawlErrors) md += `- ${e}\n`;
  writeText('report.md', md);
}

async function run() {
  mkdirSync(outDir, { recursive: true });
  // Toute la config est validée AVANT d'exécuter quoi que ce soit —
  // sinon un état inconnu planterait après le début des rapports.
  if (configErrors.length) {
    writeErrorReports(configErrors, []);
    for (const e of configErrors) console.error(`[config] ${e}`);
    process.exit(2);
  }
  const results = [];
  const crawlErrors = [];

  const browser = await chromium.launch();
  // locale 'en-US' : navigator.language hérite 'en-US@posix' de l'env de cette
  // VM (artefact) — jellyfin-web globalize l'utilise et toLocaleString() lève
  // RangeError sur plusieurs pages. Le contexte locale fige un tag BCP47 valide.
  const context = await browser.newContext({ locale: 'en-US', ...(storageState ? { storageState } : {}) });
  const page = await context.newPage();

  if (storageState) {
    // Normalise l'instance avant le premier scan : appTheme/dashboardTheme
    // sont persistés côté serveur — un run précédent peut laisser « light »
    // et fausser la mesure (défaut amont = dark). Seulement si le
    // storageState porte une session (public.json n'a PAS de jeton).
    await page.goto(baseUrl, { waitUntil: 'load', timeout: 30000 });
    const srv = await getCreds(page);
    if (srv?.AccessToken) {
      await setJellyfinTheme(page, 'dark');
      await page.reload({ waitUntil: 'load', timeout: 30000 });
    }
  }

  // Suivi de la dernière réponse de NAVIGATION du document principal : un clic
  // dans un setup (ou un reload) déclenche une vraie navigation dont goto() ne
  // rend pas la réponse — sans ce suivi, un HTTP 500 déclenché pendant setup
  // était invisible et le scan partait sur la page d'erreur (v4).
  let lastNavResponse = null;
  if (typeof page.on === 'function') {
    page.on('response', (r) => {
      try {
        if (r.request().isNavigationRequest() && r.frame() === page.mainFrame()) lastNavResponse = r;
      } catch { /* frame/request détachés */ }
    });
  }

  let urls;
  if (explicitUrls !== null) {
    urls = explicitUrls;
  } else {
    const origin = new URL(baseUrl).origin;
    console.log(`[crawl] ${baseUrl} (depth=${depth}, max=${maxPages})`);
    urls = await collectUrls(page, baseUrl, origin, depth, maxPages, crawlErrors);
    console.log(`[crawl] ${urls.length} page(s)`);
    if (urls.length === 0) crawlErrors.push('crawl : aucune page découverte');
  }

  const axePath = require.resolve('axe-core/axe.min.js');
  const axeSource = readFileSync(axePath, 'utf8');

  // Injection d'axe : addScriptTag crée un élément <script> soumis à la CSP
  // de la page ; une CSP stricte (script-src 'self') le bloque. Repli :
  // évaluer la source axe directement dans le contexte de la page (CDP,
  // non soumis à la CSP), puis prouver que l'injection a marché — sinon
  // axe.run() est indéfini et le « 0 violation » serait un faux PASS.
  const injectAxe = async () => {
    try {
      await page.addScriptTag({ content: axeSource });
    } catch {
      await page.evaluate(axeSource);
    }
    if (typeof (await page.evaluate(() => window.axe && window.axe.version)) !== 'string') {
      throw new Error("injection axe impossible (CSP ?) — scan invalide, pas un PASS");
    }
  };

  // axe mesure les couleurs calculées — une transition en cours (fondu
  // d'entrée, élévation d'un élément animé…) produit des violations
  // color-contrast fantômes qui disparaissent au re-scan. On attend la fin
  // des animations/transitions FINIES ; les animations infinies (spinner)
  // ne bloquent pas le scan. Attente best-effort : un dépassement n'est
  // pas une erreur, le scan reste valide.
  const settleAnimations = async () => {
    try {
      await page.waitForFunction(
        () => document.getAnimations().every((a) => {
          if (a.playState !== 'running') return true;
          const t = a.effect.getComputedTiming();
          return a.transitionProperty == null && t.iterations === Infinity;
        }),
        { timeout: 4000, polling: 100 },
      );
    } catch { /* animations longues/infinies : le scan part quand même */ }
  };

  const scanPage = async () => {
    await settleAnimations();
    await injectAxe();
    return await page.evaluate(async (tags) => {
      return await window.axe.run(document, {
        runOnly: { type: 'tag', values: tags },
        resultTypes: ['violations', 'incomplete'],
      });
    }, RULE_TAGS);
  };

  const recordPage = (entry) => results.push(entry);

  // Contrôle commun à TOUTE navigation : statut HTTP de la dernière
  // navigation du document principal + identité de l'URL finale
  // (redirection login = la page demandée n'a pas été auditée).
  // response null → on retombe sur lastNavResponse (navigations déclenchées
  // par un setup ou un JS, dont goto() ne rend pas la réponse).
  const checkNav = (response, requested) => {
    const httpStatus = response ? response.status()
      : (lastNavResponse && lastNavResponse.url() === page.url() ? lastNavResponse.status() : null);
    const finalUrl = page.url();
    let error = null;
    if (httpStatus !== null && httpStatus >= 400) {
      error = `HTTP ${httpStatus}`;
    } else if (LOGIN_PATH.test(finalUrl) && !LOGIN_PATH.test(requested)) {
      error = `redirection vers une page de connexion (${finalUrl}) — la page demandée n'a pas été auditée`;
    }
    return { httpStatus, finalUrl, error };
  };

  // Préconditions métier rejouées sur le document courant : --wait-for sur
  // le document FINAL, pas seulement sur le document avant rechargement.
  const applyPreconditions = async () => {
    if (waitFor) {
      await page.waitForSelector(waitFor, { timeout: 15000 }); // précondition : non avalée
    }
    if (waitMs) await page.waitForTimeout(waitMs);
  };

  const auditLocation = async (label, gotoUrl, extraSetup) => {
    const entry = { url: label, requestedUrl: gotoUrl, violations: [], incomplete: [] };
    lastNavResponse = null;
    try {
      // Hash-router SPA : un goto vers un autre fragment du MÊME document
      // ne recharge pas — les pages précédentes restent en cache dans le DOM
      // et un --wait-for structurel matcherait l'ancienne page (leçon 34,
      // garde hydratation). On force un document neuf via about:blank.
      await page.goto('about:blank');
      const nav = checkNav(await page.goto(gotoUrl, { waitUntil: 'load', timeout: 30000 }), gotoUrl);
      entry.httpStatus = nav.httpStatus;
      entry.finalUrl = nav.finalUrl;
      if (nav.error) {
        entry.error = nav.error;
      } else {
        await applyPreconditions();
        if (extraSetup) {
          // Le setup peut re-naviguer (état dynamique) : sa navigation est
          // re-contrôlée, et l'URL post-setup aussi — le document scanné
          // est celui qui compte, pas celui de la première navigation.
          const nav2 = await extraSetup(page, checkNav);
          if (nav2) {
            entry.httpStatus = nav2.httpStatus ?? entry.httpStatus;
            entry.finalUrl = nav2.finalUrl;
            if (nav2.error) entry.error = nav2.error;
          }
        }
        // Re-vérification SYSTÉMATIQUE du document final (pages comme états) :
        // couvre la nav pendant setup, la redirection login différée pendant
        // --wait, et applique les préconditions sur le document réellement
        // scanné — pas celui d'avant rechargement.
        if (!entry.error && extraSetup) await applyPreconditions();
        const post = checkNav(null, gotoUrl);
        entry.httpStatus = post.httpStatus ?? entry.httpStatus;
        entry.finalUrl = post.finalUrl;
        if (!entry.error && post.error) entry.error = post.error;
        if (!entry.error) {
          try {
            const req = new URL(gotoUrl), fin = new URL(post.finalUrl);
            if (fin.origin !== req.origin) {
              entry.error = `navigation hors origine avant le scan (${post.finalUrl})`;
            } else if (fin.pathname !== req.pathname) {
              // Un setup qui change de PAGE (pas seulement de hash/query)
              // scanne un autre document que celui demandé — couvre les
              // erreurs serveur déclenchées par un clic dont le statut
              // HTTP n'est pas observable (ex. '.../server-error').
              entry.error = `le document final diffère du document demandé (${post.finalUrl}) — déclarer l'URL réelle de l'état dans STATES`;
            }
          } catch { /* URL exotique : déjà couvert par les autres contrôles */ }
        }
        if (!entry.error) {
          const res = await scanPage();
          if (!res || !Array.isArray(res.violations)) {
            entry.error = 'résultat axe mal formé (pas de liste violations) — scan invalide, pas un PASS';
          } else {
            entry.violations = res.violations;
            entry.incomplete = res.incomplete || [];
            entry.testEngine = res.testEngine || null;
            if (strictIncomplete && entry.incomplete.length) {
              entry.error = `${entry.incomplete.length} résultat(s) axe 'incomplete' (--strict-incomplete)`;
            }
          }
        }
      }
      console.log(`[scan] ${label} — ${entry.error ? 'ERREUR ' + entry.error : `${entry.violations.length} règle(s) violée(s)` + (entry.incomplete.length ? `, ${entry.incomplete.length} incomplete` : '')}`);
    } catch (e) {
      entry.error = e.message;
      console.error(`[scan] ${label}: ${e.message}`);
    }
    recordPage(entry);
  };

  for (const url of urls) {
    await auditLocation(url, url, null);
  }

  // États dynamiques : chaque état repart d'un document neuf — en navigation
  // par hash (SPA), un goto sur le même document ne recharge pas et l'état
  // précédent (drawer ouvert…) persisterait.
  const wanted = statesArg.includes('all') ? Object.keys(STATES) : statesArg.filter(s => s !== 'none');
  if (wanted.length) {
    const origin = baseUrl ? new URL(baseUrl).origin : new URL(urls[0]).origin;
    for (const name of wanted) {
      const st = STATES[name];
      const label = `${st.url(origin)} [state:${name}]`;
      // La 2e navigation (rechargement à neuf) est contrôlée comme la 1re :
      // HTTP >= 400 ou redirection login => erreur, le scan ne tourne pas
      // sur la mauvaise page. Le contrôle post-setup (statut via
      // lastNavResponse, identité d'URL, préconditions re-jouées) est fait
      // par auditLocation lui-même sur le document final.
      await auditLocation(label, st.url(origin), async (p, check) => {
        await p.goto('about:blank');
        const nav2 = check(await p.goto(st.url(origin), { waitUntil: 'load', timeout: 30000 }), st.url(origin));
        if (nav2.error) return nav2;
        await st.setup(p);
        // Leçon 32 : preuve que le widget est RÉELLEMENT ouvert —
        // descendant/texte exclusif absent => l'état échoue (FAIL, pas
        // de scan sur une page qui n'affiche pas l'état demandé).
        if (typeof st.stateProof === 'function') {
          try {
            await st.stateProof(p);
          } catch (e) {
            return { error: `stateProof échoué (${name}) : ${e.message}` };
          }
        }
        const nav3 = check(null, st.url(origin));
        return nav3.error ? nav3 : nav2;
      });
    }
  }

  await browser.close();

  // Périmètre exécuté : identifiant = url demandée + statut. scope.json permet
  // de comparer l'ensemble EXACT des scénarios entre baseline et final — une
  // somme égale de pages ne prouve pas l'identité des ensembles.
  const scenarioId = (e) => e.url;
  const scopeEntries = results.map(e => ({
    id: scenarioId(e), status: e.error ? 'error' : 'audited',
    httpStatus: e.httpStatus ?? null, finalUrl: e.finalUrl ?? null,
  }));
  const scopeHash = createHash('sha256')
    .update(JSON.stringify(scopeEntries.map(e => e.id).sort()))
    .digest('hex');
  // statesHash couvre l'URL ET le code de setup de chaque état exécuté —
  // le scopeHash seul ne prouve que l'identité des labels, pas celle des
  // actions jouées (un setup modifié entre baseline et final passerait sinon).
  let statesHash = null;
  if (wanted.length) {
    const stOrigin = baseUrl ? new URL(baseUrl).origin : new URL(urls[0]).origin;
    const statesDigest = {};
    for (const name of wanted) {
      statesDigest[name] = {
        url: STATES[name].url(stOrigin),
        setup: STATES[name].setup.toString(),
        stateProof: STATES[name].stateProof ? STATES[name].stateProof.toString() : null,
      };
    }
    statesHash = createHash('sha256').update(JSON.stringify(statesDigest)).digest('hex');
  }
  const scope = {
    runId, runnerVersion: RUNNER_VERSION, axeVersion: AXE_VERSION,
    generatedAt: new Date().toISOString(),
    baseUrl: baseUrl ?? null, depth, maxPages, statesRequested: statesArg,
    wait: waitMs, waitFor,
    storageState: !!storageState,
    total: scopeEntries.length,
    audited: scopeEntries.filter(e => e.status === 'audited').length,
    errored: scopeEntries.filter(e => e.status === 'error').length,
    crawlErrors,
    scopeHash,
    statesHash,
    scenarios: scopeEntries,
  };
  writeJson('scope.json', scope);

  const errorCount = scope.errored + crawlErrors.length + configErrors.length;
  writeJson('report.json', {
    runId, runnerVersion: RUNNER_VERSION, axeVersion: AXE_VERSION,
    generatedAt: new Date().toISOString(), baseUrl: baseUrl ?? null,
    pages: results, configErrors, crawlErrors, scopeHash,
  });

  // Rapport markdown : regroupé par règle, trié par impact
  const impactRank = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  const byRule = new Map();
  const incompleteByRule = new Map();
  for (const p of results) {
    for (const v of p.violations || []) {
      if (!byRule.has(v.id)) byRule.set(v.id, { ...v, pages: new Map() });
      byRule.get(v.id).pages.set(p.url, (v.nodes || []).map(n => n.target.join(' ')));
    }
    for (const v of p.incomplete || []) {
      if (!incompleteByRule.has(v.id)) incompleteByRule.set(v.id, { ...v, pages: new Map() });
      incompleteByRule.get(v.id).pages.set(p.url, (v.nodes || []).map(n => (n.target || []).join(' ')));
    }
  }
  const rules = [...byRule.values()].sort((a, b) =>
    (impactRank[a.impact] ?? 9) - (impactRank[b.impact] ?? 9) || b.pages.size - a.pages.size);

  let md = `# Audit accessibilité — ${new Date().toISOString().slice(0, 10)}\n\n`;
  const totalRules = rules.length;
  const totalNodes = rules.reduce((s, r) => s + [...r.pages.values()].reduce((a, t) => a + t.length, 0), 0);
  const totalIncomplete = [...incompleteByRule.values()].reduce((s, r) => s + [...r.pages.values()].reduce((a, t) => a + t.length, 0), 0);
  md += `**${totalRules} règle(s) violée(s), ${totalNodes} occurrence(s), ${scope.audited}/${scope.total} scénario(s) audité(s), ${errorCount} erreur(s), ${totalIncomplete} résultat(s) incomplet(s).**\n\n`;
  md += `Périmètre : scope.json — hash \`${scopeHash.slice(0, 12)}\`\n\n`;

  for (const r of rules) {
    md += `## [${r.impact?.toUpperCase()}] ${r.id} — ${r.help}\n\n${r.description}\nRéférence : ${r.helpUrl}\n\n`;
    for (const [page, targets] of r.pages) {
      md += `- ${page}\n`;
      for (const t of targets.slice(0, 10)) md += `  - \`${t}\`\n`;
      if (targets.length > 10) md += `  - … +${targets.length - 10} autres\n`;
    }
    md += '\n';
  }

  if (incompleteByRule.size) {
    md += `## Résultats incomplets à revoir (${totalIncomplete})\n\n`;
    md += 'axe n\'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :\n\n';
    for (const r of incompleteByRule.values()) {
      md += `### ${r.id} — ${r.help || ''}\n\n`;
      for (const [page, targets] of r.pages) {
        md += `- ${page}\n`;
        for (const t of targets.slice(0, 10)) md += `  - \`${t}\`\n`;
        if (targets.length > 10) md += `  - … +${targets.length - 10} autres\n`;
      }
      md += '\n';
    }
  }

  const errs = results.filter(p => p.error);
  if (errs.length || crawlErrors.length || configErrors.length) {
    md += `## Erreurs (${errs.length + crawlErrors.length + configErrors.length}) — exit code != 0\n\n`;
    md += 'Ces scénarios n\'ont pas été audités. Un audit partiel n\'est pas un PASS : le gate CI échoue tant qu\'un scénario demandé manque.\n\n';
    for (const e of errs) md += `- ${e.url} — ${e.error}\n`;
    for (const e of crawlErrors) md += `- ${e}\n`;
    for (const e of configErrors) md += `- config : ${e}\n`;
    md += '\n';
  }
  writeText('report.md', md);
  console.log(`\n${outDir}/report.md — ${totalRules} règle(s), ${totalNodes} occurrence(s), ${errorCount} erreur(s), ${totalIncomplete} incomplet(s)`);

  if (configErrors.length) for (const e of configErrors) console.error(`[config] ${e}`);
  if (errorCount > 0) process.exit(2);
  process.exit(totalRules > 0 ? 1 : 0);
}

const isMain = process.argv[1] && import.meta.url === 'file://' + resolve(process.argv[1]);
if (isMain) run().catch(e => {
  console.error(e);
  // Échec global (ex. navigateur non lançable) : on écrit quand même les
  // rapports d'erreur du RUN COURANT — jamais un report.json périmé pris
  // pour une preuve récente.
  try {
    writeErrorReports([`erreur fatale du run : ${e.message}`], []);
  } catch (w) {
    console.error('impossible d\'écrire le rapport d\'erreur :', w);
  }
  process.exit(2);
});
