# Brief à valider — mise en conformité accessibilité par agent IA

*(Document rédigé pour être collé tel quel dans ChatGPT — il contient tout le contexte nécessaire.)*

## Le projet

J'ai construit un « skill » (protocole d'instructions + outils) qu'on donne à un agent IA de code (Devin, Claude Code, Cursor…) pour qu'il mette un site ou une application en conformité accessibilité **dans le code source**, sans overlay/widget — avec l'objectif du taux d'erreur le plus bas possible.

**Architecture anti-erreur du skill :**
- L'agent qui corrige ne se vérifie jamais lui-même : un agent de vérification indépendant rejoue l'audit et peut refuser le résultat (3 rounds max).
- Corrections déterministes d'abord (labels, landmarks, contrastes de tokens), jugement ensuite.
- Interdits : overlays (accessiBe, UserWay…), désactivation de règle d'audit, `alt=""` sur image non prouvée décorative, `outline:none` sans équivalent focus.
- Chaque correction revérifiée par re-scan ; tout critère « vérifié » doit avoir une preuve.
- Boucle bornée avec garde « aucun progrès » — jamais de « fait » non prouvé.

**Outillage** : `audit.mjs` = axe-core 4.12 + Playwright — crawl same-origin, liste `--urls`, états dynamiques `--states` (modales/drawers/toasts déclarés dans une carte STATES), rapport JSON+MD trié par impact, exit≠0 si violation (gate CI ou hook git pre-push local).

**Déjà validé sur 2 vrais projets** : cdv-collect (Flask+vanilla JS, CSP stricte) : 63 occurrences → 0 violation sur 10 routes + 5 états ; le vérificateur a rejeté 2 rounds (piège clavier carte Leaflet, label fantôme). TRAJECTOIRE (Go+vanilla JS) : 142 violations → 0 sur 31 pages ; 2 vrais défauts trouvés par le vérificateur (skip-link, focus perdu).

## La question qui t'est posée

Je veux maintenant **benchmarker ce skill sur ~18 dépôts open-source non conformes** avec 3 agents en parallèle (6 repos chacun), en collectant des métriques réelles (violations baseline→final, rounds, rejets du vérificateur, durée, échecs) pour mesurer la couverture réelle.

**Ma matrice de normes — est-elle correcte et complète ?**

| Juridiction | Texte | Référence technique |
|---|---|---|
| International | WCAG 2.2 (W3C) | WCAG 2.2 AA |
| UE | EAA — directive 2019/882 (28/06/2025) | EN 301 549 → WCAG 2.1 AA |
| France | RGAA 4.1.2 (→ RGAA 5 fin 2026) | EN 301 549 ≈ WCAG 2.1 AA + déclaration |
| USA | ADA titre II (règle DOJ 04/2024) + titre III | WCAG 2.1 AA |
| USA fédéral | Section 508 | WCAG 2.0 AA |
| Canada | AODA / ACA | WCAG 2.0 AA |
| UK | PSBAR 2018 | WCAG 2.1 AA |
| Australie | DDA | WCAG 2.1 AA |
| Japon | JIS X 8341-3 | ≈ WCAG 2.0 AA |

Mon raisonnement : **viser WCAG 2.2 AA couvre toutes ces juridictions côté technique** (elles référencent toutes WCAG ≤ 2.1 AA, sous-ensemble de 2.2). La conformité juridique complète ajoute : déclaration d'accessibilité, mécanisme de réclamation, contenus annexes (PDF etc.).

**Ce que je te demande de vérifier :**
1. La matrice normes ↔ référence technique est-elle exacte à date ? (versions, dates d'entrée en vigueur, seuils EAA >10 salariés & >2 M€, délais transitoires, RGAA 5, jurisprudence ADA titre III)
2. Manque-t-il des juridictions majeures (Suisse, Québec Loi, Brésil, Norvège…) ou des cas particuliers ?
3. axe-core couvre ~30-40 % des critères WCAG — mon protocole ajoute une checklist manuelle émulée (clavier, focus, zoom, reduced-motion) + liste explicite des points nécessitant un humain. Suffisant pour prétendre à un benchmark sérieux ? Que mesurer de plus ?
4. Mon protocole par repo : clone → boot → audit baseline → corrections → vérification indépendante → métriques JSON, sans PR vers les repos tiers. Une faille méthodologique ?
5. Critère de succès : que doit prouver le benchmark pour dire honnêtement « le skill fonctionne » ?

Réponds avec : corrections à apporter à la matrice, juridictions manquantes, et les métriques/pièges que j'aurais ratés.
