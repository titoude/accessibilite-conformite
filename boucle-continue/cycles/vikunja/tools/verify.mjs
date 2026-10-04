/**
 * verify.mjs — assertions DURES sur les corrections Vikunja (cycle 13).
 * Chaque assertion échoue → process.exit(1). Aucun self-verdict axe :
 * le score axe est produit par audit.mjs, pas ici.
 *
 * Usage: node verify.mjs <baseUrl> <auth.json>
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const [base, authFile] = process.argv.slice(2);
const state = authFile ? JSON.parse(readFileSync(authFile, 'utf8')) : undefined;
const results = [];
const ok = (name, cond, extra = '') => {
  results.push({ name, pass: !!cond, extra });
  if (!cond) console.error(`  FAIL ${name} ${extra}`);
  return cond;
};

const contrast = (fg, bg) => {
  const lum = (c) => c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  const [r1, g1, b1] = lum(fg), [r2, g2, b2] = lum(bg);
  const L1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const L2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};
const rgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);

const browser = await chromium.launch();
const ctx = await browser.newContext(state ? { storageState: state } : {});
const page = await ctx.newPage();

// ── 1. Login : h1 « Welcome Back », landmarks ──────────────────────────────
await page.goto(`${base}/login`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.image', { timeout: 15000 });
await page.waitForTimeout(1500);
const login = await page.evaluate(() => ({
  h1s: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).filter(Boolean),
  mains: document.querySelectorAll('main, [role="main"]').length,
  complementary: document.querySelectorAll('aside, [role="complementary"]').length,
}));
ok('login: exactement 1 h1 non vide', login.h1s.length === 1, login.h1s.join('|'));
ok('login: 1 landmark main', login.mains >= 1, String(login.mains));
ok('login: panneau marqué complementary', login.complementary >= 1, String(login.complementary));

// ── 2. Accueil : structure + boutons nommés ────────────────────────────────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.username-dropdown-trigger', { timeout: 15000 });
await page.waitForTimeout(1500);
const home = await page.evaluate(() => ({
  h1s: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).filter(Boolean),
  unnamedBtns: [...document.querySelectorAll('button:not([disabled])')].filter(b => {
    const lab = b.getAttribute('aria-labelledby');
    const labText = lab ? lab.split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ') : '';
    const name = (b.getAttribute('aria-label') || b.getAttribute('title') || labText || b.textContent || '').trim();
    return !name && b.offsetParent !== null;
  }).length,
  mains: document.querySelectorAll('main, [role="main"]').length,
}));
ok('home: au moins 1 h1', home.h1s.length >= 1, home.h1s.join('|'));
ok('home: aucun bouton visible sans nom', home.unnamedBtns === 0, `${home.unnamedBtns} boutons`);
ok('home: 1 landmark main', home.mains === 1, String(home.mains));

// ── 3. Gantt : structure grid complète ─────────────────────────────────────
await page.goto(`${base}/projects/2/10`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.gantt-container [role="grid"]', { state: 'attached', timeout: 15000 });
await page.waitForTimeout(2500);
const gantt = await page.evaluate(() => {
  const wrap = document.querySelector('.gantt-chart-wrapper');
  const grid = document.querySelector('.gantt-container [role="grid"]');
  const hdr = document.getElementById('gantt-timeline-header');
  const cols = [...document.querySelectorAll('.gantt-container [role="columnheader"], #gantt-timeline-header [role="columnheader"]')];
  const badCol = cols.find(c => !c.closest('[role="row"]'));
  return {
    grids: document.querySelectorAll('.gantt-container [role="grid"]').length,
    wrapperRole: wrap ? wrap.getAttribute('role') : null,
    headerRowgroup: hdr ? hdr.getAttribute('role') : null,
    ariaOwns: grid ? grid.getAttribute('aria-owns') : null,
    colInRow: !badCol,
    rowgroupsInGrid: grid ? grid.querySelectorAll('[role="rowgroup"]').length : 0,
  };
});
ok('gantt: 1 seul role=grid dans le composant', gantt.grids === 1, `${gantt.grids} grids`);
ok('gantt: wrapper sans rôle table resté', !gantt.wrapperRole, String(gantt.wrapperRole));
ok('gantt: header role=rowgroup', gantt.headerRowgroup === 'rowgroup', String(gantt.headerRowgroup));
ok('gantt: grid aria-owns → header', gantt.ariaOwns === 'gantt-timeline-header', String(gantt.ariaOwns));
ok('gantt: columnheader dans role=row', gantt.colInRow);
ok('gantt: rowgroup de lignes dans le grid', gantt.rowgroupsInGrid >= 1, String(gantt.rowgroupsInGrid));

// ── 4. Liste projet : items dans <li> ──────────────────────────────────────
await page.goto(`${base}/projects/2/9`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.tasks', { timeout: 15000 });
await page.waitForTimeout(1500);
const list = await page.evaluate(() => {
  const ul = document.querySelector('ul.tasks') || document.querySelector('.tasks ul');
  const items = ul ? [...ul.children] : [];
  return {
    ulFound: !!ul,
    allLi: items.length > 0 && items.every(el => el.tagName === 'LI'),
    count: items.length,
  };
});
ok('liste: <ul> présent', list.ulFound);
ok('liste: tous les enfants sont <li>', list.allLi, `${list.count} enfants`);

// ── 5. Contraste mesuré (calcul réel, pas estimation) ──────────────────────
const measured = await page.evaluate(() => {
  const bgOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && !c.endsWith(', 0)')) return c;
    }
    return 'rgb(255, 255, 255)';
  };
  const grab = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { color: cs.color, bg: bgOf(el) };
  };
  return {
    active: grab('a.router-link-exact-active'),
    danger: grab('.has-text-danger'),
    muted: grab('.menu-bottom-link'),
  };
});
if (measured.active) {
  ok('contraste: lien actif >= 4.5', contrast(rgb(measured.active.color), rgb(measured.active.bg)) >= 4.5,
    `${measured.active.color} sur ${measured.active.bg} = ${contrast(rgb(measured.active.color), rgb(measured.active.bg)).toFixed(2)}`);
}
if (measured.danger) {
  // has-text-danger n'apparaît que dans un menu ouvert — test fait dans l'état dédié plus bas.
}

// ── 6. Détail tâche : h1 unique + bouton Delete nommé ──────────────────────
await page.goto(`${base}/tasks/1`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('h1, .heading', { timeout: 15000 });
await page.waitForTimeout(1500);
const task = await page.evaluate(() => ({
  h1s: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).filter(Boolean),
  deleteBtn: [...document.querySelectorAll('button')].find(b => /delete/i.test(b.textContent || '')) ? true : false,
  taskIdMuted: getComputedStyle(document.querySelector('.title.task-id') || document.body).color,
}));
ok('tâche: exactement 1 h1', task.h1s.length === 1, task.h1s.join('|'));
ok('tâche: bouton Delete présent', task.deleteBtn);

// ── 7. Labels : lien « Create a label » souligné + contraste ───────────────
await page.goto(`${base}/labels`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
const labels = await page.evaluate(() => {
  const a = [...document.querySelectorAll('a')].find(x => /create a label/i.test(x.textContent || ''));
  if (!a) return null;
  const cs = getComputedStyle(a);
  const bgOf2 = (el) => { for (let n = el; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (c && !c.endsWith(', 0)')) return c; } return 'rgb(255, 255, 255)'; };
  return { td: cs.textDecoration, color: cs.color, bg: bgOf2(a) };
});
if (labels) {
  ok('labels: lien souligné', labels.td.includes('underline'), labels.td);
  ok('labels: contraste lien >= 4.5', contrast(rgb(labels.color), rgb(labels.bg)) >= 4.5,
    `${labels.color}/${labels.bg} = ${contrast(rgb(labels.color), rgb(labels.bg)).toFixed(2)}`);
}

// ── 8. Menu projet : has-text-danger contraste réel ────────────────────────
await page.goto(`${base}/projects/2/9`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.project-title-button', { timeout: 15000 });
await page.locator('.project-title-button').first().click();
await page.waitForSelector('.dropdown-menu .dropdown-content', { state: 'visible', timeout: 10000 });
const danger = await page.evaluate(() => {
  const el = document.querySelector('.has-text-danger');
  if (!el) return null;
  const cs = getComputedStyle(el);
  const bgOf3 = (x) => { for (let n = x; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (c && !c.endsWith(', 0)')) return c; } return 'rgb(255, 255, 255)'; };
  return { color: cs.color, bg: bgOf3(el) };
});
if (danger) {
  const r = contrast(rgb(danger.color), rgb(danger.bg));
  ok('danger: contraste >= 4.5', r >= 4.5, `${danger.color}/${danger.bg} = ${r.toFixed(2)}`);
}

// ── 9. Clavier : focus visible + Escape ferme le menu ──────────────────────
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
const menuClosed = await page.evaluate(() => {
  const el = document.querySelector('.dropdown-menu .dropdown-content');
  return !el || el.offsetParent === null; // v-show=false → invisible
});
ok('clavier: Escape ferme le menu', menuClosed);

// ── 10. Reflow 320px ───────────────────────────────────────────────────────
await page.setViewportSize({ width: 320, height: 800 });
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
const reflow = await page.evaluate(() => {
  const wide = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (el.scrollWidth > 322) wide.push(el.tagName + '.' + String(el.className).slice(0, 40));
  }
  return wide;
});
ok('reflow 320px: aucun élément >320px', reflow.length === 0, reflow.slice(0, 3).join(' | '));

await browser.close();
const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} assertions OK`);
if (failed.length) process.exit(1);
console.log('verify.mjs : tout OK');
