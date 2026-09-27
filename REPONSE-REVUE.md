# Réponse à la revue du 26/09 — corrections appliquées

Chaque point est tracé : ✅ corrigé et vérifié · 🟡 corrigé, à re-tester en conditions réelles · ⚠️ reconnu, reporté au plan V2 · ❌ irrécupérable.

## 1. Défauts du runner — tous corrigés, rejoués avec votre harnais

`python3 test_runner.py audit.mjs` — résultats après correction (avant → après) :

| Cas | Avant | Après |
|---|---|---|
| clean_control | 0 | **0** ✓ |
| violation_control | 1 | **1** ✓ |
| navigation_failure | **0** | 2 ✓ |
| csp_injection_failure | **0** | 2 ✓ |
| required_selector_missing | **0** | 2 ✓ |
| unknown_requested_state | **0** | 2 ✓ |
| empty_explicit_url_list | **0** | 2 ✓ |
| unexpected_http500 | ignoré | **enregistré comme erreur, exit 2** |
| unexpected_login_redirect | ignoré | **détecté (finalUrl + LOGIN_PATH), exit 2** |
| incomplete_result_discarded | perdu | **persisté dans report.json + section « à revoir » dans report.md** (+ `--strict-incomplete` pour les rendre bloquants) |
| hash_spa_routes_collapsed | 1 scan | **3 scénarios distincts** (fragments route-like `#/`, `#!`, `#$:` conservés ; `--keep-hash` pour le reste) |
| all_states_unconfigured | 0 silencieux | **exit 2** — `--states all` sur STATES vide exige maintenant `--states none` explicite |

Corrections associées livrées dans `audit.mjs` v2 :
- **R01/R02** : toute erreur (navigation, injection, précondition `--wait-for` non avalée, HTTP ≥ 400, redirection login, état inconnu, config) → `error` enregistré + exit 2. Règle affichée : « un audit partiel n'est pas un PASS ».
- **R03** : validation du manifeste au lancement (`configErrors`) — état inconnu, `--urls` vide, `all` sans états, `none` combiné.
- **R04** : persistés — `incomplete`, `testEngine`, `httpStatus`, `finalUrl`, `requestedUrl` par scénario dans `report.json` ; section « incomplets à revoir » dans report.md.
- **R05** : `--storage-state auth.json` (Playwright auth context), contrôle du statut HTTP et de l'URL finale par scénario.
- **R06** : `scope.json` généré — liste des scénarios exécutés {id, status, httpStatus, finalUrl} + `scopeHash` sha256 : la comparaison baseline/final porte sur les **identifiants**, pas sur le compteur 246.
- Distinction ancres/routes-hash : fragment conservé s'il ressemble à une route (`/`, `!`, `$`, `:`) ou si `--keep-hash`.

## 2. Règles SKILL.md — corrigées

- **tabindex** : règle absolue remplacée — roving tabindex/composite/focus programmatique/état inactif explicitement légitimes, avec tests d'entrée/navigation interne/sortie (règle 8 + checklist).
- **Modales** : distinction exigence APG dialog (focus déplacé, arrière-plan inerte, Esc, retour au déclencheur) vs 2.1.2 (impossibilité de sortir) — « nommer la bonne exigence » (règle 9).
- **Reflow** : exceptions 2D ajoutées (tableaux, cartes, canvas, graphiques) — scrollWidth global ≠ preuve (règle 10 + checklist).
- **2.5.7** : alternative au **pointeur simple** exigée, le clavier seul ne suffit pas (règle 11 + checklist).
- **Grille de critères** élargie dans SKILL.md et checklist.md : focus non masqué (2.4.11/12), contenu au survol/focus refermable-persistant-survolable (1.4.13), saisie redondante (3.3.7), authentification accessible (3.3.8), autocomplete purpose (1.3.5), audiodescription (1.2.5).
- **« Tous lecteurs d'écran »** reformulé : affirmé seulement avec matrice de tests réels — la conformité WCAG est le socle, pas une preuve d'exécution NVDA/VO/TalkBack.

## 3. Requalification honnête des résultats V1

| Point de la revue | Requalification |
|---|---|
| Excalidraw 4 rounds | **Succès hors budget, pas succès strict** → max strict 17/18 |
| 8 findings d'éval | = **3/18 dépôts (16,7 %)** avec ≥1 problème post-validation opérationnelle — pas un taux par correction |
| 246 = 246 | **Ne prouve pas l'identité des ensembles** (whoogle 4→3, it-tools 50→51 s'annulent ; miniflux/FreshRSS : états en erreur au baseline audités au final ; RaspAP : 2 erreurs persistantes) |
| bench-3 causes racines | JSON dit **71**, narration disait ~80 — le JSON fait foi |
| gitea 420 min | minutes **cumulées** de sous-agents ≠ durée murale — champ renommé `duration_min` documenté en cumulé |
| `"null"` chaîne | schéma corrigé : `null` JSON ou enum explicite |
| clés critères variables | grille **canonique** imposée dans le prompt V2 (20 clés fixes) |
| axe 4.12 vs 4.13 | divergence documentée ; `axe_version` (testEngine.version) désormais capturée par dépôt |
| Pas de NOT_TESTED | les 10 `human_checks` vides + statuts non testés doivent être explicites — requis dans le schéma V2 |
| Axe `incomplete` | persisté, compté (`incomplete_final`), affiché « à revoir » |

**La borne binomiale 15,3 % est retirée des affirmations V1** — elle suppose indépendance/représentativité/définition de succès fiable, invalidées par les défauts du runner.

## 4. Contrat V2 implémenté (benchmark.py)

Schéma enrichi : `scope_hash_baseline`/`scope_hash_final`/`scope_identical`, `errors_baseline`/`errors_final`, `incomplete_final`, `eval_repairs` (réparations post-éval comptées, historique non masqué), `budget_exceeded` (succès hors budget ≠ strict), `axe_version`, `business_journey` (parcours métier complet requis par dépôt), `artifacts` (patch.diff + report.json + scope.json joints au message final — les sessions peuvent joindre des fichiers), `duration_min` cumulé documenté, `failure` = null JSON, `criterion_status` à clés canoniques.

Prompt V2 : manifeste figé avant tout audit, auth via storageState, parcours métier obligatoire, pièces jointes probantes exigées, comparaison de périmètre par identifiants.

## 5. ⚠️ Irrécupérable / reporté

- **Patches et artefacts V1** : les agents ont travaillé en VM éphémères sans push — les diffs, rapports JSON par round, manifestes et traces sont **perdus**. La V1 reste un résultat historique déclaratif, non une preuve vérifiable. D'où le contrat d'artefacts V2.
- **Vrai navigateur** : vos tests de flux sont rejoués et passés ; il reste à exécuter les fixtures dans un vrai Chromium (Playwright) — prévu en étape 2 du plan V2.
- **Contrôle apparié** (avec/sans skill) et **revue humaine réelle** sur parcours difficiles : intégrés au plan V2, pas encore exécutés.
- **Indépendance architecturale** (orchestrateur hors branche, journaux append-only, permissions empêchant le correcteur d'éditer les preuves) : partiellement couvert par Devin (sessions/VM distinctes, structured output) — le durcissement complet reste à faire dans `benchmark.py` v2.1 si vous le validez.

## 6. Question pour la suite

Ordre proposé (votre §9) : on peut relancer un **benchmark V2 réduit** sur les 5 dépôts à périmètre douteux (whoogle, it-tools, miniflux, FreshRSS, RaspAP) + excalidraw pour le budget — plutôt que les 18, pour mesurer si le nouveau runner/scopage change les conclusions, à coût maîtrisé. Go ?
