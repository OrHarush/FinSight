import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  type: 'Income' | 'Expense';
  color: string;
  icon: string;
  monthlyLimit: number;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    color: { type: String },
    icon: { type: String, required: false },
    monthlyLimit: { type: Number, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema, 'categories');
