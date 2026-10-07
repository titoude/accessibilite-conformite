# verdict-fixer-v5 — cycle 33 changedetection.io

Date : 2026-10-07. Rôle : fixer v5 sur le ré-audit **PARTIAL** de
l'auditeur v4 (verdict-auditeur-v4.md, commit c668933). Toutes les
preuves ci-dessous sont **rejouées dans cette session** : clone
@a1ce35619aae + patch v4 + fixes v5 dans les sources SCSS réelles,
rebuild sass (`npm run build`), instance bootée sur mes ports
app :5180 / fixtures :5181 / datastore `~/work/cd-datastore-v5`.

## Résumé des chiffres rejoués

| Run | occ | règles | incomplets | pages | erreurs |
|---|---|---|---|---|---|
| final-public (:5180) | 0 | 0 | 0 | 1 | 0 |
| final-auth (:5180) | 0 | 0 | 117 | 48 | 0 |

- verify.mjs **29 PASS / 0 FAIL** sur :5180.
- probe-pixel-v5.mjs (nouvelle sonde pixel-vrai, `reports/pixel-v5.jsonl`) :
  **112 mesures, pire 4,73:1, 0 texte < 4,5** — clair + sombre.
- probe-f1-queue.mjs rejouée : exit 0, 145 relevés (busy 60, queued 5,
  completed 20, idle 16, static 44), **pire non-completed 4,59:1**.
- probe-f2-proxy.mjs corrigée (wart) : exit 0, 4 glyphes terminaux
  attendus avant mesure — le X est arrivé à **31,02 s** (exactement le
  cas raté par l'ancien gate) ; pire ratio 5,14:1.
- incomplete-probes.mjs rejouée : **117 items → 0 CONFIRMED_VIOLATION**
  (rapport `reports/incomplete-probes.json` git-restauré après rejeu).
- eval-final.mjs : **baseline 1328 occ → final 0**, 0 erreur d'état,
  0 état manquant, 0 règle non résolue (exit 0).
- axe-core **4.14.0**, UUIDs réels du seed passés en env `CD_*_UUID`
  (api-docs 8b04845c, rates e2ac9826, tag 1806d2e0).

## F-v4-1 — `.status-pill` topbar (corrigé + prouvé pixel-vrai)

**Constat auditeur** : voile `rgba(255,255,255,.1)` translucide sur le
dégradé fixe → « Running » **3,85:1**, « Alerts on » **4,44:1** en clair.

**Correctif** (`scss/parts/_top_menu.scss`) : pastille basculée en
`background: var(--color-background-page)` (#262626 opaque, même
recette que `.queue-panel` v4 — même carte sombre lisible sur toute
bande du dégradé, les deux thèmes). `:hover` devient un
`color-mix(… 82%, white)` opaque ; `.muted` garde `opacity:.8`
(le glyphe mute est décoratif, texte opaque sous-jacent).

**Mesures pixel-vrai** (médiane pixels propres, screenshot in-page) :
« Running » **15,13:1** clair / **13,04:1** sombre ; « Alerts on »
**15,13:1** / **13,04:1**. Anciens 3,85/4,44 → fixé.

## F-v4-2 — `.box` (quick-add watchlist + 3 autres gabarits)

**Constat** : label « Web page URL » `#add-watch-ui .box` clair
**3,57:1** (`rgba(0,0,0,.05)` du form + `.box` `rgba(255,255,255,.04)`
translucides composés sur le dégradé).

**Correctif** (`styles.scss`) : `.box` → `background: var(--color-background-page)`
(choix « fond opaque », comme `.queue-panel` ; couleur blanche héritée
déjà à ~12-15:1). Correctif **récursif** : la même classe `.box` sert
`watch-overview.html` (quick-add), `add-watch-ui.html`,
`restock_diff/difference.html`, `groups-overview.html` — tous corrigés
d'un coup. Garde-fou ajouté : `.box .pure-form-message{,-inline}`
forcés en blanc (le token description gris-moyen était invisible sur
carte sombre).

**Mesures** : label « Web page URL » **15,52:1 clair / 15,52:1 sombre**
(3,57 → 15,52) ; conteneur `.box` 6,79/11,67 ; `.stab-shell` voisin
(composite sur carte opaque) 6,24–11,69.

## Sweep rgba complet — sites du même type traités

Méthode : grep `rgba(` alpha<1 sur surfaces porteuses de texte dans
TOUT le SCSS ; chaque site classé « sur dégradé peint » (à corriger)
ou « composite dans un parent opaque » (sain, mesuré). Les sites
sur-dégradé corrigés :

| Surface | Avant | Correctif | Après (pixel-vrai) |
|---|---|---|---|
| `.status-pill` | rgba(255,255,255,.1) → 3,85/4,44 | fond opaque | 15,13 / 13,04 |
| `.box` ×4 gabarits | rgba(255,255,255,.04)+rgba(0,0,0,.05) → 3,57 | fond opaque | 15,52 / 15,52 |
| `#diff-form` | rgba(0,0,0,.05) sur dégradé | `var(--color-background-page)` (diff.css) | textes 5,33–15,91 |
| `.toggle-ai-mode` | opacity .55 nue sur dégradé | pastille opaque + txt .7→~6,6 ; drawer mobile exempt (drawer clair) | 7,08 / mesuré |
| `#realtime-conn-error` | `var(--color-warning)` à opacity .8 | `button-error` rgb(202,60,60), opacity 1 | 4,97 |
| `#bottom-horizontal-offscreen` | `#ffffffb8` (.72) | `var(--color-background)` opaque | boutons 5,33+, barre 9,74 |
| `#checkbox-operations` | rgba(255,255,255,.7) → barre voilée + `color` hérité blanc invisible (mesuré **1:1**) | fond opaque `var(--color-white)`/`--color-grey-300` + `color: var(--color-text)` | items 4,97–16,97 |
| `.messages li` génériques | tokens rgba .2/.5 (notice sans cas override) | tokens opaques `--color-background-messages-*` + `.notice`/`.warning` ajoutés aux overrides `.content-main > ul.messages` (2 thèmes) | 6,72–8,89 |
| `#llm-diff-summary-area` | dégradé rgba 14-18 % translucide | opaque `#f3efff` clair / `#241a3f` sombre ; label+quote .55→.75 | texte mesuré OK |
| `.stab-btn.active` | `color: var(--color-menu-accent)` #ed5900 → **2,97 clair / 2,41 sombre** | `#9a3412` clair / `#fdba74` sombre (même teinte accent) | **6,24 / 4,97** |
| bulk-ops « Delete »/« Clear/reset history » | inline `#dd4242` → **4,26** | `var(--color-background-button-error)` + token `--color-background-button-red` assombri (couvre aussi `.button-red` browser-steps.js) | **4,97** |
| `.add-watch-live-stream` | opacity .6 (<4,5 sur carte sombre) | .75 | composite ≈5,5 |

Sites rgba **évalués sains** (composite sur parent opaque ou marge
calculée, mesurés quand visibles) : internes `.action-sidebar`, pistes
`.seg`, onglets `.tabs` (≈7,2–15,9 mesurés), `.watch-tag-list`
(couleurs WCAG serveur, mesurés 4,73–6,93), `.records-selected`
(20,14), `.modal-dialog`, `.toast`, drawer mobile, `.edit-form .inner`,
`.box-wrap.inner`, `td`/`.pagination`, `#checking-now-fixed-tab`,
`#overlay` (.95), `.menu-pop`. Artefacts de mesure non-produit :
`.action-sidebar` :hover (rail qui s'étend au survol, design amont),
animation d'entrée `.messages` (~0,45 s — la sonde attend 900 ms).

`#add-watch-live-info` : styles morts à ce SHA (aucun markup rendu) —
retiré du plan, documenté.

## Wart sonde F2 — corrigé + prouvé

Avant : `waitForSelector` au **1er** glyphe terminal → le X du proxy
mort pouvait arriver après (mesuré **31,02 s** au rejeu) et le gate
sortait `exit 0` sans l'avoir vu.

Correctif (`tools/probe-f2-proxy.mjs`) : `waitForFunction` exigeant que
**chaque** slot `#request .proxy-status` porte un enfant terminal
`.proxy-check-ok|err` (timeout 120 s), puis post-check : **0
`.proxy-check-err` → exit 2** (« preuve non produite »). Rejeu : les 4
glyphes attendus, X capturé et mesuré — **5,14–6,47:1** les deux thèmes.

## Livrables

- `patch.diff` régénéré **depuis l'arbre vérifié** (`git diff` + `git
  add -N` `_a11y.scss`) : 50 fichiers, +414/−115.
- `git apply --check` sur clone vierge @a1ce3561 : **OK**, 0 rejet ;
  après apply, sha256 styles.css identique à l'arbre vérifié.
- **styles.css byte-diff** : amont `38d92b52…` (105 100 o) → patché
  `4e22aad3…` (108 129 o, +3 029 o), sass rebuild ; `diff.css` amont
  `e4ec1c1f…` → `0f11adf1…`.
- Nouvelle sonde `tools/probe-pixel-v5.mjs` + preuve
  `reports/pixel-v5.jsonl` ; sondes f1/f2 rafraîchies
  (`reports/f1-queue-probe-v5.jsonl`, `f2-proxy-probe-v5.jsonl`) ;
  `reports/final-{public,auth}` rafraîchis au run :5180 ;
  `reports/eval-final.json` recalculé.
- auth.json régénéré post-eval (POST /logout du runner le tue).

## Verdict fixer v5

**CONFIRMED-FIX** : les 2 résidus pixel-vrai sont réparés dans les
sources réelles (pas de surcharge), mesurés au pixel dans les deux
thèmes à ≥4,5 ; le sweep rgba a traité 12 sites de la même famille
translucide-sur-dégradé + 2 constats adjacents réels (boutons rouges
4,26, texte hérité invisible 1:1) ; la sonde F2 ne peut plus exit 0
sans le X ; la batterie complète (48+1 scénarios, verify, sondes,
incomplets, eval) est rejouée verte.
