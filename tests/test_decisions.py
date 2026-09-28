"""Regression tests for agent-result decisions; no agent or network is started."""
import ast
import asyncio
import copy
import hashlib
import re
import unittest
from pathlib import Path
from unittest.mock import AsyncMock

ROOT = Path(__file__).resolve().parents[1]


def load_definitions(filename, names):
    tree = ast.parse((ROOT / filename).read_text(encoding="utf-8"))
    body = [node for node in tree.body if
            isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in names
            or isinstance(node, ast.Assign) and any(
                isinstance(target, ast.Name) and target.id in names for target in node.targets)]
    namespace = {"hashlib": hashlib, "re": re}
    exec(compile(ast.Module(body=body, type_ignores=[]), filename, "exec"), namespace)
    return namespace


class BenchmarkDecisions(unittest.TestCase):
    def setUp(self):
        self.module = load_definitions("benchmark-v3.py", {
            "BATCHES", "EXPECTED_REPOS", "REQUIRED_ARTIFACTS", "validate_result"})
        scope_hash = "a" * 64
        patch = "diff --git a/index.html b/index.html\n"
        self.result = {
            "repo": "miniflux/v2", "booted": True, "failure": None,
            "scope_identical": True, "scope_hash_baseline": scope_hash,
            "scope_hash_final": scope_hash, "execution_complete": True,
            "errors_baseline": 0, "errors_final": 0, "axe_score": 0,
            "final_violations": 0, "final_eval_findings": 0, "regressions": 0,
            "coverage_gaps": [], "rounds": 2, "budget_exceeded": False,
            "budget_respected": True, "scope_vs_manifest": "identical",
            "review_resolved": True, "install_build": "pass", "final_validation": "pass",
            "artifacts": list(self.module["REQUIRED_ARTIFACTS"]),
            "patch_diff": patch, "patch_sha256": hashlib.sha256(patch.encode()).hexdigest(),
            "eval_replay": {
                "repo": "miniflux/v2", "patch_identity_ok": True, "replay_ok": True,
                "verdict": "PASS", "final_violations": 0, "scope_hash": scope_hash,
                "install_build": "pass", "evidence": "Clean replay logs attached",
            },
        }

    def verdict(self, result):
        return self.module["validate_result"](result)[0]

    def test_coherent_result_can_pass(self):
        self.assertEqual(self.verdict(self.result), "CONFIRMED")

    def test_replay_contradictions_cannot_pass(self):
        for field, value in {
            "repo": "wrong/repo", "patch_identity_ok": False, "replay_ok": False,
            "final_violations": 7, "scope_hash": "b" * 64,
            "install_build": "fail:build", "verdict": "FAIL",
        }.items():
            with self.subTest(field=field):
                result = copy.deepcopy(self.result)
                result["eval_replay"][field] = value
                self.assertEqual(self.verdict(result), "REJECTED")

    def test_missing_replay_evidence_cannot_pass(self):
        for field in ("repo", "patch_identity_ok", "replay_ok", "final_violations",
                      "scope_hash", "install_build", "evidence"):
            with self.subTest(field=field):
                result = copy.deepcopy(self.result)
                del result["eval_replay"][field]
                self.assertNotIn(self.verdict(result), ("CONFIRMED", "CONFIRMED_HORS_BUDGET"))

    def test_nonzero_or_missing_gate_counters_cannot_pass(self):
        for field in ("errors_baseline", "errors_final", "final_eval_findings", "regressions"):
            for value in (1, -1, None, False, "0"):
                with self.subTest(field=field, value=value):
                    result = copy.deepcopy(self.result)
                    result[field] = value
                    self.assertNotIn(self.verdict(result), ("CONFIRMED", "CONFIRMED_HORS_BUDGET"))

    def test_patch_digest_must_match(self):
        self.result["patch_sha256"] = "b" * 64
        self.assertEqual(self.verdict(self.result), "REJECTED")

    def test_missing_scope_hashes_are_not_identity(self):
        self.result["scope_hash_baseline"] = self.result["scope_hash_final"] = ""
        self.result["eval_replay"]["scope_hash"] = ""
        self.assertNotEqual(self.verdict(self.result), "CONFIRMED")

    def test_coverage_gap_cannot_pass(self):
        self.result["coverage_gaps"] = ["modal not exercised"]
        self.assertNotEqual(self.verdict(self.result), "CONFIRMED")

    def test_budget_is_checked_against_rounds(self):
        self.result["rounds"] = 4
        self.assertEqual(self.verdict(self.result), "REJECTED")
        self.result.update(budget_exceeded=True, budget_respected=False)
        self.assertEqual(self.verdict(self.result), "CONFIRMED_HORS_BUDGET")

    def test_artifact_substrings_are_not_paths(self):
        self.result["artifacts"] = [f"missing-{name}.txt" for name in self.result["artifacts"]]
        self.assertEqual(self.verdict(self.result), "REJECTED")

    def test_unrun_replay_is_incomplete(self):
        del self.result["eval_replay"]
        self.assertEqual(self.verdict(self.result), "INCOMPLETE")


class WorkflowDecisions(unittest.TestCase):
    def test_final_evaluation_controls_success_report(self):
        for filename in ("workflow.py", "workflow-cdv.py"):
            for findings in (0, 2, -1, None, False, "0"):
                with self.subTest(filename=filename, findings=findings):
                    module = load_definitions(filename, {"compute_status", "main"})
                    success = AsyncMock(return_value={"pr_url": "mock://success"})
                    partial = AsyncMock(return_value={"pr_url": "mock://partial"})
                    module.update({
                        "MAX_ROUNDS": 3, "META": {}, "log": lambda *args: None,
                        "register_workflow": AsyncMock(),
                        "audit": AsyncMock(return_value={"rules_violated": 1, "pages_count": 1,
                            "violations_md": "label missing", "setup_branch": "setup"}),
                        "fix": AsyncMock(return_value={"commit_sha": "abc", "branch": "fix"}),
                        "verify": AsyncMock(return_value={"accepted": True,
                            "remaining_violations": 0, "findings": "", "human_checks": "NVDA"}),
                        "final_eval": AsyncMock(return_value={"verdict": "PASS",
                            "new_findings": findings, "evidence": "Evaluation evidence"}),
                        "report_success": success, "report_partial": partial,
                    })
                    asyncio.run(module["main"]())
                    should_pass = type(findings) is int and findings == 0
                    self.assertEqual(success.await_count, int(should_pass))
                    self.assertEqual(partial.await_count, int(not should_pass))

    def test_verifier_requires_a_boolean_and_nonnegative_integer(self):
        for filename in ("workflow.py", "workflow-cdv.py"):
            decide = load_definitions(filename, {"compute_status"})["compute_status"]
            for result in (None, {}, {"accepted": "yes", "remaining_violations": 0},
                           {"accepted": True, "remaining_violations": -1},
                           {"accepted": True, "remaining_violations": False},
                           {"accepted": True, "remaining_violations": 2}):
                with self.subTest(filename=filename, result=result):
                    self.assertEqual(decide(result), "ERROR")
            self.assertEqual(decide({"accepted": True, "remaining_violations": 0}), "PASS")
            self.assertEqual(decide({"accepted": False, "remaining_violations": 2}), "PARTIAL")


if __name__ == "__main__":
    unittest.main()
