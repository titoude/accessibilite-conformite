# Verdict auditeur — cycle 36 grocy

**Verdict : PARTIAL** — tous les claims de reproductibilité rejoués et corroborés (patch 0 rejet, 0 viol final axe 4.13.0, verify 16/16, eval 0 FAIL, sondes 277 PASS / 0 FAIL, install-build identique, provenance 46/46), **MAIS** la chasse indépendante a trouvé une famille de défauts WCAG 2.5.3 (label-content-name-mismatch) **introduite par le patch** et invisible sous l'axe 4.13.0 épinglé : deux `aria-label="Toggle"` posés sur des toggles à texte visible. Plus un résidu hors-scope (/transfer) et trois warts d'outillage. Ce verdict n'affirme pas la conformité WCAG : périmètre axe seul + sondes ciblées.

Auditeur : session indépendante (devin-400b88ad565c47adabff1d73e35071ed), VM neuve, rejeu complet sur mes propres ports (:8210 patché, :8211 install-build, :8212 vanilla) — zéro réutilisation des instances du worker.

## Méthode de rejeu (indépendante)

- Clones frais `github.com/grocy/grocy` ×3, checkout `41206cb90154e0d17d3e108cc1f182b94fdb465d`.
- `git apply --check` puis `git apply` de `patch.diff` livré → **0 rejet, 96 fichiers, +1426/−569 exactement comme annoncé** ; sha256 du diff = sidecar `ff06b8a0…`.
- Boot selon manifeste : image `grocy36-web` (php:8.5-cli + pdo_sqlite/gd/intl/mbstring + composer ; tirée via mirror.gcr.io, Docker Hub en 429), `composer install` + `yarn --frozen-lockfile` + seed démo→prod (`GROCY_MODE=demo` → `grocy_en.db` copié en `grocy.db`, restart production, `admin`/`admin` hashé).
- `npm ci` dans une copie de `tools/` (createRequire résout depuis CWD) → playwright 1.63 + axe-core **4.13.0** confirmé partout (package.json + testEngine des rapports).
- Rejeux : audit.mjs final + baseline vanilla + public /login + verify.mjs + incomplete-probes.mjs + eval-final.mjs + rehash --strict.

## Résultats du rejeu

| Étape | Livré | Rejoué | Verdict |
|---|---|---|---|
| patch.diff | 96 fichiers +1426/−569 | 0 rejet, stats identiques | OK |
| baseline auth | 85 sc., 22 règles/6554 occ/783 inc/3 err | **84 sc., 22 règles/6610 occ/818 inc/0 err** | OK magnitude — distribution quasi identique (region 3741/3710, link-name 1279/1267…) ; écart +0,8% expliqué : mes 3 pages « erreur » livrées ont scanné proprement. urls-auth.txt livré = scope final (73→71 urls, les 2 urls en erreur retirées — documenté manifeste) |
| final :8210 | 84 sc., 0 viol/0 err/471 inc | **84 sc., 0 viol/0 err/466 inc** | OK — 466 = le rapport IB livré au nœud près (delta 471 live = transitoire DOM) |
| public /login | 0 viol | 0 viol (+ login-failed 0) | OK |
| install-build clone vierge | :8081 → 0 viol/466 inc | **:8211 → 0 viol/466 inc, distribution par règle et par page identique au rapport livré** | OK |
| verify.mjs | 16/16 | **16/16** | OK avec wart F3 (1 assertion vacuus live) |
| incomplete-probes | 277 PASS + N-A | **277 PASS (276 contraste + 1 form-label) + 189 N-A + 0 FAIL** | OK — N-A honnêtes, jamais comptés PASS |
| eval-final | 0 FAIL | **0 FAIL** (12 pages axe, dup-ids, modale post-.show, mobile 390, sidenav ×4) | OK |
| provenance | 46 empreintes | **46/46 conformes --strict** | OK |
| axe pin | 4.13.0 | 4.13.0 cohérent | OK |

## Vérifications indépendantes demandées

- **Meta-refresh annulable (2.2.1) — VRAI, vérifié live dans les deux sens** : 404 sans `<meta refresh>`, `#cancel-redirect-button` présent ; sans clic → redirection 5 s vers /stockoverview ; avec clic → « Redirect cancelled. », aucune redirection à 6,5 s.
- **Mode nuit contrastes !important — pixel-vrai** (screenshot → clustering couleurs, pas computed-style) : sidenav 7,01:1 ; body 9,28:1 ; `.btn-primary` nuit 4,97:1 ; td table nuit 13,16:1 — tous ≥ 4,5.
- **CalendarService::GetEventColors clés nommées — correct** : `color`/`textColor` sont les bonnes clés FullCalendar 3.10 (vérifié dans la dist livrée) ; formules luminance/contraste conformes WCAG ; 36 événements réels mesurés ≥ 4,5 par verify.
- **Sonde effectiveBg « alpha inversé » — le fix principal est correct** (`acc over c` dans la boucle, box-shadow inset compté comme couche) ; **mais résidu ligne 63** : le fallback `acc[3]<1` calcule `255*(1-a)+acc[i]` sans `×acc[3]` sur `acc[i]` — surestime les canaux pour les couches translucides colorées (peut dépasser 255 : rgba(200,100,0,.3) → 378). **Dormant sur grocy** : les ancêtres sont toujours opaques (vérifié sur les 276 PASS — la boucle `break` avant le fallback). Défaut d'outillage réel, jamais atteint sur ce produit.
- **États racés (leçon 32)** : 3/12 états sont positionnels sans preuve de contenu (`header-user-menu` nth(0), `view-settings-menu` nth(1), `settings-menu` nth(2) n'attendent que `.dropdown-menu.show`). Ordre DOM vérifié live : nth(0)=user (Logout/Change password), nth(1)=view-settings (radios), nth(2)=wrench (Stock settings…) — l'hypothèse tient sur ce produit, mais l'état prouverait un *mauvais* widget si le markup bougeait. Les 9 autres états prouvent le bon widget (sélecteurs de contenu dans le menu ouvert, `.modal.show iframe`, `#reschedule-chore-modal`…).
- **Routes Twig non couvertes** : 125 routes GET Slim énumérées, ~50 API JSON ; seules vraies pages UI hors scope = `/transfer`, `/` (→/stockoverview, 0 viol), `/print/shoppinglist/thermal` (404 sans paramètres).

## Findings

- **F1 (majeur) — WCAG 2.5.3 introduit par le patch, invisible sous axe 4.13.** Deux `aria-label="Toggle"` ajoutés sur des toggles à texte visible → le nom accessible « Toggle » remplace le bon nom (« Manage master data », « Show more ») et ne contient pas le texte visible :
  - `views/layout/default.blade.php` `.nav-link-collapse` (vanilla n'avait **pas** d'aria-label — le `<span class="nav-link-text">` fournissait déjà le nom) → `label-content-name-mismatch` sous axe-core **4.14.0** sur **12 pages du scope** (/products, /locations, /productgroups, /quantityunits, /shoppinglocations, /taskcategories, /userentities, /userfields, /userobjects/*, /batteries, /batterytracking, /chores) dès que le lien est dans le viewport de la sidenav (prouvé : /stockoverview flagué après `sidenav.scrollTop=99999`, pages master-data en `active-page`).
  - `views/components/productcard.blade.php` « Show more » (`aria-label="Toggle"`) — flagué live dès qu'un produit à description est ouvert (vérifié : Cold cuts, description 591 car., sur /stockoverview).
  - +1 amont (non-patch) : bouton Summernote `button[data-original-title="Font Size"]` (aria-label « Font Size » vs « 13 » affiché) flagué sur 4 pages avec éditeur (/shoppinglist, /product/1, /recipe/1, /equipment/1) — le patch modifie grocy_summernote.js pour `.note-editable` mais ne couvre pas l'émission amont.
  - Le claim manifeste « aria-label ajoutés contiennent TOUJOURS le texte visible (leçon 29) » est **falsifié**. Sous 4.13.0 épinglé la règle est muette (expérimentale, enabled:false) → le « 0 viol » livré est honnête dans son périmètre, mais le défaut est réel et régressif.
- **F2 (résidu) — /transfer : select-name non corrigé.** `#specific_stock_entry` (`<select disabled>` sans label) flagué 1 occ sous axe 4.13 sur l'instance patchée ; pré-existant vanilla, hors scope des 71 urls ; le patch corrige h2→h1 dans ce même fichier sans toucher le champ.
- **F3 (wart) — verify.mjs `?? 9` vacuus** : `check('btn-success jour >= 4.5', (m.success ?? 9) >= 4.5)` — élément absent → `9>=4.5` PASS. Constitué live : mon rejeu imprime `PASS btn-success jour >= 4.5 — ratio=undefined` (le bouton n'existe pas jour ; nuit il est mesuré 5,12). 4 assertions ont ce gabarit.
- **F4 (wart) — sonde incomplete-probes ligne 63** : cf. ci-dessus, formule de fallback fausse (dormante ici).
- **F5 (nit) — états positionnels** : 3 dropdowns nth() sans assertion de contenu (leçon 32 — hypothèse vérifiée exacte aujourd'hui).
- **F6 (nit)** — `tools/package.json` nommé `a11y-cycle31-phpmyadmin-tools` (copie du cycle 31) ; urls-auth.txt livré ≠ scope baseline documenté (2 urls en erreur absentes → la commande baseline du manifeste ne reproduit pas 85 scénarios mais 84).

## Chiffres clefs rejoués

- Baseline : **22 règles / 6 610 occ / 818 inc / 0 err** (84 sc.) — livré 6 554/783/3 err (85 sc.) : même magnitude, distribution identique.
- Final : **0 viol / 0 err / 466 inc** (84 sc.) ; public **0** ; install-build **0/466** ; verify **16/16** ; eval **0 FAIL** ; sondes **277 PASS / 189 N-A / 0 FAIL** ; provenance **46/46**.
- Sous axe 4.14 (sonde lcnm) : **12 pages flaguées** (nav-link-collapse) + 4 pages (Font Size amont) + productcard latent confirmé.

## Recommandation

Corriger les deux `aria-label="Toggle"` (mettre le texte visible : `aria-label="{{ $__t('Manage master data') }}"` ou rien — le span suffit ; idem « Show more »), couvrir /transfer dans le scope, fixer le `?? 9` et la ligne 63 de la sonde. Après fixer : re-sonde lcnm sous 4.14 sur tout le scope attendu à 0.
