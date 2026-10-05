#!/usr/bin/env bash
# Génère urls-auth / urls-public pour une instance fraîche (IDs par instance).
# Usage: TOKEN=<tok> gen-urls.sh <BASE_URL> <AUTH_JSON> — écrit urls-{auth,public}-install.txt
set -e
BASE="${1:?base url}"; AUTHJSON="${2:?storage state json}"
TOKEN="${TOKEN:-$(python3 -c "import json,sys; s=json.load(open('$AUTHJSON')); print([c['value'] for c in s['cookies'] if c['name']=='nc_token'][0])")}"
H="xc-auth: $TOKEN"; J='content-type: application/json'
req() { curl -sf -H "$H" -H "$J" "$@"; }

WS=$(req "$BASE/api/v2/meta/workspaces" | python3 -c "import json,sys; print(json.load(sys.stdin)['list'][0]['id'])")
BID=$(req "$BASE/api/v1/db/meta/projects" | python3 -c "import json,sys; print([b['id'] for b in json.load(sys.stdin)['list'] if b['title']=='A11y Demo'][0])")
TID=$(req "$BASE/api/v1/db/meta/projects/$BID/tables" | python3 -c "import json,sys; print([t['id'] for t in json.load(sys.stdin)['list'] if t['title']=='Items'][0])")
VIEWS=$(req "$BASE/api/v2/meta/tables/$TID/views")
# enum ViewTypes de cette version : FORM=1 GALLERY=2 GRID=3 KANBAN=4
FORM=$(echo "$VIEWS" | python3 -c "import json,sys; print([v['id'] for v in json.load(sys.stdin)['list'] if v['type']==1][0])")
GALL=$(echo "$VIEWS" | python3 -c "import json,sys; print([v['id'] for v in json.load(sys.stdin)['list'] if v['type']==2][0])")
GRID=$(echo "$VIEWS" | python3 -c "import json,sys; print([v['id'] for v in json.load(sys.stdin)['list'] if v['type']==3][0])")
KANB=$(echo "$VIEWS" | python3 -c "import json,sys; print([v['id'] for v in json.load(sys.stdin)['list'] if v['type']==4][0])")

# partager ce qui ne l'est pas encore (uuid null), puis relire depuis la liste
for V in $GRID $GALL $FORM; do
  req -X POST "$BASE/api/v2/meta/views/$V/share" >/dev/null || true
done
VIEWS=$(req "$BASE/api/v2/meta/tables/$TID/views")
uuidof() { echo "$VIEWS" | python3 -c "import json,sys; print([v.get('uuid') or '' for v in json.load(sys.stdin)['list'] if v['id']=='$1'][0])"; }
SHGRID=$(uuidof "$GRID"); SHGALL=$(uuidof "$GALL"); SHFORM=$(uuidof "$FORM")

cat > "$(dirname "$0")/urls-auth-install.txt" <<EOF
/$WS
/$WS/settings/members
/$WS/feed
/$WS/$BID
/$WS/$BID/$TID/$GRID/items-items
/$WS/$BID/$TID/$GALL/items-galerie-items
/$WS/$BID/$TID/$KANB/items-kanban-items
/$WS/$BID/$TID/$FORM/items-formulaire-items
/$WS/$BID?settings=members
/account/
/account/tokens/
/admin/
/admin/?tab=workspaces
/admin/?tab=users-list
EOF

cat > "$(dirname "$0")/urls-public-install.txt" <<EOF
/signin/
/signup
/forgot-password/
/nc/view/$SHGRID
/nc/view/$SHGALL
/nc/form/$SHFORM
/nc/form/$SHFORM/survey
EOF
echo "WS=$WS BID=$BID TID=$TID"; echo "GRID=$GRID FORM=$FORM GALL=$GALL KANB=$KANB"
echo "shares: grid=$SHGRID gall=$SHGALL form=$SHFORM"
echo "urls: $(wc -l < "$(dirname "$0")/urls-auth-install.txt") auth + $(wc -l < "$(dirname "$0")/urls-public-install.txt") public"
