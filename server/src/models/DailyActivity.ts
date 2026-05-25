import mongoose, { Schema, Types } from 'mongoose';

export interface IDailyActivity {
  userId: Types.ObjectId;
  date: string;
}

const DailyActivitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
});

DailyActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IDailyActivity>('DailyActivity', DailyActivitySchema, 'daily_activities');
