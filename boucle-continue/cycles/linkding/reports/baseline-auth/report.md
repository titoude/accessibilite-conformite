# Audit accessibilité — 2026-10-07

**14 règle(s) violée(s), 1695 occurrence(s), 30/30 scénario(s) audité(s), 0 erreur(s), 129 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d9b3b9bb7709`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/button-name?application=axeAPI

- http://localhost:9090/bookmarks
  - `.btn-clear`
- http://localhost:9090/bookmarks/archived
  - `.btn-clear`
- http://localhost:9090/bookmarks/shared
  - `.btn-clear`
- http://localhost:9090/bookmarks/new
  - `.btn-clear`
- http://localhost:9090/bookmarks/1/edit
  - `.btn-clear`
- http://localhost:9090/bookmarks/19/edit
  - `.btn-clear`
- http://localhost:9090/tags
  - `.btn-clear`
- http://localhost:9090/bundles
  - `.btn-clear`
- http://localhost:9090/bundles/new
  - `.btn-clear`
- http://localhost:9090/bundles/1/edit
  - `.btn-clear`
- http://localhost:9090/settings/general
  - `.btn-clear`
- http://localhost:9090/settings/integrations
  - `.btn-clear`
- http://localhost:9090/change-password/
  - `.btn-clear`
- http://localhost:9090/api/
  - `.dropdown-toggle`
- http://localhost:9090/api/bookmarks/
  - `.dropdown-toggle`
- http://localhost:9090/bookmarks [state:nav-bookmarks-menu]
  - `.btn-clear`
- http://localhost:9090/bookmarks [state:nav-settings-menu]
  - `.btn-clear`
- http://localhost:9090/bookmarks [state:filter-drawer]
  - `.btn-clear`
- http://localhost:9090/bookmarks [state:details-modal]
  - `.btn-clear`
- http://localhost:9090/bookmarks [state:bulk-edit]
  - `.btn-clear`
- http://localhost:9090/bookmarks [state:confirm-dropdown]
  - `.btn-clear`
- http://localhost:9090/bookmarks/new [state:tag-autocomplete]
  - `.btn-clear`
- http://localhost:9090/bookmarks [state:theme-dark]
  - `.btn-clear`
- http://localhost:9090/bookmarks [state:theme-dark-dialog]
  - `.btn-clear`
- http://localhost:9090/bookmarks [state:mobile-nav-390]
  - `.btn-clear`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.14/label?application=axeAPI

- http://localhost:9090/settings/general
  - `input[type="file"]`
- http://localhost:9090/api/bookmarks/
  - `input[name="url"]`
  - `input[name="title"]`
  - `textarea[name="description"]`
  - `textarea[name="notes"]`
  - `input[name="is_archived"]`
  - `input[name="unread"]`
  - `input[name="shared"]`
  - `input[name="date_added"]`
  - `input[name="date_modified"]`
- http://localhost:9090/bookmarks [state:bulk-edit]
  - `.all > input[type="checkbox"]`
  - `input[value="29"][name="bookmark_id"][type="checkbox"]`
  - `input[value="28"][name="bookmark_id"][type="checkbox"]`
  - `input[value="27"][name="bookmark_id"][type="checkbox"]`
  - `input[value="26"][name="bookmark_id"][type="checkbox"]`
  - `input[value="24"][name="bookmark_id"][type="checkbox"]`
  - `input[value="23"][name="bookmark_id"][type="checkbox"]`
  - `input[value="22"][name="bookmark_id"][type="checkbox"]`
  - `input[value="18"][name="bookmark_id"][type="checkbox"]`
  - `input[value="17"][name="bookmark_id"][type="checkbox"]`
  - … +16 autres

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/select-name?application=axeAPI

- http://localhost:9090/bookmarks/shared
  - `#id_user`
- http://localhost:9090/bookmarks [state:bulk-edit]
  - `select[name="bulk_action"]`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9090/bookmarks
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23reading-list"]`
  - … +59 autres
- http://localhost:9090/bookmarks/archived
  - `li[data-bookmark-id="30"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `.tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="25"] > .content > .tags > a[href="?q=%23devops"]`
  - `.shared > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="20"] > .content > .tags > a[href="?q=%23devops"]`
  - `.tags > a[href="?q=%23docker"]`
  - `.tags > a[href="?q=%23documentation"]`
  - `.tags > a[href="?q=%23tools"]`
  - `.disabled.page-item:nth-child(1) > a[href="#"]`
  - `.disabled.page-item:nth-child(3) > a[href="#"]`
  - … +6 autres
- http://localhost:9090/bookmarks/shared
  - `li[data-bookmark-id="35"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="34"] > .content > .tags > a[href="?q=%23selfhosted"]`
  - `li[data-bookmark-id="34"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="33"] > .content > .tags > a[href="?q=%23accessibility"]`
  - `.tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="32"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="31"] > .content > .tags > a[href="?q=%23django"]`
  - `li[data-bookmark-id="31"] > .content > .tags > a[href="?q=%23python"]`
  - `li[data-bookmark-id="23"] > .content > .tags > a[href="?q=%23accessibility"]`
  - `.tags > a[href="?q=%23javascript"]`
  - … +21 autres
- http://localhost:9090/tags
  - `p`
  - `.disabled.page-item:nth-child(1) > a[href="#"]`
  - `.disabled.page-item:nth-child(3) > a[href="#"]`
- http://localhost:9090/bundles/new
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23reading-list"]`
  - … +43 autres
- http://localhost:9090/bundles/1/edit
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="23"] > .content > .tags > a[href="?q=%23accessibility"]`
  - `li[data-bookmark-id="23"] > .content > .tags > a[href="?q=%23javascript"]`
  - `a[href="?q=%23tools"]`
  - `a[href="?q=%23python"]`
  - `li[data-bookmark-id="17"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="15"] > .content > .tags > a[href="?q=%23accessibility"]`
  - … +9 autres
- http://localhost:9090/api/
  - `.active > a[href$="api/"]`
- http://localhost:9090/api/bookmarks/
  - `.active > a[href$="bookmarks/"]`
- http://localhost:9090/bookmarks [state:nav-bookmarks-menu]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23reading-list"]`
  - … +59 autres
- http://localhost:9090/bookmarks [state:nav-settings-menu]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23reading-list"]`
  - … +59 autres
- http://localhost:9090/bookmarks [state:filter-drawer]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23reading-list"]`
  - … +59 autres
- http://localhost:9090/bookmarks [state:details-modal]
  - `.unread[data-bookmark-id="29"][role="listitem"] > .content > .tags > a[href="?q=%23devops"]`
  - `.unread[data-bookmark-id="29"][role="listitem"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23reading-list"]`
  - … +61 autres
- http://localhost:9090/bookmarks [state:bulk-edit]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23reading-list"]`
  - … +59 autres
- http://localhost:9090/bookmarks [state:confirm-dropdown]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23reading-list"]`
  - … +59 autres
- http://localhost:9090/bookmarks [state:theme-dark]
  - `.disabled.page-item:nth-child(1) > a[href="#"]`
  - `.disabled.page-item:nth-child(3) > a[href="#"]`
- http://localhost:9090/bookmarks [state:theme-dark-dialog]
  - `.disabled.page-item:nth-child(1) > a[href="#"]`
  - `.disabled.page-item:nth-child(3) > a[href="#"]`
  - `.btn-error`
- http://localhost:9090/bookmarks [state:mobile-nav-390]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23reading-list"]`
  - … +43 autres

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:9090/bookmarks
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `a[href="/bookmarks?details=27"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - … +66 autres
- http://localhost:9090/bookmarks/archived
  - `li[data-bookmark-id="30"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `.tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="30"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `li[data-bookmark-id="25"] > .content > .tags > a[href="?q=%23devops"]`
  - `.shared > .content > .tags > a[href="?q=%23reading-list"]`
  - `.shared > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `li[data-bookmark-id="20"] > .content > .tags > a[href="?q=%23devops"]`
  - `.tags > a[href="?q=%23docker"]`
  - `.tags > a[href="?q=%23documentation"]`
  - `.tags > a[href="?q=%23tools"]`
- http://localhost:9090/bookmarks/shared
  - `li[data-bookmark-id="35"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="35"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `li[data-bookmark-id="34"] > .content > .tags > a[href="?q=%23selfhosted"]`
  - `li[data-bookmark-id="34"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="33"] > .content > .tags > a[href="?q=%23accessibility"]`
  - `.tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="32"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="31"] > .content > .tags > a[href="?q=%23django"]`
  - `li[data-bookmark-id="31"] > .content > .tags > a[href="?q=%23python"]`
  - `li[data-bookmark-id="23"] > .content > .tags > a[href="?q=%23accessibility"]`
  - … +17 autres
- http://localhost:9090/bundles/new
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="26"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - … +51 autres
- http://localhost:9090/bundles/1/edit
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="26"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="24"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - `li[data-bookmark-id="23"] > .content > .tags > a[href="?q=%23accessibility"]`
  - `a[href="?q=%23tools"]`
  - `li[data-bookmark-id="23"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - `a[href="?q=%23python"]`
  - … +13 autres
- http://localhost:9090/bundles/preview
  - `li[data-bookmark-id="29"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - `li[data-bookmark-id="26"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - `li[data-bookmark-id="24"] > .content > .tags > a[href="?q=%23javascript"]`
  - `li[data-bookmark-id="24"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - `li[data-bookmark-id="23"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - `.title > a[href$="act.rs/"]`
  - `li[data-bookmark-id="22"] > .content > .actions > a[target="_blank"][rel="noopener"]`
  - … +34 autres
- http://localhost:9090/bookmarks [state:nav-bookmarks-menu]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `a[href="/bookmarks?details=27"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - … +66 autres
- http://localhost:9090/bookmarks [state:nav-settings-menu]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `a[href="/bookmarks?details=27"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - … +66 autres
- http://localhost:9090/bookmarks [state:filter-drawer]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `a[href="/bookmarks?details=27"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - … +66 autres
- http://localhost:9090/bookmarks [state:details-modal]
  - `.unread[data-bookmark-id="29"][role="listitem"] > .content > .tags > a[href="?q=%23devops"]`
  - `.unread[data-bookmark-id="29"][role="listitem"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `a[href="/bookmarks?details=27"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - … +67 autres
- http://localhost:9090/bookmarks [state:bulk-edit]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `a[href="/bookmarks?details=27"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - … +66 autres
- http://localhost:9090/bookmarks [state:confirm-dropdown]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `a[href="/bookmarks?details=27"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - … +66 autres
- http://localhost:9090/bookmarks [state:theme-dark]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `a[href="/bookmarks?details=27"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - … +66 autres
- http://localhost:9090/bookmarks [state:theme-dark-dialog]
  - `.unread[data-bookmark-id="29"][role="listitem"] > .content > .tags > a[href="?q=%23devops"]`
  - `.unread[data-bookmark-id="29"][role="listitem"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `a[href="/bookmarks?details=27"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23reading-list"]`
  - `li[data-bookmark-id="26"] > .content > .tags > a[href="?q=%23webdev"]`
  - … +67 autres
- http://localhost:9090/bookmarks [state:mobile-nav-390]
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23devops"]`
  - `li[data-bookmark-id="29"] > .content > .tags > a[href="?q=%23tools"]`
  - `button[value="29"][name="archive"][type="submit"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23css"]`
  - `li[data-bookmark-id="28"] > .content > .tags > a[href="?q=%23tools"]`
  - `button[value="28"][name="archive"][type="submit"]`
  - `button[value="28"][name="remove"][data-confirm=""]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="27"] > .content > .tags > a[href="?q=%23security"]`
  - `li[data-bookmark-id="27"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - … +69 autres

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-dialog-name?application=axeAPI

- http://localhost:9090/tags/new
  - `.modal-container`
- http://localhost:9090/tags/1/edit
  - `.modal-container`
- http://localhost:9090/tags/merge
  - `.modal-container`
- http://localhost:9090/bookmarks [state:filter-drawer]
  - `.modal-container`
- http://localhost:9090/bookmarks [state:details-modal]
  - `.modal-container`
- http://localhost:9090/bookmarks [state:theme-dark-dialog]
  - `.modal-container`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.14/html-has-lang?application=axeAPI

- http://localhost:9090/tags/new
  - `html`
- http://localhost:9090/tags/1/edit
  - `html`
- http://localhost:9090/tags/merge
  - `html`
- http://localhost:9090/bundles/preview
  - `html`
- http://localhost:9090/api/
  - `html`
- http://localhost:9090/api/bookmarks/
  - `html`

## [SERIOUS] document-title — Documents must have <title> element to aid in navigation

Ensure each HTML document contains a non-empty <title> element
Référence : https://dequeuniversity.com/rules/axe/4.14/document-title?application=axeAPI

- http://localhost:9090/tags/new
  - `html`
- http://localhost:9090/tags/1/edit
  - `html`
- http://localhost:9090/tags/merge
  - `html`
- http://localhost:9090/bundles/preview
  - `html`

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.14/link-in-text-block?application=axeAPI

- http://localhost:9090/settings/general
  - `#id_legacy_search_help > a[target="_blank"]`
  - `#id_enable_favicons_help > a[target="_blank"]`
  - `a[href$="web.archive.org/"]`
  - `a[href$="donate"]`
  - `#id_enable_public_sharing_help > a[href$="shared"]`
- http://localhost:9090/settings/integrations
  - `p:nth-child(4) > a[target="_blank"]`
  - `ul:nth-child(7) > li:nth-child(1) > a[target="_blank"]`
  - `a[href$="feedtoken/"]`
- http://localhost:9090/bookmarks [state:details-modal]
  - `.col-2:nth-child(6) > .markdown > p > a[href$="guide"][rel="nofollow"]`
- http://localhost:9090/bookmarks [state:theme-dark-dialog]
  - `.col-2:nth-child(6) > .markdown > p > a[href$="guide"][rel="nofollow"]`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:9090/bundles/preview
  - `.mb-4`
- http://localhost:9090/api/
  - `.breadcrumb`
- http://localhost:9090/api/bookmarks/
  - `.breadcrumb`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-main-is-top-level?application=axeAPI

- http://localhost:9090/api/
  - `.content-main`
- http://localhost:9090/api/bookmarks/
  - `.content-main`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://localhost:9090/api/
  - `#content`
- http://localhost:9090/api/bookmarks/
  - `#content`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-one-main?application=axeAPI

- http://localhost:9090/bundles/preview
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.14/page-has-heading-one?application=axeAPI

- http://localhost:9090/bundles/preview
  - `html`

## Résultats incomplets à revoir (129)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9090/bookmarks/shared
  - `#id_user`
- http://localhost:9090/tags
  - `#sort`
- http://localhost:9090/bundles/new
  - `#id_filter_unread`
  - `#id_filter_shared`
- http://localhost:9090/bundles/1/edit
  - `#id_filter_unread`
  - `#id_filter_shared`
- http://localhost:9090/settings/general
  - `#id_theme`
  - `#id_bookmark_date_display`
  - `#id_bookmark_description_display`
  - `#id_bookmark_link_target`
  - `#id_tag_search`
  - `#id_tag_grouping`
  - `#id_web_archive_integration`
  - `#id_landing_page`
  - `#id_guest_profile_user`
- http://localhost:9090/admin/
  - `.addlink[aria-describedby="auth-user"][href$="add/"]`
  - `.changelink[href$="user/"][aria-describedby="auth-user"]`
  - `.addlink[aria-describedby="bookmarks-apitoken"][href$="add/"]`
  - `.changelink[href$="apitoken/"][aria-describedby="bookmarks-apitoken"]`
  - `.addlink[aria-describedby="bookmarks-bookmarkasset"]`
  - `.changelink[aria-describedby="bookmarks-bookmarkasset"]`
  - `.addlink[aria-describedby="bookmarks-bookmarkbundle"]`
  - `.changelink[aria-describedby="bookmarks-bookmarkbundle"]`
  - `.addlink[aria-describedby="bookmarks-bookmark"][href$="add/"]`
  - `.changelink[href$="bookmark/"][aria-describedby="bookmarks-bookmark"]`
  - … +10 autres
- http://localhost:9090/api/
  - `.btn.btn-primary[href$="api/"]`
  - `h1`
  - `p`
- http://localhost:9090/api/bookmarks/
  - `.btn-primary.btn[href$="bookmarks/"]`
  - `#extra-actions-menu`
  - `h1`
  - `form[enctype="multipart/form-data"] > fieldset > .form-group:nth-child(2) > label`
  - `input[name="url"]`
  - `.form-group:nth-child(3) > label`
  - `input[name="title"]`
  - `.form-group:nth-child(4) > label`
  - `textarea[name="description"]`
  - `.form-group:nth-child(5) > label`
  - … +10 autres
- http://localhost:9090/bookmarks [state:nav-bookmarks-menu]
  - `a[href="?bundle=1"]`
  - `a[href="?bundle=2"]`
- http://localhost:9090/bookmarks [state:bulk-edit]
  - `select[name="bulk_action"]`
- http://localhost:9090/bookmarks [state:mobile-nav-390]
  - `ld-filter-drawer-trigger > .ml-2`
  - `button[value="29"][name="archive"][type="submit"]`
  - `button[value="29"][name="remove"][data-confirm=""]`
  - `button[value="28"][name="archive"][type="submit"]`
  - `button[value="28"][name="remove"][data-confirm=""]`

### bypass — Page must have means to bypass repeated blocks

- http://localhost:9090/bundles/preview
  - `html`

### target-size — All touch targets must be 24px large, or leave sufficient space

- http://localhost:9090/bundles/preview
  - `a[href="/bundles/preview?page=1"]`
  - `.disabled.page-item:nth-child(3) > a[href="#"]`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9090/change-password/
  - `#id_new_password1`
  - `#id_new_password2`
- http://localhost:9090/bookmarks [state:filter-drawer]
  - `section[aria-labelledby="bundles-heading"]`
  - `section[aria-labelledby="tags-heading"]`

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:9090/api/
  - `.region`
  - `.request-info`
  - `.response-info`
- http://localhost:9090/api/bookmarks/
  - `.region`
  - `.request-info`
  - `.response-info`

### link-in-text-block — Links must be distinguishable without relying on color

- http://localhost:9090/api/bookmarks/
  - `a[rel="nofollow"]:nth-child(39)`
  - `a[rel="nofollow"]:nth-child(65)`
  - `a[rel="nofollow"]:nth-child(148)`
  - `a[rel="nofollow"]:nth-child(174)`
  - `a[rel="nofollow"]:nth-child(257)`
  - `a[rel="nofollow"]:nth-child(283)`
  - `a[rel="nofollow"]:nth-child(366)`
  - `a[rel="nofollow"]:nth-child(392)`
  - `a[rel="nofollow"]:nth-child(475)`
  - `a[rel="nofollow"]:nth-child(501)`
  - … +40 autres

