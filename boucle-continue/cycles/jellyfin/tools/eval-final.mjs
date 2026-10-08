/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Couvre les critères WCAG non testés par axe sur jellyfin-web (cycle 41).
 * Si un contrôle échoue, c'est un finding légitime — pas un bug du harnais.
 *
 * Usage: node eval-final.mjs <baseUrl> [auth.json]
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
if (!base) { console.error('usage: node eval-final.mjs <baseUrl> [auth.json]'); process.exit(2); }
const B = base.replace(/\/$/, '');
const W = `${B}/web/index.html#`;

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

// ── A. <html lang> + <title> + viewport sur pages du scope ─────────────────
for (const url of ['/login', '/home', '/dashboard', '/movies?tab=0']) {
    await page.goto(`${B}/web/index.html#${url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const meta = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute('lang'),
        title: (document.title || '').trim(),
        viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || null,
    }));
    ok(`#${url}: html lang renseigné`, !!meta.lang, String(meta.lang));
    ok(`#${url}: <title> non vide`, meta.title.length > 0, `"${meta.title.slice(0, 60)}"`);
    if (url === '/login') {
        const noZoomBlock = meta.viewport && !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(meta.viewport);
        ok('viewport: zoom non verrouillé', !!noZoomBlock, String(meta.viewport));
    }
}

// ── B. Hiérarchie de titres : pas de saut de niveau visible ────────────────
for (const url of ['/home', '/dashboard', '/details?id=a7cc2a4fb6f159ad3b5acbf3d0a690df', '/dashboard/libraries']) {
    await page.goto(`${W}${url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const hs = await page.evaluate(() => {
        const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.getClientRects().length > 0 && getComputedStyle(h).visibility !== 'hidden' && h.closest('.page:not(.hide), .MuiBox-root, main, body'));
        let skip = null, prev = 0;
        for (const h of heads) {
            const lvl = parseInt(h.tagName.slice(1), 10);
            if (prev && lvl > prev + 1) { skip = prev + '->' + lvl + ' "' + (h.textContent || '').trim().slice(0, 40) + '"'; break; }
            prev = lvl;
        }
        return { count: heads.length, skip, first: heads[0]?.tagName };
    });
    ok(`titres #${url}: aucun saut de niveau`, hs.count === 0 || hs.skip === null, `${hs.skip || hs.count + ' titres'}`);
}

// ── C. Pas de piège clavier : 25 Tab progressent sans boucle ───────────────
await page.goto(`${W}/home`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.locator('body').click({ position: { x: 5, y: 5 } });
const trail = [];
for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(90);
    trail.push(await page.evaluate(() => document.activeElement ? (document.activeElement.id || document.activeElement.tagName + '.' + String(document.activeElement.className).split(' ')[0]) : 'none'));
}
const uniq = new Set(trail).size;
ok('clavier: le focus progresse (>=4 éléments distincts, pas de piège)', uniq >= 4, `${uniq} éléments: ${trail.slice(0, 10).join('>')}`);

// ── D. Indicateur de focus visible sur l'élément courant ───────────────────
const focusInfo = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { el: 'body' };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { el: el.tagName + '.' + String(el.className).split(' ')[0], outline: cs.outlineStyle + ' ' + cs.outlineWidth, shadow: cs.boxShadow, w: r.width, h: r.height };
});
ok('focus: indicateur visuel mesuré (outline/box-shadow)', focusInfo.el !== 'body' && (focusInfo.outline !== 'none 0px' || focusInfo.shadow !== 'none'), JSON.stringify(focusInfo));

// ── E. Modale réelle : replay du state dash-rename-dialog ─────────────────
await page.goto(STATES['dash-rename-dialog'].url(B), { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
if (STATES['dash-rename-dialog']) {
    await STATES['dash-rename-dialog'].setup(page).catch(e => console.error('  setup state:', e.message.slice(0, 80)));
    await page.waitForTimeout(600);
    const open = await page.evaluate(() => {
        const m = [...document.querySelectorAll('[role="dialog"], [role="alertdialog"]')].find(d => d.offsetParent);
        if (!m) return { open: false };
        const bgHidden = [...document.querySelectorAll('[aria-hidden="true"]')]
            .some(h => !h.contains(m) && h.querySelector('main, header, aside, nav, .page'));
        const labelledby = m.getAttribute('aria-labelledby');
        return {
            open: true,
            role: m.getAttribute('role'),
            modal: m.getAttribute('aria-modal'),
            bgHidden,
            labelled: (labelledby && document.getElementById(labelledby)) ? true : !!m.getAttribute('aria-label'),
            focusInside: m.contains(document.activeElement),
        };
    });
    if (open.open) {
        ok('modal rename: role=dialog + modalité (aria-modal ou fond caché) + nom',
            open.role === 'dialog' && (open.modal === 'true' || open.bgHidden) && open.labelled,
            JSON.stringify(open));
        ok('modal rename: focus dans la modale', open.focusInside, JSON.stringify(open));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(600);
        const closed = await page.evaluate(() => ![...document.querySelectorAll('[role="dialog"]')].some(d => d.offsetParent));
        ok('modal rename: Escape ferme', closed);
    } else {
        ok('modal rename: ouverte après replay', false, 'setup rejoué, dialog absent');
    }
} else na('modal rename', 'state absent');

// ── F. Images : alt présent (décoratif="" accepté) ─────────────────────────
for (const url of ['/home', '/movies?tab=0', '/details?id=4df79bd2d5bbae21080a0524a2702d5a']) {
    await page.goto(`${W}${url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const imgs = await page.evaluate(() => {
        const all = [...document.querySelectorAll('img')].filter(i => i.getClientRects().length > 0 && getComputedStyle(i).visibility !== 'hidden');
        return { total: all.length, noAlt: all.filter(i => !i.hasAttribute('alt')).length };
    });
    ok(`#${url}: images ont un attribut alt`, imgs.noAlt === 0 && imgs.total > 0, `${imgs.noAlt}/${imgs.total}`);
}

// ── G. Liens/boutons nommés (login + accueil) ──────────────────────────────
for (const [url, st] of [['/login', undefined], ['/home', 'auth']]) {
    await page.goto(`${W}${url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const lc = await page.evaluate(() => {
        const named = el => (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.innerText || '').trim().length > 0
            || !!el.querySelector('img[alt]:not([alt=""])');
        const links = [...document.querySelectorAll('a[href]')].filter(a => a.getClientRects().length > 0 && getComputedStyle(a).visibility !== 'hidden');
        const btns = [...document.querySelectorAll('button')].filter(b => b.getClientRects().length > 0 && getComputedStyle(b).visibility !== 'hidden');
        return { links: links.length, badLinks: links.filter(a => !named(a)).map(a => a.outerHTML.slice(0, 60)), btns: btns.length, badBtns: btns.filter(b => !named(b)).length };
    });
    ok(`#${url}: tous les liens ont un nom`, lc.badLinks.length === 0 && lc.links > 0, `${lc.badLinks.length}/${lc.links} ${lc.badLinks.join('|')}`);
    ok(`#${url}: tous les boutons ont un nom`, lc.badBtns === 0 && lc.btns > 0, `${lc.badBtns}/${lc.btns}`);
}

// ── H. Aucun aria-hidden contenant du focusable (pages au repos) ───────────
for (const url of ['/home', '/dashboard', '/movies?tab=0']) {
    await page.goto(`${W}${url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const bad = await page.evaluate(() => {
        const isFocusable = e => e.matches('a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])') && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
        const hidden = [...document.querySelectorAll('[aria-hidden="true"]')];
        let count = 0;
        const sample = [];
        for (const h of hidden) {
            const inner = [...h.querySelectorAll('*')].filter(isFocusable);
            if ((isFocusable(h) || inner.length)) {
                // ignore les patterns standard de focus-guard MUI
                if (h.hasAttribute('data-mui-focus-guard') || h.classList?.contains('Mui-focusTrap')) continue;
                count++; if (sample.length < 3) sample.push(String(h.className).slice(0, 50));
            }
        }
        return { count, sample };
    });
    ok(`#${url}: aucun aria-hidden avec focusable`, bad.count === 0, `${bad.count} ${bad.sample.join('|')}`);
}

// ── I. Formulaires : champs visibles tous nommés ───────────────────────────
for (const url of ['/login', '/dashboard/networking', '/mypreferencessubtitles']) {
    await page.goto(`${W}${url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const forms = await page.evaluate(() => {
        const named = el => {
            if (el.id && document.querySelector(`label[for="${el.id}"]`)) return true;
            if ((el.getAttribute('aria-label') || '').trim()) return true;
            if (el.getAttribute('aria-labelledby')) return true;
            if (el.closest('label')) return true;
            if ((el.getAttribute('title') || '').trim()) return true;
            // jellyfin legacy : <div class="inputLabel" for=...> voisins
            if (el.id && [...document.querySelectorAll('.inputLabel, .checkboxListLabel, legend')].some(l => (l.htmlFor === el.id || l.getAttribute('for') === el.id))) return true;
            const prev = el.previousElementSibling;
            if (prev && /label|heading/i.test(String(prev.className)) && (prev.textContent || '').trim()) return true;
            return false;
        };
        const all = [...document.querySelectorAll('.page:not(.hide) input:not([type=hidden]):not([type=submit]):not([type=image]), .page:not(.hide) select, .page:not(.hide) textarea, main input:not([type=hidden]), main select')]
            .filter(i => i.getClientRects().length > 0 && getComputedStyle(i).visibility !== 'hidden' && i.getAttribute('aria-hidden') !== 'true');
        return { total: all.length, bad: all.filter(i => !named(i)).map(i => (i.name || i.id || String(i.className)).slice(0, 40)).slice(0, 5) };
    });
    if (forms.total === 0) { na(`#${url}: champs nommés`, 'aucun champ visible'); }
    else ok(`#${url}: tous les champs ont un nom`, forms.bad.length === 0, `${forms.bad.length}/${forms.total} non nommés: ${forms.bad.join('|')}`);
}

// ── J. IDs dupliqués (indépendant de axe) ──────────────────────────────────
for (const url of ['/home', '/dashboard/libraries']) {
    await page.goto(`${W}${url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const dup = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(e => e.id).filter(Boolean);
        const seen = new Set(); const dups = new Set();
        for (const id of ids) { if (seen.has(id)) dups.add(id); seen.add(id); }
        return { total: ids.length, dups: [...dups].slice(0, 5) };
    });
    ok(`#${url}: aucun id dupliqué`, dup.dups.length === 0, `${dup.dups.join('|')} sur ${dup.total} ids`);
}

// ── K. Contraste bouton primary en thème clair (mesure réelle) ─────────────
// Le fix contrast a touché themes/light + metadataeditor — mesurer un bouton
// primary visible sur le dashboard en mode light via le state dédié.
await page.goto(`${W}/home`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
if (STATES['theme-light']) {
    await STATES['theme-light'].setup(page).catch(e => console.error('  theme-light setup:', e.message.slice(0, 80)));
    await page.waitForTimeout(1500);
    await page.goto(`${W}/dashboard/libraries`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const ratio = await page.evaluate(`
        (() => {
            const parse = (c) => {
                const m = (c||'').match(/rgba?\\(([^)]+)\\)/);
                if (!m) return null;
                const p = m[1].split(',').map(x => parseFloat(x.trim()));
                return { r: p[0], g: p[1], b: p[2], a: p.length>3?p[3]:1 };
            };
            const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
            const lum = o => 0.2126 * srgb(o.r) + 0.7152 * srgb(o.g) + 0.0722 * srgb(o.b);
            const mix = (fg, bg) => {
                const a = fg.a + bg.a * (1 - fg.a);
                if (a <= 0) return { r: 255, g: 255, b: 255, a: 0 };
                return { r: (fg.r*fg.a + bg.r*bg.a*(1-fg.a))/a, g: (fg.g*fg.a + bg.g*bg.a*(1-fg.a))/a, b: (fg.b*fg.a + bg.b*bg.a*(1-fg.a))/a, a };
            };
            const effBg = el => {
                let acc = { r: 0, g: 0, b: 0, a: 0 };
                let n = el;
                while (n && n !== document.documentElement) {
                    const c = parse(getComputedStyle(n).backgroundColor);
                    if (c && c.a > 0) { acc = mix(acc, c); if (acc.a >= 1) break; }
                    n = n.parentElement;
                }
                return acc.a >= 1 ? acc : mix(acc, { r: 255, g: 255, b: 255, a: 1 });
            };
            const btn = [...document.querySelectorAll('.MuiButton-contained, .MuiButton-containedPrimary, button.raised, .MuiButton-root')]
                .find(b => b.offsetParent && (b.innerText || '').trim());
            if (!btn) return { btn: false };
            const fg = parse(getComputedStyle(btn).color);
            const bg = effBg(btn);
            const r = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);
            return { btn: true, text: btn.innerText.trim().slice(0, 30), fg, bg, ratio: +r.toFixed(2) };
        })()
    `);
    if (!ratio.btn) { na('contraste primary (light)', 'aucun bouton trouvé'); }
    else ok('contraste bouton (light): ratio >= 3.0 (large text/UI)', ratio.ratio >= 3.0, JSON.stringify(ratio));
    // restore theme dark — obligation du manifest (mutant)
    if (STATES['mobile-nav-390']) {
        await page.goto(`${W}/home`, { waitUntil: 'networkidle' }).catch(() => {});
        await page.waitForTimeout(800);
        await STATES['theme-light'].setup(page).catch(() => {});
        await page.evaluate(() => localStorage.clear()).catch(() => {});
        // setJellyfinTheme dark via reset-theme tool (hors scope ici) —
        // le manifest impose reset-theme.mjs avant chaque run authentifié.
    }
} else na('contraste primary (light)', 'state absent');

// ── Résumé ────────────────────────────────────────────────────────────────
const fails = results.filter(r => !r.pass);
console.log(`eval-final: ${results.length - fails.length}/${results.length} PASS, ${fails.length} FAIL`);
if (fails.length) {
    for (const f of fails) console.log('  FAIL', f.name);
    process.exitCode = 1;
}
await browser.close();
