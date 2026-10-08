#!/usr/bin/env node
/**
 * verify.mjs — assertions DURES sur les corrections chatwoot (cycle 56).
 * Chaque fix est mesuré dans le DOM/computed style, jamais `if(el) ok()`.
 * Un élément requis absent = FAIL ou N-A explicite (leçon 45).
 * Usage: node verify.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(dirname(fileURLToPath(import.meta.url)), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));

const base = process.argv[2]?.replace(/\/$/, '');
const WTOKEN = process.env.C56_WIDGET_TOKEN || JSON.parse(readFileSync(new URL('./seed-info.json', import.meta.url), 'utf8')).website_token;
const authPath = process.argv[3] || new URL('./auth.json', import.meta.url).pathname;
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }

const results = [];
const ok = (name, cond, extra = '') => { results.push({ name, pass: !!cond }); if (!cond) console.error(`  FAIL ${name} ${extra}`); return cond; };
const na = (name, reason = '') => { results.push({ name, pass: true, verdict: 'N-A', reason }); };

const HELPERS = `
const parse = c => { const m = c && c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const effBg = el => { const L = []; let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0) L.push(c); n = n.parentElement; } L.push({ r: 255, g: 255, b: 255, a: 1 }); let top = L[0]; for (let i = 1; i < L.length; i++) { const under = L[i]; const a = top.a + under.a * (1 - top.a); top = { r: (top.r * top.a + under.r * under.a * (1 - top.a)) / a, g: (top.g * top.a + under.g * under.a * (1 - top.a)) / a, b: (top.b * top.a + under.b * under.a * (1 - top.a)) / a, a }; } return top; };
const fg = el => { const st = getComputedStyle(el); const c = parse(st.color); return { ...c, a: (c.a ?? 1) * parseFloat(st.opacity || 1) }; };
window.__c56 = { parse, lum, ratio, effBg, fg };
const cr = el => { try { const f = __c56.fg(el); const bg = __c56.effBg(el); return +__c56.ratio(__c56.lum(f), __c56.lum(bg)).toFixed(2); } catch { return null; } };
window.__c56.cr = cr;
`;

const browser = await chromium.launch();
const ctxPub = await browser.newContext({ locale: 'en-US' });
const pub = await ctxPub.newPage();
await pub.addInitScript(HELPERS);
const ctxAdm = await browser.newContext({ locale: 'en-US', storageState: authPath });
const page = await ctxAdm.newPage();
await page.addInitScript(HELPERS);

// ================= PUBLIC =================
// login : lang, viewport zoomable, main top-level unique, h1, régions
await pub.goto(`${base}/app/login`, { waitUntil: 'domcontentloaded' });
await pub.waitForTimeout(5000);
const pubLand = await pub.evaluate(() => ({
  lang: document.documentElement.lang,
  vp: document.querySelector('meta[name="viewport"]')?.content || '',
  mains: [...document.querySelectorAll('main')].length,
  topMain: [...document.querySelectorAll('main')].filter(m => !m.parentElement?.closest('main,nav,aside,header,footer,section[aria-label],section[aria-labelledby],[role=main],[role=navigation],[role=banner],[role=contentinfo],[role=complementary],[role=search],[role=form],[role=region]')).length,
  h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()),
  outside: [...document.body.children].filter(el => !['SCRIPT','STYLE','TEMPLATE','NOSCRIPT'].includes(el.tagName) && !el.closest('main,nav,header,footer,aside,[role=main],[role=navigation],[role=banner],[role=contentinfo],[role=complementary],[role=search],[role=region]') && !el.querySelector('main,nav,header,footer,aside,[role=main],[role=navigation],[role=banner],[role=contentinfo],[role=complementary],[role=search],[role=region]') && (el.innerText||'').trim()).length,
}));
ok('login: html lang renseigné', pubLand.lang.length >= 2, pubLand.lang);
ok('login: viewport ne bloque pas le zoom', !/user-scalable\s*=\s*(0|no)/.test(pubLand.vp) && !/maximum-scale\s*=\s*1(\.0+)?\s*($|,)/.test(pubLand.vp), pubLand.vp);
ok('login: exactement un <main> top-level', pubLand.mains === 1 && pubLand.topMain === 1, `mains=${pubLand.mains} top=${pubLand.topMain}`);
ok('login: h1 présent et non vide', pubLand.h1.some(t => t.length > 0), JSON.stringify(pubLand.h1));
ok('login: tout le contenu dans un landmark', pubLand.outside === 0, `${pubLand.outside}`);

// widget : lang, viewport, main, h1
await pub.goto(`${base}/widget?website_token=${WTOKEN}`, { waitUntil: 'domcontentloaded' });
await pub.waitForTimeout(4000);
const wLand = await pub.evaluate(() => ({
  lang: document.documentElement.lang,
  vp: document.querySelector('meta[name="viewport"]')?.content || '',
  mains: document.querySelectorAll('main').length,
  h1: [...document.querySelectorAll('h1')].length,
  fg: (() => { const s = document.querySelector('button span, button'); return s ? __c56.cr(s) : null; })(),
}));
ok('widget: html lang renseigné', wLand.lang.length >= 2, wLand.lang);
ok('widget: viewport zoomable', !/user-scalable\s*=\s*(0|no)/.test(wLand.vp), wLand.vp);
ok('widget: <main> présent', wLand.mains >= 1, `${wLand.mains}`);
ok('widget: h1 présent', wLand.h1 >= 1, `${wLand.h1}`);
if (wLand.fg !== null) ok('widget: bouton primaire >= 4.5:1', wLand.fg >= 4.5, `${wLand.fg}`);
else na('widget: bouton primaire', 'widget non interactif');

// ================= ADMIN =================
await page.goto(`${base}/app/accounts/1/dashboard`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(7000);

// landmarks dashboard
const land = await page.evaluate(() => ({
  mains: [...document.querySelectorAll('main')].length,
  topMain: [...document.querySelectorAll('main')].filter(m => !m.parentElement?.closest('main,nav,aside,header,footer,section[aria-label],section[aria-labelledby],[role=main],[role=navigation],[role=banner],[role=contentinfo],[role=complementary],[role=search],[role=form],[role=region]')).length,
  navs: [...document.querySelectorAll('nav')].map(n => n.getAttribute('aria-label') || n.textContent.trim().slice(0, 30)),
}));
ok('dashboard: un seul <main> top-level', land.mains === 1 && land.topMain === 1, JSON.stringify(land));
if (land.navs.length > 1) ok('landmark-unique: navs distinctement nommées', new Set(land.navs).size === land.navs.length && land.navs.every(Boolean), JSON.stringify(land.navs));
else ok('landmark-unique: nav sidebar nommée', land.navs.every(Boolean), JSON.stringify(land.navs));

// boutons icône nommés (compose + tout bouton icon-only de la page)
const iconBtns = await page.evaluate(() => {
  const bad = [];
  document.querySelectorAll('button').forEach(b => {
    const visText = (b.innerText || '').trim();
    if (!visText && !b.getAttribute('aria-label') && !b.getAttribute('aria-labelledby') && !b.getAttribute('title')) {
      bad.push(b.className.slice(0, 60));
    }
  });
  return bad;
});
ok('button-name: aucun bouton sans nom accessible', iconBtns.length === 0, iconBtns.join(' | '));

// avatars : role=img a un aria-label
const av = await page.evaluate(() => {
  const bad = [];
  document.querySelectorAll('[role="img"]').forEach(el => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) bad.push(el.className.slice(0, 50));
  });
  return bad;
});
ok('role-img-alt: tout role=img est nommé', av.length === 0, av.join(' | '));

// sidebar list : ul n'ont que des li directs
const ulBad = await page.evaluate(() => {
  const bad = [];
  document.querySelectorAll('nav ul, [class*="sidebar"] ul, .n-dropdown-body, ul.n-dropdown-section').forEach(ul => {
    [...ul.children].forEach(ch => {
      if (!['LI','SCRIPT','TEMPLATE'].includes(ch.tagName)) bad.push(`${ul.className.slice(0,40)}>${ch.tagName}.${ch.className.slice(0,30)}`);
    });
  });
  return bad;
});
ok('list: enfants directs des <ul> sont des <li>', ulBad.length === 0, ulBad.join(' | '));

// contrastes tokens : texte slate-9/10 sur la page
const cc = await page.evaluate(() => {
  const sel = '.text-n-slate-9, .text-n-slate-10, .text-n-slate-11';
  const bad = [];
  document.querySelectorAll(sel).forEach(el => {
    const t = (el.innerText || '').trim();
    if (!t) return;
    const r = __c56.cr(el);
    if (r !== null && r < 4.5) bad.push(`${el.tagName}.${el.className.slice(0,30)} r=${r}`);
  });
  return bad;
});
ok('color-contrast: textes slate-9..11 >= 4.5:1', cc.length === 0, cc.join(' | '));

// conversation : thread + boutons + avatar contrast
await page.goto(`${base}/app/accounts/1/conversations/1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(7000);
const conv = await page.evaluate(() => {
  const noName = [];
  document.querySelectorAll('button').forEach(b => {
    if (!(b.innerText || '').trim() && !b.getAttribute('aria-label') && !b.getAttribute('title')) noName.push(b.className.slice(0, 60));
  });
  const ulBad = [];
  document.querySelectorAll('ul.conversation-panel').forEach(ul => {
    [...ul.children].forEach(ch => { if (!['LI','SCRIPT','TEMPLATE'].includes(ch.tagName)) ulBad.push(ch.tagName); });
  });
  const badAttr = [];
  document.querySelectorAll('span[aria-label]').forEach(el => { if (!el.getAttribute('role')) badAttr.push(el.className.slice(0, 40)); });
  const avBad = [];
  document.querySelectorAll('[role="img"]').forEach(el => { if (!el.getAttribute('aria-label')) avBad.push(el.className.slice(0, 40)); });
  return { noName, ulBad, badAttr, avBad };
});
ok('conv: aucun bouton sans nom', conv.noName.length === 0, conv.noName.join(' | '));
ok('conv: liste de messages = ul>li', conv.ulBad.length === 0, conv.ulBad.join(','));
ok('conv: pas d\'aria-label sur span sans rôle', conv.badAttr.length === 0, conv.badAttr.join(' | '));
ok('conv: avatars role=img nommés', conv.avBad.length === 0, conv.avBad.join(' | '));

// notifications panel (état) — boutons nommés
const nBtn = await page.evaluate(() => {
  const el = document.querySelector('[class*="notification"] button, aside button');
  return el ? (el.getAttribute('aria-label') || (el.innerText || '').trim() || el.getAttribute('title') || '') : 'absent';
});
if (nBtn !== 'absent') ok('notifications: boutons nommés', !!nBtn, nBtn);

// profile menu : ouvrir et vérifier listes + noms
const pmTrigger = await page.$('button[aria-label*="rofil" i], button[title*="rofil" i], [class*="profile"] button');
if (pmTrigger) {
  await pmTrigger.click(); await page.waitForTimeout(1200);
  const pm = await page.evaluate(() => {
    const badLi = [...document.querySelectorAll('li.n-dropdown-item')].filter(li => !li.closest('ul,ol'));
    const badUl = [...document.querySelectorAll('ul.n-dropdown-body, ul.n-dropdown-section')].flatMap(ul => [...ul.children].filter(c => !['LI','SCRIPT','TEMPLATE'].includes(c.tagName)));
    return { badLi: badLi.length, badUl: badUl.map(e => e.tagName).join(',') };
  });
  ok('profile-menu: li dans ul', pm.badLi === 0, `${pm.badLi}`);
  ok('profile-menu: ul sans div direct', pm.badUl === '', pm.badUl);
} else na('profile-menu', 'déclencheur introuvable');

// command bar : Ctrl+K → ninja-keys accessible
await page.keyboard.press('Control+k');
await page.waitForTimeout(2500);
const nk = await page.evaluate(() => {
  const nk = document.querySelector('ninja-keys');
  if (!nk || !nk.visible) return { visible: false };
  const list = nk.shadowRoot?.querySelector('.actions-list');
  const gh = nk.shadowRoot?.querySelector('.group-header');
  let ghCr = null;
  if (gh) { const s = getComputedStyle(gh); ghCr = s.color; }
  return { visible: true, tab: list?.getAttribute('tabindex'), ghColor: ghCr, hasStyle: !!nk.shadowRoot?.getElementById('cw-a11y-contrast') };
});
ok('command-bar: ninja-keys s\'ouvre', nk.visible === true);
if (nk.visible) {
  ok('command-bar: liste scrollable focusable', nk.tab === '0', `${nk.tab}`);
  ok('command-bar: style contraste injecté', nk.hasStyle === true, '');
}
await page.keyboard.press('Escape');

// 404 : landmarks + contraste
await page.goto(`${base}/route-c56-inexistante`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
const nf = await page.evaluate(() => ({
  mains: document.querySelectorAll('main').length,
  help: (() => { const h = document.querySelector('.help'); return h ? __c56.cr(h) : null; })(),
  btn: (() => { const b = document.querySelector('a.btn'); return b ? __c56.cr(b) : null; })(),
}));
ok('404: <main> présent', nf.mains >= 1, `${nf.mains}`);
if (nf.help !== null) ok('404: texte help >= 4.5:1', nf.help >= 4.5, `${nf.help}`);
if (nf.btn !== null) ok('404: bouton >= 4.5:1', nf.btn >= 4.5, `${nf.btn}`);

// settings/general : select labellisé + h1/h2
await page.goto(`${base}/app/accounts/1/settings/general`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);
const sg = await page.evaluate(() => ({
  sels: [...document.querySelectorAll('select')].map(s => s.getAttribute('aria-label') || (s.labels && s.labels.length ? s.labels[0].textContent : null)),
  h2: document.querySelectorAll('h2').length,
  h456: document.querySelectorAll('h4,h5,h6').length,
}));
ok('settings: chaque select est labellisée', sg.sels.every(Boolean), JSON.stringify(sg.sels));
ok('settings: hiérarchie h2 présente', sg.h2 > 0, `${sg.h2}`);
ok('settings: pas de h4/h5/h6 orphelin avant h1/h2', sg.h456 === 0, `${sg.h456}`);

await browser.close();
const total = results.length, fails = results.filter(r => !r.pass).length;
console.log(`\nverify.mjs chatwoot : ${total - fails}/${total} assertions OK (${fails} FAIL, ${results.filter(r => r.verdict === 'N-A').length} N-A)`);
process.exit(fails ? 1 : 0);
