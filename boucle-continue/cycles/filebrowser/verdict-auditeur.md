# Verdict auditeur — cycle 8 filebrowser

**Verdict : CONFIRMED** (auditeur tiers devin-4f68a5dd3e57419797a66c7ddb01aebc, rejeu intégral sur machine propre)

## Reproduit

- sha256 du patch OK ; provenance 25/25 fichiers intègres.
- install-build rejoué conforme sur checkout propre : vue-tsc 0 erreur, vite build OK, bundle `index-CWrBkCkP.js` identique à celui servi pendant l'audit.
- Audit final rejoué : 0 violation / 13 incomplets / exit 0 ; scopeHash `4c3d0d8b…` et statesHash `0cfef938…` identiques aux artefacts livrés ; /login 0 violation.
- verify.mjs 17/17 ; eval-final.mjs 6/6.
- Baseline vanilla rejouée : **145 occ / 11 règles + 6 login** — distribution identique règle par règle (exit 1).
- Patch lu en entier : aucune triche (pas de `display:none`, suppression DOM ou aria faux ; `.sr-only` = pattern canonique clip). `vue-number-input` → `input[type=number]` natif jugé remédiation honnête (widget ± innommable sans forker la dépendance → spinbutton natif nommé par `label[for]`).
- Écart initial du rejeu (141 vs 145 occ) causé par **son** seed (test.txt rangé dans docs/ au lieu de la racine) — corrigé, reproduction exacte ensuite.

## Findings

| ID | Sévérité | Finding |
|----|----------|---------|
| F1 | minor | verify.mjs `search-h2` évaluée sur /settings/global où Search.vue n'est pas monté (`!h3||h1>=1` passe sans vérifier le titre Types→h2) ; le fix tient via le rescan axe (0 heading-order) |
| F2 | minor | hashes internes de scope-compare.json non recalculables depuis les artefacts (générateur non livré) — l'affirmation portée est vérifiée autrement |
| F3 | minor | dépendance vue-number-input morte encore enregistrée |
| F4 | minor | seed à épingler dans le manifeste |
| R-KBD | résiduel (amont) | `div[role=button]` des types de recherche : focusables mais non activables au clavier (Enter/Space inertes — WCAG 2.1.1 pré-existant, non masqué par le patch, hors couverture axe) |
