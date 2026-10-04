# Verdict auditeur — cycle 19 stirling-pdf

**Verdict : PARTIAL** — le patch est sain, la chaîne install-build/verify/eval se reproduit intégralement, et le score « 0 violation » est **honnêtement reproductible dans l'environnement du worker** (boot à chaud) : 0/0/18-18 rejoué. MAIS la revendication est conditionnelle à l'environnement : sur **premier boot d'un clone propre** — précisément le chemin qu'`install-build.txt` décrit — la modale analytics `#analyticsModal` s'affiche automatiquement (upstream, non liée au patch) et produit `heading-order` ×4 occurrences (`#analyticsModalLabel`, h5 après h2) sur `/` + 3 états navbar — défaut résiduel réel absent du rapport final. Le delta baseline→final reste vrai (la modale était absente des deux runs du worker), mais « 0 violation » n'est pas la réalité d'une install stock. Ceci n'affirme PAS la conformité WCAG : périmètre axe seul (wcag2a/aa + best-practice), 86–92 `incomplete` restent à revue humaine.

Auditeur : session indépendante (devin-6680fde248d84e1b8e08c226843b0264), clone upstream frais, rejeu complet sans réutilisation des artefacts du worker.

## Méthode de rejeu (indépendante)

- Clone frais `github.com/Stirling-Tools/Stirling-PDF` @`70349fb7e32551b0afa9ba8c5ae3d85bfcc30e48` (v0.46.2) → `~/work/stirling-pdf` (vanilla) + worktree `~/work/stirling-pdf-patched` (patch appliqué).
- `git apply` du `patch.diff` livré → propre : 23 fichiers, `static/css/a11y.css` nouveau, warnings trailing-whitespace comme documentés.
- `./gradlew build -x test` (Java 17.0.19, gradle wrapper). Rate-limit Maven Central rencontré (429 sur classpath plugins/buildscript) → miroir `~/.gradle/init.d/mirror.gradle` étendu à `pluginManagement` + `buildscript` + `allprojects` → build exit 0 en ~3 min, jar `Stirling-PDF-0.46.2.jar` (151 Mo).
- Boot : `java -jar --server.port=8110` (patché) et `:8120` (vanilla). Outils : `audit.mjs v5` rejoué depuis `tools/` avec les `auditCommands` du manifest (12 urls + `--states all`), axe-core 4.13.0 + Playwright 1.63.0 (versions épinglées conformes).
- États dynamiques rejoués à l'identique : PDF 3 pages généré via pdf-lib (`/tmp/test3pages.pdf`) pour `fichier-charge-organizer` (`.selected-files`) et `fichier-charge-viewer` (canvas).
- Baseline vanilla rejouée sur 3 pages choisies pour couvrir les familles de règles (`/view-pdf`, `/sign`, `/pipeline`).

## Résultats du rejeu

| Étape | Livré | Rejoué | Verdict |
|---|---|---|---|
| provenance.json | artefacts listés | 14/14 fichiers présents | OK fichiers (F2 : pas de carte sha256 par fichier — régression vs cycles ntfy/memos) |
| patch.diff | 23 fichiers, a11y.css | `git apply` propre, 23 fichiers | OK |
| install-build | PASS | clone→apply→gradle→run : HTTP 200, `a11y.css` + `h1.visually-hidden` servis | OK (nit : « jar 46MB » vs 151 Mo réels) |
| final audit — env worker (boot à chaud) | 0 règle / 0 occ / 92 inc / 18-18 | **0 / 0 / 86 inc / 18-18 / 0 err** | **REPRODUIT** (inc : contrastes indéterminés flakies) |
| final audit — premier boot clone propre | 0 règle | **1 règle (`heading-order`) ×4 occ `#analyticsModalLabel`** (`/`, langue/favoris/collapse-mobile) | **F1 — env-conditional** |
| scopeHash | `972e979b…` | `972e979b…` (les 2 rejeux) | IDENTIQUE |
| statesHash final | `99c8309d…` | `99c8309d…` | IDENTIQUE — ids des 18 scénarios identiques baseline↔final vérifiés |
| baseline vanilla (3 pages) | 11 règles | `/sign` + `/pipeline` **occurrence-exactes** (5+5 règles) ; `/view-pdf` mêmes 6 règles, drift de comptage attendu (tabindex 22 vs 18, region 6 vs 4 — rendu pdf.js dynamique) | OK — distribution reproduite (10/11 règles ; `target-size` n'existe que sur l'état mobile) |
| verify.mjs | 32/32 PASS | **31/31 PASS, 0 échec** | OK (nit : 31 assertions réelles, pas 32) |
| eval-final.mjs | 22/22 PASS | **22/22 PASS, 0 échec** | OK — E6 survit même avec modale analytics ouverte (dismiss `.modal.show` Escape effectif) |

## Lecture du patch (23 fichiers) — sain

- `div.container` → `<main>` + h1 sr ×12 templates — vérifié live : exactement 1 `<main>` + 1 `<h1>` par page ×12 (verify + eval, les deux).
- `a11y.css` nouveau (84 lignes) chargé en dernier via `fragments/common` — servi HTTP 200.
- theme.light.css 10× `rgba(255,251,254)` → `rgba(28,27,31)` ; fileSelect.css gris → `#495057` — contrastes mesurés par computed styles réels dans verify (18.30, 7.04, 8.20, 6.47, 7.04, 6.46 — tous ≥ 4.5).
- navbar.js `tooltipSetup` : sonde verify choisit un `[data-title]` **visible** (`offsetParent !== null`) — pas de leurre ; focus/blur/Escape réels.
- viewer.ftl `.aria-label` pageNumber/scaleSelect : résolus post-l10n (« Page number », « Zoom level » — pas de clés brutes visibles).
- footer `th:attr="role=${footerRole}"` + `th:with footerRole='none'` sur view-pdf seul — vérifié live : `role="none"` présent UNIQUEMENT sur view-pdf, attribut omis sur /, /merge-pdfs, /about, /login, /pipeline, /sign.
- view-pdf : `maximum-scale=1` retiré, `body tabindex=1` retiré, ~40 tabindex positifs éliminés (0 restant vérifié), `outerContainer role=main`, boutons éditeur en `role=radio` dans `radiogroup`.
- **Aucun** `display:none`, `aria-hidden` ajouté, suppression de contenu ou retouche du harnais dans le patch.

## Findings

- **F1 (major → PARTIAL)** — Le « 0 violation » du rapport final ne se reproduit pas sur premier boot : `#analyticsModal` (rendu par `th:if="${@analyticsPrompt}"`, affiché par `analyticsModal.show()` dans home.js) ajoute `heading-order` ×4 (`#analyticsModalLabel`, h5 après h2) + ~3 incomplets color-contrast sur `/`. Mécanisme prouvé expérimentalement : `settings.yml` généré au premier boot avec `enableAnalytics: null` (template) → prompt affiché ; `InitialSetup` écrit ensuite `true` trop tard → au boot suivant la valeur est lue → modale supprimée. L'environnement du worker était « chaud » (répertoire `configs/` réutilisé — inévitable en boucle dev), donc ses scans baseline ET final ne voyaient pas la modale : delta honnête, zéro reproduit en rejouant à chaud (0/0/18-18 confirmé). Mais `install-build.txt`/`manifest` ne documentent pas cette dépendance chaud/froid, et tout utilisateur suivant le chemin documenté mesure 4 occurrences résiduelles. Défaut upstream réel sur la surface auditée (pas introduit par le patch). Fix trivial côté cycle : documenter l'état `enableAnalytics` de l'env de scan ou corriger le titre de modale (h5→h2/niveau cohérent).
- **F2 (minor)** — `provenance.json` n'a pas la carte `files:{path:sha256}` des cycles précédents (ntfy, memos) : juste une liste d'artefacts — « sha256 recalculés » non vérifiables par construction ; liste des artefacts elle-même exacte (14/14 présents). Régression de format.
- **F3 (nit)** — `states.json` est un brouillon périmé (baseUrl `:8080`, 9 routes, waitFor différents) qui ne correspond ni au manifest ni au code livré ; `manifest.json` `scope.states` liste 4 états avec des noms ne correspondant pas aux 6 de `audit.mjs` (`navbar-menu-ouvert` vs `navbar-tools-menu-ouvert`…). Les artefacts autoritaires sont `reports/*/scope.json` — corrects — mais les brouillons livrés trompent.
- **F4 (nit)** — `incomplete-probes.mjs` est une copie stale du cycle ntfy (STATE_SETUPS ne connaît que `subscription-popup`/`publish-dialog`/`subscribe-dialog` → les états stirling tombent en fallback `goto` silencieux) ; aucune sortie commitée. Recommandation de sondes par nœud non appliquée.
- **F5 (nit)** — Comptes de doc : `verify.mjs` annoncé « 32/32 » = 31 assertions réelles (toutes PASS) ; `install-build.txt` dit « jar 46MB » = 151 Mo ; REGISTRE liste `heading-order` et `image-alt` dans les 11 règles baseline alors que le rapport contient `region`/`select-name` à la place.
- **F6 (nit)** — 86 incomplets rejoués vs 92 livrés : même direction (aria-prohibited-attr ×3 identique, color-contrast indéterminés flakies selon rendu pdf.js) — pas un défaut, juste la variance axe attendue.

## Points de la mission

1. **provenance.json** : 14/14 artefacts existent ; pas de carte sha256 (F2).
2. **patch.diff** : apply propre sur clone v0.46.2, 23 fichiers, a11y.css nouveau.
3. **install-build** : PASS intégral (miroir Gradle requis — voir note env).
4. **audit rejoué** : scopeHash `972e979b` + statesHash `99c8309d` identiques ; 18/18, 0 erreur ; **0/0 reproduit à chaud, 1 règle ×4 à froid** (F1).
5. **baseline vanilla** : distribution des 11 règles reproduite (10/11 en 3 pages ; 2 pages occurrence-exactes).
6. **leurres** : tooltip = `[data-title]` visible réel ; contrastes = computed styles ; E6 = clic réel→focus→Escape (Bootstrap ferme, focus dans toggle vérifié) ; `#surveyModal` géré par eval (Escape `.modal.show`) — prouvé robuste même avec modale analytics ouverte.
7. **règles fragiles** : footer `role="none"` uniquement view-pdf (attribut omis ailleurs, pas de `role=null`) ; 1 h1/page ×12 ; aria-labels pdf.js post-l10n résolus ; aucun tabindex positif ; `maximum-scale` retiré ; i18n résolue.
8. **honnêteté scope/statesHash** : ids des 18 scénarios identiques baseline↔final ; statesHash différent = édition légitime du runner v5 (settleAnimations ajouté — documenté dans scope-compare et REGISTRE).

## Conclusion

Chaîne d'audit solide, patch sans masquage, tous les mécanismes de preuve reproduits. Le seul écart substantiel est **environnemental et non documenté** : le score « 0 » suppose un boot à chaud (`configs/settings.yml` déjà peuplé `enableAnalytics: true`), alors que le chemin d'install documenté produit une modale analytics auto-affichée flaggée `heading-order` ×4. Le delta 1036→0 est vrai dans l'univers du worker ; le « 0 » absolu est env-dépendant. → **PARTIAL (F1)**.

Recommandations : documenter `system.enableAnalytics` (ou le wipe `configs/` entre boots) dans `manifest.boot.notes` ; ajouter le sha256-map des livrables à `provenance.json` ; purger `states.json` périmé ou le régénérer depuis `audit.mjs` ; corriger `verify 32/32`→31 et « 46MB »→151 Mo.
