# Audit accessibilité — 2026-10-07

**19 règle(s) violée(s), 484 occurrence(s), 39/39 scénario(s) audité(s), 0 erreur(s), 145 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `be25a2de9fc8`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-attr?application=axeAPI

- http://localhost:3301/dashboard/bookmarks
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/dashboard/lists
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/dashboard/tags
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/dashboard/archive
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/dashboard/favourites
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/dashboard/highlights
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/dashboard/search
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/dashboard/search?q=accessibilit%C3%A9
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/dashboard/cleanups
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/settings/info
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/settings/import
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/rules
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/feeds
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/settings/broken-links
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/api-keys
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/settings/backups
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/stats
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/assets
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/webhooks
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/settings/ai
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.min-h-10`
- http://localhost:3301/admin/overview
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/admin/users
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/admin/background_jobs
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/admin/admin_tools
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/dashboard/bookmarks [state:edit-bookmark-dialog]
  - `.min-h-10`
- http://localhost:3301/dashboard/lists/u3vj1bynb1l958g65bkc6ka0 [state:list-detail-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/dashboard/tags/z5lou738xzvg1pxynl1lbmlf [state:tag-detail-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.min-h-10`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-modal]
  - `.min-h-10`
- http://localhost:3301/dashboard/bookmarks [state:theme-dark]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3301/dashboard/bookmarks [state:mobile-390]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

- http://localhost:3301/dashboard/bookmarks
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/lists
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/tags
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/archive
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/favourites
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/highlights
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/search
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/search?q=accessibilit%C3%A9
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/cleanups
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/settings/info
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/settings/import
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/settings/rules
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/settings/feeds
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/settings/broken-links
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/settings/api-keys
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/settings/backups
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/settings/stats
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/settings/assets
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/settings/webhooks
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/settings/ai
  - `#radix-_R_dj5tjbH2_`
  - `#radix-_R_cslubst5tjbH2_`
- http://localhost:3301/admin/overview
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/admin/users
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/admin/background_jobs
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/admin/admin_tools
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/bookmarks [state:edit-bookmark-dialog]
  - `#radix-_r_1v_`
- http://localhost:3301/dashboard/lists/u3vj1bynb1l958g65bkc6ka0 [state:list-detail-page]
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/tags/z5lou738xzvg1pxynl1lbmlf [state:tag-detail-page]
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-page]
  - `#radix-_R_dj5tjbH2_`
  - `#radix-_R_1j9av5ubst5tjbH2_`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-modal]
  - `#radix-_r_1b_`
- http://localhost:3301/dashboard/bookmarks [state:theme-dark]
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3301/dashboard/bookmarks [state:mobile-390]
  - `#radix-_R_dj5tjbH2_`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:3301/dashboard/bookmarks
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_9mal5tjb_`
  - `#radix-_R_9qal5tjb_`
  - `#radix-_R_9ual5tjb_`
  - `#radix-_R_bqq9ulubst5tjb_`
  - `#radix-_R_bqr9ulubst5tjb_`
  - `#radix-_R_bqphulubst5tjb_`
  - `#radix-_R_bqqhulubst5tjb_`
  - `#radix-_R_bqppulubst5tjb_`
  - … +1 autres
- http://localhost:3301/dashboard/lists
  - `#radix-_R_4pmmlubst5tjb_`
  - `#radix-_R_4pqmlubst5tjb_`
  - `#radix-_R_4pumlubst5tjb_`
- http://localhost:3301/dashboard/archive
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_9mal5tjb_`
  - `#radix-_R_9qal5tjb_`
  - `#radix-_R_9ual5tjb_`
  - `#radix-_R_5tdhulubst5tjb_`
  - `#radix-_R_5tdpulubst5tjb_`
- http://localhost:3301/dashboard/favourites
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_9mal5tjb_`
  - `#radix-_R_9qal5tjb_`
  - `#radix-_R_9ual5tjb_`
  - `#radix-_R_5tdhulubst5tjb_`
- http://localhost:3301/settings/info
  - `button[aria-controls="radix-_R_2d4lubst5tjb_"]`
  - `button[aria-controls="radix-_R_2l4lubst5tjb_"]`
  - `button[aria-controls="radix-_R_9t4lubst5tjb_"]`
  - `button[aria-controls="radix-_R_at4lubst5tjb_"]`
- http://localhost:3301/settings/import
  - `.border-input`
- http://localhost:3301/settings/backups
  - `.focus\:outline-none`
- http://localhost:3301/settings/ai
  - `#lowercase-hyphens`
  - `#lowercase-spaces`
  - `.focus\:outline-none`
- http://localhost:3301/admin/users
  - `button[aria-controls="radix-_R_9anpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_eqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_mqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_uqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_9inpfkt5tjb_"]`
- http://localhost:3301/dashboard/lists [state:new-list-dialog]
  - `button[aria-controls="radix-_r_5_"]`
  - `.gap-1.items-center > .focus-visible\:ring-0.hover\:text-accent-foreground.inline-flex`
  - `.focus\:outline-none`
- http://localhost:3301/dashboard/lists/u3vj1bynb1l958g65bkc6ka0 [state:list-detail-page]
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_9av5ubst5tjb_`
  - `#radix-_R_2umovav5ubst5tjb_`
  - `#radix-_R_2umsvav5ubst5tjb_`
- http://localhost:3301/dashboard/tags/z5lou738xzvg1pxynl1lbmlf [state:tag-detail-page]
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_9av5ubst5tjb_`
  - `#radix-_R_2umovav5ubst5tjb_`
  - `#radix-_R_2umsvav5ubst5tjb_`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-page]
  - `.right-4`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(1)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(2)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(3)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(4)`
- http://localhost:3301/reader/a94alm01tqdl4f8aq9u2lry1 [state:reader-page]
  - `.gap-2.flex.items-center:nth-child(1) > button`
  - `.gap-2.flex.items-center:nth-child(2) > button:nth-child(1)`
  - `.relative`
  - `button:nth-child(3)`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-modal]
  - `.right-4`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(1)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(2)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(3)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(4)`
- http://localhost:3301/dashboard/bookmarks [state:theme-dark]
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_bqq9ulubst5tjb_`
  - `#radix-_R_bqr9ulubst5tjb_`
  - `#radix-_R_bqphulubst5tjb_`
  - `#radix-_R_bqqhulubst5tjb_`
  - `#radix-_R_bqppulubst5tjb_`
  - `#radix-_R_bqqpulubst5tjb_`
- http://localhost:3301/dashboard/bookmarks [state:mobile-390]
  - `#radix-_r_1u_`
  - `#radix-_r_2d_`
  - `#radix-_r_2p_`
  - `#radix-_r_34_`
  - `#radix-_R_bqq9ulubst5tjb_`
  - `#radix-_r_3f_`
  - `#radix-_r_3q_`
  - `#radix-_R_bqr9ulubst5tjb_`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:3301/dashboard/bookmarks [state:view-options-menu]
  - `#radix-_r_j_`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:3301/dashboard/bookmarks
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `div[data-bookmark-index="2"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="5"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="0"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="3"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `.max-h-96 > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="4"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
- http://localhost:3301/dashboard/lists
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3301/dashboard/tags
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3301/dashboard/archive
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `.h-96 > .p-2.h-full.gap-2 > .justify.text-gray-500.shrink-0 > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `.max-h-96 > .p-2.h-full.gap-2 > .justify.text-gray-500.shrink-0 > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
- http://localhost:3301/dashboard/favourites
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `.px-2`
- http://localhost:3301/dashboard/highlights
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3301/dashboard/search
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3301/dashboard/search?q=accessibilit%C3%A9
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3301/dashboard/cleanups
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3301/settings/info
  - `.w-56`
  - `.size-7`
- http://localhost:3301/settings/import
  - `.w-56`
  - `.size-7`
- http://localhost:3301/settings/rules
  - `.w-56`
  - `.size-7`
- http://localhost:3301/settings/feeds
  - `.w-56`
  - `.size-7`
- http://localhost:3301/settings/broken-links
  - `.w-56`
  - `.size-7`
- http://localhost:3301/settings/api-keys
  - `.w-56`
  - `.size-7`
- http://localhost:3301/settings/backups
  - `.w-56`
  - `.size-7`
- http://localhost:3301/settings/stats
  - `.w-56`
  - `.size-7`
- http://localhost:3301/settings/assets
  - `.w-56`
  - `.size-7`
- http://localhost:3301/settings/webhooks
  - `.w-56`
  - `.size-7`
- http://localhost:3301/settings/ai
  - `.w-56`
  - `.size-7`
- http://localhost:3301/admin/overview
  - `.w-56`
  - `.size-7`
- http://localhost:3301/admin/users
  - `.w-56`
  - `.size-7`
- http://localhost:3301/admin/background_jobs
  - `.w-56`
  - `.size-7`
- http://localhost:3301/admin/admin_tools
  - `.w-56`
  - `.size-7`
- http://localhost:3301/dashboard/lists/u3vj1bynb1l958g65bkc6ka0 [state:list-detail-page]
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `div[data-bookmark-index="0"] > .p-2.h-full.gap-2 > .justify.text-gray-500.shrink-0 > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="1"] > .p-2.h-full.gap-2 > .justify.text-gray-500.shrink-0 > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
- http://localhost:3301/dashboard/tags/z5lou738xzvg1pxynl1lbmlf [state:tag-detail-page]
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `div[data-bookmark-index="0"] > .p-2.h-full.gap-2 > .justify.text-gray-500.shrink-0 > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="1"] > .p-2.h-full.gap-2 > .justify.text-gray-500.shrink-0 > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-page]
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3301/public/lists/u3vj1bynb1l958g65bkc6ka0 [state:public-list-page]
  - `.whitespace-nowrap`
- http://localhost:3301/dashboard/bookmarks [state:theme-dark]
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `div[data-bookmark-index="2"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="5"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="0"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="3"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `.max-h-96 > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="4"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
- http://localhost:3301/dashboard/bookmarks [state:mobile-390]
  - `.size-7`
  - `.m-auto.px-3[href$="bookmarks"]`
  - `.m-auto.px-3[href$="tags"]`
  - `.m-auto.px-3[href$="highlights"]`
  - `.m-auto.px-3[href$="archive"]`
  - `.m-auto.px-3[href$="lists"]`
  - `div[data-bookmark-index="0"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `.max-h-96 > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="2"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="3"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - … +2 autres

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:3301/dashboard/bookmarks
  - `.mt-auto`
  - `kbd`
- http://localhost:3301/dashboard/lists
  - `.mt-auto`
  - `.text-md`
  - `.space-y-3:nth-child(1) > h2`
  - `.space-y-3:nth-child(2) > h2`
- http://localhost:3301/dashboard/tags
  - `.mt-auto`
- http://localhost:3301/dashboard/archive
  - `.mt-auto`
  - `kbd`
- http://localhost:3301/dashboard/favourites
  - `.mt-auto`
  - `kbd`
- http://localhost:3301/dashboard/highlights
  - `.mt-auto`
  - `.p-2`
- http://localhost:3301/dashboard/search
  - `.mt-auto`
- http://localhost:3301/dashboard/search?q=accessibilit%C3%A9
  - `.mt-auto`
- http://localhost:3301/dashboard/cleanups
  - `.mt-auto`
- http://localhost:3301/settings/info
  - `.mt-auto`
- http://localhost:3301/settings/import
  - `.mt-auto`
- http://localhost:3301/settings/rules
  - `.mt-auto`
  - `.mt-1`
- http://localhost:3301/settings/feeds
  - `.mt-auto`
  - `p`
- http://localhost:3301/settings/broken-links
  - `.mt-auto`
  - `p`
- http://localhost:3301/settings/api-keys
  - `.mt-auto`
- http://localhost:3301/settings/backups
  - `.mt-auto`
  - `.mt-1`
- http://localhost:3301/settings/stats
  - `.mt-auto`
  - `.mt-1`
- http://localhost:3301/settings/assets
  - `.mt-auto`
- http://localhost:3301/settings/webhooks
  - `.mt-auto`
  - `.mt-1`
  - `.p-3`
- http://localhost:3301/settings/ai
  - `.mt-auto`
- http://localhost:3301/admin/overview
  - `.mt-auto`
- http://localhost:3301/admin/users
  - `.mt-auto`
  - `th:nth-child(1)`
  - `th:nth-child(2)`
  - `th:nth-child(3)`
  - `th:nth-child(4)`
  - `th:nth-child(5)`
  - `th:nth-child(6)`
- http://localhost:3301/admin/background_jobs
  - `.mt-auto`
- http://localhost:3301/admin/admin_tools
  - `.mt-auto`
- http://localhost:3301/dashboard/lists/u3vj1bynb1l958g65bkc6ka0 [state:list-detail-page]
  - `.mt-auto`
  - `.mt-1`
  - `.mt-2 > span:nth-child(1)`
  - `.mt-2 > .gap-1`
  - `kbd`
- http://localhost:3301/dashboard/tags/z5lou738xzvg1pxynl1lbmlf [state:tag-detail-page]
  - `.mt-auto`
  - `.mt-2 > span:nth-child(1)`
  - `.mt-2 > .gap-1`
  - `kbd`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-page]
  - `.mt-auto`
- http://localhost:3301/dashboard/bookmarks [state:theme-dark]
  - `div[data-bookmark-index="2"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-nowrap.font-light.gap-2 > .hover\:text-foreground.line-clamp-1[rel="noreferrer"]`
  - `div[data-bookmark-index="2"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-nowrap.font-light.gap-2 > a:nth-child(2)`
  - `div[data-bookmark-index="0"] > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-nowrap.font-light.gap-2 > a`
  - `.max-h-96 > .h-full.p-2.gap-2 > .justify.text-gray-500.justify-between > .text-nowrap.font-light.gap-2 > a`
- http://localhost:3301/dashboard/bookmarks [state:mobile-390]
  - `kbd`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.14/list?application=axeAPI

- http://localhost:3301/dashboard/bookmarks
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/lists
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/tags
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/archive
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/favourites
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/highlights
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/search
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/search?q=accessibilit%C3%A9
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/cleanups
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/lists/u3vj1bynb1l958g65bkc6ka0 [state:list-detail-page]
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/tags/z5lou738xzvg1pxynl1lbmlf [state:tag-detail-page]
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-page]
  - `.sidebar-scrollbar`
- http://localhost:3301/dashboard/bookmarks [state:theme-dark]
  - `.sidebar-scrollbar`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:3301/dashboard/bookmarks
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `div[data-state="closed"]:nth-child(3) > .group`
- http://localhost:3301/dashboard/lists
  - `div[data-state="closed"]:nth-child(1) > .group.rounded-lg.relative`
  - `div[data-state="closed"]:nth-child(2) > .group.rounded-lg.relative`
  - `div[data-state="closed"]:nth-child(3) > .group.rounded-lg.relative`
  - `.last\:border-b-0.border-b[data-state="closed"]:nth-child(1) > .group\/list-row.min-h-20.gap-x-3`
  - `.last\:border-b-0.border-b[data-state="closed"]:nth-child(2) > .group\/list-row.min-h-20.gap-x-3`
  - `.last\:border-b-0.border-b[data-state="closed"]:nth-child(3) > .group\/list-row.min-h-20.gap-x-3`
- http://localhost:3301/dashboard/tags
  - `div[data-state="closed"]:nth-child(1) > .group.justify-between`
  - `div[data-state="closed"]:nth-child(2) > .group.justify-between`
  - `div[data-state="closed"]:nth-child(3) > .group.justify-between`
- http://localhost:3301/dashboard/archive
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `div[data-state="closed"]:nth-child(3) > .group`
- http://localhost:3301/dashboard/favourites
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `div[data-state="closed"]:nth-child(3) > .group`
- http://localhost:3301/dashboard/highlights
  - `div[data-state="closed"]:nth-child(1) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(2) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(3) > .group.justify-between.hover\:bg-accent`
- http://localhost:3301/dashboard/search
  - `div[data-state="closed"]:nth-child(1) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(2) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(3) > .group.justify-between.hover\:bg-accent`
- http://localhost:3301/dashboard/search?q=accessibilit%C3%A9
  - `div[data-state="closed"]:nth-child(1) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(2) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(3) > .group.justify-between.hover\:bg-accent`
- http://localhost:3301/dashboard/cleanups
  - `div[data-state="closed"]:nth-child(1) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(2) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(3) > .group.justify-between.hover\:bg-accent`
- http://localhost:3301/dashboard/lists/u3vj1bynb1l958g65bkc6ka0 [state:list-detail-page]
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `.bg-accent\/50`
- http://localhost:3301/dashboard/tags/z5lou738xzvg1pxynl1lbmlf [state:tag-detail-page]
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `div[data-state="closed"]:nth-child(3) > .group`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-page]
  - `div[data-state="closed"]:nth-child(1) > .group.justify-between.rounded-lg`
  - `div[data-state="closed"]:nth-child(2) > .group.justify-between.rounded-lg`
  - `div[data-state="closed"]:nth-child(3) > .group.justify-between.rounded-lg`
- http://localhost:3301/dashboard/bookmarks [state:theme-dark]
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `div[data-state="closed"]:nth-child(3) > .group`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/label-title-only?application=axeAPI

- http://localhost:3301/dashboard/bookmarks
  - `#_R_d9ulubst5tjb_-form-item`
- http://localhost:3301/dashboard/archive
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3301/dashboard/favourites
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3301/settings/ai
  - `#_R_7l4lubst5tjb_-form-item`
- http://localhost:3301/dashboard/lists [state:new-list-dialog]
  - `#_r_2_-form-item`
- http://localhost:3301/dashboard/lists/u3vj1bynb1l958g65bkc6ka0 [state:list-detail-page]
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3301/dashboard/tags/z5lou738xzvg1pxynl1lbmlf [state:tag-detail-page]
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3301/dashboard/bookmarks [state:theme-dark]
  - `#_R_d9ulubst5tjb_-form-item`
- http://localhost:3301/dashboard/bookmarks [state:mobile-390]
  - `#_R_d9ulubst5tjb_-form-item`

## [SERIOUS] aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

Ensure aria-hidden elements are not focusable nor contain focusable elements
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-hidden-focus?application=axeAPI

- http://localhost:3301/dashboard/bookmarks [state:card-actions-menu]
  - `.sm\:fixed`
- http://localhost:3301/dashboard/bookmarks [state:view-options-menu]
  - `.sm\:fixed`
- http://localhost:3301/dashboard/bookmarks [state:sort-menu]
  - `.sm\:fixed`
- http://localhost:3301/dashboard/bookmarks [state:profile-menu]
  - `.sm\:fixed`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:3301/dashboard/bookmarks
  - `#radix-_R_9mal5tjb_`
  - `#radix-_R_9qal5tjb_`
  - `#radix-_R_9ual5tjb_`
- http://localhost:3301/dashboard/archive
  - `#radix-_R_9mal5tjb_`
  - `#radix-_R_9qal5tjb_`
  - `#radix-_R_9ual5tjb_`
- http://localhost:3301/dashboard/favourites
  - `#radix-_R_9mal5tjb_`
  - `#radix-_R_9qal5tjb_`
  - `#radix-_R_9ual5tjb_`

## [SERIOUS] scrollable-region-focusable — Scrollable region must have keyboard access

Ensure elements that have scrollable content are accessible by keyboard in Safari
Référence : https://dequeuniversity.com/rules/axe/4.14/scrollable-region-focusable?application=axeAPI

- http://localhost:3301/dashboard/search
  - `main`
- http://localhost:3301/dashboard/search?q=accessibilit%C3%A9
  - `main`
- http://localhost:3301/settings/stats
  - `main`

## [SERIOUS] aria-progressbar-name — ARIA progressbar nodes must have an accessible name

Ensure every ARIA progressbar node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-progressbar-name?application=axeAPI

- http://localhost:3301/settings/stats
  - `.space-y-3:nth-child(1) > div[aria-valuemax="100"][aria-valuemin="0"][role="progressbar"]`
  - `.space-y-3:nth-child(2) > div[aria-valuemax="100"][aria-valuemin="0"][role="progressbar"]`
  - `.space-y-3:nth-child(3) > div[aria-valuemax="100"][aria-valuemin="0"][role="progressbar"]`
  - `.space-y-2 > div[aria-valuemax="100"][aria-valuemin="0"][role="progressbar"]`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-input-field-name?application=axeAPI

- http://localhost:3301/dashboard/bookmarks [state:view-options-menu]
  - `.w-5`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.14/meta-viewport?application=axeAPI

- http://localhost:3301/dashboard/bookmarks
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/lists
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/tags
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/archive
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/favourites
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/highlights
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/search
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/search?q=accessibilit%C3%A9
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/cleanups
  - `meta[name="viewport"]`
- http://localhost:3301/settings/info
  - `meta[name="viewport"]`
- http://localhost:3301/settings/import
  - `meta[name="viewport"]`
- http://localhost:3301/settings/rules
  - `meta[name="viewport"]`
- http://localhost:3301/settings/feeds
  - `meta[name="viewport"]`
- http://localhost:3301/settings/broken-links
  - `meta[name="viewport"]`
- http://localhost:3301/settings/api-keys
  - `meta[name="viewport"]`
- http://localhost:3301/settings/backups
  - `meta[name="viewport"]`
- http://localhost:3301/settings/stats
  - `meta[name="viewport"]`
- http://localhost:3301/settings/assets
  - `meta[name="viewport"]`
- http://localhost:3301/settings/webhooks
  - `meta[name="viewport"]`
- http://localhost:3301/settings/ai
  - `meta[name="viewport"]`
- http://localhost:3301/admin/overview
  - `meta[name="viewport"]`
- http://localhost:3301/admin/users
  - `meta[name="viewport"]`
- http://localhost:3301/admin/background_jobs
  - `meta[name="viewport"]`
- http://localhost:3301/admin/admin_tools
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/bookmarks [state:card-actions-menu]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/bookmarks [state:edit-bookmark-dialog]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/bookmarks [state:view-options-menu]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/bookmarks [state:sort-menu]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/bookmarks [state:profile-menu]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/bookmarks [state:keyboard-shortcuts-dialog]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/lists [state:new-list-dialog]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/lists/u3vj1bynb1l958g65bkc6ka0 [state:list-detail-page]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/tags/z5lou738xzvg1pxynl1lbmlf [state:tag-detail-page]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-page]
  - `meta[name="viewport"]`
- http://localhost:3301/reader/a94alm01tqdl4f8aq9u2lry1 [state:reader-page]
  - `meta[name="viewport"]`
- http://localhost:3301/public/lists/u3vj1bynb1l958g65bkc6ka0 [state:public-list-page]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-modal]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/bookmarks [state:theme-dark]
  - `meta[name="viewport"]`
- http://localhost:3301/dashboard/bookmarks [state:mobile-390]
  - `meta[name="viewport"]`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:3301/settings/info
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(2) > .space-y-1\.5.flex-col.p-6 > .gap-4.justify-between.items-center > .space-y-1 > h3`
- http://localhost:3301/settings/import
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(2) > .space-y-1\.5.p-6.flex-col > .gap-4.justify-between.items-center > .space-y-1 > .text-lg.font-semibold.tracking-tight`
- http://localhost:3301/settings/rules
  - `h3`
- http://localhost:3301/settings/backups
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(2) > .space-y-1\.5.p-6.flex-col > .gap-4.justify-between.items-center > .space-y-1 > h3`
- http://localhost:3301/settings/stats
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(1) > .flex-row.space-y-0.pb-2 > h3`
- http://localhost:3301/settings/ai
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(2) > .space-y-1\.5.p-6.flex-col > .gap-4.justify-between.items-center > .space-y-1 > h3`
- http://localhost:3301/reader/a94alm01tqdl4f8aq9u2lry1 [state:reader-page]
  - `h3`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:3301/dashboard/bookmarks [state:card-actions-menu]
  - `html`
- http://localhost:3301/dashboard/bookmarks [state:view-options-menu]
  - `html`
- http://localhost:3301/dashboard/bookmarks [state:sort-menu]
  - `html`
- http://localhost:3301/dashboard/bookmarks [state:profile-menu]
  - `html`
- http://localhost:3301/dashboard/bookmarks [state:mobile-390]
  - `html`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:3301/dashboard/bookmarks [state:card-actions-menu]
  - `html`
- http://localhost:3301/dashboard/bookmarks [state:view-options-menu]
  - `html`
- http://localhost:3301/dashboard/bookmarks [state:sort-menu]
  - `html`
- http://localhost:3301/dashboard/bookmarks [state:profile-menu]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:3301/dashboard/bookmarks [state:card-actions-menu]
  - `.data-\[disabled\]\:pointer-events-none.data-\[variant\=destructive\]\:text-destructive[data-variant="default"]:nth-child(1) > span`
  - `.data-\[disabled\]\:pointer-events-none.data-\[variant\=destructive\]\:text-destructive[data-variant="default"]:nth-child(2) > span`
  - `.data-\[disabled\]\:pointer-events-none.data-\[variant\=destructive\]\:text-destructive[data-variant="default"]:nth-child(3) > span`
  - `.data-\[disabled\]\:pointer-events-none.data-\[variant\=destructive\]\:text-destructive[data-variant="default"]:nth-child(5) > span`
  - `.data-\[disabled\]\:pointer-events-none.data-\[variant\=destructive\]\:text-destructive[data-variant="default"]:nth-child(6) > span`
  - `#radix-_r_1a_ > span`
  - `#radix-_r_1d_ > span`
  - `div[data-variant="destructive"] > span`
- http://localhost:3301/dashboard/bookmarks [state:view-options-menu]
  - `.text-xs.py-1\.5.px-2:nth-child(1)`
  - `.focus\:bg-accent.focus\:text-accent-foreground.data-\[disabled\]\:pointer-events-none:nth-child(2) > span`
  - `.focus\:bg-accent.focus\:text-accent-foreground.data-\[disabled\]\:pointer-events-none:nth-child(3) > span`
  - `.focus\:bg-accent.focus\:text-accent-foreground.data-\[disabled\]\:pointer-events-none:nth-child(4) > span`
  - `.focus\:bg-accent.focus\:text-accent-foreground.data-\[disabled\]\:pointer-events-none:nth-child(5) > span`
  - `.pt-1\.5`
  - `.text-xs.py-1\.5.px-2:nth-child(9)`
  - `label[for="show-notes"] > span`
  - `label[for="show-tags"] > span`
  - `label[for="show-title"] > span`
  - … +3 autres
- http://localhost:3301/dashboard/bookmarks [state:sort-menu]
  - `.py-1\.5.focus\:bg-accent.focus\:text-accent-foreground:nth-child(1) > .items-center.flex > span`
  - `.py-1\.5.focus\:bg-accent.focus\:text-accent-foreground:nth-child(2) > .items-center.flex > span`
- http://localhost:3301/dashboard/bookmarks [state:profile-menu]
  - `#radix-_R_r5tjbH1_ > .gap-2.flex:nth-child(1)`
  - `a[href$="settings"]`
  - `a[href$="admin"]`
  - `a[href$="cleanups"]`
  - `.cursor-default.py-1\.5.focus\:bg-accent:nth-child(7) > span`
  - `.cursor-default.py-1\.5.focus\:bg-accent:nth-child(8)`
  - `a[href$="apps"]`
  - `a[href$="docs.karakeep.app"]`
  - `a[href$="karakeep_app"]`
  - `.cursor-default.py-1\.5.focus\:bg-accent:nth-child(14) > span`

## Résultats incomplets à revoir (145)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:3301/dashboard/bookmarks
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_d9ulubst5tjb_-form-item`
- http://localhost:3301/dashboard/lists
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `.focus-visible\:ring-\[3px\]`
- http://localhost:3301/dashboard/tags
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `button[aria-controls="radix-_R_cklubst5tjb_"]`
- http://localhost:3301/dashboard/archive
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3301/dashboard/favourites
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3301/dashboard/highlights
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3301/dashboard/search
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3301/dashboard/search?q=accessibilit%C3%A9
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3301/dashboard/cleanups
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3301/settings/info
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `button[aria-controls="radix-_R_kclubst5tjb_"]`
  - `#current-password`
  - `#new-password`
  - `#confirm-password`
  - `.bg-destructive`
- http://localhost:3301/settings/import
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/rules
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/feeds
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.focus-visible\:ring-\[3px\]`
- http://localhost:3301/settings/broken-links
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/api-keys
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.bg-primary`
  - `.h-9`
  - `button[title="Delete"]`
- http://localhost:3301/settings/backups
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/stats
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/assets
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/settings/webhooks
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.focus-visible\:ring-\[3px\]`
- http://localhost:3301/settings/ai
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.min-h-10`
  - `#_R_7l4lubst5tjb_-form-item`
- http://localhost:3301/admin/overview
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/admin/users
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `button[aria-controls="radix-_R_9anpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_eqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_mqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_uqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_9inpfkt5tjb_"]`
- http://localhost:3301/admin/background_jobs
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `button[aria-controls="radix-_r_0_"]`
  - `button[aria-controls="radix-_r_3_"]`
  - `button[aria-controls="radix-_r_6_"]`
  - `button[aria-controls="radix-_r_9_"]`
  - `button[aria-controls="radix-_r_c_"]`
  - `button[aria-controls="radix-_r_f_"]`
  - `button[aria-controls="radix-_r_i_"]`
  - `button[aria-controls="radix-_r_l_"]`
  - `button[aria-controls="radix-_r_o_"]`
  - … +8 autres
- http://localhost:3301/admin/admin_tools
  - `div[aria-haspopup="dialog"]`
- http://localhost:3301/dashboard/bookmarks [state:card-actions-menu]
  - `#radix-_r_1a_`
  - `#radix-_r_1d_`
- http://localhost:3301/dashboard/bookmarks [state:edit-bookmark-dialog]
  - `#_r_1g_-form-item`
  - `#_r_1h_-form-item`
  - `#_r_1i_-form-item`
  - `#_r_1j_-form-item`
  - `#_r_1k_-form-item`
  - `#_r_1l_-form-item`
  - `#_r_1m_-form-item`
  - `#_r_1n_-form-item`
  - `#_r_1p_-form-item`
  - `.min-h-10`
- http://localhost:3301/dashboard/bookmarks [state:keyboard-shortcuts-dialog]
  - `#radix-_R_3ulubst5tjb_`
- http://localhost:3301/dashboard/lists [state:new-list-dialog]
  - `#radix-_R_8ql5tjb_`
  - `.rounded`
  - `#_r_2_-form-item`
  - `#_r_3_-form-item`
  - `button[aria-controls="radix-_r_5_"]`
- http://localhost:3301/dashboard/lists/u3vj1bynb1l958g65bkc6ka0 [state:list-detail-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3301/dashboard/tags/z5lou738xzvg1pxynl1lbmlf [state:tag-detail-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `.min-h-10`
- http://localhost:3301/reader/a94alm01tqdl4f8aq9u2lry1 [state:reader-page]
  - `.relative`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-modal]
  - `#radix-_r_14_`
  - `.min-h-10`
- http://localhost:3301/dashboard/bookmarks [state:theme-dark]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_d9ulubst5tjb_-form-item`
- http://localhost:3301/dashboard/bookmarks [state:mobile-390]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `#_R_d9ulubst5tjb_-form-item`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3301/dashboard/bookmarks
  - `#_R_d9ulubst5tjb_-form-item`
- http://localhost:3301/dashboard/archive
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3301/dashboard/favourites
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3301/dashboard/lists/u3vj1bynb1l958g65bkc6ka0 [state:list-detail-page]
  - `.mt-2 > span:nth-child(2)`
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3301/dashboard/tags/z5lou738xzvg1pxynl1lbmlf [state:tag-detail-page]
  - `.mt-2 > span:nth-child(2)`
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3301/public/lists/u3vj1bynb1l958g65bkc6ka0 [state:public-list-page]
  - `h1`
  - `.leading-relaxed`
  - `.text-sm.text-muted-foreground`
  - `.gap-3.md\:justify-end.flex > div:nth-child(2) > .text-foreground`
  - `.uppercase > span`
- http://localhost:3301/dashboard/bookmarks [state:theme-dark]
  - `#_R_d9ulubst5tjb_-form-item`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:3301/dashboard/bookmarks [state:card-actions-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(13)`
- http://localhost:3301/dashboard/bookmarks [state:edit-bookmark-dialog]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `.sm\:fixed`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(14)`
- http://localhost:3301/dashboard/bookmarks [state:view-options-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(13)`
- http://localhost:3301/dashboard/bookmarks [state:sort-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(13)`
- http://localhost:3301/dashboard/bookmarks [state:profile-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(13)`
- http://localhost:3301/dashboard/bookmarks [state:keyboard-shortcuts-dialog]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `.sm\:fixed`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(14)`
- http://localhost:3301/dashboard/lists [state:new-list-dialog]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `.sm\:fixed`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(14)`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-modal]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `.sm\:fixed`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(14)`

### bypass — Page must have means to bypass repeated blocks

- http://localhost:3301/dashboard/bookmarks [state:card-actions-menu]
  - `html`
- http://localhost:3301/dashboard/bookmarks [state:view-options-menu]
  - `html`
- http://localhost:3301/dashboard/bookmarks [state:sort-menu]
  - `html`
- http://localhost:3301/dashboard/bookmarks [state:profile-menu]
  - `html`
- http://localhost:3301/dashboard/preview/a94alm01tqdl4f8aq9u2lry1 [state:preview-modal]
  - `html`

