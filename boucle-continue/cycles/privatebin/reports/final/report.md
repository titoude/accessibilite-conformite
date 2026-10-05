# Audit accessibilité — 2026-10-05

**0 règle(s) violée(s), 0 occurrence(s), 14/14 scénario(s) audité(s), 0 erreur(s), 15 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `79a62c3ec780`

## Résultats incomplets à revoir (15)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8080/
  - `#pasteExpiration`
  - `#pasteFormatter`
  - `#aboutbox`
  - `i`
- http://localhost:8080/?09d52e8dde9aaba1#-7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2F
  - `#loadconfirmmodal-title`
- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C [state:email-modal]
  - `#emailconfirmmodal-title`
  - `#emailconfirm-timezone-current`
- http://localhost:8080/ [state:preview-tab]
  - `#pasteExpiration`
  - `#pasteFormatter`
- http://localhost:8080/ [state:navbar-mobile]
  - `#pasteExpiration`
  - `#pasteFormatter`
- http://localhost:8080/ [state:dark-mode]
  - `#pasteExpiration`
  - `#pasteFormatter`
  - `#aboutbox`
  - `a[href$="privatebin.info/"]`

