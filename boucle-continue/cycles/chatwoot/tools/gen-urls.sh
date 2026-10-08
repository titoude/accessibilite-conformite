#!/usr/bin/env bash
# gen-urls.sh — régénère urls-public.txt / urls-auth.resolved.txt depuis seed-info.json
# (leçons 44/46 : ids relus, jamais recopiés à la main).
set -euo pipefail
TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFO="$TOOLS_DIR/seed-info.json"
A=$(python3 -c "import json;print(json.load(open('$INFO'))['account_id'])")
C1=$(python3 -c "import json;d=json.load(open('$INFO'))['conversations'];print(d[0]['display_id'])")
C2=$(python3 -c "import json;d=json.load(open('$INFO'))['conversations'];print(d[1]['display_id'])")
CT1=$(python3 -c "import json;print(json.load(open('$INFO'))['contacts'][0]['id'])")
L1=$(python3 -c "import json;print(json.load(open('$INFO'))['labels'][0])")
T=$(python3 -c "import json;print(json.load(open('$INFO'))['team_id'])")
TOK=$(python3 -c "import json;print(json.load(open('$INFO'))['website_token'])")

cat > "$TOOLS_DIR/urls-public.txt" <<EOF
/app/login
/app/auth/signup
/app/auth/reset/password
/widget?website_token=$TOK
EOF

cat > "$TOOLS_DIR/urls-auth.resolved.txt" <<EOF
/app/accounts/$A/dashboard
/app/accounts/$A/inbox-view
/app/accounts/$A/inbox/1
/app/accounts/$A/conversations/$C1
/app/accounts/$A/conversations/$C2
/app/accounts/$A/contacts
/app/accounts/$A/contacts/$CT1
/app/accounts/$A/label/$L1
/app/accounts/$A/reports/overview
/app/accounts/$A/profile/settings
/app/accounts/$A/settings/agents/list
/app/accounts/$A/settings/inboxes/list
/app/accounts/$A/settings/labels/list
/app/accounts/$A/settings/teams/list
/app/accounts/$A/settings/general
EOF
echo "[gen-urls] account=$A conv=$C1,$C2 contact=$CT1 label=$L1 team=$T token=$TOK"
