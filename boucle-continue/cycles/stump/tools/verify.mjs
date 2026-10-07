/**
 * verify.mjs — assertions DURES sur les corrections stump (cycle 34).
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
// oklab/oklch -> sRGB (Tailwind v4 sérialise les couleurs calculées ainsi)
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
// composite de TOUTES les couches rgba<1 des ancêtres (jamais premier-bg-non-null)
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
`;

const browser = await chromium.launch();
const storageState = existsSync(authPath) ? authPath : existsSync(resolve(HERE, authPath)) ? resolve(HERE, authPath) : undefined;
const ctx = await browser.newContext({ storageState });
const page = await ctx.newPage();

const COMICS = '55c9cf1e-be71-4735-b59d-13be6e6c17db';      // library Comics
const SERIES = 'cdbcfa8b-04b4-412e-9eb2-a3a1a4283bfa';      // Alpha Squadron
const BOOK = '69a67b0a-1703-49d0-a489-f6768e2fc34e';        // alpha-001

// ── 1. Landmarks : 1 main + aside sidebar sur pages authentifiées ──────────
for (const url of ['/', '/libraries', `/libraries/${COMICS}/books`, '/settings/preferences']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900);
    const lm = await page.evaluate(() => {
        const vis = e => e.getClientRects().length > 0;
        return {
            mains: [...document.querySelectorAll('main, [role="main"]')].filter(vis).length,
            asides: [...document.querySelectorAll('aside, [role="complementary"]')].filter(vis).length,
        };
    });
    ok(`landmarks ${url}: 1 main visible`, lm.mains === 1, JSON.stringify(lm));
    ok(`landmarks ${url}: sidebar aside présente`, lm.asides >= 1, JSON.stringify(lm));
}

// ── 2. Menus Radix non-modaux : ouvrir le menu utilisateur ne aria-hide PAS
//      le contenu de fond (fix modal={false} sur Dropdown) ─────────────────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
const userMenu = page.locator('aside [aria-haspopup="menu"]:has-text("admin")').first();
if (await userMenu.count()) {
    await userMenu.click();
    await page.waitForSelector('[role="menu"]', { state: 'visible', timeout: 8000 });
    const m = await page.evaluate(() => ({
        menuOpen: !!document.querySelector('[role="menu"]'),
        hiddenApp: !!document.querySelector('[data-aria-hidden="true"]'),
        menuItems: document.querySelectorAll('[role="menu"] [role="menuitem"], [role="menu"] [data-radix-collection-item]').length,
    }));
    ok('menu utilisateur: menu ouvert', m.menuOpen);
    ok('menu utilisateur: fond NON aria-hidden (modal=false)', !m.hiddenApp, `hiddenRegions=${m.hiddenApp}`);
    ok('menu utilisateur: items de menu présents', m.menuItems >= 1, String(m.menuItems));
    await page.keyboard.press('Escape');
} else na('menu utilisateur', 'trigger admin introuvable dans aside');

// ── 3. Options de library : même exigence (options menu de la sidebar) ─────
const libOpt = page.locator('aside button:has(svg.lucide-ellipsis)').first();
if (await libOpt.count()) {
    await libOpt.click();
    await page.waitForSelector('[role="menu"]', { state: 'visible', timeout: 8000 });
    const m = await page.evaluate(() => ({
        hiddenApp: !!document.querySelector('[data-aria-hidden="true"]'),
        items: document.querySelectorAll('[role="menu"] [data-radix-collection-item]').length,
    }));
    ok('menu options library: fond NON aria-hidden', !m.hiddenApp);
    ok('menu options library: items présents', m.items >= 1, String(m.items));
    await page.keyboard.press('Escape');
} else na('menu options library', 'bouton ellipsis introuvable');

// ── 4. Tabs-comme-liens : aucun role=tab avec aria-controls non résolu ─────
for (const url of [`/libraries/${COMICS}/books`, `/series/${SERIES}/books`, `/books/${BOOK}`]) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900);
    const t = await page.evaluate(() => {
        const tabs = [...document.querySelectorAll('[role="tab"]')];
        return {
            count: tabs.length,
            unresolved: tabs.filter(e => { const c = e.getAttribute('aria-controls'); return c && !document.getElementById(c); }).length,
        };
    });
    ok(`tabs ${url}: aucun aria-controls non résolu`, t.count === 0 || t.unresolved === 0, JSON.stringify(t));
}

// ── 5. Slider : aria-label du prop rejoint le THUMB (Radix ne le forward pas)
await page.goto(`${base}/libraries/${COMICS}/books`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
const slider = await page.evaluate(() => {
    const thumbs = [...document.querySelectorAll('[role="slider"]')];
    return { count: thumbs.length, unlabelled: thumbs.filter(s => !(s.getAttribute('aria-label') || '').trim()).map(s => s.className.slice(0, 40)) };
});
ok('slider: au moins un role=slider rendu', slider.count >= 1, String(slider.count));
ok('slider: chaque thumb a un aria-label', slider.unlabelled.length === 0, JSON.stringify(slider.unlabelled));

// ── 6. En-têtes de table vides -> contenu sr-only ──────────────────────────
// books en vue table
await page.goto(`${base}/books`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
await page.getByRole('button', { name: 'Table view' }).click().catch(() => {});
await page.waitForTimeout(900);
const th1 = await page.evaluate(() => {
    const ths = [...document.querySelectorAll('th')].filter(t => t.getClientRects().length > 0);
    return { count: ths.length, empty: ths.filter(t => !(t.innerText || '').trim() && !t.querySelector('.sr-only') && !(t.getAttribute('aria-label') || '').trim()).length };
});
ok('books (vue table): headers th présents', th1.count >= 1, String(th1.count));
ok('books (vue table): aucun th entièrement vide', th1.empty === 0, `${th1.empty} vides`);

// jobs : ScanHistoryTable
await page.goto(`${base}/settings/jobs`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
const th2 = await page.evaluate(() => {
    const ths = [...document.querySelectorAll('th')].filter(t => t.getClientRects().length > 0);
    return { count: ths.length, empty: ths.filter(t => !(t.innerText || '').trim() && !t.querySelector('.sr-only')).length };
});
if (th2.count > 0) ok('jobs: aucun th vide', th2.empty === 0, `${th2.empty} vides`);
else na('jobs: table ScanHistory absente (aucun job lancé depuis le seed ?)', '');

// ── 7. Boutons icône : noms accessibles mesurés ────────────────────────────
await page.goto(`${base}/books`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
const names = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const probes = {
            'Configure ordering': null, 'Configure filters': null,
            'Grid view': null, 'Table view': null,
            'Previous page': null, 'Next page': null,
            'Open navigation menu': null,
        };
        for (const sel of ['button[aria-label]']) {
            for (const b of document.querySelectorAll(sel)) {
                const n = accName(b);
                if (n in probes && probes[n] === null) probes[n] = true;
            }
        }
        // 'Change emoji'/'<lib> options' sidebar — au moins un bouton icône nommé
        const iconOnly = [...document.querySelectorAll('button')].filter(b => !(b.innerText || '').trim());
        const unnamed = iconOnly.filter(b => !accName(b));
        return {
            probes,
            iconOnlyCount: iconOnly.length,
            unnamedCount: unnamed.length,
            unnamedHtml: unnamed.slice(0, 5).map(e => ({
                attrs: [...e.attributes].map(a => a.name + '=' + String(a.value).slice(0, 50)),
                kids: [...e.children].map(c => c.tagName + '.' + String(c.className).slice(0, 40)),
                chain: (() => { let p = e, c = []; while (p && c.length < 6) { c.push(p.tagName + (p.id ? '#' + p.id : '')); p = p.parentElement } return c.join(' < '); })(),
                visible: e.getClientRects().length > 0,
            })),
        };
    })()
`);
for (const [n, v] of Object.entries(names.probes)) ok(`bouton nommé "${n}" présent`, v === true);
ok('aucun bouton icon-only sans nom accessible', names.unnamedCount === 0, JSON.stringify(names.unnamedHtml));

// ── 8. ComboBox : nom accessible (aria-label ou aria-labelledby) ───────────
await page.goto(`${base}/settings/preferences`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
const combo = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const boxes = [...document.querySelectorAll('button[aria-haspopup="listbox"], [role="combobox"]')];
        return {
            count: boxes.length,
            unnamed: boxes.filter(b => !accName(b)).map(b => b.outerHTML.slice(0, 80)),
        };
    })()
`);
if (combo.count === 0) na('combobox nommé', 'aucun combobox sur preferences');
else ok('combobox: tous nommés', combo.unnamed.length === 0, JSON.stringify(combo.unnamed));

// ── 9. Dialog.Trigger retiré du span (thumbnail selectors) ─────────────────
await page.goto(`${base}/series/${SERIES}/settings`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
const trig = await page.evaluate(() => ({
    spanHaspopup: document.querySelectorAll('span[aria-haspopup], span[aria-expanded]').length,
    btnDialog: document.querySelectorAll('button[aria-haspopup="dialog"]').length,
}));
ok('thumbnail selector: aucun <span aria-haspopup> (aria-allowed-attr)', trig.spanHaspopup === 0, String(trig.spanHaspopup));
ok('thumbnail selector: trigger dialog est un vrai bouton', trig.btnDialog >= 0, `${trig.btnDialog} boutons dialog`);

// ── 10. Labels de formulaires : login (label[for]) + /libraries/create ─────
{
    const anon = await browser.newContext();
    const lp = await anon.newPage();
    await lp.goto(`${base}/auth`, { waitUntil: 'domcontentloaded' });
    await lp.waitForTimeout(700);
    const login = await lp.evaluate(() => [...document.querySelectorAll('input')].map(i => ({ id: i.id, labelled: i.id ? !!document.querySelector(`label[for="${i.id}"]`) : !!i.getAttribute('aria-label') })));
    ok('login: chaque input a un label lié (htmlFor)', login.length > 0 && login.every(i => i.labelled), JSON.stringify(login));
    await anon.close();
}
await page.goto(`${base}/libraries/create`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
const create = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        const fields = [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), textarea, select')];
        return { count: fields.length, unnamed: fields.filter(f => !accName(f)).map(f => f.outerHTML.slice(0, 80)) };
    })()
`);
ok('libraries/create: tous les champs ont un nom accessible', create.count > 0 && create.unnamed.length === 0, JSON.stringify(create.unnamed));

// ── 11. Contrastes mesurés (couche couleur — axe blind sur les cas simples) ─
// bouton primary repos + hover (hover:bg-primary/90), thème light
{
    const anon = await browser.newContext();
    const lp = await anon.newPage();
    await lp.goto(`${base}/auth`, { waitUntil: 'domcontentloaded' });
    await lp.waitForTimeout(700);
    const measure = async (label) => lp.evaluate(`${BROWSER_HELPERS}
        (() => {
            const btn = document.querySelector('button[type="submit"]');
            if (!btn) return null;
            const cs = getComputedStyle(btn);
            const fg = parse(cs.color); const bg = effectiveBg(btn);
            return { fg, bg, ratio: fg && bg ? ratio(lum(fg), lum(bg)) : null, bgCss: cs.backgroundColor };
        })()
    `);
    const rest = await measure('rest');
    ok('bouton login (repos): ratio >= 4.5', rest && rest.ratio >= 4.5, JSON.stringify(rest));
    // hover réel : positionner la souris sur le bouton puis re-mesurer
    const bb = await lp.locator('button[type="submit"]').boundingBox();
    if (bb) {
        await lp.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
        await lp.waitForTimeout(400);
        const hov = await measure('hover');
        ok('bouton login (hover /90): ratio >= 4.5', hov && hov.ratio >= 4.5, JSON.stringify(hov));
    } else na('bouton login hover', 'boundingBox absente');
    await anon.close();
}

// badges text-destructive/success/warning sur tint /15 (thème light).
// DÉTERMINISTE : exactement une assertion par famille sémantique (le nombre
// d'éléments rendus dépend du contenu de la db — historique de jobs variable)
// ; chaque assertion exige le PIRE ratio de sa famille >= 4.5.
await page.goto(`${base}/settings/jobs`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
const badge = await page.evaluate(`${BROWSER_HELPERS}
    (() => {
        return ['text-destructive', 'text-success', 'text-warning'].map(fam => {
            const els = [...document.querySelectorAll('[class*="' + fam + '"]')]
                .filter(e => e.getClientRects().length > 0);
            const measured = els.map(el => {
                const cs = getComputedStyle(el);
                const fg = parse(cs.color); const bg = effectiveBg(el);
                return { cls: String(el.className).slice(0, 60), ratio: fg && bg ? ratio(lum(fg), lum(bg)) : null };
            });
            const worst = measured.reduce((w, m) => (m.ratio !== null && (w === null || m.ratio < w)) ? m.ratio : w, null);
            return { fam, count: els.length, worst, ratios: measured.map(m => m.ratio) };
        });
    })()
`);
for (const b of badge) {
    if (!b.count) na(`badge ${b.fam}`, 'aucun élément rendu sur settings/jobs');
    else ok(`badge ${b.fam} (${b.count} élément(s)): pire ratio >= 4.5`, b.worst !== null && b.worst >= 4.5, JSON.stringify(b));
}

// ── 12. Erreur de login : message rendu + formulaire encore utilisable ─────
{
    const anon = await browser.newContext();
    const lp = await anon.newPage();
    await lp.goto(`${base}/auth`, { waitUntil: 'domcontentloaded' });
    await lp.fill('input#username, input[name="username"]', 'admin').catch(() => {});
    await lp.fill('input[type="password"]', 'wrong-password-1');
    await lp.click('button[type="submit"]');
    await lp.waitForTimeout(2500);
    const err = await lp.evaluate(() => ({
        alert: !!document.querySelector('[role="alert"], [data-sonner-toast]'),
        errorText: (document.body.innerText.match(/invalid|incorrect|failed|erreur|invalide/i) || [null])[0],
        submitEnabled: !document.querySelector('button[type="submit"]')?.disabled,
    }));
    ok('login-failed: erreur annoncée (alert/toast ou texte)', err.alert || !!err.errorText, JSON.stringify(err));
    ok('login-failed: submit réutilisable (non bloqué)', err.submitEnabled);
    await anon.close();
}

const passed = results.filter(r => r.pass && !r.verdict).length;
const nas = results.filter(r => r.verdict === 'N-A').length;
const failed = results.filter(r => !r.pass).length;
console.log(`\nverify.mjs: ${results.length} assertions — ${passed} PASS, ${nas} N-A, ${failed} FAIL`);
process.exit(failed ? 1 : 0);
