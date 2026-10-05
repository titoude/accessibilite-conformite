// eval-final — independent re-evaluation, cycle 23 BookStack.
// Re-scans a reduced scope fresh + functional smoke checks on the live app.
// Usage: node eval-final.mjs [baseUrl]  (default http://localhost:8080)
import { chromium } from 'playwright'
import { readFileSync } from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const RULE_TAGS = ['wcag2a', 'wcag2a-best-practice', 'wcag2aa', 'wcag2aa-best-practice', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

const base = process.argv[2] || 'http://localhost:8080'
const storage = JSON.parse(readFileSync(new URL('./auth.json', import.meta.url).pathname, 'utf8'))

let pass = 0, fail = 0, na = 0
const ok = (name, cond, detail = '') => {
    if (cond) { pass++; console.log(`PASS  ${name}`) }
    else { fail++; console.log(`FAIL  ${name}  ${detail}`) }
}
const note = (name, detail = '') => { na++; console.log(`N-A   ${name}  ${detail}`) }

const browser = await chromium.launch()
const ctx = await browser.newContext({ storageState: storage })
const page = await ctx.newPage()
const pageErrors = []
page.on('pageerror', e => pageErrors.push(String(e)))

// --- independent axe re-scan on representative routes (subset of manifest scope) ---
const routes = ['/', '/books', '/books/demo-a11y-book', '/books/demo-a11y-book/page/page-demo-a11y', '/books/demo-a11y-book/page/page-demo-a11y/edit', '/settings/features', '/my-account/profile', '/search']
const results = []
for (const r of routes) {
    await page.goto(base + r, { waitUntil: 'load', timeout: 30000 })
    await page.waitForSelector('#main-content', { timeout: 15000 })
    await page.waitForTimeout(1200)
    await page.addScriptTag({ content: axeSource })
    const res = await page.evaluate(async (tags) => {
        return await window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] })
    }, RULE_TAGS)
    results.push({ route: r, violations: res.violations.length, incomplete: res.incomplete.length })
    ok(`axe ${r} zero violations`, res.violations.length === 0,
        res.violations.map(v => v.id + ':' + v.nodes.length).join(', '))
}
console.log('rescan:', JSON.stringify(results))

// --- functional smoke: the fixes must not have broken product behavior ---
// 1. profile menu opens, item focusable, Escape closes
await page.goto(base + '/', { waitUntil: 'load' })
await page.waitForSelector('#main-content')
await page.click('button[aria-label="Profile Menu"]')
const menuVisible = await page.locator('ul.dropdown-menu.anim').isVisible()
ok('menu profil s\'ouvre', menuVisible)
await page.keyboard.press('Escape')
await page.waitForTimeout(400)
ok('menu profil se ferme (Escape)', !(await page.locator('ul.dropdown-menu.anim').isVisible()))

// 2. mobile tabs switch (375px)
const mob = await browser.newContext({ storageState: storage, viewport: { width: 375, height: 812 } })
const mp = await mob.newPage()
await mp.goto(base + '/books/demo-a11y-book', { waitUntil: 'load' })
await mp.waitForSelector('#main-content')
await mp.click('button[data-tab="info"]')
await mp.waitForTimeout(500)
const infoSel = await mp.locator('button[data-tab="info"]').getAttribute('aria-selected')
ok('onglet info sélectionné (mobile)', infoSel === 'true', `aria-selected=${infoSel}`)
await mp.click('button[data-tab="content"]')
await mp.waitForTimeout(500)
ok('onglet content sélectionné (mobile)', await mp.locator('button[data-tab="content"]').getAttribute('aria-selected') === 'true')
await mob.close()

// 3. comment tabs switch
await page.goto(base + '/books/demo-a11y-book/page/page-demo-a11y', { waitUntil: 'load' })
await page.waitForSelector('#main-content')
await page.click('#comment-tab-archived')
await page.waitForSelector('#comment-tab-panel-archived', { state: 'visible', timeout: 8000 })
ok('onglet commentaires archivés', true)
await page.click('#comment-tab-active')
await page.waitForSelector('#comment-tab-panel-active', { state: 'visible' })

// 4. editor loads
await page.goto(base + '/books/demo-a11y-book/page/page-demo-a11y/edit', { waitUntil: 'load' })
await page.waitForSelector('#main-content')
const editorOk = await page.waitForSelector('iframe#html-editor_ifr, textarea[name="markdown"], #html-editor', { state: 'attached', timeout: 15000 }).catch(() => null)
ok('éditeur chargé', !!editorOk)

// 5. search page works
await page.goto(base + '/search', { waitUntil: 'load' })
await page.fill('input[type="search"], input[name="term"]', 'demo')
await page.keyboard.press('Enter')
await page.waitForTimeout(1500)
ok('recherche répond', page.url().includes('/search'))

// 6. dark-mode toggle switches theme (click via menu then RESTORE the preference)
await page.goto(base + '/', { waitUntil: 'load' })
await page.click('button[aria-label="Profile Menu"]')
await page.waitForSelector('ul.dropdown-menu.anim', { state: 'visible' })
const before = await page.evaluate(() => document.documentElement.className)
await page.click('ul.dropdown-menu form[action*="toggle-dark-mode"] button')
await page.waitForTimeout(1500)
const after = await page.evaluate(() => document.documentElement.className)
ok('dark mode bascule', before !== after, `${before} -> ${after}`)
// restore : la préférence est persistée côté serveur — on rebascule
await page.click('button[aria-label="Profile Menu"]')
await page.waitForSelector('ul.dropdown-menu.anim', { state: 'visible' })
await page.click('ul.dropdown-menu form[action*="toggle-dark-mode"] button')
await page.waitForTimeout(1200)

// login page a11y (fresh context, no storage)
const page2 = await browser.newPage()
await page2.goto(base + '/login', { waitUntil: 'load' })
await page2.waitForTimeout(1000)
ok('login : h1 présent', await page2.locator('h1').count() >= 1)
ok('login : inputs étiquetés', await page2.evaluate(() =>
    [...document.querySelectorAll('input[type="email"], input[type="password"]')]
      .every(i => !!(i.getAttribute('aria-label') || (i.id && document.querySelector(`label[for="${CSS.escape(i.id)}"]`)) || i.closest('label')))))

ok('aucune erreur console durant le eval', pageErrors.length === 0, pageErrors[0])

await browser.close()
console.log(`\n${pass} PASS, ${fail} FAIL, ${na} N-A`)
process.exit(fail ? 1 : 0)
