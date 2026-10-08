#!/usr/bin/env node
/**
 * seed.mjs — seed REJOUABLE et idempotent pour mealie (cycle 44).
 *
 * Usage : node seed.mjs <baseUrl> [email] [password]
 *   node seed.mjs http://localhost:7044 changeme@example.com MyPassword
 *
 * Seme via l'API REST amont (auth admin changeme@example.com/MyPassword,
 * compte créé par le premier boot de l'image officielle) :
 *   - foods + units en-US via POST /api/groups/seeders/{foods,units}
 *   - organizers (catégories, tags, tools, labels)
 *   - 4 recettes COMPLÈTES (ingrédients à sections, instructions
 *     titre+texte dont un lien markdown réel, notes, nutrition, temps)
 *   - cookbook « Weeknight Staples » filtré sur le tag Quick
 *   - 2 entrées mealplan (aujourd'hui+demain, dates relatives au run)
 *   - liste de courses « Weekly Groceries » + items
 *   - token de partage public → tools/public-share.json (URL de l'état
 *     public /g/home/shared/r/<token>)
 *   - second utilisateur non-admin « devin-seed-2 »
 *   - rating 5 + favorite sur la 1re recette
 *   - image de recette (PNG factice en multipart)
 * Idempotent : chaque entité est recherchée (slug/nom) avant création.
 * Écrit tools/seed-env.json {groupSlug, slugs, shareToken, userId} —
 * urls.txt et les STATES y font référence.
 */

const BASE = (process.argv[2] || 'http://localhost:7044').replace(/\/$/, '');
const EMAIL = process.argv[3] || 'changeme@example.com'; // repli : admin@example.com
const PASS = process.argv[4] || 'MyPassword';
const OUT = new URL('./seed-env.json', import.meta.url).pathname;

let TOKEN = null;
async function api(path, { method = 'GET', body, form, headers = {} } = {}) {
  const h = { ...headers };
  if (TOKEN) h.Authorization = `Bearer ${TOKEN}`;
  const init = { method, headers: h };
  if (form) {
    init.body = new URLSearchParams(form).toString();
    h['Content-Type'] = 'application/x-www-form-urlencoded';
  } else if (body !== undefined) {
    init.body = JSON.stringify(body);
    h['Content-Type'] = 'application/json';
  }
  const r = await fetch(BASE + path, init);
  const text = await r.text();
  let data = null;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: r.status, data };
}

function must(res, label, ok = [200, 201]) {
  if (!ok.includes(res.status)) {
    throw new Error(`${label}: HTTP ${res.status} — ${JSON.stringify(res.data).slice(0, 300)}`);
  }
  return res.data;
}

async function ensureNamed(listPath, createPath, name, extra = {}) {
  const found = await api(`${listPath}?page=1&perPage=50&search=${encodeURIComponent(name)}`);
  if (found.status === 200 && Array.isArray(found.data?.items)) {
    const hit = found.data.items.find(i => i.name === name);
    if (hit) return hit;
  }
  return must(await api(createPath, { method: 'POST', body: { name, ...extra } }), `create ${name}`);
}

// Petit PNG 32x32 plein (terracotta) — image de recette factice déterministe.
// recipe-image.png (64x64, terracotta) — généré déterministement, voir script.
const PNG_PATH = new URL('./recipe-image.png', import.meta.url).pathname;

async function main() {
  console.log(`[seed] base=${BASE}`);
  // 1) Auth — après le 1er run l'email admin devient admin@example.com ;
  // on tente les deux pour l'idempotence.
  let login = await api('/api/auth/token', { method: 'POST', form: { username: EMAIL, password: PASS } });
  if (login.status !== 200) {
    login = await api('/api/auth/token', { method: 'POST', form: { username: 'admin@example.com', password: PASS } });
  }
  TOKEN = must(login, 'login').access_token;
  const me = must(await api('/api/users/self'), 'self');
  const groupSlug = me.groupSlug;
  console.log(`[seed] user=${me.username} group=${groupSlug}`);

  // 2) Seeders amont (idempotent côté serveur — insert ignore)
  for (const kind of ['foods', 'units']) {
    const r = await api(`/api/groups/seeders/${kind}`, { method: 'POST', body: { locale: 'en-US' } });
    if (r.status !== 200) throw new Error(`seeder ${kind}: HTTP ${r.status}`);
    console.log(`[seed] seeder ${kind}: ${r.data?.message || r.status}`);
  }

  // 3) Organizers
  const catDinner = await ensureNamed('/api/organizers/categories', '/api/organizers/categories', 'Dinner');
  const catDessert = await ensureNamed('/api/organizers/categories', '/api/organizers/categories', 'Dessert');
  const tagQuick = await ensureNamed('/api/organizers/tags', '/api/organizers/tags', 'Quick');
  const tagVeg = await ensureNamed('/api/organizers/tags', '/api/organizers/tags', 'Vegetarian');
  const toolOven = await ensureNamed('/api/organizers/tools', '/api/organizers/tools', 'Oven');
  const toolBlender = await ensureNamed('/api/organizers/tools', '/api/organizers/tools', 'Blender');
  const labelStaple = await ensureNamed('/api/groups/labels', '/api/groups/labels', 'Staple', { color: '#2e7d32' });
  const labelProduce = await ensureNamed('/api/groups/labels', '/api/groups/labels', 'Produce', { color: '#1565c0' });
  console.log('[seed] organizers OK');

  // Units/foods doivent porter leur id serveur (le modèle SQL exige 'id').
  async function findUnit(name) {
    const r = await api(`/api/units?page=1&perPage=100&search=${encodeURIComponent(name)}`);
    const hit = r.data?.items?.find(u => u.name.toLowerCase() === name.toLowerCase());
    return hit ? { id: hit.id, name: hit.name } : null;
  }
  async function findFood(name) {
    const r = await api(`/api/foods?page=1&perPage=100&search=${encodeURIComponent(name)}`);
    const hit = r.data?.items?.find(f => f.name.toLowerCase() === name.toLowerCase());
    return hit ? { id: hit.id, name: hit.name } : null;
  }
  const unitNames = ['cup', 'tablespoon', 'gram'];
  const UNITS = {};
  for (const n of unitNames) UNITS[n] = await findUnit(n);
  const cup = UNITS.cup, tbsp = UNITS.tablespoon, gram = UNITS.gram;
  const FOODS = {};
  const foodNames = ['lentil', 'olive oil', 'yellow onion', 'coconut milk', 'lemon',
    'flour', 'egg', 'dark chocolate', 'chicken thigh', 'potato', 'butter'];
  for (const n of foodNames) FOODS[n] = (await findFood(n)) || { name: n };
  const F = n => (FOODS[n]?.id ? { id: FOODS[n].id, name: FOODS[n].name } : { name: n });
  console.log(`[seed] units: ${JSON.stringify(Object.fromEntries(Object.entries(UNITS).map(([k, v]) => [k, !!v])))}`);

  // 4) Recettes complètes — slugs déterministes (slugify du nom amont).
  const RECIPES = [
    {
      name: 'Golden Lentil Soup',
      slug: 'golden-lentil-soup',
      description: 'A bright weeknight soup. Method adapted from [the canonical technique](https://example.com/technique) — simmer gently, never boil hard.',
      category: catDinner, tags: [tagQuick, tagVeg], tools: [toolBlender],
      ingredients: [
        { title: 'Soup base', quantity: 1, unit: cup, food: { name: 'lentil' }, note: 'rinsed' },
        { title: 'Soup base', quantity: 2, unit: tbsp, food: { name: 'olive oil' }, note: '' },
        { title: 'Soup base', quantity: 1, unit: null, food: { name: 'yellow onion' }, note: 'diced' },
        { title: 'Finishing', quantity: 200, unit: gram, food: { name: 'coconut milk' }, note: 'full-fat' },
        { title: 'Finishing', quantity: 0, unit: null, food: { name: 'lemon' }, note: 'juiced, to taste' },
      ],
      instructions: [
        { title: 'Build the base', text: 'Sweat the onion in olive oil until translucent, about 6 minutes. See [our knife-skills guide](https://example.com/knife) for the dice size.' },
        { title: 'Simmer', text: 'Add lentils and 4 cups water. Simmer 20 minutes until lentils collapse.' },
        { title: 'Blend and finish', text: 'Blend until smooth, stir in coconut milk and lemon juice, season to taste.' },
      ],
      notes: [{ title: 'Make ahead', text: 'Keeps 4 days refrigerated. Thin with water when reheating.' }],
      extra: { prepTime: '10 minutes', cookTime: '30 minutes', recipeServings: 4, recipeYield: '4 bowls' },
      nutrition: { calories: '310', fatContent: '12', carbohydrateContent: '38', proteinContent: '14' },
      rating: 5, favorite: true, withImage: true,
    },
    {
      name: 'Midnight Chocolate Cake',
      slug: 'midnight-chocolate-cake',
      description: 'Dense, dark, one-bowl. Recipe shared by [a colleague](https://example.com/source) and scaled for an 8-inch pan.',
      category: catDessert, tags: [tagVeg], tools: [toolOven],
      ingredients: [
        { title: null, quantity: 250, unit: gram, food: { name: 'flour' }, note: '' },
        { title: null, quantity: 2, unit: null, food: { name: 'egg' }, note: 'room temperature' },
        { title: null, quantity: 120, unit: gram, food: { name: 'dark chocolate' }, note: 'melted' },
      ],
      instructions: [
        { title: 'Mix', text: 'Whisk dry ingredients, fold in eggs and melted chocolate until just combined.' },
        { title: 'Bake', text: 'Bake at 175°C for 35 minutes; a skewer should come out with a few moist crumbs.' },
      ],
      notes: [],
      extra: { prepTime: '15 minutes', cookTime: '35 minutes', recipeServings: 8 },
      nutrition: { calories: '420', fatContent: '18', carbohydrateContent: '55', proteinContent: '7' },
      rating: 0, favorite: false, withImage: false,
    },
    {
      name: 'Herb Sheet-Pan Chicken',
      slug: 'herb-sheet-pan-chicken',
      description: 'Everything on one tray. Pairs with the soup.',
      category: catDinner, tags: [tagQuick], tools: [toolOven],
      ingredients: [
        { title: 'Protein', quantity: 4, unit: null, food: { name: 'chicken thigh' }, note: 'bone-in' },
        { title: 'Vegetables', quantity: 500, unit: gram, food: { name: 'potato' }, note: 'halved' },
        { title: 'Vegetables', quantity: 2, unit: tbsp, food: { name: 'olive oil' }, note: '' },
      ],
      instructions: [
        { title: 'Roast', text: 'Toss everything with oil and herbs, roast at 200°C for 40 minutes.' },
      ],
      notes: [{ title: 'Swap', text: 'Swap potatoes for squash in autumn.' }],
      extra: { prepTime: '10 minutes', cookTime: '40 minutes', recipeServings: 4 },
      nutrition: { calories: '540', fatContent: '24', carbohydrateContent: '30', proteinContent: '44' },
      rating: 0, favorite: false, withImage: false,
    },
    {
      name: 'Shared Lemon Bars',
      slug: 'shared-lemon-bars',
      description: 'The recipe we publish via share link — public page coverage.',
      category: catDessert, tags: [tagQuick], tools: [toolOven],
      ingredients: [
        { title: null, quantity: 150, unit: gram, food: { name: 'butter' }, note: 'melted' },
        { title: null, quantity: 3, unit: null, food: { name: 'lemon' }, note: 'zested and juiced' },
      ],
      instructions: [
        { title: 'Crust', text: 'Press the shortbread base into a lined pan, bake 15 minutes.' },
        { title: 'Curd', text: 'Whisk lemon juice, zest, sugar and eggs; pour over crust, bake 20 minutes more.' },
      ],
      notes: [],
      extra: { prepTime: '20 minutes', cookTime: '35 minutes', recipeServings: 12 },
      nutrition: { calories: '210' },
      rating: 0, favorite: false, withImage: false,
      share: true,
    },
  ];

  const slugToRecipe = {};
  for (const spec of RECIPES) {
    let rec = await api(`/api/recipes/${spec.slug}`);
    let recipeId;
    if (rec.status === 404) {
      const created = must(await api('/api/recipes', { method: 'POST', body: { name: spec.name } }), `create ${spec.slug}`, [201]);
      const slug = typeof created === 'string' ? created : created?.slug || spec.slug;
      rec = await api(`/api/recipes/${slug}`);
      recipeId = rec.data?.id;
    } else {
      recipeId = rec.data?.id;
    }
    if (!recipeId) throw new Error(`recipe ${spec.slug}: id introuvable`);
    // PUT le contenu complet (idempotent : même corps à chaque run)
    const existing = rec.data;
    const ingredients = spec.ingredients.map(i => ({
      title: i.title, quantity: i.quantity,
      unit: i.unit && i.unit.id ? { id: i.unit.id, name: i.unit.name } : null,
      food: F(i.food.name), note: i.note, display: '', originalText: i.note || '',
      referenceId: null,
    }));
    const body = {
      ...existing,
      id: recipeId,
      name: spec.name,
      slug: spec.slug,
      description: spec.description,
      recipeIngredient: ingredients,
      recipeInstructions: spec.instructions,
      notes: spec.notes,
      recipeCategory: [spec.category],
      tags: spec.tags,
      tools: spec.tools,
      nutrition: spec.nutrition,
      ...spec.extra,
    };
    const put = must(await api(`/api/recipes/${spec.slug}`, { method: 'PUT', body }), `update ${spec.slug}`);
    slugToRecipe[spec.slug] = { id: recipeId, slug: put.slug || spec.slug };
    console.log(`[seed] recipe ${spec.slug} id=${recipeId}`);

    if (spec.rating) {
      await api(`/api/users/${me.id}/ratings/${spec.slug}`, { method: 'POST', body: { rating: spec.rating } });
      console.log(`[seed] rating ${spec.slug}=${spec.rating}`);
    }
    if (spec.favorite) {
      await api(`/api/users/${me.id}/favorites/${spec.slug}`, { method: 'POST' });
    }
    if (spec.withImage) {
      const { readFileSync } = await import('node:fs');
      const img = readFileSync(PNG_PATH);
      const fd = new FormData();
      fd.append('image', new Blob([img], { type: 'image/png' }), 'recipe.png');
      fd.append('extension', 'png');
      const r = await fetch(`${BASE}/api/recipes/${spec.slug}/image`, {
        method: 'PUT', headers: { Authorization: `Bearer ${TOKEN}` }, body: fd,
      });
      if (![200, 201, 204].includes(r.status)) {
        console.warn(`[seed] image ${spec.slug}: HTTP ${r.status} (non bloquant)`);
      } else {
        console.log(`[seed] image ${spec.slug} uploadée`);
      }
    }
  }

  // 5) Cookbook filtré sur tag Quick
  const cbName = 'Weeknight Staples';
  const cbs = await api('/api/households/cookbooks?page=1&perPage=50');
  let cookbook = cbs.data?.items?.find(c => c.name === cbName);
  if (!cookbook) {
    cookbook = must(await api('/api/households/cookbooks', {
      method: 'POST',
      body: { name: cbName, description: 'Quick recipes for weeknights', queryFilterString: `tags.id IN ["${tagQuick.id}"]` },
    }), 'cookbook', [201]);
  }
  console.log(`[seed] cookbook ${cookbook.slug || cbName}`);

  // 6) Meal plan — dates relatives au run (déterministes à jour près)
  const today = new Date();
  const iso = d => d.toISOString().slice(0, 10);
  const tomorrow = new Date(today.getTime() + 86400000);
  const planList = await api(`/api/households/mealplans?page=1&perPage=50&start_date=${iso(today)}&end_date=${iso(tomorrow)}`);
  const haveEntries = planList.data?.items?.length || 0;
  if (!haveEntries) {
    for (const [d, t, rslug] of [
      [iso(today), 'dinner', 'golden-lentil-soup'],
      [iso(tomorrow), 'dinner', 'midnight-chocolate-cake'],
      [iso(tomorrow), 'breakfast', 'shared-lemon-bars'],
    ]) {
      const r = await api('/api/households/mealplans', {
        method: 'POST',
        body: { date: d, entryType: t, title: '', text: '', recipeId: slugToRecipe[rslug].id },
      });
      if (r.status !== 201) console.warn(`[seed] mealplan ${d}/${t}: HTTP ${r.status}`);
    }
    console.log('[seed] mealplan: 3 entrées');
  } else {
    console.log(`[seed] mealplan: ${haveEntries} entrées existantes`);
  }

  // 7) Liste de courses + items
  const lists = await api('/api/households/shopping/lists?page=1&perPage=50');
  let list = lists.data?.items?.find(l => l.name === 'Weekly Groceries');
  if (!list) {
    list = must(await api('/api/households/shopping/lists', {
      method: 'POST', body: { name: 'Weekly Groceries', extras: {}, labelSettings: [] },
    }), 'shopping list', [201]);
  }
  const items = await api(`/api/households/shopping/items?page=1&perPage=50&shoppingListId=${list.id}`);
  if (!(items.data?.items?.length)) {
    const mk = (note, qty, foodName, unitObj) => ({
      shoppingListId: list.id, checked: false, position: 0, quantity: qty,
      unit: unitObj && unitObj.id ? { id: unitObj.id, name: unitObj.name } : null,
      food: foodName ? F(foodName) : null, note, labelId: labelStaple.id, label: labelStaple,
      extras: {}, recipeReferences: [], ingredientReferences: [],
    });
    const r = await api('/api/households/shopping/items/create-bulk', {
      method: 'POST',
      body: [mk('red lentils', 2, 'lentil', cup), mk('olive oil', 1, 'olive oil', null), mk('bread flour', 500, 'flour', gram), mk('A note-only item', 1, null, null)],
    });
    if (![200, 201].includes(r.status)) console.warn(`[seed] shopping items: HTTP ${r.status}`);
    else console.log('[seed] shopping items créés');
  } else {
    console.log(`[seed] shopping items: ${items.data.items.length} existants`);
  }

  // 8) Token de partage public sur Shared Lemon Bars
  const shares = await api(`/api/shared/recipes?recipe_id=${slugToRecipe['shared-lemon-bars'].id}`);
  let shareToken = Array.isArray(shares.data) && shares.data.length ? shares.data[0].id : null;
  if (!shareToken) {
    const st = must(await api('/api/shared/recipes', {
      method: 'POST', body: { recipeId: slugToRecipe['shared-lemon-bars'].id },
    }), 'share token', [201]);
    shareToken = st.id;
  }
  console.log(`[seed] share token ${shareToken}`);

  // 9) Second utilisateur non-admin (members/admin pages non vides)
  const users = await api('/api/admin/users?page=1&perPage=50');
  if (!users.data?.items?.find(u => u.username === 'seeduser')) {
    const u = await api('/api/admin/users', {
      method: 'POST',
      body: {
        username: 'seeduser', fullName: 'Seed User', email: 'seeduser@example.com',
        password: 'SeedPass123!', passwordConfirm: 'SeedPass123!',
        admin: false, group: 'Home', household: 'Family',
        advanced: false, canInvite: false, canManage: false, canManageHousehold: false, canOrganize: false,
      },
    });
    if (![200, 201].includes(u.status)) console.warn(`[seed] user2: HTTP ${u.status} ${JSON.stringify(u.data).slice(0, 200)}`);
    else console.log('[seed] utilisateur seeduser créé');
  }

  // 10) Sortie env pour auditCommands/STATES
  const { writeFileSync } = await import('node:fs');
  writeFileSync(OUT, JSON.stringify({
    baseUrl: BASE, groupSlug, adminId: me.id,
    recipes: slugToRecipe,
    shareToken, cookbookSlug: cookbook.slug || null, shoppingListId: list.id,
    seededAt: new Date().toISOString(),
  }, null, 2));
  // Fichiers d'URLs rejouables (chemins relatifs — le scan les résout contre
  // sa propre base :7044/:7054/:7064). Régénérés à chaque run du seed.
  const urlsAuth = [
    '/g/home',
    '/g/home/r/golden-lentil-soup',
    '/g/home/r/midnight-chocolate-cake',
    '/g/home/r/herb-sheet-pan-chicken',
    '/g/home/r/shared-lemon-bars',
    '/g/home/r/create/new',
    `/g/home/cookbooks/${cookbook.slug}`,
    '/g/home/recipes/categories',
    '/g/home/recipes/tags',
    '/g/home/recipes/tools',
    '/g/home/recipes/finder',
    '/g/home/recipes/timeline',
    '/household/mealplan/planner/?start=2026-10-08&end=2026-10-14',
    '/household/mealplan/settings/',
    `/shopping-lists/${list.id}`,
    '/group/',
    '/group/data/foods/',
    '/group/data/units/',
    '/group/data/categories/',
    '/group/data/tags/',
    '/group/data/labels/',
    '/group/data/tools/',
    '/group/data/pages/',
    '/group/data/recipe-actions/',
    '/group/data/recipes/',
    '/group/migrations/',
    '/group/reports/',
    '/household/',
    '/household/members/',
    '/household/notifiers/',
    '/household/webhooks/',
    '/user/profile/',
    `/user/${me.id}/favorites`,
    '/admin/site-settings/',
    '/admin/manage/users/',
    '/admin/manage/groups/',
    '/admin/manage/households/',
    '/admin/backups/',
    '/admin/maintenance/',
    '/admin/debug/parser/',
    '/admin/setup/',
  ].join('\n') + '\n';
  const urlsPublic = [
    '/login/',
    '/forgot-password/',
    '/register/',
    `/g/home/shared/r/${shareToken}`,
  ].join('\n') + '\n';
  writeFileSync(new URL('./urls-auth.txt', import.meta.url).pathname, urlsAuth);
  writeFileSync(new URL('./urls-public.txt', import.meta.url).pathname, urlsPublic);
  console.log('[seed] urls-auth.txt + urls-public.txt régénérés');

  console.log(`[seed] OK → ${OUT}`);

  // 11) DERNIER : sortir le compte admin de « first login » — l'amont
  // (/api/app/about/startup-info) considère l'instance non initialisée tant
  // qu'un utilisateur porte _DEFAULT_EMAIL (changeme@example.com), et le
  // login force alors la redirection /admin/setup. On renomme l'email
  // admin → le seed reste idempotent (le login du seed tolère l'un ou
  // l'autre email). /admin/setup reste auditable comme URL dédiée.
  if (me.email === 'changeme@example.com') {
    const upd = await api(`/api/admin/users/${me.id}`, {
      method: 'PUT',
      body: { ...me, email: 'admin@example.com' },
    });
    if (upd.status !== 200) console.warn(`[seed] rename admin email: HTTP ${upd.status}`);
    else console.log('[seed] admin email → admin@example.com (first-login terminé)');
  } else {
    console.log(`[seed] admin email déjà ${me.email}`);
  }
}

main().catch(e => { console.error('[seed] FAIL:', e.message); process.exit(1); });
