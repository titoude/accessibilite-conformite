import { chromium } from 'playwright';
const BASE = process.env.ABS_BASE || 'http://127.0.0.1:8088/audiobookshelf';
const b = await chromium.launch();
const ctx = await b.newContext();
const page = await ctx.newPage();
await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
await page.fill('input[type="text"], input[name="username"], #username', 'root').catch(async () => {
  await page.locator('input').first().fill('root');
});
await page.fill('input[type="password"]', 'rootpass123');
await page.click('button[type="submit"], button:has-text("Submit"), button:has-text("Login")');
await page.waitForURL(u => !u.pathname.includes('login'), { timeout: 15000 });
console.log('post-login URL:', page.url());
await ctx.storageState({ path: 'auth.json' });
console.log('storageState -> auth.json');
await b.close();
