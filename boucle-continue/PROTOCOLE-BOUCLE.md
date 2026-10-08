# Boucle continue test → audit → correction

Procédure du cycle d'amélioration continue du produit. Pilotée par la session
coordinatrice (Devin). Objectif : faire tourner le workflow sur des dépôts open
source **jamais testés**, faire auditer chaque résultat par un agent
indépendant, corriger la procédure à chaque faille trouvée, et tout documenter.

## Un cycle = 4 étapes

1. **Worker** (session fille) : choisit UN dépôt OSS dans sa liste assignée,
   jamais présent dans `REGISTRE.md`, et applique la procédure complète
   (`benchmark-v3.py` avec `A11Y_CYCLE_REPOS`) : boot → manifeste figé → audit
   baseline → corrections → vérification indépendante → éval finale → artefacts
   complets (`patch.diff`, `manifest.json`, `provenance.json`, `states.json`,
   `report.json`, `scope.json`, `verify.mjs`, `eval-final.mjs`).
   Contraintes dures : jamais de PR vers le dépôt tiers, jamais de modification
   du produit pour satisfaire le harnais, jamais de réécriture des preuves.
   Sortie : structured_output + tous les artefacts attachés à son message final.

2. **Auditeur** (session fille distincte, lancée après le worker) : re-clone le
   dépôt upstream au SHA épinglé, applique le patch, ré-exécute install
   verrouillée + build + scan, recalcule les hashes, relit le patch à la
   recherche de triche (fonctionnalités supprimées, contenu retiré, harnais
   adapté au produit, assertions faibles), vérifie la cohérence du verdict.
   Sortie : verdict PASS/FAIL/NOT_TESTED + findings.

3. **Consolidation** (coordinateur = moi) : je compare worker vs auditeur,
   j'applique `validate_result()` de `benchmark-v3.py`, j'inscris le résultat
   dans `REGISTRE.md` (le dépôt ne sera jamais retesté), je documente toute
   anomalie.

4. **Correction** : toute faille de procédure trouvée → correction dans le
   package (SKILL.md, audit.mjs, workflow, validateurs…) + commit + entrée dans
   `JOURNAL.md`. Puis cycle suivant.

## Règles

- Max **4 sessions filles en parallèle** (workers + auditeurs confondus).
- Un dépôt dans `REGISTRE.md` n'est **jamais retesté** — les workers doivent
  vérifier le registre avant de choisir.
- Verdicts honnêtes : CONFIRMED = reproductibilité du score axe + rejeu
  indépendant, PAS conformité WCAG complète.
- Échecs conservés et documentés — rien n'est effacé.
- L'auditeur ne reçoit que les artefacts du worker, pas ses conclusions — il
  doit former son propre verdict.
- Les artefacts voyagent via les attachments de session + structured_output
  (les sessions filles ont des VM séparées, rien n'est partagé).
- **Seed littérale et réaliste** : le seed DOIT épingler les littéraux exacts
  et couvrir le cas réel dominant — pour toute app de messages/contenu, un
  message Markdown **contenant un lien** et du contenu réellement rendu
  (jamais un shell vide). Défauts attrapés 3 fois par cette règle :
  ntfy F1 (`a{color:#338574}` 4.42:1), gotify F1 (`.content & a` 2.49:1),
  docmost M1 (« 0 violation » creux car la page docs était sans contenu).

## Fenêtre

Boucle active jusqu'à ~16h-17h Paris (14h-15h UTC) le 2026-10-04, ou arrêt
utilisateur. À la fin : commit du registre + journal + rapport de boucle.

## Leçons harnais accumulées (alimentent SKILL.md / audit.mjs)

1. **Animations d'entrée** : axe mesure l'état en cours de transition (fade-in
   ~300-950ms) → faux positifs contraste. Chaque état doit attendre un état
   SÉDIMENTÉ (sélecteur stable + délai calibré), jamais seulement `load`.
   Exemples : homepage (fade modale 300ms), actual (entrée welcome ~950ms).
2. **Routes SPA dépendantes des données** : une route qui redirige vers un ID
   généré (ex. `/reports` → `/reports/<dashboardId>`) n'est pas déterministe →
   substitution déclarée dans le manifeste vers une route fixe équivalente
   (`/reports/net-worth`), tracée dans `scope-compare.json`.
3. **État applicatif requis** : certaines routes n'existent qu'après une action
   (fichier démo ouvert, IndexedDB) → les états du harnais doivent être
   idempotents (openDemo rejouable) car chaque run part d'un profil neuf.
4. **axe ne voit pas tout** : un `verify.mjs` indépendant a attrapé des défauts
   invisibles pour axe — navigation mobile `display:none` sans aria-label,
   boutons nommés par un `title` posé sur un enfant non-focusable (title
   n'entre pas dans le nom accessible du bouton). La vérification indépendante
   doit inclure : nom accessible calculé des boutons, labels de landmarks
   dupliqués, title-enfant ≠ nom du parent.
5. **Deux landmarks de même rôle** doivent avoir des noms distingués — y
   compris ceux masqués par viewport (la nav mobile `display:none` compte
   pour axe aussi).

### Leçons harnais — cycle CyberChef (ajoutées au protocole)

1. **contenteditable.tabIndex === -1 n'est PAS une preuve de non-tabulabilité.** Les éléments `contenteditable` sans attribut tabindex restent dans l'ordre de tabulation naturel malgré la propriété -1. Assertion correcte : vraie tabulation Playwright (Tab jusqu'à `activeElement === cible`), jamais la propriété seule.
2. **axe est aveugle aux pièges clavier et aux indicateurs de focus absents.** eval-final.mjs doit contenir : (a) boucle Tab réelle sur ≥15 tabulations en vérifiant outlineStyle/boxShadow sur `activeElement`, (b) test d'échappatoire (focus dans l'élément suspect → Escape/Tab → vérifier que le focus sort). CyberChef: `Tab→insertTab` = piège 2.1.2 réel trouvé ainsi.
3. **Webpack dev-server ne recharge pas node_modules en watch.** Un correctif porté par un script postinstall n'apparaît dans le bundle qu'au rebuild complet → restart du serveur avant tout re-scan, sinon l'audit mesure l'ancien artefact (faux échec).
4. **Patchs de dépendances : passer par le mécanisme du projet.** CyberChef possède `exec:fixSnackbarMarkup` (postinstall qui édite `node_modules/snackbarjs`). Étendre ce script = le fix s'applique aussi en `npm ci` → couvert par install-build et livrable.

5. **Les métadonnées de provenance se calculent en DERNIER, depuis les fichiers sur disque.** Un auditeur indépendant a flaggé provenance.json : hash écrit avant la regénération finale du patch (lint fix) → mismatch. Règle : à la consolidation, recalculer sha256 depuis patch.diff sur disque et réécrire provenance.json/patch.sha256 — jamais copier un hash de mémoire ou d'un run antérieur.
6. **patch.diff inclut les NOUVEAUX fichiers** : `git diff` ignore les untracked — `git add -N <nouveaux fichiers sources>` avant `git diff HEAD`, PUIS install-build rejoué sur checkout propre (le défaut a frappé 4× : it-tools, RaspAP, navidrome v2, ntfy). Exclure les binaires/artefacts de build untracked.
6. **Étiqueter les corrections honnêtement.** Le fix meta viewport n'a corrigé aucune violation axe mesurée (aucune meta dans l'original) → le déclarer "durcissement préventif", pas "famille de violations corrigée". L'auditeur vérifie les libellés contre la baseline.

7. **Un check qui peut passer trivialement est interdit (« vacuous pass »).** Si l'élément testé n'est pas trouvé, c'est un FAIL ou un N-A déclaré — jamais `?? true`/fallback silencieux. L'auditeur a flaggé : ThemeToggle div+SVG jamais localisé → « PASS » sans rien vérifier. Règle : chaque assertion exige `élément trouvé = précondition obligatoire`.
8. **axe ne voit pas les interactifs non-focusables** (`div onClick`, `svg onClick` sans role/tabindex/handler clavier → WCAG 2.1.1 + 4.1.2 réels). verify.mjs doit scanner `[onclick]` sans `role`/`tabindex` explicites ET tester l'activation clavier des toggles (bascule thème, interrupteurs…).

### Leçons harnais — cycle HedgeDoc (ajoutées au protocole)

1. **Next App Router : composant serveur ≠ composant client.** Un layout RSC ne peut pas utiliser `<Trans>`/hooks/context (crash `createContext`). Les wrappers client (skip-link, aria-labels traduits) doivent être des composants `'use client'` importés par le layout serveur. Les imports relatifs se comptent depuis le fichier réel (`realpath`), pas depuis le dossier apparent.
2. **Hydratation tardive = faux positifs landmarks.** ApplicationLoader rend le `<main>` seulement après hydratation → axe scannant trop tôt voit un shell sans landmark (`landmark-one-main`, `page-has-heading-one` bidon). Obligatoire : `--wait-for '#main-content'` (ou sélecteur du contenu hydraté) avant tout scan.
3. **Piège Tab CodeMirror = prop `indentWithTab` de ReactCodeMirror (défaut true), PAS une option `basicSetup`.** `@uiw/react-codemirror` expose `indentWithTab` en prop top-level ; la désactiver rend Tab navigateur (conforme 2.1.2). Vérifier l'API réelle du wrapper CM utilisé par le projet — pas l'API CM6 brute.
4. **Une iframe focalisée est invisible pour les CSS ET les événements.** Sous Chromium, un iframe devenu `document.activeElement` ne matche ni `:focus` ni `:focus-visible`, et ne dispatche aucun `focus`/`blur`/`focusin` — seul `window` reçoit `blur`/`focus`. Indicateur de focus sur iframe = écouter `window.blur`/`window.focus` et comparer `document.activeElement === iframe`.
5. **`waitUntil:'load'` expire sous contention de compilation dev.** Les routes Next dev compilent à la demande ; un scan rapproché peut expirer `goto(load,30s)` sur une route froide → pré-chauffer TOUTES les routes du périmètre (curl) avant l'audit, sinon erreurs de page intermittentes.
6. **Modal portailée contenant un iframe** (motd/bannière d'annonce) : le portail tombe en fin de `body`, son iframe entre dans l'ordre de tabulation ET intercepte les clics — la fermer (Dismiss) avant toute mesure de tab-order ou de clic dans les setups/eval, comme un état préalable déclaré.
7. **Le skip-link exige `tabIndex={-1}` sur la cible `<main>`.** Sans tabindex, `Enter` sur `a[href="#main"]` scrolle sans déplacer le focus (Chrome). Tester la focalisation RÉELLE de la cible (`activeElement === main`), pas seulement le hash.
8. **`install --frozen-lockfile` + build turbo sur checkout propre** : backend NestJS nécessite `pnpm build` complet (start:dev/nest-watch émet une config modules cassée) ; `.env` frontend/backend sont des symlinks vers `../.env` — recréer le lien, pas copier le contenu.

### Leçons harnais — cycle NginxProxyManager (ajoutées au protocole)

1. **Ordre de cascade CSS dynamique : la feuille de thème peut charger APRÈS votre CSS.** NPM importe `tabler.min.css` par `import()` dynamique après `App.css` — un override de variable à spécificité égale PERD. Deux natures de règles : les éléments qui LISENT les vars (`color: var(--tblr-x)`) acceptent l'override ; ceux qui POSENT les vars (`.status-lime{--tblr-status-color:var(--tblr-lime)}`) exigent une spécificité plus forte (`.status.status-lime`). Toujours vérifier l'ordre réel des feuilles dans la cascade avant d'écrire des overrides.
2. **La couleur de premier plan mesurée par axe n'est pas forcément #fff.** Sur tabler le fg réel est `#f9fafb` → un ratio calculé contre #fff (4.70) devient 4.49 en réel. Recalculer chaque teinte cible contre la VRAIE paire fg/bg via un sondage `getComputedStyle` live ; viser ≥4.9 pour la marge.
3. **`--wait-for` doit cibler un élément monté en ASYNC, pas la structure.** `h1` pour les pages à table (h1 monté après fetch), `#main-content` pour login — sinon axe mesure un shell vide et produit des violations fantômes (landmark-one-main, page-has-heading-one) qui masquent le vrai état.
4. **Labels imbriqués = défaut réel `form-field-multiple-labels`.** `<label class=row htmlFor>` englobant `<label class=form-check>` → double annonce. Fix : le label interne devient `<span>` (garde le CSS, une seule étiquette).
5. **Biome `useSemanticElements` refuse `ul[role]` ET `tabIndex` sur `<pre>` même avec `role`.** Structure canonique `div[role=tablist]>div[role=presentation]>a[role=tab]` satisfait axe ET biome ; pour le `pre` focusable (WCAG 2.1.1 exige scroll-region focusable), override biome à périmètre fichier dans biome.json `overrides` — jamais de contournement qui supprime la tabulabilité.
6. **`{...rest}` prop-dropping = cause racine n°1 des boutons sans nom.** Un composant Button custom qui ne spreade pas les props jetait silencieusement `aria-label` — réparer la signature `Props extends ButtonHTMLAttributes` + spread a corrigé ~40 % des button-name en un point.
7. **Le `--wait-for` peut sauver des heures de faux diagnostics : scanner un shell non-monté produit des "violations" qui n'existent pas** — distinguer d'abord les vraies violations de l'artefact de timing en rejouant avec wait ciblé.
8. **Prettier ≠ formateur du projet : jamais de `prettier --write` global sur un repo biome/oxfmt.** Un `npx prettier` a reformaté ~100 fichiers non touchés (churn cosmétique). Règle : formatter uniquement avec le formateur déclaré du repo (`npx biome format --write`), et ne formatter que les fichiers modifiés ; le patch final passe par `git diff` après reformatage canonique.

### Leçons harnais — cycle Tandoor (ajoutées au protocole)

1. **Vuetify calcule les rôles de `v-list-item` DANS le contexte VList** (`list ? isLink?'link' : selectable?'option' : 'listitem' : undefined`). Un item `:to` produit `<a role="link">` enfant de `role=list` (enfant illégal) et `role=listitem` sur `<a>` (rôle interdit) — les deux à la fois. Impossible d'avoir liens+items valides ensemble dans un v-list → **pattern `div class="v-list …"`** : même rendu, zéro injection de rôles, liens conservés dans le landmark nav. Compromis sémantique assumé et documenté (nav = landmark, pas liste).
2. **Les overlays Vuetify téléportent hors de `.v-application`.** Tout sélecteur de contraste/override préfixé `.v-application` rate les contenus de v-menu/v-dialog/bottom-sheet → règles non préfixées obligatoires pour ces cibles.
3. **Vuetify estompe via `opacity` composée, pas `color`.** Corriger un texte « subdued » exige `color:<solide> !important` + `opacity:1 !important` sur l'élément ET ses conteneurs (`.v-messages`, `.v-input__details`, `.v-data-table-header__content`, `.v-list-item--variant-text`) — vérifier la chaîne d'opacité dans les styles calculés, pas seulement la couleur.
4. **Les utility classes Vuetify portent `!important` ET chargent après un `<style>` head.** Seule la spécificité doublée `.x.x` gagne indépendamment de l'ordre.
5. **Les attributs ARIA des composants tiers se normalisent par MutationObserver, pas au cas par cas.** `a11yShim.ts` centralise : strip `aria-expanded`/`aria-controls` sur `.v-field` non-combobox (exigés par contre sur la variante role=combobox), `aria-owns` dangling, `aria-placeholder`/`aria-multiselectable` invalides sur combobox, noms pour `.v-icon[role=button]`/`input[type=file]`/`multiselect-search`/`v-chip[aria-haspopup]`→button, rôles calendrier (`cv-weeks`→listbox, `cv-day`→option, strip `aria-dropeffect` + `aria-label` sur div sans rôle).
6. **`v-tabs` n'accepte pas de menu enfant.** Un `v-menu` imbriqué dans `v-tabs` casse `aria-required-children` sur le tablist → déplacer le menu hors du composant dans un wrapper flex visuellement identique.
7. **Regex de template Vue : `<v-list([^>]*)>` mange `<v-list-item`.** Toujours borner `(?=[\s>])`. Fichier corrompu → vite 500 → erreur de chargement page dans l'audit (signal : `waitForSelector` timeout, pas violation axe).
8. **`--wait-for 'h1' + --wait 1200` obligatoires sur apps à styles tardifs :** axe mesure les couleurs calculées avant que la cascade tardive (thème, utilities) se sédimente — faux positifs fantômes reproductibles (`th` #c0c0c0 jamais visibles). Confirme la leçon NPM #3 à grande échelle.
9. **Overlay d'erreur vite persistant fuit dans le scan.** Après une erreur HMR, `vite-error-overlay` reste monté et compte comme violations `region`/`scrollable-region-focusable` — rescanner sur page fraîche avant de conclure (2 fantômes écartés ce cycle).
10. **`aria-label` sur un div sans rôle = `aria-prohibited-attr`** (cycle courant : `.cv-wrapper` de vue-simple-calendar) — retirer le label ou poser un rôle porteur (group/listbox) si la sémantique le justifie.

### Leçons issues des audits tiers (cycles 2 + 4 — verdicts CONFIRMED)

1. **Commiter le harnais COMPLET par cycle** — `tools/audit.mjs` avec sa carte STATES figée (la prose states.json ne suffit pas au rejeu), verify.mjs, eval-final.mjs, login.mjs, package.json. Rétro-appliqué à tandoor.
2. **`scope-compare.json` se génère DEPUIS LES ARTEFACTS** (baseline-scope.json vs final-scope.json), jamais de mémoire — un récit de baseline reconstruit peut contredire l'artefact commité.
3. **`--wait-for` est asymétrique baseline/final** quand le sélecteur n'existe qu'après patch (ex: `#main-content` créé par le fix). Règle : en baseline, attendre un sélecteur présent d'origine ou `--wait` seul, et le déclarer dans le manifeste.
4. **Toute route déclarée au manifeste mais non scannée est enregistrée avec motif** (non-déterministe, redirection data-dépendante…) — le scope.json/scope-compare doit porter la substitution ET la raison.
5. **Règle 7 rétro-active sur verify/eval** : assertion conditionnée à `if (await el.count())` = pass vacuole → élément attendu absent = FAIL ou N-A déclaré. (Règle déjà appliquée dans les harnais tandoor.)
6. **Boucle Tab de modale assertée** quand le manifeste promet un piège de focus (leçon CyberChef #2, généralisée).
7. **Le compte baseline est indicatif sur données démo aléatoires** — le gate compare les familles de règles + final=0, pas les occurrences au nœud près.
8. **`scope.json` doit stocker waits + versions** (waitFor, wait, axe-core/playwright/node) — sans ça la config d'audit n'est pas auditable a posteriori. (Runner déjà versionné ; ajouter waitFor/wait.)
9. **Fondu de modale échantillonné par axe** : pré-dismisser ou stabiliser les modales auto-ouvertes (MOTD/bannières) comme état préalable déclaré avant mesure.

### Leçons harnais — cycle Memos (ajoutées au protocole)

1. **Vérifier que chaque URL du manifeste est une vraie route avant gel :** `/memo-filters` déclaré n'existait pas (`Routes.VIEWS=/views`) — le scan mesurait le NotFound comme s'il était la page cible. Croiser les URLs déclarées avec la table de routage (ou un probe `curl` + assertion de contenu) AVANT le manifeste.
2. **Variantes alpha utilitaires `text-x/NN` :** le balayage sed vers solide est valide, mais les tests qui figent le littéral de classe échouent — lancer `pnpm test`/suite repo tôt (pas seulement en fin de cycle) pour calibrer la vague.
3. **Auth Connect/gRPC-gateway :** token en localStorage + cookie refresh extrait du header de métadonnées `Grpc-Metadata-Set-Cookie` (PAS `Set-Cookie`) — planté via `ctx.addCookies`.
4. **CodeMirror :** nom accessible via `EditorView.contentAttributes.of({'aria-label'})` dans les extensions — pas d'attribut DOM manuel sur `.cm-content`.
5. **Backdrop click-out `<div aria-label onClick>` :** convertir en vrai `<button>` — corrige aria-prohibited-attr ET rend le clic clavier/TA possible gratuitement.
6. **Correction de hiérarchie de titres en cascade :** ajouter un h1 expose souvent h3→h2→h4→h3 en chaîne + pages d'erreur oubliées (NotFound) — re-scanner après chaque vague, pas une seule fois.

### Recommandations protocole — audit NPM (devin-d7a49e6d, intégrées)

1. **Jamais d'auto-verdict dans results.json** — le verdict appartient à l'auditeur ; le worker n'écrit que des mesures.
2. **`incomplete-probes.json` rejouable obligatoire** pour tout claim « incompletes vérifiés » (sondes de couleurs calculées par nœud échantillonné, pas une affirmation globale).
3. **`manifest.json.auditCommands[]` obligatoire** : invocations exactes (--urls, --states, --wait-for, --wait, --storage-state) pour chaque run — la reconstitution depuis la mémoire est interdite.
4. **Assertion de piège-clavier tolérante au transitoire** : compter les tab-stops RÉSIDUELS hors modale (state post-loop), pas les transitoires intermédiaires — un skip-link focusable brièvement pendant la boucle modale = finding séparé (vrai wart) ≠ FAIL de l'assertion.
5. **Contrôle de cohérence `scope-compare.statesHash == scope.json.statesHash`** régénéré depuis les artefacts livrés (jamais recopié de mémoire).

### Leçons — audit Tandoor (devin-024f50b0, PARTIAL→corrigé)

1. **Le seed DOIT produire du contenu sur les routes data-dépendantes.** `/recipe/2` scannait « 0 violation » parce que la recette n'avait ni étape ni ingrédient — page quasi vide. Règle : pour chaque route `:id`, le seed rend ≥1 item complet de chaque composant listé (étape, ingrédient, ligne de table) et le manifeste l'explicite. Preuve croisée : si la baseline d'une route cœur est anormalement basse, suspecter un seed vide.
2. **Les étapes d'auth appartiennent au manifeste au détail près** : `userspace.groups.add('admin')` omis → tout le scope rendait « No Permissions » à 0 violation — un rejeu littéral produisait un faux-PASS global. Lister TOUTES les commandes de seed, groupe/permission compris.
3. **Assertion tautologique = FAIL de harnais** : `count() >= 0` est toujours vrai (verify.mjs ligne login). Toute assertion doit pouvoir échouer : vérifier l'effet (label[for]/aria-label effectif), jamais une existence ≥0.
4. **La traversée clavier a besoin de sédimentation** : 3×Tab juste après waitForSelector lit `focused=BODY` (flake). Fix : `waitForTimeout(400)` + `blur()` + ≥150ms entre les Tab.
5. **Cookies localhost ≠ 127.0.0.1** : un auth.json posé sur localhost n'authentifie pas les scans sur 127.0.0.1 — login.mjs et audit doivent viser le même host.

### Leçons — audits Paperless + Memos (PARTIAL→corrigés)

1. **Hydration Angular/SSR = fenêtre transitoire.** axe peut sérialiser le DOM mid-hydration (href/svg/attributs dynamiques absents → faux aria-prohibited-attr/link-name/page-has-heading-one). Règle : `--wait` ≥ 3-4s sur apps Angular SSR, et toute violation soupçonnée transitoire se confirme par re-scan avec attente (le vrai DOM est vérifié par sonde, pas supposé).
2. **Wiring tab↔panel doit survivre à la navigation SPA**, pas seulement au reload : le compteur `domId` de ngbNav est global à l'app (jamais remis à zéro en nav client-side). Poser des `domId` explicites sur les items et dériver `panelDomId`/`aria-labelledby` de la même base — jamais d'`indexOf` recomputé côté panel.
3. **`pnpm build` ≠ `ng build --configuration production`.** Le défaut peut sortir vers `dist/` (build dev) pendant que le serveur lit `static/frontend/` : vérifier que le bundle SERVI contient la chaîne du correctif (`grep` dans le fichier statique servi), et que la chaîne de service est complète (build prod → collectstatic → restart).
4. **Seed entièrement spécifié** : contenu EXACT du document créé (ex. `{content:'# Test memo'}`) + uid/paramètres — pas juste « 1 memo ».
5. **Routes canoniques dans le manifeste** : si `/calendar` redirige vers `/calendar/2026/10`, déclarer l'URL canonique (le runner exit-2 sinon) — et toute contradiction scope/horsPerimetre (ex. `/map` listé des deux côtés) = finding.
6. **Correction structurelle > correction au spot flaggé** : un `page-has-heading-one` sur `/` se corrige pour TOUTES les routes couvertes par le même layout/composant (Home rend aussi /explore et /?creator=*), pas au seul URL du rapport.
7. **`accessToken` SPA court** : un rescan > ~20 min après login peut expirer → relancer login.mjs avant de conclure, et traiter un passage soudain « tout redirige /auth » comme expiration, pas régression.

### Leçons — cycle 19 Stirling-PDF (session principale, intégrées)

1. **`pkill -f` s'auto-tue** : le motif match la cmdline du shell parent (bash -c « ... Stirling-PDF ... ») → le kill supprime le shell qui l'exécute. Fix : `pgrep -f '[S]tirling-PDF-0'` (crochet regex : la chaîne du motif ne se match plus elle-même). Même danger pour tout kill par motif de processus.
2. **Fragment Thymeleaf paramétré casse tous les appelants** : `th:fragment="footer(role)"` = signature déclarée → les 25 `th:insert="footer"` sans paramètre échouent (« declares parameters, but fragment selection did not specify any parameters »). Pattern correct : fragment SANS paramètre + `th:with="footerRole='none'"` à l'appelant ciblé + `th:attr="role=${footerRole}"` dans le fragment (var indéfinie → null → attribut omis, SpEL-safe).
3. **Flake color-contrast = scan pendant transition CSS** : axe lit les computed colors mid-fade-in → violations fantômes non reproductibles. Corrigé dans le **runner** (audit.mjs v5 : `settleAnimations()` attend la fin des animations/transitions finies, 4 s best-effort) — kit amélioré, pas le produit.
4. **`element.focus()` et `.click()` synthétiques ne déplacent pas le focus réel** : Chromium ne focus pas un `<a>` sur click() JS, et focus() échoue sur élément caché. Tests clavier : `locator.click()` (vrai événement) puis `el.focus()` explicite.
5. **`offsetParent` null ≠ invisible** : null pour `position:fixed` ET `display:none` — la visibilité réelle = `getComputedStyle(el).display !== 'none'` sur la chaîne d'ancêtres.
6. **Modale auto-ouverte voleuse de focus** : Stirling ouvre `#surveyModal` au chargement → tout test Tab/clavier doit d'abord la dismisser (état préalable déclaré dans eval).
7. **pdf.js l10n supprime les aria-label posés en HTML** : les labels du viewer passent par `viewer.ftl` `.aria-label` (strings l10n), pas les attributs template — vérifier le rendu post-l10n.
8. **Spotless/formatter peut reformater des fichiers non touchés** : `./gradlew build` réécrit 3 fichiers Java hors scope → retirer du patch (`git checkout`) pour garder le diff minimal.
9. **`git status` des dépendances de build** : build jar inclut le code patché mais `build/libs` est gitignoré — le patch ne transporte que les sources ; l'auditeur rebuilder toujours (install-build rejoué).

### Leçons — re-audit gotify v2 (G1-G3)
- **Sondes incompletes au même viewport que le scan** : une sonde qui mesure à 1280px alors que l'audit axe a scanné à 375px ne prouve pas la même chose — les sondes héritent le viewport du rapport audité.
- **Liste `rules` dans results.json** : la mettre à jour à chaque réécriture du rapport — une liste périmée laisse croire que des règles restent ouvertes.
- **Étiquettes des groupes d'incompletes** : garder les identifiants axe exacts (`bgOverlap` vs `elmPartiallyObscured`) par groupe — les mélanges cassent la traçabilité.

### Leçons — audit umami v1 (U1-U5)
- **U1 — `--wait`/`--wait-for` obligatoire sur les pages à données asynchrones** : un « 0 violation » échantillonné sur le shell avant que le `<main>`/`<h1>` monte (fetch client) n'est pas reproductible — le score peut être un coup de chance. Les commandes figées dans manifest/auditCommands DOIVENT attendre un contenu stable (`--wait-for 'h1'` ou équivalent) sur les SPA qui rendent après fetch. Symétrique : un scan trop tôt peut aussi produire des violations fantômes (combobox encore vides).
- **U2 — `urls.txt` livré comme artefact** quand les commandes le référencent (le scopeHash identique ne dispense pas du fichier).
- **U3 — la recette seed doit être complète** : endpoints réels (POST /shares vs /links vs /boards), slugs et UUIDs générés serveur documentés (remaps SQL si nécessaire) — un auditeur ne doit pas redécouvrir l'API.
- **U4 — métadonnées exactes** : `toolVersions` obligatoire, version de package manager réellement résolue (pas déclarée), compteurs d'assertions à jour, `installBuild.verdict` jamais auto-proclamé.

### Leçons — cycle 20 pocket-id (SvelteKit 5 + Go)

- **`role="combobox"` : le texte affiché ne compte PAS comme nom accessible.** Les 4 filtres audit-log affichaient « All Users » — jugé « faux positif async » au premier scan, confirmé texte présent au probe... mais axe flag quand même : un combobox exige `aria-label`/`aria-labelledby` (le contenu = la valeur courante, pas un nom). **Toujours vérifier si le rôle impose un canal de nommage avant de déclarer un faux positif.**
- **`<footer>` dans un `<section>` anonyme perd son rôle contentinfo** → axe flag `region` sur le footer lui-même. Un `<section>` sans nom accessible n'est pas un landmark mais casse la promotion du footer. Fix : `<section>` décoratif → `<div>`.
- **Pattern portail→couche landmark généralisé** : docmost (Mantine popupContainer) → pocket-id : 6 wrappers `*-portal.svelte` bits-ui → `to="#a11y-popup-layer"` une ligne chacun, layer unique `role="complementary"` + `aria-label` dans le layout racine. Réutilisable sur tout kit bits-ui.
- **`aria-controls` axe "unable to determine" sur contenu portalisé** : incomplet récurrent même quand l'id cible existe (vérifié live via `getElementById`). Triage N/A légitime après probe DOM — à documenter, pas à « corriger ».
- **IDS en dur dupliqués entre formulaires** (`id="skip-cert-verify"` sur 2 forms différentes) → duplicate-id-aria quand les deux surfaces cohabitent dans le périmètre. Namespacer par domaine (`ldap-`, `smtp-`).
- **WebTransport :1414 partagé** entre instances pocket-id — impossible d'en faire tourner deux en parallèle (sequentialiser les boots de validation).

### Leçons — cycle 18 owncast v2 (sondes d'incomplets)

- **Le fond « premier non-transparent » ment sur les overlays translucides** : `rgba(0,0,0,0.07)` sur un gutter CodeMirror donnait 2.48:1 en marchant naïvement les ancêtres — le composite réel (alpha blending sur toute la pile jusqu'au canvas) donne 6.66:1. **Une sonde de contraste doit empiler TOUS les fonds (y compris alpha<1) et les blender** ; sinon elle produit des faux défauts qu'on risque de « corriger » à tort.
- **antd `aria-controls` lazy-mount : preuve par ouverture, pas par hover** : les popups inline des sous-menus ne se montent qu'après ouverture ET `locator.click()` Playwright ne déclenche pas le handler React — il faut `el.dispatchEvent(new MouseEvent('click',{bubbles:true}))`. Sonde livrée : `avant:false → après:true` pour chaque sous-menu prouve la décision N/A.
- **Header-only table antd** : `.ant-table-header > table` ne contient jamais de td par construction (split header/body) → th-has-data-cells = N/A structurel, pas « transitoire » — la justification doit nommer le pattern, pas deviner l'état.
- **Patch vs bundle embarqué** : `static/web` (go:embed) est git-tracké chez owncast mais exclu du patch (sources seules) — l'install-build doit rejouer `npm run build` → `web/out` → rsync → `go build`, sinon l'auditeur ne voit pas le fix dans le binaire.

### Leçons — cycle 20 pocket-id (audit → warts documentaires)
- **Assertions « à vide »** : un test qui compte `>= N` éléments labellisés n'importe où sur une page passe sur n'importe quel contenu (ici les boutons de pagination faisaient passer le check des collapse). Cibler l'élément précis corrigé — filtrage icon-only + bonne page — et le rejouer **avant** de livrer (un auditeur relit le code des tests, pas juste le PASS/FAIL).
- **auditCommands → manifest.json** (convention), pas results.json.
- **provenance.json = TOUS les fichiers livrés**, intrants de rejeu compris (states.json, package.json, auth.json, report.md, scope.json).
- **manifest.notes doit correspondre au scope exécuté** : « exclu » vs « scénario à erreur attendue » ≠ pareil.
- **Jamais d'auto-verdict dans results.json** (NPM#1) — même avec « proposé » : laisser l'auditeur conclure.
- **Nettoyer tools/package.json** : aucune dépendance inutilisée.


### Leçons — cycle 18 owncast v2 (re-audit → N1-N6)
- **Un élément non testé émet N-A, jamais PASS** : `if (el) ok(...)` est un skip silencieux permanent si l'élément n'existe jamais — le `#user-menu` du verify owncast n'existait sur AUCUNE page, le check n'a donc jamais rien prouvé. Helper `na()` obligatoire ; résumé `X échec(s), Y N-A`.
- **Tester l'overlay qui existe**, pas un sélecteur imaginé : vérifier dans le DOM live quel overlay est réellement présent (ici `.ant-modal-root` dans `#a11y-popup-layer`) et en faire l'assertion dure.
- **Sélecteurs = réalité DOM vérifiée** : avant d'écrire `await page.$(sel)`, prouver que `sel` existe dans la page/état testé — sinon le garde-fou `if` le rend caduc.

### Leçons — adminer (cycle 21, PHP server-rendered, zéro build)

- **Boot = docker php:8.3-cli + `php -S`, pas de runtime sur la box** : `docker run -d -p PORT:8080 -v $PWD/adminer:/var/www/html/adminer -v ~/work/adminer-data:/data php:8.3-cli php -S 0.0.0.0:8080 -t /var/www/html`. Adminer sert ses **sources dev** directement (`adminer/index.php` → includes) — `compile.php` ne sert qu'à la dist. Patcher `adminer/*` suffit ; `php -l` sur chaque fichier modifié remplace le build-check.
- **Login sqlite = fichier `adminer-plugins.php` gitignoré** : `return array(new Adminer\Password('hash'));` — requis pour que le formulaire accepte des credentials (username libre + pass du hash). Documenté dans manifest ; NE PAS le mettre dans patch.diff (c'est de la config de banc, pas du produit). Session Playwright : storageState via login.mjs (POST auth avec server=chemin sqlite).
- **Sous-module git ≠ patchable** : `adminer/static/jush` est un submodule (vrana/jush) — `git diff` du parent ne le transporte pas. Couleurs jush corrigées via **custom properties sur `body .jush`** (spécificité supérieure à `.jush` de jush.css) scopées `@media (prefers-color-scheme: light)` pour ne pas casser jush-dark.css.
- **`aria-label` sur `<pre contenteditable>` = aria-prohibited-attr** : contenteditable ne donne PAS de rôle ; `<pre>` a un rôle generic → nom interdit. Il faut `role="textbox"` + `aria-multiline` AVANT de poser le label — et dès lors axe exige un nom sur TOUS les éditeurs (aria-input-field-name) : prévoir un label pour chaque `textarea()` du produit.
- **Idiom upstream `aria-labelledby='label-X'`** : adminer a déjà `html_select(...,$labelled_by)` et `checkbox(...,$labelled_by)` + l'auto-label « première option `(` ». Réutiliser les mêmes paramètres partout (th ids `label-*`) = patch minimal, cohérent, upstreamable.
- **jush.textarea() remplace le textarea** : saisie Playwright = `click` + `keyboard.type` sur `pre.jush` (le textarea est display:none → `locator.fill` échoue). Et **`select.jush-autocomplete` est un singleton module** déplacé par `el.before()` — labellisé une fois post-init via qsa (pas de MutationObserver).
- **« effet pas action » : `p.message` n'existe PAS après un SELECT** : Adminer n'émet une bannière que pour les requêtes non-SELECT. Un état qui l'attend timeoute en silence — attendre la table résultat (`table.odds` rows>1).
- **Warning PHP rendu = violation `region` massive** : sur `user=` sous sqlite, `SHOW PRIVILEGES` échoue → `foreach(null)` → warning inline + cascade "headers already sent" (38 occ `<b>Warning</b>`). Compter le diagnostic dans le baseline (upstream réel), corriger la source (cast `(array)`), PAS filtrer la sortie.
- **`body { min-width: fit-content }` casse tout reflow** : upstream élargit la page au contenu (design « tables larges défilent ») → scroll horizontal même sur du texte. Fix : `min-width: 0` sous 800px + `overflow-x: auto` sur `.scrollable` (classe-marqueur qui n'avait AUCUNE règle) — la table défile dans son conteneur, exempt reflow WCAG.
- **eval-final indépendant > axe** : il a attrapé 4 défauts qu'axe n'avait pas levés (boutons icon sans name exploitable, reflow réel, selects cachés sans label, textarea jush anonyme). Un `title` reste un accname valide — l'implémenter dans la sonde accName avant de déclarer « sans nom ».

### Leçons — cycle 22 privatebin (re-audit → CONFIRMED + W1-W6)
- **Renommer une balise hN = ouvrir ET fermer** : `<h6>`→`<h2>` en laissant `</h6>` produit un markup invalide que ni axe ni l'œil ne voient (HTML5 ferme le h2 à tout end-tag hN) — l'auditeur DOM l'a attrapé. Toute conversion de tag doit greffer `</` dans le même hunk.
- **Décrire le mécanisme réel, pas celui imaginé** : « titres h2 sur les 4 modales » exagérait — passwordmodal pointe son label existant. Les causes_racines doivent dire ce qui a été fait exactement.
- **ABSENT ≠ PASS dans le décompte** : une sonde non jouée (élément conditionnel absent) se compte séparément : « 21 PASS + 1 ABSENT », jamais « 22/22 ».
- **État qui mute le viewport/localStorage en dernier** : navbar-mobile 390px persistait et masquait #bd-theme sur les états suivants — ordonner les états mutants en fin de liste ou reset explicite.

### Leçons — cycle 24 gatus (re-audit → CONFIRMED + W1-W5)
- **Baseline sur données croissantes = compte indicatif** : Execution History +1 ligne/min → occurrences contrastes flottantes entre worker et auditeur (162 vs 145, delta circonscrit à la page concernée). Pour une baseline strictement reproductible : figer le seed ou exclure les listes auto-incrémentées du compte.
- **Sonde de recouvrement multi-points** : `elementsFromPoint` au centre du nœud remonte le parent quand l'overlay ne couvre qu'un coin — échantillonner une grille (3×3) et vérifier le recouvrement de boîtes réel avant de nommer un `coveredBy`.
- **Incomplets transitoires = famille, pas compte** : « N seconds ago » recouvert ou non selon la largeur du texte → documenter la famille + sonder chaque occurrence trouvée, compter est secondaire.

### Leçons — cycle 26 lldap (re-audit → CONFIRMED + W1-W4, stack WASM)
- **« N règles » = compter le report.md, pas la mémoire** : la 9e famille corrigée était un *incomplete* (duplicate-id-aria), pas une règle violée — 8 règles réelles. Les comptes du results.json se recalculent depuis les rapports livrés, jamais de mémoire.
- **Ratios documentés = recomputés, pas copiés** : 12.63/8.07 écrits vs 15.43/7.42 mesurés sur les mêmes paires — toujours recomputer la formule WCAG sur les paires finales documentées.
- **label[for] sur groupes multi-inputs** : inputs `id={name}-{i}` → `for={name}` pend ; prop `for_id` pointant le premier input (`{name}-0`).
- **WASM ne change rien** : DOM monté par Yew scannable pareil — attendre un sélecteur post-mount (h1/main table), rebuild wasm-pack réel rejouable (~44 s), déploiement par `docker cp pkg/` quand l'image sert depuis le disque.

### Leçons — cycle 23 bookstack (re-audit → CONFIRMED + W1-W5, Laravel/MySQL)
- **URL servie en XHR ≠ page** : /templates rend un fragment Blade nu (0 octet GET direct, consommé par template-manager.js) — retrait de scope légitime SI prouvé par GET direct + markup couvert via l'include sur /edit. Le manifeste figé garde la trace du retrait motivé.
- **`|| true` dans un ok() = mesure, pas assertion** : regex+`|true` affiche la valeur sans jamais échouer — assertion = ratio calculé vs seuil.
- **storageState/scripts d'auth = chemins relatifs au script** : écrire à côté du fichier (import.meta.url), pas au CWD — sinon l'auditCommands verbatim écrit/lit des chemins différents. Le storageState commité est lié à l'APP_KEY/serveur de l'instance — à régénérer par instance.
- **Backdrop seul ne suffit pas** : axe `partiallyObscured` n'occulte que les cibles tabbables → `inert` sur le contenu derrière (main, footer) + retrait à la fermeture — vérifié live par l'auditeur.
- **Les résidus hors-scope existent** : menus transitoires non audités gardent des #999 — élargir la relecture du patch aux sélecteurs muted génériques même hors pages scannées.

### Leçons — cycle 27 searxng (audit PARTIAL → corrigé)

1. **Surfaces d'erreur stochastiques** : `dialog-error-block` ne se rend que si TOUS les moteurs échouent — jamais vu dans les scans du worker. Couvrir les états d'erreur globale (no-results, engines-down, 500, rate-limit) comme entrées dédiées de states.json, pas seulement les pages nominales. L'auditeur les a provoqués via son install-build.
2. **Variables dérivées** : `--color-error-background: lighten(--color-error,40%)` — assombrir seule la couleur d'erreur ne suffit pas (le fond suit) ; recalculer le ratio sur la paire dérivée finale (#b91c1c/#f8d2d2 = 4.66).
3. **CSS compilés dans patch.diff** : quand le bundle minifié est versionné dans le patch, appliquer la substitution équivalente à TOUTES les +lignes css (il y en avait 3 : ltr/rtl/rss) — et le dire dans results.json (le build reste source de vérité).
4. **link-in-text-block** : couleur seule ne suffit pas dans un bloc non-coloré — `text-decoration: underline` sur les liens du bloc.

### Leçons — cycle 27 searxng (ré-audit v2 PARTIAL : falsification de ma part)

1. **Recette splice VICIÉE** : régénérer les diffs après `git checkout .` a effacé les edits source — le patch ne transportait le fix que dans les css compilés. Règle : les diffs se régénèrent depuis un arbre PATCHÉ+VÉRIFIÉ (`git apply` puis `git diff`), et l'étape se termine par un grep de la chaîne fixe dans le patch livré (`grep '#b91c1c' patch.diff`) — jamais sans cette vérification finale.
2. **Css compilés dans patch = source de falsification** : éditer le minifié à la main crée un patch dont le build ne reproduit pas le contenu. Règle : remplacer les +lignes css par la sortie réelle du build (`npm run build`), pas par substitution de chaînes.
3. **Provenance = re-hash à chaque correction** : 4 hash périmés après S1-S3 — re-hacher TOUS les fichiers touchés (patch.diff, tools/*, results.json) après chaque wart-fix.
4. **Sonde alpha** : la première couche `rgba<1` n'est pas le fond effectif — composite top→down obligatoire (même leçon que contrast probing cycle owncast, oubliée dans une nouvelle sonde).

### Leçons — cycle 25 sabnzbd (audit PARTIAL : régression introduite par le patch)

5. **Sed en masse sur des sélecteurs d'attribut = danger** : remplacer `name="x"` a injecté `aria-label` dans des chaînes de sélecteurs jQuery (`select[name="x" aria-label="y"]` = SyntaxError qui tue tout le bloc ready). Règle : après tout correctif par substitution, greper l'arbre APPLIQUÉ pour le pattern cassé (`\[name="[^"]*" [a-z-]+=`) et tester que le JS parse.
6. **Couleurs : mesurer dans CHAQUE color-scheme atteignable** : une teinte OK en clair peut échouer en nuit (`light-dark()` d'upstream doit rester des deux côtés ≥4.5 — .success/.failed wizard mesurés FAIL nuit par l'auditeur). Règle : toute couleur modifiée doit être calculée contre toutes les surfaces de tous les thèmes servis, y compris les textes rendus dynamiquement (post-test, états d'erreur).
7. **Sondes d'incomplets = exhaustives ou déclarées échantillon** : 139/218 couverts sans le dire → l'auditeur a mesuré les 75 restants. Déclarer explicitement couverture vs échantillon.
8. **eval-final qui fait POST /logout détruit auth.json** — documenter l'ordre de rejeu (sondes avant eval) ou re-login.

### Leçons — cycle 29 uptime-kuma (audit PARTIAL → corrigé F1/F2)

9. **Un aria-label peut être littéralement vide de sens** : l'amont rend `"open modal to "` — le placeholder i18n `{0}` n'est jamais substitué (arg string au lieu d'array). Ne pas cibler les setups par `aria-label*="…"` : cibler la structure (`#id ~ button`), et noter le défaut amont dans results.json (ici hors périmètre minimal).
10. **Remplir un formulaire exige de lire la validation amont** : `postIncident()` refuse titre ou contenu vide par toastError SILENCIEUX — le post n'a jamais eu lieu, l'attente suivante a expiré. Lire la validation serveur avant de scripter : chaque champ requis du form doit être rempli dans le setup.
11. **Thèmes de code éditorial = surface de contraste** : vue-prism-editor + prism-tomorrow perdent le fond #2d2d2d prévu par le thème (les tokens `#cc99cd`… mesurent alors 2.33 sur blanc). Règle : toute zone `prism-editor`/code — vérifier que le fond du thème est effectivement rendu, sinon le restaurer sur le container.
12. **Une nouvelle surface scannée peut trouver de nouvelles violations — c'est normal** : ajouter des états post-audit peut révéler des défauts réels (ici le F2b prism). Les ajouts de scope post-audit se DOCUMENTENT dans scope-compare.json (les états ajoutés ≠ les états remplacés).
13. **Les états mutants créent des données** : un state qui poste une entité (incident) laisse des résidus en base → non-idempotent ET casse les sélecteurs futurs (`[data-testid]` en double). Scoper les sélecteurs au conteneur du formulaire (`incident-edit`), documenter la non-idempotence, et purger les résidus de debug avant la livraison.

### Leçons — cycle 28 syncthing (ré-audit v2 PARTIAL : mes fixes outillage livrés non exécutés)

14. **JAMAIS livrer un fix harnais/outillage non exécuté** — la règle splice s'applique aussi aux scripts : verify.mjs et incomplete-probes.mjs « corrigés » mais jamais lancés étaient cassés déterministiquement (3 vrais bugs verify + 2 vrais bugs sonde trouvés à la première exécution réelle). Un outil de preuve doit tourner sur une instance réelle avant d'être commité.
15. **Les URLs enregistrées dans les rapports pointent l'environnement du worker** : rejouer `page.goto(url stockée)` cible un port mort → avalé par `.catch` → setups en échec en chaîne. Toute relecture d'artefact doit réécrire l'origine sur le BASE passé, et un goto en échec = N-A explicite, jamais de catch muet.
16. **Modales à backdrop statique au premier boot** : `#ur` (usage-report) apparaît ~3 s après le load via poll système et intercepte tous les clics — un check « si visible » au chargement la rate. Attendre son apparition (≤15 s) puis la décliner, ou armer `urAccepted=-1` dans le seed quand l'état dédié n'est pas audité.
17. **Mesurer les liens dans leur état visible** : les 299 liens `.modal-body a` de #advanced sont à 0 visibles tant qu'aucun panneau accordéon n'est ouvert — un check « tous les liens soulignés » mesurait 0/0 (FAIL honnête). Ouvrir un panneau puis mesurer les liens réellement visibles.
18. **`.first()` sur des accordéons pré-ouverts** : `#device-this` est déjà ouvert au boot — cliquer son heading le FERME puis l'attente suivante timeout. Exclure l'état pré-ouvert (`:not([data-target="#device-this"])`) ou choisir une cible connue fermée.
19. **Exporter STATES pour le rejeu** : `export { STATES }` + garde CLI `fileURLToPath(import.meta.url)` dans audit.mjs — la sonde importe la source unique (les setups gardent leurs helpers module) ; l'eval-extraction textuelle échoue hors scope (185/188 ReferenceError mesurés).

20. **Matrice composant×thème : un état par famille dans CHAQUE thème.** Le thème sombre n'était audité que sur le dashboard : les ~20 modales en clair seulement → 39 occ contrastes résiduelles trouvées par l'auditeur. Désormais : pour chaque famille de composants (tabs, arbre, accordéon, dropdown, form), au moins un état `*-dark` dans states.json. Couverture exhaustive modale×thème non requise — un représentant par famille suffit tant que le patch corrige la règle css à la source.
21. **Préférences serveur persistantes : toujours restaurer.** Rejouer un état qui bascule une config serveur (thème, langue) laisse l'instance mutée pour le run suivant. La sonde restore explicitement en fin de run (et verify restaure après ses mesures). Et attention : sur syncthing le GET /rest/config exige le header CSRF comme le PUT — un fetch sans header → "CSRF Error" silencieux dans un .json().


### Leçons — cycle 30 nocodb (audit CONFIRMED → fixes v2 exécutés)

22. **Constantes d'IDs en dur = défaut de portabilité, dans TOUS les outils** : paramétrer audit.mjs ne suffit pas — verify/eval/sondes crashaient verbatim sur un clone frais (NC_WS/NC_* → env avec défauts, convention partagée + nc-env-install.sh écrit par gen-urls). Corollaire : tout eval qui navigue doit garder une assertion d'URL finale AVANT les assertions de contenu (pathname attendu sinon FAIL 'page redirigé') — un PASS mesuré sur un document redirigé est un faux PASS. Et les payloads API « documentés » peuvent être des no-ops silencieux (200 + rien persisté : {"attrs":{...}} et PATCH /forms/:id meta) — vérifier l'effet lu par re-GET, pas le code retour.


### Leçons — cycle 32 gitea (audit PARTIAL → fixer v2, régression clavier)

23. **Afficher le contrat ARIA APG EXIGE de le livrer.** Poser `role=button`/`aria-haspopup`/`aria-expanded` sur un déclencheur annonce Enter/Espace/flèches — si le tabindex est retiré de la racine et donné à un enfant sans activation native, aucun scanner ne le voit : axe mesure 0 violation pendant que le widget est mort au clavier (WCAG 2.1.1). Règle : TOUT changement de tabindex/rôle sur un widget interactif doit être éprouvé au vrai clavier (Enter, Espace, ArrowDown/Up, Escape, focus restauré) dans verify.mjs — une assertion DOM par intention, pas par état. Et l'activation d'item (`.item.selected`) ne doit exister que derrière la garde « menu ouvert » : Enter menu fermé = intention « ouvrir », jamais « activer » (sinon Enter clique « Clear labels » — destructif).
24. **État synchrone du framework ≠ état vu par ton handler.** Fomantic masque le menu synchronement dans SON keydown enregistré plus tôt sur le même élément : `isMenuVisible()` est déjà faux quand le listener ajouté tourne → le code de restauration de focus est mort sans erreur. Règle : tester l'ORIGINE de l'événement (target dans le widget), pas l'état résultant, puis poll borné pour la restauration (le blur tardif du framework arrive après la fermeture).


### Leçons — cycle 31 phpmyadmin (fixer v2 : résiduels + warts corrigés)

25. **Un « thème dark » peut ne pas exister — substituer la surface sombre réelle.** pmahomme déclare colorModes=["light"] et setColorMode ignore les modes invalides : un état « pmahomme-dark » via /themes/set aurait scanné le mode clair sous un nom mensonger. La vraie surface sombre était composant-level (Console/DarkTheme via /console/update-config + Mode=show pour un rendu déterministe sans click). Règle : avant de nommer un état « X-dark », vérifier theme.json colorModes ; si le mode n'existe pas, scanner la surface sombre réelle et documenter la substitution. Les prefs serveur mutées dépassent le thème : DarkTheme ET Mode persistent — le reset de fin de run (dernier mutant + reset-theme.mjs) doit restaurer TOUTES les prefs mutées, pas seulement set_theme.

### Leçons — cycle 28 syncthing (v5 : fixes post-PARTIAL v4)

26. **« 0 violation axe » ≠ conforme WCAG — axe a des angles morts mesurables.** axe a placé le titre `.alert-info` dans `passes` alors que la paire réelle était #222 sur #9b59b6 = 3,41:1 : son heuristique de fond ne remonte pas la couleur de l'entête modale au-delà du conteneur. Règle : les familles de composants à fond coloré (alertes, entêtes de modales, badges, chips) exigent une **sonde computed** (couleur effective + fond opaque le plus proche, ratio ≥4,5), pas seulement un scan axe — ajouter le check dans verify.mjs avec un commentaire indiquant qu'axe peut passer le nœud à tort. Idem pour les couleurs héritées de frameworks vendors (`h1 small`/`h2 small` #777 du bootstrap vendu, `.text-muted`) : mesurer, ne pas supposer.
27. **provenance.json : re-hacher après CHAQUE écriture d'artefact, jamais « reformaté ».** Livrer une provenance avec 11/37 sha256 obsolètes (fichiers retouchés en v4 jamais re-hashés) est un défaut d'intégrité — l'auditeur vérifie hash-par-hash. Règle : le re-hachage est la DERNIÈRE étape avant commit ; il recalcule le sha256 depuis le disque pour CHAQUE fichier listé (pas seulement les nouveaux), puis un contrôle spot vérifie 3 fichiers au hasard (sha256sum réel == valeur enregistrée). Un fichier modifié après le re-hachage invalide la preuve.
28. **Restauration de préférence serveur : l'attente doit être symétrique.** Le verify armait dark avec FAIL sur timeout mais rendait light sans échec franc — un run « vert » pouvait laisser l'instance sombre. Toute mutation d'état serveur dans une sonde se vérifie à l'aller ET au retour avec échec franc des deux côtés.


### Leçons — cycle 30 nocodb v3 (CONFIRMED + réserve 2.5.3)

29. **Un aria-label peut INTRODUIRE une violation 2.5.3** : poser `aria-label="Account"` sur un déclencheur dont le texte visible est « AW » crée un `label-content-name-mismatch` (wcag21a, axe ≥4.14) — le nom accessible doit contenir le texte visible. Règle : nommer un widget par computed contenant le visible (`${visibles} — ${label}`), et le visible change selon le mode (initiales en mini-sidebar vs nom/email en complète) — paramétrer par le même inject/mode que le rendu, jamais un libellé fixe.
30. **axe-core non épinglé = résultats non reproductibles, mais ne pas contourner `minimumReleaseAge`** : les tools de cycle doivent épingler la version exacte (`4.13.0`, pas `^4.10.2`). Une règle expérimentale peut passer standard entre deux mineures (4.13→4.14 a activé `label-content-name-mismatch`) : quand une version plus récente existe, l'auditeur peut sonder avec elle MAIS le bump du kit attend que minimumReleaseAge (7 j) l'autorise — on documente la version sondée, on ne court-circuite pas la politique supply-chain.


### Leçons — cycle 33 changedetection v4 (PARTIAL v3 : mesure pixel-vraie)

31. **Computed-style ≠ pixel-vrai : les overlays fixes et pseudo-éléments transparaissent.** Une sonde qui plie les ancêtres DOM rate `body::after` (dégradé fixe) derrière un panneau `rgba(0,0,0,.05)` translucide → composite réel 2,82–4,43:1 alors que le modèle annonçait 4,60. Règle : pour toute paire texte/fond touchée, la mesure de référence est le **pixel screenshot** (ou le composite de la pile complète incluant pseudo-éléments positionnés fixed/absolute au-dessus). Et quand le fond est translucide, aucun choix de couleur de texte ne suffit — il faut un **fond opaque** sur la cellule/row/panneau. Corollaire : une sonde livrée fausse dans son modèle doit être corrigée avec le fix, pas laissée « verte à tort ».


### Leçons — cycle 35 karakeep (audit v1 : menu fantôme scanné)

32. **Un sélecteur d'ouverture d'état racé peut scanner un AUTRE widget sous le bon nom — en baseline ET final.** `header button`.first() prenait l'avatar ~50% du temps : le « menu view-options » livré était le menu profil, et les vraies violations du menu view-options (enfants illégaux de role=menu) sont restées invisibles des deux côtés. Règle : chaque open-action de states.json doit être **déterministe** (cibler par aria-label/texte visible unique) ET **prouvée** (après ouverture, assertion DOM sur un descendant ou texte exclusif au widget visé — sinon FAIL bruyant). Même exigence pour `nth(n)` : interdit sans assertion de contenu. Corollaire : un menu qui contient des contrôles (slider/switchs) n'est pas un `role=menu` — sortir les contrôles du menu ou changer leur rôle, pas wrapper le menu.


### Leçons — cycle 34 stump v3 (CONFIRMED + résiduels)

33. **`asChild` sur un composant custom qui ne spreade pas = props avalées silencieusement.** `*.Trigger asChild` injecte aria-haspopup/expanded/controls sur l'enfant référencé — un `<ToolTip>` maison qui déstructure ses props sans les spreader avale tout : axe 0 violation, le widget fonctionne, mais les attributs n'existent pas dans le DOM. Règle : la chasse Radix ne s'arrête pas à `trigger={<div>}` — TOUT trigger asChild vers un composant custom exige de vérifier que le composant fait `{...props}` jusqu'au DOM natif (grep des déstructures, sonde attribut-live sur le trigger rendu).
34. **Scanner avant hydratation = fausses violations splash-screen.** Sur SPA/SSR-hydratée, audit.mjs peut capturer le DOM de splash (non hydraté) → violations fantômes ou, pire, un scan sur un arbre transitoire accepté comme final. Règle kit : le runner doit attendre un marqueur d'hydratation (sélecteur stable post-boot, `waitUntil` + garde de contenu, ou double-scan à stabilité DOM) — un « 0 viol » sur splash est aussi faux qu'une violation fantôme.


### Leçons — cycle 33 changedetection v5 (CONFIRMED + wart sonde)

35. **Une sonde de contraste qui ignore l'alpha du FOREGROUND surestime le ratio.** `effFg` rapportait 11,37:1 pour un texte `rgba(fg,.6)` dont le ratio réel est ~5,3:1 — conforme mais faux : si le composite fg×bg avait été <4,5, la sonde aurait rendu un PASS mensonger. Règle : effective-fg doit être composité sur l'effective-bg (alpha du texte inclus) AVANT le ratio — symétrique au composite du fond (leçon 31). Un PASS surestimé est aussi grave qu'un FAIL manqué : il masque le site exact où la violation vivrait.
36. **Un gate de sonde qui sort au 1er statut terminal peut rater le résultat lent.** La sonde F2 sortait exit 0 au premier ✓/✗ vu — le X du proxy-mort arrivait à 31 s, jamais mesuré. Règle : attendre TOUS les glyphes/statuts terminaux attendus (timeout dur + FAIL si jamais apparus), pas « au moins un ».

### Leçons — cycle 37 linkding (audit : seed non livré)

37. **Un seed décrit en prose n'est pas rejouable — le seed est un artefact.** Le manifeste linkding décrivait le contenu à seed mais ne livrait ni dump ni script → l'auditeur a dû reconstruire un seed « équivalent », et le delta de comptes incomplets (68→70) vient exactement de cette reconstruction. Règle : tout cycle livre `tools/seed.*` (sql dump, script http, fixtures json…) exécutable verbatim, et le manifeste pointe dessus — « boot rejouable » inclut les données.

### Leçons — cycle 41 jellyfin-web (CONFIRMED + warts env)

38. **La règle d'environnement qui n'est écrite que dans le manifeste n'existe pas — elle doit être dans l'outillage partagé.** Jellyfin crashait avec `RangeError` Intl (navigator.language `en-US@posix` = BCP47 invalide sur cette box) ; le manifeste exigeait `locale:'en-US'` sur tous les contextes Playwright — pourtant `measure-contrast.mjs` livré sans → crash chez l'auditeur. Règle : TOUT contexte Playwright du cycle (audit, sondes, login, probes ad-hoc) passe `locale:'en-US'` — `browser.newPage()` direct est interdit (toujours `newContext({locale:'en-US'})`). Corollaire : les sélecteurs par libellé traduit (`aria-label="User Menu"`) sont fragiles hors locale — préférer des hooks structurels ou poser la locale AVANT de sélectionner.
39. **Le compte de fichiers du manifeste se régénère depuis le diff final, pas depuis la mémoire du worker.** Claim « 59 fichiers » vs 60 réels, « 2292 fichiers dist » vs 2348 : les deux déclarations étaient périmées après régénération du patch. Règle : après chaque régénération de patch.diff, remettre à jour les comptes déclarés (`git apply --stat`, `diff -r | wc`) dans la même passe — et relancer provenance --strict (leçon 26) qui l'aurait attrapé.

### Leçons — cycle 43 ghost (CONFIRMED + baseline contaminée)

40. **Une « vanilla » reconstruite peut porter des artefacts patchés — vérifier un marqueur de pureté AVANT le scan baseline.** La baseline admin ghost livrait 297 occ ; l'auditeur en mesure ~426 : la dist « vanilla » du worker portait déjà le token gray-800 patché (nx cache / rebuild depuis arbre sale). Règle : avant tout scan baseline, prouver qu'un marqueur qui n'existe QUE dans le patch est absent du build vanilla (grep d'une chaîne fixe introduite) — sinon la baseline est sous-estimée et le delta final↔vanilla gonflé. Corollaire : un patch multi-racines (sous-modules/monorepo) n'est PAS rejouable par un seul `git apply` — le manifeste doit documenter l'ordre d'application par racine (ghost : 35f racine + 6f thème sous-module, 2 passes).
41. **Tout artefact compilé en mémoire exige le restart du serveur, pas juste le rebuild.** Ghost : `docker restart` obligatoire après rebuild admin (inode montée obsolète) ET après changement de .hbs (templates compilés en mémoire — non documenté par le worker). Règle : chaque changement de livrable servi par un process long = restart explicite dans le manifeste (build ≠ redéploiement).

### Leçons — cycle 42 jenkins v2 (CONFIRMED + assertion à trou)

42. **Une assertion « le nom accessible existe » qui accepte un fallback visible ne détecte pas la régression du mécanisme visé.** L'eval durci vérifiait qu'un dialog a un nom — et acceptait le titre visible `.jenkins-dialog__title` : reverter l'`aria-labelledby` ajouté par le patch n'était détecté ni par l'assertion ni par axe (le titre reste un nom valide pour axe aussi). Règle : quand le fix ajoute une LIAISON (aria-labelledby/label for), l'assertion doit éprouver la liaison elle-même (`getAttribute('aria-labelledby')` pointe un élément existant et non vide) — jamais seulement « un nom quelconque est calculé ». Le fix produit peut être parfaitement livré alors que l'assertion est à trou : les deux se valident séparément.

### Leçons — cycle 45 kavita (CONFIRMED + slug i18n invisible)

43. **Un aria-label qui rend un slug i18n brut est une violation invisible pour axe ET pour `label.length>0`.** Le patch kavita référençait 4 clés absentes d'en.json → ~9 aria-labels/page affichaient le slug brut `actionable.actions-for` ; axe passe (nom non vide), verify passait (length>0), le claim « clés ajoutées » était faux. Règle : toute clé i18n introduite par le patch doit être PROUVÉE résolue (texte réel dans le JSON de locale) — sonde obligatoire : la valeur rendue de chaque attribut introduit ne ressemble pas à un slug (`/[a-z0-9]+(\.[a-z0-9-]+){1,}/` ou clé telle quelle) ; assertion = valeur résolue attendue, pas « non vide ». Corollaire : le verify doit interroger `labelBy()`/le pipeline de résolution réel du framework, pas un getter non bindé.
44. **Les ids d'instance (library/4, series/6) en dur dans urls/STATES/verify/eval = non rejouables verbatim** (leçon 22 généralisée) : tout id dépendant du seed doit être résolu dynamiquement (query API → premier id disponible) ou documenté comme infixe du seed rejoué.

### Leçons — cycle 46 metabase (CONFIRMED + baseline sous-comptée)

45. **Une baseline qui saute des urls/états en erreur sous-compte en silence — le skip doit être un FAIL bruyant listé.** La baseline metabase livrée annonçait 400 occ ; l'auditeur à scope égal en mesure 502 : 3 urls + 4 états avaient échoué (redirect/timeout) et disparu des comptes. Règle : le runner DOIT rapporter explicitement chaque scénario sauté/échoué (liste + cause) dans results.json — un scénario absent des deux côtés du delta baseline↔final est un trou de preuve ; le compte honnête = « N scannés OK + M échoués (raisons) », jamais « N » seul.

### Leçons — cycle 47 espocrm v2 (CONFIRMED + artefacts commités incohérents)

46. **Les artefacts commités doivent être cohérents entre eux — urls dérivées du seed doivent matcher le seed-info commité, pas un seed plus vieux.** EspoCRM commitait `urls-auth.txt` généré depuis un seed-info antérieur : ids `6ac72d*` vs `6ac74f*` commités → rejeu verbatim = coquilles 404. Et `verify.mjs` mourait en TimeoutError anonyme quand seed-info ≠ DB. Règle : avant le commit final, régénérer les artefacts dérivés (gen-urls depuis le seed-info commité) ET tout waitForSelector dépendant du seed émet un FAIL nommé (try/catch → `ok(..., false, 'seed-info ≠ DB ?')`), jamais un crash nu. Les comptes cités dans les verdicts se relisent après chaque régénération (claim « 71 occ » vs 102 mesuré).

### Leçons — cycle 49 koel (CONFIRMED + dérive stateProof)

47. **Un stateProof doit passer sur VANILLA aussi — cibler du markup introduit par le patch rend la baseline non rejouable.** Koel commitait `stateProof` `ul[role="menu"]` (ajouté par le patch) : le run vanilla timeoutait sur le context-menu → 1 règle et ~250 occ de la baseline-states inaccessibles à l'auditeur. Règle : chaque sélecteur stateProof/setup doit exister dans le DOM vanilla (`.menu.context-menu ul`, pas `ul[role=menu]`) — le stateProof prouve que le widget S'OUVRE, pas qu'il est déjà conforme ; l'axe-scan capture le défaut. Corollaire : rejouer le scénario vanilla AVANT de figer la baseline.

### Leçons — cycle 52 netbox (CONFIRMED bit-identique + hashes inter-instances)

48. **Les hashes de scope/states doivent être normalisés sur le chemin — jamais l'origine complète.** scopeHash/statesHash incluaient le baseUrl entier → le même scope sur :9340 vs :9360 produisait des hashes incomparables entre instances (worker vs auditeur vs install-build). Runner corrigé : `stripOrigin(u)` → pathname+search+hash avant hachage. Corollaire portabilité : quand Docker Hub rate-limit (429), basculer les bases sur mirror.gcr.io et retaguer local plutôt que bloquer le rejeu.
