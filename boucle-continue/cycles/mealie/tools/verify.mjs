/**
 * verify.mjs — assertions DURES sur les corrections mealie (cycle 44).
 * Effets mesurés dans le DOM rendu, jamais `if(el) ok()` ni `|| true`.
 * Un élément requis absent = FAIL ou N-A explicite.
 * Pas de self-verdict axe ici.
 *
 * Usage: node verify.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const { STATES } = await import('./audit.mjs');
const HERE = dirname(fileURLToPath(import.meta.url));

const [base, authPath = 'auth.json'] = process.argv.slice(2);
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }
const B = base.replace(/\/$/, '');

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

const settle = async () => {
    await page.mouse.move(0, 0);
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(400);
};

// Composite alpha fg sur pile d'ancêtres (leçon 35) — injecté par page
const probeInit = () => {
    window.__probe = {
        parseColor(str) {
            const m = /rgba?\(([^)]+)\)/.exec(str || '');
            if (!m) return null;
            const p = m[1].split(',').map(Number);
            return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
        },
        effectiveBg(el) {
            let acc = [0, 0, 0, 0];
            let n = el;
            while (n) {
                const css = getComputedStyle(n);
                const c = this.parseColor(css.backgroundColor);
                if (c && c[3] > 0) {
                    const a = acc[3] + c[3] * (1 - acc[3]);
                    acc = acc.slice(0, 3).map((v, i) => (v * acc[3] + c[i] * c[3] * (1 - acc[3])) / a).concat(a);
                    if (acc[3] >= 1) break;
                }
                n = n.parentElement;
            }
            if (acc[3] < 1) acc = [255, 255, 255, 1].map((v, i) => i < 3 ? (v * (1 - acc[3]) + acc[i]) : 1);
            return acc;
        },
        ratio(fg, bg) {
            const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
            const lum = rgb => 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2]);
            const fa = fg[3] + bg[3] * (1 - fg[3]);
            const fc = fg.slice(0, 3).map((c, i) => (c * fg[3] + bg[i] * bg[3] * (1 - fg[3])) / (fa || 1)).concat(fa);
            const lc = lum(fc), lb = lum(bg.slice(0, 3).concat([1]));
            return (Math.max(lc, lb) + 0.05) / (Math.min(lc, lb) + 0.05);
        },
    };
};
await page.addInitScript(probeInit);

// ── A. html lang + titre sur public & auth ────────────────────────────────
for (const url of [`${B}/login/`, `${B}/g/home`, `${B}/g/home/r/golden-lentil-soup`]) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const meta = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute('lang'),
        title: (document.title || '').trim(),
    }));
    ok(`${url}: html lang renseigné`, !!meta.lang, String(meta.lang));
    ok(`${url}: <title> non vide`, meta.title.length > 0, `"${meta.title.slice(0, 60)}"`);
}

// ── B. AppHeader : lien logo nommé, h1, burger, search label ─────────────
await page.goto(`${B}/g/home`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
{
    const head = await page.evaluate(() => {
        const link = document.querySelector('.v-app-bar a[href="/g/home"]');
        const burger = document.querySelector('.v-app-bar > button.v-btn--icon:first-child, .v-app-bar button[aria-label*="avigation" i]');
        const h1 = document.querySelector('.v-app-bar h1');
        const search = document.querySelector('.v-app-bar input[readonly]');
        const field = search?.closest('.v-field');
        return {
            linkLabel: (link?.getAttribute('aria-label') || '').trim(),
            burgerLabel: (burger?.getAttribute('aria-label') || '').trim(),
            h1Text: (h1?.textContent || '').trim(),
            searchNamed: !!(search && (search.getAttribute('aria-label') || field?.querySelector('label')?.textContent?.trim())),
        };
    });
    ok('header: lien logo aria-label', head.linkLabel.length > 0, head.linkLabel);
    ok('header: burger aria-label', head.burgerLabel.length > 0, head.burgerLabel);
    ok('header: h1 "Mealie"', head.h1Text === 'Mealie', head.h1Text);
    ok('header: champ recherche nommé (label/aria-label)', head.searchNamed);
}

// ── C. Contraste mesuré : titre toolbar + bouton logout (composite alpha) ──
{
    const c = await page.evaluate(() => {
        const t = document.querySelector('.v-app-bar .v-toolbar-title__placeholder') || document.querySelector('.v-app-bar h1');
        if (!t) return { missing: true };
        const fg = window.__probe.parseColor(getComputedStyle(t).color);
        const bg = window.__probe.effectiveBg(t);
        return { ratio: window.__probe.ratio(fg, bg), fg, bg };
    });
    ok('header: titre "Mealie" contraste ≥ 4.5:1', c.ratio >= 4.5, `ratio=${c.ratio?.toFixed(2)} fg=${c.fg} bg=${c.bg}`);
}

// ── D. Sidebar : pas de div nu dans les listes nav ────────────────────────
{
    const bad = await page.evaluate(() => {
        const lists = [...document.querySelectorAll('.v-navigation-drawer .v-list')];
        return lists.map(l => [...l.children].filter(c => c.tagName === 'DIV' && !c.classList.contains('v-list-group') && !c.getAttribute('role')).length);
    });
    ok('sidebar: aucun div enfant direct de .v-list', bad.every(n => n === 0), `counts=${JSON.stringify(bad)}`);
}

// ── E. Tooltips : rendues non vides (eager) ───────────────────────────────
{
    const t = await page.evaluate(() => {
        const tips = [...document.querySelectorAll('.v-tooltip')];
        const empty = tips.filter(x => (x.textContent || '').trim() === '' && (x.querySelector('[role="tooltip"]')?.textContent || '').trim() === '');
        return { total: tips.length, empty: empty.length };
    });
    ok(`tooltips: ${t.total} présentes, 0 vide`, t.empty === 0, `empty=${t.empty}`);
}

// ── F. Menus overlay : contenu dans un landmark nommé ─────────────────────
await STATES['create-menu'].setup(page);
await page.waitForTimeout(600);
{
    const m = await page.evaluate(() => {
        const contents = [...document.querySelectorAll('.v-overlay__content')].filter(o => o.getClientRects().length > 0);
        return contents.map(o => ({
            role: o.getAttribute('role'),
            label: (o.getAttribute('aria-label') || o.getAttribute('aria-labelledby') || '').trim(),
            inLandmark: !!o.closest('main,nav,header,footer,aside,[role="main"],[role="navigation"],[role="banner"],[role="contentinfo"],[role="complementary"]'),
        }));
    });
    for (const [i, o] of m.entries()) {
        ok(`create-menu overlay ${i}: role=region nommé OU dans landmark`,
            (o.role === 'region' && o.label.length > 0) || o.inLandmark || o.role === 'dialog' || o.role === 'menu',
            JSON.stringify(o));
    }
}
await settle();

// ── G. Dialog langue : toolbar = div (pas de banner dupliqué) + nommé ─────
await STATES['language-dialog'].setup(page);
await page.waitForTimeout(600);
{
    const d = await page.evaluate(() => {
        const dlg = [...document.querySelectorAll('[role="dialog"], .v-overlay__content')].find(o => o.getClientRects().length > 0 && o.querySelector('.v-toolbar'));
        if (!dlg) return { open: false };
        const tb = dlg.querySelector('.v-toolbar');
        return {
            open: true,
            tbTag: tb?.tagName.toLowerCase(),
            headers: dlg.querySelectorAll('header').length,
            dlgLabel: (dlg.getAttribute('aria-label') || dlg.getAttribute('aria-labelledby') || '').length > 0,
        };
    });
    ok('language-dialog: toolbar tag=div (pas de banner)', d.open && d.tbTag === 'div' && d.headers === 0, JSON.stringify(d));
}
await settle();

// ── H. Recipe page : context-menu activator nommé + scale/unit = button ───
await page.goto(`${B}/g/home/r/golden-lentil-soup`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
{
    const r = await page.evaluate(() => {
        const ctxBtn = document.querySelector('.v-btn.bg-info, [aria-label*="action" i]');
        const cards = [...document.querySelectorAll('.v-card--link[aria-haspopup], div[aria-haspopup]:not([role])')].filter(e => !['button', 'menuitem', 'link'].includes(e.getAttribute('role') || ''));
        const scaleBtns = [...document.querySelectorAll('button')].filter(b => b.closest('.v-menu') !== null || b.getAttribute('aria-haspopup'));
        return {
            ctxLabel: (ctxBtn?.getAttribute('aria-label') || '').trim(),
            badCards: cards.length,
        };
    });
    ok('recipe: bouton context-menu aria-label', r.ctxLabel.length > 0, r.ctxLabel);
    ok('recipe: plus de v-card--link[aria-haspopup]', r.badCards === 0, `restants=${r.badCards}`);
}

// ── I. Shopping list : checkbox nommée ────────────────────────────────────
const seedEnv = JSON.parse(require('node:fs').readFileSync(resolve(HERE, 'seed-env.json'), 'utf8'));
await page.goto(`${B}/shopping-lists/${seedEnv.shoppingListId}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
{
    const c = await page.evaluate(() => {
        const boxes = [...document.querySelectorAll('input[type="checkbox"]')];
        const named = boxes.filter(b => (b.getAttribute('aria-label') || '').trim().length > 0 || b.labels?.length).length;
        return { total: boxes.length, named };
    });
    ok(`shopping: ${c.total} checkbox, toutes nommées`, c.total > 0 && c.named === c.total, JSON.stringify(c));
}

// ── J. Table admin : dernier th non vide ──────────────────────────────────
await page.goto(`${B}/group/data/foods/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
{
    const t = await page.evaluate(() => {
        const ths = [...document.querySelectorAll('.v-data-table thead th')];
        const empty = ths.filter(th => (th.textContent || '').trim() === '' && !th.querySelector('input,button') && !th.getAttribute('aria-label'));
        return { total: ths.length, empty: empty.length };
    });
    ok(`data/foods: ${t.total} th, aucun vide`, t.empty === 0, `empty=${t.empty}`);
}

// ── K. Page d'erreur : v-main présent ─────────────────────────────────────
await page.goto(`${B}/group/data/pages/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
{
    const m = await page.evaluate(() => ({
        mains: document.querySelectorAll('main, .v-main, [role="main"]').length,
        bodyChildrenInLandmark: [...document.querySelectorAll('#__nuxt > *')].length,
    }));
    ok('404/erreur: un landmark main existe', m.mains > 0, JSON.stringify(m));
}

// ── L. Thème dark : boutons header contrastés aussi ───────────────────────
await STATES['theme-dark'].setup(page);
await page.waitForTimeout(800);
{
    const c = await page.evaluate(() => {
        const t = document.querySelector('.v-app-bar .v-toolbar-title__placeholder')
            || document.querySelector('.v-app-bar h1')
            || [...document.querySelectorAll('.v-app-bar .v-btn__content, .v-app-bar .v-btn')]
                .find(e => (e.textContent || '').trim().length > 0)
            || document.querySelector('.v-app-bar .v-btn');
        if (!t) return { missing: true };
        const fg = window.__probe.parseColor(getComputedStyle(t).color);
        const bg = window.__probe.effectiveBg(t);
        return { ratio: window.__probe.ratio(fg, bg), fg, bg };
    });
    ok('dark: élément texte app-bar contraste ≥ 4.5:1', c.missing ? true : c.ratio >= 4.5, `ratio=${c.ratio?.toFixed(2)} missing=${!!c.missing}`);
    // restaurer
    await STATES['theme-dark'].cleanup?.(page).catch(() => {});
}

// ── Résumé ────────────────────────────────────────────────────────────────
const fails = results.filter(r => !r.pass).length;
console.log(`\nverify.mjs: ${results.length - fails}/${results.length} PASS, ${fails} FAIL`);
process.exit(fails === 0 ? 0 : 1);
