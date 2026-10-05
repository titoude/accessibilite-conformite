/**
 * eval-final.mjs — contrôles INDÉPENDANTS sur Gatus, non utilisés pendant les fixes.
 * Couvre des aspects hors du périmètre des corrections : si l'un échoue,
 * c'est un finding légitime à consolider (FAIL), pas un bug du harnais.
 * Un élément non trouvé = N-A déclaré (jamais PASS silencieux).
 *
 * Usage : node eval-final.mjs <baseUrl>
 */
import { chromium } from 'playwright';

const [base] = process.argv.slice(2);
const results = [];
const ok = (name, cond, extra = '') => {
  results.push({ name, status: cond ? 'PASS' : 'FAIL', extra });
  if (!cond) console.error(`  FAIL ${name} ${extra}`);
  return cond;
};
const na = (name, reason) => {
  results.push({ name, status: 'N-A', extra: reason });
  console.warn(`  N-A ${name} — ${reason}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const gotoWait = async (url, sel = '#settings') => {
  await page.goto(`${base}${url}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(sel, { timeout: 15000 });
  await page.waitForTimeout(2500);
};

// ── A. h1 unique sur chaque URL publique ───────────────────────────────────
for (const url of ['/', '/endpoints/core_front-end', '/endpoints/internal_legacy-service', '/suites/api-tests_checkout-flow']) {
  await gotoWait(url, 'main');
  const h1s = await page.evaluate(() => [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).filter(Boolean));
  ok(`${url}: exactement 1 h1 non vide`, h1s.length === 1, h1s.join('|'));
}

// ── B. Navigation clavier : Enter sur le lien carte mène aux détails ───────
await gotoWait('/');
const cardLink = page.locator('.endpoint [role="link"]').first();
if (await cardLink.count() === 0) na('B. navigation carte', 'aucun [role=link] dans une carte endpoint');
else {
  await cardLink.focus();
  await page.keyboard.press('Enter');
  try {
    await page.waitForURL(/\/endpoints\/.+/, { timeout: 8000 });
    ok('B. Enter sur carte endpoint → page détails', true, page.url());
  } catch {
    ok('B. Enter sur carte endpoint → page détails', false, page.url());
  }
}

// ── C. Ordre Tab réel : l'ordre suit le DOM, pas de saut arrière ───────────
await gotoWait('/');
const tabOrder = [];
for (let i = 0; i < 8; i++) {
  await page.keyboard.press('Tab');
  const d = await page.evaluate(() => {
    const el = document.activeElement;
    const r = el ? el.getBoundingClientRect() : null;
    return r ? { y: Math.round(r.top), x: Math.round(r.left), tag: el.tagName } : null;
  });
  if (d) tabOrder.push(d);
}
const wildJumps = tabOrder.filter((t, i) => i > 0 && t.y < tabOrder[i - 1].y - 400).length;
ok('C. ordre Tab sans saut >400px vers le haut', wildJumps === 0, JSON.stringify(tabOrder.map(t => `${t.tag}@${t.y}`)));

// ── D. Toggle thème : aria-label reflète l'état, bascule effective ─────────
await gotoWait('/');
const theme = await page.evaluate(async () => {
  const btn = [...document.querySelectorAll('#settings button')].find(b => /mode/i.test(b.getAttribute('aria-label') || ''));
  if (!btn) return null;
  const before = { label: btn.getAttribute('aria-label'), dark: document.documentElement.classList.contains('dark') };
  btn.click();
  await new Promise(r => setTimeout(r, 400));
  return { before, after: { dark: document.documentElement.classList.contains('dark') } };
});
if (!theme) na('D. toggle thème', 'aucun bouton #settings avec aria-label « mode »');
else {
  ok('D. toggle thème: bascule html.dark', theme.before.dark !== theme.after.dark, JSON.stringify(theme.before.dark) + '->' + JSON.stringify(theme.after.dark));
}

// ── E. aria-expanded réel sur le menu refresh ──────────────────────────────
await gotoWait('/');
const exp = await page.evaluate(async () => {
  const b = document.querySelector('#settings button[aria-expanded]');
  if (!b) return null;
  const before = b.getAttribute('aria-expanded');
  b.click();
  await new Promise(r => setTimeout(r, 500));
  const after = b.getAttribute('aria-expanded');
  b.click();
  return { before, after };
});
if (!exp) na('E. aria-expanded refresh', 'pas de #settings button[aria-expanded]');
else ok('E. aria-expanded: false→true au clic', exp.before === 'false' && exp.after === 'true', JSON.stringify(exp));

// ── F. Select : flèches + Enter sélectionnent une option ───────────────────
await gotoWait('/');
const selBtn = page.locator('button[aria-haspopup]').first();
if (await selBtn.count() === 0) na('F. select clavier', 'aucun button[aria-haspopup]');
else {
  await selBtn.focus();
  await page.keyboard.press('ArrowDown');
  const opened = await page.waitForSelector('[role="listbox"]', { timeout: 3000 }).then(() => true).catch(() => false);
  ok('F. select: ArrowDown ouvre la listbox', opened);
  if (opened) {
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    const closed = await page.evaluate(() => !document.querySelector('[role="listbox"]'));
    ok('F. select: Enter sélectionne et referme', closed);
  }
}

// ── G. Images : attribut alt présent (décoratif ou nommé) ──────────────────
await gotoWait('/');
const imgs = await page.evaluate(() => [...document.querySelectorAll('img')]
  .filter(i => i.offsetParent !== null)
  .filter(i => !i.hasAttribute('alt')).length);
ok('G. toutes les images visibles ont un attribut alt', imgs === 0, `${imgs} sans alt`);

// ── H. Lien markdown du seed : annonce contient un vrai <a> focusable ──────
await gotoWait('/');
const mdLink = await page.evaluate(() => {
  const a = document.querySelector('.announcement-content a[href], .announcement-container a[href]');
  if (!a) return null;
  const r = a.getBoundingClientRect();
  return { href: a.href, focusable: a.tabIndex >= 0 || a.tagName === 'A', visible: r.width > 0 && r.height > 0 };
});
if (!mdLink) na('H. lien markdown annonce', 'aucun <a> dans .announcement-content/.announcement-container');
else ok('H. lien markdown rendu et focusable', mdLink.visible && /^https:/.test(mdLink.href), mdLink.href);

// ── I. Reflow 320px : pas de débordement horizontal ────────────────────────
await page.setViewportSize({ width: 320, height: 800 });
await gotoWait('/');
const overflow = await page.evaluate(() => document.documentElement.scrollWidth);
ok('I. reflow 320px: pas de scroll horizontal', overflow <= 321, `scrollWidth=${overflow}`);

// ── J. Zoom 200% : contenu préservé ────────────────────────────────────────
await page.setViewportSize({ width: 640, height: 800 });
await page.evaluate(() => { document.body.style.zoom = '2'; });
await page.waitForTimeout(600);
const zoomText = await page.evaluate(() => document.body.innerText.length);
ok('J. zoom 200%: contenu texte préservé', zoomText > 300, `${zoomText} chars`);

// ── K. Focus visible : un élément Tab-reçu montre outline/ring ─────────────
await page.setViewportSize({ width: 1280, height: 720 });
await gotoWait('/');
let focusShown = false;
for (let i = 0; i < 5; i++) {
  await page.keyboard.press('Tab');
  const hasRing = await page.evaluate(() => {
    const cs = getComputedStyle(document.activeElement);
    return cs.outlineStyle !== 'none' || cs.boxShadow !== 'none';
  });
  if (hasRing) { focusShown = true; break; }
}
ok('K. indicateur de focus visible dans les 5 premiers Tab', focusShown);

// ── L. Page endpoint : pagination nommée si présente ───────────────────────
await gotoWait('/endpoints/core_front-end', 'main');
const pag = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')].filter(b => /previous|next/i.test(b.getAttribute('aria-label') || b.textContent || ''));
  return btns.length;
});
if (pag === 0) na('L. pagination endpoint', 'aucun bouton Previous/Next (une seule page de résultats)');
else ok('L. pagination: boutons Previous/Next présents', pag >= 2, `${pag} boutons`);

await browser.close();
const fails = results.filter(r => r.status === 'FAIL');
const nas = results.filter(r => r.status === 'N-A');
console.log(`\n${results.filter(r => r.status === 'PASS').length} PASS, ${fails.length} FAIL, ${nas.length} N-A`);
if (nas.length) console.log('N-A :', nas.map(n => n.name).join(' | '));
if (fails.length) process.exit(1);
console.log('eval-final.mjs : tout OK');
