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
import argparse, json, os, re, sys

REQUIRED_SCOPE_KEYS = ("runId", "runnerVersion", "scopeHash", "statesHash",
                       "scenarios", "audited", "errored", "total")
REQUIRED_REPORT_KEYS = ("runId", "runnerVersion", "scopeHash", "pages",
                        "configErrors")
HELDOUT_REQUIRED_KEYS = ("results",)
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
REQUIRED_ENV_KEYS = ("patch_identity_ok", "patch_apply_ok", "install_ok",
                     "tests_ok", "boot_ok", "audit_exit")


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


def _nonempty_str(v):
    return isinstance(v, str) and len(v.strip()) > 0


def _is_sha256(v):
    return isinstance(v, str) and bool(SHA256_RE.match(v))


def validate_scope(scope, expected_scenarios=None, baseline=None):
    """-> (problems list, scenario ids list). Empty problems = valid.
    Strict: nonempty typed identities, sha256-shaped hashes, no duplicate
    scenario ids, counters consistent, all scenarios audited, counters clean."""
    problems = []
    if scope is None:
        return ["scope.json missing or malformed"], []
    if not isinstance(scope, dict):
        return ["scope.json is not an object"], []
    for k in REQUIRED_SCOPE_KEYS:
        if k not in scope:
            problems.append(f"scope.json missing key '{k}'")
    if problems:
        return problems, []
    if not _nonempty_str(scope.get("runId")):
        problems.append("scope.runId empty or not a string")
    if not _nonempty_str(scope.get("runnerVersion")):
        problems.append("scope.runnerVersion empty or not a string")
    if not _is_sha256(scope.get("scopeHash")):
        problems.append("scope.scopeHash missing/not a sha256")
    if not _is_sha256(scope.get("statesHash")):
        problems.append("scope.statesHash missing/not a sha256")
    scen = scope.get("scenarios")
    ids = []
    if not isinstance(scen, list) or not scen:
        problems.append("scope.scenarios empty or not a list")
    else:
        seen = set()
        for i, s in enumerate(scen):
            if not isinstance(s, dict) or not _nonempty_str(s.get("id")):
                problems.append(f"scenario[{i}] missing/non-string id")
                continue
            if s["id"] in seen:
                problems.append(f"duplicate scenario id: {s['id']}")
            seen.add(s["id"])
            ids.append(s["id"])
            if s.get("status") != "audited":
                problems.append(f"scenario {s['id']} status={s.get('status')!r} (expected 'audited')")
            if s.get("error"):
                problems.append(f"scenario {s['id']} carries error: {s['error']}")
        if isinstance(scope.get("total"), int) and scope["total"] != len(scen):
            problems.append(f"scope.total={scope['total']} != {len(scen)} scenarios")
        if isinstance(scope.get("audited"), int) and scope["audited"] != len(scen):
            problems.append(f"scope.audited={scope['audited']} != {len(scen)} scenarios")
    if scope.get("errored") not in (0, "0", None):
        problems.append(f"scope.errored={scope.get('errored')}")
    if scope.get("crawlErrors"):
        problems.append(f"scope.crawlErrors non-empty: {scope['crawlErrors']}")
    if expected_scenarios is not None and set(expected_scenarios) != set(ids):
        problems.append(
            f"scenario set mismatch: missing={sorted(set(expected_scenarios) - set(ids))} "
            f"extra={sorted(set(ids) - set(expected_scenarios))}")
    if baseline and isinstance(baseline, dict):
        if scope.get("scopeHash") != baseline.get("scopeHash"):
            problems.append("scope.scopeHash differs from baseline (frozen scope violated)")
        if scope.get("statesHash") != baseline.get("statesHash"):
            problems.append("scope.statesHash differs from baseline (frozen states violated)")
    return problems, ids


def validate_report(report, scope=None, expected_page_ids=None):
    """-> problems list; empty = valid. Strict: identity match with its own
    scope, exact 1:1 page set vs scenario ids, explicit violations arrays,
    per-page error gating, no runner errors."""
    problems = []
    if report is None:
        return ["report.json missing or malformed"]
    if not isinstance(report, dict):
        return ["report.json is not an object"]
    for k in REQUIRED_REPORT_KEYS:
        if k not in report:
            problems.append(f"report.json missing key '{k}'")
    if problems:
        return problems
    if not _nonempty_str(report.get("runId")):
        problems.append("report.runId empty or not a string")
    if not _nonempty_str(report.get("runnerVersion")):
        problems.append("report.runnerVersion empty or not a string")
    if not _is_sha256(report.get("scopeHash")):
        problems.append("report.scopeHash missing/not a sha256")
    if scope and isinstance(scope, dict):
        if _nonempty_str(scope.get("runId")) and report.get("runId") != scope["runId"]:
            problems.append("report.runId != scope.runId (report does not belong to this run)")
        if _nonempty_str(scope.get("runnerVersion")) and report.get("runnerVersion") != scope["runnerVersion"]:
            problems.append("report.runnerVersion != scope.runnerVersion")
        if _is_sha256(scope.get("scopeHash")) and report.get("scopeHash") != scope["scopeHash"]:
            problems.append("report.scopeHash != scope.scopeHash (report does not belong to this run)")
    if report.get("configErrors"):
        problems.append(f"runner configErrors: {report['configErrors']}")
    if report.get("crawlErrors"):
        problems.append(f"runner crawlErrors: {report['crawlErrors']}")
    pages = report.get("pages")
    if not isinstance(pages, list) or not pages:
        problems.append("report.pages empty or not a list")
        return problems
    page_ids = []
    for i, pg in enumerate(pages):
        if not isinstance(pg, dict) or not _nonempty_str(pg.get("url")):
            problems.append(f"page[{i}] missing/non-string url")
            continue
        page_ids.append(pg["url"])
        if pg.get("error"):
            problems.append(f"page {pg['url']} carries error: {pg['error']}")
        if not isinstance(pg.get("violations"), list):
            problems.append(f"page {pg['url']}: 'violations' missing or not a list")
        if "incomplete" in pg and not isinstance(pg["incomplete"], list):
            problems.append(f"page {pg['url']}: 'incomplete' not a list")
        if pg.get("httpStatus") is not None and not isinstance(pg["httpStatus"], int):
            problems.append(f"page {pg['url']}: httpStatus not an int")
    if len(set(page_ids)) != len(page_ids):
        problems.append(f"duplicate page urls: {sorted(u for u in set(page_ids) if page_ids.count(u) > 1)}")
    if expected_page_ids is not None:
        if sorted(page_ids) != sorted(expected_page_ids):
            problems.append(
                f"page set != scenario set: missing={sorted(set(expected_page_ids) - set(page_ids))} "
                f"extra={sorted(set(page_ids) - set(expected_page_ids))}")
    return problems


def replay_problems(env):
    """eval-status.env must prove the replay happened: identity, apply,
    install, boot. A failed/absent replay means the arm has no valid final
    artifacts — raw measurements are still reported, separately."""
    probs = []
    if not env:
        return ["eval-status.env missing or empty — no replay evidence"]
    for k in REQUIRED_ENV_KEYS:
        if k not in env:
            probs.append(f"eval-status.env missing key '{k}'")
    if probs:
        return probs
    for k in ("patch_identity_ok", "patch_apply_ok", "install_ok", "boot_ok"):
        if env.get(k) not in ("true", "1"):
            probs.append(f"replay step failed: {k}={env.get(k)}")
    # tests_ok is recorded but not gated: the app suite may legitimately fail
    if env.get("audit_exit") not in ("0", "0.0"):
        probs.append(f"audit exit nonzero/missing: {env.get('audit_exit')}")
    return probs


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
    if not h or not isinstance(h.get("results"), list):
        return {}
    return {r["id"]: r for r in h["results"] if isinstance(r, dict) and "id" in r}


def heldout_control_problems(arm_checks):
    """Instrumentation controls (kind:'control') must PASS — a control
    failure means the measurement apparatus itself is untrustworthy, an
    integrity gap, not a clean comparison."""
    probs = []
    for cid, r in arm_checks.items():
        if r.get("kind") == "control" and r.get("status") != "PASS":
            probs.append(f"instrumentation control {cid} status={r.get('status')}")
    for cid in ("ctrl_name_positive", "ctrl_name_negative"):
        if cid not in arm_checks:
            probs.append(f"required control {cid} absent from heldout results")
    return probs


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

        scope_probs, arm_ids = validate_scope(scope,
            expected_scenarios=base_scenarios or None, baseline=base_scope)
        rep_probs = validate_report(report, scope, expected_page_ids=arm_ids or None)
        stats = violation_stats(report) if not rep_probs else None
        checks = check_map(heldout) if heldout else {}
        held_cmp = compare_heldout(base_checks, checks, heldout is not None)
        ctrl_probs = heldout_control_problems(checks) if heldout else []
        replay_probs = replay_problems(env)

        comparable = (not scope_probs) and (not rep_probs) and stats is not None \
            and base_stats is not None and not base_scope_probs \
            and not base_rep_probs and not replay_probs
        arm_out = {
            "eval_status": env,
            "artifact_errors": [e for e in (se, re_, he) if e],
            "scope_problems": scope_probs,
            "report_problems": rep_probs,
            "replay_evidence_problems": replay_probs,
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
            "heldout_coverage_gaps": held_cmp["coverage_gaps"] + ctrl_probs,
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
