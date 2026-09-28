#!/usr/bin/env python3
"""test_score.py — negative/positive regression cases for score.py.

Run: python3 -m unittest harness/test_score.py -v   (from benchmarks/paired-pilot)
These tests exist because a previous revision silently mapped missing
artifacts to 0 violations — a false improvement. Keep them honest.
"""
import json, os, subprocess, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SCORE = os.path.join(HERE, "score.py")

BASE_SCOPE = {
    "runId": "r1", "runnerVersion": "audit.mjs v5", "scopeHash": "AAA",
    "statesHash": "SSS", "audited": 2, "errored": 0,
    "scenarios": [
        {"id": "http://x/", "status": "audited", "httpStatus": 200},
        {"id": "http://x/a", "status": "audited", "httpStatus": 200},
    ],
}
BASE_REPORT = {"runId": "r1", "runnerVersion": "audit.mjs v5",
               "scopeHash": "AAA", "pages": [
                   {"url": "http://x/", "violations": [{"id": "document-title", "nodes": [{}]}], "incomplete": []},
                   {"url": "http://x/a", "violations": [{"id": "html-has-lang", "nodes": [{}, {}]}], "incomplete": []},
               ], "configErrors": []}
BASE_HELD = {"results": [
    {"id": "c_pass", "status": "PASS", "evidence": ""},
    {"id": "c_fail", "status": "FAIL", "evidence": ""},
]}


def wj(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        if isinstance(obj, str):
            f.write(obj)
        else:
            json.dump(obj, f)


def make_tree(root, arm="arm1", scope=BASE_SCOPE, report=BASE_REPORT,
              held=BASE_HELD, base_held=BASE_HELD):
    wj(f"{root}/baseline/scope.json", BASE_SCOPE)
    wj(f"{root}/baseline/report.json", BASE_REPORT)
    wj(f"{root}/baseline/heldout/heldout.json", base_held)
    wj(f"{root}/{arm}/eval-status.env", "patch_apply_ok=1\n")
    if scope is not None:
        wj(f"{root}/{arm}/final/scope.json", scope)
    if report is not None:
        wj(f"{root}/{arm}/final/report.json", report)
    if held is not None:
        wj(f"{root}/{arm}/heldout/heldout.json", held)


def run_score(root):
    p = subprocess.run([sys.executable, SCORE, "arm1", "--eval-root", root,
                        "--out", f"{root}/scores.json"],
                       capture_output=True, text=True)
    return json.load(open(f"{root}/scores.json")), p.stdout


class TestScoreIntegrity(unittest.TestCase):

    def test_missing_report_is_not_comparable_not_zero(self):
        with tempfile.TemporaryDirectory() as d:
            make_tree(d, report=None)
            out, _ = run_score(d)
            a = out["arms"]["arm1"]
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")
            self.assertIsNone(a["violation_nodes_final"])
            self.assertIsNone(a["nodes_delta"])
            self.assertIn("report.json missing or malformed", a["report_problems"])

    def test_malformed_report_is_not_comparable(self):
        with tempfile.TemporaryDirectory() as d:
            make_tree(d, report="{not json")
            out, _ = run_score(d)
            a = out["arms"]["arm1"]
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")
            self.assertIsNone(a["violation_nodes_final"])

    def test_scenario_set_mismatch_flags(self):
        with tempfile.TemporaryDirectory() as d:
            s = dict(BASE_SCOPE)
            s["scenarios"] = [{"id": "http://x/", "status": "audited", "httpStatus": 200}]
            make_tree(d, scope=s)
            out, _ = run_score(d)
            a = out["arms"]["arm1"]
            self.assertFalse(a["scope_problems"] == [])
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_scenario_status_not_audited_flags(self):
        with tempfile.TemporaryDirectory() as d:
            s = dict(BASE_SCOPE)
            s["scenarios"] = [dict(x) for x in BASE_SCOPE["scenarios"]]
            s["scenarios"][1]["status"] = "errored"
            make_tree(d, scope=s)
            out, _ = run_score(d)
            self.assertTrue(any("not audited" in p for p in out["arms"]["arm1"]["scope_problems"]))

    def test_scopehash_mismatch_report_vs_scope(self):
        with tempfile.TemporaryDirectory() as d:
            r = dict(BASE_REPORT); r["scopeHash"] = "DIFFERENT"
            make_tree(d, report=r)
            out, _ = run_score(d)
            a = out["arms"]["arm1"]
            self.assertTrue(any("scopeHash" in p for p in a["report_problems"]))
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_missing_heldout_is_gap_not_pass(self):
        with tempfile.TemporaryDirectory() as d:
            make_tree(d, held=None)
            out, _ = run_score(d)
            a = out["arms"]["arm1"]
            self.assertIn("heldout.json missing or malformed", a["heldout_coverage_gaps"])
            self.assertIsNone(a["heldout"])

    def test_pass_to_not_tested_is_coverage_loss(self):
        with tempfile.TemporaryDirectory() as d:
            held = {"results": [
                {"id": "c_pass", "status": "NOT_TESTED", "evidence": "upstream down"},
                {"id": "c_fail", "status": "FAIL", "evidence": ""},
            ]}
            make_tree(d, held=held)
            out, _ = run_score(d)
            a = out["arms"]["arm1"]
            self.assertIn("c_pass", a["heldout_coverage_loss_PASS_to_NT"])
            self.assertNotIn("c_pass", a["heldout_regressions"])

    def test_missing_check_id_vs_baseline_flagged(self):
        with tempfile.TemporaryDirectory() as d:
            held = {"results": [{"id": "c_pass", "status": "PASS", "evidence": ""}]}
            make_tree(d, held=held)
            out, _ = run_score(d)
            self.assertIn("c_fail", out["arms"]["arm1"]["heldout_missing_checks"])

    def test_normal_comparison(self):
        with tempfile.TemporaryDirectory() as d:
            held = {"results": [
                {"id": "c_pass", "status": "PASS", "evidence": ""},
                {"id": "c_fail", "status": "PASS", "evidence": ""},
            ]}
            make_tree(d, held=held)
            out, _ = run_score(d)
            a = out["arms"]["arm1"]
            self.assertEqual(a["comparison"], "OK")
            self.assertEqual(a["violation_nodes_final"], 3)
            self.assertEqual(a["nodes_delta"], 0)
            self.assertIn("c_fail", a["heldout_improvements"])
            self.assertTrue(a["scope_identical"])


if __name__ == "__main__":
    unittest.main()
