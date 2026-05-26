import mongoose, { Schema, Types } from 'mongoose';

export type FeedbackType = 'feedback' | 'bug' | 'idea';
export type FeedbackVariant = 'manual' | 'popup';

export interface IFeedback {
  type: FeedbackType;
  message: string;
  userId: Types.ObjectId;
  variant: FeedbackVariant;
  route: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    type: { type: String, enum: ['feedback', 'bug', 'idea'], required: true, default: 'feedback' },
    message: { type: String, required: true, maxlength: 1000, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    variant: { type: String, enum: ['manual', 'popup'], required: true, default: 'manual' },
    route: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

FeedbackSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
