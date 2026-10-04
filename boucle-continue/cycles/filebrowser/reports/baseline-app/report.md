# Audit accessibilité — 2026-10-04

**11 règle(s) violée(s), 145 occurrence(s), 13/13 scénario(s) audité(s), 0 erreur(s), 13 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `4c3d0d8b658c`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-attr?application=axeAPI

- http://localhost:8082/files
  - `div[data-dir="true"]`
  - `div[data-dir="false"]`
- http://localhost:8082/files/docs/
  - `div[draggable="true"]`
- http://localhost:8082/files [state:info-panel]
  - `div[data-dir="true"]`
  - `div[data-dir="false"]`
- http://localhost:8082/files [state:multiple-select]
  - `div[data-dir="true"]`
  - `div[data-dir="false"]`
- http://localhost:8082/files [state:mobile-drawer]
  - `div[data-dir="true"]`
  - `div[data-dir="false"]`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:8082/settings/profile
  - `input[name="hideDotfiles"]`
  - `input[name="singleClick"]`
  - `input[name="redirectAfterCopyMove"]`
  - `input[name="dateFormat"]`
- http://localhost:8082/settings/global
  - `p:nth-child(1) > input[type="checkbox"]`
  - `p:nth-child(2) > input[type="checkbox"]`
  - `.card-content > p:nth-child(3) > input[type="checkbox"]`
  - `p:nth-child(4) > .input.input--block[type="text"]`
  - `input[min="1"]`
  - `#branding-links`
  - `#branding-used-disk`
  - `input[min="0"]`
  - `div > div > p:nth-child(3) > input[type="checkbox"]`
  - `p:nth-child(4) > input[type="checkbox"]`
  - … +5 autres
- http://localhost:8082/settings/users/1
  - `.card-content > div > p:nth-child(5) > input[type="checkbox"]`
  - `p:nth-child(3) > input[type="checkbox"]`
  - `p:nth-child(4) > input[type="checkbox"]`
  - `div:nth-child(6) > p:nth-child(5) > input[type="checkbox"]`
  - `p:nth-child(6) > input[type="checkbox"]`
  - `p:nth-child(7) > input[type="checkbox"]`
  - `p:nth-child(8) > input[type="checkbox"]`
  - `p:nth-child(9) > input[type="checkbox"]`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/select-name?application=axeAPI

- http://localhost:8082/settings/profile
  - `select[name="selectLanguage"]`
  - `#aceTheme`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:8082/settings/global
  - `#minimumPasswordLength > .vue-number-input__button--minus.vue-number-input__button[type="button"]`
  - `#minimumPasswordLength > .vue-number-input__button--plus.vue-number-input__button[type="button"]`
  - `#tus-retryCount > .vue-number-input__button--minus.vue-number-input__button[type="button"]`
  - `#tus-retryCount > .vue-number-input__button--plus.vue-number-input__button[type="button"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8082/files
  - `.credits:nth-child(6)`
  - `a[rel="noopener noreferrer"]`
  - `span:nth-child(1) > span`
  - `span:nth-child(2) > a`
- http://localhost:8082/files/docs/
  - `.credits:nth-child(6)`
  - `a[rel="noopener noreferrer"]`
  - `span:nth-child(1) > span`
  - `.credits:nth-child(7) > span:nth-child(2) > a`
- http://localhost:8082/settings/profile
  - `span:nth-child(1) > a[rel="noopener noreferrer"][target="_blank"]`
  - `span:nth-child(1) > span`
  - `span:nth-child(2) > a`
  - `input[name="submitProfile"]`
  - `input[name="submitPassword"]`
- http://localhost:8082/settings/shares
  - `span:nth-child(1) > a[rel="noopener noreferrer"][target="_blank"]`
  - `span:nth-child(1) > span`
  - `span:nth-child(2) > a`
- http://localhost:8082/settings/global
  - `span:nth-child(1) > a[rel="noopener noreferrer"][target="_blank"]`
  - `span:nth-child(1) > span`
  - `span:nth-child(2) > a`
  - `button[default="false"]`
  - `.link`
  - `.column:nth-child(1) > form > .card-action > .button--flat[type="submit"][value="Update"]`
  - `.column:nth-child(2) > form > .card-action > .button--flat[type="submit"][value="Update"]`
- http://localhost:8082/settings/users
  - `span:nth-child(1) > a[rel="noopener noreferrer"][target="_blank"]`
  - `span:nth-child(1) > span`
  - `span:nth-child(2) > a`
  - `.button`
- http://localhost:8082/settings/users/1
  - `span:nth-child(1) > a[rel="noopener noreferrer"][target="_blank"]`
  - `span:nth-child(1) > span`
  - `span:nth-child(2) > a`
  - `button[default="false"]`
  - `input[type="submit"]`
- http://localhost:8082/files [state:info-panel]
  - `.credits:nth-child(6)`
  - `a[rel="noopener noreferrer"]`
  - `span:nth-child(1) > span`
  - `span:nth-child(2) > a`
  - `#focus-prompt`
- http://localhost:8082/files [state:multiple-select]
  - `.credits:nth-child(6)`
  - `a[rel="noopener noreferrer"]`
  - `span:nth-child(1) > span`
  - `span:nth-child(2) > a`
  - `#multiple-selection > p`
- http://localhost:8082/files [state:mobile-drawer]
  - `nav > button:nth-child(1) > span`
  - `button[aria-label="My files"] > span`
  - `button[aria-label="New folder"] > span`
  - `button[aria-label="New file"] > span`
  - `button[aria-label="Settings"] > span`
  - `#logout > span`
  - `.credits:nth-child(6)`
  - `a[rel="noopener noreferrer"]`
  - `span:nth-child(1) > span`
  - `span:nth-child(2) > a`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.13/list?application=axeAPI

- http://localhost:8082/settings/profile
  - `ul`
- http://localhost:8082/settings/shares
  - `ul`
- http://localhost:8082/settings/global
  - `ul`
- http://localhost:8082/settings/users
  - `ul`
- http://localhost:8082/settings/users/1
  - `ul`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.13/listitem?application=axeAPI

- http://localhost:8082/settings/profile
  - `.active`
  - `a[href$="shares"] > li`
  - `a[href$="global"] > li`
  - `a[href$="users"] > li`
- http://localhost:8082/settings/shares
  - `a[href$="profile"] > li`
  - `.active`
  - `a[href$="global"] > li`
  - `a[href$="users"] > li`
- http://localhost:8082/settings/global
  - `a[href$="profile"] > li`
  - `a[href$="shares"] > li`
  - `.active`
  - `a[href$="users"] > li`
- http://localhost:8082/settings/users
  - `a[href$="profile"] > li`
  - `a[href$="shares"] > li`
  - `a[href$="global"] > li`
  - `.active`
- http://localhost:8082/settings/users/1
  - `a[href$="profile"] > li`
  - `a[href$="shares"] > li`
  - `a[href$="global"] > li`
  - `.active`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8082/files
  - `h1`
- http://localhost:8082/files/docs/
  - `h1`
- http://localhost:8082/settings/profile
  - `h1`
- http://localhost:8082/settings/shares
  - `h1`
- http://localhost:8082/settings/global
  - `h1`
- http://localhost:8082/settings/users
  - `h1`
- http://localhost:8082/settings/users/1
  - `h1`
- http://localhost:8082/403
  - `h1`
  - `h2`
- http://localhost:8082/404
  - `h1`
  - `h2`
- http://localhost:8082/500
  - `h1`
  - `h2`
- http://localhost:8082/files [state:info-panel]
  - `h1`
  - `.card-title`
  - `.card-content`
- http://localhost:8082/files [state:multiple-select]
  - `h1`
- http://localhost:8082/files [state:mobile-drawer]
  - `h1`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://localhost:8082/files
  - `h3`
- http://localhost:8082/files/docs/
  - `h3`
- http://localhost:8082/files [state:info-panel]
  - `h3`
- http://localhost:8082/files [state:multiple-select]
  - `h3`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:8082/403
  - `html`
- http://localhost:8082/404
  - `html`
- http://localhost:8082/500
  - `html`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://localhost:8082/settings/users
  - `th:nth-child(4)`

## Résultats incomplets à revoir (13)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8082/settings/profile
  - `.active`
- http://localhost:8082/settings/shares
  - `.active`
- http://localhost:8082/settings/global
  - `.active`
- http://localhost:8082/settings/users
  - `.active`
- http://localhost:8082/settings/users/1
  - `.active`
- http://localhost:8082/403
  - `h2 > span`
- http://localhost:8082/404
  - `h2 > span`
- http://localhost:8082/500
  - `h2 > span`
- http://localhost:8082/files [state:mobile-drawer]
  - `button[aria-label="Switch view"] > span`
  - `#dropdown > button[aria-label="Download"][title="Download"] > span`
  - `#upload-button > span`
  - `#dropdown > button[aria-label="Info"][title="Info"] > span`
  - `button[aria-label="Select multiple"] > span`

