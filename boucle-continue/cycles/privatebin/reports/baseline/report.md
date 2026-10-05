# Audit accessibilité — 2026-10-05

**8 règle(s) violée(s), 48 occurrence(s), 14/14 scénario(s) audité(s), 0 erreur(s), 16 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `79a62c3ec780`

## [CRITICAL] aria-required-parent — Certain ARIA roles must be contained by particular parents

Ensure elements with an ARIA role that require parent roles are contained by them
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-required-parent?application=axeAPI

- http://localhost:8080/
  - `#messageedit`
  - `#messagepreview`
- http://localhost:8080/ [state:preview-tab]
  - `#messageedit`
  - `#messagepreview`
- http://localhost:8080/ [state:navbar-mobile]
  - `#messageedit`
  - `#messagepreview`
- http://localhost:8080/ [state:dark-mode]
  - `#messageedit`
  - `#messagepreview`

## [CRITICAL] label — Form elements must have labels

Ensure every form element has a label
Référence : https://dequeuniversity.com/rules/axe/4.13/label?application=axeAPI

- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C [state:comment-reply]
  - `#reply > .replymessage[rows="7"]`

## [SERIOUS] tabindex — Elements should not have tabindex greater than zero

Ensure tabindex attribute values are not greater than 0
Référence : https://dequeuniversity.com/rules/axe/4.13/tabindex?application=axeAPI

- http://localhost:8080/
  - `#sendbutton`
  - `#message`
  - `#messagetab`
- http://localhost:8080/?14997909a623b3a1#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2E
  - `#messagetab`
- http://localhost:8080/?09d52e8dde9aaba1#-7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2F
  - `#messagetab`
- http://localhost:8080/?dddddddddddddddd
  - `#messagetab`
- http://localhost:8080/?34f395b60e6f7082
  - `#messagetab`
- http://localhost:8080/ [state:preview-tab]
  - `#sendbutton`
- http://localhost:8080/ [state:navbar-mobile]
  - `#sendbutton`
  - `#message`
  - `#messagetab`
- http://localhost:8080/ [state:dark-mode]
  - `#sendbutton`
  - `#message`
  - `#messagetab`

## [SERIOUS] color-contrast — Elements must meet minimum color contrast ratio thresholds

Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
Référence : https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=axeAPI

- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C
  - `#prettyprint > a[target="_blank"][rel="nofollow noopener noreferrer"]`
- http://localhost:8080/?14997909a623b3a1#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2E [state:password-unlock]
  - `a[target="_blank"]`
- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C [state:qr-modal]
  - `#prettyprint > a[target="_blank"][rel="nofollow noopener noreferrer"]`
- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C [state:email-modal]
  - `#prettyprint > a[target="_blank"][rel="nofollow noopener noreferrer"]`
- http://localhost:8080/ [state:preview-tab]
  - `a[href$="test"]`
- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C [state:comment-reply]
  - `#prettyprint > a[target="_blank"][rel="nofollow noopener noreferrer"]`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.13/list?application=axeAPI

- http://localhost:8080/
  - `#editorTabs`
- http://localhost:8080/ [state:preview-tab]
  - `#editorTabs`
- http://localhost:8080/ [state:navbar-mobile]
  - `#editorTabs`
- http://localhost:8080/ [state:dark-mode]
  - `#editorTabs`

## [SERIOUS] aria-dialog-name — ARIA dialog and alertdialog nodes should have an accessible name

Ensure every ARIA dialog and alertdialog node has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-dialog-name?application=axeAPI

- http://localhost:8080/?14997909a623b3a1#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2E
  - `#passwordmodal`
- http://localhost:8080/?09d52e8dde9aaba1#-7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2F
  - `#loadconfirmmodal`
- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C [state:qr-modal]
  - `#qrcodemodal`
- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C [state:email-modal]
  - `#emailconfirmmodal`

## [SERIOUS] label-title-only — Form elements should have a visible label

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes
Référence : https://dequeuniversity.com/rules/axe/4.13/label-title-only?application=axeAPI

- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C [state:comment-reply]
  - `#reply > .my-2[type="text"][title="Optional nickname…"]`

## [MODERATE] page-has-heading-one — Page should contain a level-one heading

Ensure that the page, or at least one of its frames contains a level-one heading
Référence : https://dequeuniversity.com/rules/axe/4.13/page-has-heading-one?application=axeAPI

- http://localhost:8080/
  - `html`
- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C
  - `html`
- http://localhost:8080/?872e378729d0e06d#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2D
  - `html`
- http://localhost:8080/?dddddddddddddddd
  - `html`
- http://localhost:8080/?34f395b60e6f7082
  - `html`
- http://localhost:8080/?14997909a623b3a1#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2E [state:password-unlock]
  - `html`
- http://localhost:8080/ [state:preview-tab]
  - `html`
- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C [state:comment-reply]
  - `html`
- http://localhost:8080/ [state:navbar-mobile]
  - `html`
- http://localhost:8080/ [state:dark-mode]
  - `html`

## Résultats incomplets à revoir (16)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### color-contrast — Elements must meet minimum color contrast ratio thresholds

- http://localhost:8080/
  - `#pasteExpiration`
  - `#pasteFormatter`
  - `#aboutbox`
  - `i`
- http://localhost:8080/?09d52e8dde9aaba1#-7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2F
  - `#loadconfirmmodal > .modal-dialog[role="document"] > .modal-content > .modal-header > .modal-title`
- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C [state:email-modal]
  - `#emailconfirmmodal > .modal-dialog[role="document"] > .modal-content > .modal-header > .modal-title`
  - `#emailconfirm-timezone-current`
- http://localhost:8080/ [state:preview-tab]
  - `#pasteExpiration`
  - `#pasteFormatter`
- http://localhost:8080/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C [state:comment-reply]
  - `#comment_a4cdc6286e2bfd5d > .commentdata`
- http://localhost:8080/ [state:navbar-mobile]
  - `#pasteExpiration`
  - `#pasteFormatter`
- http://localhost:8080/ [state:dark-mode]
  - `#pasteExpiration`
  - `#pasteFormatter`
  - `#aboutbox`
  - `a[href$="privatebin.info/"]`

