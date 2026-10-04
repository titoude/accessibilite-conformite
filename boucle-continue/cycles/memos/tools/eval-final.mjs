// eval-final.mjs — éval indépendante : re-scan axe + fumée fonctionnelle + erreurs page
import { chromium } from 'playwright';
import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire(import.meta.url);
const axeSrc = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const BASE = process.env.BASE_URL || 'http://localhost:3001';
const BENIGN_ERRORS = /favicon|net::ERR_|WebSocket|websocket|ResizeObserver|wake-?lock/i;
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: new URL('./auth.json', import.meta.url).pathname });
const page = await ctx.newPage();
const pageErrors = [];
page.on('pageerror', (e) => { if (!BENIGN_ERRORS.test(e.message)) pageErrors.push(e.message); });
page.on('console', (m) => { if (m.type() === 'error' && !BENIGN_ERRORS.test(m.text())) pageErrors.push(m.text()); });

// re-scan axe indépendant sur 4 routes (tags identiques au runner)
const scanned = {};
for (const u of ['/', '/setting', '/calendar/2026/10', '/attachments']) {
  await page.goto(BASE + u, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.addScriptTag({ content: axeSrc });
  const res = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
  scanned[u] = res.violations.length;
}
check('re-scan axe indépendant : 0 violation ×4 routes', Object.values(scanned).every((v) => v === 0), JSON.stringify(scanned));

// fumée fonctionnelle : contenu réel rendu
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main');
await page.waitForTimeout(1000);
const memoText = await page.locator('main').innerText();
check('mémo seedé visible en page', /test memo|hello world/i.test(memoText), memoText.slice(0, 60).replace(/\n/g, ' '));
const editorOpens = await page.locator('.cm-content').first().isVisible();
check('éditeur CodeMirror présent', editorOpens);
await page.goto(BASE + '/memos/3sKybHLtPqRM8H4GfgFdJF', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
const detail = await page.locator('main, [role="main"], body').first().innerText();
check('détail mémo /memos/:uid affiche du contenu', detail.trim().length > 40);
await page.goto(BASE + '/setting', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main');
await page.waitForTimeout(800);
check('settings affiche les sections', (await page.locator('main h2').count()) >= 1);
check('aucune erreur page/console non bénigne', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '));

const fails = results.filter((r) => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} PASS`);
await browser.close();
process.exit(fails.length ? 1 : 0);
