import mongoose, { Schema, Types } from 'mongoose';

export interface ITransaction {
  _id: string;
  name: string;
  type: 'Income' | 'Expense' | 'Transfer';
  amount: number;
  date?: Date;
  recurrence: 'None' | 'Monthly' | 'Yearly';
  startDate?: Date;
  endDate?: Date;
  belongToPreviousMonth?: boolean;
  category?: Types.ObjectId;
  paymentMethod?: Types.ObjectId;
  account?: Types.ObjectId;
  fromAccount?: Types.ObjectId;
  toAccount?: Types.ObjectId;
  userId: Types.ObjectId;
}

const TransactionSchema: Schema = new Schema(
  {
    name: { type: String },
    type: {
      type: String,
      enum: ['Income', 'Expense', 'Transfer'],
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date },
    recurrence: {
      type: String,
      enum: ['None', 'Monthly', 'Yearly'],
      default: 'None',
    },
    startDate: { type: Date },
    endDate: { type: Date },
    belongToPreviousMonth: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    paymentMethod: { type: Schema.Types.ObjectId, ref: 'PaymentMethod' },
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    fromAccount: { type: Schema.Types.ObjectId, ref: 'Account' },
    toAccount: { type: Schema.Types.ObjectId, ref: 'Account' },

    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
