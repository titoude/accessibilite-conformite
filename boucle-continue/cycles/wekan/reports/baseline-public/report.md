# Audit accessibilité — 2026-10-07

**6 règle(s) violée(s), 23 occurrence(s), 5/5 scénario(s) audité(s), 0 erreur(s), 0 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `092920c64ae7`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:5580/b/c39wknBoard0000003/feuille-de-route-publique
  - `.cardCount`
- http://localhost:5580/b/c39wknBoard0000001/projet-refonte-web
  - `h1`
  - `.big-message > p`
  - `a[href$="sign-in"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:5580/b/c39wknBoard0000003/feuille-de-route-publique
  - `.minicard-collapse`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:5580/sign-in
  - `h3`
- http://localhost:5580/sign-up
  - `h3`
- http://localhost:5580/forgot-password
  - `h3`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:5580/sign-in
  - `html`
- http://localhost:5580/sign-up
  - `html`
- http://localhost:5580/forgot-password
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:5580/sign-in
  - `.at-title`
  - `.at-signup-link`
  - `.at-form-lang`
- http://localhost:5580/sign-up
  - `.at-title`
  - `.at-signin-link`
  - `.at-form-lang`
- http://localhost:5580/forgot-password
  - `.at-title`
  - `.at-signup-link`
  - `.at-form-lang`

## [MINOR] empty-heading — Headings should not be empty

Ensure headings have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/empty-heading?application=axeAPI

- http://localhost:5580/sign-in
  - `h1`
- http://localhost:5580/sign-up
  - `h1`
- http://localhost:5580/forgot-password
  - `h1`

