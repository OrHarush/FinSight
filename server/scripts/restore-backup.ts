import 'dotenv/config';

import AdmZip from 'adm-zip';
import mongoose, { Types } from 'mongoose';
import * as path from 'path';
import * as readline from 'readline';

// Strict 24-char lowercase-or-uppercase hex; matches Mongo ObjectId.toString() output.
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

// Strict ISO-8601 with millisecond precision — matches Date.prototype.toJSON() exactly,
// which is what JSON.stringify(new Date()) produces inside the backup.
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const PROD_DB_NAME = 'lyra';

type DocLike = Record<string, unknown>;

interface RestoreSummaryRow {
  collection: string;
  inZip: number;
  inserted: number;
  errors: number;
}

const parseDbName = (uri: string): string => {
  const url = new URL(uri);
  const name = url.pathname.replace(/^\/+/, '').split('?')[0];

  if (!name) {
    throw new Error('Could not parse a database name from MONGO_URI (empty pathname).');
  }

  return decodeURIComponent(name);
};

const rehydrateValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    if (OBJECT_ID_REGEX.test(value)) {
      return new Types.ObjectId(value);
    }

    if (ISO_DATE_REGEX.test(value)) {
      const parsed = new Date(value);

      // Round-trip guard: reject malformed ISO (e.g. Feb 30) where Date.parse silently corrects.
      if (!Number.isNaN(parsed.getTime()) && parsed.toISOString() === value) {
        return parsed;
      }
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map(rehydrateValue);
  }

  if (value !== null && typeof value === 'object') {
    const out: DocLike = {};

    for (const [k, v] of Object.entries(value as DocLike)) {
      out[k] = rehydrateValue(v);
    }

    return out;
  }

  return value;
};

const rehydrateDoc = (doc: unknown): DocLike => rehydrateValue(doc) as DocLike;

const promptConfirmation = async (expected: string, isProd: boolean): Promise<boolean> => {
  console.log('');
  console.log('==============================================================');
  console.log(`  About to restore into database: "${expected}"`);
  console.log('  This will DELETE all existing documents in the target');
  console.log('  collections and replace them.');

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

const restoreCollection = async (
  db: mongoose.mongo.Db,
  collectionName: string,
  rawJson: string
): Promise<RestoreSummaryRow> => {
  const parsed: unknown = JSON.parse(rawJson);

  if (!Array.isArray(parsed)) {
    throw new Error(`Entry ${collectionName} is not a JSON array.`);
  }

  const docs = (parsed as unknown[]).map(rehydrateDoc);
  const collection = db.collection(collectionName);

  await collection.deleteMany({});

  if (docs.length === 0) {
    console.log(`${collectionName}: inserted 0 (empty)`);
    return { collection: collectionName, inZip: 0, inserted: 0, errors: 0 };
  }

  try {
    const result = await collection.insertMany(docs, { ordered: false });
    console.log(`${collectionName}: inserted ${result.insertedCount}`);
    return {
      collection: collectionName,
      inZip: docs.length,
      inserted: result.insertedCount,
      errors: 0,
    };
  } catch (err) {
    // ordered:false → partial success is normal. The driver throws a MongoBulkWriteError
    // carrying insertedCount and writeErrors[]; surface both.
    const e = err as { insertedCount?: number; writeErrors?: unknown[]; message?: string };
    const inserted = e.insertedCount ?? 0;
    const errors = e.writeErrors?.length ?? 0;

    console.error(`${collectionName}: ${errors} insert error(s) — ${e.message ?? 'unknown'}`);

    if (e.writeErrors && e.writeErrors.length > 0) {
      const sample = e.writeErrors.slice(0, 3);
      console.error(`${collectionName}: first ${sample.length} error(s):`, sample);
    }

    console.log(`${collectionName}: inserted ${inserted} (with ${errors} error(s))`);

    return { collection: collectionName, inZip: docs.length, inserted, errors };
  }
};

const printSummary = (rows: RestoreSummaryRow[]): void => {
  console.log('');
  console.log('==============================================================');
  console.log('  Restore summary');
  console.log('==============================================================');
  console.log('  collection                     in zip   inserted   errors');
  console.log('  -----------------------------  -------  ---------  ------');

  for (const row of rows) {
    const name = row.collection.padEnd(29);
    const inZip = String(row.inZip).padStart(7);
    const inserted = String(row.inserted).padStart(9);
    const errors = String(row.errors).padStart(6);
    console.log(`  ${name}  ${inZip}  ${inserted}  ${errors}`);
  }

  console.log('');
};

const run = async (): Promise<void> => {
  const zipPath = process.argv[2];

  if (!zipPath) {
    console.error('Usage: ts-node scripts/restore-backup.ts <path-to-backup.zip>');
    process.exit(1);
  }

  const resolvedZip = path.resolve(zipPath);
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

  // Open the zip BEFORE connecting so a bad path fails before any DB work.
  const zip = new AdmZip(resolvedZip);
  const entries = zip.getEntries().filter(e => !e.isDirectory && e.entryName.endsWith('.json'));

  if (entries.length === 0) {
    console.error(`No .json entries found in ${resolvedZip}.`);
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

    const rows: RestoreSummaryRow[] = [];

    for (const entry of entries) {
      const collectionName = entry.entryName.replace(/\.json$/, '');
      const rawJson = entry.getData().toString('utf8');
      const row = await restoreCollection(db, collectionName, rawJson);
      rows.push(row);
    }

    printSummary(rows);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
};

run().catch(err => {
  console.error('Restore failed:', err);
  void mongoose.disconnect().finally(() => process.exit(1));
});
