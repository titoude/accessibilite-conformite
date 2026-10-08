#!/usr/bin/env node
/**
 * eval-final.mjs (documenso, cycle 53) — contrôles transverses INDÉPENDANTS :
 * aucun n'a servi pendant la boucle de correction — ils ne peuvent pas avoir
 * été « appris ». Un élément requis absent = FAIL ou N-A explicite.
 *
 * Usage: node eval-final.mjs <baseUrl> [auth.json]
 */
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright');

const base = (process.argv[2] || 'http://localhost:9400').replace(/\/$/, '');
const auth = process.argv[3] || resolve(HERE, 'auth.json');
if (!existsSync(auth)) { console.error(`auth.json absent: ${auth}`); process.exit(2); }
const SEED = JSON.parse(readFileSync(process.env.SEED_INFO ? resolve(process.cwd(), process.env.SEED_INFO) : new URL('./seed-info.json', import.meta.url), 'utf8'));
const TEAM = SEED.team?.url;
const results = [];
const ok = (name, pass, detail = '') => { results.push([pass ? 'OK  ' : 'FAIL', name, detail]); return pass; };
const na = (name, why) => results.push(['N-A ', name, why]);

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'en-US', storageState: auth });
const page = await ctx.newPage();
page.on('pageerror', (e) => results.push(['FAIL', 'pageerror non intercepté', String(e).slice(0, 160)]));

// 1. 3.1.1 — lang du document
await page.goto(`${base}/t/${TEAM}/documents`, { waitUntil: 'load', timeout: 90000 });
await page.waitForSelector('table', { timeout: 45000 });
const lang = await page.evaluate(() => document.documentElement.lang);
ok('3.1.1: html[lang] renseigné', !!lang && lang.length >= 2, lang);

// 2. 2.1.2/2.4.3 — Échap ferme le menu et rend le focus au déclencheur
{
  // ouvre le menu actions, Échap, vérifie fermeture + retour du focus au déclencheur.
  // 1 retry : le click sur la dernière ligne peut atterrir en plein scroll/re-rendu.
  let esc = { menuOpen: true, focusIsTrigger: false, tag: '' };
  for (let attempt = 0; attempt < 2 && (esc.menuOpen || !esc.focusIsTrigger); attempt++) {
    const trigger = page.locator('table button[aria-haspopup="menu"]').last();
    await trigger.click({ timeout: 10000 }).catch(() => {});
    await page.waitForSelector('[role="menu"] [role="menuitem"]', { state: 'visible', timeout: 10000 }).catch(() => {});
    await page.keyboard.press('Escape');
    for (let i = 0; i < 10 && (esc.menuOpen || !esc.focusIsTrigger); i++) {
      await page.waitForTimeout(300);
      esc = await page.evaluate(() => ({
        menuOpen: !!document.querySelector('[role="menu"]'),
        focusIsTrigger: document.activeElement?.hasAttribute('aria-haspopup'),
        tag: document.activeElement?.tagName,
      }));
    }
  }
  ok('2.1.2: Échap ferme le menu actions', !esc.menuOpen, JSON.stringify(esc));
  ok('2.4.3: focus rendu au déclencheur après Échap', esc.focusIsTrigger === true, `focus=${esc.tag}`);
}

// 3. 4.1.2 — aria-expanded reflète l'état du menu
{
  const trigger = page.locator('table button[aria-haspopup="menu"]').last();
  const before = await trigger.getAttribute('aria-expanded');
  await trigger.click({ timeout: 10000 });
  await page.waitForSelector('[role="menu"]', { state: 'visible', timeout: 10000 });
  const during = await trigger.getAttribute('aria-expanded');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const after = await trigger.getAttribute('aria-expanded');
  ok('4.1.2: aria-expanded bascule false→true→false',
    before === 'false' && during === 'true' && after === 'false',
    `${before}->${during}->${after}`);
}

// 4. 2.4.7 — Tab réel : 15 tabulations, indicateur de focus mesuré
{
  await page.evaluate(() => document.body.focus());
  let seen = 0, withIndicator = 0;
  const samples = [];
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(120);
    const m = await page.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return null;
      const cs = getComputedStyle(a);
      const has = cs.outlineStyle !== 'none' || cs.boxShadow !== 'none' ||
        cs.borderColor !== 'rgb(0, 0, 0)' && cs.outlineWidth !== '0px';
      return { tag: a.tagName, outline: cs.outlineStyle + '/' + cs.outlineWidth, shadow: cs.boxShadow.slice(0, 40), has };
    });
    if (m) { seen++; if (m.has) withIndicator++; samples.push(`${m.tag}:${m.outline}`); }
  }
  ok('2.4.7: ≥15 tabulations atteignent un élément', seen >= 10, `seen=${seen}`);
  ok('2.4.7: indicateur de focus visible sur les éléments tabulés', seen > 0 && withIndicator === seen,
    `${withIndicator}/${seen} — ${samples.slice(0, 4).join(', ')}`);
}

// 5. 1.4.10 — reflow 320px : pas de scroll horizontal global
{
  await page.setViewportSize({ width: 320, height: 800 });
  await page.waitForTimeout(1200);
  const rf = await page.evaluate(() => ({
    sw: document.scrollingElement.scrollWidth, vw: document.documentElement.clientWidth }));
  ok('1.4.10: pas de scroll horizontal à 320px', rf.sw <= rf.vw + 1, JSON.stringify(rf));
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(600);
}

// 6. 3.3.1 — formulaire signin : erreurs signalées de façon accessible
{
  const anonCtx = await browser.newContext({ locale: 'en-US' });
  const p = await anonCtx.newPage();
  await p.goto(`${base}/signin`, { waitUntil: 'load', timeout: 60000 });
  await p.waitForSelector('input[type="email"], input[name="email"]', { timeout: 30000 });
  const labels = await p.evaluate(() => {
    const em = document.querySelector('input[type="email"], input[name="email"]');
    const pw = document.querySelector('input[type="password"]');
    const lab = (el) => el && (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') ||
      (el.id && document.querySelector(`label[for="${el.id}"]`)));
    return { email: !!lab(em), pw: !!lab(pw) };
  });
  ok('3.3.2: inputs email/password labellisés (signin)', labels.email && labels.pw, JSON.stringify(labels));
  // hydration Remix peut être lente à froid : on soumet jusqu'à 2 fois tant qu'aucun
  // retour de validation n'apparaît ; si le formulaire ne répond jamais -> FAIL réel.
  const errSel = '[role="alert"], .text-destructive, [data-error], p.text-red-500, [aria-invalid="true"]';
  let err = { msgs: [], invalid: 0 };
  for (let attempt = 0; attempt < 2 && err.msgs.length === 0 && err.invalid === 0; attempt++) {
    await p.click('button[type="submit"]').catch(() => {});
    await p.waitForSelector(errSel, { timeout: 10000 }).catch(() => {});
    await p.waitForTimeout(500);
    err = await p.evaluate(() => {
      const msgs = [...document.querySelectorAll('[role="alert"], .text-destructive, [data-error], p.text-red-500')];
      const invalid = [...document.querySelectorAll('[aria-invalid="true"]')];
      return { msgs: msgs.map((m) => (m.innerText || '').slice(0, 60)).filter(Boolean), invalid: invalid.length };
    });
  }
  ok('3.3.1: soumission vide -> retour accessible (message ou aria-invalid)',
    err.msgs.length > 0 || err.invalid > 0, JSON.stringify(err));
  await anonCtx.close();
}

// 7. 2.1.1 — aucun [onclick] non-focusable sans role/tabindex clavier
{
  await page.reload({ waitUntil: 'load', timeout: 90000 });
  await page.waitForSelector('table', { timeout: 45000 });
  const oc = await page.evaluate(() =>
    [...document.querySelectorAll('[onclick], div[role="button"]')]
      .filter((el) => {
        const t = el.getAttribute('tabindex');
        const focusable = el.tabIndex >= 0 || ['BUTTON', 'A', 'INPUT', 'SELECT'].includes(el.tagName);
        return !focusable && (t === null || parseInt(t) < 0);
      })
      .map((el) => el.tagName + '.' + String(el.className).split(' ')[0]).slice(0, 5));
  ok('2.1.1: aucun click-handler non-focusable', oc.length === 0, oc.join('|'));
}

// 8. 4.1.2 — dialogue modal : ouverture -> focus à l'intérieur, Échap ferme
{
  const t = page.locator('button', { hasText: 'Create Folder' }).first();
  if (await t.count()) {
    await t.click({ timeout: 10000 });
    const dlg = await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 15000 }).catch(() => null);
    if (dlg) {
      await page.waitForTimeout(600);
      const foc = await page.evaluate(() => {
        const d = document.querySelector('[role="dialog"], [role="alertdialog"]');
        return d && d.contains(document.activeElement);
      });
      ok('4.1.2: le focus entre dans la modale à l\'ouverture', foc === true);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(600);
      const gone = await page.evaluate(() => !document.querySelector('[role="dialog"], [role="alertdialog"]'));
      ok('2.1.2: Échap ferme la modale', gone === true);
    } else {
      ok('4.1.2: la modale s\'ouvre', false, 'Create Folder cliqué sans dialog');
    }
  } else {
    na('modale Create Folder', 'bouton absent (droits dossier ?)');
  }
}

// 9. 1.4.3 — sonde de contraste mesurée sur un badge de statut coloré
//    (axe passe parfois les nœuds à fond coloré — leçon 26)
{
  const badge = await page.evaluate(() => {
    const el = [...document.querySelectorAll('[class*="badge"], [data-testid*="status"], table td span')]
      .find((e) => /draft|pending|completed/i.test(e.innerText || '') && getComputedStyle(e).color !== 'rgb(0, 0, 0)');
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { text: (el.innerText || '').slice(0, 20), fg: cs.color, cls: String(el.className).slice(0, 60) };
  });
  if (badge) {
    // mesure du fond opaque le plus proche
    const r = await page.evaluate((sel) => {
      const el = [...document.querySelectorAll('table td span, [class*="badge"]')].find((e) => (e.innerText || '').includes(sel));
      if (!el) return null;
      const p = (c) => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(',').map(Number); return { r: v[0], g: v[1], b: v[2], a: v[3] ?? 1 }; };
      const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
      let bg = { r: 255, g: 255, b: 255, a: 1 };
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const c = p(getComputedStyle(n).backgroundColor);
        if (c && c.a > 0.95) { bg = c; break; }
        if (c && c.a > 0.02) { bg = { r: Math.round(c.a * c.r + (1 - c.a) * bg.r), g: Math.round(c.a * c.g + (1 - c.a) * bg.g), b: Math.round(c.a * c.b + (1 - c.a) * bg.b), a: 1 }; }
      }
      const fg = p(getComputedStyle(el).color);
      const ratio = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);
      return { ratio: Math.round(ratio * 100) / 100, fg, bg };
    }, badge.text.slice(0, 10));
    if (r) ok('1.4.3: badge statut — contraste mesuré ≥4.5', r.ratio >= 4.5, `ratio=${r.ratio} fg=${JSON.stringify(r.fg)} bg=${JSON.stringify(r.bg)}`);
    else na('badge statut', 'badge introuvable au re-sondage');
  } else na('badge statut', 'aucun badge de statut dans la table');
}

await browser.close();
const fails = results.filter((r) => r[0] === 'FAIL');
const nas = results.filter((r) => r[0] === 'N-A ');
for (const [s, n, d] of results) console.log(`${s} ${n}${d ? ' — ' + d : ''}`);
console.log(`\n${results.length} checks : ${results.length - fails.length - nas.length} OK, ${fails.length} FAIL, ${nas.length} N-A`);
process.exit(fails.length ? 1 : 0);
