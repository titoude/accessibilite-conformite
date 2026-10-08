# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 37/37 scénario(s) audité(s), 0 erreur(s), 142 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `02a86c34b431`

## Résultats incomplets à revoir (142)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:6202/
  - `.drdn-trigger`
  - `.external`
- http://localhost:6202/my/page
  - `.drdn-trigger`
  - `#block-select`
  - `.subject > a[href$="issues/4"]`
- http://localhost:6202/my/account
  - `.drdn-trigger`
  - `#user_language`
  - `#user_mail_notification`
  - `#pref_time_zone`
  - `#pref_comments_sorting`
  - `#pref_textarea_font`
  - `#pref_history_default_tab`
  - `#pref_default_issue_query`
  - `#pref_default_project_query`
- http://localhost:6202/projects
  - `.drdn-trigger`
  - `#operators_status`
  - `#values_status_1`
  - `#add_filter_select`
  - `.external`
- http://localhost:6202/projects/office-website
  - `.drdn-trigger`
  - `.external`
- http://localhost:6202/projects/office-website/issues
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#add_filter_select`
  - `.subject > a[href$="issues/4"]`
- http://localhost:6202/issues/1
  - `.drdn-trigger`
  - `.external`
- http://localhost:6202/issues/6
  - `.drdn-trigger`
  - `#tab-history`
  - `#tab-notes`
  - `#tab-time_entries`
  - `.external`
- http://localhost:6202/issues/new?project_id=office-website
  - `.drdn-trigger`
  - `#issue_tracker_id`
  - `.tab-edit`
  - `.tab-preview`
  - `#issue_status_id`
  - `#issue_priority_id`
  - `#issue_assigned_to_id`
  - `#issue_category_id`
  - `#issue_fixed_version_id`
  - `#issue_parent_issue_id`
  - … +1 autres
- http://localhost:6202/projects/office-website/issues?query_id=8
  - `.drdn-trigger`
- http://localhost:6202/projects/office-website/issues/gantt
  - `.drdn-trigger`
  - `#month`
  - `#year`
  - `.gantt-row[data-gantt-row-key="project-1"][data-gantt-row-type="project"] > .gantt-task-label.gantt-task`
  - `div[data-gantt-row-key="version-2-project-1"][data-gantt-row-type="version"][data-gantt-parent-row-key="project-1"] > .gantt-task-label.gantt-task`
  - `div[data-gantt-row-key="issue-1"][data-gantt-row-type="issue"][data-gantt-parent-row-key="version-2-project-1"] > .gantt-task-label.gantt-task`
  - `div[data-gantt-row-key="issue-10"][data-gantt-row-type="issue"][data-gantt-parent-row-key="version-2-project-1"] > .gantt-task-label.gantt-task`
  - `div[data-gantt-row-key="issue-6"][data-gantt-row-type="issue"][data-gantt-parent-row-key="version-2-project-1"] > .gantt-task-label.gantt-task`
- http://localhost:6202/projects/office-website/issues/calendar
  - `.drdn-trigger`
  - `#month`
  - `#year`
- http://localhost:6202/projects/office-website/wiki
  - `.drdn-trigger`
  - `.external[href$="guide"]`
  - `li:nth-child(2) > .external`
- http://localhost:6202/projects/office-website/news
  - `.drdn-trigger`
  - `.external`
- http://localhost:6202/projects/office-website/boards
  - `.drdn-trigger`
- http://localhost:6202/projects/office-website/boards/1
  - `.drdn-trigger`
- http://localhost:6202/projects/office-website/documents
  - `.drdn-trigger`
  - `.external`
- http://localhost:6202/projects/office-website/versions
  - `.drdn-trigger`
- http://localhost:6202/versions/1
  - `.drdn-trigger`
- http://localhost:6202/projects/office-website/time_entries
  - `.drdn-trigger`
  - `#operators_spent_on`
  - `#add_filter_select`
  - `li:nth-child(1) > .selected`
  - `.tabs.hide-when-print > ul > li:nth-child(2) > a`
- http://localhost:6202/projects/office-website/files
  - `.drdn-trigger`
- http://localhost:6202/search
  - `.drdn-trigger`
  - `#scope`
- http://localhost:6202/admin
  - `.drdn-trigger`
- http://localhost:6202/admin/projects
  - `.drdn-trigger`
  - `#operators_status`
  - `#values_status_1`
  - `#add_filter_select`
  - `.external`
- http://localhost:6202/users
  - `.drdn-trigger`
  - `#operators_status`
  - `#values_status_1`
  - `#add_filter_select`
- http://localhost:6202/users/1
  - `.drdn-trigger`
- http://localhost:6202/roles
  - `.drdn-trigger`
- http://localhost:6202/groups
  - `.drdn-trigger`
- http://localhost:6202/issues/imports/new
  - `.drdn-trigger`
- http://localhost:6202/projects/office-website/issues?set_filter=1 [state:issues-options]
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#add_filter_select`
  - `#selected_c`
  - `button[aria-label="Move to top"]`
  - `button[aria-label="Move up"]`
  - `button[aria-label="Move down"]`
  - `button[aria-label="Move to bottom"]`
  - `#group_by`
  - `.subject > a[href$="issues/4"]`
- http://localhost:6202/projects/office-website/issues?set_filter=1 [state:issues-add-filter]
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#operators_author_id`
  - `#values_author_id_1`
  - `#add_filter_select`
  - `.subject > a[href$="issues/4"]`
- http://localhost:6202/projects/office-website/issues?set_filter=1 [state:account-dropdown]
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#add_filter_select`
  - `.subject > a[href$="issues/4"]`
- http://localhost:6202/issues/6 [state:issue-edit]
  - `.drdn-trigger`
  - `#tab-history`
  - `#tab-notes`
  - `#tab-time_entries`
  - `.external`
  - `#issue_project_id`
  - `#issue_tracker_id`
  - `#issue_status_id`
  - `#issue_priority_id`
  - `#issue_assigned_to_id`
  - … +7 autres
- http://localhost:6202/issues/6 [state:watchers-autocomplete]
  - `.drdn-trigger`
  - `#tab-history`
  - `#tab-notes`
  - `#tab-time_entries`
  - `.external`
  - `#user_search`
- http://localhost:6202/projects/office-website/issues?set_filter=1 [state:sidebar-collapsed]
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#add_filter_select`
  - `.subject > a[href$="issues/4"]`
- http://localhost:6202/projects/office-website/issues?set_filter=1 [state:mobile-nav-390]
  - `a[title="Sort by \"Priority\""]`

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://localhost:6202/projects/office-website/files
  - `table`

### label-content-name-mismatch — Elements must have their visible text as part of their accessible name

- http://localhost:6202/projects/office-website/issues?set_filter=1 [state:issues-options]
  - `button[aria-label="Move to top"]`
  - `button[aria-label="Move up"]`
  - `button[aria-label="Move down"]`
  - `button[aria-label="Move to bottom"]`

### bypass — Page must have means to bypass repeated blocks

- http://localhost:6202/projects/office-website/issues?set_filter=1 [state:context-menu]
  - `html`

