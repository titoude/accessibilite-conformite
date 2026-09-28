# Evaluation checkpoint (updated after rerun)

Frozen evaluator `evaluate.sh` requires an ABSOLUTE patch path (the mktemp
clone resolves relatives inside the clone — a relative path fails with
PATCH_FAILED exit 4). Setup attempts before the accepted runs are preserved
honestly, not reconstructed:

- control `eval-attempt1-diagnostic/`: PORT_OWNERSHIP_MISMATCH (listener
  pid 83584 collided) followed by DONE, serve.log empty — concurrent first
  attempt produced mixed evidence; preserved as diagnostic, NOT accepted.
  Accepted serial rerun: `eval/` on verified-free port 8395.
- treatment `eval/`: accepted run on port 8391.

## Accepted results (frozen evaluator head eb71eb5, absolute patch paths)

| arm | patch sha256 | task1 | task2 | task3 | page errors | external req | fatal |
|-----|--------------|-------|-------|-------|-------------|--------------|-------|
| control | b599a61a87171d4fc83bc0d59608d9ac3e6326312417649b0f43dd94ab836787 | PASS | PASS | PASS | 0 | 0 | none |
| treatment (round 1) | d235b1b26301c999d8cd63d1c88cb95f99483132e44da361f3211a4e59470848 | PASS | FAIL | PASS | 0 | 0 | none |

treatment task2 failed steps (observed, verbatim):
- "focus after commit lands on visible affordance of same item": FAIL —
  focus landed on `input.toggle` (checkbox) inside the correct li, but the
  frozen checkVisibility({checkOpacity, checkVisibilityCSS}) predicate
  rejected it (opacity-hidden in the app's stylesheet)
- "focus after cancel lands on visible affordance of same item": FAIL —
  same landing, same predicate rejection

All other task2 steps PASS (affordance discovered via F2; commit preserves
id + exits edit; Escape cancels with text unchanged + id preserved; dblclick
still opens edit).

## Feedback sent to treatment (round 2 of max 3), at epoch 1790595059

    task1_add_complete_filter: PASS
    task2_keyboard_edit: FAIL
      - "keyboard edit affordance discovered": PASS (F2 inside item)
      - "commit preserves item id + exits edit mode": PASS
      - "focus after commit lands on visible affordance of same item": FAIL
      - "Escape cancels: text unchanged, id preserved, edit exited": PASS
      - "focus after cancel lands on visible affordance of same item": FAIL
      - "mouse dblclick still opens edit": PASS
    task3_toggle_clear: PASS

Control needed no correction (all three PASS on round 1).

## Round 2 (treatment only)

Round-2 patch sha256 73a980a248dcbb273731216c0d2733bb0e695d52b616ed18db33d05eb8b3fbb4
(delivered ~13:31 Paris, before the 11:41:32 UTC deadline). Serial run on
verified-free port 8396 in `eval-round2/`:

| arm | patch sha256 | task1 | task2 | task3 | page errors | external req | fatal |
|-----|--------------|-------|-------|-------|-------------|--------------|-------|
| treatment (round 2) | 73a980a2…b3fbb4 | PASS | PASS | PASS | 0 | 0 | none |

**Pair outcome: FINAL task outcomes are equal (PASS/PASS/PASS both arms),
but INITIAL outcomes differed** — control passed 3/3 on round 1, treatment
passed 2/3 and needed one correction round to reach 3/3. Treatment's r1
focus-commit/cancel failure was corrected after identical step-status
feedback. One pair — no causal or generalizable claim; self-reported worker
minutes remain unverified.

## Submission / retrieval timestamps

- Treatment r2 patch delivered by the worker ~13:31 Paris (before its
  11:41:32 UTC deadline); the parent's retrieval + evaluation ran after —
  the artifact's submission was before deadline, parent's pick-up was late.
  No worker repair ran post-deadline.
- Evaluator/inputs frozen at eb71eb5 / dee0f5a; nothing in the harness or
  task code changed during the trial.
