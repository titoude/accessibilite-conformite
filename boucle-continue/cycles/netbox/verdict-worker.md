# Verdict worker — cycle 52 : netbox v4.7.2

SHA épinglé : `251458b89a5eb2f5fe0d20ecd1140ba08f141a9c` (tag v4.7.2, netbox-community/netbox).
Pas d'auto-verdict — résultats mesurés ci-dessous, auditeur tranche.

## Chiffres mesurés (reports/ joints, locale en-US partout)

| Surface | Baseline | Final | Install-build verbatim |
|---|---|---|---|
| public (1 url /login/) | 8 occ / 4 règles / 0 err | **0 / 0 / 0 err** (0 inc) | 0 / 0 / 0 err (0 inc) |
| auth (57 urls + 8 états) | 1047 occ / 16 règles / 0 err | **0 / 0 / 0 err** (1830 inc) | 0 / 0 / 0 err (1830 inc) |

- Union réelle baseline : **1055 occ / 17 règles** — 66 scénarios audités, 0 sauté (leçon 45).
- verify.mjs : **23/23 OK** ; eval-final.mjs : **12/12 OK** (2 N-A honnêtes : skip-link absent du produit, aucune région aria-live).
- Sabotage : revert `<main>` → `FAIL layout: #page-content est <main> unique` + `FAIL region: tooltips rendus dans <main>` (nommés) ; restore → 23/23. Vanilla :9301 → **20 FAIL nommés** attendus.
- Sondes incomplete : 1830 sondés → **1662 conformes / 0 NON-CONFORME / 168 N-A** (112 emptyValue + 31 bgImage raster + overlays d'état ouverts — N-A justifiés).

## Stack (1re boucle)

Django 5 + django-tables2 + HTMX 2 + jQuery + Tabler/Bootstrap 5.3 (server-rendered) + TomSelect. PostgreSQL 17 + Redis 7 + `runserver --insecure` (DEBUG=False) depuis le checkout @SHA bind-monté — écart image/SHA : nul (l'image n'embarque que les deps pip, requirements.txt verbatim).

## Corrections (32 fichiers, +142/−54 — patch.diff)

- Landmarks : `<div id="page-content">` → `<main>` (toutes les pages), login `<main>`+`<h1>`.
- Tables : `<th>` vides remplis depuis `column.attrs.th[aria-label]` (filtre get_key) — les colonnes toggle/actions.
- Modales : htmx_modal `aria-labelledby` + titres h2 ; modale Configure Table idem + `<select>` labellisés.
- 2.5.3 : aria-label ⊇ texte visible — menu user (« bench-admin Admin — Open user menu »), bouton Help (« Help — View model documentation »).
- Pagination : navs nommées par table (`Page selection for /dcim/devices/` — leçon des labels dupliqués).
- `BooleanColumn` : ✓/✗ + texte sr ; `TreeColumn` linkify retiré (`<a><a>` imbriqués → lien vide) ; 14 boutons-icônes désactivés aria-label+aria-disabled.
- `foreground_color()` : vrai calcul de ratio WCAG au lieu d'un seuil de luminance (badges colorés).
- `rack_elevation` lazy-svg : `role="img"` (aria-prohibited-attr).
- Tooltips ancrés dans `#page-content` (était `body` → hors landmark).
- Palette AA : 14 teintes Tabler assombries vers 700 dans `_variables.scss` + `$dark-teal` #00857D→#007169 ; `custom/_a11y.scss` : cibles ≥24px, soulignement liens de tables/panels, muted dark, footer par thème. dist rebuildé (yarn bundle, binaire dans le patch).

## Pièges netbox (utiles auditeur)

1. **Templates cachés** : DEBUG=False + `--noreload` → cached template loader ; `docker restart netbox52-app` obligatoire après chaque édition de template.
2. **dist/ git-tracked + .gitattributes binary** : patch.diff doit être généré avec `git diff --binary` (fait).
3. **Ordre Sass** : les variables doivent être définies AVANT `@import @tabler/core` — `_variables.scss`, pas un partial tardif.
4. **login.mjs lit `BASE_URL`** (env), pas argv : `BASE_URL=http://localhost:9xxx node tools/login.mjs`.
5. **Sessions Django en base** : auth.json d'un port vaut sur un autre UNIQUEMENT si même DB (la session :9300 couvre le vanilla :9301, pas l'install-build -i → `BASE_URL` par instance).
6. TomSelect `aria-controls="…-ts-dropdown"` : l'id n'existe qu'après ouverture du combobox — incomplet axe structurel, matérialisé par la sonde (focus→click→id présent).
7. Requêtes htmx des tables : `HX-Request: true` + `embedded=True` (probes curl).

## Fichiers du cycle

patch.diff + patch.diff.sha256, manifest.json (auditCommands), results.json, reports/ (baseline-*, final-*, install-build/*, incomplete-probes.json), tools/ (audit.mjs v12-c50, verify.mjs, eval-final.mjs, incomplete-probes.mjs, login.mjs, boot.sh, Dockerfile, configuration.py, seed.py, seed.sh, gen-urls.sh, urls-public.txt, urls-auth.txt, urls-auth.resolved.txt, seed-info.json, auth.json, package.json/package-lock.json), provenance.json.
