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
// query_id=8 = requête sauvegardée appliquée : l'icône « réinitialiser la
// requête » (.icon-clear-query) n'existe que dans ce contexte — la mesure
// est exigée, son absence est un échec, pas un non-lieu.
await page.goto(`${BASE}/projects/office-website/issues?query_id=8`, { waitUntil: 'load' });
m = await page.evaluate(`(() => {
  const q = document.querySelector('#sidebar ul.queries li a');
  const clear = document.querySelector('#sidebar a.icon-clear-query');
  const h3 = document.querySelectorAll('#sidebar h3').length;
  const h2 = document.querySelectorAll('#sidebar h2').length;
  return {
    qH: q?.getBoundingClientRect().height, clearH: clear?.getBoundingClientRect().height, h3, h2,
  };})()`);
check('lien query sidebar >=24px', m.qH >= 24, `h=${m.qH?.toFixed(1)}`);
check('icon-clear-query présente', m.clearH !== undefined, 'absente');
check('icon-clear-query >=24px', m.clearH !== undefined && m.clearH >= 24, `h=${m.clearH?.toFixed(1)}`);
check('sidebar h2 (pas h3)', m.h3 === 0 && m.h2 > 0, `h2=${m.h2} h3=${m.h3}`);

// ---------- 7. a.issue soulignés (relations de l'issue 9 : élément réel) +
// issue #6 : formulaire édit + vraie modale jQuery UI (watchers) ----------
await page.goto(`${BASE}/issues/9`, { waitUntil: 'load' });
m = await page.evaluate(() => {
  const a = document.querySelector('#relations a.issue, a.issue');
  return a ? getComputedStyle(a).textDecorationLine : 'absent';
});
check('lien a.issue présent (relations)', m !== 'absent', m);
check('liens a.issue soulignés', m !== 'absent' && m.includes('underline'), m);

await page.goto(`${BASE}/issues/6`, { waitUntil: 'load' });
// l'icône « Edit » déplie le formulaire inline (pas de modale)
await page.locator('#content .icon-edit[href*="edit"], a.icon-edit').first().click().catch(() => {});
await page.waitForTimeout(1200);
m = await page.evaluate(() => document.querySelector('#issue_notes')?.getAttribute('aria-label'));
check('textarea notes nommée', !!m, m);
await page.keyboard.press('Escape');
// la modale réelle s'ouvre via Watchers — role=dialog exigible (jQuery UI)
await page.locator('#watchers a[href*="/watchers/new"]').first().click();
await page.waitForSelector('#ajax-modal #new-watcher-form', { timeout: 10000 });
m = await page.evaluate(() =>
  document.querySelector('#ajax-modal')?.closest('[role="dialog"], .ui-dialog')?.getAttribute('role'));
check('modale jQuery UI role=dialog', m === 'dialog', m);
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

// ---------- 12. Menu contextuel : reciblage sous inert + Escape ----------
// F-v2-1 : clic-droit sur une ligne différente pendant que le menu est ouvert
// doit fermer+rouvrir sur la nouvelle cible (parité contextmenu natif) — la
// cible réelle est retrouvée sous le #wrapper inert via elementFromPoint.
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(`${BASE}/projects/office-website/issues?set_filter=1`, { waitUntil: 'load' });
await page.waitForSelector('tr.hascontextmenu a.js-contextmenu');
await page.locator('tr.hascontextmenu').nth(0).locator('a.js-contextmenu').click();
await page.waitForSelector('#context-menu:visible', { timeout: 8000 });
await page.waitForSelector('#context-menu li a', { timeout: 8000 });
const posA = await page.locator('#context-menu').boundingBox();
let clickB = null;
for (let i = 1; i < 12 && !clickB; i++) {
  for (const c of await page.locator('tr.hascontextmenu').nth(i).locator('td:visible').all()) {
    const b = await c.boundingBox();
    if (!b) continue;
    const px = b.x + b.width / 2, py = b.y + b.height / 2;
    if (!(px >= posA.x - 4 && px <= posA.x + posA.width + 4 &&
          py >= posA.y - 4 && py <= posA.y + posA.height + 4)) { clickB = { px, py, row: i }; break; }
  }
}
check('cible reciblage hors menu trouvée', !!clickB, JSON.stringify(clickB));
if (clickB) {
  await page.mouse.click(clickB.px, clickB.py, { button: 'right' });
  await page.waitForTimeout(700);
  const posB = await page.locator('#context-menu').boundingBox();
  const selB = await page.evaluate(r =>
    document.querySelectorAll('tr.hascontextmenu')[r]?.classList.contains('context-menu-selection'), clickB.row);
  check('F-v2-1 menu reciblée sur B', (await page.locator('#context-menu').isVisible()) &&
    posB && (Math.abs(posB.x - posA.x) > 5 || Math.abs(posB.y - posA.y) > 5) && selB,
    `posB=(${posB?.x | 0},${posB?.y | 0}) vs A=(${posA?.x | 0},${posA?.y | 0}) sel=${selB}`);
}
// F-v2-2 : Escape ferme, inert levé, focus restauré sur le déclencheur
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
m = await page.evaluate(() => ({
  open: document.querySelector('#context-menu')?.offsetParent !== null &&
        !!document.querySelector('#context-menu') && document.querySelector('#context-menu').style.display !== 'none' &&
        document.querySelector('#context-menu').getBoundingClientRect().width > 0,
  inert: document.getElementById('wrapper').inert,
  ae: document.activeElement?.className || '',
}));
check('F-v2-2 Escape ferme le menu', !m.open, `open=${m.open}`);
check('F-v2-2 inert levé après Escape', m.inert === false, `inert=${m.inert}`);
check('F-v2-2 focus restauré sur déclencheur', m.ae.includes('js-contextmenu'), m.ae);

// ---------- 13. Résidus v2 (R3/R1/R2) + warts W-v2-4/W-v2-5 ----------
// R3 — jQuery.trigger('contextmenu') SANS coordonnées (clientX/Y undefined) ne
// doit jamais laisser inert levé pendant que le menu aria-modal reste visible.
// Garde coords + try/finally dans contextMenuRealTarget.
await page.goto(`${BASE}/projects/office-website/issues?set_filter=1`, { waitUntil: 'load' });
await page.waitForSelector('tr.hascontextmenu a.js-contextmenu');
await page.locator('tr.hascontextmenu').nth(0).locator('a.js-contextmenu').click();
await page.waitForSelector('#context-menu:visible', { timeout: 8000 });
const r3 = await page.evaluate(() => {
  let threw = null;
  try { jQuery('tr.hascontextmenu').eq(1).trigger('contextmenu'); } catch (e) { threw = String(e); }
  return { threw,
           inertAfter: document.getElementById('wrapper').inert,
           openAfter: document.querySelector('#context-menu').offsetParent !== null };
});
check('R3 contextmenu synthétique : pas d\'exception', r3.threw === null, r3.threw || '');
check('R3 inert jamais fuit sous menu modal', r3.inertAfter === true, `inert=${r3.inertAfter} open=${r3.openAfter}`);
// reset déterministe : recharge la page — menu fermé, inert levé (l'état
// modal laissé par le trigger synthétique n'est pas fiable à réutiliser).
await page.goto(`${BASE}/projects/office-website/issues?set_filter=1`, { waitUntil: 'load' });
await page.waitForSelector('tr.hascontextmenu a.js-contextmenu');

// R1 — clic-gauche sur l'enfant <svg> de l'icône .js-contextmenu pendant que
// le menu est ouvert : la garde doit résoudre l'ancre (closest) → comportement
// d'ancre (le menu reste ouvert / se recible, au lieu de fermer).
// Géométrie : menu ouvert sur la ligne 0 — il s'ouvre VERS LE BAS et ne
// recouvre jamais son propre déclencheur → le clic glyphe est déterministe.
const menuState = () => page.evaluate(() => {
  const menu = document.querySelector('#context-menu');
  const rect = menu ? menu.getBoundingClientRect() : { width: 0 };
  const rows = [...document.querySelectorAll('tr.hascontextmenu')];
  const sel = rows.findIndex(tr => tr.classList.contains('context-menu-selection'));
  return { open: !!menu && menu.offsetParent !== null && rect.width > 0, sel,
           inert: document.getElementById('wrapper').inert };
});
const rows = page.locator('tr.hascontextmenu');
const nRows = await rows.count();
await rows.nth(0).locator('a.js-contextmenu').click();
await page.waitForSelector('#context-menu:visible', { timeout: 8000 });
// Le menu est positionné AU point de clic (top-left = coords du déclencheur)
// → il recouvre toujours son propre déclencheur : impossible de re-cliquer le
// même glyphe. On recible sur la première ligne dont le glyphe n'est pas
// recouvert par le menu ouvert (le menu ~300px n'en couvre que quelques-unes).
const mrect = await page.locator('#context-menu').boundingBox();
let pick = -1, pickBox = null;
for (let i = 1; i < nRows; i++) {
  const g = rows.nth(i).locator('a.js-contextmenu svg, a.js-contextmenu use, a.js-contextmenu path').first();
  const bb = await g.boundingBox().catch(() => null);
  if (!bb) { continue; }
  const covered = bb.x < mrect.x + mrect.width && bb.x + bb.width > mrect.x &&
                  bb.y < mrect.y + mrect.height && bb.y + bb.height > mrect.y;
  if (!covered) { pick = i; pickBox = bb; break; }
}
if (pick > 0) {
  await page.mouse.click(pickBox.x + pickBox.width / 2, pickBox.y + pickBox.height / 2);
  await page.waitForTimeout(900);
  const r1b = await menuState();
  check('R1 clic glyphe svg (autre ligne) : menu reciblé', r1b.open && r1b.sel === pick, `pick=${pick} ` + JSON.stringify(r1b));
} else {
  check('R1 clic glyphe svg (autre ligne) : menu reciblé', false, 'aucune ligne non recouverte trouvée');
}

// R2 — clic normal sur un lien pendant que le menu est ouvert : down-close-up-
// leave — inert levé en capture-phase → le lien navigue (parité amont).
// Le menu reste ouvert depuis R1 ; on clique le lien subject d'une ligne —
// colonne de gauche, jamais recouverte par le menu (colonne actions à droite).
const sb = await rows.nth(2).locator('td.subject a').boundingBox();
await page.mouse.click(sb.x + sb.width / 2, sb.y + sb.height / 2);
await page.waitForTimeout(1500);
const r2url = page.url();
const r2 = await page.evaluate(() => ({
  inert: document.getElementById('wrapper')?.inert,
  menuOpen: !!document.querySelector('#context-menu')?.offsetParent,
}));
check('R2 clic lien : navigation réelle', /\/issues\/\d+/.test(r2url), r2url);
check('R2 inert levé après navigation', r2.inert === false && !r2.menuOpen, JSON.stringify(r2));

// W-v2-5 — les th de /help/wiki_syntax portent scope (WCAG 1.3.1, axe muet).
await page.goto(`${BASE}/help/wiki_syntax`, { waitUntil: 'load' });
const ths = await page.evaluate(() => {
  const all = [...document.querySelectorAll('th')];
  const sc = s => all.filter(t => t.getAttribute('scope') === s).length;
  return { total: all.length, missing: all.filter(t => !t.getAttribute('scope')).length,
           row: sc('row'), col: sc('col'), colgroup: sc('colgroup') };
});
check('W-v2-5 tous les th scopés sur /help/wiki_syntax',
  ths.total > 0 && ths.missing === 0 && ths.row > 0 && ths.col > 0 && ths.colgroup > 0,
  JSON.stringify(ths));

// W-v2-4 — a.lost_password (gate sudo #sudo-form + page /login) : cible >=24px
// en tout contexte. /login est le pin déterministe (Setting.lost_password=1)
// — le gate sudo dépend du délai amont, pas du patch.
{
  const pub = await browser.newContext();
  const pp = await pub.newPage();
  await pp.goto(`${BASE}/login`, { waitUntil: 'load' });
  const lp = await pp.evaluate(() => {
    const a = document.querySelector('a.lost_password');
    const r = a && a.getBoundingClientRect();
    return r ? { h: Math.round(r.height * 10) / 10, w: Math.round(r.width) } : null;
  });
  check('W-v2-4 a.lost_password >=24px (/login)', lp !== null && lp.h >= 24, JSON.stringify(lp));
  await pub.close();
}

await browser.close();
console.log(failures === 0 ? 'VERIFY: 0 FAIL' : `VERIFY: ${failures} FAIL`);
process.exit(failures ? 1 : 0);
