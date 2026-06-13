import mongoose, { Schema, Types } from 'mongoose';

export interface IMerchantRule {
  _id: string;
  userId: Types.ObjectId;
  matchKey: string;
  alias?: string | null;
  categoryId?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const MerchantRuleSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    matchKey: { type: String, required: true },
    alias: { type: String, default: null },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  },
  { timestamps: true }
);

MerchantRuleSchema.index({ userId: 1, matchKey: 1 }, { unique: true });

export default mongoose.model<IMerchantRule>('MerchantRule', MerchantRuleSchema, 'merchant_rules');
