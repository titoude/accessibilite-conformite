# Audit accessibilité — 2026-10-08

**13 règle(s) violée(s), 89 occurrence(s), 5/5 scénario(s) audité(s), 0 erreur(s), 20 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `260c3b599906`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-attr?application=axeAPI

- http://localhost:7600/
  - `#mantine-8oskpe5f0-target`
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r4u\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r43\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `#mantine-t1ltbcfw1-target`
  - `#mantine-syxxzscgt-target`
  - `#mantine-jasy28ht9-target`
- http://localhost:7600/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `#mantine-s3ch6e93h-target`
  - `#mantine-ku6kdsh8v-target`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:7600/
  - `div[role="tab"]`
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `div[role="tab"]`

## [CRITICAL] aria-roles — ARIA roles used must conform to valid values

Ensure all elements with a role attribute use a valid value
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-roles?application=axeAPI

- http://localhost:7600/
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`

## [CRITICAL] aria-required-attr — Required ARIA attributes must be provided

Ensure elements with ARIA roles have all required ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-attr?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `button[aria-label="View SQL"]`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `#mantine-s50slq22r-tab-Data`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:7600/
  - `.emotion-f9ufz5`
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `.emotion-1l6seeo`
- http://localhost:7600/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `.emotion-1l6seeo`
- http://localhost:7600/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `.emotion-1l6seeo`
- http://localhost:7600/admin/settings/general [state:admin-settings-nav]
  - `.__m__-r6d`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:7600/
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.emotion-14cj8ah.ennrbig5[href="/"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `.emotion-14cj8ah.ennrbig5[href="/"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:7600/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `.n7I0X[href$="6-boucle-46-audit"] > .c6DUo.XSImJ.m_4081bf90 > .C3IpM.UoGAO.m_b6d8b162`
  - `.RiN7y > .PGwTJ.n7I0X > .c6DUo.XSImJ.m_4081bf90 > .C3IpM.UoGAO.m_b6d8b162`
  - `.C3IpM.UoGAO.m_b6d8b162 > span`
  - `.qBRlJ`
  - `.__m__-r73`
  - `.__m__-r7i`
  - `.__m__-r8e`
  - `.__m__-r90`
  - `.__m__-r8n > div:nth-child(3)`
  - `.__m__-r9i`
  - … +3 autres
- http://localhost:7600/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `.n7I0X[href$="6-boucle-46-audit"] > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.RiN7y > .PGwTJ.n7I0X > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.UoGAO.C3IpM[data-truncate="end"] > span`
  - `.qBRlJ`
  - `.Qc6Rv`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.14/nested-interactive?application=axeAPI

- http://localhost:7600/
  - `div[role="tab"]`
  - `#\:r4t\:`
  - `#\:r5f\:`
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `div[role="tab"]`
  - `#\:r42\:`
  - `#\:r4k\:`
- http://localhost:7600/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `div[data-field-title="Y-axis"] > div:nth-child(2) > div[data-is-dragging="false"][role="button"]`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:7600/
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r4u\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r43\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `.RiN7y > .PGwTJ.n7I0X`
  - `.__m__-rbi > .PGwTJ.n7I0X`
  - `.qBRlJ`
- http://localhost:7600/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `.RiN7y > .PGwTJ.n7I0X`
  - `.__m__-r8r > .PGwTJ.n7I0X`
  - `.qBRlJ`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:7600/
  - `.siit6`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:7600/
  - `body > div:nth-child(2)`
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `body > div:nth-child(2)`
- http://localhost:7600/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `body > div:nth-child(2)`
- http://localhost:7600/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `body > div:nth-child(2)`
- http://localhost:7600/admin/settings/general [state:admin-settings-nav]
  - `body > div:nth-child(2)`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `.i8roT`
- http://localhost:7600/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `.i8roT`

## Résultats incomplets à revoir (20)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:7600/
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/admin/settings/general [state:admin-settings-nav]
  - `.mb-mantine-RadioGroup-root`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7600/
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-rc`
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `.__m__-rc`
  - `.__m__-r4 > .QB3Fo.m_77c9d27d.mb-mantine-Button-root > .m_80f1301b.mb-mantine-Button-inner > .WzMo8.m_811560b9.mb-mantine-Button-label`
  - `.__m__-r5a > .C3IpM.m_b6d8b162.mb-mantine-Text-root`
  - `.__m__-r5e > .C3IpM.m_b6d8b162[data-truncate="end"]`
  - `.__m__-r5n > .C3IpM.m_b6d8b162[data-truncate="end"]`
  - `#\31 `
- http://localhost:7600/admin/settings/general [state:admin-settings-nav]
  - `strong`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `.emotion-cnoysb`
- http://localhost:7600/admin/settings/general [state:admin-settings-nav]
  - `div[role="radiogroup"]`

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:7600/admin/settings/general [state:admin-settings-nav]
  - `#enable-xrays`
  - `#anon-tracking-enabled`

