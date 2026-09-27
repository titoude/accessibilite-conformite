# Réponse à la revue indépendante du benchmark V2

> Point par point sur la revue ChatGPT V2 (`revue-benchmark-v2.zip`), corrections intégrées
> et requalification honnête des résultats V2. Les rapports V1/V2 restent historiques —
> ce document n'efface pas les réserves, il les relocalise.

## Statut des corrections

| Point revue | Correction | Preuve |
|---|---|---|
| §4 Assertions trop permissives (5 contre-exemples Chromium prouvés) | SKILL.md règles 13-15, 17 : effet observable ≠ action exécutée ; sous-chaînes ambiguës interdites (`includes('read')` matche `unread` → token exact) ; nom accessible = nom **calculé** comparé à l'attendu (pas présence d'attribut) ; zoom/reflow mesure un élément de référence + `scrollWidth ≤ viewport` (pas `clientWidth > 0`) | SKILL.md règles 13-17 |
| §4.2 `.catch(()=>{})` sur étape requise | Règle 14 : catch muet interdit — élément requis absent = FAIL ou erreur de couverture | SKILL.md règle 14 |
| §5 2e navigation d'état non contrôlée (HTTP500/login/setup-redirect : 3 faux succès reproduits sur le runner V2) | `audit.mjs` v3 : `checkNav()` appliqué à **toute** navigation — la 2e `goto` de l'état est contrôlée (HTTP ≥ 400, redirection login), l'URL post-setup re-vérifiée, navigation hors origine pendant le setup = erreur | `tests/` rejoués : 9/9 sur leur harnais adversarial |
| §5 résultat moteur `{}` traité comme listes vides | v3 : résultat axe sans `violations[]` → erreur « scan invalide », jamais un PASS | test `malformed_engine_result` → exit 2 |
| §5 état inconnu : exception avant écriture des rapports | v3 : `writeErrorReports()` atomique — config invalide écrit scope.json/report.json/report.md horodatés **avant** tout travail, puis exit 2 | test `unknown_state_report` → exit 2 + rapports écrits |
| §5 `--urls` relatifs non résolus | v3 : chemins relatifs résolus contre l'URL de base ; relatifs sans base = erreur de config | code audit.mjs lignes 59-63 |
| §6 yarn.lock RaspAP corrompu | Contrat V3 : `install_build` obligatoire — checkout propre + patch + install **verrouillée** (`--frozen-lockfile`/`npm ci`) + build. Patch qui casse l'install = FAIL de livraison | benchmark-v3.py étape 7 |
| §6 `for="settings-dark-mode"` erroné | Reste un défaut du patch V2 documenté — couvert par la règle : présence d'attribut ≠ correction sémantique (règle 15 généralise) | requalification ci-dessous |
| §6 `setInterval(100→1000)` pour passer `networkidle` | Règle 16 explicite : **jamais modifier le produit pour satisfaire le harnais** — le harnais s'adapte (`domcontentloaded` + sélecteur) | SKILL.md règle 16 + interdit ajouté |
| §6 `/torproxy_conf` = template d'erreur audité | Contrat V3 : distinguer `ERROR_TEMPLATE_AUDITED` de `BUSINESS_SCENARIO_COMPLETE` — un template accessible ne prouve pas la fonctionnalité | benchmark-v3.py champ `business_journey` + `execution_complete` |
| §7 537 `incomplete` sans décision traçable | checklist.md : décision de résolution **par groupe** `rule_id × scénario` (`RESOLVED`/`NEEDS_HUMAN_REVIEW`/`N-A` + preuve) ; un incomplete sans décision reste ouvert | checklist.md bloc intro |
| §8 scope hash ne couvre que les labels | `scope.json` gagne `statesHash` : sha256 de `{nom: {url, setup.toString()}}` — couvre URL **et** code de setup | audit.mjs lignes 338-349 |
| §8 harnais non livrés (verify/eval/tt-preload absents des patches) | Contrat V3 : artefacts obligatoires = patch.diff + manifest.json + reports + provenance + states.json + **verify.mjs + eval-final.mjs + tout script de vérification** | benchmark-v3.py étape 7 |
| §8 manifeste attendu vs exécuté | Contrat V3 : `manifest.json` figé **AVANT** l'audit (routes + rôles + données + thème + attentes), comparé au scope exécuté via `scope_vs_manifest` | benchmark-v3.py étape 2 + schéma |
| §9B décisions mélangées | Schéma V3 : `execution_complete`, `axe_score`, `review_resolved`, `install_build`, `budget_respected`, `final_validation`, `business_journey` — le « succès » se dérive du contrat, pas de 0 violation | benchmark-v3.py RESULT_SCHEMA |
| §8 « 47 fichiers » vs 39 réels ; compteurs non générés depuis le contenu | Convention : toute description d'une livraison se génère depuis le contenu réel (`find | wc -l`), jamais de mémoire | appliqué aux zips ci-dessous |

## Requalification honnête de la V2

Reformulation retenue (alignée §10 de la revue) :

> Six dépôts ciblés : 7 929 occurrences de violations automatiques → 0 sur 143 identifiants de scénario, reproductibilité du zéro confirmée par audit tiers (6/6 CONFIRMED). Trois dépôts dans le budget de 3 rounds, trois hors budget déclarés. 537 résultats `incomplete` conservés avec le statut qu'ils méritent : ouverts, pas des PASS. La revue des preuves a trouvé des assertions permissives, un angle mort de navigation d'état et des défauts de livraison (yarn.lock, label `for`) — la conformité complète et l'absence de régression ne sont **pas** établies.

Ce qui reste vrai : le zéro-violation était reproductible par un tiers sur checkout propre au commit épinglé. Ce qui change : « CONFIRMED » vaut pour la **reproductibilité du score axe**, pas pour la conformité WCAG ni pour l'installabilité du patch RaspAP.

## Non couverts (reste à faire, assumé)

- **§9A valider les validateurs en conditions réelles** : le harnais de contre-exemples couvre le runner ; les assertions métier des verify.mjs par dépôt ne sont pas encore soumises à injection de défauts.
- **§9C contrôle « depuis zéro » complet** : `install_build` est exigé au contrat V3 mais non rejoué sur les 6 patchs V2 (install verrouillée incluse).
- **§9E contrôle apparié avec/sans skill** : nécessaire pour mesurer l'apport propre du protocole — non exécuté, double le coût.
- **Revue humaine** (NVDA réel, zoom réel) : toujours le juge final non automatisable.
- Les correctifs de patchs V2 eux-mêmes (yarn.lock, `for` erroné) : documentés, non réécrits — la V2 reste historique.

## Versions

- `audit.mjs` v3 : 2e navigation contrôlée, résultat moteur validé, rapports d'erreur atomiques, `--urls` relatifs résolus, `statesHash`.
- `SKILL.md` : 17 règles (13-17 = qualité d'assertion et produit-vs-harnais).
- `checklist.md` : décisions traçables par groupe pour `incomplete`.
- `benchmark-v3.py` : manifeste figé pré-audit, harnais complet dans les artefacts, champs de décision séparés, `install_build` obligatoire.
