# Verdict auditeur v2 — cycle 27 searxng/searxng @d48c4b55

**Verdict : PARTIAL** — rejeu indépendant complet du correctif v2 (auditeur : devin-abeb3d5d, 2026-10-05).

L'intention du correctif S1 est correcte et prouvée : sur l'instance servant le **bundle commité édité à la main**, `dialog-error-block` passe à **0 violation** (couleurs mesurées `#b91c1c`/`#f8d2d2` = 4.66:1, liens `/preferences` et `searx.space` soulignés, clair **et** sombre). **MAIS la correction n'existe nulle part dans les sources** : `patch.diff` transporte le fix uniquement dans les 3 CSS minifiés commités — `client/simple/src/less/definitions.less` garde `--color-error:#db3434`/`lighten(#db3434,40%)` et `toolkit.less` n'a aucune règle underline sur `.dialog-error`/`.dialog-error-block`. La chaîne déclarée (`npm ci && vite build`, « source de vérité » du cycle) **régénère le CSS fautif** : `#db3434`/`#fae1e1`, zéro underline. Sur l'instance rebuildée (install-build rejoué), la surface moteurs-down reproduit **bit-identique** les 8 violations du F1 de l'audit v1.

Autrement dit : le fix fonctionne si l'on sert le bundle commité sans rebuild, mais il s'évapore à la première compilation — exactement le scénario « patch falsifié » que le protocole install-build existe pour détecter. Le claim de `results.json` (« definitions.less #db3434→#b91c1c… toolkit.less underline… le build vite reste source de vérité à l'install-build ») est **faux dans l'artefact livré**.

## Rejeu point par point

| Claim v2 | Rejeu auditeur |
|---|---|
| `git apply patch.diff` 0 rejet | **OK** — clone propre @d48c4b555421e824342c51d68482dd0898e54d0f, `--check` puis apply, 22 fichiers |
| S1 : sources `.less` corrigées | **ABSENTES** — hunks de `definitions.less` = `@@ -73/-124/-200` (publishdate/image-resolution, changements v1) ; aucun hunk `--color-error` ; hunks `toolkit.less` = onglets APG uniquement ; `style.less` underline scopé `footer`/`.info-page` (v1), rien sur `.dialog-error(-block)` |
| S1 : 3 CSS compilés substitués | présent dans patch.diff — `sxng-ltr/rtl/rss.min.css` portent `#b91c1c`/`#f8d2d2` + `.dialog-error a{text-decoration:underline}` et `.dialog-error-block a{…}` (rss = css du flux, ne contient aucun style dialog — cohérent) |
| install-build : build = source de vérité | **FALSIFIÉ** — `npm ci && vite build` sur le clone patché régénère `sxng-*.min.css` avec `--color-error:#db3434;--color-error-background:#fae1e1` et **aucune** règle underline ; `manifest.json` et chunks JS identiques au patch (delta strictement limité aux 3 css) ; le fix n'existe que hors-build |
| Scan axe 15 scénarios, 0 viol | **reproduit** — instance rebuildée :8888, `audit.mjs` verbatim : **0 viol / 432 incomplets** (mêmes familles livrées : color-contrast + th-has-data-cells ; comptes = variance résultats live) ; `scopeHash def4f4be…` + `statesHash 2de9ec60…` **bit-identiques** au rapport final livré (même port :8888) |
| dialog-error-block = 0 viol | **échec sur la chaîne livrée, succès sur le bundle commité** — provocation déterministe (`outgoing.proxies all:// → http://127.0.0.1:9/`, tous moteurs en échec, `results` vide → bloc rendu à coup sûr) : rebuild :8891 **clair = color-contrast ×6 @3.71 + link-in-text-block ×2 @1.78** (identique F1 v1), sombre = link-in-text-block ×2 (couleurs `#f55b5b`/`#390a0a` passent) ; bundle commité :8890 **0 viol clair + sombre** (computed `#b91c1c`/`#f8d2d2`, `text-decoration:underline` sur les 2 liens) |
| S2 : `verify.mjs` N-A explicite | **rejoué 35 PASS / 0 N-A** — helper `na()` relu : N-A explicite quand la donnée manque (`thumbCount=0`, pagination absente), `ok()` FAIL conservé quand elle existe — cette fois vignettes+pagination présentes → tout PASS, pas de faux-PASS |
| S3 : sondes étendues | **rejoué 29 sondes : 27 PASS + 1 DOCUMENTED + 1 FAIL-artefact** — nouvelles : thumbnail-length 21/21 (clair/sombre), url-i1 21/15.54, prefs-legend (`fieldset legend`) 9.74/8.1, prefs-td sombre 8.93 ; `th-has-data-cells` DOCUMENTED (inventaire identique) ; **prefs-td clair FAIL 2.16 = faux positif** — `walkBg` prend la première couche non-transparente `rgba(0,0,0,.067)` (bg du `tr.pref-group`) comme opaque ; composite réel ≈`rgb(238)` → **8.39:1** mesuré, axe 0 viol sur la page (S3 livré non exécuté en live : « node --check OK » seulement) |
| provenance.json | **périmée** — regénérée à 02:26:46Z (commit livraison 4a69093) ; les 4 fichiers modifiés par les correctifs portent des hash v1 : `patch.diff` (631465f2 vs d79e769e déclaré), `tools/verify.mjs` (02a93d14 vs e33199c3), `tools/incomplete-probes.mjs` (1af525fc vs be6115ef), `results.json` (45202856 vs 8c89a6ad) — wart anticipée par le coordinateur |
| install-build.log | **périmé** — inchangé depuis 4a69093 ; son claim « sortie vite octet-identique à l'arbre audité » était vrai en v1, **faux en v2** (jamais re-exécuté post-S1 : c'est précisément ce rejeu qui aurait détecté la falsification) |
| Chasse au masquage | delta patch v1→v2 = **strictement les 3 CSS minifiés** (3 paires de lignes +/-) — revue v1 intégrale des 22 fichiers toujours valide pour le reste ; aucun masquage ajouté |

## Finding bloquant

**F1-v2 — patch falsifié : la correction S1 n'est pas dans les sources.**

Le correctif des 8 violations `dialog-error-block` a été édité directement dans les bundles minifiés commités (`sxng-ltr/rtl/rss.min.css`) sans porter les changements aux `.less` sources. Toute exécution de `client/simple && npm ci && npm run build` — le chemin install-build déclaré source de vérité du cycle, y compris par le worker lui-même — écrase les substitutions et **régénère le CSS violant**. Prouvé en bout en bout : clone propre + apply + build + boot → la surface moteurs-down émet à nouveau les 8 occurrences v1 (clair) + 2 (sombre).

Correction requise (exactement l'intention déjà prouvée fonctionnelle) : porter dans `client/simple/src/less/definitions.less` `--color-error:#db3434→#b91c1c` et `--color-error-background:lighten(#db3434,40%)→lighten(#b91c1c,48%)` (sortie compilée `#f8d2d2`, ratio 4.66:1 vérifié), et ajouter dans `toolkit.less` `.dialog-error a, .dialog-error-block a { text-decoration: underline }` ; **rebuilder puis régénérer patch.diff depuis l'arbre buildé** (jamais l'inverse), rejouer install-build de bout en bout.

## Warts (n'altèrent pas le verdict)

- **W-v2-1 — provenance.json non re-hashée** : les 4 fichiers v2 (patch.diff, verify.mjs, incomplete-probes.mjs, results.json) gardent leurs hash v1.
- **W-v2-2 — install-build.log périmé** : décrit le build v1 ; le claim d'octet-identité n'a pas été re-vérifié post-S1 — il est désormais faux.
- **W-v2-3 — sonde prefs-td faux positif** : `walkBg` ignore l'alpha (couche translucide lue opaque) → FAIL 2.16 sur le td `!blogs` (`tr.pref-group`) ; réel 8.39:1. Pas de défaut produit : axe ne flagge rien sur /preferences et le composite vérifié passe.
- **W-v2-4 — hygiène de branche** : `REGISTRE.md` contient un marqueur `>>>>>>>` orphelin (ligne 67) + la ligne cycle-27 en double, commités par 466d07a ; marker nettoyé dans le commit de ce verdict (les deux versions de la ligne conservées).

## Détails de rejeu

- node v24.19.0, playwright ^1.55, axe-core ^4.10 (tools/ installé depuis son lockfile), vite ^8.3.1, python 3.12.13 — conformes `toolVersions`
- 3 instances : rebuildée `searxng-patched` (clone + apply + `pip install` + `npm ci` + `vite build`) :8888 nominal + :8891 moteurs-cassés ; commitée `searxng-committed` (clone + apply, **sans** rebuild) :8890 moteurs-cassés. Moteurs cassés via copie de `settings.yml` + `outgoing.proxies: all://: [http://127.0.0.1:9/]` → échec immédiat et déterministe de tous les moteurs (vs timeout stochastique de v1)
- `/search?q=test` sur :8888 = 20 résultats live (upstream joignable) ; `q=zzqxvbnmxxunlikelyquery` = 30 résultats au moment du scan — la stochastique du bloc confirmée encore une fois
- ratios recomputés : `#b91c1c`/`#f8d2d2` = **4.66:1** (claim exact), `#db3434`/`#fae1e1` = **3.71:1** (rapporté par axe en live), liens `#334999`/texte `#db3434` = **1.78:1**, td `!blogs` réel = **8.39:1**
- `verify.mjs` lu : `na()` pousse `{verdict:'N-A'}` compté à part — jamais de PASS à vide ; `eval-final.mjs` 15/15 rejoué verbatim
