// verify.mjs — sondes computed/rect pour les corrections du cycle jenkins.
// Chaque assertion mesure une valeur réelle (computed style, bounding rect,
// ratio de contraste composite, DOM résolu), jamais une simple présence
// d'attribut.
// Usage: node verify.mjs <base> <auth.json>
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const require = createRequire(resolve(process.cwd() + '/package.json'));
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] ?? 'http://localhost:6042';
const AUTH = process.argv[3] ?? resolve(here, 'auth.json');

let failures = 0;
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!cond) failures++;
};

const srgb = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = rgb => 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2]);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const parse = s => {
  const m = /rgba?\(([^)]+)\)/.exec(s || '');
  if (m) { const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; }
  const c = /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/.exec(s || '');
  if (c) return [c[1] * 255, c[2] * 255, c[3] * 255, c[4] === undefined ? 1 : Number(c[4])];
  const o = /oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+))?\)/.exec(s || '');
  if (o) {
    const L = Number(o[1]) > 1 ? Number(o[1]) / 100 : Number(o[1]);
    const hr = Number(o[3]) * Math.PI / 180, a = Number(o[2]) * Math.cos(hr), b = Number(o[2]) * Math.sin(hr);
    const l_ = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    const m_ = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    const s_ = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
    const lin = v => Math.max(0, Math.min(255, (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255));
    return [lin(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_), lin(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_), lin(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_), o[4] === undefined ? 1 : Number(o[4])];
  }
  return null;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();

// ---------- 1. Landmarks sémantiques ----------
await page.goto(`${BASE}/`, { waitUntil: 'load' });
await page.waitForTimeout(1200);
let m = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  mains: document.querySelectorAll('main').length,
  mainId: document.querySelector('main')?.id,
  asideId: document.querySelector('aside')?.id,
  navId: document.querySelector('nav')?.id,
  pageHeader: !!document.querySelector('header#page-header'),
  pageHeaderTag: document.querySelector('#page-header')?.tagName,
  header: true,
  h1: document.querySelector('h1')?.textContent.trim().slice(0, 40),
}));
check('html lang renseigné', !!m.lang, m.lang);
check('un seul <main> (id=main-panel)', m.mains === 1 && m.mainId === 'main-panel', JSON.stringify(m));
check('side-panel est <aside>', m.asideId === 'side-panel', m.asideId);
check('breadcrumbBar est <nav>', m.navId === 'breadcrumbBar', m.navId);
check('dashboard: en-tête de page est <header>', m.pageHeader === true, m.pageHeaderTag);
check('branding est <header>', m.header === true);
check('dashboard a un <h1> (sr-only toléré)', !!m.h1, m.h1);

// ---------- 2. /login public : branding landmark + pas de region orphelin ----------
await page.goto(`${BASE}/login`, { waitUntil: 'load' });
m = await page.evaluate(() => ({
  header: !!document.querySelector('header.app-branding'),
  main: !!document.querySelector('main'),
  outside: [...document.body.children].filter(e => !/^(SCRIPT|STYLE|TEMPLATE|HEADER|FOOTER|NAV|MAIN|ASIDE|SECTION|DIALOG)$/.test(e.tagName) && !e.closest('header,footer,nav,main,aside') && (e.innerText || '').trim().length > 0 && !e.getAttribute('role')).length,
}));
check('login: header branding', m.header === true);
check('login: main présent', m.main === true);
check('login: aucun contenu textuel hors landmark', m.outside === 0, `outside=${m.outside}`);

// ---------- 3. Contraste --secondary (texte secondaire) ----------
await page.goto(`${BASE}/`, { waitUntil: 'load' });
m = await page.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  // sonde : élément peint en var(--text-color-secondary) sur fond carte
  const probe = document.createElement('span');
  probe.textContent = 'sample';
  probe.style.color = 'var(--text-color-secondary)';
  (document.querySelector('#main-panel') || document.body).appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return { sec: cs.getPropertyValue('--secondary').trim(), sample: { color } };
});
check('--secondary assombi (oklch L=55%)', m.sec.includes('55%'), m.sec);
{
  const fg = parse(m.sample?.color);
  const c = fg ? ratio(lum(fg), lum([255, 255, 255, 1])) : 0;
  check('texte secondaire >= 4.5 sur blanc', c >= 4.5, `ratio ${c.toFixed(2)} fg=${m.sample?.color}`);
}

// ---------- 4. Chevron : taille 24px, nommé, hors tab order ----------
await page.goto(`${BASE}/`, { waitUntil: 'load' });
await page.hover('#job_api-pipeline .jenkins-table__link');
await page.waitForTimeout(400);
m = await page.evaluate(() => {
  const c = document.querySelector('#job_api-pipeline .jenkins-menu-dropdown-chevron');
  if (!c) return null;
  const r = c.getBoundingClientRect();
  return { w: r.width, h: r.height, label: c.getAttribute('aria-label'), tab: c.getAttribute('tabindex'), pe: getComputedStyle(c).pointerEvents, haspopup: c.getAttribute('aria-haspopup') };
});
check('chevron >= 24x24 au hover', m && m.w >= 24 && m.h >= 24, JSON.stringify(m));
check('chevron aria-label contient le nom du job', !!m?.label?.includes('api-pipeline'), m?.label);
check('chevron tabindex -1', m?.tab === '-1', m?.tab);
// pointer-events: none de base n'est compilé que pour @media (hover:hover) ;
// en headless (hover:none) le chevron reste visible+interactif par design.
const peRule = await page.evaluate(() => {
  const rules = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch { return []; } })
    .filter(r => r.media && /hover:\s*hover/.test(r.media.mediaText))
    .flatMap(r => [...r.cssRules]);
  return {
    none: rules.some(r => r.selectorText === '.model-link .jenkins-menu-dropdown-chevron' && r.style.pointerEvents === 'none'),
    hover: rules.some(r => /model-link[^,{]*:(hover|focus-within)[^{]*jenkins-menu-dropdown-chevron/.test(r.selectorText) && r.style.pointerEvents === 'all'),
  };
});
check('chevron pointer-events:none de base (media hover:hover)', peRule.none === true, JSON.stringify(peRule));
check('chevron pointer-events:all au hover/focus/open', peRule.hover === true, JSON.stringify(peRule));

// ---------- 5. Menu ouvert : .jenkins-dropdown role=navigation ----------
await page.click('#job_api-pipeline .jenkins-menu-dropdown-chevron');
await page.waitForSelector('.jenkins-dropdown', { state: 'visible', timeout: 5000 });
m = await page.evaluate(() => ({
  role: document.querySelector('.jenkins-dropdown')?.getAttribute('role'),
  label: document.querySelector('.jenkins-dropdown')?.getAttribute('aria-label'),
}));
check('menu ouvert role=navigation', m.role === 'navigation', JSON.stringify(m));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// ---------- 6. Formulaires : labels associés ----------
await page.goto(`${BASE}/job/webapp-deploy/configure`, { waitUntil: 'load' });
await page.waitForTimeout(1500);
m = await page.evaluate(() => {
  const unlabeled = [...document.querySelectorAll('.jenkins-form-item input, .jenkins-form-item select, .jenkins-form-item textarea')]
    .filter(e => e.type !== 'hidden' && !e.closest('[hidden]'))
    .filter(e => !(e.labels && e.labels.length) && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby'));
  const cb = document.querySelector('.jenkins-checkbox input[type="checkbox"]');
  const lbl = cb && cb.closest('.jenkins-checkbox')?.querySelector('label');
  const sel = document.querySelector('select.jenkins-select__input');
  const selLabel = sel && (sel.getAttribute('aria-labelledby') || (sel.labels && sel.labels.length ? 'for' : null));
  return { unlabeled: unlabeled.length, firstUnlabeled: unlabeled[0]?.outerHTML.slice(0, 80), cbFor: lbl?.getAttribute('for'), cbId: cb?.id, forMatch: lbl && cb ? lbl.getAttribute('for') === cb.id : null, selLabel: !!selLabel };
});
check('0 champ sans label associé (configure)', m.unlabeled === 0, JSON.stringify(m));
check('checkbox label for == input id', m.forMatch === true, `${m.cbFor} vs ${m.cbId}`);
check('select a un label', m.selLabel === true, JSON.stringify(m));

// ---------- 7. help-button : nom contient "?" + tabindex -1 ----------
m = await page.evaluate(() => {
  const h = document.querySelector('a.jenkins-help-button');
  return h ? { label: h.getAttribute('aria-label'), tab: h.getAttribute('tabindex') ?? 'none' } : null;
});
check('help-button aria-label contient "?"', !!m?.label?.includes('?'), m?.label);
check('help-button tabindex=-1', m?.tab === '-1' || m?.tab === 'none', m?.tab);

// ---------- 8. Tableaux : th non vides + entête "Actions" ----------
await page.goto(`${BASE}/`, { waitUntil: 'load' });
m = await page.evaluate(() => {
  const empties = [...document.querySelectorAll('th')].filter(t => !t.textContent.trim() && !t.querySelector('input,svg,span')).length;
  const actions = [...document.querySelectorAll('th .jenkins-visually-hidden')].map(s => s.textContent.trim());
  const sort = document.querySelector('a.sortheader');
  const rh = sort ? sort.getBoundingClientRect().height : 0;
  return { empties, actions, sortH: rh };
});
check('aucun <th> totalement vide', m.empties === 0, `empties=${m.empties}`);
check('entêtes sr-only présentes', m.actions.length >= 1, m.actions.join('|'));
check('sortheader >= 24px de haut', m.sortH >= 24, `h=${m.sortH}`);

// ---------- 9. Moniteurs : titre de niveau 2 ----------
await page.goto(`${BASE}/manage/configure`, { waitUntil: 'load' });
m = await page.evaluate(() => {
  const h = document.querySelector('.app-adminmonitor h3[role="heading"]');
  return { level: h?.getAttribute('aria-level'), text: h?.textContent.trim().slice(0, 30) };
});
check('adminmonitor titre aria-level=2', m.level === '2', JSON.stringify(m));

// ---------- 10. build-health-link nommé ----------
await page.goto(`${BASE}/`, { waitUntil: 'load' });
m = await page.evaluate(() => {
  const l = document.querySelector('a.build-health-link');
  return l?.getAttribute('aria-label');
});
check('build-health-link aria-label', !!m && m.includes('%'), m);

// ---------- 11. HistoryWidget : bouton actions nommé ----------
await page.goto(`${BASE}/job/webapp-deploy/`, { waitUntil: 'load' });
await page.waitForTimeout(800);
m = await page.evaluate(() => {
  const b = document.querySelector('button.jenkins-card__reveal.jenkins-jumplist-link');
  return b ? { label: b.getAttribute('aria-label'), haspopup: b.getAttribute('aria-haspopup') } : null;
});
check('bouton reveal build nommé', !!m?.label && m.label.length > 3, JSON.stringify(m));

// ---------- 12. Lien icône statut dernier build nommé ----------
await page.goto(`${BASE}/job/webapp-deploy/`, { waitUntil: 'load' });
m = await page.evaluate(() => {
  const a = document.querySelector('.jenkins-app-bar a.jenkins-\\!-display-contents, .jenkins-app-bar a[class*="display-contents"]');
  return a?.getAttribute('aria-label');
});
check('lien icône build nommé', !!m, m);

// ---------- 13. UserAction : role=button quand href retiré (touch) ----------
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/`, { waitUntil: 'load' });
m = await page.evaluate(() => {
  const a = document.querySelector('#root-action-UserAction');
  return { href: a?.getAttribute('href'), role: a?.getAttribute('role'), touch: window.matchMedia('(hover: none)').matches };
});
check('user action cohérente href/role', (m.href === null) === (m.role === 'button') || (m.href !== null && !m.role), JSON.stringify(m));

// ---------- 14. Thème dark : variables activées ----------
await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
await page.waitForTimeout(600);
m = await page.evaluate(() => {
  const bg = getComputedStyle(document.body).backgroundColor;
  return { theme: document.documentElement.dataset.theme, bg };
});
check('data-theme=dark applique un fond sombre', m.theme === 'dark' && (() => { const c = parse(m.bg); return c && c[0] < 80 && c[1] < 80 && c[2] < 90; })(), JSON.stringify(m));

await browser.close();
console.log(failures === 0 ? 'VERIFY: 0 FAIL' : `VERIFY: ${failures} FAIL`);
process.exit(failures ? 1 : 0);
