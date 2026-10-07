# Audit accessibilité — 2026-10-07

**0 règle(s) violée(s), 0 occurrence(s), 47/47 scénario(s) audité(s), 0 erreur(s), 117 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `edab3b3a0e59`

## Résultats incomplets à revoir (117)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:5006/
  - `#tag-all`
  - `.tag-b624a9c3c3bf143f.button-tag.pure-button`
  - `.seg > .active[href="/"]`
  - `#post-list-unread`
  - `#unread-tab-counter`
- http://127.0.0.1:5006/diff/e23d8590-5e71-438c-8037-e4819b235461
  - `.current-diff-url > span`
  - `#top-right-menu > .pure-menu-item.menu-collapsible:nth-child(1) > .pure-menu-link`
  - `a[href$="#screenshot"]`
  - `#extract-tab > a`
- http://127.0.0.1:5006/edit/e23d8590-5e71-438c-8037-e4819b235461
  - `#time_between_check-weeks`
  - `#time_between_check-days`
  - `#time_between_check-hours`
  - `#time_between_check-minutes`
  - `#time_between_check-seconds`
- http://127.0.0.1:5006/edit/5876f4a0-20da-47ec-a911-6d0807da03cd
  - `#time_between_check-weeks`
  - `#time_between_check-days`
  - `#time_between_check-hours`
  - `#time_between_check-minutes`
  - `#time_between_check-seconds`
- http://127.0.0.1:5006/ [state:llm-not-configured-modal-open]
  - `p:nth-child(1)`
  - `a[href$="settings#ai"]`
- http://127.0.0.1:5006/ [state:heart-overlay-open]
  - `#overlay > .content`
  - `h3:nth-child(1)`
  - `p:nth-child(4)`
  - `.content > ul > li:nth-child(1) > a`
  - `.content > ul > li:nth-child(2) > a`
  - `li:nth-child(3) > a[rel="nofollow"]`
  - `li:nth-child(4) > a[rel="nofollow"]`
  - `li:nth-child(5) > a[rel="nofollow"]`
  - `.content > ul > li:nth-child(6)`
  - `p:nth-child(7)`
  - … +1 autres
- http://127.0.0.1:5006/ [state:watchlist-checked]
  - `#records-selected`
  - `#records-selected > strong`
  - `#tag-all`
  - `.tag-b624a9c3c3bf143f.button-tag.pure-button`
  - `.seg > .active[href="/"]`
  - `#post-list-unread`
  - `#unread-tab-counter`
  - `#check-cancel`
  - `button[value="clear-errors"]`
- http://127.0.0.1:5006/ [state:bulk-browser-modal-open]
  - `.bulk-choice-row:nth-child(3)`
  - `.modal-btn-info`
- http://127.0.0.1:5006/ [state:bulk-proxy-modal-open]
  - `.modal-btn-info`
- http://127.0.0.1:5006/edit/e23d8590-5e71-438c-8037-e4819b235461#filters-and-triggers [state:edit-tab-filters-and-triggers]
  - `a[href$="#general"]`
  - `#pro-tips > strong`
- http://127.0.0.1:5006/edit/e23d8590-5e71-438c-8037-e4819b235461#conditions [state:edit-tab-conditions]
  - `a[href$="#general"]`
  - `label[for="conditions_match_logic"]`
  - `.fieldlist-header-cell:nth-child(1)`
  - `.verifyRuleRow`
  - `#save_button`
- http://127.0.0.1:5006/edit/e23d8590-5e71-438c-8037-e4819b235461#notifications [state:edit-tab-notifications]
  - `#notification-field-group > .pure-control-group > .pure-form-message-inline > p > strong`
- http://127.0.0.1:5006/edit/5876f4a0-20da-47ec-a911-6d0807da03cd#browser-steps [state:edit-rates-tab-browser-steps]
  - `a[href$="#general"]`
  - `#browsersteps-click-start`
  - `#browsersteps-click-start > h2`
  - `#save_button`
- http://127.0.0.1:5006/edit/5876f4a0-20da-47ec-a911-6d0807da03cd#request [state:edit-rates-tab-request]
  - `.inline-radio.pure-control-group:nth-child(1) > .pure-form-message-inline`
  - `.pure-form-message-inline > p:nth-child(2)`
- http://127.0.0.1:5006/settings#fetching [state:settings-tab-fetching]
  - `a[href$="#general"]`
  - `.pure-form-message-inline > p:nth-child(1)`
  - `.pure-form-message-inline > p:nth-child(2)`
- http://127.0.0.1:5006/settings#filters [state:settings-tab-filters]
  - `a[href$="#general"]`
  - `.pure-group:nth-child(1) > .pure-form-message-inline > i`
  - `#filters > .pure-group:nth-child(2) > .pure-form-message-inline > i`
- http://127.0.0.1:5006/settings#ui-options [state:settings-tab-ui-options]
  - `a[href$="#general"]`
  - `#save_button`
- http://127.0.0.1:5006/settings#api [state:settings-tab-api]
  - `a[href$="#general"]`
  - `#api > .pure-control-group:nth-child(3) > .pure-form-message-inline:nth-child(4)`
  - `.pure-control-group:nth-child(5) > strong:nth-child(3)`
- http://127.0.0.1:5006/settings#rss [state:settings-tab-rss]
  - `a[href$="#general"]`
  - `label[for="application-rss_template_type"]`
- http://127.0.0.1:5006/settings#timedate [state:settings-tab-timedate]
  - `a[href$="#general"]`
  - `#save_button`
- http://127.0.0.1:5006/settings#proxies [state:settings-tab-proxies]
  - `a[href$="#general"]`
  - `#recommended-proxy > div:nth-child(1) > p:nth-child(4)`
  - `div:nth-child(1) > p:nth-child(4) > a:nth-child(2)`
  - `p:nth-child(5) > code`
  - `#proxies > p > strong`
  - `#extra-proxies-setting > div:nth-child(1)`
  - `#requests-extra_proxies-0 > tbody > tr:nth-child(1) > th > label`
  - `#requests-extra_proxies-1 > tbody > tr:nth-child(1) > th > label`
- http://127.0.0.1:5006/settings#ai [state:settings-tab-ai]
  - `a[href$="#general"]`
  - `button[aria-controls="stab-pane-overview"]`
  - `button[aria-controls="stab-pane-provider"]`
  - `button[aria-controls="stab-pane-prompts"]`
  - `button[aria-controls="stab-pane-behaviour"]`
  - `button[aria-controls="stab-pane-usage"]`
- http://127.0.0.1:5006/settings#info [state:settings-tab-info]
  - `a[href$="#general"]`
  - `#info > p:nth-child(1) > strong`
- http://127.0.0.1:5006/diff/e23d8590-5e71-438c-8037-e4819b235461 [state:diff-filters-open]
  - `.current-diff-url > span`
  - `#top-right-menu > .pure-menu-item.menu-collapsible:nth-child(1) > .pure-menu-link`
  - `#diff-filters-toggle`
  - `label[for="diffWords"]`
  - `label[for="diffLines"]`
  - `#label-diff-ignorewhitespace`
  - `#label-diff-changes`
  - `#label-diff-removed`
  - `#label-diff-added`
  - `#label-diff-replaced`
  - … +2 autres
- http://127.0.0.1:5006/add-watch-ui/ [state:addwatchui-live-preview]
  - `#add-watch-go`
- http://127.0.0.1:5006/diff/e23d8590-5e71-438c-8037-e4819b235461 [state:diff-dark]
  - `.current-diff-url > span`
  - `#top-right-menu > .pure-menu-item.menu-collapsible:nth-child(1) > .pure-menu-link`
  - `a[href$="#screenshot"]`
  - `#extract-tab > a`

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://127.0.0.1:5006/settings
  - `#requests-time_between_check`
- http://127.0.0.1:5006/edit/e23d8590-5e71-438c-8037-e4819b235461
  - `#time_between_check`
- http://127.0.0.1:5006/edit/5876f4a0-20da-47ec-a911-6d0807da03cd
  - `#time_between_check`
- http://127.0.0.1:5006/edit/e23d8590-5e71-438c-8037-e4819b235461 [state:edit-dark]
  - `#time_between_check`
- http://127.0.0.1:5006/settings [state:settings-dark]
  - `#requests-time_between_check`

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://127.0.0.1:5006/diff/e23d8590-5e71-438c-8037-e4819b235461
  - `span[role="insertion"][aria-label="Added text"][title="Added text"]:nth-child(3)`
  - `span[role="insertion"][aria-label="Added text"][title="Added text"]:nth-child(4)`
- http://127.0.0.1:5006/diff/e23d8590-5e71-438c-8037-e4819b235461 [state:diff-filters-open]
  - `span[role="insertion"][aria-label="Added text"][title="Added text"]:nth-child(3)`
  - `span[role="insertion"][aria-label="Added text"][title="Added text"]:nth-child(4)`
- http://127.0.0.1:5006/diff/e23d8590-5e71-438c-8037-e4819b235461 [state:diff-dark]
  - `span[role="insertion"][aria-label="Added text"][title="Added text"]:nth-child(3)`
  - `span[role="insertion"][aria-label="Added text"][title="Added text"]:nth-child(4)`

