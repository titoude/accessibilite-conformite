// login.mjs — crée auth.json (storageState) pour Memos : sign-in UI + token localStorage + cookie refresh.
import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const base = process.argv[2] || 'http://localhost:3001'
const browser = await chromium.launch()
const ctx = await browser.newContext()
const page = await ctx.newPage()

// sign-in via l'API puis injection du token localStorage (même mécanisme que le SPA)
const resp = await page.request.post(base + '/api/v1/auth/signin', {
    data: { passwordCredentials: { username: 'admin', password: 'adminpass123' } },
})
if (!resp.ok()) { console.error('signin failed', resp.status(), await resp.text()); process.exit(2) }
const body = await resp.json()
// le cookie refresh arrive en Grpc-Metadata-Set-Cookie → poser le vrai cookie
const meta = resp.headers()['grpc-metadata-set-cookie']
if (meta) {
    const m = /memos_refresh=([^;]+)/.exec(meta)
    if (m) await ctx.addCookies([{ name: 'memos_refresh', value: decodeURIComponent(m[1]), url: base }])
}
await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
await page.evaluate(([t, e]) => {
    localStorage.setItem('memos_access_token', t)
    localStorage.setItem('memos_token_expires_at', e)
}, [body.accessToken, body.accessTokenExpiresAt])
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForTimeout(2000)
const state = await ctx.storageState()
writeFileSync('auth.json', JSON.stringify(state, null, 2))
console.log('auth.json écrit — url:', page.url())
await browser.close()
