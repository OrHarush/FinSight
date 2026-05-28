import mongoose, { Schema, Types } from 'mongoose';

export interface ITransaction {
  _id: string;
  name?: string;
  note?: string;
  type: 'Income' | 'Expense' | 'Transfer';
  amount: number;
  date?: Date;
  frequency?: 'Monthly' | 'Yearly';
  belongToPreviousMonth?: boolean;
  category?: Types.ObjectId;
  paymentMethod?: Types.ObjectId;
  account?: Types.ObjectId;
  fromAccount?: Types.ObjectId;
  toAccount?: Types.ObjectId;
  userId: Types.ObjectId;
  workspaceId?: Types.ObjectId;
  templateId?: Types.ObjectId;
  importBatchId?: Types.ObjectId;
  importFingerprint?: string;
}

const TransactionSchema: Schema = new Schema(
  {
    name: { type: String, maxlength: 50 },
    note: { type: String, maxlength: 200, trim: true },
    type: {
      type: String,
      enum: ['Income', 'Expense', 'Transfer'],
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date },
    frequency: { type: String, enum: ['Monthly', 'Yearly'] },
    belongToPreviousMonth: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    paymentMethod: { type: Schema.Types.ObjectId, ref: 'PaymentMethod' },
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    fromAccount: { type: Schema.Types.ObjectId, ref: 'Account' },
    toAccount: { type: Schema.Types.ObjectId, ref: 'Account' },

    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    templateId: { type: Schema.Types.ObjectId, ref: 'RecurringTemplate' },
    importBatchId: { type: Schema.Types.ObjectId },
    importFingerprint: { type: String },
  },
  { timestamps: true }
);

TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, category: 1, date: -1 });
TransactionSchema.index({ userId: 1, account: 1, date: -1 });
TransactionSchema.index({ userId: 1, type: 1, date: -1 });
TransactionSchema.index({ templateId: 1, date: -1 });
TransactionSchema.index(
  { userId: 1, importFingerprint: 1 },
  { partialFilterExpression: { importFingerprint: { $exists: true } } }
);
TransactionSchema.index(
  { userId: 1, importBatchId: 1 },
  { partialFilterExpression: { importBatchId: { $exists: true } } }
);
TransactionSchema.index({ workspaceId: 1, date: -1 });
TransactionSchema.index({ workspaceId: 1, category: 1, date: -1 });
TransactionSchema.index({ workspaceId: 1, account: 1, date: -1 });
TransactionSchema.index({ workspaceId: 1, type: 1, date: -1 });
TransactionSchema.index(
  { workspaceId: 1, importFingerprint: 1 },
  { partialFilterExpression: { importFingerprint: { $exists: true } } }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
