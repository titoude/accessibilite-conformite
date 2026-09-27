#!/usr/bin/env python3
"""sync_runner.py — UNE source du runner : audit.mjs.

Régénère les copies embarquées (AUDIT_SCRIPT) de audit.mjs dans les
orchestrateurs. Un runner embarqué divergent n'est plus possible sans que
ce script soit sauté — testé par tests/test_runner_parity.py.

Usage : python3 sync_runner.py          # réécrit les embarquements
        python3 sync_runner.py --check  # vérifie la parité (CI local)
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RUNNER = ROOT / "audit.mjs"
TARGETS = ["workflow.py", "workflow-cdv.py", "benchmark-v3.py"]

PATTERN = re.compile(r"^AUDIT_SCRIPT = r'''(.*?)'''", re.S | re.M)


def sync(target: Path, check: bool) -> str:
    text = target.read_text()
    m = PATTERN.search(text)
    if not m:
        return f"{target.name}: PAS de bloc AUDIT_SCRIPT"
    embedded = m.group(1)
    expected = RUNNER.read_text()
    if embedded == expected:
        return f"{target.name}: en parité"
    if check:
        return f"{target.name}: DIVERGENT — lancer sync_runner.py"
    text = text[: m.start(1)] + expected + text[m.end(1):]
    target.write_text(text)
    return f"{target.name}: resynchronisé"


def main() -> int:
    check = "--check" in sys.argv
    status = 0
    for name in TARGETS:
        msg = sync(ROOT / name, check)
        print(msg)
        if "DIVERGENT" in msg:
            status = 1
    return status


if __name__ == "__main__":
    sys.exit(main())
