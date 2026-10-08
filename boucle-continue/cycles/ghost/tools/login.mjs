// Cycle 43 — login Playwright ghost admin → auth.json (storageState).
// Formulaire /ghost/#/signin : input[name=identification] + input[name=password] + button[type=submit].
// Vérification : hash hors #/signin + sidebar admin montée.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.GHOST_BASE || process.argv[2] || 'http://localhost:6430';
const OUT = process.argv[3] || join(TOOLS, 'auth.json');
const email = process.env.GHOST_EMAIL || 'audit.c43@example.test';
const password = process.env.GHOST_PASSWORD || 'Audit-C43-Gh0st-Pass!';

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(`${BASE}/ghost/#/signin`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('input[name="identification"]', { timeout: 30000 });
await page.fill('input[name="identification"]', email);
await page.fill('input[name="password"]', password);
await page.click('button[type="submit"]');
await page.waitForFunction(() => !location.hash.startsWith('#/signin'), { timeout: 45000 });
await page.waitForSelector('[role="navigation"] a, nav.gh-nav a', { state: 'visible', timeout: 45000 });
await page.waitForTimeout(1500);
console.log('[login] landed:', page.url());
mkdirSync(dirname(OUT), { recursive: true });
await ctx.storageState({ path: OUT });
await browser.close();
console.log('[login] auth.json écrit ->', OUT);
