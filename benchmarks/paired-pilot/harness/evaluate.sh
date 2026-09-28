#!/usr/bin/env bash
# evaluate.sh — independent evaluator replay for one pilot arm.
#
# Replays a worker's patch on a CLEAN clone of the pinned whoogle commit:
#   1. verify patch sha256 (if declared)
#   2. git apply (record success/failure verbatim)
#   3. frozen install: venv + pip install -r harness/whoogle-frozen-requirements.txt
#      (every transitive dep pinned at freeze time — identical for both arms)
#   4. project test suite (pytest) + boot smoke = install_build
#   5. frozen audit (harness/audit.whoogle.mjs) -> final report + scope
#   6. held-out checks (harness/heldout-checks.mjs)
#
# Usage:
#   harness/evaluate.sh <clone-dir> <patch.diff> <out-dir> [declared-sha256]
#
# Safety contract (hardened after review):
#   * <clone-dir> must NOT exist — the script never deletes a caller path.
#   * the target port must be free — a live listener means a foreign build
#     could be scanned; the script refuses rather than risk it.
#   * after boot it verifies the listening socket belongs to the child PID
#     it spawned (not just "something answered HTTP 200").
# Exit code is informational only (0/1/2 propagate to eval-status.env).
set -u
CLONE_DIR="${1:?usage: evaluate.sh <new-clone-dir> <patch.diff> <out-dir> [declared-sha256]}"
PATCH="${2:?missing patch path}"; OUT="${3:?missing out dir}"; DECLARED_SHA="${4:-}"
HARNESS="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$HARNESS/../../.." && pwd)"
REPO_URL="https://github.com/benbusby/whoogle-search"
PIN="0543f86528678ab60a20b3049483975add6b6e40"
PORT="${PILOT_PORT:-5001}"
FROZEN_REQS="$HARNESS/whoogle-frozen-requirements.txt"

# Normalize every caller path BEFORE any cd — the script changes directory
# later; a relative patch/out path would silently resolve wrong, and a
# relative CLONE_DIR check could pass while targeting the wrong dir.
CLONE_DIR="$(realpath -m "$CLONE_DIR")"
PATCH="$(realpath -m "$PATCH")"
OUT="$(realpath -m "$OUT")"
[ -f "$PATCH" ] || { echo "REFUSAL: patch '$PATCH' not found" >&2; exit 2; }

if [ -e "$CLONE_DIR" ]; then
  echo "REFUSAL: clone dir '$CLONE_DIR' already exists — evaluate.sh never reuses or deletes caller paths. Choose a fresh directory." >&2
  exit 2
fi
if [ -d "$OUT" ] && [ -n "$(ls -A "$OUT" 2>/dev/null)" ]; then
  echo "REFUSAL: out dir '$OUT' exists and is non-empty — no stale output reuse. Choose a fresh directory." >&2
  exit 2
fi
if curl -sf -o /dev/null --max-time 2 "http://127.0.0.1:$PORT/" || ss -ltn "sport = :$PORT" 2>/dev/null | grep -q ":$PORT"; then
  echo "REFUSAL: port $PORT is already occupied — a 200/OK from a foreign build would contaminate the audit." >&2
  exit 2
fi
mkdir -p "$OUT"
exec > >(tee -a "$OUT/evaluate.log") 2>&1

echo "=== evaluate.sh $(date -u +%FT%TZ) ==="
echo "clone_dir=$CLONE_DIR patch=$PATCH out=$OUT declared_sha=$DECLARED_SHA"
echo "host: $(uname -a)"

write_status() {
  cat > "$OUT/eval-status.env" <<EOF
eval_exit=$1
patch_identity_ok=$2
patch_apply_ok=$3
install_ok=$4
tests_ok=$5
boot_ok=$6
audit_exit=$7
heldout_exit=$8
EOF
}

# --- 0. clean clone at pinned commit -------------------------------------
git clone --quiet "$REPO_URL" "$CLONE_DIR"
cd "$CLONE_DIR" || { write_status 2 false false false false false "" ""; exit 2; }
git checkout --quiet "$PIN"
ACTUAL_SHA=$(git rev-parse HEAD)
echo "checkout: $ACTUAL_SHA (expected $PIN)"
[ "$ACTUAL_SHA" = "$PIN" ] || { echo "COMMIT MISMATCH"; write_status 2 false false false false false "" ""; exit 2; }

# --- 1. patch identity ----------------------------------------------------
PATCH_SHA=$(sha256sum "$PATCH" | cut -d' ' -f1)
echo "patch sha256: $PATCH_SHA"
IDENTITY_OK=true
if [ -n "$DECLARED_SHA" ] && [ "$PATCH_SHA" != "$DECLARED_SHA" ]; then
  echo "PATCH IDENTITY MISMATCH: declared=$DECLARED_SHA actual=$PATCH_SHA"
  IDENTITY_OK=false
fi

# --- 2. apply --------------------------------------------------------------
APPLY_OK=false
if git apply --check "$PATCH" 2> "$OUT/apply-check.log"; then
  if git apply "$PATCH" 2>> "$OUT/apply-check.log"; then
    APPLY_OK=true
    echo "patch applied cleanly"
  fi
else
  echo "git apply --check failed:"; cat "$OUT/apply-check.log"
fi
if [ "$APPLY_OK" = false ]; then
  echo "patch did not apply — audit+heldout still run on the UNPATCHED clone to keep coverage honest"
fi

# --- 3. frozen install -----------------------------------------------------
INSTALL_OK=false
[ -f "$FROZEN_REQS" ] || { echo "MISSING frozen requirements: $FROZEN_REQS"; write_status 2 "$IDENTITY_OK" "$APPLY_OK" false false false "" ""; exit 2; }
python3 -m venv .venv && .venv/bin/pip install --quiet -r "$FROZEN_REQS" > "$OUT/pip.log" 2>&1
if [ $? -eq 0 ] && .venv/bin/python -c "import app" 2>> "$OUT/pip.log"; then
  INSTALL_OK=true
  .venv/bin/pip freeze >> "$OUT/pip.log" 2>&1   # actual resolved deps, recorded
  echo "install OK (venv + FROZEN requirements — transitive pins identical across arms)"
else
  echo "INSTALL FAILED"; tail -20 "$OUT/pip.log"
fi

# --- 4. project tests (bounded) --------------------------------------------
TESTS_OK=false
if [ "$INSTALL_OK" = true ]; then
  if timeout 300 .venv/bin/python -m pytest test/ -x -q > "$OUT/pytest.log" 2>&1; then
    TESTS_OK=true; echo "pytest PASS"
  else
    echo "pytest FAIL/timeout:"; tail -15 "$OUT/pytest.log"
  fi
fi

# --- 5. boot + audit + heldout ----------------------------------------------
BOOT_OK=false; AUDIT_EXIT=""; HELDOUT_EXIT=""
if [ "$INSTALL_OK" = true ]; then
  WHOOGLE_CSP=0 .venv/bin/python -um app --host 127.0.0.1 --port "$PORT" > "$OUT/boot.log" 2>&1 &
  APP_PID=$!
  for i in $(seq 1 30); do
    curl -sf -o /dev/null "http://127.0.0.1:$PORT/" && { BOOT_OK=true; break; }
    kill -0 $APP_PID 2>/dev/null || break   # child died — don't wait for a ghost
    sleep 1
  done
  # Ownership check: the socket must belong to OUR child pid, and the page must be whoogle.
  if [ "$BOOT_OK" = true ]; then
    OWNER=$(ss -ltnp "sport = :$PORT" 2>/dev/null | grep -o "pid=[0-9]*" | cut -d= -f2 | head -1)
    TITLE=$(curl -s --max-time 5 "http://127.0.0.1:$PORT/" | grep -o '<title>[^<]*' | head -1)
    if [ "$OWNER" != "$APP_PID" ]; then
      echo "LISTENER OWNERSHIP MISMATCH: port $PORT owned by pid=$OWNER, our child=$APP_PID — refusing to scan"
      BOOT_OK=false
    elif ! echo "$TITLE" | grep -qi "whoogle"; then
      echo "LISTENER CONTENT MISMATCH: title='$TITLE' does not look like whoogle — refusing to scan"
      BOOT_OK=false
    else
      echo "boot verified: pid $APP_PID owns :$PORT, title='$TITLE'"
    fi
  fi
  echo "boot_ok=$BOOT_OK"
  if [ "$BOOT_OK" = true ]; then
    # audit.mjs resolves playwright/axe-core via createRequire(process.cwd()) —
    # run node from the harness repo root, which carries the pinned deps.
    # --wait 500: settled-state precondition (evaluator v3, post-dispatch
    # amendment — 0.2s max-height transition on .content.open made the
    # config-panel scan racy: 94 vs 100 nodes on identical commands).
    # scopeHash/statesHash do NOT encode this flag -> recorded explicitly below.
    ( cd "$REPO_ROOT" && node "$HARNESS/audit.whoogle.mjs" "http://127.0.0.1:$PORT" \
      --urls "/,/search.html,/search?q=test,/window?location=https://example.com" \
      --states all --wait 500 --out "$OUT/final" )
    AUDIT_EXIT=$?
    ( cd "$REPO_ROOT" && node "$HARNESS/heldout-checks.mjs" "http://127.0.0.1:$PORT" --out "$OUT/heldout" )
    HELDOUT_EXIT=$?
  fi
  kill $APP_PID 2>/dev/null; wait $APP_PID 2>/dev/null
fi

# --- 6. env provenance ------------------------------------------------------
{
  echo "date=$(date -u +%FT%TZ)"
  echo "node=$(node --version 2>/dev/null || echo missing)"
  echo "python=$(.venv/bin/python --version 2>/dev/null || echo missing)"
  # Measured, not declared: report the versions actually installed under the
  # harness repo root so a drifted install can't masquerade as the pin.
  echo "axe_core=$(cd "$REPO_ROOT" && node -p 'require("axe-core/package.json").version' 2>/dev/null || echo unmeasured)"
  echo "playwright=$(cd "$REPO_ROOT" && node -p 'require("playwright/package.json").version' 2>/dev/null || echo unmeasured)"
  echo "WHOOGLE_CSP=0 (deviation: axe injection requires CSP relaxed — production CSP NOT validated)"
  echo "audit_args=--urls /,/search.html,/search?q=test,/window?location=https://example.com --states all --wait 500 (evaluator v3; --wait is NOT encoded in scopeHash/statesHash)"
} > "$OUT/env.env"

echo "=== done: identity=$IDENTITY_OK apply=$APPLY_OK install=$INSTALL_OK tests=$TESTS_OK boot=$BOOT_OK audit_exit=$AUDIT_EXIT heldout_exit=$HELDOUT_EXIT"
write_status 0 "$IDENTITY_OK" "$APPLY_OK" "$INSTALL_OK" "$TESTS_OK" "$BOOT_OK" "$AUDIT_EXIT" "$HELDOUT_EXIT"
