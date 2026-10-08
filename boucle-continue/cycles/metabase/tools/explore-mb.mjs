import { chromium } from 'playwright';
const B = 'http://localhost:7600';
const br = await chromium.launch();
const ctx = await br.newContext({ locale: 'en-US' });
const pg = await ctx.newPage();
await pg.goto(`${B}/auth/login`); await pg.fill('input[name="username"]', 'admin@boucle46.local');
await pg.fill('input[type="password"]', 'Boucle46!A11y'); await pg.click('button[type="submit"]');
await pg.waitForURL(u => !u.pathname.includes('/auth/'), { timeout: 60000 }).catch(()=>{});
await pg.waitForTimeout(2500);
const dumpSel = async (label, sels) => {
  console.log(`=== ${label} ===`);
  for (const s of sels) {
    const n = await pg.locator(s).count();
    const vis = n ? await pg.locator(s).first().isVisible().catch(()=>false) : false;
    const txt = n ? (await pg.locator(s).first().innerText().catch(()=>'')).slice(0,90).replace(/\n/g,' | ') : '';
    console.log(` ${s} n=${n} vis=${vis} "${txt}"`);
  }
};
await pg.goto(`${B}/question/40`); await pg.waitForTimeout(4500);
await pg.locator('[data-testid="notebook-button"]').click(); await pg.waitForTimeout(3000);
await dumpSel('EDITOR', ['[data-testid="notebook-steps"]','[data-testid*="notebook"]','[class*="Notebook"]','button:has-text("Summarize")','div:has-text("Pick your starting data")']);
await pg.goto(`${B}/question/40`); await pg.waitForTimeout(4500);
await pg.locator('[data-testid="viz-settings-button"]').click(); await pg.waitForTimeout(2500);
await dumpSel('VIZSETTINGS', ['[data-testid="chartsettings-sidebar"]','[data-testid*="chartsettings"]','[class*="ChartSettings"]','aside:visible','h3:has-text("Settings")','div:has-text("Display")']);
await pg.goto(`${B}/dashboard/2`); await pg.waitForTimeout(3500);
await pg.getByRole('button', { name: 'More info' }).click(); await pg.waitForTimeout(2000);
await dumpSel('MOREINFO', ['[data-testid*="info"]','aside:visible','[role="complementary"]','div:has-text("Description")','div:has-text("Overview")']);
await pg.setViewportSize({ width: 390, height: 800 }); await pg.waitForTimeout(1500);
console.log('sidebar-toggle vis390:', await pg.locator('[data-testid="sidebar-toggle"]').isVisible());
await pg.locator('[data-testid="sidebar-toggle"]').click(); await pg.waitForTimeout(1800);
await dumpSel('MOBILE390', ['[data-testid="main-navbar-root"]','[role="dialog"]','[class*="Drawer"]','nav:visible']);
await br.close();
