import 'dotenv/config';

import mongoose, { Types } from 'mongoose';
import * as readline from 'readline';

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
  email?: string;
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

interface OrphanIdPair {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
}

interface OrphanCleanupRow {
  found: number;
  deleted: number;
}

type OrphanCleanupByCollection = Record<ScopedCollection, OrphanCleanupRow>;

const parseDbName = (uri: string): string => {
  const url = new URL(uri);
  const name = url.pathname.replace(/^\/+/, '').split('?')[0];

  if (!name) {
    throw new Error('Could not parse a database name from MONGO_URI (empty pathname).');
  }

  return decodeURIComponent(name);
};

const promptConfirmation = async (
  expected: string,
  isProd: boolean,
  dryRun: boolean
): Promise<boolean> => {
  console.log('');
  console.log('==============================================================');
  console.log(`  About to backfill workspaces into database: "${expected}"`);

  if (dryRun) {
    console.log('');
    console.log('  *** DRY RUN — no writes will be performed. ***');
    console.log('  All planned inserts / updates / deletes will be logged only.');
  } else {
    console.log('  This will INSERT new Workspace + WorkspaceMember docs and');
    console.log('  SET workspaceId on every scoped collection where missing.');
  }

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
  workspaceId: Types.ObjectId,
  dryRun: boolean
): Promise<Record<ScopedCollection, number>> => {
  const entries = await Promise.all(
    SCOPED_COLLECTIONS.map(async name => {
      const filter = { userId, workspaceId: { $exists: false } };

      if (dryRun) {
        const wouldModify = await db.collection(name).countDocuments(filter);
        return [name, wouldModify] as const;
      }

      const result = await db.collection(name).updateMany(filter, { $set: { workspaceId } });
      return [name, result.modifiedCount] as const;
    })
  );

  return Object.fromEntries(entries) as Record<ScopedCollection, number>;
};

const findOrphansInCollection = async (
  db: mongoose.mongo.Db,
  name: ScopedCollection,
  validUserIdHexes: Set<string>
): Promise<OrphanIdPair[]> => {
  const docs = await db
    .collection<OrphanIdPair>(name)
    .find({})
    .project<OrphanIdPair>({ _id: 1, userId: 1 })
    .toArray();

  return docs.filter(doc => {
    if (!doc.userId) {
      return true;
    }

    return !validUserIdHexes.has(doc.userId.toHexString());
  });
};

const logOrphans = (name: ScopedCollection, orphans: OrphanIdPair[]): void => {
  for (const orphan of orphans) {
    const orphanUserId = orphan.userId ? orphan.userId.toHexString() : '<missing>';
    console.log(`  [ORPHAN] ${name} _id=${orphan._id.toHexString()} userId=${orphanUserId}`);
  }
};

const deleteOrphansInCollection = async (
  db: mongoose.mongo.Db,
  name: ScopedCollection,
  orphans: OrphanIdPair[],
  dryRun: boolean
): Promise<number> => {
  if (orphans.length === 0 || dryRun) {
    return 0;
  }

  const ids = orphans.map(doc => doc._id);
  const result = await db.collection(name).deleteMany({ _id: { $in: ids } });

  return result.deletedCount;
};

const cleanupOrphans = async (
  db: mongoose.mongo.Db,
  validUserIdHexes: Set<string>,
  dryRun: boolean
): Promise<OrphanCleanupByCollection> => {
  const result = {} as OrphanCleanupByCollection;

  for (const name of SCOPED_COLLECTIONS) {
    const orphans = await findOrphansInCollection(db, name, validUserIdHexes);
    logOrphans(name, orphans);
    const deleted = await deleteOrphansInCollection(db, name, orphans, dryRun);
    result[name] = { found: orphans.length, deleted };
  }

  return result;
};

const printOrphanTable = (counts: OrphanCleanupByCollection, dryRun: boolean): void => {
  const actionColumn = dryRun ? 'would delete' : 'deleted';

  console.log('');
  console.log('==============================================================');
  console.log('  Orphan cleanup summary');
  console.log('==============================================================');
  console.log(`  collection                       found   ${actionColumn}`);
  console.log('  -----------------------------  --------  ------------');

  for (const name of SCOPED_COLLECTIONS) {
    const row = counts[name];
    const padded = name.padEnd(29);
    const found = String(row.found).padStart(8);
    const action = String(dryRun ? row.found : row.deleted).padStart(actionColumn.length);
    console.log(`  ${padded}  ${found}  ${action}`);
  }

  console.log('');
};

const totalOrphansFound = (counts: OrphanCleanupByCollection): number =>
  SCOPED_COLLECTIONS.reduce((sum, name) => sum + counts[name].found, 0);

const migrateUser = async (
  db: mongoose.mongo.Db,
  user: UserDoc,
  dryRun: boolean
): Promise<PerUserResult> => {
  const existing = await findExistingPersonalWorkspaceId(db, user._id);

  if (existing) {
    const backfilled = await backfillScopedCollectionsForUser(db, user._id, existing, dryRun);

    return {
      userId: user._id.toHexString(),
      workspaceCreated: false,
      workspaceId: existing.toHexString(),
      updatedPerCollection: backfilled,
    };
  }

  const now = new Date();
  const workspaceId = dryRun
    ? new Types.ObjectId()
    : await createPersonalWorkspaceForUser(db, user, now);
  const backfilled = await backfillScopedCollectionsForUser(db, user._id, workspaceId, dryRun);

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

    const preCounts = await captureCounts(db);
    printCountsTable('Pre-migration counts', preCounts);

    const users = await db
      .collection<UserDoc>('users')
      .find({})
      .project<UserDoc>({ _id: 1, email: 1, displayCurrency: 1, activeWorkspaceId: 1 })
      .toArray();

    const validUserIdHexes = new Set(users.map(u => u._id.toHexString()));

    console.log('');
    console.log('==============================================================');
    console.log('  Orphan cleanup phase');
    console.log('  (docs whose userId does not match any existing user)');
    console.log('==============================================================');

    const orphanCounts = await cleanupOrphans(db, validUserIdHexes, dryRun);
    const orphansFound = totalOrphansFound(orphanCounts);

    if (orphansFound === 0) {
      console.log('  0 orphans found across all scoped collections.');
    }

    printOrphanTable(orphanCounts, dryRun);

    const postCleanupCounts = await captureCounts(db);

    const backfillHeader = dryRun
      ? `Found ${users.length} user(s). Previewing backfill (dry-run)...`
      : `Found ${users.length} user(s). Starting backfill...`;
    console.log(backfillHeader);
    console.log('');

    let created = 0;
    let skipped = 0;

    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      const result = await migrateUser(db, user, dryRun);

      if (result.workspaceCreated) {
        created += 1;
      } else {
        skipped += 1;
      }

      const identifier = user.email ?? user._id.toHexString();
      const createdLabel = dryRun ? 'WOULD create workspace' : 'created workspace';
      const status = result.workspaceCreated ? createdLabel : 'skipped (already migrated)';
      const backfillBreakdown = SCOPED_COLLECTIONS.map(
        name => `${name}:${result.updatedPerCollection[name]}`
      ).join(' ');

      console.log(
        `[${i + 1}/${users.length}] ${identifier}: ${status} | ${backfillBreakdown}`
      );
    }

    console.log('');

    if (dryRun) {
      console.log(`Workspaces that WOULD be created: ${created}`);
      console.log(`Users already migrated (would skip): ${skipped}`);
    } else {
      console.log(`Workspaces created: ${created}`);
      console.log(`Workspaces already present (skipped creation): ${skipped}`);
    }

    console.log(`Total users processed: ${users.length}`);

    const postLabel = dryRun ? 'Counts after dry-run (unchanged)' : 'Post-migration counts';
    const postCounts = await captureCounts(db);
    printCountsTable(postLabel, postCounts);

    if (dryRun) {
      console.log('Verification skipped (dry-run): no writes performed.');
      console.log('Re-run without --dry-run to apply the planned changes.');
      return;
    }

    const verification = verifyPostMigration(postCleanupCounts, postCounts);

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
