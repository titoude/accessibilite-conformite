#!/usr/bin/env bash
# seed.sh — seed REJOUABLE du cycle 41 jellyfin.
# Usage : bash tools/seed.sh <PORT> [DIST_DIR]
#   PORT     : port hôte exposé (ex. 5961)
#   DIST_DIR : optionnel — dossier dist/ de jellyfin-web monté sur
#              /jellyfin/jellyfin-web (vanilla = omettre, on sert alors la
#              webroot embarquée dans l'image amont).
# Comportement : recrée l'instance de zéro (config/cache purgés),
# exécute le wizard via l'API /Startup/*, crée 2 bibliothèques
# (Movies, Shows) sur le dossier tools/seed-media monté en :ro,
# attend le scan, résout les ids (user, items, dossiers) via l'API,
# et écrit tools/env.sh + tools/urls-auth.txt (depuis urls-auth.tmpl).
set -euo pipefail

PORT="${1:?usage: seed.sh <PORT> [DIST_DIR]}"
DIST_DIR="${2:-}"
NAME="jf41-${PORT}"
TOOLS="$(cd "$(dirname "$0")" && pwd)"
BASE="http://localhost:${PORT}"
PW="devin-a11y-41"
HDR='MediaBrowser Client="devin-seed", Device="devin", DeviceId="devin-seed-41", Version="1.0"'

echo "== [1/6] purge instance $NAME"
docker rm -f "$NAME" >/dev/null 2>&1 || true
# Les fichiers des volumes appartiennent à root (écrits par le conteneur)
# → purge via conteneur jetable BASÉ SUR L'IMAGE DÉJÀ TIRÉE (pas d'image
# externe à puller : un rate-limit registry rendrait la purge silencieuse).
for d in "jf41-config-$PORT" "jf41-cache-$PORT"; do
  if [ -d "$HOME/work/$d" ]; then
    docker run --rm -v "$HOME/work/$d:/x" --entrypoint sh jellyfin/jellyfin:latest -c 'rm -rf /x/* /x/.[!.]*' || { echo "FAIL: purge $d"; exit 1; }
  else
    mkdir -p "$HOME/work/$d"
  fi
done
# Garde : la purge doit être réellement vide — sinon l'ancienne instance
# survit (wizard complété, endpoints /Startup/* -> 404).
if find "$HOME/work/jf41-config-$PORT" -mindepth 1 | read -r _; then
  echo "FAIL: config $PORT non vide après purge"; exit 1
fi
mkdir -p "$HOME/work/jf41-config-$PORT" "$HOME/work/jf41-cache-$PORT"

echo "== [2/6] docker run jellyfin/jellyfin :$PORT"
ARGS=( -d --name "$NAME" -p "$PORT:8096"
  -v "$HOME/work/jf41-config-$PORT:/config"
  -v "$HOME/work/jf41-cache-$PORT:/cache"
  -v "$TOOLS/seed-media:/media:ro" )
if [ -n "$DIST_DIR" ]; then ARGS+=( -v "$DIST_DIR:/jellyfin/jellyfin-web:ro" ); fi
docker run "${ARGS[@]}" jellyfin/jellyfin:latest >/dev/null

echo "== [3/6] attente serveur"
ver=""
for i in $(seq 1 120); do
  body=$(curl -sf "$BASE/System/Info/Public" 2>/dev/null || true)
  if printf '%s' "$body" | grep -q '"Version"'; then
    ver=$(printf '%s' "$body" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['Version'],d['StartupWizardCompleted'])")
    break
  fi
  sleep 2
done
[ -n "$ver" ] || { echo "FAIL: serveur jamais prêt"; exit 1; }
echo "   serveur: $ver"

echo "== [4/6] wizard (API /Startup/*)"
curl -sf -X POST "$BASE/Startup/Configuration" -H "Content-Type: application/json" \
  -d '{"UICulture":"en-US","MetadataCountryCode":"US","PreferredMetadataLanguage":"en"}' -o /dev/null
# Le premier utilisateur est pré-créé côté serveur (« root » en 12.x) :
# POST /Startup/User ne fait que le nommer/poser son mot de passe — un Name
# qui ne correspond pas au premier utilisateur renvoie 404.
FIRST_USER=$(curl -sf "$BASE/Startup/FirstUser" | python3 -c "import json,sys;print(json.load(sys.stdin)['Name'])")
echo "   first user: $FIRST_USER"
curl -sf -X POST "$BASE/Startup/User" -H "Content-Type: application/json" \
  -d "{\"Name\":\"$FIRST_USER\",\"Password\":\"$PW\"}" -o /dev/null
curl -sf -X POST "$BASE/Startup/RemoteAccess" -H "Content-Type: application/json" \
  -d '{"EnableRemoteAccess":true,"EnableAutomaticPortMapping":false}' -o /dev/null
curl -sf -X POST "$BASE/Startup/Complete" -o /dev/null
# Authentification POST-wizard (ordre amont : les VirtualFolders sont créés
# avec un vrai jeton admin, pas en mode startup sans-auth).
TOKEN=$(curl -sf -X POST "$BASE/Users/AuthenticateByName" \
  -H "Content-Type: application/json" -H "Authorization: $HDR" \
  -d "{\"Username\":\"$FIRST_USER\",\"Pw\":\"$PW\"}" | python3 -c "import json,sys;print(json.load(sys.stdin)['AccessToken'])")
AUTH="Authorization: $HDR, Token=\"$TOKEN\""
curl -sf -X POST "$BASE/Library/VirtualFolders?name=Movies&collectionType=movies&paths=/media/movies&refreshLibrary=true" -H "$AUTH" -o /dev/null
curl -sf -X POST "$BASE/Library/VirtualFolders?name=Shows&collectionType=tvshows&paths=/media/shows&refreshLibrary=true" -H "$AUTH" -o /dev/null
# Refresh explicite : le refreshLibrary de création peut partir avant que
# le montage /media ne soit pleinement scannable — une 2e passe garantit
# l'indexation des .strm.
curl -sf -X POST "$BASE/Library/Refresh" -H "$AUTH" -o /dev/null

echo "== [5/6] attente scan bibliothèque"
for i in $(seq 1 60); do
  n=$(curl -sf "$BASE/Items?Recursive=true&Fields=Path" -H "$AUTH" | python3 -c "import json,sys;print(len(json.load(sys.stdin).get('Items',[])))" 2>/dev/null || echo 0)
  [ "$n" -ge 8 ] && break
  sleep 2
done
[ "$n" -ge 8 ] || { echo "FAIL: scan incomplet ($n items)"; exit 1; }
echo "   items: $n"

echo "== [6/6] résolution ids + urls-auth.txt"
python3 - "$BASE" "$TOKEN" "$HDR" "$TOOLS" <<'PYEOF'
import json, sys, urllib.request, re
base, token, hdr, tools = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
auth = hdr + f', Token="{token}"'
def get(path):
    req = urllib.request.Request(base + path, headers={'Authorization': auth})
    return json.load(urllib.request.urlopen(req))
items = {i['Name']: i['Id'] for i in get('/Items?Recursive=true').get('Items', [])}
folders = {f['Name']: f.get('ItemId') or f['Id'] for f in get('/Library/VirtualFolders')}
uid = get('/Users')[0]['Id']
pub = get('/System/Info/Public')
env = {
    'JF_USER_ID': uid,
    'JF_MOVIE_ID': items['Alpha Squadron'],
    'JF_MOVIE2_ID': items['Beta Tales'],
    'JF_SERIES_ID': items['Sample Series'],
    'JF_EPISODE_ID': items['Sample Series S01E01'],
    'JF_MOVIES_FOLDER_ID': folders['Movies'],
    'JF_SHOWS_FOLDER_ID': folders['Shows'],
    'JF_TOKEN': token,
    'JF_ADMIN_PW': 'devin-a11y-41',
    'JF_ADMIN_USER': get('/Users')[0]['Name'],
    'JF_SERVER_ID': pub['Id'],
    'JF_SERVER_NAME': pub['ServerName'],
}
with open(tools + '/env.sh', 'w') as f:
    for k, v in env.items():
        f.write(f'{k}={v}\n')
with open(tools + '/urls-auth.tmpl') as f:
    tmpl = f.read()
for k, v in env.items():
    tmpl = tmpl.replace('${' + k + '}', v)
with open(tools + '/urls-auth.txt', 'w') as f:
    f.write(tmpl)
# public.json : storageState « serveur sélectionné, SANS session » —
# #/login rend le formulaire réel ; l'entrée reproduit la forme exacte
# produite par le client (ManualAddress + manualAddressOnly), moins
# AccessToken/UserId. Sans ce fichier les routes publiques rebondissent
# vers #/selectserver (ConnectionRequired).
srv = {"DateLastAccessed": 1, "LastConnectionMode": 2,
       "ManualAddress": base, "manualAddressOnly": True,
       "Name": pub['ServerName'], "Id": pub['Id'],
       "LocalAddress": base}
state = {"cookies": [], "origins": [{"origin": base, "localStorage": [
    {"name": "jellyfin_credentials", "value": json.dumps({"Servers": [srv]})}
]}]}
with open(tools + '/public.json', 'w') as f:
    json.dump(state, f)
print(json.dumps(env, indent=1))
PYEOF
echo "== seed OK :$BASE"
