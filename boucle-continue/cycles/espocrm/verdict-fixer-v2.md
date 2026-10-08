# Cycle 47 — verdict fixer v2 (espocrm @6c369056)

Rôle : fermer R1 (résidu produit), R3 (trou verify L43), R4 (warts outillage
a–e) du verdict auditeur `devin-11e5088f`, corriger le compte doc, sans casser
le 0-violation confirmé. Toutes les mesures sont **live**, rejouées par le
fixer sur ses propres instances Docker : `:8647` = upstream+patch v2,
`:8648` = vanilla @6c36905 (image officielle = SHA pinné). R2 est un hors-scope
structurel pré-existant (admis par l'auditeur, identique en vanilla) — non
actionnable, inchangé. R5 est appliqué : sabotage et mesures visent
`res/templates/` servi, jamais le bundle compilé.

## R1 — `.more-dropdown-menu` ouvert garde `aria-required-children`

**(a) État déterministe ajouté** — `nav-more-tabs` devient le 13e état
(état déterministe, leçon 32) : viewport 1050px, trigger
`#nav-more-tabs-dropdown`, preuve `.more-dropdown-menu` visible + `> li a`
visibles. Mesure sur **vanilla :8648** : **12 règles / 102 occurrences** dont
`aria-required-children` ×1 sur `ul.more-dropdown-menu` (enfants `li a[href]`
sans `role=menuitem`) — la violation amont est reproduite par le nouvel état.

**(b) Fix dans les vraies sources** — `client/res/templates/site/navbar.tpl` :
le rôle `menuitem` devient **inconditionnel** sur les enfants du menu
(`role="menuitem" {{#if link}}href="{{link}}"{{/if}}`, deux endroits : items
statiques et sous-menus de groupe) — avant, le `role` n'apparaissait que dans
la branche `{{else}}` sans `href`. `client/src/views/site/navbar.js` : les
déplacements JS des onglets maintiennent les rôles (`hideOneTab` pose
`role=separator` sur `li.tab-divider`, `role=none` sinon, et
`role=menuitem` sur le `a` ; `unhideOneTab` restaure en retirant les rôles).
Rebuild `npx grunt internal` — transpiled vérifié.
**Rescan patché :8647 : 0 règle / 0 occurrence** (état inclus).

**(c) Assertion live verify** — le menu est ouvert, les `li` doivent porter
`role=none|separator`, les `a` `role=menuitem`, puis Escape ferme
(`li.more` sans classe `open` + `ul` non rendu). Fail explicite, jamais skip.

## R3 — Trou verify L43 : slug i18n rendu passe 0 FAIL

**Sonde anti-slug ajoutée** à verify.mjs : tout nom accessible rendu —
`aria-label`, `title`, `placeholder` sur le document entier + `innerText` des
`.label-text/.full-label/.short-label/.dropdown-menu a` — ne doit pas
ressembler à une clé i18n : `^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/i` = FAIL nommé
avec sélecteur + valeur en preuve (le `/i` couvre aussi les clés camelCase
comme `navbar.moreTabsLabel`).

**Sabotage rejoué** (résolu contre le tpl servi `res/templates/site/navbar.tpl`
dans le conteneur — leçon R5) : `aria-label="navbar.moreTabsLabel"` injecté →
**FAIL nommé** `anti-slug i18n: aucun nom rendu en clé i18n non résolue` avec
preuve `a[aria-label=navbar.moreTabsLabel]` — et le vieux check
`navbar: nom accessible moreTabs` PASSAIT toujours (démonstration du trou).
Second sabotage `role="menuitem"` → `role="link"` → **2 FAIL nommés**
(`menu utilisateur: liens role=menuitem`, `menu more-tabs: liens
role=menuitem`). Restauration → **42/42, 0 FAIL**.

## R4 — Warts outillage

- **(a)** docstring `incomplete-probes.mjs` : « cycle 34 (stump) » →
  « cycle 47 (espocrm) ».
- **(b)** navigation morte `#Account/view/` avec `SEED_ACCOUNT_ID` vide dans
  verify.mjs : ligne supprimée.
- **(c)** 3 états en timeout (stream-composer, stream-panel-menu,
  mobile-nav-390) — cause racine prouvée live : les `.modal-dialog` +
  `.modal-backdrop` de `quick-create-modal` **persistent à travers la
  navigation hash** et interceptent les clicks suivants. Fix : avant chaque
  `st.setup`, attente URL-settle + re-goto si hash perdu + cleanup modal
  (Escape → `.modal:visible .close` → balayage DOM `.modal.in,
  .modal-backdrop` → reset viewport). Résultat rejoué : **245 sondes
  (contre 194), 0 timeout** — les 3 états tournent.
- **(d)** 5 lignes whitespace (space-before-tab ×2 dans
  `res/templates/import/index.tpl`, trailing ×3 dans `login.tpl` — fichiers
  CRLF) corrigées dans les sources ; `git diff --check` = **0 warning** sur le
  patch régénéré.
- **(e)** compte doc corrigé : réel = **32 routes + 13 états = 45 scénarios
  auth** (manifest.json `states` → 13, results.json `final.auth` 45/245,
  scope-compare.json, REGISTRE ligne 47).

## Rejeu complet

| mesure | :8647 patché v2 | :8648 vanilla |
|---|---|---|
| axe auth | **0 règle, 0 occurrence**, 245 inc, **45 scénarios** (32 routes + 13 états) | état `nav-more-tabs` : 12 règles / 102 occ dont `aria-required-children` ×1 |
| axe public | 0 règle, 0 occurrence, 0 inc | — |
| verify.mjs | **42/42, 0 FAIL** | — |
| eval-final | **6/6 (2 N-A)** | — |
| sondes incomplètes | 245 sondes → **175 conformes / 0 NON CONFORME / 68 non retrouvées** | — |
| sabotage slug | FAIL nommé `anti-slug i18n` | — |
| sabotage rôles | 2 FAIL nommés (menus utilisateur + more-tabs) | — |

## Livrables

- `patch.diff` régénéré depuis l'arbre vérifié : **104 fichiers, +351/−181**
  (+1 fichier vs v1 : `client/src/views/site/navbar.js` — le fix JS rôles) ;
  `git apply --check` OK sur clone vierge @`6c36905` (tag 10.0.9) ;
  `git diff --check` 0 warning.
- `patch.diff.sha256` = `918cfd6829b985dc4161af56e3f05017357a5639557f7827119e2fc811a72c11`.
- Outils : audit.mjs (état 13), verify.mjs (anti-slug + more-tabs live + nav
  morte retirée), incomplete-probes.mjs (docstring + modal-cleanup).
- Les outils ad hoc de diagnostic (`probe-moretabs.mjs`,
  `force-overflow.mjs`) ont servi à la mesure mais **ne sont pas livrés** —
  l'évidence vit dans ce verdict et results.json.
- `manifest.json`, `results.json`, `scope-compare.json` : comptes 45
  scénarios (32+13) ; section `fixer_v2` de `results.json.verification`
  consigne le résumé.

## Limites restantes (connues, non masquées)

- R2 hors-scope admis : `#Admin/upgrade`, `#Admin/fieldManager`, tuiles
  entityManager — violations amont identiques en vanilla, hors du patch.
- 245 incomplets = contrastes composites alpha/gradients non tranchables par
  axe (inchangé).
- `in-more` items du menu more-tabs sont statiques en 10.0.9 (séparateur
  `_delimiter_` des Preferences) ; le chemin JS `not-in-more` est quasi mort
  — le fix js reste défensif.
