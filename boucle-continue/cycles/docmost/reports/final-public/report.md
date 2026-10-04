# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 3/4 scénario(s) audité(s), 1 erreur(s), 2 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `51648b64727f`

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

