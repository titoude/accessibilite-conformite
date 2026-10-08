#!/usr/bin/env node
/**
 * verify.mjs — assertions DURES sur les corrections metabase (cycle 46).
 * Chaque assertion échoue → process.exit(1). Aucun self-verdict axe :
 * le score axe est produit par audit.mjs, pas ici.
 *
 * Usage: node verify.mjs <baseUrl> [state-admin.json]
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const [baseArg, authFile] = process.argv.slice(2);
const base = (baseArg || 'http://localhost:7600').replace(/\/$/, '');
const state = authFile ? JSON.parse(readFileSync(authFile, 'utf8')) : undefined;
const results = [];
const ok = (name, cond, extra = '') => {
  results.push({ name, pass: !!cond, extra });
  console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${name} ${extra}`);
  return cond;
};

const rgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
const contrast = (fg, bg) => {
  const lum = (c) => c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  const [r1, g1, b1] = lum(fg), [r2, g2, b2] = lum(bg);
  const L1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const L2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};

const browser = await chromium.launch();
const anon = await browser.newContext();
const ctx = await browser.newContext(state ? { storageState: state } : {});
const page = await ctx.newPage();
const anonPage = await anon.newPage();

// ── 1. Login (public) : heading nommé + niveau, lien contraste ─────────────
await anonPage.goto(`${base}/auth/login`, { waitUntil: 'domcontentloaded' });
await anonPage.waitForTimeout(2500);
const login = await anonPage.evaluate(() => ({
  heading: [...document.querySelectorAll('[role="heading"], h1, h2')]
    .map(h => ({ lvl: h.getAttribute('aria-level') || h.tagName, text: h.textContent.trim().slice(0, 40) })),
  linkColor: (() => {
    const a = [...document.querySelectorAll('a')].find(a => a.href.includes('forgot_password'));
    if (!a) return null;
    return getComputedStyle(a).color;
  })(),
}));
ok('login: heading annoncé avec niveau', login.heading.some(h => /Sign in/i.test(h.text) && /1|H1/.test(h.lvl)), JSON.stringify(login.heading));
if (login.linkColor) {
  const r = contrast(rgb(login.linkColor), [255, 255, 255]);
  ok('login: lien "forgot password" >= 4.5:1', r >= 4.5, `${login.linkColor} ratio=${r.toFixed(2)}`);
}

// ── 2. Home : nav landmark labellisée, undo-list sans role=region ──────────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('nav, aside', { timeout: 30000 });
await page.waitForTimeout(2500);
const home = await page.evaluate(() => ({
  navLabel: document.querySelector('nav')?.getAttribute('aria-label') ||
            document.querySelector('aside')?.getAttribute('aria-label') || '',
  undoRole: document.querySelector('[data-testid="undo-list"]')?.getAttribute('role') || 'none',
  undoTag: document.querySelector('[data-testid="undo-list"]')?.tagName || 'absent',
  mains: document.querySelectorAll('main, [role="main"]').length,
}));
ok('home: nav/sidebar porte un accessible name', home.navLabel.length > 0, home.navLabel);
ok('home: undo-list n\'est plus un ul (region interdite sur ul)', home.undoTag !== 'UL', `${home.undoTag} role=${home.undoRole}`);
ok('home: exactement un landmark main', home.mains === 1, String(home.mains));

// ── 3. Sidebar : contraste item sélectionné + aria-current ─────────────────
const sidebar = await page.evaluate(() => {
  const cur = document.querySelector('[aria-current="page"], [aria-current="true"]');
  const sel = [...document.querySelectorAll('[aria-current="page"], [aria-current="true"]')].map(e => e.textContent.trim().slice(0, 25));
  if (!cur) return { sel, skip: true };
  const cs = getComputedStyle(cur);
  let el = cur, bg = cs.backgroundColor;
  const transparent = (b) => !b || b === 'transparent' || /rgba\([^)]*,\s*0(\.0+)?\s*\)$/.test(b);
  while (transparent(bg) && el.parentElement) { el = el.parentElement; bg = getComputedStyle(el).backgroundColor; }
  return { sel, fg: cs.color, bg, text: cur.textContent.trim().slice(0, 25) };
});
if (!sidebar.skip && sidebar.fg) {
  const r = contrast(rgb(sidebar.fg), rgb(sidebar.bg));
  ok('sidebar: item courant >= 4.5:1', r >= 4.5, `${sidebar.fg} on ${sidebar.bg} = ${r.toFixed(2)}`);
}
ok('sidebar: aria-current sur l\'item actif', sidebar.sel.length >= 1, sidebar.sel.join('|'));

// ── 4. /question/40 : h1, triggers interactifs, rowcount propre ────────────
await page.goto(`${base}/question/40`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
const q = await page.evaluate(() => ({
  h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim().slice(0, 40)),
  dlTarget: (() => {
    const b = document.querySelector('[data-testid="question-results-download-button"]');
    return b ? { tag: b.tagName, haspopup: b.getAttribute('aria-haspopup') } : null;
  })(),
  flexTargets: document.querySelectorAll('div[aria-haspopup][id$="-target"], span[aria-haspopup]').length,
  rowcount: (() => {
    const s = document.querySelector('[data-testid="question-row-count"]');
    return s ? { label: s.getAttribute('aria-label'), controls: s.getAttribute('aria-controls') } : null;
  })(),
}));
ok('/question: h1 présent', q.h1.length >= 1, q.h1.join('|'));
ok('/question: download target = vrai bouton', q.dlTarget?.tag === 'BUTTON', JSON.stringify(q.dlTarget));
ok('/question: aucun div/span target aria-haspopup', q.flexTargets === 0, String(q.flexTargets));
ok('/question: rowcount sans aria-controls orphelin', !q.rowcount || !q.rowcount.controls, JSON.stringify(q.rowcount));

// ── 5. Sentinelle focus + portail dans un menu ouvert ──────────────────────
await page.locator('button[aria-label="New"], [data-testid="new-button"]').first().click().catch(() => {});
await page.waitForTimeout(1500);
const overlay = await page.evaluate(() => ({
  sentinels: [...document.querySelectorAll('div[data-autofocus]')].map(e => ({
    role: e.getAttribute('role'), tabindex: e.getAttribute('tabindex'),
  })),
  portals: [...document.querySelectorAll('body > div[data-portal="true"]')]
    .filter(d => d.childElementCount > 0)
    .map(d => ({ role: d.getAttribute('role'), label: d.getAttribute('aria-label') })),
  menuOpen: document.querySelector('[role="menu"]') !== null,
}));
if (overlay.menuOpen) {
  ok('menu ouvert: sentinelles role=separator non focusables',
    overlay.sentinels.length > 0 && overlay.sentinels.every(s => s.role === 'separator' && s.tabindex === null),
    JSON.stringify(overlay.sentinels));
  const labels = overlay.portals.map(p => p.label);
  ok('menu ouvert: portails peuplés = landmark unique',
    overlay.portals.length > 0 && overlay.portals.every(p => p.role === 'complementary' && p.label) && new Set(labels).size === labels.length,
    JSON.stringify(overlay.portals));
} else {
  ok('menu ouvert: au moins un menu rendu', false, 'menu absent');
}
await page.keyboard.press('Escape');
await page.waitForTimeout(800);

// ── 6. /account/profile : tabs sans aria-controls, select labellisé ────────
await page.goto(`${base}/account/profile`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const acct = await page.evaluate(() => ({
  tabsWithControls: document.querySelectorAll('[role="tab"][aria-controls]').length,
  tabsCount: document.querySelectorAll('[role="tab"]').length,
  unlabeled: [...document.querySelectorAll('input:not([type="hidden"]), select')].filter(el => {
    const lab = el.getAttribute('aria-labelledby');
    const labOk = lab ? lab.split(/\s+/).some(id => (document.getElementById(id)?.textContent || '').trim()) : false;
    return !(el.getAttribute('aria-label') || labOk || el.closest('label') || (el.id && document.querySelector(`label[for="${el.id}"]`)));
  }).length,
}));
ok('/account: aucun tab avec aria-controls orphelin', acct.tabsWithControls === 0, `${acct.tabsWithControls}/${acct.tabsCount}`);
ok('/account: tous les champs nommés', acct.unlabeled === 0, String(acct.unlabeled));

// ── 7. Thème : --mb-color-text-tertiary >= 4.5:1 sur blanc ─────────────────
const varc = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--mb-color-text-tertiary'));
ok('theme: text-tertiary assombri (alpha >= 0.6)', /0\.(6|7|8|9)/.test(varc), varc.trim());

const failed = results.filter(r => !r.pass);
console.log(`\nverify: ${results.length - failed.length}/${results.length} assertions OK`);
await browser.close();
process.exit(failed.length ? 1 : 0);
