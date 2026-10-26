# Security policy

## Reporting a vulnerability

Please report security issues **privately** via this repository's GitHub **Security → Report a vulnerability** feature (private vulnerability reporting), when available. Do not open a public issue containing credentials, authentication states, exploitable payloads against real systems, or user data.

Include the affected commit or release, environment, exact reproduction instructions, expected versus observed behavior, and a minimal synthetic test case. The maintainers will review the report; no response-time or remediation guarantee is implied.

## Security boundaries

This project is a **development-time accessibility auditing and remediation toolkit**, not a hosted scanning service and not proof of legal or WCAG conformance.

- Only scan applications, repositories, identities and endpoints you own or have explicit permission to test. Do not use the crawler against unrelated services.
- Browser storage-state files, login cookies, tokens, API keys, private URLs and screenshots of real users may contain sensitive data. Keep them outside this repository and public bug reports. Use test accounts and synthetic fixtures.
- Generated audit reports may contain page HTML and text. Review and redact them before publishing or attaching to issues and pull requests.
- AI code changes require independent review, locked dependencies, real builds, reproducible end-to-end tests and explicit reporting of manual accessibility gaps.
- When agents or the optional Devin workflow run with repository credentials, give them the narrowest privileges required. They do not need production secrets to run an accessibility audit.
- Dependencies and CI workflows execute third-party code. Review dependency bumps, and run the applications you audit in isolated, disposable environments.

An automated scanner finding no violations is **not** evidence that all user tasks, assistive technologies or legal requirements have been assessed.

## Supported code

Security fixes are applied to the current default branch only.
