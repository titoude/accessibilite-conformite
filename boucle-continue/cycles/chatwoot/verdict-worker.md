# Cycle 56 — chatwoot/chatwoot — verdict WORKER

Livré, conforme protocole. Verdict final réservé à l'auditeur indépendant.

## Cible
chatwoot/chatwoot @ `f4bc89957b5e49dab3cd1d1c074248e60ac43d2e` (HEAD develop pinné) — Rails 7 + Vue 3.5 + Tailwind (tokens `n-*`) + vite/pnpm, inbox support-client. Surface : fils de conversation, inbox/filtres, contacts, labels, rapports, réglages (agents/inboxes/labels/teams/general/profile), menus agent, widget chat public, mobile 390, 404.

## Chiffres
- **Baseline vanilla** : 26 scénarios (4 publics + 15 auth + 7 états), **422 occ / 20 règles distinctes** (public 37 occ/7 règles ; auth 385 occ/19 règles ; union 20), 0 erreur, 0 skip silencieux. Pureté vanilla prouvée avant : image `cw56-app:f4bc89957b5e` buildée verbatim depuis `docker/Dockerfile` upstream sur checkout @SHA.
- **Final patché** : **0 violation / 0 erreur** sur les 26 scénarios (96 incomplets auth + 0 public — contrastes composites/aria-controls lazy non tranchables par axe).
- **verify.mjs** : 31/31 PASS (lang, viewport zoomable, main top-level unique, h1, boutons icône nommés, role=img nommés, ul>li, contrastes slate composites, ninja-keys ouverture/tabindex/style injecté, 404 landmarks/contrastes, selects settings labellisées, hiérarchie h2).
- **eval-final.mjs** : 16/16 PASS (viewports, langs, focus clavier ≥4 stops, Escape menu profil, mobile 390, régions live, h1s, for=undefined, titres).
- **vanilla → FAIL attendus** : 21 FAIL / 31 nommés (lang absent, user-scalable=0, h1 absents, button-name ×N, role=img sans nom, list ul>div, contrastes slate-9..11, boutons/listes conversation, ninja-keys tabindex/style, 404 landmarks, selects settings non labellisées, h4/h5/h6 orphelins).
- **sabotage → FAIL nommés** : `vueapp.html.erb` reverti (lang + `user-scalable=0` réintroduits) → 5 FAIL nommés (`login: html lang`, `login: viewport`, widget lang/main/h1 — ces derniers liés au token widget régénéré par instance, voir warts).
- **incomplete-probes** : 96 sondés → **78 OK / 0 NON-CONFORME / 18 N-A**. Deux vrais problèmes trouvés par les sondes et corrigés : `aria-controls="account-options"` pendant (switcher désactivé en mono-compte → attrs gatés sur `showAccountSwitcher`) et badge de tab actif `bg-n-blue-3 + text-n-blue-11` = 4.4:1 → `text-n-blue-12` = 11.5:1.
- **install-build verbatim** : clone vierge @SHA + `git apply --check` 0 rejet + build verbatim + db:prepare + seed rejoué :9760 → rescan **0 viol/0 err/75 inc — IDENTIQUES au final** (installbuild-public 4/4, installbuild-auth 22/22)

## Faits marquants pour l'auditeur
1. **`/profile` rendait un router-view vide** (pas de route enfant par défaut) → page sans contenu ni h1 ; redirect `profile_settings_root → profile_settings_index` ajouté et l'URL canonique `/profile/settings` déclarée dans gen-urls (audit.mjs FAIL bruyant si le document final diffère du demandé).
2. **vue-upload-component v3.1** : rend `createElementBlock("span")` en dur — pas de prop `tag` ; l'`input[type=file]` est réel mais visuellement caché → nom accessible donné par `<label for="conversationAttachment" class="sr-only">` explicite (ReplyBottomPanel), focus-visible via `:deep(.file-uploads):focus-within`, NextButton interne décoratif `aria-hidden`.
3. **Directive v-tooltip maison** (`cwTooltipA11y`, entrypoints/dashboard.js) : `role=img` + `aria-label` seulement sur éléments sans nom et sans texte visible (2.5.3) — et désormais **skippe les conteneurs qui enveloppent un contrôle natif** (`input/select/textarea/button/a`) — sinon le span FileUpload recevait un aria-label interdit (aria-prohibited-attr).
4. **landmark-unique** : deux `<nav>` "Pagination" sur reports/overview → `useId()` suffixe (`"Pagination v-0/v-1"`, Pagination.vue).
5. **DropdownContainer (base)** : Escape ne fermait aucun dropdown (FAIL réel trouvé par eval-final) → handler document keydown en capture + retour focus au trigger (APG) — corrige tous les dropdowns (profil, account switcher, …).
6. **ninja-keys (Ctrl+K)** : contraste shadow-DOM non lisible par axe → `#cw-a11y-contrast` injecté à l'ouverture (commandbar.vue) ; `.actions-list` tabindex=0 (scrollable-region-focusable).
7. **Menus profile** : `DropdownSection` rend `li > ul > slot` — le `div.grid gap-0` wrappant les items cassait ul>li → wrapper retiré, gap reporté via `[&>ul]:gap-0`.
8. **Titres** : h1s ajoutés/vrais (login, signup, reset, widget ChatHeader collapsed, contacts détail, conversation, dashboard, settings) ; h5/h6 décoratifs → h2/span (MetricCard h5→h2, SectionLayout h4→h2, AgentCell h6→span).
9. **Formulaires** : Select.vue `:id="id || name"` (le `<label :for=name>` de WithLabel ne matchait jamais l'id vide) ; checkboxes notifications `aria-labelledby` (desktop) + `<label for>` (mobile) ; bouton mask access-token `aria-label` dynamique SHOW/HIDE (clés i18n ajoutées, `$t()`).

## Warts / pièges rencontrés
- **`CW_IMAGE` shell env override le `--env-file` compose** (shell > env-file pour l'interpolation) — mais tout appel `docker compose` direct doit le repréfixer sinon le tag SHA du .env gagne.
- **Volume DB vierge** : l'entrypoint upstream ne migre pas → `rails db:prepare` requis au 1er boot (vanilla :9710, sabotage :9720, install :9760) ; boot.sh sort tôt si rails-1 `exited` ; install-build.sh inclut l'étape 4b.
- **Token widget régénéré à chaque seed** (`find_or_create_by` + `website_token=nil` auto) : seed-info.json = source unique ; verify.mjs/eval-final.mjs lisent le token depuis seed-info.json (`C56_WIDGET_TOKEN` en override) — les FAIL widget du sabotage :9720 viennent de son token différent, les FAIL lang/viewport nomment le sabotage.
- **Sondes rejouent la valeur enregistrée** : probe aria-controls lit désormais l'attribut live — attr retiré par le fix = OK, valeur live prime sur l'enregistrée.
- **Reports périmés** : deux rescans ont produit un rapport daté d'avant le reboot (containers recréés pendant l'écriture) — toujours spot-check un marqueur live avant de croire un rapport.

## Artefacts
patch.diff (10 commits `c56:`, 3209 lignes, sha256 `5815987f…`), patch.diff.sha256, manifest.json (auditCommands verbatim), results.json, install-build.log, reports/{baseline,final,installbuild}-{public,auth} + incomplete-probes.json, tools/{audit,boot,docker-compose,env.tpl,eval-final,gen-urls,incomplete-probes,install-build,login,seed.rb,seed.sh,verify}.mjs/sh + urls-*.txt + seed-info.json + auth{,-vanilla,-sabotage,-install}.json, provenance.json (--strict).
