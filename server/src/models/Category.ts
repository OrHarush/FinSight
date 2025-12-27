import mongoose, { Schema, Types } from 'mongoose';
import { DEFAULT_CATEGORY_KEYS, DefaultCategoryKey } from '../../../shared/types/defaultCategories';

export interface ICategory {
  _id: string;
  name: string;
  key?: DefaultCategoryKey;
  type: 'Income' | 'Expense';
  color: string;
  icon: string;
  monthlyLimit: number;
  userId: Types.ObjectId;
}

const CategorySchema: Schema = new Schema(
  {
    key: {
      type: String,
      enum: DEFAULT_CATEGORY_KEYS,
      required: false,
    },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    color: { type: String },
    icon: { type: String },
    monthlyLimit: { type: Number },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', CategorySchema, 'categories');
