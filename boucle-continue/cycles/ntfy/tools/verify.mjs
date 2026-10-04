// verify.mjs — assertions indépendantes du score axe (effect, not action).
// Usage: node verify.mjs <baseUrl>
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8090';
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); if (!ok) console.log(`  ÉCHEC: ${name} ${detail}`); };

const browser = await chromium.launch();
const page = await browser.newPage();

// 1. viewport : zoom autorisé (pas de user-scalable=no / maximum-scale)
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
const vp = await page.evaluate(() => document.querySelector('meta[name=viewport]')?.content || '');
check('viewport: zoom utilisateur autorisé', !/user-scalable\s*=\s*no|maximum-scale/i.test(vp), vp);

// 2. exactement un h1 visible par page (/, /testtopic, /settings)
for (const path of ['/', '/testtopic', '/settings']) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(1200);
  const n = await page.evaluate(() => [...document.querySelectorAll('h1')].filter(h => h.offsetParent !== null).length);
  check(`h1: exactement un visible sur ${path}`, n === 1, `count=${n}`);
}

// 3. login : h1 présent (AuthLayout) + lien logo nommé + main landmark
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1000);
const login = await page.evaluate(() => ({
  h1: [...document.querySelectorAll('main h1')].filter(h => h.offsetParent !== null).length,
  linkName: !!document.querySelector('main a[aria-label]'),
  mains: document.querySelectorAll('main').length,
}));
check('login: h1 dans <main>, lien logo nommé, landmark main unique', login.h1 === 1 && login.linkName && login.mains === 1, JSON.stringify(login));

// 4. landmark nav unique (pas de <nav> imbriqué)
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1200);
const navs = await page.evaluate(() => {
  const all = [...document.querySelectorAll('nav, [role=navigation]')];
  const nested = all.filter(n => n.closest('nav, [role=navigation]') !== n && n.closest('nav, [role=navigation]'));
  return { total: all.length, nested: nested.length };
});
check('landmarks: aucun <nav> imbriqué', navs.nested === 0, JSON.stringify(navs));

// 5. structure ul>li légale dans la nav (aucun div role=button direct de ul, pas de hr direct)
const listOk = await page.evaluate(() => {
  const bad = [];
  document.querySelectorAll('ul').forEach(ul => {
    [...ul.children].forEach(c => {
      const role = c.getAttribute('role');
      if (!(c.tagName === 'LI' || c.tagName === 'SCRIPT' || c.tagName === 'TEMPLATE') && role !== 'none' && role !== 'presentation') {
        if (c.tagName !== 'LI') bad.push(`${c.tagName}[role=${role}]`);
      }
    });
  });
  return bad;
});
check('nav: enfants directs du ul tous <li>', listOk.length === 0, JSON.stringify(listOk));

// 6. menu contextuel abonnement : s'ouvre ET vit dans le landmark portail
await page.goto(BASE + '/testtopic', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1500);
const subBtn = page.locator('main button').filter({ hasText: /subscribe/i }).first();
if (await subBtn.count()) { await subBtn.click(); await page.waitForTimeout(1500); }
await page.locator('nav li button[aria-label]').last().click();
await page.locator('[role="menu"], .MuiMenu-paper').first().waitFor({ state: 'visible', timeout: 10000 });
const popup = await page.evaluate(() => {
  const menu = document.querySelector('[role="menu"]');
  const layer = document.getElementById('a11y-popup-layer');
  return {
    menuFound: !!menu,
    inLayer: !!(menu && layer && layer.contains(menu)),
    layerRole: layer?.getAttribute('role'),
    rootHidden: document.getElementById('root').getAttribute('aria-hidden'),
  };
});
check('menu contextuel: [role=menu] monté dans #a11y-popup-layer[role=complementary]', popup.menuFound && popup.inLayer && popup.layerRole === 'complementary', JSON.stringify(popup));
check('menu contextuel: #root jamais aria-hidden', popup.rootHidden !== 'true', `rootHidden=${popup.rootHidden}`);
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// 7. dialog s'abonner : s'ouvre, modal focusé dans le dialog
await page.locator('nav li').last().click();
await page.locator('.MuiDialog-root [role="dialog"]').first().waitFor({ state: 'visible', timeout: 10000 });
const dlg = await page.evaluate(() => {
  const d = document.querySelector('.MuiDialog-root [role="dialog"]');
  return { open: !!d, focusInside: d ? d.contains(document.activeElement) : false };
});
check('dialog souscription: ouvert, focus à l\'intérieur', dlg.open && dlg.focusInside, JSON.stringify(dlg));
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// 8. selects des préférences : nom accessible réel (combobox MUI)
await page.goto(BASE + '/settings', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1200);
const combos = await page.evaluate(() => {
  const els = [...document.querySelectorAll('[role="combobox"]')];
  return els.map(el => el.getAttribute('aria-labelledby') || el.getAttribute('aria-label') || '').filter(Boolean).length;
});
check('settings: chaque combobox a un nom accessible', combos > 0 && combos === (await page.locator('[role="combobox"]').count()), `labelled=${combos}`);

// 9. formulaire de publication : est un landmark form nommé
await page.goto(BASE + '/testtopic', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1200);
const form = await page.evaluate(() => {
  const f = document.querySelector('form[aria-label]');
  return { found: !!f, named: !!(f && f.getAttribute('aria-label')) };
});
check('publication: <form> landmark nommé', form.found && form.named, JSON.stringify(form));

// 10. contraste : texte des liens du pied >= 4.5:1 sur leur fond
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1200);
const contrast = await page.evaluate(() => {
  const lum = (r, g, b) => {
    const c = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const rgb = (s) => (s.match(/\d+/g) || []).map(Number);
  const links = [...document.querySelectorAll('a')].filter(a => a.offsetParent !== null && a.innerText.trim());
  return links.slice(0, 8).map(a => {
    const cs = getComputedStyle(a);
    let bg = a;
    while (bg && rgb(getComputedStyle(bg).backgroundColor)[3] === 0) bg = bg.parentElement;
    const f = rgb(cs.color), b = rgb(getComputedStyle(bg || document.body).backgroundColor);
    const ratio = (Math.max(lum(...f), lum(...b)) + 0.05) / (Math.min(lum(...f), lum(...b)) + 0.05);
    return { text: a.innerText.slice(0, 20), ratio: Math.round(ratio * 100) / 100 };
  });
});
const badContrast = contrast.filter(c => c.ratio < 4.5);
check('contraste: liens visibles >= 4.5:1', badContrast.length === 0, JSON.stringify(badContrast));

await browser.close();
const ok = results.filter(r => r.ok).length;
console.log(JSON.stringify(results, null, 1));
console.log(`verify: ${ok}/${results.length} assertions OK`);
process.exit(ok === results.length ? 0 : 1);
