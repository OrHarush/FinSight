import dotenv from 'dotenv';
import mongoose from 'mongoose';

if (process.env.ENV_FILE) {
  dotenv.config({ path: process.env.ENV_FILE });
}
dotenv.config({ path: '.env' });

const ALLOWED_DB_NAME = 'lyra_staging';

const parseDbName = (uri: string): string => {
  const url = new URL(uri);
  const name = url.pathname.replace(/^\/+/, '').split('?')[0];

  if (!name) {
    throw new Error('Could not parse a database name from MONGO_URI (empty pathname).');
  }

  return decodeURIComponent(name);
};

const run = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI environment variable is required.');
    process.exit(1);
  }

  const dbName = parseDbName(mongoUri);

  console.log(`Parsed db from MONGO_URI: "${dbName}"`);

  if (dbName !== ALLOWED_DB_NAME) {
    console.log(
      `Refusing to run: this script is hardcoded to "${ALLOWED_DB_NAME}" only.`
    );
    console.log('No connection opened, no deletes performed.');
    process.exit(0);
  }

  console.log(`Connecting to MongoDB (db: ${dbName})...`);
  await mongoose.connect(mongoUri);

  try {
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Mongoose connection has no underlying db handle.');
    }

    const collection = db.collection('workspace_invitations');
    const countBefore = await collection.countDocuments({});

    console.log(`Found ${countBefore} invitation(s). Deleting all...`);
    const result = await collection.deleteMany({});

    console.log(`Deleted ${result.deletedCount} invitation(s).`);
  } finally {
    await mongoose.disconnect();
  }
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
