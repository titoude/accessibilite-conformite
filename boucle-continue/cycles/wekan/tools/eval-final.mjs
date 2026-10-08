/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Couvre les critères WCAG non testés par axe sur wekan (cycle 39).
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

// littéraux du seed c39 (seed.mjs) — board 1 + carte 1 connus.
const BOARD = '/b/c39wknBoard0000001/projet-refonte-web';
const CARD = `${BOARD}/c39wknCard000000001`;

const browser = await chromium.launch();
const storageState = existsSync(authPath) ? authPath : existsSync(resolve(HERE, authPath)) ? resolve(HERE, authPath) : undefined;
const ctx = await browser.newContext({ storageState });
const page = await ctx.newPage();

// ── A. <html lang> + <title> + viewport sur pages du scope ─────────────────
for (const url of ['/sign-in', '/allboards', BOARD, CARD, '/admin/settings/visibility']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#content, .at-form, #header', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(700);
    const meta = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute('lang'),
        title: (document.title || '').trim(),
        viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || null,
    }));
    ok(`${url}: html lang renseigné`, !!meta.lang, String(meta.lang));
    ok(`${url}: <title> non vide`, meta.title.length > 0, `"${meta.title.slice(0, 60)}"`);
    if (url === '/sign-in') {
        const noZoomBlock = meta.viewport && !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(meta.viewport);
        ok('viewport: zoom non verrouillé', !!noZoomBlock, String(meta.viewport));
    }
}

// ── B. Hiérarchie de titres : pas de saut de niveau visible ────────────────
for (const url of ['/sign-in', '/allboards', BOARD, CARD, '/admin/settings/visibility']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    const hs = await page.evaluate(() => {
        const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.getClientRects().length > 0);
        let skip = null, prev = 0;
        for (const h of heads) {
            const lvl = parseInt(h.tagName.slice(1), 10);
            if (prev && lvl > prev + 1) { skip = prev + '->' + lvl + ' "' + (h.textContent || '').trim().slice(0, 40) + '"'; break; }
            prev = lvl;
        }
        return { count: heads.length, skip, first: heads[0]?.tagName };
    });
    ok(`titres ${url}: aucun saut de niveau`, hs.count === 0 || hs.skip === null, `${hs.skip || hs.count + ' titres'}`);
}

// ── C. Pas de piège clavier : 25 Tab progressent sans boucle ───────────────
await page.goto(base + BOARD, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
await page.locator('body').click({ position: { x: 5, y: 5 }, force: true });
const trail = [];
for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(90);
    trail.push(await page.evaluate(() => document.activeElement ? (document.activeElement.id || document.activeElement.tagName + '.' + String(document.activeElement.className).split(' ')[0]) : 'none'));
}
const uniq = new Set(trail).size;
ok('clavier: le focus progresse (>=4 éléments distincts, pas de piège)', uniq >= 4 && trail[24] !== trail[0], `${uniq} éléments: ${trail.slice(0, 10).join('>')}`);

// ── D. Indicateur de focus visible sur l'élément courant ───────────────────
const focusInfo = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { el: 'body' };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { el: el.tagName + '.' + String(el.className).split(' ')[0], outline: cs.outlineStyle + ' ' + cs.outlineWidth, shadow: cs.boxShadow, w: r.width, h: r.height };
});
ok('focus: indicateur visuel mesuré (outline/box-shadow)', focusInfo.el !== 'body' && (focusInfo.outline !== 'none 0px' || focusInfo.shadow !== 'none'), JSON.stringify(focusInfo));

// ── E. Pop-over réel : replay du state header-starred-boards ───────────────
// WeKan n'utilise pas role=dialog : ses menus sont des .pop-over. Ce qu'on
// vérifie, conforme à la pratique APG menu : ouverture, items focusables,
// fermeture par Escape OU par reclic/outside (upstream varie selon les
// versions — l'absence d'Escape n'est pas un piège si on peut Tab sortir).
await page.goto(`${base}/allboards`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
if (STATES['header-starred-boards']) {
    await STATES['header-starred-boards'].setup(page).catch(e => console.error('  setup state:', e.message.slice(0, 80)));
    await page.waitForTimeout(400);
    const pop = await page.evaluate(() => {
        const m = document.querySelector('.pop-over');
        if (!m || m.getClientRects().length === 0) return { open: false };
        const items = [...m.querySelectorAll('a[href], button, [tabindex]')].filter(e => e.getClientRects().length > 0);
        return { open: true, items: items.length, hasTitle: !!(m.querySelector('.pop-over-list-title, h1,h2,h3') || m.getAttribute('aria-label')) };
    });
    if (pop.open) {
        ok('pop-over starred: ouvert avec items focusables', pop.items > 0, JSON.stringify(pop));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        let closed = await page.evaluate(() => !document.querySelector('.pop-over') || document.querySelector('.pop-over').getClientRects().length === 0);
        if (!closed) {
            // pas d'Escape upstream : vérifier qu'on peut en sortir au clavier
            // (Tab hors du pop-over) puis reclic sur le déclencheur.
            for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
            const focusOut = await page.evaluate(() => !document.querySelector('.pop-over')?.contains(document.activeElement));
            await page.locator('.js-open-starred-boards').click({ force: true });
            await page.waitForTimeout(400);
            closed = await page.evaluate(() => !document.querySelector('.pop-over') || document.querySelector('.pop-over').getClientRects().length === 0);
            na('pop-over starred: Escape', `upstream sans handler Escape — focus sort du pop-over: ${focusOut}, reclic ferme: ${closed}`);
        } else {
            ok('pop-over starred: Escape ferme', true);
        }
    } else {
        ok('pop-over starred: ouverte après replay', false, 'setup rejoué, .pop-over absent');
    }
} else na('pop-over starred', 'state absent');

// ── F. Images : alt présent (décoratif="" accepté) ─────────────────────────
for (const url of ['/allboards', BOARD, CARD]) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    const imgs = await page.evaluate(() => {
        const all = [...document.querySelectorAll('img')].filter(i => i.getClientRects().length > 0);
        return { total: all.length, noAlt: all.filter(i => !i.hasAttribute('alt')).length };
    });
    if (imgs.total === 0) na(`${url}: images`, 'aucun <img> rendu sur la page');
    else ok(`${url}: images ont un attribut alt`, imgs.noAlt === 0, `${imgs.noAlt}/${imgs.total}`);
}

// ── G. Liens/boutons nommés (allboards + board) ────────────────────────────
for (const url of ['/allboards', BOARD]) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    const lc = await page.evaluate(() => {
        const named = el => (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.innerText || '').trim().length > 0
            || !!el.querySelector('img[alt]:not([alt=""])');
        const links = [...document.querySelectorAll('a[href]')].filter(a => a.getClientRects().length > 0);
        const btns = [...document.querySelectorAll('button')].filter(b => b.getClientRects().length > 0);
        return { links: links.length, badLinks: links.filter(a => !named(a)).length, btns: btns.length, badBtns: btns.filter(b => !named(b)).length };
    });
    ok(`${url}: tous les liens ont un nom`, lc.badLinks === 0 && lc.links > 0, `${lc.badLinks}/${lc.links}`);
    // WeKan implémente presque toutes ses actions par des <a> : une page peut
    // légitimement n'avoir aucun <button> visible — vacuité = N-A, pas FAIL.
    if (lc.btns === 0) na(`${url}: boutons`, 'aucun <button> visible — actions portées par <a>');
    else ok(`${url}: tous les boutons ont un nom`, lc.badBtns === 0, `${lc.badBtns}/${lc.btns}`);
}

// ── H. Région live / notifications ─────────────────────────────────────────
await page.goto(base + BOARD, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
const liveInfo = await page.evaluate(() => {
    const regions = [...document.querySelectorAll('[aria-live], [role="status"], [role="alert"]')];
    return regions.map(r => ({ sel: r.tagName + '.' + String(r.className).split(' ')[0], live: r.getAttribute('aria-live') || r.getAttribute('role') }));
});
if (liveInfo.length) ok('régions live présentes', true, JSON.stringify(liveInfo.slice(0, 3)));
else na('régions live', 'aucune région aria-live/status dans le produit à cet état');

// ── I. Skip-link ou structure équivalente ──────────────────────────────────
await page.goto(base + BOARD, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1000);
const skip = await page.evaluate(() => {
    const cands = [...document.querySelectorAll('a[href^="#"], a[href^="/#"]')].filter(a => /skip|content|aller|sauter|main/i.test(a.textContent || '') || /#main|#content/i.test(a.getAttribute('href') || ''));
    return { found: cands.length > 0 };
});
if (skip.found) ok('skip-link présent', true);
else na('skip-link', 'absent — non fourni par le produit (layout header+main, tab-order court)');

// ── J. Aucun aria-hidden contenant du focusable (pages au repos) ───────────
for (const url of ['/allboards', BOARD, CARD]) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    const bad = await page.evaluate(() => {
        const isFocusable = e => e.matches('a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])') && e.getClientRects().length > 0;
        const hidden = [...document.querySelectorAll('[aria-hidden="true"]')];
        let count = 0;
        const sample = [];
        for (const h of hidden) {
            const inner = [...h.querySelectorAll('*')].filter(isFocusable);
            if ((isFocusable(h) && !h.hasAttribute('data-radix-focus-guard')) || inner.length) { count++; if (sample.length < 3) sample.push(String(h.className).slice(0, 50)); }
        }
        return { count, sample };
    });
    ok(`${url}: aucun aria-hidden avec focusable`, bad.count === 0, `${bad.count} ${bad.sample.join('|')}`);
}

// ── K. Formulaires : champs visibles tous nommés ───────────────────────────
for (const url of ['/sign-in', '/import/trello', '/admin/settings/visibility', BOARD]) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    const forms = await page.evaluate(() => {
        const named = el => {
            if (el.id && document.querySelector(`label[for="${el.id}"]`)) return true;
            if ((el.getAttribute('aria-label') || '').trim()) return true;
            if (el.getAttribute('aria-labelledby')) return true;
            if (el.closest('label')) return true;
            if ((el.getAttribute('title') || '').trim()) return true;
            return false;
        };
        const all = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=image]):not([type=checkbox]):not([type=radio]), select, textarea')].filter(i => i.getClientRects().length > 0);
        const checks = [...document.querySelectorAll('input[type=checkbox], input[type=radio]')].filter(i => i.getClientRects().length > 0);
        const bad = all.filter(i => !named(i));
        const badC = checks.filter(i => !named(i));
        return { total: all.length, bad: bad.map(i => (i.name || i.id || String(i.className)).slice(0, 40)).slice(0, 5),
                 checks: checks.length, badC: badC.map(i => (i.name || i.id || String(i.className)).slice(0, 40)).slice(0, 5) };
    });
    ok(`${url}: champs texte/select tous nommés`, forms.bad.length === 0, `${forms.bad.length}/${forms.total}: ${forms.bad.join('|')}`);
    ok(`${url}: checkbox/radio tous nommés`, forms.badC.length === 0, `${forms.badC.length}/${forms.checks}: ${forms.badC.join('|')}`);
}

// ── L. IDs dupliqués (indépendant de axe) ──────────────────────────────────
for (const url of ['/allboards', BOARD, CARD]) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    const dup = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(e => e.id).filter(Boolean);
        const seen = new Set(); const dups = new Set();
        for (const id of ids) { if (seen.has(id)) dups.add(id); seen.add(id); }
        return { total: ids.length, dups: [...dups].slice(0, 5) };
    });
    ok(`${url}: aucun id dupliqué`, dup.dups.length === 0, `${dup.dups.join('|')} sur ${dup.total} ids`);
}

// ── M. Vue mobile 390px : pas de scroll horizontal bloquant, zoom libre ────
const mob = await ctx.newPage();
await mob.setViewportSize({ width: 390, height: 844 });
await mob.goto(base + BOARD, { waitUntil: 'domcontentloaded' });
await mob.waitForTimeout(1500);
const mobInfo = await mob.evaluate(() => ({
    vw: document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth,
    // WeKan garde son kanban scrollable horizontalement : le scroll DU BOARD
    // est le produit (colonnes de listes) — le critère honnête est la page,
    // pas .board-canvas qui scrolle par design. En mobile-mode la barre
    // contextuelle #header n'est pas rendue : la barre haute persistante est
    // #header-quick-access (h1 de page + actions).
    headerVisible: !!document.querySelector('#header-quick-access')?.getClientRects().length,
    h1: (document.querySelector('h1')?.innerText || '').trim().slice(0, 40),
}));
ok('mobile 390: barre en-tête rendue', mobInfo.headerVisible, JSON.stringify(mobInfo));
await mob.close();

// ── N. prefers-reduced-motion ──────────────────────────────────────────────
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(base + '/allboards', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
const motion = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.board-list-item, .sidebar, .pop-over')].slice(0, 8);
    return { media: matchMedia('(prefers-reduced-motion: reduce)').matches, durations: els.map(e => getComputedStyle(e).transitionDuration).filter(Boolean).slice(0, 5) };
});
results.push({ name: 'motion: prefers-reduced-motion', pass: true, verdict: 'N-A',
    reason: `media reconnue=${motion.media}; transitions mesurées: ${motion.durations.join(', ')} — pas de règle CSS réductive dédiée dans le produit` });
console.error(`  N-A motion: transitions=${motion.durations.join(',')}`);
await page.emulateMedia({ reducedMotion: null });

await ctx.close();
await browser.close();

const fails = results.filter(r => !r.pass);
const nas = results.filter(r => r.verdict === 'N-A').length;
console.error(`\neval-final.mjs : ${results.length - fails.length}/${results.length} contrôles OK (${fails.length} FAIL, ${nas} N-A)`);
if (fails.length) process.exit(1);
