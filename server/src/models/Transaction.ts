import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  name?: string;
  amount: number;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  recurrence: 'None' | 'Monthly' | 'Yearly';
  type: 'Income' | 'Expense' | 'Transfer';
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
    date: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    amount: { type: Number, required: true },
    recurrence: {
      type: String,
      enum: ['None', 'Monthly', 'Yearly'],
      default: 'None',
    },
    type: {
      type: String,
      enum: ['Income', 'Expense', 'Transfer'],
      required: true,
    },
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
