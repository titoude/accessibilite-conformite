# verdict-worker.md — cycle 45 Kavita (worker)

## Identité
- repo : https://github.com/Kareadita/Kavita @ f75863cb77c0f6aa26e0794a1848294e63c9d07d (HEAD develop pinné via git ls-remote ; dernier tag v0.9.1.4, runtime rapporte 0.9.1.11)
- stack : **.NET 10 (global.json 10.0.0) + Angular 22** — la spec disait « .NET 8 + Angular 17+ », c'est .NET 10 / Angular 22 en réalité — première stack .NET/Angular de la boucle
- port : 7500 · admin kv45admin / Kv45-Admin!Pass

## Chiffres
- baseline : **361 occurrences / 10 règles** sur 31 surfaces (2 public + 19 auth + 10 états) — button-name 216, list 24, page-has-heading-one 23, aria-allowed-role 28, link-name 23, aria-required-parent 16, listitem 16, aria-required-children 6, color-contrast 7, heading-order 2 — 0 erreur, 30 incomplets
- final : **0 violation / 0 erreur** sur 28 scans (2 public + 19 auth + 7 états) — 166 incomplets honnêtes
- verify.mjs 34/34 PASS · eval-final.mjs 35/35 PASS · incomplete-probes 250 PASS / 0 FAIL (après correction probe-level : badge, toast, soulignement liens)
- install-build clone vierge @SHA + git apply (44f, --check OK) + npm install + npm run prod + dotnet build -c Release + boot run dir + seed rejoué (7 series) → **rescan 0 viol** (2 public + 10 auth)

## Corrections (44 fichiers, +191/−169, vraies sources UI/Web/src)
- index.html : role="main" retiré (aria-allowed-role) — déjà propre dans src, le rôle venait du wwwroot stale (leçon : Kavita sert wwwroot depuis le CWD)
- app.component.html : div→`<main>` + h1 visually-hidden (landmark-one-main + page-has-heading-one) ; fullpage-background aria-hidden
- nav-header : brand aria-label, profile button [attr.aria-label], li structure navbar
- card-actionables : [attr.aria-label]="t('actions-for',{name:label()})" ×2 (135 occ button-name)
- side-nav : role="navigation" + aria-labels traduits ; side-nav-item [attr.id] (id="null" dupliqué tué), lien externe nommé
- ngbNav : li role="presentation" sweep (aria-required-children/parent/listitem ×58)
- search-typeahead : h5 group-headers → div.kv-section-header ; listbox role dynamique ; muted→body-text
- series-detail : aria-labels (read-options, want-to-read, edit komf, scrobbling, kavitaplus), h4→h2, modal ariaLabelledBy
- heading-order : h4/h5/h6→h2/h3 sweep ×13 fichiers ; entity-card id dupliqué retiré
- contrastes : dark.scss --btn-primary/nav-link texte noir sur vert ; styles.scss --bs-btn-color #000 ; _badge.scss .bg-primary color:#000!important (2.14:1) ; _toastr.scss .toast-info/.toast-message color:#000 (3.42:1) ; bookmarks ext-link souligné
- en.json : clés actionable.actions-for / side-nav.* ajoutées

## Écarts & honnêteté
- docker officiel NON utilisé : l'image sert un bundle non patchable → build local documenté (écart image/SHA).
- npm ci échoue amont (lock désync) → npm install ; package-lock.json exclu du patch.
- baseline-states2 : 3 états rejoués après fix STATES[].url(B) (fonction, pas valeur).
- reader/manga-reader non audité en lecteur réel (hors-scope étendu leçon : reader mode = zone instable axe) — pages reader scannées en coquille (200 OK).
- seed.py durci : expanduser sur le défaut (bug réel), scan-all fiable vs scans par-lib dédupliqués par Hangfire.

## Livrables
manifest.json, results.json, scope-compare.json, patch.diff + patch.diff.sha256 (git apply --check OK ×2), reports/{baseline-*,scan*,final-*,installbuild-*,probes/}, tools/{audit,login,verify,eval-final,incomplete-probes,seed,urls-*,auth.json,package*.json}, provenance.json (--strict), install-build.log (trace ci-dessous), states.json.
