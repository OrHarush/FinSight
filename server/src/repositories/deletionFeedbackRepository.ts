import DeletionFeedback, { IDeletionFeedback } from '../models/DeletionFeedback';

export const insert = (payload: Partial<IDeletionFeedback>) => DeletionFeedback.create(payload);

export const findRecent = (limit = 100) =>
  DeletionFeedback.find().sort({ createdAt: -1 }).limit(limit).lean();
