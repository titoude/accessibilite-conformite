# Verdict auditeur — cycle 7 : usememos/memos

Auditeur : session indépendante (devin-15ad4322), artefacts du cycle relus et
rejoués sur machine propre (Go 1.27.1, node 24.19.0, pnpm 11.0.1, playwright
1.63.0, axe-core 4.13.0). Dépôt rejoué au commit épinglé
`0d989707f82c33f74bb852edd8965ec88fcf041b`.

## Verdict : PARTIAL — inchangé après re-audit des artefacts v2

Le **score axe v2 se reproduit à l'identique** et le patch est sain, mais **trois
éléments de preuve déclarés dans results.json ne se reproduisent pas sur les
artefacts v2 livrés** : `verify.mjs 12/12` (→ 11/12), `pnpm_lint PASS` (→ échec
Biome), `pnpm_test 1772/1772` (→ 1726/1772). Voir findings.

---

## Rejeu v2 (artefacts actuels — patch-v2.diff, commit bbf3966)

| Étape | Résultat |
|---|---|
| sha256 patch-v2.diff vs `.sha256` + provenance.artifact_hashes | `26e7c673…` **identique** |
| `git apply` sur checkout propre | propre, 45 fichiers (v1 + `Home.tsx`, `MemoDetail.tsx`, `en.json`) |
| Audit verbatim manifeste v2 (`--urls /,/explore,/archived,/attachments,/inbox,/calendar/2026/10,/map,/views,/setting,/about,/memos/3sKy…,/?creator=admin --states all --wait-for h1`) | **exit 0, 0 violation, 15 scénarios, 106 incomplets** |
| scopeHash / statesHash vs final-v2-scope.json | `240ca986…` / `ce3ef54a…` **identiques**, zéro diff page par page |
| verify.mjs | **11/12** — `FAIL h1 unique sur /` (2 h1 : structurel `Home` + h1 markdown du mémo `# Test memo`) |
| eval-final.mjs | **6/6 PASS** |
| install-build v2 (clean) | install frozen-lockfile OK ; **pnpm lint FAIL** (`MemoDetail.tsx` import `useTranslate` non trié — organizeImports) ; **pnpm test 46 échecs** (`common.sidebar` absent des 45 locales + i18n-locale-search) ; **pnpm build PASS 9.08 s** |
| Finalité du correctif v2 | **prouvée** : avec seed `Test memo` (sans `#`), `/` a exactement 1 h1 sr-only → score 0 violation indépendant du contenu. Les deux majors du verdict v1 sont résolus au niveau axe. |

## Rejeu v1 (historique — patch.diff, verdict initial)

| Étape | Résultat |
|---|---|
| sha256 patch.diff | `b4adbb95…` identique |
| Audit verbatim provenance.json | exit 0, 0 violation, 14 scénarios — mais **uniquement après reconstitution du seed réel** (`# Test memo` + `?memoId=` non documentés) |
| Baseline vanilla (:3002) | 157 occ / 8 règles / 151 incomplets — distribution règle-par-règle identique |
| verify / eval / install-build v1 | 12/12, 6/6, lint+test+build PASS |
| Patch v1 relu en entier (817 lignes) | sain : corrections réelles, aucun masquage |

## Findings

1. **[majeur — v2] results.json contient des PASS obsolètes non reproduits sur
   patch-v2.** `verif_independante.verify.mjs: "12/12"`, `build.pnpm_lint: PASS`,
   `build.pnpm_test: "1772/1772"` datent de v1 et restent présentés sans scoping
   versionné. Sur v2 : verify 11/12, lint FAIL, test 1726/1772. Le rescan v2 a
   rejoué axe mais pas les vérifications indépendantes ni la chaîne
   install-build. Correctifs triviaux : trier l'import `useTranslate`, ajouter
   `common.sidebar` aux 45 locales (le test exige la couverture complète des
   clés EN), et soit retirer le `#` du seed (recommandé : le h1 structurel rend
   le score indépendant du contenu et `h1 unique` repasse à 12/12), soit
   assouplir verify.mjs (`>= 1`).

2. **[mineur — v2] seed toujours incomplet : `params: aucun` est faux.** L'UID
   épinglé `3sKybHLtPqRM8H4GfgFdJF` (requis par l'URL `/memos/:uid` auditée)
   n'existe que si le POST reçoit `?memoId=…` — le paramètre reste non
   documenté ; sans lui la route scanne en fait un NotFound.

3. **[majeur — v1, résolu en v2] seed sous-spécifié.** Le manifeste v1 disait
   `1 memo 'Test memo'` ; la reproduction exigeait le h1 markdown (`# `) deviné.
   v2 documente `content:'# Test memo'` et ajoute des h1 sr-only structurels sur
   Home (couvre /, /explore, /?creator=*) et MemoDetail — vérifié : le score ne
   dépend plus du contenu.

4. **[majeur — v1, résolu en v2] famille `page-has-heading-one` résiduelle** sur
   les routes timeline — couverte par les h1 structurels v2.

5. **[mineur — v1, résolu en v2]** auto-verdict retiré de results.json ;
   contradiction `/map` levée (réintégré au périmètre, scanné 0 violation
   vérifié) ; `aria-label` sidebar désormais i18n (`common.sidebar`) — mais voir
   finding 1 : la clé n'existe que dans `en.json`.

6. **[mineur]** La plupart des locales recevront `common.sidebar` en fallback
   anglais ; acceptable en attendant la passe de traduction requise par
   `locale-resources.test.ts`.

## Conclusion

**PARTIAL** — conforme au protocole : les éléments de preuve déclarés doivent se
reproduire. Le cœur (score axe 0 × 15 scénarios, hashes intègres, patch sain et
désormais indépendant du contenu) est solide et les corrections v1→v2 sont
réelles ; mais le paquet de preuves v2 n'est pas cohérent avec lui-même (trois
PASS déclarés non reproduits + un paramètre de seed omis). Chemin vers
CONFIRMED : les quatre correctifs triviaux du finding 1 + `memoId` dans le
manifeste, puis rejeu verify + install-build — attendu trivial (<30 lignes).
