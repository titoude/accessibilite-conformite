#!/usr/bin/env node
/**
 * verify.mjs — assertions DURES sur les corrections plausible (cycle 48).
 * Effets mesurés dans le DOM rendu, jamais `if(el) ok()` ni `|| true`.
 * Un élément requis absent = FAIL ou N-A explicite.
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
await page.goto(`${base}/login`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('form[action="/login"], form input[name="email"]', { timeout: 30000 });
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
        const emailIn = document.querySelector('input[name="email"]');
        const passIn = document.querySelector('input[name="password"]');
        const imgsSansAlt = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length;
        const styledLinks = [...document.querySelectorAll('a')].filter(a => a.innerText.trim().length > 3)
            .map(a => ({ t: a.innerText.trim().slice(0, 30), deco: getComputedStyle(a).textDecorationLine || '' }));
        const docLinks = [...document.querySelectorAll('a[href*="plausible.io/docs"]')].map(a => accNameOf(a));
        const footer = !!document.querySelector('footer');
        const footerH4 = [...document.querySelectorAll('footer h4')].length;
        const footerH2 = [...document.querySelectorAll('footer h2')].length;
        return {
            lang, vp, locked, mainCount: mains.length,
            h1Present: !!h1, h1Txt, positiveTabindexCount: tabs.length,
            emailName: emailIn ? accNameOf(emailIn) : null,
            passName: passIn ? accNameOf(passIn) : null,
            imgsSansAlt, styledLinks, docLinks, footer, footerH4, footerH2,
        };
    })()
`);
ok('login: html[lang] non vide', skeleton.lang.length >= 2, skeleton.lang);
ok('login: viewport zoom non verrouillé', !skeleton.locked, skeleton.vp);
ok('login: landmark <main> présent', skeleton.mainCount >= 1, `${skeleton.mainCount} main`);
ok('login: <h1> présent et non vide', skeleton.h1Present && skeleton.h1Txt.length > 0, skeleton.h1Txt);
ok('login: aucun tabindex > 0', skeleton.positiveTabindexCount === 0, `${skeleton.positiveTabindexCount} restants`);
ok('login: aucune image sans attribut alt', skeleton.imgsSansAlt === 0, `${skeleton.imgsSansAlt} sans alt`);
ok('login: champ email labellisé', skeleton.emailName !== null && skeleton.emailName.length > 0, String(skeleton.emailName));
ok('login: champ password labellisé', skeleton.passName !== null && skeleton.passName.length > 0, String(skeleton.passName));
const badLinks = skeleton.styledLinks.filter(l => !l.deco.includes('underline'));
ok('login: liens stylés soulignés (link-in-text-block)', badLinks.length === 0, JSON.stringify(badLinks.slice(0, 4)));
if (skeleton.docLinks.length === 0) na('login: liens docs iconiques nommés', 'aucun lien docs sur cette page');
else ok('login: liens docs iconiques nommés', skeleton.docLinks.every(n => n.length > 0), JSON.stringify(skeleton.docLinks));
// /login utilise le gabarit focus_box sans pied de page — pas de <footer> attendu ici
if (!skeleton.footer) na('login: <footer> landmark', 'gabarit focus_box sans pied de page (vérifié sur /)');
else ok('login: <footer> présent', true);
ok('login: footer sans h4 (h2 à la place)', skeleton.footerH4 === 0, `${skeleton.footerH4} h4`);

// / (accueil public) : landmark footer + titres
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('body', { timeout: 30000 });
await page.waitForTimeout(800);
const home = await page.evaluate(`(() => {
    const footer = document.querySelector('footer');
    const fH4 = footer ? footer.querySelectorAll('h4').length : -1;
    const fH2 = footer ? footer.querySelectorAll('h2').length : -1;
    const h1 = document.querySelector('h1');
    const navs = [...document.querySelectorAll('nav')].map(n => n.getAttribute('aria-label') || null);
    return { footer: !!footer, fH4, fH2, h1: h1 ? (h1.innerText || '').trim().slice(0, 40) : null, navs };
})()`);
ok('accueil: <footer> landmark présent', home.footer);
ok('accueil: footer sans h4 (h2 à la place)', home.fH4 === 0, `${home.fH4} h4 / ${home.fH2} h2`);
ok('accueil: <h1> non vide', home.h1 !== null && home.h1.length > 0, String(home.h1));
ok('accueil: navs nommées', home.navs.length >= 1 && home.navs.every(n => n), JSON.stringify(home.navs));

await ctxPub.close();

// ---------- AUTHENTIFIÉ ----------
if (!existsSync(authPath)) {
    na('bloc authentifié', `storage-state ${authPath} absent`);
} else {
    const ctx = await browser.newContext({ locale: 'en-US', storageState: authPath });
    const ap = await ctx.newPage();

    // /sites : squelette + noms des boutons
    await ap.goto(`${base}/sites`, { waitUntil: 'domcontentloaded' });
    await ap.waitForSelector('main, [data-phx-session]', { timeout: 30000 });
    await ap.waitForTimeout(1500);

    const appSkeleton = await ap.evaluate(`${BROWSER_HELPERS}
        (() => {
            const mains = [...document.querySelectorAll('main')].filter(m => {
                const r = m.getBoundingClientRect(); return r.width > 0 && r.height > 0;
            });
            const h1s = [...document.querySelectorAll('h1')].filter(h => (h.innerText || '').trim() !== '');
            const navs = [...document.querySelectorAll('nav')].map(n => n.getAttribute('aria-label') || null);
            const imgsSansAlt = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length;
            const siteMenuBtns = [...document.querySelectorAll('[id$="-dropdown-trigger"]')].map(b => accNameOf(b));
            const iconBtns = [...document.querySelectorAll('button.btn-text-primary, button.btn-text-danger, a.btn-text-danger')].map(b => accNameOf(b));
            const noticeX = [...document.querySelectorAll('button[aria-label="Dismiss"]')].length;
            const h3s = [...document.querySelectorAll('h3')].length;
            const userMenuBtn = document.querySelector('#user-menu-button');
            return {
                mainCount: mains.length, h1Count: h1s.length, h1Txt: h1s[0] ? h1s[0].innerText.trim().slice(0, 40) : '',
                navs, imgsSansAlt, siteMenuBtns, iconBtns, noticeX, h3s,
                userMenuName: userMenuBtn ? accNameOf(userMenuBtn) : null,
                userMenuVisible: userMenuBtn ? (userMenuBtn.innerText || '').trim() : null,
            };
        })()
    `);
    ok('sites: landmark <main> présent', appSkeleton.mainCount >= 1, `${appSkeleton.mainCount} main`);
    ok('sites: <h1> non vide présent', appSkeleton.h1Count >= 1, `${appSkeleton.h1Count} h1 (${appSkeleton.h1Txt})`);
    ok('sites: navs nommées (aria-label)', appSkeleton.navs.length >= 1 && appSkeleton.navs.every(n => n), JSON.stringify(appSkeleton.navs));
    ok('sites: aucune image sans alt', appSkeleton.imgsSansAlt === 0, `${appSkeleton.imgsSansAlt} sans alt`);
    ok('sites: menus par site ont un nom dynamique', appSkeleton.siteMenuBtns.length > 0 && appSkeleton.siteMenuBtns.every(n => n.length > 0), JSON.stringify(appSkeleton.siteMenuBtns));
    if (appSkeleton.iconBtns.length === 0) na('sites: boutons iconiques edit/delete nommés', 'aucun sur cette page');
    else ok('sites: boutons iconiques edit/delete nommés', appSkeleton.iconBtns.every(n => n.length > 0), JSON.stringify(appSkeleton.iconBtns));
    // 2.5.3 : nom accessible ⊇ texte visible (bouton user-menu)
    if (appSkeleton.userMenuName === null) na('sites: user-menu nom ⊇ texte visible', 'bouton absent');
    else {
        const vis = (appSkeleton.userMenuVisible || '').trim();
        const pass = vis === '' ? appSkeleton.userMenuName.length > 0 : appSkeleton.userMenuName.toLowerCase().includes(vis.toLowerCase());
        ok('sites: user-menu nom accessible ⊇ texte visible', pass, `nom="${appSkeleton.userMenuName}" visible="${vis}"`);
    }

    // liaisons aria-labelledby/aria-controls résolues au repos (leçon 42)
    const liaison = await ap.evaluate(`(() => {
        const attrs = ['aria-labelledby', 'aria-controls'];
        const bad = [];
        for (const el of document.querySelectorAll('[aria-labelledby],[aria-controls]')) {
            for (const a of attrs) {
                const v = el.getAttribute(a);
                if (!v) continue;
                for (const id of v.split(/\\s+/).filter(Boolean)) {
                    if (!document.getElementById(id)) bad.push(el.tagName + '[' + a + '=' + id + ']');
                }
            }
        }
        return { badCount: bad.length, sample: bad.slice(0, 6) };
    })()`);
    ok('liaison: aria-labelledby/controls au repos résolvent', liaison.badCount === 0, JSON.stringify(liaison.sample));

    // switches : role=switch + aria-checked toujours présent (même "false")
    await ap.goto(`${base}/dummy.site/settings/visibility`, { waitUntil: 'domcontentloaded' });
    await ap.waitForSelector('main, [data-phx-session]', { timeout: 30000 });
    await ap.waitForTimeout(1200);
    const sw = await ap.evaluate(`${BROWSER_HELPERS}
        (() => {
            const switches = [...document.querySelectorAll('button[role="switch"]')].map(b => ({
                checked: b.getAttribute('aria-checked'),
                name: accNameOf(b),
            }));
            const copyBtn = document.querySelector('button[aria-label="Copy embed code"]');
            const aCopy = document.querySelector('a[onclick*="embed-code"]');
            const secH3 = [...document.querySelectorAll('main h3')].length;
            return { switches, copyBtnNamed: !!copyBtn, aCopyRemaining: !!aCopy, secH3 };
        })()
    `);
    ok('visibility: toggles role=switch avec aria-checked + nom',
        sw.switches.length > 0 && sw.switches.every(s => (s.checked === 'true' || s.checked === 'false') && s.name.length > 0),
        JSON.stringify(sw.switches));
    ok('visibility: copier le code = bouton nommé', sw.copyBtnNamed && !sw.aCopyRemaining, `btn=${sw.copyBtnNamed} a=${sw.aCopyRemaining}`);

    // people : avatars membres alt=""
    await ap.goto(`${base}/dummy.site/settings/people`, { waitUntil: 'domcontentloaded' });
    await ap.waitForSelector('main', { timeout: 30000 });
    await ap.waitForTimeout(1200);
    const ppl = await ap.evaluate(`(() => {
        const imgs = [...document.querySelectorAll('main img')];
        const sansAlt = imgs.filter(i => !i.hasAttribute('alt'));
        const memberImgs = [...document.querySelectorAll('li[id^="membership-"] img')];
        return { total: imgs.length, sansAlt: sansAlt.length, memberImgs: memberImgs.length };
    })()`);
    ok('people: avatars membres avec alt', ppl.sansAlt === 0, `${ppl.sansAlt}/${ppl.total} sans alt, ${ppl.memberImgs} membres`);

    // security : current_email labellisé
    await ap.goto(`${base}/settings/security`, { waitUntil: 'domcontentloaded' });
    await ap.waitForSelector('main', { timeout: 30000 });
    await ap.waitForTimeout(1200);
    const sec = await ap.evaluate(`${BROWSER_HELPERS}
        (() => {
            const inp = document.querySelector('input[name="user[current_email]"]');
            const accH2 = [...document.querySelectorAll('h2')].some(h => h.innerText.trim() === 'Account');
            const accH3 = [...document.querySelectorAll('h3')].some(h => h.innerText.trim() === 'Account');
            return { id: inp ? inp.id : null, name: inp ? accNameOf(inp) : null, accH2, accH3 };
        })()
    `);
    ok('security: user[current_email] labellisé', sec.name !== null && sec.name.length > 0, `id=${sec.id} nom=${sec.name}`);
    ok('security: section "Account" en h2 (pas h3)', sec.accH2 && !sec.accH3, `h2=${sec.accH2} h3=${sec.accH3}`);

    // choose-plan : slider, h2 plans, checkout nommés
    await ap.goto(`${base}/billing/choose-plan`, { waitUntil: 'domcontentloaded' });
    await ap.waitForSelector('main, #slider', { timeout: 30000 });
    await ap.waitForTimeout(1200);
    const plan = await ap.evaluate(`${BROWSER_HELPERS}
        (() => {
            const slider = document.querySelector('input#slider[name="slider"]');
            const h1 = document.querySelector('h1');
            const h2s = [...document.querySelectorAll('h2')].map(h => h.innerText.trim().slice(0, 30));
            const h3s = [...document.querySelectorAll('h3')].length;
            const ck = [...document.querySelectorAll('[id$="-checkout"]')].map(b => accNameOf(b));
            return { sliderName: slider ? accNameOf(slider) : null, h1: !!h1, h2s, h3s, ck };
        })()
    `);
    ok('choose-plan: slider labellisé', plan.sliderName !== null && plan.sliderName.length > 0, String(plan.sliderName));
    ok('choose-plan: h1 présent', plan.h1);
    ok('choose-plan: plans en h2, aucun h3 orphelin', plan.h2s.length > 0 && plan.h3s === 0, `h2=${JSON.stringify(plan.h2s)} h3=${plan.h3s}`);
    ok('choose-plan: boutons checkout nommés', plan.ck.length > 0 && plan.ck.every(n => n.length > 0), JSON.stringify(plan.ck));

    // dashboard : h1 sr-only, options-menu nommé, calendrier caché nommé
    await ap.goto(`${base}/dummy.site`, { waitUntil: 'domcontentloaded' });
    await ap.waitForSelector('main', { timeout: 30000, state: 'attached' });
    await ap.waitForSelector('[data-testid="site-switcher-current-site"]', { timeout: 30000 }).catch(() => {});
    await ap.waitForTimeout(2500);
    const dash = await ap.evaluate(`${BROWSER_HELPERS}
        (() => {
            const h1 = document.querySelector('#stats-react-container h1, main h1');
            const opts = document.querySelector('[data-testid="dashboard-options-menu"]');
            const period = document.querySelector('[data-testid="query-period-picker"]');
            const calBtn = [...document.querySelectorAll('button')].find(b => b.className.includes('w-0'));
            const canvasesBad = [...document.querySelectorAll('body > canvas')].filter(c => c.getAttribute('aria-hidden') !== 'true').length;
            const canvases = document.querySelectorAll('body > canvas').length;
            return {
                h1: h1 ? h1.innerText.trim() : null,
                optsName: opts ? accNameOf(opts) : null,
                periodName: period ? accNameOf(period) : null,
                calName: calBtn ? accNameOf(calBtn) : null,
                canvases, canvasesBad,
            };
        })()
    `);
    ok('dashboard: h1 présent (sr-only accepté)', dash.h1 !== null && dash.h1.length > 0, String(dash.h1));
    ok('dashboard: bouton options nommé', dash.optsName !== null && dash.optsName.length > 0, String(dash.optsName));
    ok('dashboard: sélecteur de période nommé', dash.periodName !== null && dash.periodName.length > 0, String(dash.periodName));
    if (dash.calName === null) na('dashboard: bouton calendrier caché nommé', 'absent du DOM'); else ok('dashboard: bouton calendrier caché nommé', dash.calName.length > 0, dash.calName);
    ok('dashboard: canvas topbar aria-hidden ou absent', dash.canvasesBad === 0, `${dash.canvasesBad}/${dash.canvases} sans aria-hidden`);

    // modale nommée (aria-label sur role=dialog) — visibility a le composant
    await ap.goto(`${base}/dummy.site/settings/visibility`, { waitUntil: 'domcontentloaded' });
    await ap.waitForSelector('main', { timeout: 30000 });
    await ap.waitForTimeout(1200);
    const modals = await ap.evaluate(`(() => {
        const ds = [...document.querySelectorAll('[role="dialog"]')];
        return { count: ds.length, unnamed: ds.filter(d => !(d.getAttribute('aria-label') || d.getAttribute('aria-labelledby'))).length };
    })()`);
    if (modals.count === 0) na('modales: role=dialog nommé', 'aucun dialog monté'); else ok('modales: role=dialog nommé', modals.unnamed === 0, `${modals.unnamed}/${modals.count} sans nom`);

    // sonde anti-slug i18n (leçon 43)
    const slugHits = await ap.evaluate(`(() => {
        const re = /^[a-z][a-z0-9-]*(\\.[a-z0-9-]+)+$/i;
        const hits = [];
        for (const el of document.querySelectorAll('[aria-label],[title],[placeholder]')) {
            for (const a of ['aria-label', 'title', 'placeholder']) {
                const v = (el.getAttribute(a) || '').trim();
                if (v && re.test(v)) hits.push(el.tagName.toLowerCase() + '[' + a + '=' + v + ']');
            }
        }
        return [...new Set(hits)].slice(0, 20);
    })()`);
    ok('anti-slug i18n: aucun nom rendu en clé non résolue', slugHits.length === 0, JSON.stringify(slugHits));

    await ctx.close();
}

await browser.close();
const fails = results.filter(r => !r.pass).length;
const naCount = results.filter(r => r.verdict === 'N-A').length;
console.log(`\nverify.mjs (plausible) : ${results.length - fails - naCount}/${results.length - naCount} OK, ${fails} FAIL, ${naCount} N-A`);
process.exit(fails ? 1 : 0);
