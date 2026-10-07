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
import http from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
// ---------------------------------------------------------------------------
// États dynamiques — syncthing (AngularJS 1.x + Bootstrap 3, page unique '/').
//
// Hypothèses seed (tools/seed.sh) : 3 dossiers dont 'Archives' (receiveonly +
// versioning + ajouts locaux) et 'Broken' (chemin inexistant → erreur), 2
// devices distants hors ligne ('desktop-bob', 'laptop-alice'), un device en
// attente (knocker) et un dossier 'Shared Docs' en attente, devices/dossiers
// ignorés dans la config. La modale de rapport d'usage (#ur) s'ouvre
// automatiquement au premier chargement tant que urAccepted = 0.
//
// Ordre : 'usage-report-open'/'usage-report-dismissed' en PREMIER — ils
// ré-arment puis répondent « No » (persiste urAccepted=-1) + redémarrage pour
// effacer « Restart Needed » ; tout état suivant voit le dashboard nettoyé.
// 'theme-dark' puis 'mobile-home' en DERNIER (mutations config + viewport).
// 'usage-report-open' est aussi atteint naturellement par le scan d'URL '/'
// authentifié sur un seed frais — l'état le rend déterministe en replay.
// ---------------------------------------------------------------------------

const DASH = 'button.panel-heading[data-target^="#folder-"]';
const MODAL = id => `${id}.in`;
// Bootstrap 3 ne pose pas toujours .in sur le pane actif — .active est le
// marqueur fiable de fin d'animation d'onglet (constaté en baseline).
const TAB = pane => `${pane}.active`;

// Les appels REST authentifiés par cookie exigent le header X-CSRF-Token-*
// (même mécanisme que l'app Angular : nom du cookie CSRF-Token-<shortid>).
// NB : page.evaluate sérialise la fonction — l'extraction du cookie doit
// être INLINE dans chaque callback (pas de helper Node partagé).
const getJson = (page, path) => page.evaluate(async p => {
  // Le middleware CSRF couvre AUSSI les GET authentifiés par cookie.
  const m = document.cookie.match(/CSRF-Token-([A-Z0-9]+)=([^;]+)/);
  const h = m ? { [`X-CSRF-Token-${m[1]}`]: m[2] } : {};
  const r = await fetch(p, { headers: h });
  if (!r.ok) throw new Error(`GET ${p} → HTTP ${r.status}`);
  return r.json();
}, path);
// /rest/config* n'accepte que PUT (le POST legacy n'existe que sur
// /rest/system/config) ; /rest/system/restart reste en POST.
const putJson = (page, path, body) => page.evaluate(async ([p, b]) => {
  const m = document.cookie.match(/CSRF-Token-([A-Z0-9]+)=([^;]+)/);
  const h = { 'Content-Type': 'application/json' };
  if (m) h[`X-CSRF-Token-${m[1]}`] = m[2];
  const r = await fetch(p, { method: 'PUT', headers: h, body: JSON.stringify(b) });
  if (!r.ok) throw new Error(`PUT ${p} → HTTP ${r.status}`);
  return r.status;
}, [path, body]);

const waitDashboard = page => page.waitForSelector(DASH, { timeout: 20000 });

const dismissUr = async page => {
  const ur = page.locator('#ur.in');
  if (await ur.count()) {
    await ur.locator('button.btn-danger').click();
    await page.waitForSelector('#ur.in', { state: 'hidden', timeout: 15000 });
  }
};

const dashReady = async page => {
  await waitDashboard(page);
  await dismissUr(page);
};

const restartSyncthing = async page => {
  await page.evaluate(() => {
    const m = document.cookie.match(/CSRF-Token-([A-Z0-9]+)=([^;]+)/);
    const h = m ? { [`X-CSRF-Token-${m[1]}`]: m[2] } : {};
    return fetch('/rest/system/restart', { method: 'POST', headers: h }).catch(() => null);
  });
  await page.waitForTimeout(8000);
  for (let i = 0; i < 6; i++) {
    try { await page.reload({ waitUntil: 'load', timeout: 15000 }); break; }
    catch { await page.waitForTimeout(3000); }
  }
  await waitDashboard(page);
};

// Le thème est lu par le serveur statique AU DÉMARRAGE (api_statics.go) : un
// basculement de thème n'est effectif qu'après le restart — et une reload
// trop tôt peut retomber sur l'ancien processus encore vivant. On attend le
// marqueur concret du thème (couleur de fond body) avec rechargement en
// boucle, sinon l'audit mesure l'ANCIEN thème (constaté en baseline).
const httpLen = url => new Promise(res => {
  const rq = http.get(url, r => {
    let n = 0;
    r.on('data', c => n += c.length);
    r.on('end', () => res(n));
  });
  rq.on('error', () => res(-1));
  rq.setTimeout(10000, () => { rq.destroy(); res(-1); });
});

const waitThemeApplied = async (page, bodyBg, themeName) => {
  // Le restart peut prendre >60 s et la page peut rester sur about:blank :
  // on sonde le fichier theme.css SERVI côté Node (sans passer par la
  // page) en comparant sa taille à theme-assets/<nom>/assets/css/theme.css
  // (robuste aux changements de taille du fichier patché), puis on
  // recharge à froid et on vérifie la couleur calculée.
  const themeUrl = new URL('assets/css/theme.css', baseUrl).href;
  const refLen = await httpLen(new URL(`theme-assets/${themeName}/assets/css/theme.css`, baseUrl).href);
  if (refLen <= 0) throw new Error(`theme-assets/${themeName}/assets/css/theme.css illisible`);
  let len = -1;
  for (let i = 0; i < 40 && len !== refLen; i++) {
    len = await httpLen(themeUrl);
    if (len !== refLen) await page.waitForTimeout(3000);
  }
  if (len !== refLen) throw new Error(`theme.css servi : ${len} o ≠ ${refLen} o attendus (${themeName})`);
  // Quirk upstream : Last-Modified = mtime du fichier, identique pour tous
  // les thèmes (même tarball) → revalidation 304 et thème stale en cache.
  // Rechargement à froid via CDP ignoreCache pour forcer le 200.
  const cdp = await page.context().newCDPSession(page);
  for (let i = 0; i < 6; i++) {
    try { await cdp.send('Page.reload', { ignoreCache: true }); break; }
    catch { await page.waitForTimeout(3000); }
  }
  await page.waitForSelector(DASH, { timeout: 30000 }).catch(() => {});
  await waitDashboard(page);
  let bg = '';
  for (let i = 0; i < 15 && bg !== bodyBg; i++) {
    await page.waitForTimeout(2000);
    bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor).catch(() => '');
  }
  if (bg !== bodyBg) throw new Error(`thème servi OK mais body ${bg} != ${bodyBg}`);
};

// Ouvre un panneau repliable dossier/device par son titre visible et attend
// la fin de l'animation Bootstrap (.collapse.in). Retourne le selecteur cible.
const expandPanel = async (page, name) => {
  const btn = page.locator(`button.panel-heading:has-text("${name}")`).first();
  const target = await btn.getAttribute('data-target');
  await btn.click();
  await page.waitForSelector(`${target}.in`, { timeout: 10000 });
  return target;
};

// Actions → <item> : ouvre le menu déroulant Actions puis clique l'entrée.
const actionsMenuClick = async (page, itemText) => {
  await page.locator('li.action-menu:has(.fa-cog) > a.dropdown-toggle').click();
  await page.locator('li.action-menu:has(.fa-cog) ul.dropdown-menu a', { hasText: itemText }).first().click();
};

const helpMenuClick = async (page, itemText) => {
  await page.locator('li.action-menu:has(.fa-question-circle) > a.dropdown-toggle').click();
  await page.locator('li.action-menu:has(.fa-question-circle) ul.dropdown-menu a', { hasText: itemText }).first().click();
};

// Ouvre l'édition d'un dossier existant (identifié par son nom de panneau).
const openEditFolder = async (page, name) => {
  const target = await expandPanel(page, name);
  await page.locator(`${target} button[ng-click*="editFolderExisting"]`).click();
  await page.waitForSelector(MODAL('#editFolder'), { timeout: 10000 });
};

const openEditDevice = async (page, name) => {
  const target = await expandPanel(page, name);
  await page.locator(`${target} button[ng-click*="editDeviceExisting"]`).click();
  await page.waitForSelector(MODAL('#editDevice'), { timeout: 10000 });
};

const openSettings = async page => {
  await actionsMenuClick(page, 'Settings');
  await page.waitForSelector(MODAL('#settings'), { timeout: 10000 });
};

// Bascule le thème en sombre si ce n'est pas déjà fait — idempotent : un état
// *-dark rejoué seul (sans theme-dark avant) arme le sombre une seule fois.
const ensureDark = async page => {
  const gui = await getJson(page, '/rest/config/gui');
  if (gui.theme === 'dark') return;
  gui.theme = 'dark';
  await putJson(page, '/rest/config/gui', gui);
  await restartSyncthing(page);
  await waitThemeApplied(page, 'rgb(39, 39, 39)', 'dark');
};

const STATES = {
  'usage-report-open': {
    url: b => `${b}/`,
    setup: async page => {
      // Ré-arme la modale de rapport d'usage (urAccepted=0, urSeen=0) via
      // l'API REST de la session authentifiée, puis recharge : la modale
      // s'ouvre d'elle-même — comportement réel du premier démarrage.
      const opt = await getJson(page, '/rest/config/options');
      opt.urAccepted = 0;
      opt.urSeen = 0;
      await putJson(page, '/rest/config/options', opt);
      await page.reload({ waitUntil: 'load' });
      await page.waitForSelector(MODAL('#ur'), { timeout: 20000 });
      await page.waitForSelector('#ur .btn-danger', { state: 'visible', timeout: 10000 });
    },
  },
  'usage-report-dismissed': {
    url: b => `${b}/`,
    setup: async page => {
      // Répond « No » à la modale ouverte par l'état précédent, puis redémarre
      // pour effacer le panneau « Restart Needed » (config modifiée → flag).
      await page.waitForSelector(MODAL('#ur'), { timeout: 20000 });
      await page.locator('#ur.in button.btn-danger').click();
      await page.waitForSelector('#ur.in', { state: 'hidden', timeout: 15000 });
      await restartSyncthing(page);
    },
  },

  'folder-archives-expanded': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await expandPanel(page, 'Archives');
      await page.waitForSelector('#folder-0-0 a[ng-click*="showLocalChanged"]', { timeout: 10000 });
    },
  },
  'folder-local-additions': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      const t = await expandPanel(page, 'Archives');
      await page.locator(`${t} a[ng-click*="showLocalChanged"]`).click();
      await page.waitForSelector(MODAL('#localChanged'), { timeout: 10000 });
      await page.waitForSelector('#localChanged table td, #localChanged .modal-body p', { timeout: 10000 });
    },
  },
  'folder-revert-confirmation': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      const t = await expandPanel(page, 'Archives');
      await page.locator(`${t} button[ng-click*="revertOverrideConfirmationModal"]`).click();
      await page.waitForSelector(MODAL('#revert-override-confirmation'), { timeout: 10000 });
    },
  },
  'folder-restore-versions': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      const t = await expandPanel(page, 'Archives');
      await page.locator(`${t} button[ng-click*="restoreVersions.show"]`).click();
      await page.waitForSelector(MODAL('#restoreVersions'), { timeout: 10000 });
      await page.waitForSelector('#restoreTree .fancytree-node', { timeout: 45000 });
    },
  },
  'folder-restore-confirm': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      const t = await expandPanel(page, 'Archives');
      await page.locator(`${t} button[ng-click*="restoreVersions.show"]`).click();
      await page.waitForSelector(MODAL('#restoreVersions'), { timeout: 10000 });
      // L'arbre est une TABLE fancytree : les noeuds portent
      // .fancytree-node sur un <span> dans le <tr>, pas sur le <tr>.
      await page.waitForSelector('#restoreTree .fancytree-node', { timeout: 45000 });
      // Pas de checkbox : la sélection passe par le sélecteur de version de
      // la ligne (restoreVersionsVersionSelector.html) → choisir une version
      // active le bouton Restore.
      await page.locator('#restoreTree .dropdown-toggle').first().click();
      await page.locator('#restoreTree .dropdown-menu li:nth-child(2) a').first().click();
      await page.waitForSelector('#restoreVersions button[data-target="#restore-versions-confirmation"]:not([disabled])', { timeout: 10000 });
      await page.locator('#restoreVersions button[data-target="#restore-versions-confirmation"]').click();
      await page.waitForSelector(MODAL('#restore-versions-confirmation'), { timeout: 10000 });
    },
  },
  'folder-main-expanded': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await expandPanel(page, 'Main Sync');
    },
  },
  'folder-broken-expanded': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await expandPanel(page, 'Broken');
    },
  },

  'edit-folder-general': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openEditFolder(page, 'Main Sync');
      await page.waitForSelector(`${TAB('#folder-general')}`, { timeout: 10000 });
    },
  },
  'edit-folder-sharing': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openEditFolder(page, 'Main Sync');
      await page.locator('#editFolder a[href="#folder-sharing"]').click();
      await page.waitForSelector(TAB('#folder-sharing'), { timeout: 10000 });
    },
  },
  'edit-folder-versioning': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openEditFolder(page, 'Main Sync');
      await page.locator('#editFolder a[href="#folder-versioning"]').click();
      await page.waitForSelector(TAB('#folder-versioning'), { timeout: 10000 });
    },
  },
  'edit-folder-ignores': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openEditFolder(page, 'Main Sync');
      await page.locator('#editFolder a[href="#folder-ignores"]').click();
      await page.waitForSelector(TAB('#folder-ignores'), { timeout: 10000 });
    },
  },
  'edit-folder-advanced': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openEditFolder(page, 'Main Sync');
      await page.locator('#editFolder a[href="#folder-advanced"]').click();
      await page.waitForSelector(TAB('#folder-advanced'), { timeout: 10000 });
    },
  },
  'add-folder': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await page.locator('button[ng-click="addFolder()"]').click();
      await page.waitForSelector(MODAL('#editFolder'), { timeout: 10000 });
    },
  },
  'remove-folder-confirm': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openEditFolder(page, 'Main Sync');
      await page.locator('#editFolder button[data-target="#remove-folder-confirmation"]').click();
      await page.waitForSelector(MODAL('#remove-folder-confirmation'), { timeout: 10000 });
    },
  },

  'device-bob-expanded': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await expandPanel(page, 'desktop-bob');
    },
  },
  'device-alice-expanded': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await expandPanel(page, 'laptop-alice');
    },
  },
  'edit-device-general': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openEditDevice(page, 'desktop-bob');
      await page.waitForSelector(TAB('#device-general'), { timeout: 10000 });
    },
  },
  'edit-device-sharing': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openEditDevice(page, 'desktop-bob');
      await page.locator('#editDevice a[href="#device-sharing"]').click();
      await page.waitForSelector(TAB('#device-sharing'), { timeout: 10000 });
    },
  },
  'edit-device-advanced': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openEditDevice(page, 'desktop-bob');
      await page.locator('#editDevice a[href="#device-advanced"]').click();
      await page.waitForSelector(TAB('#device-advanced'), { timeout: 10000 });
    },
  },
  'add-device': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await page.locator('button[ng-click="addDevice()"]').click();
      await page.waitForSelector(MODAL('#editDevice'), { timeout: 10000 });
    },
  },
  'remove-device-confirm': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openEditDevice(page, 'desktop-bob');
      await page.locator('#editDevice button[data-target="#remove-device-confirmation"]').click();
      await page.waitForSelector(MODAL('#remove-device-confirmation'), { timeout: 10000 });
    },
  },
  'share-device-id': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openEditDevice(page, 'desktop-bob');
      await page.locator(`#editDevice button[ng-click="shareDeviceIdDialog('email')"]`).click();
      await page.waitForSelector(MODAL('#share-device-id-dialog'), { timeout: 10000 });
    },
  },

  'show-id-qr': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await actionsMenuClick(page, 'Show ID');
      await page.waitForSelector(MODAL('#idqr'), { timeout: 10000 });
      await page.waitForSelector('#idqr img, #idqr canvas, #idqr svg', { timeout: 10000 });
    },
  },
  'log-viewer': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await actionsMenuClick(page, 'Logs');
      await page.waitForSelector(MODAL('#logViewer'), { timeout: 10000 });
    },
  },
  'recent-changes': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await page.locator('button[ng-click="globalChanges()"]').click();
      await page.waitForSelector(MODAL('#globalChanges'), { timeout: 10000 });
    },
  },

  'settings-general': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openSettings(page);
      await page.waitForSelector(TAB('#settings-general'), { timeout: 10000 });
    },
  },
  'settings-gui': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openSettings(page);
      await page.locator('#settings a[href="#settings-gui"]').click();
      await page.waitForSelector(TAB('#settings-gui'), { timeout: 10000 });
    },
  },
  'settings-connections': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openSettings(page);
      await page.locator('#settings a[href="#settings-connections"]').click();
      await page.waitForSelector(TAB('#settings-connections'), { timeout: 10000 });
    },
  },
  'settings-ignored-devices': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openSettings(page);
      await page.locator('#settings a[href="#settings-ignored-devices"]').click();
      await page.waitForSelector(TAB('#settings-ignored-devices'), { timeout: 10000 });
      // Le seed dépose ≥1 device ignoré : la table doit être rendue.
      await page.waitForSelector('#settings-ignored-devices table tr td', { timeout: 10000 });
    },
  },
  'settings-ignored-folders': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openSettings(page);
      await page.locator('#settings a[href="#settings-ignored-folders"]').click();
      await page.waitForSelector(TAB('#settings-ignored-folders'), { timeout: 10000 });
      await page.waitForSelector('#settings-ignored-folders table tr td', { timeout: 10000 });
    },
  },
  'settings-ur-preview': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openSettings(page);
      await page.locator('#settings a[data-target="#urPreview"]').click();
      await page.waitForSelector(MODAL('#urPreview'), { timeout: 10000 });
    },
  },
  'settings-discard': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await openSettings(page);
      await page.locator('#settings #DeviceName').fill('devin-a11y-renamed');
      await page.locator('#settings .modal-footer button[data-dismiss="modal"]').click();
      await page.waitForSelector(MODAL('#discard-changes-confirmation'), { timeout: 10000 });
    },
  },

  'advanced-settings': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await actionsMenuClick(page, 'Advanced');
      await page.waitForSelector(MODAL('#advanced'), { timeout: 15000 });
      await page.locator('#advanced #optionsHeading').click();
      await page.waitForSelector('#advanced #optionsConfig.in', { timeout: 10000 });
    },
  },
  'advanced-folder-section': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await actionsMenuClick(page, 'Advanced');
      await page.waitForSelector(MODAL('#advanced'), { timeout: 15000 });
      await page.locator('#advanced #advancedFoldersHeading').click();
      await page.waitForSelector('#advanced #advancedFolders.in', { timeout: 10000 });
      await page.locator('#advanced #folder0Heading').click();
      await page.waitForSelector('#advanced #folder0Config.in', { timeout: 10000 });
    },
  },

  'about': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await helpMenuClick(page, 'About');
      await page.waitForSelector(MODAL('#about'), { timeout: 10000 });
    },
  },
  'about-includes': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await helpMenuClick(page, 'About');
      await page.waitForSelector(MODAL('#about'), { timeout: 10000 });
      await page.locator('#about a[href="#about-includes"]').click();
      await page.waitForSelector(TAB('#about-includes'), { timeout: 10000 });
    },
  },
  'connectivity-listeners': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await page.locator('a[ng-click="showListenerStatus()"]').click();
      await page.waitForSelector(MODAL('#connectivity-status'), { timeout: 10000 });
    },
  },
  'connectivity-discovery': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await page.locator('a[ng-click="showDiscoveryStatus()"]').click();
      await page.waitForSelector(MODAL('#connectivity-status'), { timeout: 10000 });
    },
  },

  // 'upgrade-modal' retiré : le bouton n'existe que si upgradeInfo.newer,
  // ce qui exige un build versionné + réseau vers les releases — non
  // déterministe dans cette boucle (build unknown-dev, hors ligne).
  'help-menu-open': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await page.locator('li.action-menu:has(.fa-question-circle) > a.dropdown-toggle').click();
      await page.waitForSelector('li.action-menu:has(.fa-question-circle).open ul.dropdown-menu', { timeout: 5000 });
    },
  },
  'actions-menu-open': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await page.locator('li.action-menu:has(.fa-cog) > a.dropdown-toggle').click();
      await page.waitForSelector('li.action-menu:has(.fa-cog).open ul.dropdown-menu', { timeout: 5000 });
    },
  },
  'lang-menu-open': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await page.locator('li.dropdown[language-select] a.dropdown-toggle').click();
      await page.waitForSelector('li.dropdown[language-select].open', { timeout: 5000 });
    },
  },

  'theme-dark': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      const gui = await getJson(page, '/rest/config/gui');
      gui.theme = 'dark';
      await putJson(page, '/rest/config/gui', gui);
      await restartSyncthing(page);
      // rgb(39,39,39) = #272727, fond body du thème dark.
      await waitThemeApplied(page, 'rgb(39, 39, 39)', 'dark');
    },
  },

  // États modale×sombre : le finding v3 a montré que les ~20 modales n'étaient
  // scannées qu'en clair (39 occ color-contrast résiduelles en dark). Un état
  // par famille de composants : tabs, arbre fancytree, accordéon, dropdown.
  'settings-dark': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await ensureDark(page);
      await openSettings(page);
      await page.waitForSelector(TAB('#settings-general'), { timeout: 10000 });
    },
  },
  'edit-device-dark': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await ensureDark(page);
      await openEditDevice(page, 'desktop-bob');
      await page.waitForSelector(TAB('#device-general'), { timeout: 10000 });
    },
  },
  'edit-folder-sharing-dark': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await ensureDark(page);
      await openEditFolder(page, 'Main Sync');
      await page.locator('#editFolder a[href="#folder-sharing"]').click();
      await page.waitForSelector(TAB('#folder-sharing'), { timeout: 10000 });
    },
  },
  'advanced-dark': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await ensureDark(page);
      await actionsMenuClick(page, 'Advanced');
      await page.waitForSelector(MODAL('#advanced'), { timeout: 15000 });
      await page.locator('#advanced #optionsHeading').click();
      await page.waitForSelector('#advanced #optionsConfig.in', { timeout: 10000 });
    },
  },
  'actions-menu-dark': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await ensureDark(page);
      await page.locator('li.action-menu:has(.fa-cog) > a.dropdown-toggle').click();
      await page.waitForSelector('li.action-menu:has(.fa-cog).open ul.dropdown-menu', { timeout: 5000 });
    },
  },
  // Famille alert-info : les entêtes de modales status=info (violet #9b59b6)
  // étaient #222 en dark = 3,41:1, ET axe « passe » ce nœud (heuristique de
  // fond) — une sonde computed dans verify.mjs couvre ce qu'axe ne voit pas.
  'about-dark': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await ensureDark(page);
      await helpMenuClick(page, 'About');
      await page.waitForSelector(MODAL('#about'), { timeout: 10000 });
    },
  },
  // Famille restoreVersions : fancytree de restauration + modale status=info,
  // exercée en dark (le fix .fancytree-title devient réellement testé).
  'folder-restore-versions-dark': {
    url: b => `${b}/`,
    setup: async page => {
      await dashReady(page);
      await ensureDark(page);
      const t = await expandPanel(page, 'Archives');
      await page.locator(`${t} button[ng-click*="restoreVersions.show"]`).click();
      await page.waitForSelector(MODAL('#restoreVersions'), { timeout: 10000 });
      await page.waitForSelector('#restoreTree .fancytree-node', { timeout: 45000 });
    },
  },
  'mobile-home': {
    url: b => `${b}/`,
    setup: async page => {
      // Restaure un thème clair (après theme-dark) puis viewport mobile.
      // 'light' explicite : 'default' sert les visuels dark quand le
      // navigateur préfère le sombre (import prefers-color-scheme).
      const gui = await getJson(page, '/rest/config/gui');
      gui.theme = 'light';
      await putJson(page, '/rest/config/gui', gui);
      await restartSyncthing(page);
      await waitThemeApplied(page, 'rgb(255, 255, 255)', 'light');
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload({ waitUntil: 'load' });
      await waitDashboard(page);
    },
  },
};

export { STATES };

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

const isCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) run().catch(e => {
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
