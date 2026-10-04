// Éval finale — critères NON utilisés pendant la correction (hors scope axe).
// Usage: node eval-final.mjs <base-url>
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:8080';
let pass = 0, fail = 0, na = 0;
const ok = (name, cond, extra = '') => { if (cond) { pass++; console.log('  PASS', name); } else { fail++; console.log('  FAIL', name, extra); } };
const skip = (name, why) => { na++; console.log('  N-A ', name, '—', why); };

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(base + '/', { waitUntil: 'load', timeout: 60000 });
await page.waitForSelector('#operations li, .op-list li', { timeout: 60000 });
await page.waitForTimeout(1500);

console.log('== Éval finale :', base);

// A. titre de page
ok('title non-empty', ((await page.title()) || '').trim().length > 0);

// B. Tab visible : focus à la loupe sur un élément interactif après N tabs
let focusVisible = false;
for (let i = 0; i < 15 && !focusVisible; i++) {
  await page.keyboard.press('Tab');
  await page.waitForTimeout(80);
  focusVisible = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return false;
    const cs = getComputedStyle(el);
    const boxShadowHas = (cs.boxShadow || '') !== 'none';
    return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 || boxShadowHas;
  });
}
ok('keyboard focus visible within 15 tabs', focusVisible);

// B2. piège clavier éditeur : Tab insère, Escape doit libérer (2.1.2)
// (le focus-visible ci-dessus peut rester dans cm-content — vérifier l'échappatoire)
const inEditor = await page.evaluate(() => document.activeElement?.classList.contains('cm-content'));
if (!inEditor) {
  await page.evaluate(() => document.querySelector('.cm-content').focus());
}
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
await page.keyboard.press('Tab');
await page.waitForTimeout(200);
const escaped = await page.evaluate(() => !(document.activeElement && document.activeElement.classList.contains('cm-content')));
ok('Escape releases editor keyboard trap', escaped);

// C. opération ajoutable au clavier ? (draggable list) — N-A si non conçu clavier
skip('add operation keyboard-only', 'drag&drop jQuery UI — non testable sans protocol dédié (axe ne couvre pas)');

// D. modale : Escape ferme
await page.locator('[aria-label="Save recipe"], button#save').first().click();
await page.waitForSelector('.modal.show', { state: 'visible', timeout: 15000 });
await page.waitForTimeout(500);
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
const modalGone = await page.evaluate(() => !document.querySelector('.modal.show'));
ok('Escape closes modal', modalGone);

// E. focus pas piégé hors modale quand modale ouverte (reteste vite)
await page.locator('[aria-label="Save recipe"], button#save').first().click();
await page.waitForSelector('.modal.show', { state: 'visible', timeout: 15000 });
await page.waitForTimeout(400);
let focusInModal = false;
for (let i = 0; i < 12 && !focusInModal; i++) {
  await page.keyboard.press('Tab'); await page.waitForTimeout(80);
  focusInModal = await page.evaluate(() => !!document.activeElement?.closest('.modal.show'));
}
ok('modal contains focus after tabbing', focusInModal);
await page.keyboard.press('Escape'); await page.waitForTimeout(400);

// F. reflow 320px — pas de scroll horizontal
await page.setViewportSize({ width: 320, height: 568 });
await page.waitForTimeout(800);
const hScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
ok('no horizontal scroll at 320px', !hScroll);
await page.setViewportSize({ width: 1280, height: 800 });

// G. texte zoom 200 % — contenu toujours présent (mesure d'effet, pas d'action)
await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
await page.waitForTimeout(400);
const bodyOk = await page.evaluate(() => document.body.innerText.trim().length > 200);
await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
ok('content survives 200% root font zoom', bodyOk);

// H. noms accessibles calculés (ariaSnapshot) sur la modale réouverte
await page.locator('[aria-label="Save recipe"], button#save').first().click();
await page.waitForSelector('.modal.show', { state: 'visible', timeout: 15000 });
await page.waitForTimeout(400);
const snap = await page.locator('.modal.show').ariaSnapshot();
ok('modal exposes a name in a11y tree', /dialog|Save/i.test(snap || ''), (snap || '').slice(0, 80));
await page.keyboard.press('Escape');

await browser.close();
console.log(`\n${pass} PASS, ${fail} FAIL, ${na} N-A`);
process.exit(fail ? 1 : 0);
