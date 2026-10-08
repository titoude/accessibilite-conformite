import { chromium } from 'playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ storageState: 'auth.json', viewport:{width:1280,height:800}, locale:'en-US' });
const p = await ctx.newPage();
for (const u of ['settings/general','object/person/0d29f904-fd92-4ee4-90dc-262c52431c7b','objects/companies']) {
 await p.goto('http://localhost:9540/'+u, {waitUntil:'networkidle', timeout:60000}).catch(()=>{});
 await p.waitForTimeout(2500);
 const r = await p.evaluate(() => {
   const path=(el)=>{const s=[];while(el&&el!==document.body){s.unshift(el.tagName.toLowerCase()+'.'+[...el.classList].join('.'));el=el.parentElement;}return s.join('>');};
   const m=document.querySelector('main');
   const card=document.querySelector('.s9iz60d');
   return {mainCls:m?[...m.classList].join('.'):null, mainPath:m?path(m):null, cardInsideMain:m&&card?m.contains(card):null, mainInsideCard:m&&card?card.contains(m):null};
 });
 console.log(u, JSON.stringify(r));
}
await b.close();
