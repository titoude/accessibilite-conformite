# Verdict auditeur — cycle 52 netbox-community/netbox @251458b89a5e (v4.7.2)

**Verdict : CONFIRMED** — chaque chiffre du worker reproduit à l'identique sur
environnement, instances et données indépendants : patch sain (sha256 conforme,
`git apply --check` 0 rejet, 32 fichiers +142/−54 recomptés), baseline vanilla
bit-à-bit (1055 occ / 17 règles, distribution règle-par-règle identique), rescan
patché + install-build verbatim 0 violation / 0 erreur / 1830 incomplets sur les
66 scénarios, verify 23/23, eval 12/12 (2 N-A), sabotage 2 FAIL nommés exacts,
vanilla 20 FAIL, sondes 1830 → 1662 conformes / 0 NON-CONFORME / 168 N-A,
provenance 42/42. Ceci mesure la reproductibilité du score axe et la santé du
patch, pas la conformité WCAG complète.

Auditeur : session indépendante (devin-bfc54ca56b644c7d918a5cdc314f33a5),
clone upstream frais `git init + fetch --depth 1 @251458b89a5eb2f5fe0d20ecd1140ba08f141a9c`,
ports :9340 (patché, suffixe `-a`) / :9350 (vanilla, `-v`) / :9360 (install-build, `-i`),
chacune avec sa propre paire postgres:17-alpine + redis:7-alpine et son seed
rejoué par `tools/seed.sh` (ids résolus : site=1 device=1 prefix=1 vm=1 — comme
le seed-info commité, bases neuves). Aucun artefact d'exécution du worker
réutilisé (auth.json regénéré par login.mjs sur chaque instance).

## Méthode de rejeu

- Clone propre upstream @SHA → `sha256sum patch.diff` (conforme au sidecar
  `b619add5aa2dd06b26ae93263daee2ea772aff30efbf189bbee00a349d4955b8`) →
  `git apply --check` : **0 rejet** sur le diff binaire (dist/ inclus) →
  `git apply` : 32 fichiers, +142/−54 (3 fichiers binaires dist/netbox.css,
  netbox.js, netbox.js.map comptés Bin dans --stat).
- Image cycle `nb52-app:v4.7.2` construite depuis `tools/Dockerfile`
  (python:3.12-slim + `pip install -r requirements.txt` verbatim — psycopg-c
  compilé, ~70 s) ; images de base tirées via mirror.gcr.io + tag local
  (Docker Hub 429 sur la box — env, pas produit).
- `tools/boot.sh <checkout> <ports> <suffixe>` ×3 → migrate + runserver
  `--insecure` DEBUG=False, checkout bind-monté /opt/netbox.
- `tools/seed.sh <app> <db>` ×3 → seed.py via manage.py shell + gen-urls.sh
  (seed-info.json + urls-auth.resolved.txt régénérés dans MES copies de
  tools/, pas dans les artefacts commités — leçon 46 respectée).
- `BASE_URL=http://localhost:9xxx node login.mjs` ×3 (wart BASE_URL env
  confirmé) → `audit.mjs` verbatim (`--urls` virgules, `--states all|none`,
  `--storage-state`) → `verify.mjs` / `eval-final.mjs` / sabotage /
  `incomplete-probes.mjs` rejoués.
- `provenance.json` : 42 sha256 revérifiés depuis le disque.

## Résultats du rejeu

| Étape | Livré | Rejoué | Verdict |
|---|---|---|---|
| patch.diff sha256 | `b619add5…55b8` | identique au sidecar | OK |
| `git apply --check` | propre | **0 rejet** (diff --binary dist/) | OK |
| Fichiers du patch | 32 f, +142/−54 | **identique** (31 texte +91/−54 + 3 binaires) | OK |
| Baseline public vanilla | 8 occ / 4 règles / 0 err | **8 occ / 4 règles / 0 err** | OK exact |
| Baseline auth vanilla | 1047 occ / 16 règles / 0 err / 1850 inc | **1047 occ / 16 règles / 0 err / 1850 inc** — distribution **bit-à-bit** (region 498, color-contrast 274, label-content-name-mismatch 73, landmark-one-main 63, link-name 63, empty-table-header 57, target-size 7, heading-order 2, aria-dialog-name 2, select-name 2, aria-required-parent 1, list 1, link-in-text-block 1, button-name 1, landmark-unique 1, scrollable-region-focusable 1) | OK exact |
| Union baseline | 1055 occ / 17 règles | **1055 / 17** recomptés | OK |
| Rescan patché | 0/0/1830 inc, 66 scénarios | **0 viol / 0 err / 1830 inc** (public 0/0/0 + auth 65/65), distribution incomplets identique (color-contrast 1647, aria-valid-attr-value 163, duplicate-id-aria 20) | OK exact |
| Install-build verbatim | 0/0/1830 | **0/0/1830** — clone vierge @SHA + apply --check 0 rejet + boot `-i` :9360 + seed + rescan ; scénarios normalisés identiques | OK |
| Skips silencieux (leçon 45) | 0 | **66/66 scénarios audités, 0 erreur, erreurs_liste vide** | OK |
| verify.mjs patché | 23/23 | **23/23** | OK |
| verify.mjs vanilla | 20 FAIL nommés | **20 FAIL + 1 N-A + 2 OK** — mêmes libellés (login `<main>`/h1, layout main, 2.5.3 user-menu+Help, th vides ×3 routes, modales aria-labelledby/h2/selects, btn-primary 4.32, badges <24px, link-in-text-block, paginators dupliqués, tooltips hors main, footer sombre 3.62, 40x card-header, widget tabindex, notifications h3) | OK |
| eval-final.mjs | 12/12 (2 N-A) | **12/12**, 2 N-A identiques (skip-link absent, aucune région aria-live) | OK |
| Sabotage | 2 FAIL nommés | revert `<main>`→`<div>` layout.html + `docker restart` → **exactement les 2 FAIL nommés** (`layout: #page-content est <main> unique` + `region: tooltips rendus dans <main>`) → 21/23 ; restore + restart → **23/23** | OK |
| incomplete-probes | 1830 → 1662 OK / 0 NC / 168 N-A | **1830 → 1662 OK / 0 NON-CONFORME / 168 N-A** — exact | OK |
| provenance | 42 fichiers | **42/42 sha256 conformes**, 0 fichier orphelin (hors provenance.json elle-même) | OK |

## Chasse aux violations introduites, triche et hors-scope

- **Pureté vanilla (leçon 40)** : `007169` (teinte patchée) **absent** du
  `dist/netbox.css` vanilla ; `$dark-teal: #00857D` amont intact dans
  `_variables.scss` — la baseline n'est pas contaminée.
- **Revue du patch (32 fichiers)** : aucune suppression de fonctionnalité ni
  masquage (pas de `display:none`/`aria-hidden` ajouté, pas de contenu retiré) ;
  chaque suppression est un remplacement correctif (div→main, h5→h2 titres
  modales, labels génériques→labels par table). Le seul retrait fonctionnel est
  `TreeColumn linkify=True` (NestedGroupModelTable) : amont rendait `<a><a>`
  imbriqués → lien externe vide (axe link-name) ; le retrait conserve le lien
  interne du TreeColumn — justifié, documenté dans le verdict worker.
- **Assertions réelles** : verify.mjs mord — 20 FAIL sur vanilla pur ET les 2
  FAIL du sabotage ciblé prouvent que les assertions mesurent le DOM/computed,
  pas `if(el) ok()` (leçon 42 : la liaison aria-labelledby elle-même est
  éprouvée — `labelledby=null` FAIL sur vanilla).
- **dist rebuildé réellement servi** : `#007169` + `--tblr-primary: #007169`
  présents dans le dist/netbox.css patché (install-build :9360 sert les assets
  patchés SANS node — diff binaire du patch).
- **i18n (leçon 43)** : les libellés ajoutés passent par `{% trans %}` amont ou
  littéraux EN du banc (« Trace », « Connect », « Page selection for … ») — pas
  de clé i18n inventée, aucun slug brut rendu (vérifié : verify échouerait en
  2.5.3 sinon).
- **Cohérence seed↔artefacts (leçon 46)** : mes seeds régénèrent les mêmes ids
  (1 partout) que le seed-info commité — `urls-auth.resolved.txt` commité
  rejouable verbatim ; aucun waitForSelector dépendant d'un id n'a sauté.

## Warts éprouvés en exécution

1. **login.mjs lit `BASE_URL` (env), argv ignoré** — confirmé : utilisé ×3,
   un oubli d'env aurait loggé :9300 par défaut ; le wart est réel et le
   contournement documenté dans le manifeste fonctionne.
2. **Cached template loader → `docker restart` obligatoire** — **prouvé live** :
   ajout de `data-cache-probe` dans `login.html` → curl absent avant restart,
   présent après. Le sabotage `<main>`→`<div>` n'aurait mesuré que du cache
   sans restart (restart fait AVANT chaque mesure).
3. **Sessions Django db-backed** : auth.json lié à la DB — 3 DB séparées → 3
   login.mjs requis (leçon du worker confirmée : BASE_URL par instance).
4. **scopeHash/statesHash incluent le baseUrl** — hashes différents worker↔moi
   (`892e053d` vs `461b3f41`) UNIQUEMENT par le port (:9300/:9350) ; scénarios
   normalisés (port masqué) **identiques** à l'élément près. Wart d'outillage
   mineur : un hash de périmètre inter-instances exigerait de normaliser
   l'origine — comparaison faite post-normalisation ici.
5. **Docker Hub 429** sur python:3.12-slim/postgres/redis → miroir gcr + tag
   local (wart environnement, documenté pour le prochain auditeur).

## Conclusion

Reproduction exacte sur chaque métrique annoncée (zéro delta non expliqué) :
**CONFIRMED**. Le patch est une correction réelle et honnête ; le « 0 violation »
repose sur des mesures DOM vérifiables et les 1830 incomplets sont tous sondés
conformes ou N-A justifiés.
