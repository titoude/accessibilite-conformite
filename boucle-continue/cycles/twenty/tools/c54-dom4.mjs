import { chromium } from 'playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ storageState: 'auth.json', viewport:{width:1280,height:800}, locale:'en-US' });
const p = await ctx.newPage();
await p.goto('http://localhost:9540/objects/opportunities', {waitUntil:'networkidle', timeout:60000}).catch(()=>{});
await p.waitForTimeout(3000);
const r = await p.evaluate(() => {
  const els=[...document.querySelectorAll('div[role="button"][data-base-ui-click-trigger]')].slice(0,6);
  const path=(el)=>{const s=[];while(el&&el!==document.body){s.unshift(el.tagName.toLowerCase()+'.'+[...el.classList].join('.').slice(0,40));el=el.parentElement;}return s.slice(-5).join('>');};
  return els.map(e=>({id:e.id,al:e.getAttribute('aria-label'),ti:e.getAttribute('title'),txt:e.textContent?.slice(0,50),p:path(e)}));
});
console.log(JSON.stringify(r,null,1));
await b.close();
