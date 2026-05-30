import dotenv from 'dotenv';
import mongoose from 'mongoose';
import * as readline from 'readline';

if (process.env.ENV_FILE) {
  dotenv.config({ path: process.env.ENV_FILE });
}
dotenv.config({ path: '.env' });

const PROD_DB_NAME = 'lyra';
const TARGET_ICON = 'Person';
const TARGET_COLOR = '#534AB7';

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
  console.log(`  About to backfill personal-workspace icons in database: "${expected}"`);

  if (dryRun) {
    console.log('');
    console.log('  *** DRY RUN — no writes will be performed. ***');
    console.log('  All planned updates will be logged only.');
  } else {
    console.log(`  This will set icon="${TARGET_ICON}" on every personal workspace`);
    console.log(`  whose icon is missing or equals "Home" (the previous default).`);
    console.log(`  Workspaces that already use a custom personal icon are skipped.`);
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

interface PersonalWorkspaceDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  icon?: string;
  color?: string;
}

const findCandidates = async (
  db: mongoose.mongo.Db
): Promise<PersonalWorkspaceDoc[]> => {
  return db
    .collection<PersonalWorkspaceDoc>('workspaces')
    .find({
      type: 'personal',
      $or: [
        { icon: { $exists: false } },
        { icon: 'Home' },
      ],
    })
    .project<PersonalWorkspaceDoc>({ _id: 1, name: 1, icon: 1, color: 1 })
    .toArray();
};

const applyUpdate = async (
  db: mongoose.mongo.Db,
  id: mongoose.Types.ObjectId
) =>
  db.collection('workspaces').updateOne(
    { _id: id },
    { $set: { icon: TARGET_ICON, color: TARGET_COLOR } }
  );

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

    const candidates = await findCandidates(db);

    console.log('');
    console.log(`Found ${candidates.length} personal workspace(s) needing backfill.`);
    console.log('');

    let updated = 0;
    let alreadyCorrect = 0;

    for (const ws of candidates) {
      const currentIcon = ws.icon ?? '(missing)';
      const action = dryRun ? 'WOULD update' : 'updating';

      if (currentIcon === TARGET_ICON) {
        console.log(`  [skip] ${ws._id.toHexString()} already icon="${TARGET_ICON}"`);
        alreadyCorrect += 1;
        continue;
      }

      console.log(
        `  [${action}] ${ws._id.toHexString()} name="${ws.name}" icon: ${currentIcon} → ${TARGET_ICON}`
      );

      if (!dryRun) {
        const result = await applyUpdate(db, ws._id);
        if (result.modifiedCount === 1) {
          updated += 1;
        }
      } else {
        updated += 1;
      }
    }

    console.log('');
    console.log('==============================================================');
    console.log(`  Total candidates: ${candidates.length}`);
    console.log(`  Already correct: ${alreadyCorrect}`);
    console.log(`  ${dryRun ? 'Would update' : 'Updated'}: ${updated}`);
    console.log('==============================================================');
  } finally {
    await mongoose.disconnect();
  }
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
