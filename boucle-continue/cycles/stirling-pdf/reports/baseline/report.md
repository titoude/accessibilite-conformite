# Audit accessibilité — 2026-10-04

**11 règle(s) violée(s), 1036 occurrence(s), 18/18 scénario(s) audité(s), 0 erreur(s), 94 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `972e979beb17`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-attr?application=axeAPI

- http://localhost:8110/view-pdf
  - `#editorHighlight`
  - `#editorFreeText`
  - `#editorInk`

## [CRITICAL] select-name — Select element must have an accessible name

Ensure select element has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/select-name?application=axeAPI

- http://localhost:8110/pipeline
  - `#pipelineSelect`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:8110/sign
  - `button[data-title="Delete"]`
  - `#incrementPage`
  - `#decrementPage`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8110/
  - `.go-pro-badge`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/merge-pdfs
  - `.go-pro-badge`
  - `span > a[href$="multi-tool"]`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/multi-tool
  - `.go-pro-badge`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/view-pdf
  - `.go-pro-badge`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
  - `.stirling-link`
- http://localhost:8110/pdf-organizer
  - `.go-pro-badge`
  - `span > a[href$="multi-tool"]`
  - `#submitBtn`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/crop
  - `.go-pro-badge`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/rotate-pdf
  - `.go-pro-badge`
  - `span > a[href$="multi-tool"]`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/pipeline
  - `.go-pro-badge`
  - `a[target="_blank"]:nth-child(5)`
  - `a[target="_blank"]:nth-child(7)`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/sign
  - `.go-pro-badge`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/login
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/about
  - `.go-pro-badge`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/licenses
  - `.go-pro-badge`
  - `tr:nth-child(1) > td:nth-child(1) > a[href$="www.qos.ch"]`
  - `tr:nth-child(1) > td:nth-child(3) > a`
  - `tr:nth-child(2) > td:nth-child(1) > a[href$="www.qos.ch"]`
  - `tr:nth-child(2) > td:nth-child(3) > a`
  - `tr:nth-child(3) > td:nth-child(1) > a`
  - `tr:nth-child(3) > td:nth-child(3) > a`
  - `tr:nth-child(4) > td:nth-child(1) > a`
  - `tr:nth-child(4) > td:nth-child(3) > a`
  - `tr:nth-child(5) > td:nth-child(1) > a`
  - … +539 autres
- http://localhost:8110/merge-pdfs [state:navbar-tools-menu-ouvert]
  - `#merge-pdfs > .organize[alt="icon"] > .icon-text`
  - `.go-pro-badge`
- http://localhost:8110/ [state:navbar-langue-dropdown]
  - `.go-pro-badge`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/ [state:navbar-favoris-dropdown]
  - `.go-pro-badge`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/ [state:navbar-collapse-mobile]
  - `.go-pro-badge`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`
- http://localhost:8110/pdf-organizer [state:fichier-charge-organizer]
  - `span > a[href$="multi-tool"]`
  - `div[title="1101"]`
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`
  - `#cookieBanner`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/label-title-only?application=axeAPI

- http://localhost:8110/view-pdf
  - `#pageNumber`
  - `#scaleSelect`
- http://localhost:8110/view-pdf [state:fichier-charge-viewer]
  - `#pageNumber`

## [SERIOUS] tabindex — Elements should not have tabindex greater than zero

Ensure tabindex attribute values are not greater than 0
Référence : https://dequeuniversity.com/rules/axe/4.13/tabindex?application=axeAPI

- http://localhost:8110/view-pdf
  - `body`
  - `#sidebarToggle`
  - `#viewFind`
  - `#previous`
  - `#next`
  - `#pageNumber`
  - `#backToHome`
  - `#editorHighlight`
  - `#openFile`
  - `#print`
  - … +8 autres
- http://localhost:8110/view-pdf [state:fichier-charge-viewer]
  - `body`
  - `#sidebarToggle`
  - `#viewFind`
  - `#pageNumber`
  - `#secondaryToolbarToggle`
  - `#zoomOut`
  - `#zoomIn`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://localhost:8110/ [state:navbar-collapse-mobile]
  - `#licenses`
  - `#releases`
  - `#survey`
  - `li:nth-child(4) > .footer-link.px-2[target="_blank"]`
  - `li:nth-child(5) > .footer-link.px-2[target="_blank"]`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8110/
  - `#scale-wrap > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div:nth-child(1)`
  - `#groupRecent > .feature-group-header`
  - `.newfeature:nth-child(1) > a[href$="redact"][data-bs-link="redact"][data-bs-title="Manual Redaction"] > .security[alt="icon"] > .icon-text`
  - `.newfeature:nth-child(2) > a[data-bs-link="multi-tool"][data-bs-title="PDF Multi Tool"][data-popularity="2"] > .organize[alt="icon"]`
  - `a[data-bs-tags="??compressPDFs.tags_en_US??"] > .advance[alt="icon"]`
  - `.search-icon`
  - `#searchBar`
  - `div:nth-child(1) > div > div > div:nth-child(4) > div:nth-child(1)`
  - `div[onclick="toggleFavoritesMode()"]`
  - `.features-container > .feature-rows > .feature-group:nth-child(2) > .feature-group-header`
  - … +55 autres
- http://localhost:8110/merge-pdfs
  - `#multi-toolAdvert > div > span`
  - `.tool-header`
  - `label[for="fileInput-input"]`
  - `#fileInput-input-container > .flex-column.align-items-center.d-flex`
  - `form[action="api/v1/general/merge-pdfs"] > .mb-3:nth-child(2)`
- http://localhost:8110/multi-tool
  - `.tool-header`
  - `.mt-filename`
  - `#pdf-upload-input-container > .flex-column.align-items-center.d-flex`
- http://localhost:8110/view-pdf
  - `.start`
  - `#numPages`
  - `#editorModeButtons`
  - `#scaleSelectContainer`
- http://localhost:8110/pdf-organizer
  - `#multi-toolAdvert > div > span`
  - `.tool-header`
  - `#fileInput-input-container > .flex-column.align-items-center.d-flex`
  - `.mb-3:nth-child(8)`
  - `.mb-3:nth-child(9)`
- http://localhost:8110/crop
  - `.tool-header`
  - `#fileInput-input-container > .flex-column.align-items-center.d-flex`
- http://localhost:8110/rotate-pdf
  - `#multi-toolAdvert > div > span`
  - `.tool-header`
  - `#fileInput-input-container > .flex-column.align-items-center.d-flex`
- http://localhost:8110/pipeline
  - `.tool-header`
  - `.element-margin:nth-child(1)`
  - `#fileInput-input-container > .flex-column.align-items-center.d-flex`
  - `a[target="_blank"]:nth-child(5)`
  - `a[target="_blank"]:nth-child(7)`
- http://localhost:8110/sign
  - `.tool-header`
  - `#pdf-upload-input-container > .flex-column.align-items-center.d-flex`
- http://localhost:8110/licenses
  - `#content-wrap > .container`
- http://localhost:8110/merge-pdfs [state:navbar-tools-menu-ouvert]
  - `#multi-toolAdvert > div > span`
  - `.tool-header`
  - `label[for="fileInput-input"]`
  - `#fileInput-input-container > .flex-column.align-items-center.d-flex`
  - `form[action="api/v1/general/merge-pdfs"] > .mb-3:nth-child(2)`
- http://localhost:8110/ [state:navbar-langue-dropdown]
  - `#scale-wrap > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div:nth-child(1)`
  - `#groupRecent > .feature-group-header`
  - `.newfeature:nth-child(1) > a[href$="redact"][data-bs-link="redact"][data-bs-title="Manual Redaction"] > .security[alt="icon"] > .icon-text`
  - `.newfeature:nth-child(2) > a[data-bs-link="multi-tool"][data-bs-title="PDF Multi Tool"][data-popularity="2"] > .organize[alt="icon"]`
  - `a[data-bs-tags="??compressPDFs.tags_en_US??"] > .advance[alt="icon"]`
  - `.search-icon`
  - `#searchBar`
  - `div:nth-child(1) > div > div > div:nth-child(4) > div:nth-child(1)`
  - `div[onclick="toggleFavoritesMode()"]`
  - `.features-container > .feature-rows > .feature-group:nth-child(2) > .feature-group-header`
  - … +56 autres
- http://localhost:8110/ [state:navbar-favoris-dropdown]
  - `#scale-wrap > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div:nth-child(1)`
  - `#groupRecent > .feature-group-header`
  - `.newfeature:nth-child(1) > a[href$="redact"][data-bs-link="redact"][data-bs-title="Manual Redaction"] > .security[alt="icon"] > .icon-text`
  - `.newfeature:nth-child(2) > a[data-bs-link="multi-tool"][data-bs-title="PDF Multi Tool"][data-popularity="2"] > .organize[alt="icon"]`
  - `a[data-bs-tags="??compressPDFs.tags_en_US??"] > .advance[alt="icon"]`
  - `.search-icon`
  - `#searchBar`
  - `div:nth-child(1) > div > div > div:nth-child(4) > div:nth-child(1)`
  - `div[onclick="toggleFavoritesMode()"]`
  - `.features-container > .feature-rows > .feature-group:nth-child(2) > .feature-group-header`
  - … +56 autres
- http://localhost:8110/ [state:navbar-collapse-mobile]
  - `#scale-wrap > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div:nth-child(1)`
  - `#groupRecent > .feature-group-header`
  - `.newfeature:nth-child(1) > a[href$="redact"][data-bs-link="redact"][data-bs-title="Manual Redaction"] > .security[alt="icon"] > .icon-text`
  - `.search-icon`
  - `#searchBar`
  - `div:nth-child(1) > div > div > div:nth-child(4) > div:nth-child(1)`
  - `div[onclick="toggleFavoritesMode()"]`
  - `.features-container > .feature-rows > .feature-group:nth-child(2) > .feature-group-header`
  - `.feature-group:nth-child(2) > .nav-group-container > a[href$="scale-pages"][data-bs-link="scale-pages"][data-bs-tags="resize,modify,dimension,adapt"] > .organize[alt="icon"]`
  - `.feature-group:nth-child(2) > .nav-group-container > a[href$="crop"][data-bs-link="crop"][data-bs-tags="trim,shrink,edit,shape"] > .organize[alt="icon"]`
  - … +53 autres
- http://localhost:8110/pdf-organizer [state:fichier-charge-organizer]
  - `#multi-toolAdvert > div > span`
  - `.tool-header`
  - `#fileInput-input-container > .flex-column.align-items-center.d-flex`
  - `.file-info`
  - `.mb-3:nth-child(8)`
  - `.mb-3:nth-child(9)`
- http://localhost:8110/view-pdf [state:fichier-charge-viewer]
  - `.start`
  - `#numPages`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:8110/
  - `html`
- http://localhost:8110/merge-pdfs
  - `html`
- http://localhost:8110/multi-tool
  - `html`
- http://localhost:8110/pdf-organizer
  - `html`
- http://localhost:8110/crop
  - `html`
- http://localhost:8110/rotate-pdf
  - `html`
- http://localhost:8110/pipeline
  - `html`
- http://localhost:8110/sign
  - `html`
- http://localhost:8110/about
  - `html`
- http://localhost:8110/licenses
  - `html`
- http://localhost:8110/ [state:navbar-langue-dropdown]
  - `html`
- http://localhost:8110/ [state:navbar-favoris-dropdown]
  - `html`
- http://localhost:8110/ [state:navbar-collapse-mobile]
  - `html`
- http://localhost:8110/pdf-organizer [state:fichier-charge-organizer]
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:8110/
  - `html`
- http://localhost:8110/merge-pdfs
  - `html`
- http://localhost:8110/multi-tool
  - `html`
- http://localhost:8110/pdf-organizer
  - `html`
- http://localhost:8110/crop
  - `html`
- http://localhost:8110/rotate-pdf
  - `html`
- http://localhost:8110/pipeline
  - `html`
- http://localhost:8110/sign
  - `html`
- http://localhost:8110/about
  - `html`
- http://localhost:8110/licenses
  - `html`
- http://localhost:8110/ [state:navbar-langue-dropdown]
  - `html`
- http://localhost:8110/ [state:navbar-favoris-dropdown]
  - `html`
- http://localhost:8110/ [state:navbar-collapse-mobile]
  - `html`
- http://localhost:8110/pdf-organizer [state:fichier-charge-organizer]
  - `html`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.13/meta-viewport?application=axeAPI

- http://localhost:8110/view-pdf
  - `body > meta[name="viewport"]`
- http://localhost:8110/view-pdf [state:fichier-charge-viewer]
  - `body > meta[name="viewport"]`

## Résultats incomplets à revoir (94)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8110/
  - `.feature-group:nth-child(5) > .nav-group-container > a[href="replace-and-invert-color-pdf"][data-bs-link="replace-and-invert-color-pdf"][data-bs-title="Replace and Invert Color"] > .other[alt="icon"] > .icon-text`
- http://localhost:8110/merge-pdfs
  - `#closeMultiToolAdvert`
- http://localhost:8110/view-pdf
  - `#pageNumber`
  - `#numPages`
- http://localhost:8110/pdf-organizer
  - `#closeMultiToolAdvert`
- http://localhost:8110/rotate-pdf
  - `#closeMultiToolAdvert`
- http://localhost:8110/merge-pdfs [state:navbar-tools-menu-ouvert]
  - `#scale-pages > .organize[alt="icon"] > .icon-text`
  - `#stamp > .security[alt="icon"] > .icon-text`
  - `#add-watermark > .security[alt="icon"] > .icon-text`
  - `#change-permissions > .security[alt="icon"] > .icon-text`
  - `#redact > .security[alt="icon"] > .icon-text`
  - `#remove-cert-sign > .security[alt="icon"] > .icon-text`
  - `#remove-password > .security[alt="icon"] > .icon-text`
  - `#validate-signature > .security[alt="icon"] > .icon-text`
  - `#change-metadata > .other[alt="icon"] > .icon-text`
  - `#extract-images > .other[alt="icon"] > .icon-text`
  - … +27 autres
- http://localhost:8110/ [state:navbar-langue-dropdown]
  - `a[data-bs-language-code="no_NB"]`
  - `a[data-bs-language-code="pl_PL"]`
  - `a[data-bs-language-code="pt_BR"]`
  - `a[data-bs-language-code="pt_PT"]`
  - `a[data-bs-language-code="ro_RO"]`
  - `a[data-bs-language-code="ru_RU"]`
  - `a[data-bs-language-code="sk_SK"]`
  - `a[data-bs-language-code="sl_SI"]`
  - `a[data-bs-language-code="sr_LATN_RS"]`
  - `a[data-bs-language-code="sv_SE"]`
  - … +20 autres
- http://localhost:8110/ [state:navbar-favoris-dropdown]
  - `a[data-bs-tags="??compressPDFs.tags_en_US??"] > .advance[alt="icon"] > .icon-text`
  - `.feature-group:nth-child(5) > .nav-group-container > a[href="replace-and-invert-color-pdf"][data-bs-link="replace-and-invert-color-pdf"][data-bs-title="Replace and Invert Color"] > .other[alt="icon"] > .icon-text`
- http://localhost:8110/pdf-organizer [state:fichier-charge-organizer]
  - `#closeMultiToolAdvert`
- http://localhost:8110/view-pdf [state:fichier-charge-viewer]
  - `#pageNumber`
  - `#numPages`
  - `div[aria-label="Page ⁨1⁩"] > .textLayer[data-main-rotation="0"] > span[role="presentation"][dir="ltr"]`
  - `div[aria-label="Page ⁨2⁩"] > .textLayer[data-main-rotation="0"] > span[role="presentation"][dir="ltr"]`

### bypass — Page must have means to bypass repeated blocks

- http://localhost:8110/merge-pdfs
  - `html`
- http://localhost:8110/multi-tool
  - `html`
- http://localhost:8110/view-pdf
  - `html`
- http://localhost:8110/pdf-organizer
  - `html`
- http://localhost:8110/crop
  - `html`
- http://localhost:8110/rotate-pdf
  - `html`
- http://localhost:8110/pipeline
  - `html`
- http://localhost:8110/sign
  - `html`
- http://localhost:8110/about
  - `html`
- http://localhost:8110/licenses
  - `html`
- http://localhost:8110/pdf-organizer [state:fichier-charge-organizer]
  - `html`

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:8110/merge-pdfs [state:navbar-tools-menu-ouvert]
  - `div[aria-labelledby="navbarDropdown-1"]`
- http://localhost:8110/ [state:navbar-langue-dropdown]
  - `div[aria-labelledby="languageDropdown"]`
- http://localhost:8110/ [state:navbar-favoris-dropdown]
  - `.dropdown-mw-28`

