import { chromium } from 'playwright';
const B = 'http://localhost:7600';
const br = await chromium.launch();
const pg = await (await br.newContext({ locale: 'en-US' })).newPage();
await pg.goto(`${B}/auth/login`); await pg.fill('input[name="username"]', 'admin@boucle46.local');
await pg.fill('input[type="password"]', 'Boucle46!A11y'); await pg.click('button[type="submit"]');
await pg.waitForURL(u => !u.pathname.includes('/auth/'), { timeout: 60000 }).catch(()=>{});
await pg.setViewportSize({ width: 390, height: 800 }); await pg.waitForTimeout(2500);
const st = await pg.evaluate(() => ({
  toggle: !!document.querySelector('[data-testid="sidebar-toggle"]'),
  toggleVis: !!document.querySelector('[data-testid="sidebar-toggle"]') && document.querySelector('[data-testid="sidebar-toggle"]').offsetParent !== null,
  navbar: !!document.querySelector('[data-testid="main-navbar-root"]'),
  navbarVis: !!document.querySelector('[data-testid="main-navbar-root"]') && document.querySelector('[data-testid="main-navbar-root"]').offsetParent !== null,
}));
console.log(st);
await pg.locator('[data-testid="sidebar-toggle"]').click().catch(e => console.log('click fail'));
await pg.waitForTimeout(1800);
console.log(await pg.evaluate(() => ({
  navbarVis: document.querySelector('[data-testid="main-navbar-root"]')?.offsetParent !== null,
  drawer: document.querySelectorAll('[class*="Drawer"], [role="dialog"], nav').length,
  bodyText: (document.body.innerText||'').slice(0,80).replace(/\n/g,'|'),
})));
await pg.screenshot({ path: '/tmp/mb-390.png' });
await br.close();
