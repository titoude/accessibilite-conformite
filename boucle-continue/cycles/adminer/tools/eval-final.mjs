// eval-final.mjs — parcours utilisateur indépendant du cycle adminer.
// Ne teste pas les corrections une par une : rejoue des critères WCAG
// génériques (structure, nommage, clavier, reflow) comme le ferait un
// utilisateur qui navigue le produit. Usage: node eval-final.mjs <baseUrl>
import { chromium } from 'playwright';
import { existsSync, readFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:8080';
const ssIdx = process.argv.indexOf('--storage-state');
const STORAGE = ssIdx !== -1
	? process.argv[ssIdx + 1]
	: new URL('./auth.json', import.meta.url).pathname;

let failures = 0;
const ok = (name, cond, detail = '') => {
	console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
	if (!cond) failures++;
};

const AUTH_PREFIX = '/adminer/?sqlite=&username=admin&db=/data/test.sqlite';
const PAGES = readFileSync(new URL('./urls-auth.txt', import.meta.url), 'utf8')
	.split('\n').map(l => l.trim()).filter(Boolean)
	.map(l => (/^https?:/.test(l) ? l : BASE + l));

const browser = await chromium.launch();
const context = await browser.newContext(
	existsSync(STORAGE) ? { storageState: STORAGE } : {},
);
const page = await context.newPage();
await page.setViewportSize({ width: 1280, height: 800 });

// Évaluation générique : titre, h1 unique, repère main, champs nommés
const audit = async u => {
	await page.goto(u, { waitUntil: 'load' });
	return await page.evaluate(() => {
		const accName = el => {
			const al = el.getAttribute('aria-label');
			if (al) return al;
			const lb = el.getAttribute('aria-labelledby');
			if (lb) return lb.trim().split(/\s+/).map(i =>
				document.getElementById(i)?.textContent.trim() || '').join(' ').trim();
			if (el.id) {
				const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
				if (l) return l.textContent.trim();
			}
			const w = el.closest('label');
			if (w) return w.textContent.trim();
			return el.getAttribute('title') || ''; // title est un accname WCAG valide
		};
		const controls = [...document.querySelectorAll(
			'input:not([type=hidden]):not([type=submit]):not([type=image]), select, textarea, [contenteditable="true"], button',
		)].filter(el => el.offsetParent !== null || el.offsetHeight > 0);
		return {
			title: document.title.trim(),
			h1s: document.querySelectorAll('h1').length,
			mains: document.querySelectorAll('main, [role="main"]').length,
			unnamed: controls.filter(c => !accName(c)).map(c => c.name || c.tagName),
		};
	});
};

// E1 — page de login : structure + champs nommés
await page.goto(BASE + '/adminer/', { waitUntil: 'load' });
const loginR = await page.evaluate(() => ({
	title: document.title.trim(),
	mains: document.querySelectorAll('main').length,
	submit: [...document.querySelectorAll('input[type=submit],button[type=submit]')].length,
}));
ok('E1 login: titre + repère main', loginR.title.length > 0 && loginR.mains >= 1, JSON.stringify(loginR));

// E2 — chaque page du périmètre authentifié : h1, main unique, champs nommés
for (const u of PAGES) {
	const r = await audit(u);
	const short = u.split('&db')[1] || u.slice(-40);
	ok(`E2 ${short}: h1 + main + champs nommés`,
		r.h1s === 1 && r.mains === 1 && r.title.length > 0 && r.unnamed.length === 0,
		r.unnamed.length ? `sans nom: ${r.unnamed.slice(0, 5).join(',')}` : '');
}

// E3 — parcours clavier : le focus est visible (outline ou équivalent) sur la page principale
await page.goto(BASE + AUTH_PREFIX, { waitUntil: 'load' });
await page.keyboard.press('Tab');
const focus = await page.evaluate(() => {
	const a = document.activeElement;
	if (!a || a === document.body) return { focused: false };
	const cs = getComputedStyle(a);
	return { focused: true, outline: cs.outlineStyle !== 'none' || cs.boxShadow !== 'none' };
});
ok('E3 Tab clavier atteint un élément focusable visible', focus.focused && focus.outline);

// E4 — reflow 320px : pas de défilement horizontal sur la vue base de données
await page.setViewportSize({ width: 320, height: 568 });
await page.goto(BASE + AUTH_PREFIX, { waitUntil: 'load' });
const reflow = await page.evaluate(() => ({
	sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
}));
ok('E4 reflow 320px sans scroll horizontal', reflow.sw <= reflow.cw + 1, `${reflow.sw}vs${reflow.cw}`);

// E5 — le menu mobile s'ouvre et ferme au clavier-état aria-expanded
await page.locator('#menuopen button').click();
const expanded = await page.evaluate(() =>
	document.querySelector('#menuopen button')?.getAttribute('aria-expanded'));
ok('E5 bouton menu expose aria-expanded', expanded === 'true', String(expanded));

// E6 — utilisateur : la page user= ne fuit plus d'avertissements PHP dans le DOM
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(`${BASE}${AUTH_PREFIX}&user=`, { waitUntil: 'load' });
const warns = await page.evaluate(() =>
	document.body.innerText.split('\n').filter(l => /^(Warning|Notice|Deprecated)/.test(l)).length);
ok('E6 user=: aucun warning PHP rendu', warns === 0, `${warns} warning(s)`);

// E7 — parcours réel : cocher une ligne puis ouvrir son édition fonctionne
await page.goto(`${BASE}${AUTH_PREFIX}&select=books`, { waitUntil: 'load' });
await page.locator('input[name="check[]"]').first().click();
const checked = await page.evaluate(() => document.querySelector('input[name="check[]"]').checked);
ok('E7 case de ligne cochable', checked === true);
await page.locator('a.edit').first().click();
await page.waitForLoadState('load');
const editOk = await page.evaluate(() => ({
	url: location.href, form: !!document.querySelector('form'),
}));
ok('E7 navigation vers édition de la ligne', /edit=books/.test(editOk.url) && editOk.form, editOk.url.slice(-50));

await browser.close();
console.log(`\n${failures === 0 ? 'TOUT PASS' : failures + ' échec(s)'}`);
process.exit(failures ? 1 : 0);
