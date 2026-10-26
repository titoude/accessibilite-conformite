# Contributing

Use a focused branch and describe the barrier or false result being addressed. Preserve unrelated work.

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm exec playwright install chromium
pnpm test
```

Requires Node.js 22+, pnpm 10.34.5 and Python 3.10+ available as `python` on your `PATH`.

- If you change `audit.mjs`, run `pnpm sync-runner` and commit the updated copy embedded in `integrations/devin/workflow.py`; `pnpm test:parity` checks it.
- To fix a false pass, reproduce it in a test first, and include a valid control so that a check rejecting everything cannot pass.
- Dependencies are pinned with a lockfile, a seven-day release-age delay and no authorized dependency build scripts. Review each dependency change individually.
- Scan only applications you are authorized to test, in isolated environments without private data.

Defect reports should include the commit, environment, exact command, expected and observed behavior, and a minimal sanitized example. Never attach cookies, authentication storage or personal data to public issues.
