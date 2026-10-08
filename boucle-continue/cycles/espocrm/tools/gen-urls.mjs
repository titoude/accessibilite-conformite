// gen-urls.mjs — régénère urls-auth.txt depuis seed-info.json (exécuter APRÈS seed.mjs).
// Usage: node gen-urls.mjs [base]
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = (process.argv[2] || process.env.ESPO_BASE || 'http://localhost:7747').replace(/\/$/, '');
const s = JSON.parse(readFileSync(join(HERE, 'seed-info.json'), 'utf8'));

const urls = [
    '/',              // home dashboard (dashlets)
    '/#Account',
    `/#Account/view/${s.accountAcmeId}`,
    '/#Contact',
    `/#Contact/view/${s.contactHeleneId}`,
    '/#Lead',
    `/#Lead/view/${s.leadSylvieId}`,
    '/#Opportunity',
    `/#Opportunity/view/${s.oppAcmeId}`,
    '/#Meeting',
    '/#Call',
    '/#Task',
    '/#Campaign',
    '/#TargetList',
    '/#Document',
    '/#KnowledgeBaseArticle',
    '/#CSiteAudit',            // entité custom seedée
    `/#CSiteAudit/view/${s.siteAuditId}`,
    '/#Stream',                // flux d'activités global
    '/#Preferences',
    '/#User/list',             // liste utilisateurs (admin)
    '/#Team',
    '/#Admin',                 // panneau admin
    '/#Admin/settings',
    '/#Admin/users',
    '/#Admin/userInterface',
    '/#Admin/entityManager',
    '/#Admin/layouts',
    '/#Admin/authLog',         // journal auth (données réelles : nos seeds)
    '/#Admin/jobs',
    '/#Admin/templateManager',
    '/#Account/create',
];
const out = urls.map(u => `${BASE}${u}`).join('\n') + '\n';
writeFileSync(join(HERE, 'urls-auth.txt'), out);
writeFileSync(join(HERE, 'urls-public.txt'), `${BASE}/\n${BASE}/#Bogus/route\n`);
console.log(`[gen-urls] ${urls.length} urls auth + 2 public -> urls-auth.txt/urls-public.txt`);
