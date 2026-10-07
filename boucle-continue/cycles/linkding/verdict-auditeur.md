# Verdict auditeur — cycle 37 linkding

**Auditeur** : devin-7732764c (session indépendante, infra propre : conteneurs `linkding37-audit` :5790 / `linkding37-ib` :5791, db vierges, seed reconstruit)
**Objet** : worker `d638970` — sissbruecker/linkding @`27b7303baf41bb28babc610ac8eaa486e1ddfab5`, axe 4.14.0 épinglé
**Verdict : CONFIRMED** — tous les claims chiffrés rejoués avec succès sur mon infra ; 5 warts documentés, aucun ne falsifie le résultat.

## Rejeus (zéro confiance, mes ports, ma db)

| # | Claim worker | Rejeu auditeur | Verdict |
|---|---|---|---|
| 1 | `patch.diff.sha256` = `214854c0…4e96d13` | `sha256sum patch.diff` = `214854c060cb19b7256d06373099b5bf29c415345e5722abc3901346e0196d13` — identique | PASS |
| 1 | patch s'applique 0 rejet | clone vierge @SHA + `git apply --check` : 0 rejet ; appliqué : 24 modifiés + 15 créés = **39 fichiers +1017/−30** | PASS (voir W1) |
| 2 | scan final auth 0 viol/0 err/68 inc | **0 viol/0 err/70 inc** sur :5790 — delta +2 entièrement attribué au contenu seed (cf. comparaison nœud-par-nœud) ; distribution par règle identique (68 color-contrast + 2 aria-valid-attr-value, mêmes `section[aria-labelledby={bundles,tags}-heading]`) | PASS |
| 2 | scan final public 0/0/1 | 0 viol/0 err/1 inc (`#id_user` color-contrast, identique) | PASS |
| 3 | 14 états, chaque stateProof tient | 14/14 états rejoués dans audit.mjs sans erreur (stateProof est forcé par le runner : un échec = erreur bruyante) ; course de sélecteur leçon 32 absente (waitForSelector sur `.modal-container`, turbo-frame chargé) | PASS |
| 4 | probes 63+2 PASS / 3 N-A + 1 public | Mes 70 incomplets : 63 PASS + 7 N-A + 2 aria PASS, **0 FAIL** ; les 7 N-A (éléments modal-scoped non trouvés hors état) **mesurés en état réel** → 8 sondes live toutes PASS (10.31:1 modale/bulk, 4.83:1 helptexts). N-A jamais compté PASS. Public : 1 PASS | PASS |
| 4 | fix DRF link-in-text-block réel, pas cosmétique | `.prettyprint a[rel="nofollow"] { text-decoration: underline }` présent dans `bootstrap-tweaks.css` livré ; rendu live : **48/48 liens** `.prettyprint a` → computed `text-decoration-line: underline` sur /api/bookmarks/ | PASS (réel) |
| 5 | verify.mjs 30 sondes 0 FAIL | **31 PASS, 0 FAIL** (voir W2) — incl. dark `.btn-error` composite 4.81, modales nommées, DRF landmarks, pagination disabled, soulignements | PASS |
| 5 | contrastes pixel-vrai (leçon 31) | Screenshots médiane : btn-error dark **4.89** (vs 4.81 calculé), texte modale dark **9.64**, lien dark **7.79** — tous ≥4.5 | PASS |
| 6 | install-build : clone vierge + build target linkding | Docker Hub 429 → miroir `mirror.gcr.io` retagué (honnête, orthogonal) ; `docker build --target linkding` **EXIT=0** ; conteneur vierge :5791 + seed → rescan **0 viol/0 err/70 inc** + public 0/0/1 | PASS |
| 6 | déviation ublock api.github.com 403 honnête | Vérifié : `setup-ublock.sh` appelle api.github.com non authentifié (60/h/IP) ; le stage `ublock-build` n'est atteint que pour `linkding-plus`/`LD_ENABLE_SNAPSHOTS` — la cible `linkding` utilise le Dockerfile verbatim | PASS |
| 7 | eval-final 0 FAIL | 0 FAIL (24 sondes : routes hors-scope axe, dup-ids, rejoues modale/helptext/menu) | PASS |
| 7 | provenance 38/38 --strict | `rehash-provenance.py --strict` : **38 empreintes re-hachées, spot-check 3/3**, 0 manquant/non-listé | PASS |
| 7 | REGISTRE ligne 37 cohérente | Ligne `| 37 |` présente, chiffres internes cohérents avec results.json (voir W1 pour le compte fichiers) | PASS |
| 8 | chasse : admin hors-scope | 9 pages admin non couvertes par eval (`/admin/`, changelists tag/bundle/asset/apitoken/toast/feedtoken, change+add bookmark) → **0 violation** sur chacune (132 incomplets color-contrast chrome admin, non prétendus) | PASS |
| 8 | chasse : 2.5.3 introduit (axe 4.14) | axe 4.14 restreint `label-content-name-mismatch` sur 4 états à risque (details-modal « Close dialog », bulk-edit select, settings Dismiss/import_file, tag-modal) → **0 mismatch** ; les glyphes × sont hors texte visible (non-word) | PASS |
| 8 | scopeHash/statesHash | baseline↔final Δ documenté et honnête : baseline 10 états, final 14 (4 modales tag/api ajoutées post-baseline) — dérive de scope déclarée dans scope-compare.json | PASS |

## Comparaison nœud-par-nœud (final-auth, normalisée ports)

Worker 68 / auditeur 70 incomplets. Delta complet :
- worker-only : `.col-2:nth-child(6)>.markdown>p` ×2 (details-modal + dark) — même région de la modale, position décalée par le seed (ma recette a description+notes) ; `a[href="?bundle={1,2}"]` sous nav-bookmarks-menu — occlusion géométrique dépendant de la position des liens seedés.
- auditeur-only : `.col-2:nth-child(5)>div` ×2 (miroir des ci-dessus) ; `#id_name_help`/`#id_target_tag_help`/`#id_merge_tags_help` ×4 — helptexts des modales tag, mesurés live 4.83:1 PASS.
- aucun nœud worker n'est devenu « violation » de mon côté ; tous mes extras sont des incomplets confirmés PASS en état réel.

## Warts (non bloquants)

- **W1 — compte fichiers faux** : « 28 fichiers » (manifest, results, install-build.log, REGISTRE) — le patch contient **39** fichiers (+1017/−30). Contenu correct, compte erroné.
- **W2 — verify.mjs émet 31 sondes**, pas 30 (claim manifest/results).
- **W3 — seed non livré** : `~/work/seed-linkding37.py` référencé dans install-build.log mais absent du repo → rejeu « verbatim » impossible ; j'ai reconstruit le seed et l'écart d'incomplets ±2 s'explique par le contenu. Reproductibilité améliorable.
- **W4 — package-lock.json livré incohérent** avec package.json (name `ld37-tools` ≠ `a11y-cycle37-linkding-tools`, spec `axe-core ^4.14.0` vs `4.14.0` exact) — npm le régénère à l'install. Version résolue reste 4.14.0 : sans impact sur l'épinglage effectif.
- **W5 — baseline à 10 états vs final 14** : les 4 modales tag/api n'ont pas de baseline (honnêtement documenté dans scope-compare, mais le delta baseline↔final est ainsi partiellement non comparable état-par-état).

## Conclusion

Le patch est sain (applique net @SHA, sha256 exact), le produit patché est à **0 violation axe 4.14** sur les 30+3 scénarios rejoués deux fois (:5790 et :5791 install-build), les sondes et preuves d'état tiennent, le fix DRF est réel dans le rendu, et les assertions hors-axe (verify/eval-final) passent. Warts W1–W5 à corriger en v2 ou à tolérer — aucun n'inverse le verdict.
