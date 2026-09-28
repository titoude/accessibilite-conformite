# Audit accessibilité — 2026-09-28

**1 règle(s) violée(s), 1 occurrence(s), 5/5 scénario(s) audité(s), 0 erreur(s), 7 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d07fa814ceb6`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:5001/window?location=https://example.com
  - `.link`

## Résultats incomplets à revoir (7)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### link-in-text-block — Links must be distinguishable without relying on color

- http://127.0.0.1:5001/search?q=test
  - `a[href$="support.google.com"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:5001/ [state:config-panel]
  - `label[for="config-country"]`
  - `label[for="config-time-period"]`
  - `label[for="config-lang-interface"]`
  - `label[for="config-lang-search"]`
  - `label[for="config-near"]`
  - `label[for="config-block"]`

