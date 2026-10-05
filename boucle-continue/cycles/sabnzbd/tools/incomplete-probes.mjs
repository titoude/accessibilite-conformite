// Sondes manuelles pour les résultats "incomplets" d'axe (cycle 25, sabnzbd).
// - color-contrast : axe ne conclut pas quand le fond effectif est
//   indéterminable (alpha/opacity, couches rgba, position absolue).
//   On recalcule le ratio WCAG 2.x : fg = computed color (x opacité cumulée
//   de l'élément et de ses ancêtres), bg = première couche non transparente
//   en remontant les ancêtres (compositing alpha).
// - link-in-text-block / aria-valid-attr-value / frame-tested : on rapporte
//   la valeur ou le style calculé + verdict argumenté.
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
import { writeFileSync, mkdirSync } from 'node:fs';

const base = process.argv[2] || 'http://127.0.0.1:8080';
const outDir = process.argv[3] || '../reports/probes';

function parse(c) {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(',').map(x => parseFloat(x.trim()));
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
}
const lum = c => {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

const MODAL_STATES = [
  'modal-add-nzb', 'modal-options', 'modal-nzbsearch', 'modal-custom-pause',
  'modal-help', 'modal-sessions', 'modal-purge-history',
  'modal-delete-queue-job', 'modal-delete-history-job', 'modal-retry-job',
];

const SCENARIOS = [
  {
    // Texte navbar/queue sur couches translucides + badges + liens dropdown.
    name: 'queue-page',
    url: `${base}/`,
    setup: async p => { await p.waitForSelector('.queue-item', { state: 'visible' }); },
    sel: [
      '.navbar-timeleft', 'span[data-bind="text: speedText"]',
      'strong[data-bind="text: percentage() + \'%\'"]',
      '.queue-error-info', 'a[data-toggle="dropdown"]',
      '.badge-warning', '.info-container-box:nth-child(2)',
      '.info-container-box:nth-child(3)', 'span[data-bind="text: queueDataLeft"]',
      'span[data-bind="text: diskSpaceLeft1"]', '.timeleft',
      'strong[data-bind="text: allWarnings().length"]',
    ],
  },
  {
    name: 'modal-item-files',
    url: `${base}/`,
    setup: async p => {
      await p.waitForSelector('.queue-item', { state: 'visible' });
      await p.locator('[data-bind*="showFiles"]').dispatchEvent('click');
      await p.waitForSelector('#modal-item-files.in tr.files-sortable', { state: 'visible' });
    },
    sel: [
      '#modal-item-files .modal-header .close',
      '#filelist-showcompleted',
      '#modal-item-files .progress small',
      'input[data-bind="click: filelist.checkAllFiles"]',
    ],
  },
  {
    name: 'modal-options',
    url: `${base}/`,
    setup: async p => {
      await p.click('a[href="#modal-options"]');
      await p.waitForSelector('#modal-options.in #options-status', { state: 'visible' });
    },
    sel: [
      '#modal-options .modal-header .close',
      '#options-status .row:nth-child(2) .col-sm-6',
      'span[data-bind="text: statusInfo.loadavg"]',
      'a[data-size="100MB"]', 'a[data-bind="click: repairQueue"]',
      '.btn-default[type="submit"][data-placement="top"]',
      'label[for="refreshRate-option"]',
    ],
  },
  {
    name: 'modal-add-nzb',
    url: `${base}/`,
    setup: async p => {
      await p.click('a[href="#modal-add-nzb"]');
      await p.waitForSelector('#modal-add-nzb.in', { state: 'visible' });
    },
    sel: [
      '#modal-add-nzb .modal-header .close',
      '#modal-add-nzb legend',
      'label[for="nzbname"]', '#nzbname',
      'label[for="add-nzb-category"]', 'label[for="add-nzb-priority"]',
    ],
  },
  {
    name: 'modal-sessions',
    url: `${base}/`,
    setup: async p => {
      await p.click('.main-menu-link > a');
      await p.waitForSelector('.menu-options', { state: 'visible' });
      await p.click('a[href="#modal-sessions"]');
      await p.waitForSelector('#modal-sessions.in .table-sessions tbody tr', { state: 'visible' });
    },
    sel: [
      '#modal-sessions .modal-header .close',
      '.session-device', 'p:nth-child(6) > small',
    ],
  },
  {
    name: 'modal-custom-pause',
    url: `${base}/`,
    setup: async p => {
      await p.click('.navbar-header .dropdown-toggle');
      await p.waitForSelector('.navbar-header .dropdown-menu', { state: 'visible' });
      await p.click('[data-bind*="openCustomPauseTime"]');
      await p.waitForSelector('#modal-custom-pause.in', { state: 'visible' });
    },
    sel: ['#modal-custom-pause .modal-header .close'],
  },
  {
    name: 'modal-purge-history',
    url: `${base}/`,
    setup: async p => {
      await p.click('a[href="#modal-purge-history"]');
      await p.waitForSelector('#modal-purge-history.in', { state: 'visible' });
    },
    sel: [
      '#modal-purge-history .modal-header .close',
      'button[data-action="history-purge-page"] .label-default',
      'form > .modal-footer .checkbox label span',
    ],
  },
  {
    name: 'modal-retry-job',
    url: `${base}/`,
    setup: async p => {
      await p.waitForSelector('.history-item .retry-button', { state: 'visible' });
      await p.click('.history-item .retry-button');
      await p.waitForSelector('#modal-retry-job.in', { state: 'visible' });
    },
    sel: ['#modal-retry-job .modal-header .close'],
  },
  {
    name: 'history-script-log',
    url: `${base}/`,
    setup: async p => {
      await p.waitForSelector('.history-item', { state: 'visible' });
      await p.click('.history-item:has-text("Films.Documentaire") td.delete a[data-toggle="dropdown"]');
      await p.waitForSelector('.history-item:has-text("Films.Documentaire") .history-status-table', { state: 'visible' });
      await p.click('.history-item:has-text("Films.Documentaire") [data-bind*="showScriptLog"]');
      await p.waitForSelector('#history-script-log.in', { state: 'visible' });
    },
    sel: ['#history-script-log .modal-header .close'],
  },
  {
    name: 'tabbed-history',
    url: `${base}/`,
    setup: async p => {
      await p.evaluate(() => localStorage.setItem('displayTabbed', 'true'));
      await p.reload({ waitUntil: 'load' });
      await p.click('a[href="#history-tab"]');
      await p.waitForSelector('.history-item', { state: 'visible' });
      await p.evaluate(() => localStorage.removeItem('displayTabbed'));
    },
    sel: [
      '.history-item .status[onclick="showDetails(this)"]',
      'td[data-timestamp]', '.history-info',
      'span[data-bind="text: history.downloadedToday"]',
      'span[title="test-job-a11y"]',
    ],
  },
  {
    name: 'rss-edit-modal',
    url: `${base}/config/rss`,
    setup: async p => {
      await p.click('.editFeed');
      await p.waitForSelector('#rss_edit_modal.in', { state: 'visible' });
    },
    sel: ['#rss_edit_modal .modal-header .close'],
  },
  {
    name: 'config-scheduling',
    url: `${base}/config/scheduling`,
    setup: null,
    sel: ['.section:nth-child(2) > .col2 > h2'],
  },
  {
    // iframe externe sabnzbd.org — frame-tested incomplet : cross-origin,
    // axe ne peut pas inspecter son contenu → verdict N-A documenté.
    name: 'wizard-one-frame',
    url: `${base}/wizard/one`,
    setup: null,
    sel: ['iframe'],
    frame: true,
  },
];

const b = await chromium.launch({ args: ['--force-color-profile=srgb'] });
const out = [];
for (const s of SCENARIOS) {
  const ctx = await b.newContext({ storageState: 'auth.json' });
  const page = await ctx.newPage();
  try {
    await page.goto(s.url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(1200);
    if (s.setup) await s.setup(page);
    // Laisse les transitions de fade (.modal.in ~150ms) se terminer :
    // sinon l'opacité cumulée mesurée vaut une fraction et le ratio
    // calculé est un faux négatif.
    await page.waitForFunction(
      () => ![...document.querySelectorAll('.modal.in, .fade.in')]
        .some(el => parseFloat(getComputedStyle(el).opacity) < 0.99),
      null, { timeout: 10000 }
    ).catch(() => {});
    for (const sel of s.sel) {
      const els = await page.$$(sel);
      if (!els.length) { out.push({ scenario: s.name, sel, verdict: 'ABSENT' }); continue; }
      for (let i = 0; i < els.length; i++) {
        const m = await els[i].evaluate(el => {
          const cs = getComputedStyle(el);
          // Opacité cumulée élément + ancêtres (axe signale ces nœuds parce
          // que l'alpha du premier plan ou des couches de fond varie).
          let opacity = 1, node = el;
          while (node && node !== document.documentElement) {
            opacity *= parseFloat(getComputedStyle(node).opacity);
            node = node.parentElement;
          }
          // Couches de fond : premier non-transparent en remontant.
          const layers = [];
          const imgs = [];
          node = el;
          while (node && node !== document.documentElement) {
            const bcs = getComputedStyle(node);
            if (bcs.backgroundImage !== 'none') imgs.push(bcs.backgroundImage.slice(0, 90));
            const bg = bcs.backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') layers.push(bg);
            node = node.parentElement;
          }
          for (const root of [document.body, document.documentElement]) {
            const bg = getComputedStyle(root).backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') layers.push(bg);
          }
          const fs = parseFloat(cs.fontSize);
          const bold = parseInt(cs.fontWeight, 10) >= 700 || cs.fontWeight === 'bold';
          const rect = el.getBoundingClientRect();
          return {
            fg: cs.color, opacity: +opacity.toFixed(3), bgLayers: layers, bgImg: imgs,
            fontSize: fs, bold, w: Math.round(rect.width), h: Math.round(rect.height),
            text: (el.innerText || el.value || '').slice(0, 60),
            tag: el.tagName.toLowerCase(),
            role: el.getAttribute('role') || '',
            ariaExpanded: el.getAttribute('aria-expanded'),
            ariaHaspopup: el.getAttribute('aria-haspopup'),
            textDecoration: cs.textDecorationLine + ' ' + cs.textDecorationStyle,
            title: el.getAttribute('title') || '',
            src: el.getAttribute('src') || '',
          };
        });
        const r = { scenario: s.name, sel, idx: i, ...m };
        if (s.frame) {
          r.verdict = 'N-A'; // cross-origin, contenu non testable par axe/probe
          r.note = `iframe externe ${m.src}`;
        } else if (sel === 'a[data-toggle="dropdown"]') {
          // aria-valid-attr-value incomplet : vérifier les valeurs lues.
          const okExp = m.ariaExpanded === null || ['true', 'false'].includes(m.ariaExpanded);
          const okPop = m.ariaHaspopup === null || ['true', 'menu', 'listbox', 'tree', 'grid', 'dialog'].includes(m.ariaHaspopup);
          r.verdict = okExp && okPop ? 'PASS' : 'FAIL';
          r.note = `aria-expanded=${m.ariaExpanded} aria-haspopup=${m.ariaHaspopup}`;
        } else if (m.w === 0 && m.h === 0) {
          // Pas de boîte de rendu (KO visible:false / display:none au moment
          // de la sonde) : axe l'a listée en incomplet mais le nœud n'est
          // pas affiché -> N-A, jamais PASS à vide.
          r.verdict = 'N-A';
          r.note = 'rect 0x0 : noeud masque (knockout visible:false / display:none)';
        } else {
          // Compositing : bg = première couche opaque ; fg alpha = couche
          // rgba propre x opacité cumulée.
          const bgC = m.bgLayers.map(parse).find(c => c && c.a >= 0.99) || { r: 255, g: 255, b: 255 };
          const fgC = parse(m.fg) || { r: 0, g: 0, b: 0, a: 1 };
          const a = fgC.a * m.opacity;
          const eff = {
            r: fgC.r * a + bgC.r * (1 - a),
            g: fgC.g * a + bgC.g * (1 - a),
            b: fgC.b * a + bgC.b * (1 - a),
          };
          r.bgEff = `rgb(${Math.round(bgC.r)},${Math.round(bgC.g)},${Math.round(bgC.b)})`;
          r.fgEff = `rgb(${Math.round(eff.r)},${Math.round(eff.g)},${Math.round(eff.b)})`;
          r.ratio = +ratio(lum(eff), lum(bgC)).toFixed(2);
          r.large = m.fontSize >= 24 || (m.fontSize >= 18.66 && m.bold);
          const need = r.large ? 3 : 4.5;
          r.verdict = r.ratio >= need ? 'PASS' : 'FAIL';
        }
        out.push(r);
      }
    }
  } catch (e) {
    out.push({ scenario: s.name, verdict: 'ERROR', error: String(e).slice(0, 200) });
  }
  await ctx.close();
}
await b.close();

mkdirSync(outDir, { recursive: true });
const file = `${outDir}/incomplete-probes.json`;
writeFileSync(file, JSON.stringify({ generatedAt: new Date().toISOString(), baseUrl: base, probes: out }, null, 1));
const c = out.reduce((a, r) => (a[r.verdict] = (a[r.verdict] || 0) + 1, a), {});
console.log(file, '->', JSON.stringify(c));
