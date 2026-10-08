import { chromium } from 'playwright';
const B='http://localhost:9540';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'tools/auth.json',locale:'en-US'});
const page=await ctx.newPage();
await page.goto(B+'/objects/people',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await page.waitForTimeout(3000);
const info=await page.evaluate(()=>{
  const els=[...document.querySelectorAll('div[data-base-ui-click-trigger][aria-haspopup="dialog"]')];
  return els.slice(0,3).map(el=>{
    const path=[];let n=el;
    for(let i=0;i<6&&n;i++){const dt=n.getAttribute?.('data-testid');path.push(n.tagName.toLowerCase()+'['+(dt?('data-testid='+dt):((n.getAttribute?.('class')||'').toString().split(' ')[0]||'?').slice(0,20))+']');n=n.parentElement;}
    return {path:path.join(' < '),text:el.textContent.slice(0,60),html:el.outerHTML.slice(0,200)};
  });
});
console.log(JSON.stringify(info,null,1));
await browser.close();
