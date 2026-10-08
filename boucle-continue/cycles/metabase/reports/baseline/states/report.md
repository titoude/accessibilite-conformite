# Audit accessibilité — 2026-10-08

**12 règle(s) violée(s), 100 occurrence(s), 5/9 scénario(s) audité(s), 4 erreur(s), 95 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `f1f4e62dc3b4`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-attr?application=axeAPI

- http://localhost:7600/
  - `#mantine-cn3js11t6-target`
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r4u\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/ [state:nav-new-menu]
  - `#mantine-ntam46k0t-target`
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r4u\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/ [state:nav-search-palette]
  - `#mantine-6enxpuqbr-target`
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r4t\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/dashboard/2 [state:dashboard-actions-menu]
  - `#mantine-i8gi7xfz5-target`
- http://localhost:7600/dashboard/2 [state:dashboard-info-sidebar]
  - `#mantine-2yi2k8eik-target`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:7600/
  - `div[role="tab"]`
- http://localhost:7600/ [state:nav-new-menu]
  - `div[role="tab"]`
- http://localhost:7600/ [state:nav-search-palette]
  - `div[role="tab"]`

## [CRITICAL] aria-roles — ARIA roles used must conform to valid values

Ensure all elements with a role attribute use a valid value
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-roles?application=axeAPI

- http://localhost:7600/
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/ [state:nav-new-menu]
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/ [state:nav-search-palette]
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:7600/ [state:nav-new-menu]
  - `#mantine-ntam46k0t-dropdown`
- http://localhost:7600/dashboard/2 [state:dashboard-actions-menu]
  - `#mantine-i8gi7xfz5-dropdown`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:7600/
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.emotion-14cj8ah.ennrbig5[href="/"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:7600/ [state:nav-new-menu]
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.emotion-14cj8ah.ennrbig5[href="/"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:7600/ [state:nav-search-palette]
  - `.__m__-r7r > .C3IpM.m_b6d8b162[data-line-clamp="true"]`
- http://localhost:7600/dashboard/2 [state:dashboard-actions-menu]
  - `.UoGAO`
- http://localhost:7600/dashboard/2 [state:dashboard-info-sidebar]
  - `.UoGAO`
  - `.h9uWO`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:7600/
  - `.emotion-f9ufz5`
- http://localhost:7600/ [state:nav-new-menu]
  - `.emotion-f9ufz5`
- http://localhost:7600/ [state:nav-search-palette]
  - `.emotion-f9ufz5`
- http://localhost:7600/dashboard/2 [state:dashboard-actions-menu]
  - `.emotion-1l6seeo`
- http://localhost:7600/dashboard/2 [state:dashboard-info-sidebar]
  - `.emotion-1l6seeo`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:7600/
  - `.siit6`
- http://localhost:7600/ [state:nav-new-menu]
  - `.siit6`
- http://localhost:7600/ [state:nav-search-palette]
  - `.siit6`

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
- http://localhost:7600/ [state:nav-new-menu]
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r4u\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/ [state:nav-search-palette]
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r4t\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.14/nested-interactive?application=axeAPI

- http://localhost:7600/
  - `div[role="tab"]`
  - `#\:r4t\:`
  - `#\:r5f\:`
- http://localhost:7600/ [state:nav-new-menu]
  - `div[role="tab"]`
  - `#\:r4t\:`
  - `#\:r5f\:`
- http://localhost:7600/ [state:nav-search-palette]
  - `div[role="tab"]`
  - `#\:r4s\:`
  - `#\:r5d\:`
  - `#kbar-listbox-item-1`
  - `#kbar-listbox-item-2`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:7600/
  - `body > div:nth-child(2)`
- http://localhost:7600/ [state:nav-new-menu]
  - `body > div:nth-child(2)`
  - `div[data-portal="true"]:nth-child(4)`
- http://localhost:7600/ [state:nav-search-palette]
  - `body > div:nth-child(2)`
  - `.m_6d731127.mb-mantine-Stack-root > .m_6d731127.mb-mantine-Stack-root`
- http://localhost:7600/dashboard/2 [state:dashboard-actions-menu]
  - `body > div:nth-child(2)`
  - `.eGlL9.m_99ac2aa1.mb-mantine-Menu-item:nth-child(2) > .m_5476e0d3.mb-mantine-Menu-itemLabel`
  - `.eGlL9.m_99ac2aa1.mb-mantine-Menu-item:nth-child(3) > .m_5476e0d3.mb-mantine-Menu-itemLabel`
  - `.eGlL9.m_99ac2aa1.mb-mantine-Menu-item:nth-child(4) > .m_5476e0d3.mb-mantine-Menu-itemLabel`
  - `a[href$="move"] > .m_5476e0d3.mb-mantine-Menu-itemLabel`
  - `a[href$="copy"] > .m_5476e0d3.mb-mantine-Menu-itemLabel`
  - `a[href$="archive"] > .m_5476e0d3.mb-mantine-Menu-itemLabel`
- http://localhost:7600/dashboard/2 [state:dashboard-info-sidebar]
  - `body > div:nth-child(2)`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:7600/dashboard/2 [state:dashboard-info-sidebar]
  - `#\33 `

## [MODERATE] landmark-no-duplicate-banner — Document should not have more than one banner landmark

Ensure the document has at most one banner landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-banner?application=axeAPI

- http://localhost:7600/dashboard/2 [state:dashboard-info-sidebar]
  - `.MdZZp`

## Résultats incomplets à revoir (95)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:7600/
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/ [state:nav-new-menu]
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/ [state:nav-search-palette]
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/dashboard/2 [state:dashboard-info-sidebar]
  - `div[aria-labelledby="3"]`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7600/
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-rc`
- http://localhost:7600/ [state:nav-new-menu]
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-rc`
- http://localhost:7600/ [state:nav-search-palette]
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `button[data-variant="filled"] > .m_80f1301b.mb-mantine-Button-inner > .WzMo8.m_811560b9.mb-mantine-Button-label`
  - `.emotion-14cj8ah.ennrbig5[href="/"] > .emotion-1ygoewh.e4mkl603`
  - `.CkxlV > h4`
  - `.emotion-1e79xdn > .emotion-1ygoewh.e4mkl603`
  - `a[href$="getting-started"] > .emotion-1ygoewh.e4mkl603`
  - `a[href$="2-examples"] > .emotion-1ygoewh.e4mkl603`
  - `.__m__-r52 > h4`
  - … +15 autres
- http://localhost:7600/dashboard/2 [state:dashboard-actions-menu]
  - `textarea`
  - `.yTKVH`
  - `div[data-card-key="40"] > .CardVisualization.emotion-onvfvp.e160fyku0 > .emotion-3ye0ev.e1snajy20[data-testid="legend-caption"] > .IiwSx.WrVjG.gDtsD > .C3IpM.m_b6d8b162[data-testid="legend-caption-title"]`
  - `div[_echarts_instance_="ec_1791434169978"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(177 224.3125)"][text-anchor="middle"][y="3.5"]`
  - `div[_echarts_instance_="ec_1791434169978"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 194.3125)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434169978"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 163.9271)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434169978"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 133.5417)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434169978"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 103.1563)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434169978"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 72.7708)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434169978"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 42.3854)"][text-anchor="end"]`
  - … +18 autres
- http://localhost:7600/dashboard/2 [state:dashboard-info-sidebar]
  - `div[_echarts_instance_="ec_1791434174523"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(177 224.3125)"][text-anchor="middle"][y="3.5"]`
  - `div[_echarts_instance_="ec_1791434174523"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 194.3125)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434174523"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 163.9271)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434174523"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 133.5417)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434174523"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 103.1563)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434174523"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 72.7708)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434174523"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 42.3854)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434174523"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 12)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434174523"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(69.75 199.3125)"][text-anchor="middle"][y="3.5"]`
  - `div[_echarts_instance_="ec_1791434174523"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(141.25 199.3125)"][text-anchor="middle"][y="3.5"]`
  - … +14 autres

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:7600/ [state:nav-new-menu]
  - `#mantine-ntam46k0t-target`
- http://localhost:7600/dashboard/2 [state:dashboard-actions-menu]
  - `#mantine-i8gi7xfz5-target`

## Erreurs (4) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:7600/ [state:nav-mobile-sidebar-390] — page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('[data-testid="main-navbar-root"]:visible, [role="dialog"] nav, [class*="Drawer"] nav') to be visible

- http://localhost:7600/question/40 [state:question-notebook-editor] — le document final diffère du document demandé (http://localhost:7600/question/40-b46-products-par-categorie/notebook) — déclarer l'URL réelle de l'état dans STATES
- http://localhost:7600/question/40 [state:question-viz-settings] — le document final diffère du document demandé (http://localhost:7600/question/40-b46-products-par-categorie) — déclarer l'URL réelle de l'état dans STATES
- http://localhost:7600/admin/settings [state:admin-settings-nav] — le document final diffère du document demandé (http://localhost:7600/admin/settings/general) — déclarer l'URL réelle de l'état dans STATES

