# Audit accessibilité — 2026-10-04

**3 règle(s) violée(s), 5 occurrence(s), 3/4 scénario(s) audité(s), 1 erreur(s), 2 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `51648b64727f`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-attr?application=axeAPI

- http://127.0.0.1:5175/docs/general/YE3rIig7Vn
  - `#mantine-qhxd8kufx`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-input-field-name?application=axeAPI

- http://127.0.0.1:5175/docs/general/YE3rIig7Vn
  - `.page-title > div > .tiptap[role="textbox"][translate="no"]`
  - `div:nth-child(4) > .tiptap[role="textbox"][translate="no"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:5175/docs/general/YE3rIig7Vn
  - `span[data-mark-view-content=""] > span`
  - `._tocLink_4ey6l_485`

## Résultats incomplets à revoir (2)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:5175/login
  - `p`
- http://127.0.0.1:5175/forgot-password
  - `p`

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://127.0.0.1:5175/p/docmost — redirection vers une page de connexion (http://127.0.0.1:5175/login?redirect=%2Fp%2Fdocmost) — la page demandée n'a pas été auditée

