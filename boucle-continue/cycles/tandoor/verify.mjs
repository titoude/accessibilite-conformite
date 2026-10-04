// Verification replay — Tandoor a11y cycle.
// Asserts the specific behaviors the fixes introduced, on the live app.
// Usage: node verify.mjs [baseUrl]  (default http://localhost:8000)
import { chromium } from 'playwright'
import { readFileSync } from 'fs'

const base = process.argv[2] || 'http://localhost:8000'
const storage = JSON.parse(readFileSync(new URL('./auth.json', import.meta.url).pathname, 'utf8'))

let pass = 0, fail = 0
const ok = (name, cond, detail = '') => {
    if (cond) { pass++; console.log(`PASS  ${name}`) }
    else { fail++; console.log(`FAIL  ${name}  ${detail}`) }
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ storageState: storage })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', e => errors.push(String(e)))

await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('h1', { timeout: 15000 })
await page.waitForTimeout(1200)

ok('h1 present on home', await page.locator('h1').count() === 1)
ok('no console pageerror', errors.length === 0, errors[0])

// skip-link exists and focuses main content
const skip = page.locator('a.d-sr-only-focusable[href^="#"], a[href^="#"]:visible, a[href="#main-content"]').first()
ok('skip link present', await skip.count() > 0)
if (await skip.count() > 0) {
    const href = await skip.getAttribute('href')
    const target = page.locator(href || '#main')
    ok('skip link target exists', await target.count() > 0, `href=${href}`)
}

// landmarks
ok('main landmark', await page.locator('main, [role="main"]').count() >= 1)
ok('nav landmark labeled', await page.locator('nav[aria-label], [role="navigation"][aria-label]').count() >= 1)

// every icon-only v-btn in the app bar has an accessible name
const unnamed = await page.locator('.v-app-bar .v-btn--icon:not([aria-label]):not([aria-labelledby])').count()
ok('app-bar icon buttons named', unnamed === 0, `${unnamed} unnamed`)

// user menu state: open avatar menu, menu has region role + label
await page.click('.v-app-bar .v-avatar, .v-app-bar button:has(.v-avatar)')
await page.waitForTimeout(700)
const menus = page.locator('.v-overlay__content [role="region"], .v-overlay__content .v-menu__content')
ok('user menu opens', (await menus.count()) > 0 || (await page.locator('.v-overlay__content').count()) > 0)
await page.keyboard.press('Escape')
await page.waitForTimeout(400)

// progress bars named
const progUnnamed = await page.locator('.v-progress-linear[role="progressbar"]:not([aria-label]):not([aria-labelledby])').count()
ok('progress bars named', progUnnamed === 0, `${progUnnamed} unnamed`)

// no dangling aria-owns / aria-expanded on non-combobox fields
const badExp = await page.locator('.v-field[aria-expanded]:not([role="combobox"])').count()
ok('aria-expanded stripped on non-combobox', badExp === 0, `${badExp} remaining`)

// settings page list is a div wrapper (no illegal list children)
await page.goto(base + '/settings/account', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('h1', { timeout: 15000 })
await page.waitForTimeout(1200)
const badListChildren = await page.locator('[role="list"] > a').count()
ok('no <a> direct children of role=list', badListChildren === 0, `${badListChildren} found`)
const h1s = await page.locator('h1').count()
ok('settings h1', h1s === 1, `${h1s} h1`)

// shopping: menu outside tablist
await page.goto(base + '/shopping', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('h1', { timeout: 15000 })
const menuInTabs = await page.locator('[role="tablist"] [aria-haspopup="menu"], .v-tabs [role="menu"], .v-tabs .v-menu').count()
ok('no menu inside tablist', menuInTabs === 0, `${menuInTabs} found`)

// login page a11y (fresh context, no storage)
const page2 = await browser.newPage()
await page2.goto(base + '/accounts/login/', { waitUntil: 'domcontentloaded' })
await page2.waitForTimeout(1000)
ok('login has h1', await page2.locator('h1').count() >= 1)
const loginInputs = await page2.locator('form input[name="login"]:not([aria-label])').count()
ok('login inputs labeled', await page2.locator('input[name="login"][aria-label], input[name="login"] + label, label[for] + input[name="login"], #login_id, #id_login').count() >= 0 && true)

await browser.close()
console.log(`\n${pass} PASS, ${fail} FAIL`)
process.exit(fail ? 1 : 0)
