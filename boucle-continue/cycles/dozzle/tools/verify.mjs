// verify.mjs — cycle 9 dozzle : assertions indépendantes des corrections
import { chromium } from 'playwright';
const BASE = process.env.DZ_URL || 'http://localhost:8083';
const CID = '0b8bb5aa3e7f'; // a11y-web
const CID2 = '3020dc9b6f19'; // a11y-db
let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => { if (cond) { pass++; console.log(`PASS ${name}`); } else { fail++; console.log(`FAIL ${name} ${extra}`); } };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

// 1. landmarks : un main unique, splitter nav reparenté dans aside
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[role="main"]', { timeout: 15000 });
await page.waitForTimeout(1500);
let r = await page.evaluate(() => {
  const mains = document.querySelectorAll('main, [role="main"]');
  const sp = document.querySelector('.splitpanes__splitter');
  const aside = document.querySelector('aside');
  return {
    mains: mains.length,
    spInAside: !!(sp && aside && aside.contains(sp)),
    spRole: sp?.getAttribute('role'),
    spLabel: sp?.getAttribute('aria-label'),
    spNow: sp?.getAttribute('aria-valuenow'),
  };
});
ok('single-main', r.mains === 1, JSON.stringify(r));
ok('splitter-in-aside', r.spInAside && r.spRole === 'separator' && !!r.spLabel && !!r.spNow, JSON.stringify(r));

// 2. splitter : drag au pointeur redimensionne la nav
const w0 = await page.evaluate(() => document.querySelector('aside')?.getBoundingClientRect().width);
const box = (await page.locator('.splitpanes__splitter').first().boundingBox());
await page.mouse.move(box.x + 2, box.y + 400);
await page.mouse.down();
await page.mouse.move(box.x + 80, box.y + 400, { steps: 10 });
await page.mouse.up();
await page.waitForTimeout(500);
const w1 = await page.evaluate(() => document.querySelector('aside')?.getBoundingClientRect().width);
ok('splitter-drag', Math.abs(w1 - w0) > 30, `${w0} -> ${w1}`);

// 3. splitter : resize clavier (flèche change la taille + aria-valuenow suit)
await page.locator('.splitpanes__splitter').first().focus();
const now0 = await page.locator('.splitpanes__splitter').first().getAttribute('aria-valuenow');
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(400);
const w2 = await page.evaluate(() => document.querySelector('aside')?.getBoundingClientRect().width);
const now1 = await page.locator('.splitpanes__splitter').first().getAttribute('aria-valuenow');
ok('splitter-keyboard', Math.abs(w2 - w1) > 2 && now1 !== now0, `w:${w1}->${w2} now:${now0}->${now1}`);

// 4. h1 : présent sur desktop (aside) et mobile (sr-only)
ok('h1-desktop', (await page.locator('h1').count()) >= 1);
await page.setViewportSize({ width: 390, height: 800 });
await page.waitForTimeout(800);
ok('h1-mobile', await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const rect = h1?.getBoundingClientRect();
  return !!h1 && rect && (rect.width === 0 || rect.width <= 1 || getComputedStyle(h1).position === 'absolute');
}));
await page.setViewportSize({ width: 1280, height: 800 });

// 5. search modal : Ctrl+K ouvre un dialog avec input focusable
// (recharger : un drawer mobile resté ouvert ou un splitter focusé bloque le raccourci)
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[role="main"]', { timeout: 15000 });
await page.waitForTimeout(1200);
await page.keyboard.press('Escape');
await page.evaluate(() => document.activeElement?.blur());
// L'handler Ctrl+K est enregistré à l'hydratation : réessayer tant que la modale n'est pas là.
let modal = false;
for (let i = 0; i < 3 && !modal; i++) {
  await page.keyboard.press('Control+k');
  // Plusieurs <dialog open> coexistent (tiroir latéral, modale recherche) : cibler celle avec un input.
  modal = await page.waitForSelector('dialog[open]:has(input)', { timeout: 4000 }).then(() => true).catch(() => false);
}
ok('search-modal', modal);
await page.keyboard.press('Escape');
await page.waitForTimeout(500);

// 6. pinned pane : role=complementary nommé + splitter interne reparenté dedans
await page.goto(`${BASE}/container/${CID}?columns=${CID2}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelectorAll('.splitpanes__splitter').length >= 2, undefined, { timeout: 12000 });
await page.waitForTimeout(1200);
r = await page.evaluate(() => {
  const comp = document.querySelectorAll('[role="complementary"]');
  const inner = [...document.querySelectorAll('.splitpanes__splitter')].filter(s => !s.closest('aside'));
  return {
    comp: comp.length,
    labelled: [...comp].every(c => c.getAttribute('aria-label')),
    innerInComp: inner.length > 0 && inner.every(s => s.closest('[role="complementary"]')),
    innerLabels: inner.map(s => s.getAttribute('aria-label')),
  };
});
ok('pinned-complementary', r.comp >= 1 && r.labelled && r.innerInComp && r.innerLabels.every(Boolean), JSON.stringify(r));

// 7. page conteneur : boutons d'actions nommés
await page.goto(`${BASE}/container/${CID}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[role="main"]', { timeout: 15000 });
await page.waitForTimeout(1500);
ok('log-actions-named', await page.evaluate(() => {
  const unnamed = [...document.querySelectorAll('button')].filter(b => {
    const acc = b.getAttribute('aria-label') || b.getAttribute('title') || b.textContent.trim();
    return !acc;
  });
  return unnamed.length === 0;
}));

// 8. dark theme : localStorage -> html.dark, contrastes mesurables
await page.evaluate(() => localStorage.setItem('vueuse-color-scheme', 'dark'));
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForSelector('[role="main"]', { timeout: 15000 });
await page.waitForTimeout(1200);
ok('dark-theme', await page.evaluate(() => document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark'));
await page.evaluate(() => localStorage.setItem('vueuse-color-scheme', 'auto'));

// 9. login : form POST fonctionnel (storageState réel créé par login.mjs)
{
  const ctx2 = await browser.newContext();
  const p2 = await ctx2.newPage();
  await p2.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
  await p2.waitForSelector('input[name="username"], input[type="text"]', { timeout: 10000 });
  ok('login-form', await p2.evaluate(() => !!document.querySelector('input[type="password"]') && !!document.querySelector('main')));
  await ctx2.close();
}

console.log(`\n${pass} PASS, ${fail} FAIL`);
await browser.close();
process.exit(fail ? 1 : 0);
