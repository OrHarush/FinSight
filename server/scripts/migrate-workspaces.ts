import 'dotenv/config';

import mongoose, { Types } from 'mongoose';
import readline from 'readline';

const PROD_DB_NAME = 'lyra';
const PERSONAL_WORKSPACE_NAME = 'האישי שלי';
const DEFAULT_CURRENCY = 'ILS';

const SCOPED_COLLECTIONS = [
  'accounts',
  'categories',
  'transactions',
  'payment_methods',
  'recurringTemplates',
  'budgets',
  'goals',
] as const;

type ScopedCollection = (typeof SCOPED_COLLECTIONS)[number];

interface UserDoc {
  _id: Types.ObjectId;
  displayCurrency?: string;
  activeWorkspaceId?: Types.ObjectId;
}

interface WorkspaceMemberDoc {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  role: 'owner' | 'member';
}

interface WorkspaceDoc {
  _id: Types.ObjectId;
  name: string;
  type: 'personal' | 'shared';
  currency: string;
}

interface CollectionCounts {
  total: number;
  missingWorkspaceId: number;
}

type CountsByCollection = Record<ScopedCollection, CollectionCounts>;

interface PerUserResult {
  userId: string;
  workspaceCreated: boolean;
  workspaceId: string;
  updatedPerCollection: Record<ScopedCollection, number>;
}

const parseDbName = (uri: string): string => {
  const url = new URL(uri);
  const name = url.pathname.replace(/^\/+/, '').split('?')[0];

  if (!name) {
    throw new Error('Could not parse a database name from MONGO_URI (empty pathname).');
  }

  return decodeURIComponent(name);
};

const promptConfirmation = async (expected: string, isProd: boolean): Promise<boolean> => {
  console.log('');
  console.log('==============================================================');
  console.log(`  About to backfill workspaces into database: "${expected}"`);
  console.log('  This will INSERT new Workspace + WorkspaceMember docs and');
  console.log('  SET workspaceId on every scoped collection where missing.');

  if (isProd) {
    console.log('');
    console.log('  !!! THIS IS THE PRODUCTION DATABASE !!!');
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

const countCollection = async (
  db: mongoose.mongo.Db,
  name: ScopedCollection
): Promise<CollectionCounts> => {
  const collection = db.collection(name);
  const [total, missingWorkspaceId] = await Promise.all([
    collection.countDocuments({}),
    collection.countDocuments({ workspaceId: { $exists: false } }),
  ]);

  return { total, missingWorkspaceId };
};

const captureCounts = async (db: mongoose.mongo.Db): Promise<CountsByCollection> => {
  const entries = await Promise.all(
    SCOPED_COLLECTIONS.map(async name => [name, await countCollection(db, name)] as const)
  );

  return Object.fromEntries(entries) as CountsByCollection;
};

const findExistingPersonalWorkspaceId = async (
  db: mongoose.mongo.Db,
  userId: Types.ObjectId
): Promise<Types.ObjectId | null> => {
  const memberRows = await db
    .collection<WorkspaceMemberDoc>('workspace_members')
    .find({ userId })
    .project<{ workspaceId: Types.ObjectId }>({ workspaceId: 1 })
    .toArray();

  if (memberRows.length === 0) {
    return null;
  }

  const workspaceIds = memberRows.map(row => row.workspaceId);

  const personal = await db
    .collection<WorkspaceDoc>('workspaces')
    .findOne({ _id: { $in: workspaceIds }, type: 'personal' });

  return personal?._id ?? null;
};

const createPersonalWorkspaceForUser = async (
  db: mongoose.mongo.Db,
  user: UserDoc,
  now: Date
): Promise<Types.ObjectId> => {
  const workspaceId = new Types.ObjectId();

  await db.collection<WorkspaceDoc & { createdAt: Date; updatedAt: Date }>('workspaces').insertOne({
    _id: workspaceId,
    name: PERSONAL_WORKSPACE_NAME,
    type: 'personal',
    currency: user.displayCurrency || DEFAULT_CURRENCY,
    createdAt: now,
    updatedAt: now,
  });

  await db
    .collection<WorkspaceMemberDoc & { joinedAt: Date; createdAt: Date; updatedAt: Date }>(
      'workspace_members'
    )
    .insertOne({
      _id: new Types.ObjectId(),
      workspaceId,
      userId: user._id,
      role: 'owner',
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    });

  await db
    .collection('users')
    .updateOne({ _id: user._id }, { $set: { activeWorkspaceId: workspaceId } });

  return workspaceId;
};

const backfillScopedCollectionsForUser = async (
  db: mongoose.mongo.Db,
  userId: Types.ObjectId,
  workspaceId: Types.ObjectId
): Promise<Record<ScopedCollection, number>> => {
  const entries = await Promise.all(
    SCOPED_COLLECTIONS.map(async name => {
      const result = await db
        .collection(name)
        .updateMany(
          { userId, workspaceId: { $exists: false } },
          { $set: { workspaceId } }
        );

      return [name, result.modifiedCount] as const;
    })
  );

  return Object.fromEntries(entries) as Record<ScopedCollection, number>;
};

const migrateUser = async (db: mongoose.mongo.Db, user: UserDoc): Promise<PerUserResult> => {
  const existing = await findExistingPersonalWorkspaceId(db, user._id);

  if (existing) {
    const backfilled = await backfillScopedCollectionsForUser(db, user._id, existing);

    return {
      userId: user._id.toHexString(),
      workspaceCreated: false,
      workspaceId: existing.toHexString(),
      updatedPerCollection: backfilled,
    };
  }

  const now = new Date();
  const workspaceId = await createPersonalWorkspaceForUser(db, user, now);
  const backfilled = await backfillScopedCollectionsForUser(db, user._id, workspaceId);

  return {
    userId: user._id.toHexString(),
    workspaceCreated: true,
    workspaceId: workspaceId.toHexString(),
    updatedPerCollection: backfilled,
  };
};

const printCountsTable = (label: string, counts: CountsByCollection): void => {
  console.log('');
  console.log('==============================================================');
  console.log(`  ${label}`);
  console.log('==============================================================');
  console.log('  collection                       total   missing workspaceId');
  console.log('  -----------------------------  --------  -------------------');

  for (const name of SCOPED_COLLECTIONS) {
    const row = counts[name];
    const padded = name.padEnd(29);
    const total = String(row.total).padStart(8);
    const missing = String(row.missingWorkspaceId).padStart(19);
    console.log(`  ${padded}  ${total}  ${missing}`);
  }

  console.log('');
};

const verifyPostMigration = (
  pre: CountsByCollection,
  post: CountsByCollection
): { ok: boolean; failures: string[] } => {
  const failures: string[] = [];

  for (const name of SCOPED_COLLECTIONS) {
    if (post[name].total !== pre[name].total) {
      failures.push(
        `${name}: total drifted (pre=${pre[name].total}, post=${post[name].total})`
      );
    }

    if (post[name].missingWorkspaceId !== 0) {
      failures.push(
        `${name}: ${post[name].missingWorkspaceId} doc(s) still missing workspaceId`
      );
    }
  }

  return { ok: failures.length === 0, failures };
};

const run = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI environment variable is required.');
    process.exit(1);
  }

  const dbName = parseDbName(mongoUri);
  const isProd = dbName === PROD_DB_NAME;

  const confirmed = await promptConfirmation(dbName, isProd);

  if (!confirmed) {
    console.error('Aborted: database name did not match. No connection opened.');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB (db: ${dbName})...`);
  await mongoose.connect(mongoUri);
  console.log('Connected.');

  try {
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Mongoose connection has no underlying db handle.');
    }

    const preCounts = await captureCounts(db);
    printCountsTable('Pre-migration counts', preCounts);

    const users = await db
      .collection<UserDoc>('users')
      .find({})
      .project<UserDoc>({ _id: 1, displayCurrency: 1, activeWorkspaceId: 1 })
      .toArray();

    console.log(`Found ${users.length} user(s). Starting backfill...`);
    console.log('');

    let created = 0;
    let skipped = 0;

    for (const user of users) {
      const result = await migrateUser(db, user);

      if (result.workspaceCreated) {
        created += 1;
      } else {
        skipped += 1;
      }

      const tag = result.workspaceCreated ? 'created' : 'existing';
      const updatedTotals = SCOPED_COLLECTIONS.map(
        name => `${name}=${result.updatedPerCollection[name]}`
      ).join(' ');

      console.log(
        `  user ${result.userId} → workspace ${result.workspaceId} (${tag}); updated ${updatedTotals}`
      );
    }

    console.log('');
    console.log(`Workspaces created: ${created}`);
    console.log(`Workspaces already present (skipped creation): ${skipped}`);
    console.log(`Total users processed: ${users.length}`);

    const postCounts = await captureCounts(db);
    printCountsTable('Post-migration counts', postCounts);

    const verification = verifyPostMigration(preCounts, postCounts);

    if (!verification.ok) {
      console.error('==============================================================');
      console.error('  MIGRATION VERIFICATION FAILED');
      console.error('==============================================================');

      for (const failure of verification.failures) {
        console.error(`  - ${failure}`);
      }

      console.error('');
      process.exitCode = 1;

      return;
    }

    console.log('Verification passed: every scoped doc has a workspaceId, totals unchanged.');
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
};

run().catch(err => {
  console.error('Migration failed:', err);
  void mongoose.disconnect().finally(() => process.exit(1));
});
