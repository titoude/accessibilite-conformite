// eval-final.mjs — assertions sur des comportements NON couverts par verify.mjs
// (évaluateur final indépendant, tests inutilisés).
// Usage: node eval-final.mjs <baseUrl>
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8090';
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); if (!ok) console.log(`  ÉCHEC: ${name} ${detail}`); };

const browser = await chromium.launch();
const page = await browser.newPage();

// 1. ordre des titres : jamais de saut > 1 niveau sur chaque page
for (const path of ['/', '/testtopic', '/settings', '/login']) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(1200);
  const order = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.offsetParent !== null).map(h => +h.tagName[1]));
  const skips = order.filter((l, i) => i > 0 && l - order[i - 1] > 1).length;
  check(`${path}: ordre des titres sans saut`, skips === 0, JSON.stringify(order));
}

// 2. images du contenu : alt présent ou aria-hidden
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1000);
const imgs = await page.evaluate(() => {
  const bad = [...document.querySelectorAll('main img')].filter(i => !i.hasAttribute('alt') && i.getAttribute('aria-hidden') !== 'true');
  return { bad: bad.length, total: document.querySelectorAll('main img').length };
});
check('login: images avec alt ou masquées', imgs.bad === 0, JSON.stringify(imgs));

// 3. lang de la page
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
const lang = await page.evaluate(() => document.documentElement.lang);
check('html: attribut lang non vide', !!lang, `lang=${lang}`);

// 4. dialog : Echap ferme ET le focus revient dans la page (pas de focus perdu)
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('nav', { timeout: 15000 });
await page.waitForTimeout(1200);
await page.locator('nav li').last().click();
await page.locator('.MuiDialog-root [role="dialog"]').first().waitFor({ state: 'visible', timeout: 10000 });
await page.keyboard.press('Escape');
await page.waitForTimeout(500);
const after = await page.evaluate(() => ({
  dialogGone: !document.querySelector('.MuiDialog-root [role="dialog"]'),
  focusTag: document.activeElement.tagName,
  focusInBody: document.activeElement === document.body,
}));
check('dialog: Echap ferme, focus récupéré par un élément focusable', after.dialogGone && !after.focusInBody, JSON.stringify(after));

// 5. champs de saisie : label accessible réel dans le dialog abonnement
await page.locator('nav li').last().click();
await page.locator('.MuiDialog-root [role="dialog"]').first().waitFor({ state: 'visible', timeout: 10000 });
const fields = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('.MuiDialog-root input, .MuiDialog-root textarea')].filter(i => i.offsetParent !== null && i.type !== 'hidden');
  return inputs.map(i => !!(i.getAttribute('aria-label') || i.getAttribute('aria-labelledby') || (i.id && document.querySelector(`label[for="${i.id}"]`)))).every(Boolean);
});
check('dialog: chaque champ visible a un nom accessible', fields === true, `all=${fields}`);
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// 6. reflow 320px : pas de scroll horizontal sur /
await page.setViewportSize({ width: 320, height: 800 });
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main', { timeout: 15000 });
await page.waitForTimeout(1200);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check('reflow 320px: pas de débordement horizontal', overflow <= 1, `overflow=${overflow}px`);

await browser.close();
const ok = results.filter(r => r.ok).length;
console.log(JSON.stringify(results, null, 1));
console.log(`eval-final: ${ok}/${results.length} OK`);
process.exit(ok === results.length ? 0 : 1);
