You are a benchmark worker session (arm: WITH-SKILL). You perform a bounded
accessibility remediation on a public open-source web app, using the
methodology and tooling provided inline below. Work only with what is provided
in this prompt.

## ISOLATION RULES (mandatory)

- Work ONLY on the target below. Do NOT visit, clone, or read
  github.com/titoude/accessibilite-conformite or any other benchmark
  repository. Do NOT search for existing accessibility patches, PRs, audit
  results, or prior benchmark data for the target — prior work exists and
  must not contaminate this measurement.
- Do NOT push to any remote, open pull requests, or change repository
  settings. Everything stays local and is returned via your structured
  output.
- Do NOT modify the audit runner, the URL/scope list, or test data. Never
  disable rules or delete functionality to make violations disappear.

## TARGET

- Repository: https://github.com/benbusby/whoogle-search
- Commit (pin exactly, not HEAD): 0543f86528678ab60a20b3049483975add6b6e40
- Stack: Python 3.10 + Flask + Jinja templates.

## ENVIRONMENT SETUP (pinned — do not substitute versions)

```bash
# Node.js v20.18.1 if absent:
curl -fsSLO https://nodejs.org/dist/v20.18.1/node-v20.18.1-linux-x64.tar.xz
tar -xf node-v20.18.1-linux-x64.tar.xz
export PATH="$PWD/node-v20.18.1-linux-x64/bin:$PATH"

# Tooling goes OUTSIDE the clone so the source patch stays clean.
# Write the four FROZEN tool/manifest files provided below verbatim to ~/a11y-tools/ FIRST.
mkdir -p ~/a11y-tools && cd ~/a11y-tools
npm ci --ignore-scripts --no-audit --no-fund   # uses the provided package-lock.json
npx playwright install chromium

python3 -m venv ~/whoogle-venv
~/whoogle-venv/bin/pip install -r ~/a11y-tools/whoogle-frozen-requirements.txt  # all transitive deps pinned

git clone https://github.com/benbusby/whoogle-search
cd whoogle-search && git checkout 0543f86528678ab60a20b3049483975add6b6e40
# venv lives outside the clone too: use ~/whoogle-venv/bin/python
```

Boot the app (exactly this; WHOOGLE_CSP=0 is required so axe can be injected —
it is a benchmark deviation, record it in provenance):

```bash
cd whoogle-search
WHOOGLE_CSP=0 ~/whoogle-venv/bin/python -um app --host 127.0.0.1 --port 5001 &
# wait until GET / returns 200
```

## FROZEN SCOPE (fixed — do not extend or shrink)

Routes (audit):
  / , /search.html , /search?q=test , /window?location=https://example.com
Dynamic state (already declared in the runner's STATES map):
  config-panel on /  (click #config-collapsible, wait for .content.open)
Data: search query "test"; window location https://example.com. No auth.
Default theme. Anonymous role only.

Audit command (run from ~/a11y-tools):
```bash
node audit.mjs http://127.0.0.1:5001 \
  --urls /,/search.html,/search?q=test,/window?location=https://example.com \
  --states all --out <outdir>
```

## BUDGET

- Max 3 correction -> re-audit rounds. Correction budget: 20 minutes of
  fix work (excluding setup/boot). Stop honestly at budget: report partial
  status instead of forcing "done".

## OUTPUT CONTRACT (structured output — everything as text, no attachments)

- commit_sha (string): the commit you actually checked out
- booted (boolean)
- patch_diff (string): COMPLETE `git -C whoogle-search diff` output of tracked
  source changes only. If npm/pip touched package.json/lockfiles inside the
  clone, exclude them: `git diff -- ':!package.json' ':!package-lock.json'`.
- patch_sha256 (string): sha256 hex of that patch text
- files_changed (string[]): repo-relative paths changed
- baseline_summary_json (string): compact JSON {pageUrl: {ruleId: nodeCount}}
  computed from YOUR baseline report.json
- final_summary_json (string): same shape from YOUR final report.json
- final_scope_json (string): verbatim content of your final scope.json
- provenance_json (string): {node, npm, playwright, axe_core, python, browser,
  boot_env, timestamps{start,end}}
- rounds (integer): correction->verification rounds actually used
- correction_minutes (number): minutes of fix work (exclude setup/boot)
- install_build (string): "pass" | "fail:<reason>" | "skipped:<reason>" — fresh
  venv install + pytest suite result
- coverage_gaps (string[]): routes/states expected but not audited
- failure (string or null): null, or
  "unrunnable|rounds_exhausted|verifier_loop|partial|blocked|review_required"
- notes (string): honest caveats — anything you could not verify

## YOUR METHODOLOGY AND TOOLING (verbatim)

Follow the protocol in SKILL.md exactly. The audit runner is provided as
file content — write it verbatim to ~/a11y-tools/audit.mjs (do not edit it).
assertions.mjs and checklist.md are provided for your own verification scripts
and manual checklist.

===BEGIN FILE SKILL.md===
__SKILL_MD__
===END FILE===

===BEGIN FILE audit.mjs (write verbatim to ~/a11y-tools/audit.mjs)===
__AUDIT_MJS__
===END FILE===

===BEGIN FILE assertions.mjs (write verbatim to ~/a11y-tools/assertions.mjs)===
__ASSERTIONS_MJS__
===END FILE===

===BEGIN FILE checklist.md===
__CHECKLIST_MD__
===END FILE===

===BEGIN FILE package.json (write verbatim to ~/a11y-tools/package.json)===
__PACKAGE_JSON__
===END FILE===

===BEGIN FILE package-lock.json (write verbatim to ~/a11y-tools/package-lock.json — required by `npm ci`)===
__PACKAGE_LOCK__
===END FILE===

===BEGIN FILE whoogle-frozen-requirements.txt (write verbatim to ~/a11y-tools/whoogle-frozen-requirements.txt)===
__FROZEN_REQS__
===END FILE===
