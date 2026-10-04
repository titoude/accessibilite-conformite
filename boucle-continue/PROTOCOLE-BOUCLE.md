# Boucle continue test → audit → correction

Procédure du cycle d'amélioration continue du produit. Pilotée par la session
coordinatrice (Devin). Objectif : faire tourner le workflow sur des dépôts open
source **jamais testés**, faire auditer chaque résultat par un agent
indépendant, corriger la procédure à chaque faille trouvée, et tout documenter.

## Un cycle = 4 étapes

1. **Worker** (session fille) : choisit UN dépôt OSS dans sa liste assignée,
   jamais présent dans `REGISTRE.md`, et applique la procédure complète
   (`benchmark-v3.py` avec `A11Y_CYCLE_REPOS`) : boot → manifeste figé → audit
   baseline → corrections → vérification indépendante → éval finale → artefacts
   complets (`patch.diff`, `manifest.json`, `provenance.json`, `states.json`,
   `report.json`, `scope.json`, `verify.mjs`, `eval-final.mjs`).
   Contraintes dures : jamais de PR vers le dépôt tiers, jamais de modification
   du produit pour satisfaire le harnais, jamais de réécriture des preuves.
   Sortie : structured_output + tous les artefacts attachés à son message final.

2. **Auditeur** (session fille distincte, lancée après le worker) : re-clone le
   dépôt upstream au SHA épinglé, applique le patch, ré-exécute install
   verrouillée + build + scan, recalcule les hashes, relit le patch à la
   recherche de triche (fonctionnalités supprimées, contenu retiré, harnais
   adapté au produit, assertions faibles), vérifie la cohérence du verdict.
   Sortie : verdict PASS/FAIL/NOT_TESTED + findings.

3. **Consolidation** (coordinateur = moi) : je compare worker vs auditeur,
   j'applique `validate_result()` de `benchmark-v3.py`, j'inscris le résultat
   dans `REGISTRE.md` (le dépôt ne sera jamais retesté), je documente toute
   anomalie.

4. **Correction** : toute faille de procédure trouvée → correction dans le
   package (SKILL.md, audit.mjs, workflow, validateurs…) + commit + entrée dans
   `JOURNAL.md`. Puis cycle suivant.

## Règles

- Max **4 sessions filles en parallèle** (workers + auditeurs confondus).
- Un dépôt dans `REGISTRE.md` n'est **jamais retesté** — les workers doivent
  vérifier le registre avant de choisir.
- Verdicts honnêtes : CONFIRMED = reproductibilité du score axe + rejeu
  indépendant, PAS conformité WCAG complète.
- Échecs conservés et documentés — rien n'est effacé.
- L'auditeur ne reçoit que les artefacts du worker, pas ses conclusions — il
  doit former son propre verdict.
- Les artefacts voyagent via les attachments de session + structured_output
  (les sessions filles ont des VM séparées, rien n'est partagé).

## Fenêtre

Boucle active jusqu'à ~16h-17h Paris (14h-15h UTC) le 2026-10-04, ou arrêt
utilisateur. À la fin : commit du registre + journal + rapport de boucle.
