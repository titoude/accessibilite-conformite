// incomplete-probes.mjs — sonde rejouable des noeuds 'incomplete' axe du run final.
// Pour chaque noeud incomplet du report.json livré, remesure en DOM live :
//   - couleur de texte calculée (fg)
//   - fond effectif (première couleur solide en remontant les ancêtres)
//   - ratio WCAG calculé
//   - motif axe (overlapped / aria-controls non résoluble) + élément couvrant
// Usage : node incomplete-probes.mjs <baseUrl> <report.json> <out.json> [authState.json]
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8095';
const REPORT = process.argv[3];
const OUT = process.argv[4] || 'incomplete-probes.json';
const AUTH = process.argv[5] || null;

const report = JSON.parse(readFileSync(REPORT, 'utf8'));

// Mêmes setups d'états que audit.mjs (dupliqués pour rejouabilité indépendante)
const STATE_SETUPS = {
  'user-menu': async (page, o) => {
    await page.goto(o + '/#/applications', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#app-table', { timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.locator('#user-menu-button').click();
    await page.locator('#user-menu [role="menuitem"], #user-menu .MuiMenuItem-root').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'nav-drawer-mobile': async (page, o) => {
    await page.goto(o + '/#/', { waitUntil: 'domcontentloaded' });
    await page.setViewportSize({ width: 375, height: 720 });
    await page.waitForSelector('#messages, .message', { timeout: 15000 });
    await page.waitForTimeout(800);
    await page.locator('header .MuiIconButton-root').first().click();
    await page.locator('.MuiModal-root .MuiDrawer-paper').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
    await page.setViewportSize({ width: 1280, height: 720 });
  },
  'add-app-dialog': async (page, o) => {
    await page.goto(o + '/#/applications', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#app-table', { timeout: 15000 });
    await page.waitForTimeout(800);
    await page.locator('#create-app').click();
    await page.locator('[role="dialog"] #form-dialog-title').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'update-app-dialog': async (page, o) => {
    await page.goto(o + '/#/applications', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#app-table tbody tr', { timeout: 15000 });
    await page.waitForTimeout(800);
    await page.locator('#app-table tbody tr .edit').first().click();
    await page.locator('[role="dialog"] #form-dialog-title').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'add-client-dialog': async (page, o) => {
    await page.goto(o + '/#/clients', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#client-table', { timeout: 15000 });
    await page.waitForTimeout(800);
    await page.locator('#create-client').click();
    await page.locator('[role="dialog"] #form-dialog-title').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'elevate-client-dialog': async (page, o) => {
    await page.goto(o + '/#/clients', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#client-table tbody tr', { timeout: 15000 });
    await page.waitForTimeout(800);
    await page.locator('#client-table tbody tr .elevate').first().click();
    await page.locator('[role="dialog"]').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'add-user-dialog': async (page, o) => {
    await page.goto(o + '/#/users', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#user-table', { timeout: 15000 });
    await page.waitForTimeout(800);
    await page.locator('#create-user').click();
    await page.locator('[role="dialog"] #form-dialog-title').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'push-message-dialog': async (page, o) => {
    await page.goto(o + '/#/messages/1', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#push-message', { timeout: 15000 });
    await page.waitForTimeout(800);
    await page.locator('#push-message').click();
    await page.locator('[role="dialog"] #push-message-title').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'confirm-delete-all': async (page, o) => {
    await page.goto(o + '/#/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.message', { timeout: 15000 });
    await page.waitForTimeout(800);
    await page.locator('#delete-all').click();
    await page.locator('.confirm-dialog [role="dialog"], [role="dialog"] #form-dialog-title').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
  'register-dialog': async (page, o) => {
    await page.goto(o + '/#/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#login-form', { timeout: 15000 });
    await page.waitForTimeout(800);
    await page.locator('#register').click();
    await page.locator('[role="dialog"] #form-dialog-title').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(600);
  },
};

const PROBE_JS = `((sel, html) => {
  let el = document.querySelector(sel);
  let resolvedBy = 'target';
  if (!el && html) {
    // repli pour ids dynamiques (ex. MUI _r_N_) : chercher par tag + attributs stables
    const tag = (html.match(/^<([a-z0-9]+)/i) || [])[1] || '';
    const attrs = {};
    for (const m of html.matchAll(/(type|name|autocomplete|role|aria-labelledby)="([^"]*)"/g)) attrs[m[1]] = m[2];
    const sel2 = tag + Object.entries(attrs).map(([k, v]) => '[' + k + '="' + v + '"]').join('');
    const cand = Array.from(document.querySelectorAll(tag)).filter(n =>
      Object.entries(attrs).every(([k, v]) => n.getAttribute(k) === v));
    if (cand.length) { el = cand[0]; resolvedBy = 'html-attrs:' + sel2; }
  }
  if (!el) return { found: false };
  const lum = (r, g, b) => {
    const c = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const parse = (s) => { const m = s.match(/rgba?\\(([^)]+)\\)/); return m ? m[1].split(',').map(Number) : null; };
  const ratio = (f, b) => (Math.max(lum(...f), lum(...b)) + 0.05) / (Math.min(lum(...f), lum(...b)) + 0.05);
  const fg = parse(getComputedStyle(el).color) || [0, 0, 0];
  // fond : remonter jusqu'à une couleur solide non transparente
  let bg = null, bgSource = null, node = el;
  while (node && node !== document.documentElement) {
    const cs = getComputedStyle(node);
    const c = parse(cs.backgroundColor);
    if (c && (c.length >= 4 ? c[3] > 0 : true)) { bg = c; bgSource = cs.backgroundColor + ' sur ' + node.tagName + '.' + (node.className + '').split(' ')[0]; break; }
    node = node.parentElement;
  }
  if (!bg) { bg = parse(getComputedStyle(document.body).backgroundColor) || [255, 255, 255]; bgSource = 'body (chaîne transparente)'; }
  const r = Math.round(ratio(fg, bg) * 100) / 100;
  const rect = el.getBoundingClientRect();
  const covered = (() => { const t = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2); return t && t !== el && !el.contains(t) ? t.tagName + '.' + (t.className + '').split(' ')[0] : null; })();
  // pour aria-valid-attr-value : la cible de aria-controls existe-t-elle ?
  const ac = el.getAttribute('aria-controls');
  const acTarget = ac ? !!document.getElementById(ac) : null;
  return {
    found: true,
    resolvedBy,
    text: (el.innerText || el.textContent || '').slice(0, 60),
    fg: 'rgb(' + fg.slice(0, 3).join(',') + ')',
    bgSource,
    ratio: r,
    ariaControls: ac, ariaControlsResolved: acTarget,
    coveredBy: covered,
    visible: !!(rect.width && rect.height) && getComputedStyle(el).display !== 'none',
  };
})`;

const browser = await chromium.launch();
const ctx = await browser.newContext(AUTH ? { storageState: AUTH } : {});
const page = await ctx.newPage();
const out = { generatedAt: new Date().toISOString(), baseUrl: BASE, probes: [] };

for (const p of report.pages) {
  const m = p.url.match(/^(.*?)(?: \[state:(.+)\])?$/);
  const url = m[1], state = m[2] || null;
  // forcer un vrai rechargement : un goto hash-only est une nav SPA sans reload
  // (portaux/popups résiduels de l'état précédent persisteraient)
  await page.goto('about:blank');
  if (state && STATE_SETUPS[state]) await STATE_SETUPS[state](page, BASE);
  else {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main, #root', { timeout: 15000 });
    await page.waitForTimeout(1500);
  }
  for (const inc of p.incomplete || []) {
    for (const n of inc.nodes) {
      const sel = n.target && n.target[0];
      const motif = (n.any?.[0]?.data?.messageKey) || (n.any?.[0]?.message || n.all?.[0]?.message || '').slice(0, 90);
      let probe;
      try { probe = await page.evaluate(PROBE_JS + `(${JSON.stringify(sel)}, ${JSON.stringify(n.html || '')})`); }
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
