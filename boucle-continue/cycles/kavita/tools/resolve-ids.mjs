/**
 * resolve-ids.mjs — résolution DYNAMIQUE des ids dépendant du seed (leçon 44 /
 * finding K3). Aucun id n'est codé en dur dans les artefacts : tout est
 * interrogé sur l'API de l'instance sous test, ce qui rend le cycle rejouable
 * verbatim sur n'importe quel seed frais.
 *
 * Usage :
 *   import { resolveIds } from './resolve-ids.mjs';
 *   const IDS = await resolveIds('http://localhost:8201', 'auth.json');
 *
 *   IDS.libs            -> [1,2,3]        ids des bibliothèques (triés)
 *   IDS.seriesFor(i)    -> id de la 1re série de libs[i]
 *   IDS.seriesPath(i)   -> '/library/<libs[i]>/series/<seriesFor(i)>'
 *   IDS.manga.url       -> route lecteur manga (chapitre résolu)
 *   IDS.book.url        -> route lecteur book  (chapitre résolu)
 *   IDS.rlPath          -> '/lists/<id>'   1re reading list
 *   IDS.libPath(i)      -> '/library/<libs[i]>'
 *
 * Jeton JWT : lu dans auth.json (storage state Playwright —
 * localStorage['kavita-user'].token). Sinon login via env
 * KV_ADMIN_USER/KV_ADMIN_PASS (défauts du seed : kv45admin / Kv45-Admin!Pass).
 *
 * Toute absence (pas de série dans une lib, pas de reading list…) lève une
 * erreur explicite — jamais de repli silencieux sur un id arbitraire.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));

const ADMIN_USER = process.env.KV_ADMIN_USER || 'kv45admin';
const ADMIN_PASS = process.env.KV_ADMIN_PASS || 'Kv45-Admin!Pass';

// LibraryType côté serveur : Manga=0 Comic=1 Book=2 Image=3 LightNovel=4 ComicVine=5
const READER_MANGA_TYPES = new Set([0, 1, 5]);   // archives (cbz/cbr) -> lecteur manga
const READER_BOOK_TYPES = new Set([2, 4]);       // epub -> lecteur book

async function getToken(B, authPath) {
  const candidates = [authPath, authPath && resolvePath(HERE, authPath)].filter(Boolean);
  for (const p of candidates) {
    if (!p || !existsSync(p)) continue;
    try {
      const st = JSON.parse(readFileSync(p, 'utf8'));
      for (const o of st.origins || []) {
        for (const it of o.localStorage || []) {
          if (it.name === 'kavita-user') {
            const u = JSON.parse(it.value);
            if (u && u.token) { console.error(`[ids] jeton lu depuis ${p}`); return u.token; }
          }
        }
      }
    } catch { /* json illisible -> on tente le login */ }
  }
  const r = await fetch(`${B}/api/Account/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
  });
  if (!r.ok) throw new Error(`login admin impossible (${r.status}) — fournir auth.json ou KV_ADMIN_*`);
  console.error('[ids] jeton obtenu par login admin');
  return (await r.json()).token;
}

export async function resolveIds(B, authPath = 'auth.json') {
  B = B.replace(/\/$/, '');
  const token = await getToken(B, authPath);
  const api = async (method, path, body) => {
    const r = await fetch(B + path, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`${method} ${path} -> HTTP ${r.status}`);
    return r.json();
  };

  // Bibliothèques, triées par id — ordre stable d'un seed à l'autre.
  const libs = (await api('GET', '/api/Library/libraries')).sort((a, b) => a.id - b.id);
  if (!libs.length) throw new Error('aucune bibliothèque — lancer seed.py d\'abord');

  // Toutes les séries visibles pour l'admin (PagedList sérialisé en tableau).
  const allSeries = await api('POST', '/api/Series/all-v2',
    { statements: [], combination: 1, sortOptions: null, limitTo: 0, applyAgeRating: false });
  const seriesList = Array.isArray(allSeries) ? allSeries : (allSeries.items || allSeries.series || []);
  const byLib = new Map();
  for (const s of seriesList) {
    if (!byLib.has(s.libraryId)) byLib.set(s.libraryId, s.id);
  }

  const seriesFor = (i) => {
    const lib = libs[i];
    if (!lib) throw new Error(`libs[${i}] absent (${libs.length} libs seedées)`);
    const sid = byLib.get(lib.id);
    if (!sid) throw new Error(`aucune série dans la bibliothèque ${lib.id} (${lib.name})`);
    return sid;
  };

  const firstChapterOf = async (seriesId) => {
    const vols = await api('GET', `/api/Series/volumes?seriesId=${seriesId}`);
    for (const v of vols) {
      if (v.chapters && v.chapters.length) return v.chapters[0].id;
      if (v.id) return v.id; // volume seul : la route lecteur accepte le chapitre résolu par le resolver
    }
    throw new Error(`série ${seriesId} : aucun chapitre/volume`);
  };

  // Premier exemplaire manga (lib de type archive) et book (epub).
  const findReader = async (types) => {
    for (const lib of libs) {
      if (!types.has(lib.type)) continue;
      const sid = byLib.get(lib.id);
      if (!sid) continue;
      const ch = await firstChapterOf(sid);
      return { lib: lib.id, series: sid, chapter: ch };
    }
    return null;
  };
  const manga = await findReader(READER_MANGA_TYPES);
  const book = await findReader(READER_BOOK_TYPES);

  // Reading list : POST lists (endpoint réel du service UI)
  const lists = await api('POST', '/api/ReadingList/lists?includePromoted=true&sortByLastModified=false&pageNumber=1&pageSize=50', {});
  const rlId = (Array.isArray(lists) && lists.length) ? lists[0].id : null;

  // Utilisateur courant — /profile/:userId exige l'id dans la route
  const me = await api('GET', '/api/Account');
  const userId = me && me.id != null ? me.id : null;

  const out = {
    libs: libs.map(l => l.id),
    libPath: (i) => {
      if (!libs[i]) throw new Error(`libs[${i}] absent`);
      return `/library/${libs[i].id}`;
    },
    seriesFor,
    seriesPath: (i) => `${out.libPath(i)}/series/${seriesFor(i)}`,
    seriesDetail: undefined, // rempli ci-dessous
    manga: manga ? { ...manga, url: `/library/${manga.lib}/series/${manga.series}/manga/${manga.chapter}` } : null,
    book: book ? { ...book, url: `/library/${book.lib}/series/${book.series}/book/${book.chapter}` } : null,
    rlId,
    rlPath: rlId ? `/lists/${rlId}` : null,
    userId,
    profilePath: userId != null ? `/profile/${userId}` : null,
  };
  out.seriesDetail = out.seriesPath(0); // série canonique = 1re série de la 1re lib
  if (!out.manga) throw new Error('aucune série dans une bibliothèque de type manga/archive — seed incomplet');
  console.error(`[ids] libs=${out.libs.join(',')} series=${out.libs.map((_, i) => { try { return seriesFor(i); } catch { return '∅'; } }).join(',')} manga=${out.manga?.url} book=${out.book?.url ?? 'absent'} rl=${rlId ?? 'absent'}`);
  return out;
}

/**
 * Expansion des tokens {LIB0..n} {SERIES0..n} {MANGA_*} {BOOK_*} {RL0} {USER}
 * dans les urls --urls (leçon 44 : les fichiers d'urls ne portent plus
 * d'id d'instance en dur). Tout token inconnu lève une erreur.
 */
export function expandTokens(str, ids) {
  const table = {
    ...Object.fromEntries(ids.libs.map((id, i) => [`LIB${i}`, id])),
    ...Object.fromEntries(ids.libs.map((lib, i) => [`SERIES${i}`, (() => { try { return ids.seriesFor(i); } catch { return 'ABSENT'; } })()])),
    MANGA_LIB: ids.manga?.lib, MANGA_SERIES: ids.manga?.series, MANGA_CH: ids.manga?.chapter,
    BOOK_LIB: ids.book?.lib, BOOK_SERIES: ids.book?.series, BOOK_CH: ids.book?.chapter,
    RL0: ids.rlId,
    USER: ids.userId,
  };
  return str.replace(/\{([A-Z_0-9]+)\}/g, (m, tok) => {
    if (!(tok in table) || table[tok] == null || table[tok] === 'ABSENT') {
      throw new Error(`token ${m} non résolu par le seed de cette instance`);
    }
    return String(table[tok]);
  });
}
