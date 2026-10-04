# Audit de rejeu — boucle continue, cycle 2 : actualbudget/actual @2e68845

**Auditeur** : devin-c8e16a745871410ca8dae5916df3fe01 (session indépendante, VM fraîche)
**Date** : 2026-10-04 — artefacts lus sur `titoude/accessibilite-conformite` @ `devin/boucle-continue` (c93f64b)

## VERDICT : CONFIRMED

Exécution complète rejouée de bout en bout : clone upstream au SHA épinglé, `git apply` du patch commité (diff appliqué identique à l'octet près), `yarn install --immutable` PASS, serveur vite :3001, baseline + final rejoués avec audit.mjs v5 (playwright 1.63.0 / chromium-1243 / axe-core 4.13.0 — versions exactes du manifeste), verify.mjs + eval-final.mjs rejoués, build web + typecheck rejoués. **0 violation axe reproduite sur les 6 scénarios du périmètre final.**

## Métriques mesurées (rejeu vs déclaré)

| Mesure | Worker déclaré | Auditeur rejoué | Verdict |
|---|---|---|---|
| Baseline axe | 7 règles / 123 occ / 0 err / 5 scénarios | 6 règles / 393 occ / 1 err / 5 scénarios | écart volumétrique (données démo aléatoires + timing), mêmes familles de règles — voir F5 |
| Final axe | 0 règle / 0 occ / 0 err / 35 incomplets | 0 règle / 0 occ / 0 err / 28 incomplets | **reproduit** |
| verify.mjs | PASS | 10/10 PASS | reproduit |
| eval-final.mjs | 0 finding | 5/5 PASS, 0 finding | reproduit |
| yarn install --immutable | PASS 22s | PASS ~30s | reproduit |
| build @actual-app/web | PASS 34.5s | PASS 21.9s | reproduit |
| typecheck | PASS | 10/10 workspaces PASS | reproduit |
| patch.sha256 / provenance | 58fc0940… | recalculé : 58fc0940… | **cohérent** |
| commit épinglé | 2e68845…96e5 | HEAD = 2e68845…96e5 | exact |

Incomplets axe rejoués : 28, tous de type « indéterminable » (imgNode 23, bgOverlap 3, nonBmp 1, shortTextContent 1) — aucune violation déguisée en incomplete. Déclarés honnêtement dans results.json (`nonCouvert`).

## Anti-triche — résultats

- **CSS `!important`** : aucun ajouté. Les `!important` du patch (useTagCSS) existaient avant ; le patch change la *décision* (ratio WCAG calculé + recherche dichotomique du fond) pas le mécanisme. light.css : 5 tokens assombris, mathématiquement justifiés (navy600 #486581, green800 #0c6b58 confirmés au computed style).
- **Suppression de fonctionnalité** : aucune. Le diff ne retire que `role="main"` redondant (déplacé vers le wrapper englobant → répare landmark-one-main + 75+ region en un point) et les restrictions de zoom du meta viewport (restaure le zoom = gain de fonctionnalité).
- **aria-* décoratifs** : non. Les aria-labels nomment de vrais boutons-icônes ; vérifié empiriquement (0/109 boutons sans nom dans nav+main).
- **title-sur-enfant** : confirmé dans le source original (`<Link><View title={t('Today')}><SvgCalendar/></Link>` — title sur View enfant non-focusable, hors du nom accessible). Fix réel par aria-label sur le Link.
- **Produit modifié pour le harnais** : non — tout le patch est code produit, aucune adaptation au harnais, aucun `aria-hidden`/`axe-ignore`/masquage.
- **INCOMPLETES absorbés** : non — comptés et déclarés, types exclus "bg indéterminable".
- **Scope baseline/final** : hashes distincts, révision **déclarée** dans scope-compare.json. La justification est **vérifiée dans le source** : `/reports` → `navigate('/reports/'+dashboardPages[0].id)` (id data-dépendant, constaté live : redirect vers `/reports/reports`), `/reports/net-worth` = route statique réelle (ReportRouter, NetWorth). Couverture finale ≥ baseline sur chaque route auditée + ajout de l'état `welcome` (expansion, pas rétraction).
- **Thème** : light/dark/midnight séparés ; patch = light.css uniquement, thème sombre déclaré non audité (honnête, thème par défaut auto→light sous headless).
- **h1 masqué** : `styles.visuallyHidden` existe dans component-library — technique légitime, pas un masquage de contenu.

## Findings

1. **[harnais] audit.mjs avec la carte STATES utilisée n'est pas dans les artefacts.** Contrairement aux cycles hedgedoc/nginxproxymanager (tools/audit.mjs commité), le cycle actual ne committe ni tools/ ni audit.mjs — les états n'existent qu'en prose dans states.json, et le code des états *baseline* (statesHash ec832f52…) n'existe nulle part. L'auditeur a dû reconstruire les setups — une dérive de reconstruction est possible.
2. **[doc] scope-compare.json décrit une baseline qui n'est pas l'artefact commité.** La colonne baseline liste des scans directs en erreur (« document final diffère ») alors que reports/baseline/scope.json montre 5 scénarios *audited* via états démo, 0 erreur — le scopeHash cité correspond bien à l'artefact (e77c109c…) mais le texte décrit un run exploratoire antérieur. La conclusion (« couverture finale ≥ baseline ») reste vraie sur l'artefact réel, par chance.
3. **[harnais] verify.mjs et eval-final.mjs contiennent des passes vacuoles** (règle 7 du protocole, ajoutée après ce cycle) : `if (await addBtn.count())` saute silencieusement les checks modale si le bouton est absent — pas de FAIL ni de N-A déclaré. Non déclenché ici (bouton présent, checks exécutés), mais structure non conforme.
4. **[harnais] « focus piégé dans la modale » (attente du manifeste) jamais asserté.** eval-final vérifie noms des contrôles + Escape, mais aucun test de boucle Tab dans la modale (leçon CyberChef #2, postérieure). Couverture réelle < manifeste sur ce point.
5. **[mesure] le « 123 » baseline n'est pas stable.** Mon rejeu : 393 occurrences — le fichier démo (createBudget testMode) génère des données variables et le scan du worker a mesuré des vues partiellement chargées (/accounts : 7 chez le worker vs 147 au rejeu ; /reports : shell de chargement vs redirect+erreur). Le verdict final (0) se reproduit sur les vues complètement chargées — c'est lui qui compte — mais le compte baseline est un plancher, pas une mesure fixe.
6. **[patch, nit] `aria-label="Main navigation"` en dur** dans sidebar/index.tsx alors que MobileNavTabs utilise `t('Mobile navigation')` — incohérence i18n.
7. **[patch, nit] PageHeading** : map route→label incomplète (fallback 'Actual Budget' sur /config-server etc.) — acceptable mais à noter.
8. **[info] desktop-electron** : le worker rapporte un échec gcc aarch64 explicite ; mon run lage l'a laissé « running — incomplete » après l'échec mobile-client (xcodebuild). Même classe hors-périmètre, constat légèrement différent.

## Défauts harnais

- F1 (artefact tools/audit.mjs absent) — le plus important pour la reproductibilité.
- F3 (passes vacuoles verify/eval) et F4 (focus-trap non testé).
- F5 : instabilité de mesure baseline sur données démo aléatoires.

## Défauts patch

- F6 i18n en dur ; F7 couverture route→h1 partielle. Aucun défaut de fond : le patch est minimal, sémantique, et les ratios WCAG sont calculés correctement dans useTagCSS (formules luminance relatives exactes, convergence dichotomique garantie).

## Recommandations → PROTOCOLE-BOUCLE.md

1. **Commiter le harnais complet par cycle** : `tools/audit.mjs` avec la carte STATES figée (comme hedgedoc/npm), ou extraire STATES dans un fichier commité à part. La prose states.json ne suffit pas au rejeu indépendant.
2. **scope-compare.json doit être généré depuis les artefacts** (lire baseline/scope.json et final/scope.json), pas rédigé de mémoire — la colonne baseline doit refléter l'artefact commité, un run exploratoire peut être cité à part.
3. **Rétro-appliquer la règle 7 aux verify/eval existants** : tout check dépendant d'un élément doit échouer ou déclarer N-A quand l'élément est absent (`else check(name, false, 'précondition absente')`).
4. **Focus-trap modale** : ajouter le test de boucle Tab (leçon CyberChef #2) dans eval-final quand le manifeste promet « focus piégé ».
5. **Données démo aléatoires** : documenter que le compte baseline est indicatif — le gate de comparaison doit porter sur les familles de règles et le final=0, pas sur l'entier baseline. Si l'app offre une seed déterministe, l'utiliser.
