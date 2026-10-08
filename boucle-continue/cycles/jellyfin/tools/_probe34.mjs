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
    const tree = axe.utils.getFlattenedTree(document.documentElement);
    const vNodes = axe.utils.querySelectorAll(tree, '.defaultCardBackground4');
    const flat = vNodes.flat(Infinity);
    return flat.map(vNode => {
        let acc, vis, err;
        try { acc = axe.commons.text.accessibleText(vNode); } catch (e) { err = 'acc:' + e.message; }
        try { vis = axe.commons.text.visibleVirtual(vNode, false, false, { ignoreIconLigature: true }); } catch (e) { err = (err || '') + ' vis:' + e.message; }
        return { tag: vNode.actualNode?.tagName, acc, vis, err, role: vNode.props?.role };
    });
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
