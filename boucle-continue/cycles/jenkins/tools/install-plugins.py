#!/usr/bin/env python3
"""install-plugins.py — résolveur de plugins Jenkins rejeuable (cycle 42).

Usage:
  python3 tools/install-plugins.py --home $JENKINS_HOME [--uc ~/work/uc.json]

Résout récursivement les dépendances depuis update-center.actual.json et
télécharge chaque .hpi dans <home>/plugins/<name>.jpi. Les dépendances
optionnelles sont ignorées. requiredCore est vérifié contre la version servie
(2.586-SNAPSHOT du war patché — toute entrée requiredCore > 2.586 abort).
"""
import json, os, sys, urllib.request, argparse

p = argparse.ArgumentParser()
p.add_argument("--home", required=True)
p.add_argument("--uc", default=None, help="chemin vers update-center.actual.json (sinon téléchargé)")
p.add_argument("--plugins", default=None, help="liste explicite, sinon plugins.txt à côté du script")
a = p.parse_args()

UC_URL = "https://updates.jenkins.io/update-center.actual.json"
DL = "https://updates.jenkins.io/download/plugins/{name}/{ver}/{name}.hpi"

if a.uc:
    uc = json.load(open(a.uc))
else:
    uc = json.load(urllib.request.urlopen(UC_URL, timeout=60))
plugins = uc["plugins"]
core_served = "2.586-SNAPSHOT"

if a.plugins:
    wanted = a.plugins.split(",")
else:
    wanted = [l.strip() for l in open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "plugins.txt")) if l.strip() and not l.startswith("#")]

resolved = {}
def walk(name, chain=()):
    if name in resolved:
        return
    pl = plugins.get(name)
    if not pl:
        print(f"!! plugin inconnu dans UC : {name} (chaîne {'>'.join(chain)})", file=sys.stderr)
        sys.exit(3)
    req = pl.get("requiredCore", "0")
    # comparaison simple x.y.z : notre core 2.586-SNAPSHOT satisfait tout requiredCore 2.x <= 2.586
    mj, mn = (req.split(".") + ["0"])[:2]
    if int(mj) > 2 or (int(mj) == 2 and int(mn.split("-")[0]) > 586):
        print(f"!! {name} {pl['version']} exige core {req} > {core_served}", file=sys.stderr)
        sys.exit(3)
    resolved[name] = pl
    for d in pl.get("dependencies", []):
        if not d.get("optional", False):
            walk(d["name"], chain + (name,))

for w in wanted:
    walk(w)

pdir = os.path.join(a.home, "plugins")
os.makedirs(pdir, exist_ok=True)
print(f"{len(resolved)} plugins à télécharger (core UC {uc['core']['version']}) :")
for name, pl in sorted(resolved.items()):
    ver = pl["version"]
    dest = os.path.join(pdir, name + ".jpi")
    url = pl.get("url") or DL.format(name=name, ver=ver)
    if url.startswith("/"):
        url = "https://updates.jenkins.io" + url
    if not os.path.exists(dest):
        with urllib.request.urlopen(url, timeout=120) as r:
            open(dest, "wb").write(r.read())
    print(f"  {name} {ver} -> {os.path.getsize(dest)}o")
print("OK")
