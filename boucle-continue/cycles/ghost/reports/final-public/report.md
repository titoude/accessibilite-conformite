# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 11/11 scénario(s) audité(s), 0 erreur(s), 68 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `539a824c6fc8`

## Résultats incomplets à revoir (68)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:6430/
  - `h1`
  - `#header-email`
  - `.gh-header-inner > form > .gh-button[type="submit"][aria-label="Subscribe"] > span:nth-child(1) > span`
  - `.no-image:nth-child(2) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `.no-image:nth-child(2) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > time`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > time`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > time`
- http://localhost:6430/refonte-du-portail-membres/
  - `.gh-card.no-image:nth-child(1) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `.gh-card.no-image:nth-child(1) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-date`
  - `.gh-card.no-image:nth-child(2) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `.gh-card.no-image:nth-child(2) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-date`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-date`
- http://localhost:6430/accessibilite-trois-tests-rapides/
  - `.gh-card.no-image:nth-child(1) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `.gh-card.no-image:nth-child(1) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-date`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-date`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-date`
- http://localhost:6430/notes-de-lecture-designing-for-real-life/
  - `.gh-card.no-image:nth-child(1) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `.gh-card.no-image:nth-child(1) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-date`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-date`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-date`
- http://localhost:6430/tag/accessibilite/
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > time`
- http://localhost:6430/author/audit/
  - `.tag-culture-web > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `.tag-culture-web > .gh-card-link > .gh-card-wrapper > .gh-card-meta > time`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > time`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > time`
- http://localhost:6430/ [state:public-search-modal]
  - `h1`
  - `#header-email`
  - `.gh-header-inner > form > .gh-button[type="submit"][aria-label="Subscribe"] > span:nth-child(1) > span`
  - `.no-image:nth-child(2) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `.no-image:nth-child(2) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > time`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > time`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > time`
- http://localhost:6430/ [state:public-portal-signup]
  - `h1`
  - `#header-email`
  - `.gh-header-inner > form > .gh-button[type="submit"][aria-label="Subscribe"] > span:nth-child(1) > span`
  - `.no-image:nth-child(2) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `.no-image:nth-child(2) > .gh-card-link > .gh-card-wrapper > .gh-card-meta > time`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href="/refonte-du-portail-membres/"] > .gh-card-wrapper > .gh-card-meta > time`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > .gh-card-author`
  - `a[href$="coming-soon/"] > .gh-card-wrapper > .gh-card-meta > time`

### frame-tested — Frames should be tested with axe-core

- http://localhost:6430/
  - `iframe`
- http://localhost:6430/refonte-du-portail-membres/
  - `iframe[innerref="[object Object]"]`
  - `.gh-portal-triggerbtn-iframe`
- http://localhost:6430/accessibilite-trois-tests-rapides/
  - `iframe[innerref="[object Object]"]`
  - `.gh-portal-triggerbtn-iframe`
- http://localhost:6430/notes-de-lecture-designing-for-real-life/
  - `iframe[innerref="[object Object]"]`
  - `.gh-portal-triggerbtn-iframe`
- http://localhost:6430/manifeste/
  - `iframe`
- http://localhost:6430/about/
  - `iframe`
- http://localhost:6430/tag/accessibilite/
  - `iframe`
- http://localhost:6430/author/audit/
  - `iframe`
- http://localhost:6430/ [state:public-search-modal]
  - `.gh-portal-triggerbtn-iframe`
  - `iframe[searchdir="ltr"]`
- http://localhost:6430/ [state:public-portal-signup]
  - `iframe[data-testid="portal-popup-frame"]`
  - `.gh-portal-triggerbtn-iframe`

