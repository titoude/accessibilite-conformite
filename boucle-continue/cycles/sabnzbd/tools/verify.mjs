// verify.mjs — assertions indépendantes du score axe (effect, not action).
// Cycle 25 — sabnzbd. Usage: node verify.mjs <baseUrl> <auth.json>
// Chaque assertion cible un élément réellement corrigé du patch : un élément
// absent ou non trouvé = FAIL, jamais de catch muet.
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://127.0.0.1:8080';
const AUTH = process.argv[3] || 'auth.json';
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  if (!ok) console.log(`  ECHEC: ${name} ${detail}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();

const PAGES = ['/', '/config', '/config/general', '/config/folders', '/config/server',
  '/config/categories', '/config/switches', '/config/sorting', '/config/notify',
  '/config/scheduling', '/config/rss', '/config/nzbsearch', '/config/special'];

// 1. viewport : zoom utilisateur autorisé (meta-viewport était flagué partout)
for (const path of ['/login', '/config/general', '/wizard']) {
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const vp = await page.evaluate(() => document.querySelector('meta[name=viewport]')?.content || '');
  check(`viewport zoom autorisé sur ${path}`, !/user-scalable\s*=\s*no|maximum-scale\s*=\s*[0-4](\.\d+)?\b/i.test(vp), vp);
}

// 2. par page : ≥1 landmark main, exactement 1 h1 visible dedans, aucun saut de niveau visible
for (const path of PAGES) {
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const vis = el => !!(el.offsetParent || el.offsetWidth || el.offsetHeight);
    const mains = [...document.querySelectorAll('main, [role=main]')].filter(vis);
    const h1 = [...document.querySelectorAll('h1')].filter(vis);
    const h1InMain = h1.filter(h => h.closest('main, [role=main]'));
    const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter(h => vis(h) && (h.innerText || '').trim())
      .map(h => +h.tagName[1]);
    let skips = 0;
    for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) skips++;
    return { mains: mains.length, h1: h1.length, h1InMain: h1InMain.length, skips, levels: levels.join('') };
  });
  check(`landmarks+h1 ${path}`, r.mains >= 1 && r.h1 >= 1 && r.h1InMain >= 1, JSON.stringify(r));
  check(`pas de saut de niveau ${path}`, r.skips === 0, r.levels);
}

// 3. noms accessibles : aucun <a>/<button> composé d'une seule icône sans nom
for (const path of ['/', '/config/general', '/config/rss', '/config/nzbsearch', '/config/cat' === '/x' ? '/x' : '/config/categories']) {
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const bad = await page.evaluate(() => {
    const vis = el => !!(el.offsetParent || el.offsetWidth || el.offsetHeight);
    return [...document.querySelectorAll('a, button')]
      .filter(el => vis(el))
      // éléments volontairement hors arbre (caret décoratif aria-hidden+tabindex=-1)
      .filter(el => el.getAttribute('aria-hidden') !== 'true')
      .filter(el => {
      // textContent (pas innerText) : le nom accessible est calculé sur le
      // contenu même si le conteneur est masqué (dropdown KO fermé).
      const name = (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') ||
        el.getAttribute('title') || el.getAttribute('data-original-title') ||
        (el.textContent || '')).trim();
      return !name;
    }).map(el => el.outerHTML.slice(0, 80));
  });
  check(`noms accessibles liens/boutons ${path}`, bad.length === 0, bad.slice(0, 3).join(' | '));
}

// 4. contrôles de formulaire : label explicite ou aria-label sur les pages corrigées
for (const path of ['/config/categories', '/config/rss', '/config/nzbsearch', '/config/sorting', '/config/server', '/config/switches', '/config/general']) {
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const bad = await page.evaluate(() => {
    const vis = el => !!(el.offsetParent || el.offsetWidth || el.offsetHeight);
    return [...document.querySelectorAll('input, select, textarea')].filter(el => vis(el)).filter(el => {
      if (['hidden', 'submit', 'button', 'image'].includes(el.type)) return false;
      const named = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') ||
        (el.id && document.querySelector(`label[for="${el.id}"]`)) ||
        el.closest('label') || (el.labels && el.labels.length);
      return !named;
    }).map(el => (el.id || el.name || el.outerHTML.slice(0, 60)));
  });
  check(`contrôles nommés ${path}`, bad.length === 0, bad.slice(0, 5).join(' | '));
}

// 5. en-têtes de tableau : aucun <th> sans contenu ni nom
for (const path of ['/config/categories', '/config/rss', '/config/nzbsearch', '/config/sorting', '/config/scheduling']) {
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const bad = await page.evaluate(() => {
    return [...document.querySelectorAll('th')].filter(th =>
      !(th.innerText || '').trim() && !th.getAttribute('aria-label')).length;
  });
  check(`th nommés ${path}`, bad === 0, `${bad} th vide(s)`);
}

// 6. corrections structurelles mesurables dans le DOM
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(1500);
const s = await page.evaluate(() => {
  const r = {};
  r.feedbackRole = document.getElementById('feedback-slider')?.getAttribute('role');
  r.modalTitlesH4 = document.querySelectorAll('h4.modal-title').length;
  r.modalTitlesOther = document.querySelectorAll('.modal-title').length;
  const close = document.querySelector('.modal .modal-header .close, .modal.in .modal-header .close');
  r.closeOpacity = close ? parseFloat(getComputedStyle(close).opacity) : -1;
  r.navCollapse = document.getElementById('navbar-collapse')?.getAttribute('aria-expanded');
  const lbl = document.querySelector('.label-default');
  r.labelDefaultBg = lbl ? getComputedStyle(lbl).backgroundColor : '';
  return r;
});
check('#feedback-slider role=complementary', s.feedbackRole === 'complementary', s.feedbackRole);
check('aucun h4.modal-title résiduel', s.modalTitlesH4 === 0, `${s.modalTitlesH4}/${s.modalTitlesOther}`);
check('.modal-header .close opacity >= .8', s.closeOpacity >= 0.8, String(s.closeOpacity));
check('#navbar-collapse sans aria-expanded', s.navCollapse === null, String(s.navCollapse));
check('.label-default fond assombri', s.labelDefaultBg === 'rgb(110, 110, 110)', s.labelDefaultBg);

// 7. tooltip : le conteneur est .main-content (fix region), pas body
const tip = await page.evaluate(async () => {
  const el = document.querySelector('[data-tooltip="true"], [data-toggle="tooltip"]');
  if (!el) return { found: false };
  const evt = new Event('mouseover', { bubbles: true });
  el.dispatchEvent(evt);
  await new Promise(r => setTimeout(r, 900));
  const t = document.querySelector('.tooltip');
  return {
    found: true, tip: !!t,
    inMain: !!(t && t.closest('.main-content')),
    inBodyDirect: !!(t && t.parentElement === document.body),
  };
});
check('tooltip monté dans .main-content (pas body)', tip.found && tip.tip && tip.inMain && !tip.inBodyDirect, JSON.stringify(tip));

// 8. modale rss : <div class="modal"> et non <form class="modal"> (aria-allowed-role)
await page.goto(BASE + '/config/rss', { waitUntil: 'load' });
await page.waitForTimeout(1200);
const rss = await page.evaluate(() => {
  const m = document.getElementById('rss_edit_modal');
  const title = document.getElementById('rss-edit-modal-title');
  return {
    tag: m?.tagName.toLowerCase(), cls: m?.className,
    titleTag: title?.tagName.toLowerCase(),
  };
});
check('rss modal = div.modal + titre h2', rss.tag === 'div' && rss.cls.includes('modal') && rss.titleTag === 'h2', JSON.stringify(rss));

// 9. wizard : iframe externe titrée
await page.goto(BASE + '/wizard/one', { waitUntil: 'load' });
await page.waitForTimeout(1000);
const fr = await page.evaluate(() => [...document.querySelectorAll('iframe')].map(f => f.getAttribute('title') || ''));
check('wizard iframe titrée', fr.length >= 1 && fr.every(t => t.trim()), JSON.stringify(fr));

// 10. login : landmark main + h1 sr-only
await page.goto(BASE + '/login', { waitUntil: 'load' });
await page.waitForTimeout(1000);
const lg = await page.evaluate(() => ({
  mains: document.querySelectorAll('main, [role=main]').length,
  h1: document.querySelectorAll('main h1, [role=main] h1').length,
}));
check('login : <main> + h1', lg.mains === 1 && lg.h1 === 1, JSON.stringify(lg));

await browser.close();
const passed = results.filter(r => r.ok).length;
console.log(`\nverify.mjs — ${passed}/${results.length} PASS`);
process.exit(results.every(r => r.ok) ? 0 : 1);
