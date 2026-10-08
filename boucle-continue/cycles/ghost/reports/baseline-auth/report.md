# Audit accessibilité — 2026-10-08

**24 règle(s) violée(s), 297 occurrence(s), 21/21 scénario(s) audité(s), 0 erreur(s), 86 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `9426a4e8d062`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.14/image-alt?application=axeAPI

- http://localhost:6430/ghost/#/settings
  - `.h-full.rounded-b-xl`
  - `.size-6`
  - `.w-5`
  - `.dark\:opacity-90`
  - `.w-8`
  - `.sm\:-mt-5 > .size-full`
  - `.-top-6`
- http://localhost:6430/ghost/#/settings/general
  - `.h-full.rounded-b-xl`
  - `.size-6`
  - `.w-5`
  - `.dark\:opacity-90`
  - `.w-8`
  - `.sm\:-mt-5 > .size-full`
  - `.-top-6`
- http://localhost:6430/ghost/#/settings/site
  - `.h-full.rounded-b-xl`
  - `.size-6`
  - `.w-5`
  - `.dark\:opacity-90`
  - `.w-8`
  - `.sm\:-mt-5 > .size-full`
  - `.-top-6`
- http://localhost:6430/ghost/#/settings/staff
  - `.h-full.rounded-b-xl`
  - `.size-6`
  - `.w-5`
  - `.dark\:opacity-90`
  - `.w-8`
  - `.sm\:-mt-5 > .size-full`
  - `.-top-6`
- http://localhost:6430/ghost/#/settings/advanced
  - `.h-full.rounded-b-xl`
  - `.size-6`
  - `.w-5`
  - `.dark\:opacity-90`
  - `.w-8`
  - `.sm\:-mt-5 > .size-full`
  - `.-top-6`
- http://localhost:6430/ghost/#/my-profile
  - `.h-full.rounded-b-xl`
  - `.size-6`
  - `.w-5`
  - `.dark\:opacity-90`
  - `.w-8`
  - `.sm\:-mt-5 > .size-full`
  - `.-top-6`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.14/label?application=axeAPI

- http://localhost:6430/ghost/#/my-profile
  - `#avatar`
  - `#cover-image`
- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `#ember-power-select-trigger-multiple-input-ember26`
  - `#ember-power-select-trigger-multiple-input-ember35`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `.gh-editor-feature-image-unsplash`
- http://localhost:6430/ghost/#/posts [state:editor-publish-flow]
  - `.gh-editor-feature-image-unsplash`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

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
  - `kbd`
  - `.-mt-px`
- http://localhost:6430/ghost/#/posts
  - `kbd`
  - `.-mt-px`
- http://localhost:6430/ghost/#/pages
  - `kbd`
  - `.-mt-px`
- http://localhost:6430/ghost/#/members
  - `kbd`
  - `.-mt-px`
- http://localhost:6430/ghost/#/tags
  - `kbd`
  - `.-mt-px`
- http://localhost:6430/ghost/#/tags/accessibilite
  - `kbd`
  - `.-mt-px`
  - `.group-hover\/dropzone\:text-foreground.text-sm.transition-colors`
- http://localhost:6430/ghost/#/settings/staff
  - `.md\:text-sm`
- http://localhost:6430/ghost/#/settings/advanced
  - `.md\:text-sm`
- http://localhost:6430/ghost/#/my-profile
  - `.md\:text-sm`
- http://localhost:6430/ghost/#/comments
  - `kbd`
  - `.-mt-px`
- http://localhost:6430/ghost/#/site
  - `kbd`
  - `.-mt-px`
- http://localhost:6430/ghost/#/analytics [state:admin-user-menu]
  - `kbd`
  - `.-mt-px`
- http://localhost:6430/ghost/#/analytics [state:admin-appearance-submenu]
  - `kbd`
  - `.-mt-px`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `kbd`
  - `.-mt-px`
- http://localhost:6430/ghost/#/analytics [state:admin-global-search]
  - `kbd`
  - `.-mt-px`
- http://localhost:6430/ghost/#/analytics [state:admin-mobile-nav-390]
  - `kbd`
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

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:6430/ghost/#/analytics
  - `#radix-\:r1\:`
- http://localhost:6430/ghost/#/posts
  - `#radix-\:r1\:`
- http://localhost:6430/ghost/#/pages
  - `#radix-\:r1\:`
- http://localhost:6430/ghost/#/members
  - `#radix-\:r1\:`
- http://localhost:6430/ghost/#/tags
  - `#radix-\:r1\:`
- http://localhost:6430/ghost/#/tags/accessibilite
  - `#radix-\:r1\:`
- http://localhost:6430/ghost/#/comments
  - `#radix-\:r9a\:`
- http://localhost:6430/ghost/#/site
  - `#radix-\:r9a\:`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `#radix-\:r1\:`
- http://localhost:6430/ghost/#/analytics [state:admin-mobile-nav-390]
  - `#radix-\:rm\:`

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

## [SERIOUS] aria-command-name — ARIA commands must have an accessible name

Ensure every ARIA button, link and menuitem has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-command-name?application=axeAPI

- http://localhost:6430/ghost/#/my-profile
  - `.hover\:bg-interactive-hover`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.14/meta-viewport?application=axeAPI

- http://localhost:6430/ghost/#/analytics
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/posts
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/pages
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/members
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/tags
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/tags/accessibilite
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/settings
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/settings/general
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/settings/site
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/settings/staff
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/settings/advanced
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/my-profile
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/comments
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/site
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/analytics [state:admin-user-menu]
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/analytics [state:admin-appearance-submenu]
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/analytics [state:admin-global-search]
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/analytics [state:admin-mobile-nav-390]
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `meta[name="viewport"]`
- http://localhost:6430/ghost/#/posts [state:editor-publish-flow]
  - `meta[name="viewport"]`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-main-is-top-level?application=axeAPI

- http://localhost:6430/ghost/#/analytics
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/posts
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/pages
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/members
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/tags
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/tags/accessibilite
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/settings
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/settings/general
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/settings/site
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/settings/staff
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/settings/advanced
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/my-profile
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/comments
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/site
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `.focus\:outline-hidden`
- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `.focus\:outline-hidden`
  - `.gh-main`
- http://localhost:6430/ghost/#/posts [state:editor-publish-flow]
  - `.focus\:outline-hidden`
  - `.gh-main`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://localhost:6430/ghost/#/analytics
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/posts
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/pages
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/members
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/tags
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/tags/accessibilite
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/settings
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/settings/general
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/settings/site
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/settings/staff
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/settings/advanced
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/my-profile
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/comments
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/site
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `.h-full`
- http://localhost:6430/ghost/#/posts [state:editor-publish-flow]
  - `.h-full`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:6430/ghost/#/analytics
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/posts
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/pages
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/members
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/tags
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/tags/accessibilite
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/settings
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/settings/general
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/settings/site
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/settings/staff
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/settings/advanced
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/my-profile
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/comments
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/site
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `.gh-alerts`
  - `.md\:peer-data-\[variant\=inset\]\:m-2`
- http://localhost:6430/ghost/#/posts [state:editor-post-settings]
  - `.gh-alerts`
  - `.h-full`
- http://localhost:6430/ghost/#/posts [state:editor-publish-flow]
  - `.gh-alerts`
  - `.h-full`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:6430/ghost/#/analytics
  - `h3`
- http://localhost:6430/ghost/#/posts
  - `.border-b.hover\:bg-table-row-hover[data-testid="posts-list-item"]:nth-child(1) > .pr-4.gap-3.flex-row > .pl-4.items-start[data-testid="post-list-item-link"] > .items-stretch.flex-1.gap-1 > .gap-1.flex-row.flex-nowrap > h3`
- http://localhost:6430/ghost/#/pages
  - `.border-b.hover\:bg-table-row-hover[data-testid="posts-list-item"]:nth-child(1) > .pr-4.gap-3.flex-row > .pl-4.no-underline[data-testid="post-list-item-link"] > .items-stretch.flex-1.gap-1 > .gap-1.flex-row.flex-nowrap > h3`
- http://localhost:6430/ghost/#/members
  - `.group\/card.rounded-xl.border:nth-child(1) > .gap-6.items-center.flex > .leading-tight.flex-col.flex > h4`
- http://localhost:6430/ghost/#/settings
  - `div[data-testid="title-and-description"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="design"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="access"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="enable-newsletters"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="network"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="integrations"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
- http://localhost:6430/ghost/#/settings/general
  - `div[data-testid="title-and-description"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="design"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="access"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="enable-newsletters"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="network"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="integrations"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
- http://localhost:6430/ghost/#/settings/site
  - `div[data-testid="title-and-description"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="design"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="access"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="enable-newsletters"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="network"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="integrations"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
- http://localhost:6430/ghost/#/settings/staff
  - `div[data-testid="title-and-description"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="design"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="access"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="enable-newsletters"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="network"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="integrations"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
- http://localhost:6430/ghost/#/settings/advanced
  - `div[data-testid="title-and-description"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="design"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="access"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="enable-newsletters"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="network"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="integrations"] > .items-start.flex-nowrap.gap-5 > .gap-1.justify-start.items-stretch > h5`
- http://localhost:6430/ghost/#/my-profile
  - `div[data-testid="title-and-description"] > .items-start.gap-5.flex-nowrap > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="design"] > .items-start.gap-5.flex-nowrap > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="access"] > .items-start.gap-5.flex-nowrap > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="enable-newsletters"] > .items-start.gap-5.flex-nowrap > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="network"] > .items-start.gap-5.flex-nowrap > .gap-1.justify-start.items-stretch > h5`
  - `div[data-testid="integrations"] > .items-start.gap-5.flex-nowrap > .gap-1.justify-start.items-stretch > h5`
  - `div:nth-child(8) > .mb-2`
- http://localhost:6430/ghost/#/comments
  - `h3`
- http://localhost:6430/ghost/#/analytics [state:admin-dark-mode]
  - `h3`

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

