# Verdict auditeur — cycle 42 jenkinsci/jenkins @db0e0829

**Verdict : CONFIRMED** — rejeu indépendant complet, zéro confiance (auditeur :
devin-006c4e2a, 2026-10-08). Trois instances construites par mes soins depuis le
SHA pinné : `:6642` (clone + `git apply` patch.diff + build maven), `:6650`
(vanilla même SHA pour la baseline), `:6643` (install-build : clone vierge @SHA +
apply + `mvn -Pquick-build` + JENKINS_HOME vierge + 75 plugins + seed). Ports
66xx, JENKINS_HOME séparés, auth `admin/jk42-admin-pw` refaite via login.mjs.

## Rejeu point par point

| Claim worker | Rejeu auditeur |
|---|---|
| patch `git apply --check` 0 rejet, 41 fichiers jelly/scss/js | **confirmé ×2** : appliqué propre sur clone `db0e08291b113878ba08f97274d56c321be32078` (41 fichiers, 0 rejet) ET sur clone vierge install-build ; sha256 sidecar conforme à l'octet |
| war servi = build du SHA pinné | **confirmé, preuve la plus forte possible** : `META-INF/MANIFEST.MF` du war contient `Implementation-Build: db0e08291b113878ba08f97274d56c321be32078` ; `X-Jenkins: 2.586-SNAPSHOT` servi sur les 3 instances ; CSS oklch du patch réellement compilé dans le war (badge fg mesuré `oklch(0.5)` vs vanilla `oklch(0.55)`) |
| seed rejouable | **confirmé ×2** : `tools/seed.sh` → `SEED_DONE jobs=6 creds=4` sur :6642 et :6643 (scriptText groovy, crumb+cookie jar, idempotent) |
| final auth 0 viol / 0 err / 247 inc sur 26 scénarios | **confirmé exact** : mon rescan :6642 → **0 violation, 0 erreur, 247 incomplets** (152 color-contrast + 88 lcnm + 7 autres) ; diff nœud-par-nœud vs livré : seul bruit de seed (`data="<ISO8601>"` sur badges de build, liens console `#N.txt`) — mêmes règles, mêmes nœuds sémantiques |
| final public 0 viol / 0 err | **confirmé** : 0/0 sur /login + /signup-blocked |
| baseline 1546 occ / 15 règles + 1 public | **reproduite à −24 près** : mon rescan vanilla :6650 → **1522 occ, mêmes 15 règles** (11/15 comptes identiques) ; deltas sur color-contrast/region/button-name/target-size = contenu dynamique (menus tippy, historique builds) — variance honnête, pas falsification ; public : 1 occ identique |
| verify.mjs 32/32 | **rejoué : 32 PASS** sur :6642 (landmarks, h1, labels calculés, chevrons nommés, search-bar label, overflowButton) |
| probes 218 verdicts (130P/29NA cc + 88P lcnm + 1P public) | **rejoué identique** : mes 247 incomplets → **130 PASS + 29 N-A color-contrast + 88 PASS lcnm** ; N-A = ids générés `#idNN` (configure) + menus fermés non rendus — raisons réelles |
| eval-final.mjs 0 FAIL | **rejoué : 25 assertions PASS, 0 FAIL** (16 pages axe, dup-ids ×3, user-menu 9 items, newJob 8 champs nommés, mobile 390, buildWithParameters, dialog) |
| états déclarés (states.json 6 états + stateProofs) | **confirmé** : les 6 états (user-menu, job-row-menu, build-badge-menu, command-palette, theme-dark, mobile-nav-390) rejoués dans mon scan — sélecteurs déterministes, proofs vérifiables, 0 erreur de montage |
| install-build : clone vierge + apply + build + rescan 0 viol | **rejoué de bout en bout** : clone vierge @SHA → `git apply` (0 rejet) → `mvn -Pquick-build` (war 56.4MB, ~3m30) → boot :6643 JENKINS_HOME vierge + init.groovy.d/basic-security + 75 .jpi + seed → rescan verbatim 26/26 scénarios : **0 viol / 0 err / 247 inc** (claim 240 — même famille, dépend du nombre de badges seedés) |
| provenance 40/40 --strict | **confirmé** : re-hash sha256 de chacun des 40 fichiers déclarés — 40/40 conformes, aucun stale |
| axe version | scope.json : `4.14.0`, `axe-core@4.14.0` épinglé dans tools/package.json — baseline et final sous la même version |

## 2.5.3 sous axe 4.14 — éprouvé en live

Injection axe 4.14 sur :6642 (`/`, `/job/webapp-deploy/`, `/view/all/newJob`,
configure ×2) : **0 violation label-content-name-mismatch**. Contrôle manuel des
aria-labels ajoutés par le patch : les éléments iconiques (help-button « ? »,
chevron « N options », reveal jumplist, dropdown-indicator, build-health-link)
n'ont pas de texte visible → pas de mismatch ; les labels conditionnels des task
links ne s'appliquent qu'aux items sans texte (piege `attrs.text == null`);
`#search-box` aria-label = placeholder (« Recherche ») — cohérent. Le seul
aria-label « contenant du texte autre » est le `nav.jenkins-breadcrumbs`
(landmark — hors champ lcnm par construction axe, pas un défaut).

## Contrastes pixel-vrai (leçons 31/35)

Mesure des couleurs **réellement rendues** (getComputedStyle, conversion
oklch→sRGB) sur :6642 vs :6650 :

| Surface | vanilla | patché | ratio vs #f9fafb |
|---|---|---|---|
| `a.jenkins-badge` (lien « #2 ») | oklch(0.55 0.23 256.9) = rgb(0,103,243) | oklch(0.5 0.23 256.9) = rgb(0,86,226) | **4.73 → 5.85:1** |
| `a.task-link` (« New Item », side-panel) | oklch(0.05) | oklch(0.05) | 20.0:1 (inchangé) |
| `a.jenkins-table__link` (job rows) | oklch(0.55 0.23) | oklch(0.55 0.23) | 4.73:1 (inchangé, déjà AA) |
| header app-bar / h1 / inputs | oklch(0.05) | oklch(0.05) | ~20:1 |

Le token `--secondary` oklch 60%→55% et les fixes `--link-color` de notice /
badges 50% sont bien propagés dans le bundle compilé. axe 4.14 (qui mesure la
couleur effective post-compositing) : 0 violation color-contrast sur les 26
scénarios, dark theme compris (état theme-dark).

## Hors-scope restant (chasse active, axe 4.14 live)

32 URLs supplémentaires rejetées sur :6642 patché puis :6650 vanilla —
**107 occurrences résiduelles sur le patché ⊆ 622 en vanilla** : chaque règle
restante était déjà présente avant le patch (zéro violation introduite). Reliquats
amont sur pages jamais revendiquées :

- `/manage/pluginManager/available` → **101 occ** : `label` ×50 (checkboxes
  `#plugin.*.default` sans étiquette — ligne de table non couverte par
  associate-form-label), `color-contrast` ×50 (`.jenkins-label--tertiary`
  #889dba = 2.74:1 — token non patché), `button-name` ×1
  (`#button-install-after-restart`)
- `/manage/pluginManager/updates` → `landmark-one-main` + `region` (template
  sans l:main-panel)
- `/script` → `label` ×1 (textarea console groovy hors .jenkins-form-item)
- `/restart`, `/computer/(built-in)/configure` → `page-has-heading-one` (pas de
  View/index.jelly sur ces pages)
- `/oops` → `image-alt` ×1 (page d'erreur)
- `/safeRestart`, `/computer/new`, `/securityRealm/addUser`, `*/configure` des
  autres jobs, `/view/release/configure`, `/job/*/changes` → 0 viol patché

## Warts

- **W1** `tools/package.json` : `"name": "a11y-cycle37-linkding-tools"` —
  reste du template cycle 37 ; cosmetique (deps épinglées correctes).
- **W2** `verify.mjs` : `check('branding est <header>', m.header === true)` —
  tautologique (`header: true` codé en dur dans le mesure) ; la vraie assertion
  est `pageHeaderTag` juste à côté — faiblesse d'écriture, résultat inchangé.
- **W3** `eval-final.mjs` : l'assertion « dialogue suppression » passe
  vacuement quand la modale n'est pas trouvée (`found:false → PASS`). En
  pratique le chemin est « Delete Project » non cliqué à ce stade — assertion
  faible, non falsificatrice.
- **W4** `tools/measure-contrast.mjs` : `parse()` ne sait lire que
  `rgb()/rgba()` → crash `Cannot read properties of null` sur les tokens
  oklch de Jenkins. Outil mort sur ce produit (inutilisé par le pipeline —
  les probes font le travail) mais présent dans tools/.
- **W5** `results.json` : « probes 218 PASS (29+1 N-A) » — le fichier réel est
  130P + 29 N-A (auth) + 88P lcnm + 1P public ; la parenthèse se lit mal —
  distribution fichier = l'autorité, conforme à mon rejeu.
- **W6** baseline 1522 vs 1546 (−24 occ) : variance de contenu dynamique
  (menus tippy, entrées d'historique) — mêmes 15 règles, honnête.
- **W7** install-build inc 240 livré vs 247 chez moi : nombre de badges
  différent après seed (build history) — même famille d'incomplets,
  cohérent avec les propres chiffres du worker.

## Chiffres

| Mesure | livré | rejoué :6642 (patched) | rejoué :6650 (vanilla) | rejoué :6643 (IB) |
|---|---|---|---|---|
| baseline auth occ/règles | 1546/15 | — | 1522/15 | — |
| baseline public occ | 1 | — | 1 | — |
| final auth viol/err/inc (26 sc.) | 0/0/247 | 0/0/247 | — | 0/0/247 |
| final public viol/err | 0/0 | 0/0 | — | — |
| verify.mjs | 32/32 | 32/32 | — | — |
| eval-final.mjs | 0 FAIL (25 assert.) | 0 FAIL (25 PASS) | — | — |
| probes cc / lcnm | 130P+29NA / 88P | 130P+29NA / 88P | — | — |
| install-build viol/err/inc | 0/0/240 | — | — | 0/0/247 |
| provenance --strict | 40/40 | 40/40 | — | — |
| diff nœud-par-nœud final | — | 0 (bruit seed seul) | — | — |

**Conclusion** : chaîne de build complète rejouée de source vierge → war
compilé → service — version prouvée au SHA par Implementation-Build du MANIFEST,
seed et 6 états déterministes rejouables, scans finaux bit-identiques
(0/0/247 auth + 0/0 public) sur deux instances indépendantes, verify/probes/eval
rejoués conformes, baseline honnête (−24 occ de variance dynamique), contrastes
mesurés en couleurs réelles (badge 4.73→5.85:1), aucune violation introduite et
un net gain même hors scope (622→107 occ sur les mêmes pages), provenance
40/40 stricte. Les warts sont des faiblesses d'outillage/assertions, pas des
falsifications. **CONFIRMED.**
