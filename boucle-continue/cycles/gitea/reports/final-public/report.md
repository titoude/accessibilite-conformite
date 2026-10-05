# Audit accessibilité — 2026-10-05

**0 règle(s) violée(s), 0 occurrence(s), 23/23 scénario(s) audité(s), 0 erreur(s), 125 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `be33bb496a91`

## Résultats incomplets à revoir (125)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:3232/
  - `.flex-text-inline`
- http://localhost:3232/explore/repos
  - `span[aria-controls="_aria_auto_id_0"]`
  - `span[aria-controls="_aria_auto_id_12"]`
  - `span[aria-controls="_aria_auto_id_25"]`
- http://localhost:3232/explore/users
  - `span[aria-controls="_aria_auto_id_0"]`
  - `span[aria-controls="_aria_auto_id_5"]`
- http://localhost:3232/explore/organizations
  - `span[aria-controls="_aria_auto_id_0"]`
  - `span[aria-controls="_aria_auto_id_5"]`
- http://localhost:3232/user/login
  - `.flex-text-inline`
- http://localhost:3232/user/sign_up
  - `.flex-text-inline`
- http://localhost:3232/a11yorg
  - `span[aria-controls="_aria_auto_id_0"]`
  - `span[aria-controls="_aria_auto_id_12"]`
  - `span[aria-controls="_aria_auto_id_25"]`
- http://localhost:3232/alice
  - `span[aria-controls="_aria_auto_id_0"]`
  - `span[aria-controls="_aria_auto_id_12"]`
  - `.flex-text-inline`
- http://localhost:3232/a11yorg/demo-repo
  - `span[aria-haspopup="menu"]`
- http://localhost:3232/a11yorg/demo-repo/issues
  - `span[aria-controls="_aria_auto_id_3"]`
  - `span[aria-controls="_aria_auto_id_10"]`
  - `span[aria-controls="_aria_auto_id_13"]`
  - `svg[aria-controls="_aria_auto_id_0"]`
  - `svg[aria-controls="_aria_auto_id_16"]`
  - `span[aria-controls="_aria_auto_id_21"]`
  - `span[aria-controls="_aria_auto_id_45"]`
- http://localhost:3232/a11yorg/demo-repo/pulls
  - `span[aria-controls="_aria_auto_id_3"]`
  - `span[aria-controls="_aria_auto_id_10"]`
  - `span[aria-controls="_aria_auto_id_13"]`
  - `svg[aria-controls="_aria_auto_id_0"]`
  - `svg[aria-controls="_aria_auto_id_16"]`
  - `span[aria-controls="_aria_auto_id_21"]`
  - `span[aria-controls="_aria_auto_id_45"]`
- http://localhost:3232/a11yorg/demo-repo/releases
  - `span[role="button"]`
- http://localhost:3232/a11yorg/demo-repo/wiki/Home
  - `div[aria-haspopup="listbox"]`
  - `span[aria-haspopup="menu"]`
- http://localhost:3232/a11yorg/demo-repo/branches
  - `svg[aria-controls="_aria_auto_id_0"]`
  - `svg[aria-controls="_aria_auto_id_3"]`
  - `span[aria-controls="_aria_auto_id_6"]`
- http://localhost:3232/a11yorg/demo-repo/commits/branch/main
  - `svg[aria-controls="_aria_auto_id_0"]`
  - `span[aria-controls="_aria_auto_id_3"]`
- http://localhost:3232/a11yorg/demo-repo/milestones
  - `span[aria-controls="_aria_auto_id_0"]`
  - `span[aria-controls="_aria_auto_id_8"]`
- http://localhost:3232/a11yorg/demo-repo/labels
  - `span[aria-controls="_aria_auto_id_0"]`
  - `span[aria-controls="_aria_auto_id_5"]`
- http://localhost:3232/a11yorg/demo-repo/activity
  - `div[aria-controls="_aria_auto_id_0"]`
  - `span[aria-controls="_aria_auto_id_8"]`
- http://localhost:3232/a11yorg/demo-repo/graph
  - `input[autocomplete="off"]`
  - `span[role="button"]`
- http://localhost:3232/a11yorg/demo-repo/src/branch/main/main.go
  - `span[aria-haspopup="menu"]`
- http://localhost:3232/nonexistent-org/repo [state:not-found-404]
  - `.flex-text-inline`
- http://localhost:3232/user/login [state:login-failed]
  - `.flex-text-inline`

### aria-allowed-role — ARIA role should be appropriate for the element

- http://localhost:3232/explore/repos
  - `#_aria_auto_id_1`
  - `#_aria_auto_id_2`
  - `#_aria_auto_id_3`
  - `#_aria_auto_id_4`
  - `#_aria_auto_id_5`
  - `#_aria_auto_id_6`
  - `#_aria_auto_id_7`
  - `#_aria_auto_id_8`
  - `#_aria_auto_id_9`
  - `#_aria_auto_id_10`
  - … +13 autres
- http://localhost:3232/a11yorg
  - `#_aria_auto_id_1`
  - `#_aria_auto_id_2`
  - `#_aria_auto_id_3`
  - `#_aria_auto_id_4`
  - `#_aria_auto_id_5`
  - `#_aria_auto_id_6`
  - `#_aria_auto_id_7`
  - `#_aria_auto_id_8`
  - `#_aria_auto_id_9`
  - `#_aria_auto_id_10`
  - … +13 autres
- http://localhost:3232/alice
  - `#_aria_auto_id_1`
  - `#_aria_auto_id_2`
  - `#_aria_auto_id_3`
  - `#_aria_auto_id_4`
  - `#_aria_auto_id_5`
  - `#_aria_auto_id_6`
  - `#_aria_auto_id_7`
  - `#_aria_auto_id_8`
  - `#_aria_auto_id_9`
  - `#_aria_auto_id_10`
  - … +13 autres

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:3232/a11yorg/demo-repo
  - `.commit-id-short`
- http://localhost:3232/a11yorg/demo-repo/branches
  - `.count-behind`
  - `.count-ahead`
- http://localhost:3232/a11yorg/demo-repo/activity
  - `text`
  - `#new-issues`
- http://localhost:3232/api/swagger
  - `#schemes`

