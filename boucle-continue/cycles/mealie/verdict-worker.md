# Verdict worker — cycle 44 : mealie-recipes/mealie

## Chiffres

| Phase | Scénarios | Règles | Occurrences | Erreurs | Incomplets |
|---|---|---|---|---|---|
| baseline auth (vanilla :7044) | 50 | 18 | **1218** | 1 | 1457 |
| baseline public | 5 | 9 | **73** | 0 | 62 |
| final auth (patché :7054) | 51 | **0** | **0** | 0 | 1440 |
| final public | 5 | **0** | **0** | 0 | 64 |
| install-build auth (:7064) | 51 | **0** | **0** | 0 | 1440 |
| install-build public | 5 | **0** | **0** | 0 | 64 |

- **SHA amont** : `06ccc2b1a6eef90dece7cfcd5aa48e140f544bf9` (v3.28.0, HEAD vérifié le 2026-10-07)
- **patch.diff** : 115 fichiers, +508/−215 — sha256 `530548af…9009` (sidecar)
- `git apply --check` sur clone vierge : **0 rejet** ; build + boot + seed + rescan **verbatim** via `install-build.sh`
- verify.mjs **21/21 PASS** ; eval-final.mjs **25/25 PASS** ; sondes incomplets **0 FAIL** (auth 777 PASS/176 N-A, public 25/12 N-A)
- Aucun auto-verdict dans results.json — l'auditeur rejoue indépendamment.

## Baseline — 18 règles auth (1291 occ au total avec public)

`button-name` 373 · `aria-tooltip-name` 303 · `color-contrast` 118 · `aria-required-children` 96 · `label-title-only` 52 · `label` 46 · `link-name` 46 · `page-has-heading-one` 43 · `html-has-lang` 49 · `image-alt` 33 · `region` 19 · `aria-allowed-attr` 11 · `empty-table-header` 10 · `empty-heading` 7 · `landmark-unique` 4 · `landmark-no-duplicate-banner` 3 · `aria-dialog-name` 3 · `landmark-one-main` 2.

La baseline-error = l'URL planner (`?start=…` vs `/?start=…` — routage Nuxt ajoute le slash final) : déclarée telle quelle dans le scope.

## Stack inédite pour la boucle

Nuxt 4 / Vue 3 + **Vuetify 3** + FastAPI + SQLite, SPA pure (ssr:false). Deux classes de défauts systémiques non couvertes avant ce cycle :

1. **Overlays montés paresseusement** (v-menu/selects/autocompletes) → `aria-controls`/`aria-owns`/`aria-labelledby` pointant vers des ids absents du DOM → `aria-valid-attr-value` (175 incomplets → FAIL à la sonde avant fix). Correction réelle : `eager` sur les 32 `<v-menu>` + `:menu-props="{ eager: true }"` sur les 52 `v-select`/`v-autocomplete`/`v-combobox`. Résidus N-A vérifiés **à l'activation réelle** par la sonde (séquence pointerdown→click rejouée — le select "Items per page" interne à v-data-table ouvre bien son menu `menu-v-0-28`).
2. **Couleurs de thème sous le seuil 4,5:1** → texte primaire orange #E58325 (2,76:1), boutons `bg-success` #43A047 / `bg-error` #EF5350 en texte blanc (3,3–3,5:1), labels de champ en emphase moyenne sur fonds variés, chips de labels (blanc sur #959595 = 3,3:1, seuil de luminance 0.35 erroné → meilleur-ratio noir/blanc), bouton setup grey-lighten-1 (1,88:1). Correction par `color-mix(in srgb, …, black)` dérivé des tokens du thème dans `app.vue` + points précis (CookbookPage, MultiPurposeLabel, pages/shopping-lists, setup.vue).

Autres familles corrigées dans les vraies sources : `app.vue`/`error.vue` créés (lang+landmark main sur 404 Nuxt — état d'erreur dédié), tooltips inactives `display:none` (aria-tooltip-name 303→0, au prix de la perte des noms via describedby → `aria-label` explicite ajouté sur ~30 boutons icônes), `role=button` sur les v-list-items non-liens + `role=group` + `:value` réel sur v-list-group (corrige l'id Symbol buggé amont), labels réels sur ~20 champs (QueryFilterBuilder ×11, organizer selectors, servings, commentaires, recherches), `aria-selected=null` après v-bind des activateurs de groupe, checkbox-data-table nommées, th vides renommés, h2 vides conditionnés.

## Incidents de boucle (honnêteté)

- Une regex de patchage en masse a cassé `:custom-filter="() => true"` (le `>` dans l'arrow function) sur 3 fichiers → détecté au build `pnpm generate`, corrigé proprement.
- La sonde parsait `color-mix()` en `color(srgb …)` non couvert → parseur CSS4 ajouté (sinon bg mesuré blanc → faux FAIL 1.00).
- Deux checks verify/eval trop stricts corrigés côté outil (divs role=button légitimes dans listes presentation ; boucle Tab qui s'arrêtait au 1er tab) + crash getComputedStyle(null) gardé → `missing` explicite.
- `auth.json` non livré (session JWT) — régénéré par `tools/login.mjs`.

## Rejouabilité

`install-build.sh` = clone vierge @SHA + apply + `docker build` + boot :7064 + `seed.mjs` + `login.mjs` + double rescan — exécuté verbatim, **0 viol / 0 err** des deux côtés. Les ids dynamiques (shareToken, shoppingListId, userId) sont régénérés par `seed.mjs` dans `tools/seed-env.json` + `urls-*.txt` — le cycle est rejouable de bout en bout sur n'importe quelle instance.
