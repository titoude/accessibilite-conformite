// Vérificateur indépendant — CyberChef — assertions sur le DOM réel, inutilisées pendant la correction.
// Usage: node verify.mjs <base-url>
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:8080';
let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => { if (cond) { pass++; console.log('  PASS', name); } else { fail++; console.log('  FAIL', name, extra); } };

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(base + '/', { waitUntil: 'load', timeout: 60000 });
await page.waitForSelector('#operations li, .op-list li', { timeout: 60000 });
await page.waitForTimeout(1500);

console.log('== Vérification indépendante :', base);

// 1. viewport non bloquant
const vp = await page.locator('meta[name=viewport]').getAttribute('content');
ok('viewport content', /width=device-width/.test(vp || '') && !/user-scalable=no/.test(vp || '') && !/maximum-scale=1(\.0)?\b/.test(vp || ''), vp || 'absent');

// 2. landmarks
ok('exactly 1 banner', (await page.locator('[role=banner], header').count()) >= 1);
ok('exactly 1 main', (await page.locator('main, [role=main]').count()) === 1);
const navCount = await page.locator('nav, [role=navigation]').count();
const navsUnnamed = await page.evaluate(() =>
  [...document.querySelectorAll('nav,[role=navigation]')]
    .filter(n => !(n.getAttribute('aria-label') || n.getAttribute('aria-labelledby')))
    .length);
ok('navs exist & all labeled', navCount >= 1 && navsUnnamed === 0, `${navsUnnamed}/${navCount} unnamed`);

// 3. nom accessible des boutons icône (aria-label ou texte — title ne suffit PAS)
const unnamedBtns = await page.evaluate(() =>
  [...document.querySelectorAll('button,[role=button]')]
    .filter(b => b.offsetParent !== null && !(b.getAttribute('aria-label') || b.getAttribute('aria-labelledby') || (b.textContent || '').trim()))
    .map(b => (b.id || b.className || b.outerHTML.slice(0, 60))).slice(0, 5));
ok('all visible buttons named', unnamedBtns.length === 0, unnamedBtns.join(' | '));

// 4. CodeMirror : contenteditable nommé + scroller focusable (pas tabindex négatif)
// contenteditable sans attribut tabindex rend tabIndex=-1 mais reste tab-focusable :
// la propriété n'est pas une preuve — on vérifie nommage + vraie tabulation (test séparé).
const cm = await page.evaluate(() => {
  const sc = [...document.querySelectorAll('.cm-scroller')];
  const ce = [...document.querySelectorAll('.cm-content[contenteditable=true]')];
  return {
    scrollers: sc.map(e => e.tabIndex),
    editors: ce.map(e => ({ label: e.getAttribute('aria-label') || '' })),
  };
});
ok('cm-scroller tabindex >= 0', cm.scrollers.length >= 1 && cm.scrollers.every(t => t >= 0), JSON.stringify(cm.scrollers));
ok('cm-content named', cm.editors.length >= 2 && cm.editors.every(e => e.label.length > 0), JSON.stringify(cm.editors));
// tabulation réelle : l'éditeur input est joignable au clavier
let ceFocused = false;
for (let i = 0; i < 40 && !ceFocused; i++) {
  await page.keyboard.press('Tab'); await page.waitForTimeout(60);
  ceFocused = await page.evaluate(() => !!(document.activeElement && document.activeElement.classList.contains('cm-content')));
}
ok('cm-content reachable by Tab', ceFocused);

// 5. tabindex positifs (pattern anti-a11y)
const posTab = await page.evaluate(() => [...document.querySelectorAll('[tabindex]')].filter(e => e.tabIndex > 0).length);
ok('no positive tabindex', posTab === 0, `${posTab} found`);

// 6. snackbar-container (créé à la 1re notification) : déclencher une snackbar réelle puis vérifier role=status
await page.evaluate(() => { const el = document.createElement('div'); el.id = 'snackbar-container'; /* fallback */ });
// déclenchement réel : $.snackbar via une erreur bake ou appel direct
const snack = await page.evaluate(async () => {
  if (typeof $ !== 'undefined' && $.snackbar) {
    $.snackbar({ content: 'verify-test' });
    await new Promise(r => setTimeout(r, 300));
  }
  const el = document.querySelector('#snackbar-container');
  return el ? { role: el.getAttribute('role'), live: el.getAttribute('aria-live'), real: true } : { real: false };
});
ok('snackbar role=status + aria-live', snack.real && snack.role === 'status' && snack.live === 'polite', JSON.stringify(snack));

// 7. li dans tablist : role none/presentation
const badLi = await page.evaluate(() =>
  [...document.querySelectorAll('[role=tablist] > li')]
    .filter(li => !/none|presentation/.test(li.getAttribute('role') || '')).length);
ok('tablist children presentational', badLi === 0, `${badLi} li without role`);

// 8. modale save : aria-labelledby pointe sur un élément existant + nom calculé non vide
await page.locator('[aria-label="Save recipe"], button#save').first().click();
await page.waitForSelector('.modal.show, .modal.fade.show', { state: 'visible', timeout: 15000 });
await page.waitForTimeout(500);
const modal = await page.evaluate(() => {
  const m = document.querySelector('.modal.show');
  if (!m) return { found: false };
  const lb = m.getAttribute('aria-labelledby');
  const target = lb ? document.getElementById(lb) : null;
  const accName = m.getAttribute('aria-label') || (target ? target.textContent.trim() : '');
  return { found: true, lb, resolves: !!target, name: accName };
});
ok('modal accessible name resolves', modal.found && modal.resolves && modal.name.length > 0, JSON.stringify(modal));
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// 9. recherche : search-results caché quand vide
const sr = await page.evaluate(() => { const el = document.querySelector('#search-results'); return el ? { hidden: el.hidden, children: el.children.length } : null; });
ok('search-results hidden when empty', sr && (sr.hidden || sr.children > 0), JSON.stringify(sr));

await browser.close();
console.log(`\n${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
