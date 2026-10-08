# Verdict auditeur — cycle 39 wekan/wekan @6c95ad716d5c (v12.21.0)

**Verdict : CONFIRMED** — rejeu indépendant complet, zéro confiance (auditeur :
devin-04041c4c, 2026-10-08). Deux instances propres construites par mes soins :
`:6380` (clone patched par mes soins, stack dev) et `:6381` (install-build :
worktree vierge @SHA + `git apply` + `meteor npm install` + `meteor run`).
MongoDB 6 replicaSet `rs0` en conteneur `wekan39-db` dédié, seed rejoué,
`auth.json` régénéré par origine (storageState lié à l'origine — localStorage
`Meteor.loginToken`).

## Rejeu point par point

| Claim worker | Rejeu auditeur |
|---|---|
| patch sha256 `717f8d6d`, 61 fichiers, 3569 lignes, `git apply --check` 0 rejet | **confirmé à l'octet près** : mon sha256 = sidecar ; `wc -l patch.diff` = 3569 exact ; appliqué propre sur clone @`6c95ad7` ET sur worktree vierge (61 fichiers modifiés, 0 rejet) |
| baseline 932 auth + 23 public / « 21 règles » | **totaux reproduits bit-identiques** : vanilla @SHA bootée par mes soins → auth **932 occ / 15 règles / 386 inc**, public **23 occ / 6 règles** — nœud-par-nœud : seules diffs = ids mongo aléatoires, datetimes, n° de semaine (1 diff cosmétique résiduelle : sélecteur CSS échappé `#\39 …`). **Mais le décompte de règles est faux** : union auth∪public = **18 règles uniques**, pas 17 (manifest/results/REGISTRE) ni 21 (prompt) — W1 |
| final 105 scans 0 viol / 0 err / 848 inc | **confirmé sur le fond** : mon rescan :6380 = **105 scans, 0 violation, 0 erreur** ; incomplets **851 ≠ 848** (+3, tous expliqués, data-dépendants : `admin/problems/api` color-contrast 19 vs 18 et lcnm 10 vs 9 — ligne d'avatar en plus ; `admin/problems/security-report` +1 `th-has-data-cells` — table vide → indéterminé). Ancres inspectées en live : `title`/`aria-label` bien présents post-patch. Pas de violation — mais le chiffre livré n'est pas reproductible à l'unité — W3 |
| couverture admin élargie (+54 routes, panes people/settings/boards) | **confirmé et complet** : les **56 panes** réels de `models/lib/adminUrls.js` (settings 7 + people 17 + problems 21 + attachments 11) sont **tous** dans `urls-auth.txt` (86 routes), 0 viol partout chez moi. « 58 panes » = surcomptage — W2 |
| 14 états déclarés, stateProofs + sélecteurs déterministes (leçon 32) | **confirmé ×2 stacks** : les 14 états (`board-sidebar`, `board-filter-sidebar`, `board-search-sidebar`, `board-menu-popup`, `card-details`, `card-details-menu`, `minicard-menu`, `list-menu-popup`, `header-member-menu`, `header-starred-boards`, `new-board-popup`, `allboards-sidebar`, `mobile-board-390`, `mobile-card-390`) rejoués sur :6380 et :6381 — chaque `setup` finit par un `waitForSelector` de preuve, 0 erreur nulle part. Garde hydratation (`waitHydrated` : `.auth-layout|#content` + texte >20c + `settleMeteorSession` : `Meteor.userId()` + stabilisation de path) suffisante — leçon 34 tenue, `domcontentloaded` partout (socket DDP ≠ networkidle) |
| verify.mjs 61/61 ×2 (dev + IB) | **rejoué : 61 PASS / 0 FAIL sur :6380 puis 61 PASS / 0 FAIL sur :6381** — assertions réelles (oklab→sRGB, luminance, effectiveBg, accName⊇visible L29, cibles 24px, h1 panes admin, error contrast login, mobile 390) |
| sondes 848 → 792 conformes + 56 N-A ; lcnm custom | **rejoué : 851 → 794 conformes + 57 N-A / 0 non-conforme / 0 non-retrouvée** (δ cohérent avec W3, mêmes familles N-A : glyphes aria-hidden, initiales avatar accName-seul). **lcnm éprouvé par injection réelle** : `aria-label="Réglages du serveur distant"` posé sur `.header-user-bar-name` (visible « audit.c39 ») → la sonde livrée retourne `pass:false` « visible «audit.c39» absent du nom accessible ». La règle 2.5.3 custom détecte vraiment |
| install-build : clone vierge + apply + `meteor npm install` + boot + rescan identique | **rejoué de bout en bout** : `git worktree` vierge @`6c95ad7` → `git apply` 0 rejet (61 f) → `meteor npm install` → `meteor run :6381` (même db seedée, ids littéraux stables) → rescan verbatim **105 scans / 0 viol / 0 err / 851 inc — identique à mon dev :6380** |
| eval 45/45 | **rejoué : 45/45 contrôles OK, 0 FAIL, 4 N-A** (honêtes : Escape sans handler amont, UI pilotée par ancres sans `<button>` natif ×2, transitions 0.1s) |
| provenance 44/44 --strict | **vérifié en lecture seule** : 44/44 empreintes sha256 exactes, 0 fichier manquant, 0 fichier livré non listé (artefact de mon rejeu `incomplete-probes-*.json` retiré avant commit) |
| REGISTRE ligne 39 | présente — verdict `—` remplacé par le mien |

## Corrections structurelles — vérifiées en live

- **Landmarks + h1** : `admin-pane-title` h1 → contenus de panes en h2 ;
  login/sign-in : h1 + `<main>` présents.
- **Labels idiom amont** : `label.title(for=id)` généralisé ; aria-label `{{_ i18n}}`
  sur contrôles sans id — même chaîne i18n que le texte visible → 2.5.3 sûr par
  construction + sonde éprouvée.
- **aria-label ⊇ texte visible** (leçon 29) : propagation `copyTitleInAriaLabel`
  upstream vérifiée au DOM rendu.
- **Contrastes mesurés pixel-vrai** (leçon 31) : `.ldap-source-badge`
  #767676→#595959, `.cloud-input-*` →#595959, tokens header/boards/sidebar/
  cardDate — tous ≥4.5 aux sondes.
- **Cibles ≥24×24** (WCAG 2.5.8) : `js-*-feature-all`, notify-option, poignées.
- **Rôles/ARIA Blaze** : rôles illégaux retirés des ancres, parent/children
  rétablis, `aria-expanded` via `{{#if}}true{{else}}false{{/if}}` (Blaze vide
  sur `false`), scrollable `tabindex=0`.

## Hors-scope restant (chasse active — scanné par mes soins, axe 4.14 live)

Surfaces réelles du produit absentes des 105 scénarios — **toutes propres** :

- `/b/:boardId/:slug/list/:listId` (route `LIST_ROUTE_PATH`, vue filtrée liste) → 0 viol, 2 inc
- `/b/:boardId/:slug/swimlane/:swimlaneId` (route `SWIMLANE_ROUTE_PATH`) → 0 viol, 2 inc
- Popup `editProfile` (header member menu → `.js-edit-profile`) → 0 viol, 2 inc

Aucune violation introduite détectée. Redirections legacy `/setting`,
`/information`, `/translation`, `/remaining`, `/templates` = exclusions
documentées au manifest. Inventaire `FlowRouter.route` exhaustif par ailleurs.

## Warts

- **W1 — décompte règles baseline faux** : « 17 règles uniques » (commit, results,
  REGISTRE) → réel **18** (15 auth + 6 public, 3 communes : color-contrast,
  heading-order, target-size ; public-only : empty-heading, landmark-one-main,
  region). Le prompt worker disait même « 21 règles ».
- **W2 — décompte panes admin incohérent** : « 58 panes » (manifest/REGISTRE) vs
  **56 réels** ; « +54 routes » vs « +51 panes » selon les documents.
- **W3 — incomplets non déterministes** : 848 livré vs 851 mesuré ×2 stacks
  (avatar row admin/problems/api, table vide security-report → `th-has-data-cells`
  indéterminé). Aucune violation, mais le chiffre bouge avec les données —
  les deltas sondes restent cohérents (794+57 vs 792+56).
- **W4 — périmètre non exhaustif au niveau routes** : `LIST_ROUTE_PATH`,
  `SWIMLANE_ROUTE_PATH`, popup `editProfile` non couverts — 0 viol chez moi
  (gap de déclaration, pas de violation cachée).
- **W5 — outillage** : `login.mjs` ignore argv (env `WEKAN_BASE`/`RUN_DIR`
  seulement) ; `seed.mjs` a container `wekan39-db` et db `wekan` en dur.

## Note finale

CONFIRMED = reproductibilité axe + santé du patch (protocole boucle), pas une
attestation de conformité WCAG. Stack 1re boucle correctement domptée :
Meteor/Blaze async couvert par la garde d'hydratation + stateProofs, seed
déterministe par ids littéraux, patch livré en diff (AGENTS.md amont interdit
le push — respecté, `results.json` verdict:null conforme au protocole).
