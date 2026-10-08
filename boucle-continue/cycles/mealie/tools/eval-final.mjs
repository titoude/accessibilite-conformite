/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Critères WCAG non couverts par axe sur mealie (cycle 44) : html lang, title,
 * viewport, hiérarchie de titres, focus clavier (ordre + trap dialog +
 * indicateur visible), reflow 320px, cibles tactiles, thème auto/système.
 * Un échec = finding légitime, pas un bug du harnais.
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

const browser = await chromium.launch();
const storageState = existsSync(authPath) ? authPath : existsSync(resolve(HERE, authPath)) ? resolve(HERE, authPath) : undefined;
const ctx = await browser.newContext({ storageState, locale: 'en-US' });
const page = await ctx.newPage();

const settle = async () => {
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(350);
};

// ── A. Document : lang, title, viewport ───────────────────────────────────
for (const url of [`${B}/login/`, `${B}/g/home`, `${B}/g/home/r/golden-lentil-soup`, `${B}/admin/site-settings/`]) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const meta = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute('lang'),
        title: (document.title || '').trim(),
        viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
    }));
    ok(`${url}: html[lang]`, !!meta.lang, meta.lang || '(absent)');
    ok(`${url}: title`, meta.title.length > 0, meta.title.slice(0, 50));
    if (meta.viewport) {
        ok(`${url}: zoom non bloqué`, !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(meta.viewport), meta.viewport);
    }
}

// ── B. Hiérarchie de titres : aucun saut de niveau ────────────────────────
for (const url of [`${B}/g/home`, `${B}/g/home/r/golden-lentil-soup`, `${B}/group/data/foods/`]) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1300);
    const hs = await page.evaluate(() =>
        [...document.querySelectorAll('main h1,main h2,main h3,main h4,main h5,main h6,[role="main"] h1,[role="main"] h2,[role="main"] h3')]
            .filter(h => (h.textContent || '').trim().length > 0 && h.getClientRects().length > 0)
            .map(h => +h.tagName[1])
    );
    let skip = false;
    for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) skip = true;
    ok(`${url}: hiérarchie sans saut`, !skip, JSON.stringify(hs.slice(0, 12)));
}

// ── C. Focus clavier : ordre atteint header + menu créé ───────────────────
await page.goto(`${B}/g/home`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1300);
{
    // Tab répété : doit passer par logo/search/burger/create sans se perdre
    const seq = [];
    for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
        const a = await page.evaluate(() => {
            const e = document.activeElement;
            return e ? `${e.tagName}.${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 30)}` : 'body';
        });
        seq.push(a);
        if (seq.length >= 4 && seq.slice(-3).every(x => x === seq[seq.length - 1])) break; // plus rien de nouveau
    }
    const reached = seq.filter(s => /navigation|Mealie|search|Créer|Create/i.test(s)).length;
    ok(`clavier: ≥2 repères atteignables par Tab (${seq.length} tabs)`, reached >= 2, JSON.stringify(seq.slice(0, 10)));
}

// Indicateur de focus visible sur un élément interactif
{
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    const vis = await page.evaluate(() => {
        const e = document.activeElement;
        if (!e || e === document.body) return { skip: true };
        const s = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        // indicateur = outline non-none, box-shadow, ou changement de fond/bordure
        return {
            skip: false,
            outline: s.outlineStyle !== 'none' && s.outlineWidth !== '0px',
            shadow: s.boxShadow !== 'none',
            rect: r.width > 0,
        };
    });
    if (!vis.skip) ok('focus: indicateur visible sur 1er tabbable', vis.outline || vis.shadow, JSON.stringify(vis));
}

// ── D. Dialog : focus confiné pendant ouverture ───────────────────────────
await STATES['language-dialog'].setup(page);
await page.waitForTimeout(700);
{
    const first = await page.evaluate(() => {
        const dlg = [...document.querySelectorAll('[role="dialog"],.v-overlay__content')].find(o => o.getClientRects().length > 0);
        return dlg ? dlg.contains(document.activeElement) : null;
    });
    for (let i = 0; i < 15; i++) await page.keyboard.press('Tab');
    const trapped = await page.evaluate(() => {
        const dlg = [...document.querySelectorAll('[role="dialog"],.v-overlay__content')].find(o => o.getClientRects().length > 0);
        return dlg ? dlg.contains(document.activeElement) : null;
    });
    ok('dialog langue: focus piégé dans le dialog', trapped === true, `trapped=${trapped} firstIn=${first}`);
}
await settle();

// ── E. Reflow 320px : pas de scroll horizontal de page ────────────────────
{
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(`${B}/g/home`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
    }));
    ok('reflow 320px: scrollWidth ≈ clientWidth', r.sw <= r.cw + 10, JSON.stringify(r));
    await page.setViewportSize({ width: 1280, height: 800 });
}

// ── F. Cibles ≥24px ou espacées (WCAG 2.5.8) ──────────────────────────────
{
    const sizes = await page.evaluate(() => {
        const els = [...document.querySelectorAll('.v-app-bar button, .v-app-bar a')];
        return els.map(e => { const r = e.getBoundingClientRect(); return Math.min(r.width, r.height); });
    });
    const small = sizes.filter(s => s > 0 && s < 24).length;
    ok(`header: ${sizes.length} cibles, 0 sous 24px`, small === 0, `small=${small} sizes=${JSON.stringify(sizes.slice(0, 8))}`);
}

// ── G. Thème : auto → light par défaut, dark si système ───────────────────
{
    const dark = await page.evaluate(() => ({
        cls: document.documentElement.classList.contains('dark'),
        stored: localStorage.getItem('vueuse-color-scheme'),
    }));
    ok('thème: par défaut non-dark (auto/light)', dark.cls === false, JSON.stringify(dark));
    await STATES['theme-dark'].setup(page);
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => ({
        cls: document.documentElement.classList.contains('dark'),
        appDark: !!document.querySelector('.v-theme--dark'),
    }));
    ok('thème: dark applique .dark + .v-theme--dark', after.cls && after.appDark, JSON.stringify(after));
    await STATES['theme-dark'].cleanup?.(page).catch(() => {});
    await page.evaluate(() => localStorage.setItem('vueuse-color-scheme', 'auto'));
}

// ── H. Recette publique : page complète sans login ─────────────────────────
const seedEnv = JSON.parse(require('node:fs').readFileSync(resolve(HERE, 'seed-env.json'), 'utf8'));
{
    const pubCtx = await browser.newContext({ locale: 'en-US' });
    const pub = await pubCtx.newPage();
    await pub.goto(`${B}/g/home/shared/r/${seedEnv.shareToken}`, { waitUntil: 'networkidle' });
    await pub.waitForTimeout(1500);
    const m = await pub.evaluate(() => ({
        title: document.title.trim(),
        h1: document.querySelectorAll('h1').length,
        recipeName: (document.querySelector('h1,h2')?.textContent || '').trim(),
        landmarks: document.querySelectorAll('main,[role="main"],header,[role="banner"]').length,
    }));
    ok('partage: titre non vide', m.title.length > 0, m.title.slice(0, 50));
    ok('partage: h1 présent', m.h1 >= 1, `h1=${m.h1}`);
    ok('partage: landmarks présents', m.landmarks >= 1, `landmarks=${m.landmarks}`);
    await pubCtx.close();
}

const fails = results.filter(r => !r.pass).length;
console.log(`\neval-final.mjs: ${results.length - fails}/${results.length} PASS, ${fails} FAIL`);
process.exit(fails === 0 ? 0 : 1);
