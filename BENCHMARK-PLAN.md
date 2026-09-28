# Benchmark v2 — validation du skill `accessibilite-conformite` à grande échelle

*Révision après relecture externe : matrice de normes corrigée, méthodologie durcie (évaluation finale indépendante, périmètre gelé, faux PASS), métriques sur les vrais défauts.*

Objectif : prouver (ou casser) le skill sur des dépôts open-source réels non conformes, avec **mesures réelles** — pas des affirmations. Le critère central : **taux de faux « réussi »**, pas seulement la réduction du compteur axe.

## 1. Matrice des normes corrigée (au 26/09/2026)

WCAG est un socle technique, pas une loi universelle. Structure du produit : **socle WCAG 2.2 AA (= ISO/IEC 40500:2025) + profils locaux versionnés + questionnaire d'applicabilité**.

| Juridiction / périmètre | Référence | Spécificités |
|---|---|---|
| International — contenus web | **WCAG 2.2** = ISO/IEC 40500:2025 | Cible AA. Gérer les errata (retrait de 4.1.1 Parsing en 2.2). |
| UE — **organismes publics** | Directive **2016/2102 (WAD)** ; EN 301 549 v3.2.1 | Exigences EN > WCAG 2.1 AA (pas identique). Ligne distincte de l'EAA. |
| UE — **produits/services couverts** | Directive **2019/882 (EAA)**, en vigueur 28/06/2025 | Champ **catégoriel** : e-commerce, banque, e-books, transport, communication… — pas « tous les sites ». Exemption microentreprises de **services** : <10 pers. ET (CA ≤2 M€ OU bilan ≤2 M€). EN 301 549 **v4.1.1** (09/2026, intègre WCAG 2.2) publiée mais **pas encore la référence harmonisée** juridique. Transition : certains contrats/produits jusqu'au 28/06/2030, terminaux 15 ans. |
| France | **RGAA 4.1.2** | Méthode complète (critères, tests, modalités) — pas « EN + déclaration ». RGAA 5 annoncé fin 2026 (WCAG 2.2, mobile, docs bureautiques) — pas en vigueur. |
| USA — ADA **Title II** | WCAG 2.1 AA | Échéances reportées DOJ 04/2026 : **26/04/2027** (≥50 000 hab.), **26/04/2028** (<50 000 et special districts). |
| USA — ADA **Title III** | Obligation d'accessibilité, application **jurisprudentielle** | Pas de standard fédéral uniforme ; Robles v. Domino's = lien avec établissement physique. Cible technique WCAG ; applicabilité = analyse distincte. |
| USA — Section 508 | WCAG 2.0 A/AA | Périmètre > web : documents, logiciels, matériel. |
| Canada — Ontario | **AODA** | WCAG 2.0 AA ; organismes publics + orgs ≥50 salariés ; échéance 01/01/2021 (passée) ; exceptions sous-titres live/audiodescription. |
| Canada — fédéral | **CAN/ASC-EN 301 549:2024** (ACA) | Fondé sur EN 301 549:2021/WCAG 2.1 ; échéances 05/12/2027 (public fédéral), 05/12/2028 (entreprises fédérales moyennes/grandes). |
| UK | PSBAR 2018 | **WCAG 2.2 AA** dans les instructions gouvernementales actuelles ; secteur public — ne pas étendre au privé. |
| Australie | DDA + recommandations AHRC 2025 | AHRC préconise **WCAG 2.2 AA** (non contraignant en soi). |
| Japon | **JIS X 8341-3:2016** | ≈ WCAG 2.0 ; obligations propres à l'organisme, pas uniforme. |
| **Québec** — publics assujettis | **SGQRI 008 3.0** (29/04/2024) | WCAG 2.1 + critères 2.2 + certains **AAA** (2.4.13 apparence focus, abréviations) — contre-exemple : WCAG 2.2 AA ne suffit PAS. |
| **Suisse** — administration fédérale | **eCH-0059 v3** | WCAG 2.1 AA ; ne pas généraliser au privé. |
| **Norvège** | Réglementation nationale TIC | **48 exigences public / 35 privé** — profil conditionnel. |
| **Brésil** | LBI art. 63 ; **ABNT NBR 17225:2025** | Obligation légale ≠ norme technique : cartographier séparément. |
| **Inde** — gouvernemental | **GIGW 3.0** | Socle WCAG 2.1 AA dans un référentiel qualité plus large. |
| **Nouvelle-Zélande** — gouvernemental | **Web Accessibility Standard 1.2** (17/03/2025) | WCAG 2.2 AA + exceptions/adaptations documentées. |

**Périmètres hors axe-web** : PDF, documents Office, applications natives — méthodes d'évaluation dédiées, hors benchmark HTML/Playwright. À déclarer comme `NOT_TESTED` avec justification.

## 2. Méthodologie durcie

### A. Les 3 agents = workers identiques, pas une comparaison
Même modèle, même skill, répartition de repos — pas une mesure d'« agents ». Pour mesurer l'apport propre du skill : **phase optionnelle appariée** — même repo, même commit, mêmes outils, même budget : une exécution avec prompt standard vs une avec le skill (36 runs sur 18 repos, coût à confirmer).

### B. Évaluation finale ≠ vérificateur opérationnel
Le vérificateur des rounds fait partie du système testé. Ajout d'un niveau : **correcteur → vérificateur opérationnel → évaluation finale indépendante** (tests non utilisés pendant la correction + revue ciblée). Sinon le système « apprend à satisfaire son propre juge ».

### C. Périmètre gelé baseline/final
Mêmes pages, états, rôles, données, langues. Manifeste de test avec préconditions + actions + résultat attendu (« ouvrir la modale » → vérifier qu'elle est réellement ouverte). Route absente / état inaccessible / timeout = **lacune de couverture**, jamais une page « sans violation ». États découverts en cours de correction : listés séparément, ne modifient pas le dénominateur initial.

### D. Corpus mixte
Pas que des repos à forte densité axe : inclure des apps avec **peu/zéro erreur axe mais difficultés fonctionnelles**, formulaires multi-étapes, tableaux interactifs, éditeurs, cartes, apps authentifiées. Les 2 projets pilotes internes restent hors de l'échantillon (ils ont servi à concevoir le skill).

### E. Faux progrès interdits (au-delà des règles déjà interdites)
Une correction ne doit ni supprimer une fonctionnalité, ni retirer une information utile, ni rendre un élément invisible aux tests/AT. Le correcteur ne peut pas modifier : le runner de référence, la liste d'URLs, les exclusions, les données de test. La correction doit exister dans le **code livré et le build évalué**.

### F. Publication complète + reproductibilité
Tous les résultats publiés : boots impossibles, budgets dépassés, arrêts sans progrès. Enregistrer commits, versions du skill/axe/Playwright/navigateur. Répéter un sous-ensemble pour mesurer la variabilité. Exécution des repos tiers en environnement isolé, sans secrets.

## 3. Métriques v2

| Mesure | Définition | Piège évité |
|---|---|---|
| Réduction des occurrences | baseline → final sur périmètre **strictement identique** | Scanner moins pour améliorer le score |
| **Causes racines corrigées** | défauts distincts, regroupés par composant/cause | 200 occurrences = 1 composant |
| Précision des corrections | corrections réellement correctes / déclarées, sur l'ensemble ou échantillon revu | Patchs qui passent sans résoudre |
| Défauts de référence résolus | défauts confirmés indépendamment puis corrigés / confirmés | Mesurer seulement ce qu'axe détecte |
| **Faux PASS du vérificateur** | acceptés alors que l'éval. finale trouve une non-conformité | Confiance injustifiée |
| Régressions | nouveaux défauts + régressions fonctionnelles/visuelles | Compteur qui baisse en cassant |
| Couverture réelle | pages/états/transitions attendus vs exécutés ; critères évalués/non évalués | Absence de preuve ≠ réussite |
| Réussite des parcours | tâches réalisables avant/après clavier + AT | Interface « propre » mais inutilisable |
| Coût complet | temps, tokens/ACU, rounds, revue humaine | Correction auto non rentable |
| Comportement d'échec | timeouts, stagnation, escalades, faux rejets | Cas difficiles éliminés discrètement |

Statuts par critère : `PASS` · `FAIL` · `NOT_APPLICABLE` (justifié) · `NOT_TESTED` · `NEEDS_HUMAN_REVIEW`. `incomplete` axe reste visible. Best-practice ≠ exigence normative (distinguer dans les rapports).

Agrégation : par dépôt d'abord, puis médiane + dispersion + par famille de défauts. Mille occurrences d'un même composant ≠ mille observations.

## 4. Corpus proposé (~18, stacks variés)

| # | Repo | Stack | Note |
|---|---|---|---|
| 1 | `miniflux/v2` | Go, SSR | RSS sobre, forms |
| 2 | `sissbruecker/linkding` | Django | dialogs, formulaires |
| 3 | `louislam/uptime-kuma` | Vue SPA + Node | dashboards, modales |
| 4 | `dgtlmoon/changedetection.io` | Flask + Jinja | proche du pilote — comparaison |
| 5 | `CorentinTh/it-tools` | Vue statique | inputs custom |
| 6 | `rommapp/romm` | Vue + FastAPI | UI riche, drawers |
| 7 | `FreshRSS/FreshRSS` | PHP SSR | tableaux, contraste |
| 8 | `kanboard/kanboard` | PHP SSR | kanban = drag&drop dur |
| 9 | `excalidraw/excalidraw` | React + canvas | cas dur |
| 10 | `go-gitea/gitea` | Go + jQuery/Vue | gros réaliste |
| 11 | `healthchecks/healthchecks` | Django | SaaS réel |
| 12 | `requarks/wiki` | Node + Vue | DB requise — robustesse setup |
| 13 | `Lissy93/dashy` | Vue dashboard | couleurs custom |
| 14 | `trilbymedia/grav` | PHP CMS admin | formulaires nombreux |
| 15 | `benbusby/whoogle-search` | Flask | petit, étalonnage |
| 16 | `n8n-io/n8n` | Vue + Node | workflow editor complexe |
| 17 | `artur-simon/RaspAP` | PHP | panneau admin réel |
| 18 | `Jermolene/TiddlyWiki5` | single-HTML | cas limite |

+ À ajouter : 1-2 repos **proches de 0 erreur axe** avec défauts fonctionnels connus (corpus de contrôle contre « réparer ce que le scanner voit »). À sélectionner au lancement.

## 5. Honnêteté du résultat

Même 18/18 réussis → borne supérieure unilatérale à 95 % du taux d'échec ≈ **15,3 %** (binomiale). Le benchmark prouve l'efficacité + la sécurité de modification + la gestion d'incertitude, **pas** l'infaillibilité ni une conformité juridique.

Formulation de résultat (à remplir avec les mesures réelles) :
> « Sur N dépôts et les parcours documentés, le skill a réduit les violations automatiques de […] et corrigé […] des défauts confirmés indépendamment. La revue finale a identifié […] corrections incorrectes, […] régressions, […] points humains restants. Les résultats concernent les versions/environnements indiqués ; pas d'attestation générale de conformité juridique. »

## 6. À décider avant lancement

- [ ] Valider/ajuster la liste de repos (incl. les cas faible-axe)
- [ ] Phase appariée (avec/sans skill) : oui/non — double le coût
- [ ] Budget ACU : ~1 run complet par repo (+ vérificateur + éval finale)
- [ ] Validation humaine sur sous-ensemble : qui/quand
- [ ] `benchmark.py` prêt dans le zip (schéma résultats v2 ci-dessous)
