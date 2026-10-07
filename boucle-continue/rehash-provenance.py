#!/usr/bin/env python3
"""rehash-provenance.py — re-hachage STRICT de provenance.json.

Dernière étape absolue avant chaque commit de cycle (leçon 27, durcie après
la 3e récidive du wart « empreintes obsolètes »).

Différences avec un re-hash naïf — les deux défauts réels observés en audit :
  1. entrée listée dont le fichier n'existe plus → ERREUR (le sha256 gardé
     serait celui d'une version antérieure — c'était la faute : 14/39
     empreintes v4 livrées dans provenance v5) ;
  2. fichier livré dans le cycle non listé dans provenance → AVERTISSEMENT
     (compté à l'échec avec --strict).

Usage : python3 rehash-provenance.py <cycle-dir> [--strict]
        code retour 2 sur entrée manquante, 1 avec --strict et non-listés,
        0 sinon ; spot-check de 3 fichiers inclus.
"""
import hashlib
import json
import os
import random
import sys

IGNORE_DIRS = {'.git', 'node_modules', '__pycache__'}
IGNORE_FILES = {'provenance.json'}
IGNORE_SUFFIXES = {'.pyc'}


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    cycle = os.path.abspath(sys.argv[1])
    strict = '--strict' in sys.argv[2:]
    prov_path = os.path.join(cycle, 'provenance.json')
    prov = json.load(open(prov_path))
    files = prov.get('files', prov)
    assert isinstance(files, dict), 'files doit être un dict path->sha256'

    missing = []
    for rel in list(files):
        p = os.path.join(cycle, rel)
        if not os.path.isfile(p):
            missing.append(rel)
            continue
        files[rel] = sha256(p)
    if missing:
        print(f'ERREUR : {len(missing)} entrée(s) provenance sans fichier :')
        for m in missing:
            print(f'  - {m}')
        print('corrige la liste (retire ou livre le fichier) puis relance — '
              'ne JAMAIS garder un sha256 de fichier absent.')
        return 2

    # fichiers livrés non listés : « livré » = git-tracké dans le cycle
    # (les non-trackés — node_modules, auth.json éphémère — ne sont pas livrés)
    tracked = None
    try:
        import subprocess
        # git ls-files affiche les chemins relatifs au cwd → relatifs au cycle
        out = subprocess.run(
            ['git', 'ls-files'], capture_output=True, text=True,
            cwd=cycle, check=True).stdout
        tracked = {line.strip() for line in out.splitlines() if line.strip()}
    except Exception:
        tracked = None
    unlisted = []
    if tracked is not None:
        for rel in tracked:
            if rel not in files and os.path.basename(rel) not in IGNORE_FILES:
                unlisted.append(rel)
    else:
        for root, dirs, names in os.walk(cycle):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            for n in names:
                if n in IGNORE_FILES or os.path.splitext(n)[1] in IGNORE_SUFFIXES:
                    continue
                rel = os.path.relpath(os.path.join(root, n), cycle)
                if rel.startswith('..') or rel.startswith('.'):
                    continue
                if rel not in files:
                    unlisted.append(rel)
    if unlisted:
        print(f'ATTENTION : {len(unlisted)} fichier(s) livré(s) non listé(s) '
              f'dans provenance :')
        for u in sorted(unlisted):
            print(f'  + {u}')
        if strict:
            return 1

    prov['generatedAt'] = prov.get('generatedAt')
    json.dump(prov, open(prov_path, 'w'), indent=1, ensure_ascii=False)

    names = list(files)
    random.seed()
    picks = random.sample(names, min(3, len(names)))
    for p in picks:
        assert files[p] == sha256(os.path.join(cycle, p)), f'spot-check {p}'
    print(f'OK : {len(files)} empreintes re-hachées, spot-check {len(picks)}/'
          f'{len(picks)} — {cycle}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
