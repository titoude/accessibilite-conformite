import { chromium } from 'playwright';
import axe from 'axe-core';

const browser = await chromium.launch();
for (const mode of ['light','dark']) {
  const ctx = await browser.newContext({ colorScheme: mode });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8888/search?q=test', { waitUntil: 'networkidle' });
  await page.waitForSelector('.dialog-error-block', { timeout: 15000 });
  const m = await page.evaluate(() => {
    const el = document.querySelector('.dialog-error-block');
    const a = el.querySelector('a');
    const cs = getComputedStyle(el);
    const csA = a ? getComputedStyle(a) : null;
    return {
      color: cs.color, bg: cs.backgroundColor,
      aColor: csA?.color, aUnderline: csA?.textDecorationLine || csA?.textDecoration,
      text: el.textContent.slice(0,120)
    };
  });
  // axe scoped to whole page (dialog included)
  await page.addScriptTag({ content: axe.source });
  const res = await page.evaluate(async () => await axe.run(document, {}));
  const vio = res.violations.filter(v => v.nodes.some(n => n.target.join(' ').includes('dialog-error') || n.html.includes('dialog-error')));
  const allV = res.violations.map(v => `${v.id}(${v.nodes.length})`);
  console.log(`=== ${mode} ===`);
  console.log(' computed:', JSON.stringify(m));
  console.log(' violations total:', res.violations.length, allV.join(',') || 'aucune');
  console.log(' violations touchant dialog-error:', JSON.stringify(vio.map(v=>({id:v.id,n:v.nodes.length,html:v.nodes[0]?.html?.slice(0,140)}))));
  // contrast ratio calculé pour color on bg
  const ratio = await page.evaluate(() => {
    const lum = c => { const [r,g,b]=c.match(/\d+/g).slice(0,3).map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)}); return 0.2126*r+0.7152*g+0.0722*b; };
    const el = document.querySelector('.dialog-error-block');
    const cs = getComputedStyle(el);
    let bg = cs.backgroundColor;
    let n = el;
    while ((bg==='rgba(0, 0, 0, 0)'||bg==='transparent') && n.parentElement) { n=n.parentElement; bg=getComputedStyle(n).backgroundColor; }
    const l1 = lum(cs.color), l2 = lum(bg);
    return ((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)).toFixed(2);
  });
  console.log(' ratio texte/bg mesuré:', ratio);
  await ctx.close();
}
await browser.close();
