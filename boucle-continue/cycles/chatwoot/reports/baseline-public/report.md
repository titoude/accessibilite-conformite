# Audit accessibilité — 2026-10-08

**7 règle(s) violée(s), 37 occurrence(s), 4/4 scénario(s) audité(s), 0 erreur(s), 1 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d157fbc6b3aa`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9700/app/login
  - `.lowercase`
  - `a[href$="password"]`
  - `.truncate`
- http://localhost:9700/app/auth/signup
  - `.text-n-slate-10`
- http://localhost:9700/app/auth/reset/password
  - `a`
- http://localhost:9700/widget?website_token=jq9nkJGuA8cqr28foveZ5wmA
  - `button > span`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.14/html-has-lang?application=axeAPI

- http://localhost:9700/app/login
  - `html`
- http://localhost:9700/app/auth/signup
  - `html`
- http://localhost:9700/app/auth/reset/password
  - `html`
- http://localhost:9700/widget?website_token=jq9nkJGuA8cqr28foveZ5wmA
  - `html`

## [SERIOUS] tabindex — Elements should not have tabindex greater than zero

Ensure tabindex attribute values are not greater than 0
Référence : https://dequeuniversity.com/rules/axe/4.14/tabindex?application=axeAPI

- http://localhost:9700/app/login
  - `input[data-testid="email_input"]`
  - `a[href$="password"]`
  - `.pr-10`
  - `.bg-n-brand`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.14/meta-viewport?application=axeAPI

- http://localhost:9700/app/login
  - `meta[name="viewport"]`
- http://localhost:9700/app/auth/signup
  - `meta[name="viewport"]`
- http://localhost:9700/app/auth/reset/password
  - `meta[name="viewport"]`
- http://localhost:9700/widget?website_token=jq9nkJGuA8cqr28foveZ5wmA
  - `meta[name="viewport"]`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9700/app/auth/signup
  - `.dark\:hidden`
  - `h2`
  - `.mt-2`
  - `form > .space-y-1`
  - `label[for="password"]`
  - `.pr-10`
  - `.mt-5`
  - `.text-lg`
  - `.mt-8`
- http://localhost:9700/app/auth/reset/password
  - `h1`
  - `.mb-4`
  - `.space-y-1`
  - `.mt-4`
- http://localhost:9700/widget?website_token=jq9nkJGuA8cqr28foveZ5wmA
  - `.gap-3 > .justify-between.gap-2.items-center`
  - `.px-0`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9700/app/login
  - `html`
- http://localhost:9700/widget?website_token=jq9nkJGuA8cqr28foveZ5wmA
  - `html`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:9700/app/auth/reset/password
  - `html`
- http://localhost:9700/widget?website_token=jq9nkJGuA8cqr28foveZ5wmA
  - `html`

## Résultats incomplets à revoir (1)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### bypass — Page must have means to bypass repeated blocks

- http://localhost:9700/widget?website_token=jq9nkJGuA8cqr28foveZ5wmA
  - `html`

