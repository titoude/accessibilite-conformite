# Réponse à l'audit V3 — correctifs appliqués

Revue reçue : `revue-audit-complet-v3.zip` (AUDIT-COMPLET-V3.md, RETOUR-A-L-AGENT.md,
harnais `tests/`, preuves). Verdict rappelé : « prototype public : oui ; produit fini : pas encore ».
Ce document décrit les correctifs livrés et leur validation par les harnais de la revue.

## P0 — Décision de livraison (workflow.py + workflow-cdv.py)

| Exigence | Correctif | Preuve |
|---|---|---|
| Refus → pas de rapport de succès | `report()` scindé : `report_partial()` produit une **PR brouillon** « WIP: remédiation accessibilité partielle — non validée » listant chaque refus ; `report_success()` n'est appelé que sur PASS réel | harnais : `compliance_title_requested=false` |
| `accepted=true` + `remaining>0` | `compute_status` : contradiction → statut ERROR, **aucun** appel `report` | harnais : `report_requested=false` en mode inconsistent |
| Rounds chaînés | chaque round part du `commit_sha` (ou branche) du fix précédent — `git checkout {sha}` | harnais : `every_fix_restarts_from_setup=false` |
| Identité de commit vérifiable | `FIX_SCHEMA` exige `commit_sha` (`git rev-parse HEAD`) ; tous les prompts checkout la SHA, pas la branche | FIX_SCHEMA.required |
| A11Y_BASE réellement appliqué | `BASE_LINE` dans `COMMON` → présent dans chaque prompt | harnais : `base_override_passed_to_agent=true` |
| Éval finale séparée | agent `final_eval` distinct, phase META dédiée, écrit ses propres tests ; n'ouvre pas de PR | `phases` contient `final_eval` |
| Règles unifiées | bloc `RULES` (17 règles condensées) injecté dans `COMMON` → identique dans tous les points d'entrée ; SKILL.md reste la source | `COMMON` partagé |

## P0/P1 — Contrat V3 exécutable hors agent (benchmark-v3.py)

- **`validate_result()` déterministe** hors agent : le verdict est calculé depuis les
  preuves déclarées — jamais lu. Invariants vérifiés : hashes scope vs `scope_identical`,
  `execution_complete` vs erreurs, `axe_score` vs `final_violations`, `final_validation`
  vs `final_eval_findings`, artefacts requis, `patch_diff` présent, repo attendu et unique.
- **Verdicts calculés** : `CONFIRMED`, `CONFIRMED_HORS_BUDGET`, `FAIL:<raison>`,
  `INCOMPLETE`, `REJECTED` — plus dépôts attendus non rapportés = rejet explicite.
- **Schéma strict** : patterns sur `scope_vs_manifest` (`identical|divergent:…`),
  `install_build` (`pass|fail:…|skipped:…`), `final_validation` (`pass|findings:…`),
  `rounds` ≥ 0, `failure` énuméré.
- **Séparation correcteur/évaluateur réelle** : l'agent bench embarque `patch_diff`
  (texte complet) + `patch_sha256` ; une phase `eval` lance **un agent séparé par dépôt**
  qui re-clone au commit, vérifie le hash, applique le patch, install verrouillée + build,
  re-scan ; `CONFIRMED` exige `eval_replay.verdict == "PASS"`.
- **Source unique du runner** : `sync_runner.py` régénère les `AUDIT_SCRIPT` embarqués
  depuis `audit.mjs` ; `tests/test_runner_parity.py` échoue sur toute divergence
  (la dérive `statesHash` signalée ne peut plus passer inaperçue).

Preuve : leurs `test_workflows.py` rejoués — l'enregistrement contradictoire
(7 violations, axe_score=0, hashes différents, artefacts absents) est **REJECTED**
avec 6 motifs + liste des dépôts manquants.

## P1 — Document final du scan (audit.mjs v4)

- Chaîne documentaire complète : `checkNav` sur chaque goto ET sur le document final
  (navigations JS suivies via `page.on('response')` navigation request, fallback
  `lastNavResponse`) ; contrôle identité origine **et** chemin pour les setups.
- `waitUntil: 'domcontentloaded'`/`load` + attentes explicites — plus de `networkidle`.
- Rapports d'erreur **atomiques** (`writeJson`/`writeText` = tmp + rename), `runId`
  + `runnerVersion` dans chaque rapport, écrits avant tout `exit 2` — y compris
  l'échec fatal de lancement (`run().catch`).
- Preuve : leurs 13 cas contrôle-flux **13/13** (dont les 3 faux-zéro reproduits)
  + 6/6 en vrai Chromium.

## P1 — Helpers d'assertion partagés

- `tests-validateurs/assertions.mjs` : `accName` (via `ariaSnapshot`), `accNameMatches`
  (nom calculé sur le locator exact + cibles labelledby résolues — texte, `aria-label`,
  `alt` d'img acceptés), `isTrulyVisible` (ancêtres inclus — `opacity:0` détecté),
  `effectObserved` (action + effet métier séparés).
- Suite `validateurs.mjs` : **9/9 mutants détectés, 0 faux négatif** — dont leurre
  même nom, labelledby cible vide, `opacity:0`, filtre sans effet métier.
- Leur harnais `test_hardened_assertions.mjs` rejoué sur nos CHECKS exportés :
  **5/5 attendus** (leurre rejeté, img-alt accepté — plus de faux rejet, opacity,
  effet métier, main caché).
- SKILL.md règle 15 + phase 3 : import des helpers exigé dans les verify/eval produits.

## P1 — Checklist normative

- 1.2.5 AA corrigé : audiodescription requise (sauf audio déjà complet) ;
  l'alternative textuelle est 1.2.3 niveau A — elle ne suffit plus au AA.

## P2 — Livrabilité

- `package.json` à la racine : playwright 1.63.0 + axe-core 4.13.0 épinglés
  (`npm run setup`, `test:parity`, `test:validateurs`).
- `pre-push` réécrit : `--states`, `--urls`, `--storage-state` (auth),
  distinction exit 1/2, « aide locale, pas garantie » explicite.
- README : install épinglée, exemple `STATES` réel, runner décrit en v4.
- Rapports V2 inchangés (historique) ; les final-report.json restent V2.

## Non couverts — assumés

- Comparaison appariée avec/sans skill : non exécutée (signalée `NOT_TESTED` côté métriques).
- Démonstrations depuis environnement propre : le harnais `eval` de benchmark-v3
  l'exécute au prochain run ; les artefacts V2 existants n'ont pas été re-notés.
- Revue humaine NVDA réelle : hors automatisation, reste dans `human_checks`.
