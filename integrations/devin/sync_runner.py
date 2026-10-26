#!/usr/bin/env python3
"""Keep the runner embedded in workflow.py identical to audit.mjs.

Devin's workflow runtime copies the workflow script alone into a temporary
directory, so workflow.py carries its own copy of audit.mjs (AUDIT_SCRIPT).
audit.mjs at the repository root is the single source; this script rewrites
the embedded copy. tests/test_runner_parity.py fails when they diverge.

Usage: python sync_runner.py          # rewrite the embedded copy
       python sync_runner.py --check  # only report parity (exit 1 if divergent)
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
RUNNER = HERE.parents[1] / "audit.mjs"
TARGETS = [HERE / "workflow.py"]

PATTERN = re.compile(r"^AUDIT_SCRIPT = r'''(.*?)'''", re.S | re.M)


def sync(target: Path, check: bool) -> str:
    text = target.read_text(encoding="utf-8")
    m = PATTERN.search(text)
    if not m:
        return f"{target.name}: no AUDIT_SCRIPT block"
    expected = RUNNER.read_text(encoding="utf-8")
    if m.group(1) == expected:
        return f"{target.name}: in sync"
    if check:
        return f"{target.name}: DIVERGENT, run sync_runner.py"
    text = text[: m.start(1)] + expected + text[m.end(1):]
    target.write_text(text, encoding="utf-8")
    return f"{target.name}: resynchronized"


def main() -> int:
    check = "--check" in sys.argv
    status = 0
    for target in TARGETS:
        msg = sync(target, check)
        print(msg)
        if "DIVERGENT" in msg or "no AUDIT_SCRIPT" in msg:
            status = 1
    return status


if __name__ == "__main__":
    sys.exit(main())
