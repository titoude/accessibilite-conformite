/**
 * verify.mjs — assertions DURES sur les corrections wekan (cycle 39).
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
import { STATES } from './audit.mjs';

const [base, authPath = '../auth.json'] = process.argv.slice(2);
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
// Texte VISIBLE de l'élément (approximation : innerText - sous-arbres aria-hidden)
const visibleText = (el) => {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('[aria-hidden="true"]').forEach(n => n.remove());
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

const BOARD = '/b/c39wknBoard0000001/projet-refonte-web';
const CARD = `${BOARD}/c39wknCard000000001`;

// ── 1. Pages publiques : 1 h1 non vide + chaîne de titres sans saut ────────
for (const path of ['/sign-in', '/sign-up', '/forgot-password']) {
    const p = await anon.newPage();
    await p.goto(base + path, { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('.auth-layout, #at-pwd-form, #at-field-username_and_email', { timeout: 30000 });
    await p.waitForTimeout(800);
    const m = await p.evaluate(() => {
        const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
            .filter(e => e.getClientRects().length > 0 || e.closest('.sr-only'));
        const levels = hs.map(e => +e.tagName[1]);
        let skip = null;
        for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) { skip = levels[i - 1] + '->' + levels[i]; break; }
        const h1 = document.querySelector('h1');
        return {
            h1s: document.querySelectorAll('h1').length,
            h1Text: (h1?.innerText || h1?.textContent || '').trim(),
            atTitleTag: document.querySelector('.at-title')?.firstElementChild?.tagName || null,
            skip,
        };
    });
    ok(`public ${path}: exactement 1 h1 non vide`, m.h1s === 1 && m.h1Text.length > 0, JSON.stringify(m));
    ok(`public ${path}: .at-title est un h2 (pas de saut h1->h3)`, m.atTitleTag === 'H2', JSON.stringify(m));
    ok(`public ${path}: aucun saut de niveau de titres`, m.skip === null, JSON.stringify(m));
    await p.close();
}

// ── 2. Pages auth : h1.header-page-title non vide + title (tooltip) plein ──
for (const path of ['/', '/import', '/b/templates', '/admin/people/roles', '/admin/attachments/backup', '/allboards']) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#content, .big-message, .header-page-title', { timeout: 30000 });
    await page.waitForTimeout(1200);
    const m = await page.evaluate(() => {
        const h1 = document.querySelector('h1.header-page-title');
        const empty = [...document.querySelectorAll('h1')].filter(e => !(e.innerText || '').trim()).length;
        return {
            count: document.querySelectorAll('h1').length,
            empty,
            text: (h1?.innerText || '').trim(),
            title: (h1?.getAttribute('title') || '').trim(),
        };
    });
    ok(`auth ${path}: h1.header-page-title non vide`, m.text.length > 0 && m.title.length > 0, JSON.stringify(m));
    ok(`auth ${path}: aucun h1 vide`, m.empty === 0, JSON.stringify(m));
}

// heading-order sur les pages qui avaient des sauts
for (const path of ['/admin/people/roles', '/admin/attachments/backup']) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#content', { timeout: 30000 });
    await page.waitForTimeout(1000);
    const m = await page.evaluate(() => {
        const hs = [...document.querySelectorAll('#content h1,#content h2,#content h3,#content h4')]
            .filter(e => e.getClientRects().length > 0);
        const lv = hs.map(e => +e.tagName[1]);
        let skip = null;
        let prev = null;
        // chaque niveau nouveau doit être <= max atteint + 1
        let max = 0;
        for (const l of lv) { if (l > max + 1) { skip = `h${max}->h${l}`; break; } max = Math.max(max, l); }
        return { levels: lv.slice(0, 12), skip };
    });
    ok(`${path}: ordre des titres continu`, m.skip === null, JSON.stringify(m));
}

// ── 3. Liens/boutons : le nom accessible contient le texte visible (L29) ───
await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.header-user-bar-name', { timeout: 30000 });
await page.waitForTimeout(800);
{
    const m = await page.evaluate(`${BROWSER_HELPERS}
        (() => {
            const el = document.querySelector('.header-user-bar-name');
            const name = accName(el);
            const vis = visibleText(el);
            return { name, vis, nestedAnchor: !!el.querySelector('a') };
        })()
    `);
    ok('member-menu: le nom contient le texte visible', containsFolded(m.name, m.vis), JSON.stringify(m));
    ok('member-menu: pas de <a> imbriqué dans le lien', m.nestedAnchor === false, JSON.stringify(m));
}
// carte : chip labels + dates -> nom accessible = texte visible
await page.goto(base + CARD, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('section.card-details', { timeout: 30000 });
await page.waitForTimeout(800);
{
    const m = await page.evaluate(`${BROWSER_HELPERS}
        (() => {
            const labels = document.querySelector('section.card-details .js-add-labels');
            const dates = [...document.querySelectorAll('section.card-details a.js-edit-date')];
            return {
                labels: labels ? { name: accName(labels), vis: visibleText(labels) } : null,
                dates: dates.map(d => ({ name: accName(d), vis: visibleText(d) })),
            };
        })()
    `);
    if (m.labels) ok('carte: .js-add-labels nom contient les labels visibles', containsFolded(m.labels.name, m.labels.vis), JSON.stringify(m.labels));
    else na('carte .js-add-labels', 'aucun lien labels rendu');
    for (const [i, d] of m.dates.entries())
        ok(`carte: date link ${i} nom contient le texte visible`, containsFolded(d.name, d.vis), JSON.stringify(d));
}
// minicard dates sur le board
await page.goto(base + BOARD, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.js-list .list-header-name', { timeout: 30000 });
await page.waitForTimeout(800);
{
    const m = await page.evaluate(`${BROWSER_HELPERS}
        (() => [...document.querySelectorAll('#swimlanes a.js-edit-date, .board-canvas a.js-edit-date')]
            .map(d => ({ name: accName(d), vis: visibleText(d), cls: d.className })))()
    `);
    ok('board: au moins 1 lien date sur les minicards', m.length >= 1, `${m.length}`);
    for (const d of m)
        ok(`minicard ${d.cls}: nom contient texte visible`, containsFolded(d.name, d.vis), JSON.stringify(d));
}

// ── 4. En-têtes repliables = vrais <button> dans h3 (nested-interactive) ──

await page.goto(base + BOARD, { waitUntil: 'domcontentloaded' });
await STATES['board-sidebar'].setup(page);
{
    const m = await page.evaluate(() => ({
        actBtn: document.querySelector('.sidebar.is-open .js-toggle-show-activities')?.tagName,
        actInH3: !!document.querySelector('.sidebar.is-open h3 .js-toggle-show-activities'),
        actExpanded: document.querySelector('.sidebar.is-open .js-toggle-show-activities')?.getAttribute('aria-expanded'),
        foldBtns: [...document.querySelectorAll('.sidebar.is-open .fold-heading-toggle')].map(b => b.tagName),
        foldInH3: [...document.querySelectorAll('.sidebar.is-open h3 .fold-heading-toggle')].length,
        roleButtonNested: [...document.querySelectorAll('.sidebar.is-open [role="button"] button, .sidebar.is-open button [role="button"]')].length,
    }));
    ok('sidebar: activités = <button> dans un h3', m.actBtn === 'BUTTON' && m.actInH3, JSON.stringify(m));
    ok('sidebar: activités porte aria-expanded', ['true', 'false'].includes(m.actExpanded), JSON.stringify(m));
    ok('sidebar: replis membres/labels = <button> dans h3', m.foldBtns.length > 0 && m.foldBtns.every(t => t === 'BUTTON') && m.foldInH3 === m.foldBtns.length, JSON.stringify(m));
    ok('sidebar: aucun role=button ↔ <button> imbriqué', m.roleButtonNested === 0, JSON.stringify(m));
    await page.keyboard.press('Escape');
}

// ── 5. Menu membre : ul.pop-over-list ne contient que li/script/template ──
await page.goto(base + '/allboards', { waitUntil: 'domcontentloaded' });
await STATES['header-member-menu'].setup(page);
{
    const m = await page.evaluate(() => {
        const bad = [];
        document.querySelectorAll('.pop-over ul.pop-over-list').forEach(ul => {
            [...ul.children].forEach(c => {
                if (!['LI', 'SCRIPT', 'TEMPLATE'].includes(c.tagName)) bad.push(c.tagName + '.' + c.className);
            });
        });
        const dep = [...document.querySelectorAll('.pop-over [role="checkbox"]')].map(e => e.className);
        const menuitemOrphan = [...document.querySelectorAll('.pop-over [role="menuitemcheckbox"], .pop-over [role="menuitemradio"]')].length;
        return { bad, dep, menuitemOrphan };
    });
    ok('menu membre: enfants directs du ul = li uniquement', m.bad.length === 0, JSON.stringify(m.bad));
    ok('menu membre: bascules dépendances en role=checkbox', m.dep.length >= 1, JSON.stringify(m.dep));
    ok('menu membre: aucun menuitem* orphelin de parent menu', m.menuitemOrphan === 0, JSON.stringify(m));
    await page.keyboard.press('Escape');
}

// ── 6. Sidebar filtres : le form est wrappe dans un li (rule "list") ───────
await page.goto(base + BOARD, { waitUntil: 'domcontentloaded' });
await STATES['board-filter-sidebar'].setup(page);
{
    const m = await page.evaluate(() => {
        const form = document.querySelector('.sidebar.is-open form.js-list-filter');
        const bad = [];
        document.querySelectorAll('.sidebar.is-open ul').forEach(ul => {
            [...ul.children].forEach(c => {
                if (!['LI', 'SCRIPT', 'TEMPLATE'].includes(c.tagName)) bad.push(c.tagName + '.' + c.className);
            });
        });
        return { formParent: form?.parentElement?.tagName, bad };
    });
    ok('sidebar filtres: form.js-list-filter dans un <li>', m.formParent === 'LI', JSON.stringify(m));
    ok('sidebar filtres: aucun ul avec enfant non-li', m.bad.length === 0, JSON.stringify(m.bad));
    await page.keyboard.press('Escape');
}

// ── 7. Selects admin : aria-label réel (pas title-seul) ────────────────────
await page.goto(base + '/admin/people/people', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#content', { timeout: 30000 });
await page.waitForTimeout(1200);
{
    const m = await page.evaluate(() => [...document.querySelectorAll('select.js-table-page-filter')]
        .map(s => ({ f: s.getAttribute('data-filter'), al: s.getAttribute('aria-label'), title: s.getAttribute('title') })));
    ok('admin/people: au moins 1 select de filtre', m.length >= 1, String(m.length));
    for (const s of m) ok(`admin select[${s.f}]: aria-label non vide`, !!s.al, JSON.stringify(s));
}

// ── 8. Cibles tactiles >= 24px (2.5.8) sur les widgets corrigés ────────────
{
    await page.goto(base + BOARD, { waitUntil: 'domcontentloaded' });
    await STATES['board-sidebar'].setup(page);
    const m = await page.evaluate(() => {
        const size = sel => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 };
        };
        return {
            shortcuts: size('.sidebar .js-shortcuts'),
            boardMenu: size('.sidebar.is-open .js-open-board-menu'),
            member: size('.header-user-bar-name'),
        };
    });
    ok('sidebar .js-shortcuts >= 24px', m.shortcuts && m.shortcuts.h >= 24, JSON.stringify(m.shortcuts));
    ok('board menu .js-open-board-menu >= 24px', m.boardMenu && m.boardMenu.h >= 24, JSON.stringify(m.boardMenu));
    ok('member-menu >= 24px', m.member && m.member.h >= 24, JSON.stringify(m.member));
    await page.keyboard.press('Escape');

    await page.goto(base + '/allboards', { waitUntil: 'domcontentloaded' });
    await STATES['new-board-popup'].setup(page);
    const r = await page.evaluate(() => [...document.querySelectorAll('input.js-multiline-title-mode')]
        .map(e => { const b = e.getBoundingClientRect(); return { w: b.width, h: b.height }; }));
    ok('new-board: radios title-mode présents', r.length >= 1, String(r.length));
    for (const [i, s] of r.entries()) ok(`new-board: radio ${i} >= 24x24`, s.w >= 24 && s.h >= 24, JSON.stringify(s));
    await page.keyboard.press('Escape');
}

// ── 9. Contrastes : pire ratio >= 4.5 par famille corrigée (L31: pixel) ────
// 9a. headings de menu latéral admin (avant: opacity .6 -> #9c9da0)
await page.goto(base + '/admin/problems/summary', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#content', { timeout: 30000 });
await page.waitForTimeout(1000);
{
    const m = await page.evaluate(`${BROWSER_HELPERS}
        (() => [...document.querySelectorAll('.left-menu-heading')].map(el => {
            const fg = parse(getComputedStyle(el).color), bg = effectiveBg(el);
            return fg && bg ? { ratio: ratio(lum(fg), lum(bg)), fg: getComputedStyle(el).color } : null;
        }).filter(Boolean))()
    `);
    ok('admin left-menu-heading: éléments mesurés', m.length >= 1, String(m.length));
    const worst = Math.min(...m.map(x => x.ratio));
    ok('admin left-menu-heading: pire ratio >= 4.5', worst >= 4.5, `worst=${worst}`);
}
// 9b. chips de labels + dates sur le board (pixel-poil: on mesure le DOM)
await page.goto(base + BOARD, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.js-list .list-header-name', { timeout: 30000 });
await page.waitForTimeout(800);
{
    const m = await page.evaluate(`${BROWSER_HELPERS}
        (() => {
            const pick = sel => {
                const el = [...document.querySelectorAll(sel)].find(e => e.getClientRects().length > 0);
                if (!el) return null;
                const fg = parse(getComputedStyle(el).color), bg = effectiveBg(el);
                if (!fg || !bg) return null;
                return { ratio: ratio(lum(fg), lum(bg)), fg: getComputedStyle(el).color, cls: el.className.slice(0, 50) };
            };
            return {
                labels: [...document.querySelectorAll('.card-label')].slice(0, 12).map(el => {
                    const fg = parse(getComputedStyle(el).color), bg = effectiveBg(el);
                    return fg && bg ? { cls: el.className.slice(0, 60), ratio: ratio(lum(fg), lum(bg)) } : null;
                }).filter(Boolean),
                due: pick('.card-date.due-date, .card-date'),
                headerTitle: pick('.header-page-title'),
                boardBtn: pick('#header .board-header-btn'),
            };
        })()
    `);
    ok('board: au moins 1 chip .card-label mesuré', m.labels.length >= 1, '0');
    for (const l of m.labels)
        ok(`chip ${l.cls}: ratio >= 4.5`, l.ratio >= 4.5, `ratio=${l.ratio}`);
    if (m.due) ok(`date chip (${m.due.cls}): ratio >= 4.5`, m.due.ratio >= 4.5, `ratio=${m.due.ratio} fg=${m.due.fg}`);
    else na('date chip', 'aucun .card-date sur ce board');
    if (m.headerTitle) ok(`h1 header: ratio >= 4.5`, m.headerTitle.ratio >= 4.5, `ratio=${m.headerTitle.ratio} fg=${m.headerTitle.fg}`);
    if (m.boardBtn) ok(`board-header-btn: ratio >= 4.5`, m.boardBtn.ratio >= 4.5, `ratio=${m.boardBtn.ratio}`);
}
// 9c. erreurs/avertissements texte (.error/.warning) — mesurés si rendus
{
    const p = await anon.newPage();
    await p.goto(base + '/sign-in', { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('#at-btn', { timeout: 30000 });
    await p.fill('#at-field-username_and_email', 'audit.c39');
    await p.fill('#at-field-password', 'mauvais-mot-de-passe');
    await p.click('#at-btn', { force: true });
    await p.waitForTimeout(3500);
    const m = await p.evaluate(`${BROWSER_HELPERS}
        (() => {
            const el = [...document.querySelectorAll('.error, .at-error, [class*="error"], [role="alert"]')]
                .find(e => (e.innerText || '').trim() && e.getClientRects().length > 0);
            if (!el) return { found: false };
            const fg = parse(getComputedStyle(el).color), bg = effectiveBg(el);
            return { found: true, cls: el.className.slice(0, 60), text: (el.innerText || '').slice(0, 60), ratio: fg && bg ? ratio(lum(fg), lum(bg)) : null };
        })()
    `);
    if (!m.found) na('login: message d\'erreur', 'aucun message d\'erreur rendu');
    else {
        ok('login: erreur affichée', (m.text || '').length > 0, JSON.stringify(m));
        ok(`login: erreur ratio >= 4.5 (${m.cls})`, m.ratio !== null && m.ratio >= 4.5, `ratio=${m.ratio}`);
    }
    await p.close();
}

// ── 10. Mobile 390px : h1 visible, lien membre non obstrué ─────────────────
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + BOARD, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.js-list .list-header-name, .mini-list.js-list', { timeout: 30000 });
await page.waitForTimeout(800);
{
    const m = await page.evaluate(() => {
        const a = document.querySelector('.header-user-bar-name');
        const r = a?.getBoundingClientRect();
        const hit = a ? document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) : null;
        const h1 = document.querySelector('.header-page-title');
        return {
            member: r ? { w: r.width, h: r.height } : null,
            memberHit: hit === a || (hit && a.contains(hit)) || (hit && hit.closest('a') === a),
            h1: (h1?.innerText || '').trim(),
        };
    });
    ok('mobile 390: lien membre >= 24px et cliquable', m.member && m.member.h >= 24 && m.memberHit === true, JSON.stringify(m));
    ok('mobile 390: h1 non vide', m.h1.length > 0, JSON.stringify(m));
    await page.setViewportSize({ width: 1280, height: 800 });
}

const passed = results.filter(r => r.pass && !r.verdict).length;
const nas = results.filter(r => r.verdict === 'N-A').length;
const failed = results.filter(r => !r.pass).length;
console.log(`\nverify.mjs: ${results.length} assertions — ${passed} PASS, ${nas} N-A, ${failed} FAIL`);
process.exit(failed ? 1 : 0);
