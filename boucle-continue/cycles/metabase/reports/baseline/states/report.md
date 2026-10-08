# Audit accessibilité — 2026-10-08

**17 règle(s) violée(s), 167 occurrence(s), 9/9 scénario(s) audité(s), 0 erreur(s), 110 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `dffd419171c1`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-attr?application=axeAPI

- http://localhost:8801/
  - `#mantine-op1hh4prp-target`
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r43\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/ [state:nav-new-menu]
  - `#mantine-vwdqnceb0-target`
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r57\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/ [state:nav-search-palette]
  - `#mantine-wivdxjgdd-target`
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r56\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/ [state:nav-mobile-sidebar-390]
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r43\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/dashboard/2 [state:dashboard-actions-menu]
  - `#mantine-242qrk9ez-target`
- http://localhost:8801/dashboard/2 [state:dashboard-info-sidebar]
  - `#mantine-wm2xr28wz-target`
- http://localhost:8801/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `#mantine-110g8nunp-target`
  - `#mantine-wxcd0u26o-target`
  - `#mantine-83qmf95ey-target`
- http://localhost:8801/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `#mantine-zmae6mn6u-target`
  - `#mantine-bzsjxerg6-target`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:8801/
  - `div[role="tab"]`
- http://localhost:8801/ [state:nav-new-menu]
  - `div[role="tab"]`
- http://localhost:8801/ [state:nav-search-palette]
  - `div[role="tab"]`
- http://localhost:8801/ [state:nav-mobile-sidebar-390]
  - `div[role="tab"]`

## [CRITICAL] aria-roles — ARIA roles used must conform to valid values

Ensure all elements with a role attribute use a valid value
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-roles?application=axeAPI

- http://localhost:8801/
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/ [state:nav-new-menu]
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/ [state:nav-search-palette]
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/ [state:nav-mobile-sidebar-390]
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:8801/ [state:nav-new-menu]
  - `#mantine-vwdqnceb0-dropdown`
- http://localhost:8801/dashboard/2 [state:dashboard-actions-menu]
  - `#mantine-242qrk9ez-dropdown`

## [CRITICAL] aria-required-attr — Required ARIA attributes must be provided

Ensure elements with ARIA roles have all required ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-attr?application=axeAPI

- http://localhost:8801/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `button[aria-label="View SQL"]`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

- http://localhost:8801/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `#mantine-wowvouiuh-tab-Data`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:8801/
  - `.emotion-f9ufz5`
- http://localhost:8801/ [state:nav-new-menu]
  - `.emotion-f9ufz5`
- http://localhost:8801/ [state:nav-search-palette]
  - `.emotion-f9ufz5`
- http://localhost:8801/ [state:nav-mobile-sidebar-390]
  - `.emotion-1l6seeo`
- http://localhost:8801/dashboard/2 [state:dashboard-actions-menu]
  - `.emotion-1l6seeo`
- http://localhost:8801/dashboard/2 [state:dashboard-info-sidebar]
  - `.emotion-1l6seeo`
- http://localhost:8801/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `.emotion-1l6seeo`
- http://localhost:8801/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `.emotion-1l6seeo`
- http://localhost:8801/admin/settings/general [state:admin-settings-nav]
  - `.__m__-r6d`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:8801/
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.emotion-14cj8ah.ennrbig5[href="/"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:8801/ [state:nav-new-menu]
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.emotion-14cj8ah.ennrbig5[href="/"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:8801/ [state:nav-search-palette]
  - `.__m__-r84 > .C3IpM.m_b6d8b162[data-line-clamp="true"]`
  - `.__m__-r8j > .C3IpM.m_b6d8b162[data-line-clamp="true"]`
- http://localhost:8801/ [state:nav-mobile-sidebar-390]
  - `.emotion-14cj8ah.ennrbig5[href="/"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:8801/dashboard/2 [state:dashboard-actions-menu]
  - `.UoGAO`
- http://localhost:8801/dashboard/2 [state:dashboard-info-sidebar]
  - `.UoGAO`
  - `.h9uWO`
- http://localhost:8801/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `.n7I0X[href$="6-boucle-46-audit"] > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.RiN7y > .PGwTJ.n7I0X > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.UoGAO.C3IpM[data-truncate="end"] > span`
  - `.qBRlJ`
  - `.__m__-r73`
  - `.__m__-r7i`
  - `.__m__-r8e`
  - `.__m__-r90`
  - `.__m__-r8n > div:nth-child(3)`
  - `.__m__-r9i`
  - … +3 autres
- http://localhost:8801/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `.n7I0X[href$="6-boucle-46-audit"] > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.RiN7y > .PGwTJ.n7I0X > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.UoGAO.C3IpM[data-truncate="end"] > span`
  - `.qBRlJ`
  - `.Qc6Rv`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.14/nested-interactive?application=axeAPI

- http://localhost:8801/
  - `div[role="tab"]`
  - `#\:r42\:`
  - `#\:r4k\:`
- http://localhost:8801/ [state:nav-new-menu]
  - `div[role="tab"]`
  - `#\:r56\:`
  - `#\:r5o\:`
- http://localhost:8801/ [state:nav-search-palette]
  - `div[role="tab"]`
  - `#\:r55\:`
  - `#\:r5n\:`
  - `#kbar-listbox-item-1`
  - `#kbar-listbox-item-2`
  - `#kbar-listbox-item-3`
- http://localhost:8801/ [state:nav-mobile-sidebar-390]
  - `div[role="tab"]`
  - `#\:r42\:`
  - `#\:r4k\:`
- http://localhost:8801/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `div[data-field-title="Y-axis"] > div:nth-child(2) > div[data-is-dragging="false"][role="button"]`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:8801/
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r43\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/ [state:nav-new-menu]
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r57\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/ [state:nav-search-palette]
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r56\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/ [state:nav-mobile-sidebar-390]
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r43\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:8801/
  - `.siit6`
- http://localhost:8801/ [state:nav-new-menu]
  - `.siit6`
- http://localhost:8801/ [state:nav-search-palette]
  - `.siit6`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:8801/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `.RiN7y > .PGwTJ.n7I0X`
  - `.__m__-rbv > .PGwTJ.n7I0X`
  - `.qBRlJ`
- http://localhost:8801/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `.RiN7y > .PGwTJ.n7I0X`
  - `.__m__-r91 > .PGwTJ.n7I0X`
  - `.qBRlJ`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-dialog-name?application=axeAPI

- http://localhost:8801/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `section`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:8801/
  - `body > div:nth-child(2)`
- http://localhost:8801/ [state:nav-new-menu]
  - `body > div:nth-child(2)`
  - `div[data-portal="true"]:nth-child(4)`
- http://localhost:8801/ [state:nav-search-palette]
  - `body > div:nth-child(2)`
  - `.m_6d731127.mb-mantine-Stack-root > .m_6d731127.mb-mantine-Stack-root`
- http://localhost:8801/ [state:nav-mobile-sidebar-390]
  - `body > div:nth-child(2)`
- http://localhost:8801/dashboard/2 [state:dashboard-actions-menu]
  - `body > div:nth-child(2)`
  - `.eGlL9.m_99ac2aa1.mb-mantine-Menu-item:nth-child(2) > .m_5476e0d3.mb-mantine-Menu-itemLabel`
  - `.eGlL9.m_99ac2aa1.mb-mantine-Menu-item:nth-child(3) > .m_5476e0d3.mb-mantine-Menu-itemLabel`
  - `.eGlL9.m_99ac2aa1.mb-mantine-Menu-item:nth-child(4) > .m_5476e0d3.mb-mantine-Menu-itemLabel`
  - `a[href$="move"] > .m_5476e0d3.mb-mantine-Menu-itemLabel`
  - `a[href$="copy"] > .m_5476e0d3.mb-mantine-Menu-itemLabel`
  - `a[href$="archive"] > .m_5476e0d3.mb-mantine-Menu-itemLabel`
- http://localhost:8801/dashboard/2 [state:dashboard-info-sidebar]
  - `body > div:nth-child(2)`
- http://localhost:8801/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `body > div:nth-child(2)`
- http://localhost:8801/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `body > div:nth-child(2)`
- http://localhost:8801/admin/settings/general [state:admin-settings-nav]
  - `body > div:nth-child(2)`

## [MODERATE] landmark-no-duplicate-banner — Document should not have more than one banner landmark

Ensure the document has at most one banner landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-banner?application=axeAPI

- http://localhost:8801/dashboard/2 [state:dashboard-info-sidebar]
  - `.MdZZp`
- http://localhost:8801/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `.MdZZp`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:8801/question/40-b46-products-par-categorie/notebook [state:question-notebook-editor]
  - `.i8roT`
- http://localhost:8801/question/40-b46-products-par-categorie [state:question-viz-settings]
  - `.i8roT`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:8801/dashboard/2 [state:dashboard-info-sidebar]
  - `#\33 `

## Résultats incomplets à revoir (110)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:8801/
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/ [state:nav-new-menu]
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/ [state:nav-search-palette]
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/ [state:nav-mobile-sidebar-390]
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/dashboard/2 [state:dashboard-info-sidebar]
  - `div[aria-labelledby="3"]`
- http://localhost:8801/admin/settings/general [state:admin-settings-nav]
  - `.mb-mantine-RadioGroup-root`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8801/
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-r33`
- http://localhost:8801/ [state:nav-new-menu]
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-rc`
- http://localhost:8801/ [state:nav-search-palette]
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `button[data-variant="filled"] > .m_80f1301b.mb-mantine-Button-inner > .WzMo8.m_811560b9.mb-mantine-Button-label`
  - `.emotion-14cj8ah.ennrbig5[href="/"] > .emotion-1ygoewh.e4mkl603`
  - `.CkxlV > h4`
  - `.emotion-1e79xdn > .emotion-1ygoewh.e4mkl603`
  - `a[href$="getting-started"] > .emotion-1ygoewh.e4mkl603`
  - `a[href$="2-examples"] > .emotion-1ygoewh.e4mkl603`
  - `.__m__-r5b > h4`
  - … +16 autres
- http://localhost:8801/ [state:nav-mobile-sidebar-390]
  - `.__m__-r33`
  - `.__m__-r2r > .QB3Fo.m_77c9d27d.mb-mantine-Button-root > .m_80f1301b.mb-mantine-Button-inner > .WzMo8.m_811560b9.mb-mantine-Button-label`
  - `.__m__-r5i > .C3IpM.m_b6d8b162.mb-mantine-Text-root`
  - `.__m__-r5m > .C3IpM.m_b6d8b162[data-truncate="end"]`
  - `.__m__-r5v > .C3IpM.m_b6d8b162[data-truncate="end"]`
  - `.__m__-r68 > .C3IpM.m_b6d8b162[data-truncate="end"]`
  - `#\31 `
- http://localhost:8801/dashboard/2 [state:dashboard-actions-menu]
  - `textarea`
  - `.yTKVH`
  - `div[data-card-key="40"] > .CardVisualization.emotion-onvfvp.e160fyku0 > .emotion-3ye0ev.e1snajy20[data-testid="legend-caption"] > .IiwSx.WrVjG.gDtsD > .C3IpM.m_b6d8b162[data-testid="legend-caption-title"]`
  - `div[_echarts_instance_="ec_1791448237416"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(177 224.3125)"][text-anchor="middle"][y="3.5"]`
  - `div[_echarts_instance_="ec_1791448237416"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 194.3125)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448237416"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 163.9271)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448237416"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 133.5417)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448237416"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 103.1563)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448237416"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 72.7708)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448237416"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 42.3854)"][text-anchor="end"]`
  - … +18 autres
- http://localhost:8801/dashboard/2 [state:dashboard-info-sidebar]
  - `div[_echarts_instance_="ec_1791448239183"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(177 224.3125)"][text-anchor="middle"][y="3.5"]`
  - `div[_echarts_instance_="ec_1791448239183"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 194.3125)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448239183"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 163.9271)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448239183"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 133.5417)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448239183"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 103.1563)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448239183"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 72.7708)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448239183"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 42.3854)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448239183"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 12)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448239183"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(69.75 199.3125)"][text-anchor="middle"][y="3.5"]`
  - `div[_echarts_instance_="ec_1791448239183"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(141.25 199.3125)"][text-anchor="middle"][y="3.5"]`
  - … +14 autres
- http://localhost:8801/admin/settings/general [state:admin-settings-nav]
  - `strong`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:8801/ [state:nav-new-menu]
  - `#mantine-vwdqnceb0-target`
- http://localhost:8801/dashboard/2 [state:dashboard-actions-menu]
  - `#mantine-242qrk9ez-target`
- http://localhost:8801/admin/settings/general [state:admin-settings-nav]
  - `div[role="radiogroup"]`

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:8801/admin/settings/general [state:admin-settings-nav]
  - `#enable-xrays`
  - `#anon-tracking-enabled`

