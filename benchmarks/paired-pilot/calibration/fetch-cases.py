#!/usr/bin/env python3
"""fetch-cases.py — download the selected W3C ACT Rules test cases and freeze
them locally (content + SHA256) so the calibration is reproducible offline.

Source: https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases.json
         (generated from https://github.com/w3c/wcag-act-rules)
License: W3C Software and Document Notice and License
         (https://act-rules.github.io/pages/license/) — full text in
         LICENSE-W3C.txt; required NOTICE retained per its terms.

Selected rules (explicit, fixed): each maps to >=1 axe-core 4.13.0 rule via
the `actIds` metadata embedded in the axe build (verified at runtime).
The subset measures only scanner-rule fidelity, not the remediation skill.
"""
import hashlib, json, pathlib, sys, urllib.request

BASE = "https://www.w3.org/WAI/content-assets/wcag-act-rules/"
HERE = pathlib.Path(__file__).resolve().parent

# ruleId -> axe rule ids that declare this ACT rule in their actIds metadata
# (read from axe-core 4.13.0 at runtime; recorded here for transparency)
RULE_MAP = {
    "b5c3f8": ["html-has-lang"],
    "2779a5": ["document-title", "definition-list", "p-as-heading"],
    "e086e5": ["label", "select-name", "aria-input-field-name",
               "aria-toggle-field-name", "label-title-only"],
    "23a2a8": ["image-alt", "svg-img-alt", "role-img-alt", "area-alt"],
    "97a4e1": ["button-name", "input-button-name", "aria-command-name",
               "blink", "image-redundant-alt"],
    "c487ae": ["link-name", "area-alt", "accesskeys",
               "landmark-main-is-top-level"],
}


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "paired-pilot-calibration/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def main():
    idx_raw = fetch(BASE + "testcases.json")
    idx = json.loads(idx_raw)
    idx_sha = hashlib.sha256(idx_raw).hexdigest()
    print(f"testcases.json: {idx.get('count')} cases, sha256={idx_sha}")

    selected = [t for t in idx["testcases"] if t["ruleId"] in RULE_MAP]
    print(f"selected: {len(selected)} cases across {len(RULE_MAP)} rules")

    cases = []
    for t in selected:
        rel = t["relativePath"]
        url = t["url"]
        dest = HERE / "testcases" / rel.replace("testcases/", "")
        dest.parent.mkdir(parents=True, exist_ok=True)
        raw = fetch(url)
        dest.write_bytes(raw)
        sha = hashlib.sha256(raw).hexdigest()
        cases.append({
            "ruleId": t["ruleId"], "ruleName": t["ruleName"],
            "rulePage": t.get("rulePage"),
            "testcaseId": t["testcaseId"],
            "testcaseTitle": t.get("testcaseTitle"),
            "expected": t["expected"],
            "url": url,
            "localFile": str(dest.relative_to(HERE)),
            "sha256": sha,
            "axeRuleIds": RULE_MAP[t["ruleId"]],
        })
        print(f"  {t['ruleId']}/{t['testcaseId'][:12]} {t['expected']:12s} {len(raw)}B")

    out = {
        "name": idx.get("name"), "website": idx.get("website"),
        "license": idx.get("license"),
        "source_index": BASE + "testcases.json",
        "source_index_sha256": idx_sha,
        "retrieved": "2026-09-28",
        "revision_pinning": "content-pinned: sha256 of testcases.json + of each fetched test case HTML; upstream has no numeric revision",
        "count_selected": len(cases), "count_upstream": idx.get("count"),
        "rule_map": RULE_MAP,
        "cases": cases,
    }
    (HERE / "cases.json").write_text(json.dumps(out, indent=2))
    print(f"wrote {HERE/'cases.json'}")


if __name__ == "__main__":
    sys.exit(main())
