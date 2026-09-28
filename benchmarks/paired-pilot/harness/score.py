#!/usr/bin/env python3
"""score.py — deterministic scoring for the paired pilot.

Reads:
  evaluation/baseline/{scope.json,report.json,heldout/heldout.json}
  evaluation/<arm>/{eval-status.env,final/scope.json,final/report.json,
                  heldout/heldout.json,evaluate.log}

Emits evaluation/scores.json + a compact stdout table. No verdict words like
"CONFIRMED" — this pilot reports measured deltas only. A single pair of arms
supports no causal or statistical claim; score.py computes observed numbers.

Comparison semantics:
  scope_identical     — scopeHash(final) == scopeHash(baseline)
  violations          — total violation NODES baseline vs arm final, per rule
  new_violations      — rule ids present in final but absent from baseline
  incomplete          — axe 'incomplete' counts (never silently absorbed)
  heldout             — per-check status baseline vs arm; regressions =
                        PASS->FAIL transitions, improvements = FAIL->PASS
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EVAL = os.path.join(ROOT, "evaluation")
ARMS = ["with-skill", "control"]


def load_json(path):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception as e:
        return {"_error": f"{e}"}


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


def violation_stats(report):
    """-> {rules: set, nodes: int, per_rule: {rule: nodes}, incomplete: int}"""
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
    return {r["id"]: r for r in h.get("results", [])}


def main():
    base_scope = load_json(os.path.join(EVAL, "baseline", "scope.json"))
    base_report = load_json(os.path.join(EVAL, "baseline", "report.json"))
    base_heldout = load_json(os.path.join(EVAL, "baseline", "heldout", "heldout.json"))
    base_stats = violation_stats(base_report)
    base_checks = check_map(base_heldout)
    base_hash = base_scope.get("scopeHash")

    out = {
        "baseline": {
            "scopeHash": base_hash,
            "audited": base_scope.get("audited"),
            "errored": base_scope.get("errored"),
            "violation_nodes": base_stats["nodes"],
            "violation_rules": base_stats["rules"],
            "incomplete": base_stats["incomplete"],
            "heldout": {k: v["status"] for k, v in base_checks.items()},
        },
        "arms": {},
    }

    for arm in ARMS:
        d = os.path.join(EVAL, arm)
        env = load_env(os.path.join(d, "eval-status.env"))
        scope = load_json(os.path.join(d, "final", "scope.json"))
        report = load_json(os.path.join(d, "final", "report.json"))
        heldout = load_json(os.path.join(d, "heldout", "heldout.json"))
        stats = violation_stats(report)
        checks = check_map(heldout)

        regressions, improvements, still_failing = [], [], []
        for cid, c in checks.items():
            b = base_checks.get(cid, {}).get("status")
            if b == "PASS" and c["status"] == "FAIL":
                regressions.append(cid)
            if b == "FAIL" and c["status"] == "PASS":
                improvements.append(cid)
            if b == "FAIL" and c["status"] == "FAIL":
                still_failing.append(cid)

        new_rules = sorted(set(stats["rules"]) - set(base_stats["rules"]))
        out["arms"][arm] = {
            "eval_status": env,
            "scopeHash_final": scope.get("scopeHash"),
            "scope_identical": bool(base_hash) and scope.get("scopeHash") == base_hash,
            "audited": scope.get("audited"),
            "errored": scope.get("errored"),
            "audit_exit": env.get("audit_exit"),
            "violation_nodes_final": stats["nodes"],
            "violation_rules_final": stats["rules"],
            "nodes_delta": base_stats["nodes"] - stats["nodes"],
            "new_violation_rules": new_rules,
            "incomplete_final": stats["incomplete"],
            "heldout": {k: v["status"] for k, v in checks.items()},
            "heldout_evidence": {k: v.get("evidence", "") for k, v in checks.items()},
            "heldout_regressions": regressions,
            "heldout_improvements": improvements,
            "heldout_still_failing": still_failing,
        }

    with open(os.path.join(EVAL, "scores.json"), "w") as f:
        json.dump(out, f, indent=2)

    # compact stdout table
    print(f"baseline: {base_stats['nodes']} violation nodes, rules={base_stats['rules']}, "
          f"incomplete={base_stats['incomplete']}, scope={base_hash}")
    for arm, a in out["arms"].items():
        print(f"\n[{arm}]")
        print(f"  apply={a['eval_status'].get('patch_apply_ok')} "
              f"install={a['eval_status'].get('install_ok')} "
              f"tests={a['eval_status'].get('tests_ok')} boot={a['eval_status'].get('boot_ok')}")
        print(f"  scope_identical={a['scope_identical']} audited={a['audited']} errored={a['errored']} audit_exit={a['audit_exit']}")
        print(f"  violations: {base_stats['nodes']} -> {a['violation_nodes_final']} (delta -{a['nodes_delta']}) rules={a['violation_rules_final']}")
        print(f"  new_rules={a['new_violation_rules']} incomplete={a['incomplete_final']}")
        print(f"  heldout regressions={a['heldout_regressions']} improvements={a['heldout_improvements']} still_failing={a['heldout_still_failing']}")
    print(f"\nwrote {os.path.join(EVAL, 'scores.json')}")


if __name__ == "__main__":
    main()
