/**
 * verify.mjs — assertions DURES sur les corrections SearXNG (cycle 27).
 * Chaque assertion qui échoue → process.exit(1). Aucun self-verdict axe :
 * le score axe est produit par audit.mjs, pas ici.
 *
 * Usage: node verify.mjs <baseUrl>
 */
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const [base] = process.argv.slice(2);
if (!base) { console.error('usage: node verify.mjs <baseUrl>'); process.exit(2); }

const results = [];
const ok = (name, cond, extra = '') => {
  results.push({ name, pass: !!cond });
  if (!cond) console.error(`  FAIL ${name} ${extra}`);
  return cond;
};

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

// ── 1. Index : h1 présent dans l'arbre a11y (clippé, pas display:none) ─────
await page.goto(`${base}/`, { waitUntil: 'load' });
await page.waitForSelector('#q');
const home = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const cs = h1 ? getComputedStyle(h1) : null;
  return {
    h1Count: document.querySelectorAll('h1').length,
    h1Text: h1 ? h1.textContent.trim() : null,
    // clippé ≠ visibility:hidden — l'élément reste dans l'arbre a11y
    h1HiddenByVisibility: cs ? cs.visibility === 'hidden' : null,
    h1HasClientRects: h1 ? h1.getClientRects().length > 0 : null,
    qTabindex: document.getElementById('q')?.getAttribute('tabindex'),
    navLabel: document.getElementById('links_on_top')?.getAttribute('aria-label'),
    footerLinkUnderline: (() => {
      const a = document.querySelector('footer a');
      return a ? getComputedStyle(a).textDecorationLine : null;
    })(),
  };
});
ok('index: exactement 1 h1', home.h1Count === 1, String(home.h1Count));
ok('index: h1 nommé SearXNG', /searxng/i.test(home.h1Text || ''), String(home.h1Text));
ok('index: h1 pas masqué par visibility', home.h1HiddenByVisibility === false, String(home.h1HiddenByVisibility));
ok('index: #q sans tabindex positif', home.qTabindex === null, String(home.qTabindex));
ok('index: nav liens rapides nommée (aria-label)', !!home.navLabel, String(home.navLabel));
ok('index: lien footer souligné', /underline/.test(home.footerLinkUnderline || ''), String(home.footerLinkUnderline));

// ── 2. Preferences : structure tablist propre ──────────────────────────────
await page.goto(`${base}/preferences`, { waitUntil: 'load' });
await page.waitForSelector('#tab-general');
const prefs = await page.evaluate(() => {
  const tablists = [...document.querySelectorAll('.tabbar[role="tablist"]')];
  const main = tablists[0];
  const childrenRoles = main ? [...main.children].map(c => c.getAttribute('role')) : [];
  const tabs = main ? [...main.querySelectorAll('[role="tab"]')] : [];
  const panels = [...document.querySelectorAll('.tabs > section[role="tabpanel"]')];
  const ctrlOk = tabs.every(t => {
    const id = t.getAttribute('aria-controls');
    return id && document.getElementById(id) !== null;
  });
  const idsWithSpace = tabs.filter(t => /\s/.test(t.id) || /\s/.test(t.getAttribute('aria-controls') || '')).map(t => t.id);
  const hiddenPanels = panels.filter(s => s.hasAttribute('hidden')).length;
  const selected = tabs.filter(t => t.getAttribute('aria-selected') === 'true');
  return {
    tablistCount: tablists.length,
    childrenRoles: [...new Set(childrenRoles)],
    tabCount: tabs.length,
    ctrlOk,
    idsWithSpace,
    hiddenPanels,
    panelCount: panels.length,
    selectedCount: selected.length,
    selectedId: selected[0]?.id,
    rovingOk: tabs.every(t => (t.getAttribute('aria-selected') === 'true' ? t.tabIndex === 0 : t.tabIndex === -1)),
    panelLabelledbyOk: panels.every(s => document.getElementById(s.getAttribute('aria-labelledby') || '') !== null),
  };
});
ok('prefs: 2 tablists (sections + catégories moteurs)', prefs.tablistCount === 2, String(prefs.tablistCount));
ok('prefs: tablist ne contient que des role=tab', prefs.childrenRoles.length === 1 && prefs.childrenRoles[0] === 'tab', JSON.stringify(prefs.childrenRoles));
ok('prefs: 6 onglets principaux', prefs.tabCount === 6, String(prefs.tabCount));
ok('prefs: aria-controls → id existant pour tous les onglets', prefs.ctrlOk);
ok('prefs: aucun id avec espace (social_media slugifié)', prefs.idsWithSpace.length === 0, prefs.idsWithSpace.join(','));
// 17 panels au total (6 sections + 11 catégories moteurs) — visibles =
// l'onglet actif de chaque niveau (general + category_general)
ok('prefs: seuls les panels actifs sont visibles (15 hidden/17)', prefs.hiddenPanels === prefs.panelCount - 2, `${prefs.hiddenPanels}/${prefs.panelCount}`);
ok('prefs: exactement 1 onglet sélectionné', prefs.selectedCount === 1 && prefs.selectedId === 'tab-general', String(prefs.selectedId));
ok('prefs: roving tabindex initial correct', prefs.rovingOk);
ok('prefs: aria-labelledby des panels résout', prefs.panelLabelledbyOk);

// ── 3. Tab clavier : ArrowRight active l'onglet suivant ────────────────────
await page.focus('#tab-general');
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(300);
const afterArrow = await page.evaluate(() => ({
  active: document.activeElement?.id,
  sel: document.getElementById('tab-ui')?.getAttribute('aria-selected'),
  panelHidden: document.getElementById('tab-content-ui')?.hidden,
  generalHidden: document.getElementById('tab-content-general')?.hidden,
}));
ok('tablist: ArrowRight déplace le focus sur tab-ui', afterArrow.active === 'tab-ui', String(afterArrow.active));
ok('tablist: aria-selected bascule sur tab-ui', afterArrow.sel === 'true', String(afterArrow.sel));
ok('tablist: panel ui dévoilé, general masqué', afterArrow.panelHidden === false && afterArrow.generalHidden === true, JSON.stringify(afterArrow));

// ── 4. Onglet Engines : table moteurs, checkboxes nommées, th non vides ────
await page.click('#tab-engines');
await page.waitForSelector('#tab-content-engines:not([hidden])');
await page.click('#tab-category_general');
await page.waitForSelector('#tab-content-category_general:not([hidden])');
const engines = await page.evaluate(() => {
  const panel = document.getElementById('tab-content-category_general');
  const disabledBoxes = [...panel.querySelectorAll('input[type="checkbox"][disabled]')];
  const unnamed = disabledBoxes.filter(c => !(c.getAttribute('aria-label') || '').trim());
  const emptyTh = [...panel.querySelectorAll('th')].filter(th => !th.textContent.trim());
  const onoff = [...panel.querySelectorAll('input.checkbox-onoff[type="checkbox"]')];
  const onoffLabelled = onoff.filter(c => {
    const id = c.id;
    return id && panel.querySelector(`label[for="${id}"]`) !== null;
  });
  return { disabledCount: disabledBoxes.length, unnamedCount: unnamed.length, emptyThCount: emptyTh.length, onoffCount: onoff.length, onoffLabelled: onoffLabelled.length };
});
ok('engines: indicateurs disabled présents (>100)', engines.disabledCount > 100, String(engines.disabledCount));
ok('engines: tous les indicateurs ont un aria-label', engines.unnamedCount === 0, `${engines.unnamedCount} sans nom`);
ok('engines: aucun th vide', engines.emptyThCount === 0, String(engines.emptyThCount));
ok('engines: toggles moteur ont label[for] résoluble', engines.onoffCount > 0 && engines.onoffLabelled === engines.onoffCount, `${engines.onoffLabelled}/${engines.onoffCount}`);

// ── 5. Résultats : landmarks, titres h2, liens nommés, pagination ──────────
await page.goto(`${base}/search?q=test`, { waitUntil: 'load' });
await page.waitForSelector('#urls article h2, #urls article', { timeout: 20000 });
const resultsPage = await page.evaluate(() => {
  const mains = [...document.querySelectorAll('main, [role="main"]')];
  const nestedMain = document.querySelector('main main, main [role="main"]');
  const h1 = document.querySelector('#urls h1');
  const firstTitleTag = document.querySelector('article .result_inner > *:is(h2,h3)')?.tagName;
  const thumbs = [...document.querySelectorAll('a.thumbnail_link')];
  const unnamedThumbs = thumbs.filter(a => !(a.getAttribute('aria-label') || '').trim());
  const roleLinks = document.querySelectorAll('[role="link"]').length;
  const navs = [...document.querySelectorAll('nav')].map(n => ({ id: n.id, label: n.getAttribute('aria-label') }));
  const pageCurrent = document.querySelector('.page_number_current');
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.offsetParent !== null || h.getClientRects().length > 0);
  let skip = null, prev = 0;
  for (const h of heads) {
    const lvl = parseInt(h.tagName.slice(1), 10);
    if (prev && lvl > prev + 1) { skip = `${h.tagName}`; break; }
    prev = lvl;
  }
  return {
    mainCount: mains.length,
    nestedMain: !!nestedMain,
    h1Text: h1 ? h1.textContent.trim() : null,
    firstTitleTag,
    thumbCount: thumbs.length,
    unnamedThumbs: unnamedThumbs.length,
    roleLinks,
    navs,
    pageCurrentTag: pageCurrent?.tagName,
    pageCurrentAria: pageCurrent?.getAttribute('aria-current'),
    headSkip: skip,
    headsSeen: heads.length,
  };
});
ok('results: exactement 1 landmark main, top-level', resultsPage.mainCount === 1 && !resultsPage.nestedMain, `${resultsPage.mainCount} mains`);
ok('results: h1 "Search results" présent (sr-only)', !!resultsPage.h1Text, String(resultsPage.h1Text));
ok('results: titres de résultats en h2', resultsPage.firstTitleTag === 'H2', String(resultsPage.firstTitleTag));
ok('results: liens thumbnail nommés', resultsPage.thumbCount > 0 && resultsPage.unnamedThumbs === 0, `${resultsPage.unnamedThumbs}/${resultsPage.thumbCount}`);
ok('results: aucun role=link résiduel', resultsPage.roleLinks === 0, String(resultsPage.roleLinks));
ok('results: navs nommées (aria-label)', resultsPage.navs.length > 0 && resultsPage.navs.every(n => !!n.label), JSON.stringify(resultsPage.navs));
ok('results: page courante = span aria-current=page', resultsPage.pageCurrentTag === 'SPAN' && resultsPage.pageCurrentAria === 'page', `${resultsPage.pageCurrentTag} ${resultsPage.pageCurrentAria}`);
ok('results: pas de saut de niveau de titre', resultsPage.headSkip === null && resultsPage.headsSeen > 0, `skip=${resultsPage.headSkip}`);

// ── 6. Vidéos : métadonnées contrastées ────────────────────────────────────
await page.goto(`${base}/search?q=test&categories=videos`, { waitUntil: 'load' });
await page.waitForSelector('article', { timeout: 20000 });
const videoMeta = await page.evaluate(() => {
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const meta = document.querySelector('.result-videos .result_author, .result-videos time, article .result_inner .result_author, article .result_inner time');
  if (!meta) return { found: false };
  const fg = parse(getComputedStyle(meta).color);
  let node = meta, bg = null;
  while (node && bg === null) {
    const c = parse(getComputedStyle(node).backgroundColor);
    if (c && c.a === 1) bg = c;
    node = node.parentElement;
  }
  if (!bg) bg = { r: 255, g: 255, b: 255 };
  return { found: true, fg: getComputedStyle(meta).color, bg, ratio: +ratio(lum(fg), lum(bg)).toFixed(2) };
});
ok('videos: métadonnée présente', videoMeta.found);
ok('videos: contraste métadonnées ≥ 4.5', videoMeta.found && videoMeta.ratio >= 4.5, `ratio=${videoMeta.ratio} fg=${videoMeta.fg}`);

// ── 7. Page 404 : h1 + landmark (axe ne peut pas la scanner, HTTP 404) ─────
await page.goto(`${base}/no-such-page-xyz`, { waitUntil: 'load' });
const notFound = await page.evaluate(() => ({
  h1: document.querySelectorAll('h1').length,
  h1Text: document.querySelector('h1')?.textContent.trim(),
  main: document.querySelectorAll('main').length,
}));
ok('404: h1 présent', notFound.h1 === 1, String(notFound.h1Text));
ok('404: landmark main présent', notFound.main === 1, String(notFound.main));

// ── 8. #clear_search : cible ≥ 24px ────────────────────────────────────────
await page.goto(`${base}/`, { waitUntil: 'load' });
const clearBtn = await page.evaluate(() => {
  const r = document.getElementById('clear_search').getBoundingClientRect();
  return { w: r.width, h: r.height };
});
ok('index: #clear_search ≥ 24×24 px', clearBtn.w >= 24 && clearBtn.h >= 24, `${clearBtn.w}x${clearBtn.h}`);

await browser.close();
const fails = results.filter(r => !r.pass).length;
console.log(`verify: ${results.length - fails}/${results.length} assertions OK`);
process.exit(fails ? 1 : 0);
