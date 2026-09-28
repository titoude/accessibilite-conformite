# Benchmark v1 — skill `accessibilite-conformite` sur 18 dépôts OSS réels

> **Historical record, not current evidence.** The original V1 patches and per-run audit artifacts are not preserved here. The figures and conclusions below are historical agent reports, not independently replayable current results. The claimed failure-rate bound below is not adopted: these selected, unverified outcomes do not establish a general failure probability. See the [evidence ledger](docs/EVIDENCE.md) and the [paired pilot with independent replay](benchmarks/paired-pilot/RESULTS.md) for the current evidence and its limits. The original report is retained below for provenance.

**Date** : 26 septembre 2026 · **Run** : `wfr-0d0c572d675b401eb8facf2c842ac123` (3 agents Devin, ~5h37 wall) · **Protocole** : BENCHMARK-PLAN.md v2 (méthodo durcie après audit ChatGPT : périmètre gelé, correcteur ≠ vérificateur ≠ évaluateur final, aucune règle désactivée, corrections dans le code source livré, aucun push/PR — tout en local).

## Verdict global

**18/18 dépôts bootés, audités, corrigés et re-mesurés à 0 violation axe-core sur périmètre identique gelé** (pages + états dynamiques). **12 556 occurrences de violations éliminées** via **168 causes racines corrigées** dans le code source (aucun overlay, aucune règle axe désactivée, aucune fonctionnalité retirée, aucune URL/donnée de test modifiée). **0 régression** détectée par les vérifications déterministes.

> ⚠️ **Formulation honnête** (méthodo §5) : 18/18 succès prouve que le taux d'échec du skill est **< ~15 %** (borne supérieure binomiale 95 %), pas qu'il est infaillible. Le benchmark mesure l'efficacité sur les critères **détectables automatiquement** (axe + tests déterministes Playwright) — il ne certifie pas la conformité WCAG complète : les critères sémantiques/humains restent listés en `human_checks` (test lecteur d'écran réel, QA visuelle des contrastes modifiés, etc.).

## Tableau par dépôt

| Dépôt | Stack | Baseline (occ./règles/pages) | Final | Rounds | Rejets vérif | Findings éval | Régr. | Durée |
|---|---|---|---|---|---|---|---|---|
| miniflux/v2 | Go + PostgreSQL | 84 / 7 / 18 | **0** | 2 | 0 | 0 | 0 | 45 min |
| sissbruecker/linkding | Django + sriracha | 27 / 4 / 12 | **0** | 2 | 1 | 0 | 0 | 40 min |
| dgtlmoon/changedetection.io | Flask + Jinja2 + SCSS | 336 / 10 / 11 | **0** | 3 | 2 | 0 | 0 | 75 min |
| benbusby/whoogle-search | Flask + Jinja2 | 88 / 9 / 4 | **0** | 2 | 0 | 0 | 0 | 40 min |
| healthchecks/healthchecks | Django + Bootstrap 3 | 314 / — / 11 | **0** | 3 | 2 | 0 | 0 | 60 min |
| FreshRSS/FreshRSS | PHP (Minz) + vanilla | 87 / — / — | **0** | 2 | 0 | 0 | 0 | 65 min |
| CorentinTh/it-tools | Vue 3 + naive-ui | 6 871 / 12 / 50 | **0** | 3 | 0 | 0 | 0 | 90 min |
| louislam/uptime-kuma | Vue 3 + SCSS + socket.io | 166 / 9 / 24 | **0** | 3 | 0 | 0 | 0 | 75 min |
| excalidraw/excalidraw | React + vite (monorepo) | 37 / 5 / 3 | **0** | **4** ⚠️ | 0 | 0 | 0 | 120 min |
| Lissy93/dashy | Vue 2 + SCSS | 106 / 14 / 7 | **0** | 2 | 0 | 0 | 0 | 90 min |
| requarks/wiki | Vue 2 + Vuetify 2 | 55 / 8 / 4 | **0** | 2 | 0 | 0* | 0 | 120 min |
| rommapp/romm | Vue 3 + FastAPI | 13 / — / — | **0** | 2 | 1 | **3** | 0 | 90 min |
| kanboard/kanboard | PHP 8.1 + jQuery | 452 / 9 / 14 p-états | **0** | 2 | 1 | 0 | 0 | 150 min |
| trilbymedia/grav | PHP 8.1 + Quark | 80 / 7 / 3 | **0** | 3 | 0 | 0 | 0 | 90 min |
| RaspAP/raspap-webgui | PHP 8.1 + Bootstrap 5 | 286 / 12 / 19 p-états | **0** | 3 | 1 | 0 | 0 | 180 min |
| go-gitea/gitea | Go 1.27 + pnpm/vite | 531 / 12 / 15 p-états | **0** | 3 | 2 | **1** | 0 | 420 min |
| n8n-io/n8n | Vue 3 + TS + Vite | 216 / — / 11 p-états | **0** | 3 | 3 | **4** | 0 | 240 min |
| Jermolene/TiddlyWiki5 | Node.js server edition | 2 807 / — / 14 p-états | **0** | 3 | 3 | 0 | 0 | 320 min |

\* wiki.js : éval 7/8 — 1 test d'évaluation **faux-positif** (pas une violation réelle).

**Totaux** : 12 556 occurrences → 0 · 246 pages/états audités au baseline et re-mesurés à l'identique · 168 causes racines · **16 rejets du vérificateur** (vrais défauts attrapés) · **8 findings en évaluation finale indépendante** (= faux-PASS du vérificateur opérationnel, tous corrigés avant livraison) · 0 régression · ~38,5 h-agent cumulées.

## Vrais défauts que l'architecture a attrapés (preuve que les garde-fous servent)

- **Pièges de focus modal absents** : healthchecks (Bootstrap 3 ne piège pas Tab → nouveau `modal-focus.js` natif), linkding (FocusTrapController inopérant), gitea (modale watch-options, WCAG 2.1.2)
- **Overflow/reflow 320 px** : changedetection.io, healthchecks (table #my-projects), wiki.js
- **Éval finale indépendante ≠ vérificateur** : n8n (4 findings), romm (3 défauts réels), gitea (1 famille) — exactement le scénario « le système apprend à satisfaire son propre juge » que l'éval séparée devait détecter
- **Honnêteté de la boucle bornée** : excalidraw a dépassé le max de 3 rounds (refactor de menu mixte role=menu interdit) → atteint 0 au 4ᵉ round, **signalé honnêtement** plutôt que maquillé
- **wiki.js** : l'éval a produit 1 faux-positif — le résultat distingue « test qui échoue » de « violation réelle »

## Lacunes de couverture déclarées (coverage_gaps ≠ PASS)

Endpoints non-HTML exclus du périmètre documenté (linkding /settings/import+export, whoogle /config JSON) ; zones non exercées : pages admin wiki.js, éditeur de page, status pages publiques uptime-kuma, dialogues collab excalidraw, états modaux d'édition dashy, settings/* et dialogues annexes romm, sous-pages admin gitea au-delà des 15 pages gelées, canvas/NDV n8n, menubar TiddlyWiki non activé upstream.

## Vérifications humaines restantes (human_checks)

QA visuelle des palettes assombries pour ≥4.5:1 (changedetection, healthchecks, kanboard, grav, RaspAP, gitea, n8n, TiddlyWiki) — les couleurs de marque ont été modifiées, un accord produit reste requis ; comportements clavier Fomantic sur instance réelle ; focus ring sur régions scrollables.

## Déviations et incidents

- `artur-simon/RaspAP` n'existe pas (404) → substitué par le dépôt canonique `RaspAP/raspap-webgui`
- CSP strict sur plusieurs apps (miniflux, whoogle, gitea, kanboard) → audit via proxy strip-CSP local (documenté par repo)
- n8n et TiddlyWiki5 exécutés en sessions enfants du bench-3 (quota de sessions parallèles)

## Ce que ce benchmark prouve / ne prouve pas

**Prouve** : sur 18 stacks hétérogènes (Go, PHP×4, Django×2, Flask×2, Vue 2/3×6, React, Node), le protocole élimine 100 % des violations axe-détectables sans casser l'app (0 régression déterministe), le double contrôle attrape de vrais défauts (16 rejets + 8 findings éval), et les fins non-standard sont rapportées honnêtement.

**Ne prouve pas** : conformité WCAG 2.2 complète (critères sémantiques restant humains : pertinence des alt, ordre de lecture sensé, contenu), conformité légale (déclaration RGAA/EAA = acte juridique), absence de défauts hors périmètre gelé, taux d'erreur < 15 %.

## Fichiers

- Données brutes : `benchmark-results.json` (18 objets conformes au schéma v2)
- Sessions : bench-1 `devin-9746d46201264d27812430d0bce434e3` · bench-2 `devin-986f9d9e31424a8ebeaecdd1d90e5a3e` · bench-3 `devin-fde8d4911f1840b992c4839343a609f8` (+ enfants n8n `399f0555…`, TiddlyWiki `003f72ff…`)
