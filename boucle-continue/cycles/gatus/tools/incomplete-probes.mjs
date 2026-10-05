// incomplete-probes.mjs — sonde rejouable des noeuds 'incomplete' axe du report final.
// Pour chaque noeud incomplet du report.json livré, remesure en DOM live :
//   - couleur de texte calculée (fg) et fond effectif (couleur solide la plus proche)
//   - ratio WCAG calculé
//   - motif axe (overlapped / non-text characters) + élément recouvrant
//   - pour les nœuds overlapped : ratio REMESURÉ avec l'overlay masqué (preuve
//     que l'incomplet est un artefact de l'overlay ouvert, pas un défaut de couleur)
// Usage : node incomplete-probes.mjs <baseUrl> <report.json> <out.json>
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8080';
const REPORT = process.argv[3];
const OUT = process.argv[4] || 'incomplete-probes.json';

const report = JSON.parse(readFileSync(REPORT, 'utf8'));

// Mêmes setups d'états que audit.mjs (dupliqués pour rejouabilité indépendante)
const STATE_SETUPS = {
  'tooltip-resultat': async (page, b) => {
    await page.goto(b + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#settings', { timeout: 15000 });
    await page.waitForTimeout(3000);
    await page.locator('.endpoint .flex-1[class*="cursor-pointer"]').first().click();
    await page.waitForSelector('#tooltip.visible', { timeout: 5000 });
  },
  'menu-refresh': async (page, b) => {
    await page.goto(b + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#settings', { timeout: 15000 });
    await page.waitForTimeout(3000);
    await page.locator('#settings button[aria-expanded]').click();
    await page.waitForSelector('#settings .absolute.bottom-full button', { timeout: 5000 });
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
  let bg = null, bgSource = null, node = el;
  while (node && node !== document.documentElement) {
    const cs = getComputedStyle(node);
    const c = parse(cs.backgroundColor);
    if (c && (c[3] ?? 1) > 0) { bg = c; bgSource = 'backgroundColor ' + cs.backgroundColor + ' sur ' + node.tagName + '.' + (node.className + '').split(' ')[0]; break; }
    node = node.parentElement;
  }
  if (!bg) { bg = parse(getComputedStyle(document.body).backgroundColor) || [255, 255, 255]; bgSource = 'body'; }
  const rect = el.getBoundingClientRect();
  const cover = (() => {
    const stack = document.elementsFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const top = stack.find(t => t !== el && !el.contains(t));
    return top ? { tag: top.tagName, id: top.id || null, cls: (top.className + '').split(' ').slice(0, 3).join(' '), insideTooltip: !!top.closest('#tooltip'), insideSettings: !!top.closest('#settings') } : null;
  })();
  return {
    found: true,
    text: (el.innerText || el.textContent || '').slice(0, 60),
    fg: 'rgb(' + fg.slice(0, 3).join(',') + ')',
    bg: 'rgb(' + bg.slice(0, 3).join(',') + ')',
    bgSource,
    ratio: Math.round(ratio(fg, bg) * 100) / 100,
    ariaHidden: el.getAttribute('aria-hidden'),
    visible: !!(rect.width && rect.height),
    coveredBy: cover,
  };
})`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const out = { generatedAt: new Date().toISOString(), baseUrl: BASE, probes: [] };

for (const p of report.pages) {
  const incs = p.incomplete || [];
  if (!incs.length) continue;
  const m = p.url.match(/^(.*?)(?: \[state:(.+)\])?$/);
  const url = m[1], state = m[2] || null;
  if (state && STATE_SETUPS[state]) await STATE_SETUPS[state](page, BASE);
  else {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#settings, main', { timeout: 15000 });
    await page.waitForTimeout(2000);
  }
  for (const inc of incs) {
    for (const n of inc.nodes) {
      const sel = n.target && n.target[0];
      const motif = (n.any?.[0]?.data?.messageKey) || (n.any?.[0]?.message || '').slice(0, 90);
      let probe;
      try { probe = await page.evaluate(PROBE_JS + `(${JSON.stringify(sel)})`); }
      catch (e) { probe = { found: false, error: String(e).slice(0, 120) }; }
      // Overlapped : remesurer le même nœud avec l'overlay masqué
      let underProbe = null;
      if (probe && probe.coveredBy && (probe.coveredBy.insideTooltip || probe.coveredBy.insideSettings)) {
        try {
          underProbe = await page.evaluate(`(() => {
            const overlay = document.querySelector('#tooltip.visible') || document.querySelector('#settings .absolute.bottom-full');
            const prev = overlay ? overlay.style.visibility : null;
            if (overlay) overlay.style.visibility = 'hidden';
            const r = ${PROBE_JS}(${JSON.stringify(sel)});
            if (overlay) overlay.style.visibility = prev;
            return r;
          })()`);
        } catch (e) { underProbe = { error: String(e).slice(0, 120) }; }
      }
      out.probes.push({
        page: url.replace(BASE, '') || '/', state, rule: inc.id, target: sel, motif,
        ...probe,
        ratioSousOverlayMasque: underProbe ? underProbe.ratio : undefined,
      });
    }
  }
}
await browser.close();
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.probes, null, 1));
console.log(`probes: ${out.probes.length} noeuds -> ${OUT}`);
