# Audit accessibilité — 2026-10-08

**13 règle(s) violée(s), 37 occurrence(s), 3/3 scénario(s) audité(s), 0 erreur(s), 28 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `d29fb9d6814c`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-attr?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `#mantine-0x4y4zknq-target`
  - `#mantine-ky3xj6ilg-target`
  - `#mantine-rrj41ym3p-target`
- http://localhost:7600/question
  - `#mantine-vrcei4flk-target`
  - `#mantine-0550qvvru-target`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `.C_jSL`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:7600/question
  - `#mantine-0550qvvru-dropdown`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `.n7I0X[href$="6-boucle-46-audit"] > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.RiN7y > .PGwTJ.n7I0X > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.UoGAO.C3IpM[data-truncate="end"] > span`
  - `.qBRlJ`
- http://localhost:7600/question
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.__m__-r4d`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `.siit6`
- http://localhost:7600/question
  - `.siit6`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `.emotion-f9ufz5`
- http://localhost:7600/question
  - `.emotion-f9ufz5`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-dialog-name?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `section`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `.RiN7y > .PGwTJ.n7I0X`
  - `.__m__-r9h > .PGwTJ.n7I0X`
  - `.qBRlJ`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `body > div:nth-child(2)`
- http://localhost:7600/question
  - `body > div:nth-child(2)`
  - `div[data-index="0"] > div > .eGlL9.m_99ac2aa1.mb-mantine-Menu-item > .m_5476e0d3.mb-mantine-Menu-itemLabel.sox6y`
  - `div[data-index="1"] > div > .eGlL9.m_99ac2aa1.mb-mantine-Menu-item > .m_5476e0d3.mb-mantine-Menu-itemLabel.sox6y`
  - `button[data-variant="mb-light"] > .m_5476e0d3.mb-mantine-Menu-itemLabel.sox6y`
- http://localhost:7600/admin/settings/general
  - `body > div:nth-child(2)`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-main-is-top-level?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `.xewzp`
- http://localhost:7600/question
  - `.xewzp`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `.emotion-1mqhnoc`
- http://localhost:7600/question
  - `.emotion-1mqhnoc`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `.emotion-1mqhnoc`
  - `.i8roT`
- http://localhost:7600/question
  - `.emotion-1mqhnoc`
  - `.i8roT`

## [MODERATE] landmark-no-duplicate-banner — Document should not have more than one banner landmark

Ensure the document has at most one banner landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-banner?application=axeAPI

- http://localhost:7600/question/40-b46-products-par-categorie
  - `.MdZZp`

## Résultats incomplets à revoir (28)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:7600/question/40-b46-products-par-categorie
  - `div[aria-label="Settings menu"]`
  - `.__m__-raj`
- http://localhost:7600/question
  - `div[aria-label="Settings menu"]`
- http://localhost:7600/admin/settings/general
  - `.mb-mantine-RadioGroup-root`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7600/question/40-b46-products-par-categorie
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `text[y="-3.5"]`
  - `text[transform="translate(641.5 500.5)"]`
  - `text[transform="translate(49 470.5)"]`
  - `text[transform="translate(49 394.0833)"]`
  - `text[transform="translate(49 317.6667)"]`
  - `text[transform="translate(49 241.25)"]`
  - `text[transform="translate(49 164.8333)"]`
  - `text[transform="translate(49 88.4167)"]`
  - … +5 autres
- http://localhost:7600/question
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.C3IpM.m_b6d8b162.mb-mantine-Text-root:nth-child(2)`
  - `b`
  - `.C3IpM.m_b6d8b162.mb-mantine-Text-root:nth-child(3)`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:7600/question
  - `#mantine-0550qvvru-target`
- http://localhost:7600/admin/settings/general
  - `div[role="radiogroup"]`

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:7600/admin/settings/general
  - `#enable-xrays`
  - `#anon-tracking-enabled`

