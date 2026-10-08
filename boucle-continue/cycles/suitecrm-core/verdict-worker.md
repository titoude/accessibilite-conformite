# Cycle 58 — verdict worker : suitecrm-core (SuiteCRM/SuiteCRM-Core v8.9.3)

## Chiffres

| | règles | occurrences | erreurs | incomplets |
|---|---|---|---|---|
| baseline auth (vanilla :9960, 28 scénarios) | 19 | 1364 | 0 | 146 |
| baseline public (vanilla :9960, 3 scénarios) | 5 | 21 | 0 | 5 |
| final auth (patché :9950) | **0** | **0** | **0** | 118 |
| final public (patché :9950) | **0** | **0** | **0** | 2 |
| install-build :9970 (clone @SHA + git apply + build + seed + rescan) | **0** | **0** | **0** | 151 |

1364 → 0 occurrences sur 28 scénarios auth (15 urls + 13 états dynamiques) + 3 publics ; **0 scénario sauté**.

## Correctifs — vraies sources uniquement

60 fichiers, +167/−88 (`patch.diff`, sha256 `6116ab34…`). Familles :

- **Landmarks/structure** : `<main>` unique + h1 sr-only par page (app.component), `<footer role="contentinfo">`, h5→h2 cartes admin, `<li>` orphelins→`<div>` (sub-menu recently-viewed/favorites, grouped-menu-item), nav interne navbar → `<div>`.
- **Nommage** (button/link/label/select/frame-name) : aria-label/titleKey résolus i18n sur ~30 templates de champs (relate, multirelate, multienum, date, datetime, p-dropdown/p-multiSelect + filtres), boutons row/modal/close/add/delete/back/favorite, iframe title, inputs login, togglers mobile, select chart (`LBL_CHARTS`), `<label>`/`label[for]` réparés.
- **Liaisons** (leçon 42) : `aria-labelledby` pendants supprimés (`navbarDropdownMenuLink` ×4) ou id réel ajouté (`ngb-accordion-item-0-toggle` sur l'ancre subpanel).
- **Tableaux** : th vides comblés par texte réel `.scrm-visually-hidden` (empty-table-header exige du texte — aria-label insuffisant).
- **2.5.3** : texte du compteur bulk-action sorti du bouton (nom accessible ⊇ visible).
- **Contrastes** : palette AA mesurée luminance dans `_variables.scss` (burnt-red #b5403a, salmon-pink #f9c5c0, pale-blue #4e7391, dull-orange #a3381f, nepal/shell/cool greys, light-orange, coral-pink, bright/highlight-purple) + placeholders : `$midnight-grey` global sur fond clair, `#fff` sur `.search-bar-term` (fond #757083) + hover bg `$dusky-blue`.
- **Cibles** : min 24px icônes svg/boutons-icônes (`_svg.scss`, `_button.scss`).

## Vérifs

- `verify.mjs :9950` → **32/32 OK**.
- `eval-final.mjs :9950` → **16/16** (1 N-A : aucune région aria-live dans le produit).
- **Sabotage** (lang=en retiré du dist + revert #b5403a→#ef8177) → **2 FAIL nommés exacts** : `public: html lang renseigné`, `contraste nameLink ≥ 4.5` ; restauration → 32/32.
- `verify.mjs :9960 vanilla` → **10 FAIL nommés** attendus (landmarks/h1/footer absents, message-close `<a type=button>`, table liste absente 90s, togglers mobile sans nom) + 3 N-A.
- `incomplete-probes` : final-auth 97 items → 83 mesurés 0 NC + 14 N-A ; install-build 130 → 84 mesurés 0 NC + 46 N-A ; public 2/2.

## Leçons nouvelles / warts éprouvés

1. **`angular.json` est gitignoré** dans SuiteCRM-Core — généré par `yarn merge-angular-json` (plugin yarn du repo) après `yarn install` sur tout clone frais.
2. **`composer install` sans `--no-dev`** : les post-install scripts chargent `DoctrineFixturesBundle`.
3. **L'installeur `suitecrm:app:install` réécrit `.env.local`** (APP_SECRET aléatoire, env non prod) → le profiler Symfony sert du HTML (`sf-toolbar`) qui fausse axe : ré-assertion APP_ENV=prod + purge `cache/prod` post-install obligatoire (cache réel = `/var/www/html/cache`, pas `var/cache`).
4. **L'installeur mute `AOW_WorkFlow_Hook.php`** à chaque install — exclure du patch (revert avant `git diff`).
5. **État d'expansion de l'accordéon subpanels variable selon l'instance** (préférences utilisateur) : l'état doit cliquer le header-toggle `.sub-panel-header-toggle a` si le corps est absent — sélecteurs de classes produit, pas l'id ajouté par le patch (leçon 47).
6. **axe 'emptyValue' sur inputs = contraster le `::placeholder`**, pas `color` de l'élément (la sonde mesure `getComputedStyle(el,'::placeholder')`).
7. Fond `#757083` mid-tone : **aucune couleur de texte n'atteint 4.5** (noir=4.4, blanc=4.77) → placeholder blanc + assombrir le hover bg.

## Leçons critiques respectées

40 pureté vanilla prouvée avant baseline (grep marqueur + git status) ; 44/46 ids issus du seed uniquement ; 45 chaque état audité (0 sauté) ; 47 sélecteurs vanilla-safe ; 32 stateProof DOM ; 43 labels i18n résolus (aucun slug brut) ; 42 liaisons résolues ; 38 `locale:'en-US'` ; 26 provenance re-hash en dernier ; 8 eval ne détruit pas auth.

## Arborescence livrée

`manifest.json` (auditCommands verbatim), `results.json`, `patch.diff` + `patch.diff.sha256`, `provenance.json` (--strict), `tools/` (boot.sh, docker-compose.yml, Dockerfile, seed.mjs, login.mjs, gen-urls.mjs, audit.mjs, verify.mjs, eval-final.mjs, incomplete-probes.mjs, urls-*.tpl.txt, seed-info.json, package*.json), `reports/` (baseline-auth, baseline-public, final-auth, final-public, install-build — report.json+report.md+scope.json+probes.json, vanilla-purity.txt).
