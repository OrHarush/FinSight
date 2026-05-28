import { ClientSession, Types } from 'mongoose';

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

export const anonymizeByUser = (userId: string, session?: ClientSession) =>
  Feedback.updateMany(
    { userId: new Types.ObjectId(userId) },
    { $set: { userId: null } },
  ).session(session ?? null);
