# Devin integration (optional)

These files only matter if you run [Devin](https://devin.ai). The skill itself ([SKILL.md](../../SKILL.md)) is agent-agnostic and does not need them.

| File | Purpose |
| --- | --- |
| [playbook.md](playbook.md) | Short playbook to paste into Devin; it defers to SKILL.md |
| [workflow.py](workflow.py) | Orchestration script for Devin's workflow runtime: baseline audit, up to three fix/verify rounds by separate agents, a separate final evaluation, then a PR. Success that is not demonstrated yields a draft PR; contradictory verifier output yields no PR |
| [sync_runner.py](sync_runner.py) | Copies `audit.mjs` into `workflow.py`, which must be self-contained |

`workflow.py` is not a standalone program: it relies on the `agent()`, `register_workflow()` and `log()` functions that Devin's runtime provides. Set `A11Y_REPO=owner/repo` (and optionally `A11Y_BASE=<branch>`), then start it with Devin's `run_workflow` tool. Its agent prompts are written in French.

The success decision is computed from the verifier's counters and the final evaluation, never from an agent's own verdict; `pnpm test:decisions` covers that logic. After any change to `audit.mjs`, run `pnpm sync-runner`; `pnpm test:parity` fails if the embedded copy drifts.
