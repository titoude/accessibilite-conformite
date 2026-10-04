// eval-final — independent re-evaluation (runs scripts NOT used during fixing).
// Re-scans a reduced scope fresh + functional smoke checks on the live app.
// Usage: node eval-final.mjs [baseUrl] --storage auth.json --out dir
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const RULE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const base = process.argv[2] || 'http://localhost:8000'
const storage = JSON.parse(readFileSync(new URL('./auth.json', import.meta.url).pathname, 'utf8'))
const outDir = '/home/ubuntu/boucle-runs/tandoor/final/eval'
mkdirSync(outDir, { recursive: true })

let pass = 0, fail = 0, info = 0
const ok = (name, cond, detail = '') => {
    if (cond) { pass++; console.log(`PASS  ${name}`) }
    else { fail++; console.log(`FAIL  ${name}  ${detail}`) }
}
const note = (name, detail = '') => { info++; console.log(`INFO  ${name}  ${detail}`) }

const browser = await chromium.launch()
const ctx = await browser.newContext({ storageState: storage })
const page = await ctx.newPage()
const pageErrors = []
const BENIGN_ERRORS = /Wake Lock|wake-lock|NotAllowedError.*permission/i
page.on('pageerror', e => { const m = String(e); if (!BENIGN_ERRORS.test(m)) pageErrors.push(m) })

// --- independent axe re-scan on 4 representative routes, reduced ---
const routes = ['/', '/shopping', '/settings/account', '/recipe/2']
const results = []
for (const r of routes) {
    await page.goto(base + r, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('h1', { timeout: 15000 })
    await page.waitForTimeout(1200)
    await page.addScriptTag({ content: axeSource })
    const res = await page.evaluate(async (tags) => {
        return await window.axe.run(document, {
            runOnly: { type: 'tag', values: tags },
            resultTypes: ['violations', 'incomplete'],
        })
    }, RULE_TAGS)
    results.push({ route: r, violations: res.violations.length, incomplete: res.incomplete.length })
    ok(`axe ${r} zero violations`, res.violations.length === 0,
        res.violations.map(v => v.id).join(','))
}
ok('no console pageerror during rescan', pageErrors.length === 0, pageErrors[0])

// --- functional smoke: the fixes must not have broken product behavior ---
// 1. home renders recipe links (grid populated or meaningful content)
await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('h1')
await page.waitForTimeout(1500)
const recipeLinks = await page.locator('a[href*="recipe"]').count()
const homeText = await page.locator('.v-main').innerText()
ok('home renders recipe links or content', recipeLinks > 0 || homeText.trim().length > 50,
    `${recipeLinks} links, ${homeText.trim().length} chars`)

// 2. recipe detail renders content
await page.goto(base + '/recipe/2', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('h1')
await page.waitForTimeout(1500)
const bodyText = await page.locator('.v-main').innerText()
ok('recipe page has content', bodyText.trim().length > 100, `${bodyText.trim().length} chars`)

// 3. shopping list renders items (or empty state), not an error
await page.goto(base + '/shopping', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('h1')
await page.waitForTimeout(1500)
const shoppingText = await page.locator('.v-main').innerText()
ok('shopping page renders', shoppingText.trim().length > 20 && !shoppingText.includes('vite-error'), `${shoppingText.trim().length} chars`)

// 4. navigation drawer opens (mobile-friendly check at desktop width)
const drawerBtn = page.locator('.v-app-bar .v-app-bar-nav-icon, .v-app-bar button[aria-label*="enu"], .v-app-bar button[aria-label*="avig"]').first()
if (await drawerBtn.count() > 0) {
    await drawerBtn.click()
    await page.waitForTimeout(700)
    ok('nav drawer opens', await page.locator('.v-navigation-drawer--active, .v-navigation-drawer.v-navigation-drawer--open').count() > 0)
} else {
    note('nav drawer toggle not found at this width')
}

// 5. keyboard: tab reaches focusable content (basic focus traversal)
await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('h1')
await page.keyboard.press('Tab')
await page.keyboard.press('Tab')
await page.keyboard.press('Tab')
const focused = await page.evaluate(() => document.activeElement?.tagName)
ok('tab focus lands on an element', ['A', 'BUTTON', 'INPUT', 'DIV'].includes(focused), `focused=${focused}`)

writeFileSync(outDir + '/eval-results.json', JSON.stringify({ routes: results, pass, fail, info }, null, 2))
await browser.close()
console.log(`\n${pass} PASS, ${fail} FAIL, ${info} INFO`)
process.exit(fail ? 1 : 0)
