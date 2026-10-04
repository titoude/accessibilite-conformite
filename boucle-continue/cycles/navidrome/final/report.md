# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 14/14 scénario(s) audité(s), 0 erreur(s), 299 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `830a37983f2e`

## Résultats incomplets à revoir (299)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-valid-attr-value — ARIA attributes must conform to valid values

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}
  - `button[aria-controls="long-menu"]`
  - `.jss225`
- http://127.0.0.1:8089/app/#/artist
  - `button[aria-controls="long-menu"]`
- http://127.0.0.1:8089/app/#/song
  - `button[aria-label="more"]`
  - `button[aria-label="Add to Playlist"]`
- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `button[aria-label="more"]`
  - `button[aria-controls="simple-menu"]`
- http://127.0.0.1:8089/app/#/artist/6QiT23Pg8GAJHZop58uMKH/show
  - `.jss641`
- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={} [state:playlists-submenu]
  - `button[aria-controls="long-menu"]`
  - `.jss225`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `.jss72`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +6 autres
- http://127.0.0.1:8089/app/#/artist
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `.jss72`
  - … +7 autres
- http://127.0.0.1:8089/app/#/song
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +17 autres
- http://127.0.0.1:8089/app/#/playlist
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +5 autres
- http://127.0.0.1:8089/app/#/album/69IwB2p7tQDejD3lowUIFo/show
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +20 autres
- http://127.0.0.1:8089/app/#/artist/6QiT23Pg8GAJHZop58uMKH/show
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `.jss72`
  - … +9 autres
- http://127.0.0.1:8089/app/#/personal
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +8 autres
- http://127.0.0.1:8089/app/#/user
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +6 autres
- http://127.0.0.1:8089/app/#/transcoding
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +4 autres
- http://127.0.0.1:8089/app/#/about
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +5 autres
- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={} [state:playlists-submenu]
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `.jss72`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +6 autres
- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={} [state:user-menu]
  - `.MuiBadge-badge`
  - `.jss249`
  - `a[href$="#/user"]`
  - `a[href$="#/player"]`
  - `a[href$="#/transcoding"]`
  - `a[href$="#/library"]`
  - `a[href$="#/missing"]`
  - `a[href$="#/plugin"]`
  - `.jss44:nth-child(12)`
  - `.logout`
  - … +15 autres
- http://127.0.0.1:8089/app/#/song [state:song-context-menu]
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `a[href$="#/album/recentlyAdded"]`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - `a[href$="#/artist"]`
  - … +25 autres
- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={} [state:album-context-menu]
  - `#react-admin-title > span`
  - `.MuiBadge-badge`
  - `.jss87:nth-child(1) > .jss84.MuiListItem-root.MuiListItem-gutters > .jss85 > .jss86.MuiTypography-colorTextSecondary.MuiTypography-root`
  - `a[href$="#/album/all"]`
  - `a[href$="#/album/random"]`
  - `a[href$="#/album/starred"]`
  - `a[href$="#/album/topRated"]`
  - `.jss72`
  - `a[href$="#/album/recentlyPlayed"]`
  - `a[href$="#/album/mostPlayed"]`
  - … +10 autres

### aria-hidden-focus — ARIA hidden element must not be focusable or contain focusable elements

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={} [state:user-menu]
  - `#root`
- http://127.0.0.1:8089/app/#/song [state:song-context-menu]
  - `#root`
- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={} [state:album-context-menu]
  - `#root`

### bypass — Page must have means to bypass repeated blocks

- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={} [state:user-menu]
  - `html`
- http://127.0.0.1:8089/app/#/song [state:song-context-menu]
  - `html`
- http://127.0.0.1:8089/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={} [state:album-context-menu]
  - `html`

