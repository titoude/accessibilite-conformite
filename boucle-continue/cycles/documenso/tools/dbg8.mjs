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
  const res=[];
  for (const el of document.querySelectorAll('button,[role="button"],[role="checkbox"]')) {
    const nm = el.getAttribute('aria-label')||el.getAttribute('aria-labelledby')||el.getAttribute('title')||(el.innerText||'').trim();
    if (!nm) {
      const o=el.getBoundingClientRect();
      if(o.width<4||o.height<4) continue;
      const path=[]; let n=el;
      while(n&&n!==document.body){path.unshift(n.tagName.toLowerCase()+(n.id?'#'+n.id:'')+'.'+(n.className?.toString().split(' ').slice(0,2).join('.')||''));n=n.parentElement}
      res.push({path:path.join('>'), html:el.outerHTML.slice(0,260), ptxt:el.parentElement?.innerText?.slice(0,60)});
    }
  }
  return res;
});
console.log(JSON.stringify(out,null,1));
await b.close();
