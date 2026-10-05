/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Couvre des aspects que le développement n'a pas testés ; si l'un échoue,
 * c'est un finding légitime à consolider (FAIL), pas un bug du harnais.
 *
 * Usage: node eval-final.mjs <baseUrl>
 */
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const [base] = process.argv.slice(2);
if (!base) { console.error('usage: node eval-final.mjs <baseUrl>'); process.exit(2); }

const results = [];
const ok = (name, cond, extra = '') => {
  results.push({ name, pass: !!cond });
  if (!cond) console.error(`  FAIL ${name} ${extra}`);
  return cond;
};

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

// ── A. Pas de piège clavier sur l'accueil (25 Tab sans boucle) ─────────────
await page.goto(`${base}/`, { waitUntil: 'load' });
await page.waitForSelector('#q');
await page.locator('body').click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(300);
const trail = [];
for (let i = 0; i < 25; i++) {
  await page.keyboard.press('Tab');
  await page.waitForTimeout(120);
  trail.push(await page.evaluate(() => (document.activeElement ? (document.activeElement.id || document.activeElement.tagName + '.' + String(document.activeElement.className).split(' ')[0]) : 'none')));
}
const uniq = new Set(trail).size;
ok('clavier: le focus progresse sur >= 5 éléments distincts (pas de piège)', uniq >= 5, `${uniq} éléments: ${trail.slice(0, 12).join('>')}`);
ok('clavier: le champ de recherche est atteignable au Tab', trail.includes('q'), trail.join('>'));

// ── B. Indicateur de focus visible (clavier) ───────────────────────────────
await page.locator('#q').focus();
await page.waitForTimeout(200);
const focusInfo = await page.evaluate(() => {
  const el = document.activeElement;
  const cs = getComputedStyle(el);
  return { id: el.id, outline: cs.outlineStyle + ' ' + cs.outlineWidth, shadow: cs.boxShadow };
});
ok('focus: #q a un indicateur visuel au focus clavier', focusInfo.outline !== 'none 0px' || focusInfo.shadow !== 'none', JSON.stringify(focusInfo));

// ── C. Recherche soumise au clavier (Enter dans #q → page résultats) ────────
await page.fill('#q', 'test');
await page.keyboard.press('Enter');
await page.waitForURL(/\/search\?q=/, { timeout: 20000 });
await page.waitForSelector('#urls article', { timeout: 20000 });
ok('clavier: Enter dans #q soumet la recherche et affiche des résultats', (await page.$$('#urls article')).length > 0, `url=${page.url()}`);

// ── D. Autocomplete : navigable au clavier ─────────────────────────────────
await page.goto(`${base}/`, { waitUntil: 'load' });
await page.fill('#q', 'test');
const acVisible = await page.waitForSelector('.autocomplete.open li', { timeout: 12000 }).then(() => true).catch(() => false);
if (acVisible) {
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(300);
  const ac = await page.evaluate(() => ({
    activeLi: !!document.querySelector('.autocomplete li.active'),
    qValue: document.getElementById('q').value,
  }));
  ok('autocomplete: ArrowDown sélectionne un item', ac.activeLi, JSON.stringify(ac));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const closed = await page.evaluate(() => !document.querySelector('.autocomplete.open'));
  ok('autocomplete: Escape ferme la liste', closed);
} else {
  ok('autocomplete: liste ouverte', false, 'upstream autocomplete injoignable — dépend du réseau');
}

// ── E. Preferences sans JS : tous les panels restent accessibles ───────────
{
  const ctxNoJs = await browser.newContext({ javaScriptEnabled: false });
  const p2 = await ctxNoJs.newPage();
  await p2.goto(`${base}/preferences`, { waitUntil: 'load' });
  const nojs = await p2.evaluate(() => {
    const panels = [...document.querySelectorAll('#search_form > .tabs > section')];
    const visible = panels.filter(s => s.offsetParent !== null).length;
    const inputs = document.querySelectorAll('#search_form input, #search_form select').length;
    return { panels: panels.length, visible, inputs };
  });
  ok('no-js: les 6 panels de préférences sont visibles', nojs.panels === 6 && nojs.visible === 6, JSON.stringify(nojs));
  ok('no-js: les contrôles du formulaire sont présents', nojs.inputs > 20, String(nojs.inputs));
  await ctxNoJs.close();
}

// ── F. Dark theme : métadonnées résultat contrastées ───────────────────────
await ctx.addCookies([
  { name: 'theme', value: 'simple', url: base },
  { name: 'simple_style', value: 'dark', url: base },
]);
await page.goto(`${base}/search?q=test&categories=videos`, { waitUntil: 'load' });
await page.waitForSelector('article', { timeout: 20000 });
const darkMeta = await page.evaluate(() => {
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const dark = document.documentElement.classList.contains('theme-dark');
  const meta = document.querySelector('article .result_inner time, article .result_inner .result_author, article .result_inner .result_views, article .result_inner .result_length');
  if (!meta) return { found: false, dark };
  const fg = parse(getComputedStyle(meta).color);
  let node = meta, bg = null;
  while (node && bg === null) {
    const c = parse(getComputedStyle(node).backgroundColor);
    if (c && c.a === 1) bg = c;
    node = node.parentElement;
  }
  if (!bg) bg = { r: 34, g: 36, b: 40 }; // --color-base-background dark
  return { found: true, dark, fg: getComputedStyle(meta).color, bg, ratio: +ratio(lum(fg), lum(bg)).toFixed(2) };
});
ok('dark: le thème sombre est actif', darkMeta.dark === true, String(darkMeta.dark));
ok('dark: métadonnée trouvée sur page vidéos', darkMeta.found);
ok('dark: contraste métadonnées ≥ 4.5', darkMeta.found && darkMeta.ratio >= 4.5, `ratio=${darkMeta.ratio} fg=${darkMeta.fg}`);

// ── G. Mobile : les liens rapides gardent un nom accessible ────────────────
await page.context().clearCookies();
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: 'load' });
const mobile = await page.evaluate(() => {
  const links = [...document.querySelectorAll('#links_on_top a')];
  return links.map(a => ({
    cls: a.className,
    label: a.getAttribute('aria-label'),
    spanHidden: (() => { const s = a.querySelector('span'); return s ? getComputedStyle(s).display === 'none' || !s.offsetParent : true; })(),
  }));
});
ok('mobile: liens rapides présents', mobile.length > 0, JSON.stringify(mobile));
ok('mobile: chaque lien a un aria-label (span masqué en mobile)', mobile.every(l => (l.label || '').trim().length > 0), JSON.stringify(mobile));
await page.setViewportSize({ width: 1280, height: 800 });

// ── H. Résultats image : légende texte sur fond lisible ────────────────────
await page.goto(`${base}/search?q=test&categories=images`, { waitUntil: 'load' });
await page.waitForSelector('article.result-images', { timeout: 20000 });
const caption = await page.evaluate(() => {
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const t = document.querySelector('article.result-images .title');
  const pill = document.querySelector('article.result-images .image_resolution');
  const out = { titleFound: !!t, pillFound: !!pill };
  if (t) {
    // la légende est peinte sous l'image, sur le fond de page
    const r = t.getBoundingClientRect();
    const img = t.closest('a')?.querySelector('img')?.getBoundingClientRect();
    const fg = parse(getComputedStyle(t).color);
    out.titleBelowImage = img ? r.top >= img.bottom - 1 : null;
    out.titleFg = getComputedStyle(t).color;
    out.titleVsWhite = +ratio(lum(fg), lum({ r: 255, g: 255, b: 255 })).toFixed(2);
  }
  if (pill) {
    const fg = parse(getComputedStyle(pill).color);
    const bgc = parse(getComputedStyle(pill).backgroundColor);
    // pire cas : image blanche sous la pastille semi-transparente
    const comp = { r: bgc.a * bgc.r + (1 - bgc.a) * 255, g: bgc.a * bgc.g + (1 - bgc.a) * 255, b: bgc.a * bgc.b + (1 - bgc.a) * 255 };
    out.pillWorstVsWhite = +ratio(lum(fg), lum(comp)).toFixed(2);
  }
  return out;
});
ok('images: légende sous l\'image (pas sur l\'image)', caption.titleFound && caption.titleBelowImage === true, JSON.stringify(caption));
ok('images: pastille résolution ≥ 4.5 même sur image blanche', caption.pillFound && caption.pillWorstVsWhite >= 4.5, `worst=${caption.pillWorstVsWhite}`);

await browser.close();
const fails = results.filter(r => !r.pass).length;
console.log(`eval-final: ${results.length - fails}/${results.length} assertions OK`);
process.exit(fails ? 1 : 0);
