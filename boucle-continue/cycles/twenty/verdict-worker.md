# Cycle 54 — verdict WORKER (twentyhq/twenty)

**Statut : INCOMPLET — livraison partielle honnête.** Le patch (19 fichiers, `patch.diff` 401 lignes) est en place et mesuré ; le rescan atteint **949 occurrences / 15 règles restantes** (baseline auth : 6184 occ / 97 violations-rules-instances, public : 6 occ / 3 règles). Le gate "0 violation" n'est PAS atteint.

## Fait
- Boot réel @ `a9df5c3` build local (docker compose non pinnable → justifié), ports 9540/9543/9544, seed GraphQL rejouable (`tools/seed.mjs` + `seed-info.json` committé — ids source unique).
- Baseline vanilla axe 4.14.0 : public 3 règles / 6 occ / 0 err ; auth 15 scénarios (8 routes + kanban + filtres + command menu + record×2 + mobile 390 + kanban dark), 0 erreur, 0 scénario sauté.
- Corrections sources (19 fichiers) : `<main>` sur PageContainer/ShowPageContainer/SettingsPageContainer/SignInUp ; `h1` PageHeader+Title ; `nav` sur NavigationDrawer ; `aria-label` sur checkboxes board/calendar/placeholder/header, drag handles (DragDropItemSortableHandle + RecordTableCellDragAndDrop + override post-connect dnd-kit dans DragDropItemSortableCell) ; `tabIndex=0` ScrollWrapper ; suppression `role="listbox"` faux sur DropdownMenuItemsContainer ; aria popup déportés du wrapper vers le vrai trigger (Dropdown cloneElement) ; `aria-label` email settings/profile ; contraste font.color tertiary/light/extraLight remonté (light+dark themes).

## Restant (mesuré round2-auth, 949 occ)
- `nested-interactive` (271), `aria-prohibited-attr` (160), `target-size` (114), `region` (123), `color-contrast` (154), `label-content-name-mismatch` (61) — concentrés sur les activators dnd-kit `data-dnd-sortable-handle` dont l'`aria-label` est écrasé par l'id sortable ("KGi3u9") après mon override, et sur les cellules table/kanban sans landmark.
- `aria-command-name` (28) : `data-base-ui-click-trigger` base-ui avec `aria-haspopup="dialog"` sans nom.
- `page-has-heading-one`/`landmark-one-main` (15/3), `aria-allowed-attr`, `aria-required-children`, `aria-input-field-name`, `listitem`, `landmark-no-duplicate-banner`/`landmark-unique`, `label` (résolu dans patch — reste à re-mesurer).

## Non fait (à reprendre au cycle suivant ou reprise manuelle)
verify.mjs live + eval-final + sabotage FAIL nommé ; incomplete-probes ; install-build verbatim @SHA ; provenance --strict ; REGISTRE ligne 54.

## Piste fix dominante
L'activator dnd-kit reçoit `aria-label=<sortableId>` par le plugin accessibilité APRÈS le ref connect — il faut soit un `MutationObserver`/`setTimeout` post-connect, soit passer un vrai `ariaLabel` dans `data`/`id` humanisé côté `useSortable`.


## Round 3 (ajout post-synthèse)

Patch régénéré : **20 fichiers, 462 lignes, sha256 `10ad117953200c3dd2aba6dc55479637545bdcb9830992df4de931059c00073f`**.

- Nouveau mécanisme livré : `utils/observeDragActivatorAccessibleName.ts` — MutationObserver qui restaure le nom accessible des activators dnd-kit (le plugin dnd-kit écrit `aria-label=<sortable id>` ("KGi3u9") de façon asynchrone et écrase tout aria-label React). Vérifié live : `aria-label="KGi3u9"` → `aria-label="EmailsContact's Emails"` (texte visible, satisfait 2.5.3). Câblé dans `DragDropItemSortableCell` (colonnes/kanban) et `RecordTableCellDragAndDrop` (lignes).
- Rescan round3-auth : **15 règles / 934 occ / 0 erreur / 516 incomplets** (vs 949 round2, 1072 round1, 6184 baseline). Le cluster dnd est traité ; le résidu est dominé par aria-allowed-attr (`aria-haspopup` sur headers widget-card), aria-required-children, color-contrast résiduel, region, nested-interactive, target-size.
- **Statut toujours INCOMPLET** — objectif 0 violation non atteint. Verify/eval/sabotage, incomplete-probes, install-build verbatim, provenance --strict non exécutés (budget contexte).
