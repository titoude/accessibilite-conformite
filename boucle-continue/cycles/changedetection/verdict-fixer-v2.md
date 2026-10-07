# verdict-fixer-v2 — cycle 33 changedetection.io

Date : 2026-10-07. Rôle : fixer v2 sur le verdict **CONFIRMED avec warts + 1 gap
périmètre** de l'auditeur (verdict-auditeur.md, commit 306b675). Toutes les
preuves ci-dessous sont **rejouées dans cette session** : vanilla
`~/work/cd-vanilla` :5005 (baseline), patché `~/work/changedetection` :5005
(final), clone vierge + patch v2 `~/work/cd-install` :5006 (install-build).

## Résumé des chiffres rejoués

| Run | occ | règles | incomplets | scénarios | erreurs |
|---|---|---|---|---|---|
| baseline-public | 12 | 6 | 1 | 1 | 0 |
| baseline-auth | 1328 | 14 | 215 | 48 | 0 |
| final-public | 0 | 0 | 0 | 1 | 0 |
| final-auth | 0 | 0 | 117 | 48 | 0 |
| install-build-public | 0 | 0 | 0 | 1 | 0 |
| install-build-auth | 0 | 0 | 117 | 48 | 0 |

- scopeHash baseline↔final **identiques** : `cbb6687f…` (public), `67af2437…`
  (auth) — périmètre v2 inchangé entre les deux scans.
- verify.mjs **29 PASS / 0 FAIL** ; sondes incomplets **117 items, 0
  CONFIRMED_VIOLATION** ; eval-final **1340 → 0**, missing_states=[],
  unresolved_rules=[].
- axe-core **4.14.0** réellement exécuté (tracé `axeVersion` dans chaque
  scope.json + report.json).

## W1 — gap périmètre `/diff/<uuid>/extract` (corrigé)

**Surface** : `blueprint/ui/diff.py:598` expose
`/diff/<uuid_str:uuid>/extract` (GET), page processor-aware rendue par
`processors/templates/extract.html` — jamais scannée en v1.

**Baseline vanilla mesurée** : la page porte 21 occurrences dont 11
`color-contrast` — les 2 `<span style="color: red">` de l'exemple regex
(démonstration de la feature, inline dans le template amont).

**Correctif produit** :
- `processors/templates/extract.html` : les 2 spans inline →
  `<span class="regex-highlight">` ; le `{% block page_heading %}` ajouté en
  v1 est conservé (même fichier, diff fusionné).
- `static/styles/scss/parts/_a11y.scss` : `.regex-highlight` scopé `#extract`
  — `--color-dark-red` (#a00, ~6,7:1 sur fond code #eee) en clair,
  `#ffb3b3` (~7,4:1 sur #333, même token que `--color-watch-table-error`
  dark déjà patché) en `html[data-darkmode="true"]`.
- `styles.css` rebuildé (`npm install && npm run build` dans
  `changedetectionio/static/styles`) — règles présentes dans le minifié.

**Scope** : URL ajoutée au run auth (`/diff/$CD_API_DOCS_UUID/extract`),
expansion `$VAR` implémentée dans audit.mjs (`expandEnvVars`, défauts = uuids
du seed, override env pour install-build) — manifest + states.json
synchronisés, wait-for étendu de `#extract-data-form`.

**Rejeu** : baseline-auth rejouée sur vanilla → 1328 occ/14 règles (extract
= +21 occ vs le périmètre v1) ; final-auth sur patché → **0 violation** sur
les 48 scénarios dont extract ; install-build :5006 → **0 violation**.

## W2 — seed.py crashait exit 1 (corrigé, exécuté)

`log(f"proxies.json écrit → {p}")` — `log` non défini en fin de course
(seed réussi, outil exit 1). Remplacé par `print()`. **Exécuté de bout en
bout ×2** : :5005 et install-build :5006 — **exit 0** les deux, résumé JSON
complet (4 watches, 2 tags, history ≥2, diff_ok, error_ok).

## W3 — axe-core épinglé (corrigé)

- `tools/package.json` créé : `axe-core 4.14.0` + `playwright 1.63.0` en
  versions **exactes** (pas de caret) ; `tools/package-lock.json` livré
  (`npm install` → lockfile, node_modules reste ignoré par .gitignore).
- `manifest.toolVersions.axe-core` → `4.14.0` (version réellement exécutée,
  lue par axe.version dans chaque page).
- audit.mjs synchronisé kit : `injectAxe` capture `window.axe.version`,
  tracé `axeVersion` dans scope.json ET report.json — tous les rapports
  rejoués portent `"axeVersion": "4.14.0"`.
- Deps des outils résolues relativement au dossier du script
  (`createRequire(package.json à côté du script)` dans audit.mjs,
  login.mjs, verify.mjs, incomplete-probes.mjs — `AUDIT_TOOLS` reste un
  override) → `npm ci` dans tools/ suffit, plus besoin du ~/audit-tools
  externe. Boot verbatim manifest mis à jour.

## W4 — `regles_baseline` périmés (corrigé)

results.json porte désormais les **ids de règles réels** extraits des
report.json rejoués :

- auth (14) : color-contrast 401, region 601, label-content-name-mismatch 75,
  html-lang-valid 42, landmark-one-main 41, page-has-heading-one 41,
  target-size 41, label 26, link-in-text-block 17, empty-table-header 16,
  select-name 12, link-name 11, image-alt 3, scrollable-region-focusable 1.
- public (6) : color-contrast 2, region 5, label-content-name-mismatch 2,
  html-lang-valid 1, landmark-one-main 1, page-has-heading-one 1.

Les libellés v1 (button-name, heading-order, landmark-main-is-top-level,
label-title-only, empty-heading, html-has-lang) n'ont jamais violé dans ce
cycle — notés dans `regles_baseline.note`.

## W5 — unités incomplets (convention documentée)

Clé `conventions.incomplets` ajoutée à results.json : **tous les compteurs =
nœuds axe** (somme des items.nodes). Chiffres nœuds rejoués : 215
baseline-auth, 117 final-auth, 117 install-build-auth (la v1 mélangeait 53
groupes / 117 nœuds).

## W6 — `<h2>…</h3>` add-watch-ui (corrigé)

`blueprint/add_watch_ui/templates/add-watch-ui.html` : `</h3>` fermant le
`<h2 id="add-watch-legend">` → `</h2>`. patch.diff **régénéré depuis l'arbre
appliqué** (`git add -N` pour le fichier neuf `_a11y.scss`, puis `git diff
HEAD`) — 43 fichiers, **+273/−88** ; `git apply --check` 0 rejet sur clone
propre, install-build l'applique pour de vrai.

## W7 — provenance

Re-hashée via `boucle-continue/rehash-provenance.py` **en dernier**, après
toutes les corrections ci-dessus (sha256 recalculés depuis disque, entrées
ajoutées pour tools/package.json, tools/package-lock.json et ce verdict).

## État livré

- `patch.diff` v2 (43 fichiers, +273/−88, apply 0 rejet)
- `reports/{baseline,final,install-build}-{public,auth}/` régénérés sous
  axe 4.14.0 épinglé, scope 15 urls paramétrées + 33 états
- `reports/incomplete-probes.json` (117 items, 0 CONFIRMED) +
  `reports/eval-final.json` (1340→0) régénérés
- `manifest.json`, `states.json`, `scope-compare.json`, `results.json`
  synchronisés (chiffres, règles réelles, conventions, commandes)
- `tools/` : seed.py corrigé et exécuté exit 0 ; package.json+lockfile
  épinglés ; audit.mjs trace axeVersion + expansion $CD_*_UUID ;
  createRequire épinglé au dossier du script partout
- REGISTRE ligne 33 mise à jour (verdict CONFIRMED→v2, règles réelles,
  chiffres rejoués)
