import { chromium } from 'playwright';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'auth.json'});
const p=await ctx.newPage();
await p.goto('http://127.0.0.1:8384/',{waitUntil:'load'});
await p.waitForSelector('button.panel-heading[data-target^="#folder-"]');
const r=await p.evaluate(()=>{
  const h=document.querySelector('.panel-warning .panel-heading');
  const cs=getComputedStyle(h);
  const bodyBg=getComputedStyle(document.body).backgroundColor;
  // quelle règle gagne ? lister les feuilles avec règles panel-warning
  const rules=[];
  for(const s of document.styleSheets){
    try{ for(const r of s.cssRules){ if(r.cssText&&r.cssText.includes('panel-warning')) rules.push(s.href+' :: '+r.cssText.slice(0,140)); } }catch(e){}
  }
  return {color:cs.color,bg:cs.backgroundColor,bodyBg,rules};
});
console.log(JSON.stringify(r,null,1));
await browser.close();
