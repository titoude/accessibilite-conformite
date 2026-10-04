# Audit accessibilité — 2026-10-04

**12 règle(s) violée(s), 89 occurrence(s), 25/25 scénario(s) audité(s), 0 erreur(s), 317 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `4ce8598af073`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://admin:abc123@localhost:8095/admin/config-video/
  - `#\:R7ln5f6\:`
- http://admin:abc123@localhost:8095/admin/users/
  - `#\:R1kl75f6\:`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://admin:abc123@localhost:8095/admin/plugins/
  - `.ant-tabs-nav`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=axeAPI

- http://admin:abc123@localhost:8095/admin/
  - `html`
- http://admin:abc123@localhost:8095/admin/access-tokens/
  - `html`
- http://admin:abc123@localhost:8095/admin/actions/
  - `html`
- http://admin:abc123@localhost:8095/admin/chat/emojis/
  - `html`
- http://admin:abc123@localhost:8095/admin/chat/messages/
  - `html`
- http://admin:abc123@localhost:8095/admin/config/general/
  - `html`
- http://admin:abc123@localhost:8095/admin/config/server/
  - `html`
- http://admin:abc123@localhost:8095/admin/config-chat/
  - `html`
- http://admin:abc123@localhost:8095/admin/config-featured/
  - `html`
- http://admin:abc123@localhost:8095/admin/config-federation/
  - `html`
- http://admin:abc123@localhost:8095/admin/config-notify/
  - `html`
- http://admin:abc123@localhost:8095/admin/config-social-items/
  - `html`
- http://admin:abc123@localhost:8095/admin/config-video/
  - `html`
- http://admin:abc123@localhost:8095/admin/federation/actions/
  - `html`
- http://admin:abc123@localhost:8095/admin/federation/followers/
  - `html`
- http://admin:abc123@localhost:8095/admin/hardware-info/
  - `html`
- http://admin:abc123@localhost:8095/admin/help/
  - `html`
- http://admin:abc123@localhost:8095/admin/logs/
  - `html`
- http://admin:abc123@localhost:8095/admin/plugins/
  - `html`
- http://admin:abc123@localhost:8095/admin/plugins/configure/
  - `html`
- http://admin:abc123@localhost:8095/admin/stream-health/
  - `html`
- http://admin:abc123@localhost:8095/admin/upgrade/
  - `html`
- http://admin:abc123@localhost:8095/admin/users/
  - `html`
- http://admin:abc123@localhost:8095/admin/viewer-info/
  - `html`
- http://admin:abc123@localhost:8095/admin/webhooks/
  - `html`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://admin:abc123@localhost:8095/admin/
  - `.ant-card-meta-description > span`
  - `.ant-card.ant-card-small.owncast:nth-child(4) > .ant-card-body > .ant-card-meta > .ant-card-meta-section > .ant-card-meta-description > div`
  - `.ant-card.ant-card-small.owncast:nth-child(5) > .ant-card-body > .ant-card-meta > .ant-card-meta-section > .ant-card-meta-description > div`
- http://admin:abc123@localhost:8095/admin/access-tokens/
  - `.ant-empty-description`
- http://admin:abc123@localhost:8095/admin/actions/
  - `.ant-empty-description`
- http://admin:abc123@localhost:8095/admin/chat/messages/
  - `.ant-empty-description`
- http://admin:abc123@localhost:8095/admin/config/general/
  - `.ͼ1p > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"] > .cm-line.cm-activeLine > .cm-placeholder[contenteditable="false"][aria-hidden="true"]`
  - `.field-hideViewerCount > .ant-switch-inner > .ant-switch-inner-unchecked`
  - `.field-disableSearchIndexing > .ant-switch-inner > .ant-switch-inner-unchecked`
  - `.ant-empty-description`
  - `div[aria-autocomplete="list"] > .cm-line.cm-activeLine > .cm-placeholder[contenteditable="false"][aria-hidden="true"]`
- http://admin:abc123@localhost:8095/admin/config-chat/
  - `.field-chatEstablishedUserMode > .ant-switch-inner > .ant-switch-inner-unchecked`
  - `.field-chatSlurFilterEnabled > .ant-switch-inner > .ant-switch-inner-unchecked`
  - `.field-chatRequireAuthentication > .ant-switch-inner > .ant-switch-inner-unchecked`
- http://admin:abc123@localhost:8095/admin/config-notify/
  - `.field-enabled > .ant-switch-inner > .ant-switch-inner-unchecked`
  - `.field-discordEnabled > .ant-switch-inner > .ant-switch-inner-unchecked`
  - `p:nth-child(3) > span`
- http://admin:abc123@localhost:8095/admin/config-social-items/
  - `.ant-empty-description`
- http://admin:abc123@localhost:8095/admin/federation/actions/
  - `.ant-empty-description`
- http://admin:abc123@localhost:8095/admin/federation/followers/
  - `.ant-empty-description`
- http://admin:abc123@localhost:8095/admin/help/
  - `.ant-col-lg-8.ant-col.ant-col-xs-24:nth-child(1) > .ant-card.ant-card-bordered.owncast > .ant-card-body > .ant-card-meta > .ant-card-meta-section > .ant-card-meta-description > .ant-space-vertical.ant-space-gap-row-small.ant-space-gap-col-small > .ant-space-item:nth-child(1)`
  - `.ant-col-lg-8.ant-col.ant-col-xs-24:nth-child(2) > .ant-card.ant-card-bordered.owncast > .ant-card-body > .ant-card-meta > .ant-card-meta-section > .ant-card-meta-description > .ant-space-vertical.ant-space-gap-row-small.ant-space-gap-col-small > .ant-space-item:nth-child(1)`
  - `.ant-col-lg-8.ant-col.ant-col-xs-24:nth-child(3) > .ant-card.ant-card-bordered.owncast > .ant-card-body > .ant-card-meta > .ant-card-meta-section > .ant-card-meta-description > .ant-space-vertical.ant-space-gap-row-small.ant-space-gap-col-small > .ant-space-item:nth-child(1)`
- http://admin:abc123@localhost:8095/admin/plugins/
  - `.ant-empty-description`
- http://admin:abc123@localhost:8095/admin/upgrade/
  - `.ant-empty-description`
- http://admin:abc123@localhost:8095/admin/users/
  - `.ant-empty-description`
- http://admin:abc123@localhost:8095/admin/viewer-info/
  - `.ant-col.ant-col-md-12.owncast:nth-child(1) > .ant-card.ant-card-bordered.ant-card-type-inner > .ant-card-body > div > .ant-statistic.owncast > .ant-statistic-header > .ant-statistic-title`
  - `.ant-col.ant-col-md-12.owncast:nth-child(2) > .ant-card.ant-card-bordered.ant-card-type-inner > .ant-card-body > div > .ant-statistic.owncast > .ant-statistic-header > .ant-statistic-title`
  - `.ant-dropdown-trigger`
  - `.ant-empty-description`
- http://admin:abc123@localhost:8095/admin/webhooks/
  - `.ant-empty-description`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-input-field-name?application=axeAPI

- http://admin:abc123@localhost:8095/admin/config/general/
  - `.ͼ1p > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"]`
  - `div[aria-autocomplete="list"]`
- http://admin:abc123@localhost:8095/admin/config-video/
  - `.ant-slider-handle`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.13/link-in-text-block?application=axeAPI

- http://admin:abc123@localhost:8095/admin/
  - `a[href$="general/"]`
  - `a[href$="config-federation/"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://admin:abc123@localhost:8095/admin/config/server/
  - `.ant-input-password-icon`

## [SERIOUS] aria-progressbar-name — ARIA progressbar nodes must have an accessible name

Ensure every ARIA progressbar node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-progressbar-name?application=axeAPI

- http://admin:abc123@localhost:8095/admin/hardware-info/
  - `.ant-col.owncast:nth-child(1) > .ant-card.ant-card-bordered.ant-card-type-inner > .ant-card-body > div > .ant-progress.ant-progress-status-normal.ant-progress-show-info`
  - `.ant-col.owncast:nth-child(2) > .ant-card.ant-card-bordered.ant-card-type-inner > .ant-card-body > div > .ant-progress.ant-progress-status-normal.ant-progress-show-info`
  - `.ant-col.owncast:nth-child(3) > .ant-card.ant-card-bordered.ant-card-type-inner > .ant-card-body > div > .ant-progress.ant-progress-status-normal.ant-progress-show-info`

## [SERIOUS] role-img-alt — [role="img"] and [role="image"] elements must have alternative text

Ensure [role="img"] and [role="image"] elements have alternative text
Référence : https://dequeuniversity.com/rules/axe/4.13/role-img-alt?application=axeAPI

- http://admin:abc123@localhost:8095/admin/hardware-info/
  - `canvas`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.13/heading-order?application=axeAPI

- http://admin:abc123@localhost:8095/admin/config/general/
  - `.edit-general-settings > h3`
- http://admin:abc123@localhost:8095/admin/config-chat/
  - `.edit-string-array-container:nth-child(6) > h3`
- http://admin:abc123@localhost:8095/admin/config-federation/
  - `h3`
- http://admin:abc123@localhost:8095/admin/config-social-items/
  - `h3`
- http://admin:abc123@localhost:8095/admin/config-video/
  - `.variants-table-module > h3`
- http://admin:abc123@localhost:8095/admin/federation/actions/
  - `h3`
- http://admin:abc123@localhost:8095/admin/help/
  - `div:nth-child(7) > h4`
- http://admin:abc123@localhost:8095/admin/upgrade/
  - `h5`
- http://admin:abc123@localhost:8095/admin/users/
  - `h3`
- http://admin:abc123@localhost:8095/admin/viewer-info/
  - `h3`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://admin:abc123@localhost:8095/admin/access-tokens/
  - `th:nth-child(1)`
- http://admin:abc123@localhost:8095/admin/actions/
  - `th:nth-child(1)`
- http://admin:abc123@localhost:8095/admin/config/general/
  - `th:nth-child(2)`
- http://admin:abc123@localhost:8095/admin/config-social-items/
  - `th:nth-child(2)`
- http://admin:abc123@localhost:8095/admin/config-video/
  - `th:nth-child(4)`
- http://admin:abc123@localhost:8095/admin/federation/followers/
  - `th:nth-child(1)`
- http://admin:abc123@localhost:8095/admin/plugins/
  - `th:nth-child(5)`
- http://admin:abc123@localhost:8095/admin/users/
  - `.actions-col`
- http://admin:abc123@localhost:8095/admin/webhooks/
  - `th:nth-child(1)`

## [MINOR] empty-heading — Headings should not be empty

Ensure headings have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-heading?application=axeAPI

- http://admin:abc123@localhost:8095/admin/upgrade/
  - `h2`

## Résultats incomplets à revoir (317)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://admin:abc123@localhost:8095/admin/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/access-tokens/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/actions/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/chat/emojis/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/chat/messages/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/config/general/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/config/server/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/config-chat/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/config-featured/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/config-federation/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/config-notify/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/config-social-items/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/config-video/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/federation/actions/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/federation/followers/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/hardware-info/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/help/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/logs/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/plugins/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/plugins/configure/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/stream-health/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/upgrade/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/users/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/viewer-info/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`
- http://admin:abc123@localhost:8095/admin/webhooks/
  - `div[data-menu-id="rc-menu-uuid-chat"]`
  - `div[data-menu-id="rc-menu-uuid-configuration"]`
  - `div[data-menu-id="rc-menu-uuid-utilities"]`
  - `div[data-menu-id="rc-menu-uuid-integrations"]`
  - `div[data-menu-id="rc-menu-uuid-plugins-menu"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://admin:abc123@localhost:8095/admin/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/access-tokens/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/actions/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/chat/messages/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/config/general/
  - `div:nth-child(6) > .ant-btn-primary.ant-btn-color-primary.ant-btn-variant-solid > span`
  - `.ͼ1o > .cm-scroller > .cm-gutters.cm-gutters-before[aria-hidden="true"] > .cm-lineNumbers.cm-gutter > .cm-activeLineGutter.cm-gutterElement`
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/config/server/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/config-chat/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/config-featured/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/config-federation/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/config-notify/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/config-social-items/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/config-video/
  - `.ant-select-content > span`
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/federation/followers/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/hardware-info/
  - `.ant-col.owncast:nth-child(1) > .ant-card.ant-card-bordered.ant-card-type-inner > .ant-card-body > div > .ant-progress.ant-progress-status-normal.ant-progress-show-info > .ant-progress-body.ant-progress-circle-gradient > .ant-progress-indicator > div > div:nth-child(2) > .ant-typography-secondary.ant-typography.owncast`
  - `.ant-col.owncast:nth-child(1) > .ant-card.ant-card-bordered.ant-card-type-inner > .ant-card-body > div > .ant-progress.ant-progress-status-normal.ant-progress-show-info > .ant-progress-body.ant-progress-circle-gradient > .ant-progress-indicator > div > div:nth-child(3) > .ant-typography-secondary.ant-typography.owncast`
  - `.ant-col.owncast:nth-child(2) > .ant-card.ant-card-bordered.ant-card-type-inner > .ant-card-body > div > .ant-progress.ant-progress-status-normal.ant-progress-show-info > .ant-progress-body.ant-progress-circle-gradient > .ant-progress-indicator > div > div:nth-child(2) > .ant-typography-secondary.ant-typography.owncast`
  - `.ant-col.owncast:nth-child(2) > .ant-card.ant-card-bordered.ant-card-type-inner > .ant-card-body > div > .ant-progress.ant-progress-status-normal.ant-progress-show-info > .ant-progress-body.ant-progress-circle-gradient > .ant-progress-indicator > div > div:nth-child(3) > .ant-typography-secondary.ant-typography.owncast`
  - `.ant-col.owncast:nth-child(3) > .ant-card.ant-card-bordered.ant-card-type-inner > .ant-card-body > div > .ant-progress.ant-progress-status-normal.ant-progress-show-info > .ant-progress-body.ant-progress-circle-gradient > .ant-progress-indicator > div > div:nth-child(2) > .ant-typography-secondary.ant-typography.owncast`
  - `.ant-col.owncast:nth-child(3) > .ant-card.ant-card-bordered.ant-card-type-inner > .ant-card-body > div > .ant-progress.ant-progress-status-normal.ant-progress-show-info > .ant-progress-body.ant-progress-circle-gradient > .ant-progress-indicator > div > div:nth-child(3) > .ant-typography-secondary.ant-typography.owncast`
- http://admin:abc123@localhost:8095/admin/help/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/plugins/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/stream-health/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/upgrade/
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/users/
  - `.ant-select-content`
  - `.ant-modal-body > p`
- http://admin:abc123@localhost:8095/admin/webhooks/
  - `.ant-modal-body > p`

### link-in-text-block — Links must be distinguishable without relying on color

- http://admin:abc123@localhost:8095/admin/
  - `#whats-the-catch > .hash-link[translate="no"]`
  - `#what-does-this-mean > .hash-link[translate="no"]`
  - `#resources-to-get-started > .hash-link[translate="no"]`
  - `a[aria-label="Direct link to Let's chat"]`
- http://admin:abc123@localhost:8095/admin/config/general/
  - `a[href$="owncast.directory"]`
  - `span > a[rel="noopener noreferrer"][target="_blank"]`
- http://admin:abc123@localhost:8095/admin/config-featured/
  - `a[href$="config-federation/"]`

### target-size — All touch targets must be 24px large, or leave sufficient space

- http://admin:abc123@localhost:8095/admin/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/access-tokens/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="webhooks/"]`
  - `a[href$="access-tokens/"]`
  - `a[href$="actions/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/actions/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="webhooks/"]`
  - `a[href$="access-tokens/"]`
  - `a[href$="actions/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/chat/emojis/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="messages/"]`
  - `a[href$="emojis/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/chat/messages/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="messages/"]`
  - `a[href$="emojis/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/config/general/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="general/"]`
  - `a[href$="server/"]`
  - `a[href$="config-video/"]`
  - `a[href$="config-chat/"]`
  - `a[href$="config-federation/"]`
  - `a[href$="config-notify/"]`
- http://admin:abc123@localhost:8095/admin/config/server/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="general/"]`
  - `a[href$="server/"]`
  - `a[href$="config-video/"]`
  - `a[href$="config-chat/"]`
  - `a[href$="config-federation/"]`
  - `a[href$="config-notify/"]`
- http://admin:abc123@localhost:8095/admin/config-chat/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="general/"]`
  - `a[href$="server/"]`
  - `a[href$="config-video/"]`
  - `a[href$="config-chat/"]`
  - `a[href$="config-federation/"]`
  - `a[href$="config-notify/"]`
- http://admin:abc123@localhost:8095/admin/config-featured/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/config-federation/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="general/"]`
  - `a[href$="server/"]`
  - `a[href$="config-video/"]`
  - `a[href$="config-chat/"]`
  - `a[href$="config-federation/"]`
  - `a[href$="config-notify/"]`
- http://admin:abc123@localhost:8095/admin/config-notify/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="general/"]`
  - `a[href$="server/"]`
  - `a[href$="config-video/"]`
  - `a[href$="config-chat/"]`
  - `.ant-menu-title-content > a[href$="config-federation/"]`
  - `a[href$="config-notify/"]`
- http://admin:abc123@localhost:8095/admin/config-social-items/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/config-video/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="general/"]`
  - `a[href$="server/"]`
  - `a[href$="config-video/"]`
  - `a[href$="config-chat/"]`
  - `a[href$="config-federation/"]`
  - `a[href$="config-notify/"]`
- http://admin:abc123@localhost:8095/admin/federation/actions/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/federation/followers/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/hardware-info/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="hardware-info/"]`
  - `a[href$="stream-health/"]`
  - `a[href$="logs/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/help/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/logs/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="hardware-info/"]`
  - `a[href$="stream-health/"]`
  - `a[href$="logs/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/plugins/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="plugins/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/plugins/configure/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="plugins/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/stream-health/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="hardware-info/"]`
  - `a[href$="stream-health/"]`
  - `a[href$="logs/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/upgrade/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/users/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/viewer-info/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="help/"]`
- http://admin:abc123@localhost:8095/admin/webhooks/
  - `a[href$="admin/"]`
  - `a[href$="viewer-info/"]`
  - `a[href$="users/"]`
  - `a[href$="webhooks/"]`
  - `a[href$="access-tokens/"]`
  - `a[href$="actions/"]`
  - `a[href$="help/"]`

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://admin:abc123@localhost:8095/admin/chat/messages/
  - `.ant-table-header > table`

### duplicate-id-aria — IDs used in ARIA and labels must be unique

- http://admin:abc123@localhost:8095/admin/config-notify/
  - `textarea[maxlength="200"]`

