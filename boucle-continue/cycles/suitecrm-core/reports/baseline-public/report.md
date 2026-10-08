# Audit accessibilité — 2026-10-08

**5 règle(s) violée(s), 21 occurrence(s), 3/3 scénario(s) audité(s), 0 erreur(s), 5 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `8d0c255d0609`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9950/#/Login
  - `#login-button`
- http://localhost:9950/#/Login [state:login-mobile-390]
  - `#login-button`
- http://localhost:9950/#/Login [state:login-bad-creds]
  - `input[type="text"]`
  - `input[type="password"]`
  - `#login-button`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-prohibited-attr?application=axeAPI

- http://localhost:9950/#/Login [state:login-bad-creds]
  - `.close`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:9950/#/Login
  - `html`
- http://localhost:9950/#/Login [state:login-mobile-390]
  - `html`
- http://localhost:9950/#/Login [state:login-bad-creds]
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9950/#/Login
  - `html`
- http://localhost:9950/#/Login [state:login-mobile-390]
  - `html`
- http://localhost:9950/#/Login [state:login-bad-creds]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9950/#/Login
  - `input[type="text"]`
  - `input[type="password"]`
  - `scrm-footer-ui`
- http://localhost:9950/#/Login [state:login-mobile-390]
  - `input[type="text"]`
  - `input[type="password"]`
  - `scrm-footer-ui`
- http://localhost:9950/#/Login [state:login-bad-creds]
  - `input[type="text"]`
  - `input[type="password"]`
  - `scrm-footer-ui`

## Résultats incomplets à revoir (5)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9950/#/Login
  - `input[type="text"]`
  - `input[type="password"]`
- http://localhost:9950/#/Login [state:login-mobile-390]
  - `input[type="text"]`
  - `input[type="password"]`
- http://localhost:9950/#/Login [state:login-bad-creds]
  - `span`

