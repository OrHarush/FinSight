import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  name: string;
  amount: number;
  date: Date;
  endDate?: Date;
  recurrence: 'None' | 'Monthly' | 'Yearly';
  category: Types.ObjectId;
  account: Types.ObjectId;
  userId: Types.ObjectId;
}

const TransactionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    amount: { type: Number, required: true },
    recurrence: {
      type: String,
      enum: ['None', 'Monthly', 'Yearly'],
      default: 'None',
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
