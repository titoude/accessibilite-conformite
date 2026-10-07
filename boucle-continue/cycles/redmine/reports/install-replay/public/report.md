# Audit accessibilité — 2026-10-07

**0 règle(s) violée(s), 0 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 56 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `fa33c4b8f33a`

## Résultats incomplets à revoir (56)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:5802/
  - `.drdn-trigger`
  - `.external`
- http://localhost:5802/login
  - `.drdn-trigger`
- http://localhost:5802/account/register
  - `.drdn-trigger`
  - `#user_language`
- http://localhost:5802/projects
  - `.drdn-trigger`
  - `#operators_status`
  - `#values_status_1`
  - `#add_filter_select`
  - `.external`
- http://localhost:5802/projects/office-website
  - `.drdn-trigger`
  - `.external`
- http://localhost:5802/projects/office-website/issues
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#add_filter_select`
  - `.subject > a[href$="issues/4"]`
- http://localhost:5802/issues/1
  - `.drdn-trigger`
  - `.external`
- http://localhost:5802/issues/6
  - `.drdn-trigger`
  - `#tab-history`
  - `#tab-notes`
  - `#tab-time_entries`
  - `.external`
- http://localhost:5802/projects/office-website/wiki
  - `.drdn-trigger`
  - `.external[href$="guide"]`
  - `li:nth-child(2) > .external`
- http://localhost:5802/projects/office-website/news
  - `.drdn-trigger`
  - `.external`
- http://localhost:5802/projects/office-website/issues/gantt
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
- http://localhost:5802/projects/office-website/issues/calendar
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#add_filter_select`
  - `#month`
  - `#year`
- http://localhost:5802/search
  - `.drdn-trigger`
- http://localhost:5802/login [state:login-failed]
  - `.drdn-trigger`
- http://localhost:5802/projects/office-website/issues?set_filter=1 [state:mobile-nav-390]
  - `a[title="Sort by \"Priority\""]`

