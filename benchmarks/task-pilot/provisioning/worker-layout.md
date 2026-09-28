# Worker provisioning — frozen layout for both arms

Budget boundary (identical both arms): the 20-minute wall-clock starts at
platform worker-session creation and INCLUDES everything inside that session —
any worker-side setup, waits, remediation and correction rounds. There is no
pause or reset. Parent-only protocol preparation (this document, the frozen
clone reference, evaluator) happens before worker creation and is outside the
clock.

## Identical for BOTH arms

```
worker-root/
  package.json        # verbatim copy of repo-root package.json
  pnpm-lock.yaml      # verbatim copy of repo-root pnpm-lock.yaml
  pnpm-workspace.yaml # verbatim copy of repo-root pnpm-workspace.yaml
  todomvc/            # git clone @ ff43b02e (target; workers edit only
                      #   todomvc/examples/javascript-es5/)
```

Setup commands, identical both arms:

```sh
cd worker-root
pnpm install --frozen-lockfile --ignore-scripts   # locked playwright+axe
cd todomvc && git checkout ff43b02e59dfa604386bb382034b2cd07c2bcd8a
cd examples/javascript-es5
npm ci --omit=dev --ignore-scripts --no-audit --no-fund   # two prod deps
```

The three shared config files are copied verbatim from the approved freeze
SHA `3f78d7c3668d108df26a43cff364c8cff946849f` — hashes recorded per arm
along with node/npm/pnpm versions and clone HEAD. **Generic tools/config
only** — no SKILL.md content, no evaluator harness, no fixtures, no
sibling-arm data, no `.git` of the benchmark repo, and workers are prohibited
from consulting the experimental repository or the other arm online.

## TREATMENT arm additionally

```
worker-root/skill/
  SKILL.md  checklist.md  audit.mjs  README.md
  templates/{README.md,wcag-2.2-aa.csv}
  docs/RELEASE-READINESS.md
  tests-validateurs/assertions.mjs
```

Verbatim byte copies at original relative paths (sha256 in
`treatment/provenance.json`). This is the ONLY setup difference between arms.
The skill's `audit.mjs` resolves `playwright`/`axe-core` via
`createRequire(cwd/package.json)` — i.e. from the same locked install both
arms already have; no extra runtime dependency is added for treatment.

## Correction-round feedback — identical both arms

Each round, the worker gets back: the same task-requirements text, the
evaluator's step list (step names + pass/fail only — not oracle internals),
and may resubmit. Max 3 rounds. No evaluator source, no fixture internals.

## Verified load proof (locked provisioning)

`skill/audit.mjs` + `skill/tests-validateurs/assertions.mjs` were executed
from this exact layout against a local fixture server:

- `pnpm install --frozen-lockfile --ignore-scripts` → playwright 1.63.0,
  axe-core 4.13.0, @playwright/test 1.63.0
- `node skill/audit.mjs <local fixture> --states none --out a11y-locked` →
  produced report.json/report.md/scope.json (3 rules, 32 nodes — the fixture
  is synthetic and intentionally labelled, not app code)
- `assertions.mjs` exports load: `accName, accNameMatches,
  effectObserved, isTrulyVisible`

Toolchain used for the proof: Node v22.23.3, pnpm 10.34.5.
