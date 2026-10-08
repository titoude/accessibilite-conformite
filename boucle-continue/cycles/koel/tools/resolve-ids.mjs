/**
 * resolve-ids.mjs — résolution DYNAMIQUE des ids dépendant du seed (leçon 44).
 * koel : albums/artistes = ULID, chansons/playlists = UUID — aucun codé en dur,
 * tout est interrogé sur l'API de l'instance sous test.
 *
 * Usage :
 *   import { resolveIds } from './resolve-ids.mjs';
 *   const IDS = await resolveIds('http://localhost:9049', 'auth.json');
 *
 *   IDS.album / IDS.artist     -> ULID
 *   IDS.song                   -> UUID (pour /embed/:id)
 *   IDS.playlist               -> UUID (playlist seed "KOEL49 Morning Mix")
 *   IDS.genre                  -> nom de genre présent (ex. "Ambient")
 *   IDS.albumPath/artistPath/playlistPath/genrePath/embedPath
 *
 * Jeton : lu dans auth.json (localStorage 'api-token', valeur JSON-encodée
 * par le useLocalStorage koel). Sinon login via KOEL_EMAIL/KOEL_PASSWORD.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));

const EMAIL = process.env.KOEL_EMAIL || 'admin@koel.dev';
const PASSWORD = process.env.KOEL_PASSWORD || 'KoelIsCool';

async function getToken(B, authPath) {
  const candidates = [authPath, authPath && resolvePath(HERE, authPath)].filter(Boolean);
  for (const p of candidates) {
    if (!p || !existsSync(p)) continue;
    try {
      const st = JSON.parse(readFileSync(p, 'utf8'));
      for (const o of st.origins || []) {
        for (const it of o.localStorage || []) {
          if (it.name === 'api-token') {
            const t = JSON.parse(it.value); // useLocalStorage -> JSON
            if (t) { console.error(`[ids] jeton lu depuis ${p}`); return t; }
          }
        }
      }
    } catch { /* illisible -> login */ }
  }
  const r = await fetch(`${B}/api/me`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) throw new Error(`login admin impossible (${r.status})`);
  console.error('[ids] jeton obtenu par login admin');
  return (await r.json()).token;
}

async function api(B, token, path) {
  const r = await fetch(`${B}/api/${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status}`);
  const d = await r.json();
  return d?.data ?? d;
}

export async function resolveIds(baseUrl, authPath) {
  const B = baseUrl.replace(/\/$/, '');
  const token = await getToken(B, authPath);

  const albums = await api(B, token, 'albums');
  if (!albums.length) throw new Error('aucun album — seed requis');
  const artists = await api(B, token, 'artists');
  if (!artists.length) throw new Error('aucun artiste — seed requis');
  const songs = await api(B, token, 'songs?sort=title&order=asc');
  if (!songs.length) throw new Error('aucune chanson — seed requis');
  const playlists = await api(B, token, 'playlists');
  const pl = playlists.find(p => p.name === 'KOEL49 Morning Mix') || playlists[0];
  if (!pl) throw new Error('aucune playlist — seed requis');
  const genres = await api(B, token, 'genres');
  const genre = (genres.find(g => g.name === 'Ambient') || genres[0] || {}).name;
  if (!genre) throw new Error('aucun genre — seed requis');

  const IDS = {
    album: albums[0].id,
    artist: artists[0].id,
    song: songs[0].id,
    playlist: pl.id,
    genre,
    albumPath: `#/albums/${albums[0].id}`,
    artistPath: `#/artists/${artists[0].id}`,
    playlistPath: `#/playlists/${pl.id}`,
    genrePath: `#/genres/${encodeURIComponent(genre)}`,
    embedPath: `#/embed/${songs[0].id}`,
  };
  console.error('[ids]', JSON.stringify(IDS, null, 0));
  return IDS;
}

export function expandTokens(u, IDS) {
  return String(u)
    .replaceAll('{ALBUM}', IDS.album)
    .replaceAll('{ARTIST}', IDS.artist)
    .replaceAll('{SONG}', IDS.song)
    .replaceAll('{PLAYLIST}', IDS.playlist)
    .replaceAll('{GENRE}', encodeURIComponent(IDS.genre));
}
