#!/usr/bin/env node
/**
 * audit.mjs — accessibility scan with axe-core and Playwright.
 *
 * Usage:
 *   node audit.mjs <base-url>               # same-origin crawl (depth 1, max 50 pages)
 *   node audit.mjs --urls a,b,c              # explicit list of URLs
 *   node audit.mjs <url> --out dir           # output directory (default: ./a11y-audit)
 *   node audit.mjs <url> --max 20            # maximum number of crawled pages
 *   node audit.mjs <url> --depth 2           # crawl depth (default 1)
 *   node audit.mjs <url> --wait 1500         # fixed wait (ms) after load
 *   node audit.mjs <url> --wait-for '#app'   # REQUIRED selector; missing => page error
 *   node audit.mjs <url> --states all        # dynamic states declared in STATES
 *   node audit.mjs <url> --states name1,name2 # explicit subset
 *   node audit.mjs <url> --states none       # explicitly declares that there are NO states
 *   node audit.mjs <url> --keep-hash         # keep every # fragment (hash-routed SPA)
 *   node audit.mjs <url> --storage-state f.json  # authenticated Playwright context
 *   node audit.mjs <url> --strict-incomplete # axe 'incomplete' results count as gate errors
 *
 * Dynamic states: declare them in the STATES map below. They are the views that
 * are invisible on load (dialogs, drawers, toasts, tabs) and that a route-by-route
 * scan never sees. The scan runs after each state's `setup`.
 * `--states all` with an empty map is an ERROR: declare the states or state
 * that there are none with `--states none`.
 *
 * Requirements: playwright and axe-core installed in the current directory's
 * project (pinned in this toolkit's lockfile), plus Chromium:
 *   pnpm install --frozen-lockfile --ignore-scripts && pnpm exec playwright install chromium
 *
 * Outputs: <out>/report.json (violations + incomplete + metadata),
 *          <out>/report.md (sorted by impact), <out>/scope.json (executed
 *          scope + hash, to compare between baseline and final).
 *
 * Exit code: 0 = complete scope without violations; 1 = violation(s);
 *            2 = incomplete scope or error (configuration, navigation, injection,
 *                precondition, HTTP >= 400, login redirect, unknown state).
 *            A pass only exists when the whole requested scope was scanned.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

// Resolve dependencies from the calling project (CWD), not from this script.
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
    configErrors.push(`unknown option: ${arg}`);
  } else if (options.has(name)) {
    configErrors.push(`repeated option: ${arg}`);
  } else if (FLAG_OPTIONS.has(name)) {
    options.set(name, true);
  } else if (args[i + 1] === undefined || args[i + 1].startsWith('--')) {
    configErrors.push(`missing value: ${arg}`);
  } else {
    options.set(name, args[++i]);
  }
}
const opt = (name, dflt) => options.get(name) ?? dflt;
const flag = (name) => options.get(name) === true;
if (positional.length > 1) configErrors.push('only one base URL is allowed');

const baseUrl = positional[0];
const urlsOpt = opt('urls', null);
// Relative paths (--urls /a,/b) are resolved against the base URL; without a
// resolvable base this is a configuration error, not a silent skip.
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
  configErrors.push('missing URL: node audit.mjs <url> | --urls u1,u2,...');
}
for (const [name, value, minimum] of [['max', maxPages, 1], ['wait', waitMs, 0], ['depth', depth, 0]]) {
  if (!Number.isSafeInteger(value) || value < minimum) configErrors.push(`--${name} must be an integer >= ${minimum}`);
}
if (!statesArg.length) configErrors.push('declare the states: --states all|name1,name2|none');
if (explicitUrls !== null && explicitUrls.length === 0) {
  configErrors.push('--urls is empty: a scan with no requested page cannot pass');
}
if (explicitUrls && explicitUrls.some(u => !/^https?:\/\//.test(u))) {
  configErrors.push('--urls contains relative paths without a resolvable base URL');
}
if (statesArg.includes('none') && statesArg.length > 1) {
  configErrors.push('--states none cannot be combined with other states');
}

// Axe rule tags: WCAG 2.2 A+AA + best practice. See https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
const RULE_TAGS = ['wcag2a', 'wcag2a-best-practice', 'wcag2aa', 'wcag2aa-best-practice', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const RUNNER_VERSION = 'audit.mjs v5';

/**
 * Dynamic states scanned with --states all | name1,name2. The axe scan runs
 * AFTER `setup`, on the resulting DOM: this covers components that are invisible
 * on load (dialog, drawer, toast, tab, expanded section), the blind spot of a
 * route-by-route scan. `url(b)` receives the base origin.
 * Adapt this map to the project (selectors + sequence). Example:
 *   'record-drawer': {
 *     url: b => `${b}/#/list`,
 *     setup: async page => {
 *       await page.locator('table tr[data-id]').first().click();
 *       await page.waitForSelector('#drawer:not(.hidden)', { timeout: 10000 });
 *     },
 *   },
 */
const STATES = {};

if (statesArg.includes('all') && Object.keys(STATES).length === 0) {
  configErrors.push("--states all requested but STATES is empty: declare the dynamic states, or state that there are none with '--states none'");
}
const unknownStates = statesArg.filter(s => s !== 'all' && s !== 'none' && !(s in STATES));
if (unknownStates.length) {
  configErrors.push(`unknown requested state(s): ${unknownStates.join(', ')} (declared: ${Object.keys(STATES).join(', ') || 'none'})`);
}

function sameOrigin(u, origin) {
  try { return new URL(u).origin === origin; } catch { return false; }
}

// A fragment is a removable ANCHOR only if it does not look like a hash-router
// route (#/x, #!/x, #$:/x, #x/y). #HelloThere (TiddlyWiki) looks like an anchor
// but is a route: use --keep-hash or --urls on such apps.
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

// Atomic write (tmp + rename): a reader never sees a partially written file,
// and every output carries the runId of the current run.
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

// Writes an atomic error result: a run with an invalid configuration (or whose
// browser did not start) still produces scope.json/report.json/report.md for the
// CURRENT run, so an old report is never left in place and reused by mistake.
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
  let md = `# Accessibility audit — ${now.slice(0, 10)}\n\n`;
  md += `**0 scenarios scanned — ${configErrors.length + crawlErrors.length} configuration/scope error(s). Exit code 2.**\n\n`;
  for (const e of configErrors) md += `- config: ${e}\n`;
  for (const e of crawlErrors) md += `- ${e}\n`;
  writeText('report.md', md);
}

async function run() {
  mkdirSync(outDir, { recursive: true });
  // The whole configuration is validated BEFORE anything runs; otherwise an
  // unknown state would crash after reports had started.
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

  // Track the main document's last NAVIGATION response: a click in a setup (or
  // a reload) triggers a real navigation whose response goto() does not return.
  // Without this, an HTTP 500 triggered during setup was invisible and the scan
  // ran on the error page (v4).
  let lastNavResponse = null;
  if (typeof page.on === 'function') {
    page.on('response', (r) => {
      try {
        if (r.request().isNavigationRequest() && r.frame() === page.mainFrame()) lastNavResponse = r;
      } catch { /* detached frame/request */ }
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
    if (urls.length === 0) crawlErrors.push('crawl: no page discovered');
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

  // Check shared by EVERY navigation: HTTP status of the main document's last
  // navigation + identity of the final URL (a login redirect means the
  // requested page was not scanned). A null response falls back to
  // lastNavResponse (navigations triggered by a setup or by JavaScript, whose
  // response goto() does not return).
  const checkNav = (response, requested) => {
    const httpStatus = response ? response.status()
      : (lastNavResponse && lastNavResponse.url() === page.url() ? lastNavResponse.status() : null);
    const finalUrl = page.url();
    let error = null;
    if (httpStatus !== null && httpStatus >= 400) {
      error = `HTTP ${httpStatus}`;
    } else if (LOGIN_PATH.test(finalUrl) && !LOGIN_PATH.test(requested)) {
      error = `redirected to a login page (${finalUrl}): the requested page was not scanned`;
    }
    return { httpStatus, finalUrl, error };
  };

  // Preconditions replayed on the current document: --wait-for applies to the
  // FINAL document, not only to the document before a reload.
  const applyPreconditions = async () => {
    if (waitFor) {
      await page.waitForSelector(waitFor, { timeout: 15000 }); // precondition: never swallowed
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
          // The setup may navigate again (dynamic state): its navigation and the
          // post-setup URL are checked too. The scanned document is what counts,
          // not the one from the first navigation.
          const nav2 = await extraSetup(page, checkNav);
          if (nav2) {
            entry.httpStatus = nav2.httpStatus ?? entry.httpStatus;
            entry.finalUrl = nav2.finalUrl;
            if (nav2.error) entry.error = nav2.error;
          }
        }
        // ALWAYS re-check the final document (pages and states): covers navigation
        // during setup and a delayed login redirect during --wait, and applies the
        // preconditions to the document actually scanned, not the one before a reload.
        if (!entry.error && extraSetup) await applyPreconditions();
        const post = checkNav(null, gotoUrl);
        entry.httpStatus = post.httpStatus ?? entry.httpStatus;
        entry.finalUrl = post.finalUrl;
        if (!entry.error && post.error) entry.error = post.error;
        if (!entry.error) {
          try {
            const req = new URL(gotoUrl), fin = new URL(post.finalUrl);
            if (fin.origin !== req.origin) {
              entry.error = `navigated to another origin before the scan (${post.finalUrl})`;
            } else if (fin.pathname !== req.pathname) {
              // A setup that changes PAGE (not just hash/query) would scan a
              // different document than the one requested. This covers server
              // errors triggered by a click whose HTTP status is not observable
              // (e.g. '.../server-error').
              entry.error = `the final document differs from the requested one (${post.finalUrl}): declare the state's real URL in STATES`;
            }
          } catch { /* unusual URL: already covered by the other checks */ }
        }
        if (!entry.error) {
          const res = await scanPage();
          if (!res || !Array.isArray(res.violations)) {
            entry.error = 'malformed axe result (no violations list): invalid scan, not a pass';
          } else {
            entry.violations = res.violations;
            entry.incomplete = res.incomplete || [];
            entry.testEngine = res.testEngine || null;
            if (strictIncomplete && entry.incomplete.length) {
              entry.error = `${entry.incomplete.length} axe 'incomplete' result(s) (--strict-incomplete)`;
            }
          }
        }
      }
      console.log(`[scan] ${label} — ${entry.error ? 'ERROR ' + entry.error : `${entry.violations.length} rule(s) violated` + (entry.incomplete.length ? `, ${entry.incomplete.length} incomplete` : '')}`);
    } catch (e) {
      entry.error = e.message;
      console.error(`[scan] ${label}: ${e.message}`);
    }
    recordPage(entry);
  };

  for (const url of urls) {
    await auditLocation(url, url, null);
  }

  // Dynamic states: each state starts from a fresh document. With hash routing
  // (SPA), a goto to the same document does not reload, so the previous state
  // (an open drawer, etc.) would persist.
  const wanted = statesArg.includes('all') ? Object.keys(STATES) : statesArg.filter(s => s !== 'none');
  if (wanted.length) {
    const origin = baseUrl ? new URL(baseUrl).origin : new URL(urls[0]).origin;
    for (const name of wanted) {
      const st = STATES[name];
      const label = `${st.url(origin)} [state:${name}]`;
      // The second navigation (fresh reload) is checked like the first:
      // HTTP >= 400 or a login redirect => error, and the scan does not run on
      // the wrong page. The post-setup check (status via lastNavResponse, URL
      // identity, replayed preconditions) is done by auditLocation itself on
      // the final document.
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

  // Executed scope: identifier = requested URL + status. scope.json makes it
  // possible to compare the EXACT set of scenarios between baseline and final;
  // an equal page count does not prove that the sets are identical.
  const scenarioId = (e) => e.url;
  const scopeEntries = results.map(e => ({
    id: scenarioId(e), status: e.error ? 'error' : 'audited',
    httpStatus: e.httpStatus ?? null, finalUrl: e.finalUrl ?? null,
  }));
  const scopeHash = createHash('sha256')
    .update(JSON.stringify(scopeEntries.map(e => e.id).sort()))
    .digest('hex');
  // statesHash covers the URL AND the setup code of each executed state. The
  // scopeHash alone only proves that the labels match, not the actions played
  // (otherwise a setup changed between baseline and final would go unnoticed).
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

  // Markdown report: grouped by rule, sorted by impact
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

  let md = `# Accessibility audit — ${new Date().toISOString().slice(0, 10)}\n\n`;
  const totalRules = rules.length;
  const totalNodes = rules.reduce((s, r) => s + [...r.pages.values()].reduce((a, t) => a + t.length, 0), 0);
  const totalIncomplete = [...incompleteByRule.values()].reduce((s, r) => s + [...r.pages.values()].reduce((a, t) => a + t.length, 0), 0);
  md += `**${totalRules} rule(s) violated, ${totalNodes} occurrence(s), ${scope.audited}/${scope.total} scenario(s) scanned, ${errorCount} error(s), ${totalIncomplete} incomplete result(s).**\n\n`;
  md += `Scope: scope.json — hash \`${scopeHash.slice(0, 12)}\`\n\n`;

  for (const r of rules) {
    md += `## [${r.impact?.toUpperCase()}] ${r.id} — ${r.help}\n\n${r.description}\nReference: ${r.helpUrl}\n\n`;
    for (const [page, targets] of r.pages) {
      md += `- ${page}\n`;
      for (const t of targets.slice(0, 10)) md += `  - \`${t}\`\n`;
      if (targets.length > 10) md += `  - … +${targets.length - 10} more\n`;
    }
    md += '\n';
  }

  if (incompleteByRule.size) {
    md += `## Incomplete results to review (${totalIncomplete})\n\n`;
    md += 'axe could not decide: these are neither passes nor automatic failures.\n\n';
    for (const r of incompleteByRule.values()) {
      md += `### ${r.id} — ${r.help || ''}\n\n`;
      for (const [page, targets] of r.pages) {
        md += `- ${page}\n`;
        for (const t of targets.slice(0, 10)) md += `  - \`${t}\`\n`;
        if (targets.length > 10) md += `  - … +${targets.length - 10} more\n`;
      }
      md += '\n';
    }
  }

  const errs = results.filter(p => p.error);
  if (errs.length || crawlErrors.length || configErrors.length) {
    md += `## Errors (${errs.length + crawlErrors.length + configErrors.length}) — exit code != 0\n\n`;
    md += 'These scenarios were not scanned. A partial scan is not a pass: the gate fails while any requested scenario is missing.\n\n';
    for (const e of errs) md += `- ${e.url} — ${e.error}\n`;
    for (const e of crawlErrors) md += `- ${e}\n`;
    for (const e of configErrors) md += `- config: ${e}\n`;
    md += '\n';
  }
  writeText('report.md', md);
  console.log(`\n${outDir}/report.md — ${totalRules} rule(s), ${totalNodes} occurrence(s), ${errorCount} error(s), ${totalIncomplete} incomplete`);

  if (configErrors.length) for (const e of configErrors) console.error(`[config] ${e}`);
  if (errorCount > 0) process.exit(2);
  process.exit(totalRules > 0 ? 1 : 0);
}

run().catch(e => {
  console.error(e);
  // Global failure (e.g. the browser cannot start): still write the error
  // reports of the CURRENT run, so a stale report.json is never taken for a
  // fresh result.
  try {
    writeErrorReports([`fatal run error: ${e.message}`], []);
  } catch (w) {
    console.error('could not write the error report:', w);
  }
  process.exit(2);
});
