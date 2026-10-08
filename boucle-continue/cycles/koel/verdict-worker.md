# Cycle 49 — koel/koel — verdict WORKER

Livré, conforme protocole. Verdict final réservé à l'auditeur indépendant.

## Cible
koel/koel @ `72ab1e8d9bc4b744b2043a5259e1a06d733a9a29` (HEAD master pinné) — Laravel 12/13 + Vue 3.5 + Tailwind 4 + vite-plus/rolldown + SQLite, lecteur audio PWA. Première stack Laravel/Vue de la boucle. Surface : player persistant, file d'attente, context menus, modales `<dialog>` natives, égaliseur noUiSlider, side-sheet tabs, mobile 390.

## Chiffres
- **Baseline vanilla** : 36 scénarios (5 public + 23 auth + 8 états), **1781 occ / 17 règles distinctes**, 0 erreur, 0 skip silencieux. Pureté vanilla prouvée avant (build vite vanilla).
- **Final patché** : **0 violation / 0 erreur** sur les 36 scénarios (102 incomplets — contrastes composites non tranchables par axe).
- **verify.mjs** : 37/37 PASS (landmarks, h1, navs nommées sans slug, context-menu dialog>ul[role=menu], modales `<dialog>`, égaliseur aria-labelledby, contrastes mesurés).
- **eval-final.mjs** : 24/24 PASS (lang/title/viewport, titres, clavier, focus, images alt, aria-hidden, formulaires, tooltips).
- **vanilla → FAIL attendus** : 16 FAIL nommés verify + rescan states vanilla = 12 règles/591 occ/1 erreur (stateProof `ul[role=menu]` timeout — structure absente).
- **sabotage → FAIL nommé** : aria-label dialog retiré → `FAIL context-menu: dialog nommé`.
- **incomplete-probes** : 0 FAIL (102 N-A + 6 PASS ; link-in-text-block trouvé par la sonde → corrigé a.artist underline → PASS).
- **install-build verbatim** : clone vierge @SHA + `git apply --check` 0 rejet + build + seed rejoué :9048 → rescan 0 viol/0 err (installbuild-{public,auth,states,guarded}).

## Faits marquants pour l'auditeur
1. **Router guard post-init (regression trouvée par install-build)** : mon premier guard `route.meta.guard()` s'évaluait aussi au cold resolve → policies non chargées → `TypeError` sur /​#/users,/​#/settings,/​#/upload (3 erreurs). Corrigé : guard uniquement quand `userStore.state.current?.id` (post-init) ; App.vue recouvre le cas init via onInitSuccess. installbuild-guarded + regression-check :9049 = 0v/0e.
2. **Ghosts `song-item`** : le DOM contient un doublon `.playing` 0×0 invisible avant le 1er item visible → tous les sélecteurs `.first()` flakent → corrigé `:visible` dans audit.mjs (verify.mjs réutilise STATES).
3. **aria-controls pendants** : panels side-sheet lazy-mountés (`v-if`) → aria-controls des tabs pointaient vers des éléments absents → shells désormais toujours rendus (`v-show` + slot lazy). Contrôle : aria-controls absent = OK, présent = doit résoudre.
4. **Menus** : `div[role=dialog][aria-label] > ul[role=menu] > li[role=menuitem|separator]` ; rating radiogroup déplacé HORS du `<ul>` (descendant interdit) dans le dialog ; sous-menus `aria-haspopup=menu`.
5. **Contraste** : `--color-highlight` #f1661b→#f57329 (4.7:1 vs #2f2f2f) + vars boutons `--color-primary-btn`/`--color-success-btn`/`--color-highlight-btn` + `body` porte le fond réel (`::before` illisible par axe).
6. **YouTube/media-browser** : routes feature-gated — guards `uses_you_tube`/`uses_media_browser` dans routes.ts ; post-init → 404 screen (main + h1) au lieu d'un écran vide.

## Artefacts
patch.diff (83f +234/−152, sha256 bb305a05…), patch.diff.sha256, manifest.json, results.json, install-build.log, reports/{baseline,final,final-states-vanilla,installbuild,regression-check}-*, reports/probes/, verify-vanilla.txt, verify-sabotage.txt, tools/{audit,login,resolve-ids,verify,eval-final,incomplete-probes,seed.py,seed-media.sh,install-build.sh,urls-*,auth.json,auth-install.json,package*.json}, provenance.json (--strict).
