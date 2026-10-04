# Verdict d'audit indépendant — Boucle continue, cycle 6 (v2)

**Dépôt audité :** TandoorRecipes/recipes
**Commit épinglé :** `7d2e139eec08b3dc720b90fba3fa53811a4c5ebc` (cloné depth-1, HEAD vérifié)
**Artefacts relus :** `titoude/accessibilite-conformite` @ `7c82a061d898402d0933ba1d5329ed81342b6d3c` (branche `devin/boucle-continue`), dossier `boucle-continue/cycles/tandoor/` — artefacts v2 (`patch-v2.diff`, manifest errata, `reports/final-v2-report.*`, `provenance.json.patch_v2`)
**Date des rejeux :** 2026-10-04 — VM auditeur indépendante (Ubuntu, node v24.19.0, axe-core 4.13.0, playwright 1.63.0 — versions identiques à provenance.json)

## Verdict : CONFIRMED (patch-v2)

Historique : le même auditeur a rendu **PARTIAL** sur `patch.diff` (v1) le 2026-10-04 — 8 findings (F1 élevée → F8 info), intégrés par le coordinateur dans `manifest.json.errata`, `patch-v2.diff` et le protocole. Ce document consigne le rejeu indépendant complet de la chaîne v2 : **tous les findings bloquants sont corrigés et le score se reproduit intégralement, y compris `/recipe/2` sur recette réaliste.**

## Chaîne v2 — résultats mesurés

| Vérification | Déclaré | Rejoué (auditeur) | Statut |
|---|---|---|---|
| sha256 `patch-v2.diff` | `c9f7be23e065efd9cd3e67675dffc8b085fddee97b1e3efdbf1129c5d4a1ea98` | identique (fichier + `provenance.json.patch_v2.sha256`) | PASS |
| sha256 manifest / final-v2-report / scope-compare | `0ec38f43…` / `c89f7172…` / `3a5430bc…` (`patch_v2` block) | identiques, recalculés depuis le disque | PASS |
| `git apply patch-v2.diff` sur checkout propre @7d2e139 | — | applique sans rejet : 45 fichiers + `a11yShim.ts` (46 cibles — +IngredientsTable/Row vs v1) | PASS |
| `vue3/ yarn install --frozen-lockfile` + `yarn build` | install-build ok | PASS — 260 entrées precache (5038.38 KiB) | PASS |
| `pip install` amputé + `manage.py check` | PASS | PASS — 0 issue, Django 5.2.16 | PASS |
| Audit final v2 (11 routes + 2 états, storageState, `--wait-for h1 --wait 1200`, **recette avec étape+ingrédient rendus**) | 0 viol / 13 scénarios / 162 inc | **0 violation, 13/13 audités, 0 erreur, 168 incomplete, exit 0** — y compris `/recipe/2` | PASS |
| scopeHash / statesHash recalculés | `02bf0e80de36…071` / `e240f3f338…a266` | identiques | PASS |
| `verify.mjs` (v2) | 15/15 | 15/15 — l'assertion login est désormais réelle | PASS |
| `eval-final.mjs` (v2) | 10/10 | 10/10 — dont `axe /recipe/2` et « tab focus » stabilisé | PASS |
| Login page | 0 | 0 violation | PASS |

## Vérification des correctifs errata (F1–F5 de l'audit v1)

- **F1 (bloquante)** — corrigée honnêtement, vérifiée en DOM : `StepView.vue:13` `:aria-label="$t('Done')"` sur le bouton check d'étape ; `IngredientsTable.vue:37` et `IngredientsTableRow.vue:8` `:aria-label="i.food ? i.food.name : $t('Ingredient')"` — libellé = aliment coché, sémantiquement correct (pas un nom générique). axe `/recipe/2` : 0 violation avec l'ingrédient rendu (avant : button-name + label, critical).
- **F2** — `manifest.json.boot.seed` documente désormais `userspace.user.groups.add('admin')` ET « recette avec ≥1 étape et ≥1 ingrédient lié » + note django_scopes. Le piège du faux-PASS « No Permissions » est documenté dans le manifeste.
- **F3** — `manifest.json.states` corrigé : `["add-menu","user-menu"]`, cohérent avec la carte STATES du runner.
- **F4** — `verify.mjs` : l'assertion tautologique est remplacée par une vraie évaluation (aria-label/aria-labelledby/`label[for]`/`closest('label')` sur chaque input visible). 15/15 rejoué.
- **F5** — `eval-final.mjs` : settle 400 ms + `blur()` + 150 ms entre les Tab — l'assertion clavier passe de façon stable (10/10 rejoué).

## Findings résiduels (non bloquants)

- **R1 — faible** : `patch-v2.diff.sha256` embarque un chemin absolu de la VM du worker (`/home/ubuntu/accessibilite-conformite/...`) — cosmétique ; préférer `sha256sum <file>` relatif.
- **R2 — faible** : `results.json.auditTiers.statut` reste « en attente — verdict à intégrer » alors que `post_audit_v2` documente l'intégration — champ périmé.
- **R3 — info** : incomplete 168 vs 162 déclarés — variance data-dépendante (contenu de recette), triage documenté ; les incomplete ne sont pas des échecs.
- **R4 — info (inchangé de v1)** : `a11yShim.ts` libellés en anglais dur (« Loading », « Open picker », « Upload file », « Calendar ») dans une app i18n ; `.text-disabled` forcé lisible rend les états désactivés indistinguables — choix assumés, non bloquants.

## Revue patch-v2 (delta vs v1)

Diff complet (46 fichiers, 3473 lignes) : v2 = v1 + 3 modifications — les 2 `aria-label` ci-dessus et `en.json` ré-émis (mêmes clés, `Done`/`Ingredient` préexistantes). Aucune nouvelle astuce : toujours zéro `display:none`/`visibility:hidden`/`aria-hidden`/suppression de DOM/timer ajouté. `patch.diff` v1 conservé à côté — traçabilité correcte.

## Conclusion

**CONFIRMED** — la chaîne v2 est intègre et reproductible de bout en bout : hashes exacts, patch sain appliqué sur checkout propre, install-build PASS, **0 violation axe sur les 13 scénarios y compris `/recipe/2` avec une recette rendant étape+ingrédient** (le cas qui avait motivé le PARTIAL), verify 15/15 et eval-final 10/10 rejoués sur les outils corrigés. Les 5 findings de l'audit v1 sont fixés sans contournement. Restent 4 remarques non bloquantes (R1–R4).
