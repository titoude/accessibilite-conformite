// verify.mjs — assertions dures cycle Memos (règles 13-17 : effet, pas action)
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3001';
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: new URL('./auth.json', import.meta.url).pathname });
const page = await ctx.newPage();
const goto = async (u) => { await page.goto(BASE + u, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('main', { timeout: 15000 }); await page.waitForTimeout(900); };

await goto('/');
check('h1 présent sur / (>=1 : le seed peut rendre un h1 markdown)', (await page.locator('h1').count()) >= 1);
await goto('/attachments');
check('h1 sur /attachments', await page.locator('h1').count() >= 1);
await goto('/calendar/2026/10');
check('h1 sur /calendar', await page.locator('h1').count() >= 1);
await goto('/setting');
check('h1 sur /setting', await page.locator('h1').count() >= 1);
const heads = await page.locator('h1,h2,h3,h4').evaluateAll((els) => els.map((e) => +e.tagName[1]));
check('ordre des titres /setting sans saut', heads.every((h, i) => i === 0 || h <= heads[i - 1] + 1), JSON.stringify(heads));
const emptyTh = await page.locator('th').evaluateAll((els) => els.filter((e) => !e.innerText.trim() && !e.querySelector('.sr-only,[aria-label]')).length);
check('aucun th sans nom /setting', emptyTh === 0, `${emptyTh} vide(s)`);

await goto('/');
const vp = await page.evaluate(() => document.querySelector('meta[name="viewport"]')?.content || '');
check('viewport autorise le zoom', !/user-scalable\s*=\s*no|maximum-scale/i.test(vp), vp);
const accName = await page.locator('.cm-content').first().getAttribute('aria-label');
check('éditeur .cm-content a un nom accessible', !!accName, accName || 'aucun');
const sepInLandmark = await page.evaluate(() => {
  const sep = document.querySelector('[role="separator"][aria-valuenow]');
  if (!sep) return false;
  return !!sep.closest('[role="complementary"],aside,nav,main,[role="navigation"],[role="main"]');
});
check('poignée de redimension dans un landmark', sepInLandmark);

// état : popover space-switcher = dialog nommé
await page.locator('button[aria-label^="Switch space"]').first().click();
await page.waitForTimeout(700);
const dlgName = await page.locator('[role="dialog"]').first().getAttribute('aria-label');
check('popover Switch space : dialog nommé', !!dlgName, dlgName || 'non nommé');
await page.keyboard.press('Escape'); await page.waitForTimeout(400);

const token = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim());
check('token muted-foreground assombri', /oklch\(0\.4[0-9]/.test(token), token);
const alphaMuted = await page.evaluate(() => document.querySelectorAll('[class*="text-muted-foreground/"]').length);
check('aucune variante alpha muted dans le DOM', alphaMuted === 0, `${alphaMuted} restante(s)`);

const fails = results.filter((r) => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} PASS`);
await browser.close();
process.exit(fails.length ? 1 : 0);
