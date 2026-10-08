# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 6/6 scénario(s) audité(s), 0 erreur(s), 34 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `b5005400b153`

## Résultats incomplets à revoir (34)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### target-size — All touch targets must be 24px large, or leave sufficient space

- http://localhost:8950/login
  - `.inset-y-0`
- http://localhost:8950/register
  - `.absolute`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8950/share/dummy.site?auth=audit-c48-shared
  - `g[transform="translate(0,336.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,256.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,176.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,96.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(0,16.5)"] > text[x="-3"][dy="0.32em"]`
  - `g[transform="translate(24.5,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(215.6111111111111,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(406.7222222222222,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(597.8333333333334,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - `g[transform="translate(788.9444444444443,0)"] > .translate-y-2[y="7"][dy="0.71em"]`
  - … +22 autres

