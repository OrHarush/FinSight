import archiver, { Archiver } from 'archiver';
import type { Model } from 'mongoose';
import { Readable, Transform } from 'stream';

import Account from '../models/Account';
import AnalyticsEvent from '../models/AnalyticsEvent';
import Budget from '../models/Budget';
import Category from '../models/Category';
import Goal from '../models/Goal';
import PaymentMethod from '../models/PaymentMethod';
import RecurringTemplate from '../models/RecurringTemplate';
import Transaction from '../models/Transaction';
import User from '../models/User';
import UserActivityEvent from '../models/UserActivityEvent';

// Explicit, hardcoded list. DO NOT switch to mongoose.connection.db.listCollections() —
// a restore script depends on this exact set, and a newly-added model must require a
// deliberate edit here before it lands in a backup.
const COLLECTIONS: ReadonlyArray<{ name: string; model: Model<unknown> }> = [
  { name: 'accounts.json', model: Account as unknown as Model<unknown> },
  { name: 'categories.json', model: Category as unknown as Model<unknown> },
  { name: 'transactions.json', model: Transaction as unknown as Model<unknown> },
  { name: 'payment_methods.json', model: PaymentMethod as unknown as Model<unknown> },
  { name: 'recurringTemplates.json', model: RecurringTemplate as unknown as Model<unknown> },
  { name: 'budgets.json', model: Budget as unknown as Model<unknown> },
  { name: 'goals.json', model: Goal as unknown as Model<unknown> },
  { name: 'users.json', model: User as unknown as Model<unknown> },
  { name: 'user_activity_events.json', model: UserActivityEvent as unknown as Model<unknown> },
  { name: 'analytics_events.json', model: AnalyticsEvent as unknown as Model<unknown> },
];

const cursorToJsonArrayStream = (source: Readable): Readable => {
  let isFirst = true;

  const transform = new Transform({
    writableObjectMode: true,
    readableObjectMode: false,
    transform(doc, _enc, callback) {
      try {
        const chunk = (isFirst ? '[' : ',') + JSON.stringify(doc);
        isFirst = false;
        callback(null, chunk);
      } catch (err) {
        callback(err as Error);
      }
    },
    flush(callback) {
      callback(null, isFirst ? '[]' : ']');
    },
  });

  // Forward cursor errors so archiver surfaces them as archive 'error' events,
  // including failures that happen after archive.finalize() has been called.
  source.on('error', err => transform.destroy(err));

  return source.pipe(transform);
};

export const buildBackupArchive = (): Archiver => {
  const archive = archiver('zip', { zlib: { level: 9 } });

  for (const { name, model } of COLLECTIONS) {
    const cursor = model.find({}).lean().cursor();
    archive.append(cursorToJsonArrayStream(cursor), { name });
  }

  void archive.finalize();

  return archive;
};
