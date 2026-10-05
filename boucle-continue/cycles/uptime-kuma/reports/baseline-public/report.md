# Audit accessibilité — 2026-10-05

**5 règle(s) violée(s), 15 occurrence(s), 2/2 scénario(s) audité(s), 0 erreur(s), 0 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `a98146c73551`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:3001/dashboard
  - `button`
- http://localhost:3001/status/demo
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(1) > .row[data-v-d323db95=""] > .col-9.small-padding.col-xl-6 > .info[data-v-d323db95=""] > .badge.rounded-pill.bg-primary`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(1) > .row[data-v-d323db95=""] > .col-3.col-xl-6[data-v-d323db95=""] > .wrap[data-v-add91a45=""][data-v-d323db95=""] > .justify-content-between.align-items-center.word > div[data-v-add91a45=""]:nth-child(1)`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(1) > .row[data-v-d323db95=""] > .col-3.col-xl-6[data-v-d323db95=""] > .wrap[data-v-add91a45=""][data-v-d323db95=""] > .justify-content-between.align-items-center.word > div[data-v-add91a45=""]:nth-child(2)`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(2) > .row[data-v-d323db95=""] > .col-9.small-padding.col-xl-6 > .info[data-v-d323db95=""] > .badge.rounded-pill.bg-primary`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(2) > .row[data-v-d323db95=""] > .col-3.col-xl-6[data-v-d323db95=""] > .wrap[data-v-add91a45=""][data-v-d323db95=""] > .justify-content-between.align-items-center.word > div[data-v-add91a45=""]:nth-child(1)`
  - `.item[data-testid="monitor"][data-draggable="true"]:nth-child(2) > .row[data-v-d323db95=""] > .col-3.col-xl-6[data-v-d323db95=""] > .wrap[data-v-add91a45=""][data-v-d323db95=""] > .justify-content-between.align-items-center.word > div[data-v-add91a45=""]:nth-child(2)`

## [SERIOUS] object-alt — <object> elements must have alternative text

Ensure <object> elements have alternative text
Référence : https://dequeuniversity.com/rules/axe/4.13/object-alt?application=axeAPI

- http://localhost:3001/dashboard
  - `object`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:3001/dashboard
  - `html`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:3001/status/demo
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:3001/status/demo
  - `h1 > span[data-v-7d4a7f28=""][contenteditable="false"]`
  - `.list`
  - `div[data-testid="description"]`
  - `span[data-testid="group-name"]`
  - `.mt-4`

