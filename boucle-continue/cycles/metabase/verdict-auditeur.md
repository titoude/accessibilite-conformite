# Verdict auditeur — cycle 46 metabase/metabase

Auditeur : session indépendante (zéro confiance) — ports :8400 (patché) / :8401 (vanilla) / :8403 (install-build), données + seed rejoués sur H2 fraîches.

**Verdict : CONFIRMED** — le résultat 0 violation est réel, rejouable verbatim, et les fixes sont éprouvés live. Le chiffre de baseline « 400 » est sous-estimé : le vrai baseline à périmètre égal est ~502 (W1). Rien de falsifié ; une flake kbar et 2 résiduels hors-scope documentés.

## Rejeu — ce qui a été refait à la main

| Étape | Attendu | Obtenu | Verdict |
|---|---|---|---|
| clone @8119146 + `git apply --check` | 0 rejet | 0 rejet (1 warn whitespace documenté) | OK |
| sha256 patch.diff | `0477fcb5…6d9c` | identique | OK |
| comptes patch | 72f +612/−211 | exact (72 fichiers tsx/ts/css, **0 cljs**) | OK |
| install-build verbatim (clone vierge → apply → build cljs+jss → boot :8403 → /api/setup + seed → rescan) | 0/0/0 | admin 0v/0e/131i, public 0v/0e/1i | OK |
| setup+seed H2 fraîche | ids identiques | collection 6, cards 40/41/42, dashboard 2 — rejoués, pas sauté | OK |
| vanilla :8401 (scan verbatim urls corrigés) | ~400 | **502 occ / 23 règles** | voir W1 |
| patché :8400 | 0/0/0 | admin 0, public 0, states **1 occ transitoire** (voir F-flake) | OK* |
| verify.mjs | 16/16 | 16/16 (×2 : avant et après sabotage/restauration) | OK |
| eval-final.mjs | 8/8 | 8/8 | OK |
| sondes incomplets | 0 NC | 261 sondes : 42 conformes, **0 NON CONFORMES**, 115 non retrouvées | OK |
| type-check | 0 err | 0 err (nécessite `build-pure:cljs` → `target/cljs_dev`, pas la copie release) | OK |
| sabotage | FAIL nommé | undo-list rendue `ul` → `FAIL home: undo-list` explicite, exit 1, PUIS 16/16 après restauration | OK (liaison L42 éprouvée) |
| provenance --strict | 66/66 | 66/66 + spot-check 3/3 | OK |
| REGISTRE ligne 46 | présente | présente | OK |

## Éprouvé live (pas seulement dans le diff)

- **Sentinelles Mantine** : verify confirme `role=separator` non focusables (`tabindex` retiré) sur menu ouvert.
- **Portails peuplés** : 3 overlays → `complementary` avec labels uniques « Overlay 1/2/3 » (verify) — `landmark-unique` résolu.
- **aria cloné sur targets sans rôle** : nettoyé (`/account` 0/4 orphelins, rowcount sans aria-controls, tabs OK).
- **ClausePopover / DnD** : `question-notebook-editor` state = 0 occ sur patché vs 9 règles / 25 occ vanilla — nested-interactive éliminé (vanilla en comptait 15 en states).
- **kbar** : li[role=option] neutralisés — nav-search-palette 0 à froid sur rejeu.
- **2.5.3 label-content-name** : `Metabase Admin` ⊇ visible — 0 violation axe sur tout l'admin (vanilla : 12 occ).
- **i18n anti-slug (L43)** : tous les aria-label ajoutés passent par `t`` (gettext) ; seul « Overlay N » est généré (nom technique, acceptable).
- **Pureté vanilla (L40)** : frontend vanilla sans patch prouvé par comptes par-page IDENTIQUES au baseline worker là où le scope coïncide (/, browse/* 26–30, search 61, collection 27, account 28…) + markers absents + jar = v0.64.1.1 (écart backend honnête, documenté).
- **cljs** : contrairement à la note worker (« box=JDK17 »), JDK21 disponible sous `~/opt/jdk21` → `build-release:cljs` (257 fichiers) et `build-pure:cljs` (492) rejoués réellement, 0 warning. La copie cljs_release fonctionne aussi (prouvée par boot patché fonctionnel).

## Écarts / warts

- **W1 — baseline sous-compté (chiffre du claim inexact, sens favorable)** : le rapport baseline livré a tourné avec des URLs/états pré-corrigés : `question/40`, `question/new`, `admin/settings` sans slug → 3 erreurs « document final diffère » ; `nav-mobile-sidebar-390` timeout + 3 états à URLs déréférencées → 4 états non audités. Le « 400 occ/20 règles » couvre donc **moins** de surface que le final 25 scénarios. Rejeu baseline à scope corrigé : **502 occ / 23 règles** (admin 333, states 165, public 4). Chaque page commune est bit-identique au baseline worker → la correction honnête est **~502→0**, pas 400→0.
- **F-flake — kbar aria-valid-attr-value transitoire sur patché** : un run a capturé `aria-controls="kbar-listbox"` + `aria-activedescendant="kbar-listbox-item-0"` pendantes à un instant où la listbox est démontée (1 occ, critical). Rejeu du même état : 0. Présent aussi dans les retries du worker (admin-retry/states-retry). Bug de timing amont/patch résiduel — classe connue, non déterministe ; recommandé : masquer ces refs tant que la listbox est absente, ou runx3 dans le runner.
- **Résiduels hors-scope (pré-existants, pas introduits)** : `/question/42` native SQL + `/notebook` : `color-contrast` sur « Explore results » (serious) ; `/browse/metrics` : `empty-table-header` (minor). Vanilla = 46 occ sur ces 2 pages → patché en laisse 2. `/admin/troubleshooting{,/logs}`, `/admin/embedding/in-apps`, `/dataset`, card chart `/question/43` : 0.
- **Aucune violation introduite** par le patch (axe 4.14.0 identique au worker — vérifié `axe-core@4.14.0`).

## Détails runtime

- Docker `metabase/metabase:v0.64.1.x` (jar v0.64.1.1, md5 a6f06e4f…), `-cp /patched:/app/metabase.jar`, entrypoint java — reproduit.
- axe 4.14.0, Playwright chromium-headless-shell v1243 (téléchargé — cache box avait 1248).
- Mes rapports : `~/work/run46/reports-{v,p,i}` (audit: scope comparable sauf W1 ; les .json détaillent chaque nœud).

## Recommandations

1. Corriger `results.json`/manifest : baseline réel ~502/23 (ou recalculer avec scopeHash apparié).
2. Traiter la flake kbar (refs pendantes transitoires) — soit fix produit, soit runner tolérant avec preuve n×.
3. Hors-scope à mettre au backlog : « Explore results » contraste + `empty-table-header` /browse/metrics.
