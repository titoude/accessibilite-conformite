/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Rejoué depuis un ÉTAT FROID : navigateur neuf, storage-state rechargé,
 * aucune hypothèse sur l'ordre des scans. Couvre des aspects que le
 * développement n'a pas testés — si l'un échoue, c'est un finding
 * légitime à consolider (FAIL), pas un bug du harnais.
 *
 * Usage: node eval-final.mjs <baseUrl> <auth.json>
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

// IDs propres à chaque instance — surchargeables via env (mêmes noms que audit.mjs)
// pour rejouer verbatim sur un clone frais : NC_WS/NC_BASE/NC_TABLE/NC_GRID/NC_FORM/NC_SHARE_FORM
const NC_WS = process.env.NC_WS || 'wd10yk1f';
const NC_BASE = process.env.NC_BASE || 'pkg7xkxnvm4oc5w';
const NC_TABLE = process.env.NC_TABLE || 'm9aiffs89yv1o74';
const NC_GRID = process.env.NC_GRID || 'vwsla3dxylant2l6';
const NC_FORM = process.env.NC_FORM || 'vwr3k2vkep40846h';
const NC_SHARE_FORM = process.env.NC_SHARE_FORM || '540b143b-6850-4097-9cc3-b791065ead09';
const GRID_URL = `/${NC_WS}/${NC_BASE}/${NC_TABLE}/${NC_GRID}/items-items`;

const browser = await chromium.launch();
const anonPage = await (await browser.newContext()).newPage();
anonPage.setDefaultTimeout(20000);
const page = await (await browser.newContext(state ? { storageState: state } : {})).newPage();
page.setDefaultTimeout(20000);

// ── A. Métadonnées document : lang + title non vides ───────────────────────
await anonPage.goto(`${base}/signin/`, { waitUntil: 'domcontentloaded' });
await anonPage.waitForSelector('input[type="email"]');
const meta = await anonPage.evaluate(() => ({
  lang: document.documentElement.getAttribute('lang'),
  title: document.title,
}));
ok('A. document public: <html lang> présent', !!meta.lang, String(meta.lang));
ok('A. document public: <title> non vide', !!meta.title.trim(), meta.title);

// ── B. Identifiants dupliqués sur les routes auth du scope ─────────────────
const dupRoutes = [
  `/${NC_WS}/${NC_BASE}`,
  `/${NC_WS}/feed`,
  GRID_URL,
  `/${NC_WS}/${NC_BASE}?settings=members`,
  '/account/', '/account/tokens/', '/admin/?tab=users-list',
];
for (const r of dupRoutes) {
  await page.goto(`${base}${r}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main, table, canvas, form', { timeout: 30000 });
  await page.waitForTimeout(1500);
  // Garde d'URL finale : les assertions de structure ne valent que sur le
  // document demandé. Une page redirigée (gate onboarding, route renommée)
  // doit FAIL — jamais PASS parce que le document de repli est propre.
  if (new URL(page.url()).pathname !== new URL(`${base}${r}`).pathname) {
    ok(`B. ${r.slice(0, 60)}: aucun id dupliqué`, false, `page redirigée vers ${page.url()}`);
    continue;
  }
  const dups = await page.evaluate(() => {
    const all = [...document.querySelectorAll('[id]')].map(e => e.id).filter(Boolean);
    return [...new Set(all.filter((v, i) => all.indexOf(v) !== i))];
  });
  ok(`B. ${r.slice(0, 60)}: aucun id dupliqué`, dups.length === 0, dups.slice(0, 4).join(','));
}

// ── C. Ordre des titres : jamais de saut h1→h3+ sur les routes auth ────────
for (const r of dupRoutes) {
  await page.goto(`${base}${r}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main, table, canvas, form', { timeout: 30000 });
  await page.waitForTimeout(1200);
  // Même garde d'URL finale que la section B : FAIL explicite si le
  // document livré n'est pas celui demandé, jamais un PASS vacu.
  if (new URL(page.url()).pathname !== new URL(`${base}${r}`).pathname) {
    ok(`C. ${r.slice(0, 60)}: pas de saut de niveau de titre`, false, `page redirigée vers ${page.url()}`);
    continue;
  }
  const skip = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.offsetParent !== null);
    let prev = 0, bad = null;
    for (const h of hs) {
      const l = +h.tagName[1];
      if (l > prev + 1 && prev !== 0) bad = `h${prev}->h${l} sur "${(h.textContent || '').trim().slice(0, 30)}"`;
      prev = l;
    }
    return bad;
  });
  ok(`C. ${r.slice(0, 60)}: pas de saut de niveau de titre`, !skip, String(skip));
}

// ── D. Modale Share : focus dans le dialog + Escape ferme ──────────────────
await page.goto(`${base}${GRID_URL}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('canvas', { state: 'attached', timeout: 30000 });
await page.waitForTimeout(3000);
await page.locator('button:has-text("Share")').first().click();
await page.waitForSelector('.ant-modal-wrap.nc-modal-share-collaborate', { timeout: 15000 });
await page.waitForTimeout(800);
const focusIn = await page.evaluate(() => {
  const m = document.querySelector('.ant-modal-wrap.nc-modal-share-collaborate');
  return m && m.contains(document.activeElement);
});
ok('D. share-modal: focus déplacé dans le dialog', !!focusIn,
  String(await page.evaluate(() => document.activeElement?.tagName + '.' + (document.activeElement?.className + '').slice(0, 40))));
await page.keyboard.press('Escape');
await page.waitForTimeout(800);
const closed = await page.evaluate(() => {
  const m = document.querySelector('.ant-modal-wrap.nc-modal-share-collaborate');
  return !m || m.offsetParent === null || getComputedStyle(m).display === 'none';
});
ok('D. share-modal: Escape ferme la modale', closed);
if (!closed) await page.locator('.ant-modal-close, .nc-modal-close').first().click().catch(() => {});

// ── E. aria-expanded bascule sur un déclencheur de dropdown ────────────────
await page.goto(`${base}${GRID_URL}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('canvas', { state: 'attached', timeout: 30000 });
await page.waitForTimeout(3000);
const exp = await page.evaluate(async () => {
  const t = document.querySelector('[data-testid="nc-sidebar-userinfo"]');
  if (!t) return { found: false };
  const before = t.getAttribute('aria-expanded');
  t.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await new Promise(r => setTimeout(r, 900));
  return { found: true, before, after: t.getAttribute('aria-expanded') };
});
ok('E. user-menu: aria-expanded bascule avec l\'ouverture', exp.found && exp.after === 'true', JSON.stringify(exp));
await page.keyboard.press('Escape');
await page.waitForTimeout(500);

// ── F. Navigation clavier : Tab atteint un élément interactif ──────────────
await page.evaluate(() => document.activeElement?.blur?.());
await page.keyboard.press('Tab');
await page.waitForTimeout(400);
const tabOk = await page.evaluate(() => {
  const el = document.activeElement;
  return el && el !== document.body && /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName) || (el && el.getAttribute('tabindex') === '0');
});
ok('F. clavier: Tab focalise un élément interactif', !!tabOk,
  String(await page.evaluate(() => document.activeElement?.tagName + '.' + (document.activeElement?.className + '').slice(0, 40))));

// ── G. Thème sombre : contraste du texte courant encore >= 4.5 ─────────────
await page.evaluate(() => localStorage.setItem('nc-theme', 'dark'));
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('canvas', { state: 'attached', timeout: 30000 });
await page.waitForSelector('html.dark', { state: 'attached', timeout: 15000 });
await page.waitForTimeout(4000);
const dark = await page.evaluate(() => {
  const parse = s => { const m = s.match(/rgba?\(([^)]+)\)/); return m ? m[1].split(',').map(Number) : null; };
  // échantillon déterministe : titres des noeuds de sidebar (visibles)
  const targets = [...document.querySelectorAll('.nc-sidebar-node-title')]
    .filter(e => e.offsetParent !== null && (e.textContent || '').trim()).slice(0, 5);
  return targets.map(el => {
    const fg = parse(getComputedStyle(el).color);
    let stack = [], node = el;
    while (node && node !== document.documentElement) {
      // Pseudo-couches : seulement sur la cible (un ::before d'ancêtre peut
      // rapporter un bg sans être la couche peinte sous le texte). Exiger un
      // pseudo réellement rendu (content + boîte non nulle).
      if (node === el) {
        for (const pe of ['::after', '::before']) {
          const ps = getComputedStyle(node, pe);
          const c = parse(ps.backgroundColor);
          if (c && (c[3] ?? 1) > 0 && ps.content !== 'none' && ps.display !== 'none' && parseFloat(ps.width) > 0 && parseFloat(ps.height) > 0) stack.push(c);
        }
      }
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c && (c[3] ?? 1) > 0) stack.push(c);
      node = node.parentElement;
    }
    stack.push([20, 20, 26, 1]); // fallback sombre si rien d'opaque trouvé
    let eff = stack[0];
    for (let i = 1; i < stack.length; i++) { const a = eff[3] ?? 1, b = stack[i]; eff = [0, 1, 2].map(k => Math.round(eff[k] * a + b[k] * (b[3] ?? 1) * (1 - a))); eff[3] = 1; }
    return { fg, eff, text: (el.textContent || '').trim().slice(0, 30) };
  });
});
const darkResults = dark.map(d => ({ ...d, r: d.fg ? contrast(d.fg.slice(0, 3), d.eff.slice(0, 3)) : 0 }));
ok('G. dark: échantillons de texte >= 4.5 composite', darkResults.length > 0 && darkResults.every(d => d.r >= 4.5), darkResults.map(d => `${d.r.toFixed(2)} fg=${JSON.stringify(d.fg)} bg=${JSON.stringify(d.eff)} "${d.text}"`).join(' | '));
await page.evaluate(() => localStorage.removeItem('nc-theme'));
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('canvas', { state: 'attached', timeout: 30000 });
await page.waitForTimeout(3000);

// ── H. Reflow mobile 390px : pas de débordement horizontal documentaire ────
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}${GRID_URL}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('canvas', { state: 'attached', timeout: 30000 });
await page.waitForTimeout(3500);
const reflow = await page.evaluate(() => {
  // La grille est canvas-scrollable by design : on mesure le chrome hors canvas
  const wide = [];
  for (const el of document.querySelectorAll('.ant-layout-header, .nc-navbar, .nc-sidebar, header, [role="banner"], .nc-breadcrumb')) {
    if (el && el.scrollWidth > 392 && el.offsetParent !== null) wide.push(el.tagName + '.' + String(el.className).slice(0, 40));
  }
  return { wide, docW: document.documentElement.clientWidth };
});
ok('H. reflow 390px: chrome sans débordement', reflow.wide.length === 0, reflow.wide.join(' | '));
await page.setViewportSize({ width: 1280, height: 800 });

// ── I. Select ouvert : aria-controls/owns du combobox se résout ────────────
await page.goto(`${base}/${NC_WS}/${NC_BASE}?settings=members`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.ant-select', { timeout: 20000 });
await page.waitForTimeout(1500);
const sel = await page.evaluate(async () => {
  const sel = document.querySelector('.ant-select-selector, .ant-select-selection-search');
  if (!sel) return { found: false };
  sel.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  await new Promise(r => setTimeout(r, 900));
  const input = document.querySelector('.ant-select input[role="combobox"], .ant-select-selection-search-input');
  if (!input) return { found: false, noInput: true };
  const attrs = {};
  for (const a of ['aria-controls', 'aria-owns', 'aria-expanded']) attrs[a] = input.getAttribute(a);
  const ref = attrs['aria-controls'] || attrs['aria-owns'];
  return { found: true, attrs, resolves: ref ? !!document.getElementById(ref) : null };
});
ok('I. select: combobox expanded + id de liste résolu à l\'ouverture', sel.found && sel.attrs['aria-expanded'] === 'true' && (sel.resolves === true || sel.resolves === null), JSON.stringify(sel.attrs) + ` resolves=${sel.resolves}`);
await page.keyboard.press('Escape');

// ── J. Table split : role=table contient rowgroups + columnheaders + cells ──
await page.waitForSelector('.nc-table-wrapper', { timeout: 15000 });
const tableStruct = await page.evaluate(() => {
  const w = document.querySelector('.nc-table-wrapper');
  return {
    role: w?.getAttribute('role'),
    rowgroups: w?.querySelectorAll('[role="rowgroup"]').length ?? 0,
    colheaders: w?.querySelectorAll('[role="columnheader"]').length ?? 0,
    rows: w?.querySelectorAll('[role="row"]').length ?? 0,
    cells: w?.querySelectorAll('[role="cell"]').length ?? 0,
  };
});
ok('J. table: role=table avec rowgroups', tableStruct.role === 'table' && tableStruct.rowgroups >= 2, JSON.stringify(tableStruct));
ok('J. table: columnheaders > 0 et cells > 0', tableStruct.colheaders > 0 && tableStruct.cells > 0, JSON.stringify(tableStruct));

// ── K. Formulaire partagé public : soumission laisse une confirmation ───────
await anonPage.goto(`${base}/nc/form/${NC_SHARE_FORM}`, { waitUntil: 'domcontentloaded' });
await anonPage.waitForSelector('form, input, textarea', { timeout: 20000 });
await anonPage.waitForTimeout(1500);
const submitFlow = await anonPage.evaluate(async () => {
  const field = document.querySelector('input[type="text"], textarea');
  if (field) { field.focus(); field.value = 'a11y eval'; field.dispatchEvent(new Event('input', { bubbles: true })); }
  return { fieldFound: !!field };
});
await anonPage.locator('button:has-text("Submit"), button[type="submit"]').first().click();
await anonPage.waitForSelector('text=Successfully submitted', { timeout: 15000 }).catch(() => {});
const confirmOk = await anonPage.evaluate(() => {
  const statusish = document.querySelector('[role="status"], [role="alert"], .nc-shared-form-success, .ant-result');
  return {
    submitted: /Successfully submitted/i.test(document.body.innerText),
    statusRole: statusish ? statusish.getAttribute('role') || statusish.className : null,
  };
});
ok('K. shared-form: soumission confirmée (effet métier mesuré)', confirmOk.submitted, `status=${confirmOk.statusRole}`);

await browser.close();

const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} assertions PASS`);
if (failed.length) {
  console.log('ÉCHECS :');
  for (const f of failed) console.log('  -', f.name);
  process.exit(1);
}
