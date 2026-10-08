// seed.mjs — seed EspoCRM cycle 47 via REST API v1 (Basic auth admin).
// Idempotent : existence vérifiée par nom avant chaque création.
// Usage: node seed.mjs [base] — ESPO_USER/ESPO_PASS overridables.
// Écrit seed-info.json (ids réels) à côté du script.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = (process.argv[2] || process.env.ESPO_BASE || 'http://localhost:7747').replace(/\/$/, '');
const USER = process.env.ESPO_USER || 'admin';
const PASS = process.env.ESPO_PASS || 'AuditC47-Espo-Pass!';
const AUTH = 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64');

const info = { seededAt: new Date().toISOString() };
// id de l'admin courant (pour assignedUser requis sur activités)
const me = await api('GET', 'App/user');
const ADMIN_ID = me.user.id;
info.adminId = ADMIN_ID;
console.log(`[seed] admin id ${ADMIN_ID}`);

async function api(method, path, body) {
    const r = await fetch(`${BASE}/api/v1/${path}`, {
        method,
        headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await r.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* texte brut */ }
    if (!r.ok) throw new Error(`${method} ${path} -> ${r.status}: ${text.slice(0, 300)}`);
    return json;
}

async function existsByName(entity, name, attribute = 'name') {
    // Espo v1 : paramètres where[i][type|attribute|value] (la forme ?where=<json> est ignorée).
    const q = `where[0][type]=equals&where[0][attribute]=${encodeURIComponent(attribute)}&where[0][value]=${encodeURIComponent(name)}`;
    const r = await api('GET', `${entity}?maxSize=2&${q}`);
    return (r.list && r.list[0]) || null;
}

async function ensure(entity, name, data, attribute) {
    const found = await existsByName(entity, name, attribute);
    if (found) { console.log(`[seed] ${entity} "${name}" existe (${found.id})`); return found; }
    const created = await api('POST', entity, data);
    console.log(`[seed] ${entity} "${name}" créé (${created.id})`);
    return created;
}

async function ensureLink(entity, id, link, ids) {
    // link many-to-many : POST /Entity/:id/:link {"ids":[...]} ignore les doublons (409)
    for (const lid of ids) {
        try { await api('POST', `${entity}/${id}/${link}`, { id: lid }); }
        catch (e) { if (!/409|already/i.test(e.message)) console.error(`[seed] link ${entity}.${link} ${lid}: ${e.message}`); }
    }
}

// ---------- utilisateurs ----------
const user2 = await ensure('User', 'claire.martin', {
    userName: 'claire.martin', firstName: 'Claire', lastName: 'Martin',
    emailAddress: 'claire.martin@audit47.example.com', type: 'regular',
    title: 'Commercial senior', isActive: true,
}, 'userName');
info.userClaireId = user2.id;
// garde : ne jamais écrire le mot de passe sur l'admin (id lookup vérifié)
if (user2.userName !== 'claire.martin') throw new Error(`lookup User a renvoyé '${user2.userName}' au lieu de claire.martin`);
try {
    await api('PUT', `User/${user2.id}`, { password: 'AuditC47-Claire-Pass!' });
} catch (e) { console.error('[seed] set-password claire:', e.message); }

const team = await ensure('Team', 'Equipe Ouest', { name: 'Equipe Ouest' });
info.teamId = team.id;

// ---------- accounts ----------
const acc1 = await ensure('Account', 'Acme Industries', {
    name: 'Acme Industries', website: 'https://acme.example.com',
    emailAddress: 'contact@acme.example.com', phoneNumber: '+33140000000',
    billingAddressStreet: '12 rue de la Pompe', billingAddressCity: 'Paris',
    billingAddressPostalCode: '75116', billingAddressCountry: 'France',
    industry: 'Manufacturing', type: 'Customer',
    description: 'Compte référence. Documentation : https://docs.acme.example.com',
});
info.accountAcmeId = acc1.id;

const acc2 = await ensure('Account', 'Société Lenoir & Fils', {
    name: 'Société Lenoir & Fils', website: 'https://lenoir.example.fr',
    emailAddress: 'accueil@lenoir.example.fr', phoneNumber: '+33245000000',
    billingAddressCity: 'Nantes', billingAddressCountry: 'France',
    industry: 'Retail', type: 'Partner',
});
const acc3 = await ensure('Account', 'Nordvik Shipping', {
    name: 'Nordvik Shipping', website: 'https://nordvik.example.no',
    billingAddressCity: 'Oslo', billingAddressCountry: 'Norway',
    industry: 'Transportation', type: 'Customer',
});
const acc4 = await ensure('Account', 'Borealis Labs', {
    name: 'Borealis Labs', website: 'https://borealis.example.io',
    billingAddressCity: 'Berlin', billingAddressCountry: 'Germany',
    industry: 'Technology', type: 'Reseller',
});
info.accountIds = [acc1.id, acc2.id, acc3.id, acc4.id];

// ---------- contacts ----------
const con1 = await ensure('Contact', 'Martin', {
    firstName: 'Hélène', lastName: 'Martin', salutationName: 'Mrs.',
    emailAddress: 'helene.martin@acme.example.com', phoneNumber: '+33610000001',
    title: 'Directrice achats', accountId: acc1.id,
    description: 'Décideuse projet. Fiche interne https://intranet.example.com/hmartin',
}, 'lastName');
info.contactHeleneId = con1.id;
const con2 = await ensure('Contact', 'Dubois', {
    firstName: 'Marc', lastName: 'Dubois',
    emailAddress: 'marc.dubois@lenoir.example.fr', phoneNumber: '+33610000002',
    title: 'Responsable magasin', accountId: acc2.id,
}, 'lastName');
const con3 = await ensure('Contact', 'Larsen', {
    firstName: 'Ingrid', lastName: 'Larsen',
    emailAddress: 'i.larsen@nordvik.example.no',
    title: 'Ops manager', accountId: acc3.id,
}, 'lastName');
const con4 = await ensure('Contact', 'Weiss', {
    firstName: 'Jonas', lastName: 'Weiss',
    emailAddress: 'jonas.weiss@borealis.example.io',
    title: 'CTO', accountId: acc4.id,
}, 'lastName');
info.contactIds = [con1.id, con2.id, con3.id, con4.id];

// ---------- leads ----------
const lead1 = await ensure('Lead', 'Fontaine', {
    firstName: 'Sylvie', lastName: 'Fontaine',
    companyName: 'Fontaine Consulting', emailAddress: 'sylvie@fontaine.example.fr',
    status: 'Assigned', source: 'Web Site', industry: 'Consulting',
    opportunityAmount: 45000,
    description: 'Lead entrant formulaire web — demande de démo https://cal.example.com/sylvie',
}, 'lastName');
info.leadSylvieId = lead1.id;
await ensure('Lead', 'Nakamura', {
    firstName: 'Kenji', lastName: 'Nakamura', companyName: 'Nakamura KK',
    status: 'In Process', source: 'Call', opportunityAmount: 120000,
}, 'lastName');
await ensure('Lead', 'Baker', {
    firstName: 'Alice', lastName: 'Baker', companyName: 'Baker & Co',
    status: 'New', source: 'Partner', emailAddress: 'alice@baker.example.co',
}, 'lastName');
await ensure('Lead', 'Rossi', {
    firstName: 'Giulia', lastName: 'Rossi', companyName: 'Rossi SpA',
    status: 'Converted', source: 'Campaign', convertedAt: '2026-10-01',
}, 'lastName');

// ---------- opportunities ----------
const opp1 = await ensure('Opportunity', 'Licences Acme 2027', {
    name: 'Licences Acme 2027', accountId: acc1.id,
    amount: 85000, stage: 'Negotiation', probability: 70,
    closeDate: '2027-03-31',
    description: 'Renouvellement + extension 40 sièges. Tarifs https://example.org/tarifs',
});
info.oppAcmeId = opp1.id;
await ensure('Opportunity', 'Déploiement Nordvik', {
    name: 'Déploiement Nordvik', accountId: acc3.id,
    amount: 130000, stage: 'Proposal', probability: 45, closeDate: '2027-02-15',
});
await ensure('Opportunity', 'Pilote Borealis', {
    name: 'Pilote Borealis', accountId: acc4.id,
    amount: 22000, stage: 'Qualification', probability: 20, closeDate: '2026-12-20',
});
await ensure('Opportunity', 'Extension Lenoir', {
    name: 'Extension Lenoir', accountId: acc2.id,
    amount: 38000, stage: 'Closed Won', probability: 100, closeDate: '2026-09-15',
});

// ---------- activités ----------
await ensure('Meeting', 'Démo produit Acme', {
    name: 'Démo produit Acme', status: 'Planned', assignedUserId: ADMIN_ID,
    dateStart: '2026-10-15 14:00:00', dateEnd: '2026-10-15 15:00:00',
    parentType: 'Account', parentId: acc1.id, parentName: 'Acme Industries',
});
await ensure('Call', 'Point hebdo Nordvik', {
    name: 'Point hebdo Nordvik', status: 'Held', assignedUserId: ADMIN_ID,
    dateStart: '2026-10-07 09:00:00', dateEnd: '2026-10-07 09:30:00',
    parentType: 'Account', parentId: acc3.id, parentName: 'Nordvik Shipping',
    direction: 'Outbound',
});
await ensure('Task', 'Relancer devis Lenoir', {
    name: 'Relancer devis Lenoir', status: 'Not Started', priority: 'High',
    dateEnd: '2026-10-20 17:00:00', assignedUserId: ADMIN_ID,
    parentType: 'Account', parentId: acc2.id, parentName: 'Société Lenoir & Fils',
});
await ensure('Task', 'Préparer contract Acme', {
    name: 'Préparer contract Acme', status: 'Started', priority: 'Normal',
    dateEnd: '2026-10-12 17:00:00', assignedUserId: ADMIN_ID,
    parentType: 'Opportunity', parentId: opp1.id, parentName: 'Licences Acme 2027',
});

// ---------- notes/stream (contenu réellement rendu, avec lien — leçon seed littérale) ----------
const noteCheck = await api('GET', `Note?maxSize=1&` + `where[0][type]=equals&where[0][attribute]=post&where[0][value]=${encodeURIComponent('Point RGPD : revue complète sur https://example.org/guide et checklist validée.')}`);
if (!noteCheck.list || !noteCheck.list.length) {
    await api('POST', 'Note', {
        type: 'Post', post: 'Point RGPD : revue complète sur https://example.org/guide et checklist validée.',
        parentType: 'Account', parentId: acc1.id,
    });
    console.log('[seed] note Acme postée');
} else { console.log('[seed] note Acme existe'); }
const note2 = await api('GET', `Note?maxSize=1&` + `where[0][type]=equals&where[0][attribute]=post&where[0][value]=${encodeURIComponent('Kickoff Nordvik planifié — ordre du jour https://pad.example.org/nordvik')}`);
if (!note2.list || !note2.list.length) {
    await api('POST', 'Note', {
        type: 'Post', post: 'Kickoff Nordvik planifié — ordre du jour https://pad.example.org/nordvik',
        parentType: 'Account', parentId: acc3.id,
    });
    console.log('[seed] note Nordvik postée');
} else { console.log('[seed] note Nordvik existe'); }

// ---------- entité custom CSiteAudit (créée hors seed si absente — action EntityManager) ----------
let auditOk = true;
try { await api('GET', 'CSiteAudit?maxSize=1'); } catch { auditOk = false; }
if (!auditOk) {
    await api('POST', 'EntityManager/action/createEntity', {
        name: 'SiteAudit', type: 'Base',
        labelSingular: 'Site Audit', labelPlural: 'Site Audits',
        stream: true, iconClass: 'fas fa-clipboard-check', color: '#3d85c6',
    });
    console.log('[seed] entité CSiteAudit créée — attente rebuild 5s');
    await new Promise(r => setTimeout(r, 5000));
}
const sa1 = await ensure('CSiteAudit', 'Audit pilote RGPD', {
    name: 'Audit pilote RGPD',
    description: 'Revue conformité voir https://example.org/rgpd',
});
info.siteAuditId = sa1.id;
await ensure('CSiteAudit', 'Audit sécurité Q4', {
    name: 'Audit sécurité Q4',
    description: 'Pentest + revue accès',
});
await ensure('CSiteAudit', 'Audit accessibilité web', {
    name: 'Audit accessibilité web',
    description: 'RGAA 4.1 — rapport https://example.org/rapport-a11y',
});

// ---------- knowledge base ----------
const kbCheck = await api('GET', `KnowledgeBaseArticle?maxSize=1&where[0][type]=equals&where[0][attribute]=name&where[0][value]=${encodeURIComponent('Guide onboarding commercial')}`);
if (!kbCheck.list || !kbCheck.list.length) {
    await api('POST', 'KnowledgeBaseArticle', {
        name: 'Guide onboarding commercial', status: 'Published',
        body: '<h2>Bienvenue</h2><p>Procédure commerciale complète : <a href="https://kb.example.org/onboarding">guide en ligne</a>.</p><ul><li>Créer le contact</li><li>Qualifier le lead</li><li>Convertir en opportunité</li></ul>',
    });
    console.log('[seed] KB article créé');
} else { console.log('[seed] KB article existe'); }

// ---------- campagne + target list ----------
const tl = await ensure('TargetList', 'Prospects Q4 France', {
    name: 'Prospects Q4 France',
    description: 'Liste cible campagne Q4',
});
info.targetListId = tl.id;
await ensureLink('TargetList', tl.id, 'contacts', info.contactIds.slice(0, 2));
await ensure('Campaign', 'Campagne lancement 2026', {
    name: 'Campagne lancement 2026', status: 'Active',
    type: 'Email', startDate: '2026-10-01', endDate: '2026-12-31',
    budget: 5000,
    description: 'Landing https://camp.example.org/launch',
});
// liens contact→account (bidirectionnels)
await ensureLink('Account', acc1.id, 'contacts', [con1.id]);
await ensureLink('Account', acc2.id, 'contacts', [con2.id]);
await ensureLink('Account', acc3.id, 'contacts', [con3.id]);
await ensureLink('Account', acc4.id, 'contacts', [con4.id]);
// équipe : rattacher Claire
try { await api('POST', `Team/${team.id}/users`, { id: user2.id }); } catch (e) { if (!/409|already/i.test(e.message)) console.error('[seed] team link:', e.message); }

// ---------- document (pièce jointe réelle requise) ----------
let doc = await existsByName('Document', 'Guide tarifaire 2026.pdf');
if (!doc) {
    // mini-PDF valide (1 page "Guide tarifaire 2026")
    const pdfB64 = Buffer.from(
        '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
        '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n' +
        '4 0 obj<</Length 90>>stream\nBT /F1 24 Tf 72 720 Td (Guide tarifaire 2026) Tj ET\nendstream endobj\n' +
        '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n' +
        'trailer<</Root 1 0 R>>\n%%EOF\n').toString('base64');
    const att = await api('POST', 'Attachment', {
        name: 'Guide tarifaire 2026.pdf', type: 'application/pdf',
        role: 'Attachment', field: 'file', parentType: 'Document',
        file: `data:application/pdf;base64,${pdfB64}`,
    });
    doc = await api('POST', 'Document', {
        name: 'Guide tarifaire 2026.pdf', publishDate: '2026-09-01', fileId: att.id,
    });
    console.log(`[seed] Document créé (${doc.id})`);
} else { console.log('[seed] Document existe'); }

writeFileSync(join(HERE, 'seed-info.json'), JSON.stringify(info, null, 2));
console.log('[seed] terminé — seed-info.json écrit');
