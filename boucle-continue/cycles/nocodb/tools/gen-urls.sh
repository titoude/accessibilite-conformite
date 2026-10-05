#!/usr/bin/env bash
# Génère urls-auth / urls-public pour une instance fraîche (IDs par instance).
# Usage: TOKEN=<tok> gen-urls.sh <BASE_URL> <AUTH_JSON> — écrit urls-{auth,public}-install.txt + nc-env-install.sh
#
# Note routage : la route workspace "membres" n'est pas la même selon le bundle
# frontend servi : l'image docker (nc-gui prébuildé de l'image) sert /$WS/members
# canonique, le frontend REBUILDÉ depuis les sources (patch appliqué) sert
# /$WS/settings/members — la ligne ci-dessous cible la build patchée ; l'audit
# marque de toute façon ERREUR toute redirection de pathname.
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
# Il peut exister PLUSIEURS vues FORM : la forme « plain » (partage /nc/form/<uuid>)
# et la forme « survey » (meta.surveyMode=true → partage canonique /nc/form/<uuid>/survey)
FORM=$(echo "$VIEWS" | python3 -c "import json,sys; print([v['id'] for v in json.load(sys.stdin)['list'] if v['type']==1 and not (v.get('meta') or {}).get('surveyMode')][0])")
SURV=$(echo "$VIEWS" | python3 -c "import json,sys; l=[v['id'] for v in json.load(sys.stdin)['list'] if v['type']==1 and (v.get('meta') or {}).get('surveyMode')]; print(l[0] if l else '')")
GALL=$(echo "$VIEWS" | python3 -c "import json,sys; print([v['id'] for v in json.load(sys.stdin)['list'] if v['type']==2][0])")
GRID=$(echo "$VIEWS" | python3 -c "import json,sys; print([v['id'] for v in json.load(sys.stdin)['list'] if v['type']==3][0])")
KANB=$(echo "$VIEWS" | python3 -c "import json,sys; print([v['id'] for v in json.load(sys.stdin)['list'] if v['type']==4][0])")

# Vue survey dédiée : la créer si absente (idempotent), sinon la ligne /survey
# pointerait la MÊME forme que la ligne /nc/form — et le /survey nu redirige.
if [ -z "$SURV" ]; then
  echo "création de la vue formulaire surveyMode…"
  SURV=$(req -X POST "$BASE/api/v2/meta/tables/$TID/forms" -d '{"title":"Enquête Items"}' | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")
  req -X POST "$BASE/api/v2/meta/views/$SURV/share" >/dev/null
  # meta : surveyMode + heading + subheading (la description tiptap du seed —
  # porte la violation aria-input-field-name de la baseline ; parité de seed)
  req -X PATCH "$BASE/api/v2/meta/views/$SURV" -d '{"meta":{"surveyMode":true,"heading":"Enquête Items","subheading":"Questions une par une."}}' >/dev/null
fi

# partager ce qui ne l'est pas encore (uuid null), puis relire depuis la liste
for V in $GRID $GALL $FORM $SURV; do
  req -X POST "$BASE/api/v2/meta/views/$V/share" >/dev/null || true
done
VIEWS=$(req "$BASE/api/v2/meta/tables/$TID/views")
uuidof() { echo "$VIEWS" | python3 -c "import json,sys; print([v.get('uuid') or '' for v in json.load(sys.stdin)['list'] if v['id']=='$1'][0])"; }
SHGRID=$(uuidof "$GRID"); SHGALL=$(uuidof "$GALL"); SHFORM=$(uuidof "$FORM"); SHSURV=$(uuidof "$SURV")
if [ "$SHFORM" = "$SHSURV" ]; then
  echo "ERREUR: uuid form == uuid survey ($SHFORM) — les deux lignes public doivent cibler des vues distinctes" >&2
  exit 1
fi

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
/nc/form/$SHSURV/survey
EOF

# IDs de l'instance à sourcer pour les env NC_* des outils (audit/verify/eval/probes)
cat > "$(dirname "$0")/nc-env-install.sh" <<EOF
export NC_WS=$WS
export NC_BASE=$BID
export NC_TABLE=$TID
export NC_GRID=$GRID
export NC_KANBAN=$KANB
export NC_FORM=$FORM
export NC_SHARE_FORM=$SHFORM
export NC_SHARE_SURVEY=$SHSURV
EOF

echo "WS=$WS BID=$BID TID=$TID"; echo "GRID=$GRID FORM=$FORM SURV=$SURV GALL=$GALL KANB=$KANB"
echo "shares: grid=$SHGRID gall=$SHGALL form=$SHFORM survey=$SHSURV"
echo "urls: $(wc -l < "$(dirname "$0")/urls-auth-install.txt") auth + $(wc -l < "$(dirname "$0")/urls-public-install.txt") public — env: source $(dirname "$0")/nc-env-install.sh"
