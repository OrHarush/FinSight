import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import * as readline from 'readline';

if (process.env.ENV_FILE) {
  dotenv.config({ path: process.env.ENV_FILE });
}
dotenv.config({ path: '.env' });

import User from '../src/models/User';
import * as shortcutService from '../src/services/shortcutService';

const PROD_DB_NAME = 'lyra';

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
    console.log('  >>> MODE: DRY RUN — no token will be minted <<<');
  } else {
    console.log('  >>> MODE: LIVE — a real shortcut token WILL be minted <<<');
  }

  console.log('--------------------------------------------------------------');
  console.log('');
};

const promptConfirmation = async (
  expected: string,
  isProd: boolean,
  email: string,
  dryRun: boolean
): Promise<boolean> => {
  console.log('');
  console.log('==============================================================');
  console.log(`  About to mint a shortcut token in database: "${expected}"`);
  console.log(`  Target email: ${email}`);

  if (dryRun) {
    console.log('');
    console.log('  *** DRY RUN — user existence will be checked, no token created. ***');
  } else {
    console.log('  This runs the real createCode → approveCode → exchangeToken path');
    console.log('  and prints a JWT that shortcutAuthMiddleware will accept.');
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

const resolveEmail = (): string => {
  const email = process.argv.slice(2).find(arg => !arg.startsWith('--') && arg.includes('@'));

  if (!email) {
    console.error('Usage: ts-node scripts/mintShortcutToken.ts <email> [--dry-run]');
    console.error('  Looks up the user by email and mints a shortcut JWT for their _id.');
    process.exit(1);
  }

  return email.toLowerCase();
};

const lookupUserId = async (email: string): Promise<string> => {
  const user = await User.findOne({ email }).select({ _id: 1, email: 1 }).lean();

  if (!user) {
    throw new Error(`No user found with email=${email}.`);
  }

  const userId = user._id.toString();
  console.log(`User found: ${user.email ?? '(no email)'} (_id=${userId})`);

  return userId;
};

const mintToken = async (userId: string): Promise<string> => {
  console.log(`Creating code for userId=${userId}...`);
  const code = await shortcutService.createCode(userId);
  console.log(`  code=${code}`);

  console.log('Approving code (skipping interactive Safari handshake)...');
  await shortcutService.approveCode(code, userId);

  console.log('Exchanging code for JWT...');
  const token = await shortcutService.exchangeToken(code);

  if (!token) {
    throw new Error('exchangeToken returned null — record was not approved.');
  }

  return token;
};

const run = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI environment variable is required.');
    process.exit(1);
  }

  if (!process.env.SHORTCUT_JWT_SECRET) {
    console.error('SHORTCUT_JWT_SECRET environment variable is required.');
    process.exit(1);
  }

  const email = resolveEmail();
  const { dryRun, source: dryRunSource } = resolveDryRun();
  printModeBanner(dryRun, dryRunSource);

  const dbName = parseDbName(mongoUri);
  const isProd = dbName === PROD_DB_NAME;

  const confirmed = await promptConfirmation(dbName, isProd, email, dryRun);

  if (!confirmed) {
    console.error('Aborted: database name did not match. No connection opened.');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB (db: ${dbName}${dryRun ? ', DRY RUN' : ''})...`);
  await mongoose.connect(mongoUri);
  console.log('Connected.');

  try {
    const userId = await lookupUserId(email);

    if (dryRun) {
      console.log('DRY RUN — would mint token for userId above. Exiting without writes.');
      return;
    }

    const token = await mintToken(new Types.ObjectId(userId).toString());

    console.log('');
    console.log('==============================================================');
    console.log('  Shortcut token (use as: Authorization: Shortcut <token>)');
    console.log('==============================================================');
    console.log(token);
    console.log('');
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
};

run().catch(err => {
  console.error('Mint failed:', err);
  void mongoose.disconnect().finally(() => process.exit(1));
});
