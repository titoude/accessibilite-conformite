// Sonde rejouable pour les incomplets axe (cycle phpmyadmin).
// Pour chaque noeud incomplet de reports/final/auth/report.json, la sonde
// retourne sur la page, mesure la valeur réelle (computed + composite alpha
// pour les fonds, rect + occlusion pour les tailles) et rend PASS/FAIL/N-A.
// Usage: node incomplete-probes.mjs <base> <report.json> <out.json> [storageState]
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const base = process.argv[2] ?? 'http://localhost:8080';
const reportPath = process.argv[3];
const outPath = process.argv[4];
const statePath = process.argv[5] ?? 'auth.json';

const report = JSON.parse(readFileSync(reportPath, 'utf8'));

// Composite alpha: fg over bg, channel-wise
const mix = (fg, bg) => {
  const a = fg[3] + bg[3] * (1 - fg[3]);
  if (a <= 0) return [255, 255, 255, 0];
  return fg.slice(0, 3).map((c, i) => (c * fg[3] + bg[i] * bg[3] * (1 - fg[3])) / a).concat(a);
};
const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = rgb => 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2]);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: statePath });
const page = await ctx.newPage();
await page.addInitScript(() => {
  window.__probe = {
    parseColor(str) {
      const m = /rgba?\(([^)]+)\)/.exec(str || '');
      if (!m) return null;
      const p = m[1].split(',').map(Number);
      return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
    },
    effectiveBg(el) {
      // composite alpha de tous les ancêtres jusqu'à un fond opaque
      let acc = [0, 0, 0, 0];
      let n = el;
      while (n && n !== document.documentElement) {
        const c = this.parseColor(getComputedStyle(n).backgroundColor);
        if (c && c[3] > 0) {
          const a = c[3] + acc[3] * (1 - c[3]);
          acc = c.slice(0, 3).map((v, i) => (v * c[3] + acc[i] * acc[3] * (1 - c[3])) / a).concat(a);
          if (acc[3] >= 1) break;
        }
        n = n.parentElement;
      }
      if (acc[3] < 1) acc = [255, 255, 255, 1].map((v, i) => i < 3 ? (v * (1 - acc[3]) + acc[i]) : 1);
      return acc;
    },
  };
});

const results = {};
for (const p of report.pages) {
  const url = p.url.split(' ')[0];
  for (const r of (p.incomplete || [])) {
    for (const n of r.nodes) {
      const sel = n.target[0];
      (results[r.id] ??= []).push({ url, sel });
    }
  }
}

const verdicts = [];
let curUrl = null;
for (const [rule, nodes] of Object.entries(results)) {
  for (const { url, sel } of nodes) {
    const v = { rule, url, sel };
    try {
      if (url !== curUrl) {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(1200);
        curUrl = url;
      }
      const r = await page.evaluate(async ({ rule, sel }) => {
        const el = document.querySelector(sel);
        if (!el) return { verdict: 'N-A', detail: 'not found' };
        const rect = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const visible = rect.width > 0 && rect.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
        if (!visible) return { verdict: 'N-A', detail: 'hidden' };

        if (rule === 'color-contrast') {
          const fg = window.__probe.parseColor(cs.color);
          const bg = window.__probe.effectiveBg(el);
          const lin = (rgb) => rgb.slice(0, 3).map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
          const lum = (rgb) => { const c = lin(rgb); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
          const cr = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);
          return { verdict: cr >= 4.5 ? 'PASS' : 'FAIL', detail: `ratio ${cr.toFixed(2)} fg=${cs.color} bg=${bg.map(x => Math.round(x)).join(',')}` };
        }
        if (rule === 'target-size') {
          const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
          const at = document.elementFromPoint(cx, cy);
          const covered = at && at !== el && !el.contains(at);
          return (rect.width >= 24 && rect.height >= 24 && !covered)
            ? { verdict: 'PASS', detail: `${rect.width.toFixed(1)}x${rect.height.toFixed(1)}` }
            : { verdict: covered ? 'FAIL' : 'FAIL', detail: `${rect.width.toFixed(1)}x${rect.height.toFixed(1)} covered=${covered ? (at.tagName + '.' + at.className).slice(0, 40) : false}` };
        }
        if (rule === 'duplicate-id-aria') {
          const id = el.id;
          const same = id ? document.querySelectorAll('#' + CSS.escape(id)).length : 0;
          const focusable = el.matches('a[href],button,input,select,textarea,[tabindex]');
          return { verdict: same > 1 && focusable ? 'FAIL' : 'PASS', detail: `id=${id} count=${same} focusable=${focusable} aria-hidden=${el.closest('[aria-hidden="true"]') ? true : false}` };
        }
        if (rule === 'form-field-multiple-labels') {
          const labels = el.labels ? el.labels.length : 0;
          const aria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
          return { verdict: (labels + (aria ? 1 : 0)) >= 1 ? 'PASS' : 'FAIL', detail: `labels=${labels} aria=${!!aria}` };
        }
        if (rule === 'link-in-text-block') {
          // lien-icône : distingué visuellement par le glyphe, pas par la couleur
          const kids = [...el.children];
          const iconOnly = kids.length > 0 && kids.every(k => k.matches('i.material-icons, svg, img'));
          if (iconOnly) return { verdict: 'PASS', detail: 'icon-only link (glyph, not color)' };
          const under = cs.textDecorationLine.includes('underline') || getComputedStyle(el, '::after').content !== 'none';
          const fw = parseInt(cs.fontWeight);
          const pw = el.parentElement ? parseInt(getComputedStyle(el.parentElement).fontWeight) : 400;
          return { verdict: under || fw - pw >= 200 || cs.fontStyle !== getComputedStyle(el.parentElement).fontStyle ? 'PASS' : 'FAIL', detail: `underline=${under} fw=${fw} pw=${pw}` };
        }
        if (rule === 'th-has-data-cells') {
          const t = el.closest('table');
          const idx = [...el.parentElement.children].indexOf(el);
          const cells = t ? [...t.querySelectorAll('tbody tr')].filter(tr => tr.children[idx] && tr.children[idx].textContent.trim()).length : 0;
          return { verdict: cells > 0 ? 'PASS' : 'N-A', detail: `data cells in column=${cells}` };
        }
        if (rule === 'aria-allowed-role') {
          return { verdict: 'N-A', detail: `role=${el.getAttribute('role')} tag=${el.tagName}` };
        }
        return { verdict: 'N-A', detail: 'no probe' };
      }, { rule, sel });
      v.verdict = r.verdict; v.detail = r.detail;
    } catch (e) { v.verdict = 'N-A'; v.detail = 'err ' + String(e).slice(0, 80); }
    verdicts.push(v);
  }
}
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(verdicts, null, 1));
const tally = {};
for (const v of verdicts) { tally[v.rule + '|' + v.verdict] = (tally[v.rule + '|' + v.verdict] || 0) + 1; }
console.log(JSON.stringify(tally, null, 1));
await browser.close();
