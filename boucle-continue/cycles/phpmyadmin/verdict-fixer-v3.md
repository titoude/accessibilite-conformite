# verdict-fixer-v3 — cycle 31 phpmyadmin

**Fixer v3 : session `devin-3f2505a4cfe5401699574d5274ebd0c9`** (spawnée par
devin-3cde6939fc0b489ab7c0d2ffa16c3255), sur la base du ré-audit v3
(`559d1ba`, CONFIRMED + 5 warts + résiduels hors-scope). Toutes les
corrections sont **rejouées en live** — aucun outil livré non exécuté.

## Warts corrigés

| Wart | Correction | Preuve |
|---|---|---|
| **W1** `tools/reset-theme.mjs` SyntaxError (`darkReset` ×2) | Corrigé (bloc dupliqué supprimé) + **EXÉCUTÉ** : instance salie metro/mono → outil → `theme reset OK: pmahomme mode=light`, vérifié par sonde indépendante (`link themes/pmahomme`, `data-bs-theme=light`) | outil tourne dans les deux sens |
| **W2** baseline-public incomplète | Rejouée COMPLÈTE sur vanilla :8090 avec `/themes` dans les urls publiques : **3 scénarios** (`/` + `/themes` + `login-failed`), **2 règles / 6 occ chacune = 18 occurrences** (landmark-one-main ×3, region ×15) — `/themes` = 6 occ comme l'auditeur l'avait mesuré | `reports/baseline/public/` |
| **W3** axe-core flottant | Épinglé `"axe-core": "4.13.0"` dans `tools/package.json` (= testEngine des rapports baseline) + `package-lock.json` généré → `npm ci` reproductible | `axe-core: 4.13.0` mesuré |
| **W4** claim « 13 checkboxes » | Chiffre réel = **10** checkboxes tracking — déjà corrigé dans la prose v2 | — |
| **W5** `/database/tracking` 500 | Hors scope, préexistant (pmadb absent) — non touché | — |

## Résiduels hors-scope → scope v3 (33 occ → 0)

Les 6 pages mesurées par l'auditeur sont intégrées au scope auth
(`urls-auth.txt` **38 → 44**) et corrigées dans le patch v3, même famille
(labels/`for` + `heading-order`) :

| Page | Fix v3 |
|---|---|
| `/database/central-columns` | `<th>` vides → `<span class="visually-hidden">` ; selects/inputs/textareas `field_0_*`/`field_{row}_*` → `aria-label` ; checkboxes lignes → `aria-label` « Select column %s » |
| `/database/multi-table-query` | `aria-label` sur tableNameSelect/columnNameSelect/criteria/aliases/rhs ; `<label>` sur radios sort/logical_op ; 3 strings HTML dynamiques dans `multi_table_query.ts`. `.show_col` gardé `input`+`<span>` siblings (le JS lit `.siblings('.show_col')`) |
| `/table/zoom-search` | `aria-label` criteria column %s + checkbox NULL « NULL for column %s » |
| `/view/create` | `<label for>` + ids (view_definer/view_sql_security/view_name/view_column_names/view_as/view_with) |
| `/server/status/advisor` | h4→h3 ×2 |
| `/normalization` | h3.card-title→h2 |

## Thèmes restants

- **Viables — 5 états ajoutés** : `theme-metro-teal`, `theme-metro-redmond`,
  `theme-metro-blueeyes`, `theme-metro-mono` (sur `/database/designer`,
  vérif `data-bs-theme`), `theme-bootstrap-light` (sur `/server/databases`).
  Tous rejoués **0 violation**.
- **Effet bénéfique** : les nouveaux états ont révélé un vrai `color-contrast`
  metro — bouton `background:#aaa` texte blanc = **2.32:1** sur
  teal/redmond/mono → `--button-background` → `#04627c`/`#a10707`/`#666`
  (≥4.5:1) dans `metro/scss/_root.scss` → 0 viol.
- **Non-viables documentés** : pmahomme/original n'ont pas de mode dark
  (`theme.json` colorModes=[light], `setColorMode` ignore les modes
  invalides) — la surface sombre réelle est couverte par
  `console-dark-pmahomme` (substitution v2 confirmée honnête par l'auditeur).

## Bug d'outillage majeur trouvé et tué : course cookie/pref thème

Le POST `/themes/set` sans `ajax_request=true` répond 302 → `fetch` suit la
redirection **avec le cookie encore ancien** → `UserPreferencesLoading`/
`UserPreferencesHandler` voit `cookieTheme ≠ ThemeDefault` et **re-sauve
l'ancien thème en préférence serveur** → la mutation est annulée (mesuré via
`docker logs` : `SAVE userconfig {ThemeDefault:"bootstrap"}` atterrissant
*après* le save `{"metro"}`). Même mécanisme via les **XHR ambiantes** de
chaque page (`/git-revision`, `/version-check`, `/console/update-config`)
qui partent avec le cookie d'avant mutation.

Fix `tools/audit.mjs` (toutes mesurées live) :

1. mutations via `page.request.post` (stack Node Playwright — partage le jar
   à cookies, non intercepté par `page.route`) + `ajax_request=true` →
   réponse JSON 200, **aucune requête parasite** ;
2. `page.route` abort sur `/git-revision`, `/version-check`,
   `/console/update-config` (XHR ambiantes — plus aucun écrivain de pref en
   vol pendant la fenêtre de mutation) ;
3. normalisation de l'instance au démarrage du run (pmahomme/light +
   Console DarkTheme=false/Mode=collapse) — un run précédent peut laisser
   l'instance sale, les prefs étant persistées serveur ;
4. vérif `themeColorMode` dans la réponse JSON + vérifications CSS/
   `data-bs-theme` déjà en place par état.

`reset-theme.mjs` durci pareillement (blocage `/git-revision`,
`/version-check`).

## Chiffres rejoués (produit patché v3 :8080)

| Axe | v3 |
|---|---|
| **Run final** | **61 scénarios (44 pages + 17 états) : 0 violation, 0 erreur, 1613 incomplets** — `reports/final/` |
| Baseline public | 3 scénarios / 18 occ / 0 err — `reports/baseline/public/` |
| Sondes incomplets | **1613 : 1567 PASS / 46 N-A / 0 FAIL** — `reports/probes/incomplete-probes.json` |
| `verify.mjs` | **25/25 PASS** |
| `eval-final.mjs` | **0 FAIL** |
| patch.diff | régénéré depuis l'arbre patché vérifié : **83 fichiers, 3179 lignes** (sources scss/ts/twig uniquement) |
| scopeHash / statesHash | `05866035…` / `aaac665a…` |

## Livrables mis à jour

`patch.diff` (v3) · `tools/audit.mjs` (mutations déterministes, 5 nouveaux
états) · `tools/reset-theme.mjs` (corrigé + exécuté) · `tools/urls-auth.txt`
(44) · `tools/package.json`+`package-lock.json` (axe 4.13.0) ·
`reports/final/` + `reports/baseline/public/` + `reports/probes/` ·
`manifest.json` · `results.json` (entrée `corrections_post_audit_warts v3`) ·
`states.json` · `scope-compare.json` · `provenance.json` (re-hashé en dernier)

## Honnêteté / limites

- Le run install-build n'a **pas** été rejoué en v3 (stack indépendante :8402
  éprouvée par l'auditeur — la mienne :8081 est la stack v2 conservée).
- `git-revision`/`version-check`/`update-config` bloqués pendant les scans
  auth = hygiène de banc (XHR ambiantes, documentées) — les pages restent
  fonctionnelles ; la baseline public n'a pas de session et n'en est pas
  affectée.
- Les 46 N-A des sondes sont des noeuds masqués/alpha indécidables — liste
  exhaustive dans `incomplete-probes.json`.
- `reports/final/` remplace l'ancien `final/` v2 (50 sc.) — l'historique des
  chiffres v2 reste dans `results.json` (`corrections_post_audit` round v2)
  et `scope-compare.json`.
