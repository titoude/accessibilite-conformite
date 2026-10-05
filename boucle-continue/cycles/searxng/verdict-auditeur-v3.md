# Verdict auditeur v3 — cycle 27 searxng/searxng @d48c4b55

**Verdict : CONFIRMED** — rejeu indépendant complet du correctif v3 (auditeur : devin-ababf351, 2026-10-05).

La falsification du v2 est **résolue** : le fix S1 existe désormais dans les sources `.less` du patch, et l'étape qui avait manqué — le rebuild réel — est rejouée ici en entier. `npm ci && npm run build` sur le clone patché régénère `searx/static/themes/simple/` **octet-identique** au bundle livré (`diff -rq` : aucune différence, 3 css + chunks + manifest inclus), avec `#b91c1c`/`#f8d2d2` et les règles `a{text-decoration:underline}` sur `.dialog-error` ET `.dialog-error-block`, zéro occurrence de `#db3434`/`#fae1e1`. La surface moteurs-down (provocation déterministe `outgoing.proxies all://→http://127.0.0.1:9/`) passe à **0 violation en clair et en sombre** sur la page complète, computed styles conformes (clair `#b91c1c`/`#f8d2d2` = 4.66:1, sombre `#f55b5b`/`#390a0a` = 5.34:1, liens soulignés dans les deux thèmes). Toutes les autres claims rejouent propre — une seule wart : le hash de `results.json` dans provenance.json correspond à la version parente (re-hash exécuté avant la dernière édition du fichier), corrigé dans le commit de ce verdict.

## Rejeu point par point

| Claim v3 (commit f0544e8) | Rejeu auditeur |
|---|---|
| `git apply patch.diff` 0 rejet | **OK** — clone propre @d48c4b555421e824342c51d68482dd0898e54d0f, `git apply --verbose`, 22 fichiers, 0 rejet (incl. rename `chunk/e2-9fzwE.min.js→CcDbtRuT.min.js`) |
| S1 : sources `.less` corrigées | **PRÉSENTES** — `definitions.less` : `--color-error:#b91c1c`, `--color-error-background:lighten(#b91c1c,48%)` (l.44-45) ; `toolkit.less` : `a{text-decoration:underline}` dans `.dialog-error` (l.174) ET `.dialog-error-block` (l.186). Sombe `--color-error:#f55b5b` inchangé amont — déjà conforme |
| S1 : 3 css compilés = sortie RÉELLE du build | **VÉRIFIÉ par rebuild** — `npm ci` + `npm run build` (vite, 479 ms) sur le clone patché → `diff -rq` **aucune différence** avec les artefacts du patch ; `sxng-ltr/rtl.min.css` : `#b91c1c`, `#f8d2d2`, `.dialog-error a{text-decoration:underline}`, `.dialog-error-block a{…}` présents, `#db3434`/`#fae1e1` absents ; `sxng-rss` : couleurs présentes, pas de règles dialog (rss ne style pas les dialogs — cohérent amont) |
| Scan axe 15 scénarios, 0 viol | **reproduit bit-identique en structure** — instance patchée+rebuildée :8888 : 15/15, **0 violation**, mêmes règles incomplètes par page que le rapport livré (color-contrast + th-has-data-cells ; seuls les compteurs de nœuds bougent — variance résultats moteurs live, ex. videos 123→102) ; `scopeHash def4f4be…` + `statesHash 2de9ec60…` **bit-identiques** |
| dialog-error-block = 0 viol | **prouvé sur la chaîne livrée** — `settings.yml` + `outgoing.proxies: all://: [http://127.0.0.1:9/]` → tous moteurs KO → bloc rendu à coup sûr sur `/search?q=test` ; axe page entière : **0 violation, thème clair puis sombre** ; computed : clair texte `rgb(185,28,28)` sur `rgb(248,210,210)` = **4.66:1**, lien `rgb(51,73,153)` souligné ; sombre `rgb(245,91,91)` sur `rgb(57,10,10)` = **5.34:1**, lien `rgb(136,170,255)` souligné |
| S4 : sonde alpha corrigée | **réel** — `walkBg` retourne TOUTES les couches non transparentes, `effectiveBg` composite top→down (`couleur·alpha·∏(1-alpha dessus)`, reliquat→fallback thème) — code relu ; rejou live : **29 sondes, 28 PASS + 1 DOCUMENTED, 0 FAIL** ; `prefs-#tab-content-category_general` clair = **8.39:1** (exactement la valeur réelle calculée à la main par l'auditeur v2), sombre 8.93 ; les 21 sondes du rapport livré toutes reproduites à l'identique |
| verify.mjs 35/35 | **reproduit** — 35 PASS / 0 N-A ; `na()` relu : `verdict:'N-A'` compté à part, jamais de PASS à vide |
| eval-final.mjs 15/15 | **reproduit** — 15/15 assertions OK |
| provenance.json re-hashée | **24/25** — tout matche sauf `results.json` : déclaré `45202856` = sha256 du fichier **version f0544e8^** (réel `d5d5612e`) — le re-hash a précédé la dernière édition, même wart qu'en v2 réduite à 1 fichier ; **corrigé dans le commit de ce verdict** |
| install-build.log régénéré | claims rejoués substantiellement : apply 22f/0 rejet, build déterministe octet-identique, rescan 15/15 0 viol — exécutés sur :8888 (remap :8889 cosmétique) |
| Chasse au masquage | 207 lignes `+` inspectées — rien : `panel.hidden` = pattern APG standard, `.sr-only`/clip-path = utilitaire légitime, `html.no-js .tabs>section[hidden]{display:block}` = **anti**-masquage (montre les panels sans JS) |

## Warts (n'altèrent pas le verdict)

- **W-v3-1 — hash `results.json` périmé dans provenance.json** : la valeur déclarée est le sha256 de la version parente (le fichier a été ré-édité après le re-hash — le même défaut de procédé « édition post-hash » que la falsification v2, à échelle 1 fichier). Corrigé au rejeu : `d5d5612e…` dans le commit de ce verdict.
- **W-v3-2 — `reports/incomplete-probes.json` livré = 21 sondes** : généré à 02:18Z, avant l'extension S2/S3 du script (f7b2b2f → 29 sondes) ; jamais régénéré. Lag documentaire, pas falsification — le tool actuel rejoué produit 29 sondes toutes PASS/DOCUMENTED, les 21 d'origine bit-identiques.

## Détails de rejeu

- node v24.19.0 (nvm), playwright 1.63 / axe-core 4.13 (lockfile tools compatible ^1.55/^4.10), vite ^8.3.1, python 3.12 — une seule instance patchée+rebuildée :8888 suffit : le bundle commité et le bundle rebuildé sont désormais le même objet (octet-identique prouvé)
- provocation moteurs-down : `outgoing.proxies: {all://: [http://127.0.0.1:9/]}` injecté dans `searx/settings.yml` → bloc `dialog-error-block` rendu à coup sûr (200 / 25,9 ko, texte « Sorry! No results were found… ») ; sonde `tools/probe-dialog-v3.mjs` commitée (axe page entière + computed + ratio recomputé)
- ratios recomputés indépendamment : 4.66 (clair) et 5.34 (sombre) sur `.dialog-error-block` ; claim 4.66 exact
- instance restaurée sans proxy pour verify/eval/sondes (données live présentes : 20+ résultats, vignettes, pagination)
