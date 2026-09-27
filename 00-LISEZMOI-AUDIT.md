# LISEZ-MOI — dossier d'audit complet (v3)

Ce zip contient l'intégralité du projet « kit accessibilité pour agents IA »
et toutes les preuves produites. Rien n'est sur GitHub — tout est ici.

## Ce qu'on vous demande d'auditer

1. **Le livrable** : `SKILL.md` (17 règles), `audit.mjs` (scanner v3),
   `checklist.md`, `workflow.py`/`workflow-cdv.py`, `playbook.md`, `pre-push`,
   `benchmark-v3.py` (contrat final).
2. **La méthode** : correcteur ≠ vérificateur ≠ auditeur tiers ; périmètre
   figé par manifeste + `scopeHash`/`statesHash` ; artefacts obligatoires.
3. **Les preuves** : `RAPPORT-BENCHMARK-V1.md`, `benchmark-results.json`
   (18 repos), `RAPPORT-BENCHMARK-V2.md`, `benchmark-v2-results.json`,
   `benchmark-v2/<repo>/` (patch.diff, patch-fixed.diff, report.json,
   scope.json, provenance.json — rejouables sur clone vierge),
   `RAPPORT-REQUALIFICATION-V2.md` (install verrouillée + build des 6 patchs,
   2 défauts trouvés et corrigés), `tests-validateurs/` (5 mutants, 5/5
   détectés).
4. **L'historique des corrections** : `REPONSE-REVUE.md` (votre audit V1 →
   runner v2), `REPONSE-REVUE-V2.md` (votre audit V2 → runner v3 + règles
   13-17).

## Verdicts déjà établis (à contester si vous trouvez mieux)

- V1 : 18/18 repos à 0 violation axe, mais preuve de périmètre imparfaite
  (comptage ≠ identité) — requalifié honnêtement.
- V2 : 6/6 CONFIRMED par 2 auditeurs tiers indépendants (re-clone, patch,
  re-run) — portée = reproductibilité du score axe uniquement.
- Requalification : 4/6 patchs installables directs ; 2 défauts (yarn.lock
  RaspAP, hash pnpm it-tools) corrigés en `patch-fixed.diff` versionné.

## Limites assumées, à challenger

- Aucun contrôle apparié (même repo avec/sans skill).
- Aucune revue humaine NVDA/zoom réel — checklist non exécutée par un humain.
- Le score axe couvre ~30-40 % des critères WCAG ; le reste est processus.
- `tests-validateurs` couvre 5 classes de défauts, pas l'exhaustivité.

## Question centrale pour l'audit

**Ce kit est-il prêt à être publié comme « produit fini » pour un hackathon ?**
Si non : quels défauts bloquants restants ? Priorisez par sévérité.
