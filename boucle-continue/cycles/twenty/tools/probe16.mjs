import { chromium } from 'playwright';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'tools/auth.json',locale:'en-US'});
const page=await ctx.newPage();
await page.goto('http://localhost:9540/objects/companies',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await page.waitForTimeout(3000);
const info=await page.evaluate(()=>{
  const row=document.querySelector('[data-testid^="row-id-"]');
  const handle=row?.querySelector('.s1f5mhhy');
  return {
    rowAttrs:row?[...row.attributes].map(a=>`${a.name}=${a.value.slice(0,40)}`).slice(0,12):null,
    selId:row?.getAttribute('data-selectable-id'),
    label:handle?.getAttribute('aria-label'),
    siblings:[...document.querySelectorAll('.s1f5mhhy')].slice(0,4).map(e=>e.getAttribute('aria-label'))
  };
});
console.log(JSON.stringify(info,null,1));
await browser.close();
