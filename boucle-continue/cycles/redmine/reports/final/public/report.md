# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 18/18 scénario(s) audité(s), 0 erreur(s), 58 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `bd81a0c5e9fd`

## Résultats incomplets à revoir (58)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:6801/
  - `.drdn-trigger`
  - `.external`
- http://localhost:6801/login
  - `.drdn-trigger`
- http://localhost:6801/account/register
  - `.drdn-trigger`
  - `#user_language`
- http://localhost:6801/projects
  - `.drdn-trigger`
  - `#operators_status`
  - `#values_status_1`
  - `#add_filter_select`
  - `.external`
- http://localhost:6801/projects/office-website
  - `.drdn-trigger`
  - `.external`
- http://localhost:6801/projects/office-website/issues
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#add_filter_select`
  - `.subject > a[href$="issues/4"]`
- http://localhost:6801/issues/1
  - `.drdn-trigger`
  - `.external`
- http://localhost:6801/issues/6
  - `.drdn-trigger`
  - `#tab-history`
  - `#tab-notes`
  - `#tab-time_entries`
  - `.external`
- http://localhost:6801/projects/office-website/wiki
  - `.drdn-trigger`
  - `.external[href$="guide"]`
  - `li:nth-child(2) > .external`
- http://localhost:6801/projects/office-website/news
  - `.drdn-trigger`
  - `.external`
- http://localhost:6801/projects/office-website/issues/gantt
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
- http://localhost:6801/projects/office-website/issues/calendar
  - `.drdn-trigger`
  - `#operators_status_id`
  - `#add_filter_select`
  - `#month`
  - `#year`
- http://localhost:6801/search
  - `.drdn-trigger`
- http://localhost:6801/help/wiki_syntax/detailed
  - `td[rowspan="2"]`
  - `pre:nth-child(69) > code`
- http://localhost:6801/login [state:login-failed]
  - `.drdn-trigger`
- http://localhost:6801/projects/office-website/issues?set_filter=1 [state:mobile-nav-390]
  - `a[title="Sort by \"Priority\""]`

