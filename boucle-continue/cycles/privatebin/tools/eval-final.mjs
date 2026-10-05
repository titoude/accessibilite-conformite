/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Couvre des aspects que le développement n'a pas testés : si l'un échoue,
 * c'est un finding légitime à consolider (FAIL), pas un bug du harnais.
 *
 * Usage: node eval-final.mjs <baseUrl>
 */
import { chromium } from 'playwright';

const [base] = process.argv.slice(2);
const results = [];
const ok = (name, cond, extra = '') => {
  results.push({ name, pass: !!cond });
  if (!cond) console.error(`  FAIL ${name} ${extra}`);
  return cond;
};

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

// ── A. Pas de piège clavier sur la page d'accueil (30 Tab sans boucle) ─────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#sendbutton:not(.hidden)', { timeout: 15000 });
await page.waitForTimeout(1000);
const trail = [];
await page.locator('body').click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(400);
for (let i = 0; i < 30; i++) {
  await page.keyboard.press('Tab');
  await page.waitForTimeout(150);
  trail.push(await page.evaluate(() => (document.activeElement ? (document.activeElement.id || document.activeElement.tagName + '.' + document.activeElement.className.toString().split(' ')[0]) : 'none')));
}
const uniq = new Set(trail).size;
const sawEditor = trail.includes('message') || trail.some(t => /sendbutton|messagetab/.test(t));
ok('clavier: focus progresse sur >= 6 éléments distincts (pas de piège)', uniq >= 6, `${uniq} éléments: ${trail.slice(0, 12).join('>')}`);
ok('clavier: l\'éditeur est atteignable au Tab', sawEditor, trail.join('>'));

// ── B. focus-visible : un indicateur de focus existe ───────────────────────
await page.locator('#messageedit').focus();
const focusInfo2 = await page.evaluate(() => {
  const el = document.activeElement;
  const cs = getComputedStyle(el);
  return { id: el.id, outline: cs.outlineStyle + ' ' + cs.outlineWidth, shadow: cs.boxShadow !== 'none' };
});
ok('focus: un indicateur visuel de focus est présent sur la tab',
  focusInfo2.outline !== 'none 0px' || focusInfo2.shadow, JSON.stringify(focusInfo2));

// ── C. Modale password : focus piégé dans la modale ────────────────────────
await page.goto(`${base}/?14997909a623b3a1#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2E`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#passwordmodal.show, #passwordmodal[style*="display: block"]', { timeout: 15000 });
await page.waitForTimeout(800);
for (let i = 0; i < 8; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(150); }
const modalFocus = await page.evaluate(() => {
  const modal = document.getElementById('passwordmodal');
  const ae = document.activeElement;
  return { inside: modal.contains(ae) || ae === modal, id: ae && ae.id };
});
ok('modale: le focus reste contenu dans #passwordmodal', modalFocus.inside, modalFocus.id);

// ── D. Dark mode : les liens de contenu gardent le bleu clair #6ea8fe ──────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#bd-theme', { timeout: 15000 });
await page.locator('label[for=bd-theme]').click();
await page.waitForFunction(() => document.documentElement.getAttribute('data-bs-theme') === 'dark', null, { timeout: 10000 });
await page.goto(`${base}/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#prettymessage:not(.hidden), #plaintext:not(.hidden)', { timeout: 15000 });
const darkLink = await page.evaluate(() => {
  const a = document.querySelector('#prettyprint a, #plaintext a');
  return a ? getComputedStyle(a).color : null;
});
ok('dark: lien de contenu reste clair (pas durci en dark)', darkLink === 'rgb(110, 168, 254)', String(darkLink));

// ── E. Page d'erreur : landmarks conservés ─────────────────────────────────
await page.goto(`${base}/?dddddddddddddddd`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
const err = await page.evaluate(() => ({
  h1: document.querySelectorAll('h1').length,
  main: !!document.querySelector('main'),
  alertShown: !document.getElementById('errormessage').classList.contains('hidden') && !!document.getElementById('errormessage').textContent.trim(),
}));
ok('erreur: h1 présent', err.h1 === 1, String(err.h1));
ok('erreur: landmark main présent', err.main);
ok('erreur: message d\'erreur affiché', err.alertShown);

// ── F. QR code : le rendu QR est accessible ────────────────────────────────
await page.goto(`${base}/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#prettymessage:not(.hidden)', { timeout: 15000 });
await page.locator('#qrcodelink').click();
await page.waitForSelector('#qrcodemodal.show', { timeout: 10000 });
await page.waitForTimeout(800);
const qr = await page.evaluate(() => {
  const box = document.getElementById('qrcode-display');
  const kids = [...box.querySelectorAll('*')];
  const named = kids.filter(k => k.getAttribute('aria-label') || k.getAttribute('title') || k.getAttribute('role') === 'img');
  return { children: kids.length, tagged: named.length, boxLabel: box.getAttribute('aria-label') };
});
ok('qr: le code rendu a un nom accessible (img/aria)', qr.children > 0 && (qr.tagged > 0 || !!qr.boxLabel), JSON.stringify(qr));

await browser.close();
const fails = results.filter(r => !r.pass).length;
console.log(`eval-final: ${results.length - fails}/${results.length} assertions OK`);
process.exit(fails ? 1 : 0);
