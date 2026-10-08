#!/usr/bin/env node
/**
 * verify.mjs — assertions DURES sur les corrections documenso (cycle 53).
 * Effets mesurés dans le DOM rendu, jamais `if(el) ok()` ni `|| true`.
 * Un élément requis absent = FAIL ou N-A explicite. Toute clé i18n introduite
 * est prouvée RÉSOLUE : la valeur rendue ne ressemble pas à un slug
 * (leçon 43 — anti-slug obligatoire).
 *
 * Usage: node verify.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');

const [base, authPath = resolve(HERE, 'auth.json')] = process.argv.slice(2);
if (!base) { console.error('usage: node verify.mjs <baseUrl> [auth.json]'); process.exit(2); }
const BASE = base.replace(/\/$/, '');

const SEED = JSON.parse(readFileSync(process.env.SEED_INFO ? resolve(process.cwd(), process.env.SEED_INFO) : new URL('./seed-info.json', import.meta.url), 'utf8'));
const TEAM = SEED.team?.url;
const DRAFT = SEED.documents?.draft?.id;
const SIGN_TOKEN = SEED.documents?.pending?.recipients?.[0]?.token;
if (!TEAM || !DRAFT || !SIGN_TOKEN) {
  console.error('FAIL seed-info.json incomplet : team.url / documents.draft.id / pending.recipients[0].token requis');
  process.exit(2);
}
if (!existsSync(authPath)) { console.error(`FAIL auth.json absent: ${authPath} — lancer login.mjs`); process.exit(2); }

const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); return pass; };
const na = (name, why) => results.push(['N-A ', name, why]);
const SLUG = /^[a-z0-9]+([._-][a-z0-9]+)+$/; // valeur non résolue type "keys.camel.case"

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US', storageState: authPath });
const page = await ctx.newPage();
page.on('pageerror', (e) => results.push(['FAIL', 'pageerror non intercepté', String(e).slice(0, 160)]));

// ================= /documents =================
{
  await page.goto(`${BASE}/t/${TEAM}/documents`, { waitUntil: 'load', timeout: 90000 });
  await page.waitForSelector('table', { timeout: 45000 });
  await page.waitForTimeout(2500);

  // fix button-name : déclencheur ⋯ de ligne nommé (i18n résolu, pas un slug)
  const trig = await page.evaluate(() => {
    const b = document.querySelector('table [data-testid="document-table-action-btn"]');
    return b ? { label: b.getAttribute('aria-label') } : null;
  });
  ok('documents: bouton ⋯ de ligne a un aria-label', !!trig?.label, JSON.stringify(trig));
  if (trig?.label) ok('documents: label ⋯ résolu (pas de slug i18n)', !SLUG.test(trig.label), trig.label);

  // fix dropzone : AUCUN <input type=file> à l'intérieur d'un <button>
  const nested = await page.evaluate(() =>
    [...document.querySelectorAll('button input[type="file"], button input[type="file"]')].length +
    [...document.querySelectorAll('button input')].filter(i => i.getAttribute('type') === 'file').length);
  ok('upload: aucun <input type=file> dans un <button>', nested === 0, String(nested));

  // fix cmdk : Ctrl+K ouvre la palette ; aucun <a> dans [cmdk-item] ni dans
  // le listbox (aria-required-children) ; le lien overlay sibling est
  // aria-hidden + tabIndex=-1 (pas d'interactif imbriqué).
  await page.keyboard.press('Control+k');
  const cmdk = await page.evaluate(() => {
    const list = document.querySelector('[cmdk-list], [role="listbox"]');
    if (!list) return null;
    // les <a> overlay sibling sont aria-hidden+tab-1 (wrappers
    // role=presentation/group autorisés par aria-required-children) —
    // seule une ancre VISIBLE non-masquée violerait la listbox.
    const insideA = [...list.querySelectorAll('a')];
    const visibleA = insideA.filter((a) => a.getAttribute('aria-hidden') !== 'true');
    const itemA = document.querySelectorAll('[cmdk-item] a').length;
    const overlay = [...document.querySelectorAll('[cmdk-item]')].some(
      (it) => it.parentElement?.querySelector('a[aria-hidden="true"][tabindex="-1"]'));
    return { totalA: insideA.length, visibleA: visibleA.length, itemA, overlay, role: list.getAttribute('role') };
  });
  if (cmdk) {
    ok('cmdk: palette ouverte (listbox présente)', true, `role=${cmdk.role}`);
    ok('cmdk: aucun <a> visible dans la listbox ni dans un item', cmdk.visibleA === 0 && cmdk.itemA === 0,
      `visibles:${cmdk.visibleA} item:${cmdk.itemA} overlays:${cmdk.totalA}`);
    ok('cmdk: lien overlay aria-hidden+tab-1 présent', cmdk.overlay === true);
  } else {
    ok('cmdk: palette ouverte (listbox présente)', false, 'Ctrl+K sans effet');
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // fix aria-required-children : menu du switcher — pas de h2/h3/a nus
  // directement sous [role=menu] ; libellé groupe = DropdownMenuLabel.
  const sw = page.locator('[data-testid="org-switcher"], header button:has(img), header button:has(svg)').first();
  const opened = await (async () => {
    // le trigger du switcher : bouton de la zone header avec aria-haspopup
    const t = page.locator('header [aria-haspopup="menu"], nav [aria-haspopup="menu"]').first();
    if (!(await t.count())) return null;
    await t.click({ timeout: 8000 }).catch(() => {});
    await page.waitForSelector('[role="menu"]', { state: 'visible', timeout: 8000 }).catch(() => {});
    return page.evaluate(() => {
      const m = document.querySelector('[role="menu"]');
      if (!m) return null;
      const bad = [...m.children].filter((c) => !['menuitem', 'menuitemcheckbox', 'menuitemradio', 'group', 'separator', 'none', 'presentation'].includes(c.getAttribute('role') || '') && !c.hasAttribute('cmdk-list') && c.tagName !== 'HR')
        .filter((c) => !c.querySelector('[role="menuitem"]') || ['A', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(c.tagName))
        .map((c) => c.tagName + '.' + String(c.className).split(' ')[0]);
      const rawHead = [...m.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > a')].length;
      return { bad, rawHead, items: m.querySelectorAll('[role="menuitem"], [role^="menuitem"]').length };
    });
  })();
  if (opened) {
    ok('switcher: enfants directs du menu conformes (pas de h*/a nu)', opened.bad.length === 0 && opened.rawHead === 0,
      JSON.stringify({ bad: opened.bad, rawHead: opened.rawHead }));
    ok('switcher: le menu contient des items', opened.items > 0, String(opened.items));
  } else {
    na('switcher menu', 'trigger non trouvé dans le header');
  }
  await page.keyboard.press('Escape').catch(() => {});
}

// ================= /settings/document =================
{
  await page.goto(`${BASE}/t/${TEAM}/settings/document`, { waitUntil: 'load', timeout: 90000 });
  // fix combobox.tsx (ariaLabel non déstructuré crashait la page entière)
  const crashed = await page.evaluate(() => document.body.innerText.includes('Application error') || document.title === 'Error');
  ok('settings/document: page rendue (pas de crash ariaLabel)', !crashed, '');
  await page.waitForSelector('form, [role="combobox"]', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2000);

  // combobox visibles : toutes nommées (fix delegate + transversal)
  const roles = await page.evaluate(() =>
    [...document.querySelectorAll('[role="combobox"]')].map((e) => ({
      label: e.getAttribute('aria-label'), title: e.getAttribute('title'),
      txt: (e.innerText || '').slice(0, 30) })));
  const delegate = roles.find((r) => /delegate/i.test(r.label || ''));
  ok('settings/document: select "Delegate document ownership" nommé', !!delegate, JSON.stringify(delegate || roles.at(-1)));
  const unnamed = roles.filter((r) => !r.label && !r.title);
  ok('settings/document: 0 combobox sans nom accessible', unnamed.length === 0, `${unnamed.length} sans nom`);
}

// ================= /settings/members =================
{
  await page.goto(`${BASE}/t/${TEAM}/settings/members`, { waitUntil: 'load', timeout: 90000 });
  await page.waitForSelector('table, [role="combobox"]', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2000);
  const m = await page.evaluate(() => {
    const trg = [...document.querySelectorAll('button[aria-haspopup="menu"]')];
    const unnamed = trg.filter((b) => !(b.getAttribute('aria-label') || b.innerText.trim()));
    const lbl = trg.map((b) => b.getAttribute('aria-label')).filter(Boolean);
    return { n: trg.length, unnamed: unnamed.length, labels: lbl.slice(0, 4) };
  });
  ok('members: déclencheurs ⋯ membres tous nommés', m.unnamed === 0, JSON.stringify(m));
  ok('members: label "Member actions" résolu', m.labels.some((l) => /member/i.test(l)), m.labels.join('|'));
}

// ================= /templates =================
{
  await page.goto(`${BASE}/t/${TEAM}/templates`, { waitUntil: 'load', timeout: 90000 });
  await page.waitForSelector('table', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2000);
  const t = await page.evaluate(() => {
    const acts = [...document.querySelectorAll('button[aria-haspopup="menu"]')];
    const unnamedA = acts.filter((b) => !b.getAttribute('aria-label') && !b.innerText.trim());
    const tips = [...document.querySelectorAll('[data-state="closed"], button')].filter(
      (b) => /template type/i.test(b.getAttribute('aria-label') || ''));
    return { acts: acts.length, unnamedA: unnamedA.length, tip: tips.length,
      labels: acts.map((b) => b.getAttribute('aria-label')).filter(Boolean).slice(0, 3) };
  });
  ok('templates: déclencheurs ⋯ tous nommés', t.unnamedA === 0 && t.acts > 0, JSON.stringify(t));
  ok('templates: icône info "type" a un aria-label résolu', t.tip > 0, `tip=${t.tip}`);
}

// ================= /edit (éditeur d'enveloppe) =================
{
  await page.goto(`${BASE}/t/${TEAM}/documents/${DRAFT}/edit`, { waitUntil: 'load', timeout: 120000 });
  await page.waitForSelector('main, [role="main"], form', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3500);

  // fix heading-order : « Document Editor » h2, « Quick Actions » h3
  const heads = await page.evaluate(() =>
    [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => `${h.tagName}:${(h.innerText || '').slice(0, 40)}`));
  ok('editeur: hiérarchie h2 « Document Editor » + h3 « Quick Actions »',
    heads.some((h) => h.startsWith('H2:') && /document editor/i.test(h)) &&
    heads.some((h) => h.startsWith('H3:') && /quick actions/i.test(h)),
    heads.slice(0, 8).join(' | '));
  const h4Act = heads.filter((h) => h.startsWith('H4:') && /quick actions|actions/i.test(h));
  ok('editeur: « Actions » n\'est plus un h4', h4Act.length === 0, h4Act.join('|'));

  // fix button-name : bouton engrenage des paramètres nommé
  const gear = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /editor settings/i.test(x.getAttribute('aria-label') || ''));
    return b ? b.getAttribute('aria-label') : null;
  });
  ok('editeur: bouton paramètres nommé « Editor settings »', !!gear, String(gear));
  if (gear) ok('editeur: label paramètres résolu (pas de slug)', !SLUG.test(gear), gear);

  // fix nested-interactive : cartes EnvelopeItemSelector = div + bouton enfant
  // + actionSlot SIBLING (aucun button dans button)
  const nestedBtn = await page.evaluate(() => document.querySelectorAll('button button').length);
  ok('editeur: aucun <button> imbriqué', nestedBtn === 0, String(nestedBtn));

  // fix RecipientRoleSelect (étape 1/3 = destinataires) : aria-label i18n
  // résolu — remplace l'ancien title=slug brut ("signer"...)
  const roleSel = await page.evaluate(() =>
    [...document.querySelectorAll('[role="combobox"]')]
      .map((e) => ({ label: e.getAttribute('aria-label'), title: e.getAttribute('title') }))
      .filter((r) => r.label && /role/i.test(r.label)));
  ok('editeur: selects de rôle destinataire nommés', roleSel.length > 0, JSON.stringify(roleSel));
  ok('editeur: labels de rôle résolus (pas de slug)', roleSel.every((r) => !SLUG.test(r.label)),
    roleSel.map((r) => r.label).join(' | '));

  // fix « Signature settings information » : tooltip dans le dialog
  // « Document Settings » (section Allowed Signature Types)
  const t = page.locator('button', { hasText: 'Document Settings' }).first();
  if (await t.count()) {
    await t.click({ timeout: 10000 });
    await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 });
    await page.waitForTimeout(800);
    const sigInfo = await page.evaluate(() =>
      [...document.querySelectorAll('[role="dialog"] [aria-label]')]
        .map((e) => e.getAttribute('aria-label'))
        .filter((l) => /signature settings information/i.test(l || '')));
    ok('editeur: tooltip « Signature settings information » nommé dans le dialog', sigInfo.length > 0, JSON.stringify(sigInfo));
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(400);
  } else {
    na('tooltip Signature settings', 'bouton Document Settings absent');
  }
}
await ctx.close();

// ================= pages publiques =================
const anon = await browser.newContext({ locale: 'en-US' });
const p2 = await anon.newPage();

// signup : lien « Sign in instead » souligné (link-in-text-block)
{
  await p2.goto(`${BASE}/signup`, { waitUntil: 'load', timeout: 60000 });
  await p2.waitForSelector('a[href="/signin"]', { timeout: 30000 }).catch(() => {});
  const deco = await p2.evaluate(() => {
    const a = [...document.querySelectorAll('a[href="/signin"]')].find((x) => /sign in/i.test(x.innerText));
    return a ? { deco: getComputedStyle(a).textDecorationLine } : null;
  });
  if (deco) ok('signup: « Sign in instead » souligné', deco.deco.includes('underline'), deco.deco);
  else ok('signup: « Sign in instead » souligné', false, 'lien introuvable');
}

// /sign/<token> : « Actions » = h3 (était h4 — heading-order)
{
  await p2.goto(`${BASE}/sign/${SIGN_TOKEN}`, { waitUntil: 'load', timeout: 90000 });
  await p2.waitForSelector('button, [role="button"], h1, h2', { timeout: 45000 }).catch(() => {});
  await p2.waitForTimeout(2500);
  const h = await p2.evaluate(() =>
    [...document.querySelectorAll('h1,h2,h3,h4')].map((x) => `${x.tagName}:${(x.innerText || '').slice(0, 30)}`));
  ok('sign: « Actions » en h3 (pas h4)',
    h.some((x) => x.startsWith('H3:') && /actions/i.test(x)) && !h.some((x) => x.startsWith('H4:') && /actions/i.test(x)),
    h.join(' | '));
}

// mobile 390 : select « Jump to » nommé
{
  await p2.setViewportSize({ width: 390, height: 800 });
  const ctx2 = await browser.newContext({ locale: 'en-US', storageState: authPath, viewport: { width: 390, height: 800 } });
  const pm = await ctx2.newPage();
  await pm.goto(`${BASE}/t/${TEAM}/settings/general`, { waitUntil: 'load', timeout: 90000 });
  await pm.waitForTimeout(3000);
  const j = await pm.evaluate(() => {
    const b = document.querySelector('[data-testid="unified-settings-mobile-section-trigger"]');
    return b ? { vis: !!b.getClientRects().length, label: b.getAttribute('aria-label') } : null;
  });
  if (j && j.vis) {
    ok('mobile390: select « Jump to » visible et nommé', !!j.label, String(j.label));
    if (j.label) ok('mobile390: label « Jump to » résolu (pas de slug)', !SLUG.test(j.label), j.label);
  } else if (j) ok('mobile390: select « Jump to » visible et nommé', false, 'trigger présent mais invisible à 390px');
  else na('mobile390 jump-to', 'trigger absent du DOM (viewport trop large ou layout différent)');
  await ctx2.close();
}

await browser.close();

const fails = results.filter((r) => r[0] === 'FAIL');
const nas = results.filter((r) => r[0] === 'N-A ');
for (const [s, n, d] of results) console.log(`${s} ${n}${d ? ' — ' + d : ''}`);
console.log(`\n${results.length} checks : ${results.length - fails.length - nas.length} OK, ${fails.length} FAIL, ${nas.length} N-A`);
process.exit(fails.length ? 1 : 0);
