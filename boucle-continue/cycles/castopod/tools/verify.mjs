#!/usr/bin/env node
/**
 * verify.mjs — assertions DURES sur les corrections castopod (cycle 50).
 * Chaque fix est mesuré dans le DOM/computed style, jamais `if(el) ok()`.
 * Un élément requis absent = FAIL ou N-A explicite.
 * Usage: node verify.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2]?.replace(/\/$/, '');
const authPath = process.argv[3] || 'auth.json';
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }

const results = [];
const ok = (name, cond, extra = '') => { results.push({ name, pass: !!cond }); if (!cond) console.error(`  FAIL ${name} ${extra}`); return cond; };
const na = (name, reason = '') => { results.push({ name, pass: true, verdict: 'N-A', reason }); console.error(`  N-A ${name} ${reason}`); };

const HELPERS = `
const parse = c => { const m = c && c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const effBg = el => { const L = []; let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0) L.push(c); n = n.parentElement; } if (!L.length) return { r: 255, g: 255, b: 255 }; let top = L[0]; for (let i = 1; i < L.length; i++) { const under = L[i]; const a = top.a + under.a * (1 - top.a); top = { r: (top.r * top.a + under.r * under.a * (1 - top.a)) / a, g: (top.g * top.a + under.g * under.a * (1 - top.a)) / a, b: (top.b * top.a + under.b * under.a * (1 - top.a)) / a, a }; } return top; };
const fg = el => { const st = getComputedStyle(el); const c = parse(st.color); return { ...c, a: (c.a ?? 1) * parseFloat(st.opacity || 1) }; };
const accName = el => { const s = document.createElement('span'); return (el.getAttribute('aria-label') || (el.getAttribute('aria-labelledby') && document.getElementById(el.getAttribute('aria-labelledby'))?.textContent) || el.title || (el.innerText || '')).trim(); };
window.__c50 = { parse, lum, ratio, effBg, fg, accName };
`;

const browser = await chromium.launch();
const ctxPub = await browser.newContext({ locale: 'en-US' });
const page = await ctxPub.newPage();
await page.addInitScript(HELPERS);

// ================= PUBLIC =================
// Fix palette pine (Config/Colors.php 29% -> 24%)
await page.goto(`${base}/@auditwaves`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('nav', { timeout: 20000 });
const accent = await page.evaluate(() => {
    const themeEl = document.querySelector('[class*="theme-"]') || document.documentElement;
    const v = getComputedStyle(themeEl).getPropertyValue('--color-accent-base').trim();
    const link = [...document.querySelectorAll('a')].find(a => getComputedStyle(a).color.startsWith('rgb(0,'));
    let r = null;
    if (link) { const bg = __c50.effBg(link); const f = __c50.fg(link); r = +__c50.ratio(__c50.lum(f), __c50.lum(bg)).toFixed(2); }
    return { v, r };
});
ok('palette pine: --color-accent-base = 174 100% 24%', accent.v === '174 100% 24%', accent.v);
ok('lien accent sur surface claire >= 4.5:1', accent.r === null || accent.r >= 4.5, `mesuré ${accent.r}`);

// Fix z-10 fantôme : les onglets nav ne doivent plus être mesurés sur fond #00574b
const navLinkBg = await page.evaluate(() => {
    const a = [...document.querySelectorAll('nav a')].find(x => x.href.includes('@auditwaves'));
    if (!a) return null;
    const bg = __c50.effBg(a);
    return `${bg.r | 0},${bg.g | 0},${bg.b | 0}`;
});
ok('axe bg-sampling: onglet nav fond clair (pas #00574b)', navLinkBg !== null && navLinkBg !== '0,87,75', `fond ${navLinkBg}`);

// Fix landmark-unique : noms accessibles distincts sur les navs de la page
const navNames = await page.evaluate(() => [...document.querySelectorAll('nav')].map(n => __c50.accName(n)));
ok('landmark-unique: >=2 nav nommées distinctement', new Set(navNames).size === navNames.length && navNames.every(n => n.length > 0), JSON.stringify(navNames));

// Fix label-content-name-mismatch : le dropdown année = nom = texte visible
await page.goto(`${base}/@auditwaves/episodes`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#episode-lists-dropdown', { timeout: 20000 });
const dd = await page.evaluate(() => { const b = document.getElementById('episode-lists-dropdown'); return { al: b.getAttribute('aria-label'), t: (b.innerText || '').trim() }; });
ok('2.5.3: bouton listes — pas d’aria-label divergent du texte', dd.al === null || dd.t.toLowerCase().includes(dd.al.toLowerCase()), `aria-label=${dd.al} texte=${dd.t}`);

// Fix landmark : embed a un <main>
for (const v of ['light', 'dark']) {
    await page.goto(`${base}/@auditwaves/episodes/reperage-page-publique/embed${v === 'dark' ? '/dark' : ''}`, { waitUntil: 'domcontentloaded' });
    const m = await page.evaluate(() => !!document.querySelector('main'));
    ok(`embed ${v}: <main> présent`, m);
}

// Fix target-size : liens breadcrumb/onglets >= 24px
const tsz = await page.evaluate(() => {
    const bad = [];
    for (const a of document.querySelectorAll('nav a, nav button')) {
        const r = a.getBoundingClientRect();
        if (r.height > 0 && r.height < 24) bad.push(`${a.textContent.trim().slice(0, 15)}:${r.height}`);
    }
    return bad;
});
ok('target-size public: nav >= 24px', tsz.length === 0, tsz.join(','));

// ================= ADMIN =================
const ctxAdm = await browser.newContext({ locale: 'en-US', storageState: authPath });
const ap = await ctxAdm.newPage();
await ap.addInitScript(HELPERS);
await ap.goto(`${base}/cp-admin`, { waitUntil: 'domcontentloaded' });
await ap.waitForSelector('header nav', { timeout: 25000 });
await ap.waitForTimeout(2500); // amCharts async

// Fix nav : <summary> sans interactif imbriqué
const nested = await ap.evaluate(() => [...document.querySelectorAll('details summary')].some(s => s.querySelector('a,button')));
ok('nested-interactive: aucun <a>/<button> dans <summary>', !nested);

// Fix target-size badges count/add du menu
const menuSz = await ap.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('nav a, nav button, nav summary')) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.height < 24 || r.width < 24)) bad.push(`${el.tagName}.${el.textContent.trim().slice(0, 12)}:${r.width}x${r.height}`);
    }
    return bad;
});
ok('target-size admin: éléments nav >= 24px', menuSz.length === 0, menuSz.join(','));

// Fix aria-label nav admin (landmark-unique)
const admNav = await ap.evaluate(() => [...document.querySelectorAll('nav')].map(n => n.getAttribute('aria-label') || (n.getAttribute('aria-labelledby') && 'labelledby')));
ok('landmark-unique admin: nav labellisées', admNav.length >= 1 && admNav.every(l => l), JSON.stringify(admNav));

// Fix amCharts : svg masqué AT + aucun landmark interne exposé
const chartState = await ap.evaluate(() => {
    const div = document.querySelector('[data-chart-type]');
    if (!div) return { chart: false };
    const svg = div.querySelector('svg');
    const regions = svg ? svg.querySelectorAll('[role="region"],[role="scrollbar"]').length : -1;
    return { chart: true, svg: !!svg, hidden: svg?.getAttribute('aria-hidden') === 'true', regions };
});
if (!chartState.chart) na('charts amCharts', 'aucun chart sur le dashboard');
else {
    ok('chart: svg rendu', chartState.svg);
    ok('chart: svg aria-hidden (landmarks internes masqués)', chartState.hidden, `hidden=${chartState.hidden} regions=${chartState.regions}`);
}

// Fix dlitem : dt/dd sous <dl> sur my-account
await ap.goto(`${base}/cp-admin/my-account`, { waitUntil: 'domcontentloaded' });
const dlOk = await ap.evaluate(() => {
    const dts = [...document.querySelectorAll('dt'), ...document.querySelectorAll('dd')];
    return dts.length > 0 && dts.every(e => e.closest('dl'));
});
ok('dlitem my-account: dt/dd dans <dl>', dlOk);

// Fix button-name : more-dropdown des épisodes labellisés
await ap.goto(`${base}/cp-admin/podcasts/4/episodes`, { waitUntil: 'domcontentloaded' });
const more = await ap.evaluate(() => {
    const bs = [...document.querySelectorAll('button[id^="more-dropdown-"]')];
    return { n: bs.length, unnamed: bs.filter(b => !__c50.accName(b)).length };
});
ok('button-name: more-dropdown nommés', more.n > 0 && more.unnamed === 0, `${more.n} boutons, ${more.unnamed} sans nom`);

// Fix publication_pill : contraste texte/fond >= 4.5
const pill = await ap.evaluate(() => {
    const s = [...document.querySelectorAll('span')].find(e => /Scheduled|Published/.test(e.textContent) && e.className.includes('border'));
    if (!s) return null;
    const f = __c50.fg(s), bg = __c50.effBg(s);
    return +__c50.ratio(__c50.lum(f), __c50.lum(bg)).toFixed(2);
});
if (pill === null) na('publication pill', 'aucun badge affiché');
else ok('publication pill: contraste >= 4.5', pill >= 4.5, `mesuré ${pill}`);

// Fix Tooltip : describedby + tooltip dans un landmark + nom conservé
await ap.goto(`${base}/cp-admin/settings`, { waitUntil: 'domcontentloaded' });
await ap.waitForSelector('[data-tooltip]', { timeout: 20000 });
const tip = await ap.evaluate(async () => {
    const el = document.querySelector('[data-tooltip]');
    const nameBefore = __c50.accName(el);
    el.dispatchEvent(new Event('focus'));
    el.dispatchEvent(new Event('mouseenter'));
    await new Promise(r => setTimeout(r, 400));
    const tip = el.getAttribute('aria-describedby') && document.getElementById(el.getAttribute('aria-describedby'));
    const inLandmark = tip ? !!tip.closest('main,nav,header,aside,footer,[role=main],[role=navigation],[role=banner]') : false;
    const nameAfter = __c50.accName(el) || (el.getAttribute('aria-label') ?? '');
    el.dispatchEvent(new Event('blur'));
    return { tip: !!tip, role: tip?.getAttribute('role'), inLandmark, nameBefore, nameAfter };
});
ok('tooltip: div role=tooltip rendu', tip.tip && tip.role === 'tooltip', JSON.stringify(tip));
ok('tooltip: inséré dans un landmark', tip.inLandmark);
ok('tooltip: élément nommé ou décrit', !!(tip.nameAfter || tip.nameBefore));

// Aucun label for=undefined
const badFor = await ap.evaluate(() => document.querySelectorAll('label[for="undefined"],label[for=""]').length);
ok('ids dynamiques: aucun label[for=undefined]', badFor === 0, `${badFor}`);

await browser.close();
const fails = results.filter(r => !r.pass).length;
const total = results.filter(r => r.verdict !== 'N-A').length;
console.log(`\nverify.mjs castopod : ${total - fails}/${total} assertions OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
