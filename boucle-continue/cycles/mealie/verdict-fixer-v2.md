# Cycle 44 — verdict fixer v2 (mealie @06ccc2b1)

Rôle : fermer les 4 warts W1–W4 du verdict auditeur `0a06379` sans casser le
0-violation confirmé. Toutes les mesures ci-dessous sont **live**, rejouées par
le fixer sur ses propres instances Docker : `:7954` = upstream+patch v2,
`:7944` = vanilla @06ccc2b1.

## W1 — `title:"Actions"` dans les données recette (×11)

Suppression pure : le titre injecté dans les **données** (objets ingredient /
step / note / meal-plan-entry créés par les éditeurs) est retiré des 11 spots
(`RecipePage.vue` ×2, `RecipePageIngredientEditor.vue` ×5,
`RecipePageInstructions.vue` ×2, `RecipeNotes.vue`, `MealPlanAddRecipeDialog.vue`).
`RecipeNotes.vue` n'avait plus aucune différence avec l'amont après retrait →
sorti du patch (115 → 114 fichiers).

Aucun label template requis : le champ titre est un `v-text-field` avec
placeholder (contenu utilisateur, pas un contrôle à nommer). `hasSectionTitle`
accepte désormais `.trim()` — un titre vide ou blanc ne rend pas de `<h3>`.

Preuve live : `M1` aucun h3 de section vide ni « Actions » ; `M2` ingrédients
rendus. **28/28 PASS** dont les deux.

## W2 — `.safe-markdown :deep(a)` CSS morte

Rebranchée sur la vraie classe : `class="safe-markdown"` ajoutée au div racine
de `SafeMarkdown.vue` (le seul composant qui rend le markdown assaini) et la
règle passée en `color-mix(in srgb, secondary 82%, black)` en clair /
`color-mix(in srgb, secondary 45%, white)` en sombre — même motif que le reste
du patch (secondary #973542 = 3.3:1 sur fond sombre, non conforme brut).

Preuve live mesurée (computed style + composite alpha sur pile d'ancêtres) :
`M3` clair ratio + soulignement natif ; `M4` sombre idem. **PASS**.

## W3 — clé i18n incohérente members.vue

Harmonisée : les 4 checkboxes de permission utilisent le pattern amont
`user.user-can-*` (`user-can-manage-household`, `user-can-manage-group`,
`user-can-organize-group-data`, `user-can-invite-other-to-group`) au lieu d'un
mix de clés `household.*`. La colonne `avatar` de la table des membres est
renommée `user.user` (elle affiche les avatars des membres, pas des actions).

Preuve live : `M5` — 8 checkboxes nommées, pattern `Nom — permission` homogène.

## W4 — checks anonymes silencieux verify/eval

`verify.mjs` et `eval-final.mjs` réécrits : chaque check porte un **id stable +
description** (`FAIL [C1] header : contraste titre "Mealie" ≥ 4.5:1
ratio=2.76…`). `S0` = check explicite « session auth disponible » ; si la
session manque, `S0` FAIL et les sections authentifiées émettent `N-A`
(jamais un run anonyme silencieux) ; les checks publics restent exécutés.
Le probe de contraste gère `color(srgb …)` (sérialisation Chromium de
`color-mix()`).

## Rejeu complet

| mesure | :7954 patché v2 | :7944 vanilla |
|---|---|---|
| axe auth (51 scénarios) | **0 règle, 0 occurrence**, 1440 inc | — |
| axe public (5 scénarios) | **0 règle, 0 occurrence**, 64 inc | — |
| verify.mjs | **28/28 PASS** | **20 FAIL** (nommés) |
| eval-final.mjs | **26/26 PASS** | **6 FAIL** (attendus : lang ×4, C1, H2) |

## Artefacts régénérés

- `patch.diff` : `git add -N` (app.vue, error.vue) + `git diff` depuis l'arbre
  **vérifié** ; `git apply --check` OK sur clone vierge @06ccc2b1 ;
  **114 fichiers, +504/−206** ; sha256
  `4eb45f9087b4ae62b4fcdda57ce8e2fdfcc729c3034e2158e30b58b4acff6035`
  (sidecar `patch.diff.sha256`).
- `manifest.json` / `results.json` : comptes régénérés depuis le diff final
  (leçon 39) ; bloc `fixer_v2` ajouté.
- `reports/fixer-v2-auth` + `reports/fixer-v2-public` : résultats du re-scan.
- `provenance.json` : re-hachée `--strict` en dernier.
