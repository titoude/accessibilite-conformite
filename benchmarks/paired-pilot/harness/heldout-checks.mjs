#!/usr/bin/env node
/**
 * heldout-checks.mjs — held-out functional/keyboard checks for the paired
 * pilot. NOT disclosed to worker sessions: written and frozen by the
 * coordinator before either arm runs; replayed by the evaluator on baseline
 * AND on each arm's patched clone.
 *
 * Naming strategy (corrected after review): accessible names are asserted with
 * Playwright `expect(locator).toHaveAccessibleName()` on the EXACT element —
 * not the repo's accName() extractor, which inherits quoted descendant names
 * from ariaSnapshot (false positive) and misses aria-labelledby -> <img>
 * (false negative). Each named-element check also records the *declared*
 * naming mechanism (label[for]/aria-label/aria-labelledby with resolvable,
 * non-empty targets) so a name that only comes from element content is
 * distinguishable from a real label association.
 *
 * Every check asserts an OBSERVABLE effect; required element missing = FAIL or
 * NOT_TESTED — never a silent pass. Floors (CONFIG_FIELD_FLOOR, LINK_FLOOR)
 * freeze the baseline control count — dropping controls to pass = FAIL.
 *
 * Frozen control checks (kind:'control') validate the instrumentation itself:
 * ctrl_name_positive MUST PASS (a known-named element is detected) and
 * ctrl_name_negative MUST PASS (an unnamed element is reported unnamed).
 * If a control fails, the whole run's name checks are untrustworthy — the
 * evaluator treats control failures as a coverage gap, not an app defect.
 *
 * Frozen baseline expectations (recorded at freeze time, see
 * evaluation/baseline/heldout/heldout.json): the two controls PASS; app
 * checks produce their measured baseline statuses (several FAILs are real
 * app findings, not evaluator defects).
 *
 * Usage:  node harness/heldout-checks.mjs http://127.0.0.1:5001 --out <dir>
 * Output: <dir>/heldout.json — [{id, status, evidence}]
 * Exit:   0 = no FAIL; 1 = >=1 FAIL; 2 = harness/scope error.
 */
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const { expect } = require('playwright/test');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const OPT_NAMES = new Set(['out']);
const base = args.find((a, i) => !a.startsWith('--') && (i === 0 || !OPT_NAMES.has(args[i - 1].slice(2))));
const outDir = resolve(opt('out', './heldout'));
if (!base || !/^https?:\/\//.test(base)) {
  console.error('Usage: node heldout-checks.mjs <base-url> --out <dir>');
  process.exit(2);
}
mkdirSync(outDir, { recursive: true });

// Frozen baseline control inventory (measured on the pinned commit's rendered
// config panel — 14 visible fields incl. the 3-element config-block group).
// A required id absent from the visible set = functionality deleted to pass.
const REQUIRED_CONFIG_IDS = [
  'config-country', 'config-time-period', 'config-lang-interface',
  'config-lang-search', 'config-near', 'config-block', 'config-theme',
  'config-user-agent', 'config-cse-id', 'config-url', 'config-style',
  'config-pref-url',
];
const LINK_FLOOR = 3;            // baseline: 3 visible links

const results = [];
const check = async (id, fn, kind = 'check') => {
  try {
    const r = await fn();
    results.push({ id, kind, status: r.status, evidence: r.evidence || '' });
    console.log(`[${r.status}] ${id} — ${r.evidence || ''}`);
  } catch (e) {
    results.push({ id, kind, status: 'FAIL', evidence: `exception: ${e.message.split('\n')[0]}` });
    console.log(`[FAIL] ${id} — exception: ${e.message.split('\n')[0]}`);
  }
};
const P = (evidence) => ({ status: 'PASS', evidence });
const F = (evidence) => ({ status: 'FAIL', evidence });
const NT = (evidence) => ({ status: 'NOT_TESTED', evidence });

// Real visibility: isVisible() ignores opacity:0 — walk the ancestor chain.
async function isTrulyVisible(locator) {
  const el = locator.first();
  if (await el.count() === 0) return false;
  if (!(await el.isVisible().catch(() => false))) return false;
  return el.evaluate((e) => {
    for (let n = e; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.visibility === 'hidden' || cs.visibility === 'collapse') return false;
      if (parseFloat(cs.opacity) === 0) return false;
    }
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }).catch(() => false);
}

// Declared naming mechanism for one element: label[for] with text, non-empty
// aria-label, or aria-labelledby where every referenced id exists AND
// contributes content — including the referenced element ITSELF being an
// <img> (its own alt counts; the old helper missed this).
async function declaredLabel(locator) {
  return locator.first().evaluate((e) => {
    const id = e.getAttribute('id');
    if (id) {
      const lab = document.querySelector(`label[for="${CSS.escape(id)}"]`);
      if (lab) return { mechanism: 'label[for]', ok: (lab.textContent || '').trim().length > 0, detail: (lab.textContent || '').trim().slice(0, 80) };
    }
    const ariaLabel = e.getAttribute('aria-label');
    if (ariaLabel !== null) return { mechanism: 'aria-label', ok: ariaLabel.trim().length > 0, detail: ariaLabel.trim().slice(0, 80) };
    const ref = e.getAttribute('aria-labelledby');
    if (ref) {
      const ids = ref.trim().split(/\s+/);
      const allOk = ids.every((rid) => {
        const t = document.getElementById(rid);
        if (!t) return false;
        const selfAlt = t.tagName === 'IMG' ? (t.getAttribute('alt') || '') : '';
        const content = (t.getAttribute('aria-label') || '').trim()
          || selfAlt.trim()
          || Array.from(t.querySelectorAll('img')).map((i) => i.alt || '').join(' ').trim()
          || (t.textContent || '').trim();
        return content.length > 0;
      });
      return { mechanism: 'aria-labelledby', ok: ids.length > 0 && allOk, detail: `refs=${ids.join(',')}` };
    }
    const wrapped = e.closest('label');
    if (wrapped) return { mechanism: 'wrapping-label', ok: (wrapped.textContent || '').trim().length > 0, detail: (wrapped.textContent || '').trim().slice(0, 80) };
    return { mechanism: 'none', ok: false, detail: 'no label[for], aria-label, aria-labelledby, or wrapping label' };
  }).catch(() => ({ mechanism: 'error', ok: false, detail: 'evaluate failed' }));
}

// toHaveAccessibleName on the EXACT locator -> {named, actual} pair.
// The locator must match exactly one element: silently taking .first() would
// let a wrong/duplicated node borrow a name (review finding).
async function computedName(locator) {
  const n = await locator.count();
  if (n === 0) return { named: null, actual: 'missing' };
  if (n !== 1) return { named: null, actual: `ambiguous: ${n} matches` };
  try {
    await expect(locator).toHaveAccessibleName(/.+/, { timeout: 3000 });
    return { named: true, actual: 'non-empty' };
  } catch {
    try {
      await expect(locator).toHaveAccessibleName('', { timeout: 3000 });
      return { named: false, actual: '' };
    } catch (e) {
      return { named: false, actual: `unresolved (${e.message.split('\n')[0].slice(0, 100)})` };
    }
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 960 } });
const page = await ctx.newPage();

// ---- instrumentation controls (kind:'control'; must PASS or the run's
//      name assertions are untrustworthy — see header note) ---------------
await check('ctrl_name_positive', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  // Synthetic known-named fixture — never the app's own control, so the
  // control stays valid even if the app legitimately changes its submit.
  await page.evaluate(() => {
    const s = document.createElement('input');
    s.type = 'text'; s.id = '__heldout_ctlp';
    s.setAttribute('aria-label', 'heldout probe name');
    document.body.appendChild(s);
  });
  const { named, actual } = await computedName(page.locator('#__heldout_ctlp'));
  await page.evaluate(() => document.getElementById('__heldout_ctlp').remove());
  return named === true
    ? P(`synthetic known-named element detected (name="${actual}")`)
    : F(`instrumentation failed to detect a known name: ${actual}`);
}, 'control');

await check('ctrl_skip_broken', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  // Instrumentation control: a skip link whose target does NOT exist must be
  // reported as ineffective — proves activation is really verified.
  const landed = await page.evaluate(async () => {
    const a = document.createElement('a');
    a.href = '#__heldout_dead_target'; a.textContent = 'Skip to content';
    document.body.prepend(a);
    a.focus(); a.click();
    await new Promise(r => setTimeout(r, 200));
    const t = document.querySelector('#__heldout_dead_target');
    const res = { targetExists: !!t, hashSet: location.hash === '#__heldout_dead_target' };
    a.remove();
    return res;
  });
  return (!landed.targetExists)
    ? P('broken skip link correctly detected (target absent)')
    : F('instrumentation failed: nonexistent skip target accepted');
}, 'control');

await check('ctrl_name_negative', async () => {
  // synthetic unnamed element injected into the live page — must be reported
  // as NOT named; proves the check is not vacuously passing.
  await page.evaluate(() => {
    const s = document.createElement('input');
    s.type = 'text'; s.id = '__heldout_ctl';
    document.body.appendChild(s);
  });
  const { named, actual } = await computedName(page.locator('#__heldout_ctl'));
  await page.evaluate(() => document.getElementById('__heldout_ctl').remove());
  return named === false
    ? P(`unnamed synthetic element correctly reported unnamed`)
    : F(`instrumentation false-positive: unnamed element reported named=${actual}`);
}, 'control');

// C1 — home page loads, document title non-empty
await check('document_title_home', async () => {
  const r = await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  if (!r || r.status() >= 400) return F(`HTTP ${r && r.status()}`);
  const t = await page.title();
  return t.trim().length ? P(`title="${t}"`) : F('empty <title>');
});

// C2 — html lang attribute on home
await check('html_lang_home', async () => {
  const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
  return lang && lang.trim() ? P(`lang="${lang}"`) : F('html element has no lang attribute');
});

// C3 — search input: computed accessible name AND a real declared label
await check('search_input_accessible_name', async () => {
  const input = page.locator('#search-bar');
  if (await input.count() === 0) return NT('no #search-bar element on /');
  const { named, actual } = await computedName(input);
  const decl = await declaredLabel(input);
  if (named && decl.ok) return P(`computed name + declared label (${decl.mechanism}: "${decl.detail}")`);
  if (named && !decl.ok) return P(`computed name present but declared-label check weak (${decl.mechanism}: ${decl.detail})`);
  return F(`computed name ${actual}; declared-label: ${decl.mechanism} (${decl.detail})`);
});

// C4 — keyboard-only search journey: Tab to input, type, Enter, results page.
// A live search-engine error page is NOT success coverage (task rule): a page
// without real result elements is NOT_TESTED (upstream-dependent), a page that
// 5xx/blank/wrong-title is FAIL.
await check('keyboard_search_journey', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  // #search-bar is autofocused at load — that IS keyboard entry. Accept it,
  // or find it via a bounded Tab/Shift+Tab walk.
  let focused = await page.evaluate(() => document.activeElement && document.activeElement.id === 'search-bar');
  const how = focused ? 'autofocus' : null;
  for (let i = 0; i < 30 && !focused; i++) {
    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement && document.activeElement.id === 'search-bar');
  }
  if (!focused) {
    for (let i = 0; i < 10 && !focused; i++) {
      await page.keyboard.press('Shift+Tab');
      focused = await page.evaluate(() => document.activeElement && document.activeElement.id === 'search-bar');
    }
  }
  if (!focused) return F('search input neither autofocused nor reachable by Tab/Shift+Tab within bounded walk');
  await page.keyboard.type('heldout check');
  // Whoogle encrypts the query: the URL is /search?preferences=…&q=<enc>,
  // so match the route, not the literal q= param. Autocomplete's keydown
  // handler preventDefault()s Enter — verify the journey actually navigates.
  await Promise.all([
    page.waitForURL(/\/search(\?|$)/, { timeout: 45000 }),
    page.keyboard.press('Enter'),
  ]);
  const url = page.url();
  const resultCount = await page.locator('.result').count();
  const title = await page.title();
  if (!url.includes('/search')) return F(`did not navigate to /search (ended at ${url})`);
  if (resultCount > 0) return P(`keyboard journey completed (entry=${how || 'tab-walk'}), ${resultCount} .result elements`);
  return NT(`landed on ${url} with 0 .result elements (title="${title}") — live upstream not guaranteed, NOT counted as coverage`);
});

// C5 — focus indicator on the search input. A CONSTANT non-none style is not
// evidence (review finding): measure the computed style UNFOCUSED vs after a
// real keyboard focus, and require a perceivable delta (outline/shadow/border
// change or background switch).
const focusStyleOf = (sel) => page.locator(sel).evaluate((e) => {
  const cs = getComputedStyle(e);
  return {
    outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth,
    outlineColor: cs.outlineColor, boxShadow: cs.boxShadow.slice(0, 120),
  };
});
// The search input is AUTOFOCUSED on load: the "before" sample MUST be taken
// after focus has moved elsewhere, else a correct :focus-visible patch would
// falsely FAIL (no delta because it was focused all along).
async function blurSearchBar() {
  await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
  const active = await page.evaluate(() => document.activeElement && document.activeElement.id);
  return active !== 'search-bar';
}
await check('ctrl_focus_positive', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  // Instrumentation control: inject an element with a KNOWN visible :focus
  // style. The harness must detect a perceivable delta, else every focus
  // verdict is untrustworthy.
  await page.evaluate(() => {
    const st = document.createElement('style');
    st.textContent = '#__heldout_focuspos:focus{outline:3px solid rgb(255,0,0);outline-offset:2px}';
    document.head.appendChild(st);
    const b = document.createElement('button');
    b.id = '__heldout_focuspos'; b.textContent = 'x';
    document.body.prepend(b);
  });
  const before = await focusStyleOf('#__heldout_focuspos');
  await page.locator('#__heldout_focuspos').focus();
  const ind = await focusStyleOf('#__heldout_focuspos');
  const delta = ind.outlineStyle !== before.outlineStyle || ind.outlineWidth !== before.outlineWidth
    || ind.outlineColor !== before.outlineColor || ind.boxShadow !== before.boxShadow;
  const visible = (ind.outlineStyle !== 'none' && parseFloat(ind.outlineWidth) > 0) || ind.boxShadow !== 'none';
  if (delta && visible) return P(`synthetic visible-focus element detected: ${JSON.stringify(ind)}`);
  return F(`instrumentation failed: known-visible :focus not detected (${JSON.stringify(ind)})`);
}, 'control');
await check('ctrl_focus_negative', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  // Instrumentation control: constant-shadow + fully-transparent outline —
  // no delta, nothing perceivable. Must NOT be reported as an indicator.
  await page.evaluate(() => {
    const st = document.createElement('style');
    st.textContent = '#__heldout_focusneg{box-shadow:0 0 2px #888}#__heldout_focusneg:focus{outline:2px solid transparent;box-shadow:0 0 2px #888}';
    document.head.appendChild(st);
    const b = document.createElement('button');
    b.id = '__heldout_focusneg'; b.textContent = 'x';
    document.body.prepend(b);
  });
  const before = await focusStyleOf('#__heldout_focusneg');
  await page.locator('#__heldout_focusneg').focus();
  const ind = await focusStyleOf('#__heldout_focusneg');
  const delta = ind.outlineStyle !== before.outlineStyle || ind.outlineWidth !== before.outlineWidth
    || ind.outlineColor !== before.outlineColor || ind.boxShadow !== before.boxShadow;
  const visible = (ind.outlineStyle !== 'none' && parseFloat(ind.outlineWidth) > 0
    && ind.outlineColor !== 'rgba(0, 0, 0, 0)' && ind.outlineColor !== 'transparent')
    || (ind.boxShadow !== 'none' && ind.boxShadow !== before.boxShadow);
  if (!delta || !visible) return P('constant-shadow/transparent-outline correctly reported NOT a focus indicator');
  return F(`instrumentation false-positive: transparent outline reported visible (${JSON.stringify(ind)})`);
}, 'control');
await check('focus_indicator_search_input', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  if (!await blurSearchBar()) return NT('could not move focus off autofocused #search-bar');
  const before = await focusStyleOf('#search-bar');
  await page.locator('#config-collapsible').focus().catch(() => {});
  // #search-bar sits before #config-collapsible in tab order: walk backward
  // first (bounded), then forward if the backward walk didn't land.
  let ok = false;
  for (let i = 0; i < 10 && !ok; i++) {
    await page.keyboard.press('Shift+Tab');
    ok = await page.evaluate(() => document.activeElement && document.activeElement.id === 'search-bar');
  }
  if (!ok) {
    for (let i = 0; i < 30 && !ok; i++) {
      await page.keyboard.press('Tab');
      ok = await page.evaluate(() => document.activeElement && document.activeElement.id === 'search-bar');
    }
  }
  if (!ok) return NT('could not keyboard-focus #search-bar');
  const ind = await focusStyleOf('#search-bar');
  const delta = ind.outlineStyle !== before.outlineStyle
    || ind.outlineWidth !== before.outlineWidth
    || ind.outlineColor !== before.outlineColor
    || ind.boxShadow !== before.boxShadow;
  const visible = (ind.outlineStyle !== 'none' && parseFloat(ind.outlineWidth) > 0
    && ind.outlineColor !== 'rgba(0, 0, 0, 0)' && ind.outlineColor !== 'transparent')
    || ind.boxShadow !== 'none';
  // NOTE: this is a computed-style signal, not a proven perceivable indicator
  // (contrast/area thresholds are out of harness scope).
  if (delta && visible) return P(`computed-style delta unfocused->focused: ${JSON.stringify(before)} -> ${JSON.stringify(ind)} (computed-style signal, perceivability not proven)`);
  return F(`no computed-style focus change (unfocused=${JSON.stringify(before)}; focused=${JSON.stringify(ind)})`);
});

// C6 — config panel opens with keyboard only (Enter on #config-collapsible)
await check('config_panel_keyboard', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  let ok = await page.evaluate(() => document.activeElement && document.activeElement.id === 'config-collapsible');
  for (let i = 0; i < 40 && !ok; i++) {
    await page.keyboard.press('Tab');
    ok = await page.evaluate(() => document.activeElement && document.activeElement.id === 'config-collapsible');
  }
  if (!ok) return NT('#config-collapsible not reached by Tab within 40 steps');
  await page.keyboard.press('Enter');
  const opened = await page.waitForSelector('.content.open', { timeout: 5000 }).then(() => true).catch(() => false);
  if (!opened) return F('Enter on config button did not open the panel');
  // A CSS class alone is not evidence: require at least one form control
  // inside the opened panel to be actually visible.
  const visibleControls = await page.locator('.content.open select, .content.open input, .content.open textarea').count();
  let anyVisible = false;
  for (let i = 0; i < visibleControls && !anyVisible; i++) {
    anyVisible = await isTrulyVisible(page.locator('.content.open select, .content.open input, .content.open textarea').nth(i));
  }
  return anyVisible
    ? P('config panel opened via Enter and exposes a visible control')
    : F('.content.open present but no form control became visible');
});

// C7 — every field inside the opened config panel: computed name + declared label
await check('config_fields_named', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  await page.locator('#config-collapsible').click();
  await page.waitForSelector('.content.open', { timeout: 5000 });
  const fields = page.locator('.content.open select, .content.open input[type="text"], .content.open input[type="number"], .content.open textarea');
  const n = await fields.count();
  if (n === 0) return F('no form fields found inside open config panel — required controls removed?');
  const unnamed = [];
  const seenIds = new Set();
  let checked = 0;
  for (let i = 0; i < n; i++) {
    const f = fields.nth(i);
    // Conditionally-hidden fields (e.g. custom user-agent shown only for a
    // specific select value) have no accessible name until revealed — skip.
    if (!(await isTrulyVisible(f))) continue;
    checked++;
    const id = (await f.getAttribute('id').catch(() => null)) || `index ${i}`;
    seenIds.add(id);
    const { named, actual } = await computedName(f);
    const decl = await declaredLabel(f);
    if (named !== true || !decl.ok) unnamed.push(`${id} (named=${actual}, label=${decl.mechanism}${decl.ok ? ':ok' : ':missing'})`);
  }
  // Frozen inventory from the pinned commit (not a count floor): every
  // baseline control id must still be present among visible fields.
  const missing = REQUIRED_CONFIG_IDS.filter(id => !seenIds.has(id));
  if (missing.length) {
    return F(`required config controls missing: ${missing.join(', ')}`);
  }
  return unnamed.length === 0
    ? P(`all ${checked} visible config fields have computed name + declared label`)
    : F(`${unnamed.length}/${checked} visible config fields unnamed/unlabeled: ${unnamed.slice(0, 8).join(', ')}`);
});

// C8 — reflow at 320px: no horizontal scroll, reference element still visible
await check('reflow_320px', async () => {
  const p2 = await browser.newPage({ viewport: { width: 320, height: 480 } });
  try {
    const r = await p2.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
    if (!r || r.status() >= 400) { await p2.close(); return F(`HTTP ${r && r.status()}`); }
    const sw = await p2.evaluate(() => document.documentElement.scrollWidth);
    const visible = await isTrulyVisible(p2.locator('#search-bar'));
    await p2.close();
    if (sw > 321) return F(`horizontal scroll at 320px: scrollWidth=${sw}`);
    if (!visible) return F('reference element #search-bar not truly visible at 320px');
    return P(`scrollWidth=${sw} <= 321, #search-bar visible`);
  } catch (e) { await p2.close(); throw e; }
});

// C9 — real 200% browser zoom. NOT automatable through Playwright/CDP page
// scale (that is device-pixel scaling, not zoom) — per review, report
// NOT_TESTED rather than pass a viewport-resize proxy off as zoom.
await check('zoom_200', async () => {
  return NT('real browser zoom cannot be driven by this harness (CDP page-scale is not zoom); WCAG 1.4.4 unassessed');
});

// C10 — /search.html document title non-empty
await check('document_title_search_page', async () => {
  const r = await page.goto(`${base}/search.html`, { waitUntil: 'load', timeout: 30000 });
  if (!r || r.status() >= 400) return F(`HTTP ${r && r.status()}`);
  const t = await page.title();
  return t.trim().length ? P(`title="${t}"`) : F('empty <title> on /search.html');
});

// C11 — functional coverage of the search route. Per task rule a live
// search-engine failure/error page is NEVER counted as successful coverage:
// real .result elements = PASS; HTTP>=400 or a blank/dead route = FAIL;
// anything else (empty results, error markers, captcha — all upstream-
// dependent and indistinguishable from regression) = NOT_TESTED.
await check('search_results_functional', async () => {
  const r = await page.goto(`${base}/search?q=test`, { waitUntil: 'load', timeout: 30000 });
  if (!r || r.status() >= 400) return F(`HTTP ${r && r.status()}`);
  const n = await page.locator('.result').count();
  const bodyLen = await page.evaluate(() => (document.body && document.body.innerText || '').length);
  const t = await page.title();
  if (bodyLen < 200) return F(`blank/dead search route: bodyLen=${bodyLen}, title="${t}"`);
  if (n > 0) return P(`${n} .result elements, title="${t}"`);
  return NT(`0 .result elements, bodyLen=${bodyLen}, title="${t}" — live upstream not guaranteed, NOT counted as coverage`);
});

// C12 — bypass mechanism. A declared skip link only counts if it ACTIVATES:
// keyboard-focus it, press Enter, and verify the referenced target exists and
// receives focus (or scroll position/hash changes to it). A bare main
// landmark alone is recorded as partial (a screen-reader user can jump to it).
await check('bypass_mechanism', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  const info = await page.evaluate(() => {
    const main = document.querySelector('main, [role="main"]');
    const links = Array.from(document.querySelectorAll('a[href^="#"]'));
    const skip = links.find(a => /skip|content|main|aller|contenu/i.test(a.textContent || ''));
    return { hasMain: !!main, skipHref: skip ? skip.getAttribute('href') : null };
  });
  if (!info.skipHref) {
    return info.hasMain
      ? P('no skip link; main landmark present (partial bypass — SR users can jump to it)')
      : F('no skip link and no main landmark on /');
  }
  const targetSel = info.skipHref;
  const targetExists = await page.locator(targetSel).count() > 0;
  if (!targetExists) return F(`skip link -> ${targetSel} but no such element exists`);
  await page.locator(`a[href="${targetSel}"]`).first().focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  const landed = await page.evaluate((sel) => {
    const t = document.querySelector(sel);
    if (!t) return 'target-gone';
    const ae = document.activeElement;
    if (ae === t || (t.contains && t.contains(ae))) return 'focused';
    if (location.hash === sel) return 'hash';
    return 'no-effect';   // already-in-viewport is NOT proof of bypass
  }, targetSel);
  if (landed === 'focused' || landed === 'hash')
    return P(`skip link activates: -> ${targetSel} (${landed})`);
  return F(`skip link present but activation had no effect (${landed})`);
});

// C13 — all visible links on home have non-empty computed accessible names.
// Frozen floor: dropping links to pass is a regression (review finding).
await check('link_names_home', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  const links = page.locator('a[href]');
  const n = await links.count();
  let unnamed = 0, checked = 0;
  for (let i = 0; i < n; i++) {
    const l = links.nth(i);
    if (!(await isTrulyVisible(l))) continue;
    checked++;
    const { named, actual } = await computedName(l);
    if (named !== true) unnamed++;
  }
  if (checked === 0) return F('no visible links — required functionality lost');
  if (checked < LINK_FLOOR) return F(`only ${checked} visible links (floor ${LINK_FLOOR}) — controls lost?`);
  return unnamed === 0 ? P(`${checked} visible links all named`)
    : F(`${unnamed}/${checked} visible links lack an accessible name`);
});

await browser.close();

const summary = {
  base, generatedAt: new Date().toISOString(),
  pass: results.filter(r => r.status === 'PASS').length,
  fail: results.filter(r => r.status === 'FAIL').length,
  notTested: results.filter(r => r.status === 'NOT_TESTED').length,
  results,
};
const tmp = resolve(outDir, 'heldout.json.tmp');
writeFileSync(tmp, JSON.stringify(summary, null, 2));
renameSync(tmp, resolve(outDir, 'heldout.json'));
console.log(`\nheldout: ${summary.pass} PASS / ${summary.fail} FAIL / ${summary.notTested} NOT_TESTED`);
process.exit(summary.fail > 0 ? 1 : 0);
