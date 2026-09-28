#!/usr/bin/env python3
"""assemble-prompts.py — render the arm prompt templates with the verbatim
file contents they embed, writing prompts/arm-*.rendered.md. The rendered
files are the record of exactly what each worker received."""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]  # benchmarks/paired-pilot

# Treatment material is pinned verbatim under treatment/ (source revision
# recorded in treatment/provenance.json) — do NOT read repo-root files,
# which track whatever revision main happens to carry.
SKILL = (ROOT / "treatment/SKILL.md").read_text()
AUDIT = (ROOT / "harness/audit.whoogle.mjs").read_text()
ASSERTIONS = (ROOT / "treatment/assertions.mjs").read_text()
CHECKLIST = (ROOT / "treatment/checklist.md").read_text()
PKG_JSON = (ROOT / "harness/worker-assets/package.json").read_text()
PKG_LOCK = (ROOT / "harness/worker-assets/package-lock.json").read_text()
FROZEN_REQS = (ROOT / "harness/whoogle-frozen-requirements.txt").read_text()

for name in ["arm-with-skill", "arm-control"]:
    tpl = (ROOT / "prompts" / f"{name}.md").read_text()
    rendered = (tpl
                .replace("__SKILL_MD__", SKILL)
                .replace("__AUDIT_MJS__", AUDIT)
                .replace("__ASSERTIONS_MJS__", ASSERTIONS)
                .replace("__CHECKLIST_MD__", CHECKLIST)
                .replace("__PACKAGE_JSON__", PKG_JSON)
                .replace("__PACKAGE_LOCK__", PKG_LOCK)
                .replace("__FROZEN_REQS__", FROZEN_REQS))
    leftover = [m for m in ("__SKILL_MD__", "__AUDIT_MJS__", "__ASSERTIONS_MJS__",
                          "__CHECKLIST_MD__", "__PACKAGE_JSON__", "__PACKAGE_LOCK__",
                          "__FROZEN_REQS__") if m in rendered]
    if leftover:
        raise SystemExit(f"{name}: unrendered placeholders {leftover}")
    out = ROOT / "prompts" / f"{name}.rendered.md"
    out.write_text(rendered)
    print(f"{out} ({len(rendered)} chars)")
