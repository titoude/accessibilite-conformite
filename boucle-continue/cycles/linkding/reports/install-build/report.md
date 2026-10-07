# Audit accessibilité — 2026-10-07

**0 règle(s) violée(s), 0 occurrence(s), 30/30 scénario(s) audité(s), 0 erreur(s), 68 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `24b9def30235`

## Résultats incomplets à revoir (68)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:9091/bookmarks/shared
  - `#id_user`
- http://localhost:9091/tags
  - `#sort`
- http://localhost:9091/bundles/new
  - `#id_filter_unread`
  - `#id_filter_shared`
- http://localhost:9091/bundles/1/edit
  - `#id_filter_unread`
  - `#id_filter_shared`
- http://localhost:9091/settings/general
  - `#id_theme`
  - `#id_bookmark_date_display`
  - `#id_bookmark_description_display`
  - `#id_bookmark_link_target`
  - `#id_tag_search`
  - `#id_tag_grouping`
  - `#id_web_archive_integration`
  - `#id_landing_page`
  - `#id_guest_profile_user`
- http://localhost:9091/admin/
  - `.addlink[aria-describedby="auth-user"][href$="add/"]`
  - `.changelink[href$="user/"][aria-describedby="auth-user"]`
  - `.addlink[aria-describedby="bookmarks-apitoken"][href$="add/"]`
  - `.changelink[href$="apitoken/"][aria-describedby="bookmarks-apitoken"]`
  - `.addlink[aria-describedby="bookmarks-bookmarkasset"]`
  - `.changelink[aria-describedby="bookmarks-bookmarkasset"]`
  - `.addlink[aria-describedby="bookmarks-bookmarkbundle"]`
  - `.changelink[aria-describedby="bookmarks-bookmarkbundle"]`
  - `.addlink[aria-describedby="bookmarks-bookmark"][href$="add/"]`
  - `.changelink[href$="bookmark/"][aria-describedby="bookmarks-bookmark"]`
  - … +10 autres
- http://localhost:9091/api/
  - `.btn.btn-primary[href$="api/"]`
  - `h1`
  - `p`
- http://localhost:9091/api/bookmarks/
  - `.btn-primary.btn[href$="bookmarks/"]`
  - `#extra-actions-menu`
  - `h1`
  - `label[for="id_url"]`
  - `#id_url`
  - `label[for="id_title"]`
  - `#id_title`
  - `label[for="id_description"]`
  - `#id_description`
  - `label[for="id_notes"]`
  - … +10 autres
- http://localhost:9091/bookmarks [state:nav-bookmarks-menu]
  - `a[href="?bundle=1"]`
  - `a[href="?bundle=2"]`
- http://localhost:9091/bookmarks [state:details-modal]
  - `.col-2:nth-child(6) > .markdown > p`
- http://localhost:9091/bookmarks [state:bulk-edit]
  - `select[name="bulk_action"]`
- http://localhost:9091/bookmarks [state:theme-dark-dialog]
  - `.col-2:nth-child(6) > .markdown > p`
- http://localhost:9091/tags [state:tag-modal-new]
  - `#sort`
- http://localhost:9091/tags [state:tag-modal-edit]
  - `#sort`
- http://localhost:9091/tags [state:tag-modal-merge]
  - `#sort`

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://localhost:9091/bookmarks [state:filter-drawer]
  - `section[aria-labelledby="bundles-heading"]`
  - `section[aria-labelledby="tags-heading"]`

