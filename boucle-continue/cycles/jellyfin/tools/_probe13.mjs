import { chromium } from 'playwright';
const b = 'http://localhost:5961';
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'auth.json', locale: 'en-US', viewport: {width:1280,height:720} });
const page = await ctx.newPage();
const t = async (name, fn) => { try { await fn(); console.log('OK  ', name); } catch(e){ console.log('FAIL', name, '—', e.message.slice(0,110)); } };
const fresh = async (hash) => { await page.goto('about:blank'); await page.goto(b+'/web/index.html'+hash, {waitUntil:'load'}); await page.waitForSelector('.page:not(.hide)', {timeout:30000}); await page.waitForTimeout(1500); };

await t('nav-user-menu', async () => {
  await fresh('#/home');
  await page.locator('button[aria-label="User Menu"]').first().click();
  await page.waitForSelector('#app-user-menu >> text=Settings', {timeout:5000});
});
await t('filter-popover', async () => {
  await fresh('#/movies?tab=0');
  await page.locator('button[title="Filter"]').first().click();
  await page.waitForSelector('#filter-popover #filtersStatus-header >> text=Filters', {timeout:5000});
});
await t('sort-popover', async () => {
  await fresh('#/movies?tab=0');
  await page.locator('button[title="Sort"]').first().click();
  await page.waitForSelector('#sort-popover >> text=Name', {timeout:5000});
});
await t('view-settings', async () => {
  await fresh('#/movies?tab=0');
  await page.locator('button[title="View settings"]').first().click();
  await page.waitForSelector('.MuiPopover-root >> text=Grid view', {timeout:5000});
});
await t('card-context-menu', async () => {
  await fresh('#/movies?tab=0');
  const card = page.locator('.card:has(a:text-is("Alpha Squadron"))').first();
  await card.waitFor({state:'visible'});
  await card.locator('button.itemAction[data-action="menu"]').first().click();
  await page.waitForSelector('.actionSheet >> text=Play', {timeout:8000});
});
await t('syncplay-menu', async () => {
  await fresh('#/home');
  await page.locator('button[aria-label="SyncPlay"]').first().click();
  await page.waitForSelector('#app-sync-play-menu >> text=Create a new group', {timeout:5000});
});
await t('cast-menu', async () => {
  await fresh('#/home');
  await page.locator('button[aria-label="Cast to Device"]').first().click();
  await page.waitForSelector('#app-remote-play-menu >> text=Google Cast Unsupported', {timeout:5000});
});
await t('dash-library-menu', async () => {
  await fresh('#/dashboard/libraries');
  const card = page.locator('.MuiCard-root:has-text("Movies")').first();
  await card.waitFor({state:'visible'});
  await card.locator('button.MuiIconButton-root').first().click();
  await page.waitForSelector('.MuiMenu-root >> text=Scan library', {timeout:5000});
});
await t('dash-rename-dialog', async () => {
  await fresh('#/dashboard/libraries');
  const card = page.locator('.MuiCard-root:has-text("Movies")').first();
  await card.locator('button.MuiIconButton-root').first().click();
  await page.locator('.MuiMenu-root >> text=Rename').first().click();
  await page.waitForSelector('[role="dialog"] input', {timeout:5000});
});
await t('dash-confirm-remove', async () => {
  await fresh('#/dashboard/libraries');
  const card = page.locator('.MuiCard-root:has-text("Movies")').first();
  await card.locator('button.MuiIconButton-root').first().click();
  await page.locator('.MuiMenu-root >> text=Remove').first().click();
  await page.waitForSelector('[role="dialog"] >> text=Delete', {timeout:5000});
});
await t('add-media-library', async () => {
  await fresh('#/dashboard/libraries');
  await page.locator('button:has-text("Add Media Library")').first().click();
  await page.waitForSelector('.dialog >> text=Add Media Library', {timeout:8000});
});
await t('mobile-nav-390', async () => {
  await page.setViewportSize({width:390,height:844});
  await fresh('#/home');
  await page.locator('button[aria-label="Open Menu"]').first().click();
  await page.waitForSelector('.MuiDrawer-paper >> text=Favorites', {timeout:8000});
});
await browser.close();
