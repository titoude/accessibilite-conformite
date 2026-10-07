# Audit accessibilité — 2026-10-07

**16 règle(s) violée(s), 485 occurrence(s), 37/37 scénario(s) audité(s), 0 erreur(s), 142 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `f5c34938505f`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-attr?application=axeAPI

- http://localhost:3000/dashboard/bookmarks
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/dashboard/lists
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/dashboard/tags
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/dashboard/archive
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/dashboard/favourites
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/dashboard/highlights
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/dashboard/search
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/dashboard/search?q=accessibilit%C3%A9
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/dashboard/cleanups
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/settings/info
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/settings/import
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/settings/rules
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/settings/feeds
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/settings/broken-links
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/settings/api-keys
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/settings/backups
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/settings/stats
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/settings/assets
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/settings/webhooks
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/settings/ai
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.min-h-10`
- http://localhost:3000/admin/overview
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/admin/users
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/admin/background_jobs
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/admin/admin_tools
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/dashboard/bookmarks [state:edit-bookmark-dialog]
  - `.min-h-10`
- http://localhost:3000/dashboard/lists/c62jucbbqu9yf8tflmsqv48w [state:list-detail-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/dashboard/tags/hgbyciltjdgu97x66duu4gps [state:tag-detail-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.min-h-10`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-modal]
  - `.min-h-10`
- http://localhost:3000/dashboard/bookmarks [state:theme-dark]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
- http://localhost:3000/dashboard/bookmarks [state:mobile-390]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

- http://localhost:3000/dashboard/bookmarks
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/lists
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/tags
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/archive
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/favourites
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/highlights
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/search
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/search?q=accessibilit%C3%A9
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/cleanups
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/settings/info
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/settings/import
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/settings/rules
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/settings/feeds
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/settings/broken-links
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/settings/api-keys
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/settings/backups
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/settings/stats
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/settings/assets
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/settings/webhooks
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/settings/ai
  - `#radix-_R_dj5tjbH2_`
  - `#radix-_R_cslubst5tjbH2_`
- http://localhost:3000/admin/overview
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/admin/users
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/admin/background_jobs
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/admin/admin_tools
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/bookmarks [state:edit-bookmark-dialog]
  - `#radix-_r_1l_`
- http://localhost:3000/dashboard/lists/c62jucbbqu9yf8tflmsqv48w [state:list-detail-page]
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/tags/hgbyciltjdgu97x66duu4gps [state:tag-detail-page]
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-page]
  - `#radix-_R_dj5tjbH2_`
  - `#radix-_R_1j9av5ubst5tjbH2_`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-modal]
  - `#radix-_r_1b_`
- http://localhost:3000/dashboard/bookmarks [state:theme-dark]
  - `#radix-_R_dj5tjbH2_`
- http://localhost:3000/dashboard/bookmarks [state:mobile-390]
  - `#radix-_R_dj5tjbH2_`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:3000/dashboard/bookmarks
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_bqq9ulubst5tjb_`
  - `#radix-_R_bqr9ulubst5tjb_`
  - `#radix-_R_bqphulubst5tjb_`
  - `#radix-_R_bqqhulubst5tjb_`
  - `#radix-_R_bqppulubst5tjb_`
  - `#radix-_R_bqqpulubst5tjb_`
- http://localhost:3000/dashboard/lists
  - `#radix-_R_4pmmlubst5tjb_`
  - `#radix-_R_4pqmlubst5tjb_`
  - `#radix-_R_4pumlubst5tjb_`
- http://localhost:3000/dashboard/archive
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_5tdhulubst5tjb_`
  - `#radix-_R_5tdpulubst5tjb_`
- http://localhost:3000/dashboard/favourites
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_5tdhulubst5tjb_`
- http://localhost:3000/dashboard/search
  - `#radix-_r_2u_`
  - `#radix-_r_3d_`
  - `#radix-_r_9_`
  - `#radix-_r_k_`
  - `#radix-_r_v_`
  - `#radix-_r_1a_`
  - `#radix-_r_1l_`
  - `#radix-_r_20_`
  - `#radix-_r_2b_`
  - `#radix-_r_2m_`
- http://localhost:3000/dashboard/search?q=accessibilit%C3%A9
  - `#radix-_r_s_`
  - `#radix-_r_1b_`
  - `#radix-_r_9_`
  - `#radix-_r_k_`
- http://localhost:3000/settings/info
  - `button[aria-controls="radix-_R_2d4lubst5tjb_"]`
  - `button[aria-controls="radix-_R_2l4lubst5tjb_"]`
  - `button[aria-controls="radix-_R_9t4lubst5tjb_"]`
  - `button[aria-controls="radix-_R_at4lubst5tjb_"]`
- http://localhost:3000/settings/import
  - `.border-input`
- http://localhost:3000/settings/backups
  - `.focus\:outline-none`
- http://localhost:3000/settings/ai
  - `#lowercase-hyphens`
  - `#lowercase-spaces`
  - `#lowercase-underscores`
  - `#titlecase-spaces`
  - `.focus\:outline-none`
- http://localhost:3000/admin/users
  - `button[aria-controls="radix-_R_9anpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_eqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_mqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_uqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_9inpfkt5tjb_"]`
- http://localhost:3000/dashboard/lists [state:new-list-dialog]
  - `button[aria-controls="radix-_r_5_"]`
  - `.gap-1.items-center > .focus-visible\:ring-0.hover\:text-accent-foreground.inline-flex`
  - `.focus\:outline-none`
- http://localhost:3000/dashboard/lists/c62jucbbqu9yf8tflmsqv48w [state:list-detail-page]
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_9av5ubst5tjb_`
  - `#radix-_R_2umovav5ubst5tjb_`
  - `#radix-_R_2umsvav5ubst5tjb_`
- http://localhost:3000/dashboard/tags/hgbyciltjdgu97x66duu4gps [state:tag-detail-page]
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_9av5ubst5tjb_`
  - `#radix-_R_2umovav5ubst5tjb_`
  - `#radix-_R_2umsvav5ubst5tjb_`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-page]
  - `.right-4`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(1)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(2)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(3)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(4)`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-modal]
  - `.right-4`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(1)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(2)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(3)`
  - `.size-8.hover\:text-accent-foreground.focus-visible\:ring-0:nth-child(4)`
- http://localhost:3000/dashboard/bookmarks [state:theme-dark]
  - `#radix-_r_i_`
  - `#radix-_r_11_`
  - `#radix-_R_bqq9ulubst5tjb_`
  - `#radix-_R_bqr9ulubst5tjb_`
  - `#radix-_R_bqphulubst5tjb_`
  - `#radix-_R_bqqhulubst5tjb_`
  - `#radix-_R_bqppulubst5tjb_`
  - `#radix-_R_bqqpulubst5tjb_`
- http://localhost:3000/dashboard/bookmarks [state:mobile-390]
  - `#radix-_r_1u_`
  - `#radix-_r_2d_`
  - `#radix-_r_2p_`
  - `#radix-_r_34_`
  - `#radix-_R_bqq9ulubst5tjb_`
  - `#radix-_r_3f_`
  - `#radix-_r_3q_`
  - `#radix-_R_bqr9ulubst5tjb_`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:3000/dashboard/bookmarks
  - `.mt-auto`
  - `kbd`
- http://localhost:3000/dashboard/lists
  - `.mt-auto`
  - `.text-md`
  - `.space-y-3:nth-child(1) > h2`
  - `.space-y-3:nth-child(2) > h2`
- http://localhost:3000/dashboard/tags
  - `.mt-auto`
- http://localhost:3000/dashboard/archive
  - `.mt-auto`
  - `kbd`
- http://localhost:3000/dashboard/favourites
  - `.mt-auto`
  - `kbd`
- http://localhost:3000/dashboard/highlights
  - `.mt-auto`
  - `.p-2`
- http://localhost:3000/dashboard/search
  - `.mt-auto`
- http://localhost:3000/dashboard/search?q=accessibilit%C3%A9
  - `.mt-auto`
- http://localhost:3000/dashboard/cleanups
  - `.mt-auto`
- http://localhost:3000/settings/info
  - `.mt-auto`
- http://localhost:3000/settings/import
  - `.mt-auto`
- http://localhost:3000/settings/rules
  - `.mt-auto`
  - `.mt-1`
- http://localhost:3000/settings/feeds
  - `.mt-auto`
  - `p`
- http://localhost:3000/settings/broken-links
  - `.mt-auto`
  - `p`
- http://localhost:3000/settings/api-keys
  - `.mt-auto`
- http://localhost:3000/settings/backups
  - `.mt-auto`
  - `.mt-1`
- http://localhost:3000/settings/stats
  - `.mt-auto`
  - `.mt-1`
- http://localhost:3000/settings/assets
  - `.mt-auto`
- http://localhost:3000/settings/webhooks
  - `.mt-auto`
  - `.mt-1`
  - `.p-3`
- http://localhost:3000/settings/ai
  - `.mt-auto`
- http://localhost:3000/admin/overview
  - `.mt-auto`
  - `.sm\:w-1\/4.p-4.rounded-md:nth-child(1) > .text-gray-400.font-medium.text-sm`
  - `.sm\:w-1\/4.p-4.rounded-md:nth-child(2) > .text-gray-400.font-medium.text-sm`
  - `.sm\:w-1\/4.p-4.rounded-md:nth-child(3) > .text-gray-400.font-medium.text-sm`
  - `.text-blue-500`
- http://localhost:3000/admin/users
  - `.mt-auto`
  - `th:nth-child(1)`
  - `th:nth-child(2)`
  - `th:nth-child(3)`
  - `th:nth-child(4)`
  - `th:nth-child(5)`
  - `th:nth-child(6)`
- http://localhost:3000/admin/background_jobs
  - `.mt-auto`
- http://localhost:3000/admin/admin_tools
  - `.mt-auto`
- http://localhost:3000/dashboard/lists/c62jucbbqu9yf8tflmsqv48w [state:list-detail-page]
  - `.mt-auto`
  - `.mt-1`
  - `.mt-2 > span:nth-child(1)`
  - `.mt-2 > .gap-1`
  - `kbd`
- http://localhost:3000/dashboard/tags/hgbyciltjdgu97x66duu4gps [state:tag-detail-page]
  - `.mt-auto`
  - `.mt-2 > span:nth-child(1)`
  - `.mt-2 > .gap-1`
  - `kbd`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-page]
  - `.mt-auto`
- http://localhost:3000/dashboard/bookmarks [state:theme-dark]
  - `div[data-bookmark-index="2"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-nowrap.font-light.gap-2 > a`
  - `div[data-bookmark-index="0"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-nowrap.font-light.gap-2 > .hover\:text-foreground.line-clamp-1[rel="noreferrer"]`
  - `div[data-bookmark-index="0"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-nowrap.font-light.gap-2 > a:nth-child(2)`
  - `.max-h-96 > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-nowrap.font-light.gap-2 > a`
  - `div[data-bookmark-index="1"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-nowrap.font-light.gap-2 > .hover\:text-foreground.line-clamp-1[rel="noreferrer"]`
  - `div[data-bookmark-index="1"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-nowrap.font-light.gap-2 > a:nth-child(2)`
- http://localhost:3000/dashboard/bookmarks [state:mobile-390]
  - `kbd`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:3000/dashboard/bookmarks
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `div[data-bookmark-index="2"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="5"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="0"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `.max-h-96 > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="1"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="4"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
- http://localhost:3000/dashboard/lists
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3000/dashboard/tags
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3000/dashboard/archive
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `.max-h-96 > .p-2.gap-2.h-full > .justify.text-gray-500.shrink-0 > .text-gray-500 > .px-2.h-10.hover\:text-accent-foreground`
  - `.h-96 > .p-2.gap-2.h-full > .justify.text-gray-500.shrink-0 > .text-gray-500 > .px-2.h-10.hover\:text-accent-foreground`
- http://localhost:3000/dashboard/favourites
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `.px-2`
- http://localhost:3000/dashboard/highlights
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3000/dashboard/search
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `div[data-bookmark-index="0"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.whitespace-nowrap`
  - `div[data-bookmark-index="3"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.whitespace-nowrap`
  - `div[data-bookmark-index="6"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.whitespace-nowrap`
  - `div[data-bookmark-index="1"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.whitespace-nowrap`
  - `div[data-bookmark-index="4"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.whitespace-nowrap`
  - `div[data-bookmark-index="7"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.whitespace-nowrap`
  - `div[data-bookmark-index="2"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.whitespace-nowrap`
  - … +1 autres
- http://localhost:3000/dashboard/search?q=accessibilit%C3%A9
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `div[data-bookmark-index="0"] > .p-2.h-full.gap-2 > .justify.text-gray-500.shrink-0 > .text-gray-500 > .px-2.h-10.whitespace-nowrap`
  - `div[data-bookmark-index="1"] > .p-2.h-full.gap-2 > .justify.text-gray-500.shrink-0 > .text-gray-500 > .px-2.h-10.whitespace-nowrap`
- http://localhost:3000/dashboard/cleanups
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3000/settings/info
  - `.w-56`
  - `.size-7`
- http://localhost:3000/settings/import
  - `.w-56`
  - `.size-7`
- http://localhost:3000/settings/rules
  - `.w-56`
  - `.size-7`
- http://localhost:3000/settings/feeds
  - `.w-56`
  - `.size-7`
- http://localhost:3000/settings/broken-links
  - `.w-56`
  - `.size-7`
- http://localhost:3000/settings/api-keys
  - `.w-56`
  - `.size-7`
- http://localhost:3000/settings/backups
  - `.w-56`
  - `.size-7`
- http://localhost:3000/settings/stats
  - `.w-56`
  - `.size-7`
- http://localhost:3000/settings/assets
  - `.w-56`
  - `.size-7`
- http://localhost:3000/settings/webhooks
  - `.w-56`
  - `.size-7`
- http://localhost:3000/settings/ai
  - `.w-56`
  - `.size-7`
- http://localhost:3000/admin/overview
  - `.w-56`
  - `.size-7`
- http://localhost:3000/admin/users
  - `.w-56`
  - `.size-7`
- http://localhost:3000/admin/background_jobs
  - `.w-56`
  - `.size-7`
- http://localhost:3000/admin/admin_tools
  - `.w-56`
  - `.size-7`
- http://localhost:3000/dashboard/lists/c62jucbbqu9yf8tflmsqv48w [state:list-detail-page]
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `div[data-bookmark-index="0"] > .p-2.gap-2.h-full > .justify.text-gray-500.shrink-0 > .text-gray-500 > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="1"] > .p-2.gap-2.h-full > .justify.text-gray-500.shrink-0 > .text-gray-500 > .px-2.h-10.hover\:text-accent-foreground`
- http://localhost:3000/dashboard/tags/hgbyciltjdgu97x66duu4gps [state:tag-detail-page]
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `div[data-bookmark-index="0"] > .p-2.gap-2.h-full > .justify.text-gray-500.shrink-0 > .text-gray-500 > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="1"] > .p-2.gap-2.h-full > .justify.text-gray-500.shrink-0 > .text-gray-500 > .px-2.h-10.hover\:text-accent-foreground`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-page]
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3000/dashboard/bookmarks [state:theme-dark]
  - `.w-56`
  - `.size-7`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `div[data-bookmark-index="2"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="5"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="0"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `.max-h-96 > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="1"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="4"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
- http://localhost:3000/dashboard/bookmarks [state:mobile-390]
  - `.size-7`
  - `.m-auto.px-3[href$="bookmarks"]`
  - `.m-auto.px-3[href$="search"]`
  - `.m-auto.px-3[href$="tags"]`
  - `.m-auto.px-3[href$="highlights"]`
  - `.m-auto.px-3[href$="archive"]`
  - `.m-auto.px-3[href$="lists"]`
  - `div[data-bookmark-index="0"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="1"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - `div[data-bookmark-index="2"] > .p-2.h-full.gap-2 > .justify.text-gray-500.justify-between > .text-gray-500.flex > .px-2.h-10.hover\:text-accent-foreground`
  - … +3 autres

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.14/list?application=axeAPI

- http://localhost:3000/dashboard/bookmarks
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/lists
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/tags
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/archive
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/favourites
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/highlights
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/search
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/search?q=accessibilit%C3%A9
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/cleanups
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/lists/c62jucbbqu9yf8tflmsqv48w [state:list-detail-page]
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/tags/hgbyciltjdgu97x66duu4gps [state:tag-detail-page]
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-page]
  - `.sidebar-scrollbar`
- http://localhost:3000/dashboard/bookmarks [state:theme-dark]
  - `.sidebar-scrollbar`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:3000/dashboard/bookmarks
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `div[data-state="closed"]:nth-child(3) > .group`
- http://localhost:3000/dashboard/lists
  - `div[data-state="closed"]:nth-child(1) > .group.relative.rounded-lg`
  - `div[data-state="closed"]:nth-child(2) > .group.relative.rounded-lg`
  - `div[data-state="closed"]:nth-child(3) > .group.relative.rounded-lg`
  - `.last\:border-b-0.border-b[data-state="closed"]:nth-child(1) > .group\/list-row.min-h-20.gap-x-3`
  - `.last\:border-b-0.border-b[data-state="closed"]:nth-child(2) > .group\/list-row.min-h-20.gap-x-3`
  - `.last\:border-b-0.border-b[data-state="closed"]:nth-child(3) > .group\/list-row.min-h-20.gap-x-3`
- http://localhost:3000/dashboard/tags
  - `div[data-state="closed"]:nth-child(1) > .group.justify-between`
  - `div[data-state="closed"]:nth-child(2) > .group.justify-between`
  - `div[data-state="closed"]:nth-child(3) > .group.justify-between`
- http://localhost:3000/dashboard/archive
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `div[data-state="closed"]:nth-child(3) > .group`
- http://localhost:3000/dashboard/favourites
  - `div[data-state="closed"]:nth-child(1) > .group.text-muted-foreground`
  - `div[data-state="closed"]:nth-child(2) > .group.text-muted-foreground`
  - `div[data-state="closed"]:nth-child(3) > .group.text-muted-foreground`
- http://localhost:3000/dashboard/highlights
  - `div[data-state="closed"]:nth-child(1) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(2) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(3) > .group.justify-between.hover\:bg-accent`
- http://localhost:3000/dashboard/search
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `div[data-state="closed"]:nth-child(3) > .group`
- http://localhost:3000/dashboard/search?q=accessibilit%C3%A9
  - `div[data-state="closed"]:nth-child(1) > .group.text-muted-foreground`
  - `div[data-state="closed"]:nth-child(2) > .group.text-muted-foreground`
  - `div[data-state="closed"]:nth-child(3) > .group.text-muted-foreground`
- http://localhost:3000/dashboard/cleanups
  - `div[data-state="closed"]:nth-child(1) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(2) > .group.justify-between.hover\:bg-accent`
  - `div[data-state="closed"]:nth-child(3) > .group.justify-between.hover\:bg-accent`
- http://localhost:3000/dashboard/lists/c62jucbbqu9yf8tflmsqv48w [state:list-detail-page]
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `.bg-accent\/50`
- http://localhost:3000/dashboard/tags/hgbyciltjdgu97x66duu4gps [state:tag-detail-page]
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `div[data-state="closed"]:nth-child(3) > .group`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-page]
  - `div[data-state="closed"]:nth-child(1) > .group.justify-between.rounded-lg`
  - `div[data-state="closed"]:nth-child(2) > .group.justify-between.rounded-lg`
  - `div[data-state="closed"]:nth-child(3) > .group.justify-between.rounded-lg`
- http://localhost:3000/dashboard/bookmarks [state:theme-dark]
  - `div[data-state="closed"]:nth-child(1) > .group`
  - `div[data-state="closed"]:nth-child(2) > .group`
  - `div[data-state="closed"]:nth-child(3) > .group`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/label-title-only?application=axeAPI

- http://localhost:3000/dashboard/bookmarks
  - `#_R_d9ulubst5tjb_-form-item`
- http://localhost:3000/dashboard/archive
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3000/dashboard/favourites
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3000/settings/ai
  - `#_R_7l4lubst5tjb_-form-item`
- http://localhost:3000/dashboard/lists [state:new-list-dialog]
  - `#_r_2_-form-item`
- http://localhost:3000/dashboard/lists/c62jucbbqu9yf8tflmsqv48w [state:list-detail-page]
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3000/dashboard/tags/hgbyciltjdgu97x66duu4gps [state:tag-detail-page]
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3000/dashboard/bookmarks [state:theme-dark]
  - `#_R_d9ulubst5tjb_-form-item`
- http://localhost:3000/dashboard/bookmarks [state:mobile-390]
  - `#_R_d9ulubst5tjb_-form-item`

## [SERIOUS] aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

Ensure aria-hidden elements are not focusable nor contain focusable elements
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-hidden-focus?application=axeAPI

- http://localhost:3000/dashboard/bookmarks [state:card-actions-menu]
  - `.sm\:fixed`
- http://localhost:3000/dashboard/bookmarks [state:view-options-menu]
  - `.sm\:fixed`
- http://localhost:3000/dashboard/bookmarks [state:sort-menu]
  - `.sm\:fixed`
- http://localhost:3000/dashboard/bookmarks [state:profile-menu]
  - `.sm\:fixed`

## [SERIOUS] aria-progressbar-name — ARIA progressbar nodes must have an accessible name

Ensure every ARIA progressbar node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-progressbar-name?application=axeAPI

- http://localhost:3000/settings/stats
  - `.space-y-3:nth-child(1) > div[aria-valuemax="100"][aria-valuemin="0"][role="progressbar"]`
  - `.space-y-3:nth-child(2) > div[aria-valuemax="100"][aria-valuemin="0"][role="progressbar"]`
  - `.space-y-3:nth-child(3) > div[aria-valuemax="100"][aria-valuemin="0"][role="progressbar"]`
  - `.space-y-2:nth-child(1) > div[aria-valuemax="100"][aria-valuemin="0"][role="progressbar"]`
  - `.space-y-2:nth-child(2) > div[aria-valuemax="100"][aria-valuemin="0"][role="progressbar"]`
  - `.space-y-2:nth-child(3) > div[aria-valuemax="100"][aria-valuemin="0"][role="progressbar"]`
  - `.space-y-2:nth-child(4) > div[aria-valuemax="100"][aria-valuemin="0"][role="progressbar"]`

## [SERIOUS] scrollable-region-focusable — Scrollable region must have keyboard access

Ensure elements that have scrollable content are accessible by keyboard in Safari
Référence : https://dequeuniversity.com/rules/axe/4.14/scrollable-region-focusable?application=axeAPI

- http://localhost:3000/settings/stats
  - `main`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.14/meta-viewport?application=axeAPI

- http://localhost:3000/dashboard/bookmarks
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/lists
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/tags
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/archive
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/favourites
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/highlights
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/search
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/search?q=accessibilit%C3%A9
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/cleanups
  - `meta[name="viewport"]`
- http://localhost:3000/settings/info
  - `meta[name="viewport"]`
- http://localhost:3000/settings/import
  - `meta[name="viewport"]`
- http://localhost:3000/settings/rules
  - `meta[name="viewport"]`
- http://localhost:3000/settings/feeds
  - `meta[name="viewport"]`
- http://localhost:3000/settings/broken-links
  - `meta[name="viewport"]`
- http://localhost:3000/settings/api-keys
  - `meta[name="viewport"]`
- http://localhost:3000/settings/backups
  - `meta[name="viewport"]`
- http://localhost:3000/settings/stats
  - `meta[name="viewport"]`
- http://localhost:3000/settings/assets
  - `meta[name="viewport"]`
- http://localhost:3000/settings/webhooks
  - `meta[name="viewport"]`
- http://localhost:3000/settings/ai
  - `meta[name="viewport"]`
- http://localhost:3000/admin/overview
  - `meta[name="viewport"]`
- http://localhost:3000/admin/users
  - `meta[name="viewport"]`
- http://localhost:3000/admin/background_jobs
  - `meta[name="viewport"]`
- http://localhost:3000/admin/admin_tools
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/bookmarks [state:card-actions-menu]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/bookmarks [state:edit-bookmark-dialog]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/bookmarks [state:view-options-menu]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/bookmarks [state:sort-menu]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/bookmarks [state:profile-menu]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/bookmarks [state:keyboard-shortcuts-dialog]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/lists [state:new-list-dialog]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/lists/c62jucbbqu9yf8tflmsqv48w [state:list-detail-page]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/tags/hgbyciltjdgu97x66duu4gps [state:tag-detail-page]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-page]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-modal]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/bookmarks [state:theme-dark]
  - `meta[name="viewport"]`
- http://localhost:3000/dashboard/bookmarks [state:mobile-390]
  - `meta[name="viewport"]`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:3000/settings/info
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(2) > .space-y-1\.5.flex-col.p-6 > .gap-4.justify-between.items-center > .space-y-1 > h3`
- http://localhost:3000/settings/import
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(2) > .space-y-1\.5.p-6.flex-col > .gap-4.justify-between.items-center > .space-y-1 > .text-lg.font-semibold.tracking-tight`
- http://localhost:3000/settings/rules
  - `h3`
- http://localhost:3000/settings/backups
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(2) > .space-y-1\.5.p-6.flex-col > .gap-4.justify-between.items-center > .space-y-1 > h3`
- http://localhost:3000/settings/stats
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(1) > .flex-row.space-y-0.pb-2 > h3`
- http://localhost:3000/settings/ai
  - `.bg-card.text-card-foreground.shadow-sm:nth-child(2) > .space-y-1\.5.p-6.flex-col > .gap-4.justify-between.items-center > .space-y-1 > h3`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:3000/dashboard/bookmarks [state:card-actions-menu]
  - `html`
- http://localhost:3000/dashboard/bookmarks [state:view-options-menu]
  - `html`
- http://localhost:3000/dashboard/bookmarks [state:sort-menu]
  - `html`
- http://localhost:3000/dashboard/bookmarks [state:profile-menu]
  - `html`
- http://localhost:3000/dashboard/bookmarks [state:mobile-390]
  - `html`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:3000/dashboard/bookmarks [state:card-actions-menu]
  - `html`
- http://localhost:3000/dashboard/bookmarks [state:view-options-menu]
  - `html`
- http://localhost:3000/dashboard/bookmarks [state:sort-menu]
  - `html`
- http://localhost:3000/dashboard/bookmarks [state:profile-menu]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:3000/dashboard/bookmarks [state:card-actions-menu]
  - `.data-\[disabled\]\:pointer-events-none.data-\[variant\=destructive\]\:text-destructive[data-variant="default"]:nth-child(1) > span`
  - `.data-\[disabled\]\:pointer-events-none.data-\[variant\=destructive\]\:text-destructive[data-variant="default"]:nth-child(2) > span`
  - `.data-\[disabled\]\:pointer-events-none.data-\[variant\=destructive\]\:text-destructive[data-variant="default"]:nth-child(3) > span`
  - `.data-\[disabled\]\:pointer-events-none.data-\[variant\=destructive\]\:text-destructive[data-variant="default"]:nth-child(5) > span`
  - `#radix-_r_19_ > span`
  - `div[data-variant="destructive"] > span`
- http://localhost:3000/dashboard/bookmarks [state:view-options-menu]
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
- http://localhost:3000/dashboard/bookmarks [state:sort-menu]
  - `.py-1\.5.focus\:bg-accent.focus\:text-accent-foreground:nth-child(1) > .items-center.flex > span`
  - `.py-1\.5.focus\:bg-accent.focus\:text-accent-foreground:nth-child(2) > .items-center.flex > span`
- http://localhost:3000/dashboard/bookmarks [state:profile-menu]
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

## Résultats incomplets à revoir (142)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:3000/dashboard/bookmarks
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_d9ulubst5tjb_-form-item`
- http://localhost:3000/dashboard/lists
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `.focus-visible\:ring-\[3px\]`
- http://localhost:3000/dashboard/tags
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `button[aria-controls="radix-_R_cklubst5tjb_"]`
- http://localhost:3000/dashboard/archive
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3000/dashboard/favourites
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3000/dashboard/highlights
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3000/dashboard/search
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3000/dashboard/search?q=accessibilit%C3%A9
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3000/dashboard/cleanups
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
- http://localhost:3000/settings/info
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `button[aria-controls="radix-_R_kclubst5tjb_"]`
  - `#current-password`
  - `#new-password`
  - `#confirm-password`
  - `.bg-destructive`
- http://localhost:3000/settings/import
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/settings/rules
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/settings/feeds
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.focus-visible\:ring-\[3px\]`
- http://localhost:3000/settings/broken-links
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/settings/api-keys
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.bg-primary`
  - `button[aria-controls="radix-_R_smklubst5tjb_"]`
  - `button[aria-controls="radix-_R_1cmklubst5tjb_"]`
  - `button[aria-controls="radix-_R_t6klubst5tjb_"]`
  - `button[aria-controls="radix-_R_1d6klubst5tjb_"]`
- http://localhost:3000/settings/backups
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/settings/stats
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/settings/assets
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `button[aria-controls="radix-_r_0_"]`
  - `button[aria-controls="radix-_r_3_"]`
  - `button[aria-controls="radix-_r_6_"]`
  - `button[aria-controls="radix-_r_9_"]`
  - `button[aria-controls="radix-_r_c_"]`
  - `button[aria-controls="radix-_r_f_"]`
  - `button[aria-controls="radix-_r_i_"]`
- http://localhost:3000/settings/webhooks
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.focus-visible\:ring-\[3px\]`
- http://localhost:3000/settings/ai
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `.min-h-10`
  - `#_R_7l4lubst5tjb_-form-item`
- http://localhost:3000/admin/overview
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/admin/users
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `button[aria-controls="radix-_R_9anpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_eqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_mqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_uqanpfkt5tjb_"]`
  - `button[aria-controls="radix-_R_9inpfkt5tjb_"]`
- http://localhost:3000/admin/background_jobs
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
- http://localhost:3000/admin/admin_tools
  - `div[aria-haspopup="dialog"]`
- http://localhost:3000/dashboard/bookmarks [state:card-actions-menu]
  - `#radix-_r_19_`
- http://localhost:3000/dashboard/bookmarks [state:edit-bookmark-dialog]
  - `#_r_1c_-form-item`
  - `#_r_1d_-form-item`
  - `#_r_1e_-form-item`
  - `#_r_1f_-form-item`
  - `.min-h-10`
- http://localhost:3000/dashboard/bookmarks [state:keyboard-shortcuts-dialog]
  - `#radix-_R_3ulubst5tjb_`
- http://localhost:3000/dashboard/lists [state:new-list-dialog]
  - `#radix-_R_8ql5tjb_`
  - `.rounded`
  - `#_r_2_-form-item`
  - `#_r_3_-form-item`
  - `button[aria-controls="radix-_r_5_"]`
- http://localhost:3000/dashboard/lists/c62jucbbqu9yf8tflmsqv48w [state:list-detail-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3000/dashboard/tags/hgbyciltjdgu97x66duu4gps [state:tag-detail-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-page]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `.min-h-10`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-modal]
  - `#radix-_r_14_`
  - `.min-h-10`
- http://localhost:3000/dashboard/bookmarks [state:theme-dark]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `a[aria-controls="radix-_R_8ql5tjb_"]`
  - `#_R_d9ulubst5tjb_-form-item`
- http://localhost:3000/dashboard/bookmarks [state:mobile-390]
  - `div[aria-controls="radix-_R_2tj5tjb_"]`
  - `#_R_d9ulubst5tjb_-form-item`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3000/dashboard/bookmarks
  - `#_R_d9ulubst5tjb_-form-item`
- http://localhost:3000/dashboard/archive
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3000/dashboard/favourites
  - `#_R_79ulubst5tjb_-form-item`
- http://localhost:3000/dashboard/lists/c62jucbbqu9yf8tflmsqv48w [state:list-detail-page]
  - `.mt-2 > span:nth-child(2)`
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3000/dashboard/tags/hgbyciltjdgu97x66duu4gps [state:tag-detail-page]
  - `.mt-2 > span:nth-child(2)`
  - `#_R_3kvav5ubst5tjb_-form-item`
- http://localhost:3000/dashboard/bookmarks [state:theme-dark]
  - `#_R_d9ulubst5tjb_-form-item`

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://localhost:3000/dashboard/bookmarks [state:card-actions-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(13)`
- http://localhost:3000/dashboard/bookmarks [state:edit-bookmark-dialog]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `.sm\:fixed`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(14)`
- http://localhost:3000/dashboard/bookmarks [state:view-options-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(13)`
- http://localhost:3000/dashboard/bookmarks [state:sort-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(13)`
- http://localhost:3000/dashboard/bookmarks [state:profile-menu]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(13)`
- http://localhost:3000/dashboard/bookmarks [state:keyboard-shortcuts-dialog]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `.sm\:fixed`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(14)`
- http://localhost:3000/dashboard/lists [state:new-list-dialog]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(1)`
  - `.sm\:fixed`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"][aria-hidden="true"]:nth-child(14)`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-modal]
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(1)`
  - `.sm\:fixed`
  - `span[data-radix-focus-guard=""][data-aria-hidden="true"]:nth-child(14)`

### bypass — Page must have means to bypass repeated blocks

- http://localhost:3000/dashboard/bookmarks [state:card-actions-menu]
  - `html`
- http://localhost:3000/dashboard/bookmarks [state:view-options-menu]
  - `html`
- http://localhost:3000/dashboard/bookmarks [state:sort-menu]
  - `html`
- http://localhost:3000/dashboard/bookmarks [state:profile-menu]
  - `html`
- http://localhost:3000/dashboard/preview/b5slvptj880pjbtroya5m9wu [state:preview-modal]
  - `html`

