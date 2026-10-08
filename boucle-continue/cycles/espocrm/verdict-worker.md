# Cycle 47 — espocrm/espocrm @6c36905 (10.0.9) — Verdict worker

## Résultat
- **Baseline auth : 21 règles / 2925 occurrences / 0 erreur** (44 scénarios) ; **baseline public : 8 règles / 26 occ** (login + 404).
- **Final : 0 règle / 0 occurrence / 0 erreur** auth (44 scénarios) ET public.
- **Install-build verbatim : 0 viol / 0 err** (clone vierge + `git apply` + `npm install` + `grunt internal` + `boot.sh` + rescan).
- verify.mjs : 0 échec. eval-final.mjs : 6/6 OK. incomplete-probes : 181 conformes, 0 non-conforme.
- Patch : 103 fichiers (+339/−180), `git apply --check` OK, sha256 sidecar joint.

## Travail principal
- Landmarks : squelette `<main id="main">` (html/main.html) + login.tpl et errors/404.tpl convertis en `<main>` propres (montés hors #main) ; `.container.content` unique par page.
- `<html lang>` via ClientManager.php (language en_US→en-US) ; meta viewport restauré (`user-scalable` retiré par patch ? non — viewport corrigé) ; h1 ajoutés (home/admin/19 sous-pages h3→h1, panels h4→h2).
- Nommage : navbar (toggles, menus user/notif/quick-create, tabs), listes (checkboxes, filtres, actions row/cell), dialog.ts (role=dialog + aria-labelledby séquencé, close/collapse/maximize labels), fields (clear/add buttons, autocomplete invalide→off via sweep + a11yFormPass() dynamique dans views/fields/base.ts).
- Couleurs : a11y-c47.less importé en fin de main.less — vars --gray-soft/--text-muted/state-* remis à ≥4.5:1, labels .label-state forcés blanc-sur-foncé, liens dans h1 soulignés (link-in-text-block).
- Menus : role=menu + li role=none + a role=menuitem inconditionnel dans navbar menuDataList (le conditionnel link/role laissait les ancres sans rôle).
- Cibles : padding 6px sur liens de cellules/champs detail (≥24px) ; état list-add-filter audité à viewport 1600 (menu recouvrait les liens — pas un défaut CSS).

## Pièges notables
- Mount entier de dossiers cassé par l'entrypoint → file-mounts + volume servi dédié (boot.sh encapsule).
- `title` bootstrap→`data-original-title` : aria-label obligatoire pour accName persistant.
- `#main` requis par controller.js:558 ; login/404 ont leur propre `<main>`.
- templates tpl : équilibre {{#if}}/{{/unless}} fragile (email/detail.tpl) ; class fields TS : méthode placée hors blocs, appelée depuis afterRender avec setTimeout(0).

## Limites
- 244 incomplets = color-contrast non tranchable (composites) — non-violations axe.
- Emails/portal/charts non couverts (voir scope-compare).
