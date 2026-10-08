# Cycle 54 — verdict-worker-v2 (WORKER-CONTINUATION)

Reprise du run PARTIEL `88ae900` : résiduel 15 règles/934 occ → **0 violation / 0 erreur**
sur les 15 scénarios authentifiés + 0 sur le public `/welcome`.

## Trajectoire mesurée (instance :9540, source patchée en continu)

| round | règles | occ | note |
|---|---|---|---|
| baseline | 97 | 6184 | état vanilla @`a9df5c3` |
| r3 | 15 | 934 | patch v1 (20 fichiers) |
| r5 | 9 | 84 | region/h1/landmarks structurés |
| r6 | 5 | 26 | nested-interactive + target-size résolus |
| r7 | 2 | 6 | aria-allowed-attr widget-card + footer agrégat |
| r8 | 2 | 10 | transient footer async identifié |
| r9 | 1 | 10 | idem (stabilité) |
| **r10/r11** | **0** | **0** | **463 incomplets (voir sondes)** |
| public | 0 | 0 | link-name Logo fixé |

## Mécanismes corrigés (vraies sources, `packages/twenty-front`)

1. **region (123)** : `PageCardLayout` — header + secondaryBar dans un `<header>` landmark
   (couvre settings/record/tout consommateur) ; `PageContainer`/`ShowPageContainer`/`SettingsPageContainer`
   landmarqués ; side-panel `ResizeHandle` déplacé dans l'`aside`.
2. **page-has-heading-one / landmark-one-main (15+3)** : `HeaderIdentifier` → `styled.h1`
   avec titre du record ; conteneurs page en `<main>` unique.
3. **nested-interactive (271)** : cellules dnd — `neutralizeDragActivatorSemantics` +
   `observeDragActivatorAccessibleName` (thunk Lingui `t\`...\``, fix conservé) ;
   `DragDropItemSortableCell`/`RecordTableCellDragAndDrop` role="button" dédié hors du lien.
4. **aria-prohibited/allowed-attr (160+13)** : `aria-haspopup` retiré des éléments sans rôle
   le supportant (widget-card `.sx5718n`, dropdown triggers non-bouton) ; `Dropdown.Trigger`
   gagne `nativeButton={false}` + naming explicite.
5. **aria-command-name + 2.5.3 (28+61)** : trigger agrégat — `aria-labelledby` → contenu
   réel de la cellule (`{dropdownId}-value`), `aria-label` en repli cellule vide ; espace
   littéral dans `StyledValue` (name = "Earliest of Close date Oct 9, 2026" et non "dateOct").
6. **target-size (114)** : largeur colonne dnd (`RecordTableColumnDragAndDropWidth`),
   placeholder checkbox, hauteurs minimales contrôles 24px.
7. **color-contrast (154)** : tokens tag light — `theme-light.css` `--t-tag-text-{turquoise,green,yellow}`
   en display-p3 + `ThemeLight.ts` (le CSS vars est la source rendue, pas le TS seul) ;
   ViewPicker gray11.
8. **aria-required-children / listitem / landmark-*** : conteneurs dropdown `role=dialog
   aria-label`, `DropdownMenuItemsContainer` list/listitem réparés, `DropdownMenuHeader`.
9. **link-name public** : `Logo` → `UndecoratedLink aria-label={t\`Twenty\`}` (prop ajoutée).

## Leçons apprises (cycle)

- **dist/front est une COPIE** : après chaque `nx build twenty-front`, rsync vers
  `packages/twenty-server/dist/front/` + restart — sinon on scanne le vieux bundle.
- **Couleurs rendues = `theme-light.css`**, pas `ThemeLight.ts` (éditer les deux).
- **Routes record : `/object/<singular>/<id>`** — `/objects/people/<id>` rend une page
  orpheline (0 main, ~200 violations fantômes) — corrigé dans verify.mjs/eval-final.mjs.
- **Cellules footer agrégat async** : sampler de stabilité dans audit.mjs
  (`settleLandmarks`) — sinon findings transitoires non reproductibles.
- **setup-db** : chemin réel `dist/database/scripts/setup-db.js` (boot.sh corrigé) ;
  kill serveur par PID du port (jamais `pkill -f node dist/main.js` — auto-kill).
- **incomplete-probes** : `page.evaluate` d'une chaîne doit être invoquée
  `(${MEASURE})(arg)` — sinon retour undefined.

## Chaîne de preuve

- verify.mjs : **15 PASS / 0 FAIL / 1 N-A**
- eval-final.mjs : **9 PASS / 0 FAIL / 1 N-A**
- sabotage.mjs : **6 détections / 0 non-détectées**
- incomplete-probes : **456 N-A + 7 PASS / 0 FAIL** (463 incomplets = axe "incomplete",
  non-violations ; chaque incomplet mesuré ou justifié N-A)
- install-build : clone propre @`a9df5c3` + `git apply --check` patch v2 + boot verbatim
  (containers dédiés :9553/:9554, app :9550) + seed + rescan → **0 règle / 0 occ** ✅
- vanilla : findings attendus = la baseline 97r/6184occ (sabotage + vanilla = FAILs nommés
  attendus, le scanner les détecte).

## patch.diff v2

40 fichiers, sha256 `4b1762d73902c979617cf4e10c9852806b8830ae2f55c26421421606dbdd54ea`,
applique proprement sur clone vierge @SHA (`git apply --check` OK). Catalogues Lingui
exclus (règle repo : ne pas commiter les locales — régénérés par `lingui compile` au boot).
