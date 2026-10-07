# Verdict fixer v6 — syncthing @7ad73b408 (cycle 28)

Réponse au ré-audit **v5 PARTIAL** (auditeur a5376c73, commit d291303). Partie 1 livrée en 76f298a (F1 + axeVersion dans le kit) ; cette partie 2 livre les preuves, les rejeux et les livrables rafraîchis.

## Findings de l'auditeur → statut

| # | Finding v5 | Action v6 | Mesure |
|---|-----------|-----------|--------|
| F1 | `label-content-name-mismatch` ×52 sous axe 4.14 — régression 2.5.3 du patch (aria-label « Language » vs texte « English ») | Corrigé en 76f298a : `aria-label="{{ 'Language' | translate }} — {{localesNames[currentLocale] || 'English'}}"` ; **prouvé ici sous axe 4.14.0** installé en scratch (`~/work/axe414`, hors repo — minimumReleaseAge 7 j respecté) | Sonde A/B 4 surfaces (login public, dashboard, settings, ur-open) : **AVANT état v5 : mismatch = 1 sur chaque surface**, accName « Language » ; **APRÈS : 0 partout**, accName « Language — English » ⊇ « English » ; + **rescan complet sous 4.14 : 0 violation sur 55 pages** (3 crawlées + 52 états — `reports/axe414-final/`, scope.json porte `axeVersion:4.14.0` ; 242 incomplets : heading-order 12 / color-contrast 229 / th-has-data-cells 1 — règles enrichies 4.14 ; 1 erreur crawl = /rest/debug/support, téléchargement attendu. Les rapports officiels restent sous 4.13.0 épinglé) |
| F2 | provenance 14/39 = sha256 v4 — 3e récidive | Procédure tenue : `boucle-continue/rehash-provenance.py boucle-continue/cycles/syncthing` exécuté **en dernier** avant commit | Script strict : exit 2 sur entrée sans fichier, warn sur livré non listé — verdict-fixer-v6.md listé dans `files` avant re-hash |
| F3 | install-build/eval-final/install-build.json périmés ère v4 (« 19 fichiers », 46 pages) | **Rejeu complet** : clone propre @7ad73b408 → baseline-auth mesuré AVANT patch sur cette instance → `git apply` (20 fichiers, 0 rejet) → `go generate` → `go build` → serve :8484 assets embarqués → rescan verbatim des auditCommands du manifest | baseline-auth régénéré : **16 règles / 1352 occ / 53 scénarios** (46→53 : le baseline commité datait d'avant l'extension d'états) ; gui.files.go **5 821 912 o**, binaire **38 507 016 o** ; install-build-public **0/0/0/0**, install-build-auth **0 viol / 0 err / 235 inc sur 53** ; **scopeHash install-build-auth == baseline-auth (240f664cebd6…)** — paire A/B à scénarios identiques ; eval-final régénéré **1358→0**, exit 0 |
| F4 | `.progress .frontal` #222 ≈3,6:1 théorique — aucun nœud réel démontré | Nœud réel prouvé rendable : injection scope AngularJS `needed={items:[{type:'progress'…}]}` + `progress[folder][name]` → le template neededFilesModalView.html rend `.frontal` réel (n'existe que sous transfert d'un pair en ligne). Corrigé dans `gui/dark/assets/css/theme.css` du patch : `color:#fff` + chip `rgba(0,0,0,.5)` + `text-shadow:rgba(0,0,0,.8)` — aucune couleur plane n'atteint ≥4,5 sur les 5 barres translucides (blanc→2,57 sur jaune, noir→2,7 sur rouge) | Composite pire-cas mesuré : **8,08:1** (barre jaune #c29d0b) ; 11,24–12,03:1 sur les 4 autres barres — ≥4,5 partout. patch.diff régénéré : **20 fichiers, +292/−131** |
| — | kit racine porte axeVersion (76f298a) | audit.mjs du cycle synchronisé : scope.json/report.json écrivent `"axeVersion":"4.13.0"` | Tous les rapports régénérés le portent |

## Warts harnais trouvés en exécutant verify.mjs (réparés, rejoués 40 PASS)

- `POST /rest/system/restart` peut mourir en vol (`Execution context destroyed`) et part sur un **config stale** si appelé juste après le PUT (debounced write) → séquence PUT → attente 1,5 s → restart via `page.evaluate` sur page rechargée.
- Le token CSRF tourne à chaque boot : le storage-state gardé devient caduc après restart → re-tirage du restart sur page rechargée (sonde `themeLen` http en boucle).
- **Memory-cache du renderer** : tous les thèmes partagent le même Last-Modified (mtime tarball) → le navigateur sert l'ancien theme.css en cache mémoire même après bascule serveur ; ni revalidation ni `Network.setCacheDisabled` ne l'évincent → `Network.clearBrowserCache` + `Page.reload{ignoreCache:true}` ; assertion bg = rgb(255,255,255).

## Chiffres livrés v6

- Rescan officiel (axe 4.13.0 épinglé) : final-public 0/0/0/0, final-auth **0 viol / 0 err / 235 inc / 53 scénarios** ; reports/ régénérés avec axeVersion + statesHash.
- Preuve F1 sous axe 4.14.0 : mismatch **1→0** (×4 surfaces sonde A/B) puis **0 violation sur 55 pages** du rescan complet (reports/axe414-final, axe 4.14.0, crawl inclus).
- install-build : **20 fichiers / 53 scénarios / 0 violation** (vs 19 fichiers / 46 pages périmés).
- eval-final : **1358 → 0** occurrences.
- verify.mjs : **40 PASS / 0 FAIL / 1 N-A**.
- Sondes incomplets rejouées : **235 items → 234 RESOLVED / 1 N-A / 0 CONFIRMED_VIOLATION**, thème clair restauré prouvé en fin de run.
- provenance.json : re-haché via le script strict en dernier avant commit.

## Non-actionnable / hors portée

- `.progress .frontal` ne se rend que sous transfert réel d'un pair en ligne : absent des 53 scénarios hors-ligne — mesuré par sonde à scope injecté (DOM réel du template). Le fix est livré dans le patch (mesuré ≥8,08:1).
- axe-core 4.14 non pinéable dans les deps du repo : minimumReleaseAge 7 j (leçon 30 — politique juste, gardée). Preuve 4.14 documentée en scratch ; rapports officiels 4.13.0 épinglé avec `axeVersion` visible.
