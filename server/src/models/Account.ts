import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  balance: number;
  institution: string;
  accountNumber: string;
  icon: string;
  lastSynced?: Date;
  userId: Types.ObjectId;
}

const AccountSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    balance: { type: Number, required: true, default: 0 },
    institution: { type: String },
    accountNumber: { type: String },
    icon: { type: String },
    lastSynced: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAccount>('Account', AccountSchema, 'accounts');
