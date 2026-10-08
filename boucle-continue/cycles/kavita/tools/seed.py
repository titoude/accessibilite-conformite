#!/usr/bin/env python3
"""seed.py — cycle 45 Kavita. Seed deterministe + rejouable.

Usage : python3 tools/seed.py <base_url> [media_dir]
  ex.   python3 tools/seed.py http://localhost:7500 ~/work/kv45-media

Zero dependance externe (stdlib seule). Actions :
  1. genere les medias (CBZ manga/comics + EPUB books) dans media_dir
  2. POST /api/Account/register (1er user admin ; si deja fait → login)
  3. cree 3 bibliotheques (Manga, Comics, Books) pointant media_dir
  4. POST /api/Library/scan-all puis poll jusqu'aux 8 series attendues
  5. reading list "Must Read" + 3 series
  6. collection "Staff Picks" + 2 series
  7. invite un user non-admin (alice.kv45@localhost)
Imprime SEED_DONE + comptes ; exit 1 sur echec.
"""
import json, os, struct, sys, time, urllib.request, urllib.error, zipfile, zlib

BASE = sys.argv[1].rstrip('/') if len(sys.argv) > 1 else 'http://localhost:7500'
MEDIA = os.path.abspath(os.path.expanduser(sys.argv[2] if len(sys.argv) > 2 else '~/work/kv45-media'))
ADMIN_USER, ADMIN_PASS = 'kv45admin', 'Kv45-Admin!Pass'

# ---------- 1. medias ----------

def png(w, h, rgb):
    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    raw = b''.join(b'\x00' + bytes(rgb) * w for _ in range(h))
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b''))

def make_cbz(path, pages, hue):
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        for i in range(1, pages + 1):
            c = [(hue + i * 30) % 256] * 3
            z.writestr(f'page_{i:02d}.png', png(800, 1200, c))
        z.writestr('ComicInfo.xml', '<?xml version="1.0"?><ComicInfo><Title>Chapter</Title></ComicInfo>')

def make_epub(path, title, author):
    container = ('<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">'
                 '<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>')
    opf = f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="id" version="2.0">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
<dc:title>{title}</dc:title><dc:creator>{author}</dc:creator><dc:language>en</dc:language><dc:identifier id="id">kv45-{title}</dc:identifier>
<meta name="calibre:series" content="{title}"/><meta name="calibre:series_index" content="1"/>
</metadata>
<manifest><item id="c1" href="c1.xhtml" media-type="application/xhtml+xml"/><item id="c2" href="c2.xhtml" media-type="application/xhtml+xml"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/></manifest>
<spine toc="ncx"><itemref idref="c1"/><itemref idref="c2"/></spine></package>'''
    ncx = f'''<?xml version="1.0"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="kv45-{title}"/></head><docTitle><text>{title}</text></docTitle><navMap><navPoint id="n1" playOrder="1"><navLabel><text>Chapter 1</text></navLabel><content src="c1.xhtml"/></navPoint><navPoint id="n2" playOrder="2"><navLabel><text>Chapter 2</text></navLabel><content src="c2.xhtml"/></navPoint></navMap></ncx>'''
    def chap(n):
        return f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>{title} - Chapter {n}</title></head>
<body><h1>{title} — Chapter {n}</h1><p>This is the seeded chapter {n} of {title}, by {author}. A11y loop cycle 45 fixture content — readable prose with enough text for the ebook reader to paginate.</p>
<p>Second paragraph: libraries are seeded for accessibility auditing; this book exercises the EPUB reader surface including TOC, settings drawer and pagination controls.</p></body></html>'''
    with zipfile.ZipFile(path, 'w') as z:
        z.writestr('mimetype', 'application/epub+zip', zipfile.ZIP_STORED)
        z.writestr('META-INF/container.xml', container)
        z.writestr('OEBPS/content.opf', opf)
        z.writestr('OEBPS/toc.ncx', ncx)
        z.writestr('OEBPS/c1.xhtml', chap(1))
        z.writestr('OEBPS/c2.xhtml', chap(2))

MANGA = [('One Punch Kavita', 3), ('Attack on Test', 2), ('Solo Leveling', 1)]
COMICS = [('Test Comics Alpha', 2), ('Beta Men', 1)]
BOOKS = [('The Testing Chronicles', 'A. Lopez'), ('Accessibility Field Manual', 'W. Cag')]
EXPECTED_SERIES = len(MANGA) + len(COMICS) + len(BOOKS)  # 7 series (3+2+2)

for name, chaps in MANGA:
    d = os.path.join(MEDIA, 'manga', name); os.makedirs(d, exist_ok=True)
    for c in range(1, chaps + 1):
        make_cbz(os.path.join(d, f'{name} - Ch.{c:03d}.cbz'), 4, hash(name) % 200 + 30)
for name, issues in COMICS:
    d = os.path.join(MEDIA, 'comics', name); os.makedirs(d, exist_ok=True)
    for i in range(1, issues + 1):
        make_cbz(os.path.join(d, f'{name} #{i:03d}.cbz'), 4, hash(name) % 180 + 60)
for title, auth in BOOKS:
    d = os.path.join(MEDIA, 'books', title); os.makedirs(d, exist_ok=True)
    make_epub(os.path.join(d, f'{title}.epub'), title, auth)
print(f'[seed] media ok under {MEDIA}')

# ---------- 2. API ----------

def call(method, path, body=None, token=None, ok=(200, 201)):
    req = urllib.request.Request(BASE + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={'Content-Type': 'application/json', **({'Authorization': f'Bearer {token}'} if token else {})})
    try:
        with urllib.request.urlopen(req) as r:
            raw = r.read() or b'null'
            try: return r.status, json.loads(raw)
            except ValueError: return r.status, raw.decode(errors='replace')  # Ok(string)
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:400]

def die(msg):
    print(f'[seed] FAIL: {msg}'); sys.exit(1)

# 2a. admin : register-first-user ou login si deja cree
st, res = call('POST', '/api/Account/register',
               {'username': ADMIN_USER, 'email': 'kv45admin@localhost.local', 'password': ADMIN_PASS})
if st == 200:
    token = res['token']; print('[seed] admin registered')
else:
    st, res = call('POST', '/api/Account/login', {'username': ADMIN_USER, 'password': ADMIN_PASS})
    if st != 200: die(f'login failed ({st}) after register rejected ({res})')
    token = res['token']; print('[seed] admin logged in (pre-existing)')

# 2b. bibliotheques
LIBS = [
    ('Kv45 Manga',  0, f'{MEDIA}/manga',  [1], 3),       # LibraryType.Manga, Archive, Mangabaka
    ('Kv45 Comics', 5, f'{MEDIA}/comics', [1], 4),       # LibraryType.ComicVine, Archive, ComicBookRoundup
    ('Kv45 Books',  2, f'{MEDIA}/books',  [2], 2),       # LibraryType.Book, Epub, Hardcover
]
lib_ids = {}
st, existing = call('GET', '/api/Library/libraries', token=token)
for name, ltype, folder, fgroups, mprovider in LIBS:
    hit = next((l for l in (existing or []) if l.get('name') == name), None)
    if hit and hit.get('enableMetadata'):
        lib_ids[name] = hit['id']; print(f'[seed] lib exists {name} id={hit["id"]}'); continue
    if hit:  # lib existe mais mal configuree (enableMetadata=false) -> recreer
        call('DELETE', f'/api/Library/delete?libraryId={hit["id"]}', token=token)
        print(f'[seed] lib {name} id={hit["id"]} deleted (enableMetadata=false)')
        for _ in range(30):  # delete async (Hangfire) : attendre la liberation du nom
            time.sleep(2)
            st, cur = call('GET', '/api/Library/libraries', token=token)
            if not any(l.get('name') == name for l in (cur or [])): break
    st, res = call('POST', '/api/Library/create', {
        'id': 0, 'name': name, 'type': ltype, 'folders': [folder],
        'folderWatching': False, 'includeInDashboard': True, 'includeInSearch': True,
        'manageCollections': True, 'manageReadingLists': True, 'allowScrobbling': False,
        'removePrefixForSortName': False, 'enableMetadata': True, 'allowMetadataMatching': True,
        'inheritWebLinksFromFirstChapter': False, 'defaultLanguage': '', 'metadataProvider': mprovider,  # mapping KavitaPlusConfiguration
        'fileGroupTypes': fgroups, 'excludePatterns': []}, token)
    if st not in (200, 201) or not isinstance(res, dict): die(f'Library/create {name} -> {st} {res}')
    lib_ids[name] = res['id']; print(f'[seed] lib created {name} id={res["id"]}')

# 2c. scan — K2 : scan-all?force=true est DEDUPLIQUE par Hangfire quand un
# scan est deja en vol (celui que Library/create declenche). Le post tombe
# alors en silence (ou est replanifie +3h dans `scheduled`) et la serie cible
# n'arrive jamais -> la boucle morte « 3/7 series after scan timeout ».
# Fix : attendre la QUESCENCE via /api/Server/activity (running + scheduled)
# AVANT de poster, puis re-poster force=true si le post a ete avale (aucune
# activite de scan ET series < attendu). Repli : scan par bibliotheque
# sequentiel, toujours poste sur quiescence.
SCAN_EVENTS = {'FileScanProgress', 'ScanProgress', 'ScanSeries'}

def scan_activity():
    st, act = call('GET', '/api/Server/activity', token=token)
    if st != 200 or not isinstance(act, dict):
        return 0, 0  # endpoint indisponible -> on considere idle
    running = [e for e in (act.get('running') or [])
               if (e.get('name') or '') in SCAN_EVENTS and e.get('eventType') != 'ended']
    scheduled = act.get('scheduledTotal') or len(act.get('scheduled') or [])
    return len(running), scheduled

def series_count():
    st, res = call('POST', '/api/Series/all-v2',
                   {'statements': [], 'combination': 1, 'sortOptions': None,
                    'limitTo': 0, 'applyAgeRating': False}, token)
    return res if st == 200 and isinstance(res, list) else []

def wait_scan_idle(timeout):
    # `scheduled` seul ne bloque pas : un post avale est replanifie +3h et
    # resterait visible indefiniment — seul `running` prouve un scan actif.
    deadline = time.time() + timeout
    while time.time() < deadline:
        running, scheduled = scan_activity()
        if running == 0:
            return True
        time.sleep(2)
    return False

# Phase A : purge des scans auto (cree par Library/create) — jusqu'a 240s.
if not wait_scan_idle(240):
    print('[seed] WARN: un scan reste en vol apres 240s, on force quand meme')

series = []
DEADLINE = time.time() + 360
posted = 0
idle_streak = 0
while time.time() < DEADLINE:
    running, scheduled = scan_activity()
    if running == 0:
        idle_streak += 1
        # Poste/reposte scan-all uniquement sur quiescence (un post pendant
        # un scan est deduplique/avale — c'est le bug d'origine).
        if posted == 0 or (idle_streak >= 2 and posted < 4):
            st, res = call('POST', '/api/Library/scan-all?force=true', token=token)
            posted += 1
            idle_streak = 0
            print(f'[seed] scan-all posted (#{posted}) -> {st}')
            time.sleep(2)
            continue
    else:
        idle_streak = 0
    series = series_count()
    if len(series) >= EXPECTED_SERIES and running == 0:
        break
    time.sleep(3)

# Repli : scan-all n'a pas suffi -> scan sequentiel par bibliotheque,
# chaque post sur quiescence verifiee.
if len(series) < EXPECTED_SERIES:
    print(f'[seed] scan-all insuffisant ({len(series)}/{EXPECTED_SERIES}), fallback scan par bibliotheque')
    st, cur = call('GET', '/api/Library/libraries', token=token)
    for lib in (cur or []):
        if time.time() > DEADLINE: break
        wait_scan_idle(120)
        st, res = call('POST', f'/api/Library/scan?libraryId={lib["id"]}&force=false', token=token)
        print(f'[seed] scan lib {lib["id"]} -> {st}')
        # attendre que CE scan finisse avant le suivant
        deadline_lib = time.time() + 120
        while time.time() < deadline_lib:
            running, scheduled = scan_activity()
            if running == 0: break
            time.sleep(2)
        series = series_count()
        if len(series) >= EXPECTED_SERIES: break

# Attente finale du vidage des scans residuels + serie complete.
deadline = time.time() + 120
while len(series) < EXPECTED_SERIES and time.time() < deadline:
    time.sleep(3)
    series = series_count()
if len(series) < EXPECTED_SERIES:
    die(f'only {len(series)}/{EXPECTED_SERIES} series after scan timeout')
wait_scan_idle(60)  # laisser les covers/metadata se finir avant la suite
print(f'[seed] {len(series)} series scanned (posts scan-all={posted})')
sid = {s['name']: s['id'] for s in series}
sid.update({s.get('originalName'): s['id'] for s in series if s.get('originalName')})
print('[seed] series ids:', sid)

# 2d. reading list + items
st, res = call('POST', '/api/ReadingList/create', {'title': 'Must Read'}, token)
if st == 200:
    rl_id = res['id']
    manga_ids = [sid[n] for n in ('One Punch Kavita', 'Attack on Test', 'Solo Leveling') if n in sid]
    st, res = call('POST', '/api/ReadingList/update-by-multiple-series',
                   {'readingListId': rl_id, 'seriesIds': manga_ids}, token)
    if st not in (200, 204): die(f'ReadingList/update-by-multiple-series -> {st} {res}')
    print(f'[seed] reading list "Must Read" id={rl_id} +{len(manga_ids)} series')
else:
    st, lists = call('GET', f'/api/ReadingList/lists?includeFullness=false&sortByLastModified=true', token=token)
    rl_id = next((l['itemId'] for l in (lists or []) if l.get('title') == 'Must Read'), None)
    if rl_id is None:
        st, lists = call('POST', '/api/ReadingList/lists',
                         {'page': 1, 'itemsPerPage': 50, 'sortField': 0, 'isAscending': True}, token)
        rl_id = next((l.get('id') or l.get('itemId') for l in (lists or []) if (l.get('title') or '') == 'Must Read'), None)
    if rl_id is None: die('reading list create rejected and none found')
    print(f'[seed] reading list exists id={rl_id}')

# 2e. collection
coll_ids = [sid[n] for n in ('Test Comics Alpha', 'Beta Men') if n in sid]
if coll_ids:
    st, res = call('POST', '/api/Collection/update-for-series',
                   {'collectionTagId': 0, 'collectionTagTitle': 'Staff Picks', 'seriesIds': coll_ids}, token)
    if st != 200: die(f'Collection/update-for-series -> {st} {res}')
    print(f'[seed] collection "Staff Picks" +{len(coll_ids)} series')

# 2f. user non-admin
st, res = call('POST', '/api/Account/invite',
               {'email': 'alice.kv45@localhost.local', 'roles': [], 'libraries': list(lib_ids.values()),
                'ageRestriction': {'ageRating': 10, 'includeUnknowns': True}}, token)  # AgeRating.NotApplicable=10
invited = st == 200 or b'already invited' in (res if isinstance(res, bytes) else b'')
print(f'[seed] invite alice -> {st}' + ('' if st == 200 else f' {res}'))

print(f'SEED_DONE series={len(series)} libs={len(lib_ids)} reading_list=1 collection=1 invited={invited}')
