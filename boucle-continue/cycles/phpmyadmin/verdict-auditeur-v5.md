# verdict-auditeur-v5 — cycle 31 phpmyadmin

**Verdict : CONFIRMED** — le fixer v4 (commit `4484302`) tient ce qu'il
prétend, mesuré par moi de bout en bout sur MES stacks fraîches : verrou
universel index.php **rejoué sous spam `/navigation` à 25 ms = 20/20 PASS**
(+ 20/20 sous adversaire armé au vrai cookie périmé, + frappe déterministe
entre commit et reload — persistée), patch **88 fichiers 0 rejet**,
final rejoué **×2 stacks indépendantes = 64/64 scénarios 0 viol** (:8531
1656 inc, :8532 1684 inc — livré 1670), verify **25/25**, eval **0 FAIL**,
sondes **1616 P / 40 N-A / 0 FAIL** avec la distribution N-A **identique à
l'unité** au livré (1630P/40NA/0F — le Δ14 est cantonné au bucket
color-contrast PASS, bruit heuristique axe déjà documenté). Scope v4 : 47
urls dont les 3 nouvelles pages à **0 viol mesuré par moi** sur les deux
stacks ; `$code-color` `#ad1457` présent dans les **4/4 theme.css
compilés** et re-mesuré **6,00:1** sur #eee (claim « 6,0:1 » exact).
Sidecar `patch.diff.sha256` désormais **conforme** au vrai patch (wart W1
v4 réparé). Warts v5 (mineurs) : `install-build.log` livré encore à
l'ère v1 (68 fichiers/45 scénarios/:8081), `verdict-fixer-v4.md` livré
non listé dans provenance.json (couverture). Chasse : **3 règles /
6 occurrences résiduelles sur des pages hors-scope**, toutes dans du code
non touché par le patch → héritées d'@e7e3f96 ; 2.5.3 sondé sous axe
4.14 = **0 mismatch / 47 urls**.

- Ré-auditeur : session `devin-ab9e19dfe7dd428ab4758450c374a334` (spawnée
  par devin-3cde6939fc0b489ab7c0d2ffa16c3255), indépendante du fixer v4
  (`devin-59d03a1958d64071baa9c4d15e1307e5`).
- Produit : phpmyadmin/phpmyadmin @ `e7e3f96ac4c65f291cc7ced271c0bb6d4ea591ee`
- Méthode : DEUX clones propres + stacks neuves sur MES ports —
  `~/work/pma31-v5-patched` :8531 (net `pma31v5-net`, db `pma31v5-db`)
  et `~/work/pma31-v5-ib` :8532 (net `pma31v5ib-net`, db `pma31v5ib-db`),
  image `pma31-v5-web` = php:8.3-apache + mysqli/pdo_mysql/mbstring/gd/zip,
  mariadb:11.8, seed `tools/seed.sql` verbatim. Outillage copié
  `~/work/run31v5` — `audit.mjs`/`verify.mjs`/`eval-final.mjs`/
  `incomplete-probes.mjs`/`reset-theme.mjs`/`login.mjs` vérifiés
  **octet-identiques** à `tools/` livrés. axe-core **4.13.0** (pin
  respecté), scratch axe **4.14.0** séparé pour 2.5.3. Aucun artefact
  livré réutilisé : auth.json, stack, build et rapports sont miens.

## Rejeu vs livré — chiffres

| Axe | Livré (fixer v4) | Rejeu v5 indépendant | Δ |
|---|---|---|---|
| patch apply | 88 fichiers, 0 rejet | **88 fichiers, +1138/−250, 0 rejet** (warnings whitespace seuls), appliqué sur 2 clones distincts | identique |
| patch.diff.sha256 | sidecar corrigé | **`5833542a…c491a` = sha256(patch.diff) réel** — wart W1 v4 réparé | conforme |
| final | 64 sc. / 0 viol / 0 err / 1670 inc | **:8531 → 64/64, 0 viol, 0 err, 1656 inc ; :8532 → 64/64, 0 viol, 0 err, 1684 inc** | ±14/±28 inc = bruit axe (distribution sondes identique, ci-dessous) |
| install-build | log ère v1 (68 fichiers/45 sc.) | clone dédié `pma31-v5-ib` + build + stack :8532 + rescan verbatim 64 sc. = **0 viol** ; mon journal `~/work/run31v5/install-build-v5.log` | conforme ; log livré = W5 |
| sondes incomplets | 1630 P / 40 N-A / 0 FAIL (1670) | **1616 P / 40 N-A / 0 FAIL** (1656) — N-A par règle **identique** : color 18, target-size 10, th-has-data-cells 6, aria-allowed-role 1, duplicate-id-aria 4, aria-prohibited-attr 1 | Δ = −14 PASS color-contrast uniquement |
| verify.mjs | 25/25 | **25/25 PASS** | identique |
| eval-final.mjs | 0 FAIL | **0 FAIL** | identique |
| provenance.json | 36 fichiers | **36/36 sha256 exacts** re-hachés depuis le disque par `boucle-continue/rehash-provenance.py` ; `--strict` exit 1 = 1 fichier livré non listé (W6) | voir W6 |
| scope v4 (3 pages) | 0 viol | `/database/events`, `/server/status/queries`, `/preferences/navigation` → **0 viol** sur :8531 ET :8532 | identique |
| $code-color | #d63384 → #ad1457 = 6,0:1 | `#ad1457` dans **4/4** theme.css compilés (`--bs-code-color` light ; `#ce729a` dark inchangé) ; mesuré **6,00:1** sur #eee, 6,97:1 sur #fff (ancien #d63384 = 3,88:1) | claim exact |
| verrou index.php | mutations sous spam → thème persiste | **20/20 PASS** sous spam `/navigation` à 25 ms ; **20/20** sous adversaire armé ; 13 aborts sous verrou comptés ; access-logs : 88 `themes/set` servis 200 | voir §Épreuves 1 |

## Épreuves du brief (rejouées)

1. **Verrou universel index.php — reproduit et durci.** Mécanisme vérifié
   dans `tools/audit.mjs` (route `**/index.php**` enregistrée en dernier =
   évaluée en premier ; `abortedInLock` WeakSet car `route.abort()` n'émet
   pas toujours `requestfailed` ; libération sur critère `response` =
   headers envoyés = write engagé côté middleware). Mon rejeu indépendant
   (`~/work/run31v5/stress-lock.mjs`) : mutations `themes/set` sous spam
   `/navigation` page-context à 25 ms → **20/20** thème persistant,
   **13 requêtes index.php abortées** sous le verrou. Deuxième mode
   `armAdversary` : snapshot du jar après mutation #1 → un 2e contexte
   spamme `/navigation` avec le **vrai cookie périmé** `pma_theme=bootstrap`
   → 20/20. Sonde déterministe `probe-cancel.mjs` : frappe placée
   exactement entre le commit `themes/set` et le reload de la garde →
   metro et original ont persisté. Access-logs apache de MON conteneur :
   88 `POST /public/index.php?route=/themes/set` → 200, aucun GET
   index.php de page servi dans la fenêtre de mutation. Mécanisme source
   confirmé : `LanguageAndThemeCookieSaving` réémet `pma_theme` à CHAQUE
   réponse ; sans verrou, une réponse périmée atterrissant après
   `themes/set` corrompt le jar → `loadUserPreferences()` re-sauve le
   thème DU COOKIE (cache session, pas de pmadb). **Nuance honnête** : la
   write adverse reste possible au niveau PHP sous une 2e session (prouvé
   par instrumentation PREFDBG temporaire, révertée), mais le thème servi
   suit le cookie de la requête — le verrou supprime la corruption du jar
   côté page scannée, donc la garde (`link[href*=theme.css]` après reload)
   tient toujours. Le claim fixer est fonctionnellement vrai.
2. **Scope v4 (44→47) — reproduit.** 47 urls scannées ; les 3 nouvelles à
   0 viol sur mes deux stacks. Hunks du patch vérifiés dans le diff :
   `database/events/index.twig` img → `alt="" aria-hidden="true"` ;
   `server/status/queries/index.twig` h3→h2 ; `$code-color: #ad1457` ×4
   `_variables.scss` (+ tracking/tables.twig même fix img).
3. **Rejeu complet — reproduit.** Voir tableau ; les deux stacks sont des
   clones @e7e3f96 + patch + `yarn build` + `composer install` en docker +
   seed, que j'ai moi-même construits.
4. **install-build + sidecar — sidecar conforme ; log livré obsolète
   (W5).** Le `install-build.log` livré décrit encore 68 fichiers / 45
   scénarios / :8081 / image `pma31-web` — ère v1, jamais rafraîchi à v4.
   Mon install-build rejoué verbatim au niveau v4 :
   `~/work/run31v5/install-build-v5.log` (88 fichiers, 64 scénarios,
   :8532, 0 viol).
5. **Provenance — 36/36 exacts, 1 wart de couverture (W6).**
   `rehash-provenance.py --strict` → exit 1 : `verdict-fixer-v4.md`
   livré mais absent de la liste. J'ajoute son hash + celui de ce verdict
   à `provenance.json` (convention « livre le fichier ») — tous les autres
   verdicts passés y figurent.
6. **Chasse — voir ci-dessous.**

## Chasse (hors-scope)

195 routes `#[Route]` énumérées ; 47 en scope ; hors-scope réels = pages
servies GET complètes : data-dictionary, database/routines,
preferences/{export,features,import,sql,two-factor}, server/status/
{monitor,processes,variables}, table/{add-field,chart,find-replace,
gis-visualization}, transformation/{overview,wrapper}, triggers,
user-password, view/operations, changelog, browse-foreigners,
check-relations, import, navigation, server/engines/InnoDB, table/get-field
(27 sondées). Le reste des 195 = 405 POST-only, 400/500 param-required, ou
stubs ajax « Loading » ~2,8 Ko — pas des pages.

**Violations résiduelles hors-scope (axe 4.13.0 sur :8532, stack patchée) :

| Règle | Page | Occ | Origine |
|---|---|---|---|
| label [CRITICAL] | /table/add-field | 1 (`input[name=online_transaction]`) | `column_definitions_form.twig:151` — checkbox sans label, **non touché par le patch** |
| label [CRITICAL] | /user-password | 3 (`pma_pw`, `pma_pw2`, `generated_pw`) | `server/privileges/change_password.twig:29,33` + `primary_add_replica_user.twig:75` — **non touchés** |
| landmark-one-main + region [MODERATE] | /changelog | 2 (`html`, `pre`) | page XHTML autonome sans landmarks — **non touchée** |

→ 3 règles / 6 occurrences, toutes héritées d'@e7e3f96 dans du code hors
patch. Pas une régression — backlog explicite pour un prochain scope.
`/database/tracking` → HTTP 500 : feature nécessitant pmadb (`$cfg['Tracking']`)
non configurée — limite produit, pas un constat a11y.

**2.5.3 (aria-label vs nom visible)** : sondé sous axe **4.14.0** en scratch
(`~/work/axe414`, rule `label-content-name-mismatch` absente de 4.13) sur
les 47 urls → **0 mismatch** ; contrôle positif vivant (bouton injecté dont
aria-label contredit le texte → 1 violation détectée = sonde sensible).

## Warts v5

- **W5 — `install-build.log` livré obsolète** : contenu ère v1 (68
  fichiers, 45 scénarios, port 8081, image `pma31-web`) alors que le patch
  v4 = 88 fichiers / scope 64 scénarios. Documentation interne seulement —
  mon rejeu verbatim (`install-build-v5.log`) supplée, mais le livrable
  affiche des chiffres qui ne correspondent plus au patch.
- **W6 — couverture provenance** : `verdict-fixer-v4.md` livré non listé
  dans `provenance.json` → `--strict` exit 1. Corrigé dans ce commit
  (hash ajouté, avec celui de ce verdict).
- Note honnêteté : le Δ incomplets (1656 vs 1670, 1684) vient entièrement
  du bucket color-contrast PASS (−14) — les sondes confirment la
  distribution N-A à l'unité près nulle. Bruit axe entre runs, documenté
  depuis v3.

## Fichiers du rejeu (hors repo, rejouables)

`~/work/run31v5/` : `stress-lock.mjs` (verrou + adversaire cookie périmé),
`probe-cancel.mjs` (frappe déterministe), `install-build-v5.log`,
`reports/final` (:8531), `reports/install-build` (:8532), `reports/hunt`
(27 hors-scope), `probes-v5.json`, `auth.json`, `auth-ib.json` ;
`~/work/axe414/probe253.mjs` (2.5.3 sous axe 4.14.0).

## Verdict

**CONFIRMED.** Tout le claim fixer v4 tient au rejeu indépendant : verrou
universel fonctionnel (spam réel + adversaire armé + frappe déterministe),
88 fichiers 0 rejet, 64/64 × 2 stacks 0 viol, verify 25/25, eval 0 FAIL,
sondes 0 FAIL distribution identique, scope v4 0 viol, contraste 6,00:1
mesuré, sidecar réparé. Warts résiduels mineurs (log install-build ère v1,
couverture provenance — corrigée ici) + 6 occurrences résiduelles
hors-scope héritées du produit à candidater au prochain cycle.
