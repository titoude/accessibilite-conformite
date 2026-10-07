# verdict-auditeur-v3 — cycle 31 phpmyadmin

**Verdict : CONFIRMED** — le fixer v2 (commit `c1ab785`) tient tout ce que le
ré-audit v1 (`e1b2f59`) avait mesuré, et tout ce qu'il prétend : patch 73
fichiers 0 rejet, install-build éprouvé **par moi** sur stack indépendante
(clone @e7e3f96 + patch + yarn build + composer:2 + stack fraîche :8402 →
0 viol/0 err), final 50 scénarios 0 viol/0 err, sondes 23NA/0F, verify 25/25,
eval 0 FAIL, provenance 32/32 sha256. Les deux pages ajoutées au scope
(tracking, designer) et les 3 états thèmes (metro, original,
console-dark-pmahomme) rejouent 0 viol avec les fixes mesurés en live.
Warts nouveaux ci-dessous : **tools/reset-theme.mjs commité est un
SyntaxError** (jamais exécuté par le fixer), la baseline-public livrée n'a
jamais scanné `/themes`, et axe-core non épinglé produit des deltas
mesurables (4.13→4.14). Résiduels hors-scope mesurés : 33 occurrences sur 6
pages admin + colorModes non couverts.

- Ré-auditeur : session `devin-bd24917e05534504ae6d8591e2141e0b` (spawnée par
  devin-3cde6939fc0b489ab7c0d2ffa16c3255), indépendante du fixer.
- Produit : phpmyadmin/phpmyadmin @ `e7e3f96ac4c65f291cc7ced271c0bb6d4ea591ee`
- Méthode : `~/work/pma31-v3-vanilla` :8401 (clone propre) +
  `~/work/pma31-v3-patched` :8400 (clone + patch v2) +
  `~/work/pma31-v3-ib` :8402 (3e clone + patch + build frais, réseau
  `pma31v3ib`, seed identique) ; outillage copié `~/work/run31v3`, axe-core
  local **4.14.0** (vs 4.13.0 des rapports livrés — voir wart W3), playwright
  1.63 ; commandes manifest rejouées verbatim, origines réécrites.

## Rejeu vs livré — chiffres

| Axe | Livré (fixer v2) | Rejeu v3 indépendant | Δ |
|---|---|---|---|
| patch apply | 73 fichiers, 0 rejet | **73 fichiers, 0 rejet** (warnings whitespace seuls) | identique |
| baseline-public | 12 occ / 2 règles / 0 err | **18 occ / 2 règles / 0 err** — leur report n'a que 2 scénarios ; `/themes` (dans --urls documenté) y est **absente**, mesurée par moi = 6 occ | voir W2 |
| baseline-auth | 5045 occ / 14 règles / 0 err / 3641 inc | **4977 occ / 14 règles identiques / 0 err / 3601 inc** | Δ−68 = axe 4.14 (−70 target-size navtree) + NULLs seed v2 (+24 td.null) + env |
| final v2 | 50 sc. / 0 viol / 0 err / 1446 inc | **50 sc. / 0 viol / 0 err / 1437 inc** | −9 inc (bruit axe) |
| install-build | 45 sc. / 0 viol / 0 err / 1071 inc (scope v1, :8081) — **jamais exécuté par le fixer** | clone+patch+build frais :8402 → **45 sc. / 0 viol / 0 err / 1335 inc** | +264 inc = heuristique cc axe 4.14, diffus ±4-15/page |
| sondes incomplets | 1423 P / 23 N-A / 0 FAIL sur 1446 | **1414 P / 23 N-A / 0 FAIL** sur 1437 | identique à proportion |
| verify.mjs | 25/25 | **25/25 PASS** | identique |
| eval-final.mjs | 0 FAIL | **0 FAIL** | identique |
| provenance.json | 32 fichiers | **32/32 sha256 exacts** + patch.diff.sha256 | identique |
| statesHash/scopeHash | final `bc0ff401`/`ecc3f5a4`, IB `2d9a997d`/`f20ecfb1` | miens `b085fe05`/`eed5c3e4` — hashes origin-dependent (port dans l'id), structure 50/45 scénarios identique | conforme |

## Épreuves findings (rejouées en live)

1. **`/table/tracking` — CORRIGÉ, chiffre 10 pas 13.** Vanilla :8401 : les 10
   checkboxes tracking n'ont **aucun id** ni nom (29 cb dont 19 déjà nommées).
   Patché :8400 : `id="tracking_*"` + `label[for]` posés → **29/29 nommées**,
   0 viol au scope. Le « 13 » du brief est approximatif ; le v1 et la mesure
   disent **10** (`alter_table, rename_table, create_table, drop_table,
   create_index, drop_index, insert, update, delete, truncate`).
2. **`/database/designer` — CORRIGÉ mesuré.** `#newPage img` : `alt=""` →
   `alt="New page"` (vanilla vs patché, html brut lu). `.owner` :
   `rgb(136,136,136)` → `rgb(74,74,74)` sur fond blanc = **3.54:1 → 8.86:1**.
3. **Thèmes — rejoués 0 viol.** États `theme-metro`, `theme-original`,
   `console-dark-pmahomme`, `theme-bootstrap-dark` : 0 viol sur patché.
   Vanilla designer sous metro : **7 règles / 97 occ** (color-contrast .owner,
   link-name expanders + `a[href="index.php"]`, target-size navtree 7×,
   image-redundant-alt .ic_b_events) → 0 sous patché. Les « 3 vraies
   violations metro » sont confirmées au sens famille (cc + link-name +
   target-size/alt) et toutes absentes après fix.
4. **Substitution console-dark-pmahomme — HONNÊTE.** Lu dans le clone :
   `public/themes/pmahomme/theme.json` = `colorModes: ["light"]` — pmahomme
   n'a pas de mode dark ; l'état poste `Console/DarkTheme=true` +
   `Mode=show` côté serveur (surface réelle `.console_dark_theme`). La
   substitution est nécessaire et documentée comme telle.
5. **Seed v2 — replantée à l'occurrence près à ~1,3 %, avec nuance.**
   `tools/seed.sql` (users 7 col + access_log + projects + vue
   `v_open_projects`, NULLs bob/dan) produit chez moi 4977 occ / 14 règles —
   **14 familles identiques** à leur 5045. Nuance : la baseline commitée ne
   contient **aucun nœud `.null` réel** (seuls `sql_auto_is_null` /
   `not_null`) → le banc baseline réel n'avait pas de NULL ; les NULLs venaient
   de la seed install-build. La « vraie seed » v2 fusionne les deux — Δ+24 occ
   (12 cc + 12 region sur cellules td.null) expliqué, pas un trou.
6. **wait=1200 + states login-failed + statesHash baseline≠final — doc
   conforme.** scope.json baseline livré : `statesRequested=[login-failed]`,
   wait=1200 mesuré, statesHash `b961f439` ≠ final `ecc3f5a4` (durcissement
   navtree mi-cycle + extension v2 — attendu, origin-embarqué).

## Warts nouveaux (mesurés)

- **W1 — `tools/reset-theme.mjs` commité = SyntaxError.** `const darkReset`
  déclaré deux fois top-level → l'outil **obligatoire** (pref thème/prefs
  console persistées serveur) est inexécutable tel quel. Le fixer v2 a ajouté
  son bloc de reset en tête sans retirer l'ancien en fin de fichier — il ne
  l'a donc jamais exécuté après édition. Rejeu possible uniquement via copie
  réparée (2e bloc renommé `darkReset2`). À réparer au prochain commit.
- **W2 — baseline-public livrée n'a jamais scanné `/themes`.** Le report
  commité contient 2 scénarios (`/` seulement, ×2 états) alors que
  `--urls /,/themes` était demandé → mesuré chez moi 18 occ / 3 pages
  (dont 6 sur `/themes`). Le `12 occ` livré sous-estime la vraie baseline
  publique ; la doc v1 prétendait déjà « 3 URLs ».
- **W3 — axe-core flottant.** `tools/package.json` déclare `^4.10.2`, aucun
  lockfile dans tools/ → le moteur change selon la date de `npm install`
  (livré : 4.13.0 ; rejeu : 4.14.0). Deltas mesurés : navtree « New » 19 px
  reclassé violation→incomplete (baseline Δ−70), incomplets color-contrast
  +263 sur l'IB. Reproductibilité à l'occurrence impossible sans pin.
- **W4 — claim « 13 checkboxes » vs 10 mesurées** (voir finding 1).
- **W5 — `/database/tracking` HTTP 500** sur mon instance patchée (tracking
  DB-level requiert config pmadb) — non compté comme régression : jamais dans
  le scope, préexistant.

## Chasse — hors-scope restant (mesuré sur patché :8400)

6 pages admin hors-scope gardent des violations réelles (**33 occ**) :

| Page | Violations |
|---|---|
| `/database/central-columns` | label ×3 CRITICAL + select-name ×5 CRITICAL + empty-table-header ×2 |
| `/database/multi-table-query` | label ×3 CRITICAL + select-name ×6 CRITICAL + label-title-only ×3 |
| `/table/zoom-search` | select-name ×4 CRITICAL |
| `/view/create` | label ×3 CRITICAL + select-name ×2 CRITICAL |
| `/server/status/advisor` | heading-order ×1 |
| `/normalization` | heading-order ×1 |

→ ~24 occurrences CRITICAL de formulaires sans noms — même famille que les
fixes tracking v2. Candidat direct pour le périmètre du cycle suivant.

**Thèmes/colorModes non couverts** : bootstrap-light (seul dark scanné) ;
metro `teal`/`redmond`/`blueeyes`/`mono` (seul `win` scanné). original et
pmahomme = light seul, couverts.

## Ce que le verdict signifie

- **CONFIRMED** : chaque métrique de santé rejouée à l'identique ou à bruit
  de version axe près ; les claims produits (tracking nommé, designer
  alt/contrast, metro, substitution dark honnête) sont **mesurés vrais en
  live** ; l'install-build — que le fixer n'avait pas exécuté — est éprouvé
  sur stack indépendante et produit 0 viol.
- Le cycle démontre la reproductibilité : 3 clones propres, patch 0 rejet,
  build webpack + composer reproductibles, seeds documentées rejouables à
  ~1,3 % près (avec explication exacte du Δ).
- Les warts (W1-W5) sont des défauts d'outillage/documentation, pas du fix
  produit : le produit patché est réellement à 0 violation axe sur les 50
  scénarios. W1 doit être corrigé — l'outil obligatoire ne tourne pas.
