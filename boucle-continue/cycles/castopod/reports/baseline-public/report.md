# Audit accessibilité — 2026-10-08

**6 règle(s) violée(s), 23 occurrence(s), 10/11 scénario(s) audité(s), 1 erreur(s), 23 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `0fe6974dcc45`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9170/@auditwaves
  - `.tracking-wider`
- http://localhost:9170/@auditwaves/episodes
  - `.leading-8`
- http://localhost:9170/@auditwaves/about
  - `.leading-8`
- http://localhost:9170/@auditwaves/links
  - `.-ml-8`
- http://localhost:9170/cp-auth/login
  - `button`
- http://localhost:9170/@auditwaves [state:public-sidebar-390]
  - `.tracking-wider`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:9170/@auditwaves/episodes/reperage-page-publique/embed
  - `.truncate`
- http://localhost:9170/@auditwaves/episodes/reperage-page-publique/embed/dark
  - `.truncate`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:9170/@auditwaves/episodes
  - `#episode-lists-dropdown`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:9170/@auditwaves
  - `.z-40`
- http://localhost:9170/@auditwaves/episodes
  - `.z-40`
- http://localhost:9170/@auditwaves/episodes/reperage-page-publique
  - `.h-10`
- http://localhost:9170/@auditwaves/about
  - `.z-40`
- http://localhost:9170/@auditwaves [state:public-sidebar-390]
  - `.z-40`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9170/@auditwaves/episodes/reperage-page-publique
  - `.py-4`
- http://localhost:9170/@auditwaves/episodes/reperage-page-publique/embed
  - `img`
  - `.gap-x-2`
  - `.text-sm`
- http://localhost:9170/@auditwaves/episodes/reperage-page-publique/embed/dark
  - `img`
  - `.gap-x-2`
  - `.text-sm`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:9170/@auditwaves/episodes/reperage-page-publique/embed
  - `html`
- http://localhost:9170/@auditwaves/episodes/reperage-page-publique/embed/dark
  - `html`

## Résultats incomplets à revoir (23)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9170/@auditwaves
  - `h1`
  - `.font-sans`
  - `.-top-3 > div > .text-xs`
- http://localhost:9170/@auditwaves/episodes
  - `.font-bold`
  - `.font-sans`
  - `div > span`
  - `article:nth-child(1) > .flex-shrink-0.w-20.h-20 > time`
  - `article:nth-child(2) > .flex-shrink-0.w-20.h-20 > time`
  - `article:nth-child(3) > .flex-shrink-0.w-20.h-20 > time`
- http://localhost:9170/@auditwaves/episodes/reperage-page-publique
  - `abbr`
  - `h1`
  - `relative-time`
  - `.text-xs > time`
- http://localhost:9170/@auditwaves/about
  - `h1`
  - `.font-sans`
  - `.-top-3 > div > .text-xs`
- http://localhost:9170/@auditwaves/links
  - `h1`
  - `.ml-1`
- http://localhost:9170/pages/a-propos-du-banc
  - `h1`
- http://localhost:9170/cp-auth/login
  - `h1`
- http://localhost:9170/@auditwaves [state:public-sidebar-390]
  - `h1`
  - `.font-sans`
  - `.-top-3 > div > .text-xs`

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:9170/@auditwaves/chemin-inexistant [state:route-404] — contenu non monté (ni header nav ni main ni player rendu, ou body sans texte) — scan refusé

