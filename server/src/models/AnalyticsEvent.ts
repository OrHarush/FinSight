import mongoose, { Schema, Types } from 'mongoose';

export const ANALYTICS_EVENT_TYPES = [
  'transaction_created',
  'recurring_created',
  'category_customized',
  'csv_imported',
  'onboarding_completed',
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export interface IAnalyticsEvent {
  _id: string;
  userId: Types.ObjectId;
  event: AnalyticsEventType;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: String,
      enum: ANALYTICS_EVENT_TYPES,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'analytics_events',
  }
);

AnalyticsEventSchema.index({ event: 1, createdAt: -1 });
AnalyticsEventSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
