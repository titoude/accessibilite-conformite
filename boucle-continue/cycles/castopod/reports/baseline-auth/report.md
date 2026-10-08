# Audit accessibilité — 2026-10-08

**11 règle(s) violée(s), 313 occurrence(s), 25/25 scénario(s) audité(s), 0 erreur(s), 141 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `7de29cc02f2f`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.14/image-alt?application=axeAPI

- http://localhost:9150/cp-admin
  - `.bottom-0`
- http://localhost:9150/cp-admin/settings
  - `.bottom-0`
- http://localhost:9150/cp-admin/settings/theme
  - `.bottom-0`
- http://localhost:9150/cp-admin/persons
  - `.w-4`
- http://localhost:9150/cp-admin/persons/new
  - `.bottom-0`
- http://localhost:9150/cp-admin/persons/1
  - `.bottom-0`
- http://localhost:9150/cp-admin/persons/1/edit
  - `.bottom-0`
- http://localhost:9150/cp-admin/podcasts
  - `.w-4`
- http://localhost:9150/cp-admin/podcasts/new
  - `.bottom-0`
- http://localhost:9150/cp-admin/podcasts/1
  - `.w-4`
- http://localhost:9150/cp-admin/podcasts/1/edit
  - `.bottom-0`
- http://localhost:9150/cp-admin/podcasts/1/persons
  - `.bottom-0`
- http://localhost:9150/cp-admin/podcasts/1/analytics
  - `.bottom-0`
- http://localhost:9150/cp-admin/podcasts/1/episodes
  - `.bottom-0`
- http://localhost:9150/cp-admin/podcasts/1/episodes/new
  - `.bottom-0`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1
  - `.bottom-0`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1/edit
  - `.bottom-0`
- http://localhost:9150/cp-admin/pages
  - `.bottom-0`
- http://localhost:9150/cp-admin/pages/new
  - `.bottom-0`
- http://localhost:9150/cp-admin/pages/1/edit
  - `.bottom-0`
- http://localhost:9150/cp-admin/fediverse/blocked-actors
  - `.bottom-0`
- http://localhost:9150/cp-admin/my-account
  - `.bottom-0`
- http://localhost:9150/cp-admin [state:nav-account-menu]
  - `.bottom-0`
  - `.flex-1.text-sm.items-center > .w-6.mr-2`
- http://localhost:9150/cp-admin [state:nav-notifications-menu]
  - `.bottom-0`
  - `.relative > .w-6.mr-2`
- http://localhost:9150/cp-admin [state:admin-mobile-390]
  - `.bottom-0`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:9150/cp-admin/podcasts/1/episodes
  - `#more-dropdown-4`
  - `#more-dropdown-3`
  - `#more-dropdown-2`
  - `#more-dropdown-1`
- http://localhost:9150/cp-admin [state:nav-notifications-menu]
  - `#notifications-dropdown`
- http://localhost:9150/cp-admin [state:admin-mobile-390]
  - `#my-account-dropdown`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:9150/cp-admin
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/settings
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/settings/theme
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/persons
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/persons/new
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/persons/1
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/persons/1/edit
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/podcasts
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/podcasts/new
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/podcasts/1
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/podcasts/1/edit
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/podcasts/1/persons
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/podcasts/1/analytics
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/podcasts/1/episodes
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/podcasts/1/episodes/new
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1/edit
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/pages
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/pages/new
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/pages/1/edit
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/fediverse/blocked-actors
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin/my-account
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin [state:nav-account-menu]
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin [state:nav-notifications-menu]
  - `.border-r.border-navigation[href$="cp-admin"]`
- http://localhost:9150/cp-admin [state:admin-mobile-390]
  - `.border-r.border-navigation[href$="cp-admin"]`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.14/nested-interactive?application=axeAPI

- http://localhost:9150/cp-admin
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
  - `g[aria-labelledby="id-148-title"]`
  - `g[aria-labelledby="id-297-title"]`
- http://localhost:9150/cp-admin/settings
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/settings/theme
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/persons
  - `details:nth-child(2) > summary`
  - `details[open="open"] > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/persons/new
  - `details:nth-child(2) > summary`
  - `details[open="open"] > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/persons/1
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/persons/1/edit
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/podcasts
  - `details[open="open"] > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/podcasts/new
  - `details[open="open"] > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/podcasts/1
  - `details:nth-child(2) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/podcasts/1/edit
  - `details:nth-child(2) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/podcasts/1/persons
  - `details:nth-child(2) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/podcasts/1/analytics
  - `details:nth-child(2) > summary`
  - `details:nth-child(6) > summary`
  - `g[aria-labelledby="id-148-title"]`
  - `g[aria-labelledby="id-297-title"]`
  - `g[aria-labelledby="id-446-title"]`
- http://localhost:9150/cp-admin/podcasts/1/episodes
  - `details[open="open"] > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/podcasts/1/episodes/new
  - `details[open="open"] > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1
  - `details:nth-child(2) > summary`
  - `g[aria-labelledby="id-148-title"]`
  - `g[aria-labelledby="id-297-title"]`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1/edit
  - `details:nth-child(2) > summary`
- http://localhost:9150/cp-admin/pages
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details[open="open"] > summary`
- http://localhost:9150/cp-admin/pages/new
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details[open="open"] > summary`
- http://localhost:9150/cp-admin/pages/1/edit
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/fediverse/blocked-actors
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin/my-account
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
- http://localhost:9150/cp-admin [state:nav-account-menu]
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
  - `g[aria-labelledby="id-148-title"]`
  - `g[aria-labelledby="id-297-title"]`
- http://localhost:9150/cp-admin [state:nav-notifications-menu]
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
  - `g[aria-labelledby="id-148-title"]`
  - `g[aria-labelledby="id-297-title"]`
- http://localhost:9150/cp-admin [state:admin-mobile-390]
  - `details:nth-child(2) > summary`
  - `details:nth-child(3) > summary`
  - `details:nth-child(5) > summary`
  - `details:nth-child(6) > summary`
  - `g[aria-labelledby="id-148-title"]`
  - `g[aria-labelledby="id-297-title"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:9150/cp-admin
  - `.font-normal.bg-navigation-active[href$="podcasts"]`
  - `.font-normal.bg-navigation-active[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.font-normal.bg-navigation-active[href$="pages"]`
- http://localhost:9150/cp-admin/settings
  - `.font-normal.bg-navigation-active[href$="podcasts"]`
  - `.font-normal.bg-navigation-active[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.font-normal.bg-navigation-active[href$="pages"]`
- http://localhost:9150/cp-admin/settings/theme
  - `.font-normal.ml-2[href$="podcasts"]`
  - `.font-normal.ml-2[href$="persons"]`
  - `.font-normal.ml-2[href$="users"]`
  - `.font-normal.ml-2[href$="pages"]`
- http://localhost:9150/cp-admin/persons
  - `.font-normal.bg-navigation-active[href$="podcasts"]`
  - `.bg-navigation.font-normal[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.font-normal.bg-navigation-active[href$="pages"]`
- http://localhost:9150/cp-admin/persons/new
  - `.bg-navigation-active.ml-2[href$="podcasts"]`
  - `.bg-navigation.ml-2[href$="persons"]`
  - `.bg-navigation-active.ml-2[href$="users"]`
  - `.bg-navigation-active.ml-2[href$="pages"]`
- http://localhost:9150/cp-admin/persons/1
  - `.font-normal.bg-navigation-active[href$="podcasts"]`
  - `.font-normal.bg-navigation-active[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.font-normal.bg-navigation-active[href$="pages"]`
- http://localhost:9150/cp-admin/persons/1/edit
  - `.bg-navigation-active.ml-2[href$="podcasts"]`
  - `.bg-navigation-active.ml-2[href$="persons"]`
  - `.bg-navigation-active.ml-2[href$="users"]`
  - `.bg-navigation-active.ml-2[href$="pages"]`
- http://localhost:9150/cp-admin/podcasts
  - `.bg-navigation.font-normal[href$="podcasts"]`
  - `.font-normal.bg-navigation-active[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.font-normal.bg-navigation-active[href$="pages"]`
- http://localhost:9150/cp-admin/podcasts/new
  - `.bg-navigation.text-xs[href$="podcasts"]`
  - `.bg-navigation-active.text-xs[href$="persons"]`
  - `.bg-navigation-active.text-xs[href$="users"]`
  - `.bg-navigation-active.text-xs[href$="pages"]`
- http://localhost:9150/cp-admin/podcasts/1
  - `.font-normal.bg-navigation-active[href$="episodes"]`
  - `details:nth-child(6) > summary > .mr-auto > .font-normal.bg-navigation-active.px-2`
- http://localhost:9150/cp-admin/podcasts/1/edit
  - `.bg-navigation-active.text-xs[href$="episodes"]`
  - `details:nth-child(6) > summary > .mr-auto.items-center.inline-flex > .bg-navigation-active.text-xs.ml-2`
- http://localhost:9150/cp-admin/podcasts/1/persons
  - `.ml-2.font-normal[href$="episodes"]`
  - `details:nth-child(6) > summary > .mr-auto.items-center.inline-flex > .ml-2.font-normal.bg-navigation-active`
- http://localhost:9150/cp-admin/podcasts/1/analytics
  - `.font-normal.ml-2[href$="episodes"]`
  - `details:nth-child(6) > summary > .mr-auto.items-center > .font-normal.ml-2.bg-navigation-active`
- http://localhost:9150/cp-admin/podcasts/1/episodes
  - `.font-normal.bg-navigation[href$="episodes"]`
  - `.font-normal.bg-navigation-active.px-2`
- http://localhost:9150/cp-admin/podcasts/1/episodes/new
  - `.bg-navigation.ml-2[href$="episodes"]`
  - `.bg-navigation-active.ml-2.rounded-full`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1
  - `.font-normal`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1/edit
  - `.bg-navigation-active.ml-2.rounded-full`
- http://localhost:9150/cp-admin/pages
  - `.font-normal.bg-navigation-active[href$="podcasts"]`
  - `.font-normal.bg-navigation-active[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.bg-navigation.font-normal[href$="pages"]`
- http://localhost:9150/cp-admin/pages/new
  - `.font-normal.bg-navigation-active[href$="podcasts"]`
  - `.font-normal.bg-navigation-active[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.bg-navigation.font-normal[href$="pages"]`
- http://localhost:9150/cp-admin/pages/1/edit
  - `.font-normal.bg-navigation-active[href$="podcasts"]`
  - `.font-normal.bg-navigation-active[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.font-normal.bg-navigation-active[href$="pages"]`
- http://localhost:9150/cp-admin/fediverse/blocked-actors
  - `.font-normal.ml-2[href$="podcasts"]`
  - `.font-normal.ml-2[href$="persons"]`
  - `.font-normal.ml-2[href$="users"]`
  - `.font-normal.ml-2[href$="pages"]`
- http://localhost:9150/cp-admin/my-account
  - `.font-normal.bg-navigation-active[href$="podcasts"]`
  - `.font-normal.bg-navigation-active[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.font-normal.bg-navigation-active[href$="pages"]`
- http://localhost:9150/cp-admin [state:nav-account-menu]
  - `.font-normal.bg-navigation-active[href$="podcasts"]`
  - `.font-normal.bg-navigation-active[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.font-normal.bg-navigation-active[href$="pages"]`
- http://localhost:9150/cp-admin [state:nav-notifications-menu]
  - `.font-normal.bg-navigation-active[href$="podcasts"]`
  - `.font-normal.bg-navigation-active[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.font-normal.bg-navigation-active[href$="pages"]`
- http://localhost:9150/cp-admin [state:admin-mobile-390]
  - `.font-normal.bg-navigation-active[href$="podcasts"]`
  - `.font-normal.bg-navigation-active[href$="persons"]`
  - `.font-normal.bg-navigation-active[href$="users"]`
  - `.font-normal.bg-navigation-active[href$="pages"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9150/cp-admin/settings
  - `.self-end`
  - `.max-w-xl.gap-y-4:nth-child(2) > fieldset > .w-0.min-w-full.gap-4 > .leading-5.shadow-sm.hover\:bg-accent-hover > span`
  - `.max-w-xl.gap-y-4:nth-child(3) > fieldset > .w-0.min-w-full.gap-4 > .leading-5.shadow-sm.hover\:bg-accent-hover > span`
- http://localhost:9150/cp-admin/settings/theme
  - `.leading-5`
- http://localhost:9150/cp-admin/persons
  - `.leading-5 > span`
- http://localhost:9150/cp-admin/persons/new
  - `.leading-5`
- http://localhost:9150/cp-admin/persons/1
  - `.leading-5 > span`
  - `.no-underline`
- http://localhost:9150/cp-admin/persons/1/edit
  - `.leading-5`
- http://localhost:9150/cp-admin/podcasts
  - `.border-2 > span`
  - `.hover\:bg-accent-hover > span`
- http://localhost:9150/cp-admin/podcasts/new
  - `button[slot="preview"]`
  - `label[for="episodic"]`
  - `label[for="podcast"]`
  - `label[for="undefined"]`
  - `.leading-5`
- http://localhost:9150/cp-admin/podcasts/1
  - `.border-2 > span`
  - `.hover\:bg-accent-hover > span`
- http://localhost:9150/cp-admin/podcasts/1/edit
  - `.hover\:bg-accent-hover`
  - `button[slot="preview"]`
  - `label[for="episodic"]`
  - `label[for="podcast"]`
  - `label[for="clean"]`
- http://localhost:9150/cp-admin/podcasts/1/persons
  - `a[href$="new"] > span`
  - `.self-end`
  - `.text-accent-base`
- http://localhost:9150/cp-admin/podcasts/1/episodes
  - `.hover\:bg-accent-hover > span`
  - `.text-red-600`
  - `span[title="2026-10-07 11:40:14"]`
  - `span[title="2026-10-03 11:40:14"]`
  - `span[title="2026-09-29 11:40:14"]`
- http://localhost:9150/cp-admin/podcasts/1/episodes/new
  - `label[for="full"]`
  - `label[for="undefined"]`
  - `.flex-col.flex:nth-child(1) > .mt-1.w-full > .overflow-hidden.focus-within\:ring-accent.border-contrast > header > .z-20.border-gray-300.flex-wrap > markdown-write-preview > button[slot="preview"][type="button"]`
  - `.flex-col.flex:nth-child(2) > .mt-1.w-full > .overflow-hidden.focus-within\:ring-accent.border-contrast > header > .z-20.border-gray-300.flex-wrap > markdown-write-preview > button[slot="preview"][type="button"]`
  - `label[for="transcript-file-upload-choice"]`
  - `label[for="chapters-file-upload-choice"]`
  - `.leading-5`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1
  - `.px-1`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1/edit
  - `.hover\:bg-accent-hover`
  - `label[for="full"]`
  - `label[for="clean"]`
  - `.flex-col.flex:nth-child(1) > .mt-1.w-full > .overflow-hidden.focus-within\:ring-accent.border-contrast > header > .z-20.border-gray-300.flex-wrap > markdown-write-preview > button[slot="preview"][type="button"]`
  - `.flex-col.flex:nth-child(2) > .mt-1.w-full > .overflow-hidden.focus-within\:ring-accent.border-contrast > header > .z-20.border-gray-300.flex-wrap > markdown-write-preview > button[slot="preview"][type="button"]`
  - `label[for="transcript-file-upload-choice"]`
  - `label[for="chapters-file-upload-choice"]`
- http://localhost:9150/cp-admin/pages
  - `.leading-5 > span`
  - `.border-2`
  - `.bg-blue-500`
- http://localhost:9150/cp-admin/pages/new
  - `button[slot="preview"]`
  - `.leading-5`
- http://localhost:9150/cp-admin/pages/1/edit
  - `button[slot="preview"]`
  - `.leading-5`
- http://localhost:9150/cp-admin/fediverse/blocked-actors
  - `.leading-5`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-input-field-name?application=axeAPI

- http://localhost:9150/cp-admin/podcasts/new
  - `xml-editor,.cm-content`
- http://localhost:9150/cp-admin/podcasts/1/edit
  - `xml-editor,.cm-content`
- http://localhost:9150/cp-admin/podcasts/1/episodes/new
  - `xml-editor,.cm-content`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1/edit
  - `xml-editor,.cm-content`

## [SERIOUS] dlitem — <dt> and <dd> elements must be contained by a <dl>

Ensure <dt> and <dd> elements are contained by a <dl>
Référence : https://dequeuniversity.com/rules/axe/4.14/dlitem?application=axeAPI

- http://localhost:9150/cp-admin/my-account
  - `.py-5.px-4:nth-child(1) > dt`
  - `.py-5.px-4:nth-child(1) > dd`
  - `.py-5.px-4:nth-child(2) > dt`
  - `.py-5.px-4:nth-child(2) > dd`
  - `.py-5.px-4:nth-child(3) > dt`
  - `.py-5.px-4:nth-child(3) > dd`
  - `.py-5.px-4:nth-child(4) > dt`
  - `.max-w-xl`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:9150/cp-admin
  - `#id-22`
- http://localhost:9150/cp-admin/podcasts/1/analytics
  - `#id-22`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1
  - `#id-22`
- http://localhost:9150/cp-admin [state:nav-account-menu]
  - `.overflow-y-auto`
  - `#id-22`
- http://localhost:9150/cp-admin [state:nav-notifications-menu]
  - `.overflow-y-auto`
  - `#id-22`
- http://localhost:9150/cp-admin [state:admin-mobile-390]
  - `#id-22`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9150/cp-admin [state:nav-notifications-menu]
  - `#tooltip0`

## [MINOR] image-redundant-alt — Alternative text of images should not be repeated as text

Ensure image alternative is not repeated as text
Référence : https://dequeuniversity.com/rules/axe/4.14/image-redundant-alt?application=axeAPI

- http://localhost:9150/cp-admin/persons
  - `.object-cover`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1
  - `img[alt="Audit Waves"]`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1/edit
  - `img[alt="Audit Waves"]`

## Résultats incomplets à revoir (141)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:9150/cp-admin
  - `g[aria-labelledby="id-61-title"]`
  - `g[aria-labelledby="id-210-title"]`
- http://localhost:9150/cp-admin/podcasts/1/analytics
  - `g[aria-labelledby="id-61-title"]`
  - `g[aria-labelledby="id-210-title"]`
  - `g[aria-labelledby="id-359-title"]`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1
  - `g[aria-labelledby="id-61-title"]`
  - `g[aria-labelledby="id-210-title"]`
- http://localhost:9150/cp-admin [state:nav-account-menu]
  - `g[aria-labelledby="id-61-title"]`
  - `g[aria-labelledby="id-210-title"]`
- http://localhost:9150/cp-admin [state:nav-notifications-menu]
  - `g[aria-labelledby="id-61-title"]`
  - `g[aria-labelledby="id-210-title"]`
- http://localhost:9150/cp-admin [state:admin-mobile-390]
  - `g[aria-labelledby="id-61-title"]`
  - `g[aria-labelledby="id-210-title"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9150/cp-admin
  - `h1`
  - `g[transform="translate(63,398)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,348.25)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,298.5)"] > g[transform="translate(-49,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,248.75)"] > g[transform="translate(-49,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,199)"][fill="#000000"]:nth-child(8) > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,149.25)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,99.5)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,49.75)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,0)"][fill="#000000"] > g[transform="translate(-53,-10)"] > text[x="0"] > tspan`
  - … +1 autres
- http://localhost:9150/cp-admin/settings
  - `h1`
  - `form[action="/cp-admin/settings/instance"] > fieldset > legend`
  - `.max-w-xl.gap-y-4:nth-child(2) > fieldset > legend`
  - `.max-w-xl.gap-y-4:nth-child(3) > fieldset > legend`
- http://localhost:9150/cp-admin/settings/theme
  - `h1`
  - `legend`
- http://localhost:9150/cp-admin/persons
  - `h1`
  - `h2`
- http://localhost:9150/cp-admin/persons/new
  - `h1`
- http://localhost:9150/cp-admin/persons/1
  - `h1`
- http://localhost:9150/cp-admin/persons/1/edit
  - `h1`
- http://localhost:9150/cp-admin/podcasts
  - `h1`
  - `h2`
- http://localhost:9150/cp-admin/podcasts/new
  - `h1`
  - `.p-8.rounded-xl.items-start:nth-child(2) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(3) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(4) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(5) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(6) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(7) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(8) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(9) > .float-left.z-10.font-bold`
  - `xml-editor,.cm-lineNumbers > .cm-activeLineGutter.cm-gutterElement`
- http://localhost:9150/cp-admin/podcasts/1
  - `h1`
  - `h2`
  - `.text-red-600`
  - `abbr[title="Episode 04"]`
  - `article:nth-child(1) > .justify-end.group.text-white > .z-20.items-start.py-2 > .leading-tight.line-clamp-2`
  - `span[title="2026-10-07 11:40:14"]`
  - `abbr[title="Episode 03"]`
  - `article:nth-child(2) > .justify-end.group.text-white > .z-20.items-start.py-2 > .leading-tight.line-clamp-2`
  - `span[title="2026-10-03 11:40:14"]`
  - `abbr[title="Episode 02"]`
  - … +4 autres
- http://localhost:9150/cp-admin/podcasts/1/edit
  - `h1`
  - `.p-8.rounded-xl:nth-child(1) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl:nth-child(2) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl:nth-child(3) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl:nth-child(4) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl:nth-child(5) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl:nth-child(6) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl:nth-child(7) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl:nth-child(8) > .float-left.z-10.font-bold`
  - `xml-editor,.cm-lineNumbers > .cm-activeLineGutter.cm-gutterElement`
- http://localhost:9150/cp-admin/podcasts/1/persons
  - `h1`
  - `legend`
- http://localhost:9150/cp-admin/podcasts/1/analytics
  - `h1`
- http://localhost:9150/cp-admin/podcasts/1/episodes
  - `h1`
  - `.border-t.hover\:bg-base:nth-child(1) > td:nth-child(1) > .gap-x-2 > .flex-shrink-0 > time`
  - `.border-t.hover\:bg-base:nth-child(2) > td:nth-child(1) > .gap-x-2 > .flex-shrink-0 > time`
  - `.border-t.hover\:bg-base:nth-child(3) > td:nth-child(1) > .gap-x-2 > .flex-shrink-0 > time`
  - `.border-t.hover\:bg-base:nth-child(4) > td:nth-child(1) > .gap-x-2 > .flex-shrink-0 > time`
  - `.block`
- http://localhost:9150/cp-admin/podcasts/1/episodes/new
  - `h1`
  - `.p-8.rounded-xl.border-subtle:nth-child(2) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.border-subtle:nth-child(3) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.border-subtle:nth-child(4) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.border-subtle:nth-child(5) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.border-subtle:nth-child(6) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.border-subtle:nth-child(7) > .float-left.z-10.font-bold`
  - `xml-editor,.cm-lineNumbers > .cm-activeLineGutter.cm-gutterElement`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1
  - `h1`
- http://localhost:9150/cp-admin/podcasts/1/episodes/1/edit
  - `h1`
  - `.p-8.rounded-xl.items-start:nth-child(2) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(3) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(4) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(5) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(6) > .float-left.z-10.font-bold`
  - `.p-8.rounded-xl.items-start:nth-child(7) > .float-left.z-10.font-bold`
  - `xml-editor,.cm-lineNumbers > .cm-activeLineGutter.cm-gutterElement`
- http://localhost:9150/cp-admin/pages
  - `h1`
- http://localhost:9150/cp-admin/pages/new
  - `h1`
- http://localhost:9150/cp-admin/pages/1/edit
  - `h1`
- http://localhost:9150/cp-admin/fediverse/blocked-actors
  - `h1`
- http://localhost:9150/cp-admin/my-account
  - `h1`
- http://localhost:9150/cp-admin [state:nav-account-menu]
  - `h1`
  - `g[transform="translate(63,398)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,348.25)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,298.5)"] > g[transform="translate(-49,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,248.75)"] > g[transform="translate(-49,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,199)"][fill="#000000"]:nth-child(8) > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,149.25)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,99.5)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,49.75)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,0)"][fill="#000000"] > g[transform="translate(-53,-10)"] > text[x="0"] > tspan`
  - … +1 autres
- http://localhost:9150/cp-admin [state:nav-notifications-menu]
  - `h1`
  - `g[transform="translate(63,398)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,348.25)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,298.5)"] > g[transform="translate(-49,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,248.75)"] > g[transform="translate(-49,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,199)"][fill="#000000"]:nth-child(8) > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,149.25)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,99.5)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,49.75)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,0)"][fill="#000000"] > g[transform="translate(-53,-10)"] > text[x="0"] > tspan`
  - … +2 autres
- http://localhost:9150/cp-admin [state:admin-mobile-390]
  - `footer`
  - `h1`
  - `g[transform="translate(63,398)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,348.25)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,298.5)"] > g[transform="translate(-49,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,248.75)"] > g[transform="translate(-49,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,199)"][fill="#000000"]:nth-child(8) > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,149.25)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,99.5)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - `g[transform="translate(63,49.75)"] > g[transform="translate(-50,-10)"] > text[x="0"] > tspan`
  - … +2 autres

### aria-required-children — Certain ARIA roles must contain particular children

- http://localhost:9150/cp-admin/podcasts/new
  - `.choices__list--multiple`
- http://localhost:9150/cp-admin/podcasts/1/edit
  - `.choices__list--multiple`
- http://localhost:9150/cp-admin/podcasts/1/persons
  - `.flex-col.flex:nth-child(1) > .mt-1.w-full > .choices[data-type="select-multiple"][role="combobox"] > .choices__inner > .choices__list--multiple.choices__list[role="listbox"]`
  - `.flex-col.flex:nth-child(2) > .mt-1.w-full > .choices[data-type="select-multiple"][role="combobox"] > .choices__inner > .choices__list--multiple.choices__list[role="listbox"]`

