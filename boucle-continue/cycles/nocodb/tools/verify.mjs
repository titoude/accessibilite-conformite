/**
 * verify.mjs — assertions DURES sur les corrections nocodb (cycle 30).
 * Chaque assertion échoue → process.exit(1). Aucun self-verdict axe :
 * le score axe est produit par audit.mjs, pas ici.
 * Les assertions mesurent l'état rendu (rôle, attribut, contraste, structure),
 * jamais la seule exécution d'une action.
 *
 * Usage: node verify.mjs <baseUrl> <auth.json>
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const [base, authFile] = process.argv.slice(2);
const state = authFile ? JSON.parse(readFileSync(authFile, 'utf8')) : undefined;
const results = [];
const ok = (name, cond, extra = '') => {
  results.push({ name, pass: !!cond });
  console.log(`  ${cond ? 'PASS' : 'FAIL'} ${name} ${extra}`);
  return cond;
};

const contrast = (fg, bg) => {
  const lum = (c) => c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  const [r1, g1, b1] = lum(fg), [r2, g2, b2] = lum(bg);
  const L1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const L2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};
const rgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
const rgbaAlpha = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return 1; const p = m[1].split(',').map(Number); return p[3] ?? 1; };

// IDs propres à chaque instance — surchargeables via env (mêmes noms que audit.mjs)
// pour rejouer verbatim sur un clone frais : NC_WS/NC_BASE/NC_TABLE/NC_GRID/NC_KANBAN/NC_FORM/NC_SHARE_FORM
const NC_WS = process.env.NC_WS || 'wd10yk1f';
const NC_BASE = process.env.NC_BASE || 'pkg7xkxnvm4oc5w';
const NC_TABLE = process.env.NC_TABLE || 'm9aiffs89yv1o74';
const NC_GRID = process.env.NC_GRID || 'vwsla3dxylant2l6';
const NC_KANBAN = process.env.NC_KANBAN || 'vw2cbsdazc2o514r';
const NC_FORM = process.env.NC_FORM || 'vwr3k2vkep40846h';
const NC_SHARE_FORM = process.env.NC_SHARE_FORM || '540b143b-6850-4097-9cc3-b791065ead09';
const GRID_URL = `/${NC_WS}/${NC_BASE}/${NC_TABLE}/${NC_GRID}/items-items`;

const browser = await chromium.launch();
const anonPage = await (await browser.newContext()).newPage();
anonPage.setDefaultTimeout(20000);
const page = await (await browser.newContext(state ? { storageState: state } : {})).newPage();
page.setDefaultTimeout(20000);

const h1Count = () => page.evaluate(() =>
  [...document.querySelectorAll('h1')].filter(h => (h.textContent || '').trim() && h.offsetParent !== null).length);

const unlabeledFields = () => page.evaluate(() =>
  [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), select, textarea, [role="textbox"], [role="combobox"]')]
    .filter(el => el.offsetParent !== null)
    .filter(el => {
      const lab = el.getAttribute('aria-labelledby');
      const labOk = lab ? lab.split(/\s+/).some(id => (document.getElementById(id)?.textContent || '').trim()) : false;
      const forLab = el.id ? [...document.querySelectorAll('label')].some(l => l.getAttribute('for') === el.id) : false;
      return !(el.getAttribute('aria-label') || el.getAttribute('title') || labOk || forLab || el.closest('label'));
    }).map(el => `${el.tagName}.${(el.className + '').split(' ')[0]}#${el.id || el.name || ''}`));

// ════════════ PUBLIC (contexte anonyme) ════════════
await anonPage.goto(`${base}/signin/`, { waitUntil: 'domcontentloaded' });
await anonPage.waitForSelector('input[type="email"]');
await anonPage.waitForTimeout(1500);

const signin = await anonPage.evaluate(() => {
  const mains = [...document.querySelectorAll('main, [role="main"]')].filter(m => m.offsetParent !== null);
  const named = [...document.querySelectorAll('[role="main"], main')]
    .map(m => m.getAttribute('aria-label') || m.getAttribute('aria-labelledby') || null);
  return {
    lang: document.documentElement.lang,
    mains: mains.length,
    mainsNested: mains.filter(m => m.parentElement && m.parentElement.closest('main, [role="main"]') !== null).length,
    anonymousBtns: [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null && !(b.getAttribute('aria-label') || (b.textContent || '').trim() || b.getAttribute('aria-labelledby'))).length,
    banner: !!document.querySelector('header, [role="banner"]'),
  };
});
ok('signin: <html lang> renseigné (html-has-lang)', !!signin.lang, signin.lang);
ok('signin: exactement 1 main de premier niveau (landmark-main-is-top-level)', signin.mains === 1 && signin.mainsNested === 0, `mains=${signin.mains} nested=${signin.mainsNested}`);
ok('signin: aucun bouton anonyme (button-name)', signin.anonymousBtns === 0, `${signin.anonymousBtns}`);

// Les champs email/password visibles sont nommés (label / aria-input-field-name)
const signinFields = await anonPage.evaluate(() =>
  [...document.querySelectorAll('input[type="email"], input[type="password"]')].map(el => ({
    id: el.id || el.name,
    labeled: !!(el.getAttribute('aria-label') || (el.id && [...document.querySelectorAll('label')].some(l => l.getAttribute('for') === el.id)) || el.getAttribute('aria-labelledby') || el.closest('label') || el.getAttribute('title')),
  })));
ok('signin: email+password nommés', signinFields.length >= 2 && signinFields.every(f => f.labeled), JSON.stringify(signinFields));

// Bouton de soumission : le texte blanc repose sur le fond brand du ::before
// (dégradé) — composite réel de la pile de couches, rgba<1 jamais opaque.
const btnContrast = await anonPage.evaluate(() => {
  const el = document.querySelector('.scaling-btn .gap-2') || document.querySelector('.scaling-btn');
  if (!el) return null;
  const parse = s => { const m = s.match(/rgba?\(([^)]+)\)/); return m ? m[1].split(',').map(Number) : null; };
  const fg = parse(getComputedStyle(el).color);
  let stack = [], gradientStops = null, node = el;
  const push = c => { if (c && (c[3] ?? 1) > 0) stack.push(c); };
  while (node && node !== document.documentElement) {
    for (const pe of ['::after', '::before']) {
      const pcs = getComputedStyle(node, pe);
      push(parse(pcs.backgroundColor));
      const pimg = pcs.backgroundImage;
      if (!gradientStops && pimg && pimg.includes('gradient')) {
        const cols = [...pimg.matchAll(/rgba?\([^)]+\)/g)].map(mm => parse(mm[0])).filter(x => x && (x[3] ?? 1) > 0);
        if (cols.length) gradientStops = cols;
      }
    }
    const cs = getComputedStyle(node);
    push(parse(cs.backgroundColor));
    const img = cs.backgroundImage;
    if (!gradientStops && img && img.includes('gradient')) {
      const cols = [...img.matchAll(/rgba?\([^)]+\)/g)].map(mm => parse(mm[0])).filter(x => x && (x[3] ?? 1) > 0);
      if (cols.length) gradientStops = cols;
    }
    node = node.parentElement;
  }
  stack.push([255, 255, 255, 1]);
  let eff = stack[0];
  for (let i = 1; i < stack.length; i++) { const a = eff[3] ?? 1, b = stack[i]; eff = [0, 1, 2].map(k => Math.round(eff[k] * a + b[k] * (b[3] ?? 1) * (1 - a))); eff[3] = 1; }
  return { fg, eff, gradientStops };
});
const btnRatios = btnContrast ? (btnContrast.gradientStops || [btnContrast.eff]).map(g => contrast(btnContrast.fg.slice(0, 3), g.slice(0, 3))) : [0];
const btnRatio = Math.min(...btnRatios);
ok('signin: contraste bouton >= 4.5 (mesuré, composite pseudo+dégradé)', btnRatio >= 4.5, `fg=${btnContrast?.fg} bg=${btnContrast ? (btnContrast.gradientStops || [btnContrast.eff]) : '?'} r=${btnRatio.toFixed(2)}`);

// Formulaire public partagé : champs nommés + landmarks
await anonPage.goto(`${base}/nc/form/${NC_SHARE_FORM}`, { waitUntil: 'domcontentloaded' });
await anonPage.waitForSelector('form, input, textarea, button[type="submit"]', { timeout: 20000 });
await anonPage.waitForTimeout(2000);
const formPub = await anonPage.evaluate(() => ({
  lang: document.documentElement.lang,
  mains: [...document.querySelectorAll('main, [role="main"]')].filter(m => m.offsetParent !== null).length,
  anonymousBtns: [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null && !(b.getAttribute('aria-label') || (b.textContent || '').trim() || b.getAttribute('aria-labelledby'))).length,
  imgsNoAlt: [...document.querySelectorAll('img')].filter(i => i.offsetParent !== null && !i.hasAttribute('alt')).length,
}));
ok('form public: <html lang>', !!formPub.lang, formPub.lang);
ok('form public: 1 main top-level', formPub.mains === 1, `${formPub.mains}`);
ok('form public: aucun bouton anonyme', formPub.anonymousBtns === 0, `${formPub.anonymousBtns}`);
ok('form public: toutes les images ont alt', formPub.imgsNoAlt === 0, `${formPub.imgsNoAlt}`);

// ════════════ AUTH ════════════
// — Grille : lang, h1, landmarks, boutons nommés
await page.goto(`${base}${GRID_URL}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('canvas, .nc-grid-wrapper, .nc-table-container', { timeout: 30000 });
await page.waitForTimeout(3000);
const grid = await page.evaluate(() => {
  const mains = [...document.querySelectorAll('main, [role="main"]')].filter(m => m.offsetParent !== null);
  return {
    lang: document.documentElement.lang,
    mains: mains.length,
    mainsNested: mains.filter(m => m.parentElement && m.parentElement.closest('main, [role="main"]') !== null).length,
    anonymousBtns: [...document.querySelectorAll('button')].filter(b => b.offsetParent !== null && !(b.getAttribute('aria-label') || (b.textContent || '').trim() || b.getAttribute('aria-labelledby') || b.getAttribute('title'))).length,
    imgsNoAlt: [...document.querySelectorAll('img')].filter(i => i.offsetParent !== null && !i.hasAttribute('alt')).length,
  };
});
ok('grid: <html lang>', !!grid.lang, grid.lang);
ok('grid: 1 main top-level sans imbrication', grid.mains === 1 && grid.mainsNested === 0, `mains=${grid.mains}`);
ok('grid: aucun bouton anonyme', grid.anonymousBtns === 0, `${grid.anonymousBtns}`);
ok('grid: toutes les images ont alt', grid.imgsNoAlt === 0, `${grid.imgsNoAlt}`);
const gridH1 = await h1Count();
ok('grid: exactement 1 h1 non vide (page-has-heading-one)', gridH1 === 1, `${gridH1}`);

// Contraste du token brand remappé : texte nc-content-brand sur fond de ligne active
const brandContrast = await page.evaluate(() => {
  const el = [...document.querySelectorAll('*')].find(e => /nc-content-brand/.test(e.className + '') && e.offsetParent !== null && (e.textContent || '').trim());
  if (!el) return null;
  const lum = (r, g, b) => { const c = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const parse = s => { const m = s.match(/rgba?\(([^)]+)\)/); return m ? m[1].split(',').map(Number) : null; };
  const fg = parse(getComputedStyle(el).color);
  let stack = [], node = el;
  while (node && node !== document.documentElement) {
    for (const pe of ['::after', '::before']) { const c = parse(getComputedStyle(node, pe).backgroundColor); if (c && (c[3] ?? 1) > 0) stack.push(c); }
    const c = parse(getComputedStyle(node).backgroundColor);
    if (c && (c[3] ?? 1) > 0) stack.push(c);
    node = node.parentElement;
  }
  stack.push([255, 255, 255, 1]);
  let eff = stack[0];
  for (let i = 1; i < stack.length; i++) { const a = eff[3] ?? 1, b = stack[i]; eff = [0, 1, 2].map(k => Math.round(eff[k] * a + b[k] * (b[3] ?? 1) * (1 - a))); eff[3] = 1; }
  const ratio = (f, b) => (Math.max(lum(...f), lum(...b)) + 0.05) / (Math.min(lum(...f), lum(...b)) + 0.05);
  return { fg: 'rgb(' + fg.slice(0, 3).join(',') + ')', eff: 'rgb(' + eff.slice(0, 3).join(',') + ')', r: ratio(fg, eff), text: (el.textContent || '').trim().slice(0, 40) };
});
ok('grid: texte nc-content-brand >= 4.5 composite (token remappé)', brandContrast && brandContrast.r >= 4.5, brandContrast ? `${brandContrast.fg}/${brandContrast.eff}=${brandContrast.r.toFixed(2)} "${brandContrast.text}"` : 'no el');

// — Modale Share : dialogue nommé (aria-dialog-name) + sentinelles non cachées-focusables
await page.locator('button:has-text("Share")').first().click();
await page.waitForSelector('.ant-modal-wrap.nc-modal-share-collaborate', { timeout: 15000 });
await page.waitForTimeout(800);
const shareModal = await page.evaluate(() => {
  const dlg = document.querySelector('[role="dialog"], .ant-modal');
  const labelledBy = dlg?.getAttribute('aria-labelledby');
  const name = dlg ? (dlg.getAttribute('aria-label') || (labelledBy && (document.getElementById(labelledBy)?.textContent || '').trim()) || (dlg.querySelector('.ant-modal-title')?.textContent || '').trim()) : null;
  const badSentinels = [...document.querySelectorAll('[aria-hidden="true"]')].filter(e => e.getAttribute('tabindex') === '0').length;
  return { name: name || null, badSentinels, role: dlg?.getAttribute('role') || '(implicit dialog)' };
});
ok('share-modal: dialogue nommé (aria-dialog-name)', !!shareModal.name, `${shareModal.name}`);
ok('share-modal: aucune sentinelle aria-hidden focusable', shareModal.badSentinels === 0, `${shareModal.badSentinels}`);
await page.keyboard.press('Escape');
await page.waitForTimeout(600);

// — Menu utilisateur : composition menu valide (aria-required-children / allowed-role)
await page.locator('[data-testid="nc-sidebar-userinfo"]').click();
await page.waitForSelector('.ant-dropdown:not(.ant-dropdown-hidden)', { timeout: 15000 });
await page.waitForTimeout(600);
const userMenu = await page.evaluate(() => {
  const dd = [...document.querySelectorAll('.ant-dropdown')].find(d => !d.className.includes('ant-dropdown-hidden'));
  const ul = dd?.querySelector('ul[role="menu"], ul.ant-dropdown-menu');
  if (!ul) return { found: false };
  const allowed = new Set(['menuitem', 'menuitemcheckbox', 'menuitemradio', 'group', 'none', 'separator', 'listitem']);
  const badChildren = [...ul.children].filter(c => {
    const r = c.getAttribute('role') || (c.tagName === 'LI' ? 'listitem' : '(implicit)');
    return !allowed.has(r);
  }).length;
  const focusableNone = [...ul.querySelectorAll('[role="none"], [role="presentation"]')]
    .filter(e => e.tabIndex >= 0 || e.matches('a[href], button, input, [tabindex]:not([tabindex="-1"])')).length;
  return {
    found: true,
    menuitems: ul.querySelectorAll('[role="menuitem"], a[role="menuitem"], li.ant-dropdown-menu-item').length,
    linkMenuitems: ul.querySelectorAll('a[role="menuitem"]').length,
    badChildren,
    focusableNone,
    emailLabelled: [...ul.querySelectorAll('a[role="menuitem"]')].some(a => (a.textContent || '').includes('@')),
  };
});
ok('user-menu: ul trouvé', userMenu.found);
ok('user-menu: enfants directs tous rôles autorisés (aria-required-children)', userMenu.badChildren === 0, `${userMenu.badChildren}`);
ok('user-menu: liens en vrais menuitem (a[role=menuitem] >= 1)', userMenu.linkMenuitems >= 1, `${userMenu.linkMenuitems}`);
ok('user-menu: aucun role=none focusable (presentation-role-conflict)', userMenu.focusableNone === 0, `${userMenu.focusableNone}`);
await page.keyboard.press('Escape');
await page.waitForTimeout(500);

// — Menu "New" : combo row = div présentationnel contenant de vrais menuitems
await page.goto(`${base}/${NC_WS}/${NC_BASE}`, { waitUntil: 'domcontentloaded' });
await page.locator('[data-testid="nc-home-create-new-btn"]').click();
await page.waitForSelector('.ant-dropdown:not(.ant-dropdown-hidden)', { timeout: 15000 });
await page.waitForTimeout(600);
const createMenu = await page.evaluate(() => {
  const dd = [...document.querySelectorAll('.ant-dropdown')].find(d => !d.className.includes('ant-dropdown-hidden'));
  const combo = dd?.querySelector('.nc-menu-item-combo');
  const ul = dd?.querySelector('ul');
  const allowed = new Set(['menuitem', 'menuitemcheckbox', 'menuitemradio', 'group', 'none', 'separator', 'listitem', 'menu']);
  const badChildren = ul ? [...ul.children].filter(c => {
    const r = c.getAttribute('role') || (c.tagName === 'LI' ? 'listitem' : '(implicit)');
    return !allowed.has(r);
  }).length : -1;
  const submenuTriggers = [...(dd?.querySelectorAll('[aria-controls]') || [])]
    .map(e => ({ id: e.getAttribute('aria-controls'), resolves: !!document.getElementById(e.getAttribute('aria-controls')), expanded: e.getAttribute('aria-expanded') }));
  return {
    found: !!dd,
    comboRole: combo?.getAttribute('role'),
    comboHasLi: !combo || combo.tagName !== 'LI',
    comboItem: !!combo?.querySelector('[role="menuitem"], li.ant-dropdown-menu-item'),
    badChildren,
    submenuTriggers,
  };
});
ok('create-new-menu: combo n\'est pas un menuitem imbriqué (div neutre)', createMenu.comboHasLi && (createMenu.comboRole === 'none' || createMenu.comboRole === null), `role=${createMenu.comboRole} tag=${createMenu.comboHasLi}`);
ok('create-new-menu: combo contient un vrai menuitem', createMenu.comboItem);
ok('create-new-menu: enfants de ul tous autorisés', createMenu.badChildren === 0, `${createMenu.badChildren}`);
ok('create-new-menu: aria-controls des sous-menus résolus ou absents-fermés', createMenu.submenuTriggers.every(t => t.resolves || t.expanded !== 'true'), JSON.stringify(createMenu.submenuTriggers));
await page.keyboard.press('Escape');

// — ?settings=members : table split header/body fusionnée sémantiquement + selects nommés + th non vide
await page.goto(`${base}/${NC_WS}/${NC_BASE}?settings=members`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.nc-table-header-table', { timeout: 20000 });
await page.waitForTimeout(2000);
const members = await page.evaluate(() => {
  const wrap = document.querySelector('.nc-table-wrapper');
  const headerT = document.querySelector('.nc-table-header-table');
  const emptyTh = [...document.querySelectorAll('.nc-table-header-table th')].filter(t => !(t.textContent || '').trim()).length;
  const selects = [...document.querySelectorAll('.ant-select input[role="combobox"], .ant-select-selection-search-input')]
    .filter(i => i.offsetParent !== null);
  const namedSelects = selects.filter(i => i.getAttribute('aria-label') || (i.getAttribute('aria-labelledby') && document.getElementById(i.getAttribute('aria-labelledby')))).length;
  return {
    wrapRole: wrap?.getAttribute('role'),
    headerRole: headerT?.getAttribute('role'),
    colHeaders: document.querySelectorAll('.nc-table-header-table [role="columnheader"], .nc-table-header-table th').length,
    bodyCells: document.querySelectorAll('.nc-table-wrapper [role="cell"], .nc-table-wrapper td').length,
    emptyTh,
    selects: selects.length,
    namedSelects,
  };
});
ok('members: split table fusionnée en role=table (th-has-data-cells)', members.wrapRole === 'table', `role=${members.wrapRole}`);
ok('members: header table = rowgroup', members.headerRole === 'rowgroup', `${members.headerRole}`);
ok('members: columnheaders présents et cells associées', members.colHeaders > 0 && members.bodyCells > 0, `ch=${members.colHeaders} cells=${members.bodyCells}`);
ok('members: aucun th vide (empty-table-header → srTitle)', members.emptyTh === 0, `${members.emptyTh}`);
ok('members: selects nommés (label / aria-input-field-name)', members.selects > 0 && members.namedSelects === members.selects, `${members.namedSelects}/${members.selects}`);

// — Feed : images alt + ordre des titres (demoteHeadingsToH3)
await page.goto(`${base}/${NC_WS}/feed`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.recent-card', { timeout: 20000 });
await page.waitForTimeout(2000);
const feed = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('.recent-card')];
  const badImgs = cards.flatMap(c => [...c.querySelectorAll('img')].filter(i => !i.hasAttribute('alt'))).length;
  // h1/h2 dans le contenu markdown injecté → tous demoted h3
  const badHeadings = cards.flatMap(c => [...c.querySelectorAll('.prose h1, .prose h2')]).length;
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
  let skip = false;
  for (let i = 1; i < headings.length; i++) if (headings[i] - headings[i - 1] > 1) skip = true;
  return { cards: cards.length, badImgs, badHeadings, skip };
});
ok('feed: cartes présentes', feed.cards > 0, `${feed.cards}`);
ok('feed: toutes les images ont alt (image-alt)', feed.badImgs === 0, `${feed.badImgs}`);
ok('feed: markdown sans h1/h2 (heading-order)', feed.badHeadings === 0, `${feed.badHeadings}`);
ok('feed: aucun saut de niveau de titre', !feed.skip);

// — Kanban : régions scrollables focusables (scrollable-region-focusable)
await page.goto(`${base}/${NC_WS}/${NC_BASE}/${NC_TABLE}/${NC_KANBAN}/items-kanban-items`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.nc-kanban-list, [data-stack-title]', { timeout: 25000 });
await page.waitForTimeout(2500);
const kanban = await page.evaluate(() => {
  const lists = [...document.querySelectorAll('.nc-kanban-list.overflow-y-auto, [data-stack-title]')];
  const scrollable = [...document.querySelectorAll('*')].filter(el => {
    const cs = getComputedStyle(el);
    return (cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 4;
  });
  const unfocusable = scrollable.filter(el => el.tabIndex < 0 && !el.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])')).length;
  return { lists: lists.length, scrollable: scrollable.length, unfocusable };
});
ok('kanban: régions scrollables présentes', kanban.scrollable > 0, `${kanban.scrollable}`);
ok('kanban: chaque région scrollable focusable ou contient du focusable', kanban.unfocusable === 0, `${kanban.unfocusable}`);

// — Vue formulaire : richtext role=textbox + aria-label, champ select valide
await page.goto(`${base}/${NC_WS}/${NC_BASE}/${NC_TABLE}/${NC_FORM}/items-formulaire-items`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('form, .nc-form, input', { timeout: 25000 });
await page.waitForTimeout(2500);
const formView = await page.evaluate(() => ({
  unlabeled: [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), textarea, [role="textbox"]:not(.ProseMirror [role="textbox"])')]
    .filter(el => el.offsetParent !== null)
    .filter(el => !(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || (el.id && [...document.querySelectorAll('label')].some(l => l.getAttribute('for') === el.id)) || el.closest('label') || el.getAttribute('title')))
    .map(el => el.id || el.name || el.type),
  h1: [...document.querySelectorAll('h1')].filter(h => (h.textContent || '').trim()).length,
}));
ok('form-view: 1 h1 non vide', formView.h1 === 1, `${formView.h1}`);
ok('form-view: aucun champ non nommé', formView.unlabeled.length === 0, JSON.stringify(formView.unlabeled));

// — Admin users-list : avatars alt + table fusionnée + h1
await page.goto(`${base}/admin/?tab=users-list`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.nc-table-header-table, table', { timeout: 20000 });
await page.waitForTimeout(2000);
const adminUsers = await page.evaluate(() => ({
  badImgs: [...document.querySelectorAll('img')].filter(i => i.offsetParent !== null && !i.hasAttribute('alt')).length,
  wrapRole: document.querySelector('.nc-table-wrapper')?.getAttribute('role'),
  h1: [...document.querySelectorAll('h1')].filter(h => (h.textContent || '').trim()).length,
}));
ok('admin-users: images alt', adminUsers.badImgs === 0, `${adminUsers.badImgs}`);
ok('admin-users: table fusionnée role=table', adminUsers.wrapRole === 'table', `${adminUsers.wrapRole}`);
ok('admin-users: 1 h1 non vide', adminUsers.h1 === 1, `${adminUsers.h1}`);

// — Account tokens : heading-order (h6 → niveau cohérent)
await page.goto(`${base}/account/tokens/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main, table, button', { timeout: 20000 });
await page.waitForTimeout(1500);
const tokens = await page.evaluate(() => {
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
  let skip = false;
  for (let i = 1; i < headings.length; i++) if (headings[i] - headings[i - 1] > 1) skip = true;
  return { h1: [...document.querySelectorAll('h1')].filter(h => (h.textContent || '').trim()).length, skip, headings: headings.slice(0, 12) };
});
ok('account-tokens: 1 h1 non vide', tokens.h1 === 1, `${tokens.h1}`);
ok('account-tokens: aucun saut de niveau', !tokens.skip, JSON.stringify(tokens.headings));

await browser.close();

const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} assertions PASS`);
if (failed.length) {
  console.log('ÉCHECS :');
  for (const f of failed) console.log('  -', f.name);
  process.exit(1);
}
