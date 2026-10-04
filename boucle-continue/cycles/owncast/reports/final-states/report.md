# Audit accessibilité — 2026-10-04

**0 règle(s) violée(s), 0 occurrence(s), 7/7 scénario(s) audité(s), 0 erreur(s), 14 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `3b10b04a5493`

## Résultats incomplets à revoir (14)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### video-caption — <video> elements must have captions

- http://localhost:8095/
  - `#vjs_video_3_html5_api`
  - `#video`
- http://localhost:8095/ [state:public-follow-modal]
  - `#vjs_video_3_html5_api`
  - `#video`
- http://localhost:8095/ [state:public-notify-modal]
  - `#vjs_video_3_html5_api`
  - `#video`
- http://localhost:8095/ [state:public-user-dropdown]
  - `#vjs_video_3_html5_api`
  - `#video`
- http://localhost:8095/ [state:public-name-change-modal]
  - `#vjs_video_3_html5_api`
  - `#video`
- http://localhost:8095/embed/video/ [state:embed-video]
  - `#vjs_video_3_html5_api`

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8095/ [state:public-notify-modal]
  - `.NotifyReminderPopup-module-scss-module__NhtUPW__contentbutton`
- http://localhost:8095/ [state:public-user-dropdown]
  - `.NotifyReminderPopup-module-scss-module__NhtUPW__contentbutton`
- http://localhost:8095/ [state:public-name-change-modal]
  - `.NotifyReminderPopup-module-scss-module__NhtUPW__contentbutton`

