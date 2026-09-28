#!/usr/bin/env python3
"""test_score.py — negative/positive regression cases for score.py.

Run: python3 -m unittest harness/test_score.py -v   (from benchmarks/paired-pilot)
These tests exist because a previous revision silently mapped missing
artifacts to 0 violations — a false improvement. Keep them honest.
"""
import json, os, subprocess, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SCORE = os.path.join(HERE, "score.py")

H1 = "a" * 64
H2 = "b" * 64
BASE_SCOPE = {
    "runId": "r1", "runnerVersion": "audit.mjs v5", "scopeHash": H1,
    "statesHash": H2, "audited": 2, "errored": 0, "total": 2,
    "crawlErrors": [],
    "scenarios": [
        {"id": "http://x/", "status": "audited", "httpStatus": 200},
        {"id": "http://x/a", "status": "audited", "httpStatus": 200},
    ],
}
BASE_REPORT = {"runId": "r1", "runnerVersion": "audit.mjs v5",
               "scopeHash": H1, "crawlErrors": [], "pages": [
                   {"url": "http://x/", "violations": [{"id": "document-title", "nodes": [{}]}], "incomplete": []},
                   {"url": "http://x/a", "violations": [{"id": "html-has-lang", "nodes": [{}, {}]}], "incomplete": []},
               ], "configErrors": []}
BASE_HELD = {"results": [
    {"id": "c_pass", "kind": "check", "status": "PASS", "evidence": ""},
    {"id": "c_fail", "kind": "check", "status": "FAIL", "evidence": ""},
    {"id": "ctrl_name_positive", "kind": "control", "status": "PASS", "evidence": ""},
    {"id": "ctrl_name_negative", "kind": "control", "status": "PASS", "evidence": ""},
]}
GOOD_ENV_MINI = ("eval_exit=0\npatch_identity_ok=true\npatch_apply_ok=true\n"
                 "install_ok=true\ntests_ok=true\nboot_ok=true\n"
                 "audit_exit=0\nheldout_exit=0\n")


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
    wj(f"{root}/{arm}/eval-status.env", GOOD_ENV_MINI)
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
            s["total"] = 1; s["audited"] = 1
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
            self.assertTrue(any("expected 'audited'" in p for p in out["arms"]["arm1"]["scope_problems"]))

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


# --- Mutant suite: uses the REAL committed baseline (94 violation nodes) ----
# Each mutant must yield NOT_COMPARABLE (or an integrity gap), never a clean
# delta. These came from an independent review that produced false-OK
# comparisons with the actual artifacts.

REAL_BASE = os.path.join(os.path.dirname(HERE), "evaluation", "baseline")
GOOD_ENV = ("eval_exit=0\npatch_identity_ok=true\npatch_apply_ok=true\n"
            "install_ok=true\ntests_ok=true\nboot_ok=true\n"
            "audit_exit=0\nheldout_exit=1\n")


def real_tree(root, arm="arm1", scope=None, report=None, held=None, env=GOOD_ENV):
    """Copy the real baseline into baseline/ AND arm1/ (an unmutated copy of
    the baseline artifacts is a valid 'no-change' arm), then apply mutations."""
    import shutil
    for dest in ("baseline", arm):
        d = f"{root}/{dest}"
        shutil.copytree(REAL_BASE, d)
        os.makedirs(f"{d}/final", exist_ok=True)
        shutil.copy(REAL_BASE + "/scope.json", f"{d}/final/scope.json")
        shutil.copy(REAL_BASE + "/report.json", f"{d}/final/report.json")
    wj(f"{root}/{arm}/eval-status.env", env)
    if scope is not None:
        wj(f"{root}/{arm}/final/scope.json", scope)
    if report is not None:
        wj(f"{root}/{arm}/final/report.json", report)
    if held is not None:
        wj(f"{root}/{arm}/heldout/heldout.json", held)


def load_real(name):
    return json.load(open(f"{REAL_BASE}/{name}"))


class TestRealBaselineMutants(unittest.TestCase):

    def _arm(self, d):
        out, _ = run_score(d)
        return out["arms"]["arm1"]

    def test_real_unmutated_copy_is_ok(self):
        with tempfile.TemporaryDirectory() as d:
            real_tree(d)
            a = self._arm(d)
            self.assertEqual(a["comparison"], "OK")
            self.assertEqual(a["violation_nodes_final"], 94)

    def test_empty_pages_array(self):
        with tempfile.TemporaryDirectory() as d:
            r = load_real("report.json"); r["pages"] = []
            real_tree(d, report=r)
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")
            self.assertIsNone(a["nodes_delta"])

    def test_removed_last_page(self):
        with tempfile.TemporaryDirectory() as d:
            r = load_real("report.json"); r["pages"] = r["pages"][:-1]
            real_tree(d, report=r)
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_page_missing_violations_key(self):
        with tempfile.TemporaryDirectory() as d:
            r = load_real("report.json")
            for p in r["pages"]:
                p.pop("violations", None)
            real_tree(d, report=r)
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_report_runid_mismatch_vs_scope(self):
        with tempfile.TemporaryDirectory() as d:
            r = load_real("report.json"); r["runId"] = "aaaa-wrong"
            real_tree(d, report=r)
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_stateshash_differs_from_baseline(self):
        with tempfile.TemporaryDirectory() as d:
            s = load_real("scope.json"); s["statesHash"] = "0" * 64
            real_tree(d, scope=s)
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_scopehash_differs_from_baseline_both_files(self):
        with tempfile.TemporaryDirectory() as d:
            s = load_real("scope.json"); r = load_real("report.json")
            s["scopeHash"] = r["scopeHash"] = "f" * 64
            real_tree(d, scope=s, report=r)
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_errored_nonzero(self):
        with tempfile.TemporaryDirectory() as d:
            s = load_real("scope.json"); s["errored"] = 1
            real_tree(d, scope=s)
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_page_error_field(self):
        with tempfile.TemporaryDirectory() as d:
            r = load_real("report.json"); r["pages"][0]["error"] = "timeout"
            real_tree(d, report=r)
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_duplicate_scope_scenario(self):
        with tempfile.TemporaryDirectory() as d:
            s = load_real("scope.json")
            s["scenarios"].append(dict(s["scenarios"][0]))
            s["total"] = len(s["scenarios"]); s["audited"] = len(s["scenarios"])
            real_tree(d, scope=s)
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_empty_runid(self):
        with tempfile.TemporaryDirectory() as d:
            s = load_real("scope.json"); r = load_real("report.json")
            s["runId"] = r["runId"] = ""
            real_tree(d, scope=s, report=r)
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_failed_replay_evidence_not_comparable(self):
        with tempfile.TemporaryDirectory() as d:
            real_tree(d, env="eval_exit=2\npatch_identity_ok=true\npatch_apply_ok=false\n"
                             "install_ok=false\ntests_ok=false\nboot_ok=false\naudit_exit=\nheldout_exit=\n")
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")
            self.assertTrue(a["replay_evidence_problems"])

    def test_missing_eval_env_not_comparable(self):
        with tempfile.TemporaryDirectory() as d:
            real_tree(d, env="")
            a = self._arm(d)
            self.assertEqual(a["comparison"], "NOT_COMPARABLE")

    def test_control_failure_is_integrity_gap(self):
        with tempfile.TemporaryDirectory() as d:
            h = load_real("heldout/heldout.json")
            for r in h["results"]:
                if r["id"].startswith("ctrl_"):
                    r["status"] = "FAIL"
            real_tree(d, held=h)
            a = self._arm(d)
            self.assertTrue(any("ctrl" in g for g in a["heldout_coverage_gaps"]))


if __name__ == "__main__":
    unittest.main()
