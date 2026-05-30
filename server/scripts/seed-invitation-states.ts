import * as crypto from 'crypto';

import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import * as readline from 'readline';

if (process.env.ENV_FILE) {
  dotenv.config({ path: process.env.ENV_FILE });
}
dotenv.config({ path: '.env' });

const PROD_DB_NAME = 'lyra';
const SEED_EMAIL_DOMAIN = 'invitations.test';
const PROD_BASE_URL = 'https://lyra-il.com';
const LOCAL_BASE_URL = 'http://localhost:3000';

const SEED_STATES = ['pending', 'expired', 'revoked', 'declined', 'accepted'] as const;
type SeedState = (typeof SEED_STATES)[number];

interface UserDoc {
  _id: Types.ObjectId;
  email: string;
  name?: string;
}

interface WorkspaceDoc {
  _id: Types.ObjectId;
  name: string;
  type: 'personal' | 'shared';
}

interface WorkspaceMemberDoc {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  role: 'owner' | 'member';
}

interface InvitationInsert {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  invitedEmail: string;
  invitedBy: Types.ObjectId;
  token: string;
  status: 'pending' | 'accepted' | 'revoked' | 'declined';
  expiresAt: Date;
  acceptedByUserId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface SeededRow {
  state: SeedState;
  invitedEmail: string;
  token: string;
}

const parseDbName = (uri: string): string => {
  const url = new URL(uri);
  const name = url.pathname.replace(/^\/+/, '').split('?')[0];

  if (!name) {
    throw new Error('Could not parse a database name from MONGO_URI (empty pathname).');
  }

  return decodeURIComponent(name);
};

const isDryRunFlag = (arg: string): boolean =>
  arg === '--dry-run' || arg === '--dryrun' || arg.startsWith('--dry-run=');

const resolveDryRun = (): { dryRun: boolean; source: string } => {
  const argvHit = process.argv.find(isDryRunFlag);

  if (argvHit) {
    return { dryRun: true, source: `argv (${argvHit})` };
  }

  const envValue = process.env.DRY_RUN;

  if (envValue === '1' || envValue === 'true') {
    return { dryRun: true, source: `env DRY_RUN=${envValue}` };
  }

  return { dryRun: false, source: 'no --dry-run flag, no DRY_RUN env' };
};

const printModeBanner = (dryRun: boolean, source: string): void => {
  console.log('');
  console.log('--------------------------------------------------------------');
  console.log(`  argv (after node + script): ${JSON.stringify(process.argv.slice(2))}`);
  console.log(`  DRY_RUN env: ${process.env.DRY_RUN ?? '(unset)'}`);
  console.log(`  resolved from: ${source}`);

  if (dryRun) {
    console.log('  >>> MODE: DRY RUN — no writes will be performed <<<');
  } else {
    console.log('  >>> MODE: LIVE — writes WILL be performed <<<');
  }

  console.log('--------------------------------------------------------------');
  console.log('');
};

const promptConfirmation = async (
  expected: string,
  isProd: boolean,
  dryRun: boolean
): Promise<boolean> => {
  console.log('');
  console.log('==============================================================');
  console.log(`  About to seed invitation rows into database: "${expected}"`);

  if (dryRun) {
    console.log('');
    console.log('  *** DRY RUN — no writes will be performed. ***');
    console.log('  All planned deletes / inserts will be logged only.');
  } else {
    console.log('  This will DELETE any prior seed invitation docs whose');
    console.log('  invitedEmail matches the seed pattern, and INSERT 5 new');
    console.log('  rows (one per state) into workspace_invitations.');
  }

  if (isProd) {
    console.log('');
    console.log('  !!! THIS IS THE PRODUCTION DATABASE !!!');
    console.log('  Seeding into production is almost certainly a mistake.');
  }

  console.log('');
  console.log('  Type the database name exactly to confirm,');
  console.log('  or anything else to abort:');
  console.log('==============================================================');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const answer: string = await new Promise(resolve => {
    rl.question('> ', resolve);
  });

  rl.close();

  return answer.trim() === expected;
};

const readArg = (name: string): string | undefined => {
  const prefix = `--${name}=`;
  const hit = process.argv.find(arg => arg.startsWith(prefix));

  return hit ? hit.slice(prefix.length) : undefined;
};

const resolveInviterUser = async (
  db: mongoose.mongo.Db,
  explicitEmail: string | undefined
): Promise<UserDoc> => {
  const email = (explicitEmail ?? process.env.DEV_AUTH_BYPASS_EMAIL)?.toLowerCase();

  if (!email) {
    throw new Error(
      'No inviter email — pass --user-email=<email> or set DEV_AUTH_BYPASS_EMAIL.'
    );
  }

  const user = await db.collection<UserDoc>('users').findOne({ email });

  if (!user) {
    throw new Error(`Inviter user not found for email: ${email}`);
  }

  return user;
};

const findWorkspaceById = async (
  db: mongoose.mongo.Db,
  workspaceId: string
): Promise<WorkspaceDoc> => {
  if (!Types.ObjectId.isValid(workspaceId)) {
    throw new Error(`Invalid workspace id: ${workspaceId}`);
  }

  const ws = await db
    .collection<WorkspaceDoc>('workspaces')
    .findOne({ _id: new Types.ObjectId(workspaceId) });

  if (!ws) {
    throw new Error(`Workspace not found: ${workspaceId}`);
  }

  return ws;
};

const pickOwnedWorkspace = async (
  db: mongoose.mongo.Db,
  ownerId: Types.ObjectId
): Promise<WorkspaceDoc> => {
  const ownedRows = await db
    .collection<WorkspaceMemberDoc>('workspace_members')
    .find({ userId: ownerId, role: 'owner' })
    .project<{ workspaceId: Types.ObjectId }>({ workspaceId: 1 })
    .toArray();

  if (ownedRows.length === 0) {
    throw new Error(
      `Inviter user ${ownerId.toHexString()} owns no workspaces. Pass --workspace=<id> explicitly.`
    );
  }

  const ownedIds = ownedRows.map(r => r.workspaceId);

  const shared = await db
    .collection<WorkspaceDoc>('workspaces')
    .findOne({ _id: { $in: ownedIds }, type: 'shared' });

  if (shared) {
    return shared;
  }

  console.log('');
  console.log('  WARNING: this user owns no SHARED workspaces — falling back to');
  console.log('  their personal workspace. The seeded landing pages will show');
  console.log('  the personal workspace\'s name ("האישי שלי" by default).');
  console.log('  Open a shared household in the app first, or pass');
  console.log('  --workspace=<id> for a specific shared workspace.');
  console.log('');

  const personal = await db
    .collection<WorkspaceDoc>('workspaces')
    .findOne({ _id: { $in: ownedIds } });

  if (!personal) {
    throw new Error(
      `Inviter owns workspaces by membership but none resolved in workspaces collection.`
    );
  }

  return personal;
};

const resolveWorkspace = async (
  db: mongoose.mongo.Db,
  ownerId: Types.ObjectId,
  explicitWorkspaceId: string | undefined
): Promise<WorkspaceDoc> => {
  if (explicitWorkspaceId) {
    return findWorkspaceById(db, explicitWorkspaceId);
  }

  return pickOwnedWorkspace(db, ownerId);
};

const seedEmailFor = (state: SeedState, matchEmail: string): string =>
  state === 'pending' ? matchEmail.toLowerCase() : `seed-${state}@${SEED_EMAIL_DOMAIN}`;

const buildInvitationDoc = (params: {
  state: SeedState;
  workspaceId: Types.ObjectId;
  inviterId: Types.ObjectId;
  invitedEmail: string;
  now: Date;
}): InvitationInsert => {
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const oneDayAgo = new Date(params.now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAhead = new Date(params.now.getTime() + sevenDays);

  const base = {
    _id: new Types.ObjectId(),
    workspaceId: params.workspaceId,
    invitedEmail: params.invitedEmail.toLowerCase(),
    invitedBy: params.inviterId,
    token: crypto.randomBytes(32).toString('hex'),
    createdAt: params.now,
    updatedAt: params.now,
  };

  switch (params.state) {
    case 'pending':
      return { ...base, status: 'pending', expiresAt: sevenDaysAhead };
    case 'expired':
      return { ...base, status: 'pending', expiresAt: oneDayAgo };
    case 'revoked':
      return { ...base, status: 'revoked', expiresAt: sevenDaysAhead };
    case 'declined':
      return { ...base, status: 'declined', expiresAt: sevenDaysAhead };
    case 'accepted':
      return {
        ...base,
        status: 'accepted',
        expiresAt: sevenDaysAhead,
        acceptedByUserId: params.inviterId,
      };
  }
};

const cleanupPriorSeeds = async (
  db: mongoose.mongo.Db,
  emails: string[],
  dryRun: boolean
): Promise<number> => {
  const filter = { invitedEmail: { $in: emails.map(e => e.toLowerCase()) } };
  const found = await db.collection('workspace_invitations').countDocuments(filter);

  if (found === 0) {
    return 0;
  }

  const existing = await db
    .collection<{ _id: Types.ObjectId; invitedEmail: string; status: string }>(
      'workspace_invitations'
    )
    .find(filter)
    .project<{ _id: Types.ObjectId; invitedEmail: string; status: string }>({
      _id: 1,
      invitedEmail: 1,
      status: 1,
    })
    .toArray();

  for (const row of existing) {
    const action = dryRun ? 'WOULD delete' : 'deleting';
    console.log(
      `  [cleanup] ${action} invitation _id=${row._id.toHexString()} ` +
        `invitedEmail=${row.invitedEmail} status=${row.status}`
    );
  }

  if (dryRun) {
    return found;
  }

  const result = await db.collection('workspace_invitations').deleteMany(filter);

  return result.deletedCount;
};

const insertSeeds = async (
  db: mongoose.mongo.Db,
  docs: { state: SeedState; doc: InvitationInsert }[],
  dryRun: boolean
): Promise<SeededRow[]> => {
  for (const { state, doc } of docs) {
    const action = dryRun ? 'WOULD insert' : 'inserting';
    console.log(
      `  [seed] ${action} state=${state} _id=${doc._id.toHexString()} ` +
        `token=${doc.token.slice(0, 12)}… invitedEmail=${doc.invitedEmail}`
    );
  }

  if (!dryRun) {
    await db.collection<InvitationInsert>('workspace_invitations').insertMany(docs.map(d => d.doc));
  }

  return docs.map(({ state, doc }) => ({
    state,
    invitedEmail: doc.invitedEmail,
    token: doc.token,
  }));
};

const printSeededTable = (
  rows: SeededRow[],
  context: {
    workspace: WorkspaceDoc;
    inviter: UserDoc;
    matchEmail: string;
    dryRun: boolean;
  }
): void => {
  console.log('');
  console.log('==============================================================');
  console.log('  Seeded invitations');
  console.log('==============================================================');
  console.log(`  inviter:        ${context.inviter.email} (${context.inviter._id.toHexString()})`);
  console.log(
    `  workspace:      ${context.workspace.name} ` +
      `[${context.workspace.type}] (${context.workspace._id.toHexString()})`
  );
  console.log(`  match email:    ${context.matchEmail}`);

  if (context.dryRun) {
    console.log('');
    console.log('  *** DRY RUN — nothing was actually inserted. ***');
  }

  for (const row of rows) {
    console.log('');
    console.log(`  [${row.state.toUpperCase()}]`);
    console.log(`    invitedEmail: ${row.invitedEmail}`);
    console.log(`    token:        ${row.token}`);
    console.log(`    prod URL:     ${PROD_BASE_URL}/invitations/${row.token}`);
    console.log(`    local URL:    ${LOCAL_BASE_URL}/invitations/${row.token}`);
  }

  console.log('');
  console.log('==============================================================');
  console.log('  Invalid-token state (no seed needed)');
  console.log('==============================================================');
  console.log(`  Visit ${LOCAL_BASE_URL}/invitations/garbage`);
  console.log(`  The GET will return 404 → page renders the "invalid link" state.`);
  console.log('');
  console.log('==============================================================');
  console.log('  Notes');
  console.log('==============================================================');
  console.log('  - PENDING row uses the inviter\'s own email by default so the');
  console.log('    MATCH state renders out of the box when you\'re logged in as');
  console.log('    that user. To test the MISMATCH state, log in as a different');
  console.log('    Google account, or re-run with --invitee-email=<other-email>.');
  console.log('  - To test the GUEST state, log out before clicking the URL.');
  console.log('  - All other rows trigger their state regardless of auth identity');
  console.log('    (status is checked before user identity in the landing page).');
  console.log('');
};

const run = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI environment variable is required.');
    process.exit(1);
  }

  const { dryRun, source: dryRunSource } = resolveDryRun();
  printModeBanner(dryRun, dryRunSource);

  const dbName = parseDbName(mongoUri);
  const isProd = dbName === PROD_DB_NAME;

  const confirmed = await promptConfirmation(dbName, isProd, dryRun);

  if (!confirmed) {
    console.error('Aborted: database name did not match. No connection opened.');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB (db: ${dbName}${dryRun ? ', DRY RUN' : ''})...`);
  await mongoose.connect(mongoUri);
  console.log('Connected.');

  try {
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Mongoose connection has no underlying db handle.');
    }

    const inviter = await resolveInviterUser(db, readArg('user-email'));
    const workspace = await resolveWorkspace(db, inviter._id, readArg('workspace'));
    const matchEmail = readArg('invitee-email')?.toLowerCase() ?? inviter.email.toLowerCase();

    console.log('');
    console.log(`Inviter:    ${inviter.email} (${inviter._id.toHexString()})`);
    console.log(`Workspace:  ${workspace.name} [${workspace.type}] (${workspace._id.toHexString()})`);
    console.log(`Match email (for the PENDING row): ${matchEmail}`);
    console.log('');

    const now = new Date();
    const docsByState = SEED_STATES.map(state => {
      const invitedEmail = seedEmailFor(state, matchEmail);
      const doc = buildInvitationDoc({
        state,
        workspaceId: workspace._id,
        inviterId: inviter._id,
        invitedEmail,
        now,
      });

      return { state, doc };
    });

    const allEmails = docsByState.map(d => d.doc.invitedEmail);

    console.log('Cleanup phase: removing prior seed invitations matching these emails...');
    const deleted = await cleanupPriorSeeds(db, allEmails, dryRun);
    console.log(
      `Cleanup: ${dryRun ? 'would delete' : 'deleted'} ${deleted} prior seed invitation(s).`
    );
    console.log('');

    console.log('Seed phase: inserting one invitation per state...');
    const seeded = await insertSeeds(db, docsByState, dryRun);

    printSeededTable(seeded, { workspace, inviter, matchEmail, dryRun });
  } finally {
    await mongoose.disconnect();
  }
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
