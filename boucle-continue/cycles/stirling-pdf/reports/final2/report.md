# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 2/18 scénario(s) audité(s), 16 erreur(s), 11 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `972e979beb17`

## Résultats incomplets à revoir (11)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8110/view-pdf
  - `#pageNumber`
  - `#numPages`
  - `#p1R_mc0 > span[dir="ltr"][role="presentation"]`
  - `#p1R_mc1 > span[dir="ltr"][role="presentation"]`
  - `#p1R_mc2 > span[dir="ltr"][role="presentation"]:nth-child(2)`
  - `#p1R_mc3 > span[dir="ltr"][role="presentation"]`
  - `#p1R_mc4 > span[dir="ltr"][role="presentation"]`
  - `#p1R_mc6 > span[dir="ltr"][role="presentation"]`
- http://localhost:8110/view-pdf [state:fichier-charge-viewer]
  - `#pageNumber`
  - `#numPages`
  - `div[aria-label="Page ⁨1⁩"] > .textLayer[data-main-rotation="0"] > span[role="presentation"][dir="ltr"]`

## Erreurs (16) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:8110/ — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/", waiting until "load"

- http://localhost:8110/merge-pdfs — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/merge-pdfs", waiting until "load"

- http://localhost:8110/multi-tool — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/multi-tool", waiting until "load"

- http://localhost:8110/pdf-organizer — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/pdf-organizer", waiting until "load"

- http://localhost:8110/crop — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/crop", waiting until "load"

- http://localhost:8110/rotate-pdf — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/rotate-pdf", waiting until "load"

- http://localhost:8110/pipeline — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/pipeline", waiting until "load"

- http://localhost:8110/sign — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/sign", waiting until "load"

- http://localhost:8110/login — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/login", waiting until "load"

- http://localhost:8110/about — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/about", waiting until "load"

- http://localhost:8110/licenses — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/licenses", waiting until "load"

- http://localhost:8110/merge-pdfs [state:navbar-tools-menu-ouvert] — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/merge-pdfs", waiting until "load"

- http://localhost:8110/ [state:navbar-langue-dropdown] — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/", waiting until "load"

- http://localhost:8110/ [state:navbar-favoris-dropdown] — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/", waiting until "load"

- http://localhost:8110/ [state:navbar-collapse-mobile] — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/", waiting until "load"

- http://localhost:8110/pdf-organizer [state:fichier-charge-organizer] — page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8110/pdf-organizer", waiting until "load"


