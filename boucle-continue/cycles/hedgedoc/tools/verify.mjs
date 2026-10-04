// verify.mjs — assertions déterministes post-corrections (HedgeDoc cycle #4)
// Usage: node verify.mjs http://localhost:3002
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://localhost:3002'
const failures = []
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ' :: ' + detail : ''}`)
  if (!cond) failures.push(name)
}

const browser = await chromium.launch()
const page = await browser.newPage()

const provisionGuest = async () => {
  await page.evaluate(async () => {
    const t = await (await fetch('/api/private/csrf/token', { credentials: 'same-origin' })).json()
    await fetch('/api/private/auth/guest/register', {
      method: 'POST',
      headers: { 'csrf-token': t.token },
      credentials: 'same-origin'
    })
  })
}

// ---------- pages statiques ----------
for (const url of ['/login', '/about', '/cheatsheet', '/explore/public']) {
  await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.waitForSelector('nav, h1, h2, h3, h4, h5, button', { timeout: 60000 })
  await page.waitForTimeout(1500)

  const r = await page.evaluate(() => ({
    mains: document.querySelectorAll('main').length,
    mainId: !!document.getElementById('main-content'),
    h1s: document.querySelectorAll('h1').length,
    skip: document.querySelector('a[href="#main-content"]') !== null,
    unnamedButtons: [...document.querySelectorAll('button')].filter(
      (b) =>
        b.offsetParent !== null &&
        !b.getAttribute('aria-label') &&
        !b.getAttribute('aria-labelledby') &&
        !b.title &&
        b.textContent.trim() === ''
    ).length,
    unnamedLinks: [...document.querySelectorAll('a[href]')].filter(
      (a) =>
        a.offsetParent !== null &&
        !a.getAttribute('aria-label') &&
        !a.getAttribute('aria-labelledby') &&
        !a.title &&
        a.textContent.trim() === ''
    ).length
  }))

  check(`${url}: exactly one <main> with id=main-content`, r.mains === 1 && r.mainId, `mains=${r.mains}`)
  check(`${url}: skip link present`, r.skip)
  check(`${url}: at least one h1`, r.h1s >= 1, `h1s=${r.h1s}`)
  check(`${url}: no unnamed visible buttons`, r.unnamedButtons === 0, `${r.unnamedButtons} unnamed`)
  check(`${url}: no unnamed visible links`, r.unnamedLinks === 0, `${r.unnamedLinks} unnamed`)
}

// ---------- état éditeur ----------
await page.goto(BASE + '/n/demo', { waitUntil: 'domcontentloaded', timeout: 120000 })
await page.waitForTimeout(2000)
await provisionGuest()
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForSelector('.cm-editor', { timeout: 120000 })
await page.waitForTimeout(2000)

const ed = await page.evaluate(() => ({
  mains: document.querySelectorAll('main').length,
  h1s: document.querySelectorAll('h1').length,
  cmLabel: document.querySelector('.cm-content')?.getAttribute('aria-label') ?? null,
  sidebarRole: document.getElementById('editor-sidebar')?.getAttribute('role') ?? null,
  splitterChildren: [...(document.getElementById('editor-splitter')?.children ?? [])].filter(
    (e) => e.tagName === 'BUTTON' || e.tagName === 'A' || e.tabIndex >= 0
  ).length,
  splitterButtonsLabelled: [...document.querySelectorAll('#editor-splitter ~ * button, .wrapper button')].every(
    (b) => b.getAttribute('aria-label')
  ),
  iframeTitle: document.querySelector('iframe')?.title ?? null
}))

check('editor: one <main>', ed.mains === 1, `mains=${ed.mains}`)
check('editor: h1 present (note title)', ed.h1s >= 1)
check('editor: .cm-content has aria-label', !!ed.cmLabel, String(ed.cmLabel))
check('editor: sidebar is role=complementary', ed.sidebarRole === 'complementary', String(ed.sidebarRole))
check('editor: no interactive children inside role=separator', ed.splitterChildren === 0, `${ed.splitterChildren}`)
check('editor: splitter buttons labelled', ed.splitterButtonsLabelled)
check('editor: renderer iframe titled', !!ed.iframeTitle, ed.iframeTitle)

await browser.close()
console.log(`\n${failures.length === 0 ? 'VERIFY OK — all assertions passed' : `VERIFY FAILED — ${failures.length} assertion(s): ${failures.join(', ')}`}`)
process.exit(failures.length === 0 ? 0 : 1)
