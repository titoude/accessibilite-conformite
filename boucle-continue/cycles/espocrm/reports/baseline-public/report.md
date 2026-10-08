# Audit accessibilité — 2026-10-08

**8 règle(s) violée(s), 26 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 2 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d572392ee3e2`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.14/image-alt?application=axeAPI

- http://localhost:7747/
  - `img`
- http://localhost:7747/#Bogus/route
  - `img`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:7747/
  - `#btn-login`
- http://localhost:7747/#Bogus/route
  - `#btn-login`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.14/html-has-lang?application=axeAPI

- http://localhost:7747/
  - `html`
- http://localhost:7747/#Bogus/route
  - `html`

## [SERIOUS] tabindex — Elements should not have tabindex greater than zero

Ensure tabindex attribute values are not greater than 0
Référence : https://dequeuniversity.com/rules/axe/4.14/tabindex?application=axeAPI

- http://localhost:7747/
  - `#field-userName`
  - `#field-password`
  - `#btn-login`
- http://localhost:7747/#Bogus/route
  - `#field-userName`
  - `#field-password`
  - `#btn-login`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:7747/
  - `html`
- http://localhost:7747/#Bogus/route
  - `html`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.14/meta-viewport?application=axeAPI

- http://localhost:7747/
  - `meta[name="viewport"]`
- http://localhost:7747/#Bogus/route
  - `meta[name="viewport"]`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:7747/
  - `html`
- http://localhost:7747/#Bogus/route
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:7747/
  - `.panel-heading`
  - `div[data-name="username"]`
  - `label[for="field-password"]`
  - `#field-password`
- http://localhost:7747/#Bogus/route
  - `.panel-heading`
  - `div[data-name="username"]`
  - `label[for="field-password"]`
  - `#field-password`

## Résultats incomplets à revoir (2)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### bypass — Page must have means to bypass repeated blocks

- http://localhost:7747/
  - `html`
- http://localhost:7747/#Bogus/route
  - `html`

