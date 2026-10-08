import { chromium } from 'playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ storageState: 'auth.json', viewport:{width:1280,height:800}, locale:'en-US' });
const p = await ctx.newPage();
await p.goto('http://localhost:9540/objects/opportunities', {waitUntil:'networkidle', timeout:60000}).catch(()=>{});
await p.waitForTimeout(3000);
const r = await p.evaluate(() => {
  const els=[...document.querySelectorAll('[aria-labelledby$="-footer-value"]')].slice(0,4);
  return els.map(e=>{
    const ref=document.getElementById(e.getAttribute('aria-labelledby'));
    return {btnText:e.innerText?.slice(0,60).replace(/\n/g,'|'), refText:ref?ref.textContent?.slice(0,60):'NO-REF', refInner:ref?ref.innerText?.slice(0,60).replace(/\n/g,'|'):null, al:e.getAttribute('aria-label')};
  });
});
console.log(JSON.stringify(r,null,1));
await b.close();
