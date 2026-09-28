# Contributing

Use a focused branch and describe the barrier or evidence failure being addressed. Preserve unrelated work.

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm exec playwright install chromium
pnpm test
```

Requires Node.js 22+ and Python 3.10+. If you change `audit.mjs`, run `pnpm sync-runner` and commit the three embedded copies. Reproduce a false pass before fixing it; include valid controls so rejecting everything cannot pass.

Dependencies are pinned with a lockfile, a seven-day release-age delay and no authorized dependency build scripts. Review changes individually.

Follow the [evidence ledger](docs/EVIDENCE.md) and [release gates](docs/RELEASE-READINESS.md). Preserve failed experiments. Run upstream projects in isolated environments without private data. Do not submit upstream PRs merely to run a benchmark.

Defect reports should include commit, environment, exact command, expected/observed behavior and a minimal sanitized example. Never attach cookies, authentication storage or personal data to public issues.
