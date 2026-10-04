# Registre des dépôts testés — ne jamais retester

Tout dépôt listé ici a déjà fait l'objet d'un cycle complet. Les workers de la
boucle DOIVENT choisir un dépôt absent de ce tableau.

## Déjà testés (avant la boucle)

| Dépôt | Cycle | Verdict |
|---|---|---|
| miniflux/v2 | V1+V2 | CONFIRMED (V2, rejeu indépendant) |
| benbusby/whoogle-search | V1+V2+paired-pilot | CONFIRMED (V2) |
| FreshRSS/FreshRSS | V1+V2 | CONFIRMED (V2) |
| CorentinTh/it-tools | V1+V2 | CONFIRMED_HORS_BUDGET (V2, install corrigée en requalif) |
| RaspAP/raspap-webgui | V1+V2 | CONFIRMED_HORS_BUDGET (V2, patch corrigé en requalif) |
| excalidraw/excalidraw | V1+V2 | CONFIRMED_HORS_BUDGET (V2) |
| linkding (sissbruecker/linkding) | V1 | 0 violation axe |
| stevearc/uptime-kuma → louislam/uptime-kuma | V1 | 0 violation axe |
| kanboard/kanboard | V1 | 0 violation axe |
| go-gitea/gitea | V1 | 0 violation axe |
| TiddlyWiki/TiddlyWiki5 | V1 | 0 violation axe |
| getgrav/grav | V1 | 0 violation axe |
| n8n-io/n8n | V1 | 0 violation axe |
| Lissy93/dashy | V1 | 0 violation axe |
| requarks/wiki (wiki.js) | V1 | 0 violation axe |
| rommapp/romm | V1 | 0 violation axe |
| dgtlmoon/changedetection.io | V1 | 0 violation axe |
| gethomepage/homepage | boucle c1 | 0 violation axe (53→0) — CONFIRMED auditeur |
| healthchecks/healthchecks | V1 | 0 violation axe |
| NginxProxyManager/nginx-proxy-manager | boucle c5 | 0 violation axe (113→0 app, 12→0 login) — CONFIRMED auditeur |
| tastejs/todomvc | task-pilot | pair PASS/PASS/PASS — pas d'avantage skill mesuré (1 paire) |
| titoude/cdv-collect | run réel | PR #23 — 0 violation, 10 routes + 5 états |
| titoude/TRAJECTOIRE- | run réel | PR #6 — 142→0 violations, 31 pages |

## Cycles de la boucle continue (nouveaux)

| # | Dépôt | Worker | Auditeur | Verdict | Notes |
|---|-------|--------|----------|---------|-------|
| 1 | gethomepage/homepage | session principale | devin-558db76a : CONFIRMED (4 défauts doc/harnais corrigés + gap clavier résiduel déclaré) | worker+auditor CONFIRMED | 53→0 ; vrai bug corrigé : vars --color-* + classes thème SSR (_document, theme.css) ; artefacts boucle-runs/homepage |
| 2 | actualbudget/actual @2e68845 | session principale | devin-c8e16a74 : CONFIRMED (8 findings intégrés) | worker+auditor CONFIRMED | 123→0 en 3 rounds ; périmètre révisé déclaré (scope-compare.json) ; verify.mjs a attrapé 2 défauts invisibles pour axe (nav mobile sans label, boutons nommés par title-sur-enfant) ; install-build+typecheck PASS sur checkout propre ; artefacts boucle-runs/actual + cycles/actual |
| 3 | gchq/CyberChef @609951a | session principale | devin-3a66a63a : PARTIAL→corrigé (hash provenance périmé, patch sain rejoué de zéro) | worker+auditor CONFIRMED | 578→0 en 4 rounds ; eval-final a attrapé 2 défauts invisibles pour axe : piège clavier 2.1.2 (Tab insère dans l'éditeur, Escape→blur ajouté) + outline:none global (focus-visible restauré) ; patch node_modules via le postinstall du projet ; install-build npm ci+build PASS ; artefacts boucle-runs/cyberchef + cycles/cyberchef |
| 4 | hedgedoc/hedgedoc @5dd94d5 | session principale | devin-0ff93d89 : CONFIRMED (5 réserves intégrées) | worker+auditor CONFIRMED | 91→0 en 4 rounds (11 règles) ; verify.mjs 27/27 + eval-final ont attrapé 5 défauts invisibles pour axe : piège Tab CodeMirror (indentWithTab prop), outline:none global (focus-visible), focus iframe sans :focus ni events (window.blur+activeElement), skip-link sans tabindex sur main, btn-success 4.19:1 ; install pnpm frozen + turbo build 6/6 sur checkout propre ; artefacts boucle-runs/hedgedoc + cycles/hedgedoc |
| 5 | NginxProxyManager/nginx-proxy-manager @f64d43b | session principale | devin-d7a49e6d : CONFIRMED avec réserves intégrées | worker+auditor CONFIRMED | 113→0 app + 12→0 login (13+5 règles) ; verify 96 assertions + eval-final (piège modale 25 Tab, skip-link réel, focus-visible) ; install yarn frozen + build PASS ; réserves intégrées : placeholder react-select 3,95:1 non absorbé, skip-link focusable pendant modale @restart, 5 findings documentés dans cycles/nginxproxymanager/verdict-auditeur.md ; artifacts cycles/nginxproxymanager |
| 6 | TandoorRecipes/recipes @7d2e139 | session principale | 024f50b0 **PARTIAL→corrigé** | worker CONFIRMED | 207→0 (login 9 + app 198, 19 règles) en ~12 rounds ; verify 15/15 + eval-final 10/10 (rescan indépendant 4 routes + smoke) ; scopeHash+statesHash identiques baseline/final ; install yarn frozen+build + pip+manage.py check PASS ; audit 024f50b0 PARTIAL : F1 /recipe/2 2 violations sur recette vide (seed) → patch-v2.diff (3 composants, rescan 0 viol. recette réaliste), F2 seed doc, F3 états, F4 verify tautologie, F5 Tab flake corrigés ; verdict-auditeur.md ; artefacts cycles/tandoor |
| 7 | usememos/memos @0d98970 | session principale | devin-15ad4322 : **PARTIAL→corrigé** | worker CONFIRMED | 157→0 (8 règles) ; verify 12/12 + eval-final 6/6 ; v2 post-verdict : h1 structurels (Home /,/explore,/?creator=* + MemoDetail) + aria-label sidebar i18n, seed précisé (content+uid), contradiction /map levée, routes canoniques (/calendar/2026/10, /?creator=admin), auto-verdict retiré → patch-v2.diff + rescan final-v2 0/0/0 exit 0 ; verdict-auditeur.md ; artefacts cycles/memos |
| 8 | filebrowser/filebrowser @833d908 (archivé 01-09-2026) | session principale | en attente slot | worker CONFIRMED | 151→0 (app 145/11r + login 6/2r : region 16, label 27, list/listitem 25, contrast 37+, aria-allowed-attr, heading-order, button-name, select-name, th vide, landmark-one-main) ; verify 17/17 + eval-final 6/6 ; install-build frozen+typecheck+vite+go PASS sur checkout propre ; états itérés 3× (mobile-drawer : isMobile JS ≤736px ≠ media CSS 1024px) ; vue-number-input ± innommables → input[type=number] ; artefacts cycles/filebrowser |
| usememos/memos | boucle c7 | 0 violation axe (157→0) — worker CONFIRMED |
| 9 | amir20/dozzle @b99f7f4 | session principale | cfaa8d51 **CONFIRMED** | worker CONFIRMED | 167→0 (app 162/7r + login 5/3r : region, button-name ×102, contrast ×3, landmarks ×3, list, page-has-heading-one) ; verify 11/11 x4 + eval-final 6/6 ; états : dark×2, search-modal, mobile, pinned-logs via ?columns=<id> ; scope corrigé déclaré (routes par nom → par ID : les noms rendaient NotFound 200) ; splitters reparentés dans landmarks + reparenting conservé drag natif ; install-build bun frozen + vite + go PASS sur checkout propre ; artefacts cycles/dozzle ; auditeur : rejeu complet (build, 0 viol. reproduit, baseline vanilla 189 occ, 33/33 fichiers intègres) + 9 findings (4 minor : valuenow dénominateur, valuemin/max figés, lang statique, affordances /80) → verdict-auditeur.md |
| 10 | paperless-ngx | paperless-ngx/paperless-ngx | 8adbff14 | 2026-10-04 | 152 occ / 13 règles (+5 login) | **0** (15 pages + 2 états + login) | install-build OK, verify 19/19, eval-final 9/9 | audit 6636e84c **PARTIAL→corrigé** : v2 domId explicites tab↔panel (SPA-safe), tabindex panels, couleurs logs ≥4.5:1, aria-labelledby dropdowns ; rescan final-v2 0/0/0 exit 0 (--wait 4000, hydration SSR) ; verdict-auditeur.md |
| 11 | advplyr/audiobookshelf @2a0507f | session principale | en attente slot | worker CONFIRMED | 148→0 (11 règles : region 40, label 33, button-name 27, link-name 9, color-contrast 7, th 4, landmark-one-main 2, h1 1, list 1, aria 24) ; verify 14/14 + eval-final 6/6 ; Vue2 : aria-checked 'true'/'false' (bindings falsy droppés), h1 structuré (1/page, modales/cartes →h2) ; --wait 2500-4000 hydratation Nuxt2 ; alias / et /batch hors-scope (redirect client) ; install npm+nuxt generate PASS ; artefacts cycles/audiobookshelf |
| 12 | navidrome/navidrome @95f67d2 | session principale | en attente slot | worker CONFIRMED | 204→0 (13 règles : region, color-contrast, label-title-only, button-name, aria-required-parent, nested-interactive listitem, page-has-heading-one, target-size, empty-table-header, aria-prohibited-attr, label, empty-heading, landmark-one-main) sur 15 surfaces (login + 10 pages + 4 états) ; verify 14/14 + eval-final 6/6 ; 2 bugs réels : crash ReferenceError translate hors scope (page erreur RA), dark.js secondary=blue.A400 3.98:1 ; patch postinstall ra-ui-materialui (th bulk nommé, h6→p, inputProps aria) ; disablePortal menus dans landmarks ; nav landmark ajouté ; Menu.jsx ; install-build npm ci+build+go PASS clone propre ; artefacts cycles/navidrome |
