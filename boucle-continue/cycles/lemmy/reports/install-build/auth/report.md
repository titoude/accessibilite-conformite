# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 22/22 scénario(s) audité(s), 0 erreur(s), 31 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `f780f4f45728`

## Résultats incomplets à revoir (31)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9665/
  - `#sort-select-3nWC0BIssA8T79fRCZz6`
- http://localhost:9665/inbox
  - `#sort-select-rLfc7izfWxy5Xqqdn5oC`
- http://localhost:9665/settings
  - `#user-language`
  - `#user-theme`
  - `#sort-select-yhfJ3Y67Ny4okn4Crvrj`
- http://localhost:9665/create_post
  - `#language-select-j4avtYuEfXWxw6FBvfEd`
  - `#post-community`
- http://localhost:9665/create_community
  - `#community-visibility`
- http://localhost:9665/admin
  - `#create-site-registration-mode`
  - `#create-site-default-theme`
- http://localhost:9665/post/1
  - `#language-select-ipx4uYWwQebWdmcaNr3O`
- http://localhost:9665/modlog
  - `select`
  - `#filter-user`
  - `#filter-mod`
- http://localhost:9665/c/a11ybench
  - `#sort-select-PgjrMCTD6dQs7io40rAp`
- http://localhost:9665/ [state:nav-user-menu]
  - `#sort-select-7NvO7PMwiwTpQNvYQjDD`
- http://localhost:9665/post/1 [state:post-more-menu]
  - `#language-select-q3VfHac6XNU94UDJQ3iE`
- http://localhost:9665/post/1 [state:comment-more-menu]
  - `#language-select-NVhGdcBpmBUdkGknyEpE`
- http://localhost:9665/post/1 [state:comment-reply-editor]
  - `#language-select-IFLO6wXBKy6gPJoFmv7E`
  - `#language-select-wD3jnzB8Ixna8re2fyJm`
- http://localhost:9665/create_post [state:community-combobox]
  - `#language-select-FYOAx4x8xRHRymTHgyqx`
  - `#post-community`
- http://localhost:9665/create_post [state:markdown-preview]
  - `#language-select-JtjeoexOLTVlGN2gGaQw`
  - `#post-community`
- http://localhost:9665/inbox [state:inbox-all-filter]
  - `#sort-select-2SbksdNbIv3bdOhhyYcr`
- http://localhost:9665/ [state:mobile-390]
  - `#sort-select-iuMq2r3Y6Op5CmslpnB3`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9665/create_post
  - `#post-community`
- http://localhost:9665/modlog
  - `#filter-user`
  - `#filter-mod`
- http://localhost:9665/create_post [state:community-combobox]
  - `#post-community`
- http://localhost:9665/create_post [state:markdown-preview]
  - `#post-community`

