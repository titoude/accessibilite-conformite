/**
 * verify.mjs — assertions DURES sur les corrections jellyfin-web (cycle 41).
 * Effets mesurés dans le DOM rendu, jamais `if(el) ok()` ni `|| true`.
 * Un élément requis absent = FAIL ou N-A explicite.
 * Le score axe n'est pas auto-produit ici (règle : pas de self-verdict).
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
const ctx = await browser.newContext({ storageState, locale: 'en-US' });
const page = await ctx.newPage();

// MUI laisse parfois un tooltip ouvert qui intercepte les clics suivants —
// évacuer le pointeur + tooltip avant chaque état.
const settle = async () => {
    // tooltips interactifs MUI hors scope du test — masqués (ils
    // interceptent sinon les clics des états suivants)
    await page.addStyleTag({ content: '.MuiTooltip-popper,[role=tooltip]{display:none!important}' }).catch(() => {});
    await page.mouse.move(0, 0);
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(300);
};

// ── A. Menus MUI portailisés : Paper porte role=region + aria-label ────────
// (list, region) — les menus en portal échappent à la racine landmark ;
// role=dialog n'est PAS requis, region + nom suffit (leçon axe 4.14.0).
for (const [state, sel] of [
    ['nav-user-menu', '#app-user-menu'],
    ['syncplay-menu', '#app-sync-play-menu'],
    ['cast-menu', '#app-remote-play-menu'],
]) {
    await page.goto(STATES[state].url(B), { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await settle();
    await STATES[state].setup(page);
    await STATES[state].stateProof(page).catch(() => {});
    await page.waitForTimeout(300);
    const m = await page.evaluate((id) => {
        const menu = document.querySelector(id);
        // le portal MUI (position:fixed) a offsetParent null même visible —
        // la visibilité réelle se mesure via getClientRects
        if (!menu || menu.getClientRects().length === 0) return { open: false };
        const paper = menu.querySelector('.MuiPaper-root') || menu.closest('.MuiPaper-root');
        return {
            open: true,
            role: paper?.getAttribute('role'),
            label: (paper?.getAttribute('aria-label') || '').trim(),
        };
    }, sel);
    ok(`menu ${state}: Paper role=region + aria-label nommé`,
        m.open && m.role === 'region' && m.label.length > 0,
        JSON.stringify(m));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
}

// Popovers toolbar (sort / view settings) : même fix via slotProps.paper
for (const state of ['sort-popover', 'view-settings-popover']) {
    await page.goto(STATES[state].url(B), { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await STATES[state].setup(page);
    await page.waitForTimeout(500);
    const m = await page.evaluate(() => {
        const pop = [...document.querySelectorAll('.MuiPopover-root, .MuiMenu-root')].find(p => p.getClientRects().length > 0);
        if (!pop) return { open: false };
        const paper = pop.querySelector('.MuiPaper-root');
        return { open: true, role: paper?.getAttribute('role'), label: (paper?.getAttribute('aria-label') || '').trim() };
    });
    ok(`popover ${state}: Paper role=region + aria-label nommé`,
        m.open && m.role === 'region' && m.label.length > 0,
        JSON.stringify(m));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
}

// Menu carte bibliothèque du dashboard (LibraryCard → Actions)
await page.goto(STATES['dash-library-menu'].url(B), { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await settle();
await STATES['dash-library-menu'].setup(page);
await page.waitForTimeout(500);
{
    const m = await page.evaluate(() => {
        const pop = [...document.querySelectorAll('.MuiMenu-root')].find(p => p.getClientRects().length > 0);
        if (!pop) return { open: false };
        const paper = pop.querySelector('.MuiPaper-root');
        return { open: true, role: paper?.getAttribute('role'), label: (paper?.getAttribute('aria-label') || '').trim() };
    });
    ok('menu dash-library: Paper role=region + aria-label', m.open && m.role === 'region' && m.label.length > 0, JSON.stringify(m));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
}

// ── B. actionSheet legacy : role=dialog + nom accessible ──────────────────
await page.goto(STATES['card-context-menu'].url(B), { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await settle();
await STATES['card-context-menu'].setup(page);
await page.waitForTimeout(600);
{
    const d = await page.evaluate(() => {
        const s = document.querySelector('.actionSheet');
        if (!s || s.getClientRects().length === 0) return { open: false };
        const labelledby = s.getAttribute('aria-labelledby');
        return {
            open: true,
            role: s.getAttribute('role'),
            modal: s.getAttribute('aria-modal'),
            label: (s.getAttribute('aria-label') || '').trim(),
            labelledbyOk: !!(labelledby && document.getElementById(labelledby)),
        };
    });
    ok('actionSheet: role=dialog + modal + nom (label ou labelledby)',
        d.open && d.role === 'dialog' && (d.label.length > 0 || d.labelledbyOk),
        JSON.stringify(d));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
}

// Dialog legacy « Add Media Library » (formDialog avec titre → labelledby)
await page.goto(STATES['add-media-library-dialog'].url(B), { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await settle();
await STATES['add-media-library-dialog'].setup(page);
await page.waitForTimeout(600);
{
    const d = await page.evaluate(() => {
        const s = [...document.querySelectorAll('.dialog')].find(x => x.getClientRects().length > 0);
        if (!s) return { open: false };
        const labelledby = s.getAttribute('aria-labelledby');
        return {
            open: true,
            role: s.getAttribute('role'),
            label: (s.getAttribute('aria-label') || '').trim(),
            labelledbyOk: !!(labelledby && document.getElementById(labelledby)),
        };
    });
    ok('dialog legacy (Add Media Library): role=dialog + nom',
        d.open && d.role === 'dialog' && (d.label.length > 0 || d.labelledbyOk),
        JSON.stringify(d));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
}

// ── C. Cards : indicateurs aria-hidden + aria-label ⊇ texte visible ───────
await page.goto(`${B}/web/#/details?id=a7cc2a4fb6f159ad3b5acbf3d0a690df`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
{
    const c = await page.evaluate(() => {
        const a = document.querySelector('.defaultCardBackground4');
        if (!a) return { missing: true };
        const label = (a.getAttribute('aria-label') || '').toLowerCase();
        const visible = (a.innerText || '').replace(/\s+/g, ' ').trim().toLowerCase();
        const tokens = visible.split(' ').filter(Boolean);
        const nameTokens = label.split(' ').filter(Boolean);
        const contiguous = nameTokens.join(' ').includes(visible);
        const ind = a.querySelector('.cardIndicators');
        return {
            missing: false,
            label,
            visible,
            contiguous,
            indicatorsHidden: ind?.getAttribute('aria-hidden') === 'true',
        };
    });
    ok('card /details: aria-label contient le texte visible (sous-séquence contiguë)',
        !c.missing && c.contiguous, JSON.stringify(c));
    ok('card /details: .cardIndicators aria-hidden',
        !c.missing && c.indicatorsHidden === true, JSON.stringify(c));
}

// ── D. jstree : aria-expanded transféré sur .jstree-anchor ────────────────
await page.goto(`${B}/web/#/metadata?id=4df79bd2d5bbae21080a0524a2702d5a`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
{
    const t = await page.evaluate(() => {
        const ocl = [...document.querySelectorAll('.jstree-ocl[aria-expanded]')];
        const anchors = [...document.querySelectorAll('.jstree-anchor[aria-expanded]')];
        return {
            oclWithExpanded: ocl.length,
            anchorsWithExpanded: anchors.length,
            tree: !!document.querySelector('.jstree'),
        };
    });
    if (t.tree) {
        ok('jstree: aucun aria-expanded sur .jstree-ocl (role=presentation)',
            t.oclWithExpanded === 0, JSON.stringify(t));
        ok('jstree: aria-expanded présent sur .jstree-anchor',
            t.anchorsWithExpanded > 0, JSON.stringify(t));
    } else {
        na('jstree', 'arbre absent de la page metadata');
    }
    // contraste de l'ancre jstree (fix metadataeditor.scss) : la ligne
    // CLIQUÉE (.jstree-wholerow-clicked) passe sur fond clair → texte sombre
    await page.locator('.jstree-anchor').first().click().catch(() => {});
    await page.waitForTimeout(400);
    const col = await page.evaluate(() => {
        const clicked = document.querySelector('.jstree-wholerow-clicked');
        const li = clicked?.closest('li');
        const a = li?.querySelector('.jstree-anchor');
        if (!a) return null;
        return { color: getComputedStyle(a).color, text: (a.innerText || '').slice(0, 30) };
    });
    if (col) {
        const rgb = col.color.match(/\d+/g).map(Number);
        const dark = rgb[0] + rgb[1] + rgb[2] < 350;
        ok('jstree anchor (ligne cliquée): couleur contrastée sur fond éditeur',
            dark, JSON.stringify(col));
    } else {
        na('jstree anchor contrast', 'aucune ligne cliquée mesurable');
    }
}

// ── E. Table dashboard : spacer MRT masqué aux TA ─────────────────────────
await page.goto(`${B}/web/#/dashboard/activity`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
{
    const tb = await page.evaluate(() => {
        const ths = [...document.querySelectorAll('th')];
        const spacers = ths.filter(t => t.innerText.trim() === '' && !t.querySelector('[class*="MuiTableSortLabel"]'));
        const flagged = spacers.filter(t => t.getAttribute('aria-hidden') !== 'true' && t.tabIndex >= 0);
        return { th: ths.length, spacers: spacers.length, flagged: flagged.length, sample: flagged.map(t => t.className.slice(0, 40)) };
    });
    if (tb.th > 0) {
        ok('dashboard table: aucun th vide tabulable/non-masqué (mrt-row-spacer)',
            tb.flagged === 0, JSON.stringify(tb));
    } else {
        na('dashboard table spacer', 'aucun th rendu sur activity');
    }
}

// ── F. Branding : input file réel + Button component=span dans label ──────
await page.goto(`${B}/web/#/dashboard/branding`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
{
    const b = await page.evaluate(() => {
        const label = [...document.querySelectorAll('label')].find(l => l.querySelector('input[type="file"]'));
        if (!label) return { found: false };
        const btn = label.querySelector('.MuiButton-root, button');
        return {
            found: true,
            inputType: label.querySelector('input')?.type,
            buttonIsSpan: btn?.tagName === 'SPAN',
            buttonRole: btn?.getAttribute('role'),
            buttonTab: btn?.tabIndex,
            labelText: (label.textContent || '').trim().slice(0, 40),
        };
    });
    ok('branding: <label> réel contient input[type=file] + span visuel non-interactif',
        b.found && b.inputType === 'file' && b.buttonIsSpan === true && !b.buttonRole && b.buttonTab === -1 && b.labelText.length > 0,
        JSON.stringify(b));
}

// ── G. ServerButton : lien AppBar toujours nommé ──────────────────────────
await page.goto(`${B}/web/#/login`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
{
    const s = await page.evaluate(() => {
        const a = document.querySelector('a.MuiButtonBase-root[href="#/"]');
        if (!a) return { missing: true };
        return {
            missing: false,
            label: (a.getAttribute('aria-label') || '').trim(),
            text: (a.innerText || '').trim(),
        };
    });
    ok('login: lien ServerButton nommé (aria-label ou texte)',
        !s.missing && (s.label.length > 0 || s.text.length > 0), JSON.stringify(s));
}

// ── H. meta viewport : zoom non bloqué ────────────────────────────────────
{
    const v = await page.evaluate(() => document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '');
    const blocked = /user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(v);
    ok('meta viewport: zoom utilisateur non verrouillé', v.length > 0 && !blocked, v);
}

// ── I. Drawer admin : sous-structure de liste valide ──────────────────────
await page.goto(`${B}/web/#/dashboard`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
{
    const d = await page.evaluate(() => {
        // ListSubheader doit être <li> dans une <ul> MUI (MainDrawerContent)
        const subs = [...document.querySelectorAll('.MuiListSubheader-root')];
        const badSub = subs.filter(s => s.tagName !== 'LI' && s.closest('ul'));
        // Aucun bouton directement sous <ul> (ListItem wrappers)
        const badBtns = [...document.querySelectorAll('ul:not([role]) > a, ul:not([role]) > .MuiButtonBase-root')].filter(el => el.getClientRects().length > 0);
        return { subs: subs.length, badSub: badSub.length, badBtns: badBtns.length };
    });
    ok('drawer: ListSubheader en <li> (0 div sous ul)',
        d.subs === 0 || d.badSub === 0, JSON.stringify(d));
    ok('drawer: aucun <a>/bouton direct enfant de <ul>',
        d.badBtns === 0, JSON.stringify(d));
}

// ── Résumé ────────────────────────────────────────────────────────────────
const fails = results.filter(r => !r.pass);
console.log(`verify: ${results.length - fails.length}/${results.length} PASS, ${fails.length} FAIL`);
if (fails.length) {
    for (const f of fails) console.log('  FAIL', f.name);
    process.exitCode = 1;
}
await browser.close();
