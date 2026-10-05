# Audit accessibilité — 2026-10-05

**0 règle(s) violée(s), 0 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 316 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `def4f4be506a`

## Résultats incomplets à revoir (316)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8888/search?q=test
  - `#language`
  - `#time_range`
  - `#safesearch`
  - `article:nth-child(27) > .result_inner > .url_header[rel="noreferrer"] > .url_wrapper > .url_o1 > .url_i1`
- http://localhost:8888/search?q=test&categories=images
  - `#language`
  - `#time_range`
  - `#safesearch`
  - `article:nth-child(2) > a[rel="noreferrer"] > .image_resolution`
  - `article:nth-child(2) > a[rel="noreferrer"] > .title`
  - `article:nth-child(3) > a[rel="noreferrer"] > .image_resolution`
  - `article:nth-child(3) > a[rel="noreferrer"] > .title`
  - `article:nth-child(4) > a[rel="noreferrer"] > .image_resolution`
  - `article:nth-child(4) > a[rel="noreferrer"] > .title`
  - `article:nth-child(5) > a[rel="noreferrer"] > .image_resolution`
  - … +151 autres
- http://localhost:8888/search?q=test&categories=videos
  - `#language`
  - `#time_range`
  - `#safesearch`
  - `article:nth-child(2) > .result_inner > .thumbnail_link[rel="noreferrer"] > .thumbnail_length`
  - `article:nth-child(3) > .result_inner > .thumbnail_link[rel="noreferrer"] > .thumbnail_length`
  - `article:nth-child(4) > .result_inner > .thumbnail_link[rel="noreferrer"] > .thumbnail_length`
  - `article:nth-child(5) > .result_inner > .thumbnail_link[rel="noreferrer"] > .thumbnail_length`
  - `article:nth-child(6) > .result_inner > .thumbnail_link[rel="noreferrer"] > .thumbnail_length`
  - `a[aria-label="Particle Info node test"] > .thumbnail_length`
  - `a[aria-label="Animation Test / Qualoth Test"] > .thumbnail_length`
  - … +113 autres
- http://localhost:8888/search?q=python
  - `#language`
  - `#time_range`
  - `#safesearch`
  - `article:nth-child(5) > .result_inner > .content`
  - `article:nth-child(7) > .result_inner > .url_header[rel="noreferrer"] > .url_wrapper > .url_o1 > .url_i1`
- http://localhost:8888/search?q=zzqxvbnmxxunlikelyquery
  - `#language`
  - `#time_range`
  - `#safesearch`
  - `article:nth-child(3) > .result_inner > .url_header[rel="noreferrer"] > .url_wrapper > .url_o1 > .url_i1`
  - `article:nth-child(6) > .result_inner > .url_header[rel="noreferrer"] > .url_wrapper > .url_o1 > .url_i1`
  - `article:nth-child(8) > .result_inner > .url_header[rel="noreferrer"] > .url_wrapper > .url_o1 > .url_i1`
  - `article:nth-child(30) > .result_inner > .url_header[rel="noreferrer"] > .url_wrapper > .url_o1 > .url_i1`
- http://localhost:8888/preferences
  - `#tab-content-general > fieldset:nth-child(1) > legend`
  - `select[name="language"]`
  - `select[name="autocomplete"]`
  - `select[name="favicon_resolver"]`
  - `select[name="doi_resolver"]`
  - `select[name="safesearch"]`
- http://localhost:8888/preferences [state:preferences-engines-tab]
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(17) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(19) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(49) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(50) > td:nth-child(8)`
- http://localhost:8888/preferences [state:preferences-category-general-tab]
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(17) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(19) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(49) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(50) > td:nth-child(8)`

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://localhost:8888/preferences [state:preferences-engines-tab]
  - `#tab-content-category_general > .scrollx > .table_engines`
- http://localhost:8888/preferences [state:preferences-category-general-tab]
  - `#tab-content-category_general > .scrollx > .table_engines`

