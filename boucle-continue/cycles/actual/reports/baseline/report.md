# Audit accessibilité — 2026-10-04

**7 règle(s) violée(s), 123 occurrence(s), 5/5 scénario(s) audité(s), 0 erreur(s), 8 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `e77c109c04cc`

## [CRITICAL] button-name — Buttons must have discernible text

Ensure buttons have discernible text
Référence : https://dequeuniversity.com/rules/axe/4.13/button-name?application=axeAPI

- http://localhost:3001/budget [state:demo-budget]
  - `#react-aria3351072692-_r_32_`
  - `#react-aria3351072692-_r_3f_`
  - `#react-aria3351072692-_r_3s_`
  - `#react-aria3351072692-_r_49_`
  - `#react-aria3351072692-_r_4m_`
  - `#react-aria3351072692-_r_53_`
  - `#react-aria3351072692-_r_5g_`
  - `#react-aria3351072692-_r_5t_`
  - `#react-aria3351072692-_r_6i_`
  - `#react-aria3351072692-_r_6v_`
  - … +3 autres

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:3001/budget [state:demo-budget]
  - `.css-ot5d15:nth-child(7) > .css-fe8g2s[data-testid="row"] > .css-1xhxzkv > .css-1ngpcch > .css-ekyi6n > .css-xl7k6f[data-testid="spent"] > .css-19z9g5p > .css-1h2ruwl > .css-10tkb51[data-testid="category-month-spent"] > .css-19jk61o`
  - `.css-aycd7n > .css-6epun5`
  - `.css-ot5d15:nth-child(9) > .css-fe8g2s[data-testid="row"] > .css-1xhxzkv > .css-1ngpcch > .css-ekyi6n > .css-xl7k6f[data-testid="spent"] > .css-19z9g5p > .css-1h2ruwl > .css-10tkb51[data-testid="category-month-spent"] > .css-19jk61o`
  - `.css-ot5d15:nth-child(11) > .css-fe8g2s[data-testid="row"] > .css-1xhxzkv > .css-1ngpcch > .css-ekyi6n > .css-xl7k6f[data-testid="spent"] > .css-19z9g5p > .css-1h2ruwl > .css-10tkb51[data-testid="category-month-spent"] > .css-19jk61o`
  - `.css-ot5d15:nth-child(12) > .css-fe8g2s[data-testid="row"] > .css-1xhxzkv > .css-1ngpcch > .css-ekyi6n > .css-xl7k6f[data-testid="spent"] > .css-19z9g5p > .css-1h2ruwl > .css-10tkb51[data-testid="category-month-spent"] > .css-19jk61o`
- http://localhost:3001/accounts [state:demo-modal]
  - `.css-vd5l0c`
  - `.css-vd5l0c > a[target="_blank"][rel="noopener noreferrer"]`
  - `.css-13o7eu2:nth-child(1)`
  - `.css-13o7eu2:nth-child(2)`
  - `.css-13o7eu2:nth-child(2) > a[target="_blank"][rel="noopener noreferrer"]`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://localhost:3001/budget [state:demo-budget]
  - `#react-aria3351072692-_r_30_`
  - `#react-aria3351072692-_r_32_`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.13/meta-viewport?application=axeAPI

- http://localhost:3001/
  - `meta[name="viewport"]`
- http://localhost:3001/budget [state:demo-budget]
  - `meta[name="viewport"]`
- http://localhost:3001/accounts [state:demo-accounts]
  - `meta[name="viewport"]`
- http://localhost:3001/reports [state:demo-reports]
  - `meta[name="viewport"]`
- http://localhost:3001/accounts [state:demo-modal]
  - `meta[name="viewport"]`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:3001/
  - `div:nth-child(2) > .css-2ngksg > .css-szw3gd`
  - `div:nth-child(3) > .css-2ngksg > .css-szw3gd`
  - `.css-3w04fw`
- http://localhost:3001/budget [state:demo-budget]
  - `.css-7iovzr > .css-1myt2vd > .css-1isemmb`
  - `.css-1trtw0g[href$="reports"] > .css-1myt2vd > .css-1isemmb`
  - `.css-1trtw0g[href$="schedules"] > .css-1myt2vd > .css-1isemmb`
  - `.css-panji1`
  - `.css-z3zvyk`
  - `.css-lpmcmv:nth-child(4)`
  - `.css-lpmcmv:nth-child(5)`
  - `.css-lpmcmv:nth-child(6)`
  - `.css-lpmcmv:nth-child(7)`
  - `.css-vul4kr`
  - … +65 autres
- http://localhost:3001/accounts [state:demo-accounts]
  - `.css-1trtw0g[href$="budget"] > .css-1myt2vd > .css-1isemmb`
  - `.css-1trtw0g[href$="reports"] > .css-1myt2vd > .css-1isemmb`
  - `.css-1trtw0g[href$="schedules"] > .css-1myt2vd > .css-1isemmb`
  - `.css-panji1`
- http://localhost:3001/reports [state:demo-reports]
  - `.css-1trtw0g[href$="budget"] > .css-1myt2vd > .css-1isemmb`
  - `.css-7iovzr > .css-1myt2vd > .css-1isemmb`
  - `.css-1trtw0g[href$="schedules"] > .css-1myt2vd > .css-1isemmb`
  - `.css-panji1`
  - `.css-szw3gd`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:3001/budget [state:demo-budget]
  - `html`
- http://localhost:3001/accounts [state:demo-accounts]
  - `html`
- http://localhost:3001/reports [state:demo-reports]
  - `html`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:3001/budget [state:demo-budget]
  - `html`
- http://localhost:3001/accounts [state:demo-accounts]
  - `html`
- http://localhost:3001/reports [state:demo-reports]
  - `html`

## Résultats incomplets à revoir (8)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3001/
  - `div:nth-child(2) > .css-2ngksg > .css-szw3gd`
  - `div:nth-child(3) > .css-2ngksg > .css-szw3gd`
  - `.css-3w04fw`
- http://localhost:3001/budget [state:demo-budget]
  - `.css-z3zvyk > .css-4128zz > .css-1w5ospb`
  - `.css-lpmcmv:nth-child(11) > .css-4128zz > .css-1w5ospb`

### bypass — Page must have means to bypass repeated blocks

- http://localhost:3001/budget [state:demo-budget]
  - `html`
- http://localhost:3001/accounts [state:demo-accounts]
  - `html`
- http://localhost:3001/reports [state:demo-reports]
  - `html`

