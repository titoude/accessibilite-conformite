// residual-probe.mjs — sonde axe ciblée sur les surfaces résiduelles du cycle nocodb.
// Usage : node residual-probe.mjs <baseUrl> <storage-state.json>
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(process.cwd() + '/package.json');
const BASE = process.argv[2] || 'http://localhost:8081';
const STORAGE = process.argv[3];

const NC_WS = process.env.NC_WS || 'wr23v8q3';
const NC_BASE = process.env.NC_BASE || 'pkfhnj2zuc1fhle';
const NC_TABLE = process.env.NC_TABLE || 'm48exzsl6itizh8';
const NC_GRID = process.env.NC_GRID || 'vwaeblf44ozgxrgt';
const GRID_URL = `/${NC_WS}/${NC_BASE}/${NC_TABLE}/${NC_GRID}/items-items`;

const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const browser = await chromium.launch();
const page = await (await browser.newContext({ storageState: STORAGE })).newPage();

async function scan(name, url, setup) {
  await page.goto(BASE + url, { waitUntil: 'domcontentloaded' });
  if (setup) await setup(page);
  await page.waitForTimeout(1200);
  try { await page.addScriptTag({ content: axeSource }); } catch (e) { await page.evaluate(axeSource); }
  const res = await page.evaluate(() => window.axe.run(document, {
    resultTypes: ['violations'],
    rules: { 'color-contrast': { enabled: true } },
  }));
  console.log(`\n=== ${name} (${url}) — ${res.violations.length} violations ===`);
  for (const v of res.violations) {
    console.log(`  [${v.impact}] ${v.id} (${v.nodes.length} noeuds)`);
    for (const n of v.nodes) {
      console.log(`     -> ${n.target.join(', ')}`);
      console.log(`        ${(n.failureSummary || '').split('\n')[0]}`);
    }
  }
  return res.violations.length;
}

let total = 0;
// 1. modale record : ?rowId= ouvre l'expanded form en overlay
total += await scan('edit-record-modal', `${GRID_URL}?rowId=1`, async (p) => {
  await p.waitForSelector('.ant-modal-wrap.nc-modal-wrapper, [data-testid="nc-expanded-form-modal"]', { timeout: 20000 });
});
// 2. création de token
total += await scan('tokens-new', '/account/tokens/new');
// 3. admin settings
total += await scan('admin-settings', '/admin/?tab=settings');

await browser.close();
console.log(`\nTOTAL violations: ${total}`);
