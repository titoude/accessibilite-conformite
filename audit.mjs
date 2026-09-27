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
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
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
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
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

// Écrit un résultat d'erreur atomique : un audit dont la config est invalide
// produit quand même scope.json/report.json/report.md horodatés — jamais
// de rapport ancien laissé en place et réutilisé par erreur.
function writeErrorReports(configErrors, crawlErrors) {
  mkdirSync(outDir, { recursive: true });
  const scopeHash = createHash('sha256').update('[]').digest('hex');
  const now = new Date().toISOString();
  writeFileSync(resolve(outDir, 'scope.json'), JSON.stringify({
    generatedAt: now, baseUrl: baseUrl ?? null, depth, maxPages,
    statesRequested: statesArg, storageState: !!storageState,
    total: 0, audited: 0, errored: 0, crawlErrors, configErrors,
    scopeHash, scenarios: [],
  }, null, 2));
  writeFileSync(resolve(outDir, 'report.json'), JSON.stringify({
    generatedAt: now, baseUrl: baseUrl ?? null,
    pages: [], configErrors, crawlErrors, scopeHash,
  }, null, 2));
  let md = `# Audit accessibilité — ${now.slice(0, 10)}\n\n`;
  md += `**0 scénario audité — ${configErrors.length + crawlErrors.length} erreur(s) de configuration/périmètre. Exit code 2.**\n\n`;
  for (const e of configErrors) md += `- config : ${e}\n`;
  for (const e of crawlErrors) md += `- ${e}\n`;
  writeFileSync(resolve(outDir, 'report.md'), md);
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

  // Contrôle commun à TOUTE navigation : statut HTTP + identité de l'URL
  // finale (redirection login = la page demandée n'a pas été auditée).
  // response null → contrôle de l'URL courante seulement (post-setup).
  const checkNav = (response, requested) => {
    const httpStatus = response ? response.status() : null;
    const finalUrl = page.url();
    let error = null;
    if (httpStatus !== null && httpStatus >= 400) {
      error = `HTTP ${httpStatus}`;
    } else if (LOGIN_PATH.test(finalUrl) && !LOGIN_PATH.test(requested)) {
      error = `redirection vers une page de connexion (${finalUrl}) — la page demandée n'a pas été auditée`;
    }
    return { httpStatus, finalUrl, error };
  };

  const auditLocation = async (label, gotoUrl, extraSetup) => {
    const entry = { url: label, requestedUrl: gotoUrl, violations: [], incomplete: [] };
    try {
      const nav = checkNav(await page.goto(gotoUrl, { waitUntil: 'networkidle', timeout: 30000 }), gotoUrl);
      entry.httpStatus = nav.httpStatus;
      entry.finalUrl = nav.finalUrl;
      if (nav.error) {
        entry.error = nav.error;
      } else {
        if (waitFor) {
          await page.waitForSelector(waitFor, { timeout: 15000 }); // précondition : non avalée
        }
        if (waitMs) await page.waitForTimeout(waitMs);
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
          const post = checkNav(null, gotoUrl);
          entry.finalUrl = post.finalUrl;
          if (!entry.error && post.error) entry.error = post.error;
          if (!entry.error && baseUrl) {
            try {
              if (new URL(post.finalUrl).origin !== new URL(gotoUrl).origin) {
                entry.error = `navigation hors origine pendant le setup (${post.finalUrl})`;
              }
            } catch { /* URL exotique : déjà couvert par les autres contrôles */ }
          }
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
      // sur la mauvaise page. Toute navigation pendant setup est re-vérifiée.
      await auditLocation(label, st.url(origin), async (p, check) => {
        await p.goto('about:blank');
        const nav2 = check(await p.goto(st.url(origin), { waitUntil: 'networkidle', timeout: 30000 }), st.url(origin));
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
    generatedAt: new Date().toISOString(),
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
  writeFileSync(resolve(outDir, 'scope.json'), JSON.stringify(scope, null, 2));

  const errorCount = scope.errored + crawlErrors.length + configErrors.length;
  writeFileSync(resolve(outDir, 'report.json'), JSON.stringify({
    generatedAt: new Date().toISOString(), baseUrl: baseUrl ?? null,
    pages: results, configErrors, crawlErrors, scopeHash,
  }, null, 2));

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
  writeFileSync(resolve(outDir, 'report.md'), md);
  console.log(`\n${outDir}/report.md — ${totalRules} règle(s), ${totalNodes} occurrence(s), ${errorCount} erreur(s), ${totalIncomplete} incomplet(s)`);

  if (configErrors.length) for (const e of configErrors) console.error(`[config] ${e}`);
  if (errorCount > 0) process.exit(2);
  process.exit(totalRules > 0 ? 1 : 0);
}

run().catch(e => { console.error(e); process.exit(2); });
