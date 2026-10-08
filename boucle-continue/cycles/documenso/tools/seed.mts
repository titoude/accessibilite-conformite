/**
 * Cycle 53 — seed Documenso (MES données).
 * Copié à la racine du repo par tools/seed.sh puis exécuté via `npx tsx a11y-seed.mts`.
 * Écrit tools/seed-info.json (chemin absolu passé en argv[2]) — source unique des ids (leçon 44/46).
 * Idempotent : supprime l'utilisateur a11y s'il existe déjà.
 */
import fs from 'node:fs';

import { prisma } from '@documenso/prisma';
import { Prisma } from '@prisma/client';

import {
  seedDraftDocument,
  seedPendingDocumentWithFullFields,
} from './packages/prisma/seed/documents';
import { seedTemplate } from './packages/prisma/seed/templates';
import { seedUser, unseedUserByEmail } from './packages/prisma/seed/users';

const OUT_PATH = process.argv[2];
if (!OUT_PATH) {
  throw new Error('usage: tsx a11y-seed.mts <abs-path-to-seed-info.json>');
}

const EMAIL = 'a11y.cycle53@documenso.dev';
const PASSWORD = 'A11y-Cycle53-worker!';
const SIGNER1 = 'c53.signer1@documenso.dev';
const SIGNER2 = 'c53.signer2@documenso.dev';

const main = async () => {
  await unseedUserByEmail(EMAIL).catch(() => undefined);

  const { user, organisation, team } = await seedUser({
    name: 'A11y Cycle53',
    email: EMAIL,
    password: PASSWORD,
  });

  // Draft — cible de l'éditeur de champs nouvelle génération (internalVersion 2 requis).
  const draft = await seedDraftDocument(user, team.id, [SIGNER1, SIGNER2], {
    key: 'c53-draft',
    internalVersion: 2,
    createDocumentOptions: { title: 'C53 Draft multi-signataires' },
  });

  // Champs supplémentaires dans le draft pour l'éditeur (positions % 0-100).
  const draftItem = await prisma.envelopeItem.findFirstOrThrow({
    where: { envelopeId: draft.id },
    orderBy: { order: 'asc' },
  });
  const draftRecips = await prisma.recipient.findMany({
    where: { envelopeId: draft.id },
    orderBy: { id: 'asc' },
  });
  const draftFieldTypes = ['SIGNATURE', 'NAME', 'EMAIL', 'DATE', 'TEXT'] as const;
  for (const [ri, rec] of draftRecips.entries()) {
    for (const [fi, type] of draftFieldTypes.entries()) {
      await prisma.field.create({
        data: {
          page: 1,
          type,
          inserted: false,
          customText: '',
          positionX: new Prisma.Decimal(10 + ri * 45),
          positionY: new Prisma.Decimal(10 + fi * 12),
          width: new Prisma.Decimal(30),
          height: new Prisma.Decimal(8),
          envelopeId: draft.id,
          envelopeItemId: draftItem.id,
          recipientId: rec.id,
        },
      });
    }
  }

  // Pending — flow de signature multi-signataires (/sign/<token>), champs complets.
  const { document: pending, recipients: pendingRecips } = await seedPendingDocumentWithFullFields({
    owner: user,
    teamId: team.id,
    recipients: [SIGNER1, SIGNER2],
    updateDocumentOptions: {
      internalVersion: 2,
      title: 'C53 Pending multi-signataires',
    },
  });

  // Template v2.
  const template = await seedTemplate({
    title: 'C53 Template a11y',
    userId: user.id,
    teamId: team.id,
    internalVersion: 2,
  });

  const info = {
    user: { id: user.id, email: EMAIL, password: PASSWORD, name: 'A11y Cycle53' },
    organisation: { id: organisation.id, url: organisation.url },
    team: { id: team.id, url: team.url, name: team.name },
    documents: {
      draft: {
        id: draft.id,
        title: 'C53 Draft multi-signataires',
        recipients: draftRecips.map((r) => ({ id: r.id, email: r.email, token: r.token })),
      },
      pending: {
        id: pending.id,
        title: 'C53 Pending multi-signataires',
        recipients: pendingRecips.map((r) => ({ id: r.id, email: r.email, token: r.token })),
      },
    },
    template: { id: template.id, title: 'C53 Template a11y' },
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(info, null, 2) + '\n');
  console.log('[C53 SEED]', JSON.stringify({ user: EMAIL, teamUrl: team.url, draft: draft.id, pending: pending.id, template: template.id }));
};

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
