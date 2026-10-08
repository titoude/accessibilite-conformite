# Audit accessibilité — 2026-10-08

**3 règle(s) violée(s), 4 occurrence(s), 2/3 scénario(s) audité(s), 1 erreur(s), 1 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `466868186497`

## [CRITICAL] aria-required-attr — Required ARIA attributes must be provided

Ensure elements with ARIA roles have all required ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-attr?application=axeAPI

- http://localhost:7600/auth/login
  - `div[role="heading"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:7600/auth/login
  - `a`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:7600/auth/login
  - `body > div:nth-child(2)`
- http://localhost:7600/auth/forgot_password
  - `body > div:nth-child(2)`

## Résultats incomplets à revoir (1)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7600/auth/forgot_password
  - `.m_8bffd616 > div`

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:7600/setup — redirection vers une page de connexion (http://localhost:7600/auth/login?redirect=%2F) — la page demandée n'a pas été auditée

