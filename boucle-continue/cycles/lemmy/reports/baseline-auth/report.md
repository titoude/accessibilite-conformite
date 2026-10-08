# Audit accessibilité — 2026-10-08

**16 règle(s) violée(s), 453 occurrence(s), 22/22 scénario(s) audité(s), 0 erreur(s), 227 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `6083bcde6d33`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

- http://localhost:9655/create_post
  - `#post-community`
- http://localhost:9655/modlog
  - `#filter-user`
  - `#filter-mod`
- http://localhost:9655/create_post [state:community-combobox]
  - `#post-community`
- http://localhost:9655/create_post [state:markdown-preview]
  - `#post-community`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.14/label?application=axeAPI

- http://localhost:9655/settings
  - `#image-upload-form-0USmFiBnGAfzeWSGzWle`
  - `#image-upload-form-2t8fQy2es3HgDDJlH5HU`
- http://localhost:9655/create_community
  - `#image-upload-form-ynup12aODSh8Wb30OI0c`
  - `#image-upload-form-6GwuS8xdgPlS1y9V52kq`
  - `#community-nsfw`
- http://localhost:9655/admin
  - `#image-upload-form-Imi4kAs7InEIZKZYgHe4`
  - `#image-upload-form-m0jo9YH8XVpABwWIKnfs`
  - `#create-site-application-email-admins`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-attr?application=axeAPI

- http://localhost:9655/settings
  - `button[aria-controls="settings-tab-pane"]`
- http://localhost:9655/admin
  - `button[aria-controls="site-tab-pane"]`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:9655/settings
  - `.nav`
- http://localhost:9655/admin
  - `.admin-settings > div > .nav.nav-tabs[role="tablist"]`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/select-name?application=axeAPI

- http://localhost:9655/create_community
  - `#community-visibility`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:9655/create_post [state:community-combobox]
  - `.active.dropdown-item[role="option"]`
  - `.dropdown-item[role="option"][type="button"]:nth-child(3)`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9655/
  - `.data-type-select > .active`
  - `.data-type-select > label:nth-child(4)`
  - `.listing-type-select > label:nth-child(2)`
  - `label[title="Shows only local communities"]`
  - `label:nth-child(6)`
  - `label:nth-child(8)`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .person-listing[title="bench_user1"][href$="bench_user1"] > span`
  - `.post-listing.mt-2:nth-child(1) > .d-sm-block.d-none > article > .flex-grow-1.col > .row > .flex-grow-1.col > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.post-listing.mt-2:nth-child(3) > .d-sm-block.d-none > article > .flex-grow-1.col > .row > .flex-grow-1.col > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - … +15 autres
- http://localhost:9655/inbox
  - `.btn-secondary.mb-sm-3.mb-2`
  - `label[for="invu8nmhJHi48NRi4CBC-unread"]`
  - `label[for="invu8nmhJHi48NRi4CBC-all"]`
  - `label[for="KfnA3LlOvSEh486sVNlH-all"]`
  - `label[for="KfnA3LlOvSEh486sVNlH-replies"]`
  - `label[for="KfnA3LlOvSEh486sVNlH-mentions"]`
  - `label[for="KfnA3LlOvSEh486sVNlH-messages"]`
  - `a[title="bench_user2"] > span`
  - `#comment-4 > .ms-2 > .d-flex.flex-wrap.small > .mx-1`
  - `#comment-4 > .ms-2 > .d-flex.flex-wrap.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - … +9 autres
- http://localhost:9655/settings
  - `button[aria-controls="blocks-tab-pane"]`
  - `a[href$="try-matrix/"]`
  - `.btn-outline-secondary.pointer.btn:nth-child(2)`
  - `label[title="Shows only local communities"]`
  - `.pointer.btn-outline-secondary.btn:nth-child(6)`
  - `.pointer.btn-outline-secondary.btn:nth-child(8)`
  - `.me-4`
  - `.col-md-6.col-12:nth-child(2) > .card.border-secondary.mb-3:nth-child(1) > .card-body > form > .input-group.mb-3 > .btn-secondary.btn[type="submit"]`
  - `.my-2.btn-secondary[type="button"]`
  - `.mb-4`
- http://localhost:9655/create_community
  - `.me-2`
- http://localhost:9655/create_private_message/3
  - `.person-listing > span`
- http://localhost:9655/admin
  - `button[aria-controls="banned_users-tab-pane"]`
  - `button[aria-controls="rate_limiting-tab-pane"]`
  - `button[aria-controls="taglines-tab-pane"]`
  - `button[aria-controls="emojis-tab-pane"]`
  - `button[aria-controls="uploads-tab-pane"]`
  - `#markdown-form-GE9I7IthPoAYCsAv1FaY > .mb-3.row > .mt-2.flex-wrap.d-flex > .ms-2.btn-secondary[type="button"]`
  - `#markdown-form-4UnbhDrCI2FprgOVqrQP > .mb-3.row > .mt-2.flex-wrap.d-flex > .ms-2.btn-secondary[type="button"]`
  - `label[title="Shows only local communities"]`
  - `.btn-outline-secondary.pointer:nth-child(4)`
  - `.btn-outline-secondary.pointer:nth-child(6)`
  - … +2 autres
- http://localhost:9655/reports
  - `label[for="2RsfmdM23631uxgnjjf5-unread"]`
  - `label[for="2RsfmdM23631uxgnjjf5-all"]`
  - `label[for="AiYQgVx6gh8mAqcg2HST-all"]`
  - `label[for="AiYQgVx6gh8mAqcg2HST-comments"]`
  - `label[for="AiYQgVx6gh8mAqcg2HST-posts"]`
  - `label[for="AiYQgVx6gh8mAqcg2HST-messages"]`
- http://localhost:9655/registration_applications
  - `label[for="CwhJJcvSN3HcVN2VTDzu-unread"]`
  - `label[for="CwhJJcvSN3HcVN2VTDzu-all"]`
  - `label[for="CwhJJcvSN3HcVN2VTDzu-denied"]`
- http://localhost:9655/post/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `p:nth-child(4) > code > .hljs-selector-tag`
  - `label[for="1-hot"]`
  - `label[for="1-top"]`
  - `label[for="1-controversial"]`
  - `label[for="1-new"]`
  - `label[for="1-old"]`
  - `label[for="1-chat"]`
  - … +26 autres
- http://localhost:9655/comment/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `p:nth-child(4) > code > .hljs-selector-tag`
  - `label[for="1-hot"]`
  - `label[for="1-top"]`
  - `label[for="1-controversial"]`
  - `label[for="1-new"]`
  - `label[for="1-old"]`
  - `label[for="1-chat"]`
  - … +25 autres
- http://localhost:9655/modlog
  - `tr:nth-child(1) > td:nth-child(2) > .person-listing.align-items-baseline.text-info > span`
  - `tr:nth-child(1) > td:nth-child(3) > span:nth-child(2) > a[href$="post/3"]`
  - `tr:nth-child(2) > td:nth-child(2) > .person-listing.align-items-baseline.text-info > span`
  - `tr:nth-child(2) > td:nth-child(3) > span:nth-child(2) > a[href$="post/3"]`
  - `.btn-secondary`
- http://localhost:9655/c/a11ybench
  - `.mb-2 > .community-link[title="a11ybench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `.data-type-select > .active`
  - `label:nth-child(4)`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="bench_user1"][href$="bench_user1"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="bench_user2"][href$="bench_user2"] > span`
  - `.paginator > .btn-secondary`
  - `a[title="Accessibility Bench"] > .overflow-wrap-anywhere`
  - `.card-body > div > .community-link[title="a11ybench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `.list-inline-item > .d-inline-block:nth-child(1)`
  - … +14 autres
- http://localhost:9655/ [state:nav-user-menu]
  - `.data-type-select > .active`
  - `.data-type-select > label:nth-child(4)`
  - `.listing-type-select > label:nth-child(2)`
  - `label[title="Shows only local communities"]`
  - `label:nth-child(6)`
  - `label:nth-child(8)`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .person-listing[title="bench_user1"][href$="bench_user1"] > span`
  - `.post-listing.mt-2:nth-child(1) > .d-sm-block.d-none > article > .flex-grow-1.col > .row > .flex-grow-1.col > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.post-listing.mt-2:nth-child(3) > .d-sm-block.d-none > article > .flex-grow-1.col > .row > .flex-grow-1.col > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - … +15 autres
- http://localhost:9655/post/1 [state:post-more-menu]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `p:nth-child(4) > code > .hljs-selector-tag`
  - `label[for="1-hot"]`
  - `label[for="1-top"]`
  - `label[for="1-controversial"]`
  - `label[for="1-new"]`
  - `label[for="1-old"]`
  - `label[for="1-chat"]`
  - `a[title="bench_user1"] > span`
  - … +25 autres
- http://localhost:9655/post/1 [state:comment-more-menu]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `p:nth-child(4) > code > .hljs-selector-tag`
  - `label[for="1-hot"]`
  - `label[for="1-top"]`
  - `label[for="1-controversial"]`
  - `a[title="bench_user1"] > span`
  - `#comment-2 > .ms-2 > .flex-wrap.small.d-flex > .person-listing[title="bench_user2"][href$="bench_user2"] > span`
  - `#comment-2 > .ms-2 > .flex-wrap.small.d-flex > span:nth-child(8) > .moment-time.unselectable.pointer`
  - … +21 autres
- http://localhost:9655/post/1 [state:comment-reply-editor]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `p:nth-child(4) > code > .hljs-selector-tag`
  - `label[for="1-hot"]`
  - `label[for="1-top"]`
  - `label[for="1-controversial"]`
  - `label[for="1-new"]`
  - `label[for="1-old"]`
  - `label[for="1-chat"]`
  - … +27 autres
- http://localhost:9655/inbox [state:inbox-all-filter]
  - `label[for="fdLkmdaI0yXuYiRm2abJ-unread"]`
  - `label[for="fdLkmdaI0yXuYiRm2abJ-all"]`
  - `label[for="QwWRQ2rrKFMfuDyVC7v7-all"]`
  - `label[for="QwWRQ2rrKFMfuDyVC7v7-replies"]`
  - `label[for="QwWRQ2rrKFMfuDyVC7v7-mentions"]`
  - `label[for="QwWRQ2rrKFMfuDyVC7v7-messages"]`
  - `div:nth-child(1) > .list-inline.mb-0 > .list-inline-item:nth-child(1)`
  - `.list-inline-item:nth-child(2) > .person-listing[title="bench_user1"][href$="bench_user1"] > span`
  - `.list-inline-item:nth-child(3) > span > .moment-time.unselectable.pointer`
  - `.private-message > div:nth-child(1) > div > .md-div > p > a[href$="example.com/"]`
  - … +12 autres
- http://localhost:9655/ [state:mobile-390]
  - `.me-3.btn-secondary.mb-2:nth-child(1)`
  - `.me-3.btn-secondary.mb-2:nth-child(2)`
  - `.data-type-select > .active`
  - `.data-type-select > label:nth-child(4)`
  - `.listing-type-select > label:nth-child(2)`
  - `label[title="Shows only local communities"]`
  - `label:nth-child(6)`
  - `label:nth-child(8)`
  - `.col-12 > .mb-1.mb-md-0.small > .person-listing[title="bench_user1"][href$="bench_user1"] > span`
  - `.post-listing.mt-2:nth-child(1) > .d-sm-none.d-block > article > .col-12 > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - … +5 autres
- http://localhost:9655/this-route-does-not-exist-c55 [state:route-404]
  - `.error-page > a[href="/"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:9655/
  - `.sort-select-icon`
  - `a[title="RSS"]`
  - `.flex-grow-1.col > .m-0 > .fst-italic.link-opacity-75[rel="noopener nofollow"]`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .person-listing[title="lemmy"][href$="lemmy"]`
- http://localhost:9655/inbox
  - `.px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Upvote"]`
  - `.px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Downvote"]`
  - `.px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Upvote"]`
  - `.px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
- http://localhost:9655/post/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"]`
  - `#comment-1 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-2 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-3 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-4 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Downvote"]`
- http://localhost:9655/comment/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"]`
  - `#comment-1 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.fw-bold > .px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
  - `.px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-3 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.fw-bold > .px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
- http://localhost:9655/c/a11ybench
  - `.sort-select-icon`
  - `a[title="RSS"]`
  - `.flex-grow-1.col > .m-0 > .fst-italic.link-opacity-75.link-opacity-100-hover`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"]`
- http://localhost:9655/ [state:nav-user-menu]
  - `.sort-select-icon`
  - `a[title="RSS"]`
  - `.flex-grow-1.col > .m-0 > .fst-italic.link-opacity-75[rel="noopener nofollow"]`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .person-listing[title="lemmy"][href$="lemmy"]`
- http://localhost:9655/post/1 [state:post-more-menu]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"]`
  - `button[data-tippy-content="superscript"]`
  - `button[data-tippy-content="spoiler"]`
  - `a[title="formatting help"]`
  - `#comment-1 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-2 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-3 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-4 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Downvote"]`
- http://localhost:9655/post/1 [state:comment-more-menu]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"]`
  - `button[data-tippy-content="header"]`
  - `a[title="formatting help"]`
  - `#comment-1 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-2 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-3 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-4 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Downvote"]`
- http://localhost:9655/post/1 [state:comment-reply-editor]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"]`
  - `#comment-1 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-2 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-3 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
  - `#comment-4 > .ms-2 > .comment-bottom-btns.column-gap-1\.5.mt-1 > .px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Downvote"]`
- http://localhost:9655/inbox [state:inbox-all-filter]
  - `.px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Upvote"]`
  - `.px-1[data-tippy-content="1 Upvote · 0 Downvotes"][aria-label="Downvote"]`
  - `.px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Upvote"]`
  - `.px-1[data-tippy-content="2 Upvotes · 0 Downvotes"][aria-label="Downvote"]`
- http://localhost:9655/ [state:mobile-390]
  - `.sort-select-icon`
  - `a[title="RSS"]`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.14/link-in-text-block?application=axeAPI

- http://localhost:9655/
  - `a[href$="docs"]`
- http://localhost:9655/inbox
  - `a[href$="example.com/"]`
- http://localhost:9655/post/1
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `a[href$="example.com/"]`
  - `.card-body > .md-div > p > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
- http://localhost:9655/comment/1
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `a[href$="example.com/"]`
  - `.card-body > .md-div > p > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
- http://localhost:9655/c/a11ybench
  - `a[href$="join-lemmy.org/"]`
- http://localhost:9655/ [state:nav-user-menu]
  - `a[href$="docs"]`
- http://localhost:9655/post/1 [state:post-more-menu]
  - `a[href$="example.com/"]`
  - `.card-body > .md-div > p > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
- http://localhost:9655/post/1 [state:comment-more-menu]
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `.card-body > .md-div > p > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
- http://localhost:9655/post/1 [state:comment-reply-editor]
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `a[href$="example.com/"]`
  - `.card-body > .md-div > p > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
- http://localhost:9655/inbox [state:inbox-all-filter]
  - `.private-message > div:nth-child(1) > div > .md-div > p > a[href$="example.com/"]`
  - `a[href$="example.com/"][rel="noopener nofollow"]`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:9655/settings
  - `.nav > .nav-item:nth-child(1)`
  - `.nav > .nav-item:nth-child(2)`
- http://localhost:9655/admin
  - `.admin-settings > div > .nav.nav-tabs[role="tablist"] > .nav-item:nth-child(1)`
  - `.admin-settings > div > .nav.nav-tabs[role="tablist"] > .nav-item:nth-child(2)`
  - `.admin-settings > div > .nav.nav-tabs[role="tablist"] > .nav-item:nth-child(3)`
  - `.admin-settings > div > .nav.nav-tabs[role="tablist"] > .nav-item:nth-child(4)`
  - `.admin-settings > div > .nav.nav-tabs[role="tablist"] > .nav-item:nth-child(5)`
  - `.admin-settings > div > .nav.nav-tabs[role="tablist"] > .nav-item:nth-child(6)`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/label-title-only?application=axeAPI

- http://localhost:9655/settings
  - `input[aria-describedby="new-password"]`
  - `input[aria-describedby="verify-new-password"]`
  - `input[aria-describedby="user-old-password"]`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:9655/ [state:mobile-390]
  - `.post-listing.mt-2:nth-child(1) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .px-1[aria-label="Upvote"][data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.px-1[data-tippy-content="2 Upvotes · 1 Downvote"][aria-label="Upvote"]`
  - `.px-1[data-tippy-content="2 Upvotes · 1 Downvote"][aria-label="Downvote"]`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .px-1[aria-label="Upvote"][data-tippy-content="1 Upvote · 0 Downvotes"]`

## [SERIOUS] document-title — Documents must have <title> element to aid in navigation

Ensure each HTML document contains a non-empty <title> element
Référence : https://dequeuniversity.com/rules/axe/4.14/document-title?application=axeAPI

- http://localhost:9655/this-route-does-not-exist-c55 [state:route-404]
  - `html`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.14/html-has-lang?application=axeAPI

- http://localhost:9655/this-route-does-not-exist-c55 [state:route-404]
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:9655/
  - `.mb-2 > h5`
- http://localhost:9655/ [state:nav-user-menu]
  - `.mb-2 > h5`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9655/settings
  - `html`

## Résultats incomplets à revoir (227)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:9655/
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
  - `#sidebarInfoBody`
  - `#sidebarSubscribedBody`
- http://localhost:9655/inbox
  - `span[aria-label="1 Upvote"]`
  - `span[aria-label="2 Upvotes"]`
- http://localhost:9655/post/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-2 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
  - `.border-info`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `.col:nth-child(3) > .text-danger.border-danger[aria-label="admin"]`
  - `.text-info[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-4 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
- http://localhost:9655/comment/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `span[aria-label="1 Upvote"]`
  - `.border-info`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `.col:nth-child(3) > .text-danger.border-danger[aria-label="admin"]`
  - `.text-info[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
- http://localhost:9655/c/a11ybench
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.ms-1.row > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.ms-1.row > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
- http://localhost:9655/ [state:nav-user-menu]
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
  - `#sidebarInfoBody`
  - `#sidebarSubscribedBody`
- http://localhost:9655/post/1 [state:post-more-menu]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(2) > .border-danger[aria-label="admin"][data-tippy-content="admin"]`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-2 > .ms-2 > .flex-wrap.small.d-flex > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
  - `.border-info`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `.col:nth-child(3) > .border-danger[aria-label="admin"][data-tippy-content="admin"]`
  - `.text-info[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-4 > .ms-2 > .flex-wrap.small.d-flex > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
- http://localhost:9655/post/1 [state:comment-more-menu]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(2) > .border-danger[aria-label="admin"][data-tippy-content="admin"]`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-2 > .ms-2 > .flex-wrap.small.d-flex > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
  - `.border-info`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `.col:nth-child(3) > .border-danger[aria-label="admin"][data-tippy-content="admin"]`
  - `.text-info[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-4 > .ms-2 > .flex-wrap.small.d-flex > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
- http://localhost:9655/post/1 [state:comment-reply-editor]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-2 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
  - `.border-info`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `.col:nth-child(3) > .text-danger.border-danger[aria-label="admin"]`
  - `.text-info[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-4 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
- http://localhost:9655/inbox [state:inbox-all-filter]
  - `span[aria-label="1 Upvote"]`
  - `span[aria-label="2 Upvotes"]`
- http://localhost:9655/ [state:mobile-390]
  - `.col-12 > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.col-12 > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9655/
  - `#sort-select-rDubpOBp9PKGF1osdvpq`
  - `.post-listing.mt-2:nth-child(1) > .d-sm-block.d-none > article > .flex-grow-0.col > .vote-bar.text-center.small > .post-score.unselectable[data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > a[title="1 Comment"][data-tippy-content="1 Comment"][href="/post/2?scrollToComments=true"]`
  - `.post-score.unselectable[data-tippy-content="2 Upvotes · 1 Downvote"]`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > a[title="4 Comments"][data-tippy-content="4 Comments"][href="/post/1?scrollToComments=true"]`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-block.d-none > article > .flex-grow-0.col > .vote-bar.text-center.small > .post-score.unselectable[data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > a[title="0 Comments"][data-tippy-content="0 Comments"][href="/post/3?scrollToComments=true"]`
- http://localhost:9655/inbox
  - `#sort-select-803s1CpR5SYGMoys5ijq`
  - `span[aria-label="1 Upvote"]`
  - `#comment-4 > .ms-2 > .d-flex.flex-wrap.small > div:nth-child(11) > .unselectable > .mx-2`
  - `span[aria-label="2 Upvotes"]`
  - `#comment-1 > .ms-2 > .d-flex.flex-wrap.small > div:nth-child(11) > .unselectable > .mx-2`
- http://localhost:9655/settings
  - `#user-language`
  - `#user-theme`
  - `#sort-select-PON0bInR3amEYd5Yj6NX`
- http://localhost:9655/create_post
  - `#language-select-mCqwIIdbqLk0uv97slAY`
  - `#post-community`
- http://localhost:9655/create_community
  - `#community-visibility`
- http://localhost:9655/admin
  - `#create-site-registration-mode`
  - `#create-site-default-theme`
- http://localhost:9655/post/1
  - `.post-score`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > .ps-0[title="4 Comments"][data-tippy-content="4 Comments"]`
  - `#language-select-DpSlKfjcowDuEQDXQC9o`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-1 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > .mx-2`
  - `#comment-2 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
  - `#comment-2 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > .mx-2`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `.text-info[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - … +3 autres
- http://localhost:9655/comment/1
  - `.post-score`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > a[title="4 Comments"][data-tippy-content="4 Comments"][href="/post/1?scrollToComments=true"]`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-1 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > .mx-2`
  - `span[aria-label="1 Upvote"]`
  - `#comment-2 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > .mx-2`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `.text-info[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `div:nth-child(8) > .unselectable > .mx-2`
- http://localhost:9655/modlog
  - `select`
  - `#filter-user`
  - `#filter-mod`
- http://localhost:9655/c/a11ybench
  - `#sort-select-rE12mnG5f1QYJ3jn7tU9`
  - `.post-listing.mt-2:nth-child(1) > .d-sm-block.d-none > article > .flex-grow-0.col > .vote-bar.text-center.small > .post-score.unselectable[data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > a[title="1 Comment"][data-tippy-content="1 Comment"][href="/post/2?scrollToComments=true"]`
  - `.post-score.unselectable[data-tippy-content="2 Upvotes · 1 Downvote"]`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.ms-1.row > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > a[title="4 Comments"][data-tippy-content="4 Comments"][href="/post/1?scrollToComments=true"]`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-block.d-none > article > .flex-grow-0.col > .vote-bar.text-center.small > .post-score.unselectable[data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > a[title="0 Comments"][data-tippy-content="0 Comments"][href="/post/3?scrollToComments=true"]`
- http://localhost:9655/ [state:nav-user-menu]
  - `#sort-select-upPNd7jCc0lbKNf67pAE`
  - `.post-listing.mt-2:nth-child(1) > .d-sm-block.d-none > article > .flex-grow-0.col > .vote-bar.text-center.small > .post-score.unselectable[data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > a[title="1 Comment"][data-tippy-content="1 Comment"][href="/post/2?scrollToComments=true"]`
  - `.post-score.unselectable[data-tippy-content="2 Upvotes · 1 Downvote"]`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > a[title="4 Comments"][data-tippy-content="4 Comments"][href="/post/1?scrollToComments=true"]`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-block.d-none > article > .flex-grow-0.col > .vote-bar.text-center.small > .post-score.unselectable[data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > a[title="0 Comments"][data-tippy-content="0 Comments"][href="/post/3?scrollToComments=true"]`
- http://localhost:9655/post/1 [state:post-more-menu]
  - `.post-score`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > .ps-0[title="4 Comments"][data-tippy-content="4 Comments"]`
  - `#postContent > .md-div > p:nth-child(1)`
  - `strong`
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `th:nth-child(2)`
  - `td:nth-child(2)`
  - `#language-select-XMoVDEUzn4BFpXwH2EUM`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - … +8 autres
- http://localhost:9655/post/1 [state:comment-more-menu]
  - `.post-score`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > .ps-0[title="4 Comments"][data-tippy-content="4 Comments"]`
  - `th:nth-child(2)`
  - `td:nth-child(2)`
  - `#markdown-textarea-y9e1d144EfgIdjZs66cz`
  - `#language-select-j5vOjajanWxeESDQwJ3f`
  - `label[for="1-new"]`
  - `label[for="1-old"]`
  - `label[for="1-chat"]`
  - … +13 autres
- http://localhost:9655/post/1 [state:comment-reply-editor]
  - `.post-score`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > .ps-0[title="4 Comments"][data-tippy-content="4 Comments"]`
  - `#language-select-PpVI57zrb7hx6jY66huz`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-1 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > .mx-2`
  - `#language-select-DhvA9BRajSF2EaTFjnjj`
  - `#comment-2 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
  - `#comment-2 > .ms-2 > .flex-wrap.d-flex.align-items-center:nth-child(1) > div:nth-child(7) > .unselectable > .mx-2`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - … +4 autres
- http://localhost:9655/create_post [state:community-combobox]
  - `#language-select-UmPQe08BkXXMb59cRpov`
  - `#post-community`
- http://localhost:9655/create_post [state:markdown-preview]
  - `#language-select-CmbsiNXIoTQWiiAZ55Vf`
  - `#post-community`
- http://localhost:9655/inbox [state:inbox-all-filter]
  - `#sort-select-CpkGQrj8dnpk2uXgELFa`
  - `span[aria-label="1 Upvote"]`
  - `#comment-4 > .ms-2 > .d-flex.flex-wrap.align-items-center:nth-child(1) > div:nth-child(11) > .unselectable > .mx-2`
  - `span[aria-label="2 Upvotes"]`
  - `#comment-1 > .ms-2 > .d-flex.flex-wrap.align-items-center:nth-child(1) > div:nth-child(11) > .unselectable > .mx-2`
- http://localhost:9655/ [state:mobile-390]
  - `#sort-select-XvnDIoQy5eKPQOrMp2dK`
  - `.col-12 > .justify-content-start.flex-wrap.d-flex > a[title="1 Comment"][data-tippy-content="1 Comment"][href="/post/2?scrollToComments=true"]`
  - `.post-listing.mt-2:nth-child(1) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .px-1[aria-label="Upvote"][data-tippy-content="1 Upvote · 0 Downvotes"] > .ms-2`
  - `.col-12 > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.col-12 > .justify-content-start.flex-wrap.d-flex > a[title="4 Comments"][data-tippy-content="4 Comments"][href="/post/1?scrollToComments=true"]`
  - `.px-1[data-tippy-content="2 Upvotes · 1 Downvote"][aria-label="Upvote"] > .ms-2`
  - `.px-1[data-tippy-content="2 Upvotes · 1 Downvote"][aria-label="Downvote"] > .ms-2`
  - `.col-12 > .justify-content-start.flex-wrap.d-flex > a[title="0 Comments"][data-tippy-content="0 Comments"][href="/post/3?scrollToComments=true"]`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .px-1[aria-label="Upvote"][data-tippy-content="1 Upvote · 0 Downvotes"] > .ms-2`

### duplicate-id-aria — IDs used in ARIA and labels must be unique

- http://localhost:9655/
  - `.post-listing.mt-2:nth-child(1) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
  - `.post-listing.mt-2:nth-child(3) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
- http://localhost:9655/settings
  - `.col-md-6.col-12:nth-child(1) > .card.border-secondary.mb-3 > .card-body > div > .row.mb-3 > .col-md-8 > .searchable-select.col-sm-auto.dropdown > .modlog-choices-font-size.w-100.dropdown-menu > .input-group > input[placeholder="Search..."][value=""][type="text"]`
- http://localhost:9655/admin
  - `input[value="180"][min="0"][type="number"]`
  - `.col-md-6:nth-child(2) > input[value="60"][min="0"][type="number"]`
- http://localhost:9655/post/1
  - `.col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
- http://localhost:9655/comment/1
  - `.col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
- http://localhost:9655/modlog
  - `.mb-3.col-sm-6:nth-child(1) > .searchable-select.col-12.col-sm-auto > .modlog-choices-font-size.w-100.p-2 > .input-group > input`
- http://localhost:9655/c/a11ybench
  - `.post-listing.mt-2:nth-child(1) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
  - `.post-listing.mt-2:nth-child(3) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
- http://localhost:9655/ [state:nav-user-menu]
  - `.post-listing.mt-2:nth-child(1) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
  - `.post-listing.mt-2:nth-child(3) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
- http://localhost:9655/post/1 [state:post-more-menu]
  - `.col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
- http://localhost:9655/post/1 [state:comment-more-menu]
  - `.col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
- http://localhost:9655/post/1 [state:comment-reply-editor]
  - `.col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
- http://localhost:9655/ [state:mobile-390]
  - `.post-listing.mt-2:nth-child(1) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
  - `.post-listing.mt-2:nth-child(3) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.d-flex > .dropdown > .dropdown-menu`

### link-in-text-block — Links must be distinguishable without relying on color

- http://localhost:9655/
  - `.post-listing.mt-2:nth-child(3) > .d-sm-block.d-none > article > .flex-grow-1.col > .row > .flex-grow-1.col > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`
- http://localhost:9655/post/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`
- http://localhost:9655/comment/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`
- http://localhost:9655/ [state:nav-user-menu]
  - `.post-listing.mt-2:nth-child(3) > .d-sm-block.d-none > article > .flex-grow-1.col > .row > .flex-grow-1.col > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`
- http://localhost:9655/post/1 [state:post-more-menu]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
- http://localhost:9655/post/1 [state:comment-more-menu]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`
  - `a[href$="example.com/"]`
- http://localhost:9655/post/1 [state:comment-reply-editor]
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`
- http://localhost:9655/ [state:mobile-390]
  - `.post-listing.mt-2:nth-child(3) > .d-sm-none.d-block > article > .col-12 > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`

