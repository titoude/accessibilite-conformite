#!/usr/bin/env node
// Cycle 54 — seed déterministe twenty via GraphQL (MES données — leçons 44/46).
// Crée (idempotente : search puis create si absent) les records « A11y C54 … »
// sur le workspace du compte seedé (tim@apple.dev), puis écrit seed-info.json
// = SOURCE UNIQUE des ids (commité). Sortie ≠ 0 si une étape échoue.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const BASE = process.env.BASE || 'http://localhost:9540';
const EMAIL = process.env.TWENTY_USER || 'tim@apple.dev';
const PASS = process.env.TWENTY_PASS || 'tim@apple.dev';
const here = dirname(fileURLToPath(import.meta.url));

const gql = async (path, query, token) => {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL ${path}: ${JSON.stringify(json.errors).slice(0, 400)}`);
  return json.data;
};

// 1. Auth : getLoginTokenFromCredentials + getAuthTokensFromLoginToken (endpoint /metadata)
const { getLoginTokenFromCredentials } = await gql(
  '/metadata',
  `mutation { getLoginTokenFromCredentials(email: ${JSON.stringify(EMAIL)}, password: ${JSON.stringify(PASS)}, origin: ${JSON.stringify(BASE)}) { loginToken { token } } }`,
);
const { getAuthTokensFromLoginToken } = await gql(
  '/metadata',
  `mutation { getAuthTokensFromLoginToken(loginToken: ${JSON.stringify(getLoginTokenFromCredentials.loginToken.token)}, origin: ${JSON.stringify(BASE)}) { tokens { accessOrWorkspaceAgnosticToken { token } refreshToken { token } } } }`,
);
const ACCESS = getAuthTokensFromLoginToken.tokens.accessOrWorkspaceAgnosticToken.token;
console.log('[seed] auth OK');

// 2. Helpers find-or-create sur le schema workspace (/graphql)
// filterGql = fragment de filter verbatim (ex. name:{eq:"X"} ou emails:{primaryEmail:{eq:"x"}})
const findOne = async (objectPlural, filterGql, fields) => {
  const data = await gql('/graphql',
    `query { ${objectPlural}(filter:{${filterGql}}, first:1) { edges { node { ${fields} } } } }`, ACCESS);
  return data[objectPlural]?.edges?.[0]?.node ?? null;
};
const ensure = async (objectSingular, objectPlural, filterGql, createData, fields) => {
  const found = await findOne(objectPlural, filterGql, 'id');
  if (found) return { id: found.id, created: false };
  const data = await gql('/graphql',
    `mutation { ${objectSingular}(data:${createData}) { ${fields} } }`, ACCESS);
  return { ...data[objectSingular], created: true };
};

// 3. Records déterministes (noms stables → findable quelles que soient les données démo)
const company = await ensure('createCompany', 'companies', 'name:{eq:"A11y C54 Company"}',
  `{name:"A11y C54 Company", domainName:{primaryLinkUrl:"https://a11y-c54.example"}}`, 'id name');
const person = await ensure('createPerson', 'people', 'emails:{primaryEmail:{eq:"a11y-c54@example.dev"}}',
  `{name:{firstName:"A11y",lastName:"C54 Person"}, emails:{primaryEmail:"a11y-c54@example.dev"}, companyId:"${company.id}"}`,
  'id name { firstName lastName }');
const opportunity = await ensure('createOpportunity', 'opportunities', 'name:{eq:"A11y C54 Deal"}',
  `{name:"A11y C54 Deal", stage:MEETING, companyId:"${company.id}", pointOfContactId:"${person.id}"}`,
  'id name stage');

console.log('[seed] records:', JSON.stringify({ company: company.id, person: person.id, opportunity: opportunity.id }));

// 4. Vue kanban « By Stage » sur opportunity — résolue dynamiquement (leçon 44),
//    commitée ici = source unique ; les états audit la lisent depuis ce fichier.
const { objects } = await gql('/metadata',
  `{ objects(paging:{first:60}) { edges { node { id nameSingular } } } }`, ACCESS);
const oppObjId = objects.edges.find(e => e.node.nameSingular === 'opportunity')?.node?.id;
if (!oppObjId) throw new Error('objectMetadata opportunity introuvable');
const { getViews } = await gql('/metadata',
  `{ getViews(viewTypes:[KANBAN]) { id name type objectMetadataId } }`, ACCESS);
const kanbanView = getViews.find(v => v.objectMetadataId === oppObjId);
if (!kanbanView) throw new Error('vue kanban opportunity introuvable');
console.log('[seed] kanban view:', kanbanView.id, kanbanView.name);

const info = {
  base: BASE,
  user: { email: EMAIL, password: PASS, note: 'compte du seed dev upstream (workspace Apple)' },
  workspace: 'apple',
  records: {
    company: { id: company.id, name: 'A11y C54 Company' },
    person: { id: person.id, name: 'A11y C54 Person', email: 'a11y-c54@example.dev' },
    opportunity: { id: opportunity.id, name: 'A11y C54 Deal', stage: 'MEETING' },
  },
  views: { kanbanOpportunity: { id: kanbanView.id, name: kanbanView.name } },
  seededAt: new Date().toISOString(),
};
writeFileSync(join(here, 'seed-info.json'), JSON.stringify(info, null, 2) + '\n');
console.log('[seed] seed-info.json écrit');
