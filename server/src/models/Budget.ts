import mongoose, { Schema, Types } from 'mongoose';

export interface IBudget {
  _id: string;
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  year: number;
  month: number;
  limit: number;
}

const BudgetSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true, min: 0, max: 11 },
    limit: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

BudgetSchema.index({ userId: 1, categoryId: 1, year: 1, month: 1 }, { unique: true });

export default mongoose.model<IBudget>('Budgets', BudgetSchema, 'budgets');
