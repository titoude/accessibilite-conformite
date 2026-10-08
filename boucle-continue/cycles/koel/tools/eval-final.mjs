/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Critères WCAG que axe ne mesure pas, sur koel (cycle 49).
 *
 * Usage: node eval-final.mjs <baseUrl> [auth.json]
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
if (!base) { console.error('usage: node eval-final.mjs <baseUrl> [auth.json]'); process.exit(2); }
const B = base.replace(/\/$/, '');

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
    await page.waitForTimeout(1800);
};

// ── A. html lang + title + viewport (login public + page auth) ─────────────
for (const path of ['/#/home', '/#/songs']) {
    await goto(path);
    const meta = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute('lang'),
        title: (document.title || '').trim(),
        viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || null,
    }));
    ok(`${path}: html lang renseigné`, !!meta.lang, String(meta.lang));
    ok(`${path}: <title> non vide`, meta.title.length > 0, `"${meta.title.slice(0, 60)}"`);
    if (path === '/#/home') {
        const okZoom = meta.viewport && !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(meta.viewport);
        ok('viewport: zoom non verrouillé', !!okZoom, String(meta.viewport));
    }
}

// ── B. Hiérarchie de titres sans saut ──────────────────────────────────────
for (const path of ['/#/home', '/#/songs', IDS.albumPath, '/#/settings', '/#/visualizer']) {
    await goto(path);
    const hs = await page.evaluate(() => {
        const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.getClientRects().length > 0 && getComputedStyle(h).visibility !== 'hidden');
        let skip = null, prev = 0;
        for (const h of heads) {
            const lvl = parseInt(h.tagName.slice(1), 10);
            if (prev && lvl > prev + 1) { skip = `h${prev}->h${lvl} "${(h.textContent || '').trim().slice(0, 40)}"`; break; }
            prev = lvl;
        }
        return { count: heads.length, skip };
    });
    ok(`titres ${path}: aucun saut`, hs.count === 0 || hs.skip === null, `${hs.skip || hs.count + ' titres'}`);
}

// ── C. Pas de piège clavier (Tab progresse) ────────────────────────────────
await goto('/#/home');
await page.locator('body').click({ position: { x: 5, y: 5 } });
const trail = [];
for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(80);
    trail.push(await page.evaluate(() => document.activeElement ? (document.activeElement.getAttribute('data-testid') || document.activeElement.getAttribute('title') || document.activeElement.tagName) : 'none'));
}
const uniq = new Set(trail).size;
ok('clavier: le focus progresse (>=4 distincts, pas de piège)', uniq >= 4, `${uniq}: ${trail.slice(0, 8).join('>')}`);

// ── D. Indicateur de focus visible ─────────────────────────────────────────
const focusInfo = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { el: 'body' };
    const cs = getComputedStyle(el);
    return { el: el.tagName, outline: cs.outlineStyle + ' ' + cs.outlineWidth, shadow: cs.boxShadow };
});
ok('focus: indicateur visuel mesuré', focusInfo.el !== 'body' && (focusInfo.outline !== 'none 0px' || focusInfo.shadow !== 'none'), JSON.stringify(focusInfo));

// ── E. Modal <dialog> natif : focus + Escape ───────────────────────────────
await goto('/#/songs');
await STATES['edit-song-modal'].setup(page).catch(e => console.error('  setup:', e.message.slice(0, 70)));
await page.waitForTimeout(600);
{
    const m = await page.evaluate(() => {
        const d = document.querySelector('dialog[open]');
        return d ? { open: true, focusInside: d.contains(document.activeElement) } : { open: false };
    });
    if (m.open) {
        ok('modal edit-song: ouverte', true);
        ok('modal edit-song: focus à l\'intérieur', m.focusInside);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        const closed = await page.evaluate(() => !document.querySelector('dialog[open]'));
        ok('modal edit-song: Escape ferme', closed);
    } else ok('modal edit-song: ouverte après replay', false, 'dialog absent');
}

// ── F. Images : alt présent ────────────────────────────────────────────────
for (const path of ['/#/home', '/#/albums', IDS.albumPath]) {
    await goto(path);
    const imgs = await page.evaluate(() => {
        const all = [...document.querySelectorAll('img')].filter(i => i.getClientRects().length > 0 && getComputedStyle(i).visibility !== 'hidden');
        return { total: all.length, noAlt: all.filter(i => !i.hasAttribute('alt')).length };
    });
    if (imgs.total === 0) na(`${path}: images alt`, 'aucune image visible');
    else ok(`${path}: images ont alt`, imgs.noAlt === 0, `${imgs.noAlt}/${imgs.total}`);
}

// ── G. aria-hidden sans focusable ──────────────────────────────────────────
for (const path of ['/#/home', '/#/songs']) {
    await goto(path);
    const bad = await page.evaluate(() => {
        const isF = e => e.matches('a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])') && e.getClientRects().length > 0;
        let count = 0;
        for (const h of document.querySelectorAll('[aria-hidden="true"]')) {
            if (isF(h) || [...h.querySelectorAll('*')].some(isF)) count++;
        }
        return count;
    });
    ok(`${path}: aucun aria-hidden focusable`, bad === 0, `${bad}`);
}

// ── H. Champs visibles nommés (settings + profile) ─────────────────────────
for (const path of ['/#/settings', '/#/profile']) {
    await goto(path);
    const forms = await page.evaluate(() => {
        const named = el => {
            if (el.id && document.querySelector(`label[for="${el.id}"]`)) return true;
            if ((el.getAttribute('aria-label') || '').trim()) return true;
            if (el.getAttribute('aria-labelledby')) return true;
            if (el.closest('label')) return true;
            if ((el.getAttribute('title') || '').trim()) return true;
            return false;
        };
        const all = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=image]), select, textarea')]
            .filter(i => i.getClientRects().length > 0 && getComputedStyle(i).visibility !== 'hidden' && i.getAttribute('aria-hidden') !== 'true');
        return { total: all.length, bad: all.filter(i => !named(i)).map(i => (i.name || i.id || String(i.className)).slice(0, 40)).slice(0, 6) };
    });
    if (forms.total === 0) na(`${path}: champs nommés`, 'aucun champ visible');
    else ok(`${path}: champs nommés`, forms.bad.length === 0, `${forms.bad.length}/${forms.total} ${forms.bad.join('|')}`);
}

// ── I. Tooltips : aria-hidden et noms conservés ────────────────────────────
await goto('/#/home');
{
    const t = await page.evaluate(() => {
        const tips = [...document.querySelectorAll('.tooltip')];
        const unhid = tips.filter(x => x.getAttribute('aria-hidden') !== 'true');
        const titled = [...document.querySelectorAll('[data-title]')].length;
        return { tips: tips.length, unhid: unhid.length, titled };
    });
    ok('tooltips: aucun .tooltip exposé aux AT', t.unhid === 0, `${t.unhid}/${t.tips}`);
    ok('tooltips: titre déplacé en data-title (directive active)', t.titled > 5, `${t.titled}`);
}

// ── Résumé ────────────────────────────────────────────────────────────────
const fails = results.filter(r => !r.pass);
console.log(`eval-final: ${results.length - fails.length}/${results.length} PASS, ${fails.length} FAIL`);
if (fails.length) { for (const f of fails) console.log('  FAIL', f.name); process.exitCode = 1; }
await browser.close();
