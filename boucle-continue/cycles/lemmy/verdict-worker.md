# Verdict worker — cycle 55 : lemmy-ui 0.19.20

SHA épinglé : `18ec4ba2d1e2b1515f47eb7a63a8d7975a48ec59` (tag 0.19.20, LemmyNet/lemmy-ui).
Backend : LemmyNet/lemmy `e9d49b7b49f4751b924263fdebfc1af2a387eda9` (image officielle `dessalines/lemmy:0.19.20`, non patchée).
Pas d'auto-verdict — résultats mesurés ci-dessous, auditeur tranche.

## Chiffres mesurés (reports/ joints, locale en-US partout)

| Surface | Baseline vanilla | Final patché | Install-build verbatim :9665 |
|---|---|---|---|
| public (17 urls + états) | 257 occ / 11 règles / 0 err | **0 / 0 / 0 err** (20 inc) | 0 / 0 / 0 err (20 inc) |
| auth (22 urls + états) | 453 occ / 16 règles / 0 err | **0 / 0 / 0 err** (31 inc) | 0 / 0 / 0 err (31 inc) |

- Union réelle baseline : **710 occ / 17 règles** — 39 scénarios audités, 0 sauté (leçon 45), erreurs_liste vide.
- verify.mjs : **32/32 OK** ; eval-final.mjs : **17/17 OK** (1 N-A honnête : aucune région aria-live/status dans le produit).
- Sabotage : revert `vote-display.tsx` → `FAIL vote-display: spans statistiques avec role` (nommé) ; restore → 32/32.
- Vanilla :9675 (worktree @18ec4ba2, DB propre seedée) → **21 FAIL nommés attendus** verify (404 lang/title, labels login/password, th vide, `aria-labelledby="#…"` invalide, contrastes 3.1–4.0:1, cibles <24px, SearchableSelect, h1, panes admin, uploads, menu More absolute, ids dropdown dupliqués, toolbar <24px, badges/vote-display sans rôle) + **4 FAIL** eval-final.
- Sondes incomplete : 51 sondés → **51 OK / 0 NON-CONFORME / 0 N-A** (color-contrast bgImage = chevron SVG `.form-select` décoratif mesuré 8.18:1 vs blanc ; `aria-controls` combobox matérialisés à l'ouverture role=listbox ; ids aléatoires re-sondés par préfixe `[id^="sort-select-"]`).
- Install-build : clone vierge @SHA + `git apply --check` **0 rejet** + submodule + pnpm install + build:prod + boot `-i` :9665-9669 + seed + rescan **0 viol/0 err** + verify 32/32 + eval 17/17.

## Stack (1re boucle)

Inferno.js 8 + SSR Express (`dist/js/server.js`) + Bootstrap 5.3.3 (thème litely.css) + webpack + pnpm 10.11.0. Servi par lemmy (Rust/Actix, image officielle au tag compatible) + postgres:16-alpine + pictrs 0.5.16 + nginx proxy. lemmy-ui tourné DEPUIS le clone @SHA (build `pnpm install && pnpm run build:prod`, bind-mount `/usr/src/app`, `node dist/js/server.js` dans node:20-slim) — PAS l'image dessalines/lemmy-ui : elle figerait un SHA arbitraire au lieu du clone audité.

## Corrections (38 fichiers, +305/−176 — patch.diff)

- **Contrastes palette litely** (557 occ baseline) : tokens Bootstrap compilés `litely.css` assombris — orange `#f1641e→#a83d0e`, vert `#00a846→#007332`, bleu `#007bff→#0056b3`, rose `#d63384→#a61e4d`, secondary-color `#6c757d→#495057`, link-hover `#7f2e0a` ; mêmes teintes dans `_variables.litely.scss` (source scss) ; atom-one-light `#e45649→#a93428`. Tous ratios mesurés ≥4.5:1 avant choix.
- **link-in-text-block** (30 occ) : soulignement des liens inline `.md-div a`, `.card-text a`, person-listing, community-link, `.overflow-wrap-anywhere`, `.fst-italic`.
- **target-size ≥24px** (66 occ) : `.btn-animate`, boutons toolbar markdown (gras/italique/superscript/spoiler/lien), sort-select-icon, lien RSS, boutons-lien des listings (padding min 24px).
- **Hiérarchie** (4 occ) : h1 réel sur `/legal` `/instances` `/settings` + ErrorPage ; h5/h6 décoratifs → `h2.h5`/`h3.h6` (site-sidebar, home subscribed, metadata-card, modlog) ; `<h5><Spinner/></h5>` → `<div>` ×10 fichiers.
- **Étiquetage** : password-input — id désormais sur l'`<input>` (était sur le bouton toggle → `label[for]` sans cible) ; community-form `legend`→`label` associé ; site-form htmlFor corrigé ; image-upload-form `aria-label` ; `user-bio` — prop `id` ajoutée à MarkdownTextArea, label settings relié au vrai textarea.
- **ARIA** : `role="img"` sur spans statistiques vote-display (4) et pills user-badges (aria-label ⊇ texte visible, 2.5.3) ; `role="region"` sur accordéons labelés (sidebarInfoBody, sidebarSubscribedBody) ; `aria-labelledby="#x"` → `"x"` ×6 modales (le `#` cassait la résolution d'id) ; Tabs : `<ul role="tablist">` non rendue si 0 onglet (aria-required-children /instances) ; MarkdownTextArea : label interne sr-only masqué quand un `id` externe est fourni (form-field-multiple-labels) ; SearchableSelect : listbox/label/activedescendant résolus ; ContentActionDropdown : ids uniques par instance (`-N` suffixe compteur — mobile+desktop du même post) + menus More `position:static` (partiallyObscured : le menu recouvrait les boutons toolbar/comment).
- **Tables** : `<th>` vide `/communities` → `<span class="visually-hidden">subscribed</span>` (empty-table-header).
- **Document** : HtmlTags sur ErrorPage → `<html lang>` + `<title>` sur les 404 (html-has-lang + document-title).
- **listitem / aria-required-parent** (10 occ) : structure liste des listings corrigée.

## Pièges lemmy (utiles auditeur)

1. **Bind-mount + cache serveur** : `docker restart lm55-ui` après CHAQUE `pnpm build:prod` (dist monté mais Express sert depuis le bundle en mémoire).
2. **Ids aléatoires** : `sort-select-*`, `language-select-*`, `markdown-textarea-*`, `image-upload-form-*` changent à chaque rendu — les re-sonder par `[id^="prefix-"]`, jamais par l'id du rapport.
3. **Variantes mobile+desktop** : post-listing/comment rendent DEUX instances du dropdown actions → ids en collision sauf compteur d'instance ; sondes/verify sur `:visible`.
4. **`aria-labelledby="#x"`** : le `#` préfixe est un bug répandu (6 modales) — axe le tolère en incomplete, verify le refuse.
5. **litely.css est compilé mais git-tracké** : c'est lui que webpack embarque ; éditer le css compilé ET `_variables.litely.scss` (cohérence sources).
6. **`data-bs-display="static"` ne suffit pas** : le branchement popper n'est pas pris → menu reste `position:absolute` ; override CSS explicite `position:static!important` sur les menus d'actions.
7. **seed_info ids stables** : post_ids 1-3, comment_ids 1-5, community 2 — MAIS l'id de bench_user2 dépend de l'ordre d'enregistrement Lemmy (4 sur vanilla, 5 sur la dev) → toujours lire seed-info.json, jamais hardcoder.
8. **STATES combobox** : deux ids possibles selon le contexte (`#post-community-search-input, #searchable-select-input`) — sélecteur dual obligatoire.
9. Login : auth.json = storageState Playwright — non portable entre instances (JWT posé côté client, DB différente) → `login.mjs` par instance.

## Fichiers du cycle

`manifest.json` (2 SHAs + submodule), `patch.diff` + `.sha256`, `results.json`, `provenance.json`, `reports/{baseline-public,baseline-auth,final-public,final-auth}/`, `reports/install-build/{public,auth}/`, `reports/incomplete-probes.json`, `tools/{boot.sh,docker-compose.yml,nginx.conf,lemmy.hjson.tpl,customPostgresql.conf,seed.mjs,gen-urls.mjs,login.mjs,audit.mjs,verify.mjs,eval-final.mjs,incomplete-probes.mjs,package.json,seed-info.json,auth.json,urls-*.resolved.txt}`.
