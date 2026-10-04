// verify.mjs — assertions indépendantes du score axe (effect, not action).
// Règle : tout élément REQUIS absent = FAIL (jamais de pass vacuole) ; les noms
// accessibles sont CALCULÉS (getByRole name / résolution aria-labelledby), pas
// déduits de la présence d'un attribut.
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

// 2. exactement un h1 visible ET NON VIDE par page (/, /testtopic, /settings)
for (const path of ['/', '/testtopic', '/settings']) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(1200);
  const h = await page.evaluate(() => {
    const vis = [...document.querySelectorAll('h1')].filter(h => h.offsetParent !== null);
    return { count: vis.length, text: vis[0]?.innerText?.trim() || '' };
  });
  check(`h1: exactement un visible et non vide sur ${path}`, h.count === 1 && h.text.length > 0, JSON.stringify(h));
}

// 3. login : h1 dans <main> + lien logo dont le NOM CALCULÉ est non vide + landmark main unique
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1000);
const login = await page.evaluate(() => {
  const accName = (el) => {
    if (!el) return '';
    const al = el.getAttribute('aria-label');
    if (al && al.trim()) return al.trim();
    const lb = el.getAttribute('aria-labelledby');
    if (lb) return lb.split(/\s+/).map(id => document.getElementById(id)?.innerText?.trim() || '').join(' ').trim();
    const t = (el.innerText || '').trim();
    if (t) return t;
    const img = el.querySelector('img[alt]');
    return img ? img.getAttribute('alt').trim() : '';
  };
  const logoLink = [...document.querySelectorAll('main a, main [role=link]')].find(a => a.href && /\/$/.test(new URL(a.href).pathname)) || document.querySelector('main a');
  return {
    h1: [...document.querySelectorAll('main h1')].filter(h => h.offsetParent !== null).length,
    h1Text: document.querySelector('main h1')?.innerText?.trim() || '',
    logoName: accName(logoLink),
    logoFound: !!logoLink,
    mains: document.querySelectorAll('main').length,
  };
});
check('login: h1 non vide dans <main>, lien logo nommé (calculé), landmark main unique',
  login.h1 === 1 && login.h1Text.length > 0 && login.logoFound && login.logoName.length > 0 && login.mains === 1,
  JSON.stringify(login));

// 4. landmark nav : présent ET sans <nav> imbriqué
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1200);
const navs = await page.evaluate(() => {
  const all = [...document.querySelectorAll('nav, [role=navigation]')];
  const nested = all.filter(n => n.closest('nav, [role=navigation]') !== n && n.closest('nav, [role=navigation]'));
  return { total: all.length, nested: nested.length };
});
check('landmarks: nav présente, aucun <nav> imbriqué', navs.total >= 1 && navs.nested === 0, JSON.stringify(navs));

// 5. structure ul>li légale dans la nav : au moins un ul présent, enfants directs tous <li>
const listRes = await page.evaluate(() => {
  const bad = [];
  let uls = 0;
  document.querySelectorAll('nav ul, [role=navigation] ul').forEach(ul => {
    uls++;
    [...ul.children].forEach(c => {
      const role = c.getAttribute('role');
      if (!(c.tagName === 'LI' || c.tagName === 'SCRIPT' || c.tagName === 'TEMPLATE') && role !== 'none' && role !== 'presentation') {
        bad.push(`${c.tagName}[role=${role}]`);
      }
    });
  });
  return { bad, uls };
});
check('nav: >=1 ul, enfants directs tous <li>', listRes.uls >= 1 && listRes.bad.length === 0, JSON.stringify(listRes));

// 6. menu contextuel abonnement : bouton trouvé PAR NOM CALCULÉ, menu monté dans le layer
await page.goto(BASE + '/testtopic', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1500);
const subBtn = page.locator('main button').filter({ hasText: /subscribe/i }).first();
if (await subBtn.count()) { await subBtn.click(); await page.waitForTimeout(1500); }
const menuBtn = page.locator('nav').getByRole('button', { name: /action menu/i }).first();
const menuBtnFound = await menuBtn.count() > 0;
check('menu contextuel: bouton "Open/close action menu" localisé par nom accessible', menuBtnFound, `count=${await menuBtn.count()}`);
if (menuBtnFound) {
  await menuBtn.click();
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
} else {
  results.push({ name: 'menu contextuel: [role=menu] dans layer', ok: false, detail: 'bouton menu introuvable' });
  results.push({ name: 'menu contextuel: #root jamais aria-hidden', ok: false, detail: 'bouton menu introuvable' });
}

// 7. dialog s'abonner : ouvert PAR NOM CALCULÉ du item nav, dans le layer, focus dedans, #root non masqué
const subscribeItem = page.locator('nav').getByRole('button', { name: /subscribe to topic/i }).first();
const subFound = await subscribeItem.count() > 0;
if (subFound) {
  await subscribeItem.click();
  await page.locator('.MuiDialog-root [role="dialog"]').first().waitFor({ state: 'visible', timeout: 10000 });
  const dlg = await page.evaluate(() => {
    const d = document.querySelector('.MuiDialog-root [role="dialog"]');
    const layer = document.getElementById('a11y-popup-layer');
    const root = document.getElementById('root');
    return {
      open: !!d,
      inLayer: !!(d && layer && layer.contains(d)),
      focusInside: d ? d.contains(document.activeElement) : false,
      rootHidden: root?.getAttribute('aria-hidden'),
      layerHidden: layer?.getAttribute('aria-hidden'),
    };
  });
  check('dialog souscription: ouvert, monté dans #a11y-popup-layer, focus à l\'intérieur', dlg.open && dlg.inLayer && dlg.focusInside, JSON.stringify(dlg));
  check('dialog souscription: ni #root ni le layer en aria-hidden', dlg.rootHidden !== 'true' && dlg.layerHidden !== 'true', JSON.stringify({ rootHidden: dlg.rootHidden, layerHidden: dlg.layerHidden }));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
} else {
  check('dialog souscription: item nav "Subscribe to topic" localisé par nom', false, 'introuvable');
}

// 8. selects des préférences : aria-labelledby RÉSOLU vers un élément au texte non vide
await page.goto(BASE + '/settings', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1200);
const combos = await page.evaluate(() => {
  const els = [...document.querySelectorAll('[role="combobox"]')];
  const resolveName = (el) => {
    const lb = el.getAttribute('aria-labelledby');
    if (lb) {
      const txt = lb.split(/\s+/).map(id => (document.getElementById(id)?.innerText || '').trim()).join(' ').trim();
      if (txt) return txt;
    }
    const al = el.getAttribute('aria-label');
    if (al && al.trim()) return al.trim();
    const wrap = el.closest('.MuiFormControl-root, .MuiInputBase-root, div');
    const lbl = wrap && wrap.querySelector('label');
    return lbl ? lbl.innerText.trim() : '';
  };
  return { total: els.length, named: els.filter(el => resolveName(el).length > 0).length };
});
check('settings: chaque combobox a un NOM CALCULÉ non vide', combos.total > 0 && combos.named === combos.total, JSON.stringify(combos));

// 9. formulaire de publication : landmark form présent ET nom calculé non vide
await page.goto(BASE + '/testtopic', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1200);
const form = await page.evaluate(() => {
  const f = document.querySelector('form');
  if (!f) return { found: false };
  const al = f.getAttribute('aria-label') || '';
  const lb = f.getAttribute('aria-labelledby');
  const lbText = lb ? lb.split(/\s+/).map(id => (document.getElementById(id)?.innerText || '').trim()).join(' ').trim() : '';
  return { found: true, name: (al || lbText).trim() };
});
check('publication: <form> landmark présent avec nom calculé non vide', form.found === true && form.name.length > 0, JSON.stringify(form));

// 10. contraste : TOUS les liens visibles de / >= 4.5:1, dont le lien du message markdown (F1)
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1200);
const contrastFn = () => {
  const lum = (r, g, b) => {
    const c = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const rgb = (s) => (s.match(/\d+/g) || []).map(Number);
  const links = [...document.querySelectorAll('a')].filter(a => a.offsetParent !== null && a.innerText.trim());
  return links.map(a => {
    const cs = getComputedStyle(a);
    let bg = a;
    while (bg && rgb(getComputedStyle(bg).backgroundColor)[3] === 0) bg = bg.parentElement;
    const f = rgb(cs.color), b = rgb(getComputedStyle(bg || document.body).backgroundColor);
    const ratio = (Math.max(lum(...f), lum(...b)) + 0.05) / (Math.min(lum(...f), lum(...b)) + 0.05);
    return { text: a.innerText.slice(0, 30), href: a.getAttribute('href'), ratio: Math.round(ratio * 100) / 100 };
  });
};
const contrastHome = await page.evaluate(contrastFn);
const badHome = contrastHome.filter(c => c.ratio < 4.5);
check('contraste /: tous les liens visibles >= 4.5:1', contrastHome.length > 0 && badHome.length === 0, JSON.stringify(badHome));

// 10b. F1 : le message markdown seedé contient UN LIEN (requis : absent = FAIL) et il passe 4.5:1
await page.goto(BASE + '/testtopic', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1500);
const mdLink = await page.evaluate(() => {
  const links = [...document.querySelectorAll('main a[href]')].filter(a => a.offsetParent !== null);
  const ext = links.find(a => /ntfy\.sh/.test(a.getAttribute('href') || '')) || links.find(a => /https?:/.test(a.getAttribute('href') || ''));
  if (!ext) return { found: false, links: links.map(a => a.getAttribute('href')) };
  const lum = (r, g, b) => {
    const c = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const rgb = (s) => (s.match(/\d+/g) || []).map(Number);
  const cs = getComputedStyle(ext);
  let bg = ext;
  while (bg && rgb(getComputedStyle(bg).backgroundColor)[3] === 0) bg = bg.parentElement;
  const f = rgb(cs.color), b = rgb(getComputedStyle(bg || document.body).backgroundColor);
  const ratio = (Math.max(lum(...f), lum(...b)) + 0.05) / (Math.min(lum(...f), lum(...b)) + 0.05);
  return { found: true, href: ext.getAttribute('href'), color: cs.color, bg: bg ? getComputedStyle(bg).backgroundColor : null, ratio: Math.round(ratio * 100) / 100 };
});
check('F1: message markdown contient un lien rendu', mdLink.found === true, JSON.stringify(mdLink));
check('F1: lien markdown >= 4.5:1 (calculé)', mdLink.found && mdLink.ratio >= 4.5, `ratio=${mdLink.ratio} color=${mdLink.color} bg=${mdLink.bg}`);

await browser.close();
const ok = results.filter(r => r.ok).length;
console.log(JSON.stringify(results, null, 1));
console.log(`verify: ${ok}/${results.length} assertions OK`);
process.exit(ok === results.length ? 0 : 1);
