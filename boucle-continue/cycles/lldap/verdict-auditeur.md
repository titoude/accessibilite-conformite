# Verdict auditeur — cycle 26 nitnelave/lldap @99c510a7

**Verdict : CONFIRMED** — rejeu indépendant complet, sans confiance (auditeur : devin-1ce7e00f, 2026-10-05).

Rejeu effectué : clone propre `nitnelave/lldap` @ `99c510a7a603df1cdaca00a9ffff95ec73b296eb`,
`git apply patch.diff` (25 fichiers `app/src/**/*.rs`, 0 rejet), rebuild WASM réel
(rustup → toolchain 1.91.0 via `rust-toolchain.toml` + target wasm32-unknown-unknown +
wasm-pack 0.15.0 binaire ; `./app/build.sh` = `wasm-pack build --target web --release`
**rejoué en 43.87 s**), conteneur `lldap/lldap@sha256:bb6e509b…` sur :17170 (baseline vanilla)
puis `docker cp app/pkg/.` → /app/app/pkg/ (final), et **conteneur frais séparé sur :17171**
re-seedé + re-logué pour l'install-build. Commandes `manifest.auditCommands` verbatim.

## Rejeu point par point

| Claim | Rejeu auditeur |
|---|---|
| provenance.json | **27/27 sha256 OK** — recalculés depuis le disque, `patch.diff.sha256` cohérent |
| scopeHash | `c34253dd…` (auth) / `d7762114…` (public) **identiques baseline ↔ final** dans les 4 scope.json ; recomputés depuis les ids de scénarios triés = match ×4 |
| statesHash | `20e22ae8…` recomputé **depuis le source** `tools/audit.mjs` livré (url + `setup.toString()` des 4 états) = identique — le runner livré EST celui qui a produit les rapports |
| Baseline 139 occ / 16 scénarios | **rejouée bit-identique page par page** : conteneur vanilla → 132 occ/8 règles auth + 7 occ/3 règles login = 139, distribution page×règle IDENTIQUE aux report.json livrés sur les 16/16 (dont états : menu user 7, modales delete 4+4, dark-mode 7) — 0 erreur, 9 incomplets (6 duplicate-id-aria, 2 color-contrast, 1 aria-valid-attr-value) |
| Final 0 viol / 2 incomplets | **reproduit deux fois** : (a) même conteneur + docker cp pkg patché → 0 viol/2 inc ; (b) conteneur frais :17171 + seed + login → 0 viol/2 inc. Les 2 incomplets = mêmes `<select class=form-select>` (désormais aria-labellisés — preuve du patch servi) |
| install-build | **rejoué de bout en bout au-delà du claim** : clone @SHA + apply 0 rejet + build wasm réel + conteneur frais → rescan complet 0 viol (le livré ne documentait qu'un smoke Playwright, honnêtement déclaré « non rescanné » dans results.json) |
| Build wasm rejouable | **oui** : rustup installe 1.91.0 depuis rust-toolchain.toml, wasm-pack 0.15.0 binaire, build 43.87 s exit 0 ; pkg/ déployé = même canal que l'image (UI servie depuis disque) ; `md5(lldap_app.js)` servi = build local |
| verify.mjs 37/37 | **rejoué : 37/37 PASS** — assertions relues, non-vacuées : h1 compté ET texté (`jdoe`, `Test Users`), champs sans nom via label[for]/aria-label/labelledby/closest(label), checkbox `id + label[for]` exigeant `length>0`, tokens autocomplete validés, footer mesuré light+dark, modale role=dialog + label h2 + 0 id dupliqué |
| eval-final.mjs 34/34 | **rejoué : 34/34 PASS** — contrôles indépendants : ids dupliqués ×11 routes, sauts de titres ×11, focus dans modale + **Escape natif ferme** (le fix `el.focus()` prouvé), aria-expanded false→true, Tab clavier, reflow 320px, zoom 200%, th vides, sondes contrastes K/L |
| 2 incomplets select bgImage | **résolution confirmée, valeurs doc imprécises** : les `<select>` affichent texte sur `background-color` OPAQUE (chaîne d'ancêtres transparente jusqu'à BODY opaque, chevron SVG `no-repeat` en marge droite hors zone texte → mesure color/bg honnête). Couleurs documentées exactes ; ratios réels mesurés **15.43:1 light / 7.42:1 dark** (doc : 12.63/8.07 — voir W2) — les deux ≥4.5 dans les deux thèmes |
| —wait-for post-mount | **honnête** : `main table, main form, main h3|h1` n'existe qu'après mount wasm + fetch GraphQL (shell = noscript+scripts) ; baseline a trouvé 139 violations réelles avec nœuds ciblés (inputs `name=department`, lignes `jdoe`, footers) → DOM monté, pas de faux-0 ; chaque scénario `finalUrl == requested` (aucune auth-page n'a scanné une redirect /login, et verify a asserté du contenu authentifié sur les 11 routes) |
| Config axe | standard `runOnly` tags wcag2a/aa/21/22+best-practice, `resultTypes: violations+incomplete` — runner = audit.mjs v6 canonique + carte STATES du cycle seulement (diff limitée au bloc d'états) |

## Patch — chasse au masquage

Lu en entier (668 lignes, 25 fichiers `app/src`), appliqué sur clone propre. **Aucun masquage** :
zéro `display:none`, zéro `aria-hidden` ajouté, aucune suppression de DOM ni de fonctionnalité.
Corrections vérifiées produire le DOM décrit (code Yew relu, pas seulement le diff) :

- `yew_form::Field`/`Select` rendent `id={field_name}` nativement (source vendeur @4b9fabf relue) → les `<label for>` ajoutés/ existants se lient réellement ; `yew_form::CheckBox` ne rend AUCUN id → la réécriture en `<input type=checkbox id>` contrôlé (`form.set_field_value` sur clone Rc partagé) est justifiée et fonctionnelle
- `attribute_input` : `<input id={name}>` + `<label for={name}>` (AttributeLabel) ; `date_input`/`file_input` id hardcodé `avatarInput`→`id={name}` (était pendant ET dupliqué entre pages)
- Modales : ids `deleteXModalLabel` suffixés par clé entité (uniques), `role=dialog` + `role=document` restaurés, titre h5→h2 fs-5, `el.focus()` à l'ouverture → focus dans le dialog → Escape Bootstrap natif rejoué fonctionnel
- `<i aria-label>` → `aria-label` sur le `<button>` parent nommé par cible (`format!("Delete user {}", username)`)
- `banner.rs` : `<h2>LLDAP` → `<span class=fs-2>` (logo ≠ titre) + `aria-labelledby` corrigé `dropdownUser1`→`dropdownUser` (id existant)
- `select.rs` : prop `aria_label` propagée au `<select>` (2 appelants renseignés)
- `field.rs` : `autocomplete` défaut `field_name` (tokens invalides) → `"off"`
- h1 par page (12 surfaces) + hiérarchie h2 visible (`fs-5` conserve l'apparence) ; `<th></th>` → `"Remove"` ; login : h1 + `<label class=visually-hidden for>` liés aux vrais ids
- Footer : `text-muted` retiré + `link-secondary`→`text-reset` → adaptatif vérifié mesuré : **14.63:1 light / 8.57:1 dark** (span), liens icônes aria-labellisés

## Warts (n'altèrent pas le verdict)

- **W1 — « 9 règles » surcompté** : les violations livrées/rejouées couvrent **8 règles distinctes** (report.md lui-même : « 8 règle(s) ») ; la 9e famille corrigée est `duplicate-id-aria`, flaggée en *incomplete* ×6 (ids modales dupliqués) — famille réellement corrigée mais pas une règle violée. Écart doc propagé dans results.json/REGISTRE.
- **W2 — ratios de contraste documentés imprécis** : results.json trace 12.63:1/8.07:1 ; recomputés sur les mêmes paires documentées = **15.43:1 light / 7.42:1 dark** (formule WCAG identique à celle d'eval-final). Couleurs exactes, conclusion identique (≥4.5) — valeurs à corriger, pas de défaut produit.
- **W3 — nit `ListAttributeInput`** : le `<label for={name}>` reste pendant (les inputs sont `id={name}-{i}`) — bénin : chaque input porte `aria-label={name}`, axe ne flag pas ; le label visuel demeure sans cible.
- **W4 — nit `states.json`** : prose légère (noms + hash) — cohérente avec les setups relus de `audit.mjs` (attentes `main table` post-mount, `.modal.show`, `html.dark` + mutant localStorage déclaré en dernier).

## Détails de rejeu

- node v24.19.0, playwright 1.63.0, axe-core 4.13.0 — conformes `toolVersions` ; `npm install` tools OK
- seed rejoué : `seed.sh` idempotent, GID=4 sur DB vierge (attendu), login.mjs → 4 cookies `token`
- `urls-*.txt` contiennent des URLs absolues en `:17170` — pour le rejeu conteneur-frais sur :17171 j'ai resédé les URLs (documenté ici ; le `--urls` prime sur le base URL dans le runner)
- Le même scanner produisait 139 violations AVANT `docker cp` et 0 APRÈS sur le même DOM monté → le 0 est un vrai passage, pas un aveuglement du harnais
- `results.json` ne porte pas d'auto-verdict ; `final_clean_clone` déclare honnêtement « non rescanne » (j'ai poussé le rescan complet à 0 viol de mon côté)
