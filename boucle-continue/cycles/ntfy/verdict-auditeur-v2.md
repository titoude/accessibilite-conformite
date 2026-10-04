# Verdict auditeur — cycle 14 ntfy, patch v2

**Verdict : CONFIRMED**

Re-audit indépendant du correctif v2 (commit `aeb5a8c`), rejoué de bout en bout sans
faire confiance aux affirmations : patch ré-appliqué sur clone propre au commit épinglé,
build rejoué, audits rejoués contre mon propre binaire, sondes DOM live écrites par
l'auditeur. CONFIRMED = reproductibilité axe-score + patch sain — PAS conformité WCAG.

- Auditeur : Devin session `devin-b116fc50db274ae3a75845f49e31fd1e`
- Date du verdict : 2026-10-04
- Base d'audit : clone propre `accessibilite-conformite`, branche `devin/boucle-continue` à `c4c8ef5` (le cycle 14 est figé à `aeb5a8c`)
- Cible : `binwiederhier/ntfy @ 8b95a3bbfd42d40a16293b6e2079b104bf6eb68d`

## Résultat par point

### 1. provenance.json — recalcul sha256

- `generated: 2026-10-04T20:08:36Z` (« regen post-v2 ») — 26 fichiers couverts.
- **26/26 sha256 exacts**, dont `patch-v2.diff` = `b3a4dbe2…a427` (identique à `patch-v2.diff.sha256`).

### 2. patch-v2.diff — application sur clone propre

- Worktree neuf à `8b95a3b` : `git apply --check` OK, `git apply` OK — **23 fichiers modifiés + `web/src/app/popupContainer.js` créé** (24 entrées, cumulatif v1+v2 ; le nouveau fichier reste `??` untracked après apply, normal : l'index n'est pas touché par `git apply` sans `--index`).
- Contenu vérifié aux points sensibles : `app.css` `a{ #338574→#2f7a69 }` ; gradient ActionBar `#338574→#56bda8` remplacé par `#2f7a69→#34806e` ; PWA `#317f6f→#2f7a69` ; `container={popupContainer}` sur tous les Dialogs (Account ×6, Subscribe, Publish, Reserve ×3, Upgrade, Preferences users, DisplayName), `ModalProps.container` sur le Drawer temporaire, `Modal` lightbox, 7 `<Portal>` nus ; Pref : `role=row/cell` ET `aria-label` retirés ; 8 Card → `role="group"` ; `#338574` restant corrigé (UpgradeDialog ×3, cercle Notifications).

### 3. Install verrouillée + build — rejoué par l'auditeur

Sur mon worktree v2 (node v24.19.0, npm 10.8.3, go1.25.1) :
- `npm ci` PASS · `npm run lint` PASS 0 erreur · `npm test` PASS 90/90 · `npm run build` PASS
- `mv index.html→app.html`, `mv build ../server/site`, stub `server/docs/index.html`, `go build` racine PASS (binaire 76 560 768 o).
- Cohérent avec `reports/final-v2/install-build-v2.log` (leur run : go1.26.0 ; la mienne go1.25.1 — le `go` toolchain directive résout, build OK dans les deux cas).

### 4. scope.json / statesHash — cohérence

- Rejeu FINAL sur :8090 : **scopeHash `87a3c17…` identique** (même périmètre que v1) et **statesHash `e872e4f…` identique au livré** (hash changé vs v1 `921cb6b…` — attendu : les setups STATES ont été réécrits en v2).
- 8/8 scénarios audités, 0 erreur. final-login-v2 : 2/2, 0 violation.

### 5. manifest.json v2 — rejouabilité

- `auditCommands` incluent désormais la commande BASELINE verbatim (urls + `/account` + note d'erreur attendue), FINAL, FINAL-LOGIN, verify, eval-final, incomplete-probes — toutes rejouées telles quelles.
- `seed` : littéraux exacts des 2 `curl`, dont le markdown **avec lien** ; `note` explique pourquoi le lien est obligatoire ; `credentials` explicites.
- `boot.commands` corrigés (go build à la racine) ; `toolVersions` épinglés (node v24.19.0, npm 10.8.3, go1.26.0).
- **Résidu** : `states.json` du cycle porte encore `921cb6b…` (hash v1) alors que le scope final-v2 livré porte `e872e4f…` — fichier d'appoint périmé ; le vrai hash est bien reproduit dans scope.json, donc la preuve n'est pas entachée, mais la fiche n'est plus synchrone.

### 6. results.json — honnêteté

- Aucun verdict auto-proclamé (la section `patch_v2` cite le motif, les deltas factuels et les compteurs — pas de « CONFIRMED » déclaré par le worker).
- `decisionsIncomplets.v2_11` : **exact** — mon rescan reproduit 6 bgGradient + 4 shortTextContent + 1 bgOverlap, mêmes cibles noeud par noeud.
- `decisionsIncomplets.v1_26` : somme des occurrences déclarées = 23 (bgGradient 5 / overlapped 3 / shortText 3) alors que le report.json v1 livré contient 26 noeuds (bgGradient 6, bgOverlap 3, elmPartiallyObscuring 1, shortTextContent 4). Comptage probable par élément plutôt que par occurrence — les 3 noeuds non listés sont dans les familles déjà justifiées par sonde ; imprécision de registre, pas une falsification.

### 7. verify.mjs / eval-final.mjs / incomplete-probes.mjs — les assertions chassent de vrais défauts

- `verify.mjs` v2 = 17 assertions, rejouées **17/17** : localisation par nom accessible CALCULÉ (`getByRole name: /action menu/`, `/subscribe to topic/`), tout élément requis absent = FAIL, noms de combobox résolus via aria-labelledby, et assertions nouvelles vérifiables : le lien markdown du seed DOIT être rendu (`mdLink.found===true` requis) et mesuré ≥4.5 (mesuré : `rgb(47,122,105)` = #2f7a69 → **5.11**) ; dialog dans le layer + `#root` non masqué. Pas de leurre : l'assertion menu cible le vrai `[role=menu]` MUI (5 menuitems réels).
- `eval-final.mjs` v2 = 10 assertions, rejouées **10/10** (ordre des titres ×4 pages, img alt, lang, Escape+récupération du focus, champs dialog nommés, reflow 320px).
- `incomplete-probes.mjs` : sonde par noeud rejouable — mes 11 sondes = livrées 11/11 (gradient h1 min 4.71, badge invisible aria-hidden 5.11, « Subscribe to topic » sous backdrop 21:1). Réserve mineure : ses `STATE_SETUPS` gardent les anciens sélecteurs positionnels (`nav li`.last()) — fonctionnels aujourd'hui, fragiles demain.

### 8. Rejeu de l'audit (binaire v2, seed littéral v2)

Binaire reconstruit par l'auditeur, servi `127.0.0.1:8090`, seed = les 2 curl verbatim du manifest (le 2ᵉ = markdown avec lien `https://ntfy.sh`) :
- **FINAL : 0 violation ×8 scénarios, exit 0, 11 incomplets** — distribution identique au livré (6+4+1, mêmes cibles).
- **FINAL-LOGIN : 0/0**.
- **Baseline vanilla rejouée sous le seed v2** (worktree vanilla sans patch, même seed) : **49 occurrences / 14 règles**, dont `<a href="https://ntfy.sh">lien test</a>` en color-contrast — le défaut F1 est bien présent sur vanilla et bien supprimé par v2 (mesuré 5.11 après patch). Le `final=0` tient désormais sous un seed à lien — le trou de couverture F2 est fermé.

### 9. Vigilance — DOM live (sondes auditeur)

- `publish-dialog` ouvert : `inLayer=true`, `aria-modal="true"`, `#root` SANS aria-hidden (v1 : `true`), layer non masqué, focus à l'intérieur et **piégé après 6 Tab**, Escape ferme.
- `subscription-popup` : menu dans le layer, 5 items réels, `#root` non masqué.
- Drawer temporaire mobile (390 px) : monte dans le layer (keepMounted), s'ouvre (paper 280 px, 7 items), focus piégé, Escape ferme. Le `ModalProps.container` fonctionne.
- Au repos : un seul `role=complementary` nommé « Popup layer » — pas de duplication de landmark. (Résidu v1 inchangé : le layer reste un complementary nommé vide la plupart du temps — wart mineur non bloquant, son `childCount` contient le drawer keepMounted.)
- Effet de bord connu et acceptable : avec les modales montées dans le layer, `#root` n'est plus aria-hidden pendant les overlays ; l'inertie AT repose sur `aria-modal="true"` — conforme ARIA 1.1, et supprime le défaut `aria-hidden-focus` à la racine plutôt que de le déplacer.

## Vérification croisée des corrections F1–F6

| Finding v1 | Statut v2 | Preuve rejouée |
|---|---|---|
| F1 `app.css a{#338574}` 4.42:1 | **corrigé** | `#2f7a69` dans app.css ; lien markdown seedé mesuré 5.11 ; vanilla montre la violation |
| F2 seed sans littéral | **corrigé** | manifest.seed = curl verbatim avec `[lien test](https://ntfy.sh)` + note obligatoire |
| F3 26 incomplets non analysés | **corrigé** | 15 résolus à la source (Pref aria-label, Card role=group, dialogs hors root-hidden), 11 restants N-A prouvés par sonde rejouable (min 4.71 / 5.11 / 21) — `v2_11` exact ; `v1_26` sous-compté (23/26) |
| F4 manifest (baseline absente, boot.command, versions) | **corrigé** | auditCommands verbatim complets, boot.commands séparés, toolVersions |
| F5 layer = menus seuls | **corrigé** | container=popupContainer sur Dialogs/Modal/Drawer/Portals ; DOM live : dialog+menu+drawer dans layer, #root jamais aria-hidden, focus piégé |
| F6 assertions fragiles | **corrigé** | verify 17/17 avec noms calculés et requis-absent=FAIL ; eval 10/10 ; STATES par nom |

## Réserves mineures (hors verdict)

1. `states.json` non regénéré pour v2 (affiche le statesHash v1 `921cb6b…` vs `e872e4f…` livré) — mettre à jour ou regénérer.
2. `decisionsIncomplets.v1_26` totalise 23/26 — documenter la convention de comptage (éléments distincts vs occurrences) ou compléter les 3 noeuds manquants.
3. `incomplete-probes.mjs` : `STATE_SETUPS` restent sur des sélecteurs positionnels `.last()` (non durcis comme audit.mjs).
4. `app.css` conserve `a:hover{color:#317f6f}` — mesuré **4.78:1 ≥ 4.5**, conforme ; noté pour mémoire seulement.

## Conclusion

Les six findings de l'audit v1 sont verifiablement corrigés, y compris le seul défaut
produit réel (contraste des liens bruts) et le trou de couverture du seed. La chaîne
complète se reproduit à l'identique : sha256 du patch et de 26 fichiers de provenance,
application propre sur le commit épinglé, build npm+go PASS, scopeHash et statesHash
identiques, 0 violation sous le seed à lien (baseline vanilla : le même lien viole),
11 incomplets résiduels tous justifiés par sonde rejouable avec ratios mesurés
indépendamment (4.71 / 5.11 / 21). Aucun leurre, aucune assertion vacuole, aucune
prétention de conformité WCAG dans les artefacts.

**CONFIRMED** — reproductibilité axe-score + patch sain. Ce verdict ne certifie pas la
conformité WCAG du produit ; il atteste que les artefacts du cycle ntfy v2 sont exacts,
rejouables et que le patch est conforme à ce qui est décrit.
