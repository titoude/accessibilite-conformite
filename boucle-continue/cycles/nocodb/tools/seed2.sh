#!/usr/bin/env bash
set -e
BASE="${2:-http://localhost:8080}"
TOKEN="${TOKEN:-$(python3 -c "import json,sys; s=json.load(open('$(dirname $0)/auth.json')); print([c['value'] for c in s['cookies'] if c['name']=='nc_token'][0])")}"
H="xc-auth: $TOKEN"; J='content-type: application/json'
req() { curl -s -H "$H" -H "$J" "$@"; }

WS=$(req "$BASE/api/v2/meta/workspaces" | python3 -c "import json,sys; print(json.load(sys.stdin)['list'][0]['id'])")
BID=$(req "$BASE/api/v1/db/meta/projects" | python3 -c "import json,sys; print([b['id'] for b in json.load(sys.stdin)['list'] if b['title']=='A11y Demo'][0])")
TID=$(req "$BASE/api/v1/db/meta/projects/$BID/tables" | python3 -c "import json,sys; print([t['id'] for t in json.load(sys.stdin)['list'] if t['title']=='Items'][0])")
echo "WS=$WS BID=$BID TID=$TID"

# colonnes (id de Priority pour kanban)
PRI=$(req "$BASE/api/v2/meta/tables/$TID" | python3 -c "import json,sys; d=json.load(sys.stdin); print([c['id'] for c in d['columns'] if c['title']=='Priority'][0])")
echo "PRI=$PRI"

VIEWS=$(req "$BASE/api/v2/meta/tables/$TID/views" | python3 -c "import json,sys; d=json.load(sys.stdin); print(' '.join(f\"{v['id']}:{v['title']}:{v['type']}\" for v in d.get('list',[])))")
echo "views: $VIEWS"

if ! echo "$VIEWS" | grep -q "Formulaire"; then
  FV=$(req -X POST "$BASE/api/v2/meta/tables/$TID/forms" -d '{"title":"Formulaire Items"}' | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('id') or d)")
  echo "form view: $FV"
  req -X PATCH "$BASE/api/v2/meta/forms/$FV" -d '{"meta":{"heading":"Inscription Items","subheading":"Formulaire public de saisie — aide sur https://example.com/aide","success_message":"Merci, réponse enregistrée.","submit_another_form":true,"blank_record":true}}' | head -c 300; echo
fi
if ! echo "$VIEWS" | grep -q "Galerie"; then
  GV=$(req -X POST "$BASE/api/v2/meta/tables/$TID/galleries" -d '{"title":"Galerie Items"}' | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('id') or d)")
  echo "gallery view: $GV"
fi
if ! echo "$VIEWS" | grep -q "Kanban"; then
  KV=$(req -X POST "$BASE/api/v2/meta/tables/$TID/kanbans" -d "{\"title\":\"Kanban Items\",\"fk_grp_col_id\":\"$PRI\"}" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('id') or d)")
  echo "kanban view: $KV"
fi

# share de la vue grille existante (type 1)
GRID_ID=$(req "$BASE/api/v2/meta/tables/$TID/views" | python3 -c "import json,sys; d=json.load(sys.stdin); print([v['id'] for v in d['list'] if v['type']==1][0])")
SHARE=$(req -X POST "$BASE/api/v2/meta/views/$GRID_ID/share")
echo "share grid: $SHARE"
# partager la form aussi
FV_ID=$(req "$BASE/api/v2/meta/tables/$TID/views" | python3 -c "import json,sys; d=json.load(sys.stdin); print([v['id'] for v in d['list'] if v['type']==2][0])" 2>/dev/null || echo "")
if [ -n "$FV_ID" ]; then req -X POST "$BASE/api/v2/meta/views/$FV_ID/share"; echo; fi
echo "GRID_ID=$GRID_ID FV_ID=$FV_ID"
