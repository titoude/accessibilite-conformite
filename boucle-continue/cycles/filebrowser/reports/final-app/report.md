# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 13/13 scénario(s) audité(s), 0 erreur(s), 13 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `4c3d0d8b658c`

## Résultats incomplets à revoir (13)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8082/settings/profile
  - `.router-link-active`
- http://localhost:8082/settings/shares
  - `.router-link-active`
- http://localhost:8082/settings/global
  - `.router-link-active`
- http://localhost:8082/settings/users
  - `.router-link-active`
- http://localhost:8082/settings/users/1
  - `.active > a[href$="users"]`
- http://localhost:8082/403
  - `h1 > span`
- http://localhost:8082/404
  - `h1 > span`
- http://localhost:8082/500
  - `h1 > span`
- http://localhost:8082/files [state:mobile-drawer]
  - `button[aria-label="Switch view"] > span`
  - `#dropdown > button[aria-label="Download"][title="Download"] > span`
  - `#upload-button > span`
  - `#dropdown > button[aria-label="Info"][title="Info"] > span`
  - `button[aria-label="Select multiple"] > span`

