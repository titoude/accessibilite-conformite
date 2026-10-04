// Évaluation finale INDÉPENDANTE — contrôles jamais utilisés pendant la
// correction : ils ne peuvent pas avoir été "appris" par la boucle de fix.
// Usage: node eval-final.mjs <baseUrl>   (nécessite auth.json produit par login.mjs)
import { chromium } from 'playwright'

const base = (process.argv[2] || 'http://127.0.0.1:8089').replace(/\/$/, '')
const results = []
const check = (name, ok, detail = '') =>
  results.push({ name, ok: !!ok, detail })

const browser = await chromium.launch()
const ctx = await browser.newContext({ storageState: new URL('./auth.json', import.meta.url).pathname })
const page = await ctx.newPage()

// 1. Attribut lang du document (WCAG 3.1.1) — jamais touché
await page.goto(base + '/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}')
await page.waitForSelector('.MuiGridList-root', { timeout: 15000 })
const lang = await page.evaluate(() => document.documentElement.lang)
check('3.1.1: html[lang] renseigné', lang && lang.length >= 2, lang)

// 2. Le menu contextuel se ferme à Échap et rend le focus au déclencheur (2.1.2/2.4.3)
await page.goto(base + '/app/#/song')
await page.waitForSelector('.MuiTable-root', { timeout: 15000 })
await page.waitForTimeout(1500)
const row = page.locator('tbody .MuiTableRow-root').last()
await row.hover()
const trigger = row.locator('button[aria-label*="actions" i]')
await trigger.click()
await page.waitForSelector('.MuiMenu-paper:visible', { timeout: 10000 })
await page.keyboard.press('Escape')
await page.waitForTimeout(600)
const esc = await page.evaluate(() => {
  const openMenu = [...document.querySelectorAll('.MuiMenu-paper')].some((m) => getComputedStyle(m).visibility === 'visible')
  return { openMenu, focusTag: document.activeElement?.tagName }
})
check('2.1.2: Échap ferme le menu (pas de piège clavier)', !esc.openMenu, JSON.stringify(esc))

// 3. Reflow : à 320px de large, pas de scroll horizontal global (WCAG 1.4.10)
await page.setViewportSize({ width: 320, height: 800 })
await page.goto(base + '/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}')
await page.waitForSelector('.MuiGridList-root', { timeout: 15000 })
await page.waitForTimeout(1000)
const reflow = await page.evaluate(() => {
  const d = document.scrollingElement
  return { sw: d.scrollWidth, vw: document.documentElement.clientWidth }
})
check('1.4.10: pas de scroll horizontal à 320px', reflow.sw <= reflow.vw + 1, JSON.stringify(reflow))
await page.setViewportSize({ width: 1280, height: 800 })

// 4. Formulaire en erreur : login vide doit produire un retour accessible
{
  const p2 = await (await browser.newContext()).newPage()
  await p2.goto(base + '/app/')
  await p2.waitForSelector('form input', { timeout: 15000 })
  await p2.locator('button[type="submit"], form button').first().click()
  await p2.waitForTimeout(1500)
  const err = await p2.evaluate(() => {
    const alert = document.querySelector('[role="alert"], .Mui-error, [aria-live]')
    const invalid = document.querySelector('[aria-invalid="true"]')
    return { alert: !!alert, invalid: !!invalid, text: alert?.textContent?.slice(0, 80) }
  })
  check('3.3.1: erreur de formulaire annoncée (alert/invalid)', err.alert || err.invalid, JSON.stringify(err))
  await p2.close()
}

// 5. Visibilité du focus clavier : un élément focusé a un indicateur
await page.goto(base + '/app/#/album/recentlyAdded?sort=recently_added&order=DESC&filter={}')
await page.waitForSelector('.MuiGridList-root', { timeout: 15000 })
await page.waitForTimeout(800)
// Le premier Tab peut rester sur BODY juste après un resize/navigation :
// on avance jusqu'à un vrai élément focusable (5 essais max).
let focus = { tag: 'BODY', fv: false, outline: 'none' }
for (let i = 0; i < 5 && focus.tag === 'BODY'; i++) {
  await page.keyboard.press('Tab')
  await page.waitForTimeout(300)
  focus = await page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return { tag: 'BODY', fv: false, outline: 'none' }
    const s = getComputedStyle(el)
    return { tag: el.tagName, fv: el.className.includes('Mui-focusVisible'), outline: s.outlineStyle, ow: s.outlineWidth }
  })
}
check('2.4.7: indicateur de focus présent (Mui-focusVisible/outline)',
  (focus.tag !== 'BODY' && focus.tag !== 'HTML') && (focus.fv || focus.outline !== 'none'),
  JSON.stringify(focus))

// 6. Images du contenu : alt ou aria-hidden (1.1.1, sur la grille d'albums)
const imgs = await page.evaluate(() => {
  const bad = [...document.querySelectorAll('.MuiGridListTile-root img, main img')]
    .filter((i) => !i.hasAttribute('alt') && i.getAttribute('aria-hidden') !== 'true')
  return { bad: bad.length, total: document.querySelectorAll('main img, .MuiGridListTile-root img').length }
})
check('1.1.1: images du contenu avec alt/aria-hidden', imgs.bad === 0, JSON.stringify(imgs))

await browser.close()
const fails = results.filter((r) => !r.ok)
console.log(JSON.stringify(results, null, 1))
console.log(`eval-final: ${results.length - fails.length}/${results.length} OK${fails.length ? ' — ÉCHEC: ' + fails.map((f) => f.name).join(' | ') : ''}`)
process.exit(fails.length ? 1 : 0)
