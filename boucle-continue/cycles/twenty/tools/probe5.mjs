import { chromium } from 'playwright';
const b=await chromium.launch();const ctx=await b.newContext({storageState:'auth.json',locale:'en-US'});const p=await ctx.newPage();
await p.goto('http://localhost:9540/objects/people');await p.waitForTimeout(6000);
const out=await p.evaluate(()=>{
  const e=document.querySelector('[data-base-ui-click-trigger][aria-haspopup="dialog"].szxq27e,[data-base-ui-click-trigger][aria-haspopup="dialog"]');
  let cur=e,chain=[];
  while(cur&&cur.tagName!=='BODY'){chain.push(cur.tagName+'.'+String(cur.className).slice(0,60)+(cur.getAttribute('data-testid')?('['+cur.getAttribute('data-testid')+']'):''));cur=cur.parentElement}
  return chain.join(' < ');
});
console.log(out);
await b.close();
