#!/usr/bin/env python3
"""score.py — deterministic scoring for the paired pilot.

Reads (defaults, overridable via argv):
  <eval-root>/baseline/{scope.json,report.json,heldout/heldout.json}
  <eval-root>/<arm>/{eval-status.env,final/scope.json,final/report.json,
                    heldout/heldout.json,evaluate.log}

Emits <eval-root>/scores.json + a compact stdout table. No verdict words like
"CONFIRMED" — this pilot reports measured deltas only.

Integrity semantics (hardened after review):
  * A missing or malformed report/scope/heldout artifact NEVER degrades to
    zero — counts become null and the arm is marked NOT_COMPARABLE.
  * report.json and scope.json are cross-validated: runId present, identical
    scopeHash in both, runnerVersion present, statesHash present, and the
    scenario id set + statuses must exactly match the baseline's.
  * Held-out coverage: a missing heldout.json or a missing check id is a
    coverage_gap; a baseline PASS observed as NOT_TESTED is a coverage_loss
    (upstream dependency withdrew evidence — flagged, never neutral).
  * Violation deltas are only computed when both sides validate; new
    violation rules are still listed when the arm report alone validates.

Usage:
  python3 score.py [--eval-root evaluation] [--arm with-skill control ...]
                   [--baseline baseline] [--out scores.json]
"""
import argparse, json, os, sys

REQUIRED_SCOPE_KEYS = ("runId", "runnerVersion", "scopeHash", "statesHash",
                       "scenarios", "audited", "errored")
REQUIRED_REPORT_KEYS = ("runId", "runnerVersion", "scopeHash", "pages")
HELDOUT_REQUIRED_KEYS = ("results",)


def load_json(path):
    """-> (data_or_None, error_or_None). Missing/malformed is explicit."""
    try:
        with open(path) as f:
            return json.load(f), None
    except FileNotFoundError:
        return None, "missing"
    except Exception as e:
        return None, f"malformed: {e}"


def load_env(path):
    out = {}
    try:
        for line in open(path):
            if "=" in line:
                k, v = line.rstrip("\n").split("=", 1)
                out[k] = v
    except FileNotFoundError:
        pass
    return out


def validate_scope(scope, expected_scenarios=None):
    """-> (problems list, scenario_statuses dict). Empty problems = valid."""
    problems = []
    if scope is None:
        return ["scope.json missing or malformed"], {}
    for k in REQUIRED_SCOPE_KEYS:
        if k not in scope:
            problems.append(f"scope.json missing key '{k}'")
    if problems:
        return problems, {}
    statuses = {s.get("id"): s.get("status") for s in scope.get("scenarios", [])}
    if expected_scenarios is not None:
        exp = set(expected_scenarios)
        got = set(statuses)
        if exp != got:
            problems.append(
                f"scenario set mismatch: missing={sorted(exp - got)} extra={sorted(got - exp)}")
        else:
            bad = {i: s for i, s in statuses.items() if s != "audited"}
            if bad:
                problems.append(f"scenarios not audited: {bad}")
    return problems, statuses


def validate_report(report, scope=None):
    """-> problems list; empty = valid."""
    problems = []
    if report is None:
        return ["report.json missing or malformed"]
    for k in REQUIRED_REPORT_KEYS:
        if k not in report:
            problems.append(f"report.json missing key '{k}'")
    if problems:
        return problems
    if scope and scope.get("scopeHash") and report.get("scopeHash") != scope["scopeHash"]:
        problems.append("report.scopeHash != scope.scopeHash (report does not belong to this run)")
    if report.get("configErrors"):
        problems.append(f"runner configErrors: {report['configErrors']}")
    return problems


def violation_stats(report):
    """-> stats dict, or None if the report did not validate."""
    if report is None:
        return None
    rules, per_rule, nodes, incomplete = set(), {}, 0, 0
    for page in report.get("pages", []):
        for v in page.get("violations", []):
            n = len(v.get("nodes", []))
            rules.add(v["id"])
            per_rule[v["id"]] = per_rule.get(v["id"], 0) + n
            nodes += n
        for v in page.get("incomplete", []):
            incomplete += len(v.get("nodes", []) or [1])
    return {"rules": sorted(rules), "nodes": nodes, "per_rule": per_rule,
            "incomplete": incomplete}


def check_map(h):
    return {r["id"]: r for r in (h or {}).get("results", [])}


def compare_heldout(base_checks, arm_checks, arm_has_heldout):
    """Per-check transitions. NOT_TESTED counts as neither pass nor fail;
    a PASS->NOT_TESTED transition is a coverage LOSS and is flagged."""
    regressions, improvements, still_failing = [], [], []
    coverage_loss, coverage_gap, missing_checks = [], [], []
    for cid, b in base_checks.items():
        if cid not in arm_checks:
            missing_checks.append(cid)
            continue
        a = arm_checks[cid]["status"]
        bs = b["status"]
        if bs == "PASS" and a == "FAIL":
            regressions.append(cid)
        elif bs == "PASS" and a == "NOT_TESTED":
            coverage_loss.append(cid)
        elif bs == "FAIL" and a == "PASS":
            improvements.append(cid)
        elif bs == "FAIL" and a == "FAIL":
            still_failing.append(cid)
    if not arm_has_heldout:
        coverage_gap.append("heldout.json missing or malformed")
    return {
        "regressions": sorted(regressions),
        "improvements": sorted(improvements),
        "still_failing": sorted(still_failing),
        "coverage_loss_PASS_to_NT": sorted(coverage_loss),
        "missing_checks_vs_baseline": sorted(missing_checks),
        "coverage_gaps": coverage_gap,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("arms", nargs="*", help="arm names (default: with-skill control)")
    ap.add_argument("--eval-root", default=os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "evaluation"))
    ap.add_argument("--baseline", default="baseline")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()
    ev = args.eval_root
    arms = args.arms or ["with-skill", "control"]
    out_path = args.out or os.path.join(ev, "scores.json")

    base_scope, be1 = load_json(os.path.join(ev, args.baseline, "scope.json"))
    base_report, be2 = load_json(os.path.join(ev, args.baseline, "report.json"))
    base_heldout, be3 = load_json(os.path.join(ev, args.baseline, "heldout", "heldout.json"))
    base_scope_probs, base_statuses = validate_scope(base_scope)
    base_rep_probs = validate_report(base_report, base_scope)
    base_stats = violation_stats(base_report) if not base_rep_probs else None
    base_checks = check_map(base_heldout) if base_heldout else {}
    base_hash = (base_scope or {}).get("scopeHash")
    base_scenarios = list(base_statuses)

    out = {
        "baseline": {
            "dir": args.baseline,
            "artifact_errors": [e for e in (be1, be2, be3) if e],
            "scope_problems": base_scope_probs,
            "report_problems": base_rep_probs,
            "scopeHash": base_hash,
            "statesHash": (base_scope or {}).get("statesHash"),
            "audited": (base_scope or {}).get("audited"),
            "errored": (base_scope or {}).get("errored"),
            "violation_nodes": base_stats["nodes"] if base_stats else None,
            "violation_rules": base_stats["rules"] if base_stats else None,
            "incomplete": base_stats["incomplete"] if base_stats else None,
            "heldout": {k: v["status"] for k, v in base_checks.items()},
            "heldout_available": base_heldout is not None,
        },
        "arms": {},
    }

    for arm in arms:
        d = os.path.join(ev, arm)
        env = load_env(os.path.join(d, "eval-status.env"))
        scope, se = load_json(os.path.join(d, "final", "scope.json"))
        report, re_ = load_json(os.path.join(d, "final", "report.json"))
        heldout, he = load_json(os.path.join(d, "heldout", "heldout.json"))

        scope_probs, _ = validate_scope(scope, expected_scenarios=base_scenarios or None)
        rep_probs = validate_report(report, scope)
        stats = violation_stats(report) if not rep_probs else None
        checks = check_map(heldout) if heldout else {}
        held_cmp = compare_heldout(base_checks, checks, heldout is not None)

        comparable = (not scope_probs) and (not rep_probs) and stats is not None \
            and base_stats is not None
        arm_out = {
            "eval_status": env,
            "artifact_errors": [e for e in (se, re_, he) if e],
            "scope_problems": scope_probs,
            "report_problems": rep_probs,
            "comparable": comparable,
            "comparison": "OK" if comparable else "NOT_COMPARABLE",
            "scopeHash_final": (scope or {}).get("scopeHash"),
            "statesHash_final": (scope or {}).get("statesHash"),
            "scope_identical": bool(base_hash) and (scope or {}).get("scopeHash") == base_hash,
            "states_identical": bool(base_scope) and
                (scope or {}).get("statesHash") == base_scope.get("statesHash"),
            "audited": (scope or {}).get("audited"),
            "errored": (scope or {}).get("errored"),
            "audit_exit": env.get("audit_exit"),
            "violation_nodes_final": stats["nodes"] if stats else None,
            "violation_rules_final": stats["rules"] if stats else None,
            "nodes_delta": (base_stats["nodes"] - stats["nodes"]) if (comparable) else None,
            "new_violation_rules": (sorted(set(stats["rules"]) - set(base_stats["rules"]))
                                    if stats and base_stats else None),
            "incomplete_final": stats["incomplete"] if stats else None,
            "heldout": {k: v["status"] for k, v in checks.items()} or None,
            "heldout_evidence": {k: v.get("evidence", "") for k, v in checks.items()} or None,
            "heldout_regressions": held_cmp["regressions"],
            "heldout_improvements": held_cmp["improvements"],
            "heldout_still_failing": held_cmp["still_failing"],
            "heldout_coverage_loss_PASS_to_NT": held_cmp["coverage_loss_PASS_to_NT"],
            "heldout_missing_checks": held_cmp["missing_checks_vs_baseline"],
            "heldout_coverage_gaps": held_cmp["coverage_gaps"],
        }
        out["arms"][arm] = arm_out

    with open(out_path, "w") as f:
        json.dump(out, f, indent=2)

    b = out["baseline"]
    print(f"baseline[{args.baseline}]: nodes={b['violation_nodes']} "
          f"rules={b['violation_rules']} incomplete={b['incomplete']} "
          f"scope={b['scopeHash']} problems={b['scope_problems'] + b['report_problems']}")
    for arm, a in out["arms"].items():
        print(f"\n[{arm}] comparison={a['comparison']}")
        if a["scope_problems"] or a["report_problems"] or a["artifact_errors"]:
            print(f"  artifact_errors={a['artifact_errors']}")
            print(f"  scope_problems={a['scope_problems']}")
            print(f"  report_problems={a['report_problems']}")
        print(f"  apply={a['eval_status'].get('patch_apply_ok')} "
              f"install={a['eval_status'].get('install_ok')} "
              f"tests={a['eval_status'].get('tests_ok')} boot={a['eval_status'].get('boot_ok')}")
        print(f"  scope_identical={a['scope_identical']} states_identical={a['states_identical']} "
              f"audited={a['audited']} errored={a['errored']} audit_exit={a['audit_exit']}")
        print(f"  violations: {b['violation_nodes']} -> {a['violation_nodes_final']} "
              f"(delta={a['nodes_delta']}) rules={a['violation_rules_final']}")
        print(f"  new_rules={a['new_violation_rules']} incomplete={a['incomplete_final']}")
        print(f"  heldout regressions={a['heldout_regressions']} "
              f"improvements={a['heldout_improvements']} still_failing={a['heldout_still_failing']} "
              f"coverage_loss={a['heldout_coverage_loss_PASS_to_NT']} "
              f"missing={a['heldout_missing_checks']}")
    print(f"\nwrote {out_path}")


if __name__ == "__main__":
    main()
