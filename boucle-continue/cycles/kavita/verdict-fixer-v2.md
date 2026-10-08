# Verdict FIXER v2 — cycle 45 Kavita @f75863cb77c0

Instances : vanilla `:8200` · patché `:8201` — patch régénéré **65 fichiers, +233/−206** (vraies sources `UI/Web/src`), `git apply --check` OK sur clone vierge @SHA, sidecar `patch.diff.sha256` `ee82ead4…`.

## Findings traités

### K1 (majeur) — FERMÉ
- **(a)** 5 clés réelles ajoutées au JSON de locale produit `UI/Web/src/assets/langs/en.json` : `actionable.actions-for` = « Actions for {{name}} », `side-nav.side-nav-alt`, `side-nav.sidenav-bottom-alt`, `settings.side-nav-alt` (+ `actionable.edit` déjà présente). Chaque clé `t()` référencée par le patch vérifiée résoluble (les `title-`/`sub-title-` sont des concaténations dynamiques, faux positifs du regex).
- **(b)** binding : `[attr.aria-label]="t('actions-for', {name: label() || labelBy()})"` — `labelBy()` (signal) utilisé, plus le `label()` non bindé.
- **(c)** prouvé live : sonde anti-slug C2 dans verify.mjs — tous les `app-card-actionables button[aria-label]` mesurés = « Actions for … », regex slug `[a-z0-9]+(\.[a-z0-9-]+)+` interdit sur lib + series-detail. **Sabotage i18n rejoué** : `actions-for` retiré du JSON déployé → 4 FAIL nommés avec slugs affichés (`aucun aria-label slug` + `aria-label « Actions for … »` sur /library/1 et /series/1) → restauration → repass.
- Bonus réel : la modale mobile `ActionableModalComponent` (ouverte à 1280px = Tablet) n'était pas nommée → `aria-dialog-name` sur patché. Corrigé convention produit : `id="modal-basic-title"` + `{ariaLabelledBy: 'modal-basic-title'}`.

### K2 — FERMÉ
seed.py réécrit : quiescence Hangfire via `GET /api/Server/activity` (événements `FileScanProgress|ScanProgress|ScanSeries`, `eventType!='ended'`), post `scan-all?force=true` seulement à running==0, re-post si avalé, fallback per-library. Prouvé **7/7 libs seedées en 1 exécution, posts scan-all=1** sur :8200 ET :8201.

### K3 — FERMÉ
`tools/resolve-ids.mjs` : résolution API dynamique (libs triées, 1re série par lib via `Series/all-v2`, chapitres via `Series/volumes`, reading list via `ReadingList/lists`, userId via `Account`). Tokens `{LIBn}/{SERIESn}/{MANGA_*}/{BOOK_*}/{RL0}/{USER}` expansés AVANT `new URL()` (bug encodage `%7B` corrigé). urls-auth/virgin + STATES + verify + eval : plus aucun id en dur.

### K4-K6 — FERMÉ
- **K4** : baseline-states complète mesurée sur vanilla :8200 — **13 règles / 218 occurrences / 11 scans** (`finalv2-states-vanilla`), dont card-actions enfin mesuré (`button-name` 12 nœuds + `aria-dialog-name` 1).
- **K5** : prose verdict-worker corrigée — `page-has-heading-one` **24** (pas 23), `heading-order` **1** (pas 2) sur recompte des report.json committés.
- **K6** : onglets ngbNav non actifs couverts — `series-tab-chapters`, `rl-tab-details`, `profile-tab-stats` (route réelle `/profile/:userId`). Sélecteurs DOM réels (`ul[ngbnav]`, `a[ngbnavlink].active`, `.tab-pane.active`). /settings documenté N-A (pas ngbNav : `@switch(fragment)`).

## Violations réelles trouvées et corrigées (surface jamais mesurée)

Le nouvel état `profile-tab-stats` a exposé **4 règles sur le patché** — corrigées dans les sources :
- `aria-prohibited-attr` ×5 : `role="img"` sur legend-cells
- `scrollable-region-focusable` ×1 : `tabindex="0"` + `aria-label` sur `.graph-wrapper`
- `color-contrast` ×11 : `--activity-graph-text-color: --bs-secondary` → `--body-text-color` ; `.stats-title` muted → `--body-text-color`
- `heading-order` ×4 : titres/sous-titres de cartes stats (`h4/h5/h6.stats-title|subtitle|graph-title`) → `<p>`/`<div>` dans 15 composants ; `library-and-time-selector` h4→h2

## Chiffres finaux

| surface | vanilla :8200 | patché :8201 |
|---|---|---|
| auth pages (19) | 234 occ / 10 règles | **0 / 0** |
| states (11) | 218 occ / 13 règles | **0 / 0 / 0 err** |
| verify.mjs | — | **43/43 PASS** |
| eval-final.mjs | — | **35/35 PASS** |

Rapports : `reports/finalv2-auth`, `finalv4-states` (patché), `finalv2-states-vanilla` + `k4-vanilla-cardactions` (baseline), `finalv2-states`/`finalv3-states` (itérations fix).

provenance --strict recalculé en dernier.
