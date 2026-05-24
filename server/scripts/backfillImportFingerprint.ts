import 'dotenv/config';
import mongoose from 'mongoose';

import Transaction from '../src/models/Transaction';
import User from '../src/models/User';
import { fingerprintForTransaction } from '../src/utils/importFingerprint';

const DRY_RUN = process.env.DRY_RUN === 'true';
const USER_EMAIL = process.env.USER_EMAIL;
const BATCH_SIZE = 100;

async function run() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI environment variable is required');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
    });

    console.log('Connected to MongoDB');
    console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);

    const query: Record<string, unknown> = {
        account: { $exists: true, $ne: null },
        date: { $exists: true, $ne: null },
        importFingerprint: { $exists: false },
    };

    if (USER_EMAIL) {
        const user = await User.findOne({ email: USER_EMAIL });

        if (!user) {
            throw new Error(`User not found: ${USER_EMAIL}`);
        }

        console.log(`Filtering by userId: ${user._id} (${USER_EMAIL})`);
        query.userId = user._id;
    } else {
        console.log('Backfilling all users');
    }

    const total = await Transaction.countDocuments(query);

    console.log(`\nTransactions to backfill: ${total}`);

    console.log('Loading transactions into memory...');
    const transactions = await Transaction.find(query)
        .select('userId account date amount type')
        .lean();
    console.log(`Loaded ${transactions.length} transactions`);

    let processed = 0;
    let updated = 0;
    let skipped = 0;
    let operations: { updateOne: { filter: object; update: object } }[] = [];

    const flush = async () => {
        if (operations.length === 0) {
            return;
        }

        console.log(`  flushing batch of ${operations.length}...`);

        if (!DRY_RUN) {
            await Transaction.bulkWrite(operations, { maxTimeMS: 30000 });
        }

        updated += operations.length;
        operations = [];
        console.log(`  batch written (total updated: ${updated})`);
    };

    for (const tx of transactions) {
        processed++;

        const fingerprint = fingerprintForTransaction({
            userId: tx.userId,
            account: tx.account,
            date: tx.date,
            amount: tx.amount,
            type: tx.type,
        });

        if (!fingerprint) {
            skipped++;
            continue;
        }

        operations.push({
            updateOne: {
                filter: { _id: tx._id },
                update: { $set: { importFingerprint: fingerprint } },
            },
        });

        if (processed % 100 === 0) {
            console.log(`  processed ${processed}/${total}`);
        }

        if (operations.length >= BATCH_SIZE) {
            await flush();
        }
    }

    await flush();

    console.log(`\nDone. Processed ${processed}, updated ${updated}, skipped ${skipped}.`);

    await mongoose.disconnect();
    console.log('Disconnected.');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});