# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 18/18 scénario(s) audité(s), 0 erreur(s), 92 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `972e979beb17`

## Résultats incomplets à revoir (92)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8110/
  - `.feature-group:nth-child(5) > .nav-group-container > a[href="replace-and-invert-color-pdf"][data-bs-link="replace-and-invert-color-pdf"][data-bs-title="Replace and Invert Color"] > .other[alt="icon"] > .icon-text`
- http://localhost:8110/merge-pdfs
  - `#closeMultiToolAdvert`
- http://localhost:8110/view-pdf
  - `#pageNumber`
  - `#numPages`
  - `#p1R_mc0 > span[dir="ltr"][role="presentation"]`
  - `#p1R_mc1 > span[dir="ltr"][role="presentation"]`
  - `#p1R_mc2 > span[dir="ltr"][role="presentation"]:nth-child(2)`
  - `#p1R_mc3 > span[dir="ltr"][role="presentation"]`
  - `#p1R_mc4 > span[dir="ltr"][role="presentation"]`
  - `#p1R_mc6 > span[dir="ltr"][role="presentation"]`
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
  - … +21 autres
- http://localhost:8110/ [state:navbar-favoris-dropdown]
  - `a[data-bs-tags="??compressPDFs.tags_en_US??"] > .advance[alt="icon"] > .icon-text`
  - `.feature-group:nth-child(5) > .nav-group-container > a[href="replace-and-invert-color-pdf"][data-bs-link="replace-and-invert-color-pdf"][data-bs-title="Replace and Invert Color"] > .other[alt="icon"] > .icon-text`
  - `.btn-tooltip[role="tooltip"][aria-hidden="true"]:nth-child(91)`
- http://localhost:8110/ [state:navbar-collapse-mobile]
  - `.feature-group:nth-child(5) > .nav-group-container > a[href="replace-and-invert-color-pdf"][data-bs-link="replace-and-invert-color-pdf"][data-bs-title="Replace and Invert Color"] > .other[alt="icon"] > .icon-text`
  - `.btn-tooltip[role="tooltip"][aria-hidden="true"]:nth-child(87)`
- http://localhost:8110/pdf-organizer [state:fichier-charge-organizer]
  - `#closeMultiToolAdvert`
- http://localhost:8110/view-pdf [state:fichier-charge-viewer]
  - `#pageNumber`
  - `#numPages`
  - `div[aria-label="Page ⁨1⁩"] > .textLayer[data-main-rotation="0"] > span[role="presentation"][dir="ltr"]`

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:8110/merge-pdfs [state:navbar-tools-menu-ouvert]
  - `div[aria-labelledby="navbarDropdown-1"]`
- http://localhost:8110/ [state:navbar-langue-dropdown]
  - `div[aria-labelledby="languageDropdown"]`
- http://localhost:8110/ [state:navbar-favoris-dropdown]
  - `.dropdown-mw-28`

