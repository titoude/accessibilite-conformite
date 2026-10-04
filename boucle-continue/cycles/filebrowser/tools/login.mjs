// login.mjs — filebrowser : POST /api/login → JWT → localStorage
import { chromium } from 'playwright';
const BASE = process.env.BASE_URL || 'http://localhost:8082';
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const resp = await page.request.post(`${BASE}/api/login`, { data: { username: 'admin', password: 'adminpass123' } });
if (!resp.ok()) { console.error('login failed', resp.status(), await resp.text()); process.exit(2); }
const jwt = await resp.text();
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
await page.evaluate((t) => {
  localStorage.setItem('jwt', t);
}, jwt);
await ctx.storageState({ path: new URL('./auth.json', import.meta.url).pathname });
console.log('auth.json écrit — jwt:', jwt.slice(0, 30) + '…');
await browser.close();
