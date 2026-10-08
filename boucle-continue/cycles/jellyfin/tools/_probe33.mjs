import { createRequire } from 'module';
const rq = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = rq('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US' });
const page = await ctx.newPage();
await page.goto('http://localhost:5961/web/index.html#/details?id=a7cc2a4fb6f159ad3b5acbf3d0a690df', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.addScriptTag({ path: rq.resolve('axe-core/axe.min.js') });
const r = await page.evaluate(async () => {
    const res = await axe.run(document, { runOnly: { type: 'rule', values: ['label-content-name-mismatch'] }, resultTypes: ['violations', 'incomplete', 'passes'] });
    const v = res.violations[0]?.nodes[0];
    return { nodeData: v ? { any: v.any, all: v.all, none: v.none } : 'none' };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
