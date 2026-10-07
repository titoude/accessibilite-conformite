# Verdict fixer v3 — cycle 34 stump/stump @42a9918c1542

Réponse à `verdict-auditeur-v2.md` (commit `b64058f`, verdict CONFIRMED + finding F-v2 + wart provenance).
Toutes les corrections ont été **exécutées et mesurées live** — aucun correctif livré non vérifié.

## F-v2 — famille trigger→`<div>`, sites résiduels

**Mécanisme** (inchangé depuis v2) : Radix `*.Trigger asChild` injecte `aria-haspopup`, `aria-expanded`,
`aria-controls`, `type=button` sur l'élément référencé. Un `<div>` les reçoit illégalement
(`aria-allowed-attr`) ; un `<button>`/`<Button>` les supporte.

**Chasse exhaustive** : grep/scan multi-passes sur `packages/{browser,components,client}/src`
(`trigger={<div`, `asChild` suivi d'un non-interactif, `const X = <div…>` consommé par un Trigger,
`renderTrigger`) — **4 sites corrigés** au total, pas seulement les 2 cités :

| Fichier | Site | Fix |
|---|---|---|
| `packages/components/src/calendar/DatePicker.tsx` | `PopoverTrigger asChild` entourait le `<div>` layout (label+champ) — **PROUVÉ live** : 1 `aria-allowed-attr` à l'ouverture de « Create API key » | Trigger déplacé sur le `<Button>` interne ; le `<div>` redevient un pur conteneur de layout hors trigger |
| `packages/browser/src/components/Pagination.tsx` | `trigger={<div><button …/></div>}` | `trigger={<button type="button" aria-label="Go to page" …/>}` direct — composant mort (aucun caller live) mais pattern corrigé quand même |
| `packages/browser/src/components/table/Pagination.tsx` | ellipsis `PagePopoverForm` → `<Button size="icon">` icône-only sans nom — **latent** (n'apparaît qu'avec >10 pages) | `aria-label="Go to page"` sur le Button |
| `packages/browser/src/components/readers/imageBased/container/NextInSeries.tsx` | `const trigger = <div …>` consommé par `Popover.Trigger asChild` + `HoverCard` — reader hors-scope, préventif | `<button type="button" aria-label={t(…)}>` même classes |

**Finding bonus découvert par le nouvel état** : `PagePopoverForm.tsx` — `Popover.Content`
(`role="dialog"`) n'avait aucun nom accessible → `aria-dialog-name`×1 quand l'ellipsis ouvre le popover.
Jamais mesuré avant v3 : la surface (pagination peuplée) n'existait dans aucun run. Fix :
`aria-label="Jump to another page"` (même texte que le label de l'input du form).

## États ajoutés (F-v2 #3 — sinon le fix n'est jamais scanné)

- **`api-key-create-modal`** (`/settings/api-keys`) : clic « Create API key » → `[role=dialog]` visible →
  le DatePicker (fixé) entre dans le DOM scanné.
- **`login-activity-pagination`** (`/settings/users`) : le seed top-up `user_login_activity` à
  **125 lignes** via `POST /api/v2/auth/login` réels (chaque succès insère une ligne serveur) →
  `LoginActivityTable` (pageSize 10) rend 13 pages → l'ellipsis apparaît → clic → `PagePopoverForm`
  ouvert (input « Jump to another page » monté). Ordre conservé : états mutants
  (`dark-theme`, `mobile-nav`) en dernier.

Rejeu : `final-auth` **53 scénarios** (42 urls + 11 états) — les deux nouveaux états : 0 viol / 2 inc
chacun ; sondes `aria-valid-attr-value` Radix (popup lazy-mount) résolues conformes en phase-2
(réouverture réelle du popup).

## Wart provenance

`tools/package-lock.json` était dans `files{}` **et** `excluded[]` → retiré d'`excluded[]` (il reste
hashé dans `files{}`). Plus de doublon files∩excluded.

## Vérif live demandée (mesurée par moi, pas rejouée d'un artefact)

- Modale « Create API key » ouverte sur :19334 → axe injecté : **0 `aria-allowed-attr`**,
  `div[aria-haspopup|aria-expanded]` = **0**, triggers popup = **9× `<button>`**.
- Pagination peuplée : `button[aria-label="Go to page"]` rendu, 0 div-popup dans la nav, clic →
  `form[id^="pagination-page-entry-form"]` monté, `<role=dialog aria-label>` mesuré.
- Note flake : un run intermédiaire a mesuré `/settings/email/new` sur le **splash-screen**
  (3 pseudo-violations landmark/h1/region — page pas hydratée dans les 500 ms) ; re-scan isolé → 0.
  Le run final livré a tout à 0.

## Chiffres rejoués (tous exécutés cette session, ports fixer-v3 :19334/:19335)

| Rejeu | Résultat |
|---|---|
| `git apply` patch v2 sur clone propre @42a9918 | 136 fichiers, 0 rejet |
| Builds | `yarn install --frozen-lockfile` 93s + `yarn web build` ~25s + `cargo build -p stump_server` 4m44s (:19334) / 4m20s (:19335) |
| seed.mjs (:19334 + :19335, db vierges) | register 200, 9 media READY, login-activity → 125 lignes, exit 0 ×2 |
| UUIDs réécrits (sqlite, `PRAGMA foreign_keys=OFF`, transaction) | 13 refs/db → valeurs épinglées des probes/urls |
| final-public (:19334) | 0 règle / 0 occ / 0 err / 2 inc |
| final-auth (:19334, 42 urls + 11 states = 53 scans) | **0 / 0 / 0 / 138 inc** |
| incomplete-probes (:19334, rapports finaux) | **140 sondes → 140 conformes, 0 NC, 0 NR** |
| verify.mjs (:19334) | **47 assertions → 46 PASS / 1 N-A / 0 FAIL** (+6 assertions §13 : modale api-keys + pagination) |
| eval-final.mjs (:19334) | 38/38 (3 N-A honnêtes) |
| install-build :19335 (clone ib, build dans le clone, rescan public+auth 53 scans) | **0 / 0 / 0 / 2+138 inc** |
| incomplete-probes-ib (:19335) | **140 sondes → 140 conformes** |
| patch.diff v3 | 138 fichiers (+544/−302), `git apply --check` sur clone vierge @42a9918 : **0 rejet** — sha256 `34124c25…` |

## Limites résiduelles (honnêtes)

- Les `incomplete` restants (138/138 sondés conformes) = contrastes indécidables axe + idrefs Radix
  lazy-mount — comportement attendu, résolu par sondes, pas masqué.
- `scopeHash`/`statesHash` v3 ≠ v2 : port intégré aux ids (:19334 vs :11334) + 2 états de plus —
  assumé et documenté dans `scope-compare.json`/`states.json`.
- Le composant `components/Pagination.tsx` est mort (aucun caller) : corrigé par exhaustivité du
  pattern, sa surface n'existe pas à l'exécution — mesuré via `table/Pagination.tsx` (le vrai chemin).
- `NextInSeries` (reader imageBased) est hors scope des 42 urls : fix préventif, non mesuré par le
  scan — indiqué comme tel.
- Sessions/lots de login : le top-up crée ~125 entrées `sessions` en plus — conséquence assumée et
  documentée (compteur login-activity ≥125 requis pour l'ellipsis).
