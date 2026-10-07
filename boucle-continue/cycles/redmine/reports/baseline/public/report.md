# Audit accessibilité — 2026-10-07

**14 règle(s) violée(s), 758 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 70 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `b08c15ed2120`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/select-name?application=axeAPI

- http://localhost:5801/projects
  - `#operators_status`
  - `#values_status_1`
- http://localhost:5801/projects/office-website/issues
  - `#operators_status_id`
- http://localhost:5801/projects/office-website/issues/gantt
  - `#operators_status_id`
  - `#month`
  - `#year`
- http://localhost:5801/projects/office-website/issues/calendar
  - `#operators_status_id`
- http://localhost:5801/projects/office-website/issues [state:mobile-nav-390]
  - `#operators_status_id`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.14/label?application=axeAPI

- http://localhost:5801/projects/office-website/issues
  - `input[value="15"]`
  - `input[value="14"]`
  - `input[value="11"]`
  - `input[value="10"]`
  - `input[value="9"]`
  - `input[value="8"]`
  - `input[value="7"]`
  - `input[value="6"][name="ids[]"][type="checkbox"]`
  - `input[value="5"][name="ids[]"][type="checkbox"]`
  - `input[value="4"][name="ids[]"][type="checkbox"]`
  - … +3 autres
- http://localhost:5801/projects/office-website/issues/gantt
  - `#months`
- http://localhost:5801/projects/office-website/issues [state:mobile-nav-390]
  - `input[value="15"]`
  - `input[value="14"]`
  - `input[value="11"]`
  - `input[value="10"]`
  - `input[value="9"]`
  - `input[value="8"]`
  - `input[value="7"]`
  - `input[value="6"][name="ids[]"][type="checkbox"]`
  - `input[value="5"][name="ids[]"][type="checkbox"]`
  - `input[value="4"][name="ids[]"][type="checkbox"]`
  - … +3 autres

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:5801/
  - `#footer`
- http://localhost:5801/login
  - `#footer`
- http://localhost:5801/account/register
  - `em`
  - `#footer`
- http://localhost:5801/projects
  - `.other-formats`
  - `#footer`
- http://localhost:5801/projects/office-website
  - `#footer`
- http://localhost:5801/projects/office-website/issues
  - `.items`
  - `.other-formats`
  - `#footer`
- http://localhost:5801/issues/1
  - `.next > span`
  - `.avatar-color-1`
  - `.s22`
  - `.s16`
  - `.other-formats`
  - `#footer`
- http://localhost:5801/issues/6
  - `.avatar-color-1`
  - `.s22`
  - `.s16`
  - `.s24`
  - `.other-formats`
  - `#footer`
- http://localhost:5801/projects/office-website/wiki
  - `.wiki-update-info`
  - `#footer`
- http://localhost:5801/projects/office-website/news
  - `.avatar-color-1`
  - `.author`
  - `.items`
  - `.other-formats`
  - `#footer`
- http://localhost:5801/projects/office-website/issues/gantt
  - `.hascontextmenu[data-gantt-row-key="issue-1"][data-gantt--subjects-target="row"] > .issue-behind-schedule > .avatar-color-5.icon-avatar[title="Assignee: John Smith"]`
  - `.issue-behind-schedule > .tracker-1.priority-3[href$="issues/1"]`
  - `.hascontextmenu[data-gantt-row-key="issue-9"][data-gantt--subjects-target="row"] > span > .avatar-color-1.icon-avatar[title="Assignee: Admin Redmine"]`
  - `.issue-behind-schedule > .avatar-color-1.icon-avatar[title="Assignee: Admin Redmine"]`
  - `.issue-behind-schedule > .priority-2.priority-default[href$="issues/2"]`
  - `.hascontextmenu[data-gantt-row-key="issue-14"][data-gantt--subjects-target="row"] > .issue-behind-schedule > .avatar-color-5.icon-avatar[title="Assignee: John Smith"]`
  - `.issue-behind-schedule > .tracker-3.priority-2[href="/issues/14"]`
  - `span:nth-child(2) > .avatar-color-1.icon-avatar[title="Assignee: Admin Redmine"]`
  - `div[data-gantt-row-key="issue-4"][data-gantt-parent-row-key="issue-5"][data-gantt--subjects-target="row"] > span > .avatar-color-5.icon-avatar[title="Assignee: John Smith"]`
  - `.issue-behind-schedule > .tracker-1.priority-3[href="/issues/10"]`
  - … +6 autres
- http://localhost:5801/projects/office-website/issues/calendar
  - `.other-month.nwday.calbody > .day-num > .day-value`
  - `.other-month.calbody:nth-child(11) > .day-num > .day-value`
  - `.other-month.calbody:nth-child(12) > .day-num > .day-value`
  - `.other-month.calbody:nth-child(13) > .day-num > .day-value`
  - `#footer`
- http://localhost:5801/search
  - `#footer`
- http://localhost:5801/login [state:login-failed]
  - `#footer`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.14/link-in-text-block?application=axeAPI

- http://localhost:5801/
  - `.user`
  - `a[href$="redmine.org/"]`
- http://localhost:5801/login
  - `a[href$="redmine.org/"]`
- http://localhost:5801/account/register
  - `a[href$="redmine.org/"]`
- http://localhost:5801/projects
  - `.atom`
  - `a[target="_blank"][rel="noopener"][href$="redmine.org/"]`
- http://localhost:5801/projects/office-website
  - `a[href$="users/6"]`
  - `a[target="_blank"][rel="noopener"][href$="redmine.org/"]`
- http://localhost:5801/projects/office-website/issues
  - `.atom`
  - `a[href$="redmine.org/"]`
- http://localhost:5801/issues/1
  - `.atom`
  - `a[href$="redmine.org/"]`
- http://localhost:5801/issues/6
  - `.atom`
  - `a[href$="redmine.org/"]`
- http://localhost:5801/projects/office-website/wiki
  - `.new`
  - `a[href$="redmine.org/"]`
- http://localhost:5801/projects/office-website/news
  - `.atom`
  - `a[href$="redmine.org/"]`
- http://localhost:5801/projects/office-website/issues/gantt
  - `a[href$="redmine.org/"]`
- http://localhost:5801/projects/office-website/issues/calendar
  - `.status-4.overdue.priority-1 > .status-4.overdue[href$="issues/3"]`
  - `.starting.status-2.priority-2 > .status-2.priority-2[href$="issues/9"]`
  - `.starting.priority-2.priority-default > .priority-2.priority-default[href$="issues/2"]`
  - `.tracker-3.starting.priority-2 > .tracker-3.priority-2[href="/issues/14"]`
  - `.parent.starting.priority-4 > .parent.priority-4[href$="issues/5"]`
  - `.child.starting.priority-4 > .child.priority-4[href$="issues/4"]`
  - `.priority-3.priority-high3.starting > .priority-3.priority-high3[href="/issues/10"]`
  - `.priority-5.priority-highest.starting > .priority-5.priority-highest[href$="issues/6"]`
  - `.priority-5.priority-highest.ending > .priority-5.priority-highest[href$="issues/6"]`
  - `.ending.priority-3.priority-high3 > .priority-3.priority-high3[href$="issues/1"]`
  - … +10 autres
- http://localhost:5801/search
  - `a[href$="redmine.org/"]`
- http://localhost:5801/login [state:login-failed]
  - `a[href$="redmine.org/"]`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:5801/projects
  - `#sidebar-switch-button`
- http://localhost:5801/projects/office-website/issues
  - `#sidebar-switch-button`
- http://localhost:5801/issues/1
  - `#sidebar-switch-button`
- http://localhost:5801/issues/6
  - `#sidebar-switch-button`
- http://localhost:5801/projects/office-website/wiki
  - `#sidebar-switch-button`
- http://localhost:5801/projects/office-website/issues/gantt
  - `#sidebar-switch-button`
- http://localhost:5801/projects/office-website/issues/calendar
  - `#sidebar-switch-button`
- http://localhost:5801/projects/office-website/issues [state:mobile-nav-390]
  - `.mobile-toggle-button`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:5801/projects
  - `a[data-disable-with="My bookmarks"]`
  - `a[data-disable-with="My projects"]`
- http://localhost:5801/projects/office-website/issues
  - `a[data-disable-with="Issues assigned to me"]`
  - `a[data-disable-with="Open bugs"]`
  - `a[data-disable-with="Reported issues"]`
  - `a[data-disable-with="Updated issues"]`
  - `a[data-disable-with="Watched issues"]`
- http://localhost:5801/issues/1
  - `a[data-disable-with="Issues assigned to me"]`
  - `a[data-disable-with="Open bugs"]`
  - `a[data-disable-with="Reported issues"]`
  - `a[data-disable-with="Updated issues"]`
  - `a[data-disable-with="Watched issues"]`
- http://localhost:5801/issues/6
  - `a[data-disable-with="Issues assigned to me"]`
  - `a[data-disable-with="Open bugs"]`
  - `a[data-disable-with="Reported issues"]`
  - `a[data-disable-with="Updated issues"]`
  - `a[data-disable-with="Watched issues"]`
- http://localhost:5801/projects/office-website/wiki
  - `li:nth-child(1) > a[href$="wiki"]`
  - `#sidebar-wrapper > ul > li:nth-child(2) > a`
  - `#sidebar-wrapper > ul > li:nth-child(3) > a`
- http://localhost:5801/projects/office-website/issues/gantt
  - `a[data-disable-with="Issues assigned to me"]`
  - `a[data-disable-with="Open bugs"]`
  - `a[data-disable-with="Reported issues"]`
  - `a[data-disable-with="Updated issues"]`
  - `a[data-disable-with="Watched issues"]`
  - `.icon-projects > a[href$="office-website"]`
  - `a[title="11/21/2026"]`
- http://localhost:5801/projects/office-website/issues/calendar
  - `a[data-disable-with="Issues assigned to me"]`
  - `a[data-disable-with="Open bugs"]`
  - `a[data-disable-with="Reported issues"]`
  - `a[data-disable-with="Updated issues"]`
  - `a[data-disable-with="Watched issues"]`

## [SERIOUS] role-img-alt — [role="img"] and [role="image"] elements must have alternative text

Ensure [role="img"] and [role="image"] elements have alternative text
Référence : https://dequeuniversity.com/rules/axe/4.14/role-img-alt?application=axeAPI

- http://localhost:5801/issues/1
  - `.s16`
- http://localhost:5801/issues/6
  - `.s16`
  - `.s24`
- http://localhost:5801/projects/office-website/news
  - `.avatar-color-1`

## [SERIOUS] tabindex — Elements should not have tabindex greater than zero

Ensure tabindex attribute values are not greater than 0
Référence : https://dequeuniversity.com/rules/axe/4.14/tabindex?application=axeAPI

- http://localhost:5801/login
  - `#username`
  - `#password`
  - `#login-submit`
- http://localhost:5801/login [state:login-failed]
  - `#username`
  - `#password`
  - `#login-submit`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/label-title-only?application=axeAPI

- http://localhost:5801/projects/office-website/issues
  - `#check_all`
- http://localhost:5801/projects/office-website/issues [state:mobile-nav-390]
  - `#check_all`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:5801/
  - `html`
- http://localhost:5801/login
  - `html`
- http://localhost:5801/account/register
  - `html`
- http://localhost:5801/projects
  - `html`
- http://localhost:5801/projects/office-website
  - `html`
- http://localhost:5801/projects/office-website/issues
  - `html`
- http://localhost:5801/issues/1
  - `html`
- http://localhost:5801/issues/6
  - `html`
- http://localhost:5801/projects/office-website/wiki
  - `html`
- http://localhost:5801/projects/office-website/news
  - `html`
- http://localhost:5801/projects/office-website/issues/gantt
  - `html`
- http://localhost:5801/projects/office-website/issues/calendar
  - `html`
- http://localhost:5801/search
  - `html`
- http://localhost:5801/login [state:login-failed]
  - `html`
- http://localhost:5801/projects/office-website/issues [state:mobile-nav-390]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:5801/
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `h2`
  - `.splitcontentleft`
  - `.icon-news > .icon-label`
  - `.news > p`
  - `a[href$="news"]`
  - `#footer`
- http://localhost:5801/login
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `label[for="username"]`
  - `#username`
  - `label[for="password"]`
  - `#password`
  - `#footer`
- http://localhost:5801/account/register
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `h2`
  - `p:nth-child(1)`
  - `p:nth-child(2)`
  - `p:nth-child(3)`
  - `p:nth-child(4)`
  - `p:nth-child(5)`
  - … +5 autres
- http://localhost:5801/projects
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `#main-menu > ul`
  - `#sidebar-wrapper`
  - `h2`
  - `.icon-expanded`
  - `#tr_status > .field`
  - `.operator`
  - … +8 autres
- http://localhost:5801/projects/office-website
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `#main-menu > ul`
  - `h2`
  - `.splitcontentleft > .wiki`
  - `.splitcontentleft > ul`
  - `.icon-issue > .icon-label`
  - `table`
  - … +12 autres
- http://localhost:5801/projects/office-website/issues
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `#main-menu > ul`
  - `#sidebar-wrapper`
  - `h2`
  - `.icon-expanded`
  - `#tr_status_id > .field`
  - `.operator`
  - … +119 autres
- http://localhost:5801/issues/1
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `#main-menu > ul`
  - `#sidebar-wrapper`
  - `h2`
  - `.badge`
  - `.next-prev-links`
  - `.avatar-with-child`
  - … +6 autres
- http://localhost:5801/issues/6
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `#main-menu > ul`
  - `#sidebar-wrapper`
  - `h2`
  - `.badge`
  - `.next-prev-links`
  - `.avatar-with-child`
  - … +12 autres
- http://localhost:5801/projects/office-website/wiki
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `#main-menu > ul`
  - `#sidebar-wrapper`
  - `.wiki.wiki-page`
  - `legend`
  - `.wiki-update-info`
  - `#footer`
- http://localhost:5801/projects/office-website/news
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `#main-menu > ul`
  - `#content > h2`
  - `#news-list`
  - `.pagination`
  - `.other-formats`
  - `#footer`
- http://localhost:5801/projects/office-website/issues/gantt
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `#main-menu > ul`
  - `#sidebar-wrapper`
  - `h2`
  - `.icon-expanded[onclick="toggleFieldset(this);"]`
  - `.field`
  - `.operator`
  - … +38 autres
- http://localhost:5801/projects/office-website/issues/calendar
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `#main-menu > ul`
  - `#sidebar-wrapper`
  - `h2`
  - `legend`
  - `.field`
  - `.operator`
  - … +78 autres
- http://localhost:5801/search
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `#main-menu > ul`
  - `h2`
  - `.hidden-for-sighted`
  - `#search-input`
  - `#search-form > .box > p > label:nth-child(3)`
  - `#search-form > .box > p > label:nth-child(5)`
  - … +3 autres
- http://localhost:5801/login [state:login-failed]
  - `label[for="q"]`
  - `#q`
  - `.drdn-trigger`
  - `h1`
  - `#flash_error`
  - `label[for="username"]`
  - `#username`
  - `label[for="password"]`
  - `#password`
  - `#footer`
- http://localhost:5801/projects/office-website/issues [state:mobile-nav-390]
  - `#flyout-search`
  - `h3:nth-child(2)`
  - `.js-project-menu`
  - `h3:nth-child(4)`
  - `.js-general-menu`
  - `#sidebar-wrapper`
  - `h3:nth-child(7)`
  - `.js-profile-menu`
  - `.drdn-trigger`
  - `h2`
  - … +122 autres

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:5801/projects
  - `#sidebar-wrapper > h3`
- http://localhost:5801/projects/office-website/issues
  - `#sidebar-wrapper > h3`
- http://localhost:5801/issues/1
  - `#sidebar-wrapper > h3`
- http://localhost:5801/issues/6
  - `#sidebar-wrapper > h3`
- http://localhost:5801/projects/office-website/wiki
  - `#sidebar-wrapper > h3`
- http://localhost:5801/projects/office-website/issues/gantt
  - `#sidebar-wrapper > h3`
- http://localhost:5801/projects/office-website/issues/calendar
  - `#sidebar-wrapper > h3`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:5801/projects/office-website/issues [state:mobile-nav-390]
  - `html`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/empty-table-header?application=axeAPI

- http://localhost:5801/projects/office-website
  - `th:nth-child(1)`
- http://localhost:5801/projects/office-website/issues
  - `th:nth-child(9)`
- http://localhost:5801/projects/office-website/issues [state:mobile-nav-390]
  - `th:nth-child(9)`

## Résultats incomplets à revoir (70)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:5801/
  - `.drdn-trigger`
  - `.external`
- http://localhost:5801/login
  - `.drdn-trigger`
- http://localhost:5801/account/register
  - `.drdn-trigger`
  - `#user_language`
- http://localhost:5801/projects
  - `.drdn-trigger`
  - `#operators_status`
  - `#values_status_1`
  - `#add_filter_select`
  - `.external`
- http://localhost:5801/projects/office-website
  - `.drdn-trigger`
  - `.external`
- http://localhost:5801/projects/office-website/issues
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#add_filter_select`
  - `.subject > a[href$="issues/4"]`
- http://localhost:5801/issues/1
  - `.drdn-trigger`
  - `.external`
- http://localhost:5801/issues/6
  - `.drdn-trigger`
  - `#tab-history`
  - `#tab-notes`
  - `#tab-time_entries`
  - `.external`
- http://localhost:5801/projects/office-website/wiki
  - `.drdn-trigger`
  - `.external[href$="guide"]`
  - `li:nth-child(2) > .external`
- http://localhost:5801/projects/office-website/news
  - `.drdn-trigger`
  - `.external`
- http://localhost:5801/projects/office-website/issues/gantt
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#add_filter_select`
  - `#month`
  - `#year`
  - `.gantt-row[data-gantt-row-key="project-1"][data-gantt-row-type="project"] > .gantt-task-label.gantt-task`
  - `div[data-gantt-row-key="issue-7"][data-gantt-parent-row-key="project-1"][data-gantt-row-type="issue"] > .gantt-task-label.gantt-task`
  - `div[data-gantt-row-key="issue-3"][data-gantt-parent-row-key="project-1"][data-gantt-row-type="issue"] > .gantt-task-label.gantt-task`
  - `div[data-gantt-row-key="version-2-project-1"][data-gantt-row-type="version"][data-gantt-parent-row-key="project-1"] > .gantt-task-label.gantt-task`
  - `div[data-gantt-row-key="issue-1"][data-gantt-parent-row-key="version-2-project-1"][data-gantt-row-type="issue"] > .gantt-task-label.gantt-task`
  - … +10 autres
- http://localhost:5801/projects/office-website/issues/calendar
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#add_filter_select`
  - `#month`
  - `#year`
  - `.today > .day-num > .day-value`
- http://localhost:5801/search
  - `.drdn-trigger`
- http://localhost:5801/login [state:login-failed]
  - `.drdn-trigger`
- http://localhost:5801/projects/office-website/issues [state:mobile-nav-390]
  - `a[title="Sort by \"Priority\""]`

### link-in-text-block — Links must be distinguishable without relying on color

- http://localhost:5801/projects/office-website/issues/gantt
  - `.status-3`
  - `.status-4`
  - `.issue-behind-schedule > .tracker-1.priority-3[href$="issues/1"]`
  - `.hascontextmenu[data-gantt-row-key="issue-9"][data-gantt--subjects-target="row"] > span > .priority-2.priority-default[href$="issues/9"]`
  - `.issue-behind-schedule > .priority-2.priority-default[href$="issues/2"]`
  - `.issue-behind-schedule > .tracker-3.priority-2[href="/issues/14"]`
  - `span:nth-child(2) > .parent.priority-4[href$="issues/5"]`
  - `div[data-gantt-row-key="issue-4"][data-gantt-parent-row-key="issue-5"][data-gantt--subjects-target="row"] > span > .child.priority-4[href$="issues/4"]`
  - `.issue-behind-schedule > .tracker-1.priority-3[href="/issues/10"]`
  - `.issue-behind-schedule > .priority-5.priority-highest[href$="issues/6"]`
  - … +3 autres

