# accessibilite-conformite

Skill + workflow « mise en conformité accessibilité » (WCAG 2.2 AA / RGAA / EAA), pensé pour **minimiser le taux d'erreur** : corrections de code source + boucle bornée + **vérificateur indépendant** + évaluation finale distincte + garde-fou.

## Contenu

| Fichier | Rôle |
|---|---|
| `SKILL.md` | Le skill — protocole complet, 12 règles anti-erreur, critères de « fait » |
| `audit.mjs` | Runner axe-core + Playwright : crawl, états dynamiques, rapport MD/JSON/scope, exit code strict |
| `checklist.md` | Vérification manuelle/TA par pathologie (ce que l'automatique ne voit pas) |
| `workflow.py` / `workflow-cdv.py` | Orchestration Devin `run_workflow` : audit → fix → verify (×3 max) → PR |
| `playbook.md` | Version playbook Devin |
| `pre-push` | Garde-fou **local** : hook git qui bloque le push si l'audit échoue — aucun CI distant requis |
| `benchmark.py` / `benchmark-v2.py` | Orchestrations du benchmark V1 et V2 (historiques) |
| `benchmark-v3.py` | Contrat de preuve V3 : manifeste figé pré-audit, harnais complet dans les artefacts, décisions séparées (install/build, budget, validation finale) |
| `BENCHMARK-PLAN.md` / `BRIEF-CHATGPT.md` | Protocole et brief du benchmark |
| `RAPPORT-BENCHMARK-V1.md` / `benchmark-results.json` / `benchmark-agents-details.txt` | Résultats historiques du run V1 (18/18 à 0 violation — non reproductibles, artefacts perdus) |
| `REPONSE-REVUE.md` | Réponse point-par-point à l'audit externe des résultats + erratum V1 |

## Utilisation

**Avec Devin** — le plus simple :
1. Le playbook existe dans l'org → tapez `!a11y` dans une session Devin avec le repo, ou demandez « applique le playbook Accessibilité ».
2. Ou placez le dossier dans `.agents/skills/accessibilite-conformite/` du repo.
3. Version orchestrée multi-agents : `run_workflow` avec `script_path=workflow.py` (`A11Y_REPO=owner/repo`).

**Avec Claude Code / Cursor / Copilot / autre agent** — déposez le dossier dans `.claude/skills/` (Claude Code), `.agents/skills/` (agents universels), ou collez le contenu de `SKILL.md` comme instructions. L'agent exécute le protocole : audit → corrections → vérification → éval finale → PR.

**En standalone** (sans agent) :
```bash
npm i -D playwright axe-core && npx playwright install chromium
node audit.mjs http://localhost:3000 --states all --out a11y-audit
# exit 0 = périmètre complet sans violation · 1 = violations · 2 = périmètre incomplet/erreur
```

## Le runner (v2, corrigé après audit externe)

- **Exit codes** : `0` = scope complet audité, 0 violation · `1` = violations trouvées · `2` = erreur/périmètre incomplet (navigation, injection CSP, précondition `--wait-for`, HTTP ≥ 400, redirection login, état inconnu, config invalide). Un audit partiel n'est jamais un PASS.
- **`--states all|a,b|none`** : états dynamiques via la carte `STATES` ; `all` sans états = erreur (utilisez `none` pour affirmer qu'il n'y en a pas).
- **`--urls a,b,c`** : routes explicites (au-delà du crawl) ; **`--keep-hash`** : conserve les ancres ; les routes hash SPA (`#/`, `#!`, `#$:`) sont toujours conservées.
- **`--storage-state f.json`** : contexte Playwright authentifié.
- **`--wait-for sel`** : précondition bloquante (non avalée).
- **`--strict-incomplete`** : les résultats `incomplete` d'axe deviennent bloquants (par défaut : listés « à revoir » dans le rapport, persistés dans report.json).
- **`scope.json`** : identifiants de scénarios exécutés {id, statut, httpStatus, finalUrl} + `scopeHash` sha256 — permet de prouver que baseline et final portent sur le même périmètre.
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
