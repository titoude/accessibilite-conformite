# Audit accessibilité — 2026-09-28

**10 règle(s) violée(s), 94 occurrence(s), 5/5 scénario(s) audité(s), 0 erreur(s), 12 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d07fa814ceb6`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://127.0.0.1:5001/
  - `#search-bar`
  - `#config-style`
- http://127.0.0.1:5001/search?q=test
  - `#search-bar`
- http://127.0.0.1:5001/ [state:config-panel]
  - `#search-bar`
  - `#config-style`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/select-name?application=axeAPI

- http://127.0.0.1:5001/search?q=test
  - `#result-country`
  - `#result-time-period`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:5001/
  - `#search-submit`
  - `.link`
- http://127.0.0.1:5001/search?q=test
  - `.link`
- http://127.0.0.1:5001/ [state:config-panel]
  - `#search-submit`
  - `#config-collapsible`
  - `.link`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=axeAPI

- http://127.0.0.1:5001/
  - `html`
- http://127.0.0.1:5001/search.html
  - `html`
- http://127.0.0.1:5001/ [state:config-panel]
  - `html`

## [SERIOUS] document-title — Documents must have <title> element to aid in navigation

Ensure each HTML document contains a non-empty <title> element
Référence : https://dequeuniversity.com/rules/axe/4.13/document-title?application=axeAPI

- http://127.0.0.1:5001/search.html
  - `html`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://127.0.0.1:5001/search?q=test
  - `.logo-link`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.13/link-in-text-block?application=axeAPI

- http://127.0.0.1:5001/window?location=https://example.com
  - `.link`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://127.0.0.1:5001/
  - `html`
- http://127.0.0.1:5001/search.html
  - `html`
- http://127.0.0.1:5001/search?q=test
  - `html`
- http://127.0.0.1:5001/window?location=https://example.com
  - `html`
- http://127.0.0.1:5001/ [state:config-panel]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://127.0.0.1:5001/
  - `#search-bar`
  - `.config-div-country`
  - `.config-options > .config-div:nth-child(2)`
  - `.config-div-lang`
  - `.config-div-search-lang`
  - `.config-div-near`
  - `.config-div-block.config-div:nth-child(6)`
  - `.config-div-block.config-div:nth-child(7)`
  - `.config-div-block.config-div:nth-child(8)`
  - `.config-div-anon-view`
  - … +18 autres
- http://127.0.0.1:5001/search.html
  - `input[type="text"]`
- http://127.0.0.1:5001/search?q=test
  - `.header-tab-span`
  - `.header-tab-a:nth-child(2)`
  - `.header-tab-a:nth-child(3)`
  - `.header-tab-a:nth-child(4)`
  - `.header-tab-a:nth-child(5)`
  - `#adv-search-label`
  - `#adv-search-div`
  - `.MAeEI`
- http://127.0.0.1:5001/window?location=https://example.com
  - `div`
- http://127.0.0.1:5001/ [state:config-panel]
  - `#search-bar`
  - `.config-div-country`
  - `.config-options > .config-div:nth-child(2)`
  - `.config-div-lang`
  - `.config-div-search-lang`
  - `.config-div-near`
  - `.config-div-block.config-div:nth-child(6)`
  - `.config-div-block.config-div:nth-child(7)`
  - `.config-div-block.config-div:nth-child(8)`
  - `.config-div-anon-view`
  - … +18 autres

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://127.0.0.1:5001/
  - `html`
- http://127.0.0.1:5001/search.html
  - `html`
- http://127.0.0.1:5001/search?q=test
  - `html`
- http://127.0.0.1:5001/ [state:config-panel]
  - `html`

## Résultats incomplets à revoir (12)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### bypass — Page must have means to bypass repeated blocks

- http://127.0.0.1:5001/
  - `html`
- http://127.0.0.1:5001/search?q=test
  - `html`
- http://127.0.0.1:5001/ [state:config-panel]
  - `html`

### duplicate-id-aria — IDs used in ARIA and labels must be unique

- http://127.0.0.1:5001/
  - `input[name="block"]`
- http://127.0.0.1:5001/ [state:config-panel]
  - `input[name="block"]`

### link-in-text-block — Links must be distinguishable without relying on color

- http://127.0.0.1:5001/search?q=test
  - `a[href$="support.google.com"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:5001/ [state:config-panel]
  - `label[for="config-country"]`
  - `label[for="config-time-period"]`
  - `label[for="config-lang-interface"]`
  - `label[for="config-lang-search"]`
  - `label[for="config-near"]`
  - `label[for="config-block"]`

