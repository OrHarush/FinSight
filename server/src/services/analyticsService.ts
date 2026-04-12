import { AnalyticsEventType } from '../models/AnalyticsEvent';
import User from '../models/User';
import * as analyticsEventRepository from '../repositories/analyticsEventRepository';
import { isExcludedEmail } from '../utils/excludedEmails';

export const track = async (userId: string, event: AnalyticsEventType) => {
  const user = await User.findById(userId).select('email name picture').lean();

  if (user && isExcludedEmail(user.email)) {
    return;
  }

  return analyticsEventRepository.insertEvent(
    event,
    user?.name ?? '',
    user?.picture ?? '',
  );
};

export const countByEvent = async (event: AnalyticsEventType, since?: Date) =>
  analyticsEventRepository.countByEvent(event, since);
