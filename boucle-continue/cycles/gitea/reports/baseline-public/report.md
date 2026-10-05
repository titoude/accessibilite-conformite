# Audit accessibilité — 2026-10-05

**15 règle(s) violée(s), 270 occurrence(s), 23/23 scénario(s) audité(s), 0 erreur(s), 177 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `be33bb496a91`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://localhost:3232/
  - `.dropdown`
- http://localhost:3232/explore/repos
  - `.upward`
- http://localhost:3232/explore/users
  - `.type`
  - `.upward`
- http://localhost:3232/explore/organizations
  - `.type`
  - `.upward`
- http://localhost:3232/user/login
  - `.dropdown`
- http://localhost:3232/user/sign_up
  - `.dropdown`
- http://localhost:3232/a11yorg
  - `.upward`
- http://localhost:3232/alice
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/issues
  - `div[aria-controls="_aria_auto_id_25"]`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/pulls
  - `div[aria-controls="_aria_auto_id_25"]`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/releases
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/wiki/Home
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/branches
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/commits/branch/main
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/milestones
  - `.jump`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/labels
  - `.jump`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/activity
  - `.floating`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/graph
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/src/branch/main/main.go
  - `.upward`
- http://localhost:3232/nonexistent-org/repo [state:not-found-404]
  - `.dropdown`
- http://localhost:3232/user/login [state:login-failed]
  - `.dropdown`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:3232/a11yorg/demo-repo/graph
  - `input[autocomplete="off"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:3232/
  - `.eight.wide.column:nth-child(1) > p > a[target="_blank"][rel="noopener noreferrer"]:nth-child(1)`
  - `.eight.wide.column:nth-child(1) > p > a[target="_blank"][rel="noopener noreferrer"]:nth-child(2)`
  - `a[target="_blank"][rel="noopener noreferrer"]:nth-child(3)`
  - `a[href$="go.dev/"]`
  - `a[href$="gitea"]:nth-child(1)`
  - `.eight.wide.column:nth-child(2) > p > a[target="_blank"][rel="noopener noreferrer"]:nth-child(2)`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/explore/repos
  - `a[href$="giteaadmin"]`
  - `a[href$="notes-perso"]`
  - `a[href$="a11yorg"]`
  - `a[href$="demo-repo"]`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/explore/users
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/explore/organizations
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/user/login
  - `a[href$="forgot_password"]`
  - `.primary`
  - `.signin-passkey`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/user/sign_up
  - `a[href$="login"]`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/a11yorg
  - `.primary`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/alice
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/a11yorg/demo-repo
  - `.text`
  - `.primary > span`
  - `a[href$="about.gitea.com"][rel="nofollow"]`
  - `.green`
  - `a[target="_blank"][rel="noopener noreferrer"][href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/a11yorg/demo-repo/issues
  - `.not-mobile.text`
  - `.primary`
  - `div[aria-controls="_aria_auto_id_14"] > .text`
  - `div[aria-controls="_aria_auto_id_17"] > .text`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/a11yorg/demo-repo/pulls
  - `.not-mobile.text`
  - `.primary`
  - `div[aria-controls="_aria_auto_id_14"] > .text`
  - `div[aria-controls="_aria_auto_id_17"] > .text`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/a11yorg/demo-repo/releases
  - `.text.not-mobile`
  - `.green`
  - `a[href$="giteaadmin"]`
  - `.ahead > a`
  - `li:nth-child(1) > .archive-link[download=""][rel="nofollow"] > strong`
  - `li:nth-child(2) > .archive-link[download=""][rel="nofollow"] > strong`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/a11yorg/demo-repo/wiki/Home
  - `.text.not-mobile`
  - `.js-btn-clone-panel > span`
  - `li > a[href$="#wiki-demo-repo"]`
  - `a[href$="about.gitea.com"][rel="nofollow"]`
  - `a[target="_blank"][rel="noopener noreferrer"][href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/a11yorg/demo-repo/branches
  - `.text.not-mobile`
  - `.table.segment.attached:nth-child(3) > table > tbody > tr > td:nth-child(1) > .flex-text-block > .gt-ellipsis.branch-name`
  - `.table.segment.attached:nth-child(3) > table > tbody > tr > td:nth-child(1) > .info.tw-my-1 > a`
  - `.eight > .flex-text-block > .gt-ellipsis.branch-name`
  - `.eight > .info.tw-my-1 > a:nth-child(2)`
  - `a[href$="giteaadmin"]:nth-child(6)`
  - `.ref-issue`
  - `.green`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - … +1 autres
- http://localhost:3232/a11yorg/demo-repo/commits/branch/main
  - `.text.not-mobile`
  - `.tw-p-1`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/a11yorg/demo-repo/milestones
  - `.text.not-mobile`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/a11yorg/demo-repo/labels
  - `.text.not-mobile`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/a11yorg/demo-repo/activity
  - `.not-mobile.text`
  - `.horizontal.segments.segment:nth-child(5) > .segment.attached.text > .green.text`
  - `.list:nth-child(7) > p > .green.label`
  - `a[href="/a11yorg/demo-repo/src/v0.1.0"]`
  - `.list:nth-child(9) > p > .green.label`
  - `a[href$="pulls/5"]`
  - `.list:nth-child(11) > p:nth-child(1) > .green.label`
  - `a[href$="issues/1"]`
  - `p:nth-child(2) > .green.label`
  - `a[href$="issues/2"]`
  - … +7 autres
- http://localhost:3232/a11yorg/demo-repo/graph
  - `.text.not-mobile`
  - `.default`
  - `#commit-40c24b028d9bdbccebeb64745646fe9514fd4c52 > .author.flex-text-inline > a[href$="giteaadmin"]`
  - `#commit-40c24b028d9bdbccebeb64745646fe9514fd4c52 > .time.flex-text-inline > relative-time`
  - `#commit-f5b750e8253d91255a0776ee9ee323ee23d8c8d0 > .author.flex-text-inline > a[href$="giteaadmin"]`
  - `#commit-f5b750e8253d91255a0776ee9ee323ee23d8c8d0 > .time.flex-text-inline > relative-time`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/a11yorg/demo-repo/src/branch/main/main.go
  - `.text.not-mobile`
  - `a[title="demo-repo"]`
  - `.kn`
  - `.kd`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/api/swagger
  - `small:nth-child(1) > .version`
  - `.version-stamp > .version`
  - `.link`
  - `.btn > span`
- http://localhost:3232/nonexistent-org/repo [state:not-found-404]
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`
- http://localhost:3232/user/login [state:login-failed]
  - `a[href$="forgot_password"]`
  - `.primary`
  - `.signin-passkey`
  - `a[href$="about.gitea.com"]`
  - `a[href$="licenses.txt"]`
  - `a[href$="swagger"]`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://localhost:3232/a11yorg/demo-repo
  - `.anchor`
- http://localhost:3232/a11yorg/demo-repo/wiki/Home
  - `.anchor`
- http://localhost:3232/a11yorg/demo-repo/branches
  - `.avatar[href$="giteaadmin"]`
- http://localhost:3232/a11yorg/demo-repo/activity
  - `.column:nth-child(1) > .stats-table > .table-cell.tiny.tw-bg-green`
  - `.column:nth-child(2) > .stats-table > .table-cell.tiny.tw-bg-green`
  - `g > a`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://localhost:3232/a11yorg/demo-repo/issues
  - `.index[href$="issues/4"]`
  - `.index[href$="issues/3"]`
  - `.flex-item:nth-child(2) > .flex-item-main > .flex-item-body > a[href$="giteaadmin"]`
  - `.flex-item:nth-child(3) > .flex-item-main > .flex-item-header > .flex-item-title > .labels-list.tw-ml-1 > a`
  - `.index[href$="issues/2"]`
  - `.flex-item:nth-child(3) > .flex-item-main > .flex-item-body > a[href$="giteaadmin"]`
  - `.index[href$="issues/1"]`
  - `.flex-item:nth-child(4) > .flex-item-main > .flex-item-body > a[href$="giteaadmin"]`
- http://localhost:3232/a11yorg/demo-repo/pulls
  - `.index`
- http://localhost:3232/a11yorg/demo-repo/branches
  - `button[data-clipboard-text="main"]`
  - `.table.segment.attached:nth-child(3) > table > tbody > tr > td:nth-child(1) > .info.tw-my-1 > a`

## [SERIOUS] tabindex — Elements should not have tabindex greater than zero

Ensure tabindex attribute values are not greater than 0
Référence : https://dequeuniversity.com/rules/axe/4.13/tabindex?application=axeAPI

- http://localhost:3232/user/login
  - `#user_name`
  - `a[href$="forgot_password"]`
  - `#password`
  - `#_aria_auto_id_0`
  - `.primary`
- http://localhost:3232/user/login [state:login-failed]
  - `#user_name`
  - `a[href$="forgot_password"]`
  - `#password`
  - `#_aria_auto_id_0`
  - `.primary`

## [SERIOUS] aria-prohibited-attr — Elements must only use permitted ARIA attributes

Ensure ARIA attributes are not prohibited for an element's role
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-prohibited-attr?application=axeAPI

- http://localhost:3232/a11yorg/demo-repo
  - `.bar`
- http://localhost:3232/a11yorg/demo-repo/src/branch/main/main.go
  - `a[data-global-click="onCopyContentButtonClick"]`
  - `.disabled.btn-octicon:nth-child(5)`
  - `.disabled.btn-octicon:nth-child(6)`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-input-field-name?application=axeAPI

- http://localhost:3232/a11yorg/demo-repo/commits/branch/main
  - `.selection`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.13/nested-interactive?application=axeAPI

- http://localhost:3232/a11yorg/demo-repo/activity
  - `svg[height="100"]`

## [SERIOUS] svg-img-alt — <svg> elements with an img or image role must have alternative text

Ensure <svg> elements with an img, image, graphics-document or graphics-symbol role have accessible text
Référence : https://dequeuniversity.com/rules/axe/4.13/svg-img-alt?application=axeAPI

- http://localhost:3232/a11yorg/demo-repo/activity
  - `svg[height="100"]`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:3232/
  - `footer`
- http://localhost:3232/explore/repos
  - `footer`
- http://localhost:3232/explore/users
  - `footer`
- http://localhost:3232/explore/organizations
  - `footer`
- http://localhost:3232/user/login
  - `footer`
- http://localhost:3232/user/sign_up
  - `footer`
- http://localhost:3232/a11yorg
  - `footer`
- http://localhost:3232/alice
  - `footer`
- http://localhost:3232/a11yorg/demo-repo
  - `footer`
- http://localhost:3232/a11yorg/demo-repo/issues
  - `footer`
- http://localhost:3232/a11yorg/demo-repo/pulls
  - `footer`
- http://localhost:3232/a11yorg/demo-repo/releases
  - `footer`
- http://localhost:3232/a11yorg/demo-repo/wiki/Home
  - `footer`
- http://localhost:3232/a11yorg/demo-repo/branches
  - `footer`
- http://localhost:3232/a11yorg/demo-repo/commits/branch/main
  - `footer`
- http://localhost:3232/a11yorg/demo-repo/milestones
  - `footer`
- http://localhost:3232/a11yorg/demo-repo/labels
  - `footer`
- http://localhost:3232/a11yorg/demo-repo/activity
  - `footer`
- http://localhost:3232/a11yorg/demo-repo/graph
  - `footer`
- http://localhost:3232/a11yorg/demo-repo/src/branch/main/main.go
  - `footer`
- http://localhost:3232/api/swagger
  - `.swagger-back-link`
  - `.information-container`
  - `.schemes-server-container`
  - `a[href$="#/activitypub"]`
  - `a[href$="#/admin"]`
  - `a[href$="#/miscellaneous"]`
  - `a[href$="#/notification"]`
  - `a[href$="#/organization"]`
  - `a[href$="#/package"]`
  - `a[href$="#/issue"]`
  - … +3 autres
- http://localhost:3232/nonexistent-org/repo [state:not-found-404]
  - `footer`
- http://localhost:3232/user/login [state:login-failed]
  - `footer`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:3232/explore/repos
  - `html`
- http://localhost:3232/explore/users
  - `html`
- http://localhost:3232/explore/organizations
  - `html`
- http://localhost:3232/user/login
  - `html`
- http://localhost:3232/user/sign_up
  - `html`
- http://localhost:3232/a11yorg
  - `html`
- http://localhost:3232/alice
  - `html`
- http://localhost:3232/a11yorg/demo-repo/issues
  - `html`
- http://localhost:3232/a11yorg/demo-repo/pulls
  - `html`
- http://localhost:3232/a11yorg/demo-repo/releases
  - `html`
- http://localhost:3232/a11yorg/demo-repo/branches
  - `html`
- http://localhost:3232/a11yorg/demo-repo/commits/branch/main
  - `html`
- http://localhost:3232/a11yorg/demo-repo/milestones
  - `html`
- http://localhost:3232/a11yorg/demo-repo/labels
  - `html`
- http://localhost:3232/a11yorg/demo-repo/activity
  - `html`
- http://localhost:3232/a11yorg/demo-repo/graph
  - `html`
- http://localhost:3232/a11yorg/demo-repo/src/branch/main/main.go
  - `html`
- http://localhost:3232/api/swagger
  - `html`
- http://localhost:3232/nonexistent-org/repo [state:not-found-404]
  - `html`
- http://localhost:3232/user/login [state:login-failed]
  - `html`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://localhost:3232/a11yorg/demo-repo/releases
  - `h4`
- http://localhost:3232/a11yorg/demo-repo/labels
  - `h4`
- http://localhost:3232/a11yorg/demo-repo/activity
  - `.top`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:3232/api/swagger
  - `html`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://localhost:3232/a11yorg/demo-repo/commits/branch/main
  - `.one`

## Résultats incomplets à revoir (177)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:3232/
  - `.dropdown`
- http://localhost:3232/explore/repos
  - `div[aria-controls="_aria_auto_id_0"]`
  - `div[aria-controls="_aria_auto_id_12"]`
  - `.upward`
- http://localhost:3232/explore/users
  - `.type`
  - `.upward`
- http://localhost:3232/explore/organizations
  - `.type`
  - `.upward`
- http://localhost:3232/user/login
  - `.dropdown`
- http://localhost:3232/user/sign_up
  - `.dropdown`
- http://localhost:3232/a11yorg
  - `div[aria-controls="_aria_auto_id_0"]`
  - `div[aria-controls="_aria_auto_id_12"]`
  - `.upward`
- http://localhost:3232/alice
  - `div[aria-controls="_aria_auto_id_0"]`
  - `div[aria-controls="_aria_auto_id_12"]`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/issues
  - `.label-filter`
  - `div[aria-controls="_aria_auto_id_14"]`
  - `div[aria-controls="_aria_auto_id_17"]`
  - `.custom`
  - `div[aria-controls="_aria_auto_id_20"]`
  - `div[aria-controls="_aria_auto_id_25"]`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/pulls
  - `.label-filter`
  - `div[aria-controls="_aria_auto_id_14"]`
  - `div[aria-controls="_aria_auto_id_17"]`
  - `.custom`
  - `div[aria-controls="_aria_auto_id_20"]`
  - `div[aria-controls="_aria_auto_id_25"]`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/releases
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/wiki/Home
  - `.floating`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/branches
  - `div[data-tooltip-content="Download Branch \"main\""]`
  - `div[data-tooltip-content="Download Branch \"feature-x\""]`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/commits/branch/main
  - `.selection`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/milestones
  - `.jump`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/labels
  - `.jump`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/activity
  - `.floating`
  - `svg[height="100"]`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/graph
  - `input[autocomplete="off"]`
  - `.upward`
- http://localhost:3232/a11yorg/demo-repo/src/branch/main/main.go
  - `.upward`
- http://localhost:3232/nonexistent-org/repo [state:not-found-404]
  - `.dropdown`
- http://localhost:3232/user/login [state:login-failed]
  - `.dropdown`

### aria-allowed-role — ARIA role should be appropriate for the element

- http://localhost:3232/explore/repos
  - `#_aria_auto_id_1`
  - `#_aria_auto_id_2`
  - `#_aria_auto_id_3`
  - `#_aria_auto_id_4`
  - `#_aria_auto_id_5`
  - `#_aria_auto_id_6`
  - `#_aria_auto_id_7`
  - `#_aria_auto_id_8`
  - `#_aria_auto_id_9`
  - `#_aria_auto_id_10`
  - … +13 autres
- http://localhost:3232/a11yorg
  - `#_aria_auto_id_1`
  - `#_aria_auto_id_2`
  - `#_aria_auto_id_3`
  - `#_aria_auto_id_4`
  - `#_aria_auto_id_5`
  - `#_aria_auto_id_6`
  - `#_aria_auto_id_7`
  - `#_aria_auto_id_8`
  - `#_aria_auto_id_9`
  - `#_aria_auto_id_10`
  - … +13 autres
- http://localhost:3232/alice
  - `#_aria_auto_id_1`
  - `#_aria_auto_id_2`
  - `#_aria_auto_id_3`
  - `#_aria_auto_id_4`
  - `#_aria_auto_id_5`
  - `#_aria_auto_id_6`
  - `#_aria_auto_id_7`
  - `#_aria_auto_id_8`
  - `#_aria_auto_id_9`
  - `#_aria_auto_id_10`
  - … +13 autres

### link-in-text-block — Links must be distinguishable without relying on color

- http://localhost:3232/user/sign_up
  - `a[href$="login"]`

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:3232/a11yorg/demo-repo
  - `form[hx-boost="true"][hx-target="this"][method="post"]:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.disabled`
  - `span[data-tooltip-content="git: 26 KiB, lfs: 0 B"]`
- http://localhost:3232/a11yorg/demo-repo/issues
  - `form[hx-boost="true"][hx-target="this"][method="post"]:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.labeled.disabled.button`
- http://localhost:3232/a11yorg/demo-repo/pulls
  - `form[hx-boost="true"][hx-target="this"][method="post"]:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.labeled.disabled.button`
- http://localhost:3232/a11yorg/demo-repo/releases
  - `form:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.disabled`
- http://localhost:3232/a11yorg/demo-repo/wiki/Home
  - `form:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.disabled`
- http://localhost:3232/a11yorg/demo-repo/branches
  - `.flex-text-inline[hx-boost="true"][hx-target="this"]:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.disabled`
- http://localhost:3232/a11yorg/demo-repo/commits/branch/main
  - `form[hx-boost="true"][hx-target="this"][method="post"]:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.disabled`
- http://localhost:3232/a11yorg/demo-repo/milestones
  - `form[hx-boost="true"][hx-target="this"][method="post"]:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.disabled`
- http://localhost:3232/a11yorg/demo-repo/labels
  - `form:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.disabled`
- http://localhost:3232/a11yorg/demo-repo/activity
  - `form:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.disabled`
- http://localhost:3232/a11yorg/demo-repo/graph
  - `form:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.disabled`
- http://localhost:3232/a11yorg/demo-repo/src/branch/main/main.go
  - `form:nth-child(2) > .labeled.button.ui`
  - `form[action="/a11yorg/demo-repo/action/star"] > .labeled.button.ui`
  - `.labeled.disabled.button`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3232/a11yorg/demo-repo
  - `a[href$="forks"]`
- http://localhost:3232/a11yorg/demo-repo/issues
  - `a[href$="forks"]`
- http://localhost:3232/a11yorg/demo-repo/pulls
  - `a[href$="forks"]`
- http://localhost:3232/a11yorg/demo-repo/releases
  - `a[href$="forks"]`
  - `.ahead > a > strong`
- http://localhost:3232/a11yorg/demo-repo/wiki/Home
  - `a[href$="forks"]`
- http://localhost:3232/a11yorg/demo-repo/branches
  - `a[href$="forks"]`
  - `.count-behind`
  - `.count-ahead`
- http://localhost:3232/a11yorg/demo-repo/commits/branch/main
  - `a[href$="forks"]`
- http://localhost:3232/a11yorg/demo-repo/milestones
  - `a[href$="forks"]`
- http://localhost:3232/a11yorg/demo-repo/labels
  - `a[href$="forks"]`
- http://localhost:3232/a11yorg/demo-repo/activity
  - `a[href$="forks"]`
  - `text`
- http://localhost:3232/a11yorg/demo-repo/graph
  - `a[href$="forks"]`
- http://localhost:3232/a11yorg/demo-repo/src/branch/main/main.go
  - `a[href$="forks"]`
- http://localhost:3232/api/swagger
  - `#schemes`

### aria-required-children — Certain ARIA roles must contain particular children

- http://localhost:3232/a11yorg/demo-repo/branches
  - `div[data-tooltip-content="Download Branch \"main\""]`
  - `div[data-tooltip-content="Download Branch \"feature-x\""]`

