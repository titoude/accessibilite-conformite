# Audit accessibilité — 2026-10-08

**6 règle(s) violée(s), 28 occurrence(s), 11/11 scénario(s) audité(s), 0 erreur(s), 23 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `eb39d61544b8`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9150/@auditwaves
  - `.tracking-wider`
- http://localhost:9150/@auditwaves/episodes
  - `.leading-8`
- http://localhost:9150/@auditwaves/about
  - `.leading-8`
- http://localhost:9150/@auditwaves/links
  - `.-ml-8`
- http://localhost:9150/cp-auth/login
  - `button`
- http://localhost:9150/@auditwaves [state:public-sidebar-390]
  - `.tracking-wider`
- http://localhost:9150/@auditwaves/chemin-inexistant [state:route-404]
  - `a`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:9150/@auditwaves/episodes/reperage-page-publique/embed
  - `.truncate`
- http://localhost:9150/@auditwaves/episodes/reperage-page-publique/embed/dark
  - `.truncate`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:9150/@auditwaves/episodes
  - `#episode-lists-dropdown`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:9150/@auditwaves
  - `.z-40`
- http://localhost:9150/@auditwaves/episodes
  - `.z-40`
- http://localhost:9150/@auditwaves/episodes/reperage-page-publique
  - `.h-10`
- http://localhost:9150/@auditwaves/about
  - `.z-40`
- http://localhost:9150/@auditwaves [state:public-sidebar-390]
  - `.z-40`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9150/@auditwaves/episodes/reperage-page-publique
  - `.py-4`
- http://localhost:9150/@auditwaves/episodes/reperage-page-publique/embed
  - `img`
  - `.gap-x-2`
  - `.text-sm`
- http://localhost:9150/@auditwaves/episodes/reperage-page-publique/embed/dark
  - `img`
  - `.gap-x-2`
  - `.text-sm`
- http://localhost:9150/@auditwaves/chemin-inexistant [state:route-404]
  - `h1`
  - `p`
  - `a`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:9150/@auditwaves/episodes/reperage-page-publique/embed
  - `html`
- http://localhost:9150/@auditwaves/episodes/reperage-page-publique/embed/dark
  - `html`
- http://localhost:9150/@auditwaves/chemin-inexistant [state:route-404]
  - `html`

## Résultats incomplets à revoir (23)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9150/@auditwaves
  - `h1`
  - `.font-sans`
  - `.-top-3 > div > .text-xs`
- http://localhost:9150/@auditwaves/episodes
  - `.font-bold`
  - `.font-sans`
  - `div > span`
  - `article:nth-child(1) > .flex-shrink-0.w-20.h-20 > time`
  - `article:nth-child(2) > .flex-shrink-0.w-20.h-20 > time`
  - `article:nth-child(3) > .flex-shrink-0.w-20.h-20 > time`
- http://localhost:9150/@auditwaves/episodes/reperage-page-publique
  - `abbr`
  - `h1`
  - `relative-time`
  - `.text-xs > time`
- http://localhost:9150/@auditwaves/about
  - `h1`
  - `.font-sans`
  - `.-top-3 > div > .text-xs`
- http://localhost:9150/@auditwaves/links
  - `h1`
  - `.ml-1`
- http://localhost:9150/pages/a-propos-du-banc
  - `h1`
- http://localhost:9150/cp-auth/login
  - `h1`
- http://localhost:9150/@auditwaves [state:public-sidebar-390]
  - `h1`
  - `.font-sans`
  - `.-top-3 > div > .text-xs`

