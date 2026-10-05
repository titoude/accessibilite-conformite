# Verdict auditeur — cycle 28 : syncthing

**Verdict : CONFIRMED** (reproductibilité axe + santé du patch ; jamais une conformité WCAG complète) — avec 3 findings résiduels et 3 warts.

- Auditeur : session Devin indépendante `devin-e9fee71217104445b432087597191063`
- Produit : syncthing/syncthing @ `7ad73b408adc792cabeed41d89a37b93e2bd84d0`
- Commit audité : `d1d56bd` (`devin/boucle-continue`)
- Méthode : **rejeu intégral** sur machine auditeur — clone vierge @SHA, clone patché (`git apply` 0 rejet), `go generate` (gui.files.go **5 821 220 octets — bit-identique à la taille déclarée dans install-build.json**), `go build`, instance embarquée servie sur :8384, seed complet (2 instances éphémères), login, scans axe, verify, sondes, probes manuels.
- Instance vanilla : clone propre @SHA construit et seedé en parallèle pour rejouer la baseline réelle.

## Rejeu vs lecture — chiffres

| Axe | Worker | Rejeu auditeur | Δ |
|---|---|---|---|
| baseline-public | 3 règles / 6 occ | 3 règles / 6 occ | **identique** |
| baseline-auth | 16 règles / 1157 occ / 46 pages | 16 règles / 1157 occ / 46 pages | **identique** ; ±1–2 occ par état sur 3 règles (landmark-one-main, page-has-heading-one, region) — dérive de contenu dynamique, familles inchangées |
| final-public | 0 viol / 0 err | 0 viol / 0 err | identique |
| final-auth | 0 viol / 0 err / 213 inc / 46 pages | 0 viol / 0 err / 213 inc / 46 pages | **identique** ; scopeHash `54bb51d7…` égal des deux côtés ; 39/46 états aux compteurs d'incomplets bit-exacts, 7 états ±1–2 |
| verify.mjs | 26 PASS / 0 FAIL / 1 N-A | **26 PASS / 0 FAIL / 1 N-A** (sur MES rapports et MON instance) | identique |
| eval-final.mjs | 1163 → 0 | **1163 → 0** (baseline vanilla auditeur vs final patché auditeur) | identique |
| sondes incomplets | 213 items → 0 CONFIRMED_VIOLATION | rejouées sur mon rapport : **213 items, 0 CONFIRMED_VIOLATION** | identique |
| install-build | clone+apply+generate+build → 0 viol | pipeline entier refait par l'auditeur (build propre servi en embed, rescan 46 pages) : 0 viol | confirmé |
| provenance.json | 35 fichiers hashés | 34/35 OK ; **manifest.json : sha256 déclaré ≠ réel** (hash périmé — wart, cf. §warts) | 1 écart |
| bugs amont | localChangedHeading() indéfinie ; for=restoreVersionDate ; theme.css 304 | les 2 premiers confirmés dans la source vanilla (fonction appelée jamais définie ; `for` ≠ `id` réel) ; le 304 theme.css corroboré par le workaround waitThemeApplied nécessaire au rejeu du thème sombre | confirmé |

## Lecture du patch (19 fichiers, +254/−111)

Pas de triche : aucun `aria-hidden` ajouté sur du contenu utile, aucun `display:none`/`visibility:hidden` pour masquer une violation, aucune occlusion. Les correctifs sont réels : `<main>` et cascade de titres, `role="dialog"`+`aria-modal`+`aria-labelledby` injectés par modalDirective (le `title.id` est réellement posé), retrait d'`aria-expanded` des CIBLES Bootstrap collapse (bug Bootstrap 3.4 — l'attribut reste sur les contrôles), `for`/`id` et aria-labels sur selects/inputs, couleurs (a #1d6fa5, text-warning #745e1e, etc.), push `marginTop` du contenu quand un dropdown navbar est ouvert (vraie correction d'occlusion, pas un masquage). La fonction `localChangedHeading` implémente l'appel qui rendait `{{undefined}}` en amont — vraie correction, pas un contournement.

## Findings numérotés (résiduels — hors périmètre axe mais vérifiés en live)

1. **[2.1.1 Keyboard — résiduel vivant]** Accordéon `#advancedAccordion` (modale Advanced Settings) : le patch a converti `role="tab"` → `role="button"` sur `.panel-heading`, mais `tabindex="0"` reste sur le `<h4>` interne, sans handler clavier. Rejeu auditeur : focus h4 → **Entrée n'ouvre pas, Espace n'ouvre pas, clic ouvre** (mesuré : afterEnter=0, afterSpace=0, afterClick=1). ~8 en-têtes de section concernés (GUI, Options, LDAP, …). Élément role=button inatteignable au clavier — échec WCAG 2.1.1 persistant (défaut amont non corrigé, sémantique role=button qui promet une opérabilité absente). Invisible pour axe ; trouvé par éprouve manuelle des modales.
2. **[1.4.1 link-in-text-block — résiduel limite]** Les liens "Help" en position adjacente de label (`<label>…</label>&emsp;<a target="_blank">…Help</a>`, ex. `#folder-versioning`) échappent au sélecteur du patch (`.modal-body p > a`, `.small > a`, `ul li > a` → underline). Mesuré en live : pas de souligné, `#1d6fa5` vs `#222` = **2.93:1 < 3.0**. Borderline (seuil 3:1 + contexte discutable — lien d'action plus que lien dans un bloc de texte), mais la classe est celle que le cycle visait à corriger et les 12 items restent sans traitement. Les autres positions (pleine documentation dans `<p>`) sont bien soulignées.
3. **[duplicate-id-aria — latent non corrigé]** `#editDevice` rend 3 `share-template` à `id=""` → 3 `input#sharedwith-` + 3 `label[for="sharedwith-"]` dans le même document (mesuré). Actuellement `display:none` (rows masquées) → axe reste en `incomplete`, pas de violation active — mais le défaut persiste tel quel, exactement la forme flaggée en baseline. Devient une violation active dès que ces lignes s'affichent. Bonus : 2e input par share-template avec `id=""` (checkbox encryption) — attribut id vide, autre défaut dormant.
4. **[couverture de sonde — trous]** `incomplete-probes.mjs` strippe `[state:x]` de l'URL et ne rejoue pas le setup : 124/213 items classés N-A « élément absent au rejeu » sans jamais être re-mesurés dans leur état ; `link-in-text-block` (12) et `th-has-data-cells` (1) n'ont aucune sonde implémentée. Le claim « 0 violation cachée » est vrai pour axe et pour les items réellement mesurés, mais ces trous existaient : c'est ma propre sonde étatée qui a trouvé les findings 1–3. Le claim reste donc recevable, à condition de noter qu'une part des incomplets n'a pas été éprouvée dans son état d'origine.

## Warts

- **provenance.json** : sha256 de `manifest.json` périmé (`de4d1762…` déclaré vs `b189c21e…` réel) — le manifest a été édité après génération de la provenance, jamais re-hashé. 34/35 fichiers OK. Pas de contenu suspect détecté (le manifest réel correspond à l'exécution observée), mais le contrôle d'intégrité perd un point.
- **`seed.sh`** : hardcode le GUI de st2 sur :8484 — si l'instance auditeur écoute déjà :8484, st2 sort en « too many restarts » et le seed échoue silencieusement à moitié (st1 seedé, pending entries absents). Le port du GUI auditeur doit éviter 8484/8485. Coût : un re-seed.
- **`duplicate-id`/`sharedwith-` + `id=""` dormants** (cf. finding 3) et dérive ±1–2 d'incomplets par état entre runs (contenu dynamique — attendu, documenté).

## Ce que le verdict signifie

- **CONFIRMED** porte sur : baseline et final reproductibles à l'occurrence près (1157/1157, 213/213 incomplets, scopeHash identique), pipeline install-build entièrement rejoué (build embed → 0 viol), verify/eval/sondes rejoués sur les artefacts auditeur avec les mêmes sorties, patch sain (pas de masquage), bugs amont documentés confirmés dans la source.
- Les findings 1–3 sont des résidus réels de la conformité WCAG (un échec 2.1.1 vivant, un manque 1.4.1 limite, un duplicate-id dormant) — ils ne contredisent pas les claims axe du worker, qui sont tous vrais, mais ils limitent la portée du « 0 violation » : c'est « 0 violation axe sur 46 pages », pas « produit conforme ».
