# Round-1 evaluation checkpoint (authoritative at time of commit)

Frozen evaluator `evaluate.sh` requires an ABSOLUTE patch path (the mktemp
clone resolves relatives inside the clone — a relative path fails with
PATCH_FAILED exit 4). Two setup attempts were overwritten before the accepted
runs; those retries are noted here honestly and NOT reconstructed as raw logs:
- control: first run PATCH_FAILED (relative path) — overwritten by accepted run
- treatment: first attempt failed entirely to launch (log lost) — rerun clean

## Accepted runs (absolute patch paths, frozen evaluator head eb71eb5)

| arm | patch sha256 | task1 | task2 | task3 | page errors | external req | fatal |
|-----|--------------|-------|-------|-------|-------------|--------------|-------|
| control | b599a61a87171d4fc83bc0d59608d9ac3e6326312417649b0f43dd94ab836787 | PASS | PASS | PASS | 0 | 0 | none |
| treatment (round 1) | d235b1b26301c999d8cd63d1c88cb95f99483132e44da361f3211a4e59470848 | PASS | FAIL | PASS | 0 | 0 | none |

treatment task2 failure: focus after BOTH commit and cancel landed on the
item's `input.toggle` checkbox — visible and inside the correct li, but the
oracle requires a named semantic affordance (the checkbox has no accessible
name). Round-2 feedback sent at 1790595059 using only frozen step
names/statuses.

Raw artifacts: `arms/<arm>/worker-patch.diff`, `report.md`,
`eval/report.json`, `eval/scope.json`, `eval-run.log`, `eval-status.env`.
