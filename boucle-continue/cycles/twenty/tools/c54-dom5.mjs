import { chromium } from 'playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ storageState: 'auth.json', viewport:{width:1280,height:800}, locale:'en-US' });
const p = await ctx.newPage();
await p.goto('http://localhost:9540/objects/opportunities', {waitUntil:'networkidle', timeout:60000}).catch(()=>{});
await p.waitForTimeout(3000);
const r = await p.evaluate(() => {
  const els=[...document.querySelectorAll('[aria-label^="Aggregate"]')].slice(0,5);
  return els.map(e=>({al:e.getAttribute('aria-label'), inner:e.innerText?.slice(0,80).replace(/\n/g,'|'), tc:e.textContent?.slice(0,80)}));
});
console.log(JSON.stringify(r,null,1));
await b.close();
