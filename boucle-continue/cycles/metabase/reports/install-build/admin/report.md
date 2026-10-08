# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 17/17 scénario(s) audité(s), 0 erreur(s), 146 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `78b0d0ca1796`

## Résultats incomplets à revoir (146)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:8802/
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:8802/browse/models
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `.emotion-6d8vmm`
  - `div[aria-label="Browse metrics"]`
  - `.warDK`
- http://localhost:8802/browse/databases
  - `div[aria-label="Settings menu"]`
  - `.emotion-6d8vmm`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:8802/collection/root/our-analytics
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
  - `.AXVjz`
- http://localhost:8802/collection/6-boucle-46-audit
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:8802/dashboard/2
  - `div[aria-label="Settings menu"]`
- http://localhost:8802/question/40-b46-products-par-categorie
  - `div[aria-label="Settings menu"]`
  - `.__m__-rag`
- http://localhost:8802/question
  - `div[aria-label="Settings menu"]`
- http://localhost:8802/search?q=orders
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
- http://localhost:8802/trash
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:8802/admin/settings/general
  - `.mb-mantine-RadioGroup-root`
- http://localhost:8802/account/profile
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:8802/nosuchpage-46
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
  - `.AXVjz`
- http://localhost:8802/browse/metrics
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `.emotion-6d8vmm`
  - `.warDK`
- http://localhost:8802/question/42-b46-commandes-par-mois-sql
  - `div[aria-label="Settings menu"]`
  - `.__m__-raf`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8802/
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-r32`
- http://localhost:8802/browse/models
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8802/browse/databases
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8802/collection/root/our-analytics
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8802/collection/6-boucle-46-audit
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8802/dashboard/2
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `div[_echarts_instance_="ec_1791448522075"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[y="-3.5"][transform="matrix(0,-1,1,0,21,139.1563)"][text-anchor="middle"]`
  - `div[_echarts_instance_="ec_1791448522075"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(203 296.3125)"][y="3.5"][text-anchor="middle"]`
  - `div[_echarts_instance_="ec_1791448522075"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 266.3125)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448522075"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 223.9271)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448522075"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 181.5417)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448522075"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 139.1563)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448522075"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 96.7708)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791448522075"] > div > svg[version="1.1"][baseProfile="full"][width="355"] > g > text[transform="translate(49 54.3854)"][text-anchor="end"]`
  - … +18 autres
- http://localhost:8802/question/40-b46-products-par-categorie
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
- http://localhost:8802/question
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-r5n > .C3IpM.m_b6d8b162.mb-mantine-Text-root`
  - `.__m__-r62`
  - `.C3IpM.m_b6d8b162.mb-mantine-Text-root:nth-child(2)`
  - `b`
  - `.C3IpM.m_b6d8b162.mb-mantine-Text-root:nth-child(3)`
- http://localhost:8802/search?q=orders
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8802/trash
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8802/account/profile
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8802/nosuchpage-46
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8802/browse/metrics
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
- http://localhost:8802/question/42-b46-commandes-par-mois-sql
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.xJ6ff`
  - `.xd8iK`
  - `.dXTXK > .m_80f1301b.mb-mantine-Button-inner > .WzMo8.m_811560b9.mb-mantine-Button-label`
  - `.__m__-r9i > .QB3Fo.m_77c9d27d[data-variant="default"] > .m_80f1301b.mb-mantine-Button-inner > .WzMo8.m_811560b9.mb-mantine-Button-label`

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:8802/admin/settings/general
  - `#enable-xrays`
  - `#anon-tracking-enabled`

