# Audit accessibilité — 2026-10-08

**9 règle(s) violée(s), 73 occurrence(s), 5/5 scénario(s) audité(s), 0 erreur(s), 62 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `3d2ea9525306`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:7044/forgot-password/
  - `.v-btn--icon`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c
  - `.text-white.v-btn--variant-text[data-v-51fa11fe=""]`
  - `.bg-info`
  - `button[aria-describedby="v-tooltip-v-0-0-12"]`
  - `button[aria-describedby="v-tooltip-v-0-0-14"]`
  - `button[aria-describedby="v-tooltip-v-0-0-16"]`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c [state:shared-recipe-menu]
  - `.text-white.v-btn--variant-text[data-v-51fa11fe=""]`
  - `button[aria-describedby="v-tooltip-v-0-0-12"]`
  - `button[aria-describedby="v-tooltip-v-0-0-14"]`
  - `button[aria-describedby="v-tooltip-v-0-0-16"]`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-attr?application=axeAPI

- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c
  - `div[aria-controls="v-menu-v-0-0-8"]`
  - `div[aria-controls="v-menu-v-0-0-10"]`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c [state:shared-recipe-menu]
  - `div[aria-controls="v-menu-v-0-0-8"]`
  - `div[aria-controls="v-menu-v-0-0-10"]`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.14/label?application=axeAPI

- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c
  - `#checkbox-v-0-0-18`
  - `#checkbox-v-0-0-21`
  - `#checkbox-v-0-0-25`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c [state:shared-recipe-menu]
  - `#checkbox-v-0-0-18`
  - `#checkbox-v-0-0-21`
  - `#checkbox-v-0-0-25`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:7044/login/
  - `.v-toolbar-title__placeholder`
  - `#password-label`
- http://localhost:7044/forgot-password/
  - `.v-toolbar-title__placeholder`
- http://localhost:7044/register/
  - `.v-toolbar-title__placeholder`
  - `.v-card--hover.v-card--link.v-card:nth-child(1) > .py-3.v-card-title.align-center`
  - `.v-card--hover.v-card--link.v-card:nth-child(2) > .py-3.v-card-title.align-center`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c
  - `.v-toolbar-title[data-v-51fa11fe=""] > .v-toolbar-title__placeholder`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c [state:shared-recipe-menu]
  - `.v-toolbar-title[data-v-51fa11fe=""] > .v-toolbar-title__placeholder`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.14/html-has-lang?application=axeAPI

- http://localhost:7044/login/
  - `html`
- http://localhost:7044/forgot-password/
  - `html`
- http://localhost:7044/register/
  - `html`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c
  - `html`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c [state:shared-recipe-menu]
  - `html`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:7044/forgot-password/
  - `a[href="/"]`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c
  - `a`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c [state:shared-recipe-menu]
  - `a`

## [SERIOUS] aria-tooltip-name — ARIA tooltip nodes must have an accessible name

Ensure every ARIA tooltip node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-tooltip-name?application=axeAPI

- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c
  - `#v-tooltip-v-0-0-9`
  - `#v-tooltip-v-0-0-11`
  - `#v-tooltip-v-0-0-12`
  - `#v-tooltip-v-0-0-14`
  - `#v-tooltip-v-0-0-16`
  - `#v-tooltip-v-0-0-37`
  - `#v-tooltip-v-0-0-39`
  - `#v-tooltip-v-0-0-40`
  - `#v-tooltip-v-0-0-42`
  - `#v-tooltip-v-0-0-44`
  - … +5 autres
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c [state:shared-recipe-menu]
  - `#v-tooltip-v-0-0-9`
  - `#v-tooltip-v-0-0-11`
  - `#v-tooltip-v-0-0-12`
  - `#v-tooltip-v-0-0-14`
  - `#v-tooltip-v-0-0-16`
  - `#v-tooltip-v-0-0-37`
  - `#v-tooltip-v-0-0-39`
  - `#v-tooltip-v-0-0-40`
  - `#v-tooltip-v-0-0-42`
  - `#v-tooltip-v-0-0-44`
  - … +5 autres

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:7044/login/
  - `html`
- http://localhost:7044/forgot-password/
  - `html`
- http://localhost:7044/register/
  - `html`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c
  - `html`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c [state:shared-recipe-menu]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c [state:shared-recipe-menu]
  - `.v-list-item--one-line.v-list-item--link[role="listitem"]:nth-child(1) > .v-list-item__content[data-no-activator=""]`
  - `.v-list-item--one-line.v-list-item--link[role="listitem"]:nth-child(2) > .v-list-item__content[data-no-activator=""]`

## Résultats incomplets à revoir (62)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7044/login/
  - `#username`
  - `#password`
  - `.v-btn--block > .v-btn__content[data-no-activator=""]`
  - `.mr-auto > .v-btn__content[data-no-activator=""]`
  - `.text-center[data-v-8685610e=""]:nth-child(1) > a[target="_blank"] > .v-btn__content[data-no-activator=""]`
  - `.text-center[data-v-8685610e=""]:nth-child(2) > a[target="_blank"] > .v-btn__content[data-no-activator=""]`
  - `a[href$="docs.mealie.io/"] > .v-btn__content[data-no-activator=""]`
- http://localhost:7044/forgot-password/
  - `#input-v-0-3`
  - `.v-btn--block > .v-btn__content[data-no-activator=""]`
  - `.mx-auto > .v-btn__content[data-no-activator=""]`
- http://localhost:7044/register/
  - `a > .v-btn__content[data-no-activator=""]`
  - `button > .v-btn__content[data-no-activator=""]`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c
  - `.font-weight-regular`
  - `.my-3[data-v-445c379e=""] > p`
  - `.mb-4 > .time-card-flex[data-v-c92dc9d8=""] > .flex-nowrap.v-row--no-gutters.justify-center > .flex-no-wrap.my-1[data-v-c92dc9d8=""] > .my-0.text-no-wrap[data-v-c92dc9d8=""]`
  - `.mb-4 > .time-card-flex[data-v-c92dc9d8=""] > .flex-nowrap.v-row--no-gutters.justify-center > .flex-no-wrap.my-1[data-v-c92dc9d8=""] > .my-0.text-no-wrap[data-v-c92dc9d8=""] > .font-weight-bold.opacity-80[data-v-c92dc9d8=""]`
  - `div[aria-controls="v-menu-v-0-0-8"] > span:nth-child(3)`
  - `div[aria-controls="v-menu-v-0-0-10"] > span:nth-child(3)`
  - `.pr-2:nth-child(1) > div:nth-child(1) > .justify-start.d-flex > .mt-1`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .v-list-item--link.py-1.ingredient-list-item > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .v-list-item--link.py-1.ingredient-list-item > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item > .d-inline[data-v-445c379e=""]:nth-child(1) > p`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .v-list-item--link.py-1.ingredient-list-item > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item > .text-bold.d-inline[data-v-445c379e=""] > p`
  - … +12 autres
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c [state:shared-recipe-menu]
  - `.font-weight-regular`
  - `.my-3[data-v-445c379e=""] > p`
  - `.mb-4 > .time-card-flex[data-v-c92dc9d8=""] > .flex-nowrap.v-row--no-gutters.justify-center > .flex-no-wrap.my-1[data-v-c92dc9d8=""] > .my-0.text-no-wrap[data-v-c92dc9d8=""]`
  - `.mb-4 > .time-card-flex[data-v-c92dc9d8=""] > .flex-nowrap.v-row--no-gutters.justify-center > .flex-no-wrap.my-1[data-v-c92dc9d8=""] > .my-0.text-no-wrap[data-v-c92dc9d8=""] > .font-weight-bold.opacity-80[data-v-c92dc9d8=""]`
  - `div[aria-controls="v-menu-v-0-0-8"] > span:nth-child(3)`
  - `div[aria-controls="v-menu-v-0-0-10"] > span:nth-child(3)`
  - `.pr-2:nth-child(1) > div:nth-child(1) > .justify-start.d-flex > .mt-1`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .py-1.ingredient-list-item.v-list-item--link > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .py-1.ingredient-list-item.v-list-item--link > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item > .d-inline[data-v-445c379e=""]:nth-child(1) > p`
  - `.pr-2:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > .py-1.ingredient-list-item.v-list-item--link > .v-list-item__content[data-no-activator=""] > .v-list-item-title > .text-subtitle-1.dense-markdown.ingredient-item > .text-bold.d-inline[data-v-445c379e=""] > p`
  - … +12 autres

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c
  - `.bg-info`
  - `div[aria-controls="v-menu-v-0-0-8"]`
  - `div[aria-controls="v-menu-v-0-0-10"]`
- http://localhost:7044/g/home/shared/r/5f0e6de0-b2e2-4748-a92a-cd420c85c94c [state:shared-recipe-menu]
  - `.bg-info`
  - `div[aria-controls="v-menu-v-0-0-8"]`
  - `div[aria-controls="v-menu-v-0-0-10"]`

