# Audit accessibilité — 2026-10-04

**4 règle(s) violée(s), 5 occurrence(s), 3/5 scénario(s) audité(s), 2 erreur(s), 1 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `acfb384f99ed`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://127.0.0.1:5175/home [state:user-menu]
  - `#mantine-kqqb8ufcy-dropdown`

## [CRITICAL] aria-valid-attr-value — ARIA attributes must conform to valid values

Ensure all ARIA attributes have valid values
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-valid-attr-value?application=axeAPI

- http://127.0.0.1:5175/home [state:notifications]
  - `#mantine-i9chsy40r-tab-direct`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://127.0.0.1:5175/home
  - `html`
- http://127.0.0.1:5175/home [state:user-menu]
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://127.0.0.1:5175/home [state:user-menu]
  - `div[data-portal="true"]`

## Résultats incomplets à revoir (1)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://127.0.0.1:5175/home [state:user-menu]
  - `#mantine-kqqb8ufcy`

## Erreurs (2) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://127.0.0.1:5175/home [state:command-palette] — page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[role="dialog"], .mantine-Spotlight-root, [class*="spotlight" i]') to be visible
    - locator resolved to hidden <div data-size="xl" data-scrollable="true" id="mantine-061qwffms" class="m_9df02822 mantine-Spotlight-root"></div>
    23 × locator resolved to 9 elements. Proceeding with the first one: <div data-size="xl" data-scrollable="true" id="mantine-061qwffms" class="m_9df02822 mantine-Spotlight-root">…</div>

- http://127.0.0.1:5175/home [state:dark-mode] — locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button[title*="color scheme"], button[aria-label*="color scheme"]').first()


