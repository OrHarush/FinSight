import { ANALYTICS_EVENT_TYPES, AnalyticsEventType } from '../models/AnalyticsEvent';
import * as analyticsEventRepository from '../repositories/analyticsEventRepository';
import { RecentActivityRow } from '../repositories/analyticsEventRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import * as userActivityRepository from '../repositories/userActivityRepository';
import * as userRepository from '../repositories/userRepository';
import { isExcludedEmail } from '../utils/excludedEmails';

const DAY_MS = 24 * 60 * 60 * 1000;

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

export interface AnalyticsOverview {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  dau: number;
  wau: number;
  mau: number;
  activatedUsers: number;
  activationRate: number;
  usersWithTransactions: number;
  eventCounts: Record<AnalyticsEventType, number>;
}

export interface RecentActivityPage {
  items: RecentActivityRow[];
  nextCursor: string | null;
}

export interface AdminUserDto {
  id: string;
  name: string;
  email: string;
  picture?: string;
  createdAt: Date;
  totalTransactions: number;
  lastActiveAt?: Date;
  hasCompletedOnboarding: boolean;
}

export const getAllUsers = async (): Promise<AdminUserDto[]> => {
  const [users, countsByUser] = await Promise.all([
    userRepository.findAllForAdmin(),
    transactionRepository.countGroupedByUser(),
  ]);

  const countByUserId = new Map(countsByUser.map(c => [c.userId, c.count]));

  return users.map(u => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    picture: u.picture,
    createdAt: u.createdAt,
    totalTransactions: countByUserId.get(u._id.toString()) ?? 0,
    lastActiveAt: u.lastActiveAt,
    hasCompletedOnboarding: u.hasCompletedOnboarding,
  }));
};

export const getRecentActivity = async (
  cursor: string | undefined,
  limit: number,
): Promise<RecentActivityPage> => {
  const cursorDate = cursor ? new Date(cursor) : undefined;
  const items = await analyticsEventRepository.findRecentBefore(cursorDate, limit);

  const nextCursor =
    items.length === limit ? items[items.length - 1].createdAt.toISOString() : null;

  return { items, nextCursor };
};

export const getAnalytics = async (): Promise<AnalyticsOverview> => {
  const now = Date.now();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const since24h = new Date(now - DAY_MS);
  const since7d = new Date(now - 7 * DAY_MS);
  const since30d = new Date(now - 30 * DAY_MS);

  const [
    totalUsers,
    newUsersToday,
    newUsersThisWeek,
    newUsersThisMonth,
    dau,
    wau,
    mau,
    activatedUsers,
    usersWithTransactions,
    ...eventCountValues
  ] = await Promise.all([
    userRepository.countAll(),
    userRepository.countCreatedSince(startOfToday),
    userRepository.countCreatedSince(since7d),
    userRepository.countCreatedSince(since30d),
    userRepository.countActiveSince(since24h),
    userRepository.countActiveSince(since7d),
    userRepository.countActiveSince(since30d),
    userRepository.countActivated(),
    transactionRepository.countDistinctUsers(),
    ...ANALYTICS_EVENT_TYPES.map(event => analyticsEventRepository.countByEvent(event)),
  ]);

  const eventCounts = Object.fromEntries(
    ANALYTICS_EVENT_TYPES.map((event, i) => [event, eventCountValues[i]])
  ) as Record<AnalyticsEventType, number>;

  const activationRate = totalUsers > 0
    ? Math.round((activatedUsers / totalUsers) * 100) / 100
    : 0;

  return {
    totalUsers,
    newUsersToday,
    newUsersThisWeek,
    newUsersThisMonth,
    dau,
    wau,
    mau,
    activatedUsers,
    activationRate,
    usersWithTransactions,
    eventCounts,
  };
};

export const recordLoginEvent = async (user: { id: string; email: string; name: string }) => {
  if (isExcludedEmail(user.email)) {
    return;
  }

  try {
    await userActivityRepository.createLoginEvent(user.id, user.name);
  } catch (err) {
    console.error('Failed to record login admin activity:', err);
  }
};

// Audit-class event. Intentionally BLOCKING (no try/catch) and intentionally
// NOT filtered by isExcludedEmail — admin actions on real prod data must
// always be auditable, even for excluded accounts.
export const recordDbBackupExport = async (userId: string) => {
  const user = await userRepository.findById(userId);
  await userActivityRepository.createEvent(userId, user?.name ?? '', 'DB_BACKUP_EXPORTED');
};
