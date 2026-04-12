import mongoose, { Schema, Types } from 'mongoose';

export const ANALYTICS_EVENT_TYPES = [
  'transaction_created',
  'recurring_created',
  'category_customized',
  'csv_imported',
  'onboarding_completed',
  'user_created',
  'user_deleted',
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export interface IAnalyticsEvent {
  _id: string;
  event: AnalyticsEventType;
  userName: string;
  userAvatar: string;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    event: {
      type: String,
      enum: ANALYTICS_EVENT_TYPES,
      required: true,
    },
    userName: {
      type: String,
      default: '',
    },
    userAvatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'analytics_events',
  }
);

AnalyticsEventSchema.index({ event: 1, createdAt: -1 });

export default mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
