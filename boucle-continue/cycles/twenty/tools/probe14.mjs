import { chromium } from 'playwright';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'tools/auth.json',locale:'en-US'});
const page=await ctx.newPage();
await page.goto('http://localhost:9540/objects/companies',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await page.waitForTimeout(3500);
const info=await page.evaluate(()=>{
  const el=document.querySelector('.s1f5mhhy');
  const label=el.getAttribute('aria-label');
  const sameAsId=document.getElementById(label);
  const containing=[...document.querySelectorAll(`[id="${label}"],[data-*="${label}"]`)];
  // observer sur 2s pour voir qui réécrit
  return {label, sameIdEl: !!sameAsId,
    elsWithId: [...document.querySelectorAll(`#${CSS.escape(label)}`)].map(e=>e.tagName+'.'+(e.className+'').slice(0,20)),
    svgTitles:[...el.querySelectorAll('svg title, title')].map(t=>t.textContent).slice(0,3),
    svgAria:[...el.querySelectorAll('svg')].map(s=>s.getAttribute('aria-label')||s.id||'').slice(0,3)};
});
console.log(JSON.stringify(info,null,1));
await browser.close();
