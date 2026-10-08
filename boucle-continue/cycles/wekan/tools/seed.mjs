// Cycle 39 — wekan/wekan seed.
// Cree l'utilisateur d'audit + un membre, promu admin, puis peuple
// 2 boards (listes, swimlanes, cartes, labels, checklists, commentaires)
// via l'API REST wekan (WITH_API=true).
// Sortie JSON sur stdout : { userId, memberId, boards:[{id,slug,lists,swimlanes,cards...}] }
// Les identifiants sont ecrits dans creds.json (rundir).

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const BASE = process.env.WEKAN_BASE || 'http://localhost:5580';
const RUN = process.env.RUN_DIR || process.cwd();
const PASSWORD = 'Audit-Se3d-C39-WeKan!';
const USERNAME = 'audit.c39';
const EMAIL = 'audit.c39@example.test';
const MEMBER_NAME = 'audit.c39.member';
const MEMBER_EMAIL = 'audit.c39.member@example.test';

const j = (o) => JSON.stringify(o);
const idOf = (r) => (r && r._id) || (r && r.data && r.data._id) || (r && r.data);

async function req(method, path, { token, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body ? j(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    const err = new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`);
    err.status = res.status; err.data = data;
    throw err;
  }
  return data;
}

async function register(username, email, password) {
  const r = await req('POST', '/users/register', { body: { username, email, password } });
  const d = r.data || r;
  return { id: d.id || d._id, token: d.token };
}

async function login(username, password) {
  const r = await req('POST', '/users/login', { body: { username, password } });
  const d = r.data || r;
  return d.token;
}

function mongoEval(js) {
  return execFileSync('docker', [
    'exec', 'wekan39-db', 'mongosh', 'wekan', '--quiet', '--eval', js,
  ], { encoding: 'utf8' });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitUp() {
  for (let i = 0; i < 120; i++) {
    try { const r = await fetch(`${BASE}/`); if (r.ok) return; } catch {}
    await sleep(2000);
  }
  throw new Error('wekan ne repond pas');
}

// -- idempotent -------------------------------------------------------------
const me = async (token) => (await req('GET', '/api/user', { token })).data || await req('GET', '/api/user', { token });

// Ids FIXES : l'audit URL /b/:id/:slug exige des litteraux stables entre rejeux
// (urls-auth.txt est commité). Apres creation via l'API (ids aleatoires), on
// renumérote les boards et les cartes du board 1 en mongo (delete+insert _id,
// puis mise a jour des references dans les collections filles).
const FIXED_BOARD = { 'projet-refonte-web': 'c39wknBoard0000001', 'backlog-produit': 'c39wknBoard0000002', 'feuille-de-route-publique': 'c39wknBoard0000003' };
const FIXED_CARD = { 'Corriger le tunnel de paiement': 'c39wknCard000000001' };

function renumberBoardsAndCards() {
  const renumBoard = Object.entries(FIXED_BOARD).map(([slug, fixed]) =>
    `(function(){var g=db.boards.findOne({slug:${j(slug)}});if(!g)return 'no board ${slug}';var gen=g._id;if(gen===${j(fixed)})return 'already ${slug}';db.boards.deleteOne({_id:gen});g._id=${j(fixed)};db.boards.insertOne(g);['lists','swimlanes','cards','activities','integrations','rules','triggers','actions','custom_fields'].forEach(function(c){db[c].updateMany({boardId:gen},{$set:{boardId:${j(fixed)}}})});db.custom_fields.updateMany({boardIds:gen},{$set:{'boardIds.$':${j(fixed)}}});return 'ok '+gen+'->'+${j(fixed)};})()`
  ).join(';');
  const renumCard = Object.entries(FIXED_CARD).map(([title, fixed]) =>
    `(function(){var g=db.cards.findOne({title:${j(title)}});if(!g)return 'no card ${title}';var gen=g._id;if(gen===${j(fixed)})return 'already';db.cards.deleteOne({_id:gen});g._id=${j(fixed)};db.cards.insertOne(g);['checklists','checklistItems','card_comments','activities','attachments','subtasks'].forEach(function(c){db[c].updateMany({cardId:gen},{$set:{cardId:${j(fixed)}}})});return 'ok card '+gen+'->'+${j(fixed)};})()`
  ).join(';');
  const out = mongoEval(`${renumBoard};${renumCard};`);
  console.log('[seed] renum:', out.replace(/\n+/g, ' ').slice(0, 400));
}

async function deleteBoardIfExists(token, slug) {
  const boards = (await req('GET', '/api/boards', { token }));
  const list = Array.isArray(boards) ? boards : (boards.data || []);
  const hit = list.find(b => b.slug === slug || b.title === slug);
  if (hit) {
    await req('DELETE', `/api/boards/${hit._id}`, { token }).catch(e => console.log('[seed] delete warn', e.message.slice(0, 80)));
    // purge les collections filles au cas ou delete est partiel
    mongoEval(`['lists','swimlanes','cards','checklists','checklistItems','card_comments','activities'].forEach(function(c){db[c].deleteMany({boardId:${j(hit._id)}})});db.checklists.deleteMany({});db.checklistItems.deleteMany({});db.card_comments.deleteMany({});`);
    console.log('[seed] board existant supprime', slug);
  }
}

async function main() {
  await waitUp();

  // 1) comptes
  let token, userId;
  try {
    const r = await register(USERNAME, EMAIL, PASSWORD);
    userId = r.id; token = r.token;
    console.log('[seed] register ok', userId);
  } catch (e) {
    console.log('[seed] register impossible, tentative login:', e.message.slice(0, 120));
    token = await login(USERNAME, PASSWORD);
    const u = await me(token); userId = u._id;
  }
  let memberId;
  try {
    const r = await register(MEMBER_NAME, MEMBER_EMAIL, PASSWORD);
    memberId = r.id;
    console.log('[seed] member register ok', memberId);
  } catch {
    const t2 = await login(MEMBER_NAME, PASSWORD);
    const u = await me(t2); memberId = u._id;
  }

  // 2) admin site (mongo direct)
  mongoEval(`db.users.updateOne({username:'${USERNAME}'},{$set:{isAdmin:true}});`);
  console.log('[seed] isAdmin force sur', USERNAME);

  // idempotent : detruit puis recree les boards du seed
  for (const slug of Object.keys(FIXED_BOARD)) await deleteBoardIfExists(token, slug);
  mongoEval(`db.boards.deleteMany({slug:{$in:['projet-refonte-web','backlog-produit','feuille-de-route-publique']}});db.lists.deleteMany({});db.cards.deleteMany({});db.swimlanes.deleteMany({});db.checklists.deleteMany({});db.checklistItems.deleteMany({});db.card_comments.deleteMany({});db.activities.deleteMany({});`);

  // 3) board 1 riche
  const b1 = await req('POST', '/api/boards', { token, body: { title: 'Projet Refonte Web', permission: 'private', color: 'belize' } });
  const board1 = b1._id || (b1.data && b1.data._id);
  const defaultSwim = b1.defaultSwimlaneId || (b1.data && b1.data.defaultSwimlaneId);
  console.log('[seed] board1', board1, 'swim', defaultSwim);

  await req('POST', `/api/boards/${board1}/members/${memberId}/add`, { token, body: { action: 'add', role: 'normal' } }).catch(e => console.log('[seed] member add warn', e.message.slice(0, 100)));

  // labels
  const labelNames = { green: 'Livré', yellow: 'Urgent', red: 'Bug', blue: 'Design', purple: 'Documentation' };
  const labelIds = {};
  for (const [color, name] of Object.entries(labelNames)) {
    const r = await req('PUT', `/api/boards/${board1}/labels`, { token, body: { label: { name, color } } });
    const lab = (r.data && (r.data._id || (r.data.label && r.data.label._id))) || r.data;
    labelIds[name] = typeof lab === 'string' ? lab : lab;
  }
  // recupere les ids de labels effectifs
  const boardDoc = JSON.parse(mongoEval(`print(JSON.stringify(db.boards.findOne({_id:'${board1}'},{labels:1})))`));
  const labels = (boardDoc.labels || []).map(l => ({ _id: l._id, name: l.name, color: l.color }));
  console.log('[seed] labels', labels.length);

  const lists = {};
  for (const t of ['À faire', 'En cours', 'Terminé']) {
    const r = await req('POST', `/api/boards/${board1}/lists`, { token, body: { title: t } });
    lists[t] = r._id || (r.data && r.data._id);
  }
  console.log('[seed] lists', lists);

  const sw2 = await req('POST', `/api/boards/${board1}/swimlanes`, { token, body: { title: 'Équipe Design' } });
  const swim2 = sw2._id || (sw2.data && sw2.data._id);
  console.log('[seed] swimlane2', swim2);

  // cartes
  const cards = {};
  const mkCard = async (title, list, swim, description) => {
    const r = await req('POST', `/api/boards/${board1}/lists/${list}/cards`, {
      token, body: { title, swimlaneId: swim, description },
    });
    return r._id || (r.data && r.data._id);
  };
  cards.accueil = await mkCard('Refaire la page d’accueil', lists['À faire'], defaultSwim, 'Maquettes validées. Respecter la charte : fond #F4F5F7, titres #172B4D.');
  cards.checkout = await mkCard('Corriger le tunnel de paiement', lists['En cours'], defaultSwim, 'Le bouton "Valider" reste grisé sous Safari 17. Reproduire puis corriger.');
  cards.docapi = await mkCard('Documenter l’API v2', lists['À faire'], defaultSwim, 'Endpoints /api/boards et /api/lists à documenter pour les intégrateurs.');
  cards.hero = await mkCard('Nouveau visuel héros', lists['En cours'], swim2, 'Illustration 1440×600, palette bleue, version mobile.');
  cards.kpi = await mkCard('Brancher le dashboard KPI', lists['Terminé'], defaultSwim, 'Connecté à Metabase, rafraîchi toutes les heures.');
  console.log('[seed] cards', Object.keys(cards).length);

  // label on some cards
  const labelOf = (n) => (labels.find(l => l.name === n) || {})._id;
  await req('POST', `/api/boards/${board1}/cards/labels`, { token, body: { cardIds: [cards.checkout], addLabelIds: [labelOf('Bug'), labelOf('Urgent')].filter(Boolean) } }).catch(e => console.log('[seed] label1 warn', e.message.slice(0, 100)));
  await req('POST', `/api/boards/${board1}/cards/labels`, { token, body: { cardIds: [cards.hero], addLabelIds: [labelOf('Design')].filter(Boolean) } }).catch(e => console.log('[seed] label2 warn', e.message.slice(0, 100)));
  await req('POST', `/api/boards/${board1}/cards/labels`, { token, body: { cardIds: [cards.kpi], addLabelIds: [labelOf('Livré')].filter(Boolean) } }).catch(e => console.log('[seed] label3 warn', e.message.slice(0, 100)));

  // checklists + items
  const cl1 = await req('POST', `/api/boards/${board1}/cards/${cards.checkout}/checklists`, { token, body: { title: 'Étapes de correctif', items: ['Reproduire sur Safari 17', 'Isoler le handler onClick', 'Corriger le binding', 'Tester Firefox/Chrome/Safari'] } });
  const cl1Id = cl1._id || (cl1.data && cl1.data._id);
  console.log('[seed] checklist', cl1Id);
  const cl2 = await req('POST', `/api/boards/${board1}/cards/${cards.accueil}/checklists`, { token, body: { title: 'Livrables', items: ['Wireframe desktop', 'Wireframe mobile', 'Intégration CSS'] } });

  mongoEval(`db.checklistItems.updateMany({checklistId:'${cl1Id}',title:'Reproduire sur Safari 17'},{$set:{isFinished:true}});db.checklistItems.updateMany({title:{$in:['Wireframe desktop','Wireframe mobile']}},{$set:{isFinished:true}});`);

  // commentaires
  await req('POST', `/api/boards/${board1}/cards/${cards.checkout}/comments`, { token, body: { comment: 'Reproduit sur Safari 17.2 : le formulaire ne déclenche pas submit().' } }).catch(e => console.log('[seed] comment warn', e.message.slice(0, 100)));
  await req('POST', `/api/boards/${board1}/cards/${cards.accueil}/comments`, { token, body: { comment: 'Penser à compresser l’image héros (<200 Ko).' } }).catch(e => console.log('[seed] comment2 warn', e.message.slice(0, 100)));

  // membres sur cartes + dates echeance
  const due = new Date(Date.now() + 5 * 864e5).toISOString();
  const start = new Date(Date.now() - 3 * 864e5).toISOString();
  await req('PUT', `/api/boards/${board1}/lists/${lists['En cours']}/cards/${cards.checkout}`, { token, body: { title: 'Corriger le tunnel de paiement', members: [memberId], dueAt: due, startAt: start } }).catch(e => console.log('[seed] card edit warn', e.message.slice(0, 200)));

  // 4) board 2 minimal + public board
  const b2 = await req('POST', '/api/boards', { token, body: { title: 'Backlog Produit', permission: 'private', color: 'nephritis' } });
  const board2 = b2._id || (b2.data && b2.data._id);
  const l2 = await req('POST', `/api/boards/${board2}/lists`, { token, body: { title: 'Idées' } });
  await req('POST', `/api/boards/${board2}/lists/${l2._id || l2.data._id}/cards`, { token, body: { title: 'Explorer le mode hors-ligne', swimlaneId: b2.defaultSwimlaneId || b2.data.defaultSwimlaneId, description: 'Spike : Service Worker + IndexedDB.' } });

  const b3 = await req('POST', '/api/boards', { token, body: { title: 'Feuille de route publique', permission: 'public', color: 'pomegranate' } });
  const board3 = b3._id || (b3.data && b3.data._id);
  const l3 = await req('POST', `/api/boards/${board3}/lists`, { token, body: { title: 'Prochaines versions' } });
  await req('POST', `/api/boards/${board3}/lists/${l3._id || l3.data._id}/cards`, { token, body: { title: 'v12.22 — correctifs a11y', swimlaneId: b3.defaultSwimlaneId || b3.data.defaultSwimlaneId, description: 'Correctifs contrastes et labels.' } });
  console.log('[seed] board2', board2, 'board3', board3);

  // renumérotation vers ids fixes (litteraux d'audit re-jouables)
  renumberBoardsAndCards();

  // slugs
  const slugOf = (id) => JSON.parse(mongoEval(`print(JSON.stringify((db.boards.findOne({_id:'${id}'},{slug:1})||{}).slug))`));

  const out = {
    base: BASE, userId, memberId, username: USERNAME, email: EMAIL, password: PASSWORD,
    boards: [
      { id: FIXED_BOARD['projet-refonte-web'], slug: slugOf(FIXED_BOARD['projet-refonte-web']), title: 'Projet Refonte Web', lists, swimlanes: { default: defaultSwim, design: swim2 }, cards: { ...cards, checkout: FIXED_CARD['Corriger le tunnel de paiement'] }, labels },
      { id: FIXED_BOARD['backlog-produit'], slug: slugOf(FIXED_BOARD['backlog-produit']), title: 'Backlog Produit' },
      { id: FIXED_BOARD['feuille-de-route-publique'], slug: slugOf(FIXED_BOARD['feuille-de-route-publique']), title: 'Feuille de route publique' },
    ],
  };
  writeFileSync(`${RUN}/creds.json`, j(out));
  console.log(j(out));
}
main().catch((e) => { console.error('[seed] FAIL', e); process.exit(1); });
