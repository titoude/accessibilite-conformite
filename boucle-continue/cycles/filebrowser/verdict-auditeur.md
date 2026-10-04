# Verdict auditeur — cycle 8 filebrowser (session devin-4f68a5dd3e57419797a66c7ddb01aebc)

**Verdict : CONFIRMED** (reproductibilité axe-score + patch sain — PAS conformité WCAG complète)

Rejeu intégral sur machine propre :
- sha256 du patch OK, provenance 25/25 intègre, install-build rejoué conforme sur checkout propre (vue-tsc 0 err, vite OK, bundle `index-CWrBkCkP.js` identique au serveur audité).
- Audit final rejoué : 0 violation / 13 incomplets / exit 0 ; scopeHash `4c3d0d8b…` et statesHash `0cfef938…` identiques aux artefacts livrés ; /login 0 violation.
- verify.mjs 17/17, eval-final.mjs 6/6.
- Baseline vanilla rejouée : 145 occ / 11 règles + 6 login — distribution identique règle par règle (exit 1). Un écart 141 vs 145 causé par le seed DE L'AUDITEUR (test.txt rangé dans docs/ au lieu de racine) — corrigé, reproduction exacte ensuite.
- Patch lu en entier : aucune triche (pas de display:none, suppression DOM ni aria faux ; `.sr-only` = pattern canonique clip). vue-number-input → input[type=number] natif jugé remédiation honnête (widget ± innommable sans forker la dep → spinbutton natif nommé par label[for]).

## Findings mineurs
- F1 : verify.mjs `search-h2` évaluée sur /settings/global où Search.vue n'est pas monté (!h3||h1>=1 passe sans vérifier le titre Types→h2). Le fix tient via le rescan axe (0 heading-order).
- F2 : hashes internes de scope-compare.json non recalculables depuis les artefacts (générateur non livré — l'affirmation portée vérifiée autrement).
- F3 : dep vue-number-input morte encore enregistrée.
- F4 : seed à épingler dans le manifeste (test.txt racine vs docs/).

## Angle mort réel (hors axe)
Les `div[role=button]` des types de recherche sont focusables mais NON activables au clavier (Enter/Space inertes — WCAG 2.1.1 pré-existant, non masqué par le patch). À corriger dans un futur patch ou documenter comme finding résiduel.
