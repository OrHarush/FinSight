import { DefaultAccountKey } from '@lyra/shared';
import mongoose, { Schema, Types } from 'mongoose';

export interface IAccount {
  _id: string;
  name: string;
  balance: number;
  institution?: string;
  accountNumber?: string;
  icon?: string;
  currency?: string;
  isPrimary: boolean;
  checkpointBalance: number;
  checkpointDate?: Date;
  key?: DefaultAccountKey;
  userId: Types.ObjectId;
  workspaceId?: Types.ObjectId;
}

const AccountSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    balance: { type: Number, required: true, default: 0 },
    institution: { type: String },
    accountNumber: { type: String },
    icon: { type: String },
    currency: { type: String, default: 'ILS' },
    isPrimary: { type: Boolean, default: false },
    checkpointBalance: { type: Number, default: 0 },
    checkpointDate: { type: Date },
    key: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  },
  { timestamps: true }
);

AccountSchema.index({ userId: 1 }, { unique: true, partialFilterExpression: { isPrimary: true } });

export default mongoose.model<IAccount>('Account', AccountSchema, 'accounts');
