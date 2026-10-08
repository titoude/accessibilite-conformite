import { chromium } from 'playwright';
const b=await chromium.launch();const ctx=await b.newContext({storageState:'auth.json',locale:'en-US'});const p=await ctx.newPage();
await p.goto('http://localhost:9540/object/person/0d29f904-fd92-4ee4-90dc-262c52431c7b');await p.waitForTimeout(6000);
console.log('PERSON h1',await p.evaluate(()=>document.querySelectorAll('h1').length),'main',await p.evaluate(()=>document.querySelectorAll('main').length),'header',await p.evaluate(()=>document.querySelectorAll('header').length));
console.log('PERSON headers',await p.evaluate(()=>[...document.querySelectorAll('header')].map(e=>(e.className||'').toString().slice(0,60)+'|'+e.textContent.slice(0,30)).join(' ;; ')));
console.log('PERSON mainHTML',await p.evaluate(()=>{const m=document.querySelector('main');return m?m.outerHTML.slice(0,150):'NONE'}));
await p.goto('http://localhost:9540/objects/companies');await p.waitForTimeout(5000);
console.log('COMP main',await p.evaluate(()=>document.querySelectorAll('main').length),'h1',await p.evaluate(()=>document.querySelectorAll('h1').length));
console.log('COMP roots',await p.evaluate(()=>{const r=document.getElementById('root');return r?r.children.length+' kids; first:'+ (r.firstElementChild?.outerHTML.slice(0,180)):'none'}));
// open filter dropdown
const fb=p.locator('button,[role=button]').filter({hasText:/filter/i}).first();
try{await fb.click({timeout:5000});}catch(e){console.log('filterclick fail')}
await p.waitForTimeout(1500);
console.log('OPT',await p.evaluate(()=>{const e=document.querySelector('[id$="-options"]');return e?e.outerHTML.slice(0,600):'no options el'}));
await p.goto('http://localhost:9540/settings/profile');await p.waitForTimeout(5000);
console.log('SET main',await p.evaluate(()=>document.querySelectorAll('main').length),'h1',await p.evaluate(()=>document.querySelectorAll('h1').length),'nav',await p.evaluate(()=>document.querySelectorAll('nav').length));
console.log('SET s1a1o676',await p.evaluate(()=>{const e=document.querySelector('.s1a1o676');return e?e.tagName+'.'+e.className+' parent:'+(e.parentElement?.tagName+'.'+(e.parentElement?.className||'').toString().slice(0,50)):'none'}));
await b.close();
