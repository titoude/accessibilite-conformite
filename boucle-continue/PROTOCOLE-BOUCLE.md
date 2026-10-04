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
