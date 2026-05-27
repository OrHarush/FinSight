import mongoose, { Schema, Types } from 'mongoose';

export interface IRecurringTemplate {
  _id: string;
  userId: Types.ObjectId;
  workspaceId?: Types.ObjectId;
  frequency: 'Monthly' | 'Yearly';
  dayOfMonth: number;
  startDate: Date;
  endDate?: Date;
  name?: string;
  note?: string;
  type: 'Income' | 'Expense' | 'Transfer';
  amount: number;
  belongToPreviousMonth?: boolean;
  category?: Types.ObjectId;
  paymentMethod?: Types.ObjectId;
  account?: Types.ObjectId;
  fromAccount?: Types.ObjectId;
  toAccount?: Types.ObjectId;
  isActive: boolean;
  lastGeneratedDate?: Date | null;
}

const RecurringTemplateSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    frequency: { type: String, enum: ['Monthly', 'Yearly'], required: true },
    dayOfMonth: { type: Number, required: true, min: 1, max: 31 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    name: { type: String, maxlength: 50 },
    note: { type: String, maxlength: 200, trim: true },
    type: { type: String, enum: ['Income', 'Expense', 'Transfer'], required: true },
    amount: { type: Number, required: true },
    belongToPreviousMonth: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    paymentMethod: { type: Schema.Types.ObjectId, ref: 'PaymentMethod' },
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    fromAccount: { type: Schema.Types.ObjectId, ref: 'Account' },
    toAccount: { type: Schema.Types.ObjectId, ref: 'Account' },
    isActive: { type: Boolean, default: true },
    lastGeneratedDate: { type: Date, default: null },
  },
  { timestamps: true },
);

RecurringTemplateSchema.index({ userId: 1, isActive: 1 });
RecurringTemplateSchema.index({ userId: 1, startDate: 1, endDate: 1 });

export default mongoose.model<IRecurringTemplate>(
  'RecurringTemplate',
  RecurringTemplateSchema,
  'recurringTemplates',
);
