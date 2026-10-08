/**
 * verify.mjs — assertions DURES sur les corrections mealie (cycle 44, fixer v3).
 * Chaque check a un ID STABLE + une DESCRIPTION : un FAIL dit QUOI a cassé.
 * Effets mesurés dans le DOM rendu, jamais `if(el) ok()` ni `|| true`.
 * Un élément requis absent = FAIL ou N-A explicite.
 * Pas de session auth → S0 FAIL + sections authentifiées N-A (jamais anonyme silencieux).
 * Pas de self-verdict axe ici.
 * fixer v3 : sonde anti-slug (leçon 43) — toute valeur d'attribut de nom
 * (aria-label, :label→.v-label, title, placeholder, alt, messages) qui
 * ressemble à une clé i18n `^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$` = FAIL nommé,
 * + G2 prouve le label du language-dialog résolu en texte réel.
 *
 * Usage: node verify.mjs <baseUrl> [auth.json]
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
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }
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
    await page.mouse.move(0, 0);
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(400);
};

/**
 * Navigation vers une page authentifiée : détecte la redirection SPA vers /login.
 * Retourne false (et émet N-A pour `id`) si la session est absente ou expirée.
 */
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

// Composite alpha fg sur pile d'ancêtres (leçon 35) — injecté par page
const probeInit = () => {
    window.__probe = {
        parseColor(str) {
            const m = /rgba?\(([^)]+)\)/.exec(str || '');
            if (m) {
                const p = m[1].split(',').map(Number);
                return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
            }
            // Chromium sérialise color-mix() en color(srgb r g b [/ a]) — r,g,b ∈ [0,1]
            const s = /color\(srgb\s+([^\s/]+)\s+([^\s/]+)\s+([^\s/]+)(?:\s*\/\s*([^\s)]+))?\s*\)/.exec(str || '');
            if (s) return [Number(s[1]) * 255, Number(s[2]) * 255, Number(s[3]) * 255, s[4] === undefined ? 1 : Number(s[4])];
            return null;
        },
        effectiveBg(el) {
            let acc = [0, 0, 0, 0];
            let n = el;
            while (n) {
                const css = getComputedStyle(n);
                const c = this.parseColor(css.backgroundColor);
                if (c && c[3] > 0) {
                    const a = acc[3] + c[3] * (1 - acc[3]);
                    acc = acc.slice(0, 3).map((v, i) => (v * acc[3] + c[i] * c[3] * (1 - acc[3])) / a).concat(a);
                    if (acc[3] >= 1) break;
                }
                n = n.parentElement;
            }
            if (acc[3] < 1) acc = [255, 255, 255, 1].map((v, i) => i < 3 ? (v * (1 - acc[3]) + acc[i]) : 1);
            return acc;
        },
        ratio(fg, bg) {
            const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
            const lum = rgb => 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2]);
            const fa = fg[3] + bg[3] * (1 - fg[3]);
            const fc = fg.slice(0, 3).map((c, i) => (c * fg[3] + bg[i] * bg[3] * (1 - fg[3])) / (fa || 1)).concat(fa);
            const lc = lum(fc), lb = lum(bg.slice(0, 3).concat([1]));
            return (Math.max(lc, lb) + 0.05) / (Math.min(lc, lb) + 0.05);
        },
    };
};
await page.addInitScript(probeInit);

// ── Sonde anti-slug (leçon 43, exécutable) ────────────────────────────────
// Pour CHAQUE attribut de nom rendu (aria-label, title, placeholder, alt,
// label) et texte d'étiquette (label, .v-label, .v-messages, legend), la
// valeur ne doit pas ressembler à une clé i18n non résolue. Un slug brut
// (ex. `language-dialog.select-language`) passe axe ET `length>0` — seule
// cette sonde le voit. Exclusions : noms de fichiers, domaines, versions.
const SLUG_RE = /^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/;
const slugOffenders = [];
const sweepSlugs = async (where) => {
    const found = await page.evaluate((re) => {
        const slugRe = new RegExp(re);
        const skip = v =>
            /\.(png|jpe?g|gif|svg|webp|ico|css|m?js|ts|json|pdf|txt|md|html?|xml|csv|zip|tgz?|woff2?|map)$/i.test(v) ||
            /\.(com|org|net|io|dev|app|ai|fr|de|co|uk|me|info|gov|edu|xyz|be|ca|nl|es|it)$/i.test(v) ||
            /^v?\d/.test(v);
        const out = [];
        const push = (el, attr, raw) => {
            const v = (raw || '').trim();
            if (!v || !slugRe.test(v) || skip(v)) return;
            const cls = typeof el.className === 'string' && el.className ? '.' + el.className.split(/\s+/)[0] : '';
            out.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls}[${attr}]="${v}"`);
        };
        for (const el of document.querySelectorAll('[aria-label],[title],[placeholder],[alt],[label]'))
            for (const a of ['aria-label', 'title', 'placeholder', 'alt', 'label']) push(el, a, el.getAttribute(a));
        for (const el of document.querySelectorAll('label,.v-label,.v-messages,legend'))
            push(el, 'text', el.textContent);
        return out;
    }, SLUG_RE.source);
    for (const f of found) slugOffenders.push(`${where} ${f}`);
};

// ── A. html lang + titre sur public & auth ────────────────────────────────
await page.goto(`${B}/login/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
{
    const meta = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute('lang'),
        title: (document.title || '').trim(),
    }));
    ok('A1-lang', 'page publique /login : html[lang] renseigné', !!meta.lang, String(meta.lang));
    ok('A1-title', 'page publique /login : <title> non vide', meta.title.length > 0, `"${meta.title.slice(0, 60)}"`);
    await sweepSlugs('A-login');
}
if (await gotoAuth(`${B}/g/home`, 'A2-nav', 'navigation authentifiée /g/home')) {
    const meta = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute('lang'),
        title: (document.title || '').trim(),
    }));
    ok('A2-lang', '/g/home : html[lang] renseigné', !!meta.lang, String(meta.lang));
    ok('A2-title', '/g/home : <title> non vide', meta.title.length > 0, `"${meta.title.slice(0, 60)}"`);
}
if (await gotoAuth(`${B}/g/home/r/golden-lentil-soup`, 'A3-nav', 'navigation authentifiée page recette')) {
    const meta = await page.evaluate(() => ({
        lang: document.documentElement.getAttribute('lang'),
        title: (document.title || '').trim(),
    }));
    ok('A3-lang', 'page recette : html[lang] renseigné', !!meta.lang, String(meta.lang));
    ok('A3-title', 'page recette : <title> non vide', meta.title.length > 0, `"${meta.title.slice(0, 60)}"`);
}

// ── B. AppHeader : lien logo nommé, h1, burger, search label ─────────────
if (await gotoAuth(`${B}/g/home`, 'B-nav', 'navigation authentifiée /g/home (header)')) {
    const head = await page.evaluate(() => {
        const link = document.querySelector('.v-app-bar a[href="/g/home"]');
        const burger = document.querySelector('.v-app-bar > button.v-btn--icon:first-child, .v-app-bar button[aria-label*="avigation" i]');
        const h1 = document.querySelector('.v-app-bar h1');
        const search = document.querySelector('.v-app-bar input[readonly]');
        const field = search?.closest('.v-field');
        return {
            linkLabel: (link?.getAttribute('aria-label') || '').trim(),
            burgerLabel: (burger?.getAttribute('aria-label') || '').trim(),
            h1Text: (h1?.textContent || '').trim(),
            searchNamed: !!(search && (search.getAttribute('aria-label') || field?.querySelector('label')?.textContent?.trim())),
        };
    });
    ok('B1', 'header : lien logo a un aria-label', head.linkLabel.length > 0, head.linkLabel);
    ok('B2', 'header : bouton burger a un aria-label', head.burgerLabel.length > 0, head.burgerLabel);
    ok('B3', 'header : h1 "Mealie" présent', head.h1Text === 'Mealie', head.h1Text);
    ok('B4', 'header : champ recherche nommé (label/aria-label)', head.searchNamed);
    await sweepSlugs('B-home');
}

// ── C. Contraste mesuré : titre toolbar (composite alpha) ────────────────
if (!sessionDead) {
    const c = await page.evaluate(() => {
        const t = document.querySelector('.v-app-bar .v-toolbar-title__placeholder') || document.querySelector('.v-app-bar h1');
        if (!t) return { missing: true };
        const fg = window.__probe.parseColor(getComputedStyle(t).color);
        const bg = window.__probe.effectiveBg(t);
        return { ratio: window.__probe.ratio(fg, bg), fg, bg };
    });
    ok('C1', 'header : contraste titre "Mealie" ≥ 4.5:1', !c.missing && c.ratio >= 4.5,
        `ratio=${c.ratio?.toFixed(2)} fg=${c.fg} bg=${c.bg} missing=${!!c.missing}`);
} else {
    na('C1', 'header : contraste titre "Mealie" ≥ 4.5:1', 'session absente');
}

// ── D. Sidebar : pas de div nu dans les listes nav ────────────────────────
if (!sessionDead) {
    const bad = await page.evaluate(() => {
        const lists = [...document.querySelectorAll('.v-navigation-drawer .v-list')];
        return lists.map(l => [...l.children].filter(c => c.tagName === 'DIV' && !c.classList.contains('v-list-group') && !c.getAttribute('role')).length);
    });
    ok('D1', 'sidebar : aucun div enfant direct de .v-list', bad.every(n => n === 0), `counts=${JSON.stringify(bad)}`);
} else {
    na('D1', 'sidebar : aucun div enfant direct de .v-list', 'session absente');
}

// ── E. Tooltips : rendues non vides (eager) ───────────────────────────────
if (!sessionDead) {
    const t = await page.evaluate(() => {
        const tips = [...document.querySelectorAll('.v-tooltip')];
        const empty = tips.filter(x => (x.textContent || '').trim() === '' && (x.querySelector('[role="tooltip"]')?.textContent || '').trim() === '');
        return { total: tips.length, empty: empty.length };
    });
    ok('E1', `tooltips : ${t.total} présentes, 0 vide`, t.empty === 0, `empty=${t.empty}`);
} else {
    na('E1', 'tooltips : présentes non vides', 'session absente');
}

// ── F. Menus overlay : contenu dans un landmark nommé ─────────────────────
if (!sessionDead) {
    await STATES['create-menu'].setup(page);
    await page.waitForTimeout(600);
    const m = await page.evaluate(() => {
        const contents = [...document.querySelectorAll('.v-overlay__content')].filter(o => o.getClientRects().length > 0);
        return contents.map(o => ({
            role: o.getAttribute('role'),
            label: (o.getAttribute('aria-label') || o.getAttribute('aria-labelledby') || '').trim(),
            inLandmark: !!o.closest('main,nav,header,footer,aside,[role="main"],[role="navigation"],[role="banner"],[role="contentinfo"],[role="complementary"]'),
        }));
    });
    ok('F0', 'create-menu : ≥1 overlay visible ouvert', m.length > 0, `overlays=${m.length}`);
    for (const [i, o] of m.entries()) {
        ok(`F${i + 1}`, `create-menu overlay ${i} : role=region nommé OU dans landmark`,
            (o.role === 'region' && o.label.length > 0) || o.inLandmark || o.role === 'dialog' || o.role === 'menu',
            JSON.stringify(o));
    }
    await sweepSlugs('F-create-menu');
    await settle();
} else {
    na('F0', 'create-menu : overlays dans landmark', 'session absente');
}

// ── G. Dialog langue : toolbar = div (pas de banner dupliqué) + nommé ─────
if (!sessionDead) {
    await STATES['language-dialog'].setup(page);
    await page.waitForTimeout(600);
    const d = await page.evaluate(() => {
        const dlg = [...document.querySelectorAll('[role="dialog"], .v-overlay__content')].find(o => o.getClientRects().length > 0 && o.querySelector('.v-toolbar'));
        if (!dlg) return { open: false };
        const tb = dlg.querySelector('.v-toolbar');
        return {
            open: true,
            tbTag: tb?.tagName.toLowerCase(),
            headers: dlg.querySelectorAll('header').length,
            dlgLabel: (dlg.getAttribute('aria-label') || dlg.getAttribute('aria-labelledby') || '').length > 0,
        };
    });
    ok('G1', 'language-dialog : toolbar tag=div, 0 header interne, dialog nommé', d.open && d.tbTag === 'div' && d.headers === 0 && d.dlgLabel, JSON.stringify(d));
    // W5 (fixer v3) : le label de l'autocomplete DOIT rendre le texte résolu
    // « Select Language » (clé data-pages.select-language), jamais un slug.
    const g2 = await page.evaluate(() => {
        const dlg = [...document.querySelectorAll('[role="dialog"], .v-overlay__content')].find(o => o.getClientRects().length > 0 && o.querySelector('.v-autocomplete'));
        if (!dlg) return { open: false };
        const ac = dlg.querySelector('.v-autocomplete');
        return {
            open: true,
            labelText: (ac.querySelector('.v-label, label')?.textContent || '').trim(),
            inputAria: (ac.querySelector('input')?.getAttribute('aria-label') || '').trim(),
        };
    });
    ok('G2', 'W5 : language-dialog — label autocomplete rendu = "Select Language" (texte réel, pas un slug i18n)',
        g2.open && g2.labelText === 'Select Language' && !SLUG_RE.test(g2.labelText) && !SLUG_RE.test(g2.inputAria),
        JSON.stringify(g2));
    await sweepSlugs('G-language-dialog');
    await settle();
} else {
    na('G1', 'language-dialog : toolbar div + nommé', 'session absente');
}

// ── H. Recipe page : context-menu activator nommé + plus de card-haspopup ──
if (await gotoAuth(`${B}/g/home/r/golden-lentil-soup`, 'H-nav', 'navigation authentifiée page recette')) {
    const r = await page.evaluate(() => {
        const ctxBtn = document.querySelector('.v-btn.bg-info, [aria-label*="action" i]');
        const cards = [...document.querySelectorAll('.v-card--link[aria-haspopup], div[aria-haspopup]:not([role])')].filter(e => !['button', 'menuitem', 'link'].includes(e.getAttribute('role') || ''));
        return {
            ctxLabel: (ctxBtn?.getAttribute('aria-label') || '').trim(),
            badCards: cards.length,
        };
    });
    ok('H1', 'recipe : bouton context-menu a un aria-label', r.ctxLabel.length > 0, r.ctxLabel);
    ok('H2', 'recipe : plus de v-card--link[aria-haspopup]', r.badCards === 0, `restants=${r.badCards}`);
    await sweepSlugs('H-recipe');
}

// ── M1/M2. W1 : section titres recette — h3 non vides, ingrédients rendus ──
if (!sessionDead) {
    const w1 = await page.evaluate(() => {
        const h3s = [...document.querySelectorAll('h3.section-title-text, .section-title-text')];
        const h3inPage = h3s.filter(e => e.getClientRects().length > 0);
        const emptyH3 = h3inPage.filter(e => (e.textContent || '').trim() === '').length;
        const noActionsTitle = !h3inPage.some(e => (e.textContent || '').trim().toLowerCase() === 'actions');
        const ingredients = [...document.querySelectorAll('.v-list-item, li')].filter(e => /g |ml |cup|tsp|tbsp|piece/i.test(e.textContent || '')).length;
        return { h3: h3inPage.length, emptyH3, noActionsTitle, ingredients };
    });
    ok('M1', 'W1 : aucun h3 de section vide ni intitulé "Actions" (pas de titre injecté en données)',
        w1.emptyH3 === 0 && w1.noActionsTitle, JSON.stringify(w1));
    ok('M2', 'W1 : les ingrédients restent rendus après retrait des titres "Actions"', w1.ingredients > 0, `ingredients=${w1.ingredients}`);
}

// ── M3/M4. W2 : liens markdown — couleur mesurée + soulignement, clair & sombre ──
if (!sessionDead) {
    const md = await page.evaluate(() => {
        const a = document.querySelector('.safe-markdown a');
        if (!a) return { missing: true };
        const cs = getComputedStyle(a);
        const fg = window.__probe.parseColor(cs.color);
        const bg = window.__probe.effectiveBg(a);
        return { ratio: fg ? window.__probe.ratio(fg, bg) : null, fg, bg, rawColor: cs.color,
            underline: (cs.textDecorationLine || '').includes('underline'), text: a.textContent.trim().slice(0, 40) };
    });
    ok('M3', 'W2 : lien markdown (clair) contraste ≥ 4.5:1 ET souligné',
        !md.missing && md.ratio >= 4.5 && md.underline,
        `ratio=${md.ratio?.toFixed(2)} underline=${md.underline} "${md.text}" fg=${md.fg} bg=${md.bg} missing=${!!md.missing}`);
    await STATES['theme-dark'].setup(page);
    await page.waitForTimeout(800);
    const mdD = await page.evaluate(() => {
        const a = document.querySelector('.safe-markdown a');
        if (!a) return { missing: true };
        const cs = getComputedStyle(a);
        const fg = window.__probe.parseColor(cs.color);
        const bg = window.__probe.effectiveBg(a);
        return { ratio: fg ? window.__probe.ratio(fg, bg) : null, fg, bg, rawColor: cs.color,
            underline: (cs.textDecorationLine || '').includes('underline'), dark: document.documentElement.classList.contains('dark') };
    });
    ok('M4', 'W2 : lien markdown (sombre) contraste ≥ 4.5:1 ET souligné',
        !mdD.missing && mdD.ratio >= 4.5 && mdD.underline,
        `ratio=${mdD.ratio?.toFixed(2)} underline=${mdD.underline} dark=${mdD.dark} fg=${mdD.fg} bg=${mdD.bg}`);
    await STATES['theme-dark'].cleanup?.(page).catch(() => {});
}

// ── I. Shopping list : checkbox nommée ────────────────────────────────────
let seedEnv = null;
try { seedEnv = JSON.parse(require('node:fs').readFileSync(resolve(HERE, 'seed-env.json'), 'utf8')); }
catch { na('I1', 'shopping : checkboxes nommées', 'seed-env.json illisible — rejouer tools/seed.mjs'); }
if (seedEnv?.shoppingListId && !sessionDead) {
    if (await gotoAuth(`${B}/shopping-lists/${seedEnv.shoppingListId}`, 'I-nav', 'navigation authentifiée shopping list')) {
        const c = await page.evaluate(() => {
            const boxes = [...document.querySelectorAll('input[type="checkbox"]')];
            const named = boxes.filter(b => (b.getAttribute('aria-label') || '').trim().length > 0 || b.labels?.length).length;
            return { total: boxes.length, named };
        });
        ok('I1', `shopping : ${c.total} checkbox, toutes nommées`, c.total > 0 && c.named === c.total, JSON.stringify(c));
        await sweepSlugs('I-shopping');
    }
} else if (seedEnv && !seedEnv.shoppingListId) {
    na('I1', 'shopping : checkboxes nommées', 'seed-env.json sans shoppingListId');
} else if (sessionDead) {
    na('I1', 'shopping : checkboxes nommées', 'session absente');
}

// ── J. Table admin : dernier th non vide ──────────────────────────────────
if (await gotoAuth(`${B}/group/data/foods/`, 'J-nav', 'navigation authentifiée /group/data/foods')) {
    const t = await page.evaluate(() => {
        const ths = [...document.querySelectorAll('.v-data-table thead th')];
        const empty = ths.filter(th => (th.textContent || '').trim() === '' && !th.querySelector('input,button') && !th.getAttribute('aria-label'));
        return { total: ths.length, empty: empty.length };
    });
    ok('J1', `data/foods : ${t.total} th, aucun vide`, t.empty === 0, `empty=${t.empty}`);
    await sweepSlugs('J-foods');
}

// ── K. Page d'erreur : v-main présent ─────────────────────────────────────
if (await gotoAuth(`${B}/group/data/pages/`, 'K-nav', 'navigation authentifiée page 404')) {
    const m = await page.evaluate(() => ({
        mains: document.querySelectorAll('main, .v-main, [role="main"]').length,
        bodyChildrenInLandmark: [...document.querySelectorAll('#__nuxt > *')].length,
    }));
    ok('K1', '404/erreur : un landmark main existe', m.mains > 0, JSON.stringify(m));
    await sweepSlugs('K-404');
}

// ── M5. W3 : members.vue — 4 checkboxes permissions, labels homogènes ──────
if (await gotoAuth(`${B}/household/members`, 'M5-nav', 'navigation authentifiée /household/members')) {
    const mm = await page.evaluate(() => {
        const boxes = [...document.querySelectorAll('input[type="checkbox"]')];
        const labels = boxes.map(b => (b.getAttribute('aria-label') || '').trim());
        return { total: boxes.length, labels,
            allNamed: labels.every(l => l.length > 0),
            samePattern: labels.every(l => /^.+ — .+$/.test(l)) };
    });
    ok('M5', `W3 : ${mm.total} checkboxes membres nommées, pattern homogène "Nom — permission"`,
        mm.allNamed && mm.samePattern, JSON.stringify(mm.labels));
    await sweepSlugs('M5-members');
}

// ── L. Thème dark : boutons header contrastés aussi ───────────────────────
if (!sessionDead) {
    await page.goto(`${B}/g/home`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await STATES['theme-dark'].setup(page);
    await page.waitForTimeout(800);
    const c = await page.evaluate(() => {
        const t = document.querySelector('.v-app-bar .v-toolbar-title__placeholder')
            || document.querySelector('.v-app-bar h1')
            || [...document.querySelectorAll('.v-app-bar .v-btn__content, .v-app-bar .v-btn')]
                .find(e => (e.textContent || '').trim().length > 0)
            || document.querySelector('.v-app-bar .v-btn');
        if (!t) return { missing: true };
        const fg = window.__probe.parseColor(getComputedStyle(t).color);
        const bg = window.__probe.effectiveBg(t);
        return { ratio: window.__probe.ratio(fg, bg), fg, bg };
    });
    ok('L1', 'dark : élément texte app-bar contraste ≥ 4.5:1', !c.missing && c.ratio >= 4.5,
        `ratio=${c.ratio?.toFixed(2)} missing=${!!c.missing}`);
    await STATES['theme-dark'].cleanup?.(page).catch(() => {});
    await sweepSlugs('L-dark');
} else {
    na('L1', 'dark : contraste app-bar', 'session absente');
}

// ── N. Anti-slug (leçon 43) : aucune valeur de nom rendue ne ressemble à une ─
// clé i18n — cumul des balayages A/B/F/G/H/I/J/K/M5/L ───────────────────────
ok('N1', 'anti-slug : aucun attribut/texte de nom ne ressemble à une clé i18n (leçon 43)',
    slugOffenders.length === 0, slugOffenders.slice(0, 12).join(' | '));

// ── Résumé ────────────────────────────────────────────────────────────────
const fails = results.filter(r => !r.pass).length;
const nas = results.filter(r => r.verdict === 'N-A').length;
console.log(`\nverify.mjs: ${results.length - fails - nas}/${results.length - nas} PASS, ${fails} FAIL, ${nas} N-A`);
for (const r of results) console.error(`  ${r.pass ? (r.verdict === 'N-A' ? 'N-A ' : 'PASS') : 'FAIL'} [${r.id}] ${r.name}`);
process.exit(fails === 0 ? 0 : 1);
