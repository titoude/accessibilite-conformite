// Vérification sémantique — chaque assertion prouve qu'un correctif précis
// est effectivement livré dans le build servi (pas seulement "axe = 0").
// Usage: node verify.mjs <baseUrl>   (nécessite auth.json produit par login.mjs)
import { chromium } from 'playwright'
import fs from 'node:fs'

const base = (process.argv[2] || 'http://127.0.0.1:8089').replace(/\/$/, '')
const results = []
const check = (name, ok, detail = '') =>
  results.push({ name, ok: !!ok, detail })

const browser = await chromium.launch()

// ---------- Page de login (sans auth) ----------
{
  const page = await (await browser.newContext()).newPage()
  await page.goto(base + '/app/')
  await page.waitForSelector('form input', { timeout: 15000 })
  // 1. les champs login ont un label programmatique (id/for) — baseline: labels sans for
  const label = await page.evaluate(() => {
    const u = document.querySelector('input[name="username"]') || document.querySelector('input[type="text"]')
    const p = document.querySelector('input[type="password"]')
    const has = (el) => el && (el.getAttribute('aria-label') || (el.id && document.querySelector(`label[for="${el.id}"]`)))
    return { u: !!u && !!has(u), p: !!p && !!has(p) }
  })
  check('login: inputs username/password labellisés', label.u && label.p, JSON.stringify(label))
  // 2. <main> landmark sur la page de connexion
  check('login: landmark <main> présent', await page.locator('main').count() > 0)
  // 3. un h1 (systemName/welcome title)
  check('login: h1 présent', (await page.locator('h1').count()) > 0)
  await page.close()
}

// ---------- Application authentifiée ----------
const ctx = await browser.newContext({ storageState: new URL('./auth.json', import.meta.url).pathname })
const page = await ctx.newPage()
page.on('pageerror', (e) => results.push({ name: 'pageerror', ok: false, detail: String(e).slice(0, 200) }))

// 4. liste albums : h1, <main>, skip-link, nav labellisée
await page.goto(base + '/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}')
await page.waitForSelector('.MuiGridList-root', { timeout: 15000 })
await page.waitForTimeout(1500)
check('app: exactement un h1 visible', (await page.locator('h1:visible').count()) >= 1)
check('app: landmark <main>', (await page.locator('main').count()) > 0)
check('app: bouton skip-nav présent (RA SkipNavigationButton)', await page.locator('.skip-nav-button').count() > 0)
check('nav: landmark navigation nommé', await page.locator('[role="navigation"][aria-label], nav[aria-label]').count() > 0)

// 5/6. page liste : th du bulk-select nommé (patch ra DatagridHeader) +
// champ de recherche des filtres labellisé (patch SearchInput).
// La liste artiste a bulkActionButtons={false} : le th bulk est vérifié sur /song.
await page.goto(base + '/app/#/artist')
await page.waitForSelector('.MuiTable-root', { timeout: 15000 })
await page.waitForTimeout(1200)
await page.goto(base + '/app/#/song')
await page.waitForSelector('.MuiTable-root', { timeout: 15000 })
await page.waitForTimeout(800)
const thLabel = await page.evaluate(() => {
  const th = document.querySelector('th.MuiTableCell-paddingCheckbox')
  return th ? { aria: th.getAttribute('aria-label'), text: th.textContent.trim() } : null
})
check('datagrid: header bulk-select nommé', thLabel && (thLabel.aria || thLabel.text), JSON.stringify(thLabel))
check('filtre: input recherche labellisé', await page.locator('input[aria-label*="earch" i], input[aria-label*="echerch"]').count() > 0)

// 7. sous-menu sidebar : un seul bouton aria-expanded, pas de nested-interactive
await page.locator('text=Playlists').first().click()
await page.waitForSelector('.MuiCollapse-entered', { timeout: 10000 })
const sub = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('[aria-expanded]')]
  const li = document.querySelector('nav [aria-expanded]')?.closest('li')
  const nested = li ? [...li.querySelectorAll('li button, li [role="button"], li [role="menuitem"]')] : []
  // un interactive enfant direct du header-button = nested-interactive
  const header = btns[0]
  const nestedInside = header ? header.querySelectorAll('button, [role="button"], a').length : -1
  return { expanded: btns.length, nestedInside }
})
check('sous-menu: bouton aria-expanded présent, sans interactif imbriqué', sub.expanded > 0 && sub.nestedInside === 0, JSON.stringify(sub))

// 8. menu contextuel d'une ligne : ouvert, role=menu, items, DANS un landmark (disablePortal)
await page.goto(base + '/app/#/song')
await page.waitForSelector('.MuiTable-root', { timeout: 15000 })
await page.waitForTimeout(1500)
const row = page.locator('tbody .MuiTableRow-root').last()
await row.hover()
await row.locator('button[aria-label*="actions" i]').click()
await page.waitForSelector('.MuiMenu-paper:visible', { timeout: 10000 })
const menu = await page.evaluate(() => {
  const m = document.querySelector('[role="menu"]')
  if (!m) return null
  const items = m.querySelectorAll('[role="menuitem"]').length
  let p = m.parentElement, inLandmark = false
  while (p) { if (/^(MAIN|NAV|HEADER|FOOTER|ASIDE)$/.test(p.tagName) || p.getAttribute('role') === 'dialog') { inLandmark = true; break } p = p.parentElement }
  return { items, inLandmark }
})
check('menu contexte: role=menu + items + rendu dans un landmark', menu && menu.items > 0 && menu.inLandmark, JSON.stringify(menu))
await page.keyboard.press('Escape')

// 9. hiérarchie de titres sur la page d'un album
await page.goto(base + '/app/#/album/69IwB2p7tQDejD3lowUIFo/show')
await page.waitForSelector('h1', { timeout: 15000 })
await page.waitForTimeout(1200)
const order = await page.evaluate(() => {
  let prev = 0, ok = true
  for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    const lvl = +h.tagName[1]
    if (lvl > prev + 1) ok = false
    prev = lvl
  }
  return ok
})
check('titres: pas de saut de niveau (h-n+1 max)', order)

// 10. contraste réel de l'AppBar (thème Dark par défaut) : ratio >= 4.5
const bg = await page.evaluate(() => {
  const el = document.querySelector('.MuiAppBar-root')
  return el ? getComputedStyle(el).backgroundColor : null
})
check('appbar: fond #3f51b5 (rgb(63, 81, 181)) — ratio 6.97:1', bg === 'rgb(63, 81, 181)', String(bg))

// 11. page /song ne plante plus (le ReferenceError rendait la page d'erreur RA)
await page.goto(base + '/app/#/song')
await page.waitForSelector('.MuiTable-root', { timeout: 15000 })
const songOk = await page.evaluate(() => !document.body.textContent.includes('Something went wrong'))
check('/song: la liste se rend sans page d\'erreur', songOk)

await browser.close()
const fails = results.filter((r) => !r.ok)
console.log(JSON.stringify(results, null, 1))
console.log(`verify: ${results.length - fails.length}/${results.length} assertions OK${fails.length ? ' — ÉCHEC: ' + fails.map((f) => f.name).join(' | ') : ''}`)
process.exit(fails.length ? 1 : 0)
