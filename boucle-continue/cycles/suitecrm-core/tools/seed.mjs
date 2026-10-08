#!/usr/bin/env node
/**
 * Cycle 58 — seed SuiteCRM-Core.
 * Crée des données propres au banc (préfixe "SC58") : comptes, contacts,
 * leads, opportunités + relations minimales. Ids déterministes écrits dans
 * seed-info.json (source unique — leçons 44/46).
 *
 * Usage : node tools/seed.mjs <port>            (ex : 9950)
 *   - écrit tools/seed-info.json
 *   - rejouable : DELETE préalable des ids SC58 pour idempotence.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = process.argv[2] || process.env.SC_PORT || '9950';
const DB_CONTAINER = `sc58-${PORT}-db-1`;

// Ids fixes (uuid v4 syntétiques) — identiques d'un run à l'autre.
const IDS = {
  accounts: [
    '58acc001-0000-4000-8000-000000000001',
    '58acc002-0000-4000-8000-000000000002',
    '58acc003-0000-4000-8000-000000000003',
  ],
  contacts: [
    '58con001-0000-4000-8000-000000000001',
    '58con002-0000-4000-8000-000000000002',
    '58con003-0000-4000-8000-000000000003',
  ],
  leads: [
    '58lea001-0000-4000-8000-000000000001',
    '58lea002-0000-4000-8000-000000000002',
    '58lea003-0000-4000-8000-000000000003',
  ],
  opportunities: [
    '58opp001-0000-4000-8000-000000000001',
    '58opp002-0000-4000-8000-000000000002',
    '58opp003-0000-4000-8000-000000000003',
  ],
  rels: [
    '58rel001-0000-4000-8000-000000000001',
    '58rel002-0000-4000-8000-000000000002',
    '58rel003-0000-4000-8000-000000000003',
    '58rel004-0000-4000-8000-000000000004',
    '58rel005-0000-4000-8000-000000000005',
    '58rel006-0000-4000-8000-000000000006',
    '58rel007-0000-4000-8000-000000000007',
    '58rel008-0000-4000-8000-000000000008',
    '58rel009-0000-4000-8000-000000000009',
  ],
  emails: [
    '58ema001-0000-4000-8000-000000000001',
    '58ema002-0000-4000-8000-000000000002',
    '58ema003-0000-4000-8000-000000000003',
  ],
};

function sql(statements) {
  execFileSync('docker', ['exec', '-i', DB_CONTAINER,
    'mariadb', '-usuitecrm', '-psc-app-pass', 'suitecrm'],
    { input: statements, stdio: ['pipe', 'inherit', 'inherit'] });
}

const now = '2026-10-08 00:00:00';

const ACCOUNTS = [
  { id: IDS.accounts[0], name: 'SC58 Alpha Industries', type: 'Customer', industry: 'Manufacturing', city: 'Lyon', phone: '+33 4 78 00 00 01' },
  { id: IDS.accounts[1], name: 'SC58 Beta Consulting', type: 'Customer', industry: 'Consulting', city: 'Paris', phone: '+33 1 44 00 00 02' },
  { id: IDS.accounts[2], name: 'SC58 Gamma Retail', type: 'Reseller', industry: 'Retail', city: 'Nantes', phone: '+33 2 40 00 00 03' },
];
const CONTACTS = [
  { id: IDS.contacts[0], salutation: 'Ms.', first: 'Alice', last: 'Martin', title: 'CEO', acct: IDS.accounts[0], email: 'alice.martin@sc58-alpha.example' },
  { id: IDS.contacts[1], salutation: 'Mr.', first: 'Bruno', last: 'Leroy', title: 'CTO', acct: IDS.accounts[1], email: 'bruno.leroy@sc58-beta.example' },
  { id: IDS.contacts[2], salutation: 'Mrs.', first: 'Chloe', last: 'Dubois', title: 'Purchasing Manager', acct: IDS.accounts[2], email: 'chloe.dubois@sc58-gamma.example' },
];
const LEADS = [
  { id: IDS.leads[0], salutation: 'Mr.', first: 'David', last: 'Petit', title: 'IT Manager', company: 'SC58 Delta Corp', status: 'New', source: 'Web Site' },
  { id: IDS.leads[1], salutation: 'Ms.', first: 'Emma', last: 'Rousseau', title: 'Sales Director', company: 'SC58 Epsilon SA', status: 'Assigned', source: 'Cold Call' },
  { id: IDS.leads[2], salutation: 'Mr.', first: 'Farid', last: 'Benali', title: 'Founder', company: 'SC58 Zeta SARL', status: 'In Process', source: 'Trade Show' },
];
const OPPS = [
  { id: IDS.opportunities[0], name: 'SC58 Alpha - Renewal 2026', acct: IDS.accounts[0], amount: 48000, stage: 'Prospecting', close: '2026-12-31' },
  { id: IDS.opportunities[1], name: 'SC58 Beta - Migration project', acct: IDS.accounts[1], amount: 120000, stage: 'Negotiation/Review', close: '2026-11-30' },
  { id: IDS.opportunities[2], name: 'SC58 Gamma - POS rollout', acct: IDS.accounts[2], amount: 76000, stage: 'Qualification', close: '2027-01-15' },
];

const stmts = [];
// Idempotence : purge des anciennes lignes SC58
stmts.push(`DELETE FROM accounts WHERE name LIKE 'SC58 %' OR id LIKE '58acc%';`);
stmts.push(`DELETE FROM contacts WHERE last_name IN ('Martin','Leroy','Dubois') AND id LIKE '58con%';`);
stmts.push(`DELETE FROM leads WHERE account_name LIKE 'SC58 %' OR id LIKE '58lea%';`);
stmts.push(`DELETE FROM opportunities WHERE name LIKE 'SC58 %' OR id LIKE '58opp%';`);
stmts.push(`DELETE FROM accounts_contacts WHERE contact_id LIKE '58con%';`);
stmts.push(`DELETE FROM accounts_opportunities WHERE opportunity_id LIKE '58opp%';`);
stmts.push(`DELETE FROM opportunities_contacts WHERE opportunity_id LIKE '58opp%';`);
stmts.push(`DELETE FROM email_addr_bean_rel WHERE email_address_id LIKE '58ema%';`);
stmts.push(`DELETE FROM email_addresses WHERE id LIKE '58ema%';`);

for (const a of ACCOUNTS) {
  stmts.push(`INSERT INTO accounts (id,name,date_entered,date_modified,created_by,assigned_user_id,deleted,account_type,industry,billing_address_city,phone_office,website)
    VALUES ('${a.id}','${a.name}','${now}','${now}','1','1',0,'${a.type}','${a.industry}','${a.city}','${a.phone}','https://example.org/${a.id.slice(5,7)}');`);
}
let relIdx = 0;
let emIdx = 0;
for (const c of CONTACTS) {
  stmts.push(`INSERT INTO contacts (id,date_entered,date_modified,created_by,assigned_user_id,deleted,salutation,first_name,last_name,title,primary_address_city,phone_work)
    VALUES ('${c.id}','${now}','${now}','1','1',0,'${c.salutation}','${c.first}','${c.last}','${c.title}','Lyon','+33 4 00 00 0${emIdx + 1}');`);
  stmts.push(`INSERT INTO accounts_contacts (id,contact_id,account_id,date_modified,deleted)
    VALUES ('${IDS.rels[relIdx++]}','${c.id}','${c.acct}','${now}',0);`);
  const emId = IDS.emails[emIdx++];
  stmts.push(`INSERT INTO email_addresses (id,email_address,email_address_caps,date_created,date_modified,deleted)
    VALUES ('${emId}','${c.email}','${c.email.toUpperCase()}','${now}','${now}',0);`);
  stmts.push(`INSERT INTO email_addr_bean_rel (id,email_address_id,bean_id,bean_module,primary_address,date_created,date_modified,deleted)
    VALUES ('${IDS.rels[relIdx++]}','${emId}','${c.id}','Contacts',1,'${now}','${now}',0);`);
}
for (const l of LEADS) {
  stmts.push(`INSERT INTO leads (id,date_entered,date_modified,created_by,assigned_user_id,deleted,salutation,first_name,last_name,title,account_name,status,lead_source,phone_work)
    VALUES ('${l.id}','${now}','${now}','1','1',0,'${l.salutation}','${l.first}','${l.last}','${l.title}','${l.company}','${l.status}','${l.source}','+33 6 00 00 00 01');`);
}
for (const o of OPPS) {
  stmts.push(`INSERT INTO opportunities (id,name,date_entered,date_modified,created_by,assigned_user_id,deleted,amount,amount_usdollar,sales_stage,date_closed,probability)
    VALUES ('${o.id}','${o.name}','${now}','${now}','1','1',0,${o.amount},${o.amount},'${o.stage}','${o.close}',50);`);
  stmts.push(`INSERT INTO accounts_opportunities (id,opportunity_id,account_id,date_modified,deleted)
    VALUES ('${IDS.rels[relIdx++]}','${o.id}','${o.acct}','${now}',0);`);
}

sql(stmts.join('\n'));

const out = {
  port: Number(PORT),
  base: `http://localhost:${PORT}`,
  admin: { username: 'admin', password: 'Sc58-Admin-Pass!' },
  accounts: ACCOUNTS.map(a => ({ id: a.id, name: a.name })),
  contacts: CONTACTS.map(c => ({ id: c.id, name: `${c.first} ${c.last}`, accountId: c.acct })),
  leads: LEADS.map(l => ({ id: l.id, name: `${l.first} ${l.last}`, company: l.company })),
  opportunities: OPPS.map(o => ({ id: o.id, name: o.name, accountId: o.acct })),
};
writeFileSync(join(HERE, 'seed-info.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`seed ok — ${ACCOUNTS.length} accounts, ${CONTACTS.length} contacts, ${LEADS.length} leads, ${OPPS.length} opportunities → tools/seed-info.json`);
