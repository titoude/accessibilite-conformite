import { chromium } from 'playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ storageState: 'auth.json', viewport:{width:1280,height:800}, locale:'en-US' });
const p = await ctx.newPage();
await p.goto('http://localhost:9540/objects/tasks', {waitUntil:'networkidle', timeout:60000}).catch(()=>{});
await p.waitForTimeout(3000);
const r = await p.evaluate(() => {
  const spans=[...document.querySelectorAll('span')].filter(s=>s.textContent==='Done').slice(0,3);
  return spans.map(s=>{
    const tag=s.closest('[style*="tw-tag"]')||s.parentElement?.parentElement;
    const cs=getComputedStyle(tag||s);
    return {cls:[...(tag||s).classList].join('.').slice(0,60), style:(tag||s).getAttribute('style')?.slice(0,160), color:cs.color, bg:cs.backgroundColor};
  });
});
console.log(JSON.stringify(r,null,1));
await b.close();
