/**
 * gen-urls.mjs — écrit urls.txt (une route par ligne) à partir de
 * seed-info.json. Usage : node gen-urls.mjs <baseUrl>
 * Sortie : urls.txt dans le même dossier que ce script.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const base = (process.argv[2] || 'http://localhost:9251/').replace(/\/$/, '');
const seed = JSON.parse(readFileSync(resolve(HERE, 'seed-info.json'), 'utf8'));
const P = seed.projects, T = seed.tags;

const routes = [
  '#/tag/TODAY/tasks', '#/tag/TODAY/metrics', '#/tag/TODAY/daily-summary', '#/tag/TODAY/history',
  '#/tag/INBOX/tasks',
  `#/tag/${T['audit-urgent']}/tasks`, `#/tag/${T['audit-dom']}/tasks`,
  `#/project/${P['audit-alpha']}/tasks`, `#/project/${P['audit-alpha']}/metrics`, `#/project/${P['audit-alpha']}/daily-summary`,
  `#/project/${P['audit-beta']}/tasks`, `#/project/${P['audit-beta']}/history`,
  '#/planner', '#/schedule', '#/boards', '#/habits', '#/search',
  '#/scheduled-list', '#/archived-projects', '#/config', '#/donate',
  // '#/contrast-test' exclu : page dev interne affichant volontairement des
  // paires de couleurs non conformes (fixture de test visuel, pas une surface).
];
writeFileSync(resolve(HERE, 'urls.txt'), routes.map((r) => `${base}/${r}`).join('\n') + '\n');
console.log(`${routes.length} URLs → urls.txt`);
