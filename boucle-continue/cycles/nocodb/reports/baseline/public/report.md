# Audit accessibilité — 2026-10-05

**10 règle(s) violée(s), 48 occurrence(s), 10/10 scénario(s) audité(s), 0 erreur(s), 7 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `a45e7d0499a9`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:8080/signup
  - `.my-1`
- http://localhost:8080/nc/view/0946699c-0200-4ca6-b57f-566468d08a82
  - `.nc-height-menu-btn`
  - `.nc-view-action-menu-btn`
  - `.\!rounded-lg`
  - `.\!px-1`
- http://localhost:8080/nc/view/b27e5a47-2d11-4e1f-916c-dcef7c364a22
  - `.nc-view-action-menu-btn`
  - `.\!rounded-lg`
  - `.\!px-1`
- http://localhost:8080/signup [state:signup-error]
  - `.my-1`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-valid-attr-value?application=axeAPI

- http://localhost:8080/nc/form/540b143b-6850-4097-9cc3-b791065ead09
  - `#form_item_Priority`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:8080/nc/form/540b143b-6850-4097-9cc3-b791065ead09
  - `.py-1.bg-transparent.nc-cell-field`
  - `textarea`
  - `#form_item_Priority`
  - `input[data-v-7028d24f=""]`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=axeAPI

- http://localhost:8080/signin/
  - `html`
- http://localhost:8080/signup
  - `html`
- http://localhost:8080/forgot-password/
  - `html`
- http://localhost:8080/nc/view/0946699c-0200-4ca6-b57f-566468d08a82
  - `html`
- http://localhost:8080/nc/view/b27e5a47-2d11-4e1f-916c-dcef7c364a22
  - `html`
- http://localhost:8080/nc/form/540b143b-6850-4097-9cc3-b791065ead09
  - `html`
- http://localhost:8080/nc/form/86861b30-aff3-4d77-b4c8-6e3b1d8d5a65/survey
  - `html`
- http://localhost:8080/signin/ [state:signin-error]
  - `html`
- http://localhost:8080/signup [state:signup-error]
  - `html`
- http://localhost:8080/nc/form/540b143b-6850-4097-9cc3-b791065ead09 [state:shared-form-submitted]
  - `html`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8080/signin/ [state:signin-error]
  - `.break-words`
- http://localhost:8080/signup [state:signup-error]
  - `.ant-form-item-explain-error`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-input-field-name?application=axeAPI

- http://localhost:8080/nc/form/86861b30-aff3-4d77-b4c8-6e3b1d8d5a65/survey
  - `div[contenteditable="false"]`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-main-is-top-level?application=axeAPI

- http://localhost:8080/signup
  - `main > .h-full > .h-full.w-full > main`
- http://localhost:8080/nc/form/540b143b-6850-4097-9cc3-b791065ead09
  - `.h-full.w-full[data-v-b89932a4=""] > main`
- http://localhost:8080/nc/form/86861b30-aff3-4d77-b4c8-6e3b1d8d5a65/survey
  - `.h-full.w-full[data-v-b89932a4=""] > main`
- http://localhost:8080/signup [state:signup-error]
  - `main > .h-full > .h-full.w-full > main`
- http://localhost:8080/nc/form/540b143b-6850-4097-9cc3-b791065ead09 [state:shared-form-submitted]
  - `.h-full.w-full[data-v-b89932a4=""] > main`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-no-duplicate-main?application=axeAPI

- http://localhost:8080/signup
  - `.nc-layout-base-inner > .h-full.w-full > main`
- http://localhost:8080/nc/form/540b143b-6850-4097-9cc3-b791065ead09
  - `div:nth-child(1) > .h-full.w-full > main`
- http://localhost:8080/nc/form/86861b30-aff3-4d77-b4c8-6e3b1d8d5a65/survey
  - `div:nth-child(1) > .h-full.w-full > main`
- http://localhost:8080/signup [state:signup-error]
  - `.nc-layout-base-inner > .h-full.w-full > main`
- http://localhost:8080/nc/form/540b143b-6850-4097-9cc3-b791065ead09 [state:shared-form-submitted]
  - `div:nth-child(1) > .h-full.w-full > main`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://localhost:8080/signup
  - `.nc-layout-base-inner > .h-full.w-full > main`
- http://localhost:8080/nc/form/540b143b-6850-4097-9cc3-b791065ead09
  - `div:nth-child(1) > .h-full.w-full > main`
- http://localhost:8080/nc/form/86861b30-aff3-4d77-b4c8-6e3b1d8d5a65/survey
  - `div:nth-child(1) > .h-full.w-full > main`
- http://localhost:8080/signup [state:signup-error]
  - `.nc-layout-base-inner > .h-full.w-full > main`
- http://localhost:8080/nc/form/540b143b-6850-4097-9cc3-b791065ead09 [state:shared-form-submitted]
  - `div:nth-child(1) > .h-full.w-full > main`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8080/nc/view/0946699c-0200-4ca6-b57f-566468d08a82
  - `.transition-all`
  - `.font-semibold > .truncate[data-v-3caeeb4c=""]`
  - `.inset-0.absolute.overflow-hidden`
- http://localhost:8080/nc/view/b27e5a47-2d11-4e1f-916c-dcef7c364a22
  - `.transition-all`
  - `.font-semibold > .truncate`
  - `.inset-0.absolute.overflow-hidden`

## Résultats incomplets à revoir (7)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8080/signin/
  - `.scaling-btn > .gap-2`
- http://localhost:8080/signup
  - `.scaling-btn > .gap-2`
- http://localhost:8080/forgot-password/
  - `.scaling-btn > span`
- http://localhost:8080/signin/ [state:signin-error]
  - `.scaling-btn > .gap-2`
- http://localhost:8080/signup [state:signup-error]
  - `.scaling-btn > .gap-2`

### bypass — Page must have means to bypass repeated blocks

- http://localhost:8080/nc/view/0946699c-0200-4ca6-b57f-566468d08a82
  - `html`
- http://localhost:8080/nc/view/b27e5a47-2d11-4e1f-916c-dcef7c364a22
  - `html`

