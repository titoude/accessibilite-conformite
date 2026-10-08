import { chromium } from 'playwright';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'tools/auth.json',locale:'en-US'});
const page=await ctx.newPage();
await page.goto('http://localhost:9540/objects/companies',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await page.waitForTimeout(3000);
const info=await page.evaluate(()=>{
  const handles=[...document.querySelectorAll('.s1f5mhhy, [data-dnd-sortable-handle]')].slice(0,6);
  return handles.map(el=>({
    cls:el.className.slice(0,20),attrs:[...el.attributes].map(a=>`${a.name}=${a.value}`).join(' ').slice(0,160),
    hasInteract:!!el.querySelector('button,[role],a[href],input,[tabindex]'),
    kids:[...el.children].map(c=>c.tagName+(c.getAttribute('role')||'')).slice(0,3),
    parentAttrs:[...el.parentElement.attributes].map(a=>a.name).join(',').slice(0,140)
  }));
});
console.log(JSON.stringify(info,null,1));
await browser.close();
