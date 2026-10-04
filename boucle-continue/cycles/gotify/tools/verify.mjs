// verify.mjs — assertions sémantiques des correctifs a11y (indépendantes du score axe).
// Chaque assertion vérifie l'EFFET (nom accessible calculé par le moteur, élément
// requis, effet métier) — un élément absent = FAIL, jamais un succès vacuus.
// Ne modifie jamais le produit pour satisfaire le harnais.
// Usage: node verify.mjs <baseUrl> [authState.json]
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

// 1. viewport : zoom utilisateur autorisé
await goto('/#/');
const vp = await page.evaluate(() => document.querySelector('meta[name=viewport]')?.content || '');
check('viewport: zoom utilisateur autorisé', !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i.test(vp), vp);

// 2. exactement un h1 visible + un seul <main> top-level par page
for (const path of ['/#/', '/#/messages/1', '/#/applications', '/#/clients', '/#/users', '/#/settings', '/#/plugins']) {
    await goto(path);
    const m = await page.evaluate(() => ({
        h1: [...document.querySelectorAll('h1')].filter((h) => h.offsetParent !== null).length,
        mains: document.querySelectorAll('main').length,
        nestedMain: !!document.querySelector('main main'),
    }));
    check(`${path}: un h1 visible, un seul main non imbriqué`, m.h1 === 1 && m.mains === 1 && !m.nestedMain, JSON.stringify(m));
}
await goto('/#/login');
const loginLandmarks = await page.evaluate(() => ({
    h1: [...document.querySelectorAll('main h1')].filter((h) => h.offsetParent !== null).length,
    mains: document.querySelectorAll('main').length,
}));
check('/#/login: h1 dans <main>, landmark main unique', loginLandmarks.h1 === 1 && loginLandmarks.mains === 1, JSON.stringify(loginLandmarks));

// 3. skip-link : premier stop clavier d'une entrée de page fraîche.
// (reload réel : une nav hash conserve le point de départ Tab de Chrome)
await goto('/#/');
await page.reload({waitUntil: 'domcontentloaded'});
await page.waitForSelector('#main-content', {timeout: 15000});
await page.waitForTimeout(1200);
await page.keyboard.press('Tab');
const skip = await page.evaluate(() => {
    const el = document.activeElement;
    return {tag: el.tagName, href: el.getAttribute('href'), id: document.querySelector('#main-content')?.id};
});
check('skip-link: premier stop clavier pointe #main-content', skip.tag === 'A' && skip.href === '#main-content' && !!skip.id, JSON.stringify(skip));

// 4. landmarks nav : noms distincts desktop + drawer mobile dans la couche popup
await goto('/#/');
const navNames = await page.evaluate(() =>
    [...document.querySelectorAll('nav')].map((n) => n.getAttribute('aria-label'))
);
check('nav: landmark(s) nommés distincts', navNames.length >= 1 && new Set(navNames).size === navNames.length && navNames.every(Boolean), JSON.stringify(navNames));

await page.setViewportSize({width: 375, height: 720});
await page.waitForTimeout(400);
await page.locator('header .MuiIconButton-root').first().click();
await page.waitForSelector('.MuiModal-root .MuiDrawer-paper', {timeout: 10000});
await page.waitForTimeout(500);
const drawer = await page.evaluate(() => {
    const paper = document.querySelector('.MuiModal-root .MuiDrawer-paper');
    const nav = paper?.querySelector('nav');
    const layer = document.getElementById('a11y-popup-layer');
    return {
        navName: nav?.getAttribute('aria-label'),
        inLayer: !!(paper && layer && layer.contains(paper)),
        rootHidden: document.getElementById('root').getAttribute('aria-hidden'),
        closeBtn: !!paper?.querySelector('button[aria-label="Close navigation"]'),
    };
});
check('drawer mobile: nav nommée, montée dans #a11y-popup-layer, #root visible', drawer.inLayer && !!drawer.navName && drawer.rootHidden !== 'true', JSON.stringify(drawer));
check('drawer mobile: bouton fermer nommé', drawer.closeBtn, '');
await page.keyboard.press('Escape');
await page.setViewportSize({width: 1280, height: 720});
await page.waitForTimeout(400);

// 5. menu utilisateur : ouverture (effet), items dans la couche popup, noms calculés
await goto('/#/applications');
await page.locator('#user-menu-button').click();
await page.waitForSelector('#user-menu [role="menuitem"], #user-menu li', {timeout: 10000});
await page.waitForTimeout(500);
const userMenu = await page.evaluate(() => {
    const menu = document.querySelector('#user-menu');
    const layer = document.getElementById('a11y-popup-layer');
    const items = [...(menu?.querySelectorAll('li, [role="menuitem"]') || [])];
    return {
        inLayer: !!(menu && layer && layer.contains(menu)),
        rootHidden: document.getElementById('root').getAttribute('aria-hidden'),
        items: items.length,
        named: items.filter((i) => (i.textContent || '').trim().length > 0).length,
    };
});
check('user-menu: menu ouvert dans #a11y-popup-layer, items nommés', userMenu.inLayer && userMenu.rootHidden !== 'true' && userMenu.items > 0 && userMenu.named === userMenu.items, JSON.stringify(userMenu));
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// 6. noms accessibles CALCULÉS (moteur a11y) : boutons icônes des lignes
await goto('/#/');
check('messages: bouton "Delete message" nommé par ligne', (await page.getByRole('button', {name: 'Delete message', exact: true}).count()) >= 1, `count=${await page.getByRole('button', {name: 'Delete message', exact: true}).count()}`);
await goto('/#/applications');
for (const n of ['Upload image', 'Regenerate token', 'Edit', 'Delete']) {
    const c = await page.getByRole('button', {name: n, exact: true}).count();
    check(`applications: bouton "${n}" nommé`, c >= 1, `count=${c}`);
}
check('applications: poignée drag nommée', (await page.getByRole('button', {name: /^Reorder /}).count()) >= 1, `count=${await page.getByRole('button', {name: /^Reorder /}).count()}`);
await goto('/#/clients');
for (const n of ['Edit', 'Delete']) {
    check(`clients: bouton "${n}" nommé`, (await page.getByRole('button', {name: n, exact: true}).count()) >= 1, '');
}
await goto('/#/users');
for (const n of ['Edit', 'Delete']) {
    check(`users: bouton "${n}" nommé`, (await page.getByRole('button', {name: n, exact: true}).count()) >= 1, '');
}

// 7. en-têtes de table : chaque <th> a du texte (visible ou masqué pour SR)
for (const [path, sel] of [['/#/applications', '#app-table'], ['/#/clients', '#client-table'], ['/#/users', '#user-table']]) {
    await goto(path);
    const th = await page.evaluate((s) => [...document.querySelectorAll(`${s} th`)].map((t) => (t.textContent || '').trim()), sel);
    check(`${sel}: ${th.length} th tous nommés`, th.length > 0 && th.every((t) => t.length > 0), JSON.stringify(th));
}

// 8. dialog ajout app : monté dans la couche popup, focus dedans, Esc ferme, submit wrapper nommé
await goto('/#/applications');
await page.locator('#create-app').click();
await page.waitForSelector('.MuiDialog-root [role="dialog"]', {timeout: 10000});
const dlg = await page.evaluate(() => {
    const d = document.querySelector('.MuiDialog-root [role="dialog"]');
    const layer = document.getElementById('a11y-popup-layer');
    const hint = document.querySelector('.MuiDialog-root [role="dialog"] [role="group"][aria-label]');
    return {
        inLayer: !!(d && layer && layer.contains(d)),
        focusInside: !!(d && d.contains(document.activeElement)),
        rootHidden: document.getElementById('root').getAttribute('aria-hidden'),
        hintLabel: hint?.getAttribute('aria-label'),
    };
});
check('dialog add-app: dans popup-layer, focus dedans, #root visible', dlg.inLayer && dlg.focusInside && dlg.rootHidden !== 'true', JSON.stringify(dlg));
check('dialog add-app: wrapper submit a un label (hint)', !!dlg.hintLabel, `label=${dlg.hintLabel}`);
await page.keyboard.press('Escape');
await page.waitForTimeout(500);
const dlgGone = await page.evaluate(() => !document.querySelector('.MuiDialog-root [role="dialog"]'));
check('dialog add-app: Escape ferme', dlgGone, '');

// 9. snackbar Undo : effet métier — Undo annule la suppression (message encore présent)
await goto('/#/');
const cookie = await ctx.cookies(BASE);
const token = cookie.find((c) => c.name === 'gotify-client-token')?.value;
const post = await page.evaluate(async ({base, tok}) => {
    const r = await fetch(base + '/message', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Cookie: `gotify-client-token=${tok}`},
        body: JSON.stringify({appid: 1, title: 'VerifyUndo', message: 'verify-undo-body', priority: 0}),
    });
    return r.status;
}, {base: BASE, tok: token});
check('snackbar: POST /message (effet métier préalable)', post === 200, `status=${post}`);
await page.locator('.message', {hasText: 'verify-undo-body'}).first().waitFor({timeout: 10000});
await page.locator('.message', {hasText: 'verify-undo-body'}).first().locator('button[aria-label="Delete message"]').click();
const undo = page.getByRole('button', {name: 'Undo', exact: true});
await undo.waitFor({state: 'visible', timeout: 10000});
const snackbarContrast = await page.evaluate(() => {
    const lum = (r, g, b) => {
        const c = [r, g, b].map((v) => {v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);});
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    // La surface réelle = SnackbarContent (fond solide). #notistack-snackbar
    // est une enveloppe au fond transparent : on part du texte rendu et on
    // remonte la chaîne d'ancêtres jusqu'à la première couleur solide.
    const sn =
        document.querySelector('.MuiSnackbarContent-message, [class*="SnackbarContent-message"]') ||
        document.querySelector('#notistack-snackbar') ||
        document.querySelector('[class*="notistack"]');
    if (!sn) return {found: false};
    const f = rgb(getComputedStyle(sn).color);
    let bg = null, bgNode = null, node = sn;
    while (node && node !== document.documentElement) {
        const cs = getComputedStyle(node);
        const c = rgb(cs.backgroundColor);
        if (c.length >= 4 ? c[3] > 0 : c.length === 3) {bg = c; bgNode = node.tagName + '.' + String(node.className).split(' ')[0]; break;}
        node = node.parentElement;
    }
    if (!bg) return {found: true, fg: f, bg: null, transparentChain: true};
    return {found: true, fg: f, bg, bgNode, ratio: Math.round(((Math.max(lum(...f), lum(...bg)) + 0.05) / (Math.min(lum(...f), lum(...bg)) + 0.05)) * 100) / 100};
});
check('snackbar: fond contraste >= 4.5:1 (surface SnackbarContent)', snackbarContrast.found && !snackbarContrast.transparentChain && snackbarContrast.ratio >= 4.5, JSON.stringify(snackbarContrast));
await undo.click();
await page.waitForTimeout(600);
const stillThere = await page.locator('.message', {hasText: 'verify-undo-body'}).count();
check('snackbar: Undo annule la suppression (message présent)', stillThere >= 1, `count=${stillThere}`);
// nettoyage seed : suppression API directe du message de test
await page.evaluate(async () => {
    const list = await (await fetch('/message')).json();
    for (const m of list.messages.filter((m) => m.message === 'verify-undo-body')) {
        await fetch('/message/' + m.id, {method: 'DELETE'});
    }
});

// 10. structure message : titre h2, nom d'app non-titre (plus de h6)
await goto('/#/');
const msgStruct = await page.evaluate(() => ({
    h2: document.querySelectorAll('.message h2').length,
    strayH6: document.querySelectorAll('.message h6').length,
}));
check('messages: titres h2, aucun h6 résiduel', msgStruct.h2 >= 1 && msgStruct.strayH6 === 0, JSON.stringify(msgStruct));

// 11. plugins : ligne empty-state présente (th-has-data-cells)
await goto('/#/plugins');
const pluginsEmpty = await page.evaluate(() => ({
    row: document.querySelector('#plugin-table tbody td[colspan]')?.textContent?.trim(),
    thCount: document.querySelectorAll('#plugin-table th').length,
}));
check('plugins: ligne "No plugins" quand table vide', pluginsEmpty.row === 'No plugins' && pluginsEmpty.thCount > 0, JSON.stringify(pluginsEmpty));

// 12. avatar nav : alt décoratif explicite
const avatarAlt = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('nav img.MuiAvatar-img')];
    return {total: imgs.length, withAlt: imgs.filter((i) => i.hasAttribute('alt')).length};
});
check('nav avatars: attribut alt présent (décoratif)', avatarAlt.total > 0 && avatarAlt.withAlt === avatarAlt.total, JSON.stringify(avatarAlt));

await browser.close();
const ok = results.filter((r) => r.ok).length;
console.log(`verify: ${ok}/${results.length} assertions OK`);
process.exit(ok === results.length ? 0 : 1);
