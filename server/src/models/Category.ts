import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  type: 'Income' | 'Expense';
  color: string;
  icon: string;
  monthlyLimit: number;
  userId: Types.ObjectId;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    color: { type: String },
    icon: { type: String, required: false },
    monthlyLimit: { type: Number, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema, 'categories');
