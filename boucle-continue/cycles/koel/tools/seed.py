#!/usr/bin/env python3
"""Cycle 49 koel — seed complet et rejouable.

1. Génère des MP3 réels (ffmpeg sine waves, tags ID3) dans MEDIA_DIR.
2. Déclenche `docker exec <container> php artisan koel:scan` (conteneur koel49
   par défaut — KOEL_CONTAINER env pour une autre instance, ex. install-build).
3. Seed via API : playlists standard + smart + collaborative-ish, favoris,
   lectures récentes, interactions, playlist-folder.

Usage: python3 seed.py <base_url> [media_dir]
Env: KOEL_CONTAINER (défaut 'koel49'), SEED_MEDIA_DIR, KOEL_EMAIL/KOEL_PASSWORD.
Idempotent : noms figés, étapes 'exists' ignorées.
"""
import json
import os
import subprocess
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://localhost:9049"
MEDIA_DIR = sys.argv[2] if len(sys.argv) > 2 else os.path.expanduser("~/work/koel49-media")
CONTAINER = os.environ.get("KOEL_CONTAINER", "koel49")
EMAIL = os.environ.get("KOEL_EMAIL", "admin@koel.dev")
PASSWORD = os.environ.get("KOEL_PASSWORD", "KoelIsCool")


def req(method, path, token=None, body=None):
    r = urllib.request.Request(
        f"{BASE}/api/{path}", method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Content-Type": "application/json"} | ({"Authorization": f"Bearer {token}"} if token else {}),
    )
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            raw = resp.read() or b"null"
            return resp.status, (json.loads(raw) if raw.strip()[:1] in (b"{", b"[") else {"raw": raw[:200]})
    except urllib.error.HTTPError as e:
        raw = e.read() or b"{}"
        return e.code, (json.loads(raw) if raw.strip()[:1] in (b"{", b"[") else {"raw": raw[:200]})


def main():
    # 1. médias
    print("[seed] génération des MP3 factices…", flush=True)
    subprocess.run(["bash", os.path.join(HERE, "seed-media.sh"), MEDIA_DIR], check=True)

    # 2. scan (le media_path pointe /media dans le conteneur)
    print("[seed] koel:scan…", flush=True)
    out = subprocess.run(
        ["docker", "exec", CONTAINER, "php", "artisan", "koel:scan"],
        capture_output=True, text=True)
    print(out.stdout[-800:], flush=True)

    # 3. login
    st, tok = req("POST", "me", body={"email": EMAIL, "password": PASSWORD})
    assert st == 200 and tok.get("token"), f"login échoué {st} {tok}"
    token = tok["token"]
    print("[seed] login OK", flush=True)

    # 4. récupère ids des chansons
    st, songs = req("GET", "songs?sort=title&order=asc", token)
    ids = [s["id"] for s in songs["data"]]
    print(f"[seed] {len(ids)} chansons", flush=True)
    assert len(ids) >= 20

    # 5. playlists (standard + smart + une 3e)
    st, pls = req("GET", "playlists", token)
    plist = pls["data"] if isinstance(pls, dict) else pls
    existing = {p["name"]: p["id"] for p in plist}
    want = {"KOEL49 Morning Mix": None, "KOEL49 Chill": None, "KOEL49 Smart Ambient": "smart"}
    for name, kind in want.items():
        if name in existing:
            print(f"[seed] playlist '{name}' existe", flush=True)
            want[name] = existing[name]
            continue
        if kind == "smart":
            import uuid
            body = {"name": name, "description": "seed c49 smart",
                    "rules": [{"id": str(uuid.uuid4()), "rules": [{"model": "genre", "operator": "is", "value": ["Ambient"]}]}]}
        else:
            body = {"name": name, "description": "seed c49", "rules": [], "folder_id": None}
        st, pl = req("POST", "playlists", token, body)
        if st in (200, 201) and pl.get("data", pl).get("id"):
            want[name] = pl.get("data", pl)["id"]
            print(f"[seed] playlist '{name}' créée {want[name]}", flush=True)
        else:
            print(f"[seed] WARN playlist '{name}' -> {st} {str(pl)[:160]}", flush=True)
            want[name] = None

    # 6. ajoute des chansons aux playlists standard
    for name in ("KOEL49 Morning Mix", "KOEL49 Chill"):
        pid = want.get(name)
        if not pid:
            continue
        st, r = req("PUT", f"playlists/{pid}/songs", token, {"songs": ids[:12]})
        if st in (200, 201, 204):
            print(f"[seed] {name} +{len(ids[:12])} chansons", flush=True)
        else:
            # essaie le POST store
            st, r = req("POST", f"playlists/{pid}/songs", token, {"songs": ids[:12]})
            print(f"[seed] {name} songs -> {st}", flush=True)

    # 7. playlist folder
    st, r = req("POST", "playlist-folders", token, {"name": "KOEL49 Folder"})
    print(f"[seed] playlist-folder -> {st}", flush=True)

    # 8. favoris
    st, r = req("POST", "favorites", token, {"songs": ids[:8]})
    print(f"[seed] favorites -> {st}", flush=True)

    # 9. lectures récentes
    for sid in ids[:5]:
        st, r = req("POST", "interaction/play", token, {"song": sid})
    print(f"[seed] plays -> {st}", flush=True)

    # 10. ratings
    st, albums = req("GET", "albums", token)
    aid = albums["data"][0]["id"]
    st, r = req("PUT", f"albums/{aid}/rating", token, {"rating": 5})
    print(f"[seed] album rating -> {st}", flush=True)

    print("SEED_DONE", flush=True)


if __name__ == "__main__":
    main()
