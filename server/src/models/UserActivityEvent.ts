import mongoose, { Schema, Types } from 'mongoose';

export type UserActivityType = 'LOGIN';

export interface IUserActivityEvent {
  _id: string;
  userId: Types.ObjectId;
  userName: string; // denormalized, for readability only
  type: UserActivityType;
  occurredAt: Date;
}

const UserActivityEventSchema = new Schema<IUserActivityEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['LOGIN'],
      required: true,
    },
    occurredAt: {
      type: Date,
      required: true,
      default: () => new Date(),
      index: true,
    },
  },
  {
    collection: 'user_activity_events',
  }
);

UserActivityEventSchema.index({ userId: 1, occurredAt: -1 });

export default mongoose.model<IUserActivityEvent>('UserActivityEvent', UserActivityEventSchema);
