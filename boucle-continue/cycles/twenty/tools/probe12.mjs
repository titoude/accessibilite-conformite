import { chromium } from 'playwright';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'tools/auth.json',locale:'en-US'});
const page=await ctx.newPage();
await page.goto('http://localhost:9540/objects/companies',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await page.waitForTimeout(3500);
const info=await page.evaluate(()=>{
  return [...document.querySelectorAll('[data-testid^="row-id-"] .record-table-column-drag-and-drop > *')].slice(0,6).map(el=>({
    cls:(el.className||'').toString().slice(0,25),
    label:el.getAttribute('aria-label'),role:el.getAttribute('role'),tab:el.getAttribute('tabindex'),
    kids:[...el.children].map(c=>c.tagName+'.'+(c.getAttribute('class')||'').toString().slice(0,15)).slice(0,3),
    text:(el.textContent||'').slice(0,40)
  }));
});
console.log(JSON.stringify(info,null,1));
await browser.close();
