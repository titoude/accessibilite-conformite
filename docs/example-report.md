<!-- Generated from the demo with: node audit.mjs http://127.0.0.1:4173 --urls /before.html,/after.html --states none --out a11y-audit/demo -->

# Accessibility audit — 2026-10-26

**3 rule(s) violated, 3 occurrence(s), 2/2 scenario(s) scanned, 0 error(s), 0 incomplete result(s).**

Scope: scope.json — hash `9876ef38baff`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label

Reference: https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://127.0.0.1:4173/before.html
  - `#name`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name

Reference: https://dequeuniversity.com/rules/axe/4.13/select-name?application=axeAPI

- http://127.0.0.1:4173/before.html
  - `#format`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds

Reference: https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:4173/before.html
  - `.bad-help`
