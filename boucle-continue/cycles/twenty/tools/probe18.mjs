import { chromium } from 'playwright';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'tools/auth.json',locale:'en-US'});
const page=await ctx.newPage();
await page.goto('http://localhost:9540/objects/companies',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await page.waitForTimeout(3000);
const info=await page.evaluate(()=>{
  const el=document.querySelector('.s1f5mhhy');
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
  const texts=[];let n=walker.nextNode();
  while(n){texts.push({txt:n.textContent.slice(0,40),parent:n.parentElement.tagName+'.'+(n.parentElement.className+'').slice(0,20),hidden:n.parentElement.closest('[aria-hidden="true"],[style*="display"]')!==null});n=walker.nextNode();}
  return {html:el.innerHTML.slice(0,400),texts};
});
console.log(JSON.stringify(info,null,1));
await browser.close();
