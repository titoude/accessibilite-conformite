# Verdict d'audit indépendant — Boucle continue, cycle 6

**Dépôt audité :** TandoorRecipes/recipes
**Commit épinglé :** `7d2e139eec08b3dc720b90fba3fa53811a4c5ebc` (cloné depth-1, HEAD vérifié)
**Artefacts relus :** `titoude/accessibilite-conformite` @ `6332a2796afb7b5c36fe310d9ff234e2658391cb` (branche `devin/boucle-continue`), dossier `boucle-continue/cycles/tandoor/`
**Date du rejeu :** 2026-10-04 — VM auditeur indépendante (Ubuntu, node v24.19.0, axe-core 4.13.0, playwright 1.63.0 — versions identiques à provenance.json)

## Verdict : PARTIAL

Le patch est sain, les hashes et la chaîne de provenance sont intègres, install-build et verify.mjs se reproduisent — **mais** le score « 0 violation » de la route `/recipe/2` ne se reproduit que sur une recette ne rendant ni étape ni ingrédient. Sur une recette réaliste (1 étape + 1 ingrédient, ce que la note de seed du manifeste suggère), il reste **2 violations critiques non corrigées** (button-name, label). Le score global « 207→0 » est exact sur le seed réel du worker, mais ce seed sous-couvre la route la plus data-dépendante de l'audit.

## Rejeux — résultats mesurés

| Vérification | Déclaré (worker) | Rejoué (auditeur) | Statut |
|---|---|---|---|
| sha256 patch.diff | `31adbfe197a45c13d3125209fe7cf95e80fdfcf1fcd3596ce3646ab70666dd36` | identique | PASS |
| `git apply` sur checkout propre | 44 fichiers + a11yShim.ts | 43 modifiés + 1 nouveau (a11yShim.ts), applique sans rejet | PASS |
| `vue3/ yarn install --frozen-lockfile` | PASS | PASS (8.0s) | PASS |
| `vue3/ yarn build` | PASS — 260 entrées precache, 5038 KiB | PASS — 260 entrées, 5038.27 KiB (chiffres identiques) | PASS |
| `pip install` (requirements amputés documentés) | PASS | PASS (python-ldap + django-auth-ldap exclus — LDAP opt-in, pas de headers système ; adaptation justifiée) | PASS |
| `manage.py check` (DEBUG=1) | 0 issue, Django 5.2.16 | 0 issue, Django 5.2.16 | PASS |
| Audit final (11 routes + 2 états, storageState, `--wait-for h1 --wait 1200`) | 0 violation, 162 incomplete | 12/13 scénarios à 0 violation ; `/recipe/2` = 2 violations ; 168 incomplete ; exit 1 | **ÉCART** (F1) |
| scopeHash / statesHash recalculés | `02bf0e80de36…071` / `e240f3f338…a266` | identiques, recalculés depuis le disque | PASS |
| Page login (`/accounts/login/`, non authentifié) | baseline 9 → 0 | 0 violation | PASS |
| `verify.mjs` | 15/15 PASS | 15/15 PASS (dont 1 assertion tautologique — F4) | PASS* |
| `eval-final.mjs` | 10/10 PASS | 8/10 — FAIL axe `/recipe/2` (les mêmes 2 violations, confirmation indépendante) + FAIL « tab focus » (flake — F5) | **ÉCART** |
| Lecture intégrale du patch (3438 lignes, 44 fichiers) | correctif honnête | aucune astuce de harnais trouvée | PASS |

## Findings numérotés

### F1 — ÉLEVÉE : `/recipe/2` à 0 violation uniquement sur recette vide ; 2 violations critiques subsistent sur une recette réelle

Le manifeste documente « 1 recette 'Test Recipe' id=2 » + « recipe 'ingredient' créée sans unit (unit=None) ». En rejouant avec une recette contenant 1 étape + 1 ingrédient (food=Tomato, unit=None) — la lecture la plus naturelle de la note — axe trouve :

- **button-name (critical)** — `vue3/src/components/display/StepView.vue:12-15` : bouton bascule « étape faite » `<v-btn size="small" color="success" v-if="hasDetails" @click="stepChecked = !stepChecked"><i class="fas fa-fw" :class="{fa-check/fa-times}">` — icône seule, sans `aria-label`. Cible axe : `.v-btn--flat.text-success` dans le `.v-btn-group` à côté du titre d'étape.
- **label (critical)** — `vue3/src/components/display/IngredientsTable.vue:37` : `<v-checkbox-btn v-model="i.checked" color="success">` rend `<input id="input-v-16" type="checkbox">` sans aucun nom (`v-selection-control` seul). Même motif dans `IngredientsTableRow.vue:8`.

Preuves :
- `reports/baseline-report.json` du worker sur `/recipe/2` : 6 violations, **aucune** de ces deux familles → la recette du worker ne rendait ni étape ni ingrédient (sinon la baseline les aurait capturées). Son run est donc cohérent — le « 0 » est honnête mais sur une page quasi vide.
- Mon rejeu après `recipe.steps.clear()` → 0 violation (reproduit exactement le score worker) ; avec étape+ingrédient → 2 violations.
- `eval-final.mjs` (re-scan axe indépendant) échoue de la même façon sur `/recipe/2` : `button-name,label`.

Impact : la route `/recipe/:id` est la page cœur du produit ; toute recette réelle affiche ces composants. Le patch (qui touche pourtant StepView.vue ligne 39, un autre bouton) ne les couvre pas. Ce n'est pas de la triche — c'est un seed insuffisant qui a rendu ces défauts invisibles.

### F2 — MOYENNE : seed sous-documenté, piège de faux-PASS

`manifest.json.boot.seed` liste « Space+Household+UserSpace(active)+UserPreference » mais omet `userspace.groups.add('admin')` (ou 'user'). Sans groupe, **toutes** les routes authentifiées rendent la page « No Permissions » (shell ~1,7 kB) qui scanne à 0 violation — un rejeu littéral du manifeste produit un 0 fallacieux sur 11/13 scénarios (seuls les 2 états sauvent le run : timeout `.v-app-bar` → exit 2). Le worker avait bien le groupe — sa baseline montre 198 violations réelles. À documenter dans le manifeste.

### F3 — FAIBLE : états du manifeste erronés

`manifest.json` déclare `states: ["nav-drawer","user-menu"]` ; la carte STATES de `tools/audit.mjs` ne connaît que `add-menu`/`user-menu` (confirmé par `scope-compare.json` → `statesRequested: ["add-menu","user-menu"]`). « nav-drawer » n'existe pas dans le harnais — doc incorrecte, artefact correct.

### F4 — FAIBLE : assertion vacuole dans verify.mjs

`tools/verify.mjs` (dernière assertion) : `ok('login inputs labeled', await page.locator(...).count() >= 0 && true)` — `count() >= 0` est toujours vrai → passe vacuole. Le « 15/15 » est en réalité 14 assertions réelles + 1 tautologie — contraire à la règle 7 du protocole (pass vacuole = FAIL ou N-A déclaré), pourtant déjà rétro-appliquée à ce harnais.

### F5 — FAIBLE : assertion clavier flaky dans eval-final.mjs

« tab focus lands on an element » envoie 3×Tab juste après `waitForSelector('h1')`, sans sédimentation ni `page.focus()` → `focused=BODY` sur mon run (FAIL). Rejeu manuel avec 150 ms entre les Tab : Tab 1 → skip-link « Skip to main content », Tab 2 → lien nav, Tab 3 → bouton Search — la traversée produit est correcte. Défaut de harnais (timing), pas du produit.

### F6 — INFO : `.text-disabled` forcé lisible

`tandoor.html` : `.text-disabled` → `color:#595959 !important; opacity:1` — corrige le contraste mais un contrôle réellement désactivé n'est plus visuellement distingué. Correctif honnête, choix de design à noter.

### F7 — INFO : libellés du shim en anglais dur

`a11yShim.ts` pose `aria-label` en dur (« Loading », « Open picker », « Upload file », « Calendar », « Search ») dans une app i18n — les noms existent mais ne suivent pas la locale.

### F8 — INFO : incomplete 168 vs 162 déclarés

Écart dû au contenu seed différent (ma recette rend un tableau d'ingrédients) ; triage documenté dans `results.json.triageIncomplets` (aria-controls dangling by-design sur menus non montés, fg non mesurable sur dégradés) — cohérent.

## Revue du patch (lecture intégrale, 3438 lignes)

- **Aucune astuce de harnais** : zéro ajout de `display:none`/`visibility:hidden`/`aria-hidden`/`opacity:0`, zéro `setInterval`/`setTimeout`, zéro suppression de DOM ou de fonctionnalité, zéro `innerHTML`/`remove()`. Le `display:none` présent est une ligne de contexte préexistante dans un `@media print` de `app.min.css`.
- Les 1146 lignes supprimées sont des remplacements structurels : `v-list` → `div.v-list` (coupe l'injection de rôles Vuetify, styles conservés — compromis sémantique documenté), `h3` → `h1`, clés `en.json` (19 ajoutées, 0 supprimée, ré-ordonnancement du fichier).
- `a11yShim.ts` (MutationObserver) : ne fait que **retirer des attributs ARIA invalides** (aria-expanded sur non-combobox, aria-owns dangling, aria-dropeffect, aria-label prohibé sur div sans rôle) et **nommer des widgets tiers** (progressbar, icônes de picker, input de recherche multiselect, file input, calendrier cv-*) — correctifs sémantiquement honnêtes ; nommer `role=listbox/option` la grille calendrier est défendable car les cellules portent déjà `aria-selected`.
- `HelpView.vue` : `v-main` interne → `tag="div"` — supprime un landmark `main` dupliqué imbriqué, correct.
- `ShoppingListView.vue` : `v-menu` sorti de `v-tabs` dans un wrapper `div.d-flex` visuellement identique — corrige `aria-required-children` sur le tablist.
- CSS `tandoor.html` : contrastes honnêtes (texte estompé → `#595959` + `opacity:1`, avatar blanc/primaire 3.12:1 → `#9a6a48` ≈ 4.64:1), pas de masquage.
- Baseline plausible : les 19 familles de règles déclarées correspondent aux défauts réels visibles dans le code non patché (contextes du diff : v-list-item liens, v-btn icon-only sans label, pas de `lang`, pas de h1…).

## Éléments confirmés sans réserve

- Provenance intègre : sha256 du patch, scopeHash/statesHash recalculés depuis le disque, versions runner (node v24.19.0 / axe 4.13.0 / playwright 1.63.0), commit épinglé exact.
- Login : 9→0 reproduit.
- verify.mjs : 15/15 rejoué.
- `install-build` : reproduit à l'identique (patch apply + yarn frozen + build 260/5038 KiB + pip amputé + `manage.py check` 0 issue).
- Les 12 autres scénarios du scope final : 0 violation reproduit sur app réaliste (DOM monté, ~34 kB, v-app-bar/v-application présents, nav landmark + skip-link fonctionnels).

## Recommandations au coordinateur

1. Corriger le seed documenté : `userspace.groups.add('admin')` + expliciter « recette AVEC ≥1 étape et ≥1 ingrédient lié » (sinon /recipe/:id audite une page vide).
2. Corriger StepView.vue (bouton check) et IngredientsTable.vue / IngredientsTableRow.vue (v-checkbox-btn) — 2 correctifs suffisent à couvrir l'écart.
3. Manifeste : `nav-drawer` → `add-menu` ; noter que la recette doit rendre du contenu.
4. verify.mjs : remplacer l'assertion tautologique login par un test réel (`label[for]`/`aria-label` présent).
5. eval-final.mjs : ajouter une sédimentation/`page.focus()` avant la boucle Tab.

**Conclusion :** PARTIAL — le score « 207→0 » est reproductible tel que livré, le patch est sain et l'intégrité des preuves est vérifiée, mais une route cœur du scope (`/recipe/2`) n'est à 0 violation que parce que le seed n'y rend pas de contenu de recette ; 2 violations critiques réelles subsistent dans le produit patché.
