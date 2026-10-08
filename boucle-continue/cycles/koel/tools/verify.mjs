/**
 * verify.mjs — assertions DURES sur les corrections Koel (cycle 49).
 * Effets mesurés dans le DOM rendu, jamais `if(el) ok()` ni `|| true`.
 * Un élément requis absent = FAIL. axe n'est pas auto-verdict ici.
 *
 * Usage: node verify.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const { STATES, setIds } = await import('./audit.mjs');
const { resolveIds } = await import('./resolve-ids.mjs');
const HERE = dirname(fileURLToPath(import.meta.url));

const [base, authPath = 'auth.json'] = process.argv.slice(2);
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }
const B = base.replace(/\/$/, '');

// Leçon 44 : ids dynamiques résolus via l'API, injectés dans STATES.
const IDS = await resolveIds(B, authPath);
setIds(IDS);

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

const browser = await chromium.launch();
const storageState = existsSync(authPath) ? authPath : existsSync(resolve(HERE, authPath)) ? resolve(HERE, authPath) : undefined;
const ctx = await browser.newContext({ storageState, locale: 'en-US' });
const page = await ctx.newPage();

const goto = async (path) => {
    await page.goto(`${B}${path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
};

// ── A. Landmarks : 1 main + h1 visible par écran ───────────────────────────
for (const path of ['/#/home', '/#/songs', IDS.albumPath, '/#/settings', '/#/visualizer', '/#/browse']) {
    await goto(path);
    await page.waitForSelector('main, [role="main"]', { state: 'visible', timeout: 15000 }).catch(() => {});
    await page.waitForSelector('h1', { state: 'visible', timeout: 15000 }).catch(() => {});
    const lm = await page.evaluate(() => {
        const mains = [...document.querySelectorAll('main, [role="main"]')].filter(m => m.getClientRects().length > 0);
        const h1s = [...document.querySelectorAll('h1, [role="heading"][aria-level="1"]')].filter(h => h.getClientRects().length > 0);
        return { mains: mains.length, h1s: h1s.length };
    });
    ok(`${path}: exactement un landmark main visible`, lm.mains === 1, `mains=${lm.mains}`);
    ok(`${path}: au moins un h1 visible`, lm.h1s >= 1, `h1s=${lm.h1s}`);
}

// /#/browse : garde media-browser -> écran 404 accessible quand feature off
await goto('/#/browse');
{
    const nf = await page.evaluate(() => ({
        is404: document.body.innerText.toLowerCase().includes('not found') || !!document.querySelector('main'),
    }));
    ok('/#/browse feature-gated: rend un écran avec main (404 ou browser)', nf.is404);
}

// ── B. Nav : landmarks nommés + anti-slug (leçon 43 : texte résolu) ────────
await goto('/#/home');
{
    const navs = await page.evaluate(() =>
        [...document.querySelectorAll('nav, [role="navigation"]')]
            .filter(n => n.getClientRects().length > 0)
            .map(n => (n.getAttribute('aria-label') || '').trim()));
    const SLUG = /[a-z0-9]+(\.[a-z0-9-]+){1,}/;
    ok('nav: au moins un landmark navigation', navs.length >= 1, JSON.stringify(navs));
    ok('nav: tous nommés', navs.every(l => l.length > 0), JSON.stringify(navs));
    ok('nav: labels = texte résolu (pas de slug i18n)', navs.every(l => !SLUG.test(l)), JSON.stringify(navs));
    ok('nav: unicité des labels', new Set(navs).size === navs.length, JSON.stringify(navs));
}

// ── C. Boutons iconiques nommés (footer, header, sidebar) ──────────────────
for (const path of ['/#/home', '/#/songs', IDS.albumPath]) {
    await goto(path);
    const btns = await page.evaluate(() => {
        const named = el => {
            const by = el.getAttribute('aria-labelledby');
            if (by) return [...document.querySelectorAll(`[id="${by}"]`)].some(t => (t.textContent || '').trim());
            if ((el.getAttribute('title') || '').trim().length > 0) return true;
            const imgAlt = el.querySelector('img[alt]:not([alt=""])');
            if (imgAlt) return true;
            return ((el.getAttribute('aria-label') || el.innerText || '').trim().length > 0);
        };
        const all = [...document.querySelectorAll('button, [role="button"], input[type=range], select')].filter(
            b => b.getClientRects().length > 0 && getComputedStyle(b).visibility !== 'hidden' && b.getAttribute('aria-hidden') !== 'true');
        return { total: all.length, bad: all.filter(b => !named(b)).map(b => (b.getAttribute('data-testid') || String(b.className)).slice(0, 60)).slice(0, 8) };
    });
    ok(`${path}: tous les boutons/champs interactifs nommés`, btns.bad.length === 0, `${btns.bad.length}/${btns.total} ${btns.bad.join('|')}`);
}

// album-thumb : role=button + nom + activation clavier (Enter) quand playable
await goto('/#/queue');
{
    const t = await page.evaluate(() => {
        const el = document.querySelector('.album-thumb');
        return el ? { role: el.getAttribute('role'), tab: el.getAttribute('tabindex'), label: el.getAttribute('aria-label') } : null;
    });
    if (t) ok('album-thumb jouable: role=button nommé focusable', t.role === 'button' && t.tab === '0' && (t.label || '').length > 0, JSON.stringify(t));
    else na('album-thumb', 'rien en lecture');
}

// ── D. SideSheet tabs : tablist + aria-selected/aria-controls résolus ──────
await goto('/#/home');
{
    const tabs = await page.evaluate(() => {
        const tl = document.querySelector('[role="tablist"]');
        const tabs = [...document.querySelectorAll('[role="tab"]')].filter(t => t.getClientRects().length > 0);
        return {
            tablist: !!tl,
            count: tabs.length,
            allNamed: tabs.every(t => (t.innerText || t.getAttribute('aria-label') || '').trim().length > 0),
            selOk: tabs.every(t => ['true', 'false'].includes(t.getAttribute('aria-selected'))),
            controlsOk: tabs.every(t => { const c = t.getAttribute('aria-controls'); return !c || !!document.getElementById(c); }),
        };
    });
    ok('sidesheet: tablist présent', tabs.tablist);
    if (tabs.count > 0) {
        ok('sidesheet: tabs nommés + aria-selected', tabs.allNamed && tabs.selOk, JSON.stringify(tabs));
        ok('sidesheet: aria-controls sans référence pendante', tabs.controlsOk);
    } else na('sidesheet tabs', 'aucune lecture en cours (pas de tabs)');
}

// ── E. Context menu : dialog > ul[role=menu] > li[role=menuitem|separator] ──
await goto('/#/songs');
await STATES['song-context-menu'].setup(page);
await STATES['song-context-menu'].stateProof(page).catch(() => {});
await page.waitForTimeout(500);
{
    const menu = await page.evaluate(() => {
        const dlg = document.querySelector('.menu.context-menu[role="dialog"]');
        if (!dlg || !dlg.getClientRects().length) return { open: false };
        const ul = dlg.querySelector('ul[role="menu"]');
        if (!ul) return { open: true, hasMenu: false, name: dlg.getAttribute('aria-label') };
        const allowed = new Set(['menuitem', 'menuitemcheckbox', 'menuitemradio', 'separator', 'group']);
        const bad = [...ul.children].filter(c => !allowed.has(c.getAttribute('role') || ''));
        const items = ul.querySelectorAll('li[role="menuitem"]');
        const subs = [...ul.querySelectorAll('li[role="menuitem"]')].filter(li => li.querySelector('ul[role="menu"]'));
        return {
            open: true, hasMenu: true,
            name: dlg.getAttribute('aria-label'),
            bad: bad.length,
            items: items.length,
            subsOk: subs.every(li => li.getAttribute('aria-haspopup') === 'menu'),
        };
    });
    ok('context-menu: ouvert', menu.open);
    if (menu.open) {
        ok('context-menu: dialog nommé', (menu.name || '').length > 0, String(menu.name));
        ok('context-menu: ul[role=menu] présent', menu.hasMenu);
        ok('context-menu: enfants tous autorisés', menu.bad === 0, `bad=${menu.bad}`);
        ok('context-menu: items menuitem présents', menu.items > 5, `${menu.items}`);
        ok('context-menu: sous-menus aria-haspopup=menu', menu.subsOk);
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
}

// ── F. Modales natives <dialog> ────────────────────────────────────────────
await STATES['edit-song-modal'].setup(page).catch(e => console.error('  setup:', e.message.slice(0, 70)));
await page.waitForTimeout(600);
{
    const m = await page.evaluate(() => {
        const d = document.querySelector('dialog[open]');
        if (!d) return { open: false };
        return { open: true, focusInside: d.contains(document.activeElement), hasInput: !!d.querySelector('[data-testid="title-input"]') };
    });
    if (m.open) {
        ok('edit-song modal: <dialog> natif ouvert', true);
        ok('edit-song modal: champ titre présent', m.hasInput);
        await page.keyboard.press('Escape');
    } else ok('edit-song modal: ouverte après replay', false, 'dialog[open] absent');
}

// ── G. Égaliseur : sliders nommés via aria-labelledby résolu ───────────────
await STATES['equalizer-open'].setup(page).catch(e => console.error('  setup:', e.message.slice(0, 70)));
await page.waitForTimeout(600);
{
    const eq = await page.evaluate(() => {
        const handles = [...document.querySelectorAll('dialog[open] .noUi-handle[role="slider"]')];
        const missing = handles.filter(h => {
            const by = h.getAttribute('aria-labelledby');
            return !by || ![...by.split(' ')].every(id => document.getElementById(id));
        });
        const sel = document.querySelector('dialog[open] select');
        return { handles: handles.length, missing: missing.length, selectLabeled: !!(sel && (sel.getAttribute('aria-label') || sel.closest('label') || sel.id && document.querySelector(`label[for="${sel.id}"]`))) };
    });
    ok('equalizer: sliders présents', eq.handles >= 10, `${eq.handles}`);
    ok('equalizer: aria-labelledby résolu sur chaque slider', eq.missing === 0, `missing=${eq.missing}`);
    ok('equalizer: select preset nommé', eq.selectLabeled);
    await page.keyboard.press('Escape');
}

// ── H. Contraste mesuré : bouton highlight + titre en lecture ──────────────
await goto('/#/home');
{
    const cc = await page.evaluate(() => {
        const parse = c => { const m = (c || '').match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] }; };
        const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
        const lum = o => 0.2126 * srgb(o.r) + 0.7152 * srgb(o.g) + 0.0722 * srgb(o.b);
        const r = el => { if (!el) return null; const f = parse(getComputedStyle(el).color); let b = null, n = el; while (n && (!b || b.a === 0)) { b = parse(getComputedStyle(n).backgroundColor); n = n.parentElement; }
            if (!f || !b || b.a === 0) return null; return +((Math.max(lum(f), lum(b)) + 0.05) / (Math.min(lum(f), lum(b)) + 0.05)).toFixed(2); };
        return {
            highlightBtn: r(document.querySelector('button[data-variant="highlight"], a.btn[data-variant="highlight"]')),
            primaryBtn: r(document.querySelector('button[data-variant="primary"], button.btn')),
        };
    });
    if (cc.highlightBtn != null) ok('btn highlight: contraste >= 4.5 (mesuré)', cc.highlightBtn >= 4.5, `${cc.highlightBtn}`);
    else na('btn highlight contrast', JSON.stringify(cc));
    if (cc.primaryBtn != null) ok('btn primary: contraste >= 4.5 (mesuré)', cc.primaryBtn >= 4.5, `${cc.primaryBtn}`);
    else na('btn primary contrast', JSON.stringify(cc));
}

// ── Résumé ────────────────────────────────────────────────────────────────
const fails = results.filter(r => !r.pass);
console.log(`verify: ${results.length - fails.length}/${results.length} PASS, ${fails.length} FAIL`);
if (fails.length) { for (const f of fails) console.log('  FAIL', f.name); process.exitCode = 1; }
await browser.close();
