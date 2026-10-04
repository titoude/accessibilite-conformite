# Verdict auditeur indépendant — cycle 7 : usememos/memos @ 0d98970

**Verdict : PARTIAL** (patch sain et score axe reproductible — mais seulement après reconstitution d'un seed sous-spécifié ; une famille de violations résiduelle non masquée mais non corrigée subsiste)

Auditeur : session Devin 15ad4322 (cycle boucle-continue, branche `devin/boucle-continue`)
Date : 2026-10-04 · Méthode : rejeu intégral des preuves sur machine propre (Go 1.27.1, node v24.19.0, pnpm 11.0.1, playwright 1.63 — versions conformes au manifeste), outils du cycle inchangés.

## Ce que j'ai rejoué moi-même

| Étape | Résultat |
|---|---|
| sha256 patch.diff | OK — `b4adbb95…484ea` = patch.diff.sha256 = provenance.json |
| sha256 scope-compare.json / results.json | OK — conformes à provenance.json (4/4 artefacts intègres) |
| `git apply` sur clone propre @ 0d989707 | OK (42 fichiers, +90/−77) |
| `pnpm install --frozen-lockfile` (checkout propre) | PASS |
| `pnpm lint` (tsc --noEmit --skipLibCheck + biome) | PASS — 694 fichiers (= install-build.json) |
| `pnpm test` | PASS — **1772/1772** (= install-build.json) |
| `pnpm build` | PASS — 9.28 s rolldown-vite (déclaré 9.37 s) |
| Boot backend `go run ./cmd/memos --port 8081 --data <dir>` | PASS — Memos 26.10, sqlite auto, access mode private |
| `pnpm dev --port 3001` + `POST /api/v1/users` admin + login.mjs | PASS — auth.json (cookie `memos_refresh` + localStorage) |
| `audit.mjs` commande verbatim de provenance.json | **0 règle / 0 occ / 0 erreur / 14 scénarios / 102 incomplets** — conforme à final-report ; scopeHash `8d171d58d336…` et statesHash `ce3ef54a…` **identiques** |
| `verify.mjs` | **12/12 PASS** |
| `eval-final.mjs` | **6/6 PASS** (rescan axe 4 routes : 0/0/0/0) |
| Baseline rejouée sur worktree VANILLA (:3002, même seed) | **8 règles / 157 occ / 151 incomplets / 15 scénarios** — distribution règle-par-règle identique au rapport livré |

## Vérifications manuelles (hors outils du cycle)

- **`/memo-filters`→`/views` : honnête.** `memo-filters` absent de `routeConfig` (`web/src/router/index.tsx`, `path:"*"` → `NotFound`), `ROUTES.VIEWS="/views"` confirmé dans `routes.ts`. Le NotFound a bien reçu un h1 dans le patch.
- **`/map` post-patch : 0 violation / 1 incomplet** (sonde axe hors runner) — sa sortie du run final ne masque aucune violation résiduelle ; ses violations baseline (meta-viewport, region, contrast) étaient couvertes par les fixes globaux.
- **Patch sain — lecture intégrale (817 lignes).** Aucune triche : pas de `display:none`, pas de suppression DOM, pas d'assertion axe neutralisée. Composition : token `--muted-foreground` oklch 0.5559→0.47 + ~46 variantes alpha `/NN`→solide (contrastes réels, texte assombri), backdrop focus-mode `div`→vrai `<button>` (corrigé aria-prohibited-attr + clavier gratuitement), `EditorView.contentAttributes` aria-label (API CM canonique), wrapper sidebar `role=complementary` englobant la poignée, h1 sr-only i18n (attachments/calendar/setting) + h1 NotFound, `th` vide→span sr-only, h3→h2/h4→h3 sur Settings, tests repo réalignés sur le nouveau markup.

## Findings

1. **[majeur — reproductibilité] Le score final dépend d'une propriété du seed absente du manifeste.** Le manifeste déclare `1 memo 'Test memo'`. En lecture littérale (contenu `Test memo` sans markdown), mon rejeu de la commande de provenance donne **4 occurrences `page-has-heading-one`** (/, /explore, /memos/:uid, /?creator=admin) **+ 3 erreurs de scénarios** — les trois states échouent tous sur `waitForSelector('h1')` car aucun h1 n'existe dans le DOM — et `verify.mjs` échouerait aussi (« h1 unique sur / » ⇒ count=0). La reproduction exacte (0×14, 102 incomplets, hashes identiques) n'apparaît qu'avec un mémo `# Test memo` : le h1 vient du **rendu markdown du mémo** (`H1:Test memo`), pas de la page. Il a fallu en plus découvrir le paramètre `?memoId=` de `POST /api/v1/memos` pour recréer l'UID épinglé `3sKybHLtPqRM8H4GfgFdJF` — non documenté dans le manifeste.
2. **[majeur — couverture] `page-has-heading-one` résiduel réel sur les pages du flux.** Le patch ajoute h1 sr-only sur /attachments, /calendar, /setting et NotFound — les pages flaguées en baseline — mais **ni vanilla ni patché n'ont de h1 structurel sur / (Home), /explore, /memos/:uid, /?creator=admin**. Le PASS axe y dépend du contenu utilisateur ; un flux sans titre markdown (mémo texte simple — cas courant pour des micro-notes —, vue filtrée, compte neuf) présente la violation. La vague h1 a corrigé exactement ce que la baseline voyait, et la baseline était elle-même masquée par le seed.
3. **[mineur — procédure] `results.json` porte `"verdict": "CONFIRMED"`** — auto-verdict du worker, contraire à la recommandation intégrée n°1 (« le verdict appartient à l'auditeur ; le worker n'écrit que des mesures »).
4. **[mineur — périmètre] `/map` : déclaration contradictoire.** Listé dans `manifest.scenarios.routes` ET dans `horsPerimetre` ; scanné en baseline (~5 occ des 157), absent du run final sans entrée dans `substitutions` — `identique_sauf_substitutions:false` le signale honnêtement, et ma sonde confirme 0 violation post-patch, donc pas de masquage, mais la ligne du manifeste prête à confusion.
5. **[mineur — patch] `aria-label="Sidebar"` en dur** (non i18n) alors que le patch passe par `t()` partout ailleurs — cosmetic.
6. **[info] Incomplets finaux = 102, identiques au rapport** — triage plausible (variantes alpha externes non mesurables, aria-controls dynamiques base-ui, focus guards `data-base-ui-focus-guard`).

## Conclusion

Le score « 157→0 » est **réel et reproductible sous les conditions effectivement utilisées** — j'ai reproduit la baseline à l'occurrence près (157, même distribution de 8 règles) et le final exactement (0 violation, 102 incomplets, hashes identiques). Le patch est sain : les corrections sont réelles, ciblées et testées (1772/1772, lint, build sur checkout propre).

Mais le paquet de preuves livré **ne se rejoue pas tel quel** : le seed documenté produit 4 violations et 3 scénarios en erreur ; il faut inférer `# Test memo` et le param `memoId` pour reconstituer l'environnement — le même défaut que le cycle 6 (Tandoor, PARTIAL). Et contrairement au cycle 6, le seed ne conditionne pas qu'un compte d'occurrences : il masque une famille de violations entière (h1 de page absent sur les routes du flux) que le patch n'a pas corrigée.

**PARTIAL.** Pour CONFIRMED : figer le seed (`content: "# Test memo"` explicite + `memoId` dans le manifeste) ou ajouter un h1 sr-only structurel sur Home/Explore/MemoDetail puis re-scanner ; retirer l'auto-verdict de `results.json`.
