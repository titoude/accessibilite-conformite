#!/usr/bin/env node
// seed.mjs — cycle 46 metabase : contenu de test déterministe + rejouable.
// Rejouable verbatim : idempotent (lookup-by-name avant create), aucun état
// préalable requis au-delà d'un admin setup. Crée :
//   - collection "Boucle 46 — Audit"
//   - 3 questions (2 GUI sur Sample Database, 1 native SQL)
//   - 1 dashboard "Boucle 46 — Audit Dashboard" avec les 3 questions
//   - 1 utilisateur non-admin viewer@boucle46.local (si absent)
// Usage : node tools/seed.mjs [baseUrl] [adminEmail] [adminPassword]
// Sortie JSON sur stdout : ids créés pour les manifests/urls.

const BASE = process.argv[2] || 'http://localhost:7600';
const ADMIN_EMAIL = process.argv[3] || 'admin@boucle46.local';
const ADMIN_PASS = process.argv[4] || 'Boucle46!A11y';

const j = (r) => {
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} on ${r.url}`);
  return r.json();
};

const api = (sid, method, path, body) =>
  fetch(`${BASE}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Metabase-Session': sid },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then(j);

const login = async (email, password) => {
  const r = await fetch(`${BASE}/api/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });
  return (await j(r)).id;
};

const main = async () => {
  const sid = await login(ADMIN_EMAIL, ADMIN_PASS);
  const out = { base: BASE, created: {}, reused: {} };

  // -- utilisateur non-admin -------------------------------------------------
  const users = await api(sid, 'GET', '/user?limit=200&include_deactivated=true');
  const viewer = (users.data || []).find((u) => u.email === 'viewer@boucle46.local');
  if (viewer) {
    out.reused.viewer = viewer.id;
  } else {
    const u = await api(sid, 'POST', '/user', {
      email: 'viewer@boucle46.local',
      first_name: 'View',
      last_name: 'Only',
      password: 'Boucle46!View',
    });
    out.created.viewer = u.id;
  }

  // -- base de données : Sample Database -------------------------------------
  const dbs = await api(sid, 'GET', '/database');
  const sampleDb = (dbs.data || dbs).find((d) => d.is_sample || /sample/i.test(d.name));
  if (!sampleDb) throw new Error('Sample Database introuvable — MB_LOAD_SAMPLE_CONTENT requis');
  const dbId = sampleDb.id;
  const meta = await api(sid, 'GET', `/database/${dbId}/metadata?include_hidden=false`);
  const tables = meta.tables || [];
  const products = tables.find((t) => t.name === 'PRODUCTS');
  const orders = tables.find((t) => t.name === 'ORDERS');
  if (!products || !orders) throw new Error(`tables PRODUCTS/ORDERS absentes (${tables.map((t) => t.name)})`);
  const fieldOf = (t, n) => (t.fields || []).find((f) => f.name === n)?.id;

  // -- collection -------------------------------------------------------------
  const colls = await api(sid, 'GET', '/collection');
  let coll = (colls.data || colls).find((c) => c.name === 'Boucle 46 — Audit');
  if (coll) {
    out.reused.collection = coll.id;
  } else {
    coll = await api(sid, 'POST', '/collection', { name: 'Boucle 46 — Audit', color: '#509EE3' });
    out.created.collection = coll.id;
  }

  // -- questions ---------------------------------------------------------------
  const mkMbql = (name, query, display = 'table') => ({
    name,
    display,
    collection_id: coll.id,
    dataset_query: { database: dbId, type: 'query', query: { 'source-table': products.id, ...query } },
    visualization_settings: {},
  });

  const wanted = [
    mkMbql('B46 — Products par catégorie', {
      aggregation: [['count']],
      breakout: [['field', fieldOf(products, 'CATEGORY'), { 'base-type': 'type/Text' }]],
    }, 'bar'),
    mkMbql('B46 — Prix moyen par catégorie', {
      aggregation: [['avg', ['field', fieldOf(products, 'PRICE'), { 'base-type': 'type/Number' }]]],
      breakout: [['field', fieldOf(products, 'CATEGORY'), { 'base-type': 'type/Text' }]],
    }, 'bar'),
    {
      name: 'B46 — Commandes par mois (SQL)',
      display: 'line',
      collection_id: coll.id,
      dataset_query: {
        database: dbId,
        type: 'native',
        native: {
          query: 'SELECT parsedatetime(formatdatetime(CREATED_AT, \'yyyy-MM\'), \'yyyy-MM\') AS month, COUNT(*) AS n FROM ORDERS GROUP BY 1 ORDER BY 1',
          'template-tags': {},
        },
      },
      visualization_settings: {},
    },
  ];

  const cards = await api(sid, 'GET', '/card?f=all');
  const cardList = cards.data || cards;
  const cardIds = [];
  for (const q of wanted) {
    const ex = cardList.find((c) => c.name === q.name);
    if (ex) {
      cardIds.push(ex.id);
      out.reused[`card:${q.name}`] = ex.id;
    } else {
      const c = await api(sid, 'POST', '/card', q);
      cardIds.push(c.id);
      out.created[`card:${q.name}`] = c.id;
    }
  }

  // -- dashboard ---------------------------------------------------------------
  const dashboards = await api(sid, 'GET', '/dashboard?f=all');
  let dash = (dashboards.data || dashboards).find((d) => d.name === 'Boucle 46 — Audit Dashboard');
  const ensureCards = async () => {
    const full = await api(sid, 'GET', `/dashboard/${dash.id}`);
    const existing = new Set((full.dashcards || []).map((dc) => dc.card_id));
    const missing = cardIds.filter((cid) => !existing.has(cid));
    if (!missing.length) return;
    const cardsPayload = [
      { id: -1, card_id: cardIds[0], row: 0, col: 0, size_x: 9, size_y: 8 },
      { id: -2, card_id: cardIds[1], row: 0, col: 9, size_x: 9, size_y: 8 },
      { id: -3, card_id: cardIds[2], row: 8, col: 0, size_x: 18, size_y: 7 },
    ]
      .filter((c) => missing.includes(c.card_id))
      .map((c) => ({ ...c, parameter_mappings: [], series: [], visualization_settings: {} }));
    // PUT remplace tout : réémettre les existants + les manquants
    const keep = (full.dashcards || []).map((dc) => ({
      id: dc.id, card_id: dc.card_id, row: dc.row, col: dc.col, size_x: dc.size_x, size_y: dc.size_y,
      parameter_mappings: dc.parameter_mappings || [], series: dc.series || [], visualization_settings: dc.visualization_settings || {},
    }));
    await api(sid, 'PUT', `/dashboard/${dash.id}/cards`, { cards: [...keep, ...cardsPayload] });
  };
  if (dash) {
    out.reused.dashboard = dash.id;
    await ensureCards();
  } else {
    dash = await api(sid, 'POST', '/dashboard', {
      name: 'Boucle 46 — Audit Dashboard',
      collection_id: coll.id,
    });
    out.created.dashboard = dash.id;
    // ajoute les 3 cards (ids temporaires négatifs — PUT /dashboard/:id/cards)
    const cardsPayload = [
      { id: -1, card_id: cardIds[0], row: 0, col: 0, size_x: 9, size_y: 8 },
      { id: -2, card_id: cardIds[1], row: 0, col: 9, size_x: 9, size_y: 8 },
      { id: -3, card_id: cardIds[2], row: 8, col: 0, size_x: 18, size_y: 7 },
    ].map((c) => ({ ...c, parameter_mappings: [], series: [], visualization_settings: {} }));
    await api(sid, 'PUT', `/dashboard/${dash.id}/cards`, { cards: cardsPayload });
  }

  // -- permissions : viewer dans "All Users" a accès à la collection -----------
  // Les collections non-personnelles sont lisibles par All Users par défaut.

  out.urls = {
    collection: `/collection/${coll.id}`,
    dashboard: `/dashboard/${dash.id}`,
    card: `/question/${cardIds[0]}`,
  };
  console.log(JSON.stringify(out, null, 2));
};

main().catch((e) => {
  console.error('SEED_FAILED', e.message);
  process.exit(1);
});
