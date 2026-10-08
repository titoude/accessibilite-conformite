import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const TOOLS = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const c = await b.newContext({ locale:'en-US', storageState: join(TOOLS,'auth.json') });
const p = await c.newPage();
await p.goto(process.argv[2],{waitUntil:'load',timeout:90000});
await p.waitForSelector('main',{timeout:90000});
await p.waitForTimeout(3000);
const out = await p.evaluate(() => {
  const accName = (el) => el.getAttribute('aria-label')||el.getAttribute('aria-labelledby')||el.getAttribute('title')||(el.innerText||'').trim();
  const res=[];
  for (const el of document.querySelectorAll('button,[role="button"]')) {
    if (!accName(el)) {
      const o=el.getBoundingClientRect();
      if(o.width<4||o.height<4) continue;
      res.push({cls:el.className.toString().slice(0,80), par:el.parentElement?.className.toString().slice(0,60), html:el.outerHTML.slice(0,140)});
    }
  }
  return res;
});
console.log(JSON.stringify(out,null,1));
await b.close();
