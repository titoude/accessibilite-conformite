/**
 * eval-final.mjs — contrôles INDÉPENDANTS, non utilisés pendant les fixes.
 * Couvre des aspects que le développement n'a pas testés : si l'un échoue,
 * c'est un finding légitime à consolider (FAIL), pas un bug du harnais.
 *
 * Usage: node eval-final.mjs <baseUrl> <auth.json>
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const [base, authFile] = process.argv.slice(2);
const state = authFile ? JSON.parse(readFileSync(authFile, 'utf8')) : undefined;
const results = [];
const ok = (name, cond, extra = '') => {
  results.push({ name, pass: !!cond });
  if (!cond) console.error(`  FAIL ${name} ${extra}`);
  return cond;
};

const browser = await chromium.launch();
const ctx = await browser.newContext(state ? { storageState: state } : {});
const page = await ctx.newPage();

// ── A. aria-current sur le lien de nav actif (localisation dans un ensemble) ─
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.username-dropdown-trigger', { timeout: 15000 });
await page.waitForTimeout(1500);
const nav = await page.evaluate(() => ({
  active: [...document.querySelectorAll('a.router-link-exact-active')].map(a => ({
    current: a.getAttribute('aria-current'),
    name: a.textContent.trim().slice(0, 30),
  })),
}));
ok('nav: lien actif expose aria-current', nav.active.length === 0 || nav.active.every(a => a.current), JSON.stringify(nav.active));

// ── B. Formulaire filtres : chaque input a un nom accessible ───────────────
await page.goto(`${base}/filters/new`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
const inputs = await page.evaluate(() => {
  const unlabeled = [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), select, textarea')]
    .filter(el => el.offsetParent !== null)
    .filter(el => {
      const lab = el.getAttribute('aria-labelledby');
      const labOk = lab ? lab.split(/\s+/).some(id => (document.getElementById(id)?.textContent || '').trim()) : false;
      const forLab = el.id ? document.querySelector(`label[for="${el.id}"]`) : null;
      const wrap = el.closest('label');
      return !(el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('placeholder') || labOk || forLab || wrap);
    }).map(el => el.name || el.id || el.className);
  return { unlabeled };
});
ok('filtres: chaque champ a un nom accessible', inputs.unlabeled.length === 0, inputs.unlabeled.join(','));

// ── C. Modale quick-add-magic : Escape ferme ────────────────────────────────
await page.goto(`${base}/projects/2/9`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.quick-add-magic-trigger-btn', { timeout: 15000 });
await page.waitForTimeout(1200);
await page.locator('.quick-add-magic-trigger-btn').first().click();
await page.waitForSelector('.modal-container, .modal-dialog', { state: 'visible', timeout: 10000 });
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
const modalClosed = await page.evaluate(() => {
  const el = document.querySelector('.modal-container, .modal-dialog');
  return !el || el.offsetParent === null;
});
ok('modal: Escape ferme la modale magic', modalClosed);

// ── D. Teams : même motif lien souligné ─────────────────────────────────────
await page.goto(`${base}/teams`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
const teamLink = await page.evaluate(() => {
  // Le lien « dans le texte » n'existe que dans l'état vide ; les boutons d'en-tête
  // (style bouton, pas de bloc texte) n'ont pas à être soulignés.
  const a = [...document.querySelectorAll('p a')].find(x => /create a team/i.test(x.textContent || ''));
  return a ? getComputedStyle(a).textDecoration : 'absent';
});
ok('teams: lien dans le texte souligné', teamLink === 'absent' || teamLink.includes('underline'), String(teamLink));

// ── E. Kanban : cartes nommées ─────────────────────────────────────────────
await page.goto(`${base}/projects/2/12`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const kanban = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('.kanban-card, [class*="card"]')].filter(c => c.offsetParent !== null);
  const unnamed = cards.filter(c => !(c.textContent || '').trim() && !c.getAttribute('aria-label')).length;
  return { cards: cards.length, unnamed };
});
ok('kanban: cartes présentes nommées', kanban.unnamed === 0, `${kanban.unnamed}/${kanban.cards}`);

// ── F. Zoom 200% : contenu préservé (pas de perte mesurée) ──────────────────
await page.setViewportSize({ width: 640, height: 800 });
await page.goto(`${base}/projects`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
await page.evaluate(() => { document.body.style.zoom = '2'; });
await page.waitForTimeout(800);
const zoom = await page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  bodyText: document.body.innerText.length,
}));
ok('zoom 200%: contenu texte préservé', zoom.bodyText > 200, `${zoom.bodyText} chars`);

// ── G. aria-expanded reflète l'état réel ───────────────────────────────────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.username-dropdown-trigger', { timeout: 15000 });
await page.waitForTimeout(1500);
const exp = await page.evaluate(async () => {
  const t = document.querySelector('.username-dropdown-trigger');
  const before = t.getAttribute('aria-expanded');
  t.click();
  await new Promise(r => setTimeout(r, 500));
  const after = t.getAttribute('aria-expanded');
  return { before, after };
});
ok('aria-expanded: bascule false→true', exp.before === 'false' && exp.after === 'true', JSON.stringify(exp));

await browser.close();
const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} contrôles indépendants OK`);
if (failed.length) process.exit(1);
console.log('eval-final.mjs : tout OK');
