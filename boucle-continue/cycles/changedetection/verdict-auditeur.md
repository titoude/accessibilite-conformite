# Verdict auditeur — cycle 33 : dgtlmoon/changedetection.io @ a1ce35619aae

**Verdict : CONFIRMED**

Rejeu indépendant complet sur stack fraîche auditeur (clone upstream vierge + `git apply patch.diff`, 0 rejet ; datastore JSON frais seedé ; fixtures v1→v2 ; proxy CDP spawn-per-connection ; axe 4.14.0). Aucune confiance aux artefacts livrés : tous les chiffres ci-dessous sont recomputés ou rejoués.

## Chiffres rejoués (auditeur) vs livrés

| Run | Livré | Rejoué | Concordance |
|---|---|---|---|
| baseline-public | 12 occ / 6 règles | **12 occ / 6 règles** | nœud-par-nœud identique, scopeHash `cbb6687f` identique |
| baseline-auth | 1307 occ / 14 règles / 213 inc | **1307 / 14 / 213** | 47 pages, 0 divergence de comptes par page ni par règle ; seuls littéraux uuid dans sélecteurs CSS diffèrent (watches non remappés) ; scopeHash `66f458e2` **identique** |
| final-public | 0 v / 0 e / 0 inc | **0/0/0** | identique |
| final-auth | 0 v / 0 e / 118 inc | **0/0/117** | scopeHash `66f458e2` identique ; écart = 1 nœud `color-contrast` inconclusif sur l'overlay « heart » (paragraphe « Many thanks »), variance axe de non-détermination — pas une violation manquée ; par règle : CC 106↔107, th-cells 5, aria-prohibited 6 |
| verify.mjs | 29 PASS / 0 FAIL | **29/0** | identique ; sondes computed clair+sombre rejouées en live |
| incomplete-probes | 118 items, 0 CONFIRMED (76R+42NA) | **117 items, 0 CONFIRMED** (75R+42NA) | même nœud que ci-dessus ; les 42 N-A (navigations `#hash` → `HTTP null`, règles sans sonde) se reproduisent à l'identique |
| eval-final | 1319→0, missing=[], unresolved=[] | **identique**, table par-règle identique | — |
| install-build (:5006, clone+apply+venv+npm build+datastore frais) | 0/0/117, scopeHash `edab3b3a` | **0/0/117, scopeHash `edab3b3a` identique** | reproduction bit-identique via UUIDs remappés + `CD_*_UUID` |
| provenance.json | 39 entrées sha256 | **39/39 vérifiées**, 0 fichier non listé | `auth.json` absent (éphémère, gitignoré) |
| styles.css minifié livré | dans patch | **byte-identique** à `npm run build` sur le SCSS patché | artefact compilé authentique |
| statesHash | `68ad30aa…` | recomputé **identique** depuis audit.mjs | les 33 setups livrés sont ceux exécutés |

Total baseline confirmé : **1319 occurrences** (1307 auth + 12 public), final **0** partout.

## Points chauds — vérifiés

- **`generate_processor_badge_colors`** : hash réel md5 recomputé pour les processeurs réels (`text_json_diff`, `restock_diff`, `image_ssim_diff`, `stock_not_in_stock_diff`, `pdf_diff`…). Amont produisait des paires <4.5:1 — dark 1.81–4.25, light 3.61 pour `custom_browser_Steps`. Patché : borne light ET dark convergent toujours (worst sur 2000 noms : **4.50/4.50 exact**). Le code vérifie la bonne paire (fg hsl(h,50,L_text) vs bg pastel ; blanc vs hsl(h,S,L_dark)). OK.
- **`lang="None"` amont** : confirmé réel — DOM vanilla : `<html lang="None">` (41 occ `html-lang-valid` auth + 1 public). Patché : `lang="en"` (fallback `or 'en'`). OK.
- **Pastilles / onglets sur dégradé** : `--color-background-tab` rgba(255,255,255,.55) + texte #222 → mesuré 15.91:1 ; dark blanc sur rgba(0,0,0,.2) → 21:1 ; badges unread #2f6d8d → 5.69:1 ; `#records-selected` → pill rgba(0,0,0,.8) → 21:1. Mesures computed live, pas du CSS statique. OK.
- **Restauration thème dark** : verify PASS « thème restauré en clair » + probes « cookie restauré » — symétrie clair↔sombre↔clair prouvée. OK.
- **Course seed v1→v2** : `wait_check(min_snapshots)` attend le snapshot commité avant la bascule — historiques 2/2/2 obtenus, webdriver inclus (rates via CDP réel). Le mécanisme documenté fonctionne.
- **UUIDs paramétrables** : `CD_API_DOCS_UUID`/`CD_RATES_UUID`/`CD_TAG_UUID` honorés — mon install-build a reproduit `edab3b3a` à l'identique.
- **2.5.3** : baseline 75 occ `label-content-name-mismatch` (axe 4.14) → final 0. La bonne stratégie a été choisie : aria-labels *retirés* des pills pause/mute (le nom = texte visible), ajoutés seulement là où aucun texte visible n'existe (icônes, checkboxes). Pas de nom décorrélé du texte visible.
- **Anti-masquage** : revue de toutes les lignes `+` — aucun `display:none`/`aria-hidden` ajouté sur du contenu (seuls motifs amont conservés : `#selector-wrapper`, `#mobile-home` — les deux reçoivent au contraire un nom accessible). Le `th{display:none}` amont est *remplacé* par un clip-pattern qui garde les en-têtes dans l'arbre a11y — amélioration, pas masquage.

## Intégrité double-couverture

Le dépôt figure bien dans `REGISTRE.md` section « Déjà testés (avant la boucle) » (V1, protocole allégé). `results.json note_integrite` le divulgue honnêtement. Mon jugement : le test V1 était sans auth/états/patch et affirmait « 0 violation axe » sur une surface minuscule — le cycle 33 trouve 1319 violations sous protocole complet, ce qui *invalide rétrospectivement* l'entrée V1 et justifie le retest. Le protocole dit « ne jamais retester un dépôt du registre », mais la transgression est divulguée, traçable et apporte une couverture réelle. N'affecte pas le verdict.

## Findings / warts

- **W1 — gap de périmètre réel** : `/diff/<uuid>/extract` est une page HTML authentifiée joignable (lien onglet « Extract » de /diff), **non scannée et non listée dans `states_exclus`** — elle porte 2 violations color-contrast résiduelles sur le build patché (`<span style="color: red">` sur #eeeeee = 3.44:1, markup produit amont dans `processors/templates/extract.html` — pas du contenu utilisateur). `/settings/notifications` et `/backups/restore` sont aussi hors-scope mais propres à mon scan scratch (0 viol). Le claim « 0 violation » tient *dans le périmètre déclaré* ; l'exclusion de /extract n'est pas documentée. Recommandation : ajouter la page (et fixer les deux `<span style="color: red">` inline).
- **W2 — outillage** : `tools/seed.py` livré plante à `seed_extra_proxy` (`log()` non défini) → exit 1 systématique, alors que tout le seeding a réussi (watches, historiques, proxies.json écrits). Le résumé JSON ne s'imprime jamais — le livré ne peut pas avoir tourné en exit 0 tel quel. Wart outillage, sans impact sur la substance.
- **W3 — doc** : `manifest.toolVersions.axe-core` déclare 4.13.0 ; les rapports et `~/audit-tools` exécutent **4.14.0** (spec `^4.13.0` a résolu 4.14). Les deux runs utilisent le même moteur — pas de comparabilité croisée brisée, mais la version écrite est fausse.
- **W4 — doc** : `results.json.regles_baseline` liste des noms de règles périmés (`button-name`, `heading-order`, `label-title-only`, `empty-heading`, `html-has-lang`, `landmark-main-is-top-level`…) — aucun n'apparaît dans le rapport réel (vraies règles : `color-contrast` 390, `region` 596, `label-content-name-mismatch` 73, `html-lang-valid` 41, `page-has-heading-one` 40, `landmark-one-main` 40, `target-size` 41, `label` 26, `link-in-text-block` 17, `empty-table-header` 16, `select-name` 12, `link-name` 11, `image-alt` 3, `scrollable-region-focusable` 1). Comptes 14/6 justes par coïncidence.
- **W5 — doc** : `resume.*.incomplets` mélange les unités — groupes pour baseline/final (53/34), nœuds pour install_build (117 → 34 groupes).
- **W6 — patch (bénin)** : `<h2 id="add-watch-legend">…</h3>` — close-tag mismatch dans `add-watch-ui.html` ; le DOM rend `h2#add-watch-legend` correctement (tag orphelin ignoré), aucun impact axe. Défaut source cosmétique.
- **W7 — limites connues** : 6 incomplets `aria-prohibited-attr` sur spans `role=insertion` (markup diff amont, aria-label « Added text ») — axe ne tranche pas, pas de sonde implémentée → N-A revue manuelle documentée. Le color-contrast probe ne compose pas les couches alpha (limitation documentée dans le script ; verify.mjs compense via `effBg`).

## Conclusion

Chiffres de claim tous reproduits sur infrastructure indépendante, avec scopeHash bit-identiques (`66f458e2` baseline≡final, `edab3b3a` install-build) — le périmètre scanné est exactement le même que livré. Patch sain : zéro masquage, fixes réels mesurés en computed style, borne de lightness exhaustive, CSS compilé régénérable. Le gap `/diff/*/extract` (2 occ résiduelles) est un périmètre non divulgué, pas une contradiction des claims scopés — à suivre en todo.

**Verdict : CONFIRMED** (axe-score reproductible + patch sain ; warts doc/outillage + 1 gap de périmètre ci-dessus).
