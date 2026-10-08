import { chromium } from 'playwright';
const B='http://localhost:9540';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'tools/auth.json',locale:'en-US'});
const page=await ctx.newPage();
await page.goto(B+'/settings/profile',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await page.waitForTimeout(3000);
const info=await page.evaluate(()=>{
  const els=[...document.querySelectorAll('.s1a1o676')].slice(0,4);
  return els.map(el=>{
    const rect=el.getBoundingClientRect();
    const path=[];let n=el;
    for(let i=0;i<4&&n;i++){path.push(n.tagName.toLowerCase()+'.'+(n.className||'').toString().split(' ')[0]);n=n.parentElement;}
    return {classes:el.className,w:Math.round(rect.width),h:Math.round(rect.height),
      x:Math.round(rect.x),y:Math.round(rect.y),
      directText:[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).slice(0,4),
      directKids:[...el.children].map(c=>c.tagName.toLowerCase()+'.'+(c.getAttribute('data-testid')||c.className.toString().split(' ')[0])).slice(0,8),
      path:path.join(' < ')};
  });
});
console.log(JSON.stringify(info,null,1));
await browser.close();
