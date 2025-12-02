import mongoose, { Schema, Types } from 'mongoose';

export interface IAccount {
  _id: string;
  name: string;
  balance: number;
  institution: string;
  accountNumber: string;
  icon: string;
  isPrimary: boolean;
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
    isPrimary: { type: Boolean, default: false },
    lastSynced: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

AccountSchema.index({ userId: 1 }, { unique: true, partialFilterExpression: { isPrimary: true } });

export default mongoose.model<IAccount>('Account', AccountSchema, 'accounts');
