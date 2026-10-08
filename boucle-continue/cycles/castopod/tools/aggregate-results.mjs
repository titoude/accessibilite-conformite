#!/usr/bin/env node
/**
 * aggregate-results.mjs — cycle 50 castopod. Agrège les report.json d'un run
 * (baseline / final / install_build) vers results.json au schéma du cycle,
 * AVEC comptes honnêtes synchronisés sur les rapports (F2) et liste
 * nominative des scénarios en échec (leçon 45) — jamais « erreurs:0 »
 * contradictoire avec un rapport qui en porte.
 *
 * Usage : node tools/aggregate-results.mjs <run> <publicDir> <authDir>
 *   <run>      : baseline | final | install_build_verbatim
 *   <dir>      : dossier de report.json relatif au dossier du CYCLE
 *                (ex. reports/baseline-public)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const cycleDir = dirname(dirname(fileURLToPath(import.meta.url)));
const resultsPath = join(cycleDir, 'results.json');
const [run, publicDir, authDir] = process.argv.slice(2);
if (!run || !publicDir || !authDir) {
  console.error('usage: aggregate-results.mjs <run> <publicDir> <authDir>');
  process.exit(64);
}

function aggregate(dir) {
  const reportPath = join(cycleDir, dir, 'report.json');
  if (!existsSync(reportPath)) {
    console.error(`rapport absent : ${reportPath}`);
    process.exit(2);
  }
  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  const detail = {};
  let occ = 0, inc = 0, audited = 0;
  const skipped = [];
  for (const p of report.pages || []) {
    if (p.error) {
      skipped.push({ scenario: p.url, reason: String(p.error).split('\n')[0] });
      continue;
    }
    audited += 1;
    for (const v of p.violations || []) {
      const n = (v.nodes || []).length;
      detail[v.id] = (detail[v.id] || 0) + n;
      occ += n;
    }
    for (const v of p.incomplete || []) inc += (v.nodes || []).length;
  }
  return {
    scenarios: (report.pages || []).length,
    audited,
    violations_occ: occ,
    violations_regles: Object.keys(detail).length,
    erreurs: skipped.length,
    erreurs_liste: skipped,
    incomplets: inc,
    detail,
  };
}

const pub = aggregate(publicDir);
const auth = aggregate(authDir);
const total = {
  total_occ: pub.violations_occ + auth.violations_occ,
  total_regles: new Set([...Object.keys(pub.detail), ...Object.keys(auth.detail)]).size,
};

const results = JSON.parse(readFileSync(resultsPath, 'utf8'));
// Conserve les métadonnées déjà présentes (note, checkout…) ; les comptes sont
// remplacés par les valeurs réelles des rapports.
results[run] = { ...(results[run] || {}), public: pub, auth: auth, ...total };
writeFileSync(resultsPath, JSON.stringify(results, null, 1) + '\n');
console.log(`${run}: public ${pub.audited}/${pub.scenarios} (${pub.violations_occ} occ/${pub.violations_regles} règles/${pub.erreurs} err) + auth ${auth.audited}/${auth.scenarios} (${auth.violations_occ} occ/${auth.violations_regles} règles/${auth.erreurs} err) — total ${total.total_occ} occ`);
for (const s of [...pub.erreurs_liste, ...auth.erreurs_liste]) console.log(`  ÉCHOUÉ : ${s.scenario} :: ${s.reason}`);
