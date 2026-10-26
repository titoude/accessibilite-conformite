import { expect } from '@playwright/test';

/**
 * assertions.mjs — HARDENED accessibility assertion helpers.
 *
 * Shared by verification scripts and by tests-validators/validators.mjs. Each
 * helper applies SKILL.md's testing rules: observable effect (not the action),
 * COMPUTED accessible name, real visibility (including opacity), and a missing
 * required element = failure.
 */

/**
 * Diagnostic extract of the first ariaSnapshot node, kept for compatibility.
 * Do not use it as evidence: a generic container can be omitted from the
 * snapshot. Use accNameMatches to check the exact locator's name.
 */
export async function accName(locator) {
  if (await locator.count() !== 1) return '';
  const snap = await locator.ariaSnapshot().catch(() => '');
  // Format "role \"name\"" or "- role \"name\""; escaped quotes are
  // decoded. An element without a name produces just "role" → ''.
  const m = snap.split('\n')[0].match(/"((?:[^"\\]|\\.)*)"/);
  return m ? m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\') : '';
}

/**
 * Accessible name == expected, on THE given locator (not the whole page: a
 * decoy with the same name elsewhere must not make the test pass).
 * Playwright's engine computes the locator's name, not a child's.
 * In addition, this strict contract rejects aria-labelledby references that
 * are dead or have no text/alternative content, even if the browser falls back
 * to the control's content. This guard is not a standalone WCAG rule.
 */
export async function accNameMatches(locator, expected) {
  if (await locator.count() !== 1) return false;
  const el = locator;
  try {
    await expect(el).toHaveAccessibleName(expected, { timeout: 1000 });
  } catch {
    return false;
  }
  return el.evaluate((e) => {
    const ref = e.getAttribute('aria-labelledby');
    if (!ref) return true;
    return ref.trim().split(/\s+/).every((id) => {
      const t = document.getElementById(id);
      if (!t) return false;
      return Boolean((t.getAttribute('aria-label') || '').trim()
        || (t.getAttribute('alt') || '').trim()
        || (t.textContent || '').trim()
        || Array.from(t.querySelectorAll('img')).some(i => (i.alt || '').trim()));
    });
  }).catch(() => false);
}

/**
 * Real visibility: Playwright's isVisible() ignores opacity:0, so a transparent
 * app would pass. This checks computed display/visibility/opacity plus a
 * non-empty bounding box.
 */
export async function isTrulyVisible(locator) {
  const el = locator.first();
  if (await el.count() === 0) return false;
  const visible = await el.isVisible().catch(() => false);
  if (!visible) return false;
  return el.evaluate((e) => {
    // opacity/visibility can be set on an ancestor, and the child's computed
    // style does not reflect them (opacity is not inherited), so walk up the
    // whole chain.
    for (let n = e; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.visibility === 'hidden' || cs.visibility === 'collapse') return false;
      if (parseFloat(cs.opacity) === 0) return false;
    }
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }).catch(() => false);
}

/**
 * Business effect: an action ran AND produced the expected effect.
 * `act` performs the action (click, selectOption…); `probe` measures the
 * observable state AFTERWARDS. Errors are never swallowed: an exception = failure.
 *
 *   await effectObserved(page,
 *     (p) => p.selectOption('#filter', 'a'),
 *     (p) => p.$$eval('.res', els => els.filter(e => e.offsetParent).length === 1));
 */
export async function effectObserved(page, act, probe) {
  await act(page);            // throws if the required element is missing
  return !!(await probe(page));
}
