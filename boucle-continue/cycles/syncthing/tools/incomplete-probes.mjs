#!/usr/bin/env node
// incomplete-probes.mjs — re-examine les éléments qu'axe n'a pas pu trancher
// ("incomplete" / Needs Review) dans les rapports finaux. Pour chacun :
//   - si déterminable par calcul (couleurs sRGB résolues, taille/espacement) →
//     verdict RESOLVED ou CONFIRMED_VIOLATION avec la valeur mesurée ;
//   - sinon N-A avec raison explicite (image de fond, contenu dynamique, ...).
// Jamais de PASS à vide. Écrit reports/incomplete-probes.json.
// Usage : node incomplete-probes.mjs <baseUrl> --auth-file tools/auth.json --report reports/final-auth/report.json

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const BASE = (args[0] || 'http://127.0.0.1:8384').replace(/\/+$/, '');
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const DIR = dirname(fileURLToPath(import.meta.url));
const CYCLE = opt('--cycle-dir', join(DIR, '..'));
const AUTH = opt('--auth-file', join(DIR, 'auth.json'));
const REPORT = opt('--report', join(CYCLE, 'reports/final-auth/report.json'));

const luminance = ([r, g, b]) => {
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (c1, c2) => {
  const l1 = luminance(c1), l2 = luminance(c2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const parseRGB = s => {
  const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
  return m ? [+m[1], +m[2], +m[3]] : null;
};

const report = JSON.parse(readFileSync(REPORT, 'utf8'));
const incompletes = [];
for (const p of report.pages || [])
  for (const inc of p.incomplete || [])
    for (const n of inc.nodes || [])
      incompletes.push({ page: p.url, rule: inc.id, target: Array.isArray(n.target) ? n.target.join(',') : n.target, reason: n.failureSummary || '' });

// STATES est importé d'audit.mjs (export dédié + guard CLI — les setups ont
// accès aux helpers du module) : le setup de chaque état est REJOUÉ avant la
// mesure — sans cela les items des états dynamiques étaient classés « élément
// absent » sans jamais avoir été re-mesurés dans leur état.
const { STATES } = await import('./audit.mjs');

console.log(`${incompletes.length} item(s) incomplete dans ${REPORT}`);
const results = [];
if (incompletes.length) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ storageState: existsSync(AUTH) ? AUTH : undefined });
  const page = await ctx.newPage();
  const stateGroups = new Map();
  for (const it of incompletes) {
    const key = it.page;
    if (!stateGroups.has(key)) stateGroups.set(key, []);
    stateGroups.get(key).push(it);
  }
  for (const [pageUrl, items] of stateGroups) {
    // Les rapports enregistrent l'URL complète du produit audité — la réécrire
    // sur le BASE fourni, sinon goto() cible une instance qui n'existe pas.
    const url = pageUrl.replace(/\s*\[state:.*$/, '').replace(/^https?:\/\/[^/]+/, BASE);
    const state = (pageUrl.match(/state:([a-z0-9-]+)/) || [])[1];
    const nav = await page.goto(url, { waitUntil: 'load' }).catch(e => e);
    if (!nav || nav instanceof Error || !nav.ok()) {
      for (const it of items) {
        const detail = nav instanceof Error ? String(nav).slice(0, 120) : `HTTP ${nav && nav.status()}`;
        const probe = { ...it, verdict: 'N-A', detail: `navigation vers ${url} en échec au rejeu : ${detail}` };
        results.push(probe);
        console.log(`  [${state || 'page'}] ${it.rule} ${it.target.slice(0, 60)} → N-A ${probe.detail}`);
      }
      continue;
    }
    await page.waitForTimeout(2500);
    let stateOk = true;
    if (state && STATES[state]) {
      try { await STATES[state].setup(page); await page.waitForTimeout(800); }
      catch (e) {
        stateOk = false;
        for (const it of items) {
          const probe = { ...it, verdict: 'N-A', detail: `setup de l état ${state} en échec au rejeu : ${String(e).slice(0, 120)}` };
          results.push(probe);
          console.log(`  [${state}] ${it.rule} ${it.target.slice(0, 60)} → N-A ${probe.detail}`);
        }
      }
    } else if (state) {
      stateOk = false;
      for (const it of items) {
        const probe = { ...it, verdict: 'N-A', detail: `état ${state} introuvable dans STATES — setup non rejoué` };
        results.push(probe);
        console.log(`  [${state}] ${it.rule} ${it.target.slice(0, 60)} → N-A ${probe.detail}`);
      }
    }
    if (!stateOk) continue;
    for (const it of items) {
      const probe = { ...it, verdict: 'N-A', detail: '' };
      try {
        const el = page.locator(it.target).first();
        if (!(await el.count())) {
          probe.detail = 'élément absent au rejeu (contenu dynamique) — axe ne pouvait conclure ; non mesurable';
        } else if (it.rule === 'color-contrast') {
          const [fg, bg] = await el.evaluate(node => {
            const cs = getComputedStyle(node);
            let bg = cs.backgroundColor, n = node.parentElement;
            while (n && (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent')) { bg = getComputedStyle(n).backgroundColor; n = n.parentElement; }
            return [cs.color, bg];
          });
          const f = parseRGB(fg), b = parseRGB(bg);
          if (f && b) {
            const ratio = contrast(f, b);
            probe.detail = `fg=${fg} bg=${bg} ratio=${ratio.toFixed(2)}:1`;
            probe.verdict = ratio >= 4.5 ? 'RESOLVED' : 'CONFIRMED_VIOLATION';
          } else probe.detail = `couleurs non résolubles (fg=${fg} bg=${bg})`;
        } else if (it.rule === 'target-size') {
          const rect = await el.boundingBox();
          if (rect) {
            probe.detail = `taille ${Math.round(rect.width)}x${Math.round(rect.height)}px`;
            probe.verdict = (rect.width >= 24 && rect.height >= 24) ? 'RESOLVED' : 'N-A';
            if (probe.verdict === 'N-A') probe.detail += ' — <24px, exige un gap ≥24px non superposé non mesurable sans voisinage';
          } else probe.detail = 'pas de bounding box (invisible)';
        } else if (it.rule === 'link-in-text-block') {
          const deco = await el.evaluate(node => {
            const cs = getComputedStyle(node);
            return { deco: cs.textDecorationLine || cs.textDecoration, border: cs.borderBottomStyle, outline: cs.outlineStyle };
          });
          const distinguished = /underline|overline|line-through/.test(deco.deco) || (deco.border && deco.border !== 'none') || (deco.outline && deco.outline !== 'none');
          probe.detail = `decoration=${deco.deco} borderBottom=${deco.border} outline=${deco.outline}`;
          probe.verdict = distinguished ? 'RESOLVED' : 'CONFIRMED_VIOLATION';
        } else if (it.rule === 'th-has-data-cells') {
          const cells = await el.evaluate(node => {
            const table = node.closest('table');
            return table ? table.querySelectorAll('td').length : -1;
          });
          probe.detail = cells < 0 ? 'hors <table>' : `${cells} <td> dans la table`;
          probe.verdict = cells > 0 ? 'RESOLVED' : 'N-A';
          if (cells === 0) probe.detail += ' — aucune cellule de données, structure à revoir manuellement';
        } else {
          probe.detail = `règle ${it.rule} : pas de sonde implémentée — revue manuelle requise`;
        }
      } catch (e) { probe.detail = `sonde en échec : ${String(e).slice(0, 120)}`; }
      results.push(probe);
      console.log(`  [${state || 'page'}] ${it.rule} ${it.target.slice(0, 60)} → ${probe.verdict} ${probe.detail}`);
    }
  }

  // Les états *-dark laissent theme=dark dans la config serveur : restaurer
  // explicitement le clair — sinon le prochain run part d'une instance mutée.
  try {
    const restored = await page.evaluate(async () => {
      const m = document.cookie.match(/CSRF-Token-([A-Z0-9]+)=([^;]+)/);
      const h = { 'Content-Type': 'application/json' };
      if (m) h[`X-CSRF-Token-${m[1]}`] = m[2];
      const r = await fetch('/rest/config/gui', { headers: h });
      const gui = await r.json();
      if (gui.theme !== 'dark') return 'pas-en-sombre';
      gui.theme = 'light';
      const w = await fetch('/rest/config/gui', { method: 'PUT', headers: h, body: JSON.stringify(gui) });
      // Restart explicite : sans lui, setTheme applique le thème MAIS laisse
      // « Restart Needed » en file — la bannière pollue les scans suivants.
      if (w.ok) await fetch('/rest/system/restart', { method: 'POST', headers: h }).catch(() => {});
      return w.ok ? 'clair-restauré' : `HTTP ${w.status}`;
    });
    console.log(`thème après run : ${restored}`);
  } catch (e) { console.log(`restauration thème échouée : ${String(e).slice(0, 100)}`); }
  await browser.close();
}
const out = { report: REPORT, count: results.length, results };
writeFileSync(join(CYCLE, 'reports/incomplete-probes.json'), JSON.stringify(out, null, 1));
const confirmed = results.filter(r => r.verdict === 'CONFIRMED_VIOLATION').length;
console.log(`\nsondes: ${results.length} items, ${confirmed} CONFIRMED_VIOLATION`);
process.exit(confirmed ? 1 : 0);
