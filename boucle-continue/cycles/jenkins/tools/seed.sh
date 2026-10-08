#!/usr/bin/env bash
# seed.sh — rejoue le seed du cycle 42 via /scriptText groovy (admin).
# Usage: bash tools/seed.sh [BASE=http://localhost:6042]
set -euo pipefail
BASE="${1:-${JENKINS_BASE:-http://localhost:6042}}"
USER="${JENKINS_USER:-admin}"
PASS="${JENKINS_PASS:-jk42-admin-pw}"
HERE="$(cd "$(dirname "$0")" && pwd)"

JAR=$(mktemp)
trap 'rm -f "$JAR"' EXIT
CRUMB=$(curl -sf -c "$JAR" -u "$USER:$PASS" "$BASE/crumbIssuer/api/json" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['crumbRequestField']+':'+d['crumb'])")
curl -sf -b "$JAR" -c "$JAR" -u "$USER:$PASS" -H "$CRUMB" -X POST --data-urlencode "script@$HERE/seed.groovy" "$BASE/scriptText"
echo
echo "[seed] OK $BASE"
