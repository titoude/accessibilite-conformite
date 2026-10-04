# Verdict auditeur — cycle 7 : usememos/memos

Auditeur : session indépendante (devin-15ad4322), artefacts relus et rejoués sur
machine propre (Go 1.27.1, node 24.19.0, pnpm 11.0.1, playwright 1.63.0,
axe-core 4.13.0). Dépôt rejoué au commit épinglé
`0d989707f82c33f74bb852edd8965ec88fcf041b`.

## Verdict : CONFIRMED (artefacts v3 — patch-v3.diff, commit 9cdcf0c)

Le score axe se reproduit à l'identique, le patch est sain (corrections réelles,
aucun masquage), et l'ensemble des preuves déclarées se rejoue avec succès.
Troisième itération d'audit : v1 PARTIAL (seed masquant des h1 manquants),
v2 PARTIAL (PASS v1 obsolètes dans results.json), v3 CONFIRMED.

## Rejeu v3 — tous les éléments déclarés reproduits

| Étape | Déclaré | Rejoué |
|---|---|---|
| sha256 patch-v3.diff | `e77b1a0e…` | **identique** (fichier `.sha256` + provenance `files{}`) |
| `git apply` checkout propre | — | propre, 90 fichiers |
| Audit final-v3 (verbatim manifeste) | 0 violation ×15 scénarios, exit 0, 106 incomplets | **identique** — 15/15 pages, 0 diff violation/incomplete/erreur page par page |
| scopeHash | `240ca986…` | **identique** |
| verify.mjs | 12/12 | **12/12** (seed `Test memo` → 1 h1 sr-only `Home`) |
| eval-final.mjs | 6/6 | **6/6** |
| install-build | lint PASS / test 1772/1772 / build PASS | **lint PASS (694)** ; **test 1772/1772** ; **build PASS 8.99 s** |
| provenance `files{}` | sha256 de tous les artefacts | **tous vérifiés** (patchs, reports, tools, results, manifest) |

## Contrôle des 4 correctifs annoncés (findings v2)

1. `common.sidebar` dans les 45 autres locales — **vérifié** : +1 ligne par
   fichier, traductions réelles (pas de copie anglaise), aucun
   réordonnancement ; `locale-resources.test.ts` repasse à 1772/1772.
2. Ordre d'import `useTranslate` dans MemoDetail.tsx — **vérifié** : biome
   organizeImports PASS.
3. verify.mjs assoupli `===1` → `>=1` — **vérifié** source + exécution 12/12 ;
   le manifeste retire aussi le `#` du seed (double sécurisation : avec le seed
   documenté il n'y a qu'un seul h1 de toute façon).
4. Seed manifeste précisé — **vérifié** : `Test memo` sans `#`, `?memoId=`
   documenté. Le score axe est désormais **indépendant du contenu** : prouvé
   expérimentalement — mémo sans titre markdown → 1 h1 structurel → 0 violation.

## Findings résiduels (mineurs, sans effet sur le verdict)

- `manifest.auditCommands[0]` écrit encore `--out reports/final-v2` — libellé de
  sortie périmé (les arguments urls/états/wait sont corrects ; le rapport v3
  livré est dans `reports/final-v3/`). Cosmétique.
- `reports/final-v3/` ne contient pas de `scope.json` séparé — le scopeHash est
  porté par report.json ; traçabilité préservée.
- Le hash `verdict-auditeur.md` dans provenance `files{}` deviendra obsolète à
  ce commit (auto-référence) — attendu, rehash à la consolidation.

## Historique d'audit

- **v1 (patch.diff)** — PARTIAL : score rejoué exact (0×14) mais dépendant d'un
  seed non documenté (`# Test memo` markdown fournissant le h1) ; famille
  `page-has-heading-one` résiduelle masquée sur /, /explore, /memos/:uid,
  /?creator=admin ; auto-verdict dans results.json ; /map contradictoire.
  Baseline vanilla rejouée : 157 occ/8 règles identique.
- **v2 (patch-v2.diff)** — PARTIAL : h1 structurels ajoutés (majors v1 résolus,
  score rendu indépendant du contenu), /map réintégré honnêtement, mais
  verify 11/12, lint FAIL (import non trié), test 46 échecs (clé i18n dans
  en.json seul) — PASS v1 présentés comme courants.
- **v3 (patch-v3.diff)** — **CONFIRMED** : tout reproduit, cf. tableau.

## Conclusion

CONFIRMED au sens du protocole : reproductibilité du score axe + patch sain.
157 → 0 violations sur 15 scénarios, chaîne d'outils indépendante verte
(12/12 + 6/6), install-build complet PASS, intégrité sha256 de tous les
artefacts. Les corrections s'attaquent aux causes (contrastes de tokens,
landmarks, nommage aria, hiérarchie de titres, viewport zoom) et non aux
symptômes.
