import { chromium } from 'playwright';
import fs from 'fs';
const BASE='http://127.0.0.1:8089';
const b=await chromium.launch();
const p=await b.newPage();
await p.goto(BASE+'/app/');
await p.waitForTimeout(2500);
const text=await p.evaluate(()=>document.body.innerText);
if(text.includes('create an admin')){
  await p.fill('input[name="username"]','admin');
  await p.fill('input[name="password"]','adminpass123');
  await p.fill('input[name="confirmPassword"]','adminpass123');
  await p.click('button:has-text("CREATE ADMIN")');
  console.log('admin created');
}else{
  await p.fill('input[name="username"]','admin');
  await p.fill('input[name="password"]','adminpass123');
  await p.click('button:has-text("SIGN IN"),button[type="submit"]');
  console.log('login');
}
await p.waitForTimeout(4000);
console.log('url:',p.url());
const ctx=await p.context().storageState({path:'auth.json'});
console.log('auth.json written');
await b.close();
