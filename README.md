# accessibilite-conformite

Skill + workflow « mise en conformité accessibilité » (WCAG 2.2 AA / RGAA / EAA), pensé pour **minimiser le taux d'erreur** : corrections de code source + boucle bornée + **vérificateur indépendant** + évaluation finale distincte + garde-fou.

## Contenu

| Fichier | Rôle |
|---|---|
| `SKILL.md` | Le skill — protocole complet, 17 règles anti-erreur, critères de « fait » |
| `audit.mjs` | Runner axe-core + Playwright : crawl, états dynamiques, rapport MD/JSON/scope, exit code strict |
| `checklist.md` | Vérification manuelle/TA par pathologie (ce que l'automatique ne voit pas) |
| `workflow.py` / `workflow-cdv.py` | Orchestration Devin `run_workflow` : audit → fix → verify (×3 max) → PR |
| `playbook.md` | Version playbook Devin |
| `pre-push` | Garde-fou **local** : hook git qui bloque le push si l'audit échoue — aucun CI distant requis |
| `benchmark.py` / `benchmark-v2.py` | Orchestrations du benchmark V1 et V2 (historiques) |
| `benchmark-v3.py` | Contrat de preuve V3 : manifeste figé pré-audit, harnais complet dans les artefacts, décisions séparées (install/build, budget, validation finale) |
| `BENCHMARK-PLAN.md` / `BRIEF-CHATGPT.md` | Protocole et brief du benchmark |
| `RAPPORT-BENCHMARK-V1.md` / `benchmark-results.json` / `benchmark-agents-details.txt` | Résultats historiques du run V1 (18/18 à 0 violation — non reproductibles, artefacts perdus) |
| `REPONSE-REVUE.md` / `REPONSE-REVUE-V2.md` | Réponses point-par-point aux audits externes V1 et V2 + errata |
| `RAPPORT-BENCHMARK-V2.md` / `benchmark-v2-results.json` / `benchmark-v2/` | Run V2 : 6/6 CONFIRMED par auditeurs tiers + artefacts rejouables (patch.diff, patch-fixed.diff, report/scope.json, provenance) |
| `RAPPORT-REQUALIFICATION-V2.md` | Requalification : install verrouillée + build des 6 patchs — 2 défauts trouvés et corrigés |
| `tests-validateurs/` | Suite de mutants prouvant que les assertions durcies attrapent les défauts que les assertions faibles ratent (9/9 détectés, 0 faux négatif) + `assertions.mjs` (helpers partagés à importer dans vos verify.mjs/eval-final.mjs) |
| `sync_runner.py` + `tests/test_runner_parity.py` | Source unique du runner : les copies embarquées dans les orchestrateurs sont régénérées depuis `audit.mjs` ; le test de parité échoue si elles divergent |
| `package.json` | Versions épinglées de l'outil (playwright 1.63.0, axe-core 4.13.0) — install reproductible |

## Utilisation

**Avec Devin** — le plus simple :
1. Le playbook existe dans l'org → tapez `!a11y` dans une session Devin avec le repo, ou demandez « applique le playbook Accessibilité ».
2. Ou placez le dossier dans `.agents/skills/accessibilite-conformite/` du repo.
3. Version orchestrée multi-agents : `run_workflow` avec `script_path=workflow.py` (`A11Y_REPO=owner/repo`).

**Avec Claude Code / Cursor / Copilot / autre agent** — déposez le dossier dans `.claude/skills/` (Claude Code), `.agents/skills/` (agents universels), ou collez le contenu de `SKILL.md` comme instructions. L'agent exécute le protocole : audit → corrections → vérification → éval finale → PR.

**En standalone** (sans agent) :
```bash
# Dans ce dépôt : versions épinglées via package.json
npm install && npx playwright install chromium
# (Dans votre projet : npm i -D playwright@1.63.0 axe-core@4.13.0)

node audit.mjs http://localhost:3000 --states none --out a11y-audit
# exit 0 = périmètre complet sans violation · 1 = violations · 2 = périmètre incomplet/erreur
```

États dynamiques — déclarez-les dans la carte `STATES` de `audit.mjs` (ou dans votre copie sous `scripts/a11y/`), ex :
```javascript
const STATES = {
  'modal-settings': { url: '/settings', setup: "document.querySelector('#open-settings').click()" },
  'drawer-menu':    { url: '/', setup: "document.querySelector('.menu-btn').click()" },
};
```
puis `node audit.mjs http://localhost:3000 --states all --out a11y-audit`.

## Le runner (v4, corrigé après trois audits externes)

- **Exit codes** : `0` = scope complet audité, 0 violation · `1` = violations trouvées · `2` = erreur/périmètre incomplet (navigation, injection CSP, précondition `--wait-for`, HTTP ≥ 400, redirection login, état inconnu, config invalide). Un audit partiel n'est jamais un PASS.
- **`--states all|a,b|none`** : états dynamiques via la carte `STATES` ; `all` sans états = erreur (utilisez `none` pour affirmer qu'il n'y en a pas).
- **`--urls a,b,c`** : routes explicites (au-delà du crawl) ; **`--keep-hash`** : conserve les ancres ; les routes hash SPA (`#/`, `#!`, `#$:`) sont toujours conservées.
- **`--storage-state f.json`** : contexte Playwright authentifié.
- **`--wait-for sel`** : précondition bloquante (non avalée).
- **`--strict-incomplete`** : les résultats `incomplete` d'axe deviennent bloquants (par défaut : listés « à revoir » dans le rapport, persistés dans report.json).
- **Chaîne documentaire contrôlée** : chaque `goto` ET le document final sont vérifiés (code HTTP ≥ 400 — y compris navigations déclenchées par JS, redirection login, document final ≠ document demandé) ; un résultat axe mal formé est une erreur, pas un zéro ; aucune attente `networkidle` (attentes explicites). Rapports d'erreur **atomiques** écrits avant tout exit, avec `runId` — impossible de réutiliser un vieux rapport.
- **`scope.json`** : identifiants de scénarios exécutés {id, statut, httpStatus, finalUrl} + `scopeHash` sha256 (ids) + `statesHash` (URL **et** code de setup des états) — prouve que baseline et final portent sur le même périmètre et les mêmes actions.
- Rapports `report.md` + `report.json` par scénario : violations, incomplets, erreurs, version axe (`testEngine`).

## Pourquoi ce design réduit l'erreur

- Le correcteur ne se note pas lui-même (vérificateur indépendant), et une **évaluation finale distincte** rejoue des tests inutilisés.
- Corrections déterministes avant jugement ; chaque fix revérifié par re-scan.
- `alt=""` jamais sans preuve décorative/texte adjacent ; pas de règle désactivée ; boucle bornée avec garde « no-progress » et statuts d'échec honnêtes.
- Périmètre figé prouvé par `scope.json`/hash — pas de compteur « N = N ».
- États dynamiques audités (`--states`) : modales, drawers, toasts — l'angle mort d'un audit route-par-route.
- Le gate local empêche toute régression.

## Validé en vrai

- **cdv-collect** (workflow orchestré) : 10 routes + 5 états → 0 violation, 3 rounds, vérificateur indépendant a rejeté 2 rounds (bugs réels trouvés : piège clavier Leaflet, label fantôme). PR `titoude/cdv-collect#23`.
- **TRAJECTOIRE** (playbook `!a11y`, Go + vanilla) : 142 violations → 0 sur 31 pages, vérif indépendante avec 2 écarts corrigés. PR `titoude/TRAJECTOIRE-#6`.
- **Benchmark V1** : 18/18 repos OSS à 0 violation (12 556 occurrences). Runner V1 fallacieux détecté par audit externe → corrigé + requalification honnête dans `REPONSE-REVUE.md`. Les artefacts V1 sont perdus (VMs éphémères, pas de push) — le contrat V2 impose les pièces jointes probantes.

## Note — slots de sessions

Chaque agent `run_workflow` est une vraie session Devin : elle reste ouverte après son `agent()` et compte dans la limite de sessions simultanées de l'org (HTTP 429 au-delà). Sur une org à plafond bas, mettez en veille les sessions terminées entre les phases.
