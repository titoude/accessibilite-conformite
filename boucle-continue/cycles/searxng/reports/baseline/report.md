# Audit accessibilité — 2026-10-05

**14 règle(s) violée(s), 571 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 329 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `def4f4be506a`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://localhost:8888/preferences
  - `#search_form > .tabs[role="tablist"]`
- http://localhost:8888/preferences [state:preferences-engines-tab]
  - `#search_form > .tabs[role="tablist"]`
  - `#tab-content-engines > .tabs[role="tablist"]`
- http://localhost:8888/preferences [state:preferences-category-general-tab]
  - `#search_form > .tabs[role="tablist"]`
  - `#tab-content-engines > .tabs[role="tablist"]`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-valid-attr-value?application=axeAPI

- http://localhost:8888/preferences [state:preferences-engines-tab]
  - `#tab-label-category_social\ media`
- http://localhost:8888/preferences [state:preferences-category-general-tab]
  - `#tab-label-category_social\ media`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:8888/preferences [state:preferences-engines-tab]
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(3) > td:nth-child(4) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(3) > td:nth-child(5) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(4) > td:nth-child(4) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(4) > td:nth-child(5) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(6) > td:nth-child(4) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(6) > td:nth-child(5) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(8) > td:nth-child(4) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(8) > td:nth-child(5) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(10) > td:nth-child(4) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(10) > td:nth-child(5) > input[value="None"][type="checkbox"]`
  - … +104 autres
- http://localhost:8888/preferences [state:preferences-category-general-tab]
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(3) > td:nth-child(4) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(3) > td:nth-child(5) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(4) > td:nth-child(4) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(4) > td:nth-child(5) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(6) > td:nth-child(4) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(6) > td:nth-child(5) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(8) > td:nth-child(4) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(8) > td:nth-child(5) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(10) > td:nth-child(4) > input[value="None"][type="checkbox"]`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(10) > td:nth-child(5) > input[value="None"][type="checkbox"]`
  - … +104 autres

## [SERIOUS] link-in-text-block — Links must be distinguishable without relying on color

Ensure links are distinguished from surrounding text in a way that does not rely on color
Référence : https://dequeuniversity.com/rules/axe/4.13/link-in-text-block?application=axeAPI

- http://localhost:8888/
  - `p > a[href$="about"]`
- http://localhost:8888/search?q=test
  - `p > a[href$="about"]`
- http://localhost:8888/search?q=test&categories=images
  - `p > a[href$="about"]`
- http://localhost:8888/search?q=test&categories=videos
  - `p > a[href$="about"]`
- http://localhost:8888/search?q=python
  - `p > a[href$="about"]`
- http://localhost:8888/search?q=zzqxvbnmxxunlikelyquery
  - `p > a[href$="about"]`
- http://localhost:8888/preferences
  - `p > a[href$="about"]`
- http://localhost:8888/info/en/about
  - `p:nth-child(2) > a:nth-child(1)`
  - `p:nth-child(2) > a:nth-child(2)`
  - `p:nth-child(3) > a`
  - `ul:nth-child(5) > li:nth-child(1) > a`
  - `ul:nth-child(5) > li:nth-child(2) > a`
  - `a[href$="docs.searxng.org/"]`
  - `p:nth-child(10) > a`
  - `ul:nth-child(11) > li:nth-child(2) > a`
  - `ul:nth-child(11) > li:nth-child(3) > a`
  - `a[href$="searx"]`
  - … +6 autres
- http://localhost:8888/info/en/search-syntax
  - `p:nth-child(2) > a`
  - `p:nth-child(6) > a`
  - `a[href$="bang"]`
  - `p:nth-child(19) > a`
  - `p > a[href$="about"]`
- http://localhost:8888/stats
  - `p > a[href$="about"]`
- http://localhost:8888/ [state:autocomplete-open]
  - `p > a[href$="about"]`
- http://localhost:8888/preferences [state:preferences-engines-tab]
  - `p > a[href$="about"]`
- http://localhost:8888/preferences [state:preferences-category-general-tab]
  - `p > a[href$="about"]`
- http://localhost:8888/ [state:dark-mode]
  - `p > a[href$="about"]`
- http://localhost:8888/ [state:mobile-home]
  - `p > a[href$="about"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://localhost:8888/
  - `#clear_search`
- http://localhost:8888/search?q=test
  - `.page_number_current`
- http://localhost:8888/search?q=test&categories=images
  - `.page_number_current`
- http://localhost:8888/search?q=test&categories=videos
  - `.page_number_current`
- http://localhost:8888/search?q=python
  - `bdi > a[href$="python.org/"][rel="noreferrer"]`
  - `li:nth-child(2) > bdi > a[rel="noreferrer"]`
  - `li:nth-child(3) > bdi > a[rel="noreferrer"]`
  - `li:nth-child(4) > bdi > a[rel="noreferrer"]`
  - `li:nth-child(5) > bdi > a[rel="noreferrer"]`
  - `li:nth-child(6) > bdi > a[rel="noreferrer"]`
  - `li:nth-child(7) > bdi > a[rel="noreferrer"]`
  - `li:nth-child(8) > bdi > a[rel="noreferrer"]`
  - `.page_number_current`
- http://localhost:8888/search?q=zzqxvbnmxxunlikelyquery
  - `.page_number_current`
- http://localhost:8888/info/en/about
  - `ul:nth-child(11) > li:nth-child(1) > a`
- http://localhost:8888/info/en/search-syntax
  - `ul:nth-child(5) > li:nth-child(1) > ul > li:nth-child(1) > a`
  - `li:nth-child(1) > ul > li:nth-child(2) > a`
  - `li:nth-child(4) > ul > li:nth-child(1) > a`
  - `li:nth-child(4) > ul > li:nth-child(2) > a`
- http://localhost:8888/ [state:dark-mode]
  - `#clear_search`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/link-name?application=axeAPI

- http://localhost:8888/search?q=test
  - `.thumbnail_link[href$="speedtest.net/"][rel="noreferrer"]`
  - `article:nth-child(6) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(7) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(8) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(9) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(10) > .thumbnail_link[rel="noreferrer"]`
  - `.thumbnail_link[href$="speedtest/"][rel="noreferrer"]`
  - `article:nth-child(12) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(13) > .thumbnail_link[rel="noreferrer"]`
  - `.thumbnail_link[href$="speed.cloudflare.com/"][rel="noreferrer"]`
  - … +6 autres
- http://localhost:8888/search?q=test&categories=videos
  - `.thumbnail_link[href="https://vimeo.com/576942660"][rel="noreferrer"]`
- http://localhost:8888/search?q=python
  - `article:nth-child(4) > .thumbnail_link[href$="python.org/"][rel="noreferrer"]`
  - `article:nth-child(5) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(6) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(7) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(8) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(9) > .thumbnail_link[rel="noreferrer"]`
  - `.thumbnail_link[href$="learnpython.org/"][rel="noreferrer"]`
  - `.thumbnail_link[href$="pypi.org/"][rel="noreferrer"]`
  - `article:nth-child(12) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(13) > .thumbnail_link[rel="noreferrer"]`
  - … +8 autres
- http://localhost:8888/search?q=zzqxvbnmxxunlikelyquery
  - `article:nth-child(1) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(2) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(3) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(4) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(5) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(6) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(7) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(8) > .thumbnail_link[rel="noreferrer"]`
  - `article:nth-child(9) > .thumbnail_link[rel="noreferrer"]`
- http://localhost:8888/ [state:mobile-home]
  - `.link_on_top_about`
  - `.link_on_top_preferences`

## [SERIOUS] tabindex — Elements should not have tabindex greater than zero

Ensure tabindex attribute values are not greater than 0
Référence : https://dequeuniversity.com/rules/axe/4.13/tabindex?application=axeAPI

- http://localhost:8888/search?q=test
  - `#q`
- http://localhost:8888/search?q=test&categories=images
  - `#q`
- http://localhost:8888/search?q=test&categories=videos
  - `#q`
- http://localhost:8888/search?q=python
  - `#q`
- http://localhost:8888/search?q=zzqxvbnmxxunlikelyquery
  - `#q`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8888/search?q=test&categories=videos
  - `article:nth-child(4) > .result_inner > .result_author`
  - `article:nth-child(5) > .result_inner > time`
  - `article:nth-child(6) > .result_inner > time`
  - `article:nth-child(6) > .result_inner > .result_views`
  - `article:nth-child(6) > .result_inner > .result_author`
  - `article:nth-child(7) > .result_inner > time`
  - `article:nth-child(7) > .result_inner > .result_author`
  - `article:nth-child(10) > .result_inner > .result_length`
  - `article:nth-child(11) > .result_inner > .result_length`
  - `article:nth-child(12) > .result_inner > .result_length`
  - … +105 autres

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:8888/
  - `html`
- http://localhost:8888/search?q=test
  - `html`
- http://localhost:8888/search?q=test&categories=images
  - `html`
- http://localhost:8888/search?q=test&categories=videos
  - `html`
- http://localhost:8888/search?q=python
  - `html`
- http://localhost:8888/search?q=zzqxvbnmxxunlikelyquery
  - `html`
- http://localhost:8888/ [state:autocomplete-open]
  - `html`
- http://localhost:8888/ [state:dark-mode]
  - `html`
- http://localhost:8888/ [state:mobile-home]
  - `html`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-main-is-top-level?application=axeAPI

- http://localhost:8888/search?q=test
  - `#urls`
- http://localhost:8888/search?q=test&categories=images
  - `#urls`
- http://localhost:8888/search?q=test&categories=videos
  - `#urls`
- http://localhost:8888/search?q=python
  - `#urls`
- http://localhost:8888/search?q=zzqxvbnmxxunlikelyquery
  - `#urls`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-no-duplicate-main?application=axeAPI

- http://localhost:8888/search?q=test
  - `#main_results`
- http://localhost:8888/search?q=test&categories=images
  - `#main_results`
- http://localhost:8888/search?q=test&categories=videos
  - `#main_results`
- http://localhost:8888/search?q=python
  - `#main_results`
- http://localhost:8888/search?q=zzqxvbnmxxunlikelyquery
  - `#main_results`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=axeAPI

- http://localhost:8888/search?q=test
  - `#main_results`
  - `#links_on_top`
- http://localhost:8888/search?q=test&categories=images
  - `#main_results`
  - `#links_on_top`
- http://localhost:8888/search?q=test&categories=videos
  - `#main_results`
  - `#links_on_top`
- http://localhost:8888/search?q=python
  - `#main_results`
  - `#links_on_top`
- http://localhost:8888/search?q=zzqxvbnmxxunlikelyquery
  - `#main_results`
  - `#links_on_top`

## [MINOR] aria-allowed-role — ARIA role should be appropriate for the element

Ensure role attribute has an appropriate value for the element
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-role?application=axeAPI

- http://localhost:8888/search?q=test
  - `.page_number[value="2"][role="link"]`
  - `.page_number[value="3"][role="link"]`
  - `.page_number[value="4"][role="link"]`
  - `.page_number[value="5"][role="link"]`
  - `.page_number[value="6"][role="link"]`
  - `.page_number[value="7"][role="link"]`
  - `.page_number[value="8"][role="link"]`
  - `.page_number[value="9"][role="link"]`
  - `.page_number[value="10"][role="link"]`
- http://localhost:8888/search?q=test&categories=images
  - `.page_number[value="2"][role="link"]`
  - `.page_number[value="3"][role="link"]`
  - `.page_number[value="4"][role="link"]`
  - `.page_number[value="5"][role="link"]`
  - `.page_number[value="6"][role="link"]`
  - `.page_number[value="7"][role="link"]`
  - `.page_number[value="8"][role="link"]`
  - `.page_number[value="9"][role="link"]`
  - `.page_number[value="10"][role="link"]`
- http://localhost:8888/search?q=test&categories=videos
  - `.page_number[value="2"][role="link"]`
  - `.page_number[value="3"][role="link"]`
  - `.page_number[value="4"][role="link"]`
  - `.page_number[value="5"][role="link"]`
  - `.page_number[value="6"][role="link"]`
  - `.page_number[value="7"][role="link"]`
  - `.page_number[value="8"][role="link"]`
  - `.page_number[value="9"][role="link"]`
  - `.page_number[value="10"][role="link"]`
- http://localhost:8888/search?q=python
  - `.page_number[value="2"][role="link"]`
  - `.page_number[value="3"][role="link"]`
  - `.page_number[value="4"][role="link"]`
  - `.page_number[value="5"][role="link"]`
  - `.page_number[value="6"][role="link"]`
  - `.page_number[value="7"][role="link"]`
  - `.page_number[value="8"][role="link"]`
  - `.page_number[value="9"][role="link"]`
  - `.page_number[value="10"][role="link"]`
- http://localhost:8888/search?q=zzqxvbnmxxunlikelyquery
  - `.page_number[value="2"][role="link"]`
  - `.page_number[value="3"][role="link"]`
  - `.page_number[value="4"][role="link"]`
  - `.page_number[value="5"][role="link"]`
  - `.page_number[value="6"][role="link"]`
  - `.page_number[value="7"][role="link"]`
  - `.page_number[value="8"][role="link"]`
  - `.page_number[value="9"][role="link"]`
  - `.page_number[value="10"][role="link"]`
- http://localhost:8888/preferences
  - `#tab-label-general`
  - `#tab-label-ui`
  - `#tab-label-privacy`
  - `#tab-label-engines`
  - `#tab-label-query`
  - `#tab-label-cookies`
- http://localhost:8888/preferences [state:preferences-engines-tab]
  - `#tab-label-general`
  - `#tab-label-ui`
  - `#tab-label-privacy`
  - `#tab-label-engines`
  - `#tab-label-category_general`
  - `#tab-label-category_images`
  - `#tab-label-category_videos`
  - `#tab-label-category_news`
  - `#tab-label-category_map`
  - `#tab-label-category_music`
  - … +7 autres
- http://localhost:8888/preferences [state:preferences-category-general-tab]
  - `#tab-label-general`
  - `#tab-label-ui`
  - `#tab-label-privacy`
  - `#tab-label-engines`
  - `#tab-label-category_general`
  - `#tab-label-category_images`
  - `#tab-label-category_videos`
  - `#tab-label-category_news`
  - `#tab-label-category_map`
  - `#tab-label-category_music`
  - … +7 autres

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/empty-table-header?application=axeAPI

- http://localhost:8888/preferences [state:preferences-engines-tab]
  - `.pref-group:nth-child(31) > th[colspan="8"]`
- http://localhost:8888/preferences [state:preferences-category-general-tab]
  - `.pref-group:nth-child(31) > th[colspan="8"]`

## Résultats incomplets à revoir (329)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8888/search?q=test
  - `#language`
  - `#time_range`
  - `#safesearch`
- http://localhost:8888/search?q=test&categories=images
  - `#language`
  - `#time_range`
  - `#safesearch`
  - `article:nth-child(1) > a[rel="noreferrer"] > .image_resolution`
  - `article:nth-child(1) > a[rel="noreferrer"] > .title`
  - `article:nth-child(2) > a[rel="noreferrer"] > .image_resolution`
  - `article:nth-child(2) > a[rel="noreferrer"] > .title`
  - `article:nth-child(3) > a[rel="noreferrer"] > .image_resolution`
  - `article:nth-child(3) > a[rel="noreferrer"] > .title`
  - `article:nth-child(4) > a[rel="noreferrer"] > .image_resolution`
  - … +155 autres
- http://localhost:8888/search?q=test&categories=videos
  - `#language`
  - `#time_range`
  - `#safesearch`
  - `article:nth-child(1) > .result_inner > .thumbnail_link[rel="noreferrer"] > .thumbnail_length`
  - `article:nth-child(2) > .result_inner > .thumbnail_link[rel="noreferrer"] > .thumbnail_length`
  - `article:nth-child(3) > .result_inner > .thumbnail_link[rel="noreferrer"] > .thumbnail_length`
  - `article:nth-child(4) > .result_inner > .thumbnail_link[rel="noreferrer"] > .thumbnail_length`
  - `article:nth-child(5) > .result_inner > .thumbnail_link[rel="noreferrer"] > .thumbnail_length`
  - `article:nth-child(6) > .result_inner > .thumbnail_link[rel="noreferrer"] > .thumbnail_length`
  - `.thumbnail_link[href="https://vimeo.com/33698814"][rel="noreferrer"] > .thumbnail_length`
  - … +113 autres
- http://localhost:8888/search?q=python
  - `#language`
  - `#time_range`
  - `#safesearch`
  - `article:nth-child(8) > .result_inner > .url_header[rel="noreferrer"] > .url_wrapper > .url_o1 > .url_i1`
- http://localhost:8888/search?q=zzqxvbnmxxunlikelyquery
  - `#language`
  - `#time_range`
  - `#safesearch`
  - `article:nth-child(2) > .result_inner > .url_header[rel="noreferrer"] > .url_wrapper > .url_o1 > .url_i1`
  - `article:nth-child(5) > .result_inner > .url_header[rel="noreferrer"] > .url_wrapper > .url_o1 > .url_i1`
  - `article:nth-child(7) > .result_inner > .url_header[rel="noreferrer"] > .url_wrapper > .url_o1 > .url_i1`
  - `article:nth-child(8) > .result_inner > .url_header[rel="noreferrer"] > .url_wrapper > .url_o1 > .url_i1`
- http://localhost:8888/preferences
  - `#tab-content-general > fieldset:nth-child(1) > legend`
  - `select[name="language"]`
  - `select[name="autocomplete"]`
  - `select[name="favicon_resolver"]`
  - `select[name="doi_resolver"]`
  - `select[name="safesearch"]`
- http://localhost:8888/preferences [state:preferences-engines-tab]
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(17) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(19) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(49) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(50) > td:nth-child(8)`
- http://localhost:8888/preferences [state:preferences-category-general-tab]
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(17) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(19) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(49) > td:nth-child(8)`
  - `#tab-content-category_general > .scrollx > .table_engines > tbody > tr:nth-child(50) > td:nth-child(8)`

### aria-allowed-role — ARIA role should be appropriate for the element

- http://localhost:8888/preferences
  - `#tab-label-category_general`
  - `#tab-label-category_images`
  - `#tab-label-category_videos`
  - `#tab-label-category_news`
  - `#tab-label-category_map`
  - `#tab-label-category_music`
  - `#tab-label-category_it`
  - `#tab-label-category_science`
  - `#tab-label-category_files`
  - `#tab-label-category_social\ media`
  - … +1 autres

### th-has-data-cells — Table headers in a data table must refer to data cells

- http://localhost:8888/preferences [state:preferences-engines-tab]
  - `#tab-content-category_general > .scrollx > .table_engines`
- http://localhost:8888/preferences [state:preferences-category-general-tab]
  - `#tab-content-category_general > .scrollx > .table_engines`

