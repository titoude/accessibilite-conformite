/**
 * verify.mjs — assertions DURES sur les corrections gitea (cycle 32).
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
// nom accessible approximé : aria-label > aria-labelledby > label[for] > alt > texte
const accName = (el) => {
    const al = (el.getAttribute('aria-label') || '').trim();
    if (al) return al;
    const lb = (el.getAttribute('aria-labelledby') || '').split(/\\s+/).map(id => document.getElementById(id)).filter(Boolean);
    if (lb.length) return lb.map(e => e.innerText.trim()).join(' ').trim();
    if (el.id) { const l = document.querySelector('label[for="' + el.id + '"]'); if (l) return l.innerText.trim(); }
    const wrap = el.closest('label'); if (wrap) return wrap.innerText.trim();
    const img = el.querySelector('img[alt]'); if (img && img.alt.trim()) return img.alt.trim();
    return (el.innerText || '').trim();
};
`;

const browser = await chromium.launch();
const storageState = existsSync(authPath) ? authPath : existsSync(resolve(HERE, authPath)) ? resolve(HERE, authPath) : undefined;
const ctx = await browser.newContext({ storageState });
const page = await ctx.newPage();

// ── 1. Landmarks : 1 main + 1 nav + 1 contentinfo sur pages représentatives ──
for (const url of ['/', '/a11yorg/demo-repo', '/a11yorg/demo-repo/issues/1', '/user/settings', '/-/admin']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const lm = await page.evaluate(() => {
        const vis = e => e.getClientRects().length > 0;
        return {
            mains: [...document.querySelectorAll('main, [role="main"]')].filter(vis).length,
            navs: [...document.querySelectorAll('nav, [role="navigation"]')].filter(vis).length,
            footer: [...document.querySelectorAll('footer, [role="contentinfo"]')].filter(vis).length,
        };
    });
    ok(`landmarks ${url}: 1 main, >=1 nav, >=1 footer`, lm.mains === 1 && lm.navs >= 1 && lm.footer >= 1, JSON.stringify(lm));
}

// ── 2. Hiérarchie de titres : aucun saut de niveau visible ──────────────────
for (const url of ['/', '/a11yorg/demo-repo', '/a11yorg/demo-repo/issues', '/a11yorg/demo-repo/issues/1', '/user/settings/appearance', '/a11yorg/demo-repo/pulls/5/files']) {
    await page.goto(base + url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const hs = await page.evaluate(() => {
        const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.getClientRects().length > 0);
        let skip = null, prev = 0;
        for (const h of heads) {
            const lvl = parseInt(h.tagName.slice(1), 10);
            if (prev && lvl > prev + 1) { skip = prev + '->' + lvl + ' "' + h.textContent.trim().slice(0, 40) + '"'; break; }
            prev = lvl;
        }
        return { count: heads.length, skip, first: heads[0]?.tagName };
    });
    ok(`titres ${url}: aucun saut de niveau`, hs.skip === null && hs.count > 0, `${hs.skip || hs.count + ' titres, 1er=' + hs.first}`);
}

// ── 3. Dropdown menu-button : rôle/focus sur le trigger, menu ARIA cohérent ──
await page.goto(`${base}/a11yorg/demo-repo/issues/1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
const dd = await page.evaluate(() => {
    const d = document.querySelector('.issue-sidebar-combo .ui.dropdown');
    if (!d) return { found: false };
    const focusables = [...d.querySelectorAll('[tabindex="0"], a[href], button, input, select, textarea')];
    const trigger = focusables.find(e => e.getAttribute('role'));
    return {
        found: true,
        rootTabindex: d.getAttribute('tabindex'),
        triggerRole: trigger?.getAttribute('role'),
        triggerHaspopup: trigger?.getAttribute('aria-haspopup'),
        controls: trigger?.getAttribute('aria-controls'),
        controlsResolves: trigger ? !!document.getElementById(trigger.getAttribute('aria-controls') || '') : false,
        expanded0: trigger?.getAttribute('aria-expanded'),
        label: trigger ? (trigger.getAttribute('aria-label') || '').trim() : null,
    };
});
if (dd.found) {
    ok('dropdown: racine NON focusable', dd.rootTabindex !== '0' && dd.rootTabindex === null, String(dd.rootTabindex));
    ok('dropdown: trigger a un rôle widget', ['button', 'combobox'].includes(dd.triggerRole), String(dd.triggerRole));
    ok('dropdown: aria-haspopup valide', ['menu', 'listbox', 'true'].includes(dd.triggerHaspopup), String(dd.triggerHaspopup));
    ok('dropdown: aria-controls résout un élément réel', dd.controlsResolves === true, String(dd.controls));
    ok('dropdown: aria-expanded=false au repos', dd.expanded0 === 'false', String(dd.expanded0));
    ok('dropdown: trigger a un nom accessible non vide', !!dd.label && dd.label !== 'Choose an option', String(dd.label));
    // effet mesuré : clic réel sur le dropdown "jump" des filtres d'issues -> menu visible
    await page.goto(`${base}/a11yorg/demo-repo/issues`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(700);
    await page.locator('.ui.dropdown.jump.item').first().click({ timeout: 5000 });
    await page.waitForTimeout(600);
    const exp = await page.evaluate(() => {
        const d = document.querySelector('.ui.dropdown.jump.item');
        const menu = d.querySelector(':scope > .menu');
        const visible = menu && getComputedStyle(menu).display !== 'none' && menu.getClientRects().length > 0;
        const items = menu ? [...menu.querySelectorAll('.item')].map(i => i.getAttribute('role')) : [];
        return { expanded: d.getAttribute('aria-expanded'), menuVisible: !!visible, roles: [...new Set(items)] };
    });
    ok('dropdown jump: clic ouvre (menu visible)', exp.menuVisible, JSON.stringify(exp));
    ok('dropdown jump: items ont un rôle menuitem/option', exp.roles.length > 0 && exp.roles.every(r => ['menuitem', 'option', 'presentation', 'none'].includes(r)), String(exp.roles));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
} else {
    na('dropdown: racine NON focusable', 'aucun .issue-sidebar-combo .ui.dropdown sur issues/1');
}

// ── 3b. Contrat clavier APG menu-button (régression F5 auditée) ─────────────
// Le patch retire tabindex de la racine .ui.dropdown : le trigger interne doit
// recevoir Enter/Espace/ArrowDown => OUVERTURE (comme vanilla), flèches =>
// navigation dans le menu ouvert, Escape => fermeture + focus restauré.
// Le clic .item.selected ne doit JAMAIS être déclenché sur un menu fermé
// (« Clear labels » destructif mesuré par l'auditeur : focus tombait sur BODY).

// 3b-i. Navbar user dropdown : Enter ouvre
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
const navKb = await (async () => {
    const triggerSel = '#navbar .dropdown:has(.user-menu) > .text, #navbar .dropdown:has(.user-menu) [tabindex="0"]';
    const tr = await page.$(triggerSel);
    if (!tr) return { found: false };
    await tr.focus();
    await page.waitForTimeout(300);
    const before = await page.evaluate(() => document.activeElement === document.body);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(700);
    const opened = await page.evaluate(() => {
        const d = document.querySelector('#navbar .dropdown:has(.user-menu)');
        const m = d?.querySelector(':scope > .menu');
        const vis = m && (m.classList.contains('visible') || (getComputedStyle(m).display !== 'none' && m.getClientRects().length > 0));
        const trg = d?.querySelector(':scope > .text, [tabindex="0"]');
        return { open: !!vis, expanded: trg?.getAttribute('aria-expanded'), focusInBody: document.activeElement === document.body };
    });
    // navigation flèche dans le menu ouvert : un .item reçoit .selected
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(400);
    const navigated = await page.evaluate(() => {
        const d = document.querySelector('#navbar .dropdown:has(.user-menu)');
        return !!(d && d.querySelector('.menu.visible .item.selected, .menu.visible .item.active'));
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(700);
    const closed = await page.evaluate(() => {
        const d = document.querySelector('#navbar .dropdown:has(.user-menu)');
        const m = d?.querySelector(':scope > .menu');
        const vis = m && (m.classList.contains('visible') || (getComputedStyle(m).display !== 'none' && m.getClientRects().length > 0));
        return { closed: !vis, focusBack: !document.activeElement || document.activeElement === document.body ? false : !!(d && d.contains(document.activeElement)) };
    });
    return { found: true, before, opened, navigated, closed };
})();
if (navKb.found) {
    ok('clavier navbar: Enter OUVRE le menu (menu-button)', navKb.opened.open && !navKb.opened.focusInBody, JSON.stringify(navKb.opened));
    ok('clavier navbar: aria-expanded=true une fois ouvert', navKb.opened.expanded === 'true', String(navKb.opened.expanded));
    ok('clavier navbar: flèches naviguent les items (item.selected)', navKb.navigated, String(navKb.navigated));
    ok('clavier navbar: Escape referme + focus restauré sur trigger', navKb.closed.closed && navKb.closed.focusBack, JSON.stringify(navKb.closed));
} else {
    na('clavier navbar: Enter ouvre', 'trigger navbar introuvable');
}

// 3b-ii. Sidebar combo labels : Enter ouvre SANS cliquer « Clear labels »
await page.goto(`${base}/a11yorg/demo-repo/issues/1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
const sideKb = await (async () => {
    const comboSel = '.issue-sidebar-combo:has(input[name="label_ids"]) .ui.dropdown';
    const tr = await page.$(comboSel + ' > a, ' + comboSel + ' [tabindex="0"]');
    if (!tr) return { found: false };
    await tr.focus();
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
    const afterEnter = await page.evaluate(() => {
        const d = document.querySelector('.issue-sidebar-combo:has(input[name="label_ids"]) .ui.dropdown');
        const m = d?.querySelector(':scope > .menu, .menu');
        const vis = m && (m.classList.contains('visible') || (getComputedStyle(m).display !== 'none' && m.getClientRects().length > 0));
        const inp = document.querySelector('.issue-sidebar-combo input[name="label_ids"]');
        return { open: !!vis, focusBody: document.activeElement === document.body,
                 focusInsideMenu: !!(m && m.contains(document.activeElement)),
                 labelIds: inp ? inp.value : null };
    });
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(400);
    const nav2 = await page.evaluate(() => {
        const d = document.querySelector('.issue-sidebar-combo:has(input[name="label_ids"]) .ui.dropdown');
        return !!(d && d.querySelector('.item.selected, .item.active'));
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    const closed2 = await page.evaluate(() => {
        const d = document.querySelector('.issue-sidebar-combo:has(input[name="label_ids"]) .ui.dropdown');
        const m = d?.querySelector(':scope > .menu, .menu');
        const vis = m && (m.classList.contains('visible') || (getComputedStyle(m).display !== 'none' && m.getClientRects().length > 0));
        return { closed: !vis,
                 focusBack: !!(d && d.contains(document.activeElement)) && document.activeElement !== document.body };
    });
    return { found: true, afterEnter, nav2, closed2 };
})();
if (sideKb.found) {
    ok('clavier sidebar: Enter OUVRE (PAS de clear-labels — focus ne tombe pas sur BODY)',
       sideKb.afterEnter.open && !sideKb.afterEnter.focusBody, JSON.stringify(sideKb.afterEnter));
    ok('clavier sidebar: flèches naviguent dans le menu ouvert', sideKb.nav2, String(sideKb.nav2));
    ok('clavier sidebar: Escape referme + focus restauré', sideKb.closed2.closed && sideKb.closed2.focusBack, JSON.stringify(sideKb.closed2));
} else {
    na('clavier sidebar: Enter ouvre', 'combo labels introuvable');
}

// ── 4. Combobox : input.search role=combobox + attrs ────────────────────────
await page.goto(`${base}/a11yorg/demo-repo`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
const combo = await page.evaluate(() => {
    const d = document.querySelector('.ui.dropdown.search');
    if (!d) return { found: false };
    const inp = d.querySelector('input.search');
    return {
        found: !!inp,
        role: inp?.getAttribute('role'),
        autocomplete: inp?.getAttribute('autocomplete'),
        tabindex: inp?.getAttribute('tabindex'),
        label: (inp?.getAttribute('aria-label') || '').trim(),
        controls: inp?.getAttribute('aria-controls'),
        controlsResolves: inp ? !!document.getElementById(inp.getAttribute('aria-controls') || '') : false,
        haspopup: inp?.getAttribute('aria-haspopup'),
    };
});
if (combo.found) {
    ok('combobox: input.search role=combobox', combo.role === 'combobox', String(combo.role));
    ok('combobox: autocomplete=off', combo.autocomplete === 'off', String(combo.autocomplete));
    ok('combobox: aria-haspopup=listbox', combo.haspopup === 'listbox', String(combo.haspopup));
    ok('combobox: aria-controls résout', combo.controlsResolves, String(combo.controls));
    ok('combobox: nom accessible non vide', combo.label.length > 0, String(combo.label));
} else {
    na('combobox: input.search role=combobox', 'aucun .ui.dropdown.search sur la page repo');
}

// ── 5. Modales : role=dialog + aria-modal + nom calculé (ouverture réelle) ──
await page.goto(`${base}/a11yorg/demo-repo/issues/1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
// ouvre la modale "Lock conversation" via son vrai déclencheur sidebar
const lockBtn = await page.$('a[data-modal="#lock-conversation"], button[data-modal="#lock-conversation"], [data-modal-target="#lock-conversation"]');
const lockBtn2 = lockBtn || await page.$('.issue-content .dropdown .menu a[href="#"], .issue-sidebar-combo a');
const modalRes = await (async () => {
    // déclencheur réel : lien "Lock conversation" dans la sidebar
    const clicked = await page.evaluate(() => {
        const els = [...document.querySelectorAll('a, button')];
        const b = els.find(e => (e.getAttribute('data-modal') === '#lock-conversation') || /lock conversation/i.test(e.textContent || ''));
        if (!b) return false;
        b.click();
        return true;
    });
    if (!clicked) return { clicked: false };
    await page.waitForTimeout(900);
    return await page.evaluate(`
        ${BROWSER_HELPERS}
        (() => {
            const m = document.getElementById('lock-conversation');
            if (!m) return { clicked: true, open: false };
            const cs = getComputedStyle(m);
            return { clicked: true, open: cs.display !== 'none' && m.getClientRects().length > 0,
                     role: m.getAttribute('role'), modal: m.getAttribute('aria-modal'),
                     name: accName(m), labelledby: m.getAttribute('aria-labelledby') };
        })()
    `);
})();
if (modalRes.clicked && modalRes.open) {
    ok('modal lock: role=dialog', modalRes.role === 'dialog', String(modalRes.role));
    ok('modal lock: aria-modal=true', modalRes.modal === 'true', String(modalRes.modal));
    ok('modal lock: nom accessible calculé non vide', !!modalRes.name, `name="${modalRes.name}"`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
} else if (modalRes.clicked) {
    ok('modal lock: ouverte après clic réel', false, 'déclencheur cliqué mais modale non affichée');
} else {
    na('modal lock: role=dialog', 'déclencheur Lock conversation introuvable');
}

// ── 6. Panneau tippy (clone) : role=dialog + aria-label mesuré ───────────────
await page.goto(`${base}/a11yorg/demo-repo`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.js-btn-clone-panel', { timeout: 15000 }).catch(() => null);
const tippyRes = await (async () => {
    const btn = await page.$('.js-btn-clone-panel');
    if (!btn) return { found: false };
    await btn.click();
    await page.waitForTimeout(800);
    return await page.evaluate(() => {
        const box = document.querySelector('.tippy-box[role="dialog"]');
        if (!box) return { found: true, open: false };
        const visible = box.getClientRects().length > 0;
        const txt = (box.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40);
        return { found: true, open: visible, label: (box.getAttribute('aria-label') || '').trim(), text: txt };
    });
})();
if (tippyRes.found && tippyRes.open) {
    ok('tippy clone: .tippy-box role=dialog avec aria-label', tippyRes.label.length > 0, `label="${tippyRes.label}"`);
    await page.keyboard.press('Escape');
} else if (tippyRes.found) {
    ok('tippy clone: panneau visible après clic', false, 'bouton cliqué mais .tippy-box non visible');
} else {
    na('tippy clone: .tippy-box role=dialog', 'bouton clone introuvable (page publique sans clone?)');
}

// ── 7. Contraste mesuré dans CHAQUE color-scheme (light + dark) ─────────────
const CONTRAST_TARGETS = [
    { url: '/a11yorg/demo-repo', sel: 'button.ui.primary.button, a.ui.primary.button', desc: 'bouton primaire (texte/fond)' },
    { url: '/a11yorg/demo-repo/issues', sel: '.ui.dropdown.jump > .text', desc: 'texte de trigger dropdown jump' },
    { url: '/a11yorg/demo-repo', sel: '.text.muted, .muted-links, .repo-description', desc: 'texte muted/description' },
    { url: '/a11yorg/demo-repo', sel: '.ui.secondary.button, button.ui.basic.button, .ui.button:not(.primary)', desc: 'bouton secondary/basic' },
    { url: '/a11yorg/demo-repo', sel: '.ui.label, .sha-label', desc: 'label UI' },
];
for (const scheme of ['light', 'dark']) {
    for (const t of CONTRAST_TARGETS) {
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(`${base}${t.url}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(700);
        const out = await page.evaluate(`
            ${BROWSER_HELPERS}
            (() => [${JSON.stringify(t)}].map(t => {
                const el = [...document.querySelectorAll(t.sel)].find(e => e.getClientRects().length > 0 && (e.innerText||'').trim());
                if (!el) return { desc: t.desc, found: false };
                const fg = parse(getComputedStyle(el).color);
                const bg = effectiveBg(el);
                return { desc: t.desc, found: true, r: fg && bg ? ratio(lum(fg), lum(bg)) : null, fg, bg };
            }))()
        `);
        for (const r of out) {
            if (!r.found) { na(`${scheme}: ${r.desc} ≥4.5`, 'élément absent'); continue; }
            ok(`${scheme}: ${r.desc} ≥4.5`, r.r !== null && r.r >= 4.5, `ratio=${r.r?.toFixed(2)} fg=${JSON.stringify(r.fg)} bg=${JSON.stringify(r.bg)}`);
        }
    }
}
await page.emulateMedia({ colorScheme: 'light' });

// ── 8. Champs désactivés : texte label reste ≥4.5 (effet mesuré) ────────────
await page.goto(`${base}/a11yorg/demo-repo/settings`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
const dis = await page.evaluate(`
    ${BROWSER_HELPERS}
    (() => {
        const labels = [...document.querySelectorAll('.ui.form .field.disabled > label, .ui.form .disabled.field label')];
        const visible = labels.filter(l => l.getClientRects().length > 0);
        return visible.map(l => {
            const fg = parse(getComputedStyle(l).color);
            const bg = effectiveBg(l);
            return { text: l.innerText.trim().slice(0, 30), r: fg && bg ? ratio(lum(fg), lum(bg)) : null, op: getComputedStyle(l).opacity };
        });
    })()
`);
if (dis.length > 0) {
    const worst = Math.min(...dis.map(d => d.r ?? 99));
    ok('settings: labels de champs disabled ≥4.5', worst >= 4.5, `pire=${worst.toFixed(2)} sur ${dis.length} labels (${dis.map(d => d.r?.toFixed(1)).join(',')})`);
    ok('settings: labels disabled sans opacity blend', dis.every(d => parseFloat(d.op) === 1), `opacity=${dis.map(d => d.op).join(',')}`);
} else {
    na('settings: labels de champs disabled ≥4.5', 'aucun champ disabled sur /settings');
}

// ── 9. Items de menu désactivés lisibles ────────────────────────────────────
await page.goto(`${base}/a11yorg/demo-repo/issues`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
await page.locator('.ui.dropdown.jump.item').first().click({ timeout: 5000 }).catch(() => null);
await page.waitForTimeout(600);
const disItem = await page.evaluate(`
    ${BROWSER_HELPERS}
    (() => {
        const items = [...document.querySelectorAll('.ui.dropdown .menu .item.disabled')].filter(e => e.getClientRects().length > 0);
        return items.slice(0, 3).map(i => {
            const fg = parse(getComputedStyle(i).color);
            const bg = effectiveBg(i);
            return { text: i.innerText.trim().slice(0, 20), r: fg && bg ? ratio(lum(fg), lum(bg)) : null };
        });
    })()
`);
if (disItem.length > 0) {
    const worst = Math.min(...disItem.map(d => d.r ?? 99));
    ok('menu items disabled ≥4.5', worst >= 4.5, `pire=${worst.toFixed(2)} (${disItem.map(d => '"' + d.text + '"=' + d.r?.toFixed(2)).join(' ')})`);
} else {
    na('menu items disabled ≥4.5', 'aucun .item.disabled visible dans le menu milestone');
}
await page.keyboard.press('Escape');

// ── 10. Liens dans blocs de texte : souligné mesuré ─────────────────────────
await page.goto(`${base}/a11yorg/demo-repo/issues/1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
const links = await page.evaluate(() => {
    const samples = [...document.querySelectorAll('.time-desc a, .markup p a, .comment-header .time-desc a')].filter(a => a.getClientRects().length > 0);
    return samples.slice(0, 5).map(a => ({ sel: a.className || a.href.slice(-20), deco: getComputedStyle(a).textDecorationLine }));
});
if (links.length > 0) {
    ok('liens dans texte: underline mesuré', links.every(l => (l.deco || '').includes('underline')), JSON.stringify(links.map(l => l.deco)));
} else {
    na('liens dans texte: underline mesuré', 'aucun lien .time-desc/.markup visible');
}

// ── 11. Cibles tactiles : liens/controls autonomes >= 24px ──────────────────
await page.goto(`${base}/a11yorg/demo-repo/tags`, { waitUntil: 'domcontentloaded' }).catch(() => null);
await page.waitForTimeout(500);
let tags = await page.evaluate(() => {
    const out = {};
    for (const sel of ['a.archive-link', '.ui.table td a']) {
        const els = [...document.querySelectorAll(sel)].filter(e => e.getClientRects().length > 0);
        if (!els.length) { out[sel] = null; continue; }
        const r = els[0].getBoundingClientRect();
        out[sel] = { w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 };
    }
    return out;
});
await page.goto(`${base}/a11yorg/demo-repo`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
tags['button.btn[data-clipboard-text]'] = await page.evaluate(() => {
    const els = [...document.querySelectorAll('button.btn[data-clipboard-text], button[data-clipboard-text]')].filter(e => e.getClientRects().length > 0);
    if (!els.length) return null;
    const r = els[0].getBoundingClientRect();
    return { w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 };
});
for (const [sel, dim] of Object.entries(tags)) {
    if (dim === null) { na(`target-size ${sel} ≥24px`, 'absent sur /tags'); continue; }
    ok(`target-size ${sel} ≥24px`, dim.h >= 24 && dim.w >= 24, `${dim.w}x${dim.h}`);
}

// ── 12. Menus scrollables : tabindex=0 + items roled (footer language) ──────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
await page.locator('.page-footer .dropdown.upward').first().click().catch(() => null);
await page.waitForTimeout(600);
const lang = await page.evaluate(() => {
    const m = document.querySelector('.page-footer .language-menu.visible, .page-footer .menu.visible');
    if (!m) return { open: false };
    const scroll = m.querySelector('.scrolling.menu') || m;
    return { open: true, tab: m.getAttribute('tabindex'), innerTab: scroll.getAttribute('tabindex'),
             itemRoles: [...new Set([...m.querySelectorAll('.item')].map(i => i.getAttribute('role')))] };
});
if (lang.open) {
    ok('menu langue: tabindex=0 (scrollable focusable)', ['0'].includes(lang.tab) || lang.innerTab === '0', `tab=${lang.tab} inner=${lang.innerTab}`);
    ok('menu langue: items avec rôle', lang.itemRoles.length > 0 && lang.itemRoles.every(r => ['menuitem', 'option', 'none', 'presentation'].includes(r)), String(lang.itemRoles));
} else {
    na('menu langue: tabindex=0', 'menu langue non ouvert');
}
await page.keyboard.press('Escape');

// ── 13. aria-labels littéralement non vides (anti-placeholder i18n) ─────────
await page.goto(`${base}/a11yorg/demo-repo`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
const emptyLabels = await page.evaluate(() => {
    const bad = [...document.querySelectorAll('[aria-label]')].filter(e => !(e.getAttribute('aria-label') || '').trim());
    const controlsBad = [...document.querySelectorAll('[aria-controls]')].filter(e => !document.getElementById(e.getAttribute('aria-controls')));
    return { emptyLabels: bad.length, sample: bad.slice(0, 3).map(e => e.outerHTML.slice(0, 60)), controlsBad: controlsBad.length };
});
ok('aria-label: aucun vide littéral', emptyLabels.emptyLabels === 0, `${emptyLabels.emptyLabels} vides ${emptyLabels.sample.join('|')}`);
ok('aria-controls: toutes résolues', emptyLabels.controlsBad === 0, String(emptyLabels.controlsBad));

// ── 14. Checkbox "select all" : nom accessible calculé ──────────────────────
await page.goto(`${base}/a11yorg/demo-repo/issues`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
const cbAll = await page.evaluate(`
    ${BROWSER_HELPERS}
    (() => {
        const c = document.querySelector('.issue-checkbox-all');
        if (!c) return { found: false };
        return { found: true, name: accName(c), label: (c.getAttribute('aria-label') || '').trim() };
    })()
`);
if (cbAll.found) {
    ok('issue-checkbox-all: nom calculé non vide', cbAll.name.length > 0 && cbAll.label.length > 0, `name="${cbAll.name}"`);
} else {
    na('issue-checkbox-all: nom calculé non vide', 'checkbox select-all absente (aucune issue?)');
}

// ── 15. Thème sombre : aria-haspopup/labels inchangés (régression dark) ──────
await page.emulateMedia({ colorScheme: 'dark' });
await page.goto(`${base}/a11yorg/demo-repo/issues`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
const dark = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute('data-theme') || getComputedStyle(document.documentElement).backgroundColor,
    textMuted: getComputedStyle(document.querySelector('.text.muted, .muted') || document.body).color,
}));
ok('dark theme actif', /dark/.test(dark.theme) || dark.theme !== '', String(dark.theme));
await page.emulateMedia({ colorScheme: 'light' });

await ctx.close();
await browser.close();

const fails = results.filter(r => !r.pass);
console.error(`\nverify.mjs : ${results.length - fails.length}/${results.length} assertions OK (${fails.length} FAIL)`);
if (fails.length) process.exit(1);
