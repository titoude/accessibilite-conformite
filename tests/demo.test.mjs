import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium, expect } from '@playwright/test';

const require = createRequire(import.meta.url);
const output = 'test-results/demo';
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

test('teaching demo preserves the complete reservation task through keyboard and visual modes', async () => {
  await mkdir(output, { recursive: true });
  const files = new Map(await Promise.all(['before.html', 'after.html', 'style.css'].map(async file =>
    ['/' + file, await readFile('demo/' + file)])));
  const server = createServer((request, response) => {
    const file = files.get(request.url);
    response.writeHead(file ? 200 : 404, {
      'Content-Type': request.url.endsWith('.css') ? 'text/css' : 'text/html; charset=utf-8',
    }).end(file || 'Not found');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const evidence = { kind: 'hand-authored teaching fixture', status: 'RUNNING',
    generatedAt: new Date().toISOString(), humanReview: 'NOT_TESTED', scans: [] };
  await writeFile(output + '/summary.json', JSON.stringify(evidence, null, 2));
  let browser;
  try {
    browser = await chromium.launch();
    evidence.browser = browser.version();
    const page = await browser.newPage({ viewport: { width: 1100, height: 1000 } });
    async function scan(state, corrected) {
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const result = await page.evaluate(tags => window.axe.run(document, {
        runOnly: { type: 'tag', values: tags },
      }), tags);
      await writeFile(output + '/' + state + '.json', JSON.stringify(result, null, 2));
      evidence.scans.push({ state, violations: result.violations.length, incomplete: result.incomplete.length });
      if (corrected) {
        assert.deepEqual(result.violations.map(v => v.id), [], state);
        assert.deepEqual(result.incomplete.map(v => v.id), [], state + ' incomplete');
      }
      return result;
    }

    await page.goto(origin + '/before.html');
    const baseline = await scan('before-initial', false);
    for (const rule of ['label', 'select-name', 'color-contrast']) {
      assert.ok(baseline.violations.some(v => v.id === rule), 'baseline exposes ' + rule);
    }
    await page.locator('#format').focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('#book')).not.toBeFocused();
    await page.screenshot({ path: output + '/before.png', fullPage: true });
    // Preserve the same pointer result as a functional reference.
    await page.locator('#name').fill('Alex');
    await page.locator('#format').selectOption('In person');
    await page.locator('#book').click();
    await expect(page.locator('#status')).toHaveText('Place reserved for Alex (In person).');

    await page.goto(origin + '/after.html');
    await scan('after-initial', true);
    const name = page.locator('#name');
    const reserve = page.getByRole('button', { name: 'Reserve a place', exact: true });
    await expect(name).toHaveAccessibleName('Display name (required)');
    await expect(page.locator('#format')).toHaveAccessibleName('Workshop format');
    for (let step = 0; step < 4; step++) await page.keyboard.press('Tab');
    await expect(reserve).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAccessibleDescription(/Enter a display name/);
    await expect(page.locator('#name-error')).toBeVisible();
    await scan('after-error', true);
    await page.keyboard.type('Alex');
    await page.keyboard.press('Tab');
    await expect(page.locator('#format')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#format')).toHaveValue('In person');
    await page.keyboard.press('Tab');
    await expect(reserve).toBeFocused();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Your place is reserved', exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription('Place reserved for Alex (In person).');
    await expect(dialog.getByRole('button', { name: 'Done', exact: true })).toBeFocused();
    await scan('after-dialog', true);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(reserve).toBeFocused();
    await expect(page.getByRole('status')).toHaveText('Place reserved for Alex (In person).');
    await scan('after-confirmed', true);
    await page.screenshot({ path: output + '/after.png', fullPage: true });
    await page.setViewportSize({ width: 320, height: 800 });
    assert.equal(await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, '320px reflow');
    await page.screenshot({ path: output + '/after-narrow.png', fullPage: true });
    await page.emulateMedia({ forcedColors: 'active' });
    await page.keyboard.press('Enter');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(reserve).toBeFocused();
    evidence.status = 'PASS';
    evidence.keyboard = 'empty-name error, selected format, dialog confirmation, Escape and focus return';
    evidence.visualModes = ['320 CSS-pixel reflow', 'forced-colors keyboard operation'];
  } catch (error) {
    evidence.status = 'FAIL';
    evidence.error = String(error);
    throw error;
  } finally {
    await writeFile(output + '/summary.json', JSON.stringify(evidence, null, 2));
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
