#!/usr/bin/env bash
# Cycle 53 — seed rejouable documenso (MES données : user, draft éditeur v2,
# pending multi-signataires, template v2). Idempotent (unseedUserByEmail).
# Usage : tools/seed.sh <repo-dir> <tools-dir>
set -euo pipefail
REPO="$(cd "$1" && pwd)"
TOOLS="$(cd "$2" && pwd)"
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -f "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd "$REPO"
cp "$TOOLS/seed.mts" "$REPO/a11y-seed.mts"
npx dotenv -e .env -- tsx ./a11y-seed.mts "$TOOLS/seed-info.json"
rm -f "$REPO/a11y-seed.mts"
node "$TOOLS/gen-urls.mjs"
echo "[seed] seed-info.json + urls-*.txt régénérés dans $TOOLS"
