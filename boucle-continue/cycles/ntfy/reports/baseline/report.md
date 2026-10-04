# Audit accessibilité — 2026-10-04

**14 règle(s) violée(s), 48 occurrence(s), 5/6 scénario(s) audité(s), 1 erreur(s), 16 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `a23aa547780c`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://127.0.0.1:8090/
  - `.MuiDrawer-docked`
- http://127.0.0.1:8090/testtopic
  - `.MuiDrawer-docked`
- http://127.0.0.1:8090/settings
  - `.MuiDrawer-docked`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://127.0.0.1:8090/testtopic
  - `.css-mdxzat > .MuiList-root.MuiList-padding.css-13tkqlk > .Mui-selected[aria-label="testtopic"][aria-live="polite"] > .css-u2rarv.MuiListItemIcon-root[edge="end"] > .MuiIconButton-sizeSmall.css-xr3r2o`
- http://127.0.0.1:8090/settings
  - `.css-mdxzat > .MuiList-root.MuiList-padding.css-13tkqlk > .MuiListItemButton-root[aria-label="testtopic"][aria-live="polite"] > .css-u2rarv.MuiListItemIcon-root[edge="end"] > .MuiIconButton-sizeSmall.css-xr3r2o.MuiIconButton-root`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.13/image-alt?application=axeAPI

- http://127.0.0.1:8090/login
  - `img`
- http://127.0.0.1:8090/signup
  - `img`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-parent?application=axeAPI

- http://127.0.0.1:8090/settings
  - `div[aria-label="Notifications"] > .css-1v885rd > .css-1e7sr69[role="row"]:nth-child(1)`
  - `div[aria-label="Notifications"] > .css-1v885rd > .css-1e7sr69[role="row"]:nth-child(2)`
  - `div[aria-label="Notifications"] > .css-1v885rd > .css-1e7sr69[role="row"]:nth-child(3)`
  - `div[aria-label="Appearance"] > .css-1v885rd > .css-1e7sr69[role="row"]:nth-child(1)`
  - `div[aria-label="Appearance"] > .css-1v885rd > .css-1e7sr69[role="row"]:nth-child(2)`
  - `div[aria-label="Appearance"] > .css-1v885rd > .css-1e7sr69[role="row"]:nth-child(3)`
  - `.css-1e7sr69[role="row"]:nth-child(4)`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://127.0.0.1:8090/
  - `a[href$="ntfy.sh"]`
  - `a[href$="docs"]`
- http://127.0.0.1:8090/settings
  - `.MuiButton-root`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.13/listitem?application=axeAPI

- http://127.0.0.1:8090/testtopic
  - `.css-mdxzat > .MuiList-root.MuiList-padding.css-13tkqlk > li`
- http://127.0.0.1:8090/settings
  - `.css-mdxzat > .MuiList-root.MuiList-padding.css-13tkqlk > li`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.13/nested-interactive?application=axeAPI

- http://127.0.0.1:8090/testtopic
  - `.css-mdxzat > .MuiList-root.MuiList-padding.css-13tkqlk > .Mui-selected[aria-label="testtopic"][aria-live="polite"]`
- http://127.0.0.1:8090/settings
  - `.css-mdxzat > .MuiList-root.MuiList-padding.css-13tkqlk > .MuiListItemButton-root[aria-label="testtopic"][aria-live="polite"]`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://127.0.0.1:8090/login
  - `a`
- http://127.0.0.1:8090/signup
  - `a`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-input-field-name?application=axeAPI

- http://127.0.0.1:8090/settings
  - `div[aria-labelledby="prefSound"] > .MuiSelect-select.MuiSelect-standard.MuiInputBase-input`
  - `div[aria-labelledby="prefMinPriority"] > .MuiSelect-select.MuiSelect-standard.MuiInputBase-input`
  - `div[aria-labelledby="prefDeleteAfter"] > .MuiSelect-select.MuiSelect-standard.MuiInputBase-input`
  - `div[aria-labelledby="prefTheme"] > .MuiSelect-select.MuiSelect-standard.MuiInputBase-input`
  - `div[aria-labelledby="prefDateFormat"] > .MuiSelect-select.MuiSelect-standard.MuiInputBase-input`
  - `div[aria-labelledby="prefTimeFormat"] > .MuiSelect-select.MuiSelect-standard.MuiInputBase-input`
  - `div[aria-labelledby="prefLanguage"] > .MuiSelect-select.MuiSelect-standard.MuiInputBase-input`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.13/meta-viewport?application=axeAPI

- http://127.0.0.1:8090/
  - `meta[name="viewport"]`
- http://127.0.0.1:8090/testtopic
  - `meta[name="viewport"]`
- http://127.0.0.1:8090/settings
  - `meta[name="viewport"]`
- http://127.0.0.1:8090/login
  - `meta[name="viewport"]`
- http://127.0.0.1:8090/signup
  - `meta[name="viewport"]`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://127.0.0.1:8090/
  - `html`
- http://127.0.0.1:8090/testtopic
  - `html`
- http://127.0.0.1:8090/settings
  - `html`
- http://127.0.0.1:8090/login
  - `html`
- http://127.0.0.1:8090/signup
  - `html`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://127.0.0.1:8090/
  - `.css-u9txht`
- http://127.0.0.1:8090/testtopic
  - `.css-u9txht`
- http://127.0.0.1:8090/settings
  - `.css-u9txht`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://127.0.0.1:8090/testtopic
  - `.MuiFormControl-root`
- http://127.0.0.1:8090/login
  - `#root`
- http://127.0.0.1:8090/signup
  - `#root`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://127.0.0.1:8090/login
  - `html`
- http://127.0.0.1:8090/signup
  - `html`

## Résultats incomplets à revoir (16)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8090/
  - `.MuiTypography-h6`
- http://127.0.0.1:8090/testtopic
  - `.MuiTypography-h6`
  - `.css-mdxzat > .MuiList-root.MuiList-padding.css-13tkqlk > .Mui-selected[aria-label="testtopic"][aria-live="polite"] > .css-4wmnnb.MuiListItemIcon-root > .MuiBadge-root.css-chz7cr > .MuiBadge-badge.MuiBadge-standard.MuiBadge-invisible`
- http://127.0.0.1:8090/settings
  - `.MuiTypography-h6`

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://127.0.0.1:8090/settings
  - `div[aria-label="Notifications"]`
  - `div[aria-labelledby="prefSound"]`
  - `div[aria-labelledby="prefMinPriority"]`
  - `div[aria-labelledby="prefDeleteAfter"]`
  - `.css-7zzovx`
  - `div[aria-label="Appearance"]`
  - `div[aria-labelledby="prefTheme"]`
  - `div[aria-labelledby="prefDateFormat"]`
  - `div[aria-labelledby="prefTimeFormat"]`
  - `div[aria-labelledby="prefLanguage"]`

### bypass — Page must have means to bypass repeated blocks

- http://127.0.0.1:8090/login
  - `html`
- http://127.0.0.1:8090/signup
  - `html`

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://127.0.0.1:8090/account — le document final diffère du document demandé (http://127.0.0.1:8090/) — déclarer l'URL réelle de l'état dans STATES

