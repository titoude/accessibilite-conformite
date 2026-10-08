# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 1/2 scénario(s) audité(s), 1 erreur(s), 1 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `2e1e50926f13`

## Résultats incomplets à revoir (1)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7603/auth/forgot_password
  - `.m_8bffd616 > div`

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:7603/auth/login — le document final diffère du document demandé (http://localhost:7603/setup) — déclarer l'URL réelle de l'état dans STATES

