# Verdict auditeur indépendant — cycle 10 : paperless-ngx/paperless-ngx @ 8adbff14

**Verdict : PARTIAL** (score axe reproduit à l'identique + patch sans astuce de harnais, MAIS provenance incomplète, un correctif cassé en navigation réelle, et « 0 violation » sur /logs dépendant de l'état des données)

Auditeur : session Devin 6636e84c (cycle boucle-continue, branche `devin/boucle-continue`)
Date : 2026-10-04 · Méthode : rejeu intégral sur machine propre — clone vierge @ `8adbff1423af58575bc5a08eee7a6d833fd95651`, `git apply` du `patch.diff` livré, outils du cycle non modifiés.

## Ce que j'ai rejoué moi-même

| Étape | Résultat |
|---|---|
| sha256 `patch.diff` livré vs recalculé | OK — `f583cdd9…05f42` conforme à `patch.diff.sha256` et `provenance.json` |
| `git apply` sur clone propre @ 8adbff14 | OK (41 fichiers) |
| `pnpm install --frozen-lockfile` (src-ui) | PASS (pnpm 11.15.1) |
| `ng build --configuration production` | PASS — 0 erreur (warnings budget/traductions seulement) |
| `uv sync --frozen` (Python 3.12) + `manage.py migrate` | PASS |
| valkey :6379 + superuser admin/adminpass123 | PASS |
| `collectstatic --noinput` puis `runserver` (après build) | PASS — whitenoise indexe les assets au démarrage |
| `login.mjs` → `auth.json` (vrai formulaire allauth) | PASS |
| `audit.mjs` final : 15 urls + `--states all` + `--storage-state auth.json` | **0 règle / 0 occurrence / 0 erreur / 17 incomplets, exit 0** — conforme à `reports/final/report.json` |
| `audit.mjs` /accounts/login/ (sans auth, `--states none`) | **0 / 0 / 0** — conforme à `reports/login-final/report.json` |
| `verify.mjs` | **19 PASS / 0 FAIL** — conforme à `results.json` |
| `eval-final.mjs` | **9 PASS / 0 FAIL** — conforme à `results.json` |
| install-build sur checkout propre (apply + frozen + build + collectstatic + `manage.py check`) | PASS — conforme à `results.json.install_build_clean_checkout` |
| `scopeHash` scope.json rejoué | `95f9c7ad…1524f` = `runner_scope_hash_final` de scope-compare.json — **identique** |
| `scopeHash` login rejoué | `57e70cb3…09fba` = scopeHash de `reports/login-final/report.json` — **identique** |

## Comparaison des incomplets (17 des deux côtés)

Même total, composition différente — timing/données, non contradictoire :

- **color-contrast : 13 nœuds identiques** aux nœuds près (mêmes pages, mêmes sélecteurs).
- **th-has-data-cells : 4 chez moi vs 2 worker** (tags, correspondents, documenttypes, trash — tables vides sur base neuve ; même classe N-A).
- **worker : 2 incomplets aria sur /logs** (`aria-required-children` nav-tabs, `aria-valid-attr-value` panel) — **résolus proprement dans mon run** (liaison tab↔panel valide au premier chargement).

## Patch sain — lecture intégrale (1074 lignes, 41 fichiers)

**Aucune astuce de harnais** : pas de `display:none` ajouté, pas de suppression de DOM audité, pas de délai artificiel, pas d'aria décoratif déconnecté, pas de CSS masquant plutôt que corrigeant. Corrections réelles et mappables 1:1 sur les 13 règles de la baseline (152 occ) : h3→h1.h3 / h4→h2 / h5→h2 / h6→h2 (page-has-heading-one, heading-order), `ul ngbNav`→`div.nav` + `li ngbDropdown`→`div` (aria-required-children, listitem — les enfants n'étaient pas des items nav), aria-labels sur les deux `<nav>` + brand (landmark-unique, link-name), `<main>`+h1 sr-only dans base.html (landmarks login), labels réels sur selects/checkbox/radios/inputs (label, select-name), `role="combobox"` sur la recherche à suggestions (aria-allowed-attr — sémantiquement justifié), `role="group"` + aria-labelledby sur les menus ngbDropdown, span sr-only + aria-label « Select all » sur les th checkbox (empty-table-header), compteur d'instance filterable-dropdown (duplicate-id-aria — vrai bug fonctionnel corrigé, ids `dropdown_<name>_N` uniques), `text-muted`/`text-secondary`→`text-body-emphasis` et `btn-outline-secondary`→`gray-700` (contrastes), `form-check-input` 1.5rem (WCAG 2.5.8).

### Retraits d'opacity : jugés honnêtes

`transition: opacity` retirée des spans sidebar, `opacity: 0` retiré du keyframe `sidebar-nav-in`, `.fade:not(.modal){transition:none}`, `@if (show())` à la place de `fade`/`show` (saved-view-widget, widget-frame), file-drop en rendu conditionnel + `role="status"`. Preuve baseline : `.nav-link-label` flaggé contrast **uniquement sur /documents et /share-links** alors que la sidebar est identique sur les 15 pages → signature de mesure mid-fade flaky, pas un vrai défaut. Boni réel : le contenu monté à `opacity:0` restait dans l'arbre d'accessibilité (invisible mais annoncé) — le `@if` corrige ça honnêtement. Cosmétique assumée (translate conservé), documentée dans `manifest.honest_notes`. Verdict : simplification produit acceptable, pas du masquage.

## Findings

1. **[major] Le wiring tab↔panel du patch casse en navigation SPA réelle.** `logs.component.html:47` et `document-attributes.component.html` posent `[attr.id]="'ngb-nav-' + indexOf(active) + '-panel'"` et `aria-labelledby="'ngb-nav-' + indexOf(active)"`. Or `domId` des items ngbNav vient d'un compteur **global à l'application** (`fesm2022/ng-bootstrap-ng-bootstrap-nav.mjs:43` `let navCounter = 0`, `:115` `domId = 'ngb-nav-' + navCounter++`), qui n'est remis à zéro qu'au reload complet — jamais en navigation client-side. **Démontré** : `/settings` (4 items → domIds 0-3) puis nav SPA `/logs` → le tab actif porte `id="ngb-nav-4"`, `aria-controls="ngb-nav-4-panel"` pendant que le panel du patch affiche `id="ngb-nav-0-panel"` `aria-labelledby="ngb-nav-0"` → axe flagge `aria-valid-attr-value` (critical) dans cet état. Idem `/settings`→`/attributes/tags` (lien `ngb-nav-4` vs panel `ngb-nav-0-panel`). C'est **exactement la classe de défaut de la baseline** (aria-valid-attr-value sur /logs : aria-controls→panel inexistant) que le patch prétend corriger : la correction ne tient que parce qu'`audit.mjs` fait `page.goto` par URL (reload → navCounter=0). Fix robuste : lire les `domId`/`panelDomId` réels des navItems (ou poser des `domId` explicites sur les items et réutiliser la même base).

2. **[major] « 0 violation » sur /logs est dépendant de l'état des données.** Sur le MÊME build patché, fresh reload de /logs avec 73 entrées : axe flagge `scrollable-region-focusable` (serious) — le `#logContainer` (`logs.component.html:47`, `logs.component.scss` `overflow-y:auto`) déborde sans `tabindex` (WCAG 2.1.1 réel) — et `color-contrast` (serious) — `.log-entry-40 { color: red !important }` sur `bg-dark` ≈ 4.0:1, et `.log-entry-10/30` incomplets ×42. Défauts produit **préexistants** (le patch ne touche pas le scss), mais le « 0 » du rapport final ne tient que dans une fenêtre précoce (log court, pas de débordement, pas d'entrées ERROR). Même classe de dépendance aux données que le PARTIAL du cycle 6 (Tandoor).

3. **[minor] `provenance.json` : sha256 de `scope-compare.json` non conforme.** Livré `7a704019…6142`, enregistré `9692462c…ca5d`. Tous les autres artefacts vérifient (patch.diff, audit/verify/eval/states, reports baseline/final/login-final). Même classe que le finding CyberChef — métadonnées calculées avant la regénération finale du fichier (leçon protocole n°5). Annexe : `reports/login-baseline/report.json` livré mais absent d'`artifact_hashes` ; `statesHash` produit par scope.json non enregistré dans provenance (donc incomparable).

4. **[minor] `manifest.json` sans `auditCommands[]`.** Recommandation protocole n°3 (audit NPM) : les invocations exactes (`--urls`, `--states`, `--wait`, `--wait-for`, `--storage-state`) devaient être figées. J'ai reconstruit les commandes depuis scope-compare.json + states.json — résultat identique au final, mais la reconstitution est censée être interdite.

5. **[minor] Deux menus dropdown nommés « Actions » par erreur.** `document-detail.component.html:97` — le menu de `#sendDropdown` (l.94) garde `aria-labelledby="actionsDropdown"` ; `bulk-editor.component.html:155` — le menu du split-button « Download options » garde `aria-labelledby="dropdownSelect"` (le toggle Actions, l.85). Défaut préexistant que le patch conserve en ajoutant `role="group"` : le nom accessible des menus Send/Download est « Actions ». axe ne le voit pas (la cible existe) ; le `verify.mjs` du cycle ne teste que userMenu/tagsDropdown.

6. **[info] `verify.mjs` `logs-tab-panel-link` passe avec un seul onglet.** `r.length > 0` est un plancher faible : sur mon instance un seul fichier log → une seule paire tab/panel testée (PASS). Assertion correcte, couverture faible.

7. **[info] États dropdown non audités.** Seuls `userMenu` + `tagsDropdown` sont rejoués (déclaré dans states.json) ; les menus send/download/toasts/chat/custom-fields ne sont jamais scannés ouverts — c'est là que vivent les findings 5 et le `<h6>` du panneau toasts.

8. **[info] `h6 « Notifications »` dans le panneau toasts-dropdown** reste un h6 devant le h1 en ordre DOM quand le menu s'ouvre (non flaggé : premier heading → pas de saut par axe) — état non couvert par l'audit.

## Conclusion

Le score « **0 violation axe sur 15 pages + 2 états + login, exit 0, 19/19 verify, 9/9 eval, install-build OK** » est **reproduit à l'identique** : même scopeHash `95f9c7ad…`, même exit code, mêmes compteurs, patch sha256 conforme. Le patch est globalement sain : 13 règles corrigées par de vraies modifications sémantiques, aucune triche de harnais détectée, les simplifications opacity sont documentées et honnêtes.

Mais trois éléments empêchent le CONFIRMED plein : la provenance livre un hash `scope-compare.json` qui ne correspond pas au fichier (classe déjà jugée PARTIAL chez CyberChef) ; le wiring `ngb-nav-<index>-panel` est **démontré cassé en navigation SPA réelle** sur /logs ET /attributes/* (la famille `aria-valid-attr-value` réapparaît hors du scénario reload-par-URL du harnais) ; et la page /logs n'est « propre » que sur log court (conteneur non focusable au clavier + entrées ERROR sous-contrastées réapparaissent à volume ordinaire — défauts produit réels, hors couverture du patch). Aucune preuve d'intention de masquage — ce sont des défauts de qualité du correctif et de provenance, pas du score.

**PARTIAL.** Recommandation au coordinateur : (a) fixer les id/panelDomId réels plutôt que `indexOf` pour les tabpanels ; (b) `tabindex="0"` + revue des couleurs `.log-entry-*` sur le conteneur de logs ; (c) recalculer `provenance.json` depuis le disque au commit final (leçon n°5) ; (d) figer `auditCommands[]` dans le manifeste ; (e) corriger les deux `aria-labelledby` pointant sur le mauvais déclencheur.
