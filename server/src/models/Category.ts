import { DEFAULT_CATEGORY_KEYS, DefaultCategoryKey } from '@lyra/shared';
import mongoose, { Schema, Types } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
  key?: DefaultCategoryKey;
  type: 'Income' | 'Expense' | 'Savings';
  color: string;
  icon: string;
  userId: Types.ObjectId;
  workspaceId?: Types.ObjectId;
}

const CategorySchema: Schema = new Schema(
  {
    key: {
      type: String,
      enum: DEFAULT_CATEGORY_KEYS,
      required: false,
    },
    name: { type: String, required: true, trim: true, maxlength: 30 },
    type: { type: String, enum: ['Income', 'Expense', 'Savings'], required: true },
    color: { type: String },
    icon: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1, userId: 1, type: 1 }, { unique: true });
CategorySchema.index({ userId: 1, type: 1 });
CategorySchema.index({ workspaceId: 1, type: 1 });

export default mongoose.model<ICategory>('Category', CategorySchema, 'categories');
