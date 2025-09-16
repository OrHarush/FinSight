import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  name: string;
  date: Date;
  amount: number;
  recurrence: 'None' | 'Monthly' | 'Yearly';
  category: Types.ObjectId;
  accountRelated: string; // later can become ObjectId ref to Account
}

const TransactionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    recurrence: {
      type: String,
      enum: ['None', 'Monthly', 'Yearly'],
      default: 'None',
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    accountRelated: { type: String, required: true }, // e.g. "Bank Balance", "Investing"
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
