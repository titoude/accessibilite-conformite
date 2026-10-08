# Audit accessibilité — 2026-10-08

**18 règle(s) violée(s), 296 occurrence(s), 12/15 scénario(s) audité(s), 3 erreur(s), 96 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `c8ce5648461e`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-attr?application=axeAPI

- http://localhost:7600/
  - `#mantine-9q58qfmew-target`
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r41\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/browse/models
  - `#mantine-sx3j6mfxe-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r58\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `.emotion-wphua1`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/browse/databases
  - `#mantine-wipz3ab0e-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r4v\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `.emotion-wphua1`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/collection/root/our-analytics
  - `#mantine-ba5kf9p3x-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r40\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/collection/6-boucle-46-audit
  - `#mantine-h38dm3y67-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r3g\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
  - `#mantine-0zoyr2b6i-target`
- http://localhost:7600/dashboard/2
  - `#mantine-3d4eyd1nt-target`
  - `#mantine-txuaab9ib-target`
- http://localhost:7600/search?q=orders
  - `#mantine-wrsfxtyy6-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r66\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
  - `#mantine-zm9uqbmca-target`
  - `#mantine-qj0vu5esg-target`
  - … +3 autres
- http://localhost:7600/trash
  - `#mantine-m6dn57jlp-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r38\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/admin/people
  - `#mantine-5rtmty022-target`
  - `#mantine-zu3d3mpil-target`
- http://localhost:7600/account/profile
  - `#mantine-d6hdu0kxw-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r53\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/nosuchpage-46
  - `#mantine-clsmdvak5-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r3o\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:7600/
  - `div[role="tab"]`
- http://localhost:7600/browse/models
  - `div[role="tab"]`
- http://localhost:7600/browse/databases
  - `div[role="tab"]`
- http://localhost:7600/collection/root/our-analytics
  - `div[role="tab"]`
- http://localhost:7600/collection/6-boucle-46-audit
  - `div[role="tab"]`
- http://localhost:7600/search?q=orders
  - `div[role="tab"]`
- http://localhost:7600/trash
  - `div[role="tab"]`
- http://localhost:7600/account/profile
  - `div[role="tab"]`
- http://localhost:7600/nosuchpage-46
  - `div[role="tab"]`

## [CRITICAL] aria-roles — ARIA roles used must conform to valid values

Ensure all elements with a role attribute use a valid value
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-roles?application=axeAPI

- http://localhost:7600/
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/browse/models
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/browse/databases
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/collection/root/our-analytics
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/collection/6-boucle-46-audit
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/search?q=orders
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/trash
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/account/profile
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/nosuchpage-46
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`

## [CRITICAL] aria-required-attr — Required ARIA attributes must be provided

Ensure elements with ARIA roles have all required ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-attr?application=axeAPI

- http://localhost:7600/browse/models
  - `.ccJbd`
- http://localhost:7600/search?q=orders
  - `a[href="/question#?db=1&table=2"]`
  - `a[href$="1-orders-people"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(4) > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(5) > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(6) > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(7) > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `a[href="/metric/19"]`
  - `div[aria-label="Total orders this quarter card"] > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(10) > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `div[aria-label="Enormous Wool Car trend card"] > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - … +6 autres

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.14/image-alt?application=axeAPI

- http://localhost:7600/collection/root/our-analytics
  - `img`
- http://localhost:7600/nosuchpage-46
  - `img`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

- http://localhost:7600/account/profile
  - `#mantine-4tga9jdyh-tab-\/account\/profile`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.14/label?application=axeAPI

- http://localhost:7600/account/profile
  - `#mantine-txkqo201k`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:7600/
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.emotion-14cj8ah.ennrbig5[href="/"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:7600/browse/models
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `a[href$="models"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:7600/browse/databases
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `a[href$="databases"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:7600/collection/root/our-analytics
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
- http://localhost:7600/collection/6-boucle-46-audit
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.emotion-14cj8ah.ennrbig5[href$="6-boucle-46-audit"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:7600/dashboard/2
  - `.UoGAO`
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
- http://localhost:7600/trash
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `a[href$="trash"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:7600/admin/people
  - `.emotion-1xa9vpi`
  - `#mantine-5rtmty022-target > span > span`
  - `.emotion-w54son`
- http://localhost:7600/admin/databases
  - `.ygoQK`
- http://localhost:7600/account/profile
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.VPsBI`
- http://localhost:7600/nosuchpage-46
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:7600/
  - `.siit6`
- http://localhost:7600/browse/models
  - `.siit6`
- http://localhost:7600/browse/databases
  - `.siit6`
- http://localhost:7600/collection/root/our-analytics
  - `.siit6`
- http://localhost:7600/collection/6-boucle-46-audit
  - `.siit6`
- http://localhost:7600/dashboard/2
  - `.siit6`
- http://localhost:7600/search?q=orders
  - `.siit6`
- http://localhost:7600/trash
  - `.siit6`
- http://localhost:7600/account/profile
  - `.siit6`
- http://localhost:7600/nosuchpage-46
  - `.siit6`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:7600/
  - `.emotion-f9ufz5`
- http://localhost:7600/browse/models
  - `.emotion-f9ufz5`
- http://localhost:7600/browse/databases
  - `.emotion-f9ufz5`
- http://localhost:7600/collection/root/our-analytics
  - `.emotion-f9ufz5`
- http://localhost:7600/collection/6-boucle-46-audit
  - `.emotion-f9ufz5`
- http://localhost:7600/dashboard/2
  - `.emotion-f9ufz5`
- http://localhost:7600/search?q=orders
  - `.emotion-f9ufz5`
- http://localhost:7600/trash
  - `.emotion-f9ufz5`
- http://localhost:7600/account/profile
  - `.emotion-f9ufz5`
- http://localhost:7600/nosuchpage-46
  - `.emotion-f9ufz5`

## [SERIOUS] listitem — <li> elements must be contained in a <ul> or <ol>

Ensure <li> elements are used semantically
Référence : https://dequeuniversity.com/rules/axe/4.14/listitem?application=axeAPI

- http://localhost:7600/
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r41\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/browse/models
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r58\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `.emotion-wphua1`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/browse/databases
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r4v\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `.emotion-wphua1`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/collection/root/our-analytics
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r40\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/collection/6-boucle-46-audit
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r3g\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/search?q=orders
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r66\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/trash
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r38\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/account/profile
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r53\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:7600/nosuchpage-46
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r3o\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.14/nested-interactive?application=axeAPI

- http://localhost:7600/
  - `div[role="tab"]`
  - `#\:r40\:`
  - `#\:r4h\:`
- http://localhost:7600/browse/models
  - `div[role="tab"]`
  - `#\:r57\:`
  - `#\:r5p\:`
- http://localhost:7600/browse/databases
  - `div[role="tab"]`
  - `#\:r4u\:`
  - `#\:r5g\:`
- http://localhost:7600/collection/root/our-analytics
  - `div[role="tab"]`
  - `#\:r3v\:`
  - `#\:r4h\:`
- http://localhost:7600/collection/6-boucle-46-audit
  - `div[role="tab"]`
  - `#\:r3f\:`
  - `#\:r40\:`
- http://localhost:7600/search?q=orders
  - `div[role="tab"]`
  - `#\:r65\:`
  - `#\:r6n\:`
- http://localhost:7600/trash
  - `div[role="tab"]`
  - `#\:r37\:`
  - `#\:r3o\:`
- http://localhost:7600/account/profile
  - `div[role="tab"]`
  - `#\:r52\:`
  - `#\:r5k\:`
- http://localhost:7600/nosuchpage-46
  - `div[role="tab"]`
  - `#\:r3n\:`
  - `#\:r49\:`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:7600/dashboard/2
  - `.yTKVH`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:7600/
  - `body > div:nth-child(2)`
- http://localhost:7600/browse/models
  - `body > div:nth-child(2)`
- http://localhost:7600/browse/databases
  - `body > div:nth-child(2)`
- http://localhost:7600/collection/root/our-analytics
  - `body > div:nth-child(2)`
- http://localhost:7600/collection/6-boucle-46-audit
  - `body > div:nth-child(2)`
- http://localhost:7600/dashboard/2
  - `body > div:nth-child(2)`
- http://localhost:7600/search?q=orders
  - `body > div:nth-child(2)`
- http://localhost:7600/trash
  - `body > div:nth-child(2)`
- http://localhost:7600/admin/people
  - `body > div:nth-child(2)`
- http://localhost:7600/admin/databases
  - `body > div:nth-child(2)`
- http://localhost:7600/account/profile
  - `body > div:nth-child(2)`
- http://localhost:7600/nosuchpage-46
  - `body > div:nth-child(2)`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:7600/browse/models
  - `h3`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:7600/browse/models
  - `aside`

## [MINOR] aria-allowed-role — ARIA role should be appropriate for the element

Ensure role attribute has an appropriate value for the element
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-role?application=axeAPI

- http://localhost:7600/collection/root/our-analytics
  - `h2`
- http://localhost:7600/search?q=orders
  - `a[href="/question#?db=1&table=2"]`
  - `a[href$="1-orders-people"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(4) > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(5) > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(6) > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(7) > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `a[href="/metric/19"]`
  - `div[aria-label="Total orders this quarter card"] > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(10) > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - `div[aria-label="Enormous Wool Car trend card"] > .YUlBC.m_6d731127.mb-mantine-Stack-root > .m_4081bf90.mb-mantine-Group-root > .Ynf3d[role="heading"][data-testid="search-result-item-name"]`
  - … +6 autres
- http://localhost:7600/nosuchpage-46
  - `h2`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/empty-table-header?application=axeAPI

- http://localhost:7600/browse/models
  - `th:nth-child(4)`
- http://localhost:7600/admin/people
  - `th:nth-child(2)`
  - `th:nth-child(6)`

## Résultats incomplets à revoir (96)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:7600/
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/browse/models
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
  - `.warDK`
- http://localhost:7600/browse/databases
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/collection/root/our-analytics
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
  - `.AXVjz`
- http://localhost:7600/collection/6-boucle-46-audit
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/dashboard/2
  - `div[aria-label="Settings menu"]`
- http://localhost:7600/search?q=orders
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
  - `div[data-model-type="table"]`
  - `div[data-model-type="dataset"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(4)`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(5)`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(6)`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(7)`
  - `div[data-model-type="metric"]`
  - … +9 autres
- http://localhost:7600/trash
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/admin/people
  - `#mantine-5rtmty022-target`
  - `#mantine-zu3d3mpil-target`
- http://localhost:7600/account/profile
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:7600/nosuchpage-46
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
  - `.AXVjz`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7600/
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-r33`
- http://localhost:7600/browse/models
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:7600/browse/databases
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:7600/collection/root/our-analytics
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:7600/collection/6-boucle-46-audit
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:7600/dashboard/2
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `div[_echarts_instance_="ec_1791434079160"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[y="-3.5"][transform="matrix(0,-1,1,0,21,139.1563)"][text-anchor="middle"]`
  - `div[_echarts_instance_="ec_1791434079160"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(203 296.3125)"][y="3.5"][text-anchor="middle"]`
  - `div[_echarts_instance_="ec_1791434079160"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 266.3125)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434079160"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 223.9271)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434079160"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 181.5417)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434079160"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 139.1563)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434079160"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 96.7708)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791434079160"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 54.3854)"][text-anchor="end"]`
  - … +18 autres
- http://localhost:7600/search?q=orders
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:7600/trash
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:7600/account/profile
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:7600/nosuchpage-46
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`

## Erreurs (3) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:7600/question/40 — le document final diffère du document demandé (http://localhost:7600/question/40-b46-products-par-categorie) — déclarer l'URL réelle de l'état dans STATES
- http://localhost:7600/question/new — le document final diffère du document demandé (http://localhost:7600/question#eyJkYXRhc2V0X3F1ZXJ5Ijp7ImRhdGFiYXNlIjpudWxsLCJxdWVyeSI6eyJzb3VyY2UtdGFibGUiOm51bGx9LCJ0eXBlIjoicXVlcnkifSwiZGlzcGxheSI6InRhYmxlIiwidmlzdWFsaXphdGlvbl9zZXR0aW5ncyI6e319) — déclarer l'URL réelle de l'état dans STATES
- http://localhost:7600/admin/settings — le document final diffère du document demandé (http://localhost:7600/admin/settings/general) — déclarer l'URL réelle de l'état dans STATES

