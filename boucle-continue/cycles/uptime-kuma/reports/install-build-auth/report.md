# Audit accessibilité — 2026-10-05

**0 règle(s) violée(s), 0 occurrence(s), 42/42 scénario(s) audité(s), 0 erreur(s), 61 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `fec2aa50bcc9`

## Résultats incomplets à revoir (61)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3002/dashboard/1
  - `.btn-light`
- http://localhost:3002/dashboard/2
  - `.btn-light`
- http://localhost:3002/dashboard/3
  - `.btn-light`
- http://localhost:3002/add
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `#method`
  - `#httpBodyEncoding`
  - `#auth-method`
- http://localhost:3002/edit/2
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `#method`
  - `#httpBodyEncoding`
  - `#auth-method`
- http://localhost:3002/clone/2
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `#method`
  - `#httpBodyEncoding`
  - `#auth-method`
- http://localhost:3002/add-maintenance
  - `#affected_monitors`
  - `#selected_status_pages`
  - `#strategy`
  - `#timezone`
- http://localhost:3002/maintenance/edit/1
  - `#affected_monitors`
  - `#selected_status_pages`
  - `#strategy`
  - `#timezone`
- http://localhost:3002/settings/general
  - `#timezone`
  - `#serverTimezone`
- http://localhost:3002/settings/appearance
  - `#language`
- http://localhost:3002/dashboard [state:user-menu-dropdown]
  - `.col[data-v-fca7905c=""]:nth-child(5) > .fs-3`
  - `.col[data-v-fca7905c=""]:nth-child(5) > .num.text-secondary`
- http://localhost:3002/dashboard [state:monitor-list-filter-status]
  - `.bg-secondary`
  - `.flex-fill.text-truncate[data-v-cb177f7c=""] > .text-truncate[data-v-cb177f7c=""]`
- http://localhost:3002/dashboard/2 [state:delete-monitor-confirm]
  - `.btn-light`
- http://localhost:3002/dashboard [state:clear-events-confirm]
  - `div[aria-labelledby="confirm-dialog-title-17999927"] > .modal-dialog > .modal-content > .modal-body`
- http://localhost:3002/settings/notifications [state:notification-dialog]
  - `#notification-type`
- http://localhost:3002/settings/proxies [state:proxy-dialog]
  - `#proxy-protocol`
- http://localhost:3002/settings/docker-hosts [state:docker-host-dialog]
  - `#docker-type`
- http://localhost:3002/settings/remote-browsers [state:remote-browser-dialog]
  - `code`
- http://localhost:3002/settings/tags [state:tag-edit-dialog]
  - `#ms-727450b7`
  - `#ms-b5d41265`
- http://localhost:3002/add [state:monitor-type-docker]
  - `#type`
  - `#monitorGroupSelector`
- http://localhost:3002/add [state:monitor-type-keyword]
  - `#type`
  - `#acceptedStatusCodes`
  - `#ipFamily`
  - `#monitorGroupSelector`
  - `#method`
  - `#httpBodyEncoding`
  - `#auth-method`
- http://localhost:3002/status/demo [state:status-page-edit]
  - `#switch-theme`
  - `#ms-5fc920ca`
- http://localhost:3002/status/demo [state:incident-create]
  - `#switch-theme`
  - `#ms-967ab8ff`
- http://localhost:3002/settings/appearance [state:dark-mode]
  - `#language`

