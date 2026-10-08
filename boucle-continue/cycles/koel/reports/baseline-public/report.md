# Audit accessibilité — 2026-10-08

**4 règle(s) violée(s), 25 occurrence(s), 5/5 scénario(s) audité(s), 0 erreur(s), 12 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `81f24e13a5c7`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9049/#/home
  - `button[type="submit"]`
- http://localhost:9049/#/404
  - `button[type="submit"]`
- http://localhost:9049/#/reset-password/invalid-payload-seed49
  - `button[type="submit"]`
- http://localhost:9049/#/invitation/accept/00000000-0000-4000-8000-000000000000
  - `button`
- http://localhost:9049/#/embed/01a11ab2-bb30-7022-8556-502104daceee
  - `button[type="submit"]`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:9049/#/home
  - `html`
- http://localhost:9049/#/404
  - `html`
- http://localhost:9049/#/reset-password/invalid-payload-seed49
  - `html`
- http://localhost:9049/#/embed/01a11ab2-bb30-7022-8556-502104daceee
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9049/#/home
  - `html`
- http://localhost:9049/#/404
  - `html`
- http://localhost:9049/#/reset-password/invalid-payload-seed49
  - `html`
- http://localhost:9049/#/embed/01a11ab2-bb30-7022-8556-502104daceee
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9049/#/home
  - `.text-center`
  - `.flex-col.gap-2.flex:nth-child(2)`
  - `input[type="password"]`
- http://localhost:9049/#/404
  - `.text-center`
  - `.flex-col.gap-2.flex:nth-child(2)`
  - `input[type="password"]`
- http://localhost:9049/#/reset-password/invalid-payload-seed49
  - `.text-center`
  - `.flex-col.gap-2.flex:nth-child(2)`
  - `input[type="password"]`
- http://localhost:9049/#/embed/01a11ab2-bb30-7022-8556-502104daceee
  - `.text-center`
  - `.flex-col.gap-2.flex:nth-child(2)`
  - `input[type="password"]`

## Résultats incomplets à revoir (12)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9049/#/home
  - `input[type="email"]`
  - `input[type="password"]`
  - `a`
- http://localhost:9049/#/404
  - `input[type="email"]`
  - `input[type="password"]`
  - `a`
- http://localhost:9049/#/reset-password/invalid-payload-seed49
  - `input[type="email"]`
  - `input[type="password"]`
  - `a`
- http://localhost:9049/#/embed/01a11ab2-bb30-7022-8556-502104daceee
  - `input[type="email"]`
  - `input[type="password"]`
  - `a`

