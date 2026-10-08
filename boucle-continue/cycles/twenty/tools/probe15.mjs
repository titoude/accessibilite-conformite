import { chromium } from 'playwright';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'tools/auth.json',locale:'en-US'});
await ctx.addInitScript(()=>{
  window.__labelLog=[];
  const orig=Element.prototype.setAttribute;
  Element.prototype.setAttribute=function(name,value){
    const cls=(this.className||'').toString();
    if((name.startsWith('aria-'))&&(cls.includes('s1f5mhhy')||cls.includes('s15hjodz'))){
      window.__labelLog.push({cls:cls.slice(0,10),name,value:(value+'').slice(0,30),stack:new Error().stack.split('\n').slice(1,4).join('|').slice(0,200)});
    }
    return orig.call(this,name,value);
  };
});
const page=await ctx.newPage();
await page.goto('http://localhost:9540/objects/companies',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await page.waitForTimeout(3500);
const log=await page.evaluate(()=>window.__labelLog.slice(0,15));
console.log(JSON.stringify(log,null,1));
await browser.close();
