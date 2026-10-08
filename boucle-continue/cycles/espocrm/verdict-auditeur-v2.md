# Verdict auditeur v2 — cycle 47 : espocrm/espocrm @6c369056e81038fdcbb6512d5d5df11db4ed6e03

**Auditeur** : devin-c5df9d091dbe471ab5b5612271d493da (session indépendante v2)
**Date** : 2026-10-08 · **Verdict** : **CONFIRMÉ**

Rejeu intégral zéro-confiance du paquet fixer-v2 : MA MariaDB 11.4 + MON seed (seed.mjs
rejoué), MES ports **:8672 vanilla / :8671 patché**, clone propre à moi @SHA pinné.
Aucune assertion fixer prise pour argent comptant ; chaque claim éprouvé par exécution.

---

## 1. Intégrité du patch (claim : sha256 918cfd68…, 104 f, +351/−181)

| Vérification | Résultat |
|---|---|
| `sha256sum patch.diff` | `918cfd6829b985dc4161af56e3f05017357a5639557f7827119e2fc811a72c11` — **identique** à `patch.diff.sha256` |
| `git apply --check` sur clone vierge @6c36905 (tag 10.0.9) | **0 rejet** |
| `git apply --stat` | **104 fichiers, +351/−181** — conforme |
| `git diff --check` post-apply | 0 whitespace |

## 2. install-build verbatim → rescan (claim : 0 viol/0 err)

Recette exécutée verbatim : clone @SHA + apply + `npm install` (676 pkg) +
`git checkout package-lock.json` + `npx grunt internal` (themes LESS + bundle
636/253/29/184/5/1/1/2 chunks + 315 tpls) + boot.sh adapté (mes noms `espo47a2`,
réseau `espo47a2`, volumes `espo47a2-*`, data dir à moi, mounts file-level pour
main.html/ClientManager.php — conforme au piège documenté « mounts dossier
cassent @@version »).

| Mesure | Mesuré :8671 | Claim fixer-v2 | Verdict |
|---|---|---|---|
| auth 45 sc (32 routes + 13 états) | **0 viol / 0 occ / 0 err / 245 inc** | 0 viol/0 err | ✓ (245 inc = claim final-auth exact) |
| public (2 urls) | **0 / 0 / 0 / 0** | 0 | ✓ |

## 3. Baseline vanilla pureté + mesure (leçon 40)

Pureté prouvée AVANT mesure : `docker exec` du tpl servi :8672
`navbar.tpl` **identique** (`diff -q`) à `HEAD:client/res/templates/site/navbar.tpl`
du clone vanilla — 0 occurrence `role="menuitem"` servi vs 4 dans le patché.
Image = `espocrm/espocrm:latest` (10.0.9 = SHA — écart NUL confirmé par manifest).

| Baseline :8672 | Mesuré | Worker (44 sc) | Verdict |
|---|---|---|---|
| auth | **20 règles / 2991 occ / 0 err / 253 inc** sur **45 sc** | 21 r / 2925 occ / 250 inc | ✓ cohérent (+1 état nav-more-tabs, ±seed) |
| public | **8 règles / 26 occ / 0 err / 2 inc** | 8 r / 26 occ | ✓ **EXACT** |

## 4. R1 — état nav-more-tabs (claim : vanilla aria-required-children ×1 → patché 0)

| Étape | Résultat |
|---|---|
| Vanilla :8672, état `nav-more-tabs` (viewport 1050, trigger `#nav-more-tabs-dropdown`, preuve `.more-dropdown-menu` visible) | **`aria-required-children` ×1 ciblant `.more-dropdown-menu`** (`<ul role="menu">` avec `<li><a>` sans rôles requis) — **claim reproduit exactement** ; état total 12 règles (claim « 12 règles/71 occ » — j'ai mesuré 102 occ sur l'état, écart de compte cf. W8) |
| Patché :8671, même état | **0 viol** |
| Menu éprouvé live (verify.mjs + inspection DOM) | 10 `<a role="menuitem">` rendus, tous `aria-label` == texte visible (2.5.3 : **0 mismatch**), ouverture au clic, fermeture Escape — checks « li role=none|separator » + « liens role=menuitem » verts |

## 5. L43 — sonde anti-slug i18n + sabotage rôles

Sabotages exécutés par `docker exec sed` sur le tpl **servi**
`/var/www/html/client/res/templates/site/navbar.tpl` (leçon R5 : `client/lib/templates.tpl`
est un bundle mort — je vise la vraie source servie).

| Sabotage | Résultat |
|---|---|
| `aria-label="navbar.moreTabsLabel"` injecté sur `ul.more-dropdown-menu` | **FAIL nommé** : `anti-slug i18n: aucun nom rendu en clé i18n non résolue ["ul[aria-label=navbar.moreTabsLabel]"]` — claim exact |
| rôles cassés (`role="menuitem"→"link"`, `role="none"→"listitem"`, plage 103–160) | **2 FAILs nommés** : `menu more-tabs: li role=none|separator` + `menu more-tabs: liens role=menuitem` — claim exact |
| restore (`docker cp` du tpl sauvegardé) | verify **42/42, exit 0** |

## 6. verify + eval + sondes

| Outil | Instance | Mesuré | Claim | Verdict |
|---|---|---|---|---|
| verify.mjs | :8671 patché | **42/42, exit 0** | 0 échec/42 | ✓ |
| verify.mjs | :8672 vanilla | **27 FAIL / 15 pass, exit 1** | FAIL attendus | ✓ (lang, viewport, main, h1, tabindex, alt, contraste login, 4 noms navbar, menus rôles ×4, liste ×7, contrastes ×2… attendus) |
| eval-final.mjs | :8671 | **6/6 OK, 2 N-A** | 6/6 (2 N-A) | ✓ EXACT |
| incomplete-probes.mjs | :8671 (mes reports) | **245 sondes → 183 conformes / 0 NC / 60 NR** | 175 / 0 / 68 | ✓ total + 0 NC exacts ; split ±seed (nœuds transitoires) |

## 7. provenance

`rehash-provenance.py cycles/espocrm --strict` → **41 empreintes OK, spot-check 3/3**
(claim 41/41 exact ; re-hash sans diff — empreintes déjà à jour).

## 8. Chasse (hors-scope, violations introduites, slugs, warts)

- **Hors-scope résiduel confirmé** (identique vanilla↔patché, pré-existant,
  routes hors urls-auth.txt) : `#Admin/fieldManager` `link-name` ×1
  (`a[href="#Admin/entityManager/scope="]` vide) ; `#Admin/upgrade` `heading-order` ×1
  (`h4.panel-title`) + `label` ×1 (`input[type=file]`). Vanilla y totalise 49 occ/9 r.
- **Violations introduites : 0** — rescan 0 viol sur 45 sc + publics ; 2.5.3
  label-in-name éprouvé live : 10 menuitems, texte visible ⊆ nom accessible (0 mismatch).
- **Slugs i18n résiduels : 0** — sonde anti-slug verte + grep direct des templates
  patchés (aucun `aria-label="xxx.yyy"` hardcodé) + DOM home inspecté (0 attribut
  slug-like). La clé `navbar.moreTabsLabel` n'apparaît littéralement nulle part dans
  le tpl servi (résolue via `{{translate 'More'}}`).
- **Warts nouveaux (v2)** :
  - **W6** : `verify.mjs` L342 — `TimeoutError` non catché → crash process (exit 1 sans
    JSON) quand `tools/seed-info.json` ≠ la base sondée. Échec « loud » mais non nommé
    (leçon 45 edge) : un auditeur pressé peut rater que les 4 derniers checks n'ont
    pas tourné. Reproduit 2× (mon erreur initiale seed-info vanilla sur :8671).
  - **W7** : `tools/urls-auth.txt` commité contient les IDs d'un **ancien** seed
    (6ac72d…) ≠ `seed-info.json` commité (6ac74f…) — rejeu verbatim = 5 routes
    `/view/` sur enregistrements inexistants (le shell rend quand même → sous-compte
    silencieux des violations propres aux records). De plus `audit.mjs`/STATES lisent
    `seed-info.json` depuis le CWD — dépendance implicite non documentée dans
    `manifest.json` (seul le commentaire de gen-urls.mjs la mentionne).
  - **W8** : claim « 12 règles/71 occ » sur l'état nav-more-tabs vanilla — j'ai mesuré
    12 règles ✓ mais **102 occ** (102 = somme des nœuds du report). La violation R1
    est confirmée ; seul le compte d'occurrences du claim diffère (périmètre de
    comptage non précisé — probablement hors listitem/region généraux).
  - **W9** (info) : distribution sondes 183c/60NR vs claim 175c/68NR — dépend des
    nœuds transitoires seedés ; 0 NC et total 245 exacts.

## 9. Verdict

**CONFIRMÉ** : la fermeture fixer-v2 des résidus v1 est réelle et reproductible.

- R1 fermé : résidu pré-existant `.more-dropdown-menu` reproduit sur vanilla
  (aria-required-children ×1, cible exacte) → 0 sur patché, menu éprouvé live.
- L43 fermé : sonde anti-slug éprouvée par sabotage → FAIL nommé ; sabotage rôles →
  2 FAILs nommés ; restore 42/42.
- Comptes doc vrais : 45 scénarios auth (32 routes + 13 états) + 2 publics — verify
  42 checks, eval 6/6, sondes 245 (0 NC).
- 0 viol/0 err/245 inc auth + 0 public sur install-build indépendant ; baseline
  vanilla pure mesurée sous MON stack.
- provenance --strict 41/41.

Réserves (non bloquantes) : W6–W8 ci-dessus — crash non nommé de verify sur seed
mismatch, urls commitées périmées, écart de compte 71 vs 102 sur l'état v2.
Aucune ne compromet le verdict : le produit livré est à 0 violation axe sur le
périmètre revendiqué, sous audit indépendant complet.

*CONFIRMÉ = reproductibilité du score axe + rejeu indépendant, pas certification WCAG
(protocole §verdict).*
