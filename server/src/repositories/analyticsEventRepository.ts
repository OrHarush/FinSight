import AnalyticsEvent, { AnalyticsEventType } from '../models/AnalyticsEvent';

export const insertEvent = async (
  event: AnalyticsEventType,
  userName: string,
  userAvatar: string,
) => {
  const doc = new AnalyticsEvent({ event, userName, userAvatar });

  return doc.save();
};

export const countByEvent = async (event: AnalyticsEventType, since?: Date): Promise<number> => {
  const filter: Record<string, unknown> = { event };

  if (since) {
    filter.createdAt = { $gte: since };
  }

  return AnalyticsEvent.countDocuments(filter);
};

export interface RecentActivityRow {
  userName: string;
  userAvatar: string;
  event: AnalyticsEventType;
  createdAt: Date;
}

export const findRecent = async (limit: number): Promise<RecentActivityRow[]> =>
  AnalyticsEvent.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('userName userAvatar event createdAt -_id')
    .lean();

export const findRecentBefore = async (
  cursor: Date | undefined,
  limit: number,
): Promise<RecentActivityRow[]> => {
  const filter = cursor ? { createdAt: { $lt: cursor } } : {};

  return AnalyticsEvent.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('userName userAvatar event createdAt -_id')
    .lean();
};
