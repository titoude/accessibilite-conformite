import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
const req = createRequire(import.meta.url);
const axeSource = readFileSync(req.resolve('axe-core/axe.min.js'), 'utf8');
const b = await chromium.launch(); const ctx = await b.newContext({ storageState: 'auth.json', viewport:{width:1280,height:800}, locale:'en-US' });
const p = await ctx.newPage();
await p.goto('http://localhost:9540/objects/people', {waitUntil:'networkidle', timeout:60000}).catch(()=>{});
await p.waitForTimeout(3000);
await p.evaluate(axeSource);
const r = await p.evaluate(async () => {
  const res = await axe.run(document, {runOnly:{type:'rule',values:['label-content-name-mismatch','aria-command-name']},resultTypes:['violations']});
  return res.violations.flatMap(v=>v.nodes.slice(0,4).map(n=>({rule:v.id,t:n.target[0],html:n.html.slice(0,140)})));
});
console.log(JSON.stringify(r,null,1).slice(0,3000));
await b.close();
