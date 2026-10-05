// Verification replay — BookStack a11y cycle 23.
// Asserts the specific behaviors the fixes introduced, on the live app.
// Un élément non testable émet N-A (jamais un PASS muet).
// Usage: node verify.mjs [baseUrl]  (default http://localhost:8080)
import { chromium } from 'playwright'
import { readFileSync } from 'fs'

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
const errors = []
page.on('pageerror', e => errors.push(String(e)))

// ---------- page livre (tri layout) ----------
await page.goto(base + '/books/demo-a11y-book', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('#main-content', { timeout: 15000 })
await page.waitForTimeout(1000)

ok('une seule balise <main>', await page.locator('main').count() === 1)
ok('main possède #main-content', await page.locator('main#main-content').count() === 1)
ok('main focusable (tabindex=-1)', await page.locator('main#main-content[tabindex="-1"]').count() === 1)

// skip link : caché puis visible au focus, cible #main-content
const skip = page.locator('.skip-to-content-link, a[href="#main-content"]').first()
if (await skip.count() === 0) note('skip link', 'sélecteur absent')
else {
    const href = await skip.getAttribute('href')
    ok('skip link href cible #main-content', href === '#main-content', `href=${href}`)
    await page.keyboard.press('Tab')
    await page.waitForTimeout(200)
    const vis = await skip.evaluate(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 })
    ok('skip link visible au focus clavier', vis)
}

// tri tabs : tablist/tab/tabpanel branchés
const tabs = page.locator('.grid[role="tablist"] button[role="tab"]')
const tabCount = await tabs.count()
ok('2 onglets mobile (info/content)', tabCount === 2, `${tabCount}`)
if (tabCount >= 2) {
    const sel = await tabs.nth(0).getAttribute('aria-selected')
    ok('aria-selected présent sur onglet', sel === 'true' || sel === 'false', `aria-selected=${sel}`)
    const panels = page.locator('[role="tabpanel"]')
    ok('panels role=tabpanel liés', await panels.count() >= 2, `${await panels.count()}`)
}

// landmarks secondaires : pas de <aside> résiduel, pas de <main> imbriqué
ok('aucun <aside> dans le layout', await page.locator('aside').count() === 0)
ok('pas de <main> imbriqué', await page.locator('main main').count() === 0)

// menus : li sous role=menu ont tous un role
const badLi = await page.evaluate(() =>
    [...document.querySelectorAll('[role="menu"] > li:not([role])')].length)
ok('li des menus roletagés', badLi === 0, `${badLi} li sans role`)

// breadcrumbs aria-labels
const crumbs = page.locator('.breadcrumbs a[aria-label]')
ok('liens breadcrumbs étiquetés', await crumbs.count() >= 1, `${await crumbs.count()}`)

// sidebar : h2.h5 (pas de h5 nu)
const sidebarH5 = await page.locator('.tri-layout-sides h5, .tri-layout-sides h6').count()
ok('aucun h5/h6 dans les sidebars', sidebarH5 === 0, `${sidebarH5}`)
const sidebarH2 = await page.locator('.tri-layout-sides h2.h5').count()
ok('titres sidebar en h2.h5', sidebarH2 >= 1, `${sidebarH2}`)

// ---------- mobile : ordre des titres h1 -> h2 ----------
const mob = await browser.newContext({ storageState: storage, viewport: { width: 375, height: 812 } })
const mp = await mob.newPage()
await mp.goto(base + '/books/demo-a11y-book', { waitUntil: 'domcontentloaded' })
await mp.waitForSelector('#main-content')
await mp.waitForTimeout(800)
const order = await mp.evaluate(() => {
    const hs = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
        .filter(h => h.checkVisibility())
        .map(h => parseInt(h.tagName[1]))
    for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) return { ok: false, at: i, seq: hs.slice(0, 10) }
    return { ok: true, seq: hs.slice(0, 10) }
})
ok('mobile : pas de saut de niveau de titre', order.ok, JSON.stringify(order))
await mob.close()

// ---------- page (contenu) ----------
await page.goto(base + '/books/demo-a11y-book/page/page-demo-a11y', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('#main-content')
await page.waitForTimeout(800)
const visH1 = await page.locator('h1:visible').count()
ok('page : un seul h1 visible', visH1 === 1, `${visH1} visibles / ${await page.locator('h1').count()} au total`)
const descUnderlined = await page.evaluate(() => {
    const a = document.querySelector('.comment-box .content a, .entity-description a, .editor-content-area a')
    if (!a) return null
    return { sel: a.closest('.comment-box') ? 'comment-box' : (a.closest('.entity-description') ? 'entity-description' : 'editor'), dec: getComputedStyle(a).textDecorationLine }
})
if (descUnderlined === null) note('liens de contenu soulignés', 'aucun lien trouvé dans les contenus sondés')
else ok(`liens de contenu soulignés (${descUnderlined.sel})`, /underline/.test(descUnderlined.dec), descUnderlined.dec)

// ---------- éditeur : h1 sr-only ----------
await page.goto(base + '/books/demo-a11y-book/page/page-demo-a11y/edit', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('#main-content')
await page.waitForTimeout(1500)
ok('éditeur : h1 sr-only présent', await page.locator('main h1.sr-only').count() === 1)
ok('éditeur : h1 hors écran mais dans le DOM', await page.evaluate(() => {
    const h = document.querySelector('main h1.sr-only')
    if (!h) return false
    const r = h.getBoundingClientRect()
    return r.width <= 1 && r.height <= 1
}))

// ---------- menus ouverts : backdrop + inert ----------
await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('#main-content')
await page.waitForTimeout(800)
await page.click('button[aria-label="Profile Menu"]')
await page.waitForSelector('ul.dropdown-menu.anim', { state: 'visible', timeout: 8000 })
await page.waitForTimeout(400)
ok('backdrop menu ouvert', await page.locator('.menu-backdrop').count() === 1)
ok('contenu inert sous menu', await page.evaluate(() => document.querySelector('main').hasAttribute('inert')))
await page.keyboard.press('Escape')
await page.waitForTimeout(400)
ok('inert retiré à la fermeture', await page.evaluate(() => !document.querySelector('main').hasAttribute('inert')))

// dark-mode-toggle : bouton role=menuitem dans le menu profil
await page.click('button[aria-label="Profile Menu"]')
await page.waitForSelector('ul.dropdown-menu.anim', { state: 'visible' })
const darkRole = await page.locator('ul.dropdown-menu form[action*="toggle-dark-mode"] button').getAttribute('role')
ok('dark-mode-toggle role=menuitem', darkRole === 'menuitem', `role=${darkRole}`)
await page.keyboard.press('Escape')

// tailles de cibles : icon-list-item >= 24px
const smallTargets = await page.evaluate(() =>
    [...document.querySelectorAll('.icon-list-item, .breadcrumbs a, .dropdown-search-toggle-breadcrumb')]
        .filter(el => el.checkVisibility())
        .filter(el => { const r = el.getBoundingClientRect(); return r.height < 24 || r.width < 24 })
        .map(el => el.className).slice(0, 4))
ok('cibles >= 24px', smallTargets.length === 0, JSON.stringify(smallTargets))

// couleur primaire appliquée
const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim())
ok('--color-primary = #1e6aa5', primary.toLowerCase() === '#1e6aa5', primary)

// placeholder contrasté (mesuré, pas supposé)
const ph = await page.evaluate(() => {
    const i = document.querySelector('input[type="search"], input[placeholder], #header-search-box-input')
    return i ? getComputedStyle(i, '::placeholder').color : null
})
if (!ph) note('placeholder', 'aucun input trouvé')
else {
    const phRatio = await page.evaluate(() => {
        const i = document.querySelector('input[type="search"], input[placeholder], #header-search-box-input')
        const lum = c => { const v = c.map(x => { x /= 255; return x <= .04045 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4) }); return .2126 * v[0] + .7152 * v[1] + .0722 * v[2] }
        const rgb = s => (s.match(/[\d.]+/g) || []).map(Number)
        const fg = lum(rgb(getComputedStyle(i, '::placeholder').color).slice(0, 3))
        let bgc = rgb(getComputedStyle(i).backgroundColor)
        if ((bgc[3] ?? 1) < 1 || !bgc.length) bgc = [255, 255, 255]
        bgc = bgc.slice(0, 3)
        const bg = lum(bgc)
        return (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05)
    })
    ok('placeholder contraste >= 4.5:1', phRatio >= 4.5, `${phRatio.toFixed(2)}:1`)
}

ok('aucune erreur console', errors.length === 0, errors[0])

await browser.close()
console.log(`\n${pass} PASS, ${fail} FAIL, ${na} N-A`)
process.exit(fail ? 1 : 0)
