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
  totalUsers: number;
  activeLast7d: number;
}

export const getKpiOverview = async (): Promise<KpiOverview> => {
  const now = Date.now();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const since7d = new Date(now - 7 * DAY_MS);

  const [dau, activeUserIds, totalUsers] = await Promise.all([
    userActivityRepository.countDistinctUsersSince(startOfToday),
    userActivityRepository.findDistinctActiveUserIdsSince(since7d),
    userRepository.countAll(),
  ]);

  return {
    dau,
    totalUsers,
    activeLast7d: activeUserIds.length,
  };
};

export interface LoginEventDto {
  userId: string;
  username: string;
  occurredAt: Date;
  picture?: string;
}

export const getLoginEvents = async (days: number): Promise<LoginEventDto[]> => {
  const since = new Date(Date.now() - days * DAY_MS);

  const events = await userActivityRepository.findLoginEventsWithPictureSince(since);

  return events.map((e) => ({
    userId: e.userId.toString(),
    username: e.userName,
    occurredAt: e.occurredAt,
    picture: e.picture,
  }));
};

export const recordLoginEvent = async (user: { id: string; email: string; name: string }) => {
  if (EXCLUDED_EMAILS.includes(user.email)) {
    return;
  }

  try {
    await userActivityRepository.createLoginEvent(user.id, user.name);
  } catch (err) {
    console.error('Failed to record login admin activity:', err);
  }
};
