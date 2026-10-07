# Verdict ré-auditeur v4 — cycle 33 : dgtlmoon/changedetection.io @ a1ce35619aae

**Verdict : PARTIAL**

Ré-audit indépendant du fix v4 (42faeea) après le PARTIAL de v3 (F1 pixel-vrai non résolu + résidu F2 proxy + wart provenance `_a11y.scss`). Stack auditeur propre, zéro confiance : clone vierge upstream @a1ce35619aae + `git apply patch.diff` v4 (**45 fichiers, 0 rejet**) sur `~/work/auditv4/patched` → venv py3.11 + `npm run build` + datastore frais seedé ; instance patchée sur **:5152**, vanilla sur **:5151**, fixtures réelles **:5153**, proxy CDP spawn-per-connection **:9451**, `npm ci` tools/ → axe **4.14.0** tracé. Ports exclus (:5005/:5006/:5599) respectés. Toutes les sondes rejouées sur MON install-build.

## Chiffres rejoués (v4) vs livrés

| Run | Livré | Rejoué | Concordance |
|---|---|---|---|
| patch.diff v4 | complet, `_a11y.scss` inclus | **45 fichiers, 0 rejet** `git apply --check` sur clone propre ; `scss/parts/_a11y.scss` présent et `@use`d (latent v3 clos) | identique |
| baseline-public | 12 occ / 6 règles | **12 / 6** | identique |
| baseline-auth | 1328 occ / 14 règles / 215 inc | **1328 / 14 / 215** | identique |
| final-public | 0/0/0 | **0/0/0** | identique |
| final-auth | 0 viol / 0 err / 117 inc / 48 pages | **0 / 0 / 117 / 48** | identique |
| install-build public/auth | 0/0/0 + 0/0/117/48 | **0/0/0 + 0/0/117/48** (:5152 = mon clone+patch+build+datastore) | identique |
| verify.mjs | 29 PASS / 0 FAIL | **29 / 0** sur :5152, `--cycle-dir` vers mon dossier | identique |
| incomplete-probes | 117 items → 75 RESOLVED / 42 N-A / 0 CONFIRMED | **117 → 75 R / 42 N-A / 0 CONFIRMED** sur :5152, MON rapport | identique, distribution incluse |
| eval-final | 1328→0 | **1340→0** (12 public + 1328 auth), `missing=[]`, `unresolved=[]`, 0 erreur | identique |
| styles.css buildé | sha256 `2d2042b4…` | **`2d2042b4961fd8b7bc8ffa65b2a3e18c0daa0c8dcd144cebb21de18e5a192f5a`** byte-identique (patched) | identique |
| provenance.json | 51 entrées | **51/51 re-hachés OK + spot-check 3/3** par `rehash-provenance.py --strict` lancé moi-même | identique (wart v3 clos : les 3 fichiers couverts) |

## F1 /queue — CONFIRMED (pixel-vrai, les deux méthodes)

Le fix est **réel** : `.queue-panel` passe de `rgba(0,0,0,.05)` translucide à `background: var(--color-background-page)` opaque (#262626). Sur mon install-build, vrais rechecks API → rows JS vivantes :

- **Sonde livrée rejouée** (`probe-f1-queue.mjs`, réécrite en mesure screenshot+médiane pixels propres) : 144 relevés (busy 60, queued 10, idle 20, completed 10, static 44), `worstNonCompletedRatio=4.59`, exit 0 — **claim 4,59 reproduit à l'unité**, 0 échantillon non-completed sous 4,5. Sous-fixes reproduits : `thead th` var(--color-text) sur `--color-background-table-thead` → **9,57 clair / 12,63 sombre** (= claims) ; `.queue-stat--action .button-secondary` #14677d → **6,43** (= claim).
- **Mon échantillonnage indépendant** (code propre, screenshot + médiane td/rect) : surface des rows mesurée au pixel = `[38,38,38]`–`[50,50,50]` — opaque, le dégradé ne transparaît plus. `small` fg #c2c2c2 fondu à opacity .7 sur pixel propre 38 → ~4,9 ; sur strip légèrement contaminé par l'encre (~50) → ~4,35. Fourchette cohérente avec le 4,59 livré.
- Les pixels sous le texte prouvent que le mécanisme v3 (pliage DOM aveugle au `body::after` fixe) ne produit plus de violation : le sous-jacent peint EST le panneau opaque.

## F2 recheck-proxy — CONFIRMED (vrai clic, vrai terminal, pas cosmétique)

Vrai clic `#check-all-proxies` sur `/edit/<uuid>#request`, proxy seedé mort (127.0.0.1:3128 → `proxy-check-err` X + `ExceptionHTTPConnectionPool… Connection refused`, timing réel **31,01 s**). MA mesure pixel-vraie (attente de TOUS les statuts terminaux, médiane pixels propres, self→parent→grandparent) :

| élément | clair livré | clair rejoué | sombre livré | sombre rejoué |
|---|---|---|---|---|
| `.proxy-check-err` X | 6,47 | **6,47** (#b91c1c sur blanc mesuré) | 5,73 | **5,73** (#ffb3b3 sur #444 mesuré) |
| `.proxy-check-ok` OK | 5,14 | **5,14** (#008000/blanc) | 5,43 | **5,43** (#42dd53/#444) |
| `.proxy-check-details` | — | **5,74** (#666/blanc) | — | **5,47** (#c2c2c2/#444) |
| `.proxy-timing` | 6,18 | **6,18** | 5,82 | **5,82** |

Pire cas rejoué **5,14** = claim. Les classes SCSS thémées (`_extra_proxies.scss`) rendent le X réellement conforme — vrai fix.

## Chasse — résidus trouvés (famille F1 : voile translucide au-dessus du dégradé fixe)

Le motif persiste dans `styles.css` livré : `.box{background:rgba(255,255,255,.04); color:var(--color-white)}`, `.status-pill{background:rgba(255,255,255,.1)}`, `.pure-form` `rgba(0,0,0,.05)` — **identiques dans la vanilla** (hsla) → amont pré-existants, invisibles à axe (pliage vers #262626 → illusion 15:1), exactement la classe du `.queue-panel` corrigé. Mesurés pixel-vrai sur :5152, thème clair (le sombre passe partout, dégradé sombre) :

- **R1 `.status-pill`** (top bar, toutes pages) : "Running" **3,85:1**, "Alerts on" **4,44:1** — glyphe directement sur le voile rgba(255,255,255,.1) au-dessus du dégradé (~[75–79,121–133,185–192] mesuré). Variante `.status-pill.muted{opacity:.8}` = pire. → **résidu réel**.
- **R2 `#add-watch-ui.box` label "Web page URL"** (page `/`) : **3,57:1** — texte blanc `var(--color-white)` direct sur form rgba(0,0,0,.05) + .box rgba(255,255,255,.04) composite → [71,142,191] mesuré. → **résidu réel**.

**Artefacts écartés** (surfaces conteneurs — les glyphes réels peignent sur fonds propres opaques) : `div.seg` 1,35 (ses enfants : "All" 12,63, "Unread" 5,31, badges 5,69/4,97), div "Mark all viewed / Recheck all" 4,35 (bouton propre opaque), div "Web page URL\nWatch" 3,61 (`#add-watch-go` = #0069d1 réel → 5,33, RESOLVED par la sonde officielle).

## Warts

- **W-sonde-F2** : `probe-f2-proxy.mjs` s'arrête au PREMIER statut terminal (+500 ms). Or l'OK « No proxy » arrive en 0,01 s et le X du proxy mort à ~31 s : sur MON rejeu la sonde n'a capturé que l'OK (exit 0 quand même — `terminal>0` suffit). La preuve livrée (X compris, 4 spans) est authentique, mais la sonde peut passer en ratant le pire cas → attendre la fin du poller (`proxy-status` sans spinner), pas le premier statut.
- **W-action-sidebar** : le rail `.action-sidebar` amont est replié au repos et s'étend (200 px + ombre 28 px) au `:hover`/`:focus-within`, couvrant le bord droit du contenu — la sonde écarte la souris avant capture. Comportement amont transitoire par design, pas une paire de contraste stable → non une violation 1.4.3 bloquante ; wart UX noté.
- **W-is-completed** : rows `is-completed` au fondu `opacity:.45` transitoire — 2,08–4,16 mesuré pendant la disparition ; convention transitoire amont, non plafonnée par le gate (actée v3). Le motif `.seg` non actif blanc-on-gris n'existe pas — conteneur sans glyphe propre.
- **W-registre** : `REGISTRE.md` contient des débris de conflit merge commités (marqueur `|||||||` + lignes 33 dupliquées obsolètes) — nettoyage recommandé, non bloquant.

## Ce qui est confirmé

F1 et F2 corrigés **et prouvés pixel-vrai** sur mon install-build indépendant ; sous-fixes thead/button-secondary reproduits au dixième près ; `_a11y.scss` désormais tracké (latent v3 clos) ; pipeline complet (patch→build→sha256→boot→seed→48+3→verify→probes→eval→install-build) rejoué identique à l'unité ; provenance 51/51 stricte.

## Ce qui reste ouvert (→ fixer v5)

- **R1** `.status-pill` clair : Running 3,85 / Alerts-on 4,44 (régler `background:rgba(255,255,255,.1)` comme pour `.queue-panel` — fond opaque ou assombrissement thème clair) + variante `.muted`.
- **R2** `#add-watch-ui .box` label 3,57 clair (le motif `.box`/`.pure-form` translucide au-dessus du dégradé, au-delà de `.queue-panel` ; auditer les autres `.box` de `/` et `/tags/list` si présents).
- **W-sonde-F2** : gate de la sonde à durcir (attente de tous les statuts terminaux).

**Verdict : PARTIAL** — les deux fixes tête d'affiche sont confirmés sur le rendu réel et la livraison est intègre, mais deux résidus pixel-vrai < 4,5 de la même famille translucide amont persistent sur des pages du périmètre.
