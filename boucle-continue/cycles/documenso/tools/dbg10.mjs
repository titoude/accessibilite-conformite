import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const TOOLS = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const c = await b.newContext({ locale:'en-US', storageState: join(TOOLS,'auth.json') });
const p = await c.newPage();
await p.goto(process.argv[2],{waitUntil:'load',timeout:90000});
await p.waitForTimeout(4000);
const out = await p.evaluate(() => {
  const res=[];
  const landmarks = new Set();
  document.querySelectorAll('main,nav,header,footer,aside,[role=main],[role=navigation],[role=banner],[role=contentinfo],[role=complementary],[role=search],[role=region]').forEach(e=>landmarks.add(e));
  const inLandmark = (el) => { let n=el; while(n){ if(landmarks.has(n)) return true; n=n.parentElement;} return false;};
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length===0 && (el.innerText||'').trim() && !inLandmark(el)) {
      res.push(el.tagName+'.'+(el.className?.toString().slice(0,50))+' :: '+(el.innerText||'').trim().slice(0,50));
    }
  }
  const lm=[...document.querySelectorAll('main,nav,header,footer,aside,[role=main],[role=navigation],[role=banner],[role=contentinfo]')].map(e=>e.tagName+'.'+(e.getAttribute('role')||'')+'.'+(e.className?.toString().slice(0,30)));
  return {outside:res.slice(0,15), landmarks:lm.slice(0,10)};
});
console.log(JSON.stringify(out,null,1));
await b.close();
