// inspect-residual.mjs — dump attributs des noeuds résiduels sur la modale ?rowId=
import { chromium } from 'playwright';
const BASE = process.argv[2] || 'http://localhost:8081';
const STORAGE = process.argv[3];
const NC_WS = process.env.NC_WS || 'wr23v8q3';
const NC_BASE = process.env.NC_BASE || 'pkfhnj2zuc1fhle';
const NC_TABLE = process.env.NC_TABLE || 'm48exzsl6itizh8';
const NC_GRID = process.env.NC_GRID || 'vwaeblf44ozgxrgt';
const GRID_URL = `/${NC_WS}/${NC_BASE}/${NC_TABLE}/${NC_GRID}/items-items`;

const browser = await chromium.launch();
const page = await (await browser.newContext({ storageState: STORAGE })).newPage();
await page.goto(BASE + GRID_URL + '?rowId=1', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.ant-modal-wrap.nc-modal-wrapper [data-testid="nc-expanded-form-modal"]', { timeout: 20000 });
await page.waitForTimeout(1500);

const dump = await page.evaluate(() => {
  const attrs = (el) => el ? Object.fromEntries([...el.attributes].map(a => [a.name, a.value])) : null;
  const tiptap = document.querySelector('.tiptap');
  const ta = document.querySelector('.nc-text-area-expanded');
  const wrap = document.querySelector('.ant-modal-wrap.nc-modal-wrapper');
  return {
    tiptap: attrs(tiptap),
    tiptapParent: tiptap ? { cls: tiptap.parentElement.className, attrs: attrs(tiptap.parentElement) } : null,
    textarea: attrs(ta),
    textareaParent: ta ? { tag: ta.parentElement.tagName, cls: ta.parentElement.className, attrs: attrs(ta.parentElement) } : null,
    modalWrap: attrs(wrap),
  };
});
console.log(JSON.stringify(dump, null, 1));
await browser.close();
