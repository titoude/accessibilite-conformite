// Paperless-ngx login → storageState (Django form POST at /accounts/login/).
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8085';
const OUT = process.argv[3] || 'auth.json';

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(BASE + '/accounts/login/', { waitUntil: 'domcontentloaded' });
await page.fill('input[name="login"], input[name="username"]', 'admin');
await page.fill('input[name="password"]', 'adminpass123');
await page.click('button[type="submit"], input[type="submit"]');
await page.waitForURL(u => !u.pathname.startsWith('/accounts/login'), { timeout: 20000 });
await ctx.storageState({ path: OUT });
await browser.close();
console.log('storageState →', OUT);
