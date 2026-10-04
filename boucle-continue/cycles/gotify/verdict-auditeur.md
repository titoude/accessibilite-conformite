# Verdict auditeur — cycle 15 gotify/server

**Verdict : PARTIAL** — le score axe et toute la chaîne se reproduisent à l'identique sous le seed livré, le patch est sain et les correctifs sont réels ; MAIS un défaut résiduel réel existe (liens de contenu de message `#ff7f50`, 2.49:1) que le « 0 violation » n'annonce pas et que le seed « markdown » non spécifié littéralement ne couvre pas. Ceci n'affirme PAS la conformité WCAG complète : périmètre axe seul (wcag2a/aa + best-practice) et 14 résultats `incomplete` non résolus restent à revue humaine.

Auditeur : session indépendante (devin-4ab8a0e249a04135a3123481dddd198f), VM neuve, clone upstream frais, rejeu complet sans réutilisation des artefacts du worker.

## Méthode de rejeu (indépendante)

- Clone frais `github.com/gotify/server`, checkout du commit épinglé `f77d8a0ce8973aa3612b4e04f6b965794a2a51c5` (« Merge pull request #1060 »).
- `git apply --check` puis `git apply` du `patch.diff` livré → propre, 26 fichiers, +225/−82, dont les 2 nouveaux fichiers (`common/popupContainer.ts`, `common/visuallyHidden.ts`) présents dans le diff.
- `cd ui && yarn install --frozen-lockfile` (26 s, yarn 1.22.22, node v24.19.0) + `yarn build` (tsc + vite → `ui/build`) + `go build` (go 1.26.0 installé dans `~/goroot`, comme annoncé par les boot.notes) → tout exit 0. Binaire patché 62 411 208 octets (livré : 62 411 176 — même ordre, métadonnées de build non déterministes).
- Binaire vanilla construit avant patchage (`gotify-baseline`) pour rejouer la baseline sur la même arborescence.
- Boot selon manifest : `GOTIFY_SERVER_PORT=8095 GOTIFY_SERVER_LISTENADDR=127.0.0.1 GOTIFY_DATABASE_CONNECTION=<dir>/gotify.db GOTIFY_UPLOADEDIMAGESDIR=<dir>/images GOTIFY_PLUGINSDIR=<dir>/plugins GOTIFY_REGISTRATION=true GOTIFY_DEFAULTUSER_NAME=admin GOTIFY_DEFAULTUSER_PASS=<pass> ./gotify serve`.
- Seed reproduit par API : `POST /user` bob non-admin (id=2) ; `node tools/login.mjs` (client `devin-audit` purgé puis créé → id=1) ; `POST /application` « Monitoring » (id=1, image `static/defaultapp.png`) ; `POST /client` « Firefox-Desktop » (**id=2**, comme documenté) ; `POST /message` ×2 (texte plein, puis markdown `priority 8` via `extras.client::display.contentType`).
- `audit.mjs` rejoué avec les `auditCommands` verbatim (mêmes `--urls`, `--states`, `--wait-for '#main-content'`, `--wait 1500`, `--storage-state`), baseline sans `--wait-for`/`--wait` (conformément à l'écart déclaré).

## Résultats du rejeu

| Étape | Livré | Rejoué | Verdict |
|---|---|---|---|
| provenance.json (sha256) | 237 entrées | **24/24 fichiers livrés conformes** ; 213 entrées = fichiers worker-side (`node_modules`, `auth.json`, sorties `a11y-audit`) non livrés/non vérifiables | OK fichiers livrés (F5) |
| patch.diff sha256 | `657c091d…` | `657c091d…` + `.sha256` concordant | OK |
| baseline app | 75 occ / 13 règles | **82 occ / 13 règles** | OK modulo F1+transitoires — distribution identique sauf `color-contrast` (2 livré vs 9 rejoué : +6 liens markdown de MON seed F1, +1 `#delete-all` transitoire documenté) |
| baseline login | 4 occ / 4 règles | 5 occ / 5 règles | OK — +1 `.MuiButton-sizeLarge` transitoire (même classe documentée) |
| final app (seed livré équivalent) | 0 occ / 0 règle / 0 err, 9 inc | **0 / 0 / 0 err, 9 inc** | OK |
| final login | 0 occ, 5 inc | 0 occ, 5 inc | OK |
| scopeHash app | `8f1daa57…` | `8f1daa57…` baseline **=** final **=** rejeu | IDENTIQUE |
| scopeHash login | `a560a471…` | `a560a471…` | IDENTIQUE |
| statesHash app / login | `52f142ec…` / `687b71b6…` | **recomputés depuis la source `audit.mjs` livrée** + rejoués identiques | IDENTIQUE (progrès vs vikunja F1) |
| verify.mjs | 36/36 | **36/36** | OK — assertions réelles (noms calculés `getByRole`, `inLayer`, focus trap) |
| eval-final.mjs | 15/15 | **15/15** | OK |
| install-build | 4× exit 0 | `git apply` + `yarn --frozen-lockfile` + `yarn build` + `go build` exit 0 sur clone propre | OK (log incomplet, F6) |
| **final app sous seed avec lien markdown** | — | **6 occ color-contrast réelles** (`a[href]` sur 6 surfaces) | **F1 — score 0 sous condition de seed** |

## Lecture du patch (26 fichiers, +225/−82) — sain

- `<main>` imbriqués : `DefaultPage` `<main>`→`<div>` + `Layout` `<main id="main-content" tabIndex={-1}>` unique + skip-link `a[href="#main-content"]` → vraie correction structurelle des 3 règles landmarks + `page-has-heading-one` (h1 par page via `component="h1"`).
- Portails MUI : `<div id="a11y-popup-layer" role="complementary">` frère de `#root` + `container={popupContainer()}` sur Menu/Drawer temporaire/10 Dialog/`SnackbarProvider domRoot` — **vérifié en live** : menu utilisateur, drawer mobile et dialog `add-app` montés DANS la couche (`inLayer: true`), `#root` jamais `aria-hidden` (`rootHidden: null`). C'est le fix propre de `aria-hidden-focus`/`region`/`landmark-one-main` — meilleur que le vanilla, pas du masquage.
- IconButtons/dnd-kit/Button-lien nommés par `aria-label` réels → confirmés par noms accessibles CALCULÉS (`getByRole('button', {name})`), pas par inspection d'attribut.
- `<th>` vides → textes SR via `visuallyHidden` + 10e `<th>` « Delete » ajoutée (vrai trou de colonne corrigé, pas comblé en cachette).
- `Tooltip` wrapper `div`→`div role="group"` (aria-prohibited-attr) — correct, nom effectivement rendu (`hintLabel="name is required"` constaté).
- `variant="info"` retiré des snackbars (fond notistack neutre) + `subtitle1`→`component="div"` (heading-order) + `image !== null`→`image ?` (bug `<img src=undefined>`) + `Avatar alt=""` + `ListItemButton component={Link}` (interactif imbriqué) + empty-state plugins — tous des vrais fixes.
- **Aucun** `display:none`, suppression de contenu, `aria-hidden` ajouté, ni retouche de test/harnais dans le patch. `audit.mjs` livré est **byte-identique au cycle ntfy hors carte STATES** — runner non modifié.

## Findings

- **F1 (major)** — Défaut résiduel réel non déclaré : `ui/src/message/Message.tsx` `.content & a { color: '#ff7f50' }` → liens de contenu de message à **2.49:1** (WCAG 1.4.3, échec dur). Un message markdown contenant un lien — lecture ordinaire de « markdown priority 8 », et le cas réel dominant des alertes gotify — produit **6 occurrences axe color-contrast** dans le build patché (rejoué : `/#/`, `/#/messages/1`, `nav-drawer-mobile`, `push-message-dialog`, `confirm-delete-all`, `snackbar-undo`). Sous le seed livré (markdown sans lien) le 0/0/exit 0 se reproduit exactement, donc le score est honnête *pour ce seed* — mais la revendication « 0 violation » dépend du littéral de seed et le défaut n'est ni corrigé ni listé en `ecarts`. Même classe que ntfy cycle 14 (`a{color:#338574}`) → PARTIAL.
- **F2 (minor)** — Seed sous-spécifié : le manifeste dit « 2 messages (id=1 texte plein, id=2 markdown priority 8) » sans littéral de contenu — la leçon « seed entièrement spécifié » (memos §4, ntfy F2) n'est pas appliquée. C'est précisément la cause de F1.
- **F3 (minor)** — `results.json.ecarts` décrit les 14 incompletes avec des catégories partiellement périmées : il cite `th-has-data-cells plugins` et « aria-label sur [role=group] résiduels » qui **n'apparaissent pas** dans le rapport final livré (réel : 13 `color-contrast` fond indéterminable + 1 `aria-valid-attr-value` sur `#user-menu-button`). Vérifié bénin en live (champs login : texte 87 % noir sur `MuiPaper` blanc ≈ 16,7:1), mais l'analyse ne correspond pas au contenu livré et il n'y a pas de sondes par nœud (recommandation `incomplete-probes.json` non appliquée).
- **F4 (minor)** — `verify.mjs` sonde le contraste snackbar sur `#notistack-snackbar` dont le fond calculé est `rgba(0,0,0,0)` (transparent) → traité comme noir → ratio affiché 21:1 ; le fond réel vit sur `SnackbarContent` (#313131 ≈ 12:1 d'après le worker). Assertion directionnellement juste mais le nœud mesuré n'est pas la surface — heuristique fragile.
- **F5 (nit)** — `provenance.json` mélange les 24 fichiers livrés avec 213 fichiers worker-side invérifiables (`node_modules`, `auth.json` — à juste titre non commité —, sorties `tools/a11y-audit`). Hash plein = bruit ; seuls les livrables comptent.
- **F6 (nit)** — `install-build.log` ne couvre que les 3 étapes de build ; pas de trace du clone/`git apply` (la chaîne complète n'est prouvée que par mon rejeu). `scope.json` ne stocke pas `waitFor`/`wait` (leçon protocole n°8 non implémentée dans le runner) — l'écart baseline sans sédimentation n'est pas vérifiable depuis l'artefact seul, seulement depuis `auditCommands`/ecarts.
- **F7 (nit)** — l'état `nav-drawer-mobile` restaure le viewport à 1280×720 avant le scan : le drawer temporaire reste monté (légitime) mais la mesure se fait en viewport desktop sur un DOM mobile — artificiel sans être faux.
- **F8 (nit)** — le contrôle d'ordre des titres d'`eval-final.mjs` (saut > 1 niveau) ne peut pas capter le résiduel h5-avant-h1 ([5,1,2,2] passe) — heureusement déclaré honnêtement dans `ecarts`.

## Points de la mission

1. **provenance.json** : 24/24 fichiers livrés conformes au sha256 près (F5 pour le reste).
2. **patch.diff** : s'applique propre sur clone propre @f77d8a0, nouveaux fichiers inclus.
3. **install verrouillée + build** : yarn frozen + vite + go build rejoués, exit 0.
4. **scope.json** : scopeHash/statesHash identiques baseline↔final ET à mon rejeu ; statesHash de `states.json` recomputé depuis la source livrée = `52f142ec…` exact.
5. **manifest.json** : auditCommands verbatim, seed quasi-complet (F2), boot.notes honnêtes (tous les écarts déclarés sont réels : baseline sans `--wait-for`, transition `#delete-all`, h5 résiduel, `/plugins/:id` non scanné, suite e2e non jouée).
6. **results.json** : pas d'auto-verdict ; incompletes listés mais analyse partiellement décorrélée du rapport (F3).
7. **verify.mjs / eval-final.mjs** : 36/36 et 15/15 rejoués ; assertions réelles sur le cœur (portails dans la couche, noms calculés, piège Tab, Escape+focus, reflow 320px) ; faiblesses périphériques (F4, F8).
8. **audit rejoué** : baseline 13 règles identiques (occurrences : delta expliqué F1+transitoires) ; final 0/0/exit 0 reproduit sous seed livré — **6 violations réelles sous seed avec lien** (F1).
9. **triches** : aucune détectée — pas de masquage, pas de page manquante non déclarée (`/#/plugins/:id` justifié), pas d'état déclaré non scanné, pas d'assertion tautologique, runner non modifié.
