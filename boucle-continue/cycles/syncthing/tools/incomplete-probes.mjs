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
    const url = pageUrl.replace(/\s*\[state:.*$/, '');
    const state = (pageUrl.match(/state:([a-z0-9-]+)/) || [])[1];
    await page.goto(url, { waitUntil: 'load' }).catch(() => {});
    await page.waitForTimeout(2500);
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
        } else {
          probe.detail = `règle ${it.rule} : pas de sonde implémentée — revue manuelle requise`;
        }
      } catch (e) { probe.detail = `sonde en échec : ${String(e).slice(0, 120)}`; }
      results.push(probe);
      console.log(`  [${state || 'page'}] ${it.rule} ${it.target.slice(0, 60)} → ${probe.verdict} ${probe.detail}`);
    }
  }
  await browser.close();
}
const out = { report: REPORT, count: results.length, results };
writeFileSync(join(CYCLE, 'reports/incomplete-probes.json'), JSON.stringify(out, null, 1));
const confirmed = results.filter(r => r.verdict === 'CONFIRMED_VIOLATION').length;
console.log(`\nsondes: ${results.length} items, ${confirmed} CONFIRMED_VIOLATION`);
process.exit(confirmed ? 1 : 0);
