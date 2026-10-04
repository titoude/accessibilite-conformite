# Audit accessibilité — 2026-10-04

**2 règle(s) violée(s), 4 occurrence(s), 16/16 scénario(s) audité(s), 0 erreur(s), 1 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `6b9d17268d76`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-attr?application=axeAPI

- http://127.0.0.1:5175/s/general/p/test-page-a11y-YE3rIig7Vn
  - `#mantine-e31w5g8ay`
- http://127.0.0.1:5175/docs/general/YE3rIig7Vn [state:dark-mode]
  - `#mantine-7obq96zlp`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-input-field-name?application=axeAPI

- http://127.0.0.1:5175/docs/general/YE3rIig7Vn [state:dark-mode]
  - `.page-title > div > .tiptap[role="textbox"][translate="no"]`
  - `div:nth-child(4) > .tiptap[role="textbox"][translate="no"]`

## Résultats incomplets à revoir (1)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://127.0.0.1:5175/home [state:user-menu]
  - `#mantine-h07q1ajtm`

