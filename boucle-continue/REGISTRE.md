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
| gethomepage/homepage | boucle | 0 violation axe (53→0) — cycle en cours, audit sous-agent en attente slot |
| healthchecks/healthchecks | V1 | 0 violation axe |
| tastejs/todomvc | task-pilot | pair PASS/PASS/PASS — pas d'avantage skill mesuré (1 paire) |
| titoude/cdv-collect | run réel | PR #23 — 0 violation, 10 routes + 5 états |
| titoude/TRAJECTOIRE- | run réel | PR #6 — 142→0 violations, 31 pages |

## Cycles de la boucle continue (nouveaux)

| # | Dépôt | Worker | Auditeur | Verdict | Notes |
|---|-------|--------|----------|---------|-------|
| 1 | gethomepage/homepage | session principale | devin-558db76a : CONFIRMED (4 défauts doc/harnais corrigés + gap clavier résiduel déclaré) | worker+auditor CONFIRMED | 53→0 ; vrai bug corrigé : vars --color-* + classes thème SSR (_document, theme.css) ; artefacts boucle-runs/homepage |
| 2 | actualbudget/actual @2e68845 | session principale | en attente slot | worker CONFIRMED | 123→0 en 3 rounds ; périmètre révisé déclaré (scope-compare.json) ; verify.mjs a attrapé 2 défauts invisibles pour axe (nav mobile sans label, boutons nommés par title-sur-enfant) ; install-build+typecheck PASS sur checkout propre ; artefacts boucle-runs/actual + cycles/actual |
| 3 | gchq/CyberChef @609951a | session principale | devin-3a66a63a : PARTIAL→corrigé (hash provenance périmé, patch sain rejoué de zéro) | worker+auditor CONFIRMED | 578→0 en 4 rounds ; eval-final a attrapé 2 défauts invisibles pour axe : piège clavier 2.1.2 (Tab insère dans l'éditeur, Escape→blur ajouté) + outline:none global (focus-visible restauré) ; patch node_modules via le postinstall du projet ; install-build npm ci+build PASS ; artefacts boucle-runs/cyberchef + cycles/cyberchef |
