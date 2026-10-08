#!/usr/bin/env node
/**
 * aggregate-results.mjs — agrège les report.json d'un run (baseline/final/
 * install-build) vers results.json, AVEC reporting explicite des skips
 * (leçon 45) : chaque scénario en erreur est listé nommément, jamais omis.
 *
 * Usage :
 *   node tools/aggregate-results.mjs <run> <dir1> [dir2 ...] [--patch sha]
 *     <run>   : baseline | final | install_build
 *     <dir*>  : chemins de dossiers contenant report.json
 *
 * Chaque section produite contient :
 *   rules            — règles uniques violées
 *   occurrences      — somme des noeuds axe en violation
 *   scenarios        — nombre de scénarios demandés
 *   audited          — scénarios audités avec succès
 *   errors           — scénarios en échec (config/navigation/redirect...)
 *   skipped          — LISTE NOMMINATIVE des scénarios sautés (jamais vide
 *                      silencieuse : tableau [] explicite quand tout passe)
 *   incomplete       — résultats axe 'incomplete' (hors gate)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cycleDir = dirname(dirname(fileURLToPath(import.meta.url)));
const resultsPath = join(cycleDir, 'results.json');
const [run, ...rest] = process.argv.slice(2);
const dirs = rest.filter((a) => !a.startsWith('--'));

if (!run || dirs.length === 0) {
  console.error('usage: aggregate-results.mjs <run> <dir...>');
  process.exit(64);
}

const groups = {}; // dir name (admin|public|states|…) -> stats
let allRules = new Set();
let totalOcc = 0;
let totalScenarios = 0;
let totalAudited = 0;
let totalIncomplete = 0;
const totalSkipped = [];

for (const dir of dirs) {
  const reportPath = join(cycleDir, dir, 'report.json');
  if (!existsSync(reportPath)) {
    console.error(`rapport absent : ${reportPath}`);
    process.exit(2);
  }
  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  const pages = report.pages || report.scenarios || [];
  const name = dir.replace(/^.*\//, '');
  const rules = new Set();
  let occ = 0;
  let inc = 0;
  let audited = 0;
  const skipped = [];
  for (const p of pages) {
    const label = `${p.url}${p.state ? ` [state:${p.state}]` : ''}`;
    if (p.error) {
      skipped.push({ scenario: label, reason: String(p.error).split('\n')[0] });
      continue;
    }
    audited += 1;
    for (const v of p.violations || []) {
      rules.add(v.id);
      allRules.add(v.id);
      occ += (v.nodes || []).length;
    }
    inc += (p.incomplete || []).length;
  }
  groups[name] = {
    rules: rules.size,
    occurrences: occ,
    scenarios: pages.length,
    audited,
    errors: skipped.length,
    skipped,
    incomplete: inc,
  };
  totalOcc += occ;
  totalScenarios += pages.length;
  totalAudited += audited;
  totalIncomplete += inc;
  totalSkipped.push(...skipped);
}

groups.total = {
  rules: allRules.size,
  occurrences: totalOcc,
  scenarios: totalScenarios,
  audited: totalAudited,
  errors: totalSkipped.length,
  skipped: totalSkipped,
  incomplete: totalIncomplete,
};

const results = JSON.parse(readFileSync(resultsPath, 'utf8'));
results[run] = groups;
writeFileSync(resultsPath, JSON.stringify(results, null, 1) + '\n');
console.log(
  `${run}: ${totalAudited}/${totalScenarios} scénarios audités — ` +
    `${allRules.size} règles, ${totalOcc} occurrences, ` +
    `${totalSkipped.length} sauté(s), ${totalIncomplete} incomplets`,
);
for (const s of totalSkipped) {
  console.log(`  SAUTÉ : ${s.scenario} :: ${s.reason}`);
}
