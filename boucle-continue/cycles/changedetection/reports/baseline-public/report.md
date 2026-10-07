# Audit accessibilité — 2026-10-07

**6 règle(s) violée(s), 12 occurrence(s), 1/1 scénario(s) audité(s), 0 erreur(s), 1 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `cbb6687f9d83`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://127.0.0.1:5005/login
  - `#top-right-menu > .menu-collapsible.pure-menu-item > .toggle-ai-mode[title="Toggle AI Mode"][data-llm-configured="false"] > .ai-mode-label`
  - `.pure-control-group:nth-child(2) > .pure-button-primary.pure-button[type="submit"]`

## [SERIOUS] html-lang-valid — <html> element must have a valid value for the lang attribute

Ensure the lang attribute of the <html> element has a valid value
Référence : https://dequeuniversity.com/rules/axe/4.14/html-lang-valid?application=axeAPI

- http://127.0.0.1:5005/login
  - `html`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://127.0.0.1:5005/login
  - `#top-right-menu > .pure-menu-item:nth-child(1) > form[action="/settings/toggle-all-paused"][method="POST"] > .status-pill[type="submit"]`
  - `#top-right-menu > .pure-menu-item:nth-child(2) > form[action="/settings/toggle-all-muted"][method="POST"] > .status-pill[aria-label="Mute notifications"][title="Mute notifications"]`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://127.0.0.1:5005/login
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://127.0.0.1:5005/login
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://127.0.0.1:5005/login
  - `#top-right-menu > .pure-menu-item:nth-child(3) > a[href$="settings"][title="Settings"] > span`
  - `#overlay`
  - `.messages`
  - `label[for="password"]`
  - `#password`

## Résultats incomplets à revoir (1)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:5005/login
  - `.action-sidebar-inner > .action-sidebar-list--top.action-sidebar-list > .action-sidebar-li:nth-child(3) > .action-sidebar-item[title="Page Watches"][href="/"] > .js-unread-count.action-badge--count[title="Unread changes"]`

