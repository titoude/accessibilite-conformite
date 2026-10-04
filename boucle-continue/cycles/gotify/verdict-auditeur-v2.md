# Verdict auditeur v2 — cycle 15 gotify/server

**Verdict : CONFIRMED** — toute la chaîne v2 se reproduit à l'identique sur rejeu
indépendant (provenance 45/45, patch propre, install+build exit 0, baseline 100
occurrences à la règle près, final 0 violation / 0 erreur / exit 0 sous seed
verbatim AVEC liens markdown, verify 36/36, eval 15/15, sondes incomplets
rejouées à l'identique). Les 8 findings de l'audit v1 sont vérifiablement
corrigés, dont F1 (liens `.content` #ff7f50 → #bf360c en light) prouvé par
présence de la violation en vanilla et absence totale dans le build patché.

Comme pour tout cycle de la boucle : CONFIRMED = **reproductibilité du score axe
et santé du patch, PAS conformité WCAG complète**. Le périmètre reste axe
wcag2a/aa + best-practice sur 19 scénarios ; 20 résultats `incomplete` sondés
N-A (artefacts modaux + faux positifs mesurés) restent une limite de couverture,
et le thème dark n'est pas scanné (`#ff7f50` y est conservé — 6,6:1 calculé sur
#1f1f1f, non mesuré en session).

Auditeur : session indépendante (devin-605597cd45c7488c8c852ec2024a2f1b), VM
neuve, clone upstream frais, aucun artefact du worker réutilisé — tout est
rejoué. Sorties de rejeu : `reports/replay-auditeur/`.

## Méthode de rejeu (indépendante)

- Clone frais `github.com/gotify/server`, checkout du commit épinglé
  `f77d8a0ce8973aa3612b4e04f6b965794a2a51c5`.
- `git apply --check` + `git apply` de `patch-v2.diff` livré : propre, 26
  fichiers +232/−84, les 2 nouveaux fichiers (`common/popupContainer.ts`,
  `common/visuallyHidden.ts`) présents dans le diff.
- Binaire **vanilla** construit avant patchage (`gotify-vanilla`,
  62 411 216 o) puis binaire patché (62 411 200 o — livré 62 411 280,
  métadonnées de build non déterministes comme en v1).
- `cd ui && yarn install --frozen-lockfile` (yarn 1.22.22, node v24.19.0) +
  `yarn build` (tsc+vite) + `go build` (go 1.26.0) → tous exit 0.
- Boot selon manifest sur `127.0.0.1:8095` (même port : scopeHash/statesHash
  embarquent l'origine) avec env `GOTIFY_*` du manifeste.
- `tools/seed.sh` exécuté **verbatim** — ids déterministes reproduits (bob=2,
  client devin-audit=1, app Monitoring=1, client Firefox-Desktop=2, messages
  1=texte, 2=markdown avec les 2 liens réels).
- `audit.mjs` avec les `auditCommands` verbatim ; baseline avec
  `--wait-for 'main'` (asymétrie documentée, même `--wait 1500`).

## Résultats du rejeu

| Étape | Livré | Rejoué | Verdict |
|---|---|---|---|
| provenance.json | 45 livrables | **45/45 sha256 conformes**, aucun fichier worker-side | OK (F5 corrigé) |
| patch-v2.diff sha256 | `83b4ec04…` | `83b4ec04…` + sidecar concordant | OK |
| git apply | clone propre @f77d8a0 | check OK, apply exit 0, 26 fichiers | OK |
| install + build | 4× exit 0 | `yarn --frozen-lockfile` 22 s + `yarn build` + `go build` exit 0 | OK ; log v2 trace clone+apply (F6 corrigé) |
| baseline-v2 app | 96 occ / 13 règles | **96 occ / 13 règles, distribution identique à l'occurrence près** | OK |
| baseline-v2 login | 4 occ | 4 occ | OK → total 100 exact |
| final-v2 app (seed liens) | 0 occ / 0 err, 15 inc | **0 / 0 err, 15 inc** exit 0 | OK |
| final-v2 login | 0 occ, 5 inc | 0 occ, 5 inc exit 0 | OK |
| **liens markdown en vanilla** | — | **12 occ color-contrast** (`<a>` ×2 × 6 surfaces : /#/, /#/messages/1, nav-drawer, push-message, confirm-delete-all, snackbar-undo) | **F1 : violation présente en vanilla, nulle en patché — fix prouvé** |
| scopeHash app / login | `8f1daa57…` / `a560a471…` | identiques baseline↔final↔rejeu **et recomputés depuis les scenarios** | IDENTIQUE |
| statesHash app / login | `525df048…` / `687b71b6…` | identiques + **recomputés depuis la source audit.mjs livrée** ; states.json = hash du scope | IDENTIQUE (F7 : hash ≠ v1 52f142ec, le setup 375px a bien changé) |
| incomplete-probes | 15+5 nœuds sondés | rejouées **identiques** (fg/bg/ratio/coveredBy par nœud) | OK (F3 corrigé) |
| verify.mjs | 36/36 | **36/36** — snackbar mesuré 13,01:1 sur `SnackbarContent` (ancêtre alpha>0) | OK (F4 corrigé) |
| eval-final.mjs | 15/15 | **15/15** — toutes pages `[1,…]` ; check simulé `[5,1,2,2]` → FAIL | OK (F8 corrigé) |

## Statut des findings v1

- **F1 (major) — RÉSOLU, prouvé.** `Message.tsx` `.content & a` =
  `theme.palette.mode === 'dark' ? '#ff7f50' : '#bf360c'`. En vanilla, les 2
  liens du message markdown seedé produisent 12 occurrences color-contrast
  réelles sur 6 surfaces ; dans le build patché, **0** sur les 19 scénarios.
  Contraste #bf360c/#fff recalculé : 5,61:1 (livré 5,60:1). Dark : #ff7f50
  conservé, calculé 6,6:1 sur #1f1f1f — non scanné (light seul, déclaré).
- **F2 — RÉSOLU.** `tools/seed.sh` verbatim + littéraux figés dans le manifeste
  (chaque POST documenté, ids attendus). Rejoué tel quel : ids 1,2 exacts.
- **F3 — RÉSOLU.** `tools/incomplete-probes.mjs` rejouable par nœud (fg, fond
  remonté, ratio, coveredBy, ariaControlsResolved). Les 20 incomplets du VRAI
  rapport final-v2 sont sondés : 13 nœuds couverts pendant un état modal
  (boutons 4,6:1, champs/cellules 21:1 — artefact modal attendu), 6 sans
  recouvrement (`coveredBy` null, fond remonté #fff, ratio 21 — faux positif
  axe), 1 `aria-valid-attr-value` (`aria-controls="user-menu"` résolu quand le
  menu est monté — limitation axe). Décisions par groupe tracées et confirmées
  par mes propres mesures (voir G2 pour une imprécision de libellé).
- **F4 — RÉSOLU.** verify.mjs part de `.MuiSnackbarContent-message` et remonte
  les ancêtres jusqu'au premier fond alpha>0 : mesuré en live `fg [255,255,255]
  / bg [49,49,49]` sur `DIV.go1888806478` = **13,01:1** exactement comme livré.
- **F5 — RÉSOLU.** provenance.json = 45 livrables uniquement (plus de
  node_modules/storage-state), tous recomputés conformes.
- **F6 — RÉSOLU.** `install-build-v2.log` trace clone propre (checkout, statut
  pré-apply 0 fichier), `git apply` (stat + check + exit + statut post-apply 26
  fichiers + 2 nouveaux), puis les 3 étapes de build. `scope.json` stocke
  désormais `waitFor`/`waitMs`.
- **F7 — RÉSOLU.** `nav-drawer-mobile` ne restaure plus le viewport : scan au
  vrai 375×720. Conséquence prouvée : `aria-dialog-name` exposé en baseline
  (1 occ, livré et rejoué), corrigé par `slotProps.paper` aria-label «
  Navigation mobile » + `<nav aria-label>` interne ; `statesHash` changé
  52f142ec→525df048 atteste le changement de setup.
- **F8 — RÉSOLU.** eval-final exige `order[0] === 1` + aucun saut >1 : simulé
  `[5,1,2,2]` → échec ; toutes les pages mesurent désormais `[1,…]` en live.

## Re-lecture du patch v2 (26 fichiers, +232/−84) — sain

- `#a11y-popup-layer[role=complementary]` frère de `#root` +
  `container={popupContainer()}` sur Menu, Drawer temporaire, 10 Dialog,
  `SnackbarProvider domRoot` — vérifié live : menu (`items:2`, `named:2`,
  `inLayer:true`), drawer mobile et dialog `add-app` montés DANS la couche,
  `#root` jamais `aria-hidden` (`rootHidden:null`).
- `<main>` unique `id="main-content" tabIndex={-1}` + skip-link fonctionnel
  (premier Tab → `a[href="#main-content"]`).
- Vrais noms accessibles calculés : 18 IconButtons + poignée dnd-kit
  `Reorder ${app.name}` + `Delete message` — `getByRole(name)` confirmé.
- `<th>` vides → libellés `visuallyHidden` + 10e `<th>` « Delete » réelle.
- `variant="info"` retiré des 2 enqueueSnackbar (surface neutre #313131).
- `Typography` de marque h5→`component="div"`, `subtitle1` h6→div, titres de
  pages `component="h1"`, titre message `component="h2"`.
- `ListItemButton component={Link}` (interactif imbriqué supprimé), nav
  landmarks nommés distincts, Avatar `alt=""`, `image !== null`→`image ?`
  (bug `<img src=undefined>`), empty-state plugins, wrapper tooltip
  `div`→`div role="group"`.
- **Aucun** `display:none`, suppression de contenu, `aria-hidden` ajouté,
  réécriture de test/harnais. Runner `audit.mjs` v6 : ajouts traçables
  (waitFor/waitMs dans scope.json, pas de restore viewport) — pas de
  modification des règles de mesure.
- **Vigilance leurre (point mission 9)** : l'assertion menu cible bien
  `#user-menu` réel — `#user-menu [role=menuitem]` attendus visibles, puis
  `layer.contains(menu)` + `items>0` + `named===items` mesurés live (2 items
  nommés). Pas un test d'existence du seul div.

## Findings v2 (tous mineurs / documentation)

- **G1 (nit)** — `results.json.measured.baseline.rules` liste 14 noms dont
  `aria-hidden-focus` et `landmark-one-main` (restes de la liste v1 — ce sont
  des `incomplete`/absents du rapport v2) et omet `link-name` (4 occurrences
  réelles livrées). Le compte « 13 règles » tombe juste par coïncidence ;
  la liste nominative n'est pas celle du rapport livré.
- **G2 (nit)** — les groupes d'incomplets de `results.json` sont exacts en
  comptes (13 couverts pendant modal / 6 sans recouvrement / 1 aria-controls)
  mais les libellés mélangent les motifs axe : le groupe A contient 9
  `bgOverlap` + 4 `elmPartiallyObscured`, le groupe B 4 `bgOverlap` + 2
  `elmPartiallyObscured`. Substance et comptes corrects, libellé « bgOverlap »
  imprécis.
- **G3 (nit)** — `incomplete-probes.mjs` restaure le viewport à 1280 à la fin
  du setup `nav-drawer-mobile` alors qu'`audit.mjs` sonde à 375 px : le nœud
  est re-mesuré à un viewport différent de celui audité. Benin ici (ratio 21,
  `coveredBy` null cohérent), écart méthodologique résiduel.

Aucun finding bloquant : le score 0/0/exit 0 sous seed littérale avec liens est
reproductible, la baseline 100 occurrences l'est à l'occurrence près, et le
patch est sain — **CONFIRMED**.
