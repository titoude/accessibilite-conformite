// seed.mjs — seed déterministe SABnzbd pour l'audit a11y (cycle 25)
// Usage: node seed.mjs <base-url> <chemin-sabnzbd.ini>
// Lit api_key dans l'ini, puis via /api (auth apikey, immunisée au login) :
//   1. login username=a11y / password=a11y-pw-2026 (active la page /login)
//   2. serveur NNTP désactivé "news.invalid.example" (peuple /config/server)
//   3. indexer newznab "BenchIndex" (peuple /config/nzbsearch + modale recherche)
//   4. flux RSS "benchmark-feed" uri injoignable feed.invalid.example (peuple /config/rss)
//      NB: pas d'IP littérale — get_base_url('127.0.0.1')='0.0.1' → favicon TCP pendant → 'load' jamais
//   5. 1 NZB en queue (bloqué — aucun serveur actif, déterministe)
//   6. 2 lignes history (Completed + Failed) via node:sqlite sur history1.db
// Idempotent : purge queue + history avant insert.
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';

const base = (process.argv[2] || 'http://127.0.0.1:8080').replace(/\/$/, '');
const iniPath = process.argv[3];
if (!iniPath) { console.error('usage: node seed.mjs <base-url> <sabnzbd.ini>'); process.exit(2); }
const ini = readFileSync(iniPath, 'utf8');
const apiKey = ini.match(/^api_key = (.+)$/m)?.[1]?.trim();
if (!apiKey) throw new Error('api_key introuvable dans ' + iniPath);
const dataDir = join(iniPath, '..');
const api = async (params, method = 'GET', body) => {
  const qs = new URLSearchParams({ apikey: apiKey, output: 'json', ...params });
  const r = await fetch(`${base}/api?${method === 'GET' ? qs : ''}`, {
    method,
    headers: method === 'POST' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {},
    body: method === 'POST' ? qs : body,
  });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { raw: t.slice(0, 200), status: r.status }; }
};
const step = (name, ok) => console.log((ok ? '[ok] ' : '[FAIL] ') + name);

// 1. login configuré (active /login + sessions + logout)
let r = await api({ mode: 'set_config', section: 'misc', keyword: 'username', value: 'a11y' });
step('username=a11y', r.status === true || r.config !== undefined);
r = await api({ mode: 'set_config', section: 'misc', keyword: 'password', value: 'a11y-pw-2026' });
step('password configuré', r.status === true || r.config !== undefined);

// 2. serveur NNTP désactivé (host inexistant : enable=0 → aucun test réseau)
r = await api({
  mode: 'set_config', section: 'servers', keyword: 'benchserv', name: 'benchserv',
  displayname: 'Benchmark Usenet', host: 'news.invalid.example', port: '563',
  ssl: '1', enable: '0', username: 'sabuser', password: 'sabpass',
  connections: '8', timeout: '60', priority: '0', notes: 'Serveur de bench — désactivé',
});
step('serveur benchserv', r.status === true || r.config !== undefined);

// 3. indexer newznab actif
r = await api({
  mode: 'set_config', section: 'indexers', keyword: 'BenchIndex', name: 'BenchIndex',
  host: 'https://index.invalid.example', api_key: 'deadbeefcafe12345678',
  api_path: '/api', enable: '1', notes: 'Indexer de bench',
});
step('indexer BenchIndex', r.status === true || r.config !== undefined);

// 4. flux RSS (uri feed.invalid.example — NXDOMAIN rapide si fetch ; une IP
// littérale produit baselink '0.0.1' dont le favicon bloque l'événement load)
r = await api({
  mode: 'set_config', section: 'rss', keyword: 'benchmark-feed', name: 'benchmark-feed',
  uri: 'http://feed.invalid.example/rss.xml', enable: '1', cat: '*', pp: '', script: 'Default', priority: '0',
});
step('flux benchmark-feed', r.status === true || r.config !== undefined);

// 5. queue : purge puis 1 NZB déterministe
await api({ mode: 'queue', name: 'delete', value: 'all', del_files: '0' });
const nzb = `<?xml version="1.0" encoding="iso-8859-1" ?>
<!DOCTYPE nzb PUBLIC "-//newzBin//DTD NZB 1.1//EN" "http://www.newzbin.com/DTD/nzb/nzb-1.1.dtd">
<nzb xmlns="http://www.newzbin.com/DTD/nzb/nzb-1.1.dtd">
  <head><meta type="name">TestJob A11Y Benchmark</meta></head>
  <file poster="test@example.com" date="1700000000" subject="TestJob A11Y Benchmark - &quot;testjob.par2&quot; yEnc (1/1)">
    <groups><group>alt.binaries.test</group></groups>
    <segments>
      <segment bytes="5242880" number="1">nonexistent-segment-0001@news.example.com</segment>
      <segment bytes="2621440" number="2">nonexistent-segment-0002@news.example.com</segment>
    </segments>
  </file>
</nzb>`;
const fd = new FormData();
fd.append('nzbfile', new Blob([nzb], { type: 'text/xml' }), 'test-job-a11y.nzb');
const ru = await fetch(`${base}/api?mode=addfile&apikey=${apiKey}&output=json`, { method: 'POST', body: fd });
const rj = await ru.json();
step('NZB queue ' + JSON.stringify(rj), rj.status === true && rj.nzo_ids?.length === 1);

// 6. history : purge + 2 lignes réalistes (Completed + Failed)
// Completed : étage 'Script' + script_log compressé → lien "(more)" → modale
// history-script-log. Failed : path pointant sur un dir EXISTANT → retry=True
// → bouton retry + modale modal-retry-job accessibles.
import { deflateSync } from 'node:zlib';
import { mkdirSync } from 'node:fs';
const retryPath = join(dataDir, 'Downloads', 'incomplete', 'Series.Pilote.S01E01.720p');
mkdirSync(retryPath, { recursive: true });
const db = new DatabaseSync(join(dataDir, 'admin', 'history1.db'));
db.exec('DELETE FROM history');
const now = Math.floor(Date.now() / 1000);
const ins = db.prepare(`INSERT INTO history (completed, name, nzb_name, category, pp, script, report,
  url, status, nzo_id, storage, path, script_log, script_line, download_time, postproc_time, stage_log,
  downloaded, fail_message, url_info, bytes, duplicate_key, md5sum, password, time_added)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
ins.run(now - 3600, 'Films.Documentaire.2024.1080p', 'Films.Documentaire.2024.1080p.nzb', '*', 'D', 'None', '', '', 'Completed',
  'SABnzbd_nzo_a11ycompleted01', join(dataDir, 'Downloads/complete/Films.Documentaire.2024.1080p'), '',
  deflateSync('Sortie du script de post-traitement : normalisation des noms OK'), 'post-process.py terminé', 120, 5,
  'Source:::Downloaded in 2 mins at an average of 1.5 MB/s\r\nRepair:::Repaired in 5 seconds\r\nScript:::post-process.py exécuté en 1 s',
  150000000, '', '', 150000000, 'a11ycompleted01', 'deadbeef0001', '', now - 3600);
ins.run(now - 1800, 'Series.Pilote.S01E01.720p', 'Series.Pilote.S01E01.720p.nzb', '*', 'D', 'None', '', '', 'Failed',
  'SABnzbd_nzo_a11yfailed0002', '', retryPath,
  null, '', 60, 2, 'Source:::Downloaded in 1 mins at an average of 0.8 MB/s',
  50000000, 'Repair failed, not enough repair blocks', '', 80000000, 'a11yfailed0002', 'deadbeef0002', '', now - 1800);
db.close();
step('history 2 lignes (Completed+Failed, script_log + retry)', true);

// vérif finale
const q = await api({ mode: 'queue' });
const h = await api({ mode: 'history' });
console.log(`queue.slots=${q.queue?.slots?.length} history.slots=${h.history?.slots?.length}`);
