# Audit accessibilité — 2026-10-04

**6 règle(s) violée(s), 578 occurrence(s), 10/11 scénario(s) audité(s), 1 erreur(s), 5400 résultat(s) incomplet(s).**

Périmètre : scope.json — hash `ac2d19804642`

## [SERIOUS] aria-input-field-name — ARIA input fields must have an accessible name

Ensure every ARIA input field has an accessible name
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-input-field-name?application=axeAPI

- http://localhost:8080/
  - `.cm-focused > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"]`
  - `div[aria-readonly="true"]`
- http://localhost:8080/#
  - `.cm-focused > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"]`
  - `div[aria-readonly="true"]`
- http://localhost:8080/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)&input=VTI4Z2JHOXVaeUJoYm1RZ2RHaGhibXR6SUdadmNpQmhiR3dnZEdobElHWnBjMmd1
  - `.cm-focused > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"]`
  - `div[aria-readonly="true"]`
- http://localhost:8080/#recipe=Translate_DateTime_Format('Standard%20date%20and%20time','DD/MM/YYYY%20HH:mm:ss','UTC','dddd%20Do%20MMMM%20YYYY%20HH:mm:ss%20Z%20z','Australia/Queensland')&input=MTUvMDYvMjAxNSAyMDo0NTowMA
  - `.cm-focused > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"]`
  - `div[aria-readonly="true"]`
- http://localhost:8080/#recipe=From_Hexdump()Gunzip()&input=MDAwMDAwMDAgIDFmIDhiIDA4IDAwIDEyIGJjIGYzIDU3IDAwIGZmIDBkIGM3IGMxIDA5IDAwIDIwICB8Li4uLi6881cu/y7HwS4uIHwKMDAwMDAwMTAgIDA4IDA1IGQwIDU1IGZlIDA0IDJkIGQzIDA0IDFmIGNhIDhjIDQ0IDIxIDViIGZmICB8Li7QVf4uLdMuLsouRCFb/3wKMDAwMDAwMjAgIDYwIGM3IGQ3IDAzIDE2IGJlIDQwIDFmIDc4IDRhIDNmIDA5IDg5IDBiIDlhIDdkICB8YMfXLi6%2BQC54Sj8uLi4ufXwKMDAwMDAwMzAgIDRlIGM4IDRlIDZkIDA1IDFlIDAxIDhiIDRjIDI0IDAwIDAwIDAwICAgICAgICAgICB8TshObS4uLi5MJC4uLnw
  - `.cm-focused > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"]`
  - `div[aria-readonly="true"]`
- http://localhost:8080/#recipe=RC4(%7B'option':'UTF8','string':'secret'%7D,'Hex','Hex')Disassemble_x86('64','Full%20x86%20architecture',16,0,true,true)&input=MjFkZGQyNTQwMTYwZWU2NWZlMDc3NzEwM2YyYTM5ZmJlNWJjYjZhYTBhYWJkNDE0ZjkwYzZjYWY1MzEyNzU0YWY3NzRiNzZiM2JiY2QxOTNjYjNkZGZkYmM1YTI2NTMzYTY4NmI1OWI4ZmVkNGQzODBkNDc0NDIwMWFlYzIwNDA1MDcxMzhlMmZlMmIzOTUwNDQ2ZGIzMWQyYmM2MjliZTRkM2YyZWIwMDQzYzI5M2Q3YTVkMjk2MmMwMGZlNmRhMzAwNzJkOGM1YTZiNGZlN2Q4NTlhMDQwZWVhZjI5OTczMzYzMDJmNWEwZWMxOQ
  - `.cm-focused > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"]`
  - `div[aria-readonly="true"]`
- http://localhost:8080/#recipe=Fork('%5C%5Cn','%5C%5Cn',false)Conditional_Jump('1',false,'base64',10)To_Hex('Space')Return()Label('base64')To_Base64('A-Za-z0-9%2B/%3D')&input=U29tZSBkYXRhIHdpdGggYSAxIGluIGl0ClNvbWUgZGF0YSB3aXRoIGEgMiBpbiBpdA
  - `.cm-focused > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"]`
  - `div[aria-readonly="true"]`
- http://localhost:8080/#recipe=Register('key%3D(%5B%5C%5Cda-f%5D*)',true,false)Find_/_Replace(%7B'option':'Regex','string':'.*data%3D(.*)'%7D,'$1',true,false,true)RC4(%7B'option':'Hex','string':'$R0'%7D,'Hex','Latin1')&input=aHR0cDovL21hbHdhcmV6LmJpei9iZWFjb24ucGhwP2tleT0wZTkzMmE1YyZkYXRhPThkYjdkNWViZTM4NjYzYTU0ZWNiYjMzNGUzZGIxMQ
  - `.cm-focused > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"]`
  - `div[aria-readonly="true"]`
- http://localhost:8080/ [state:app]
  - `.cm-focused > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"]`
  - `div[aria-readonly="true"]`
- http://localhost:8080/ [state:recipe]
  - `#input-text > .cm-editor.ͼ1.ͼ2 > .cm-scroller > .cm-content.cm-lineWrapping[spellcheck="false"]`
  - `div[aria-readonly="true"]`

## [SERIOUS] list — <ul> and <ol> must only directly contain <li>, <script> or <template> elements

Ensure that lists are structured correctly
Référence : https://dequeuniversity.com/rules/axe/4.13/list?application=axeAPI

- http://localhost:8080/
  - `#catFavourites > .op-list`
- http://localhost:8080/#
  - `#catFavourites > .op-list`
- http://localhost:8080/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)&input=VTI4Z2JHOXVaeUJoYm1RZ2RHaGhibXR6SUdadmNpQmhiR3dnZEdobElHWnBjMmd1
  - `#catFavourites > .op-list`
- http://localhost:8080/#recipe=Translate_DateTime_Format('Standard%20date%20and%20time','DD/MM/YYYY%20HH:mm:ss','UTC','dddd%20Do%20MMMM%20YYYY%20HH:mm:ss%20Z%20z','Australia/Queensland')&input=MTUvMDYvMjAxNSAyMDo0NTowMA
  - `#catFavourites > .op-list`
- http://localhost:8080/#recipe=From_Hexdump()Gunzip()&input=MDAwMDAwMDAgIDFmIDhiIDA4IDAwIDEyIGJjIGYzIDU3IDAwIGZmIDBkIGM3IGMxIDA5IDAwIDIwICB8Li4uLi6881cu/y7HwS4uIHwKMDAwMDAwMTAgIDA4IDA1IGQwIDU1IGZlIDA0IDJkIGQzIDA0IDFmIGNhIDhjIDQ0IDIxIDViIGZmICB8Li7QVf4uLdMuLsouRCFb/3wKMDAwMDAwMjAgIDYwIGM3IGQ3IDAzIDE2IGJlIDQwIDFmIDc4IDRhIDNmIDA5IDg5IDBiIDlhIDdkICB8YMfXLi6%2BQC54Sj8uLi4ufXwKMDAwMDAwMzAgIDRlIGM4IDRlIDZkIDA1IDFlIDAxIDhiIDRjIDI0IDAwIDAwIDAwICAgICAgICAgICB8TshObS4uLi5MJC4uLnw
  - `#catFavourites > .op-list`
- http://localhost:8080/#recipe=RC4(%7B'option':'UTF8','string':'secret'%7D,'Hex','Hex')Disassemble_x86('64','Full%20x86%20architecture',16,0,true,true)&input=MjFkZGQyNTQwMTYwZWU2NWZlMDc3NzEwM2YyYTM5ZmJlNWJjYjZhYTBhYWJkNDE0ZjkwYzZjYWY1MzEyNzU0YWY3NzRiNzZiM2JiY2QxOTNjYjNkZGZkYmM1YTI2NTMzYTY4NmI1OWI4ZmVkNGQzODBkNDc0NDIwMWFlYzIwNDA1MDcxMzhlMmZlMmIzOTUwNDQ2ZGIzMWQyYmM2MjliZTRkM2YyZWIwMDQzYzI5M2Q3YTVkMjk2MmMwMGZlNmRhMzAwNzJkOGM1YTZiNGZlN2Q4NTlhMDQwZWVhZjI5OTczMzYzMDJmNWEwZWMxOQ
  - `#catFavourites > .op-list`
- http://localhost:8080/#recipe=Fork('%5C%5Cn','%5C%5Cn',false)Conditional_Jump('1',false,'base64',10)To_Hex('Space')Return()Label('base64')To_Base64('A-Za-z0-9%2B/%3D')&input=U29tZSBkYXRhIHdpdGggYSAxIGluIGl0ClNvbWUgZGF0YSB3aXRoIGEgMiBpbiBpdA
  - `#catFavourites > .op-list`
- http://localhost:8080/#recipe=Register('key%3D(%5B%5C%5Cda-f%5D*)',true,false)Find_/_Replace(%7B'option':'Regex','string':'.*data%3D(.*)'%7D,'$1',true,false,true)RC4(%7B'option':'Hex','string':'$R0'%7D,'Hex','Latin1')&input=aHR0cDovL21hbHdhcmV6LmJpei9iZWFjb24ucGhwP2tleT0wZTkzMmE1YyZkYXRhPThkYjdkNWViZTM4NjYzYTU0ZWNiYjMzNGUzZGIxMQ
  - `#catFavourites > .op-list`
- http://localhost:8080/ [state:app]
  - `#catFavourites > .op-list`
- http://localhost:8080/ [state:recipe]
  - `#catFavourites > .op-list`

## [SERIOUS] tabindex — Elements should not have tabindex greater than zero

Ensure tabindex attribute values are not greater than 0
Référence : https://dequeuniversity.com/rules/axe/4.13/tabindex?application=axeAPI

- http://localhost:8080/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)&input=VTI4Z2JHOXVaeUJoYm1RZ2RHaGhibXR6SUdadmNpQmhiR3dnZEdobElHWnBjMmd1
  - `#ing-1396`
  - `#ing-1397`
  - `#ing-1398`
- http://localhost:8080/#recipe=Translate_DateTime_Format('Standard%20date%20and%20time','DD/MM/YYYY%20HH:mm:ss','UTC','dddd%20Do%20MMMM%20YYYY%20HH:mm:ss%20Z%20z','Australia/Queensland')&input=MTUvMDYvMjAxNSAyMDo0NTowMA
  - `#ing-1399`
  - `#ing-1400`
  - `#ing-1401`
  - `#ing-1402`
  - `#ing-1403`
- http://localhost:8080/#recipe=RC4(%7B'option':'UTF8','string':'secret'%7D,'Hex','Hex')Disassemble_x86('64','Full%20x86%20architecture',16,0,true,true)&input=MjFkZGQyNTQwMTYwZWU2NWZlMDc3NzEwM2YyYTM5ZmJlNWJjYjZhYTBhYWJkNDE0ZjkwYzZjYWY1MzEyNzU0YWY3NzRiNzZiM2JiY2QxOTNjYjNkZGZkYmM1YTI2NTMzYTY4NmI1OWI4ZmVkNGQzODBkNDc0NDIwMWFlYzIwNDA1MDcxMzhlMmZlMmIzOTUwNDQ2ZGIzMWQyYmM2MjliZTRkM2YyZWIwMDQzYzI5M2Q3YTVkMjk2MmMwMGZlNmRhMzAwNzJkOGM1YTZiNGZlN2Q4NTlhMDQwZWVhZjI5OTczMzYzMDJmNWEwZWMxOQ
  - `#ing-1404`
  - `#ing-1405`
  - `#ing-1406`
  - `#ing-1407`
  - `#ing-1408`
  - `#ing-1409`
  - `#ing-1410`
  - `#ing-1411`
  - `#ing-1412`
- http://localhost:8080/#recipe=Fork('%5C%5Cn','%5C%5Cn',false)Conditional_Jump('1',false,'base64',10)To_Hex('Space')Return()Label('base64')To_Base64('A-Za-z0-9%2B/%3D')&input=U29tZSBkYXRhIHdpdGggYSAxIGluIGl0ClNvbWUgZGF0YSB3aXRoIGEgMiBpbiBpdA
  - `#ing-1413`
  - `#ing-1414`
  - `#ing-1415`
  - `#ing-1416`
  - `#ing-1417`
  - `#ing-1418`
  - `#ing-1419`
  - `#ing-1420`
  - `#ing-1421`
  - `#ing-1422`
  - … +1 autres
- http://localhost:8080/#recipe=Register('key%3D(%5B%5C%5Cda-f%5D*)',true,false)Find_/_Replace(%7B'option':'Regex','string':'.*data%3D(.*)'%7D,'$1',true,false,true)RC4(%7B'option':'Hex','string':'$R0'%7D,'Hex','Latin1')&input=aHR0cDovL21hbHdhcmV6LmJpei9iZWFjb24ucGhwP2tleT0wZTkzMmE1YyZkYXRhPThkYjdkNWViZTM4NjYzYTU0ZWNiYjMzNGUzZGIxMQ
  - `#ing-1424`
  - `#ing-1425`
  - `#ing-1426`
  - `#ing-1427`
  - `#ing-1428`
  - `#ing-1429`
  - `#ing-1430`
  - `#ing-1431`
  - `#ing-1432`
  - `#ing-1433`
  - … +3 autres
- http://localhost:8080/ [state:recipe]
  - `#ing-1396`

## [SERIOUS] scrollable-region-focusable — Scrollable region must have keyboard access

Ensure elements that have scrollable content are accessible by keyboard in Safari
Référence : https://dequeuniversity.com/rules/axe/4.13/scrollable-region-focusable?application=axeAPI

- http://localhost:8080/#recipe=RC4(%7B'option':'UTF8','string':'secret'%7D,'Hex','Hex')Disassemble_x86('64','Full%20x86%20architecture',16,0,true,true)&input=MjFkZGQyNTQwMTYwZWU2NWZlMDc3NzEwM2YyYTM5ZmJlNWJjYjZhYTBhYWJkNDE0ZjkwYzZjYWY1MzEyNzU0YWY3NzRiNzZiM2JiY2QxOTNjYjNkZGZkYmM1YTI2NTMzYTY4NmI1OWI4ZmVkNGQzODBkNDc0NDIwMWFlYzIwNDA1MDcxMzhlMmZlMmIzOTUwNDQ2ZGIzMWQyYmM2MjliZTRkM2YyZWIwMDQzYzI5M2Q3YTVkMjk2MmMwMGZlNmRhMzAwNzJkOGM1YTZiNGZlN2Q4NTlhMDQwZWVhZjI5OTczMzYzMDJmNWEwZWMxOQ
  - `#output-text > .cm-editor.ͼ1.ͼ2 > .cm-scroller`

## [MODERATE] region — All page content should be contained by landmarks

Ensure all page content is contained by landmarks
Référence : https://dequeuniversity.com/rules/axe/4.13/region?application=axeAPI

- http://localhost:8080/
  - `#banner`
  - `div[data-help-title="Operations list"]`
  - `#operations > .bmd-form-group`
  - `a[data-target="#catFavourites"]`
  - `a[data-target="#catDataformat"]`
  - `a[data-target="#catEncryptionEncoding"]`
  - `a[data-target="#catPublicKey"]`
  - `a[data-target="#catArithmeticLogic"]`
  - `a[data-target="#catNetworking"]`
  - `a[data-target="#catLanguage"]`
  - … +25 autres
- http://localhost:8080/#
  - `#banner`
  - `div[data-help-title="Operations list"]`
  - `#operations > .bmd-form-group`
  - `a[data-target="#catFavourites"]`
  - `a[data-target="#catDataformat"]`
  - `a[data-target="#catEncryptionEncoding"]`
  - `a[data-target="#catPublicKey"]`
  - `a[data-target="#catArithmeticLogic"]`
  - `a[data-target="#catNetworking"]`
  - `a[data-target="#catLanguage"]`
  - … +25 autres
- http://localhost:8080/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)&input=VTI4Z2JHOXVaeUJoYm1RZ2RHaGhibXR6SUdadmNpQmhiR3dnZEdobElHWnBjMmd1
  - `#banner`
  - `div[data-help-title="Operations list"]`
  - `#operations > .bmd-form-group`
  - `a[data-target="#catFavourites"]`
  - `a[data-target="#catDataformat"]`
  - `a[data-target="#catEncryptionEncoding"]`
  - `a[data-target="#catPublicKey"]`
  - `a[data-target="#catArithmeticLogic"]`
  - `a[data-target="#catNetworking"]`
  - `a[data-target="#catLanguage"]`
  - … +31 autres
- http://localhost:8080/#recipe=Translate_DateTime_Format('Standard%20date%20and%20time','DD/MM/YYYY%20HH:mm:ss','UTC','dddd%20Do%20MMMM%20YYYY%20HH:mm:ss%20Z%20z','Australia/Queensland')&input=MTUvMDYvMjAxNSAyMDo0NTowMA
  - `#banner`
  - `div[data-help-title="Operations list"]`
  - `#operations > .bmd-form-group`
  - `a[data-target="#catFavourites"]`
  - `a[data-target="#catDataformat"]`
  - `a[data-target="#catEncryptionEncoding"]`
  - `a[data-target="#catPublicKey"]`
  - `a[data-target="#catArithmeticLogic"]`
  - `a[data-target="#catNetworking"]`
  - `a[data-target="#catLanguage"]`
  - … +26 autres
- http://localhost:8080/#recipe=From_Hexdump()Gunzip()&input=MDAwMDAwMDAgIDFmIDhiIDA4IDAwIDEyIGJjIGYzIDU3IDAwIGZmIDBkIGM3IGMxIDA5IDAwIDIwICB8Li4uLi6881cu/y7HwS4uIHwKMDAwMDAwMTAgIDA4IDA1IGQwIDU1IGZlIDA0IDJkIGQzIDA0IDFmIGNhIDhjIDQ0IDIxIDViIGZmICB8Li7QVf4uLdMuLsouRCFb/3wKMDAwMDAwMjAgIDYwIGM3IGQ3IDAzIDE2IGJlIDQwIDFmIDc4IDRhIDNmIDA5IDg5IDBiIDlhIDdkICB8YMfXLi6%2BQC54Sj8uLi4ufXwKMDAwMDAwMzAgIDRlIGM4IDRlIDZkIDA1IDFlIDAxIDhiIDRjIDI0IDAwIDAwIDAwICAgICAgICAgICB8TshObS4uLi5MJC4uLnw
  - `#banner`
  - `div[data-help-title="Operations list"]`
  - `#operations > .bmd-form-group`
  - `a[data-target="#catFavourites"]`
  - `a[data-target="#catDataformat"]`
  - `a[data-target="#catEncryptionEncoding"]`
  - `a[data-target="#catPublicKey"]`
  - `a[data-target="#catArithmeticLogic"]`
  - `a[data-target="#catNetworking"]`
  - `a[data-target="#catLanguage"]`
  - … +26 autres
- http://localhost:8080/#recipe=RC4(%7B'option':'UTF8','string':'secret'%7D,'Hex','Hex')Disassemble_x86('64','Full%20x86%20architecture',16,0,true,true)&input=MjFkZGQyNTQwMTYwZWU2NWZlMDc3NzEwM2YyYTM5ZmJlNWJjYjZhYTBhYWJkNDE0ZjkwYzZjYWY1MzEyNzU0YWY3NzRiNzZiM2JiY2QxOTNjYjNkZGZkYmM1YTI2NTMzYTY4NmI1OWI4ZmVkNGQzODBkNDc0NDIwMWFlYzIwNDA1MDcxMzhlMmZlMmIzOTUwNDQ2ZGIzMWQyYmM2MjliZTRkM2YyZWIwMDQzYzI5M2Q3YTVkMjk2MmMwMGZlNmRhMzAwNzJkOGM1YTZiNGZlN2Q4NTlhMDQwZWVhZjI5OTczMzYzMDJmNWEwZWMxOQ
  - `#banner`
  - `div[data-help-title="Operations list"]`
  - `#operations > .bmd-form-group`
  - `a[data-target="#catFavourites"]`
  - `a[data-target="#catDataformat"]`
  - `a[data-target="#catEncryptionEncoding"]`
  - `a[data-target="#catPublicKey"]`
  - `a[data-target="#catArithmeticLogic"]`
  - `a[data-target="#catNetworking"]`
  - `a[data-target="#catLanguage"]`
  - … +32 autres
- http://localhost:8080/#recipe=Fork('%5C%5Cn','%5C%5Cn',false)Conditional_Jump('1',false,'base64',10)To_Hex('Space')Return()Label('base64')To_Base64('A-Za-z0-9%2B/%3D')&input=U29tZSBkYXRhIHdpdGggYSAxIGluIGl0ClNvbWUgZGF0YSB3aXRoIGEgMiBpbiBpdA
  - `#banner`
  - `div[data-help-title="Operations list"]`
  - `#operations > .bmd-form-group`
  - `a[data-target="#catFavourites"]`
  - `a[data-target="#catDataformat"]`
  - `a[data-target="#catEncryptionEncoding"]`
  - `a[data-target="#catPublicKey"]`
  - `a[data-target="#catArithmeticLogic"]`
  - `a[data-target="#catNetworking"]`
  - `a[data-target="#catLanguage"]`
  - … +35 autres
- http://localhost:8080/#recipe=Register('key%3D(%5B%5C%5Cda-f%5D*)',true,false)Find_/_Replace(%7B'option':'Regex','string':'.*data%3D(.*)'%7D,'$1',true,false,true)RC4(%7B'option':'Hex','string':'$R0'%7D,'Hex','Latin1')&input=aHR0cDovL21hbHdhcmV6LmJpei9iZWFjb24ucGhwP2tleT0wZTkzMmE1YyZkYXRhPThkYjdkNWViZTM4NjYzYTU0ZWNiYjMzNGUzZGIxMQ
  - `#banner`
  - `div[data-help-title="Operations list"]`
  - `#operations > .bmd-form-group`
  - `a[data-target="#catFavourites"]`
  - `a[data-target="#catDataformat"]`
  - `a[data-target="#catEncryptionEncoding"]`
  - `a[data-target="#catPublicKey"]`
  - `a[data-target="#catArithmeticLogic"]`
  - `a[data-target="#catNetworking"]`
  - `a[data-target="#catLanguage"]`
  - … +40 autres
- http://localhost:8080/ [state:app]
  - `#banner`
  - `div[data-help-title="Operations list"]`
  - `#operations > .bmd-form-group`
  - `a[data-target="#catFavourites"]`
  - `a[data-target="#catDataformat"]`
  - `a[data-target="#catEncryptionEncoding"]`
  - `a[data-target="#catPublicKey"]`
  - `a[data-target="#catArithmeticLogic"]`
  - `a[data-target="#catNetworking"]`
  - `a[data-target="#catLanguage"]`
  - … +25 autres
- http://localhost:8080/ [state:recipe]
  - `#banner`
  - `div[data-help-title="Operations list"]`
  - `#operations > .is-filled.bmd-form-group`
  - `a[data-target="#catFavourites"]`
  - `a[data-target="#catDataformat"]`
  - `a[data-target="#catEncryptionEncoding"]`
  - `a[data-target="#catPublicKey"]`
  - `a[data-target="#catArithmeticLogic"]`
  - `a[data-target="#catNetworking"]`
  - `a[data-target="#catLanguage"]`
  - … +30 autres

## [MINOR] aria-allowed-role — ARIA role should be appropriate for the element

Ensure role attribute has an appropriate value for the element
Référence : https://dequeuniversity.com/rules/axe/4.13/aria-allowed-role?application=axeAPI

- http://localhost:8080/
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(1)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(2)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(3)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(4)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(5)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(6)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(7)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(8)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(9)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(10)`
  - … +1 autres
- http://localhost:8080/#
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(1)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(2)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(3)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(4)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(5)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(6)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(7)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(8)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(9)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(10)`
  - … +1 autres
- http://localhost:8080/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)&input=VTI4Z2JHOXVaeUJoYm1RZ2RHaGhibXR6SUdadmNpQmhiR3dnZEdobElHWnBjMmd1
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +1 autres
- http://localhost:8080/#recipe=Translate_DateTime_Format('Standard%20date%20and%20time','DD/MM/YYYY%20HH:mm:ss','UTC','dddd%20Do%20MMMM%20YYYY%20HH:mm:ss%20Z%20z','Australia/Queensland')&input=MTUvMDYvMjAxNSAyMDo0NTowMA
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +1 autres
- http://localhost:8080/#recipe=From_Hexdump()Gunzip()&input=MDAwMDAwMDAgIDFmIDhiIDA4IDAwIDEyIGJjIGYzIDU3IDAwIGZmIDBkIGM3IGMxIDA5IDAwIDIwICB8Li4uLi6881cu/y7HwS4uIHwKMDAwMDAwMTAgIDA4IDA1IGQwIDU1IGZlIDA0IDJkIGQzIDA0IDFmIGNhIDhjIDQ0IDIxIDViIGZmICB8Li7QVf4uLdMuLsouRCFb/3wKMDAwMDAwMjAgIDYwIGM3IGQ3IDAzIDE2IGJlIDQwIDFmIDc4IDRhIDNmIDA5IDg5IDBiIDlhIDdkICB8YMfXLi6%2BQC54Sj8uLi4ufXwKMDAwMDAwMzAgIDRlIGM4IDRlIDZkIDA1IDFlIDAxIDhiIDRjIDI0IDAwIDAwIDAwICAgICAgICAgICB8TshObS4uLi5MJC4uLnw
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +1 autres
- http://localhost:8080/#recipe=RC4(%7B'option':'UTF8','string':'secret'%7D,'Hex','Hex')Disassemble_x86('64','Full%20x86%20architecture',16,0,true,true)&input=MjFkZGQyNTQwMTYwZWU2NWZlMDc3NzEwM2YyYTM5ZmJlNWJjYjZhYTBhYWJkNDE0ZjkwYzZjYWY1MzEyNzU0YWY3NzRiNzZiM2JiY2QxOTNjYjNkZGZkYmM1YTI2NTMzYTY4NmI1OWI4ZmVkNGQzODBkNDc0NDIwMWFlYzIwNDA1MDcxMzhlMmZlMmIzOTUwNDQ2ZGIzMWQyYmM2MjliZTRkM2YyZWIwMDQzYzI5M2Q3YTVkMjk2MmMwMGZlNmRhMzAwNzJkOGM1YTZiNGZlN2Q4NTlhMDQwZWVhZjI5OTczMzYzMDJmNWEwZWMxOQ
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +1 autres
- http://localhost:8080/#recipe=Fork('%5C%5Cn','%5C%5Cn',false)Conditional_Jump('1',false,'base64',10)To_Hex('Space')Return()Label('base64')To_Base64('A-Za-z0-9%2B/%3D')&input=U29tZSBkYXRhIHdpdGggYSAxIGluIGl0ClNvbWUgZGF0YSB3aXRoIGEgMiBpbiBpdA
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +1 autres
- http://localhost:8080/#recipe=Register('key%3D(%5B%5C%5Cda-f%5D*)',true,false)Find_/_Replace(%7B'option':'Regex','string':'.*data%3D(.*)'%7D,'$1',true,false,true)RC4(%7B'option':'Hex','string':'$R0'%7D,'Hex','Latin1')&input=aHR0cDovL21hbHdhcmV6LmJpei9iZWFjb24ucGhwP2tleT0wZTkzMmE1YyZkYXRhPThkYjdkNWViZTM4NjYzYTU0ZWNiYjMzNGUzZGIxMQ
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +1 autres
- http://localhost:8080/ [state:app]
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(1)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(2)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(3)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(4)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(5)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(6)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(7)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(8)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(9)`
  - `#catFavourites > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(10)`
  - … +1 autres
- http://localhost:8080/ [state:recipe]
  - `li[aria-describedby="popover453095"]`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catFavourites > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +1 autres

## Résultats incomplets à revoir (5400)

axe n'a pas pu conclure — ce ne sont ni des PASS ni des échecs automatiques :

### aria-allowed-role — ARIA role should be appropriate for the element

- http://localhost:8080/
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(1)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(2)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(3)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(4)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(5)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(6)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(7)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(8)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(9)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(10)`
  - … +530 autres
- http://localhost:8080/#
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(1)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(2)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(3)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(4)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(5)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(6)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(7)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(8)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(9)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(10)`
  - … +530 autres
- http://localhost:8080/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)&input=VTI4Z2JHOXVaeUJoYm1RZ2RHaGhibXR6SUdadmNpQmhiR3dnZEdobElHWnBjMmd1
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +530 autres
- http://localhost:8080/#recipe=Translate_DateTime_Format('Standard%20date%20and%20time','DD/MM/YYYY%20HH:mm:ss','UTC','dddd%20Do%20MMMM%20YYYY%20HH:mm:ss%20Z%20z','Australia/Queensland')&input=MTUvMDYvMjAxNSAyMDo0NTowMA
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +530 autres
- http://localhost:8080/#recipe=From_Hexdump()Gunzip()&input=MDAwMDAwMDAgIDFmIDhiIDA4IDAwIDEyIGJjIGYzIDU3IDAwIGZmIDBkIGM3IGMxIDA5IDAwIDIwICB8Li4uLi6881cu/y7HwS4uIHwKMDAwMDAwMTAgIDA4IDA1IGQwIDU1IGZlIDA0IDJkIGQzIDA0IDFmIGNhIDhjIDQ0IDIxIDViIGZmICB8Li7QVf4uLdMuLsouRCFb/3wKMDAwMDAwMjAgIDYwIGM3IGQ3IDAzIDE2IGJlIDQwIDFmIDc4IDRhIDNmIDA5IDg5IDBiIDlhIDdkICB8YMfXLi6%2BQC54Sj8uLi4ufXwKMDAwMDAwMzAgIDRlIGM4IDRlIDZkIDA1IDFlIDAxIDhiIDRjIDI0IDAwIDAwIDAwICAgICAgICAgICB8TshObS4uLi5MJC4uLnw
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +530 autres
- http://localhost:8080/#recipe=RC4(%7B'option':'UTF8','string':'secret'%7D,'Hex','Hex')Disassemble_x86('64','Full%20x86%20architecture',16,0,true,true)&input=MjFkZGQyNTQwMTYwZWU2NWZlMDc3NzEwM2YyYTM5ZmJlNWJjYjZhYTBhYWJkNDE0ZjkwYzZjYWY1MzEyNzU0YWY3NzRiNzZiM2JiY2QxOTNjYjNkZGZkYmM1YTI2NTMzYTY4NmI1OWI4ZmVkNGQzODBkNDc0NDIwMWFlYzIwNDA1MDcxMzhlMmZlMmIzOTUwNDQ2ZGIzMWQyYmM2MjliZTRkM2YyZWIwMDQzYzI5M2Q3YTVkMjk2MmMwMGZlNmRhMzAwNzJkOGM1YTZiNGZlN2Q4NTlhMDQwZWVhZjI5OTczMzYzMDJmNWEwZWMxOQ
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +530 autres
- http://localhost:8080/#recipe=Fork('%5C%5Cn','%5C%5Cn',false)Conditional_Jump('1',false,'base64',10)To_Hex('Space')Return()Label('base64')To_Base64('A-Za-z0-9%2B/%3D')&input=U29tZSBkYXRhIHdpdGggYSAxIGluIGl0ClNvbWUgZGF0YSB3aXRoIGEgMiBpbiBpdA
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +530 autres
- http://localhost:8080/#recipe=Register('key%3D(%5B%5C%5Cda-f%5D*)',true,false)Find_/_Replace(%7B'option':'Regex','string':'.*data%3D(.*)'%7D,'$1',true,false,true)RC4(%7B'option':'Hex','string':'$R0'%7D,'Hex','Latin1')&input=aHR0cDovL21hbHdhcmV6LmJpei9iZWFjb24ucGhwP2tleT0wZTkzMmE1YyZkYXRhPThkYjdkNWViZTM4NjYzYTU0ZWNiYjMzNGUzZGIxMQ
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +530 autres
- http://localhost:8080/ [state:app]
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(1)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(2)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(3)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(4)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(5)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(6)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(7)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(8)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(9)`
  - `#catDataformat > .op-list > .operation[data-container="body"][data-toggle="popover"]:nth-child(10)`
  - … +530 autres
- http://localhost:8080/ [state:recipe]
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(1)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(2)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(3)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(4)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(5)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(6)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(7)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(8)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(9)`
  - `#catDataformat > .op-list > li[data-container="body"][data-toggle="popover"][data-placement="right"]:nth-child(10)`
  - … +530 autres

## Erreurs (1) — exit code != 0

Ces scénarios n'ont pas été audités. Un audit partiel n'est pas un PASS : le gate CI échoue tant qu'un scénario demandé manque.

- http://localhost:8080/ [state:modal-save] — locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Save recipe")').first()


