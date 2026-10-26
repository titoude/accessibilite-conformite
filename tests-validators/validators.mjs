#!/usr/bin/env node
/**
 * validators.mjs — counter-examples that test accessibility ASSERTIONS
 * (not the product: the tests themselves).
 *
 * Each case compares a WEAK assertion (permissive: it wrongly passes on the
 * mutant) with the HARDENED assertion prescribed by SKILL.md and implemented in
 * assertions.mjs (shared, reusable module).
 * For each mutant we expect: weak = wrongly passes, hardened = fails.
 * For each valid control: the hardened assertion passes (no false negative).
 *
 * Usage: node tests-validators/validators.mjs (or pnpm test:validators)
 * Requirements: the toolkit's locked dependencies and Chromium
 *   (pnpm install --frozen-lockfile --ignore-scripts && pnpm exec playwright install chromium).
 * Exit: 0 if every hardened assertion detects its mutant and accepts its control.
 */
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { accName, accNameMatches, isTrulyVisible, effectObserved } from './assertions.mjs';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const HTML = `<!doctype html><html><body>
  <ul><li id="item1" class="item unread">Unread item</li></ul>
  <button id="btn" aria-labelledby="no-such-label-id">OK</button>
  <span id="lbl-rich"><img src="x" alt="OK"></span>
  <input id="field" />
  <div id="app"><main id="main-content"><p>Real content</p></main></div>
  <select id="filter"><option value="">—</option><option value="a">A</option></select>
  <ul id="results"><li class="res">alpha</li><li class="res">beta</li></ul>
  <div id="error-page" hidden><p>Error: route not found</p></div>
</body></html>`;

// Mutants applied with evaluate (the "defective product")
const MUTANTS = {
  clean: async () => {},
  // Substring state: the element is "unread", so a weak 'read' assertion passes
  state_unread: async () => {},
  // Empty accessible name: aria-labelledby points to a missing id
  empty_accname: async () => {},
  // Decoy: ANOTHER button has the expected name, so a page-wide test passes
  decoy_button: async (p) => p.evaluate(() => {
    document.body.insertAdjacentHTML('beforeend', '<button id="decoy">OK</button>');
  }),
  // Rich labelledby: the target exists but provides NO accessible content
  // (img without alt, no text); the attribute being present is not enough
  labelledby_empty_target: async (p) => p.$eval('#btn', (e) => {
    const s = document.createElement('span');
    s.id = 'lbl-empty';
    s.innerHTML = '<img src="x">';
    document.body.appendChild(s);
    e.setAttribute('aria-labelledby', 'lbl-empty');
  }),
  // Hidden content: the whole app is hidden but the viewport has a size
  hidden_app: async (p) => p.evaluate(() => { document.getElementById('app').style.display = 'none'; }),
  // isVisible trap: opacity:0 is still "visible" to Playwright
  opacity_app: async (p) => p.evaluate(() => { document.getElementById('app').style.opacity = '0'; }),
  // Missing required element: the filter is not in the DOM
  missing_filter: async (p) => p.evaluate(() => { document.getElementById('filter').remove(); }),
  // Action without effect: the select accepts the option but filters nothing
  filter_no_effect: async () => {},
  // Error page served instead of the expected page
  error_template: async (p) => p.evaluate(() => {
    document.getElementById('main-content').remove();
    document.getElementById('error-page').hidden = false;
  }),
};

const filterControlFix = (p) => p.$eval('#filter', (e) => {
  e.addEventListener('change', () => {
    const v = e.value;
    document.querySelectorAll('#results .res').forEach((li) => {
      li.style.display = li.textContent.startsWith(v) ? '' : 'none';
    });
  });
});

// WEAK assertions (common anti-patterns) vs HARDENED ones
const CHECKS = [
  {
    name: 'state-read-vs-unread',
    mutant: 'state_unread',
    // Control = item actually read; mutant = "unread" item (contains the substring 'read')
    controlFix: async (p) => p.$eval('#item1', e => e.classList.replace('unread', 'read')),
    weak: async (p) => (await p.$eval('#item1', e => e.className)).includes('read'),
    hard: async (p) => await p.$eval('#item1', e => e.classList.contains('read')),
  },
  {
    name: 'empty-accessible-name',
    mutant: 'empty_accname',
    // Control = button whose accessible name really is "OK" (button text)
    controlFix: async (p) => p.$eval('#btn', e => e.removeAttribute('aria-labelledby')),
    weak: async (p) => (await p.$eval('#btn', e => e.getAttribute('aria-labelledby'))) !== null,
    hard: async (p) => accNameMatches(p.locator('#btn'), 'OK'),
  },
  {
    name: 'decoy-same-name',
    mutant: 'decoy_button',
    // The name "OK" exists elsewhere on the page: an unscoped test cannot
    // attribute the name to the right element.
    controlFix: async (p) => p.$eval('#btn', e => e.removeAttribute('aria-labelledby')),
    weak: async (p) => (await p.getByRole('button', { name: 'OK', exact: true }).count()) >= 1,
    hard: async (p) => accNameMatches(p.locator('#btn'), 'OK'),
  },
  {
    name: 'labelledby-empty-target',
    mutant: 'labelledby_empty_target',
    // Control = rich labelledby: the target contains an img alt="OK", so the
    // computed name is correct and the target provides accessible content.
    controlFix: async (p) => p.$eval('#btn', e => e.setAttribute('aria-labelledby', 'lbl-rich')),
    weak: async (p) => {
      const ref = await p.$eval('#btn', e => e.getAttribute('aria-labelledby'));
      return ref !== null && await p.evaluate((id) => document.getElementById(id) !== null, ref);
    },
    hard: async (p) => accNameMatches(p.locator('#btn'), 'OK'),
  },
  {
    name: 'hidden-app-zoom',
    mutant: 'hidden_app',
    weak: async (p) => (await p.evaluate(() => document.documentElement.clientWidth)) > 0,
    hard: async (p) => isTrulyVisible(p.locator('#main-content')),
  },
  {
    name: 'app-opacity-0',
    mutant: 'opacity_app',
    // isVisible() ignores opacity, so the weak "visible" assertion wrongly passes.
    weak: async (p) => p.locator('#main-content').isVisible(),
    hard: async (p) => isTrulyVisible(p.locator('#main-content')),
  },
  {
    name: 'missing-required-element',
    mutant: 'missing_filter',
    // Control = working select with a measurable effect on #results.
    controlFix: filterControlFix,
    weak: async (p) => {
      try { await p.selectOption('#filter', 'a'); return true; }
      catch { return true; } // swallowed error: the flaw
    },
    hard: async (p) => effectObserved(p,
      (pg) => pg.selectOption('#filter', 'a'),
      async (pg) => {
        if (!await pg.$eval('#filter', e => e.value === 'a')) return false;
        // Business effect: a #results container declaring data-filter must
        // reflect the value; otherwise the visible list must have changed.
        const df = await pg.evaluate(() =>
          document.getElementById('results')?.getAttribute('data-filter'));
        if (df !== null && df !== undefined) return df === 'a';
        return await pg.$$eval('#results .res',
          els => els.filter(e => e.offsetParent !== null).length === 1);
      }),
  },
  {
    name: 'filter-without-effect',
    mutant: 'filter_no_effect',
    // Control = the select really filters the list (handler attached).
    controlFix: filterControlFix,
    weak: async (p) => {
      await p.selectOption('#filter', 'a');
      return await p.$eval('#filter', e => e.value === 'a'); // the action succeeded, the effect is not checked
    },
    hard: async (p) => effectObserved(p,
      (pg) => pg.selectOption('#filter', 'a'),
      (pg) => pg.$$eval('#results .res',
        els => els.filter(e => e.offsetParent !== null).length === 1)),
  },
  {
    name: 'error-page-vs-expected-page',
    mutant: 'error_template',
    weak: async (p) => (await p.evaluate(() => document.title !== null)),
    // A present node is not a visible page: a hidden main (hidden/opacity)
    // = FAIL, even if the error container stays hidden.
    hard: async (p) => await p.locator('#main-content').count() === 1
      && await isTrulyVisible(p.locator('#main-content'))
      && await p.locator('#error-page').isHidden(),
  },
];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(1500);
  let detected = 0, total = 0, falseNeg = 0;
  for (const c of CHECKS) {
    // Valid control: both assertions are expected to pass
    await page.setContent(HTML);
    if (c.controlFix) await c.controlFix(page);
    const weakOk = await c.weak(page).catch(() => false);
    const hardOk = await c.hard(page).catch(() => false);
    console.log(`[control] ${c.name}: weak=${weakOk} hard=${hardOk}`);
    if (!hardOk) { falseNeg++; console.log(`  FALSE NEGATIVE: the hardened assertion rejects the valid case`); }
    // Mutant: the hardened assertion must fail (detect the defect)
    await page.setContent(HTML);
    await MUTANTS[c.mutant](page);
    const weakMut = await c.weak(page).catch(() => 'err');
    const hardMut = await c.hard(page).catch(() => false);
    total++;
    const caught = hardMut === false;
    if (caught) detected++;
    console.log(`[mutant] ${c.name}: weak=${weakMut} hard=${hardMut} → ${caught ? 'DETECTED' : 'MISSED'}`);
  }
  await browser.close();
  console.log(`\n${detected}/${total} mutants detected by the hardened assertions, ${falseNeg} false negatives`);
  process.exit(detected === total && falseNeg === 0 ? 0 : 1);
}
main().catch(e => { console.error(e); process.exit(2); });
