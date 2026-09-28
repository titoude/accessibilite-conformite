#!/usr/bin/env bash
# evaluate.sh — independent evaluator replay for one pilot arm.
#
# Replays a worker's patch on a CLEAN clone of the pinned whoogle commit:
#   1. verify patch sha256 (if declared)
#   2. git apply (record success/failure verbatim)
#   3. frozen install: python3 -m venv + pip install -r requirements.txt
#      (locked by the upstream commit — no version changes allowed)
#   4. project test suite (pytest) + boot smoke = install_build
#   5. frozen audit (harness/audit.whoogle.mjs) -> final report + scope
#   6. held-out checks (harness/heldout-checks.mjs)
#
# Usage:
#   harness/evaluate.sh <clone-dir> <patch.diff> <out-dir> [declared-sha256]
#
# The script NEVER edits the patch; every failure is written to the log and to
# <out-dir>/eval-status.env. Exit code is informational only (0/1/2 propagate
# to eval-status.env as eval_exit).
set -u
CLONE_DIR="$1"; PATCH="$2"; OUT="$3"; DECLARED_SHA="${4:-}"
HARNESS="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$HARNESS/../../.." && pwd)"
REPO_URL="https://github.com/benbusby/whoogle-search"
PIN="0543f86528678ab60a20b3049483975add6b6e40"
PORT="${PILOT_PORT:-5001}"
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
rm -rf "$CLONE_DIR"
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
python3 -m venv .venv && .venv/bin/pip install --quiet -r requirements.txt > "$OUT/pip.log" 2>&1
if [ $? -eq 0 ] && .venv/bin/python -c "import app" 2>> "$OUT/pip.log"; then
  INSTALL_OK=true
  echo "install OK (venv + requirements.txt @ pinned commit)"
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
    sleep 1
  done
  echo "boot_ok=$BOOT_OK"
  if [ "$BOOT_OK" = true ]; then
    # audit.mjs resolves playwright/axe-core via createRequire(process.cwd()) —
    # run node from the harness repo root, which carries the pinned deps.
    ( cd "$REPO_ROOT" && node "$HARNESS/audit.whoogle.mjs" "http://127.0.0.1:$PORT" \
      --urls "/,/search.html,/search?q=test,/window?location=https://example.com" \
      --states all --out "$OUT/final" )
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
  echo "axe_core=$(node -e "console.log(require('$CLONE_DIR/node_modules/axe-core/package.json').version)" 2>/dev/null || echo 'resolves from audit CWD')"
  echo "playwright=$(node -e "console.log(require('playwright/package.json').version)" 2>/dev/null || echo missing)"
  echo "WHOOGLE_CSP=0 (deviation: axe injection requires CSP relaxed — production CSP NOT validated)"
} > "$OUT/env.env"

echo "=== done: identity=$IDENTITY_OK apply=$APPLY_OK install=$INSTALL_OK tests=$TESTS_OK boot=$BOOT_OK audit_exit=$AUDIT_EXIT heldout_exit=$HELDOUT_EXIT"
write_status 0 "$IDENTITY_OK" "$APPLY_OK" "$INSTALL_OK" "$TESTS_OK" "$BOOT_OK" "$AUDIT_EXIT" "$HELDOUT_EXIT"
