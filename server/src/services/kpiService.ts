import * as userActivityRepository from '../repositories/userActivityRepository';
import * as userRepository from '../repositories/userRepository';

const DAY_MS = 24 * 60 * 60 * 1000;
const EXCLUDED_EMAILS = [
  'orharush24@gmail.com',
  'finsight.dev@gmail.com',
  'orrh2410@gmail.com',
  'orharush@mail.tau.ac.il',
];

export interface KpiOverview {
  dau: number;
  avgLogins30d: number;
  activeLast7dPercent: number;
}

export const getKpiOverview = async (): Promise<KpiOverview> => {
  const now = Date.now();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const since7d = new Date(now - 7 * DAY_MS);
  const since30d = new Date(now - 30 * DAY_MS);

  const [dau, avgLogins30d, activeUserIds, totalUsers] = await Promise.all([
    userActivityRepository.countDistinctUsersSince(startOfToday),
    userActivityRepository.avgLoginsPerUserSince(since30d),
    userActivityRepository.findDistinctActiveUserIdsSince(since7d),
    userRepository.countAll(),
  ]);

  const activeLast7dPercent =
    totalUsers === 0 ? 0 : Math.round((activeUserIds.length / totalUsers) * 100);

  return {
    dau,
    avgLogins30d: Math.round(avgLogins30d * 100) / 100,
    activeLast7dPercent,
  };
};

export const recordLoginEvent = async (user: { id: string; email: string; name: string }) => {
  if (EXCLUDED_EMAILS.includes(user.email)) {
    return;
  }

  try {
    await userActivityRepository.createLoginEvent(user.id, user.name);
  } catch (err) {
    console.error('Failed to record login KPI event:', err);
  }
};
