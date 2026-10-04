// eval-final.mjs — évaluation INDÉPENDANTE du cycle umami.
// Pages et interactions NON couvertes par le périmètre figé ni par verify.mjs.
// Usage: node eval-final.mjs <baseUrl>
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const AXE_SRC = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const AXE_TAGS = ['wcag2a', 'wcag2a-best-practice', 'wcag2aa', 'wcag2aa-best-practice', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
async function runAxe(page) {
  await page.evaluate(AXE_SRC);
  return page.evaluate(tags => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }), AXE_TAGS);
}

const BASE = process.argv[2] || 'http://localhost:3000';
const WSID = 'd4bdaf1e-bca5-465f-848d-f33a9045daf3';
const toolsDir = path.dirname(new URL(import.meta.url).pathname);
const storage = fs.existsSync(path.join(toolsDir, 'auth.json')) ? path.join(toolsDir, 'auth.json') : undefined;

let failures = 0;
const ok = (n, c, d = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n}${d ? ' — ' + d : ''}`); if (!c) failures++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: storage });
const page = await ctx.newPage();
const axe = async (u, wait = 3500) => {
  await page.goto(BASE + u, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(wait);
  const r = await runAxe(page);
  return r.violations;
};

// A. Pages NON auditées dans le cycle (hors périmètre figé)
const fresh = [
  `/websites/${WSID}/attribution`,
  `/websites/${WSID}/journeys`,
  `/websites/${WSID}/performance`,
  `/websites/${WSID}/cohorts`,
  `/websites/${WSID}/goals`,
  `/websites/${WSID}/compare`,
  '/boards/create',
];
for (const u of fresh) {
  const v = await axe(u);
  ok(`axe 0 violation sur ${u} (hors périmètre)`, v.length === 0, v.map(x => x.id).join(','));
}

// B. Page 404 réelle : axe + h1 présent
await page.goto(BASE + '/route-qui-nexiste-pas-xyz', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
const nf = await runAxe(page);
const nfH1 = await page.locator('h1').count();
ok('404 réelle: axe 0 violation', nf.violations.length === 0, nf.violations.map(x => x.id).join(','));
ok('404 réelle: h1 présent', nfH1 >= 1, `h1=${nfH1}`);

// C. Dialog d'édition de site (interaction jamais scannée) : axe sur la page + dialog ouverte nommée
await page.goto(`${BASE}/websites/${WSID}/settings`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3500);
const editBtn = page.getByRole('button', { name: /edit/i }).first();
const editCount = await editBtn.count();
ok('dialog édition site: déclencheur trouvé', editCount >= 1, `count=${editCount}`);
if (editCount) {
  await editBtn.click();
  await page.waitForTimeout(1200);
  const dv = await runAxe(page);
  const dlg = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const lb = d?.getAttribute('aria-labelledby');
    const name = d?.getAttribute('aria-label') || (lb ? document.getElementById(lb)?.textContent : null);
    return { found: !!d, name, inLayer: d ? document.getElementById('a11y-popup-layer')?.contains(d) : null, focusInside: d ? d.contains(document.activeElement) : null };
  });
  ok('dialog édition site ouverte: axe 0 violation', dv.violations.length === 0, dv.violations.map(x => x.id).join(','));
  ok('dialog édition site: nommée, focus dedans, dans la couche', dlg.found && !!dlg.name && dlg.focusInside === true && dlg.inLayer === true, JSON.stringify(dlg));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
}

// D. Mode sombre : axe sur une page riche (détail site) après bascule
await page.goto(`${BASE}/websites/${WSID}`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3500);
await page.evaluate(() => {
  localStorage.setItem('umami.theme', 'dark');
  document.documentElement.setAttribute('data-theme', 'dark');
});
await page.waitForTimeout(1200);
const darkV = await runAxe(page);
ok('mode sombre: axe 0 violation sur détail site', darkV.violations.length === 0, darkV.violations.map(x => x.id).join(','));
await page.evaluate(() => {
  localStorage.setItem('umami.theme', 'light');
  document.documentElement.setAttribute('data-theme', 'light');
});

// E. Reflow 320px : axe + contenu clé toujours présent (menu mobile)
await page.setViewportSize({ width: 320, height: 700 });
await page.goto(BASE + '/websites', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3500);
const rv = await runAxe(page);
ok('reflow 320px: axe 0 violation', rv.violations.length === 0, rv.violations.map(x => x.id).join(','));
const mobileOk = await page.evaluate(() => {
  const menuBtn = [...document.querySelectorAll('button')].find(b => (b.getAttribute('aria-label') || '').match(/menu/i));
  return { menuBtn: !!menuBtn, hScroll: document.documentElement.scrollWidth <= 340 };
});
ok('reflow 320px: bouton menu nommé + pas de scroll horizontal', mobileOk.menuBtn && mobileOk.hScroll, JSON.stringify(mobileOk));
// ouvrir le menu mobile : axe avec la nav ouverte
const mobBtn = page.getByRole('button', { name: /menu/i }).first();
const mobCount = await mobBtn.count();
ok('reflow 320px: déclencheur menu mobile présent (précondition)', mobCount >= 1, `count=${mobCount}`);
if (mobCount) {
  await mobBtn.click();
  await page.waitForTimeout(1000);
  const mv = await runAxe(page);
  ok('reflow 320px: menu mobile ouvert, axe 0 violation', mv.violations.length === 0, mv.violations.map(x => x.id).join(','));
  await page.keyboard.press('Escape');
}
await page.setViewportSize({ width: 1280, height: 800 });

// F. Select de site sur /sessions (interaction hors verify) : listbox dans la couche, nommée
await page.goto(`${BASE}/websites/${WSID}/sessions`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3500);
const sel = page.locator('[role="combobox"]').first();
const selCount = await sel.count();
ok('select site: combobox présent (précondition)', selCount >= 1, `count=${selCount}`);
if (selCount) {
  await sel.click();
  await page.waitForTimeout(900);
  const lv = await runAxe(page);
  const lb = await page.evaluate(() => {
    const l = document.querySelector('[role="listbox"]');
    return { found: !!l, inLayer: l ? document.getElementById('a11y-popup-layer')?.contains(l) : null };
  });
  ok('select site ouvert: axe 0 violation', lv.violations.length === 0, lv.violations.map(x => x.id).join(','));
  ok('select site: listbox montée dans la couche landmark', lb.found && lb.inLayer === true, JSON.stringify(lb));
  await page.keyboard.press('Escape');
}

await browser.close();
console.log(failures === 0 ? 'eval-final: ALL PASS' : `eval-final: ${failures} échec(s)`);
process.exit(failures ? 1 : 0);
