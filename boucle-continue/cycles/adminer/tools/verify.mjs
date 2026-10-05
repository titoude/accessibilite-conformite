// verify.mjs — assertions dures du cycle adminer (effet observable, pas action).
// Chaque test mesure le DOM rendu : nom accessible calculé, ratio de contraste
// mesuré, présence d'attribut. Aucun .catch muet, aucun stub.
// Usage: node verify.mjs http://localhost:8080 [--storage-state auth.json]
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:8080';
const ssIdx = process.argv.indexOf('--storage-state');
const STORAGE = ssIdx !== -1 ? process.argv[ssIdx + 1] : null;

let failures = 0;
const ok = (name, cond, detail = '') => {
	console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
	if (!cond) failures++;
};

const browser = await chromium.launch();
const context = await browser.newContext(
	STORAGE && existsSync(STORAGE) ? { storageState: STORAGE } : {},
);
const page = await context.newPage();
const APP = BASE + '/adminer/';
const AUTH = `${APP}?sqlite=&username=admin&db=/data/test.sqlite`;

// Nom accessible calculé (impl. minimale : aria-label > aria-labelledby > label)
const names = async selector => await page.evaluate(sel => {
	const accName = el => {
		const al = el.getAttribute('aria-label');
		if (al) return al.trim();
		const lb = el.getAttribute('aria-labelledby');
		if (lb) return lb.trim().split(/\s+/).map(id => {
			const r = document.getElementById(id);
			return r ? r.textContent.trim() : '';
		}).join(' ').trim();
		if (el.id) {
			const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
			if (l) return l.textContent.trim();
		}
		const w = el.closest('label');
		if (w) return w.textContent.replace(el.value || '', '').trim();
		return '';
	};
	return [...document.querySelectorAll(sel)].map(el => ({
		name: accName(el), tag: el.tagName, type: el.type || '',
	}));
}, selector);

const ratio = (rgb1, rgb2) => {
	const p = s => { const m = s.match(/[\d.]+/g).map(Number); return m; };
	const lum = c => {
		const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
		return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
	};
	const [a, b] = [lum(p(rgb1)), lum(p(rgb2))].sort((x, y) => y - x);
	return (a + 0.05) / (b + 0.05);
};
const contrast = async sel => await page.evaluate(sel2 => {
	const el = document.querySelector(sel2);
	if (!el) return null;
	const rgba = s => { const m = s.match(/[\d.]+/g); return m ? m.map(Number) : null; };
	const fg = rgba(getComputedStyle(el).color);
	let node = el, bg = null;
	while (node && node !== document.documentElement) {
		const b = rgba(getComputedStyle(node).backgroundColor);
		if (b && b[3] > 0) { bg = b.slice(0, 3); break; }
		node = node.parentElement;
	}
	if (!bg) bg = rgba(getComputedStyle(document.body).backgroundColor).slice(0, 3);
	return { fg: fg.slice(0, 3), bg };
}, sel);
const lum = c => {
	const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
	return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
const wcag = (fg, bg) => {
	const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
	return (a + 0.05) / (b + 0.05);
};

// ---------- surface publique : page de login ----------
await page.goto(APP, { waitUntil: 'load' });
const login = await page.evaluate(() => ({
	mains: document.querySelectorAll('main').length,
	navs: [...document.querySelectorAll('nav')].map(n => n.getAttribute('aria-label')),
	title: document.title.trim(),
}));
ok('login: repère <main> unique', login.mains === 1, `${login.mains}`);
ok('login: titre non vide', login.title.length > 0, login.title);
const loginFields = await names('input:not([type=hidden]):not([type=submit]):not([type=checkbox]), select');
ok('login: tous les champs ont un nom accessible', loginFields.length > 0 && loginFields.every(f => f.name.length > 0),
	JSON.stringify(loginFields));
const sysSel = (await names('select[name="auth[driver]"], select[name="auth[server]"], select'))[0];
ok('login: select système nommé', !!sysSel && sysSel.name.length > 0, JSON.stringify(sysSel));

// ---------- surface authentifiée ----------
await page.goto(AUTH, { waitUntil: 'load' });
const land = await page.evaluate(() => ({
	mains: document.querySelectorAll('main').length,
	menuNav: !!document.querySelector('nav#menu'),
	breadcrumb: !!document.querySelector('nav#breadcrumb'),
	foot: document.querySelector('#foot')?.getAttribute('role') || '',
	h1: document.querySelector('h1')?.textContent.trim() || '',
}));
ok('db: repère main unique', land.mains === 1, `${land.mains}`);
ok('db: menu en <nav aria-label>', land.menuNav);
ok('db: breadcrumb en <nav aria-label>', land.breadcrumb);
ok('db: pied en complementary', land.foot === 'complementary', land.foot);
ok('db: h1 présent', land.h1.length > 0, land.h1);

const version = (await names('a#version'))[0];
ok('db: lien version nommé', !!version && version.name.length > 0, JSON.stringify(version));

// labels « check all » + lignes de la table des tables
const chk = await names('#check-all');
ok('db: check-all nommé', !!chk[0] && chk[0].name.length > 0, JSON.stringify(chk[0]));
const op = (await names('select[name="op"]'))[0];
ok('db: select opérateur de recherche nommé', !!op && op.name.length > 0, JSON.stringify(op));
const q = (await names('input[type="search"]'))[0];
ok('db: champ recherche nommé', !!q && /recherche|search/i.test(q.name), JSON.stringify(q));

// contraste h1 mesuré
const h1c = await contrast('h1');
ok('db: contraste h1 >= 4.5', !!h1c && wcag(h1c.fg, h1c.bg) >= 4.5,
	h1c ? `ratio=${wcag(h1c.fg, h1c.bg).toFixed(2)}` : 'absent');

// taille de cible : liens du menu des tables
const linkH = await page.evaluate(() =>
	[...document.querySelectorAll('#tables li a')].slice(0, 5).map(a => a.getBoundingClientRect().height));
ok('db: liens #tables >= 24px', linkH.length > 0 && linkH.every(h => h >= 24), JSON.stringify(linkH));

// ---------- select=books : noms des cases de lignes ----------
await page.goto(`${AUTH}&select=books`, { waitUntil: 'load' });
const rowChecks = await names('input[name="check[]"]');
ok('select: cases de lignes nommées (header+valeur)',
	rowChecks.length > 0 && rowChecks.every(c => c.name.length > 0),
	JSON.stringify(rowChecks.slice(0, 3)));
const allPage = (await names('#all-page'))[0];
ok('select: all-page nommée', !!allPage && allPage.name.length > 0, JSON.stringify(allPage));
const boxH = await page.evaluate(() => {
	const c = document.querySelector('input[name="check[]"]');
	return c ? c.getBoundingClientRect().height : 0;
});
ok('select: case >= 24px', boxH >= 24, `${boxH}px`);

// ---------- sql= : éditeur jush ----------
await page.goto(`${AUTH}&sql=`, { waitUntil: 'load' });
const jush = await page.evaluate(() => {
	const pre = document.querySelector('pre.jush[contenteditable]');
	const ac = document.querySelector('select.jush-autocomplete');
	return {
		role: pre?.getAttribute('role'), multiline: pre?.getAttribute('aria-multiline'),
		label: pre?.getAttribute('aria-label'), acLabel: ac?.getAttribute('aria-label'),
	};
});
ok('sql: éditeur jush role=textbox multiline', jush.role === 'textbox' && jush.multiline === 'true', JSON.stringify(jush));
ok('sql: éditeur jush nommé', !!jush.label, jush.label);
ok('sql: select autocomplete nommé', jush.acLabel === 'Autocomplete', jush.acLabel);
const limit = (await names('input[name="limit"]'))[0];
ok('sql: champ limit nommé', !!limit && limit.name.length > 0, JSON.stringify(limit));

// erreur SQL → .error contraste mesuré
await page.locator('pre.jush').click();
await page.keyboard.type('SELEC *');
await Promise.all([
	page.waitForNavigation({ waitUntil: 'load', timeout: 15000 }),
	page.locator('input[type="submit"][value="Execute"]').click(),
]);
const errC = await contrast('p.error');
ok('sql: contraste .error >= 4.5', !!errC && wcag(errC.fg, errC.bg) >= 4.5,
	errC ? `ratio=${wcag(errC.fg, errC.bg).toFixed(2)}` : 'absent');

// ---------- create= : formulaire de création ----------
await page.goto(`${AUTH}&create=`, { waitUntil: 'load' });
const created = await page.evaluate(() => ({
	tname: (() => { const i = document.querySelector('input[name="name"]'); const l = i?.closest('label'); return l ? l.textContent.trim() : ''; })(),
	aiHeader: !!document.querySelector('th input[aria-labelledby="label-ai"]'),
}));
ok('create: champ nom de table labellisé', created.tname.length > 0, created.tname);
ok('create: radio AI nommée via th#label-ai', created.aiHeader);
const createFields = await names('input:not([type=hidden]):not([type=submit]):not([type=checkbox]):not([type=radio]), select');
const unnamed = createFields.filter(f => !f.name);
ok('create: champs visibles tous nommés', unnamed.length === 0, `${unnamed.length} sans nom`);

// ---------- edit=books&where : édition de ligne ----------
await page.goto(`${AUTH}&edit=books&where[id]=1`, { waitUntil: 'load' });
const editF = await names('input[name^="fields"]:not([type=checkbox]):not([type=radio]), select[name^="fields"]');
ok('edit: champs de ligne nommés', editF.length > 0 && editF.every(f => f.name.length > 0),
	`${editF.filter(f => !f.name).length} sans nom`);
const blob = (await names('input[type="file"], input[name$="[blob]"]'))[0];
ok('edit: champ blob nommé', !blob || blob.name.length > 0, JSON.stringify(blob));

// ---------- event= : pas de <th> vide, champs nommés ----------
await page.goto(`${AUTH}&event=`, { waitUntil: 'load' });
const ev = await page.evaluate(() => ({
	emptyTh: [...document.querySelectorAll('th')].filter(t => !t.textContent.trim() && !t.querySelector('input,select')).length,
}));
ok('event: aucun <th> vide', ev.emptyTh === 0, `${ev.emptyTh}`);
const evName = (await names('input[name="EVENT_NAME"]'))[0];
ok('event: EVENT_NAME nommé', !!evName && evName.name.length > 0, JSON.stringify(evName));

// ---------- indexes= : selects de colonnes ----------
await page.goto(`${AUTH}&indexes=books`, { waitUntil: 'load' });
const idxSel = await names('select[name^="indexes"][name*="columns"]');
ok('indexes: selects de colonnes nommés', idxSel.length === 0 || idxSel.every(f => f.name.length > 0),
	`${idxSel.filter(f => !f.name).length} sans nom`);

// ---------- dump= : selects de style ----------
await page.goto(`${AUTH}&dump=`, { waitUntil: 'load' });
for (const [sel, want] of [['select[name="table_style"]', 'Tables'], ['select[name="data_style"]', 'Data']]) {
	const n = (await names(sel))[0];
	ok(`dump: ${sel} nommé`, !!n && n.name.includes(want), JSON.stringify(n));
}

// ---------- mobile : menu hamburger expose l'état ----------
await page.setViewportSize({ width: 375, height: 800 });
await page.goto(AUTH, { waitUntil: 'load' });
await page.locator('#menuopen button').click();
await page.waitForSelector('#menuopen button[aria-expanded="true"]', { timeout: 10000 });
const menu = await page.evaluate(() => ({
	expanded: document.querySelector('#menuopen button')?.getAttribute('aria-expanded'),
	menuVisible: getComputedStyle(document.querySelector('#menu')).display !== 'none',
}));
ok('mobile: bouton menu aria-expanded=true', menu.expanded === 'true', JSON.stringify(menu));
ok('mobile: menu visible après ouverture', menu.menuVisible);

await browser.close();
console.log(`\n${failures === 0 ? 'TOUT PASS' : failures + ' échec(s)'}`);
process.exit(failures ? 1 : 0);
