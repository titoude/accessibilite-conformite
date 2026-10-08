import { chromium } from 'playwright';
const b=await chromium.launch();const ctx=await b.newContext({storageState:'auth.json',locale:'en-US'});const p=await ctx.newPage();
await p.goto('http://localhost:9540/objects/people');await p.waitForTimeout(6000);
const out=await p.evaluate(()=>{
  const els=[...document.querySelectorAll('[data-base-ui-click-trigger][aria-haspopup="dialog"]')];
  return els.slice(0,6).map(e=>({id:e.id,html:e.outerHTML.slice(0,220),parent:(e.closest('[data-testid],[class*="header"],[class*="cell"]')?.outerHTML||'').slice(0,100)}));
});
console.log(JSON.stringify(out,null,1).slice(0,3500));
await b.close();
