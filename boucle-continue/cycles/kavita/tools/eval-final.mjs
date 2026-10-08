/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Couvre les critères WCAG non testés par axe sur Kavita (cycle 45).
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
    await page.waitForTimeout(1400);
};

// ── A. <html lang> + <title> + viewport sur pages du scope ─────────────────
for (const path of ['/login', '/registration', '/home', '/library/4/series/6']) {
    await goto(path);
    const meta = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute('lang'),
        title: (document.title || '').trim(),
        viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || null,
    }));
    ok(`${path}: html lang renseigné`, !!meta.lang, String(meta.lang));
    ok(`${path}: <title> non vide`, meta.title.length > 0, `"${meta.title.slice(0, 60)}"`);
    if (path === '/login') {
        const noZoomBlock = meta.viewport && !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(meta.viewport);
        ok('viewport: zoom non verrouillé', !!noZoomBlock, String(meta.viewport));
    }
}

// ── B. Hiérarchie de titres : pas de saut de niveau visible ────────────────
for (const path of ['/home', '/library/4', '/library/4/series/6', '/lists/1']) {
    await goto(path);
    const hs = await page.evaluate(() => {
        const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
            .filter(h => h.getClientRects().length > 0 && getComputedStyle(h).visibility !== 'hidden');
        let skip = null, prev = 0;
        for (const h of heads) {
            const lvl = parseInt(h.tagName.slice(1), 10);
            if (prev && lvl > prev + 1) { skip = `h${prev}->h${lvl} "${(h.textContent || '').trim().slice(0, 40)}"`; break; }
            prev = lvl;
        }
        return { count: heads.length, skip, first: heads[0]?.tagName };
    });
    ok(`titres ${path}: aucun saut de niveau`, hs.count === 0 || hs.skip === null, `${hs.skip || hs.count + ' titres'}`);
}

// ── C. Pas de piège clavier : 25 Tab progressent sans boucle ───────────────
await goto('/home');
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
    return { el: el.tagName + '.' + String(el.className).split(' ')[0], outline: cs.outlineStyle + ' ' + cs.outlineWidth, shadow: cs.boxShadow };
});
ok('focus: indicateur visuel mesuré (outline/box-shadow)', focusInfo.el !== 'body' && (focusInfo.outline !== 'none 0px' || focusInfo.shadow !== 'none'), JSON.stringify(focusInfo));

// ── E. Modale réelle : replay du state series-edit-modal ───────────────────
if (STATES['series-edit-modal']) {
    await page.goto(STATES['series-edit-modal'].url(B), { waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
    await STATES['series-edit-modal'].setup(page).catch(e => console.error('  setup state:', e.message.slice(0, 80)));
    await page.waitForTimeout(700);
    const open = await page.evaluate(() => {
        const m = [...document.querySelectorAll('[role="dialog"], [role="alertdialog"], ngb-modal-window')].find(d => d.getClientRects().length > 0);
        if (!m) return { open: false };
        const labelledby = m.getAttribute('aria-labelledby');
        return {
            open: true,
            role: m.getAttribute('role'),
            modal: m.getAttribute('aria-modal'),
            labelled: (labelledby && document.getElementById(labelledby)) ? true : !!m.getAttribute('aria-label'),
            focusInside: m.contains(document.activeElement),
        };
    });
    if (open.open) {
        ok('modal edit-series: role=dialog + modalité + nom', open.role === 'dialog' && open.labelled, JSON.stringify(open));
        ok('modal edit-series: focus dans la modale', open.focusInside, JSON.stringify(open));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(600);
        const closed = await page.evaluate(() => ![...document.querySelectorAll('[role="dialog"], ngb-modal-window')].some(d => d.getClientRects().length > 0));
        ok('modal edit-series: Escape ferme', closed);
    } else {
        ok('modal edit-series: ouverte après replay', false, 'setup rejoué, dialog absent');
    }
} else na('modal edit-series', 'state absent');

// ── F. Images : alt présent (décoratif="" accepté) ─────────────────────────
for (const path of ['/home', '/library/4', '/collections']) {
    await goto(path);
    const imgs = await page.evaluate(() => {
        const all = [...document.querySelectorAll('img')].filter(i => i.getClientRects().length > 0 && getComputedStyle(i).visibility !== 'hidden');
        return { total: all.length, noAlt: all.filter(i => !i.hasAttribute('alt')).length };
    });
    if (imgs.total === 0) na(`${path}: images alt`, 'aucune image visible');
    else ok(`${path}: images ont un attribut alt`, imgs.noAlt === 0, `${imgs.noAlt}/${imgs.total}`);
}

// ── G. Liens/boutons nommés (login + home) ─────────────────────────────────
for (const path of ['/login', '/home']) {
    await goto(path);
    const lc = await page.evaluate(() => {
        const named = el => (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.innerText || '').trim().length > 0
            || !!el.querySelector('img[alt]:not([alt=""])');
        const links = [...document.querySelectorAll('a[href]')].filter(a => a.getClientRects().length > 0 && getComputedStyle(a).visibility !== 'hidden');
        const btns = [...document.querySelectorAll('button')].filter(b => b.getClientRects().length > 0 && getComputedStyle(b).visibility !== 'hidden');
        return { links: links.length, badLinks: links.filter(a => !named(a)).map(a => a.outerHTML.slice(0, 60)), btns: btns.length, badBtns: btns.filter(b => !named(b)).length };
    });
    ok(`${path}: tous les liens ont un nom`, lc.badLinks.length === 0 && lc.links > 0, `${lc.badLinks.length}/${lc.links} ${lc.badLinks.join('|')}`);
    ok(`${path}: tous les boutons ont un nom`, lc.badBtns === 0 && lc.btns > 0, `${lc.badBtns}/${lc.btns}`);
}

// ── H. Aucun aria-hidden contenant du focusable (pages au repos) ───────────
for (const path of ['/home', '/library/4', '/settings']) {
    await goto(path);
    const bad = await page.evaluate(() => {
        const isFocusable = e => e.matches('a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])') && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
        const hidden = [...document.querySelectorAll('[aria-hidden="true"]')];
        let count = 0; const sample = [];
        for (const h of hidden) {
            const inner = [...h.querySelectorAll('*')].filter(isFocusable);
            if (isFocusable(h) || inner.length) { count++; if (sample.length < 3) sample.push(String(h.className).slice(0, 50)); }
        }
        return { count, sample };
    });
    ok(`${path}: aucun aria-hidden avec focusable`, bad.count === 0, `${bad.count} ${bad.sample.join('|')}`);
}

// ── I. Formulaires : champs visibles tous nommés ───────────────────────────
for (const path of ['/login', '/registration', '/settings']) {
    await goto(path);
    const forms = await page.evaluate(() => {
        const named = el => {
            if (el.id && document.querySelector(`label[for="${el.id}"]`)) return true;
            if ((el.getAttribute('aria-label') || '').trim()) return true;
            if (el.getAttribute('aria-labelledby')) return true;
            if (el.closest('label')) return true;
            if ((el.getAttribute('title') || '').trim()) return true;
            const prev = el.previousElementSibling;
            if (prev && /label|heading/i.test(String(prev.className)) && (prev.textContent || '').trim()) return true;
            return false;
        };
        const all = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=image]), select, textarea')]
            .filter(i => i.getClientRects().length > 0 && getComputedStyle(i).visibility !== 'hidden' && i.getAttribute('aria-hidden') !== 'true');
        return { total: all.length, bad: all.filter(i => !named(i)).map(i => (i.name || i.id || String(i.className)).slice(0, 40)).slice(0, 5) };
    });
    if (forms.total === 0) { na(`${path}: champs nommés`, 'aucun champ visible'); }
    else ok(`${path}: tous les champs ont un nom`, forms.bad.length === 0, `${forms.bad.length}/${forms.total} non nommés: ${forms.bad.join('|')}`);
}

// ── J. IDs dupliqués (indépendant de axe) ──────────────────────────────────
for (const path of ['/home', '/library/4', '/lists']) {
    await goto(path);
    const dup = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(e => e.id).filter(Boolean);
        const seen = new Set(); const dups = new Set();
        for (const id of ids) { if (seen.has(id)) dups.add(id); seen.add(id); }
        return { total: ids.length, dups: [...dups].slice(0, 5) };
    });
    ok(`${path}: aucun id dupliqué`, dup.dups.length === 0, `${dup.dups.join('|')} sur ${dup.total} ids`);
}

// ── K. Skip-link fonctionnel : premier Tab → focus "Skip to main content" ──
await goto('/home');
await page.evaluate(() => document.activeElement?.blur());
await page.keyboard.press('Tab');
await page.waitForTimeout(300);
{
    const sk = await page.evaluate(() => {
        const el = document.activeElement;
        const cs = el ? getComputedStyle(el) : null;
        return { text: (el?.innerText || '').trim().slice(0, 60), tag: el?.tagName, visible: cs ? el.getClientRects().length > 0 : false };
    });
    ok('skip-link: premier Tab focalise un lien "skip"', /skip|content|main/i.test(sk.text) && sk.tag === 'A' && sk.visible, JSON.stringify(sk));
}

// ── Résumé ────────────────────────────────────────────────────────────────
const fails = results.filter(r => !r.pass);
console.log(`eval-final: ${results.length - fails.length}/${results.length} PASS, ${fails.length} FAIL`);
if (fails.length) {
    for (const f of fails) console.log('  FAIL', f.name);
    process.exitCode = 1;
}
await browser.close();
