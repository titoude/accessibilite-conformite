// seed.mjs — seed déterministe uptime-kuma (cycle 29) via l'API socket.io réelle
// + insertions sqlite directes pour figer les heartbeats/stats (app realtime :
// les compteurs bougent — le seed fige l'état : monitors créés avec active:false,
// aucun heartbeat ne sera écrit par le serveur).
//
// Usage : node seed.mjs [baseUrl] [kumaDbPath]
//   défauts : http://localhost:3001, $DATA_DIR/kuma.db ou ~/work/uk-data/kuma.db
// Prérequis : serveur uptime-kuma démarré sur un DATA_DIR vierge
//   (UPTIME_KUMA_DB_TYPE=sqlite DATA_DIR=<dir> PORT=3001 npm run start-server)
// Idempotent : si l'admin existe déjà, login seul est fait ; les adds qui échouent
//   avec un doublon sont tolérés ; les heartbeats/stats ne sont insérés qu'une fois.
import { createRequire } from 'node:module';
import { DatabaseSync } from 'node:sqlite';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(resolve(process.cwd(), 'package.json'));
const { io } = require('socket.io-client');

const base = process.argv[2] || 'http://localhost:3001';
const defaultDb = process.env.DATA_DIR
    ? `${process.env.DATA_DIR}/kuma.db`
    : `${process.env.HOME}/work/uk-data/kuma.db`;
const dbPath = process.argv[3] || defaultDb;

const USER = 'admin';
const PASS = 'Admin12345!';

const socket = io(base, { transports: ['polling'], reconnection: false, timeout: 15000 });
const emit = (ev, ...args) =>
    new Promise((res, rej) => {
        const t = setTimeout(() => rej(new Error(`timeout emit ${ev}`)), 15000);
        socket.emit(ev, ...args, (r) => {
            clearTimeout(t);
            res(r);
        });
    });

await new Promise((res, rej) => {
    socket.on('connect', res);
    socket.on('connect_error', rej);
});

// 1. Setup admin si première instance
const needSetup = await emit('needSetup');
console.log('needSetup =', needSetup);
if (needSetup) {
    const s = await emit('setup', USER, PASS);
    console.log('setup =', JSON.stringify(s));
    if (!s.ok) { console.error('FAIL setup'); process.exit(1); }
}

// 2. Login (la session socket est authentifiée après ok)
const login = await emit('login', { username: USER, password: PASS });
console.log('login.ok =', login.ok);
if (!login.ok) { console.error('FAIL login', JSON.stringify(login)); process.exit(1); }

// 3. Monitors — active:false => jamais démarrés => DOM figé (leçon gatus :
//    données qui croissent => comptes flottants). Ids déterministes sur DB vierge :
//    1=Groupe Production (group), 2=Test HTTP (enfant de 1), 3=Ping Localhost (enfant de 1),
//    4=Screenshot Test (real-browser, hors groupe — surface ScreenshotDialog)
const monitorDefaults = {
    method: 'GET', ipFamily: null, interval: 60, retryInterval: 60, resendInterval: 0,
    maxretries: 0, retryOnlyOnStatusCodeFailure: false, notificationIDList: {},
    ignoreTls: false, upsideDown: false, expiryNotification: false, domainExpiryNotification: false,
    maxredirects: 10, accepted_statuscodes: ['200-299'], saveResponse: false, saveErrorResponse: true,
    responseMaxLength: 1024, dns_resolve_type: 'A', dns_resolve_server: '', docker_container: '',
    docker_host: null, proxyId: null, basic_auth_user: '', basic_auth_pass: '', bearer_token: '',
    mqttUsername: '', mqttPassword: '', mqttTopic: '', mqttWebsocketPath: '', mqttSuccessMessage: '',
    mqttCheckType: 'keyword', authMethod: null, oauth_auth_method: 'client_secret_basic',
    httpBodyEncoding: 'json', kafkaProducerBrokers: [], kafkaProducerSaslOptions: { mechanism: 'None' },
    cacheBust: false, kafkaProducerSsl: false, kafkaProducerAllowAutoTopicCreation: false,
    gamedigGivenPortOnly: true, gamedigToken: '', remote_browser: null, screenshot_delay: 0,
    rabbitmqNodes: [], rabbitmqUsername: '', rabbitmqPassword: '', conditions: [],
    system_service_name: '', sshAuthMethod: 'password', ntpStratumThreshold: 5,
    ntpTimeOffsetThreshold: 1000, ntpRootDispersionThreshold: 500, active: false,
};

const existing = await emit('getMonitorList');
const haveMonitors = existing && existing.ok !== false && Object.keys(existing).length > 2;
let m1 = 1, m2 = 2, m3 = 3;
if (haveMonitors) {
    console.log('monitors déjà présents — skip adds');
} else {
    const g = await emit('add', { ...monitorDefaults, type: 'group', name: 'Groupe Production', url: 'https://' });
    console.log('add group =', JSON.stringify(g));
    if (!g.ok) console.error('add group FAIL');
    const a = await emit('add', { ...monitorDefaults, type: 'http', name: 'Test HTTP', url: 'https://example.com', parent: m1 });
    console.log('add http =', JSON.stringify(a));
    const b = await emit('add', { ...monitorDefaults, type: 'ping', name: 'Ping Localhost', hostname: '127.0.0.1', url: 'https://', parent: m1, packetSize: 56, ping_count: 3, ping_numeric: true, ping_per_request_timeout: 2 });
    console.log('add ping =', JSON.stringify(b));
    // 4=Screenshot Test (real-browser, active:false) — nécessaire pour la surface
    // ScreenshotDialog qui ne se rend que si monitor.type === 'real-browser'
    const c = await emit('add', { ...monitorDefaults, type: 'real-browser', name: 'Screenshot Test', url: 'https://example.com' });
    console.log('add real-browser =', JSON.stringify(c));
}

// 4. Tag littéral "prod" rouge sur monitor 2
const tagRes = await emit('addTag', { name: 'prod', color: '#DC2626' });
console.log('addTag =', JSON.stringify(tagRes));
const tagID = tagRes && (tagRes.tagID ?? (tagRes.tag && tagRes.tag.id));
if (tagID) {
    const mt = await emit('addMonitorTag', tagID, m2, 'web');
    console.log('addMonitorTag =', JSON.stringify(mt));
}

// 5. Status page publique slug "demo" + groupe public "Services publics"
const sp = await emit('addStatusPage', 'Status Démo', 'demo');
console.log('addStatusPage =', JSON.stringify(sp));
if (sp.ok || /already|exist/i.test(String(sp.msg))) {
    const cfg = {
        slug: 'demo', title: 'Status Démo', description: 'Page de statut publique du seed a11y',
        logo: '', autoRefreshInterval: 3600, theme: 'light', showTags: false,
        footerText: 'Seed cycle 29', customCSS: '', showPoweredBy: false,
        showOnlyLastHeartbeat: false, showCertificateExpiry: false,
        analyticsId: null, analyticsScriptUrl: null, analyticsType: null,
        domainNameList: [],
    };
    const pgl = [
        {
            name: 'Services publics',
            monitorList: [
                { id: m2, sendUrl: true, url: 'https://example.com' },
                { id: m3, sendUrl: false, url: '' },
            ],
        },
    ];
    const sv = await emit('saveStatusPage', 'demo', cfg, '/icon.svg', pgl);
    console.log('saveStatusPage =', JSON.stringify(sv));
}

// 6. Maintenance littérale (fenêtre unique passée → statut 'under maintenance' non actif;
//    active:false pour figer — couvre /maintenance et /maintenance/edit/1)
const maint = await emit('addMaintenance', {
    title: 'Maintenance trimestrielle',
    description: 'Fenêtre de maintenance planifiée du seed a11y.',
    strategy: 'single',
    intervalDay: 1,
    timezoneOption: 'UTC',
    active: false,
    dateRange: ['2030-01-01T02:00', '2030-01-01T03:00'],
    timeRange: [{ hours: 2, minutes: 0 }, { hours: 3, minutes: 0 }],
    weekdays: [], daysOfMonth: [], cron: '30 3 * * *', durationMinutes: 60,
});
console.log('addMaintenance =', JSON.stringify(maint));

socket.disconnect();

// 7. Heartbeats + stats figés — INSERT direct sqlite (WAL tolère l'écriture concurrente ;
//    les monitors active:false n'écriront jamais de beat => comptes reproductibles)
if (!existsSync(dbPath)) {
    console.error('FAIL: kuma.db absent à', dbPath);
    process.exit(1);
}
const db = new DatabaseSync(dbPath);
const hbCount = db.prepare('SELECT COUNT(*) c FROM heartbeat').get().c;
if (hbCount > 0) {
    console.log(`heartbeats déjà présents (${hbCount}) — skip insert`);
    db.close();
    console.log('seed ok');
    process.exit(0);
}

const now = Math.floor(Date.now() / 1000);
const insHb = db.prepare(
    'INSERT INTO heartbeat (important, monitor_id, status, msg, time, ping, duration, down_count, retries) VALUES (?,?,?,?,?,?,?,?,?)'
);
// statut : 1=up, 0=down, 2=pending, 3=maintenance — fenêtre DATETIME locale SQLite (UTC naïf)
const iso = (epoch) => new Date(epoch * 1000).toISOString().slice(0, 19).replace('T', ' ');

// Monitor 2 (Test HTTP) : 60 beats/min. Pattern figé : up majoritaire,
// 1 maintenance à T-45min, 2 downs à T-30/-29min (important=1 sur les transitions),
// un pending à T-31min. Ping ~100ms up.
{
    let prev = 1;
    for (let i = 59; i >= 0; i--) {
        const t = now - i * 60;
        let status = 1, msg = '200 - OK', ping = 95 + (i % 7) * 5;
        if (i === 45) { status = 3; msg = 'Under maintenance'; ping = 0; }
        else if (i === 31) { status = 2; msg = 'Connection timeout'; ping = 0; }
        else if (i === 30 || i === 29) { status = 0; msg = 'Connection timeout'; ping = 0; }
        const important = status !== prev ? 1 : 0;
        insHb.run(important, m2, status, msg, iso(t), ping, 180, status === 0 ? 1 : 0, status === 0 ? 1 : 0);
        prev = status;
    }
}
// Monitor 3 (Ping Localhost) : 60 beats up ping ~4ms.
{
    for (let i = 59; i >= 0; i--) {
        const t = now - i * 60;
        insHb.run(0, m3, 1, '4 ms', iso(t), 4 + (i % 3), 60, 0, 0);
    }
}

// stat_minutely : 2 dernières heures pour les badges uptime 24h (up=1 sauf la minute
// des downs). timestamp = unix tronqué à la minute (divisionKey amont).
const insMin = db.prepare(
    'INSERT INTO stat_minutely (monitor_id, timestamp, ping, up, down, ping_min, ping_max) VALUES (?,?,?,?,?,?,?)'
);
for (let i = 119; i >= 0; i--) {
    const t = now - i * 60 - (now % 60);
    const downMin = (i === 30 || i === 29) ? 1 : 0;
    insMin.run(m2, t, 100, 1 - downMin, downMin, 90, 140);
    insMin.run(m3, t, 4, 1, 0, 2, 9);
}
// stat_hourly : 30 derniers jours agrégés en 48 heures récentes (badge 30d).
const insHr = db.prepare(
    'INSERT INTO stat_hourly (monitor_id, timestamp, ping, ping_min, ping_max, up, down) VALUES (?,?,?,?,?,?,?)'
);
for (let i = 47; i >= 0; i--) {
    const t = now - i * 3600 - (now % 3600);
    insHr.run(m2, t, 102, 88, 160, 60, 0);
    insHr.run(m3, t, 4, 2, 9, 60, 0);
}
// stat_daily : 14 derniers jours (badge 1y partiel — déclaré dans le manifeste).
const insDay = db.prepare(
    'INSERT INTO stat_daily (monitor_id, timestamp, ping, up, down, ping_min, ping_max) VALUES (?,?,?,?,?,?,?)'
);
const dayStart = now - (now % 86400);
for (let i = 13; i >= 0; i--) {
    insDay.run(m2, dayStart - i * 86400, 101, 1440, 0, 90, 150);
    insDay.run(m3, dayStart - i * 86400, 4, 1440, 0, 2, 9);
}
db.close();
console.log('seed ok — 2 monitors (group+2 enfants), tag prod, status page demo, maintenance, 120 heartbeats, stats 2h/48h/14j');
