import mongoose, { Schema, Types } from 'mongoose';

export type GoalImportance = 'low' | 'medium' | 'high';
export type GoalStatus = 'active' | 'achieved' | 'archived';

export interface IGoal {
  _id: string;
  userId: Types.ObjectId;
  workspaceId?: Types.ObjectId;
  name: string;
  icon: string | null;
  color: string | null;
  targetAmount: number;
  initialAmount: number;
  targetDate: Date;
  expectedAnnualReturn: number;
  importance: GoalImportance;
  description: string | null;
  categoryId: Types.ObjectId;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 60 },
    icon: { type: String, default: null, maxlength: 40 },
    color: { type: String, default: null },
    targetAmount: { type: Number, required: true, min: 1 },
    initialAmount: { type: Number, required: true, default: 0, min: 0 },
    targetDate: { type: Date, required: true },
    expectedAnnualReturn: { type: Number, default: 0, min: 0, max: 20 },
    importance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      required: true,
    },
    description: { type: String, default: null, maxlength: 500 },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'achieved', 'archived'],
      default: 'active',
      required: true,
    },
  },
  { timestamps: true }
);

GoalSchema.index({ userId: 1, status: 1 });
GoalSchema.index({ workspaceId: 1, status: 1 });

export default mongoose.model<IGoal>('Goal', GoalSchema, 'goals');
