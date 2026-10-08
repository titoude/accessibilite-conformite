# Verdict auditeur — cycle 44 mealie

**Auditeur** : devin-fe170bdfaa7a45d8a2f88258d25a8243 (session indépendante, rejeu zéro-confiance)
**Produit** : mealie-recipes/mealie @`06ccc2b1a6eef90dece7cfcd5aa48e140f544bf9` (v3.28.0)
**Claim à éprouver** : 1218 occ/18 règles auth + 73/9 public → 0 violation ; install-build verbatim 0 viol/0 err
**Mes instances** : vanilla :7844 · patchée :7854 · install :7864 (mes seeds, mes auth.json, mes rapports)

## Verdict : **CONFIRMÉ**

Le score axe se reproduit intégralement sur machines données indépendantes : 0 violation auth (51 scénarios) + 0 public (5) sur build patché ET sur install-build verbatim clone vierge → apply → docker → seed → boot → rescan. La baseline vanilla est cohérente (mêmes 18/9 règles, comptes page-par-page identiques à 3 écarts expliqués près). Le patch est transportable et sain ; warts qualité documentés ci-dessous, aucun bloquant.

## Rejeu par axe

**1. Transport du patch — CONFORME.** `sha256 patch.diff = 530548af35e9…` identique au sidecar. `git apply --check` : 0 rejet sur clone vierge @SHA. `git apply --stat` : **exactement 115 fichiers, +508/−215** — comptes manifeste exacts.

**2. install-build.sh verbatim — REPRODUIT (claim fort).** Script rejoué tel quel sur clone vierge GitHub (seuls chemins/port adaptés : 7864) : clone → fetch SHA → apply check+apply → docker build → run → /api/app/about OK → seed.mjs → login.mjs → 2 audits. Résultat : **auth 51 pages/0 viol/1440 inc, public 5/0/64 inc, 0 erreur** — identique aux chiffres worker.

**3. Baseline vanilla — REPRODUITE avec pureté prouvée (leçon 40).**
- Pureté : marqueurs patch **absents** du build vanilla vérifié dans l'image — `color-mix(in srgb, rgb(var(--v-theme-` : 0 hit ; règle `.v-overlay.v-tooltip:not(.v-overlay--active)` : 0 hit ; chaînes `Mealie home`/`Toggle navigation` : 0 hit (`medium-emphasis-opacity` existe en amont — non probant).
- Mon rescan : **auth 1273 occ / 18 règles / 1491 inc ; public 73 occ / 9 règles / 62 inc**.
- Comparaison nœud-par-nœud vs rapport worker : **public bit-identique** ; auth — les 46 scénarios communs identiques au nœud près (ex. golden-lentil-soup 48=48, context-menu 55=55). Écarts totalement expliqués : planner `/?start=` (erreur chez worker → 0, chez moi auditée → +15) ; `herb-sheet-pan-chicken` absente du lot worker à la baseline (+43) ; favorites −3 (données dynamiques). Familialement cohérent.

**4. Fix systémique `eager` — VALIDÉ.** Pré-ouverture : 10/10 ids `aria-controls`/`owns` présents dans le DOM (lazy-mount corrigé). Post-ouverture : 13/13. Menus/dialogs s'ouvrent et rendent le contenu (create-menu 2 items, settings-menu 5, language-dialog réel — vérifié en direct + les 10 `stateProof` ont passé dans mon propre scan, 0 erreur de page). Aucun overlay inactif ne contient de focusable — pas de violation introduite.

**5. Fixes live — VALIDÉS.**
- `error.vue` : 404 réelle → `lang="en-US"`, landmark `main`, h1 « 404 ».
- `v-list-group` : `role="group"` confirmé dans le DOM.
- Thème sombre, titre app-bar : mesure composite pixel-vrai fg=`rgb(33,33,33)` (= `#212121`, le on-primary patché) → **ratio 5.83 ≥ 4.5**.
- 2.5.3 (leçon 29) : règle `label-content-name-mismatch` exécutée en page sur 4 surfaces (members, /g/home, create, admin/users) → 0 violation. Les 2 mismatch de mon heuristique naïve sont des conteneurs `v-menu` (aria-label de composite — pratique correcte, axe ne les compte pas).

**6. verify/eval/sondes — REPRODUITS + sabotage détecté.** verify.mjs **21/21** ; eval-final.mjs **25/25** ; sondes : auth 774 PASS/180 N-A/**0 FAIL** (worker 777/176-177), public 25 PASS/12 N-A/**0 FAIL**. Sabotage : verify.mjs contre vanilla :7844 → **17 FAIL** (lang null ×3, contraste titre 2.76 mesuré, aria-labels absents, roles overlay/sidebar) — les assertions testent les liaisons réelles (leçon 42), pas des noms de secours.

**7. provenance + REGISTRE — CONFORMES.** `rehash-provenance.py --strict` : **40/40 empreintes OK**, spot-check 3/3. Ligne 44 du REGISTRE présente et fidèle aux claims.

**8. Chasse.** Hors-scope (planner, shopping lists, cookbooks, admin, éditeur, imports) : dans le périmètre de scan, 0 violation introduite partout. urls-public.txt = 4 routes (+1 état = 5 pages) — le « 5 routes » du manifeste = 4 routes + 1 scénario d'état, non fautif. seed.mjs rejoué 2× (vanilla + patchée) : idempotent, régénère seed-env.json/urls proprement.

## Warts (non bloquants — pour le fixer)

- **W1 — `title: $t('general.actions')` en 10 endroits** (RecipePage.vue, RecipePageIngredientEditor.vue ×5, RecipePageInstructions.vue ×2, RecipeNotes.vue, parsers bulk) : tout nouvel ingrédient/étape/note reçoit `title:"Actions"` (amont : `""`). Résultat : champ section visible pré-rempli et `<h3>Actions</h3>` rendu en vue si l'utilisateur enregistre tel quel — **pollution des données utilisateur par une clé i18n anglaise**, non requis par le fix empty-heading (`hasSectionTitle("")`/`validateTitle` falsy suffisaient, `.trim()` a bien été ajouté ailleurs). Non documenté dans verdict-worker. Recommandé : revenir à `""` et gérer l'affichage du champ titre autrement.
- **W2 — CSS morte SafeMarkdown** : style scoped `.safe-markdown :deep(a)` mais aucun élément ne porte la classe → règle inerte. Le fix contraste des liens markdown ne fait rien (passe quand même : bleu lien par défaut ≥4.5 sur clair). Ajouter la classe au div racine ou supprimer la règle.
- **W3 — members.vue** : premier checkbox permission labellé `household.household-management` vs `can-*` des 3 autres — incohérence cosmétique, fonctionnel.
- **W4 — outillage** : verify.mjs/eval-final.mjs basculent silencieusement en anonyme si auth.json absent → FAILs trompeurs (les header checks échouent sur /login sans message d'auth). install-build.sh en dur `~/work/run44` + :7064 (attendu pour verbatim ; adaptation requise au rejeu).

## Chiffres

| Phase | Scénarios | Occurrences | Règles | Incomplete | Erreurs |
|---|---|---|---|---|---|
| baseline auth (moi :7844) | 51 | 1273 | 18 | 1491 | 0 |
| baseline auth (worker) | 50 | 1218 | 18 | 1457 | 1 (planner) |
| baseline public (moi) | 5 | 73 | 9 | 62 | 0 |
| baseline public (worker) | 5 | 73 | 9 | 62 | 0 |
| final auth (moi :7854) | 51 | **0** | 0 | 1440 | 0 |
| final public (moi) | 5 | **0** | 0 | 64 | 0 |
| install auth (moi :7864) | 51 | **0** | 0 | 1440 | 0 |
| install public (moi) | 5 | **0** | 0 | 64 | 0 |

Sondes incomplets : auth 0 FAIL (774 PASS/180 N-A) ; public 0 FAIL (25/12). verify 21/21, eval 25/25. Sabotage verify/vanilla : 17 FAIL détectés.

**CONFIRMÉ = reproductibilité axe + santé du patch uniquement** (pas une attestation WCAG). Patch propre : 0 rejet, counts exacts, sha256 conforme ; warts qualité W1–W4 à transmettre au fixer, dont W1 (données « Actions » écrites dans les recettes) et W2 (règle CSS morte) à corriger en priorité.
