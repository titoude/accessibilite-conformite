// verify.mjs — assertions déterministes post-corrections (NginxProxyManager cycle #5)
// Usage: node verify.mjs http://localhost:5173
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://localhost:5173'
const failures = []
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ' :: ' + detail : ''}`)
  if (!cond) failures.push(name)
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ storageState: 'auth.json' })
const page = await ctx.newPage()

const unnamedControls = () => page.evaluate(() => ({
  buttons: [...document.querySelectorAll('button')].filter(
    (b) => b.offsetParent !== null && !b.getAttribute('aria-label') && !b.getAttribute('aria-labelledby') && !b.title && b.textContent.trim() === ''
  ).length,
  selects: [...document.querySelectorAll('select')].filter(
    (s) => s.offsetParent !== null && !s.getAttribute('aria-label') && !s.getAttribute('aria-labelledby') && !s.id
  ).length
}))

// ---------- page /login ----------
await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector('#main-content', { timeout: 30000 })
await page.waitForTimeout(1200)

const lg = await page.evaluate(() => ({
  mains: document.querySelectorAll('main').length,
  mainId: !!document.getElementById('main-content'),
  h1s: document.querySelectorAll('h1').length,
  skip: !!document.querySelector('a[href="#main-content"]')
}))
check('login: exactly one <main id=main-content>', lg.mains === 1 && lg.mainId, `mains=${lg.mains}`)
check('login: skip link present', lg.skip)
check('login: h1 present', lg.h1s >= 1, `h1s=${lg.h1s}`)

// ---------- pages applicatives ----------
for (const url of ['/', '/nginx/proxy', '/nginx/redirection', '/nginx/404', '/nginx/stream', '/certificates', '/access', '/users', '/audit-log', '/logs', '/settings']) {
  await page.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('h1', { timeout: 30000 })
  await page.waitForTimeout(900)

  const r = await page.evaluate(() => ({
    mains: document.querySelectorAll('main').length,
    mainId: !!document.getElementById('main-content'),
    h1s: document.querySelectorAll('h1').length,
    skip: !!document.querySelector('a[href="#main-content"]'),
    navLabel: document.querySelector('nav.navbar-expand-md')?.getAttribute('aria-label') ?? null,
    dupBanners: document.querySelectorAll('header').length,
    emptyThs: [...document.querySelectorAll('th')].filter((t) => t.textContent.trim() === '' && !t.querySelector('.visually-hidden')).length
  }))
  const nc = await unnamedControls()

  check(`${url}: one <main id=main-content>`, r.mains === 1 && r.mainId, `mains=${r.mains}`)
  check(`${url}: skip link present`, r.skip)
  check(`${url}: h1 present`, r.h1s >= 1, `h1s=${r.h1s}`)
  check(`${url}: nav landmark labelled`, r.navLabel === 'Main navigation', String(r.navLabel))
  check(`${url}: exactly one <header> banner`, r.dupBanners === 1, `headers=${r.dupBanners}`)
  check(`${url}: no unnamed visible buttons`, nc.buttons === 0, `${nc.buttons}`)
  check(`${url}: no unnamed visible selects`, nc.selects === 0, `${nc.selects}`)
  check(`${url}: no empty <th> without hidden label`, r.emptyThs === 0, `${r.emptyThs}`)
}

// ---------- modale proxy host : nom accessible + tablist ----------
await page.goto(BASE + '/nginx/proxy', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector('h1', { timeout: 30000 })
await page.waitForSelector('button.btn-lime:visible', { timeout: 20000 })
await page.click('button.btn-lime:visible')
await page.waitForSelector('.modal.show', { timeout: 15000 })
await page.waitForTimeout(900)

const mo = await page.evaluate(() => {
  const dlg = document.querySelector('.modal.show')
  const labelledby = dlg?.getAttribute('aria-labelledby')
  const titleEl = labelledby ? document.getElementById(labelledby) : null
  const tablist = dlg?.querySelector('[role="tablist"]')
  const tabs = tablist ? [...tablist.querySelectorAll('[role="tab"]')] : []
  return {
    labelledby,
    titleText: titleEl?.textContent.trim() ?? null,
    titleTag: titleEl?.tagName ?? null,
    tablist: !!tablist,
    tabCount: tabs.length,
    tabsNamed: tabs.filter((t) => (t.textContent.trim() || t.getAttribute('aria-label') || t.getAttribute('title'))).length,
    h3s: dlg?.querySelectorAll('h3').length ?? 0,
    h4h5: dlg?.querySelectorAll('h4, h5').length ?? 0,
    labelledInputs: [...dlg.querySelectorAll('input[id]')].filter((i) => {
      const id = i.id
      return document.querySelector(`label[for="${id}"], label [for="${id}"]`) || dlg.querySelector(`label[for="${id}"]`) || i.closest('label')
    }).length,
    totalInputs: dlg?.querySelectorAll('input[id]').length ?? 0
  }
})
check('modal: aria-labelledby resolves to a title', !!mo.labelledby && !!mo.titleText, `${mo.labelledby} -> ${mo.titleText}`)
check('modal: title is h2 (fits page h1 -> h2 -> h3 chain)', mo.titleTag === 'H2', mo.titleTag)
check('modal: tablist present', mo.tablist)
check('modal: tabs have names', mo.tabCount > 0 && mo.tabsNamed === mo.tabCount, `${mo.tabsNamed}/${mo.tabCount}`)
check('modal: no h4/h5 breaking heading order', mo.h4h5 === 0, `h4/h5=${mo.h4h5}, h3=${mo.h3s}`)

// react-select : inputId atteint l'input interne pour le htmlFor du label
const rs = await page.evaluate(() => {
  const sel = document.querySelector('#domainNames')
  return { exists: !!sel, tag: sel?.tagName ?? null, type: sel?.getAttribute('type') ?? null }
})
check('modal: react-select input reachable by label htmlFor (#domainNames)', rs.exists && rs.tag === 'INPUT', `${rs.tag} ${rs.type}`)

await browser.close()
console.log(`\n${failures.length === 0 ? 'VERIFY OK — all assertions passed' : `VERIFY FAILED — ${failures.length} assertion(s): ${failures.join(', ')}`}`)
process.exit(failures.length === 0 ? 0 : 1)
