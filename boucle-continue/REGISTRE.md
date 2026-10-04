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
| NginxProxyManager/nginx-proxy-manager | boucle c5 | 0 violation axe (113→0 app, 12→0 login) — audit devin-d7a49e6d en cours |
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
| 5 | NginxProxyManager/nginx-proxy-manager @f64d43b | session principale | en attente slot | worker CONFIRMED | 113→0 app + 12→0 login (13+5 règles) ; verify 96 assertions + eval-final (piège modale 25 Tab, skip-link réel, focus-visible) ; install yarn frozen + build PASS ; artifacts cycles/nginxproxymanager |
| 6 | TandoorRecipes/recipes @7d2e139 | session principale | en attente slot | worker CONFIRMED | 207→0 (login 9 + app 198, 19 règles) en ~12 rounds ; verify 15/15 + eval-final 10/10 (rescan indépendant 4 routes + smoke) ; scopeHash+statesHash identiques baseline/final ; install yarn frozen+build + pip+manage.py check PASS ; artefacts cycles/tandoor |
| 7 | usememos/memos @0d98970 | session principale | en attente slot | worker CONFIRMED | 157→0 (8 règles : meta-viewport 15, color-contrast 116, region 14, aria-input-field-name 6, h1 3, th vide, aria-prohibited-attr, dialog-name) ; verify 12/12 + eval-final 6/6 (rescan axe 4 routes) ; scope corrigé déclaré : /memo-filters→/views (route inexistante → rendait NotFound, lui-même corrigé h1) ; tests repo alignés (assertions figeant le design non conforme : /70→solide, h4→h3) ; pnpm build+lint+test 1772/1772 ; artefacts cycles/memos |
| usememos/memos | boucle c7 | 0 violation axe (157→0) — worker CONFIRMED |
