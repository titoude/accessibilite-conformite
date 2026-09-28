#!/usr/bin/env bash
# Task-pilot evaluation runner.
#   evaluate.sh <patch.diff|- > <outdir>
# Clones tastejs/todomvc at the frozen pin into a FRESH mktemp dir (never
# deletes a caller-supplied path), optionally applies a patch, installs the
# two locked production deps, serves the REPOSITORY ROOT, and runs the
# keyboard task audit on /examples/javascript-es5/.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PATCH="${1:?patch file path, or '-' for unmodified baseline}"
OUTDIR="${2:?output dir}"
SHA="ff43b02e59dfa604386bb382034b2cd07c2bcd8a"
PORT="${PORT:-8388}"
export PATH="$HOME/opt/node/bin:$PATH"

mkdir -p "$OUTDIR"; OUTDIR="$(cd "$OUTDIR" && pwd)"
WORK="$(mktemp -d /tmp/taskpilot-eval.XXXXXX)"
echo "workdir=$WORK" | tee "$OUTDIR/eval-status.env"

CLONE="$WORK/todomvc"
git clone --quiet https://github.com/tastejs/todomvc.git "$CLONE"
git -C "$CLONE" checkout --quiet "$SHA"
echo "pin=$SHA" >> "$OUTDIR/eval-status.env"

if [ "$PATCH" != "-" ]; then
  git -C "$CLONE" apply --check "$PATCH" && git -C "$CLONE" apply "$PATCH" \
    || { echo "PATCH_FAILED" | tee "$OUTDIR/eval-status.env"; exit 4; }
  echo "patch=applied sha256=$(sha256sum "$PATCH" | cut -d' ' -f1)" >> "$OUTDIR/eval-status.env"
else
  echo "patch=none" >> "$OUTDIR/eval-status.env"
fi

cd "$CLONE/examples/javascript-es5"
npm ci --omit=dev --ignore-scripts --no-audit --no-fund \
  > "$OUTDIR/npm-ci.log" 2>&1 || { echo "NPM_CI_FAILED" >> "$OUTDIR/eval-status.env"; exit 5; }

# Serve the repo ROOT so /learn.json resolves; app lives under
# /examples/javascript-es5/.
SERVE_PID=""
cleanup() { [ -n "$SERVE_PID" ] && kill "$SERVE_PID" 2>/dev/null || true; }
trap cleanup EXIT
node "$HERE/serve.mjs" "$CLONE" "$PORT" "$HERE/fixtures" > "$OUTDIR/serve.log" 2>&1 &
SERVE_PID=$!
echo "serve_pid=$SERVE_PID port=$PORT" >> "$OUTDIR/eval-status.env"

for i in $(seq 1 50); do
  if curl -sf -o /dev/null "http://127.0.0.1:$PORT/examples/javascript-es5/"; then break; fi
  if ! kill -0 $SERVE_PID 2>/dev/null; then echo "SERVE_DIED" >> "$OUTDIR/eval-status.env"; exit 6; fi
  sleep 0.2
done

# Verify the spawned process actually owns the port (HTTP 200 alone could
# be another server).
LISTENER_PID="$(ss -tlnp 2>/dev/null | grep ":$PORT " | grep -oP 'pid=\K[0-9]+' | head -1 || true)"
if [ -z "$LISTENER_PID" ] || [ "$LISTENER_PID" != "$SERVE_PID" ]; then
  echo "PORT_OWNERSHIP_MISMATCH listener=$LISTENER_PID" >> "$OUTDIR/eval-status.env"
  kill $SERVE_PID 2>/dev/null || true
  exit 7
fi

APP="http://127.0.0.1:$PORT/examples/javascript-es5/"
node "$HERE/audit.todo.mjs" "$APP" "$OUTDIR" "$PORT" "$HERE/fixtures" 2>&1 | tee "$OUTDIR/audit.log"
STATUS=${PIPESTATUS[0]}
[ $STATUS -ne 0 ] && { echo "AUDIT_FAILED" >> "$OUTDIR/eval-status.env"; exit 8; }

# versions are recorded by the runner itself (browser.version() etc.) in
# scope.json/report.json — do not re-derive them from the wrong cwd.
echo "DONE" >> "$OUTDIR/eval-status.env"
