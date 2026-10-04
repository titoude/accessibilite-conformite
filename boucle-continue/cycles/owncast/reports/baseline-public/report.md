# Audit accessibilité — 2026-10-04

**7 règle(s) violée(s), 18 occurrence(s), 4/4 scénario(s) audité(s), 0 erreur(s), 3 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `a160a7a7707b`

## [CRITICAL] image-alt — Images must have alternative text

Ensure <img> elements have alternative text or a role of none or presentation
Référence : https://dequeuniversity.com/rules/axe/4.13/image-alt?application=axeAPI

- http://localhost:8095/
  - `.ant-avatar > img[src$="logo"]`
- http://localhost:8095/embed/chat/readwrite/
  - `img`

## [SERIOUS] html-has-lang — <html> element must have a lang attribute

Ensure every HTML document has a lang attribute
Référence : https://dequeuniversity.com/rules/axe/4.13/html-has-lang?application=axeAPI

- http://localhost:8095/
  - `html`
- http://localhost:8095/embed/chat/readonly/
  - `html`
- http://localhost:8095/embed/chat/readwrite/
  - `html`
- http://localhost:8095/embed/video/
  - `html`

## [SERIOUS] target-size — All touch targets must be 24px large, or leave sufficient space

Ensure touch targets have sufficient size and space
Référence : https://dequeuniversity.com/rules/axe/4.13/target-size?application=axeAPI

- http://localhost:8095/
  - `#owncast-emoji-picker-button`
- http://localhost:8095/embed/chat/readwrite/
  - `#owncast-emoji-picker-button`

## [SERIOUS] document-title — Documents must have <title> element to aid in navigation

Ensure each HTML document contains a non-empty <title> element
Référence : https://dequeuniversity.com/rules/axe/4.13/document-title?application=axeAPI

- http://localhost:8095/embed/video/
  - `html`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8095/
  - `.ant-row.owncast:nth-child(2)`
  - `.ant-row.owncast:nth-child(4)`
  - `#virtuoso`
  - `#chat-input-content-editable`
- http://localhost:8095/embed/chat/readonly/
  - `#chat-container`
- http://localhost:8095/embed/chat/readwrite/
  - `#chat-input-content-editable`
- http://localhost:8095/embed/video/
  - `.Statusbar-module-scss-module__0sTbpG__statusbar`

## [MODERATE] landmark-one-main — Document should have one main landmark

Ensure the document has a main landmark
Référence : https://dequeuniversity.com/rules/axe/4.13/landmark-one-main?application=axeAPI

- http://localhost:8095/
  - `html`

## [MODERATE] meta-viewport — Zooming and scaling must not be disabled

Ensure <meta name="viewport"> does not disable text scaling and zooming
Référence : https://dequeuniversity.com/rules/axe/4.13/meta-viewport?application=axeAPI

- http://localhost:8095/
  - `meta[name="viewport"]`

## Résultats incomplets à revoir (3)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### video-caption — <video> elements must have captions

- http://localhost:8095/
  - `#vjs_video_3_html5_api`
  - `#video`
- http://localhost:8095/embed/video/
  - `#vjs_video_3_html5_api`

