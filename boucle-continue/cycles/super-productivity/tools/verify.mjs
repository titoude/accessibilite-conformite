#!/usr/bin/env node
/**
 * verify.mjs — assertions DURES sur les corrections super-productivity (cycle 51).
 * Effets mesurés dans le DOM rendu, jamais `if(el) ok()` ni `|| true`.
 * Un élément requis absent = FAIL ou N-A explicite.
 * Le score axe n'est pas auto-produit ici (règle: pas de self-verdict).
 *
 * Usage: node verify.mjs <baseUrl> [profileDir]
 */
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));

const [base = 'http://localhost:9251/', profileDir = resolve(HERE, 'seed-profile')] = process.argv.slice(2);
if (!existsSync(profileDir)) { console.error('FAIL: profil seed absent — lancer seed.mjs'); process.exit(2); }

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
    const ll = el.getAttribute('aria-labelledby');
    if (ll) { const t = ll.split(/\\s+/).map(id => document.getElementById(id)?.innerText?.trim() || '').join(' ').trim(); if (t) return t; }
    const t = el.getAttribute('title');
    if (t !== null && t.trim() !== '') return t.trim();
    const lb = el.id && document.querySelector('label[for="' + el.id + '"]');
    if (lb && lb.innerText.trim() !== '') return lb.innerText.trim();
    return (el.innerText || el.value || '').trim();
};
`;

const ctx = await chromium.launchPersistentContext(profileDir, { locale: 'en-US' });
const page = ctx.pages()[0] || await ctx.newPage();

const goto = async (url, sel = '.route-wrapper') => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector(sel, { timeout: 30000 });
    await page.waitForTimeout(1800);
};

// ---------- squelette global ----------
await goto(`${base}#/tag/TODAY/tasks`, 'task');
const skeleton = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const html = document.documentElement;
        const lang = html.getAttribute('lang') || '';
        const vp = document.querySelector('meta[name="viewport"]')?.content || '';
        const locked = /user-scalable\\s*=\\s*(no|0)/i.test(vp) || /maximum-scale\\s*=\\s*1(\\.0+)?\\b/i.test(vp);
        const mains = [...document.querySelectorAll('main,[role=main]')].filter(m => {
            const r = m.getBoundingClientRect(); return r.width > 0 && r.height > 0;
        });
        const tabs = [...document.querySelectorAll('[tabindex]')]
            .map(e => parseInt(e.getAttribute('tabindex'), 10))
            .filter(n => n > 0);
        const overlay = document.querySelector('.cdk-overlay-container');
        return {
            lang, vp, locked,
            mainCount: mains.length,
            positiveTabindexCount: tabs.length,
            overlayRole: overlay?.getAttribute('role') || null,
            overlayLabel: overlay?.getAttribute('aria-label') || null,
        };
    })()
`);
ok('app: html[lang] non vide', skeleton.lang.length >= 2, skeleton.lang);
ok('app: viewport zoom non verrouillé', !skeleton.locked, skeleton.vp);
ok('app: landmark <main> présent', skeleton.mainCount >= 1, `${skeleton.mainCount} main`);
ok('app: aucun tabindex > 0', skeleton.positiveTabindexCount === 0, `${skeleton.positiveTabindexCount} restants`);
ok('app: overlay container role=region', skeleton.overlayRole === 'region', String(skeleton.overlayRole));
ok('app: overlay container aria-label', !!skeleton.overlayLabel, String(skeleton.overlayLabel));

// ---------- navigation latérale ----------
const nav = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const list = document.querySelector('ul.nav-list');
        if (!list) return { present: false };
        const lis = [...list.children].filter(c => c.tagName === 'LI');
        const hr = list.querySelector('hr.nav-separator');
        const handle = document.querySelector('.resize-handle');
        // ancres mat-menu-item hors menu -> role=link ; boutons -> role=button
        const anchors = [...list.querySelectorAll('a')].filter(a => a.closest('[role=menu]') === null);
        const badAnchors = anchors.filter(a => a.getAttribute('role') !== 'link').length;
        const btns = [...list.querySelectorAll('button')].filter(b => b.closest('[role=menu]') === null);
        const unnamed = btns.filter(b => accNameOf(b) === '').length;
        const unnamedA = anchors.filter(a => accNameOf(a) === '').length;
        return {
            present: true,
            listRole: list.getAttribute('role'),
            liRoles: lis.slice(0, 6).map(li => li.getAttribute('role')),
            liCount: lis.length,
            hrRole: hr?.getAttribute('role') || null,
            handleRole: handle?.getAttribute('role') || null,
            handleOrient: handle?.getAttribute('aria-orientation') || null,
            handleLabel: handle?.getAttribute('aria-label') || null,
            anchors: anchors.length, badAnchors,
            btns: btns.length, unnamed, unnamedA,
        };
    })()
`);
if (!nav.present) {
    ok('nav: ul.nav-list rendue', false, 'absente');
} else {
    ok('nav: ul.nav-list role=list', nav.listRole === 'list', String(nav.listRole));
    ok('nav: li role=listitem', nav.liCount > 0 && nav.liRoles.every(r => r === 'listitem' || r === 'none'), JSON.stringify(nav.liRoles));
    ok('nav: hr.nav-separator role=none', nav.hrRole === 'none' || nav.hrRole === null && nav.hrRole !== null, String(nav.hrRole));
    ok('nav: resize-handle role=separator', nav.handleRole === 'separator', String(nav.handleRole));
    ok('nav: resize-handle aria-orientation', nav.handleOrient === 'vertical', String(nav.handleOrient));
    ok('nav: resize-handle aria-label', !!nav.handleLabel, String(nav.handleLabel));
    ok('nav: ancres hors menu ont role=link', nav.badAnchors === 0, `${nav.badAnchors}/${nav.anchors} sans role=link`);
    ok('nav: boutons nommés', nav.unnamed === 0, `${nav.unnamed}/${nav.btns} sans nom`);
    ok('nav: ancres nommées', nav.unnamedA === 0, `${nav.unnamedA} sans nom`);
}

// ---------- add-task-bar global ----------
// La barre globale ne se monte qu'après le bouton d'ajout du header (déjà
// vérifié par l'axe sur l'état add-task-bar-open).
const addBtn = page.locator('.tour-addBtn').first();
try { await addBtn.waitFor({ state: 'visible', timeout: 15000 }); await addBtn.click();
  await page.waitForSelector('add-task-bar', { state: 'attached', timeout: 10000 }); } catch {}
const addBar = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const wrap = document.querySelector('add-task-bar');
        const search = wrap?.closest('[role=search]') || wrap?.querySelector('[role=search]');
        const inp = wrap?.querySelector('.main-input');
        return {
            present: !!wrap,
            searchRole: search?.getAttribute('role') || null,
            inpTag: inp?.tagName || null,
            inpType: inp?.getAttribute('type') || null,
            inpLabel: inp ? accNameOf(inp) : null,
        };
    })()
`);
ok('add-task-bar: présent', addBar.present);
if (addBar.present) {
    ok('add-task-bar: région role=search', addBar.searchRole === 'search', String(addBar.searchRole));
    ok('add-task-bar: .main-input est input[type=text]', addBar.inpTag === 'INPUT' && addBar.inpType === 'text', `${addBar.inpTag}/${addBar.inpType}`);
    ok('add-task-bar: .main-input a un nom accessible', !!addBar.inpLabel, String(addBar.inpLabel));
}
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// ---------- boutons de tâche (.controls) ----------
const taskBtns = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const t = document.querySelector('task');
        if (!t) return { present: false };
        const btns = [...t.querySelectorAll('.controls button, .ico-btn')];
        const bad = btns.filter(b => accNameOf(b) === '').map(b => b.className.slice(0, 60));
        return { present: true, total: btns.length, bad };
    })()
`);
if (!taskBtns.present) na('task: boutons .controls nommés', 'aucune tâche affichée');
else ok('task: boutons .controls nommés', taskBtns.bad.length === 0, `${taskBtns.bad.length}/${taskBtns.total} ${JSON.stringify(taskBtns.bad.slice(0, 3))}`);

// ---------- menu contextuel tâche ----------
const t0 = page.locator('task').first();
await t0.hover();
await t0.click({ button: 'right' });
const menuOpen = await page.waitForSelector('.mat-mdc-menu-panel', { timeout: 10000 }).catch(() => null);
if (!menuOpen) {
    ok('menu contextuel: panel ouvert', false, 'aucun .mat-mdc-menu-panel');
} else {
    await page.waitForTimeout(600);
    const menu = await page.evaluate(`${BROWSER_HELPERS}
        (() => {
            const panel = document.querySelector('.mat-mdc-menu-panel');
            const kids = [...panel.querySelectorAll('.quick-access button')];
            const roles = kids.map(b => b.getAttribute('role'));
            const names = kids.map(b => accNameOf(b));
            const items = [...panel.querySelectorAll('mat-menu-item, [mat-menu-item]')].length;
            return { kids: kids.length, roles, names, items };
        })()
    `);
    ok('menu contextuel: quick-access présent', menu.kids >= 3, `${menu.kids} boutons`);
    ok('menu contextuel: boutons role=menuitem', menu.roles.every(r => r === 'menuitem'), JSON.stringify(menu.roles));
    ok('menu contextuel: boutons nommés', menu.names.every(n => n.length > 0), JSON.stringify(menu.names));
    ok('menu contextuel: items de menu présents', menu.items >= 1, `${menu.items}`);
    // Escape ferme le menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(700);
    const still = await page.evaluate(() => !!document.querySelector('.mat-mdc-menu-panel'));
    ok('menu contextuel: Escape ferme', !still);
}

// ---------- panneau de détail ----------
await goto(`${base}#/tag/TODAY/tasks`, 'task');
const t1 = page.locator('task').first();
await t1.hover();
await t1.locator('.show-additional-info-btn').first().click();
const panelOk = await page.waitForSelector('task-detail-panel', { timeout: 10000 }).catch(() => null);
if (!panelOk) {
    ok('detail: panneau ouvert', false, 'pas de task-detail-panel');
} else {
    await page.waitForTimeout(1200);
    const det = await page.evaluate(`${BROWSER_HELPERS}
        (() => {
            const panel = document.querySelector('task-detail-panel');
            const btns = [...panel.querySelectorAll('button[mat-icon-button], button.mdc-icon-button')];
            const bad = btns.filter(b => accNameOf(b) === '').length;
            const inputs = [...panel.querySelectorAll('inline-input input, inline-input textarea')];
            const badIn = inputs.filter(i => accNameOf(i) === '').length;
            return { btns: btns.length, bad, inputs: inputs.length, badIn };
        })()
    `);
    ok('detail: boutons icône nommés', det.bad === 0, `${det.bad}/${det.btns}`);
    ok('detail: inline-inputs nommés', det.badIn === 0, `${det.badIn}/${det.inputs}`);
}

// ---------- daily-summary : onglets + inline-inputs + titres ----------
await goto(`${base}#/tag/TODAY/daily-summary`);
const ds = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const tabs = [...document.querySelectorAll('[role=tab]')];
        const tabNames = tabs.map(t => accNameOf(t));
        const inputs = [...document.querySelectorAll('inline-input input')];
        const badIn = inputs.filter(i => accNameOf(i) === '').length;
        const h2week = [...document.querySelectorAll('h2')].some(h => /week/i.test(h.innerText));
        const activeLab = document.querySelector('.mdc-tab--active .mdc-tab__text-label, [role=tab][aria-selected=true] .mdc-tab__text-label');
        return {
            tabCount: tabs.length,
            tabNamesEmpty: tabNames.filter(n => !n || n.trim() === '').length,
            inputs: inputs.length, badIn, h2week,
            activeRatio: activeLab ? +textContrast(activeLab).toFixed(2) : null,
        };
    })()
`);
ok('daily-summary: onglets présents', ds.tabCount >= 1, `${ds.tabCount}`);
ok('daily-summary: onglets nommés', ds.tabNamesEmpty === 0, `${ds.tabNamesEmpty}/${ds.tabCount}`);
ok('daily-summary: inline-inputs nommés', ds.badIn === 0, `${ds.badIn}/${ds.inputs}`);
ok('daily-summary: semaine en h2', ds.h2week);
if (ds.activeRatio === null) na('daily-summary: contraste onglet actif', 'label introuvable');
else ok('daily-summary: contraste onglet actif >= 4.5', ds.activeRatio >= 4.5, `ratio ${ds.activeRatio}`);

// ---------- i18n : les aria-labels introduits par le patch RÉSOLVENT ----------
// Leçon 43 : la valeur rendue de chaque attribut introduit doit égaler le
// texte réel de en.json — jamais le slug `X.Y.Z` (instant() non chargé ou
// clé absente rendent la clé brute, invisible pour axe ET pour length>0).
const enJson = await page.evaluate(async () => {
    try {
        const r = await fetch('assets/i18n/en.json');
        return r.ok ? await r.json() : null;
    } catch { return null; }
});
ok('i18n: en.json servi par l\u2019instance', !!enJson, 'fetch assets/i18n/en.json');
if (enJson) {
    const i18nLabels = await page.evaluate(() => ({
        overlay: document.querySelector('.cdk-overlay-container')?.getAttribute('aria-label') ?? null,
        handle: document.querySelector('.resize-handle')?.getAttribute('aria-label') ?? null,
        // aucun aria-label de la page ne doit ressembler à une clé brute
        slugs: [...document.querySelectorAll('[aria-label]')]
            .map(e => e.getAttribute('aria-label'))
            .filter(v => /^[A-Z][A-Z0-9_]*(\.[A-Z0-9_]+)+$/.test(v)),
    }));
    ok('i18n: overlay aria-label = G.OVERLAYS résolu', i18nLabels.overlay === enJson.G.OVERLAYS, `rendu=${JSON.stringify(i18nLabels.overlay)} attendu=${JSON.stringify(enJson.G.OVERLAYS)}`);
    ok('i18n: resize-handle aria-label = MH.RESIZE_SIDENAV résolu', i18nLabels.handle === enJson.MH.RESIZE_SIDENAV, `rendu=${JSON.stringify(i18nLabels.handle)} attendu=${JSON.stringify(enJson.MH.RESIZE_SIDENAV)}`);
    ok('i18n: aucun aria-label en clé brute sur la page', i18nLabels.slugs.length === 0, JSON.stringify(i18nLabels.slugs.slice(0, 5)));

    // daily-summary : bascule réelle pour exercer les DEUX branches du @if
    // (add-custom-text-block ⇄ remove-note) — chaque libellé doit résoudre
    // sa clé, dans quelque état initial que ce soit, et on restaure à la fin.
    const dsLabel = async () => page.evaluate(() => {
        const btns = [...document.querySelectorAll('.day-end-note button')];
        const pick = (icon) => btns.find(b => (b.querySelector('mat-icon')?.textContent || '').trim() === icon)?.getAttribute('aria-label') ?? null;
        return { add: pick('note_alt'), rm: pick('visibility_off') };
    });
    const clickIcon = async (icon) => {
        const b = page.locator(`.day-end-note button:has-text("${icon}")`).first();
        await b.click();
        await page.waitForTimeout(800);
    };
    const expAdd = enJson.PDS.ADD_CUSTOM_TEXT_BLOCK;
    const expRm = enJson.PDS.REMOVE_DAILY_SUMMARY_NOTE;
    const st0 = await dsLabel();
    if (st0.add !== null && st0.rm !== null) {
        ok('i18n: daily-summary labels résolus (2 branches)', st0.add === expAdd && st0.rm === expRm, JSON.stringify(st0));
    } else if (st0.add !== null) {
        ok('i18n: daily-summary add = PDS.ADD_CUSTOM_TEXT_BLOCK résolu', st0.add === expAdd, `rendu=${JSON.stringify(st0.add)}`);
        await clickIcon('note_alt'); // crée la note → remove apparaît
        const st1 = await dsLabel();
        ok('i18n: daily-summary remove = PDS.REMOVE_DAILY_SUMMARY_NOTE résolu', st1.rm === expRm, `rendu=${JSON.stringify(st1.rm)} après bascule`);
        await clickIcon('visibility_off'); // restaure : retire la note vide
        await page.waitForTimeout(500);
    } else if (st0.rm !== null) {
        ok('i18n: daily-summary remove = PDS.REMOVE_DAILY_SUMMARY_NOTE résolu', st0.rm === expRm, `rendu=${JSON.stringify(st0.rm)}`);
        await clickIcon('visibility_off'); // retire la note → add apparaît
        const st1 = await dsLabel();
        ok('i18n: daily-summary add = PDS.ADD_CUSTOM_TEXT_BLOCK résolu', st1.add === expAdd, `rendu=${JSON.stringify(st1.add)} après bascule`);
        await clickIcon('note_alt'); // restaure la note vide initiale
        await page.waitForTimeout(500);
    } else {
        ok('i18n: daily-summary labels résolus', false, 'ni add ni remove rendu dans .day-end-note');
    }
}

// ---------- history : th vides remplis (cdk-visually-hidden) ----------
await goto(`${base}#/tag/TODAY/history`);
const hist = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const ths = [...document.querySelectorAll('th')];
        const empty = ths.filter(t => !t.innerText.trim());
        const hidden = [...document.querySelectorAll('th .cdk-visually-hidden')].length;
        return { thCount: ths.length, empty: empty.length, hidden };
    })()
`);
ok('history: aucun th vide', hist.empty === 0, `${hist.empty}/${hist.thCount}`);
ok('history: texte cdk-visually-hidden injecté', hist.hidden >= 1, `${hist.hidden}`);

// ---------- planner : contraste tâches faites ----------
await goto(`${base}#/planner`);
const pl = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const titles = [...document.querySelectorAll('planner-task.isDone .title, planner-task .isDone .title')];
        const ratios = titles.map(t => +textContrast(t).toFixed(2));
        const done = document.querySelector('planner-task .isDone');
        const op = done ? +getComputedStyle(done).opacity : null;
        return { doneCount: titles.length, minRatio: ratios.length ? Math.min(...ratios) : null, op };
    })()
`);
if (pl.doneCount === 0) na('planner: contraste tâches faites', 'aucune tâche isDone rendue');
else ok('planner: contraste tâches faites >= 4.5', pl.minRatio >= 4.5, `min ${pl.minRatio} (opacité ${pl.op})`);

// ---------- config : onglets nommés ----------
await goto(`${base}#/config`);
const cfg = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const tabs = [...document.querySelectorAll('[role=tab]')];
        const names = tabs.map(t => accNameOf(t));
        return { n: tabs.length, empty: names.filter(n => !n || !n.trim()).length };
    })()
`);
ok('config: onglets présents', cfg.n >= 1, `${cfg.n}`);
ok('config: onglets nommés', cfg.empty === 0, `${cfg.empty}/${cfg.n}`);

// ---------- mobile 390 ----------
await page.setViewportSize({ width: 390, height: 844 });
await goto(`${base}#/tag/TODAY/tasks`, 'task');
const mob = await page.evaluate(`(() => ({
    wrapper: !!document.querySelector('.route-wrapper'),
    tasks: document.querySelectorAll('task').length,
    ham: !!document.querySelector('button[aria-label], .burger'),
}))()`);
ok('mobile 390: route-wrapper rend', mob.wrapper);
ok('mobile 390: tâches rendues', mob.tasks >= 1, `${mob.tasks}`);

await ctx.close();

const fails = results.filter(r => !r.pass).length;
const naCount = results.filter(r => r.verdict === 'N-A').length;
console.log(`\nverify.mjs: ${results.length - fails}/${results.length} assertions pass (${fails} FAIL, ${naCount} N-A)`);
process.exit(fails ? 1 : 0);
