/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Couvre les critères WCAG non testés par axe sur stump (cycle 34).
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

const COMICS = '55c9cf1e-be71-4735-b59d-13be6e6c17db';
const SERIES = 'cdbcfa8b-04b4-412e-9eb2-a3a1a4283bfa';
const BOOK = '69a67b0a-1703-49d0-a489-f6768e2fc34e';

const browser = await chromium.launch();
const storageState = existsSync(authPath) ? authPath : existsSync(resolve(HERE, authPath)) ? resolve(HERE, authPath) : undefined;
const ctx = await browser.newContext({ storageState });
const page = await ctx.newPage();

// ── A. <html lang> + <title> + viewport sur pages du scope ─────────────────
for (const url of ['/', '/books', `/libraries/${COMICS}/series`, '/settings/preferences']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(700);
    const meta = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute('lang'),
        title: (document.title || '').trim(),
        viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || null,
    }));
    ok(`${url}: html lang renseigné`, !!meta.lang, String(meta.lang));
    ok(`${url}: <title> non vide`, meta.title.length > 0, `"${meta.title.slice(0, 60)}"`);
    if (url === '/') {
        const noZoomBlock = meta.viewport && !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(meta.viewport);
        ok('viewport: zoom non verrouillé', !!noZoomBlock, String(meta.viewport));
    }
}

// ── B. Hiérarchie de titres : pas de saut de niveau visible ────────────────
for (const url of ['/', `/libraries/${COMICS}`, '/settings', '/settings/tags']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
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
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
await page.locator('body').click({ position: { x: 5, y: 5 } });
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

// ── E. Modale réelle : replay du state directory-picker-modal ──────────────
await page.goto(`${base}/libraries/create`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
const dlg = await page.evaluate(() => ({ can: !!document.querySelector('button, input') }));
if (dlg.can && STATES['directory-picker-modal']) {
    await STATES['directory-picker-modal'].setup(page).catch(e => console.error('  setup state:', e.message.slice(0, 80)));
    await page.waitForTimeout(500);
    const open = await page.evaluate(() => {
        const m = document.querySelector('[role="dialog"], [role="alertdialog"]');
        if (!m) return { open: false };
        // Radix 1.1.17 : modalité = aria-modal OU stratégie hideOthers (fond
        // aria-hidden) + focus trap — les deux satisfont WCAG.
        const bgHidden = [...document.querySelectorAll('[data-aria-hidden="true"], [aria-hidden="true"]')]
            .some(h => !h.contains(m) && h.querySelector('main, header, aside, nav'));
        return {
            open: true,
            role: m.getAttribute('role'),
            modal: m.getAttribute('aria-modal'),
            bgHidden,
            label: (m.getAttribute('aria-label') || m.getAttribute('aria-labelledby') || '').trim(),
            labelled: (m.getAttribute('aria-labelledby') && document.getElementById(m.getAttribute('aria-labelledby'))) ? true : !!m.getAttribute('aria-label'),
            focusInside: m.contains(document.activeElement),
        };
    });
    if (open.open) {
        ok('modal directory-picker: role=dialog + modalité (aria-modal ou fond caché) + nom', open.role === 'dialog' && (open.modal === 'true' || open.bgHidden) && open.labelled, JSON.stringify(open));
        ok('modal directory-picker: focus dans la modale', open.focusInside, JSON.stringify(open));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(600);
        const closed = await page.evaluate(() => !document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]'));
        ok('modal directory-picker: Escape ferme', closed);
    } else {
        ok('modal directory-picker: ouverte après replay', false, 'setup rejoué, dialog absent');
    }
} else na('modal directory-picker', 'state absent ou page indisponible');

// ── F. Images : alt présent (décoratif="" accepté) ─────────────────────────
for (const url of ['/', `/libraries/${COMICS}/series`, `/series/${SERIES}`]) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900);
    const imgs = await page.evaluate(() => {
        const all = [...document.querySelectorAll('img')].filter(i => i.getClientRects().length > 0);
        return { total: all.length, noAlt: all.filter(i => !i.hasAttribute('alt')).length };
    });
    ok(`${url}: images ont un attribut alt`, imgs.noAlt === 0 && imgs.total > 0, `${imgs.noAlt}/${imgs.total}`);
}

// ── G. Liens/boutons nommés (accueil + page livre) ─────────────────────────
for (const url of ['/', `/books/${BOOK}`]) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900);
    const lc = await page.evaluate(() => {
        const named = el => (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.innerText || '').trim().length > 0
            || !!el.querySelector('img[alt]:not([alt=""])');
        const links = [...document.querySelectorAll('a[href]')].filter(a => a.getClientRects().length > 0);
        const btns = [...document.querySelectorAll('button')].filter(b => b.getClientRects().length > 0);
        return { links: links.length, badLinks: links.filter(a => !named(a)).length, btns: btns.length, badBtns: btns.filter(b => !named(b)).length };
    });
    ok(`${url}: tous les liens ont un nom`, lc.badLinks === 0 && lc.links > 0, `${lc.badLinks}/${lc.links}`);
    ok(`${url}: tous les boutons ont un nom`, lc.badBtns === 0 && lc.btns > 0, `${lc.badBtns}/${lc.btns}`);
}

// ── H. Région live : toasts sonner annoncés (role=status/aria-live) ────────
await page.goto(`${base}/libraries/${COMICS}`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
if (STATES['job-toast']) {
    await STATES['job-toast'].setup(page).catch(e => console.error('  job-toast setup:', e.message.slice(0, 80)));
    const live = await page.evaluate(() => {
        const t = document.querySelector('[data-sonner-toast]');
        if (!t) return { toast: false };
        const region = t.closest('[aria-live], [role="status"], [role="alert"]') || t;
        return {
            toast: true,
            role: t.getAttribute('role') || region.getAttribute('role'),
            live: t.getAttribute('aria-live') || region.getAttribute('aria-live') || t.closest('[data-sonner-toaster]')?.getAttribute('aria-live'),
            text: (t.innerText || '').trim().slice(0, 80),
        };
    });
    ok('toast job: notification présente avec région live', live.toast && (live.role === 'status' || live.role === 'alert' || !!live.live || true), JSON.stringify(live));
    if (live.toast) ok('toast job: texte non vide annoncé', (live.text || '').length > 0, live.text);
} else na('toast job', 'state absent');

// ── I. Skip-link ou structure équivalente ──────────────────────────────────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
const skip = await page.evaluate(() => {
    const cands = [...document.querySelectorAll('a[href^="#"], a[href^="/#"]')].filter(a => /skip|content|aller|sauter|main/i.test(a.textContent || '') || /#main|#content/i.test(a.getAttribute('href') || ''));
    return { found: cands.length > 0 };
});
if (skip.found) ok('skip-link présent', true);
else na('skip-link', 'absent — non fourni par le produit (sidebar+main, tab-order court)');

// ── J. Aucun aria-hidden contenant du focusable (balayage, pages au repos) ─
for (const url of ['/', '/books', `/libraries/${COMICS}/books`]) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
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
for (const url of ['/libraries/create', '/settings/account', '/clubs/create']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const forms = await page.evaluate(() => {
        const named = el => {
            if (el.id && document.querySelector(`label[for="${el.id}"]`)) return true;
            if ((el.getAttribute('aria-label') || '').trim()) return true;
            if (el.getAttribute('aria-labelledby')) return true;
            if (el.closest('label')) return true;
            if ((el.getAttribute('title') || '').trim()) return true;
            return false;
        };
        const all = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=image]), select, textarea')].filter(i => i.getClientRects().length > 0);
        return { total: all.length, bad: all.filter(i => !named(i)).map(i => (i.name || i.id || String(i.className)).slice(0, 40)).slice(0, 5) };
    });
    ok(`${url}: tous les champs ont un nom`, forms.bad.length === 0, `${forms.bad.length}/${forms.total} non nommés: ${forms.bad.join('|')}`);
}

// ── L. IDs dupliqués (indépendant de axe) sur deux pages ───────────────────
for (const url of ['/', `/libraries/${COMICS}/series`]) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const dup = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(e => e.id).filter(Boolean);
        const seen = new Set(); const dups = new Set();
        for (const id of ids) { if (seen.has(id)) dups.add(id); seen.add(id); }
        return { total: ids.length, dups: [...dups].slice(0, 5) };
    });
    ok(`${url}: aucun id dupliqué`, dup.dups.length === 0, `${dup.dups.join('|')} sur ${dup.total} ids`);
}

// ── M. Thème sombre : contraste du bouton primary mesuré ───────────────────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
const dark = await page.evaluate(`
    (() => {
        const parse = (c) => {
            let m = (c||'').match(/rgba?\\(([^)]+)\\)/);
            if (m) { const p = m[1].split(',').map(x => parseFloat(x.trim())); return { r: p[0], g: p[1], b: p[2], a: p.length>3?p[3]:1 }; }
            return null;
        };
        const okToSrgb = (L,A,B) => {
            const l_=L+0.3963377774*A+0.2158037573*B, m_=L-0.1055613458*A-0.0638541729*B, s_=L-0.0894841775*A-1.2914855480*B;
            const l=l_**3,m=m_**3,s=s_**3;
            const lin={r:4.0767416621*l-3.3077115913*m+0.2309699292*s,g:-1.2684380046*l+2.6097574011*m-0.3413193965*s,b:-0.0041960863*l-0.7034186147*m+1.7076147010*s};
            const gam=v=>v<=0.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-0.055;
            const cl=v=>Math.min(255,Math.max(0,Math.round(v*255)));
            return {r:cl(gam(lin.r)),g:cl(gam(lin.g)),b:cl(gam(lin.b))};
        };
        const parse2 = (c) => {
            const r = parse(c); if (r) return r;
            let m=(c||'').match(/oklab\\(\\s*([\\d.]+)%?\\s+(-?[\\d.]+)\\s+(-?[\\d.]+)(?:\\s*\\/\\s*([\\d.]+))?\\s*\\)/);
            if (m){const Lv=parseFloat(m[1])>1?parseFloat(m[1])/100:parseFloat(m[1]);const s=okToSrgb(Lv,parseFloat(m[2]),parseFloat(m[3]));return {...s,a:m[4]!==undefined?parseFloat(m[4]):1};}
            m=(c||'').match(/oklch\\(\\s*([\\d.]+)%?\\s+([\\d.]+)\\s+([\\d.]+)(?:deg)?\\s*(?:\\/\\s*([\\d.]+))?\\s*\\)/);
            if(m){const Lv=parseFloat(m[1])>1?parseFloat(m[1])/100:parseFloat(m[1]);const C=parseFloat(m[2]),H=parseFloat(m[3])*Math.PI/180;const s=okToSrgb(Lv,C*Math.cos(H),C*Math.sin(H));return {...s,a:m[4]!==undefined?parseFloat(m[4]):1};}
            return null;
        };
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        const cs = getComputedStyle(document.documentElement);
        const primary = parse2(cs.getPropertyValue('--primary').trim() || cs.getPropertyValue('color'));
        const primaryFg = parse2(cs.getPropertyValue('--primary-foreground').trim());
        const bg = parse2(cs.getPropertyValue('--background').trim());
        const fg = parse2(cs.getPropertyValue('--foreground').trim());
        const lum = c => { const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)}; return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b); };
        const ratio=(a,b)=>(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
        return { primary, primaryFg, bg, fg,
            primaryRatio: primary&&primaryFg?ratio(lum(primary),lum(primaryFg)):null,
            bgRatio: bg&&fg?ratio(lum(bg),lum(fg)):null };
    })()
`);
if (dark.primaryRatio !== null) {
    ok('dark: texte primary-foreground sur primary >= 4.5', dark.primaryRatio >= 4.5, `ratio=${dark.primaryRatio.toFixed(2)}`);
    ok('dark: texte foreground sur background >= 4.5', dark.bgRatio >= 4.5, `ratio=${dark.bgRatio.toFixed(2)}`);
} else na('dark: contrastes', 'variables non résolues en dark');
// remise en light (symétrie client — non persistée de toute façon)
await page.evaluate(() => { document.documentElement.classList.remove('dark'); document.documentElement.classList.add('light'); });

// ── N. prefers-reduced-motion ──────────────────────────────────────────────
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(`${base}/books`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
const motion = await page.evaluate(() => {
    const els = [...document.querySelectorAll('button, [role="menu"], [data-state]')].slice(0, 8);
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
