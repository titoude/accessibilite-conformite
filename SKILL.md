---
name: accessibilite-conformite
description: Rendre un site web ou une application conforme WCAG 2.2 AA / RGAA / EAA avec un taux d'erreur minimal — boucle audit axe-core → corrections → vérification indépendante → garde-fou CI. À utiliser dès qu'on demande accessibilité, RGAA, WCAG, handicap, screen reader, navigation clavier sur un projet.
---

# Accessibilité — mise en conformité complète

Objectif : amener le projet à **0 violation automatisée + validation manuelle des critères non-automatisables**, couvrant cécité, malvoyance, motricité, surdité, cognitif/DYS, photosensibilité — sur desktop et mobile. « Compatible lecteurs d'écran » n'est affirmé qu'avec une matrice de tests réels (NVDA, VoiceOver, TalkBack) — la conformité WCAG/ATAG est le socle, pas une preuve d'exécution sur chaque TA.

Principe fondateur : **l'accessibilité se fait dans le code source, jamais par surcouche**. Les widgets « overlay » (accessiBe, UserWay…) sont explicites interdits — condamnés pour allégations mensongères (FTC 2025), désapprouvés par la Commission européenne, et nuisibles aux lecteurs d'écran.

## Fichiers de ce skill

- `audit.mjs` — script d'audit axe-core + Playwright prêt à l'emploi (crawl + rapport JSON/MD + exit code CI)
- `checklist.md` — checklist de vérification manuelle et technologies d'assistance
- `workflow.py` — orchestration multi-agents Devin (optionnel, pour `run_workflow`)

## Règles anti-erreur (non négociables)

1. **Le correcteur se teste mais n'est jamais son juge final.** Il exécute ses tests et prépare ses preuves ; la validation finale relève d'un agent/contexte/humain distinct qui rejoue l'audit + la checklist.
2. **Corrections déterministes d'abord** (attributs, rôles mécaniques), jugement ensuite. Distinguer modification mécanique (associer un champ à un libellé existant) et décision sémantique (inventer le bon libellé, la bonne alternative, le bon landmark) — les secondes exigent une justification.
3. **`alt=""` exige une justification contextuelle**, pas seulement « décorative » : image décorative OU information déjà fournie par le texte adjacent (cas prévu par le W3C). Un mauvais `alt=""` devient invisible pour tout scanner (« silent lie »). En cas de doute, alt descriptif.
4. **Première règle d'ARIA : ne pas utiliser ARIA** quand un élément HTML natif existe (`<button>`, `<nav>`, `<label>`, `<dialog>`…). ARIA mal utilisé aggrave.
5. **Jamais de suppression de règle** (`skip`, `disable`, commentaire off) ni de modification du runner/audit, de la liste d'URLs, des exclusions ou des données de test pour faire passer un check — corriger la source ou documenter l'exception.
6. **Chaque correction est re-vérifiée** en relançant l'audit — un fix est « fait » seulement quand la règle passe ET que la correction existe dans le code livré/build évalué (pas seulement dans un DOM modifié).
7. **Boucle bornée** : max 3 rounds correction→vérification ; sans progrès, arrêter avec un statut honnête : `résolution partielle`, `bloqué` ou `revue requise` — jamais de « fait » forcé.
8. Pas de contournement : pas d'outline:none sans `:focus-visible` équivalent, pas de `aria-hidden` sur du contenu utilisable, **pas de fonctionnalité ou d'information supprimée** pour faire disparaître une violation. `tabindex="-1"` n'est PAS interdit en soi : il est légitime dans un composite à roving tabindex (un élément dans l'ordre de Tab, les autres atteints par les flèches), pour un focus programmatique ou un état inactif — tester entrée, navigation interne et sortie du widget.
9. **Modales : nommer la bonne exigence.** L'absence de confinement du focus n'est pas automatiquement 2.1.2 (piège clavier = impossibilité de SORTIR). Exigences APG dialog : focus déplacé dans la modale à l'ouverture, arrière-plan inerte, fermeture Esc, retour du focus au déclencheur. Relier chaque défaut à son exigence précise.
10. **Reflow 1.4.10 : exceptions à respecter.** Zéro défilement horizontal n'est PAS exigé pour les contenus dont le sens impose une présentation 2D (tableaux de données, cartes, canvas, graphiques). Un `scrollWidth` global seul ne prouve ni le reflow ni ne justifie une suppression de contenu — examen contextuel.
11. **Drag & drop (2.5.7) : le clavier ne suffit pas.** Il faut une action au pointeur simple sans glisser (boutons, menu contextuel) — sauf exception du critère. Une alternative clavier seule ne couvre pas les utilisateurs de pointeur incapables de glisser.
12. **Mesurer, ne pas estimer** : tout critère « vérifié » a une preuve (règle axe passée, capture, test rejoué).
13. **Une assertion vérifie l'effet observable, pas l'exécution d'une action.** `await click()` puis `assert(true)` n'est pas un test — l'attente porte sur le résultat dans le DOM. Interdits : sélecteurs à sous-chaîne qui matchent un autre état (`cls.includes('read')` matche `unread` — utiliser `classList.contains` ou un token exact), assertions sur la non-invisibilité qui passent page vide.
14. **Aucun `.catch(()=>{})` ni try/catch muet sur une étape requise.** Si l'élément requis est absent ou l'action échoue, c'est un FAIL ou une erreur de couverture — jamais un skip silencieux ni un `return true`. Un élément requis manquant réduit la couverture, il ne la valide pas.
15. **Nom accessible = nom calculé, pas présence d'attribut.** Ni `getAttribute('aria-labelledby')` ni `getAttribute('value')` ne prouvent qu'un composant a un nom accessible (prouvé : présence d'attribut avec nom calculé vide). Utiliser un lookup qui échoue réellement (`getByRole(role, {name})`, API `computedAccessibleName`, ou axe `aria-required-children`/évaluation de nom) et comparer la valeur attendue. Attention : Chromium retombe sur le contenu de l'élément quand un `aria-labelledby` pointe vers un id inexistant — si `labelledby` est la seule source de nom attendue, vérifier EN PLUS que chaque id référencé existe et contient le texte attendu (voir `tests-validateurs/`).
16. **Jamais modifier le produit pour satisfaire le harnais.** Changer un intervalle de polling, ralentir une animation, désactiver un fetch… pour passer `networkidle`/`waitFor` est interdit (précédent réel : `setInterval(100→1000)` détecté par l'audit tiers). Le harnais s'adapte (`waitUntil: 'domcontentloaded'` + attente d'un sélecteur), le produit ne change que pour une amélioration réelle de l'utilisateur.
17. **Zoom/reflow : mesurer la préservation du contenu**, pas le viewport (`documentElement.clientWidth > 0` passe sur une application entièrement masquée). L'assertion porte sur un élément de référence resté visible/fonctionnel et sur `scrollWidth ≤ viewport` pour le reflow.

## Procédure

### Phase 0 — Découverte (5 min, déterministe)

1. Identifier le stack (README, package.json, Makefile) et la commande de démarrage dev.
2. Installer l'outillage : `npm i -D playwright axe-core` puis `npx playwright install chromium`.
3. Copier `audit.mjs` du skill dans le projet (ex. `scripts/audit.mjs` ou `tools/`).
4. Lancer l'app, lister les routes/écrans atteignables (router, sitemap, menus) — c'est le **manifeste du périmètre**, à figer avant l'audit. Pour les écrans derrière auth : produire un `storageState` Playwright (`--storage-state auth.json`) par rôle, jamais de secrets en clair. Pour les apps routées par hash (TiddlyWiki…) : `--keep-hash` ou `--urls` explicites.

### Phase 1 — Baseline

```
node audit.mjs http://localhost:<port> --out a11y-audit/baseline
# ou pour une liste explicite :
node audit.mjs --urls http://localhost:3000/,http://localhost:3000/form --out a11y-audit/baseline
```

Puis auditer les **états dynamiques** — angle mort d'un audit route-par-route : déclarer dans la carte `STATES` de `audit.mjs` les vues invisibles au chargement (modale, drawer, toast, onglet, section dépliée, état après action) et les scanner :

```
node audit.mjs http://localhost:<port> --states all --out a11y-audit/baseline
```

Si l'app n'a **aucun** état dynamique, le déclarer explicitement : `--states none` — `--states all` sur une carte `STATES` vide est une erreur (exit 2), pas un passe.

Sortie : `a11y-audit/baseline/{report.md,report.json,scope.json}` — `scope.json` liste chaque scénario exécuté avec son statut et un hash ; le run final doit reproduire le même périmètre (mêmes identifiants de scénarios), une somme égale ne suffit pas. Le runner échoue (exit 2) sur toute erreur : navigation, injection, précondition `--wait-for` absente, HTTP ≥ 400, redirection vers un login, état demandé inconnu — un audit partiel n'est pas un PASS. Classer les violations en 2 lots :

- **Lot A — déterministe** : `html-has-lang`, `document-title`, `duplicate-id`, `aria-allowed-attr`, `label` (quand un libellé visible existe), `button-name`/`link-name` sur icônes, `list`, `landmark-*`, `empty-heading`, `bypass`.
- **Lot B — contextuel** : `color-contrast` (choix de palette), `image-alt` (contenu pertinent), `focus-order`, `keyboard`, `aria-*` sémantique, `target-size`, reflow (avec exceptions 2D), live regions, drag&drop (alternative pointeur 2.5.7), audiodescription, focus non masqué (2.4.11/12), contenu au survol (1.4.13), saisie redondante (3.3.7), authentification accessible (3.3.8), autocomplete purpose (1.3.5).

### Phase 2 — Corrections

Lot A en premier (fixes mécaniques), puis lot B par famille (une famille = une passe sur tout le codebase, pas par occurrence — la correction doit être **générale**, ex. corriger le composant `Button` corrige les 40 usages).

Référence par catégorie de besoin :
- Cécité : sémantique HTML, landmarks, `h1→h3`, labels/alt pertinents, `aria-live` pour les états dynamiques, tableaux `th scope`.
- Malvoyance : contrastes ≥ 4,5:1 (3:1 grand texte/UI), zoom 200 %, reflow 320 px sans scroll horizontal, info non portée par la couleur seule.
- Moteur : tout au clavier, focus visible (`:focus-visible`), 0 piège clavier, cibles ≥ 24 px, gestes avec alternative.
- Surdité : sous-titres/transcriptions.
- Cognitif : labels d'aide, erreurs explicites + suggestion, `prefers-reduced-motion`, pas de timeout brutal.
- Tous : `<html lang>`, `title` par page, lien d'évitement.

Re-lancer `audit.mjs` après chaque famille sur les pages touchées ; échec → corriger, pas contourner.

### Phase 3 — Vérification indépendante

Agent/humain **distinct** exécute sur la branche :
1. `node audit.mjs <url> --states all --out a11y-audit/final` → **0 violation ET 0 erreur requis** sur le même `scope.json` que la baseline (comparer les identifiants de scénarios, pas seulement les compteurs).
2. `checklist.md` en entier — en particulier : parcours complet clavier seul, NVDA ou VoiceOver sur les flows clés, zoom 200 %/400 %, reduced-motion.
3. Évaluation finale **distincte du vérificateur opérationnel** : rejouer avec des tests et des pages inutilisés pendant la correction (sinon le système apprend à satisfaire son propre juge). Les corrections faites après l'éval comptent dans les rounds/itérations.
4. Chaque écart → nouveau round Phase 2 (max 3, voir règle 7) — dépasser le budget se déclare, ne se masque pas.

### Phase 4 — Pérennité

1. Ajouter le garde-fou — **n'importe où, pas forcément GitHub Actions** : hook git `pre-push` (modèle fourni, bloque le push si ≥ 1 violation), job CI quel que soit le provider, ou `pa11y-ci` avec `threshold: 0`. Le but : qu'aucune régression ne puisse être livrée sans audit.
2. Rédiger/maj la déclaration d'accessibilité (obligatoire FR : mention de conformité en page d'accueil + mécanisme de signalement) — modèle : https://accessibilite.numerique.gouv.fr/
3. Livrer : PR avec le rapport `a11y-audit/final/report.md`, le récap baseline → final, et les points checklist non automatisables avec leur statut.

## Specifications (définition de « fait »)

- 0 violation axe-core ET 0 erreur de périmètre sur le scope figé, tags WCAG 2.2 A/AA + best-practice — les résultats `incomplete` sont listés comme « à revoir », pas absorbés dans un PASS.
- Grille de critères par statut (`PASS/FAIL/NOT_APPLICABLE/NOT_TESTED/NEEDS_HUMAN_REVIEW`) — les statuts non testés sont explicites, jamais masqués.
- Checklist manuelle : 100 % des points pertinents passés ou écart motivé.
- Le gate CI existe et bloque les régressions.
- La déclaration d'accessibilité est présente.
- Livrable : PR + `a11y-audit/` (baseline vs final) + statut checklist.

## Forbidden

- Overlays/widgets promettant la conformité (accessiBe, UserWay, EqualWeb…) — interdits, voir le rapport de fond.
- `display:none`/`visibility:hidden` sur du contenu nécessaire, `outline:none` sans équivalent, `user-scalable=no`, `maximum-scale<2`.
- Corriger en injectant du JS runtime qui masque le markup (re-render ≠ accessibilité).
- Déclarer « accessible » sans preuve de vérification indépendante.
- Modifier le produit pour satisfaire le harnais de test (timings, polling, animations, waitUntil) — voir règle 16.
- Assertions qui ne peuvent pas échouer : sous-chaînes ambiguës, `catch` muet sur étape requise, présence d'attribut comme preuve de nom accessible — voir règles 13-15.
