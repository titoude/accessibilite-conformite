#!/usr/bin/env python3
"""The audit.mjs copy embedded in the Devin workflow must equal audit.mjs byte for byte."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
expected = (ROOT / "audit.mjs").read_text(encoding="utf-8")
PATTERN = re.compile(r"^AUDIT_SCRIPT = r'''(.*?)'''", re.S | re.M)

ok = True
for name in ["integrations/devin/workflow.py"]:
    m = PATTERN.search((ROOT / name).read_text(encoding="utf-8"))
    if not m:
        print(f"{name}: AUDIT_SCRIPT missing - FAIL")
        ok = False
    elif m.group(1) != expected:
        print(f"{name}: embedded runner differs from audit.mjs - FAIL (run pnpm sync-runner)")
        ok = False
    else:
        print(f"{name}: embedded runner matches audit.mjs")
sys.exit(0 if ok else 1)
