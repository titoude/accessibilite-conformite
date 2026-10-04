# Verdict auditeur indépendant — cycle 12 : navidrome/navidrome @ 95f67d2c (v3)

**Verdict : CONFIRMED** — axe-score v2/v3 reproduit à l'identique sur build issu de `patch-v3.diff` seul appliqué à un checkout vierge (0 viol./0 err./exit 0 sur 15 surfaces, profil d'incomplets identique), patch sain (mécanisme popup-layer vérifié en live, pas de masquage, runner intègre), chaîne d'artefacts complète (sha256 + provenance 30/30 + statesHash/scopeHash vérifiables de bout en bout, install-build prouvé chez l'auditeur).

Auditeur : session Devin b7143e87 (boucle-continue, branche `devin/boucle-continue`)
Historique : v1 → PARTIAL (disablePortal masquait les menus à l'AT ; statesHash invérifiable) · v2 → PARTIAL (patch unbuildable : 3 fichiers non trackés omis du diff) · **v3 → CONFIRMED**.

## Rejeu v3 (worktree vierge @95f67d2 + patch-v3 seul, port 8091)

| Étape | Résultat |
|---|---|
| sha256 `patch-v3.diff` | OK — `a1112644…e0` conforme à patch-v3.diff.sha256 + provenance |
| Contenu du diff | `patch-v3 = patch-v2 + 3 new-file hunks` exactement : `ui/bin/patch-ra-a11y.mjs` (identique v1), `ui/src/common/popupContainer.js` (`export const popupContainer = () => document.getElementById('a11y-popup-layer')`), `ui/src/layout/NavItemLink.jsx`. Aucune autre section modifiée (comparaison section-par-section). |
| `git apply` + `npm ci` (966 pkg, postinstall patch-ra-a11y) + `npm run build` (vite) + `go build -tags netgo,sqlite_fts5` | **PASS de bout en bout** — le finding critique v2 est résolu : le patch livré produit l'app seul, sur checkout propre |
| Boot `ND_PORT=8091` + scan seed 5 mp3 + login.mjs | PASS |
| `audit.mjs` : 10 urls + `--states all` | **0 règle / 0 occurrence / 0 erreur, exit 0** sur 14 scénarios — conforme à `reports/final-v2/report.json` (le code audité est identique à la v2) |
| `audit.mjs` login | **0/0/0, 6 incomplets** — conforme à `reports/final-login-v2/report.json` |
| Incomplets | `color-contrast` ×14, `aria-valid-attr-value` ×9 — identique au livré ; zéro `aria-hidden-focus`, zéro `bypass` |
| `verify.mjs` | **14/14 PASS** (assertions durcies v2 : h1==1, bouton aria-expanded réel, menu `inPopupLayer && rootHidden !== 'true'`) |
| `eval-final.mjs` | **6/6 PASS** |
| provenance.json | **30/30 fichiers conformes** |
| scopeHash/statesHash | `830a3798…`/`6548828d…` reproduits à l'identique lors du rejeu v2 sur :8089 (hashes liés à l'origine — les miens diffèrent sur :8091 par construction, auto-cohérents dans mon scope.json) |

## Mécanisme vérifié (probes live indépendants, états user-menu / song-context-menu / album-context-menu)

`ul[role=menu]` (9 items) → ancêtre `#a11y-popup-layer[role=complementary][aria-label="Popup layer"]`, frère de `#root` au niveau body ; `#root` `aria-hidden` = null à chaque état. Le ModalManager n'a plus de frère à masquer : **rien n'est jamais aria-hidden** — strictement meilleur que le vanilla (qui masquait tout #root à l'ouverture d'un menu). Effet de bord amont documenté et corrigé : `aria-required-children` (Card/Divider sortis du `MenuList`, `Logout role=group`).

## Findings résiduels (tous minor/info — aucun ne remet en cause le score ni la santé du patch)

1. **[minor] Churn lockfile non traité** (F3 v1) : 39 hunks `"peer": true` non fonctionnels dans patch-v3.diff.
2. **[minor] manifest.json obsolète** : `boot.notes` documente encore `disablePortal` (supprimé en v2) ; `artifacts.patch` pointe patch.diff v1 « +451/-111 » ; `install-build.log` daté v1 (la preuve v3 existe : ce verdict + le claim worker). Le lecteur doit lire results.json.patch_v3/errata pour trouver le bon patch.
3. **[minor] Landmark vide permanent** : `#a11y-popup-layer[role=complementary]` existe vide hors ouverture de menu — point de repère vide en navigation landmarks (un bascule `aria-hidden` sur état vide l'éviterait).
4. **[minor] Résidus amont** : un `aria-label="more"` en dur subsiste hors patch (tuile album) ; `aria-valid-attr-value` incomplete ×9 = `aria-controls` amont MUI/RA vers menus non résolubles (`simple-menu`, ids générés) — jamais introduits par le patch, documentés.
5. **[info] provenance.json** : l'entrée `verdict-auditeur.md` correspond au fichier de cette révision — le hash devient périmé à chaque mise à jour du verdict (attendu ; rehash au prochain commit du worker).
6. **[info] Leçon protocole acquise** : la règle 6 du protocole (« patch inclut les nouveaux fichiers via `git add -N` + install-build rejoué ») a été ajoutée suite au finding v2 — le défaut est devenu garde-fou.

## Rationale

CONFIRMED = score axe reproductible + patch sain. Score : reproduit à l'identique sur un build que `patch-v3.diff` seul produit sur checkout vierge — critère install-build prouvé côté auditeur, pas seulement affirmé. Patch : sain — correction réelle et vérifiable (landmark dédié, zéro masquage AT, mieux que l'amont), pas de `display:none`/suppression DOM/faux aria, runner audit.mjs inchangé hors durcissement légitime des sélecteurs d'états, verify.mjs plus strict. Les résidus sont des minors documentés, dont aucun n'altère le score ni ne masque une violation.
