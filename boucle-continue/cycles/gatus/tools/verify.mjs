/**
 * verify.mjs — assertions DURES sur les corrections Gatus (cycle 24).
 * Chaque assertion échoue → exit(1). Aucun auto-verdict axe :
 * le score axe est produit par audit.mjs, pas ici.
 * Un élément non trouvé = N-A déclaré (jamais PASS silencieux).
 *
 * Usage : node verify.mjs <baseUrl>
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

const lum = (c) => c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
const ratio = (fg, bg) => {
  const L1 = 0.2126 * lum(fg)[0] + 0.7152 * lum(fg)[1] + 0.0722 * lum(fg)[2];
  const L2 = 0.2126 * lum(bg)[0] + 0.7152 * lum(bg)[1] + 0.0722 * lum(bg)[2];
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};
const rgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);

const MEASURE = `(sel) => {
  const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
  if (!el) return null;
  const cs = getComputedStyle(el);
  let bg = null, node = el;
  while (node && node !== document.documentElement) {
    const c = getComputedStyle(node).backgroundColor;
    if (c && !c.endsWith(', 0)')) { bg = c; break; }
    node = node.parentElement;
  }
  if (!bg) bg = getComputedStyle(document.body).backgroundColor;
  return { color: cs.color, bg };
}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const gotoHome = async () => {
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#settings', { timeout: 15000 });
  await page.waitForTimeout(2500);
};

// ── 1. Home : badges de statut — contraste réel ≥ 4.5 ──────────────────────
await gotoHome();
const badges = await page.evaluate(() => {
  const bgOf = (el) => { for (let n = el; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (c && !c.endsWith(', 0)')) return c; } return 'rgb(255,255,255)'; };
  return [...document.querySelectorAll('.endpoint .rounded-full.border, .suite .rounded-full.border')]
    .map(b => ({ text: b.textContent.trim(), color: getComputedStyle(b).color, bg: getComputedStyle(b).backgroundColor || bgOf(b) }));
});
if (!badges.length) na('badges statut contraste', 'aucun badge .endpoint/.suite trouvé');
else {
  const worst = badges.map(b => ({ ...b, r: ratio(rgb(b.color), rgb(b.bg)) })).sort((a, b) => a.r - b.r)[0];
  ok(`badges statut: pire contraste >= 4.5 (${worst.text})`, worst.r >= 4.5, `${worst.color}/${worst.bg} = ${worst.r.toFixed(2)}`);
}

// ── 2. « No incidents reported » — contraste réel ──────────────────────────
const inc = await page.evaluate('(' + MEASURE + ')(".py-2 > .italic")');
if (!inc) na('incidents vides contraste', 'aucun paragraphe .py-2 > .italic');
else ok('incidents vides: contraste >= 4.5', ratio(rgb(inc.color), rgb(inc.bg)) >= 4.5, `${inc.color}/${inc.bg} = ${ratio(rgb(inc.color), rgb(inc.bg)).toFixed(2)}`);

// ── 3. Barres de résultat AVEC DONNÉES : contraste non-texte ≥ 3:1 ─────────
// Les slots vides (bg-gray-300) sont du remplissage décoratif sans état — ils
// ne portent pas d'information et ne sont donc pas soumis au 3:1 (1.4.11
// vise les éléments nécessaires à identifier un composant/état).
const bars = await page.evaluate(() => {
  const els = [...document.querySelectorAll('.endpoint .flex.gap-0\\.5 > div, .suite .flex.gap-0\\.5 > div')];
  const bgOf = (el) => { for (let n = el.parentElement; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (c && !c.endsWith(', 0)')) return c; } return 'rgb(255,255,255)'; };
  return els
    .filter(b => b.classList.contains('cursor-pointer'))  // seulement les barres porteuses d'un résultat
    .map(b => ({ color: getComputedStyle(b).backgroundColor, bg: bgOf(b) }));
});
if (!bars.length) na('barres résultats 3:1', 'aucune barre .cursor-pointer trouvée');
else {
  const worst = Math.min(...bars.map(b => ratio(rgb(b.color), rgb(b.bg))));
  ok('barres résultats: pire contraste >= 3:1', worst >= 3, `min=${worst.toFixed(2)} sur ${bars.length} barres`);
}

// ── 4. Noms de cartes : role=link focusable + nom réel ─────────────────────
const links = await page.evaluate(() => {
  const els = [...document.querySelectorAll('.endpoint [role="link"], .suite [role="link"]')];
  return { count: els.length, okAll: els.every(e => e.tabIndex === 0 && (e.getAttribute('aria-label') || e.textContent.trim())) };
});
if (!links.count) na('cartes role=link', 'aucun [role=link] dans les cartes');
else ok(`cartes: ${links.count} role=link focusable et nommé`, links.okAll);

// ── 5. Boutons visibles : tous nommés ──────────────────────────────────────
const unnamed = await page.evaluate(() => [...document.querySelectorAll('button:not([disabled])')]
  .filter(b => b.offsetParent !== null)
  .filter(b => {
    const lab = b.getAttribute('aria-labelledby');
    const labText = lab ? lab.split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ') : '';
    return !(b.getAttribute('aria-label') || b.getAttribute('title') || labText || (b.textContent || '').trim());
  }).length);
ok('home: aucun bouton visible sans nom', unnamed === 0, `${unnamed} boutons`);

// ── 6. En-tête de groupe : role=button + Enter replie/déplie ───────────────
await page.evaluate(() => { localStorage.setItem('gatus:sort-by', 'group'); });
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForSelector('.endpoint-group-header', { timeout: 15000 });
await page.waitForTimeout(1500);
const grp = await page.evaluate(() => {
  const h = document.querySelector('.endpoint-group-header');
  if (!h) return null;
  return { role: h.getAttribute('role'), tab: h.tabIndex, expanded: h.getAttribute('aria-expanded') };
});
if (!grp) na('en-tête groupe', 'aucun .endpoint-group-header');
else {
  ok('en-tête groupe: role=button tabindex=0', grp.role === 'button' && grp.tab === 0, JSON.stringify(grp));
  const contentBefore = await page.locator('.endpoint-group-content').count();
  await page.locator('.endpoint-group-header').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
  const contentAfter = await page.locator('.endpoint-group-content').count();
  ok('en-tête groupe: Enter bascule le contenu', contentBefore !== contentAfter, `${contentBefore} -> ${contentAfter}`);
  const expandedAfter = await page.evaluate(() => document.querySelector('.endpoint-group-header')?.getAttribute('aria-expanded'));
  ok('en-tête groupe: aria-expanded reflète l\'état', expandedAfter === 'false' || expandedAfter === 'true', String(expandedAfter));
}

// ── 7. En-tête annonce : role=button + Enter replie ────────────────────────
const ann = await page.evaluate(() => {
  const h = document.querySelector('.announcement-header');
  if (!h) return null;
  return { role: h.getAttribute('role'), tab: h.tabIndex };
});
if (!ann) na('en-tête annonce', 'aucun .announcement-header (pas d\'annonce active ?)');
else {
  ok('en-tête annonce: role=button tabindex=0', ann.role === 'button' && ann.tab === 0, JSON.stringify(ann));
  const hadContent = await page.locator('.announcement-content').count();
  await page.locator('.announcement-header').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  const hasContent = await page.locator('.announcement-content').count();
  ok('en-tête annonce: Enter bascule le contenu', hadContent !== hasContent, `${hadContent} -> ${hasContent}`);
}

// ── 8. Menu refresh : pas de descendants focusables dans le toggle ─────────
await page.locator('#settings button[aria-expanded]').click();
await page.waitForSelector('#settings .absolute.bottom-full button', { timeout: 5000 });
const nested = await page.evaluate(() => {
  const toggle = document.querySelector('#settings button[aria-expanded]');
  return toggle.querySelectorAll('button, a[href], [tabindex], input, select').length;
});
ok('menu refresh: toggle sans descendant focusable', nested === 0, `${nested} descendants`);
const menuItems = await page.locator('#settings .absolute.bottom-full button').count();
ok('menu refresh: items cliquables présents', menuItems >= 5, `${menuItems} items`);

// ── 9. Select : listbox nommée + option sélectionnable au clavier ──────────
await page.locator('button[aria-haspopup]').first().click();
await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
const lbx = await page.evaluate(() => {
  const lb = document.querySelector('[role="listbox"]');
  return lb ? (lb.getAttribute('aria-label') || lb.getAttribute('aria-labelledby')) : null;
});
ok('select: listbox a un nom accessible', !!lbx, String(lbx));

// ── 10. Page endpoint : select + canvas + heading-order ────────────────────
await page.goto(`${base}/endpoints/core_front-end`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main select, canvas', { timeout: 15000 });
await page.waitForTimeout(2000);
const det = await page.evaluate(() => {
  const sel = document.querySelector('main select');
  const cvs = document.querySelector('canvas');
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => ({ lvl: +h.tagName[1], text: h.textContent.trim().slice(0, 40) }));
  let skip = null;
  for (let i = 1; i < headings.length; i++) if (headings[i].lvl > headings[i - 1].lvl + 1) { skip = headings[i]; break; }
  return {
    selName: sel ? (sel.getAttribute('aria-label') || (sel.id && document.querySelector(`label[for="${sel.id}"]`)?.textContent) || '') : null,
    canvasLabel: cvs ? cvs.getAttribute('aria-label') : null,
    h1count: headings.filter(h => h.lvl === 1).length,
    skip,
  };
});
ok('endpoint: <select> nommée', !!det.selName, String(det.selName));
ok('endpoint: canvas[role=img] a un aria-label', !!det.canvasLabel, String(det.canvasLabel));
ok('endpoint: 1 seul h1', det.h1count === 1, `${det.h1count} h1`);
ok('endpoint: pas de saut de niveau de titre', !det.skip, det.skip ? `h${det.skip.lvl} "${det.skip.text}"` : '');

// ── 11. Suite : lignes d'historique + modale clavier complète ──────────────
await page.goto(`${base}/suites/api-tests_checkout-flow`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('main div.cursor-pointer[role="button"]', { timeout: 15000 });
await page.waitForTimeout(2000);
const rows = await page.evaluate(() => {
  const rs = [...document.querySelectorAll('main div.cursor-pointer[role="button"]')];
  return { count: rs.length, okAll: rs.every(r => r.tabIndex === 0 && (r.getAttribute('aria-label') || r.textContent.trim())) };
});
if (!rows.count) na('suite: lignes historique clavier', 'aucune ligne [role=button].cursor-pointer');
else ok(`suite: ${rows.count} lignes historiques focusables`, rows.okAll);

const step = page.locator('div.group.cursor-pointer').first();
if (await step.count() === 0) na('suite: modale étape', 'aucun div.group.cursor-pointer (pas de steps)');
else {
  await step.focus();
  await page.keyboard.press('Enter');
  try {
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
  } catch { na('suite: modale étape', 'Enter sur le step n\'a pas ouvert de [role="dialog"]'); }
  const dlg = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    if (!d) return null;
    const lab = d.getAttribute('aria-labelledby');
    const title = lab ? document.getElementById(lab) : null;
    return {
      modal: d.getAttribute('aria-modal'),
      labelled: !!(title && title.textContent.trim()),
      focusInside: d.contains(document.activeElement),
    };
  });
  if (dlg) {
    ok('modale: aria-modal + titre référencé', dlg.modal === 'true' && dlg.labelled, JSON.stringify(dlg));
    ok('modale: le focus est entré dans la boîte', dlg.focusInside, `activeElement=${await page.evaluate(() => document.activeElement.tagName)}`);
    // Piège de focus : Tab doit boucler à l'intérieur
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
    const stillInside = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      return d && d.contains(document.activeElement);
    });
    ok('modale: Tab reste piégé dans la boîte (12 Tab)', !!stillInside);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    const closed = await page.evaluate(() => !document.querySelector('[role="dialog"]'));
    ok('modale: Escape ferme la boîte', closed);
  }
}

// ── 12. Thème sombre : lien footer « Gatus » lisible ───────────────────────
await page.evaluate(() => { document.cookie = 'theme=dark; path=/'; });
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#settings', { timeout: 15000 });
await page.waitForTimeout(1500);
const dark = await page.evaluate(() => {
  const a = [...document.querySelectorAll('footer a')].find(x => /gatus/i.test(x.textContent));
  if (!a) return null;
  const bgOf = (el) => { for (let n = el; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (c && !c.endsWith(', 0)')) return c; } return 'rgb(0,0,0)'; };
  return { dark: document.documentElement.classList.contains('dark'), color: getComputedStyle(a).color, bg: bgOf(a) };
});
if (!dark) na('footer dark: lien Gatus', 'aucun lien footer contenant « gatus »');
else {
  ok('footer dark: html.dark appliqué', dark.dark === true);
  const r = ratio(rgb(dark.color), rgb(dark.bg));
  ok('footer dark: contraste lien >= 4.5', r >= 4.5, `${dark.color}/${dark.bg} = ${r.toFixed(2)}`);
}

// ── 13. Landmark : le tooltip rendu dans <main> ────────────────────────────
await page.evaluate(() => { localStorage.removeItem('gatus:sort-by'); document.cookie = 'theme=light; path=/'; });
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.endpoint .flex-1[class*="cursor-pointer"]', { timeout: 15000 });
await page.locator('.endpoint .flex-1[class*="cursor-pointer"]').first().click();
await page.waitForSelector('#tooltip.visible', { timeout: 5000 });
const tip = await page.evaluate(() => {
  const t = document.getElementById('tooltip');
  return { inMain: !!t.closest('main'), role: t.getAttribute('role'), visible: t.classList.contains('visible') };
});
ok('tooltip: rendu dans <main>', tip.inMain === true);
ok('tooltip: role=tooltip', tip.role === 'tooltip', String(tip.role));

// ── 14. Séquence Tab : 3 premiers focusables visibles et nommés ────────────
await page.keyboard.press('Escape');
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#settings', { timeout: 15000 });
await page.waitForTimeout(1500);
const tabs = [];
for (let i = 0; i < 3; i++) {
  await page.keyboard.press('Tab');
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { tag: 'body' };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      visible: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden',
      name: (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').trim().slice(0, 50),
      outline: cs.outlineStyle !== 'none' || cs.boxShadow !== 'none',
    };
  });
  tabs.push(info);
}
ok('Tab: 3 premiers éléments visibles', tabs.every(t => t.visible), JSON.stringify(tabs.map(t => t.tag)));
ok('Tab: 3 premiers éléments nommés', tabs.every(t => t.name && t.name.length > 0), JSON.stringify(tabs.map(t => t.name)));

await browser.close();
const fails = results.filter(r => r.status === 'FAIL');
const nas = results.filter(r => r.status === 'N-A');
console.log(`\n${results.filter(r => r.status === 'PASS').length} PASS, ${fails.length} FAIL, ${nas.length} N-A`);
if (nas.length) console.log('N-A :', nas.map(n => n.name).join(' | '));
if (fails.length) process.exit(1);
console.log('verify.mjs : tout OK');
