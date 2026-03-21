import { DEFAULT_CATEGORY_KEYS, DefaultCategoryKey } from '@finsight/shared';
import mongoose, { Schema, Types } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
  key?: DefaultCategoryKey;
  type: 'Income' | 'Expense';
  color: string;
  icon: string;
  userId: Types.ObjectId;
}

const CategorySchema: Schema = new Schema(
  {
    key: {
      type: String,
      enum: DEFAULT_CATEGORY_KEYS,
      required: false,
    },
    name: { type: String, required: true, trim: true, maxlength: 30 },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    color: { type: String },
    icon: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', CategorySchema, 'categories');
