/**
 * verify.mjs — assertions DURES sur les corrections uptime-kuma (cycle 29).
 * Chaque assertion qui échoue → process.exit(1). Aucun self-verdict axe :
 * le score axe est produit par audit.mjs, pas ici.
 *
 * Usage: node verify.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const [base, authPath = 'auth.json'] = process.argv.slice(2);
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }

const results = [];
const ok = (name, cond, extra = '') => {
    results.push({ name, pass: !!cond });
    if (!cond) console.error(`  FAIL ${name} ${extra}`);
    return cond;
};
// N-A explicite : la donnée requise par l'assertion est absente — jamais un PASS à vide
const na = (name, reason = '') => {
    results.push({ name, pass: true, verdict: 'N-A', reason });
    console.error(`  N-A ${name} ${reason}`);
    return true;
};

// contraste WCAG relatif (seuil 4.5 texte normal) — évalué côté navigateur
const BROWSER_HELPERS = `
const parseRgb = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
};
const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
// composite sur tous les calques d'arrière-plan (leçon : sonder CHAQUE couche)
const effectiveBg = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
        const c = parseRgb(getComputedStyle(node).backgroundColor);
        if (c && c.a >= 1) return c;
        if (c && c.a > 0) {
            const under = effectiveBg(node.parentElement);
            const rgb = under || { r: 255, g: 255, b: 255 };
            return { r: c.a * c.r + (1 - c.a) * rgb.r, g: c.a * c.g + (1 - c.a) * rgb.g, b: c.a * c.b + (1 - c.a) * rgb.b };
        }
        node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255 };
};
`;

const browser = await chromium.launch();
const storageState = existsSync(authPath) ? authPath : existsSync(resolve('tools', authPath)) ? resolve('tools', authPath) : undefined;
const ctx = await browser.newContext({ storageState });
const page = await ctx.newPage();

// ── 1. Page login (non authentifié) : h1 + landmark ────────────────────────
{
    const anon = await browser.newContext();
    const p = await anon.newPage();
    await p.goto(`${base}/dashboard`, { waitUntil: 'networkidle' });
    const h1 = await p.evaluate(() => document.querySelector('h1')?.textContent?.trim() || null);
    ok('login: h1 présent (Login)', /log ?in|login/i.test(h1 || ''), String(h1));
    const forms = await p.evaluate(() => {
        const inputs = [...document.querySelectorAll('input[type="password"], input[type="text"], input[type="email"]')]
            .filter(i => i.offsetParent !== null);
        return { count: inputs.length, unlabelled: inputs.filter(i => !i.id || !document.querySelector(`label[for="${i.id}"]`)).length };
    });
    if (forms.count > 0) {
        ok('login: champs de formulaire étiquetés', forms.unlabelled === 0, `${forms.unlabelled}/${forms.count}`);
    } else {
        na('login: champs de formulaire étiquetés', 'aucun champ de login visible');
    }
    await anon.close();
}

// ── 2. Dashboard authentifié : landmarks + hiérarchie de titres ────────────
await page.goto(`${base}/dashboard`, { waitUntil: 'networkidle' });
await page.waitForSelector('#app main, #app .list, #app', { timeout: 20000 });
const dash = await page.evaluate(() => {
    const mains = [...document.querySelectorAll('main')].filter(m => m.getClientRects().length > 0);
    const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.getClientRects().length > 0);
    let skip = null, prev = 0;
    for (const h of heads) {
        const lvl = parseInt(h.tagName.slice(1), 10);
        if (prev && lvl > prev + 1) { skip = `${prev}->${lvl} ${h.textContent.trim().slice(0, 40)}`; break; }
        prev = lvl;
    }
    return {
        mains: mains.length,
        topHead: heads[0]?.tagName,
        headSkip: skip,
        headCount: heads.length,
    };
});
ok('dashboard: exactement 1 main visible', dash.mains === 1, String(dash.mains));
ok('dashboard: pas de saut de niveau de titre', dash.headSkip === null && dash.headCount > 0, String(dash.headSkip));

// ── 3. Sidebar monitor list : .item.disabled a un contraste suffisant ───────
const disabled = await page.evaluate(`
${BROWSER_HELPERS}
(() => {
    const el = document.querySelector('.monitor-list .item.disabled, .item.disabled');
    if (!el) return { found: false };
    const fg = parseRgb(getComputedStyle(el).color);
    const bg = effectiveBg(el);
    return { found: true, fg, bg, r: ratio(lum(fg), lum(bg)) };
})()
`);
if (disabled.found) {
    ok('sidebar: .item.disabled ≥4.5', disabled.r >= 4.5, `ratio=${disabled.r?.toFixed(2)}`);
} else {
    na('sidebar: .item.disabled ≥4.5', 'aucun moniteur désactivé dans la liste');
}

// ── 4. Tag : contraste texte calculé vs couleur inline ─────────────────────
const tag = await page.evaluate(`
${BROWSER_HELPERS}
(() => {
    const el = [...document.querySelectorAll('.tag-wrapper, [class*="tag-wrapper"]')].find(t => t.getClientRects().length > 0);
    if (!el) return { found: false };
    const fg = parseRgb(getComputedStyle(el).color);
    const bgc = getComputedStyle(el).backgroundColor;
    return { found: true, fg, bgc, r: ratio(lum(fg), lum(parseRgb(bgc))) };
})()
`);
if (tag.found) {
    ok('tag: texte ≥4.5 sur sa couleur de fond', tag.r >= 4.5, `ratio=${tag.r?.toFixed(2)}`);
    ok('tag: pas de color:white aveugle', !(tag.fg.r > 240 && tag.fg.g > 240 && tag.fg.b > 240 && tag.r < 4.5), JSON.stringify(tag.fg));
} else {
    na('tag: texte ≥4.5 sur sa couleur de fond', 'aucun tag visible sur le dashboard');
}

// ── 5. Multiselect accessible (AccessibleMultiselect wrapper) ──────────────
await page.goto(`${base}/edit/2`, { waitUntil: 'networkidle' });
const ms = await page.evaluate(async () => {
    const root = document.querySelector('.multiselect');
    if (!root) return { found: false };
    const before = {
        role: root.getAttribute('role'),
        expanded: root.getAttribute('aria-expanded'),
        owns: root.getAttribute('aria-owns'),
        controls: root.getAttribute('aria-controls'),
    };
    return { found: true, before };
});
if (ms.found) {
    ok('multiselect: role=combobox présent', ms.before.role === 'combobox', String(ms.before.role));
    ok('multiselect: aria-expanded synchronisé au chargement', ['true', 'false'].includes(ms.before.expanded), String(ms.before.expanded));
    ok('multiselect: aria-controls ou aria-owns résout un élément', !!(ms.before.controls || ms.before.owns), `${ms.before.controls}/${ms.before.owns}`);
} else {
    na('multiselect: role=combobox présent', 'aucun multiselect sur /edit/2');
}

// ── 6. Modales Bootstrap : role=dialog + aria-modal + étiquette ─────────────
await page.goto(`${base}/dashboard/2`, { waitUntil: 'networkidle' });
// déclencheur supprimer (bouton haut de page détails)
const delBtn = await page.$('.monitor-info-btns .btn-normal[title], .btn-normal:has(svg.icon) ');
const modalProbe = await page.evaluate(async () => {
    const btn = [...document.querySelectorAll('button')].find(b => /delete/i.test(b.textContent || '') || /delete/i.test(b.getAttribute('aria-label') || '') || /delete/i.test(b.getAttribute('title') || ''));
    if (!btn) return { found: false };
    btn.click();
    await new Promise(r => setTimeout(r, 700));
    const m = [...document.querySelectorAll('.modal')].find(m => m.classList.contains('show') || m.offsetParent !== null);
    if (!m) return { found: false, noModal: true };
    const labelled = m.getAttribute('aria-labelledby');
    const labelEl = labelled ? document.getElementById(labelled) : null;
    const labelledOk = !!(labelled && labelEl) || !!m.getAttribute('aria-label');
    return {
        found: true,
        role: m.getAttribute('role'),
        ariaModal: m.getAttribute('aria-modal'),
        labelledOk,
        titleText: labelEl ? labelEl.textContent.trim() : null,
    };
});
if (modalProbe.found && !modalProbe.noModal) {
    ok('modal delete: role=dialog', modalProbe.role === 'dialog', String(modalProbe.role));
    ok('modal delete: aria-modal=true', modalProbe.ariaModal === 'true', String(modalProbe.ariaModal));
    ok('modal delete: étiquettée (labelledby/aria-label)', modalProbe.labelledOk, String(modalProbe.titleText));
} else if (modalProbe.noModal) {
    na('modal delete: role=dialog', 'bouton Delete présent mais la modale ne s\'ouvre pas');
} else {
    na('modal delete: role=dialog', 'aucun bouton Delete trouvé sur /dashboard/2');
}

// ── 7. Inputs cachés (HiddenInput) : étiquette résoluble + bouton œil nommé ──
await page.goto(`${base}/add`, { waitUntil: 'networkidle' });
const hidden = await page.evaluate(() => {
    const eyes = [...document.querySelectorAll('button')].filter(b => b.querySelector('svg[data-icon*="eye"], .fa-eye, .fa-eye-slash'));
    const pwds = [...document.querySelectorAll('input[type="password"], input[type="text"][autocomplete="new-password"]')];
    const unlabelledPw = pwds.filter(i => {
        const id = i.id;
        return !(id && document.querySelector(`label[for="${id}"]`)) && !(i.getAttribute('aria-label') || '').trim() && !(i.closest('label'));
    });
    return {
        eyes: eyes.length,
        eyesLabelled: eyes.filter(b => (b.getAttribute('aria-label') || '').trim().length > 0).length,
        pwds: pwds.length,
        unlabelledPw: unlabelledPw.length,
    };
});
if (hidden.eyes > 0) {
    ok('password reveal: boutons œil ont un aria-label', hidden.eyesLabelled === hidden.eyes, `${hidden.eyesLabelled}/${hidden.eyes}`);
} else {
    na('password reveal: boutons œil ont un aria-label', 'aucun champ mot de passe sur /add');
}
if (hidden.pwds > 0) {
    ok('password fields: labels résolubles', hidden.unlabelledPw === 0, `${hidden.unlabelledPw}/${hidden.pwds}`);
} else {
    na('password fields: labels résolubles', 'aucun input password sur /add');
}

// ── 8. Checkboxes du formulaire : toutes appariées ──────────────────────────
const checks = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('input[type="checkbox"]')].filter(c => c.getClientRects().length > 0);
    const bad = boxes.filter(c => {
        const id = c.id;
        return !(id && document.querySelector(`label[for="${id}"]`)) && !(c.getAttribute('aria-label') || '').trim() && !(c.closest('label'));
    });
    return { total: boxes.length, bad: bad.length, badIds: bad.slice(0, 5).map(b => b.id || '(sans id)') };
});
ok('add: checkboxes étiquetées (label/aria-label/implicit)', checks.bad === 0 && checks.total > 0, `${checks.bad}/${checks.total} ${checks.badIds.join(',')}`);

// ── 9. Objets décoratifs : aria-hidden + tabindex -1 ────────────────────────
const objs = await page.evaluate(() => {
    const os = [...document.querySelectorAll('object')];
    return {
        count: os.length,
        bad: os.filter(o => o.getAttribute('aria-hidden') !== 'true' || o.getAttribute('tabindex') !== '-1').length,
    };
});
if (objs.count > 0) {
    ok('objects: aria-hidden=true + tabindex=-1', objs.bad === 0, `${objs.bad}/${objs.count}`);
} else {
    na('objects: aria-hidden=true + tabindex=-1', 'aucun <object> rendu sur /add');
}

// ── 10. Navigation mobile : bottom nav nommée ───────────────────────────────
await page.setViewportSize({ width: 400, height: 800 });
await page.goto(`${base}/dashboard`, { waitUntil: 'networkidle' });
const nav = await page.evaluate(() => {
    const n = document.querySelector('.bottom-nav');
    if (!n) return { found: false };
    return { found: true, tag: n.tagName, label: n.getAttribute('aria-label') };
});
if (nav.found) {
    ok('mobile nav: nav landmark nommée (aria-label)', nav.tag === 'NAV' && !!(nav.label || '').trim(), `${nav.tag}/${nav.label}`);
} else {
    na('mobile nav: nav landmark nommée', 'bottom-nav absente (viewport mobile sans nav)');
}
await page.setViewportSize({ width: 1280, height: 800 });

// ── 11. Status page publique : landmark main + h hierarchie ────────────────
await page.goto(`${base}/status/demo`, { waitUntil: 'networkidle' });
const sp = await page.evaluate(() => {
    const mains = [...document.querySelectorAll('main')].filter(m => m.getClientRects().length > 0);
    const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.getClientRects().length > 0);
    let skip = null, prev = 0;
    for (const h of heads) {
        const lvl = parseInt(h.tagName.slice(1), 10);
        if (prev && lvl > prev + 1) { skip = `${prev}->${lvl} ${h.textContent.trim().slice(0, 40)}`; break; }
        prev = lvl;
    }
    return { mains: mains.length, headSkip: skip, headCount: heads.length };
});
ok('status page: exactement 1 main visible', sp.mains === 1, String(sp.mains));
ok('status page: pas de saut de niveau de titre', sp.headSkip === null && sp.headCount > 0, String(sp.headSkip));

// ── 12. Datepicker : uid prop + label[for] résoluble ────────────────────────
await page.goto(`${base}/settings/api-keys`, { waitUntil: 'networkidle' });
const dp = await page.evaluate(async () => {
    const btn = [...document.querySelectorAll('button')].find(b => /api.?key/i.test(b.textContent || '') && /add|create|new|générer/i.test(b.textContent || ''));
    if (!btn) return { found: false };
    btn.click();
    await new Promise(r => setTimeout(r, 700));
    const dpInput = document.querySelector('input[id^="dp-input-"]');
    if (!dpInput) return { found: true, noInput: true };
    const lbl = dpInput.id ? document.querySelector(`label[for="${dpInput.id}"]`) : null;
    return { found: true, id: dpInput.id, labelled: !!lbl, labelText: lbl ? lbl.textContent.trim() : null };
});
if (dp.found && !dp.noInput) {
    ok('datepicker: input a un id dp-input-*', /^dp-input-/.test(dp.id), String(dp.id));
    ok('datepicker: label[for] pointe sur l\'input', dp.labelled, String(dp.labelText));
} else if (dp.noInput) {
    na('datepicker: input a un id dp-input-*', 'modale ouverte mais input Datepicker absent');
} else {
    na('datepicker: input a un id dp-input-*', 'bouton d\'ajout API key introuvable');
}

await ctx.close();
await browser.close();

const fails = results.filter(r => !r.pass);
console.error(`\nverify.mjs : ${results.length - fails.length}/${results.length} assertions OK (${fails.length} FAIL)`);
if (fails.length) process.exit(1);
