import { chromium } from 'playwright';
const b='http://127.0.0.1:8384';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'auth.json'});
const p=await ctx.newPage();
await p.goto(b+'/',{waitUntil:'load'});
await p.waitForSelector('button.panel-heading[data-target^="#folder-"]');
const read=async()=>await p.evaluate(()=>{
  const h=document.querySelector('.panel-warning .panel-heading');
  const cs=getComputedStyle(h);
  const links=[...document.styleSheets].map(s=>s.href).filter(Boolean);
  return {color:cs.color,bg:cs.backgroundColor,links};
});
console.log('default:',JSON.stringify(await read()));
// PUT dark
await p.evaluate(async()=>{const m=document.cookie.match(/CSRF-Token-([A-Z0-9]+)=([^;]+)/);const h={['X-CSRF-Token-'+m[1]]:m[2],'Content-Type':'application/json'};const g=await(await fetch('/rest/config/gui',{headers:h})).json();g.theme='dark';await fetch('/rest/config/gui',{method:'PUT',headers:h,body:JSON.stringify(g)});});
await p.evaluate(async()=>{const m=document.cookie.match(/CSRF-Token-([A-Z0-9]+)=([^;]+)/);await fetch('/rest/system/restart',{method:'POST',headers:{['X-CSRF-Token-'+m[1]]:m[2]}}).catch(()=>{});});
await p.waitForTimeout(9000);
await p.reload({waitUntil:'load'}).catch(()=>{});
await p.waitForSelector('button.panel-heading[data-target^="#folder-"]',{timeout:20000});
console.log('dark:',JSON.stringify(await read()));
await p.evaluate(async()=>{const m=document.cookie.match(/CSRF-Token-([A-Z0-9]+)=([^;]+)/);const h={['X-CSRF-Token-'+m[1]]:m[2],'Content-Type':'application/json'};const g=await(await fetch('/rest/config/gui',{headers:h})).json();g.theme='default';await fetch('/rest/config/gui',{method:'PUT',headers:h,body:JSON.stringify(g)});});
await p.evaluate(async()=>{const m=document.cookie.match(/CSRF-Token-([A-Z0-9]+)=([^;]+)/);await fetch('/rest/system/restart',{method:'POST',headers:{['X-CSRF-Token-'+m[1]]:m[2]}}).catch(()=>{});});
await p.waitForTimeout(8000);
await browser.close();
