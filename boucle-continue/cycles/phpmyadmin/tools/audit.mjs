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

// Résolution des deps depuis le projet appelant (CWD), pas depuis ce script.
const require = createRequire(resolve(process.cwd(), 'package.json'));
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

const RUNNER_VERSION = 'audit.mjs v6';

/**
 * États dynamiques audités via --states all | nom1,nom2. Le scan axe tourne
 * APRÈS `setup`, sur le DOM résultant — c'est ce qui couvre les composants
 * invisibles au chargement (modale, drawer, toast, onglet, section dépliée),
 * angle mort d'un audit route-par-route. `url(b)` reçoit l'origine de base.
 * Adaptez cette carte au projet (sélecteurs + séquence). Exemple :
 *   'drawer-fiche': {
 *     url: b => `${b}/#/liste`,
 *     setup: async page => {
 *       await page.locator('table tr[data-id]').first().click();
 *       await page.waitForSelector('#drawer:not(.hidden)', { timeout: 10000 });
 *     },
 *   },
 */
// États dynamiques phpMyAdmin 6.0-dev — tout le map tourne dans le contexte
// du run (auth: cookie pma ; public: anonyme). Les deux MUTANTS sont en fin
// de liste : theme-bootstrap-dark / theme-metro / theme-original /
// console-dark-pmahomme (mutations de préférences serveur) puis
// mobile-nav-390 (viewport 390px + reset thème vers pmahomme/light
// + reset Console/DarkTheme=false). TOUJOURS dernier mutant.
const PMA = '/public/index.php?route=';
const DBT = '&db=a11ydb';
const TBL = '&table=users';
// Mutation thème DÉTERMINISTE (v3) : le POST /themes/set doit envoyer
// ajax_request=true. Sans ce paramètre isAjax()=false → le serveur
// répond 302 → fetch suit la redirection avec le cookie encore ancien →
// UserPreferencesHandler re-sauve l'ANCIEN thème en préférence et la
// réponse du GET réécrit pma_theme=<ancien> : la mutation est annulée
// (course observée : pmahomme jamais appliqué après un état metro).
// Avec ajax_request=true, réponse JSON 200, aucune requête parasite.
// Mutation thème + console DÉTERMINISTE (v3) : deux verrous.
// 1. ajax_request=true : sans lui, isAjax()=false → réponse 302 →
//    fetch suit la redirection avec le cookie encore ancien →
//    UserPreferencesHandler re-sauve l'ANCIEN thème en préférence.
// 2. page.request.post : les requêtes page (XHR ambiantes comme
//    /git-revision, /version-check, /console/update-config) partent
//    avec le cookie d'avant mutation et leur middleware de préférences
//    RE-ÉCRIT ThemeDefault=cookie — course observée qui annulait les
//    mutations (pmahomme jamais appliqué après metro). Ces routes
//    ambiantes sont bloquées (voir context.route plus bas) ; les
//    mutations passent par la stack Node de playwright (hors
//    interception) mais partagent le jar à cookies du contexte.
// v4 — VERROU « aucun écrivain en vol » : le blocage v3 laissait passer
// /navigation (XHR ambiante écrivant des prefs par le même middleware, que
// l'on ne peut pas bloquer en permanence car elle porte l'expansion
// navtree) — 1 mutation annulée sur 122 au ré-audit. Désormais TOUTE
// requête index.php est tracée ; avant chaque mutation on attend la
// quiescence (aucune requête index.php en vol, donc aucun écrivain
// d'ancienne pref susceptible d'atterrir après le save), et pendant la
// fenêtre de mutation toute nouvelle requête index.php est avortée.
// Map<request, {epoch, killedAt}> : l'époque de navigation distingue les
// requêtes d'un document mort — une navigation (goto/reload/about:blank)
// tue le loader de l'ancien document et ses événements terminaux
// (response/finished/failed) ne sont JAMAIS émis alors qu'Apache les a
// servis : sans libération elles fuiteraient dans le suivi et bloqueraient
// la quiescence. Elles restent bloquantes 2 s après la mort du document
// pour couvrir un traitement serveur résiduel (écriture pref lente).
const pendingIndexReqs = new Map();
let navEpoch = 0;
// route.abort() n'émet pas toujours 'requestfailed' : les requêtes avortées
// sous verrou fuiteraient dans pendingIndexReqs et bloqueraient l'attente
// pour toujours — on les marque à l'évaluation de la route et on les exclut
// du suivi quel que soit l'ordre des événements.
const abortedInLock = new WeakSet();
let prefMutationLock = 0;
const withPrefMutation = async fn => {
  prefMutationLock++;
  try {
    // Fenêtre résiduelle : une requête dont la route a été évaluée juste
    // avant le verrou a été continuée mais son événement 'request' peut ne
    // pas être encore arrivé — 300 ms d'affaissement la capturent dans le
    // snapshot. Ensuite quiescence des écrivains POTENTIELS : seules les
    // requêtes déjà en vol peuvent atterrir après le save — on attend leur
    // fin (leur ré-écriture d'ancienne pref précède alors la mutation →
    // inoffensive). Toute requête évaluée sous verrou est avortée par la
    // route et n'atteint jamais le middleware — elle ne bloque pas
    // l'attente (trafic ambiant dense toléré, sinon échec BRUYANT au
    // timeout). Filet de sécurité : la garde reload des états thème
    // (link[href*=theme.css]) rendrait bruyant tout survivant.
    await new Promise(r => setTimeout(r, 300));
    const inFlightAtLock = new Set(pendingIndexReqs.keys());
    const deadline = Date.now() + 15000;
    while ([...inFlightAtLock].some(r => {
      const e = pendingIndexReqs.get(r);
      return e && !(e.killedAt && Date.now() - e.killedAt > 2000);
    })) {
      if (Date.now() > deadline) {
        const stuck = [...inFlightAtLock].filter(r => {
          const e = pendingIndexReqs.get(r);
          return e && !(e.killedAt && Date.now() - e.killedAt > 2000);
        }).map(r => `${r.resourceType()} ${r.method()} ${r.url()}`);
        throw new Error(`requête(s) index.php pré-verrou encore en vol — écrivain de pref possible, mutation refusée : ${stuck.join(' | ')}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }
    return await fn();
  } finally {
    prefMutationLock--;
  }
};
const readToken = async page =>
  page.evaluate(() => document.querySelector('input[name=token]')?.value ?? '');
const absUrl = page => new URL('index.php', page.url()).href;
const setTheme = async (page, theme, mode) => withPrefMutation(async () => {
  const token = await readToken(page);
  const res = await page.request.post(absUrl(page) + '?route=/themes/set', {
    form: {
      ajax_request: 'true', set_theme: theme, themeColorMode: mode, server: '1', token,
    },
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    maxRedirects: 0,
  });
  if (!res.ok()) throw new Error(`themes/set ${theme} ${mode} -> HTTP ${res.status()}`);
  let applied = null;
  try { applied = (await res.json()).themeColorMode ?? null; } catch { /* non-JSON */ }
  if (applied !== null && applied !== mode) {
    throw new Error(`themes/set ${theme} ${mode} -> mode appliqué ${applied}`);
  }
});
const setConsole = async (page, key, value) => withPrefMutation(async () => {
  const token = await readToken(page);
  const res = await page.request.post(absUrl(page) + '?route=/console/update-config', {
    form: { ajax_request: 'true', server: '1', token, key, value },
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    maxRedirects: 0,
  });
  if (!res.ok()) throw new Error(`update-config ${key}=${value} -> HTTP ${res.status()}`);
});
const STATES = {
  'navtree-a11ydb': {
    url: b => b + PMA + '/',
    setup: async page => {
      // expander du noeud DB a11ydb spécifiquement (le premier .expander
      // du DOM n'est pas garanti d'être le sien pendant l'ajax initial)
      const usersLink = '#pma_navigation_tree a[href*="table=users"]:visible';
      for (let attempt = 0; attempt < 3; attempt++) {
        await page.waitForSelector('#pma_navigation_tree li.database:has-text("a11ydb")', { state: 'visible' });
        await page.locator('#pma_navigation_tree li.database:has-text("a11ydb") > div.block > a.expander').first().click();
        // groupe "Tables" facultatif : présent quand l'arbre groupe les enfants
        const cont = page.locator('#pma_navigation_tree .expander.container:visible').first();
        if (await cont.waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false)) {
          await cont.click();
        }
        // le lien recent-favorite (dropdown caché) matche aussi table=users : :visible obligatoire
        if (await page.waitForSelector(usersLink, { state: 'visible', timeout: 10000 }).then(() => true).catch(() => false)) {
          break;
        }
        if (attempt === 2) throw new Error('navtree-a11ydb: users link never visible after 3 expand attempts');
      }
    },
  },
  'console-open': {
    url: b => b + PMA + '/',
    setup: async page => {
      await page.waitForSelector('#pma_console .switch_button', { state: 'visible' });
      await page.locator('#pma_console .switch_button').first().click();
      await page.waitForSelector('#pma_console .content:visible', { state: 'visible' });
    },
  },
  'structure-more-dropdown': {
    url: b => b + PMA + '/table/structure' + DBT + TBL,
    setup: async page => {
      await page.waitForSelector('[id^="moreActionsButton"]', { state: 'visible' });
      await page.locator('[id^="moreActionsButton"]').last().click();
      await page.waitForSelector('.dropdown-menu.show', { state: 'visible' });
    },
  },
  'add-index-modal': {
    url: b => b + PMA + '/table/structure' + DBT + TBL,
    setup: async page => {
      await page.waitForSelector('input.add_index[type=submit]', { state: 'visible' });
      await page.locator('input.add_index[type=submit]').click();
      await page.waitForSelector('.modal.show', { state: 'visible' });
    },
  },
  'browse-inline-edit': {
    url: b => b + PMA + '/sql' + DBT + TBL + '&sql_query=' + encodeURIComponent('SELECT * FROM users ORDER BY id ASC'),
    setup: async page => {
      await page.waitForSelector('td.data', { state: 'visible' });
      await page.locator('td.data').nth(1).dblclick();
      await page.waitForSelector('textarea.edit_box', { state: 'visible' });
    },
  },
  'sql-profiling': {
    url: b => b + PMA + '/sql' + DBT + TBL + '&sql_query=' + encodeURIComponent('SELECT * FROM users ORDER BY id ASC'),
    setup: async page => {
      await page.waitForSelector('#profilingCheckbox', { state: 'visible' });
      await page.locator('#profilingCheckbox').click();
      try {
        await page.waitForSelector('canvas:visible', { state: 'visible', timeout: 15000 });
      } catch (e) {
        await page.waitForTimeout(1500);
        await page.locator('#profilingCheckbox').click().catch(() => {});
        await page.waitForSelector('canvas', { state: 'attached', timeout: 10000 }).catch(() => {});
      }
    },
  },
  'sql-bad-query': {
    url: b => b + PMA + '/table/sql' + DBT + TBL,
    setup: async page => {
      await page.waitForSelector('#sqlquery', { state: 'attached' });
      await page.evaluate(() => {
        const ta = document.querySelector('#sqlquery');
        const cm = ta && (ta.nextElementSibling && ta.nextElementSibling.CodeMirror || ta.CodeMirror);
        if (cm) { cm.setValue('SELECT * FROM table_inexistante_x'); cm.save(); }
        else { ta.value = 'SELECT * FROM table_inexistante_x'; }
      });
      await page.locator('#button_submit_query').click();
      await page.waitForSelector('.alert-danger', { state: 'visible' });
    },
  },
  // MUTANT thème : cookie pma_theme=bootstrap + colorMode dark. Avant-dernier.
  'theme-bootstrap-dark': {
    url: b => b + PMA + '/server/databases',
    setup: async page => {
      await setTheme(page, 'bootstrap', 'dark');
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => document.documentElement.getAttribute('data-bs-theme') === 'dark');
    },
  },
  // MUTANT thème : metro (mode win = premier de sa palette). Couvre le CSS
  // compilé metro (notamment .owner du designer) qui n'était pas scanné en v1.
  'theme-metro': {
    url: b => b + PMA + '/database/designer' + DBT,
    setup: async page => {
      await setTheme(page, 'metro', 'win');
      await page.reload({ waitUntil: 'load' });
      await page.waitForSelector('link[href*="themes/metro/css/theme.css"]', { state: 'attached' });
      await page.waitForSelector('.designer_tab', { state: 'attached' });
    },
  },
  // MUTANT thème : original (mode light). Son _designer.scss importe celui de
  // pmahomme — vérifie le rendu compilé .owner sous ce thème aussi.
  'theme-original': {
    url: b => b + PMA + '/database/designer' + DBT,
    setup: async page => {
      await setTheme(page, 'original', 'light');
      await page.reload({ waitUntil: 'load' });
      await page.waitForSelector('link[href*="themes/original/css/theme.css"]', { state: 'attached' });
      await page.waitForSelector('.designer_tab', { state: 'attached' });
    },
  },
  // MUTANTS thème v3 : les 4 autres modes couleur de metro (teal/redmond/
  // blueeyes/mono). Chaque mode est une palette CSS scopée
  // [data-bs-theme="..."] dans metro/css/theme.css — le contraste rendu
  // diffère réellement par mode, d'où un état par mode.
  'theme-metro-teal': {
    url: b => b + PMA + '/database/designer' + DBT,
    setup: async page => {
      await setTheme(page, 'metro', 'teal');
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => document.documentElement.getAttribute('data-bs-theme') === 'teal');
      await page.waitForSelector('.designer_tab', { state: 'attached' });
    },
  },
  'theme-metro-redmond': {
    url: b => b + PMA + '/database/designer' + DBT,
    setup: async page => {
      await setTheme(page, 'metro', 'redmond');
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => document.documentElement.getAttribute('data-bs-theme') === 'redmond');
      await page.waitForSelector('.designer_tab', { state: 'attached' });
    },
  },
  'theme-metro-blueeyes': {
    url: b => b + PMA + '/database/designer' + DBT,
    setup: async page => {
      await setTheme(page, 'metro', 'blueeyes');
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => document.documentElement.getAttribute('data-bs-theme') === 'blueeyes');
      await page.waitForSelector('.designer_tab', { state: 'attached' });
    },
  },
  'theme-metro-mono': {
    url: b => b + PMA + '/database/designer' + DBT,
    setup: async page => {
      await setTheme(page, 'metro', 'mono');
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => document.documentElement.getAttribute('data-bs-theme') === 'mono');
      await page.waitForSelector('.designer_tab', { state: 'attached' });
    },
  },
  // MUTANT thème v3 : bootstrap mode light (dark déjà couvert en v2) —
  // complète la palette bootstrap et vérifie le retour en clair.
  'theme-bootstrap-light': {
    url: b => b + PMA + '/server/databases',
    setup: async page => {
      await setTheme(page, 'bootstrap', 'light');
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => document.documentElement.getAttribute('data-bs-theme') === 'light');
    },
  },
  // MUTANT : pmahomme n'a PAS de mode dark (theme.json colorModes=[light] et
  // setColorMode ignore les modes invalides) → la surface sombre réelle de
  // pmahomme est la console (.console_dark_theme), persistée via
  // Console/DarkTheme (/console/update-config). Substitue l'état
  // « pmahomme-dark » demandé par cette surface réelle.
  'console-dark-pmahomme': {
    url: b => b + PMA + '/',
    setup: async page => {
      // v3 : setTheme/setConsole via page.request (stack Node, hors des
      // routes interceptées) — préférence serveur = pmahomme garantie.
      await setTheme(page, 'pmahomme', 'light');
      // Mode=show + DarkTheme=true : la console s'ouvre rendue dark au
      // chargement — déterministe, sans click post-reload.
      await setConsole(page, 'DarkTheme', 'true');
      await setConsole(page, 'Mode', 'show');
      // v3 : vérifie que pmahomme est réellement appliqué — sans cela un
      // échec silencieux de themes/set laissait un thème précédent actif
      // et axe mesurait la palette du mauvais thème.
      await page.reload({ waitUntil: 'load' });
      await page.waitForSelector('link[href*="themes/pmahomme/css/theme.css"]', { state: 'attached' });
      await page.waitForSelector('#pma_console .content.console_dark_theme:visible', { state: 'visible' });
    },
  },
  // MUTANT viewport 390px + RESET thème vers pmahomme/light + reset
  // Console/DarkTheme=false (les prefs sont persistées côté serveur).
  // TOUJOURS dernier.
  'mobile-nav-390': {
    url: b => b + PMA + '/',
    setup: async page => {
      // v3 : setTheme/setConsole via page.request — pmahomme persisté en
      // préférence serveur, sans course cookie/redirect ni AJAX ambiant.
      await setTheme(page, 'pmahomme', 'light');
      await setConsole(page, 'DarkTheme', 'false');
      await setConsole(page, 'Mode', 'collapse');
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload({ waitUntil: 'load' });
      // v3 : vérifie que pmahomme est réellement appliqué — sans cela un
      // échec silencieux de themes/set laissait un thème précédent actif
      // et axe mesurait la palette du mauvais thème (fuite observée après
      // un état metro : #3a7ead/#377796 flaggés sur pmahomme).
      await page.waitForSelector('link[href*="themes/pmahomme/css/theme.css"]', { state: 'attached' });
      await page.waitForSelector('#pma_navigation', { state: 'visible' });
    },
  },
  // Public (run anonyme) : échec de login → bannière .alert-danger.
  'login-failed': {
    url: b => b + PMA + '/',
    setup: async page => {
      await page.waitForSelector('#input_username', { state: 'visible' });
      await page.fill('#input_username', 'pma');
      await page.fill('#input_password', 'mauvais-mot-de-passe');
      await page.click('#input_go');
      // la 1re .alert-danger du DOM peut être le bandeau https-mismatch caché
      await page.waitForSelector('.alert-danger:visible', { state: 'visible' });
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
  const context = await browser.newContext(storageState ? { storageState } : {});
  const page = await context.newPage();

  // v3 : bloque les XHR ambiantes de phpMyAdmin qui passent par le
  // middleware UserPreferencesLoading — avec un cookie thème périmé en
  // vol pendant une mutation /themes/set, elles re-sauvent l'ANCIEN
  // thème en préférence serveur et annulent la mutation (course
  // observée : git-revision atterrissant après le save). Nos mutations
  // passent par page.request.post et ne sont pas interceptées.
  for (const frag of ['/git-revision', '/version-check', '/console/update-config']) {
    await page.route(`**/index.php?route=${frag}**`, route => route.abort());
  }

  // v4 : la fenêtre résiduelle était /navigation&ajax_request=1 — XHR
  // ambiante émette par chaque page et qui porte aussi l'expansion
  // navtree, donc impossible à bloquer en permanence. Verrou de mutation :
  // toute requête vers index.php est tracée ; avecPrefMutation attend la
  // quiescence puis tient le verrou, et cette route (enregistrée EN
  // DERNIER, donc évaluée en premier) avorte toute requête index.php
  // pendant la fenêtre ; hors verrou, fallback() rend la main aux
  // blocages permanents ci-dessus. Garantie « aucun écrivain en vol ».
  page.on('request', r => {
    if (r.url().includes('index.php') && !abortedInLock.has(r)) pendingIndexReqs.set(r, { epoch: navEpoch, killedAt: 0 });
  });
  // 'response' = en-têtes reçus → le middleware s'est déjà exécuté et
  // l'écriture de pref est engagée : la requête est libérée. Critère plus
  // juste que 'requestfinished', qu'un body non consommé (fetch fire-and-
  // forget) peut différer indéfiniment.
  page.on('response', r => { if (r.url().includes('index.php')) pendingIndexReqs.delete(r.request()); });
  page.on('requestfinished', r => pendingIndexReqs.delete(r));
  page.on('requestfailed', r => pendingIndexReqs.delete(r));
  // Navigation du document principal : toute requête d'une époque passée a
  // son loader tué — plus d'événement terminal à venir, on la marque pour
  // libération différée (grâce 2 s côté serveur, voir withPrefMutation).
  page.on('framenavigated', f => {
    if (f === page.mainFrame()) {
      navEpoch++;
      const now = Date.now();
      for (const e of pendingIndexReqs.values()) {
        if (e.epoch !== navEpoch && !e.killedAt) e.killedAt = now;
      }
    }
  });
  await page.route('**/index.php**', route =>
    prefMutationLock > 0
      ? (abortedInLock.add(route.request()), pendingIndexReqs.delete(route.request()), route.abort())
      : route.fallback());

  if (storageState) {
    // v3 : normalise l'instance avant le premier scan — les mutations
    // thème/console sont persistées côté serveur, donc un run précédent
    // peut laisser un thème non par défaut actif et fausser la mesure
    // des pages de base (doit être pmahomme/light, console collapse).
    // networkidle : l'entrée sur baseUrl suit une redirection ; le
    // evaluate de readToken exige un contexte de page stabilisé.
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await setTheme(page, 'pmahomme', 'light');
    await setConsole(page, 'DarkTheme', 'false');
    await setConsole(page, 'Mode', 'collapse');
    await page.reload({ waitUntil: 'load', timeout: 30000 });
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
      statesDigest[name] = { url: STATES[name].url(stOrigin), setup: STATES[name].setup.toString() };
    }
    statesHash = createHash('sha256').update(JSON.stringify(statesDigest)).digest('hex');
  }
  const scope = {
    runId, runnerVersion: RUNNER_VERSION, generatedAt: new Date().toISOString(),
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
    runId, runnerVersion: RUNNER_VERSION,
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

run().catch(e => {
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
