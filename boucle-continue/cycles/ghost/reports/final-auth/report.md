# Audit accessibilité — 2026-10-08

**16 règle(s) violée(s), 96 occurrence(s), 21/21 scénario(s) audité(s), 0 erreur(s), 86 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `9426a4e8d062`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `#ember-power-select-trigger-multiple-input-ember26`
  - `#ember-power-select-trigger-multiple-input-ember35`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.14/label?application=axeAPI

- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `#ember-power-select-trigger-multiple-input-ember26`
  - `#ember-power-select-trigger-multiple-input-ember35`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/select-name?application=axeAPI

- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `#ember30`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:6430/ghost/#/analytics
  - `.-mt-px`
- http://localhost:6430/ghost/#/posts
  - `.-mt-px`
- http://localhost:6430/ghost/#/pages
  - `.-mt-px`
- http://localhost:6430/ghost/#/members
  - `.-mt-px`
- http://localhost:6430/ghost/#/tags
  - `.-mt-px`
- http://localhost:6430/ghost/#/tags/accessibilite
  - `.-mt-px`
  - `.group-hover\/dropzone\:text-foreground.text-sm.transition-colors`
- http://localhost:6430/ghost/#/settings/staff
  - `.md\:text-sm`
- http://localhost:6430/ghost/#/settings/advanced
  - `.md\:text-sm`
- http://localhost:6430/ghost/#/my-profile
  - `.md\:text-sm`
- http://localhost:6430/ghost/#/comments
  - `.-mt-px`
- http://localhost:6430/ghost/#/site
  - `.-mt-px`
- http://localhost:6430/ghost/#/analytics [state:admin-user-menu]
  - `.-mt-px`
- http://localhost:6430/ghost/#/analytics [state:admin-appearance-submenu]
  - `.-mt-px`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `.-mt-px`
- http://localhost:6430/ghost/#/analytics [state:admin-global-search]
  - `.-mt-px`
- http://localhost:6430/ghost/#/analytics [state:admin-mobile-nav-390]
  - `.-mt-px`
- http://localhost:6430/ghost/#/posts [state:editor-publish-flow]
  - `.disabled > .gh-publish-setting-trigger`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.14/list?application=axeAPI

- http://localhost:6430/ghost/#/analytics
  - `.p-2.min-w-0[data-sidebar="group"]:nth-child(2) > .text-control.w-full[data-sidebar="group-content"] > ul`
- http://localhost:6430/ghost/#/posts
  - `.p-2.relative[data-sidebar="group"]:nth-child(2) > .text-control.w-full[data-sidebar="group-content"] > ul[data-sidebar="menu"]`
- http://localhost:6430/ghost/#/pages
  - `.p-2.relative[data-sidebar="group"]:nth-child(2) > .text-control.w-full[data-sidebar="group-content"] > ul[data-sidebar="menu"]`
- http://localhost:6430/ghost/#/members
  - `.p-2.flex-col[data-sidebar="group"]:nth-child(2) > .text-control.w-full[data-sidebar="group-content"] > ul`
- http://localhost:6430/ghost/#/tags
  - `.p-2.flex-col[data-sidebar="group"]:nth-child(2) > .text-control.w-full[data-sidebar="group-content"] > ul`
- http://localhost:6430/ghost/#/tags/accessibilite
  - `.p-2.relative[data-sidebar="group"]:nth-child(2) > .text-control.w-full[data-sidebar="group-content"] > ul`
- http://localhost:6430/ghost/#/comments
  - `.p-2.relative[data-sidebar="group"]:nth-child(2) > .text-control.w-full[data-sidebar="group-content"] > ul`
- http://localhost:6430/ghost/#/site
  - `.p-2.flex-col[data-sidebar="group"]:nth-child(2) > .text-control.w-full[data-sidebar="group-content"] > ul`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `.p-2.min-w-0[data-sidebar="group"]:nth-child(2) > .text-control.w-full[data-sidebar="group-content"] > ul`
- http://localhost:6430/ghost/#/analytics [state:admin-mobile-nav-390]
  - `.p-2.min-w-0[data-sidebar="group"]:nth-child(2) > .text-control.w-full[data-sidebar="group-content"] > ul`
- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `#ember-power-select-multiple-options-ember26`
  - `#ember-power-select-multiple-options-ember35`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:6430/ghost/#/analytics
  - `.before\:left-5.before\:z-10.before\:w-px:nth-child(1)`
  - `.before\:left-5.before\:z-10.before\:w-px:nth-child(2)`
  - `.before\:left-5.before\:z-10.before\:w-px:nth-child(3)`
- http://localhost:6430/ghost/#/posts
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(1)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(2)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(3)`
- http://localhost:6430/ghost/#/pages
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(1)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(2)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(3)`
- http://localhost:6430/ghost/#/members
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(1)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(2)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(3)`
- http://localhost:6430/ghost/#/tags
  - `.before\:inset-y-0.before\:left-5.before\:w-px:nth-child(1)`
  - `.before\:inset-y-0.before\:left-5.before\:w-px:nth-child(2)`
  - `.before\:inset-y-0.before\:left-5.before\:w-px:nth-child(3)`
- http://localhost:6430/ghost/#/tags/accessibilite
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(1)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(2)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(3)`
- http://localhost:6430/ghost/#/comments
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(1)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(2)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(3)`
- http://localhost:6430/ghost/#/site
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(1)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(2)`
  - `.before\:absolute.before\:inset-y-0.before\:left-5:nth-child(3)`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `.before\:left-5.before\:z-10.before\:w-px:nth-child(1)`
  - `.before\:left-5.before\:z-10.before\:w-px:nth-child(2)`
  - `.before\:left-5.before\:z-10.before\:w-px:nth-child(3)`
- http://localhost:6430/ghost/#/analytics [state:admin-mobile-nav-390]
  - `.before\:left-5.before\:z-10.before\:w-px:nth-child(1)`
  - `.before\:left-5.before\:z-10.before\:w-px:nth-child(2)`
  - `.before\:left-5.before\:z-10.before\:w-px:nth-child(3)`

## [SERIOUS] aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

Ensure aria-hidden elements are not focusable nor contain focusable elements
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-hidden-focus?application=axeAPI

- http://localhost:6430/ghost/#/analytics
  - `.\[grid-area\:navigation\] > .pointer-events-none.opacity-0.absolute`
- http://localhost:6430/ghost/#/analytics [state:admin-user-menu]
  - `#root`
- http://localhost:6430/ghost/#/analytics [state:admin-appearance-submenu]
  - `#root`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `.\[grid-area\:navigation\] > .pointer-events-none.opacity-0.absolute`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.14/nested-interactive?application=axeAPI

- http://localhost:6430/ghost/#/tags/accessibilite
  - `.group\/dropzone`
- http://localhost:6430/ghost/#/my-profile
  - `.hover\:bg-interactive-hover`
  - `.outline-hidden.border-0[role="button"]`
- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `#ember25`
  - `#tag-input`
  - `#author-list`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-input-field-name?application=axeAPI

- http://localhost:6430/ghost/#/my-profile
  - `div[aria-labelledby=":r8f:"]`
- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `div[data-secondary-instance="false"] > .koenig-lexical.dark[data-koenig-dnd-disabled="false"] > div[data-kg="editor"] > .kg-prose[contenteditable="true"][role="textbox"]`
- http://localhost:6430/ghost/#/posts [state:editor-publish-flow]
  - `div[data-secondary-instance="false"] > .koenig-lexical.dark[data-koenig-dnd-disabled="false"] > div[data-kg="editor"] > .kg-prose[contenteditable="true"][role="textbox"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:6430/ghost/#/analytics [state:admin-mobile-nav-390]
  - `.hover\:text-gray-black`
- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `input[placeholder="YYYY-MM-DD"]`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `#ember12`
- http://localhost:6430/ghost/#/posts [state:editor-publish-flow]
  - `#ember12`

## [SERIOUS] tabindex — Elements should not have tabindex greater than zero

Ensure tabindex attribute values are not greater than 0
Référence : https://dequeuniversity.com/rules/axe/4.14/tabindex?application=axeAPI

- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `#ember16`
- http://localhost:6430/ghost/#/posts [state:editor-publish-flow]
  - `#ember15`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:6430/ghost/#/tags/accessibilite
  - `html`
- http://localhost:6430/ghost/#/site
  - `html`
- http://localhost:6430/ghost/#/analytics [state:admin-user-menu]
  - `html`
- http://localhost:6430/ghost/#/analytics [state:admin-appearance-submenu]
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:6430/ghost/#/analytics
  - `h3`
- http://localhost:6430/ghost/#/comments
  - `h3`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `h3`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:6430/ghost/#/analytics [state:admin-user-menu]
  - `.shade-activitypub.shade.shade-admin:nth-child(16)`
- http://localhost:6430/ghost/#/analytics [state:admin-appearance-submenu]
  - `.shade-activitypub.shade.shade-admin:nth-child(16)`
- http://localhost:6430/ghost/#/posts [state:editor-publish-flow]
  - `.gh-publish-title`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:6430/ghost/#/analytics [state:admin-user-menu]
  - `html`
- http://localhost:6430/ghost/#/analytics [state:admin-appearance-submenu]
  - `html`

## Résultats incomplets à revoir (86)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:6430/ghost/#/analytics
  - `.right-2`
  - `text[text-anchor="start"]`
  - `text[text-anchor="end"]`
- http://localhost:6430/ghost/#/posts
  - `.right-2`
  - `h1`
  - `.hover\:bg-accent`
  - `.border > span`
- http://localhost:6430/ghost/#/pages
  - `.right-2`
  - `h1`
  - `.hover\:bg-accent`
  - `.border > span`
- http://localhost:6430/ghost/#/members
  - `.right-2`
  - `h1`
  - `.font-normal`
  - `button[aria-keyshortcuts="F"]`
  - `.table-fixed > thead > .border-b.data-\[state\=selected\]\:bg-muted.group > th`
  - `.overflow-hidden.w-full > .w-full.relative > .lg\:w-\[var\(--members-table-width\)\].lg\:min-w-\[var\(--members-table-min-width\)\].lg\:table-fixed > thead > .border-b.data-\[state\=selected\]\:bg-muted.group > .z-\[70\].\[--members-sticky-fade-base\:var\(--background\)\].sticky`
  - `.overflow-hidden.w-full > .w-full.relative > .lg\:w-\[var\(--members-table-width\)\].lg\:min-w-\[var\(--members-table-min-width\)\].lg\:table-fixed > thead > .border-b.data-\[state\=selected\]\:bg-muted.group > th:nth-child(2)`
  - `.overflow-hidden.w-full > .w-full.relative > .lg\:w-\[var\(--members-table-width\)\].lg\:min-w-\[var\(--members-table-min-width\)\].lg\:table-fixed > thead > .border-b.data-\[state\=selected\]\:bg-muted.group > th:nth-child(3)`
  - `.overflow-hidden.w-full > .w-full.relative > .lg\:w-\[var\(--members-table-width\)\].lg\:min-w-\[var\(--members-table-min-width\)\].lg\:table-fixed > thead > .border-b.data-\[state\=selected\]\:bg-muted.group > th:nth-child(4)`
  - `.overflow-hidden.w-full > .w-full.relative > .lg\:w-\[var\(--members-table-width\)\].lg\:min-w-\[var\(--members-table-min-width\)\].lg\:table-fixed > thead > .border-b.data-\[state\=selected\]\:bg-muted.group > th:nth-child(5)`
  - … +1 autres
- http://localhost:6430/ghost/#/tags
  - `.right-2`
  - `h1`
- http://localhost:6430/ghost/#/tags/accessibilite
  - `.right-2`
- http://localhost:6430/ghost/#/my-profile
  - `#staff-name`
  - `.\[\&\>\*\]\:w-full.\[\&\>\.sr-only\]\:w-auto[data-orientation="vertical"]:nth-child(4) > .leading-normal.group-has-\[\[data-orientation\=horizontal\]\]\/field\:text-balance.last\:mt-0`
- http://localhost:6430/ghost/#/comments
  - `.right-2`
  - `h1`
  - `.hover\:bg-accent`
- http://localhost:6430/ghost/#/site
  - `.right-2`
- http://localhost:6430/ghost/#/analytics [state:admin-user-menu]
  - `.right-2`
  - `text[text-anchor="start"]`
  - `text[text-anchor="end"]`
- http://localhost:6430/ghost/#/analytics [state:admin-appearance-submenu]
  - `.right-2`
  - `text[text-anchor="start"]`
  - `text[text-anchor="end"]`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `.right-2`
  - `text[text-anchor="start"]`
  - `text[text-anchor="end"]`
- http://localhost:6430/ghost/#/analytics [state:admin-global-search]
  - `.right-2`
  - `text[text-anchor="start"]`
  - `text[text-anchor="end"]`
- http://localhost:6430/ghost/#/analytics [state:admin-mobile-nav-390]
  - `text[text-anchor="start"]`
  - `text[text-anchor="end"]`
  - `.right-2`
- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `.view-post`
  - `.gh-editor-feature-image-add-button > span`
  - `#ember16`
  - `div[data-secondary-instance="false"] > .koenig-lexical.dark[data-koenig-dnd-disabled="false"] > div[data-kg="editor"] > .kg-prose[contenteditable="true"][role="textbox"] > h2 > span[data-lexical-text="true"]`
  - `div[data-secondary-instance="false"] > .koenig-lexical.dark[data-koenig-dnd-disabled="false"] > div[data-kg="editor"] > .kg-prose[contenteditable="true"][role="textbox"] > p:nth-child(2) > span[data-lexical-text="true"]:nth-child(1)`
  - `div[data-secondary-instance="false"] > .koenig-lexical.dark[data-koenig-dnd-disabled="false"] > div[data-kg="editor"] > .kg-prose[contenteditable="true"][role="textbox"] > p:nth-child(2) > a > span[data-lexical-text="true"]`
  - `div[data-secondary-instance="false"] > .koenig-lexical.dark[data-koenig-dnd-disabled="false"] > div[data-kg="editor"] > .kg-prose[contenteditable="true"][role="textbox"] > p:nth-child(2) > span[data-lexical-text="true"]:nth-child(3)`
  - `div[data-secondary-instance="false"] > .koenig-lexical.dark[data-koenig-dnd-disabled="false"] > div[data-kg="editor"] > .kg-prose[contenteditable="true"][role="textbox"] > h3 > span[data-lexical-text="true"]`
  - `div[data-secondary-instance="false"] > .koenig-lexical.dark[data-koenig-dnd-disabled="false"] > div[data-kg="editor"] > .kg-prose[contenteditable="true"][role="textbox"] > ul > li[value="1"] > span[data-lexical-text="true"]`
  - `div[data-secondary-instance="false"] > .koenig-lexical.dark[data-koenig-dnd-disabled="false"] > div[data-kg="editor"] > .kg-prose[contenteditable="true"][role="textbox"] > ul > li[value="2"] > span[data-lexical-text="true"]`
  - … +8 autres
- http://localhost:6430/ghost/#/posts [state:editor-publish-flow]
  - `.gh-editor-feature-image-add-button > span`

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:6430/ghost/#/pages
  - `.border-b.hover\:bg-table-row-hover[data-testid="posts-list-item"]:nth-child(1) > .pr-4.gap-3.flex-row > .max-\[1200px\]\:hidden.py-4.gap-3 > .gap-3.flex-row[data-state="closed"] > .min-w-16[aria-label="Members: 0"][title="Members"]`
  - `.border-b.hover\:bg-table-row-hover[data-testid="posts-list-item"]:nth-child(2) > .pr-4.gap-3.flex-row > .max-\[1200px\]\:hidden.py-4.gap-3 > .gap-3.flex-row[data-state="closed"] > .min-w-16[aria-label="Members: 0"][title="Members"]`

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://localhost:6430/ghost/#/members
  - `.table-fixed`
- http://localhost:6430/ghost/#/tags
  - `table`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:6430/ghost/#/my-profile
  - `div[aria-labelledby=":r8f:"]`
- http://localhost:6430/ghost/#/analytics [state:admin-appearance-submenu]
  - `#radix-\:rn\:`
- http://localhost:6430/ghost/#/analytics [state:admin-mobile-nav-390]
  - `#\:r0\:`

### frame-tested — Frames should be tested with axe-core

- http://localhost:6430/ghost/#/site
  - `iframe`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:6430/ghost/#/analytics [state:admin-user-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(17)`
- http://localhost:6430/ghost/#/analytics [state:admin-appearance-submenu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(17)`
- http://localhost:6430/ghost/#/analytics [state:admin-global-search]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `#root`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(17)`
- http://localhost:6430/ghost/#/analytics [state:admin-mobile-nav-390]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `#root`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(17)`

### bypass — Page must have means to bypass repeated blocks

- http://localhost:6430/ghost/#/analytics [state:admin-user-menu]
  - `html`
- http://localhost:6430/ghost/#/analytics [state:admin-appearance-submenu]
  - `html`
- http://localhost:6430/ghost/#/analytics [state:admin-mobile-nav-390]
  - `html`

