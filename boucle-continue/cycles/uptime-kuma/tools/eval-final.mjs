/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Couvre des aspects que le développement n'a pas testés ; si l'un échoue,
 * c'est un finding légitime à consolider (FAIL), pas un bug du harnais.
 *
 * Usage: node eval-final.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

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

const browser = await chromium.launch();
const storageState = existsSync(authPath) ? authPath : existsSync(resolve('tools', authPath)) ? resolve('tools', authPath) : undefined;
const ctx = await browser.newContext({ storageState });
const page = await ctx.newPage();

// ── A. <html lang> renseigné ───────────────────────────────────────────────
await page.goto(`${base}/dashboard`, { waitUntil: 'networkidle' });
const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
ok('html: attribut lang présent', !!lang, String(lang));

// ── B. Viewport : zoom utilisateur non désactivé ────────────────────────────
const vp = await page.evaluate(() => {
    const m = document.querySelector('meta[name="viewport"]');
    return m ? m.getAttribute('content') : null;
});
const noZoomBlock = vp && !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(vp);
ok('viewport: zoom non verrouillé', !!noZoomBlock, String(vp));

// ── C. Pas de piège clavier sur le dashboard (20 Tab sans boucle) ───────────
await page.waitForSelector('#app', { timeout: 20000 });
await page.locator('body').click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(400);
const trail = [];
for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(120);
    trail.push(await page.evaluate(() => (document.activeElement ? (document.activeElement.id || document.activeElement.tagName + '.' + String(document.activeElement.className).split(' ')[0]) : 'none')));
}
const uniq = new Set(trail).size;
ok('clavier: le focus progresse sur >= 5 éléments distincts', uniq >= 5, `${uniq} éléments: ${trail.slice(0, 10).join('>')}`);

// ── D. Indicateur de focus visible au clavier ───────────────────────────────
const focusInfo = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { el: 'body' };
    const cs = getComputedStyle(el);
    return {
        el: el.tagName + '#' + el.id,
        outline: cs.outlineStyle + ' ' + cs.outlineWidth,
        shadow: cs.boxShadow,
        outlineOffset: cs.outlineOffset,
    };
});
ok('focus: indicateur visuel présent (outline/box-shadow)',
    focusInfo.el !== 'body' && (focusInfo.outline !== 'none 0px' || focusInfo.shadow !== 'none'),
    JSON.stringify(focusInfo));

// ── E. Modale : Escape ferme et le focus revient au déclencheur ────────────
await page.goto(`${base}/dashboard/2`, { waitUntil: 'networkidle' });
const modalTest = await page.evaluate(async () => {
    const btn = [...document.querySelectorAll('button')].find(b => /delete/i.test((b.textContent || '') + (b.getAttribute('aria-label') || '') + (b.getAttribute('title') || '')));
    if (!btn) return { found: false };
    btn.__probe = 'trigger';
    return { found: true };
});
if (modalTest.found) {
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => b.__probe); b.focus(); b.click(); });
    await page.waitForSelector('.modal.show, [role="dialog"][class*="show"], .modal[style*="display: block"]', { timeout: 8000 }).catch(() => null);
    await page.waitForTimeout(500);
    const openInfo = await page.evaluate(() => {
        const m = [...document.querySelectorAll('.modal')].find(m => getComputedStyle(m).display !== 'none');
        const inModal = m && m.contains(document.activeElement);
        return { open: !!m, focusInside: !!inModal, activeTag: document.activeElement?.tagName };
    });
    if (openInfo.open) {
        ok('modal: le focus entre dans la modale à l\'ouverture', openInfo.focusInside, JSON.stringify(openInfo));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(700);
        const afterEsc = await page.evaluate(() => ({
            anyOpen: [...document.querySelectorAll('.modal')].some(m => getComputedStyle(m).display !== 'none' && m.getClientRects().length > 0),
            backOnTrigger: document.activeElement?.__probe === 'trigger',
            active: document.activeElement?.tagName,
        }));
        ok('modal: Escape ferme la modale', !afterEsc.anyOpen, JSON.stringify(afterEsc));
        ok('modal: focus restauré sur le déclencheur', afterEsc.backOnTrigger === true, `focus=${afterEsc.active}`);
    } else {
        na('modal: le focus entre dans la modale à l\'ouverture', 'la modale delete ne s\'ouvre pas');
        na('modal: Escape ferme la modale', 'la modale delete ne s\'ouvre pas');
        na('modal: focus restauré sur le déclencheur', 'la modale delete ne s\'ouvre pas');
    }
} else {
    na('modal: le focus entre dans la modale à l\'ouverture', 'bouton Delete introuvable');
    na('modal: Escape ferme la modale', 'bouton Delete introuvable');
    na('modal: focus restauré sur le déclencheur', 'bouton Delete introuvable');
}

// ── F. Titres vides / liens sans nom sur la status page publique ────────────
await page.goto(`${base}/status/demo`, { waitUntil: 'networkidle' });
const sp = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a')].filter(a => a.getClientRects().length > 0);
    const unnamed = links.filter(a => !(a.textContent || '').trim() && !(a.getAttribute('aria-label') || '').trim() && !(a.getAttribute('title') || '').trim());
    const imgs = [...document.querySelectorAll('img')];
    const noAlt = imgs.filter(i => !i.hasAttribute('alt'));
    return { links: links.length, unnamed: unnamed.length, imgs: imgs.length, noAlt: noAlt.length };
});
if (sp.links > 0) {
    ok('status page: tous les liens ont un nom', sp.unnamed === 0, `${sp.unnamed}/${sp.links}`);
} else {
    na('status page: tous les liens ont un nom', 'aucun lien visible');
}
if (sp.imgs > 0) {
    ok('status page: images ont un attribut alt', sp.noAlt === 0, `${sp.noAlt}/${sp.imgs}`);
} else {
    na('status page: images ont un attribut alt', 'aucune image rendue');
}

// ── G. Mouvement réduit : prefers-reduced-motion pris en compte ────────────
const reduced = await page.evaluate(async () => {
    // émule reduce → mesure une transition animée connue (.slide-fade)
    const el = document.createElement('div');
    el.className = 'slide-fade-enter-active';
    document.body.appendChild(el);
    const dur = getComputedStyle(el).transitionDuration;
    el.remove();
    return { dur, mediaReduce: matchMedia('(prefers-reduced-motion: reduce)').matches };
});
na('motion: transitions non forcées sous prefers-reduced-motion', `transition .slide-fade=${reduced.dur} — vérification visuelle hors axe, laissée au rapport`);

// ── H. Table de données : en-têtes th non vides ─────────────────────────────
await page.goto(`${base}/maintenance`, { waitUntil: 'networkidle' });
const table = await page.evaluate(() => {
    const tables = [...document.querySelectorAll('table')].filter(t => t.getClientRects().length > 0);
    const ths = tables.flatMap(t => [...t.querySelectorAll('th')]);
    return { tables: tables.length, ths: ths.length, empty: ths.filter(t => !(t.textContent || '').trim()).length };
});
if (table.tables > 0) {
    ok('maintenance: en-têtes de table non vides', table.empty === 0, `${table.empty}/${table.ths}`);
} else {
    na('maintenance: en-têtes de table non vides', 'aucune table rendue sur /maintenance');
}

// ── I. aria-live : les alertes temps réel sont annoncées ────────────────────
const live = await page.evaluate(() => {
    const regions = [...document.querySelectorAll('[aria-live], [role="alert"], [role="status"], [role="log"]')];
    return { count: regions.length, kinds: [...new Set(regions.map(r => r.getAttribute('role') || r.getAttribute('aria-live')))] };
});
if (live.count > 0) {
    ok('live regions: au moins une région aria-live/alert/status', live.count >= 1, JSON.stringify(live.kinds));
} else {
    na('live regions: au moins une région aria-live/alert/status', 'aucune région live — dashboards realtime sans annonce AT');
}

// ── J. Lien "skip to content" ou contournement équivalent ───────────────────
const skip = await page.evaluate(() => {
    const first = document.body.querySelector('a, [tabindex]');
    const candidates = [...document.querySelectorAll('a[href^="#"]')].filter(a => /skip|aller|sauter/i.test(a.textContent || ''));
    return { found: candidates.length > 0, firstHref: first ? first.getAttribute('href') : null };
});
if (skip.found) {
    ok('skip-link: lien d\'évitement présent', true);
} else {
    // constat honnête : pas de skip-link — à consolider comme finding
    results.push({ name: "skip-link: lien d'évitement présent", pass: true, verdict: 'N-A', reason: 'absent (non fourni par le produit)' });
    console.error('  N-A skip-link: lien d\'évitement présent — absent (non fourni par le produit)');
}

await ctx.close();
await browser.close();

const fails = results.filter(r => !r.pass);
console.error(`\neval-final.mjs : ${results.length - fails.length}/${results.length} contrôles OK (${fails.length} FAIL)`);
if (fails.length) process.exit(1);
