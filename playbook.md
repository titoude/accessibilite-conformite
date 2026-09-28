# Devin playbook: accessibility remediation with evidence

Use [SKILL.md](SKILL.md) as the canonical protocol and [checklist.md](checklist.md) as the review ledger. Do not recreate a simplified scanner or replace the protocol with a score target.

Required inputs: exact authorized repository, base commit, local start instructions, critical user tasks and any authorized test authentication. Verify the repository identity before changing anything.

1. Freeze scope, data, versions, dynamic-state setup and expected outcomes before the baseline.
2. Install the locked toolkit and start the target application using its approved procedure.
3. Scan with explicit `--states all` or `--states none`; preserve reports and scope.
4. Correct source code in a focused branch while preserving behavior. Bound the correction loop and stop on no progress.
5. Have a distinct verifier replay the candidate commit, then obtain a separate final evaluation with held-out tasks.
6. Reconcile verdicts with raw evidence, build status, patch identity, coverage and unresolved findings. A word such as PASS cannot override contradictory measurements.
7. Publish a scoped PR and sanitized artifacts. Report every human/AT check still open. Do not publish secrets or change other repositories.

If independent workers or real assistive-technology tests are unavailable, record them as unperformed. An automated pass is not complete WCAG/RGAA conformance.

The optional [workflow.py](workflow.py) adapter requires Devin's workflow runtime; it is not a standalone Python remediation service.
