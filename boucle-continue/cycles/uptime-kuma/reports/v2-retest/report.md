# Audit accessibilité — 2026-10-05

**1 règle(s) violée(s), 1 occurrence(s), 4/4 scénario(s) audité(s), 0 erreur(s), 21 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `3abf70a09724`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:3020/status/demo [state:incident-manage-dialog]
  - `.selector`

## Résultats incomplets à revoir (21)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3020/add
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `#method`
  - `#httpBodyEncoding`
  - `#auth-method`
- http://localhost:3020/add [state:create-group-dialog]
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `#method`
  - `#httpBodyEncoding`
  - `#auth-method`
- http://localhost:3020/status/demo [state:incident-manage-dialog]
  - `#analyticsType`
  - `.prism-editor__line-number.comment.token:nth-child(2)`
  - `.prism-editor__line-number.comment.token:nth-child(3)`
  - `.prism-editor__line-number.comment.token:nth-child(4)`
  - `.prism-editor__line-number.comment.token:nth-child(5)`
  - `.prism-editor__textarea`
  - `#ms-3c3d0ff7`

