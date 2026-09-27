#!/usr/bin/env python3
"""Parité des runners embarqués : le audit.mjs embarqué dans chaque
orchestrateur doit être octet-pour-octet celui de audit.mjs."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
expected = (ROOT / "audit.mjs").read_text()
PATTERN = re.compile(r"^AUDIT_SCRIPT = r'''(.*?)'''", re.S | re.M)

ok = True
for name in ["workflow.py", "workflow-cdv.py", "benchmark-v3.py"]:
    m = PATTERN.search((ROOT / name).read_text())
    if not m:
        print(f"{name}: AUDIT_SCRIPT absent — FAIL")
        ok = False
    elif m.group(1) != expected:
        print(f"{name}: runner embarqué DIVERGENT de audit.mjs — FAIL (lancer sync_runner.py)")
        ok = False
    else:
        print(f"{name}: parité OK")
sys.exit(0 if ok else 1)
