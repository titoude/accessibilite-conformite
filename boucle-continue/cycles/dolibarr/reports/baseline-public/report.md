# Audit accessibilité — 2026-10-08

**3 règle(s) violée(s), 8 occurrence(s), 1/1 scénario(s) audité(s), 0 erreur(s), 2 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `40bbedeaa643`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9800/index.php
  - `.alogin`

## [SERIOUS] tabindex — Elements should not have tabindex greater than zero

Ensure tabindex attribute values are not greater than 0
Référence : https://dequeuniversity.com/rules/axe/4.14/tabindex?application=axeAPI

- http://localhost:9800/index.php
  - `#username`
  - `#password`
  - `.butAction`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9800/index.php
  - `div[title="Dolibarr 24.0.2"]`
  - `.trinputlogin:nth-child(1)`
  - `#password`
  - `#login_line2 > .center`

## Résultats incomplets à revoir (2)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### bypass — Page must have means to bypass repeated blocks

- http://localhost:9800/index.php
  - `html`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9800/index.php
  - `a[href$="www.dolibarr.org"]`

