# Audit accessibilité — 2026-10-04

**3 règle(s) violée(s), 45 occurrence(s), 7/8 scénario(s) audité(s), 1 erreur(s), 1 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `490baf0f2181`

## [CRITICAL] aria-required-children — Certain ARIA roles must contain particular children

Ensure elements with an ARIA role that require child roles contain them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-children?application=axeAPI

- http://localhost:1411/login/alternative
  - `.group\/item-group`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:1411/login
  - `html`
- http://localhost:1411/login/alternative
  - `html`
- http://localhost:1411/login/alternative/code
  - `html`
- http://localhost:1411/login/alternative/device
  - `html`
- http://localhost:1411/login/alternative/email
  - `html`
- http://localhost:1411/signup
  - `html`
- http://localhost:1411/device
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:1411/login
  - `h1`
  - `p`
  - `.mb-4`
  - `.right-0`
- http://localhost:1411/login/alternative
  - `h1`
  - `.h-full.justify-center.flex-col > .mt-3`
  - `a[href$="device"] > .flex-1.gap-1.group-data-\[size\=xs\]\/item\:gap-0\.5`
  - `a[href$="code"] > .flex-1.gap-1.group-data-\[size\=xs\]\/item\:gap-0\.5`
  - `.text-xs`
  - `.right-0`
- http://localhost:1411/login/alternative/code
  - `h1`
  - `p`
  - `.flex-col.justify-center.w-full`
  - `a`
  - `.right-0`
- http://localhost:1411/login/alternative/device
  - `h1`
  - `.mt-2`
  - `canvas`
  - `.gap-3.w-full.items-center`
  - `.mb-2`
  - `a`
  - `.right-0`
- http://localhost:1411/login/alternative/email
  - `h1`
  - `p`
  - `#Email`
  - `a`
  - `.right-0`
- http://localhost:1411/signup
  - `h1`
  - `p`
  - `a`
  - `.right-0`
- http://localhost:1411/device
  - `h1`
  - `p`
  - `#bits-c3 > div:nth-child(4)`
  - `.bg-secondary`
  - `.mb-4`
  - `.right-0`

## Résultats incomplets à revoir (1)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:1411/device
  - `#bits-c3-input`

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:1411/logout — redirection vers une page de connexion (http://localhost:1411/login?redirect=%2Flogout) — la page demandée n'a pas été auditée

