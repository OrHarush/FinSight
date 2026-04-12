import { AnalyticsEventType } from '../models/AnalyticsEvent';
import User from '../models/User';
import * as analyticsEventRepository from '../repositories/analyticsEventRepository';
import { isExcludedEmail } from '../utils/excludedEmails';

export const track = async (userId: string, event: AnalyticsEventType) => {
  const user = await User.findById(userId).select('email').lean();

  if (user && isExcludedEmail(user.email)) {
    return;
  }

  return analyticsEventRepository.insertEvent(userId, event);
};

export const countByEvent = async (event: AnalyticsEventType, since?: Date) =>
  analyticsEventRepository.countByEvent(event, since);
