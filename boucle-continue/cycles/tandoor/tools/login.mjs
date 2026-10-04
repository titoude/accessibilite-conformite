// login.mjs — capture storageState après login Django (allauth: login+password)
// Usage: node login.mjs http://localhost:8000
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://localhost:8000'
const browser = await chromium.launch()
const ctx = await browser.newContext()
const page = await ctx.newPage()

await page.goto(BASE + '/accounts/login/', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.fill('input[name="login"]', 'admin')
await page.fill('input[name="password"]', 'adminpass123')
await Promise.all([
  page.waitForNavigation({ timeout: 30000 }).catch(() => null),
  page.click('button[type="submit"]')
])
await page.waitForTimeout(2500)
const url = page.url()
console.log('post-login URL:', url)
if (url.includes('/accounts/login/')) {
  console.log('LOGIN FAILED — still on login page')
  process.exit(2)
}
await ctx.storageState({ path: 'auth.json' })
console.log('storageState -> tools/auth.json')
await browser.close()
