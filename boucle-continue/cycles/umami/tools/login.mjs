import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:3000';
const user = process.argv[3] || 'admin';
const pass = process.argv[4] || 'umami';
const out = process.argv[5] || 'auth.json';
const b = await chromium.launch();
const ctx = await b.newContext();
const p = await ctx.newPage();
await p.goto(base + '/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
// formulaire login umami : champs username/password + bouton submit
await p.waitForSelector('input[name="username"], input#username', { timeout: 20000 });
await p.fill('input[name="username"], input#username', user);
await p.fill('input[name="password"], input#password', pass);
await p.click('button[type="submit"]');
// la navigation post-login va vers /dashboard ou /websites
await p.waitForURL(u => !u.pathname.startsWith('/login'), { timeout: 20000 });
await p.waitForSelector('div.h-screen, [class*=zen-grid]', { timeout: 20000 });
await p.waitForTimeout(1500);
await ctx.storageState({ path: out });
await b.close();
console.log('storageState ->', out);
