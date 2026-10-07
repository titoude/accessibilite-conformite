#!/usr/bin/env node
// eval-final.mjs — évaluation comparative baseline → final du cycle syncthing.
// Ne rend PAS de verdict automatique : produit les métriques et le tableau
// de résolution par règle que results.json reprend. Exit 1 = données
// incohérentes (états manquants, erreurs de scan résiduelles), pas un verdict.

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const CYCLE = join(DIR, '..');
const load = p => existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null;
const stateOf = u => { const m = u.match(/state:([a-z0-9-]+)/); return m ? m[1] : '(page)'; };

const basePub = load(join(CYCLE, 'reports/baseline-public/report.json'));
const baseAuth = load(join(CYCLE, 'reports/baseline-auth/report.json'));
const finPub = load(join(CYCLE, 'reports/final-public/report.json'));
const finAuth = load(join(CYCLE, 'reports/final-auth/report.json'));

for (const [name, r] of [['baseline-public', basePub], ['baseline-auth', baseAuth], ['final-public', finPub], ['final-auth', finAuth]]) {
  if (!r) { console.error(`FATAL: ${name}/report.json absent`); process.exit(2); }
}

const summarize = r => {
  const rules = {};
  let occ = 0, err = 0;
  for (const p of r.pages) {
    if (p.error) err++;
    for (const v of p.violations || []) {
      rules[v.id] = (rules[v.id] || 0) + v.nodes.length;
      occ += v.nodes.length;
    }
  }
  return { pages: r.pages.length, rules, occ, err };
};

const bP = summarize(basePub), bA = summarize(baseAuth), fP = summarize(finPub), fA = summarize(finAuth);

// tableau par règle : baseline → final, occurrences
const allRules = [...new Set([...Object.keys(bP.rules), ...Object.keys(bA.rules), ...Object.keys(fP.rules), ...Object.keys(fA.rules)])].sort();
const perRule = allRules.map(id => ({
  rule: id,
  baseline_occurrences: (bP.rules[id] || 0) + (bA.rules[id] || 0),
  final_occurrences: (fP.rules[id] || 0) + (fA.rules[id] || 0),
  resolved: ((fP.rules[id] || 0) + (fA.rules[id] || 0)) === 0
}));

// couverture des états : chaque état baseline doit exister dans final
const baseStates = baseAuth.pages.map(p => stateOf(p.url));
const finStates = finAuth.pages.map(p => stateOf(p.url));
const missing = baseStates.filter(s => s !== '(page)' && !finStates.includes(s));

const out = {
  generated: new Date().toISOString(),
  baseline: { public: { pages: bP.pages, violations: bP.occ, rules: Object.keys(bP.rules).length, errors: bP.err }, auth: { pages: bA.pages, violations: bA.occ, rules: Object.keys(bA.rules).length, errors: bA.err } },
  final: { public: { pages: fP.pages, violations: fP.occ, rules: Object.keys(fP.rules).length, errors: fP.err }, auth: { pages: fA.pages, violations: fA.occ, rules: Object.keys(fA.rules).length, errors: fA.err } },
  per_rule: perRule,
  states: { baseline: baseStates.length - 1, final: finStates.length - 1, missing_in_final: missing },
  residual_errors_final: finAuth.pages.filter(p => p.error).map(p => ({ url: p.url, error: p.error })),
  incompletes_final: finAuth.pages.flatMap(p => (p.incomplete || []).map(i => ({ url: p.url, id: i.id }))),
};

writeFileSync(join(CYCLE, 'reports/eval-final.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify({
  baseline_violations: out.baseline.public.violations + out.baseline.auth.violations,
  final_violations: out.final.public.violations + out.final.auth.violations,
  baseline_states_errors: out.baseline.auth.errors,
  final_states_errors: out.final.auth.errors,
  missing_states: missing,
  unresolved_rules: perRule.filter(r => !r.resolved).map(r => `${r.rule}(${r.final_occurrences})`),
}, null, 1));
process.exit(missing.length || out.final.auth.errors ? 1 : 0);
