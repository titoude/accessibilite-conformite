#!/usr/bin/env node
/**
 * verify.mjs — assertions DURES sur les corrections SuiteCRM-Core 8.9.3 (cycle 58).
 * Chaque fix est mesuré dans le DOM/computed style, jamais `if(el) ok()`.
 * Un élément requis absent = FAIL ou N-A explicite (leçons 5/45).
 * Usage: node verify.mjs <baseUrl> [auth.json]
 *   baseUrl ex: http://localhost:9950
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(HERE, 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2]?.replace(/\/$/, '');
const authPath = process.argv[3] || resolve(HERE, 'auth.json');
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }

let SEED = {};
try { SEED = JSON.parse(readFileSync(new URL('./seed-info.json', import.meta.url), 'utf8')); } catch { /* non résolu */ }
const ACC = SEED.account_id || '58acc001-0000-4000-8000-000000000001';
const CON = SEED.contact_id || '58con001-0000-4000-8000-000000000001';

const results = [];
const ok = (name, cond, extra = '') => { results.push({ name, pass: !!cond }); if (!cond) console.error(`  FAIL ${name} ${extra}`); return cond; };
const na = (name, reason = '') => { results.push({ name, pass: true, verdict: 'N-A', reason }); console.error(`  N-A ${name} ${reason}`); };

const HELPERS = `
const parse = c => { const m = c && c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const effBg = el => { const L = []; let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0) L.push(c); n = n.parentElement; } if (!L.length) return { r: 255, g: 255, b: 255 }; let top = L[0]; for (let i = 1; i < L.length; i++) { const under = L[i]; const a = top.a + under.a * (1 - top.a); top = { r: (top.r * top.a + under.r * under.a * (1 - top.a)) / a, g: (top.g * top.a + under.g * under.a * (1 - top.a)) / a, b: (top.b * top.a + under.b * under.a * (1 - top.a)) / a, a }; } return top; };
const fg = el => { const st = getComputedStyle(el); const c = parse(st.color); return { ...c, a: (c.a ?? 1) * parseFloat(st.opacity || 1) }; };
const cr = el => { try { const f = __c58.fg(el); const bg = __c58.effBg(el); return +__c58.ratio(__c58.lum(f), __c58.lum(bg)).toFixed(2); } catch { return null; } };
const headingOrder = () => { const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.offsetParent !== null || h.closest('body')); const bad = []; let prev = 0; for (const h of hs) { const l = +h.tagName[1]; if (prev && l > prev + 1) bad.push(l + ' après ' + prev + ' :' + (h.innerText || '').trim().slice(0, 30)); prev = Math.max(prev, l); } return bad; };
const accName = el => {
  const al = el.getAttribute('aria-label');
  if (al && al.trim()) return al.trim();
  const lb = el.getAttribute('aria-labelledby');
  if (lb) { const t = lb.split(/\\s+/).map(id => (document.getElementById(id)?.innerText || '').trim()).join(' ').trim(); if (t) return t; }
  const id = el.id; if (id) { const l = document.querySelector('label[for="' + CSS.escape(id) + '"]'); if (l && (l.innerText || '').trim()) return l.innerText.trim(); }
  if (el.closest('label')) { const t = el.closest('label').innerText.trim(); if (t) return t; }
  const ti = el.getAttribute('title'); if (ti && ti.trim()) return ti.trim();
  return (el.innerText || '').trim();
};
window.__c58 = { parse, lum, ratio, effBg, fg, cr, headingOrder, accName };
`;

const browser = await chromium.launch();
const pub = await (await browser.newContext({ locale: 'en-US' })).newPage();
await pub.addInitScript(HELPERS);
const ctx = await browser.newContext({ locale: 'en-US', storageState: authPath });
const page = await ctx.newPage();
await page.addInitScript(HELPERS);

const gotoHash = async (pg, hash, sel, timeout = 60000) => {
  await pg.goto(`${base}/${hash}`, { waitUntil: 'domcontentloaded' });
  let found = true;
  if (sel) { try { await pg.waitForSelector(sel, { timeout }); } catch { found = false; } }
  await pg.waitForTimeout(1500);
  return found;
};

// ================= PUBLIC (Login) =================
await gotoHash(pub, '#/Login', 'input[type="password"], .login-form, form');
await pub.waitForTimeout(1500);

const langT = await pub.evaluate(() => ({ lang: document.documentElement.lang, t: document.title }));
ok('public: html lang renseigné', !!langT.lang, langT.lang || 'vide');
ok('public: document.title non vide', langT.t.trim().length > 0, JSON.stringify(langT.t));

// main landmark + h1 (landmark-one-main + page-has-heading-one corrigés via app.component)
const lm = await pub.evaluate(() => ({
  mains: [...document.querySelectorAll('main, [role="main"]')].length,
  h1: [...document.querySelectorAll('h1')].filter(h => (h.innerText || '').trim() !== '').length,
  footer: !!document.querySelector('footer, [role="contentinfo"]'),
}));
ok('public: exactement 1 landmark main', lm.mains === 1, `${lm.mains}`);
ok('public: h1 non vide présent', lm.h1 >= 1, `${lm.h1}`);
ok('public: footer/contentinfo présent', lm.footer);

// login inputs nommés
const lab = await pub.evaluate(() => {
  const bad = [];
  for (const inp of document.querySelectorAll('form input, input[type="password"], input[type="text"]')) {
    if (!__c58.accName(inp)) bad.push(`input sans nom: ${inp.id || inp.name || inp.type}`);
  }
  for (const l of document.querySelectorAll('label[for]')) {
    if (!document.getElementById(l.getAttribute('for'))) bad.push(`label[for=${l.getAttribute('for')}] sans cible`);
  }
  return bad;
});
ok('public: chaque input de login nommé', lab.length === 0, lab.join(';'));

// aria-prohibited-attr : le bouton de fermeture du message d'erreur porte role=button, pas type sur <a>
await gotoHash(pub, '#/Login', 'input[name="username"]');
await pub.fill('input[name="username"]', 'sc58-probe');
await pub.fill('input[name="password"]', 'sc58-wrong-pass');
await pub.click('button:has-text("Log In")');
let alertSeen = true;
try {
  await pub.waitForFunction(() =>
    [...document.querySelectorAll('[role="alert"], .alert')].some(e =>
      e.offsetParent !== null && /incorrect|invalid/i.test(e.innerText)),
  { timeout: 20000 });
} catch { alertSeen = false; }
if (!alertSeen) na('message close role=button', 'alerte login non rendue');
else {
  const msgClose = await pub.evaluate(() => {
    const a = document.querySelector('[role="alert"] a[role="button"], [role="alert"] a.close, .alert a[role="button"], scrm-message [role="button"], [role="alert"] a');
    if (!a) return { found: false };
    return { found: true, role: a.getAttribute('role'), typeAttr: a.getAttribute('type'), tag: a.tagName };
  });
  if (!msgClose.found) na('message close role=button', 'alerte sans contrôle de fermeture');
  else ok('message close: role=button, pas de type sur <a>', (msgClose.role === 'button' && msgClose.tag === 'A' && msgClose.typeAttr === null) || msgClose.tag === 'BUTTON', JSON.stringify(msgClose));
}

// heading-order public
const hd0 = await pub.evaluate(() => __c58.headingOrder());
ok('public: aucun saut de niveau de heading', hd0.length === 0, hd0.join(';'));

// ================= AUTH =================
await gotoHash(page, '#/home', 'main, .main-content, scrm-navbar, nav', 40000);
await page.waitForTimeout(2000);

const lmA = await page.evaluate(() => ({
  mains: [...document.querySelectorAll('main, [role="main"]')].length,
  h1: [...document.querySelectorAll('h1')].filter(h => (h.innerText || '').trim() !== '').length,
  footer: !!document.querySelector('footer, [role="contentinfo"]'),
}));
ok('auth /home: exactement 1 landmark main', lmA.mains === 1, `${lmA.mains}`);
ok('auth /home: h1 non vide présent', lmA.h1 >= 1, `${lmA.h1}`);
ok('auth /home: footer/contentinfo', lmA.footer);

// iframe title (classic view sur /home)
const ifr = await page.evaluate(() => [...document.querySelectorAll('iframe')].map(f => ({ t: f.getAttribute('title'), src: (f.getAttribute('src') || '').slice(0, 50) })));
if (!ifr.length) na('iframe title', 'aucun iframe rendu sur /home');
else ok('iframe: chaque iframe a un title', ifr.every(f => f.t && f.t.trim() !== ''), JSON.stringify(ifr));

// navbar : boutons iconiques nommés
const navBtns = await page.evaluate(() => {
  const bad = [];
  for (const b of document.querySelectorAll('nav button, .navbar-toggler, [ngbDropdownToggle]')) {
    if (!__c58.accName(b)) bad.push(`${b.tagName}.${(b.className || '').toString().slice(0, 45)}`);
  }
  return bad;
});
ok('navbar: chaque bouton/toggler a un nom accessible', navBtns.length === 0, navBtns.slice(0, 4).join(';'));

// liaisons aria résolvent (leçon 42)
const links = await page.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll('[aria-labelledby],[aria-controls],[aria-activedescendant],[aria-describedby]')) {
    for (const attr of ['aria-labelledby', 'aria-controls', 'aria-activedescendant', 'aria-describedby']) {
      const v = el.getAttribute(attr); if (!v) continue;
      for (const tok of v.split(/\s+/)) if (tok && !document.getElementById(tok)) bad.push(`${attr}=${tok}`);
    }
  }
  return bad;
});
ok('/home: toutes liaisons aria-* résolvent', links.length === 0, links.slice(0, 3).join(';'));

// duplicate ids RÉFÉRENCÉS (aria-*/label[for]) — sémantique duplicate-id-aria
const dup = await page.evaluate(() => {
  const refs = new Set();
  for (const el of document.querySelectorAll('[aria-labelledby],[aria-controls],[aria-describedby],[aria-activedescendant],label[for]')) {
    const v = el.getAttribute('aria-labelledby') || el.getAttribute('aria-controls') || el.getAttribute('aria-describedby') || el.getAttribute('aria-activedescendant') || el.getAttribute('for') || '';
    for (const t of v.split(/\s+/)) if (t) refs.add(t);
  }
  const bad = [];
  for (const id of refs) { if (document.querySelectorAll(`[id="${CSS.escape(id)}"]`).length > 1) bad.push(id); }
  return bad;
});
ok('/home: aucun id référencé dupliqué', dup.length === 0, dup.slice(0, 5).join(';'));

// ============ LIST VIEW /accounts/index ============
const listOk = await gotoHash(page, '#/accounts/index', 'cdk-table, scrm-table, .list-view', 90000);
if (!listOk) ok('list /accounts/index: table rendue', false, 'cdk-table absent après 90s');
await page.waitForTimeout(2500);

// th : aucun vide
const ths = await page.evaluate(() => [...document.querySelectorAll('th')].filter(t => !(t.innerText || '').trim()).length);
ok('list: aucun <th> vide', ths === 0, `${ths}`);

// aria-allowed-attr / aria-prohibited-attr résiduels : aria-label n'est posé sur un th que si nécessaire — ici vérif structurelle
// bulk menu : pas d'input interactif niché dans le bouton + bouton nommé
const bulk = await page.evaluate(() => {
  const btn = document.querySelector('button.bulk-action-button');
  if (!btn) return { found: false };
  const nested = !!btn.querySelector('input, select, button');
  const chk = document.querySelector('label.checkbox-container input[type="checkbox"]');
  return { found: true, nested, name: __c58.accName(btn), chkLabel: chk ? __c58.accName(chk) : null, inBtn: chk ? !!btn.contains(chk) : null };
});
if (!bulk.found) na('bulk menu', 'bouton bulk absent');
else {
  ok('bulk: aucun interactif niché dans le bouton', !bulk.nested && bulk.inBtn === false, JSON.stringify(bulk));
  ok('bulk: bouton nommé', bulk.name.length > 0, bulk.name);
  ok('bulk: checkbox select-all nommée', !!bulk.chkLabel, JSON.stringify(bulk.chkLabel));
}

// 2.5.3 : le nom accessible du bouton bulk contient le texte visible
const mm = await page.evaluate(() => {
  const btn = document.querySelector('button.bulk-action-button');
  if (!btn) return null;
  const vis = (btn.innerText || '').trim();
  const name = __c58.accName(btn);
  return { vis, name, okc: !vis || name.toLowerCase().includes(vis.toLowerCase()) };
});
if (mm) ok('2.5.3 bulk: aria-label contient le texte visible', mm.okc, JSON.stringify(mm));

// contrastes mesurés : lien de nom d'enregistrement dans la liste + nav active
const contrast = await page.evaluate(() => {
  const out = {};
  const nameCell = document.querySelector('td.column-type-name scrm-varchar-detail a, .list-view a[href*="record"], td a[href*="/record/"]');
  if (nameCell) out.nameLink = __c58.cr(nameCell);
  const active = document.querySelector('.navbar-nav .active a, .nav-item.active a, scrm-menu-item .active');
  if (active) out.navActive = __c58.cr(active);
  const muted = document.querySelector('.text-muted, .small.text-muted');
  if (muted) out.muted = __c58.cr(muted);
  return out;
});
for (const [k, v] of Object.entries(contrast)) {
  ok(`contraste ${k} ≥ 4.5`, v !== null && v >= 4.5, `${k}=${v}`);
}
if (!('nameLink' in contrast)) na('contraste nameLink', 'cellule nom absente');

// aria-hidden-focus : aucun focusable sous aria-hidden
const ahf = await page.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll('[aria-hidden="true"]')) {
    for (const f of el.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')) {
      bad.push(`${f.tagName} sous aria-hidden (${(el.className || '').toString().slice(0, 40)})`);
    }
  }
  return bad;
});
ok('list: aucun focusable sous aria-hidden=true', ahf.length === 0, ahf.slice(0, 3).join(';'));

// ============ RECORD VIEW ============
await gotoHash(page, `#/accounts/record/${ACC}`, 'scrm-record, .record-view, main', 45000);
await page.waitForTimeout(2500);

const links2 = await page.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll('[aria-labelledby],[aria-controls],[aria-activedescendant],[aria-describedby]')) {
    for (const attr of ['aria-labelledby', 'aria-controls', 'aria-activedescendant', 'aria-describedby']) {
      const v = el.getAttribute(attr); if (!v) continue;
      for (const tok of v.split(/\s+/)) if (tok && !document.getElementById(tok)) bad.push(`${attr}=${tok}`);
    }
  }
  return bad;
});
ok('record: toutes liaisons aria-* résolvent', links2.length === 0, links2.slice(0, 3).join(';'));

// liens sans nom exploitable (link-name)
const badLinks = await page.evaluate(() => {
  const bad = [];
  for (const a of document.querySelectorAll('a[href]')) {
    const st = getComputedStyle(a);
    if (st.display === 'none' || st.visibility === 'hidden') continue;
    if (!__c58.accName(a)) bad.push(`${a.getAttribute('href')?.slice(0, 45)}`);
  }
  return bad;
});
ok('record: aucun lien sans nom', badLinks.length === 0, badLinks.slice(0, 4).join(';'));

// heading-order record
const hd1 = await page.evaluate(() => __c58.headingOrder());
ok('record: aucun saut de niveau de heading', hd1.length === 0, hd1.join(';'));

// ============ EDIT VIEW (inputs labellisés) ============
await gotoHash(page, '#/contacts/edit?return_module=Contacts&return_action=DetailView', 'form, input, scrm-field', 45000);
await page.waitForTimeout(2500);
const editLab = await page.evaluate(() => {
  const bad = [];
  for (const inp of document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea')) {
    const st = getComputedStyle(inp);
    if (st.display === 'none' || st.visibility === 'hidden' || inp.offsetParent === null) continue;
    if (!__c58.accName(inp)) bad.push(`${inp.tagName}.${(inp.className || '').toString().slice(0, 35)} name=${inp.name || inp.id || '?'}`);
  }
  return bad;
});
ok('edit: chaque champ visible nommé', editLab.length === 0, editLab.slice(0, 5).join(';'));

// boutons iconiques de l'edit (relate select, date open) nommés
const editBtns = await page.evaluate(() => {
  const bad = [];
  for (const b of document.querySelectorAll('button')) {
    const st = getComputedStyle(b);
    if (st.display === 'none' || b.offsetParent === null) continue;
    if (!__c58.accName(b)) bad.push(`btn ${(b.className || '').toString().slice(0, 45)}`);
  }
  return bad;
});
ok('edit: aucun bouton visible sans nom', editBtns.length === 0, editBtns.slice(0, 5).join(';'));

// ============ ADMINISTRATION (heading-order h1->h2, listitem) ============
await gotoHash(page, '#/administration/index', 'scrm-admin, main, .card, admin', 45000);
await page.waitForTimeout(2500);
const hdA = await page.evaluate(() => __c58.headingOrder());
ok('admin: aucun saut de niveau de heading', hdA.length === 0, hdA.join(';'));
const orphanLi = await page.evaluate(() => {
  const bad = [];
  for (const li of document.querySelectorAll('li')) {
    let n = li.parentElement, listy = false, hop = 0;
    while (n && n !== document.body && hop++ < 8) {
      if (/^(UL|OL|MENU)$/i.test(n.tagName) || n.getAttribute('role') === 'list') { listy = true; break; }
      if (/^(SPAN|DIV|A)$/i.test(n.tagName) && n.parentElement && !/^(UL|OL|MENU|LI)$/i.test(n.parentElement.tagName)) break;
      n = n.parentElement;
    }
    if (!listy) bad.push(`li orphelin: .${(li.className || '').toString().slice(0, 40)} sous ${li.parentElement ? li.parentElement.tagName : '?'}`);
  }
  return bad;
});
ok('admin: aucun <li> orphelin', orphanLi.length === 0, orphanLi.slice(0, 4).join(';'));

// ============ MOBILE 390 ============
await page.setViewportSize({ width: 390, height: 800 });
await gotoHash(page, '#/home', 'button.navbar-toggler, nav', 40000);
await page.waitForTimeout(2000);
const mob = await page.evaluate(() => {
  const togglers = [...document.querySelectorAll('button.navbar-toggler')].filter(b => b.offsetParent !== null);
  const navs = [...document.querySelectorAll('nav')].filter(n => n.offsetParent !== null);
  return {
    togglers: togglers.map(t => __c58.accName(t)),
    navs: navs.length,
    mains: [...document.querySelectorAll('main,[role="main"]')].filter(m => m.offsetParent !== null).length,
  };
});
ok('mobile 390: chaque toggler visible nommé', mob.togglers.length > 0 && mob.togglers.every(n => n && n.length > 0), JSON.stringify(mob.togglers));
ok('mobile 390: landmark main unique visible', mob.mains === 1, `${mob.mains}`);
await page.setViewportSize({ width: 1280, height: 900 });

await browser.close();
const fails = results.filter(r => !r.pass).length;
const nas = results.filter(r => r.verdict === 'N-A').length;
console.log(`\nverify.mjs (suitecrm) : ${results.length - fails - nas}/${results.length - nas} OK (${fails} FAIL, ${nas} N-A)`);
if (fails) { console.log('FAILS:', results.filter(r => !r.pass).map(r => r.name).join(' | ')); }
process.exit(fails ? 1 : 0);
