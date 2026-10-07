// reset-theme.mjs — restaure theme=auto (préférence serveur persistée dans
// UserProfile). À exécuter AVANT chaque scan : sans reset les pages tournent
// sous le dernier thème posé par un état mutant (theme-dark*).
// Usage: node reset-theme.mjs <baseUrl> <auth.json>
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const baseUrl = process.argv[2] ?? 'http://localhost:9090';
const authPath = resolve(here, process.argv[3] ?? 'auth.json');

const readThemeForm = async page => {
  const form = await page.$('form[action$="/settings/update"]');
  if (!form) return null;
  return page.evaluate(f => {
    const data = {};
    for (const el of f.elements) {
      if (!el.name) continue;
      if (el.type === 'checkbox') { if (el.checked) data[el.name] = el.value; continue; }
      data[el.name] = el.value;
    }
    return { action: f.action, data };
  }, form);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: authPath });
const page = await ctx.newPage();
await page.goto(`${baseUrl}/settings/general`, { waitUntil: 'load', timeout: 30000 });
const form = await readThemeForm(page);
if (!form) { console.error('form settings/update introuvable'); process.exit(2); }
form.data.theme = 'auto';
const res = await page.request.post(form.action, { form: form.data });
if (res.status() !== 302 && res.status() !== 200) { console.error('POST settings/update -> HTTP', res.status()); process.exit(2); }
await page.reload({ waitUntil: 'load' });
const again = await readThemeForm(page);
if (!again || again.data.theme !== 'auto') { console.error(`theme lu "${again?.data?.theme}" après écriture auto`); process.exit(2); }
await browser.close();
console.log('OK theme=auto');
