import { chromium } from 'playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ storageState: 'auth.json', viewport:{width:1280,height:800}, locale:'en-US' });
const p = await ctx.newPage();
await p.goto('http://localhost:9540/settings/general', {waitUntil:'networkidle', timeout:60000}).catch(()=>{});
await p.waitForTimeout(3000);
const r1 = await p.evaluate(() => {
  const path = (el) => { const s=[]; while(el && el!==document.body){ s.unshift(el.tagName.toLowerCase()+'.'+[...el.classList].join('.')+(el.getAttribute('role')?`[role=${el.getAttribute('role')}]`:'')); el=el.parentElement;} return s.join(' > '); };
  const out={landmarks:[...document.querySelectorAll('main,nav,aside,[role=main],[role=navigation],[role=complementary],header,footer')].map(e=>e.tagName+'.'+[...e.classList].join('.')+(e.getAttribute('role')?`[role=${e.getAttribute('role')}]`:''))};
  const h1=document.querySelector('h1'); out.h1=h1?path(h1):null;
  const tab=document.querySelector('a[data-testid="tab-general"]'); out.tab=tab?path(tab):null;
  return out;});
console.log(JSON.stringify(r1,null,1).slice(0,3000));
await p.goto('http://localhost:9540/object/person/0d29f904-fd92-4ee4-90dc-262c52431c7b', {waitUntil:'networkidle', timeout:60000}).catch(()=>{});
await p.waitForTimeout(3000);
const r2 = await p.evaluate(() => {
  const path = (el) => { const s=[]; while(el && el!==document.body){ s.unshift(el.tagName.toLowerCase()+'.'+[...el.classList].join('.')+(el.getAttribute('role')?`[role=${el.getAttribute('role')}]`:'')); el=el.parentElement;} return s.join(' > '); };
  const t=document.querySelector('.s5vs2pt'); return {s5:t?path(t):null, mains:document.querySelectorAll('main').length, h1:!!document.querySelector('h1')};});
console.log(JSON.stringify(r2,null,1).slice(0,2000));
await b.close();
