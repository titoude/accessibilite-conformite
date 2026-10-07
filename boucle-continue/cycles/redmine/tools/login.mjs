#!/usr/bin/env node
// login.mjs — connecte Redmine et stocke storageState (auth.json) à côté du script.
// Usage : node login.mjs <baseUrl> [storageStateOut] [user] [pass]
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const base = process.argv[2];
const out = process.argv[3] || path.join(path.dirname(fileURLToPath(import.meta.url)), "auth.json");
const user = process.argv[4] || "admin";
const pass = process.argv[5] || "redmine40-pw";
if (!base) { console.error("usage: node login.mjs <baseUrl> [out] [user] [pass]"); process.exit(2); }

const browser = await chromium.launch();
const page = await browser.newPage();
try {
  const resp = await page.goto(base + "/login", { waitUntil: "domcontentloaded", timeout: 30000 });
  if (!resp || resp.status() >= 400) throw new Error("login page HTTP " + (resp && resp.status()));
  await page.fill("#username", user);
  await page.fill("#password", pass);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null),
    page.click('input[name="login"]'),
  ]);
  // Redmine redirige vers /my/page après login ; la racine peut aussi déjà être authentifiée
  const probes = ["/my/page", "/projects/office-website/issues", "/"];
  let authed = false;
  for (const p of probes) {
    const r = await page.goto(base + p, { waitUntil: "domcontentloaded", timeout: 15000 });
    const stillLogin = page.url().includes("/login");
    if (r && r.ok() && !stillLogin) { authed = true; break; }
  }
  if (!authed) throw new Error("auth vérif KO — toujours redirigé vers /login");
  await page.context().storageState({ path: out });
  console.log("OK storageState écrit dans", out);
} finally {
  await browser.close();
}
