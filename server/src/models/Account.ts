import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  balance: number;
  institution: string;
  accountNumber: string;
  lastSynced?: Date;
}

const AccountSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    balance: { type: Number, required: true, default: 0 },
    institution: { type: String },
    accountNumber: { type: String, required: true },
    lastSynced: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IAccount>('Account', AccountSchema, 'accounts');
