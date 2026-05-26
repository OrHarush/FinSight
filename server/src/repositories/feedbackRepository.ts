import { Types } from 'mongoose';

import Feedback, { FeedbackType, FeedbackVariant } from '../models/Feedback';

interface InsertFeedbackInput {
  type: FeedbackType;
  message: string;
  userId: string;
  variant: FeedbackVariant;
  route: string;
}

export const insert = async (data: InsertFeedbackInput) =>
  Feedback.create({ ...data, userId: new Types.ObjectId(data.userId) });
