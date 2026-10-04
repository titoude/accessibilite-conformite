// incomplete-probes.mjs — sonde rejouable des noeuds 'incomplete' axe du run final owncast.
// Pour chaque noeud incomplet du report.json livré, remesure en DOM live :
//   - aria-valid-attr-value : valeur aria-controls/aria-owns, id résolu au repos puis après ouverture du menu (preuve du lazy-mount antd)
//   - color-contrast / link-in-text-block : couleur de texte calculée, fond effectif (couleur solide la plus proche ou stops du dégradé), ratio WCAG, élément occultant
//   - video-caption : pistes <track> présentes, état du player videojs (source live RTMP sans pistes amont)
//   - th-has-data-cells : répartition th/td dans la table signalée vs la table body sœur (pattern antd header/body split)
// Usage : node incomplete-probes.mjs <baseUrl> <report.json> <out.json>
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://admin:abc123@localhost:8095';
const REPORT = process.argv[3];
const OUT = process.argv[4] || 'incomplete-probes.json';

const report = JSON.parse(readFileSync(REPORT, 'utf8'));

// Mêmes setups d'états que audit.mjs (dupliqués pour rejouabilité indépendante)
const STATE_SETUPS = {
  'public-follow-modal': async (page, o) => {
    await page.goto(o + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#follow-button, video, .vjs-poster, #player', { timeout: 15000 });
    await page.waitForTimeout(1500);
    const btn = page.locator('#follow-button');
    if (await btn.count()) { await btn.first().click(); await page.waitForSelector('.ant-modal', { timeout: 10000 }); await page.waitForTimeout(600); }
  },
  'public-notify-modal': async (page, o) => {
    await page.goto(o + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#notify-button', { timeout: 15000 });
    await page.locator('#notify-button').first().click();
    await page.waitForSelector('.ant-modal', { timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'public-user-dropdown': async (page, o) => {
    await page.goto(o + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#user-menu', { timeout: 15000 });
    await page.locator('#user-menu').first().click();
    await page.locator('.ant-dropdown:not(.ant-dropdown-hidden)').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(400);
  },
  'public-name-change-modal': async (page, o) => {
    await page.goto(o + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#user-menu', { timeout: 15000 });
    await page.locator('#user-menu').first().click();
    await page.locator('.ant-dropdown:not(.ant-dropdown-hidden)').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.ant-dropdown-menu-item', { hasText: 'Change name' }).first().click();
    await page.waitForSelector('.ant-modal', { timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'embed-video': async (page, o) => {
    await page.goto(o + '/embed/video/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('video, .vjs-poster, #player', { timeout: 15000 });
    await page.waitForTimeout(1000);
  },
  'embed-chat': async (page, o) => {
    await page.goto(o + '/embed/chat/readwrite/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('body', { timeout: 15000 });
    await page.waitForTimeout(1000);
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
  while (node && node !== document.documentElement) {
    const cs = getComputedStyle(node);
    const c = parse(cs.backgroundColor);
    if (c && (c[3] ?? 1) > 0) { stack.push(c); bgSource.push(cs.backgroundColor + ' sur ' + node.tagName + '.' + (node.className + '').split(' ')[0]); }
    const img = cs.backgroundImage;
    if (!gradientStops && img && img.includes('gradient')) {
      const cols = [...img.matchAll(/rgba?\\([^)]+\\)/g)].map(mm => parse(mm[0])).filter(x => x && (x[3] ?? 1) > 0);
      if (cols.length) gradientStops = cols;
    }
    node = node.parentElement;
  }
  stack.push([255, 255, 255, 1]);
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
  const bad = ['aria-controls', 'aria-owns', 'aria-activedescendant', 'aria-details', 'aria-describedby', 'aria-errormessage', 'aria-flowto', 'aria-labelledby', 'aria-labelledby'];
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

const VIDEO_PROBE = `((sel) => {
  const el = document.querySelector(sel);
  if (!el) return { found: false };
  const tracks = [...el.querySelectorAll('track')].map(t => ({ kind: t.kind, src: t.src, label: t.label }));
  const tt = el.textTracks ? [...el.textTracks].map(t => ({ kind: t.kind, mode: t.mode, label: t.label })) : [];
  return {
    found: true,
    tag: el.tagName,
    src: (el.currentSrc || el.src || '').slice(0, 80),
    readyState: el.readyState,
    paused: el.paused,
    tracksCount: tracks.length,
    textTracksCount: tt.length,
    tracks, textTracks: tt,
    hasCaptionsMenu: !!document.querySelector('.vjs-captions-button, .vjs-subs-caps-button, .vjs-subtitles-button'),
  };
})`;

const TABLE_PROBE = `((sel) => {
  const el = document.querySelector(sel);
  if (!el) return { found: false };
  const thCount = el.querySelectorAll('th').length;
  const tdCount = el.querySelectorAll('td').length;
  const container = el.closest('.ant-table-container, .ant-table, table') || el.parentElement;
  const bodyTable = container ? [...container.querySelectorAll('.ant-table-body table, tbody')] : [];
  const bodyRows = bodyTable.reduce((n, t) => n + t.querySelectorAll('tr').length, 0);
  return {
    found: true,
    thCount,
    tdCount,
    headerOnlyTable: thCount > 0 && tdCount === 0,
    siblingBodyRows: bodyRows,
    containerCls: (container && container.className + '').slice(0, 80),
  };
})`;

const browser = await chromium.launch();
const page = await browser.newPage();
const out = { generatedAt: new Date().toISOString(), baseUrl: BASE, probes: [] };

for (const p of report.pages) {
  const m = p.url.match(/^(.*?)(?: \[state:(.+)\])?$/);
  const url = m[1], state = m[2] || null;
  let stateError = null;
  if (state && STATE_SETUPS[state]) {
    try { await STATE_SETUPS[state](page, BASE.replace(/https?:\/\/[^@/]*@/, s => s)); }
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
      let probe;
      const probeJs = inc.id === 'aria-valid-attr-value' ? ARIA_ATTR_PROBE
        : inc.id === 'video-caption' ? VIDEO_PROBE
        : inc.id === 'th-has-data-cells' ? TABLE_PROBE
        : CONTRAST_PROBE;
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

// Probe supplémentaire : survoler chaque sous-menu antd puis revérifier que l'id aria-controls se résout (lazy-mount)
try {
  await page.goto(BASE + '/admin/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('div[data-menu-id]', { timeout: 15000 });
  await page.waitForTimeout(1500);
  const checks = [];
  const menuIds = await page.$$eval('div[data-menu-id]', els => els.map(e => 'div[data-menu-id="' + e.getAttribute('data-menu-id') + '"]'));
  for (const sel of menuIds) {
    const before = await page.evaluate(ARIA_ATTR_PROBE + `(${JSON.stringify(sel)})`);
    // antd inline n'ouvre pas via click Playwright (handler React) — dispatchEvent natif requis
    await page.evaluate(s => { const el = document.querySelector(s); el && el.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, sel);
    await page.waitForTimeout(1200);
    const after = await page.evaluate(ARIA_ATTR_PROBE + `(${JSON.stringify(sel)})`);
    const popupId = after?.refs?.['aria-controls']?.[0]?.id;
    const popupInDom = popupId ? await page.evaluate(id => !!document.getElementById(id), popupId) : null;
    const expanded = await page.evaluate(s => document.querySelector(s)?.getAttribute('aria-expanded'), sel);
    checks.push({ selector: sel, before, after, expandedAfterClick: expanded, popupInDomAfterOpen: popupInDom });
    // referme pour laisser le DOM propre
    await page.evaluate(s => { const el = document.querySelector(s); el && el.getAttribute('aria-expanded') === 'true' && el.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, sel);
    await page.waitForTimeout(300);
  }
  out.lazyMountCheck = checks;
} catch (e) {
  out.lazyMountCheck = { error: String(e).slice(0, 200) };
}

await browser.close();
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`probes: ${out.probes.length} noeuds -> ${OUT}`);
const unresolving = out.probes.filter(x => x.rule === 'aria-valid-attr-value' && x.refs && Object.values(x.refs).flat().some(r => r.resolves));
console.log('aria refs résolus au repos:', unresolving.length, '/', out.probes.filter(x => x.rule === 'aria-valid-attr-value').length);
const cc = out.probes.filter(x => x.rule === 'color-contrast' || x.rule === 'link-in-text-block');
console.log('contrastes min:', cc.map(x => x.minRatio).filter(Boolean).join(', '));
