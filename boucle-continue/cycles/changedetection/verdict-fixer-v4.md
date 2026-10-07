# verdict-fixer-v4 — cycle 33 changedetection.io

Date : 2026-10-07. Rôle : fixer v4 sur le verdict **PARTIAL** de
l'auditeur v3 (verdict-auditeur-v3.md, commit 1a3ce8e). Toutes les
preuves ci-dessous sont **rejouées dans cette session** : instance
patchée `~/work/changedetection` :5005 (final-*, sondes F1+F2,
incomplets), clone vierge + patch v4 `~/work/cd-install-v4` :5006
(install-build, seed, rescan, verify).

## Résumé des chiffres rejoués

| Run | occ | règles | incomplets | pages | erreurs |
|---|---|---|---|---|---|
| final-public (:5005) | 0 | 0 | 0 | 1 | 0 |
| final-auth (:5005) | 0 | 0 | 117 | 48 | 0 |
| install-build-public (:5006) | 0 | 0 | 0 | 1 | 0 |
| install-build-auth (:5006) | 0 | 0 | 117 | 48 | 0 |

- verify.mjs **29 PASS / 0 FAIL** sur l'install-build :5006.
- incomplete-probes rejouées : **117 items → 0 CONFIRMED_VIOLATION**
  (RESOLVED/N-A ; rapport git-restauré, verdicts identiques au livré).
- axe-core **4.14.0** (tracé `axeVersion` dans chaque scope.json).
- UUIDs réels du seed passés en env `CD_*` (les défauts audit.mjs
  n'appartiennent pas à ce datastore — sans env les pages uuid
  redirigent vers `/` en ERREUR).

## F1(bis) — `/queue` : fond opaque (corrigé + prouvé pixel-vrai)

**Constat auditeur** : `.queue-panel { background: rgba(0,0,0,.05) }`
translucide → le dégradé fixe `body::after` transparaît sous les textes
`#c2c2c2@0.7` : composite **2,82–3,03:1 clair / 4,03–4,43:1 sombre** < 4,5.
Aucun token texte seul ne passe sur ce fond.

**Correctif retenu** (préserve le design) : `.queue-panel` passe à
`background: var(--color-background-page)` — opaque #262626, **couleur
propre du fond de page** du produit (les deux thèmes la partagent).
L'esthétique « carte sombre unie sur dégradé » est conservée à
l'identique ; seule la translucidité parasite disparaît. La cellule/row
n'est pas touchée : corriger le contenant corrige toutes les rows d'un
coup.

Deux sous-découvertes de la sonde pixel, corrigées dans le même hunk :

- `thead th` : restauré `color: var(--color-text)`. L'élément `thead`
  peint la bande `--color-background-table-thead` thémée (#e0e0e0 clair
  / #333 sombre) SOUS les cellules transparentes — la paire correcte est
  donc celle du thème, pas `--color-white` (mesuré 1,32:1 sur la bande
  claire). Résultat : **9,57:1 clair / 12,63:1 sombre**.
- `.queue-stat--action .button-secondary` : le token
  `#1f86a5` = 4,19:1 sur libellé blanc (violation amont, déjà flaguée en
  baseline axe). Durci scopé queue → `background: #14677d` =
  **6,43:1 mesuré** ; le token global n'est pas touché.

**Sonde réécrite en pixel-vrai** (`tools/probe-f1-queue.mjs`, preuve
`reports/f1-queue-probe.jsonl`) — la sonde v3 repliait les ancêtres DOM
et ratait `body::after` : remplacée par l'échantillonnage screenshot
réel — PNG décodé in-page, fond = **médiane des pixels propres** du
rect de l'élément moins l'encre texte et les boîtes de descendants,
chaîne self → parent → grand-parent (seuil 40 px propres, replis
`folded-ownbg`/`thin` tracés), `fg × opacité effective` composé sur le
pixel réel, ratio WCAG 1.4.3. Deux passes par thème (`early` = rows
busy/queued vivantes via vrais rechecks API, `late` = post-fondu) —
**exit 0** : 166 relevés (busy 78, queued 30, static 44, idle 8,
is-completed 10), **pire non-completed 4,59:1** (smalls #c2c2c2@0.7
mesurés 4,59–4,93:1, textes 8,5–15,13:1, tags 6,4–8,72:1). Les rows
`is-completed` restent sous 4,5 par convention amont (ghost à fondu
`opacity:.45`, non plafonnées — cf. convention transitoire v3). Artefact
bord : le rail `.action-sidebar` amont s'étend en `:hover` (souris
Playwright au repos en 0,0) + ombre 28 px couvrait le `th #` → mesuré
1,2:1 ; corrigé en écartant la souris + settle 400 ms avant chaque
capture (l'occlusion au survol est le design amont, pas une paire de
contraste).

## F2 — `recheck-proxy.js` : statuts de check proxies (corrigé + prouvé)

**Constat auditeur** : `<span style="color:red">X</span>` injecté en
inline, ≈ 4,0:1 sur carte blanche (`settings#proxies` /
`edit#request`).

**Correctif** : spans basculés en classes `.proxy-check-ok` /
`.proxy-check-err` ; styles thémés dans `_extra_proxies.scss` (bloc
`body.proxy-check-active #request` existant) — clair : `#008000` OK /
`#b91c1c` X ; sombre : `#42dd53` / `#ffb3b3` (mêmes valeurs que les
tokens amont `--color-background-button-*`/`--color-watch-table-error`)
+ `.proxy-check-details` sur `--color-text-input-description`,
`.proxy-timing` sur `--color-link`.

**Sonde** (`tools/probe-f2-proxy.mjs`, même moteur pixel — niveau
grand-parent ajouté : le span `X`/`OK` est text-tight et son parent
`.proxy-status` est entièrement couvert, la surface mesurée est le `<li>`
de la carte) : `/edit/<uuid>#request` réel, clic `Check/Scan all` →
proxy seedé mort (`127.0.0.1:3128`) → statut terminal ERROR après
~31 s de retries réels ; **exit 0** : X **6,47:1 clair / 5,73:1 sombre**,
OK 5,14 / 5,43, details 5,74 / 5,47, timing 6,18 / 5,82 sur pixels
mesurés [255,255,255] / [68,68,68]. 4 spans terminaux capturés.

## Chaîne install-build rejouée bout-en-bout

1. Clone vierge `~/work/cd-install-v4` @ `a1ce3561` →
   `git apply --check` patch v4 : **0 rejet**, `git apply` OK
   (45 fichiers).
2. `npm install && npm run build` (sass) → `styles.css` sha256
   **`2d2042b4…f5a`** **byte-identique** à l'artefact servi par :5005.
   Piège levé : `_a11y.scss` (créé en v3) était resté non suivi → absent
   du patch v3 (le build échouait sur clone vierge à l'import
   `parts/a11y`) ; rétabli via `git add -N` — le patch v4 est complet.
3. Boot :5006 avec l'env complet du manifeste (`ALLOW_IANA_RESTRICTED…`,
   `SALTED_PASS`, `PLAYWRIGHT_DRIVER_URL` → cdp-spawn-proxy :9333,
   `FETCH_WORKERS=4`), datastore frais, `seed.py` exit 0 (3 fetch réels
   + legacy-down en erreur attendue, 2 tags).
4. Rescan : public 0/0/0/0 ; auth **0 viol/0 err/117 inc/48 pages** —
   identique au final-auth de :5005.

## Limites

- `/queue` n'est mesurable par axe qu'à l'instant du scan (rows
  transitoires) : la preuve F1 repose sur la sonde pixel-vrai exécutée,
  pas sur axe — protocole exigé par l'auditeur.
- Les rows `is-completed` (fondu amont à `opacity:.45`) restent sous
  4,5 en milieu de fondu — convention transitoire déjà admise en v3,
  non plafonnées par le gate.
- `install-build-public` se limite à `/login` (commande manifeste) —
  identique à final-public.
- `git apply --check` rejoué sur clone propre, mais le datastore
  d'origine :5005 ayant muté entre les seeds, les UUIDs diffèrent d'une
  instance à l'autre — pris en charge par `CD_*` env, sans impact sur
  le patch.

## Artefacts produits / mis à jour

`patch.diff` (v4 — 45 fichiers, _a11y.scss inclus),
`tools/probe-f1-queue.mjs` (réécrit pixel-vrai),
`tools/probe-f2-proxy.mjs` (nouveau),
`reports/f1-queue-probe.jsonl`, `reports/f2-proxy-probe.jsonl`,
`reports/{final,install-build}-{public,auth}/`,
`results.json` (entrée `corrections_post_audit_warts` v4),
`provenance.json` (re-hashé en dernier via rehash-provenance.py).
