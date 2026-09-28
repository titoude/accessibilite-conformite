# Audit accessibilité — 2026-09-28

**1 règle(s) violée(s), 1 occurrence(s), 5/5 scénario(s) audité(s), 0 erreur(s), 3 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d07fa814ceb6`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:5001/ [state:config-panel]
  - `.config-div-alts > div > span`

## Résultats incomplets à revoir (3)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### link-in-text-block — Links must be distinguishable without relying on color

- http://127.0.0.1:5001/search?q=test
  - `a[href$="support.google.com"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:5001/ [state:config-panel]
  - `p`
  - `.link`

