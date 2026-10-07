# verdict-auditeur-v4 — cycle 31 phpmyadmin

**Verdict : CONFIRMED** — le fixer v3 (commit `aea5607`) tient tout ce que le
ré-audit v3 (`559d1ba`) avait mesuré et tout ce qu'il prétend, à une nuance
d'outillage près : patch 83 fichiers 0 rejet, stack fraîche construite **par
moi** (clone @e7e3f96 + patch + yarn build + composer docker + stack :8511 →
0 viol/0 err), final **rejoué verbatim ×2 runs complets** : run 1 = 60/61
scénarios 0 viol + 1 erreur flaky (voir W2), run 2 = **61/61 scénarios,
0 viol, 0 err, 1620 incomplets** (livré : 1613 — bruit heuristique axe).
Les 33 occ résiduelles v3 → **0** (mesurées 36 sur mon vanilla, même
familles ±3). Thèmes : metro teal/redmond/blueeyes/mono + bootstrap-light +
fix `--button-background` rejoués 0 viol ; substitution dark honnête.
Warts v4 : **`patch.diff.sha256` périmé** (hash v2), **course thème
résiduelle via `/navigation`** non bloquée (1 annulation de mutation sur 122,
échec bruyant grâce à leur garde), comptage sondes prose≠fichier. Chasse :
**4 occ résiduelles sur 3 pages hors-scope** (events, status/queries,
preferences/navigation) — candidates cycle suivant.

- Ré-auditeur : session `devin-9711d03ed6e4463cb531bf599b798a5d` (spawnée par
  devin-3cde6939fc0b489ab7c0d2ffa16c3255), indépendante du fixer.
- Produit : phpmyadmin/phpmyadmin @ `e7e3f96ac4c65f291cc7ced271c0bb6d4ea591ee`
- Méthode : `~/work/pma31-v4-vanilla` :8510 (clone propre, net `pma31v4a-net`)
  + `~/work/pma31-v4-patched` :8511 (clone + patch v3, net `pma31v4b-net`,
  image locale `pma31-v4-web` = php:8.3-apache + mysqli/pdo_mysql/mbstring/
  gd/zip) ; outillage copié `~/work/run31v4`, axe-core **4.13.0** (pin livré,
  respecté), playwright 1.63 ; commandes manifest rejouées verbatim, origines
  réécrites :8080→:8511 ; axe 4.14 en scratch séparé pour la sonde 2.5.3.

## Rejeu vs livré — chiffres

| Axe | Livré (fixer v3) | Rejeu v4 indépendant | Δ |
|---|---|---|---|
| patch apply | 83 fichiers, 0 rejet | **83 fichiers, 0 rejet** (whitespace warnings seuls) | identique |
| baseline-public | 3 sc. / 18 occ / 0 err (avec `/themes`) | **3 sc. / 18 occ / 0 err** — landmark-one-main ×3 + region ×15, identique à l'occurrence | identique |
| baseline-auth | 5045 occ / 14 règles (scope v2, 36 urls) | **5689 occ / 15 règles** sur scope v3 (44 urls) | Δ expliqué : +8 pages scope (+441 region, +80 image-redundant-alt, +14 label, +18 select-name…) ; 15e règle = heading-order ×1 advisor |
| final v3 | 61 sc. / 0 viol / 0 err / 1613 inc | **run1 : 60/61 audités 0 viol + 1 err (W2) ; run2 : 61/61, 0 viol, 0 err, 1620 inc** | +7 inc = bruit cc axe (metro ±14, sql-browse ±16) |
| install-build | 45 sc. / 0 viol / 1071 inc | ma stack patchée **est** un clone+patch+build frais (yarn build + composer docker) → mêmes 44 urls 0 viol | conforme |
| sondes incomplets | « 1567 P / 46 N-A / 0 FAIL » sur 1613 | fichier livré = **1573 P / 40 N-A / 0 FAIL** ; mon rejeu = distribution **octet-identique** par règle×verdict | voir W3 |
| verify.mjs | 25/25 | **25/25 PASS** | identique |
| eval-final.mjs | 0 FAIL | **0 FAIL** | identique |
| provenance.json | 35 fichiers sha256 | **35/35 exacts** re-hachés depuis le disque | identique |
| patch.diff.sha256 | (sidecar) | **PÉRIMÉ : contient `d10fea…` = sha256 du patch v2** ; vrai hash v3 = `34364b06…` (cohérent avec provenance) | W1 |
| scope 6 pages v3 | 33 occ → 0 | vanilla : **36 occ** famille résiduelle (mêmes règles, +3) → patché **0** sur les 2 runs | voir §Épreuves 2 |

## Épreuves du brief (rejouées)

1. **Rejeu complet — reproduit.** Clone @e7e3f96 + `git apply patch.diff` :
   83 fichiers, 0 rejet. Build : `yarn` + `yarn build` (webpack prod) +
   `composer install` en docker (pas de PHP local) + seed `tools/seed.sql` →
   stack :8511. Rescan verbatim du manifest final_v3 : les 2 runs complets
   donnent **0 violation sur chaque surface auditée**.
2. **Scope v3 — les 6 pages rejouées 33→0.** Vanilla :8510 mesuré par moi sur
   les familles résiduelles : central-columns label×3/select-name×6/
   empty-th×2/lto×1 = 12 ; multi-table-query label×4/select-name×6/lto×3 =
   13 ; zoom-search select-name×4 ; view-create label×4/select-name×2 = 6 ;
   advisor heading-order×1 ; normalization heading-order **0 chez moi** (×1
   chez v3 — le wizard rend selon l'état de la table ; v3 totalisait 33,
   j'en mesure 36, mêmes familles ±3). Patché :8511 : **0 viol** sur les 6
   pages aux 2 runs (labels for/id + select names + heading-order posés).
3. **Thèmes — 9 états rejoués 0 viol.** theme-metro (+teal/redmond/blueeyes/
   mono), theme-original, theme-bootstrap-dark, theme-bootstrap-light,
   console-dark-pmahomme : 0 viol aux 2 runs. **Fix `--button-background`
   vérifié** : scss metro `#aaa→#04627c` (win) / `#a10707` / `#666` présent
   dans `themes/metro/scss/_variables.scss` et dans le `theme.css` compilé —
   boutons « go » ≥4,5:1. **Substitution dark honnête** : `theme.json`
   pmahomme + original = `colorModes:["light"]` lu dans le clone — la doc
   fixer dit vrai, le mode sombre est bien couvert par `Console/DarkTheme`
   serveur.
4. **Warts v3 — tous résorbés.** (a) `reset-theme.mjs` SyntaxError corrigé
   **et exécutable** : salissage (`/tmp/dirty-theme.mjs` : set metro-mono via
   l'outil de mutation + POST userconfig) → reset-theme → **pmahomme/light
   prouvé** (storageState réécrit, sondes passent). (b) baseline public
   complète : 3 scénarios avec `/themes`, 18 occ rejouées à l'identique.
   (c) axe-core **4.13.0 épinglé exact** dans `tools/package.json` +
   `package-lock.json` présent → mon npm ci installe 4.13.0.
5. **Course cookie/pref — fix réel, fenêtre résiduelle (W2).** Leur
   diagnostic est juste : `UserPreferencesHandler::loadUserPreferences()`
   re-sauve `ThemeDefault=<cookie>` quand cookie≠pref, toute requête portant
   un cookie périmé peut annuler une mutation. Leur correctif fonctionne :
   `page.request.post` + `ajax_request=true` + `maxRedirects:0` + blocage
   `page.route` de 3 routes ambiantes ; mes replays de mutation **persistent**
   (reset-theme dirty→pmahomme, mobile-nav, retry console-dark, run2 complet).
   **Mais** `/navigation&ajax_request=1` n'est pas dans la liste bloquée :
   au run 1, un POST `/navigation` (cookie bootstrap) à 11:22:06 a encadré le
   `themes/set` pmahomme du même instant → le reload suivant a servi
   **bootstrap** (preuve : access-log apache, `GET theme.css` bootstrap à
   11:22:06) → timeout sur la garde `link[href*=pmahomme]`. 1 annulation sur
   122 mutations mesurées (≈0,8 %) ; la garde rend l'échec **bruyant**, pas
   un scan silencieux sous mauvais thème — c'est le bon mode d'échec.
   Récidive possible : ajouter `/navigation` (et idéalement toute route
   ambiante) au blocage, ou sérialiser les mutations après `networkidle`.
6. **verify/eval/sondes/provenance — rejoués.** verify 25/25, eval 0 FAIL,
   provenance 35/35 sha256 exacts. Sondes : le fichier livré
   `probes/incomplete-probes.json` est distribution-identique à mon rejeu ;
   le chiffre de prose « 1567P/46NA » regroupe les PASS `th-has-data-cells`
   en N-A — le vrai fichier dit 1573P/40NA/0F (voir W3).
7. **Chasse élargie — 4 occ résiduelles trouvées.** 195 routes `#[Route]`
   énumérées vs 44 urls du scope ; 17 routes GET non couvertes à formulaires
   sondées : vanilla 2391 occ/8 règles → **patché : 4 occ / 3 règles** :
   `/database/events` image-alt ×1 (`toggle-ltr.png` sans alt),
   `/server/status/queries` heading-order ×1 (`<h3>` orphelin),
   `/preferences/navigation` color-contrast ×2 (`<code>main/new` #d63384 sur
   fond effectif #eee = **3,90:1 < 4,5** mesuré live — pas un faux positif).
   **Sonde 2.5.3 sous axe 4.14** (scratch séparé, kit livré inchangé) :
   `label-content-name-mismatch` = **0** sur les 44 pages patchées, contrôle
   positif validé — aucune régression 2.5.3 introduite par le patch.

## Warts v4 (mesurés)

- **W1 — `patch.diff.sha256` périmé.** Contient `d10fea01…` = sha256 du
  patch **v2** ; le patch v3 mesure `34364b06…` (valeur cohérente avec
  `provenance.json`, qui liste lui le bon hash). Le sidecar n'a pas été
  régénéré au bump v2→v3 — provenance OK, sidecar faux. Corriger au prochain
  commit (3e variante du problème « régénéré≠rehaché » de la boucle).
- **W2 — course thème résiduelle via `/navigation`.** Le blocage
  `page.route` couvre `/git-revision`, `/version-check`,
  `/console/update-config` mais pas `/navigation&ajax_request=1` — XHR
  ambiante émise par la page courante, écrivain de pref par le même
  middleware. 1 annulation observée sur 122 mutations (flaky, non
  déterministe ; retry solo + run 2 = PASS). L'échec est bruyant (garde
  pmahomme-link), jamais silencieux — mais le claim « plus aucun écrivain de
  pref en vol pendant la fenêtre de mutation » est falsifié.
- **W3 — headline sondes prose≠fichier.** « 1567P/46NA » compte les PASS
  `th-has-data-cells` en N-A ; le fichier = 1573P/40NA/0F. Mon rejeu matche
  le fichier à l'identique — écart de présentation seulement.
- **W4 (nit) — normalization heading-order non reproduit.** V3 l'avait
  mesurée ×1 ; absente sur mon vanilla (36 vs 33 occ, même distribution ±3).
  Dépend de l'état rendu du wizard — pas un trou, une variabilité de données.

## Chasse — hors-scope restant (mesuré sur patché :8511)

3 pages hors-scope gardent des violations réelles (**4 occ**) :

| Page | Violations |
|---|---|
| `/database/events` | image-alt ×1 CRITICAL (`.toggle-container > img` toggle-ltr.png sans alt) |
| `/server/status/queries` | heading-order ×1 (`.container > h3` sans h2 amont) |
| `/preferences/navigation` | color-contrast ×2 (`<code>` #d63384 / #eee = 3,90:1) |

→ mêmes familles que le patch (image-alt décoratif, hiérarchie de titres,
contraste `<code>` bootstrap). Candidate directe pour le périmètre du cycle
suivant, avec les 2 routes 4xx/405 exclues (maintenance = POST-only,
replace = 400 sans paramètres).

## Ce que le verdict signifie

- **CONFIRMED** : chaque métrique produit rejouée à l'identique — 0 violation
  axe sur les 61 scénarios au run 2 complet (et sur les 60 audités du run 1),
  résiduels v3 33→0, thèmes 0 viol, fixes mesurés vrais en live
  (`--button-background`, colorModes honnête, tracking/designer stables).
- L'unique non-reproduction (1 scénario en erreur au run 1) est un défaut
  **d'outillage** résiduel — course `/navigation` — que la garde du fixer a
  rendu bruyant (timeout explicite) plutôt qu'un scan silencieux faussé ;
  le produit lui-même affiche 0 viol partout, y compris au retry solo et au
  run complet suivant. Cohérent avec le précédent v3 (CONFIRMED malgré
  l'outil reset-theme SyntaxError — plus grave : mort, pas flaky).
- La boucle progresse : les 3 warts outillage v3 sont tous résorbés et les
  livrables sont plus propres (baseline complète, axe épinglé, provenance
  35/35). Restent : sidecar sha256 à régénérer (W1), `/navigation` à bloquer
  (W2), et 4 occ hors-scope à intégrer au scope du prochain fixer.
