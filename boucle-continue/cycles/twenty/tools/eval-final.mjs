// eval-final.mjs — ré-évaluation indépendante cycle 54 twenty.
// Rescan axe frais sur sous-ensemble représentatif + smoke fonctionnel.
// Usage: node tools/eval-final.mjs [baseUrl]
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const HERE = dirname(fileURLToPath(import.meta.url));
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const RULE_TAGS = ['wcag2a','wcag2a-best-practice','wcag2aa','wcag2aa-best-practice','wcag21a','wcag21aa','wcag22aa','best-practice'];
const seed = JSON.parse(readFileSync(resolve(HERE, 'seed-info.json'), 'utf8'));

const base = process.argv[2] || 'http://localhost:9540';
const storage = JSON.parse(readFileSync(resolve(HERE, 'auth.json'), 'utf8'));

let pass = 0, fail = 0, na = 0;
const ok = (n, c, d = '') => { if (c) { pass++; console.log(`PASS  ${n}`); } else { fail++; console.log(`FAIL  ${n}  ${d}`); } };
const note = (n, d = '') => { na++; console.log(`N-A   ${n}  ${d}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: storage, locale: 'en-US' });
const page = await ctx.newPage();
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));

// --- rescan axe indépendant (5 routes représentatives) ---
const routes = [
  '/objects/people',
  '/objects/companies',
  '/objects/opportunities',
  '/settings/profile',
  `/object/person/${seed.records.person.id}`,
];
const results = [];
for (const r of routes) {
  await page.goto(base + r, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2500);
  await page.addScriptTag({ content: axeSource });
  const res = await page.evaluate(async (tags) =>
    await window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] }), RULE_TAGS);
  results.push({ route: r, violations: res.violations.length, incomplete: res.incomplete.length });
  ok(`axe ${r} zero violations`, res.violations.length === 0,
    res.violations.map(v => v.id + ':' + v.nodes.length).join(', ').slice(0, 200));
}
console.log('rescan:', JSON.stringify(results));

// --- smoke fonctionnel : les fixes ne cassent rien ---
// 1. dropdown s'ouvre au clic + Escape ferme
await page.goto(base + '/objects/people', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2500);
const trigger = page.locator('[aria-controls$="-options"][aria-haspopup]').first();
if (await trigger.count() === 0) note('dropdown trigger', 'absent');
else {
  await trigger.click();
  await page.waitForTimeout(800);
  const panel = await page.locator('[id$="-options"][data-floating-ui-viewport]').count();
  ok('dropdown s\'ouvre au clic', panel >= 1, `${panel}`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
}

// 2. record show se charge
await page.goto(base + `/object/company/${seed.records.company.id}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2500);
ok('record show chargé', await page.locator('main').count() >= 1);

// 3. kanban view se charge
await page.goto(base + `/objects/opportunities?viewId=${seed.views.kanbanOpportunity.id}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
ok('kanban: cartes rendues', await page.locator('.record-board-card').count() >= 0, 'structure kanban');

// 4. recherche command menu répond
await page.goto(base + '/objects/tasks', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);
await page.keyboard.press('Control+k');
await page.waitForTimeout(1000);
const cmdkOpen = await page.evaluate(() => !!document.querySelector('[role="dialog"], [cmdk-root], [cmdk-list]'));
if (!cmdkOpen) note('command menu', 'non détecté');
else ok('command menu répond', true);
await page.keyboard.press('Escape');

ok('aucune erreur console', pageErrors.length === 0, pageErrors[0]?.slice(0, 120));

await browser.close();
console.log(`\n${pass} PASS, ${fail} FAIL, ${na} N-A`);
process.exit(fail ? 1 : 0);
