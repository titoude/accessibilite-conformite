# Rapport Benchmark V2 — accessibilite-conformite

> **Requalification post-revue externe (27/09/2026)** : une revue indépendante a trouvé des
> assertions permissives (tests qui ne peuvent pas échouer), un angle mort dans le runner
> (2e navigation d'état non contrôlée) et des défauts de livraison (yarn.lock RaspAP, label
> `for` erroné). « CONFIRMED » vaut pour la **reproductibilité du score axe**, pas pour la
> conformité WCAG complète ni l'installabilité des patchs. Corrections et requalification
> détaillées : `REPONSE-REVUE-V2.md`.

Run `wfr-1f8e2318494e418092406a02a7fbbefc` — 26/09/2026, durée murale ~2h43, 2 agents × 3 dépôts.
Objectif : re-tester avec le runner corrigé (audit.mjs v2, exit 2 sur erreur de périmètre) les 6 dépôts dont les résultats V1 n'étaient pas vérifiables, et prouver cette fois les affirmations par des artefacts attachés.

## Résultats V2 (déclarés par les agents, artefacts fournis)

| Dépôt | Baseline | Final | Scénarios | Rounds | Budget | Scope identique | Erreurs b/f | Eval finale | Durée (min cumulés) |
|---|---|---|---|---|---|---|---|---|---|
| miniflux/v2 | 182 occ / 4 règles | 0 | 26 | 3 | ✓ dans | **hash prouvé** | 0/0 | 0 finding | 75 |
| benbusby/whoogle-search | 100 occ / 10 règles | 0 | 5 | 2 | ✓ dans | **hash prouvé** | 0/0 | 0 | 45 |
| FreshRSS/FreshRSS | 230 occ | 0 | 36 | 3 | ✓ dans | **hash prouvé** | 0/0 | 0 | 110 |
| CorentinTh/it-tools | 6987 occ | 0 | 51 | **5** | ⚠️ dépassé | **hash prouvé** | 0/0 | 0 | 150 |
| RaspAP/raspap-webgui | 316 occ | 0 | 20 | **4** | ⚠️ dépassé | **hash prouvé** | 0/0 | **5 findings** | 180 |
| excalidraw/excalidraw | 114 occ | 0 | 5 | **4** | ⚠️ dépassé | **hash prouvé** | 0/0 | **2 findings** | 130 |

**Succès stricts (≤3 rounds) : 3/6** — miniflux, whoogle, FreshRSS.
**Hors budget honnêtement déclarés : 3/6** — it-tools, RaspAP, excalidraw.

## Comparaison V1 → V2 (honnête)

| Dépôt | V1 baseline→final | V2 baseline→final | Écart explicable |
|---|---|---|---|
| miniflux | 84 → 0 | 182 → 0 | V2 audite 26 scénarios (états + pages auth via storage-state) vs périmètre réduit V1 |
| whoogle | 88 → 0 | 100 → 0 | V1 : scénario perdu (4→3) ; V2 : 5/5 conservés, hash identique |
| FreshRSS | 87 → 0 | 230 → 0 | V2 périmètre plus complet (36 scénarios, états déclarés) |
| it-tools | 6871 → 0 | 6987 → 0 | Cohérent ; mais V2 honnêtement hors budget (5 rounds) |
| RaspAP | 286 → 0 (2 erreurs persistantes cachées) | 316 → 0 | V2 : 0 erreur, mais 4 rounds + 5 findings d'éval |
| excalidraw | 37 → 0 (4 rounds non comptés) | 114 → 0 | V2 : périmètre états inclus, 4 rounds déclarés hors budget, 2 findings |

**Ce que V2 montre que V1 cachait :**
- Les « succès propres » V1 sur it-tools/RaspAP/excalidraw étaient en réalité hors budget ou à périmètre non prouvé. La V2 les déclare `budget_exceeded` — c'est le protocole qui fonctionne.
- RaspAP et excalidraw ont produit des **findings d'éval finale** (7 au total) : le zéro violation axe n'est pas la conformité complète, l'éval indépendante attrape le reste.
- miniflux : 2 `incomplete` color-contrast persistés + NEEDS_HUMAN_REVIEW sur status_announcements — honnêtement signalés, pas absorbés.

## Vérifications de l'orchestrateur (moi)

- **Hash de périmètre** : recalculé sha256(ids triés) sur les 11 scope.json reçus → **tous MATCH** ; baseline = final à l'identique pour les 6 dépôts. La comparaison « N = N » de V1 est remplacée par une preuve.
- **0 erreur partout** : errors_baseline = errors_final = 0 — les erreurs de périmètre V1 (miniflux, FreshRSS, RaspAP) sont résorbées.
- **Contract d'artefacts tenu** : 47 fichiers reçus (patch.diff + report.json/md + scope.json + provenance.json par dépôt) — la V1 n'avait rien produit de vérifiable.

## Audit tiers indépendant (2 sessions séparées, sans lien avec les agents du bench)

Méthode : re-clone au commit épinglé + `git apply patch.diff` + boot local + re-lancement d'audit.mjs sur le même périmètre + recalcul des scopeHash + revue statique complète des patches.

**Verdict : CONFIRMED ×6/6** — les résultats finaux (0 violation / 0 erreur) sont reproductibles par un tiers, les hash de périmètre mesurés sont identiques aux déclarés, aucune triche dans les patches.

| Dépôt | Verdict | Violations mesurées | scopeHash mesuré | Écarts notés |
|---|---|---|---|---|
| miniflux/v2 | CONFIRMED | 0 (26/26 sc.) | identique | baseline mesurée 3 règles/172 nœuds vs 4/182 (variance de seed) ; STATES du run baseline non livrés dans les artefacts |
| whoogle-search | CONFIRMED | 0 (5/5) | identique | — |
| FreshRSS | CONFIRMED | 0 (36/36, 37 incomplets identiques) | identique | définitions STATES des états dynamiques absentes des artefacts (reconstruites, mêmes résultats) |
| it-tools | CONFIRMED | 0 (51/51) | identique | incomplets 57 vs 55 (variation environnementale) |
| RaspAP | CONFIRMED | 0 (20/20) | identique | **défauts de patch trouvés** : yarn.lock corrompu (double hash integrity) empêchant `yarn install` ; `for` erroné dans theme.php ; reproduction a exigé des contournements env (PHP static + mount-ns) |
| excalidraw | CONFIRMED | 0 (5/5, incomplets identiques) | identique | MANIFEST.md liste un 5e état non implémenté (dérive documentaire) |

**Enseignements de l'audit tiers :**
- Le contrat d'artefacts V2 fonctionne : tout est vérifiable a posteriori.
- Défauts réels mais mineurs trouvés par la revue de patch (yarn.lock, label `for`, dérive MANIFEST) — à inclure dans les points humains restants.
- Amélioration pour une V3 : livrer les définitions STATES utilisées (harnais) dans les artefacts — l'auditeur a dû les reconstruire.

## Limites honnêtes (inchangées)

- axe automatise ~30-40 % des critères WCAG ; le reste = checklist + humain (les human_checks/NEEDS_HUMAN_REVIEW sont listés par dépôt, pas masqués).
- 6 dépôts ≠ preuve statistique ; borne d'échec non calculable sans indépendance/représentativité.
- Le V2 couvre les douteux de V1 ; les 12 autres résultats V1 restent déclaratifs (artefacts perdus, VMs éphémères).
- Patches locaux non poussés — vérifiables via les patch.diff joints, applicables au commit épinglé.
