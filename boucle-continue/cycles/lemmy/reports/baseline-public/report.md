# Audit accessibilité — 2026-10-08

**11 règle(s) violée(s), 257 occurrence(s), 17/17 scénario(s) audité(s), 0 erreur(s), 120 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `6990c539daba`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

- http://localhost:9655/modlog
  - `#filter-user`
- http://localhost:9655/search
  - `#community-filter`
  - `#creator-filter`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9655/
  - `.data-type-select > .active`
  - `.data-type-select > label:nth-child(4)`
  - `label[title="Shows only local communities"]`
  - `label:nth-child(6)`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .person-listing[title="bench_user1"][href$="bench_user1"] > span`
  - `.post-listing.mt-2:nth-child(1) > .d-sm-block.d-none > article > .flex-grow-1.col > .row > .flex-grow-1.col > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.post-listing.mt-2:nth-child(3) > .d-sm-block.d-none > article > .flex-grow-1.col > .row > .flex-grow-1.col > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .person-listing[title="bench_user2"][href$="bench_user2"] > span`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-block.d-none > article > .flex-grow-1.col > .row > .flex-grow-1.col > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - … +12 autres
- http://localhost:9655/communities
  - `label[title="Shows only local communities"]`
  - `.pointer.btn-outline-secondary:nth-child(6)`
  - `.btn-secondary > span`
  - `.overflow-wrap-anywhere`
  - `.btn-link`
- http://localhost:9655/c/a11ybench
  - `.mb-2 > .community-link[title="a11ybench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `.data-type-select > .active`
  - `label:nth-child(4)`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="bench_user1"][href$="bench_user1"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="bench_user2"][href$="bench_user2"] > span`
  - `.paginator > .btn-secondary`
  - `a[title="Accessibility Bench"] > .overflow-wrap-anywhere`
  - `.card-body > div:nth-child(1) > .community-link[title="a11ybench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `button[data-bs-toggle="modal"]`
  - … +13 autres
- http://localhost:9655/post/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `p:nth-child(4) > .hljs > .hljs-selector-tag`
  - `label[for="1-hot"]`
  - `label[for="1-top"]`
  - `label[for="1-controversial"]`
  - `label[for="1-new"]`
  - `label[for="1-old"]`
  - `label[for="1-chat"]`
  - … +27 autres
- http://localhost:9655/post/2
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="bench_user1"][href$="bench_user1"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `.fst-italic.text-muted[rel="noopener nofollow"]`
  - `.card-text`
  - `a[href$="docs"]`
  - `label[for="2-hot"]`
  - `label[for="2-top"]`
  - `label[for="2-controversial"]`
  - `label[for="2-new"]`
  - `label[for="2-old"]`
  - … +19 autres
- http://localhost:9655/comment/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `p:nth-child(4) > .hljs > .hljs-selector-tag`
  - `label[for="1-hot"]`
  - `label[for="1-top"]`
  - `label[for="1-controversial"]`
  - `label[for="1-new"]`
  - `label[for="1-old"]`
  - `label[for="1-chat"]`
  - … +26 autres
- http://localhost:9655/u/bench_user1
  - `.list-inline-item:nth-child(1) > .person-listing.align-items-baseline[title="bench_user1"] > span`
  - `.mb-3 > div > .text-muted:nth-child(3)`
  - `.text-muted:nth-child(3) > .moment-time.unselectable.pointer`
  - `.mb-2.d-flex.align-items-center > .ms-2`
  - `label[for="bcq4nCAroaYSNFAxZOLT"]`
  - `label[for="vlZMis40QGry2VgZxY23"]`
  - `label[for="NlAta6IxSvONdQ69mP2X"]`
  - `.flex-wrap.d-flex.align-items-center:nth-child(1) > .text-info.person-listing.align-items-baseline > span`
  - `.flex-wrap.d-flex.align-items-center:nth-child(1) > .mx-1`
  - `.flex-wrap.d-flex.align-items-center:nth-child(1) > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - … +6 autres
- http://localhost:9655/u/lemmy
  - `.person-listing.align-items-baseline[rel="noopener nofollow"] > span`
  - `.mb-3 > div > .text-muted:nth-child(3)`
  - `.text-muted:nth-child(3) > .moment-time.unselectable.pointer`
  - `.mb-2.d-flex.align-items-center > .ms-2`
  - `label[for="35W0df5mJ90VnZkkV1oJ"]`
  - `label[for="Ivt7RQP7uwzzYJmuRsqj"]`
  - `label[for="1GEzj8PlAP02QZytV431"]`
  - `#comment-5 > .ms-2 > .flex-wrap.small.d-flex > .person-listing.align-items-baseline.text-info > span`
  - `#comment-5 > .ms-2 > .flex-wrap.small.d-flex > .mx-1`
  - `#comment-5 > .ms-2 > .flex-wrap.small.d-flex > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - … +13 autres
- http://localhost:9655/modlog
  - `tr:nth-child(1) > td:nth-child(3) > span:nth-child(2) > a[href$="post/3"]`
  - `tr:nth-child(2) > td:nth-child(3) > span:nth-child(2) > a[href$="post/3"]`
  - `.btn-secondary`
- http://localhost:9655/search
  - `label[title="Shows only local communities"]`
  - `.pointer.btn-outline-secondary.btn:nth-child(6)`
  - `.btn-secondary > span`
- http://localhost:9655/login
  - `.btn-link`
  - `.btn-secondary`
- http://localhost:9655/signup
  - `.form-check-label`
  - `button[type="submit"]`
- http://localhost:9655/ [state:mobile-390]
  - `.me-3`
  - `.data-type-select > .active`
  - `.data-type-select > label:nth-child(4)`
  - `label[title="Shows only local communities"]`
  - `label:nth-child(6)`
  - `.col-12 > .mb-1.mb-md-0.small > .person-listing[title="bench_user1"][href$="bench_user1"] > span`
  - `.post-listing.mt-2:nth-child(1) > .d-sm-none.d-block > article > .col-12 > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `.col-12 > .mb-1.mb-md-0.small > .person-listing[title="lemmy"][href$="lemmy"] > span`
  - `.post-listing.mt-2:nth-child(3) > .d-sm-none.d-block > article > .col-12 > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"] > .overflow-wrap-anywhere`
  - `.col-12 > .mb-1.mb-md-0.small > .person-listing[title="bench_user2"][href$="bench_user2"] > span`
  - … +2 autres
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
- http://localhost:9655/c/a11ybench
  - `.sort-select-icon`
  - `a[title="RSS"]`
  - `.flex-grow-1.col > .m-0 > .fst-italic.link-opacity-75.link-opacity-100-hover`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"]`
- http://localhost:9655/post/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"]`
- http://localhost:9655/post/2
  - `.flex-grow-1.col > .m-0 > .link-opacity-75.link-opacity-100-hover.fst-italic`
- http://localhost:9655/comment/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .person-listing[title="lemmy"][href$="lemmy"]`
- http://localhost:9655/u/bench_user1
  - `.col.flex-grow-1 > .m-0 > .fst-italic.link-opacity-75.link-opacity-100-hover`
- http://localhost:9655/u/lemmy
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .person-listing.align-items-baseline.text-info`
- http://localhost:9655/ [state:mobile-390]
  - `.sort-select-icon`
  - `a[title="RSS"]`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.14/link-in-text-block?application=axeAPI

- http://localhost:9655/
  - `a[href$="docs"]`
- http://localhost:9655/c/a11ybench
  - `a[href$="join-lemmy.org/"]`
- http://localhost:9655/post/1
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `a[href$="example.com/"]`
  - `.card-body > .md-div > p > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
- http://localhost:9655/post/2
  - `a[href$="docs"]`
  - `a[href$="join-lemmy.org/"]`
- http://localhost:9655/comment/1
  - `#postContent > .md-div > p:nth-child(1) > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
  - `a[href$="example.com/"]`
  - `.card-body > .md-div > p > a[href$="join-lemmy.org/"][rel="noopener nofollow"]`
- http://localhost:9655/u/bench_user1
  - `a[href$="example.com/"]`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/label-title-only?application=axeAPI

- http://localhost:9655/login
  - `input[type="password"]`
- http://localhost:9655/signup
  - `input[aria-describedby="register-password"]`
  - `input[aria-describedby="register-verify-password"]`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:9655/ [state:mobile-390]
  - `.post-listing.mt-2:nth-child(1) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.align-items-center > .px-1[aria-label="Upvote"][data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.px-1[data-tippy-content="2 Upvotes · 1 Downvote"][aria-label="Upvote"]`
  - `.px-1[data-tippy-content="2 Upvotes · 1 Downvote"][aria-label="Downvote"]`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-none.d-block > article > .col-12 > .justify-content-start.flex-wrap.align-items-center > .px-1[aria-label="Upvote"][data-tippy-content="1 Upvote · 0 Downvotes"]`

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
  - `h5`
- http://localhost:9655/post/2
  - `h5`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9655/instances
  - `html`
- http://localhost:9655/legal
  - `html`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/empty-table-header?application=axeAPI

- http://localhost:9655/communities
  - `th:nth-child(6)`

## Résultats incomplets à revoir (120)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:9655/
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
  - `#sidebarInfoBody`
- http://localhost:9655/c/a11ybench
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
- http://localhost:9655/post/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-2 > .ms-2 > .flex-wrap.align-items-center.small > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
  - `.border-info`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `.col:nth-child(3) > .text-danger.border-danger[aria-label="admin"]`
  - `div:nth-child(8) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-4 > .ms-2 > .flex-wrap.align-items-center.small > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
- http://localhost:9655/post/2
  - `.text-primary`
  - `.text-danger`
  - `span[aria-label="1 Upvote"]`
- http://localhost:9655/comment/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `span[aria-label="1 Upvote"]`
  - `.border-info`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `.col:nth-child(3) > .text-danger.border-danger[aria-label="admin"]`
  - `div:nth-child(8) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
- http://localhost:9655/u/bench_user1
  - `span[aria-label="2 Upvotes"]`
- http://localhost:9655/u/lemmy
  - `.list-inline-item:nth-child(2) > .gx-1.ms-1.row > .col > .text-danger.border-danger[aria-label="admin"]`
  - `.flex-wrap.small.d-flex > .gx-1.ms-1.row > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-wrap.small.d-flex > .gx-1.ms-1.row > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
  - `span[aria-label="1 Upvote"]`
  - `.border-info`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `.col:nth-child(3) > .text-danger.border-danger[aria-label="admin"]`
  - `span[aria-label="2 Upvotes"]`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.row > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.row > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`
- http://localhost:9655/ [state:mobile-390]
  - `.col-12 > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.col-12 > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(2) > .text-danger.border-danger[aria-label="admin"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9655/
  - `#sort-select-YffnAxP8u3meaOelB90e`
  - `.post-listing.mt-2:nth-child(1) > .d-sm-block.d-none > article > .flex-grow-0.col > .vote-bar.text-center.small > .post-score.unselectable[data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.align-items-center > a[title="1 Comment"][data-tippy-content="1 Comment"][href="/post/2?scrollToComments=true"]`
  - `.post-score.unselectable[data-tippy-content="2 Upvotes · 1 Downvote"]`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.align-items-center > a[title="4 Comments"][data-tippy-content="4 Comments"][href="/post/1?scrollToComments=true"]`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-block.d-none > article > .flex-grow-0.col > .vote-bar.text-center.small > .post-score.unselectable[data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.align-items-center > a[title="0 Comments"][data-tippy-content="0 Comments"][href="/post/3?scrollToComments=true"]`
- http://localhost:9655/communities
  - `#sort-select-wGpWLAeplwowLPknW6Oz`
- http://localhost:9655/c/a11ybench
  - `#sort-select-Q0azkYFFQBywZbSQUaXA`
  - `.post-listing.mt-2:nth-child(1) > .d-sm-block.d-none > article > .flex-grow-0.col > .vote-bar.text-center.small > .post-score.unselectable[data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.align-items-center > a[title="1 Comment"][data-tippy-content="1 Comment"][href="/post/2?scrollToComments=true"]`
  - `.post-score.unselectable[data-tippy-content="2 Upvotes · 1 Downvote"]`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.align-items-center > a[title="4 Comments"][data-tippy-content="4 Comments"][href="/post/1?scrollToComments=true"]`
  - `.post-listing.mt-2:nth-child(5) > .d-sm-block.d-none > article > .flex-grow-0.col > .vote-bar.text-center.small > .post-score.unselectable[data-tippy-content="1 Upvote · 0 Downvotes"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.align-items-center > a[title="0 Comments"][data-tippy-content="0 Comments"][href="/post/3?scrollToComments=true"]`
- http://localhost:9655/post/1
  - `.post-score`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.align-items-center > .ps-0[title="4 Comments"][data-tippy-content="4 Comments"]`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-1 > .ms-2 > .flex-wrap.align-items-center.small > div:nth-child(7) > .unselectable > .mx-2`
  - `#comment-2 > .ms-2 > .flex-wrap.align-items-center.small > div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="1 Upvote"][data-tippy-content="1 Upvote"]`
  - `#comment-2 > .ms-2 > .flex-wrap.align-items-center.small > div:nth-child(7) > .unselectable > .mx-2`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `div:nth-child(8) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `div:nth-child(8) > .unselectable > .mx-2`
  - … +2 autres
- http://localhost:9655/post/2
  - `.post-score`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > .ps-0[title="1 Comment"][data-tippy-content="1 Comment"]`
  - `.text-primary`
  - `span[aria-label="1 Upvote"]`
  - `.unselectable > .mx-2`
- http://localhost:9655/comment/1
  - `.post-score`
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .gx-1.row.ms-1 > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.align-items-center > a[title="4 Comments"][data-tippy-content="4 Comments"][href="/post/1?scrollToComments=true"]`
  - `div:nth-child(7) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `#comment-1 > .ms-2 > .flex-wrap.align-items-center.small > div:nth-child(7) > .unselectable > .mx-2`
  - `span[aria-label="1 Upvote"]`
  - `#comment-2 > .ms-2 > .flex-wrap.align-items-center.small > div:nth-child(7) > .unselectable > .mx-2`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `div:nth-child(8) > .unselectable > span:nth-child(1) > span[aria-label="2 Upvotes"][data-tippy-content="2 Upvotes"]`
  - `div:nth-child(8) > .unselectable > .mx-2`
- http://localhost:9655/u/bench_user1
  - `#sort-select-tdITDvo424jV3i44fFmn`
  - `span[aria-label="2 Upvotes"]`
  - `.unselectable > .mx-2`
  - `.post-score`
  - `.col.flex-grow-1 > .justify-content-start.flex-wrap.d-flex > a[title="1 Comment"][data-tippy-content="1 Comment"][href="/post/2?scrollToComments=true"]`
- http://localhost:9655/u/lemmy
  - `#sort-select-nz7eZR46txfI7jszWFn8`
  - `.flex-wrap.small.d-flex > .gx-1.ms-1.row > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `span[aria-label="1 Upvote"]`
  - `#comment-5 > .ms-2 > .flex-wrap.small.d-flex > div:nth-child(12) > .unselectable > .mx-2`
  - `.col:nth-child(2) > .text-primary.border-primary[aria-label="mod"]`
  - `span[aria-label="2 Upvotes"]`
  - `#comment-3 > .ms-2 > .flex-wrap.small.d-flex > div:nth-child(12) > .unselectable > .mx-2`
  - `.post-score`
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .gx-1.ms-1.row > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.flex-grow-1.col > .justify-content-start.flex-wrap.d-flex > a[title="4 Comments"][data-tippy-content="4 Comments"][href="/post/1?scrollToComments=true"]`
- http://localhost:9655/modlog
  - `select`
  - `#filter-user`
- http://localhost:9655/search
  - `select[aria-label="Type"]`
  - `#sort-select-isCOtKyYxvu9lYbFI74B`
  - `#community-filter`
  - `#creator-filter`
- http://localhost:9655/signup
  - `#register-username`
  - `#register-email`
  - `input[aria-describedby="register-password"]`
  - `input[aria-describedby="register-verify-password"]`
  - `#markdown-textarea-yWFdiolvtPw0UtIuDQ5x`
- http://localhost:9655/ [state:mobile-390]
  - `#sort-select-HWmNrRgd1EwAmOPwNmhw`
  - `.col-12 > .justify-content-start.flex-wrap.align-items-center > a[title="1 Comment"][data-tippy-content="1 Comment"][href="/post/2?scrollToComments=true"]`
  - `.col-12 > .mb-1.mb-md-0.small > .gx-1.ms-1.d-inline-flex > .col:nth-child(1) > .text-primary.border-primary[aria-label="mod"]`
  - `.col-12 > .justify-content-start.flex-wrap.align-items-center > a[title="4 Comments"][data-tippy-content="4 Comments"][href="/post/1?scrollToComments=true"]`
  - `.col-12 > .justify-content-start.flex-wrap.align-items-center > a[title="0 Comments"][data-tippy-content="0 Comments"][href="/post/3?scrollToComments=true"]`

### link-in-text-block — Links must be distinguishable without relying on color

- http://localhost:9655/
  - `.post-listing.mt-2:nth-child(3) > .d-sm-block.d-none > article > .flex-grow-1.col > .row > .flex-grow-1.col > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`
- http://localhost:9655/post/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`
- http://localhost:9655/comment/1
  - `.flex-grow-1.col > .mb-md-0.mb-1.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`
- http://localhost:9655/u/lemmy
  - `.flex-grow-1.col > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`
- http://localhost:9655/ [state:mobile-390]
  - `.post-listing.mt-2:nth-child(3) > .d-sm-none.d-block > article > .col-12 > .mb-1.mb-md-0.small > .community-link[title="Accessibility Bench"][href$="a11ybench"]`

### duplicate-id-aria — IDs used in ARIA and labels must be unique

- http://localhost:9655/search
  - `.col-sm-6:nth-child(1) > .searchable-select.dropdown.col-12 > .modlog-choices-font-size.dropdown-menu.w-100 > .input-group > .form-control[type="text"][value=""]`

### aria-required-children — Certain ARIA roles must contain particular children

- http://localhost:9655/instances
  - `.nav`

