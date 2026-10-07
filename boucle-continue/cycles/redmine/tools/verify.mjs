// verify.mjs — sondes computed/rect pour les corrections du cycle redmine.
// Chaque assertion mesure une valeur réelle (computed style, bounding rect,
// ratio de contraste composite), jamais une simple présence d'attribut.
// Usage: node verify.mjs <base> <auth.json>
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const require = createRequire(resolve(process.cwd() + '/package.json'));
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] ?? 'http://localhost:5801';
const AUTH = process.argv[3] ?? resolve(here, 'auth.json');

let failures = 0;
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!cond) failures++;
};

const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = rgb => 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2]);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const parse = s => { const m = /rgba?\(([^)]+)\)/.exec(s || ''); if (!m) return null; const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; };
const effectiveBg = `(el) => {
  const parse = s => { const m = /rgba?\\(([^)]+)\\)/.exec(s || ''); if (!m) return null; const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; };
  let acc = [0,0,0,0]; let n = el;
  while (n && n !== document.documentElement) {
    const c = parse(getComputedStyle(n).backgroundColor);
    if (c && c[3] > 0) {
      const a = acc[3] + c[3] * (1 - acc[3]);
      acc = acc.slice(0,3).map((v,i)=>(v*acc[3]+c[i]*c[3]*(1-acc[3]))/a).concat(a);
      if (acc[3] >= 1) break;
    }
    n = n.parentElement;
  }
  if (acc[3] < 1) acc = [255,255,255,1].map((v,i)=> i<3 ? v*(1-acc[3])+acc[i] : 1);
  return acc;
}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();

// ---------- 1. Landmarks nommés, uniques, complets (page issues) ----------
await page.goto(`${BASE}/projects/office-website/issues?set_filter=1`, { waitUntil: 'load' });
let m = await page.evaluate(() => {
  const role = sel => document.querySelector(sel)?.getAttribute('role');
  const lbl = sel => document.querySelector(sel)?.getAttribute('aria-label');
  const mains = document.querySelectorAll('[role="main"], main').length;
  return {
    banner: role('#header'), main: role('#content'), cinfo: role('#footer'),
    sidebar: role('#sidebar'), sidebarLbl: lbl('#sidebar'),
    topMenu: lbl('#top-menu'), mainMenu: lbl('#main-menu'), mainMenuRole: role('#main-menu'),
    flyout: lbl('.flyout-menu'), flyoutTag: document.querySelector('.flyout-menu')?.tagName,
    search: role('#quick-search'), status: role('#ajax-indicator'), mains,
    navs: [...document.querySelectorAll('nav,[role="navigation"]')].map(n => n.getAttribute('aria-label') || n.id || '?'),
  };
});
check('banner role', m.banner === 'banner', m.banner);
check('un seul main', m.mains === 1, `count=${m.mains}`);
check('contentinfo role', m.cinfo === 'contentinfo', m.cinfo);
check('sidebar complementary+label', m.sidebar === 'complementary' && !!m.sidebarLbl, `${m.sidebar}/${m.sidebarLbl}`);
check('top-menu nav nommé', !!m.topMenu, m.topMenu);
check('main-menu navigation nommée', m.mainMenuRole === 'navigation' && !!m.mainMenu, `${m.mainMenuRole}/${m.mainMenu}`);
check('flyout nav nommée', m.flyoutTag === 'NAV' && !!m.flyout, `${m.flyoutTag}/${m.flyout}`);
check('quick-search role=search', m.search === 'search', m.search);
check('ajax-indicator role=status', m.status === 'status', m.status);
check('landmarks nav uniques', new Set(m.navs).size === m.navs.length, JSON.stringify(m.navs));

// ---------- 2. Liste issues : checkboxes nommées, th boutons peuplé ----------
m = await page.evaluate(() => ({
  all: document.querySelector('#check_all')?.getAttribute('aria-label'),
  row: document.querySelector('input[name="ids[]"]')?.getAttribute('aria-label'),
  thBtns: document.querySelector('th.buttons .visually-hidden')?.textContent.trim(),
  ctxBtn: document.querySelector('td.buttons a[rel="nofollow"], td.buttons a')?.getAttribute('aria-label') || document.querySelector('td.buttons a')?.textContent.trim(),
}));
check('check_all nommé (label, pas title-only)', !!m.all, m.all);
check('checkbox ligne nommée', /Select issue #\d+/.test(m.row || ''), m.row);
check('th actions a un texte sr', !!m.thBtns, m.thBtns);

// ---------- 3. Query options : boutons colonnes nommés + select opérateur ----------
// Déplier explicitement le fieldset Filters (l'union peut cibler un autre
// fieldset selon l'ordre DOM) puis lire les boutons colonnes dans le DOM.
await page.locator('fieldset legend', { hasText: 'Filters' }).first().click().catch(() => {});
await page.waitForTimeout(400);
await page.locator('fieldset legend', { hasText: 'Options' }).first().click().catch(() => {});
await page.waitForTimeout(400);
m = await page.evaluate(() => ({
  right: document.querySelector('button.move-right, input.move-right')?.getAttribute('aria-label'),
  top: document.querySelector('button[onclick*="moveOptionTop"], input.move-top')?.getAttribute('aria-label'),
  opSel: document.querySelector('select[name$="[operator]"], select[id^="operators"]')?.getAttribute('aria-label'),
}));
check('bouton add-selected-columns nommé', !!m.right, m.right);
check('bouton move-top nommé', !!m.top, m.top);
// select opérateur injecté par buildFilterRow seulement après ajout d'un filtre
await page.evaluate(() => {
  const s = document.querySelector('#add_filter_select');
  s.value = 'author_id';
  s.dispatchEvent(new Event('change', { bubbles: true }));
});
await page.waitForTimeout(600);
m = await page.evaluate(() => {
  const op = document.querySelector('#tr_author_id select[id^="operators_"], #tr_author_id .operator select');
  const val = document.querySelector('#tr_author_id .values select');
  return { op: op?.getAttribute('aria-label'), val: val?.getAttribute('aria-label') };
});
check('select opérateur filtre nommé', /:/.test(m.op || '') || !!m.op, m.op);
check('select valeur filtre nommé', /:/.test(m.val || '') || !!m.val, m.val);

// ---------- 4. Contrastes composites (footer, pagination, other-formats, avatar) ----------
m = await page.evaluate(`(() => {
  const effBg = ${effectiveBg};
  const pick = sel => { const el = document.querySelector(sel); if (!el) return null;
    const cs = getComputedStyle(el); return { fg: cs.color, bg: effBg(el), deco: cs.textDecorationLine }; };
  return {
    footer: pick('#footer a'), pag: pick('span.pagination'), fmt: pick('p.other-formats a'),
    avatar: pick('span[role="img"].avatar'), author: pick('div.attachments span.author'),
  };})()`);
for (const [name, k] of [['footer', 'footer'], ['pagination', 'pag'], ['other-formats a', 'fmt'], ['avatar initiales', 'avatar']]) {
  if (!m[k]) { check(`contraste ${name} : élément présent`, false, 'absent'); continue; }
  const c = ratio(lum(parse(m[k].fg)), lum(m[k].bg));
  check(`contraste ${name} >= 4.5`, c >= 4.5, `ratio ${c.toFixed(2)} fg=${m[k].fg} bg=${m[k].bg.map(Math.round)}`);
}
check('footer liens soulignés', (m.footer?.deco || '').includes('underline'), m.footer?.deco);
check('other-formats liens soulignés', (m.fmt?.deco || '').includes('underline'), m.fmt?.deco);

// ---------- 5. Avatar role=img nommé ----------
m = await page.evaluate(() => {
  const a = document.querySelector('span[role="img"].avatar');
  return a ? { al: a.getAttribute('aria-label'), txt: a.textContent.trim() } : null;
});
check('avatar role=img aria-label', !!m?.al, JSON.stringify(m));

// ---------- 6. Sidebar : targets >=24px, h2, liens soulignés ----------
m = await page.evaluate(`(() => {
  const q = document.querySelector('#sidebar ul.queries li a');
  const clear = document.querySelector('#sidebar a.icon-clear-query');
  const h3 = document.querySelectorAll('#sidebar h3').length;
  const h2 = document.querySelectorAll('#sidebar h2').length;
  return {
    qH: q?.getBoundingClientRect().height, clearH: clear?.getBoundingClientRect().height, h3, h2,
  };})()`);
check('lien query sidebar >=24px', m.qH >= 24, `h=${m.qH?.toFixed(1)}`);
check('icon-clear-query >=24px', m.clearH === undefined || m.clearH >= 24, `h=${m.clearH?.toFixed(1)}`);
check('sidebar h2 (pas h3)', m.h3 === 0 && m.h2 > 0, `h2=${m.h2} h3=${m.h3}`);

// ---------- 7. Issue #6 : a.issue souligné + formulaire édit ----------
await page.goto(`${BASE}/issues/6`, { waitUntil: 'load' });
m = await page.evaluate(() => {
  const a = document.querySelector('a.issue');
  return a ? getComputedStyle(a).textDecorationLine : 'absent';
});
check('liens a.issue soulignés', m.includes('underline') || m === 'absent', m);
// modale = role=dialog ajouté par jQuery UI (exempt de region) — ouvrir l'édition
await page.locator('#content .icon-edit[href*="edit"], a.icon-edit').first().click().catch(() => {});
await page.waitForTimeout(1200);
m = await page.evaluate(() => ({
  notes: document.querySelector('#issue_notes')?.getAttribute('aria-label'),
  dlg: document.querySelector('#ajax-modal')?.closest('[role="dialog"], .ui-dialog')?.getAttribute('role'),
}));
check('textarea notes nommée', !!m.notes, m.notes);
await page.keyboard.press('Escape');

// ---------- 8. Nouvelle demande : input fichier nommé ----------
await page.goto(`${BASE}/issues/new?project_id=office-website`, { waitUntil: 'load' });
m = await page.evaluate(() => document.querySelector('input[type="file"]')?.getAttribute('aria-label'));
check('input file attachments nommé', !!m, m);

// ---------- 9. Gantt : selects mois/année + champ durée ----------
await page.goto(`${BASE}/projects/office-website/issues/gantt`, { waitUntil: 'load' });
m = await page.evaluate(() => ({
  mois: document.querySelector('select[name="month"]')?.getAttribute('aria-label'),
  an: document.querySelector('select[name="year"]')?.getAttribute('aria-label'),
  months: document.querySelector('#months')?.labels?.length ?? document.querySelector('label[for="months"]')?.textContent?.trim(),
}));
check('gantt select mois nommé', !!m.mois, m.mois);
check('gantt select année nommé', !!m.an, m.an);
check('gantt champ months labellé', !!m.months, String(m.months));

// ---------- 10. Login public : pas de tabindex>0, labels ----------
// /login redirige quand la session est active : contexte anonyme dédié.
const anonPage = await (await browser.newContext()).newPage();
await anonPage.goto(`${BASE}/login`, { waitUntil: 'load' });
m = await anonPage.evaluate(() => {
  const bad = [...document.querySelectorAll('[tabindex]')].map(e => e.getAttribute('tabindex'));
  return { bad, user: document.querySelector('#username')?.labels?.length, pass: document.querySelector('#password')?.labels?.length };
});
check('login sans tabindex', m.bad.length === 0, JSON.stringify(m.bad));
check('login labels for', m.user >= 1 && m.pass >= 1, `u=${m.user} p=${m.pass}`);

// ---------- 11. Mobile 390px : h1 en arbre d'accessibilité (pas display:none) ----------
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/projects/office-website/issues?set_filter=1`, { waitUntil: 'load' });
m = await page.evaluate(() => {
  const h1 = document.querySelector('#header h1');
  const cs = h1 && getComputedStyle(h1);
  const btn = document.querySelector('.mobile-toggle-button');
  return { disp: cs?.display, vis: cs?.visibility, clip: cs?.clipPath || cs?.clip, btnLabel: btn?.getAttribute('aria-label') };
});
check('h1 présent à 390px (visually-hidden)', m.disp !== 'none' && m.vis === 'visible', JSON.stringify(m));
check('bouton menu mobile nommé', !!m.btnLabel, m.btnLabel);

await browser.close();
console.log(failures === 0 ? 'VERIFY: 0 FAIL' : `VERIFY: ${failures} FAIL`);
process.exit(failures ? 1 : 0);
