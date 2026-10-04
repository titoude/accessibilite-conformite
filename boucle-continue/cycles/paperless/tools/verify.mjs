// verify.mjs — cycle 10 paperless-ngx : assertions indépendantes sur les corrections
import { chromium } from 'playwright';
const BASE = process.env.PNGX_URL || 'http://127.0.0.1:8085';
let pass = 0, fail = 0;
const ok = (n, c, x='') => { c ? pass++ : fail++; console.log(`${c?'PASS':'FAIL'} ${n} ${x}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

// 1. h1 présent et unique sur chaque page clé
for (const u of ['/dashboard','/documents','/settings','/usersgroups','/logs']) {
  await page.goto(BASE + u, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 20000 });
  await page.waitForTimeout(800);
  const n = await page.locator('h1').count();
  ok(`h1-unique ${u}`, n === 1, `count=${n}`);
}

// 2. landmarks : un seul main, navs étiquetées
await page.goto(BASE + '/dashboard', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('h1'); await page.waitForTimeout(800);
let r = await page.evaluate(() => ({
  mains: document.querySelectorAll('main, [role="main"]').length,
  navs: [...document.querySelectorAll('nav')].map(n => n.getAttribute('aria-label')),
}));
ok('single-main', r.mains === 1, JSON.stringify(r));
ok('navs-labelled', r.navs.every(l => !!l) && r.navs.length >= 2, JSON.stringify(r.navs));

// 3. hiérarchie de titres : pas de saut h1->h3+ sur settings et usersgroups
for (const u of ['/settings','/usersgroups','/mail']) {
  await page.goto(BASE + u); await page.waitForSelector('h1'); await page.waitForTimeout(600);
  const skip = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
    let prev = 0; for (const h of hs) { if (prev && h > prev + 1) return {prev, h}; prev = h; }
    return null;
  });
  ok(`heading-order ${u}`, skip === null, JSON.stringify(skip));
}

// 4. menu utilisateur : ouvert, nommé (role=group + labelledby), items utilisables
await page.goto(BASE + '/dashboard'); await page.waitForSelector('#userDropdown'); await page.waitForTimeout(600);
await page.locator('#userDropdown').click(); await page.waitForTimeout(500);
r = await page.evaluate(() => {
  const menu = document.querySelector('[aria-labelledby="userDropdown"]');
  return { role: menu?.getAttribute('role'), visible: menu?.checkVisibility(), items: menu?.querySelectorAll('button,a').length };
});
ok('user-menu-labelled', r.role === 'group' && r.visible === true && r.items > 0, JSON.stringify(r));
await page.keyboard.press('Escape'); await page.waitForTimeout(300);

// 5. dropdown Tags : ids uniques, panneau nommé, options présentes
await page.goto(BASE + '/documents'); await page.waitForSelector('[id^="dropdown_tags"]'); await page.waitForTimeout(800);
await page.locator('[id^="dropdown_tags"]').first().click(); await page.waitForTimeout(800);
r = await page.evaluate(() => {
  const ids = {}; document.querySelectorAll('[id]').forEach(e => ids[e.id] = (ids[e.id]||0)+1);
  const menu = document.querySelector('.dropdown-menu.show, [aria-labelledby^="dropdown_tags"]');
  return { dups: Object.entries(ids).filter(([k,v]) => v>1), menuRole: menu?.getAttribute('role'), btns: menu?.querySelectorAll('button').length };
});
ok('dropdown-unique-ids', r.dups.length === 0, JSON.stringify(r.dups));
ok('dropdown-panel', r.menuRole === 'group' && r.btns > 0, JSON.stringify({role: r.menuRole, btns: r.btns}));
await page.keyboard.press('Escape');

// 6. contrastes fixes vérifiés par mesure (heading sidebar, em communauté)
await page.goto(BASE + '/dashboard'); await page.waitForSelector('.sidebar-heading'); await page.waitForTimeout(900);
r = await page.evaluate(() => {
  const g = s => { const e = document.querySelector(s); return e ? getComputedStyle(e).color : null; };
  return { heading: g('.sidebar-heading'), em: g('.welcome-widget em, .fst-italic') };
});
const strong = c => ['rgb(33, 37, 41)', 'rgb(0, 0, 0)', 'rgb(23, 84, 31)'].includes(c);
ok('sidebar-heading-contrast', strong(r.heading), r.heading);
ok('em-not-muted', strong(r.em), r.em);

// 7. checkboxes : taille cible >= 24px
await page.goto(BASE + '/settings'); await page.waitForSelector('h1'); await page.waitForTimeout(600);
r = await page.evaluate(() => {
  const cbs = [...document.querySelectorAll('.form-check-input')];
  const small = cbs.filter(c => c.checkVisibility() && c.getBoundingClientRect().width < 24).length;
  return { total: cbs.length, small };
});
ok('checkbox-target-size', r.total > 0 && r.small === 0, JSON.stringify(r));

// 8. logs : liaison tab <-> tabpanel bidirectionnelle
await page.goto(BASE + '/logs'); await page.waitForSelector('.nav-tabs a', {timeout:20000}); await page.waitForTimeout(2500);
r = await page.evaluate(() => {
  const links = [...document.querySelectorAll('.nav-tabs a')];
  const pairs = links.map(a => {
    const ac = a.getAttribute('aria-controls');
    const panel = ac ? document.getElementById(ac) : null;
    return { ac, panel: !!panel, back: panel?.getAttribute('aria-labelledby') === a.id };
  });
  return pairs;
});
ok('logs-tab-panel-link', r.length > 0 && r.every(p => p.panel && p.back), JSON.stringify(r));

// 9. login : landmark main + h1 + labels de formulaire
const ctx2 = await browser.newContext();
const page2 = await ctx2.newPage();
await page2.goto(BASE + '/accounts/login/'); await page2.waitForTimeout(1200);
r = await page2.evaluate(() => ({
  mains: document.querySelectorAll('main').length,
  h1: document.querySelectorAll('h1').length,
  labels: [...document.querySelectorAll('input')].filter(i => !i.labels?.length && i.type !== 'hidden' && i.type !== 'submit' && i.type !== 'checkbox').map(i => i.name),
}));
ok('login-landmarks', r.mains === 1 && r.h1 === 1, JSON.stringify(r));
ok('login-inputs-labelled', r.labels.length === 0, JSON.stringify(r.labels));
await ctx2.close();

await browser.close();
console.log(`\n${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
