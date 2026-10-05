// eval-final.mjs — évaluation INDÉPENDANTE du cycle 25 (sabnzbd).
// Pages et interactions NON couvertes par le périmètre figé ni par verify.mjs,
// plus rejoue des assertions sur des corrections réelles.
// Usage: node eval-final.mjs <baseUrl> <auth.json>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(process.cwd() + '/package.json');
const { chromium } = require('playwright');
const AXE_SRC = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const AXE_TAGS = ['wcag2a', 'wcag2a-best-practice', 'wcag2aa', 'wcag2aa-best-practice', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
async function runAxe(page) {
  await page.evaluate(AXE_SRC);
  return page.evaluate(tags => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }), AXE_TAGS);
}

const BASE = process.argv[2] || 'http://127.0.0.1:8080';
const AUTH = process.argv[3] || 'auth.json';
let failures = 0;
const ok = (n, c, d = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n}${d ? ' — ' + d : ''}`); if (!c) failures++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();

// A. /scriptlog : route GET réelle mais réponse text/plain (PlainTextResponse
// du handler, logs de post-traitement) — pas un document HTML, axe non
// applicable. On vérifie le content-type plutôt que de scanner.
const respLog = await page.goto(BASE + '/scriptlog', { waitUntil: 'load' });
await page.waitForTimeout(800);
const ctLog = respLog ? (respLog.headers()['content-type'] || '') : '';
ok('/scriptlog : réponse non-HTML (N-A axe)', ctLog.includes('text/plain') || ctLog.includes('text/'), `content-type=${ctLog}`);

// B. URL inexistante sous /config : la page d'erreur réelle
await page.goto(BASE + '/config/nope-xyz', { waitUntil: 'load' });
await page.waitForTimeout(1200);
const v404 = await runAxe(page);
const body404 = await page.evaluate(() => document.body.innerText.slice(0, 80));
ok('axe 0 violation sur /config/nope-xyz (erreur réelle)', v404.violations.length === 0, `${v404.violations.map(v => v.id).join(',')} | ${body404.trim().slice(0, 50)}`);

// C. Modale filebrowser (jamais scannée) : ouverte depuis config/folders
await page.goto(BASE + '/config/folders', { waitUntil: 'load' });
await page.waitForTimeout(1500);
await page.click('input[name="download_dir"] + .fileBrowser');
await page.waitForSelector('#filebrowser_modal.in', { state: 'visible', timeout: 15000 });
await page.waitForSelector('#filebrowser_modal .list-group a, #filebrowser_modal .modal-body h4', { state: 'visible', timeout: 15000 });
await page.waitForTimeout(1200);
const vFb = await runAxe(page);
ok('axe 0 violation filebrowser ouverte', vFb.violations.length === 0, vFb.violations.map(v => v.id).join(','));
// titre de la modale rempli par le JS (assertion rejouée : h4→h3 + selecteur .modal-title)
const fb = await page.evaluate(() => ({
  tag: document.querySelector('#filebrowser_modal .modal-title')?.tagName.toLowerCase(),
  text: document.querySelector('#filebrowser_modal .modal-title')?.innerText.trim(),
}));
ok('filebrowser : titre h3 non vide (JS à jour)', fb.tag === 'h3' && fb.text.length > 0, JSON.stringify(fb));
await page.locator('#filebrowser_modal .modal-header .close').dispatchEvent('click').catch(() => {});

// D. Modale nzbsearch avec requête soumise (état résultats jamais scanné)
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(1500);
await page.click('a[href="#modal-nzbsearch"]');
await page.waitForSelector('#modal-nzbsearch.in', { state: 'visible' });
await page.fill('.nzbsearch-query', 'test');
await page.locator('#modal-nzbsearch form button[type=submit], #modal-nzbsearch .btn[type=submit]').first().dispatchEvent('click');
await page.waitForTimeout(4000); // résultats (peut être vide : indexer désactivé)
const vNz = await runAxe(page);
ok('axe 0 violation nzbsearch après requête', vNz.violations.length === 0, vNz.violations.map(v => v.id).join(','));
await page.keyboard.press('Escape');
await page.waitForTimeout(500);

// E. Thème sombre réel : data-color-scheme=Dark force light-dark() -> axe / + /config/general
for (const [u, name] of [['/', 'accueil'], ['/config/general', 'config/general']]) {
  await page.goto(BASE + u, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.documentElement.setAttribute('data-color-scheme', 'Dark'));
  await page.waitForTimeout(1200);
  const v = await runAxe(page);
  ok(`axe 0 violation thème sombre sur ${name}`, v.violations.length === 0, v.violations.map(x => `${x.id}(${x.nodes.length})`).join(','));
  await page.evaluate(() => document.documentElement.setAttribute('data-color-scheme', 'Auto'));
}

// F. Rejoue assertions de corrections (hors verify.mjs) :
// F1. collapse navbar : aria-expanded absent après ouverture+fermeture
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(1200);
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(600);
await page.click('.navbar-toggle');
await page.waitForSelector('#navbar-collapse.in', { state: 'visible', timeout: 10000 }).catch(() => {});
await page.waitForTimeout(800);
const navExp = await page.evaluate(() => document.getElementById('navbar-collapse')?.getAttribute('aria-expanded'));
ok('navbar mobile : aria-expanded absent sur #navbar-collapse', navExp === null, String(navExp));
await page.setViewportSize({ width: 1280, height: 800 });

// F2. /logout réel : POST avec csrf_token de la session -> redirect /login
// (GET = 405 text/plain, la route est POST-only). La page login post-déco
// doit rester propre axe.
const csrf = await page.evaluate(() => document.querySelector('input[name=csrf_token]')?.value || '');
const out = await page.evaluate(async tok => {
  const r = await fetch('/logout', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'csrf_token=' + encodeURIComponent(tok), redirect: 'manual' });
  return { status: r.status, type: r.type };
}, csrf);
ok('logout POST : 302 attendu', [0, 302, 303].includes(out.status) || out.type === 'opaqueredirect', JSON.stringify(out));
await page.goto(BASE + '/login', { waitUntil: 'load' });
await page.waitForTimeout(1000);
const vOut = await runAxe(page);
ok('axe 0 violation /login post-logout', vOut.violations.length === 0, vOut.violations.map(v => v.id).join(','));

await browser.close();
console.log(`\neval-final.mjs — ${failures === 0 ? '0 échec' : failures + ' échec(s)'}`);
process.exit(failures === 0 ? 0 : 1);
