#!/usr/bin/env node
// login.mjs — connecte kavita-web via le vrai formulaire et stocke storageState
// (auth.json) a cote du script. Le JWT tient dans localStorage 'kavita-user'.
// Usage : node login.mjs <baseUrl> [storageStateOut] [user] [pass]
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const base = process.argv[2];
const out = process.argv[3] || path.join(path.dirname(fileURLToPath(import.meta.url)), "auth.json");
const user = process.argv[4] || "kv45admin";
const pass = process.argv[5] || "Kv45-Admin!Pass";
if (!base) { console.error("usage: node login.mjs <baseUrl> [out] [user] [pass]"); process.exit(2); }

const browser = await chromium.launch();
const page = await (await browser.newContext({ locale: 'en-US' })).newPage();
try {
  const resp = await page.goto(base + "/login", { waitUntil: "domcontentloaded", timeout: 45000 });
  if (!resp || resp.status() >= 400) throw new Error("login page HTTP " + (resp && resp.status()));
  // Angular SPA : attendre le formulaire monte (hydratation, lecon 34)
  await page.waitForSelector("#username", { state: "visible", timeout: 30000 });
  await page.fill("#username", user);
  await page.fill("#password", pass);
  await page.locator("button[type=submit]").click();
  // verification forte : kavita-user avec token en localStorage + sortie de /login
  await page.waitForFunction(() => {
    try {
      const raw = localStorage.getItem("kavita-user");
      if (!raw) return false;
      const u = JSON.parse(raw);
      return !!u && typeof u.token === "string" && u.token.length > 20;
    } catch { return false; }
  }, { timeout: 30000 });
  await page.waitForTimeout(2500);
  if (page.url().includes("/login")) throw new Error("auth KO — toujours sur /login");
  await page.context().storageState({ path: out });
  console.log("OK storageState ecrit dans", out, "| url:", page.url());
} finally {
  await browser.close();
}
