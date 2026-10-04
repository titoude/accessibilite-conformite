// verify.mjs — assertions indépendantes du score axe (effect, not action).
// Cycle 17 — umami. Usage: node verify.mjs <baseUrl>
// Chaque assertion peut échouer : élément requis absent = FAIL, pas de catch muet.
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3000';
const WSID = 'd4bdaf1e-bca5-465f-848d-f33a9045daf3';
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  if (!ok) console.log(`  ÉCHEC: ${name} ${detail}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json' });
const page = await ctx.newPage();

// 1. viewport : zoom utilisateur autorisé (pas de user-scalable=no / maximum-scale<5)
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
const vp = await page.evaluate(() => document.querySelector('meta[name=viewport]')?.content || '');
check('viewport: zoom utilisateur autorisé', !/user-scalable\s*=\s*no|maximum-scale\s*=\s*[01](\.\d+)?\b/i.test(vp), vp);

// 2. exactement un h1 visible par page, dans le landmark main
for (const path of ['/dashboard', '/websites', `/websites/${WSID}`, '/settings/profile', '/admin/users']) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const r = await page.evaluate(() => ({
    h1: [...document.querySelectorAll('h1')].filter(h => h.offsetParent !== null).length,
    mains: document.querySelectorAll('main, [role=main]').length,
    h1InMain: [...document.querySelectorAll('main h1, [role=main] h1')].filter(h => h.offsetParent !== null).length,
  }));
  check(`h1: exactement un visible dans <main> sur ${path}`, r.h1 === 1 && r.mains === 1 && r.h1InMain === 1, JSON.stringify(r));
}

// 3. login : h1 présent dans un landmark main + formulaire nommé
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
const login = await page.evaluate(() => ({
  h1: [...document.querySelectorAll('main h1, [role=main] h1')].filter(h => h.offsetParent !== null).length,
  mains: document.querySelectorAll('main, [role=main]').length,
}));
check('login: h1 dans landmark main, landmark unique', login.h1 === 1 && login.mains === 1, JSON.stringify(login));

// 4. skip link : présent, cible #main-content, devient visible au focus
await page.goto(BASE + '/dashboard', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
const skip = await page.evaluate(() => {
  const a = document.querySelector('a.skip-link, a[href="#main-content"]');
  const target = document.getElementById('main-content');
  return { link: !!a, href: a?.getAttribute('href'), target: !!target };
});
check('skip-link: présent et cible #main-content existante', skip.link && skip.href === '#main-content' && skip.target, JSON.stringify(skip));
await page.keyboard.press('Tab');
await page.waitForTimeout(300);
const skipVisible = await page.evaluate(() => {
  const a = document.querySelector('a.skip-link');
  if (!a) return false;
  const r = a.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && r.top > -r.height;
});
check('skip-link: visible au premier Tab', skipVisible);

// 5. landmarks de navigation : chaque nav a un nom accessible, aucun nav imbriqué
const navs = await page.evaluate(() => {
  const all = [...document.querySelectorAll('nav, [role=navigation]')].filter(n => n.offsetParent !== null);
  const nested = all.filter(n => n.closest('nav, [role=navigation]') && n.closest('nav, [role=navigation]') !== n);
  const unnamed = all.filter(n => !n.getAttribute('aria-label') && !n.getAttribute('aria-labelledby'));
  return { total: all.length, nested: nested.length, unnamed: unnamed.length };
});
check('nav: aucun landmark imbriqué, tous nommés', navs.nested === 0 && navs.unnamed === 0 && navs.total > 0, JSON.stringify(navs));

// 6. bannière : le bandeau mobile (viewport étroit) est un landmark banner top-level
await page.setViewportSize({ width: 375, height: 800 });
await page.waitForTimeout(800);
const banner = await page.evaluate(() => {
  const b = [...document.querySelectorAll('header, [role=banner]')].filter(e => e.offsetParent !== null);
  const contained = b.filter(e => e.closest('main, nav, [role=main], [role=navigation], [role=complementary], [role=region]'));
  return { banners: b.length, contained: contained.length };
});
check('banner: bannière mobile visible et top-level', banner.banners >= 1 && banner.contained === 0, JSON.stringify(banner));
await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(800);

// 7. menu utilisateur : s'ouvre, vit dans #a11y-popup-layer[role=complementary], Escape ferme
const userBtn = page.locator('[aria-haspopup="menu"]').last();
check('menu utilisateur: déclencheur avec aria-haspopup', await userBtn.count() === 1);
await userBtn.click();
await page.waitForTimeout(900);
const menu = await page.evaluate(() => {
  const m = document.querySelector('[role="menu"]');
  const layer = document.getElementById('a11y-popup-layer');
  return {
    found: !!m,
    inLayer: !!(m && layer && layer.contains(m)),
    layerRole: layer?.getAttribute('role'),
    named: !!(m && (m.getAttribute('aria-label') || m.getAttribute('aria-labelledby'))),
  };
});
check('menu utilisateur: role=menu monté dans #a11y-popup-layer[role=complementary]', menu.found && menu.inLayer && menu.layerRole === 'complementary', JSON.stringify(menu));
// aria-controls du déclencheur résout vers un élément réel
const ctl = await userBtn.getAttribute('aria-controls');
const ctlOk = ctl ? (await page.evaluate(id => document.getElementById(id) !== null, ctl)) : false;
check('menu utilisateur: aria-controls du déclencheur résout', ctlOk, `aria-controls=${ctl}`);
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
const menuGone = (await page.locator('[role="menu"]:visible').count()) === 0;
check('menu utilisateur: Escape ferme le menu', menuGone);

// 8. dialog "Add website" : role=dialog, nom accessible calculé, focus à l'intérieur, dans la couche
await page.goto(BASE + '/websites', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const addBtn = page.locator('button').filter({ hasText: /add website/i }).first();
check('dialog ajout site: bouton déclencheur trouvé', await addBtn.count() === 1);
await addBtn.click();
await page.waitForTimeout(900);
const dlg = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  const lb = d?.getAttribute('aria-labelledby');
  const al = d?.getAttribute('aria-label');
  return {
    found: !!d,
    name: al || (lb ? document.getElementById(lb)?.textContent : null),
    focusInside: d ? d.contains(document.activeElement) : null,
    inLayer: d ? document.getElementById('a11y-popup-layer')?.contains(d) : null,
  };
});
check('dialog ajout site: role=dialog nommé, focus dedans, dans la couche', dlg.found && !!dlg.name && dlg.focusInside === true && dlg.inLayer === true, JSON.stringify(dlg));
// les champs du dialog ont un nom accessible
const dlgFields = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return { inputs: 0, unnamed: 99 };
  const inputs = [...d.querySelectorAll('input, select, textarea, [role=combobox]')].filter(i => i.offsetParent !== null);
  const unnamed = inputs.filter(i => !(i.getAttribute('aria-label') || i.getAttribute('aria-labelledby') || i.id && d.querySelector(`label[for="${i.id}"]`) || i.closest('label')));
  return { inputs: inputs.length, unnamed: unnamed.length };
});
check('dialog ajout site: tous les champs ont un nom accessible', dlgFields.inputs > 0 && dlgFields.unnamed === 0, JSON.stringify(dlgFields));
await page.keyboard.press('Escape');
await page.waitForTimeout(600);

// 9. selects sur settings/preferences : chaque combobox a un nom accessible réel
await page.goto(BASE + '/settings/preferences', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const combos = await page.evaluate(() => {
  const els = [...document.querySelectorAll('[role="combobox"]')].filter(e => e.offsetParent !== null);
  const names = els.map(el => el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '');
  return { total: els.length, named: names.filter(Boolean).length, sample: names.slice(0, 6) };
});
check('préférences: chaque combobox a un nom accessible', combos.total > 0 && combos.named === combos.total, JSON.stringify(combos));

// 10. effet métier : le site seedé apparaît et affiche des données
await page.goto(BASE + '/websites', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const seedListed = await page.locator('a, [role=row]').filter({ hasText: /demo saas/i }).count();
check('effet métier: site seedé "Demo SaaS" listé', seedListed > 0, `count=${seedListed}`);
await page.goto(`${BASE}/websites/${WSID}`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
const hasData = await page.evaluate(() => document.body.innerText.match(/\d{1,4}/) !== null && /view|visit|page/i.test(document.body.innerText));
check('effet métier: la page du site affiche des métriques', hasData);

// 11. bascule thème (préférences) : boutons nommés, l'appui change data-theme réellement
await page.goto(BASE + '/settings/preferences', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const darkBtn = page.getByRole('button', { name: 'Dark', exact: true }).first();
const lightBtn = page.getByRole('button', { name: 'Light', exact: true }).first();
check('bascule thème: boutons Light/Dark avec noms accessibles', (await darkBtn.count()) >= 1 && (await lightBtn.count()) >= 1);
await darkBtn.click();
await page.waitForTimeout(1000);
const themeAfterDark = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
check('bascule thème: clic Dark → data-theme=dark', themeAfterDark === 'dark', `data-theme=${themeAfterDark}`);
await lightBtn.click();
await page.waitForTimeout(800);
const themeAfterLight = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
check('bascule thème: clic Light → data-theme=light', themeAfterLight === 'light', `data-theme=${themeAfterLight}`);

// 11b. page de partage publique : bascule thème soleil/lune nommée + fonctionnelle
const pub = await (await browser.newContext()).newPage();
await pub.goto(BASE + '/share/a11yumamishare', { waitUntil: 'domcontentloaded' });
await pub.waitForTimeout(4500);
const shareThemeBtn = pub.locator('button').filter({ has: pub.locator('svg.lucide-moon, svg.lucide-sun') }).first();
const shareThemeCount = await shareThemeBtn.count();
const shareThemeName = shareThemeCount ? await shareThemeBtn.getAttribute('aria-label') : null;
check('partage: bascule thème avec nom accessible', shareThemeCount >= 1 && !!shareThemeName, `count=${shareThemeCount} label=${shareThemeName}`);
const shareThemeBefore = await pub.evaluate(() => document.documentElement.getAttribute('data-theme'));
await shareThemeBtn.click();
await pub.waitForTimeout(900);
const shareThemeAfter = await pub.evaluate(() => document.documentElement.getAttribute('data-theme'));
check('partage: bascule thème fonctionnelle', shareThemeBefore !== shareThemeAfter && !!shareThemeAfter, `${shareThemeBefore} → ${shareThemeAfter}`);
await pub.close();

// 12. contraste mesuré : liens et textes visibles >= 4.5:1 sur leur fond effectif
await page.goto(BASE + '/websites', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const contrast = await page.evaluate(() => {
  const lum = (r, g, b) => {
    const c = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const rgba = (s) => (s.match(/[\d.]+/g) || []).map(Number);
  const effBg = (el) => { let bg = el; while (bg && rgba(getComputedStyle(bg).backgroundColor)[3] === 0) bg = bg.parentElement; return rgba(getComputedStyle(bg || document.body).backgroundColor); };
  const els = [...document.querySelectorAll('main a, [role=main] a, main td, main th')].filter(a => a.offsetParent !== null && a.innerText.trim()).slice(0, 12);
  return els.map(a => {
    const f = rgba(getComputedStyle(a).color), b = effBg(a);
    const ratio = (Math.max(lum(...f.slice(0, 3)), lum(...b.slice(0, 3))) + 0.05) / (Math.min(lum(...f.slice(0, 3)), lum(...b.slice(0, 3))) + 0.05);
    return { text: a.innerText.slice(0, 24), ratio: Math.round(ratio * 100) / 100 };
  });
});
const badContrast = contrast.filter(c => c.ratio < 4.5);
check('contraste: textes et liens mesurés >= 4.5:1', contrast.length > 0 && badContrast.length === 0, JSON.stringify(badContrast));

await browser.close();
const ok = results.filter(r => r.ok).length;
console.log(JSON.stringify(results, null, 1));
console.log(`verify: ${ok}/${results.length} assertions OK`);
process.exit(ok === results.length ? 0 : 1);
