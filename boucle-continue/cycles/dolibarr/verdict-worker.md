# Cycle 57 — verdict worker : Dolibarr 24.0.2 (7e92776)

## Livré
- `patch.diff` (20 fichiers htdocs/, +274/−76) + `patch.diff.sha256` — sources réelles uniquement : `htdocs/core` (functions.lib.php, html.form.class.php, menus eldy/auguria, tpl objectline/login/passwordforgotten, modules_boxes, commonorder, timespent, lib_head.js.php, admin/company.php, index.php), `htdocs/theme/eldy` (global.inc.php, theme_vars.inc.php, info-box.inc.php, btn.inc.php, badges.inc.php).
- `tools/` complet et rejouable : Dockerfile+compose+boot.sh (install CLI rejouée sur clone propre), seed.php/seed.mjs+seed-info.json (ids réels : 3 tiers / 5 produits / 3 factures / users), gen-urls.mjs+urls-*.txt, audit.mjs (axe 4.14.0 + STATES), login.mjs, verify.mjs (35 assertions dures), eval-final.mjs (20 contrôles transverses), incomplete-probes.mjs (composite alpha + sondes par règle).
- `reports/` : baseline-{public,auth} (vanilla @SHA), final-{public,auth}, install-build-{public,auth} (clone propre :9810 + patch), probes/ (incomplete-probes.json + verify-vanilla.txt).

## Chiffres
| Surface | Baseline | Final :9800 | Install-build :9810 |
|---|---|---|---|
| public | 3 règles / 8 occ / 0 err | 0 / 0 / 0 | 0 / 0 / 0 |
| auth | 19 règles / 1860 occ / 0 err / 607 inc | 0 / 0 / 0 err / 303 inc | 0 / 0 / 0 err / 303 inc |

- verify.mjs : **35/35 OK** (vanilla :9810 pré-patch : **22 FAIL nommés** — preuve). Sabotage `$onlycontrols=false` → FAIL nommé `liste: aucun <th> vide`.
- eval-final.mjs : **20/20 OK** (zoom, lang, focus clavier, Escape-dropdown, mobile 390, h1, labels orphelins, select2).
- incomplete-probes : **304 nœuds → 279 OK mesurés / 25 N-A justifiés / 0 NON-CONFORME** (fond image login, états transitoires, espacement axe, labels implicites).
- Baseline vanilla pureté : diff git vide au moment du scan ; même scopeHash baseline=final sur les deux surfaces.

## Correctifs principaux (par règle baseline)
- region 909 → `<main id=id-right>`, nav side/top étiquetées, boxto tabindex+role=region, select2-open → role=dialog.
- listitem 251 → `ul.tmenu` role retiré / wrappers nav corrigés (eldy+auguria).
- color-contrast 175 → palette eldy durcie (titres #005f73, badges #0f7a55/#6a6a85, gris #6e6e6e, opacités 0.68, butActionRefused composite 5.2:1).
- label/label-title-only/select-name/button-name/link-name 288 → aria-labels i18n ($langs->trans) sur champs lignes objets, filtres, select2, checkboxes de masse, titres-only inputs via lib_head.js.php.
- empty-table-header 41 → th vides → td quand contenu = contrôles (multiSelectArrayWithCheckbox/checkforselect) ; sr-only sur linecoledit/delete/move.
- landmark-one-main + page-has-heading-one 48 → h1 réel via load_fiche_titre (+ ensureH1 sr-only), h1 login.tpl.php.
- aria-prohibited-attr 61 → role=img sur badges dot, role=button+aria-disabled sur butActionRefused (nom accessible inclut le texte visible).
- aria-input-field-name/aria-valid-attr-value → fixSelect2 : libellés combobox, références mortes aria-controls nettoyées, listbox vide → role retiré.
- target-size 43 → cibles >=24px (menus, butAction recherche/reset, liens login/aide/info-box/multiselectpicto).
- tabindex 8 → tabindex>0 retirés (login, passwordforgotten).
- aria-required-attr/children, listitem, scrollable-region-focusable → observer + correctifs structurels.

## Écarts assumés / limites
- Login `a[href$=dolibarr.org]` : N-A justifié (fond = image sombre, non mesurable programmatiquement ; text-shadow).
- `link-in-text-block` résiduels : liens teinte 10,20,100 vs texte 32,32,32 — distincts mais sans soulignement hors boxtable ; N-A.
- `target-size` .select2-search__field 11×19,5px : input de recherche interne Select2 (surface native du composant tiers) — N-A, axe évalue l'espacement suffisant.
- Pas d'auto-verdict dans results.json (leçon : verdict réservé à l'auditeur).
