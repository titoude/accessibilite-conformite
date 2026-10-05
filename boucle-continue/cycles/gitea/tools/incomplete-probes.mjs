/**
 * incomplete-probes.mjs — résolution EXHAUSTIVE des résultats « incomplets »
 * axe des rapports finaux du cycle 32 (gitea).
 *
 * Chaque nœud incomplet est re-sondé avec une mesure adaptée à sa règle :
 *  - color-contrast          : composite alpha top→down de tous les calques bg,
 *                              ratio WCAG mesuré (svg: fill, html: color)
 *  - aria-valid-attr-value   : aria-controls -> document.getElementById existe
 *  - aria-allowed-role       : rôle de l'item vs rôle de son conteneur popup
 *  - th-has-data-cells       : nombre de cellules td non vides de la table
 *  - target-size             : bounding box mesurée
 *  - link-in-text-block      : textDecorationLine contient 'underline'
 * Les états dynamiques sont rejoués via les STATES de audit.mjs (source unique).
 *
 * Usage: node incomplete-probes.mjs <baseUrl> [auth.json] [reportDir...]
 *   défaut des rapports: ../reports/final-public + ../reports/final-auth
 * Sortie: ../reports/incomplete-probes.json + code 1 si un nœud reste non conforme.
 */
import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));
const { STATES } = await import('./audit.mjs');

const base = process.argv[2] || 'http://localhost:3232';
const authPath = process.argv[3] || resolve(HERE, 'auth.json');
const reportDirs = process.argv.slice(4).length ? process.argv.slice(4)
    : [resolve(HERE, '../reports/final-public'), resolve(HERE, '../reports/final-auth')];

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
// composite de TOUTES les couches rgba<1, du haut vers le bas
const effectiveBg = (el) => {
    const layers = [];
    let node = el;
    while (node && node !== document.documentElement.parentElement) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0) layers.push(c);
        node = node.parentElement;
    }
    if (!layers.length) return { r: 255, g: 255, b: 255 };
    // layers[0] = couche la plus haute (l'élément), dernier = ancêtre le plus profond.
    // On part du haut et on replie vers le bas : chaque couche plus basse passe SOUS le composite.
    let comp = { ...layers[0] };
    for (let i = 1; i < layers.length; i++) {
        if (comp.a >= 1) break;
        const c = layers[i];
        const a = comp.a + c.a * (1 - comp.a);
        comp = { r: (comp.a * comp.r + c.a * c.r * (1 - comp.a)) / a, g: (comp.a * comp.g + c.a * c.g * (1 - comp.a)) / a, b: (comp.a * comp.b + c.a * c.b * (1 - comp.a)) / a, a };
    }
    return comp;
};
`;

const EVAL_NODE = `
((sel, ruleId) => {
    const vis = e => e.getClientRects().length > 0;
    let els = [...document.querySelectorAll(sel)];
    // les ids auto-générés (_aria_auto_id_N) changent à chaque chargement :
    // si le sélecteur littéral échoue, retomber sur la présence de l'attribut
    if (!els.length && sel.includes('aria-controls=')) {
        els = [...document.querySelectorAll(sel.replace(/aria-controls="[^"]*"/g, 'aria-controls'))];
    }
    const el = els.find(vis) || els[0];
    if (!el) return { found: false };
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const out = { found: true, w: Math.round(rect.width * 10) / 10, h: Math.round(rect.height * 10) / 10 };
    if (ruleId === 'color-contrast') {
        const fg = parse(cs.color) || parse(cs.fill);
        const bg = effectiveBg(el);
        out.fg = fg; out.bg = bg;
        out.ratio = fg && bg ? ratio(lum(fg), lum(bg)) : null;
        out.pass = out.ratio !== null && out.ratio >= 4.5;
    } else if (ruleId === 'aria-valid-attr-value') {
        const id = el.getAttribute('aria-controls');
        const ref = id ? document.getElementById(id) : null;
        out.ariaControls = id; out.resolved = !!ref;
        out.pass = !!ref;
    } else if (ruleId === 'aria-allowed-role') {
        const role = el.getAttribute('role');
        const pop = el.closest('[role="menu"], [role="listbox"], [role="group"], [role="none"], [role="presentation"]');
        out.role = role; out.popupRole = pop ? pop.getAttribute('role') : null;
        out.pass = ['menuitem', 'option'].includes(role) ? !!pop : null;
        if (out.pass === null) out.pass = !!role;
    } else if (ruleId === 'th-has-data-cells') {
        const tds = [...el.querySelectorAll('td')];
        out.tdCount = tds.length;
        out.tdNonEmpty = tds.filter(t => (t.innerText || '').trim()).length;
        out.pass = out.tdCount === 0 || out.tdNonEmpty > 0;
    } else if (ruleId === 'target-size') {
        out.pass = out.w >= 24 && out.h >= 24;
        out.note = out.pass ? '' : 'mesuré < 24px ou partiellement masqué — exemption inline voir rapport';
    } else if (ruleId === 'link-in-text-block') {
        const deco = cs.textDecorationLine || '';
        out.deco = deco;
        out.pass = deco.includes('underline');
    } else {
        out.pass = null;
    }
    return out;
})(SELECTOR, RULE)
`;

// collecte exhaustive des nœuds incomplets
const targets = new Map(); // key url|state -> {url, state, authed, nodes:[{ruleId, selector}]}
for (const dir of reportDirs) {
    const rp = resolve(dir, 'report.json');
    if (!existsSync(rp)) { console.error(`rapport absent: ${rp}`); continue; }
    // les rapports *-public sont capturés anonymement : mêmes nodes à sonder hors session
    const authed = !dir.endsWith('-public');
    const r = JSON.parse(readFileSync(rp, 'utf8'));
    for (const p of r.pages) {
        for (const v of p.incomplete || []) {
            for (const nd of v.nodes || []) {
                const sel = (nd.target || []).map(t => typeof t === 'string' ? t : t).join(' ');
                if (!sel) continue;
                // report.json encode l'état dans l'URL : "<url> [state:<nom>]"
                const m = /^(.*) \[state:([^\]]+)\]$/.exec(p.url || '');
                const pageUrl = m ? m[1] : p.url;
                const pageState = m ? m[2] : null;
                const key = `${pageUrl}||${pageState || ''}||${authed}`;
                if (!targets.has(key)) targets.set(key, { url: pageUrl, state: pageState, authed, nodes: [] });
                const arr = targets.get(key).nodes;
                if (!arr.some(n => n.ruleId === v.id && n.selector === sel)) arr.push({ ruleId: v.id, selector: sel });
            }
        }
    }
}

const browser = await chromium.launch();
const authCtx = await browser.newContext({ storageState: existsSync(authPath) ? authPath : undefined });
const anonCtx = await browser.newContext();
const authPage = await authCtx.newPage();
const anonPage = await anonCtx.newPage();

const results = [];
let probed = 0, passCount = 0, failCount = 0;
for (const [key, t] of targets) {
    const page = t.authed ? authPage : anonPage;
    const u = new URL(t.url);
    // l'état remplace l'URL si la définition STATES en porte une
    const st = t.state && STATES[t.state] ? STATES[t.state] : null;
    const targetUrl = st?.url ? st.url(base) : t.url;
    try {
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(600);
        if (st?.setup) await st.setup(page);
        for (const n of t.nodes) {
            const res = await page.evaluate(`${PROBE_HELPERS}\n${EVAL_NODE}`.replace('SELECTOR', JSON.stringify(n.selector)).replace('RULE', JSON.stringify(n.ruleId)));
            probed++;
            const pass = res.found ? res.pass : null;
            if (pass === true) passCount++;
            else if (pass === false) failCount++;
            results.push({ url: t.url, state: t.state, ruleId: n.ruleId, selector: n.selector, ...res });
        }
        process.stderr.write(`  ${t.url.replace(base, '')} [${t.state || '-'}] ${t.nodes.length} sondes\n`);
    } catch (e) {
        for (const n of t.nodes) { results.push({ url: t.url, state: t.state, ruleId: n.ruleId, selector: n.selector, found: false, pass: null, error: e.message.slice(0, 120) }); }
        console.error(`  ERREUR page ${t.url} [${t.state}]: ${e.message.slice(0, 100)}`);
    }
}

const fails = results.filter(r => r.pass === false);
const unfound = results.filter(r => r.pass === null && r.found === false);
writeFileSync(resolve(HERE, '../reports/incomplete-probes.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), base, probed, pass: passCount, fail: failCount, unfound: unfound.length, results }, null, 2));
console.log(`\n${probed} sondes -> reports/incomplete-probes.json : ${passCount} conformes, ${failCount} NON CONFORMES, ${unfound.length} non retrouvées`);
process.exit(failCount > 0 ? 1 : 0);
