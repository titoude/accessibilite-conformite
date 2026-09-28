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
 * NOT_TESTED — never a silent pass.
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

const results = [];
const check = async (id, fn) => {
  try {
    const r = await fn();
    results.push({ id, status: r.status, evidence: r.evidence || '' });
    console.log(`[${r.status}] ${id} — ${r.evidence || ''}`);
  } catch (e) {
    results.push({ id, status: 'FAIL', evidence: `exception: ${e.message.split('\n')[0]}` });
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
// contributes content (text, aria-label, or img alt). Returns a descriptor
// {mechanism, ok} — used to distinguish a *real* label association from a
// name that merely comes from the element's own text.
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
        const content = (t.getAttribute('aria-label') || '').trim()
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

// toHaveAccessibleName on the exact locator -> {named, actual} pair.
async function computedName(locator) {
  const el = locator.first();
  if (await el.count() === 0) return { named: null, actual: null };
  try {
    await expect(el).toHaveAccessibleName(/.+/, { timeout: 3000 });
    return { named: true, actual: 'non-empty' };
  } catch {
    try {
      await expect(el).toHaveAccessibleName('', { timeout: 3000 });
      return { named: false, actual: '' };
    } catch (e) {
      return { named: false, actual: `unresolved (${e.message.split('\n')[0].slice(0, 100)})` };
    }
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 960 } });
const page = await ctx.newPage();

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

// C5 — focus indicator on the search input (keyboard focus -> perceivable style)
await check('focus_indicator_search_input', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  // Move focus away then back with Shift+Tab so :focus-visible heuristics
  // apply to a real keyboard entry (autofocus at load doesn't exercise them).
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  let ok = await page.evaluate(() => document.activeElement && document.activeElement.id === 'search-bar');
  if (!ok) {
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      ok = await page.evaluate(() => document.activeElement && document.activeElement.id === 'search-bar');
      if (ok) break;
    }
  }
  if (!ok) {
    for (let i = 0; i < 10 && !ok; i++) {
      await page.keyboard.press('Shift+Tab');
      ok = await page.evaluate(() => document.activeElement && document.activeElement.id === 'search-bar');
    }
  }
  if (!ok) return NT('could not keyboard-focus #search-bar');
  const ind = await page.evaluate(() => {
    const cs = getComputedStyle(document.activeElement);
    const ow = parseFloat(cs.outlineWidth);
    return {
      hasOutline: cs.outlineStyle !== 'none' && ow > 0,
      hasShadow: cs.boxShadow !== 'none',
      outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
      boxShadow: cs.boxShadow.slice(0, 80),
    };
  });
  return (ind.hasOutline || ind.hasShadow)
    ? P(`outline=${ind.outline}; boxShadow=${ind.boxShadow}`)
    : F(`no perceivable focus indicator (outline=${ind.outline}, boxShadow=${ind.boxShadow})`);
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
  return opened ? P('config panel gained .open after Enter') : F('Enter on config button did not open the panel');
});

// C7 — every field inside the opened config panel: computed name + declared label
await check('config_fields_named', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  await page.locator('#config-collapsible').click();
  await page.waitForSelector('.content.open', { timeout: 5000 });
  const fields = page.locator('.content.open select, .content.open input[type="text"], .content.open input[type="number"], .content.open textarea');
  const n = await fields.count();
  if (n === 0) return NT('no form fields found inside open config panel');
  const unnamed = [];
  let checked = 0;
  for (let i = 0; i < n; i++) {
    const f = fields.nth(i);
    // Conditionally-hidden fields (e.g. custom user-agent shown only for a
    // specific select value) have no accessible name until revealed — skip.
    if (!(await isTrulyVisible(f))) continue;
    checked++;
    const id = (await f.getAttribute('id').catch(() => null)) || `index ${i}`;
    const { named } = await computedName(f);
    const decl = await declaredLabel(f);
    if (!named || !decl.ok) unnamed.push(`${id} (named=${named}, label=${decl.mechanism}${decl.ok ? ':ok' : ':missing'})`);
  }
  if (checked === 0) return NT('all config fields conditionally hidden');
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

// C9 — zoom proxy 200%: viewport 640x480 (200% of 1280x960 CSS reference)
await check('zoom_200_proxy', async () => {
  const p2 = await browser.newPage({ viewport: { width: 640, height: 480 } });
  try {
    const r = await p2.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
    if (!r || r.status() >= 400) { await p2.close(); return F(`HTTP ${r && r.status()}`); }
    const visible = await isTrulyVisible(p2.locator('#search-bar'));
    let typedOk = false;
    if (visible) {
      await p2.locator('#search-bar').click();
      await p2.keyboard.type('zoom');
      typedOk = (await p2.locator('#search-bar').inputValue()) === 'zoom';
    }
    await p2.close();
    if (!visible) return F('#search-bar not truly visible at 640x480 (200% proxy)');
    if (!typedOk) return F('#search-bar visible but not operable at 200% proxy');
    return P('search input visible and operable at 640x480');
  } catch (e) { await p2.close(); throw e; }
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

// C12 — bypass mechanism: skip link OR main landmark on home
await check('bypass_mechanism', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  const info = await page.evaluate(() => {
    const main = document.querySelector('main, [role="main"]');
    const links = Array.from(document.querySelectorAll('a[href^="#"]'));
    const skip = links.find(a => /skip|content|main|aller|contenu/i.test(a.textContent || ''));
    return { hasMain: !!main, skipHref: skip ? skip.getAttribute('href') : null, skipText: skip ? skip.textContent.trim() : null };
  });
  if (info.skipHref) return P(`skip link "${info.skipText}" -> ${info.skipHref}`);
  if (info.hasMain) return P('main landmark present (partial bypass support)');
  return F('no skip link and no main landmark on /');
});

// C13 — all visible links on home have non-empty computed accessible names
await check('link_names_home', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load', timeout: 30000 });
  const links = page.locator('a[href]');
  const n = await links.count();
  let unnamed = 0, checked = 0;
  for (let i = 0; i < n; i++) {
    const l = links.nth(i);
    if (!(await isTrulyVisible(l))) continue;
    checked++;
    const { named } = await computedName(l);
    if (!named) unnamed++;
  }
  return checked === 0 ? NT('no visible links')
    : unnamed === 0 ? P(`${checked} visible links all named`)
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
