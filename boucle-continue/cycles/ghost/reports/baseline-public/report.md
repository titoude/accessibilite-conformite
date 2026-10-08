# Audit accessibilité — 2026-10-08

**7 règle(s) violée(s), 73 occurrence(s), 11/11 scénario(s) audité(s), 0 erreur(s), 68 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `539a824c6fc8`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=axeAPI

- http://localhost:6430/
  - `a[href$="#/portal/signup"]`
  - `.gh-footer-signup > form > .gh-button[type="submit"][aria-label="Subscribe"] > span:nth-child(1) > span`
- http://localhost:6430/refonte-du-portail-membres/
  - `a[href$="#/portal/signup"]`
  - `.gh-article-tag`
  - `p:nth-child(2) > a`
  - `span:nth-child(1) > span`
- http://localhost:6430/accessibilite-trois-tests-rapides/
  - `a[href$="#/portal/signup"]`
  - `.gh-article-tag`
  - `p:nth-child(3) > a`
  - `span:nth-child(1) > span`
- http://localhost:6430/notes-de-lecture-designing-for-real-life/
  - `a[href$="#/portal/signup"]`
  - `.gh-article-tag`
  - `p:nth-child(4) > a`
  - `span:nth-child(1) > span`
- http://localhost:6430/manifeste/
  - `a[href$="#/portal/signup"]`
  - `p > a`
  - `span:nth-child(1) > span`
- http://localhost:6430/about/
  - `a[href$="#/portal/signup"]`
  - `p:nth-child(10) > a`
  - `span:nth-child(1) > span`
- http://localhost:6430/tag/accessibilite/
  - `a[href$="#/portal/signup"]`
  - `span:nth-child(1) > span`
- http://localhost:6430/author/audit/
  - `a[href$="#/portal/signup"]`
  - `span:nth-child(1) > span`
- http://localhost:6430/ [state:public-search-modal]
  - `a[href$="#/portal/signup"]`
  - `.gh-footer-signup > form > .gh-button[type="submit"][aria-label="Subscribe"] > span:nth-child(1) > span`
- http://localhost:6430/ [state:public-portal-signup]
  - `a[href$="#/portal/signup"]`
  - `.gh-footer-signup > form > .gh-button[type="submit"][aria-label="Subscribe"] > span:nth-child(1) > span`

## [SERIOUS] link-name — Links must have discernible text

Ensure links have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.14/link-name?application=axeAPI

- http://localhost:6430/refonte-du-portail-membres/
  - `.gh-article-author-image > a[href$="audit/"]`
- http://localhost:6430/accessibilite-trois-tests-rapides/
  - `.gh-article-author-image > a[href$="audit/"]`
- http://localhost:6430/notes-de-lecture-designing-for-real-life/
  - `.gh-article-author-image > a[href$="audit/"]`

## [MODERATE] landmark-unique — Landmarks should have a unique role or role/label/title (i.e. accessible name) combination

Ensure landmarks are unique
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-unique?application=axeAPI

- http://localhost:6430/
  - `.gh-navigation-menu`
- http://localhost:6430/refonte-du-portail-membres/
  - `.gh-navigation-menu`
- http://localhost:6430/accessibilite-trois-tests-rapides/
  - `.gh-navigation-menu`
- http://localhost:6430/notes-de-lecture-designing-for-real-life/
  - `.gh-navigation-menu`
- http://localhost:6430/manifeste/
  - `.gh-navigation-menu`
- http://localhost:6430/about/
  - `.gh-navigation-menu`
- http://localhost:6430/tag/accessibilite/
  - `.gh-navigation-menu`
  - `.gh-viewport > main`
- http://localhost:6430/author/audit/
  - `.gh-navigation-menu`
  - `.gh-viewport > main`
- http://localhost:6430/ [state:public-search-modal]
  - `.gh-navigation-menu`
- http://localhost:6430/ [state:public-portal-signup]
  - `.gh-navigation-menu`
- http://localhost:6430/ [state:public-mobile-nav-390]
  - `.gh-navigation-menu`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.14/region?application=axeAPI

- http://localhost:6430/
  - `.gh-header-image`
  - `h1`
  - `#header-email`
  - `.gh-container-title`
- http://localhost:6430/refonte-du-portail-membres/
  - `.gh-container`
- http://localhost:6430/accessibilite-trois-tests-rapides/
  - `.gh-container`
- http://localhost:6430/notes-de-lecture-designing-for-real-life/
  - `.gh-container`
- http://localhost:6430/ [state:public-search-modal]
  - `.gh-header-image`
  - `h1`
  - `#header-email`
  - `.gh-container-title`
- http://localhost:6430/ [state:public-portal-signup]
  - `.gh-header-image`
  - `h1`
  - `#header-email`
  - `.gh-container-title`
- http://localhost:6430/ [state:public-mobile-nav-390]
  - `.gh-header-image`
  - `h1`
  - `#header-email`
  - `.gh-container-title`

## [MODERATE] heading-order — Heading levels should only increase by one

Ensure the order of headings is semantically correct
Référence : https://dequeuniversity.com/rules/axe/4.14/heading-order?application=axeAPI

- http://localhost:6430/refonte-du-portail-membres/
  - `h4`
- http://localhost:6430/accessibilite-trois-tests-rapides/
  - `h4`
- http://localhost:6430/notes-de-lecture-designing-for-real-life/
  - `h4`
- http://localhost:6430/about/
  - `#access-all-areas`
- http://localhost:6430/tag/accessibilite/
  - `.tag-culture-web > .gh-card-link > .gh-card-wrapper > h3`
- http://localhost:6430/author/audit/
  - `.tag-notes-de-lecture > .gh-card-link > .gh-card-wrapper > h3`

## [MODERATE] landmark-main-is-top-level — Main landmark should not be contained in another landmark

Ensure the main landmark is at top level
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-main-is-top-level?application=axeAPI

- http://localhost:6430/tag/accessibilite/
  - `.gh-container-inner > main`
- http://localhost:6430/author/audit/
  - `.gh-container-inner > main`

## [MODERATE] landmark-no-duplicate-main — Document should not have more than one main landmark

Ensure the document has at most one main landmark
Référence : https://dequeuniversity.com/rules/axe/4.14/landmark-no-duplicate-main?application=axeAPI

- http://localhost:6430/tag/accessibilite/
  - `.gh-viewport > main`
- http://localhost:6430/author/audit/
  - `.gh-viewport > main`

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

