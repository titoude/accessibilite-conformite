# Audit accessibilité — 2026-10-07

**3 règle(s) violée(s), 38 occurrence(s), 3/3 scénario(s) audité(s), 0 erreur(s), 20 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `70cc5166e02b`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/select-name?application=axeAPI

- http://localhost:9090/bookmarks/shared
  - `#id_user`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:9090/bookmarks/shared
  - `li[data-bookmark-id="35"] > .content > .description.inline.truncate > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="34"] > .content > .description.inline.truncate > .tags > a[href="?q=%23selfhosted"]`
  - `li[data-bookmark-id="34"] > .content > .description.inline.truncate > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="33"] > .content > .description.inline.truncate > .tags > a[href="?q=%23accessibility"]`
  - `.tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="32"] > .content > .description.inline.truncate > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="31"] > .content > .description.inline.truncate > .tags > a[href="?q=%23django"]`
  - `li[data-bookmark-id="31"] > .content > .description.inline.truncate > .tags > a[href="?q=%23python"]`
  - `li[data-bookmark-id="23"] > .content > .description.inline.truncate > .tags > a[href="?q=%23accessibility"]`
  - `.tags > a[href="?q=%23javascript"]`
  - … +21 autres

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:9090/bookmarks/shared
  - `li[data-bookmark-id="35"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `li[data-bookmark-id="23"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `li[data-bookmark-id="21"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `li[data-bookmark-id="8"] > .content > .actions > a[rel="noopener"][target="_blank"]`
  - `a[href="/bookmarks/shared?details=8"]`
  - `li[data-bookmark-id="3"] > .content > .actions > a[rel="noopener"][target="_blank"]`

## Résultats incomplets à revoir (20)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9090/bookmarks/shared
  - `#id_user`

### link-in-text-block — Links must be distinguishable without relying on color

- http://localhost:9090/bookmarks/shared
  - `li[data-bookmark-id="35"] > .content > .description.inline.truncate > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="34"] > .content > .description.inline.truncate > .tags > a[href="?q=%23selfhosted"]`
  - `li[data-bookmark-id="34"] > .content > .description.inline.truncate > .tags > a[href="?q=%23tools"]`
  - `li[data-bookmark-id="33"] > .content > .description.inline.truncate > .tags > a[href="?q=%23accessibility"]`
  - `.tags > a[href="?q=%23research"]`
  - `li[data-bookmark-id="32"] > .content > .description.inline.truncate > .tags > a[href="?q=%23webdev"]`
  - `li[data-bookmark-id="31"] > .content > .description.inline.truncate > .tags > a[href="?q=%23django"]`
  - `li[data-bookmark-id="31"] > .content > .description.inline.truncate > .tags > a[href="?q=%23python"]`
  - `li[data-bookmark-id="23"] > .content > .description.inline.truncate > .tags > a[href="?q=%23accessibility"]`
  - `.tags > a[href="?q=%23javascript"]`
  - … +9 autres

