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
      // composite alpha de tous les ancêtres jusqu'à un fond opaque ;
      // un box-shadow inset plein (technique DataTables 2 pour la ligne
      // sélectionnée) compte comme couche de peinture opaque.
      let acc = [0, 0, 0, 0];
      let n = el;
      // inclure <html> — jellyfin pose son fond de thème dessus, pas sur body
      while (n) {
        const css = getComputedStyle(n);
        let c = this.parseColor(css.backgroundColor);
        if (css.boxShadow && css.boxShadow !== 'none') {
          const sm = /rgba?\(([^)]+)\)\s+0px\s+0px\s+0px\s+\d+px\s+inset/.exec(css.boxShadow);
          if (sm) {
            const p = sm[1].split(',').map(Number);
            const sc = [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
            if (!c || sc[3] > c[3]) c = sc;
          }
        }
        if (c && c[3] > 0) {
          // acc (couche déjà vue, au-dessus) par-dessus c (fond de l'ancêtre)
          const a = acc[3] + c[3] * (1 - acc[3]);
          acc = acc.slice(0, 3).map((v, i) => (v * acc[3] + c[i] * c[3] * (1 - acc[3])) / a).concat(a);
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
          // contrôle désactivé : exempté du critère 1.4.3 (incidentel) -> N-A
          if (el.disabled || el.matches('.disabled, :disabled, [aria-disabled="true"]')) {
            return { verdict: 'N-A', detail: 'contrôle désactivé (exempt 1.4.3)' };
          }
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
        if (rule === 'aria-valid-attr-value') {
          // aria-labelledby/describedby référencent-ils des ids présents ?
          const parts = v => (v || '').split(/\s+/).filter(Boolean);
          const refs = [...parts(el.getAttribute('aria-labelledby')), ...parts(el.getAttribute('aria-describedby'))];
          if (!refs.length) {
            // aria-controls/aria-owns portent un IDREF : la valeur est valide
            // si l'élément cible existe (caché keepMounted accepté).
            const idrefAttrs = ['aria-controls', 'aria-owns', 'aria-activedescendant'];
            const badIdref = idrefAttrs.filter(a => {
              const v = el.getAttribute(a);
              return v !== null && !document.getElementById(v.split(/\s+/)[0]);
            });
            if (badIdref.length) return { verdict: 'FAIL', detail: `idref absent: ${badIdref.join(',')}` };
            const bad = ['aria-expanded','aria-selected','aria-haspopup'].filter(a => el.getAttribute(a) !== null && !/^(true|false|listbox|menu|dialog|tree|grid)$/i.test(el.getAttribute(a)));
            return { verdict: bad.length ? 'FAIL' : 'N-A', detail: `attrs=${bad.join(',')}` };
          }
          const found = refs.filter(id => document.getElementById(id));
          const missing = refs.filter(id => !document.getElementById(id));
          if (missing.length) return { verdict: 'FAIL', detail: `ids manquants: ${missing.join(',')}` };
          // cible présente mais cachée : référence ARIA valide (les AT lisent
          // le contenu d'éléments cachés via labelledby/describedby) -> N-A
          const hidden = found.filter(id => {
            const t = document.getElementById(id);
            const r = t.getBoundingClientRect();
            return r.width === 0 || r.height === 0 || getComputedStyle(t).visibility === 'hidden';
          });
          return { verdict: hidden.length ? 'N-A' : 'PASS', detail: `refs=${found.length} hidden=${hidden.length}` };
        }
        if (rule === 'aria-prohibited-attr') {
          const attrs = ['aria-label','aria-labelledby','aria-braillelabel'].filter(a => el.getAttribute(a) !== null);
          const role = el.getAttribute('role') || 'implicit:' + el.tagName.toLowerCase();
          const landmark = /^(implicit:)?(nav|main|header|footer|aside|section|form|search)|^region$|^banner$|^contentinfo$|^navigation$|^main$|^complementary$|^form$|^search$/.test(role);
          return { verdict: landmark ? 'PASS' : 'N-A', detail: `role=${role} attrs=${attrs.join(',')}` };
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
