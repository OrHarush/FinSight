import 'dotenv/config';
import mongoose from 'mongoose';

import Account from '../src/models/Account';
import Budget from '../src/models/Budget';
import Transaction from '../src/models/Transaction';
import User from '../src/models/User';

const DRY_RUN = process.env.DRY_RUN === 'true';
const USER_EMAIL = process.env.USER_EMAIL;

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is required');
  }

  await mongoose.connect(process.env.MONGO_URI);

  console.log('Connected to MongoDB');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);

  let userIdFilter: object = {};

  if (USER_EMAIL) {
    const user = await User.findOne({ email: USER_EMAIL });

    if (!user) {
      throw new Error(`User not found: ${USER_EMAIL}`);
    }

    console.log(`Filtering by userId: ${user._id} (${USER_EMAIL})`);
    userIdFilter = { userId: user._id };
  } else {
    console.log('Migrating all users');
  }

  // Migrate accounts.balance
  const accounts = await Account.find(userIdFilter);

  console.log(`\nAccounts to migrate: ${accounts.length}`);

  for (const account of accounts) {
    const newBalance = Math.round(account.balance * 100);

    console.log(`  account ${account._id}: ${account.balance} -> ${newBalance}`);

    if (!DRY_RUN) {
      await Account.updateOne({ _id: account._id }, { $set: { balance: newBalance } });
    }
  }

  // Migrate transactions.amount
  const transactions = await Transaction.find(userIdFilter);

  console.log(`\nTransactions to migrate: ${transactions.length}`);

  for (const tx of transactions) {
    const newAmount = Math.round(tx.amount * 100);

    console.log(`  transaction ${tx._id}: ${tx.amount} -> ${newAmount}`);

    if (!DRY_RUN) {
      await Transaction.updateOne({ _id: tx._id }, { $set: { amount: newAmount } });
    }
  }

  // Migrate budgets.limit
  const budgets = await Budget.find(userIdFilter);

  console.log(`\nBudgets to migrate: ${budgets.length}`);

  for (const budget of budgets) {
    const newLimit = Math.round(budget.limit * 100);

    console.log(`  budget ${budget._id}: ${budget.limit} -> ${newLimit}`);

    if (!DRY_RUN) {
      await Budget.updateOne({ _id: budget._id }, { $set: { limit: newLimit } });
    }
  }

  console.log('\nDone.');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
