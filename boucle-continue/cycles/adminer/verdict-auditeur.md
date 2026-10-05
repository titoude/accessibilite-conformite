# Verdict auditeur — cycle 21 vrana/adminer

**Verdict : CONFIRMED** — la chaîne complète se reproduit sur rejeu indépendant : le « 0 violation » final est bit-exact sur un clone propre @f9f9f172 + patch.diff (0 violation, les 13 mêmes nœuds `incomplete` nœud-pour-nœud), le patch est sain (lu en entier, aucun masquage), provenance 47/47 sha256 vérifiés, scopeHash recomputés identiques baseline↔final, verify 35/35 PASS et eval-final TOUT PASS sur mon propre build. Le baseline livré sous-estime la réalité — les 2 états `sql-erreur`/`sql-resultat` y ont échoué en timeout `locator.fill` (documenté honnêtement dans le champ `error` du rapport, W1) : le vrai baseline vanilla est ~1215 occurrences, pas 1153 — direction *contre* l'intérêt du worker, donc non disqualifiant. Ceci n'affirme PAS la conformité WCAG complète : périmètre axe seul (wcag2a/aa + best-practice) et 13 résultats `incomplete` décidés N-A, tous sondés PASS par moi.

Auditeur : session indépendante (devin-e419e2d2773546fca5f98fa7485f8f54), VM neuve, clone upstream frais `vrana/adminer@f9f9f1726048f6bdcaf891b5e14f5343a3132ba6`, rejeu complet sans réutilisation des artefacts du worker.

## Méthode de rejeu (indépendante)

- `git clone vrana/adminer` → `checkout f9f9f172` → `git submodule update --init adminer/static/jush` → `git apply` du `patch.diff` livré : **propre, 0 rejet, 21 fichiers** modifiés, tous sous `adminer/` (sources dev — jamais la dist compilée, jamais le submodule jush).
- `php -l` sur les 19 fichiers PHP du patch (docker php:8.3-cli) : **0 erreur de syntaxe**.
- Seed sqlite recréé **depuis la description** (le script verbatim annoncé dans manifest.json est absent de results.json — W5) : authors(4), books(10 dont note « See https://example.com/sower »), vue expensive_books, 2 index, FK books.author_id→authors.id, trigger books_price_check, AUTOINCREMENT → sqlite_sequence + sqlite_stat1 (ANALYZE).
- `adminer-plugins.php` recréé (`new Adminer\Password(password_hash('a11y-sqlite-pw'))`) — config de banc gitignorée, honnêtement hors patch.
- Deux conteneurs `php:8.3-cli php -S` sur ports distincts : **vanilla :8083** (sans patch) et **patché :8082** — pas le :8080 ni le :8081 des runs livrés, origine réellement indépendante.
- `login.mjs` rejoué sur chaque port (sessions PHP propres à chaque conteneur), `audit.mjs`/`verify.mjs`/`eval-final.mjs`/`incomplete-probes.mjs` livrés exécutés tels quels (`urls-auth.txt` rebasé vers mes ports — il porte les URLs absolues :8080, voir W6).

## Résultats du rejeu

| Étape | Livré | Rejoué | Verdict |
|---|---|---|---|
| provenance.json (sha256) | 50 entrées | **47/47 fichiers livrés conformes** ; 3 entrées non livrées (`tools/a11y-audit/*` — gitignorées par `a11y-audit/` du .gitignore racine) | OK + W2 |
| patch.diff | 21 fichiers, apply propre | `--check` + apply propres @f9f9f172 ; 21 fichiers, tous `adminer/*` dev ; `php -l` 0 erreur | OK |
| install-build | PASS docker :8081 | rejoué équivalent sur clone propre + patch + docker :8082 → login sqlite + rescan + verify + eval | OK |
| baseline public | 7 règles / 36 occ | **36 occ / 7 règles — identique nœud par nœud** (page login déterministe) | OK |
| baseline auth | 10 règles / 1117 occ | **1137 occ / 10 règles** — même union de règles ; +20 attribuables au seed reconstruit et à la version STATES (W1/W4) | OK |
| baseline total | **1153 occ / 10 règles / 30 scénarios** | recomptage des report.json livrés : **1153 exact** (36+1117 ; union 10 règles : region 504, target-size 399, label 75, color-contrast 66, select-name 30, landmark-one-main 28, link-name 28, label-title-only 15, link-in-text-block 7, empty-table-header 1 — chaque quota règle vérifié) | OK |
| final auth | 0 viol / 13 inc | **0 viol / 13 inc — les 13 nœuds identiques (règle, page, état, target) à ceux du rapport livré** | OK |
| final public | 0 viol / 0 inc | 0/0 | OK |
| 5 incomplets → probe-decisions.json | 13 nœuds PASS | **13/13 rejoués PASS, mesures identiques** : color-contrast ratios 5.14–21:1 mesurés (fond @body), th-has-data-cells rows=7/th=13/0 vide = faux positif structurel | OK |
| scopeHash | baseline↔final identiques | **recomputés depuis les pages des report.json** : `0b56c7d1…` auth et `2fa3779c…` public identiques ; install-build `f2c93afc…` différent **comme attendu** (origine :8081) | OK |
| statesHash | — | recomputé depuis audit.mjs livré : `@8080` = `b4b89803…` = statesHash **final** livré ; `@8081` = `c07b20c9…` = statesHash **install-build** livré → l'outil livré est bien la version qui a produit final+install-build. Baseline `a1ed3a5d…` **diffère** (STATES v1 — W4) | OK + W4 |
| states.json | 4 clés | = clés STATES de l'audit.mjs livré (sql-erreur, sql-resultat, select-tout-coche, menu-mobile-ouvert), setups fidèlement décrits | OK |
| verify.mjs | « 37/37 » | **35/35 PASS** sur mon :8082 — « TOUT PASS » ; le libellé surestime de 2 (34 sites `ok(` dont 1 en boucle ×2 = 35 exécutés) | OK + W3 |
| eval-final.mjs | TOUT PASS | **TOUT PASS** : E1 login, E2 structure h1+main+champs nommés ×24 urls, E3 clavier, E4 reflow 320px (320vs320), E5 menu aria-expanded, E6 zéro warning PHP sur user=, E7 cochage→édition | OK |
| cast `(array)` SHOW PRIVILEGES | dans patch, fix upstream réel | **vérifié** : `user.inc.php` ligne 31 `foreach ((array) $privileges["Tables"]…)` ; vanilla :8083 produit bien les `<b>Warning</b>` (31 occ region sur sql-erreur/sql-resultat rejoués + 38 sur user= au baseline livré) ; E6 confirme 0 warning post-patch | OK |

## Lecture du patch (668 lignes, 21 fichiers) — sain, aucun masquage

- **Landmarks** : `<main id=content>` remplace `<div>` ; `<p id=breadcrumb>` → `<nav aria-label>` ; `#menu` → `<nav aria-label>` ; `#foot` + `role=complementary`. Réel, pas décoratif.
- **Nommage de champs** : `loginFormField()` associe automatiquement `<th>`→`<label for=id>` (regex d'extraction d'id, sinon id injecté `auth-$name`) ; l'idiome upstream `html_select(...,$labelled_by)` / `checkbox(...,$labelled_by)` est réutilisé partout — `th id='label-*'` ajoutés + `aria-labelledby` sur les champs (event, user, trigger, dump, indexes, db, select limit/text-length, edit-fields `label-fields[$name]` + `label-function`). `<label>` englobants ajoutés (check/create/database/sequence/type/view). `<th>` vide event → `td colspan=2` (cellule réellement vide — suppression de l'en-tête vide, pas de contenu).
- **select.inc.php check[]** : chaque case de ligne nommée par `th[col] val[uidf][col]` — ids **pré-existants upstream** (vérifié lignes 419/582) ; accName mesuré live « id ↓ = 1 » (verify PASS).
- **jush** : `pre.jush` reçoit `role=textbox`+`aria-multiline`+transfert de l'`aria-label` du textarea (editing.js) — nécessaire, correct ; `select.jush-autocomplete` singleton nommé via `autocompleteLabel` exporté de design.inc.php. Couleurs jush : custom properties sur `body .jush` scopées `prefers-color-scheme:light` — contourne proprement le submodule non-patchable sans casser le thème dark.
- **Contrastes** : h1/.version/#h1 `#777→#666` (mesuré 5.74:1), `.error` `red→#c00` (5.89:1). Mesures verify confirmées.
- **target-size** : `#tables a`/`.links a`/`a.jush-help`/`button.icon`/`input[type=checkbox]` → 24px (mesuré 24px sur les cases — changement visuel, pas masquage).
- **link-in-text-block** : `text-decoration: underline` sur `#breadcrumb a, a.hover` — vraie distinction visuelle des liens.
- **reflow** : `body{min-width:0}` ≤800px + `.scrollable{overflow-x:auto}` + `#breadcrumb` wrappable — E4 mesure 320px sans scroll horizontal. La classe `.scrollable` existait sans règle (marqueur upstream).
- **Bug upstream réel** : cast `(array)` sur `$privileges["Tables"]` — SHOW PRIVILEGES inexistant sous sqlite → `foreach(null)` + cascade « headers already sent » en vanilla (vérifié : warnings présents sans patch, absents avec).
- **Négatif confirmé** : aucun `display:none`/`opacity:0`/`aria-valuemax`/`visibility:hidden` ajouté, aucune suppression de DOM flaggé, aucun skip/exclusion de règle (audit.mjs : `runOnly` = wcag2a+aa+21a+21aa+22aa+best-practice complets, garde `window.axe.version`), aucun élément déplacé hors du viewport.

## Findings

- **W1 (minor, honnête)** — baseline livré : `[state:sql-erreur]` et `[state:sql-resultat]` portent `error: locator.fill: Timeout 30000ms exceeded` (le textarea est `display:none` après init jush — leçon documentée dans PROTOCOLE). Les 2 états ont produit 0 violation par échec du setup, jamais scannés. Vrai baseline auth vanilla ≈ 1179 occ (mes 31+31 rejoués sur ces états), total ≈ 1215 vs 1153 annoncé. Le rapport livré enregistre l'erreur transparentement ; le défaut **sous-estime** l'amélioration (direction contre le claim, pas de masquage). STATES corrigé ensuite (iter1-3 : `pre.jush` click + `keyboard.type`).
- **W2 (nit)** — provenance.json liste `tools/a11y-audit/{report.json,report.md,scope.json}` : non livrés (gitignorés). 3/50 entrées invérifiables — les 47 autres conformes.
- **W3 (nit)** — results.json « verify 37/37 » : le verify.mjs livré exécute 35 assertions, toutes PASS.
- **W4 (nit)** — statesHash baseline `a1ed3a5d…` ≠ final `b4b89803…` : STATES a évolué mid-cycle (v1 → v2 iter1/2 `52b66463` → v3 iter3/final/install-build). Conséquence de W1 ; scope-compare.json n'asserte que scopeHash (vrai, recomputé). Effet visible : menu-mobile-ouvert baseline = 20 incomplets vs ~2 sous STATES v3.
- **W5 (nit)** — manifest « db_file créé par python3+sqlite3 (script verbatim dans results.json) » : absent de results.json. Seed reconstruit depuis la description — baseline public reproduit à l'occurrence près.
- **W6 (nit)** — `urls-auth.txt`/`urls-public.txt` figés sur `localhost:8080` : l'« install-build » du worker sur :8081 a fait naviguer E2 d'eval-final vers l'ancien stack :8080 (E1 + E3-E7 étaient bien sur :8081 — même code patché des deux côtés, impact nul mais le verbatim n'est pas autoportant). Mes rejeux ont exigé un `sed` des ports.

## Points de la mission

1. **Occurrences recomptées depuis les report.json livrés** : 1153/10 règles/30 scénarios exact (pas results.json — recomptage des nœuds).
2. **5 incomplets** : 5 findings règle×page = 13 nœuds ; 13/13 sondés PASS par moi avec mesures identiques (ratios 5.14–21:1 ; th rows=7/th=13/0 vide = FP structurel confirmé en DOM live).
3. **patch.diff** : apply propre @f9f9f172, 21 fichiers relus en entier — aucun masquage ; cast `(array)` bien dans le patch (pas un workaround de harnais).
4. **install-build** : chaîne rejouée complète sur clone propre (clone → submodule jush → apply → docker php:8.3-cli `php -S` :8082 → login sqlite → rescan 0 viol auth+public → verify 35/35 → eval-final PASS).
5. **provenance.json** : 47/47 sha256 conformes ; 3 entrées non livrées (W2).
6. **scopeHash** : recomputés, identiques baseline↔final ; install-build différent (origine) — conforme à scope-compare.json.
7. **statesHash** : recomputés — l'outil livré produit le statesHash du final et de l'install-build ; celui du baseline diffère (STATES v1, W4).
8. **states.json** = clés STATES du runner livré, descriptions fidèles.
9. **Ce verdict** certifie la reproductibilité du score axe et l'absence de masquage — pas la conformité WCAG complète.
