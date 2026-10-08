# Audit accessibilité — 2026-10-08

**6 règle(s) violée(s), 14 occurrence(s), 6/6 scénario(s) audité(s), 0 erreur(s), 34 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `b5005400b153`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:8950/share/dummy.site?auth=audit-c48-shared
  - `#headlessui-popover-button-\:r4\:`
  - `#headlessui-popover-button-\:re\:`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.14/link-in-text-block?application=axeAPI

- http://localhost:8950/
  - `a[href$="plausible.io/"]`
  - `.text-indigo-600.hover\:text-indigo-700[href$="about"]`
- http://localhost:8950/login
  - `span[data-phx-loc="58"] > .text-indigo-600.hover\:text-indigo-700.dark\:text-indigo-500`
- http://localhost:8950/register
  - `.text-indigo-600`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:8950/
  - `.mt-24`
- http://localhost:8950/register
  - `canvas`
- http://localhost:8950/share/dummy.site?auth=audit-c48-shared
  - `.mt-24`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:8950/
  - `.z-20`
- http://localhost:8950/share/dummy.site?auth=audit-c48-shared
  - `.py-5`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:8950/
  - `html`
- http://localhost:8950/share/dummy.site?auth=audit-c48-shared
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:8950/
  - `h4[data-phx-loc="5"]`

## Résultats incomplets à revoir (34)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### target-size — All touch targets must be 24px large, or leave sufficient space

- http://localhost:8950/login
  - `.inset-y-0`
- http://localhost:8950/register
  - `.absolute`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8950/share/dummy.site?auth=audit-c48-shared
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,96.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,16.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(24.5,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(215.6111111111111,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(406.7222222222222,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(597.8333333333334,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(788.9444444444443,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - … +22 autres

