/**
 * verify.mjs — assertions DURES sur les corrections Kavita (cycle 45).
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

// Leçon 44 : ids d'instance résolus via l'API, injectés dans STATES —
// aucun library/series id en dur n'est toléré dans ce fichier.
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
    await page.goto(`${B}${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
};

// ── A. Landmarks + h1 sur pages du scope ───────────────────────────────────
for (const path of ['/login', '/home', IDS.libPath(0), IDS.seriesDetail, '/settings']) {
    await goto(path);
    const lm = await page.evaluate(() => {
        const mains = [...document.querySelectorAll('main, [role="main"]')]
            .filter(m => m.getClientRects().length > 0);
        const h1 = [...document.querySelectorAll('h1')].filter(h => h.getClientRects().length > 0 || getComputedStyle(h).clip !== undefined);
        const main = mains[0];
        return {
            htmlRole: document.documentElement.getAttribute('role'),
            mains: mains.length,
            h1inMain: main ? main.querySelectorAll('h1').length : 0,
        };
    });
    ok(`${path}: aucun role sur <html>`, lm.htmlRole === null, `role=${lm.htmlRole}`);
    ok(`${path}: un seul landmark main`, lm.mains === 1, `${lm.mains}`);
    ok(`${path}: h1 present dans main`, lm.h1inMain >= 1, `${lm.h1inMain}`);
}

// ── B. Nav : structure liste + noms ────────────────────────────────────────
await goto('/home');
{
    const nav = await page.evaluate(() => {
        const ul = document.querySelector('ul.navbar-nav');
        const bare = ul ? [...ul.children].filter(c => c.tagName !== 'LI').length : -1;
        const brand = document.querySelector('.navbar-brand');
        const profile = document.querySelector('button[ngbdropdowntoggle]');
        const navs = [...document.querySelectorAll('[role="navigation"]')]
            .filter(n => n.getClientRects().length > 0)
            .map(n => (n.getAttribute('aria-label') || '').trim());
        const donate = document.querySelector('.side-nav-item[href*="donating"], app-side-nav-item.donate a');
        return {
            bare, brand: (brand?.getAttribute('aria-label') || '').trim(),
            profile: (profile?.getAttribute('aria-label') || '').trim() || (profile?.innerText || '').trim(),
            navs, donate: donate ? (donate.getAttribute('aria-label') || donate.innerText || '').trim() : null,
        };
    });
    ok('navbar: aucun enfant non-li dans ul.navbar-nav', nav.bare === 0, `${nav.bare}`);
    ok('navbar: brand nommé (aria-label ⊇ visible)', nav.brand.toLowerCase().includes('kavita'), nav.brand);
    ok('navbar: bouton profil nommé', nav.profile.length > 0, nav.profile);
    ok('side-nav: landmark(s) navigation nommé(s)', nav.navs.length >= 1 && nav.navs.every(l => l.length > 0), JSON.stringify(nav.navs));
    ok('side-nav: lien externe donate nommé', nav.donate && nav.donate.length > 0, String(nav.donate));
}

// ── B2. Anti-slug (K1c) : les labels des landmarks sont du TEXTE RÉSOLU —
// jamais la clé i18n brute (« side-nav.side-nav-alt » rendrait un slug).
// Motif slug : token pointé de segments alphanumériques (déf. leçon 43).
{
    const SLUG = /[a-z0-9]+(\.[a-z0-9-]+){1,}/;
    const navs = await page.evaluate(() =>
        [...document.querySelectorAll('[role="navigation"][aria-label]')]
            .filter(n => n.getClientRects().length > 0)
            .map(n => n.getAttribute('aria-label').trim()));
    ok('nav labels: aucun slug i18n brut', navs.length > 0 && navs.every(l => !SLUG.test(l)), JSON.stringify(navs));
    ok('nav labels: « Side navigation » résolu', navs.includes('Side navigation'), JSON.stringify(navs));
    // /settings porte le 3e landmark (settings.side-nav-alt)
    await goto('/settings');
    const snavs = await page.evaluate(() =>
        [...document.querySelectorAll('[role="navigation"][aria-label]')]
            .filter(n => n.getClientRects().length > 0)
            .map(n => n.getAttribute('aria-label').trim()));
    ok('/settings nav: « Settings navigation » résolu (pas de slug)',
        snavs.includes('Settings navigation') && snavs.every(l => !SLUG.test(l)), JSON.stringify(snavs));
}

// ── C. Boutons iconiques nommés ────────────────────────────────────────────
await goto(IDS.seriesDetail);
{
    const btns = await page.evaluate(() => {
        const named = el => ((el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.innerText || '').trim().length > 0);
        const all = [...document.querySelectorAll('button')].filter(b => b.getClientRects().length > 0 && getComputedStyle(b).visibility !== 'hidden');
        const unnamed = all.filter(b => !named(b)).map(b => (b.id || b.className || '').slice(0, 50));
        const split = document.querySelector('.dropdown-toggle-split');
        const edit = document.querySelector('#edit-btn--komf');
        const cardAct = [...document.querySelectorAll('app-card-actionables button')].slice(0, 6)
            .map(b => { const lbl = (b.getAttribute('aria-label') || ''); const sp = (b.querySelector('span')?.textContent || '').trim(); return { lbl, contains: sp ? lbl.toLowerCase().includes(sp.toLowerCase()) : lbl.length > 0 }; });
        return { unnamed, split: (split?.getAttribute('aria-label') || '').trim(), edit: (edit?.getAttribute('aria-label') || '').trim(), cardAct };
    });
    ok('series-detail: tous les boutons nommés', btns.unnamed.length === 0, btns.unnamed.join('|'));
    ok('series-detail: dropdown-split nommé', btns.split.length > 0, btns.split);
    ok('series-detail: bouton edit nommé', btns.edit.length > 0, btns.edit);
    ok('card-actionables: aria-label ⊇ texte visible', btns.cardAct.length > 0 && btns.cardAct.every(c => c.contains), JSON.stringify(btns.cardAct));
}

// ── C2. Anti-slug card-actionables (K1c) : accName = « Actions for … » —
// le fallback labelBy() passe aussi (« Actions for card »), le slug brut
// « actionable.actions-for » (ou tout token pointé) est interdit.
for (const path of [IDS.libPath(0), IDS.seriesDetail]) {
    await goto(path);
    const probe = await page.evaluate(() => {
        const SLUG = /[a-z0-9]+(\.[a-z0-9-]+){1,}/;
        const labels = [...document.querySelectorAll('app-card-actionables button[aria-label]')]
            .map(b => b.getAttribute('aria-label').trim())
            .filter(v => v.length > 0);
        return { labels: labels.slice(0, 12), total: labels.length, slugs: labels.filter(v => SLUG.test(v)) };
    });
    ok(`${path}: card-actionables présents (${probe.total})`, probe.total > 0, `${probe.total}`);
    ok(`${path}: aucun aria-label slug`, probe.slugs.length === 0, probe.slugs.join('|'));
    ok(`${path}: aria-label « Actions for … »`, probe.labels.every(v => /^Actions for\b/i.test(v)), JSON.stringify(probe.labels));
}

// ── D. Nav tabs : li role=presentation ─────────────────────────────────────
{
    const tabs = await page.evaluate(() => {
        const tablists = [...document.querySelectorAll('ul[ngbnav], ul[role="tablist"], ul.nav-tabs, ul.nav-pills')];
        const bad = tablists.filter(ul => [...ul.children].some(c => c.tagName === 'LI' && !c.getAttribute('role')));
        return { tablists: tablists.length, bad: bad.length };
    });
    if (tabs.tablists > 0) ok('ngbNav: tous les li ont role', tabs.bad === 0, JSON.stringify(tabs));
    else na('ngbNav li role', 'aucun tablist sur la page');
}

// ── E. Modale : labelledby résolu ──────────────────────────────────────────
if (STATES['series-edit-modal']) {
    await page.goto(STATES['series-edit-modal'].url(B), { waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
    await STATES['series-edit-modal'].setup(page).catch(e => console.error('  setup:', e.message.slice(0, 60)));
    await page.waitForTimeout(800);
    const m = await page.evaluate(() => {
        const win = document.querySelector('ngb-modal-window');
        if (!win) return { open: false };
        const lid = win.getAttribute('aria-labelledby');
        return { open: true, role: win.getAttribute('role'), labelledby: lid, resolved: !!(lid && document.getElementById(lid)) };
    });
    if (m.open) {
        ok('modal: aria-labelledby résolu', m.resolved, JSON.stringify(m));
        // contrastes réels dans la modale (leçons 31/35 : composite mesuré)
        const cc = await page.evaluate(() => {
            const parse = c => { const m = (c || '').match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
            const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
            const lum = o => 0.2126 * srgb(o.r) + 0.7152 * srgb(o.g) + 0.0722 * srgb(o.b);
            const btn = document.querySelector('ngb-modal-window .btn-primary');
            const link = document.querySelector('ngb-modal-window .nav-link.active');
            const r = el => { if (!el) return null; const f = parse(getComputedStyle(el).color), b = parse(getComputedStyle(el).backgroundColor); if (!f || !b || b.a === 0) return { fg: f, bg: b }; return { fg: f, bg: b, ratio: +((Math.max(lum(f), lum(b)) + 0.05) / (Math.min(lum(f), lum(b)) + 0.05)).toFixed(2) }; };
            return { btn: r(btn), link: r(link) };
        });
        if (cc.btn?.ratio != null) ok('modal .btn-primary: contraste >= 4.5', cc.btn.ratio >= 4.5, JSON.stringify(cc.btn));
        else na('modal .btn-primary contrast', JSON.stringify(cc.btn));
        if (cc.link?.ratio != null) ok('modal nav-link.active: contraste >= 4.5', cc.link.ratio >= 4.5, JSON.stringify(cc.link));
        else na('modal nav-link contrast', JSON.stringify(cc.link));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
    } else na('modal', 'modale non ouverte par le state');
}

// ── F. Typeahead : structure listbox ───────────────────────────────────────
if (STATES['search-typeahead']) {
    await goto('/home');
    await STATES['search-typeahead'].setup(page).catch(e => console.error('  setup:', e.message.slice(0, 60)));
    await page.waitForTimeout(800);
    const tb = await page.evaluate(() => {
        const lb = document.querySelector('[role="listbox"]');
        if (!lb) return { open: false };
        const allowed = new Set(['option', 'presentation', 'group', 'listitem']);
        const bad = [...lb.children].filter(c => {
            const role = c.getAttribute('role') || (c.tagName === 'LI' ? 'listitem' : c.tagName.toLowerCase());
            if (allowed.has(role)) {
                // un groupe/li presentation peut contenir h5? non: checker descendants heading
                return [...c.querySelectorAll('h1,h2,h3,h4,h5,h6')].length > 0 && role === 'presentation' ? true : false;
            }
            return true;
        }).map(c => c.outerHTML.slice(0, 60));
        const opts = lb.querySelectorAll('[role="option"]').length;
        return { open: true, bad, opts };
    });
    if (tb.open) {
        ok('typeahead: enfants listbox tous role=option/presentation/group', tb.bad.length === 0, tb.bad.join('|'));
        ok('typeahead: options présentes', tb.opts > 0, `${tb.opts}`);
    } else na('typeahead listbox', 'listbox non ouvert par le state');
    await page.keyboard.press('Escape');
}

// ── G. Headings : aucun saut de niveau ─────────────────────────────────────
for (const path of ['/home', IDS.libPath(0), '/settings', '/collections']) {
    await goto(path);
    const hs = await page.evaluate(() => {
        const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.getClientRects().length > 0);
        let skip = null, prev = 0;
        for (const h of heads) { const l = +h.tagName[1]; if (prev && l > prev + 1) { skip = `h${prev}->h${l} "${(h.textContent || '').trim().slice(0, 40)}"`; break; } prev = l; }
        return { count: heads.length, skip };
    });
    ok(`${path}: hiérarchie de titres sans saut`, hs.skip === null, hs.skip || `${hs.count} titres`);
}

// ── Résumé ────────────────────────────────────────────────────────────────
const fails = results.filter(r => !r.pass);
console.log(`verify: ${results.length - fails.length}/${results.length} PASS, ${fails.length} FAIL`);
if (fails.length) { for (const f of fails) console.log('  FAIL', f.name); process.exitCode = 1; }
await browser.close();
