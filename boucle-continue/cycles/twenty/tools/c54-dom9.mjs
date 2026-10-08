import { chromium } from 'playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ storageState: 'auth.json', viewport:{width:1280,height:800}, locale:'en-US' });
const p = await ctx.newPage();
await p.goto('http://localhost:9540/objects/opportunities?viewId=9f9c3f36-bb7c-447d-8d70-43cb7f4d8030', {waitUntil:'networkidle', timeout:60000}).catch(()=>{});
await p.waitForTimeout(3000);
const r = await p.evaluate(() => {
  const el=[...document.querySelectorAll('div')].find(d=>d.textContent==='Customer'&&d.className.includes('truncate'));
  if(!el) return 'notfound';
  const chain=[]; let n=el;
  for(let i=0;i<6&&n;i++){const cs=getComputedStyle(n);chain.push({cls:[...n.classList].join('.').slice(0,50),color:cs.color,bg:cs.backgroundColor,style:n.getAttribute('style')?.slice(0,120)});n=n.parentElement;}
  return chain;
});
console.log(JSON.stringify(r,null,1));
await b.close();
