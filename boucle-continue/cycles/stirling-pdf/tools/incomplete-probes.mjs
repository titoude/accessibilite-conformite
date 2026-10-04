// incomplete-probes.mjs — sonde rejouable des noeuds 'incomplete' axe du run final-v2.
// Pour chaque noeud incomplet du report.json livré, remesure en DOM live :
//   - couleur de texte calculée (fg)
//   - fond effectif (couleur solide la plus proche, ou stops du dégradé)
//   - ratio WCAG calculé (pire cas sur chaque stop de dégradé)
//   - motif axe (bgGradient / tooShort / overlapped) + attributs clés (aria-hidden)
// Usage : node incomplete-probes.mjs <baseUrl> <report.json> <out.json>
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8090';
const REPORT = process.argv[3];
const OUT = process.argv[4] || 'incomplete-probes.json';

const report = JSON.parse(readFileSync(REPORT, 'utf8'));

// Mêmes setups d'états que audit.mjs (dupliqués pour rejouabilité indépendante)
const STATE_SETUPS = {
  'subscription-popup': async (page, o) => {
    await page.goto(o + '/testtopic', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main', { timeout: 15000 });
    await page.waitForTimeout(1500);
    const subBtn = page.locator('main button').filter({ hasText: /subscribe/i }).first();
    if (await subBtn.count()) { await subBtn.click(); await page.waitForTimeout(1500); }
    const btn = page.locator('nav li button[aria-label]').last();
    await btn.waitFor({ state: 'visible', timeout: 10000 });
    await btn.click();
    await page.locator('.MuiPopover-root:not([aria-hidden="true"]) .MuiMenuItem-root').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'publish-dialog': async (page, o) => {
    await page.goto(o + '/testtopic', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main', { timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.locator('form button').first().click();
    await page.locator('.MuiDialog-root [role="dialog"]').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'subscribe-dialog': async (page, o) => {
    await page.goto(o + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('nav', { timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.locator('nav li').last().click();
    await page.locator('.MuiDialog-root [role="dialog"]').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
};

const PROBE_JS = `((sel) => {
  const el = document.querySelector(sel);
  if (!el) return { found: false };
  const lum = (r, g, b) => {
    const c = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const parse = (s) => { const m = s.match(/rgba?\\(([^)]+)\\)/); return m ? m[1].split(',').map(Number) : null; };
  const ratio = (f, b) => (Math.max(lum(...f), lum(...b)) + 0.05) / (Math.min(lum(...f), lum(...b)) + 0.05);
  const fg = parse(getComputedStyle(el).color) || [0, 0, 0];
  // fond : remonter jusqu'à une couleur solide non transparente ; collecter les dégradés
  let bg = null, bgSource = null, gradientStops = null, node = el;
  while (node && node !== document.documentElement) {
    const cs = getComputedStyle(node);
    const c = parse(cs.backgroundColor);
    if (c && (c[3] ?? 1) > 0) { bg = c; bgSource = 'backgroundColor ' + cs.backgroundColor + ' sur ' + node.tagName + '.' + (node.className + '').split(' ')[0]; break; }
    const img = cs.backgroundImage;
    if (img && img.includes('gradient')) {
      const cols = [...img.matchAll(/rgba?\\([^)]+\\)/g)].map(m => parse(m[0])).filter(x => x && (x[3] ?? 1) > 0);
      if (cols.length) { gradientStops = cols; bgSource = 'linear-gradient ' + cols.map(c => 'rgb(' + c.slice(0, 3).join(',') + ')').join(' -> ') + ' sur ' + node.tagName; }
    }
    node = node.parentElement;
  }
  if (!bg && !gradientStops) { bg = parse(getComputedStyle(document.body).backgroundColor) || [255, 255, 255]; bgSource = 'body'; }
  const ratios = gradientStops ? gradientStops.map(c => Math.round(ratio(fg, c) * 100) / 100) : [Math.round(ratio(fg, bg) * 100) / 100];
  const rect = el.getBoundingClientRect();
  return {
    found: true,
    text: (el.innerText || el.textContent || '').slice(0, 60),
    fg: 'rgb(' + fg.slice(0, 3).join(',') + ')',
    bgSource,
    ratios,
    minRatio: Math.min(...ratios),
    ariaHidden: el.getAttribute('aria-hidden'),
    visible: !!(rect.width && rect.height) && getComputedStyle(el).display !== 'none',
    coveredBy: (() => { const t = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2); return t && t !== el && !el.contains(t) ? t.tagName + '.' + (t.className + '').split(' ')[0] : null; })(),
  };
})`;

const browser = await chromium.launch();
const page = await browser.newPage();
const out = { generatedAt: new Date().toISOString(), baseUrl: BASE, probes: [] };

for (const p of report.pages) {
  const m = p.url.match(/^(.*?)(?: \[state:(.+)\])?$/);
  const url = m[1], state = m[2] || null;
  if (state && STATE_SETUPS[state]) await STATE_SETUPS[state](page, BASE);
  else {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main, #root', { timeout: 15000 });
    await page.waitForTimeout(1500);
  }
  for (const inc of p.incomplete || []) {
    for (const n of inc.nodes) {
      const sel = n.target && n.target[0];
      const motif = (n.any?.[0]?.data?.messageKey) || (n.any?.[0]?.message || '').slice(0, 80);
      let probe;
      try { probe = await page.evaluate(PROBE_JS + `(${JSON.stringify(sel)})`); }
      catch (e) { probe = { found: false, error: String(e).slice(0, 120) }; }
      out.probes.push({
        page: url.replace(BASE, '') || '/', state, rule: inc.id, target: sel, motif,
        ...probe,
      });
    }
  }
}
await browser.close();
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.probes, null, 1));
console.log(`probes: ${out.probes.length} noeuds -> ${OUT}`);
