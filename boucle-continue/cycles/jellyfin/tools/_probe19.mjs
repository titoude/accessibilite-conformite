import { chromium } from 'playwright';
const b='http://localhost:5961';
const ctx = await (await chromium.launch()).newContext({ storageState:'auth.json', locale:'en-US' });
const p = await ctx.newPage();
await p.goto(b+'/web/index.html', {waitUntil:'domcontentloaded'});
await p.waitForTimeout(1500);
await p.goto(b+'/web/index.html#/metadata?id=4df79bd2d5bbae21080a0524a2702d5a', {waitUntil:'domcontentloaded'});
await p.waitForSelector('.libraryTree li', {timeout:15000});
await p.waitForTimeout(1500);
const out = await p.evaluate(() => {
  const i = document.querySelector('#MediaFolders > .jstree-ocl');
  const a = document.querySelector('#MediaFolders > .jstree-anchor');
  return {
    i_attrs: i ? [...i.attributes].map(x=>x.name+'='+x.value).join(' ') : null,
    a_attrs: a ? [...a.attributes].map(x=>x.name+'='+x.value).join(' ') : null,
    li_attrs: [...document.querySelector('#MediaFolders').attributes].map(x=>x.name+'='+x.value).join(' ')
  };
});
console.log(JSON.stringify(out,null,1));
await ctx.browser().close();
