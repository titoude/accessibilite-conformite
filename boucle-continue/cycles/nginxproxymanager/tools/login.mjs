// Capture un storageState authentifié : POST /api/tokens puis écrit la
// clé 'authentications' au format attendu par AuthStore ([{token, expires}]).
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const OUT = process.env.AUTH_OUT || new URL('./auth.json', import.meta.url).pathname;

const resp = await fetch(`${BASE}/api/tokens`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ identity: 'admin@example.com', secret: 'adminpass123' }),
});
if (!resp.ok) throw new Error(`login api ${resp.status}`);
const body = await resp.json();

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(BASE + '/login', { waitUntil: 'load', timeout: 30000 });
await page.evaluate(t => {
  localStorage.setItem('authentications', JSON.stringify([{ token: t.token, expires: t.expires }]));
}, body);
await ctx.storageState({ path: OUT });
console.log('storageState ->', OUT, '| expires:', body.expires);
await browser.close();
