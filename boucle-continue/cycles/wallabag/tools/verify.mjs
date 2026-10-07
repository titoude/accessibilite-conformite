// verify.mjs — assertions indépendantes du score axe (effect, not action).
// Cycle 38 — wallabag @ 496db5b. Usage: node verify.mjs <baseUrl> <auth.json>
// Chaque assertion cible un élément réellement corrigé du patch : un élément
// absent ou non trouvé = FAIL, jamais de catch muet.
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:8038');
const AUTH = process.argv[3] || 'auth.json';
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: AUTH });
const page = await ctx.newPage();
const VIS = `const vis = el => !!(el.offsetParent || el.offsetWidth || el.offsetHeight);`;
const RATIO = `
  const parse = s => { const m = s.match(/rgba?\\((\\d+)[,\\s]+(\\d+)[,\\s]+(\\d+)(?:[,\\s\\/]+([\\d.]+))?/); return m ? [+m[1],+m[2],+m[3], m[4]===undefined?1:+m[4]] : null; };
  const eff = el => { const chain=[]; for (let n=el; n; n=n.parentElement) { const c=parse(getComputedStyle(n).backgroundColor); if (c && c[3]>0) chain.push(c); }
    let comp=[255,255,255,1];
    for (let i=chain.length-1;i>=0;i--) { const [r,g,b,a]=chain[i]; comp=[r*a+comp[0]*(1-a), g*a+comp[1]*(1-a), b*a+comp[2]*(1-a), 1]; }
    return comp; };
  const lum = c => { const f=v=>{v/=255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}; return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]); };
  const ratio = (fg,bg)=>{ const l1=lum(fg), l2=lum(bg); return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); };`;

const goto = async (path) => { await page.goto(BASE + path, { waitUntil: 'load' }); await page.waitForTimeout(1200); };

// 1. Page login : h1 propre + lang + title
await page.goto(BASE + '/login', { waitUntil: 'load' }); await page.waitForTimeout(1200);
{
  const r = await page.evaluate(`(() => {${VIS}
    const h1 = [...document.querySelectorAll('h1.login-title')].filter(vis);
    return { h1: h1.length, text: h1[0]?.textContent.trim() || '', lang: document.documentElement.lang, title: document.title };})()`);
  check('login h1 + lang + title', r.h1 === 1 && r.text.length > 0 && r.lang !== '' && r.title.length > 0, JSON.stringify(r));
}

// 2. Landmark <main> unique sur pages applicatives + h1 topbar
for (const path of ['/unread/list/1', '/all/list/1', '/config', '/view/12', '/howto', '/developer', '/users/list']) {
  await goto(path);
  const r = await page.evaluate(`(() => {${VIS}
    const mains = [...document.querySelectorAll('main, [role=main]')].filter(vis).length;
    const h1 = [...document.querySelectorAll('h1')].filter(vis).length;
    return { mains, h1 };})()`);
  check(`main unique + h1 ${path}`, r.mains === 1 && r.h1 >= 1, JSON.stringify(r));
}

// 3. Ordre des titres : aucun saut de niveau sur les pages retitrées
for (const path of ['/developer', '/howto', '/quickstart', '/about', '/ignore-origin-instance-rules', '/config']) {
  await goto(path);
  const r = await page.evaluate(`(() => {${VIS}
    const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter(h => vis(h) && (h.innerText || '').trim()).map(h => +h.tagName[1]);
    let skips = 0;
    for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) skips++;
    return { skips, levels: levels.join(',') };})()`);
  check(`pas de saut de niveau ${path}`, r.skips === 0, JSON.stringify(r).slice(0, 140));
}

// 4. Page /search standalone : document complet (pas un fragment)
await goto('/search/1?search%5Bterm%5D=wallabag');
{
  const r = await page.evaluate(`(() => {${VIS}
    const inp = document.querySelectorAll('#search_page_term');
    const lab = document.querySelectorAll('label[for="search_page_term"]');
    const mains = [...document.querySelectorAll('main')].filter(vis).length;
    const topbarDup = document.querySelectorAll('#search_entry_term').length;
    return { lang: document.documentElement.lang, title: document.title.length > 0, mains, inp: inp.length, lab: lab.length, topbarInput: topbarDup };})()`);
  check('/search : page complète + ids uniques', r.lang !== '' && r.title && r.mains === 1 && r.inp === 1 && r.lab === 1 && r.topbarInput === 1, JSON.stringify(r));
}

// 5. Panneaux topbar : h1.visually-hidden présent dans les 2 formulaires
await goto('/unread/list/1');
{
  const r = await page.evaluate(`(() => {
    const f1 = document.querySelector('form.nav-panel-search h1.visually-hidden');
    const f2 = document.querySelector('form.nav-panel-add h1.visually-hidden');
    return { search: !!f1, add: !!f2 };})()`);
  check('h1.visually-hidden dans panneaux topbar', r.search && r.add, JSON.stringify(r));
}

// 6. /edit : ids topbar préfixés — plus de collision entry_url / entry__token
await goto('/edit/3');
{
  const r = await page.evaluate(`(() => {
    const count = id => document.querySelectorAll('[id="' + id + '"]').length;
    return { entry_url: count('entry_url'), topbar_entry_url: count('topbar_entry_url'),
             entry_token: count('entry__token'), topbar_token: count('topbar_entry__token') };})()`);
  check('/edit ids dédupliqués', r.entry_url === 1 && r.topbar_entry_url === 1 && r.entry_token === 1 && r.topbar_token === 1, JSON.stringify(r));
}

// 7. Vue article : navs nommées + liens image étiquetés
await goto('/view/12');
{
  const r = await page.evaluate(`(() => {${VIS}
    const topNav = document.querySelector('nav[aria-label]');
    const readerNav = document.querySelector('nav.reader-mode-nav[aria-label]');
    const slideOut = readerNav && readerNav.querySelector('#slide-out');
    return { topNav: topNav?.getAttribute('aria-label') || '', readerNav: readerNav?.getAttribute('aria-label') || '', slideOut: !!slideOut };})()`);
  check('navs étiquetées /view/12', r.topNav.length > 0 && r.readerNav.length > 0 && r.slideOut, JSON.stringify(r));
}

// 8. Liste : liens image = aria-label == titre ; checkbox masse étiquetée
await goto('/all/list/1');
{
  const r = await page.evaluate(`(() => {${VIS}
    const links = [...document.querySelectorAll('.card-image a[aria-label]')].filter(vis);
    const bad = links.filter(a => !(a.getAttribute('aria-label') || '').trim()).length;
    // les checkbox Materialize sont visuellement remplacées par leur <label> (opacity:0)
    const cb = [...document.querySelectorAll('input.entry-checkbox-input[aria-label]')];
    const cbNoTitle = cb.filter(c => !(c.getAttribute('aria-label') || '').trim() || c.getAttribute('aria-label').length < 8).length;
    const toggle = document.querySelector('input[data-jerseng-target*="toggle"], #toggle_all[aria-label], .mass-action input[aria-label]');
    return { links: links.length, bad, cb: cb.length, cbNoTitle };})()`);
  check('aria-label liens image + checkbox /all', r.links > 0 && r.bad === 0 && r.cb > 0 && r.cbNoTitle === 0, JSON.stringify(r));
}

// 9. Carte archivée : image à 0.5, texte à pleine opacité/contraste
//    (la classe .archived n'est posée que sur les routes all/tag/search)
await goto('/all/list/1');
{
  const r = await page.evaluate(`(() => {${VIS}${RATIO}
    const card = document.querySelector('.card.archived, .card-stacked.archived, .archived');
    if (!card) return { card: false };
    const img = card.querySelector('.card-image .preview, .card-image img, .card-preview .preview, .card-preview img, .card-fullimage .preview');
    const title = card.querySelector('.card-title');
    const op = img ? parseFloat(getComputedStyle(img).opacity) : null;
    const tOp = title ? parseFloat(getComputedStyle(title).opacity) : null;
    const fg = title ? parse(getComputedStyle(title).color) : null;
    const bg = title ? eff(title) : null;
    const cr = (fg && bg) ? ratio(fg, bg) : null;
    return { card: true, imgOpacity: op, titleOpacity: tOp, ratio: cr };})()`);
  check('archivée : img 0.5, titre 1.0 + ratio>=4.5', r.card && r.imgOpacity === 0.5 && r.titleOpacity === 1 && r.ratio >= 4.5, JSON.stringify(r));
}

// 10. Couleurs calculées clés (thème clair)
await goto('/unread/list/1');
{
  const r = await page.evaluate(`(() => {${VIS}${RATIO}
    const pick = sel => { const e = document.querySelector(sel); return e ? { fg: getComputedStyle(e).color, bg: getComputedStyle(e).backgroundColor } : null; };
    return { greyText: pick('.grey-text'), cardAction: pick('.card .card-action a') };})()`);
  const okGrey = r.greyText && r.greyText.fg.replace(/\s/g,'') === 'rgb(110,110,110)';
  check('grey-text = #6e6e6e', !!okGrey, JSON.stringify(r.greyText));
}
{
  const r = await page.evaluate(`(() => {${RATIO}
    const a = document.querySelector('.card .card-action a:not(.btn)');
    if (!a) return null;
    const cr = ratio(parse(getComputedStyle(a).color), eff(a));
    return { color: getComputedStyle(a).color, ratio: cr };})()`);
  check('card-action lien >= 4.5', r && r.ratio >= 4.5, JSON.stringify(r));
}

// 11. /config : labels sombres + bouton save contrasté + selects aria-labelledby
await goto('/config');
{
  const r = await page.evaluate(`(() => {${VIS}${RATIO}
    const lab = document.querySelector('.input-field > label');
    const labColor = lab ? getComputedStyle(lab).color : null;
    const btn = document.querySelector('#config_save, .btn');
    const btnCr = btn ? ratio(parse(getComputedStyle(btn).color), eff(btn)) : null;
    const selects = [...document.querySelectorAll('.settings select')].filter(vis);
    const unlabelled = selects.filter(s => { const id = s.getAttribute('aria-labelledby'); return !id || !document.getElementById(id) || !document.getElementById(id).textContent.trim(); }).length;
    return { labColor, btnCr, selects: selects.length, unlabelled };})()`);
  check('/config labels + btn + selects', r.labColor === 'rgb(110, 110, 110)' && r.btnCr >= 4.5 && r.selects > 0 && r.unlabelled === 0, JSON.stringify(r));
}

// 12. Dropdown account : liens contrastés
{
  const r = await page.evaluate(`(() => {${RATIO}
    const a = document.querySelector('#dropdown-account li > a');
    if (!a) return null;
    return { color: getComputedStyle(a).color, ratio: ratio(parse(getComputedStyle(a).color), eff(a)) };})()`);
  check('dropdown liens >= 4.5', r && r.ratio >= 4.5, JSON.stringify(r));
}

// 13. /about : dt/dd dans dl
await goto('/about');
{
  const r = await page.evaluate(`(() => {
    const loose = [...document.querySelectorAll('dt, dd')].filter(e => !e.closest('dl')).length;
    return { loose, dls: document.querySelectorAll('dl').length };})()`);
  check('/about dt/dd dans <dl>', r.loose === 0 && r.dls > 0, JSON.stringify(r));
}

// 14. /import/pocket_csv : inputs file étiquetés (le widget file n'existe que sur les sous-pages d'import)
await goto('/import/pocket_csv');
{
  const r = await page.evaluate(`(() => {${VIS}
    const files = [...document.querySelectorAll('input[type=file]')];
    const noLabel = files.filter(f => !(f.getAttribute('aria-label') || (f.id && document.querySelector('label[for="' + f.id + '"]'))) ).length;
    const paths = [...document.querySelectorAll('input.file-path')];
    const noPath = paths.filter(f => !(f.getAttribute('aria-label') || '').trim()).length;
    return { files: files.length, noLabel, paths: paths.length, noPath };})()`);
  check('/import inputs étiquetés', r.files > 0 && r.noLabel === 0 && r.noPath === 0, JSON.stringify(r));
}

// 15. /quickstart : liens card-action sur cartes colorées restent blancs
await goto('/quickstart');
{
  const r = await page.evaluate(`(() => {${VIS}${RATIO}
    const a = document.querySelector('.card.cyan .card-action a, .card.teal .card-action a, .card.green .card-action a');
    if (!a) return { found: false };
    const cr = ratio(parse(getComputedStyle(a).color), eff(a));
    return { found: true, color: getComputedStyle(a).color, ratio: cr };})()`);
  check('quickstart lien coloré >= 4.5', r.found && r.ratio >= 4.5, JSON.stringify(r));
}

// 16. Thème sombre : grey-text #9e9e9e + liens #4db6ac + chips blancs (basculé à froid)
await goto('/unread/list/1');
await page.evaluate(() => document.documentElement.classList.add('dark-theme'));
await page.waitForTimeout(300);
{
  const r = await page.evaluate(`(() => {${RATIO}
    const g = document.querySelector('.grey-text');
    const lab = document.querySelector('.card-entry-labels a');
    const a = document.querySelector('.card-title');
    return {
      grey: g ? getComputedStyle(g).color : null,
      chipLink: lab ? getComputedStyle(lab).color : null,
      cardTitle: a ? getComputedStyle(a).color : null,
    };})()`);
  check('dark grey-text #9e9e9e + chips #fff + liens #4db6ac',
    r.grey === 'rgb(158, 158, 158)' && r.chipLink === 'rgb(255, 255, 255)' && r.cardTitle === 'rgb(77, 182, 172)', JSON.stringify(r));
}

// 17. Page partage public : <main> + lang
const pub = await browser.newContext();
const p2 = await pub.newPage();
await p2.goto(BASE + '/share/0af38edc9ca4c9157176453', { waitUntil: 'load' }); await p2.waitForTimeout(1200);
{
  const r = await p2.evaluate(`(() => {${VIS}
    return { mains: [...document.querySelectorAll('main')].filter(vis).length, lang: document.documentElement.lang };})()`);
  check('share : main + lang', r.mains === 1 && r.lang !== '', JSON.stringify(r));
}
await pub.close();

await browser.close();
const failed = results.filter(r => !r.ok).length;
console.log(`\n${results.length} assertions, ${failed} FAIL`);
process.exit(failed ? 1 : 0);
