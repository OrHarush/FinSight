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
  templateId?: Types.ObjectId;
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
    templateId: { type: Schema.Types.ObjectId, ref: 'RecurringTemplate' },
  },
  { timestamps: true }
);

TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, category: 1, date: -1 });
TransactionSchema.index({ userId: 1, account: 1, date: -1 });
TransactionSchema.index({ templateId: 1, date: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
