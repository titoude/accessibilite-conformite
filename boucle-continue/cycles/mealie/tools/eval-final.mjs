/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Critères WCAG non couverts par axe sur mealie (cycle 44, fixer v2) : html lang,
 * title, viewport, hiérarchie de titres, focus clavier (ordre + trap dialog +
 * indicateur visible), reflow 320px, cibles tactiles, thème auto/système.
 * Chaque check a un ID STABLE + une DESCRIPTION : un FAIL dit QUOI a cassé.
 * Pas de session auth → S0 FAIL + sections authentifiées N-A (jamais anonyme
 * silencieux) ; les checks publics (login, page partagée) restent exécutés.
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
const ok = (id, desc, cond, extra = '') => {
    results.push({ id, name: desc, pass: !!cond });
    if (!cond) console.error(`  FAIL [${id}] ${desc} ${extra}`);
    return cond;
};
const na = (id, desc, reason = '') => {
    results.push({ id, name: desc, pass: true, verdict: 'N-A', reason });
    console.error(`  N-A [${id}] ${desc} ${reason}`);
    return true;
};

// ── S0. Précondition : session authentifiée disponible ────────────────────
const storageState = existsSync(authPath) ? authPath
    : existsSync(resolve(HERE, authPath)) ? resolve(HERE, authPath) : undefined;
let sessionDead = !ok('S0', 'session auth disponible (auth.json chargé comme storageState)',
    !!storageState, storageState || 'fichier absent — régénérer via tools/login.mjs');

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState, locale: 'en-US' });
const page = await ctx.newPage();

const settle = async () => {
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(350);
};

/** Navigation authentifiée : détecte la redirection SPA vers /login. */
const gotoAuth = async (url, id, desc) => {
    if (sessionDead) { na(id, desc, 'session absente — saut de la navigation'); return false; }
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    if (new URL(page.url()).pathname.startsWith('/login')) {
        sessionDead = true;
        na(id, desc, `redirection vers ${page.url()} — auth.json absent/expiré`);
        return false;
    }
    return true;
};

const metaOf = () => page.evaluate(() => ({
    lang: document.documentElement.getAttribute('lang'),
    title: (document.title || '').trim(),
    viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
}));
const metaChecks = (id, label, meta) => {
    ok(`${id}-lang`, `${label} : html[lang] renseigné`, !!meta.lang, meta.lang || '(absent)');
    ok(`${id}-title`, `${label} : <title> non vide`, meta.title.length > 0, meta.title.slice(0, 50));
    if (meta.viewport) {
        ok(`${id}-zoom`, `${label} : zoom non bloqué`, !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(meta.viewport), meta.viewport);
    } else {
        na(`${id}-zoom`, `${label} : zoom non bloqué`, 'pas de meta viewport');
    }
};

// ── A. Document : lang, title, viewport ───────────────────────────────────
await page.goto(`${B}/login/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
metaChecks('A1', 'page publique /login', await metaOf());

for (const [id, label, url] of [
    ['A2', '/g/home', `${B}/g/home`],
    ['A3', 'page recette', `${B}/g/home/r/golden-lentil-soup`],
    ['A4', '/admin/site-settings', `${B}/admin/site-settings/`],
]) {
    if (await gotoAuth(url, `${id}-nav`, `navigation authentifiée ${label}`)) {
        metaChecks(id, label, await metaOf());
    }
}

// ── B. Hiérarchie de titres : aucun saut de niveau ────────────────────────
for (const [id, label, url] of [
    ['B1', '/g/home', `${B}/g/home`],
    ['B2', 'page recette', `${B}/g/home/r/golden-lentil-soup`],
    ['B3', '/group/data/foods', `${B}/group/data/foods/`],
]) {
    if (await gotoAuth(url, `${id}-nav`, `navigation authentifiée ${label}`)) {
        const hs = await page.evaluate(() =>
            [...document.querySelectorAll('main h1,main h2,main h3,main h4,main h5,main h6,[role="main"] h1,[role="main"] h2,[role="main"] h3')]
                .filter(h => (h.textContent || '').trim().length > 0 && h.getClientRects().length > 0)
                .map(h => +h.tagName[1])
        );
        let skip = false;
        for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) skip = true;
        ok(id, `${label} : hiérarchie de titres sans saut`, !skip, JSON.stringify(hs.slice(0, 12)));
    }
}

// ── C. Focus clavier : ordre atteint header + indicateur visible ──────────
if (await gotoAuth(`${B}/g/home`, 'C-nav', 'navigation authentifiée /g/home (focus)')) {
    const seq = [];
    for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
        const a = await page.evaluate(() => {
            const e = document.activeElement;
            return e ? `${e.tagName}.${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 30)}` : 'body';
        });
        seq.push(a);
        if (seq.length >= 4 && seq.slice(-3).every(x => x === seq[seq.length - 1])) break;
    }
    const reached = seq.filter(s => /navigation|Mealie|search|Créer|Create/i.test(s)).length;
    ok('C1', `clavier : ≥2 repères atteignables par Tab (${seq.length} tabulations)`, reached >= 2, JSON.stringify(seq.slice(0, 10)));

    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    const vis = await page.evaluate(() => {
        const e = document.activeElement;
        if (!e || e === document.body) return { skip: true };
        const s = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        return {
            skip: false,
            outline: s.outlineStyle !== 'none' && s.outlineWidth !== '0px',
            shadow: s.boxShadow !== 'none',
            rect: r.width > 0,
        };
    });
    ok('C2', 'focus : indicateur visible sur le 1er élément tabbable', !vis.skip && (vis.outline || vis.shadow), JSON.stringify(vis));
}

// ── D. Dialog : focus confiné pendant ouverture ───────────────────────────
if (!sessionDead) {
    await STATES['language-dialog'].setup(page);
    await page.waitForTimeout(700);
    const first = await page.evaluate(() => {
        const dlg = [...document.querySelectorAll('[role="dialog"],.v-overlay__content')].find(o => o.getClientRects().length > 0);
        return dlg ? dlg.contains(document.activeElement) : null;
    });
    for (let i = 0; i < 15; i++) await page.keyboard.press('Tab');
    const trapped = await page.evaluate(() => {
        const dlg = [...document.querySelectorAll('[role="dialog"],.v-overlay__content')].find(o => o.getClientRects().length > 0);
        return dlg ? dlg.contains(document.activeElement) : null;
    });
    ok('D1', 'dialog langue : focus piégé dans le dialog ouvert', trapped === true, `trapped=${trapped} firstIn=${first}`);
    await settle();
} else {
    na('D1', 'dialog langue : focus piégé', 'session absente');
}

// ── E. Reflow 320px : pas de scroll horizontal de page ────────────────────
if (!sessionDead) {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(`${B}/g/home`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
    }));
    ok('E1', 'reflow 320px : scrollWidth ≈ clientWidth (pas de scroll horizontal)', r.sw <= r.cw + 10, JSON.stringify(r));
    await page.setViewportSize({ width: 1280, height: 800 });
} else {
    na('E1', 'reflow 320px : pas de scroll horizontal', 'session absente');
}

// ── F. Cibles ≥24px ou espacées (WCAG 2.5.8) ──────────────────────────────
if (!sessionDead) {
    const sizes = await page.evaluate(() => {
        const els = [...document.querySelectorAll('.v-app-bar button, .v-app-bar a')];
        return els.map(e => { const r = e.getBoundingClientRect(); return Math.min(r.width, r.height); });
    });
    const small = sizes.filter(s => s > 0 && s < 24).length;
    ok('F1', `header : ${sizes.length} cibles, 0 sous 24px`, small === 0, `small=${small} sizes=${JSON.stringify(sizes.slice(0, 8))}`);
} else {
    na('F1', 'header : cibles ≥24px', 'session absente');
}

// ── G. Thème : auto → light par défaut, dark si demandé ───────────────────
if (!sessionDead) {
    const dark = await page.evaluate(() => ({
        cls: document.documentElement.classList.contains('dark'),
        stored: localStorage.getItem('vueuse-color-scheme'),
    }));
    ok('G1', 'thème : par défaut non-dark (auto/light)', dark.cls === false, JSON.stringify(dark));
    await STATES['theme-dark'].setup(page);
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => ({
        cls: document.documentElement.classList.contains('dark'),
        appDark: !!document.querySelector('.v-theme--dark'),
    }));
    ok('G2', 'thème : dark applique html.dark + .v-theme--dark', after.cls && after.appDark, JSON.stringify(after));
    await page.evaluate(() => localStorage.setItem('vueuse-color-scheme', 'auto'));
} else {
    na('G1', 'thème : défaut non-dark', 'session absente');
    na('G2', 'thème : dark appliqué', 'session absente');
}

// ── H. Recette publique : page complète sans login (contexte neutre) ──────
let seedEnv = null;
try { seedEnv = JSON.parse(require('node:fs').readFileSync(resolve(HERE, 'seed-env.json'), 'utf8')); }
catch { na('H1', 'partage : page publique complète', 'seed-env.json illisible — rejouer tools/seed.mjs'); }
if (seedEnv?.shareToken) {
    const pubCtx = await browser.newContext({ locale: 'en-US' });
    const pub = await pubCtx.newPage();
    await pub.goto(`${B}/g/home/shared/r/${seedEnv.shareToken}`, { waitUntil: 'networkidle' });
    await pub.waitForTimeout(1500);
    const m = await pub.evaluate(() => ({
        title: document.title.trim(),
        h1: document.querySelectorAll('h1').length,
        landmarks: document.querySelectorAll('main,[role="main"],header,[role="banner"]').length,
    }));
    ok('H1', 'partage : <title> non vide', m.title.length > 0, m.title.slice(0, 50));
    ok('H2', 'partage : h1 présent', m.h1 >= 1, `h1=${m.h1}`);
    ok('H3', 'partage : landmark main/banner présent', m.landmarks >= 1, `landmarks=${m.landmarks}`);
    await pubCtx.close();
} else if (seedEnv) {
    na('H1', 'partage : page publique complète', 'seed-env.json sans shareToken');
}

const fails = results.filter(r => !r.pass).length;
const nas = results.filter(r => r.verdict === 'N-A').length;
console.log(`\neval-final.mjs: ${results.length - fails - nas}/${results.length - nas} PASS, ${fails} FAIL, ${nas} N-A`);
for (const r of results) console.error(`  ${r.pass ? (r.verdict === 'N-A' ? 'N-A ' : 'PASS') : 'FAIL'} [${r.id}] ${r.name}`);
process.exit(fails === 0 ? 0 : 1);
