# Verdict ré-auditeur v5 — cycle 33 : dgtlmoon/changedetection.io @ a1ce35619aae

**Verdict : CONFIRMED**

Ré-audit indépendant du fix v5 (`78c22fc`) après le PARTIAL de v4 (R1 `.status-pill` 3,85/4,44 clair + R2 `.box` "Web page URL" 3,57 + wart sonde F2). Zéro confiance : clone vierge upstream @a1ce35619aae + `git apply patch.diff` v5 (**50 fichiers : 49 M + 1 nouvel `scss/parts/_a11y.scss`, 0 rejet `git apply --check`**) sur `~/work/auditv5/patched` → venv + `npm run build` (sass) + datastores frais seedés ; instance patchée **:5340**, vanilla **:5342**, fixtures réelles **:5341**/**:5343**, proxy CDP spawn-per-connection **:9333**, `npm ci` tools/ → axe **4.14.0** tracé. Ports exclus (:5005/:5006/:5180/:5599) respectés. UUIDs du seed régénérés côté auditeur et injectés via `CD_API_DOCS_UUID`/`CD_RATES_UUID`/`CD_TAG_UUID`/`CD_FIXTURE_BASE`. Toutes les sondes rejouées sur MES instances ; mesures pixel complémentaires par MON extracteur (screenshot → médiane pixels hors encre pour le fond, quartile extrême pour l'encre — `~/work/auditv5/mypx.mjs`).

## Chiffres rejoués (v5) vs livrés

| Run | Livré | Rejoué | Concordance |
|---|---|---|---|
| patch.diff v5 | 50 fichiers | **50 fichiers, 0 rejet** (`git apply --check`, clone propre ; `_a11y.scss` tracké) | identique |
| baseline-public | 12 occ / 6 règles | **12 / 6** | identique |
| baseline-auth | 1328 occ / 14 règles / 215 inc | **1328 / 14 / 215** | identique |
| final-public | 0/0/0 | **0/0/0** (:5340) | identique |
| final-auth | 0 viol / 0 err / 117 inc / 48 pages | **0 / 0 / 117 / 48** (:5340) | identique |
| install-build (verbatim manifest) | 0/0/0 + 0/0/117/48 | **0/0/0 + 0/0 err/119 inc/48 sc** (:5344, clone+patch+build+datastore propres) | identique modulo jitter (+2 nœuds `.spinner-wrapper .status-text` capturés mid-recheck sur `/` — timing live, non structurel ; le claim compte les nœuds, qui dépendent des rows en cours de recheck au moment du scan) |
| verify.mjs | 29 PASS / 0 FAIL | **29 / 0** | identique |
| probe-f1-queue.mjs | worst non-completed 4,59, exit 0 | **4,59, exit 0** (144 relevés : busy 60 / queued 10 / completed 10 / idle 20 / static 44, vrais rechecks API) | identique à l'unité |
| probe-f2-proxy.mjs (wart) | gate tous-glyphes-terminaux 120 s + exit 2 si X absent | **reproduit** : vrai clic, X `.proxy-check-err` capturé à **31,02 s**, 4 spans terminaux, worst **5,14**, exit 0 ; le code livré contient bien `waitForFunction` all-terminal + `process.exit(2)` si jamais de X | identique |
| probe-pixel-v5.mjs | 112 mesures, pire 4,73 | **112 mesures, pire 4,73, 0 < 4,5, exit 0** (:5340) | identique |
| incomplete-probes.mjs | 117 → 75 RESOLVED / 42 N-A / 0 CONFIRMED | **75 R / 42 N-A / 0 CONFIRMED**, MES uuid/env | identique, distribution incluse |
| eval-final.mjs | 1340→0 | **1340→0**, exit 0 (12 public + 1328 auth), 0 erreur | identique |
| styles.css buildé | sha256 `4e22aad3…` | **`4e22aad3c08f31731ba80aaa30324397fd699613bd2bddee4a90b9f1bdb15ef3`** byte-identique, reproduit à la fois sur mon clone direct ET sur l'install-build ; `diff.css` **`0f11adf1…`** conforme | identique |
| provenance.json | 57 entrées | **57/57 re-hachés OK, `--strict` lancé moi-même** (après restauration du `reports/incomplete-probes.json` écrit par la sonde — même mode opératoire documenté que le fixer) | identique |

## F-v4-1 `.status-pill` — CONFIRMED pixel-vrai

`background:rgba(255,255,255,.1)` → `background:var(--color-background-page)` opaque + `color:var(--color-text-menu-heading)` vérifiés dans le CSS livré.

- **Leur sonde, rejouée par moi** (:5340) : « Running » **15,13** clair / **13,04** sombre ; « Alerts on » **15,13** / **13,04** — claims exacts.
- **Mon extracteur** (médiane screenshot, pixels propres) : fg [249,249,249] sur bg [38,38,38] → **14,37** clair ; [232]/[38] → **12,35** ; sombre **12,35**/**10,62**. Écart vs 15,13 = ma médiane d'encre anti-aliasée vs leur pixel d'encre pur — même conclusion : le pill peint désormais sur du #262626 opaque, le dégradé `body::after` ne transparaît plus (avant : [75–79,121–133,185–192]).
- **`.muted`** : **0 élément rendu dans le seed** (N-A honnête, ni chez le fixer ni chez moi). Composition démontrable : `.muted{opacity:.8}` sur la règle de base opaque → composite fond ≈ [48..68], encre ≈ [208..218] → **≥ ~8:1** même sur le pire point du dégradé. N-A, non compté en PASS — la couverture vient de la règle de base opaque, pas du voile.

## F-v4-2 `.box` — CONFIRMED pixel-vrai

`.box{background:rgba(255,255,255,.04)}` → `background:var(--color-background-page)` opaque + garde `.box .pure-form-message{,-inline}{color:var(--color-white)}` présente dans le CSS livré ; `.pure-form :is(p,li,.pure-form-message,…) a:not(.pure-button)` pour les liens.

- Label + strong « Web page URL » (`/`) : **15,52 clair ET sombre** — claim exact, reproduit par leur sonde sur :5340 et par mon extracteur (bg mesuré [36,36,36] = la carte opaque).
- Les 4 gabarits `.box` : `watch-overview` (`/`) ✓ ; `add-watch-ui` ✓ (div « Go » 15,52 ; mon rect label nBg=0 — trop serré, couvert par la mesure de leur sonde) ; `groups-overview` (`/tags/list`) : **7,59 clair / 10,6 sombre** mesurés par moi ; `restock_diff/difference.html` : **N-A honnête** (aucun watch restock dans le seed — inchangé depuis v4).
- Conteneurs `div.box` (médiane pleine surface, encre incluse) : 6,92 clair / 11,67 sombre — le glyphe pertinent reste 15,52.

## Sweep rgba — CONFIRMED, couverture exhaustive vérifiée par moi

- Les **12 sites** claimés rejoués : ops-bar 4,97 / conn-error 4,97 / messages .notice .warning .error .message .success 6,38–9,63 / diff-form labels (from/to 5,16 mesuré par moi) / offscreen / stab-active 4,97 (sombre) et 6,24 (clair) / llm-summary / toggle-ai-mode 7,08–10,69 / #dd4242→4,97 / live-stream .75 — tous présents et ≥4,5 dans MON pixel-v5-a5.jsonl (112 lignes).
- **Mon échantillon indépendant** (≥5 sites hors du plan topbar) : puces tag `.watch-tag-list` **4,73** (bg `rgba(231,0,105,.4)` translucide **conservé** — composite mesuré conforme) ; queue `small`/`.inline-tag` 4,59–4,73 ; `option-group` 5,01 ; `.box` /tags/list 7,59 ; `.box`/`.box-wrap` /settings 5,31/5,29 ; `action-badge` 5,67–6,21.
- **Inventaire exhaustif des rgba(<1) restants** dans le CSS livré : tous classés — (a) voiles/rayures sur **parents opaques** (`#queue-page` .02/.04/.08/.14/.18, `.bulk-choice-row:hover`, `#add-watch-selector-pane`, `.records-selected` .8, stab/llm cards) ; (b) scrims/bordures décoratives (`::backdrop` .6, `.mobile-menu-overlay` .5, `.queue-spark` .05 vide, live-dot shadows, bordures) ; (c) **sélecteurs morts à ce SHA** : `.icon-btn` (aucun markup dans templates/JS), `#add-watch-live-info` (dead upstream) ; (d) badges non seedés `.restock-badge`/`.rg-status` → N-A ; (e) foregrounds rgba<1 (`.inline-tag--idle` .6, `td.time-cell` .75, `.queue-cancel` .65, `.toggle-ai-mode` .7, `::placeholder` .7, `.action-badge` .85) — tous sur surfaces opaques, mesurés ≥4,59. **Aucun résidu rgba(<1) translucide-sur-dégradé porteur de texte ne subsiste** ; le seul translucide textuel restant est la puce tag (.4 magenta) mesurée 4,73 pixel-vrai ≥4,5.
- **Régressions** : aucune détectée — `.box` opaque n'introduit pas de paire <4,5 (liens 6,2, messages gardés blancs) ; `.tabs` (.55/.2) et `--color-sidebar-*` (.97) résolvent sur composites ~opaques avec tokens texte thémés (#222 clair / blanc sombre ≈ 15:1) ; `#checkbox-operations` force `color:var(--color-text)`.

## Warts

- **W-sonde-f1-effFg** (nouveau, fidélité) : la sonde calcule `effFg = fg·α + bg·(1-α)` mais ignore le canal alpha de la couleur elle-même — `.inline-tag--idle` `rgba(255,255,255,.6)` est rapporté **11,37** alors que le composite réel ≈ **5,3** (mesuré par moi, conforme). Pire cas livré (4,73) non affecté, mais les chiffres des items à alpha<1 sont surestimés → borne haute à corriger en v6 si la sonde évolue.
- **W-inc-jitter** (nouveau, mineur) : le compteur « incomplets » dépend des rows mid-recheck au moment du scan (117 livré, 119 rejoué sur l'install-build, +2 `.spinner-wrapper .status-text`). Non bloquant : la claim structurale (48+1 scans, 0 viol/0 err) est exacte.
- **W-is-completed** (acté v3, toujours ouvert) : `tr.is-completed td{opacity:.45}` fondu transitoire amont, 2,08–4,16 pendant la disparition — hors scope v5.
- **W-action-sidebar** (v4, inchangé) : rail replié au repos, extension au :hover sur le contenu — transitoire amont, non bloquant.
- **W-registre** (v4) : **clos** — `REGISTRE.md` ne contient plus ni marqueur `|||||||` ni ligne 33 dupliquée ; la ligne 33 est consolidée propre.

## Ce qui est confirmé

Pipeline complet rejoué de bout en bout sur stack auditeur : patch 50f 0 rejet → sass sha256 `4e22aad3…` byte-identique → boot+seed propres → 48+1 scans **0 violation / 0 erreur / 117 inc** → verify **29/29** → sonde F1 **4,59** exit 0 → sonde F2 durcie (X à 31,02 s, worst 5,14) → sonde pixel-v5 **112 mesures, pire 4,73** → probes **75 R/42 N-A/0 CONFIRMED** → eval **1340→0** → install-build verbatim :5344 (**0 viol/0 err/119±jitter inc**) → provenance **57/57 --strict**. Les deux résidus v4 (status-pill, .box) sont corrigés et prouvés pixel-vrai par mes extracteur indépendant en plus de la sonde livrée ; le sweep rgba ne laisse aucun motif translucide-sur-dégradé textuel non couvert, hors puce tag mesurée conforme.

**Verdict : CONFIRMED** — cycle 33 clos : les claims v5 se reproduisent à l'unité sur une installation indépendante, et la famille translucide-sur-dégradé (`body::after`) qui a causé les PARTIAL v2/v3/v4 est éteinte sur les sites mesurables du seed.
