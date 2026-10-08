import { chromium } from 'playwright';
const b=await chromium.launch();const ctx=await b.newContext({storageState:'auth.json',locale:'en-US'});const p=await ctx.newPage();
await p.goto('http://localhost:9540/objects/people');await p.waitForTimeout(6000);
const out=await p.evaluate(()=>{
  const els=[...document.querySelectorAll('[data-base-ui-click-trigger]')].filter(e=>{const s=getComputedStyle(e);return s.display!=='none'});
  return els.slice(0,8).map(e=>({id:e.id,role:e.getAttribute('role'),hp:e.getAttribute('aria-haspopup'),ph:(e.parentElement?.outerHTML||'').slice(0,120),inner:(e.querySelector('[data-testid],[aria-label]')?.getAttribute('data-testid')||e.querySelector('svg')?'icon/svg':e.textContent.slice(0,30))}));
});
console.log(JSON.stringify(out,null,0).slice(0,3000));
await b.close();
