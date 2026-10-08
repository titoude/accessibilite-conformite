# Cycle 44 — verdict auditeur v2 (mealie @06ccc2b1)

Rôle : rejouer **en zéro confiance** les claims du fixer v2 (fermeture warts
W1–W4 du verdict `0a06379`) — mes instances, mes ports, mes données.

Verdict : **CONFIRMED** — les 4 warts sont fermés et tous les chiffres
reproduisent à l'unité près. **1 wart nouveau (W5)** détecté à la chasse,
non bloquant pour la reproductibilité axe (0 violation conservée partout)
mais régression visible introduite par le patch v2.

## Environnement auditeur (indépendant)

| Instance | Port | Image | Données |
|---|---|---|---|
| patchée | :8154 | mealie-av2:patched | seed propre (shareToken 85d7081a, recipes UUIDs propres) |
| vanilla | :8144 | mealie-av2:vanilla | seed propre (shareToken fa6c99d2) |
| install | :8164 | mealie-av2:install | install-build.sh verbatim + seed |

Sources : clone vierge @`06ccc2b1a6eef90dece7cfcd5aa48e140f544bf9` ;
`git apply --check` patch.diff → **0 rejet** ; sha256 recalculé =
`4eb45f9087b4ae62b4fcdda57ce8e2fdfcc729c3034e2158e30b58b4acff6035` conforme ;
comptes recomptés par parsing du diff final = **114 fichiers, +504/−206** —
conformes au manifeste (comptés à la main : `git apply --stat` bugge sur
git 2.34.1 et affiche "0 files changed").

## Rejeu des claims

**Rescan patchée :8154** — 51 auth + 5 public scénarios, axe-core 4.14.0 :
**0 violation / 0 erreur** sur les 56. Incomplets : **1440 auth + 64 public,
exactement les chiffres fixer**. Sondes incompletes rejouées live : 954
nœuds non-états revisités → **769 PASS, 185 N-A** (hidden/not-found/disabled
exempt 1.4.3), **0 FAIL** — rien de cassé dans le bucket incomplet ; les 4
target-size restants vivent sur pages d'état (exclusion par design).

**Install-build verbatim :8164** — même Dockerfile multi-stage amont, image
reconstruite sans la moindre modif : 51 auth + 5 public → **0 viol / 0 err,
1440+64 inc identiques**. Transportabilité prouvée.

**Baseline vanilla :8144** — auth **1275 occ / 16 règles**, public **73 occ /
9 règles** — quasi identique à l'audit v1 (1273/18r, 73/9r ; Δ 2 occ =
données indépendantes). **Pureté prouvée** (leçon 40) : 4 marqueurs
patch-spécifiques (`safe-markdown`, règle `v-tooltip:not(.v-overlay--active)`,
`Mealie home`/`Toggle navigation`, `color-mix(...v-theme-*)`) = **0 fichier
dans le dist servi par vanilla**, tous présents dans le dist patché. Vanilla
n'a pas fugué du patch.

## W1 — `title:"Actions"` : FERMÉ

- Patch : 0 `title:"Actions"` ajouté/restant ; les 11 spots données sont
  revenus à l'amont (`title: ""`→ mais recontextualisé : les colonnes de
  table actions reçoivent `i18n.t("general.actions")` dans les **defs de
  colonnes** — titre là où il doit vivre, pas injecté dans les sections
  recette). `hasSectionTitle` accepte `.trim()`.
- `RecipeNotes.vue` : **0 occurrence dans le patch** → revenu amont. ✔
- Sonde live éditeur recette : 0 h3/h4 vide ou "Actions" ; **9 inputs
  visibles + 12 boutons icône, 100% nommés** — pas de régression nom-vide.

## W2 — `.safe-markdown` : FERMÉ

55 éléments `.safe-markdown` réellement rendus. Mesures **pixel-vrai** à
moi (couleur computed CSS4 `color(srgb …)` + composite alpha ancêtres) :

| Thème | Liens | Ratio mesuré | Claim fixer | Souligné |
|---|---|---|---|---|
| clair | 2 | **9.31:1** | 9.3:1 | oui |
| sombre | 2 | **7.60:1** | 7.8:1 | oui |

Le claim sombre surestime légèrement (7.8 vs 7.60 mesuré sur le fond carte
réel rgb(30,30,30)) — les deux restent largement ≥4.5, non bloquant.

## W3 — members.vue : FERMÉ

8 checkboxes live, toutes nommées pattern homogène
`"{fullName} — {permission}"` avec les **vrais textes amont**
("User can manage group settings", …) — clés `user.user-can-*` ×4 + avatar
`user.user` vérifiées présentes dans `en-US.json` upstream. 0 clé inventée.
Headers table non vides ("User" sur la colonne avatar).

## W4 — checks nommés : FERMÉ

- `verify.mjs` patchée : **28/28 PASS** dont M1–M5.
- `eval-final.mjs` patchée : **26/26 PASS**.
- Vanilla : verify **8/28 (20 FAIL)**, eval **20/26 (6 FAIL)** — attendus,
  checks discriminants (M3/M4/M5 FAIL en vanilla = les règles mesurent
  réellement le patch).
- Sabotage : `seed-env.json.shoppingListId` cassé → **exactement 1 FAIL
  nommé** `[I1] shopping : 0 checkbox` — la liaison fixture→check dit QUOI
  a cassé.

## Provenance / registre

`rehash-provenance.py cycles/mealie --strict` → **48/48 OK**, spot-check
3/3, exit 0. `REGISTRE.md` ligne 44 présente et fidèle.

## Chasse — wart nouveau

**W5 (mineur) — slug i18n brut rendu dans LanguageDialog** (leçon 43
franchie) : le patch v2 ajoute `:label="$t('language-dialog.select-language')"`
sur l'autocomplete, mais la clé vit sous `data-pages.select-language`
("Select Language") — la section `language-dialog` n'a pas de sous-clé
`select-language`. En direct : le dialog rend le **slug brut**
`language-dialog.select-language` (×2 labels). Même classe de défaut que
K1/kavita. Latent : `RecipeLastMade.vue` ajoute
`:aria-label="childRecipe.name || $t('recipe.recipe')"` — `recipe.recipe`
n'existe pas non plus ; le fallback slug ne tire que si `childRecipe.name`
est vide (non observé live). Aucune violation axe associée (cohérence
label/nom) → reproductibilité 0-viol intacte, mais **régression visible
introduite par le patch** : label anglais "Select Language" remplacé par un
slug technique.

Autres écarts mineurs (documentation) : manifeste annonce "40 routes auth",
`urls-auth.txt` en contient 41 — écart de doc, pas de produit.

## Chiffres

| Métrique | Fixer v2 | Auditeur v2 | Verdict |
|---|---|---|---|
| Patch | sha256 4eb45f90, 114f +504/−206 | idem recompté | ✔ |
| Patché auth/public | 0 viol (1440+64 inc) | 0 viol (1440+64 inc) | ✔ exact |
| Install verbatim | 0 viol | 0 viol (1440+64 inc) | ✔ exact |
| Vanilla auth | — | 1275 occ/16r | ~v1 (Δ données) |
| Vanilla public | — | 73 occ/9r | = v1 |
| verify / eval | 28/28, 26/26 | 28/28, 26/26 | ✔ |
| vanilla verify/eval | 20+6 FAIL | 20+6 FAIL nommés | ✔ |
| provenance --strict | 48/48 | 48/48 | ✔ |

**CONFIRMED** — warts W1–W4 fermés, scores et santé patch reproductibles.
W5 journalisé pour le prochain fixer (corriger la clé en
`data-pages.select-language` ou créer la clé `language-dialog.select-language`;
idem `recipe.recipe`).

— auditeur v2 indépendant, ports :8144/:8154/:8164, données propres.
