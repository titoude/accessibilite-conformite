# Audit accessibilité — 2026-10-08

**23 règle(s) violée(s), 381 occurrence(s), 17/17 scénario(s) audité(s), 0 erreur(s), 139 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `139d92f8e309`

## [CRITICAL] aria-allowed-attr — Elements must only use supported ARIA attributes

Ensure an element's role supports its ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-attr?application=axeAPI

- http://localhost:8801/
  - `#mantine-mumgaplf3-target`
  - `.emotion-wphua1`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r43\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/browse/models
  - `#mantine-91dez1w2i-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r4h\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `.emotion-wphua1`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/browse/databases
  - `#mantine-w95umcbx9-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r50\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `.emotion-wphua1`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/collection/root/our-analytics
  - `#mantine-q9ze5sbxm-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r41\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/collection/6-boucle-46-audit
  - `#mantine-u5i42o2zo-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r3g\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
  - `#mantine-0y13tqzb3-target`
- http://localhost:8801/dashboard/2
  - `#mantine-ivepjpd7s-target`
  - `#mantine-w1axuth1c-target`
- http://localhost:8801/question/40-b46-products-par-categorie
  - `#mantine-gjg8mqkh7-target`
  - `#mantine-3qq0a7d4g-target`
  - `#mantine-kebefjkvp-target`
- http://localhost:8801/question
  - `#mantine-se5bbmikw-target`
  - `#mantine-g63rhl42v-target`
- http://localhost:8801/search?q=orders
  - `#mantine-v0l9bjybb-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r66\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
  - `#mantine-i2e4oos2n-target`
  - `#mantine-psbeobwp9-target`
  - … +3 autres
- http://localhost:8801/trash
  - `#mantine-viadv3lms-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r38\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/admin/people
  - `#mantine-151ih42ah-target`
  - `#mantine-dhk332ngk-target`
- http://localhost:8801/account/profile
  - `#mantine-re415cx1b-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r53\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/nosuchpage-46
  - `#mantine-rlyxj25vq-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r3o\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/browse/metrics
  - `#mantine-t2bh1ganh-target`
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r5j\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `.emotion-wphua1`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `#mantine-tpk9f9xt2-target`
  - `#mantine-1565qv53t-target`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-parent?application=axeAPI

- http://localhost:8801/
  - `div[role="tab"]`
- http://localhost:8801/browse/models
  - `div[role="tab"]`
- http://localhost:8801/browse/databases
  - `div[role="tab"]`
- http://localhost:8801/collection/root/our-analytics
  - `div[role="tab"]`
- http://localhost:8801/collection/6-boucle-46-audit
  - `div[role="tab"]`
- http://localhost:8801/search?q=orders
  - `div[role="tab"]`
- http://localhost:8801/trash
  - `div[role="tab"]`
- http://localhost:8801/account/profile
  - `div[role="tab"]`
- http://localhost:8801/nosuchpage-46
  - `div[role="tab"]`
- http://localhost:8801/browse/metrics
  - `div[role="tab"]`

## [CRITICAL] aria-roles — ARIA roles used must conform to valid values

Ensure all elements with a role attribute use a valid value
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-roles?application=axeAPI

- http://localhost:8801/
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/browse/models
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/browse/databases
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/collection/root/our-analytics
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/collection/6-boucle-46-audit
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/search?q=orders
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/trash
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/account/profile
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/nosuchpage-46
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/browse/metrics
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`

## [CRITICAL] aria-required-attr — Required ARIA attributes must be provided

Ensure elements with ARIA roles have all required ARIA attributes
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-attr?application=axeAPI

- http://localhost:8801/browse/models
  - `.ccJbd`
- http://localhost:8801/search?q=orders
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
- http://localhost:8801/browse/metrics
  - `.ccJbd`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.14/image-alt?application=axeAPI

- http://localhost:8801/collection/root/our-analytics
  - `img`
- http://localhost:8801/nosuchpage-46
  - `img`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-valid-attr-value?application=axeAPI

- http://localhost:8801/question/40-b46-products-par-categorie
  - `.C_jSL`
- http://localhost:8801/account/profile
  - `#mantine-qywei74xv-tab-\/account\/profile`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-required-children?application=axeAPI

- http://localhost:8801/question
  - `#mantine-g63rhl42v-dropdown`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.14/label?application=axeAPI

- http://localhost:8801/account/profile
  - `#mantine-qkqo4r5ce`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:8801/
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.emotion-14cj8ah.ennrbig5[href="/"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:8801/browse/models
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `a[href$="models"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:8801/browse/databases
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `a[href$="databases"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:8801/collection/root/our-analytics
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
- http://localhost:8801/collection/6-boucle-46-audit
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.emotion-14cj8ah.ennrbig5[href$="6-boucle-46-audit"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:8801/dashboard/2
  - `.UoGAO`
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
- http://localhost:8801/question/40-b46-products-par-categorie
  - `.n7I0X[href$="6-boucle-46-audit"] > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.RiN7y > .PGwTJ.n7I0X > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.UoGAO.C3IpM[data-truncate="end"] > span`
  - `.qBRlJ`
- http://localhost:8801/question
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.__m__-r4d`
- http://localhost:8801/trash
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `a[href$="trash"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:8801/admin/people
  - `.emotion-1xa9vpi`
  - `#mantine-151ih42ah-target > span > span`
  - `.emotion-w54son`
- http://localhost:8801/admin/databases
  - `.ygoQK`
- http://localhost:8801/account/profile
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.VPsBI`
- http://localhost:8801/nosuchpage-46
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
- http://localhost:8801/browse/metrics
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `a[href$="metrics"] > .emotion-1ygoewh.e4mkl603`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `.n7I0X.KKzUO[href$="6-boucle-46-audit"] > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.PGwTJ > .c6DUo.XSImJ.m_4081bf90 > .UoGAO.C3IpM[data-truncate="end"]`
  - `.qBRlJ`
  - `.Qc6Rv`

## [SERIOUS] label-content-name-mismatch — Elements must have their visible text as part of their accessible name

Ensure that elements labelled through their content must have their visible text as part of their accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch?application=axeAPI

- http://localhost:8801/
  - `.siit6`
- http://localhost:8801/browse/models
  - `.siit6`
- http://localhost:8801/browse/databases
  - `.siit6`
- http://localhost:8801/collection/root/our-analytics
  - `.siit6`
- http://localhost:8801/collection/6-boucle-46-audit
  - `.siit6`
- http://localhost:8801/dashboard/2
  - `.siit6`
- http://localhost:8801/question/40-b46-products-par-categorie
  - `.siit6`
- http://localhost:8801/question
  - `.siit6`
- http://localhost:8801/search?q=orders
  - `.siit6`
- http://localhost:8801/trash
  - `.siit6`
- http://localhost:8801/account/profile
  - `.siit6`
- http://localhost:8801/nosuchpage-46
  - `.siit6`
- http://localhost:8801/browse/metrics
  - `.siit6`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `.siit6`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:8801/
  - `.emotion-f9ufz5`
- http://localhost:8801/browse/models
  - `.emotion-f9ufz5`
- http://localhost:8801/browse/databases
  - `.emotion-f9ufz5`
- http://localhost:8801/collection/root/our-analytics
  - `.emotion-f9ufz5`
- http://localhost:8801/collection/6-boucle-46-audit
  - `.emotion-f9ufz5`
- http://localhost:8801/dashboard/2
  - `.emotion-f9ufz5`
- http://localhost:8801/question/40-b46-products-par-categorie
  - `.emotion-f9ufz5`
- http://localhost:8801/question
  - `.emotion-f9ufz5`
- http://localhost:8801/search?q=orders
  - `.emotion-f9ufz5`
- http://localhost:8801/trash
  - `.emotion-f9ufz5`
- http://localhost:8801/account/profile
  - `.emotion-f9ufz5`
- http://localhost:8801/nosuchpage-46
  - `.emotion-f9ufz5`
- http://localhost:8801/browse/metrics
  - `.emotion-f9ufz5`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `.emotion-f9ufz5`

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
- http://localhost:8801/browse/models
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r4h\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `.emotion-wphua1`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/browse/databases
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r50\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `.emotion-wphua1`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/collection/root/our-analytics
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r41\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/collection/6-boucle-46-audit
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r3g\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/search?q=orders
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r66\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/trash
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r38\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/account/profile
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r53\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/nosuchpage-46
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r3o\: > .e1tts7r38.emotion-1ksb2q4.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `li[aria-label="Browse metrics"]`
- http://localhost:8801/browse/metrics
  - `li[aria-label="Home"]`
  - `li[aria-label="Add your data"]`
  - `li[aria-label="How to use Metabase"]`
  - `#\:r5j\: > .emotion-1ksb2q4.e1tts7r38.ennrbig2`
  - `li[aria-label="Browse databases"]`
  - `li[aria-label="Browse models"]`
  - `.emotion-wphua1`

## [SERIOUS] nested-interactive — Interactive controls must not be nested

Ensure interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies
Référence : https://dequeuniversity.com/rules/axe/4.14/nested-interactive?application=axeAPI

- http://localhost:8801/
  - `div[role="tab"]`
  - `#\:r42\:`
  - `#\:r4k\:`
- http://localhost:8801/browse/models
  - `div[role="tab"]`
  - `#\:r4g\:`
  - `#\:r52\:`
- http://localhost:8801/browse/databases
  - `div[role="tab"]`
  - `#\:r4v\:`
  - `#\:r5h\:`
- http://localhost:8801/collection/root/our-analytics
  - `div[role="tab"]`
  - `#\:r40\:`
  - `#\:r4i\:`
- http://localhost:8801/collection/6-boucle-46-audit
  - `div[role="tab"]`
  - `#\:r3f\:`
  - `#\:r40\:`
- http://localhost:8801/search?q=orders
  - `div[role="tab"]`
  - `#\:r65\:`
  - `#\:r6n\:`
- http://localhost:8801/trash
  - `div[role="tab"]`
  - `#\:r37\:`
  - `#\:r3o\:`
- http://localhost:8801/account/profile
  - `div[role="tab"]`
  - `#\:r52\:`
  - `#\:r5k\:`
- http://localhost:8801/nosuchpage-46
  - `div[role="tab"]`
  - `#\:r3n\:`
  - `#\:r49\:`
- http://localhost:8801/browse/metrics
  - `div[role="tab"]`
  - `#\:r5i\:`
  - `#\:r63\:`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.14/target-size?application=axeAPI

- http://localhost:8801/dashboard/2
  - `.yTKVH`
- http://localhost:8801/question/40-b46-products-par-categorie
  - `.RiN7y > .PGwTJ.n7I0X`
  - `.__m__-r9i > .PGwTJ.n7I0X`
  - `.qBRlJ`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `.PGwTJ`
  - `.qBRlJ`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-dialog-name?application=axeAPI

- http://localhost:8801/question/40-b46-products-par-categorie
  - `section`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `section`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:8801/
  - `body > div:nth-child(2)`
- http://localhost:8801/browse/models
  - `body > div:nth-child(2)`
- http://localhost:8801/browse/databases
  - `body > div:nth-child(2)`
- http://localhost:8801/collection/root/our-analytics
  - `body > div:nth-child(2)`
- http://localhost:8801/collection/6-boucle-46-audit
  - `body > div:nth-child(2)`
- http://localhost:8801/dashboard/2
  - `body > div:nth-child(2)`
- http://localhost:8801/question/40-b46-products-par-categorie
  - `body > div:nth-child(2)`
- http://localhost:8801/question
  - `body > div:nth-child(2)`
  - `div[data-index="0"] > div > .eGlL9.m_99ac2aa1.mb-mantine-Menu-item > .m_5476e0d3.mb-mantine-Menu-itemLabel.sox6y`
  - `div[data-index="1"] > div > .eGlL9.m_99ac2aa1.mb-mantine-Menu-item > .m_5476e0d3.mb-mantine-Menu-itemLabel.sox6y`
  - `button[data-variant="mb-light"] > .m_5476e0d3.mb-mantine-Menu-itemLabel.sox6y`
- http://localhost:8801/search?q=orders
  - `body > div:nth-child(2)`
- http://localhost:8801/trash
  - `body > div:nth-child(2)`
- http://localhost:8801/admin/settings/general
  - `body > div:nth-child(2)`
- http://localhost:8801/admin/people
  - `body > div:nth-child(2)`
- http://localhost:8801/admin/databases
  - `body > div:nth-child(2)`
- http://localhost:8801/account/profile
  - `body > div:nth-child(2)`
- http://localhost:8801/nosuchpage-46
  - `body > div:nth-child(2)`
- http://localhost:8801/browse/metrics
  - `body > div:nth-child(2)`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `body > div:nth-child(2)`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:8801/browse/models
  - `aside`
- http://localhost:8801/question/40-b46-products-par-categorie
  - `.emotion-1mqhnoc`
  - `.i8roT`
- http://localhost:8801/question
  - `.emotion-1mqhnoc`
  - `.i8roT`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `.emotion-1mqhnoc`
  - `.i8roT`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-main-is-top-level?application=axeAPI

- http://localhost:8801/question/40-b46-products-par-categorie
  - `.xewzp`
- http://localhost:8801/question
  - `.xewzp`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `.xewzp`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://localhost:8801/question/40-b46-products-par-categorie
  - `.emotion-1mqhnoc`
- http://localhost:8801/question
  - `.emotion-1mqhnoc`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `.emotion-1mqhnoc`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:8801/browse/models
  - `h3`
- http://localhost:8801/browse/metrics
  - `#metric-19-heading`

## [MODERATE] landmark-no-duplicate-banner — Document should not have more than one banner landmark

Ensure the document has at most one banner landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-banner?application=axeAPI

- http://localhost:8801/question/40-b46-products-par-categorie
  - `.MdZZp`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `.MdZZp`

## [MINOR] empty-table-header — Table header text should not be empty

Ensure table headers have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/empty-table-header?application=axeAPI

- http://localhost:8801/browse/models
  - `th:nth-child(4)`
- http://localhost:8801/admin/people
  - `th:nth-child(2)`
  - `th:nth-child(6)`
- http://localhost:8801/browse/metrics
  - `.emotion-6zkibm.ek857zj1:nth-child(4)`
  - `th:nth-child(5)`

## [MINOR] aria-allowed-role — ARIA role should be appropriate for the element

Ensure role attribute has an appropriate value for the element
Référence : https://dequeuniversity.com/rules/axe/4.14/aria-allowed-role?application=axeAPI

- http://localhost:8801/collection/root/our-analytics
  - `h2`
- http://localhost:8801/search?q=orders
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
- http://localhost:8801/nosuchpage-46
  - `h2`

## Résultats incomplets à revoir (139)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:8801/
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/browse/models
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
  - `.warDK`
- http://localhost:8801/browse/databases
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/collection/root/our-analytics
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
  - `.AXVjz`
- http://localhost:8801/collection/6-boucle-46-audit
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/dashboard/2
  - `div[aria-label="Settings menu"]`
- http://localhost:8801/question/40-b46-products-par-categorie
  - `div[aria-label="Settings menu"]`
  - `.__m__-rak`
- http://localhost:8801/question
  - `div[aria-label="Settings menu"]`
- http://localhost:8801/search?q=orders
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
- http://localhost:8801/trash
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/admin/settings/general
  - `.mb-mantine-RadioGroup-root`
- http://localhost:8801/admin/people
  - `#mantine-151ih42ah-target`
  - `#mantine-dhk332ngk-target`
- http://localhost:8801/account/profile
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
- http://localhost:8801/nosuchpage-46
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
  - `.AXVjz`
- http://localhost:8801/browse/metrics
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Collections"]`
  - `div[aria-label="Data"]`
  - `.warDK`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `div[aria-label="Settings menu"]`
  - `.QCe4J`
  - `.__m__-rak`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8801/
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-r33`
- http://localhost:8801/browse/models
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8801/browse/databases
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8801/collection/root/our-analytics
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8801/collection/6-boucle-46-audit
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8801/dashboard/2
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `div[_echarts_instance_="ec_1791448208290"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[y="-3.5"][transform="matrix(0,-1,1,0,21,139.1563)"][text-anchor="middle"]`
  - `div[_echarts_instance_="ec_1791448208290"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(203 296.3125)"][y="3.5"][text-anchor="middle"]`
  - `div[_echarts_instance_="ec_1791448208290"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 266.3125)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448208290"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 223.9271)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448208290"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 181.5417)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448208290"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 139.1563)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448208290"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 96.7708)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448208290"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 54.3854)"][text-anchor="end"]`
  - … +18 autres
- http://localhost:8801/question/40-b46-products-par-categorie
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
- http://localhost:8801/question
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.C3IpM.m_b6d8b162.mb-mantine-Text-root:nth-child(2)`
  - `b`
  - `.C3IpM.m_b6d8b162.mb-mantine-Text-root:nth-child(3)`
- http://localhost:8801/search?q=orders
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8801/trash
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8801/account/profile
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8801/nosuchpage-46
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8801/browse/metrics
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8801/question/42-b46-commandes-par-mois-sql
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.xJ6ff`
  - `.xd8iK`
  - `.dXTXK > .m_80f1301b.mb-mantine-Button-inner > .WzMo8.m_811560b9.mb-mantine-Button-label`
  - `.__m__-r9n > .QB3Fo.m_77c9d27d[data-variant="default"] > .m_80f1301b.mb-mantine-Button-inner > .WzMo8.m_811560b9.mb-mantine-Button-label`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:8801/question
  - `#mantine-g63rhl42v-target`
- http://localhost:8801/admin/settings/general
  - `div[role="radiogroup"]`

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:8801/admin/settings/general
  - `#enable-xrays`
  - `#anon-tracking-enabled`

