#!/usr/bin/env node
/**
 * run.mjs — calibration: replay the selected W3C ACT Rules test cases against
 * axe-core 4.13.0 (the scanner the benchmark uses) and compare observed
 * outcomes to the expected ACT outcomes.
 *
 * This measures the FIDELITY OF THE SELECTED SCANNER RULES only — it does NOT
 * measure the remediation skill (that is track 2, the paired pilot).
 *
 * Semantics per case (hardened after review):
 *   expected "failed" + mapped violation      => agree_fail
 *   expected "failed" + no mapped violation   => diverge_false_negative
 *   expected "passed" + mapped violation      => diverge_false_positive
 *   expected "passed" + no mapped violation   => consistent_no_violation
 *     (NOT called "agree_pass": a scanner that simply cannot see the construct
 *     would produce the same byte pattern — "no violation" never PROVES pass)
 *   expected "inapplicable" + mapped violation => diverge_inapplicable_flagged
 *   expected "inapplicable" + no violation     => consistent_no_violation
 *     (never asserted as inapplicable — absence of a violation cannot prove
 *     inapplicability; recorded as consistent-with, not agreement)
 *   any mapped axe INCOMPLETE result           => unscorable_incomplete
 *     (incompletes mean axe could not decide — never folded into pass/fail)
 *   fixture sha256 mismatch / HTTP / crash     => error (never scored)
 * All violations AND incompletes (mapped and unmapped rules) are recorded.
 *
 * The axe rule list per ACT rule is recomputed LIVE via the PUBLIC API
 * axe.getRules() (ruleId + actIds) of the loaded build — not trusted from
 * cases.json (a drift vs fetch-time declarations is reported as map_drift),
 * and never from axe internals. The raw map is persisted as axe-act-map.json.
 *
 * Usage:  node calibration/run.mjs --out calibration/results
 * Deps resolved from the repo root package.json (pinned playwright/axe-core).
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, renameSync, createReadStream, existsSync } from 'node:fs';
import { resolve, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';

const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const outDir = resolve(opt('out', join(HERE, 'results')));
mkdirSync(outDir, { recursive: true });

const casesDoc = JSON.parse(readFileSync(join(HERE, 'cases.json'), 'utf8'));
const { createHash } = require('crypto');
const PORT = 8871;

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.json': 'application/json' };

// Fixture files are served at their stored relative paths. Shared W3C test
// assets (referenced by absolute path /WAI/content-assets/...) are served from
// calibration/test-assets/ preserving the upstream layout — fixture HTML is
// never rewritten. Bytes + sources recorded in test-assets/provenance.json.
const ASSET_PREFIX = '/WAI/content-assets/wcag-act-rules/test-assets/';
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file;
  if (path.startsWith(ASSET_PREFIX)) {
    file = join(HERE, 'test-assets', path.slice(ASSET_PREFIX.length));
    if (!file.startsWith(join(HERE, 'test-assets'))) { res.writeHead(404); res.end('nf'); return; }
  } else {
    file = join(HERE, path === '/' ? 'index.html' : path);
  }
  if (!file.startsWith(HERE) || !existsSync(file)) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(PORT, '127.0.0.1', r));

const browser = await chromium.launch();
const axeSrc = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

// live actIds map from the loaded axe build — PUBLIC API only, per
// coordinator review: axe.getRules().filter(r => (r.actIds||[]).includes(actId))
const probe = await browser.newPage();
await probe.goto('about:blank');
await probe.addScriptTag({ content: axeSrc });
const liveMap = await probe.evaluate(() => {
  const rules = window.axe.getRules();
  const perRule = rules.map(r => ({ ruleId: r.ruleId, actIds: r.actIds || [] }));
  const m = {};
  for (const r of perRule) for (const a of r.actIds) (m[a] = m[a] || []).push(r.ruleId);
  return { map: m, perRule };
});
const liveRulesByAct = liveMap.map;
// Persist the raw public-API mapping for auditability
writeFileSync(join(outDir, 'axe-act-map.json'), JSON.stringify({
  axe_version: '4.13.0',
  extracted_via: 'axe.getRules()',
  rules_with_actIds: liveMap.perRule.filter(r => r.actIds.length),
  by_actId: liveRulesByAct,
}, null, 2));
await probe.close();

const rows = [];
let agreeFail = 0, consistent = 0, unscorable = 0, diverge = 0, errors = 0, unsupported = 0;
const ASSET_REF = /\/WAI\/content-assets\/wcag-act-rules\/test-assets\/[^\s"'`)\\]+/g;
const EXT_REF = /(?:src|href)\s*=\s*"(https?:\/\/[^"]+)"/g;

for (const c of casesDoc.cases) {
  const liveRules = liveRulesByAct[c.ruleId] || [];
  const declaredRules = c.axeRuleIds || [];
  const mapDrift = JSON.stringify([...liveRules].sort()) !== JSON.stringify([...declaredRules].sort());
  // No fallback to declared rules: an ACT id with no axe mapping is
  // unsupported — it stays unsupported, never scanned under a wrong rule.
  const ruleIds = liveRules;
  if (!ruleIds.length) {
    const row = { ruleId: c.ruleId, ruleName: c.ruleName, testcaseId: c.testcaseId,
      expected: c.expected, url: c.url, localFile: c.localFile, sha256: c.sha256,
      sha256_verified: null, axeRuleIds: [], map_drift: mapDrift,
      observed_rules: [], incomplete_rules: [], all_violation_rules: [],
      missing_dependencies: [], external_dependencies: [],
      outcome: 'unsupported_no_axe_mapping', error: null };
    unsupported++;
    rows.push(row);
    console.log(`[unsupported_no_axe_mapping] ${c.ruleId}/${c.testcaseId.slice(0,10)} expected=${c.expected}`);
    continue;
  }
  const url = `http://127.0.0.1:${PORT}/${c.localFile}`;
  const row = {
    ruleId: c.ruleId, ruleName: c.ruleName, testcaseId: c.testcaseId,
    expected: c.expected, url: c.url, localFile: c.localFile,
    sha256: c.sha256, sha256_verified: null, axeRuleIds: ruleIds, map_drift: mapDrift,
    observed_rules: [], incomplete_rules: [], all_violation_rules: [],
    outcome: null, error: null,
  };
  try {
    // Verify fixture integrity BEFORE scanning — scanning wrong bytes would
    // silently corrupt the calibration row.
    const actualSha = createHash('sha256').update(readFileSync(join(HERE, c.localFile))).digest('hex');
    row.sha256_verified = actualSha === c.sha256;
    if (!row.sha256_verified) throw new Error(`fixture sha256 mismatch: file=${actualSha.slice(0, 16)} declared=${c.sha256.slice(0, 16)}`);
    // Replay-dependency audit: every /WAI/... test-asset reference must exist
    // under test-assets/. A missing file is a missing replay dependency -> the
    // case is unsupported, NOT faithfully replayed. External http(s) refs are
    // recorded but never rewritten or fetched by us.
    const html = readFileSync(join(HERE, c.localFile), 'utf8');
    const refs = [...html.matchAll(ASSET_REF)].map(m => m[0].slice(ASSET_PREFIX.length));
    row.missing_dependencies = refs.filter(r => !existsSync(join(HERE, 'test-assets', r)));
    row.external_dependencies = [...new Set([...html.matchAll(EXT_REF)].map(m => m[1]))];
    if (row.missing_dependencies.length) {
      row.outcome = 'unsupported_missing_dependency'; unsupported++;
      rows.push(row);
      console.log(`[unsupported_missing_dependency] ${c.ruleId}/${c.testcaseId.slice(0,10)} missing=${row.missing_dependencies.join(',')}`);
      continue;
    }
    // axe can only run inside an HTML document — .svg/.xml fixtures have no
    // document.head to inject into and may download instead of rendering.
    if (!/\.html?$/i.test(c.localFile)) {
      row.outcome = 'unscorable_non_html_fixture'; unscorable++;
      rows.push(row);
      console.log(`[unscorable_non_html_fixture] ${c.ruleId}/${c.testcaseId.slice(0,10)} expected=${c.expected}`);
      continue;
    }
    const p = await browser.newPage();
    const resp = await p.goto(url, { waitUntil: 'load', timeout: 20000 });
    if (!resp || resp.status() !== 200) throw new Error(`HTTP ${resp && resp.status()}`);
    await p.addScriptTag({ content: axeSrc });
    const res = await p.evaluate(async (ruleIds) => {
      // Preserve the FULL raw axe output for both runs — reduced counts
      // destroyed the evidence review needs (node selectors, checks, etc.).
      const out = await window.axe.run(document, {
        runOnly: { type: 'rule', values: ruleIds },
      });
      const all = await window.axe.run(document);
      return {
        raw_mapped: { violations: out.violations, incomplete: out.incomplete,
                      passes: out.passes.map(v => ({ id: v.id, nodes: v.nodes.length })),
                      inapplicable: out.inapplicable.map(v => v.id) },
        all_ids: all.violations.map(v => v.id),
        all_incomplete_ids: all.incomplete.map(v => v.id),
      };
    }, ruleIds);
    row.raw_axe = res.raw_mapped;   // full raw axe result — the evidence
    row.observed_rules = res.raw_mapped.violations.map(v => ({ id: v.id, nodes: v.nodes.length }));
    row.incomplete_rules = res.raw_mapped.incomplete.map(v => ({ id: v.id, nodes: v.nodes.length }));
    row.passed_mapped = res.raw_mapped.passes;
    row.inapplicable_mapped = res.raw_mapped.inapplicable;
    row.all_violation_rules = res.all_ids;
    row.all_incomplete_rules = res.all_incomplete_ids;
    const anyMapped = row.observed_rules.length > 0;
    const anyIncomplete = row.incomplete_rules.length > 0;
    if (anyIncomplete) {
      row.outcome = 'unscorable_incomplete';   // axe could not decide — not evidence
    } else if (c.expected === 'failed') {
      row.outcome = anyMapped ? 'agree_fail' : 'diverge_false_negative';
    } else if (c.expected === 'passed') {
      row.outcome = anyMapped ? 'diverge_false_positive' : 'consistent_no_violation';
    } else {
      row.outcome = anyMapped ? 'diverge_inapplicable_flagged' : 'consistent_no_violation';
    }
    await p.close();
  } catch (e) {
    row.outcome = 'error'; row.error = e.message.split('\n')[0]; errors++;
  }
  if (row.outcome === 'agree_fail') agreeFail++;
  else if (row.outcome === 'consistent_no_violation') consistent++;
  else if (row.outcome === 'unscorable_incomplete') unscorable++;
  else if (row.outcome !== 'error') diverge++;
  rows.push(row);
  console.log(`[${row.outcome}] ${c.ruleId}/${c.testcaseId.slice(0, 10)} expected=${c.expected} mapped=${row.observed_rules.map(r => r.id).join('|') || 'none'} inc=${row.incomplete_rules.map(r => r.id).join('|') || '-'}`);
}

await browser.close();
server.close();

const summary = {
  generatedAt: new Date().toISOString(),
  source: { index: casesDoc.source_index, index_sha256: casesDoc.source_index_sha256, license: casesDoc.license, retrieved: casesDoc.retrieved },
  tool: { axe_core: '4.13.0', runner: 'calibration/run.mjs', playwright: '1.63.0', actMapVia: 'axe.getRules()' },
  counts: {
    total: rows.length, agree_fail: agreeFail,
    consistent_no_violation: consistent,
    unscorable: unscorable,
    divergent: diverge, errors,
    unsupported: unsupported,
  },
  note: 'Measures selected axe scanner rules against expected ACT outcomes. Does NOT measure the remediation skill. "consistent_no_violation" is not asserted agreement: absence of a violation cannot prove pass/inapplicable. ACT rules and axe rules are not 1:1 — divergences are recorded, not hidden.',
  cases: rows,
};
const tmp = join(outDir, 'calibration-results.json.tmp');
writeFileSync(tmp, JSON.stringify(summary, null, 2));
renameSync(tmp, join(outDir, 'calibration-results.json'));
console.log(`\n${rows.length} cases: ${agreeFail} agree-fail, ${consistent} consistent-no-violation, ${unscorable} unscorable, ${diverge} divergent, ${errors} errors`);
process.exit(errors > 0 || diverge > 0 ? 1 : 0);
