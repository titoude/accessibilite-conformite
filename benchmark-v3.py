"""Benchmark V3 — contrat de preuve renforcé (revue externe V2).

3 agents en parallèle, chacun traite sa liste de dépôts en séquentiel et rend
des résultats JSON structurés. NE PAS lancer sans validation de la liste et du
budget : chaque repo ≈ un run complet audit→fix→verify (ACUs).

Usage : run_workflow(script_path="benchmark-v3.py") — ou ajouter des repos en
modifiant BATCHES. Les résultats arrivent dans le journal du run.
"""
import asyncio
import json

AUDIT_SCRIPT = r'''#!/usr/bin/env node
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
const OPT_NAMES = new Set(['out', 'max', 'wait', 'wait-for', 'urls', 'depth', 'states', 'keep-hash', 'storage-state', 'strict-incomplete']);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const flag = (name) => args.includes(`--${name}`);
const positional = args.filter((a, i) => !a.startsWith('--') && (i === 0 || !OPT_NAMES.has(args[i - 1].slice(2))));

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
const maxPages = parseInt(opt('max', '50'), 10);
const waitMs = parseInt(opt('wait', '0'), 10);
const waitFor = opt('wait-for', null);
const depth = parseInt(opt('depth', '1'), 10);
const statesOpt = opt('states', '');
const statesArg = statesOpt.split(',').map(s => s.trim()).filter(Boolean);
const keepHash = flag('keep-hash');
const strictIncomplete = flag('strict-incomplete');
const storageState = opt('storage-state', null);

const configErrors = [];
if (!baseUrl && explicitUrls === null) {
  console.error('Usage: node audit.mjs <url> | --urls u1,u2,...');
  process.exit(2);
}
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

const RUNNER_VERSION = 'audit.mjs v4';

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
const STATES = {};

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
    statesRequested: statesArg, storageState: !!storageState,
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

  const scanPage = async () => {
    await page.addScriptTag({ content: axeSource });
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
            } else if (extraSetup && fin.pathname !== req.pathname) {
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
'''

BATCHES = [
    # Agent 1 — périmètre douteux V1 (erreurs baseline, compteurs qui ne prouvaient pas l'identité)
    ["miniflux/v2", "benbusby/whoogle-search", "FreshRSS/FreshRSS"],
    # Agent 2 — idem + excalidraw (4 rounds en V1 = hors budget) + RaspAP (erreurs persistantes)
    ["CorentinTh/it-tools", "RaspAP/raspap-webgui", "excalidraw/excalidraw"],
]

# Contexte V1 par dépôt (revendications à re-tester — les patchs V1 sont perdus)
V1_CONTEXT = {
    "miniflux/v2": "V1 : 84 occurrences baseline, 2 erreurs au baseline auditées au final. Re-prouver le périmètre identique.",
    "benbusby/whoogle-search": "V1 : 88 occurrences, périmètre 4→3 pages (scénario perdu). Le scope_hash doit être identique cette fois.",
    "FreshRSS/FreshRSS": "V1 : 87 occurrences, états en erreur au baseline audités au final. Re-prouver le périmètre.",
    "CorentinTh/it-tools": "V1 : 6871 occurrences, périmètre 50→51. Re-prouver identité + spot-check des corrections.",
    "RaspAP/raspap-webgui": "V1 : 286 occurrences, 2 erreurs de périmètre PERSISTANTES au final. Les résoudre ou les documenter honnêtement.",
    "excalidraw/excalidraw": "V1 : 37 occurrences, 4 rounds = hors budget. Tenir dans 3 rounds ou déclarer budget_exceeded.",
}

RESULT_SCHEMA = {
    "type": "object",
    "properties": {
        "results": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "repo": {"type": "string"},
                    "stack": {"type": "string"},
                    "booted": {"type": "boolean"},
                    "commit_sha": {"type": "string", "description": "commit évalué, pour reproductibilité"},
                    "baseline_violations": {"type": "integer"},
                    "baseline_rules": {"type": "integer"},
                    "baseline_pages": {"type": "integer"},
                    "root_causes_fixed": {"type": "integer", "description": "défauts distincts par composant/cause, pas occurrences"},
                    "final_violations": {"type": "integer"},
                    "final_pages_states": {"type": "integer"},
                    "coverage_gaps": {"type": "array", "items": {"type": "string"},
                                      "description": "pages/états attendus mais non audités — une lacune n'est PAS un PASS"},
                    "rounds": {"type": "integer", "minimum": 0, "description": "rounds correction→vérif, EN INCLUANT les réparations après éval finale"},
                    "eval_repairs": {"type": "integer", "description": "correctives faites APRÈS la première éval finale (comptent dans l'historique, pas effacées sous final=0)"},
                    "budget_exceeded": {"type": "boolean", "description": "true si le dépôt a dépassé le max de 3 rounds (succès hors budget, PAS succès strict)"},
                    "verify_rejections": {"type": "integer"},
                    "regressions": {"type": "integer", "description": "nouveaux défauts introduits par les corrections"},
                    "final_eval_findings": {"type": "integer", "description": "non-conformités trouvées par l'évaluation indépendante post-vérificateur (faux PASS)"},
                    "errors_baseline": {"type": "integer", "description": "scénarios en erreur au baseline (scope.json)"},
                    "errors_final": {"type": "integer"},
                    "incomplete_final": {"type": "integer", "description": "résultats axe 'incomplete' au final — ni PASS ni FAIL"},
                    "scope_hash_baseline": {"type": "string", "description": "scope.json sha256 du périmètre baseline"},
                    "scope_hash_final": {"type": "string"},
                    "scope_identical": {"type": "boolean", "description": "mêmes identifiants de scénarios baseline/final — pas juste même nombre"},
                    "scope_vs_manifest": {"type": "string", "pattern": "^(identical|divergent:.+)$", "description": "comparaison manifeste figé (écrit AVANT l'audit) vs scope exécuté : 'identical', ou 'divergent:<écarts>' — le manifeste couvre aussi rôles, données, thème et attentes"},
                    "axe_version": {"type": "string", "description": "version axe-core réellement exécutée (testEngine.version)"},
                    "execution_complete": {"type": "boolean", "description": "tous les scénarios du manifeste ont été exécutés sans erreur"},
                    "axe_score": {"type": "integer", "description": "violations finales mesurées par le runner (0 requis mais insuffisant seul)"},
                    "review_resolved": {"type": "boolean", "description": "tous les findings vérificateur + éval finale résolus ou écart motivé"},
                    "install_build": {"type": "string", "pattern": "^(pass|fail:.+|skipped:.+)$", "description": "résultat d'une install VERROUILLÉE + build sur checkout propre : pass | fail:<raison> | skipped:<raison> — la livraison doit être installable"},
                    "budget_respected": {"type": "boolean", "description": "3 rounds max tenus (false = succès hors budget déclaré)"},
                    "final_validation": {"type": "string", "pattern": "^(pass|findings:.+)$", "description": "verdict de l'évaluation finale indépendante : pass | findings:<n/détail>"},
                    "business_journey": {"type": "string", "description": "parcours métier complet testé (créer/publier/exécuter…) + statut"},
                    "criterion_status": {"type": "object", "description": "UNIQUEMENT les clés canoniques du prompt, statut PASS|FAIL|NOT_APPLICABLE|NOT_TESTED|NEEDS_HUMAN_REVIEW"},
                    "artifacts": {"type": "array", "items": {"type": "string"}, "description": "fichiers joints : patch.diff, manifest.json, baseline+final report.json/scope.json, provenance.json, states.json, verify.mjs, eval-final.mjs — le harnais COMPLET rejouable par un tiers"},
                    "patch_diff": {"type": "string", "description": "le patch.diff COMPLET en texte (pas une référence) — l'évaluateur indépendant le rejoue sur clone propre"},
                    "patch_sha256": {"type": "string", "description": "sha256 hex du patch_diff — l'évaluateur revérifie l'identité"},
                    "scope_json_final": {"type": "string", "description": "contenu du scope.json final en texte"},
                    "human_checks": {"type": "array", "items": {"type": "string"}},
                    "duration_min": {"type": "integer", "description": "minutes CUMULÉES d'agent (tous sous-agents inclus)"},
                    "failure": {"type": ["string", "null"], "description": "null JSON si aucun échec — jamais la chaîne 'null'. Sinon : unrunnable|rounds_exhausted|verifier_loop|partial|blocked|review_required"},
                    "notes": {"type": "string"},
                },
                "required": ["repo", "booted", "baseline_violations", "final_violations", "scope_hash_baseline", "scope_hash_final", "scope_identical", "scope_vs_manifest", "errors_baseline", "errors_final", "execution_complete", "axe_score", "review_resolved", "install_build", "budget_respected", "final_validation"],
            },
        },
        "summary": {"type": "string"},
    },
    "required": ["results", "summary"],
}

AGENT_PROMPT = (
    """Tu es un agent de benchmark. Pour CHAQUE dépôt de ta liste, applique le protocole
accessibilite-conformite. Écris d'abord ce fichier exact à scripts/a11y/audit.mjs
dans chaque dépôt cloné :

```javascript
""" + AUDIT_SCRIPT + """
```

Puis, pour chaque dépôt :""" + """

1. Clone public, lis le README, démarre l'app en local. Si boot impossible après ~30 min
   d'efforts raisonnables → failure="unrunnable", passe au suivant. Note le commit_sha.
2. MANIFESTE FIGÉ — ÉCRIT AVANT TOUT AUDIT, jamais après : manifest.json dans
   a11y-audit/ avec la liste ATTENDUE des scénarios (route + rôle + données +
   thème + état + préconditions + attentes accessibilité) et les états prévus.
   C'est la référence contre laquelle le scope.json exécuté sera comparé
   (scope_vs_manifest) — le périmètre ne se construit pas à rebours du résultat.
   Pages crawlées (--urls explicites pour les non-crawlables, --keep-hash si SPA
   à routes hash, --storage-state auth.json pour les pages authentifiées :
   produis le storageState Playwright, jamais de secret en clair dans un fichier
   joint) + états dynamiques déclarés dans STATES.
   Baseline : node scripts/a11y/audit.mjs <url> --states all --out a11y-audit/baseline
   Le runner produit scope.json (scénarios exécutés + scopeHash) — CONSERVE-le.
   Prérequis : `npm i -D playwright axe-core && npx playwright install chromium`.
   IMPORTANT : le runner échoue (exit 2) sur toute erreur — navigation, injection,
   sélecteur --wait-for absent, HTTP ≥ 400, redirection login, état inconnu.
   errors_baseline/errors_final = scope.errored. Un audit partiel n'est PAS un PASS.
3. Corrige les violations PAR FAMILLE dans le code source — jamais de surcouche, jamais
   de règle désactivée, alt="" seulement si image décorative OU info déjà fournie par
   le texte adjacent, HTML natif > ARIA, AUCUNE fonctionnalité/info supprimée.
   tabindex=-1 légitime en roving tabindex/composite ; reflow : exceptions 2D pour
   tableaux/cartes/canvas ; drag&drop exige une alternative au POINTEUR (2.5.7),
   pas seulement clavier. Tu ne modifies NI le runner, NI le manifeste figé, NI les
   données de test. La correction doit exister dans le code livré/build évalué.
   JAMAIS modifier le produit pour satisfaire le harnais (timing, polling,
   animation — précédent interdit : setInterval ralenti pour passer networkidle) :
   le harnais s'adapte au produit, pas l'inverse.
   ASSERTIONS DE TEST : effet observable, pas action exécutée ; interdit
   .catch(()=>{}) / try-catch muet sur étape requise (élément absent = FAIL ou
   coverage_gaps, jamais true) ; nom accessible = nom CALCULÉ comparé à l'attendu
   (pas la présence d'aria-labelledby/value) ; zoom/reflow = élément de référence
   toujours présent + scrollWidth ≤ viewport (pas clientWidth > 0).
4. Re-audit jusqu'à 0 violation ET 0 erreur, ou 3 rounds max — sans progrès :
   failure="partial", "blocked" ou "review_required" (statut honnête). Un 4e round
   = budget_exceeded:true (succès hors budget, PAS succès strict).
5. Vérifie toi-même (tests déterministes Playwright) : clavier complet, focus visible
   non masqué, modale (focus entré, arrière-plan inerte, Esc, retour au déclencheur),
   reflow 320 px, prefers-reduced-motion. Inclus UN PARCOURS MÉTIER COMPLET
   (créer/modifier/publier ou l'équivalent du produit) → business_journey.
   Une page/état inatteignable = coverage_gaps, jamais un PASS implicite.
6. ÉVALUATION FINALE distincte : rejoue des tests NON utilisés pendant la correction
   + échantillons du diff → final_eval_findings, regressions. Les réparations faites
   APRÈS cette éval = eval_repairs (comptent dans rounds — ne masque pas l'historique
   sous final=0).
7. NE PUSH PAS, NE crée pas de PR — tout en local. MAIS conserve les preuves et
   ATTACHE-les à ton message final pour chaque dépôt : `git diff` complet en
   patch.diff, manifest.json (le périmètre figé AVANT audit), a11y-audit/baseline/
   report.json, a11y-audit/baseline/scope.json, a11y-audit/final/report.json,
   a11y-audit/final/scope.json, provenance.json {commit_sha, commandes utilisées,
   versions axe/playwright/node, timestamps début/fin}, states.json (copie exacte
   de la carte STATES utilisée) ET LE HARNAIS COMPLET : tout script de
   vérification utilisé (verify.mjs, eval-final.mjs, preload/helper, tests
   Playwright ad hoc) — un tiers doit pouvoir rejouer TOUTE la preuve, pas
   seulement re-lire ses conclusions. (report.md aussi si < 200 Ko.)
   VALIDATION DE LIVRAISON : checkout propre du dépôt + patch.diff appliqué +
   install VERROUILLÉE (yarn install --frozen-lockfile, npm ci ou l'équivalent
   du projet) + build/lint du projet → install_build. Un patch qui casse la
   lockfile ou le build est un FAIL de livraison, pas un détail.
   Liste tout dans artifacts. AUCUN secret/credential dans les fichiers joints.
   EN PLUS, dans ta réponse structurée : patch_diff = le patch COMPLET en texte
   (pas une référence — l'évaluateur indépendant le rejoue), patch_sha256 =
   sha256 hex de ce diff, scope_json_final = contenu du scope.json final.
8. Remplis le schéma par dépôt. criterion_status : UNIQUEMENT ces clés canoniques —
   keyboard_full, focus_visible, modal_dialog, skip_link, reflow_320px,
   color_contrast, alt_quality, forms_labels_errors, status_announcements,
   tables_structure, drag_drop, redundant_entry, auth_accessible,
   hover_focus_content, focus_not_obscured, autocomplete_purpose, zoom_200,
   multimedia, reduced_motion, target_size — statut PASS|FAIL|NOT_APPLICABLE|
   NOT_TESTED|NEEDS_HUMAN_REVIEW (statuts non testés explicites, jamais masqués).
   failure = null JSON (jamais la chaîne "null"). duration_min = minutes cumulées
   de TOUS les sous-agents. axe_version = testEngine.version réel.

Règles impératives : corriger le code source ; chaque correction revérifiée par
re-scan ; mesurer, ne pas estimer ; un résultat n'existe que s'il est prouvé ;
distinguer occurrences (axe) et causes racines (composants) ; le périmètre se
compare par identifiants de scénarios (scope_identical), pas par compteurs.

Dépôts à traiter :
""")


EXPECTED_REPOS = [r for batch in BATCHES for r in batch]

REQUIRED_ARTIFACTS = ["patch.diff", "manifest.json", "provenance.json",
                      "states.json", "report.json", "scope.json"]


def validate_result(r):
    """Validateur déterministe de cohérence — calcule le verdict depuis les
    preuves déclarées. Une déclaration d'agent ne fait pas foi : les
    invariants sont vérifiés HORS de l'agent, ici.

    Retourne (verdict, erreurs). Verdicts :
      CONFIRMED            — toutes les conditions strictes réunies
      CONFIRMED_HORS_BUDGET— idem mais budget_respected=false
      FAIL:<raison>        — dépôt non évaluable ou échec déclaré
      INCOMPLETE           — exécuté mais une condition manque
      REJECTED             — contradictions internes / preuves manquantes
    """
    errors = []
    if not isinstance(r.get("repo"), str) or r["repo"] not in EXPECTED_REPOS:
        errors.append(f"repo inattendu ou dupliqué: {r.get('repo')!r}")
    if r.get("scope_identical") is True and r.get("scope_hash_baseline") != r.get("scope_hash_final"):
        errors.append("scope_identical=true mais les hashes diffèrent")
    if r.get("execution_complete") is True and r.get("errors_final", 0) > 0:
        errors.append("execution_complete=true avec errors_final>0")
    if r.get("axe_score") == 0 and r.get("final_violations", 0) != 0:
        errors.append("axe_score=0 mais final_violations>0")
    if r.get("final_validation") == "pass" and r.get("final_eval_findings", 0) > 0:
        errors.append("final_validation=pass mais final_eval_findings>0")
    if r.get("install_build") == "pass" and r.get("failure"):
        errors.append("install_build=pass avec failure déclaré")
    ev = r.get("eval_replay")
    if ev and not ev.get("replay_ok"):
        errors.append(f"rejeu indépendant échoué: {ev.get('evidence', '?')[:120]}")
    if ev and ev.get("verdict") == "FAIL":
        errors.append("évaluateur indépendant: FAIL")
    arts = r.get("artifacts") or []
    missing = [a for a in REQUIRED_ARTIFACTS if not any(a in str(x) for x in arts)]
    if r.get("booted") and not r.get("failure") and missing:
        errors.append(f"artefacts requis absents: {missing}")
    if r.get("booted") and not r.get("failure") and not r.get("patch_diff"):
        errors.append("patch_diff absent — le rejeu indépendant est impossible")

    if errors:
        return "REJECTED", errors
    if not r.get("booted") or r.get("failure"):
        return f"FAIL:{r.get('failure') or 'unrunnable'}", errors
    if (r.get("execution_complete") is True and r.get("axe_score") == 0
            and r.get("final_violations") == 0 and r.get("scope_identical") is True
            and r.get("scope_vs_manifest") == "identical"
            and r.get("review_resolved") is True
            and r.get("install_build") == "pass"
            and r.get("final_validation") == "pass"
            and (r.get("eval_replay") or {}).get("verdict") == "PASS"):
        return ("CONFIRMED" if r.get("budget_respected") else "CONFIRMED_HORS_BUDGET"), errors
    return "INCOMPLETE", errors


EVAL_SCHEMA = {
    "type": "object",
    "properties": {
        "repo": {"type": "string"},
        "patch_identity_ok": {"type": "boolean", "description": "sha256 du patch reçu == patch_sha256 déclaré"},
        "replay_ok": {"type": "boolean", "description": "patch appliqué + install verrouillée + build réussis sur clone propre au commit_sha"},
        "install_build": {"type": "string", "pattern": "^(pass|fail:.+|skipped:.+)$"},
        "final_violations": {"type": "integer"},
        "scope_hash": {"type": "string", "description": "scopeHash mesuré par le rejeu — doit égaler scope_hash_final"},
        "evidence": {"type": "string"},
        "verdict": {"type": "string", "enum": ["PASS", "FAIL", "NOT_TESTED"]},
    },
    "required": ["repo", "patch_identity_ok", "replay_ok", "verdict"],
}

EVAL_HEAD = """Tu es l'ÉVALUATEUR INDÉPENDANT d'un benchmark accessibilité.
Tu n'as rien corrigé ; tu REJOUES la preuve. Pour le dépôt indiqué :
1. Clone public au commit_sha indiqué (pas HEAD).
2. Vérifie sha256 du patch ci-dessous == patch_sha256 déclaré (patch_identity_ok).
3. `git apply` le patch ; install VERROUILLÉE (npm ci / yarn --frozen-lockfile /
   équivalent) + build/lint du projet → install_build.
4. Démarre l'app, écris scripts/a11y/audit.mjs (fourni ci-dessous), relance
   `node scripts/a11y/audit.mjs <url> --states all --out a11y-eval` ; rapporte
   final_violations mesuré et le scopeHash de scope.json.
5. verdict=PASS seulement si patch appliqué + install+build OK + 0 violation +
   périmètre complet. Tout écart = FAIL avec evidence. Tout non-testable =
   NOT_TESTED avec evidence. AUCUN secret dans les sorties.

Runner audit.mjs :
```javascript
""" + AUDIT_SCRIPT + """
```
"""


def eval_prompt(r):
    return (EVAL_HEAD
            + f"\nDépôt : {r['repo']} — commit_sha attendu : {r.get('commit_sha', '?')}"
            + f"\nInstall/build de référence : {r.get('install_build', '?')}"
            + f"\npatch_sha256 déclaré : {r.get('patch_sha256', '?')}"
            + f"\n\npatch.diff :\n```diff\n{r.get('patch_diff', '')}\n```\n")


async def eval_repo(r):
    """Rejeu indépendant du patch d'un dépôt — agent séparé de celui qui a
    produit le résultat (séparation correcteur/évaluateur)."""
    try:
        return await agent(
            eval_prompt(r),
            phase="eval", schema=EVAL_SCHEMA,
            label=f"eval-{r['repo'].split('/')[-1]}",
            soft_time_limit_minutes=45)
    except WorkflowAgentError as e:
        return {"repo": r["repo"], "patch_identity_ok": False, "replay_ok": False,
                "verdict": "NOT_TESTED", "evidence": f"agent error: {e}"}
    except Exception as e:  # KeyError/format sur données manquantes
        return {"repo": r.get("repo", "?"), "patch_identity_ok": False, "replay_ok": False,
                "verdict": "NOT_TESTED", "evidence": f"eval impossible: {e}"}


async def run_batch(i, batch):
    """Un agent = un lot de dépôts en séquentiel. Séparate-VM : environnement
    isolé par agent (exigence méthodo — pas d'état partagé entre repos)."""
    try:
        return await agent(
            AGENT_PROMPT + "\n".join(f"- {r} — contexte V1 : {V1_CONTEXT.get(r, 'non testé en V1')}" for r in batch),
            phase="bench", schema=RESULT_SCHEMA,
            label=f"bench-{i + 1}",
            soft_time_limit_minutes=60)
    except WorkflowAgentError as e:
        log(f"batch {i + 1} a échoué: {e}")
        return {"results": [], "summary": f"batch {i + 1} failed: {e}", "failed": True}


async def main():
    await register_workflow({
        "name": "a11y-benchmark-v3",
        "description": "Benchmark du skill accessibilite-conformite sur des repos OSS non conformes",
        "soft_time_limit_minutes": 60,
        "phases": [{"title": "bench", "detail": "audit → fix → verify → éval finale par lot de repos",
                    "count": len(BATCHES),
                    "labels": [f"bench-{i + 1}" for i in range(len(BATCHES))]},
                   {"title": "eval", "detail": "rejeu indépendant du patch par dépôt (agent séparé)",
                    "count": len(EXPECTED_REPOS)}],
    })
    results = await parallel([
        (lambda i=i, batch=batch: run_batch(i, batch))
        for i, batch in enumerate(BATCHES)
    ])
    all_results = []
    for i, r in enumerate(results):
        log(f"batch {i + 1} terminé : {json.dumps(r.get('summary', ''))}")
        all_results.extend(r.get("results", []))

    # ÉVALUATEUR INDÉPENDANT par dépôt : un agent séparé rejoue le patch sur
    # clone propre (install verrouillée + build + re-scan). Séparation réelle
    # correcteur / évaluateur — pas la même session qui s'auto-note.
    evals = await parallel([
        (lambda r=r: eval_repo(r))
        for r in all_results
        if r.get("booted") and not r.get("failure") and r.get("patch_diff")
    ])
    for r, e in zip(
            [x for x in all_results if x.get("booted") and not x.get("failure") and x.get("patch_diff")],
            evals):
        r["eval_replay"] = e

    # Validation déterministe hors-agent : le verdict est CALCULÉ, pas lu.
    seen = set()
    for r in all_results:
        verdict, errors = validate_result(r)
        r["verdict"] = verdict
        repo = r.get("repo", "?")
        if repo in seen:
            r["verdict"] = "REJECTED"
            errors = errors + ["dépôt rapporté en double"]
        seen.add(repo)
        level = "[REJET]" if verdict == "REJECTED" or errors else "[VERDICT]"
        log(f"{level} {repo}: {verdict}" + (f" — {errors}" if errors else ""))
    missing = sorted(set(EXPECTED_REPOS) - seen)
    if missing:
        log(f"[REJET] dépôts attendus non rapportés : {missing}")
    n_confirmed = sum(1 for r in all_results if r.get("verdict") == "CONFIRMED")
    n_budget = sum(1 for r in all_results if r.get("verdict") == "CONFIRMED_HORS_BUDGET")
    log(f"TOTAL : {len(all_results)} rapports / {len(EXPECTED_REPOS)} attendus — "
        f"{n_confirmed} CONFIRMED, {n_budget} hors budget")
    log(json.dumps(all_results, ensure_ascii=False))


asyncio.run(main())
