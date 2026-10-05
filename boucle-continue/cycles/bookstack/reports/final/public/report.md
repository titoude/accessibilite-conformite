# Audit accessibilité — 2026-10-05

**0 règle(s) violée(s), 0 occurrence(s), 13/13 scénario(s) audité(s), 0 erreur(s), 38 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `a09672159a4f`

## Résultats incomplets à revoir (38)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8080/books/demo-a11y-book
  - `.mb-xl:nth-child(1) > h2`
  - `.entity-meta-item:nth-child(1) > div`
  - `.entity-meta-item:nth-child(1) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(1) > div > a`
  - `.entity-meta-item:nth-child(2) > div`
  - `.entity-meta-item:nth-child(2) > div > span[title="2026-10-05 00:08:06 UTC"]`
  - `.entity-meta-item:nth-child(2) > div > a`
  - `.actions > h2`
  - `button[aria-label="Export"] > span:nth-child(2)`
  - `input[refs="entity-search@searchInput"]`
  - … +24 autres
- http://localhost:8080/ [state:suggestions-recherche]
  - `#recent-pages > h2`
  - `.compact.entity-list > .page[data-entity-id="345"][data-entity-type="page"] > .content > .entity-list-item-name.break-text`
  - `.compact.entity-list > .page[data-entity-id="344"][data-entity-type="page"] > .content > .entity-list-item-name.break-text`

### skip-link — The skip-link target should exist and be focusable

- http://localhost:8080/ [state:menu-mobile]
  - `.skip-to-content-link`

