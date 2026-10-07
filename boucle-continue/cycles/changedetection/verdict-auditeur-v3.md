# Verdict ré-auditeur v3 — cycle 33 : dgtlmoon/changedetection.io @ a1ce35619aae

**Verdict : PARTIAL**

Ré-audit indépendant du fix v3 (f098095) après le PARTIAL de v2 (743eae1 : résidu F1 `/queue` 1,05:1 + wart fixture `:5599`). Stack auditeur propre, aucune confiance aux artefacts : clone vierge upstream @a1ce35619aae + `git apply patch.diff` v3 (**43 fichiers, 0 rejet**) → `~/work/cd-install` sur **:5018** ; instance patchée `~/work/changedetection` sur **:5017** ; datastores frais seedés par `tools/seed.py` ; fixtures réelles servies sur **:5799** ; proxy CDP spawn-per-connection **:9333** ; `npm ci` dans tools/ → axe **4.14.0**. Ports exclus (:5005/:5006/:5599) respectés.

## Chiffres rejoués (v3) vs livrés

| Run | Livré | Rejoué | Concordance |
|---|---|---|---|
| patch.diff v3 | 43 fichiers | **43 fichiers, 0 rejet** sur clone propre | identique |
| baseline-public | 12 occ / 6 règles | **12 / 6** | identique |
| baseline-auth | 1316 occ / 14 règles (leur re-run) ; 1328 livré v2 | **1328 occ / 14 règles / 117 nœuds incomplets** | **identique au livré v2 à l'occurrence près** ; variance 1316↔1328 = mutation datastore par rechecks — mécanisme vérifié (mes rechecks F1 mutent aussi les rows), explication honnête |
| final-public / final-auth | 0 viol / 48 pages | **0 viol / 48 pages, 117 nœuds inc** | identique nœud-par-nœud |
| install-build (clone+patch+venv+datastore frais) | 0 viol | **0 viol** (:5018, public+auth) | identique |
| verify.mjs | 29 PASS / 0 FAIL | **29 / 0** sur :5018 avec MES rapports (`--cycle-dir` vers mon dossier rejoué) | identique |
| incomplete-probes | 117 items, 0 CONFIRMED, 75R+42NA | **117 items, 0 CONFIRMED, 75 RESOLVED / 42 N-A** sur :5017 avec MON rapport | identique, distribution incluse |
| eval-final | 1328→0 | **1340→0** (baseline public 12 + auth 1328), missing=[], unresolved=[], 0 erreur d'état | mêmes résultats structurels |
| styles.css buildé | sha256 `5c397514…` | **`5c3975140d01fe0b756a5e4c0619a12a30cfefb6c4b6e8723f491a18bc890ccd`** sur les deux arbres (patché + install-build) | byte-identique |
| provenance.json | 44 entrées | **44/44 re-hachés OK** par `rehash-provenance.py` lancé moi-même | ✓ sauf wart ci-dessous |

## Garde anti-scan-vide (wart W2-v2) — **clos, prouvé en échec**

L'état `addwatchui-live-preview` (audit.mjs L341-372) est maintenant paramétré par `CD_FIXTURE_BASE` et échoue **bruyamment** dans les deux cas éprouvés :

- **Fixture morte** (`CD_FIXTURE_BASE=http://127.0.0.1:5999`, rien servi) : l'état produit `error: fixture injoignable … connect ECONNREFUSED` dans le rapport et le run **exit 2** — pas de 0-viol silencieux.
- **Fixture vivante mais mauvais markup** (`CD_FIXTURE_BASE=http://127.0.0.1:5018`, l'app elle-même → 404) : `error: fixture … ne sert pas le markup attendu (HTTP 404)`, **exit 2**.
- Garde de second étage (xpath_data.size_pos portant `#auth|#endpoints|#rate-limits|#changelog`) présente dans le code, cohérente.

## F1 /queue — **NON résolu : le composite réel reste < 4,5:1 dans les deux thèmes**

Le fix (`#c2c2c2` uniforme dans les hunks `renderWatchCell` + frères) est mesuré par le fixer via `tools/probe-f1-queue.mjs`, qui affirme **4,60–5,05:1** et exit 0. J'ai rejoué la sonde à l'identique : elle exit 0, `worstNonCompletedRatio=4.6`, sur 20 vraies rows JS provoquées par rechecks API sur mon install-build — **la reproduction stochastique demandée est faite, et le claim de la sonde se rejoue**.

**Mais le modèle de fond de la sonde est faux.** `probe-f1-queue.mjs` plie seulement la chaîne `backgroundColor` des ancêtres DOM et tombe sur `rgba(0,0,0,0)` partout → il substitue un fond `#262626`-esque (bg rapporté `[36,36,36]`–`[45,45,45]`). Or :

1. `table.pure-table` dans `.queue-panel` est `background: transparent` (commentaire amont : *« table sits over the colorful gradient page bg »*) ;
2. `.queue-panel` lui-même = `background: var(--color-background-new-watch-form)` = **`rgba(0,0,0,0.05)`** — translucide, identique dans les deux thèmes ;
3. Le vrai sous-jacent peint est le `body::after` **fixe** (z-index −1, opacity .91) : dégradé `#5ad8f7→#2f50af→#9150bf` en clair, `#3f90a5→#1e316c→#4d2c64` en sombre. Une pseudo-couche fixe hors des ancêtres — invisible pour le pliage DOM.

**Mesure pixel-vraie** (screenshot SwiftShader, médiane sur bande propre de chaque cellule, fg `#c2c2c2` fondu à `opacity .7` du `<small>` = composite réel du texte) sur mon install-build avec rows JS réelles :

- **clair : 2,82–3,03:1**, pire cas **2,82** (fonds mesurés `rgb(62,79,162)`/`rgb(54,72,159)` — le bleu du dégradé)
- **sombre : 4,03–4,43:1**, pire cas **4,03** (fonds `rgb(36,44,94)`–`rgb(49,52,101)`)

Le claim « pire cas 4,60 » est artefactuel : il mesure un sous-sol `#262626` qui n'est jamais peint sous ces cellules. Sur le rendu réel, `#c2c2c2` à opacity .7 donne **2,8–3,0:1 en clair** (toutes les rows échouent) et **4,0–4,4:1 en sombre** (pire cas sous 4,5). F1 = violation WCAG 1.4.3 toujours présente, meilleure que les 1,05:1 de v2 mais non conforme.

**Jugement sur le choix de token** : `#c2c2c2` est un choix honnête de direction (cohérent avec les hunks frères, déjà utilisé pour `--color-text-input-description` en sombre) et mieux que le `var(--color-white)` alternatif — sous le vrai sous-jacent, `#fff` donnerait ~1,7:1 en clair (dégradé cyan lumineux), donc « white ~8:1 » n'était vrai que sur le fond imaginaire. En réalité **aucun token de texte seul ne passe sur un fond translucide au-dessus d'un dégradé multicolore clair** : le fix correct impose un fond de cellule opaque (ou semi-opaque épais) puis du blanc, ou une règle par thème. À reprendre par le fixer v4.

## Chasse — autres fragments JS re-rendus invisibles au scan statique

Énumération des écritures DOM dynamiques (`static/js/*.js`) + vérification du sous-jacent réel :

- **`recheck-proxy.js:20/24`** — `set_proxy_check_status` injecte `<span style="color: green">OK</span>` / `<span style="color: red">X</span>` dans `.proxy-status` (settings#proxies, au clic « recheck proxies »). Sous-jacent réel : `.box-wrap.inner` `rgb(255,255,255)`. Mesuré : `green` ≈ **5,13:1 OK** ; `red` #ff0000 ≈ **4,0:1 → résidu** (même classe F1 : markup transitoire jamais vu par le scan statique). Signalé au fixer.
- **`watch-overview.js:158`** — `#copied-clipboard` `color:#fff` ajouté à `.with-share-link` pendant 2,5 s. Non reproductible ici (pas de share URL configurée dans le seed) ; surface bouton probablement foncée → noté candidat, non confirmé.
- **`visual-selector.js:114`** — `.css('color','#bb0000')` sur le chemin d'erreur (screenshot non chargé) : #bb0000 sur la carte blanche ≈ **6,7:1** — conforme.
- **`notifications.js`, `flask-toast-bridge.js`, `toast.js`** — pas de couleur inline texte (le warning Discord est un élément pré-rendu affiché/masqué).
- **`browser-steps.js`** — bascules `opacity` 0.5/0.65/1.0 = affordance UI, pas du texte.
- **`watch-overview.js` (97-118, 422-448)** — les `css('background-color')` restaurent les bgs de rows avant/après une inline-row (restock/AI summary) : bgs réinjectés, pas de fg inline.
- **`realtime.js`** — `.html(watch.error_text)`/`.status-text` réutilisent les classes SSR : couvertes par le scan quand l'état existe au moment du run (classe stochastique connue, pas un résidu).

## Warts

- **W-provenance** : 44/44 empreintes re-hachées OK **mais** `rehash-provenance.py` signale **3 fichiers v3 livrés non listés** : `tools/probe-f1-queue.mjs`, `reports/f1-queue-probe.jsonl`, `verdict-fixer-v3.md`. La provenance v3 est incomplète — les artefacts existent et sont authentiques, mais le registre ne les couvre pas. Correction = re-hash + ajout des 3 entrées.
- **W-sonde-F1** (cause racine du PARTIAL) : `probe-f1-queue.mjs` documente son modèle comme « bg effectif » alors qu'il ne plie que les ancêtres DOM — il faudrait soit un screenshot+échantillonnage pixel (ma méthode ici), soit intégrer la couche fixe `body::after` (getComputedStyle + z-index/position). Sonde fiable en structure (vraies rows, exit code) mais sa métrique fond est fausse.
- **W-hunt** : résidu `color:red` proxy-check 4,0:1 (transitoire, settings#proxies).

## Ce qui est confirmé

Garde anti-scan-vide prouvée en double mode d'échec ; rejeu complet bout-en-bout identique (0 rejet patch, baselines à l'occurrence près, 0 viol final/IB, verify 29/29, sondes 117/0 CONFIRMED même distribution, eval 1340→0) ; styles.css sha256 conforme ; explication de variance baseline honnête et vérifiée.

## Ce qui reste ouvert

- F1 `/queue` : composite réel **2,82:1 pire cas clair / 4,03:1 sombre** < 4,5 — fix insuffisant (modèle de fond erroné dans la sonde).
- `recheck-proxy.js` `color:red` 4,0:1 — même classe, nouveau résidu détecté.
- provenance : 3 fichiers v3 non couverts.

**Verdict : PARTIAL** — mécanique de livraison entièrement reproduite et honnête, mais le correctif tête d'affiche (F1) ne résout pas la violation sur le rendu réel, et un second résidu de même classe existe.
