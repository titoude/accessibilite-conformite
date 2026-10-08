import { chromium } from 'playwright';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'tools/auth.json',locale:'en-US'});
const page=await ctx.newPage();
await page.goto('http://localhost:9540/objects/companies',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await page.waitForTimeout(3500);
const info=await page.evaluate(()=>{
  const el=document.querySelector('.s1f5mhhy');
  const all=[...el.attributes].map(a=>`${a.name}="${a.value}"`);
  const describedby=el.getAttribute('aria-describedby');
  const desc=describedby?document.getElementById(describedby):null;
  return {attrs:all,id:el.id,descBy:describedby,descEl:desc?{id:desc.id,text:desc.textContent,display:getComputedStyle(desc).display}:null,
    hiddenSibs:[...document.querySelectorAll('div[style*="display: none"],div[style*="display:none"]')].map(d=>({id:d.id,text:d.textContent.slice(0,50)})).slice(0,5)};
});
console.log(JSON.stringify(info,null,1));
await browser.close();
