// Dozzle login → storageState (jwt cookie is HttpOnly; use the real form).
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:8083';
const OUT = process.argv[3] || 'auth.json';

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
await page.fill('input[name="username"], input#username', 'admin');
await page.fill('input[name="password"], input#password, input[type="password"]', 'adminpass123');
await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign")');
await page.waitForURL(u => !u.pathname.startsWith('/login'), { timeout: 15000 });
await ctx.storageState({ path: OUT });
await browser.close();
console.log('storageState →', OUT);
