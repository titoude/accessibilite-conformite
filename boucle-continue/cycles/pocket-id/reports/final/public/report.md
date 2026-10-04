# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 7/8 scénario(s) audité(s), 1 erreur(s), 1 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `490baf0f2181`

## Résultats incomplets à revoir (1)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:1411/device
  - `#bits-c3-input`

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:1411/logout — redirection vers une page de connexion (http://localhost:1411/login?redirect=%2Flogout) — la page demandée n'a pas été auditée

