/**
 * verify.mjs — assertions DURES sur les corrections PrivateBin (cycle 22).
 * Chaque assertion échoue → process.exit(1). Aucun self-verdict axe :
 * le score axe est produit par audit.mjs, pas ici.
 *
 * Usage: node verify.mjs <baseUrl>
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

// ── 1. Home : h1, tablist, tabindex, modal names ───────────────────────────
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#sendbutton:not(.hidden)', { timeout: 15000 });
await page.waitForTimeout(1500);
const home = await page.evaluate(() => {
  const accName = el => {
    const al = el.getAttribute('aria-labelledby');
    if (al) return al.split(/\s+/).map(id => (document.getElementById(id)?.textContent || '')).join(' ').trim();
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
    return el.textContent.trim() || (el.querySelector('img[alt]')?.getAttribute('alt') || '').trim();
  };
  const h1s = [...document.querySelectorAll('h1')].map(h => ({ text: accName(h), visible: !!h.offsetParent }));
  const tl = document.querySelector('#editorTabs');
  const tabs = tl ? [...tl.querySelectorAll('[role="tab"]')] : [];
  const me = document.getElementById('messageedit'), mp = document.getElementById('messagepreview');
  const ctrl = id => id && document.getElementById(id);
  const modalNames = ['passwordmodal', 'loadconfirmmodal', 'qrcodemodal', 'emailconfirmmodal'].map(id => {
    const m = document.getElementById(id);
    return { id, name: m ? accName(m) : null };
  });
  const badTab = ['message', 'sendbutton', 'messagetab'].filter(id => {
    const el = document.getElementById(id);
    return el && parseInt(el.getAttribute('tabindex') || '0', 10) > 0;
  });
  // ordre des titres visibles : aucun saut (ex. h1 -> h3+)
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.offsetParent !== null);
  let skip = null, prev = 0;
  for (const h of heads) {
    const lvl = parseInt(h.tagName.slice(1), 10);
    if (prev && lvl > prev + 1) { skip = `${h.tagName}:${h.textContent.trim().slice(0, 30)}`; break; }
    prev = lvl;
  }
  return {
    h1s,
    tablistRole: tl ? tl.getAttribute('role') : null,
    tabsCount: tabs.length,
    meSel: me && me.getAttribute('aria-selected'), mpSel: mp && mp.getAttribute('aria-selected'),
    meTab: me && me.getAttribute('tabindex'), mpTab: mp && mp.getAttribute('tabindex'),
    meCtrl: me ? !!ctrl(me.getAttribute('aria-controls')) : false,
    mpCtrl: mp ? !!ctrl(mp.getAttribute('aria-controls')) : false,
    panels: { editorpanel: document.getElementById('editorpanel')?.getAttribute('role'), prettymessage: document.getElementById('prettymessage')?.getAttribute('role') },
    modalNames, badTab, headSkip: skip, headsSeen: heads.length,
  };
});
ok('home: exactement 1 h1 visible', home.h1s.filter(h => h.visible).length === 1, JSON.stringify(home.h1s));
ok('home: h1 nommé avec le nom du site', home.h1s.some(h => /privatebin/i.test(h.text)), JSON.stringify(home.h1s));
ok('home: #editorTabs a role=tablist', home.tablistRole === 'tablist', String(home.tablistRole));
ok('home: tablist contient exactement 2 tabs (sendbutton exclu)', home.tabsCount === 2, String(home.tabsCount));
ok('home: aria-selected éditeur/preview = true/false', home.meSel === 'true' && home.mpSel === 'false', `${home.meSel}/${home.mpSel}`);
ok('home: roving tabindex éditeur/preview = 0/-1', home.meTab === '0' && home.mpTab === '-1', `${home.meTab}/${home.mpTab}`);
ok('home: aria-controls pointe vers des id existants', home.meCtrl && home.mpCtrl);
ok('home: panels marqués tabpanel', home.panels.editorpanel === 'tabpanel' && home.panels.prettymessage === 'tabpanel', JSON.stringify(home.panels));
for (const m of home.modalNames) ok(`modal ${m.id}: nom accessible via aria-labelledby`, !!m.name, String(m.name).slice(0, 60));
ok('home: aucun tabindex > 0 sur message/sendbutton/messagetab', home.badTab.length === 0, home.badTab.join(','));
ok('home: pas de saut de niveau de titre (hN visible)', home.headSkip === null && home.headsSeen > 0, `${home.headsSeen} titres, skip=${home.headSkip}`);

// ── 2. Tab clavier : ArrowRight active Preview ────────────────────────────
await page.locator('#message').fill('test **gras**');
await page.locator('#messageedit').focus();
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(600);
const afterArrow = await page.evaluate(() => ({
  active: document.activeElement && document.activeElement.id,
  mpSel: document.getElementById('messagepreview').getAttribute('aria-selected'),
  meSel: document.getElementById('messageedit').getAttribute('aria-selected'),
  mpTab: document.getElementById('messagepreview').getAttribute('tabindex'),
  pretty: !document.getElementById('prettymessage').classList.contains('hidden'),
}));
ok('tablist: ArrowRight déplace le focus vers Preview', afterArrow.active === 'messagepreview', afterArrow.active);
ok('tablist: aria-selected bascule après ArrowRight', afterArrow.mpSel === 'true' && afterArrow.meSel === 'false');
ok('tablist: roving tabindex bascule après ArrowRight', afterArrow.mpTab === '0', afterArrow.mpTab);
ok('tablist: panel preview visible après ArrowRight', afterArrow.pretty);

// ── 3. Paste discussion : contraste des liens générés ──────────────────────
await page.goto(`${base}/?34f395b60e6f7082#7YQ46ok4m43aCrE7PWMWZYGWUqewWyV3mgMJ6HiWFU2C`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#prettymessage:not(.hidden), #plaintext:not(.hidden)', { timeout: 15000 });
await page.waitForTimeout(1500);
const links = await page.evaluate(() => {
  const a = document.querySelector('#prettyprint a, #plaintext a');
  if (!a) return { found: false };
  const cs = getComputedStyle(a);
  return { found: true, color: cs.color, varRgb: cs.getPropertyValue('--bs-link-color-rgb').trim() };
});
ok('paste: lien généré trouvé dans le contenu', links.found);
ok('paste: couleur de lien durcie (rgb(10,88,202))', links.color === 'rgb(10, 88, 202)', `${links.color} var=${links.varRgb}`);

// ── 4. Reply : labels visibles nickname + commentaire ──────────────────────
await page.waitForSelector('#commentcontainer .comment', { timeout: 15000 });
await page.locator('#commentcontainer .comment button', { hasText: /reply|répondre/i }).first().click();
await page.waitForSelector('.reply:not(.hidden)', { timeout: 10000 });
const reply = await page.evaluate(() => {
  const nick = document.querySelector('.reply:not(.hidden) #nickname');
  const msg = document.querySelector('.reply:not(.hidden) #replymessage');
  const labText = el => [...(el.labels || [])].map(l => l.textContent.trim()).join('|');
  return {
    nickLabels: nick ? nick.labels.length : -1, nickLab: nick ? labText(nick) : null,
    msgLabels: msg ? msg.labels.length : -1, msgLab: msg ? labText(msg) : null,
  };
});
ok('reply: #nickname a un label programme', reply.nickLabels === 1, `${reply.nickLabels} '${reply.nickLab}'`);
ok('reply: label nickname non vide', !!reply.nickLab, String(reply.nickLab));
ok('reply: #replymessage a un label programme', reply.msgLabels === 1, `${reply.msgLabels} '${reply.msgLab}'`);
ok('reply: label commentaire non vide', !!reply.msgLab, String(reply.msgLab));

await browser.close();
const fails = results.filter(r => !r.pass).length;
console.log(`verify: ${results.length - fails}/${results.length} assertions OK`);
process.exit(fails ? 1 : 0);
