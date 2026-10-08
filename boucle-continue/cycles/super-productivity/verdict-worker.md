# Cycle 51 — johannesjo/super-productivity @71eb7780 (v19.1.0) — Verdict worker

## Résultat
- **Baseline : 16 règles / 777 occurrences / 0 erreur** (35 scénarios, axe 4.14.0).
- **Final : 0 règle / 0 occurrence / 0 erreur** (34 scénarios — `#/contrast-test` retirée, fixture dev).
- **Install-build verbatim : 0 viol / 0 err** (clone vierge @SHA + `git apply` + build stage + seed + rescan 34 scénarios + 3 états à id seed).
- verify.mjs : 39/39 patché ; **14 FAIL attendus sur vanilla** (overlay region, nav roles, add-task-bar, tabs, labels…). eval-final.mjs : 8/8 (skip-link N-A — absent du produit). sabotage.mjs : 4/4 détections.
- incomplete-probes : 546 sondes — 442 conformes, 0 non conforme, 106 non retrouvées (nœuds absents après re-scan).
- Patch : 54 fichiers (+227/−86), `git apply --check` OK, sha256 sidecar joint.

## Travail principal
- **Rôles implicites Material** : ancres `mat-menu-item` hors menu → `role="link"` (aria-required-parent, 392 occ) ; `ul[role=group]` reverté — les ancres hors menu restent `role=link`/`listitem`. Boutons `.quick-access` du menu contextuel → `role="menuitem"`.
- **Landmarks** : `.mat-mdc-menu-panel` non couvert par axe → overlay container passé `role="region"` + `aria-label` (app.component) ; nav resize-handle `role="separator"` + `aria-orientation` + label (aria-prohibited-attr, role=none tuait l'aria-label).
- **Nommage** : aria-labels mirroring matTooltip/title sur ~30 boutons icône (task controls, hover-controls, inline-markdown checklist, share-button, additional-btns nav-list-tree, play/panel buttons, datepicker…) ; inputs/inline-inputs nommés (add-task-bar `.main-input` converti textarea→input[type=text] dans `role="search"`, notes-editor ariaLabel).
- **Tableaux** : `th` vides → `cdk-visually-hidden` (classe utilitaire ajoutée dans `_globals.scss`) + texte réel traduit (clés i18n en.json + t.const.ts — JAMAIS d'autre locale).
- **Contraste** : tokens Material en fin de `_overwrite-material.scss` — `--mat-tab-(in)active-label-text-color` (les `-header-` n'existent pas en M21), `--mat-form-field-{outlined,filled}-(hover-,focus-)label-text-color` sous `.mat-mdc-form-field(.mat-accent/.mat-warn)` (le hôte v21 = `mat-form-field`, la CLASSE est `mat-mdc-form-field`), `--mat-select-placeholder-text-color` ; `--ink-muted` 0.78→0.82, `--task-is-done-dim-opacity` 0.3→0.9, opacités `.created/.empty-state/.disabled-section-header/.add-habit-btn/.no-results,.search-prompt` remontées.
- **mat-tab labels** : `[ariaLabel]` input ne remonte pas au role=tab en M21 → `[aria-label]` binding (config-page 6 tabs + boards 1).

## Pièges notables
- `mat-menu-item` = role implicite → la correction requiert-parent passe par `role="link"` explicite, PAS par wrapper group (régression 648 occ observée au revert).
- `cdk-describedby` + matTooltip ne créent pas de nom accessible — aria-label obligatoire sur tout bouton icône.
- `GITHUB_SHA` + `tools/git-version.js` + `tools/load-env.js --ensure` requis avant tout build (versions.ts/env.generated.ts générés, exclus du patch).
- Réseau de états audité : `--urls` = liste virgules ; states `task-done-toggle`/`notes-panel`/`search-results` dépendent des ids seed → re-scannés sur l'instance cible lorsque le seed est rejoué.
- `checkFile` sur chaque .ts/.scss modifié — tous passés (seul note : t.const.ts hors lint root, informational).

## Limites
- 548 incomplets = indéterminés axe (color-contrast composites/target-size…) — mesurés par sondes : 442 conformes / 0 non-conforme / 106 N-A (nœud absent).
- Surfaces non couvertes : Electron, Capacitor, sync providers (SuperSync/WebDAV/Dropbox — nécessitent backends), dialogs d'issues externes (Jira/GitLab), charts D3 internes (lazy-chart canvas).
