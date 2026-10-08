import { chromium } from 'playwright';
const B='http://localhost:9540';
const browser=await chromium.launch();
const ctx=await browser.newContext({storageState:'tools/auth.json',locale:'en-US'});
const page=await ctx.newPage();
await page.goto(B+'/objects/opportunities',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
await page.waitForTimeout(2500);
const viewBtn=page.locator('[data-testid="view-picker-button"], button:has-text("Table"), button:has-text("Kanban")').first();
const isKanban=await page.locator('.record-board-card').count();
if(!isKanban){
  await page.getByRole('button',{name:/View options|table view/i}).first().click().catch(()=>{});
}
const info=await page.evaluate(()=>{
  const card=document.querySelector('.record-board-card');
  if(!card) return {err:'no card'};
  const path=[];let n=card;
  for(let i=0;i<5&&n;i++){path.push(`${n.tagName}.${(n.getAttribute('role')||n.className.toString().split(' ')[0]||'').toString().slice(0,30)}`);n=n.parentElement;}
  const lines=[...card.querySelectorAll('.record-board-card-line')].slice(0,3).map(l=>({cls:l.className,role:l.getAttribute('role'),kids:[...l.children].map(c=>c.tagName+'.'+(c.getAttribute('role')||'')).slice(0,5)}));
  return {cardRole:card.getAttribute('role'),cardCls:card.className,cardAttrs:[...card.attributes].map(a=>a.name).join(','),path,lines};
});
console.log(JSON.stringify(info,null,1));
await browser.close();
