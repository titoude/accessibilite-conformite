#!/usr/bin/env node
/**
 * probe-incomplete.mjs — sonde manuelle rejouable pour les résultats axe "incomplete".
 *
 * axe ne peut trancher certains nœuds (messageKey pseudoContent : fond via
 * ::before/::marker ; skip-link caché hors focus ; iframe TinyMCE). Cette
 * sonde mesure à la main, en rejouant les mêmes pages/états que l'audit :
 *   - color-contrast : couleur calculée vs premier fond ancêtre non
 *     transparent → ratio WCAG → PASS si >= seuil (4.5 ou 3.0 gros texte).
 *   - skip-link      : activation clavier (Tab) → visible + cible valide.
 *   - link-in-text-block : vérifie la présence d'un underline calculé.
 *   - frame-tested   : N-A documenté (iframe TinyMCE, styles injectés via
 *     content_css — testés indirectement par le scan de la page mère).
 *
 * Usage : node probe-incomplete.mjs <baseUrl> --report <report.json>
 *         [--storage-state auth.json] [--out probes.json]
 *
 * Sortie : JSON { probes: [{url, state, rule, target, verdict, details}] }
 * verdict ∈ PASS | FAIL | N-A — N-A est TOUJOURS explicité, jamais un PASS muet.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const req = createRequire(import.meta.url);
const axePath = req.resolve('axe-core/axe.min.js');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null; };
const baseUrl = args[0];
const reportPath = opt('report');
const storageState = opt('storage-state');
const outPath = opt('out') || 'probes.json';
if (!baseUrl || !reportPath) {
  console.error('usage: node probe-incomplete.mjs <baseUrl> --report <report.json> [--storage-state auth.json] [--out probes.json]');
  process.exit(2);
}

const report = JSON.parse(readFileSync(reportPath, 'utf8'));

// Ratio de contraste WCAG relatif (mesure, pas de verdict axe).
const inPageRatio = `(()=>{function lum(c){const v=c.map(x=>{x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)});return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2]}
function parse(c){const m=c.match(/[\\d.]+/g).map(Number);return [m[0],m[1],m[2],m.length>3?m[3]:1]}
function effBg(el){let e=el,acc=[255,255,255];while(e&&e!==document.documentElement){const b=parse(getComputedStyle(e).backgroundColor);if(b[3]>0){acc=[Math.round(b[0]*b[3]+acc[0]*(1-b[3])),Math.round(b[1]*b[3]+acc[1]*(1-b[3])),Math.round(b[2]*b[3]+acc[2]*(1-b[3]))];if(b[3]===1)return acc}e=e.parentElement}return acc}
window.__measure=function(el){const cs=getComputedStyle(el);const fg=parse(cs.color);const bg=effBg(el);const lf=lum(fg),lb=lum(bg);const r=(Math.max(lf,lb)+0.05)/(Math.min(lf,lb)+0.05);const big=parseFloat(cs.fontSize)>=24||(parseFloat(cs.fontSize)>=18.66&&cs.fontWeight>=700);return{fg,bg,ratio:Math.round(r*100)/100,bigText:big,needed:big?3:4.5}}})()`;

const probes = [];
const seen = new Set();

for (const page of report.pages || []) {
  for (const v of [...(page.incomplete || [])]) {
    for (const node of v.nodes || []) {
      const target = node.target && node.target[0];
      if (!target || typeof target !== 'string') continue;
      const key = `${page.url}|${page.state || ''}|${v.id}|${target}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const cleanUrl = String(page.url).replace(/\s+\[state:[^\]]+\]$/, '');
      probes.push({ url: cleanUrl, state: page.state || null, rule: v.id, target, html: (node.html || '').slice(0, 160) });
    }
  }
}

console.log(`${probes.length} sonde(s) à rejouer`);

const browser = await chromium.launch();
const context = await browser.newContext(storageState ? { storageState: JSON.parse(readFileSync(storageState, 'utf8')) } : {});
const page = await context.newPage();

const runProbesForPage = async (url, state) => {
  try { await page.goto(url, { waitUntil: 'load', timeout: 30000 }); } catch (e) {
    return { navError: e.message };
  }
  await page.waitForTimeout(800);
  return {};
};

const results = [];
const byLocation = new Map();
for (const p of probes) {
  const key = `${p.url}|${p.state || ''}`;
  if (!byLocation.has(key)) byLocation.set(key, []);
  byLocation.get(key).push(p);
}

for (const [key, items] of byLocation) {
  const [url, state] = key.split('|');
  const { navError } = await runProbesForPage(url, state || null);
  for (const p of items) {
    const out = { ...p, verdict: 'N-A', details: {} };
    if (navError) { out.details = { reason: `navigation: ${navError}` }; results.push(out); continue; }

    if (p.rule === 'color-contrast') {
      try {
        const r = await page.evaluate(`${inPageRatio};(()=>{const el=document.querySelector(${JSON.stringify(p.target)});if(!el)return null;const undone=[];let e=el;while(e&&e!==document.documentElement){const cs=getComputedStyle(e);if(cs.display==='none'){undone.push([e,'display',e.style.display]);e.style.display='block'}else if(cs.visibility==='hidden'){undone.push([e,'visibility',e.style.visibility]);e.style.visibility='visible'}else if(cs.opacity==='0'){undone.push([e,'opacity',e.style.opacity]);e.style.opacity='1'}e=e.parentElement}const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden'){for(const[ev,pr,v]of undone)ev.style[pr]=v||'';return{hidden:true}}const m=window.__measure(el);for(const[ev,pr,v]of undone)ev.style[pr]=v||'';return m})()`);
        if (!r) { out.details = { reason: 'sélecteur absent du DOM' }; }
        else if (r.hidden) { out.details = { reason: 'nœud masqué' }; }
        else {
          out.details = r;
          out.verdict = r.ratio >= r.needed ? 'PASS' : 'FAIL';
        }
      } catch (e) { out.details = { reason: `mesure impossible: ${e.message.slice(0, 120)}` }; }
    } else if (p.rule === 'skip-link') {
      try {
        const r = await page.evaluate(`(async()=>{
          const el = document.querySelector(${JSON.stringify(p.target)});
          if (!el) return {absent:true};
          el.focus(); el.dispatchEvent(new FocusEvent('focus'));
          await new Promise(r=>setTimeout(r,60));
          const cs = getComputedStyle(el), rect = el.getBoundingClientRect();
          const href = el.getAttribute('href')||'';
          const dest = href.startsWith('#') ? document.querySelector(href) : null;
          return {visibleOnFocus: cs.display!=='none' && rect.width>0 && rect.height>0,
                  target: href, targetExists: !!dest,
                  targetFocusable: dest ? (dest.tabIndex>=0 || /^(A|BUTTON|INPUT|MAIN|SELECT|TEXTAREA)$/.test(dest.tagName) || dest.hasAttribute('tabindex')) : false};
        })()`);
        if (!r || r.absent) out.details = { reason: 'skip-link absent du DOM' };
        else {
          out.details = r;
          out.verdict = (r.visibleOnFocus && r.targetExists && r.targetFocusable) ? 'PASS' : 'FAIL';
        }
      } catch (e) { out.details = { reason: `activation impossible: ${e.message.slice(0, 120)}` }; }
    } else if (p.rule === 'link-in-text-block') {
      try {
        const r = await page.evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(p.target)});if(!el)return null;const cs=getComputedStyle(el);return{textDecoration:cs.textDecorationLine,color:cs.color}})()`);
        if (!r) out.details = { reason: 'lien absent du DOM' };
        else {
          out.details = r;
          out.verdict = /underline/.test(r.textDecoration) ? 'PASS' : 'FAIL';
        }
      } catch (e) { out.details = { reason: `mesure impossible: ${e.message.slice(0, 120)}` }; }
    } else if (p.rule === 'frame-tested') {
      out.details = { reason: "iframe éditeur TinyMCE — la page mère est auditée et styles.css est injectée en content_css ; le contenu éditable appartient à la donnée, pas au produit" };
      out.verdict = 'N-A';
    } else {
      out.details = { reason: `règle ${p.rule} sans sonde dédiée — vérification manuelle requise` };
    }
    results.push(out);
  }
}

await browser.close();

const summary = {};
for (const r of results) {
  summary[`${r.rule}/${r.verdict}`] = (summary[`${r.rule}/${r.verdict}`] || 0) + 1;
}
writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), report: reportPath, summary, probes: results }, null, 2));
console.log('résumé:', JSON.stringify(summary));
console.log(`écrit → ${outPath}`);
