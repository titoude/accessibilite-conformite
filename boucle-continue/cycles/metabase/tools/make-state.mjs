// make-state.mjs — login metabase et sauvegarde du storageState Playwright
// (cookie metabase.SESSION). Usage: node make-state.mjs <base> <email> <pass> <out.json>
import { chromium } from 'playwright';

const [base, email, pass, out] = process.argv.slice(2);
if (!base || !email || !pass || !out) {
  console.error('usage: node make-state.mjs <base> <email> <pass> <out.json>');
  process.exit(2);
}
const br = await chromium.launch();
const ctx = await br.newContext({ locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(`${base}/auth/login`, { waitUntil: 'load' });
await page.fill('input[name="username"]', email);
await page.fill('input[type="password"]', pass);
await page.click('button[type="submit"]');
await page.waitForURL((u) => !u.pathname.includes('/auth/'), { timeout: 60000 });
await page.waitForSelector('#root nav, #root aside, #root [data-testid="home-page"]', { timeout: 30000 });
await ctx.storageState({ path: out });
console.log(`storageState → ${out}`);
await br.close();
