import { chromium } from 'playwright';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'tools/auth.json',locale:'en-US'});
const page=await ctx.newPage();
await page.goto('http://localhost:9540/objects/companies',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await page.waitForTimeout(3000);
// Test 1: écrire aria-label -> l'observer doit le réécrire
const r1=await page.evaluate(async()=>{
  const el=document.querySelector('.s1f5mhhy');
  el.setAttribute('aria-label','TESTWRITE');
  await new Promise(r=>setTimeout(r,150));
  return el.getAttribute('aria-label');
});
// Test 2: supprimer aria-label
const r2=await page.evaluate(async()=>{
  const el=document.querySelector('.s1f5mhhy');
  el.removeAttribute('aria-label');
  await new Promise(r=>setTimeout(r,150));
  return el.getAttribute('aria-label');
});
console.log('write->',r1,'| remove->',r2);
await browser.close();
