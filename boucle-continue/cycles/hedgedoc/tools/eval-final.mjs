// eval-final.mjs — vérifications comportementales réelles (clavier, focus, pièges)
// Indépendant de l'audit axe : teste ce que axe ne voit pas (PROTOCOLE règle "axe blind spots").
// Usage: node eval-final.mjs http://localhost:3002
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://localhost:3002'
const findings = []
const note = (status, where, what) => {
  console.log(`${status} [${where}] ${what}`)
  if (status === 'FAIL') findings.push({ where, what })
}

const browser = await chromium.launch()
const page = await browser.newPage()

const focusInfo = () =>
  page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return { tag: 'body', name: null, outline: null }
    const cs = getComputedStyle(el)
    const name = el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent.trim().slice(0, 40) || el.tagName
    return { tag: el.tagName.toLowerCase(), name, outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}` }
  })

const dismissModal = async () => {
  const dlg = page.locator('[role="dialog"]')
  if ((await dlg.count()) > 0) {
    const btn = dlg.locator('button:has-text("Dismiss"), button.btn-close, button:has-text("Close")').first()
    if ((await btn.count()) > 0) await btn.click()
    await page.waitForTimeout(600)
  }
}

// ---------- test 1 : skip link fonctionnel sur /login ----------
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 120000 })
await page.waitForSelector('nav, h1, h2, h3, h4, h5, button', { timeout: 60000 })
await page.waitForTimeout(1500)
await dismissModal()
await page.evaluate(() => document.activeElement.blur())

const seq1 = []
let skipFound = false
for (let i = 0; i < 3 && !skipFound; i++) {
  await page.keyboard.press('Tab')
  const f = await focusInfo()
  seq1.push(f)
  if (f.name && /skip/i.test(f.name)) skipFound = true
}
note(skipFound ? 'PASS' : 'FAIL', 'login', `skip link atteignable au Tab (seq: ${seq1.map((f) => f.name).join(' | ')})`)

if (skipFound) {
  await page.keyboard.press('Enter')
  await page.waitForTimeout(500)
  const insideMain = await page.evaluate(() => {
    const m = document.getElementById('main-content')
    return m && (document.activeElement === m || m.contains(document.activeElement))
  })
  note(insideMain ? 'PASS' : 'FAIL', 'login', 'skip link dépose le focus dans <main>')
}

// ---------- test 2 : focus visible sur les 8 premiers Tab ----------
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 120000 })
await page.waitForSelector('nav, h1, h2, h3, h4, h5, button')
await page.waitForTimeout(1200)
await dismissModal()
await page.evaluate(() => document.activeElement.blur())
let invisible = 0
const focused = []
for (let i = 0; i < 8; i++) {
  await page.keyboard.press('Tab')
  const f = await focusInfo()
  focused.push(f.name)
  const hasOutline = f.outline && !/none|0px/i.test(f.outline)
  const isVisibleIndicator = hasOutline || (await page.evaluate(() => {
    const el = document.activeElement
    const cs = getComputedStyle(el)
    return cs.boxShadow !== 'none' || cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px'
  }))
  if (!isVisibleIndicator) {
    invisible++
    console.log(`  [indicateur absent] #${i}: ${f.name} (${f.outline})`)
  }
}
note(invisible === 0 ? 'PASS' : 'FAIL', 'login', `focus visible sur 8 tabulations (${invisible} sans indicateur) :: ${focused.join(' | ')}`)

// ---------- test 3 : éditeur — piège clavier CodeMirror ----------
await page.goto(BASE + '/n/demo', { waitUntil: 'domcontentloaded', timeout: 120000 })
await page.waitForTimeout(2000)
await page.evaluate(async () => {
  const t = await (await fetch('/api/private/csrf/token', { credentials: 'same-origin' })).json()
  await fetch('/api/private/auth/guest/register', {
    method: 'POST',
    headers: { 'csrf-token': t.token },
    credentials: 'same-origin'
  })
})
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForSelector('.cm-editor', { timeout: 120000 })
await page.waitForTimeout(2500)
await dismissModal()

// focus direct dans le textbox puis Tab : le focus doit pouvoir SORTIR (pas de piège)
await page.locator('.cm-content').click()
await page.waitForTimeout(400)
const before = await focusInfo()
const exits = []
for (let i = 0; i < 40 && exits.length < 1; i++) {
  await page.keyboard.press('Tab')
  const f = await focusInfo()
  if (f.tag !== 'body' && !(await page.evaluate(() => document.activeElement?.closest('.cm-editor') !== null))) {
    exits.push(f)
    break
  }
  if (f.tag === 'body') break
}
note(
  exits.length > 0 ? 'PASS' : 'FAIL',
  'editor',
  `Tab sort du CodeMirror en <= 40 pressions (before=${before.name}, exit=${exits[0]?.name ?? 'none'})`
)

// Escape : doit sortir le focus de l'éditeur (geste d'échappement documenté)
await page.locator('.cm-content').click()
await page.waitForTimeout(300)
await page.keyboard.press('Escape')
await page.waitForTimeout(400)
const afterEsc = await page.evaluate(() => document.activeElement?.closest('.cm-editor') === null)
// INFO : WCAG 2.1.2 exige seulement qu'une sortie existe (Tab). Escape->blur = affordance bonus.
console.log(`INFO [editor] Escape blur editor : ${afterEsc ? 'oui' : 'non (Tab seul = conforme)'}`)

// ---------- test 4 : modale — focus piégé DANS la modale, Escape ferme ----------
await dismissModal()
const settingsBtn = page.locator('button[aria-label="Settings"]')
await settingsBtn.click()
await page.waitForSelector('[role="dialog"]', { timeout: 15000 })
await page.waitForTimeout(800)

const inDialog = await page.evaluate(() => {
  const dlg = document.querySelector('[role="dialog"]')
  return dlg && dlg.contains(document.activeElement)
})
note(inDialog ? 'PASS' : 'FAIL', 'settings-modal', 'le focus initial est dans la modale')

// Tab x20 : le focus ne doit jamais quitter la modale
let escaped = false
for (let i = 0; i < 20; i++) {
  await page.keyboard.press('Tab')
  const inside = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]')
    return dlg && dlg.contains(document.activeElement)
  })
  if (!inside) {
    escaped = true
    break
  }
}
note(!escaped ? 'PASS' : 'FAIL', 'settings-modal', 'Tab reste piégé dans la modale (20 pressions)')

await page.keyboard.press('Escape')
await page.waitForTimeout(800)
const closed = await page.evaluate(() => !document.querySelector('[role="dialog"]'))
note(closed ? 'PASS' : 'FAIL', 'settings-modal', 'Escape ferme la modale')

// ---------- test 5 : dropdown toolbar — aria-expanded + ouverture clavier ----------
const moreBtn = page.locator('button.dropdown-toggle[aria-label="More options"]').first()
const hasToggle = (await moreBtn.count()) > 0
if (hasToggle) {
  await moreBtn.focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(700)
  const expanded = await moreBtn.getAttribute('aria-expanded')
  note(expanded === 'true' ? 'PASS' : 'FAIL', 'toolbar-menu', `menu s'ouvre au clavier (aria-expanded=${expanded})`)
} else {
  note('FAIL', 'toolbar-menu', 'bouton More options introuvable')
}

await browser.close()
console.log(`\n${findings.length === 0 ? 'EVAL-FINAL OK' : `EVAL-FINAL — ${findings.length} finding(s)`}`)
process.exit(findings.length === 0 ? 0 : 1)
