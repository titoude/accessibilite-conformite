# Audit accessibilité — 2026-10-05

**0 règle(s) violée(s), 0 occurrence(s), 42/42 scénario(s) audité(s), 0 erreur(s), 61 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `53808e62bff7`

## Résultats incomplets à revoir (61)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3001/dashboard/1
  - `.btn-light`
- http://localhost:3001/dashboard/2
  - `.btn-light`
- http://localhost:3001/dashboard/3
  - `.btn-light`
- http://localhost:3001/add
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `#method`
  - `#httpBodyEncoding`
  - `#auth-method`
- http://localhost:3001/edit/2
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `#method`
  - `#httpBodyEncoding`
  - `#auth-method`
- http://localhost:3001/clone/2
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `#method`
  - `#httpBodyEncoding`
  - `#auth-method`
- http://localhost:3001/add-maintenance
  - `#affected_monitors`
  - `#selected_status_pages`
  - `#strategy`
  - `#timezone`
- http://localhost:3001/maintenance/edit/1
  - `#affected_monitors`
  - `#selected_status_pages`
  - `#strategy`
  - `#timezone`
- http://localhost:3001/settings/general
  - `#timezone`
  - `#serverTimezone`
- http://localhost:3001/settings/appearance
  - `#language`
- http://localhost:3001/dashboard [state:user-menu-dropdown]
  - `.col[data-v-fca7905c=""]:nth-child(5) > .fs-3`
  - `.col[data-v-fca7905c=""]:nth-child(5) > .num.text-secondary`
- http://localhost:3001/dashboard [state:monitor-list-filter-status]
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
- http://localhost:3001/dashboard/2 [state:delete-monitor-confirm]
  - `.btn-light`
- http://localhost:3001/dashboard [state:clear-events-confirm]
  - `div[aria-labelledby="confirm-dialog-title-4fd0841e"] > .modal-dialog > .modal-content > .modal-body`
- http://localhost:3001/settings/notifications [state:notification-dialog]
  - `#notification-type`
- http://localhost:3001/settings/proxies [state:proxy-dialog]
  - `#proxy-protocol`
- http://localhost:3001/settings/docker-hosts [state:docker-host-dialog]
  - `#docker-type`
- http://localhost:3001/settings/remote-browsers [state:remote-browser-dialog]
  - `code`
- http://localhost:3001/settings/tags [state:tag-edit-dialog]
  - `#ms-fc6e7613`
  - `#ms-ed1f2127`
- http://localhost:3001/add [state:monitor-type-docker]
  - `#type`
  - `#monitorGroupSelector`
- http://localhost:3001/add [state:monitor-type-keyword]
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `#method`
  - `#httpBodyEncoding`
  - `#auth-method`
- http://localhost:3001/status/demo [state:status-page-edit]
  - `#switch-theme`
  - `#ms-a3e1abc3`
- http://localhost:3001/status/demo [state:incident-create]
  - `#switch-theme`
  - `#ms-ed6f1189`
- http://localhost:3001/settings/appearance [state:dark-mode]
  - `#language`

