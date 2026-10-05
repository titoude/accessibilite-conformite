// Sondes manuelles pour les résultats "incomplets" d'axe (cycle 27, searxng).
// Deux familles :
//  1. color-contrast — axe ne conclut pas quand le fond contient une image
//     (vignettes de résultats image) ou un fond natif détourné (<select> avec
//     flèche SVG en background-image). On recalcule le ratio WCAG 2.x à la
//     main : fg = computed color ; bg = première couche opaque en remontant
//     les ancêtres (compositing alpha pour les couches rgba).
//  2. th-has-data-cells — axe marque incomplet quand une colonne n'a pas de
//     <td> renseignés ; on énumère les colonnes et on explique pourquoi
//     (colonnes d'indicateurs checkbox, métriques vides sur instance fraîche,
//     colonne de row-headers).
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://localhost:8888';

function parse(c) {
  const m = (c || '').match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(',').map(x => parseFloat(x.trim()));
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
}
const lum = c => {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

const b = await chromium.launch();
const out = [];

// ── selects : texte vs fond opaque effectif ────────────────────────────────
for (const theme of ['light', 'dark']) {
  const ctx = await b.newContext();
  const page = await ctx.newPage();
  if (theme === 'dark') {
    await ctx.addCookies([
      { name: 'theme', value: 'simple', url: base },
      { name: 'simple_style', value: 'dark', url: base },
    ]);
  }
  await page.goto(`${base}/search?q=test`, { waitUntil: 'load' });
  await page.waitForSelector('#urls', { timeout: 20000 });
  for (const sel of ['#language', '#time_range', '#safesearch']) {
    const el = await page.$(sel);
    if (!el) { out.push({ probe: 'select', sel, theme, verdict: 'ABSENT' }); continue; }
    const m = await el.evaluate(e => {
      const cs = getComputedStyle(e);
      let node = e; const layers = [];
      while (node && node !== document.documentElement) {
        const bcs = getComputedStyle(node);
        const bg = bcs.backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') layers.push(bg);
        node = node.parentElement;
      }
      for (const root of [document.body, document.documentElement]) {
        const c = getComputedStyle(root).backgroundColor;
        if (c && c !== 'rgba(0, 0, 0, 0)') layers.push(c);
      }
      return { fg: cs.color, fontSize: cs.fontSize, layers };
    });
    let bg = null;
    for (const L of [...m.layers].reverse()) {
      const c = parse(L); if (!c) continue;
      bg = bg === null ? { r: c.r, g: c.g, b: c.b }
        : { r: c.a * c.r + (1 - c.a) * bg.r, g: c.a * c.g + (1 - c.a) * bg.g, b: c.a * c.b + (1 - c.a) * bg.b };
    }
    if (!bg) bg = theme === 'dark' ? { r: 34, g: 36, b: 40 } : { r: 255, g: 255, b: 255 };
    const R = ratio(lum(parse(m.fg)), lum(bg));
    out.push({ probe: 'select', sel, theme, fg: m.fg, bgEff: bg, ratio: +R.toFixed(2), verdict: R >= 4.5 ? 'PASS' : 'FAIL' });
  }
  await ctx.close();
}

// ── résultats image : pastille résolution (pire cas = image blanche) ───────
{
  const ctx = await b.newContext();
  const page = await ctx.newPage();
  await page.goto(`${base}/search?q=test&categories=images`, { waitUntil: 'load' });
  await page.waitForSelector('article.result-images', { timeout: 20000 });
  const pills = await page.$$('.image_resolution');
  if (!pills.length) out.push({ probe: 'pill', sel: '.image_resolution', verdict: 'ABSENT' });
  for (const pill of pills.slice(0, 3)) {
    const m = await pill.evaluate(e => ({ fg: getComputedStyle(e).color, bg: getComputedStyle(e).backgroundColor, fontSize: getComputedStyle(e).fontSize, text: e.textContent.trim() }));
    const fg = parse(m.fg); const bgc = parse(m.bg);
    const comp = { r: bgc.a * bgc.r + (1 - bgc.a) * 255, g: bgc.a * bgc.g + (1 - bgc.a) * 255, b: bgc.a * bgc.b + (1 - bgc.a) * 255 };
    const R = ratio(lum(fg), lum(comp));
    out.push({ probe: 'pill-worst-case', sel: '.image_resolution', text: m.text, fg: m.fg, pillBg: m.bg, compositeOverWhite: comp, ratio: +R.toFixed(2), verdict: R >= 4.5 ? 'PASS' : 'FAIL', note: 'fond semi-transparent sur image arbitraire — borné par composite sur blanc' });
  }
  // légende sous l'image : texte vs fond de page effectif
  const titles = await page.$$('article.result-images .title');
  for (const t of titles.slice(0, 3)) {
    const m = await t.evaluate(e => {
      const r = e.getBoundingClientRect();
      const img = e.closest('a')?.querySelector('img')?.getBoundingClientRect();
      let node = e; let bg = null;
      while (node && bg === null) {
        const c = getComputedStyle(node).backgroundColor;
        if (c && c !== 'rgba(0, 0, 0, 0)') { bg = c; }
        node = node.parentElement;
      }
      return { fg: getComputedStyle(e).color, bg, belowImage: img ? r.top >= img.bottom - 1 : null, text: e.textContent.trim().slice(0, 40) };
    });
    const fg = parse(m.fg); const bg = parse(m.bg) || { r: 255, g: 255, b: 255 };
    const R = ratio(lum(fg), lum(bg));
    out.push({ probe: 'caption', sel: '.title', text: m.text, fg: m.fg, bgEff: m.bg || 'page default', belowImage: m.belowImage, ratio: +R.toFixed(2), verdict: m.belowImage && R >= 4.5 ? 'PASS' : R >= 4.5 ? 'PASS' : 'FAIL', note: 'légende peinte sous la vignette (pas superposée)' });
  }
  await ctx.close();
}

// ── métadonnées vidéos (confirmées 0 violation mais restent probe-worthy en dark)
for (const theme of ['light', 'dark']) {
  const ctx = await b.newContext();
  const page = await ctx.newPage();
  if (theme === 'dark') {
    await ctx.addCookies([
      { name: 'theme', value: 'simple', url: base },
      { name: 'simple_style', value: 'dark', url: base },
    ]);
  }
  await page.goto(`${base}/search?q=test&categories=videos`, { waitUntil: 'load' });
  await page.waitForSelector('article', { timeout: 20000 });
  const metas = await page.$$('article .result_inner .result_author, article .result_inner time, article .result_inner .result_views, article .result_inner .result_length');
  const seen = new Set();
  for (const el of metas) {
    const cls = await el.evaluate(e => e.tagName + '.' + e.className);
    if (seen.has(cls)) continue; seen.add(cls);
    const m = await el.evaluate(e => {
      let node = e; let bg = null;
      while (node && bg === null) {
        const c = getComputedStyle(node).backgroundColor;
        if (c && c !== 'rgba(0, 0, 0, 0)') bg = c;
        node = node.parentElement;
      }
      return { fg: getComputedStyle(e).color, bg };
    });
    const fg = parse(m.fg);
    const bg = parse(m.bg) || (theme === 'dark' ? { r: 34, g: 36, b: 40 } : { r: 255, g: 255, b: 255 });
    const R = ratio(lum(fg), lum(bg));
    out.push({ probe: 'video-meta', sel: cls, theme, fg: m.fg, bgEff: m.bg || 'page default', ratio: +R.toFixed(2), verdict: R >= 4.5 ? 'PASS' : 'FAIL' });
  }
  await ctx.close();
}

// ── th-has-data-cells : inventaire structurel de la table moteurs ──────────
{
  const ctx = await b.newContext();
  const page = await ctx.newPage();
  await page.goto(`${base}/preferences`, { waitUntil: 'load' });
  await page.click('#tab-engines');
  await page.waitForSelector('#tab-content-engines:not([hidden])');
  const tbl = await page.$eval('#tab-content-category_general .table_engines', table => {
    const heads = [...table.rows[0].children].map(c => c.textContent.trim() || c.tagName);
    const ncols = heads.length;
    const filled = Array(ncols).fill(0); const total = Array(ncols).fill(0);
    for (const row of [...table.rows].slice(1)) {
      let i = 0;
      for (const cell of row.children) {
        const span = +(cell.getAttribute('colspan') || 1);
        const hasContent = cell.textContent.trim() !== '' || cell.querySelector('input,img,svg,a,button') !== null;
        for (let s = 0; s < span; s++) { total[i + s]++; if (hasContent) filled[i + s]++; }
        i += span;
      }
    }
    return heads.map((h, i) => ({ column: h, dataCells: total[i], nonEmpty: filled[i] }));
  });
  out.push({ probe: 'th-has-data-cells', table: '#tab-content-category_general .table_engines', columns: tbl, verdict: 'DOCUMENTED', note: "colonne 'Engine name' = row-headers (th.name), colonnes SafeSearch/Time range = indicateurs checkbox (contenu non-textuel), Response time/Reliability vides = aucune métrique collectée sur instance fraîche" });
  await ctx.close();
}

// ── classes résiduelles d'incomplets color-contrast (wart W2) ─────────────
// .thumbnail_length = pastille durée vidéo (même rgba(0,0,0,.65) que
// .image_resolution), .url_i1 = fragment d'URL de résultat, td/legend =
// tableau des moteurs + légendes de fieldsets /preferences.
// Toutes les couches de fond (y compris translucides) — le compositing alpha
// est fait côté node, jamais en traitant un rgba<1 comme opaque
const walkBg = `e => { let node = e; const layers = [];
  while (node) {
    const c = getComputedStyle(node).backgroundColor;
    if (c && c !== 'rgba(0, 0, 0, 0)') layers.push(c);
    node = node.parentElement;
  }
  return { fg: getComputedStyle(e).color, layers, text: e.textContent.trim().slice(0, 40) }; }`;
// Composite les couches de haut en bas : chaque couche contribue
// couleur·alpha·∏(1-alpha des couches au-dessus), le reliquat tombe sur fallback
function effectiveBg(layers, fallback) {
  let r = 0, g = 0, b = 0, remaining = 1;
  for (const c of layers || []) {
    const p = parse(c);
    if (!p) continue;
    const a = p.a ?? 1;
    r += p.r * a * remaining; g += p.g * a * remaining; b += p.b * a * remaining;
    remaining *= (1 - a);
    if (a >= 1) break;
  }
  if (remaining > 0) {
    r += fallback.r * remaining; g += fallback.g * remaining; b += fallback.b * remaining;
  }
  return { r, g, b };
}
const classTargets = [
  { probe: 'thumbnail-length', url: `${base}/search?q=test&categories=videos`, sel: '.thumbnail_length' },
  { probe: 'url-i1', url: `${base}/search?q=test`, sel: '.url_i1' },
];
for (const theme of ['light', 'dark']) {
  const ctx = await b.newContext();
  const page = await ctx.newPage();
  if (theme === 'dark') {
    await ctx.addCookies([
      { name: 'theme', value: 'simple', url: base },
      { name: 'simple_style', value: 'dark', url: base },
    ]);
  }
  for (const t of classTargets) {
    await page.goto(t.url, { waitUntil: 'load' });
    const els = await page.$$(t.sel);
    if (!els.length) { out.push({ probe: t.probe, sel: t.sel, theme, verdict: 'ABSENT' }); continue; }
    const m = await els[0].evaluate(eval(`(${walkBg})`));
    const fg = parse(m.fg);
    const bg = effectiveBg(m.layers, theme === 'dark' ? { r: 34, g: 36, b: 40 } : { r: 255, g: 255, b: 255 });
    const R = ratio(lum(fg), lum(bg));
    out.push({ probe: t.probe, sel: t.sel, theme, nodes: els.length, fg: m.fg, bgEff: m.layers?.[0] || 'page default', ratio: +R.toFixed(2), verdict: R >= 4.5 ? 'PASS' : 'FAIL' });
  }
  // td + legend sur /preferences
  await page.goto(`${base}/preferences`, { waitUntil: 'load' });
  for (const sel of ['#tab-content-category_general td', 'fieldset legend, .engine-table legend']) {
    const els = await page.$$(sel);
    if (!els.length) { out.push({ probe: 'prefs-' + sel.split(' ')[0], sel, theme, verdict: 'ABSENT' }); continue; }
    const m = await els[0].evaluate(eval(`(${walkBg})`));
    const fg = parse(m.fg);
    const bg = effectiveBg(m.layers, theme === 'dark' ? { r: 34, g: 36, b: 40 } : { r: 255, g: 255, b: 255 });
    const R = ratio(lum(fg), lum(bg));
    out.push({ probe: 'prefs-' + sel.split(' ')[0], sel, theme, nodes: els.length, fg: m.fg, bgEff: m.layers?.[0] || 'page default', ratio: +R.toFixed(2), verdict: R >= 4.5 ? 'PASS' : 'FAIL' });
  }
  await ctx.close();
}

await b.close();
console.log(JSON.stringify({ generatedAt: new Date().toISOString(), probes: out }, null, 1));
const fails = out.filter(o => o.verdict === 'FAIL').length;
console.error(`probes: ${out.length} (${fails} FAIL)`);
process.exit(fails ? 1 : 0);
