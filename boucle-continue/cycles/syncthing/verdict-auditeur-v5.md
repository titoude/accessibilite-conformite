# Verdict auditeur v5 — cycle 28 : syncthing

**Verdict : PARTIAL** — cinquième itération. Le gros est confirmé par rejeu indépendant intégral (clone @7ad73b408, patch 0 rejet, build, seed, mesures computed live, rescan verbatim, verify, sondes) : **tous les résiduels produit v4 sont réparés et mesurés ≥4,5:1 en dark** (alert-info 4,67:1 sur les 9 modales info, `h1 small`/`.text-muted` 6,66:1, `.text-primary`/`.text-info` #7fb3e0 ≥5,1:1), l'angle mort axe persiste bien (`#about-title` reste en `passes`), la couverture v5 existe et rejoue (52 états + 2 dark), les 3 warts v4 sont fermés en live (verify symétrique, scope-compare régénéré, restart POST → clair sans « Restart Needed »), et les sondes reproduisent **235 items → 234 RESOLVED + 1 N-A** à l'identique. MAIS deux échecs durs : (a) `provenance.json` livré **encore faux — 14/39 empreintes = sha256 des fichiers v4 (@5d7100a)**, troisième récidive du même wart alors que les deux commits v5 annoncent « provenance re-hachée » ; (b) le claim « 0 violation » **ne reproduit pas** : sous axe-core 4.14 mon rescan verbatim rapporte `label-content-name-mismatch` ×**52 occurrences** (navbar langue, toutes pages auth + login public) — une **régression WCAG 2.5.3 introduite par le patch lui-même** (`aria-label="Language"` vs texte visible "English"), aveugle sous l'axe 4.13 de la boîte du fixer (preuve live : même DOM, 4.13 → 0, 4.14 → violation ; `mobile-home` à 390 px épargné parce que `.hidden-xs` masque le texte → la règle devient inapplicable).

- Auditeur : session Devin indépendante `devin-a5376c73f33f477ea5d272e3ccdc9f7b`
- Produit : syncthing/syncthing @ `7ad73b408adc792cabeed41d89a37b93e2bd84d0`
- Commits audités : `a6774bb` + `63bf50b` sur `devin/boucle-continue`
- Méthode : re-clone propre @SHA + `git apply` patch.diff (0 rejet, 20 fichiers — pas 19), `go generate ./lib/api/auto` → gui.files.go 5 821 864 o, `go build` → 38 507 176 o, boot sur MES ports (GUI :8620, home ~/work-audit5/st-home, st2/st3 :8624/:8625), seed.sh + login.mjs rejoués, mesures computed-style directes, rescan verbatim complet (52 états), verify.mjs intégral contre rapports livrés **et** contre mes rapports régénérés, sondes verbatim 235 items, rejeu du fix restart live, hash-par-hash provenance.
- Axe : **4.14.0** de mon côté vs **4.13** côté livré (lisible via helpUrl « axe/4.13 » dans report.json ; le rapport n'enregistre pas la version d'axe — à noter).

## Rejeu vs claims v5 — chiffres

| Point énoncé | Claim v5 | Rejeu auditeur | Δ |
|---|---|---|---|
| Résiduel `.alert-info` | #fff sur #9b59b6 ≥4,5 sur About/show-id-qr/ur/localChanged | mesuré live : titre `rgb(255,255,255)` sur header `rgb(155,89,182)` = **4,67:1** — sur les **9** modales `status="info"` force-ouvertes (#about, #idqr, #ur, #needed, #remoteNeed, #restarting, #savingChanges, #upgrading, #localChanged) | **confirmé, élargi** |
| `h1 small`/`.text-muted` | #adadad ≥4,5 (About version/codename) | `#about h1 small` = `rgb(173,173,173)` sur `rgb(39,39,39)` = **6,66:1** | **confirmé** |
| `.text-primary` | #7fb3e0 ≥4,5 sur #3B3B3B ET #272727 | computed = `rgb(127,179,224)` : **5,06:1** sur #3B3B3B, **6,82:1** sur #272727 ; `.text-info` aussi #7fb3e0 (la règle :331 écrase #9a6dc0) | **confirmé** |
| Angle mort axe persiste | le nœud doit rester en `passes`, fix prouvé par sonde | axe 4.14 resultTypes `passes` sur #about ouverte : `#about-title` **dans passes**, 0 violation — axe ne voit toujours pas la famille `.modal-header.alert-*` | **confirmé** |
| Coverage v5 | about-dark + folder-restore-versions-dark dans states.json + STATES | présents dans les deux, **rejoués** dans mon rescan (about-dark : #about ouvert en dark ; folder-restore-versions-dark : #restoreVersions + arbre fancytree peuplé) — 0 erreur | **confirmé** |
| Rescan final-auth | 53 scénarios, 0 violation, 235 incomplets | **53 pages, 0 erreur, 235 incomplets identiques** (234 color-contrast + 1 th-has-data-cells) — MAIS **1 règle × 52 occurrences** (`label-content-name-mismatch` sur `a[aria-label="Language"]`) que leur run n'a pas vue | **non reproduit** (axe-version, détail ci-dessous) |
| Rescan final-public | 0 violation | **1 violation** (même nœud, page login) | **non reproduit** |
| verify.mjs | 40/40 attendu | **40 PASS / 0 FAIL** contre les rapports livrés (dont « thème clair restauré (symétrie du check dark) » — wart v4 fermé) ; **38 PASS / 2 FAIL** contre MES rapports régénérés (seuls « 0 violation » public + auth cassent) | **confirmé** sur artefacts / **réfute** le claim sous 4.14 |
| Sondes | 235 items / 234R / 1NA | rejoué verbatim : **235 items, 234 RESOLVED, 1 N-A** (th-has-data-cells .table-condensed sans `<td>`), 0 CONFIRMED_VIOLATION | **confirmé à l'identique** |
| Wart restart POST | sondes rendent le clair sans « Restart Needed » | code vérifié (POST /rest/system/restart après PUT light) + **prouvé live** : `clair-restauré`, theme=light servi, body blanc, **0 panneau Restart Needed** | **confirmé** |
| scope-compare régénéré | labels scopeHash/statesHash + scenarios_final réel | final.scopeHash `1ec7c127` (vrai scopeHash) + statesHash `bcf0baf4` correctement étiquetés ; `detail.scenarios_final` = **53 entrées réelles** (52 états + page) @:8386 ; baseline `54bb51d7` | **confirmé** |
| Rejeu install-build | clone + apply + generate + build | 0 rejet ; **MAIS** install-build.json dit « 19 fichiers modifiés » (patch = **20**) et gui.files.go 5 821 220 o / binaire 38 507 048 o — **périmés** (mes rebuilds : 5 821 864 / 38 507 176) ; reports/install-build-* = 46 pages @:8484 du 2026-10-05 (ère v4, jamais rejoués) | **wart staleness** |
| provenance.json | « re-hachée 39/39 » (les 2 commits v5) | **14/39 STALE** : patch.diff, results.json, scope-compare.json, states.json, tools/{audit,incomplete-probes,verify}.mjs, reports/incomplete-probes.json, reports/final-{public,auth}/{json,md,scope} — chaque empreinte déclarée = sha256 du fichier **@5d7100a** ; generatedAt inchangé (2026-10-05) | **FAUX — 3e récidive, corrigé par l'auditeur** |

## Finding produit : `label-content-name-mismatch` — régression introduite par le patch

`patch.diff` ajoute `aria-label="{{ 'Language' | translate }}"` sur le toggle langue de la navbar (`languageSelectDirective.js`) — rendu sur **toutes** les pages, y compris le login public. Le texte visible est `localesNames[currentLocale]` ("English") → nom accessible "Language" ≠ texte visible → **WCAG 2.5.3 violé** (un utilisateur de commande vocale disant « English » n'atteint pas le contrôle). Amont, pas d'aria-label → le nom venait du contenu → conforme.

- **Mon instance (axe 4.14.0) : déterministe, 3/3** — public login 1 occurrence ; auth 52/53 pages-états (tout sauf `mobile-home` : à 390 px, `.hidden-xs` masque « English » → la règle devient inapplicable — ce qui verrouille le mécanisme).
- **Leur run (axe 4.13) : 0** — rejoué sur mon instance avec axe 4.13.0 : **0 violation sur le même DOM**. La règle existe dans 4.13 mais ne se déclenche pas sur ce nœud (régression/limite interne). Leur « 0 » était honnête *sous leur version* — mais l'artefact ne documente pas la version d'axe, et le produit porte la violation réelle.
- Interprétation boucle : le claim « 53 scénarios 0 violation » ne survit pas un rejeu sous la toolchain courante ; le fix correct serait de ne PAS poser d'aria-label divergent (le contenu suffit) ou de lui donner le nom visible.

## Chasse aux angles morts (dark, mesures computed live)

- En-têtes colorées des 28 modales : `alert-danger` #d62c1a → **4,96** (`#networkError`, `#httpError`, `#advanced`, `#majorUpgrade`, `#revert-override-confirmation`), `alert-warning` #806700 → **5,44** (`#restore-versions-confirmation`, `#discard-changes-confirmation`, `#failed`, `#upgrade`, `#remove-folder-confirmation`, `#remove-device-confirmation`, `#share-device-id-dialog`), `alert-success` #198754 → **4,53** (`#shutdown`, `#urPreview`), `alert-info` #9b59b6 → **4,67** (9 modales). Toutes ≥4,5.
- `.progress .frontal` reste `#222` non patché : aucune `.progress-bar` rendue à l'arrêt — résidu **théorique** ≈3,6:1 sur `.progress-bar` #217dbb si une synchro affiche le libellé (amont light aussi <4,5 : #222 sur #337ab7 ≈4,1). Signalé, non bloquant — non couvert par les états (seed sans synchro active).
- `.text-muted` : aucun élément réel rendu hors #about sur le dashboard ; la valeur #adadad est vérifiée par sonde synthétique sur #272727 (6,82:1) et #3B3B3B.
- États info-dynamiques restants (#restarting, #savingChanges, #upgrading, #needed, #remoteNeed) : tous `.modal-header.alert-info` → même mesure 4,67 via force-open.

## Warts

1. **provenance.json : 14/39 empreintes = sha256 des fichiers v4** — le wart « reformaté≠rehaché » de v4 est récidivé *dans les deux* commits v5 dont les messages disent « provenance re-hachée ». Troisième occurrence. *Corrigé par l'auditeur dans ce commit : les 39 empreintes + cette page recalculées depuis le disque.* **Règle renforcée proposée : le fixer doit rejouer `sha256sum` post-commit et prouver le diff sur les empreintes, pas seulement la note.**
2. Claims staleness secondaires : `install-build.json` (« 19 fichiers » vs 20 réels ; tailles pre-v5) et `reports/{install-build,baseline}-*` + `eval-final.json` datent tous du 2026-10-05 (ère v4, 46 pages) — jamais régénérés en v5 ; les claims « rescan install-build » décrivent un run qui n'a pas eu lieu sur la base v5.
3. `report.json` ne consigne pas la version d'axe (`runnerVersion` = audit.mjs v6 seulement) — c'est elle qui a masqué la divergence 4.13/4.14. *Fix harnais : écrire `axe.version` dans le rapport (1 ligne dans scanPage) et épingler axe-core dans tools/package.json.*
4. Mineur : verify.mjs valide « 0 violation » sur le **fichier** rapport, pas sur le DOM live — tautologique face à une règle que la version d'axe ne voit pas. La valeur du 40/40 est réelle mais borne au périmètre de la version d'axe du jour.

## Ce que le verdict signifie

- **CONFIRMÉ** : les six familles v4 + les deux états v5 fonctionnent ; les fixes dark sont réels et mesurés ≥4,5 sur toute la surface modale colorée (info/danger/warning/success) ; verify 40/40 rejoué ; sondes 235/234R/1NA identiques ; warts outillage v4 fermés.
- **PARTIAL** — (a) provenance fausse pour la 3e fois (corrigée ici) ; (b) une vraie régression WCAG 2.5.3 posée par le patch (aria-label "Language") que le « 0 violation » livré ne montre pas — aveugle sous axe 4.13, détectée sous 4.14 sur toutes les pages.
- Pour un CONFIRMED en v6 : retirer/aligner l'aria-label du toggle langue (nom = texte visible), épingler axe-core dans tools/ + écrire `axe.version` dans report.json, régénérer install-build/eval-final sur la base v5, et rejouer `sha256sum` réel après tout artefact écrit — pas de claim « re-haché » sans diff des empreintes.
