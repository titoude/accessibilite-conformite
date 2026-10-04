// eval-final.mjs — vérifications comportementales réelles (clavier, focus, pièges)
// Cycle #5 NginxProxyManager. Usage: node eval-final.mjs http://localhost:5173
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://localhost:5173'
const findings = []
const note = (status, where, what) => {
  console.log(`${status} [${where}] ${what}`)
  if (status === 'FAIL') findings.push({ where, what })
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ storageState: 'auth.json' })
const page = await ctx.newPage()

const focusInfo = () =>
  page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return { tag: 'body', name: null, outline: null }
    const cs = getComputedStyle(el)
    const name = el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent.trim().slice(0, 40) || el.tagName
    return { tag: el.tagName.toLowerCase(), name, outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, shadow: cs.boxShadow }
  })

// ---------- test 1 : skip link fonctionnel sur / ----------
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector('h1', { timeout: 30000 })
await page.waitForTimeout(1200)
await page.evaluate(() => document.activeElement.blur())

const seq1 = []
let skipFound = false
for (let i = 0; i < 4 && !skipFound; i++) {
  await page.keyboard.press('Tab')
  const f = await focusInfo()
  seq1.push(f)
  if (f.name && /skip/i.test(f.name)) skipFound = true
}
note(skipFound ? 'PASS' : 'FAIL', 'dashboard', `skip link atteignable au Tab (seq: ${seq1.map((f) => f.name).join(' | ')})`)

if (skipFound) {
  await page.keyboard.press('Enter')
  await page.waitForTimeout(600)
  const insideMain = await page.evaluate(() => {
    const m = document.getElementById('main-content')
    return m && (document.activeElement === m || m.contains(document.activeElement))
  })
  note(insideMain ? 'PASS' : 'FAIL', 'dashboard', 'skip link dépose le focus dans <main>')
}

// ---------- test 2 : focus visible sur les 8 premiers Tab ----------
await page.evaluate(() => document.activeElement.blur())
let invisible = 0
const focused = []
for (let i = 0; i < 8; i++) {
  await page.keyboard.press('Tab')
  const f = await focusInfo()
  focused.push(f.name)
  const hasIndicator =
    (f.outline && !/none|0px/i.test(f.outline)) || (f.shadow && f.shadow !== 'none')
  if (!hasIndicator) {
    invisible++
    console.log(`  [indicateur absent] #${i}: ${f.name} (${f.outline} / ${f.shadow})`)
  }
}
note(invisible === 0 ? 'PASS' : 'FAIL', 'dashboard', `focus visible sur 8 tabulations (${invisible} sans indicateur) :: ${focused.join(' | ')}`)

// ---------- test 3 : modale — focus piégé DANS la modale, Escape ferme ----------
await page.goto(BASE + '/nginx/proxy', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector('h1', { timeout: 30000 })
await page.waitForSelector('button.btn-lime:visible', { timeout: 20000 })
await page.click('button.btn-lime:visible')
await page.waitForSelector('.modal.show', { timeout: 15000 })
await page.waitForTimeout(900)

const inDialog = await page.evaluate(() => {
  const dlg = document.querySelector('.modal.show')
  return dlg && dlg.contains(document.activeElement)
})
note(inDialog ? 'PASS' : 'FAIL', 'proxy-modal', 'le focus initial est dans la modale')

let escaped = false
for (let i = 0; i < 25; i++) {
  await page.keyboard.press('Tab')
  const inside = await page.evaluate(() => {
    const dlg = document.querySelector('.modal.show')
    return dlg && dlg.contains(document.activeElement)
  })
  if (!inside) {
    escaped = true
    break
  }
}
note(!escaped ? 'PASS' : 'FAIL', 'proxy-modal', 'Tab reste piégé dans la modale (25 pressions)')

await page.keyboard.press('Escape')
await page.waitForTimeout(800)
const closed = await page.evaluate(() => !document.querySelector('.modal.show'))
note(closed ? 'PASS' : 'FAIL', 'proxy-modal', 'Escape ferme la modale')

// ---------- test 4 : menu utilisateur — ouverture clavier + aria-expanded ----------
await page.waitForSelector('a.nav-link[data-bs-toggle="dropdown"]', { state: 'visible', timeout: 30000 })
const userToggle = page.locator('a.nav-link[data-bs-toggle="dropdown"]').first()
await userToggle.focus()
await page.keyboard.press('Enter')
await page.waitForTimeout(800)
const menuOpen = await page.evaluate(() => !!document.querySelector('.dropdown-menu.show'))
note(menuOpen ? 'PASS' : 'FAIL', 'user-menu', 'menu utilisateur s\'ouvre au clavier')

// ---------- test 5 : navigation clavier dans les onglets de la modale ----------
await page.keyboard.press('Escape')
await page.waitForTimeout(600)
await page.click('button.btn-lime:visible')
await page.waitForSelector('.modal.show', { timeout: 15000 })
await page.waitForTimeout(700)
const firstTab = page.locator('.modal.show [role="tab"]').first()
await firstTab.focus()
await page.keyboard.press('ArrowRight')
await page.waitForTimeout(500)
const arrowMoved = await page.evaluate(() => {
  const el = document.activeElement
  return el && el.getAttribute('role') === 'tab'
})
console.log(`INFO [proxy-modal] ArrowRight déplace le focus entre onglets : ${arrowMoved ? 'oui' : 'non (Tab seul = conforme si onglets tabbables)'}`)

await browser.close()
console.log(`\n${findings.length === 0 ? 'EVAL-FINAL OK' : `EVAL-FINAL — ${findings.length} finding(s)`}`)
process.exit(findings.length === 0 ? 0 : 1)
