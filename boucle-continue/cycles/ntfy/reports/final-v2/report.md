# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 8/8 scénario(s) audité(s), 0 erreur(s), 11 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `87a3c173343f`

## Résultats incomplets à revoir (11)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8090/
  - `h1`
- http://127.0.0.1:8090/testtopic
  - `h1`
  - `.css-mdxzat > ul > .css-hpkoxu.MuiListItem-root.MuiListItem-gutters > .Mui-selected[aria-label="testtopic"][aria-live="polite"] > .MuiListItemIcon-root.css-4wmnnb > .MuiBadge-root.css-chz7cr > .MuiBadge-badge.MuiBadge-standard.MuiBadge-invisible`
- http://127.0.0.1:8090/settings
  - `h1`
- http://127.0.0.1:8090/testtopic [state:subscription-popup]
  - `h1`
  - `.css-mdxzat > .css-13tkqlk > .css-hpkoxu.MuiListItem-root.MuiListItem-gutters > .Mui-selected[aria-label="testtopic"][aria-live="polite"] > .MuiListItemIcon-root.css-4wmnnb > .MuiBadge-root.css-chz7cr > .MuiBadge-badge.MuiBadge-standard.MuiBadge-invisible`
- http://127.0.0.1:8090/testtopic [state:publish-dialog]
  - `h1`
  - `.css-mdxzat > ul > .css-hpkoxu.MuiListItem-root.MuiListItem-gutters > .Mui-selected[aria-label="testtopic"][aria-live="polite"] > .MuiListItemIcon-root.css-4wmnnb > .MuiBadge-root.css-chz7cr > .MuiBadge-badge.MuiBadge-standard.MuiBadge-invisible`
- http://127.0.0.1:8090/ [state:subscribe-dialog]
  - `h1`
  - `.css-mdxzat > ul > .css-hpkoxu.MuiListItem-root.MuiListItem-gutters > .MuiListItemButton-root[aria-label="testtopic"][aria-live="polite"] > .MuiListItemIcon-root.css-4wmnnb > .MuiBadge-root.css-chz7cr > .MuiBadge-badge.MuiBadge-standard.MuiBadge-invisible`
  - `.css-mdxzat > ul > .css-1ohqk82.MuiListItem-root.MuiListItem-gutters:nth-child(10) > .MuiListItemButton-root.MuiListItemButton-gutters.css-14xmp1v > .MuiListItemText-root.css-14rdsw0 > .MuiListItemText-primary.css-fyswvn`

