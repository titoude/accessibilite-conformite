# Audit accessibilité — 2026-10-04

**7 règle(s) violée(s), 36 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 0 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `2fa3779cce32`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:8080/adminer/
  - `#username`
  - `input[type="password"]`
  - `input[name="auth[db]"]`
- http://localhost:8080/adminer/?sqlite=
  - `#username`
  - `input[type="password"]`
  - `input[name="auth[db]"]`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/select-name?application=axeAPI

- http://localhost:8080/adminer/
  - `select[name="auth[driver]"]`
- http://localhost:8080/adminer/?sqlite=
  - `select[name="auth[driver]"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8080/adminer/
  - `#h1`
  - `.version`
- http://localhost:8080/adminer/?sqlite=
  - `#h1`
  - `.version`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://localhost:8080/adminer/
  - `#version`
- http://localhost:8080/adminer/?sqlite=
  - `#version`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/label-title-only?application=axeAPI

- http://localhost:8080/adminer/
  - `input[name="auth[server]"]`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:8080/adminer/
  - `html`
- http://localhost:8080/adminer/?sqlite=
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8080/adminer/
  - `h2`
  - `tr:nth-child(1)`
  - `tr:nth-child(2)`
  - `tr:nth-child(3) > th`
  - `#username`
  - `tr:nth-child(4)`
  - `tr:nth-child(5)`
  - `p > label`
  - `h1`
  - `#lang > label`
- http://localhost:8080/adminer/?sqlite=
  - `h2`
  - `tr:nth-child(1)`
  - `tr:nth-child(3) > th`
  - `#username`
  - `tr:nth-child(4)`
  - `tr:nth-child(5)`
  - `p > label`
  - `h1`
  - `#lang > label`

