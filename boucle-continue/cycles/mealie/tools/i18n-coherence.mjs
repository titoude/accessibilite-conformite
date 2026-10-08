/**
 * i18n-coherence.mjs — leçon 43 rendue exécutable (cycle 44, fixer v3).
 *
 * Extrait TOUTES les clés i18n introduites par le patch ($t('…'), $t("…"),
 * $tc(…), i18n.t(…) sur les lignes `+`) et vérifie que chacune résout dans le
 * JSON de locale en-US du produit patché. Une clé non résolue = slug brut
 * rendu (leçon 43 : violation invisible pour axe ET pour `length > 0`).
 *
 * Usage : node tools/i18n-coherence.mjs <patch.diff> [repoRoot]
 *   repoRoot = racine du clone mealie PATCHÉ (défaut : cwd).
 *   en-US.json résolu à <repoRoot>/frontend/app/lang/messages/en-US.json.
 *
 * Sortie : PASS/FAIL par clé + résumé ; exit 1 si ≥1 clé non résolue.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const [patchPath, repoRoot = '.'] = process.argv.slice(2);
if (!patchPath) {
    console.error('usage: node i18n-coherence.mjs <patch.diff> [repoRoot]');
    process.exit(2);
}
const localePath = resolve(repoRoot, 'frontend/app/lang/messages/en-US.json');
if (!existsSync(patchPath)) { console.error(`FAIL patch introuvable : ${patchPath}`); process.exit(2); }
if (!existsSync(localePath)) { console.error(`FAIL locale introuvable : ${localePath}`); process.exit(2); }

const patch = readFileSync(patchPath, 'utf8');
const locale = JSON.parse(readFileSync(localePath, 'utf8'));

// Clés introduites = lignes `+` (hors en-têtes `+++`) ; $t( / $tc( / i18n.t(
const KEY_RE = /(?:\$tc?|i18n\.t)\(\s*['"]([a-zA-Z0-9][a-zA-Z0-9._-]*?)['"]/g;
const keys = new Set();
for (const line of patch.split('\n')) {
    if (!line.startsWith('+') || line.startsWith('+++')) continue;
    for (const m of line.matchAll(KEY_RE)) keys.add(m[1]);
}

const resolveKey = (obj, path) => {
    let cur = obj;
    for (const seg of path.split('.')) {
        if (cur == null || typeof cur !== 'object' || !(seg in cur)) return undefined;
        cur = cur[seg];
    }
    return cur;
};

let fails = 0;
const sorted = [...keys].sort();
for (const k of sorted) {
    const v = resolveKey(locale, k);
    const pass = typeof v === 'string' && v.length > 0;
    if (!pass) fails++;
    console.log(`${pass ? 'PASS' : 'FAIL'} ${k}${pass ? ` = ${JSON.stringify(v).slice(0, 80)}` : ' — clé ABSENTE de en-US.json (slug brut rendu)'}`);
}
console.log(`\ni18n-coherence: ${sorted.length - fails}/${sorted.length} clés résolues, ${fails} manquante(s)`);
process.exit(fails === 0 ? 0 : 1);
