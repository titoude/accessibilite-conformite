#!/usr/bin/env python3
"""Seed cycle 33 (changedetection.io) via l'API REST de l'application.

Pré-requis : l'app tourne (manifest.boot), le serveur de fixtures tourne
sur FIXTURE_PORT, le datastore est frais.

Le script :
  1. attend que l'API réponde,
  2. supprime les watches par défaut de l'app,
  3. copie les fixtures v1 dans le répertoire servi,
  4. crée 2 tags + 4 watches via POST /api/v1/...,
  5. force un premier fetch (recheck), attend last_checked,
  6. bascule les fixtures en v2, refait un recheck => historique diff (>=2 snapshots),
  7. force un check de la watch cassée jusqu'a last_error,
  8. imprime un résumé JSON (uuid par nom, tailles d'historique, états).

Usage : python3 tools/seed.py [--base http://127.0.0.1:5005] [--fixtures <dir>] \
          [--serve-dir <dir>] [--datastore <path>]
Sortie : {"watches": {nom: uuid}, "tags": {...}, "history": {uuid: n}, "error_ok": bool}
Exit 0 si tout est seedé, 1 sinon.
"""
import argparse
import json
import os
import shutil
from pathlib import Path
import sys
import time
import urllib.request
import urllib.error

WATCH_SPECS = [
    {
        "name": "api-docs",
        "payload": {
            "url": "{fixtures}/api-docs.html",
            "title": "Docs API Acme — référence",
            "fetch_backend": "html_requests",
        },
        "tag": "monitoring",
    },
    {
        "name": "pricing",
        "payload": {
            "url": "{fixtures}/pricing.html",
            "title": "NimbusHost — tarifs VPS",
            "fetch_backend": "html_requests",
        },
        "tag": "monitoring",
    },
    {
        "name": "rates",
        "payload": {
            "url": "{fixtures}/rates.json",
            "title": "Taux de change EUR (JSON)",
            # Backend navigateur : exerce le fetcher pyppeteer/CDP réel.
            "fetch_backend": "html_webdriver",
        },
        "tag": "infra",
    },
    {
        "name": "legacy-down",
        "payload": {
            # Port volontairement fermé => connexion refusée => watch en erreur.
            "url": "http://127.0.0.1:5598/legacy-portail.html",
            "title": "Portail legacy (hors service)",
        },
        "tag": "infra",
    },
]

FIXTURE_PAIRS = [  # (live_name, v1_file, v2_file_or_None)
    ("api-docs.html", "api-docs-v1.html", "api-docs-v2.html"),
    ("pricing.html", "pricing-v1.html", "pricing-v2.html"),
    ("rates.json", "rates-v1.json", "rates-v2.json"),
]


def api(base, key, method, path, body=None, timeout=20):
    req = urllib.request.Request(
        base.rstrip("/") + path,
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"x-api-key": key, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read()
            return r.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode(errors="replace")}


def wait_api(base, key, tries=60):
    for _ in range(tries):
        try:
            st, _ = api(base, key, "GET", "/api/v1/watch", timeout=5)
            if st == 200:
                return True
        except Exception:
            pass
        time.sleep(1)
    return False


def wait_check(base, key, uuid, min_snapshots=0, tries=120):
    """Attend que la watch ait été fetchée au moins une fois (last_checked > 0).
    min_snapshots>0 attend en plus que l'historique ait au moins N snapshots
    commités — last_checked est posé avant l'écriture du snapshot, donc pour
    les fetchers lents (html_webdriver ~12 s) seule l'historique prouve que
    la fixture servie à cet instant a bien été capturée (course v1→v2)."""
    for _ in range(tries):
        st, info = api(base, key, "GET", f"/api/v1/watch/{uuid}", timeout=10)
        if st == 200 and info.get("last_checked"):
            if min_snapshots <= 0:
                return True
            st2, hist = api(base, key, "GET", f"/api/v1/watch/{uuid}/history", timeout=10)
            if st2 == 200 and len(hist) >= min_snapshots:
                return True
        time.sleep(2)
    return False


def wait_error(base, key, uuid, tries=90):
    for _ in range(tries):
        st, info = api(base, key, "GET", f"/api/v1/watch/{uuid}", timeout=10)
        if st == 200 and info.get("last_error"):
            return True
        time.sleep(2)
    return False


DATASTORE = os.environ.get('CD_DATASTORE', str(Path.home() / 'work/cd-datastore'))


def seed_extra_proxy(datastore_file):
    # proxies.json est lu à chaud par datastore.proxy_list — rend le bouton
    # bulk "Proxy" du menu de sélection (et la colonne proxy de /settings)
    # auditables. Proxy volontairement non routable : présence seule requise.
    p = Path(datastore_file).parent / 'proxies.json'
    p.write_text(json.dumps({"local-fixture-proxy": {"label": "Local fixture proxy (audit seed)", "url": "http://127.0.0.1:3128"}}))
    log(f"proxies.json écrit → {p}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default=os.environ.get("CD_BASE", "http://127.0.0.1:5005"))
    ap.add_argument("--fixtures", default=os.path.join(os.path.dirname(__file__), "fixtures"))
    ap.add_argument("--serve-dir", default=os.environ.get("CD_FIXTURE_SERVE", "/tmp/cd-fixture-serve"))
    ap.add_argument("--fixture-port", default=os.environ.get("CD_FIXTURE_PORT", "5599"))
    ap.add_argument("--datastore", default=os.environ.get("CD_DATASTORE", ""))
    ap.add_argument("--api-key", default=os.environ.get("CD_API_KEY", ""))
    args = ap.parse_args()

    api_key = args.api_key
    if not api_key:
        ds = args.datastore or "/home/ubuntu/work/cd-datastore/changedetection.json"
        api_key = json.load(open(ds))["settings"]["application"]["api_access_token"]

    fixtures_base = f"http://127.0.0.1:{args.fixture_port}"

    if not wait_api(args.base, api_key):
        print(json.dumps({"error": "API introuvable"}))
        return 1

    # Fixtures v1 servies
    os.makedirs(args.serve_dir, exist_ok=True)
    for live, v1, _ in FIXTURE_PAIRS:
        shutil.copyfile(os.path.join(args.fixtures, v1), os.path.join(args.serve_dir, live))

    # Watches par défaut hors du seed
    st, watches = api(args.base, api_key, "GET", "/api/v1/watch")
    if st != 200:
        print(json.dumps({"error": f"GET watches -> {st}"}))
        return 1
    for uuid in list(watches):
        api(args.base, api_key, "DELETE", f"/api/v1/watch/{uuid}")

    # Tags
    tags = {}
    for key_name, title, colour in [
        ("monitoring", "Monitoring interne", "#2f6fdd"),
        ("infra", "Infra", "#7a3ea1"),
    ]:
        st, r = api(args.base, api_key, "POST", "/api/v1/tag", {"title": title, "tag_colour": colour})
        if st != 201:
            print(json.dumps({"error": f"tag {title} -> {st} {r}"}))
            return 1
        tags[key_name] = r["uuid"]

    # Watches
    created = {}
    for spec in WATCH_SPECS:
        payload = json.loads(json.dumps(spec["payload"]).replace("{fixtures}", fixtures_base))
        payload["tags"] = [tags[spec["tag"]]]
        st, r = api(args.base, api_key, "POST", "/api/v1/watch", payload)
        if st != 201:
            print(json.dumps({"error": f"watch {spec['name']} -> {st} {r}"}))
            return 1
        created[spec["name"]] = r["uuid"]

    # Premier fetch de chaque watch (recheck explicite => pas d'attente scheduler)
    for name, uuid in created.items():
        api(args.base, api_key, "GET", f"/api/v1/watch/{uuid}?recheck=true", timeout=15)

    # Attente du PREMIER snapshot commité (pas seulement last_checked) :
    # sinon la bascule v2 peut arriver pendant que le fetch lit encore v1
    # et le premier snapshot capturé serait déjà v2 → aucun diff enregistré.
    ok_first = {}
    for name, uuid in created.items():
        if name == "legacy-down":
            continue
        ok_first[name] = wait_check(args.base, api_key, uuid, min_snapshots=1)
    if not all(ok_first.values()):
        print(json.dumps({"error": f"premier fetch incomplet: {ok_first}"}))
        return 1

    # Bascule v2 => un vrai diff dans l'historique
    for live, _, v2 in FIXTURE_PAIRS:
        if v2:
            shutil.copyfile(os.path.join(args.fixtures, v2), os.path.join(args.serve_dir, live))
    for name in ("api-docs", "pricing", "rates"):
        api(args.base, api_key, "GET", f"/api/v1/watch/{created[name]}?recheck=true", timeout=15)
    hist_ok = {name: wait_check(args.base, api_key, created[name], min_snapshots=2)
               for name in ("api-docs", "pricing", "rates")}

    # Watch cassée : au moins un check en erreur
    api(args.base, api_key, "GET", f"/api/v1/watch/{created['legacy-down']}?recheck=true", timeout=15)
    error_ok = wait_error(args.base, api_key, created["legacy-down"])

    hist_sizes = {}
    for name, uuid in created.items():
        _, hist = api(args.base, api_key, "GET", f"/api/v1/watch/{uuid}/history", timeout=10)
        hist_sizes[name] = len(hist) if isinstance(hist, dict) else -1

    # proxies.json à côté du datastore de CETTE instance (pas un chemin global)
    ds_for_proxy = args.datastore or "/home/ubuntu/work/cd-datastore/changedetection.json"
    seed_extra_proxy(ds_for_proxy)

    summary = {"watches": created, "tags": tags, "history": hist_sizes,
               "diff_ok": hist_ok, "error_ok": error_ok}
    print(json.dumps(summary, indent=1))
    return 0 if (all(hist_ok.values()) and error_ok) else 1


if __name__ == "__main__":
    sys.exit(main())
