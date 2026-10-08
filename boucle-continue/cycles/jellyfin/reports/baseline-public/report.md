# Audit accessibilité — 2026-10-07

**2 règle(s) violée(s), 4 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 0 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `db8a1b6a8789`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:5961/web/index.html#/login
  - `a`
- http://localhost:5961/web/#/login [state:forgot-password-form]
  - `a`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.14/meta-viewport?application=axeAPI

- http://localhost:5961/web/index.html#/login
  - `meta[name="viewport"]`
- http://localhost:5961/web/#/login [state:forgot-password-form]
  - `meta[name="viewport"]`

