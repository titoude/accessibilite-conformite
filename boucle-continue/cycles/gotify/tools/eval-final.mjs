// eval-final.mjs — contrôles indépendants NON couverts par verify.mjs
// (ordre des titres, focus clavier, reflow, piège Tab, attribut lang…).
// Usage: node eval-final.mjs <baseUrl> [authState.json]
import {chromium} from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8095';
const AUTH = process.argv[3] || new URL('./auth.json', import.meta.url).pathname;
const results = [];
const check = (name, ok, detail = '') => {
    results.push({name, ok, detail});
    console.log(`${ok ? '  ok ' : '  FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({storageState: AUTH});
const page = await ctx.newPage();

const goto = async (path) => {
    await page.goto(BASE + path, {waitUntil: 'domcontentloaded'});
    await page.waitForSelector('#main-content', {timeout: 15000});
    await page.waitForTimeout(1200);
};

// 1. ordre des titres : jamais de saut > 1 niveau
for (const path of ['/#/', '/#/messages/1', '/#/applications', '/#/clients', '/#/users', '/#/settings', '/#/plugins', '/#/login']) {
    await goto(path);
    const order = await page.evaluate(() =>
        [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
            .filter((h) => h.offsetParent !== null)
            .map((h) => +h.tagName[1])
    );
    const skips = order.filter((l, i) => i > 0 && l - order[i - 1] > 1).length;
    check(`${path}: ordre des titres sans saut`, skips === 0, JSON.stringify(order));
}

// 2. attribut lang non vide
await goto('/#/');
const lang = await page.evaluate(() => document.documentElement.lang);
check('html: attribut lang non vide', !!lang, `lang=${lang}`);

// 3. dialog : Escape ferme ET focus revient sur un élément focusable (pas body)
await goto('/#/applications');
await page.locator('#create-app').click();
await page.waitForSelector('.MuiDialog-root [role="dialog"]', {timeout: 10000});
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
const esc = await page.evaluate(() => ({
    dialogGone: !document.querySelector('.MuiDialog-root [role="dialog"]'),
    active: document.activeElement.tagName + (document.activeElement.id ? '#' + document.activeElement.id : ''),
    isBody: document.activeElement === document.body,
}));
check('dialog: Escape ferme + focus récupéré', esc.dialogGone && !esc.isBody, JSON.stringify(esc));

// 4. Tab-piège : focus reste dans le dialog ouvert (boucle)
await page.locator('#create-app').click();
await page.waitForSelector('.MuiDialog-root [role="dialog"]', {timeout: 10000});
let trapped = true;
for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => {
        const d = document.querySelector('.MuiDialog-root [role="dialog"]');
        return !!(d && d.contains(document.activeElement));
    });
    if (!inside) {trapped = false; break;}
}
check('dialog: Tab reste piégé dans la modale', trapped, '');
await page.keyboard.press('Escape');
await page.waitForTimeout(500);

// 5. champs visibles du dialog ont un nom accessible (label, aria-label(ledby), placeholder non compté)
await page.locator('#create-app').click();
await page.waitForSelector('.MuiDialog-root [role="dialog"]', {timeout: 10000});
const fields = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('.MuiDialog-root [role="dialog"] input, .MuiDialog-root [role="dialog"] textarea, .MuiDialog-root [role="dialog"] [role="combobox"]')]
        .filter((i) => i.offsetParent !== null && i.type !== 'hidden' && i.getAttribute('aria-hidden') !== 'true' && getComputedStyle(i).visibility !== 'hidden' && i.tabIndex >= 0);
    const named = inputs.filter((i) => {
        const al = i.getAttribute('aria-label') || '';
        const all = i.getAttribute('aria-labelledby') || '';
        const forLabel = i.id && document.querySelector(`label[for="${CSS.escape(i.id)}"]`);
        const wrapped = i.closest('label');
        return al.trim() || all.trim() || !!forLabel || !!wrapped;
    });
    return {total: inputs.length, named: named.length};
});
check('dialog: chaque champ a un nom accessible', fields.total > 0 && fields.named === fields.total, JSON.stringify(fields));
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// 6. focus-visible : indicateur de focus visible au clavier (pas de outline:none global)
await goto('/#/');
await page.keyboard.press('Tab');
const focusVis = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return {
        tag: el.tagName,
        outline: cs.outlineStyle !== 'none' || parseFloat(cs.outlineWidth) > 0,
        shadow: cs.boxShadow !== 'none',
        visible: el.offsetParent !== null,
    };
});
check('focus: indicateur visible au clavier (outline ou ring)', focusVis.visible && (focusVis.outline || focusVis.shadow), JSON.stringify(focusVis));

// 7. reflow 320px : pas de scroll horizontal
await page.setViewportSize({width: 320, height: 800});
await goto('/#/');
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check('reflow 320px: pas de débordement horizontal', overflow <= 1, `overflow=${overflow}px`);
await page.setViewportSize({width: 1280, height: 720});

// 8. images de contenu : alt présent (attribut) ou masquage explicite
await goto('/#/');
const imgs = await page.evaluate(() => {
    const all = [...document.querySelectorAll('img')].filter((i) => i.offsetParent !== null);
    const bad = all.filter((i) => !i.hasAttribute('alt') && i.getAttribute('aria-hidden') !== 'true');
    return {total: all.length, bad: bad.length, srcs: bad.map((i) => i.src.split('/').pop())};
});
check('images: alt présent ou masquage explicite', imgs.bad === 0, JSON.stringify(imgs));

await browser.close();
const ok = results.filter((r) => r.ok).length;
console.log(`eval-final: ${ok}/${results.length} OK`);
process.exit(ok === results.length ? 0 : 1);
