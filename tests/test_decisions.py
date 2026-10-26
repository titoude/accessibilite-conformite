"""Regression tests for the Devin workflow's computed decisions; no agent or network is started."""
import ast
import asyncio
import unittest
from pathlib import Path
from unittest.mock import AsyncMock

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = "integrations/devin/workflow.py"


def load_definitions(filename, names):
    tree = ast.parse((ROOT / filename).read_text(encoding="utf-8"))
    body = [node for node in tree.body if
            isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in names
            or isinstance(node, ast.Assign) and any(
                isinstance(target, ast.Name) and target.id in names for target in node.targets)]
    namespace = {}
    exec(compile(ast.Module(body=body, type_ignores=[]), filename, "exec"), namespace)
    return namespace


class WorkflowDecisions(unittest.TestCase):
    def test_final_evaluation_controls_success_report(self):
        for findings in (0, 2, -1, None, False, "0"):
            with self.subTest(findings=findings):
                module = load_definitions(WORKFLOW, {"compute_status", "main"})
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
        decide = load_definitions(WORKFLOW, {"compute_status"})["compute_status"]
        for result in (None, {}, {"accepted": "yes", "remaining_violations": 0},
                       {"accepted": True, "remaining_violations": -1},
                       {"accepted": True, "remaining_violations": False},
                       {"accepted": True, "remaining_violations": 2}):
            with self.subTest(result=result):
                self.assertEqual(decide(result), "ERROR")
        self.assertEqual(decide({"accepted": True, "remaining_violations": 0}), "PASS")
        self.assertEqual(decide({"accepted": False, "remaining_violations": 2}), "PARTIAL")

if __name__ == "__main__":
    unittest.main()
