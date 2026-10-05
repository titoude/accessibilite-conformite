# Verdict auditeur — cycle 27 searxng/searxng @d48c4b55

**Verdict : PARTIAL** — rejeu indépendant complet, sans confiance (auditeur : devin-e6f363f7, 2026-10-05).

La quasi-totalité des claims rejoue à l'identique (comptes, hash, patch APG, fallback no-js, sondes, build octet-identique), MAIS le claim « final 0 violations » n'est pas reproductible de façon inconditionnelle : le bloc d'erreur amont `dialog-error-block` (« Sorry! No results were found »), rendu **stochastiquement** quand tous les moteurs échouent, émet encore **8 occurrences réelles** (color-contrast ×6 @3.71:1, link-in-text-block ×2 @1.78:1) sur une URL déclarée du scope. Ce bloc n'est dans AUCUN rapport livré (baseline, final, install-build) : la page `q=zzqxvbnm…` retournait des résultats à chacun de leurs runs. Pas une régression (markup et couleurs identiques sur vanilla, variables `--color-error*` non touchées par le patch) — une surface violante jamais capturée, dont une famille *déclarée corrigée* (link-in-text-block).

Rejeu effectué : trois instances locales bootées via `manifest.boot` verbatim — vanilla `searxng/searxng @d48c4b555421e824342c51d68482dd0898e54d0f` sur :8890, clone+`git apply patch.diff` (22 fichiers, 0 rejet) sur :8888, clone install-build indépendant (`npm ci && npm run build` vite) sur :8889. Commandes `manifest.auditCommands` verbatim ; pour la baseline j'ai reconstruit les 2 états /preferences avec le mécanisme amont (click sur `<label for>` radio) dans une copie d'audit.mjs, le runner livré ciblant les boutons post-patch.

## Rejeu point par point

| Claim | Rejeu auditeur |
|---|---|
| provenance.json 23 fichiers | **23/23 sha256 OK** — recalculés depuis le disque, aucun écart |
| scopeHash | `def4f4be506a8f61…` **identique baseline↔final** ; `3f8991e6…` install-build (remap :8889 documenté) ; recomputés depuis les ids triés (JSON.stringify séparateurs compacts) = match ×3 |
| statesHash différent baseline↔final | **justifié, couverture équivalente** — `cbfb57d6…` (click `#tab-label-engines` amont) vs `2de9ec60…` (click `#tab-engines` bouton post-patch) recomputés depuis audit.mjs ; j'ai rejoué la baseline avec les setups amont reconstruits : les 2 états onglets scoré **136=136** occurrences face au livré, panneaux ciblés identiques (`tab-content-engines`, `tab-content-category_general` — ce dernier est le nested-tab coché par défaut) → même couverture, mécanisme seul a changé |
| Baseline 571 occ / 14 règles / 15 scénarios | **rejouée 558 occ / 14 règles** — distribution par règle identique (label, color-contrast, aria-allowed-role, link-name, link-in-text-block, target-size, landmark-unique, page-has-heading-one, landmark-main-is-top-level, landmark-no-duplicate-main, tabindex, aria-required-children, aria-valid-attr-value, empty-table-header) ; delta −13 = variance de résultats moteurs live (le nb de résultats/vignettes flotte à chaque run — règle 7 du protocole) |
| Final 0 viol / 316 incomplets | **reproduit sur instance patchée :8888 : 0 viol / 311 inc** — MAIS **non reproductible sur le clone install-build :8889 : 8 occ** (voir F1) — la borne « 0 » est conditionnelle au rendu moteurs-up |
| Onglets /preferences = APG complet | **vérifié dans le patch ET live** : `.tabbar[role=tablist]` n'a que des enfants `button[role=tab]` (aria-selected, roving tabindex 0/−1), `aria-controls=tab-content-*` tous résolus dans le DOM, panels `section[role=tabpanel][hidden]` siblings, keydown flèches + Home/End avec branche RTL (`document.documentElement.dir`), clic = selectTab(activeTab) ; navigation clavier ArrowRight rejouée (engines→* bouge le tabIndex) ; les ids générés passent par `replace(' ','_')` dans tab_button ET tab_panel_open → plus d'espace |
| Bug amont aria-controls | **confirmé réel** : vanilla rend `id="tab-label-category_social media"` (espace littéral) → `aria-controls` tokenise en deux refs inexistantes ; upstream = radio caché + label, aucun panel pointé |
| Fallback html.no-js montre TOUS les panels | **vérifié** : `html.no-js .tabs > section[hidden]{display:block}` dans toolkit.less + `hidden` absent du markup quand no-js → requête sans JS sur :8888 montre les 6 sections + >20 inputs (assertion eval-final 6/6 confirmée) ; l'amont CSS-only n'en montrait qu'un via `:checked ~ section` |
| verify.mjs 35/35 | **rejoué 33/35** — assertions relues, non-vacuées (absent = FAIL, `thumbCount>0` exigé, roving/tabIndex contrôlé) ; les 2 FAIL = pauvreté de données amont : `q=test` ne retournait qu'1 résultat sans vignette ni pagination à mon run → assertions vignettes-nommées et aria-current/page non évaluables ; **mécanismes prouvés** sur `q=test&categories=videos` : 143 articles, 120/120 `a.thumbnail_link` aria-labellisés par `title\|striptags`, `span.page_number_current[aria-current=page]` présent — le patch produit bien les nœuds assertés quand les données existent |
| eval-final.mjs 15/15 | **rejoué 15/15 PASS** verbatim : pas de piège Tab (≥5 focus distincts), indicateur focus #q, Enter soumet, autocomplete ArrowDown/Escape, no-js 6/6 panels + >20 inputs, méta sombre ≥4.5, liens rapides mobile nommés, légende image sous vignette + pastille 6.98 |
| 316 incomplets bornés honnêtement | **oui, sous réserve W2** : `incomplete-probes.mjs` rejoué verbatim = **21/21 sondes, ratios bit-identiques** (selects 15.91/15.54 clair/sombre, pastille image_resolution 6.98 pire-cas composite-blanc, légende .title 9.74, métas vidéo 4.54/5.52, th-has-data-cells inventaire documenté) ; classes NON couvertes par la sonde mesurées par moi : `.thumbnail_length` même `rgba(0,0,0,.65)` → 6.98, `.url_i1` noir ≈21:1, `td`/​`legend` #444 → 9.74 — toutes ≥4.5, conclusion du worker correcte |
| install-build « octet-identique » + rescan 0 viol | **build octet-identique vérifié** (clone propre @SHA + apply 0 rejet + `npm ci` + `vite build` → sha256 du bundle = livré, déterministe) ; **rescan :8889 = 8 occ / 2 règles**, pas 0 — voir F1 ; le reste du scope 0 viol sur les 15 scénarios |
| Patch — chasse au masquage | **aucun masquage** : lu en entier (729 lignes, 22 fichiers) ; zéro `display:none` ajouté, zéro `aria-hidden` ajouté (au contraire : `aria-hidden="false"` mensonger supprimé, no-js *montre plus* de DOM), aucune suppression de fonctionnalité ; `id|replace(' ','_')` appliqué des deux côtés du lien aria-controls ; th colspan=8→td corrigé le faux tableau ; `tabindex=1` retiré de #q ; h1 clip-path (pas visibility:hidden) ; :focus-visible 2px ajouté globalement |

## Finding bloquant

**F1 — `dialog-error-block` amont encore violant (rendu conditionnel moteurs-down).**
Quand tous les moteurs timeout, `/search?q=…` rend `<div class="dialog-error-block" role="alert"><strong>Sorry!</strong>…<a href="/preferences">…<a href="https://searx.space">` :

- color-contrast ×6 : texte erreur `--color-error` `#db3434` sur `--color-error-background` `lighten(#db3434,40%)` = `#fae1e1` → **3.71:1** (< 4.5)
- link-in-text-block ×2 : liens `#334999` dans le bloc → **1.78:1** vs texte environnant (< 3:1) — famille *déclarée corrigée* (34 occ baseline → 0) qui reste violante sur cette surface

Mesuré sur le clone install-build :8889 (rescan verbatim) ; markup identique constaté sur vanilla :8890 (`curl` + DOM) et variables CSS inchangées par le patch → **défaut amont pur, pas une régression**. Jamais dans les rapports livrés : leurs trois scans ont trouvé des résultats sur `q=zzq…` (baseline livrée : pagination 4 pages sur cette URL). Le bloc est **stochastique** — sur :8890 il s'est rendu puis disparu entre deux requêtes selon la joignabilité des moteurs.
Correctif trivial possible : assombrir `--color-error` ou éclaircir son background jusqu'à ≥4.5 et souligner/recontraster les liens du bloc ; ou requalifier le claim « 0 violations *sur l'échantillon rendu* » + documenter la surface dans results.json. Précédent protocole : Tandoor/Paperless/Memos PARTIAL pour faux-0 conditionnels — cohérent ici.

## Warts (n'altèrent pas le verdict)

- **W1 — verify.mjs 2/35 assertions data-dépendantes** : `thumbCount>0` et `aria-current` pagination exigent des résultats avec vignettes/pages ; sur `q=test` pauvre elles échouent sans que le patch soit en cause. Assertions honnêtes (elles firent, pas vacuoles) mais non évaluables quand la donnée manque — recommandé : cibler une requête à données garanties ou déclarer N-A explicite.
- **W2 — sonde incomplets couvre ~58 % des nœuds** : `thumbnail_length` ×116 (37 % des 311 !), `url_i1` ×8, `td` ×6, `legend` ×1 non sondés par `incomplete-probes.mjs` livré ; toutes mesurées PASS par moi (6.98 / ≈21 / 9.74 / 9.74). Borne honnête, couverture doc à compléter.
- **W3 — comptes incomplets flottants** : 296↔316↔311↔317↔265 entre runs/instances — déclaré dans results.json (variance résultats live), conforme règle 7.
- **W4 — `urls-public.txt` en dur :8888** : re-sed nécessaire pour toute instance parallèle (le `--urls` prime sur le base URL) — déjà documenté dans les leçons du manifeste, repris ici.

## Détails de rejeu

- node v24.19.0, playwright ^1.55, axe-core ^4.10, vite ^8.3.1 — conformes `toolVersions` (tools/ installé depuis son lockfile)
- baseline amont : setups `preferences-engines-tab`/`preferences-category-general-tab` réécrits en click-`<label>` + attente `:visible` (le runner livré clique des boutons qui n'existent qu'après patch) ; scores page 136=136 → couverture préservée
- même pipeline axe `runOnly` wcag2a/aa/21/22+best-practice, `resultTypes: violations+incomplete`, `--wait 1000` verbatim
- `dialog-error-block` vérifié présent sur vanilla :8890 (DOM curlé identique) ; couleurs issues de definitions.less lignes 44-45/171-172 **non modifiées** par le patch
- le delta 8 occ est le seul écart de score axe constaté ; tout le reste du scope rejoue à 0 viol sur :8889 comme sur :8888
- `git apply --check` 0 rejet sur clone propre ; les 22 fichiers incluent les chunks minifiés régénérés (`git diff --text` — nécessaire, détectés binaires sinon) ; bundle vite régénéré sha256-identique
