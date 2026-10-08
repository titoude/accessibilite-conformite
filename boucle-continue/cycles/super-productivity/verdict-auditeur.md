# Verdict auditeur — cycle 51 johannesjo/super-productivity @71eb7780 (v19.1.0)

**Verdict : CONFIRMED** — la chaîne complète se reproduit sur environnement et données indépendants : patch sain (sha256 conforme, `git apply --check` 0 rejet, 54 fichiers +227/−86 recomptés), install-build verbatim rejoué à 0 violation / 0 erreur sur 34 scénarios, baseline vanilla à 16 règles / 732 occurrences (attendu ~740 hors fixture `#/contrast-test`, delta expliqué règle par règle), verify 39/39 et 14 FAIL vanilla nommés identiques, eval 8/8, sabotage 4/4, sondes 0 non-conforme, provenance 56/56. Ceci mesure la reproductibilité du score axe et la santé du patch, pas la conformité WCAG complète (périmètre wcag2a/2aa/21a/21aa/22aa + best-practice, 550 résultats `incomplete` sondés 0 NC).

Auditeur : session indépendante (devin-ffd920261bf84a62855f3c51003c021f), clone upstream frais @71eb7780bcf5d6b1dfdcd39a8a8265547d040760, ports :9271 (patché) / :9272 (vanilla) / :9273 (install-build), seeds régénérés par seed.mjs (ids propres à l'audit), aucun artefact d'exécution du worker réutilisé.

## Méthode de rejeu

- `git clone` upstream → `checkout 71eb7780` → `sha256sum patch.diff` + `git apply --check` puis `git apply` : 0 rejet, 3 avertissements de whitespace en fin de ligne (hunks inline-markdown, cosmétique).
- `npm ci` (1899 paquets, node 22.18.0 via nvm) → `GITHUB_SHA=<sha> node tools/git-version.js && node tools/load-env.js --ensure && npx ng build --configuration stage` → servi par `http-server` avec `--proxy` (hash router).
- `seed.mjs` rejoué sur chaque instance (2 projets, 2 tags, 9 tâches, ids résolus depuis les ops IndexedDB) ; `gen-urls.mjs` reconstruit sur mes ids.
- `audit.mjs` rejoué verbatim (`--urls` virgules, `--states all`, `--profile` persistant) sur vanilla, patché, et sur un second clone install-build vierge servi :9273.
- `verify.mjs` / `eval-final.mjs` / `sabotage.mjs` rejoués sur :9271 (patché) et :9272 (vanilla) ; `incomplete-probes.mjs` rejoué sur mon propre rescan patché (548 sondes).
- `provenance.json` : 56 sha256 revérifiés un par un depuis le disque.

## Résultats du rejeu

| Étape | Livré | Rejoué | Verdict |
|---|---|---|---|
| patch.diff sha256 | `53f13af6…247e` | identique au sidecar | OK |
| `git apply --check` / apply | propre | 0 rejet, 3 warnings whitespace | OK |
| Compte fichiers (leçon 39) | 54 f, +227/−86 | **identique** recompté depuis le diff | OK |
| Baseline vanilla (leçon 40) | 777 occ / 16 règles / 0 err / 35 scénarios | **732 occ / 16 règles / 0 err / 34 scénarios** | OK — delta +37 = la page `#/contrast-test` absente de mon urls.txt (button-name +15, aria-required-parent +14, color-contrast +9…) ; les 16 règles et leur distribution coïncident |
| Rescan patché | 0 viol / 0 err, 34 scénarios | **0 viol / 0 err, 34 scénarios**, 550 incomplets | OK |
| Install-build verbatim | 0 viol / 0 err | **0 viol / 0 err**, 34 scénarios, clone vierge + seed frais :9273 | OK |
| Skips silencieux (leçon 45) | 0 | **34/34 scénarios avec résultat axe** dans mes deux runs | OK |
| Exclusion `#/contrast-test` | documentée | composant dev dédié (`pages/contrast-test`, routé), qui affiche volontairement des paires non conformes — 37 occ de baseline ; exclusion tracée dans `scope-compare.json`, `gen-urls.mjs` et le manifest | OK — exclusion légitime et justifiée |
| verify.mjs patché | 39/39 | **39/39** | OK |
| verify.mjs vanilla | ~14 FAIL | **25 PASS / 14 FAIL**, mêmes libellés (overlay region/aria-label, nav roles, resize-handle, add-task-bar role=search + textarea, menuitem, daily-summary h2/contraste, th vides…) | OK |
| eval-final.mjs | 8/8 | **8/8**, 1 N-A (skip-link absent du produit) | OK |
| sabotage.mjs | 4/4 | **4/4** (lang, tabindex=-1, boutons anonymisés, role=list retiré) | OK |
| incomplete-probes | 546 → 442P / 0 NC / 106 N-R | **548 → 534P / 0 NC / 16 N-R** | OK — les N-R sont des sélecteurs transitoires : 97/106 chez le worker portent `routerlinkactive="active"` + `_ngcontent-*` (état expanded/actif du nav au moment du scan, absent à la sonde) ; reste = overlays `cdk-overlay-*`/focus-trap fermés. Justifié, pas de dissimulation. 0 non-conforme des deux côtés |
| provenance --strict | 56 fichiers | **56/56 sha256 conformes** (2 premiers mismatches causés par MES runs écrasant `seed-info.json`/`urls.txt` ; restaurés par `git checkout` → 56/56) | OK |

## Chasse aux violations introduites et au hors-scope

- **WCAG 2.5.3 (label-content-name-mismatch)** : le tag `wcag21a` est dans `RULE_TAGS`, donc la règle était active au rescan — 0 violation. Statique : les ~30 aria-labels ajoutés portent sur des boutons icône sans texte visible (règle vacuë) ; les `mat-tab` config/boards ont `aria-label` = même clé i18n que le `labelKey` rendu ; les aria-labels de `evaluation-sheet` sont sur des `<div>` sans rôle, hors champ de la règle (axe-blind, voir warts).
- **Slugs i18n (leçon 43)** : les 6 clés ajoutées (`F.WORKLOG.CMP.DAY`, `F.WORKLOG.CMP.DAY_DETAILS`, `G.CUSTOM_COLOR`, `MH.QUICK_ACTIONS`, `PDS.WORK_START`, `PDS.WORK_END`) se résolvent dans `dist/assets/i18n/en.json` ; 0 clé brute `X.Y.Z` dans les nœuds scannés.
- **Rôles implicites Material** : 0 `aria-required-parent` au rescan, y compris l'état `task-context-menu` (les `role="menuitem"` de `.quick-access` vivent sous `role="group"` dans le `mat-menu-panel` — parent valide pour axe).
- **Cohérence artefacts↔seed (leçon 46)** : le `urls.txt` commité contient les 4 ids exacts du `seed-info.json` commité.
- **Changement fonctionnel** `textarea → input[type=text]` (add-task-bar) : validé en pratique — seed.mjs a créé 9 tâches via `.main-input` sur les trois instances.
- **Hors-scope résiduel** : aucun ; surfaces explicitement exclues (Electron, sync providers, dialogs Jira/GitLab, canvas D3) non auditables dans une PWA statique — déclaration cohérente avec le produit.

## Warts (immatériels, nouveaux)

1. Quatre aria-labels en anglais en dur au lieu de clés i18n : `"Overlays"` (app.component), `"Resize sidenav"` (magic-side-nav), `"Remove daily summary note"` et `"Add a custom text block to describe your day end routine"` (daily-summary). Incohérent avec la convention du patch (t.const.ts + en.json ailleurs) ; visible en locale non anglaise.
2. `#/tag/INBOX/tasks` redirige vers `#/tag/TODAY/history` — comportement produit reproduit identiquement chez le worker et chez moi. Le scénario scanne une vraie page (axe exécuté sur la cible finale) donc ce n'est pas un skip silencieux, mais il duplique la couverture de `history` et le « INBOX » visé n'existe pas comme route.
3. Le `verdict-worker.md` écrit `--ink-muted 0.78→0.82` alors que le diff montre `0.66→0.82` (light) et `0.65→0.8` (dark) — imprécision narrative, valeurs du patch correctes.
4. Aria-labels `evaluation-sheet` sur `<div>` : inertes pour axe — décoratifs, pas nuisibles.

## Limites du verdict

Périmètre axe seul (tags ci-dessus, axe 4.14.0). Les 550 résultats `incomplete` (color-contrast composites, target-size…) sont sondés 0 non-conforme mais restent des indéterminés axe par nature. Surfaces natives/Electron, synchronisation et canvas hors champ.
