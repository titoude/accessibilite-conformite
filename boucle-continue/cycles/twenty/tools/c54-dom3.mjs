import { chromium } from 'playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ storageState: 'auth.json', viewport:{width:1280,height:800}, locale:'en-US' });
const p = await ctx.newPage();
await p.goto('http://localhost:9540/objects/tasks', {waitUntil:'networkidle', timeout:60000}).catch(()=>{});
await p.waitForTimeout(3000);
const r = await p.evaluate(() => {
  const els=[...document.querySelectorAll('[data-base-ui-click-trigger]')].slice(0,4);
  return els.map(e=>({tag:e.tagName,cls:[...e.classList].join('.'),role:e.getAttribute('role'),al:e.getAttribute('aria-label'),alb:e.getAttribute('aria-labelledby'),ti:e.getAttribute('title'),txt:e.textContent?.slice(0,40),parent:[...e.parentElement.classList].join('.').slice(0,50)}));
});
console.log(JSON.stringify(r,null,1));
await b.close();
