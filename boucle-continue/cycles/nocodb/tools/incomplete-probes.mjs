// incomplete-probes.mjs — sonde rejouable des noeuds 'incomplete' axe du run final nocodb.
// Pour chaque noeud incomplet du report.json livré, remesure en DOM live :
//   - color-contrast : couleur de texte calculée, fond effectif COMPOSITE de toutes
//     les couches translucides de la pile d'ancêtres (alpha blending réel — un
//     rgba<1 n'est JAMAIS traité comme opaque), stops de dégradé, élément occultant
//   - th-has-data-cells : répartition th/td dans la table signalée vs la table body
//     sœur (pattern antd header/body split : la table d'en-tête ne porte que des th)
//   - aria-valid-attr-value : résolution d'id au repos puis après ouverture du popup
// Usage : node incomplete-probes.mjs <baseUrl> <report.json> <storage-state.json|none> <out.json>
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:8081';
const REPORT = process.argv[3];
const STORAGE = process.argv[4];
const OUT = process.argv[5] || 'incomplete-probes.json';

const report = JSON.parse(readFileSync(REPORT, 'utf8'));

// Mêmes setups d'états que audit.mjs (dupliqués pour rejouabilité indépendante)
const NC_WS = 'wd10yk1f';
const NC_BASE = 'pkg7xkxnvm4oc5w';
const NC_TABLE = 'm9aiffs89yv1o74';
const NC_GRID = 'vwsla3dxylant2l6';
const NC_GRID_URL = `/${NC_WS}/${NC_BASE}/${NC_TABLE}/${NC_GRID}/items-items`;

const STATE_SETUPS = {
  'share-modal': async (page, b) => {
    await page.goto(b + NC_GRID_URL, { waitUntil: 'domcontentloaded' });
    await page.locator('button:has-text("Share")').first().click();
    await page.waitForSelector('.ant-modal-wrap.nc-modal-share-collaborate', { timeout: 15000 });
  },
  'fields-dropdown': async (page, b) => {
    await page.goto(b + NC_GRID_URL, { waitUntil: 'domcontentloaded' });
    await page.locator('button:has-text("Fields")').first().click();
    await page.waitForSelector('.ant-dropdown:visible, .ant-dropdown:not(.ant-dropdown-hidden)', { timeout: 15000 });
  },
  'table-tools-modal': async (page, b) => {
    await page.goto(b + NC_GRID_URL + '/field', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.nc-modal-table-tools', { timeout: 20000 });
  },
  'create-new-menu': async (page, b) => {
    await page.goto(b + `/${NC_WS}/${NC_BASE}`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-testid="nc-home-create-new-btn"]').click();
    await page.waitForSelector('.ant-dropdown', { timeout: 15000 });
  },
  'user-menu': async (page, b) => {
    await page.goto(b + NC_GRID_URL, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-testid="nc-sidebar-userinfo"]').click();
    await page.waitForSelector('.ant-dropdown', { timeout: 15000 });
  },
};

const CONTRAST_PROBE = `((sel) => {
  const el = document.querySelector(sel);
  if (!el) return { found: false };
  const lum = (r, g, b) => {
    const c = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const parse = (s) => { const m = s.match(/rgba?\\(([^)]+)\\)/); return m ? m[1].split(',').map(Number) : null; };
  const ratio = (f, b) => (Math.max(lum(...f), lum(...b)) + 0.05) / (Math.min(lum(...f), lum(...b)) + 0.05);
  const fg = parse(getComputedStyle(el).color) || [0, 0, 0];
  // Empile tous les fonds translucides puis les blende de haut en bas (alpha compositing réel)
  let stack = [], gradientStops = null, bgSource = [], node = el;
  const pushLayer = (c, src) => { if (c && (c[3] ?? 1) > 0) { stack.push(c); bgSource.push(src); } };
  while (node && node !== document.documentElement) {
    // ordre de peinture : ::after (dessus) > ::before > fond de l'élément (dessous)
    for (const pe of ['::after', '::before']) {
      const pcs = getComputedStyle(node, pe);
      pushLayer(parse(pcs.backgroundColor), pcs.backgroundColor + ' sur ' + node.tagName + pe);
      const pimg = pcs.backgroundImage;
      if (!gradientStops && pimg && pimg.includes('gradient')) {
        const cols = [...pimg.matchAll(/rgba?\\([^)]+\\)/g)].map(mm => parse(mm[0])).filter(x => x && (x[3] ?? 1) > 0);
        if (cols.length) gradientStops = cols;
      }
    }
    const cs = getComputedStyle(node);
    pushLayer(parse(cs.backgroundColor), cs.backgroundColor + ' sur ' + node.tagName + '.' + (node.className + '').split(' ')[0]);
    const img = cs.backgroundImage;
    if (!gradientStops && img && img.includes('gradient')) {
      const cols = [...img.matchAll(/rgba?\\([^)]+\\)/g)].map(mm => parse(mm[0])).filter(x => x && (x[3] ?? 1) > 0);
      if (cols.length) gradientStops = cols;
    }
    node = node.parentElement;
  }
  // html/body : la couleur racine de la page, sinon blanc
  const root = parse(getComputedStyle(document.documentElement).backgroundColor);
  stack.push(root && (root[3] ?? 1) > 0 ? root : [255, 255, 255, 1]);
  let eff = stack[0];
  for (let i = 1; i < stack.length; i++) { const a = eff[3] ?? 1, b = stack[i]; eff = [0, 1, 2].map(k => Math.round(eff[k] * a + b[k] * (b[3] ?? 1) * (1 - a))); eff[3] = 1; }
  const ratios = gradientStops ? gradientStops.map(c => Math.round(ratio(fg, c) * 100) / 100) : [Math.round(ratio(fg, eff) * 100) / 100];
  const rect = el.getBoundingClientRect();
  return {
    found: true,
    text: (el.innerText || el.textContent || '').slice(0, 60),
    fg: 'rgb(' + fg.slice(0, 3).join(',') + ')',
    bgStack: bgSource,
    effectiveBg: 'rgb(' + eff.slice(0, 3).join(',') + ')',
    gradientStops: gradientStops ? gradientStops.map(c => 'rgb(' + c.slice(0, 3).join(',') + ')') : null,
    ratios,
    minRatio: Math.min(...ratios),
    visible: !!(rect.width && rect.height) && getComputedStyle(el).display !== 'none',
    coveredBy: (() => { const t = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2); return t && t !== el && !el.contains(t) ? t.tagName + '.' + (t.className + '').split(' ')[0] : null; })(),
  };
})`;

const ARIA_ATTR_PROBE = `((sel) => {
  const el = document.querySelector(sel);
  if (!el) return { found: false };
  const bad = ['aria-controls', 'aria-owns', 'aria-activedescendant', 'aria-details', 'aria-describedby', 'aria-errormessage', 'aria-flowto', 'aria-labelledby'];
  const refs = {};
  for (const a of bad) {
    const v = el.getAttribute(a);
    if (!v) continue;
    refs[a] = v.split(/\\s+/).filter(Boolean).map(id => ({ id, resolves: !!document.getElementById(id) }));
  }
  return {
    found: true,
    tag: el.tagName,
    cls: (el.className + '').slice(0, 60),
    role: el.getAttribute('role'),
    refs,
  };
})`;

const TABLE_PROBE = `((sel) => {
  const el = document.querySelector(sel);
  if (!el) return { found: false };
  const thCount = el.querySelectorAll('th').length;
  const tdCount = el.querySelectorAll('td').length;
  // Les tables NcTable sont SPLIT : table header-only + table body soeurs sous
  // .nc-table-wrapper, fusionnées par ARIA (role=table + 2 rowgroups).
  const wrap = el.closest('.nc-table-wrapper') || el.closest('.ant-table-container, .ant-table') || el.parentElement;
  const tables = wrap ? [...wrap.querySelectorAll(':scope > table, :scope table')] : [];
  const otherTable = tables.find(t => t !== el.closest('table'));
  const siblingBodyRows = otherTable ? otherTable.querySelectorAll('tbody tr').length : 0;
  return {
    found: true,
    thCount,
    tdCount,
    headerOnlyTable: thCount > 0 && tdCount === 0,
    siblingBodyRows,
    wrapRole: wrap && wrap.getAttribute('role'),
    headerRole: el.closest('table') && el.closest('table').getAttribute('role'),
    bodyRole: otherTable && otherTable.getAttribute('role'),
    thRoles: [...el.querySelectorAll('th')].slice(0, 3).map(th => th.getAttribute('role')),
    containerCls: (wrap && wrap.className + '').slice(0, 80),
  };
})`;

const browser = await chromium.launch();
const ctxOpts = STORAGE && STORAGE !== 'none' ? { storageState: STORAGE } : {};
const page = await (await browser.newContext(ctxOpts)).newPage();
const out = { generatedAt: new Date().toISOString(), baseUrl: BASE, probes: [] };

for (const p of report.pages) {
  const m = p.url.match(/^(.*?)(?: \[state:(.+)\])?$/);
  const url = m[1], state = m[2] || null;
  let stateError = null;
  if (state && STATE_SETUPS[state]) {
    try { await STATE_SETUPS[state](page, BASE); }
    catch (e) { stateError = String(e).slice(0, 150); }
  }
  else {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main, #root, body', { timeout: 15000 });
    await page.waitForTimeout(1500);
  }
  for (const inc of p.incomplete || []) {
    for (const n of inc.nodes) {
      const sel = n.target && n.target[0];
      const motif = (n.any?.[0]?.data?.messageKey) || (n.all?.[0]?.data?.messageKey) || (n.any?.[0]?.message || n.all?.[0]?.message || '').slice(0, 80);
      const probeJs = inc.id === 'aria-valid-attr-value' ? ARIA_ATTR_PROBE
        : inc.id === 'th-has-data-cells' ? TABLE_PROBE
        : CONTRAST_PROBE;
      let probe;
      try { probe = await page.evaluate(probeJs + `(${JSON.stringify(sel)})`); }
      catch (e) { probe = { found: false, error: String(e).slice(0, 120) }; }
      out.probes.push({
        page: url.replace(BASE, '') || '/', state, rule: inc.id, target: sel, motif,
        ...(stateError ? { stateError } : {}),
        ...probe,
      });
    }
  }
}

await browser.close();
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`probes: ${out.probes.length} noeuds -> ${OUT}`);
const cc = out.probes.filter(x => x.rule === 'color-contrast' || x.rule === 'link-in-text-block');
for (const x of cc) console.log('  contrast', x.minRatio, x.target, '|', x.text, '| occultant:', x.coveredBy);
const th = out.probes.filter(x => x.rule === 'th-has-data-cells');
for (const x of th) console.log('  th-cells', x.page, 'headerOnly=' + x.headerOnlyTable, 'th=' + x.thCount, 'siblingRows=' + x.siblingBodyRows);
