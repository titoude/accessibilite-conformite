# Audit accessibilité — 2026-10-05

**3 règle(s) violée(s), 7 occurrence(s), 1/1 scénario(s) audité(s), 0 erreur(s), 0 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d77621142cae`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:17170/login
  - `footer > div:nth-child(1) > span`
  - `div:nth-child(3) > span`
  - `.link-secondary`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://localhost:17170/login
  - `a[href$="lldap"]`
  - `a[href$="h5PEdRMNyP"]`
  - `.me-4.text-reset:nth-child(3)`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:17170/login
  - `html`

