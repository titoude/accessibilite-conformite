# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 15/15 scénario(s) audité(s), 0 erreur(s), 105 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `db1be0c05c9a`

## Résultats incomplets à revoir (105)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:7600/
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:7600/browse/models
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `.emotion-6d8vmm`
  - `div[aria-label="Browse metrics"]`
  - `.warDK`
- http://localhost:7600/browse/databases
  - `div[aria-label="Settings menu"]`
  - `.emotion-6d8vmm`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:7600/collection/root/our-analytics
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
  - `.AXVjz`
- http://localhost:7600/collection/6-boucle-46-audit
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:7600/dashboard/2
  - `div[aria-label="Settings menu"]`
- http://localhost:7600/question/40-b46-products-par-categorie
  - `div[aria-label="Settings menu"]`
  - `.__m__-ra3`
- http://localhost:7600/question
  - `div[aria-label="Settings menu"]`
- http://localhost:7600/search?q=orders
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
  - `div[data-model-type="table"]`
  - `div[data-model-type="dataset"]`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(4)`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(5)`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(6)`
  - `.SlTjA.TVYS4[data-model-type="card"]:nth-child(7)`
  - … +10 autres
- http://localhost:7600/trash
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:7600/admin/settings/general
  - `.mb-mantine-RadioGroup-root`
- http://localhost:7600/account/profile
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:7600/nosuchpage-46
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
  - `.AXVjz`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7600/
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-r32`
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
- http://localhost:7600/question/40-b46-products-par-categorie
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `text[y="-3.5"]`
  - `text[transform="translate(641.5 493.5)"]`
  - `text[transform="translate(49 463.5)"]`
  - `text[transform="translate(49 388.25)"]`
  - `text[transform="translate(49 313)"]`
  - `text[transform="translate(49 237.75)"]`
  - `text[transform="translate(49 162.5)"]`
  - `text[transform="translate(49 87.25)"]`
  - … +5 autres
- http://localhost:7600/question
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-r5u > .C3IpM.m_b6d8b162.mb-mantine-Text-root`
  - `.__m__-r69`
  - `.C3IpM.m_b6d8b162.mb-mantine-Text-root:nth-child(2)`
  - `b`
  - `.C3IpM.m_b6d8b162.mb-mantine-Text-root:nth-child(3)`
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

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:7600/admin/settings/general
  - `#enable-xrays`
  - `#anon-tracking-enabled`

