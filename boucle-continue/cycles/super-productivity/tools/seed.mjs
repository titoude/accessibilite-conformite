/**
 * seed.mjs — seed déterministe super-productivity (cycle 51).
 * 100% UI-driven (pas de backend) : projets/tags via dialogs side-nav,
 * tâches via add-task-bar + short syntax (@today, #tag, +project, Nm).
 * Écrit seed-info.json (ids projets/tags résolus depuis les hrefs side-nav).
 *
 * Usage: node seed.mjs <baseUrl> [profileDir]
 *   profileDir : profil persistant Playwright (IndexedDB incluse).
 *                Défaut : ./seed-profile à côté de ce script.
 */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const HERE = dirname(fileURLToPath(import.meta.url));

const [base = 'http://localhost:9251/', profileDir = resolve(HERE, 'seed-profile')] = process.argv.slice(2);

const PROJECTS = ['audit-alpha', 'audit-beta'];
const TAGS = ['audit-urgent', 'audit-dom'];

// Tâches saisies depuis la vue Inbox ; l'affectation se fait en short-syntax
// inline (#tag, +projet, @échéance, Nm estimation) — pas de navigation.
// Chaque tâche porte un +projet explicite : le projectId de la barre est
// « sticky » (persiste entre saisies) — le + gagne à chaque parse.
const TASKS = [
  'Lire la spec RGPD 30m #audit-dom +audit-alpha',
  'Corriger le bug de scroll horizontal @tomorrow 45m #audit-urgent +audit-alpha',
  'Draft release notes v19.1 20m +audit-alpha',
  'Appeler le cabinet comptable @today 15m +audit-alpha',
  'Wireframes page paramètres 1h +audit-alpha',
  'Revue accessibilité clavier #audit-urgent @today 30m +audit-beta',
  'Benchmark concurrent Trello vs Todoist 50m +audit-beta',
  'Interview utilisateur pilote 45m +audit-beta',
  'Rédiger retrospective sprint 12 25m +audit-beta',
];

const ctx = await chromium.launchPersistentContext(profileDir, {
  locale: 'en-US',
  viewport: { width: 1280, height: 800 },
});
process.on('uncaughtException', async (e) => { console.error(e); await ctx.close().catch(() => {}); process.exit(1); });
const page = await ctx.newPage();
await page.addInitScript(() => {
  try {
    for (const k of ['SUP_ONBOARDING_PRESET_DONE', 'SUP_ONBOARDING_HINTS_DONE', 'SUP_IS_SHOW_TOUR', 'SUP_EXAMPLE_TASKS_CREATED', 'SUP_IS_PROJECT_LIST_EXPANDED', 'SUP_IS_TAG_LIST_EXPANDED']) {
      localStorage.setItem(k, 'true');
    }
  } catch {}
});

const ready = async () => {
  await page.waitForSelector('.route-wrapper', { timeout: 30000 });
  await page.waitForSelector('magic-side-nav nav-item', { timeout: 30000 });
  await page.waitForTimeout(1800);
};

await page.goto(`${base}/#/project/INBOX_PROJECT/tasks`, { waitUntil: 'load' });
await ready();

// -- projets + tags via dialogs side-nav (hover → additional-btn) --
const createGroup = async (label, items) => {
  const hdr = page.locator('.g-multi-btn-wrapper').filter({ hasText: label }).first();
  for (const name of items) {
    await hdr.hover();
    await page.waitForTimeout(300);
    // additional-btn = [show/hide, create folder?, create item]
    const btn = hdr.locator('.additional-btn').last();
    await btn.click();
    const dlg = page.locator('mat-dialog-container');
    await dlg.waitFor({ state: 'visible', timeout: 10000 });
    await dlg.locator('input').first().fill(name);
    await dlg.locator('button[type=submit], button:has-text("Save")').first().click();
    await dlg.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(800);
    const created = await page.evaluate((n) => document.querySelector('magic-side-nav')?.textContent.includes(n), name);
    console.log(`createGroup ${label} « ${name} » → ${created ? 'OK' : 'MISSING'}`);
  }
};
await createGroup('Projects', PROJECTS);
await createGroup('Tags', TAGS);
await ready();

// laisse le temps aux ops de se flusher dans SUP_OPS
await page.waitForTimeout(2500);

// -- résolution des ids via le journal d'ops SUP_OPS (déterministe, pas de nav) --
const ops = await page.evaluate(async () => new Promise((res) => {
  const r = indexedDB.open('SUP_OPS');
  r.onsuccess = () => {
    const db = r.result;
    const g = db.transaction('ops', 'readonly').objectStore('ops').getAll();
    g.onsuccess = () => { db.close(); res(g.result); };
    g.onerror = () => { db.close(); res([]); };
  };
  r.onerror = () => res([]);
}));
console.log(`ops lues: ${ops.length}`);
const seed = { projects: {}, tags: {} };
for (const o of ops) {
  const op = o.op;
  if (op?.o !== 'CRT') continue;
  if (op.e === 'PROJECT') {
    const p = op.p?.actionPayload?.project;
    if (p?.title && PROJECTS.includes(p.title)) seed.projects[p.title] = p.id;
  }
  if (op.e === 'TAG') {
    const t = op.p?.actionPayload?.tag;
    const nm = t?.title || t?.name;
    if (nm && TAGS.includes(nm)) seed.tags[nm] = t.id;
  }
}
if (Object.values(seed.projects).some((v) => !v) || Object.values(seed.tags).some((v) => !v)) {
  throw new Error(`seed: ids non résolus ${JSON.stringify(seed)}`);
}

// -- tâches via add-task-bar.global depuis la vue Inbox --
await page.goto(`${base}/#/project/INBOX_PROJECT/tasks`, { waitUntil: 'load' });
await ready();
const addTask = async (text) => {
  const input = page.locator('add-task-bar.global .main-input').first();
  if (!(await input.isVisible().catch(() => false))) {
    await page.locator('.tour-addBtn').first().click();
    await input.waitFor({ state: 'visible', timeout: 10000 });
  }
  await input.click();
  await input.fill(text);
  await page.locator('.e2e-add-task-submit').click();
  await page.waitForTimeout(700);
};
for (const t of TASKS) await addTask(t);

// -- une tâche faite pour densité DOM (sur la page projet alpha) --
await page.goto(`${base}/#/project/${seed.projects[PROJECTS[0]]}/tasks`, { waitUntil: 'load' });
await ready();
// replie la add-task-bar globale (son touch-target recouvre la 1re tâche)
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
const firstTask = page.locator('task').first();
await firstTask.scrollIntoViewIfNeeded();
await firstTask.hover({ position: { x: 20, y: 20 } });
const doneBtn = firstTask.locator('done-toggle').first();
if (await doneBtn.isVisible().catch(() => false)) await doneBtn.click();
await page.waitForTimeout(600);

// -- note via panneau notes (bouton header) --
const noteBtn = page.locator('.e2e-toggle-notes-btn');
if (await noteBtn.isVisible().catch(() => false)) {
  await noteBtn.click();
  await page.waitForTimeout(800);
}

writeFileSync(resolve(HERE, 'seed-info.json'), JSON.stringify({ base, profileDir, ...seed, taskCount: TASKS.length }, null, 2));
console.log(`seed OK — projets ${JSON.stringify(seed.projects)} tags ${JSON.stringify(seed.tags)} tâches ${TASKS.length}`);
await ctx.close();
