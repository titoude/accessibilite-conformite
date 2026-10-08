# Verdict fixer v2 — cycle 51 johannesjo/super-productivity @71eb7780 (v19.1.0)

**Verdict : LIVRÉ** — les 4 warts de `verdict-auditeur.md` (CONFIRMED `d0a1b78`) sont fermés dans les **vraies sources** (`src/app`, `src/assets`), le patch est régénéré depuis l'arbre patché+vérifié, la chaîne complète est rejouée sur mes instances : **0 violation / 0 erreur**, `verify.mjs` **45/45** (39 assertions d'origine + 6 sondes anti-slug i18n), `eval-final` **8/8** (1 N-A skip-link), `sabotage` **4/4** FAIL nommés.

- Produit : `71eb7780bcf5d6b1dfdcd39a8a8265547d040760` (clone vierge + patch appliqué proprement)
- `patch.diff` régénéré : sha256 `65a524681cd099a04b61dbcf23449fd542ac1e03757cfb7ff21be81d615878c6` (sidecar `patch.diff.sha256` resynchronisé), 54 fichiers **+241/−89**, `git apply --check` 0 rejet sur clone vierge @SHA
- Environnement fixer : node 24.19.0 (worker : 22.18.0 — note manifeste), `npm ci`, build `stage`, `http-server` **:9281**, profil `patched-profile`, seed frais (2 projets / 2 tags / 9 tâches, ids régénérés)

## W1 — aria-labels hardcodés EN → clés i18n réelles résolues

| Libellé | Clé | Chemin de rendu |
|---|---|---|
| « Overlays » (overlay container, app.component) | `G.OVERLAYS` = "Overlays" | `_translateService.stream()` dans `_subs` (constructor DOM obligatoire : l'attribut doit exister avant la première ouverture d'overlay ; `stream()` re-résout à chaque changement de locale, `instant()` trop tôt pouvait rendre le slug) |
| « Resize sidenav » (resize-handle) | `MH.RESIZE_SIDENAV` = "Resize sidenav" | `[attr.aria-label]="… \| translate"` |
| « Remove daily summary note » | `PDS.REMOVE_DAILY_SUMMARY_NOTE` | idem (basculé en `[attr.]`) |
| « Add a custom text block… » | `PDS.ADD_CUSTOM_TEXT_BLOCK` | `aria-label` statique → `[attr.aria-label]="… \| translate"` |

- `t.const.ts` régénéré via `tools/extract-i18n.js` (script propriétaire) — les 4 clés présentes ; `en.json` seul modifié (règle i18n du produit). `checkFile` vert sur les 4 fichiers touchés.
- **Sonde anti-slug (leçon 43)** : `verify.mjs` étendu — fetch `assets/i18n/en.json` servi par l'instance, assertion d'**égalité exacte** entre aria-labels rendus et valeurs en.json (pas un « non-vide »), sweep « aucun aria-label ne ressemble à une clé `X.Y.Z` », et **bascule réelle** du bouton note daily-summary (add ⇄ remove) pour exercer les deux branches du `@if` puis restauration. 6 assertions nouvelles : 45/45.

## W2 — prose `--ink-muted` corrigée

`verdict-worker.md` disait « 0.78→0.82 » ; le diff réel est `rgba(44,44,44,0.66)→0.82` (clair) et `rgba(235,235,235,0.65)→0.8` (sombre) dans `_css-variables.scss`. Doc corrigée aux valeurs du diff.

## W3 — aria-labels evaluation-sheet sur `<div>` (axe-blind)

Les 3 cibles (`daily-state-label`, 2 `.label`) ont le rôle **générique** — ARIA interdit le nommage, l'attribut était inerte. Retirés des sources : l'information reste portée par le texte visible + `matTooltip` (inchangés). Pas de déplacement : aucun ancêtre nommable pertinent.

## W4 — `#/tag/INBOX/tasks` dupliquée

`INBOX` n'est pas un tag : `ValidTagIdGuard` redirigeait (couverture doublée). Inbox est le **projet** `INBOX_PROJECT` → remplacée par `#/project/INBOX_PROJECT/tasks` dans `gen-urls.mjs`, `urls.txt` régénéré (21 URLs) et `seed.mjs` (2 occurrences). Route réelle distincte scannée.

## Chiffres

| Étape | Résultat |
|---|---|
| Rescan patché :9281 (21 routes + 13 états) | **0 violation / 0 erreur**, 34 scénarios, 556 incomplets |
| `verify.mjs` patché | **45/45** (0 FAIL, 0 N-A) — dont 6 sondes i18n anti-slug |
| `eval-final.mjs` | **8/8**, 1 N-A (skip-link non fourni par le produit) |
| `sabotage.mjs` | **4/4** détections nommées |
| `incomplete-probes.mjs` sur mon rescan | 554 sondes → **508 conformes / 0 NC / 48 N-R** (état mobile-menu-390 non rejoué à la sonde = click timeout, sélecteurs transitoires nav) |
| `patch.diff` | sha256 `65a52468…878c6`, `git apply --check` OK |

Fixer : devin-687cd898647a4183bd5277c545ceb448, 2026-10-08.
