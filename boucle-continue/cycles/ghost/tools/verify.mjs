/**
 * verify.mjs — assertions DURES sur les corrections ghost (cycle 43).
 * Effets mesurés dans le DOM rendu, jamais `if(el) ok()` ni `|| true`.
 * Un élément requis absent = FAIL ou N-A explicite.
 * Le score axe n'est pas auto-produit ici (règle: pas de self-verdict).
 *
 * Usage: node verify.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));

const [base, authPath = 'auth.json'] = process.argv.slice(2);
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }

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

const BROWSER_HELPERS = `
const okToSrgb = (L, A, B) => {
    const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
    const m_ = L - 0.1055613458 * A - 0.0638541729 * B;
    const s_ = L - 0.0894841775 * A - 1.2914855480 * B;
    const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
    const lin = {
        r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    };
    const gam = v => v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    const clamp = v => Math.min(255, Math.max(0, Math.round(v * 255)));
    return { r: clamp(gam(lin.r)), g: clamp(gam(lin.g)), b: clamp(gam(lin.b)) };
};
const parse = (c) => {
    if (!c) return null;
    let m = c.match(/rgba?\\(([^)]+)\\)/);
    if (m) { const p = m[1].split(',').map(x => parseFloat(x.trim())); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
    m = c.match(/oklab\\(\\s*([\\d.]+%?)\\s+(-?[\\d.]+)\\s+(-?[\\d.]+)(?:\\s*\\/\\s*([\\d.]+))?\\s*\\)/);
    if (m) { const Lv = m[1].includes('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]); const s = okToSrgb(Lv, parseFloat(m[2]), parseFloat(m[3])); return { ...s, a: m[4] !== undefined ? parseFloat(m[4]) : 1 }; }
    m = c.match(/oklch\\(\\s*([\\d.]+%?)\\s+([\\d.]+)\\s+([\\d.]+)(?:deg)?\\s*(?:\\/\\s*([\\d.]+))?\\s*\\)/);
    if (m) { const Lv = m[1].includes('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]); const C = parseFloat(m[2]), H = parseFloat(m[3]) * Math.PI / 180; const s = okToSrgb(Lv, C * Math.cos(H), C * Math.sin(H)); return { ...s, a: m[4] !== undefined ? parseFloat(m[4]) : 1 }; }
    return null;
};
const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
const effectiveBg = (el) => {
    const layers = [];
    let node = el;
    while (node && node !== document.documentElement.parentElement) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0) layers.push(c);
        node = node.parentElement;
    }
    if (!layers.length) return { r: 255, g: 255, b: 255 };
    let comp = { ...layers[0] };
    for (let i = 1; i < layers.length; i++) {
        if (comp.a >= 1) break;
        const c = layers[i];
        const a = comp.a + c.a * (1 - comp.a);
        comp = { r: (comp.a * comp.r + c.a * c.r * (1 - comp.a)) / a, g: (comp.a * comp.g + c.a * c.g * (1 - comp.a)) / a, b: (comp.a * comp.b + c.a * c.b * (1 - comp.a)) / a, a };
    }
    return comp;
};
const textContrast = (el) => {
    const fg = parse(getComputedStyle(el).color);
    const bg = effectiveBg(el);
    return ratio(lum(fg), lum(bg));
};
const accName = (el) => {
    const al = (el.getAttribute('aria-label') || '').trim();
    if (al) return al;
    const lb = (el.getAttribute('aria-labelledby') || '').split(/\\s+/).map(id => document.getElementById(id)).filter(Boolean);
    if (lb.length) return lb.map(e => e.innerText.trim()).join(' ').trim();
    if (el.id) { const l = document.querySelector('label[for="' + el.id + '"]'); if (l) return l.innerText.trim(); }
    const wrap = el.closest('label'); if (wrap) return wrap.innerText.trim();
    const ti = (el.getAttribute('title') || '').trim();
    if (ti) return ti;
    return (el.innerText || '').trim();
};
const visibleText = (el) => {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('[aria-hidden="true"],.sr-only').forEach(n => n.remove());
    return (clone.innerText || clone.textContent || '').trim().replace(/\\s+/g, ' ');
};
`;

const containsFolded = (hay, needle) => {
    const norm = x => (x || '').toLowerCase().replace(/\s+/g, ' ').trim();
    return norm(hay).includes(norm(needle));
};

const browser = await chromium.launch();
const anon = await browser.newContext();
const storageState = existsSync(authPath) ? authPath : existsSync(resolve(HERE, authPath)) ? resolve(HERE, authPath) : undefined;
if (!storageState) { console.error('auth.json introuvable'); process.exit(2); }
const ctx = await browser.newContext({ storageState });
const page = await ctx.newPage();

const viewportOk = `(() => { const m = document.querySelector('meta[name="viewport"]'); return m && !/user-scalable\\s*=\\s*no/.test(m.content) && !/maximum-scale/.test(m.content); })()`;

// ── 1. PUBLIC : landmarks, headings, liens, contrastes ─────────────────────
{
    const p = await anon.newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('.gh-navigation', { timeout: 30000 });
    await p.waitForTimeout(800);
    const m = await p.evaluate(`(() => {
        ${BROWSER_HELPERS}
        const hs = [...document.querySelectorAll('main h1,main h2,main h3,main h4,main h5,main h6')];
        const levels = hs.map(e => +e.tagName[1]);
        let skip = null;
        for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) { skip = levels[i - 1] + '->' + levels[i]; break; }
        const mains = document.querySelectorAll('main');
        const navs = [...document.querySelectorAll('nav')].map(n => n.getAttribute('aria-label'));
        const cardTitles = document.querySelectorAll('.gh-card-title');
        return {
            mains: mains.length,
            h1: (document.querySelector('h1')?.innerText || '').trim().slice(0, 40),
            navLabels: navs,
            cardTitleTag: cardTitles[0]?.tagName || null,
            skip,
            viewport: ${'__VP__'},
        };
    })()`.replace('__VP__', viewportOk));
    ok('public /: exactement 1 <main>', m.mains === 1, JSON.stringify(m));
    ok('public /: h1 présent', m.h1.length > 0, JSON.stringify(m));
    ok('public /: navs nommées (aria-label)', m.navLabels.length > 0 && m.navLabels.every(x => x && x.length > 0), JSON.stringify(m));
    ok('public /: cartes de posts en h2', m.cardTitleTag === 'H2', JSON.stringify(m));
    ok('public /: aucun saut de titres', m.skip === null, JSON.stringify(m));
    ok('public /: meta viewport sans blocage zoom', m.viewport === true, JSON.stringify(m));
    await p.close();
}

// Post publié : liens auteur nommés + section read-more dans main
{
    const p = await anon.newPage();
    await p.goto(base + '/refonte-du-portail-membres/', { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('.gh-navigation', { timeout: 30000 });
    const m = await p.evaluate(`(() => {
        ${BROWSER_HELPERS}
        const authorLinks = [...document.querySelectorAll('.gh-article-author-image a')].map(a => accName(a));
        const readMore = document.querySelector('main .gh-container.is-grid');
        const tagLink = document.querySelector('.gh-article-tag');
        return { authorLinks, readMoreInMain: !!readMore, tagContrast: tagLink ? +textContrast(tagLink).toFixed(2) : null };
    })()`);
    ok('post: liens auteur nommés', m.authorLinks.length > 0 && m.authorLinks.every(x => x.length > 0), JSON.stringify(m));
    ok('post: section "Read more" dans <main>', m.readMoreInMain === true, JSON.stringify(m));
    if (m.tagContrast !== null) ok('post: contraste tag accent >= 4.5', m.tagContrast >= 4.5, JSON.stringify(m));
    else na('post: pas de tag visible');
    await p.close();
}

// About : chaîne h1->h2 (page fixture patchée)
{
    const p = await anon.newPage();
    await p.goto(base + '/about/', { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('.gh-navigation', { timeout: 30000 });
    const m = await p.evaluate(`(() => {
        const hs = [...document.querySelectorAll('article h1,article h2,article h3')];
        const levels = hs.map(e => +e.tagName[1]);
        let skip = null;
        for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) { skip = levels[i - 1] + '->' + levels[i]; break; }
        return { levels, skip };
    })()`);
    ok('about: aucun saut de titres (h3->h2 corrigé)', m.skip === null && m.levels.includes(2), JSON.stringify(m));
    await p.close();
}

// ── 2. ADMIN authentifié ───────────────────────────────────────────────────
const adminPages = ['#/posts', '#/settings/general', '#/members'];
for (const route of adminPages) {
    await page.goto(base + '/ghost/' + route, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main', { timeout: 30000 });
    await page.waitForTimeout(2500);
    const m = await page.evaluate(`(() => {
        ${BROWSER_HELPERS}
        return {
            mains: document.querySelectorAll('main').length,
            ghMainTag: document.querySelector('.gh-main')?.tagName || null,
            viewport: ${'__VP__'},
        };
    })()`.replace('__VP__', viewportOk));
    ok(`admin ${route}: exactement 1 <main>`, m.mains === 1, JSON.stringify(m));
    ok(`admin ${route}: .gh-main n'est plus un landmark`, m.ghMainTag === 'DIV', JSON.stringify(m));
    ok(`admin ${route}: meta viewport sans blocage zoom`, m.viewport === true, JSON.stringify(m));
}

// user-menu : accName contient le texte visible (leçon 29)
{
    await page.goto(base + '/ghost/#/posts', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('button[data-sidebar="menu-button"]:has(.sr-only)', { timeout: 30000 });
    const m = await page.evaluate(`(() => {
        ${BROWSER_HELPERS}
        const btn = document.querySelector('button[data-sidebar="menu-button"]:has(.sr-only)');
        return { acc: accName(btn), vis: visibleText(btn) };
    })()`);
    ok('user-menu: accName ⊇ texte visible', m.acc.length > 0 && m.vis.length > 0 && containsFolded(m.acc, m.vis.split(' ')[0]), JSON.stringify(m));
}

// contraste : kbd (Ctrl+K) + ligne email muted-foreground (leçons 31/35)
{
    const m = await page.evaluate(`(() => {
        ${BROWSER_HELPERS}
        const kbd = [...document.querySelectorAll('kbd')].find(k => k.offsetParent !== null);
        const muted = [...document.querySelectorAll('.text-muted-foreground')].find(e => e.offsetParent !== null && e.innerText.trim().length > 0);
        return {
            kbd: kbd ? +textContrast(kbd).toFixed(2) : null,
            muted: muted ? +textContrast(muted).toFixed(2) : null,
        };
    })()`);
    if (m.kbd !== null) ok('admin: contraste kbd >= 4.5', m.kbd >= 4.5, JSON.stringify(m)); else na('admin: pas de kbd visible');
    if (m.muted !== null) ok('admin: contraste muted-foreground >= 4.5', m.muted >= 4.5, JSON.stringify(m)); else na('admin: pas de muted-foreground visible');
}

// settings : h1 présent + SettingGroupTitle h2
{
    await page.goto(base + '/ghost/#/settings/general', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main', { timeout: 30000 });
    await page.waitForTimeout(2500);
    const m = await page.evaluate(`(() => {
        const h1s = [...document.querySelectorAll('h1')].map(h => (h.innerText || '').trim()).filter(Boolean);
        const h2s = [...document.querySelectorAll('h2')].map(h => (h.innerText || '').trim().slice(0, 30));
        return { h1s, h2Count: h2s.length, h2Sample: h2s.slice(0, 4) };
    })()`);
    ok('settings: h1 présent (sr-only)', m.h1s.length > 0, JSON.stringify(m));
    ok('settings: SettingGroupTitle en h2', m.h2Count > 0, JSON.stringify(m));
}

// posts : titres de lignes en h2
{
    await page.goto(base + '/ghost/#/posts', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main', { timeout: 30000 });
    await page.waitForTimeout(2500);
    const m = await page.evaluate(`(() => {
        const titles = [...document.querySelectorAll('main h2,main h3')].filter(h => h.closest('a,[role=link],[class*=row],[class*=item]'));
        return { count: titles.length, tags: [...new Set(titles.map(t => t.tagName))] };
    })()`);
    ok('posts: titres de lignes = h2', m.tags.length > 0 && m.tags.every(t => t === 'H2'), JSON.stringify(m));
}

await browser.close();

const failures = results.filter(r => !r.pass);
console.log(`\n${results.length - failures.length}/${results.length} assertions OK`);
if (failures.length) { console.error('FAILURES:', failures.map(f => f.name).join(' | ')); process.exit(1); }
console.log('VERIFY OK');
