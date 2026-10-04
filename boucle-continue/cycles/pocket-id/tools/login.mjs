// Login pocket-id via authentificateur WebAuthn virtuel (CDP) + passkey seedée (tim, admin).
// Produit auth.json (storage state Playwright) pour audit.mjs --storage-state.
import { chromium } from 'playwright';

const BASE = process.env.A11Y_BASE || 'http://localhost:1411';

// Passkey seedée par /api/test/reset (tests/data.ts upstream)
const passkey = {
  credentialId: 'test-credential-tim',
  userHandle: 'f4b89dc2-62fb-46bf-9f5f-c34f4eafe93e',
  privateKey:
    'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg3rNKkGApsEA1TpGiphKh6axTq3Vh6wBghLLea/YkIp+hRANCAATBw6jkpXXr0pHrtAQetxiR5cTcILG/YGDCdKrhVhNDHIu12YrF6B7Frwl3AUqEpdrYEwj3Fo3XkGgvrBIJEUmG',
};

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const client = await context.newCDPSession(page);
await client.send('WebAuthn.enable');
const { authenticatorId } = await client.send('WebAuthn.addVirtualAuthenticator', {
  options: {
    protocol: 'ctap2',
    transport: 'internal',
    hasResidentKey: true,
    hasUserVerification: true,
    isUserVerified: true,
  },
});
await client.send('WebAuthn.addCredential', {
  authenticatorId,
  credential: {
    credentialId: Buffer.from(passkey.credentialId).toString('base64'),
    isResidentCredential: true,
    rpId: 'localhost',
    privateKey: passkey.privateKey,
    userHandle: Buffer.from(passkey.userHandle).toString('base64'),
    signCount: Math.round((Date.now() - 1704444610871) / 1000 / 2),
  },
});

await page.goto(`${BASE}/login`);
await page.getByRole('button', { name: 'Authenticate' }).click();
await page.waitForURL('**/settings/**', { timeout: 15000 });
await page.waitForLoadState('networkidle');
await context.storageState({ path: 'auth.json' });
console.log('auth.json écrit — connecté en tim (admin)');
await browser.close();
