#!/usr/bin/env bash
# Seed NocoDB pour audit a11y — idempotent en partie (ignore les doublons).
# Usage: TOKEN=<nc_token> ./seed.sh [BASE_URL]
set -e
BASE="${2:-http://localhost:8080}"
TOKEN="${TOKEN:-$(python3 -c "import json,sys; s=json.load(open('$(dirname $0)/auth.json')); print([c['value'] for c in s['cookies'] if c['name']=='nc_token'][0])")}"
H="xc-auth: $TOKEN"
J='content-type: application/json'
req() { curl -sf -H "$H" -H "$J" "$@"; }

echo "== workspaces =="
WS=$(req "$BASE/api/v2/meta/workspaces" | python3 -c "import json,sys; print(json.load(sys.stdin)['list'][0]['id'])")
echo "WS=$WS"

echo "== bases existantes =="
BASES=$(req "$BASE/api/v1/db/meta/projects" | python3 -c "import json,sys; d=json.load(sys.stdin); print(' '.join(f\"{b['id']}:{b['title']}\" for b in d.get('list',[])))")
echo "bases: $BASES"
if echo "$BASES" | grep -q "A11y Demo"; then
  BID=$(echo "$BASES" | tr ' ' '\n' | grep "A11y" | cut -d: -f1)
  echo "base A11y Demo déjà présente: $BID"
else
  echo "== création base A11y Demo =="
  BID=$(req -X POST "$BASE/api/v1/db/meta/projects" -d '{"title":"A11y Demo"}' | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")
  echo "BID=$BID"
fi

echo "== tables =="
TABLES=$(req "$BASE/api/v1/db/meta/projects/$BID/tables" | python3 -c "import json,sys; d=json.load(sys.stdin); print(' '.join(f\"{t['id']}:{t['title']}\" for t in d.get('list',[])))")
echo "tables: $TABLES"
if echo "$TABLES" | grep -q "Items"; then
  TID=$(echo "$TABLES" | tr ' ' '\n' | grep ":Items$" | cut -d: -f1)
else
  echo "== création table Items =="
  TID=$(req -X POST "$BASE/api/v1/db/meta/projects/$BID/tables" -d '{
    "table_name":"items","title":"Items",
    "columns":[
      {"column_name":"Title","title":"Title","uidt":"SingleLineText","pv":true},
      {"column_name":"Notes","title":"Notes","uidt":"LongText"},
      {"column_name":"Done","title":"Done","uidt":"Checkbox"},
      {"column_name":"Priority","title":"Priority","uidt":"SingleSelect","dtxp":"'\''High'\'','\''Medium'\'','\''Low'\''"},
      {"column_name":"Amount","title":"Amount","uidt":"Decimal"},
      {"column_name":"Due","title":"Due","uidt":"Date"}
    ]}' | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")
  echo "TID=$TID"
fi

echo "== rows =="
ROWS=$(req "$BASE/api/v2/tables/$TID/records?limit=1" | python3 -c "import json,sys; print(json.load(sys.stdin).get('pageInfo',{}).get('totalRows',0))")
echo "rows: $ROWS"
if [ "$ROWS" = "0" ]; then
  req -X POST "$BASE/api/v2/tables/$TID/records" -d '[
    {"Title":"Réparer le contraste des badges","Notes":"Voir https://example.com/spec-wcag pour les ratios — le lien doit rester cliquable dans le rendu markdown.","Done":false,"Priority":"High","Amount":12.5,"Due":"2026-10-10"},
    {"Title":"Documenter le seed","Notes":"Deuxième ligne avec un peu de contenu réel pour peupler la grille.","Done":true,"Priority":"Medium","Amount":3.0,"Due":"2026-10-12"},
    {"Title":"Revue accessibilité","Notes":"Troisième ligne : checklist keyboard + lecteur d écran.","Done":false,"Priority":"Low","Amount":8.75,"Due":"2026-10-15"},
    {"Title":"Corriger le drawer","Notes":"Quatrième ligne : vérifier le focus trap et aria-modal.","Done":true,"Priority":"High","Amount":21.0,"Due":"2026-10-20"},
    {"Title":"Tester les vues","Notes":"Cinquième ligne : grille + galerie + kanban + formulaire partagé.","Done":false,"Priority":"Medium","Amount":14.2,"Due":"2026-10-25"}
  ]' | python3 -c "import json,sys; print('inserted', len(json.load(sys.stdin)))"
fi

echo "== vues =="
VIEWS=$(req "$BASE/api/v2/meta/tables/$TID/views" | python3 -c "import json,sys; d=json.load(sys.stdin); print(' '.join(f\"{v['id']}:{v['title']}:{v['type']}\" for v in d.get('list',[])))")
echo "views: $VIEWS"
if ! echo "$VIEWS" | grep -q "Formulaire"; then
  FV=$(req -X POST "$BASE/api/v2/meta/tables/$TID/views" -d '{"title":"Formulaire Items","type":2,"meta":{"heading":"Inscription Items","subheading":"Formulaire public de saisie avec lien https://example.com/aide","success_message":"Merci, réponse enregistrée.","submit_another_form":true,"email":"Votre e-mail","blank_record":true}}' | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")
  echo "form view: $FV"
fi
if ! echo "$VIEWS" | grep -q "Galerie"; then
  GV=$(req -X POST "$BASE/api/v2/meta/tables/$TID/views" -d '{"title":"Galerie Items","type":3}' | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")
  echo "gallery view: $GV"
fi
if ! echo "$VIEWS" | grep -q "Kanban"; then
  KV=$(req -X POST "$BASE/api/v2/meta/tables/$TID/views" -d '{"title":"Kanban Items","type":4,"meta":{"fk_grp_col_id":"Priority"}}' | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])" 2>/dev/null) || KV=""
  echo "kanban view: $KV"
fi
if ! echo "$VIEWS" | grep -q "Partage"; then
  SV=$(req -X POST "$BASE/api/v2/meta/tables/$TID/views" -d '{"title":"Partage grille","type":1}' | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")
  req -X PATCH "$BASE/api/v2/meta/views/$SV" -d '{"title":"Partage grille"}' >/dev/null || true
  SHARE=$(req -X POST "$BASE/api/v1/db/meta/share/$SV" -d '{"viewType":"GRID"}' 2>/dev/null || true)
  echo "share: $SHARE"
fi
echo "DONE seed"
