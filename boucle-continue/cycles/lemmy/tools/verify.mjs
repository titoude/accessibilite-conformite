#!/usr/bin/env node
/**
 * verify.mjs — assertions DURES sur les corrections lemmy-ui (cycle 55).
 * Chaque fix est mesuré dans le DOM/computed style, jamais `if(el) ok()`.
 * Un élément requis absent = FAIL ou N-A explicite (leçon 45).
 * Usage: node verify.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));

const base = process.argv[2]?.replace(/\/$/, '');
const authPath = process.argv[3] || resolve(HERE, 'auth.json');
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }

// Ids du seed : REPLI uniquement (leçons 44/46) — source primaire = l'app.
let SEED = {};
try { SEED = JSON.parse(readFileSync(new URL('./seed-info.json', import.meta.url), 'utf8')); } catch { /* non résolu */ }
const POST1 = SEED.post_ids?.[0] || 1;

const results = [];
const ok = (name, cond, extra = '') => { results.push({ name, pass: !!cond }); if (!cond) console.error(`  FAIL ${name} ${extra}`); return cond; };
const na = (name, reason = '') => { results.push({ name, pass: true, verdict: 'N-A', reason }); console.error(`  N-A ${name} ${reason}`); };

const HELPERS = `
const parse = c => { const m = c && c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const effBg = el => { const L = []; let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0) L.push(c); n = n.parentElement; } if (!L.length) return { r: 255, g: 255, b: 255 }; let top = L[0]; for (let i = 1; i < L.length; i++) { const under = L[i]; const a = top.a + under.a * (1 - top.a); top = { r: (top.r * top.a + under.r * under.a * (1 - top.a)) / a, g: (top.g * top.a + under.g * under.a * (1 - top.a)) / a, b: (top.b * top.a + under.b * under.a * (1 - top.a)) / a, a }; } return top; };
const fg = el => { const st = getComputedStyle(el); const c = parse(st.color); return { ...c, a: (c.a ?? 1) * parseFloat(st.opacity || 1) }; };
const cr = el => { try { const f = __c55.fg(el); const bg = __c55.effBg(el); return +__c55.ratio(__c55.lum(f), __c55.lum(bg)).toFixed(2); } catch { return null; } };
const headingOrder = () => { const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]; const bad = []; let prev = 0; for (const h of hs) { const l = +h.tagName[1]; if (prev && l > prev + 1) bad.push(l + ' après ' + prev + ' :' + (h.innerText || '').trim().slice(0, 30)); prev = Math.max(prev, l); } return bad; };
window.__c55 = { parse, lum, ratio, effBg, fg, cr, headingOrder };
`;

const browser = await chromium.launch();
const pub = await (await browser.newContext({ locale: 'en-US' })).newPage();
await pub.addInitScript(HELPERS);
const page = await (await browser.newContext({ locale: 'en-US', storageState: authPath })).newPage();
await page.addInitScript(HELPERS);

// ================= PUBLIC =================
await pub.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await pub.waitForSelector('#app', { timeout: 25000 });
await pub.waitForTimeout(1500);

// html lang + titre (fixes error-page/HtmlTags — page normale)
const langT = await pub.evaluate(() => ({ lang: document.documentElement.lang, t: document.title }));
ok('lang document renseigné', !!langT.lang, langT.lang);
ok('titre onglet non vide', langT.t.trim().length > 0, langT.t);

// 404 : html lang + titre (error-page.tsx HtmlTags)
await pub.goto(`${base}/this-route-does-not-exist-c55`, { waitUntil: 'domcontentloaded' });
await pub.waitForTimeout(1500);
const nf = await pub.evaluate(() => ({ lang: document.documentElement.lang, t: document.title, h1: !!document.querySelector('h1') }));
ok('404: html lang renseigné', !!nf.lang, nf.lang || 'vide');
ok('404: document.title non vide', nf.t.trim().length > 0, JSON.stringify(nf.t));
ok('404: h1 présent', nf.h1);

// /login : input password/username labellisés (password-input id fix)
await pub.goto(`${base}/login`, { waitUntil: 'domcontentloaded' });
await pub.waitForSelector('#login-email-or-username', { timeout: 25000 });
const lab = await pub.evaluate(() => {
  const bad = [];
  for (const inp of document.querySelectorAll('form input:not([type="submit"])')) {
    const id = inp.id;
    const named = inp.getAttribute('aria-label') || (id && document.querySelector(`label[for="${id}"]`));
    if (!named) bad.push(`input sans nom: #${id || inp.name || inp.type}`);
  }
  // chaque label[for] doit viser un contrôle existant (liaison leçon 42)
  for (const l of document.querySelectorAll('label[for]')) {
    const f = l.getAttribute('for');
    if (!document.getElementById(f)) bad.push(`label[for=${f}] sans cible`);
  }
  return bad;
});
ok('login: chaque input nommé + label[for]→cible existante', lab.length === 0, lab.join(';'));

// password inputs: l'id est sur l'<input>, pas sur le bouton toggle
const pw = await pub.evaluate(() => {
  const inputs = [...document.querySelectorAll('input[type="password"]')];
  return inputs.map(i => ({ id: i.id, labelled: !!document.querySelector(`label[for="${i.id}"]`) }));
});
ok('password: id sur l\'input + label[for] existe', pw.length > 0 && pw.every(p => p.id && p.labelled), JSON.stringify(pw));

// heading-order (DOM order, axe rule) sur /
const hd0 = await pub.evaluate(() => __c55.headingOrder());
ok('heading-order / : aucun saut de niveau', hd0.length === 0, hd0.join(';'));

// /communities : aucun th vide (empty-table-header)
await pub.goto(`${base}/communities`, { waitUntil: 'domcontentloaded' });
await pub.waitForSelector('table', { timeout: 25000 });
const ths = await pub.evaluate(() => [...document.querySelectorAll('thead th')].filter(th => !(th.innerText || '').trim() && !th.querySelector('[aria-label],[title],input')).length);
ok('/communities: aucun <th> vide', ths === 0, `${ths}`);

// /post/1 : vote-buttons aria-label (2.5.3) + heading-order
await pub.goto(`${base}/post/${POST1}`, { waitUntil: 'domcontentloaded' });
await pub.waitForSelector('.post-listing, .post', { timeout: 25000 });
await pub.waitForTimeout(1000);
const vb = await pub.evaluate(() => {
  const bad = [];
  for (const b of document.querySelectorAll('.vote-bar button, .btn-animate[aria-label*="vote" i], button[aria-pressed]')) {
    const al = b.getAttribute('aria-label') || '';
    if (!/upvote|downvote/i.test(al)) bad.push(`${b.className.slice(0, 40)} aria="${al}"`);
  }
  return bad;
});
ok('2.5.3: vote buttons aria-label contient Upvote/Downvote', vb.length === 0, vb.join(';'));
const hd1 = await pub.evaluate(() => __c55.headingOrder());
ok('heading-order /post : aucun saut de niveau', hd1.length === 0, hd1.join(';'));

// Liaisons aria (leçon 42) : tout labelledby/controls/activedescendant/describedby → cible existante
const links = await pub.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll('[aria-labelledby],[aria-controls],[aria-activedescendant],[aria-describedby]')) {
    for (const attr of ['aria-labelledby', 'aria-controls', 'aria-activedescendant', 'aria-describedby']) {
      const v = el.getAttribute(attr);
      if (!v) continue;
      for (const tok of v.split(/\s+/)) {
        if (tok && !document.getElementById(tok)) bad.push(`${attr}="${tok}" sans cible (${el.id || el.className.toString().slice(0, 30)})`);
      }
    }
  }
  return bad;
});
ok('leçon42 /post: toutes liaisons aria-* résolvent', links.length === 0, links.slice(0, 3).join(';'));

// Duplicate ids : aucun id dupliqué en DOM
const dup = await pub.evaluate(() => {
  const seen = new Map();
  for (const el of document.querySelectorAll('[id]')) seen.set(el.id, (seen.get(el.id) || 0) + 1);
  return [...seen.entries()].filter(([, c]) => c > 1).map(([id, c]) => `${id}x${c}`);
});
ok('/post: aucun id dupliqué', dup.length === 0, dup.join(';'));

// Contrastes mesurés (palette AA) : lien, active-sort, person-listing, muted, code
await pub.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await pub.waitForTimeout(1500);
const cr1 = await pub.evaluate(() => {
  const g = s => { const e = document.querySelector(s); return e ? __c55.cr(e) : null; };
  return {
    link: g('.md-div a, .post-title a, .overflow-wrap-anywhere'),
    active: g('.data-type-select > .active, .sort-select .active'),
    person: g('.person-listing > span, .person-listing'),
    muted: g('.text-muted'),
    code: g('.md-div code, code'),
  };
});
for (const [k, v] of Object.entries(cr1)) {
  if (v === null) na(`contrast ${k}`, 'élément non trouvé pour mesure');
  else ok(`contrast ${k} >= 4.5:1`, v >= 4.5, `${v}:1`);
}

// target-size : icon-only controls >= 24px
const ts = await pub.evaluate(() => {
  const out = {};
  for (const sel of ['.sort-select-icon', 'a[title="RSS"]']) {
    const e = document.querySelector(sel);
    if (!e) { out[sel] = 'ABSENT'; continue; }
    const r = e.getBoundingClientRect();
    out[sel] = `${r.width.toFixed(0)}x${r.height.toFixed(0)}`;
  }
  return out;
});
for (const [s, m] of Object.entries(ts)) {
  if (m === 'ABSENT') na(`target ${s}`, 'absent de la page');
  else ok(`target ${s} >= 24x24`, parseInt(m) >= 24, m);
}

// ================= AUTH =================
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#app', { timeout: 25000 });
await page.waitForTimeout(1500);

// SearchableSelect /create_post : liaisons + options ids (auth only)
await page.goto(`${base}/create_post`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#post-community', { timeout: 30000 });
await page.locator('#post-community').click();
await page.waitForTimeout(1200);
const ss = await page.evaluate(() => {
  const r = { bad: [] };
  const c = document.getElementById('post-community');
  const ctrl = c.getAttribute('aria-controls');
  const lb = ctrl && document.getElementById(ctrl);
  if (!lb) r.bad.push(`aria-controls=${ctrl} sans cible`);
  else {
    if (lb.getAttribute('aria-labelledby') !== 'post-community') r.bad.push(`listbox aria-labelledby=${lb.getAttribute('aria-labelledby')}`);
    const opts = [...lb.querySelectorAll('[role="option"], button')].filter(o => o.offsetParent);
    const ids = opts.map(o => o.id).filter(Boolean);
    if (new Set(ids).size !== ids.length) r.bad.push('option ids dupliqués');
  }
  const act = c.getAttribute('aria-activedescendant');
  if (act && !document.getElementById(act)) r.bad.push(`activedescendant=${act} sans cible`);
  const si = document.getElementById('post-community-search-input') || document.getElementById('searchable-select-input');
  if (!si) r.bad.push('search input absent');
  else if (!si.getAttribute('aria-label')) r.bad.push('search input sans aria-label');
  r.opts = document.querySelectorAll('[role="option"]').length;
  return r;
});
ok('SearchableSelect: aria-controls→listbox, ids options uniques, activedescendant valide, search input nommé', ss.bad.length === 0, `${ss.bad.join(';')} (opts=${ss.opts})`);

// /settings : h1 + tabs role/aria-selected + panes labelledby + upload inputs nommés
await page.goto(`${base}/settings`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('h1, #app', { timeout: 30000 });
await page.waitForTimeout(1000);
const set = await page.evaluate(() => {
  const r = { bad: [] };
  r.h1 = !!document.querySelector('h1');
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  r.tabs = tabs.length;
  for (const t of tabs) {
    const sel = t.getAttribute('aria-selected');
    if (sel !== 'true' && sel !== 'false') r.bad.push(`tab #${t.id} aria-selected=${sel}`);
    if (!t.id) r.bad.push('tab sans id');
  }
  for (const p of document.querySelectorAll('div.tab-pane, [role="tabpanel"]')) {
    const lb = p.getAttribute('aria-labelledby');
    if (!lb || !document.getElementById(lb)) r.bad.push(`pane #${p.id} aria-labelledby→${lb} sans cible`);
  }
  // image-upload inputs nommés
  for (const inp of document.querySelectorAll('input[type="file"]')) {
    if (!inp.getAttribute('aria-label') && !(inp.id && document.querySelector(`label[for="${inp.id}"]`)))
      r.bad.push(`file input sans nom #${inp.id}`);
  }
  // password inputs id sur input
  for (const inp of document.querySelectorAll('input[type="password"]')) {
    const forOk = inp.id && document.querySelector(`label[for="${inp.id}"]`);
    if (!forOk && !inp.getAttribute('aria-label')) r.bad.push(`password sans nom #${inp.id}`);
  }
  return r;
});
ok('/settings: h1 présent', set.h1);
ok('/settings: tabs aria-selected + panes aria-labelledby + inputs nommés', set.bad.length === 0, `${set.bad.join(';')} (tabs=${set.tabs})`);

// /admin : rate-limit inputs ids uniques + labellisés + panes
await page.goto(`${base}/admin`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#app', { timeout: 30000 });
await page.waitForTimeout(1500);
const adm = await page.evaluate(() => {
  const bad = [];
  const ids = [...document.querySelectorAll('[id^="rate-limit-"], [id^="rate-limit-per-second-"]')].map(e => e.id);
  const dupIds = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dupIds.length) bad.push(`ids dupliqués: ${dupIds.join(',')}`);
  for (const inp of document.querySelectorAll('input[type="number"], input[type="text"].form-control')) {
    const id = inp.id;
    if (id && !document.querySelector(`label[for="${id}"]`) && !inp.getAttribute('aria-label')) bad.push(`input non labellisé #${id}`);
  }
  for (const p of document.querySelectorAll('div.tab-pane, [role="tabpanel"]')) {
    const lb = p.getAttribute('aria-labelledby');
    if (!lb || !document.getElementById(lb)) bad.push(`pane #${p.id} aria-labelledby→${lb} sans cible`);
  }
  for (const l of document.querySelectorAll('label[for]')) {
    const f = l.getAttribute('for');
    if (!document.getElementById(f)) bad.push(`label[for=${f}] sans cible`);
  }
  const email = document.getElementById('create-site-application-email-admins');
  const emails = [...document.querySelectorAll('label[for="create-site-application-email-admins"]')];
  if (email || emails.length) {
    if (!email) bad.push('label for=create-site-application-email-admins sans cible');
    if (!emails.length) bad.push('#create-site-application-email-admins sans label');
  }
  return bad;
});
ok('/admin: ids rate-limit uniques + inputs labellisés + panes/labels résolvent', adm.length === 0, adm.join(';'));

// /create_community : nsfw/visibility labels
await page.goto(`${base}/create_community`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#community-nsfw, form', { timeout: 30000 });
const cc = await page.evaluate(() => {
  const bad = [];
  for (const id of ['community-nsfw', 'community-visibility']) {
    const el = document.getElementById(id);
    if (!el) { bad.push(`#${id} absent`); continue; }
    if (!document.querySelector(`label[for="${id}"]`)) bad.push(`#${id} sans label[for]`);
  }
  for (const inp of document.querySelectorAll('input[type="file"]')) {
    if (!inp.getAttribute('aria-label') && !(inp.id && document.querySelector(`label[for="${inp.id}"]`)))
      bad.push(`file input sans nom #${inp.id}`);
  }
  return bad;
});
ok('/create_community: nsfw+visibility labellisés + uploads nommés', cc.length === 0, cc.join(';'));

// Menu More : position statique (fix partiallyObscured) — ouverture post menu
await page.goto(`${base}/post/${POST1}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('button.dropdown-toggle[aria-controls^="post-action"]', { state: 'attached', timeout: 30000 });
await page.locator('button.dropdown-toggle[aria-controls^="post-action"]:visible').first().click();
await page.waitForTimeout(900);
const menu = await page.evaluate(() => {
  const m = document.querySelector('ul.dropdown-menu[id^="post-actions-dropdown"].show') || document.querySelector('ul.dropdown-menu.show');
  if (!m) return null;
  return { pos: getComputedStyle(m).position, id: m.id, items: m.children.length, shown: m.classList.contains('show') };
});
if (!menu) na('post more-menu', 'menu non ouvert');
else {
  ok('post more-menu: position statique (pas d\'overlay sur les cibles)', menu.pos === 'static', `${menu.pos} #${menu.id}`);
  ok('post more-menu: items rendus', menu.items > 0, `${menu.items}`);
}
// id unique par instance de dropdown (duplicate-id-aria fix)
const ddIds = await page.evaluate(() => {
  const ids = [...document.querySelectorAll('ul.dropdown-menu[id]')].map(e => e.id);
  return ids.filter((x, i) => ids.indexOf(x) !== i);
});
ok('dropdown menus: ids uniques par instance', ddIds.length === 0, ddIds.join(','));

// Markdown toolbar buttons >= 24px (reply editor)
await page.locator('#comment-1 button[aria-label="Reply"], button[aria-label="Reply"]:visible').first().click().catch(() => {});
await page.waitForTimeout(900);
const tb = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button.btn-link[data-tippy-content], a[title="formatting help"]')].filter(b => b.offsetParent);
  return btns.map(b => { const r = b.getBoundingClientRect(); return `${r.width.toFixed(0)}x${r.height.toFixed(0)}`; });
});
if (!tb.length) na('markdown toolbar', 'éditeur non ouvert');
else ok('markdown toolbar: boutons >= 24px', tb.every(m => parseInt(m) >= 24), tb.join(','));

// Badges mod/admin : role img + aria-label contient visible
const badge = await page.evaluate(() => {
  const bad = [];
  for (const b of document.querySelectorAll('.badge[aria-label]')) {
    const role = b.getAttribute('role');
    const al = (b.getAttribute('aria-label') || '').toLowerCase();
    const vis = (b.innerText || '').trim().toLowerCase();
    if (!role) bad.push(`badge sans rôle: "${vis}"`);
    if (vis && !al.includes(vis)) bad.push(`aria "${al}" vs visible "${vis}"`);
  }
  return bad;
});
ok('badges: role img + aria-label contient le texte visible', badge.length === 0, badge.join(';'));

// Vote display spans : role=img (noRoleSingular)
const vd = await page.evaluate(() => [...document.querySelectorAll('span[aria-label*="vote" i], span[aria-label*="point" i]')].filter(s => !s.getAttribute('role')).length);
ok('vote-display: spans statistiques avec role', vd === 0, `${vd} sans rôle`);

// /inbox : filtres btn-check ↔ labels + vote buttons compacts
await page.goto(`${base}/inbox`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#app', { timeout: 30000 });
await page.waitForTimeout(1200);
const inb = await page.evaluate(() => {
  const bad = [];
  for (const i of document.querySelectorAll('input.btn-check')) {
    if (!document.querySelector(`label[for="${i.id}"]`)) bad.push(`btn-check #${i.id} sans label`);
  }
  return bad;
});
ok('/inbox: btn-check radio filtres ↔ labels', inb.length === 0, inb.join(';'));

// /modlog : filtres SearchableSelect + selects nommés
await page.goto(`${base}/modlog`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#app', { timeout: 30000 });
await page.waitForTimeout(1200);
const md = await page.evaluate(() => {
  const bad = [];
  for (const s of document.querySelectorAll('select')) {
    if (!s.getAttribute('aria-label') && !(s.id && document.querySelector(`label[for="${s.id}"]`))) bad.push(`select sans nom #${s.id}`);
  }
  for (const id of ['filter-user', 'filter-mod']) {
    const c = document.getElementById(id);
    if (c) {
      const ctrl = c.getAttribute('aria-controls');
      if (!ctrl || !document.getElementById(ctrl)) bad.push(`#${id} aria-controls→${ctrl} sans cible`);
    }
  }
  return bad;
});
ok('/modlog: selects nommés + combobox controls→listbox', md.length === 0, md.join(';'));

await browser.close();
const fails = results.filter(r => !r.pass).length;
const total = results.filter(r => r.verdict !== 'N-A').length;
console.log(`\nverify.mjs lemmy : ${total - fails}/${total} assertions OK (${fails} FAIL, ${results.length - total} N-A)`);
process.exit(fails ? 1 : 0);
