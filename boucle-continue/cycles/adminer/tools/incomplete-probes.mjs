// Sondes traçables pour les noeuds "incomplete" d'axe (cycle 21 — adminer).
// Pour chaque nœud incomplete : rejoue l'état, calcule la couleur de premier
// plan et le fond effectif (remontée d'ancêtres), calcule le ratio WCAG,
// et rend un verdict PASS/FAIL avec la mesure. Sortie : JSON sur stdout.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.env.A11Y_BASE || 'http://localhost:8080';
const STORAGE = process.env.A11Y_STORAGE || new URL('./auth.json', import.meta.url).pathname;
const REPORT = process.env.A11Y_REPORT || new URL('../reports/iter3/auth/report.json', import.meta.url).pathname;

const rel = (r, g, b) => {
	const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
	return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (c1, c2) => {
	const [l1, l2] = [rel(...c1.slice(0, 3)), rel(...c2.slice(0, 3))].sort((a, b) => b - a);
	return (l1 + 0.05) / (l2 + 0.05);
};

const report = JSON.parse(readFileSync(REPORT, 'utf8'));
const nodes = [];
for (const p of report.pages) {
	for (const v of p.incomplete || []) {
		for (const n of v.nodes) {
		// l'état est encodé dans l'URL de la page : "…&sql= [state:nom]"
		const m = String(p.url).match(/^(.*?) \[state:(.*)\]$/);
		nodes.push({ page: m ? m[1] : p.url, state: m ? m[2] : '', rule: v.id, target: n.target[0] });
	}
	}
}
console.error(`${nodes.length} noeuds incomplets à sonder`);

const browser = await chromium.launch();
const context = await browser.newContext({ storageState: STORAGE });
const page = await context.newPage();

const measure = async sel => await page.evaluate(sel2 => {
	const el = document.querySelector(sel2);
	if (!el) return { found: false };
	const rgba = s => { const m = s && s.match(/[\d.]+/g); return m ? m.map(Number) : null; };
	const cs = getComputedStyle(el);
	const fg = rgba(cs.color);
	let bg = null, bgFrom = null, node = el;
	while (node && node !== document.documentElement) {
		const b = rgba(getComputedStyle(node).backgroundColor);
		if (b && b[3] > 0) { bg = b; bgFrom = node.tagName + '.' + String(node.className).slice(0, 40); break; }
		node = node.parentElement;
	}
	if (!bg) { bg = rgba(getComputedStyle(document.body).backgroundColor) || [255, 255, 255, 1]; bgFrom = 'body'; }
	const fs = parseFloat(cs.fontSize), bold = cs.fontWeight === 'bold' || parseInt(cs.fontWeight) >= 700;
	const r = el.getBoundingClientRect();
	// élément visible / couvert par un overlay ?
	const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
	const covered = top ? !el.contains(top) && !top.contains(el) : true;
	return { found: true, fg, bg, bgFrom, fontSize: fs, bold, covered, text: el.textContent.trim().slice(0, 60) };
}, sel);

const setupMobile = async () => { // rejoue tools/audit.mjs STATES['menu-mobile-ouvert']
	await page.setViewportSize({ width: 375, height: 800 });
	await page.reload({ waitUntil: 'load' });
	await page.locator('#menuopen button').click();
	await page.waitForSelector('#menuopen button[aria-expanded="true"]', { timeout: 10000 });
};

const results = [];
let lastKey = null;
for (const n of nodes) {
	const key = n.page + '|' + n.state;
	if (key !== lastKey) {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto(n.page, { waitUntil: 'load' });
		if (n.state === 'menu-mobile-ouvert') await setupMobile();
		lastKey = key;
	}
	const m = await measure(n.target);
	let verdict = 'INDETERMINED', detail = '';
	if (!m.found) { verdict = 'SKIP'; detail = 'élément absent (état non rejoué)'; }
	else if (n.rule === 'color-contrast') {
		const r = ratio(m.fg, m.bg);
		const need = (m.fontSize >= 24 || (m.bold && m.fontSize >= 18.66)) ? 3 : 4.5;
		verdict = r >= need ? 'PASS' : 'FAIL';
		detail = `fg=rgb(${m.fg.slice(0, 3).join(',')}) bg=rgb(${m.bg.slice(0, 3).join(',')}) @${m.bgFrom} ratio=${r.toFixed(2)} need=${need}${m.covered ? ' [couvert]' : ''}`;
	} else if (n.rule === 'th-has-data-cells') {
		const t = await page.evaluate(sel2 => {
			const t = document.querySelector(sel2);
			if (!t) return null;
			const ths = [...t.querySelectorAll('th')];
			return { rows: t.rows.length, ths: ths.length, empty: ths.filter(th => !th.textContent.trim()).length };
		}, n.target);
		verdict = t && t.ths > 0 && t.empty === 0 ? 'PASS' : 'FAIL';
		detail = `rows=${t && t.rows} th=${t && t.ths} th-vides=${t && t.empty}`;
	}
	results.push({ rule: n.rule, page: n.page, state: n.state, target: n.target, verdict, detail });
	console.error(`${verdict} ${n.rule} ${n.target} ${detail}`);
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
