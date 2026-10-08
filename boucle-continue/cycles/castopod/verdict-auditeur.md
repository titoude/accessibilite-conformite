# Verdict auditeur — cycle 50 : ad-aures/castopod @12720055b475d6d27c9e1e9f9053d0fa491c061c (v1.15.5)

**Auditeur** : devin-4a66e5a12b134189a8597fac47665367 (session indépendante)
**Date** : 2026-10-08 · **Verdict** : **CONFIRMÉ avec réserves**

Rejeu intégral zéro-confiance : MA MariaDB 11.4, MON seed (`tools/seed.sh` rejoué —
podcast=1 episode=1 page=1 person=1 sur mes instances), MES ports
**:9180 patché / :9190 vanilla / :9181,:9191 db**, clone propre à moi @SHA pinné.
Aucune assertion worker prise pour argent comptant ; chaque claim éprouvé par exécution.

---

## 1. Intégrité du patch (claim : sha256 b25be673…, 30 f, +133/−53)

| Vérification | Résultat |
|---|---|
| `sha256sum patch.diff` | `b25be6733edf0e5b8e066a28ff5e12139ad444093a3cb035d4ef9fc125ad0fac` — **identique** à `patch.diff.sha256` |
| `git apply --check` sur clone vierge @12720055 | **0 rejet** |
| `git apply --stat` + recomptage manuel (leçon 39) | **30 fichiers, +133/−53** — conforme (163 '+' − 30 entêtes, 83 '−' − 30 entêtes) |
| 695 lignes du diff relues hunk par hunk | tout le patch est sur des sources réelles (php/ts/css), aucun artefact build |

## 2. install-build verbatim → rescan (claim : 0 viol/0 err, 25 auth + 10 public)

Recette exécutée verbatim : clone @SHA + `git apply` + `composer install` +
`pnpm install` + `pnpm build` (vite manifest régénéré) + `tools/boot.sh` (maria:11.4,
`php spark serve` sous cp50-php:8.2) + `seed.sh` + `login.mjs` + purge triple cache
**avant chaque rescan** + `audit.mjs` tel que manifest.auditCommands.

| Scan auditeur | Résultat | Claim worker |
|---|---|---|
| final-auth (22 urls + 3 états) | **0 viol / 0 err / 127 incomplets** | 0/0 (194 inc) |
| final-public (9 urls + public-sidebar-390) | **0 viol / 0 err / 28 incomplets** | 0/0 (28 inc) |

**0 violation axe 4.14 reproduit à l'identique** — et ce sur MON seed (ids différents du
worker), donc le résultat ne dépend pas du seed précis. Les comptes incomplets varient
naturellement (axe 4.14 bg-sampling contextuel).

## 3. verify / eval / vanilla / sabotage

| Claim | Rejeu auditeur |
|---|---|
| verify 20/20 | **18/19 OK sur mon seed** (1 FAIL `button-name: more-dropdown` — 0 bouton sur /podcasts/4 inexistant ; 1 N-A `publication pill` — même page morte). Voir **F4**. |
| eval 10/10 (2 N-A) | **10/10 OK, 2 N-A** reproduit exactement (skip-link + aria-live) |
| vanilla → FAIL attendus | **12/19 FAIL verify** incl. noms exacts : `2.5.3: bouton listes aria-label=More texte=2026`, `palette pine = 174 100% 29%`, nested-interactive, target-size, landmark-unique, dlitem, tooltip, chart aria-hidden ; **1/10 FAIL eval** (`dropdown notifications: Escape ferme` — discriminant exact du fix Dropdown.ts) |
| sabotage → FAIL nommé | Re-ajout de `aria-label="Common.more"` sur `episode-lists-dropdown` dans `themes/cp_app/podcast/episodes.php` + purge → **FAIL nommé `2.5.3: bouton listes aria-label=More texte=2026`** ; revert + purge → re-disparition du FAIL |

Baseline vanilla (mon seed correct, scope COMPLET 25/25) : **auth 313 occ/11 règles +
public 23 occ/6 règles = ~336 occ** — mêmes 14 règles que le claim. Le « 235 » livré
sous-compte ~100 occ : voir **F1**.

## 4. Sondes incomplets (claim : 243 → 66 conf/0 NC/177 N-A)

`incomplete-probes.mjs http://localhost:9180 auth.json --reports …` sur MES rapports :
**155 sondés → 66 OK / 0 NON-CONFORME / 89 N-A**.

- **66 OK** reproduit exactement — toutes mesures live `pseudo bg composite ratio=7.77`
  (h1/legend blanc sur ::before blanc-90 → le fix `bg-accent-base` plein mesuré **7.77:1**
  là où le worker claimait 1.07→~5.4:1 sur le variant /75-gradient ; direction et passage
  confirmés).
- **0 NC** : les 4 NC historiques tiennent.
- N-A : 46× texte-sur-image/scrim (honnête — non calculable sans pixel), 39× sélecteur
  non résolu (**F5** : l'outil ne rejoue jamais les états de page), 4× listbox Choices.js
  vide au repos (honnête).
- Mesure live indépendante du pill : **Scheduled `text-red-800`/`bg-red-50` = 7.60:1**,
  **Published `text-pine-800` = 8.16:1** sur `/cp-admin/podcasts/1/episodes` — le badge
  existe bien ; il passait N-A dans verify uniquement via l'id durcodé (F4).

## 5. Triple cache (page_* + vite-manifest + OPCache)

Documenté dans manifest.json (notes boot) ET éprouvé : mon sabotage a nécessité purge
pour apparaître ; le revert + purge a refait passer verify. Sans purge, la page cachée
aurait servi l'ancien rendu — leçon justifiée.

## 6. Chasse

- **Violations introduites** : 0 (mes rescans complets 0 occ, dont
  `label-content-name-mismatch` actif via wcag21a — aucune 2.5.3 nouvelle).
- **Slugs i18n (leçon 43)** : 3 clés ajoutées en `modules/Admin/Language/en/Navigation.php`
  (podcast/episode/main) ; pages rendues contiennent `aria-label="Podcast navigation"` etc.,
  aucune clé brute fuitée dans le HTML ; fallback en CI4 pour autres locales. **OK**.
- **Hors-scope restant** : 0 violation observée dans les 35 scénarios.
- **Cohérence artefacts↔seed-info (leçon 46)** : fichiers commités internellement
  cohérents (urls-auth.resolved.txt /podcasts/4 ↔ seed-info podcast=4 ↔ rapports /4) —
  mais cette cohérence interne recouvre un défaut réel (**F1**).
- **Pureté vanilla (leçon 40)** : marqueurs du patch (`querySelectorAll("[tabindex]")`
  dans le chunk Charts, `role","tooltip"` dans Tooltip-*.js) absents du build vanilla ;
  Colors.php source `29%` vanilla vs `24%` patché ; verify lit 29% sur vanilla live.

## 7. provenance --strict

`rehash-provenance.py cycles/castopod --strict` → **40 empreintes re-hachées,
spot-check 3/3, exit 0**.

---

## Findings

- **F1 — Baseline sur scope troué + `erreurs:0` mensonger.** Le `urls-auth.resolved.txt`
  commité pointe `/podcasts/1*` alors que le seed worker était podcast=4 → 8 pages podcast
  + liens fediverse jamais scannés en baseline (16/25 audités, 9 erreurs dans le rapport
  commité). Pourtant `results.json` affiche `erreurs:0` pour les deux baselines. Baseline
  réelle rejouée par l'auditeur sur seed correct : **~336 occ** (313 auth + 23 public)
  vs le « 235 » du titre. La correction ne change pas le verdict axe (même delta règles,
  final 0 reproduit) mais le chiffre livré est faux et les erreurs sont masquées.
- **F2 — results.json contredit les rapports commités** : 10 erreurs (9 auth + 1 public
  route-404) présentes dans `reports/baseline-*/report.json`, absentes de results.json.
- **F3 — route-404 : exclusion à demi documentée.** Déclarée (STATE `route-404`,
  `expectHttp:404`, ligne « exclu documenté JSON » dans le registre) MAIS le runner refuse
  le corps JSON → **jamais scannée nulle part** (erreur baseline, absente du final).
  L'exclusion est défendable (axe sur `application/problem+json` n'a pas de sens) — à
  consigner comme exclusion assumée, pas comme page « auditée en erreur ».
- **F4 — verify.mjs non portable** : `/cp-admin/podcasts/4/episodes` durcodé → sur tout
  autre seed, `button-name more-dropdown` FAIL + `publication pill` N-A (les deux tests
  pointent la même page morte). Le « 20/20 » n'est vrai que sur le seed du worker. Sur
  /podcasts/1 les éléments existent et passent (pill mesurée 7.60:1).
- **F5 — incomplete-probes ne rejoue pas les états** (`p.state` jamais présent dans les
  pages de rapport) → les N-A « sélecteur non résolu » (39 chez moi, ~126 chez le worker)
  sont des artefacts d'outil, pas des N-A honnêtes ; le compte OK/NC reste fiable.
- **F6 (nit) — dérive pnpm** : manifest déclare 12.10.1, box à 11.21.0 — build OK quand même.

## Conclusion

Claims axe porteurs reproduits : **0 viol/0 err** sur 35 scénarios en install-build
verbatim sur seed indépendant, patch intègre (sha + 0 rejet + recomptage exact), purgé
cache documenté et nécessaire, fixes mesurés live (7.60/7.77/8.16:1), négatifs nommés
reproduits (vanilla 12 FAIL verify + sabotage `2.5.3 bouton listes`), sondes 66 OK/0 NC
conformes, provenance 40/40 propre, aucune violation introduite, aucune fuite i18n.

→ **CONFIRMÉ** au sens du protocole (reproductibilité axe + santé du patch), **avec
réserves F1/F2/F3/F4/F5** à reporter au fixer : baseline à rejouer sur seed correct
(→ ~336 occ) avec results.json aligné sur les rapports (erreurs réelles), route-404
reclassée exclusion assumée, verify.mjs à paramétrer depuis seed-info.json.
