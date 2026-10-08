#!/usr/bin/env node
// login.mjs — connecte jellyfin-web via le vrai formulaire et stocke storageState
// (auth.json) à côté du script. Les credentials tiennent en localStorage
// (jellyfin_credentials) — storageState les capture.
// Usage : node login.mjs <baseUrl> [storageStateOut] [user] [pass]
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const base = process.argv[2];
const out = process.argv[3] || path.join(path.dirname(fileURLToPath(import.meta.url)), "auth.json");
const user = process.argv[4] || "root";
const pass = process.argv[5] || "devin-a11y-41";
if (!base) { console.error("usage: node login.mjs <baseUrl> [out] [user] [pass]"); process.exit(2); }

const browser = await chromium.launch();
const page = await browser.newPage();
try {
  const resp = await page.goto(base + "/web/index.html#/login", { waitUntil: "domcontentloaded", timeout: 45000 });
  if (!resp || resp.status() >= 400) throw new Error("login page HTTP " + (resp && resp.status()));
  // le SPA hache vers #/login?serverid=... — attendre le formulaire monté
  await page.waitForSelector("#txtManualName", { state: "visible", timeout: 30000 });
  await page.fill("#txtManualName", user);
  await page.fill("#txtManualPassword", pass);
  await page.locator("button.button-submit").click();
  // le client redirige vers #/home une fois authentifié
  await page.waitForSelector("#indexPage:not(.hide), .homePage, .libraryPage", { state: "attached", timeout: 30000 });
  await page.waitForFunction(() => {
    try {
      const raw = localStorage.getItem("jellyfin_credentials");
      if (!raw) return false;
      const c = JSON.parse(raw);
      return Array.isArray(c.Servers) && c.Servers.length > 0 && !!c.Servers[0].AccessToken;
    } catch { return false; }
  }, { timeout: 15000 });
  // vérification forte : une page auth ne reboucle pas vers #/login
  await page.waitForTimeout(2500);
  if (page.url().includes("#/login")) throw new Error("auth KO — toujours sur #/login");
  await page.context().storageState({ path: out });
  console.log("OK storageState écrit dans", out, "| url:", page.url());
} finally {
  await browser.close();
}
