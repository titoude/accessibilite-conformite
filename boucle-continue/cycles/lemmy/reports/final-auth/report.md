# Audit accessibilité — 2026-10-08

**0 règle(s) violée(s), 0 occurrence(s), 22/22 scénario(s) audité(s), 0 erreur(s), 31 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `6083bcde6d33`

## Résultats incomplets à revoir (31)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9655/
  - `#sort-select-5JWYp0m4VkCaG2QYOTkC`
- http://localhost:9655/inbox
  - `#sort-select-gArxSAsG2yP8GpPiBnzW`
- http://localhost:9655/settings
  - `#user-language`
  - `#user-theme`
  - `#sort-select-qEBwu6Avn9DwgYOP6bR6`
- http://localhost:9655/create_post
  - `#language-select-8Pk0sFq2Kl8cxcxVJlQd`
  - `#post-community`
- http://localhost:9655/create_community
  - `#community-visibility`
- http://localhost:9655/admin
  - `#create-site-registration-mode`
  - `#create-site-default-theme`
- http://localhost:9655/post/1
  - `#language-select-QMo103a2IhvJXAtBMike`
- http://localhost:9655/modlog
  - `select`
  - `#filter-user`
  - `#filter-mod`
- http://localhost:9655/c/a11ybench
  - `#sort-select-mUcQnvhByUvvQcNEPQ9c`
- http://localhost:9655/ [state:nav-user-menu]
  - `#sort-select-SZrEmWT6ix9BZVhWmGb6`
- http://localhost:9655/post/1 [state:post-more-menu]
  - `#language-select-gJWmM8Jqkhev7tT9SRGE`
- http://localhost:9655/post/1 [state:comment-more-menu]
  - `#language-select-wbJrdchbduumZK5eygWw`
- http://localhost:9655/post/1 [state:comment-reply-editor]
  - `#language-select-Q8pykjbzQjf0YsdfFVjO`
  - `#language-select-dHa0orUunZL0XAHyoT1o`
- http://localhost:9655/create_post [state:community-combobox]
  - `#language-select-hR2H1u5HqNNnDaRHQlud`
  - `#post-community`
- http://localhost:9655/create_post [state:markdown-preview]
  - `#language-select-jHBn2vuXTKnQtbUVC2nt`
  - `#post-community`
- http://localhost:9655/inbox [state:inbox-all-filter]
  - `#sort-select-vu2e8G0lCfBnJ0l2Rdr8`
- http://localhost:9655/ [state:mobile-390]
  - `#sort-select-b3AqJ3v1g5l9wQ6biv66`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9655/create_post
  - `#post-community`
- http://localhost:9655/modlog
  - `#filter-user`
  - `#filter-mod`
- http://localhost:9655/create_post [state:community-combobox]
  - `#post-community`
- http://localhost:9655/create_post [state:markdown-preview]
  - `#post-community`

