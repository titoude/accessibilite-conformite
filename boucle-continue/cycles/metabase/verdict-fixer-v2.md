# Verdict fixer-v2 — cycle 46 metabase @811914645ddf

**Verdict : warts fermés, claims corrigés, rejeu complet 0 violation sur périmètre étendu.**

Cycle : `titoude/accessibilite-conformite`, branche `devin/boucle-continue`.
Référence auditeur : `verdict-auditeur.md` (CONFIRMED + W1 + flake kbar + 2 résiduels hors-scope).
Session fixer : `devin-96b2b42eda9148b69349a725a8683bb6`.

## Résumé des changements de cette passe

- **W1 (leçon 45) — baseline rejouée complète, 0 skip silencieux** : rejeu vanilla
  :8801 sur l'intégralité du périmètre déclaré **étendu** (17 urls admin incluant
  `/browse/metrics` + `/question/42-b46-commandes-par-mois-sql` + 2 publics +
  8 états + base = 28 scénarios) → **28/28 audités, 0 erreur, 552 occurrences /
  23 règles uniques**. L'ancien claim « 400 » (296+4+100) était sous-compté :
  3 urls + 4 états + `/setup` échouaient en redirects/timeout et étaient omis.
  Le rejeu prouve que chaque scénario précédemment sauté s'audit désormais
  proprement avec les urls sluggées corrigées (tools/ déjà fixés par le worker
  pour son `final`, réutilisés ici à l'identique). Toute différence résiduelle
  552 vs ~502 vient de l'élargissement de scope (les 2 urls ajoutées portent
  ~46 occ sur vanilla) + dérive dynamique mineure.
- **Outillage (leçon 45)** : nouveau `tools/aggregate-results.mjs` — écrit dans
  `results.json` la liste nominative `skipped[]` des scénarios sautés avec la
  raison (jamais vide silencieuse : `[]` explicite quand tout passe), plus les
  compteurs `scenarios/audited/errors` par run.
- **Flake kbar — corrigé dans les vraies sources** : `HydratedKBarSearch.tsx`
  fork localement le `<input>` de `KBarSearch` (le même patron que le fork
  `PaletteResultsList`/`KBarResults` existant). Amont émettait
  `role="combobox"` + `aria-controls="kbar-listbox"` +
  `aria-activedescendant="kbar-listbox-item-N"` inconditionnellement — pendant
  les états skeleton/vide/transition la listbox et l'item référencés étaient
  absents → `aria-valid-attr-value` critique (reproduit 3/3 échantillons sur
  vanilla à t+800 ms). Le fork n'émet les refs que lorsque les cibles existent
  réellement dans le document (MutationObserver + subscription `activeIndex`/
  `visualState`) ; sans listbox le champ est un input simple (le rôle combobox
  exige `aria-controls` résoluble — supprimer le rôle quand le popup n'existe
  pas). + `PaletteResultsList.tsx` : `aria-label` sur la listbox amont sans nom
  (`aria-input-field-name` aurait flagué dès que la listbox rend). Sonde live
  : **5/5 échantillons 0 violation** sur :8800 vs **3/3 `aria-valid-attr-value`
  critical** sur :8801 vanilla à fenêtre égale.
- **Résiduels hors-scope — corrigés + scope étendu** :
  - `ViewButton.module.css` : texte `--view-button-color` (#509ee2) sur fond
    teinté 20 % échouait 4.5:1 → `color-mix(black 40%)` sur le label des
    variantes non-actives (« Explore results » question native + /notebook
    mesurés 0 viol).
  - `MetricsTable.tsx` : le `ColumnHeader` de colonne menu rendait `<th>` vide
    → `aria-hidden="true"` (convention identique aux 3 headers déjà corrigés
    dans `Columns.tsx` par le patch d'origine).
  - Les 2 urls ajoutées à `tools/urls-admin.txt` + `manifest.json scope` —
    auditées dans toutes les runs ci-dessous.

## Rejeu complet (fixer-v2, ports :88xx)

| Cible | Port | Résultat |
|---|---|---|
| vanilla @8119146 | :8801 | baseline **28/28 audités, 552 occ / 23 règles, 0 skip** |
| patché (SHA + patch.diff v2) | :8800 | final **28/28, 0 occ / 0 err**, 45 incomplets |
| install-build (worktree vierge + git apply + build) | :8802 | **28/28, 0 occ / 0 err** |

Gates : `verify` 16/16 OK · `eval-final` 8/8 OK · `incomplete-probes` 0 NC ·
`git apply --check` OK (warning trailing-whitespace l.227, pré-existant).

## Artefacts

- `patch.diff` régénéré : **75 fichiers, +725/−214**, sha256
  `76ffdb6b28edf88084cc4377e0d87e8834a6263df0ac683f3f506273c9692995`
  (sidecar `patch.diff.sha256` régénéré).
- Delta vs patch livré (+612/−211, 72f) : +3 fichiers fixer (HydratedKBarSearch,
  PaletteResultsList, MetricsTable) et +1 hunk ViewButton.module.css —
  `markMantineFocusSentinels.ts` inchangé net après essai/revert d'un cleanup
  générique d'idrefs (il masquait des refs légitimes re-montées : leçon
  appliquée — fixer dans les sources, pas dans l'observer).
- `results.json` : chiffres réels rejoués (baseline 552/23, final 0, IB 0),
  `skipped[]` nominatif par run, `notes_fixer_v2`.
- `manifest.json` : scope admin 15→17 urls + `scope_fixer_v2` documenté.
- `tools/state-admin-8801.json` : nouvel artefact (state vanilla replay).

## Known-flakes / hors-scope

- Aucun connu sur le périmètre déclaré : la seule occurence transitoire
  (`aria-valid-attr-value` kbar) est maintenant couverte par construction.
- `incomplete` axe (45 sur final) : probes vérifiées 0 non conforme.
