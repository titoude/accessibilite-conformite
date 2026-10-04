// seed.mjs — seed littérale et rejouable du cycle docmost (v2).
// Produit : workspace + admin, espace 'general' publié en public, page réelle
// avec TITRE + CONTENU + AU MOINS UN LIEN (règle « seed littérale » du
// protocole — le doc public /docs/general/YE3rIig7Vn doit rendre du contenu
// axe-significatif : éditeurs read-only, lien, table des matières).
//
// Pré-requis : API docmost sur $API (défaut http://localhost:3010), stack
// docker pg-docmost (postgres:postgres/docmost) + redis-docmost démarrés,
// migrations kysely appliquées (pnpm --filter @docmost/server migration:latest),
// .env avec BETA_PUBLIC_SPACES=true.
//
// Usage : node seed.mjs   (idempotent — saute les étapes déjà faites)
import { execSync } from "node:child_process";

const API = process.env.API || "http://localhost:3010";
const ADMIN = { email: "admin@test.local", password: "adminpass123" };
const PAGE_SLUG = "YE3rIig7Vn";

// Contenu LITTÉRAL de la page auditée (markdown → pages/create format:'markdown').
// Exigences protocole : titre + contenu + au moins un lien. Ajout d'headings
// pour que docs-toc rende des .tocLink (surface contrastée auditée).
const PAGE_TITLE = "Test page a11y";
const PAGE_MARKDOWN = `# Guide de démarrage

Ce document public décrit la procédure de démarrage du workspace.

## Prérequis

Avant de commencer, consultez la [documentation Docmost](https://docmost.com) pour la configuration initiale.

## Étapes

Ouvrez la page d accueil puis suivez les instructions affichées.`;

const cookie = {};
const req = async (method, url, body) => {
  const res = await fetch(API + url, {
    method,
    headers: {
      "content-type": "application/json",
      ...(cookie.raw ? { cookie: cookie.raw } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const setC = res.headers.getSetCookie?.() || [];
  if (setC.length) cookie.raw = setC.map((c) => c.split(";")[0]).join("; ");
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
};

const sql = (q) =>
  execSync(
    `docker exec pg-docmost psql -U postgres -d docmost -tA -c "${q.replaceAll('"', '\\"')}"`,
    { encoding: "utf8" },
  ).trim();

// 1. Workspace + admin (POST /api/auth/setup — premier boot uniquement)
let r = await req("POST", "/api/auth/setup", {
  workspaceName: "Audit WS",
  name: "Admin",
  email: ADMIN.email,
  password: ADMIN.password,
});
if (r.status === 200 || r.status === 201) {
  console.log("setup : workspace créé");
} else {
  console.log(`setup : ${r.status} (déjà provisionné — login direct)`);
  r = await req("POST", "/api/auth/login", {
    email: ADMIN.email,
    password: ADMIN.password,
  });
  if (!r.json?.success && r.status !== 200)
    throw new Error("login impossible : " + JSON.stringify(r.json));
}

// 2. IDs réels depuis la DB (pas de valeurs codées en dur)
const workspaceId = sql(`SELECT id FROM workspaces ORDER BY created_at LIMIT 1`);
const spaceId = sql(`SELECT id FROM spaces WHERE slug='general' LIMIT 1`);
console.log(`workspace=${workspaceId} space=${spaceId} (general)`);

// 3. allowPublicSpaces au niveau workspace (gate avant publish)
r = await req("POST", "/api/workspace/update", {
  workspaceId,
  allowPublicSpaces: true,
});
console.log(`workspace/update allowPublicSpaces : ${r.status}`);

// 4. Page avec contenu réel (idempotent : réutilise la page si le slug existe)
let pageId = sql(`SELECT id FROM pages WHERE slug_id='${PAGE_SLUG}'`);
if (!pageId) {
  r = await req("POST", "/api/pages/create", {
    spaceId,
    title: PAGE_TITLE,
    content: PAGE_MARKDOWN,
    format: "markdown",
  });
  pageId = r.json?.data?.id;
  if (!pageId) throw new Error("pages/create : " + JSON.stringify(r.json));
  console.log(`page créée ${pageId}`);
  // slug_id fixe → URL publique déterministe /docs/general/YE3rIig7Vn
  sql(`UPDATE pages SET slug_id='${PAGE_SLUG}' WHERE id='${pageId}'`);
} else {
  console.log(`page ${pageId} existante — contenu remplacé`);
  await req("POST", "/api/pages/update", {
    pageId,
    content: PAGE_MARKDOWN,
    format: "markdown",
    operation: "replace",
  });
}

// 5. Publication de l'espace public (docs/general/* accessible sans auth)
r = await req("POST", "/api/public-spaces/publish", {
  spaceId,
  enabled: true,
});
console.log(`publish : ${r.status}`);

// 6. Vérif : le doc public sert du contenu (titre + lien dans le JSON page)
const pub = await req("POST", "/api/public-spaces/page-info", {
  spaceSlug: "general",
  pageSlugId: PAGE_SLUG,
});
if (pub.status !== 200) {
  console.log(`note : probe page-info -> ${pub.status}`);
} else {
  const page = pub.json?.data?.page;
  const rendered = JSON.stringify(page?.content ?? "");
  console.log(
    `page-info OK — titre «${page?.title}», contenu ${rendered.length} chars, lien externe ${/docmost\.com/.test(rendered) ? "rendu" : "ABSENT"}`,
  );
}
console.log(
  `seed OK → app /s/general/p/${PAGE_TITLE.toLowerCase().replaceAll(" ", "-")}-${PAGE_SLUG} ; public /docs/general/${PAGE_SLUG}`,
);
