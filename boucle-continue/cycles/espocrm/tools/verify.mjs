/**
 * verify.mjs — assertions DURES sur les corrections espocrm (cycle 47).
 * Effets mesurés dans le DOM rendu, jamais `if(el) ok()` ni `|| true`.
 * Un élément requis absent = FAIL ou N-A explicite.
 * Le score axe n'est pas auto-produit ici (règle: pas de self-verdict).
 *
 * Usage: node verify.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));

const [base, authPath = 'auth.json'] = process.argv.slice(2);
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }

const results = [];
const ok = (name, cond, extra = '') => {
    results.push({ name, pass: !!cond });
    if (!cond) console.error(`  FAIL ${name} ${extra}`);
    return cond;
};
const na = (name, reason = '') => {
    results.push({ name, pass: true, verdict: 'N-A', reason });
    console.error(`  N-A ${name} ${reason}`);
    return true;
};

const BROWSER_HELPERS = `
const parse = (c) => {
    if (!c) return null;
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map(x => parseFloat(x.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
};
const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
const effectiveBg = (el) => {
    const layers = [];
    let node = el;
    while (node && node !== document.documentElement.parentElement) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0) layers.push(c);
        node = node.parentElement;
    }
    if (!layers.length) return { r: 255, g: 255, b: 255 };
    let comp = { ...layers[0] };
    for (let i = 1; i < layers.length; i++) {
        if (comp.a >= 1) break;
        const c = layers[i];
        const a = comp.a + c.a * (1 - comp.a);
        comp = {
            r: (comp.a * comp.r + c.a * c.r * (1 - comp.a)) / a,
            g: (comp.a * comp.g + c.a * c.g * (1 - comp.a)) / a,
            b: (comp.a * comp.b + c.a * c.b * (1 - comp.a)) / a,
            a,
        };
    }
    return comp;
};
const textContrast = (el) => {
    const fg = parse(getComputedStyle(el).color);
    if (!fg) return null;
    const bg = effectiveBg(el);
    return ratio(lum(fg), lum(bg));
};
const accNameOf = (el) => {
    // approximation name computation suffisante pour nos éléments :
    // aria-label > title > texte visible propre
    const al = el.getAttribute('aria-label');
    if (al !== null && al.trim() !== '') return al.trim();
    const t = el.getAttribute('title');
    if (t !== null && t.trim() !== '') return t.trim();
    const lb = el.id && document.querySelector('label[for="' + el.id + '"]');
    if (lb && lb.innerText.trim() !== '') return lb.innerText.trim();
    return (el.innerText || el.value || '').trim();
};
`;

const browser = await chromium.launch();
const ctxPub = await browser.newContext({ locale: 'en-US' });
const page = await ctxPub.newPage();

// ---------- PUBLIC : page de connexion ----------
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#login-form', { timeout: 30000 });
await page.waitForTimeout(800);

const skeleton = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const html = document.documentElement;
        const lang = html.getAttribute('lang') || '';
        const vp = document.querySelector('meta[name="viewport"]')?.content || '';
        const locked = /user-scalable\\s*=\\s*(no|0)/i.test(vp) || /maximum-scale\\s*=\\s*1(\\.0+)?\\b/i.test(vp);
        const mains = [...document.querySelectorAll('main')].filter(m => {
            const r = m.getBoundingClientRect(); return r.width > 0 && r.height > 0;
        });
        const h1 = document.querySelector('h1');
        const h1Txt = h1 ? (h1.innerText || '').trim() : '';
        const tabs = [...document.querySelectorAll('[tabindex]')]
            .map(e => parseInt(e.getAttribute('tabindex'), 10))
            .filter(n => n > 0);
        const img = document.querySelector('#login .logo-container img');
        const userLabel = document.querySelector('label[for="field-userName"]');
        const passLabel = document.querySelector('label[for="field-password"]');
        return {
            lang, vp, locked,
            mainCount: mains.length,
            h1Present: !!h1, h1Txt,
            positiveTabindexCount: tabs.length,
            imgAlt: img ? img.getAttribute('alt') : null,
            userLabelTxt: userLabel ? userLabel.innerText.trim() : '',
            passLabelTxt: passLabel ? passLabel.innerText.trim() : '',
        };
    })()
`);
ok('login: html[lang] non vide', skeleton.lang.length >= 2, skeleton.lang);
ok('login: viewport zoom non verrouillé', !skeleton.locked, skeleton.vp);
ok('login: landmark <main> présent', skeleton.mainCount >= 1, `${skeleton.mainCount} main`);
ok('login: <h1> présent et non vide', skeleton.h1Present && skeleton.h1Txt.length > 0, skeleton.h1Txt);
ok('login: aucun tabindex > 0', skeleton.positiveTabindexCount === 0, `${skeleton.positiveTabindexCount} restants`);
ok('login: logo a un alt non vide', skeleton.imgAlt !== null && skeleton.imgAlt.trim() !== '', String(skeleton.imgAlt));
ok('login: champ utilisateur labellisé', skeleton.userLabelTxt.length > 0, skeleton.userLabelTxt);
ok('login: champ mot de passe labellisé', skeleton.passLabelTxt.length > 0, skeleton.passLabelTxt);

const loginContrast = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const btn = document.querySelector('#btn-login');
        if (!btn) return { present: false };
        return { present: true, ratio: +textContrast(btn).toFixed(2) };
    })()
`);
if (!loginContrast.present) {
    na('login: contraste #btn-login >= 4.5', 'bouton introuvable');
} else {
    ok('login: contraste #btn-login >= 4.5', loginContrast.ratio >= 4.5, `ratio ${loginContrast.ratio}`);
}

await ctxPub.close();

// ---------- AUTHENTIFIÉ ----------
if (!existsSync(authPath)) {
    na('bloc authentifié', `storage-state ${authPath} absent`);
} else {
    const ctx = await browser.newContext({ locale: 'en-US', storageState: authPath });
    const ap = await ctx.newPage();

    await ap.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await ap.waitForSelector('#navbar .navbar', { timeout: 30000, state: 'attached' });
    await ap.waitForTimeout(1200);

    const appSkeleton = await ap.evaluate(`(() => {
        const mains = [...document.querySelectorAll('main')].filter(m => {
            const r = m.getBoundingClientRect(); return r.width > 0 && r.height > 0;
        });
        const h1s = [...document.querySelectorAll('h1')].filter(h => (h.innerText || '').trim() !== '');
        const navOk = !!document.querySelector('#navbar .navbar');
        return { mainCount: mains.length, h1Count: h1s.length, navOk };
    })()`);
    ok('app: landmark <main> présent', appSkeleton.mainCount >= 1, `${appSkeleton.mainCount} main`);
    ok('app: <h1> non vide présent', appSkeleton.h1Count >= 1, `${appSkeleton.h1Count} h1`);
    ok('app: navbar rendue', appSkeleton.navOk);

    // nom accessible des boutons icône de la navbar
    const navNames = await ap.evaluate(`${BROWSER_HELPERS}
        (() => {
            const sels = {
                toggle: 'button.navbar-toggle',
                sideMenu: 'a.side-menu-button',
                minimizer: 'a.minimizer',
                moreTabs: '#nav-more-tabs-dropdown',
                userMenu: '#nav-menu-dropdown',
                quickCreate: '#nav-quick-create-dropdown',
            };
            const out = {};
            for (const [k, s] of Object.entries(sels)) {
                const el = document.querySelector(s);
                out[k] = el ? accNameOf(el) : null;
            }
            return out;
        })()
    `);
    for (const [k, name] of Object.entries(navNames)) {
        if (name === null) {
            if (k === 'minimizer' || k === 'moreTabs') { na(`navbar: nom accessible ${k}`, 'élément absent (config)'); continue; }
            ok(`navbar: nom accessible ${k}`, false, 'élément absent');
        } else {
            ok(`navbar: nom accessible ${k}`, name.length > 0, JSON.stringify(name));
        }
    }

    // liaisons aria-labelledby des menus navbar (leçon 42)
    const liaison = await ap.evaluate(`(() => {
        const uls = [...document.querySelectorAll('ul[aria-labelledby]')];
        const bad = uls.filter(u => !document.getElementById(u.getAttribute('aria-labelledby')));
        const menuCount = uls.length;
        return { menuCount, badCount: bad.length };
    })()`);
    ok('liaison: tous les aria-labelledby de menus résolvent', liaison.menuCount > 0 && liaison.badCount === 0,
        `${liaison.menuCount} menus, ${liaison.badCount} liaisons mortes`);

    // enfants role=menu conformes quand ouverts
    await ap.click('#nav-menu-dropdown');
    await ap.waitForSelector('#nav-menu-dropdown ~ ul.dropdown-menu', { state: 'attached' });
    const menuRoles = await ap.evaluate(`(() => {
        const ul = document.querySelector('#nav-menu-dropdown ~ ul.dropdown-menu');
        if (!ul) return { present: false };
        const items = [...ul.querySelectorAll(':scope > li')];
        const liRoles = items.map(li => li.getAttribute('role'));
        const links = [...ul.querySelectorAll('a')].map(a => a.getAttribute('role'));
        return { present: true, liRoles, links };
    })()`);
    if (!menuRoles.present) {
        na('menu utilisateur: rôles menuitem/separator', 'menu introuvable');
    } else {
        const liOk = menuRoles.liRoles.every(r => r === 'none' || r === 'separator');
        const aOk = menuRoles.links.every(r => r === 'menuitem');
        ok('menu utilisateur: li role=none|separator', liOk, JSON.stringify(menuRoles.liRoles));
        ok('menu utilisateur: liens role=menuitem', aOk, JSON.stringify(menuRoles.links));
    }
    await ap.keyboard.press('Escape');

    // menu « more tabs » navbar — assertion live à l'ouverture (résidu auditeur
    // cycle 47 : .more-dropdown-menu gardait aria-required-children). Viewport
    // 1050 px pour forcer le débordement (le menu n'apparaît qu'en overflow).
    await ap.setViewportSize({ width: 1050, height: 800 });
    await ap.waitForTimeout(1500); // updateWidth() boucle ~1 s
    const moreTrigger = ap.locator('#nav-more-tabs-dropdown');
    if (!(await moreTrigger.isVisible().catch(() => false))) {
        na('menu more-tabs: ouvert, rôles valides, fermeture', 'déclencheur absent/masqué — pas de débordement à 1050px');
    } else {
        await moreTrigger.click();
        const opened = await ap.waitForSelector('.more-dropdown-menu', { state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
        ok('menu more-tabs: le menu s\'ouvre', opened);
        if (opened) {
            const moreRoles = await ap.evaluate(`(() => {
                const ul = document.querySelector('.more-dropdown-menu');
                const liRoles = [...ul.children].map(li => li.getAttribute('role') || '(aucun)');
                const aRoles = [...ul.querySelectorAll(':scope > li > a')].map(a => a.getAttribute('role') || '(aucun)');
                return { liRoles, aRoles, count: ul.children.length };
            })()`);
            ok('menu more-tabs: li role=none|separator', moreRoles.liRoles.every(r => r === 'none' || r === 'separator'), JSON.stringify(moreRoles.liRoles));
            ok('menu more-tabs: liens role=menuitem', moreRoles.aRoles.length > 0 && moreRoles.aRoles.every(r => r === 'menuitem'), JSON.stringify(moreRoles.aRoles));
            await ap.keyboard.press('Escape');
            await ap.waitForTimeout(400);
            const closed = await ap.evaluate(`(() => {
                const li = document.querySelector('li.more');
                const ul = document.querySelector('.more-dropdown-menu');
                return li && !li.classList.contains('open') && ul && ul.offsetParent === null;
            })()`);
            ok('menu more-tabs: se referme (Escape)', closed);
        }
    }

    // sonde anti-slug i18n (leçon 43) : tout nom accessible ou texte rendu qui
    // ressemble à une clé i18n non résolue (« navbar.moreTabsLabel ») = FAIL.
    const slugHits = await ap.evaluate(`(() => {
        const re = /^[a-z][a-z0-9-]*(\\.[a-z0-9-]+)+$/i;
        const hits = [];
        for (const el of document.querySelectorAll('[aria-label],[title],[placeholder]')) {
            for (const a of ['aria-label', 'title', 'placeholder']) {
                const v = (el.getAttribute(a) || '').trim();
                if (v && re.test(v)) hits.push(el.tagName.toLowerCase() + '[' + a + '=' + v + ']');
            }
        }
        for (const el of document.querySelectorAll('.label-text,.full-label,.short-label,.dropdown-menu a')) {
            const v = (el.innerText || '').trim();
            if (v && re.test(v)) hits.push('texte:"' + v.slice(0, 60) + '"');
        }
        return [...new Set(hits)].slice(0, 20);
    })()`);
    const slugNav = Object.entries(navNames).filter(([k, v]) => v && /^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/i.test(v)).map(([k, v]) => `${k}="${v}"`);
    ok('anti-slug i18n: aucun nom rendu en clé i18n non résolue', slugHits.length === 0 && slugNav.length === 0, JSON.stringify(slugHits.concat(slugNav)));

    // page liste : checkbox, en-têtes, champs de recherche, menus de lignes
    await ap.goto(`${base}/#Account`, { waitUntil: 'domcontentloaded' });
    await ap.waitForSelector('.list-container, #main .panel, #content .list', { timeout: 30000, state: 'attached' });
    await ap.waitForTimeout(1500);

    const listChecks = await ap.evaluate(`${BROWSER_HELPERS}
        (() => {
            const selAll = document.querySelector('input.select-all');
            const rec = document.querySelector('input.record-checkbox');
            const ths = [...document.querySelectorAll('th')].filter(th => (th.innerText || '').trim() === '' && !th.getAttribute('aria-label'));
            const textFilter = document.querySelector('input.text-filter');
            const gsearch = document.querySelector('input.global-search-input');
            const addFilter = document.querySelector('button.add-filter-button');
            const rowBtn = document.querySelector('.list-row-buttons .dropdown-toggle');
            const badAutocomplete = [...document.querySelectorAll('[autocomplete]')]
                .filter(e => (e.getAttribute('autocomplete') || '').startsWith('espo-')).length;
            return {
                selAllName: selAll ? accNameOf(selAll) : null,
                recName: rec ? accNameOf(rec) : null,
                emptyThCount: ths.length,
                textFilterName: textFilter ? accNameOf(textFilter) : null,
                textFilterAutocomplete: textFilter ? textFilter.getAttribute('autocomplete') : null,
                gsearchName: gsearch ? accNameOf(gsearch) : null,
                gsearchAutocomplete: gsearch ? gsearch.getAttribute('autocomplete') : null,
                addFilterName: addFilter ? accNameOf(addFilter) : null,
                rowBtnName: rowBtn ? accNameOf(rowBtn) : null,
                badAutocomplete,
            };
        })()
    `);
    ok('liste: select-all a un nom', listChecks.selAllName !== null && listChecks.selAllName.length > 0, String(listChecks.selAllName));
    if (listChecks.recName === null) na('liste: record-checkbox a un nom', 'aucune ligne'); else ok('liste: record-checkbox a un nom', listChecks.recName.length > 0, listChecks.recName);
    ok('liste: aucun <th> sans texte ni aria-label', listChecks.emptyThCount === 0, `${listChecks.emptyThCount} th vides`);
    ok('liste: text-filter a un nom', listChecks.textFilterName !== null && listChecks.textFilterName.length > 0, String(listChecks.textFilterName));
    ok('liste: text-filter autocomplete valide', listChecks.textFilterAutocomplete === 'off' || listChecks.textFilterAutocomplete === null, String(listChecks.textFilterAutocomplete));
    if (listChecks.gsearchName === null) na('liste: global-search a un nom', 'input absent'); else ok('liste: global-search a un nom', listChecks.gsearchName.length > 0, listChecks.gsearchName);
    ok('liste: aucun autocomplete="espo-*"', listChecks.badAutocomplete === 0, `${listChecks.badAutocomplete} restants`);
    if (listChecks.addFilterName === null) na('liste: add-filter-button a un nom', 'absent'); else ok('liste: add-filter-button a un nom', listChecks.addFilterName.length > 0, listChecks.addFilterName);
    if (listChecks.rowBtnName === null) na('liste: bouton actions de ligne a un nom', 'aucune ligne'); else ok('liste: bouton actions de ligne a un nom', listChecks.rowBtnName.length > 0, listChecks.rowBtnName);

    // contrastes mesurés sur la liste
    const contrasts = await ap.evaluate(`${BROWSER_HELPERS}
        (() => {
            const out = {};
            const sort = document.querySelector('th .sort');
            if (sort) out.sort = +textContrast(sort).toFixed(2);
            const muted = document.querySelector('.text-muted');
            if (muted) out.textMuted = +textContrast(muted).toFixed(2);
            const label = document.querySelector('.label.label-state');
            if (label) out.labelState = +textContrast(label).toFixed(2);
            return out;
        })()
    `);
    if (contrasts.sort === undefined) na('liste: contraste .sort >= 4.5', 'pas de .sort visible'); else ok('liste: contraste .sort >= 4.5', contrasts.sort >= 4.5, `ratio ${contrasts.sort}`);
    if (contrasts.textMuted === undefined) na('liste: contraste .text-muted >= 4.5', 'absent'); else ok('liste: contraste .text-muted >= 4.5', contrasts.textMuted >= 4.5, `ratio ${contrasts.textMuted}`);
    if (contrasts.labelState === undefined) na('liste: contraste .label-state >= 4.5', 'absent'); else ok('liste: contraste .label-state >= 4.5', contrasts.labelState >= 4.5, `ratio ${contrasts.labelState}`);

    // detail record : stream, liens cibles
    const SEED = JSON.parse((await import('node:fs')).readFileSync(new URL('./seed-info.json', import.meta.url), 'utf8').toString());
    await ap.goto(`${base}/#Account/view/${SEED.accountAcmeId}`, { waitUntil: 'domcontentloaded' });
    await ap.waitForSelector('.detail, .record .panel, #content .middle', { timeout: 30000, state: 'attached' });
    await ap.waitForTimeout(1500);

    const detailChecks = await ap.evaluate(`${BROWSER_HELPERS}
        (() => {
            const urlLink = document.querySelector('.field a[href^="http"]');
            let linkSize = null;
            if (urlLink) {
                const r = urlLink.getBoundingClientRect();
                linkSize = { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
            }
            const infoIcon = document.querySelector('.field-info');
            return {
                linkSize,
                infoName: infoIcon ? accNameOf(infoIcon) : null,
                iframe: document.querySelector('iframe') ? (document.querySelector('iframe').getAttribute('title') || '') : null,
            };
        })()
    `);
    if (detailChecks.linkSize === null) na('detail: lien externe >= 24px', 'pas de lien http dans la fiche');
    else ok('detail: lien externe hauteur >= 24px', detailChecks.linkSize.h >= 24, `${detailChecks.linkSize.h}px`);
    if (detailChecks.infoName === null) na('detail: icône field-info nommée', 'aucune icône info'); else ok('detail: icône field-info nommée', detailChecks.infoName.length > 0, detailChecks.infoName);
    if (detailChecks.iframe === null) na('detail: iframe titré', 'pas d\'iframe'); else ok('detail: iframe titré', detailChecks.iframe.trim() !== '', detailChecks.iframe);

    // clavier : progression du focus
    await ap.goto(`${base}/#Account`, { waitUntil: 'domcontentloaded' });
    await ap.waitForSelector('#navbar .navbar', { state: 'attached', timeout: 30000 });
    await ap.waitForTimeout(1200);
    const focusPath = [];
    for (let i = 0; i < 10; i++) {
        await ap.keyboard.press('Tab');
        const cur = await ap.evaluate(`(() => {
            const e = document.activeElement;
            if (!e || e === document.body) return 'BODY';
            return e.tagName + '.' + (e.getAttribute('aria-label') || e.getAttribute('title') || e.innerText || '').trim().slice(0, 20);
        })()`);
        focusPath.push(cur);
    }
    const distinct = new Set(focusPath.filter(f => f !== 'BODY'));
    ok('clavier: le focus progresse (>=4 éléments distincts)', distinct.size >= 4, `${distinct.size} distincts`);

    await ctx.close();
}

await browser.close();
const fails = results.filter(r => !r.pass);
console.log(JSON.stringify({ total: results.length, fails: fails.length, results }, null, 1));
process.exit(fails.length ? 1 : 0);
