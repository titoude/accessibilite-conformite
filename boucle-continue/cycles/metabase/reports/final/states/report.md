# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 9/9 scénario(s) audité(s), 0 erreur(s), 109 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `33c241641223`

## Résultats incomplets à revoir (109)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-prohibited-attr — Elements must only use permitted ARIA attributes

- http://localhost:7600/
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:7600/ [state:nav-new-menu]
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:7600/ [state:nav-search-palette]
  - `div[aria-label="Settings menu"]`
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `div[aria-label="Browse databases"]`
  - `div[aria-label="Browse models"]`
  - `div[aria-label="Browse metrics"]`
- http://localhost:7600/dashboard/2 [state:dashboard-info-sidebar]
  - `div[aria-labelledby="3"]`
- http://localhost:7600/admin/settings/general [state:admin-settings-nav]
  - `.mb-mantine-RadioGroup-root`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:7600/
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-r32`
- http://localhost:7600/ [state:nav-new-menu]
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `.__m__-rc`
- http://localhost:7600/ [state:nav-search-palette]
  - `.WzMo8.m_811560b9.mb-mantine-Button-label > span`
  - `.K0fzS:nth-child(1)`
  - `.K0fzS:nth-child(2)`
  - `#mantine-rhrfqv2ri-target > .m_80f1301b.mb-mantine-Button-inner > .WzMo8.m_811560b9.mb-mantine-Button-label`
  - `a[aria-current="page"] > .emotion-1ygoewh.ee6h7bx3`
  - `.CkxlV > h4`
  - `.emotion-gkwn7c > .emotion-1ygoewh.ee6h7bx3`
  - `a[href$="getting-started"] > .emotion-1ygoewh.ee6h7bx3`
  - `a[href$="2-examples"] > .emotion-1ygoewh.ee6h7bx3`
  - `.__m__-r47 > h4`
  - … +15 autres
- http://localhost:7600/ [state:nav-mobile-sidebar-390]
  - `.__m__-rc`
  - `.__m__-r4 > .QB3Fo.m_77c9d27d.mb-mantine-Button-root > .m_80f1301b.mb-mantine-Button-inner > .WzMo8.m_811560b9.mb-mantine-Button-label`
  - `.__m__-r3n > .C3IpM.m_b6d8b162.mb-mantine-Text-root`
  - `.__m__-r3r > .C3IpM.m_b6d8b162[data-truncate="end"]`
  - `.__m__-r44 > .C3IpM.m_b6d8b162[data-truncate="end"]`
  - `#\31 `
- http://localhost:7600/dashboard/2 [state:dashboard-actions-menu]
  - `textarea`
  - `.yTKVH`
  - `div[data-card-key="40"] > .CardVisualization.emotion-onvfvp.e160fyku0 > .emotion-3ye0ev.e1snajy20[data-testid="legend-caption"] > .IiwSx.WrVjG.gDtsD > .C3IpM.m_b6d8b162[data-testid="legend-caption-title"]`
  - `div[_echarts_instance_="ec_1791442613384"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(177 224.3125)"][text-anchor="middle"][y="3.5"]`
  - `div[_echarts_instance_="ec_1791442613384"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 194.3125)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442613384"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 163.9271)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442613384"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 133.5417)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442613384"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 103.1563)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442613384"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 72.7708)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442613384"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 42.3854)"][text-anchor="end"]`
  - … +18 autres
- http://localhost:7600/dashboard/2 [state:dashboard-info-sidebar]
  - `div[_echarts_instance_="ec_1791442615167"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(177 224.3125)"][text-anchor="middle"][y="3.5"]`
  - `div[_echarts_instance_="ec_1791442615167"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 194.3125)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442615167"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 163.9271)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442615167"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 133.5417)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442615167"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 103.1563)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442615167"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 72.7708)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442615167"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 42.3854)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442615167"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(24 12)"][text-anchor="end"]`
  - `div[_echarts_instance_="ec_1791442615167"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(69.75 199.3125)"][text-anchor="middle"][y="3.5"]`
  - `div[_echarts_instance_="ec_1791442615167"] > div > svg[version="1.1"][baseProfile="full"][width="328"] > g > text[transform="translate(141.25 199.3125)"][text-anchor="middle"][y="3.5"]`
  - … +14 autres
- http://localhost:7600/admin/settings/general [state:admin-settings-nav]
  - `strong`

### form-field-multiple-labels — Form field must not have multiple label elements

- http://localhost:7600/admin/settings/general [state:admin-settings-nav]
  - `#enable-xrays`
  - `#anon-tracking-enabled`

