/**
 * incomplete-probes.mjs — sondes manuelles pour les 61 résultats « incomplets »
 * d'axe du cycle 29 (uptime-kuma). Tous sont des color-contrast indéterminés :
 *  - 48 « element contains an image node » (icône SVG FontAwesome à l'intérieur
 *    du texte — axe abandonne) ou background-image natif (flèche des <select>);
 *  - 12 « unable to determine contrast ratio » (conteneurs sans texte propre —
 *    racines vue-multiselect dont le texte vit dans les enfants);
 *  - 1 « content too short » (compteur stats quasi vide).
 * Pour chaque cible : on recomposite TOUTES les couches d'arrière-plan des
 * ancêtres (leçon : sonder chaque couche) et on calcule le ratio WCAG 2.x.
 * Usage: node incomplete-probes.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));

const base = process.argv[2] || 'http://localhost:3001';
const authPath = process.argv[3] || resolve(HERE, 'auth.json');

const PROBE_HELPERS = `
const parse = (c) => {
    const m = (c || '').match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(',').map(x => parseFloat(x.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
};
const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
// composite de TOUTES les couches d'arrière-plan depuis l'élément jusqu'à html
const effectiveBg = (el) => {
    const layers = [];
    let node = el;
    while (node && node !== document.documentElement.parentElement) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0) layers.push(c);
        node = node.parentElement;
    }
    if (!layers.length) return { r: 255, g: 255, b: 255, note: 'no opaque layer -> assumed white' };
    let comp = null;
    for (let i = layers.length - 1; i >= 0; i--) {
        const c = layers[i];
        if (!comp) { comp = { r: c.r, g: c.g, b: c.b, a: c.a }; continue; }
        if (comp.a >= 1) break;
        comp = { r: c.a * c.r + (1 - c.a) * comp.r, g: c.a * c.g + (1 - c.a) * comp.g, b: c.a * c.b + (1 - c.a) * comp.b, a: c.a + comp.a * (1 - c.a) };
    }
    return comp;
};
const hasBgImage = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
        const v = getComputedStyle(node).backgroundImage;
        if (v && v !== 'none') return true;
        node = node.parentElement;
    }
    return false;
};
`;

const evaluateTarget = `
((sel) => {
    const el = [...document.querySelectorAll(sel)].find(e => e.getClientRects().length > 0);
    if (!el) return { found: false };
    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    const bg = effectiveBg(el);
    const ownText = el.innerText ? el.innerText.trim() : '';
    // texte qui vit dans les enfants (ex: racine multiselect) : mesurer le texte réel
    const textNodes = [...el.querySelectorAll('*')].filter(k => k.children.length === 0 && (k.innerText || '').trim());
    const samples = textNodes.slice(0, 4).map(k => {
        const kcs = getComputedStyle(k);
        const kfg = parse(kcs.color);
        const kbg = effectiveBg(k);
        return { text: (k.innerText || '').trim().slice(0, 30), fg: kfg, bg: kbg, ratio: kfg && kbg ? ratio(lum(kfg), lum(kbg)) : null, sel: k.className || k.tagName };
    });
    return {
        found: true, text: ownText.slice(0, 40), fg, bg, bgImage: hasBgImage(el),
        direct: fg && bg ? ratio(lum(fg), lum(bg)) : null,
        samples,
    };
})(SELECTOR)
`;

const browser = await chromium.launch();
const storageState = existsSync(authPath) ? authPath : undefined;
const ctx = await browser.newContext({ storageState });
const page = await ctx.newPage();

const results = [];
const probe = async (url, selector, note = '') => {
    await page.goto(`${base}${url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const res = await page.evaluate(`${PROBE_HELPERS}\n${evaluateTarget}`.replace('SELECTOR', JSON.stringify(selector)));
    const out = { url, selector, note, ...res };
    results.push(out);
    const r = res.direct;
    const samples = (res.samples || []).map(s => `${s.ratio ? s.ratio.toFixed(2) : 'n/a'}:"${s.text}"`).join(' ');
    console.log(`${res.found ? (r ? r.toFixed(2) : 'via-children') : 'ABSENT'}  ${url}  ${selector}  ${note} ${samples}`);
};

// cibles issues des 61 incomplets (un échantillon par cible unique; les
// doublons état-level partagent la même cause)
await probe('/dashboard/1', '.btn-light', 'image node = icône FA dans le bouton');
await probe('/add', '#type', 'select natif, flèche en background-image');
await probe('/add', '#ipFamily', 'select natif, flèche en background-image');
await probe('/add', '#acceptedStatusCodes', 'multiselect racine (texte dans les enfants)');
await probe('/add-maintenance', '#affected_monitors', 'multiselect racine');
await probe('/add-maintenance', '#selected_status_pages', 'multiselect racine');

// .num.text-secondary (user-menu state) — page dashboard avec menu ouvert
await page.goto(`${base}/dashboard`, { waitUntil: 'networkidle' });
await page.click('.dropdown-profile-pic .nav-link').catch(() => null);
await page.waitForTimeout(600);
const numRes = await page.evaluate(`${PROBE_HELPERS}\n${evaluateTarget}`.replace('SELECTOR', JSON.stringify('.num.text-secondary')));
results.push({ url: '/dashboard[user-menu-dropdown]', selector: '.num.text-secondary', note: 'content too short (compteur ~vide)', ...numRes });
console.log(`${numRes.found ? (numRes.direct ? numRes.direct.toFixed(2) : 'via-children') : 'ABSENT'}  /dashboard[dropdown]  .num.text-secondary`);

writeFileSync(resolve(HERE, '../reports/incomplete-probes.json'), JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2));
console.log(`\n${results.length} sondes -> reports/incomplete-probes.json`);
await browser.close();
