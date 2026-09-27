Playbook: Accessibilité — mise en conformité WCAG 2.2 AA / RGAA

## Overview
Amener un site ou une application web à 0 violation d'accessibilité automatisée (axe-core, WCAG 2.2 A/AA + best-practice) puis valider les critères non-automatisables (navigation clavier, lecteur d'écran, zoom, mouvement) — le tout en corrigeant le code source, jamais par surcouche, avec une vérification indépendante avant livraison.

## What's Needed From User
- L'URL du dépôt (le repo doit être connecté à Devin)
- Comment démarrer l'app en local si non évident (ou credentials de test pour les écrans derrière auth)
- Éventuellement : liste de routes prioritaires

## Procedure
1. Lis le README/package.json ; identifie stack, commande de démarrage, et les routes/écrans atteignables.
2. Installe l'outillage : `npm i -D playwright axe-core && npx playwright install chromium`. Copie le script `audit.mjs` du skill `accessibilite-conformite` (ou le recrée : axe-core + Playwright, tags wcag2a/2aa/21a/21aa/22aa/best-practice, sortie JSON+MD, exit≠0 si violations) dans `scripts/a11y/`.
3. **Fige le manifeste du périmètre AVANT tout audit** (`manifest.json` : scénarios attendus avec route + rôle + données + état + préconditions + attentes). Démarre l'app et lance l'audit baseline : `node scripts/a11y/audit.mjs <url> --out a11y-audit/baseline` (crawl same-origin ; `--urls` explicites pour les routes hors crawl/auth). Déclare les vues invisibles au chargement (modales, drawers, toasts, onglets, sections dépliées) dans la carte `STATES` du script — sélecteurs + séquence d'ouverture — et audite-les avec `--states all` : c'est l'angle mort d'un audit route-par-route. Compare ensuite le scope exécuté (`scope.json`) au manifeste attendu.
4. Classe les violations : lot A déterministe (lang, title, labels existants, landmarks, duplicate-id, button/link-name, list) et lot B contextuel (contrastes, alts pertinents, focus, clavier, ARIA sémantique, cibles 24 px, live regions).
5. Corrige par famille — corrections générales sur les composants partagés, pas occurrence par occurrence : HTML sémantique et landmarks d'abord, labels/alt, contrastes ≥ 4,5:1, focus visible `:focus-visible`, tout au clavier sans piège, modals qui piègent et relâchent le focus, `prefers-reduced-motion`, messages d'erreur explicites. **Jamais modifier le produit pour satisfaire le harnais** (timing, polling, animation — le harnais s'adapte avec `waitUntil:'domcontentloaded'` + sélecteur attendu).
6. Relance l'audit après chaque famille ; itère jusqu'à 0 violation sur toutes les pages.
7. Vérification indépendante : exécute la checklist manuelle du skill (parcours complet au clavier seul, zoom 200 %/400 %, reduced-motion, annonces dynamiques). Idéalement par une session/agent distinct — un correcteur ne se vérifie pas lui-même. Assertions de test exigeantes : effet observable (pas action exécutée), aucun `.catch(()=>{})` sur étape requise (élément absent = FAIL/coverage gap, jamais true), nom accessible = nom **calculé** comparé à l'attendu (pas présence d'`aria-labelledby`), zoom/reflow = élément de référence toujours présent + `scrollWidth ≤ viewport` (pas `clientWidth > 0`). Chaque `incomplete` axe reçoit une décision traçable par groupe règle×scénario. **Validation de livraison** : checkout propre + patch + install verrouillée + build du projet.
8. Ajoute le garde-fou CI : un job qui lance `node scripts/a11y/audit.mjs $PREVIEW_URL` (exit ≠ 0 = échec) ; documente la méthode dans le README ou CONTRIBUTING.
9. Rédige la déclaration d'accessibilité (obligatoire FR/RGAA : mention de conformité en page d'accueil + mécanisme de signalement), modèle sur https://accessibilite.numerique.gouv.fr/
10. Ouvre la PR : baseline vs final, récap par famille corrigée, statut checklist, points humains restants (test NVDA complet, etc.).

## Specifications
- 0 violation axe-core sur toutes les pages atteignables (WCAG 2.2 A/AA + best-practice).
- Checklist manuelle complétée ; chaque écart non résolu est listé explicitement dans la PR.
- Gate CI en place ; déclaration d'accessibilité présente.
- Livrable : PR + rapports `a11y-audit/` (baseline → final).

## Advice and Pointers
- Première règle d'ARIA : ne pas l'utiliser si un élément HTML natif existe — ARIA mal employé aggrave.
- `alt=""` uniquement sur image prouvée décorative : un mauvais `alt=""` est invisible pour tout scanner (silent lie).
- Les corrections de contraste doivent rester cohérentes avec la charte — changer le token, pas chaque élément.
- Si la même violation persiste après 2 tentatives de correction, escalader dans la PR plutôt que boucler.

## Forbidden Actions
- Overlay/widget « 1 ligne de code » promettant la conformité (accessiBe, UserWay, EqualWeb…) — discrédités (amende FTC, désapprobation Commission européenne) et nocifs aux lecteurs d'écran.
- Désactiver ou exclure une règle axe/une route pour faire passer l'audit.
- `outline:none` sans équivalent `:focus-visible`, `user-scalable=no`, `aria-hidden` sur contenu utilisable, `tabindex` positif.
- Déclarer « accessible » sans preuve de vérification indépendante.
- Modifier le produit pour satisfaire le harnais (timings, polling, `networkidle`) ; assertions qui ne peuvent pas échouer (sous-chaînes ambiguës, catch muet, attribut présent pris pour nom accessible).
