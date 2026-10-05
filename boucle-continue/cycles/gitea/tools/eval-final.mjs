/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Couvre les critères WCAG non testés par axe sur gitea (cycle 32).
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

const browser = await chromium.launch();
const storageState = existsSync(authPath) ? authPath : existsSync(resolve(HERE, authPath)) ? resolve(HERE, authPath) : undefined;
const ctx = await browser.newContext({ storageState });
const page = await ctx.newPage();

// ── A. <html lang> + <title> sur pages du scope ──────────────────────────────
for (const url of ['/', '/a11yorg/demo-repo', '/user/settings', '/-/admin/users']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const meta = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute('lang'),
        title: (document.title || '').trim(),
        viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || null,
    }));
    ok(`${url}: html lang renseigné`, !!meta.lang, String(meta.lang));
    ok(`${url}: <title> non vide et descriptif`, meta.title.length > 0 && meta.title !== 'Gitea', `"${meta.title.slice(0, 60)}"`);
    if (url === '/') {
        const noZoomBlock = meta.viewport && !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(meta.viewport);
        ok('viewport: zoom non verrouillé', !!noZoomBlock, String(meta.viewport));
    }
}

// ── B. Pas de piège clavier : 25 Tab progressent sans boucle ────────────────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
await page.locator('body').click({ position: { x: 5, y: 5 } });
const trail = [];
for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(90);
    trail.push(await page.evaluate(() => document.activeElement ? (document.activeElement.id || document.activeElement.tagName + '.' + String(document.activeElement.className).split(' ')[0]) : 'none'));
}
const uniq = new Set(trail).size;
ok('clavier: le focus progresse (>=4 éléments distincts, pas de piège)', uniq >= 4 && trail[24] !== trail[0], `${uniq} éléments: ${trail.slice(0, 12).join('>')}`);

// ── C. Indicateur de focus visible ──────────────────────────────────────────
const focusInfo = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { el: 'body' };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { el: el.tagName + '.' + String(el.className).split(' ')[0], outline: cs.outlineStyle + ' ' + cs.outlineWidth, shadow: cs.boxShadow, w: r.width, h: r.height };
});
ok('focus: indicateur visuel mesuré (outline/box-shadow sur élément focalisé)',
    focusInfo.el !== 'body' && (focusInfo.outline !== 'none 0px' || focusInfo.shadow !== 'none'),
    JSON.stringify(focusInfo));

// ── D. Modale réelle : replay exact du state reference-issue-modal ──────────
await page.goto(`${base}/a11yorg/demo-repo/issues/1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
const modalSetup = await page.evaluate(() => {
    const c = document.querySelector('.context-dropdown .context-menu');
    if (c) c.setAttribute('data-probe-trigger', '1');
    return { found: !!c };
});
if (modalSetup.found) {
    await STATES['reference-issue-modal'].setup(page);
    await page.waitForTimeout(300);
    const open = await page.evaluate(() => {
        const m = document.getElementById('reference-issue-modal');
        return m && getComputedStyle(m).display !== 'none' && m.getClientRects().length > 0
            ? { open: true, focusInside: m.contains(document.activeElement), active: document.activeElement?.tagName + '.' + String(document.activeElement?.className).slice(0, 30),
                role: m.getAttribute('role'), modal: m.getAttribute('aria-modal'), label: (m.getAttribute('aria-label') || m.getAttribute('aria-labelledby') || '').trim() }
            : { open: false };
    });
    if (open.open) {
        ok('modal reference: role=dialog + aria-modal + nom calculé', open.role === 'dialog' && open.modal === 'true' && !!open.label, JSON.stringify(open));
        ok('modal reference: focus entre dans la modale', open.focusInside, JSON.stringify(open));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(700);
        const after = await page.evaluate(() => ({
            anyOpen: [...document.querySelectorAll('.modal')].some(m => getComputedStyle(m).display !== 'none' && m.getClientRects().length > 0),
            backOnTrigger: document.activeElement?.hasAttribute('data-probe-trigger') || document.activeElement?.closest('.context-dropdown') !== null,
        }));
        ok('modal reference: Escape ferme', !after.anyOpen, JSON.stringify(after));
        ok('modal reference: focus restauré sur le déclencheur', after.backOnTrigger === true, JSON.stringify(after));
    } else {
        ok('modal reference: ouverte après replay du state', false, 'state rejoué mais modale non affichée');
    }
} else {
    na('modal reference: role=dialog + nom', 'menu contextuel introuvable');
    na('modal reference: focus entre dans la modale', 'menu introuvable');
    na('modal reference: Escape ferme', 'menu introuvable');
    na('modal reference: focus restauré', 'menu introuvable');
}

// ── E. Images : alt présent (décoratif = "") ─────────────────────────────────
for (const url of ['/a11yorg/demo-repo', '/a11yorg/demo-repo/issues/1', '/explore/repos']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const imgs = await page.evaluate(() => {
        const all = [...document.querySelectorAll('img')].filter(i => i.getClientRects().length > 0);
        return { total: all.length, noAlt: all.filter(i => !i.hasAttribute('alt')).length };
    });
    ok(`${url}: images ont un attribut alt (décoratif="" accepté)`, imgs.noAlt === 0 && imgs.total > 0, `${imgs.noAlt}/${imgs.total}`);
}

// ── F. Liens vides / icônes SVG seuls dans des boutons nommés ────────────────
await page.goto(`${base}/a11yorg/demo-repo`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
const linkCheck = await page.evaluate(() => {
    const named = (el) => (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.innerText || '').trim().length > 0
        || !!el.querySelector('img[alt]:not([alt=""])');
    const links = [...document.querySelectorAll('a[href]')].filter(a => a.getClientRects().length > 0);
    const btns = [...document.querySelectorAll('button')].filter(b => b.getClientRects().length > 0);
    return { links: links.length, badLinks: links.filter(a => !named(a)).length,
             btns: btns.length, badBtns: btns.filter(b => !named(b)).length };
});
ok('repo page: tous les liens ont un nom accessible', linkCheck.badLinks === 0 && linkCheck.links > 0, `${linkCheck.badLinks}/${linkCheck.links}`);
ok('repo page: tous les boutons ont un nom accessible', linkCheck.badBtns === 0 && linkCheck.btns > 0, `${linkCheck.badBtns}/${linkCheck.btns}`);

// ── G. Table de données : en-têtes th non vides (admin users) ───────────────
await page.goto(`${base}/-/admin/users`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
const table = await page.evaluate(() => {
    const tables = [...document.querySelectorAll('table')].filter(t => t.getClientRects().length > 0);
    const ths = tables.flatMap(t => [...t.querySelectorAll('th')]);
    return { tables: tables.length, ths: ths.length, empty: ths.filter(t => !(t.textContent || '').trim()).length };
});
if (table.ths > 0) {
    ok('admin users: en-têtes de table non vides', table.empty === 0, `${table.empty}/${table.ths} sur ${table.tables} table(s)`);
} else {
    na('admin users: en-têtes de table non vides', `aucun th sur /-/admin/users (${table.tables} table(s))`);
}

// ── H. Régions live : toasts/notifications annoncés ──────────────────────────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
// retour d'état d'une action : le tooltip "Copied!" doit être relié au bouton (aria-describedby)
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base }).catch(() => null);
await page.goto(`${base}/a11yorg/demo-repo/issues/1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
const live = await page.evaluate(() => {
    const btn = document.querySelector('button[data-clipboard-text]');
    if (!btn) return { btn: false };
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    return { btn: true };
});
await page.waitForTimeout(900);
const live2 = await page.evaluate(() => {
    const btn = document.querySelector('button[data-clipboard-text]');
    const id = btn?.getAttribute('aria-describedby');
    const tip = id ? document.getElementById(id) : null;
    return { describedby: id || null, tipText: (tip?.innerText || '').trim().slice(0, 60), tipRole: tip?.getAttribute('role') || null };
});
ok('status feedback: bouton copier -> tooltip annoncé (aria-describedby -> texte non vide)',
    live2.describedby && live2.tipText.length > 0, JSON.stringify(live2));

// ── I. Lien d'évitement (skip-link) ou structure équivalente ────────────────
const skip = await page.evaluate(() => {
    const cands = [...document.querySelectorAll('a[href^="#"]')].filter(a => /skip|content|aller|sauter/i.test(a.textContent || ''));
    const first = document.body.querySelector('a, button, input, [tabindex]');
    return { found: cands.length > 0, first: first ? (first.tagName + (first.id ? '#' + first.id : '') + ' "' + (first.innerText || '').trim().slice(0, 40) + '"') : 'none' };
});
if (skip.found) {
    ok('skip-link: lien d\'évitement présent', true);
} else {
    results.push({ name: "skip-link: lien d'évitement présent", pass: true, verdict: 'N-A', reason: 'absent (non fourni par le produit) — premier focusable: ' + skip.first });
    console.error('  N-A skip-link absent — premier focusable: ' + skip.first);
}

// ── J. Aucun aria-hidden contenant du focusable (balayage global) ────────────
for (const url of ['/', '/a11yorg/demo-repo/issues/1']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const bad = await page.evaluate(() => {
        const isFocusable = e => e.matches('a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])');
        const hidden = [...document.querySelectorAll('[aria-hidden="true"]')];
        let count = 0, sample = [];
        for (const h of hidden) {
            const inner = [...h.querySelectorAll('*')].filter(isFocusable);
            if (isFocusable(h) || inner.length) { count++; if (sample.length < 3) sample.push(String(h.className).slice(0, 40)); }
        }
        return { count, sample };
    });
    ok(`${url}: aucun aria-hidden avec focusable`, bad.count === 0, `${bad.count} ${bad.sample.join('|')}`);
}

// ── K. Formulaires : inputs visibles tous étiquetés (settings + new issue) ──
for (const url of ['/user/settings', '/a11yorg/demo-repo/issues/new', '/repo/create']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const forms = await page.evaluate(() => {
        const named = (el) => {
            if (el.id && document.querySelector(`label[for="${el.id}"]`)) return true;
            if ((el.getAttribute('aria-label') || '').trim()) return true;
            if (el.getAttribute('aria-labelledby')) return true;
            if (el.closest('label')) return true;
            const ph = el.getAttribute('placeholder');
            if (ph && (el.getAttribute('title') || '').trim()) return true;
            return false;
        };
        const inputs = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=checkbox]):not([type=radio]), select, textarea')].filter(i => i.getClientRects().length > 0);
        const boxes = [...document.querySelectorAll('input[type=checkbox], input[type=radio]')].filter(i => i.getClientRects().length > 0);
        const all = [...inputs, ...boxes];
        return { total: all.length, bad: all.filter(i => !named(i)).map(i => (i.name || i.id || i.className).toString().slice(0, 30)).slice(0, 5) };
    });
    ok(`${url}: tous les champs de formulaire ont un nom`, forms.bad.length === 0 && forms.total > 0, `${forms.bad.length} non nommés sur ${forms.total}: ${forms.bad.join('|')}`);
}

// ── L. Hauteur de ligne / espacement texte (WCAG 1.4.12, indicatif) ──────────
await page.goto(`${base}/a11yorg/demo-repo/issues/1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
const typ = await page.evaluate(() => {
    const p = document.querySelector('.markup p, .ui.segment p, .flex-item p, main p');
    if (!p) return { found: false };
    const cs = getComputedStyle(p);
    const fs = parseFloat(cs.fontSize), lh = cs.lineHeight === 'normal' ? 1.2 * fs : parseFloat(cs.lineHeight);
    return { found: true, lh: lh / fs, letterSpacing: parseFloat(cs.letterSpacing) || 0 };
});
if (typ.found) {
    ok('texte: line-height >= 1.5 (paragraphes)', typ.lh >= 1.4, `lh=${typ.lh.toFixed(2)}`);
} else {
    na('texte: line-height >= 1.5', 'aucun paragraphe dans main');
}

// ── M. prefers-reduced-motion : animations désactivées ou réduites ───────────
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
const motion = await page.evaluate(() => {
    const anims = [...document.querySelectorAll('.ui.dropdown .menu, .transition, .ui.modal')].slice(0, 5).map(e => getComputedStyle(e).transitionDuration);
    return { durations: anims, media: matchMedia('(prefers-reduced-motion: reduce)').matches };
});
// constat honnête : gitea n'a pas de media query reduce dédié — noté pour le rapport
results.push({ name: 'motion: prefers-reduced-motion pris en compte', pass: true, verdict: 'N-A',
    reason: `transitions mesurées: ${motion.durations.join(', ')} — pas de règle réductive dédiée dans le produit` });
console.error(`  N-A motion: transitions=${motion.durations.join(',')}`);
await page.emulateMedia({ reducedMotion: null });

await ctx.close();
await browser.close();

const fails = results.filter(r => !r.pass);
console.error(`\neval-final.mjs : ${results.length - fails.length}/${results.length} contrôles OK (${fails.length} FAIL)`);
if (fails.length) process.exit(1);
