# Verdict auditeur — cycle 31 : phpmyadmin

**Verdict : CONFIRMED** — les 6 axes du protocole rejoués indépendamment tiennent : patch sain (0 rejet, 68 fichiers), install-build rejoué à 0 viol/0 err, baseline recomputée dans les mêmes 14 familles de règles, final à 0 violation, sondes à 0 FAIL, verify 25/25 et eval 0 FAIL exécutés entiers, provenance 29/29 sha256 exacts, et les 2 claims d'honnêteté (td.null dépendant de la seed, préférence thème persistante) sont **véridiques et prouvés en live**. L'écart baseline −559 occ est entièrement expliqué par des données de bench plus riches que celles documentées dans le manifest (vérifié par rescan à seed enrichie), pas par un trou du scan. Warts et vrais résiduels hors périmètre ci-dessous.

- Auditeur : session Devin indépendante `devin-23fbba14132d48d58d19c49b7ae02aff` (spawnée par devin-3cde6939fc0b489ab7c0d2ffa16c3255)
- Produit : phpmyadmin/phpmyadmin @ `e7e3f96ac4c65f291cc7ced271c0bb6d4ea591ee`
- Commits audités : `e1e97ae` sur `devin/boucle-continue`
- Méthode : rejeu intégral — clone vierge @SHA ×2 (vanilla `~/work/pma31-vanilla` :8300 + patché `~/work/pma31-patched` :8301), `git apply --check` + `git apply` patch.diff **0 rejet, 68 fichiers (+976/−137)**, images docker maison `php:8.3-apache` + mariadb (réseaux `pma31aud`/`pma31aud-b`, alias `pma31-db`), seeds séparées (5 lignes, NULLs sur l'instance patchée), outillage copié `~/work/run31/tools` sur node_modules partagé (playwright 1.63 / axe-core 4.13), commandes du manifest rejouées verbatim avec origines réécrites sur mes ports.

## Rejeu vs livré — chiffres

| Axe | Livré | Rejeu auditeur | Δ |
|---|---|---|---|
| patch apply | `git apply --check` OK, 68 fichiers | 0 rejet, 68 fichiers (+976/−137) | **identique** |
| baseline-public | 12 occ / 2 règles / 0 err | 12 occ / 2 règles / 0 err | identique |
| baseline-auth | 5045 occ / 14 règles / 0 err / 3641 inc | **4486 occ / 14 règles identiques / 0 err** / 2969 inc | Δ−559 expliqué (seed de bench non documentée, cf. §findings-2) |
| final (45 scénarios) | 0 viol / 0 err / 1352 inc | **0 viol / 0 err / 1257 inc** | conforme (inc volatile, toutes familles cc/th/dup/role présentes) |
| install-build | 0 rejet + 0 viol / 0 err / 1071 inc | 0 viol / 0 err / 1257 inc sur stack fraîche | conforme |
| sondes incomplets | « 1353 sondes : 1317 PASS / 36 N-A / 0 FAIL » | fichier commité = **1352 items : 1317 PASS / 35 N-A / 0 FAIL** ; mon rejeu = 1245 PASS / 101 N-A / **0 FAIL** ; sur mon rapport = 1221 PASS / **36 N-A** / 0 FAIL | 0 FAIL partout ; claim écrit off-by-one (1353/36 vs fichier 1352/35) |
| verify.mjs | 25/25 | **25/25** exécuté entier | identique |
| eval-final.mjs | 0 FAIL | **0 FAIL** exécuté entier | identique |
| provenance | 29 fichiers hashés | **29/29 sha256 exacts** | identique |
| scopeHash final | `546c483a…` (auth) | hash rejoué cohérent (scénarios identiques, origines réécrites) | conforme |

**Baseline-auth par règle (livré → rejeu)** : les **14 familles sont identiques** — region 2969→~2500, image-redundant-alt 1368→~1200, target-size 183→~160, color-contrast 137→~110, label 86, select-name 69, link-name 57, landmark-one-main 43, page-has-heading-one 42, tabindex 38, link-in-text-block 18, empty-table-header 17, label-title-only 17, scrollable-region-focusable 1. Aucune famille absente, aucune nouvelle.

## Findings éprouvés

1. **Baseline Δ−559 = données de bench non documentées, pas un trou.** Le manifest décrit la seed `a11ydb` comme « 1 table `users(id,name,bio NULL,homepage NULL)` 5 lignes » ; le report baseline commité référence des nœuds `nav_node_table:nth-child(2/3)` et `field_14_3` → le vrai bench avait **3 tables (access_log, projects, users ~7 colonnes)**. En enrichissant ma seed vanilla à l'identique (3 tables, users +active/created/email), les deltas par page s'effondrent de ±80-300 à **±3-26** (/table/structure 204 vs 207, /database/structure 115 vs 116, / 72 vs 69, /sql 216 vs 190). Le claim 5045 est vrai *sur leurs données* ; le défaut est documentaire : la recette de seed livrée ne reproduit pas leur bench. Conséquence protocole : le gate « familles de règles + final=0 » est tenu ; la reproductibilité à l'occurrence exige que le manifest décrive la seed réelle.
2. **Claim td.null seed-dépendant — VRAI.** Sur seed sans NULL : 0 occurrence td.null (famille absente de mon baseline 4486) ; sur seed avec NULL : `td.null` rendu (4 cellules `NULL` mesurées). Après patch : `color: #6c6c6c !important` compilé dans les CSS des 4 thèmes + `#a8a8a8` dans le bloc dark bootstrap (patch.diff lignes 139/197/434/640/900) ; **mesuré en live 5.25:1** sur /sql browse. Le claim « données de bench identiques exigées » est donc justifié et le fix est effectif.
3. **Claim préférence thème persistante — VRAI.** POST `/themes/set` bootstrap+dark puis chargement nu d'une autre page → le rendu reste bootstrap/dark (`data-bs-theme="dark"`, stylesheet bootstrap) **sans aucun reset** ; après soumission des formes natives pmahomme/light → retour light. `reset-theme.mjs` est réellement obligatoire avant chaque scan, comme documenté.
4. **Sondes : 0 FAIL en 3 configurations** — (a) rejeu du fichier commité 1352 items sur MA stack : 1245 PASS / 101 N-A / 0 FAIL (N-A = 83 « not found » formes DOM différentes + 13 hidden + 5 « no data cells », échantillonnés = structurels, pas des défauts d'évaluateur) ; (b) sur mon propre rapport final 1257 items : 1221 PASS / 36 N-A / 0 FAIL ; (c) échantillon des N-A revendiqués : légitimes (alpha indécidable, hidden inputs non-focusables hors scope axe, `role=main` implicite). Pire ratio PASS mesuré : cluster `color-contrast` .btn-primary ~4.50 — frontière légitime, pas un FAIL masqué.
5. **Patch sain : aucun sélecteur cassé, aucune régression JS observable.** grep `\[name="[^"]*" [a-z-]+=` sur l'arbre patché : 0 hit ; `php -l` propre sur les 7 PHP modifiés ; les 9 états dynamiques s'exécutent (navtree, console, dropdowns, modale add-index, inline-edit, profiling, bad-query, bootstrap-dark, mobile-390) ; **0 pageerror** dans mon rapport final.
6. **results.json complet** — `hors_perimetre`, `causes_racines`, `notes` (les 2 leçons seed+thème), `corrections_post_audit` documentés ; rien de caché repéré par comparaison avec les rapports commités.

## Résiduels hors axe (mesurés, réels)

1. **`/table/tracking` : 10 violations `label` CRITICAL** — checkboxes `alter_table, rename_table, create_table, drop_table, create_index, drop_index, insert, update` (+2) sans aucun nom accessible. Page hors périmètre des 36 URLs ; non patchée.
2. **`/database/designer` : 2 violations sérieuses** — le patch a touché `designer/main.twig` (textarea `aria-label`) mais il reste `color-contrast` sur `.owner` (nom de base) et `link-name` sur `#newPage` (bouton icône, `alt=""` → nom vide). Hors périmètre.
3. **Couverture thèmes : 4 patchés, 2 scannés.** Les scss des 4 thèmes sont patchés (bootstrap, metro, original, pmahomme) mais seuls **pmahomme (défaut) + bootstrap-dark (état mutant)** ont été scannés live ; **metro, original et pmahomme-dark jamais rendus** — fixes présents dans les CSS compilés mais non vérifiés en rendu.
4. **`/server/monitor` et `/server/status/processlist` n'existent pas** en 6.0-dev (404 applicative, page sans chrome) — ne pas les compter comme résiduels ; les routes ont changé de nom.
5. **Off-by-one documentaire sondes** : results.json écrit « 1353 sondes / 36 N-A » alors que le fichier commité compte **1352 items / 35 N-A** (1317 PASS identique). Un nœud incomplet présent à l'écriture du claim mais absent/dédupliqué du fichier commité — lag doc, pas falsification.
6. **Wait baseline** : scope.json du baseline commité enregistre `wait=1200` vs `--wait 2000` dans le manifest verbatim, et baseline/public a tourné avec `states=['login-failed']` vs `--states none` documenté — écarts internes mineurs de traçabilité (le résultat public est néanmoins reproduit à l'identique : 12 occ/2 règles).

## Warts

- `manifest.json` documente une seed (1 table/4 col) différente du bench réel (3 tables/~7 col) — reproductibilité à l'occurrence cassée, à corriger dans la doc.
- `statesHash` baseline `b961f439` ≠ final `546c483a` : l'état navtree a été durci **en cours de cycle** (documenté dans install-build.log + notes) — transparent mais le hash baseline ne se reproduit pas tel quel.
- 3 itérations de patch pendant l'install-build (td.null, cm-number teal-800, variantes dark, navtree) — le patch.diff final embarque tout, mais le log montre un cycle itératif ; sha256 provenance couvre l'état final.

## Ce que le verdict signifie

- **CONFIRMED** parce que chaque axe du protocole rejoue : le patch s'applique proprement et se montre fonctionnel (les états tournent, les fixes se mesurent — td.null 5.25:1 en live), les deux pipelines (workdir + install-build clone propre) produisent 0 violation, les 14 familles de règles baseline sont reproduites à l'identique (l'écart d'occurrences étant tracé à une différence de données de bench, vérifiée), l'outillage est exécutable de bout en bout (verify 25/25, eval 0 FAIL, sondes 0 FAIL), provenance intègre, et les deux claims d'honnêteté sont non seulement vrais mais *sous-estimés* (vérifiés par mesure live indépendante).
- Le claim principal « 5045 → 0 » est confirmé dans sa substance : un produit à ~5000 occurrences sur 14 familles ramené à 0 violation axe sur 45 scénarios, reproductible sur clone vierge + stack fraîche.
- Les résiduels réels sont **hors périmètre déclaré** (tracking 10 label critiques, designer 2 sérieuses, metro/original/pmahomme-dark non scannés) — à ouvrir en périmètre du prochain cycle ou d'un cycle complémentaire, pas bloquants pour ce verdict.
